/**
 * Feature: link-preset-updates-to-entries
 *
 * Editing a text style preset must restyle the entries that use it — but only
 * those, and only the way a manual "apply this preset" would: shape always,
 * colors only for entries that have none of their own, custom CSS only when
 * the preset actually carries one.
 */

import { describe, it, expect } from "vitest";

import {
  PRESET_STYLE_FIELDS,
  PRESET_SHAPE_FIELDS,
  presetSignature,
  entriesUsingPreset,
  groupsUsingPreset,
  applyPresetStyleToEntry,
  applyPresetShapeToGroup,
  adoptPresetColortype,
  propagatePresetToEntries,
} from "./presetLinker.js";

const basePreset = {
  uid: "tsp-1",
  name: "Sunset",
  styleType: "highlight",
  backgroundOpacity: 40,
  highlightBorderRadius: 6,
  cornerShape: "rounded",
  highlightHorizontalPadding: 4,
  highlightVerticalPadding: 2,
  enableBorderThickness: false,
  borderStyle: "solid",
  borderLineStyle: "solid",
  borderOpacity: 100,
  borderThickness: 1,
  textColor: "#fa8231",
  backgroundColor: "#ff5c8a",
};

/** An entry carrying exactly the shape basePreset has (a pre-uid legacy entry). */
const legacyEntry = (uid = "e1", over = {}) => {
  const e = { uid };
  for (const k of PRESET_STYLE_FIELDS) e[k] = basePreset[k];
  return Object.assign(e, over);
};

function makeSettings(extra = {}) {
  return {
    wordEntries: [],
    textBgColoringEntries: [],
    wordEntryGroups: [],
    ...extra,
  };
}

describe("presetSignature", () => {
  it("ignores colors and identity fields", () => {
    const a = presetSignature(basePreset);
    const b = presetSignature({
      ...basePreset,
      uid: "tsp-2",
      name: "Other",
      textColor: "#000000",
      backgroundColor: "#ffffff",
      customCss: "color: red;",
    });
    expect(a).toBe(b);
  });

  it("changes when any shape field changes", () => {
    const before = presetSignature(basePreset);
    expect(presetSignature({ ...basePreset, highlightBorderRadius: 12 })).not.toBe(
      before,
    );
    expect(presetSignature({ ...basePreset, styleType: "text" })).not.toBe(before);
  });

  it("treats missing fields as undefined on both sides", () => {
    expect(presetSignature({})).toBe(presetSignature(undefined));
    expect(presetSignature({ styleType: "text" })).not.toBe(presetSignature({}));
  });
});

describe("entriesUsingPreset", () => {
  it("finds entries stamped with the preset uid, wherever they live", () => {
    const stamped = { uid: "e1", presetUid: "tsp-1", highlightBorderRadius: 99 };
    const s = makeSettings({
      wordEntries: [stamped],
      textBgColoringEntries: [{ uid: "e2", presetUid: "tsp-1" }],
      wordEntryGroups: [{ entries: [{ uid: "e3", presetUid: "tsp-1" }] }],
    });
    const found = entriesUsingPreset(s, basePreset, presetSignature(basePreset), [
      basePreset,
    ]);
    expect(found.map((e) => e.uid)).toEqual(["e1", "e2", "e3"]);
  });

  it("falls back to the pre-edit style signature when the entry is unstamped", () => {
    const legacy = legacyEntry();
    const s = makeSettings({ wordEntries: [legacy] });
    const found = entriesUsingPreset(
      s,
      { ...basePreset, backgroundOpacity: 80 },
      presetSignature(basePreset),
      [basePreset],
    );
    expect(found).toEqual([legacy]);
  });

  it("never claims an entry that is stamped with another preset", () => {
    const other = { uid: "e1", presetUid: "tsp-9", styleType: "highlight" };
    const s = makeSettings({ wordEntries: [other] });
    const found = entriesUsingPreset(s, basePreset, presetSignature(basePreset), [
      basePreset,
    ]);
    expect(found).toEqual([]);
  });

  it("refuses legacy matching when another preset shares the old shape", () => {
    const round = { ...basePreset, uid: "tsp-2", name: "Round" };
    const legacy = legacyEntry();
    const s = makeSettings({ wordEntries: [legacy] });

    // Both presets still hold the shared shape → ambiguous.
    expect(
      entriesUsingPreset(s, basePreset, presetSignature(basePreset), [
        basePreset,
        round,
      ]),
    ).toEqual([]);

    // The edited preset moved to a new shape while the other still holds the
    // old one → still ambiguous (this is the Default/Round trap).
    const edited = { ...basePreset, highlightBorderRadius: 20 };
    expect(
      entriesUsingPreset(s, edited, presetSignature(basePreset), [
        edited,
        round,
      ]),
    ).toEqual([]);

    // …and the same entry is found again once no other preset shares it.
    expect(
      entriesUsingPreset(s, edited, presetSignature(basePreset), [edited]),
    ).toEqual([legacy]);
  });

  it("matches an entry whose shape fields were dropped as global defaults", () => {
    // Persistence drops per-entry fields equal to the globals, while the
    // preset spells them out — the signatures must still line up.
    const s = makeSettings({
      backgroundOpacity: 40,
      highlightBorderRadius: 6,
      cornerShape: "rounded",
      highlightHorizontalPadding: 4,
      highlightVerticalPadding: 2,
      enableBorderThickness: false,
      borderStyle: "solid",
      borderLineStyle: "solid",
      borderOpacity: 100,
      borderThickness: 1,
      wordEntries: [{ uid: "e1", styleType: "highlight" }],
    });
    const prevSig = presetSignature(basePreset, s);
    const found = entriesUsingPreset(
      s,
      { ...basePreset, backgroundOpacity: 80 },
      prevSig,
      [basePreset],
    );
    expect(found.map((e) => e.uid)).toEqual(["e1"]);
  });

  it("treats the global-style copy of the default preset as that preset", () => {
    const legacy = legacyEntry();
    const s = makeSettings({ wordEntries: [legacy] });
    // _editGlobalStyle propagates a copy carrying the default preset's uid.
    const globalCopy = { ...basePreset };
    const found = entriesUsingPreset(
      s,
      globalCopy,
      presetSignature(basePreset),
      [basePreset],
    );
    expect(found).toEqual([legacy]);
  });
});

