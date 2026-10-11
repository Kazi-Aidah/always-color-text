/**
 * Highlight vs Highlight Color markdown elements.
 *
 * The "Highlight" element must only match DEFAULT (uncolored) highlights:
 * live preview `.cm-highlight` without a `.cm-highlight-<color>` class, and
 * reading view `mark` without (or with an empty) `data-highlight`.
 *
 * The "Highlight Color" element matches one native color, picked via a
 * second dropdown and stored as `entry.highlightColor` — a single element
 * option plus a color choice, not one element option per color.
 */

import { describe, it, expect } from "vitest";
import {
  MARKDOWN_TARGETS,
  getMarkdownTarget,
} from "./markdownTargets.js";
import {
  HIGHLIGHT_COLORS,
  DEFAULT_HIGHLIGHT_COLOR,
  normalizeHighlightColor,
  buildMarkdownSelector,
  buildRenderedSelector,
  getElementConfig,
} from "./markdownElementConfig.js";
import {
  getTargetLabel,
  getTargetPatternText,
  getTargetPreviewText,
  resolveTargetElement,
} from "./targetLabels.js";
import { matchTargetElementEntry } from "./reverseLookup.js";

const plugin = { t: (key, fallback) => fallback };

describe("highlight targets — registry", () => {
  it("registers Highlight and Highlight Color in the text group", () => {
    const h = getMarkdownTarget("highlight");
    const hc = getMarkdownTarget("highlight-color");
    expect(h).toBeTruthy();
    expect(hc).toBeTruthy();
    expect(h.group).toBe("text");
    expect(hc.group).toBe("text");
    expect(MARKDOWN_TARGETS.map((t) => t.key)).toContain("highlight-color");
  });

  it("exposes the native color list with a red default", () => {
    for (const c of ["red", "orange", "yellow", "green", "blue", "purple"]) {
      expect(HIGHLIGHT_COLORS).toContain(c);
    }
    expect(DEFAULT_HIGHLIGHT_COLOR).toBe("red");
  });

  it("normalizes colors case-insensitively and rejects unknown ones", () => {
    expect(normalizeHighlightColor("RED")).toBe("red");
    expect(normalizeHighlightColor("  Blue ")).toBe("blue");
    expect(normalizeHighlightColor("bogus")).toBeNull();
    expect(normalizeHighlightColor("")).toBeNull();
    expect(normalizeHighlightColor(null)).toBeNull();
  });

  it("exposes the color dropdown config for highlight-color only", () => {
    const cfg = getElementConfig("highlight-color");
    expect(cfg).toBeTruthy();
    expect(cfg.field).toBe("highlightColor");
    expect(cfg.options).toEqual(HIGHLIGHT_COLORS);
    expect(getElementConfig("highlight")).toBeNull();
  });
});

describe("highlight targets — live-preview / reading selectors", () => {
  it("matches only default highlights for the Highlight element", () => {
    const t = getMarkdownTarget("highlight");
    const sel = buildMarkdownSelector(
      t,
      { targetElement: "highlight" },
      false,
    );
    // Default span class is present, every native color class is excluded.
    expect(sel).toContain(".cm-highlight");
    for (const c of HIGHLIGHT_COLORS) {
      expect(sel).toContain(`:not(.cm-highlight-${c})`);
    }
    // Reading view: marks without (or with empty) data-highlight.
    expect(sel).toContain("mark:not([data-highlight])");
    expect(sel).toContain('mark[data-highlight=""]');
    // …and never a specific colored mark.
    expect(sel).not.toContain('mark[data-highlight="red"]');

    const rend = buildRenderedSelector({ targetElement: "highlight" });
    expect(rend).toContain("mark:not([data-highlight])");
    expect(rend).toContain('mark[data-highlight=""]');
    expect(rend).not.toContain('mark[data-highlight="red"]');
  });

  it("matches exactly one color for a Highlight Color entry", () => {
    const t = getMarkdownTarget("highlight-color");
    const sel = buildMarkdownSelector(
      t,
      { targetElement: "highlight-color", highlightColor: "red" },
      false,
    );
    expect(sel).toContain(".cm-highlight.cm-highlight-red");
    expect(sel).toContain('mark[data-highlight="red"]');
    expect(sel).not.toContain(".cm-highlight-blue");
    expect(sel).not.toContain("mark:not([data-highlight])");

    const rend = buildRenderedSelector({
      targetElement: "highlight-color",
      highlightColor: "blue",
    });
    expect(rend).toContain('mark[data-highlight="blue"]');
    expect(rend).not.toContain('mark[data-highlight="red"]');
  });

  it("falls back to any-colored (never default) without a valid color", () => {
    const rend = buildRenderedSelector({ targetElement: "highlight-color" });
    expect(rend).toContain("mark[data-highlight]");
    expect(rend).not.toContain("mark:not([data-highlight])");
  });
});

describe("highlight targets — labels, patterns, previews", () => {
  it("labels the new element Highlight Color", () => {
    expect(getTargetLabel(plugin, "highlight")).toBe("Highlight");
    expect(getTargetLabel(plugin, "highlight-color")).toBe("Highlight Color");
  });

  it("describes the matched CSS per color", () => {
    expect(getTargetPatternText(plugin, "highlight-color", false, "red")).toBe(
      'Targets .cm-highlight-red and mark[data-highlight="red"]',
    );
  });

  it("resolves highlight-color entries as targets", () => {
    expect(
      resolveTargetElement(plugin, {
        targetElement: "highlight-color",
        highlightColor: "red",
      }),
    ).toBe("highlight-color");
  });

  it("previews Highlight Color: <Color>", () => {
    expect(
      getTargetPreviewText(plugin, {
        targetElement: "highlight-color",
        highlightColor: "red",
      }),
    ).toBe("Highlight Color: Red");
    expect(getTargetPreviewText(plugin, { targetElement: "highlight" })).toBe(
      "Highlight",
    );
  });
});

describe("highlight targets — reverse lookup", () => {
  const ctx = (line) => ({
    selectedText: "x",
    lineText: line,
    selStartInLine: 2,
    selEndInLine: 3,
  });

  it("matches ==...== for both highlight and highlight-color", () => {
    expect(
      matchTargetElementEntry({ targetElement: "highlight" }, ctx("==x==")),
    ).toMatchObject({ kind: "markdown", detail: "highlight" });
    expect(
      matchTargetElementEntry(
        { targetElement: "highlight-color", highlightColor: "red" },
        ctx("==x=="),
      ),
    ).toMatchObject({ kind: "markdown", detail: "highlight-color" });
  });

  it("matches nothing outside ==...==", () => {
    expect(
      matchTargetElementEntry({ targetElement: "highlight" }, ctx("plain")),
    ).toBeNull();
    expect(
      matchTargetElementEntry(
        { targetElement: "highlight-color", highlightColor: "red" },
        ctx("plain"),
      ),
    ).toBeNull();
  });
});
