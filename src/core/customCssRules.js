/**
 * customCssRules.js — pure helpers extending the "CSS Declarations" editor with:
 *   • `/* … *\/` comments (stripped before validation/merging)
 *   • `&`-rooted pseudo-selector blocks (`&:hover`, `&:focus`, `&::after`, …)
 *
 * Why blocks are handled separately from declarations:
 *   Declarations are merged into inline `style` attributes, and an inline
 *   `!important` declaration always beats a stylesheet `!important`
 *   declaration. Pseudo-states can only live in a stylesheet, so instead of
 *   fighting the cascade, block values are routed through a CSS custom
 *   property:
 *
 *     inline:  color: var(--act-hov-e12-color, #333) !important;
 *              --act-hov-e12-_s: 1;
 *     sheet:   [style*="--act-hov-e12-"]:hover {
 *                --act-hov-e12-color: #f00;   ← consumed by the inline var()
 *                color: #f00 !important;      ← for elements without inline color
 *              }
 *
 *   The marker `--act-hov-<scope>-_s` in the style attribute scopes the rules
 *   to exactly the elements that received that scope's custom CSS. Scopes are
 *   `e<entry uid>` / `g<group uid>`; the preview modal uses `preview`.
 *
 *   Pseudo-*element* blocks (`::before`, `::after`, …) style generated boxes,
 *   which never carry inline declarations, so they emit direct rules only.
 *
 * No Obsidian imports — unit testable. The `element.style` helpers only touch
 * the element they are handed.
 */

/** Blocklist checked against declaration *values* (defense in depth). */
export const DANGEROUS_PATTERNS = [
  'url(',
  'expression(',
  'javascript:',
  'vbscript:',
  'data:',
  '@import',
  '@charset',
  '@namespace',
  '<',
  '>',
  '{',
  '}',
  ';',
];

/**
 * Remove `/* … *\/` comments. Comments inside quoted strings are left alone.
 * An unterminated comment swallows the rest of the input (CSS spec behaviour).
 * Comment characters become spaces (newlines preserved) so line structure and
 * declaration splitting stay intact; `sink` (optional array) collects the raw
 * comment texts so callers can re-attach them when rebuilding CSS.
 */
