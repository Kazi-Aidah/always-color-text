/**
 * Regex tester preview parity tests (previewMatcher).
 *
 * The tester must answer "what will Live Preview actually paint?" by
 * compiling the draft through the SAME compilePatternCore the editor uses
 * and replaying the Live Preview run gates. These tests pin:
 *  - compile parity against direct compileWordEntriesLogic /
 *    compileTextBgColoringEntriesLogic (the editor's compile entry points),
 *  - every status gate (disabled/inactive/no-color/too-long/blocked/
 *    blacklisted/hidden/target-element),
 *  - match-time gates (whole-word, spoiler/codeblock/heading, zero-width,
 *    caps, chunking, fastTest pre-filter, word completion, list/context
 *    blacklists, paint-time hide gates),
 *  - the selection pipeline (greedy longer-wins, phase-2 isTextBg filter,
 *    adjacent merge),
 *  - source-level wiring of the modal (renderPreview calls the engine; no
 *    more raw.matchAll/new RegExp fast paths; sanitizePattern guarded).
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import {
  computePreviewMatches,
  selectPaintedMatches,
  describePreviewStatus,
  describePreviewNotes,
} from "./previewMatcher.js";
import {
  compileWordEntriesLogic,
  compileTextBgColoringEntriesLogic,
} from "./patternCompiler.js";

const ROOT = join(__dirname, "..", "..");
const modalSrc = readFileSync(
  join(ROOT, "src", "modals", "RealTimeRegexTesterModal.js"),
  "utf8",
);

const isWordChar = (ch) => {
  if (!ch) return false;
  if (ch === "-" || ch === "'") return true;
  return /[\p{L}\p{N}]/u.test(ch);
};

function makePlugin(overrides = {}, opts = {}) {
  const plugin = {
    settings: {
      enabled: true,
      matchType: "contains",
      partialMatch: true,
      caseSensitive: false,
      disableRegexSafety: false,
      enableRegexSupport: true,
      enableWordCompletionColoring: false,
      extremeLightweightMode: false,
      hideHighlights: false,
      hideTextColors: false,
      enableCustomCss: false,
      disableLivePreviewColoring: false,
      blacklistWords: [],
      blacklistEntries: [],
      wordEntries: [],
      wordEntryGroups: [],
      ...(overrides || {}),
    },
    _isTyping: false,
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
    },
    sanitizePattern: (p, isRegex) => {
      const s = String(p || "").trim();
      if (isRegex && s.length > 200) throw new Error("Pattern too long");
      if (!isRegex && s.length > 500) throw new Error("Pattern too long");
      return s;
    },
    isKnownProblematicPattern: () => false,
    escapeRegex: (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    validateAndSanitizeRegex: () => true,
    createFastTester: (pattern) => opts.fastTest || (() => true),
    _regexCache: { clear: () => {}, getOrCreate: (p, f) => new RegExp(p, f) },
    _bloomFilter: null,
    _compiledWordEntries: [],
    _compiledTextBgEntries: [],
    t: (k, d) => d,
    isWordCharacter: isWordChar,
    isWholeWordMatch(text, matchStart, matchEnd) {
      const leftChar = matchStart > 0 ? text[matchStart - 1] : "";
      const rightChar = matchEnd < text.length ? text[matchEnd] : "";
      const leftOk = matchStart === 0 || !isWordChar(leftChar);
      const rightOk = matchEnd === text.length || !isWordChar(rightChar);
      return leftOk && rightOk;
    },
    isSentenceLikePattern(p) {
      const s = String(p || "");
      if (/^[A-Za-z0-9'\-]+(?:\s+[A-Za-z0-9'\-]+)+$/.test(s)) return false;
      return /[\s,\.;:!\?"'\(\)\[\]\{\}<>@#]/.test(s);
    },
    getBlacklistedListItemRanges: () => [],
    isMatchInBlacklistedRange: () => false,
    buildBlacklistWordSet: () => new Set(),
    extractFullWord(text, matchStart, matchEnd) {
      let start = matchStart;
      let end = matchEnd;
      while (start > 0 && isWordChar(text[start - 1])) start--;
      while (end < text.length && isWordChar(text[end])) end++;
      return text.slice(start, end);
    },
    isContextBlacklisted: () => false,
    matchSatisfiesType: () => true,
    getSortedWordEntries() {
      return [...this._compiledWordEntries, ...this._compiledTextBgEntries];
    },
  };
  return plugin;
}

/** Draft input shaped exactly like the modal's save path would build it. */
const baseInput = (over = {}) => ({
  pattern: "foo",
  flags: "",
  sample: "foo bar foo",
  caseSensitive: false,
  styleType: "text",
  markTarget: "text",
  color: "#ff0000",
  textColor: null,
  backgroundColor: null,
  editing: false,
  ...over,
});

