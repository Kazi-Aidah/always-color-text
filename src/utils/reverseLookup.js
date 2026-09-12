// Reverse lookup: given a selected string (+ optional editor context),
// find the settings entries that are actually responsible for coloring it.
//
// The problem this solves: selecting text that is colored by a regex
// (e.g. `\b\d+\b`, `==[\s\S]*?==`, `(\*\*|__)...`) or by a Markdown-element
// entry (targetElement) and opening "Always Color Text" previously treated
// the selection as a brand-new literal entry instead of opening the entry
// whose regex / element really colors it.
//
// The core insight: regexes must be tested against the surrounding document
// context (line / window), not just the bare selection. A highlight entry
// `==[\s\S]*?==` never matches the inner text `foo`, but it does match the
// line `==foo==` with the selection contained inside the match. Likewise a
// heading entry `^\s*#{1,6}\s+.*$` never matches `My Heading` alone, but it
// matches the line `# My Heading` containing the selection.

export function collectLiveEntries(settings) {
  const out = [];
  try {
    const main = Array.isArray(settings?.wordEntries) ? settings.wordEntries : [];
    main.forEach((entry, index) => {
      if (!entry) return;
      out.push({ entry, groupUid: null, groupName: null, group: null, index });
    });
    const groups = Array.isArray(settings?.wordEntryGroups) ? settings.wordEntryGroups : [];
    groups.forEach((g) => {
      if (!g || !Array.isArray(g.entries)) return;
      g.entries.forEach((entry, index) => {
        if (!entry) return;
        out.push({
          entry,
          groupUid: g.uid || null,
          groupName: g.name || g.uid || null,
          group: g,
          index,
        });
      });
    });
  } catch (_) {}
  return out;
}

export function isLiveForColoring(item) {
  try {
    const { entry, group } = item;
    if (!entry) return false;
    if (entry.active === false) return false;
    if (group && group.active === false) return false;
    return true;
  } catch (_) {
    return false;
  }
}

export function getEffectiveCaseSensitive(entry, settings) {
  try {
    if (entry && typeof entry.caseSensitive === "boolean") return entry.caseSensitive;
    if (entry && typeof entry._caseSensitiveOverride === "boolean")
      return entry._caseSensitiveOverride;
  } catch (_) {}
  try {
    return !!settings?.caseSensitive;
  } catch (_) {
    return false;
  }
}

export function getEffectiveMatchType(entry, settings) {
  try {
    const m = String(entry?.matchType || settings?.matchType || "").trim().toLowerCase();
    if (m === "exact" || m === "contains" || m === "startswith" || m === "endswith") return m;
  } catch (_) {}
  try {
    if (settings?.partialMatch) return "contains";
  } catch (_) {}
  return "exact";
}

function eqWithCase(a, b, caseSensitive) {
  try {
    const sa = String(a ?? "");
    const sb = String(b ?? "");
    if (caseSensitive) return sa === sb;
    return sa.toLowerCase() === sb.toLowerCase();
  } catch (_) {
    return false;
  }
}

// Literal (non-regex) match against the bare selection, honoring matchType,
// case sensitivity and groupedPatterns. Returns null when no match.
export function matchLiteralEntry(entry, selectedText, settings) {
  try {
    if (!entry || entry.isRegex) return null;
    // Markdown-element entries store a descriptive pattern ("Targets ..."),
    // never a literal to match. They are handled by matchTargetElementEntry.
    if (entry.targetElement) return null;
    const s = String(selectedText ?? "");
    if (!s) return null;
    const cs = getEffectiveCaseSensitive(entry, settings);
    const mt = getEffectiveMatchType(entry, settings);
    const patterns = [];
    if (entry.pattern != null && String(entry.pattern).length > 0)
      patterns.push(String(entry.pattern));
    if (Array.isArray(entry.groupedPatterns)) {
      for (const p of entry.groupedPatterns) {
        if (p != null && String(p).length > 0) patterns.push(String(p));
      }
    }
    if (patterns.length === 0) return null;
    const a = cs ? s : s.toLowerCase();
    for (const raw of patterns) {
      const b = cs ? String(raw) : String(raw).toLowerCase();
      if (mt === "exact") {
        if (eqWithCase(raw, s, cs)) return { kind: "literal-exact", pattern: raw };
      } else if (mt === "startswith") {
        if (b && a.startsWith(b)) return { kind: "literal-startswith", pattern: raw };
      } else if (mt === "endswith") {
        if (b && a.endsWith(b)) return { kind: "literal-endswith", pattern: raw };
      } else {
        // contains
        if (b && a.includes(b)) return { kind: "literal-contains", pattern: raw };
      }
    }
    return null;
  } catch (_) {
    return null;
  }
}

