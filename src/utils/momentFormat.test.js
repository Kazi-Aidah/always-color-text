/**
 * "Time & Date" preset: a moment.js format must compile into a regex that
 * actually matches text written the way moment renders it, and it must stay
 * inside the plugin's own regex-safety limits — otherwise the entry is
 * silently rejected at compile time and nothing gets colored.
 */

import { describe, it, expect } from "vitest";
import {
  DEFAULT_DATE_TIME_FORMAT,
  evaluateDateTimeFormat,
  renderFormat,
} from "./momentFormat.js";

/**
 * Minimal moment stand-in: `render` maps a format to what moment would print
 * for the current date/time. Real moment is provided by Obsidian at runtime
 * (and is deliberately not a dependency of this package).
 */
function makeMoment(render) {
  const fn = () => ({
    format: (fmt) => render(String(fmt)),
    isValid: () => true,
  });
  fn.localeData = () => ({ longDateFormat: () => null });
  return fn;
}

const moment = makeMoment((fmt) => {
  const known = {
    "hh:mm a, D MMMM Y": "09:05 pm, 25 September 2026",
    DD_MMMM_Y: "25_September_2026",
    "YYYY-MM-DD": "2026-09-25",
    "h:mm A": "9:05 AM",
    "DD MMMM YYYY": "25 September 2026",
    "DD/MM/YYYY HH:mm": "25/09/2026 14:30",
    "dddd, MMMM Do YYYY, h:mm:ss A": "Friday, September 25th 2026, 2:30:15 PM",
    "MMM D, YYYY": "Sep 25, 2026",
    LT: "9:05 AM",
    LLLL: "Friday, September 25 2026 2:30 PM",
  };
  return known[fmt] ?? `rendered:${fmt}`;
});

/**
 * Mirror of the limits `plugin.isRegexTooComplex()` enforces (plus the
 * `sanitizePattern()` length cap). A generated pattern that breaks any of
 * these is rejected by `validateAndSanitizeRegex()` and the entry never runs.
 */
