/**
 * Edit Highlight Styling must respect a colour the user removed.
 *
 * - saveData wrote placeholder vars (var(--text-normal) / var(--color-accent))
 *   into any channel that held no real colour, so a reset came back "anyway".
 * - The Style dropdown stored the null-black DISPLAY fill (#000000) as a real
 *   colour for non-group entries, which then survived the save.
 * - _editPreset copied the accent PRE-FILL of the text picker back into a
 *   preset whose text channel was unset (the accent guard only ran when the
 *   background was also unset).
 *
 * Unset channels now stay empty; previews keep their theme fallbacks.
 */

import { describe, it, expect, vi } from "vitest";

// ---------------------------------------------------------------------------
// Minimal DOM
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
        this._listeners[event] = this._listeners[event].filter((x) => x !== fn);
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
  globalThis.getComputedStyle = (el) => {
    const c = (el && el.style && el.style.color) || "";
    if (c.includes("color-accent")) return { color: "rgb(124, 58, 237)" };
    if (c.includes("text-normal")) return { color: "rgb(245, 245, 245)" };
    return { color: "rgb(0, 0, 0)" };
  };
}

vi.mock("obsidian", () => {
  class Modal {
    constructor(app) {
      this.app = app;
      this.modalEl = { style: {}, addClass() {}, classList: { add() {} } };
      this.contentEl = makeDomEl("div");
    }
    open() {
      Modal.opened.push(this);
    }
    close() {}
  }
  Modal.opened = [];
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

// The right-click handler builds this modal and hands it the callback the
// test drives directly — that callback is the "Reset" path.
vi.mock("../ColorPickerModal.js", () => {
  class ColorPickerModal {
    constructor(app, plugin, cb) {
      ColorPickerModal.lastCb = cb;
    }
    open() {}
  }
  return { ColorPickerModal };
});

import { Modal } from "obsidian";
import { ColorPickerModal } from "../ColorPickerModal.js";
import { HighlightStylingModal } from "../HighlightStylingModal.js";
import { TextStylePresetsModal } from "../TextStylePresetsModal.js";

// ---------------------------------------------------------------------------
// Fake plugin
// ---------------------------------------------------------------------------

function makePlugin() {
  return {
    settings: {
      wordEntries: [],
      textBgColoringEntries: [],
      wordEntryGroups: [],
      quickStyles: [],
      textStylePresets: [],
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
    // Mirrors the plugin: hex, currentColor/inherit and var() all count.
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      const trimmed = hex.trim();
      if (/^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(trimmed)) return true;
      if (hex.includes(";") || /\s/.test(hex)) return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(trimmed);
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

function openEntryModal(plugin, entry) {
  const modal = new HighlightStylingModal({}, plugin, entry, null, null);
  modal.onOpen();
  return modal;
}

function colorPickers(root) {
  const inputs = root._findAll((n) => n._tag === "input" && n.type === "color");
  return { tColor: inputs[0], bColor: inputs[1] };
}

function styleSelect(root) {
  return root._findAll((n) =>
    (n._classes || []).includes("act-highlight-style-select"),
  )[0];
}

function expectUnset(value) {
  expect(String(value ?? "")).not.toMatch(/var\(/);
  expect(value === "" || value == null || value === false).toBe(true);
}

// ---------------------------------------------------------------------------

describe("save keeps a removed colour removed", () => {
  it("leaves unset channels empty instead of writing the default vars", async () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e1",
      pattern: "hi",
      styleType: "both",
      color: "",
      textColor: "",
      backgroundColor: "",
    };
    plugin.settings.wordEntries = [entry];
    const modal = openEntryModal(plugin, entry);

    await modal._saveData(false);

    expectUnset(entry.color);
    expectUnset(entry.textColor);
    expectUnset(entry.backgroundColor);
  });

  it("keeps a right-click Reset on a var-coloured preset/entry", async () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e2",
      pattern: "hi",
      styleType: "both",
      color: "",
      textColor: "var(--text-normal)",
      backgroundColor: "var(--color-accent)",
    };
    plugin.settings.wordEntries = [entry];
    const modal = openEntryModal(plugin, entry);

    // Right-click the text picker → Reset: the nested picker is
    // authoritative per panel, so a null text result clears that channel.
    const { tColor } = colorPickers(modal.contentEl);
    tColor._fire("contextmenu");
    await ColorPickerModal.lastCb(null, {
      textColor: null,
      backgroundColor: "var(--color-accent)",
    });

    await modal._saveData(false);

    expectUnset(entry.textColor);
    // The untouched channel keeps its colour.
    expect(entry.backgroundColor).toBe("var(--color-accent)");
  });

  it("never stores the null-black display fill when the Style dropdown changes", async () => {
    const plugin = makePlugin();
    const entry = {
      uid: "e3",
      pattern: "hi",
      styleType: "text",
      color: "",
      textColor: null,
      backgroundColor: null,
    };
    plugin.settings.wordEntries = [entry];
    const modal = openEntryModal(plugin, entry);

    const sel = styleSelect(modal.contentEl);
    expect(sel).toBeTruthy();
    sel.value = "both";
    sel._fire("change");

    expectUnset(entry.textColor);
    expectUnset(entry.backgroundColor);

    await modal._saveData(false);
    expectUnset(entry.textColor);
    expectUnset(entry.backgroundColor);
  });

  it("groups still clear to undefined so member colours apply", async () => {
    const plugin = makePlugin();
    const group = {
      uid: "g1",
      name: "G",
      entries: [{ uid: "m1", pattern: "x" }],
      styleType: "both",
      color: "",
      textColor: "",
      backgroundColor: "",
    };
    plugin.settings.wordEntryGroups = [group];
    const modal = new HighlightStylingModal({}, plugin, group, null, "G");
    modal.onOpen();

    await modal._saveData(false);

    expect(group.styleType).toBeUndefined();
    expect(group.color).toBeUndefined();
    expect(group.textColor).toBeUndefined();
    expect(group.backgroundColor).toBeUndefined();
  });
});

describe("_editPreset colour copy-back", () => {
  function editPreset(preset) {
    const plugin = makePlugin();
    const tsp = new TextStylePresetsModal({}, plugin, null);
    tsp._render = () => {};
    tsp._editPreset(preset);
    const modal = Modal.opened[Modal.opened.length - 1];
    expect(modal).toBeTruthy();
    return { plugin, tsp, modal };
  }

  it("does not leak the accent pre-fill into an unset text channel", async () => {
    const preset = {
      uid: "tsp-x",
      name: "X",
      styleType: "both",
      textColor: "",
      backgroundColor: "#ff5c8a",
    };

    const { modal } = editPreset(preset);
    // Open and close without touching anything: temp only carries the
    // accent pre-fill the editor put on the native picker.
    modal.onClose();

    expectUnset(preset.textColor);
    expect(preset.backgroundColor).toBe("#ff5c8a");
    expect(preset.styleType).toBe("both");
  });

  it("persists a full reset cycle: right-click Reset → Save Style → close", async () => {
    const preset = {
      uid: "tsp-y",
      name: "Y",
      styleType: "both",
      textColor: "var(--text-normal)",
      backgroundColor: "var(--color-accent)",
    };

    const { modal } = editPreset(preset);
    modal.onOpen();

    const { tColor } = colorPickers(modal.contentEl);
    tColor._fire("contextmenu");
    await ColorPickerModal.lastCb(null, {
      textColor: null,
      backgroundColor: "var(--color-accent)",
    });

    await modal._saveData(false);
    modal.onClose();

    expectUnset(preset.textColor);
    expect(preset.backgroundColor).toBe("var(--color-accent)");
  });

  it("still copies a colour the user actually picked", () => {
    const preset = {
      uid: "tsp-z",
      name: "Z",
      styleType: "both",
      textColor: "",
      backgroundColor: "#ff5c8a",
    };

    const { modal } = editPreset(preset);
    // Simulate the save the Save Style button performs after a pick.
    modal.entry.textColor = "#123456";
    modal.onClose();

    expect(preset.textColor).toBe("#123456");
    expect(preset.backgroundColor).toBe("#ff5c8a");
  });
});
