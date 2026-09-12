/**
 * Pick-color modal preview must reflect corner-shape.
 *
 * Regression: the preview painted background/border/radius/padding but never
 * set `corner-shape`, so shape edits appeared dead in the picker. Every path
 * that paints a background must sync the shape; reset must clear it; style
 * presets must carry it through to the entry.
 */

import { describe, it, expect, vi } from "vitest";

function makeStyle() {
  const toHyphen = (p) =>
    String(p).replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  const store = {};
  const api = {
    setProperty(p, v) {
      store[toHyphen(p)] = String(v);
    },
    removeProperty(p) {
      const h = toHyphen(p);
      for (const k of Object.keys(store)) {
        if (k === p || toHyphen(k) === h) delete store[k];
      }
    },
  };
  return new Proxy(api, {
    get(t, p) {
      if (p in t) return t[p];
      if (typeof p === "string") return store[p] ?? store[toHyphen(p)];
      return undefined;
    },
    set(t, p, v) {
      store[toHyphen(p)] = v;
      return true;
    },
  });
}

function makeDomEl(tag = "div") {
  const el = {
    _tag: tag,
    _children: [],
    _attrs: {},
    _listeners: {},
    style: makeStyle(),
    dataset: {},
    textContent: "",
    innerHTML: "",
    value: "",
    title: "",
    type: "",
    placeholder: "",
    min: "",
    max: "",
    get firstChild() {
      return this._children[0] || null;
    },
    appendChild(child) {
      this._children.push(child);
      return child;
    },
    removeChild(child) {
      this._children = this._children.filter((x) => x !== child);
      return child;
    },
    setAttribute(k, v) {
      this._attrs[k] = String(v);
    },
    getAttribute(k) {
      return this._attrs[k] ?? null;
    },
    setAttr(k, v) {
      this._attrs[k] = String(v);
    },
    addClass() {},
    addEventListener(event, fn) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
    },
    removeEventListener(event, fn) {
      if (this._listeners[event]) {
        this._listeners[event] = this._listeners[event].filter((f) => f !== fn);
      }
    },
    empty() {
      this._children = [];
    },
    createEl(childTag, opts = {}) {
      const child = makeDomEl(childTag);
      if (opts.text !== undefined) child.textContent = opts.text;
      if (opts.type !== undefined) child.type = opts.type;
      if (opts.value !== undefined) child.value = opts.value;
      this._children.push(child);
      return child;
    },
    createDiv(opts = {}) {
      const child = makeDomEl("div");
      if (opts && opts.text) child.textContent = opts.text;
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
    _fire(ev) {
      (this._listeners[ev] || []).forEach((fn) =>
        fn({ preventDefault() {}, stopPropagation() {}, target: this }),
      );
    },
  };
  return el;
}

if (typeof globalThis.document === "undefined") {
  globalThis.document = {
    createElement: (tag) => makeDomEl(tag),
    body: makeDomEl("body"),
  };
}
if (typeof globalThis.window === "undefined") {
  globalThis.window = {
    innerWidth: 1200,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
  };
}
if (typeof globalThis.getComputedStyle === "undefined") {
  globalThis.getComputedStyle = () => ({ color: "rgb(0, 0, 0)" });
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
  function setIcon() {}
  class Notice {}
  return { Modal, Notice, setIcon };
});

vi.mock("../EditEntryModal.js", () => ({
  EditEntryModal: class {
    constructor() {}
    open() {}
  },
}));
vi.mock("../HighlightStylingModal.js", () => ({
  HighlightStylingModal: class {
    constructor() {}
    open() {}
  },
}));
vi.mock("../TextStylePresetsModal.js", () => ({
  TextStylePresetsModal: class {
    constructor() {}
    open() {}
  },
}));
vi.mock("../CustomCssModal.js", () => ({
  deriveHighlightCssFromEntry: () => "",
}));

import { ColorPickerModal } from "../ColorPickerModal.js";

