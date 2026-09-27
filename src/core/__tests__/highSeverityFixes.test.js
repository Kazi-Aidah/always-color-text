/**
 * Regression: the four high-severity defects found in the full-feature
 * audit of the plugin.
 *
 * 1. "Hide Text Colors" force-clears hideHighlights but never removed
 *    #act-hide-highlights-neutralizer, so highlight backgrounds stayed
 *    transparent while the setting said they were visible.
 * 2. The disabled/excluded-file branches call
 *    `applyHighlights(el, null, {clearExisting: true, entries: []})`
 *    ("CRITICAL: Must clear existing highlights when disabled"), but
 *    applyHighlights returned at `entries.length === 0` BEFORE any clearing
 *    ran — the clear was a no-op.
 * 3. setGlobalEnabled(false) / disablePluginFeatures() never removed
 *    `style[data-act-line-style]` sheets (plain <head> elements, not gated
 *    by html.act-enabled) nor the pattern-derived line-target classes on
 *    reading blocks — line targets stayed colored with the toggle off.
 * 4. applyElementHighlights set the text color with no clearing branch, so
 *    under Hide Text Colors elements kept a stale inline color (the
 *    background channel did have an else-clear).
 *
 * Source-level assertions (same approach as hideCommandsReachAllSurfaces.test.js
 * and globalToggleCssGate.test.js): the paint sites live in one ~21k-line
 * module that cannot be imported without Obsidian.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..", "..");
const mainSrc = readFileSync(
  join(ROOT, "src", "core", "AlwaysColorText.js"),
  "utf8",
);

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

const methods = classMethods(mainSrc);
const methodBody = (name) => {
  const m = methods.find((x) => x.name === name);
  if (!m) throw new Error(`method not found: ${name}`);
  return m.body;
};

/** Source of one command registration, from its addTrackedCommand to the next. */
function commandBody(id) {
  const at = mainSrc.indexOf(`id: "${id}"`);
  if (at === -1) throw new Error(`command not found: ${id}`);
  const start = mainSrc.lastIndexOf("addTrackedCommand({", at);
  const next = mainSrc.indexOf("addTrackedCommand({", at);
  return mainSrc.slice(start, next === -1 ? start + 5000 : next);
}

