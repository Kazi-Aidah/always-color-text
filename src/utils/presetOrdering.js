// ::: PRESET ORDER RECONCILIATION :::

/**
 * Rebuild the preset and quick-style lists from the order the Reorder
 * Presets dialog displays.
 *
 * The dialog shows built-in presets, quick styles and custom presets as one
 * list, but they live in two separate settings arrays. This maps the visible
 * row order back onto those arrays without ever inventing or losing an item.
 *
 * Guarantees:
 * - Every input item ends up in exactly one output list, exactly once.
 * - Quick styles never migrate into `textStylePresets` (a quick style shown
 *   in both lists rendered as a duplicate in the presets modal).
 * - A quick style that an older save pushed into `textStylePresets` is
 *   moved back out, healing already-corrupted data.
 * - Built-in presets keep their relative order at the front.
 * - Items the dialog filtered out (the default preset, rows without a uid,
 *   rows hidden by "Quick Menu items only") stay at their old index instead
 *   of being dropped or replaced by another item.
 * - Visible items take their new row order.
 *
 * @param {object} args
 * @param {Array<object>} [args.presets] Current `settings.textStylePresets`.
 * @param {Array<object>} [args.quickStyles] Current `settings.quickStyles`.
 * @param {Set<string>} [args.seedUids] Uids of the shipped built-in presets.
 * @param {string[]} [args.uidOrder] `data-uid` values of the rows in DOM order.
 * @returns {{ presets: Array<object>, quickStyles: Array<object> }}
 */
export function reconcilePresetOrder({
  presets,
  quickStyles,
  seedUids,
  uidOrder,
} = {}) {
  const currentPresets = (Array.isArray(presets) ? presets : []).filter(Boolean);
  const currentQuickStyles = (Array.isArray(quickStyles) ? quickStyles : []).filter(Boolean);
  const seeds = seedUids instanceof Set ? seedUids : new Set(seedUids || []);

  const presetByUid = new Map();
  currentPresets.forEach((p) => {
    if (p.uid) presetByUid.set(p.uid, p);
  });
  const qsByUid = new Map();
  currentQuickStyles.forEach((s) => {
    if (s.uid) qsByUid.set(s.uid, s);
  });
  // identity check keeps uid-less quick styles in their own list as well
  const isQuickStyle = (x) =>
    currentQuickStyles.includes(x) || !!(x && x.uid && qsByUid.has(x.uid));

  // Row order, de-duplicated: the dialog can render one item twice (a quick
  // style kept in both lists), and a saved order must never apply twice.
  const domPresets = [];
  const domQuickStyles = [];
  const seenRows = new Set();
  (Array.isArray(uidOrder) ? uidOrder : []).forEach((uid) => {
    if (!uid || seenRows.has(uid)) return;
    seenRows.add(uid);
    if (qsByUid.has(uid)) domQuickStyles.push(qsByUid.get(uid));
    else if (presetByUid.has(uid)) domPresets.push(presetByUid.get(uid));
  });

  const applyOrder = (oldList, visible) => {
    const visibleSet = new Set(visible);
    const emitted = new Set();
    const result = [];
    const push = (item) => {
      if (emitted.has(item)) return;
      emitted.add(item);
      result.push(item);
    };
    let di = 0;
    oldList.forEach((item) => {
      if (!visibleSet.has(item)) {
        push(item);
        return;
      }
      while (di < visible.length && visible[di] !== item) push(visible[di++]);
      if (di < visible.length && visible[di] === item) {
        push(visible[di]);
        di++;
      }
    });
    while (di < visible.length) push(visible[di++]);
    return result;
  };

  const builtIns = currentPresets.filter((p) => seeds.has(p.uid));
  const customPresets = currentPresets.filter(
    (p) => !seeds.has(p.uid) && !isQuickStyle(p),
  );
  const visibleSet = new Set(customPresets);
  const visibleCustomPresets = domPresets.filter(
    (p) => !seeds.has(p.uid) && visibleSet.has(p),
  );

  return {
    presets: [...new Set(builtIns)].concat(
      applyOrder(customPresets, visibleCustomPresets),
    ),
    quickStyles: applyOrder(currentQuickStyles, domQuickStyles),
  };
}