export function stripCssComments(css, sink) {
  if (!css || typeof css !== 'string') return '';
  let out = '';
  let i = 0;
  const n = css.length;
  while (i < n) {
    const ch = css[i];
    // Quoted strings: copy verbatim (a `/*` inside a string is not a comment)
    if (ch === '"' || ch === "'") {
      const quote = ch;
      out += ch;
      i++;
      while (i < n) {
        const c = css[i];
        if (c === '\\' && i + 1 < n) {
          out += c + css[i + 1];
          i += 2;
          continue;
        }
        out += c;
        i++;
        if (c === quote) break;
      }
      continue;
    }
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      if (sink) sink.push(css.slice(i, stop));
      out += css.slice(i, stop).replace(/[^\n]/g, ' ');
      i = stop;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/**
 * Split raw custom CSS into top-level declarations and `&`-rooted blocks.
 *
 * @returns {{ decls: string, blocks: Array<{selector:string, body:string, raw:string}>,
 *             errors: string[], comments: string[] }}
 *   `decls`  — comment-free declaration text (no braces)
 *   `blocks` — one entry per `selector { body }`; `raw` is the trimmed source
 *              text for lossless re-assembly
 */
export function splitCustomCss(css) {
  const comments = [];
  const src = stripCssComments(css, comments);
  const blocks = [];
  const errors = [];
  let declsOut = '';
  let pending = '';
  let i = 0;
  const n = src.length;

  // pos points at an opening quote; returns the index just past the closing
  // quote (or n for an unterminated string). Quoted braces are not structure.
  const readString = (pos) => {
    const quote = src[pos];
    let j = pos + 1;
    while (j < n) {
      if (src[j] === '\\') {
        j += 2;
        continue;
      }
      if (src[j] === quote) return j + 1;
      j++;
    }
    return n;
  };

  while (i < n) {
    const ch = src[i];
    if (ch === '"' || ch === "'") {
      const end = readString(i);
      pending += src.slice(i, end);
      i = end;
      continue;
    }
    if (ch === '{') {
      // Everything after the last declaration terminator starts the selector.
      const cut = Math.max(pending.lastIndexOf(';'), pending.lastIndexOf('}'));
      const before = pending.slice(0, cut + 1);
      const selector = pending.slice(cut + 1).trim();
      declsOut += before;

      let depth = 1;
      let end = -1;
      let nested = false;
      for (let j = i + 1; j < n; j++) {
        const c = src[j];
        if (c === '"' || c === "'") {
          j = readString(j) - 1; // for-loop j++ lands past the closing quote
        } else if (c === '{') {
          depth++;
          nested = true;
        } else if (c === '}') {
          depth--;
          if (depth === 0) {
            end = j;
            break;
          }
        }
      }
      if (end === -1) {
        errors.push(`Unclosed "{" block for selector "${selector}"`);
        pending = '';
        break;
      }
      if (nested) errors.push(`Nested blocks are not supported: "${selector}"`);
      const body = src.slice(i + 1, end);
      blocks.push({
        selector,
        body: body.trim(),
        raw: src.slice(cut + 1, end + 1).trim(),
      });
      pending = '';
      i = end + 1;
      continue;
    }
    if (ch === '}') {
      errors.push('Unexpected "}" outside of a block — check for mismatched braces');
      i++;
      continue;
    }
    pending += ch;
    i++;
  }
  declsOut += pending;
  return { decls: declsOut, blocks, errors, comments };
}

/**
 * Allowed block selectors: `&` rooted, pseudo-classes/elements only.
 * Rejects arbitrary selectors, combinators, attribute/class/id selectors,
 * nesting (`:has`/`:is`/`:not`/`:where` — they smuggle selectors) and `@`-rules.
 * Comma-separated lists of safe selectors are allowed.
 * Functional pseudos are limited to nth-child/nth-of-type/dir()/lang() with inert arguments.
 */
const SAFE_BLOCK_SELECTOR_RE =
  /^&(?:::?(?:hover|focus|focus-visible|focus-within|active|visited|target|any-link|link|defined|disabled|enabled|checked|indeterminate|required|optional|valid|invalid|in-range|out-of-range|read-only|read-write|placeholder-shown|default|playing|paused|stuck|user-valid|user-invalid|current|past|future|local|remote|scope|root|empty|first-child|last-child|only-child|first-of-type|last-of-type|only-of-type|before|after|first-line|first-letter|selection|backdrop|marker|placeholder|file-selector-button|cue|grammar-error|spelling-error|autofill|open|closed)|::?(?:nth-(?:last-)?(?:child|of-type|col)|dir|lang)\(\s*[a-zA-Z0-9+\- ]*\))+$/;

export function isSafeBlockSelector(sel) {
  if (typeof sel !== 'string') return false;
  const s = sel.trim();
  if (!s || !s.startsWith('&')) return false;
  // nth-child style arguments never contain commas, so a plain split is safe.
  return s.split(',').map((p) => p.trim()).every((p) => SAFE_BLOCK_SELECTOR_RE.test(p));
}

/** True when the block selector targets a pseudo-element (`::before`, legacy `:after`, …). */
export function hasPseudoElement(sel) {
  if (typeof sel !== 'string') return false;
  return sel.includes('::') || /:(?:before|after|first-line|first-letter)(?![a-z-])/.test(sel);
}

/**
 * Validate + normalize a declaration string (mirrors the plugin sanitizer):
 * splits on `;`, requires a `/^[a-z\-]+$/` property, strips `!important`
 * (callers re-add it), drops dangerous/empty values.
 */
export function sanitizeDeclString(input) {
  if (!input || typeof input !== 'string') return '';
  const normalized = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const parts = normalized
    .split(';')
    .map((s) => s.replace(/\n/g, ' ').trim())
    .filter((s) => s.length > 0);
  const out = [];
  for (const p of parts) {
    const idx = p.indexOf(':');
    if (idx === -1) continue;
    const prop = p.slice(0, idx).trim().toLowerCase();
    let val = p.slice(idx + 1).trim();
    if (!/^[a-z\-]+$/.test(prop)) continue;
    val = val.replace(/!important/gi, '').trim();
    const valLower = val.toLowerCase();
    if (
      valLower.includes('url(') ||
      valLower.includes('expression(') ||
      valLower.includes('javascript:') ||
      valLower.includes('data:') ||
      valLower.includes('vbscript:') ||
      valLower.includes('@import') ||
      valLower.includes('@charset') ||
      valLower.includes('@namespace') ||
      val.includes('<') ||
      val.includes('>') ||
      val.includes('{') ||
      val.includes('}') ||
      val.includes(';')
    ) {
      continue;
    }
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(val)) continue;
    if (val.length === 0) continue;
    out.push(`${prop}: ${val}`);
  }
  return out.join('; ') + (out.length > 0 ? ';' : '');
}

/** Parse `prop: value; …` into `[{ prop, val }]` (prop lowercased, no `!important` stripping). */
export function parseDeclPairs(str) {
  if (!str || typeof str !== 'string') return [];
  const out = [];
  for (const p of str.split(';')) {
    const s = p.trim();
    if (!s) continue;
    const idx = s.indexOf(':');
    if (idx === -1) continue;
    out.push({
      prop: s.slice(0, idx).trim().toLowerCase(),
      val: s.slice(idx + 1).trim(),
    });
  }
  return out;
}

/**
 * Properties declared in pseudo-*class* blocks (`:hover`, `:focus`, …).
 * These must be var-routed on elements. Pseudo-*element* blocks are excluded —
 * they style generated boxes that never carry inline declarations.
 */
export function blockDeclProperties(blocks) {
  const props = new Set();
  if (!Array.isArray(blocks)) return props;
  for (const b of blocks) {
    if (!b || !isSafeBlockSelector(b.selector)) continue;
    if (hasPseudoElement(b.selector)) continue;
    for (const { prop } of parseDeclPairs(sanitizeDeclString(b.body))) {
      props.add(prop);
    }
  }
  return props;
}

/* ── Scope naming ─────────────────────────────────────────────── */

/** Sanitize a scope id (`e123`, `g456`, `preview`) into a token; null if unusable. */
export function scopeToken(scopeId) {
  if (scopeId === null || scopeId === undefined) return null;
  const t = String(scopeId).replace(/[^A-Za-z0-9_-]/g, '_');
  return t.length ? t : null;
}

/** Marker custom property proving "this element carries scope TOK". */
export function scopeMarkerProp(tok) {
  return `--act-hov-${tok}-_s`;
}

/** Custom property carrying a block's value for `prop` under scope TOK. */
export function scopeVarName(tok, prop) {
  return `--act-hov-${tok}-${prop}`;
}

/** Attribute selector matching elements whose style attribute carries TOK. */
export function scopeMarkerSelector(tok) {
  return `[style*="--act-hov-${tok}-"]`;
}

/* ── Style-string (inline attribute) machinery ────────────────── */

/**
 * Post-process a merged inline style string so `&`-blocks of `rawCss` can
 * take effect under `scopeId`:
 *   • wraps properties touched by this scope's pseudo-class blocks in
 *     `var(--act-hov-<tok>-<prop>, <base>)` (keeping `!important`),
 *   • preserves an *earlier* scope's var when this scope only overrides the
 *     base value with a plain declaration (group-then-entry application),
 *   • appends the scope marker declaration.
 *
 * @param styleStr merged style string (base + custom declarations)
 * @param rawCss   raw custom CSS the scope contributed (for block parsing)
 * @param scopeId  e.g. `e123` / `g456`; null → returned unchanged
 * @param prevStr  style string *before* this scope merged in (to recover an
 *                 earlier scope's var name for a property we are overriding)
 */
export function applyScopeToStyleString(styleStr, rawCss, scopeId, prevStr) {
  try {
    const tok = scopeToken(scopeId);
    if (!tok) return styleStr;
    const split = splitCustomCss(rawCss);
    // Mirror the merge: only what the sanitizer keeps counts as "declared".
    const declared = new Set(
      parseDeclPairs(sanitizeDeclString(split.decls)).map((p) => p.prop),
    );
    const touched = blockDeclProperties(split.blocks);
    // Nothing to do: no state rules, and no declarations that could hide an
    // earlier scope's var behind an overridden base value.
    if (!split.blocks.length && declared.size === 0) return styleStr;

    const prevParts = String(prevStr || '').split(';');
    const prevVarFor = (prop) => {
      for (const p of prevParts) {
        const s = p.trim();
        if (!s) continue;
        const idx = s.indexOf(':');
        if (idx === -1) continue;
        if (s.slice(0, idx).trim().toLowerCase() !== prop) continue;
        const m = s.slice(idx + 1).trim().match(/^var\((--act-hov-[^,)]+)\s*,/);
        if (m) return m[1];
      }
      return null;
    };

    const parts = String(styleStr || '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    const out = [];
    for (const p of parts) {
      const idx = p.indexOf(':');
      if (idx === -1) {
        out.push(p);
        continue;
      }
      const prop = p.slice(0, idx).trim().toLowerCase();
      const rawVal = p.slice(idx + 1).trim();
      const hasImp = /\s*!important\s*$/i.test(rawVal);
      const val = rawVal.replace(/\s*!important\s*$/i, '').trim();
      const imp = hasImp ? ' !important' : '';

      if (touched.has(prop)) {
        // This scope's hover/state var goes outermost; the previous value
        // (possibly another scope's var) becomes the fallback. Values already
        // routed through this scope's var are left as-is (no double wrap).
        const vn = scopeVarName(tok, prop);
        if (val.includes(`var(${vn},`)) {
          out.push(p);
          continue;
        }
        out.push(`${prop}: var(${vn}, ${val})${imp}`);
        continue;
      }
      if (declared.has(prop)) {
        // We override the base value; keep an earlier scope's hover chain alive
        // by swapping its fallback to our (new) base value.
        const outer = prevVarFor(prop);
        if (outer && !val.includes(`var(${outer}`)) {
          out.push(`${prop}: var(${outer}, ${val})${imp}`);
          continue;
        }
      }
      out.push(p);
    }

    // The marker only matters when this scope has state rules to match.
    if (split.blocks.length) {
      const marker = scopeMarkerProp(tok);
      if (!out.some((p) => p.startsWith(`${marker}:`))) out.push(`${marker}: 1`);
    }
    return out.join('; ');
  } catch (_) {
    return styleStr;
  }
}

/**
 * DOM core: apply `rawCss` (declarations + block scoping) to
 * `element.style`. Mirrors applyScopeToStyleString's logic for elements.
 * Returns `{ declCount, blockCount }` so callers can keep their
 * "nothing to apply" early-outs/logging.
 */
export function applyCustomCssToElementCore(element, rawCss, scopeId) {
  const split = splitCustomCss(rawCss);
  const pairs = parseDeclPairs(sanitizeDeclString(split.decls));
  const touched = blockDeclProperties(split.blocks);
  const tok = scopeToken(scopeId);
  const hasBlocks = split.blocks.length > 0;

  const setP = (prop, value) => {
    try {
      element.style.setProperty(prop, value, 'important');
    } catch (_) {
      try {
        element.style[prop] = value;
      } catch (__) {}
    }
  };
  const getP = (prop) => {
    try {
      return element.style.getPropertyValue(prop) || '';
    } catch (_) {
      return '';
    }
  };

  // Marker first: it must survive in the style attribute even when the block
  // only styles pseudo-elements (which don't consume inline declarations).
  if (hasBlocks && tok) setP(scopeMarkerProp(tok), '1');

  for (const { prop, val } of pairs) {
    let value = val;
    if (tok && touched.has(prop)) {
      value = `var(${scopeVarName(tok, prop)}, ${val})`;
    } else {
      // Keep an earlier scope's hover chain, swap in our new base value.
      const m = getP(prop).match(/^var\((--act-hov-[^,)]+)\s*,/);
      if (m) value = `var(${m[1]}, ${val})`;
    }
    setP(prop, value);
  }

  if (tok) {
    for (const prop of touched) {
      if (pairs.some((p) => p.prop === prop)) continue; // already wrapped above
      const cur = getP(prop);
      if (!cur || cur.includes(`var(${scopeVarName(tok, prop)},`)) continue;
      // Property came from base/derived styling — route it through the var too.
      setP(prop, `var(${scopeVarName(tok, prop)}, ${cur})`);
    }
  }

  return { declCount: pairs.length, blockCount: split.blocks.length };
}

/* ── Stylesheet emission ──────────────────────────────────────── */

/**
 * Marker-scoped rules for elements carrying inline styles (Live Preview text
 * spans, reading-mode spans, modal preview). Each block emits:
 *   [style*="--act-hov-TOK-"]:hover { --act-hov-TOK-prop: V; prop: V !important; }
 * Pseudo-element blocks emit the direct half only (no var routing).
 */
export function buildScopedBlockRules(css, scopeId) {
  try {
    const tok = scopeToken(scopeId);
    if (!tok) return '';
    const split = splitCustomCss(css);
    if (!split.blocks.length) return '';
    const markerSel = scopeMarkerSelector(tok);
    let out = '';
    for (const b of split.blocks) {
      if (!isSafeBlockSelector(b.selector)) continue;
      const pairs = parseDeclPairs(sanitizeDeclString(b.body));
      if (!pairs.length) continue;
      const sels = b.selector
        .split(',')
        .map((s) => s.trim().replace(/^&/, ''))
        .map((rest) => markerSel + rest);
      const chunks = [];
      if (!hasPseudoElement(b.selector)) {
        chunks.push(
          pairs.map(({ prop, val }) => `${scopeVarName(tok, prop)}: ${val}`).join('; '),
        );
      }
      chunks.push(
        pairs.map(({ prop, val }) => `${prop}: ${val} !important`).join('; '),
      );
      out += `${sels.join(', ')} { ${chunks.filter(Boolean).join('; ')} }\n`;
    }
    return out;
  } catch (_) {
    return '';
  }
}

/**
 * Direct rules with `&` rewritten to a known base selector — for paths that
 * already generate stylesheet rules (line coloring, markdown elements).
 * The `:hover` suffix raises specificity over the base rule in the same sheet,
 * so `!important` values win without any marker/var machinery.
 */
export function buildSelectorBlockRules(css, baseSelector) {
  try {
    if (!baseSelector) return '';
    const split = splitCustomCss(css);
    if (!split.blocks.length) return '';
    const bases = String(baseSelector)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!bases.length) return '';
    let out = '';
    for (const b of split.blocks) {
      if (!isSafeBlockSelector(b.selector)) continue;
      const pairs = parseDeclPairs(sanitizeDeclString(b.body));
      if (!pairs.length) continue;
      const rests = b.selector.split(',').map((s) => s.trim().replace(/^&/, ''));
      const sels = [];
      for (const base of bases) for (const rest of rests) sels.push(base + rest);
      const body = pairs.map(({ prop, val }) => `${prop}: ${val} !important`).join('; ');
      out += `${sels.join(', ')} { ${body} }\n`;
    }
    return out;
  } catch (_) {
    return '';
  }
}

/* ── Validation (modal) ───────────────────────────────────────── */

/**
 * Warnings for the Edit Custom CSS modal. Comments are ignored; blocks are
 * checked selector-first (safe `&`-rooted pseudo selectors only) and their
 * declarations get the same prop/value checks as top-level ones.
 * Message prefixes ("Invalid property name", "Dangerous value in") match the
 * historical validator.
 */
export function validateCustomCssInput(raw) {
  const warnings = [];
  if (!raw || !String(raw).trim()) return warnings;
  const split = splitCustomCss(raw);
  for (const e of split.errors) warnings.push(e);

  const checkDecls = (text, where) => {
    const parts = String(text)
      .split(';')
      .map((s) => s.replace(/\n/g, ' ').trim())
      .filter(Boolean);
    for (const part of parts) {
      const idx = part.indexOf(':');
      if (idx === -1) continue;
      const prop = part.slice(0, idx).trim().toLowerCase();
      const val = part.slice(idx + 1).trim();
      if (!/^[a-z\-]+$/.test(prop)) {
        warnings.push(
          `Invalid property name: "${prop}" (must match /^[a-z\\-]+$/)${where}`,
        );
      }
      for (const d of DANGEROUS_PATTERNS) {
        if (val.toLowerCase().includes(d)) {
          warnings.push(`Dangerous value in "${prop}": contains "${d}"${where}`);
          break;
        }
      }
    }
  };

  checkDecls(split.decls, '');
  for (const b of split.blocks) {
    if (!isSafeBlockSelector(b.selector)) {
      warnings.push(
        `Unsupported block selector: "${b.selector}" — only &-rooted pseudo selectors are allowed (e.g. &:hover, &:focus, ::before, ::after)`,
      );
      continue;
    }
    checkDecls(b.body, ` (in block "${b.selector}")`);
  }
  return warnings;
}

/* ── Re-assembly ──────────────────────────────────────────────── */

/**
 * Append a split's blocks and comments back onto rebuilt declaration text.
 * Used by color/layout sync functions so editing structured fields never
 * discards user blocks or comments.
 */
export function reassembleCustomCss(split, declsText) {
  if (!split) return declsText || '';
  let out = declsText || '';
  for (const b of split.blocks || []) out += (out ? '\n' : '') + b.raw;
  for (const c of split.comments || []) out += (out ? '\n' : '') + c;
  return out;
}