describe("1. Hide Text Colors drops the highlight neutralizer sheet", () => {
  const body = commandBody("toggle-hide-text-colors");

  it("apply/remove the neutralizer based on the resolved hideHighlights flag", () => {
    // The command force-clears hideHighlights (mutual exclusion), so it must
    // also drop the sheet — otherwise highlights stay hidden invisibly.
    expect(body).toContain("removeHideHighlightsNeutralizerStyles");
    expect(body).toContain("applyHideHighlightsNeutralizerStyles");
    expect(body).toMatch(/if \(this\.settings\.hideHighlights\) \{/);
  });

  it("undoes the inline half via resetChannelDerivedArtifacts", () => {
    expect(body).toContain("resetChannelDerivedArtifacts()");
    const reset = methodBody("resetChannelDerivedArtifacts");
    expect(reset).toContain("restoreInlineHighlightNeutralization");
    // ...but only when highlights are supposed to be visible again.
    expect(reset).toMatch(
      /if \(!this\.settings\.hideHighlights\) \{[\s\S]*restoreInlineHighlightNeutralization/,
    );
  });

  it("the sibling toggle-hide-highlights keeps its own mirror", () => {
    const sib = commandBody("toggle-hide-highlights");
    expect(sib).toContain("removeHideHighlightsNeutralizerStyles");
    expect(sib).toContain("applyHideHighlightsNeutralizerStyles");
  });
});

describe("2. applyHighlights clears when the entry list is empty", () => {
  const body = methodBody("applyHighlights");

  it("no longer bails out with a bare early return", () => {
    expect(body).not.toMatch(/if \(entries\.length === 0\) return;/);
  });

  it("the empty-entries branch unwraps stale highlights", () => {
    const block = body.match(
      /if \(entries\.length === 0\) \{[\s\S]*?\n    \}/,
    );
    expect(block).toBeTruthy();
    expect(block[0]).toContain("clearExisting !== false");
    expect(block[0]).toContain(".always-color-text-highlight");
    expect(block[0]).toContain("replaceWith");
  });

  it("the clear runs before the wrap/return path", () => {
    expect(body.indexOf("entries.length === 0")).toBeLessThan(
      body.indexOf("_wrapMatchesRecursive"),
    );
  });

  it("every empty-list call site still asks for the clear", () => {
    const sites =
      mainSrc.match(
        /clearExisting:\s*true,\s*\n\s*entries:\s*\[\]/g,
      ) || [];
    expect(sites.length).toBeGreaterThanOrEqual(4);
    // And no site passes an empty list without clearExisting: true.
    const bare = mainSrc.match(/entries:\s*\[\]/g) || [];
    expect(bare.length).toBe(sites.length);
  });
});

describe("3. Global toggle off sweeps line-target sheets and classes", () => {
  it("setGlobalEnabled(false) removes line-style sheets", () => {
    const body = methodBody("setGlobalEnabled");
    expect(body).toContain('querySelectorAll("style[data-act-line-style]")');
    expect(body).toContain("clearReadingLineTargetClasses");
    // The sweep must live in the DISABLED branch, after the refreshes.
    const offBranch = body.match(/this\.applyDisabledNeutralizerStyles\(\);[\s\S]*?\n    \}/);
    expect(offBranch).toBeTruthy();
    expect(offBranch[0]).toContain('style[data-act-line-style]');
    expect(offBranch[0]).toContain("clearReadingLineTargetClasses");
  });

  it("disablePluginFeatures sweeps them only when the toggle is off", () => {
    const body = methodBody("disablePluginFeatures");
    const offGuard = body.match(
      /if \(!this\.settings\.enabled\) \{[\s\S]*?\n    \}/,
    );
    expect(offGuard).toBeTruthy();
    expect(offGuard[0]).toContain('style[data-act-line-style]');
    expect(offGuard[0]).toContain("clearReadingLineTargetClasses");
  });

  it("onunload sweeps the classes alongside the sheets", () => {
    const body = methodBody("onunload");
    expect(body).toContain('style[data-act-line-style]');
    expect(body).toContain("clearReadingLineTargetClasses");
  });

  it("reading line classes are added through the recording helper", () => {
    // Every add must be recorded on the element so it can be swept later.
    const rawAdds = mainSrc.match(/classList\.add\(cssClass\)/g) || [];
    expect(rawAdds.length).toBe(1); // only the line inside addReadingLineTargetClass
    const readingBlock = mainSrc.slice(
      mainSrc.indexOf("// Add CSS class to the target block element"),
      mainSrc.indexOf("// Build line style CSS (same as Live Preview)"),
    );
    expect(readingBlock).toContain("this.addReadingLineTargetClass(block, cssClass)");
    expect(readingBlock).not.toContain("classList.add(cssClass)");
  });

  it("helper records the class; sweep removes exactly those classes", () => {
    const add = methodBody("addReadingLineTargetClass");
    expect(add).toContain("el.classList.add(cssClass)"); // behavior when ON is unchanged
    expect(add).toContain("actLineTargets");

    const clear = methodBody("clearReadingLineTargetClasses");
    expect(clear).toContain('[data-act-line-targets]');
    expect(clear).toContain("el.classList.remove(cls)");
    expect(clear).toContain("removeAttribute");
  });
});

describe("4. applyElementHighlights clears stale text color under Hide Text Colors", () => {
  const body = methodBody("applyElementHighlights");

  it("text channel has a hideText clearing branch", () => {
    expect(body).toMatch(
      /if \(!hideText && finalTextColor\) \{[\s\S]*?\} else if \(hideText\) \{/,
    );
    const clear = body.match(/else if \(hideText\) \{[\s\S]*?\}/);
    expect(clear[0]).toContain('removeProperty("color")');
    expect(clear[0]).toContain('removeProperty("--highlight-color")');
  });

  it("flags-off parity: a colorless entry must not wipe another entry's color", () => {
    // The clearing branch must be `else if (hideText)`, never a bare `else`:
    // with both flags off, a colorless entry must not remove a color that a
    // sibling entry applied to the same element.
    expect(body).toMatch(
      /if \(!hideText && finalTextColor\) \{[\s\S]*?\n        \} else if \(hideText\) \{/,
    );
    expect(body).not.toMatch(
      /\} else \{\s*\n\s*element\.style\.removeProperty\("color"\)/,
    );
  });

  it("background channel keeps its else-clear (unchanged)", () => {
    expect(body).toMatch(/if \(!hideBg && isHighlight\) \{[\s\S]*?\} else \{/);
    expect(body).toContain('removeProperty("background-color")');
  });
});
