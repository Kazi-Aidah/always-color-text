// Phase 1: Link Identical Matchers
// Shared helpers for detecting entries that share an identical matcher and
// propagating style edits across them (write-through, engine untouched).

// Stable identity for "these two matchers are the same".
export function matcherKey(m) {
  return [
    m.pattern,
    !!m.isRegex,
    m.flags || '',
    m.matchType || 'contains',
  ].join('|');
}

// Collect every entry across all locations with a live reference + its location.
export function collectEntries(settings) {
  const out = [];
  const push = (entry, location) => {
    if (entry && entry.uid) out.push({ entry, location });
  };
  (settings.wordEntries || []).forEach((e) => push(e, 'Main list'));
  (settings.wordEntryGroups || []).forEach((g) =>
    (g.entries || []).forEach((e) => push(e, 'Group: ' + (g.name || g.uid)))
  );
  (settings.textBgColoringEntries || []).forEach((e) =>
    push(e, 'Text & Background')
  );
  return out;
}

// Other entries (excluding currentUid) that share the given matcher key.
export function findEntriesWithMatcherKey(settings, key, currentUid) {
  return collectEntries(settings).filter(
    ({ entry }) => entry.uid !== currentUid && matcherKey(entry) === key
  );
}

// Style fields that propagate when linking identical matchers.
// Matcher-identity fields (pattern/isRegex/flags/matchType) are deliberately
// excluded: entries already share them by key.
export const LINKED_STYLE_FIELDS = [
  'styleType',
  'markTarget',
  'color',
  'textColor',
  'backgroundColor',
  'backgroundOpacity',
  'highlightBorderRadius',
  'highlightHorizontalPadding',
  'highlightVerticalPadding',
  'enableBorderThickness',
  'borderStyle',
  'borderLineStyle',
  'borderOpacity',
  'borderThickness',
  'inclusionRules',
  'exclusionRules',
  'customCss',
];

// Write the source entry's style fields into every target entry in place.
export function propagateStyle(sourceEntry, targets) {
  for (const { entry } of targets) {
    for (const k of LINKED_STYLE_FIELDS) {
      if (k in sourceEntry) {
        entry[k] = sourceEntry[k];
      }
    }
  }
}
