/**
 * Regex tester preview parity engine.
 *
 * computePreviewMatches() answers: "if I save this draft pattern, what will
 * Live Preview actually paint?" The draft is compiled through the SAME
 * compilePatternCore the editor uses, then replayed through the Live Preview
 * run gates (buildDecoChunked → processPatternChunk/processTextChunk →
 * applyDecorationsFromMatches) so the tester can never drift from the editor.
 *
 * Simulated: entry/group activity, color compile gates, blacklist-word
 * filtering, hide* filtering (word channel), regex safety, flags/case
 * forcing, fastTest pre-filter, chunking (2000-char text chunks when
 * ≤20 text-pass patterns), whole-word gate (incl. long-path sentence
 * exemption), context blacklist, blacklisted list items, spoilers/codeblock
 * skip ranges, codeblock & heading covers, span expansion (textBg channel),
 * caps (500/pattern, global), zero-width stopping, greedy selection +
 * isTextBg phase-2 filter + paint-time hide gates.
 *
 * NOT simulated (documented limitations): reading-mode differences other
 * than the whole-word note, cursor-dependent active-line gates (word
 * completion → note only), folder/advanced per-file rules, viewport
 * slicing, legacy list/bullet deco covers, other entries' word matches in
 * the final selection (only codeblock/heading covers compete).
 */
import { EDITOR_PERFORMANCE_CONSTANTS } from "../core/constants.js";
import {
  compilePatternCore,
  applyGroupColorOverride,
  applyGroupPresetChannels,
  deriveTargetElement,
} from "./patternCompiler.js";
import { getEntryForHeadingLevel } from "../utils/headingUtils.js";

