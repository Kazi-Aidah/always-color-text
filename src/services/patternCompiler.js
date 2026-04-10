import { REGEX_CONSTANTS, EDITOR_PERFORMANCE_CONSTANTS } from '../core/constants.js';
import { debugLog, debugError, debugWarn } from '../utils/debug.js';
import { RegexCache } from '../utils/RegexCache.js';

export class PatternMatcher {
  constructor(settings, helpers) {
    this.settings = settings || {};
    this.helpers = helpers || {};
    this.counters = { regexExecs: 0, matchesFound: 0 };
  }
  compilePattern(entry, cache) {
    if (!entry || !entry.pattern) return entry;
    const isRegex = !!entry.isRegex;
    const rawFlags = String(entry.flags || "").replace(/[^gimsuy]/g, "");
    let flags = rawFlags || "";
    if (!flags.includes("g")) flags += "g";
    const effectiveCS =
      typeof entry._caseSensitiveOverride === "boolean"
        ? entry._caseSensitiveOverride
        : typeof entry.caseSensitive === "boolean"
          ? entry.caseSensitive
          : this.settings.caseSensitive;
    if (!effectiveCS && !flags.includes("i")) flags += "i";
    try {
      if (isRegex && this.settings.enableRegexSupport) {
        entry.regex = cache
          ? cache.getOrCreate(entry.pattern, flags)
          : this._createRegexSafe(entry.pattern, flags);
        const tf = flags.replace(/g/g, "");
        entry.testRegex = cache
          ? cache.getOrCreate(entry.pattern, tf)
          : tf === ""
            ? this._createRegexSafe(entry.pattern, "")
            : this._createRegexSafe(entry.pattern, tf);
      } else {
        const esc = this.helpers.escapeRegex
          ? this.helpers.escapeRegex(entry.pattern)
          : entry.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const lf = effectiveCS ? "g" : "gi";
        entry.regex = cache
          ? cache.getOrCreate(esc, lf)
          : this._createRegexSafe(esc, lf);
        entry.testRegex = effectiveCS
          ? cache
            ? cache.getOrCreate(esc, "")
            : this._createRegexSafe(esc, "")
          : cache
            ? cache.getOrCreate(esc, "i")
            : this._createRegexSafe(esc, "i");
      }
    } catch (_) {
      entry.invalid = true;
    }
    return entry;
  }

  _createRegexSafe(pattern, flags) {
    try {
      return new RegExp(pattern, flags);
    } catch (_) {
      return null;
    }
  }

  isWordCharacter(char) {
    return /[A-Za-z0-9]/.test(char) || char === "-" || char === "'";
  }

  extractFullWordAtPosition(text, start, end) {
    let wordStart = start;
    let wordEnd = end;

    const slice = text.substring(start, end);
    const hasNonRoman =
      this.containsNonRomanCharacters && this.containsNonRomanCharacters(slice);
    if (hasNonRoman) {
      while (wordStart > 0 && this.isCJKChar(text[wordStart - 1])) {
        wordStart--;
      }
      while (wordEnd < text.length && this.isCJKChar(text[wordEnd])) {
        wordEnd++;
      }
    } else {
      while (wordStart > 0 && this.isWordCharacter(text[wordStart - 1])) {
        wordStart--;
      }
      while (wordEnd < text.length && this.isWordCharacter(text[wordEnd])) {
        wordEnd++;
      }
    }

    return text.substring(wordStart, wordEnd);
  }

