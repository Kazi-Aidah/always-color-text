/**
 * Feature: custom-css-per-entry
 * Property 9: Validation warns on invalid property names
 *
 * Tests that the inline validation logic produces a warning when a CSS declaration
 * contains a property name that does not match /^[a-z\-]+$/.
 *
 * Validates: Requirements 4.1
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * Pure extraction of the validation logic from CustomCssModal._validateInput().
 * Returns an array of warning strings (same logic as _validateInput but without DOM).
 *
 * @param {string} raw - Raw CSS declarations string from the textarea
 * @returns {string[]} Array of warning strings (empty if no issues)
 */
function validateCssInput(raw) {
  const warnings = [];

  if (!raw.trim()) {
    return warnings;
  }

  const DANGEROUS = ['url(', 'expression(', 'javascript:', '<', '>'];
  const parts = raw.split(/;|\n/).map(s => s.trim()).filter(Boolean);

  for (const part of parts) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();

    if (!/^[a-z\-]+$/.test(prop)) {
      warnings.push(`Invalid property name: "${prop}" (must match /^[a-z\\-]+$/)`);
    }

    for (const d of DANGEROUS) {
      if (val.toLowerCase().includes(d)) {
        warnings.push(`Dangerous value in "${prop}": contains "${d}"`);
        break;
      }
    }
  }

  return warnings;
}

