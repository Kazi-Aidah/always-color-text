/**
 * Shipped defaults: what a fresh vault (and the "reset built-in presets"
 * action) starts with.
 */

import { describe, it, expect } from "vitest";

import { defaultSettings } from "./defaultSettings.js";

const presets = defaultSettings.textStylePresets;

describe("built-in text style presets", () => {
  it("carry their own channel colours instead of rendering empty", () => {
    expect(presets.length).toBeGreaterThan(0);
    for (const p of presets) {
      expect(p.textColor).toBe("var(--text-normal)");
      expect(p.backgroundColor).toBe("var(--color-accent)");
    }
  });

  it("keep the highlight colortype the accent border follows", () => {
    for (const p of presets) expect(p.styleType).toBe("highlight");
  });
});

describe("link settings", () => {
  it("swatch and preset updates travel to their targets by default", () => {
    expect(defaultSettings.linkSwatchUpdatesToEntries).toBe(true);
    expect(defaultSettings.linkPresetUpdatesToEntries).toBe(true);
  });
});
