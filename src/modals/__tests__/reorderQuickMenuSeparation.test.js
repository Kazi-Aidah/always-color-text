/**
 * Reorder Presets: Quick Menu arrangement and regular preset ordering are
 * two separate lists that must never disturb each other.
 *
 * The dialog shows one combined row list (and a filtered one behind
 * "Show Quick Menu items only"), but the two views reorder DIFFERENT
 * settings:
 * - Quick Menu only → settings.quickMenuOrder, the menu's own arrangement
 *   read by getQuickMenuStyles(). The old save zipped the filtered rows
 *   back into textStylePresets/quickStyles as well, so arranging the menu
 *   reshuffled regular presets the filter had hidden (e.g. [A,B,C] with A,C
 *   visible became [C,A,B] — B moved without ever being dragged).
 * - Full list → textStylePresets + quickStyles (regular ordering). An
 *   existing quickMenuOrder must stay untouched.
 * A full save also snapshots quickMenuOrder first when the vault has none
 * yet, so even the FIRST regular reorder cannot drag the menu along.
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
    value: "",
    checked: false,
    type: "",
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
    insertBefore(child, ref) {
      this._children = this._children.filter((x) => x !== child);
      const idx = this._children.indexOf(ref);
      if (idx === -1) this._children.push(child);
      else this._children.splice(idx, 0, child);
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
    // The only selector form the modal uses: ".act-reorder-row".
    querySelectorAll(sel) {
      if (typeof sel !== "string" || !sel.startsWith(".")) return [];
      const cls = sel.slice(1);
      const out = [];
      this._walk((n) => {
        if ((n._classes || []).includes(cls)) out.push(n);
      });
      return out;
    },
    _walk(fn) {
      fn(this);
      (this._children || []).forEach((c) => c._walk(fn));
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
    addEventListener() {},
    removeEventListener() {},
  };
}
if (typeof globalThis.window === "undefined") {
  globalThis.window = {};
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
  class Menu {
    addItem() {
      return this;
    }
    addSeparator() {
      return this;
    }
    showAtMouseEvent() {}
  }
  const setIcon = () => {};
  return { Modal, Menu, setIcon };
});

import { ReorderPresetsModal } from "../ReorderPresetsModal.js";

function makePlugin(settings) {
  return {
    settings,
    t: (k, d) => d,
    isValidHexColor: (hex) =>
      typeof hex === "string" && /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex),
    hexToRgba: (hex, op) => `rgba-from(${hex},${op})`,
    getHighlightParams: () => ({
      opacity: 35,
      radius: 4,
      hPad: 4,
      vPad: 0,
      cornerShape: settings.cornerShape || "round",
      enableBorder: false,
      borderStyle: "full",
      borderLineStyle: "solid",
      borderOpacity: 100,
      borderThickness: 1,
    }),
    generateBorderStyle: () => "",
    saveSettings: vi.fn(async () => {}),
  };
}

// Real seed preset for the default row (reconcile keeps seeds on its own),
// plus custom presets/quick styles with distinctive uids.
function makeSettings() {
  const seedDefault = {
    uid: "tsp-default",
    name: "Default",
    isDefault: true,
    styleType: "highlight",
    textColor: "var(--text-normal)",
    backgroundColor: "var(--color-accent)",
  };
  const presetA = { uid: "tsp-sep-a", name: "Alpha", styleType: "highlight", showInQuickMenu: true };
  const presetB = { uid: "tsp-sep-b", name: "Beta", styleType: "highlight", showInQuickMenu: true };
  const presetC = { uid: "tsp-sep-c", name: "Gamma", styleType: "highlight" }; // regular list only
  const quickStyle = { uid: "qs-sep-1", name: "Quick One", styleType: "both" };
  return {
    settings: {
      textStylePresets: [seedDefault, presetA, presetB, presetC],
      quickStyles: [quickStyle],
      cornerShape: "round",
    },
  };
}

function openModal(settings, quickMenuOnly) {
  const plugin = makePlugin(settings);
  const modal = new ReorderPresetsModal({}, plugin, null);
  modal._quickMenuOnly = quickMenuOnly;
  modal.onOpen();
  return { modal, plugin, container: modal._listContainer };
}

const rowUids = (container) =>
  container
    .querySelectorAll(".act-reorder-row")
    .map((r) => r.getAttribute("data-uid"));

// Simulate a completed drag: place the given uids in that order.
function moveTo(container, uids) {
  const rows = container.querySelectorAll(".act-reorder-row");
  const byUid = new Map(rows.map((r) => [r.getAttribute("data-uid"), r]));
  rows.forEach((r) => container.removeChild(r));
  uids.forEach((u) => container.appendChild(byUid.get(u)));
}

describe("reorder modal: quick menu vs regular preset ordering", () => {
  it("Quick Menu only: saves only quickMenuOrder, regular lists stay untouched", () => {
    const { settings } = makeSettings();
    settings.quickMenuOrder = ["tsp-sep-b", "qs-sep-1", "tsp-sep-a"];
    const { modal, plugin, container } = openModal(settings, true);

    // Rows follow the menu's saved arrangement, not the grouped regular order
    // (grouped would be [qs-sep-1, tsp-sep-a, tsp-sep-b]); the unflagged
    // preset and the default preset have no row here.
    expect(rowUids(container)).toEqual(["tsp-sep-b", "qs-sep-1", "tsp-sep-a"]);

    const presetsBefore = settings.textStylePresets;
    const quickBefore = settings.quickStyles;

    moveTo(container, ["tsp-sep-a", "tsp-sep-b", "qs-sep-1"]);
    modal.onClose();

    expect(settings.quickMenuOrder).toEqual(["tsp-sep-a", "tsp-sep-b", "qs-sep-1"]);
    // Identity: the regular lists are not even reassigned by this save.
    expect(settings.textStylePresets).toBe(presetsBefore);
    expect(settings.quickStyles).toBe(quickBefore);
    expect(plugin.saveSettings).toHaveBeenCalled();
  });

  it("Full list: saves only the regular lists, quickMenuOrder stays untouched", () => {
    const { settings } = makeSettings();
    settings.quickMenuOrder = ["tsp-sep-b", "qs-sep-1", "tsp-sep-a"];
    const { modal, container } = openModal(settings, false);

    expect(rowUids(container)).toEqual(["qs-sep-1", "tsp-sep-a", "tsp-sep-b", "tsp-sep-c"]);

    const quickOrderBefore = settings.quickMenuOrder;
    moveTo(container, ["qs-sep-1", "tsp-sep-b", "tsp-sep-c", "tsp-sep-a"]);
    modal.onClose();

    expect(settings.quickMenuOrder).toBe(quickOrderBefore);
    expect(settings.textStylePresets.map((p) => p.uid)).toEqual([
      "tsp-default",
      "tsp-sep-b",
      "tsp-sep-c",
      "tsp-sep-a",
    ]);
    expect(settings.quickStyles.map((s) => s.uid)).toEqual(["qs-sep-1"]);
  });

  it("Full list: snapshots the menu arrangement first when the vault has none", () => {
    const { settings } = makeSettings();
    // No quickMenuOrder yet (older vault, no member ever arranged).
    const { modal, container } = openModal(settings, false);

    moveTo(container, ["qs-sep-1", "tsp-sep-b", "tsp-sep-c", "tsp-sep-a"]);
    modal.onClose();

    // The regular lists take the dragged order...
    expect(settings.textStylePresets.map((p) => p.uid)).toEqual([
      "tsp-default",
      "tsp-sep-b",
      "tsp-sep-c",
      "tsp-sep-a",
    ]);
    // ...but the menu keeps the PRE-reorder arrangement (quick styles first,
    // then flagged presets in their old order) — not the post-reorder
    // derived order [qs-sep-1, tsp-sep-b, tsp-sep-a] — so this reorder
    // cannot drag Quick Menu items along either.
    expect(settings.quickMenuOrder).toEqual(["qs-sep-1", "tsp-sep-a", "tsp-sep-b"]);
  });

  it("Quick Menu only: a preset outside the menu never enters the arrangement", () => {
    const { settings } = makeSettings();
    const { modal, container } = openModal(settings, true);

    // Gamma is not flagged, so it is filtered out of the view...
    expect(rowUids(container)).not.toContain("tsp-sep-c");
    // ...and saving must not smuggle it into the menu arrangement.
    modal.onClose();
    expect(settings.quickMenuOrder).not.toContain("tsp-sep-c");
  });
});