describe("applyPresetStyleToEntry", () => {
  it("always copies the shape and stamps the preset uid", () => {
    const entry = {
      uid: "e1",
      styleType: "highlight",
      backgroundOpacity: 10,
      highlightBorderRadius: 1,
      color: "#123456",
      backgroundColor: "#654321",
    };
    const changed = applyPresetStyleToEntry(entry, basePreset);
    expect(changed).toBe(true);
    expect(entry.highlightBorderRadius).toBe(6);
    expect(entry.backgroundOpacity).toBe(40);
    expect(entry.presetUid).toBe("tsp-1");
    // Own colors survive a shape-only propagation.
    expect(entry.color).toBe("#123456");
    expect(entry.backgroundColor).toBe("#654321");
  });

  it("gives a colorless entry the preset's colors and style type", () => {
    const entry = { uid: "e1" };
    applyPresetStyleToEntry(entry, basePreset, (c) => /^#[0-9a-f]{6}$/i.test(c));
    expect(entry.styleType).toBe("highlight");
    expect(entry.textColor).toBe("#fa8231");
    expect(entry.backgroundColor).toBe("#ff5c8a");
    expect(entry.color).toBe("");
  });

  it("copies the preset's custom CSS only when the preset has one", () => {
    const withCss = { uid: "e1", customCss: "font-size: 18px;" };
    applyPresetStyleToEntry(withCss, { ...basePreset, customCss: "letter-spacing: 2px;" });
    expect(withCss.customCss).toBe("letter-spacing: 2px;");

    const own = { uid: "e2", customCss: "font-size: 18px;" };
    applyPresetStyleToEntry(own, basePreset); // preset carries no CSS
    expect(own.customCss).toBe("font-size: 18px;");
  });

  it("returns false when nothing changed", () => {
    const entry = { ...basePreset, presetUid: "tsp-1" };
    expect(applyPresetStyleToEntry(entry, basePreset)).toBe(false);
  });
});

describe("propagatePresetToEntries", () => {
  it("updates every linked entry and reports how many changed", () => {
    const s = makeSettings({
      wordEntries: [
        { uid: "linked", presetUid: "tsp-1", highlightBorderRadius: 1 },
        { uid: "stranger", presetUid: "tsp-9", highlightBorderRadius: 1 },
      ],
      wordEntryGroups: [
        { entries: [{ uid: "inGroup", presetUid: "tsp-1", highlightBorderRadius: 1 }] },
      ],
    });
    const edited = { ...basePreset, highlightBorderRadius: 30 };
    const count = propagatePresetToEntries(s, edited, presetSignature(basePreset), [
      edited,
    ]);
    expect(count).toBe(2);
    expect(s.wordEntries[0].highlightBorderRadius).toBe(30);
    expect(s.wordEntries[1].highlightBorderRadius).toBe(1);
    expect(s.wordEntryGroups[0].entries[0].highlightBorderRadius).toBe(30);
  });

  it("tolerates malformed input", () => {
    expect(propagatePresetToEntries(null, basePreset, "", [])).toBe(0);
    expect(propagatePresetToEntries(makeSettings(), null, "", [])).toBe(0);
    const s = makeSettings({ wordEntries: [null, undefined] });
    expect(propagatePresetToEntries(s, basePreset, "", [basePreset])).toBe(0);
  });
});

describe("adoptPresetColortype", () => {
  const valid = (c) =>
    c === "currentColor" ||
    c === "inherit" ||
    /^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(String(c || "")) ||
    /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(String(c || ""));

  const colourOnlyEntry = () => ({
    uid: "e1",
    styleType: "text",
    color: "#123456",
    textColor: "#123456",
  });

  it("returns false when the preset carries no colortype", () => {
    const entry = colourOnlyEntry();
    expect(adoptPresetColortype(entry, { uid: "x" }, valid)).toBe(false);
    expect(entry.styleType).toBe("text");
  });

  it("adopts the preset's colortype even when the entry has colours", () => {
    const entry = colourOnlyEntry();
    const preset = {
      styleType: "highlight",
      textColor: "currentColor",
      backgroundColor: "#ff5c8a",
    };
    expect(adoptPresetColortype(entry, preset, valid)).toBe(true);
    expect(entry.styleType).toBe("highlight");
    // The missing channel comes from the preset; the entry's own colour stays.
    expect(entry.backgroundColor).toBe("#ff5c8a");
    expect(entry.color).toBe("#123456");
    expect(entry.textColor).toBe("#123456");
  });

  it("duplicates the entry's own colour when the preset has none", () => {
    const entry = colourOnlyEntry();
    const preset = { styleType: "highlight", textColor: "currentColor", backgroundColor: "" };
    adoptPresetColortype(entry, preset, valid);
    expect(entry.backgroundColor).toBe("#123456");
  });

  it("falls back to the accent when nothing holds a background", () => {
    const entry = { uid: "e1" };
    const preset = { styleType: "highlight", textColor: "currentColor", backgroundColor: "" };
    expect(adoptPresetColortype(entry, preset, valid)).toBe(true);
    expect(entry.styleType).toBe("highlight");
    expect(entry.backgroundColor).toBe("var(--color-accent)");
  });

  it("keeps a theme-default text colour out of the highlight", () => {
    // `var(--text-normal)` paints the text channel but was never chosen, so
    // it must not be duplicated into the background the way a picked colour is.
    const entry = {
      uid: "e1",
      styleType: "text",
      color: "var(--text-normal)",
      textColor: "var(--text-normal)",
    };
    const preset = { styleType: "highlight", textColor: "var(--text-normal)" };
    expect(adoptPresetColortype(entry, preset, valid)).toBe(true);
    expect(entry.styleType).toBe("highlight");
    expect(entry.backgroundColor).toBe("var(--color-accent)");
  });

  it("leaves a channel the entry already paints untouched", () => {
    const entry = {
      uid: "e1",
      styleType: "highlight",
      textColor: "currentColor",
      backgroundColor: "#00ff00",
    };
    const preset = { styleType: "highlight", backgroundColor: "#ff0000" };
    expect(adoptPresetColortype(entry, preset, valid)).toBe(false);
    expect(entry.backgroundColor).toBe("#00ff00");
  });

  it("promotion to a text colortype paints the text channel too", () => {
    const entry = { uid: "e1", styleType: "highlight", backgroundColor: "#00ff00" };
    const preset = { styleType: "text", textColor: "#123456" };
    adoptPresetColortype(entry, preset, valid);
    expect(entry.styleType).toBe("text");
    expect(entry.textColor).toBe("#123456");
    expect(entry.color).toBe("#123456");
    // The background is the entry's own data — never wiped.
    expect(entry.backgroundColor).toBe("#00ff00");
  });
});

describe("applyPresetStyleToEntry adopts the preset's colortype", () => {
  it("a colour-carrying entry follows the preset's styleType and channels", () => {
    const entry = {
      uid: "e1",
      styleType: "text",
      color: "#123456",
      textColor: "#123456",
    };
    const changed = applyPresetStyleToEntry(entry, basePreset, (c) =>
      /^#[0-9a-f]{6}$/i.test(c),
    );
    expect(changed).toBe(true);
    expect(entry.styleType).toBe("highlight");
    expect(entry.color).toBe("#123456");
    expect(entry.backgroundColor).toBe("#ff5c8a");
    expect(entry.presetUid).toBe("tsp-1");
  });
});

describe("group propagation", () => {
  /** A Per-Entry group carrying the preset stamp — the case users hit. */
  const stampedGroup = (over = {}) => {
    const g = {
      uid: "g1",
      presetUid: "tsp-1",
      styleType: "", // Per-Entry: members keep their own colours
      textColor: "#111111",
      backgroundColor: "#222222",
      backgroundOpacity: 40,
      highlightBorderRadius: 6,
      entries: [{ uid: "m1", textColor: "#333333" }],
    };
    return Object.assign(g, over);
  };

  /** A group carrying exactly the shape basePreset has (no stamp yet). */
  const shapedGroup = (over = {}) => {
    const g = { uid: "g2", styleType: basePreset.styleType };
    for (const k of PRESET_SHAPE_FIELDS) g[k] = basePreset[k];
    return Object.assign(g, over);
  };

  it("reshapes the group without touching its colortype or colours", () => {
    const s = makeSettings({ wordEntryGroups: [stampedGroup()] });
    const edited = {
      ...basePreset,
      highlightBorderRadius: 30,
      styleType: "both",
      textColor: "#00ff00",
      backgroundColor: "#0000ff",
    };
    const count = propagatePresetToEntries(s, edited, presetSignature(basePreset), [
      edited,
    ]);
    const group = s.wordEntryGroups[0];
    expect(count).toBe(1);
    expect(group.highlightBorderRadius).toBe(30);
    // The colortype is the user's decision (Per-Entry must survive) and the
    // group's colours are never wiped.
    expect(group.styleType).toBe("");
    expect(group.textColor).toBe("#111111");
    expect(group.backgroundColor).toBe("#222222");
    // Members inherit the group's layout at compile, so they are not rewritten.
    expect(group.entries[0].highlightBorderRadius).toBeUndefined();
    expect(group.entries[0].textColor).toBe("#333333");
  });

  it("stamps and reshapes an un-stamped group with the preset's old shape", () => {
    const group = shapedGroup();
    const s = makeSettings({ wordEntryGroups: [group] });
    const edited = { ...basePreset, highlightBorderRadius: 30 };
    expect(
      groupsUsingPreset(s, edited, presetSignature(basePreset), [edited]),
    ).toEqual([group]);
    propagatePresetToEntries(s, edited, presetSignature(basePreset), [edited]);
    expect(group.presetUid).toBe("tsp-1");
    expect(group.highlightBorderRadius).toBe(30);
  });

  it("leaves a group linked to another preset alone", () => {
    const group = shapedGroup({ presetUid: "tsp-9" });
    const s = makeSettings({ wordEntryGroups: [group] });
    const edited = { ...basePreset, highlightBorderRadius: 30 };
    expect(
      propagatePresetToEntries(s, edited, presetSignature(basePreset), [
        edited,
      ]),
    ).toBe(0);
    expect(group.highlightBorderRadius).toBe(basePreset.highlightBorderRadius);
    expect(group.presetUid).toBe("tsp-9");
  });

  it("never copies the preset's colortype onto a group", () => {
    expect(PRESET_SHAPE_FIELDS).not.toContain("styleType");
    const group = { uid: "g3", presetUid: "tsp-1", styleType: "" };
    expect(applyPresetShapeToGroup(group, { ...basePreset, styleType: "text" })).toBe(
      true,
    );
    expect(group.styleType).toBe("");
    expect(group.textColor).toBeUndefined();
    expect(group.backgroundColor).toBeUndefined();
    // Nothing changes when the group already carries the shape and the stamp.
    const shaped = { uid: "g4", presetUid: "tsp-1" };
    for (const k of PRESET_SHAPE_FIELDS) shaped[k] = basePreset[k];
    expect(applyPresetShapeToGroup(shaped, basePreset)).toBe(false);
  });

  it("tolerates malformed input", () => {
    expect(applyPresetShapeToGroup(null, basePreset)).toBe(false);
    expect(applyPresetShapeToGroup({ uid: "g" }, null)).toBe(false);
    expect(groupsUsingPreset(null, basePreset, "", [])).toEqual([]);
    expect(groupsUsingPreset(makeSettings(), null, "", [])).toEqual([]);
  });
});
