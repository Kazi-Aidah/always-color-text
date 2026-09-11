import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  FuzzySuggestModal: class {},
  Menu: class {},
  setIcon: () => {},
}));

import {
  resolveRegexTesterColorInit,
  resolveRegexTesterPreviewColors,
} from "../RealTimeRegexTesterModal.js";

const isValidHexColor = (hex) => {
  const trimmed = String(hex || "").trim();
  if (/^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(trimmed)) return true;
  if (trimmed.includes(";") || /!important/i.test(trimmed) || /\s/.test(trimmed)) return false;
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(trimmed);
};
const hexToRgba = (hex, op) => `rgba-of(${hex},${op})`;

// Native picker default when untouched.
const NATIVE_DEFAULT = "#000000";

function previewForInit(init, opacity = 31) {
  // Simulate native inputs showing prefill (or untouched default #000000).
  const tRaw = init.preFillTextColor || NATIVE_DEFAULT;
  const bRaw = init.preFillBgColor || NATIVE_DEFAULT;
  return resolveRegexTesterPreviewColors({
    tRaw,
    bRaw,
    tTouched: init.tTouched,
    bTouched: init.bTouched,
    isValidHexColor,
    opacity,
    hexToRgba,
  });
}

describe("regex tester NULL colors → var(--text-normal)/var(--color-accent), never black", () => {
  it("fresh add with no colors → untouched NULL pickers, preview var/accent", () => {
    const init = resolveRegexTesterColorInit({
      editingEntry: null,
      preFillTextColor: "",
      preFillBgColor: "",
      isValidHexColor,
    });
    expect(init.preFillTextColor).toBe("");
    expect(init.preFillBgColor).toBe("");
    expect(init.tTouched).toBe(false);
    expect(init.bTouched).toBe(false);
    const pv = previewForInit(init);
    expect(pv.hasValidT).toBe(false);
    expect(pv.hasValidB).toBe(false);
    expect(pv.t).toBe("var(--text-normal)");
    expect(pv.bgCss).toBe("color-mix(in srgb, var(--color-accent) 31%, transparent)");
    expect(pv.effectiveTForBorder).toBe("var(--color-accent)");
    expect(pv.effectiveBForBorder).toBe("var(--color-accent)");
    expect(pv.t).not.toContain("#000000");
    expect(pv.bgCss).not.toContain("0,0,0");
  });

  it("preset colors are ignored: NULL still previews as var even if a preset has colors", () => {
    // The tester never pulls preset colors in — no preset params exist on the helper.
    const init = resolveRegexTesterColorInit({
      editingEntry: null,
      preFillTextColor: "",
      preFillBgColor: "",
      isValidHexColor,
    });
    expect(init.tTouched).toBe(false);
    expect(init.bTouched).toBe(false);
    const pv = previewForInit(init);
    expect(pv.t).toBe("var(--text-normal)");
    expect(pv.bgCss).toContain("var(--color-accent)");
  });

  it("editing entry with stored both-#000000 (legacy picker-default pollution) → treated as NULL", () => {
    const entry = { styleType: "both", color: "", textColor: "#000000", backgroundColor: "#000000" };
    const init = resolveRegexTesterColorInit({
      editingEntry: entry,
      preFillTextColor: "#000000",
      preFillBgColor: "#000000",
      isValidHexColor,
    });
    expect(init.preFillTextColor).toBe("");
    expect(init.preFillBgColor).toBe("");
    expect(init.tTouched).toBe(false);
    expect(init.bTouched).toBe(false);
    const pv = previewForInit(init);
    expect(pv.t).toBe("var(--text-normal)");
    expect(pv.bgCss).toContain("var(--color-accent)");
    expect(pv.effectiveTForBorder).toBe("var(--color-accent)");
    expect(pv.effectiveBForBorder).toBe("var(--color-accent)");
  });

  it("hardcoded legacy greens with no real colors → dropped to NULL", () => {
    const entry = { styleType: "both", color: "", textColor: null, backgroundColor: null };
    const init = resolveRegexTesterColorInit({
      editingEntry: entry,
      preFillTextColor: "#87c760",
      preFillBgColor: "#1d5010",
      isValidHexColor,
    });
    expect(init.preFillTextColor).toBe("");
    expect(init.preFillBgColor).toBe("");
    expect(init.tTouched).toBe(false);
    expect(init.bTouched).toBe(false);
  });

  it("editing entry with real colors keeps them", () => {
    const entry = { styleType: "both", color: "", textColor: "#ff0000", backgroundColor: "#00ff00" };
    const init = resolveRegexTesterColorInit({
      editingEntry: entry,
      preFillTextColor: "#ff0000",
      preFillBgColor: "#00ff00",
      isValidHexColor,
    });
    expect(init.tTouched).toBe(true);
    expect(init.bTouched).toBe(true);
  });

  it("solitary legit black text (other side empty) is preserved, not blanked", () => {
    const entry = { styleType: "text", color: "#000000", textColor: null, backgroundColor: null };
    const init = resolveRegexTesterColorInit({
      editingEntry: entry,
      preFillTextColor: "#000000",
      preFillBgColor: "",
      isValidHexColor,
    });
    expect(init.tTouched).toBe(true);
    expect(init.bTouched).toBe(false);
  });
});
