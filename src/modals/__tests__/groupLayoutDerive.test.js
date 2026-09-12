/**
 * Group highlight styling / custom CSS must apply regardless of colortype.
 * The colortype gates structured colors only — layout (radius, shape,
 * padding, border) is emitted whenever explicitly set, even for text-only /
 * per-entry entries and groups.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => {
  class Modal {}
  function setIcon() {}
  return { Modal, setIcon };
});

import {
  deriveHighlightCssFromEntry,
  patchCssLayoutFromEntry,
} from "../CustomCssModal.js";

function makePlugin() {
  return {
    settings: {
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
    },
    hexToRgba: (hex, op) => `rgba(${hex},${op})`,
    sanitizeCssDeclarations: (css) => css,
  };
}

describe("deriveHighlightCssFromEntry layout gating", () => {
  it("per-entry group with layout emits geometry but no colors", () => {
    const plugin = makePlugin();
    const group = {
      uid: "g",
      entries: [],
      styleType: undefined,
      color: undefined,
      textColor: undefined,
      backgroundColor: undefined,
      highlightBorderRadius: 6,
      highlightHorizontalPadding: 4,
      highlightVerticalPadding: 2,
      enableBorderThickness: true,
      borderThickness: 2,
      borderLineStyle: "solid",
      borderStyle: "full",
    };
    const css = deriveHighlightCssFromEntry(group, plugin);
    expect(css).toContain("border-radius: 6px");
    expect(css).toContain("padding: 2px 4px");
    expect(css).toContain("border: 2px solid currentColor");
    expect(css).not.toMatch(/(^|;)\s*color\s*:/);
    expect(css).not.toMatch(/(^|;)\s*background-color\s*:/);
  });

  it("plain text entry without layout stays geometry-free", () => {
    const plugin = makePlugin();
    const css = deriveHighlightCssFromEntry(
      { pattern: "x", styleType: "text", color: "#ff0000" },
      plugin,
    );
    expect(css).toContain("color: #ff0000");
    expect(css).not.toContain("border-radius");
    expect(css).not.toContain("padding:");
  });

  it("text entry with explicit radius emits geometry", () => {
    const plugin = makePlugin();
    const css = deriveHighlightCssFromEntry(
      {
        pattern: "x",
        styleType: "text",
        color: "#ff0000",
        highlightBorderRadius: 10,
      },
      plugin,
    );
    expect(css).toContain("border-radius: 10px");
  });

  it("highlight entries derive borders from the background, never text", () => {
    const plugin = makePlugin();
    const css = deriveHighlightCssFromEntry(
      {
        pattern: "hl",
        styleType: "highlight",
        textColor: "#ff0000",
        backgroundColor: "#00ff00",
        enableBorderThickness: true,
        borderThickness: 2,
        borderLineStyle: "solid",
        borderStyle: "full",
      },
      plugin,
    );
    expect(css).toContain("border: 2px solid #00ff00");
    // No border declaration may carry the text color.
    const borderLines = css
      .split(";")
      .map((s) => s.trim())
      .filter((s) => /^border(-top|-bottom|-left|-right)?\s*:/.test(s));
    expect(borderLines.length).toBeGreaterThan(0);
    for (const line of borderLines) expect(line).not.toContain("#ff0000");
  });

  it("patchCssLayoutFromEntry uses background for highlight borders", () => {
    const plugin = makePlugin();
    const out = patchCssLayoutFromEntry(
      "background-color: rgba(0,255,0,0.3);\nborder: 2px solid #ff0000;",
      {
        pattern: "hl",
        styleType: "highlight",
        textColor: "#ff0000",
        backgroundColor: "#00ff00",
        enableBorderThickness: true,
        borderThickness: 2,
        borderLineStyle: "solid",
        borderStyle: "full",
      },
      plugin,
    );
    expect(out).toContain("border: 2px solid #00ff00");
    expect(out).not.toContain("#ff0000");
  });

  it("patchCssLayoutFromEntry patches layout for text entries with layout set", () => {
    const plugin = makePlugin();
    const out = patchCssLayoutFromEntry(
      "color: #ff0000;\nborder-radius: 4px;",
      {
        pattern: "x",
        styleType: "text",
        color: "#ff0000",
        highlightBorderRadius: 12,
      },
      plugin,
    );
    expect(out).toContain("border-radius: 12px");
    expect(out).toContain("color: #ff0000");
  });
});
