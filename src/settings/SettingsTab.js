import { PluginSettingTab, Setting, Modal, Notice, setIcon, setTooltip, Menu, FuzzySuggestModal, normalizePath, debounce } from 'obsidian';
import { PresetModal } from '../modals/PresetModal.js';
import { RealTimeRegexTesterModal } from '../modals/RealTimeRegexTesterModal.js';
import { HighlightStylingModal } from '../modals/HighlightStylingModal.js';
import { EditEntryModal } from '../modals/EditEntryModal.js';
import { BlacklistRegexTesterModal } from '../modals/BlacklistRegexTesterModal.js';
import { ChangelogModal } from '../modals/ChangelogModal.js';
import { EditWordGroupModal } from '../modals/EditWordGroupModal.js';
import { SelectBlacklistGroupModal } from '../modals/SelectBlacklistGroupModal.js';
import { EditBlacklistGroupModal } from '../modals/EditBlacklistGroupModal.js';
import { ColorPickerModal } from '../modals/ColorPickerModal.js';
import { AlertModal } from '../modals/AlertModal.js';
import { ConfirmationModal } from '../modals/ConfirmationModal.js';
import { debugLog, debugError } from '../utils/debug.js';
export class ColorSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.icon = "palette";
    this._activeTab = "general";
    this.debouncedSaveSettings = debounce(
      this.plugin.saveSettings.bind(this.plugin),
      800,
    );
    this._lastRerender = 0;
    this._cleanupHandlers = [];
    this._entryRows = new Map();
    this._suspendSorting = false;
    this._newEntriesSet = new Set();
    this._blacklistNewSet = new Set();
    // Dynamic handlers and cached suggestions for folder UI
    this._dynamicHandlers = [];
    this._cachedFolderSuggestions = null;
    this._pathRulesContainer = null;
    this._disabledFilesContainer = null;
    this._blacklistWordsContainer = null;
    this._blacklistGroupsContainer = null;
    this._customSwatchesContainer = null;
    // Sorting state for word entries (null, 'last-added', or 'a-z')
    this._wordsSortMode =
      this.plugin.settings && this.plugin.settings.wordsSortMode
        ? this.plugin.settings.wordsSortMode
        : "last-added";
    // Sorting state for text & background coloring entries
    this._textBgSortMode = "last-added";
    // Sorting state for blacklist entries
    this._blacklistSortMode =
      this.plugin.settings && this.plugin.settings.blacklistSortMode
        ? this.plugin.settings.blacklistSortMode
        : "last-added";
    this._pathSortMode =
      this.plugin.settings && this.plugin.settings.pathSortMode
        ? this.plugin.settings.pathSortMode
        : "last-added";
    // Fold states for color swatches sections
    this._defaultColorsFolded = true;
    this._customSwatchesFolded =
      this.plugin.settings &&
      typeof this.plugin.settings.customSwatchesFolded !== "undefined"
        ? !!this.plugin.settings.customSwatchesFolded
        : false;
    // Filter mode for word entries (null, 'highlight', 'text')
    this._filterMode = null;
    // Optional matchType filters for entries list - support multiple with OR logic
    this._entriesMatchTypeStartsWith = false;
    this._entriesMatchTypeEndsWith = false;
    this._entriesMatchTypeExact = false;
    // Optional regex/word-only filters
    this._entriesWordsOnly = false;
    this._blacklistRegexOnly = false;
    this._blacklistWordsOnly = false;
    // Optional path mode-only filter ('include' | 'exclude')
    this._pathModeOnly = null;
    // Limit and match/filter tokens for search bars
    this._entriesLimit =
      Number(this.plugin.settings?.entriesSearchLimit ?? 0) || 0;
    this._entriesRegexOnly = false;
    this._entriesSearchMatch = "contains";
    this._blacklistLimit =
      Number(this.plugin.settings?.blacklistSearchLimit ?? 0) || 0;
    this._blacklistSearchMatchStarts = false;
    this._blacklistSearchMatchEnds = false;
    this._blacklistSearchMatchExact = false;
    this._pathLimit = Number(this.plugin.settings?.pathSearchLimit ?? 0) || 0;
    this._pathSearchMatch = "contains";
  }

  // Create a settings row for a single entry and track cleanup
  _createEntryRow(entry, listDiv) {
    try {
      if (!entry.uid) {
        try {
          entry.uid =
            Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          entry.uid = Date.now();
        }
      }
      const row = listDiv.createDiv();
      try {
        row.addClass("act-entry-row");
      } catch (e) {
        try {
          row.classList.add("act-entry-row");
        } catch (_) {}
      }
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";

      // ELEMENT 1: Style selector (moved first)
      const styleSelect = row.createEl("select");
      styleSelect.style.padding = "6px";
      styleSelect.style.borderRadius = "4px";
      styleSelect.style.border = "1px solid var(--background-modifier-border)";
      styleSelect.style.background = "var(--background-modifier-form-field)";
      styleSelect.style.color = "var(--text-normal)";
      styleSelect.style.flex = "0 0 auto";
      styleSelect.style.maxWidth = "80px";
      styleSelect.style.width = "stretch";
      styleSelect.style.minWidth = "60px";
      styleSelect.style.textAlign = "center";
      try {
        styleSelect.addClass("act-style-select");
      } catch (e) {
        try {
          styleSelect.classList.add("act-style-select");
        } catch (_) {}
      }
      styleSelect.innerHTML = `<option value="text">${this.plugin.t("style_type_text", "color")}</option><option value="highlight">${this.plugin.t("style_type_highlight", "highlight")}</option><option value="both">${this.plugin.t("style_type_both", "both")}</option>`;

      // ELEMENT 1b: Match selector (exact/contains/starts/ends)
      const matchSelect = row.createEl("select");
      matchSelect.style.padding = "6px";
      matchSelect.style.borderRadius = "4px";
      matchSelect.style.border = "1px solid var(--background-modifier-border)";
      matchSelect.style.background = "var(--background-modifier-form-field)";
      matchSelect.style.color = "var(--text-normal)";
      matchSelect.style.flex = "0 0 auto";
      matchSelect.style.maxWidth = "120px";
      matchSelect.style.width = "stretch";
      matchSelect.style.minWidth = "100px";
      matchSelect.style.textAlign = "center";
      try {
        matchSelect.addClass("act-match-select");
      } catch (e) {
        try {
          matchSelect.classList.add("act-match-select");
        } catch (_) {}
      }
      matchSelect.innerHTML = `<option value="exact">${this.plugin.t("match_option_exact", "exact")}</option><option value="contains">${this.plugin.t("match_option_contains", "contains")}</option><option value="startsWith">${this.plugin.t("match_option_starts_with", "starts with")}</option><option value="endsWith">${this.plugin.t("match_option_ends_with", "ends with")}</option>`;

      // ELEMENT 2a: Regex name input (only for regex)
      let nameInput = null;
      if (entry.isRegex) {
        nameInput = row.createEl("input", {
          type: "text",
          value: String(entry.presetLabel || ""),
        });
        nameInput.style.flex = "0 0 60px";
        nameInput.style.padding = "6px";
        nameInput.style.borderRadius = "4px";
        nameInput.style.border = "1px solid var(--background-modifier-border)";
        nameInput.placeholder = this.plugin.t(
          "regex_name_placeholder",
          "name your regex",
        );
        try {
          nameInput.addClass("act-regex-name");
        } catch (e) {}
      }
      // ELEMENT 2b: Word/pattern input
      const displayPatterns =
        Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0
          ? entry.groupedPatterns.join(", ")
          : entry.pattern;
      const textInput = row.createEl("input", {
        type: "text",
        value: displayPatterns,
      });
      textInput.style.flex = "1";
      textInput.style.minWidth = "100px";
      textInput.style.padding = "6px";
      textInput.style.borderRadius = "4px";
      textInput.style.border = "1px solid var(--background-modifier-border)";
      textInput.placeholder = this.plugin.t(
        "word_pattern_placeholder_long",
        "pattern, word or comma-separated words (e.g. hello, world, foo)",
      );

      // ELEMENT 3: Regex checkbox & flags
      const regexChk = row.createEl("input", { type: "checkbox" });
      regexChk.checked = !!entry.isRegex;
      // regexChk.title = 'Treat pattern as a JavaScript regular expression';
      regexChk.title = this.plugin.t("use_regex", "Use Regex");
      regexChk.style.cursor = "pointer";
      regexChk.style.flex = "0 0 auto";

      const regexLabel = row.createEl("label");
      regexLabel.appendChild(
        document.createTextNode(this.plugin.t("label_regex", "Regex")),
      );
      regexLabel.style.flex = "0 0 auto";
      regexLabel.style.cursor = "pointer";
      regexLabel.style.userSelect = "none";
      regexLabel.style.fontSize = "0.9em";
      regexLabel.onclick = () => {
        regexChk.checked = !regexChk.checked;
      };
      regexChk.style.margin = "0";
      regexLabel.style.display = "none";

      const flagsInput = row.createEl("input", {
        type: "text",
        value: entry.flags || "",
      });
      flagsInput.placeholder = this.plugin.t("flags_placeholder", "flags");
      flagsInput.style.width = "64px";
      flagsInput.style.padding = "6px";
      flagsInput.style.borderRadius = "4px";
      flagsInput.style.border = "1px solid var(--background-modifier-border)";
      flagsInput.style.flex = "0 0 auto";

      // ELEMENT 4: Color pickers (with swatches grouped)
      const swatchesArr = Array.isArray(this.plugin.settings.swatches)
        ? this.plugin.settings.swatches
        : [];

      // Text color and swatch
      const cp = row.createEl("input", { type: "color" });
      cp.title = this.plugin.t("text_color_title", "Text color");
      cp.value = entry.color || "#000000";
      cp.style.width = "30px";
      cp.style.height = "30px";
      cp.style.border = "none";
      cp.style.borderRadius = "4px";
      cp.style.cursor = "pointer";
      cp.style.flex = "0 0 auto";

      let swatchSelect = null;
      if (
        this.plugin.settings.useSwatchNamesForText &&
        swatchesArr.length > 0
      ) {
        swatchSelect = row.createEl("select");
        swatchSelect.style.padding = "6px";
        swatchSelect.style.borderRadius = "4px";
        swatchSelect.style.border =
          "1px solid var(--background-modifier-border)";
        swatchSelect.style.background = "var(--background-modifier-form-field)";
        swatchSelect.style.color = "var(--text-normal)";
        swatchSelect.style.flex = "0 0 auto";
        swatchSelect.style.textAlign = "center";
        const defaultOpt = swatchSelect.createEl("option", {
          text: this.plugin.t("select_swatch", "Select swatch…"),
        });
        defaultOpt.value = "";
        swatchesArr.forEach((sw) => {
          const opt = swatchSelect.createEl("option", { text: sw.name || "" });
          opt.value = sw.name || "";
          if (
            sw.color &&
            (entry.color || "").toLowerCase() === sw.color.toLowerCase()
          ) {
            swatchSelect.value = opt.value;
          }
        });
      }

      // Background color and swatch
      const cpBg = row.createEl("input", { type: "color" });
      cpBg.title = this.plugin.t("highlight_color_title", "Highlight color");
      cpBg.value = entry.backgroundColor || "#000000";
      cpBg.style.width = "30px";
      cpBg.style.height = "30px";
      cpBg.style.border = "none";
      cpBg.style.borderRadius = "4px";
      cpBg.style.cursor = "pointer";
      cpBg.style.flex = "0 0 auto";

      let swatchSelect2 = null;
      if (
        this.plugin.settings.useSwatchNamesForText &&
        swatchesArr.length > 0
      ) {
        swatchSelect2 = row.createEl("select");
        swatchSelect2.style.padding = "6px";
        swatchSelect2.style.borderRadius = "4px";
        swatchSelect2.style.border =
          "1px solid var(--background-modifier-border)";
        swatchSelect2.style.background =
          "var(--background-modifier-form-field)";
        swatchSelect2.style.color = "var(--text-normal)";
        swatchSelect2.style.flex = "0 0 auto";
        swatchSelect2.style.textAlign = "center";
        const defaultOpt2 = swatchSelect2.createEl("option", {
          text: this.plugin.t(
            "select_highlight_swatch",
            "Select highlight swatch…",
          ),
        });
        defaultOpt2.value = "";
        swatchesArr.forEach((sw) => {
          const opt = swatchSelect2.createEl("option", { text: sw.name || "" });
          opt.value = sw.name || "";
        });
      }

      // ELEMENT 5: Delete button (commented out — use right-click context menu to delete)
      /* const del = row.createEl("button", {
        text: this.plugin.t("delete_button_text", "✕"),
      });
      del.addClass("mod-warning");
      del.style.padding = "4px 8px";
      del.style.borderRadius = "4px";
      del.style.cursor = "pointer";
      del.style.flex = "0 0 auto"; */
      const del = { addEventListener: () => {}, removeEventListener: () => {} };

      const initBgEntry = entry;
      const initialStyle =
        initBgEntry && initBgEntry.styleType ? initBgEntry.styleType : null;
      if (initialStyle) {
        styleSelect.value = initialStyle;
      } else if (
        initBgEntry &&
        (initBgEntry.backgroundColor || initBgEntry.textColor)
      ) {
        const hasText = !!(
          initBgEntry.textColor && initBgEntry.textColor !== "currentColor"
        );
        const hasBg = !!initBgEntry.backgroundColor;
        styleSelect.value =
          hasText && hasBg ? "both" : hasBg ? "highlight" : "text";
      } else {
        styleSelect.value = "text";
      }
      if (
        initBgEntry &&
        initBgEntry.textColor &&
        initBgEntry.textColor !== "currentColor"
      )
        cp.value = initBgEntry.textColor;
      if (initBgEntry && initBgEntry.backgroundColor)
        cpBg.value = initBgEntry.backgroundColor;
      // Set flags input visibility based on current style and regex state
      flagsInput.style.display = entry.isRegex ? "" : "none";

      // Initialize matchSelect value with entry.matchType or default based on partialMatch
      try {
        let defaultMatch =
          typeof entry.matchType === "string" && entry.matchType
            ? entry.matchType.toLowerCase()
            : this.plugin.settings.partialMatch
              ? "contains"
              : "exact";
        // Normalize to lowercase for internal storage: startswith, endswith
        if (defaultMatch === "startswith" || defaultMatch === "starts with")
          defaultMatch = "startswith";
        if (defaultMatch === "endswith" || defaultMatch === "ends with")
          defaultMatch = "endswith";
        // Convert to camelCase for dropdown options (exact, contains, startsWith, endsWith)
        const dropdownValue =
          defaultMatch === "startswith"
            ? "startsWith"
            : defaultMatch === "endswith"
              ? "endsWith"
              : defaultMatch;
        matchSelect.value = dropdownValue;
        entry.matchType = defaultMatch;
        // MATCH_SELECT_INIT log removed - too verbose
      } catch (e) {}

      const updateInputDisplay = () => {
        // Update the input field to show the current state from entry
        if (entry.isRegex) {
          textInput.value = entry.pattern || "";
        } else {
          const patterns =
            Array.isArray(entry.groupedPatterns) &&
            entry.groupedPatterns.length > 0
              ? entry.groupedPatterns
              : entry.pattern
                ? [entry.pattern]
                : [];
          textInput.value = patterns.map((p) => String(p).trim()).join(", ");
        }
      };

      const resolveIdx = () => {
        if (entry && entry.uid) {
          const byUid = this.plugin.settings.wordEntries.findIndex(
            (e) => e && e.uid === entry.uid,
          );
          if (byUid !== -1) return byUid;
        }
        let idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx !== -1) return idx;
        const curr = String(textInput.value || "");
        if (!curr) return -1;
        const found = this.plugin.settings.wordEntries.findIndex((e) => {
          const pats =
            Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
              ? e.groupedPatterns
              : [String(e.pattern || "")];
          const joined = pats.map((p) => String(p).trim()).join(", ");
          return joined === curr;
        });
        return found;
      };

      const textInputHandler = async () => {
        try {
          const newPattern = textInput.value;
          const idx = resolveIdx();
          if (idx === -1) return;
          if (!newPattern) {
            this.plugin.settings.wordEntries.splice(idx, 1);
          } else if (
            this.plugin.settings.enableRegexSupport &&
            entry.isRegex &&
            !this.plugin.settings.disableRegexSafety &&
            this.plugin.isRegexTooComplex(newPattern)
          ) {
            new Notice(
              this.plugin.t(
                "notice_pattern_too_complex",
                "Pattern too complex: " + newPattern.substring(0, 60) + "...",
              ),
            );
            updateInputDisplay();
            return;
          } else {
            if (entry.isRegex) {
              this.plugin.settings.wordEntries[idx].pattern = newPattern;
              this.plugin.settings.wordEntries[idx].groupedPatterns = null;
              entry.pattern = newPattern;
              entry.groupedPatterns = null;

              // Update targetElement based on pattern
              const p = newPattern;
              let te = undefined;
              if (p === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1") te = "strong";
              else if (p === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1") te = "em";
              else if (p === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1")
                te = "strong-em";

              if (te) {
                this.plugin.settings.wordEntries[idx].targetElement = te;
                entry.targetElement = te;
              } else if (
                entry.targetElement &&
                (entry.targetElement === "strong" ||
                  entry.targetElement === "em" ||
                  entry.targetElement === "strong-em")
              ) {
                delete this.plugin.settings.wordEntries[idx].targetElement;
                delete entry.targetElement;
              }
            } else {
              const patterns = newPattern
                .split(",")
                .map((p) => String(p).trim())
                .filter((p) => p.length > 0);
              this.plugin.settings.wordEntries[idx].pattern = patterns[0];
              this.plugin.settings.wordEntries[idx].groupedPatterns =
                patterns.length > 1 ? patterns : null;
              entry.pattern = this.plugin.settings.wordEntries[idx].pattern;
              entry.groupedPatterns =
                this.plugin.settings.wordEntries[idx].groupedPatterns;
            }
          }
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this.plugin.triggerActiveDocumentRerender();
          this._suspendSorting = this._wordsSortMode === "last-added";
          this._refreshEntries();
        } catch (error) {
          debugError("SETTINGS", "Error saving word entry", error);
          new Notice(
            this.plugin.t(
              "notice_error_saving_changes",
              "Error saving changes. Please try again.",
            ),
          );
        }
      };

      const duplicateHandler = async () => {
        try {
          const idx = resolveIdx();
          if (idx === -1) return;
          const orig = this.plugin.settings.wordEntries[idx];
          const dup = Object.assign({}, orig);
          try {
            dup.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (e) {
            dup.uid = Date.now();
          }
          this.plugin.settings.wordEntries.splice(idx + 1, 0, dup);
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this._suspendSorting = this._wordsSortMode === "last-added";
          this._refreshEntries();
        } catch (e) {
          debugError("SETTINGS", "duplicate entry error", e);
        }
      };

      const openInRegexTesterHandler = async () => {
        try {
          if (!entry.isRegex) return;
          const onAdded = () => {
            try {
              this._refreshEntries();
            } catch (e) {}
          };
          const modal = new RealTimeRegexTesterModal(
            this.app,
            this.plugin,
            onAdded,
          );
          modal._editingEntry = entry;
          if (entry.pattern) modal._preFillPattern = entry.pattern;
          if (entry.flags) modal._preFillFlags = entry.flags;
          if (entry.presetLabel) modal._preFillName = entry.presetLabel;
          if (entry.styleType) modal._preFillStyleType = entry.styleType;
          if (entry.color) modal._preFillTextColor = entry.color;
          else if (entry.textColor) modal._preFillTextColor = entry.textColor;
          else if (entry._savedTextColor)
            modal._preFillTextColor = entry._savedTextColor;
          if (entry.backgroundColor)
            modal._preFillBgColor = entry.backgroundColor;
          else if (entry._savedBackgroundColor)
            modal._preFillBgColor = entry._savedBackgroundColor;
          modal.open();
        } catch (e) {
          debugError("SETTINGS", "open in regex tester error", e);
        }
      };

      const resetTextColorHandler = async () => {
        try {
          const idx = resolveIdx();
          if (idx !== -1) {
            const entry = this.plugin.settings.wordEntries[idx];
            entry.textColor = null;
            entry.color = "";
            // Adjust styleType based on what remains
            if (entry.backgroundColor) {
              entry.styleType = "highlight";
            } else {
              entry.styleType = "text";
            }
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.compileTextBgColoringEntries();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            this.plugin.forceRefreshAllReadingViews();
            this._refreshEntries();
            new Notice(
              this.plugin.t("notice_text_color_reset", "Text color reset"),
            );
          }
        } catch (e) {
          debugError("SETTINGS", "reset text color error", e);
        }
      };

      const resetHighlightHandler = async () => {
        try {
          const idx = resolveIdx();
          if (idx !== -1) {
            const entry = this.plugin.settings.wordEntries[idx];
            entry.backgroundColor = null;
            // Adjust styleType based on what remains
            if (entry.textColor || entry.color) {
              entry.styleType = "text";
            } else {
              entry.styleType = "text";
            }
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.compileTextBgColoringEntries();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            this.plugin.forceRefreshAllReadingViews();
            this._refreshEntries();
            new Notice(
              this.plugin.t("notice_highlight_reset", "Highlight color reset"),
            );
          }
        } catch (e) {
          debugError("SETTINGS", "reset highlight error", e);
        }
      };

      const contextMenuHandler = (ev) => {
        try {
          ev && ev.preventDefault && ev.preventDefault();
          if (ev && ev.stopPropagation) ev.stopPropagation();
          const menu = new Menu(this.app);
          if (entry.isRegex) {
            menu.addItem((item) => {
              item
                .setTitle(
                  this.plugin.t("open_in_regex_tester", "Open in Regex Tester"),
                )
                .setIcon("regex")
                .onClick(openInRegexTesterHandler);
            });
          }
          menu.addItem((item) => {
            item
              .setTitle(
                this.plugin.t("edit_entry_details", "Edit Entry Details"),
              )
              .setIcon("pencil")
              .onClick(() => {
                const modal = new EditEntryModal(
                  this.app,
                  this.plugin,
                  entry,
                  () => {
                    try {
                      this._refreshEntries();
                    } catch (e) {}
                  },
                );
                modal.open();
              });
          });
          menu.addItem((item) => {
            item
              .setTitle(this.plugin.t("duplicate_entry", "Duplicate Entry"))
              .setIcon("copy")
              .onClick(duplicateHandler);
          });
          menu.addItem((item) => {
            item
              .setTitle(this.plugin.t("context_delete_entry", "Delete entry"))
              .setIcon("trash")
              .onClick(delHandler);
          });
          menu.showAtPosition({ x: ev.clientX, y: ev.clientY });
        } catch (e) {
          debugError("SETTINGS", "context menu error", e);
        }
      };

      // cpHandler and other color handlers remain below
      const cpHandler = async () => {
        const newColor = cp.value;
        if (!this.plugin.isValidHexColor(newColor)) {
          new Notice(
            this.plugin.t(
              "notice_invalid_color_format",
              "Invalid color format.",
            ),
          );
          return;
        }
        const idx = resolveIdx();
        if (idx !== -1) {
          // Text color picker should set the text-related fields
          // Check if we already have a background color
          const hasBg = !!this.plugin.settings.wordEntries[idx].backgroundColor;

          if (hasBg) {
            // If background already exists, this is for "both" mode
            this.plugin.settings.wordEntries[idx].textColor = newColor;
            this.plugin.settings.wordEntries[idx].color = "";
            this.plugin.settings.wordEntries[idx].styleType = "both";
            // Preserve saved text color
            this.plugin.settings.wordEntries[idx]._savedTextColor = newColor;
          } else {
            // Only text color, no background
            this.plugin.settings.wordEntries[idx].color = newColor;
            this.plugin.settings.wordEntries[idx].textColor = null;
            this.plugin.settings.wordEntries[idx].backgroundColor = null;
            this.plugin.settings.wordEntries[idx].styleType = "text";
            this.plugin.settings.wordEntries[idx]._savedTextColor = newColor;
          }
          // Sync dropdown to current style
          styleSelect.value =
            this.plugin.settings.wordEntries[idx].styleType || "text";
        }
        if (swatchSelect) {
          try {
            const match = (
              Array.isArray(this.plugin.settings.swatches)
                ? this.plugin.settings.swatches
                : []
            ).find(
              (sw) =>
                sw.color && sw.color.toLowerCase() === newColor.toLowerCase(),
            );
            swatchSelect.value = match ? match.name || "" : "";
          } catch (e) {}
        }
        await this.debouncedSaveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const cpBgHandler = async () => {
        const newColor = cpBg.value;
        if (!this.plugin.isValidHexColor(newColor)) return;
        const idx = resolveIdx();
        if (idx !== -1) {
          // Background color picker should ALWAYS set backgroundColor
          this.plugin.settings.wordEntries[idx].backgroundColor = newColor;
          // Set textColor to currentColor if not already set to a valid hex
          if (
            !this.plugin.settings.wordEntries[idx].textColor ||
            this.plugin.settings.wordEntries[idx].textColor === "currentColor"
          ) {
            this.plugin.settings.wordEntries[idx].textColor = "currentColor";
          }
          // Clear the plain color field
          this.plugin.settings.wordEntries[idx].color = "";
          // Preserve saved background color
          this.plugin.settings.wordEntries[idx]._savedBackgroundColor =
            newColor;
          // Auto-determine the style based on what fields are filled
          const hasText = !!(
            this.plugin.settings.wordEntries[idx].textColor &&
            this.plugin.settings.wordEntries[idx].textColor !== "currentColor"
          );
          const hasBg = !!this.plugin.settings.wordEntries[idx].backgroundColor;
          if (hasText && hasBg) {
            this.plugin.settings.wordEntries[idx].styleType = "both";
          } else if (hasBg) {
            this.plugin.settings.wordEntries[idx].styleType = "highlight";
          } else {
            this.plugin.settings.wordEntries[idx].styleType = "text";
          }
          // Sync dropdown to current style
          styleSelect.value =
            this.plugin.settings.wordEntries[idx].styleType || "text";
        }
        if (swatchSelect2) {
          try {
            const match = (
              Array.isArray(this.plugin.settings.swatches)
                ? this.plugin.settings.swatches
                : []
            ).find(
              (sw) =>
                sw.color && sw.color.toLowerCase() === newColor.toLowerCase(),
            );
            swatchSelect2.value = match ? match.name || "" : "";
          } catch (e) {}
        }
        await this.debouncedSaveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const regexChkHandler = async () => {
        const idx = resolveIdx();
        if (idx !== -1)
          this.plugin.settings.wordEntries[idx].isRegex = regexChk.checked;
        flagsInput.style.display = regexChk.checked ? "" : "none";
        // Show notice if regex is enabled but regex support is disabled
        if (regexChk.checked && !this.plugin.settings.enableRegexSupport) {
          new Notice(
            this.plugin.t(
              "notice_regex_support_disabled",
              "To use Presets, enable Regex Support from the General tab in Settings.",
            ),
          );
        }
        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        entry.isRegex = regexChk.checked;
        this._refreshEntries();
      };

      const flagsInputHandler = async () => {
        const idx = resolveIdx();
        if (idx !== -1)
          this.plugin.settings.wordEntries[idx].flags = flagsInput.value || "";
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        entry.flags = flagsInput.value || "";
        this._refreshEntries();
      };

      const delHandler = async () => {
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx !== -1) this.plugin.settings.wordEntries.splice(idx, 1);
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        const info = this._entryRows.get(entry);
        if (info) {
          try {
            info.cleanup();
          } catch (e) {}
          this._entryRows.delete(entry);
        }
        this._refreshEntries();
      };

      textInput.addEventListener("change", textInputHandler);
      textInput.addEventListener("blur", textInputHandler);
      row.addEventListener("contextmenu", contextMenuHandler);
      cp.addEventListener("input", cpHandler);
      cpBg.addEventListener("input", cpBgHandler);
      const cpContextHandler = (ev) => {
        try {
          ev && ev.preventDefault && ev.preventDefault();
          if (ev && ev.stopPropagation) ev.stopPropagation();
          const idx = resolveIdx();
          const preExisting =
            idx !== -1 ? this.plugin.settings.wordEntries[idx] : entry;
          const preFillText =
            (preExisting &&
              (preExisting.textColor && preExisting.textColor !== "currentColor"
                ? preExisting.textColor
                : this.plugin.isValidHexColor(preExisting.color)
                  ? preExisting.color
                  : null)) ||
            cp.value;
          const displayText =
            preExisting && preExisting.isRegex
              ? preExisting.pattern || ""
              : Array.isArray(preExisting?.groupedPatterns) &&
                  preExisting.groupedPatterns.length > 0
                ? preExisting.groupedPatterns
                    .map((p) => String(p).trim())
                    .join(", ")
                : preExisting && preExisting.pattern
                  ? String(preExisting.pattern)
                  : "";
          const modal = new ColorPickerModal(
            this.app,
            this.plugin,
            async (color, result) => {
              const tc = (result && result.textColor) || color;
              if (!tc || !this.plugin.isValidHexColor(tc)) return;
              const i = resolveIdx();
              if (i !== -1) {
                const s = this.plugin.settings.wordEntries[i];
                if (s.backgroundColor) {
                  s.textColor = tc;
                  s.color = "";
                  s.styleType = "both";
                  s._savedTextColor = tc;
                } else {
                  s.color = tc;
                  s.textColor = null;
                  s.backgroundColor = null;
                  s.styleType = "text";
                  s._savedTextColor = tc;
                }
                await this.plugin.saveSettings();
                cp.value = tc;
                styleSelect.value = s.styleType || "text";
                this.plugin.reconfigureEditorExtensions();
                this.plugin.forceRefreshAllEditors();
              }
            },
            "text",
            displayText,
            false,
          );
          try {
            modal._preFillTextColor = preFillText || cp.value;
          } catch (_) {}
          try {
            modal.open();
          } catch (_) {}
        } catch (_) {}
      };
      const cpBgContextHandler = (ev) => {
        try {
          ev && ev.preventDefault && ev.preventDefault();
          if (ev && ev.stopPropagation) ev.stopPropagation();
          const idx = resolveIdx();
          const preExisting =
            idx !== -1 ? this.plugin.settings.wordEntries[idx] : entry;
          const preFillBg =
            (preExisting && preExisting.backgroundColor) || cpBg.value;
          const displayText =
            preExisting && preExisting.isRegex
              ? preExisting.pattern || ""
              : Array.isArray(preExisting?.groupedPatterns) &&
                  preExisting.groupedPatterns.length > 0
                ? preExisting.groupedPatterns
                    .map((p) => String(p).trim())
                    .join(", ")
                : preExisting && preExisting.pattern
                  ? String(preExisting.pattern)
                  : "";
          const modal = new ColorPickerModal(
            this.app,
            this.plugin,
            async (color, result) => {
              const bc = (result && result.backgroundColor) || color;
              if (!bc || !this.plugin.isValidHexColor(bc)) return;
              const i = resolveIdx();
              if (i !== -1) {
                const s = this.plugin.settings.wordEntries[i];
                s.backgroundColor = bc;
                if (!s.textColor || s.textColor === "currentColor")
                  s.textColor = "currentColor";
                s.color = "";
                const hasText = !!(
                  s.textColor && s.textColor !== "currentColor"
                );
                s.styleType = hasText ? "both" : "highlight";
                s._savedBackgroundColor = bc;
                await this.plugin.saveSettings();
                cpBg.value = bc;
                styleSelect.value = s.styleType || "highlight";
                this.plugin.reconfigureEditorExtensions();
                this.plugin.forceRefreshAllEditors();
              }
            },
            "background",
            displayText,
            false,
          );
          try {
            modal._preFillBgColor = preFillBg || cpBg.value;
          } catch (_) {}
          try {
            modal.open();
          } catch (_) {}
        } catch (_) {}
      };
      cp.addEventListener("contextmenu", cpContextHandler);
      cpBg.addEventListener("contextmenu", cpBgContextHandler);
      regexChk.addEventListener("change", regexChkHandler);
      flagsInput.addEventListener("change", flagsInputHandler);
      del.addEventListener("click", delHandler);

      // Regex name change handler
      const nameInputHandler = async () => {
        if (!nameInput) return;
        const idx = resolveIdx();
        if (idx !== -1) {
          const val = String(nameInput.value || "").trim();
          this.plugin.settings.wordEntries[idx].presetLabel = val || undefined;
          entry.presetLabel = val || undefined;
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
        }
      };
      if (nameInput) {
        nameInput.addEventListener("change", nameInputHandler);
        nameInput.addEventListener("blur", nameInputHandler);
      }

      const swatchSelectHandler = async () => {
        if (!swatchSelect) return;
        const chosen = (
          Array.isArray(this.plugin.settings.swatches)
            ? this.plugin.settings.swatches
            : []
        ).find((sw) => (sw.name || "") === swatchSelect.value);
        if (!chosen) return;
        const c = chosen.color;
        if (!this.plugin.isValidHexColor(c)) return;
        cp.value = c;
        await cpHandler();
      };
      if (swatchSelect) {
        swatchSelect.addEventListener("change", swatchSelectHandler);
      }

      const swatchSelect2Handler = async () => {
        if (!swatchSelect2) return;
        const chosen = (
          Array.isArray(this.plugin.settings.swatches)
            ? this.plugin.settings.swatches
            : []
        ).find((sw) => (sw.name || "") === swatchSelect2.value);
        if (!chosen) return;
        const c = chosen.color;
        if (!this.plugin.isValidHexColor(c)) return;
        cpBg.value = c;
        await cpBgHandler();
      };
      if (swatchSelect2) {
        swatchSelect2.addEventListener("change", swatchSelect2Handler);
      }

      const updateVisibility = () => {
        const style = styleSelect.value;
        matchSelect.style.display = entry.isRegex ? "none" : "";
        if (style === "text") {
          cp.style.display = "";
          if (swatchSelect) swatchSelect.style.display = "";
          cpBg.style.display = "none";
          if (swatchSelect2) swatchSelect2.style.display = "none";
          flagsInput.style.display = entry.isRegex ? "" : "none";
          if (nameInput) nameInput.style.display = entry.isRegex ? "" : "none";
          try {
            // Synchronize picker values with entry fields
            const val =
              entry.color ||
              (entry.textColor && entry.textColor !== "currentColor"
                ? entry.textColor
                : entry.backgroundColor || "") ||
              cp.value;
            if (val && this.plugin.isValidHexColor(val)) cp.value = val;
          } catch (e) {}
        } else if (style === "highlight") {
          cp.style.display = "none";
          if (swatchSelect) swatchSelect.style.display = "none";
          cpBg.style.display = "";
          if (swatchSelect2) swatchSelect2.style.display = "";
          flagsInput.style.display = entry.isRegex ? "" : "none";
          if (nameInput) nameInput.style.display = entry.isRegex ? "" : "none";
          try {
            const val =
              entry.backgroundColor ||
              entry.color ||
              (entry.textColor && entry.textColor !== "currentColor"
                ? entry.textColor
                : "") ||
              cpBg.value;
            if (val && this.plugin.isValidHexColor(val)) cpBg.value = val;
          } catch (e) {}
        } else {
          cp.style.display = "";
          if (swatchSelect) swatchSelect.style.display = "";
          cpBg.style.display = "";
          if (swatchSelect2) swatchSelect2.style.display = "";
          flagsInput.style.display = entry.isRegex ? "" : "none";
          if (nameInput) nameInput.style.display = entry.isRegex ? "" : "none";
          try {
            const t =
              entry.textColor && entry.textColor !== "currentColor"
                ? entry.textColor
                : entry.color || "";
            const b = entry.backgroundColor || "";
            if (t && this.plugin.isValidHexColor(t)) cp.value = t;
            if (b && this.plugin.isValidHexColor(b)) cpBg.value = b;
          } catch (e) {}
        }
      };
      updateVisibility();
      const styleChangeHandler = async () => {
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx !== -1) {
          const curr = this.plugin.settings.wordEntries[idx];
          const prevStyle = curr.styleType || "text";
          const nextStyle = styleSelect.value;
          // Preserve existing visible color when switching styles
          if (prevStyle !== nextStyle) {
            if (nextStyle === "text") {
              // TEXT: Preserve previous colors strictly
              if (curr.textColor && curr.textColor !== "currentColor")
                curr._savedTextColor = curr.textColor;
              if (curr.color) curr._savedTextColor = curr.color;
              if (curr.backgroundColor)
                curr._savedBackgroundColor = curr.backgroundColor;
              const textOnly =
                curr._savedTextColor ||
                (curr.textColor && curr.textColor !== "currentColor"
                  ? curr.textColor
                  : this.plugin.isValidHexColor(curr.color)
                    ? curr.color
                    : "");
              curr.color = textOnly || curr.color || "";
              curr.textColor = null;
              curr.backgroundColor = null;
            } else if (nextStyle === "highlight") {
              if (curr.textColor && curr.textColor !== "currentColor")
                curr._savedTextColor = curr.textColor;
              if (curr.color) curr._savedTextColor = curr.color;
              if (curr.backgroundColor)
                curr._savedBackgroundColor = curr.backgroundColor;
              const bgOnly =
                curr._savedBackgroundColor ||
                curr.backgroundColor ||
                curr._savedTextColor ||
                (this.plugin.isValidHexColor(curr.color) ? curr.color : null);
              curr.backgroundColor = bgOnly;
              curr.textColor = "currentColor";
              curr.color = "";
            } else {
              // BOTH: Strictly restore previously chosen colors from saved fields
              const textBase =
                curr._savedTextColor ||
                (curr.textColor && curr.textColor !== "currentColor"
                  ? curr.textColor
                  : null) ||
                curr.color ||
                null;
              const bgBase =
                curr._savedBackgroundColor || curr.backgroundColor || null;
              if (textBase) curr.textColor = textBase;
              if (bgBase) curr.backgroundColor = bgBase;
              curr.color = "";
            }
          }
          curr.styleType = nextStyle;
          await this.plugin.saveSettings();
        }
        updateVisibility();
        try {
          const t =
            entry.textColor && entry.textColor !== "currentColor"
              ? entry.textColor
              : entry.color || "";
          const b = entry.backgroundColor || "";
          if (t && this.plugin.isValidHexColor(t)) cp.value = t;
          if (b && this.plugin.isValidHexColor(b)) cpBg.value = b;
        } catch (e) {}
      };
      styleSelect.addEventListener("change", styleChangeHandler);

      const matchChangeHandler = async () => {
        const idx = resolveIdx();
        if (idx !== -1) {
          // Store as lowercase internally: startswith, endswith
          let value = matchSelect.value;
          if (value === "startsWith") value = "startswith";
          if (value === "endsWith") value = "endswith";
          this.plugin.settings.wordEntries[idx].matchType = value;
          entry.matchType = value;
          try {
            debugLog(
              "MATCH_CHANGE_SAVE",
              `idx=${idx}, dropdown="${matchSelect.value}", stored="${value}", pattern="${entry.pattern.substring(0, 20)}"`,
            );
          } catch (_) {}
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this._refreshEntries();
        }
      };
      matchSelect.addEventListener("change", matchChangeHandler);
      // Also listen to input to catch programmatic value changes
      matchSelect.addEventListener("input", matchChangeHandler);

      const cleanup = () => {
        try {
          textInput.removeEventListener("change", textInputHandler);
        } catch (e) {}
        try {
          textInput.removeEventListener("blur", textInputHandler);
        } catch (e) {}
        try {
          row.removeEventListener("contextmenu", contextMenuHandler);
        } catch (e) {}
        try {
          cp.removeEventListener("input", cpHandler);
        } catch (e) {}
        try {
          cpBg.removeEventListener("input", cpBgHandler);
        } catch (e) {}
        try {
          cp.removeEventListener("contextmenu", cpContextHandler);
        } catch (e) {}
        try {
          cpBg.removeEventListener("contextmenu", cpBgContextHandler);
        } catch (e) {}
        try {
          regexChk.removeEventListener("change", regexChkHandler);
        } catch (e) {}
        try {
          flagsInput.removeEventListener("change", flagsInputHandler);
        } catch (e) {}
        try {
          del.removeEventListener("click", delHandler);
        } catch (e) {}
        try {
          if (swatchSelect)
            swatchSelect.removeEventListener("change", swatchSelectHandler);
        } catch (e) {}
        try {
          if (swatchSelect2)
            swatchSelect2.removeEventListener("change", swatchSelect2Handler);
        } catch (e) {}
        try {
          styleSelect.removeEventListener("change", styleChangeHandler);
        } catch (e) {}
        try {
          matchSelect.removeEventListener("change", matchChangeHandler);
        } catch (e) {}
        try {
          row.remove();
        } catch (e) {}
      };

      this._entryRows.set(entry, {
        row,
        elements: {
          nameInput,
          textInput,
          styleSelect,
          matchSelect,
          cp,
          cpBg,
          regexChk,
          flagsInput,
          del,
        },
        cleanup,
      });
      this._cleanupHandlers.push(cleanup);
    } catch (e) {
      debugError("SETTINGS", "_createEntryRow error", e);
    }
  }

  _refreshDisabledFiles() {
    try {
      if (!this._disabledFilesContainer) return;
      const hasAny =
        Array.isArray(this.plugin.settings.disabledFiles) &&
        this.plugin.settings.disabledFiles.length > 0;
      if (!this._disabledFilesHeaderEl) {
        this._disabledFilesContainer.empty();
        this._disabledFilesHeaderEl = this._disabledFilesContainer.createEl(
          "h5",
          {
            text: this.plugin.t(
              "disabled_files_header",
              "Files with coloring disabled:",
            ),
          },
        );
        this._disabledFilesHeaderEl.style.margin = "20px 0 8px 0";
        this._disabledFilesHeaderEl.style.marginTop = "20px";

        this._disabledFilesSearchContainer =
          this._disabledFilesContainer.createDiv();
        try {
          this._disabledFilesSearchContainer.addClass("act-search-container");
        } catch (e) {
          try {
            this._disabledFilesSearchContainer.classList.add(
              "act-search-container",
            );
          } catch (_) {}
        }
        this._disabledFilesSearchContainer.style.margin = "8px 0";
        this._disabledFilesSearchContainer.style.display = "flex";
        this._disabledFilesSearchContainer.style.alignItems = "center";
        // this._disabledFilesSearchContainer.style.gap = '8px'; // Removed to fix icon positioning

        this._disabledFilesSearchInput =
          this._disabledFilesSearchContainer.createEl("input", {
            type: "text",
          });
        try {
          this._disabledFilesSearchInput.addClass("act-search-input");
        } catch (e) {
          try {
            this._disabledFilesSearchInput.classList.add("act-search-input");
          } catch (_) {}
        }
        this._disabledFilesSearchInput.placeholder = this.plugin.t(
          "search_disabled_files_placeholder",
          "Search disabled files…",
        );
        this._disabledFilesSearchInput.title = this.plugin.t(
          "search_disabled_files_aria_label",
          "Search disabled files",
        );
        try {
          this._disabledFilesSearchInput.setAttribute(
            "aria-label",
            this.plugin.t(
              "search_disabled_files_aria_label",
              "Search disabled files",
            ),
          );
        } catch (_) {}
        this._disabledFilesSearchInput.style.flex = "1 1 auto";
        this._disabledFilesSearchInput.style.padding = "6px 6px 6px 30px"; // Increased left padding for icon
        // this._disabledFilesSearchInput.style.marginBottom = '6px';
        this._disabledFilesSearchInput.style.border =
          "1px solid var(--background-modifier-border)";
        this._disabledFilesSearchInput.value = String(
          this._disabledFilesSearchQuery || "",
        );

        this._disabledFilesSearchIcon =
          this._disabledFilesSearchContainer.createDiv();
        try {
          this._disabledFilesSearchIcon.addClass("act-search-icon");
        } catch (e) {
          try {
            this._disabledFilesSearchIcon.classList.add("act-search-icon");
          } catch (_) {}
        }

        const searchHandler = () => {
          this._disabledFilesSearchQuery = String(
            this._disabledFilesSearchInput.value || "",
          );
          this._refreshDisabledFiles();
        };
        this._disabledFilesSearchInput.addEventListener("input", searchHandler);
        this._disabledFilesSearchInput.addEventListener("click", searchHandler);
        try {
          this._cleanupHandlers &&
            this._cleanupHandlers.push(() => {
              try {
                this._disabledFilesSearchInput.removeEventListener(
                  "input",
                  searchHandler,
                );
              } catch (_) {}
              try {
                this._disabledFilesSearchInput.removeEventListener(
                  "click",
                  searchHandler,
                );
              } catch (_) {}
            });
        } catch (_) {}

        this._disabledFilesListEl = this._disabledFilesContainer.createDiv();
      }

      this._disabledFilesHeaderEl.style.display = hasAny ? "" : "none";
      this._disabledFilesSearchContainer.style.display = hasAny
        ? "flex"
        : "none";

      try {
        this._disabledFilesListEl.empty();
      } catch (e) {
        try {
          this._disabledFilesListEl.innerHTML = "";
        } catch (_) {}
      }
      if (!hasAny) return;

      if (
        this._disabledFilesSearchInput &&
        String(this._disabledFilesSearchInput.value || "") !==
          String(this._disabledFilesSearchQuery || "")
      ) {
        this._disabledFilesSearchInput.value = String(
          this._disabledFilesSearchQuery || "",
        );
      }

      const q = String(this._disabledFilesSearchQuery || "")
        .trim()
        .toLowerCase();
      const matchesQuery = (filePath) => {
        if (!q) return true;
        const fp = String(filePath || "");
        const name = fp.split("/").pop() || fp;
        return fp.toLowerCase().includes(q) || name.toLowerCase().includes(q);
      };

      this.plugin.settings.disabledFiles
        .filter(matchesQuery)
        .forEach((filePath) => {
          new Setting(this._disabledFilesListEl)
            .setName(filePath)
            .addExtraButton((btn) =>
              btn
                .setIcon("x")
                .setTooltip(
                  this.plugin.t(
                    "tooltip_enable_for_file",
                    "Enable for this file",
                  ),
                )
                .onClick(async () => {
                  const index =
                    this.plugin.settings.disabledFiles.indexOf(filePath);
                  if (index > -1) {
                    this.plugin.settings.disabledFiles.splice(index, 1);
                  }
                  await this.plugin.saveSettings();
                  this._refreshDisabledFiles();
                }),
            );
        });
    } catch (e) {
      debugError("SETTINGS", "_refreshDisabledFiles error", e);
    }
  }

  _refreshBlacklistWords() {
    try {
      if (!this._blacklistWordsContainer) return;
      this._blacklistWordsContainer.empty();

      let entries = Array.isArray(this.plugin.settings.blacklistEntries)
        ? [...this.plugin.settings.blacklistEntries]
        : [];
      const q = String(this._blacklistSearchQuery || "")
        .trim()
        .toLowerCase();
      if (q) {
        entries = entries.filter((e) => {
          const patterns =
            Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
              ? e.groupedPatterns
              : [String(e.pattern || "")];
          const text = [
            ...patterns.map((p) => p.toLowerCase()),
            String(e.presetLabel || "").toLowerCase(),
            String(e.flags || "").toLowerCase(),
          ].join(" ");
          const hay = text;
          // Check if any match mode filter is active - use OR logic
          if (
            this._blacklistSearchMatchStarts ||
            this._blacklistSearchMatchEnds ||
            this._blacklistSearchMatchExact
          ) {
            let matches = false;
            if (this._blacklistSearchMatchStarts)
              matches = matches || hay.startsWith(q);
            if (this._blacklistSearchMatchEnds)
              matches = matches || hay.endsWith(q);
            if (this._blacklistSearchMatchExact) matches = matches || hay === q;
            return matches;
          }
          return hay.includes(q);
        });
      }
      // Apply regex/word-only filter from limit tokens
      if (this._blacklistRegexOnly) {
        entries = entries.filter((e) => !!e.isRegex);
      } else if (this._blacklistWordsOnly) {
        entries = entries.filter((e) => !e.isRegex);
      }
      // Apply sorting according to current mode
      if (this._blacklistSortMode === "a-z") {
        entries.sort((a, b) => {
          const aPat =
            Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0
              ? a.groupedPatterns[0]
              : a.pattern || "";
          const bPat =
            Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0
              ? b.groupedPatterns[0]
              : b.pattern || "";
          const aEmpty = String(aPat).trim().length === 0;
          const bEmpty = String(bPat).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          return String(aPat)
            .toLowerCase()
            .localeCompare(String(bPat).toLowerCase());
        });
      } else if (this._blacklistSortMode === "reverse-a-z") {
        entries.sort((a, b) => {
          const aPat =
            Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0
              ? a.groupedPatterns[0]
              : a.pattern || "";
          const bPat =
            Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0
              ? b.groupedPatterns[0]
              : b.pattern || "";
          const aEmpty = String(aPat).trim().length === 0;
          const bEmpty = String(bPat).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          return String(bPat)
            .toLowerCase()
            .localeCompare(String(aPat).toLowerCase());
        });
      }
      // Move flagged new entries to the end (preserving insertion order)
      if (this._blacklistNewSet && this._blacklistNewSet.size > 0) {
        const newList = [];
        const baseOrder = Array.isArray(this.plugin.settings.blacklistEntries)
          ? [...this.plugin.settings.blacklistEntries]
          : [];
        baseOrder.forEach((e) => {
          if (e && e.uid && this._blacklistNewSet.has(e.uid)) newList.push(e);
        });
        const oldList = entries.filter(
          (e) => !(e && e.uid && this._blacklistNewSet.has(e.uid)),
        );
        entries = [...oldList, ...newList];
      }
      // Separate entries with persistAtEnd flag to display them at the end without filtering
      const persistAtEndEntries = entries.filter(
        (e) => e && e.persistAtEnd === true,
      );
      const regularEntries = entries.filter(
        (e) => !e || e.persistAtEnd !== true,
      );
      const limitedRegularEntries =
        this._blacklistLimit && this._blacklistLimit > 0
          ? regularEntries.slice(-this._blacklistLimit)
          : regularEntries;
      const limitedEntries = [...limitedRegularEntries, ...persistAtEndEntries];
      limitedEntries.forEach((entry) => {
        const row = this._blacklistWordsContainer.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.marginBottom = "8px";
        row.style.gap = "8px";

        const displayPatterns =
          Array.isArray(entry.groupedPatterns) &&
          entry.groupedPatterns.length > 0
            ? entry.groupedPatterns.join(", ")
            : entry.pattern || "";

        if (entry.presetLabel) {
          const badge = row.createEl("span", { text: entry.presetLabel });
          badge.style.marginRight = "8px";
          badge.style.opacity = "0.7";
        }
        const textInput = row.createEl("input", {
          type: "text",
          value: displayPatterns,
        });
        textInput.style.flex = "1";
        textInput.style.padding = "6px";
        textInput.style.borderRadius = "4px";
        textInput.style.border = "1px solid var(--background-modifier-border)";
        textInput.placeholder = this.plugin.t(
          "word_pattern_placeholder_short",
          "Keyword or pattern, or comma-separated words",
        );

        const regexChk = row.createEl("input", { type: "checkbox" });
        regexChk.checked = !!entry.isRegex;
        // regexChk.title = 'Treat pattern as a JavaScript regular expression';
        regexChk.title = this.plugin.t("use_regex", "Use Regex");
        regexChk.style.cursor = "pointer";

        const flagsInput = row.createEl("input", {
          type: "text",
          value: entry.flags || "",
        });
        flagsInput.placeholder = this.plugin.t("flags_placeholder", "flags");
        flagsInput.style.width = "50px";
        flagsInput.style.padding = "6px";
        flagsInput.style.borderRadius = "4px";
        flagsInput.style.border = "1px solid var(--background-modifier-border)";
        if (!entry.isRegex) flagsInput.style.display = "none";

        // Delete button (commented out — use right-click context menu to delete)
        /* const del = row.createEl("button", {
          text: this.plugin.t("delete_button_text", "✕"),
        });
        del.addClass("mod-warning");
        del.style.padding = "4px 8px";
        del.style.cursor = "pointer"; */
        const del = { addEventListener: () => {}, removeEventListener: () => {} };

        if (!entry.uid) {
          try {
            entry.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (e) {
            entry.uid = Date.now();
          }
        }
        const updateInputDisplay = () => {
          // Update the input field to show the current state from entry
          if (regexChk && regexChk.checked) {
            textInput.value = entry.pattern || "";
          } else {
            const patterns =
              Array.isArray(entry.groupedPatterns) &&
              entry.groupedPatterns.length > 0
                ? entry.groupedPatterns
                : entry.pattern
                  ? [entry.pattern]
                  : [];
            textInput.value = patterns.map((p) => String(p).trim()).join(", ");
          }
        };

        const resolveBlacklistIndex = () => {
          let entryIdx = -1;
          if (entry && entry.uid) {
            entryIdx = this.plugin.settings.blacklistEntries.findIndex(
              (e) => e && e.uid === entry.uid,
            );
          }
          if (entryIdx === -1) {
            // Try to resolve by matching patterns string
            const currJoined = (() => {
              const pats =
                Array.isArray(entry.groupedPatterns) &&
                entry.groupedPatterns.length > 0
                  ? entry.groupedPatterns
                  : entry.pattern
                    ? [entry.pattern]
                    : [];
              return pats.map((p) => String(p).trim()).join(", ");
            })();
            entryIdx = this.plugin.settings.blacklistEntries.findIndex((e) => {
              const pats =
                Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
                  ? e.groupedPatterns
                  : e.pattern
                    ? [e.pattern]
                    : [];
              const joined = pats.map((p) => String(p).trim()).join(", ");
              return (
                joined === currJoined &&
                !!e.isRegex === !!entry.isRegex &&
                String(e.flags || "") === String(entry.flags || "") &&
                String(e.presetLabel || "") === String(entry.presetLabel || "")
              );
            });
          }
          if (
            entryIdx !== -1 &&
            (!entry.uid || !this.plugin.settings.blacklistEntries[entryIdx].uid)
          ) {
            try {
              const uid =
                entry.uid ||
                Date.now().toString(36) + Math.random().toString(36).slice(2);
              this.plugin.settings.blacklistEntries[entryIdx].uid = uid;
              entry.uid = uid;
            } catch (e) {}
          }
          return entryIdx;
        };

        const textInputHandler = async () => {
          try {
            const newPattern = textInput.value;
            let entryIdx = resolveBlacklistIndex();
            if (entryIdx === -1) return;
            if (!newPattern) {
              this.plugin.settings.blacklistEntries.splice(entryIdx, 1);
            } else if (
              this.plugin.settings.enableRegexSupport &&
              entry.isRegex &&
              !this.plugin.settings.disableRegexSafety &&
              this.plugin.isRegexTooComplex(newPattern)
            ) {
              new Notice(
                this.plugin.t(
                  "notice_pattern_too_complex",
                  "Pattern too complex: " + newPattern.substring(0, 60) + "...",
                ),
              );
              updateInputDisplay();
              return;
            } else {
              if (entry.isRegex) {
                this.plugin.settings.blacklistEntries[entryIdx].pattern =
                  newPattern;
                this.plugin.settings.blacklistEntries[
                  entryIdx
                ].groupedPatterns = null;
                entry.pattern = newPattern;
                entry.groupedPatterns = null;
              } else {
                const patterns = newPattern
                  .split(",")
                  .map((p) => String(p).trim())
                  .filter((p) => p.length > 0);
                this.plugin.settings.blacklistEntries[entryIdx].pattern =
                  patterns[0];
                this.plugin.settings.blacklistEntries[
                  entryIdx
                ].groupedPatterns = patterns.length > 1 ? patterns : null;
                // Sync local entry reference so blur does not revert display
                entry.pattern =
                  this.plugin.settings.blacklistEntries[entryIdx].pattern;
                entry.groupedPatterns =
                  this.plugin.settings.blacklistEntries[
                    entryIdx
                  ].groupedPatterns;
              }
            }
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            this.plugin.forceRefreshAllReadingViews();
            this.plugin.triggerActiveDocumentRerender();
            // Refresh the blacklist list to rebuild rows with new object references
            this._refreshBlacklistWords();
          } catch (error) {
            debugError("SETTINGS", "Error saving blacklist entry", error);
            new Notice(
              this.plugin.t(
                "notice_error_saving_changes",
                "Error saving changes. Please try again.",
              ),
            );
          }
        };

        // cpHandler for blacklist color picker
        const regexChkHandler = async () => {
          let entryIdx = resolveBlacklistIndex();
          if (entryIdx === -1) return;
          this.plugin.settings.blacklistEntries[entryIdx].isRegex =
            regexChk.checked;
          flagsInput.style.display = regexChk.checked ? "inline-block" : "none";
          await this.plugin.saveSettings();
          // Sync local entry and refresh UI
          entry.isRegex = regexChk.checked;
          this._refreshBlacklistWords();
        };

        const flagsInputHandler = async () => {
          let entryIdx = resolveBlacklistIndex();
          if (entryIdx === -1) return;
          this.plugin.settings.blacklistEntries[entryIdx].flags =
            flagsInput.value || "";
          await this.plugin.saveSettings();
          // Sync local entry and refresh UI
          entry.flags = flagsInput.value || "";
          this._refreshBlacklistWords();
        };

        const delHandler = async () => {
          let entryIdx = resolveBlacklistIndex();
          if (entryIdx === -1) return;
          this.plugin.settings.blacklistEntries.splice(entryIdx, 1);
          await this.plugin.saveSettings();
          this._refreshBlacklistWords();
        };

        const duplicateHandler = async () => {
          try {
            let entryIdx = resolveBlacklistIndex();
            if (entryIdx === -1) return;
            const orig = this.plugin.settings.blacklistEntries[entryIdx];
            const dup = Object.assign({}, orig);
            try {
              dup.uid =
                Date.now().toString(36) + Math.random().toString(36).slice(2);
            } catch (e) {
              dup.uid = Date.now();
            }
            this.plugin.settings.blacklistEntries.splice(entryIdx + 1, 0, dup);
            await this.plugin.saveSettings();
            this._suspendSorting = this._blacklistSortMode === "last-added";
            this._refreshBlacklistWords();
          } catch (e) {
            debugError("SETTINGS", "duplicate blacklist entry error", e);
          }
        };

        const openInRegexTesterHandler = async () => {
          try {
            if (!entry.isRegex) return;
            const onAdded = () => {
              try {
                this._refreshBlacklistWords();
              } catch (e) {}
            };
            const modal = new BlacklistRegexTesterModal(
              this.app,
              this.plugin,
              onAdded,
            );
            modal._editingEntry = entry;
            if (entry.pattern) modal._preFillPattern = entry.pattern;
            if (entry.flags) modal._preFillFlags = entry.flags;
            if (entry.presetLabel) modal._preFillName = entry.presetLabel;
            modal.open();
          } catch (e) {
            debugError("SETTINGS", "open in regex tester error", e);
          }
        };

        const contextMenuHandler = (ev) => {
          try {
            ev && ev.preventDefault && ev.preventDefault();
            if (ev && ev.stopPropagation) ev.stopPropagation();
            const menu = new Menu(this.app);

            if (entry.isRegex) {
              menu.addItem((item) => {
                item
                  .setTitle(
                    this.plugin.t(
                      "open_in_regex_tester",
                      "Open in Regex Tester",
                    ),
                  )
                  .setIcon("regex")
                  .onClick(openInRegexTesterHandler);
              });
            }

            menu.addItem((item) => {
              item
                .setTitle(this.plugin.t("duplicate_entry", "Duplicate Entry"))
                .setIcon("copy")
                .onClick(duplicateHandler);
            });

            menu.addItem((item) => {
              item
                .setTitle(this.plugin.t("context_delete_entry", "Delete entry"))
                .setIcon("trash")
                .onClick(delHandler);
            });

            menu.showAtPosition({ x: ev.clientX, y: ev.clientY });
          } catch (e) {
            debugError("SETTINGS", "context menu error", e);
          }
        };

        textInput.addEventListener("change", textInputHandler);
        textInput.addEventListener("blur", textInputHandler);
        row.addEventListener("contextmenu", contextMenuHandler);
        regexChk.addEventListener("change", regexChkHandler);
        flagsInput.addEventListener("change", flagsInputHandler);
        del.addEventListener("click", delHandler);
        this._cleanupHandlers.push(() => {
          try {
            textInput.removeEventListener("change", textInputHandler);
          } catch (e) {}
          try {
            textInput.removeEventListener("blur", textInputHandler);
          } catch (e) {}
          try {
            row.removeEventListener("contextmenu", contextMenuHandler);
          } catch (e) {}
          try {
            regexChk.removeEventListener("change", regexChkHandler);
          } catch (e) {}
          try {
            flagsInput.removeEventListener("change", flagsInputHandler);
          } catch (e) {}
          try {
            del.removeEventListener("click", delHandler);
          } catch (e) {}
        });
      });
    } catch (e) {
      debugError("SETTINGS", "_refreshBlacklistWords error", e);
    }
  }

  _refreshPathRules() {
    try {
      if (!this._pathRulesContainer) return;
      this._pathRulesContainer.empty();
      const rows = Array.isArray(this.plugin.settings.pathRules)
        ? [...this.plugin.settings.pathRules]
        : [];
      const q = String(this._pathRulesSearchQuery || "")
        .trim()
        .toLowerCase();
      let filteredRows = q
        ? rows.filter((r) => {
            const text = [
              String(r.path || ""),
              String(r.mode || ""),
              String(r.matchType || ""),
            ]
              .join(" ")
              .toLowerCase();
            const hay = text;
            if (this._pathSearchMatch === "starts") return hay.startsWith(q);
            if (this._pathSearchMatch === "ends") return hay.endsWith(q);
            if (this._pathSearchMatch === "exact") return hay === q;
            return hay.includes(q);
          })
        : rows;
      if (this._pathModeOnly === "include") {
        filteredRows = filteredRows.filter(
          (r) => String(r.mode || "") === "include",
        );
      } else if (this._pathModeOnly === "exclude") {
        filteredRows = filteredRows.filter(
          (r) => String(r.mode || "") === "exclude",
        );
      }
      // Skip sorting if suspension flag is set (new entry being added)
      if (!this._suspendSorting) {
        if (this._pathSortMode === "a-z") {
          filteredRows.sort((a, b) => {
            const aPath = String(a.path || "");
            const bPath = String(b.path || "");
            const aEmpty = aPath.trim().length === 0;
            const bEmpty = bPath.trim().length === 0;
            if (aEmpty && !bEmpty) return 1;
            if (!aEmpty && bEmpty) return -1;
            return aPath.toLowerCase().localeCompare(bPath.toLowerCase());
          });
        } else if (this._pathSortMode === "reverse-a-z") {
          filteredRows.sort((a, b) => {
            const aPath = String(a.path || "");
            const bPath = String(b.path || "");
            const aEmpty = aPath.trim().length === 0;
            const bEmpty = bPath.trim().length === 0;
            if (aEmpty && !bEmpty) return 1;
            if (!aEmpty && bEmpty) return -1;
            return bPath.toLowerCase().localeCompare(aPath.toLowerCase());
          });
        } else if (this._pathSortMode === "mode") {
          const order = { exclude: 0, include: 1 };
          filteredRows.sort((a, b) => {
            const aPath = String(a.path || "");
            const bPath = String(b.path || "");
            const aEmpty = aPath.trim().length === 0;
            const bEmpty = bPath.trim().length === 0;
            if (aEmpty && !bEmpty) return 1;
            if (!aEmpty && bEmpty) return -1;
            const styleCmp =
              (order[String(a.mode || "")] ?? 1) -
              (order[String(b.mode || "")] ?? 1);
            if (styleCmp !== 0) return styleCmp;
            return aPath.toLowerCase().localeCompare(bPath.toLowerCase());
          });
        } else if (this._pathSortMode === "type") {
          filteredRows.sort((a, b) => {
            const aPath = String(a.path || "");
            const bPath = String(b.path || "");
            const aEmpty = aPath.trim().length === 0;
            const bEmpty = bPath.trim().length === 0;
            if (aEmpty && !bEmpty) return 1;
            if (!aEmpty && bEmpty) return -1;
            const typeCmp =
              Boolean(a.isFolder) === Boolean(b.isFolder)
                ? 0
                : a.isFolder
                  ? -1
                  : 1;
            if (typeCmp !== 0) return typeCmp;
            return aPath.toLowerCase().localeCompare(bPath.toLowerCase());
          });
        }
      }
      const buildSuggestions = () => {
        const files = this.app.vault.getFiles();
        const folders = new Set();
        const filePaths = [];
        files.forEach((f) => {
          const p = String(f.path).replace(/\\/g, "/");
          filePaths.push(p);
          const idx = p.lastIndexOf("/");
          const folder = idx !== -1 ? p.slice(0, idx) : "";
          if (folder) {
            const parts = folder.split("/");
            let acc = "";
            parts.forEach((part) => {
              acc = acc ? acc + "/" + part : part;
              folders.add(acc);
            });
          }
        });
        return { files: filePaths.sort(), folders: Array.from(folders).sort() };
      };
      const sugg = buildSuggestions();
      const limitedRows =
        this._pathLimit && this._pathLimit > 0
          ? filteredRows.slice(-this._pathLimit)
          : filteredRows;
      limitedRows.forEach((entry, filterIndex) => {
        // Get the actual index in the original pathRules array
        const actualIndex = rows.indexOf(entry);
        if (actualIndex === -1) return; // Safety check

        const row = this._pathRulesContainer.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.marginBottom = "8px";
        const modeSel = row.createEl("select");
        modeSel.style.flex = "0 0 auto";
        modeSel.style.padding = "6px";
        modeSel.style.borderRadius = "4px";
        modeSel.style.border = "1px solid var(--background-modifier-border)";
        modeSel.style.background = "var(--background-modifier-form-field)";
        modeSel.style.textAlign = "center";
        ["include", "exclude"].forEach((val) => {
          const opt = modeSel.createEl("option", {
            text: this.plugin.t(
              "path_rule_mode_" + val,
              val === "include" ? "Include" : "Exclude",
            ),
          });
          opt.value = val;
        });
        modeSel.value = entry.mode === "exclude" ? "exclude" : "include";
        const input = row.createEl("input", {
          type: "text",
          value: entry.path || "",
        });
        input.placeholder = this.plugin.t(
          "enter_path_or_pattern",
          "Enter path or pattern",
        );
        input.style.flex = "1";
        input.style.padding = "6px";
        input.style.borderRadius = "4px";
        input.style.border = "1px solid var(--background-modifier-border)";
        const del = row.createEl("button", {
          text: this.plugin.t("delete_button_text", "✕"),
        });
        del.addClass("mod-warning");
        del.style.border = "none";
        del.style.cursor = "pointer";
        del.style.flex = "0 0 auto";
        const updateDropdown = () => {
          if (input._actDropdown) {
            const dd = input._actDropdown;
            if (input._dropdownScrollListener) {
              document.removeEventListener(
                "scroll",
                input._dropdownScrollListener,
                true,
              );
              input._dropdownScrollListener = null;
            }
            if (input._dropdownClickListener) {
              document.removeEventListener(
                "click",
                input._dropdownClickListener,
              );
              input._dropdownClickListener = null;
            }
            if (input._dropdownKeyListener) {
              document.removeEventListener(
                "keydown",
                input._dropdownKeyListener,
              );
              input._dropdownKeyListener = null;
            }
            dd.remove();
            input._actDropdown = null;
          }
          const val = String(input.value || "")
            .trim()
            .toLowerCase();
          const list = [];
          sugg.folders.forEach((f) => list.push({ t: "folder", p: f }));
          sugg.files.forEach((f) => list.push({ t: "file", p: f }));
          const filtered = val
            ? list.filter((x) => x.p.toLowerCase().includes(val))
            : list;
          if (filtered.length === 0) return;
          const dd = document.createElement("div");
          Object.assign(dd.style, {
            position: "fixed",
            zIndex: 2000,
            background: "var(--background-primary)",
            color: "var(--text-normal)",
            border: "1px solid var(--background-modifier-border)",
            borderRadius: "6px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
            maxHeight: "240px",
            overflowY: "auto",
            padding: "6px 0",
            minWidth: Math.max(240, input.offsetWidth) + "px",
          });
          let hi = -1;
          filtered.forEach((item) => {
            const it = document.createElement("div");
            it.textContent = item.p || "/";
            Object.assign(it.style, {
              padding: "8px 12px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            });
            it.onmouseenter = () => {
              if (hi >= 0 && dd.children[hi])
                dd.children[hi].style.background = "transparent";
              it.style.background = "var(--background-secondary)";
              hi = Array.from(dd.children).indexOf(it);
            };
            it.onmouseleave = () => {
              it.style.background = "transparent";
            };
            it.onclick = async (e) => {
              e.stopPropagation();
              input.value = item.p + (item.t === "folder" ? "/" : "");
              const ev = new Event("change", { bubbles: true });
              input.dispatchEvent(ev);
              dd.remove();
              input._actDropdown = null;
            };
            dd.appendChild(it);
          });
          document.body.appendChild(dd);
          const pos = () => {
            const r = input.getBoundingClientRect();
            dd.style.left = r.left + "px";
            dd.style.top = r.bottom + 6 + "px";
            dd.style.width = input.offsetWidth + "px";
          };
          pos();
          input._actDropdown = dd;
          input._dropdownScrollListener = pos;
          input._dropdownClickListener = (ev) => {
            if (ev.target === input) return;
            if (!dd.contains(ev.target)) {
              dd.remove();
              input._actDropdown = null;
              document.removeEventListener(
                "click",
                input._dropdownClickListener,
              );
              document.removeEventListener(
                "scroll",
                input._dropdownScrollListener,
                true,
              );
              document.removeEventListener(
                "keydown",
                input._dropdownKeyListener,
              );
              input._dropdownClickListener = null;
              input._dropdownScrollListener = null;
              input._dropdownKeyListener = null;
            }
          };
          input._dropdownKeyListener = (ev) => {
            const items = Array.from(dd.children);
            if (items.length === 0) return;
            if (ev.key === "ArrowDown") {
              ev.preventDefault();
              hi = Math.min(hi + 1, items.length - 1);
              items.forEach((item) => (item.style.background = "transparent"));
              if (hi >= 0) {
                items[hi].style.background = "var(--background-secondary)";
                items[hi].scrollIntoView({ block: "nearest" });
              }
            } else if (ev.key === "ArrowUp") {
              ev.preventDefault();
              hi = Math.max(hi - 1, -1);
              items.forEach((item) => (item.style.background = "transparent"));
              if (hi >= 0) {
                items[hi].style.background = "var(--background-secondary)";
                items[hi].scrollIntoView({ block: "nearest" });
              }
            } else if (ev.key === "Enter" && hi >= 0) {
              ev.preventDefault();
              items[hi].click();
            } else if (ev.key === "Escape") {
              ev.preventDefault();
              dd.remove();
              input._actDropdown = null;
              document.removeEventListener(
                "keydown",
                input._dropdownKeyListener,
              );
              input._dropdownKeyListener = null;
            }
          };
          document.addEventListener("scroll", pos, true);
          document.addEventListener("click", input._dropdownClickListener);
          document.addEventListener("keydown", input._dropdownKeyListener);
          this._cleanupHandlers.push(() => {
            try {
              document.removeEventListener("scroll", pos, true);
            } catch (e) {}
            try {
              document.removeEventListener(
                "click",
                input._dropdownClickListener,
              );
            } catch (e) {}
            try {
              document.removeEventListener(
                "keydown",
                input._dropdownKeyListener,
              );
            } catch (e) {}
            if (input._actDropdown) {
              try {
                input._actDropdown.remove();
              } catch (e) {}
              input._actDropdown = null;
            }
          });
        };
        const focusHandler = () => {
          updateDropdown();
        };
        input.addEventListener("focus", focusHandler);
        const clickHandler = () => {
          updateDropdown();
        };
        input.addEventListener("click", clickHandler);
        this._cleanupHandlers.push(() =>
          input.removeEventListener("focus", focusHandler),
        );
        this._cleanupHandlers.push(() =>
          input.removeEventListener("click", clickHandler),
        );
        const inputHandler = () => {
          updateDropdown();
        };
        input.addEventListener("input", inputHandler);
        this._cleanupHandlers.push(() =>
          input.removeEventListener("input", inputHandler),
        );
        const changeHandler = async () => {
          let newPath = String(input.value || "")
            .trim()
            .replace(/\\\\/g, "/");
          const isFolderSel =
            /\/$/.test(newPath) ||
            (!/\.[a-zA-Z0-9]+$/.test(newPath) && newPath.includes("/"));
          // Ensure trailing slash for folders so folder rules apply to all descendants
          if (isFolderSel && !/\/$/.test(newPath)) newPath = newPath + "/";
          this.plugin.settings.pathRules[actualIndex].path = newPath;
          this.plugin.settings.pathRules[actualIndex].isFolder = isFolderSel;
          await this.plugin.saveSettings();
          this._refreshPathRules();
        };
        input.addEventListener("change", changeHandler);
        this._cleanupHandlers.push(() =>
          input.removeEventListener("change", changeHandler),
        );
        const modeHandler = async () => {
          this.plugin.settings.pathRules[actualIndex].mode = modeSel.value;
          await this.plugin.saveSettings();
          this._refreshPathRules();
        };
        modeSel.addEventListener("change", modeHandler);
        this._cleanupHandlers.push(() =>
          modeSel.removeEventListener("change", modeHandler),
        );
        const delHandler = async () => {
          if (
            actualIndex !== -1 &&
            this.plugin.settings.pathRules[actualIndex]
          ) {
            this.plugin.settings.pathRules.splice(actualIndex, 1);
            await this.plugin.saveSettings();
            this._refreshPathRules();
          }
        };
        del.addEventListener("click", delHandler);
        this._cleanupHandlers.push(() =>
          del.removeEventListener("click", delHandler),
        );
      });
      if (rows.length === 0) {
        this._pathRulesContainer.createEl("p", {
          text: this.plugin.t("no_rules_configured", "No rules configured."),
        });
      }
    } catch (e) {
      debugError("SETTINGS", "_refreshPathRules error", e);
    }
  }

  _refreshCustomSwatches() {
    try {
      if (!this._customSwatchesContainer) return;
      this._customSwatchesContainer.empty();

      // Determine fold states (initialize if not set)
      if (typeof this._defaultColorsFolded === "undefined") {
        this._defaultColorsFolded = true; // Default colors start folded
      }
      if (typeof this._customSwatchesFolded === "undefined") {
        this._customSwatchesFolded =
          this.plugin.settings.customSwatchesFolded || false; // Load from settings
      }

      // ===== DEFAULT COLORS SECTION =====
      const defaultColorsHeaderDiv = this._customSwatchesContainer.createDiv();
      defaultColorsHeaderDiv.style.display = "flex";
      defaultColorsHeaderDiv.style.alignItems = "center";
      defaultColorsHeaderDiv.style.gap = "8px";
      defaultColorsHeaderDiv.style.marginTop = "16px";
      defaultColorsHeaderDiv.style.marginBottom = "8px";
      defaultColorsHeaderDiv.style.cursor = "pointer";

      const defaultColorsToggle = defaultColorsHeaderDiv.createEl("span");
      defaultColorsToggle.textContent = this._defaultColorsFolded ? "▶" : "▼";
      defaultColorsToggle.style.fontSize = "12px";
      defaultColorsToggle.style.fontWeight = "bold";
      defaultColorsToggle.style.display = "inline-block";
      defaultColorsToggle.style.width = "16px";

      const defaultColorsTitle = defaultColorsHeaderDiv.createEl("h5", {
        text: this.plugin.t("default_colors_header", "Default Swatches"),
      });
      defaultColorsTitle.style.margin = "0";
      defaultColorsTitle.style.padding = "0";
      defaultColorsTitle.style.flex = "1";
      defaultColorsTitle.style.fontSize = "16px";
      defaultColorsTitle.style.fontWeight = "600";

      const defaultColorsContent = this._customSwatchesContainer.createDiv();
      defaultColorsContent.style.display = this._defaultColorsFolded
        ? "none"
        : "block";
      defaultColorsContent.style.marginBottom = "16px";

      const defaultColorsToggleHandler = () => {
        this._defaultColorsFolded = !this._defaultColorsFolded;
        defaultColorsToggle.textContent = this._defaultColorsFolded ? "▶" : "▼";
        defaultColorsContent.style.display = this._defaultColorsFolded
          ? "none"
          : "block";
      };

      defaultColorsHeaderDiv.addEventListener(
        "click",
        defaultColorsToggleHandler,
      );
      this._cleanupHandlers.push(() =>
        defaultColorsHeaderDiv.removeEventListener(
          "click",
          defaultColorsToggleHandler,
        ),
      );

      // Render default colors from settings.swatches (always displayed in default section, read-only)
      const swatches = Array.isArray(this.plugin.settings.swatches)
        ? this.plugin.settings.swatches
        : [];
      swatches.forEach((sw) => {
        const row = defaultColorsContent.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.marginBottom = "8px";

        const nameInput = row.createEl("input", {
          type: "text",
          value: sw && sw.name ? sw.name : "Unnamed",
        });
        nameInput.style.flex = "1";
        nameInput.style.padding = "6px";
        nameInput.style.borderRadius = "4px";
        nameInput.style.border = "1px solid var(--background-modifier-border)";
        nameInput.disabled = true; // Can't rename default colors

        const colorPicker = row.createEl("input", { type: "color" });
        colorPicker.value = sw && sw.color ? sw.color : "#000000";
        colorPicker.style.width = "30px";
        colorPicker.style.height = "30px";
        colorPicker.style.border = "none";
        colorPicker.style.borderRadius = "4px";
        colorPicker.style.cursor = "pointer";
        colorPicker.disabled = true; // Can't edit default colors

        const infoSpan = row.createEl("span", {
          text: this.plugin.t("label_built_in", "(built-in)"),
        });
        infoSpan.style.fontSize = "12px";
        infoSpan.style.opacity = "0.6";
        infoSpan.style.flex = "0 0 auto";
      });

      // ===== CUSTOM SWATCHES SECTION =====
      const customSwatchesHeaderDiv = this._customSwatchesContainer.createDiv();
      customSwatchesHeaderDiv.style.display = "flex";
      customSwatchesHeaderDiv.style.alignItems = "center";
      customSwatchesHeaderDiv.style.gap = "8px";
      customSwatchesHeaderDiv.style.marginTop = "16px";
      customSwatchesHeaderDiv.style.marginBottom = "8px";
      customSwatchesHeaderDiv.style.cursor = "pointer";

      const customSwatchesToggle = customSwatchesHeaderDiv.createEl("span");
      customSwatchesToggle.textContent = this._customSwatchesFolded ? "▶" : "▼";
      customSwatchesToggle.style.fontSize = "12px";
      customSwatchesToggle.style.fontWeight = "bold";
      customSwatchesToggle.style.display = "inline-block";
      customSwatchesToggle.style.width = "16px";

      const customSwatchesTitle = customSwatchesHeaderDiv.createEl("h5", {
        text: this.plugin.t("custom_swatches_header", "Custom Swatches"),
      });
      customSwatchesTitle.style.margin = "0";
      customSwatchesTitle.style.padding = "0";
      customSwatchesTitle.style.flex = "1";
      customSwatchesTitle.style.fontSize = "16px";
      customSwatchesTitle.style.fontWeight = "600";

      const customSwatchesContent = this._customSwatchesContainer.createDiv();
      customSwatchesContent.style.display = this._customSwatchesFolded
        ? "none"
        : "block";
      customSwatchesContent.style.marginBottom = "16px";

      const customSwatchesToggleHandler = async () => {
        this._customSwatchesFolded = !this._customSwatchesFolded;
        this.plugin.settings.customSwatchesFolded = this._customSwatchesFolded;
        await this.plugin.saveSettings();
        customSwatchesToggle.textContent = this._customSwatchesFolded
          ? "▶"
          : "▼";
        customSwatchesContent.style.display = this._customSwatchesFolded
          ? "none"
          : "block";
      };

      customSwatchesHeaderDiv.addEventListener(
        "click",
        customSwatchesToggleHandler,
      );
      this._cleanupHandlers.push(() =>
        customSwatchesHeaderDiv.removeEventListener(
          "click",
          customSwatchesToggleHandler,
        ),
      );

      // Render user-added custom swatches
      const userCustomSwatches = Array.isArray(
        this.plugin.settings.userCustomSwatches,
      )
        ? this.plugin.settings.userCustomSwatches
        : [];

      if (userCustomSwatches.length === 0) {
        const emptyMsg = customSwatchesContent.createEl("p", {
          text: this.plugin.t(
            "no_custom_swatches_yet",
            'No custom swatches yet. Click "+ Add color" to create one.',
          ),
        });
        emptyMsg.style.opacity = "0.6";
        emptyMsg.style.fontSize = "12px";
      } else {
        // Shared drag state for all swatches
        let dragSource = null;
        let dragStartOrder = null;

        // Create a function to save the reordered swatches
        const saveDragReorder = async () => {
          const swatchRows = Array.from(
            customSwatchesContent.querySelectorAll("div[data-swatch-index]"),
          );
          const newOrder = swatchRows.map((r) => {
            const idx = parseInt(r.getAttribute("data-swatch-index"), 10);
            return this.plugin.settings.userCustomSwatches[idx];
          });
          this.plugin.settings.userCustomSwatches = newOrder;
          this.plugin.settings.customSwatches =
            this.plugin.settings.userCustomSwatches.map((s) => s.color);
          await this.plugin.saveSettings();
          this._refreshCustomSwatches();
        };

        // Render editable custom swatches
        userCustomSwatches.forEach((sw, i) => {
          const row = customSwatchesContent.createDiv();
          row.style.display = "flex";
          row.style.alignItems = "center";
          row.style.gap = "8px";
          row.style.marginBottom = "8px";
          row.setAttribute("data-swatch-index", i.toString());

          // Drag handle - Obsidian menu icon, transparent background, no box-shadow
          const dragHandle = row.createEl("button");
          setIcon(dragHandle, "menu");
          // dragHandle.setAttribute('draggable', 'true');
          dragHandle.style.padding = "0";
          dragHandle.style.border = "none";
          dragHandle.style.background = "transparent";
          dragHandle.style.boxShadow = "none";
          dragHandle.style.cursor = "grab";
          dragHandle.style.color = "var(--text-muted)";
          dragHandle.style.flexShrink = "0";
          dragHandle.style.display = "flex";
          dragHandle.style.alignItems = "center";
          dragHandle.style.justifyContent = "center";
          dragHandle.setAttribute(
            "aria-label",
            this.plugin.t("drag_to_reorder", "Drag to reorder"),
          );

          const nameInput = row.createEl("input", {
            type: "text",
            value: sw && sw.name ? sw.name : `Swatch ${i + 1}`,
          });
          nameInput.style.flex = "1";
          nameInput.style.padding = "6px";
          nameInput.style.borderRadius = "4px";
          nameInput.style.border =
            "1px solid var(--background-modifier-border)";

          const colorPicker = row.createEl("input", { type: "color" });
          colorPicker.value = sw && sw.color ? sw.color : "#000000";
          colorPicker.style.width = "30px";
          colorPicker.style.height = "30px";
          colorPicker.style.border = "none";
          colorPicker.style.borderRadius = "4px";
          colorPicker.style.cursor = "pointer";
          colorPicker.style.flexShrink = "0";
          const colorPickerContextHandler = (ev) => {
            try {
              ev.preventDefault();
              ev.stopPropagation();
              const modal = new ColorPickerModal(
                this.app,
                this.plugin,
                async (color) => {
                  if (color && this.plugin.isValidHexColor(color)) {
                    colorPicker.value = color;
                    await colorHandler();
                  }
                },
                "text",
                sw && sw.name ? sw.name : "",
              );
              modal._hideHeaderControls = true;
              modal._preFillTextColor = colorPicker.value;
              modal.open();
            } catch (_) {}
          };

          const delBtn = row.createEl("button", {
            text: this.plugin.t("delete_button_text", "✕"),
          });
          delBtn.addClass("mod-warning");
          delBtn.style.padding = "4px 8px";
          delBtn.style.borderRadius = "4px";
          delBtn.style.cursor = "pointer";
          delBtn.style.flexShrink = "0";

          const nameHandler = async () => {
            const val = nameInput.value.trim();
            this.plugin.settings.userCustomSwatches[i].name =
              val || `Swatch ${i + 1}`;
            this.plugin.settings.customSwatches =
              this.plugin.settings.userCustomSwatches.map((s) => s.color);
            await this.plugin.saveSettings();
          };
          const colorHandler = async () => {
            const val = colorPicker.value;
            if (!this.plugin.isValidHexColor(val)) return;
            const prev = this.plugin.settings.userCustomSwatches[i].color;
            const swName =
              this.plugin.settings.userCustomSwatches[i].name ||
              `Swatch ${i + 1}`;
            this.plugin.settings.userCustomSwatches[i].color = val;
            this.plugin.settings.customSwatches =
              this.plugin.settings.userCustomSwatches.map((s) => s.color);
            if (this.plugin.settings.linkSwatchUpdatesToEntries) {
              const updateEntry = (e) => {
                try {
                  if (e) {
                    if (
                      typeof e.color === "string" &&
                      e.color.toLowerCase() === String(prev || "").toLowerCase()
                    ) {
                      e.color = val;
                      e._savedTextColor = val;
                    }
                    if (
                      typeof e.textColor === "string" &&
                      e.textColor !== "currentColor" &&
                      e.textColor.toLowerCase() ===
                        String(prev || "").toLowerCase()
                    ) {
                      e.textColor = val;
                      e._savedTextColor = val;
                    }
                    if (
                      typeof e.backgroundColor === "string" &&
                      e.backgroundColor.toLowerCase() ===
                        String(prev || "").toLowerCase()
                    ) {
                      e.backgroundColor = val;
                      e._savedBackgroundColor = val;
                    }
                  }
                } catch (_) {}
              };

              const entries = Array.isArray(this.plugin.settings.wordEntries)
                ? this.plugin.settings.wordEntries
                : [];
              entries.forEach(updateEntry);

              const groups = Array.isArray(this.plugin.settings.wordEntryGroups)
                ? this.plugin.settings.wordEntryGroups
                : [];
              groups.forEach((g) => {
                if (g && Array.isArray(g.entries)) {
                  g.entries.forEach(updateEntry);
                }
              });
            }
            await this.plugin.saveSettings();
            try {
              this.plugin.compileWordEntries();
              this.plugin.compileTextBgColoringEntries();
              this.plugin.reconfigureEditorExtensions();
              this.plugin.forceRefreshAllEditors();
              this.plugin.forceRefreshAllReadingViews();
              this.plugin.triggerActiveDocumentRerender();
              this._refreshEntries();
            } catch (_) {}
          };
          const delHandler = async () => {
            this.plugin.settings.userCustomSwatches.splice(i, 1);
            this.plugin.settings.customSwatches =
              this.plugin.settings.userCustomSwatches.map((s) => s.color);
            await this.plugin.saveSettings();
            this._refreshCustomSwatches();
          };

          // Custom drag event handlers for reordering
          dragHandle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX;
            const startY = e.clientY;
            const rect = row.getBoundingClientRect();
            const offsetX = startX - rect.left;
            const offsetY = startY - rect.top;

            if (navigator.vibrate) navigator.vibrate(100);

            // Create ghost
            const ghost = document.body.createDiv({
              cls: "drag-reorder-ghost",
            });
            const clone = row.cloneNode(true);
            // Manually copy values for selects/inputs because cloneNode doesn't copy dynamic values
            const originalInputs = row.querySelectorAll(
              "input, select, textarea",
            );
            const clonedInputs = clone.querySelectorAll(
              "input, select, textarea",
            );
            originalInputs.forEach((el, idx) => {
              if (clonedInputs[idx]) clonedInputs[idx].value = el.value;
            });
            ghost.appendChild(clone);
            ghost.style.width = `${rect.width}px`;
            ghost.style.height = `${rect.height}px`;
            ghost.style.left = `${rect.left}px`;
            ghost.style.top = `${rect.top}px`;

            // Hide original
            row.classList.add("drag-ghost-hidden");

            const onMove = (moveEvent) => {
              moveEvent.preventDefault();
              const currentX = moveEvent.clientX;
              const currentY = moveEvent.clientY;

              // Update ghost position
              ghost.style.left = `${currentX - offsetX}px`;
              ghost.style.top = `${currentY - offsetY}px`;

              // Reordering logic (25% overdrag threshold)
              const children = Array.from(
                customSwatchesContent.querySelectorAll(
                  "div[data-swatch-index]",
                ),
              );
              const currentIndex = children.indexOf(row);
              if (currentIndex === -1) return;

              // Check Previous
              if (currentIndex > 0) {
                const prevRow = children[currentIndex - 1];
                const prevRect = prevRow.getBoundingClientRect();
                const prevOverdrag = prevRect.height * 0.25;
                if (currentY < prevRect.bottom - prevOverdrag) {
                  if (navigator.vibrate) navigator.vibrate(100);
                  customSwatchesContent.insertBefore(row, prevRow);
                  // Swap in data
                  const item = userCustomSwatches.splice(currentIndex, 1)[0];
                  userCustomSwatches.splice(currentIndex - 1, 0, item);
                  // Update indices
                  Array.from(
                    customSwatchesContent.querySelectorAll(
                      "div[data-swatch-index]",
                    ),
                  ).forEach((r, idx) => {
                    r.setAttribute("data-swatch-index", idx.toString());
                  });
                  return;
                }
              }

              // Check Next
              if (currentIndex < children.length - 1) {
                const nextRow = children[currentIndex + 1];
                const nextRect = nextRow.getBoundingClientRect();
                const nextOverdrag = nextRect.height * 0.25;
                if (currentY > nextRect.top + nextOverdrag) {
                  if (navigator.vibrate) navigator.vibrate(100);
                  nextRow.after(row);
                  // Swap in data
                  const item = userCustomSwatches.splice(currentIndex, 1)[0];
                  userCustomSwatches.splice(currentIndex + 1, 0, item);
                  // Update indices
                  Array.from(
                    customSwatchesContent.querySelectorAll(
                      "div[data-swatch-index]",
                    ),
                  ).forEach((r, idx) => {
                    r.setAttribute("data-swatch-index", idx.toString());
                  });
                  return;
                }
              }
            };

            const onEnd = async () => {
              document.removeEventListener("mousemove", onMove);
              document.removeEventListener("mouseup", onEnd);
              ghost.remove();
              row.classList.remove("drag-ghost-hidden");

              this.plugin.settings.userCustomSwatches = userCustomSwatches;
              this.plugin.settings.customSwatches =
                this.plugin.settings.userCustomSwatches.map((s) => s.color);
              await this.plugin.saveSettings();
              this._refreshCustomSwatches();
            };

            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onEnd);
          });

          dragHandle.addEventListener("touchstart", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            const startX = touch.clientX;
            const startY = touch.clientY;
            const rect = row.getBoundingClientRect();
            const offsetX = startX - rect.left;
            const offsetY = startY - rect.top;
            if (navigator.vibrate) navigator.vibrate(100);
            const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
            const clone = row.cloneNode(true);
            const originalInputs = row.querySelectorAll("input, select, textarea");
            const clonedInputs = clone.querySelectorAll("input, select, textarea");
            originalInputs.forEach((el, idx) => { if (clonedInputs[idx]) clonedInputs[idx].value = el.value; });
            ghost.appendChild(clone);
            ghost.style.width = `${rect.width}px`;
            ghost.style.height = `${rect.height}px`;
            ghost.style.left = `${rect.left}px`;
            ghost.style.top = `${rect.top}px`;
            row.classList.add("drag-ghost-hidden");
            const onTouchMove = (moveEvent) => {
              moveEvent.preventDefault();
              const t = moveEvent.touches[0];
              const currentX = t.clientX;
              const currentY = t.clientY;
              ghost.style.left = `${currentX - offsetX}px`;
              ghost.style.top = `${currentY - offsetY}px`;
              const children = Array.from(customSwatchesContent.querySelectorAll("div[data-swatch-index]"));
              const currentIndex = children.indexOf(row);
              if (currentIndex === -1) return;
              if (currentIndex > 0) {
                const prevRow = children[currentIndex - 1];
                const prevRect = prevRow.getBoundingClientRect();
                if (currentY < prevRect.bottom - prevRect.height * 0.25) {
                  if (navigator.vibrate) navigator.vibrate(100);
                  customSwatchesContent.insertBefore(row, prevRow);
                  const item = userCustomSwatches.splice(currentIndex, 1)[0];
                  userCustomSwatches.splice(currentIndex - 1, 0, item);
                  Array.from(customSwatchesContent.querySelectorAll("div[data-swatch-index]")).forEach((r, idx) => { r.setAttribute("data-swatch-index", idx.toString()); });
                  return;
                }
              }
              if (currentIndex < children.length - 1) {
                const nextRow = children[currentIndex + 1];
                const nextRect = nextRow.getBoundingClientRect();
                if (currentY > nextRect.top + nextRect.height * 0.25) {
                  if (navigator.vibrate) navigator.vibrate(100);
                  nextRow.after(row);
                  const item = userCustomSwatches.splice(currentIndex, 1)[0];
                  userCustomSwatches.splice(currentIndex + 1, 0, item);
                  Array.from(customSwatchesContent.querySelectorAll("div[data-swatch-index]")).forEach((r, idx) => { r.setAttribute("data-swatch-index", idx.toString()); });
                  return;
                }
              }
            };
            const onTouchEnd = async () => {
              document.removeEventListener("touchmove", onTouchMove);
              document.removeEventListener("touchend", onTouchEnd);
              ghost.remove();
              row.classList.remove("drag-ghost-hidden");
              this.plugin.settings.userCustomSwatches = userCustomSwatches;
              this.plugin.settings.customSwatches = this.plugin.settings.userCustomSwatches.map((s) => s.color);
              await this.plugin.saveSettings();
              this._refreshCustomSwatches();
            };
            document.addEventListener("touchmove", onTouchMove, { passive: false });
            document.addEventListener("touchend", onTouchEnd);
          }, { passive: false });

          nameInput.addEventListener("change", nameHandler);
          colorPicker.addEventListener("input", colorHandler);
          colorPicker.addEventListener(
            "contextmenu",
            colorPickerContextHandler,
          );
          delBtn.addEventListener("click", delHandler);
        });
      }

      // Add button
      const addButtonSetting = new Setting(customSwatchesContent);
      addButtonSetting.addButton((b) =>
        b
          .setButtonText(this.plugin.t("btn_add_color", "+ Add color"))
          .onClick(async () => {
            const nextIndex =
              (Array.isArray(this.plugin.settings.userCustomSwatches)
                ? this.plugin.settings.userCustomSwatches.length
                : 0) + 1;
            const newSwatch = { name: `Swatch ${nextIndex}`, color: "#000000" };
            if (!Array.isArray(this.plugin.settings.userCustomSwatches))
              this.plugin.settings.userCustomSwatches = [];
            this.plugin.settings.userCustomSwatches.push(newSwatch);
            this.plugin.settings.customSwatches =
              this.plugin.settings.userCustomSwatches.map((s) => s.color);
            await this.plugin.saveSettings();

            // Auto-unfold Custom Swatches when adding a color
            this._customSwatchesFolded = false;

            this._refreshCustomSwatches();
          }),
      );
      // Align the button to the right and add spacing below
      try {
        addButtonSetting.settingEl.style.display = "flex";
        addButtonSetting.settingEl.style.justifyContent = "flex-end";
        addButtonSetting.settingEl.style.border = "none";
        addButtonSetting.settingEl.style.background = "transparent";
        addButtonSetting.settingEl.style.padding = "0";
        addButtonSetting.settingEl.style.marginBottom = "10px";
        addButtonSetting.settingEl.style.marginTop = "12px";
      } catch (_) {}
    } catch (e) {
      debugError("SETTINGS", "_refreshCustomSwatches error", e);
    }
  }

  _refreshQuickColors() {
    try {
      if (!this._quickColorsContainer) return;
      this._quickColorsContainer.empty();

      // Header, Description and Toggle in a unified heading setting
      const quickColorsSetting = new Setting(this._quickColorsContainer)
        .setName(this.plugin.t("quick_colors_header", "Quick Colors"))
        .setDesc(
          this.plugin.t(
            "quick_colors_desc",
            "Allows you to quickly highlight or color text by showing colors in the right-click menu. If Quick Colors are off, per-style colors in Quick Styles will be used.",
          ),
        )
        .setHeading()
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.quickColorsEnabled)
            .onChange(async (v) => {
              this.plugin.settings.quickColorsEnabled = v;
              await this.plugin.saveSettings();
              this._refreshQuickColors();
            }),
        );

      try {
        quickColorsSetting.settingEl.style.marginTop = "30px";
        quickColorsSetting.settingEl.style.marginBottom = "8px";
        quickColorsSetting.settingEl.style.borderTop = "none";
        quickColorsSetting.controlEl.style.marginLeft = "10px";
      } catch (e) {}

      // Keep UI visible even when Quick Colors are disabled

      // Quick Colors pairs container
      const listDiv = this._quickColorsContainer.createDiv();
      listDiv.style.display = "flex";
      listDiv.style.flexWrap = "wrap";
      listDiv.style.gap = "8px";
      listDiv.style.alignItems = "center";
      listDiv.style.width = "100%";
      listDiv.style.boxSizing = "border-box";

      const colors = Array.isArray(this.plugin.settings.quickColors)
        ? this.plugin.settings.quickColors
        : [];
      if (colors.length > 0) {
        colors.forEach((pair, i) => {
          if (!pair || typeof pair !== "object")
            pair = {
              textColor: "#87c760",
              backgroundColor: "#1d5010",
              uid:
                Date.now().toString(36) + Math.random().toString(36).slice(2),
            };
          const row = listDiv.createDiv();
          row.style.display = "inline-flex";
          row.style.alignItems = "center";
          row.style.gap = "8px";
          row.style.marginBottom = "8px";
          row.style.border = "1px solid var(--background-modifier-border)";
          row.style.borderRadius = "var(--setting-items-radius)"; // BORDER RADIUS OF CUSTOM COLOR ENTRIES
          row.style.backgroundColor = "var(--setting-items-background)";
          row.style.padding = "6px";
          row.style.flex = "0 0 auto";
          row.setAttribute("data-qc-index", String(i));

          // Drag handle
          const dragHandle = row.createEl("button");
          setIcon(dragHandle, "menu");
          // dragHandle.setAttribute('draggable', 'true');
          dragHandle.style.padding = "0";
          dragHandle.style.border = "none";
          dragHandle.style.background = "transparent";
          dragHandle.style.boxShadow = "none";
          dragHandle.style.cursor = "grab";
          dragHandle.style.color = "var(--text-muted)";
          dragHandle.style.flexShrink = "0";
          dragHandle.style.display = "flex";
          dragHandle.style.alignItems = "center";
          dragHandle.style.justifyContent = "center";
          dragHandle.setAttribute(
            "aria-label",
            this.plugin.t("drag_to_reorder", "Drag to reorder"),
          );

          // Text color picker
          const tCp = row.createEl("input", { type: "color" });
          tCp.value =
            pair.textColor && this.plugin.isValidHexColor(pair.textColor)
              ? pair.textColor
              : "#87c760";
          tCp.style.width = "30px";
          tCp.style.height = "30px";
          tCp.style.borderRadius = "50%";
          tCp.style.border = "none";
          tCp.style.padding = "0";
          tCp.style.overflow = "hidden";
          tCp.style.background = "transparent";
          tCp.style.cursor = "pointer";
          tCp.title = this.plugin.t("text_color_title", "Text Color");
          const tChange = async () => {
            const val = tCp.value;
            if (!this.plugin.isValidHexColor(val)) return;
            this.plugin.settings.quickColors[i].textColor = val;
            await this.plugin.saveSettings();
          };
          tCp.addEventListener("input", tChange);
          tCp.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const modal = new ColorPickerModal(
              this.app,
              this.plugin,
              async (color, result) => {
                const chosen =
                  result &&
                  result.textColor &&
                  this.plugin.isValidHexColor(result.textColor)
                    ? result.textColor
                    : color && this.plugin.isValidHexColor(color)
                      ? color
                      : tCp.value;
                if (chosen && this.plugin.isValidHexColor(chosen)) {
                  tCp.value = chosen;
                  await tChange();
                }
              },
              "text",
              this.plugin.t("selected_text_preview", "Selected Text"),
            );
            modal._hideHeaderControls = true;
            modal._preFillTextColor = tCp.value;
            modal.open();
          });

          // Highlight color picker
          const bCp = row.createEl("input", { type: "color" });
          bCp.value =
            pair.backgroundColor &&
            this.plugin.isValidHexColor(pair.backgroundColor)
              ? pair.backgroundColor
              : "#1d5010";
          bCp.style.width = "30px";
          bCp.style.height = "30px";
          bCp.style.borderRadius = "50%";
          bCp.style.border = "none";
          bCp.style.padding = "0";
          bCp.style.overflow = "hidden";
          bCp.style.background = "transparent";
          bCp.style.cursor = "pointer";
          bCp.title = this.plugin.t("highlight_color_title", "Highlight Color");
          const bChange = async () => {
            const val = bCp.value;
            if (!this.plugin.isValidHexColor(val)) return;
            this.plugin.settings.quickColors[i].backgroundColor = val;
            await this.plugin.saveSettings();
          };
          bCp.addEventListener("input", bChange);
          bCp.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const modal = new ColorPickerModal(
              this.app,
              this.plugin,
              async (color, result) => {
                const chosen =
                  result &&
                  result.backgroundColor &&
                  this.plugin.isValidHexColor(result.backgroundColor)
                    ? result.backgroundColor
                    : color && this.plugin.isValidHexColor(color)
                      ? color
                      : bCp.value;
                if (chosen && this.plugin.isValidHexColor(chosen)) {
                  bCp.value = chosen;
                  await bChange();
                }
              },
              "background",
              this.plugin.t("selected_text_preview", "Selected Text"),
              false,
            );
            modal._hideHeaderControls = true;
            modal._preFillBgColor = bCp.value;
            modal._preFillBorderColor = bCp.value;
            modal.open();
          });

          // Delete button
          const delBtn = row.createEl("button", {
            text: this.plugin.t("delete_button_text", "✕"),
          });
          delBtn.addClass("mod-warning");
          delBtn.style.padding = "4px 8px";
          delBtn.style.borderRadius = "var(--button-radius)";
          delBtn.style.cursor = "pointer";
          delBtn.style.flexShrink = "0";
          delBtn.addEventListener("click", async () => {
            this.plugin.settings.quickColors.splice(i, 1);
            await this.plugin.saveSettings();
            this._refreshQuickColors();
          });

          // Custom drag handlers
          dragHandle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX;
            const startY = e.clientY;
            const rect = row.getBoundingClientRect();
            const offsetX = startX - rect.left;
            const offsetY = startY - rect.top;

            if (navigator.vibrate) navigator.vibrate(100);

            // Create ghost
            const ghost = document.body.createDiv({
              cls: "drag-reorder-ghost",
            });
            const clone = row.cloneNode(true);
            // Manually copy values for selects/inputs because cloneNode doesn't copy dynamic values
            const originalInputs = row.querySelectorAll(
              "input, select, textarea",
            );
            const clonedInputs = clone.querySelectorAll(
              "input, select, textarea",
            );
            originalInputs.forEach((el, idx) => {
              if (clonedInputs[idx]) clonedInputs[idx].value = el.value;
            });
            ghost.appendChild(clone);
            ghost.style.width = `${rect.width}px`;
            ghost.style.height = `${rect.height}px`;
            ghost.style.left = `${rect.left}px`;
            ghost.style.top = `${rect.top}px`;

            // Hide original
            row.classList.add("drag-ghost-hidden");

            const onMove = (moveEvent) => {
              moveEvent.preventDefault();
              const currentX = moveEvent.clientX;
              const currentY = moveEvent.clientY;

              // Update ghost position
              ghost.style.left = `${currentX - offsetX}px`;
              ghost.style.top = `${currentY - offsetY}px`;

              // Reordering logic for Grid/Flow layout
              const target = document.elementFromPoint(currentX, currentY);
              const targetRow = target
                ? target.closest("div[data-qc-index]")
                : null;

              if (
                targetRow &&
                targetRow !== row &&
                targetRow.parentNode === listDiv
              ) {
                const children = Array.from(
                  listDiv.querySelectorAll("div[data-qc-index]"),
                );
                const currentIndex = children.indexOf(row);
                const targetIndex = children.indexOf(targetRow);

                if (currentIndex !== -1 && targetIndex !== -1) {
                  // Swap logic
                  if (currentIndex < targetIndex) {
                    // Move forward -> Place after target
                    if (navigator.vibrate) navigator.vibrate(100);
                    targetRow.after(row);
                    // Update array
                    const item = colors.splice(currentIndex, 1)[0];
                    colors.splice(targetIndex, 0, item);
                    // Update indices
                    Array.from(
                      listDiv.querySelectorAll("div[data-qc-index]"),
                    ).forEach((r, idx) => {
                      r.setAttribute("data-qc-index", idx.toString());
                    });
                    return;
                  } else if (currentIndex > targetIndex) {
                    // Move backward -> Place before target
                    if (navigator.vibrate) navigator.vibrate(100);
                    listDiv.insertBefore(row, targetRow);
                    // Update array
                    const item = colors.splice(currentIndex, 1)[0];
                    colors.splice(targetIndex, 0, item);
                    // Update indices
                    Array.from(
                      listDiv.querySelectorAll("div[data-qc-index]"),
                    ).forEach((r, idx) => {
                      r.setAttribute("data-qc-index", idx.toString());
                    });
                    return;
                  }
                }
              }
            };

            const onEnd = async () => {
              document.removeEventListener("mousemove", onMove);
              document.removeEventListener("mouseup", onEnd);
              ghost.remove();
              row.classList.remove("drag-ghost-hidden");

              this.plugin.settings.quickColors = colors;
              await this.plugin.saveSettings();
              this._refreshQuickColors();
            };

            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onEnd);
          });

          dragHandle.addEventListener("touchstart", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            const startX = touch.clientX;
            const startY = touch.clientY;
            const rect = row.getBoundingClientRect();
            const offsetX = startX - rect.left;
            const offsetY = startY - rect.top;
            if (navigator.vibrate) navigator.vibrate(100);
            const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
            const clone = row.cloneNode(true);
            const originalInputs = row.querySelectorAll("input, select, textarea");
            const clonedInputs = clone.querySelectorAll("input, select, textarea");
            originalInputs.forEach((el, idx) => { if (clonedInputs[idx]) clonedInputs[idx].value = el.value; });
            ghost.appendChild(clone);
            ghost.style.width = `${rect.width}px`;
            ghost.style.height = `${rect.height}px`;
            ghost.style.left = `${rect.left}px`;
            ghost.style.top = `${rect.top}px`;
            row.classList.add("drag-ghost-hidden");
            const onTouchMove = (moveEvent) => {
              moveEvent.preventDefault();
              const t = moveEvent.touches[0];
              const currentX = t.clientX;
              const currentY = t.clientY;
              ghost.style.left = `${currentX - offsetX}px`;
              ghost.style.top = `${currentY - offsetY}px`;
              const target = document.elementFromPoint(currentX, currentY);
              const targetRow = target ? target.closest("div[data-qc-index]") : null;
              if (targetRow && targetRow !== row && targetRow.parentNode === listDiv) {
                const children = Array.from(listDiv.querySelectorAll("div[data-qc-index]"));
                const currentIndex = children.indexOf(row);
                const targetIndex = children.indexOf(targetRow);
                if (currentIndex !== -1 && targetIndex !== -1) {
                  if (currentIndex < targetIndex) {
                    if (navigator.vibrate) navigator.vibrate(100);
                    targetRow.after(row);
                    const item = colors.splice(currentIndex, 1)[0];
                    colors.splice(targetIndex, 0, item);
                    Array.from(listDiv.querySelectorAll("div[data-qc-index]")).forEach((r, idx) => { r.setAttribute("data-qc-index", idx.toString()); });
                  } else if (currentIndex > targetIndex) {
                    if (navigator.vibrate) navigator.vibrate(100);
                    listDiv.insertBefore(row, targetRow);
                    const item = colors.splice(currentIndex, 1)[0];
                    colors.splice(targetIndex, 0, item);
                    Array.from(listDiv.querySelectorAll("div[data-qc-index]")).forEach((r, idx) => { r.setAttribute("data-qc-index", idx.toString()); });
                  }
                }
              }
            };
            const onTouchEnd = async () => {
              document.removeEventListener("touchmove", onTouchMove);
              document.removeEventListener("touchend", onTouchEnd);
              ghost.remove();
              row.classList.remove("drag-ghost-hidden");
              this.plugin.settings.quickColors = colors;
              await this.plugin.saveSettings();
              this._refreshQuickColors();
            };
            document.addEventListener("touchmove", onTouchMove, { passive: false });
            document.addEventListener("touchend", onTouchEnd);
          }, { passive: false });
        });
      }

      const btnRow = this._quickColorsContainer.createDiv();
      btnRow.style.display = "flex";
      btnRow.style.justifyContent = "flex-end";
      btnRow.style.marginTop = "10px";
      const addBtn = btnRow.createEl("button", {
        text: this.plugin.t("btn_add_color", "+ Add Color"),
      });
      addBtn.addEventListener("click", async () => {
        const newPair = {
          textColor: "#87c760",
          backgroundColor: "#1d5010",
          uid: Date.now().toString(36) + Math.random().toString(36).slice(2),
        };
        this.plugin.settings.quickColors.push(newPair);
        await this.plugin.saveSettings();
        this._refreshQuickColors();
      });

      // Apply mode setting: Always Color Text vs Inline HTML
      const modeSetting = new Setting(this._quickColorsContainer)
        .setName(
          this.plugin.t(
            "quick_colors_apply_mode_label",
            "The text coloring will apply as",
          ),
        )
        .addDropdown((d) => {
          d.addOption(
            "act",
            this.plugin.t("quick_colors_apply_mode_act", "Always Color Text"),
          );
          d.addOption(
            "html",
            this.plugin.t("quick_colors_apply_mode_html", "Inline HTML"),
          );
          d.setValue(this.plugin.settings.quickColorsApplyMode || "html");
          d.onChange(async (v) => {
            this.plugin.settings.quickColorsApplyMode = v;
            await this.plugin.saveSettings();
          });
          if (d.selectEl) {
            d.selectEl.style.textAlign = "center";
            d.selectEl.style.textAlignLast = "center";
            d.selectEl.style.minWidth = "180px";
          }
        });
      try {
        modeSetting.settingEl.style.marginTop = "10px";
      } catch (e) {}
    } catch (e) {
      debugError("SETTINGS", e);
    }
  }

  _refreshQuickStyles() {
    try {
      if (!this._quickStylesContainer) return;
      this._quickStylesContainer.empty();

      // Header, Description and Toggle in a unified heading setting
      const quickStylesSetting = new Setting(this._quickStylesContainer)
        .setName(this.plugin.t("quick_styles_header", "Quick Styles"))
        .setDesc(
          this.plugin.t(
            "quick_styles_desc",
            "Define named styles for applying text color and highlights. If Quick Colors are off, per-style colors here will be used.",
          ),
        )
        .setHeading()
        .addToggle((t) =>
          t
            .setValue(!!this.plugin.settings.quickStylesEnabled)
            .onChange(async (v) => {
              this.plugin.settings.quickStylesEnabled = !!v;
              await this.plugin.saveSettings();
              this._refreshQuickStyles();
            }),
        );

      try {
        quickStylesSetting.settingEl.style.marginTop = "30px";
        quickStylesSetting.settingEl.style.marginBottom = "8px";
        quickStylesSetting.settingEl.style.borderTop = "none";
        quickStylesSetting.controlEl.style.marginLeft = "10px";
      } catch (e) {}

      // if (!this.plugin.settings.quickStylesEnabled) return;

      const listDiv = this._quickStylesContainer.createDiv();
      const styles = Array.isArray(this.plugin.settings.quickStyles)
        ? this.plugin.settings.quickStyles
        : [];

      let dragSource = null;

      styles.forEach((style, i) => {
        // Ensure style has uid
        if (!style.uid)
          style.uid = Date.now() + Math.random().toString(36).slice(2);

        const row = listDiv.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.marginBottom = "8px";
        row.style.padding = "4px";
        row.style.border = "1px solid var(--background-modifier-border)";
        row.style.borderRadius = "var(--setting-items-radius)"; // BORDER RADIUS OF QUICK STYLES ENTRIES
        row.style.background = "var(--setting-items-background)";
        // row.draggable = true;

        // Drag Handle
        const dragHandle = row.createDiv();
        dragHandle.innerHTML =
          '<svg viewBox="0 0 100 100" width="30" height="20" fill="currentColor"><path d="M30 20h40v10H30zM30 45h40v10H30zM30 70h40v10H30z"/></svg>';
        dragHandle.style.cursor = "grab";
        dragHandle.style.opacity = "0.6";
        // dragHandle.style.width = '30px';
        dragHandle.style.display = "flex";
        dragHandle.style.alignItems = "center";
        dragHandle.style.justifyContent = "center";

        // Preview sample text
        const previewEl = row.createDiv();
        previewEl.textContent = this.plugin.t("preview_text", "Text");
        previewEl.style.flex = "0 0 auto";
        // previewEl.style.paddingLeft = '-20px';
        const styleType = style && style.styleType ? style.styleType : "both";
        const tc = style.textColor || style.color || null;
        const bc = style.backgroundColor || null;
        const params = this.plugin.getHighlightParams(style);
        const borderCss = this.plugin.generateBorderStyle(tc, bc, style);
        let previewStyleStr = "";
        if (styleType === "text") {
          if (tc) previewStyleStr += `color:${tc};`;
        } else if (styleType === "highlight") {
          if (bc) {
            const bg = this.plugin.hexToHexWithAlpha(bc, params.opacity ?? 25);
            previewStyleStr += `background-color:${bg};`;
          }
          previewStyleStr += `border-radius:${params.radius ?? 8}px; padding:${params.vPad ?? 0}px ${params.hPad ?? 4}px;${borderCss}`;
        } else {
          if (tc) previewStyleStr += `color:${tc};`;
          if (bc) {
            const bg = this.plugin.hexToHexWithAlpha(bc, params.opacity ?? 25);
            previewStyleStr += `background-color:${bg};`;
          }
          previewStyleStr += `border-radius:${params.radius ?? 8}px; padding:${params.vPad ?? 0}px ${params.hPad ?? 4}px;${borderCss}`;
        }
        previewEl.setAttr("style", previewStyleStr);

        // Name Input
        const nameInput = row.createEl("input", {
          type: "text",
          value: style.name || `Style ${i + 1}`,
        });
        nameInput.style.flex = "1";
        nameInput.placeholder = this.plugin.t(
          "style_name_placeholder",
          "Style Name",
        );
        nameInput.addEventListener("change", async () => {
          style.name = nameInput.value;
          await this.plugin.saveSettings();
        });

        // Settings Icon
        const settingsBtn = row.createDiv();
        settingsBtn.style.cursor = "pointer";
        settingsBtn.style.display = "flex";
        settingsBtn.style.paddingLeft = "0";
        settingsBtn.style.paddingRight = "4px";
        setIcon(settingsBtn, "settings");
        settingsBtn.addEventListener("click", () => {
          if (!style.styleType) style.styleType = "both";
          const modal = new HighlightStylingModal(
            this.app,
            this.plugin,
            style,
            null,
            this.plugin.t("selected_text_preview", "Selected Text"),
          );
          const originalOnClose = modal.onClose.bind(modal);
          modal.onClose = async () => {
            originalOnClose();
            await this.plugin.saveSettings();
            setTimeout(() => {
              try {
                this._refreshQuickStyles();
              } catch (e) {
                debugError("SETTINGS", e);
              }
            }, 50);
          };
          modal.open();
        });

        // Context Menu
        row.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          const menu = new Menu();
          menu.addItem((item) =>
            item
              .setTitle(this.plugin.t("duplicate_entry", "Duplicate Entry"))
              .setIcon("copy")
              .onClick(async () => {
                const clone = JSON.parse(JSON.stringify(style));
                clone.uid = Date.now() + Math.random().toString(36).slice(2);
                clone.name = (clone.name || "") + " (Copy)";
                this.plugin.settings.quickStyles.splice(i + 1, 0, clone);
                await this.plugin.saveSettings();
                this._refreshQuickStyles();
              }),
          );
          menu.addItem((item) =>
            item
              .setTitle("Delete Entry")
              .setIcon("trash")
              .onClick(async () => {
                this.plugin.settings.quickStyles.splice(i, 1);
                await this.plugin.saveSettings();
                this._refreshQuickStyles();
              }),
          );
          menu.showAtMouseEvent(e);
        });

        // Custom Drag Implementation matching drag-example.ts
        dragHandle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const startX = e.clientX;
          const startY = e.clientY;
          const rect = row.getBoundingClientRect();
          const offsetX = startX - rect.left;
          const offsetY = startY - rect.top;

          if (navigator.vibrate) navigator.vibrate(100);

          // Create ghost
          const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
          const clone = row.cloneNode(true);
          // Manually copy values for selects/inputs because cloneNode doesn't copy dynamic values
          const originalInputs = row.querySelectorAll(
            "input, select, textarea",
          );
          const clonedInputs = clone.querySelectorAll(
            "input, select, textarea",
          );
          originalInputs.forEach((el, idx) => {
            if (clonedInputs[idx]) clonedInputs[idx].value = el.value;
          });
          ghost.appendChild(clone);
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.left = `${rect.left}px`;
          ghost.style.top = `${rect.top}px`;

          // Hide original
          row.classList.add("drag-ghost-hidden");

          const onMove = (moveEvent) => {
            moveEvent.preventDefault();
            const currentX = moveEvent.clientX;
            const currentY = moveEvent.clientY;

            // Update ghost position
            ghost.style.left = `${currentX - offsetX}px`;
            ghost.style.top = `${currentY - offsetY}px`;

            // Reordering logic
            const children = Array.from(listDiv.children);
            const currentIndex = children.indexOf(row);
            if (currentIndex === -1) return;

            // Check Previous
            if (currentIndex > 0) {
              const prevRow = children[currentIndex - 1];
              const prevRect = prevRow.getBoundingClientRect();
              const prevOverdrag = prevRect.height * 0.25;
              if (currentY < prevRect.bottom - prevOverdrag) {
                if (navigator.vibrate) navigator.vibrate(100);
                listDiv.insertBefore(row, prevRow);
                // Swap in data
                const item = styles.splice(currentIndex, 1)[0];
                styles.splice(currentIndex - 1, 0, item);
                return;
              }
            }

            // Check Next
            if (currentIndex < children.length - 1) {
              const nextRow = children[currentIndex + 1];
              const nextRect = nextRow.getBoundingClientRect();
              const nextOverdrag = nextRect.height * 0.25;
              if (currentY > nextRect.top + nextOverdrag) {
                if (navigator.vibrate) navigator.vibrate(100);
                nextRow.after(row);
                // Swap in data
                const item = styles.splice(currentIndex, 1)[0];
                styles.splice(currentIndex + 1, 0, item);
                return;
              }
            }
          };

          const onEnd = async () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onEnd);
            ghost.remove();
            row.classList.remove("drag-ghost-hidden");
            await this.plugin.saveSettings();
            this._refreshQuickStyles();
          };

          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onEnd);
        });

        dragHandle.addEventListener("touchstart", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const touch = e.touches[0];
          const startX = touch.clientX;
          const startY = touch.clientY;
          const rect = row.getBoundingClientRect();
          const offsetX = startX - rect.left;
          const offsetY = startY - rect.top;
          if (navigator.vibrate) navigator.vibrate(100);
          const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
          const clone = row.cloneNode(true);
          const originalInputs = row.querySelectorAll("input, select, textarea");
          const clonedInputs = clone.querySelectorAll("input, select, textarea");
          originalInputs.forEach((el, idx) => { if (clonedInputs[idx]) clonedInputs[idx].value = el.value; });
          ghost.appendChild(clone);
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.left = `${rect.left}px`;
          ghost.style.top = `${rect.top}px`;
          row.classList.add("drag-ghost-hidden");
          const onTouchMove = (moveEvent) => {
            moveEvent.preventDefault();
            const t = moveEvent.touches[0];
            const currentX = t.clientX;
            const currentY = t.clientY;
            ghost.style.left = `${currentX - offsetX}px`;
            ghost.style.top = `${currentY - offsetY}px`;
            const children = Array.from(listDiv.children);
            const currentIndex = children.indexOf(row);
            if (currentIndex === -1) return;
            if (currentIndex > 0) {
              const prevRow = children[currentIndex - 1];
              const prevRect = prevRow.getBoundingClientRect();
              if (currentY < prevRect.bottom - prevRect.height * 0.25) {
                if (navigator.vibrate) navigator.vibrate(100);
                listDiv.insertBefore(row, prevRow);
                const item = styles.splice(currentIndex, 1)[0];
                styles.splice(currentIndex - 1, 0, item);
                return;
              }
            }
            if (currentIndex < children.length - 1) {
              const nextRow = children[currentIndex + 1];
              const nextRect = nextRow.getBoundingClientRect();
              if (currentY > nextRect.top + nextRect.height * 0.25) {
                if (navigator.vibrate) navigator.vibrate(100);
                nextRow.after(row);
                const item = styles.splice(currentIndex, 1)[0];
                styles.splice(currentIndex + 1, 0, item);
                return;
              }
            }
          };
          const onTouchEnd = async () => {
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            ghost.remove();
            row.classList.remove("drag-ghost-hidden");
            await this.plugin.saveSettings();
            this._refreshQuickStyles();
          };
          document.addEventListener("touchmove", onTouchMove, { passive: false });
          document.addEventListener("touchend", onTouchEnd);
        }, { passive: false });
      });

      // Add Button
      const btnRow = this._quickStylesContainer.createDiv();
      btnRow.style.display = "flex";
      btnRow.style.justifyContent = "flex-end";
      const addBtn = btnRow.createEl("button", {
        text: this.plugin.t("btn_add_style", "+ Add Style"),
      });
      addBtn.style.marginBottom = "10px";
      addBtn.addEventListener("click", async () => {
        this.plugin.settings.quickStyles.push({
          name: "New Style",
          styleType: "both",
          textColor: "#ffffff",
          backgroundColor: "#000000",
        });
        await this.plugin.saveSettings();
        this._refreshQuickStyles();
      });
    } catch (e) {
      debugError("SETTINGS", e);
    }
  }

  _refreshEntries() {
    try {
      const listDiv = this.containerEl.querySelector(".color-words-list");
      if (!listDiv) return;
      const newIds = this._newEntriesSet || new Set();
      const isNew = (e) => {
        try {
          return (e && e.uid && newIds.has(e.uid)) || !!e.persistAtEnd;
        } catch (_) {
          return !!(e && e.persistAtEnd);
        }
      };

      listDiv.empty();

      const entriesToDisplay = [...this.plugin.settings.wordEntries];
      // Separate persistAtEnd entries early - they bypass all filters
      const persistAtEndEntriesRaw = entriesToDisplay.filter(
        (e) => e && e.persistAtEnd === true,
      );
      const regularEntriesToFilter = entriesToDisplay.filter(
        (e) => !e || e.persistAtEnd !== true,
      );

      const q = String(this._entriesSearchQuery || "")
        .trim()
        .toLowerCase();
      const filtered = q
        ? regularEntriesToFilter.filter((e) => {
            const patterns =
              Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
                ? e.groupedPatterns
                : [String(e.pattern || "")];
            const swDefault = Array.isArray(this.plugin.settings.swatches)
              ? this.plugin.settings.swatches
              : [];
            const swCustom = Array.isArray(
              this.plugin.settings.userCustomSwatches,
            )
              ? this.plugin.settings.userCustomSwatches
              : [];
            const allSwatches = [...swDefault, ...swCustom];
            const getSwatchName = (hex) => {
              try {
                if (!hex || !this.plugin.isValidHexColor(hex)) return "";
                const m = allSwatches.find(
                  (sw) =>
                    sw &&
                    sw.color &&
                    String(sw.color).toLowerCase() ===
                      String(hex).toLowerCase(),
                );
                return String(m && m.name ? m.name : "").toLowerCase();
              } catch (_) {
                return "";
              }
            };
            const tHex =
              e && e.textColor && e.textColor !== "currentColor"
                ? e.textColor
                : this.plugin.isValidHexColor(e && e.color)
                  ? e.color
                  : "";
            const bHex = this.plugin.isValidHexColor(e && e.backgroundColor)
              ? e.backgroundColor
              : "";
            const tName = getSwatchName(tHex);
            const bName = getSwatchName(bHex);
            const text = [
              ...patterns.map((p) => p.toLowerCase()),
              String(e.presetLabel || "").toLowerCase(),
              String(e.flags || "").toLowerCase(),
              String(e.styleType || "").toLowerCase(),
              tName,
              bName,
            ].join(" ");
            if (this._entriesSearchMatch === "starts")
              return text.startsWith(q);
            if (this._entriesSearchMatch === "ends") return text.endsWith(q);
            if (this._entriesSearchMatch === "exact") return text === q;
            return text.includes(q);
          })
        : regularEntriesToFilter;

      // Apply filter mode if set
      let finalFiltered = filtered;
      if (this._filterMode === "highlight") {
        finalFiltered = filtered.filter((e) => e.styleType === "highlight");
      } else if (this._filterMode === "text") {
        finalFiltered = filtered.filter((e) => e.styleType === "text");
      } else if (this._filterMode === "both") {
        finalFiltered = filtered.filter((e) => e.styleType === "both");
      }
      // Apply matchType-only filter if requested via limit tokens (sw/ew) - use OR logic
      if (
        this._entriesMatchTypeStartsWith ||
        this._entriesMatchTypeEndsWith ||
        this._entriesMatchTypeExact
      ) {
        finalFiltered = finalFiltered.filter((e) => {
          const mt = String(e.matchType || "").toLowerCase();
          let matches = false;
          if (this._entriesMatchTypeStartsWith)
            matches = matches || mt === "startswith";
          if (this._entriesMatchTypeEndsWith)
            matches = matches || mt === "endswith";
          if (this._entriesMatchTypeExact) matches = matches || mt === "exact";
          return matches;
        });
      }
      if (this._entriesRegexOnly) {
        finalFiltered = finalFiltered.filter((e) => !!e.isRegex);
      }
      if (this._entriesWordsOnly) {
        finalFiltered = finalFiltered.filter((e) => !e.isRegex);
      }

      if (!this._suspendSorting && this._wordsSortMode === "a-z") {
        finalFiltered.sort((a, b) => {
          const patternA =
            Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0
              ? a.groupedPatterns[0]
              : a.pattern || "";
          const patternB =
            Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0
              ? b.groupedPatterns[0]
              : b.pattern || "";
          const aEmpty = String(patternA).trim().length === 0;
          const bEmpty = String(patternB).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          const aHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternA);
          const bHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternB);
          if (aHasSpecialChars && !bHasSpecialChars) return -1;
          if (!aHasSpecialChars && bHasSpecialChars) return 1;
          return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
        });
      } else if (
        !this._suspendSorting &&
        this._wordsSortMode === "reverse-a-z"
      ) {
        finalFiltered.sort((a, b) => {
          const patternA =
            Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0
              ? a.groupedPatterns[0]
              : a.pattern || "";
          const patternB =
            Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0
              ? b.groupedPatterns[0]
              : b.pattern || "";
          const aEmpty = String(patternA).trim().length === 0;
          const bEmpty = String(patternB).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          const aHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternA);
          const bHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternB);
          if (aHasSpecialChars && !bHasSpecialChars) return -1;
          if (!aHasSpecialChars && bHasSpecialChars) return 1;
          return patternB.toLowerCase().localeCompare(patternA.toLowerCase());
        });
      } else if (
        !this._suspendSorting &&
        this._wordsSortMode === "style-order"
      ) {
        const styleOrder = { text: 0, highlight: 1, both: 2 };
        finalFiltered.sort((a, b) => {
          const patternA =
            Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0
              ? a.groupedPatterns[0]
              : a.pattern || "";
          const patternB =
            Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0
              ? b.groupedPatterns[0]
              : b.pattern || "";
          const aEmpty = String(patternA).trim().length === 0;
          const bEmpty = String(patternB).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          const styleA = styleOrder[a.styleType] ?? 0;
          const styleB = styleOrder[b.styleType] ?? 0;
          if (styleA !== styleB) return styleA - styleB;
          return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
        });
      } else if (!this._suspendSorting && this._wordsSortMode === "color") {
        finalFiltered.sort((a, b) => {
          const patternA =
            Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0
              ? a.groupedPatterns[0]
              : a.pattern || "";
          const patternB =
            Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0
              ? b.groupedPatterns[0]
              : b.pattern || "";
          const aEmpty = String(patternA).trim().length === 0;
          const bEmpty = String(patternB).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          const colorA = (
            a.backgroundColor ||
            a.textColor ||
            a.color ||
            ""
          ).toLowerCase();
          const colorB = (
            b.backgroundColor ||
            b.textColor ||
            b.color ||
            ""
          ).toLowerCase();
          if (colorA !== colorB) return colorA.localeCompare(colorB);
          return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
        });
      }

      let entriesFiltered;
      if (this._suspendSorting || this._wordsSortMode === "last-added") {
        const baseOrder = [...this.plugin.settings.wordEntries];
        const newFiltered = finalFiltered.filter((e) => isNew(e));
        const oldFiltered = finalFiltered.filter((e) => !isNew(e));
        const newInInsertionOrder = baseOrder.filter(
          (e) => isNew(e) && newFiltered.includes(e),
        );
        entriesFiltered = [...oldFiltered, ...newInInsertionOrder];
      } else {
        entriesFiltered = finalFiltered;
      }

      // Re-create all rows in the correct order
      // Separate entries with persistAtEnd flag to display them at the end without any filtering applied
      const limitedRegularEntries =
        this._entriesLimit && this._entriesLimit > 0
          ? entriesFiltered.slice(-this._entriesLimit)
          : entriesFiltered;
      const limitedEntries = [
        ...limitedRegularEntries,
        ...persistAtEndEntriesRaw,
      ];
      limitedEntries.forEach((entry) => {
        this._createEntryRow(entry, listDiv);
      });

      // Clear the map since we recreated all rows
      this._entryRows.clear();

      // Re-populate the map with new rows
      entriesFiltered.forEach((entry) => {
        const rowInfo = this._entryRows.get(entry);
        if (rowInfo) {
          // Row was already created, keep the reference
        } else {
          // This will be populated by _createEntryRow
        }
      });

      // mark initialized so subsequent display() calls refresh only entries
      this._initializedSettingsUI = true;
    } catch (e) {
      debugError("SETTINGS", "_refreshEntries error", e);
    }
  }

  _refreshGroups() {
    try {
      const container = this.containerEl.querySelector(".act-groups-container");
      if (!container) return;
      container.empty();
      const allGroups = Array.isArray(this.plugin.settings.wordEntryGroups)
        ? this.plugin.settings.wordEntryGroups
        : [];
      const q = String(this._groupSearch || "")
        .toLowerCase()
        .trim();
      const swDefault = Array.isArray(this.plugin.settings.swatches)
        ? this.plugin.settings.swatches
        : [];
      const swCustom = Array.isArray(this.plugin.settings.userCustomSwatches)
        ? this.plugin.settings.userCustomSwatches
        : [];
      const allSwatches = [...swDefault, ...swCustom];
      const getSwatchName = (hex) => {
        try {
          if (!hex || !this.plugin.isValidHexColor(hex)) return "";
          const m = allSwatches.find(
            (sw) =>
              sw &&
              sw.color &&
              String(sw.color).toLowerCase() === String(hex).toLowerCase(),
          );
          return String(m && m.name ? m.name : "").toLowerCase();
        } catch (_) {
          return "";
        }
      };

      const groups = q
        ? allGroups.filter((g) => {
            const matchesName = String(g?.name || "")
              .toLowerCase()
              .includes(q);
            const matchesActive = q === "active" && g?.active;
            const matchesInactive = q === "inactive" && !g?.active;

            const matchesSwatch = (
              Array.isArray(g.entries) ? g.entries : []
            ).some((e) => {
              const tHex =
                e && e.textColor && e.textColor !== "currentColor"
                  ? e.textColor
                  : this.plugin.isValidHexColor(e && e.color)
                    ? e.color
                    : "";
              const bHex = this.plugin.isValidHexColor(e && e.backgroundColor)
                ? e.backgroundColor
                : "";
              const tName = getSwatchName(tHex);
              const bName = getSwatchName(bHex);
              return tName.includes(q) || bName.includes(q);
            });

            return (
              matchesName || matchesActive || matchesInactive || matchesSwatch
            );
          })
        : allGroups;

      // Function to save reordered word groups
      const saveDragReorder = async () => {
        const groupRows = Array.from(
          container.querySelectorAll("div[data-group-uid]"),
        );
        const newOrder = groupRows
          .map((r) => {
            const uid = r.getAttribute("data-group-uid");
            return allGroups.find((g) => g && g.uid === uid);
          })
          .filter((g) => g);
        this.plugin.settings.wordEntryGroups = newOrder;
        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        if (this.plugin.settings.showWordGroupsInCommands)
          this.plugin.reregisterCommandsWithLanguage();
        this._refreshGroups();
      };

      groups.forEach((group, index) => {
        const row = container.createDiv();
        try {
          row.addClass("act-group-row");
        } catch (e) {
          try {
            row.classList.add("act-group-row");
          } catch (_) {}
        }
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "10px";
        row.style.marginBottom = "10px";
        row.style.padding = "10px";
        row.style.border = "1px solid var(--background-modifier-border)";
        row.style.borderRadius = "var(--setting-items-radius)";
        row.style.backgroundColor = "var(--setting-items-background)";
        row.setAttribute("data-group-uid", group.uid || "");

        // Drag handle
        const dragHandle = row.createEl("button");
        setIcon(dragHandle, "menu");
        dragHandle.style.padding = "0";
        dragHandle.style.border = "none";
        dragHandle.style.background = "transparent";
        dragHandle.style.boxShadow = "none";
        dragHandle.style.cursor = "grab";
        dragHandle.style.color = "var(--text-muted)";
        dragHandle.style.flexShrink = "0";
        dragHandle.style.display = "flex";
        dragHandle.style.alignItems = "center";
        dragHandle.style.justifyContent = "center";
        dragHandle.setAttribute(
          "aria-label",
          this.plugin.t("drag_to_reorder", "Drag to reorder"),
        );

        const activeSelect = row.createEl("select");
        try {
          activeSelect.addClass("dropdown");
        } catch (e) {}
        try {
          activeSelect.addClass("act-group-select");
        } catch (e) {
          try {
            activeSelect.classList.add("act-group-select");
          } catch (_) {}
        }
        activeSelect.style.minWidth = "100px";
        activeSelect.createEl("option", {
          text: this.plugin.t("group_active_label", "Active"),
          value: "true",
        });
        activeSelect.createEl("option", {
          text: this.plugin.t("group_inactive_label", "Inactive"),
          value: "false",
        });
        if (!group.uid) {
          try {
            group.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (_) {}
        }
        activeSelect.value = String(!!group.active);
        const activeHandler = async () => {
          group.active = activeSelect.value === "true";
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          if (this.plugin.settings.showWordGroupsInCommands)
            this.plugin.reregisterCommandsWithLanguage();
        };
        activeSelect.onchange = activeHandler;

        // Group Styling Preview
        if (
          group.textColor ||
          group.backgroundColor ||
          (typeof group.enableBorderThickness !== "undefined" &&
            group.enableBorderThickness)
        ) {
          const preview = row.createDiv();
          try {
            preview.addClass("act-group-styling-preview");
          } catch (e) {
            try {
              preview.classList.add("act-group-styling-preview");
            } catch (_) {}
          }
          preview.style.flexShrink = "0";
          preview.style.display = "flex";
          preview.style.alignItems = "center";
          preview.style.justifyContent = "center";
          preview.style.fontSize = "12px";
          preview.style.fontWeight = "bold";
          preview.style.cursor = "default";
          preview.textContent = "Text";

          const t =
            group.textColor && group.textColor !== "currentColor"
              ? group.textColor
              : "";
          const b = group.backgroundColor || "";
          const p = this.plugin.getHighlightParams(group);
          const rgba = b
            ? this.plugin.hexToRgba(b, p.opacity ?? 25)
            : "transparent";

          if (t) preview.style.color = t;
          else preview.style.color = "var(--text-normal)";

          if (b) {
            preview.style.backgroundColor = rgba;
          } else {
            preview.style.backgroundColor = "transparent";
          }

          // Apply Highlight Styling Params
          preview.style.borderRadius = (p.radius ?? 8) + "px";
          preview.style.paddingLeft = (p.hPad ?? 4) + "px";
          preview.style.paddingRight = (p.hPad ?? 4) + "px";
          preview.style.paddingTop = (p.vPad ?? 0) + "px";
          preview.style.paddingBottom = (p.vPad ?? 0) + "px";

          if (p.enableBorder) {
            const borderStyle = this.plugin.generateBorderStyle(t, b, group);
            if (borderStyle) {
              preview.style.cssText += borderStyle;
            }
          } else {
            preview.style.border =
              "1px solid var(--background-modifier-border)";
          }
        }

        const nameInput = row.createEl("input", {
          type: "text",
          value: group.name || "",
        });
        nameInput.style.flex = "1";
        nameInput.placeholder = this.plugin.t(
          "group_name_placeholder",
          "Name your group",
        );
        const nameHandler = async () => {
          group.name = nameInput.value;
          await this.plugin.saveSettings();
          if (this.plugin.settings.showWordGroupsInCommands)
            this.plugin.reregisterCommandsWithLanguage();
        };
        nameInput.onchange = nameHandler;

        const btnDuplicate = row.createEl("div");
        btnDuplicate.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        btnDuplicate.style.cursor = "pointer";
        btnDuplicate.style.color = "var(--text-muted)";
        btnDuplicate.title = this.plugin.t(
          "tooltip_duplicate_group",
          "Duplicate Group",
        );
        btnDuplicate.style.display = "flex";
        btnDuplicate.style.alignItems = "center";
        btnDuplicate.onclick = async () => {
          const newGroup = JSON.parse(JSON.stringify(group));
          newGroup.name = (newGroup.name || "") + " (Copy)";
          try {
            newGroup.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (_) {}
          this.plugin.settings.wordEntryGroups.push(newGroup);
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this._refreshGroups();
          if (this.plugin.settings.showWordGroupsInCommands)
            this.plugin.reregisterCommandsWithLanguage();
        };

        const btnEdit = row.createEl("div");
        btnEdit.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
        btnEdit.style.cursor = "pointer";
        btnEdit.style.color = "var(--text-muted)";
        btnEdit.title = this.plugin.t(
          "tooltip_edit_group_settings",
          "Edit Group Settings",
        );
        btnEdit.style.display = "flex";
        btnEdit.style.alignItems = "center";
        btnEdit.onclick = () => {
          const latestGroup =
            this.plugin.settings.wordEntryGroups.find(
              (g) => g && g.uid === group.uid,
            ) || group;
          new EditWordGroupModal(
            this.app,
            this.plugin,
            latestGroup,
            async (updatedGroup) => {
              const idx = this.plugin.settings.wordEntryGroups.findIndex(
                (g) => g && g.uid === updatedGroup.uid,
              );
              if (idx !== -1)
                this.plugin.settings.wordEntryGroups[idx] = updatedGroup;
              await this.plugin.saveSettings();
              this.plugin.compileWordEntries();
              this.plugin.reconfigureEditorExtensions();
              this.plugin.forceRefreshAllEditors();
              this.plugin.forceRefreshAllReadingViews();
              this._refreshGroups();
              if (this.plugin.settings.showWordGroupsInCommands)
                this.plugin.reregisterCommandsWithLanguage();
            },
            async (groupToDelete) => {
              const actualIndex =
                this.plugin.settings.wordEntryGroups.findIndex(
                  (g) => g && g.uid === groupToDelete.uid,
                );
              if (actualIndex !== -1)
                this.plugin.settings.wordEntryGroups.splice(actualIndex, 1);
              await this.plugin.saveSettings();
              this.plugin.compileWordEntries();
              this.plugin.reconfigureEditorExtensions();
              this.plugin.forceRefreshAllEditors();
              this.plugin.forceRefreshAllReadingViews();
              this._refreshGroups();
              if (this.plugin.settings.showWordGroupsInCommands)
                this.plugin.reregisterCommandsWithLanguage();
            },
          ).open();
        };

        // Custom Drag Implementation matching quick styles smooth dragging
        dragHandle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const startX = e.clientX;
          const startY = e.clientY;
          const rect = row.getBoundingClientRect();
          const offsetX = startX - rect.left;
          const offsetY = startY - rect.top;

          if (navigator.vibrate) navigator.vibrate(100);

          // Disable all interactive elements during drag to prevent state changes
          const originalDisabled = [];
          const allInteractive = row.querySelectorAll("input, select, button");
          allInteractive.forEach((el) => {
            originalDisabled.push(el.disabled);
            el.disabled = true;
          });

          // Create ghost
          const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
          const clone = row.cloneNode(true);
          // Manually copy values for selects/inputs because cloneNode doesn't copy dynamic values
          const originalInputs = row.querySelectorAll(
            "input, select, textarea",
          );
          const clonedInputs = clone.querySelectorAll(
            "input, select, textarea",
          );
          originalInputs.forEach((el, idx) => {
            if (clonedInputs[idx]) clonedInputs[idx].value = el.value;
          });
          ghost.appendChild(clone);
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.left = `${rect.left}px`;
          ghost.style.top = `${rect.top}px`;

          // Hide original (and its interactive elements)
          row.classList.add("drag-ghost-hidden");

          const onMove = (moveEvent) => {
            moveEvent.preventDefault();
            const currentX = moveEvent.clientX;
            const currentY = moveEvent.clientY;

            // Update ghost position
            ghost.style.left = `${currentX - offsetX}px`;
            ghost.style.top = `${currentY - offsetY}px`;

            // Reordering logic
            const children = Array.from(
              container.querySelectorAll("div[data-group-uid]"),
            );
            const currentIndex = children.indexOf(row);
            if (currentIndex === -1) return;

            // Check Previous
            if (currentIndex > 0) {
              const prevRow = children[currentIndex - 1];
              const prevRect = prevRow.getBoundingClientRect();
              const prevOverdrag = prevRect.height * 0.25;
              if (currentY < prevRect.bottom - prevOverdrag) {
                if (navigator.vibrate) navigator.vibrate(100);
                container.insertBefore(row, prevRow);
                return;
              }
            }

            // Check Next
            if (currentIndex < children.length - 1) {
              const nextRow = children[currentIndex + 1];
              const nextRect = nextRow.getBoundingClientRect();
              const nextOverdrag = nextRect.height * 0.25;
              if (currentY > nextRect.top + nextOverdrag) {
                if (navigator.vibrate) navigator.vibrate(100);
                nextRow.after(row);
                return;
              }
            }
          };

          const onEnd = async () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onEnd);
            ghost.remove();
            row.classList.remove("drag-ghost-hidden");

            // Re-enable interactive elements
            allInteractive.forEach((el, idx) => {
              el.disabled = originalDisabled[idx];
            });

            await saveDragReorder();
          };

          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onEnd);
        });

        dragHandle.addEventListener("touchstart", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const touch = e.touches[0];
          const startX = touch.clientX;
          const startY = touch.clientY;
          const rect = row.getBoundingClientRect();
          const offsetX = startX - rect.left;
          const offsetY = startY - rect.top;
          if (navigator.vibrate) navigator.vibrate(100);
          const originalDisabled = [];
          const allInteractive = row.querySelectorAll("input, select, button");
          allInteractive.forEach((el) => { originalDisabled.push(el.disabled); el.disabled = true; });
          const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
          const clone = row.cloneNode(true);
          const originalInputs = row.querySelectorAll("input, select, textarea");
          const clonedInputs = clone.querySelectorAll("input, select, textarea");
          originalInputs.forEach((el, idx) => { if (clonedInputs[idx]) clonedInputs[idx].value = el.value; });
          ghost.appendChild(clone);
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.left = `${rect.left}px`;
          ghost.style.top = `${rect.top}px`;
          row.classList.add("drag-ghost-hidden");
          const onTouchMove = (moveEvent) => {
            moveEvent.preventDefault();
            const t = moveEvent.touches[0];
            const currentX = t.clientX;
            const currentY = t.clientY;
            ghost.style.left = `${currentX - offsetX}px`;
            ghost.style.top = `${currentY - offsetY}px`;
            const children = Array.from(container.querySelectorAll("div[data-group-uid]"));
            const currentIndex = children.indexOf(row);
            if (currentIndex === -1) return;
            if (currentIndex > 0) {
              const prevRow = children[currentIndex - 1];
              const prevRect = prevRow.getBoundingClientRect();
              if (currentY < prevRect.bottom - prevRect.height * 0.25) {
                if (navigator.vibrate) navigator.vibrate(100);
                container.insertBefore(row, prevRow);
                return;
              }
            }
            if (currentIndex < children.length - 1) {
              const nextRow = children[currentIndex + 1];
              const nextRect = nextRow.getBoundingClientRect();
              if (currentY > nextRect.top + nextRect.height * 0.25) {
                if (navigator.vibrate) navigator.vibrate(100);
                nextRow.after(row);
                return;
              }
            }
          };
          const onTouchEnd = async () => {
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            ghost.remove();
            row.classList.remove("drag-ghost-hidden");
            allInteractive.forEach((el, idx) => { el.disabled = originalDisabled[idx]; });
            await saveDragReorder();
          };
          document.addEventListener("touchmove", onTouchMove, { passive: false });
          document.addEventListener("touchend", onTouchEnd);
        }, { passive: false });
      });
    } catch (e) {}
  }

  _refreshBlacklistGroups() {
    try {
      const container = this.containerEl.querySelector(
        ".act-blacklist-groups-container",
      );
      if (!container) return;
      container.empty();
      const allGroups = Array.isArray(this.plugin.settings.blacklistEntryGroups)
        ? this.plugin.settings.blacklistEntryGroups
        : [];
      const q = String(this._blacklistGroupSearch || "")
        .toLowerCase()
        .trim();
      const groups = q
        ? allGroups.filter((g) => {
            const matchesName = String(g?.name || "")
              .toLowerCase()
              .includes(q);
            const matchesActive = q === "active" && g?.active;
            const matchesInactive = q === "inactive" && !g?.active;
            return matchesName || matchesActive || matchesInactive;
          })
        : allGroups;

      // Function to save reordered blacklist groups
      const saveDragReorder = async () => {
        const groupRows = Array.from(
          container.querySelectorAll("div[data-group-uid]"),
        );
        const newOrder = groupRows
          .map((r) => {
            const uid = r.getAttribute("data-group-uid");
            return allGroups.find((g) => g && g.uid === uid);
          })
          .filter((g) => g);
        this.plugin.settings.blacklistEntryGroups = newOrder;
        await this.plugin.saveSettings();
        if (this.plugin.settings.showBlacklistGroupsInCommands)
          this.plugin.reregisterCommandsWithLanguage();
        this._refreshBlacklistGroups();
      };

      groups.forEach((group, index) => {
        const row = container.createDiv();
        try {
          row.addClass("act-blacklist-group-row");
        } catch (e) {
          try {
            row.classList.add("act-blacklist-group-row");
          } catch (_) {}
        }
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "10px";
        row.style.marginBottom = "10px";
        row.style.padding = "10px";
        row.style.border = "1px solid var(--background-modifier-border)";
        row.style.borderRadius = "var(--setting-items-radius)";
        row.style.backgroundColor = "var(--setting-items-background)";
        row.setAttribute("data-group-uid", group.uid || "");

        // Drag handle
        const dragHandle = row.createEl("button");
        setIcon(dragHandle, "menu");
        dragHandle.style.padding = "0";
        dragHandle.style.border = "none";
        dragHandle.style.background = "transparent";
        dragHandle.style.boxShadow = "none";
        dragHandle.style.cursor = "grab";
        dragHandle.style.color = "var(--text-muted)";
        dragHandle.style.flexShrink = "0";
        dragHandle.style.display = "flex";
        dragHandle.style.alignItems = "center";
        dragHandle.style.justifyContent = "center";
        dragHandle.setAttribute(
          "aria-label",
          this.plugin.t("drag_to_reorder", "Drag to reorder"),
        );

        const activeSelect = row.createEl("select");
        try {
          activeSelect.addClass("dropdown");
        } catch (e) {}
        try {
          activeSelect.addClass("act-group-select");
        } catch (e) {
          try {
            activeSelect.classList.add("act-group-select");
          } catch (_) {}
        }
        activeSelect.style.minWidth = "100px";
        activeSelect.createEl("option", {
          text: this.plugin.t("group_active_label", "Active"),
          value: "true",
        });
        activeSelect.createEl("option", {
          text: this.plugin.t("group_inactive_label", "Inactive"),
          value: "false",
        });
        if (!group.uid) {
          try {
            group.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (_) {}
        }
        activeSelect.value = String(!!group.active);
        const activeHandler = async () => {
          group.active = activeSelect.value === "true";
          await this.plugin.saveSettings();
          if (this.plugin.settings.showBlacklistGroupsInCommands)
            this.plugin.reregisterCommandsWithLanguage();
        };
        activeSelect.onchange = activeHandler;

        const nameInput = row.createEl("input", {
          type: "text",
          value: group.name || "",
        });
        nameInput.style.flex = "1";
        nameInput.placeholder = this.plugin.t(
          "group_name_placeholder",
          "Name your group",
        );
        const nameHandler = async () => {
          group.name = nameInput.value;
          await this.plugin.saveSettings();
          if (this.plugin.settings.showBlacklistGroupsInCommands)
            this.plugin.reregisterCommandsWithLanguage();
        };
        nameInput.onchange = nameHandler;

        const btnDuplicate = row.createEl("div");
        btnDuplicate.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        btnDuplicate.style.cursor = "pointer";
        btnDuplicate.style.color = "var(--text-muted)";
        btnDuplicate.title = this.plugin.t(
          "tooltip_duplicate_group",
          "Duplicate Group",
        );
        btnDuplicate.style.display = "flex";
        btnDuplicate.style.alignItems = "center";
        btnDuplicate.onclick = async () => {
          const newGroup = JSON.parse(JSON.stringify(group));
          newGroup.name = (newGroup.name || "") + " (Copy)";
          try {
            newGroup.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (_) {}
          this.plugin.settings.blacklistEntryGroups.push(newGroup);
          await this.plugin.saveSettings();
          if (this.plugin.settings.showBlacklistGroupsInCommands)
            this.plugin.reregisterCommandsWithLanguage();
          this._refreshBlacklistGroups();
        };

        const btnEdit = row.createEl("div");
        btnEdit.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
        btnEdit.style.cursor = "pointer";
        btnEdit.style.color = "var(--text-muted)";
        btnEdit.title = this.plugin.t(
          "tooltip_edit_group_settings",
          "Edit Group Settings",
        );
        btnEdit.style.display = "flex";
        btnEdit.style.alignItems = "center";
        btnEdit.onclick = () => {
          const latestGroup =
            this.plugin.settings.blacklistEntryGroups.find(
              (g) => g && g.uid === group.uid,
            ) || group;
          new EditBlacklistGroupModal(
            this.app,
            this.plugin,
            latestGroup,
            async (updatedGroup) => {
              const idx = this.plugin.settings.blacklistEntryGroups.findIndex(
                (g) => g && g.uid === updatedGroup.uid,
              );
              if (idx !== -1)
                this.plugin.settings.blacklistEntryGroups[idx] = updatedGroup;
              await this.plugin.saveSettings();
              if (this.plugin.settings.showBlacklistGroupsInCommands)
                this.plugin.reregisterCommandsWithLanguage();
              this._refreshBlacklistGroups();
            },
            async (groupToDelete) => {
              const actualIndex =
                this.plugin.settings.blacklistEntryGroups.findIndex(
                  (g) => g && g.uid === groupToDelete.uid,
                );
              if (actualIndex !== -1)
                this.plugin.settings.blacklistEntryGroups.splice(
                  actualIndex,
                  1,
                );
              await this.plugin.saveSettings();
              if (this.plugin.settings.showBlacklistGroupsInCommands)
                this.plugin.reregisterCommandsWithLanguage();
              this._refreshBlacklistGroups();
            },
          ).open();
        };

        // Custom Drag Implementation matching quick styles smooth dragging
        dragHandle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const startX = e.clientX;
          const startY = e.clientY;
          const rect = row.getBoundingClientRect();
          const offsetX = startX - rect.left;
          const offsetY = startY - rect.top;

          if (navigator.vibrate) navigator.vibrate(100);

          // Disable all interactive elements during drag to prevent state changes
          const originalDisabled = [];
          const allInteractive = row.querySelectorAll("input, select, button");
          allInteractive.forEach((el) => {
            originalDisabled.push(el.disabled);
            el.disabled = true;
          });

          // Create ghost
          const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
          const clone = row.cloneNode(true);
          // Manually copy values for selects/inputs because cloneNode doesn't copy dynamic values
          const originalInputs = row.querySelectorAll(
            "input, select, textarea",
          );
          const clonedInputs = clone.querySelectorAll(
            "input, select, textarea",
          );
          originalInputs.forEach((el, idx) => {
            if (clonedInputs[idx]) clonedInputs[idx].value = el.value;
          });
          ghost.appendChild(clone);
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.left = `${rect.left}px`;
          ghost.style.top = `${rect.top}px`;

          // Hide original (and its interactive elements)
          row.classList.add("drag-ghost-hidden");

          const onMove = (moveEvent) => {
            moveEvent.preventDefault();
            const currentX = moveEvent.clientX;
            const currentY = moveEvent.clientY;

            // Update ghost position
            ghost.style.left = `${currentX - offsetX}px`;
            ghost.style.top = `${currentY - offsetY}px`;

            // Reordering logic
            const children = Array.from(
              container.querySelectorAll("div[data-group-uid]"),
            );
            const currentIndex = children.indexOf(row);
            if (currentIndex === -1) return;

            // Check Previous
            if (currentIndex > 0) {
              const prevRow = children[currentIndex - 1];
              const prevRect = prevRow.getBoundingClientRect();
              const prevOverdrag = prevRect.height * 0.25;
              if (currentY < prevRect.bottom - prevOverdrag) {
                if (navigator.vibrate) navigator.vibrate(100);
                container.insertBefore(row, prevRow);
                return;
              }
            }

            // Check Next
            if (currentIndex < children.length - 1) {
              const nextRow = children[currentIndex + 1];
              const nextRect = nextRow.getBoundingClientRect();
              const nextOverdrag = nextRect.height * 0.25;
              if (currentY > nextRect.top + nextOverdrag) {
                if (navigator.vibrate) navigator.vibrate(100);
                nextRow.after(row);
                return;
              }
            }
          };

          const onEnd = async () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onEnd);
            ghost.remove();
            row.classList.remove("drag-ghost-hidden");

            // Re-enable interactive elements
            allInteractive.forEach((el, idx) => {
              el.disabled = originalDisabled[idx];
            });

            await saveDragReorder();
          };

          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onEnd);
        });

        dragHandle.addEventListener("touchstart", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const touch = e.touches[0];
          const startX = touch.clientX;
          const startY = touch.clientY;
          const rect = row.getBoundingClientRect();
          const offsetX = startX - rect.left;
          const offsetY = startY - rect.top;
          if (navigator.vibrate) navigator.vibrate(100);
          const originalDisabled = [];
          const allInteractive = row.querySelectorAll("input, select, button");
          allInteractive.forEach((el) => { originalDisabled.push(el.disabled); el.disabled = true; });
          const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
          const clone = row.cloneNode(true);
          const originalInputs = row.querySelectorAll("input, select, textarea");
          const clonedInputs = clone.querySelectorAll("input, select, textarea");
          originalInputs.forEach((el, idx) => { if (clonedInputs[idx]) clonedInputs[idx].value = el.value; });
          ghost.appendChild(clone);
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.left = `${rect.left}px`;
          ghost.style.top = `${rect.top}px`;
          row.classList.add("drag-ghost-hidden");
          const onTouchMove = (moveEvent) => {
            moveEvent.preventDefault();
            const t = moveEvent.touches[0];
            const currentX = t.clientX;
            const currentY = t.clientY;
            ghost.style.left = `${currentX - offsetX}px`;
            ghost.style.top = `${currentY - offsetY}px`;
            const children = Array.from(container.querySelectorAll("div[data-group-uid]"));
            const currentIndex = children.indexOf(row);
            if (currentIndex === -1) return;
            if (currentIndex > 0) {
              const prevRow = children[currentIndex - 1];
              const prevRect = prevRow.getBoundingClientRect();
              if (currentY < prevRect.bottom - prevRect.height * 0.25) {
                if (navigator.vibrate) navigator.vibrate(100);
                container.insertBefore(row, prevRow);
                return;
              }
            }
            if (currentIndex < children.length - 1) {
              const nextRow = children[currentIndex + 1];
              const nextRect = nextRow.getBoundingClientRect();
              if (currentY > nextRect.top + nextRect.height * 0.25) {
                if (navigator.vibrate) navigator.vibrate(100);
                nextRow.after(row);
                return;
              }
            }
          };
          const onTouchEnd = async () => {
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            ghost.remove();
            row.classList.remove("drag-ghost-hidden");
            allInteractive.forEach((el, idx) => { el.disabled = originalDisabled[idx]; });
            await saveDragReorder();
          };
          document.addEventListener("touchmove", onTouchMove, { passive: false });
          document.addEventListener("touchend", onTouchEnd);
        }, { passive: false });
      });
    } catch (e) {}
  }

  // Clean up event listeners to prevent leaks
  onClose() {
    try {
      // CRITICAL: Flush any pending debounced saves before closing
      try {
        if (
          this.debouncedSaveSettings &&
          typeof this.debouncedSaveSettings.flush === "function"
        ) {
          this.debouncedSaveSettings.flush();
        }
      } catch (e) {
        debugError("SETTINGS", "debounce flush error", e);
      }
      try {
        const rows = Array.from(this._entryRows?.entries() || []);
        rows.forEach(([entry, info]) => {
          if (!entry || !info || !info.elements) return;
          const { textInput, styleSelect, cp, cpBg, regexChk, flagsInput } =
            info.elements;
          let idx = -1;
          if (entry && entry.uid)
            idx = this.plugin.settings.wordEntries.findIndex(
              (e) => e && e.uid === entry.uid,
            );
          if (idx === -1) idx = this.plugin.settings.wordEntries.indexOf(entry);
          if (idx === -1) return;
          const s = this.plugin.settings.wordEntries[idx];
          if (textInput && typeof textInput.value === "string") {
            const raw = String(textInput.value || "");
            const patterns = raw.split(",").filter((p) => p.length > 0);
            s.pattern = patterns[0] || "";
            s.groupedPatterns = patterns.length > 1 ? patterns : null;
          }
          if (regexChk) {
            s.isRegex = !!regexChk.checked;
          }
          if (flagsInput && typeof flagsInput.value === "string") {
            s.flags = String(flagsInput.value || "");
          }
          const style = styleSelect ? styleSelect.value : s.styleType || "text";
          if (style === "text") {
            const val = cp && typeof cp.value === "string" ? cp.value : s.color;
            s.color = this.plugin.isValidHexColor(val) ? val : "";
            s.textColor = null;
            s.backgroundColor = null;
            s.styleType = "text";
            s._savedTextColor = this.plugin.isValidHexColor(s.color)
              ? s.color
              : s._savedTextColor || null;
          } else if (style === "highlight") {
            const bgCandidate =
              cpBg && typeof cpBg.value === "string"
                ? cpBg.value
                : s.backgroundColor ||
                  s._savedBackgroundColor ||
                  s._savedTextColor ||
                  (this.plugin.isValidHexColor(s.color) ? s.color : "");
            s.backgroundColor = this.plugin.isValidHexColor(bgCandidate)
              ? bgCandidate
              : null;
            s.textColor = "currentColor";
            s.color = "";
            s.styleType = "highlight";
            s._savedBackgroundColor = this.plugin.isValidHexColor(
              s.backgroundColor,
            )
              ? s.backgroundColor
              : s._savedBackgroundColor || null;
          } else {
            const t =
              cp && typeof cp.value === "string" ? cp.value : s.textColor;
            const b =
              cpBg && typeof cpBg.value === "string"
                ? cpBg.value
                : s.backgroundColor;
            s.textColor = this.plugin.isValidHexColor(t)
              ? t
              : s.textColor === "currentColor"
                ? "currentColor"
                : null;
            s.backgroundColor = this.plugin.isValidHexColor(b) ? b : null;
            s.color = "";
            s.styleType = "both";
            s._savedTextColor = this.plugin.isValidHexColor(s.textColor)
              ? s.textColor
              : s._savedTextColor || null;
            s._savedBackgroundColor = this.plugin.isValidHexColor(
              s.backgroundColor,
            )
              ? s.backgroundColor
              : s._savedBackgroundColor || null;
          }
        });
        this.plugin.saveSettings();
      } catch (e) {
        debugError("SETTINGS", "snapshot rows on close error", e);
      }

      // Comprehensive cleanup for all dynamically created elements
      try {
        const allInputs =
          this.containerEl?.querySelectorAll('input[type="text"]') || [];
        allInputs.forEach((input) => {
          // Clean up dropdown listeners
          if (input._actDropdown) {
            const dd = input._actDropdown;
            if (input._dropdownScrollListener) {
              document.removeEventListener(
                "scroll",
                input._dropdownScrollListener,
                true,
              );
              input._dropdownScrollListener = null;
            }
            if (input._dropdownClickListener) {
              document.removeEventListener(
                "click",
                input._dropdownClickListener,
              );
              input._dropdownClickListener = null;
            }
            if (input._dropdownKeyListener) {
              document.removeEventListener(
                "keydown",
                input._dropdownKeyListener,
              );
              input._dropdownKeyListener = null;
            }
            try {
              dd.remove();
            } catch (e) {}
            input._actDropdown = null;
          }
          // Clean up any remaining custom cleanup handlers
          if (
            input._dropdownCleanup &&
            typeof input._dropdownCleanup === "function"
          ) {
            try {
              input._dropdownCleanup();
            } catch (e) {}
            input._dropdownCleanup = null;
          }
        });
      } catch (e) {
        debugError("SETTINGS", "dropdown cleanup error", e);
      }

      // Run standard cleanup handlers
      this._cleanupHandlers?.forEach((cleanup) => {
        try {
          cleanup();
        } catch (e) {
          debugError("SETTINGS", "cleanup error", e);
        }
      });
      this._cleanupHandlers = [];
      // Run any dynamic handlers (e.g., dropdown click watchers)
      if (Array.isArray(this._dynamicHandlers)) {
        this._dynamicHandlers.forEach((h) => {
          try {
            h();
          } catch (e) {}
        });
        this._dynamicHandlers = [];
      }
      // Clear cached UI data
      this._cachedFolderSuggestions = null;
      // Clear DOM content to drop references
      try {
        this.containerEl?.empty();
      } catch (e) {}
      this._pathRulesContainer = null;
      this._disabledFilesContainer = null;
      this._disabledFilesHeaderEl = null;
      this._disabledFilesSearchContainer = null;
      this._disabledFilesSearchInput = null;
      this._disabledFilesSearchIcon = null;
      this._disabledFilesListEl = null;
      this._blacklistWordsContainer = null;
      this._blacklistGroupsContainer = null;
      this._customSwatchesContainer = null;
      // Reset suspend flag and re-refresh lists with proper sorting
      this._suspendSorting = false;
      try {
        this._newEntriesSet && this._newEntriesSet.clear();
      } catch (e) {}
      try {
        this._blacklistNewSet && this._blacklistNewSet.clear();
      } catch (e) {}
      try {
        if (Array.isArray(this.plugin.settings.wordEntries)) {
          this.plugin.settings.wordEntries.forEach((e) => {
            if (e && e.persistAtEnd) delete e.persistAtEnd;
          });
        }
        if (Array.isArray(this.plugin.settings.blacklistEntries)) {
          this.plugin.settings.blacklistEntries.forEach((e) => {
            if (e && e.persistAtEnd) delete e.persistAtEnd;
          });
        }
      } catch (e) {}
      // Re-sort all lists now that the tab is closed and suspend is cleared
      try {
        this._refreshPathRules();
      } catch (e) {}
      try {
        this._refreshBlacklistWords();
      } catch (e) {}
    } catch (e) {
      debugError("SETTINGS", "onClose error", e);
    }
  }

  display() {
    const { containerEl } = this;
    // Store reference to containerEl for use in other methods like focusTextBgEntry
    this.containerEl = containerEl;
    // If we've already created the static UI once, only refresh dynamic sections
    if (this._initializedSettingsUI) {
      try {
        if (this._activeTab === "always-color-texts") {
          this._refreshEntries();
          this._refreshGroups();
        }
        if (this._activeTab === "blacklist") this._refreshBlacklistWords();
        if (this._activeTab === "file-folder-rules") {
          this._refreshPathRules();
          this._refreshDisabledFiles();
        }
      } catch (e) {}
      return;
    }
    // First-time render: build full UI
    containerEl.empty();
    // Clear any previous cleanup handlers
    this.onClose();
    this._cleanupHandlers = [];

    containerEl.createEl("h1", {
      text: this.plugin.t("settings_title", "Always Color Text Settings"),
    });

    // --- TABS ---
    const tabContainer = containerEl.createDiv();
    tabContainer.addClass("act-tabs-container");
    tabContainer.style.display = "flex";
    tabContainer.style.flexWrap = "wrap";
    tabContainer.style.gap = "10px";
    tabContainer.style.marginBottom = "20px";
    tabContainer.style.borderBottom =
      "1px solid var(--background-modifier-border)";
    tabContainer.style.paddingBottom = "10px";

    const tabs = [
      {
        id: "general",
        label: this.plugin.t("settings_tab_general", "General"),
      },
      {
        id: "always-color-texts",
        label: this.plugin.t("settings_tab_colored_texts", "Colored Texts"),
      },
      {
        id: "blacklist",
        label: this.plugin.t("settings_tab_blacklists", "Blacklists"),
      },
      {
        id: "file-folder-rules",
        label: this.plugin.t(
          "settings_tab_file_folder_rules",
          "File / Folder Rules",
        ),
      },
      { id: "data", label: this.plugin.t("settings_tab_data", "Data") },
    ];

    tabs.forEach((tab) => {
      const btn = tabContainer.createEl("button", { text: tab.label });
      btn.addClass("act-tab-button");
      btn.style.flex = "1 1 auto";
      btn.style.cursor = "pointer";
      btn.style.border = "none";
      btn.style.background = "transparent";
      btn.style.boxShadow = "none";
      btn.style.borderRadius = "4px";
      btn.style.padding = "8px 16px";

      if (this._activeTab === tab.id) {
        btn.addClass("mod-cta");
        btn.addClass("act-tab-active");
        btn.style.fontWeight = "bold";
      } else {
        btn.style.color = "var(--text-muted)";
      }

      btn.onclick = () => {
        this._activeTab = tab.id;
        this._initializedSettingsUI = false;
        this.display();
      };
    });

    if (this._activeTab === "general") {
      const releaseNotesSettingEl = new Setting(containerEl)
        .setName(
          this.plugin.t("latest_release_notes_label", "Latest Release Notes"),
        )
        .setDesc(
          this.plugin.t(
            "latest_release_notes_desc",
            "View the most recent plugin release notes",
          ),
        )
        .addButton((btn) =>
          btn
            .setButtonText(
              this.plugin.t("open_changelog_button", "Open Changelog"),
            )
            .onClick(() => {
              try {
                new ChangelogModal(this.app, this.plugin).open();
              } catch (e) {}
            }),
        );
      try {
        releaseNotesSettingEl.settingEl.style.borderTop = "none";
        // releaseNotesSettingEl.settingEl.style.marginTop = '-18px';
      } catch (e) {}

      new Setting(containerEl)
        .setName(this.plugin.t("language_label", "Language"))
        .setDesc(
          this.plugin.t(
            "language_desc",
            "Select the language to be used in this plugin",
          ),
        )
        .addDropdown((d) => {
          const langs = this.plugin.getAvailableLanguages();
          const names = {
            auto: this.plugin.t("language_auto", "System Default"),
            en: "English",
            es: "Spanish",
            fr: "French",
            eu: "Basque",
            ru: "Russian",
          };
          try {
            d.selectEl.style.textAlign = "center";
          } catch (e) {}
          langs.forEach((code) => {
            const dict =
              (this.plugin._translations && this.plugin._translations[code]) ||
              {};
            const display = String(
              dict.__name || names[code] || code.toUpperCase(),
            );
            d.addOption(code, display);
          });
          d.setValue(this.plugin.settings.language || "en").onChange(
            async (v) => {
              this.plugin.settings.language = v;
              await this.plugin.saveSettings();
              this._initializedSettingsUI = false;
              // Re-register commands with the new language
              this.plugin.reregisterCommandsWithLanguage();
              this.display();
            },
          );
          return d;
        });

      new Setting(containerEl)
        .setName(
          this.plugin.t("show_toggle_statusbar", "Show Toggle in Status Bar"),
        )
        .addToggle((t) =>
          t
            .setValue(!this.plugin.settings.disableToggleModes.statusBar)
            .onChange(async (v) => {
              this.plugin.settings.disableToggleModes.statusBar = !v;
              await this.plugin.saveSettings();
              try {
                if (v && !this.plugin.statusBar) {
                  this.plugin.statusBar = this.plugin.addStatusBarItem();
                  this.plugin.updateStatusBar();
                  this.plugin.statusBar.onclick = () => {
                    this.plugin.settings.enabled =
                      !this.plugin.settings.enabled;
                    this.plugin.saveSettings();
                    this.plugin.updateStatusBar();
                    this.plugin.reconfigureEditorExtensions();
                    this.plugin.forceRefreshAllEditors();
                    this.plugin.forceRefreshAllReadingViews();
                  };
                } else if (!v && this.plugin.statusBar) {
                  try {
                    this.plugin.statusBar.remove();
                  } catch (e) {}
                  this.plugin.statusBar = null;
                }
              } catch (e) {}
            }),
        );

      new Setting(containerEl)
        .setName(
          this.plugin.t("show_toggle_ribbon", "Show Toggle icon in ribbon"),
        )
        .addToggle((t) =>
          t
            .setValue(!this.plugin.settings.disableToggleModes.ribbon)
            .onChange(async (v) => {
              this.plugin.settings.disableToggleModes.ribbon = !v;
              await this.plugin.saveSettings();
              try {
                if (v && !this.ribbonIcon) {
                  this.ribbonIcon = this.addRibbonIcon(
                    "palette",
                    this.t("ribbon_title", "Always color text"),
                    async () => {
                      this.settings.enabled = !this.settings.enabled;
                      await this.saveSettings();
                      this.updateStatusBar();
                      this.reconfigureEditorExtensions();
                      this.forceRefreshAllEditors();
                      this.forceRefreshAllReadingViews();
                      if (this.settings.enabled)
                        new Notice(
                          this.t("notice_enabled", "Always color text enabled"),
                        );
                      else
                        new Notice(
                          this.t(
                            "notice_disabled",
                            "Always color text disabled",
                          ),
                        );
                    },
                  );
                } else if (!v && this.ribbonIcon && this.ribbonIcon.remove) {
                  try {
                    this.ribbonIcon.remove();
                  } catch (e) {}
                  this.ribbonIcon = null;
                }
              } catch (e) {}
            }),
        );

      new Setting(containerEl)
        .setName(this.plugin.t("show_toggle_command", "Show Toggle in command"))
        .addToggle((t) =>
          t
            .setValue(!this.plugin.settings.disableToggleModes.command)
            .onChange(async (v) => {
              this.plugin.settings.disableToggleModes.command = !v;
              await this.plugin.saveSettings();
              try {
                if (v) {
                  if (!this.plugin._commandsRegistered) {
                    try {
                      this.plugin.registerCommandPalette?.();
                    } catch (e) {}
                    this.plugin._commandsRegistered = true;
                  }
                } else {
                  new ConfirmationModal(
                    this.app,
                    this.plugin,
                    this.plugin.t("restart_required_title", "Restart required"),
                    this.plugin.t(
                      "restart_required_desc",
                      "Disabling the command palette toggle requires restarting Obsidian to fully remove commands from the palette. Restart now?",
                    ),
                    () => {
                      try {
                        location.reload();
                      } catch (e) {}
                    },
                  ).open();
                }
              } catch (e) {}
            }),
        );

      containerEl.createEl("h3", {
        text: this.plugin.t(
          "color_rendering_header",
          "Color Rendering & Performance",
        ),
      });

      // 1. Enable document color
      new Setting(containerEl)
        .setName(this.plugin.t("enable_document_color", "Enable Global Color"))
        .addToggle((t) =>
          t.setValue(this.plugin.settings.enabled).onChange(async (v) => {
            this.plugin.settings.enabled = v;
            await this.debouncedSaveSettings();
          }),
        );

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "color_in_live_preview_mode",
            "Color in live preview mode",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(!this.plugin.settings.disableLivePreviewColoring)
            .onChange(async (v) => {
              this.plugin.settings.disableLivePreviewColoring = !v;
              await this.debouncedSaveSettings();
              try {
                if (this.plugin.settings.enabled) {
                  if (v) {
                    try {
                      this.plugin.applyEnabledLivePreviewCalloutStyles();
                    } catch (_) {}
                    try {
                      this.plugin.applyEnabledLivePreviewTextColorStyles();
                    } catch (_) {}
                  } else {
                    try {
                      this.plugin.removeEnabledLivePreviewCalloutStyles();
                    } catch (_) {}
                    try {
                      this.plugin.removeEnabledLivePreviewTextColorStyles();
                    } catch (_) {}
                  }
                  try {
                    this.plugin.refreshAllLivePreviewCallouts();
                  } catch (_) {}
                  try {
                    this.plugin.forceReprocessLivePreviewCallouts();
                  } catch (_) {}
                  try {
                    this.plugin.refreshAllLivePreviewTables();
                  } catch (_) {}
                  try {
                    this.plugin.forceReprocessLivePreviewTables();
                  } catch (_) {}
                } else {
                  try {
                    this.plugin.removeEnabledLivePreviewCalloutStyles();
                  } catch (_) {}
                  try {
                    this.plugin.removeEnabledLivePreviewTextColorStyles();
                  } catch (_) {}
                }
              } catch (_) {}
            }),
        );

      // Option: color in reading/preview panes
      new Setting(containerEl)
        .setName(
          this.plugin.t("color_in_reading_mode", "Color in reading mode"),
        )
        .addToggle((t) =>
          t
            .setValue(!this.plugin.settings.disableReadingModeColoring)
            .onChange(async (v) => {
              this.plugin.settings.disableReadingModeColoring = !v;
              // Sync forceFullRenderInReading: always enabled if Reading Mode is on
              this.plugin.settings.forceFullRenderInReading = v;
              await this.debouncedSaveSettings();
              try {
                if (!v) {
                  this.plugin.app.workspace.iterateAllLeaves((leaf) => {
                    if (
                      leaf.view instanceof MarkdownView &&
                      leaf.view.getMode &&
                      leaf.view.getMode() === "preview"
                    ) {
                      try {
                        const root =
                          (leaf.view.previewMode &&
                            leaf.view.previewMode.containerEl) ||
                          leaf.view.contentEl ||
                          leaf.view.containerEl;
                        if (root) {
                          try {
                            this.plugin.clearHighlightsInRoot(root);
                          } catch (e) {}
                          try {
                            const obs =
                              this.plugin._viewportObservers &&
                              this.plugin._viewportObservers.get &&
                              this.plugin._viewportObservers.get(root);
                            if (obs && typeof obs.disconnect === "function") {
                              try {
                                obs.disconnect();
                              } catch (e) {}
                              try {
                                this.plugin._viewportObservers.delete(root);
                              } catch (e) {}
                            }
                          } catch (e) {}
                        }
                      } catch (e) {}
                    }
                  });
                } else {
                  try {
                    this.plugin.forceRefreshAllReadingViews();
                  } catch (e) {}
                }
              } catch (e) {
                debugError(
                  "SETTINGS",
                  "disableReadingModeColoring handler failed",
                  e,
                );
              }
            }),
        );

      new Setting(containerEl)
        .setName(
          this.plugin.t("lightweight_mode", "Lightweight mode (Experimental)"),
        )
        .setDesc(this.plugin.t("lightweight_mode_desc", ""))
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.extremeLightweightMode)
            .onChange(async (v) => {
              this.plugin.settings.extremeLightweightMode = v;
              await this.debouncedSaveSettings();
              try {
                this.plugin.reconfigureEditorExtensions();
              } catch (e) {}
              try {
                this.plugin.forceRefreshAllEditors();
              } catch (e) {}
              try {
                this.plugin.forceRefreshAllReadingViews();
              } catch (e) {}
            }),
        );

      new Setting(containerEl)
        .setName(
          this.plugin.t("smart_update_mode", "Smart Updates (Experimental)"),
        )
        .setDesc(
          this.plugin.t(
            "smart_update_mode_desc",
            "Only updates coloring for active line while typing and freezes other lines to improve performance.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableSmartUpdates)
            .onChange(async (v) => {
              this.plugin.settings.enableSmartUpdates = v;
              await this.debouncedSaveSettings();
              try {
                this.plugin.reconfigureEditorExtensions();
              } catch (e) {}
              try {
                this.plugin.forceRefreshAllEditors();
              } catch (e) {}
            }),
        );

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "word_completion_coloring",
            "Word Completion Coloring (Experimental)",
          ),
        )
        .setDesc(
          this.plugin.t(
            "word_completion_coloring_desc",
            "Only color words after a space is typed. Prevents partial matches from being colored while typing.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableWordCompletionColoring)
            .onChange(async (v) => {
              this.plugin.settings.enableWordCompletionColoring = v;
              await this.debouncedSaveSettings();
              try {
                this.plugin.reconfigureEditorExtensions();
              } catch (e) {}
              try {
                this.plugin.forceRefreshAllEditors();
              } catch (e) {}
            }),
        );

      containerEl.createEl("h3", {
        text: this.plugin.t("matching_behavior_header", "Matching Behavior"),
      });

      new Setting(containerEl)
        .setName(this.plugin.t("case_sensitive", "Case sensitive"))
        .setDesc(
          this.plugin.t(
            "case_sensitive_desc",
            'If this is on, "word" and "Word" are treated as different. If it\'s off, they\'re colored the same.',
          ),
        )
        .addToggle((t) =>
          t.setValue(this.plugin.settings.caseSensitive).onChange(async (v) => {
            this.plugin.settings.caseSensitive = v;
            await this.debouncedSaveSettings();
          }),
        );
      new Setting(containerEl)
        .setName(this.plugin.t("partial_match", "Partial match"))
        .setDesc(
          this.plugin.t(
            "partial_match_desc",
            'If enabled, the whole word will be colored if any colored word is found inside it (e.g., "as" colors "Jasper").',
          ),
        )
        .addToggle((t) =>
          t.setValue(this.plugin.settings.partialMatch).onChange(async (v) => {
            this.plugin.settings.partialMatch = v;
            await this.debouncedSaveSettings();
          }),
        );
      new Setting(containerEl)
        .setName(this.plugin.t("regex_support", "Regex support"))
        .setDesc(
          this.plugin.t(
            "regex_support_desc",
            "Allow patterns to be regular expressions. Invalid regexes are ignored for safety.",
          ),
        )
        .setClass("act-regex-support-setting")
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableRegexSupport)
            .onChange(async (v) => {
              this.plugin.settings.enableRegexSupport = v;
              await this.plugin.saveSettings();
              this._initializedSettingsUI = false;
              this.display();
            }),
        );
      new Setting(containerEl)
        .setName(this.plugin.t("disable_regex_safety", "Disable regex safety"))
        .setDesc(
          this.plugin.t(
            "disable_regex_safety_desc",
            "Allow complex or potentially dangerous expressions. May cause performance issues or freezes.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.disableRegexSafety)
            .onChange(async (v) => {
              this.plugin.settings.disableRegexSafety = v;
              await this.plugin.saveSettings();
              try {
                this.plugin.reconfigureEditorExtensions();
              } catch (e) {}
              try {
                this.plugin.forceRefreshAllEditors();
              } catch (e) {}
              try {
                this.plugin.forceRefreshAllReadingViews();
              } catch (e) {}
            }),
        );

      containerEl.createEl("h3", {
        text: this.plugin.t("custom_css_header", "Custom CSS"),
      });

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "enable_custom_css",
            "Enable custom CSS for text styling",
          ),
        )
        .setDesc(
          this.plugin.t(
            "enable_custom_css_desc",
            "Add per-entry CSS via the 'Edit Custom CSS' button in entry and group editors.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableCustomCss)
            .onChange(async (v) => {
              this.plugin.settings.enableCustomCss = v;
              await this.plugin.saveSettings();
              try {
                this.plugin.reconfigureEditorExtensions();
              } catch (e) {}
              try {
                this.plugin.forceRefreshAllEditors();
              } catch (e) {}
              try {
                this.plugin.forceRefreshAllReadingViews();
              } catch (e) {}
            }),
        );

      containerEl.createEl("h3", {
        text: this.plugin.t("theme_support_header", "Theme Support"),
      });

      new Setting(containerEl)
        .setName(
          this.plugin.t("light_mode_fixer", "Light Mode Text Color Fixer"),
        )
        .setDesc(
          this.plugin.t(
            "light_mode_fixer_desc",
            "Automatically darkens colored text when using Light theme to improve visibility.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.lightModeFixer)
            .onChange(async (v) => {
              this.plugin.settings.lightModeFixer = v;
              await this.debouncedSaveSettings();
              this.plugin.updateLightModeFixer();
            }),
        );

      new Setting(containerEl)
        .setName(this.plugin.t("dark_mode_fixer", "Dark Mode Text Color Fixer"))
        .setDesc(
          this.plugin.t(
            "dark_mode_fixer_desc",
            "Automatically lightens colored text when using Dark theme to improve visibility.",
          ),
        )
        .addToggle((t) =>
          t.setValue(this.plugin.settings.darkModeFixer).onChange(async (v) => {
            this.plugin.settings.darkModeFixer = v;
            await this.debouncedSaveSettings();
            this.plugin.updateDarkModeFixer();
          }),
        );

      containerEl.createEl("h3", {
        text: this.plugin.t("menu_options_header", "Menu Options"),
      });

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "show_always_color_text_menu",
            'Show "Always Color Text" in right-click menu',
          ),
        )
        .setDesc(
          this.plugin.t(
            "show_always_color_text_menu_desc",
            "Adds a right-click menu item to color selected text.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableAlwaysColorTextMenu)
            .onChange(async (v) => {
              this.plugin.settings.enableAlwaysColorTextMenu = v;
              await this.plugin.saveSettings();
            }),
        );

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "show_add_to_existing_menu",
            'Show "Add to Existing Entry" in right-click menu',
          ),
        )
        .setDesc(
          this.plugin.t(
            "show_add_to_existing_menu_desc",
            "Adds a right-click menu item to add selected text to an existing entry.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableAddToExistingMenu)
            .onChange(async (v) => {
              this.plugin.settings.enableAddToExistingMenu = v;
              await this.plugin.saveSettings();
            }),
        );

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "show_blacklist_menu",
            'Show "Blacklist Word" in right-click menu',
          ),
        )
        .setDesc(
          this.plugin.t(
            "show_blacklist_menu_desc",
            "Adds a right-click menu item to blacklist selected text from coloring.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableBlacklistMenu)
            .onChange(async (v) => {
              this.plugin.settings.enableBlacklistMenu = v;
              await this.plugin.saveSettings();
            }),
        );

      // --- One-Time Actions (Foldable) ---
      const otaHeaderDiv = containerEl.createDiv();
      otaHeaderDiv.style.display = "flex";
      otaHeaderDiv.style.alignItems = "center";
      otaHeaderDiv.style.gap = "8px";
      otaHeaderDiv.style.marginTop = "16px";
      otaHeaderDiv.style.marginBottom = "10px";
      otaHeaderDiv.style.cursor = "pointer";

      const otaToggle = otaHeaderDiv.createEl("span");
      otaToggle.textContent = this.plugin.settings.oneTimeActionsFolded
        ? "▶"
        : "▼";
      otaToggle.style.fontSize = "12px";
      otaToggle.style.fontWeight = "bold";
      otaToggle.style.display = "inline-block";
      otaToggle.style.width = "16px";

      const otaTitle = otaHeaderDiv.createEl("h2", {
        text: this.plugin.t("one_time_actions_header", "One-Time Actions"),
      });
      otaTitle.style.margin = "0";
      otaTitle.style.padding = "0";
      otaTitle.style.flex = "1";

      const otaContainer = containerEl.createDiv();
      otaContainer.style.display = this.plugin.settings.oneTimeActionsFolded
        ? "none"
        : "block";

      const otaToggleHandler = async () => {
        this.plugin.settings.oneTimeActionsFolded =
          !this.plugin.settings.oneTimeActionsFolded;
        otaContainer.style.display = this.plugin.settings.oneTimeActionsFolded
          ? "none"
          : "block";
        otaToggle.textContent = this.plugin.settings.oneTimeActionsFolded
          ? "▶"
          : "▼";
        await this.debouncedSaveSettings();
      };

      otaHeaderDiv.addEventListener("click", otaToggleHandler);
      try {
        this._cleanupHandlers.push(() =>
          otaHeaderDiv.removeEventListener("click", otaToggleHandler),
        );
      } catch (_) {}

      new Setting(otaContainer)
        .setName(this.plugin.t("setting_color_once", "Color Once"))
        .setDesc(
          this.plugin.t(
            "setting_color_once_desc",
            "Inserts HTML inline for the selected text. This persists even if the plugin is turned off.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableQuickColorOnce)
            .onChange(async (v) => {
              this.plugin.settings.enableQuickColorOnce = v;
              await this.plugin.saveSettings();
            }),
        );

      new Setting(otaContainer)
        .setName(this.plugin.t("setting_highlight_once", "Highlight Once"))
        .setDesc(
          this.plugin.t(
            "setting_highlight_once_desc",
            "Inserts HTML inline with background styling. This persists even if the plugin is turned off.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableQuickHighlightOnce)
            .onChange(async (v) => {
              this.plugin.settings.enableQuickHighlightOnce = v;
              await this.plugin.saveSettings();
              this._initializedSettingsUI = false;
              this.display();
            }),
        );

      new Setting(otaContainer)
        .setName(
          this.plugin.t(
            "setting_color_highlight_once",
            "Color & Highlight Once",
          ),
        )
        .setDesc(
          this.plugin.t(
            "setting_color_highlight_once_desc",
            "Opens the unified color picker to apply both text color and background highlight inline. Uses Unified Menu.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableQuickColorHighlightOnce)
            .onChange(async (v) => {
              this.plugin.settings.enableQuickColorHighlightOnce = v;
              await this.plugin.saveSettings();
            }),
        );

      if (
        this.plugin.settings.enableQuickHighlightOnce ||
        this.plugin.settings.enableQuickColorHighlightOnce
      ) {
        new Setting(otaContainer)
          .setName(
            this.plugin.t(
              "use_global_highlight_style",
              "Use Global Highlight Style for Highlight Once",
            ),
          )
          .setDesc(
            this.plugin.t(
              "use_global_highlight_style_desc",
              "Uses your global inline style. The added HTML/CSS may be long.",
            ),
          )
          .addToggle((t) =>
            t
              .setValue(this.plugin.settings.quickHighlightUseGlobalStyle)
              .onChange(async (v) => {
                this.plugin.settings.quickHighlightUseGlobalStyle = v;
                await this.plugin.saveSettings();
                this._initializedSettingsUI = false;
                this.display();
              }),
          );

        new Setting(otaContainer)
          .setName(
            this.plugin.t("style_highlight_once", "Style Highlight Once"),
          )
          .setDesc(
            this.plugin.t(
              "style_highlight_once_desc",
              "Uses your custom inline style. The added HTML/CSS may be long.",
            ),
          )
          .addToggle((t) =>
            t
              .setValue(this.plugin.settings.quickHighlightStyleEnable)
              .onChange(async (v) => {
                this.plugin.settings.quickHighlightStyleEnable = v;
                await this.plugin.saveSettings();
                this._initializedSettingsUI = false;
                this.display();
              }),
          );

        // Preview for Highlight Once styling (non-interactive), shown under the toggle
        if (
          this.plugin.settings.quickHighlightStyleEnable &&
          !this.plugin.settings.quickHighlightUseGlobalStyle
        ) {
          const previewSection = otaContainer.createDiv();
          previewSection.style.margin = "8px 0 12px 0";
          previewSection.style.padding = "12px";
          previewSection.style.borderRadius = "8px";
          previewSection.style.border =
            "1px solid var(--background-modifier-border)";
          previewSection.style.backgroundColor = "var(--background-secondary)";
          const previewLabel = previewSection.createEl("div");
          previewLabel.style.marginBottom = "8px";
          previewLabel.style.fontWeight = "600";
          previewLabel.style.fontSize = "14px";
          previewLabel.textContent = this.plugin.t(
            "highlight_once_preview",
            "Highlight Once Preview",
          );
          const previewText = previewSection.createEl("div");
          previewText.textContent = this.plugin.t(
            "highlight_once_preview_text",
            "This is how Highlight Once will look like!",
          );
          previewText.style.display = "inline-block";

          const updateQuickOncePreview = () => {
            const sampleColor = "#fa8231";
            const hexWithAlpha = this.plugin.hexToHexWithAlpha(
              sampleColor,
              this.plugin.settings.quickHighlightOpacity ?? 25,
            );
            const radius = this.plugin.settings.quickHighlightBorderRadius ?? 8;
            const pad =
              this.plugin.settings.quickHighlightHorizontalPadding ?? 4;
            const vpad =
              this.plugin.settings.quickHighlightVerticalPadding ?? 0;
            previewText.style.backgroundColor = hexWithAlpha;
            previewText.style.borderRadius = radius + "px";
            previewText.style.paddingLeft = previewText.style.paddingRight =
              pad + "px";
            try {
              previewText.style.setProperty(
                "padding-top",
                (vpad >= 0 ? vpad : 0) + "px",
              );
              previewText.style.setProperty(
                "padding-bottom",
                (vpad >= 0 ? vpad : 0) + "px",
              );
              if (vpad < 0) {
                previewText.style.setProperty("margin-top", vpad + "px");
                previewText.style.setProperty("margin-bottom", vpad + "px");
              }
            } catch (e) {
              previewText.style.paddingTop = previewText.style.paddingBottom =
                (vpad >= 0 ? vpad : 0) + "px";
              if (vpad < 0) {
                previewText.style.marginTop = vpad + "px";
                previewText.style.marginBottom = vpad + "px";
              }
            }
            // Clear borders before re-applying
            previewText.style.border = "";
            previewText.style.borderTop = "";
            previewText.style.borderBottom = "";
            previewText.style.borderLeft = "";
            previewText.style.borderRight = "";
            const borderCss = this.plugin.generateOnceBorderStyle(sampleColor);
            try {
              previewText.style.cssText += borderCss;
            } catch (e) {}
          };
          updateQuickOncePreview();

          // Hook up live updates for controls below
          this._updateQuickOncePreview = updateQuickOncePreview;
        }

        if (
          this.plugin.settings.quickHighlightStyleEnable &&
          !this.plugin.settings.quickHighlightUseGlobalStyle
        ) {
          new Setting(otaContainer)
            .setName(
              this.plugin.t("highlight_once_opacity", "Highlight once opacity"),
            )
            .addSlider((slider) =>
              slider
                .setLimits(0, 100, 1)
                .setValue(this.plugin.settings.quickHighlightOpacity ?? 25)
                .setDynamicTooltip()
                .onChange(async (v) => {
                  this.plugin.settings.quickHighlightOpacity = v;
                  await this.plugin.saveSettings();
                  try {
                    this._updateQuickOncePreview?.();
                  } catch (e) {}
                }),
            );

          {
            let brInput;
            new Setting(otaContainer)
              .setName(
                this.plugin.t(
                  "highlight_once_border_radius",
                  "Highlight once border radius (px)",
                ),
              )
              .addText((text) => {
                brInput = text;
                text
                  .setPlaceholder("e.g. 0, 4, 8")
                  .setValue(
                    String(
                      this.plugin.settings.quickHighlightBorderRadius ?? 8,
                    ),
                  )
                  .onChange(async (v) => {
                    let val = parseInt(v);
                    if (isNaN(val) || val < 0) val = 0;
                    this.plugin.settings.quickHighlightBorderRadius = val;
                    await this.plugin.saveSettings();
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  });
              })
              .addExtraButton((btn) =>
                btn
                  .setIcon("reset")
                  .setTooltip(this.plugin.t("reset_to_8", "Reset to 8"))
                  .onClick(async () => {
                    this.plugin.settings.quickHighlightBorderRadius = 8;
                    await this.plugin.saveSettings();
                    if (brInput) brInput.setValue("8");
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  }),
              );
          }

          {
            let hpInput;
            new Setting(otaContainer)
              .setName(
                this.plugin.t(
                  "highlight_horizontal_padding",
                  "Highlight horizontal padding (px)",
                ),
              )
              .addText((text) => {
                hpInput = text;
                text
                  .setPlaceholder("e.g. 0, 4, 8")
                  .setValue(
                    String(
                      this.plugin.settings.quickHighlightHorizontalPadding ?? 4,
                    ),
                  )
                  .onChange(async (v) => {
                    let val = parseInt(v);
                    if (isNaN(val) || val < 0) val = 0;
                    this.plugin.settings.quickHighlightHorizontalPadding = val;
                    await this.plugin.saveSettings();
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  });
              })
              .addExtraButton((btn) =>
                btn
                  .setIcon("reset")
                  .setTooltip(this.plugin.t("reset_to_4", "Reset to 4"))
                  .onClick(async () => {
                    this.plugin.settings.quickHighlightHorizontalPadding = 4;
                    await this.plugin.saveSettings();
                    if (hpInput) hpInput.setValue("4");
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  }),
              );
          }

          {
            let vpInput;
            new Setting(otaContainer)
              .setName(
                this.plugin.t(
                  "highlight_vertical_padding",
                  "Highlight vertical padding (px)",
                ),
              )
              .addText((text) => {
                vpInput = text;
                text
                  .setPlaceholder("e.g. 0, 1, 2")
                  .setValue(
                    String(
                      this.plugin.settings.quickHighlightVerticalPadding ?? 0,
                    ),
                  )
                  .onChange(async (v) => {
                    let val = parseInt(v);
                    if (isNaN(val)) val = 0;
                    this.plugin.settings.quickHighlightVerticalPadding = val;
                    await this.plugin.saveSettings();
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  });
              })
              .addExtraButton((btn) =>
                btn
                  .setIcon("reset")
                  .setTooltip(this.plugin.t("reset_to_0", "Reset to 0"))
                  .onClick(async () => {
                    this.plugin.settings.quickHighlightVerticalPadding = 0;
                    await this.plugin.saveSettings();
                    if (vpInput) vpInput.setValue("0");
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  }),
              );
          }

          new Setting(otaContainer)
            .setName(
              this.plugin.t(
                "enable_border_highlight_once",
                "Enable Border for Highlight Once",
              ),
            )
            .setDesc(
              this.plugin.t(
                "enable_border_highlight_once_desc",
                "Add a border to your inline highlight. The added HTML/CSS WILL be long.",
              ),
            )
            .addToggle((t) =>
              t
                .setValue(
                  this.plugin.settings.quickHighlightEnableBorder ?? false,
                )
                .onChange(async (v) => {
                  this.plugin.settings.quickHighlightEnableBorder = v;
                  await this.plugin.saveSettings();
                  try {
                    this._updateQuickOncePreview?.();
                  } catch (e) {}
                  this._initializedSettingsUI = false;
                  this.display();
                }),
            );

          if (this.plugin.settings.quickHighlightEnableBorder) {
            new Setting(otaContainer)
              .setName(
                this.plugin.t(
                  "highlight_once_border_style",
                  "Highlight Once Border Sides",
                ),
              )
              .addDropdown((d) => {
                d.selectEl.style.width = "200px";
                return d
                  .addOption(
                    "full",
                    this.plugin.t("opt_border_full", "Full border (all sides)"),
                  )
                  .addOption(
                    "top-bottom",
                    this.plugin.t(
                      "opt_border_top_bottom",
                      "Top & Bottom borders",
                    ),
                  )
                  .addOption(
                    "left-right",
                    this.plugin.t(
                      "opt_border_left_right",
                      "Left & Right borders",
                    ),
                  )
                  .addOption(
                    "top-left-right",
                    this.plugin.t(
                      "opt_border_top_left_right",
                      "Top, Left & Right borders",
                    ),
                  )
                  .addOption(
                    "bottom-left-right",
                    this.plugin.t(
                      "opt_border_bottom_left_right",
                      "Bottom, Left & Right borders",
                    ),
                  )
                  .addOption(
                    "top-right",
                    this.plugin.t(
                      "opt_border_top_right",
                      "Top & Right borders",
                    ),
                  )
                  .addOption(
                    "top-left",
                    this.plugin.t("opt_border_top_left", "Top & Left borders"),
                  )
                  .addOption(
                    "bottom-right",
                    this.plugin.t(
                      "opt_border_bottom_right",
                      "Bottom & Right borders",
                    ),
                  )
                  .addOption(
                    "bottom-left",
                    this.plugin.t(
                      "opt_border_bottom_left",
                      "Bottom & Left borders",
                    ),
                  )
                  .addOption(
                    "top",
                    this.plugin.t("opt_border_top", "Top border only"),
                  )
                  .addOption(
                    "bottom",
                    this.plugin.t("opt_border_bottom", "Bottom border only"),
                  )
                  .addOption(
                    "left",
                    this.plugin.t("opt_border_left", "Left border only"),
                  )
                  .addOption(
                    "right",
                    this.plugin.t("opt_border_right", "Right border only"),
                  )
                  .setValue(
                    this.plugin.settings.quickHighlightBorderStyle ?? "full",
                  )
                  .onChange(async (v) => {
                    this.plugin.settings.quickHighlightBorderStyle = v;
                    await this.plugin.saveSettings();
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  });
              });

            new Setting(otaContainer)
              .setName(
                this.plugin.t(
                  "highlight_once_border_line_style",
                  "Border Style",
                ),
              )
              .addDropdown((d) => {
                d.selectEl.style.width = "200px";
                return d
                  .addOption("solid", this.plugin.t("opt_line_solid", "Solid"))
                  .addOption(
                    "dashed",
                    this.plugin.t("opt_line_dashed", "Dashed"),
                  )
                  .addOption(
                    "dotted",
                    this.plugin.t("opt_line_dotted", "Dotted"),
                  )
                  .addOption(
                    "double",
                    this.plugin.t("opt_line_double", "Double"),
                  )
                  .addOption(
                    "groove",
                    this.plugin.t("opt_line_groove", "Groove"),
                  )
                  .addOption("ridge", this.plugin.t("opt_line_ridge", "Ridge"))
                  .addOption("inset", this.plugin.t("opt_line_inset", "Inset"))
                  .addOption(
                    "outset",
                    this.plugin.t("opt_line_outset", "Outset"),
                  )
                  .setValue(
                    this.plugin.settings.quickHighlightBorderLineStyle ??
                      "solid",
                  )
                  .onChange(async (v) => {
                    this.plugin.settings.quickHighlightBorderLineStyle = v;
                    await this.plugin.saveSettings();
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  });
              });

            new Setting(otaContainer)
              .setName(
                this.plugin.t(
                  "highlight_once_border_opacity",
                  "Highlight Once Border Opacity",
                ),
              )
              .addSlider((slider) =>
                slider
                  .setLimits(0, 100, 1)
                  .setValue(
                    this.plugin.settings.quickHighlightBorderOpacity ?? 100,
                  )
                  .setDynamicTooltip()
                  .onChange(async (v) => {
                    this.plugin.settings.quickHighlightBorderOpacity = v;
                    await this.plugin.saveSettings();
                    try {
                      this._updateQuickOncePreview?.();
                    } catch (e) {}
                  }),
              );

            {
              let btInput;
              new Setting(otaContainer)
                .setName(
                  this.plugin.t(
                    "highlight_once_border_thickness",
                    "Highlight Once Border Thickness (px)",
                  ),
                )
                .addText((text) => {
                  btInput = text;
                  text
                    .setPlaceholder("e.g. 1, 2.5, 3.7")
                    .setValue(
                      String(
                        this.plugin.settings.quickHighlightBorderThickness ?? 1,
                      ),
                    )
                    .onChange(async (v) => {
                      let val = parseFloat(v);
                      if (isNaN(val) || val < 0) val = 0;
                      if (val > 5) val = 5;
                      this.plugin.settings.quickHighlightBorderThickness = val;
                      await this.plugin.saveSettings();
                      try {
                        this._updateQuickOncePreview?.();
                      } catch (e) {}
                    });
                })
                .addExtraButton((btn) =>
                  btn
                    .setIcon("reset")
                    .setTooltip(this.plugin.t("reset_to_1", "Reset to 1"))
                    .onClick(async () => {
                      this.plugin.settings.quickHighlightBorderThickness = 1;
                      await this.plugin.saveSettings();
                      if (btInput) btInput.setValue("1");
                      try {
                        this._updateQuickOncePreview?.();
                      } catch (e) {}
                    }),
                );
            }
          }
        }
      }

      // --- Global Highlight Coloring Appearance ---
      const ghHeaderDiv = containerEl.createDiv();
      ghHeaderDiv.style.display = "flex";
      ghHeaderDiv.style.alignItems = "center";
      ghHeaderDiv.style.gap = "8px";
      ghHeaderDiv.style.marginTop = "16px";
      ghHeaderDiv.style.marginBottom = "10px";
      ghHeaderDiv.style.cursor = "pointer";

      const ghToggle = ghHeaderDiv.createEl("span");
      ghToggle.textContent = this.plugin.settings.globalHighlightFolded
        ? "▶"
        : "▼";
      ghToggle.style.fontSize = "12px";
      ghToggle.style.fontWeight = "bold";
      ghToggle.style.display = "inline-block";
      ghToggle.style.width = "16px";

      const ghTitle = ghHeaderDiv.createEl("h3", {
        text: this.plugin.t(
          "global_highlight_appearance_header",
          "Global Highlight Coloring Appearance",
        ),
      });
      ghTitle.style.margin = "0";
      ghTitle.style.padding = "0";
      ghTitle.style.flex = "1";
      ghTitle.style.fontSize = "16px";
      ghTitle.style.fontWeight = "600";

      const ghContainer = containerEl.createDiv();
      ghContainer.style.display = this.plugin.settings.globalHighlightFolded
        ? "none"
        : "block";

      const ghToggleHandler = async () => {
        this.plugin.settings.globalHighlightFolded =
          !this.plugin.settings.globalHighlightFolded;
        ghContainer.style.display = this.plugin.settings.globalHighlightFolded
          ? "none"
          : "block";
        ghToggle.textContent = this.plugin.settings.globalHighlightFolded
          ? "▶"
          : "▼";
        await this.debouncedSaveSettings();
      };

      ghHeaderDiv.addEventListener("click", ghToggleHandler);
      try {
        this._cleanupHandlers.push(() =>
          ghHeaderDiv.removeEventListener("click", ghToggleHandler),
        );
      } catch (_) {}
      // Preview of highlight styling
      const previewSection = ghContainer.createDiv();
      previewSection.style.marginBottom = "16px";
      previewSection.style.padding = "12px";
      previewSection.style.borderRadius = "8px";
      previewSection.style.border =
        "1px solid var(--background-modifier-border)";
      previewSection.style.backgroundColor = "var(--background-secondary)";

      const previewLabel = previewSection.createEl("div");
      previewLabel.style.marginBottom = "8px";
      previewLabel.style.fontWeight = "600";
      previewLabel.style.fontSize = "14px";
      previewLabel.textContent = this.plugin.t(
        "highlight_preview",
        "Highlight Preview",
      );

      const previewText = previewSection.createEl("div");
      previewText.style.borderRadius = `${this.plugin.settings.highlightBorderRadius ?? 8}px`;
      previewText.style.display = "inline-block";
      previewText.style.maxWidth = "auto";
      previewText.style.wordWrap = "break-word";
      previewText.textContent = this.plugin.t(
        "highlight_preview_text",
        "Here's how your default highlight looks!",
      );

      const updatePreview = () => {
        const color = "#01c8ff";
        const rgba = this.plugin.hexToRgba(
          color,
          this.plugin.settings.backgroundOpacity ?? 25,
        );
        previewText.style.backgroundColor = rgba;
        previewText.style.borderRadius = `${this.plugin.settings.highlightBorderRadius ?? 8}px`;
        previewText.style.paddingLeft =
          previewText.style.paddingRight = `${this.plugin.settings.highlightHorizontalPadding ?? 4}px`;
        try {
          const vpad = this.plugin.settings.highlightVerticalPadding ?? 0;
          previewText.style.setProperty(
            "padding-top",
            (vpad >= 0 ? vpad : 0) + "px",
          );
          previewText.style.setProperty(
            "padding-bottom",
            (vpad >= 0 ? vpad : 0) + "px",
          );
          if (vpad < 0) {
            previewText.style.setProperty("margin-top", vpad + "px");
            previewText.style.setProperty("margin-bottom", vpad + "px");
          }
        } catch (e) {
          const vpad = this.plugin.settings.highlightVerticalPadding ?? 0;
          previewText.style.paddingTop = (vpad >= 0 ? vpad : 0) + "px";
          previewText.style.paddingBottom = (vpad >= 0 ? vpad : 0) + "px";
          if (vpad < 0) {
            previewText.style.marginTop = vpad + "px";
            previewText.style.marginBottom = vpad + "px";
          }
        }

        // Clear all existing border styles first
        previewText.style.border = "";
        previewText.style.borderTop = "";
        previewText.style.borderBottom = "";
        previewText.style.borderLeft = "";
        previewText.style.borderRight = "";

        // Apply new border styles if enabled
        if (this.plugin.settings.enableBorderThickness) {
          this.plugin.applyBorderStyleToElement(previewText, null, color);
        }
      };
      updatePreview();

      // Opacity slider (percent)
      new Setting(ghContainer)
        .setName(this.plugin.t("highlight_opacity", "Highlight opacity"))
        .setDesc(
          this.plugin.t(
            "highlight_opacity_desc",
            "Set the opacity of the highlight (0-100%)",
          ),
        )
        .addSlider((slider) =>
          slider
            .setLimits(0, 100, 1)
            .setValue(this.plugin.settings.backgroundOpacity ?? 25)
            .setDynamicTooltip()
            .onChange(async (v) => {
              this.plugin.settings.backgroundOpacity = v;
              await this.debouncedSaveSettings();
              updatePreview();
            }),
        );

      // Border radius input (px)
      {
        let brInput;
        new Setting(ghContainer)
          .setName(
            this.plugin.t(
              "highlight_border_radius",
              "Highlight border radius (px)",
            ),
          )
          .setDesc(
            this.plugin.t(
              "highlight_border_radius_desc",
              "Set the border radius (in px) for rounded highlight corners",
            ),
          )
          .addText((text) => {
            brInput = text;
            text
              .setPlaceholder("e.g. 0, 4, 8")
              .setValue(String(this.plugin.settings.highlightBorderRadius ?? 8))
              .onChange(async (v) => {
                let val = parseInt(v);
                if (isNaN(val) || val < 0) val = 0;
                this.plugin.settings.highlightBorderRadius = val;
                await this.debouncedSaveSettings();
                updatePreview();
              });
          })
          .addExtraButton((btn) =>
            btn
              .setIcon("reset")
              .setTooltip(this.plugin.t("reset_to_8", "Reset to 8"))
              .onClick(async () => {
                this.plugin.settings.highlightBorderRadius = 8;
                await this.debouncedSaveSettings();
                if (brInput) brInput.setValue("8");
                updatePreview();
              }),
          );
      }

      // Horizontal padding input (px)
      {
        let hpInput;
        new Setting(ghContainer)
          .setName(
            this.plugin.t(
              "highlight_horizontal_padding",
              "Highlight horizontal padding (px)",
            ),
          )
          .setDesc(
            this.plugin.t(
              "highlight_horizontal_padding_desc",
              "Set the left and right padding (in px) for highlighted text",
            ),
          )
          .addText((text) => {
            hpInput = text;
            text
              .setPlaceholder("e.g. 0, 4, 8")
              .setValue(
                String(this.plugin.settings.highlightHorizontalPadding ?? 4),
              )
              .onChange(async (v) => {
                let val = parseInt(v);
                if (isNaN(val) || val < 0) val = 0;
                this.plugin.settings.highlightHorizontalPadding = val;
                await this.debouncedSaveSettings();
                updatePreview();
              });
          })
          .addExtraButton((btn) =>
            btn
              .setIcon("reset")
              .setTooltip(this.plugin.t("reset_to_4", "Reset to 4"))
              .onClick(async () => {
                this.plugin.settings.highlightHorizontalPadding = 4;
                await this.debouncedSaveSettings();
                if (hpInput) hpInput.setValue("4");
                updatePreview();
              }),
          );
      }

      {
        let vpInput;
        new Setting(ghContainer)
          .setName(
            this.plugin.t(
              "highlight_vertical_padding",
              "Highlight vertical padding (px)",
            ),
          )
          .setDesc(
            this.plugin.t(
              "highlight_vertical_padding_desc",
              "Set the top and bottom padding (in px) for highlighted text",
            ),
          )
          .addText((text) => {
            vpInput = text;
            text
              .setPlaceholder("e.g. 0, 1, 2")
              .setValue(
                String(this.plugin.settings.highlightVerticalPadding ?? 0),
              )
              .onChange(async (v) => {
                let val = parseInt(v);
                if (isNaN(val) || val < 0) val = 0;
                this.plugin.settings.highlightVerticalPadding = val;
                await this.debouncedSaveSettings();
                updatePreview();
              });
          })
          .addExtraButton((btn) =>
            btn
              .setIcon("reset")
              .setTooltip(this.plugin.t("reset_to_0", "Reset to 0"))
              .onClick(async () => {
                this.plugin.settings.highlightVerticalPadding = 0;
                await this.debouncedSaveSettings();
                if (vpInput) vpInput.setValue("0");
                updatePreview();
              }),
          );
      }

      // Toggle for box decoration break on line wrapping
      new Setting(ghContainer)
        .setName(
          this.plugin.t(
            "rounded_corners_wrapping",
            "Rounded corners on line wrapping",
          ),
        )
        .setDesc(
          this.plugin.t(
            "rounded_corners_wrapping_desc",
            "When enabled, highlights will have rounded corners on all sides, even when text wraps to a new line.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableBoxDecorationBreak ?? true)
            .onChange(async (v) => {
              this.plugin.settings.enableBoxDecorationBreak = v;
              await this.debouncedSaveSettings();
            }),
        );

      // NEW: Enable Highlight Border toggle
      new Setting(ghContainer)
        .setName(
          this.plugin.t("enable_highlight_border", "Enable Highlight Border"),
        )
        .setDesc(
          this.plugin.t(
            "enable_highlight_border_desc",
            "Add a border around highlights. The border will match the text or highlight color.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.enableBorderThickness ?? false)
            .onChange(async (v) => {
              this.plugin.settings.enableBorderThickness = v;
              await this.plugin.saveSettings();
              updatePreview();
              // Force full re-render to show/hide border settings
              this._initializedSettingsUI = false;
              this.display();
            }),
        );

      // Show border controls only when enabled
      if (this.plugin.settings.enableBorderThickness) {
        // Border Style dropdown
        new Setting(ghContainer)
          .setName(this.plugin.t("border_style", "Border Sides"))
          .setDesc(
            this.plugin.t(
              "border_style_desc",
              "Choose which sides to apply the border",
            ),
          )
          .addDropdown((d) => {
            d.selectEl.style.width = "200px";
            try {
              d.selectEl.style.textAlign = "center";
            } catch (e) {}
            return d
              .addOption(
                "full",
                this.plugin.t("opt_border_full", "Full border (all sides)"),
              )
              .addOption(
                "top-bottom",
                this.plugin.t("opt_border_top_bottom", "Top & Bottom borders"),
              )
              .addOption(
                "left-right",
                this.plugin.t("opt_border_left_right", "Left & Right borders"),
              )
              .addOption(
                "top-left-right",
                this.plugin.t(
                  "opt_border_top_left_right",
                  "Top, Left & Right borders",
                ),
              )
              .addOption(
                "bottom-left-right",
                this.plugin.t(
                  "opt_border_bottom_left_right",
                  "Bottom, Left & Right borders",
                ),
              )
              .addOption(
                "top-right",
                this.plugin.t("opt_border_top_right", "Top & Right borders"),
              )
              .addOption(
                "top-left",
                this.plugin.t("opt_border_top_left", "Top & Left borders"),
              )
              .addOption(
                "bottom-right",
                this.plugin.t(
                  "opt_border_bottom_right",
                  "Bottom & Right borders",
                ),
              )
              .addOption(
                "bottom-left",
                this.plugin.t(
                  "opt_border_bottom_left",
                  "Bottom & Left borders",
                ),
              )
              .addOption(
                "top",
                this.plugin.t("opt_border_top", "Top border only"),
              )
              .addOption(
                "bottom",
                this.plugin.t("opt_border_bottom", "Bottom border only"),
              )
              .addOption(
                "left",
                this.plugin.t("opt_border_left", "Left border only"),
              )
              .addOption(
                "right",
                this.plugin.t("opt_border_right", "Right border only"),
              )
              .setValue(this.plugin.settings.borderStyle ?? "full")
              .onChange(async (v) => {
                this.plugin.settings.borderStyle = v;
                await this.debouncedSaveSettings();
                updatePreview();
              });
          });

        new Setting(ghContainer)
          .setName(this.plugin.t("border_line_style", "Border Style"))
          .setDesc(
            this.plugin.t(
              "border_line_style_desc",
              "Choose the border line style",
            ),
          )
          .addDropdown((d) => {
            d.selectEl.style.width = "200px";
            try {
              d.selectEl.style.textAlign = "center";
            } catch (e) {}
            return d
              .addOption("solid", this.plugin.t("opt_line_solid", "Solid"))
              .addOption("dashed", this.plugin.t("opt_line_dashed", "Dashed"))
              .addOption("dotted", this.plugin.t("opt_line_dotted", "Dotted"))
              .addOption("double", this.plugin.t("opt_line_double", "Double"))
              .addOption("groove", this.plugin.t("opt_line_groove", "Groove"))
              .addOption("ridge", this.plugin.t("opt_line_ridge", "Ridge"))
              .addOption("inset", this.plugin.t("opt_line_inset", "Inset"))
              .addOption("outset", this.plugin.t("opt_line_outset", "Outset"))
              .setValue(this.plugin.settings.borderLineStyle ?? "solid")
              .onChange(async (v) => {
                this.plugin.settings.borderLineStyle = v;
                await this.debouncedSaveSettings();
                updatePreview();
              });
          });

        // Border Opacity slider
        new Setting(ghContainer)
          .setName(this.plugin.t("border_opacity", "Border Opacity"))
          .setDesc(
            this.plugin.t(
              "border_opacity_desc",
              "Set the opacity of the border (0-100%)",
            ),
          )
          .addSlider((slider) =>
            slider
              .setLimits(0, 100, 1)
              .setValue(this.plugin.settings.borderOpacity ?? 100)
              .setDynamicTooltip()
              .onChange(async (v) => {
                this.plugin.settings.borderOpacity = v;
                await this.debouncedSaveSettings();
                updatePreview();
              }),
          );

        // Border Thickness input
        {
          let btInput;
          new Setting(ghContainer)
            .setName(this.plugin.t("border_thickness", "Border Thickness (px)"))
            .setDesc(
              this.plugin.t(
                "border_thickness_desc",
                "Set the border thickness from 0-5 pixels (e.g. 1, 2.5, 5)",
              ),
            )
            .addText((text) => {
              btInput = text;
              text
                .setPlaceholder("e.g. 1, 2.5, 3.7")
                .setValue(String(this.plugin.settings.borderThickness ?? 1))
                .onChange(async (v) => {
                  let val = parseFloat(v);
                  if (isNaN(val) || val < 0) val = 0;
                  if (val > 5) val = 5;
                  this.plugin.settings.borderThickness = val;
                  await this.debouncedSaveSettings();
                  updatePreview();
                });
            })
            .addExtraButton((btn) =>
              btn
                .setIcon("reset")
                .setTooltip(this.plugin.t("reset_to_1", "Reset to 1"))
                .onClick(async () => {
                  this.plugin.settings.borderThickness = 1;
                  await this.debouncedSaveSettings();
                  if (btInput) btInput.setValue("1");
                  updatePreview();
                }),
            );
        }
      }
      // }

      // --- Custom swatches settings ---
      const swHeaderDiv = containerEl.createDiv();
      swHeaderDiv.style.display = "flex";
      swHeaderDiv.style.alignItems = "center";
      swHeaderDiv.style.gap = "8px";
      swHeaderDiv.style.marginTop = "24px";
      swHeaderDiv.style.marginBottom = "10px";
      swHeaderDiv.style.cursor = "pointer";

      const swToggle = swHeaderDiv.createEl("span");
      swToggle.textContent = this.plugin.settings.colorSwatchesFolded
        ? "▶"
        : "▼";
      swToggle.style.fontSize = "12px";
      swToggle.style.fontWeight = "bold";
      swToggle.style.display = "inline-block";
      swToggle.style.width = "16px";
      swToggle.style.marginTop = "-8px";

      const swTitle = swHeaderDiv.createEl("h2", {
        text: this.plugin.t("color_swatches_header", "Color Management"),
      });
      swTitle.style.margin = "0";
      swTitle.style.marginTop = "-8px";
      swTitle.style.padding = "0";
      swTitle.style.flex = "1";

      const swContainer = containerEl.createDiv();
      swContainer.style.display = this.plugin.settings.colorSwatchesFolded
        ? "none"
        : "block";

      const swToggleHandler = async () => {
        this.plugin.settings.colorSwatchesFolded =
          !this.plugin.settings.colorSwatchesFolded;
        swContainer.style.display = this.plugin.settings.colorSwatchesFolded
          ? "none"
          : "block";
        swToggle.textContent = this.plugin.settings.colorSwatchesFolded
          ? "▶"
          : "▼";
        await this.debouncedSaveSettings();
      };

      swHeaderDiv.addEventListener("click", swToggleHandler);
      try {
        this._cleanupHandlers.push(() =>
          swHeaderDiv.removeEventListener("click", swToggleHandler),
        );
      } catch (_) {}

      new Setting(swContainer)
        .setName(this.plugin.t("color_picker_layout", "Color Picker Layout"))
        .setDesc(
          this.plugin.t(
            "color_picker_layout_desc",
            "Choose which color types to show when picking colors for text",
          ),
        )
        .addDropdown((dd) => {
          dd.addOption(
            "both",
            this.plugin.t(
              "opt_both_text_left",
              "Both: Text left, Highlight right",
            ),
          );
          dd.addOption(
            "both-bg-left",
            this.plugin.t(
              "opt_both_bg_left",
              "Both: Highlight left, Text right",
            ),
          );
          dd.addOption(
            "both-v-text-top",
            this.plugin.t(
              "opt_both_text_top",
              "Both (vertical): Text above, Highlight below",
            ),
          );
          dd.addOption(
            "both-v-bg-top",
            this.plugin.t(
              "opt_both_bg_top",
              "Both (vertical): Highlight above, Text below",
            ),
          );
          dd.addOption(
            "text",
            this.plugin.t("opt_text_only", "Text color only"),
          );
          dd.addOption(
            "background",
            this.plugin.t("opt_background_only", "Highlight color only"),
          );
          dd.setValue(this.plugin.settings.colorPickerMode || "both");
          try {
            dd.selectEl.style.minWidth = "230px";
          } catch (e) {}
          try {
            dd.selectEl.style.textAlign = "center";
          } catch (e) {}
          dd.onChange(async (v) => {
            this.plugin.settings.colorPickerMode = v;
            await this.plugin.saveSettings();
          });
        });

      new Setting(swContainer)
        .setName(
          this.plugin.t("enable_custom_swatches", "Enable custom swatches"),
        )
        .setDesc(
          this.plugin.t(
            "enable_custom_swatches_desc",
            "Turn this on if you want to pick your own colors for the color picker.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.customSwatchesEnabled)
            .onChange(async (v) => {
              this.plugin.settings.customSwatchesEnabled = v;
              await this.plugin.saveSettings();
              this._refreshCustomSwatches();
            }),
        );

      new Setting(swContainer)
        .setName(
          this.plugin.t("replace_default_swatches", "Replace default swatches"),
        )
        .setDesc(
          this.plugin.t(
            "replace_default_swatches_desc",
            "If enabled, only your custom swatches will be shown. If disabled, they will be appended to the default ones.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.replaceDefaultSwatches)
            .onChange(async (v) => {
              this.plugin.settings.replaceDefaultSwatches = v;
              await this.plugin.saveSettings();
            }),
        );

      new Setting(swContainer)
        .setName(
          this.plugin.t(
            "use_swatch_names",
            "Use swatch names for coloring text",
          ),
        )
        .setDesc(
          this.plugin.t(
            "use_swatch_names_desc",
            'If enabled, the text will be colored using the name of the swatch (e.g., "Red") instead of the hex code.',
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.useSwatchNamesForText)
            .onChange(async (v) => {
              this.plugin.settings.useSwatchNamesForText = v;
              await this.plugin.saveSettings();
            }),
        );

      new Setting(swContainer)
        .setName(
          this.plugin.t(
            "link_swatch_updates",
            "Link swatch updates to text colors",
          ),
        )
        .setDesc(
          this.plugin.t(
            "link_swatch_updates_desc",
            "If enabled, updating a swatch color will update all text colored with that swatch.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(this.plugin.settings.linkSwatchUpdatesToEntries)
            .onChange(async (v) => {
              this.plugin.settings.linkSwatchUpdatesToEntries = v;
              await this.plugin.saveSettings();
            }),
        );

      // Store reference and render custom swatches
      this._customSwatchesContainer = swContainer.createDiv();
      this._refreshCustomSwatches();

      // --- Quick Colors / Styles ---
      this._quickColorsContainer = containerEl.createDiv();
      this._refreshQuickColors();
      this._quickStylesContainer = containerEl.createDiv();
      this._refreshQuickStyles();
    }
    if (this._activeTab === "always-color-texts") {
      // --- Always Colored Texts / patterns ---
      const coloredTextsHeading = new Setting(containerEl)
        .setName(this.plugin.t("colored_texts_header", "Colored Texts"))
        .setDesc(
          this.plugin.t(
            "always_colored_texts_desc",
            "This is where you manage your words/patterns and their colors.",
          ),
        )
        .setHeading();

      try {
        coloredTextsHeading.settingEl.style.marginTop = "30px";
        coloredTextsHeading.settingEl.style.borderTop = "none";
      } catch (e) {}

      const dividerSetting = new Setting(containerEl);
      try {
        dividerSetting.settingEl.classList.add("act-section-divider");
      } catch (_) {}
      const entriesSearchContainer = containerEl.createDiv();
      try {
        entriesSearchContainer.addClass("act-search-container");
      } catch (e) {
        try {
          entriesSearchContainer.classList.add("act-search-container");
        } catch (_) {}
      }
      entriesSearchContainer.style.margin = "8px 0";
      entriesSearchContainer.style.marginTop = "-10px";
      entriesSearchContainer.style.display = "flex";
      entriesSearchContainer.style.alignItems = "center";
      entriesSearchContainer.style.gap = "8px";
      const entriesSearch = entriesSearchContainer.createEl("input", {
        type: "text",
      });
      try {
        entriesSearch.addClass("act-search-input");
      } catch (e) {
        try {
          entriesSearch.classList.add("act-search-input");
        } catch (_) {}
      }
      entriesSearch.placeholder = this.plugin.t(
        "search_colored_words_placeholder",
        "Search colored words/patterns…",
      );
      entriesSearch.style.flex = "1 1 auto";
      entriesSearch.style.padding = "6px";
      entriesSearch.style.border =
        "1px solid var(--background-modifier-border)";
      const entriesIcon = entriesSearchContainer.createDiv();
      try {
        entriesIcon.addClass("act-search-icon");
      } catch (e) {
        try {
          entriesIcon.classList.add("act-search-icon");
        } catch (_) {}
      }
      const entriesSearchHandler = () => {
        this._entriesSearchQuery = String(entriesSearch.value || "")
          .trim()
          .toLowerCase();
        try {
          this._refreshEntries();
        } catch (e) {}
      };
      entriesSearch.addEventListener("input", entriesSearchHandler);
      this._cleanupHandlers.push(() =>
        entriesSearch.removeEventListener("input", entriesSearchHandler),
      );

      // Limit/filter input beside search
      const entriesLimitInput = entriesSearchContainer.createEl("input", {
        type: "text",
      });
      entriesLimitInput.value = String(
        this.plugin.settings?.entriesSearchLimit ?? 0,
      );
      entriesLimitInput.placeholder = this.plugin.t(
        "limit_input_placeholder",
        "limit",
      );
      entriesLimitInput.title = this.plugin.t(
        "limit_input_tooltip",
        "0=all; number=last N; r=regex; w=words; h=highlight; c=text; b=text+bg; sw=starts; ew=ends; e=exact",
      );
      entriesLimitInput.style.width = "64px";
      entriesLimitInput.style.padding = "6px";
      entriesLimitInput.style.border =
        "1px solid var(--background-modifier-border)";
      entriesLimitInput.style.borderRadius = "var(--input-radius)";
      const entriesLimitHandler = () => {
        const raw = String(entriesLimitInput.value || "")
          .trim()
          .toLowerCase();
        const parts = raw.split(/\s+/).filter(Boolean);
        const numPart = parts.find((p) => /^\d+$/.test(p));
        const num = numPart ? parseInt(numPart, 10) : NaN;
        this._entriesLimit = !isNaN(num) && num >= 0 ? num : 0;
        try {
          this.plugin.settings.entriesSearchLimit = this._entriesLimit;
          this.debouncedSaveSettings();
        } catch (e) {}
        this._entriesRegexOnly = false;
        this._entriesWordsOnly = false;
        this._filterMode = null;
        this._entriesSearchMatch = "contains";
        this._entriesMatchTypeStartsWith = false;
        this._entriesMatchTypeEndsWith = false;
        this._entriesMatchTypeExact = false;
        for (const tok of parts) {
          if (tok === "r") this._entriesRegexOnly = true;
          else if (tok === "w") this._entriesWordsOnly = true;
          else if (tok === "h") this._filterMode = "highlight";
          else if (tok === "c") this._filterMode = "text";
          else if (tok === "b") this._filterMode = "both";
          else if (tok === "sw") this._entriesMatchTypeStartsWith = true;
          else if (tok === "ew") this._entriesMatchTypeEndsWith = true;
          else if (tok === "e") this._entriesMatchTypeExact = true;
        }
        try {
          this._refreshEntries();
        } catch (e) {}
      };
      entriesLimitInput.addEventListener("input", entriesLimitHandler);
      this._cleanupHandlers.push(() =>
        entriesLimitInput.removeEventListener("input", entriesLimitHandler),
      );

      const listDiv = containerEl.createDiv();
      listDiv.addClass("color-words-list");
      // Populate initial entries list via shared refresh helper
      try {
        this._refreshEntries();
      } catch (e) {}

      // Create a custom button row with sort and add buttons side by side
      const buttonRowDiv = containerEl.createDiv();
      buttonRowDiv.addClass("entries-button-row");

      // Sort button (left side) - now cycles through multiple sort modes
      const sortBtn = buttonRowDiv.createEl("button");
      const sortModes = [
        "last-added",
        "a-z",
        "reverse-a-z",
        "style-order",
        "color",
      ];
      const sortLabels = {
        "last-added": this.plugin.t(
          "sort_label_last-added",
          "Sort: Last Added",
        ),
        "a-z": this.plugin.t("sort_label_a-z", "Sort: A-Z"),
        "reverse-a-z": this.plugin.t("sort_label_reverse-a-z", "Sort: Z-A"),
        "style-order": this.plugin.t(
          "sort_label_style-order",
          "Sort: Style Order",
        ),
        color: this.plugin.t("sort_label_color", "Sort: Color"),
      };
      sortBtn.textContent = this.plugin.t(
        "sort_label_" + (this._wordsSortMode || "last-added"),
        sortLabels[this._wordsSortMode] || "Sort: Last Added",
      );
      sortBtn.style.cursor = "pointer";
      sortBtn.style.flex = "0 0 auto";
      const sortBtnHandler = async () => {
        // Cycle through sort modes
        const currentIndex = sortModes.indexOf(this._wordsSortMode);
        const nextIndex = (currentIndex + 1) % sortModes.length;
        this._wordsSortMode = sortModes[nextIndex];
        sortBtn.textContent = sortLabels[this._wordsSortMode];
        try {
          this.plugin.settings.wordsSortMode = this._wordsSortMode;
          await this.plugin.saveSettings();
        } catch (e) {}
        this._suspendSorting = false;
        this._refreshEntries();
      };
      sortBtn.addEventListener("click", sortBtnHandler);
      this._cleanupHandlers.push(() =>
        sortBtn.removeEventListener("click", sortBtnHandler),
      );

      // Add Words button (right side)
      const addWordsBtn = buttonRowDiv.createEl("button");
      addWordsBtn.textContent = this.plugin.t("btn_add_words", "+ Add Words");
      addWordsBtn.style.cursor = "pointer";
      addWordsBtn.style.flex = "1";
      addWordsBtn.addClass("mod-cta");
      const addWordsHandler = async () => {
        const uid = (() => {
          try {
            return (
              Date.now().toString(36) + Math.random().toString(36).slice(2)
            );
          } catch (e) {
            return Date.now();
          }
        })();
        this.plugin.settings.wordEntries.push({
          pattern: "",
          color: "",
          isRegex: false,
          flags: "",
          groupedPatterns: null,
          styleType: "text",
          uid,
          persistAtEnd: true,
          matchType: this.plugin.settings.partialMatch ? "contains" : "exact",
        });
        this._suspendSorting = this._wordsSortMode === "last-added";
        try {
          this._newEntriesSet && this._newEntriesSet.add(uid);
        } catch (e) {}
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.forceRefreshAllReadingViews();
        this._refreshEntries();
      };
      addWordsBtn.addEventListener("click", addWordsHandler);
      this._cleanupHandlers.push(() =>
        addWordsBtn.removeEventListener("click", addWordsHandler),
      );

      // Add Regex button (beside Add Words)
      const addRegexBtn = buttonRowDiv.createEl("button");
      addRegexBtn.textContent = this.plugin.t("btn_add_regex", "+ Add Regex");
      addRegexBtn.style.cursor = "pointer";
      addRegexBtn.style.flex = "1";
      addRegexBtn.addClass("mod-cta");
      addRegexBtn.style.display = this.plugin.settings.enableRegexSupport
        ? ""
        : "none";
      const addRegexHandler = () => {
        try {
          this._suspendSorting = this._wordsSortMode === "last-added";
          const onAdded = (entry) => {
            try {
              if (entry && entry.uid) {
                this._newEntriesSet && this._newEntriesSet.add(entry.uid);
              }
              this._refreshEntries();
            } catch (e) {}
          };
          new RealTimeRegexTesterModal(this.app, this.plugin, onAdded).open();
        } catch (e) {}
      };
      addRegexBtn.addEventListener("click", addRegexHandler);
      this._cleanupHandlers.push(() =>
        addRegexBtn.removeEventListener("click", addRegexHandler),
      );

      const presetsBtn = buttonRowDiv.createEl("button");
      presetsBtn.textContent = this.plugin.t("btn_presets", "Presets");
      presetsBtn.style.cursor = "pointer";
      presetsBtn.style.flex = "0 0 auto";
      const presetsHandler = () => {
        if (!this.plugin.settings.enableRegexSupport) {
          new AlertModal(
            this.app,
            this.plugin,
            this.plugin.t("regex_support", "Regex Support"),
            this.plugin.t("notice_regex_support_disabled"),
            {
              text: this.plugin.t("btn_take_me_there", "Take me there"),
              callback: () => {
                this.plugin.openSettingsAndFocusRegex();
              },
            },
          ).open();
          return;
        }
        new PresetModal(this.app, this.plugin, async (preset) => {
          if (!preset) return;
          new ColorPickerModal(
            this.app,
            this.plugin,
            async (color, result) => {
              const sel = result || {};
              const tc =
                sel.textColor && this.plugin.isValidHexColor(sel.textColor)
                  ? sel.textColor
                  : null;
              const bc =
                sel.backgroundColor &&
                this.plugin.isValidHexColor(sel.backgroundColor)
                  ? sel.backgroundColor
                  : null;
              if (!tc && !bc && (!color || !this.plugin.isValidHexColor(color)))
                return;
              const entry = {
                pattern: preset.pattern,
                isRegex: true,
                flags: preset.flags || "",
                groupedPatterns: null,
                presetLabel: preset.label,
                persistAtEnd: true,
                matchType: this.plugin.settings.partialMatch
                  ? "contains"
                  : "exact",
              };
              // Copy preset properties like affectMarkElements and targetElement
              if (preset.affectMarkElements) entry.affectMarkElements = true;
              if (preset.targetElement)
                entry.targetElement = preset.targetElement;
              try {
                entry.uid =
                  Date.now().toString(36) + Math.random().toString(36).slice(2);
              } catch (e) {
                entry.uid = Date.now();
              }
              if (tc && bc) {
                entry.textColor = tc;
                entry.backgroundColor = bc;
                entry.color = "";
                entry.styleType = "both";
                entry._savedTextColor = tc;
                entry._savedBackgroundColor = bc;
              } else if (tc) {
                entry.color = tc;
                entry.styleType = "text";
                entry._savedTextColor = tc;
              } else if (bc) {
                entry.textColor = "currentColor";
                entry.backgroundColor = bc;
                entry.color = "";
                entry.styleType = "highlight";
                entry._savedBackgroundColor = bc;
              } else {
                entry.color = color;
                entry._savedTextColor = color;
              }
              this.plugin.settings.wordEntries.push(entry);
              this._suspendSorting = this._wordsSortMode === "last-added";
              try {
                this._newEntriesSet &&
                  entry &&
                  entry.uid &&
                  this._newEntriesSet.add(entry.uid);
              } catch (e) {}
              await this.plugin.saveSettings();
              this.plugin.compileWordEntries();
              this.plugin.compileTextBgColoringEntries();
              this.plugin.reconfigureEditorExtensions();
              this.plugin.forceRefreshAllEditors();
              this.plugin.forceRefreshAllReadingViews();
              this._refreshEntries();
            },
            "text-and-background",
            "",
            false,
          ).open();
        }).open();
      };
      presetsBtn.addEventListener("click", presetsHandler);
      this._cleanupHandlers.push(() =>
        presetsBtn.removeEventListener("click", presetsHandler),
      );

      const deleteAllWordsSetting = new Setting(containerEl).addExtraButton(
        (b) =>
          b
            .setIcon("trash")
            .setTooltip(
              this.plugin.t(
                "tooltip_delete_all_words",
                "Delete all defined words/patterns",
              ),
            )
            .onClick(async () => {
              new ConfirmationModal(
                this.app,
                this.plugin,
                this.plugin.t("confirm_delete_all_title", "Delete all words"),
                this.plugin.t(
                  "confirm_delete_all_desc",
                  "Are you sure you want to delete all your colored words/patterns? You can't undo this!",
                ),
                async () => {
                  this.plugin.settings.wordEntries = [];
                  await this.plugin.saveSettings();
                  this.plugin.reconfigureEditorExtensions();
                  this.plugin.forceRefreshAllEditors();
                  this._refreshEntries();
                },
              ).open();
            }),
      );
      try {
        deleteAllWordsSetting.settingEl.classList.add(
          "act-delete-groups-setting",
        );
      } catch (_) {}

      // --- Grouped Entries ---
      containerEl.createEl("h3", {
        text: this.plugin.t("grouped_entries_header", "Grouped Entries"),
      });
      // containerEl.createEl('p', { text: this.plugin.t('grouped_entries_desc','Manage your word groups. Use search to filter by name.') });
      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "hide_inactive_groups_in_dropdowns",
            "Hide Inactive Groups in Dropdowns",
          ),
        )
        .setDesc(
          this.plugin.t(
            "hide_inactive_groups_in_dropdowns_desc",
            "Hide inactive word groups when displaying group lists in dropdowns.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(!!this.plugin.settings.hideInactiveGroupsInDropdowns)
            .onChange(async (v) => {
              this.plugin.settings.hideInactiveGroupsInDropdowns = !!v;
              await this.plugin.saveSettings();
            }),
        );

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "show_word_groups_in_commands",
            "Show word groups in commands",
          ),
        )
        .setDesc(
          this.plugin.t(
            "show_word_groups_in_commands_desc",
            "When enabled, word groups appear in the command palette with Activate/Deactivate commands.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(!!this.plugin.settings.showWordGroupsInCommands)
            .onChange(async (v) => {
              this.plugin.settings.showWordGroupsInCommands = !!v;
              await this.plugin.saveSettings();
              // Re-register commands to show/hide word group commands
              this.plugin.reregisterCommandsWithLanguage();
            }),
        );
      const groupSearchContainer = containerEl.createDiv();
      try {
        groupSearchContainer.addClass("act-search-container");
      } catch (e) {
        try {
          groupSearchContainer.classList.add("act-search-container");
        } catch (_) {}
      }
      groupSearchContainer.style.margin = "8px 0";
      groupSearchContainer.style.display = "flex";
      groupSearchContainer.style.alignItems = "center";
      groupSearchContainer.style.gap = "8px";
      const groupSearch = groupSearchContainer.createEl("input", {
        type: "text",
      });
      try {
        groupSearch.addClass("act-search-input");
      } catch (e) {
        try {
          groupSearch.classList.add("act-search-input");
        } catch (_) {}
      }
      groupSearch.placeholder = this.plugin.t(
        "search_groups_placeholder",
        "Search groups…",
      );
      groupSearch.style.flex = "1 1 auto";
      groupSearch.style.padding = "6px";
      groupSearch.style.border = "1px solid var(--background-modifier-border)";
      groupSearch.addEventListener("input", () => {
        this._groupSearch = groupSearch.value || "";
        this._refreshGroups();
      });
      const groupIcon = groupSearchContainer.createDiv();
      try {
        groupIcon.addClass("act-search-icon");
      } catch (e) {
        try {
          groupIcon.classList.add("act-search-icon");
        } catch (_) {}
      }

      const groupsContainer = containerEl.createDiv();
      groupsContainer.addClass("act-groups-container");
      this._refreshGroups();

      // Create a container for both buttons in one row
      const groupButtonsContainer = containerEl.createDiv();
      groupButtonsContainer.style.display = "flex";
      groupButtonsContainer.style.gap = "8px";
      groupButtonsContainer.style.marginTop = "10px";
      groupButtonsContainer.style.justifyContent = "space-between";

      const btnCreateGroup = groupButtonsContainer.createEl("button", {
        text: this.plugin.t("btn_create_new_group", "+ Create New Group"),
      });
      btnCreateGroup.addClass("mod-cta");
      btnCreateGroup.onclick = async () => {
        if (!this.plugin.settings.wordEntryGroups)
          this.plugin.settings.wordEntryGroups = [];
        const newGroup = {
          active: true,
          name: "",
          entries: [],
          enableFolders: [],
          disableFolders: [],
          enableTags: [],
          disableTags: [],
        };
        try {
          newGroup.uid =
            Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (_) {}
        this.plugin.settings.wordEntryGroups.push(newGroup);
        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        try {
          new EditWordGroupModal(
            this.app,
            this.plugin,
            newGroup,
            async (updatedGroup) => {
              const idx = this.plugin.settings.wordEntryGroups.findIndex(
                (g) => g && g.uid === newGroup.uid,
              );
              if (idx !== -1) {
                this.plugin.settings.wordEntryGroups[idx] = updatedGroup;
              }
              await this.plugin.saveSettings();
              this.plugin.compileWordEntries();
              this.plugin.reconfigureEditorExtensions();
              this.plugin.forceRefreshAllEditors();
              this.plugin.forceRefreshAllReadingViews();
              this._refreshGroups();
            },
            async (groupToDelete) => {
              const actualIndex =
                this.plugin.settings.wordEntryGroups.findIndex(
                  (g) => g && g.uid === groupToDelete.uid,
                );
              if (actualIndex !== -1) {
                this.plugin.settings.wordEntryGroups.splice(actualIndex, 1);
              }
              await this.plugin.saveSettings();
              this.plugin.compileWordEntries();
              this.plugin.reconfigureEditorExtensions();
              this.plugin.forceRefreshAllEditors();
              this.plugin.forceRefreshAllReadingViews();
              this._refreshGroups();
            },
          ).open();
        } catch (_) {
          this._refreshGroups();
        }
      };

      new Setting(groupButtonsContainer)
        .addExtraButton((b) =>
          b
            .setIcon("trash")
            .setTooltip(
              this.plugin.t(
                "tooltip_delete_all_groups",
                "Delete all Word Groups",
              ),
            )
            .onClick(async () => {
              new ConfirmationModal(
                this.app,
                this.plugin,
                this.plugin.t(
                  "confirm_delete_all_groups_title",
                  "Delete All Word Groups",
                ),
                this.plugin.t(
                  "confirm_delete_all_groups_desc",
                  "Are you sure you want to delete ALL word groups? This cannot be undone!",
                ),
                async () => {
                  this.plugin.settings.wordEntryGroups = [];
                  await this.plugin.saveSettings();
                  this.plugin.compileWordEntries();
                  this.plugin.reconfigureEditorExtensions();
                  this.plugin.forceRefreshAllEditors();
                  this.plugin.forceRefreshAllReadingViews();
                  this._refreshGroups();
                },
              ).open();
            }),
        )
        .then((setting) => {
          setting.settingEl.classList.add("act-delete-groups-setting");
        });

      // groupsContainer and button rendered above
    }
    if (this._activeTab === "blacklist") {
      // Blacklist words
      const blacklistsHeading = new Setting(containerEl)
        .setName(this.plugin.t("blacklist_words_header", "Blacklists"))
        .setDesc(
          this.plugin.t(
            "blacklist_words_desc",
            "Keywords or patterns here will never be colored, even for partial matches.",
          ),
        )
        .setHeading();

      try {
        blacklistsHeading.settingEl.style.marginTop = "30px";
        blacklistsHeading.settingEl.style.borderTop = "none";
      } catch (e) {}

      // Search bar for Blacklist entries
      const blSearchContainer = containerEl.createDiv();
      try {
        blSearchContainer.addClass("act-search-container");
      } catch (e) {
        try {
          blSearchContainer.classList.add("act-search-container");
        } catch (_) {}
      }
      blSearchContainer.style.margin = "8px 0";
      blSearchContainer.style.display = "flex";
      blSearchContainer.style.alignItems = "center";
      blSearchContainer.style.gap = "8px";
      const blSearch = blSearchContainer.createEl("input", { type: "text" });
      try {
        blSearch.addClass("act-search-input");
      } catch (e) {
        try {
          blSearch.classList.add("act-search-input");
        } catch (_) {}
      }
      blSearch.placeholder = this.plugin.t(
        "search_blacklist_placeholder",
        "Search blacklisted words or patterns…",
      );
      blSearch.style.flex = "1 1 auto";
      blSearch.style.padding = "6px";
      blSearch.style.border = "1px solid var(--background-modifier-border)";
      const blIcon = blSearchContainer.createDiv();
      try {
        blIcon.addClass("act-search-icon");
      } catch (e) {
        try {
          blIcon.classList.add("act-search-icon");
        } catch (_) {}
      }
      const blSearchHandler = () => {
        this._blacklistSearchQuery = String(blSearch.value || "")
          .trim()
          .toLowerCase();
        try {
          this._refreshBlacklistWords();
        } catch (e) {}
      };
      blSearch.addEventListener("input", blSearchHandler);
      this._cleanupHandlers.push(() =>
        blSearch.removeEventListener("input", blSearchHandler),
      );

      // Limit/filter input for blacklist
      const blLimitInput = blSearchContainer.createEl("input", {
        type: "text",
      });
      blLimitInput.value = String(
        this.plugin.settings?.blacklistSearchLimit ?? 0,
      );
      blLimitInput.placeholder = this.plugin.t(
        "limit_input_placeholder",
        "limit",
      );
      blLimitInput.title = this.plugin.t(
        "limit_input_tooltip",
        "0=all; number=last N; r=regex; w=words; sw=starts; ew=ends; e=exact",
      );
      blLimitInput.style.width = "64px";
      blLimitInput.style.padding = "6px";
      blLimitInput.style.border = "1px solid var(--background-modifier-border)";
      blLimitInput.style.borderRadius = "var(--input-radius)";
      const blLimitHandler = () => {
        const raw = String(blLimitInput.value || "")
          .trim()
          .toLowerCase();
        const parts = raw.split(/\s+/).filter(Boolean);
        const numPart = parts.find((p) => /^\d+$/.test(p));
        const num = numPart ? parseInt(numPart, 10) : NaN;
        this._blacklistLimit = !isNaN(num) && num >= 0 ? num : 0;
        this._blacklistRegexOnly = false;
        this._blacklistWordsOnly = false;
        this._blacklistSearchMatchStarts = false;
        this._blacklistSearchMatchEnds = false;
        this._blacklistSearchMatchExact = false;
        for (const tok of parts) {
          if (tok === "r") this._blacklistRegexOnly = true;
          else if (tok === "w") this._blacklistWordsOnly = true;
          else if (tok === "sw") this._blacklistSearchMatchStarts = true;
          else if (tok === "ew") this._blacklistSearchMatchEnds = true;
          else if (tok === "e") this._blacklistSearchMatchExact = true;
        }
        try {
          this.plugin.settings.blacklistSearchLimit = this._blacklistLimit;
          this.debouncedSaveSettings();
        } catch (e) {}
        try {
          this._refreshBlacklistWords();
        } catch (e) {}
      };
      blLimitInput.addEventListener("input", blLimitHandler);
      this._cleanupHandlers.push(() =>
        blLimitInput.removeEventListener("input", blLimitHandler),
      );

      // Store reference to blacklist words container for updating
      this._blacklistWordsContainer = containerEl.createDiv();
      this._blacklistWordsContainer.addClass("blacklist-words-list");
      this._refreshBlacklistWords();

      const blacklistButtonRowDiv = containerEl.createDiv();
      blacklistButtonRowDiv.addClass("blacklist-button-row");

      const blacklistSortBtn = blacklistButtonRowDiv.createEl("button");
      const blSortModes = ["last-added", "a-z", "reverse-a-z"];
      const blSortLabels = {
        "last-added": this.plugin.t(
          "blacklist_sort_label_last-added",
          "Sort: Last Added",
        ),
        "a-z": this.plugin.t("blacklist_sort_label_a-z", "Sort: A-Z"),
        "reverse-a-z": this.plugin.t(
          "blacklist_sort_label_reverse-a-z",
          "Sort: Z-A",
        ),
      };
      blacklistSortBtn.textContent =
        blSortLabels[this._blacklistSortMode] || "Sort: Last Added";
      blacklistSortBtn.style.cursor = "pointer";
      blacklistSortBtn.style.flex = "0 0 auto";
      const blacklistSortHandler = async () => {
        const i = blSortModes.indexOf(this._blacklistSortMode);
        const ni = (i + 1) % blSortModes.length;
        this._blacklistSortMode = blSortModes[ni];
        blacklistSortBtn.textContent = blSortLabels[this._blacklistSortMode];
        try {
          this.plugin.settings.blacklistSortMode = this._blacklistSortMode;
          await this.plugin.saveSettings();
        } catch (e) {}
        this._refreshBlacklistWords();
      };
      blacklistSortBtn.addEventListener("click", blacklistSortHandler);
      this._cleanupHandlers.push(() =>
        blacklistSortBtn.removeEventListener("click", blacklistSortHandler),
      );

      const blacklistAddBtn = blacklistButtonRowDiv.createEl("button");
      blacklistAddBtn.textContent = this.plugin.t(
        "btn_add_blacklist_word",
        "+ Add blacklist word",
      );
      blacklistAddBtn.style.cursor = "pointer";
      blacklistAddBtn.style.flex = "1";
      blacklistAddBtn.addClass("mod-cta");
      const blacklistAddHandler = async () => {
        const uid = (() => {
          try {
            return (
              Date.now().toString(36) + Math.random().toString(36).slice(2)
            );
          } catch (e) {
            return Date.now();
          }
        })();
        const newEntry = {
          pattern: "",
          isRegex: false,
          flags: "",
          groupedPatterns: null,
          uid,
          persistAtEnd: true,
        };
        if (!Array.isArray(this.plugin.settings.blacklistEntries))
          this.plugin.settings.blacklistEntries = [];
        this.plugin.settings.blacklistEntries.push(newEntry);
        this._suspendSorting = this._blacklistSortMode === "last-added";
        try {
          this._blacklistNewSet && this._blacklistNewSet.add(uid);
        } catch (e) {}
        await this.plugin.saveSettings();
        this._refreshBlacklistWords();
      };
      blacklistAddBtn.addEventListener("click", blacklistAddHandler);
      this._cleanupHandlers.push(() =>
        blacklistAddBtn.removeEventListener("click", blacklistAddHandler),
      );

      const blacklistAddRegexBtn = blacklistButtonRowDiv.createEl("button");
      blacklistAddRegexBtn.textContent = this.plugin.t(
        "btn_add_blacklist_regex",
        "+ Add blacklist regex",
      );
      blacklistAddRegexBtn.style.cursor = "pointer";
      blacklistAddRegexBtn.style.flex = "1";
      blacklistAddRegexBtn.addClass("mod-cta");
      blacklistAddRegexBtn.style.display = this.plugin.settings
        .enableRegexSupport
        ? ""
        : "none";
      const blacklistAddRegexHandler = () => {
        try {
          const onAdded = (entry) => {
            try {
              if (entry && entry.uid) {
                this._blacklistNewSet && this._blacklistNewSet.add(entry.uid);
              }
              this._refreshBlacklistWords();
            } catch (e) {}
          };
          new BlacklistRegexTesterModal(this.app, this.plugin, onAdded).open();
        } catch (e) {}
      };
      blacklistAddRegexBtn.addEventListener("click", blacklistAddRegexHandler);
      this._cleanupHandlers.push(() =>
        blacklistAddRegexBtn.removeEventListener(
          "click",
          blacklistAddRegexHandler,
        ),
      );

      const blacklistPresetsBtn = blacklistButtonRowDiv.createEl("button");
      blacklistPresetsBtn.textContent = this.plugin.t("btn_presets", "Presets");
      blacklistPresetsBtn.style.cursor = "pointer";
      blacklistPresetsBtn.style.flex = "0 0 auto";
      const blacklistPresetsHandler = () => {
        if (!this.plugin.settings.enableRegexSupport) {
          new AlertModal(
            this.app,
            this.plugin,
            this.plugin.t("regex_support", "Regex Support"),
            this.plugin.t("notice_regex_support_disabled"),
            {
              text: this.plugin.t("btn_take_me_there", "Take me there"),
              callback: () => {
                this.plugin.openSettingsAndFocusRegex();
              },
            },
          ).open();
          return;
        }
        new PresetModal(this.app, this.plugin, async (preset) => {
          if (!preset) return;
          const newEntry = {
            pattern: preset.pattern,
            isRegex: true,
            flags: preset.flags || "",
            groupedPatterns: null,
            presetLabel: preset.label,
            persistAtEnd: true,
            targetElement: preset.targetElement,
          };
          try {
            newEntry.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (e) {
            newEntry.uid = Date.now();
          }
          if (!Array.isArray(this.plugin.settings.blacklistEntries))
            this.plugin.settings.blacklistEntries = [];
          this.plugin.settings.blacklistEntries.push(newEntry);
          this._suspendSorting = this._blacklistSortMode === "last-added";
          try {
            this._blacklistNewSet &&
              newEntry &&
              newEntry.uid &&
              this._blacklistNewSet.add(newEntry.uid);
          } catch (e) {}
          await this.plugin.saveSettings();
          this._refreshBlacklistWords();
        }).open();
      };
      blacklistPresetsBtn.addEventListener("click", blacklistPresetsHandler);
      this._cleanupHandlers.push(() =>
        blacklistPresetsBtn.removeEventListener(
          "click",
          blacklistPresetsHandler,
        ),
      );

      const deleteAllBlacklistSetting = new Setting(containerEl).addExtraButton(
        (b) =>
          b
            .setIcon("trash")
            .setTooltip(
              this.plugin.t(
                "tooltip_delete_all_blacklist",
                "Delete all blacklisted words/patterns",
              ),
            )
            .onClick(async () => {
              new ConfirmationModal(
                this.app,
                this.plugin,
                this.plugin.t(
                  "confirm_delete_all_blacklist_title",
                  "Delete all blacklisted words",
                ),
                this.plugin.t(
                  "confirm_delete_all_blacklist_desc",
                  "Are you sure you want to delete all blacklist entries? You can't undo this!",
                ),
                async () => {
                  this.plugin.settings.blacklistEntries = [];
                  await this.plugin.saveSettings();
                  this._refreshBlacklistWords();
                },
              ).open();
            }),
      );
      try {
        deleteAllBlacklistSetting.settingEl.classList.add(
          "act-delete-groups-setting",
        );
      } catch (_) {}

      // --- Blacklist Group Entries ---
      containerEl.createEl("h3", {
        text: this.plugin.t(
          "blacklist_grouped_entries_header",
          "Blacklist Group Entries",
        ),
      });

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "show_blacklist_groups_in_commands",
            "Show blacklist groups in commands",
          ),
        )
        .setDesc(
          this.plugin.t(
            "show_blacklist_groups_in_commands_desc",
            "When enabled, blacklist groups appear in the command palette with Activate/Deactivate commands.",
          ),
        )
        .addToggle((t) =>
          t
            .setValue(!!this.plugin.settings.showBlacklistGroupsInCommands)
            .onChange(async (v) => {
              this.plugin.settings.showBlacklistGroupsInCommands = !!v;
              await this.plugin.saveSettings();
              // Re-register commands to show/hide blacklist group commands
              this.plugin.reregisterCommandsWithLanguage();
            }),
        );

      const blGroupSearchContainer = containerEl.createDiv();
      try {
        blGroupSearchContainer.addClass("act-search-container");
      } catch (e) {
        try {
          blGroupSearchContainer.classList.add("act-search-container");
        } catch (_) {}
      }
      blGroupSearchContainer.style.margin = "8px 0";
      blGroupSearchContainer.style.display = "flex";
      blGroupSearchContainer.style.alignItems = "center";
      blGroupSearchContainer.style.gap = "8px";
      const blGroupSearch = blGroupSearchContainer.createEl("input", {
        type: "text",
      });
      try {
        blGroupSearch.addClass("act-search-input");
      } catch (e) {
        try {
          blGroupSearch.classList.add("act-search-input");
        } catch (_) {}
      }
      blGroupSearch.placeholder = this.plugin.t(
        "search_blacklist_groups_placeholder",
        "Search blacklist groups…",
      );
      blGroupSearch.style.flex = "1 1 auto";
      blGroupSearch.style.padding = "6px";
      blGroupSearch.style.border =
        "1px solid var(--background-modifier-border)";
      blGroupSearch.addEventListener("input", () => {
        this._blacklistGroupSearch = blGroupSearch.value || "";
        this._refreshBlacklistGroups();
      });
      const blGroupIcon = blGroupSearchContainer.createDiv();
      try {
        blGroupIcon.addClass("act-search-icon");
      } catch (e) {
        try {
          blGroupIcon.classList.add("act-search-icon");
        } catch (_) {}
      }

      const blGroupsContainer = containerEl.createDiv();
      blGroupsContainer.addClass("act-blacklist-groups-container");
      this._blacklistGroupsContainer = blGroupsContainer;
      this._refreshBlacklistGroups();

      // Create a container for both buttons in one row
      const blGroupButtonsContainer = containerEl.createDiv();
      blGroupButtonsContainer.style.display = "flex";
      blGroupButtonsContainer.style.gap = "8px";
      blGroupButtonsContainer.style.marginTop = "10px";
      blGroupButtonsContainer.style.justifyContent = "space-between";

      const btnCreateBlacklistGroup = blGroupButtonsContainer.createEl(
        "button",
        {
          text: this.plugin.t(
            "btn_create_new_blacklist_group",
            "+ Create New Blacklist Group",
          ),
        },
      );
      btnCreateBlacklistGroup.addClass("mod-cta");
      btnCreateBlacklistGroup.onclick = async () => {
        if (!this.plugin.settings.blacklistEntryGroups)
          this.plugin.settings.blacklistEntryGroups = [];
        const newGroup = {
          active: true,
          name: "",
          entries: [],
        };
        try {
          newGroup.uid =
            Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (_) {}
        this.plugin.settings.blacklistEntryGroups.push(newGroup);
        await this.plugin.saveSettings();
        try {
          new EditBlacklistGroupModal(
            this.app,
            this.plugin,
            newGroup,
            async (updatedGroup) => {
              const idx = this.plugin.settings.blacklistEntryGroups.findIndex(
                (g) => g && g.uid === newGroup.uid,
              );
              if (idx !== -1) {
                this.plugin.settings.blacklistEntryGroups[idx] = updatedGroup;
              }
              await this.plugin.saveSettings();
              if (this.plugin.settings.showBlacklistGroupsInCommands)
                this.plugin.reregisterCommandsWithLanguage();
              this._refreshBlacklistGroups();
            },
            async (groupToDelete) => {
              const actualIndex =
                this.plugin.settings.blacklistEntryGroups.findIndex(
                  (g) => g && g.uid === groupToDelete.uid,
                );
              if (actualIndex !== -1) {
                this.plugin.settings.blacklistEntryGroups.splice(
                  actualIndex,
                  1,
                );
              }
              await this.plugin.saveSettings();
              if (this.plugin.settings.showBlacklistGroupsInCommands)
                this.plugin.reregisterCommandsWithLanguage();
              this._refreshBlacklistGroups();
            },
          ).open();
        } catch (_) {
          this._refreshBlacklistGroups();
        }
      };

      new Setting(blGroupButtonsContainer)
        .addExtraButton((b) =>
          b
            .setIcon("trash")
            .setTooltip(
              this.plugin.t(
                "tooltip_delete_all_blacklist_groups",
                "Delete all Blacklist Groups",
              ),
            )
            .onClick(async () => {
              new ConfirmationModal(
                this.app,
                this.plugin,
                this.plugin.t(
                  "confirm_delete_all_blacklist_groups_title",
                  "Delete All Blacklist Groups",
                ),
                this.plugin.t(
                  "confirm_delete_all_blacklist_groups_desc",
                  "Are you sure you want to delete ALL blacklist groups? This cannot be undone!",
                ),
                async () => {
                  this.plugin.settings.blacklistEntryGroups = [];
                  await this.plugin.saveSettings();
                  if (this.plugin.settings.showBlacklistGroupsInCommands)
                    this.plugin.reregisterCommandsWithLanguage();
                  this._refreshBlacklistGroups();
                },
              ).open();
            }),
        )
        .then((setting) => {
          setting.settingEl.classList.add("act-delete-groups-setting");
        });
    }
    if (this._activeTab === "file-folder-rules") {
      const pathRulesHeading = new Setting(containerEl)
        .setName(
          this.plugin.t(
            "file_folder_rules_header",
            "File & Folder Coloring Rules",
          ),
        )
        .setDesc(
          this.plugin.t(
            "file_folder_rules_desc",
            "Control coloring with name matching, exact paths, or regex patterns. Leave an empty exclude entry to disable coloring vault-wide.",
          ),
        )
        .setHeading();

      try {
        pathRulesHeading.settingEl.style.marginTop = "30px";
        pathRulesHeading.settingEl.style.borderTop = "none";
      } catch (e) {}
      // Search bar for Path rules
      const prSearchContainer = containerEl.createDiv();
      try {
        prSearchContainer.addClass("act-search-container");
      } catch (e) {
        try {
          prSearchContainer.classList.add("act-search-container");
        } catch (_) {}
      }
      prSearchContainer.style.margin = "8px 0";
      prSearchContainer.style.display = "flex";
      prSearchContainer.style.alignItems = "center";
      prSearchContainer.style.gap = "8px";
      const prSearch = prSearchContainer.createEl("input", { type: "text" });
      try {
        prSearch.addClass("act-search-input");
      } catch (e) {
        try {
          prSearch.classList.add("act-search-input");
        } catch (_) {}
      }
      prSearch.placeholder = this.plugin.t(
        "search_file_folder_rules_placeholder",
        "Search file/folder rules…",
      );
      prSearch.style.flex = "1 1 auto";
      prSearch.style.padding = "6px";
      prSearch.style.border = "1px solid var(--background-modifier-border)";
      const prIcon = prSearchContainer.createDiv();
      try {
        prIcon.addClass("act-search-icon");
      } catch (e) {
        try {
          prIcon.classList.add("act-search-icon");
        } catch (_) {}
      }
      const prSearchHandler = () => {
        this._pathRulesSearchQuery = String(prSearch.value || "")
          .trim()
          .toLowerCase();
        try {
          this._refreshPathRules();
        } catch (e) {}
      };
      prSearch.addEventListener("input", prSearchHandler);
      prSearch.addEventListener("click", prSearchHandler);
      this._cleanupHandlers.push(() =>
        prSearch.removeEventListener("input", prSearchHandler),
      );

      // Limit/filter input for path rules
      const prLimitInput = prSearchContainer.createEl("input", {
        type: "text",
      });
      prLimitInput.value = String(this.plugin.settings?.pathSearchLimit ?? 0);
      prLimitInput.placeholder = this.plugin.t(
        "limit_input_placeholder",
        "limit",
      );
      prLimitInput.title = this.plugin.t(
        "limit_input_tooltip",
        "0=all; number=last N; in=include; ex=exclude; sw=starts; ew=ends; e=exact",
      );
      prLimitInput.style.width = "64px";
      prLimitInput.style.padding = "6px";
      prLimitInput.style.border = "1px solid var(--background-modifier-border)";
      prLimitInput.style.borderRadius = "var(--input-radius)";
      const prLimitHandler = () => {
        const raw = String(prLimitInput.value || "")
          .trim()
          .toLowerCase();
        const parts = raw.split(/\s+/).filter(Boolean);
        const numPart = parts.find((p) => /^\d+$/.test(p));
        const num = numPart ? parseInt(numPart, 10) : NaN;
        this._pathLimit = !isNaN(num) && num >= 0 ? num : 0;
        this._pathModeOnly = null;
        for (const tok of parts) {
          if (tok === "in") this._pathModeOnly = "include";
          else if (tok === "ex") this._pathModeOnly = "exclude";
        }
        try {
          this.plugin.settings.pathSearchLimit = this._pathLimit;
          this.debouncedSaveSettings();
        } catch (e) {}
        this._pathSearchMatch = "contains";
        for (const tok of parts) {
          if (tok === "sw") this._pathSearchMatch = "starts";
          else if (tok === "ew") this._pathSearchMatch = "ends";
          else if (tok === "e") this._pathSearchMatch = "exact";
        }
        try {
          this._refreshPathRules();
        } catch (e) {}
      };
      prLimitInput.addEventListener("input", prLimitHandler);
      this._cleanupHandlers.push(() =>
        prLimitInput.removeEventListener("input", prLimitHandler),
      );

      this._pathRulesContainer = containerEl.createDiv();
      this._pathRulesContainer.addClass("path-rules-list");
      this._refreshPathRules();
      const pathBtnRow = containerEl.createDiv();
      pathBtnRow.addClass("path-button-row");
      const pathSortBtn = pathBtnRow.createEl("button");
      const pathSortModes = [
        "last-added",
        "a-z",
        "reverse-a-z",
        "mode",
        "type",
      ];
      const pathSortLabels = {
        "last-added": "Sort: Last Added",
        "a-z": "Sort: A-Z",
        "reverse-a-z": "Sort: Z-A",
        mode: "Sort: Mode",
        type: "Sort: Type",
      };
      pathSortBtn.textContent = this.plugin.t(
        "path_sort_label_" + (this._pathSortMode || "last-added"),
        pathSortLabels[this._pathSortMode] || "Sort: Last Added",
      );
      pathSortBtn.style.cursor = "pointer";
      pathSortBtn.style.flex = "0 0 auto";
      const pathSortHandler = async () => {
        const i = pathSortModes.indexOf(this._pathSortMode);
        const ni = (i + 1) % pathSortModes.length;
        this._pathSortMode = pathSortModes[ni];
        pathSortBtn.textContent = this.plugin.t(
          "path_sort_label_" + (this._pathSortMode || "last-added"),
          pathSortLabels[this._pathSortMode] || "Sort: Last Added",
        );
        try {
          this.plugin.settings.pathSortMode = this._pathSortMode;
          await this.plugin.saveSettings();
        } catch (e) {}
        this._suspendSorting = false;
        this._refreshPathRules();
      };
      pathSortBtn.addEventListener("click", pathSortHandler);
      this._cleanupHandlers.push(() =>
        pathSortBtn.removeEventListener("click", pathSortHandler),
      );
      const pathAddBtn = pathBtnRow.createEl("button");
      pathAddBtn.textContent = this.plugin.t(
        "btn_add_file_folder_rule",
        "+ Add file/folder rule",
      );
      pathAddBtn.style.cursor = "pointer";
      pathAddBtn.style.flex = "1";
      pathAddBtn.addClass("mod-cta");
      const pathAddHandler = async () => {
        const newEntry = { path: "", mode: "include", matchType: "has-name" };
        if (!Array.isArray(this.plugin.settings.pathRules))
          this.plugin.settings.pathRules = [];
        this.plugin.settings.pathRules.push(newEntry);
        this._suspendSorting = this._pathSortMode === "last-added";
        await this.plugin.saveSettings();
        this._refreshPathRules();
      };
      pathAddBtn.addEventListener("click", pathAddHandler);
      this._cleanupHandlers.push(() =>
        pathAddBtn.removeEventListener("click", pathAddHandler),
      );

      new Setting(containerEl)
        .setName(
          this.plugin.t(
            "disable_coloring_current_file",
            "Disable coloring for current file",
          ),
        )
        .setDesc(
          this.plugin.t(
            "disable_coloring_current_file_desc",
            "Adds an exclude rule for the active file under File & Folder Coloring Rules.",
          ),
        )
        .addButton((b) =>
          b
            .setButtonText(
              this.plugin.t(
                "btn_disable_for_this_file",
                "Disable for this file",
              ),
            )
            .onClick(async () => {
              const md = this.app.workspace.getActiveFile();
              if (!md) {
                new Notice(
                  this.plugin.t(
                    "notice_no_active_file_to_disable",
                    "No active file to disable coloring for.",
                  ),
                );
                return;
              }
              const p = String(md.path || "");
              if (!Array.isArray(this.plugin.settings.pathRules))
                this.plugin.settings.pathRules = [];
              const np = this.plugin.normalizePath(p);
              const exists = this.plugin.settings.pathRules.some(
                (r) =>
                  r &&
                  r.mode === "exclude" &&
                  !r.isFolder &&
                  this.plugin.normalizePath(String(r.path || "")) === np,
              );
              if (exists) {
                new Notice(
                  this.plugin.t(
                    "notice_already_disabled_for_path",
                    `Coloring is already disabled for {path}`,
                    { path: md.path },
                  ),
                );
                return;
              }
              this.plugin.settings.pathRules.push({
                path: p,
                mode: "exclude",
                isFolder: false,
              });
              await this.plugin.saveSettings();
              this._refreshPathRules();
              this._initializedSettingsUI = false;
              try {
                this.display();
              } catch (e) {}
              new Notice(
                this.plugin.t(
                  "notice_coloring_disabled_for_path",
                  `Coloring disabled for {path}`,
                  { path: md.path },
                ),
              );
            }),
        );

      // Store reference to disabled files container for updating
      this._disabledFilesContainer = containerEl.createDiv();
      this._refreshDisabledFiles();
    }
    if (this._activeTab === "data") {
      // --- Automatic Backups ---
      containerEl.createEl("h2", {
        text: this.plugin.t("auto_backup_header", "Automatic Backups"),
      });

      new Setting(containerEl)
        .setName(this.plugin.t("auto_backup_toggle", "Enable automatic backups"))
        .setDesc(this.plugin.t("auto_backup_toggle_desc", "Periodically back up all plugin data to a folder inside your vault."))
        .addToggle((toggle) =>
          toggle
            .setValue(this.plugin.settings.autoBackupEnabled)
            .onChange(async (value) => {
              this.plugin.settings.autoBackupEnabled = value;
              await this.plugin.saveSettings();
              this.plugin.rescheduleAutoBackup();
              this._initializedSettingsUI = false;
              this.display();
            }),
        );

      if (this.plugin.settings.autoBackupEnabled) {
        // Backup folder — button shows current folder name, click to change, reset button to clear
        const folderSetting = new Setting(containerEl)
          .setName(this.plugin.t("auto_backup_folder", "Backup folder"))
          .setDesc(this.plugin.t("auto_backup_folder_desc", "Folder path inside your vault where backups are saved (e.g. backups/act)."));

        let folderPickBtn;
        folderSetting.addButton((btn) => {
          folderPickBtn = btn;
          const cur = (this.plugin.settings.autoBackupFolder || "").trim();
          btn.setButtonText(cur || this.plugin.t("auto_backup_folder_pick", "Choose folder"));
          btn.buttonEl.addEventListener("click", async () => {
            const prev = (this.plugin.settings.autoBackupFolder || "").trim();
            const input = window.prompt(
              this.plugin.t("auto_backup_folder_prompt", "Enter a vault-relative folder path (e.g. backups/act):"),
              prev,
            );
            if (input !== null) {
              const val = input.trim();
              this.plugin.settings.autoBackupFolder = val;
              await this.plugin.saveSettings();
              btn.setButtonText(val || this.plugin.t("auto_backup_folder_pick", "Choose folder"));
            }
          });
        });

        folderSetting.addExtraButton((btn) => {
          btn.setIcon("reset");
          btn.setTooltip(this.plugin.t("auto_backup_folder_reset", "Reset to default"));
          btn.onClick(async () => {
            this.plugin.settings.autoBackupFolder = "";
            await this.plugin.saveSettings();
            if (folderPickBtn) folderPickBtn.setButtonText(this.plugin.t("auto_backup_folder_pick", "Choose folder"));
          });
        });

        const intervalSetting = new Setting(containerEl)
          .setName(this.plugin.t("auto_backup_interval", "Backup interval"))
          .setDesc(this.plugin.t("auto_backup_interval_desc", "How often to save a backup."));

        intervalSetting.addText((text) => {
          text.inputEl.type = "number";
          text.inputEl.min = "1";
          text.inputEl.style.width = "64px";
          text
            .setValue(String(this.plugin.settings.autoBackupInterval || 1))
            .onChange(async (value) => {
              const n = parseInt(value, 10);
              if (!isNaN(n) && n >= 1) {
                this.plugin.settings.autoBackupInterval = n;
                await this.plugin.saveSettings();
                this.plugin.rescheduleAutoBackup();
              }
            });
        });

        intervalSetting.addDropdown((drop) =>
          drop
            .addOption("hour", this.plugin.t("auto_backup_unit_hour", "Hour(s)"))
            .addOption("day", this.plugin.t("auto_backup_unit_day", "Day(s)"))
            .addOption("week", this.plugin.t("auto_backup_unit_week", "Week(s)"))
            .setValue(this.plugin.settings.autoBackupUnit || "day")
            .onChange(async (value) => {
              this.plugin.settings.autoBackupUnit = value;
              await this.plugin.saveSettings();
              this.plugin.rescheduleAutoBackup();
            }),
        );

        new Setting(containerEl)
          .setName(this.plugin.t("auto_backup_overwrite", "Overwrite previous backup"))
          .setDesc(this.plugin.t("auto_backup_overwrite_desc", "Replace the last backup file instead of creating a new one each time."))
          .addToggle((toggle) =>
            toggle
              .setValue(this.plugin.settings.autoBackupOverwrite || false)
              .onChange(async (value) => {
                this.plugin.settings.autoBackupOverwrite = value;
                await this.plugin.saveSettings();
              }),
          );

        new Setting(containerEl)
          .setName(this.plugin.t("auto_backup_now", "Backup now"))
          .setDesc(this.plugin.t("auto_backup_now_desc", "Save a backup immediately."))
          .addButton((btn) =>
            btn
              .setButtonText(this.plugin.t("btn_backup_now", "Backup now"))
              .setCta()
              .onClick(async () => {
                btn.setButtonText(this.plugin.t("btn_backup_now_running", "Saving..."));
                btn.setDisabled(true);
                try {
                  const path = await this.plugin.runAutoBackup();
                  btn.setButtonText(this.plugin.t("btn_backup_now_done", "Saved!"));
                  new Notice(`Backup saved: ${path}`);
                } catch (e) {
                  btn.setButtonText(this.plugin.t("btn_backup_now_failed", "Failed"));
                  new Notice(`Backup failed: ${e?.message || e}`);
                } finally {
                  setTimeout(() => {
                    btn.setButtonText(this.plugin.t("btn_backup_now", "Backup now"));
                    btn.setDisabled(false);
                  }, 2500);
                }
              }),
          );
      }

      containerEl.createEl("h2", {
        text: this.plugin.t("data_export_import_header", "Data Export/Import"),
      });
      new Setting(containerEl)
        .setName(this.plugin.t("export_plugin_data", "Export plugin data"))
        .setDesc(
          this.plugin.t(
            "export_plugin_data_desc",
            "Export settings, words, and rules to a JSON file.",
          ),
        )
        .addButton((b) =>
          b
            .setButtonText(this.plugin.t("btn_export", "Export"))
            .onClick(async () => {
              try {
                const fname =
                  await this.plugin.exportSettingsToPickedLocation();
                new Notice(
                  this.plugin.t("notice_exported", `Exported: {fname}`, {
                    fname,
                  }),
                );
              } catch (e) {
                new Notice(
                  this.plugin.t("notice_export_failed", "Export failed"),
                );
              }
            }),
        );
      new Setting(containerEl)
        .setName(this.plugin.t("import_plugin_data", "Import plugin data"))
        .setDesc(
          this.plugin.t(
            "import_plugin_data_desc",
            "Import settings from a JSON file",
          ),
        )
        .addButton((b) =>
          b.setButtonText(this.plugin.t("btn_import", "Import")).onClick(() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/json";
            input.addEventListener("change", () => {
              const file = input.files && input.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = async () => {
                try {
                  await this.plugin.importSettingsFromJson(
                    String(reader.result || ""),
                  );
                  this._initializedSettingsUI = false;
                  this.display();
                  new Notice(
                    this.plugin.t(
                      "notice_import_completed",
                      "Import completed",
                    ),
                  );
                } catch (e) {
                  new Notice(
                    this.plugin.t("notice_import_failed", "Import failed"),
                  );
                }
              };
              reader.readAsText(file);
            });
            input.click();
          }),
        );
    }

    // Apply .act-desc class to all setting descriptions
    // containerEl.querySelectorAll('.setting-item-description').forEach(el => el.addClass('act-desc'));
  }

  // Method to focus and/or create a text & background coloring entry with pre-filled text
  async focusTextBgEntry(selectedText) {
    try {
      if (!selectedText || !this.containerEl) return;

      // Find the text input for this entry, or create a new one
      let foundEntry = (
        Array.isArray(this.plugin.settings.wordEntries)
          ? this.plugin.settings.wordEntries
          : []
      ).find(
        (e) =>
          e &&
          (e.pattern === selectedText ||
            (Array.isArray(e.groupedPatterns) &&
              e.groupedPatterns.includes(selectedText))),
      );

      let isNewEntry = false;
      // If entry doesn't exist, create it
      if (!foundEntry) {
        isNewEntry = true;
        foundEntry = {
          pattern: selectedText,
          color: "",
          textColor: "currentColor",
          backgroundColor: "",
          isRegex: false,
          flags: "",
          groupedPatterns: null,
        };
        if (!Array.isArray(this.plugin.settings.wordEntries))
          this.plugin.settings.wordEntries = [];
        this.plugin.settings.wordEntries.push(foundEntry);
        // Need to recompile entries when a new one is added
        this.plugin.compileTextBgColoringEntries();
        // Save the settings
        await this.plugin.saveSettings();

        // Force a full re-render by clearing the initialization flag
        this._initializedSettingsUI = false;
        this.display();
      }

      // Scroll to the text & background coloring section after a delay to let DOM update
      setTimeout(
        () => {
          const textBgListDiv = this.containerEl.querySelector(
            ".text-bg-coloring-list",
          );
          if (textBgListDiv) {
            textBgListDiv.scrollIntoView({ behavior: "auto", block: "center" });

            // Find and focus the text input for this entry
            setTimeout(() => {
              const inputs =
                textBgListDiv.querySelectorAll('input[type="text"]');
              for (const input of inputs) {
                if (input.value.includes(selectedText)) {
                  input.focus();
                  input.select();
                  // Add visual focus highlight with accent color border
                  input.style.borderColor = "var(--color-accent)";
                  input.style.boxShadow = "0 0 0 2px var(--color-accent-1)";
                  input.style.transition =
                    "border-color 0.2s ease, box-shadow 0.2s ease";

                  // Remove the highlight after 3 seconds
                  setTimeout(() => {
                    input.style.borderColor =
                      "var(--background-modifier-border)";
                    input.style.boxShadow = "none";
                  }, 3000);
                  break;
                }
              }
            }, 300); // Wait for scroll to complete
          }
        },
        isNewEntry ? 500 : 100,
      ); // Wait longer if we just re-rendered the display
    } catch (e) {
      debugError("FOCUS_TEXTBG", "Failed to focus text bg entry", e);
    }
  }
}