/**
 * Bugfix: Theme Color Adjustments modal — preset chip preview
 *
 * The preset chips rendered every preset as a solid var(--color-accent)
 * block: `_withAlpha()` only understood #hex, so a var() background silently
 * dropped its own backgroundOpacity (50% / 25% / 0% presets all painted at
 * 100%), which in turn hid the 100%-accent borders of the outlined presets.
 * On top of that a preset with no usable colour of its own borrowed a random
 * swatch colour, so chips stopped reflecting the presets they stand for.
 *
 * The chips are now filled with the plugin's swatch colours — cycled exactly
 * like the "I look different in each theme mode!" sample line — at each
 * preset's own opacity/radius/border, with the preset's own text colour.
 *
 * Expected: each chip shows a cycling swatch fill at the preset's opacity
 * (var() kept alive via color-mix, hex → rgba), the preset's own text colour,
 * and a border drawn in that same fill colour — never the preset's base
 * colour and never for text-only presets.
 */

import { describe, it, expect, vi } from "vitest";

// ---------------------------------------------------------------------------
// Minimal DOM
// ---------------------------------------------------------------------------

function makeStyle() {
  const s = {
    cssText: "",
    setProperty(p, v, priority) {
      s[p] = priority ? `${String(v)} !${priority}` : String(v);
    },
    removeProperty(p) {
      delete s[p];
    },
  };
  return s;
}

function makeDomEl(tag = "div") {
  const el = {
    _tag: tag,
    _children: [],
    _classes: [],
    style: makeStyle(),
    textContent: "",
    className: "",
    get firstChild() {
      return this._children[0] || null;
    },
    appendChild(child) {
      this._children.push(child);
      return child;
    },
    addClass(...clses) {
      this._classes.push(...clses);
    },
    addEventListener() {},
    removeEventListener() {},
    empty() {
      this._children = [];
    },
    createEl(childTag, opts = {}) {
      const child = makeDomEl(childTag);
      if (opts.text !== undefined) child.textContent = opts.text;
      if (opts.cls) child.addClass(opts.cls);
      this._children.push(child);
      return child;
    },
    createDiv(opts = {}) {
      const child = makeDomEl("div");
      if (opts && opts.text) child.textContent = opts.text;
      if (opts && opts.cls) child.addClass(opts.cls);
      this._children.push(child);
      return child;
    },
    createSpan(opts = {}) {
      const child = makeDomEl("span");
      if (opts && opts.text) child.textContent = opts.text;
      if (opts && opts.cls) child.addClass(opts.cls);
      this._children.push(child);
      return child;
    },
    _walk(fn) {
      fn(this);
      (this._children || []).forEach((c) => c._walk(fn));
    },
    _findAll(pred) {
      const out = [];
      this._walk((n) => {
        if (pred(n)) out.push(n);
      });
      return out;
    },
  };
  return el;
}

if (typeof globalThis.document === "undefined") {
  globalThis.document = { createElement: (t) => makeDomEl(t), body: makeDomEl("body") };
}

vi.mock("obsidian", () => {
  class Modal {
    constructor(app) {
      this.app = app;
      this.modalEl = { style: {}, addClass() {}, classList: { add() {} } };
      this.contentEl = makeDomEl("div");
    }
    open() {}
    close() {}
  }
  return { Modal };
});

import { ThemeFixerAdjustModal } from "../ThemeFixerAdjustModal.js";

// ---------------------------------------------------------------------------
// Fake plugin (mirrors the real helpers' behaviour for the values in play)
// ---------------------------------------------------------------------------

const VALID = (x) =>
  x === "inherit" ||
  x === "currentColor" ||
  (typeof x === "string" &&
    (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(x.trim()) ||
      /^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(x.trim())));

const DEFAULT_SWATCHES = [
  { name: "Red", color: "#eb3b5a" },
  { name: "Orange", color: "#fa8231" },
  { name: "Yellow", color: "#e5a216" },
];

function makePlugin(presets, swatches = DEFAULT_SWATCHES) {
  const borderCalls = [];
  return {
    borderCalls,
    settings: {
      textStylePresets: presets,
      swatches,
      userCustomSwatches: [],
      enableBorderThickness: false,
      borderThickness: 1,
      borderOpacity: 100,
      borderStyle: "full",
      borderLineStyle: "solid",
      highlightBorderRadius: 4,
      highlightHorizontalPadding: 4,
      highlightVerticalPadding: 0,
      backgroundOpacity: 35,
      cornerShape: "round",
    },
    t: (k, d) => d,
    isValidHexColor: VALID,
    getHighlightParams(entry) {
      const s = this.settings;
      const num = (v, d) => (typeof v === "number" && isFinite(v) ? v : d);
      return {
        opacity: num(entry && entry.backgroundOpacity, s.backgroundOpacity ?? 25),
        radius: num(entry && entry.highlightBorderRadius, s.highlightBorderRadius ?? 8),
        hPad: num(entry && entry.highlightHorizontalPadding, s.highlightHorizontalPadding ?? 4),
        vPad: num(entry && entry.highlightVerticalPadding, s.highlightVerticalPadding ?? 0),
        enableBorder:
          entry && typeof entry.enableBorderThickness !== "undefined"
            ? !!entry.enableBorderThickness
            : !!s.enableBorderThickness,
        borderStyle: (entry && entry.borderStyle) || s.borderStyle || "full",
        borderLineStyle: (entry && entry.borderLineStyle) || s.borderLineStyle || "solid",
        borderOpacity: num(entry && entry.borderOpacity, s.borderOpacity ?? 100),
        borderThickness: num(entry && entry.borderThickness, s.borderThickness ?? 1),
        cornerShape: (entry && entry.cornerShape) || s.cornerShape || "round",
      };
    },
    // Stand-in for the real generator: records what colour it was handed and
    // echoes it back inside the border declaration.
    generateBorderStyle(textColor, backgroundColor, entry) {
      borderCalls.push({ textColor, backgroundColor, entry });
      const enable =
        entry && typeof entry.enableBorderThickness !== "undefined"
          ? !!entry.enableBorderThickness
          : !!this.settings.enableBorderThickness;
      if (!enable) return "";
      const p = this.getHighlightParams(entry);
      return ` border: ${p.borderThickness}px ${p.borderLineStyle} ${backgroundColor || textColor} !important;`;
    },
  };
}

