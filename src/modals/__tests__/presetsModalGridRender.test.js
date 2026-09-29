/**
 * Presets modal grid rendering.
 *
 * - A preset without a uid must still render: the uid used to be assigned
 *   after the "skip the default preset" check, so against a uid-less default
 *   every such preset matched and vanished from the grid.
 * - A quick style stored in both settings lists (older reorder saves leaked
 *   them into textStylePresets) must render once, not once per list.
 * - The preview border follows the colortype convention via the plugin's
 *   generateBorderStyle (text colour for both/text, background for
 *   highlight) — it used to hard-code the background colour, so a "both"
 *   preset's border disagreed with Edit Highlight Styling.
 */

import { describe, it, expect, vi } from "vitest";

// ---------------------------------------------------------------------------
// Minimal DOM
// ---------------------------------------------------------------------------

function makeStyle() {
  return {
    setProperty(p, v) {
      this[p] = String(v);
    },
    removeProperty(p) {
      delete this[p];
    },
  };
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
    value: "",
    type: "",
    getAttribute(k) {
      return this._attrs[k] ?? null;
    },
    setAttribute(k, v) {
      this._attrs[k] = String(v);
    },
    addClass(...clses) {
      this._classes.push(...clses);
    },
    addEventListener(event, fn) {
      (this._listeners[event] = this._listeners[event] || []).push(fn);
    },
    removeEventListener() {},
    empty() {
      this._children = [];
    },
    createEl(childTag, opts = {}) {
      const child = makeDomEl(childTag);
      if (opts.text !== undefined) child.textContent = opts.text;
      if (opts.type !== undefined) child.type = opts.type;
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
  globalThis.document = {
    createElement: (tag) => makeDomEl(tag),
    body: makeDomEl("body"),
  };
}
if (typeof globalThis.window === "undefined") {
  globalThis.window = { addEventListener() {}, dispatchEvent() {} };
}

vi.mock("obsidian", () => ({
  Modal: class {
    constructor() {
      this.modalEl = { style: {}, addClass() {}, classList: { add() {} } };
      this.contentEl = { empty() {} };
    }
    open() {}
    close() {}
  },
  setIcon() {},
  Menu: class {
    addItem() {
      return this;
    }
    addSeparator() {
      return this;
    }
    showAtMouseEvent() {}
  },
}));

vi.mock("../HighlightStylingModal.js", () => ({
  HighlightStylingModal: class {
    open() {}
  },
}));
vi.mock("../CustomCssModal.js", () => ({ CustomCssModal: class { open() {} } }));
vi.mock("../ConfirmationModal.js", () => ({
  ConfirmationModal: class {
    open() {}
  },
}));
vi.mock("../ReorderPresetsModal.js", () => ({
  ReorderPresetsModal: class {
    open() {}
  },
}));

import { TextStylePresetsModal } from "../TextStylePresetsModal.js";
import { resolveBorderSourceColor } from "../../services/patternCompiler.js";

function makePlugin(settings) {
  return {
    settings: Object.assign(
      {
        quickStyles: [],
        backgroundOpacity: 35,
        highlightBorderRadius: 4,
        cornerShape: "round",
        highlightHorizontalPadding: 4,
        highlightVerticalPadding: 0,
        enableBorderThickness: false,
        borderStyle: "full",
        borderLineStyle: "solid",
        borderOpacity: 100,
        borderThickness: 1,
        enableCustomCss: false,
      },
      settings,
    ),
    t: (k, d) => d,
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
    },
    hexToRgba: (hex, op) => `rgba-from(${hex},${op})`,
    getHighlightParams: (entry) => ({
      opacity: (entry && entry.backgroundOpacity) || 35,
      radius: (entry && entry.highlightBorderRadius) || 4,
      hPad: 4,
      vPad: 0,
      enableBorder: false,
      borderThickness: 1,
      borderLineStyle: "solid",
      borderStyle: "full",
      borderOpacity: 100,
    }),
    // Mirror the plugin: the preview delegates to this generator, which
    // picks the border source colour by colortype.
    generateBorderStyle(textColor, backgroundColor, entry) {
      const src = resolveBorderSourceColor(
        entry && entry.styleType,
        textColor,
        backgroundColor,
        this.isValidHexColor,
      );
      return src ? ` border: 1px solid ${src} !important;` : "";
    },
  };
}

function renderGrid(plugin) {
  const modal = new TextStylePresetsModal(null, plugin, null);
  modal.contentEl = makeDomEl("div");
  modal._buildContent();
  return modal.contentEl._findAll(
    (n) => n._classes && n._classes.includes("act-tsp-box"),
  );
}

const defaultPreset = {
  uid: "tsp-default",
  name: "Default",
  isDefault: true,
  styleType: "highlight",
};

describe("presets modal grid", () => {
  it("gives uid-less presets an identity instead of dropping them", () => {
    // no isDefault flag either: presets[0] becomes the default while still
    // uid-less, so every other uid-less preset compared equal to it
    const first = { name: "Legacy One", styleType: "highlight" };
    const second = { name: "Legacy Two", styleType: "both" };
    const plugin = makePlugin({
      textStylePresets: [first, second],
    });

    const boxes = renderGrid(plugin);

    expect(boxes.length).toBe(1);
    expect(first.uid).toMatch(/^qs-/);
    expect(second.uid).toMatch(/^qs-/);
  });

  it("renders a quick style stored in both lists only once", () => {
    const leaked = { uid: "1767537606270rtp1rf9xh9o", name: "New Style" };
    const plugin = makePlugin({
      textStylePresets: [defaultPreset, leaked],
      quickStyles: [leaked],
    });

    const boxes = renderGrid(plugin);

    expect(boxes.length).toBe(1);
  });

  it("keeps rendering the built-in presets alongside custom ones", () => {
    const sharp = { uid: "tsp-sharp", name: "Sharp", styleType: "highlight" };
    const custom = {
      uid: "tsp-mumdu2wudlu7ubvhdo",
      name: "New Preset",
      styleType: "both",
    };
    const plugin = makePlugin({
      textStylePresets: [defaultPreset, sharp, custom],
    });

    const boxes = renderGrid(plugin);

    expect(boxes.length).toBe(2);
  });

  function spanStyle(box) {
    const span = box._findAll(
      (n) => n._classes && n._classes.includes("act-tsp-span"),
    )[0];
    return (span && span.getAttribute("style")) || "";
  }

  it("borders a 'both' preset with its TEXT colour", () => {
    const both = {
      uid: "tsp-both-border",
      name: "Both",
      styleType: "both",
      textColor: "#eca8ff",
      backgroundColor: "#8854d0",
    };
    const plugin = makePlugin({ textStylePresets: [defaultPreset, both] });

    const boxes = renderGrid(plugin);
    const style = spanStyle(boxes[0]);

    expect(style).toContain("border: 1px solid #eca8ff");
    expect(style).not.toContain("border: 1px solid #8854d0");
  });

  it("borders a 'highlight' preset with its BACKGROUND colour", () => {
    const hl = {
      uid: "tsp-hl-border",
      name: "Highlight",
      styleType: "highlight",
      textColor: "#eca8ff",
      backgroundColor: "#8854d0",
    };
    const plugin = makePlugin({ textStylePresets: [defaultPreset, hl] });

    const boxes = renderGrid(plugin);
    const style = spanStyle(boxes[0]);

    expect(style).toContain("border: 1px solid #8854d0");
    expect(style).not.toContain("border: 1px solid #eca8ff");
  });
});
