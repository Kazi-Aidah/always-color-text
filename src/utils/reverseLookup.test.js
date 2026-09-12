import { describe, it, expect } from 'vitest';
import {
  findColoringEntries,
  matchLiteralEntry,
  matchRegexDirect,
  matchRegexContext,
  matchTargetElementEntry,
  buildSelectionContext,
} from './reverseLookup.js';

function settingsWith(entries, extra = {}) {
  return Object.assign(
    {
      wordEntries: entries,
      wordEntryGroups: [],
      caseSensitive: false,
      partialMatch: false,
      matchType: 'exact',
      enableRegexSupport: true,
    },
    extra,
  );
}

describe('reverseLookup literal', () => {
  it('matches exact literal and groupedPatterns', () => {
    const s = settingsWith([
      { uid: 'a', pattern: 'hello', isRegex: false, matchType: 'exact' },
    ]);
    const c = findColoringEntries(s, 'hello', {});
    expect(c.length).toBe(1);
    expect(c[0].kind).toBe('literal-exact');
  });

  it('does not match a different literal', () => {
    const s = settingsWith([
      { uid: 'a', pattern: 'hello', isRegex: false, matchType: 'exact' },
    ]);
    expect(findColoringEntries(s, 'world', {}).length).toBe(0);
  });

  it('matches contains/startswith/endswith', () => {
    expect(
      matchLiteralEntry({ pattern: 'ell', isRegex: false, matchType: 'contains' }, 'hello', settingsWith([])),
    ).toBeTruthy();
    expect(
      matchLiteralEntry({ pattern: 'he', isRegex: false, matchType: 'startswith' }, 'hello', settingsWith([])),
    ).toBeTruthy();
    expect(
      matchLiteralEntry({ pattern: 'lo', isRegex: false, matchType: 'endswith' }, 'hello', settingsWith([])),
    ).toBeTruthy();
  });
});

describe('reverseLookup regex direct', () => {
  it('finds a regex entry whose pattern tests the selection', () => {
    const s = settingsWith([
      { uid: 'r1', pattern: '\\b\\d+\\b', isRegex: true, flags: '' },
    ]);
    const c = findColoringEntries(s, '123', {});
    expect(c.length).toBe(1);
    expect(c[0].kind).toBe('regex-direct');
    expect(c[0].entry.uid).toBe('r1');
  });
});

describe('reverseLookup regex contextual', () => {
  it('finds highlight regex via surrounding == markers', () => {
    const s = settingsWith([
      { uid: 'hl', pattern: '==[\\s\\S]*?==', isRegex: true, flags: '' },
    ]);
    // Bare inner text does NOT match directly...
    expect(matchRegexDirect(s.wordEntries[0], 'foo', s, null)).toBeNull();
    // ...but is contained in the line match.
    const line = '==foo==';
    const c = findColoringEntries(s, 'foo', {
      lineText: line,
      selStartInLine: 2,
      selEndInLine: 5,
      contextText: line,
      selStart: 2,
      selEnd: 5,
    });
    expect(c.length).toBe(1);
    expect(c[0].kind).toBe('regex-context');
  });

  it('finds heading regex via line context', () => {
    const s = settingsWith([
      { uid: 'h', pattern: '^\\s*#{1,6}\\s+.*$', isRegex: true, flags: 'm' },
    ]);
    expect(matchRegexDirect(s.wordEntries[0], 'My Heading', s, null)).toBeNull();
    const line = '# My Heading';
    const c = findColoringEntries(s, 'My Heading', {
      lineText: line,
      selStartInLine: 2,
      selEndInLine: 12,
      contextText: line,
      selStart: 2,
      selEnd: 12,
    });
    expect(c.length).toBe(1);
    expect(c[0].kind).toBe('regex-context');
  });

  it('finds bold legacy regex via line context', () => {
    const s = settingsWith([
      { uid: 'b', pattern: '(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1', isRegex: true, flags: '' },
    ]);
    const line = '**bold**';
    const c = findColoringEntries(s, 'bold', {
      lineText: line,
      selStartInLine: 2,
      selEndInLine: 6,
      contextText: line,
      selStart: 2,
      selEnd: 6,
    });
    expect(c.length).toBe(1);
    expect(c[0].kind).toBe('regex-context');
  });

  it('matchRegexContext helper reports containment', () => {
    const entry = { pattern: '==[\\s\\S]*?==', isRegex: true, flags: '' };
    const r = matchRegexContext(entry, { contextText: 'a ==foo== b', selStart: 4, selEnd: 7 }, null);
    expect(r && r.kind).toBe('regex-context');
    const miss = matchRegexContext(entry, { contextText: 'plain foo here', selStart: 6, selEnd: 9 }, null);
    expect(miss).toBeNull();
  });
});

describe('reverseLookup markdown elements', () => {
  it('detects strong via ** wrappers', () => {
    const e = { uid: 's', pattern: 'Targets .cm-strong and strong', isRegex: false, targetElement: 'strong' };
    const m = matchTargetElementEntry(e, { selectedText: 'bold', lineText: '**bold**', selStartInLine: 2, selEndInLine: 6 });
    expect(m && m.kind).toBe('markdown');
  });

  it('detects heading via # prefix', () => {
    const e = { uid: 'h', pattern: 'Targets heading', isRegex: false, targetElement: 'heading' };
    const m = matchTargetElementEntry(e, { selectedText: 'Title', lineText: '## Title', selStartInLine: 3, selEndInLine: 8 });
    expect(m && m.kind).toBe('markdown');
  });

  it('ignores strong when no markers present', () => {
    const e = { uid: 's', pattern: 'Targets .cm-strong and strong', isRegex: false, targetElement: 'strong' };
    const m = matchTargetElementEntry(e, { selectedText: 'plain', lineText: 'plain text', selStartInLine: 0, selEndInLine: 5 });
    expect(m).toBeNull();
  });

  it('findColoringEntries prefers literal-exact over regex-context', () => {
    const s = settingsWith([
      { uid: 'hl', pattern: '==[\\s\\S]*?==', isRegex: true, flags: '' },
      { uid: 'lit', pattern: 'foo', isRegex: false, matchType: 'exact' },
    ]);
    const c = findColoringEntries(s, 'foo', {
      lineText: '==foo==',
      selStartInLine: 2,
      selEndInLine: 5,
      contextText: '==foo==',
      selStart: 2,
      selEnd: 5,
    });
    expect(c.length).toBe(2);
    expect(c[0].entry.uid).toBe('lit');
  });
});

describe('buildSelectionContext', () => {
  it('derives single-line offsets', () => {
    const editor = {
      getSelection: () => 'foo',
      getCursor: (which) => (which === 'from' ? { line: 0, ch: 2 } : { line: 0, ch: 5 }),
      getLine: () => '==foo==',
    };
    const ctx = buildSelectionContext(editor, null);
    expect(ctx.lineText).toBe('==foo==');
    expect(ctx.selStartInLine).toBe(2);
    expect(ctx.selEndInLine).toBe(5);
    expect(ctx.contextText).toBe('==foo==');
  });

  it('is defensive with missing editor', () => {
    const ctx = buildSelectionContext(null, null);
    expect(ctx.selectedText).toBe('');
    expect(ctx.lineText).toBeNull();
  });
});
