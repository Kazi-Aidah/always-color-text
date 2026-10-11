/**
 * Edit Highlight Styling → Style (preset): a preset must restyle the SHAPE
 * but never steal user-set colors. Preset colors apply only when the entry
 * has none of its own (mirrors EditEntryModal._applyPreset).
 */

import { describe, it, expect, vi } from "vitest";

// ---------------------------------------------------------------------------
// Minimal DOM (mirrors highlightStylingPreview.test.js)
// ---------------------------------------------------------------------------

function makeStyle() {
  const s = {
    setProperty(p, v) {
      s[p] = String(v);
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
    _attrs: {},
    _listeners: {},
    _classes: [],
    style: makeStyle(),
    dataset: {},
    textContent: "",
    innerHTML: "",
    value: "",
    checked: false,
    disabled: false,
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
    addClass(...clses) {
      this._classes.push(...clses);
    },
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
  class Menu {
    addItem() {
      return this;
    }
    addSeparator() {
      return this;
    }
    showAtMouseEvent() {}
  }
  class Notice {}
  return { Modal, Menu, setIcon, Notice };
});

vi.mock("../ColorPickerModal.js", () => ({
  ColorPickerModal: class {
    constructor() {}
    open() {}
  },
}));

// The preset picker immediately picks whatever the test staged.
let stagedPreset = null;
vi.mock("../TextStylePresetsModal.js", () => ({
  TextStylePresetsModal: class {
    constructor(app, plugin, onPick) {
      this._onPick = onPick;
    }
    open() {
      try {
        if (typeof this._onPick === "function") this._onPick(stagedPreset);
      } catch (_) {}
    }
  },
}));

import { HighlightStylingModal } from "../HighlightStylingModal.js";

function makePlugin() {
  return {
    settings: {
      quickStyles: [],
      wordEntryGroups: [],
      backgroundOpacity: 35,
      highlightBorderRadius: 4,
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
    },
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
        enableBorder: false,
        borderStyle: "full",
        borderLineStyle: "solid",
        borderOpacity: 100,
        borderThickness: 1,
      };
    },
    generateBorderStyle: () => "",
    sanitizeCssDeclarations: (s) => s,
    syncEntryCssFromColors: () => {},
    syncEntryCssFromColorsForPreview: (e) => e.customCss,
    saveSettings: async () => {},
    compileWordEntries: () => {},
    compileTextBgColoringEntries: () => {},
    reconfigureEditorExtensions: () => {},
    forceRefreshAllEditors: () => {},
    forceRefreshAllReadingViews: () => {},
    triggerActiveDocumentRerender: () => {},
  };
}

const testPreset = () => ({
  uid: "tsp-x",
  name: "X",
  styleType: "highlight",
  textColor: "#111111",
  backgroundColor: "#222222",
  backgroundOpacity: 60,
  highlightBorderRadius: 12,
  cornerShape: "round",
  highlightHorizontalPadding: 4,
  highlightVerticalPadding: 2,
  enableBorderThickness: false,
  borderStyle: "full",
  borderLineStyle: "solid",
  borderOpacity: 100,
  borderThickness: 1,
});

function openModal(plugin, entry) {
  const modal = new HighlightStylingModal({}, plugin, entry, null, null);
  modal.onOpen();
  return modal;
}

function clickStyleButton(modal) {
  const btn = modal.contentEl._findAll(
    (n) => n._tag === "button" && n.textContent === "Style",
  )[0];
  expect(btn).toBeTruthy();
  btn._fire("click");
}

describe("highlight styling preset colors", () => {
  it("keeps user-set colors and applies shape + stamp", () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e1",
      pattern: "hello",
      color: "#ff0000",
      textColor: "#ff0000",
      backgroundColor: "#00ff00",
      styleType: "both",
      highlightBorderRadius: 4,
    };
    stagedPreset = testPreset();
    const modal = openModal(plugin, entry);
    clickStyleButton(modal);

    // User colors untouched…
    expect(entry.color).toBe("#ff0000");
    expect(entry.textColor).toBe("#ff0000");
    expect(entry.backgroundColor).toBe("#00ff00");
    // …but shape and stamp applied.
    expect(entry.highlightBorderRadius).toBe(12);
    expect(entry.backgroundOpacity).toBe(60);
    expect(entry.presetUid).toBe("tsp-x");
  });

  it("applies preset colors only when the entry has none", () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e2",
      pattern: "world",
      color: "",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
    };
    stagedPreset = testPreset();
    const modal = openModal(plugin, entry);
    clickStyleButton(modal);

    expect(entry.backgroundColor).toBe("#222222");
    expect(entry.textColor).toBe("currentColor");
    expect(entry.presetUid).toBe("tsp-x");
  });
});