describe("validateCssInput — Property 9", () => {
  /**
   * Feature: custom-css-per-entry, Property 9: Validation warns on invalid property names
   * Validates: Requirements 4.1
   *
   * For any CSS declaration whose property name does not match /^[a-z\-]+$/,
   * validateCssInput shall produce at least one warning mentioning the invalid property name.
   */
  it("Property 9: Validation warns on invalid property names — warning produced for any prop not matching /^[a-z\\-]+$/", () => {
    // Generate property names that do NOT match /^[a-z\-]+$/
    // Strategy: start with a valid base name and inject an invalid character.
    // This guarantees:
    //   1. The prop name is non-empty
    //   2. It contains no ':' or ';' or '\n' (which would break the declaration parsing)
    //   3. Its lowercased form fails /^[a-z\-]+$/
    //
    // Invalid character categories:
    //   - digit (0-9)
    //   - uppercase letter (A-Z) — note: lowercased uppercase is still [a-z], so we
    //     combine with a digit to ensure the lowercased form also fails
    //   - underscore or other safe special chars (not :, ;, \n, <, >)

    // Base: a non-empty string of only [a-z] chars (valid base)
    const validBaseArb = fc
      .stringMatching(/^[a-z]+$/)
      .filter(s => s.length >= 1 && s.length <= 20);

    // Invalid char to inject: digit or underscore (both fail /^[a-z\-]+$/ after lowercase)
    const invalidCharArb = fc.oneof(
      fc.integer({ min: 0, max: 9 }).map(n => String(n)),   // digit
      fc.constant('_'),                                       // underscore
      fc.constant('!'),                                       // exclamation
      fc.constant('@'),                                       // at-sign
      fc.constant('2'),                                       // another digit
    );

    // Build invalid prop by inserting the invalid char somewhere in the base
    const invalidPropArb = fc
      .tuple(validBaseArb, invalidCharArb, fc.integer({ min: 0, max: 20 }))
      .map(([base, badChar, pos]) => {
        const insertAt = pos % (base.length + 1);
        return base.slice(0, insertAt) + badChar + base.slice(insertAt);
      })
      .filter(s => {
        // Final safety checks: no parsing-breaking chars, and lowercased form fails regex
        if (s.includes(':') || s.includes(';') || s.includes('\n')) return false;
        return !/^[a-z\-]+$/.test(s.toLowerCase());
      });

    // Use a safe, non-dangerous value so we only get prop-name warnings
    const safeValueArb = fc.constantFrom(
      'somevalue',
      '600',
      'bold',
      'italic',
      '1em',
      '16px',
      'monospace',
      'auto',
      'none',
      'inherit'
    );

    fc.assert(
      fc.property(invalidPropArb, safeValueArb, (invalidProp, safeValue) => {
        const declaration = `${invalidProp}: ${safeValue}`;
        const warnings = validateCssInput(declaration);

        // Must produce at least one warning
        expect(warnings.length).toBeGreaterThan(0);

        // At least one warning must mention the invalid property name
        const propLower = invalidProp.trim().toLowerCase();
        const hasInvalidPropWarning = warnings.some(w =>
          w.includes('Invalid property name') && w.includes(propLower)
        );
        expect(hasInvalidPropWarning).toBe(true);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Complementary case: valid property names (matching /^[a-z\-]+$/) with safe values
   * should NOT produce any warnings.
   */
  it("No warning for valid property names matching /^[a-z\\-]+$/", () => {
    // Generate valid property names: only lowercase letters and hyphens, at least 1 char
    const validPropArb = fc
      .stringMatching(/^[a-z\-]+$/)
      .filter(s => s.length > 0 && !s.startsWith('-') && !s.endsWith('-'));

    const safeValueArb = fc.constantFrom(
      'somevalue', '600', 'bold', '1em', '16px', 'monospace', 'auto', 'none'
    );

    fc.assert(
      fc.property(validPropArb, safeValueArb, (validProp, safeValue) => {
        const declaration = `${validProp}: ${safeValue}`;
        const warnings = validateCssInput(declaration);

        // Must produce no warnings for valid prop + safe value
        const invalidPropWarnings = warnings.filter(w => w.includes('Invalid property name'));
        expect(invalidPropWarnings.length).toBe(0);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

describe("validateCssInput — Property 10", () => {
  /**
   * Feature: custom-css-per-entry, Property 10: Validation warns on dangerous values
   * Validates: Requirements 4.2
   *
   * For any CSS declaration whose value contains a dangerous pattern
   * (url(, expression(, javascript:, <, >), validateCssInput shall produce
   * at least one warning mentioning "Dangerous value".
   */
  it("Property 10: Validation warns on dangerous values — warning produced for any value containing a dangerous pattern", () => {
    const DANGEROUS = ['url(', 'expression(', 'javascript:', '<', '>'];

    // Generate valid property names so we isolate the value check
    const validPropArb = fc
      .stringMatching(/^[a-z\-]+$/)
      .filter(s => s.length > 0 && !s.startsWith('-') && !s.endsWith('-'));

    // Pick one dangerous pattern to embed in the value
    const dangerousPatternArb = fc.constantFrom(...DANGEROUS);

    // Build a dangerous value: some prefix + the dangerous pattern + optional suffix
    // Prefix/suffix are safe strings (no : ; \n) to avoid breaking declaration parsing
    const safePaddingArb = fc
      .stringMatching(/^[a-z0-9 ]*$/)
      .filter(s => s.length <= 10);

    const dangerousValueArb = fc
      .tuple(safePaddingArb, dangerousPatternArb, safePaddingArb)
      .map(([prefix, pattern, suffix]) => `${prefix}${pattern}${suffix}`);

    fc.assert(
      fc.property(validPropArb, dangerousValueArb, (validProp, dangerousValue) => {
        const declaration = `${validProp}: ${dangerousValue}`;
        const warnings = validateCssInput(declaration);

        // Must produce at least one warning
        expect(warnings.length).toBeGreaterThan(0);

        // At least one warning must mention "Dangerous value"
        const hasDangerousWarning = warnings.some(w => w.includes('Dangerous value'));
        expect(hasDangerousWarning).toBe(true);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Complementary case: values with none of the dangerous patterns should NOT
   * produce any "Dangerous value" warnings.
   */
  it("No dangerous-value warning for values containing none of the dangerous patterns", () => {
    const validPropArb = fc
      .stringMatching(/^[a-z\-]+$/)
      .filter(s => s.length > 0 && !s.startsWith('-') && !s.endsWith('-'));

    // Safe values: only alphanumeric, spaces, px/em units, parentheses-free
    const safeValueArb = fc.constantFrom(
      'bold',
      '600',
      '1em',
      '16px',
      'monospace',
      'auto',
      'none',
      'inherit',
      'currentColor',
      'rgba(255, 0, 0, 0.5)',
      'linear-gradient(to right, red, blue)',
      'calc(100% - 4px)',
      'var(--my-color)',
      'drop-shadow(2px 2px 4px black)',
      'blur(4px)',
      '1px solid currentColor'
    );

    fc.assert(
      fc.property(validPropArb, safeValueArb, (validProp, safeValue) => {
        const declaration = `${validProp}: ${safeValue}`;
        const warnings = validateCssInput(declaration);

        // Must produce no "Dangerous value" warnings
        const dangerousWarnings = warnings.filter(w => w.includes('Dangerous value'));
        expect(dangerousWarnings.length).toBe(0);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
