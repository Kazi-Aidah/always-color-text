/**
 * Feature: custom-css-per-entry
 * Property 12: Entry CSS takes precedence over group CSS
 *
 * Tests that when both a group and an entry have `customCss` with the same
 * property set to different values, the rendered span reflects the entry-level
 * value (not the group-level value) for that property.
 *
 * **Validates: Requirements 6.4**
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
      .split(";")
      .map((s) => s.replace(/\n/g, " ").trim())
      .filter((s) => s.length > 0);
    const out = [];
    for (const p of parts) {
      const idx = p.indexOf(":");
      if (idx === -1) continue;
      const prop = p.slice(0, idx).trim().toLowerCase();
      let val = p.slice(idx + 1).trim();
      if (!/^[a-z\-]+$/.test(prop)) continue;
      val = val.replace(/!important/gi, "").trim();
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

/**
 * Simulates the live preview inline style building logic:
 * group CSS is appended first, then entry CSS.
 * Since both use `!important`, the last one wins (entry wins).
 *
 * Returns the final style string.
 */
function buildLivePreviewStyle(groupCss, entryCss) {
  let style = "";

  // Apply group CSS first (lower precedence)
  if (groupCss) {
    const groupDecl = sanitizeCssDeclarations(groupCss);
    if (groupDecl) {
      const parts = groupDecl.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
      for (const p of parts) {
        const idx = p.indexOf(":");
        if (idx === -1) continue;
        style += `; ${p.slice(0, idx).trim()}: ${p.slice(idx + 1).trim()} !important;`;
      }
    }
  }

  // Apply entry CSS second (higher precedence — wins on conflict)
  if (entryCss) {
    const entryDecl = sanitizeCssDeclarations(entryCss);
    if (entryDecl) {
      const parts = entryDecl.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
      for (const p of parts) {
        const idx = p.indexOf(":");
        if (idx === -1) continue;
        style += `; ${p.slice(0, idx).trim()}: ${p.slice(idx + 1).trim()} !important;`;
      }
    }
  }

  return style;
}

/**
 * Simulates the reading view applyCustomCssToElement ordering:
 * group CSS is applied first, then entry CSS.
 * Since setProperty with 'important' is called for each, the last call wins.
 *
 * Returns a map of { prop: value } reflecting the final state of the element.
 */
function simulateReadingViewApply(groupCss, entryCss) {
  const styles = {};

  function applyCustomCssToElement(css) {
    const decl = sanitizeCssDeclarations(css);
    if (!decl) return;
    const parts = decl.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
    for (const p of parts) {
      const idx = p.indexOf(":");
      if (idx === -1) continue;
      const prop = p.slice(0, idx).trim();
      const val = p.slice(idx + 1).trim();
      // setProperty with 'important' — last call wins
      styles[prop] = val;
    }
  }

  // Group CSS applied first
  if (groupCss) applyCustomCssToElement(groupCss);
  // Entry CSS applied second (wins on conflict)
  if (entryCss) applyCustomCssToElement(entryCss);

  return styles;
}

describe("Property 12: Entry CSS takes precedence over group CSS", () => {
  /**
   * Feature: custom-css-per-entry, Property 12: Entry CSS takes precedence over group CSS
   * **Validates: Requirements 6.4**
   *
   * For any group and entry both having `customCss` with the same property set to
   * different values, the rendered span shall reflect the entry-level value (not the
   * group-level value) for that property.
   */
  it("Property 12 (reading view): entry CSS value wins over group CSS value for the same property", () => {
    // Generate a valid CSS property name
    const validPropArb = fc.stringMatching(/^[a-z][a-z\-]{0,19}$/);

    // Generate safe CSS values (no dangerous patterns, no semicolons/colons/newlines)
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
      fc.property(
        validPropArb,
        safeValueArb,
        safeValueArb,
        (prop, groupVal, entryVal) => {
          // Ensure the two values are different so we can distinguish which won
          fc.pre(groupVal !== entryVal);

          const groupCss = `${prop}: ${groupVal}`;
          const entryCss = `${prop}: ${entryVal}`;

          const styles = simulateReadingViewApply(groupCss, entryCss);

          // Entry value must win
          expect(styles[prop]).toBe(entryVal);
          expect(styles[prop]).not.toBe(groupVal);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 12 (live preview): entry CSS value appears after group CSS value in style string, so it wins", () => {
    const validPropArb = fc.stringMatching(/^[a-z][a-z\-]{0,19}$/);

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
      fc.property(
        validPropArb,
        safeValueArb,
        safeValueArb,
        (prop, groupVal, entryVal) => {
          fc.pre(groupVal !== entryVal);

          const groupCss = `${prop}: ${groupVal}`;
          const entryCss = `${prop}: ${entryVal}`;

          const style = buildLivePreviewStyle(groupCss, entryCss);

          // Both should appear in the style string
          expect(style).toContain(`${prop}: ${groupVal} !important`);
          expect(style).toContain(`${prop}: ${entryVal} !important`);

          // Entry value must appear AFTER group value (last !important wins in CSS)
          const groupIdx = style.indexOf(`${prop}: ${groupVal} !important`);
          const entryIdx = style.indexOf(`${prop}: ${entryVal} !important`);
          expect(entryIdx).toBeGreaterThan(groupIdx);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 12 (group-only): when only group has customCss, group CSS is applied", () => {
    const validPropArb = fc.stringMatching(/^[a-z][a-z\-]{0,19}$/);

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
      fc.property(validPropArb, safeValueArb, (prop, groupVal) => {
        const groupCss = `${prop}: ${groupVal}`;

        const styles = simulateReadingViewApply(groupCss, null);

        // Group value should be applied when no entry CSS
        expect(styles[prop]).toBe(groupVal);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