export function safeCreateRegex(pattern, flags) {
  try {
    const p = String(pattern ?? "");
    if (!p) return null;
    return new RegExp(p, String(flags || ""));
  } catch (_) {
    return null;
  }
}

// Collect up to maxMatches ranges from `re` (must have /g/) over text.
// Guards against zero-length infinite loops.
export function collectRegexRanges(regex, text, maxMatches = 50) {
  const ranges = [];
  try {
    if (!regex || regex == null) return ranges;
    const src = String(text ?? "");
    if (!src) return ranges;
    let flags = "";
    try {
      flags = String(regex.flags || "");
    } catch (_) {
      flags = "g";
    }
    if (!flags.includes("g")) flags += "g";
    let re;
    try {
      re = new RegExp(regex.source, flags);
    } catch (_) {
      return ranges;
    }
    re.lastIndex = 0;
    let count = 0;
    let m;
    while (count < maxMatches && (m = re.exec(src)) !== null) {
      const full = String(m[0] ?? "");
      const start = m.index;
      const end = start + full.length;
      ranges.push({ start, end, text: full, match: m });
      count++;
      if (full.length === 0) {
        re.lastIndex++;
        if (re.lastIndex > src.length) break;
      }
    }
  } catch (_) {}
  return ranges;
}

export function isContained(selStart, selEnd, mStart, mEnd) {
  try {
    if (selStart == null || selEnd == null) return false;
    if (mStart == null || mEnd == null) return false;
    if (selStart > selEnd) return false;
    return selStart >= mStart && selEnd <= mEnd && mEnd > mStart;
  } catch (_) {
    return false;
  }
}

// Direct regex test against the bare selection.
export function matchRegexDirect(entry, selectedText, settings, helpers) {
  try {
    if (!entry || !entry.isRegex) return null;
    if (settings && settings.enableRegexSupport === false) return null;
    const s = String(selectedText ?? "");
    if (!s) return null;
    if (helpers && typeof helpers.validateAndSanitizeRegex === "function") {
      try {
        if (!helpers.validateAndSanitizeRegex(entry.pattern)) return null;
      } catch (_) {
        return null;
      }
    }
    let re = null;
    try {
      if (entry.testRegex && entry.testRegex instanceof RegExp) re = entry.testRegex;
      else re = safeCreateRegex(entry.pattern, String(entry.flags || "").replace(/g/g, ""));
    } catch (_) {
      re = null;
    }
    if (!re) return null;
    let ok = false;
    try {
      re.lastIndex = 0;
      ok = re.test(s);
    } catch (_) {
      ok = false;
    }
    if (ok) return { kind: "regex-direct" };
    return null;
  } catch (_) {
    return null;
  }
}

// Contextual regex test: does the regex match the surrounding context text
// such that the selection lies inside one of the matches?
// context = { contextText, selStart, selEnd } with offsets relative to contextText.
export function matchRegexContext(entry, context, helpers) {
  try {
    if (!entry || !entry.isRegex) return null;
    if (!context || typeof context.contextText !== "string") return null;
    const { contextText, selStart, selEnd } = context;
    if (selStart == null || selEnd == null) return null;
    if (!contextText) return null;
    if (helpers && typeof helpers.validateAndSanitizeRegex === "function") {
      try {
        if (!helpers.validateAndSanitizeRegex(entry.pattern)) return null;
      } catch (_) {
        return null;
      }
    }
    const cs = typeof entry.caseSensitive === "boolean" ? entry.caseSensitive : null;
    let flags = String(entry.flags || "");
    // Ensure case-insensitive unless the entry explicitly opts into sensitivity
    // or the flags already carry `i`.
    if (cs === false && !flags.includes("i")) flags += "i";
    if (cs !== true && !flags.includes("i")) {
      // Default global behaviour is case-insensitive; match the compiler.
      if (!/i/.test(flags)) flags += "i";
    }
    const re = safeCreateRegex(entry.pattern, flags);
    if (!re) return null;
    const ranges = collectRegexRanges(re, contextText, 100);
    for (const r of ranges) {
      if (isContained(selStart, selEnd, r.start, r.end)) {
        return { kind: "regex-context", matchStart: r.start, matchEnd: r.end, matchText: r.text };
      }
    }
    return null;
  } catch (_) {
    return null;
  }
}

