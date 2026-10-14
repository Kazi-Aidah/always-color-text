/**
 * Shared naming modal ("Name New Preset" / "Name New Group") + the shared
 * preview renderer it uses.
 *
 * The modal shows the entry's style applied to the name being typed (falling
 * back to the placeholder text when the field is empty) and only hands the
 * chosen name to onSave — closing without saving creates nothing. Both the
 * preset flow (SaveAsPreset) and the group flow reuse this same modal with
 * different locale keys and fallbacks.
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
    placeholder: "",
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
    removeEventListener(event, fn) {
      const list = this._listeners[event];
      if (!list) return;
      this._listeners[event] = list.filter((f) => f !== fn);
    },
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

vi.mock("obsidian", () => ({
  Modal: class {
    constructor() {
      this.modalEl = { addClass() {}, classList: { add() {} } };
      this.contentEl = { empty() {} };
    }
    open() {}
    close() {}
  },
}));

import { NameStyleModal } from "../NameStyleModal.js";
import { applyPresetPreviewStyle } from "../../utils/presetPreview.js";

function makePlugin(settings = {}) {
  return {
    settings: Object.assign(
      {
        cornerShape: "round",
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
    }),
    generateBorderStyle: () => "",
  };
}

const styleObj = {
  styleType: "both",
  textColor: "#ff0000",
  backgroundColor: "#00ff00",
  backgroundOpacity: 50,
  highlightBorderRadius: 14,
};

// Preset-flow locale wiring, mirroring EditEntryModal._promptSaveEntryStyleAsPreset.
const presetKeys = {
  titleKey: "save_preset_title",
  titleFallback: "Name New Preset",
  labelKey: "save_preset_name",
  labelFallback: "Preset name",
  placeholderKey: "new_preset_name",
  placeholderFallback: "New Preset",
};

function openModal({ defaultName = "New Preset", onSave = () => {} } = {}) {
  const modal = new NameStyleModal(null, makePlugin(), {
    styleObj,
    defaultName,
    onSave,
    ...presetKeys,
  });
  modal.contentEl = makeDomEl("div");
  let closed = false;
  modal.close = () => {
    closed = true;
  };
  modal.onOpen();
  const getSpan = () =>
    modal.contentEl._findAll(
      (n) => n._classes && n._classes.includes("act-tsp-span"),
    )[0];
  return {
    modal,
    isClosed: () => closed,
    input: modal.contentEl._findAll((n) => n._tag === "input")[0],
    getSpan,
    saveBtn: modal.contentEl._findAll(
      (n) => n._classes && n._classes.includes("mod-cta"),
    )[0],
  };
}

describe("NameStyleModal (preset flow)", () => {
  it("titles the dialog 'Name New Preset'", () => {
    const { modal } = openModal();
    const h2 = modal.contentEl._findAll((n) => n._tag === "h2")[0];
    expect(h2.textContent).toBe("Name New Preset");
  });

  it("previews the default name on open", () => {
    const { getSpan } = openModal({ defaultName: "Round copy" });
    expect(getSpan().textContent).toBe("Round copy");
  });

  it("replaces the preview text as the user types", () => {
    const { input, getSpan } = openModal({ defaultName: "Round copy" });
    input.value = "Sunset";
    input._listeners.input.forEach((fn) => fn());
    expect(getSpan().textContent).toBe("Sunset");
  });

  it("falls back to the placeholder text when the field is empty", () => {
    const { input, getSpan } = openModal({ defaultName: "Round copy" });
    input.value = "   ";
    input._listeners.input.forEach((fn) => fn());
    expect(getSpan().textContent).toBe("New Preset");
  });

  it("hands the trimmed name to onSave and closes", () => {
    const onSave = vi.fn();
    const { input, saveBtn, isClosed } = openModal({ onSave });
    input.value = "  My Preset  ";
    saveBtn._listeners.click.forEach((fn) => fn());
    expect(onSave).toHaveBeenCalledWith("My Preset");
    expect(isClosed()).toBe(true);
  });

  it("saves before closing, and still closes when onSave throws", () => {
    const calls = [];
    const { modal, input, saveBtn } = openModal({
      onSave: () => {
        calls.push("save");
        throw new Error("boom");
      },
    });
    modal.close = () => {
      calls.push("close");
    };
    input.value = "Kept Name";
    saveBtn._listeners.click.forEach((fn) => fn());
    expect(calls).toEqual(["save", "close"]);
  });

  it("force-detaches when the platform close leaves the dialog attached", () => {
    const onSave = vi.fn();
    const { modal, input, saveBtn } = openModal({ onSave });
    // Simulate a stale open flag: close() silently no-ops.
    modal.close = () => {};
    modal.isOpen = true;
    const remove = vi.fn();
    modal.containerEl = { isConnected: true, remove };
    input.value = "Forced";
    saveBtn._listeners.click.forEach((fn) => fn());
    expect(onSave).toHaveBeenCalledWith("Forced");
    expect(remove).toHaveBeenCalled();
    expect(modal.isOpen).toBe(false);
  });

  it("passes an empty string through when cleared (caller names it)", () => {
    const onSave = vi.fn();
    const { input, saveBtn } = openModal({ onSave });
    input.value = "";
    saveBtn._listeners.click.forEach((fn) => fn());
    expect(onSave).toHaveBeenCalledWith("");
  });

  it("saves on Enter", () => {
    const onSave = vi.fn();
    const { input } = openModal({ onSave });
    input.value = "Entered Name";
    input._listeners.keydown.forEach((fn) => fn({ key: "Enter", preventDefault() {} }));
    expect(onSave).toHaveBeenCalledWith("Entered Name");
  });

  it("renders the preview with the style's own colours", () => {
    const { getSpan } = openModal({ defaultName: "Style" });
    const style = getSpan().getAttribute("style") || "";
    expect(style).toContain("color:#ff0000");
    expect(style).toContain("rgba-from(#00ff00,50)");
    expect(style).toContain("border-radius:14px");
  });
});

describe("NameStyleModal (group flow)", () => {
  const groupKeys = {
    titleKey: "save_group_title",
    titleFallback: "Name New Group",
    labelKey: "save_group_name",
    labelFallback: "Group name",
    placeholderKey: "new_group_name",
    placeholderFallback: "New Group",
  };

  function openGroupModal({ defaultName = "New Group", onSave = () => {} } = {}) {
    const modal = new NameStyleModal(null, makePlugin(), {
      styleObj,
      defaultName,
      onSave,
      ...groupKeys,
    });
    modal.contentEl = makeDomEl("div");
    modal.close = () => {};
    modal.onOpen();
    return {
      modal,
      input: modal.contentEl._findAll((n) => n._tag === "input")[0],
      getSpan: () =>
        modal.contentEl._findAll(
          (n) => n._classes && n._classes.includes("act-tsp-span"),
        )[0],
    };
  }

  it("uses the group title and hint text", () => {
    const { modal } = openGroupModal();
    const h2 = modal.contentEl._findAll((n) => n._tag === "h2")[0];
    expect(h2.textContent).toBe("Name New Group");
    const input = modal.contentEl._findAll((n) => n._tag === "input")[0];
    expect(input.placeholder).toBe("New Group");
    expect(input.getAttribute("aria-label")).toBe("Group name");
  });

  it("falls back to the group placeholder when empty", () => {
    const { input, getSpan } = openGroupModal({ defaultName: "Round Group" });
    input.value = "";
    input._listeners.input.forEach((fn) => fn());
    expect(getSpan().textContent).toBe("New Group");
  });

  it("hands the name to onSave for the group variant", () => {
    const onSave = vi.fn();
    const { input, getSpan } = openGroupModal({ onSave });
    input.value = "Cities";
    input._listeners.input.forEach((fn) => fn());
    expect(getSpan().textContent).toBe("Cities");
    // Save via Enter (same handler used by the preset flow).
    input._listeners.keydown.forEach((fn) =>
      fn({ key: "Enter", preventDefault() {} }),
    );
    expect(onSave).toHaveBeenCalledWith("Cities");
  });
});

describe("applyPresetPreviewStyle", () => {
  it("writes the text and a styled span into the container", () => {
    const container = makeDomEl("div");
    applyPresetPreviewStyle(makePlugin(), container, styleObj, "Hello");
    const span = container._findAll(
      (n) => n._classes && n._classes.includes("act-tsp-span"),
    )[0];
    expect(span.textContent).toBe("Hello");
    expect(span.getAttribute("style")).toContain("box-decoration-break:clone");
  });

  it("uses the theme accent when the style has no colours", () => {
    const container = makeDomEl("div");
    applyPresetPreviewStyle(
      makePlugin(),
      container,
      { styleType: "highlight", backgroundOpacity: 30 },
      "Accent",
    );
    const span = container._findAll(
      (n) => n._classes && n._classes.includes("act-tsp-span"),
    )[0];
    expect(span.getAttribute("style")).toContain("var(--color-accent)");
  });
});
