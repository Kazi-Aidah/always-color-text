// The user-arranged swatch order lives in `settings.swatchOrder`, written by
// the Edit Color Swatches modal — defaults and customs can be interleaved
// there. Anything that lists swatches (the colour picker grid) or rewrites the
// swatch lists (the Settings tab) must go through these helpers, otherwise the
// saved arrangement is ignored and defaults show first again.

const colorKey = (c) => String(c == null ? "" : c).toLowerCase();

// Swatches absent from the saved order sort behind every ranked one, so a
// newly added colour lands at the end instead of jumping the queue.
const UNRANKED = Number.MAX_SAFE_INTEGER;

/**
 * Stable-sort swatch items by the saved order.
 * @param {Array<{color?: string}>} items swatch objects to reorder
 * @param {string[]} [order] colors as stored in `settings.swatchOrder`
 * @returns {Array<{color?: string}>} a new array in the saved order; input
 *   order is returned untouched when no usable order is saved (fresh installs
 *   keep the defaults-then-customs layout)
 */
export function orderSwatchesByOrder(items, order) {
  if (!Array.isArray(items) || !Array.isArray(order) || !order.length) {
    return items;
  }
  const rank = new Map();
  for (const c of order) {
    const k = colorKey(c);
    if (k && !rank.has(k)) rank.set(k, rank.size);
  }
  if (!rank.size) return items;
  return items
    .map((item, index) => {
      const r = rank.has(colorKey(item && item.color))
        ? rank.get(colorKey(item && item.color))
        : UNRANKED;
      return { item, index, r };
    })
    .sort((a, b) => a.r - b.r || a.index - b.index)
    .map((e) => e.item);
}

/**
 * Rebuild `settings.swatchOrder` after the defaults/customs lists changed.
 * Custom slots keep the positions they occupy among the defaults and are
 * refilled with the customs' current sequence, so a reorder/add/delete done in
 * the Settings tab stays exactly what the Edit Swatches modal and the colour
 * picker show next. Colors no longer present are dropped; unknown ones appended.
 * @param {object} settings live settings object (mutated in place)
 */
export function syncSwatchOrder(settings) {
  if (!settings) return;
  const defaults = Array.isArray(settings.swatches) ? settings.swatches : [];
  const customs = Array.isArray(settings.userCustomSwatches)
    ? settings.userCustomSwatches
    : [];
  const defColors = defaults.map((s) => s && s.color).filter(Boolean);
  const cusColors = customs.map((s) => s && s.color).filter(Boolean);
  const present = new Set([...defColors, ...cusColors].map(colorKey));
  const customKeys = new Set(cusColors.map(colorKey));

  const prev = [];
  const seen = new Set();
  const saved = Array.isArray(settings.swatchOrder)
    ? settings.swatchOrder
    : [];
  for (const c of saved) {
    const k = colorKey(c);
    if (!k || !present.has(k) || seen.has(k)) continue;
    seen.add(k);
    prev.push(c);
  }

  const out = [];
  const emitted = new Set();
  const push = (c) => {
    const k = colorKey(c);
    if (!k || emitted.has(k)) return;
    emitted.add(k);
    out.push(c);
  };

  let nextCustom = 0;
  for (const c of prev) {
    if (customKeys.has(colorKey(c))) {
      // The slot is a custom's: hand it the next colour of the new sequence.
      if (nextCustom < cusColors.length) push(cusColors[nextCustom++]);
    } else {
      push(c);
    }
  }
  // Swatches the saved order never knew about follow it, defaults first —
  // the same fallback the Edit Swatches modal sorts with.
  for (const d of defColors) push(d);
  while (nextCustom < cusColors.length) push(cusColors[nextCustom++]);

  settings.swatchOrder = out;
}

/**
 * Swap one color inside the saved order so a recolored custom swatch keeps its
 * slot instead of dropping out as an unknown color.
 * @param {object} settings live settings object (mutated in place)
 * @param {string} prevColor color being replaced
 * @param {string} nextColor replacement color
 */
export function replaceSwatchColorInOrder(settings, prevColor, nextColor) {
  if (!settings || !Array.isArray(settings.swatchOrder)) return;
  const pk = colorKey(prevColor);
  if (!pk || pk === colorKey(nextColor)) return;
  settings.swatchOrder = settings.swatchOrder.map((c) =>
    colorKey(c) === pk ? nextColor : c,
  );
}
