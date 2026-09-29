/**
 * Regression: word-group Edit Rules ("does not color in" / "only colors in")
 * were enforced in reading mode but not in Live Preview.
 *
 * Live Preview paints text+background entries straight from
 * _compiledTextBgEntries (it has to: that list is what the word channel's
 * hide/highlight and blacklist gates removed) and gated it with shouldColorText
 * alone — a check that knows entry-level rules, legacy group folder/tag
 * scoping and global rules, but never the group's own
 * inclusionRules/exclusionRules.
 * Reading mode is handed the list filterEntriesByAdvancedRules already
 * produced, so it stayed correct — hence "wrong in Live Preview only".
 *
 * The softer half of the same leak: the Live Preview callout/table passes
 * cache a per-element signature carrying no rule state, so a rules-only change
 * never repainted them while reading mode re-rendered.
 *
 * Source-level assertions (same approach as highSeverityFixes.test.js and
 * hideCommandsReachAllSurfaces.test.js): the paint sites live in one ~21k-line
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

const textBgGate =
  /textBgEntries = this\.filterEntriesByAdvancedRules\(\s*filePath,\s*textBgEntries,?\s*\)/;
const entryOnlyGate =
  /textBgEntries = textBgEntries\.filter\([\s\S]*?shouldColorText/;

describe("Live Preview text+bg pass runs the full rule gate", () => {
  it("buildDecoChunked re-applies filterEntriesByAdvancedRules", () => {
    const body = methodBody("buildDecoChunked");
    // Reading the raw list is intentional (hide* / blacklist gates belong to
    // the word channel), so it must be paired with the group-aware filter.
    expect(body).toContain("this._compiledTextBgEntries");
    expect(body).toMatch(textBgGate);
    expect(body).not.toMatch(entryOnlyGate);
  });

  it("buildDecoStandard (the sibling builder) matches", () => {
    const body = methodBody("buildDecoStandard");
    expect(body).toMatch(textBgGate);
    expect(body).not.toMatch(entryOnlyGate);
  });
});

describe("filterEntriesByAdvancedRules is the gate that knows group rules", () => {
  const body = methodBody("filterEntriesByAdvancedRules");

  it("asks the owning group before the per-entry rule check", () => {
    expect(body).toContain("isGroupEnabledForFile");
    expect(body.indexOf("isGroupEnabledForFile")).toBeLessThan(
      body.indexOf("shouldColorText"),
    );
  });

  it("resolves the group by uid, then by the compiled ref", () => {
    expect(body).toMatch(/entry\.groupUid/);
    expect(body).toMatch(/_groupRef/);
  });
});

describe("Live Preview DOM passes repaint after a rules change", () => {
  const cacheReset = [
    "_lpCalloutCache = new WeakMap()",
    "_lpTableCache = new WeakMap()",
  ];

  it("recompiling entries drops the callout/table signatures", () => {
    for (const method of ["compileWordEntries", "compileTextBgColoringEntries"]) {
      expect(methodBody(method)).toContain("invalidateLpDomPaintCaches()");
    }
  });

  it("reconfiguring the editor drops them too, before the rebuild", () => {
    const body = methodBody("reconfigureEditorExtensions");
    expect(body).toContain("invalidateLpDomPaintCaches()");
    expect(body.indexOf("invalidateLpDomPaintCaches()")).toBeLessThan(
      body.indexOf("registerEditorExtension"),
    );
  });

  it("the helper really resets both caches", () => {
    const body = methodBody("invalidateLpDomPaintCaches");
    for (const expr of cacheReset) expect(body).toContain(expr);
    // The throttle would otherwise swallow the very next table pass.
    expect(body).toContain("_lpTablesLastRun = 0");
  });
});
