/**
 * Regression: Live Preview tables never colored plain-text cells.
 *
 * `_processLivePreviewTablesInternal` paints each `td`/`th` via
 * `processInChunks(cell, ...)`, but `processInChunks` only walks DESCENDANT
 * elements — the cell itself is painted only when `includeSelf: true` is
 * passed (the Bases pass already does this). A plain-text cell (`<td>etio</td>`)
 * has no child block elements, so without `includeSelf` the walker finds zero
 * nodes and nothing is ever wrapped. Reading mode worked because
 * `_wrapMatchesRecursive` unshifts the element itself into its block queue.
 *
 * Source-level assertions (same approach as lpGroupRules.test.js and
 * highSeverityFixes.test.js): the paint sites live in one ~21k-line module
 * that cannot be imported without Obsidian.
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

describe("Live Preview tables paint the cell itself", () => {
  it("_processLivePreviewTablesInternal passes includeSelf to processInChunks", () => {
    const body = methodBody("_processLivePreviewTablesInternal");
    expect(body).toContain("this.processInChunks(cell, entries, folderEntry");
    expect(body).toMatch(/processInChunks\(cell[\s\S]*?includeSelf:\s*true/);
  });

  it("processInChunks honors includeSelf for TD/TH elements", () => {
    const body = methodBody("processInChunks");
    // TD/TH must be in the walkable tag set…
    expect(body).toContain("td, th");
    // …and the includeSelf branch must process the element itself.
    expect(body).toMatch(/if\s*\(\s*options\.includeSelf/);
    expect(body).toContain("this._processBlock(element, entries, folderEntry");
  });
});