const noteIds = (res) => res.notes.map((n) => n.id);
const t = (k, d) => d;

describe("compile parity: preview uses the editor's compile core", () => {
  it("regex mode: same regex source/flags as compileWordEntriesLogic", () => {
    const plugin = makePlugin({ enableRegexSupport: true });
    plugin.settings.wordEntries = [
      {
        uid: "e1",
        pattern: "colou?r",
        flags: "i",
        isRegex: true,
        styleType: "text",
        color: "#ff0000",
        textColor: null,
        backgroundColor: null,
        caseSensitive: false,
      },
    ];
    compileWordEntriesLogic(plugin);
    const direct = plugin._compiledWordEntries[0];
    expect(direct).toBeTruthy();

    const res = computePreviewMatches(
      plugin,
      baseInput({
        pattern: "colou?r",
        flags: "i",
        sample: "color COLOR colour",
      }),
    );
    expect(res.status).toBe("ok");
    expect(res.regexSource).toBe(direct.regex.source);
    expect(res.regexFlags).toBe(direct.regex.flags);
    expect(res.effectiveFlags).toBe(direct.flags);
    expect(res.count).toBe(3);
  });

  it("textBg mode: same regex source/flags as compileTextBgColoringEntriesLogic", () => {
    const plugin = makePlugin({ enableRegexSupport: true });
    plugin.settings.wordEntries = [
      {
        uid: "e1",
        pattern: "foo",
        isRegex: true,
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "#ff0000",
      },
    ];
    compileTextBgColoringEntriesLogic(plugin);
    const direct = plugin._compiledTextBgEntries[0];
    expect(direct).toBeTruthy();

    const res = computePreviewMatches(
      plugin,
      baseInput({
        pattern: "foo",
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "#ff0000",
      }),
    );
    expect(res.status).toBe("ok");
    expect(res.channel).toBe("textBg");
    expect(res.regexSource).toBe(direct.regex.source);
    expect(res.effectiveFlags).toBe(direct.flags);
    expect(res.count).toBe(2);
  });

  it("literal mode (regex support off): escaped literal only + regex-off note", () => {
    const plugin = makePlugin({ enableRegexSupport: false });
    plugin.settings.wordEntries = [
      {
        uid: "e1",
        pattern: "foo.bar",
        isRegex: true,
        styleType: "text",
        color: "#ff0000",
        textColor: null,
        backgroundColor: null,
      },
    ];
    compileWordEntriesLogic(plugin);
    const direct = plugin._compiledWordEntries[0];

    const res = computePreviewMatches(
      plugin,
      baseInput({ pattern: "foo.bar", sample: "foo.bar fooxbar foo.bar" }),
    );
    expect(res.status).toBe("ok");
    expect(res.regexSource).toBe(direct.regex.source);
    expect(res.count).toBe(2);
    expect(noteIds(res)).toContain("regex-off");
  });

  it("literal mode honors matchType (startswith wrapping) like the editor", () => {
    const plugin = makePlugin({
      enableRegexSupport: false,
      matchType: "startswith",
    });
    plugin.settings.wordEntries = [
      {
        uid: "e1",
        pattern: "ab",
        isRegex: true,
        matchType: "startswith",
        styleType: "text",
        color: "#ff0000",
        textColor: null,
        backgroundColor: null,
      },
    ];
    compileWordEntriesLogic(plugin);
    const direct = plugin._compiledWordEntries[0];
    expect(direct.matchType).toBe("startswith");

    const res = computePreviewMatches(
      plugin,
      baseInput({ pattern: "ab", sample: "xab ab" }),
    );
    expect(res.status).toBe("ok");
    // Same fallback chain as the editor: entry → settings → partialMatch.
    expect(res.regexSource).toBe(direct.regex.source);
    // startswith wraps with a word-boundary lookbehind: only " ab" matches.
    expect(res.count).toBe(1);
  });

  it("compiler-forced i flag: effective flags equal the editor's", () => {
    const plugin = makePlugin({ enableRegexSupport: true });
    plugin.settings.wordEntries = [
      {
        uid: "e1",
        pattern: "Color",
        isRegex: true,
        flags: "",
        styleType: "text",
        color: "#ff0000",
        textColor: null,
        backgroundColor: null,
        caseSensitive: false,
      },
    ];
    compileWordEntriesLogic(plugin);
    const direct = plugin._compiledWordEntries[0];

    const res = computePreviewMatches(
      plugin,
      baseInput({ pattern: "Color", sample: "color Color" }),
    );
    expect(res.effectiveFlags).toBe("gi");
    expect(res.effectiveFlags).toBe(direct.flags);
    expect(res.count).toBe(2);
    const flagNote = res.notes.find((n) => n.id === "flags");
    expect(flagNote).toBeTruthy();
    expect(flagNote.value).toBe("gi");
  });

  it("group caseSensitiveOverride wins: no forced i, case-sensitive matches", () => {
    const plugin = makePlugin({ enableRegexSupport: true, caseSensitive: false });
    const res = computePreviewMatches(
      plugin,
      baseInput({
        pattern: "Color",
        sample: "color Color",
        group: {
          uid: "g1",
          active: true,
          caseSensitiveOverride: true,
          styleType: undefined,
          color: "",
          textColor: null,
          backgroundColor: null,
        },
      }),
    );
    expect(res.status).toBe("ok");
    expect(res.effectiveFlags).toBe("g");
    expect(res.count).toBe(1);
  });

  it("group colortype override reroutes the draft into the textBg channel", () => {
    const plugin = makePlugin({ enableRegexSupport: true });
    const res = computePreviewMatches(
      plugin,
      baseInput({
        pattern: "foo",
        styleType: "text", // draft asks for text-only…
        color: "#ff0000",
        textColor: null,
        group: {
          uid: "g2",
          active: true,
          styleType: "both",
          color: "",
          textColor: "#2d98da",
          backgroundColor: "#3867d6",
        },
      }),
    );
    expect(res.status).toBe("ok");
    // …but the group forces a background, so the editor compiles it as
    // text-bg — the preview must follow.
    expect(res.channel).toBe("textBg");
    expect(res.count).toBe(2);
  });
});

