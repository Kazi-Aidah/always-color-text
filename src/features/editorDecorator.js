import { RangeSetBuilder, Decoration, ViewPlugin, StateEffect, syntaxTree, forceRebuildEffect } from '../core/cmSetup.js';
import { EDITOR_PERFORMANCE_CONSTANTS, REGEX_CONSTANTS } from '../core/constants.js';
import { debugLog, debugError, debugWarn } from '../utils/debug.js';

export function buildEditorExtension(plugin) {
  return ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.view = view;
        this.decorations = this.buildDeco(view);
        this.lastFilePath = view.file ? view.file.path : null;
        this._typingDebounceTimer = null;
        this.wasInTable = false;
        try {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const node = sel.anchorNode;
            if (
              node &&
              (node.nodeType === 1 ? node : node.parentElement)?.closest(
                ".cm-content table",
              )
            ) {
              this.wasInTable = true;
            }
          }
        } catch (_) {}
        try {
          if (
            plugin.settings.enabled &&
            !plugin.settings.disableLivePreviewColoring
          )
            plugin._processLivePreviewCallouts(view);
        } catch (_) {}
        try {
          if (
            plugin.settings.enabled &&
            !plugin.settings.disableLivePreviewColoring
          )
            plugin._processLivePreviewTables(view);
        } catch (_) {}
        try {
          if (
            plugin.settings.enabled &&
            !plugin.settings.disableLivePreviewColoring
          )
            plugin._attachLivePreviewCalloutObserver(view);
        } catch (_) {}
        try {
          if (
            plugin.settings.enabled &&
            !plugin.settings.disableLivePreviewColoring
          )
            plugin._attachLivePreviewTableObserver(view);
        } catch (_) {}
      }
      update(update) {
        // Strict Table Rerender on Exit
        if (update.selectionSet) {
          let isInTable = false;
          try {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              const node = sel.anchorNode;
              if (
                node &&
                (node.nodeType === 1 ? node : node.parentElement)?.closest(
                  ".cm-content table",
                )
              ) {
                isInTable = true;
              }
            }
          } catch (_) {}

          if (this.wasInTable && !isInTable) {
            try {
              plugin._processLivePreviewTables(this.view, true);
            } catch (_) {}
          }
          this.wasInTable = isInTable;
        }

        // Get current active file to detect folder changes
        const currentFilePath = plugin.app.workspace.getActiveFile()?.path;
        const fileChanged = this.lastFilePath !== currentFilePath;
        this.lastFilePath = currentFilePath;

        // Check for force rebuild effect
        const forceRebuild = update.transactions.some((tr) =>
          tr.effects.some((e) => e.is(forceRebuildEffect)),
        );

        // Track typing state for performance optimization - aggressive throttling during typing
        if (update.docChanged) {
          plugin._isTyping = true;
          plugin._lastTypingTime = Date.now();
          // Clear typing flag after a longer delay
          clearTimeout(plugin._typingFlagTimer);
          plugin._typingFlagTimer = setTimeout(() => {
            plugin._isTyping = false;
          }, EDITOR_PERFORMANCE_CONSTANTS.TYPING_GRACE_PERIOD_MS);
        }

        // Rebuild decorations if document changed, viewport changed, file/folder changed OR forced
        if (
          update.docChanged ||
          update.viewportChanged ||
          fileChanged ||
          forceRebuild
        ) {
          // EXPERT EXPERIMENT: "Word Completion Coloring" (MOVED TO TOP LEVEL)
          // If we are strictly typing letters (no space/newline) and not forcing a rebuild,
          // we just map existing decorations and skip the rest. This prevents premature coloring.
          let skipRebuildForWordCompletion = false;
          if (
            plugin.settings.enableWordCompletionColoring &&
            plugin._isTyping &&
            update.docChanged &&
            !forceRebuild &&
            !fileChanged
          ) {
            let hasWordBoundary = false;
            let isInsertion = true;
            let hasNonRomanInsert = false;
            update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
              if (fromA !== toA) isInsertion = false; // Deletion occurred
              if (inserted.length > 0) {
                const text = inserted.toString();
                if (text.includes(" ") || text.includes("\n"))
                  hasWordBoundary = true;
                try {
                  if (
                    /[^\u0000-\u007F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/.test(
                      text,
                    )
                  ) {
                    hasNonRomanInsert = true;
                  }
                } catch (_) {}
              }
            });
            // If non‑Roman text is being inserted, do NOT defer coloring
            if (hasNonRomanInsert) {
              hasWordBoundary = true;
              try {
                debugLog(
                  "CJK",
                  "LP word-completion bypass: non-Roman insertion detected",
                );
              } catch (_) {}
            }
            // If strictly inserting chars without boundary, skip rebuild
            if (isInsertion && !hasWordBoundary) {
              skipRebuildForWordCompletion = true;
            }
          }

          if (skipRebuildForWordCompletion) {
            this.decorations = this.decorations.map(update.changes);
          } else if (
            plugin.settings.enableSmartUpdates &&
            update.docChanged &&
            !forceRebuild &&
            !fileChanged &&
            !update.viewportChanged
          ) {
            try {
              this.decorations = this.decorations.map(update.changes);

              const dirtyRanges = [];
              let totalDirtyLength = 0;
              const viewport = update.view.viewport;

              // EXPERT ENHANCEMENT: Pre-calculate active line for focus mode
              const selection = update.view.state.selection.main;
              const activeLine = update.view.state.doc.lineAt(selection.head);

              update.changes.iterChanges((fromA, toA, fromB, toB) => {
                const startLine = update.view.state.doc.lineAt(fromB);
                const endLine = update.view.state.doc.lineAt(toB);

                // OPTIMIZATION: Only update ranges that are actually visible
                // If the change is outside the viewport, we don't need to re-color it immediately
                if (
                  endLine.to < viewport.from ||
                  startLine.from > viewport.to
                )
                  return;

                // EXPERT ENHANCEMENT: "Active Line Rendering" Focus
                // If we are actively typing, freeze updates for lines other than the active one to prevent lag
                if (plugin._isTyping) {
                  const isActiveLine =
                    startLine.from <= activeLine.to &&
                    endLine.to >= activeLine.from;
                  if (!isActiveLine) return;
                }

                const range = { from: startLine.from, to: endLine.to };
                dirtyRanges.push(range);
                totalDirtyLength += range.to - range.from;
              });

              // Safety valve: If we have too much to update (e.g. large paste), fall back to standard build
              if (totalDirtyLength > 5000) {
                this.decorations = this.buildDeco(update.view);
              } else if (dirtyRanges.length > 0) {
                const { entries, folderEntry } = this.getApplicableEntries(
                  update.view,
                );
                if (entries && entries.length > 0) {
                  for (const range of dirtyRanges) {
                    this.decorations = this.decorations.update({
                      filter: (from, to) =>
                        to < range.from || from > range.to,
                    });

                    const builder = new RangeSetBuilder();
                    const text = update.view.state.doc.sliceString(
                      range.from,
                      range.to,
                    );
                    const chunkDecos = plugin.buildDecoChunked(
                      update.view,
                      builder,
                      range.from,
                      range.to,
                      text,
                      entries,
                      folderEntry,
                      currentFilePath,
                    );

                    const newRanges = [];
                    chunkDecos.between(range.from, range.to, (f, t, v) => {
                      newRanges.push({ from: f, to: t, value: v });
                    });

                    this.decorations = this.decorations.update({
                      add: newRanges,
                    });
                  }
                }
              }
            } catch (e) {
              this.decorations = this.buildDeco(update.view);
            }
          } else {
            this.decorations = this.buildDeco(update.view);
          }

          // Debounce heavy operations (callouts/tables) to prevent lag
          clearTimeout(this._typingDebounceTimer);
          const debounceMs = plugin.settings.extremeLightweightMode
            ? 1000
            : EDITOR_PERFORMANCE_CONSTANTS.TYPING_DEBOUNCE_MS;
          this._typingDebounceTimer = setTimeout(() => {
            try {
              if (
                plugin.settings.enabled &&
                !plugin.settings.disableLivePreviewColoring
              )
                plugin._processLivePreviewCallouts(this.view);
            } catch (_) {}
            try {
              if (
                plugin.settings.enabled &&
                !plugin.settings.disableLivePreviewColoring
              )
                plugin._processLivePreviewTables(this.view);
            } catch (_) {}
          }, debounceMs);
        }
      }
      destroy() {
        try {
          clearTimeout(this._typingDebounceTimer);
        } catch (_) {}
        try {
          plugin._detachLivePreviewCalloutObserver(this.view);
        } catch (_) {}
        try {
          plugin._detachLivePreviewTableObserver(this.view);
        } catch (_) {}
      }
      getApplicableEntries(view) {
        if (!plugin.settings.enabled)
          return { entries: [], folderEntry: null };

        let entries = plugin.getSortedWordEntries();
        const fileForView = view.file || plugin.app.workspace.getActiveFile();

        if (fileForView) {
          const prb = plugin.evaluatePathRules(fileForView.path);
          if (plugin.settings.disabledFiles.includes(fileForView.path))
            return { entries: [], folderEntry: null };
          if (plugin.isFrontmatterColoringDisabled(fileForView.path))
            return { entries: [], folderEntry: null };
          let previewEntries = entries;
          if (fileForView && fileForView.path)
            previewEntries = plugin.filterEntriesByAdvancedRules(
              fileForView.path,
              entries,
            );
          if (
            (prb.excluded ||
              (plugin.hasGlobalExclude() &&
                prb.hasIncludes &&
                !prb.included)) &&
            previewEntries.length === 0
          )
            return { entries: [], folderEntry: null };
          entries = previewEntries;
        }

        // VALIDATION: Ensure targetElement is present for formatting entries in Live Preview (self-healing)
        // This is critical to prevent double spans when CSS already handles the styling
        for (const entry of entries) {
          if (!entry.targetElement && entry.isRegex) {
            // Check patterns and also check presetLabel for robustness
            const pattern = entry.pattern;
            const label = (entry.presetLabel || "").toLowerCase();

            if (
              pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1" ||
              label === "bold" ||
              label.includes("bold (")
            )
              entry.targetElement = "strong";
            else if (
              pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1" ||
              label === "italic" ||
              label.includes("italic (")
            )
              entry.targetElement = "em";
            else if (
              pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1" ||
              label === "bold italic" ||
              label.includes("bold italic")
            )
              entry.targetElement = "strong-em";
          }
        }

        const folderEntry = fileForView
          ? plugin.getBestFolderEntry(fileForView.path)
          : null;
        return { entries, folderEntry };
      }
      buildDeco(view) {
        const builder = new RangeSetBuilder();

        const root = view && view.dom ? view.dom : null;
        const isLivePreview =
          root && root.closest && root.closest(".is-live-preview");
        if (plugin.settings.disableLivePreviewColoring && isLivePreview)
          return builder.finish();

        const { entries, folderEntry } = this.getApplicableEntries(view);
        if (entries.length === 0) return builder.finish();

        const { from, to } = view.viewport;
        const docLength = view.state.doc.length;

        // OPTIMIZATION: Use extended buffer for pattern matching at boundaries
        const extendedTo = Math.min(
          to + EDITOR_PERFORMANCE_CONSTANTS.VIEWPORT_EXTENSION,
          docLength,
        );
        const text = view.state.doc.sliceString(from, extendedTo);
        const fileForView = view.file || plugin.app.workspace.getActiveFile();

        // OPTIMIZATION: Always use chunked processing for aggressive optimization
        // This ensures we never process too many matches at once
        return plugin.buildDecoChunked(
          view,
          builder,
          from,
          extendedTo,
          text,
          entries,
          folderEntry,
          fileForView ? fileForView.path : null,
          syntaxTree,
        );
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );
}
