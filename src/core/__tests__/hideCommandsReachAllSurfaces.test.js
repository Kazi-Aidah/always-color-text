/**
 * Regression: "Hide Highlights" / "Hide Text Colors" must reach EVERY
 * rendering surface.
 *
 * The two commands are cheap to flip but expensive to keep correct: the
 * plugin paints through CM6 decorations, reading-view DOM, the
 * markdown-element stylesheet, line-target <style> sheets, titles, tags,
 * marks, callouts/tables/Bases and list/task markers. Historically only
 * `getSortedWordEntries()` filtered the entry list, so a surface that
 * re-derives colors from `settings` directly kept painting the channel the
 * user just hid.
 *
 * These are source-level assertions (same approach as
 * globalToggleCssGate.test.js) because the paint sites are spread across a
 * single ~21k-line module that cannot be imported without Obsidian.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..", "..");
const mainSrc = readFileSync(join(ROOT, "src", "core", "AlwaysColorText.js"), "utf8");

/** Split the module into its (2-space indented) class methods. */
function classMethods(src) {
  const lines = src.split("\n");
  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    if (
      /^  (?:async\s+)?[A-Za-z_$][\w$]*\s*\(/.test(lines[i]) ||
      /^  [A-Za-z_$][\w$]*\s*=\s*(?:async\s*)?\(/.test(lines[i])
    ) {
      starts.push({ i, line: lines[i].trim() });
    }
  }
  return starts.map((s, k) => ({
    name: s.line
      .replace(/^\s*(?:async\s+|get\s+|set\s+)?/, "")
      .replace(/[\(:=].*$/, ""),
    line: s.i + 1,
    body: lines
      .slice(s.i, k + 1 < starts.length ? starts[k + 1].i : lines.length)
      .join("\n"),
  }));
}

/** Any statement that WRITES a visible colour / box onto the DOM. */
const PAINTS =
  /(setProperty\(\s*["''](color|background-color|background)["'']|\.style\.color\s*=|\.style\.backgroundColor\s*=|backgroundColor\s*=|accentColor\s*=|--act-marker-color|setProperty\(\s*["'']--highlight-(color|background)["''])/;

/** Resolving the two commands, one way or another. */
const CONSULTS_FLAGS =
  /(hideTextColors|hideHighlights|getHideFlags|resolveChannels|_markerColorFor)/;

/**
 * Methods that write colours without consulting the flags — each one is a
 * legitimate exception; justify any addition here.
 *
 * - clearMarkdownElementDecorations / neutralizeExistingHighlightBackgrounds:
 *   they REMOVE paint (or paint the neutralizer), they are the teardown side
 * - compressEntry / loadSettings / saveEntry / savePickedColorsForSelection:
 *   settings (de)serialisation, nothing is painted
 * - hexToRgba: colour maths
 * - _applyQuickColorACT: writes a new word ENTRY from an explicit user action;
 *   the flags are applied later, when that entry is painted
 * - extractSelectedTextStyles: reads computed styles for the colour picker
 * - openSettingsAndFocusRegex: settings-modal focus helper
 */
const KNOWN_NON_PAINTING = new Set([
  "clearMarkdownElementDecorations",
  "neutralizeExistingHighlightBackgrounds",
  "compressEntry",
  "loadSettings",
  "saveEntry",
  "savePickedColorsForSelection",
  "hexToRgba",
  "_applyQuickColorACT",
  "extractSelectedTextStyles",
  "openSettingsAndFocusRegex",
]);

describe("hide commands reach every paint site", () => {
  const methods = classMethods(mainSrc);

  it("finds the class methods in AlwaysColorText.js", () => {
    expect(methods.length).toBeGreaterThan(150);
  });

  it("has no unwhitelisted paint site that ignores the hide flags", () => {
    const offenders = methods
      .filter((m) => PAINTS.test(m.body))
      .filter((m) => !CONSULTS_FLAGS.test(m.body))
      .filter((m) => !KNOWN_NON_PAINTING.has(m.name))
      .map((m) => `${m.name} (line ${m.line})`);

    expect(offenders).toEqual([]);
  });

  it("keeps the whitelist honest (no stale entries)", () => {
    const names = new Set(methods.map((m) => m.name));
    const stale = [...KNOWN_NON_PAINTING].filter((n) => !names.has(n));
    expect(stale).toEqual([]);
  });
});

/**
 * Same audit for stylesheet text (`style.textContent = ...`), which the DOM
 * write regex above cannot see.
 */
describe("hide commands reach every CSS-string paint site", () => {
  const WRITES_CSS = /(textContent\s*=|css\s*\+=)/;
  const CSS_COLOR = /\b(color|background|background-color)\s*:\s*[^;{}\n]{3,}/;

  /**
   * Methods that emit `color:` in a stylesheet without reading the flags:
   *
   * - applyFormattingPresetStyles: forces `inherit` / `transparent` on <strong>
   *   and <em> (it removes colour, never introduces it)
   * - applyEnabled{LivePreviewCallout,LivePreviewTextColor,ReadingCallout}
   *   Styles: they delegate to `var(--highlight-color)`, which only the gated
   *   paint sites ever define (Obsidian itself never defines that variable, so
   *   an undefined value degrades to inherited text = "colour hidden")
   * - applyDisabledNeutralizerStyles / applyHideHighlightsNeutralizerStyles:
   *   neutralizers, they write inherit/transparent only
   */
  const KNOWN_NON_COLORING_CSS = new Set([
    "applyFormattingPresetStyles",
    "applyEnabledLivePreviewCalloutStyles",
    "applyEnabledLivePreviewTextColorStyles",
    "applyEnabledReadingCalloutStyles",
    "applyDisabledNeutralizerStyles",
    "applyHideHighlightsNeutralizerStyles",
  ]);

  it("has no unwhitelisted stylesheet writer that ignores the hide flags", () => {
    const methods = classMethods(mainSrc);
    const offenders = methods
      .filter((m) => WRITES_CSS.test(m.body) && CSS_COLOR.test(m.body))
      .filter((m) => !CONSULTS_FLAGS.test(m.body))
      .filter((m) => !KNOWN_NON_PAINTING.has(m.name))
      .filter((m) => !KNOWN_NON_COLORING_CSS.has(m.name))
      .map((m) => `${m.name} (line ${m.line})`);

    expect(offenders).toEqual([]);
  });

  it("keeps the CSS whitelist honest (no stale entries)", () => {
    const names = new Set(classMethods(mainSrc).map((m) => m.name));
    const stale = [...KNOWN_NON_COLORING_CSS].filter((n) => !names.has(n));
    expect(stale).toEqual([]);
  });
});

describe("hide commands rebuild everything that bakes colours in", () => {
  it("exposes one reset helper for both commands", () => {
    expect(mainSrc).toContain("resetChannelDerivedArtifacts() {");
  });

  it("drops the line-target stylesheets (their colours are baked into <style>)", () => {
    const fn = /resetChannelDerivedArtifacts\(\)\s*\{[\s\S]*?\n  \}/.exec(mainSrc);
    expect(fn).not.toBeNull();
    expect(fn[0]).toContain('querySelectorAll("style[data-act-line-style]")');
    expect(fn[0]).toContain("clearMarkdownElementDecorations()");
    expect(fn[0]).toContain("applyHighlightPresetTransparency()");
    // "Unhide Highlights" has to undo the inline overrides the hide pass
    // stamped onto existing spans — removing the stylesheet is not enough.
    expect(fn[0]).toContain("restoreInlineHighlightNeutralization()");
    expect(fn[0]).toMatch(/if \(!this\.settings\.hideHighlights\) \{/);
    expect(mainSrc).toMatch(
      /restoreInlineHighlightNeutralization\(\)\s*\{[\s\S]*?querySelectorAll\("\.always-color-text-highlight"\)/,
    );
  });

  it("calls the reset from BOTH command callbacks", () => {
    const idxfn = (id) => {
      const at = mainSrc.indexOf(`id: "${id}"`);
      expect(at).toBeGreaterThan(-1);
      // callback runs to the next tracked command / end of registration block
      return mainSrc.slice(at, at + 6000);
    };
    for (const id of ["toggle-hide-text-colors", "toggle-hide-highlights"]) {
      const body = idxfn(id);
      expect(body).toContain("resetChannelDerivedArtifacts()");
      expect(body).toContain("reconfigureEditorExtensions()");
      expect(body).toContain("forceRefreshAllReadingViews()");
    }
  });

  it("applies/removes the neutralizer with the Hide Highlights command", () => {
    const at = mainSrc.indexOf('id: "toggle-hide-highlights"');
    const body = mainSrc.slice(at, at + 6000);
    expect(body).toContain("applyHideHighlightsNeutralizerStyles()");
    expect(body).toContain("removeHideHighlightsNeutralizerStyles()");
  });
});

describe("the neutralizer covers every highlight surface", () => {
  const start = mainSrc.indexOf("applyHideHighlightsNeutralizerStyles() {");
  const end = mainSrc.indexOf("removeHideHighlightsNeutralizerStyles() {");
  const sheet = mainSrc.slice(start, end);

  it("has the neutralizer stylesheet", () => {
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    expect(sheet).toContain("act-hide-highlights-neutralizer");
  });

  it("neutralizes plugin spans, reading <mark> and the live-preview wrapper", () => {
    expect(sheet).toContain(".always-color-text-highlight {");
    expect(sheet).toContain(".always-color-text-highlight-marks,");
    // reading-view ==...== renders as <mark>; Obsidian's own search uses
    // .cm-searchMatch / .search-highlight divs, never <mark>, so this is safe.
    expect(sheet).toMatch(/(^|\s|\n)mark[,\s]/);
    expect(sheet).toContain(".cm-highlight ");
  });

  it("only ever strips the highlight channel (never `color`)", () => {
    const declarations = sheet.slice(sheet.indexOf("textContent"));
    expect(declarations).not.toMatch(/[^-]color\s*:\s*(inherit|transparent)/);
    expect(declarations).toContain("background-color: transparent !important");
  });

  it("is removed again when the command is switched off", () => {
    expect(mainSrc).toMatch(
      /removeHideHighlightsNeutralizerStyles\(\)\s*\{[\s\S]*?getElementById\("act-hide-highlights-neutralizer"\)/,
    );
  });
});

describe("decorations stamped onto the DOM are undone, not just re-painted", () => {
  it("unwraps task-marker spans when clearing", () => {
    const fn = /clearMarkdownElementDecorations\(\)\s*\{[\s\S]*?\n  \}/.exec(
      mainSrc,
    );
    expect(fn).not.toBeNull();
    expect(fn[0]).toContain('querySelectorAll("span[data-act-task-marker]")');
  });

  it("tags the spans it creates so they can be found again", () => {
    const fn = /_styleTaskMarker\(li, entry\)\s*\{[\s\S]*?\n  \}/.exec(mainSrc);
    expect(fn).not.toBeNull();
    expect(fn[0]).toContain('setAttribute("data-act-task-marker", "1")');
    // and it unwraps first: without that, every refresh nests another span
    // and a vanished colour would leave the old one behind.
    expect(fn[0]).toContain("_clearTaskMarkerSpans(li)");
    expect(fn[0]).toContain("if (!color) return;");
  });
});

describe("reading-view marks distinguish 'no style source' from 'filtered out'", () => {
  it("does not fall back to the raw settings when an empty (fully filtered) list is passed", () => {
    const fn = /processMarkdownFormattingInReading\([\s\S]{0,400}?\)\s*\{/.exec(
      mainSrc,
    );
    expect(fn).not.toBeNull();
    const body = mainSrc.slice(fn.index, fn.index + 2500);
    expect(body).toContain("if (Array.isArray(entries)) {");
    expect(body).not.toMatch(
      /if\s*\(\s*Array\.isArray\(entries\)\s*&&\s*entries\.length\s*>\s*0\s*\)/,
    );
  });
});
