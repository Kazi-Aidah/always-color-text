/**
 * Pick-color (swatches) modal: a text with no background color set must
 * preview with NO background/highlight — never an accent (or black) fill.
 * Text still falls back to var(--text-normal) for accessibility.
 */

import { describe, it, expect, vi } from "vitest";

function makeStyle() {
  // Normalizes camelCase assignments (style.backgroundColor = x) and
  // hyphenated setProperty/removeProperty like a real CSSStyleDeclaration.
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

function makePlugin() {
  return {
    settings: {
      colorPickerMode: "both",
      wordEntries: [],
      wordEntryGroups: [],
      swatches: [],
      userCustomSwatches: [],
      backgroundOpacity: 25,
      highlightBorderRadius: 8,
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
    t: (k, d) => d,
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
    },
    hexToRgba: (hex, op) => `rgba-from(${hex},${op})`,
    getHighlightParams: () => ({
      opacity: 25,
      radius: 8,
      hPad: 4,
      vPad: 0,
      cornerShape: "round",
    }),
    applyBorderStyleToElement: () => {},
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

describe("pick-color modal shows no highlight without a background", () => {
  it("text-only entry previews theme text with no background", () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e1",
      pattern: "hello",
      isRegex: false,
      styleType: "text",
      color: "#ff0000",
      textColor: null,
      backgroundColor: null,
    };
    const modal = new ColorPickerModal(
      {},
      plugin,
      () => {},
      "text",
      "hello",
      false,
      "text",
      entry,
    );
    modal.onOpen();
    const span = previewSpan(modal);
    expect(span).toBeTruthy();
    expect(span.style["color"]).toBe("#ff0000");
    expect(span.style["background-color"]).toBeUndefined();
  });

  it("fresh word with no colors previews theme text with no background", () => {
    const plugin = makePlugin();
    const modal = new ColorPickerModal(
      {},
      plugin,
      () => {},
      "text-and-background",
      "freshword",
      false,
      "text",
      null,
    );
    modal.onOpen();
    const span = previewSpan(modal);
    expect(span).toBeTruthy();
    expect(span.style["color"]).toBe("var(--text-normal)");
    // No accent fill, no black fill — simply no background.
    expect(span.style["background-color"]).toBeUndefined();
  });

  it("stale entry CSS does not freeze the preview on picks", () => {
    const plugin = makePlugin();
    plugin.settings.enableCustomCss = true;
    plugin.settings.swatches = [{ name: "R", color: "#123456" }];
    const entry = {
      uid: "e3",
      pattern: "styled",
      isRegex: false,
      styleType: "text",
      color: "#ff0000",
      textColor: null,
      backgroundColor: null,
      customCss:
        "color: #00ff00;\nbackground-color: rgba(0,0,0,1);\nborder: 2px solid #00ff00;\nfont-weight: bold;",
    };
    const modal = new ColorPickerModal(
      {},
      plugin,
      () => {},
      "text",
      "styled",
      false,
      "text",
      entry,
    );
    modal.onOpen();
    const swatch = modal.contentEl
      ._findAll((n) => n._tag === "button" && n._attrs.title === "R")[0];
    expect(swatch).toBeTruthy();
    swatch._fire("click");
    const span = previewSpan(modal);
    // Freshly picked color wins over the stale CSS color…
    expect(span.style["color"]).toBe("#123456");
    // …stale background/border stay out of the preview…
    expect(span.style["background-color"]).toBeUndefined();
    expect(span.style["border"]).toBeUndefined();
    // …while unmanaged custom props still show.
    expect(span.style["font-weight"]).toBe("bold");
  });

  it("resetting the highlight panel removes the preview background", () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e2",
      pattern: "both",
      isRegex: false,
      styleType: "both",
      color: "",
      textColor: "#ff0000",
      backgroundColor: "#00ff00",
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
    modal._preFillTextColor = "#ff0000";
    modal._preFillBgColor = "#00ff00";
    modal._preFillBorderColor = "#00ff00";
    modal.onOpen();
    let span = previewSpan(modal);
    expect(span.style["background-color"]).toContain("#00ff00");

    const resets = resetButtons(modal);
    expect(resets.length).toBe(2);
    // Second reset button belongs to the highlight panel (text built first).
    resets[1]._fire("click");
    span = previewSpan(modal);
    expect(span.style["background-color"]).toBeUndefined();
    // Text color picked earlier is untouched.
    expect(span.style["color"]).toBe("#ff0000");
  });
});
