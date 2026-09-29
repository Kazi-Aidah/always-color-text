import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  FuzzySuggestModal: class {},
  Menu: class {},
  setIcon: () => {},
}));

import {
  resolveRegexTesterDefaultPreset,
  resolveRegexTesterColorInit,
  resolveRegexTesterPreviewColors,
} from "../RealTimeRegexTesterModal.js";

const isValidHexColor = (hex) => {
  const trimmed = String(hex || "").trim();
  if (/^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(trimmed)) return true;
  if (trimmed.includes(";") || /!important/i.test(trimmed) || /\s/.test(trimmed))
    return false;
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(trimmed);
};

const baseArgs = (over = {}) => ({
  editingEntry: null,
  preFillTextColor: "",
  preFillBgColor: "",
  preFillStyleType: "both",
  presets: [],
  isValidHexColor,
  ...over,
});

const highlightDefault = {
  uid: "tsp-default",
  name: "Default",
  isDefault: true,
  styleType: "highlight",
  textColor: "var(--text-normal)",
  backgroundColor: "var(--color-accent)",
  backgroundOpacity: 40,
  highlightBorderRadius: 6,
};

describe("fresh regex tester opens with the default preset applied", () => {
  it("seeds the style holder + pickers from the default preset", () => {
    const seed = resolveRegexTesterDefaultPreset(
      baseArgs({ presets: [highlightDefault] }),
    );
    expect(seed).toBeTruthy();
    // Colortype follows the preset…
    expect(seed.styleType).toBe("highlight");
    // …the highlight channel carries a real, paintable colour…
    expect(seed.bgColor).toBe("var(--color-accent)");
    // …and the holder is linked to the preset (shape + presetUid).
    expect(seed.styleEntry.presetUid).toBe("tsp-default");
    expect(seed.styleEntry.styleType).toBe("highlight");
    expect(seed.styleEntry.backgroundOpacity).toBe(40);
    expect(seed.styleEntry.highlightBorderRadius).toBe(6);
    expect(seed.styleEntry.backgroundColor).toBe("var(--color-accent)");
    expect(seed.styleEntry.isRegex).toBe(true);
  });

  it("falls back to presets[0] when nothing is flagged isDefault", () => {
    const plain = { uid: "p1", styleType: "text", textColor: "#a3fff9" };
    const seed = resolveRegexTesterDefaultPreset(baseArgs({ presets: [plain] }));
    expect(seed.styleType).toBe("text");
    expect(seed.textColor).toBe("#a3fff9");
    expect(seed.bgColor).toBe("");
    expect(seed.styleEntry.presetUid).toBe("p1");
  });

  it("editing an existing entry → no seed (the entry's own style wins)", () => {
    expect(
      resolveRegexTesterDefaultPreset(
        baseArgs({
          editingEntry: { uid: "e1", pattern: "x" },
          presets: [highlightDefault],
        }),
      ),
    ).toBe(null);
  });

  it("colours staged by the caller → no seed (an explicit pick wins)", () => {
    expect(
      resolveRegexTesterDefaultPreset(
        baseArgs({
          preFillTextColor: "#ff0000",
          presets: [highlightDefault],
        }),
      ),
    ).toBe(null);
    expect(
      resolveRegexTesterDefaultPreset(
        baseArgs({
          preFillBgColor: "#00ff00",
          presets: [highlightDefault],
        }),
      ),
    ).toBe(null);
  });

  it("no presets at all → no seed", () => {
    expect(resolveRegexTesterDefaultPreset(baseArgs())).toBe(null);
    expect(
      resolveRegexTesterDefaultPreset(baseArgs({ presets: [null] })),
    ).toBe(null);
  });

  it("a default preset with no background still gets a paintable channel", () => {
    const blank = {
      uid: "tsp-blank",
      isDefault: true,
      styleType: "highlight",
      textColor: "currentColor",
      backgroundColor: "",
    };
    const seed = resolveRegexTesterDefaultPreset(
      baseArgs({ presets: [blank] }),
    );
    expect(seed).toBeTruthy();
    // adoptPresetColortype guarantees the highlight never renders blank.
    expect(seed.bgColor).toBe("var(--color-accent)");
    expect(seed.styleEntry.presetUid).toBe("tsp-blank");
  });

  it("the seeded colours clear the preview's colour gate (matches paint)", () => {
    const seed = resolveRegexTesterDefaultPreset(
      baseArgs({ presets: [highlightDefault] }),
    );
    const init = resolveRegexTesterColorInit({
      editingEntry: null,
      preFillTextColor: seed.textColor,
      preFillBgColor: seed.bgColor,
      isValidHexColor,
    });
    expect(init.bTouched).toBe(true);
    // Same inputs renderPreview feeds resolveRegexTesterPreviewColors.
    const pv = resolveRegexTesterPreviewColors({
      tRaw: init.preFillTextColor || "#000000",
      bRaw: init.preFillBgColor || "#000000",
      tTouched: init.tTouched,
      bTouched: init.bTouched,
      isValidHexColor,
      opacity: 50,
      hexToRgba: (hex, op) => `rgba(${hex},${op})`,
    });
    expect(pv.hasValidB).toBe(true);
    expect(pv.bgCss).toContain("var(--color-accent)");
    expect(pv.bgCss).not.toBe("rgba(#000000,50)");
  });
});