// ::: QUICK MENU ORDER :::

// Items absent from the saved arrangement sort behind every ranked one, so a
// newly flagged Quick Menu item lands at the end instead of jumping the queue.
const UNRANKED = Number.MAX_SAFE_INTEGER;

/**
 * The Quick Menu's membership in the order the menu shows them before any
 * arrangement has been saved: visible Quick Styles first, then presets
 * flagged show in the Quick Menu — the assembly `getQuickMenuStyles()`
 * performs.
 *
 * @param {object} args
 * @param {Array<object>} [args.quickStyles] Current `settings.quickStyles`.
 * @param {Array<object>} [args.presets] Current `settings.textStylePresets`.
 * @returns {string[]} member uids, arranged or not; uid-less items excluded.
 */
export function deriveQuickMenuOrder({ quickStyles, presets } = {}) {
  const uids = [];
  const seen = new Set();
  const add = (item) => {
    if (item && item.uid && !seen.has(item.uid)) {
      seen.add(item.uid);
      uids.push(item.uid);
    }
  };
  (Array.isArray(quickStyles) ? quickStyles : []).forEach((s) => {
    if (s && s.showInQuickMenu !== false) add(s);
  });
  (Array.isArray(presets) ? presets : []).forEach((p) => {
    if (p && p.showInQuickMenu === true) add(p);
  });
  return uids;
}

/**
 * Stable-sort Quick Menu items by the saved arrangement. Items the list does
 * not mention (flagged after the arrangement was saved, uid-less) keep their
 * relative order behind every arranged item, so nothing jumps the queue.
 *
 * @param {Array<object>} items items with `uid` to reorder
 * @param {string[]} [order] uids as stored in `settings.quickMenuOrder`
 * @returns {Array<object>} a new array in the saved order; the input order
 *   is returned untouched when no usable arrangement is saved.
 */
export function orderQuickMenuByOrder(items, order) {
  if (!Array.isArray(items) || !Array.isArray(order) || !order.length) {
    return items;
  }
  const rank = new Map();
  for (const uid of order) {
    const k = uid == null ? "" : String(uid);
    if (k && !rank.has(k)) rank.set(k, rank.size);
  }
  if (!rank.size) return items;
  return items
    .map((item, index) => ({
      item,
      index,
      r:
        item && item.uid && rank.has(String(item.uid))
          ? rank.get(String(item.uid))
          : UNRANKED,
    }))
    .sort((a, b) => a.r - b.r || a.index - b.index)
    .map((e) => e.item);
}

/**
 * Rebuild the saved Quick Menu arrangement from the rows the "Quick Menu
 * items only" dialog displayed.
 *
 * This writes the Quick Menu's own list only — `textStylePresets` and
 * `quickStyles` keep their regular ordering untouched, and a regular
 * reorder leaves this list untouched, so the two arrangements can never
 * disturb each other. Every current member survives: rows take their new
 * order, arranged members without a row keep their spot, members the list
 * does not know yet are appended.
 *
 * @param {object} args
 * @param {string[]} [args.quickMenuOrder] Current `settings.quickMenuOrder`.
 * @param {string[]} [args.memberUids] Uids of every current Quick Menu member.
 * @param {string[]} [args.uidOrder] `data-uid` values of the rows in DOM order.
 * @returns {string[]} the next `settings.quickMenuOrder`.
 */
export function reconcileQuickMenuOrder({
  quickMenuOrder,
  memberUids,
  uidOrder,
} = {}) {
  const members = new Set((Array.isArray(memberUids) ? memberUids : []).filter(Boolean));
  const result = [];
  const emitted = new Set();
  const add = (uid) => {
    if (!uid || emitted.has(uid) || !members.has(uid)) return;
    emitted.add(uid);
    result.push(uid);
  };
  (Array.isArray(uidOrder) ? uidOrder : []).forEach(add);
  (Array.isArray(quickMenuOrder) ? quickMenuOrder : []).forEach(add);
  members.forEach((uid) => add(uid));
  return result;
}