const SPOILER_RE = /\|\|[\s\S]*?\|\|/g;
const CODEBLOCK_RE = /```[\s\S]*?```/g;
const HEADING_RE = /^(#{1,6})\s+(.*)$/gm;

function attempt(fn, fallback) {
  try {
    const v = fn();
    return v === undefined ? fallback : v;
  } catch (_) {
    return fallback;
  }
}

/**
 * Mirrors the blacklist filter inside plugin.getSortedWordEntries(): an
 * entry whose pattern equals a blacklist word (or a non-regex blacklist
 * entry's pattern) never reaches the Live Preview word pass.
 */
function isPatternBlacklisted(settings, pattern) {
  const p = String(pattern);
  const bw = Array.isArray(settings.blacklistWords)
    ? settings.blacklistWords
    : [];
  if (settings.caseSensitive) {
    if (bw.includes(p)) return true;
  } else {
    const lower = p.toLowerCase();
    if (bw.map((w) => String(w).toLowerCase()).includes(lower)) return true;
  }
  const blEntries = Array.isArray(settings.blacklistEntries)
    ? settings.blacklistEntries
    : [];
  for (const be of blEntries) {
    if (!be || be.isRegex) continue;
    const patterns =
      Array.isArray(be.groupedPatterns) && be.groupedPatterns.length > 0
        ? be.groupedPatterns
        : [be.pattern];
    for (const bp of patterns) {
      if (!bp) continue;
      if (settings.caseSensitive) {
        if (bp === p) return true;
      } else {
        if (String(bp).toLowerCase() === p.toLowerCase()) return true;
      }
    }
  }
  return false;
}

/**
 * Mirrors the hideHighlights/hideTextColors map inside
 * plugin.getSortedWordEntries() — it drops entries outright or rewrites
 * styleType on a copy. Word-channel drafts are filtered there before the
 * Live Preview word pass; textBg drafts are NOT (that pass reads
 * _compiledTextBgEntries directly), so callers must only use this for the
 * word channel.
 *
 * @returns {{styleType:string, backgroundColor:*, textColor:*}|null}
 *   null = entry dropped entirely.
 */
function applyHideFilters(compiled, settings) {
  let styleType = compiled.styleType;
  let backgroundColor = compiled.backgroundColor;
  let textColor = compiled.textColor;
  if (settings.hideHighlights) {
    if (styleType === "highlight") return null;
    if (styleType === "both" && !compiled.isTextBg) {
      styleType = "text";
      backgroundColor = null;
      textColor = textColor || compiled.color || null;
    }
    if (backgroundColor && !styleType && !compiled.isTextBg) {
      backgroundColor = null;
      styleType = "text";
      textColor = textColor || compiled.color || null;
    }
  }
  if (settings.hideTextColors) {
    if (styleType === "text") return null;
    if (styleType === "both") styleType = "highlight";
    if (!styleType && compiled.color && !backgroundColor) return null;
  }
  return { styleType, backgroundColor, textColor };
}

/**
 * Paint-time hide/customCss gate — mirrors the per-match `continue`s in
 * applyDecorationsFromMatches() (not entry-level drops; those happen in
 * getSortedWordEntries before matching).
 */
function matchPassesPaintGate(m, settings) {
  if (m.skip || m.start >= m.end) return false;
  const customCssOk = !!(
    settings.enableCustomCss &&
    m.entryRef &&
    m.entryRef.customCss
  );
  const hideText = settings.hideTextColors === true;
  const hideBg = settings.hideHighlights === true;
  if (m.isTextBg) {
    if (hideText && hideBg && !customCssOk) return false;
    return true;
  }
  const styleType =
    m.entryRef && m.entryRef.affectMarkElements
      ? "highlight"
      : m.styleType || "text";
  if (styleType === "text") return !(hideText && !customCssOk);
  if (styleType === "highlight") return !(hideBg && !customCssOk);
  if (styleType === "both") return !((hideText && hideBg) && !customCssOk);
  return !(hideText && !customCssOk);
}

/**
 * Selection pipeline mirroring applyDecorationsFromMatches() verbatim:
 * sort (start, longer first, non-regex first on ties) → greedy
 * non-overlap with longer-replacement → sort + slice(0,1000) → adjacent
 * same-color isTextBg merge → phase-2 isTextBg overlay filter → paint
 * gate (skip / zero-length).
 *
 * @param {Array<object>} candidates markers, covers and draft matches
 * @returns {{painted: Array<object>, selected: Array<object>}}
 */
export function selectPaintedMatches(candidates) {
  const all = candidates.slice().sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const lenDiff = b.end - b.start - (a.end - a.start);
    if (lenDiff !== 0) return lenDiff;
    const ar = a.entryRef && !!a.entryRef.isRegex;
    const br = b.entryRef && !!b.entryRef.isRegex;
    if (ar !== br) return ar ? 1 : -1;
    return 0;
  });
  const selected = [];
  for (const m of all) {
    let overlaps = false;
    const overlappingIndices = [];
    for (let i = 0; i < selected.length; i++) {
      const s = selected[i];
      if (m.start < s.end && m.end > s.start) {
        overlaps = true;
        overlappingIndices.push(i);
      }
    }
    if (!overlaps) {
      selected.push(Object.assign({}, m));
    } else {
      const mLength = m.end - m.start;
      const allShorter = overlappingIndices.every((i) => {
        const s = selected[i];
        return s.end - s.start < mLength;
      });
      if (allShorter) {
        for (let i = overlappingIndices.length - 1; i >= 0; i--) {
          selected.splice(overlappingIndices[i], 1);
        }
        selected.push(Object.assign({}, m));
      }
    }
  }
  const sortedSel = selected
    .sort((a, b) => a.start - b.start || a.end - b.end)
    .slice(0, 1000);
  const limited = (() => {
    const merged = [];
    for (const m of sortedSel) {
      const last = merged[merged.length - 1];
      if (
        last &&
        m.isTextBg &&
        last.isTextBg &&
        m.textColor === last.textColor &&
        m.backgroundColor === last.backgroundColor &&
        m.start <= last.end
      ) {
        if (m.end > last.end) last.end = m.end;
      } else {
        merged.push(m);
      }
    }
    return merged;
  })();

  if (limited.some((m) => m.isTextBg)) {
    const fullTextBg = limited.filter((m) => m.isTextBg);
    const filtered = [];
    limited.sort((a, b) => a.start - b.start || a.end - b.end);
    for (const m of limited) {
      if (!m.isTextBg) {
        let overlapsTextBg = false;
        for (const f of fullTextBg) {
          if (m.start < f.end && m.end > f.start) {
            const fStyle =
              f.styleType || (f.entryRef ? f.entryRef.styleType : null);
            if (fStyle !== "highlight") {
              overlapsTextBg = true;
              break;
            }
          }
        }
        if (overlapsTextBg) continue;
      }
      filtered.push(m);
    }
    limited.length = 0;
    for (const m of filtered) limited.push(m);
  }
  limited.sort((a, b) => a.start - b.start || a.end - b.end);
  const painted = limited.filter((m) => !m.skip && m.start < m.end);
  return { painted, selected: limited };
}

