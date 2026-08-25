import { describe, it, expect } from 'vitest';
import {
  matcherKey,
  collectEntries,
  findEntriesWithMatcherKey,
  propagateStyle,
} from './matcherLinker.js';

function makeSettings() {
  return {
    wordEntries: [
      {
        uid: 'e1',
        pattern: '\\b\\d+\\b',
        isRegex: true,
        flags: '',
        matchType: 'contains',
        textColor: '#ff0000',
        styleType: 'both',
      },
      {
        uid: 'e2',
        pattern: 'TODO',
        isRegex: false,
        flags: '',
        matchType: 'contains',
        textColor: '#00ff00',
        styleType: 'text',
      },
    ],
    wordEntryGroups: [
      {
        name: 'notes',
        uid: 'g1',
        entries: [
          {
            uid: 'g1e',
            pattern: '\\b\\d+\\b', // identical matcher to e1
            isRegex: true,
            flags: '',
            matchType: 'contains',
            textColor: '#ff0000',
            styleType: 'both',
          },
          {
            uid: 'g2e',
            pattern: 'FIXME',
            isRegex: false,
            flags: '',
            matchType: 'contains',
            textColor: '#0000ff',
            styleType: 'text',
          },
        ],
      },
    ],
    textBgColoringEntries: [],
  };
}

describe('matcherLinker', () => {
  it('matcherKey is identical for same word/regex and differs otherwise', () => {
    const a = matcherKey({ pattern: 'cat', isRegex: false, flags: '', matchType: 'contains' });
    const b = matcherKey({ pattern: 'cat', isRegex: false, flags: '', matchType: 'contains' });
    const c = matcherKey({ pattern: 'cat', isRegex: true, flags: '', matchType: 'contains' });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it('collectEntries spans main list, groups and textBg', () => {
    const all = collectEntries(makeSettings());
    expect(all.length).toBe(4);
    const locations = all.map((x) => x.location);
    expect(locations).toContain('Main list');
    expect(locations).toContain('Group: notes');
  });

  it('findEntriesWithMatcherKey finds cross-location duplicates excluding self', () => {
    const s = makeSettings();
    const key = matcherKey({ pattern: '\\b\\d+\\b', isRegex: true, flags: '', matchType: 'contains' });
    const found = findEntriesWithMatcherKey(s, key, 'e1');
    expect(found.length).toBe(1);
    expect(found[0].entry.uid).toBe('g1e');
    expect(found[0].location).toBe('Group: notes');
  });

  it('propagateStyle writes the source style into every target (write-through)', () => {
    const s = makeSettings();
    const source = s.wordEntries[0]; // e1
    const key = matcherKey({
      pattern: source.pattern,
      isRegex: source.isRegex,
      flags: source.flags,
      matchType: source.matchType,
    });
    const others = findEntriesWithMatcherKey(s, key, source.uid);
    source.textColor = '#abcdef';
    source.styleType = 'text';
    propagateStyle(source, others);
    // The linked entry (g1e) reflects the change without touching engine output.
    expect(s.wordEntryGroups[0].entries[0].textColor).toBe('#abcdef');
    expect(s.wordEntryGroups[0].entries[0].styleType).toBe('text');
    // Unrelated entries are untouched.
    expect(s.wordEntries[1].textColor).toBe('#00ff00');
  });
});