function makePlugin(overrides = {}) {
  return {
    settings: Object.assign(
      {
        colorPickerMode: "both",
        wordEntries: [],
        wordEntryGroups: [],
        swatches: [],
        userCustomSwatches: [],
        backgroundOpacity: 25,
        highlightBorderRadius: 8,
        cornerShape: "round",
        highlightHorizontalPadding: 4,
        highlightVerticalPadding: 0,
        enableBoxDecorationBreak: true,
        enableBorderThickness: false,
        borderStyle: "full",
        borderLineStyle: "solid",
        borderOpacity: 100,
        borderThickness: 1,
        enableCustomCss: false,
        caseSensitive: false,
        partialMatch: false,
      },
      overrides.settings || {},
    ),
    t: (k, d) => d,
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
    },
    hexToRgba: (hex, op) => `rgba-from(${hex},${op})`,
    getHighlightParams: function (entry) {
      const s = this.settings;
      return {
        opacity:
          entry && typeof entry.backgroundOpacity === "number"
            ? entry.backgroundOpacity
            : (s.backgroundOpacity ?? 25),
        radius:
          entry && typeof entry.highlightBorderRadius === "number"
            ? entry.highlightBorderRadius
            : (s.highlightBorderRadius ?? 8),
        hPad:
          entry && typeof entry.highlightHorizontalPadding === "number"
            ? entry.highlightHorizontalPadding
            : (s.highlightHorizontalPadding ?? 4),
        vPad:
          entry && typeof entry.highlightVerticalPadding === "number"
            ? entry.highlightVerticalPadding
            : (s.highlightVerticalPadding ?? 0),
        cornerShape:
          entry && typeof entry.cornerShape === "string" && entry.cornerShape
            ? entry.cornerShape
            : (s.cornerShape ?? "round"),
      };
    },
    applyBorderStyleToElement: () => {},
    applyCornerShapeToElement: function (el, entry) {
      try {
        let v =
          entry && typeof entry.cornerShape === "string" && entry.cornerShape
            ? entry.cornerShape.trim().toLowerCase()
            : (this.settings.cornerShape || "round").trim().toLowerCase();
        if (!v || v === "round") {
          el.style.removeProperty("corner-shape");
          return;
        }
        el.style.setProperty("corner-shape", v, "important");
      } catch (_) {}
    },
    sanitizeCssDeclarations: (s) => s,
    syncEntryCssFromColorsForPreview: () => "",
    validateAndSanitizeRegex: () => true,
    saveSettings: async () => {},
    compileWordEntries: () => {},
    compileTextBgColoringEntries: () => {},
    reconfigureEditorExtensions: () => {},
    forceRefreshAllEditors: () => {},
    forceRefreshAllReadingViews: () => {},
    triggerActiveDocumentRerender: () => {},
  };
}

function previewSpan(modal) {
  const spans = modal.contentEl._findAll((n) => n._tag === "span");
  return spans[spans.length - 1] || null;
}

function resetButtons(modal) {
  return modal.contentEl._findAll(
    (n) => n._tag === "button" && n.textContent === "Reset",
  );
}

describe("pick-color modal preview corner-shape", () => {
  it("opening an entry with squircle shows corner-shape in preview", () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e-shape",
      pattern: "shaped",
      isRegex: false,
      styleType: "highlight",
      color: "",
      textColor: "currentColor",
      backgroundColor: "#00ff00",
      cornerShape: "squircle",
    };
    const modal = new ColorPickerModal(
      {},
      plugin,
      () => {},
      "text-and-background",
      "shaped",
      false,
      "text",
      entry,
    );
    modal.onOpen();
    const span = previewSpan(modal);
    expect(span).toBeTruthy();
    expect(span.style["background-color"]).toContain("#00ff00");
    expect(span.style["corner-shape"]).toBe("squircle");
  });

  it("picking a bg color applies the entry/global corner-shape", () => {
    const plugin = makePlugin({ settings: { cornerShape: "scoop" } });
    const modal = new ColorPickerModal(
      {},
      plugin,
      () => {},
      "text-and-background",
      "fresh",
      false,
      "text",
      null,
    );
    modal.onOpen();
    modal._applyBgColorFn("#123456");
    const span = previewSpan(modal);
    expect(span.style["background-color"]).toContain("#123456");
    expect(span.style["corner-shape"]).toBe("scoop");
  });

  it("resetting the highlight panel clears corner-shape", () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e-reset",
      pattern: "both",
      isRegex: false,
      styleType: "both",
      color: "",
      textColor: "#ff0000",
      backgroundColor: "#00ff00",
      cornerShape: "bevel",
    };
    const modal = new ColorPickerModal(
      {},
      plugin,
      () => {},
      "text-and-background",
      "both",
      false,
      "text",
      entry,
    );
    modal.onOpen();
    let span = previewSpan(modal);
    expect(span.style["corner-shape"]).toBe("bevel");
    const resets = resetButtons(modal);
    expect(resets.length).toBe(2);
    resets[1]._fire("click");
    span = previewSpan(modal);
    expect(span.style["background-color"]).toBeUndefined();
    expect(span.style["corner-shape"]).toBeUndefined();
  });

  it("style preset carries corner-shape to entry and preview", () => {
    const plugin = makePlugin();
    const modal = new ColorPickerModal(
      {},
      plugin,
      () => {},
      "text-and-background",
      "presetword",
      false,
      "text",
      null,
    );
    modal.onOpen();
    modal._applyPreset({
      styleType: "highlight",
      backgroundOpacity: 25,
      highlightBorderRadius: 8,
      cornerShape: "notch",
      highlightHorizontalPadding: 4,
      highlightVerticalPadding: 0,
      enableBorderThickness: false,
      borderStyle: "full",
      borderLineStyle: "solid",
      borderOpacity: 100,
      borderThickness: 1,
      textColor: null,
      backgroundColor: "#abcdef",
    });
    expect(modal._entry.cornerShape).toBe("notch");
    expect(modal._appliedPresetStyle.cornerShape).toBe("notch");
    const span = previewSpan(modal);
    expect(span.style["corner-shape"]).toBe("notch");
  });
});
