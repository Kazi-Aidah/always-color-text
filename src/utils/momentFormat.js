/**
 * moment.js format → regex helpers for the "Time & Date" preset.
 *
 * The preset lets someone who doesn't know regex describe a date/time the way
 * they write it ("DD_MMMM_Y") and get coloring for text written that way
 * ("25_September_2026"). Two halves:
 *
 *  - `renderFormat()` renders the format with moment so the preview shows the
 *    exact text the pattern will color.
 *  - `evaluateDateTimeFormat()` compiles the format into a regex and checks
 *    that it really matches that rendered text, so a broken format can never
 *    produce an entry that silently colors nothing.
 *
 * Tokens follow moment's own case-sensitive semantics: `dd` is the short
 * weekday name, `DD` the day of month, `MMM` the short month name, `MMMM` the
 * full month name.
 *
 * `moment` is passed in (imported from the Obsidian API by the caller) so this
 * module stays pure and testable with a stub.
 */

const REGEX_META = /[.*+?^${}()|[\]\\]/g;

/** Sensible starting point — renders like `25_September_2026`. */
export const DEFAULT_DATE_TIME_FORMAT = "hh:mm a, D MMMM Y";

/**
 * Hard cap mirroring `plugin.sanitizePattern()`: a regex longer than this
 * throws at compile time, and that exception unwinds the whole compile pass.
 * `isRegexTooComplex()` blocks >100 on top of this when regex safety is on —
 * that gate is applied through the plugin's own validator in the modal.
 */
const MAX_PATTERN_LENGTH = 200;

const escapeRegex = (text) => String(text).replace(REGEX_META, "\\$&");

const isWordChar = (ch) => typeof ch === "string" && /[A-Za-z0-9_]/.test(ch);

/** Digit-shaped tokens: safe to bracket with `\b` on both ends. */
const digits = (re) => ({ re, lead: "word", trail: "word" });

/**
 * Token table (longest match wins). `name` tokens compile to a letter class
 * instead of a literal alternation of locale month/weekday names: an
 * alternation would trip the plugin's `isRegexTooComplex()` limits
 * (>5 alternations, >100 chars) and get the entry silently rejected. The
 * surrounding tokens carry the precision.
 */
const TOKENS = {
  // Years
  YYYYYY: digits("[-+]?\\d{5,6}"),
  YYYYY: digits("[-+]?\\d{5,6}"),
  YYYY: digits("\\d{4}"),
  YY: digits("\\d{2}"),
  Y: digits("[-+]?\\d{1,4}"),
  // Quarter / week / day of year
  Q: digits("\\d{1,2}"),
  WW: digits("\\d{2}"),
  W: digits("\\d{1,2}"),
  ww: digits("\\d{2}"),
  w: digits("\\d{1,2}"),
  DDDD: digits("\\d{1,4}"),
  DDD: digits("\\d{1,3}"),
  // Month
  MMMM: { name: "months", min: 3, max: 10 },
  MMM: { name: "monthsShort", min: 3, max: 4 },
  MM: digits("\\d{2}"),
  M: digits("\\d{1,2}"),
  // Day of month
  DD: digits("\\d{2}"),
  D: digits("\\d{1,2}"),
  Do: { re: "\\d{1,2}(?:st|nd|rd|th)", lead: "word", trail: "word" },
  // Day of week
  dddd: { name: "weekdays", min: 3, max: 10 },
  ddd: { name: "weekdaysShort", min: 3, max: 4 },
  dd: { name: "weekdaysMin", min: 2, max: 4 },
  d: digits("\\d"),
  e: digits("\\d"),
  E: digits("\\d"),
  // Hour (moment ranges: H 0-23, h 1-12, k 1-24)
  HH: digits("(?:[01]\\d|2[0-3])"),
  H: digits("(?:[01]?\\d|2[0-3])"),
  hh: digits("(?:1[0-2]|0[1-9])"),
  h: digits("(?:1[0-2]|[1-9])"),
  kk: digits("(?:2[0-4]|[01]\\d)"),
  k: digits("(?:2[0-4]|1\\d|[1-9])"),
  // Minute / second / fraction
  mm: digits("[0-5]\\d"),
  m: digits("[0-5]?\\d"),
  ss: digits("[0-5]\\d"),
  s: digits("[0-5]?\\d"),
  SSS: digits("\\d{3}"),
  SS: digits("\\d{2}"),
  S: digits("\\d"),
  // Meridiem / timezone / unix
  A: { re: "[AP]M", lead: "word", trail: "word" },
  a: { re: "[ap]m", lead: "word", trail: "word" },
  Z: { re: "[-+]\\d{2}:\\d{2}", lead: "other", trail: "word" },
  ZZ: { re: "[-+]\\d{4}", lead: "other", trail: "word" },
  z: { re: "[A-Za-z]{2,4}", lead: "word", trail: "word" },
  X: digits("\\d{9,}"),
  x: digits("\\d{13}"),
  // Localized formats — expanded through moment's locale when available
  LTS: { localized: true },
  LT: { localized: true },
  LLLL: { localized: true },
  LLL: { localized: true },
  LL: { localized: true },
  L: { localized: true },
  lts: { localized: true },
  lt: { localized: true },
  llll: { localized: true },
  lll: { localized: true },
  ll: { localized: true },
  l: { localized: true },
};

