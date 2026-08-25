'use strict';
/*
 * Demo + assertions for the Matcher/Style/Scope prototype.
 * Run:  node prototype/matcher-style-scope/demo.js
 */
const assert = require('assert');
const E = require('./engine.js');

// --- A realistic-looking slice of the existing plugin model ---------------
const model = {
  wordEntries: [
    {
      uid: 'e1',
      pattern: '\\b\\d+\\b',
      isRegex: true,
      flags: '',
      matchType: 'contains',
      textColor: '#ff0000',
      backgroundColor: '#222222',
      styleType: 'both',
      borderStyle: 'bottom',
      borderThickness: 2,
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
      entries: [
        // shares the SAME matcher as e1 (the "\\b\\d+\\b" regex)
        {
          uid: 'g1',
          pattern: '\\b\\d+\\b',
          isRegex: true,
          flags: '',
          matchType: 'contains',
          textColor: '#ff0000',
          backgroundColor: '#222222',
          styleType: 'both',
          borderStyle: 'bottom',
          borderThickness: 2,
        },
        {
          uid: 'g2',
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
};

console.log('=== 1. Detect identical matchers (across everything) ===');
const dups = E.findDuplicateMatchers(model);
assert.strictEqual(dups.length, 1, 'expected exactly one duplicate group');
assert.strictEqual(dups[0].count, 2, 'expected 2 entries sharing \\b\\d+\\b');
console.log(E.consolidationMessage(dups[0]));
console.log('(detector found', dups[0].count, 'entries with matcher', dups[0].pattern + ')\n');

console.log('=== 2. Consolidate into shared defs (the modal "Link" action) ===');
const { model: linked, matcherDef, styleDef } = E.consolidateGroup(model, dups[0]);
const rules = E.buildRules(linked);
assert.strictEqual(rules.length, 2, 'two entries now reference the shared defs');
console.log('Created matcherDef:', matcherDef.uid, '| styleDef:', styleDef.uid);
console.log('Rules:', rules.map((r) => r.uid).join(', '), '\n');

console.log('=== 3. THE KEY MECHANIC: update the shared style ONCE ===');
console.log('Before: e1 color =', E.resolveStyling(rules, [matcherDef], [styleDef], 'e1').style.textColor);
console.log('Before: g1 color =', E.resolveStyling(rules, [matcherDef], [styleDef], 'g1').style.textColor);

const updatedStyles = E.applyStyleUpdate([styleDef], styleDef.uid, { textColor: '#abcdef' });

// Note: we never touched e1 or g1. Propagation is structural.
const afterE1 = E.resolveStyling(rules, [matcherDef], updatedStyles, 'e1').style.textColor;
const afterG1 = E.resolveStyling(rules, [matcherDef], updatedStyles, 'g1').style.textColor;
assert.strictEqual(afterE1, '#abcdef');
assert.strictEqual(afterG1, '#abcdef');
console.log('After one update -> e1 color =', afterE1, '| g1 color =', afterG1);
console.log('Both changed from a single edit. No per-entry loop, no modal.\n');

console.log('=== 4. Class-based CSS output (one block per shared style) ===');
const css = E.generateCss(updatedStyles);
console.log(css);
assert.ok(css.includes('.act-style-' + styleDef.uid));
console.log('\n(2 entries -> 1 CSS rule, reused via class)\n');

console.log('ALL ASSERTIONS PASSED');
