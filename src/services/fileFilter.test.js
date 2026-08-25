import { describe, it, expect } from 'vitest';
import { evaluatePathRulesLogic, globToRegex } from './fileFilter.js';

describe('globToRegex', () => {
  it('** matches anything', () => {
    const re = globToRegex('**');
    expect(re.test('a/b/c.md')).toBe(true);
    expect(re.test('note.md')).toBe(true);
  });
  it('* matches within a segment only', () => {
    const re = globToRegex('note*');
    expect(re.test('note1.md')).toBe(true);
    expect(re.test('note/inner.md')).toBe(false);
  });
  it('? matches a single non-separator char', () => {
    const re = globToRegex('a?c');
    expect(re.test('abc')).toBe(true);
    expect(re.test('a/c')).toBe(false);
  });
  it('escapes regex metacharacters', () => {
    const re = globToRegex('a.b');
    expect(re.test('a.b')).toBe(true);
    expect(re.test('axb')).toBe(false);
  });
});

const parentFolders = (fp) => {
  const out = [];
  for (let i = 0; i < fp.length; i++) {
    if (fp[i] === '/') out.push(fp.slice(0, i));
  }
  return out;
};

const run = (filePath, rules) =>
  evaluatePathRulesLogic(
    filePath,
    { pathRules: rules },
    null,
    (p) => p,
    parentFolders,
    () => ({ kind: 'name', name: '' }),
    () => ({ fileMatch: false, folderMatch: false }),
    () => [],
    () => false,
    null,
  );

describe('path rule Pattern type (glob)', () => {
  it('** excludes everything', () => {
    const r = [{ type: 'pattern', path: '**', mode: 'exclude' }];
    expect(run('a/b/c.md', r).excluded).toBe(true);
    expect(run('note.md', r).excluded).toBe(true);
  });

  it('** (include) includes everything', () => {
    const r = [{ type: 'pattern', path: '**', mode: 'include' }];
    expect(run('a/b/c.md', r).included).toBe(true);
  });

  it('prefix glob matches by name and path', () => {
    const r = [{ type: 'pattern', path: 'secret*', mode: 'exclude' }];
    expect(run('secret-notes.md', r).excluded).toBe(true);
    expect(run('public.md', r).excluded).toBe(false);
  });

  it('folder-prefixed glob matches files under that folder', () => {
    const r = [{ type: 'pattern', path: 'proj/*', mode: 'exclude' }];
    expect(run('proj/a.md', r).excluded).toBe(true);
    expect(run('other/b.md', r).excluded).toBe(false);
  });

  it('empty pattern does not match (no vault-wide side effect)', () => {
    const r = [{ type: 'pattern', path: '', mode: 'exclude' }];
    expect(run('a/b/c.md', r).excluded).toBe(false);
    expect(run('a/b/c.md', r).included).toBe(false);
  });

  it('? matches a single non-separator char', () => {
    const r = [{ type: 'pattern', path: 'file?.md', mode: 'exclude' }];
    expect(run('file1.md', r).excluded).toBe(true);
    expect(run('file12.md', r).excluded).toBe(false);
  });
});
