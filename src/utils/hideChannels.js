// Shared semantics for the two visibility commands:
//
//   settings.hideTextColors  →  "Hide/Unhide Text Colors"
//   settings.hideHighlights  →  "Hide/Unhide Highlights"
//
// The plugin paints through many independent surfaces (CodeMirror decorations,
// reading-view DOM, the markdown-element stylesheet, line targets, titles,
// callouts/tables/Bases, the mark <mark>/`.cm-highlight` preset). Every one of
// them must resolve the two flags the same way, otherwise a command appears to
// "not work" because one surface keeps painting a channel the others dropped.
//
// Keep this file dependency-free (no `obsidian` import) so it stays unit
// testable and importable from every rendering path.

/** Read the two flags off a settings object (null/undefined safe). */
export function getHideFlags(settings) {
  const s = settings || {};
  return {
    hideText: s.hideTextColors === true,
    hideBg: s.hideHighlights === true,
  };
}

/**
 * The text colour of an entry: `textColor` wins, `color` is the legacy field.
 * `currentColor` means "leave the text alone", so it resolves to null.
 */
export function resolveTextColor(entry) {
  const e = entry || {};
  return e.textColor && e.textColor !== "currentColor"
    ? e.textColor
    : e.color || null;
}

/**
 * Which colour channels an entry still contributes once the hide flags are
 * applied.
 *
 * - `color` / `background` are the colours to paint (null when hidden or absent)
 * - `isHighlight` drives the "box" styling (padding / radius / corner shape /
 *   border) — it is the highlight channel, so hideHighlights suppresses it too
 * - `visible` is false when nothing at all should be painted, so callers can
 *   drop the whole rule/wrapper instead of emitting an empty one
 *
 * With no flags set this reproduces the historical behaviour exactly (colour
 * and background are independent; `styleType` only picks the box styling), so
 * switching a command on and off again is a pure no-op for existing users.
 */
export function resolveChannels(entry, flags) {
  const e = entry || {};
  const hideText = !!(flags && flags.hideText);
  const hideBg = !!(flags && flags.hideBg);
  const styleType = e.styleType || "text";
  const textColor = resolveTextColor(e);
  const backgroundColor = e.backgroundColor || null;

  const color = textColor && !hideText ? textColor : null;
  const background = backgroundColor && !hideBg ? backgroundColor : null;
  const isHighlight =
    !hideBg &&
    (styleType === "highlight" || styleType === "both" || !!backgroundColor);

  return {
    color,
    background,
    isHighlight,
    visible: !!(color || background || isHighlight),
    styleType,
    hideText,
    hideBg,
  };
}
