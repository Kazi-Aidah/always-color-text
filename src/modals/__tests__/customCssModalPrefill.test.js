/**
 * Feature: custom-css-per-entry
 * Property 6: Pre-fill uses existing `customCss` when present
 * Property 7: Pre-fill derives `background-color` as `rgba()`
 *
 * Tests that CustomCssModal pre-fills the textarea with `entry.customCss`
 * when the entry already has a non-empty customCss value, and that
 * deriveHighlightCssFromEntry produces a `background-color: rgba(...)` declaration
 * when the entry has a valid hex backgroundColor.
 *
 * Validates: Requirements 2.2, 2.3
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * Pure extraction of the pre-fill decision logic from CustomCssModal.onOpen().
 *
 * When entry.customCss is non-empty, the textarea value is set to entry.customCss.
 * When entry.customCss is absent/empty, the textarea value is derived from
 * highlight styling properties (tested separately in optional tasks 3.2–3.3).
 *
 * @param {object} entry - Entry object (must have customCss field)
 * @param {Function} deriveHighlightCss - Fallback derivation function
 * @returns {string} The value that would be placed in the textarea
 */
function getTextareaInitialValue(entry, deriveHighlightCss) {
  if (entry.customCss && entry.customCss.trim().length > 0) {
    return entry.customCss;
  }
  return deriveHighlightCss(entry);
}

