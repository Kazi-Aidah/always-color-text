/**
 * A word group carrying a STYLE PRESET while its colortype is Per-Entry.
 *
 * Repro (live data.json): group "Terms" has presetUid "tsp-sharp-outline",
 * colortype Per-Entry, and members saved as colour-only ("text") or with no
 * colour at all. The preset's shape (opacity / radius / padding / border) is
 * a HIGHLIGHT style, so those members showed no highlight — and the colourless
 * one showed nothing at all.
 *
 * Correct behaviour: every member paints BOTH channels —
 *   - one channel present → the other channel takes that same colour;
 *   - neither channel     → the preset's colours, then the group's, then the
 *     theme accent on inherited text;
 *   - `currentColor` (inherit the theme text) is kept, never duplicated;
 *   - only colour-only members are promoted to "both".
 * Groups without a preset stamp, and groups that force a colortype, are
 * untouched.
 */

import { describe, it, expect } from "vitest";
import {
  compileWordEntriesLogic,
  compileTextBgColoringEntriesLogic,
  applyGroupPresetChannels,
} from "./patternCompiler.js";
import { defaultSettings } from "../settings/defaultSettings.js";

function makePlugin(settings) {
  return {
    settings,
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      const trimmed = hex.trim();
      if (/^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(trimmed)) return true;
      if (/\s/.test(trimmed)) return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(trimmed);
    },
    sanitizePattern: (p) => String(p || "").trim(),
    isKnownProblematicPattern: () => false,
    escapeRegex: (s) => String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    validateAndSanitizeRegex: () => true,
    createFastTester: () => () => true,
    _regexCache: {
      clear: () => {},
      getOrCreate: (pattern, flags) => new RegExp(pattern, flags),
    },
    _bloomFilter: null,
    _settingsIndex: null,
    _compiledWordEntries: [],
    _compiledTextBgEntries: [],
    _cachedSortedEntries: null,
    _cacheDirty: false,
    t: (k, d) => d,
  };
}

/** A preset that carries no colour of its own (custom presets can be saved like this). */
const colourlessPreset = {
  uid: "tsp-sharp-outline",
  name: "Sharp Outlined",
  styleType: "highlight",
  textColor: "currentColor",
  backgroundColor: "",
  backgroundOpacity: 25,
  highlightBorderRadius: 0,
};

const tintedPreset = {
  uid: "tsp-custom",
  name: "Custom",
  styleType: "highlight",
  textColor: "#fa8231",
  backgroundColor: "#3867d6",
  backgroundOpacity: 40,
};

/** A preset exactly as the plugin ships it (theme text + accent highlight). */
const shippedPreset = defaultSettings.textStylePresets.find(
  (p) => p && p.uid === "tsp-sharp-outline",
);

function makeSettings(group, entries, preset = colourlessPreset) {
  return {
    wordEntries: [],
    wordEntryGroups: [{ active: true, ...group, entries }],
    textStylePresets: preset ? [preset] : [],
    matchType: "contains",
    partialMatch: true,
    caseSensitive: false,
    disableRegexSafety: true,
    enableRegexSupport: false,
  };
}

function compileWord(group, entries, preset) {
  const plugin = makePlugin(makeSettings(group, entries, preset));
  compileWordEntriesLogic(plugin);
  return plugin._compiledWordEntries;
}

function compileTextBg(group, entries, preset) {
  const plugin = makePlugin(makeSettings(group, entries, preset));
  compileTextBgColoringEntriesLogic(plugin);
  return plugin._compiledTextBgEntries;
}

const perEntryGroup = (over = {}) => ({
  uid: "g-terms",
  name: "Terms",
  presetUid: "tsp-sharp-outline",
  backgroundOpacity: 25,
  highlightBorderRadius: 0,
  ...over,
});

describe("colour-only member of a preset group gains the highlight", () => {
  const entry = {
    pattern: "phishing",
    color: "#eb3b5a",
    textColor: "#eb3b5a",
    styleType: "text",
  };

  it("is compiled on the text+bg channel with both channels painted", () => {
    const compiled = compileTextBg(perEntryGroup(), [entry]);
    expect(compiled).toHaveLength(1);
    expect(compiled[0].styleType).toBe("both");
    expect(compiled[0].textColor).toBe("#eb3b5a");
    // Own colour duplicated into the highlight (the preset has none).
    expect(compiled[0].backgroundColor).toBe("#eb3b5a");
    // The group's shape still drives the highlight.
    expect(compiled[0].backgroundOpacity).toBe(25);
  });

  it("leaves the stored entry object alone (only the compiled copy is painted)", () => {
    compileTextBg(perEntryGroup(), [entry]);
    expect(entry.styleType).toBe("text");
    expect(entry.backgroundColor).toBeUndefined();
  });

  it("leaves the colour-only member out of the word channel", () => {
    expect(compileWord(perEntryGroup(), [entry])).toHaveLength(0);
  });
});