function pluginWouldReject(pattern) {
  if (pattern.length > 100) return "too long (>100)";
  if (/\(\?[=!<]/.test(pattern)) return "lookaround";
  if (/\*\+|\+\*/.test(pattern)) return "adjacent quantifiers";
  if (/\{[^}]*\{[^}]*\}/.test(pattern)) return "nested quantifier ranges";
  if (/\[[^\]]*\[[^\]]*\]/.test(pattern)) return "nested character classes";
  if ((pattern.match(/\|/g) || []).length > 5) return "too many alternations";
  if ((pattern.match(/\([^?]/g) || []).length > 5) return "too many groups";
  if ((pattern.match(/[*+?{]/g) || []).length > 10) return "too many quantifiers";
  return null;
}

const compile = (format, m = moment) => evaluateDateTimeFormat(format, m);

describe("evaluateDateTimeFormat — moment format to regex", () => {
  it("compiles the default format and matches a rendered date/time", () => {
    const state = compile(DEFAULT_DATE_TIME_FORMAT);
    expect(state.ok).toBe(true);
    expect(state.sample).toBe("09:05 pm, 25 September 2026");

    const re = new RegExp(state.pattern, "iu");
    // The previewed text, another time/date, another month/year.
    expect(re.test("09:05 pm, 25 September 2026")).toBe(true);
    expect(re.test("11:59 am, 3 January 2026")).toBe(true);
    expect(re.test("12:01 pm, 10 December 1999")).toBe(true);
  });

  it("keeps matches inside words out via \\b", () => {
    const state = compile(DEFAULT_DATE_TIME_FORMAT);
    const re = new RegExp(state.pattern, "iu");
    expect(re.test("at 09:05 pm, 25 September 2026 now")).toBe(true);
    expect(re.test("x09:05 pm, 25 September 2026")).toBe(false);
    expect(re.test("09:05 pm, 25 September 2026x")).toBe(false);
  });

  it("compiles numeric formats strictly (padded tokens stay padded)", () => {
    const state = compile("YYYY-MM-DD");
    expect(state.ok).toBe(true);
    const re = new RegExp(state.pattern, "iu");
    expect(re.test("2026-09-25")).toBe(true);
    expect(re.test("2009-01-19")).toBe(true);
    expect(re.test("9-1-19")).toBe(false);
    // Boundaries: not inside a longer word, but fine in a sentence.
    expect(re.test("on 2026-09-25")).toBe(true);
    expect(re.test("x2026-09-25")).toBe(false);
  });

  it("compiles 12-hour time with AM/PM", () => {
    const state = compile("h:mm A");
    expect(state.ok).toBe(true);
    const re = new RegExp(state.pattern, "iu");
    expect(re.test("9:05 AM")).toBe(true);
    expect(re.test("9:05 am")).toBe(true);
    expect(re.test("12:59 PM")).toBe(true);
    expect(re.test("25:05 AM")).toBe(false);
    expect(re.test("9:65 AM")).toBe(false);
  });

  it("treats [bracketed] text as a literal", () => {
    const state = evaluateDateTimeFormat(
      "[Day] DD",
      makeMoment(() => "Day 25"),
    );
    expect(state.ok).toBe(true);
    const re = new RegExp(state.pattern, "iu");
    expect(re.test("Day 25")).toBe(true);
    expect(re.test("Xay 25")).toBe(false);
  });

  it("expands localized formats through moment's locale", () => {
    const localized = makeMoment(() => "9:05 AM");
    localized.localeData = () => ({ longDateFormat: () => "h:mm A" });
    const state = evaluateDateTimeFormat("LT", localized);
    expect(state.ok).toBe(true);
    expect(new RegExp(state.pattern, "iu").test("9:05 AM")).toBe(true);
    expect(pluginWouldReject(state.pattern)).toBe(null);
  });

  it("drops word boundaries when they would block non-ASCII names", () => {
    const state = evaluateDateTimeFormat(
      "MMMM YYYY",
      makeMoment(() => "Сентябрь 2026"),
    );
    expect(state.ok).toBe(true);
    // No leading \b: ASCII-only boundaries never fire around Cyrillic text.
    expect(state.pattern.startsWith("\\b")).toBe(false);
    expect(new RegExp(state.pattern, "iu").test("Сентябрь 2026")).toBe(true);
  });

  it("reports an error instead of returning a pattern that can't match", () => {
    const state = evaluateDateTimeFormat(
      "YYYY",
      makeMoment(() => "twenty twenty-six"),
    );
    expect(state.ok).toBe(false);
    expect(state.error).toBe("mismatch");
  });

  it("rejects empty formats and a missing moment", () => {
    expect(compile("").error).toBe("empty");
    expect(compile("   ").error).toBe("empty");
    expect(evaluateDateTimeFormat("YYYY", undefined).error).toBe("render");
  });

  it("reports formats blocked by the plugin's regex safety", () => {
    const state = evaluateDateTimeFormat(
      "DD_MMMM_Y",
      moment,
      () => false,
    );
    expect(state.ok).toBe(false);
    expect(state.error).toBe("blocked");
    // …and passes when the plugin allows it.
    expect(
      evaluateDateTimeFormat("DD_MMMM_Y", moment, () => true).ok,
    ).toBe(true);
  });

  it("rejects patterns longer than the compile-time hard cap", () => {
    const long = `[${"a".repeat(220)}]`;
    const state = evaluateDateTimeFormat(
      long,
      makeMoment(() => "a".repeat(220)),
    );
    expect(state.ok).toBe(false);
    expect(state.error).toBe("too-long");
  });
});

describe("generated patterns stay inside the plugin's safety limits", () => {
  const formats = [
    DEFAULT_DATE_TIME_FORMAT,
    "YYYY-MM-DD",
    "DD/MM/YYYY HH:mm",
    "h:mm A",
    "dddd, MMMM Do YYYY, h:mm:ss A",
    "MMM D, YYYY",
    "LT",
    "LLLL",
  ];

  it.each(formats)("%s", (format) => {
    const state = compile(format);
    expect(state.ok).toBe(true);
    expect(state.sample.length).toBeGreaterThan(0);
    expect(pluginWouldReject(state.pattern)).toBe(null);
    // The previewed text must always be matched by the stored pattern —
    // that is the text the color picker shows and the editor colors.
    expect(new RegExp(state.pattern, "iu").test(state.sample)).toBe(true);
  });
});

describe("renderFormat", () => {
  it("returns what moment renders", () => {
    expect(renderFormat("YYYY-MM-DD", moment)).toBe("2026-09-25");
  });

  it("returns null when there is nothing to render", () => {
    expect(renderFormat("", makeMoment(() => ""))).toBe(null);
    expect(renderFormat("YYYY", undefined)).toBe(null);
    expect(
      renderFormat("YYYY", () => {
        throw new Error("boom");
      }),
    ).toBe(null);
  });
});
