// Phase 2: Link preset updates to entries.
//
// When the setting is on, editing a text style preset restyles every entry
// that uses it. Two questions have to be answered to do that safely:
//
// 1. Which entries use this preset?
//    Entries carry `presetUid` whenever a preset was applied to them (the
//    "Style" button in the entry editor, the preset picker in the highlight
//    styling modal, the preset step of the color picker). Entries created
//    before that stamp existed are matched by *style signature* instead: the
//    entry's shape must equal the preset's shape **as it was before this
//    edit**, and that signature has to be unique across all presets — two
//    built-ins sharing a shape (Default/Round) can otherwise claim each
//    other's entries. Anything already linked to another preset is skipped.
//
// 2. What part of the preset propagates?
//    Exactly what applying the preset by hand copies (EditEntryModal's
//    _applyPreset): the shape always, colors/styleType only for entries that
//    have no colors of their own, and the preset's CSS only when it actually
//    holds one. So a preset edit can reshape entries but can never wipe a
//    color or handwritten CSS an entry picked up on its own.
//
// Groups are the awkward case: the GROUP carries the stamp while its members
// carry none, and the members inherit the group's shape at compile time. So a
// group is restyled by writing the shape onto the group object itself — never
// its colortype or colors, which are the user's choice (Per-Entry in
// particular must survive a preset edit). Members that were linked
// individually are still found by the entry walk.
//
// No Obsidian imports — unit testable.

/** Shape fields every preset application copies onto an entry. */
export const PRESET_STYLE_FIELDS = [
  'styleType',
  'backgroundOpacity',
  'highlightBorderRadius',
  'cornerShape',
  'highlightHorizontalPadding',
  'highlightVerticalPadding',
  'enableBorderThickness',
  'borderStyle',
  'borderLineStyle',
  'borderOpacity',
  'borderThickness',
];

/**
 * The shape minus the colortype — what a group may inherit from a preset.
 * A group's styleType decides whether it forces colours on its members
 * (Per-Entry, Text, Highlight, Both), so it is never taken from a preset.
 */
export const PRESET_SHAPE_FIELDS = PRESET_STYLE_FIELDS.filter(
  (k) => k !== 'styleType',
);

/** Shape fields plus the preset's custom CSS (when it has one). */
export const PRESET_LINK_FIELDS = PRESET_STYLE_FIELDS.concat(['customCss']);

/**
 * Stable identity for "this entry has this preset's style".
 *
 * Shape fields an object does not define are read from `defaults` (the flat
 * global style fields on settings) so that "inherited from the globals" and
 * "explicitly set to the global value" compare equal — persistence drops
 * per-entry fields that match the globals, and a preset usually spells them
 * out. Missing fields on both sides stringify the same.
 *
 * @param {object|null|undefined} style    preset or entry
 * @param {object|null|undefined} defaults global style fields (usually settings)
 * @returns {string}
 */
export function presetSignature(style, defaults) {
  return PRESET_STYLE_FIELDS.map((k) => {
    let v = style && style[k] !== undefined ? style[k] : undefined;
    if (v === undefined && defaults && defaults[k] !== undefined) v = defaults[k];
    return JSON.stringify(v);
  }).join('|');
}

/**
 * Every entry a preset can be linked to: main list, group members and
 * text/background entries. Visited in place (the caller mutates entries).
 *
 * @param {object} settings
 * @param {(entry: object) => void} visit
 */
export function visitLinkableEntries(settings, visit) {
  if (!settings || typeof visit !== 'function') return;
  const walk = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const e of arr) if (e) visit(e);
  };
  walk(settings.wordEntries);
  walk(settings.textBgColoringEntries);
  if (Array.isArray(settings.wordEntryGroups)) {
    for (const g of settings.wordEntryGroups) if (g) walk(g.entries);
  }
}

/**
 * The matching rule shared by entries and groups: explicit `presetUid` first,
 * then the legacy style-signature match against the preset's pre-edit
 * signature — but only when that signature is unique among `allPresets`.
 *
 * Legacy matching is only safe when no *other* preset shares the old shape.
 * The edited preset is excluded (by reference, or by uid for the global
 * style object, which is a copy of the default preset), so a shape change
 * cannot make the check lenient: if Default and Round both used to share
 * the shape, neither may claim the un-stamped targets.
 *
 * @param {object} preset      preset being edited (post-edit state)
 * @param {object} settings    global style fields used for missing values
 * @param {string} prevSignature  presetSignature() captured before the edit
 * @param {object[]} allPresets   every preset/quick style that could claim targets
 * @returns {(target: object) => boolean}
 */