// ---- Markdown-element (targetElement) matching --------------------------------
// These entries color via CSS injection, not via a matchable pattern. We infer
// candidacy from the markdown syntax surrounding the selection.

function sliceContains(line, selStart, selEnd, before, after) {
  try {
    if (line == null || selStart == null || selEnd == null) return false;
    const s = String(line);
    if (selStart < 0 || selEnd > s.length || selStart >= selEnd) return false;
    const pre = s.slice(Math.max(0, selStart - before.length - 20), selStart);
    const post = s.slice(selEnd, Math.min(s.length, selEnd + after.length + 20));
    return pre.endsWith(before) || pre.includes(before) ? post.includes(after) || post.startsWith(after) : false;
  } catch (_) {
    return false;
  }
}

function insideDelimiters(lineText, selStart, selEnd, open, close) {
  try {
    const s = String(lineText ?? "");
    if (selStart == null || selEnd == null || !s) return false;
    const c = close ?? open;
    // Find an opener before the selection and a closer after it on the same line.
    const pre = s.slice(0, selStart);
    const post = s.slice(selEnd);
    const openIdx = pre.lastIndexOf(open);
    if (openIdx === -1) return false;
    const closeIdx = post.indexOf(c);
    if (closeIdx === -1) return false;
    // Guard: opener must not be closed before the selection starts.
    const between = s.slice(openIdx + open.length, selStart) + s.slice(selEnd, selEnd + closeIdx);
    void between;
    return true;
  } catch (_) {
    return false;
  }
}

function lineLooksLike(lineText, re) {
  try {
    if (!lineText) return false;
    return re.test(String(lineText));
  } catch (_) {
    return false;
  }
}

