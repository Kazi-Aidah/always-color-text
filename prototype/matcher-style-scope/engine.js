'use strict';
/*
 * Prototype: Matcher / Style / Scope / Rule model for Always Color Text.
 *
 * This is a dependency-free demonstration of the *reference-based reuse* idea.
 * It does NOT touch the real plugin. It exists to make the architecture
 * concrete and testable before any integration work.
 *
 * Concepts
 * --------
 * Matcher : what content matches (pattern + isRegex + flags + matchType)
 * Style   : reusable visual definition (color/border/opacity/...)
 * Scope   : where + which rendering modes a rule applies
 * Rule    : Matcher x Style x Scope connection (the actual applied unit)
 *
 * An existing entry may stay self-contained, OR carry `matcherRef` /
 * `styleRef` / `scopeRef` into shared definitions. Editing a shared def
 * propagates to every referencing entry automatically -- no per-entry loop,
 * no "update the other n?" modal needed for new workflows.
 */

/** Stable identity for "these two matchers are the same". */
function matcherKey(m) {
  return [
    m.pattern,
    !!m.isRegex,
    m.flags || '',
    m.matchType || 'contains',
  ].join('|');
}

/** Flatten the existing mixed model into a single list of entries. */
function collectEntries(model) {
  const out = [];
  (model.wordEntries || []).forEach((e) =>
    out.push({ ...e, _uid: e.uid, _location: 'Main list' })
  );
  (model.wordEntryGroups || []).forEach((g) =>
    (g.entries || []).forEach((e) =>
      out.push({
        ...e,
        _uid: e.uid,
        _location: 'Group: ' + g.name,
        _groupName: g.name,
      })
    )
  );
  return out;
}

/**
 * Find groups of entries that share an identical matcher.
 * This is what would drive the (default-off) "consolidate duplicates" modal
 * during migration, and is the precise definition of "identical matcher".
 */
function findDuplicateMatchers(model) {
  const entries = collectEntries(model);
  const groups = new Map();
  for (const e of entries) {
    const key = matcherKey(e);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }
  const dups = [];
  for (const [key, list] of groups) {
    if (list.length > 1) {
      dups.push({
        key,
        pattern: list[0].pattern,
        isRegex: list[0].isRegex,
        count: list.length,
        entries: list.map((e) => ({
          uid: e._uid,
          location: e._location,
          pattern: e.pattern,
        })),
      });
    }
  }
  return dups;
}

/**
 * Build the human-facing text for the consolidation modal, listing exactly
 * which entries would be linked (addresses the "show me which n" requirement).
 */
function consolidationMessage(dup) {
  const lines = dup.entries.map(
    (e) => `  - "${e.pattern}" (${e.location})`
  );
  return (
    `Found ${dup.count} entries with the identical matcher ` +
    `"${dup.pattern}".\nLink them to one shared definition so they stay in ` +
    `sync?\n\n` +
    lines.join('\n')
  );
}

/**
 * Turn a duplicate group into shared definitions + references.
 * Returns new model arrays plus the created defs (immutably).
 */
function consolidateGroup(model, dup, opts = {}) {
  const sample = collectEntries(model).find((e) => e._uid === dup.entries[0].uid);

  const matcherDef = {
    uid: 'matcher_' + dup.key.replace(/[^a-z0-9]/gi, '_'),
    name: opts.matcherName || 'Matcher: ' + dup.pattern,
    pattern: dup.pattern,
    isRegex: dup.isRegex,
    flags: sample.flags || '',
    matchType: sample.matchType || 'contains',
  };

  const styleDef = {
    uid: 'style_' + dup.key.replace(/[^a-z0-9]/gi, '_'),
    name: opts.styleName || 'Style: ' + dup.pattern,
    textColor: sample.textColor,
    backgroundColor: sample.backgroundColor || null,
    styleType: sample.styleType || 'text',
    borderStyle: sample.borderStyle || null,
    borderThickness: sample.borderThickness || 1,
    borderRadius: sample.highlightBorderRadius || 0,
    opacity: sample.backgroundOpacity || 0,
    markTarget: sample.markTarget || 'text',
  };

  const targetUids = new Set(dup.entries.map((e) => e.uid));

  const rewrite = (e) =>
    targetUids.has(e.uid)
      ? { ...e, matcherRef: matcherDef.uid, styleRef: styleDef.uid }
      : e;

  const wordEntries = (model.wordEntries || []).map(rewrite);
  const wordEntryGroups = (model.wordEntryGroups || []).map((g) => ({
    ...g,
    entries: (g.entries || []).map(rewrite),
  }));

  return {
    model: { ...model, wordEntries, wordEntryGroups },
    matcherDef,
    styleDef,
  };
}

/** Build rules from entries that reference shared defs. */
function buildRules(model) {
  return collectEntries(model)
    .filter((e) => e.matcherRef && e.styleRef)
    .map((e) => ({
      uid: 'rule_' + e._uid,
      matcherRef: e.matcherRef,
      styleRef: e.styleRef,
      scopeRef: e.scopeRef || null,
    }));
}

/** Resolve the effective matcher+style for one entry (by its rule). */
function resolveStyling(rules, matcherDefs, styleDefs, entryUid) {
  const rule = rules.find((r) => r.uid === 'rule_' + entryUid);
  if (!rule) return null;
  return {
    matcher: matcherDefs.find((m) => m.uid === rule.matcherRef),
    style: styleDefs.find((s) => s.uid === rule.styleRef),
  };
}

/**
 * THE KEY MECHANIC: update a shared style def once, and every referencing
 * entry reflects it. No loop over entries, no modal -- propagation is
 * structural because rules point at the def by id.
 */
function applyStyleUpdate(styleDefs, styleUid, patch) {
  return styleDefs.map((s) => (s.uid === styleUid ? { ...s, ...patch } : s));
}

/** Class-based CSS: one block per style def, reused via class. */
function generateCss(styleDefs) {
  const blocks = styleDefs.map((s) => {
    const decls = [];
    if (s.textColor) decls.push(`  color: ${s.textColor};`);
    if (s.backgroundColor)
      decls.push(`  background-color: ${s.backgroundColor};`);
    if (s.borderStyle)
      decls.push(
        `  border-bottom: ${s.borderThickness}px ${s.borderStyle} currentColor;`
      );
    return `.act-style-${s.uid} {\n${decls.join('\n')}\n}`;
  });
  return blocks.join('\n\n');
}

module.exports = {
  matcherKey,
  collectEntries,
  findDuplicateMatchers,
  consolidationMessage,
  consolidateGroup,
  buildRules,
  resolveStyling,
  applyStyleUpdate,
  generateCss,
};