function presetLinkMatcher(preset, settings, prevSignature, allPresets) {
  const uid = (preset && preset.uid) || null;
  const sig = (style) => presetSignature(style, settings);
  const prevSig = typeof prevSignature === 'string' ? prevSignature : sig(preset);

  let ambiguous = false;
  if (Array.isArray(allPresets)) {
    let others = 0;
    for (const p of allPresets) {
      if (!p || p === preset) continue;
      if (uid && p.uid === uid) continue;
      if (sig(p) === prevSig) others += 1;
    }
    ambiguous = others > 0;
  }

  return (target) => {
    if (!target) return false;
    if (uid && target.presetUid === uid) return true;
    if (target.presetUid) return false; // explicitly linked to another preset
    return !ambiguous && sig(target) === prevSig;
  };
}

/**
 * Entries using `preset`: explicit `presetUid` matches first, then legacy
 * style-signature matches against the preset's pre-edit signature (only when
 * that signature is unique among `allPresets`).
 *
 * @param {object} settings
 * @param {object} preset      preset being edited (post-edit state)
 * @param {string} prevSignature  presetSignature() captured before the edit
 * @param {object[]} allPresets   every preset/quick style that could claim entries
 * @returns {object[]} live entry references
 */
export function entriesUsingPreset(settings, preset, prevSignature, allPresets) {
  const out = [];
  if (!preset) return out;
  const matches = presetLinkMatcher(preset, settings, prevSignature, allPresets);
  visitLinkableEntries(settings, (entry) => {
    if (matches(entry)) out.push(entry);
  });
  return out;
}

/**
 * Word/blacklist groups using `preset`, matched with the same rule as entries
 * — but against the GROUP's own stamp, since group members never carry one.
 *
 * @param {object} settings
 * @param {object} preset      preset being edited (post-edit state)
 * @param {string} prevSignature  presetSignature() captured before the edit
 * @param {object[]} allPresets   every preset/quick style that could claim groups
 * @returns {object[]} live group references
 */
export function groupsUsingPreset(settings, preset, prevSignature, allPresets) {
  const out = [];
  if (!settings || !preset) return out;
  if (!Array.isArray(settings.wordEntryGroups)) return out;
  const matches = presetLinkMatcher(preset, settings, prevSignature, allPresets);
  for (const group of settings.wordEntryGroups) {
    if (matches(group)) out.push(group);
  }
  return out;
}

/**
 * Copy a preset's style onto one entry, mirroring a manual preset application:
 * shape always; styleType + colors only when the entry has no colors of its
 * own; custom CSS only when the preset carries one (clearing a preset's CSS
 * must never delete CSS an entry wrote itself). Records `presetUid` so the
 * entry follows the preset from now on.
 *
 * @param {object} entry
 * @param {object} preset
 * @param {(color: any) => boolean} [isValidHexColor]
 * @returns {boolean} whether the entry changed
 */
export function applyPresetStyleToEntry(entry, preset, isValidHexColor) {
  if (!entry || !preset) return false;
  const valid =
    typeof isValidHexColor === 'function' ? isValidHexColor : () => true;
  let changed = false;
  const set = (k, v) => {
    if (entry[k] !== v) {
      entry[k] = v;
      changed = true;
    }
  };

  for (const k of PRESET_STYLE_FIELDS) {
    if (k in preset && preset[k] !== undefined) set(k, preset[k]);
  }
  if (typeof preset.customCss === 'string' && preset.customCss.trim()) {
    set('customCss', preset.customCss);
  }

  const hasText =
    !!(
      (entry.color && valid(entry.color)) ||
      (entry.textColor &&
        entry.textColor !== 'currentColor' &&
        valid(entry.textColor))
    );
  const hasBg = !!(entry.backgroundColor && valid(entry.backgroundColor));

  if (!hasText && !hasBg) {
    if (preset.styleType) set('styleType', preset.styleType);
    if (
      preset.styleType === 'text' &&
      preset.textColor &&
      preset.textColor !== 'currentColor' &&
      valid(preset.textColor)
    ) {
      set('color', preset.textColor);
      set('textColor', null);
      set('backgroundColor', null);
    } else {
      if ('textColor' in preset && preset.textColor !== undefined)
        set('textColor', preset.textColor);
      if ('backgroundColor' in preset && preset.backgroundColor !== undefined)
        set('backgroundColor', preset.backgroundColor);
      if (preset.styleType === 'highlight' && preset.backgroundColor)
        set('color', '');
    }
  }

  if (preset.uid) set('presetUid', preset.uid);
  // The preset's COLORTYPE follows the preset even when the entry keeps its
  // own colours (it decides what that colour is rendered AS), and any channel
  // the new type needs is filled so the entry can never render blank.
  if (adoptPresetColortype(entry, preset, isValidHexColor)) changed = true;
  return changed;
}

