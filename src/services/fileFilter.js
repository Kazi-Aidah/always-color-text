import { EDITOR_PERFORMANCE_CONSTANTS } from '../core/constants.js';
import { debugLog } from '../utils/debug.js';

/**
 * Pure logic for evaluatePathRules — extracted from AlwaysColorText.evaluatePathRules.
 *
 * @param {string} filePath
 * @param {object} settings  - plugin settings (reads settings.pathRules)
 * @param {Map|null} pathRulesCache - optional cache map (may be null)
 * @param {Function} normalizePath  - this.normalizePath
 * @param {Function} _parentFolders - this._parentFolders
 * @param {Function} detectRuleKind - this.detectRuleKind
 * @param {Function} _matchesByName - this._matchesByName
 * @param {Function} getFileTags    - this.getFileTags
 * @param {Function} _matchFile     - this._matchFile
 * @returns {{ included: boolean, excluded: boolean, hasIncludes: boolean, hasFileRule: boolean }}
 */
export function evaluatePathRulesLogic(
  filePath,
  settings,
  pathRulesCache,
  normalizePath,
  _parentFolders,
  detectRuleKind,
  _matchesByName,
  getFileTags,
  _matchFile,
) {
  const rules = Array.isArray(settings.pathRules) ? settings.pathRules : [];
  if (!filePath || rules.length === 0)
    return { included: false, excluded: false, hasIncludes: false };
  try {
    if (pathRulesCache && pathRulesCache.has(filePath)) {
      return pathRulesCache.get(filePath);
    }
  } catch (_) {}
  const fp = normalizePath(filePath);
  let fileInclude = false;
  let fileExclude = false;
  let folderInclude = false;
  let folderExclude = false;
  let hasIncludes = false;
  const parents = _parentFolders(fp);
  for (const r of rules) {
    if (!r) continue;
    const mode = r.mode === "exclude" ? "exclude" : "include";
    const pathStr = String(r.path || "").trim();
    const pathEmpty = pathStr.length === 0;
    if (mode === "include") hasIncludes = true;
    if (pathEmpty) {
      if (mode === "include") {
        folderInclude = true;
        fileInclude = true;
      } else {
        folderExclude = true;
        fileExclude = true;
      }
      continue;
    }
    const dk = detectRuleKind(pathStr);
    if (dk.kind === "name") {
      const { fileMatch, folderMatch } = _matchesByName(fp, dk.name);
      if (fileMatch) {
        if (mode === "include") fileInclude = true;
        else fileExclude = true;
      }
      if (folderMatch) {
        if (mode === "include") folderInclude = true;
        else folderExclude = true;
      }
      continue;
    }
    if (dk.kind === "tag") {
      const tags = getFileTags(fp).map((t) => t.replace(/^#/, ""));
      const hasTag = tags.includes(String(dk.tag || "").replace(/^#/, ""));
      if (hasTag) {
        if (mode === "include") fileInclude = true;
        else fileExclude = true;
      }
      continue;
    }
    if (dk.kind === "exact-folder") {
      for (const p of parents) {
        if (normalizePath(p) === normalizePath(dk.path)) {
          if (mode === "include") folderInclude = true;
          else folderExclude = true;
          break;
        }
      }
      continue;
    }
    if (dk.kind === "exact-file") {
      if (_matchFile(dk.path, fp)) {
        if (mode === "include") fileInclude = true;
        else fileExclude = true;
      }
      continue;
    }
    if (dk.kind === "regex") {
      let re = null;
      try {
        re = new RegExp(dk.pattern);
      } catch (e) {
        re = null;
      }
      if (re) {
        if (re.test(fp)) {
          if (mode === "include") fileInclude = true;
          else fileExclude = true;
        }
        for (const p of parents) {
          if (re.test(p)) {
            if (mode === "include") folderInclude = true;
            else folderExclude = true;
            break;
          }
        }
      }
      continue;
    }
  }
  let included = false;
  let excluded = false;
  // CRITICAL: File-level rules ALWAYS override folder-level rules
  if (fileInclude) {
    included = true;
    excluded = false;
  } else if (fileExclude) {
    included = false;
    excluded = true;
  } else if (folderInclude) {
    included = true;
    excluded = false;
  } else if (folderExclude) {
    included = false;
    excluded = true;
  }
  // Return detailed info: whether this file has an explicit rule
  const hasFileRule = fileInclude || fileExclude;
  const result = { included, excluded, hasIncludes, hasFileRule };
  try {
    pathRulesCache && pathRulesCache.set(filePath, result);
  } catch (_) {}
  return result;
}

/**
 * Pure logic for hasGlobalExclude — extracted from AlwaysColorText.hasGlobalExclude.
 *
 * @param {object} settings - plugin settings (reads settings.pathRules)
 * @returns {boolean}
 */
export function hasGlobalExcludeLogic(settings) {
  try {
    const rules = Array.isArray(settings.pathRules) ? settings.pathRules : [];
    return rules.some(
      (r) =>
        r && r.mode === "exclude" && String(r.path || "").trim().length === 0,
    );
  } catch (e) {
    return false;
  }
}

/**
 * Pure logic for getBestFolderEntry — extracted from AlwaysColorText.getBestFolderEntry.
 *
 * @param {string} filePath
 * @param {object} settings      - plugin settings (reads settings.pathRules)
 * @param {Function} normalizePath  - this.normalizePath
 * @param {Function} _parentFolders - this._parentFolders
 * @param {Function} detectRuleKind - this.detectRuleKind
 * @param {Function} _basename      - this._basename
 * @returns {{ path: string, mode: string }|null}
 */
export function getBestFolderEntryLogic(
  filePath,
  settings,
  normalizePath,
  _parentFolders,
  detectRuleKind,
  _basename,
) {
  try {
    const rules = Array.isArray(settings.pathRules) ? settings.pathRules : [];
    if (!filePath || rules.length === 0) return null;
    const fp = normalizePath(filePath);
    const parents = _parentFolders(fp);
    let best = null;
    for (const r of rules) {
      if (!r) continue;
      const mode = r.mode === "exclude" ? "exclude" : "include";
      const pathStr = String(r.path || "").trim();
      const dk = detectRuleKind(pathStr);
      if (pathStr.length === 0) {
        const candidate = { path: "", mode };
        best = candidate; // vault-wide rule has lowest specificity but still applies
        continue;
      }
      if (dk.kind === "name") {
        for (const p of parents) {
          if (_basename(p) === dk.name) {
            if (!best || p.length > best.path.length)
              best = { path: p, mode };
            break;
          }
        }
        continue;
      }
      if (dk.kind === "exact-folder") {
        for (const p of parents) {
          if (normalizePath(p) === normalizePath(dk.path)) {
            if (!best || p.length > best.path.length)
              best = { path: p, mode };
            break;
          }
        }
        continue;
      }
      if (dk.kind === "regex") {
        let re = null;
        try {
          re = new RegExp(dk.pattern);
        } catch (e) {
          re = null;
        }
        if (re) {
          for (const p of parents) {
            if (re.test(p)) {
              if (!best || p.length > best.path.length)
                best = { path: p, mode };
              break;
            }
          }
        }
        continue;
      }
    }
    return best;
  } catch (e) {
    return null;
  }
}
