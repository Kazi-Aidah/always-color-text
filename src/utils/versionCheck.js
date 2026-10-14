/**
 * Semver helpers for the "update available" indicator beside Open Changelog.
 *
 * Pure and testable: no Obsidian or network access here. The plugin class
 * owns fetching/caching, SettingsTab owns rendering.
 */

export function normalizeVersionTag(tag) {
  if (tag === null || tag === undefined) return "";
  let v = String(tag).trim();
  if (!v) return "";
  // Strip a single leading v/V (GitHub tags are often "v1.18.0").
  if (v[0] === "v" || v[0] === "V") v = v.slice(1).trim();
  // Drop build metadata (+...) — it never affects precedence for our check.
  const plusIdx = v.indexOf("+");
  if (plusIdx !== -1) v = v.slice(0, plusIdx);
  // Drop pre-release suffix (-beta.1) for the numeric core, but keep the
  // full string for display. Comparison uses the numeric core only.
  const dashIdx = v.indexOf("-");
  if (dashIdx !== -1) v = v.slice(0, dashIdx);
  return v.trim();
}

function parseNumericCore(version) {
  const core = normalizeVersionTag(version);
  if (!core) return [];
  return core.split(".").map((part) => {
    const n = parseInt(String(part).trim(), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  });
}

/**
 * Compare two version strings.
 * @returns {-1|0|1} -1 when a < b, 0 when equal, 1 when a > b.
 */
export function compareVersions(a, b) {
  const pa = parseNumericCore(a);
  const pb = parseNumericCore(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na < nb) return -1;
    if (na > nb) return 1;
  }
  return 0;
}

/**
 * True when `latest` is strictly newer than `current`.
 * Empty inputs never count as an update.
 */
export function isNewerVersion(latest, current) {
  const l = normalizeVersionTag(latest);
  const c = normalizeVersionTag(current);
  if (!l || !c) return false;
  return compareVersions(l, c) === 1;
}