/** Used when moment or its locale data isn't reachable. */
const LONG_FORMAT_FALLBACK = {
  LTS: "h:mm:ss A",
  LT: "h:mm A",
  LLLL: "dddd, MMMM D YYYY h:mm A",
  LLL: "MMMM D YYYY h:mm A",
  LL: "MMMM D YYYY",
  L: "MM/DD/YYYY",
  lts: "h:mm:ss A",
  lt: "h:mm A",
  llll: "ddd, MMM D YYYY h:mm A",
  lll: "MMM D YYYY h:mm A",
  ll: "MMM D YYYY",
  l: "M/D/YYYY",
};

/** Longest first so `MMMM` wins over `MMM` over `MM` over `M`. */
const TOKEN_NAMES = Object.keys(TOKENS).sort((a, b) => b.length - a.length);

/**
 * Render a format with moment (the current moment, so the preview shows a
 * real date/time). Returns null when moment can't render it.
 */
export function renderFormat(format, moment) {
  try {
    if (typeof moment !== "function") return null;
    const now = moment();
    if (!now || typeof now.format !== "function") return null;
    if (typeof now.isValid === "function" && !now.isValid()) return null;
    const rendered = now.format(String(format == null ? "" : format));
    return typeof rendered === "string" && rendered.length > 0 ? rendered : null;
  } catch (_) {
    return null;
  }
}

function matchToken(format, index) {
  for (const token of TOKEN_NAMES) {
    if (format.startsWith(token, index)) return token;
  }
  return null;
}

function expandLocalized(token, moment) {
  try {
    if (typeof moment === "function" && typeof moment.localeData === "function") {
      const localeData = moment.localeData();
      const expanded =
        localeData && typeof localeData.longDateFormat === "function"
          ? localeData.longDateFormat(token)
          : null;
      if (expanded && expanded !== token) return expanded;
    }
  } catch (_) {}
  return LONG_FORMAT_FALLBACK[token] || null;
}

function pushLiteral(segments, text) {
  const str = String(text == null ? "" : text);
  if (!str) return;
  segments.push({
    re: escapeRegex(str),
    lead: isWordChar(str[0]) ? "word" : "other",
    trail: isWordChar(str[str.length - 1]) ? "word" : "other",
  });
}

/**
 * Split a moment format into regex segments.
 * Escapes are moment's own: `[text]` and `'text'` are literals.
 */
