/**
 * Time & Date entries store a moment.js format alongside the generated regex;
 * the UI shows the FORMAT (as a button), never the regex. These tests pin down
 * how the format behind an entry is resolved — including entries created
 * before `dateTimeFormat` was stored, which only carry the preset label.
 */

import { describe, it, expect } from "vitest";
import { getEntryDateTimeFormat } from "./entryDateTimeFormat.js";

const plugin = { t: (key, fallback) => fallback }; // "Time & Date"

describe("getEntryDateTimeFormat", () => {
  it("returns the stored format for a Time & Date entry", () => {
    const entry = {
      isRegex: true,
      dateTimeFormat: "DD_MMMM_Y",
      presetLabel: "Time & Date (DD_MMMM_Y)",
    };
    expect(getEntryDateTimeFormat(entry, plugin)).toBe("DD_MMMM_Y");
  });

  it("trims whitespace around the stored format", () => {
    const entry = { isRegex: true, dateTimeFormat: "  h:mm A  " };
    expect(getEntryDateTimeFormat(entry, plugin)).toBe("h:mm A");
  });

  it("recovers the format from the preset label and backfills the entry", () => {
    // Older entries never stored dateTimeFormat — the label is all they have.
    const entry = {
      isRegex: true,
      pattern: "\\b\\d{2}_\\p{L}+_\\d{4}\\b",
      presetLabel: "Time & Date (DD_MMMM_Y)",
    };
    expect(getEntryDateTimeFormat(entry, plugin)).toBe("DD_MMMM_Y");
    // Backfilled so renaming the entry later can't lose it.
    expect(entry.dateTimeFormat).toBe("DD_MMMM_Y");
  });

  it("keeps parentheses inside a recovered format", () => {
    const entry = { isRegex: true, presetLabel: "Time & Date ((h:mm A))" };
    expect(getEntryDateTimeFormat(entry, plugin)).toBe("(h:mm A)");
  });

  it("returns nothing for other presets and plain word entries", () => {
    expect(
      getEntryDateTimeFormat(
        { isRegex: true, presetLabel: "Times (24h)" },
        plugin,
      ),
    ).toBe("");
    expect(
      getEntryDateTimeFormat(
        { isRegex: false, pattern: "hello", presetLabel: "Time & Date (x)" },
        plugin,
      ),
    ).toBe("");
  });

  it("returns nothing when the label was renamed or has no format", () => {
    expect(
      getEntryDateTimeFormat(
        { isRegex: true, presetLabel: "My dates" },
        plugin,
      ),
    ).toBe("");
    expect(
      getEntryDateTimeFormat({ isRegex: true, presetLabel: "Time & Date" }, plugin),
    ).toBe("");
    expect(
      getEntryDateTimeFormat(
        { isRegex: true, presetLabel: "Time & Date ()" },
        plugin,
      ),
    ).toBe("");
    expect(getEntryDateTimeFormat(null, plugin)).toBe("");
  });
});
