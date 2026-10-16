/**
 * Regression test for issue #58: "Error highlights in Chinese texts".
 *
 * In Contains mode a Chinese word match expanded to the whole sentence
 * (e.g. pattern "爱" in "我爱学习" painted 0-4 instead of 1-2), because
 * CJK glyphs were treated as word characters and Chinese has no spaces.
 * No-space scripts (Han/Hiragana/Katakana) are word boundaries: matches
 * highlight the exact substring, while Latin expansion (art -> part) and
 * Korean space-delimited expansion are preserved.
 */

import { describe, it, expect } from "vitest";
import {
  PatternMatcher,
  compilePatternCore,
  isNoSpaceScriptChar,
  containsNoSpaceScript,
} from "./patternCompiler.js";

function makeMatcher(matchType) {
  return new PatternMatcher(
    { matchType, partialMatch: true },
    {
      escapeRegex: (s) =>
        String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      isSentenceLikePattern: (p) =>
        /[\s,\.;:!\?"'\(\)\[\]\{\}<>@#]/.test(p || ""),
      safeMatchLoop: (regex, text) => {
        const out = [];
        regex.lastIndex = 0;
        let m;
        let guard = 0;
        while ((m = regex.exec(text)) !== null && guard++ < 100) {
          out.push({ 0: m[0], index: m.index });
          if (regex.lastIndex === m.index) break;
        }
        return out;
      },
    },
  );
}

function matchHighlights(text, pattern, matchType) {
  const matcher = makeMatcher(matchType);
  const entry = {
    pattern,
    isRegex: false,
    matchType,
    caseSensitive: false,
    textColor: "#ff0000",
    color: "#ff0000",
  };
  matcher.compilePattern(entry, {
    getOrCreate: (p, f) => new RegExp(p, f),
  });
  return matcher.match(text, [entry], null).map((m) => ({
    start: m.start,
    end: m.end,
    text: text.substring(m.start, m.end),
  }));
}

describe("issue #58: CJK contains highlights", () => {
  it("identifies no-space-script characters", () => {
    expect(isNoSpaceScriptChar("爱")).toBe(true);
    expect(isNoSpaceScriptChar("あ")).toBe(true);
    expect(isNoSpaceScriptChar("カ")).toBe(true);
    expect(isNoSpaceScriptChar("a")).toBe(false);
    expect(isNoSpaceScriptChar(" ")).toBe(false);
    // Hangul is excluded on purpose: Korean uses spaces between words.
    expect(isNoSpaceScriptChar("한")).toBe(false);
    expect(containsNoSpaceScript("我爱学习")).toBe(true);
    expect(containsNoSpaceScript("hello")).toBe(false);
  });

  it("highlights only the matched Chinese word in contains mode", () => {
    expect(matchHighlights("我爱学习", "爱", "contains")).toEqual([
      { start: 1, end: 2, text: "爱" },
    ]);
    expect(matchHighlights("我爱学习很好", "学习", "contains")).toEqual([
      { start: 2, end: 4, text: "学习" },
    ]);
  });

  it("highlights only the matched substring for every CJK match type", () => {
    for (const mt of ["exact", "contains", "startswith", "endswith"]) {
      expect(matchHighlights("我爱学习很好", "学习", mt)).toEqual([
        { start: 2, end: 4, text: "学习" },
      ]);
    }
  });

  it("handles Japanese kana the same way", () => {
    expect(matchHighlights("今日は良い天気です", "天気", "contains")).toEqual([
      { start: 5, end: 7, text: "天気" },
    ]);
  });

  it("does not let a CJK match swallow adjacent Latin text", () => {
    expect(matchHighlights("test测试test", "测试", "contains")).toEqual([
      { start: 4, end: 6, text: "测试" },
    ]);
    expect(matchHighlights("test测试test", "测试", "exact")).toEqual([
      { start: 4, end: 6, text: "测试" },
    ]);
    expect(matchHighlights("test测试test", "test", "contains")).toEqual([
      { start: 0, end: 4, text: "test" },
      { start: 6, end: 10, text: "test" },
    ]);
  });

  it("preserves Latin full-word expansion", () => {
    expect(matchHighlights("this is part of it", "art", "contains")).toEqual([
      { start: 8, end: 12, text: "part" },
    ]);
  });

  it("preserves Korean space-delimited expansion", () => {
    expect(matchHighlights("나는 학교에 간다", "학교", "contains")).toEqual([
      { start: 3, end: 6, text: "학교에" },
    ]);
  });

  it("compiles an exact single CJK char without blocking lookarounds", () => {
    const fakePlugin = {
      sanitizePattern: (p) => String(p).trim(),
      isKnownProblematicPattern: () => false,
      escapeRegex: (s) =>
        String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      isSentenceLikePattern: (p) =>
        /[\s,\.;:!\?"'\(\)\[\]\{\}<>@#]/.test(p || ""),
      settings: { enableRegexSupport: false, disableRegexSafety: true },
      _regexCache: { getOrCreate: (p, f) => new RegExp(p, f) },
      _bloomFilter: null,
      createFastTester: () => () => true,
    };
    const res = compilePatternCore(
      fakePlugin,
      { isRegex: false },
      "爱",
      { matchType: "exact" },
    );
    expect(res.blocked).toBe(false);
    res.compiled.regex.lastIndex = 0;
    expect(res.compiled.regex.test("我爱学习")).toBe(true);
  });
});
