/**
 * Bugfix: group Highlight Styling modal preview
 *
 * Issue 1: changing corner shape / border radius did not update the group
 * preview — groups in Default (Per-Entry) mode hit an early return rendering
 * plain text, so geometry controls appeared dead (the compiler still applies
 * group layout to member entries, so the preview lied).
 *
 * Issue 2: after Reset nulled the group colors, the preview kept forcibly
 * applying stale picker values (#ffffff text / #000000 bg) via open-time
 * snapshots / touched flags instead of falling back to var(--text-normal)
 * text and var(--color-accent) background/border.
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

vi.mock("../TextStylePresetsModal.js", () => ({
  TextStylePresetsModal: class {
    constructor() {}
    open() {}
  },
}));

import { HighlightStylingModal } from "../HighlightStylingModal.js";

// ---------------------------------------------------------------------------
// Fake plugin
// ---------------------------------------------------------------------------

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

function openGroupModal(plugin, group) {
  const modal = new HighlightStylingModal({}, plugin, group, null, group.name);
  modal.onOpen();
  return modal;
}

function findByAttr(root, attr) {
  return root._findAll((n) => n.getAttribute(attr) !== null);
}

function previewSpan(root, text) {
  const spans = root._findAll(
    (n) => n._tag === "span" && n.textContent === text,
  );
  return spans[spans.length - 1] || null;
}

function colorPickers(root) {
  const inputs = root._findAll((n) => n._tag === "input" && n.type === "color");
  return { tColor: inputs[0], bColor: inputs[1] };
}

describe("group highlight styling preview", () => {
  it("issue 1: shape + radius changes update the Default-mode group preview", () => {
    const plugin = makePlugin();
    const group = {
      uid: "g1",
      name: "G",
      entries: [{ uid: "e1", pattern: "x" }],
      styleType: undefined,
      textColor: undefined,
      backgroundColor: undefined,
      color: undefined,
    };
    const modal = openGroupModal(plugin, group);

    const shapeSel = findByAttr(modal.contentEl, "data-act-corner-shape")[0];
    expect(shapeSel).toBeTruthy();
    shapeSel.value = "squircle";
    shapeSel._fire("change");

    const radiusInput = findByAttr(
      modal.contentEl,
      "data-act-radius-input",
    )[0];
    expect(radiusInput).toBeTruthy();
    radiusInput.value = "50";
    radiusInput._fire("input");

    const span = previewSpan(modal.contentEl, "G");
    expect(span).toBeTruthy();
    expect(span.style["border-radius"]).toBe("50px");
    expect(span.style["corner-shape"]).toBe("squircle");
  });

  it("issue 2: reset nulls group colors and preview falls back to theme vars", () => {
    const plugin = makePlugin();
    const group = {
      uid: "g2",
      name: "G2",
      entries: [{ uid: "e2", pattern: "y" }],
      styleType: "both",
      textColor: "#ff0000",
      backgroundColor: "#00ff00",
      color: "",
    };
    const modal = openGroupModal(plugin, group);

    // Sanity: preview shows the real colors before reset.
    let span = previewSpan(modal.contentEl, "G2");
    expect(span.style["color"]).toBe("#ff0000");

    const resetBtn = modal.contentEl
      ._findAll((n) => n._tag === "button")
      .find((b) => b.textContent === "Reset Highlight Style");
    expect(resetBtn).toBeTruthy();
    resetBtn._fire("click");

    // Entry colors nulled…
    expect(group.textColor).toBeUndefined();
    expect(group.backgroundColor).toBeUndefined();

    // …and preview uses fallbacks, not stale #ffffff/#000000.
    span = previewSpan(modal.contentEl, "G2");
    expect(span.style["color"]).toBe("var(--text-normal)");
    expect(span.style["background-color"]).toContain("var(--color-accent)");
    expect(span.style["background-color"]).not.toContain("#00ff00");
    expect(span.style["background-color"]).not.toContain("#000000");
  });

  it("null colors show null black in pickers while preview uses theme vars", () => {
    const plugin = makePlugin();
    const group = {
      uid: "g3",
      name: "G3",
      entries: [{ uid: "e3", pattern: "z" }],
      styleType: undefined,
      textColor: undefined,
      backgroundColor: undefined,
      color: undefined,
    };
    const modal = openGroupModal(plugin, group);

    const { tColor, bColor } = colorPickers(modal.contentEl);
    expect(tColor).toBeTruthy();
    expect(bColor).toBeTruthy();
    // Null pickers show null black (#000000); the previewWrap (not the
    // picker) shows var(--text-normal) / var(--color-accent) for accessibility.
    expect(tColor.value).toBe("#000000");
    expect(bColor.value).toBe("#000000");

    const span = previewSpan(modal.contentEl, "G3");
    expect(span).toBeTruthy();
    expect(span.style["color"]).toBe("var(--text-normal)");
    expect(span.style["background-color"]).toContain("var(--color-accent)");

    // Display fill must not persist: untouched nulls stay null.
    expect(group.textColor).toBeUndefined();
    expect(group.backgroundColor).toBeUndefined();
  });

  it("real colors still initialize pickers with their own values", () => {
    const plugin = makePlugin();
    const group = {
      uid: "g4",
      name: "G4",
      entries: [],
      styleType: "both",
      textColor: "#ff0000",
      backgroundColor: "#00ff00",
      color: "",
    };
    const modal = openGroupModal(plugin, group);
    const { tColor, bColor } = colorPickers(modal.contentEl);
    expect(tColor.value).toBe("#ff0000");
    expect(bColor.value).toBe("#00ff00");
  });
});
