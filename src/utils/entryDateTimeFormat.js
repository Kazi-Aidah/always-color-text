/**
 * Helpers for "Time & Date" preset entries.
 *
 * Those entries are stored as generated regexes like every other regex entry,
 * but the user must never see that regex: the UI shows the moment.js FORMAT
 * behind the entry (e.g. "DD_MMMM_Y") as a button that re-opens the format
 * step. These helpers decide whether an entry is one of them.
 */

/**
 * The moment.js format behind a Time & Date entry, or "" for anything else.
 *
 * Entries created since the format button exists carry it in
 * `entry.dateTimeFormat`. Older ones only carry the preset label
 * ("Time & Date (DD_MMMM_Y)"), so parse the format back out of it — and write
 * it onto the entry, so renaming the entry later can't lose it.
 *
 * @param {object} entry - a word/blacklist entry
 * @param {object} plugin - the plugin (for localized preset names)
 * @returns {string} the moment.js format, or "" when not a format entry
 */
export function getEntryDateTimeFormat(entry, plugin) {
  if (!entry || !entry.isRegex) return "";
  const stored = String(entry.dateTimeFormat || "").trim();
  if (stored) return stored;
  const label = String(entry.presetLabel || "");
  const prefix = plugin.t("preset_time_date", "Time & Date") + " (";
  if (label.startsWith(prefix) && label.endsWith(")")) {
    const fmt = label.slice(prefix.length, -1).trim();
    if (fmt) {
      entry.dateTimeFormat = fmt;
      return fmt;
    }
  }
  return "";
}
