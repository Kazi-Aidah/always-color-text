/**
 * Preset flow colour sync: presets modal → Add Style → Edit Highlight Styling.
 *
 * - The act-colors-changed listeners resolved the text colour as
 *   entry.textColor first, but the "text" colortype stores its pick in
 *   entry.color (saveData nulls textColor structurally) — so the stale
 *   open-time colour (the default preset's var(--text-normal)) was stamped
 *   straight back over a fresh pick: the picker "regressed" immediately.
 * - _editPreset copied temp.textColor/temp.backgroundColor back into the
 *   preset for the text colortype too, so a save nulled the held text colour
 *   (losing the actual pick, which lived in temp.color) and wiped the stored
 *   background — the "New Preset" tombstone in data.json.
 *
 * window has real add/remove/dispatch semantics here: the revert only
 * reproduces when the act-colors-changed listeners actually run.
 */

import { describe, it, expect, vi } from "vitest";

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
    dispatchEvent(ev) {
      this._fire(typeof ev === "string" ? ev : ev.type);
      return true;
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
      (this._listeners[ev] || []).slice().forEach((fn) =>
        fn({ preventDefault() {}, stopPropagation() {}, target: this, type: ev }),
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
  const winListeners = {};
  globalThis.window = {
    addEventListener(ev, fn) {
      (winListeners[ev] = winListeners[ev] || []).push(fn);
    },
    removeEventListener(ev, fn) {
      winListeners[ev] = (winListeners[ev] || []).filter((f) => f !== fn);
    },
    dispatchEvent(evt) {
      (winListeners[(evt && evt.type) || ""] || []).slice().forEach((fn) => fn(evt));
      return true;
    },
  };
}
if (typeof globalThis.Event === "undefined") {
  globalThis.Event = class Event {
    constructor(type) {
      this.type = type;
    }
  };
}
if (typeof globalThis.CustomEvent === "undefined") {
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, opts) {
      this.type = type;
      this.detail = (opts && opts.detail) || {};
    }
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

function editPreset(preset) {
  const plugin = makePlugin();
  const tsp = new TextStylePresetsModal({}, plugin, null);
  tsp._render = () => {};
  tsp._editPreset(preset);
  const modal = Modal.opened[Modal.opened.length - 1];
  expect(modal).toBeTruthy();
  return { plugin, tsp, modal };
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

describe("preset flow colour sync", () => {
  it("A: native text pick (both) survives input→save→close", async () => {
    const preset = {
      uid: "tsp-a",
      name: "A",
      styleType: "both",
      textColor: "",
      backgroundColor: "",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();

    const { tColor } = colorPickers(modal.contentEl);
    tColor.value = "#ff0000";
    tColor._fire("input");

    // immediate regression check
    expect(tColor.value).toBe("#ff0000");

    await modal._saveData(false);
    expect(modal.entry.textColor).toBe("#ff0000");

    modal.onClose();
    expect(preset.textColor).toBe("#ff0000");
  });

  it("B: native bg pick (highlight) survives input→save→close", async () => {
    const preset = {
      uid: "tsp-b",
      name: "B",
      styleType: "highlight",
      textColor: "",
      backgroundColor: "",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();

    const { bColor } = colorPickers(modal.contentEl);
    bColor.value = "#00ff00";
    bColor._fire("input");

    expect(bColor.value).toBe("#00ff00");

    await modal._saveData(false);
    expect(modal.entry.backgroundColor).toBe("#00ff00");

    modal.onClose();
    expect(preset.backgroundColor).toBe("#00ff00");
  });

  it("C: right-click text pick on highlight-style preset survives save", async () => {
    const preset = {
      uid: "tsp-c",
      name: "C",
      styleType: "highlight",
      textColor: "",
      backgroundColor: "",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();

    const { bColor } = colorPickers(modal.contentEl);
    bColor._fire("contextmenu");
    await ColorPickerModal.lastCb("#123456", {
      textColor: "#123456",
      backgroundColor: "#ff5c8a",
    });

    const sel = styleSelect(modal.contentEl);
    expect(sel.value).toBe("both");

    await modal._saveData(false);
    modal.onClose();

    expect(preset.textColor).toBe("#123456");
  });

  it("D: native pick with var() preset colours survives", async () => {
    const preset = {
      uid: "tsp-d",
      name: "D",
      styleType: "both",
      textColor: "var(--text-normal)",
      backgroundColor: "var(--color-accent)",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();

    const { tColor } = colorPickers(modal.contentEl);
    tColor.value = "#abcdef";
    tColor._fire("input");

    expect(tColor.value).toBe("#abcdef");

    await modal._saveData(false);
    expect(modal.entry.textColor).toBe("#abcdef");

    modal.onClose();
    expect(preset.textColor).toBe("#abcdef");
  });

  it("E: native pick then reopen shows the pick (no regression)", async () => {
    const preset = {
      uid: "tsp-e",
      name: "E",
      styleType: "both",
      textColor: "",
      backgroundColor: "",
    };
    const first = editPreset(preset);
    first.modal.onOpen();
    const { tColor } = colorPickers(first.modal.contentEl);
    tColor.value = "#ff0000";
    tColor._fire("input");
    await first.modal._saveData(true);
    first.modal.onClose();

    const second = editPreset(preset);
    second.modal.onOpen();
    const { tColor: t2 } = colorPickers(second.modal.contentEl);
    expect(t2.value.toLowerCase()).toBe("#ff0000");
    second.modal.onClose();
  });

  it("F: native pick on a TEXT-colortype preset is not reverted by sync", () => {
    const preset = {
      uid: "tsp-f",
      name: "F",
      styleType: "text",
      textColor: "var(--text-normal)",
      backgroundColor: "#123456",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();

    const { tColor } = colorPickers(modal.contentEl);
    tColor.value = "#ff0000";
    tColor._fire("input");

    // The act-colors-changed listeners must not write the stale open-time
    // textColor (var(--text-normal)) back over the fresh pick.
    expect(tColor.value.toLowerCase()).toBe("#ff0000");
    expect(modal.entry.color).toBe("#ff0000");
  });

  it("G: right-click text pick on a TEXT-colortype preset survives save+close", async () => {
    const preset = {
      uid: "tsp-g",
      name: "G",
      styleType: "text",
      textColor: "var(--text-normal)",
      backgroundColor: "#123456",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();

    const { tColor } = colorPickers(modal.contentEl);
    tColor._fire("contextmenu");
    await ColorPickerModal.lastCb("#aa00ff", {
      textColor: "#aa00ff",
      backgroundColor: null,
    });

    await modal._saveData(false);
    modal.onClose();

    // The pick lives in temp.color for the "text" colortype (saveData nulls
    // textColor structurally) — copy-back must read THAT field, and must not
    // wipe the preset's stored background with the structural null.
    expect(preset.textColor).toBe("#aa00ff");
    expect(preset.backgroundColor).toBe("#123456");
  });

  it("H: close-without-save on a TEXT-colortype preset keeps the held colour", () => {
    const preset = {
      uid: "tsp-h",
      name: "H",
      styleType: "text",
      textColor: "var(--text-normal)",
      backgroundColor: "#123456",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();
    modal.onClose();

    // No user change → no saveData; copy-back must not leak the editor's
    // accent PRE-FILL (temp.textColor) over the held var() colour.
    expect(preset.textColor).toBe("var(--text-normal)");
    expect(preset.backgroundColor).toBe("#123456");
  });

  it("I: an unset TEXT-colortype preset stays unset through open/save/close", async () => {
    const preset = {
      uid: "tsp-i",
      name: "I",
      styleType: "text",
      textColor: "",
      backgroundColor: "",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();
    await modal._saveData(false);
    modal.onClose();

    expect(String(preset.textColor ?? "")).not.toMatch(/var\(/);
    expect(preset.textColor === "" || preset.textColor == null).toBe(true);
  });

  it("J: native text pick on a TEXT-colortype preset survives save+close", async () => {
    const preset = {
      uid: "tsp-j",
      name: "J",
      styleType: "text",
      textColor: "var(--text-normal)",
      backgroundColor: "#123456",
    };
    const { modal } = editPreset(preset);
    modal.onOpen();

    const { tColor } = colorPickers(modal.contentEl);
    tColor.value = "#ff0000";
    tColor._fire("input");

    await modal._saveData(false);
    modal.onClose();

    expect(preset.textColor).toBe("#ff0000");
    expect(preset.backgroundColor).toBe("#123456");
  });
});