describe("status gates (why the editor matches nothing)", () => {
  it("plugin disabled → disabled", () => {
    const res = computePreviewMatches(
      makePlugin({ enabled: false }),
      baseInput(),
    );
    expect(res.status).toBe("disabled");
    expect(describePreviewStatus(res, t)).toContain("disabled");
  });

  it("plugin disabled + ignoreGlobalEnabled (the tester) → still paints, with a note", () => {
    const res = computePreviewMatches(
      makePlugin({ enabled: false }),
      baseInput({ ignoreGlobalEnabled: true }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBeGreaterThan(0);
    expect(noteIds(res)).toContain("plugin-off");
    expect(describePreviewNotes(res, t)).toContain("tester previews anyway");
  });

  it("inactive group → inactive/group", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({ group: { uid: "g", active: false, entries: [] } }),
    );
    expect(res.status).toBe("inactive");
    expect(res.reason).toBe("group");
    expect(describePreviewStatus(res, t)).toContain("group is inactive");
  });

  it("entry.active === false → inactive/entry", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({ entryActive: false }),
    );
    expect(res.status).toBe("inactive");
    expect(res.reason).toBe("entry");
    expect(describePreviewStatus(res, t)).toContain("entry is disabled");
  });

  it("untouched text picker (color '') → no-color (the editor skips it)", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({ color: "", textColor: null }),
    );
    expect(res.status).toBe("no-color");
    expect(res.count).toBe(0);
    expect(describePreviewStatus(res, t)).toContain("No usable color");
  });

  it("both pickers untouched → no-color", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({
        styleType: "both",
        color: "",
        textColor: "",
        backgroundColor: "",
      }),
    );
    expect(res.status).toBe("no-color");
  });

  it("invalid background → no-color (textBg channel)", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "#zzzzzz",
      }),
    );
    expect(res.status).toBe("no-color");
  });

  it("highlight with untouched bg still compiles (currentColor text gate)", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "",
      }),
    );
    expect(res.status).toBe("ok");
    expect(res.channel).toBe("word");
    expect(res.count).toBe(2);
  });

  it("pattern >200 chars → too-long (sanitize throw is caught)", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({ pattern: "a".repeat(250) }),
    );
    expect(res.status).toBe("too-long");
    expect(describePreviewStatus(res, t)).toContain("too long");
  });

  it("safety validation failure → blocked", () => {
    const plugin = makePlugin();
    plugin.validateAndSanitizeRegex = (p) => !String(p).includes("(a+)+");
    const res = computePreviewMatches(
      plugin,
      baseInput({ pattern: "(a+)+", sample: "aaaa!" }),
    );
    expect(res.status).toBe("blocked");
    expect(describePreviewStatus(res, t)).toContain("blocked");
  });

  it("pattern in blacklistWords → blacklisted", () => {
    const res = computePreviewMatches(
      makePlugin({ blacklistWords: ["foo"] }),
      baseInput(),
    );
    expect(res.status).toBe("blacklisted");
    expect(describePreviewStatus(res, t)).toContain("blacklisted");
  });

  it("hideTextColors drops a text-style draft → hidden", () => {
    const res = computePreviewMatches(
      makePlugin({ hideTextColors: true }),
      baseInput({ styleType: "text", color: "#ff0000", textColor: null }),
    );
    expect(res.status).toBe("hidden");
    expect(describePreviewStatus(res, t)).toContain("color-hiding");
  });

  it("markdown-element presetLabel → 0 matches + target-element note", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({ presetLabel: "bold" }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(0);
    expect(noteIds(res)).toContain("target-element");
  });
});