function buildDraftEntry(input) {
  return {
    isRegex: true,
    pattern: String(input.pattern || ""),
    flags: String(input.flags || ""),
    presetLabel: input.presetLabel || undefined,
    matchType:
      typeof input.matchType === "string" && input.matchType
        ? input.matchType
        : undefined,
    styleType: input.styleType || "text",
    markTarget: input.markTarget || "text",
    caseSensitive:
      typeof input.caseSensitive === "boolean" ? input.caseSensitive : undefined,
    color: input.color || "",
    textColor: input.textColor == null ? null : input.textColor,
    backgroundColor: input.backgroundColor || null,
    customCss: input.customCss || null,
    affectMarkElements: input.affectMarkElements || false,
  };
}

/**
 * Channel-specific compiled base — the entry-level fields both compile
 * callers place in their compiled objects (compileWordEntriesLogic /
 * compileTextBgColoringEntriesLogic). matchType uses the exact fallback
 * chain those callers use, because the literal branch of compilePatternCore
 * branches on it.
 */
function buildPreviewBase(e, channel, settings) {
  const matchType =
    e.matchType || settings.matchType || (settings.partialMatch ? "contains" : "exact");
  if (channel === "textBg") {
    return {
      textColor: e.textColor || "currentColor",
      backgroundColor: e.backgroundColor,
      styleType: e.styleType || "both",
      markTarget: e.markTarget || "text",
      matchType,
      isTextBg: true,
      presetLabel: e.presetLabel || undefined,
      entryRef: e,
    };
  }
  const color = e.color;
  return {
    color,
    textColor: e.textColor || e.color || color,
    backgroundColor: e.backgroundColor || null,
    styleType: e.styleType || "text",
    markTarget: e.markTarget || "text",
    matchType,
    presetLabel: e.presetLabel || undefined,
    entryRef: e,
    targetElement: deriveTargetElement(e),
  };
}

/**
 * Compute what Live Preview will actually paint for a draft regex entry.
 *
 * @param {object} plugin AlwaysColorText instance (or test double)
 * @param {object} input
 * @param {string} input.pattern raw pattern from the tester
 * @param {string} [input.flags] flag-button flags
 * @param {string} [input.sample] text being previewed
 * @param {boolean} [input.caseSensitive] effective entry case sensitivity
 * @param {string} [input.matchType] editing entry's matchType (if any)
 * @param {string} [input.presetLabel] name field
 * @param {string} [input.styleType] "text" | "highlight" | "both"
 * @param {string} [input.markTarget]
 * @param {string} [input.color] save-path color ("")
 * @param {string|null} [input.textColor] save-path textColor
 * @param {string|null} [input.backgroundColor] save-path backgroundColor
 * @param {boolean} [input.entryActive] editing entry active flag
 * @param {object|null} [input.group] selected group (with overrides)
 * @param {string|null} [input.filePath] active file path
 * @param {boolean} [input.editing] draft already compiled (editing, not adding)
 * @param {boolean} [input.ignoreGlobalEnabled] tester-only: preview the style
 *   even while the global toggle is off (the editor still paints nothing —
 *   surfaced as a `plugin-off` note instead of a hard `disabled` stop)
 * @returns {object} result with status, matches, notes, rejected counters
 */
