/**
 * Feature: custom-css-per-entry
 * Property 11: Reference chip insertion
 *
 * Tests that inserting a property chip at any cursor position within a textarea
 * value places `"propname: "` at that position without altering surrounding content,
 * and advances the cursor to the end of the inserted text.
 *
 * Validates: Requirements 3.2
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * Pure extraction of the _insertAtCursor logic from CustomCssModal.
 * Operates on a plain object { value, selectionStart, selectionEnd }
 * instead of a DOM textarea element.
 *
 * @param {{ value: string, selectionStart: number, selectionEnd: number }} ta
 * @param {string} text - Text to insert at the cursor position
 * @returns {{ value: string, selectionStart: number, selectionEnd: number }}
 *   New textarea state after insertion
 */
function insertAtCursor(ta, text) {
  const { value, selectionStart, selectionEnd } = ta;
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const newValue = before + text + after;
  const newCursor = selectionStart + text.length;
  return {
    value: newValue,
    selectionStart: newCursor,
    selectionEnd: newCursor,
  };
}

/**
 * All property names from REFERENCE_CATEGORIES in CustomCssModal.js.
 * These are the chips the user can click.
 */
const REFERENCE_PROPS = [
  // Typography
  'font-family', 'font-weight', 'font-style', 'font-size',
  'font-variant', 'line-height', 'letter-spacing', 'word-spacing',
  // Decoration
  'text-decoration', 'text-transform', 'text-shadow', 'text-underline-offset',
  // Spacing
  'padding', 'margin', 'vertical-align',
  // Effects
  'opacity', 'cursor', 'filter', 'box-shadow', 'background',
  'border', 'border-radius', 'outline',
];

describe("insertAtCursor — Property 11", () => {
  /**
   * Feature: custom-css-per-entry, Property 11: Reference chip insertion
   * Validates: Requirements 3.2
   *
   * For any textarea content string, any cursor position (no selection),
   * and any property name from the reference list:
   *   - The text before the cursor is unchanged
   *   - The inserted text is `propName + ': '`
   *   - The text after the cursor is unchanged
   *   - The new cursor position is `selectionStart + (propName + ': ').length`
   */
  it("Property 11: Chip insertion places 'propname: ' at cursor without altering surrounding content", () => {
    // Arbitrary textarea content (any string, including empty)
    const contentArb = fc.string({ minLength: 0, maxLength: 200 });

    // Cursor position: selectionStart = selectionEnd (no selection), within [0, value.length]
    const taArb = contentArb.chain(value => {
      const cursorArb = fc.integer({ min: 0, max: value.length });
      return cursorArb.map(cursor => ({
        value,
        selectionStart: cursor,
        selectionEnd: cursor,
      }));
    });

    // Pick a property name from the reference list
    const propArb = fc.constantFrom(...REFERENCE_PROPS);

    fc.assert(
      fc.property(taArb, propArb, (ta, propName) => {
        const insertedText = propName + ': ';
        const before = ta.value.slice(0, ta.selectionStart);
        const after = ta.value.slice(ta.selectionEnd);

        const result = insertAtCursor(ta, insertedText);

        // 1. Text before the cursor is unchanged
        expect(result.value.slice(0, ta.selectionStart)).toBe(before);

        // 2. The inserted text is exactly `propName + ': '`
        expect(result.value.slice(ta.selectionStart, ta.selectionStart + insertedText.length)).toBe(insertedText);

        // 3. Text after the cursor is unchanged
        expect(result.value.slice(ta.selectionStart + insertedText.length)).toBe(after);

        // 4. New cursor position is selectionStart + insertedText.length
        expect(result.selectionStart).toBe(ta.selectionStart + insertedText.length);
        expect(result.selectionEnd).toBe(ta.selectionStart + insertedText.length);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Edge case: insertion at position 0 (beginning of textarea)
   */
  it("Chip insertion at position 0 prepends text correctly", () => {
    const propArb = fc.constantFrom(...REFERENCE_PROPS);
    const contentArb = fc.string({ minLength: 0, maxLength: 100 });

    fc.assert(
      fc.property(contentArb, propArb, (value, propName) => {
        const ta = { value, selectionStart: 0, selectionEnd: 0 };
        const insertedText = propName + ': ';
        const result = insertAtCursor(ta, insertedText);

        expect(result.value).toBe(insertedText + value);
        expect(result.selectionStart).toBe(insertedText.length);
        expect(result.selectionEnd).toBe(insertedText.length);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Edge case: insertion at end of textarea
   */
  it("Chip insertion at end of textarea appends text correctly", () => {
    const propArb = fc.constantFrom(...REFERENCE_PROPS);
    const contentArb = fc.string({ minLength: 0, maxLength: 100 });

    fc.assert(
      fc.property(contentArb, propArb, (value, propName) => {
        const ta = { value, selectionStart: value.length, selectionEnd: value.length };
        const insertedText = propName + ': ';
        const result = insertAtCursor(ta, insertedText);

        expect(result.value).toBe(value + insertedText);
        expect(result.selectionStart).toBe(value.length + insertedText.length);
        expect(result.selectionEnd).toBe(value.length + insertedText.length);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Edge case: insertion with a selection range (selectionStart !== selectionEnd)
   * The selected text is replaced by the inserted text.
   */
  it("Chip insertion replaces selected text when selectionStart !== selectionEnd", () => {
    const propArb = fc.constantFrom(...REFERENCE_PROPS);

    // Generate a string with a valid selection range
    const taWithSelectionArb = fc.string({ minLength: 2, maxLength: 100 }).chain(value => {
      const startArb = fc.integer({ min: 0, max: value.length - 1 });
      return startArb.chain(start => {
        const endArb = fc.integer({ min: start + 1, max: value.length });
        return endArb.map(end => ({ value, selectionStart: start, selectionEnd: end }));
      });
    });

    fc.assert(
      fc.property(taWithSelectionArb, propArb, (ta, propName) => {
        const insertedText = propName + ': ';
        const before = ta.value.slice(0, ta.selectionStart);
        const after = ta.value.slice(ta.selectionEnd);

        const result = insertAtCursor(ta, insertedText);

        // Selected text is replaced: before + insertedText + after
        expect(result.value).toBe(before + insertedText + after);
        expect(result.selectionStart).toBe(ta.selectionStart + insertedText.length);
        expect(result.selectionEnd).toBe(ta.selectionStart + insertedText.length);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
