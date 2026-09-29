/**
 * Filtered markdown elements (File Name, Folder Name, Tab Title, Inline Title,
 * Tag) must preview as "Element: <input>" — e.g. "File Name: Metro" — in the
 * Style Target / Style Text, Edit Highlight Styling and Edit Custom CSS
 * modals. The element name alone hid the filter that actually decides what
 * gets colored, and the two styling modals showed the dead selector text
 * ("Targets .nav-file-title-content") instead of the element at all.
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
    removeAttribute(k) {
      delete this._attrs[k];
      if (k === "style") this.style = makeStyle();
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
    createTextNode: (text) => ({ _tag: "#text", textContent: text }),
    body: makeDomEl("body"),
    head: makeDomEl("head"),
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
  class FuzzySuggestModal extends Modal {}
  class SuggestModal extends Modal {}
  return { Modal, Menu, setIcon, Notice, FuzzySuggestModal, SuggestModal };
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

import { getTargetPreviewText } from "../../utils/targetLabels.js";
import { resolveEditEntryPreviewText } from "../EditEntryModal.js";
import { HighlightStylingModal } from "../HighlightStylingModal.js";
import { CustomCssModal } from "../CustomCssModal.js";

const plugin = { t: (key, fallback) => fallback };

// ---------------------------------------------------------------------------
// Fake plugin (Highlight Styling / Custom CSS previews need the color helpers)
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
    isValidHexColor: (hex) =>
      typeof hex === "string" && /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim()),
    hexToRgba: (hex, op) => `rgba-from(${hex},${op})`,
    getHighlightParams: function () {
      const s = this.settings;
      return {
        opacity: s.backgroundOpacity ?? 25,
        radius: s.highlightBorderRadius ?? 8,
        hPad: s.highlightHorizontalPadding ?? 4,
        vPad: s.highlightVerticalPadding ?? 0,
        cornerShape: s.cornerShape ?? "round",
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

function findSpan(root, text) {
  const spans = root._findAll((n) => n._tag === "span" && n.textContent === text);
  return spans[spans.length - 1] || null;
}

const targetEntry = (extra) =>
  Object.assign(
    {
      uid: "t1",
      isRegex: false,
      pattern: "Targets .nav-file-title-content",
      presetLabel: "File Name (file explorer)",
      targetElement: "file-name",
      titleFilter: "Metro",
    },
    extra,
  );

describe("getTargetPreviewText", () => {
  const cases = [
    ["file-name", "titleFilter", "File Name", "Metro"],
    ["folder-name", "titleFilter", "Folder Name", "Metro"],
    ["tab-title", "titleFilter", "Tab Title", "Metro"],
    ["inline-title", "titleFilter", "Inline Title", "Metro"],
    ["tag", "tagFilter", "Tag", "project"],
  ];

  it("reads element name + filter input for the filtered elements", () => {
    for (const [key, field, label, value] of cases) {
      expect(
        getTargetPreviewText(plugin, {
          targetElement: key,
          [field]: value,
        }),
      ).toBe(`${label}: ${value}`);
    }
  });

  it("drops the colon when the input is empty or whitespace", () => {
    for (const [key, field, label] of cases) {
      expect(getTargetPreviewText(plugin, { targetElement: key })).toBe(label);
      expect(
        getTargetPreviewText(plugin, { targetElement: key, [field]: "   " }),
      ).toBe(label);
    }
  });

  it("names every labelled element, but only the filtered ones take input", () => {
    // No text input next to the dropdown → the name alone (same label the
    // Style Target modal has always shown).
    expect(getTargetPreviewText(plugin, { targetElement: "strong" })).toBe(
      "Bold",
    );
    expect(
      getTargetPreviewText(plugin, {
        targetElement: "heading",
        headingLevels: "1, 2",
      }),
    ).toBe("Heading");
    // Nothing labelable → the caller keeps its own fallback chain.
    expect(getTargetPreviewText(plugin, { pattern: "plain word" })).toBe("");
    expect(getTargetPreviewText(plugin, null)).toBe("");
  });
});

describe("Style Target / Style Text modal preview", () => {
  it("shows the filter input next to the element name", () => {
    expect(
      resolveEditEntryPreviewText({
        plugin,
        entry: targetEntry(),
        isTarget: true,
        raw: "Targets .nav-file-title-content",
      }),
    ).toBe("File Name: Metro");
  });

  it("falls back to the element name when the input is cleared", () => {
    expect(
      resolveEditEntryPreviewText({
        plugin,
        entry: targetEntry({ titleFilter: "" }),
        isTarget: true,
        raw: "Targets .nav-file-title-content",
      }),
    ).toBe("File Name");
  });

  it("keeps the label → preset → typed text chain for the other targets", () => {
    expect(
      resolveEditEntryPreviewText({
        plugin,
        entry: { targetElement: "strong", presetLabel: "Bold" },
        isTarget: true,
        raw: "Targets .cm-strong and strong",
      }),
    ).toBe("Bold");
    expect(
      resolveEditEntryPreviewText({
        plugin,
        entry: { pattern: "metro", isRegex: true, presetLabel: "City" },
        isTarget: false,
        raw: "metro",
      }),
    ).toBe("City");
    expect(
      resolveEditEntryPreviewText({
        plugin,
        entry: { pattern: "metro", isRegex: false },
        isTarget: false,
        raw: "metro",
      }),
    ).toBe("metro");
  });
});

describe("Edit Highlight Styling modal preview", () => {
  it("previews a filtered file name as 'File Name: Metro'", () => {
    const plugin2 = makePlugin();
    const entry = targetEntry();
    const modal = new HighlightStylingModal({}, plugin2, entry, null, null);
    modal.onOpen();

    expect(findSpan(modal.contentEl, "File Name: Metro")).toBeTruthy();
  });

  it("previews a filtered tag as 'Tag: project'", () => {
    const plugin2 = makePlugin();
    const entry = {
      uid: "t2",
      isRegex: false,
      targetElement: "tag",
      tagFilter: "project",
      pattern: "Targets tag",
    };
    const modal = new HighlightStylingModal({}, plugin2, entry, null, null);
    modal.onOpen();

    expect(findSpan(modal.contentEl, "Tag: project")).toBeTruthy();
  });

  it("keeps showing plain pattern text for non-target entries", () => {
    const plugin2 = makePlugin();
    const entry = {
      uid: "t3",
      isRegex: false,
      pattern: "stale-css",
      styleType: "both",
      textColor: "#ff0000",
      backgroundColor: "#00ff00",
      color: "",
    };
    const modal = new HighlightStylingModal({}, plugin2, entry, null, null);
    modal.onOpen();

    expect(findSpan(modal.contentEl, "stale-css")).toBeTruthy();
  });
});

describe("Edit Custom CSS modal preview", () => {
  it("previews a filtered file name as 'File Name: Metro'", () => {
    const modal = new CustomCssModal({}, makePlugin(), targetEntry());
    modal.onOpen();

    expect(modal._previewSpan.textContent).toBe("File Name: Metro");
  });

  it("keeps the pattern fallback when the entry is not a filtered element", () => {
    const modal = new CustomCssModal(
      {},
      makePlugin(),
      { uid: "t4", isRegex: false, pattern: "plain word" },
    );
    modal.onOpen();

    expect(modal._previewSpan.textContent).toBe("plain word");
  });
});
