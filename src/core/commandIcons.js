// Command icons + enforcement for the mobile toolbar.
//
// Why this module exists:
//
// 1) The mobile toolbar reads the icon straight off each command object and
//    substitutes a built-in "question mark in a circle" glyph when that
//    icon is missing. Any command registered without an `icon` therefore
//    always shows up as a "?" on the toolbar, which looks broken next to
//    the core commands (they always carry one).
//
// 2) The toolbar only compiles its buttons when the configured command-id
//    list changes; the compiled list is cached in between. Patching
//    `command.icon` alone is not enough inside a running session, because
//    the already-compiled "?" buttons would stay until Obsidian restarts or
//    the user edits the toolbar configuration. refreshMobileToolbar() drops
//    that cache and triggers a rebuild, so the correct icons appear
//    immediately — no restart needed.
//
// Every icon below was validated against Obsidian's bundled Lucide set as
// well as the pre-1.7.3 icon list, so they resolve on old and new builds
// alike. resolveCommandIcon()/pickIcon() still verify at runtime when
// `getIconIds()` is available and fall back to a guaranteed icon instead of
// rendering a blank button.

import { getIcon, getIconIds } from 'obsidian';

/** Used when a preferred icon does not exist in the running Obsidian build. */
const FALLBACK_ICON = 'circle';

/**
 * Default icon for every static command this plugin registers.
 * Keys are command ids WITHOUT the `always-color-text:` plugin prefix.
 */
export const COMMAND_ICONS = {
  // Coloring
  'set-color-for-selection': 'palette',
  'color-text-for-current-file': 'file-input',
  'add-to-existing-entry': 'plus-circle',
  'color-highlight-once-selected-text': 'highlighter',

  // Toggles
  'toggle-coloring-for-current-document': 'file-xcorner',
  'toggle-lightweight-mode': 'zap',
  'toggle-always-color-text': 'power',
  'toggle-hide-text-colors': 'eye-off',
  'toggle-hide-highlights': 'view',

  // Navigation / help
  'show-latest-release-notes': 'book-open',
  'open-plugin-settings': 'settings',
  'manage-colored-texts': 'list',

  // Regex testers
  'open-regex-tester': 'regex',
  'open-blacklist-regex-tester': 'shield-off',
};

/**
 * Dynamically generated command ids (group toggles get a uid suffix), mapped
 * to the icon shared by every command of that family.
 */
const DYNAMIC_COMMAND_ICON_RULES = [
  { pattern: /^toggle-word-group-/, icon: 'tag' },
  { pattern: /^toggle-blacklist-group-/, icon: 'circle-slashed' },
];

/**
 * Resolve the default icon for a command id.
 *
 * Accepts bare ids (`set-color-for-selection`), fully qualified ids
 * (`always-color-text:set-color-for-selection`) and ids of other plugins
 * (which are ignored and resolve to null).
 *
 * @param {string} commandId
 * @returns {string|null}
 */
export function resolveCommandIcon(commandId) {
  if (typeof commandId !== 'string' || !commandId) return null;

  // Only ever own our namespace: strip the plugin prefix when present.
  const colon = commandId.indexOf(':');
  const bare = colon === -1 ? commandId : commandId.slice(colon + 1);
  const prefix = colon === -1 ? '' : commandId.slice(0, colon + 1);
  if (prefix && prefix !== 'always-color-text:') return null;

  const staticIcon = COMMAND_ICONS[bare];
  if (staticIcon) return staticIcon;

  for (const rule of DYNAMIC_COMMAND_ICON_RULES) {
    if (rule.pattern.test(bare)) return rule.icon;
  }

  return null;
}

/**
 * Whether an icon id will actually render in this Obsidian build.
 *
 * `getIcon()` is the exact resolver `setIcon()` uses, so it covers
 * `lucide-`-prefixed ids, bare ids, legacy aliases (`trash` -> `trash-2`),
 * custom `addIcon()` icons and built-in glyphs. `getIconIds()` (Obsidian >=
 * 1.7.3) is the fallback, checking both spellings since it returns
 * `lucide-`-prefixed ids while plugins traditionally register bare ones.
 *
 * When neither API is available we treat a non-empty id as valid — that
 * keeps user/custom icons (e.g. set through Commander) untouched.
 *
 * @param {unknown} iconId
 * @returns {boolean}
 */
