/**
 * Saved-but-unedited Custom CSS is just a snapshot of the old shape — it
 * must not shadow later Style preset applications (saved CSS wins over
 * structured fields at render time). CSS the user actually authored is
 * sacred and stays.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  Menu: class {},
  FuzzySuggestModal: class {},
  Setting: class {},
  moment: () => {},
  setIcon: () => {},
}));

import {
  deriveHighlightCssFromEntry,
  isDerivedSnapshotCss,
} from "../CustomCssModal.js";
import { EditEntryModal } from "../EditEntryModal.js";

const plugin = {
  settings: {
    backgroundOpacity: 35,
    highlightBorderRadius: 4,
    cornerShape: "round",
    highlightHorizontalPadding: 4,
    highlightVerticalPadding: 0,
    enableBorderThickness: false,
    borderStyle: "full",
    borderLineStyle: "solid",
    borderOpacity: 100,
    borderThickness: 1,
  },
  hexToRgba: (hex, op) => `rgba(${hex},${op})`,
  isValidHexColor: (hex) => {
    if (hex === "inherit" || hex === "currentColor") return true;
    if (typeof hex !== "string") return false;
    return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
  },
  sanitizeCssDeclarations: (s) => s,
  syncEntryCssFromColors: () => {},
};

const shapedEntry = (over = {}) => ({
  uid: "e1",
  pattern: "hello",
  styleType: "highlight",
  color: "",
  textColor: "currentColor",
  backgroundColor: "#3867d6",
  backgroundOpacity: 35,
  highlightBorderRadius: 4,
  cornerShape: "round",
  highlightHorizontalPadding: 4,
  highlightVerticalPadding: 0,
  enableBorderThickness: false,
  borderStyle: "full",
  borderLineStyle: "solid",
  borderOpacity: 100,
  borderThickness: 1,
  ...over,
});

const shapePreset = (over = {}) => ({
  uid: "tsp-n",
  name: "N",
  styleType: "highlight",
  backgroundOpacity: 50,
  highlightBorderRadius: 12,
  cornerShape: "round",
  highlightHorizontalPadding: 4,
  highlightVerticalPadding: 0,
  enableBorderThickness: false,
  borderStyle: "full",
  borderLineStyle: "solid",
  borderOpacity: 100,
  borderThickness: 1,
  ...over,
});

function applyPreset(entry, preset) {
  const modal = Object.create(EditEntryModal.prototype);
  modal.app = {};
  modal.plugin = plugin;
  modal.entry = entry;
  modal.onSaved = null;
  modal._applyPreset(preset);
}

describe("isDerivedSnapshotCss", () => {
  it("recognizes the verbatim derivation", () => {
    const entry = shapedEntry();
    const css = deriveHighlightCssFromEntry(entry, plugin);
    expect(css.length).toBeGreaterThan(0);
    expect(isDerivedSnapshotCss(css, entry, plugin)).toBe(true);
  });

  it("ignores whitespace reformatting", () => {
    const entry = shapedEntry();
    const css = deriveHighlightCssFromEntry(entry, plugin)
      .split(";")
      .join(" ;\n\n  ");
    expect(isDerivedSnapshotCss(css, entry, plugin)).toBe(true);
  });

  it("rejects authored CSS (extra property)", () => {
    const entry = shapedEntry();
    const css =
      deriveHighlightCssFromEntry(entry, plugin) + "\nfont-weight: bold;";
    expect(isDerivedSnapshotCss(css, entry, plugin)).toBe(false);
  });

  it("rejects changed values and &-blocks", () => {
    const entry = shapedEntry();
    expect(
      isDerivedSnapshotCss(
        "border-radius: 999px;",
        entry,
        plugin,
      ),
    ).toBe(false);
    expect(
      isDerivedSnapshotCss(
        deriveHighlightCssFromEntry(entry, plugin) + "\n&:hover{color:red;}",
        entry,
        plugin,
      ),
    ).toBe(false);
  });

  it("is null-safe", () => {
    const entry = shapedEntry();
    expect(isDerivedSnapshotCss("", entry, plugin)).toBe(false);
    expect(isDerivedSnapshotCss(null, entry, plugin)).toBe(false);
    expect(isDerivedSnapshotCss("border-radius: 4px;", null, plugin)).toBe(
      false,
    );
  });
});

describe("preset application over saved CSS", () => {
  it("drops an unedited snapshot so the preset paints", () => {
    const entry = shapedEntry();
    entry.customCss = deriveHighlightCssFromEntry(entry, plugin);
    applyPreset(entry, shapePreset());
    expect(entry.highlightBorderRadius).toBe(12);
    expect(entry.backgroundOpacity).toBe(50);
    expect(entry.customCss).toBeUndefined();
  });

  it("keeps authored CSS while still applying shape", () => {
    const entry = shapedEntry();
    entry.customCss =
      deriveHighlightCssFromEntry(entry, plugin) + "\nfont-weight: bold;";
    applyPreset(entry, shapePreset());
    expect(entry.highlightBorderRadius).toBe(12);
    expect(entry.customCss).toContain("font-weight: bold;");
  });

  it("patches authored shape values forward (radius, padding, opacity)", () => {
    const entry = shapedEntry({ textColor: "#ff0000" });
    entry.customCss =
      "text-align: left;\n" + deriveHighlightCssFromEntry(entry, plugin);
    expect(entry.customCss).toContain("border-radius: 4px");
    applyPreset(entry, shapePreset());
    // User extras survive…
    expect(entry.customCss).toContain("text-align: left");
    // …but overlapping shape values move to the preset.
    expect(entry.customCss).toContain("border-radius: 12px");
    expect(entry.customCss).not.toContain("border-radius: 4px");
  });

  it("replaces the border side instead of stacking it", () => {
    const entry = shapedEntry({
      enableBorderThickness: true,
      borderThickness: 2,
      borderLineStyle: "solid",
      borderStyle: "full",
    });
    entry.customCss =
      "text-align: left;\nborder: 2px solid #3867d6;\nborder-radius: 4px;";
    applyPreset(
      entry,
      shapePreset({ borderStyle: "bottom", enableBorderThickness: true }),
    );
    const sides = String(entry.customCss)
      .split(";")
      .map((s) => s.trim())
      .filter((s) => /^border(-top|-bottom|-left|-right)?\s*:/.test(s));
    expect(sides.some((s) => s.startsWith("border-bottom"))).toBe(true);
    expect(sides.some((s) => /^border\s*:/.test(s))).toBe(false);
    expect(entry.customCss).toContain("text-align: left");
  });

  it("drops border declarations when the preset disables borders", () => {
    const entry = shapedEntry({
      enableBorderThickness: true,
      borderThickness: 2,
      borderLineStyle: "solid",
      borderStyle: "full",
    });
    entry.customCss = "border: 2px solid #3867d6;\nborder-radius: 4px;";
    applyPreset(entry, shapePreset({ enableBorderThickness: false }));
    const sides = String(entry.customCss)
      .split(";")
      .map((s) => s.trim())
      .filter((s) => /^border(-top|-bottom|-left|-right)?\s*:/.test(s));
    expect(sides).toEqual([]);
    expect(entry.enableBorderThickness).toBe(false);
  });

  it("keeps a preset's own CSS when it carries one", () => {
    const entry = shapedEntry();
    entry.customCss = deriveHighlightCssFromEntry(entry, plugin);
    applyPreset(entry, shapePreset({ customCss: "border-radius: 2px;" }));
    expect(entry.customCss).toBe("border-radius: 2px;");
  });
});
