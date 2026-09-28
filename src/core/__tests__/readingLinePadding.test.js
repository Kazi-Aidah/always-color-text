/**
 * Regression: reading-mode colour lines dropped the Horizontal Padding set in
 * the Highlight Styling modal (Live Preview applied it), and each view kept
 * its own copy of the declaration split — so a padding fix could land in one
 * view only.
 *
 * Source-level assertions for the plugin class (same approach as
 * mediumLowFixes.test.js); the shared rule builder these call sites go
 * through is unit-tested in customCssRules.test.js.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..", "..");
const mainSrc = readFileSync(
  join(ROOT, "src", "core", "AlwaysColorText.js"),
  "utf8",
);

/** Source of the reading-mode line-target branch, up to its `<style>` id. */
function readingLineBranch() {
  const start = mainSrc.indexOf("if (lineCh.background) {");
  const end = mainSrc.indexOf("act-line-style-reading-${cssClass}");
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return mainSrc.slice(start, end);
}

describe("reading-mode line targets", () => {
  it("paints the entry's horizontal padding, exactly like Live Preview", () => {
    const branch = readingLineBranch();
    expect(branch).toContain("params.hPad ?? 4");
    expect(branch).toContain("lineStyleParts.push(`padding-left: ${hpad}px`)");
    expect(branch).toContain("lineStyleParts.push(`padding-right: ${hpad}px`)");
  });

  it("keeps the padding inside the background branch", () => {
    // No background → no padding, matching the Live Preview bgPart gate.
    const branch = readingLineBranch();
    const padIdx = branch.indexOf("padding-left: ${hpad}px");
    const radiusIdx = branch.indexOf("border-radius: ${params.radius");
    expect(padIdx).toBeGreaterThan(-1);
    expect(radiusIdx).toBeGreaterThan(padIdx);
  });

  it("merges group/entry custom CSS before the rule is built", () => {
    const mergeIdx = mainSrc.indexOf(
      "lineStyleStr = this._mergeStyleWithCustomCss(",
    );
    const buildIdx = mainSrc.indexOf("buildLineTargetRule({", mergeIdx);
    expect(mergeIdx).toBeGreaterThan(-1);
    expect(buildIdx).toBeGreaterThan(mergeIdx);
    // …and nothing re-splits the declarations between the two.
    const between = mainSrc.slice(mergeIdx, buildIdx);
    expect(between).not.toContain("buildLineTargetRule");
  });
});

describe("line-target rule building", () => {
  it("runs both views through the shared builder", () => {
    const calls = mainSrc.match(/buildLineTargetRule\(\{/g) || [];
    expect(calls.length).toBe(2);
    expect(mainSrc).toContain(
      "import { splitCustomCss, sanitizeDeclString, applyScopeToStyleString, applyCustomCssToElementCore, buildScopedBlockRules, buildSelectorBlockRules, buildLineTargetRule, reassembleCustomCss }",
    );
  });

  it("keeps Obsidian's indentation on list lines in both views", () => {
    expect(mainSrc).toContain('strongSelector: tagName === "li" ? null : lineSelector');
    expect(mainSrc).toContain(
      "strongSelector: `${lineSelector}:not(.HyperMD-list-line)`",
    );
  });
});