export function isValidIconId(iconId) {
  if (typeof iconId !== 'string' || !iconId.trim()) return false;

  const id = iconId.trim();

  try {
    if (typeof getIcon === 'function') return !!getIcon(id);
  } catch (_) {
    // fall through to the getIconIds() based check
  }

  try {
    if (typeof getIconIds !== 'function') return true;
    const ids = getIconIds();
    if (!Array.isArray(ids) || ids.length === 0) return true;

    const known = new Set(ids);
    if (known.has(id)) return true;
    const bare = id.startsWith('lucide-') ? id.slice(7) : id;
    if (known.has(`lucide-${bare}`)) return true;
    if (known.has(bare)) return true;
    return false;
  } catch (_) {
    return true;
  }
}

/**
 * Pick an icon that is guaranteed to render: the preferred id when it
 * exists in this build, otherwise a safe fallback.
 *
 * @param {string|null} preferred
 * @returns {string|null}
 */
export function pickIcon(preferred) {
  if (!preferred) return null;
  if (isValidIconId(preferred)) return preferred;
  if (isValidIconId(FALLBACK_ICON)) return FALLBACK_ICON;
  return preferred;
}

/**
 * Reinforce icons on every command registered by this plugin, directly in
 * the command registry (`app.commands.commands[...].icon`) — this is what
 * the mobile toolbar, hotkeys list and command palette read from.
 *
 * Rules:
 *  - missing/empty icon      -> filled with our default
 *  - invalid/unknown icon    -> repaired with our default
 *  - valid, different icon   -> left alone (respects customisations such as
 *                               Commander's per-command icon mapping)
 *
 * @param {import('obsidian').App} app
 * @param {string} [pluginId]
 * @returns {number} number of commands whose icon was changed
 */
export function enforceCommandIcons(app, pluginId = 'always-color-text') {
  try {
    const registry = app && app.commands && app.commands.commands;
    if (!registry || typeof registry !== 'object') return 0;

    const prefix = `${pluginId}:`;
    let changed = 0;

    for (const key of Object.keys(registry)) {
      if (key.lastIndexOf(prefix, 0) !== 0) continue;

      const command = registry[key];
      if (!command) continue;

      const desired = pickIcon(resolveCommandIcon(key));
      if (!desired) continue;

      const current =
        typeof command.icon === 'string' ? command.icon.trim() : '';
      if (current && (current === desired || isValidIconId(current))) {
        continue;
      }

      command.icon = desired;
      changed += 1;
    }

    return changed;
  } catch (_) {
    return 0;
  }
}

/**
 * Force Obsidian to rebuild the mobile toolbar from the (now correct)
 * command icons, so the change is visible without restarting the app.
 *
 * compileToolbar() short-circuits while its cached button list still
 * matches the configured command list — clearing that cache is what makes
 * the rebuilt icons show up immediately.
 *
 * @param {import('obsidian').App} app
 * @returns {boolean} whether a rebuild was triggered
 */
export function refreshMobileToolbar(app) {
  try {
    const toolbar = app && app.mobileToolbar;
    // Null on desktop — the mobile toolbar only exists on mobile.
    if (!toolbar || typeof toolbar.compileToolbar !== 'function') return false;

    // compileToolbar() would empty the button list and then crash if the
    // config were missing, so only trigger it when there is a list to build.
    const vault = app.vault;
    const config =
      vault && typeof vault.getConfig === 'function'
        ? vault.getConfig('mobileToolbarCommands')
        : null;
    if (!Array.isArray(config)) return false;

    toolbar.lastCommandIds = null;
    toolbar.compileToolbar();
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * One-shot convenience: enforce every icon, then make the mobile toolbar
 * pick the changes up.
 *
 * @param {import('obsidian').App} app
 * @param {string} [pluginId]
 * @returns {number} number of commands whose icon was changed
 */
export function applyCommandIcons(app, pluginId = 'always-color-text') {
  const changed = enforceCommandIcons(app, pluginId);
  refreshMobileToolbar(app);
  return changed;
}