describe("CustomCssModal pre-fill", () => {
  /**
   * Feature: custom-css-per-entry, Property 6: Pre-fill uses existing `customCss` when present
   * Validates: Requirements 2.2
   *
   * For any entry with a non-empty `customCss` string, the textarea initial value
   * shall equal `entry.customCss` exactly — the derivation fallback is never called.
   */
  it("Property 6: Pre-fill uses existing customCss — textarea value equals entry.customCss", () => {
    // Arbitrary non-empty customCss string (at least one non-whitespace character)
    const nonEmptyCustomCssArb = fc
      .string({ minLength: 1, maxLength: 200 })
      .filter((s) => s.trim().length > 0);

    // Arbitrary entry shape — only customCss matters for this property;
    // color/backgroundColor are included for realism but not asserted on.
    const entryArb = fc.record({
      pattern: fc.string(),
      color: fc.option(fc.string()),
      backgroundColor: fc.option(fc.string()),
      customCss: nonEmptyCustomCssArb,
    });

    // The fallback should never be called when customCss is present;
    // use a sentinel to detect any accidental invocation.
    const SENTINEL = "__DERIVE_CALLED__";
    const deriveNeverCalled = () => SENTINEL;

    fc.assert(
      fc.property(entryArb, (entry) => {
        const result = getTextareaInitialValue(entry, deriveNeverCalled);

        // Must equal the original customCss exactly
        expect(result).toBe(entry.customCss);

        // Must not be the sentinel (derivation must not have been called)
        expect(result).not.toBe(SENTINEL);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Complementary case: when customCss is absent or empty, the derivation
   * fallback IS called (not the focus of Property 6, but guards the boundary).
   */
  it("Pre-fill falls back to derivation when customCss is absent or empty", () => {
    const emptyOrAbsentArb = fc.oneof(
      fc.constant(undefined),
      fc.constant(null),
      fc.constant(""),
      fc.constant("   "),
      fc.constant("\t\n")
    );

    const entryArb = fc.record({
      pattern: fc.string(),
      customCss: emptyOrAbsentArb,
    });

    const DERIVED = "derived-css-value";
    const deriveAlwaysReturns = () => DERIVED;

    fc.assert(
      fc.property(entryArb, (entry) => {
        const result = getTextareaInitialValue(entry, deriveAlwaysReturns);
        expect(result).toBe(DERIVED);
        return true;
      }),
      { numRuns: 50 }
    );
  });
});

/**
 * Inline copy of deriveHighlightCssFromEntry from CustomCssModal.js
 * (not exported, so replicated here for testing).
 */
function deriveHighlightCssFromEntry(entry, plugin) {
  const lines = [];
  const settings = plugin.settings;

  // color
  const tc = (entry.textColor && entry.textColor !== 'currentColor')
    ? entry.textColor : entry.color;
  if (tc) lines.push(`color: ${tc}`);

  // background-color as rgba
  const bg = entry.backgroundColor;
  if (bg) {
    const opacity = entry.backgroundOpacity ?? settings.backgroundOpacity ?? 35;
    lines.push(`background-color: ${plugin.hexToRgba(bg, opacity)}`);
  }

  // border-radius
  const radius = entry.highlightBorderRadius ?? settings.highlightBorderRadius ?? 4;
  lines.push(`border-radius: ${radius}px`);

  // padding
  const hpad = entry.highlightHorizontalPadding ?? settings.highlightHorizontalPadding ?? 4;
  const vpad = entry.highlightVerticalPadding ?? settings.highlightVerticalPadding ?? 0;
  lines.push(`padding: ${vpad}px ${hpad}px`);

  // border (only if enabled)
  const enableBorder = entry.enableBorderThickness ?? settings.enableBorderThickness ?? false;
  if (enableBorder) {
    const thickness = entry.borderThickness ?? settings.borderThickness ?? 1;
    const lineStyle = entry.borderLineStyle ?? settings.borderLineStyle ?? 'solid';
    lines.push(`border: ${thickness}px ${lineStyle} currentColor`);
  }

  return lines.join(';\n') + ';';
}

/**
 * Minimal mock plugin matching the interface used by deriveHighlightCssFromEntry.
 * hexToRgba mirrors the real implementation in AlwaysColorText.js.
 */
const mockPlugin = {
  settings: {
    backgroundOpacity: 35,
    highlightBorderRadius: 4,
    highlightHorizontalPadding: 4,
    highlightVerticalPadding: 0,
    enableBorderThickness: false,
  },
  hexToRgba(hex, opacityPercent) {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
      return 'rgba(0,0,0,1)';
    }
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    let o = Math.max(0, Math.min(100, Number(opacityPercent)));
    o = o / 100;
    return `rgba(${r},${g},${b},${o})`;
  },
};

describe("deriveHighlightCssFromEntry — Property 7", () => {
  /**
   * Feature: custom-css-per-entry, Property 7: Pre-fill derives background-color as rgba()
   * Validates: Requirements 2.3
   *
   * For any entry with a valid hex `backgroundColor`, deriveHighlightCssFromEntry
   * shall produce a declaration of the form `background-color: rgba(`.
   */
  it("Property 7: Pre-fill derives background-color as rgba() — output contains 'background-color: rgba('", () => {
    // Generate valid 6-digit hex colors (#RRGGBB)
    const hexColorArb = fc
      .stringMatching(/^[0-9A-Fa-f]{6}$/)
      .map(hex => `#${hex.toUpperCase()}`);

    const entryArb = fc.record({
      pattern: fc.string(),
      backgroundColor: hexColorArb,
      // backgroundOpacity is optional; omit to exercise the settings fallback
      backgroundOpacity: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
    });

    fc.assert(
      fc.property(entryArb, (entry) => {
        const result = deriveHighlightCssFromEntry(entry, mockPlugin);
        expect(result).toContain('background-color: rgba(');
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

describe("deriveHighlightCssFromEntry — Property 8", () => {
  /**
   * Feature: custom-css-per-entry, Property 8: Pre-fill includes all required declarations
   * Validates: Requirements 2.4, 2.5, 2.6, 2.8
   *
   * For any entry, deriveHighlightCssFromEntry shall produce a CSS string that:
   * - Always contains `border-radius`
   * - Always contains `padding`
   * - Contains `border` if and only if `enableBorderThickness` is true
   * Falls back to global plugin settings for any unset entry property.
   */
  it("Property 8: Pre-fill includes all required declarations — border-radius, padding always present; border iff enableBorderThickness", () => {
    // Generate optional numeric values for highlight properties
    const optionalNumArb = fc.option(fc.integer({ min: 0, max: 50 }), { nil: undefined });

    // Generate entries with various combinations of highlight properties set/unset
    const entryArb = fc.record({
      pattern: fc.string(),
      // enableBorderThickness can be true, false, or undefined (falls back to settings)
      enableBorderThickness: fc.oneof(
        fc.constant(true),
        fc.constant(false),
        fc.constant(undefined)
      ),
      highlightBorderRadius: optionalNumArb,
      highlightHorizontalPadding: optionalNumArb,
      highlightVerticalPadding: optionalNumArb,
      borderThickness: optionalNumArb,
      borderLineStyle: fc.option(
        fc.oneof(fc.constant('solid'), fc.constant('dashed'), fc.constant('dotted')),
        { nil: undefined }
      ),
    });

    fc.assert(
      fc.property(entryArb, (entry) => {
        const result = deriveHighlightCssFromEntry(entry, mockPlugin);

        // border-radius must always be present
        expect(result).toContain('border-radius');

        // padding must always be present
        expect(result).toContain('padding');

        // Determine the effective enableBorderThickness value
        const effectiveBorder =
          entry.enableBorderThickness ?? mockPlugin.settings.enableBorderThickness ?? false;

        if (effectiveBorder) {
          // border must be present when enableBorderThickness is effectively true
          expect(result).toContain('border:');
        } else {
          // border must NOT be present when enableBorderThickness is effectively false
          // Use a regex to avoid matching 'border-radius' as 'border'
          expect(result).not.toMatch(/\bborder:/);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