// Returns { kind:'markdown', detail } when the selection plausibly sits inside
// the given target element, else null. `ctx` may carry lineText, selStartInLine,
// selEndInLine, windowText, windowSelStart/End, selectedText.
export function matchTargetElementEntry(entry, ctx) {
  try {
    const key = entry && entry.targetElement ? String(entry.targetElement) : null;
    if (!key) return null;
    const sel = String(ctx?.selectedText ?? "");
    const line = ctx?.lineText != null ? String(ctx.lineText) : null;
    const ls = ctx?.selStartInLine;
    const le = ctx?.selEndInLine;
    const hasPos = line != null && ls != null && le != null;

    switch (key) {
      case "heading": {
        if (hasPos) {
          const m = /^\s*(#{1,6})\s+/.exec(line);
          if (!m) return null;
          const contentStart = m[0].length;
          if (ls >= contentStart - 1) {
            // Honor headingLevels filter when present.
            try {
              const raw = entry.headingLevels;
              if (raw != null && String(raw).trim().length > 0) {
                const levels = new Set(
                  String(raw).split(/[\s,]+/).map((t) => parseInt(t, 10)).filter((n) => n >= 1 && n <= 6),
                );
                if (levels.size > 0 && !levels.has(m[1].length)) return null;
              }
            } catch (_) {}
            return { kind: "markdown", detail: "heading" };
          }
          return null;
        }
        // No position info: fall back to entry being a generic heading rule.
        return { kind: "markdown-possible", detail: "heading" };
      }
      case "strong": {
        if (hasPos) {
          if (insideDelimiters(line, ls, le, "**") || insideDelimiters(line, ls, le, "__"))
            return { kind: "markdown", detail: "strong" };
          return null;
        }
        return { kind: "markdown-possible", detail: "strong" };
      }
      case "em": {
        if (hasPos) {
          // Single * or _ (strong already handled above; accept either here).
          if (
            insideDelimiters(line, ls, le, "*") ||
            insideDelimiters(line, ls, le, "_") ||
            insideDelimiters(line, ls, le, "**") ||
            insideDelimiters(line, ls, le, "__")
          )
            return { kind: "markdown", detail: "em" };
          return null;
        }
        return { kind: "markdown-possible", detail: "em" };
      }
      case "strong-em": {
        if (hasPos) {
          if (insideDelimiters(line, ls, le, "***") || insideDelimiters(line, ls, le, "___"))
            return { kind: "markdown", detail: "strong-em" };
          return null;
        }
        return { kind: "markdown-possible", detail: "strong-em" };
      }
      case "strikethrough": {
        if (hasPos) {
          if (insideDelimiters(line, ls, le, "~~")) return { kind: "markdown", detail: "strikethrough" };
          return null;
        }
        return null;
      }
      case "highlight": {
        if (hasPos) {
          if (insideDelimiters(line, ls, le, "==")) return { kind: "markdown", detail: "highlight" };
          // Multiline highlight: check the wider window too.
          try {
            const w = ctx?.windowText != null ? String(ctx.windowText) : null;
            const ws = ctx?.windowSelStart;
            const we = ctx?.windowSelEnd;
            if (w != null && ws != null && we != null && insideDelimiters(w, ws, we, "=="))
              return { kind: "markdown", detail: "highlight" };
          } catch (_) {}
          return null;
        }
        return null;
      }
      case "inline-code": {
        if (hasPos) {
          if (insideDelimiters(line, ls, le, "`")) return { kind: "markdown", detail: "inline-code" };
          return null;
        }
        return null;
      }
      case "codeblock": {
        try {
          const w = ctx?.windowText != null ? String(ctx.windowText) : hasPos ? line : null;
          const ws = ctx?.windowSelStart ?? ls;
          const we = ctx?.windowSelEnd ?? le;
          if (w != null && ws != null && we != null && insideDelimiters(w, ws, we, "```"))
            return { kind: "markdown", detail: "codeblock" };
        } catch (_) {}
        return null;
      }
      case "comment": {
        try {
          const w = ctx?.windowText != null ? String(ctx.windowText) : hasPos ? line : null;
          const ws = ctx?.windowSelStart ?? ls;
          const we = ctx?.windowSelEnd ?? le;
          if (w != null && ws != null && we != null && insideDelimiters(w, ws, we, "%%"))
            return { kind: "markdown", detail: "comment" };
        } catch (_) {}
        return null;
      }
      case "blockquote": {
        if (hasPos && lineLooksLike(line, /^\s*>\s+/)) return { kind: "markdown", detail: "blockquote" };
        return null;
      }
      case "bullet-list": {
        if (hasPos && lineLooksLike(line, /^\s*[\-\*]\s+.+/) && !lineLooksLike(line, /^\s*[\-\*]\s+\[[ xX]\]\s+/))
          return { kind: "markdown", detail: "bullet-list" };
        return null;
      }
      case "numbered-list": {
        if (hasPos && lineLooksLike(line, /^\s*\d+\.\s+.+/)) return { kind: "markdown", detail: "numbered-list" };
        return null;
      }
      case "task-list": {
        if (hasPos && lineLooksLike(line, /^\s*[\-\*]\s+\[[^\]]\]\s+/))
          return { kind: "markdown", detail: "task-list" };
        return null;
      }
      case "internal-link": {
        if (sel.startsWith("[[") && sel.endsWith("]]")) return { kind: "markdown", detail: "internal-link" };
        if (hasPos && insideDelimiters(line, ls, le, "[[", "]]")) return { kind: "markdown", detail: "internal-link" };
        return null;
      }
      case "external-link": {
        if (/https?:\/\/\S+/.test(sel) || /^\[.+\]\(.+\)$/.test(sel)) return { kind: "markdown", detail: "external-link" };
        if (hasPos && (/https?:\/\/\S+/.test(line) || /\[.+?\]\(.+?\)/.test(line))) {
          // Only claim when the selection itself is link-ish or inside parens/brackets.
          const pre = line.slice(Math.max(0, ls - 60), ls);
          const post = line.slice(le, Math.min(line.length, le + 60));
          if (/\[$/.test(pre) || /\]\($/.test(pre) || /\(https?:$/.test(pre) || /https?:/.test(pre + post))
            return { kind: "markdown", detail: "external-link" };
        }
        return null;
      }
      case "tag":
      case "all-tags": {
        const t = sel.trim();
        if (/^#[\p{L}\p{N}_/-]+$/u.test(t)) {
          try {
            const filter = String(entry.tagFilter || "").trim();
            if (!filter) return { kind: "markdown", detail: key };
            const wanted = filter.split(/[\s,]+/).map((s) => s.replace(/^#/, "").toLowerCase()).filter(Boolean);
            const cur = t.replace(/^#/, "").toLowerCase();
            if (wanted.includes(cur)) return { kind: "markdown", detail: key };
            return null;
          } catch (_) {
            return { kind: "markdown", detail: key };
          }
        }
        return null;
      }
      case "inline-title":
      case "tab-title": {
        try {
          const filter = String(entry.titleFilter || "").trim();
          if (!filter) return { kind: "markdown-possible", detail: key };
          const mode = String(entry.titleMatchType || "contains").toLowerCase();
          const f = filter.toLowerCase();
          const cur = sel.toLowerCase().trim();
          if (mode === "exact" && cur === f) return { kind: "markdown", detail: key };
          if (mode === "startswith" && cur.startsWith(f)) return { kind: "markdown", detail: key };
          if (mode === "endswith" && cur.endsWith(f)) return { kind: "markdown", detail: key };
          if (cur.includes(f)) return { kind: "markdown", detail: key };
          return null;
        } catch (_) {
          return null;
        }
      }
      default: {
        void sliceContains;
        return null;
      }
    }
  } catch (_) {
    return null;
  }
}

function specificityOf(entry) {
  try {
    const p = String(entry?.pattern || "");
    return p.replace(/\*/g, "").length;
  } catch (_) {
    return 0;
  }
}

const KIND_RANK = {
  "literal-exact": 100,
  "regex-direct": 90,
  "markdown": 80,
  "regex-context": 70,
  "literal-contains": 60,
  "literal-startswith": 60,
  "literal-endswith": 60,
  "markdown-possible": 10,
};

export function rankOf(kind) {
  return KIND_RANK[String(kind)] ?? 0;
}

// Main entry point. Returns candidates sorted best-first:
// [{ entry, groupUid, groupName, kind, detail, specificity }]
export function findColoringEntries(pluginOrSettings, selectedText, ctx = {}) {
  try {
    const settings = pluginOrSettings?.settings ? pluginOrSettings.settings : pluginOrSettings;
    const plugin = pluginOrSettings?.settings ? pluginOrSettings : null;
    const helpers = plugin
      ? { validateAndSanitizeRegex: (p) => { try { return plugin.validateAndSanitizeRegex(p); } catch (_) { return true; } } }
      : ctx?.helpers || null;
    const sel = String(selectedText ?? "");
    if (!sel || !sel.trim()) return [];
    const s = sel.trim();

    const live = collectLiveEntries(settings).filter(isLiveForColoring);
    const enableRegex = !settings || settings.enableRegexSupport !== false;

    // Build regex-context probe from editor context when available.
    let regexCtx = null;
    try {
      if (ctx && typeof ctx.contextText === "string" && ctx.selStart != null && ctx.selEnd != null) {
        regexCtx = { contextText: ctx.contextText, selStart: ctx.selStart, selEnd: ctx.selEnd };
      } else if (ctx && typeof ctx.windowText === "string" && ctx.windowSelStart != null && ctx.windowSelEnd != null) {
        regexCtx = { contextText: ctx.windowText, selStart: ctx.windowSelStart, selEnd: ctx.windowSelEnd };
      } else if (ctx && typeof ctx.lineText === "string" && ctx.selStartInLine != null && ctx.selEndInLine != null) {
        regexCtx = { contextText: ctx.lineText, selStart: ctx.selStartInLine, selEnd: ctx.selEndInLine };
      }
    } catch (_) {
      regexCtx = null;
    }

    const out = [];
    for (const item of live) {
      const { entry, groupUid, groupName } = item;
      if (!entry) continue;
      // Skip file-scoped mismatches when a file path + plugin filter is available.
      try {
        if (plugin && ctx?.filePath && typeof plugin.shouldColorText === "function") {
          // shouldColorText is per-word; too heavy here. Instead rely on the
          // entry-level include/exclude only when the plugin exposes a helper.
          void 0;
        }
      } catch (_) {}

      // 1) Markdown-element entries: syntax-aware check first (they never match literally).
      if (entry.targetElement) {
        const tm = matchTargetElementEntry(entry, {
          selectedText: s,
          lineText: ctx?.lineText,
          selStartInLine: ctx?.selStartInLine,
          selEndInLine: ctx?.selEndInLine,
          windowText: ctx?.windowText ?? ctx?.contextText,
          windowSelStart: ctx?.windowSelStart ?? ctx?.selStart,
          windowSelEnd: ctx?.windowSelEnd ?? ctx?.selEnd,
        });
        if (tm) {
          out.push({
            entry, groupUid: groupUid || null, groupName: groupName || null,
            kind: tm.kind, detail: tm.detail || entry.targetElement,
            specificity: 1000 + specificityOf(entry),
          });
          continue;
        }
        // A markdown entry may ALSO carry a real regex (legacy presets). Fall
        // through to regex matching below so `**bold**`-style patterns still hit.
      }

      // 2) Literal entries.
      if (!entry.isRegex) {
        if (entry.targetElement) continue; // already handled, no literal fallback
        const lm = matchLiteralEntry(entry, s, settings);
        if (lm) {
          out.push({
            entry, groupUid: groupUid || null, groupName: groupName || null,
            kind: lm.kind, detail: lm.pattern,
            specificity: specificityOf(entry),
          });
          continue;
        }
      }

      // 3) Regex entries.
      if (entry.isRegex && enableRegex) {
        const direct = matchRegexDirect(entry, s, settings, helpers);
        if (direct) {
          out.push({
            entry, groupUid: groupUid || null, groupName: groupName || null,
            kind: direct.kind, detail: null,
            specificity: specificityOf(entry),
          });
          continue;
        }
        if (regexCtx) {
          const situated = matchRegexContext(entry, regexCtx, helpers);
          if (situated) {
            out.push({
              entry, groupUid: groupUid || null, groupName: groupName || null,
              kind: situated.kind, detail: situated.matchText,
              specificity: specificityOf(entry),
            });
            continue;
          }
        }
      }
    }

    out.sort((a, b) => {
      const r = rankOf(b.kind) - rankOf(a.kind);
      if (r !== 0) return r;
      const sp = (b.specificity || 0) - (a.specificity || 0);
      if (sp !== 0) return sp;
      try {
        return String(b.entry?.pattern || "").length - String(a.entry?.pattern || "").length;
      } catch (_) {
        return 0;
      }
    });
    return out;
  } catch (_) {
    return [];
  }
}

// Build editor context for reverse lookup from an Obsidian editor + view.
// Defensive: every accessor is optional-chained; missing pieces stay null.
export function buildSelectionContext(editor, view) {
  const ctx = {
    selectedText: "",
    lineText: null,
    selStartInLine: null,
    selEndInLine: null,
    contextText: null,
    selStart: null,
    selEnd: null,
    windowText: null,
    windowSelStart: null,
    windowSelEnd: null,
    filePath: null,
  };
  try {
    try {
      if (editor && typeof editor.getSelection === "function") ctx.selectedText = editor.getSelection() || "";
    } catch (_) {}
    try {
      ctx.filePath = (view && view.file && view.file.path) || null;
    } catch (_) {}
    let from = null;
    let to = null;
    try {
      if (editor && typeof editor.getCursor === "function") {
        try {
          from = editor.getCursor("from");
        } catch (_) {
          from = editor.getCursor("from");
        }
        try {
          to = editor.getCursor("to");
        } catch (_) {
          to = null;
        }
      }
    } catch (_) {}
    // Normalize {line, ch} positions.
    const norm = (p) => {
      if (!p) return null;
      if (typeof p.line === "number" && typeof p.ch === "number") return p;
      return null;
    };
    from = norm(from);
    to = norm(to);
    try {
      if (from && to && editor && typeof editor.getLine === "function") {
        if (from.line === to.line) {
          const line = editor.getLine(from.line) || "";
          ctx.lineText = line;
          ctx.selStartInLine = Math.min(from.ch, to.ch);
          ctx.selEndInLine = Math.max(from.ch, to.ch);
          ctx.contextText = line;
          ctx.selStart = ctx.selStartInLine;
          ctx.selEnd = ctx.selEndInLine;
        } else {
          // Multi-line selection: gather the spanned lines as context.
          const lines = [];
          for (let ln = from.line; ln <= to.line; ln++) {
            try {
              lines.push(editor.getLine(ln) || "");
            } catch (_) {
              lines.push("");
            }
          }
          const full = lines.join("\n");
          ctx.lineText = null;
          ctx.contextText = full;
          // Selection offsets within the joined context.
          let startOff = 0;
          try {
            const firstLen = String(lines[0] || "").length;
            startOff = Math.min(from.ch, firstLen);
          } catch (_) {}
          let endOff = full.length;
          try {
            let acc = 0;
            for (let i = 0; i < lines.length - 1; i++) acc += String(lines[i]).length + 1;
            endOff = acc + Math.max(to.ch, 0);
          } catch (_) {}
          ctx.selStart = startOff;
          ctx.selEnd = endOff;
        }
      }
    } catch (_) {}
    // Wider window (for multiline patterns like codeblocks / ==...==).
    try {
      if (editor && typeof editor.getValue === "function") {
        const full = editor.getValue();
        if (typeof full === "string" && full.length > 0 && full.length < 500000) {
          let absStart = null;
          let absEnd = null;
          try {
            if (from && to && typeof editor.posToOffset === "function") {
              absStart = editor.posToOffset(from);
              absEnd = editor.posToOffset(to);
            }
          } catch (_) {}
          if (absStart != null && absEnd != null) {
            const s0 = Math.min(absStart, absEnd);
            const e0 = Math.max(absStart, absEnd);
            const wStart = Math.max(0, s0 - 1000);
            const wEnd = Math.min(full.length, e0 + 1000);
            ctx.windowText = full.slice(wStart, wEnd);
            ctx.windowSelStart = s0 - wStart;
            ctx.windowSelEnd = e0 - wStart;
            // Prefer the window as the regex-context probe when the selection
            // spans lines or the single line probe missed.
            if (ctx.contextText == null || (from && to && from.line !== to.line)) {
              ctx.contextText = ctx.windowText;
              ctx.selStart = ctx.windowSelStart;
              ctx.selEnd = ctx.windowSelEnd;
            }
          } else if (ctx.contextText == null && ctx.selectedText) {
            // Fallback: search offset of the selection inside the doc.
            const idx = full.indexOf(String(ctx.selectedText).trim());
            if (idx !== -1) {
              const wStart = Math.max(0, idx - 1000);
              const wEnd = Math.min(full.length, idx + String(ctx.selectedText).trim().length + 1000);
              ctx.windowText = full.slice(wStart, wEnd);
              ctx.windowSelStart = idx - wStart;
              ctx.windowSelEnd = idx - wStart + String(ctx.selectedText).trim().length;
              ctx.contextText = ctx.windowText;
              ctx.selStart = ctx.windowSelStart;
              ctx.selEnd = ctx.windowSelEnd;
            }
          } else {
            ctx.windowText = null;
          }
        }
      }
    } catch (_) {}
  } catch (_) {}
  return ctx;
}

export function describeCandidate(c) {
  try {
    const e = c?.entry || {};
    if (e.targetElement) return `Markdown: ${e.targetElement}`;
    if (e.isRegex) return `Regex: ${e.pattern}`;
    return `Text: ${e.pattern}`;
  } catch (_) {
    return "Entry";
  }
}
