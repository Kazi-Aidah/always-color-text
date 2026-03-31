import { FuzzySuggestModal, Menu, Notice } from 'obsidian';
import { debugLog, debugError } from '../utils/debug.js';
import { ColorPickerModal } from './ColorPickerModal.js';
import { BlacklistRegexTesterModal } from './BlacklistRegexTesterModal.js';
import { RealTimeRegexTesterModal } from './RealTimeRegexTesterModal.js';
import { EditEntryModal } from './EditEntryModal.js';

export class AddToExistingEntryModal extends FuzzySuggestModal {
  constructor(app, plugin, selectedText, view) {
    super(app);
    this.plugin = plugin;
    this._activeTab = "general";
    this.selectedText = String(selectedText || "").trim();
    this.view = view;
    this._isRightClick = false;
    this._docCtx = null;
    this._lastAddedEntryUid = null;
    this._suggestionsContainerHandlers = [];
    this._menuReferences = [];
    this.setPlaceholder(
      this.plugin.t("prompt_search_existing", "Search existing entries…"),
    );
  }
  onOpen() {
    try {
      const root = this.modalEl.querySelector(".prompt") || this.modalEl;
      if (root) root.classList.add("act");
      const pic = this.modalEl.querySelector(".prompt-input-container");
      if (pic) pic.classList.add("act");
      const pi = this.modalEl.querySelector(".prompt-input");
      if (pi) {
        pi.classList.add("act");
        pi.style.borderRadius = "var(--input-radius)";
      }
      const pia = this.modalEl.querySelector(".prompt-input-cta");
      if (pia) pia.classList.add("act");
      const clr = this.modalEl.querySelector(".search-input-clear-button");
      if (clr) clr.classList.add("act");
      const pr = this.modalEl.querySelector(".prompt-results");
      if (pr) pr.classList.add("act");

      // Ensure only one bottom action row exists
      try {
        const existingRow = this.modalEl.querySelector(
          "#act-prompt-bottom-row",
        );
        if (existingRow) existingRow.remove();
      } catch (_) {}

      // Add buttons below suggestions
      const buttonRow = document.createElement("div");
      buttonRow.id = "act-prompt-bottom-row";
      buttonRow.classList.add("act-prompt-bottom-row");

      // Limit input on the left (copied from settings BlacklistRegexTesterModal)
      const limitInput = document.createElement("input");
      limitInput.type = "text";
      limitInput.value = "0";
      limitInput.placeholder = this.plugin.t(
        "limit_input_placeholder",
        "limit",
      );
      limitInput.title = this.plugin.t(
        "limit_input_tooltip",
        "0=all; number=last N; sw=starts; ew=ends; e=exact",
      );
      limitInput.classList.add("act-limit-input");
      debugLog("LIMIT", "Created limit input element");
      // Make input fully interactive
      limitInput.addEventListener(
        "mousedown",
        (e) => {
          debugLog("LIMIT", "mousedown fired");
          // Don't stop propagation on left-click, only on right-click to focus properly on searchbar
          if (e.button === 2) {
            e.stopPropagation();
          }
        },
        false,
      );
      limitInput.addEventListener(
        "mouseup",
        (e) => {
          debugLog("LIMIT", "mouseup fired");
          // Don't stop propagation - allow normal event flow
        },
        false,
      );
      limitInput.addEventListener(
        "click",
        (e) => {
          debugLog("LIMIT", "click fired, attempting focus");
          // Don't stop propagation on click - allows other elements to get clicks
          // Force focus
          setTimeout(() => {
            limitInput.focus();
            debugLog("LIMIT", "force focused input");
          }, 0);
        },
        false,
      );
      limitInput.addEventListener(
        "focus",
        (e) => {
          debugLog("LIMIT", "focus fired");
          // Don't stop propagation on focus
        },
        false,
      );
      limitInput.addEventListener(
        "pointerdown",
        (e) => {
          debugLog("LIMIT", "pointerdown fired");
          // Only stop propagation on right-click
          if (e.button === 2) {
            e.stopPropagation();
          }
        },
        false,
      );
      limitInput.addEventListener(
        "dblclick",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          limitInput.select();
          debugLog("LIMIT", "dblclick fired, text selected");
        },
        false,
      );

      // Store the original getItems and filter based on limit input
      const originalGetItems = this.getItems.bind(this);
      let allItems = [];
      // Preserve previous addNewEntry to restore on close and avoid stacking wrappers
      this._prevAddNewEntry = this.plugin.addNewEntry;
      const originalAddNewEntry = this.plugin.addNewEntry.bind(this.plugin);
      this.plugin.addNewEntry = async function (...args) {
        // Call original and wait for it to complete
        const result = await originalAddNewEntry(...args);
        // Track the most recent entry's uid (last one in wordEntries array)
        const we = this.settings.wordEntries || [];
        if (we.length > 0) {
          // Find the modal and update its tracking variable
          const modalThis = this;
          for (let i = 0; i < (this.openModals?.length || 0); i++) {
            const m = this.openModals[i];
            if (m instanceof AddToExistingEntryModal) {
              m._lastAddedEntryUid = we[we.length - 1].uid;
              debugLog(
                "LIMIT",
                "Tracked new entry uid in modal:",
                m._lastAddedEntryUid,
              );
              break;
            }
          }
        }
        return result;
      };
      this.getItems = () => {
        debugLog("LIMIT", "getItems called");
        allItems = originalGetItems();
        const raw = String(limitInput.value || "")
          .trim()
          .toLowerCase();
        debugLog(
          "LIMIT",
          "raw limit value:",
          raw,
          "allItems count:",
          allItems.length,
        );

        // Debug: log first item structure to see what properties are available
        if (allItems.length > 0 && raw === "sw") {
          const entry = allItems[0].entry;
          debugLog(
            "LIMIT",
            "First item match props:",
            "match:",
            entry?.match,
            "matchMode:",
            entry?.matchMode,
            "matchType:",
            entry?.matchType,
          );
        }

        // No filter
        if (!raw || raw === "0") {
          debugLog("LIMIT", "no filter, returning all items:", allItems.length);
          return allItems;
        }

        // Parse tokens: split by spaces and/or commas
        const parts = raw.split(/[\s,]+/).filter(Boolean);
        debugLog("LIMIT", "parsed parts:", parts);

        // Extract numeric limit from parts
        const numPart = parts.find((p) => /^\d+$/.test(p));
        const limit = numPart ? parseInt(numPart, 10) : 0;

        // Extract filter tokens
        const filterTokens = parts.filter((p) => !/^\d+$/.test(p));

        // Check which style filters are active
        const hasRegexFilter = filterTokens.includes("r");
        const hasWordFilter = filterTokens.includes("w");
        const hasHighlightFilter = filterTokens.includes("h");
        const hasColorFilter = filterTokens.includes("c");
        const hasBothFilter = filterTokens.includes("b");

        // Check which match mode filters are active (can have multiple now)
        const hasStartsWith = filterTokens.includes("sw");
        const hasEndsWith = filterTokens.includes("ew");
        const hasExact = filterTokens.includes("e");

        // Separate last added entry from the rest
        let lastAddedItem = null;
        let filtered = allItems;

        if (this._lastAddedEntryUid) {
          const lastIndex = allItems.findIndex(
            (item) => item.entry?.uid === this._lastAddedEntryUid,
          );
          if (lastIndex >= 0) {
            lastAddedItem = allItems[lastIndex];
            filtered = allItems.filter((_, idx) => idx !== lastIndex);
            debugLog(
              "LIMIT",
              "Separated last added entry, remaining items:",
              filtered.length,
            );
          }
        }

        // Apply style filters (only one can be active)
        if (hasRegexFilter) {
          filtered = filtered.filter(
            (item) => item.entry && item.entry.isRegex,
          );
          debugLog("LIMIT", "regex filter: found", filtered.length, "items");
        } else if (hasWordFilter) {
          filtered = filtered.filter(
            (item) => item.entry && !item.entry.isRegex,
          );
          debugLog("LIMIT", "word filter: found", filtered.length, "items");
        } else if (hasHighlightFilter) {
          filtered = filtered.filter(
            (item) =>
              item.entry && !item.entry.isRegex && item.style === "highlight",
          );
          debugLog(
            "LIMIT",
            "highlight filter: found",
            filtered.length,
            "items",
          );
        } else if (hasColorFilter) {
          filtered = filtered.filter(
            (item) =>
              item.entry && !item.entry.isRegex && item.style === "color",
          );
          debugLog("LIMIT", "color filter: found", filtered.length, "items");
        } else if (hasBothFilter) {
          filtered = filtered.filter(
            (item) =>
              item.entry && !item.entry.isRegex && item.style === "both",
          );
          debugLog("LIMIT", "both filter: found", filtered.length, "items");
        }

        // Apply match mode filters - ANY active filter matches (OR logic)
        if (hasStartsWith || hasEndsWith || hasExact) {
          filtered = filtered.filter((item) => {
            const match =
              item.entry?.match ||
              item.entry?.matchMode ||
              item.entry?.matchType;
            let matches = false;
            if (hasStartsWith) matches = matches || match === "startswith";
            if (hasEndsWith) matches = matches || match === "endswith";
            if (hasExact) matches = matches || match === "exact";
            return matches;
          });
          debugLog(
            "LIMIT",
            "match mode filter (sw:",
            hasStartsWith,
            "ew:",
            hasEndsWith,
            "e:",
            hasExact,
            "): found",
            filtered.length,
            "items",
          );
        }

        // Apply numeric limit (last N items)
        if (limit > 0) {
          debugLog("LIMIT", "filtering to last", limit, "items");
          filtered = filtered.slice(-limit);
        }

        // Always prepend the last added entry to the results (it appears first)
        if (lastAddedItem) {
          filtered = [lastAddedItem, ...filtered];
          debugLog(
            "LIMIT",
            "Prepended last added entry, total items:",
            filtered.length,
          );
        }

        return filtered;
      };

      // Add listener to limit input that rerenders suggestions
      limitInput.addEventListener(
        "input",
        () => {
          debugLog("LIMIT", "input event fired, value:", limitInput.value);
          debugLog("LIMIT", "dispatching input event on searchbar");
          // Trigger the suggestion list to rerender
          this.inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        },
        false,
      );

      debugLog("LIMIT", "appending limit input to button row");
      buttonRow.appendChild(limitInput);

      // Spacer to push buttons to the right
      const spacer = document.createElement("div");
      spacer.classList.add("act-flex-spacer");
      buttonRow.appendChild(spacer);

      // Add Word button (no flex)
      const addWordBtn = document.createElement("button");
      addWordBtn.textContent = this.plugin.t("btn_add_word", "+ Add Word");
      addWordBtn.classList.add("act-modal-action-btn");
      addWordBtn.addEventListener(
        "mousedown",
        (e) => {
          e.stopPropagation();
          e.stopImmediatePropagation();
        },
        true,
      );
      addWordBtn.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          // Open color picker for new word entry with selected text prefilled
          const modal = new ColorPickerModal(
            this.app,
            this.plugin,
            async (color, result) => {
              const selColor =
                color && this.plugin.isValidHexColor(color)
                  ? color
                  : result &&
                      result.textColor &&
                      this.plugin.isValidHexColor(result.textColor)
                    ? result.textColor
                    : null;
              if (!selColor) return;
              const selGroupUid =
                result && result.selectedGroupUid
                  ? result.selectedGroupUid
                  : null;
              const matchType =
                result && result.matchType
                  ? result.matchType
                  : this.plugin.settings.partialMatch
                    ? "contains"
                    : "exact";
              const word = this.selectedText;
              if (selGroupUid) {
                const group = Array.isArray(
                  this.plugin.settings.wordEntryGroups,
                )
                  ? this.plugin.settings.wordEntryGroups.find(
                      (g) => g && g.uid === selGroupUid,
                    )
                  : null;
                if (group) {
                  if (!Array.isArray(group.entries)) group.entries = [];
                  const newEntry = {
                    pattern: word,
                    color: selColor,
                    isRegex: false,
                    flags: "",
                    styleType: "text",
                    matchType,
                  };
                  try {
                    newEntry.uid =
                      Date.now().toString(36) +
                      Math.random().toString(36).slice(2);
                  } catch (_) {
                    newEntry.uid = Date.now();
                  }
                  group.entries.push(newEntry);
                  this._lastAddedEntryUid = newEntry.uid;
                  try {
                    this.inputEl.dispatchEvent(
                      new Event("input", { bubbles: true }),
                    );
                  } catch (_) {}
                  await this.plugin.saveSettings();
                  this.plugin.compileWordEntries();
                } else {
                  await this.plugin.addNewEntry(word, selColor, false);
                }
              } else {
                await this.plugin.addNewEntry(word, selColor, false);
              }
              try {
                this.plugin.refreshEditor(this.view, true);
              } catch (_) {}
            },
            "text",
            this.selectedText,
          );
          modal.open();
        },
        true,
      );
      buttonRow.appendChild(addWordBtn);

      // Add Regex button (only if regex support enabled)
      if (this.plugin.settings.enableRegexSupport) {
        const addRegexBtn = document.createElement("button");
        addRegexBtn.textContent = this.plugin.t(
          "btn_add_regex_short",
          "+ Add Regex",
        );
        addRegexBtn.classList.add("act-modal-action-btn");
        addRegexBtn.addEventListener(
          "mousedown",
          (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
          },
          true,
        );
        addRegexBtn.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            new BlacklistRegexTesterModal(
              this.app,
              this.plugin,
              async (pattern, flags, name) => {
                // Track the new entry's uid BEFORE calling addNewEntry
                const currentLength =
                  this.plugin.settings.wordEntries?.length || 0;
                await this.plugin.addNewEntry(
                  pattern,
                  "#ff0000",
                  true,
                  flags,
                  name,
                );
                // After addNewEntry completes, the new entry is at the end
                const we = this.plugin.settings.wordEntries || [];
                if (we.length > currentLength) {
                  // New entry was added, store its uid for the filter to show it
                  this._lastAddedEntryUid = we[we.length - 1].uid;
                  debugLog(
                    "LIMIT",
                    "Set _lastAddedEntryUid for new regex entry:",
                    this._lastAddedEntryUid,
                  );
                  // Trigger the suggestion list to rerender so the new entry appears
                  this.inputEl.dispatchEvent(
                    new Event("input", { bubbles: true }),
                  );
                }
                try {
                  this.plugin.refreshEditor(this.view, true);
                } catch (_) {}
              },
            ).open();
          },
          true,
        );
        buttonRow.appendChild(addRegexBtn);
      }

      // Insert button row after prompt-results
      const pr_el = this.modalEl.querySelector(".prompt-results");
      if (pr_el && pr_el.parentNode) {
        pr_el.parentNode.insertBefore(buttonRow, pr_el.nextSibling);
      }
      let style = document.getElementById("act-suggest-modal");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-suggest-modal";
        style.textContent = `
          .prompt.act .suggestion-item.mod-complex { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
          .prompt.act .suggestion-content { display: flex; align-items: center; gap: 6px; }
          .prompt.act .suggestion-title { display: inline-flex; gap: 6px; }
          .prompt.act .suggestion-title span { color: var(--text-normal); }
          .prompt.act .suggestion-aux { display: inline-flex; align-items: center; }
          .prompt.act kbd.suggestion-hotkey.act { opacity: 0.9; }
        `;
        document.head.appendChild(style);
      }

      // Intercept right-click events on suggestion items to prevent modal from closing
      const suggestionsContainer =
        this.modalEl.querySelector(".prompt-results");
      if (suggestionsContainer) {
        // Track right-click state early in the event chain
        const setRightClickFlag = (evt) => {
          this._isRightClick = evt && evt.button === 2;
        };
        const clearRightClickFlag = () => {
          this._isRightClick = false;
        };

        // Capture on the modal root to stop Obsidian editor menu early
        const captureRightClick = (evt) => {
          // Don't interfere with limit input
          if (evt.target === limitInput || limitInput.contains(evt.target)) {
            debugLog(
              "LIMIT",
              "mousedown/pointerdown on limit input, skipping capture",
            );
            return;
          }
          if (evt && evt.button === 2) {
            setRightClickFlag(evt);
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            evt.returnValue = false;
          }
        };
        const suppressContextMenu = (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          evt.returnValue = false;
        };
        this._modalCaptureHandlers = [
          {
            el: this.modalEl,
            event: "mousedown",
            handler: captureRightClick,
            opts: true,
          },
          {
            el: this.modalEl,
            event: "pointerdown",
            handler: captureRightClick,
            opts: true,
          },
          {
            el: this.modalEl,
            event: "mouseup",
            handler: captureRightClick,
            opts: true,
          },
          {
            el: this.modalEl,
            event: "contextmenu",
            handler: suppressContextMenu,
            opts: true,
          },
        ];
        this._modalClickSuppress = (evt) => {
          // Don't suppress clicks on limit input or searchbar
          if (evt.target === limitInput || limitInput.contains(evt.target)) {
            debugLog("LIMIT", "click on limit input, not suppressing");
            return;
          }
          // Also allow searchbar to get clicks and force focus
          if (
            evt.target === this.inputEl ||
            this.inputEl.contains(evt.target)
          ) {
            debugLog("LIMIT", "click on searchbar, forcing focus");
            setTimeout(() => {
              this.inputEl.focus();
              debugLog("LIMIT", "forced searchbar focus");
            }, 0);
            return;
          }
          if (this._isRightClick) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            evt.returnValue = false;
            clearRightClickFlag();
          }
        };
        this.modalEl.addEventListener("click", this._modalClickSuppress, true);
        this._modalCaptureHandlers.forEach((h) => {
          h.el.addEventListener(h.event, h.handler, h.opts);
        });

        suggestionsContainer.addEventListener(
          "mousedown",
          (evt) => {
            // Skip if clicking on limit input
            if (evt.target === limitInput || limitInput.contains(evt.target)) {
              debugLog(
                "LIMIT",
                "mousedown on limit input in suggestionsContainer handler, skipping",
              );
              return;
            }
            setRightClickFlag(evt);
            if (evt.button === 2) {
              // Right-click
              evt.preventDefault();
              evt.stopPropagation();
              evt.stopImmediatePropagation();
              evt.returnValue = false;
            }
          },
          true,
        ); // Use capture phase to intercept before other handlers

        suggestionsContainer.addEventListener(
          "pointerdown",
          (evt) => {
            setRightClickFlag(evt);
            if (evt.button === 2) {
              evt.preventDefault();
              evt.stopPropagation();
              evt.stopImmediatePropagation();
              evt.returnValue = false;
            }
          },
          true,
        );

        suggestionsContainer.addEventListener(
          "mouseup",
          (evt) => {
            if (evt.button === 2) {
              // Right-click
              evt.preventDefault();
              evt.stopPropagation();
              evt.stopImmediatePropagation();
              evt.returnValue = false;
            }
            clearRightClickFlag();
          },
          true,
        ); // Use capture phase

        // Block click choosing when the last press was a right-click
        suggestionsContainer.addEventListener(
          "click",
          (evt) => {
            if (this._isRightClick) {
              evt.preventDefault();
              evt.stopPropagation();
              evt.stopImmediatePropagation();
              evt.returnValue = false;
              clearRightClickFlag();
            }
          },
          true,
        );

        // Prevent bubbling of contextmenu to base modal
        suggestionsContainer.addEventListener(
          "contextmenu",
          (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            evt.returnValue = false;
          },
          true,
        );
      }

      this._docCtx = (evt) => {
        try {
          if (this.modalEl && this.modalEl.contains(evt.target)) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            evt.returnValue = false;
          }
        } catch (_) {}
      };
      document.addEventListener("contextmenu", this._docCtx, true);
      document.addEventListener("mousedown", this._docCtx, true);
      document.addEventListener("pointerdown", this._docCtx, true);
      this._docAux = (evt) => {
        if (evt && evt.button === 2) {
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          evt.returnValue = false;
        }
      };
      document.addEventListener("auxclick", this._docAux, true);

      // BRUTE FORCE: Listen for contextmenu (right-click) on suggestions
      this._docRightClick = (evt) => {
        debugLog(
          "RIGHTCLICK",
          "DOC-RIGHTCLICK - CONTEXTMENU FIRED!",
          evt.target,
        );

        const target = evt.target;
        debugLog("RIGHTCLICK", "checking target:", {
          className: target.className,
          tagName: target.tagName,
        });

        if (!target) return;

        // Check if the clicked element is within a suggestion item - try multiple selectors
        let suggestionEl = target.closest('[class*="suggestion-item"]');
        if (!suggestionEl) suggestionEl = target.closest(".suggestion-item");
        if (
          !suggestionEl &&
          target.classList &&
          target.classList.contains("suggestion-item")
        )
          suggestionEl = target;

        debugLog("RIGHTCLICK", "suggestionEl found:", !!suggestionEl, {
          suggestionEl,
        });

        if (suggestionEl) {
          debugLog("RIGHTCLICK", "Checking if in modal...");
          const inModal = this.modalEl && this.modalEl.contains(suggestionEl);
          debugLog("RIGHTCLICK", "inModal:", inModal);

          if (inModal) {
            debugLog(
              "RIGHTCLICK",
              "*** FOUND SUGGESTION IN MODAL, SHOWING MENU ***",
            );
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            evt.returnValue = false;

            // Find the rendered item data
            const items = this.getItems();
            debugLog("RIGHTCLICK", "Got items:", items.length);

            const allSuggestions = Array.from(
              this.modalEl.querySelectorAll('[class*="suggestion-item"]'),
            );
            debugLog(
              "RIGHTCLICK",
              "Found suggestion elements:",
              allSuggestions.length,
            );

            const idx = allSuggestions.indexOf(suggestionEl);
            debugLog("RIGHTCLICK", "Item index:", idx);

            if (idx >= 0 && items[idx]) {
              debugLog("RIGHTCLICK", "Creating menu for:", items[idx].label);
              const actualItem = items[idx];

              // Use setTimeout to ensure menu shows after event handling
              setTimeout(() => {
                const menu = new Menu();
                debugLog("RIGHTCLICK", "Menu created");
                debugLog(
                  "RIGHTCLICK",
                  "actualItem:",
                  JSON.stringify(actualItem, null, 2),
                );
                debugLog(
                  "RIGHTCLICK",
                  "actualItem.entry.isRegex:",
                  actualItem.entry?.isRegex,
                );

                // Edit entry
                menu.addItem((item) => {
                  item
                    .setTitle(this.plugin.t("edit_entry_header", "Edit Entry"))
                    .setIcon("pencil")
                    .onClick(() => {
                      debugLog("RIGHTCLICK", "Edit entry clicked");
                      this.close();
                      try {
                        this.plugin.settingTab.display();
                        const searchInput = document.querySelector(
                          '.setting-item input[placeholder*="search"], .setting-search input',
                        );
                        if (searchInput) {
                          searchInput.value = actualItem.label;
                          searchInput.dispatchEvent(
                            new Event("input", { bubbles: true }),
                          );
                        }
                      } catch (_) {}
                    });
                });

                // Open in Regex Tester (only for regex items)
                if (actualItem.entry && actualItem.entry.isRegex) {
                  menu.addItem((item) => {
                    item
                      .setTitle(
                        this.plugin.t(
                          "open_in_regex_tester",
                          "Open in Regex Tester",
                        ),
                      )
                      .setIcon("code")
                      .onClick(() => {
                        const entry = actualItem.entry;
                        const modal = new RealTimeRegexTesterModal(
                          this.app,
                          this.plugin,
                          async (updatedEntry) => {
                            // Entry has already been updated by the modal's save handler
                          },
                          null,
                        );
                        // Prefill the modal fields with the entry's current values
                        modal._editingEntry = entry;
                        modal._preFillPattern = entry.pattern || "";
                        modal._preFillFlags = entry.flags || "";
                        modal._preFillName = entry.presetLabel || "";
                        modal._preFillStyleType = entry.styleType || "both";
                        modal._preFillTextColor =
                          (entry.textColor && entry.textColor !== "currentColor"
                            ? entry.textColor
                            : this.plugin.isValidHexColor(entry.color)
                              ? entry.color
                              : "#87c760") || "#87c760";
                        modal._preFillBgColor =
                          entry.backgroundColor || "#1d5010";
                        // Store reference to parent modal so we can refresh it after save
                        modal._parentModal = this;
                        modal.open();
                      });
                  });
                }

                // Delete entry
                menu.addItem((item) => {
                  item
                    .setTitle(
                      this.plugin.t("context_delete_entry", "Delete entry"),
                    )
                    .setIcon("trash")
                    .onClick(async () => {
                      debugLog("RIGHTCLICK", "Delete entry clicked");
                      const entry = actualItem.entry;
                      const entryUid = entry.uid;

                      let foundIdx = -1;
                      let foundArray = null;

                      for (
                        let i = 0;
                        i < this.plugin.settings.wordEntries.length;
                        i++
                      ) {
                        if (
                          this.plugin.settings.wordEntries[i].uid === entryUid
                        ) {
                          foundIdx = i;
                          foundArray = this.plugin.settings.wordEntries;
                          break;
                        }
                      }

                      if (foundIdx === -1) {
                        for (
                          let i = 0;
                          i < this.plugin.settings.textBgColoringEntries.length;
                          i++
                        ) {
                          if (
                            this.plugin.settings.textBgColoringEntries[i]
                              .uid === entryUid
                          ) {
                            foundIdx = i;
                            foundArray =
                              this.plugin.settings.textBgColoringEntries;
                            break;
                          }
                        }
                      }

                      if (foundIdx >= 0 && foundArray) {
                        foundArray.splice(foundIdx, 1);
                        await this.plugin.saveSettings();
                        this.plugin.compileWordEntries();
                        this.plugin.compileTextBgColoringEntries();
                        try {
                          this.plugin.reconfigureEditorExtensions();
                        } catch (_) {}
                        try {
                          this.plugin.refreshEditor(this.view, true);
                        } catch (_) {}
                        this.refreshSuggestions();
                        new Notice(`Entry "${actualItem.label}" deleted`);
                      }
                    });
                });

                // Duplicate entry
                menu.addItem((item) => {
                  item
                    .setTitle(
                      this.plugin.t("duplicate_entry", "Duplicate Entry"),
                    )
                    .setIcon("copy")
                    .onClick(async () => {
                      debugLog("RIGHTCLICK", "Duplicate entry clicked");
                      try {
                        const entry = actualItem.entry;
                        const dup = JSON.parse(JSON.stringify(entry));
                        const targetArray =
                          this.plugin.settings.wordEntries.includes(entry)
                            ? this.plugin.settings.wordEntries
                            : this.plugin.settings.textBgColoringEntries;
                        targetArray.push(dup);
                        await this.plugin.saveSettings();
                        this.plugin.compileWordEntries();
                        this.plugin.compileTextBgColoringEntries();
                        try {
                          this.plugin.reconfigureEditorExtensions();
                        } catch (_) {}
                        try {
                          this.plugin.refreshEditor(this.view, true);
                        } catch (_) {}
                        this.refreshSuggestions();
                        new Notice(
                          this.plugin.t(
                            "notice_entry_duplicated",
                            "Entry duplicated",
                          ),
                        );
                        this.close();
                        new AddToExistingEntryModal(
                          this.app,
                          this.plugin,
                          this.selectedText,
                          this.view,
                        ).open();
                      } catch (e) {
                        debugError("RIGHTCLICK", "duplicate entry error", e);
                      }
                    });
                });

                // Remove word from entry
                const entry = actualItem.entry;
                const matchesWord = () => {
                  if (entry.isRegex) return false;
                  const cmp = (a, b) => {
                    if (this.plugin.settings.caseSensitive)
                      return String(a) === String(b);
                    return String(a).toLowerCase() === String(b).toLowerCase();
                  };
                  if (cmp(entry.pattern, this.selectedText)) return true;
                  if (
                    Array.isArray(entry.groupedPatterns) &&
                    entry.groupedPatterns.some((p) => cmp(p, this.selectedText))
                  )
                    return true;
                  return false;
                };

                if (matchesWord()) {
                  menu.addItem((item) => {
                    item
                      .setTitle(
                        this.plugin
                          .t(
                            "context_remove_from_entry",
                            'Remove "{word}" from entry',
                          )
                          .replace("{word}", this.selectedText),
                      )
                      .setIcon("minus")
                      .onClick(async () => {
                        debugLog("RIGHTCLICK", "Remove word clicked");
                        if (Array.isArray(entry.groupedPatterns)) {
                          entry.groupedPatterns = entry.groupedPatterns.filter(
                            (p) => {
                              const cmp = this.plugin.settings.caseSensitive
                                ? String(p) === String(this.selectedText)
                                : String(p).toLowerCase() ===
                                  String(this.selectedText).toLowerCase();
                              return !cmp;
                            },
                          );
                        } else {
                          entry.pattern = "";
                        }
                        await this.plugin.saveSettings();
                        this.plugin.compileWordEntries();
                        this.plugin.compileTextBgColoringEntries();
                        try {
                          this.plugin.reconfigureEditorExtensions();
                        } catch (_) {}
                        try {
                          this.plugin.refreshEditor(this.view, true);
                        } catch (_) {}
                        this.refreshSuggestions();
                        new Notice(`"${this.selectedText}" removed from entry`);
                      });
                  });
                }

                debugLog("RIGHTCLICK", "Showing menu");
                menu.showAtMouseEvent(evt);
                menu.dom.classList.add("act-menu-elevated");
              }, 0);
            }
          }
        }
      };
      debugLog(
        "ATTACH",
        "Attaching modalEl contextmenu listener for right-click",
      );
      if (this.modalEl) {
        this.modalEl.addEventListener("contextmenu", this._docRightClick, true);
      }

      // Trigger initial suggestion display without requiring user input
      setTimeout(() => {
        try {
          this.updateSuggestions();
        } catch (_) {}
      }, 100);
    } catch (_) {}
  }
  onClose() {
    try {
      // Remove all document-level listeners
      if (this._docCtx) {
        document.removeEventListener("contextmenu", this._docCtx, true);
        document.removeEventListener("mousedown", this._docCtx, true);
        document.removeEventListener("pointerdown", this._docCtx, true);
        this._docCtx = null;
      }
      if (this._docAux) {
        document.removeEventListener("auxclick", this._docAux, true);
        this._docAux = null;
      }
      if (this._docRightClick && this.modalEl) {
        this.modalEl.removeEventListener(
          "contextmenu",
          this._docRightClick,
          true,
        );
        this._docRightClick = null;
      }
      // Remove bottom action row
      try {
        const existingRow =
          this.modalEl && this.modalEl.querySelector
            ? this.modalEl.querySelector("#act-prompt-bottom-row")
            : null;
        if (existingRow) existingRow.remove();
      } catch (_) {}
      // Restore original addNewEntry
      try {
        if (this._prevAddNewEntry) {
          this.plugin.addNewEntry = this._prevAddNewEntry;
          this._prevAddNewEntry = null;
        }
      } catch (_) {}
      // Remove modal capture handlers
      if (
        this._modalCaptureHandlers &&
        Array.isArray(this._modalCaptureHandlers)
      ) {
        this._modalCaptureHandlers.forEach((h) => {
          try {
            h.el &&
              h.el.removeEventListener &&
              h.el.removeEventListener(h.event, h.handler, h.opts);
          } catch (_) {}
        });
        this._modalCaptureHandlers = [];
      }
      if (this._modalClickSuppress && this.modalEl) {
        this.modalEl.removeEventListener(
          "click",
          this._modalClickSuppress,
          true,
        );
        this._modalClickSuppress = null;
      }
      if (
        this._suggestionsContainerHandlers &&
        Array.isArray(this._suggestionsContainerHandlers)
      ) {
        this._suggestionsContainerHandlers.forEach((h) => {
          try {
            h.el &&
              h.el.removeEventListener &&
              h.el.removeEventListener(h.event, h.handler, h.opts);
          } catch (_) {}
        });
        this._suggestionsContainerHandlers = [];
      }
      if (this._menuReferences && Array.isArray(this._menuReferences)) {
        this._menuReferences.forEach((menu) => {
          try {
            menu && menu.dom && menu.dom.remove && menu.dom.remove();
          } catch (_) {}
        });
        this._menuReferences = [];
      }
    } catch (_) {}
    this._isRightClick = false;
    super.onClose();
  }
  getItems() {
    const items = [];
    const lastUid = this._lastAddedEntryUid;

    const pushEntry = (e, extra) => {
      if (!e) return;
      if (!e.uid) {
        try {
          e.uid =
            Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (_) {
          e.uid = Date.now();
        }
      }
      let label = "";
      if (e.isRegex) {
        const patRaw = String(e.pattern || "");
        const patTrim = patRaw.trim();
        if (!patTrim) {
          if (e.uid !== lastUid) return;
          label = e.presetLabel ? String(e.presetLabel) : "[new regex]";
        } else {
          const name = e.presetLabel ? String(e.presetLabel) : "regex";
          label = `${name}: ${patTrim}`;
        }
      } else {
        const patsArr =
          Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
            ? e.groupedPatterns
            : [String(e.pattern || "").trim()];
        const pats = patsArr
          .map((x) => String(x || "").trim())
          .filter((x) => x.length > 0);
        if (pats.length === 0) {
          if (e.uid !== lastUid) return;
          label = "[new entry]";
        } else {
          label = pats.join(", ");
        }
      }
      label = String(label || "").trim();
      if (!label) return;
      let st = "color";
      if (e.styleType === "text") st = "color";
      else if (e.styleType === "highlight") st = "highlight";
      else if (e.styleType === "both") st = "both";
      else {
        const hasBg = !!e.backgroundColor;
        const hasText =
          (!!e.color && String(e.color).trim() !== "") ||
          (!!e.textColor && e.textColor && e.textColor !== "currentColor");
        st = hasBg && hasText ? "both" : hasBg ? "highlight" : "color";
      }
      items.push({ entry: e, label, style: st, ...extra });
    };

    // Add entries from main word list
    const we = Array.isArray(this.plugin.settings.wordEntries)
      ? this.plugin.settings.wordEntries
      : [];
    for (const e of we) pushEntry(e, null);

    // Add entries from active word groups (show their texts in the list)
    const hideInactive = !!this.plugin.settings.hideInactiveGroupsInDropdowns;
    const groups = Array.isArray(this.plugin.settings.wordEntryGroups)
      ? this.plugin.settings.wordEntryGroups
      : [];
    for (const g of groups) {
      if (!g) continue;
      if (hideInactive && g.active === false) continue;
      if (!Array.isArray(g.entries)) continue;
      for (const ge of g.entries) {
        pushEntry(ge, { _groupUid: g.uid || null });
      }
    }
    // Sort items alphabetically by label (case-insensitive)
    items.sort((a, b) =>
      String(a.label)
        .toLowerCase()
        .localeCompare(String(b.label).toLowerCase()),
    );
    return items;
  }
  getItemText(item) {
    return String(item.label || "");
  }
  refreshSuggestions() {
    // Refresh the suggestions list by rebuilding from current items
    try {
      const currentItems = this.getItems();
      this._updateSuggestions(currentItems);
    } catch (e) {
      debugLog("REFRESH", "Error refreshing suggestions:", e);
    }
  }
  renderSuggestion(item, el) {
    // FuzzySuggestModal wraps items, so access the actual item via item.item
    const actualItem = item.item || item;
    try {
      el.empty();
    } catch (_) {
      el.textContent = "";
    }
    try {
      el.classList.add("mod-complex");
    } catch (_) {}
    try {
      el.classList.add("act");
    } catch (_) {}
    const content = el.createDiv({ cls: "suggestion-content act" });
    const title = content.createDiv({ cls: "suggestion-title act" });
    title.createEl("span", { text: actualItem.label });
    const aux = el.createDiv({ cls: "suggestion-aux act" });
    const textMap = { color: "color", highlight: "highlight", both: "both" };
    const k = aux.createEl("kbd", {
      text: textMap[actualItem.style] || "color",
    });
    try {
      k.classList.add("suggestion-hotkey");
    } catch (_) {}
    try {
      k.classList.add("act");
    } catch (_) {}

    // Prevent onChooseItem from firing on right-click and keep modal open
    el.addEventListener("mousedown", (evt) => {
      if (evt.button === 2) {
        // 2 = right mouse button
        // Don't prevent default for right-click - let contextmenu event fire
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        this._isRightClick = true;
      }
    });

    el.addEventListener("pointerdown", (evt) => {
      if (evt.button === 2) {
        debugLog("ELEMENT", "pointerdown with button 2 detected");
        // Don't prevent default for right-click - let contextmenu event fire
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        this._isRightClick = true;
      }
    });

    el.addEventListener("mouseup", (evt) => {
      if (evt.button === 2) {
        // 2 = right mouse button
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        this._isRightClick = false;
      }
    });

    el.addEventListener("click", (evt) => {
      if (this._isRightClick) {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        this._isRightClick = false;
      }
    });

    // Add right-click context menu
    el.addEventListener(
      "contextmenu",
      (evt) => {
        debugLog("ELEMENT", "RENDER-CONTEXTMENU EVENT FIRED");
        debugLog("ELEMENT", "contextmenu event fired on element");
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();

        debugLog("ELEMENT", "showing menu for:", actualItem.label);
        debugLog("ELEMENT", "actualItem:", JSON.stringify(actualItem, null, 2));
        debugLog(
          "ELEMENT",
          "actualItem.entry.isRegex:",
          actualItem.entry?.isRegex,
        );
        const menu = new Menu();

        // Edit entry
        menu.addItem((item) => {
          item
            .setTitle(this.plugin.t("edit_entry_header", "Edit Entry"))
            .setIcon("pencil")
            .onClick(() => {
              // Open EditEntryModal without closing the prompt - keeps it interactive
              let entry = actualItem.entry;
              // Ensure entry has a UID
              if (entry && !entry.uid) {
                try {
                  entry.uid =
                    Date.now().toString(36) +
                    Math.random().toString(36).slice(2);
                } catch (_) {
                  entry.uid = Date.now();
                }
              }
              // Reload entry from settings by UID to ensure all properties (including custom styling) are present
              if (entry && entry.uid) {
                let reloadedEntry =
                  this.plugin.settings.wordEntries.find(
                    (e) => e && e.uid === entry.uid,
                  ) ||
                  this.plugin.settings.textBgColoringEntries.find(
                    (e) => e && e.uid === entry.uid,
                  );
                // Also search in word groups
                if (
                  !reloadedEntry &&
                  Array.isArray(this.plugin.settings.wordEntryGroups)
                ) {
                  for (const group of this.plugin.settings.wordEntryGroups) {
                    if (Array.isArray(group.entries)) {
                      reloadedEntry = group.entries.find(
                        (e) => e && e.uid === entry.uid,
                      );
                      if (reloadedEntry) break;
                    }
                  }
                }
                if (reloadedEntry) {
                  entry = reloadedEntry;
                  debugLog(
                    "EDIT_ENTRY",
                    `Reloaded entry ${entry.uid}: opacity=${entry.backgroundOpacity}, radius=${entry.highlightBorderRadius}`,
                  );
                }
              }
              const modal = new EditEntryModal(
                this.app,
                this.plugin,
                entry,
                null,
                this,
              );
              modal.open();
            });
        });

        // Open in Regex Tester (only for regex items)
        if (actualItem.entry && actualItem.entry.isRegex) {
          menu.addItem((item) => {
            item
              .setTitle(
                this.plugin.t("open_in_regex_tester", "Open in Regex Tester"),
              )
              .setIcon("code")
              .onClick(() => {
                const entry = actualItem.entry;
                const modal = new RealTimeRegexTesterModal(
                  this.app,
                  this.plugin,
                  async (updatedEntry) => {
                    // Entry has already been updated by the modal's save handler
                  },
                  null,
                );
                // Prefill the modal fields with the entry's current values
                modal._editingEntry = entry;
                modal._preFillPattern = entry.pattern || "";
                modal._preFillFlags = entry.flags || "";
                modal._preFillName = entry.presetLabel || "";
                modal._preFillStyleType = entry.styleType || "both";
                modal._preFillTextColor =
                  (entry.textColor && entry.textColor !== "currentColor"
                    ? entry.textColor
                    : this.plugin.isValidHexColor(entry.color)
                      ? entry.color
                      : "#87c760") || "#87c760";
                modal._preFillBgColor = entry.backgroundColor || "#1d5010";
                // Store reference to parent modal so we can refresh it after save
                modal._parentModal = this;
                modal.open();
              });
          });
        }

        // Delete entry
        menu.addItem((item) => {
          item
            .setTitle(this.plugin.t("context_delete_entry", "Delete entry"))
            .setIcon("trash")
            .onClick(async () => {
              const entry = actualItem.entry;
              const entryUid = entry.uid;

              // Find by uid for reliability
              let foundIdx = -1;
              let foundArray = null;

              for (
                let i = 0;
                i < this.plugin.settings.wordEntries.length;
                i++
              ) {
                if (this.plugin.settings.wordEntries[i].uid === entryUid) {
                  foundIdx = i;
                  foundArray = this.plugin.settings.wordEntries;
                  break;
                }
              }

              if (foundIdx === -1) {
                for (
                  let i = 0;
                  i < this.plugin.settings.textBgColoringEntries.length;
                  i++
                ) {
                  if (
                    this.plugin.settings.textBgColoringEntries[i].uid ===
                    entryUid
                  ) {
                    foundIdx = i;
                    foundArray = this.plugin.settings.textBgColoringEntries;
                    break;
                  }
                }
              }

              if (foundIdx >= 0 && foundArray) {
                foundArray.splice(foundIdx, 1);
                await this.plugin.saveSettings();
                this.plugin.compileWordEntries();
                this.plugin.compileTextBgColoringEntries();
                try {
                  this.plugin.reconfigureEditorExtensions();
                } catch (_) {}
                try {
                  this.plugin.refreshEditor(this.view, true);
                } catch (_) {}
                new Notice(`Entry "${actualItem.label}" deleted`);
                this.close();
              }
            });
        });

        // Remove word from entry (only if selected word matches an entry pattern)
        const entry = actualItem.entry;
        const matchesWord = () => {
          if (entry.isRegex) return false;
          const cmp = (a, b) => {
            if (this.plugin.settings.caseSensitive)
              return String(a) === String(b);
            return String(a).toLowerCase() === String(b).toLowerCase();
          };
          // Check if selectedText matches any pattern in this entry
          if (cmp(entry.pattern, this.selectedText)) return true;
          if (
            Array.isArray(entry.groupedPatterns) &&
            entry.groupedPatterns.some((p) => cmp(p, this.selectedText))
          )
            return true;
          return false;
        };

        if (matchesWord()) {
          menu.addItem((item) => {
            item
              .setTitle(
                this.plugin
                  .t("context_remove_from_entry", 'Remove "{word}" from entry')
                  .replace("{word}", this.selectedText),
              )
              .setIcon("minus")
              .onClick(async () => {
                if (Array.isArray(entry.groupedPatterns)) {
                  entry.groupedPatterns = entry.groupedPatterns.filter((p) => {
                    const cmp = this.plugin.settings.caseSensitive
                      ? String(p) === String(this.selectedText)
                      : String(p).toLowerCase() ===
                        String(this.selectedText).toLowerCase();
                    return !cmp;
                  });
                } else {
                  entry.pattern = "";
                }
                await this.plugin.saveSettings();
                this.plugin.compileWordEntries();
                this.plugin.compileTextBgColoringEntries();
                try {
                  this.plugin.reconfigureEditorExtensions();
                } catch (_) {}
                try {
                  this.plugin.refreshEditor(this.view, true);
                } catch (_) {}
                new Notice(`"${this.selectedText}" removed from entry`);
                this.close();
              });
          });
        }

        // Close any existing menu before showing new one
        const existingMenus = document.querySelectorAll(".menu");
        existingMenus.forEach((m) => {
          if (m !== menu.dom) m.remove();
        });

        menu.showAtMouseEvent(evt);
        menu.dom.classList.add("act-menu-elevated");

        // Close menu when clicking elsewhere
        const closeMenu = (e) => {
          if (!menu.dom.contains(e.target) && e.target !== el) {
            menu.dom.remove();
            document.removeEventListener("click", closeMenu);
          }
        };
        setTimeout(() => {
          document.addEventListener("click", closeMenu);
        }, 100);
      },
      true,
    );

    // FALLBACK: pointerup with button 2 in case contextmenu doesn't fire
    el.addEventListener("pointerup", (evt) => {
      if (evt.button === 2) {
        debugLog("ELEMENT", "pointerup with button 2 - contextmenu fallback");
        debugLog(
          "ELEMENT",
          "actualItem in pointerup:",
          JSON.stringify(actualItem, null, 2),
        );
        debugLog(
          "ELEMENT",
          "actualItem.entry.isRegex in pointerup:",
          actualItem.entry?.isRegex,
        );
        // Manually create and show the menu
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();

        const menu = new Menu();

        // Edit entry
        menu.addItem((item) => {
          item
            .setTitle(this.plugin.t("edit_entry_header", "Edit Entry"))
            .setIcon("pencil")
            .onClick(() => {
              // Open EditEntryModal without closing the prompt - keeps it interactive
              let entry = actualItem.entry;
              // Ensure entry has a UID
              if (entry && !entry.uid) {
                try {
                  entry.uid =
                    Date.now().toString(36) +
                    Math.random().toString(36).slice(2);
                } catch (_) {
                  entry.uid = Date.now();
                }
              }
              // Reload entry from settings by UID to ensure all properties (including custom styling) are present
              if (entry && entry.uid) {
                let reloadedEntry =
                  this.plugin.settings.wordEntries.find(
                    (e) => e && e.uid === entry.uid,
                  ) ||
                  this.plugin.settings.textBgColoringEntries.find(
                    (e) => e && e.uid === entry.uid,
                  );
                // Also search in word groups
                if (
                  !reloadedEntry &&
                  Array.isArray(this.plugin.settings.wordEntryGroups)
                ) {
                  for (const group of this.plugin.settings.wordEntryGroups) {
                    if (Array.isArray(group.entries)) {
                      reloadedEntry = group.entries.find(
                        (e) => e && e.uid === entry.uid,
                      );
                      if (reloadedEntry) break;
                    }
                  }
                }
                if (reloadedEntry) {
                  entry = reloadedEntry;
                }
              }
              const modal = new EditEntryModal(
                this.app,
                this.plugin,
                entry,
                null,
                this,
              );
              modal.open();
            });
        });

        // Open in Regex Tester (only for regex items)
        if (actualItem.entry && actualItem.entry.isRegex) {
          menu.addItem((item) => {
            item
              .setTitle(
                this.plugin.t("open_in_regex_tester", "Open in Regex Tester"),
              )
              .setIcon("code")
              .onClick(() => {
                const entry = actualItem.entry;
                const modal = new RealTimeRegexTesterModal(
                  this.app,
                  this.plugin,
                  async (updatedEntry) => {
                    // Entry has already been updated by the modal's save handler
                  },
                  null,
                );
                // Prefill the modal fields with the entry's current values
                modal._editingEntry = entry;
                modal._preFillPattern = entry.pattern || "";
                modal._preFillFlags = entry.flags || "";
                modal._preFillName = entry.presetLabel || "";
                modal._preFillStyleType = entry.styleType || "both";
                modal._preFillTextColor =
                  (entry.textColor && entry.textColor !== "currentColor"
                    ? entry.textColor
                    : this.plugin.isValidHexColor(entry.color)
                      ? entry.color
                      : "#87c760") || "#87c760";
                modal._preFillBgColor = entry.backgroundColor || "#1d5010";
                // Store reference to parent modal so we can refresh it after save
                modal._parentModal = this;
                modal.open();
              });
          });
        }

        // Delete entry
        menu.addItem((item) => {
          item
            .setTitle(this.plugin.t("context_delete_entry", "Delete entry"))
            .setIcon("trash")
            .onClick(async () => {
              const entry = actualItem.entry;
              const entryUid = entry.uid;

              let foundIdx = -1;
              let foundArray = null;

              for (
                let i = 0;
                i < this.plugin.settings.wordEntries.length;
                i++
              ) {
                if (this.plugin.settings.wordEntries[i].uid === entryUid) {
                  foundIdx = i;
                  foundArray = this.plugin.settings.wordEntries;
                  break;
                }
              }

              if (foundIdx === -1) {
                for (
                  let i = 0;
                  i < this.plugin.settings.textBgColoringEntries.length;
                  i++
                ) {
                  if (
                    this.plugin.settings.textBgColoringEntries[i].uid ===
                    entryUid
                  ) {
                    foundIdx = i;
                    foundArray = this.plugin.settings.textBgColoringEntries;
                    break;
                  }
                }
              }

              if (foundIdx >= 0 && foundArray) {
                foundArray.splice(foundIdx, 1);
                await this.plugin.saveSettings();
                this.plugin.compileWordEntries();
                this.plugin.compileTextBgColoringEntries();
                try {
                  this.plugin.reconfigureEditorExtensions();
                } catch (_) {}
                try {
                  this.plugin.refreshEditor(this.view, true);
                } catch (_) {}
                new Notice(`Entry "${actualItem.label}" deleted`);
                this.close();
                new AddToExistingEntryModal(
                  this.app,
                  this.plugin,
                  this.selectedText,
                  this.view,
                ).open();
              }
            });
        });

        // Duplicate entry
        menu.addItem((item) => {
          item
            .setTitle(this.plugin.t("duplicate_entry", "Duplicate Entry"))
            .setIcon("copy")
            .onClick(async () => {
              try {
                const entry = actualItem.entry;
                const dup = JSON.parse(JSON.stringify(entry));
                const targetArray = this.plugin.settings.wordEntries.includes(
                  entry,
                )
                  ? this.plugin.settings.wordEntries
                  : this.plugin.settings.textBgColoringEntries;
                targetArray.push(dup);
                await this.plugin.saveSettings();
                this.plugin.compileWordEntries();
                this.plugin.compileTextBgColoringEntries();
                try {
                  this.plugin.reconfigureEditorExtensions();
                } catch (_) {}
                try {
                  this.plugin.refreshEditor(this.view, true);
                } catch (_) {}
                this.refreshSuggestions();
                new Notice(
                  this.plugin.t("notice_entry_duplicated", "Entry duplicated"),
                );
                this.close();
                new AddToExistingEntryModal(
                  this.app,
                  this.plugin,
                  this.selectedText,
                  this.view,
                ).open();
              } catch (e) {
                debugError("RIGHTCLICK", "duplicate entry error", e);
              }
            });
        });

        // Remove word
        const entry = actualItem.entry;
        const matchesWord = () => {
          if (entry.isRegex) return false;
          const cmp = (a, b) => {
            if (this.plugin.settings.caseSensitive)
              return String(a) === String(b);
            return String(a).toLowerCase() === String(b).toLowerCase();
          };
          if (cmp(entry.pattern, this.selectedText)) return true;
          if (
            Array.isArray(entry.groupedPatterns) &&
            entry.groupedPatterns.some((p) => cmp(p, this.selectedText))
          )
            return true;
          return false;
        };

        if (matchesWord()) {
          menu.addItem((item) => {
            item
              .setTitle(
                this.plugin
                  .t("context_remove_from_entry", 'Remove "{word}" from entry')
                  .replace("{word}", this.selectedText),
              )
              .setIcon("minus")
              .onClick(async () => {
                if (Array.isArray(entry.groupedPatterns)) {
                  entry.groupedPatterns = entry.groupedPatterns.filter((p) => {
                    const cmp = this.plugin.settings.caseSensitive
                      ? String(p) === String(this.selectedText)
                      : String(p).toLowerCase() ===
                        String(this.selectedText).toLowerCase();
                    return !cmp;
                  });
                } else {
                  entry.pattern = "";
                }
                await this.plugin.saveSettings();
                this.plugin.compileWordEntries();
                this.plugin.compileTextBgColoringEntries();
                try {
                  this.plugin.reconfigureEditorExtensions();
                } catch (_) {}
                try {
                  this.plugin.refreshEditor(this.view, true);
                } catch (_) {}
                this.refreshSuggestions();
                new Notice(`"${this.selectedText}" removed from entry`);
              });
          });
        }

        // Close any existing menu before showing new one
        const existingMenus = document.querySelectorAll(".menu");
        existingMenus.forEach((m) => {
          if (m !== menu.dom) m.remove();
        });

        menu.showAtMouseEvent(evt);
        menu.dom.classList.add("act-menu-elevated");

        // Close menu when clicking elsewhere
        const closeMenu = (e) => {
          if (!menu.dom.contains(e.target) && e.target !== el) {
            menu.dom.remove();
            document.removeEventListener("click", closeMenu);
          }
        };
        setTimeout(() => {
          document.addEventListener("click", closeMenu);
        }, 100);
      }
    });
  }
  onChooseItem(item, evt) {
    // Prevent choosing on right-click
    if (evt && evt.button === 2) return;

    // FuzzySuggestModal wraps items, so access the actual item via item.item
    const actualItem = item.item || item;
    const e = actualItem.entry;
    const s = this.selectedText;
    if (!s) return;
    const cmp = (a, b) => {
      if (this.plugin.settings.caseSensitive) return String(a) === String(b);
      return String(a).toLowerCase() === String(b).toLowerCase();
    };
    const has = (arr, val) =>
      Array.isArray(arr) && arr.some((p) => cmp(p, val));
    // If entry is a regex, try to append the selected word to the alternation intelligently
    if (e.isRegex && this.plugin.settings.enableRegexSupport) {
      try {
        const pattern = String(e.pattern || "");
        const flags = String(e.flags || "");

        // First try: match the specific structure \b(...)\w*\b
        const regexStructure = /^\\b\((.+?)\)\\w\*\\b$/;
        let m = pattern.match(regexStructure);
        if (m) {
          const core = m[1];
          const parts = core
            .split("|")
            .map((x) => x.trim())
            .filter((x) => x.length > 0);
          const caseInsensitive =
            flags.includes("i") || !this.plugin.settings.caseSensitive;
          const containsWord = parts.some((p) =>
            caseInsensitive ? p.toLowerCase() === s.toLowerCase() : p === s,
          );
          if (containsWord) {
            new Notice(
              this.plugin.t(
                "notice_already_in_entry",
                `"${s}" already exists in entry`,
                { word: s },
              ),
            );
            return;
          }
          const esc =
            this.plugin.helpers && this.plugin.helpers.escapeRegex
              ? this.plugin.helpers.escapeRegex(s)
              : s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const newCore = core + "|" + esc;
          const newPattern = `\\b(${newCore})\\w*\\b`;
          e.pattern = newPattern;
          e.groupedPatterns = null;
          (async () => {
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.compileTextBgColoringEntries();
            try {
              this.plugin.reconfigureEditorExtensions();
            } catch (_) {}
            try {
              this.plugin.refreshEditor(this.view, true);
            } catch (_) {}
            new Notice(
              this.plugin.t(
                "notice_added_to_existing",
                `"${s}" added to existing entry`,
                { word: s },
              ),
            );
          })();
          return;
        }

        // Second try: match single word pattern \bword\w*\b and convert to alternation
        const singleWordStructure = /^\\b([^\\|()]+)\\w\*\\b$/;
        m = pattern.match(singleWordStructure);
        if (m) {
          const word = m[1];
          const caseInsensitive =
            flags.includes("i") || !this.plugin.settings.caseSensitive;
          const cmp = caseInsensitive
            ? word.toLowerCase() === s.toLowerCase()
            : word === s;
          if (cmp) {
            new Notice(
              this.plugin.t(
                "notice_already_in_entry",
                `"${s}" already exists in entry`,
                { word: s },
              ),
            );
            return;
          }
          const esc =
            this.plugin.helpers && this.plugin.helpers.escapeRegex
              ? this.plugin.helpers.escapeRegex(s)
              : s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const newPattern = `\\b(${word}|${esc})\\w*\\b`;
          e.pattern = newPattern;
          e.groupedPatterns = null;
          (async () => {
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.compileTextBgColoringEntries();
            try {
              this.plugin.reconfigureEditorExtensions();
            } catch (_) {}
            try {
              this.plugin.refreshEditor(this.view, true);
            } catch (_) {}
            new Notice(
              this.plugin.t(
                "notice_added_to_existing",
                `"${s}" added to existing entry`,
                { word: s },
              ),
            );
          })();
          return;
        }

        // Third try: for any regex containing |, append to it intelligently
        if (pattern.includes("|")) {
          const esc =
            this.plugin.helpers && this.plugin.helpers.escapeRegex
              ? this.plugin.helpers.escapeRegex(s)
              : s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const newPattern = pattern + "|" + esc;
          e.pattern = newPattern;
          e.groupedPatterns = null;
          (async () => {
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.compileTextBgColoringEntries();
            try {
              this.plugin.reconfigureEditorExtensions();
            } catch (_) {}
            try {
              this.plugin.refreshEditor(this.view, true);
            } catch (_) {}
            new Notice(
              this.plugin.t(
                "notice_added_to_existing",
                `"${s}" added to existing entry`,
                { word: s },
              ),
            );
          })();
          return;
        }
      } catch (_) {}
      // Fallback: if regex does not contain alternation, append to groupedPatterns as a separate literal
    }
    if (cmp(e.pattern || "", s) || has(e.groupedPatterns, s)) {
      new Notice(
        this.plugin.t(
          "notice_already_in_entry",
          `"${s}" already exists in entry`,
          { word: s },
        ),
      );
      return;
    }
    if (!Array.isArray(e.groupedPatterns) || e.groupedPatterns.length === 0) {
      e.groupedPatterns = [String(e.pattern || "").trim(), s];
    } else {
      e.groupedPatterns.push(s);
    }
    (async () => {
      await this.plugin.saveSettings();
      this.plugin.compileWordEntries();
      this.plugin.compileTextBgColoringEntries();
      try {
        this.plugin.reconfigureEditorExtensions();
      } catch (_) {}
      try {
        this.plugin.refreshEditor(this.view, true);
      } catch (_) {}
      new Notice(
        this.plugin.t(
          "notice_added_to_existing",
          `"${s}" added to existing entry`,
          { word: s },
        ),
      );
    })();
  }
}
