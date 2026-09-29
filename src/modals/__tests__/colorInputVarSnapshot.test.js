/**
 * Built-in text style presets ship var() colours (var(--color-accent),
 * var(--text-normal)). Opening Edit Highlight Styling snapshots that var()
 * on the native colour input and shows its resolved colour.
 *
 * The snapshot used to win every read, so after the user moved the picker
 * the entry sync and save kept writing the old var() back — the picker
 * snapped to its open-time colour and the new colour never reached the
 * preset. A user pick is newer than the snapshot and must win.
 */

import { describe, it, expect, vi } from "vitest";

// ---------------------------------------------------------------------------
// Minimal DOM (resolveVarToHex resolves through getComputedStyle)
// ---------------------------------------------------------------------------

function makeStyle() {
  return {
    color: "",
    display: "",
    setProperty(p, v) {
      this[p] = String(v);
    },
    removeProperty(p) {
      delete this[p];
    },
  };
}

function makeDomEl(tag = "div") {
  const children = [];
  return {
    _tag: tag,
    style: makeStyle(),
    dataset: {},
    appendChild(child) {
      children.push(child);
      return child;
    },
    removeChild(child) {
      const i = children.indexOf(child);
      if (i !== -1) children.splice(i, 1);
      return child;
    },
  };
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
  Menu: class {},
  Notice: class {},
}));

vi.mock("../ColorPickerModal.js", () => ({
  ColorPickerModal: class {
    open() {}
  },
}));

vi.mock("../TextStylePresetsModal.js", () => ({
  TextStylePresetsModal: class {
    open() {}
  },
}));

import { setColorInputValue, getColorInputValue } from "../HighlightStylingModal.js";

const makeInput = () => ({ type: "color", value: "#000000", dataset: {} });

describe("var() snapshot on the colour pickers", () => {
  it("returns the var() while the picker still shows its resolved colour", () => {
    const input = makeInput();
    setColorInputValue(input, "var(--color-accent)");

    expect(input.dataset.varColor).toBe("var(--color-accent)");
    expect(input.value).toBe("#7c3aed");
    expect(getColorInputValue(input)).toBe("var(--color-accent)");
  });

  it("returns the user's pick once the picker moved off the resolved colour", () => {
    const input = makeInput();
    setColorInputValue(input, "var(--color-accent)");
    input.value = "#123456";

    expect(getColorInputValue(input)).toBe("#123456");
  });

  it("writes the picked colour back as a real colour, dropping the snapshot", () => {
    const input = makeInput();
    setColorInputValue(input, "var(--text-normal)");
    input.value = "#abcdef";
    // what the entry sync and save do with the value they read
    setColorInputValue(input, getColorInputValue(input));

    expect(input.dataset.varColor).toBeUndefined();
    expect(input.value).toBe("#abcdef");
    expect(getColorInputValue(input)).toBe("#abcdef");
  });

  it("keeps plain hex colours on the input value", () => {
    const input = makeInput();
    setColorInputValue(input, "#ff0000");

    expect(input.dataset.varColor).toBeUndefined();
    expect(getColorInputValue(input)).toBe("#ff0000");
  });
});