function parseFormat(format, moment, depth) {
  const segments = [];
  const fmt = String(format == null ? "" : format);
  let i = 0;

  while (i < fmt.length) {
    const ch = fmt[i];

    // [literal]
    if (ch === "[") {
      const end = fmt.indexOf("]", i + 1);
      if (end !== -1) {
        pushLiteral(segments, fmt.slice(i + 1, end));
        i = end + 1;
        continue;
      }
      pushLiteral(segments, "[");
      i += 1;
      continue;
    }

    // 'literal' ('' is a literal quote inside a quoted run)
    if (ch === "'") {
      let j = i + 1;
      let body = "";
      let closed = false;
      while (j < fmt.length) {
        if (fmt[j] === "'") {
          if (fmt[j + 1] === "'") {
            body += "'";
            j += 2;
            continue;
          }
          closed = true;
          j += 1;
          break;
        }
        body += fmt[j];
        j += 1;
      }
      if (closed) {
        pushLiteral(segments, body);
        i = j;
        continue;
      }
      pushLiteral(segments, "'");
      i += 1;
      continue;
    }

    if (/[A-Za-z]/.test(ch)) {
      const token = matchToken(fmt, i);
      if (token) {
        const def = TOKENS[token];
        if (def.localized) {
          const expanded = depth < 3 ? expandLocalized(token, moment) : null;
          if (expanded) {
            segments.push(...parseFormat(expanded, moment, depth + 1));
          } else {
            pushLiteral(segments, token);
          }
        } else if (def.name) {
          // Locale month/weekday names as a letter class (see TOKENS note).
          segments.push({
            re: `\\p{L}{${def.min},${def.max}}`,
            lead: "word",
            trail: "word",
          });
        } else {
          segments.push({ re: def.re, lead: def.lead, trail: def.trail });
        }
        i += token.length;
        continue;
      }
      pushLiteral(segments, ch);
      i += 1;
      continue;
    }

    pushLiteral(segments, ch);
    i += 1;
  }

  return segments;
}

function joinSegments(segments, withBoundaries) {
  let out = "";
  segments.forEach((seg, index) => {
    if (withBoundaries && index === 0 && seg.lead === "word") out += "\\b";
    out += seg.re;
    if (withBoundaries && index === segments.length - 1 && seg.trail === "word")
      out += "\\b";
  });
  return out;
}

function matches(pattern, text) {
  try {
    return new RegExp(pattern, "iu").test(text);
  } catch (_) {
    return false;
  }
}

/**
 * Compile a moment format into a regex entry pattern.
 *
 * @param {string} format - moment format, e.g. `DD_MMMM_Y`
 * @param {Function} [moment] - moment from the Obsidian API
 * @param {Function} [validateRegex] - the plugin's regex-safety gate
 *   (`validateAndSanitizeRegex`), used to reject patterns it would block.
 * @returns {{ok: boolean, error: string|null, sample: string, pattern: string}}
 *   `sample` is the rendered text the preview shows; `pattern` is what the
 *   entry stores. `ok` is false when the format can't be used as-is.
 */
export function evaluateDateTimeFormat(format, moment, validateRegex) {
  const fmt = String(format == null ? "" : format).trim();
  if (!fmt) return { ok: false, error: "empty", sample: "", pattern: "" };

  const sample = renderFormat(fmt, moment);
  if (!sample) return { ok: false, error: "render", sample: "", pattern: "" };

  const segments = parseFormat(fmt, moment, 0);
  if (!segments.length) return { ok: false, error: "empty", sample, pattern: "" };

  // Word boundaries keep matches from landing inside a longer word. They can
  // miss on non-ASCII month/weekday names (where `\b` is ASCII-only), so fall
  // back to the unanchored form rather than emitting a pattern that can't
  // match the text the preview just rendered.
  let pattern = joinSegments(segments, true);
  if (!matches(pattern, sample)) pattern = joinSegments(segments, false);
  if (!matches(pattern, sample)) {
    return { ok: false, error: "mismatch", sample, pattern };
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    return { ok: false, error: "too-long", sample, pattern };
  }
  if (typeof validateRegex === "function") {
    let allowed = true;
    try {
      allowed = validateRegex(pattern) !== false;
    } catch (_) {
      allowed = true;
    }
    if (!allowed) return { ok: false, error: "blocked", sample, pattern };
  }
  return { ok: true, error: null, sample, pattern };
}
