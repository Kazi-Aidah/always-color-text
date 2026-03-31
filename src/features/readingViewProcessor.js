import { EDITOR_PERFORMANCE_CONSTANTS, REGEX_CONSTANTS } from '../core/constants.js';
import { debugLog, debugWarn } from '../utils/debug.js';

/**
 * Factory function that returns the markdown post-processor callback.
 * Extracted from AlwaysColorText.registerMarkdownPostProcessor (src/a-main.js ~line 7875).
 *
 * @param {object} plugin - The AlwaysColorText plugin instance
 * @returns {function(el: HTMLElement, ctx: object): void}
 */
export function buildReadingViewProcessor(plugin) {
  return function(el, ctx) {
    if (!plugin.settings.enabled) return;
    try {
      const qaRoot =
        el && el.closest
          ? el.closest(
              '[data-id="quickadd"], .quickadd-settings, .quickAdd-settings',
            )
          : null;
      if (qaRoot) {
        try {
          qaRoot.classList.add("act-skip-coloring");
        } catch (_) {}
        return;
      }
    } catch (_) {}
    let sp = null;
    try {
      sp =
        ctx && typeof ctx.sourcePath === "string"
          ? ctx.sourcePath
          : plugin.app &&
              plugin.app.workspace &&
              plugin.app.workspace.getActiveFile &&
              plugin.app.workspace.getActiveFile()
            ? plugin.app.workspace.getActiveFile().path
            : null;
    } catch (_) {}
    if (!sp) return;
    try {
      debugLog(
        "POST_PROC",
        `Processing element: ${el.className}, nodeName: ${el.nodeName}, hasCallout: ${el.querySelector(".callout") ? "yes" : "no"}`,
      );
    } catch (_) {}
    try {
      plugin.processActiveFileOnly(el, { sourcePath: sp });
    } catch (e) {
      debugWarn("ACT", "processActiveFileOnly failed", e);
    }

    // In reading mode, set up continuous highlight maintenance
    try {
      const isReadingMode =
        el &&
        (el.classList.contains("markdown-rendered") ||
          el.closest(".markdown-reading-view"));
      if (isReadingMode) {
        debugLog(
          "POST_PROC",
          "Detected reading mode, setting up highlight maintenance",
        );
        plugin.setupReadingModeObserver(el, sp);
      }
    } catch (e) {}
  };
}