  matchSatisfiesType(text, start, end, entry) {
    // CRITICAL: For regex patterns, the regex itself defines the matching logic
    // (including boundaries via \b). We should always return true here to avoid
    // incorrectly comparing the regex pattern string with the matched text.
    if (entry && entry.isRegex) {
      return true;
    }

    const matchType = String(
      entry?.matchType || (this.settings.partialMatch ? "contains" : "exact"),
    ).toLowerCase();
    const pattern = entry?.pattern || "";
    const isSentence = this.helpers.isSentenceLikePattern
      ? this.helpers.isSentenceLikePattern(pattern)
      : /[\s,\.;:!\?"'\(\)\[\]\{\}<>]/.test(pattern || "");
    const cs =
      typeof entry?._caseSensitiveOverride === "boolean"
        ? entry._caseSensitiveOverride
        : typeof entry?.caseSensitive === "boolean"
          ? entry.caseSensitive
          : this.settings.caseSensitive;

    // For sentence-like patterns, always match
    if (isSentence) {
      return true;
    }

    // Extract the full word at the match position
    const fullWord =
      pattern && pattern.length <= 2
        ? text.substring(start, end)
        : this.extractFullWordAtPosition(text, start, end);

    switch (matchType) {
      case "exact":
        // Exact match: pattern must exactly equal the full word
        const exactMatch = cs
          ? fullWord === pattern
          : fullWord.toLowerCase() === pattern.toLowerCase();
        return exactMatch;

      case "contains":
        // Contains: pattern must be found anywhere within the full word
        const containsMatch = cs
          ? fullWord.includes(pattern)
          : fullWord.toLowerCase().includes(pattern.toLowerCase());
        return containsMatch;

      case "startswith":
        try {
          const isNonRoman =
            this.containsNonRomanCharacters &&
            this.containsNonRomanCharacters(pattern);
          if (isNonRoman) {
            const startsWithMatch = cs
              ? fullWord.startsWith(pattern)
              : fullWord.toLowerCase().startsWith(pattern.toLowerCase());
            return startsWithMatch;
          }
          const flags = cs ? "" : "i";
          const esc = this.helpers.escapeRegex
            ? this.helpers.escapeRegex(pattern)
            : pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const re = new RegExp(`^${esc}[A-Za-z]*$`, flags);
          return re.test(fullWord);
        } catch (_) {
          const startsWithMatch = cs
            ? fullWord.startsWith(pattern)
            : fullWord.toLowerCase().startsWith(pattern.toLowerCase());
          return startsWithMatch;
        }

      case "endswith":
        try {
          const isNonRoman =
            this.containsNonRomanCharacters &&
            this.containsNonRomanCharacters(pattern);
          if (isNonRoman) {
            const endsWithMatch = cs
              ? fullWord.endsWith(pattern)
              : fullWord.toLowerCase().endsWith(pattern.toLowerCase());
            return endsWithMatch;
          }
          const flags = cs ? "" : "i";
          const esc = this.helpers.escapeRegex
            ? this.helpers.escapeRegex(pattern)
            : pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const re = new RegExp(`${esc}(?:[^A-Za-z0-9_]|$)`, flags);
          return re.test(fullWord);
        } catch (_) {
          const endsWithMatch = cs
            ? fullWord.endsWith(pattern)
            : fullWord.toLowerCase().endsWith(pattern.toLowerCase());
          return endsWithMatch;
        }

      default:
        return true;
    }
  }

  match(text, entries, folderEntry) {
    const out = [];
    const isSentence = (p) =>
      this.helpers.isSentenceLikePattern
        ? this.helpers.isSentenceLikePattern(p)
        : /[\s,\.;:!\?"'\(\)\[\]\{\}<>]/.test(p || "");
    const wholeWord = (t, s, e) => {
      const lc = s > 0 ? t[s - 1] : "";
      const rc = e < t.length ? t[e] : "";
      const isW = (ch) => /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
      return (s === 0 || !isW(lc)) && (e === t.length || !isW(rc));
    };
    for (const entry of entries) {
      if (!entry || entry.invalid) continue;
      try {
        if (entry.fastTest && typeof entry.fastTest === "function") {
          if (!entry.fastTest(text)) continue;
        }
      } catch (_) {}
      const regex = entry.regex;
      if (!regex) continue;
      const matches = this.helpers.safeMatchLoop
        ? this.helpers.safeMatchLoop(regex, text)
        : (text.match(regex) || []).map((m) => ({
            0: m,
            index: text.indexOf(m),
          }));
      let iters = 0;
      for (const m of matches) {
        const matchedText = m[0];
        const ms = m.index;
        const me = m.index + matchedText.length;
        if (!this.matchSatisfiesType(text, ms, me, entry)) {
          iters++;
          continue;
        }
        let fws = ms;
        let fwe = me;
        if (!isSentence(entry.pattern)) {
          while (
            fws > 0 &&
            (/[A-Za-z0-9]/.test(text[fws - 1]) ||
              text[fws - 1] === "-" ||
              text[fws - 1] === "'")
          )
            fws--;
          while (
            fwe < text.length &&
            (/[A-Za-z0-9]/.test(text[fwe]) ||
              text[fwe] === "-" ||
              text[fwe] === "'")
          )
            fwe++;
        }
        const mtLower = String(
          (entry && entry.matchType) ||
            (this.settings.partialMatch ? "contains" : "exact"),
        ).toLowerCase();
        const useExpanded =
          !isSentence(entry.pattern) &&
          (mtLower === "contains" ||
            mtLower === "startswith" ||
            mtLower === "endswith");
        const useStart = useExpanded ? fws : ms;
        const useEnd = useExpanded ? fwe : me;
        const useColor =
          folderEntry && folderEntry.defaultColor
            ? folderEntry.defaultColor
            : entry.textColor && entry.textColor !== "currentColor"
              ? entry.textColor
              : entry.color;
        const priority = me - ms + (entry.isTextBg ? -10 : 0);

        // DEBUG: Log match creation with entry details
        if (entry.pattern === "hello") {
          debugLog(
            "[MATCH_CREATE]",
            `Pattern: hello, has bgOpacity=${typeof entry.backgroundOpacity}, value=${entry.backgroundOpacity}, textColor=${entry.textColor}, bgColor=${entry.backgroundColor}`,
          );
        }

        out.push({
          start: useStart,
          end: useEnd,
          color: useColor,
          word: matchedText,
          styleType: entry.styleType,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor,
          isTextBg: entry.isTextBg === true,
          priority,
          entryRef: entry,
          // Copy custom styling properties directly to match object for rendering
          backgroundOpacity: entry.backgroundOpacity,
          highlightBorderRadius: entry.highlightBorderRadius,
          highlightHorizontalPadding: entry.highlightHorizontalPadding,
          highlightVerticalPadding: entry.highlightVerticalPadding,
          enableBorderThickness: entry.enableBorderThickness,
          borderStyle: entry.borderStyle,
          borderLineStyle: entry.borderLineStyle,
          borderOpacity: entry.borderOpacity,
          borderThickness: entry.borderThickness,
        });
        iters++;
      }
      if (iters > 0) {
        this.counters.regexExecs += iters;
        this.counters.matchesFound += out.length;
      }
    }
    if (out.length > 1) {
      out.sort((a, b) => {
        // Prioritize by length first (longer matches win)
        const la = a.end - a.start;
        const lb = b.end - b.start;
        if (la !== lb) return lb - la;
        const ar = a.entryRef && !!a.entryRef.isRegex;
        const br = b.entryRef && !!b.entryRef.isRegex;
        if (ar !== br) return ar ? 1 : -1;
        // Then by start position (earlier wins)
        if (a.start !== b.start) return a.start - b.start;
        // Then by priority
        return (b.priority || 0) - (a.priority || 0);
      });
      const no = [];
      for (const m of out) {
        let ov = false;
        for (const s of no) {
          if (m.start < s.end && m.end > s.start) {
            ov = true;
            break;
          }
        }
        if (!ov) no.push(m);
      }
      return no;
    }
    return out;
  }
}

export class SettingsIndex {
  constructor(settings) {
    this.settings = settings || {};
    this.firstChar = new Map();
    this.lengthRanges = new Map();
    this.regexPrefixes = new Map();
  }
  rebuild(entries) {
    this.firstChar.clear();
    this.lengthRanges.clear();
    this.regexPrefixes.clear();
    for (const e of entries || []) {
      if (!e || e.invalid || !e.pattern) continue;
      const p = String(e.pattern);
      if (!e.isRegex) {
        const d = p[0] || "";
        const bucket = this.firstChar.get(d) || [];
        bucket.push(e);
        this.firstChar.set(d, bucket);
        const len = p.length;
        const rangeKey =
          len < 5 ? "lt5" : len < 10 ? "lt10" : len < 20 ? "lt20" : "ge20";
        const lr = this.lengthRanges.get(rangeKey) || [];
        lr.push(e);
        this.lengthRanges.set(rangeKey, lr);
      } else {
        const m = p.match(/[A-Za-z0-9]{3,}/);
        if (m) {
          const pref = m[0][0];
          const list = this.regexPrefixes.get(pref) || [];
          list.push(e);
          this.regexPrefixes.set(pref, list);
        }
      }
    }
  }
  query(text) {
    if (!text) return [];
    const t = String(text);
    const set = new Set();
    const d = t[0] || "";
    const cands = this.firstChar.get(d) || [];
    for (const e of cands) set.add(e);
    const len = t.length;
    const rk = len < 5 ? "lt5" : len < 10 ? "lt10" : len < 20 ? "lt20" : "ge20";
    const lr = this.lengthRanges.get(rk) || [];
    for (const e of lr) set.add(e);
    if (t.length >= 1) {
      const rp = this.regexPrefixes.get(t[0]) || [];
      for (const e of rp) set.add(e);
    }
    return Array.from(set);
  }
}

/**
 * Logic function for compileWordEntries — thin wrapper that delegates to plugin method body.
 * Accepts the plugin instance and runs the full compilation logic.
 *
 * @param {object} plugin - The AlwaysColorText plugin instance
 */
export function compileWordEntriesLogic(plugin) {
  try {
    try {
      plugin._compiledWordEntries = [];
      plugin._cachedSortedEntries = null;
      plugin._cacheDirty = true;
    } catch (e) {}
    try {
      plugin._regexCache && plugin._regexCache.clear();
    } catch (_) {}
    try {
      plugin._bloomFilter && plugin._bloomFilter.reset();
    } catch (_) {}
    if (!Array.isArray(plugin.settings.wordEntries)) return;

    // Combine main entries with entries from active groups
    let allEntries = [...(plugin.settings.wordEntries || [])];
    if (Array.isArray(plugin.settings.wordEntryGroups)) {
      plugin.settings.wordEntryGroups.forEach((group) => {
        if (group && group.active && Array.isArray(group.entries)) {
          const groupCase =
            typeof group.caseSensitiveOverride === "boolean"
              ? group.caseSensitiveOverride
              : undefined;
          const groupMatch =
            typeof group.matchTypeOverride === "string" &&
            group.matchTypeOverride
              ? group.matchTypeOverride
              : undefined;
          const mapped = group.entries.map((e) => {
            const copy = Object.assign({}, e);
            if (groupMatch) copy.matchType = groupMatch;
            if (groupCase !== undefined)
              copy._caseSensitiveOverride = groupCase;
            if (group.styleType) copy.styleType = group.styleType;
            if (group.textColor) copy.textColor = group.textColor;
            if (group.color) copy.color = group.color;
            if (group.backgroundColor)
              copy.backgroundColor = group.backgroundColor;
            if (typeof group.backgroundOpacity !== "undefined")
              copy.backgroundOpacity = group.backgroundOpacity;
            if (typeof group.highlightBorderRadius !== "undefined")
              copy.highlightBorderRadius = group.highlightBorderRadius;
            if (typeof group.highlightHorizontalPadding !== "undefined")
              copy.highlightHorizontalPadding = group.highlightHorizontalPadding;
            if (typeof group.highlightVerticalPadding !== "undefined")
              copy.highlightVerticalPadding = group.highlightVerticalPadding;
            if (typeof group.enableBorderThickness !== "undefined")
              copy.enableBorderThickness = group.enableBorderThickness;
            if (group.borderStyle) copy.borderStyle = group.borderStyle;
            if (group.borderLineStyle)
              copy.borderLineStyle = group.borderLineStyle;
            if (typeof group.borderOpacity !== "undefined")
              copy.borderOpacity = group.borderOpacity;
            if (typeof group.borderThickness !== "undefined")
              copy.borderThickness = group.borderThickness;
            copy._groupUid = group.uid || null;
            copy._groupRef = group;
            copy.groupEnableFolders = Array.isArray(group.enableFolders)
              ? group.enableFolders.slice()
              : [];
            copy.groupDisableFolders = Array.isArray(group.disableFolders)
              ? group.disableFolders.slice()
              : [];
            copy.groupEnableTags = Array.isArray(group.enableTags)
              ? group.enableTags.slice()
              : [];
            copy.groupDisableTags = Array.isArray(group.disableTags)
              ? group.disableTags.slice()
              : [];
            return copy;
          });
          allEntries = allEntries.concat(mapped);
        }
      });
    }

    for (const e of allEntries) {
      if (!e) continue;
      if (e && e.backgroundColor) continue;

      const patterns =
        Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
          ? e.groupedPatterns
          : [String(e.pattern || "").trim()];

      const color = e.color;
      if (
        !plugin.isValidHexColor(color) &&
        !plugin.isValidHexColor(e.textColor)
      ) {
        continue;
      }
      const isRegex = !!e.isRegex;

      for (let pattern of patterns) {
        pattern = String(pattern).trim();
        if (!pattern) continue;
        pattern = plugin.sanitizePattern(pattern, isRegex);

        if (
          !plugin.settings.disableRegexSafety &&
          plugin.isKnownProblematicPattern(pattern)
        ) {
          debugWarn(
            "COMPILE",
            `Blocked dangerous pattern: ${pattern.substring(0, 50)}`,
          );
          const compiled = {
            pattern,
            color,
            isRegex,
            flags: "",
            regex: null,
            testRegex: null,
            invalid: true,
            specificity: 0,
          };
          plugin._compiledWordEntries.push(compiled);
          try {
            const { Notice } = require("obsidian");
            new Notice(
              plugin.t(
                "notice_pattern_blocked",
                "Pattern blocked for Memory Safety: " +
                  pattern.substring(0, 30) +
                  "...",
              ),
            );
          } catch (e) {}
          continue;
        }

        const rawFlags = String(e.flags || "").replace(/[^gimsuy]/g, "");
        let flags = rawFlags || "";
        if (!flags.includes("g")) flags += "g";
        const effectiveCaseSensitive =
          typeof e._caseSensitiveOverride === "boolean"
            ? e._caseSensitiveOverride
            : typeof e.caseSensitive === "boolean"
              ? e.caseSensitive
              : plugin.settings.caseSensitive;
        if (!effectiveCaseSensitive && !flags.includes("i")) flags += "i";

        const compiled = {
          pattern,
          color,
          textColor: e.textColor || e.color || color,
          backgroundColor: e.backgroundColor || null,
          styleType: e.styleType || "text",
          matchType:
            e.matchType ||
            (plugin.settings.partialMatch ? "contains" : "exact"),
          isRegex,
          flags,
          regex: null,
          testRegex: null,
          invalid: false,
          specificity: pattern.replace(/\*/g, "").length,
          presetLabel: e.presetLabel || undefined,
          entryRef: e,
          caseSensitive: effectiveCaseSensitive,
          targetElement:
            e.targetElement ||
            (e.presetLabel && /bold\s*italic/i.test(e.presetLabel)
              ? "strong-em"
              : e.presetLabel && /bold/i.test(e.presetLabel)
                ? "strong"
                : e.presetLabel && /italic/i.test(e.presetLabel)
                  ? "em"
                  : e.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1"
                    ? "strong"
                    : e.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1"
                      ? "em"
                      : e.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1"
                        ? "strong-em"
                        : undefined),
          inclusionRules: Array.isArray(e.inclusionRules)
            ? e.inclusionRules.slice()
            : [],
          exclusionRules: Array.isArray(e.exclusionRules)
            ? e.exclusionRules.slice()
            : [],
          groupUid: e._groupUid || null,
          groupEnableFolders: Array.isArray(e.groupEnableFolders)
            ? e.groupEnableFolders.slice()
            : [],
          groupDisableFolders: Array.isArray(e.groupDisableFolders)
            ? e.groupDisableFolders.slice()
            : [],
          groupEnableTags: Array.isArray(e.groupEnableTags)
            ? e.groupEnableTags.slice()
            : [],
          groupDisableTags: Array.isArray(e.groupDisableTags)
            ? e.groupDisableTags.slice()
            : [],
          backgroundOpacity: e.backgroundOpacity,
          highlightBorderRadius: e.highlightBorderRadius,
          highlightHorizontalPadding: e.highlightHorizontalPadding,
          highlightVerticalPadding: e.highlightVerticalPadding,
          enableBorderThickness: e.enableBorderThickness,
          borderStyle: e.borderStyle,
          borderLineStyle: e.borderLineStyle,
          borderOpacity: e.borderOpacity,
          borderThickness: e.borderThickness,
          execs: 0,
          avoidedExecs: 0,
          matchesFound: 0,
          blocksProcessed: 0,
          _hotLogged: false,
        };
        if (!pattern) {
          compiled.invalid = true;
          plugin._compiledWordEntries.push(compiled);
          continue;
        }
        try {
          if (plugin.settings.enableRegexSupport && isRegex) {
            if (!plugin.validateAndSanitizeRegex(pattern)) {
              compiled.invalid = true;
              plugin._compiledWordEntries.push(compiled);
              continue;
            }
            compiled.regex = plugin._regexCache.getOrCreate(pattern, flags);
            const testFlags = flags.replace(/g/g, "");
            compiled.testRegex = plugin._regexCache.getOrCreate(
              pattern,
              testFlags,
            );
          } else {
            const esc = plugin.escapeRegex(pattern);
            const matchTypeLower = String(
              compiled.matchType || "exact",
            ).toLowerCase();
            const isSentence = plugin.isSentenceLikePattern(pattern);
            const isNonRoman = plugin.containsNonRomanCharacters
              ? plugin.containsNonRomanCharacters(pattern)
              : false;
            let finalPattern = esc;
            if (!isSentence && matchTypeLower === "startswith") {
              finalPattern = isNonRoman ? esc : "\\b" + esc;
            } else if (!isSentence && matchTypeLower === "endswith") {
              finalPattern = isNonRoman ? esc : esc + "\\b";
            } else if (
              !isSentence &&
              matchTypeLower === "exact" &&
              String(pattern).length === 1
            ) {
              finalPattern = isNonRoman ? esc : "\\b" + esc + "\\b";
            }
            const literalFlags = effectiveCaseSensitive ? "g" : "gi";
            compiled.regex = plugin._regexCache.getOrCreate(
              finalPattern,
              literalFlags,
            );
            compiled.testRegex = effectiveCaseSensitive
              ? plugin._regexCache.getOrCreate(finalPattern, "")
              : plugin._regexCache.getOrCreate(finalPattern, "i");
          }
        } catch (err) {
          compiled.invalid = true;
        }
        try {
          plugin._bloomFilter &&
            plugin._bloomFilter.addPattern(pattern, isRegex);
        } catch (_) {}
        try {
          compiled.fastTest = plugin.createFastTester(
            pattern,
            compiled.isRegex,
            effectiveCaseSensitive,
          );
        } catch (e) {
          compiled.fastTest = (text) => true;
        }
        plugin._compiledWordEntries.push(compiled);
      }
    }
    plugin._compiledWordEntries.sort(
      (a, b) =>
        b.specificity - a.specificity || b.pattern.length - a.pattern.length,
    );
    try {
      plugin._cacheDirty = true;
      plugin._cachedSortedEntries = null;
    } catch (e) {}
    try {
      const all = (
        Array.isArray(plugin._compiledWordEntries)
          ? plugin._compiledWordEntries
          : []
      ).concat(
        Array.isArray(plugin._compiledTextBgEntries)
          ? plugin._compiledTextBgEntries
          : [],
      );
      plugin._settingsIndex && plugin._settingsIndex.rebuild(all);
    } catch (_) {}
  } catch (err) {
    debugError("COMPILE", "compileWordEntriesLogic failed", err);
    try {
      plugin._compiledWordEntries = [];
      plugin._cachedSortedEntries = null;
      plugin._cacheDirty = true;
    } catch (e) {}
  }
}

/**
 * Logic function for compileTextBgColoringEntries — thin wrapper that delegates to plugin method body.
 *
 * @param {object} plugin - The AlwaysColorText plugin instance
 */
export function compileTextBgColoringEntriesLogic(plugin) {
  try {
    try {
      plugin._compiledTextBgEntries = [];
    } catch (e) {}

    let source = [
      ...(Array.isArray(plugin.settings.wordEntries)
        ? plugin.settings.wordEntries
        : []),
    ];
    if (Array.isArray(plugin.settings.wordEntryGroups)) {
      plugin.settings.wordEntryGroups.forEach((group) => {
        if (group && group.active && Array.isArray(group.entries)) {
          const groupCase =
            typeof group.caseSensitiveOverride === "boolean"
              ? group.caseSensitiveOverride
              : undefined;
          const groupMatch =
            typeof group.matchTypeOverride === "string" &&
            group.matchTypeOverride
              ? group.matchTypeOverride
              : undefined;
          const mapped = group.entries.map((e) => {
            const copy = Object.assign({}, e);
            if (groupMatch) copy.matchType = groupMatch;
            if (groupCase !== undefined)
              copy._caseSensitiveOverride = groupCase;
            if (group.styleType) copy.styleType = group.styleType;
            if (group.textColor) copy.textColor = group.textColor;
            if (group.color) copy.color = group.color;
            if (group.backgroundColor)
              copy.backgroundColor = group.backgroundColor;
            if (typeof group.backgroundOpacity !== "undefined")
              copy.backgroundOpacity = group.backgroundOpacity;
            if (typeof group.highlightBorderRadius !== "undefined")
              copy.highlightBorderRadius = group.highlightBorderRadius;
            if (typeof group.highlightHorizontalPadding !== "undefined")
              copy.highlightHorizontalPadding = group.highlightHorizontalPadding;
            if (typeof group.highlightVerticalPadding !== "undefined")
              copy.highlightVerticalPadding = group.highlightVerticalPadding;
            if (typeof group.enableBorderThickness !== "undefined")
              copy.enableBorderThickness = group.enableBorderThickness;
            if (group.borderStyle) copy.borderStyle = group.borderStyle;
            if (group.borderLineStyle)
              copy.borderLineStyle = group.borderLineStyle;
            if (typeof group.borderOpacity !== "undefined")
              copy.borderOpacity = group.borderOpacity;
            if (typeof group.borderThickness !== "undefined")
              copy.borderThickness = group.borderThickness;
            copy._groupUid = group.uid || null;
            copy._groupRef = group;
            copy.groupEnableFolders = Array.isArray(group.enableFolders)
              ? group.enableFolders.slice()
              : [];
            copy.groupDisableFolders = Array.isArray(group.disableFolders)
              ? group.disableFolders.slice()
              : [];
            copy.groupEnableTags = Array.isArray(group.enableTags)
              ? group.enableTags.slice()
              : [];
            copy.groupDisableTags = Array.isArray(group.disableTags)
              ? group.disableTags.slice()
              : [];
            return copy;
          });
          source = source.concat(mapped);
        }
      });
    }

    for (const e of source) {
      if (!e || !e.backgroundColor) continue;
      if (e.presetLabel) {
        const label = String(e.presetLabel).toLowerCase();
        if (label.includes("bold") || label.includes("italic")) continue;
      }

      const patterns =
        Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
          ? e.groupedPatterns
          : [String(e.pattern || "").trim()];

      const textColor = e.textColor || "currentColor";
      const backgroundColor = e.backgroundColor;
      const isRegex = !!e.isRegex;

      const textOk =
        textColor === "currentColor" || plugin.isValidHexColor(textColor);
      const bgOk = plugin.isValidHexColor(backgroundColor);
      if (!textOk || !bgOk) continue;

      for (let pattern of patterns) {
        pattern = String(pattern).trim();
        if (!pattern) continue;
        pattern = plugin.sanitizePattern(pattern, isRegex);
        if (
          !plugin.settings.disableRegexSafety &&
          plugin.isKnownProblematicPattern(pattern)
        ) {
          debugWarn(
            "COMPILE_TEXTBG",
            `Blocked dangerous pattern: ${pattern.substring(0, 50)}`,
          );
          const compiled = {
            pattern,
            textColor,
            backgroundColor,
            matchType:
              e.matchType ||
              (plugin.settings.partialMatch ? "contains" : "exact"),
            isRegex,
            flags: "",
            regex: null,
            testRegex: null,
            invalid: true,
            specificity: 0,
            isTextBg: true,
            entryRef: e,
          };
          plugin._compiledTextBgEntries.push(compiled);
          continue;
        }

        const rawFlags = String(e.flags || "").replace(/[^gimsuy]/g, "");
        let flags = rawFlags || "";
        if (!flags.includes("g")) flags += "g";
        const effectiveCaseSensitive =
          typeof e._caseSensitiveOverride === "boolean"
            ? e._caseSensitiveOverride
            : typeof e.caseSensitive === "boolean"
              ? e.caseSensitive
              : plugin.settings.caseSensitive;
        if (!effectiveCaseSensitive && !flags.includes("i")) flags += "i";

        const compiled = {
          pattern,
          textColor,
          backgroundColor,
          styleType: e.styleType || "both",
          matchType:
            e.matchType ||
            (plugin.settings.partialMatch ? "contains" : "exact"),
          isRegex,
          flags,
          regex: null,
          testRegex: null,
          invalid: false,
          specificity: pattern.replace(/\*/g, "").length,
          isTextBg: true,
          presetLabel: e.presetLabel || undefined,
          entryRef: e,
          caseSensitive: effectiveCaseSensitive,
          inclusionRules: Array.isArray(e.inclusionRules)
            ? e.inclusionRules.slice()
            : [],
          exclusionRules: Array.isArray(e.exclusionRules)
            ? e.exclusionRules.slice()
            : [],
          groupUid: e._groupUid || null,
          groupEnableFolders: Array.isArray(e.groupEnableFolders)
            ? e.groupEnableFolders.slice()
            : [],
          groupDisableFolders: Array.isArray(e.groupDisableFolders)
            ? e.groupDisableFolders.slice()
            : [],
          groupEnableTags: Array.isArray(e.groupEnableTags)
            ? e.groupEnableTags.slice()
            : [],
          groupDisableTags: Array.isArray(e.groupDisableTags)
            ? e.groupDisableTags.slice()
            : [],
          backgroundOpacity: e.backgroundOpacity,
          highlightBorderRadius: e.highlightBorderRadius,
          highlightHorizontalPadding: e.highlightHorizontalPadding,
          highlightVerticalPadding: e.highlightVerticalPadding,
          enableBorderThickness: e.enableBorderThickness,
          borderStyle: e.borderStyle,
          borderLineStyle: e.borderLineStyle,
          borderOpacity: e.borderOpacity,
          borderThickness: e.borderThickness,
        };

        try {
          if (plugin.settings.enableRegexSupport && isRegex) {
            if (!plugin.validateAndSanitizeRegex(pattern)) {
              compiled.invalid = true;
              plugin._compiledTextBgEntries.push(compiled);
              continue;
            }
            compiled.regex = plugin._regexCache.getOrCreate(pattern, flags);
            const testFlags = flags.replace(/g/g, "");
            compiled.testRegex = plugin._regexCache.getOrCreate(
              pattern,
              testFlags,
            );
          } else {
            const esc = plugin.escapeRegex(pattern);
            const matchTypeLower = String(
              compiled.matchType || "exact",
            ).toLowerCase();
            const isSentence = plugin.isSentenceLikePattern(pattern);
            const isNonRoman = plugin.containsNonRomanCharacters
              ? plugin.containsNonRomanCharacters(pattern)
              : false;
            let finalPattern = esc;
            if (!isSentence && matchTypeLower === "startswith") {
              finalPattern = isNonRoman ? esc : "\\b" + esc;
            } else if (!isSentence && matchTypeLower === "endswith") {
              finalPattern = isNonRoman ? esc : esc + "\\b";
            } else if (
              !isSentence &&
              matchTypeLower === "exact" &&
              String(pattern).length === 1
            ) {
              finalPattern = isNonRoman ? esc : "\\b" + esc + "\\b";
            }
            const literalFlags = effectiveCaseSensitive ? "g" : "gi";
            compiled.regex = plugin._regexCache.getOrCreate(
              finalPattern,
              literalFlags,
            );
            compiled.testRegex = effectiveCaseSensitive
              ? plugin._regexCache.getOrCreate(finalPattern, "")
              : plugin._regexCache.getOrCreate(finalPattern, "i");
          }
          try {
            compiled.fastTest = plugin.createFastTester(
              pattern,
              isRegex,
              effectiveCaseSensitive,
            );
          } catch (e) {
            compiled.fastTest = (text) => true;
          }
          try {
            plugin._bloomFilter &&
              plugin._bloomFilter.addPattern(pattern, isRegex);
          } catch (_) {}
          plugin._compiledTextBgEntries.push(compiled);
        } catch (err) {
          compiled.invalid = true;
          compiled.regex = null;
          compiled.testRegex = null;
          debugError(
            "COMPILE_TEXTBG",
            `Failed to compile pattern: ${pattern}`,
            err,
          );
          plugin._compiledTextBgEntries.push(compiled);
        }
      }
    }
    plugin._compiledTextBgEntries.sort(
      (a, b) => b.specificity - a.specificity,
    );
  } catch (err) {
    debugError(
      "COMPILE_TEXTBG",
      "compileTextBgColoringEntriesLogic failed",
      err,
    );
    try {
      plugin._compiledTextBgEntries = [];
    } catch (e) {}
  }
  try {
    const all = (
      Array.isArray(plugin._compiledWordEntries)
        ? plugin._compiledWordEntries
        : []
    ).concat(
      Array.isArray(plugin._compiledTextBgEntries)
        ? plugin._compiledTextBgEntries
        : [],
    );
    plugin._settingsIndex && plugin._settingsIndex.rebuild(all);
  } catch (_) {}
  try {
    plugin.compileWordPatterns();
  } catch (e) {
    debugError("COMPILE", "Failed to compile word patterns", e);
  }
  try {
    plugin.compileTextBgPatterns();
  } catch (e) {
    debugError("COMPILE", "Failed to compile text+bg patterns", e);
  }
}

/**
 * Logic function for compileBlacklistEntries — thin wrapper that delegates to plugin method body.
 *
 * @param {object} plugin - The AlwaysColorText plugin instance
 */
export function compileBlacklistEntriesLogic(plugin) {
  try {
    plugin._compiledBlacklistWords = [];
    plugin._compiledBlacklistEntries = [];
    plugin._compiledBlacklistGroups = {};

    const blacklistWords = Array.isArray(plugin.settings.blacklistWords)
      ? plugin.settings.blacklistWords
      : [];
    for (const word of blacklistWords) {
      if (!word) continue;
      try {
        const flags = plugin.settings.caseSensitive ? "" : "i";
        const isNonRoman = plugin.containsNonRomanCharacters
          ? plugin.containsNonRomanCharacters(String(word))
          : false;
        const pattern = isNonRoman
          ? `${plugin.escapeRegex(String(word))}`
          : `\\b${plugin.escapeRegex(String(word))}\\b`;
        const regex = plugin._regexCache.getOrCreate(pattern, flags);
        if (regex) {
          plugin._compiledBlacklistWords.push({ word, regex, flags });
        }
      } catch (e) {}
    }

    const blacklistEntries = Array.isArray(plugin.settings.blacklistEntries)
      ? plugin.settings.blacklistEntries
      : [];
    for (const entry of blacklistEntries) {
      if (!entry) continue;
      try {
        const compiled = { entry, patterns: [] };
        if (entry.isRegex && plugin.settings.enableRegexSupport) {
          const flags =
            entry.flags || (plugin.settings.caseSensitive ? "" : "i");
          const regex = plugin._regexCache.getOrCreate(entry.pattern, flags);
          if (regex) {
            compiled.patterns.push({ regex, flags, isRegex: true });
          }
        } else {
          const patterns =
            Array.isArray(entry.groupedPatterns) &&
            entry.groupedPatterns.length > 0
              ? entry.groupedPatterns
              : [entry.pattern];
          for (const p of patterns) {
            if (!p) continue;
            const flags = plugin.settings.caseSensitive ? "" : "i";
            const isNonRoman = plugin.containsNonRomanCharacters
              ? plugin.containsNonRomanCharacters(String(p))
              : false;
            const pattern = isNonRoman
              ? `${plugin.escapeRegex(String(p))}`
              : `\\b${plugin.escapeRegex(String(p))}\\b`;
            const regex = plugin._regexCache.getOrCreate(pattern, flags);
            if (regex) {
              compiled.patterns.push({
                regex,
                flags,
                isRegex: false,
                pattern: String(p),
              });
            }
          }
        }
        if (compiled.patterns.length > 0) {
          plugin._compiledBlacklistEntries.push(compiled);
        }
      } catch (e) {}
    }

    const blacklistGroups = Array.isArray(plugin.settings.blacklistEntryGroups)
      ? plugin.settings.blacklistEntryGroups
      : [];
    for (const group of blacklistGroups) {
      if (!group || !group.uid) continue;
      try {
        const compiled = {
          group,
          entries: [],
          isCaseSensitive:
            group.caseSensitiveOverride !== null
              ? group.caseSensitiveOverride
              : plugin.settings.caseSensitive,
          matchType: group.matchTypeOverride || "contains",
        };
        const groupEntries = Array.isArray(group.entries) ? group.entries : [];
        for (const entry of groupEntries) {
          if (!entry) continue;
          const entryCompiled = { entry, patterns: [] };
          if (entry.isRegex && plugin.settings.enableRegexSupport) {
            const flags =
              entry.flags || (compiled.isCaseSensitive ? "" : "i");
            const regex = plugin._regexCache.getOrCreate(
              entry.pattern,
              flags,
            );
            if (regex) {
              entryCompiled.patterns.push({ regex, flags, isRegex: true });
            }
          } else {
            const patterns =
              Array.isArray(entry.groupedPatterns) &&
              entry.groupedPatterns.length > 0
                ? entry.groupedPatterns
                : [entry.pattern];
            for (const p of patterns) {
              if (!p) continue;
              const isNonRoman = plugin.containsNonRomanCharacters
                ? plugin.containsNonRomanCharacters(String(p))
                : false;
              const pattern = isNonRoman
                ? `${plugin.escapeRegex(String(p))}`
                : `\\b${plugin.escapeRegex(String(p))}\\b`;
              const regex = plugin._regexCache.getOrCreate(
                pattern,
                compiled.isCaseSensitive ? "" : "i",
              );
              if (regex) {
                entryCompiled.patterns.push({
                  regex,
                  pattern: String(p),
                  isRegex: false,
                });
              }
            }
          }
          if (entryCompiled.patterns.length > 0) {
            entryCompiled.matchType = compiled.matchType;
            compiled.entries.push(entryCompiled);
          }
        }
        if (compiled.entries.length > 0) {
          plugin._compiledBlacklistGroups[group.uid] = compiled;
        }
      } catch (e) {}
    }

    plugin._blacklistCompilationDirty = false;
    debugLog(
      "BLACKLIST_COMPILE",
      `Compiled ${plugin._compiledBlacklistWords.length} words, ${plugin._compiledBlacklistEntries.length} entries, ${Object.keys(plugin._compiledBlacklistGroups).length} groups`,
    );
  } catch (e) {
    debugError("BLACKLIST_COMPILE", "Failed to compile blacklist", e);
  }
}