describe("colourless member of a preset group is never invisible", () => {
  const entry = { pattern: "spoofing", color: "", styleType: "text" };

  it("falls back to the theme accent when the preset carries no colour", () => {
    const compiled = compileTextBg(perEntryGroup(), [entry]);
    expect(compiled).toHaveLength(1);
    // No colour of its own → the preset's colortype paints it, so the border
    // follows the accent background rather than the theme text.
    expect(compiled[0].styleType).toBe("highlight");
    expect(compiled[0].backgroundColor).toBe("var(--color-accent)");
    expect(compiled[0].textColor).toBe("currentColor");
  });

  it("takes the preset's colours when the preset carries them", () => {
    const compiled = compileTextBg(
      perEntryGroup({ presetUid: tintedPreset.uid }),
      [entry],
      tintedPreset,
    );
    expect(compiled[0].textColor).toBe("#fa8231");
    expect(compiled[0].backgroundColor).toBe("#3867d6");
  });

  it("takes a shipped preset's own channel defaults", () => {
    const compiled = compileTextBg(perEntryGroup(), [entry], shippedPreset);
    expect(compiled[0].textColor).toBe("var(--text-normal)");
    expect(compiled[0].backgroundColor).toBe("var(--color-accent)");
    expect(compiled[0].styleType).toBe("highlight");
  });

  it("never turns the default text colour into a background", () => {
    // Entries saved through the editor carry the default preset's text colour.
    // It paints the text channel but was never chosen, so it must not be
    // duplicated into the highlight the way a picked colour is.
    const entryWithDefaultText = {
      pattern: "invoice",
      color: "var(--text-normal)",
      styleType: "text",
    };
    const compiled = compileTextBg(perEntryGroup(), [entryWithDefaultText], shippedPreset);
    expect(compiled[0].textColor).toBe("var(--text-normal)");
    expect(compiled[0].backgroundColor).toBe("var(--color-accent)");
    expect(compiled[0].styleType).toBe("highlight");
  });
});

describe("members that already paint both channels keep their colortype", () => {
  it("a highlight member keeps `currentColor` text and its own background", () => {
    const entry = {
      pattern: "times",
      color: "",
      textColor: "currentColor",
      backgroundColor: "#990089",
      styleType: "highlight",
    };
    const compiled = compileTextBg(perEntryGroup(), [entry]);
    expect(compiled[0].styleType).toBe("highlight");
    expect(compiled[0].textColor).toBe("currentColor");
    expect(compiled[0].backgroundColor).toBe("#990089");
  });

  it("a both member is untouched", () => {
    const entry = {
      pattern: "datatype",
      color: "",
      textColor: "#87c760",
      backgroundColor: "#1d5010",
      styleType: "both",
    };
    const compiled = compileTextBg(perEntryGroup(), [entry]);
    expect(compiled[0].styleType).toBe("both");
    expect(compiled[0].textColor).toBe("#87c760");
    expect(compiled[0].backgroundColor).toBe("#1d5010");
  });
});

describe("only groups that carry a preset are painted", () => {
  it("a colour-only member of a preset-less group stays colour-only", () => {
    const entry = {
      pattern: "phishing",
      color: "#eb3b5a",
      textColor: "#eb3b5a",
      styleType: "text",
    };
    const group = { uid: "g1", name: "Plain" };
    expect(compileTextBg(group, [entry])).toHaveLength(0);
    expect(compileWord(group, [entry])).toHaveLength(1);
  });

  it("a group forcing a colortype keeps forcing it", () => {
    const entry = { pattern: "x", color: "#eb3b5a", styleType: "text" };
    const group = perEntryGroup({
      styleType: "highlight",
      backgroundColor: "#123456",
      textColor: "currentColor",
    });
    const compiled = compileTextBg(group, [entry]);
    expect(compiled[0].styleType).toBe("highlight");
    expect(compiled[0].backgroundColor).toBe("#123456");
  });
});

describe("applyGroupPresetChannels", () => {
  const valid = (c) =>
    c === "currentColor" ||
    c === "inherit" ||
    /^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(String(c || "")) ||
    /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(String(c || ""));

  it("returns false without a preset stamp or with an unknown preset", () => {
    const copy = { pattern: "x", styleType: "text", color: "#fff" };
    expect(applyGroupPresetChannels(copy, { presetUid: null }, {}, valid)).toBe(
      false,
    );
    expect(
      applyGroupPresetChannels(copy, { presetUid: "gone" }, {}, valid),
    ).toBe(false);
    expect(copy.backgroundColor).toBeUndefined();
  });

  it("duplicates the colour it has into the missing channel", () => {
    const copy = { pattern: "x", styleType: "text", color: "#0f0" };
    const changed = applyGroupPresetChannels(
      copy,
      { presetUid: "p1" },
      { textStylePresets: [{ uid: "p1", styleType: "highlight" }] },
      valid,
    );
    expect(changed).toBe(true);
    expect(copy.textColor).toBe("#0f0");
    expect(copy.backgroundColor).toBe("#0f0");
    expect(copy.styleType).toBe("both");
  });

  it("never repaints a markdown-element member (it is not a span highlight)", () => {
    const copy = {
      pattern: "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1",
      presetLabel: "Bold",
      styleType: "text",
      color: "#0f0",
    };
    expect(
      applyGroupPresetChannels(
        copy,
        { presetUid: "p1" },
        { textStylePresets: [{ uid: "p1", styleType: "highlight" }] },
        valid,
      ),
    ).toBe(false);
    expect(copy.backgroundColor).toBeUndefined();
    expect(copy.styleType).toBe("text");
  });
});
