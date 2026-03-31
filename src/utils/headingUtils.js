export function getHeadingLevelsFromPattern(pattern) {
  try {
    if (!pattern || typeof pattern !== "string") return [];
    const levels = new Set();
    const quantMatch = pattern.match(/#\{(\d+)(?:,(\d+))?\}/);
    if (quantMatch) {
      let start = parseInt(quantMatch[1], 10);
      let end = quantMatch[2] ? parseInt(quantMatch[2], 10) : start;
      if (!Number.isFinite(start) || start < 1) start = 1;
      if (!Number.isFinite(end) || end > 6) end = 6;
      for (let l = start; l <= end; l++) levels.add(l);
    } else {
      const hashRun = pattern.match(/#+/);
      if (hashRun) {
        const len = hashRun[0].length;
        if (len >= 1 && len <= 6) levels.add(len);
      }
    }
    return Array.from(levels);
  } catch (e) {
    return [];
  }
}

export function getEntryForHeadingLevel(entries, level) {
  if (!Array.isArray(entries) || level < 1 || level > 6) return null;
  let match = null;
  let bestSpan = Infinity;
  try {
    for (const entry of entries) {
      if (!entry || !entry.pattern) continue;
      const pattern = String(entry.pattern);
      const levels = getHeadingLevelsFromPattern(pattern);
      if (
        Array.isArray(levels) &&
        levels.length > 0 &&
        levels.includes(level)
      ) {
        const span = levels.length;
        if (span < bestSpan) {
          bestSpan = span;
          match = entry;
        }
      }
    }
    if (match) return match;
  } catch (e) {}
  for (const entry of entries) {
    if (!entry || !entry.pattern) continue;
    const pattern = String(entry.pattern);
    if (/#\{1,6\}/.test(pattern)) {
      return entry;
    }
  }
  return null;
}
