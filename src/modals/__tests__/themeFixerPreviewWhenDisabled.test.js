/**
 * Bugfix: Theme Color Adjustments modal — preview while the global toggle is off
 *
 * With "Enable Global Color" switched off, `applyDisabledNeutralizerStyles()`
 * injects #act-inline-neutralizer, whose first rule
 *
 *   span.always-color-text-highlight { color: inherit !important;
 *     background-color: transparent !important; padding: 0 !important;
 *     border: none !important; }
 *
 * matches the adjustment modal's preview spans too. Because every declaration
 * is !important it beats the modal's inline styles, so the sample line and the
 * preset chips rendered as plain, uncoloured, unpadded text — the modal showed
 * nothing to tune. On top of that `clearAllHighlights()` unwraps every
 * `.always-color-text-highlight` in the document, so a toggle-off sweep (e.g.
 * via the command palette while the modal is open) flattened the preview away
 * entirely.
 *
 * The modal already stamps its preview spans with .act-fixer-noauto (the same
 * marker that keeps the document-level brightness/contrast rule off them), so
 * the neutralizer now skips that class, and the clear sweep leaves modal
 * previews alone. The preview is plugin UI, not note content: it has to show
 * the real colors and presets regardless of the global toggle.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..", "..");
const coreSrc = readFileSync(
  join(ROOT, "src", "core", "AlwaysColorText.js"),
  "utf8",
);
const modalSrc = readFileSync(
  join(ROOT, "src", "modals", "ThemeFixerAdjustModal.js"),
  "utf8",
);

/** Body of one 2-space-indented class method, from its header to the next. */
function methodBody(src, signature) {
  const at = src.indexOf(signature);
  expect(at).toBeGreaterThan(-1);
  const rest = src.slice(at + signature.length);
  const next = rest.search(/\n  (?:async\s+)?[A-Za-z_$][\w$]*\s*\(/);
  return next === -1 ? rest : rest.slice(0, next);
}

describe("the disabled neutralizer leaves the adjustment preview alone", () => {
  const body = methodBody(coreSrc, "applyDisabledNeutralizerStyles() {");

  it("excludes .act-fixer-noauto from the plain span rule", () => {
    // Only the unscoped rule reaches the modal; the others are callout-scoped.
    expect(body).toContain(
      "span.always-color-text-highlight:not(.act-fixer-noauto)",
    );
    expect(body).not.toMatch(
      /(^|\n)\s*span\.always-color-text-highlight \{/,
    );
  });

  it("still neutralizes real document highlights", () => {
    expect(body).toContain("color: inherit !important");
    expect(body).toContain("background-color: transparent !important");
    expect(body).toContain("padding: 0 !important");
    expect(body).toContain("border: none !important");
  });

  it("is applied whenever the toggle is off (load + toggle path)", () => {
    const setGlobal = methodBody(coreSrc, "async setGlobalEnabled(value) {");
    expect(setGlobal).toContain("this.applyDisabledNeutralizerStyles()");
    const load = methodBody(coreSrc, "async onload() {");
    expect(load).toContain("this.applyDisabledNeutralizerStyles()");
  });
});

describe("a global-toggle sweep never flattens the modal preview", () => {
  const body = methodBody(coreSrc, "clearAllHighlights() {");

  it("skips spans inside the Theme Color Adjustments modal", () => {
    expect(body).toContain('hl.closest(".act-theme-fixer-modal")');
    expect(body).toMatch(/continue;/);
  });

  it("still unwraps document highlights", () => {
    expect(body).toContain("document.querySelectorAll");
    expect(body).toContain(".always-color-text-highlight");
    expect(body).toContain("replaceWith");
  });
});

describe("every preview span carries the exclusion marker", () => {
  it("chips are born with .act-fixer-noauto", () => {
    expect(modalSrc).toContain(
      'span.className = "always-color-text-highlight act-fixer-noauto";',
    );
  });

  it("the sample line is stamped right after it is filled", () => {
    const fill = methodBody(modalSrc, "onOpen() {");
    for (const holder of ["sampleSwatch", "samplePreset"]) {
      expect(fill).toMatch(
        new RegExp(
          `${holder}\\s*\\.querySelectorAll\\([\\s\\S]{0,300}?act-fixer-noauto`,
        ),
      );
    }
  });
});
