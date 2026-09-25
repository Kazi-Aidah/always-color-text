// Regression test for: "markdown elements coloring don't get disabled with the
// global toggle".
//
// The static stylesheet (styles/core.css -> styles.css) is loaded by Obsidian
// for as long as the plugin is on, so it can NOT rely on being (un)loaded with
// settings.enabled. Every COLORING rule therefore has to be gated behind the
// `html.act-enabled` class, which the plugin syncs with the global toggle
// (AlwaysColorText.syncGlobalToggleCssState).

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..", "..");
const coreCss = readFileSync(join(ROOT, "styles", "core.css"), "utf8");

const GATE = ":where(html.act-enabled)";

/** Minimal rule extractor: returns [{ selector, declarations }] for top-level rules. */
function extractRules(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const selector = m[1].trim();
    if (!selector || selector.startsWith("@")) continue;
    rules.push({ selector, declarations: m[2] });
  }
  return rules;
}

const COLORING_SELECTORS = [
  ".always-color-text-highlight",
  ".always-color-text-highlight-marks",
  ".act-colored-list-item",
  ".act-color-marker",
];

// Rules that must stay ungated: plugin UI (settings/modal previews, drag ghosts)
const UI_SELECTORS = [
  ".act-color-picker-preview-wrap",
  ".act-highlight-preview-wrap",
  ".drag-reorder-ghost",
  ".drag-ghost-hidden",
];

const isColoringRule = (selector) =>
  COLORING_SELECTORS.some((s) => selector.includes(s)) ||
  selector.includes(".markdown-rendered code");

const isUiRule = (selector) =>
  UI_SELECTORS.some((s) => selector.includes(s));

describe("global toggle gate for static CSS", () => {
  const rules = extractRules(coreCss);

  it("finds rules in core.css", () => {
    expect(rules.length).toBeGreaterThan(20);
  });

  it("gates every coloring rule behind html.act-enabled", () => {
    const offenders = rules
      .filter((r) => isColoringRule(r.selector))
      .filter((r) =>
        r.selector
          .split(",")
          .some((part) => !part.trim().startsWith(GATE)),
      )
      .map((r) => r.selector);

    expect(offenders).toEqual([]);
  });

  it("does not gate plugin UI rules (they must work regardless of the toggle)", () => {
    const overGated = rules
      .filter((r) => isUiRule(r.selector))
      .filter((r) => r.selector.includes(GATE))
      .map((r) => r.selector);

    expect(overGated).toEqual([]);
  });

  it("keeps the gate specificity-neutral (:where contributes 0)", () => {
    const gated = rules.filter((r) => r.selector.includes(GATE));
    expect(gated.length).toBeGreaterThan(10);
    // Every gate must be wrapped — a bare `html.act-enabled` prefix would add
    // specificity and could outrank theme rules that used to win.
    expect(gated.every((r) => r.selector.includes(GATE))).toBe(true);
  });

  it("is present in the built styles.css", () => {
    const built = readFileSync(join(ROOT, "styles.css"), "utf8");
    expect(built).toContain(`${GATE} .always-color-text-highlight {`);
    expect(built).toContain(`${GATE} li.act-colored-list-item::marker`);
  });
});