export function computePreviewMatches(plugin, input) {
  const settings = plugin.settings || {};
  const notes = [];
  const rejected = {
    wholeWord: 0,
    spoiler: 0,
    codeblock: 0,
    heading: 0,
    blacklistedList: 0,
    context: 0,
    zeroWidth: 0,
    prefilter: 0,
    overlap: 0,
    wordCompletion: 0,
    paintHidden: 0,
  };
  const out = {
    status: "ok",
    reason: null,
    matches: [],
    count: 0,
    notes,
    rejected,
    effectiveFlags: "",
    literalMode: false,
    chunked: false,
    capped: false,
    channel: "word",
    regexSource: "",
    regexFlags: "",
  };
  const fail = (status, reason) => {
    out.status = status;
    out.reason = reason || null;
    return out;
  };

  const patRaw = String(input.pattern || "");
  if (!patRaw.trim()) return fail("empty");
  if (settings.enabled === false) {
    // The tester is a design surface: it keeps previewing the style while the
    // global toggle is off, and says so instead of going blank. Every other
    // caller still gets the editor's hard stop.
    if (input.ignoreGlobalEnabled !== true) return fail("disabled");
    notes.push({ id: "plugin-off" });
  }

  const group = input.group || null;
  if (group && group.active === false) return fail("inactive", "group");
  if (input.entryActive === false) return fail("inactive", "entry");

  // Draft entry + group overrides — mirrors compile's group mapping.
  const e = buildDraftEntry(input);
  if (group) {
    const groupCase =
      typeof group.caseSensitiveOverride === "boolean"
        ? group.caseSensitiveOverride
        : undefined;
    const groupMatch =
      typeof group.matchTypeOverride === "string" && group.matchTypeOverride
        ? group.matchTypeOverride
        : undefined;
    if (groupMatch) e.matchType = groupMatch;
    if (groupCase !== undefined) e._caseSensitiveOverride = groupCase;
    const _ov = applyGroupColorOverride(e, group, (c) =>
      plugin.isValidHexColor(c),
    );
    // Per-entry colortype + a group style preset: the preview must paint both
    // channels exactly like the compiler does.
    if (!_ov.type)
      applyGroupPresetChannels(e, group, settings, (c) =>
        plugin.isValidHexColor(c),
      );
  }

  // Channel + compile-time color gates (word 840-856 / textBg 1081-1101).
  let channel = "word";
  if (e.backgroundColor) {
    channel = "textBg";
    const textColor = e.textColor || "currentColor";
    const textOk =
      textColor === "currentColor" || plugin.isValidHexColor(textColor);
    const bgOk = plugin.isValidHexColor(e.backgroundColor);
    if (!textOk || !bgOk) return fail("no-color");
  } else {
    if (
      !plugin.isValidHexColor(e.color) &&
      !plugin.isValidHexColor(e.textColor)
    ) {
      return fail("no-color");
    }
  }
  out.channel = channel;

  // Sanitize + safety pre-checks — same order the editor performs them.
  let pat;
  try {
    pat = plugin.sanitizePattern(patRaw, true);
  } catch (_) {
    return fail("too-long");
  }
  if (!pat) return fail("empty");
  if (
    !settings.disableRegexSafety &&
    typeof plugin.validateAndSanitizeRegex === "function" &&
    !plugin.validateAndSanitizeRegex(pat)
  ) {
    return fail("blocked");
  }
  e.pattern = pat;

  // Compile through the shared core — flags, safety, regex/literal, fastTest.
  const base = buildPreviewBase(e, channel, settings);
  let res;
  try {
    res = compilePatternCore(plugin, e, pat, base);
  } catch (_) {
    return fail("too-long");
  }
  if (res.empty) return fail("empty");
  if (res.blocked) return fail("blocked");
  const compiled = res.compiled;
  out.effectiveFlags = compiled.flags;
  out.regexSource = compiled.regex ? compiled.regex.source : "";
  out.regexFlags = compiled.regex ? compiled.regex.flags : "";
  out.literalMode = !(settings.enableRegexSupport && compiled.isRegex);
  if (out.literalMode) notes.push({ id: "regex-off" });
  const cleanedInputFlags = String(input.flags || "").replace(/[^gimsuy]/g, "");
  if (compiled.flags !== cleanedInputFlags) {
    notes.push({ id: "flags", value: compiled.flags });
  }
  if (!compiled.regex || compiled.invalid) return fail("invalid");

  // Markdown-element entries route out of the text matcher entirely
  // (regexEntries filter + textBg targetElement skip).
  if (deriveTargetElement(e)) {
    notes.push({ id: "target-element" });
    out.count = 0;
    return out;
  }

  // Word-channel-only entry filtering (getSortedWordEntries blacklist +
  // hide* map). The textBg pass reads _compiledTextBgEntries directly, so
  // those gates do not apply to a textBg draft.
  let wordMatchStyle = null;
  if (channel === "word") {
    if (isPatternBlacklisted(settings, compiled.pattern)) {
      return fail("blacklisted");
    }
    const eff = applyHideFilters(compiled, settings);
    if (!eff) return fail("hidden");
    wordMatchStyle = eff;
  }

  const sample = String(input.sample || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
  const wordList = attempt(() => plugin.getSortedWordEntries(), null) || [];

  // Strategy routing (buildDecoChunked 20631-20714): text chunking only when
  // the sample exceeds TEXT_CHUNK_SIZE and there are ≤ PATTERN_CHUNK_SIZE
  // text-pass patterns (otherwise patterns are chunked and text is whole).
  const textPassCount =
    wordList.filter((x) => x && !deriveTargetElement(x)).length +
    (input.editing ? 0 : 1);
  const useChunks =
    channel === "word" &&
    sample.length > EDITOR_PERFORMANCE_CONSTANTS.TEXT_CHUNK_SIZE &&
    textPassCount <= EDITOR_PERFORMANCE_CONSTANTS.PATTERN_CHUNK_SIZE;
  out.chunked = useChunks;
  if (useChunks) notes.push({ id: "chunked" });

  // ---- Candidates: skip markers and competing covers (LP push order) ----
  const candidates = [];
  const candidateCeiling = EDITOR_PERFORMANCE_CONSTANTS.MAX_TOTAL_MATCHES;
  const blEntries = Array.isArray(settings.blacklistEntries)
    ? settings.blacklistEntries
    : [];
  const hasCodeblockBlacklist = !!blEntries.find(
    (x) => x && x.presetLabel === "Codeblocks" && !!x.isRegex,
  );
  if (hasCodeblockBlacklist) {
    for (const m of sample.matchAll(CODEBLOCK_RE)) {
      if (candidates.length >= candidateCeiling) break;
      candidates.push({
        start: m.index,
        end: m.index + m[0].length,
        skip: true,
        kind: "codeblock",
      });
    }
  }
  for (const m of sample.matchAll(SPOILER_RE)) {
    if (candidates.length >= candidateCeiling) break;
    candidates.push({
      start: m.index,
      end: m.index + m[0].length,
      skip: true,
      kind: "spoiler",
    });
  }
  const codeblockEntry = wordList.find(
    (x) => x && x.presetLabel === "Codeblocks",
  );
  if (codeblockEntry && !hasCodeblockBlacklist) {
    for (const m of sample.matchAll(CODEBLOCK_RE)) {
      if (candidates.length >= candidateCeiling) break;
      const s = m.index;
      const en = m.index + m[0].length;
      if (codeblockEntry.backgroundColor) {
        candidates.push({
          start: s,
          end: en,
          textColor: codeblockEntry.textColor || "currentColor",
          backgroundColor: codeblockEntry.backgroundColor,
          isTextBg: true,
          entryRef: codeblockEntry,
          kind: "codeblock",
        });
      } else {
        const c = codeblockEntry.color || codeblockEntry.textColor;
        if (c) {
          candidates.push({
            start: s,
            end: en,
            color: c,
            entryRef: codeblockEntry,
            kind: "codeblock",
          });
        }
      }
    }
  }
  for (const m of sample.matchAll(HEADING_RE)) {
    if (candidates.length >= candidateCeiling) break;
    const entryToUse = getEntryForHeadingLevel(wordList, m[1].length);
    if (entryToUse && !entryToUse.targetElement) {
      const s = m.index;
      const en = m.index + m[0].length;
      if (entryToUse.backgroundColor) {
        candidates.push({
          start: s,
          end: en,
          textColor: entryToUse.textColor || "currentColor",
          backgroundColor: entryToUse.backgroundColor,
          isTextBg: true,
          entryRef: entryToUse,
          kind: "heading",
        });
      } else {
        const c = entryToUse.color || entryToUse.textColor;
        if (c) {
          candidates.push({
            start: s,
            end: en,
            color: c,
            entryRef: entryToUse,
            kind: "heading",
          });
        }
      }
    }
  }

  // ---- Shared run-gate state ----
  const PER_PATTERN_CAP = EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN;
  const maxTotal = plugin._isTyping
    ? 500
    : settings.extremeLightweightMode
      ? EDITOR_PERFORMANCE_CONSTANTS.LIGHTWEIGHT_MAX_TOTAL_MATCHES
      : EDITOR_PERFORMANCE_CONSTANTS.MAX_TOTAL_MATCHES;
  const mtEff = String(
    compiled.matchType ||
      settings.matchType ||
      (settings.partialMatch ? "contains" : "exact"),
  ).toLowerCase();
  const isSentencePattern = attempt(
    () => plugin.isSentenceLikePattern(compiled.pattern),
    false,
  );
  const listRanges =
    attempt(
      () => plugin.getBlacklistedListItemRanges(sample, 0, input.filePath),
      [],
    ) || [];
  const wordSet = attempt(
    () => plugin.buildBlacklistWordSet(input.filePath),
    null,
  );
  if (settings.enableWordCompletionColoring && channel === "word") {
    // Cursor-dependent active-line gate cannot be simulated — the editor
    // applies it only on the line being edited.
    notes.push({ id: "word-completion" });
  }
  if (settings.disableLivePreviewColoring) notes.push({ id: "lp-off" });

  const contextBlacklisted = (segText, idx, len) => {
    if (wordSet && wordSet.size > 0) {
      const fullWord =
        attempt(() => plugin.extractFullWord(segText, idx, idx + len), "") ||
        "";
      if (wordSet.has(String(fullWord).toLowerCase())) return true;
      return false;
    }
    return attempt(
      () => plugin.isContextBlacklisted(segText, idx, idx + len, input.filePath),
      false,
    );
  };

  if (channel === "word") {
    // ---- Word pass: segmented like LP (processPatternChunk/processTextChunk)
    const segments = [];
    if (useChunks) {
      const size = EDITOR_PERFORMANCE_CONSTANTS.TEXT_CHUNK_SIZE;
      for (let i = 0; i < sample.length; i += size) {
        segments.push({ text: sample.slice(i, i + size), from: i });
      }
    } else {
      segments.push({ text: sample, from: 0 });
    }
    const regex = compiled.regex;
    for (const seg of segments) {
      if (compiled.fastTest) {
        const ok = attempt(() => compiled.fastTest(seg.text), true);
        if (!ok) {
          rejected.prefilter++;
          continue;
        }
      }
      try {
        regex.lastIndex = 0;
      } catch (_) {}
      let matchCount = 0;
      let match;
      try {
        while ((match = regex.exec(seg.text))) {
          const matched = match[0];
          if (matched.length === 0) {
            // LP fills its 500-cap with un-painted duplicates at this
            // position, then stops scanning this segment.
            rejected.zeroWidth++;
            break;
          }
          if (matchCount >= PER_PATTERN_CAP) {
            out.capped = true;
            break;
          }
          if (candidates.length > maxTotal) {
            out.capped = true;
            break;
          }
          const idx = match.index;
          const s = seg.from + idx;
          const en = s + matched.length;

          // Blacklisted list item ranges (processPatternChunk 20968-20977).
          if (
            listRanges.length > 0 &&
            attempt(
              () => plugin.isMatchInBlacklistedRange(s, en, listRanges),
              false,
            )
          ) {
            rejected.blacklistedList++;
            continue;
          }

          // textBg cover priority (20979-20998): a shorter/equal word match
          // overlapping a textBg cover is rejected; a longer one replaces
          // the covers.
          const ovl = [];
          for (let i = 0; i < candidates.length; i++) {
            const existing = candidates[i];
            if (!existing || !existing.isTextBg) continue;
            if (s < existing.end && en > existing.start) ovl.push(i);
          }
          if (ovl.length > 0) {
            const mLength = en - s;
            const allShorter = ovl.every(
              (i) => candidates[i].end - candidates[i].start < mLength,
            );
            if (!allShorter) {
              const blocker = candidates[ovl[0]];
              if (blocker.kind === "codeblock") rejected.codeblock++;
              else if (blocker.kind === "heading") rejected.heading++;
              else rejected.overlap++;
              continue;
            }
            for (let i = ovl.length - 1; i >= 0; i--) {
              candidates.splice(ovl[i], 1);
            }
          }

          // Whole-word gate (21016-21046 short / 21534-21550 long). The long
          // path exempts sentence-like patterns; the short path does not.
          const sentenceExempt = useChunks && isSentencePattern;
          if (
            mtEff === "exact" &&
            !sentenceExempt &&
            !attempt(
              () => plugin.isWholeWordMatch(seg.text, idx, idx + matched.length),
              true,
            )
          ) {
            rejected.wholeWord++;
            continue;
          }

          // Context blacklist (21050-21055 / 21554-21559).
          if (contextBlacklisted(seg.text, idx, matched.length)) {
            rejected.context++;
            continue;
          }

          candidates.push({
            start: s,
            end: en,
            color:
              wordMatchStyle.textColor &&
              wordMatchStyle.textColor !== "currentColor"
                ? wordMatchStyle.textColor
                : compiled.color,
            styleType: wordMatchStyle.styleType,
            textColor: wordMatchStyle.textColor,
            backgroundColor: wordMatchStyle.backgroundColor,
            entryRef: compiled,
            customCss: compiled.customCss,
            isDraft: true,
          });
          matchCount++;
        }
      } catch (_) {
        break; // exec failure — stop this segment (LP would abort the render)
      }
    }
  } else {
    // ---- textBg pass (20474-20605): whole text, no chunking, no
    // whole-word gate, span expansion, global cap only.
    const regex = compiled.regex;
    let prefilterBlocked = false;
    if (compiled.fastTest) {
      const ok = attempt(() => compiled.fastTest(sample), true);
      if (!ok) {
        rejected.prefilter++;
        prefilterBlocked = true;
      }
    }
    if (!prefilterBlocked) {
      try {
        regex.lastIndex = 0;
      } catch (_) {}
      let match;
      try {
        while ((match = regex.exec(sample))) {
          const matched = match[0];
          if (matched.length === 0) {
            rejected.zeroWidth++;
            break;
          }
          const idx = match.index;
          const en = idx + matched.length;

          // Word completion (20508-20512): unconditional trailing-whitespace
          // requirement when enabled (not cursor-dependent on this path).
          if (settings.enableWordCompletionColoring) {
            const nextChar = sample[en];
            if (!nextChar || !/[\s]/.test(nextChar)) {
              rejected.wordCompletion++;
              continue;
            }
          }

          if (
            !attempt(
              () => plugin.matchSatisfiesType(sample, idx, en, compiled),
              true,
            )
          ) {
            continue;
          }
          if (contextBlacklisted(sample, idx, matched.length)) {
            rejected.context++;
            continue;
          }
          if (
            listRanges.length > 0 &&
            attempt(
              () => plugin.isMatchInBlacklistedRange(idx, en, listRanges),
              false,
            )
          ) {
            rejected.blacklistedList++;
            continue;
          }

          // Span expansion (20564-20589): entry matchType ONLY — no
          // settings fallback here (unlike the whole-word gate).
          let colorStart = idx;
          let colorEnd = en;
          const entryMt = String(e.matchType || "").toLowerCase();
          if (
            (entryMt === "contains" ||
              entryMt === "startswith" ||
              entryMt === "endswith") &&
            !isSentencePattern
          ) {
            while (
              colorStart > 0 &&
              attempt(() => plugin.isWordCharacter(sample[colorStart - 1]), false)
            ) {
              colorStart--;
            }
            while (
              colorEnd < sample.length &&
              attempt(() => plugin.isWordCharacter(sample[colorEnd]), false)
            ) {
              colorEnd++;
            }
          }

          candidates.push({
            start: colorStart,
            end: colorEnd,
            textColor: compiled.textColor,
            backgroundColor: compiled.backgroundColor,
            isTextBg: true,
            entryRef: compiled,
            customCss: compiled.customCss,
            isDraft: true,
          });
          if (candidates.length > maxTotal) {
            out.capped = true;
            break;
          }
        }
      } catch (_) {
        // exec failure — nothing further to scan
      }
    }
  }

  // ---- Selection + paint (applyDecorationsFromMatches) ----
  // Selection works on copies — stamp stable ids so survivors can be traced
  // back to their source candidates for diagnostics.
  let nextId = 0;
  for (const c of candidates) c._id = nextId++;
  const { painted, selected } = selectPaintedMatches(candidates);
  const paintedIds = new Set(painted.map((m) => m._id));
  for (const c of candidates) {
    if (!c.isDraft) continue;
    if (paintedIds.has(c._id)) continue;
    // Dropped by selection: find what beat it, for diagnostics. `selected`
    // still contains skip markers (painted filters them out).
    const blocker = selected.find((p) => c.start < p.end && c.end > p.start);
    if (blocker && blocker.skip && blocker.kind === "spoiler") {
      rejected.spoiler++;
    } else if (blocker && (blocker.kind === "codeblock" || blocker.skip)) {
      rejected.codeblock++;
    } else if (blocker && blocker.kind === "heading") {
      rejected.heading++;
    } else {
      rejected.overlap++;
    }
  }

  const prePaint = painted.filter((m) => m.isDraft);
  const finalMatches = [];
  for (const m of prePaint) {
    if (matchPassesPaintGate(m, settings)) finalMatches.push(m);
  }
  rejected.paintHidden = prePaint.length - finalMatches.length;

  // ---- Notes from rejection counters ----
  // NOTE: prefilter rejections are counted but deliberately NOT surfaced as a
  // note — the tester sample is rarely the exact text the editor pre-filters,
  // so the message was more noise than signal.
  if (rejected.zeroWidth > 0) {
    notes.push({ id: "zero-width", n: rejected.zeroWidth });
  }
  if (rejected.spoiler > 0) notes.push({ id: "spoiler", n: rejected.spoiler });
  if (rejected.codeblock > 0) {
    notes.push({ id: "codeblock", n: rejected.codeblock });
  }
  if (rejected.heading > 0) {
    notes.push({ id: "heading", n: rejected.heading });
  }
  if (rejected.blacklistedList > 0) {
    notes.push({ id: "blacklist-list", n: rejected.blacklistedList });
  }
  if (rejected.context > 0) {
    notes.push({ id: "context", n: rejected.context });
  }
  if (rejected.wholeWord > 0) {
    notes.push({ id: "whole-word", n: rejected.wholeWord });
  }
  if (rejected.overlap > 0) {
    notes.push({ id: "overlap", n: rejected.overlap });
  }
  if (rejected.wordCompletion > 0) {
    notes.push({ id: "word-completion-gate", n: rejected.wordCompletion });
  }
  if (rejected.paintHidden > 0) {
    notes.push({ id: "paint-hidden", n: rejected.paintHidden });
  }
  if (out.capped) notes.push({ id: "capped" });

  out.matches = finalMatches.map((m) => ({ start: m.start, end: m.end }));
  out.count = out.matches.length;
  return out;
}

const STATUS_MESSAGES = {
  disabled: [
    "preview_status_disabled",
    "Always Color Text is disabled — nothing is colored",
  ],
  "inactive-group": [
    "preview_status_group_inactive",
    "The selected group is inactive — the editor skips its entries",
  ],
  "inactive-entry": [
    "preview_status_entry_inactive",
    "This entry is disabled — the editor skips it",
  ],
  "no-color": [
    "preview_status_no_color",
    "No usable color — the editor skips entries without a valid color",
  ],
  "too-long": [
    "preview_status_too_long",
    "Pattern too long — the editor limits patterns to 200 characters",
  ],
  blocked: [
    "preview_status_blocked",
    "Pattern blocked for memory safety — the editor won't match it",
  ],
  invalid: [
    "preview_status_invalid",
    "Pattern can't compile — the editor won't match it",
  ],
  blacklisted: [
    "preview_status_blacklisted",
    "Pattern is blacklisted — the editor filters it out",
  ],
  hidden: [
    "preview_status_hidden",
    "Hidden by a color-hiding setting — the editor filters it out",
  ],
  empty: ["", ""],
};

/** Human text for a non-ok result status ("" when nothing to say). */
export function describePreviewStatus(result, t) {
  const key =
    result.status === "inactive"
      ? `inactive-${result.reason === "group" ? "group" : "entry"}`
      : result.status;
  const msg = STATUS_MESSAGES[key];
  if (!msg) return "";
  return t(msg[0], msg[1]);
}

const NOTE_MESSAGES = {
  flags: ["preview_note_flags", "editor flags: {flags}"],
  "regex-off": [
    "preview_note_regex_off",
    "regex support is off — the editor matches this as literal text",
  ],
  "zero-width": [
    "preview_note_zero_width",
    "zero-width matches ({n}) aren't painted and stop the editor's scan",
  ],
  spoiler: ["preview_note_spoiler", "{n} matches hidden in spoilers"],
  codeblock: ["preview_note_codeblock", "{n} matches hidden in code blocks"],
  heading: ["preview_note_heading", "{n} matches covered by heading coloring"],
  "blacklist-list": [
    "preview_note_blacklist_list",
    "{n} matches in blacklisted list items",
  ],
  context: ["preview_note_context", "{n} matches blacklisted by word rules"],
  "whole-word": [
    "preview_note_whole_word",
    "Live Preview needs whole words here ({n}) — reading mode would color them",
  ],
  overlap: ["preview_note_overlap", "{n} matches covered by other highlights"],
  "word-completion": [
    "preview_note_word_completion",
    "word-completion coloring: on the line you edit, matches must end at a word boundary",
  ],
  "word-completion-gate": [
    "preview_note_word_completion_gate",
    "word-completion coloring removed {n} matches (must end at whitespace)",
  ],
  "paint-hidden": [
    "preview_note_paint_hidden",
    "{n} matches hidden by color-hiding settings",
  ],
  capped: ["preview_note_capped", "the editor stops at 500 matches per pattern"],
  chunked: [
    "preview_note_chunked",
    "long sample: the editor matches in 2000-character chunks",
  ],
  "target-element": [
    "preview_note_target_element",
    "styled via markdown-element rules, not the text matcher — preview may differ",
  ],
  "lp-off": [
    "preview_note_lp_off",
    "Live Preview coloring is off — matches apply in reading mode",
  ],
  "plugin-off": [
    "preview_note_plugin_off",
    "Always Color Text is off — the editor paints nothing, the tester previews anyway",
  ],
};

function fmt(text, vars) {
  let out = text;
  for (const k of Object.keys(vars || {})) {
    out = out.split(`{${k}}`).join(String(vars[k]));
  }
  return out;
}

/** Human text for the status line: all notes joined, "" when none. */
export function describePreviewNotes(result, t) {
  const parts = [];
  for (const note of result.notes || []) {
    const msg = NOTE_MESSAGES[note.id];
    if (!msg) continue;
    const vars = {};
    if (note.n !== undefined) vars.n = note.n;
    if (note.value !== undefined) vars.flags = note.value;
    parts.push(fmt(t(msg[0], msg[1]), vars));
  }
  return parts.join(" · ");
}
