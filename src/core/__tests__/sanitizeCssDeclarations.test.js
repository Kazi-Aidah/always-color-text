/**
 * Feature: custom-css-per-entry
 * Property 1: Sanitizer idempotence
 *
 * Tests for sanitizeCssDeclarations — verifies that applying the sanitizer
 * twice produces the same result as applying it once.
 *
 * Validates: Requirements 5.8
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * Pure implementation of sanitizeCssDeclarations extracted for testing.
 * Mirrors the logic in AlwaysColorText.js without Obsidian dependencies.
 */
function sanitizeCssDeclarations(input) {
  try {
    if (!input || typeof input !== "string") return "";
    const normalized = String(input).replace(/\r/g, "\n");
    const parts = normalized
      .split(/;|\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const out = [];
    for (const p of parts) {
      const idx = p.indexOf(":");
      if (idx === -1) continue;
      const prop = p.slice(0, idx).trim().toLowerCase();
      let val = p.slice(idx + 1).trim();
      if (!/^[a-z\-]+$/.test(prop)) continue;

      // Strip !important
      val = val.replace(/!important/gi, "").trim();

      // Blocklist check
      const valLower = val.toLowerCase();
      if (
        valLower.includes("url(") ||
        valLower.includes("expression(") ||
        valLower.includes("javascript:") ||
        val.includes("<") ||
        val.includes(">")
      ) {
        continue;
      }

      if (val.length === 0) continue;
      out.push(`${prop}: ${val}`);
    }
    return out.join("; ") + (out.length > 0 ? ";" : "");
  } catch (e) {
    return "";
  }
}

describe("sanitizeCssDeclarations", () => {
  /**
   * Feature: custom-css-per-entry, Property 1: Sanitizer idempotence
   * Validates: Requirements 5.8
   *
   * For any CSS string s, sanitize(sanitize(s)) === sanitize(s)
   */
  it("Property 1: Sanitizer idempotence — sanitize(sanitize(s)) === sanitize(s)", () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const once = sanitizeCssDeclarations(s);
        const twice = sanitizeCssDeclarations(once);
        return once === twice;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: custom-css-per-entry, Property 3: Sanitizer allowance — safe values are preserved
   * Validates: Requirements 5.1, 5.2, 5.5
   *
   * For any CSS declaration with a valid property name (/^[a-z\-]+$/) and a value
   * containing none of the dangerous patterns, sanitizeCssDeclarations shall include
   * that declaration in its output (after stripping !important and normalizing case).
   */
  it("Property 3: Sanitizer allowance — safe declarations are preserved in output", () => {
    // Valid property name: starts with a-z, followed by a-z or hyphens
    const validPropArb = fc.stringMatching(/^[a-z][a-z\-]{0,19}$/);

    // Safe value: printable chars, no newlines/semicolons, and none of the dangerous patterns
    const safeValueArb = fc
      .string({ unit: "grapheme", minLength: 1, maxLength: 40 })
      .map((s) =>
        s
          .replace(/[\n\r;:]/g, "")
          .replace(/url\(/gi, "")
          .replace(/expression\(/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/[<>]/g, "")
          .replace(/!important/gi, "")
          .trim()
      )
      .filter((s) => s.length > 0);

    fc.assert(
      fc.property(validPropArb, safeValueArb, (prop, val) => {
        const input = `${prop}: ${val}`;
        const output = sanitizeCssDeclarations(input);
        // The sanitized output must contain this property declaration
        const propPattern = new RegExp(`(^|;\\s*)${prop}\\s*:`);
        return propPattern.test(output);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: custom-css-per-entry, Property 4: Sanitizer strips `!important`
   * Validates: Requirements 5.6
   *
   * For any CSS string containing `!important` in a value, the output of
   * sanitizeCssDeclarations shall not contain `!important`.
   */
  it("Property 4: Sanitizer strips !important — output never contains !important", () => {
    const validPropArb = fc.stringMatching(/^[a-z][a-z\-]{0,19}$/);

    // Safe value fragment: no newlines, semicolons, or dangerous patterns
    const safeFragArb = fc
      .string({ unit: "grapheme", minLength: 0, maxLength: 20 })
      .map((s) =>
        s
          .replace(/[\n\r;:]/g, "")
          .replace(/url\(/gi, "")
          .replace(/expression\(/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/[<>]/g, "")
          .trim()
      );

    // !important variant: mixed case to exercise case-insensitive stripping
    const importantArb = fc.constantFrom(
      "!important",
      "!IMPORTANT",
      "!Important",
      "!iMpOrTaNt"
    );

    // Position: before, after, or between safe fragments
    const positionArb = fc.constantFrom("before", "after", "between");

    fc.assert(
      fc.property(
        validPropArb,
        safeFragArb,
        safeFragArb,
        importantArb,
        positionArb,
        (prop, frag1, frag2, imp, position) => {
          let val;
          if (position === "before") val = `${imp} ${frag1}`;
          else if (position === "after") val = `${frag1} ${imp}`;
          else val = `${frag1} ${imp} ${frag2}`;

          const input = `${prop}: ${val}`;
          const output = sanitizeCssDeclarations(input);
          return !output.toLowerCase().includes("!important");
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: custom-css-per-entry, Property 5: Sanitizer normalizes property names to lowercase
   * Validates: Requirements 5.7
   *
   * For any CSS declaration whose property name, when lowercased, matches /^[a-z\-]+$/,
   * sanitizeCssDeclarations shall include it in the output with the property name in lowercase.
   */
  it("Property 5: Sanitizer normalizes property names to lowercase", () => {
    // Generate a valid lowercase base name, then randomly uppercase some characters
    const validLowerPropArb = fc.stringMatching(/^[a-z][a-z\-]{0,19}$/);

    // Produce a mixed-case version by randomly uppercasing individual characters
    const mixedCasePropArb = fc
      .tuple(validLowerPropArb, fc.array(fc.boolean(), { minLength: 0, maxLength: 20 }))
      .map(([prop, flips]) =>
        prop
          .split("")
          .map((ch, i) => (flips[i] ? ch.toUpperCase() : ch))
          .join("")
      )
      // Must have at least one uppercase letter to exercise normalization
      .filter((prop) => prop !== prop.toLowerCase());

    // Safe value: no dangerous patterns, no newlines/semicolons
    const safeValueArb = fc
      .string({ unit: "grapheme", minLength: 1, maxLength: 30 })
      .map((s) =>
        s
          .replace(/[\n\r;:]/g, "")
          .replace(/url\(/gi, "")
          .replace(/expression\(/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/[<>]/g, "")
          .replace(/!important/gi, "")
          .trim()
      )
      .filter((s) => s.length > 0);

    fc.assert(
      fc.property(mixedCasePropArb, safeValueArb, (mixedProp, val) => {
        const lowered = mixedProp.toLowerCase();
        const input = `${mixedProp}: ${val}`;
        const output = sanitizeCssDeclarations(input);
        // Output must contain the lowercased property name
        const propPattern = new RegExp(`(^|;\\s*)${lowered}\\s*:`);
        return propPattern.test(output);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: custom-css-per-entry, Property 2: Sanitizer blocklist — dangerous values are excluded
   * Validates: Requirements 5.2, 5.4
   *
   * For any CSS declaration whose value contains a dangerous pattern,
   * sanitizeCssDeclarations shall exclude that declaration from its output.
   */
  it("Property 2: Sanitizer blocklist — dangerous values are excluded from output", () => {
    // Valid property name: lowercase letters and hyphens, no newlines
    const validPropArb = fc.stringMatching(/^[a-z][a-z\-]{0,19}$/);

    // Safe padding: printable ASCII, no newlines, no semicolons, no dangerous patterns
    const safePaddingArb = fc
      .string({ unit: "grapheme", minLength: 0, maxLength: 15 })
      .map((s) =>
        s
          .replace(/[\n\r;]/g, "")
          .replace(/url\(/gi, "")
          .replace(/expression\(/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/[<>]/g, "")
      );

    // One of the five dangerous patterns
    const dangerousPatternArb = fc.constantFrom(
      "url(",
      "expression(",
      "javascript:",
      "<",
      ">"
    );

    // Build a single-line declaration: "prop: <prefix><danger><suffix>"
    // All parts are guaranteed to be on one line (no \n or ;)
    const declarationArb = fc
      .tuple(validPropArb, safePaddingArb, dangerousPatternArb, safePaddingArb)
      .map(([prop, prefix, danger, suffix]) => ({
        prop,
        raw: `${prop}: ${prefix}${danger}${suffix}`,
      }));

    fc.assert(
      fc.property(declarationArb, ({ prop, raw }) => {
        const output = sanitizeCssDeclarations(raw);
        // The sanitized output must not contain this property declaration at all
        const propPattern = new RegExp(`(^|;\\s*)${prop}\\s*:`);
        return !propPattern.test(output);
      }),
      { numRuns: 100 }
    );
  });
});
