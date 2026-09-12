/**
 * Fresh "+ Add word" entries have null colors. The Style Text modal may
 * suggest the default text-style preset in the pickers, but that suggestion
 * must never count as a real color — otherwise the preview renders the
 * preset (e.g. black from a clamped "currentColor") instead of the
 * var(--text-normal) / var(--color-accent) fallbacks. Pickers, entry fields
 * and saving are untouched by this: visual aid only.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  Menu: class {},
  FuzzySuggestModal: class {},
  setIcon: () => {},
}));

import { resolveEditEntryColorInit } from "../EditEntryModal.js";

const isValidHexColor = (hex) => {
  if (hex === "inherit" || hex === "currentColor") return true;
  if (typeof hex !== "string") return false;
  const trimmed = hex.trim();
  if (/^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(trimmed)) return true;
  if (trimmed.includes(";") || /!important/i.test(trimmed) || /\s/.test(trimmed))
    return false;
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(trimmed);
};

// Mirrors the modal's preview validity rule: touched counts only when it is a
// real user pick, never a preset suggestion.
function previewValid(init, touched) {
  const tTouched = touched && !init.presetPrefillText;
  const bTouched = touched && !init.presetPrefillBg;
  return {
    hasValidText: !!init.effectiveInitText && tTouched,
    hasValidBg: !!init.effectiveInitBg && bTouched,
  };
}

describe("fresh word null preview vs default-preset suggestion", () => {
  it("currentColor default preset does not leak into pickers or preview", () => {
    const presets = [
      {
        name: "Default",
        isDefault: true,
        styleType: "highlight",
        textColor: "currentColor",
        backgroundColor: "",
      },
    ];
    const entry = {
      uid: "new1",
      pattern: "",
      color: "",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      isRegex: false,
    };
    const init = resolveEditEntryColorInit({
      entry,
      textStylePresets: presets,
      isValidHexColor,
    });
    // "currentColor" is a marker, not a displayable color.
    expect(init.effectiveInitText).toBe("");
    expect(init.effectiveInitBg).toBe("");
    expect(init.hasRealText).toBe(false);
    expect(init.hasRealBg).toBe(false);
    expect(init.presetPrefillText).toBe(false);
    expect(init.presetPrefillBg).toBe(false);
    const pv = previewValid(init, true);
    expect(pv.hasValidText).toBe(false);
    expect(pv.hasValidBg).toBe(false);
  });

  it("hex default preset suggests pickers but preview stays theme until user picks", () => {
    const presets = [
      {
        name: "Brand",
        isDefault: true,
        styleType: "both",
        textColor: "#123456",
        backgroundColor: "#654321",
      },
    ];
    const entry = {
      uid: "new2",
      pattern: "hello",
      color: "",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      isRegex: false,
    };
    const init = resolveEditEntryColorInit({
      entry,
      textStylePresets: presets,
      isValidHexColor,
    });
    // Pickers may suggest the preset…
    expect(init.effectiveInitText).toBe("#123456");
    expect(init.effectiveInitBg).toBe("#654321");
    expect(init.presetPrefillText).toBe(true);
    expect(init.presetPrefillBg).toBe(true);
    // …but the preview treats the entry as null (theme fallbacks).
    const pv = previewValid(init, true);
    expect(pv.hasValidText).toBe(false);
    expect(pv.hasValidBg).toBe(false);
  });

  it("entry with real colors is unaffected by presets", () => {
    const presets = [
      {
        name: "Brand",
        isDefault: true,
        styleType: "both",
        textColor: "#123456",
        backgroundColor: "#654321",
      },
    ];
    const entry = {
      uid: "e3",
      pattern: "hello",
      color: "#ff0000",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      isRegex: false,
    };
    const init = resolveEditEntryColorInit({
      entry,
      textStylePresets: presets,
      isValidHexColor,
    });
    expect(init.effectiveInitText).toBe("#ff0000");
    expect(init.hasRealText).toBe(true);
    expect(init.presetPrefillText).toBe(false);
  });

  it("no presets and no colors stays fully null", () => {
    const entry = {
      uid: "new4",
      pattern: "",
      color: "",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      isRegex: false,
    };
    const init = resolveEditEntryColorInit({
      entry,
      textStylePresets: [],
      isValidHexColor,
    });
    expect(init.effectiveInitText).toBe("");
    expect(init.effectiveInitBg).toBe("");
    expect(init.presetPrefillText).toBe(false);
    expect(init.presetPrefillBg).toBe(false);
  });
});