function chipsFor(presets, swatches) {
  const plugin = makePlugin(presets, swatches);
  const modal = new ThemeFixerAdjustModal({}, plugin);
  const container = makeDomEl("div");
  modal._fillPresets(container);
  const line = container._children[0];
  return { chips: line._children, plugin };
}

const chipNamed = (chips, name) =>
  chips.find((c) => String(c.textContent).trim() === name);

const accentPreset = (over = {}) => ({
  uid: "tsp-x",
  name: "X",
  styleType: "highlight",
  textColor: "var(--text-normal)",
  backgroundColor: "var(--color-accent)",
  backgroundOpacity: 50,
  highlightBorderRadius: 8,
  highlightHorizontalPadding: 6,
  highlightVerticalPadding: 2,
  enableBorderThickness: false,
  borderStyle: "full",
  borderLineStyle: "solid",
  borderOpacity: 100,
  borderThickness: 2,
  ...over,
});

describe("Theme Color Adjustments — preset chips filled with the swatch colors", () => {
  it("cycles swatch colors through the chips, at each preset's own opacity", () => {
    const { chips } = chipsFor([
      accentPreset({ name: "Half", backgroundOpacity: 50 }),
      accentPreset({ name: "Quarter", backgroundOpacity: 25 }),
      accentPreset({ name: "Clear", backgroundOpacity: 0 }),
    ]);
    const half = chipNamed(chips, "Half");
    expect(half.style.backgroundColor).toBe("rgba(235, 59, 90, 0.5)");
    expect(half.style["--highlight-background"]).toBe(half.style.backgroundColor);
    expect(chipNamed(chips, "Quarter").style.backgroundColor).toBe("rgba(250, 130, 49, 0.25)");
    expect(chipNamed(chips, "Clear").style.backgroundColor).toBe("rgba(229, 162, 22, 0)");
  });

  it("keeps a var() swatch color alive through color-mix", () => {
    const { chips } = chipsFor(
      [accentPreset({ name: "Var", backgroundOpacity: 45 })],
      [{ color: "var(--color-accent)" }],
    );
    expect(chipNamed(chips, "Var").style.backgroundColor).toBe(
      "color-mix(in srgb, var(--color-accent) 45%, transparent)",
    );
  });

  it("wraps around when there are more presets than swatches", () => {
    const { chips } = chipsFor([
      accentPreset({ name: "One" }),
      accentPreset({ name: "Two" }),
      accentPreset({ name: "Three" }),
      accentPreset({ name: "Four" }),
    ]);
    expect(chipNamed(chips, "Four").style.backgroundColor).toBe("rgba(235, 59, 90, 0.5)");
  });

  it("keeps the preset's own text colour (currentColor inherits)", () => {
    const { chips } = chipsFor([
      accentPreset({ name: "Normal" }),
      accentPreset({ name: "Inherit", textColor: "currentColor" }),
    ]);
    const normal = chipNamed(chips, "Normal");
    expect(normal.style.color).toBe("var(--text-normal)");
    expect(normal.style["--highlight-color"]).toBe("var(--text-normal)");
    // currentColor → nothing painted, the chip inherits from the panel.
    const inherit = chipNamed(chips, "Inherit");
    expect(inherit.style.color).toBeUndefined();
    expect(inherit.style["--highlight-color"]).toBeUndefined();
  });

  it("leaves text-only presets unfilled and unbordered", () => {
    const { chips, plugin } = chipsFor([
      accentPreset({
        name: "TextOnly",
        styleType: "text",
        textColor: "#123456",
        backgroundColor: "",
      }),
      accentPreset({ name: "Outlined", enableBorderThickness: true }),
    ]);
    const textOnly = chipNamed(chips, "TextOnly");
    expect(textOnly.style.backgroundColor).toBeUndefined();
    expect(textOnly.style["--highlight-background"]).toBeUndefined();
    // The renderer only borders a highlight, so a text-only chip gets none.
    expect(plugin.borderCalls.some((c) => c.entry.name === "TextOnly")).toBe(false);
    // The sibling highlight chip still gets its swatch fill.
    expect(chipNamed(chips, "Outlined").style.backgroundColor).toBe("rgba(250, 130, 49, 0.5)");
  });

  it("draws the border in the chip's swatch fill, not the preset's base colour", () => {
    const { plugin } = chipsFor([
      accentPreset({ name: "Outlined", enableBorderThickness: true, backgroundOpacity: 25 }),
    ]);
    expect(plugin.borderCalls).toHaveLength(1);
    expect(plugin.borderCalls[0].backgroundColor).toBe("#eb3b5a");
    expect(plugin.borderCalls[0].textColor).toBe("var(--text-normal)");
    expect(plugin.borderCalls[0].entry.name).toBe("Outlined");
  });
});