/**
 * Adopt a preset's COLORTYPE on an entry, and make sure every channel that
 * type needs actually holds a colour — picking a preset must never leave an
 * entry whose colortype nothing paints (e.g. a red text entry switched to a
 * highlight preset that carries no background of its own).
 *
 * The entry's own colours are never overwritten: a channel it already paints
 * keeps its colour; a channel it lacks is taken from the preset first (the
 * preset chose that colortype, so its colour belongs to it), then duplicated
 * from the entry's own other channel, and the highlight finally falls back to
 * the theme accent — the same default the colour pickers use.
 *
 * @param {object} entry
 * @param {object} preset
 * @param {(color: any) => boolean} [isValidHexColor]
 * @returns {boolean} whether the entry changed
 */
export function adoptPresetColortype(entry, preset, isValidHexColor) {
  if (!entry || !preset || !preset.styleType) return false;
  const valid =
    typeof isValidHexColor === 'function' ? isValidHexColor : () => true;
  // A colour that actually paints: currentColor/inherit only restate the
  // theme text, so they never fill the other channel. `var(--text-normal)`
  // is the theme default too — it may hold the text channel, but it never
  // travels into the highlight.
  const paint = (c) =>
    typeof c === 'string' && c.trim() && c !== 'currentColor' && c !== 'inherit'
      ? valid(c)
        ? c.trim()
        : null
      : null;
  const real = (c) => (c && c !== 'currentColor' ? c : null);
  const themeText = (c) =>
    typeof c === 'string' && /^var\(\s*--text-normal\s*(,|\s*\))/.test(c.trim());
  const chosen = (c) => (real(c) && !themeText(c) ? c : null);
  let changed = false;
  const set = (k, v) => {
    if (v && entry[k] !== v) {
      entry[k] = v;
      changed = true;
    }
  };

  if (entry.styleType !== preset.styleType) set('styleType', preset.styleType);

  const type = preset.styleType;
  const needText = type === 'text' || type === 'both';
  const needBg = type === 'highlight' || type === 'both';
  const ownText =
    paint(entry.textColor) ||
    paint(entry.color) ||
    (entry.textColor === 'currentColor' ? 'currentColor' : null);
  const ownBg = paint(entry.backgroundColor);

  if (needText && !ownText) {
    const t = paint(preset.textColor) || paint(preset.backgroundColor) || real(ownBg);
    if (t) {
      set('textColor', t);
      if (type === 'text') set('color', t);
    }
  }
  if (needBg && !ownBg) {
    const b =
      paint(preset.backgroundColor) ||
      chosen(preset.textColor) ||
      chosen(ownText) ||
      'var(--color-accent)';
    set('backgroundColor', b);
  }
  return changed;
}

/**
 * Copy a preset's SHAPE onto a word/blacklist group that uses it. This is the
 * group half of `applyPresetStyleToEntry`: shape (and the preset's CSS, when
 * it carries one) go over, the group's colortype and colours do not — a
 * colortype is the user's decision (Per-Entry must survive a preset edit) and
 * a colour must never be wiped. Members pick the new shape up at compile time,
 * where the group overrides their own layout fields.
 *
 * @param {object} group
 * @param {object} preset
 * @returns {boolean} whether the group changed
 */
export function applyPresetShapeToGroup(group, preset) {
  if (!group || !preset) return false;
  let changed = false;
  const set = (k, v) => {
    if (group[k] !== v) {
      group[k] = v;
      changed = true;
    }
  };

  for (const k of PRESET_SHAPE_FIELDS) {
    if (k in preset && preset[k] !== undefined) set(k, preset[k]);
  }
  if (typeof preset.customCss === 'string' && preset.customCss.trim()) {
    set('customCss', preset.customCss);
  }
  if (preset.uid) set('presetUid', preset.uid);
  return changed;
}

/**
 * Apply an edited preset to every entry using it, and to every group using it.
 *
 * @param {object} settings
 * @param {object} preset         preset after the edit
 * @param {string} prevSignature  presetSignature() captured before the edit
 * @param {object[]} allPresets   every preset/quick style (ambiguity check)
 * @param {(color: any) => boolean} [isValidHexColor]
 * @returns {number} number of entries and groups updated
 */
export function propagatePresetToEntries(
  settings,
  preset,
  prevSignature,
  allPresets,
  isValidHexColor,
) {
  if (!settings || !preset) return 0;
  let count = 0;
  for (const entry of entriesUsingPreset(
    settings,
    preset,
    prevSignature,
    allPresets,
  )) {
    try {
      if (applyPresetStyleToEntry(entry, preset, isValidHexColor)) count += 1;
    } catch (_) {
      /* one bad entry must not stop the rest */
    }
  }
  for (const group of groupsUsingPreset(
    settings,
    preset,
    prevSignature,
    allPresets,
  )) {
    try {
      if (applyPresetShapeToGroup(group, preset)) count += 1;
    } catch (_) {
      /* one bad group must not stop the rest */
    }
  }
  return count;
}