describe("match-time gates (Live Preview behaviour)", () => {
  it("whole-word gate (matchType exact) rejects subwords + reading-mode note", () => {
    const plugin = makePlugin({
      enableRegexSupport: true,
      matchType: "exact",
    });
    const res = computePreviewMatches(
      plugin,
      baseInput({ pattern: "cat", sample: "cat catalog cat." }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(2);
    expect(res.rejected.wholeWord).toBe(1);
    expect(noteIds(res)).toContain("whole-word");
    const text = describePreviewNotes(res, t);
    expect(text).toContain("reading mode");
  });

  it("matches inside spoilers are not painted → rejected.spoiler", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({ pattern: "secret", sample: "outside ||secret|| inside" }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(0);
    expect(res.rejected.spoiler).toBe(1);
    expect(describePreviewNotes(res, t)).toContain("spoilers");
  });

  it("codeblock blacklist: skip markers hide matches inside code blocks", () => {
    const res = computePreviewMatches(
      makePlugin({
        blacklistEntries: [
          { presetLabel: "Codeblocks", isRegex: true, pattern: "```" },
        ],
      }),
      baseInput({ pattern: "secret", sample: "a ```secret``` b" }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(0);
    expect(res.rejected.codeblock).toBe(1);
    expect(describePreviewNotes(res, t)).toContain("code blocks");
  });

  it("codeblock coloring entry: covers win over shorter draft matches", () => {
    const plugin = makePlugin({ enableRegexSupport: true });
    plugin.settings.wordEntries = [
      {
        uid: "cb",
        pattern: "```[\\s\\S]*?```",
        isRegex: true,
        presetLabel: "Codeblocks",
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "#3867d6",
      },
    ];
    compileTextBgColoringEntriesLogic(plugin);
    const res = computePreviewMatches(
      plugin,
      baseInput({ pattern: "secret", sample: "a ```secret``` b" }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(0);
    expect(res.rejected.codeblock).toBe(1);
    expect(noteIds(res)).toContain("codeblock");
  });

  it("heading coloring entry: heading line covers reject draft matches", () => {
    const plugin = makePlugin({ enableRegexSupport: true });
    plugin.settings.wordEntries = [
      {
        uid: "h",
        pattern: "#{1,6}",
        isRegex: true,
        presetLabel: "Heading",
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "#3867d6",
      },
    ];
    compileTextBgColoringEntriesLogic(plugin);
    const res = computePreviewMatches(
      plugin,
      baseInput({ pattern: "Title", sample: "# Title here" }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(0);
    expect(res.rejected.heading).toBe(1);
    expect(noteIds(res)).toContain("heading");
  });

  it("zero-width matches: scan stops, nothing painted, note emitted", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({ pattern: "z*", sample: "abc" }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(0);
    expect(res.rejected.zeroWidth).toBe(1);
    expect(noteIds(res)).toContain("zero-width");
  });

  it("caps at 500 matches per pattern and notes it", () => {
    const res = computePreviewMatches(
      makePlugin(),
      baseInput({ pattern: "\\w", sample: "x".repeat(600) }),
    );
    expect(res.count).toBe(500);
    expect(res.capped).toBe(true);
    expect(noteIds(res)).toContain("capped");
  });

  it("fastTest pre-filter rejection: whole sample skipped", () => {
    const res = computePreviewMatches(
      makePlugin({}, { fastTest: () => false }),
      baseInput(),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(0);
    expect(res.rejected.prefilter).toBe(1);
  });

  it("chunking: >2000-char sample with few patterns scans in 2000-char chunks", () => {
    const sample = "a".repeat(2100) + "needle" + "b".repeat(400);
    const res = computePreviewMatches(
      makePlugin({}, { fastTest: (text) => text.includes("needle") }),
      baseInput({ pattern: "needle", sample }),
    );
    expect(res.status).toBe("ok");
    expect(res.chunked).toBe(true);
    expect(noteIds(res)).toContain("chunked");
    // First chunk fails the pre-filter (no "needle"), second matches.
    expect(res.rejected.prefilter).toBe(1);
    expect(res.count).toBe(1);
  });

  it("no chunking when >20 text-pass patterns exist (whole-text scan)", () => {
    const sample = "a".repeat(2100) + "needle" + "b".repeat(400);
    const plugin = makePlugin({}, { fastTest: (text) => text.includes("needle") });
    plugin.settings.wordEntries = Array.from({ length: 20 }, (_, i) => ({
      uid: `e${i}`,
      pattern: `pat${i}x`,
      isRegex: true,
      styleType: "text",
      color: "#ff0000",
      textColor: null,
      backgroundColor: null,
    }));
    compileWordEntriesLogic(plugin);
    const res = computePreviewMatches(
      plugin,
      baseInput({ pattern: "needle", sample }),
    );
    expect(res.chunked).toBe(false);
    expect(noteIds(res)).not.toContain("chunked");
    // Whole sample passes the pre-filter → no rejected segments.
    expect(res.rejected.prefilter).toBe(0);
    expect(res.count).toBe(1);
  });

  it("word-completion (word channel): active-line gate not simulated, note only", () => {
    const res = computePreviewMatches(
      makePlugin({ enableWordCompletionColoring: true }),
      baseInput(),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(2);
    expect(noteIds(res)).toContain("word-completion");
  });

  it("word-completion (textBg channel): trailing-whitespace gate rejects", () => {
    const res = computePreviewMatches(
      makePlugin({ enableWordCompletionColoring: true }),
      baseInput({
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "#ff0000",
        pattern: "foo",
        sample: "foo fooey",
      }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(1);
    expect(res.rejected.wordCompletion).toBe(1);
    expect(noteIds(res)).toContain("word-completion-gate");
  });

  it("blacklisted list items reject matches", () => {
    const plugin = makePlugin();
    plugin.getBlacklistedListItemRanges = () => [{ start: 0, end: 9999 }];
    plugin.isMatchInBlacklistedRange = (s, e, ranges) =>
      s < ranges[0].end && e > ranges[0].start;
    const res = computePreviewMatches(plugin, baseInput());
    expect(res.count).toBe(0);
    expect(res.rejected.blacklistedList).toBe(2);
    expect(noteIds(res)).toContain("blacklist-list");
  });

  it("blacklist word set rejects matches by full-word context", () => {
    const plugin = makePlugin();
    plugin.buildBlacklistWordSet = () => new Set(["foo"]);
    const res = computePreviewMatches(plugin, baseInput());
    expect(res.count).toBe(0);
    expect(res.rejected.context).toBe(2);
    expect(noteIds(res)).toContain("context");
  });

  it("hide both channels: textBg matches found but not painted → paint-hidden", () => {
    const res = computePreviewMatches(
      makePlugin({ hideHighlights: true, hideTextColors: true }),
      baseInput({
        styleType: "both",
        color: "",
        textColor: "#ff0000",
        backgroundColor: "#00ff00",
      }),
    );
    expect(res.status).toBe("ok");
    expect(res.count).toBe(0);
    expect(res.rejected.paintHidden).toBe(2);
    expect(noteIds(res)).toContain("paint-hidden");
  });

  it("disableLivePreviewColoring adds the lp-off note", () => {
    const res = computePreviewMatches(
      makePlugin({ disableLivePreviewColoring: true }),
      baseInput(),
    );
    expect(res.status).toBe("ok");
    expect(noteIds(res)).toContain("lp-off");
  });
});

describe("selection pipeline (applyDecorationsFromMatches replica)", () => {
  it("skip marker longer than the draft match wins (spoiler wins)", () => {
    const { painted } = selectPaintedMatches([
      { start: 9, end: 19, skip: true, kind: "spoiler" },
      { start: 10, end: 16, color: "#f00", isDraft: true },
    ]);
    expect(painted.length).toBe(0);
  });

  it("draft match longer than the marker survives (longer-wins quirk)", () => {
    const { painted } = selectPaintedMatches([
      { start: 5, end: 8, skip: true, kind: "spoiler" },
      { start: 0, end: 10, color: "#f00", isDraft: true },
    ]);
    expect(painted.length).toBe(1);
    expect(painted[0].isDraft).toBe(true);
  });

  it("cover-vs-word overlap: greedy length decides, cover style irrelevant", () => {
    // The in-loop textBg check (and before it, greedy length) resolves these
    // overlaps in Live Preview — phase 2 only guards merge-created overlaps,
    // so a highlight-style cover does not "rescue" a shorter word match.
    for (const styleType of ["both", "highlight"]) {
      const { painted } = selectPaintedMatches([
        {
          start: 0,
          end: 10,
          isTextBg: true,
          entryRef: { styleType },
          textColor: "#f00",
          backgroundColor: "#0f0",
        },
        { start: 2, end: 5, color: "#00f", isDraft: true },
      ]);
      expect(painted.length).toBe(1);
      expect(painted[0].isTextBg).toBe(true);
    }
  });

  it("longer word match replaces a shorter cover (LP longer-wins quirk)", () => {
    const { painted } = selectPaintedMatches([
      {
        start: 2,
        end: 6,
        isTextBg: true,
        entryRef: { styleType: "both" },
        textColor: "#f00",
        backgroundColor: "#0f0",
      },
      { start: 0, end: 10, color: "#00f", isDraft: true },
    ]);
    expect(painted.length).toBe(1);
    expect(painted[0].isDraft).toBe(true);
  });

  it("phase-2 replica keeps the highlight-composition rule", () => {
    // Pins the phase-2 block of applyDecorationsFromMatches (its
    // `fStyle !== "highlight"` condition) even though the greedy step makes
    // the branch unreachable for direct overlaps today.
    const src = readFileSync(
      join(ROOT, "src", "services", "previewMatcher.js"),
      "utf8",
    );
    expect(src).toContain('if (fStyle !== "highlight")');
    expect(src).toContain('filtered.push(m);');
  });

  it("adjacent same-color isTextBg spans merge into one", () => {
    const { painted } = selectPaintedMatches([
      {
        start: 0,
        end: 5,
        isTextBg: true,
        textColor: "#f00",
        backgroundColor: "#0f0",
        entryRef: { styleType: "both" },
      },
      {
        start: 5,
        end: 9,
        isTextBg: true,
        textColor: "#f00",
        backgroundColor: "#0f0",
        entryRef: { styleType: "both" },
      },
    ]);
    expect(painted.length).toBe(1);
    expect(painted[0].start).toBe(0);
    expect(painted[0].end).toBe(9);
  });

  it("sort: longer match wins the same start (non-regex first on ties)", () => {
    const { painted } = selectPaintedMatches([
      { start: 0, end: 3, color: "#aaa", entryRef: { isRegex: true } },
      { start: 0, end: 8, color: "#bbb", entryRef: { isRegex: true } },
    ]);
    expect(painted.length).toBe(1);
    expect(painted[0].end).toBe(8);
  });
});

describe("message formatting", () => {
  it("describePreviewStatus returns '' for ok/unknown", () => {
    expect(describePreviewStatus({ status: "ok" }, t)).toBe("");
    expect(describePreviewStatus({ status: "empty" }, t)).toBe("");
  });

  it("describePreviewNotes joins notes and substitutes placeholders", () => {
    const text = describePreviewNotes(
      {
        notes: [
          { id: "flags", value: "gmi" },
          { id: "spoiler", n: 3 },
        ],
      },
      t,
    );
    expect(text).toContain("gmi");
    expect(text).toContain("3 matches hidden in spoilers");
    expect(text).toContain(" · ");
  });

  it("describePreviewNotes is empty when there are no notes", () => {
    expect(describePreviewNotes({ notes: [] }, t)).toBe("");
  });
});

describe("modal source wiring (RealTimeRegexTesterModal)", () => {
  it("renderPreview calls computePreviewMatches (the parity engine)", () => {
    expect(modalSrc).toMatch(/result = computePreviewMatches\(this\.plugin, \{/);
  });

  it("no direct raw.matchAll / new RegExp fast paths remain", () => {
    expect(modalSrc).not.toContain("raw.matchAll(");
    expect(modalSrc).not.toContain("new RegExp(pat");
  });

  it("diagnostics are rendered via describePreviewStatus/Notes", () => {
    expect(modalSrc).toContain("describePreviewStatus(result");
    expect(modalSrc).toContain("describePreviewNotes(");
  });

  it("sanitizePattern is guarded with try/catch in the save handler", () => {
    const occurrences = modalSrc.match(/sanitizePattern\(/g) || [];
    expect(occurrences.length).toBe(1);
    expect(modalSrc).toMatch(
      /catch \(err\) \{\s*\n\s*debugError\("REGEX_TESTER", "sanitizePattern failed"/,
    );
  });
});
