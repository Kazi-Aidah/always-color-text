/**
 * Right-click on an entry's color swatch (colored text, word group, quick
 * colors, regex testers) opens the pick-color modal with BOTH panels, so the
 * other color stays settable from there. Two things used to hide one of them:
 * the entry's color type (text → only the text panel, highlight → only the
 * highlight panel) and a single-panel colorPickerMode layout. The flag makes
 * the swatch pickers immune to both, while the regular picker keeps honoring
 * the user's layout choice.
 */

import { readFileSync } from "node:fs";
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
      store[p] = v;
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
      this._attrs[k] = v;
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

function makePlugin(colorPickerMode = "both") {
  return {
    settings: {
      colorPickerMode,
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

/** A text-typed entry: historically it could only ever show the text panel. */
function textEntry() {
  return {
    uid: "e1",
    pattern: "hello",
    isRegex: false,
    styleType: "text",
    color: "#ff0000",
    textColor: null,
    backgroundColor: null,
  };
}

function build(plugin, { mode, entry, forceBoth, preFillBg = null }) {
  const modal = new ColorPickerModal(
    {},
    plugin,
    () => {},
    mode,
    entry ? entry.pattern : "",
    false,
    "text",
    entry,
  );
  if (forceBoth) modal._forceBothPanels = true;
  modal._preFillTextColor = "#ff0000";
  if (preFillBg) {
    modal._preFillBgColor = preFillBg;
    modal._preFillBorderColor = preFillBg;
  }
  modal.onOpen();
  return modal;
}

const panelOrder = (modal) => Object.keys(modal.panelStates);

describe("_forceBothPanels: right-click swatch pickers show both panels", () => {
  it("overrides a text-typed entry (mode \"text\")", () => {
    const modal = build(makePlugin("both"), {
      mode: "text",
      entry: textEntry(),
      forceBoth: true,
    });
    expect(panelOrder(modal)).toEqual(["text", "background"]);
  });

  it("overrides a highlight-typed entry (mode \"background\")", () => {
    const modal = build(makePlugin("both"), {
      mode: "background",
      entry: textEntry(),
      forceBoth: true,
    });
    expect(panelOrder(modal)).toEqual(["text", "background"]);
  });

  it("overrides a single-panel colorPickerMode layout", () => {
    const modal = build(makePlugin("text"), {
      mode: "text-and-background",
      entry: textEntry(),
      forceBoth: true,
    });
    expect(panelOrder(modal)).toEqual(["text", "background"]);
  });

  it("keeps the user's two-panel orientation", () => {
    const modal = build(makePlugin("both-bg-left"), {
      mode: "text",
      entry: textEntry(),
      forceBoth: true,
    });
    expect(panelOrder(modal)).toEqual(["background", "text"]);
  });

  it("prefills the other channel so it can be edited too", () => {
    const modal = build(makePlugin("text"), {
      mode: "text",
      entry: textEntry(),
      forceBoth: true,
      preFillBg: "#00ff00",
    });
    // The bg panel exists and holds the prefilled color — not an empty
    // channel the user could never reach before.
    expect(modal.panelStates.background).toBeTruthy();
    expect(modal.selectedBgColor).toBe("#00ff00");
    expect(modal.selectedTextColor).toBe("#ff0000");
  });
});

describe("the regular picker still honors its own mode and layout", () => {
  it("a single-panel entry color type stays single without the flag", () => {
    const modal = build(makePlugin("both"), {
      mode: "text",
      entry: textEntry(),
      forceBoth: false,
    });
    expect(panelOrder(modal)).toEqual(["text"]);
  });

  it("a single-panel colorPickerMode layout stays single without the flag", () => {
    const modal = build(makePlugin("background"), {
      mode: "text-and-background",
      entry: textEntry(),
      forceBoth: false,
    });
    expect(panelOrder(modal)).toEqual(["background"]);
  });
});

// The flag has to be set by every right-click swatch flow — a new one that
// forgets it silently regains the single-panel dead end this fixes.
describe("right-click swatch flows opt in", () => {
  const read = (rel) => readFileSync(new URL(rel, import.meta.url), "utf8");
  const flag = /modal\._forceBothPanels = true;/g;

  const optIn = [
    ["EditEntryModal.js (colored text entries)", "../EditEntryModal.js", 1],
    ["HighlightStylingModal.js", "../HighlightStylingModal.js", 1],
    ["EditWordGroupModal.js (text + highlight swatch)", "../EditWordGroupModal.js", 2],
    ["SettingsTab.js (entry row + quick colors)", "../../settings/SettingsTab.js", 2],
    ["QuickMenuColorsModal.js", "../QuickMenuColorsModal.js", 1],
    ["RegexTesterModal.js", "../RegexTesterModal.js", 2],
    ["RealTimeRegexTesterModal.js", "../RealTimeRegexTesterModal.js", 2],
  ];

  for (const [name, rel, min] of optIn) {
    it(`${name} sets _forceBothPanels`, () => {
      expect((read(rel).match(flag) || []).length).toBeGreaterThanOrEqual(min);
    });
  }

  it("both entry editors upgrade the color type when both colors are set", () => {
    // Picking the other channel only renders if the color type becomes
    // "both" — otherwise the form drops the color it does not store.
    for (const rel of ["../EditEntryModal.js", "../HighlightStylingModal.js"]) {
      expect(read(rel)).toContain(
        'if (tc && bc && styleSelect.value !== "both")',
      );
    }
  });
});
