import { Modal, Notice, setIcon } from 'obsidian';
import { ColorPickerModal } from './ColorPickerModal.js';
import { HighlightStylingModal } from './HighlightStylingModal.js';
import { RealTimeRegexTesterModal } from './RealTimeRegexTesterModal.js';
import { CustomCssModal } from './CustomCssModal.js';
import { TextStylePresetsModal } from './TextStylePresetsModal.js';
import { deriveHighlightCssFromEntry } from './CustomCssModal.js';
import { AddToExistingEntryModal } from './AddToExistingEntryModal.js';
import { LinkedMatcherModal } from './LinkedMatcherModal.js';
import { RulePickerModal } from './RulePickerModal.js';
import { RuleValueModal } from './RuleValueModal.js';
import {
  matcherKey,
  findEntriesWithMatcherKey,
  propagateStyle,
} from '../utils/matcherLinker.js';

export class EditEntryModal extends Modal {
  constructor(
    app,
    plugin,
    entry,
    onSaved,
    parentModal,
    fromPickColorModal = false,
  ) {
    super(app);
    this.plugin = plugin;
    this.entry = entry;
    this.parentModal = parentModal;
    this.fromPickColorModal = !!fromPickColorModal;
    // Ensure entry has a uid for finding it later
    if (this.entry && !this.entry.uid) {
      try {
        this.entry.uid =
          Date.now().toString(36) + Math.random().toString(36).slice(2);
      } catch (_) {
        this.entry.uid = Date.now();
      }
    }
    this.originalEntryUid = this.entry?.uid; // Store the original UID to track the entry
    this.onSaved = onSaved;
    this._handlers = [];
    this._dropdownCleanups = []; // Track dropdown cleanup functions
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass("act-edit-entry-modal");
      this.modalEl.style.maxWidth = "700px";
      this.modalEl.style.padding = "20px";
    } catch (e) {}

    // Determine if regex early
    const isRegex = !!(this.entry && this.entry.isRegex);

    const groupsList = Array.isArray(this.plugin.settings.wordEntryGroups)
      ? this.plugin.settings.wordEntryGroups
      : [];
    let currentGroupUid = null;
    try {
      const entryUid =
        this.entry && this.entry.uid ? String(this.entry.uid) : "";
      const normalizePatterns = (e) => {
        try {
          if (!e) return "";
          if (Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0)
            return e.groupedPatterns
              .map((p) => String(p || "").trim())
              .filter(Boolean)
              .join(",")
              .toLowerCase();
          return String(e.pattern || "")
            .trim()
            .toLowerCase();
        } catch (_) {
          return "";
        }
      };
      const keyOf = (e) => {
        try {
          if (!e) return "";
          const isR = !!e.isRegex;
          const flags = String(e.flags || "").trim();
          const m = String(e.matchType || "")
            .trim()
            .toLowerCase();
          const p = normalizePatterns(e);
          return `${isR ? "r" : "t"}|${flags}|${m}|${p}`;
        } catch (_) {
          return "";
        }
      };
      const entryKey = keyOf(this.entry);
      const matches = (e) => {
        try {
          if (!e) return false;
          if (entryUid && e.uid && String(e.uid || "") === entryUid)
            return true;
          if (entryKey) return keyOf(e) === entryKey;
          return false;
        } catch (_) {
          return false;
        }
      };
      if (Array.isArray(groupsList)) {
        for (const g of groupsList) {
          if (!g || !Array.isArray(g.entries)) continue;
          if (g.entries.some(matches)) {
            currentGroupUid = g.uid || null;
            break;
          }
        }
      }
    } catch (e) {}
    // Store the original group UID so we can remove from it correctly later
    this.originalGroupUid = currentGroupUid;
    try {
      const entryUid =
        this.entry && this.entry.uid ? String(this.entry.uid) : "";
      const normalizePatterns = (e) => {
        try {
          if (!e) return "";
          if (Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0)
            return e.groupedPatterns
              .map((p) => String(p || "").trim())
              .filter(Boolean)
              .join(",")
              .toLowerCase();
          return String(e.pattern || "")
            .trim()
            .toLowerCase();
        } catch (_) {
          return "";
        }
      };
      const keyOf = (e) => {
        try {
          if (!e) return "";
          const isR = !!e.isRegex;
          const flags = String(e.flags || "").trim();
          const m = String(e.matchType || "")
            .trim()
            .toLowerCase();
          const p = normalizePatterns(e);
          return `${isR ? "r" : "t"}|${flags}|${m}|${p}`;
        } catch (_) {
          return "";
        }
      };
      const entryKey = keyOf(this.entry);
      const matches = (e) => {
        try {
          if (!e) return false;
          if (entryUid && e.uid && String(e.uid || "") === entryUid)
            return true;
          if (entryKey) return keyOf(e) === entryKey;
          return false;
        } catch (_) {
          return false;
        }
      };
      const settings = this.plugin.settings;
      let found = null;

      // PRIORITY 1: Search in the current group first
      if (currentGroupUid && Array.isArray(groupsList)) {
        const currentGroup = groupsList.find(
          (g) => g && g.uid === currentGroupUid,
        );
        if (currentGroup && Array.isArray(currentGroup.entries)) {
          found = currentGroup.entries.find(matches) || null;
        }
      }

      // PRIORITY 2: If not in current group, search wordEntries
      if (!found && Array.isArray(settings.wordEntries)) {
        found = settings.wordEntries.find(matches) || null;
      }

      // PRIORITY 3: Search other groups
      if (!found && Array.isArray(groupsList)) {
        for (const g of groupsList) {
          if (!g || !Array.isArray(g.entries) || g.uid === currentGroupUid)
            continue; // skip current group
          found = g.entries.find(matches) || null;
          if (found) break;
        }
      }

      if (found) this.entry = found;
    } catch (e) {}

    // ===== Header Row: Title + Group + Color Target + Color Pickers =====
    const headerRow = contentEl.createDiv();
    headerRow.addClass("act-pickr-header");

    const title = headerRow.createEl("h2", {
      text: isRegex
        ? this.plugin.t("style_regex_modal_header", "Style Regex")
        : this.plugin.t("style_text_modal_header", "Style Text"),
    });
    title.style.marginTop = "0";
    title.style.marginBottom = "0";
    title.style.flex = "1 1 auto";

    const groupSelect = headerRow.createEl("select");
    groupSelect.addClass("act-edit-entry-group-select");
    const defaultOpt = groupSelect.createEl("option", {
      text: this.plugin.t("no_group", "No Group"),
    });
    defaultOpt.value = "";
    groupsList.forEach((g) => {
      const name =
        g && g.name && String(g.name).trim().length > 0
          ? g.name
          : "(unnamed group)";
      const opt = groupSelect.createEl("option", { text: name });
      opt.value = g.uid || "";
    });
    groupSelect.value = currentGroupUid || "";
    if (
      !currentGroupUid &&
      this.fromPickColorModal &&
      this.entry &&
      this.entry._preselectedGroupUid
    ) {
      groupSelect.value = this.entry._preselectedGroupUid || "";
    }
    // Only show if word groups exist
    if (!groupsList || groupsList.length === 0) {
      groupSelect.style.display = "none";
    }

    // Color target dropdown (Color / Highlight / Both)
    const styleSelect = headerRow.createEl("select");
    styleSelect.addClass("act-edit-entry-style-select");
    this._styleSelect = styleSelect;
    ["text", "highlight", "both"].forEach((val) => {
      const opt = styleSelect.createEl("option", {
        text: this.plugin.t(
          "style_type_" + val,
          val === "text" ? "color" : val,
        ),
      });
      opt.value = val;
    });

    // Color pickers
    const pickerRow = headerRow.createDiv();
    pickerRow.addClass("act-edit-entry-pickers");
    const textColorInput = pickerRow.createEl("input", { type: "color" });
    const bgColorInput = pickerRow.createEl("input", { type: "color" });
    this._textColorInput = textColorInput;
    this._bgColorInput = bgColorInput;

    // ===== act-pickr-row =====
    const pickrRow = contentEl.createDiv();
    pickrRow.addClass("act-pickr-row");

    // Style button (opens the Text Style Presets modal to pick a style)
    const presetBtn = pickrRow.createEl("button");
    presetBtn.title = this.plugin.t("btn_style", "Style");
    const presetLabel = presetBtn.createEl("span", {
      text: this.plugin.t("btn_style", "Style"),
    });
    presetLabel.style.fontSize = "12px";
    presetBtn.addEventListener("click", () => {
      try {
        new TextStylePresetsModal(
          this.app,
          this.plugin,
          (preset) => this._applyPreset(preset),
        ).open();
      } catch (e) {}
    });

    // Edit Icon (opens Edit Highlight Styling modal)
    const hlBtn = pickrRow.createEl("button");
    try {
      setIcon(hlBtn, "edit-3");
    } catch (e) {}
    hlBtn.title = this.plugin.t(
      "edit_highlight_styling_btn",
      "Edit Highlight Styling",
    );
    hlBtn.addClass("act-pickr-icon-btn");

    // Custom CSS icon (if enabled)
    let cssBtn = null;
    if (this.plugin.settings.enableCustomCss) {
      cssBtn = pickrRow.createEl("button");
      try {
        setIcon(cssBtn, "code");
      } catch (e) {}
      cssBtn.title = this.plugin.t("edit_custom_css_btn", "Edit Custom CSS");
      cssBtn.addClass("act-pickr-icon-btn");
    }

    // Mark Target dropdown (Color Text / Line / Next Line)
    const markTargetSelect = pickrRow.createEl("select");
    markTargetSelect.addClass("act-edit-entry-mark-target");
    [
      ["text", this.plugin.t("mark_target_text", "Color Text")],
      ["line", this.plugin.t("mark_target_line", "Color Line")],
      ["nextLine", this.plugin.t("mark_target_child_line", "Color Child")],
    ].forEach(([val, label]) => {
      const opt = markTargetSelect.createEl("option", { text: label });
      opt.value = val;
    });
    markTargetSelect.value =
      this.entry && this.entry.markTarget ? this.entry.markTarget : "text";

    // Case Sensitivity dropdown
    const caseSel = pickrRow.createEl("select");
    caseSel.addClass("act-pickr-case-select");
    caseSel.innerHTML = `<option value="case">${this.plugin.t("opt_case_sensitive", "is case sensitive")}</option><option value="nocase">${this.plugin.t("opt_not_case_sensitive", "not case sensitive")}</option>`;

    // MatchType dropdown (text) OR Open in Regex Tester button (regex)
    let matchSelect = null;
    let openRegexBtn = null;
    if (isRegex) {
      openRegexBtn = pickrRow.createEl("button", {
        text: this.plugin.t("open_in_regex_tester", "Open in Regex Tester"),
      });
      openRegexBtn.style.whiteSpace = "nowrap";
    } else {
      matchSelect = pickrRow.createEl("select");
      matchSelect.addClass("act-pickr-match-select");
      matchSelect.innerHTML = `<option value="exact">${this.plugin.t("match_option_exact", "exact")}</option><option value="contains">${this.plugin.t("match_option_contains", "contains")}</option><option value="startsWith">${this.plugin.t("match_option_starts_with", "starts with")}</option><option value="endsWith">${this.plugin.t("match_option_ends_with", "ends with")}</option>`;
    }

    // ===== Preview Wrap =====
    const previewWrap = contentEl.createDiv();
    previewWrap.addClass("act-color-picker-preview-wrap");
    const preview = previewWrap.createDiv();
    preview.addClass("act-edit-entry-preview");
    preview.style.display = "flex";
    preview.style.alignItems = "center";
    preview.style.justifyContent = "center";
    preview.style.flex = "1";
    preview.style.whiteSpace = "pre-wrap";
    preview.style.wordWrap = "break-word";

    // ===== Full-width text input (div-based) =====
    const box = contentEl.createDiv();
    box.addClass("act-edit-entry-textbox");
    box.style.width = "100%";
    box.style.boxSizing = "border-box";
    const textInput = box.createEl("div");
    textInput.contentEditable = "true";
    textInput.style.width = "100%";
    textInput.style.minHeight = "40px";
    textInput.style.border = "1px solid var(--background-modifier-border-focus)";
    textInput.style.borderRadius = "4px";
    textInput.style.outline = "none";
    textInput.style.background = "transparent";
    textInput.style.color = "var(--text-normal)";
    textInput.style.padding = "6px 10px";
    textInput.style.boxSizing = "border-box";
    textInput.style.lineHeight = "1.5";
    textInput.style.whiteSpace = "pre-wrap";
    textInput.style.wordBreak = "break-word";
    // Helper to get/set text value on the contenteditable div
    Object.defineProperty(textInput, 'value', {
      get() { return this.textContent; },
      set(v) { this.textContent = v; },
      configurable: true,
    });

    // ===== Inclusion / Exclusion Rules =====
    const rulesHeader = contentEl.createEl("h3", {
      text: this.plugin.t(
        "inclusion_exclusion_header",
        "Inclusion / Exclusion Rules",
      ),
    });
    rulesHeader.style.marginTop = "24px";
    const rulesContainer = contentEl.createDiv();
    rulesContainer.style.marginTop = "8px";
    const addRuleBtn = contentEl.createEl("button", {
      text: this.plugin.t("btn_add_rule", "+ Add Rule"),
    });
    addRuleBtn.style.marginTop = "6px";

    // ===== Color functions =====
    const dispatchColorsChanged = () => {
      try {
        window.dispatchEvent(
          new CustomEvent("act-colors-changed", {
            detail: { entry: this.entry },
          }),
        );
      } catch (_) {}
      renderPreview();
    };
    const applyTextColorToEntry = (dispatch = true) => {
      const style = styleSelect.value;
      if (this.entry)
        this.entry._savedTextColor =
          textColorInput.value ||
          this.entry._savedTextColor ||
          this.entry.color ||
          this.entry.textColor ||
          "";
      if (style === "text") {
        this.entry.color = textColorInput.value || "";
      } else if (style === "both") {
        this.entry.textColor = textColorInput.value || "";
      }
      if (this.entry && this.entry.customCss) {
        this.plugin.syncEntryCssFromColors(this.entry);
      }
      if (dispatch) dispatchColorsChanged();
    };
    const applyBgColorToEntry = (dispatch = true) => {
      const style = styleSelect.value;
      if (this.entry)
        this.entry._savedBackgroundColor =
          bgColorInput.value ||
          this.entry._savedBackgroundColor ||
          this.entry.backgroundColor ||
          "";
      if (style === "highlight") {
        this.entry.backgroundColor = bgColorInput.value || "";
      } else if (style === "both") {
        this.entry.backgroundColor = bgColorInput.value || "";
      }
      if (this.entry && this.entry.customCss) {
        this.plugin.syncEntryCssFromColors(this.entry);
      }
      if (dispatch) dispatchColorsChanged();
    };
    const setupColorPickerRightClick = (colorInput, onColorSelected) => {
      colorInput.addEventListener("contextmenu", (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        const currentColor = colorInput.value || "#000000";
        const displayText =
          this.entry && this.entry.isRegex
            ? this.entry.pattern || ""
            : Array.isArray(this.entry.groupedPatterns) &&
                this.entry.groupedPatterns.length > 0
              ? this.entry.groupedPatterns
                  .map((p) => String(p).trim())
                  .join(", ")
              : this.entry && this.entry.pattern
                ? String(this.entry.pattern)
                : "";
        const isTextPicker = colorInput === textColorInput;
        const modal = new ColorPickerModal(
          this.app,
          this.plugin,
          async (color, result) => {
            const tc =
              result &&
              result.textColor &&
              this.plugin.isValidHexColor(result.textColor)
                ? result.textColor
                : null;
            const bc =
              result &&
              result.backgroundColor &&
              this.plugin.isValidHexColor(result.backgroundColor)
                ? result.backgroundColor
                : null;
            const fallback =
              color && this.plugin.isValidHexColor(color) ? color : null;
            let changed = false;

            if (tc) {
              textColorInput.value = tc;
              changed = true;
            } else if (fallback && isTextPicker) {
              textColorInput.value = fallback;
              changed = true;
            }

            if (bc) {
              bgColorInput.value = bc;
              changed = true;
            } else if (fallback && !isTextPicker) {
              bgColorInput.value = fallback;
              changed = true;
            }

            if (result && result.markTarget) {
              markTargetSelect.value = result.markTarget;
              if (this.entry) {
                this.entry.markTarget = result.markTarget;
                await this.plugin.saveSettings();
                this.plugin.compileWordEntries();
                this.plugin.compileTextBgColoringEntries();
                this.plugin.reconfigureEditorExtensions();
                this.plugin.forceRefreshAllEditors();
                this.plugin.forceRefreshAllReadingViews();
                this.plugin.triggerActiveDocumentRerender();
              }
            }

            if (!changed) {
              if (currentColor && this.plugin.isValidHexColor(currentColor)) {
                if (isTextPicker) textColorInput.value = currentColor;
                else bgColorInput.value = currentColor;
              }
            }

            applyTextColorToEntry(false);
            applyBgColorToEntry(false);
            dispatchColorsChanged();
          },
          isTextPicker ? "text" : "background",
          displayText,
          false,
          this.entry ? this.entry.markTarget : "text",
          this.entry,
        );
        modal._hideHeaderControls = true;
        if (textColorInput.value)
          modal._preFillTextColor = textColorInput.value;
        if (bgColorInput.value) modal._preFillBgColor = bgColorInput.value;
        modal.open();
      });
    };

    setupColorPickerRightClick(textColorInput, applyTextColorToEntry);
    setupColorPickerRightClick(bgColorInput, applyBgColorToEntry);

    // markTarget change handler
    const markTargetFn = async () => {
      if (this.entry) {
        this.entry.markTarget = markTargetSelect.value;
        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.forceRefreshAllReadingViews();
        this.plugin.triggerActiveDocumentRerender();
      }
    };

    markTargetSelect.addEventListener("change", markTargetFn);
    this._handlers.push({
      el: markTargetSelect,
      ev: "change",
      fn: markTargetFn,
    });

    // Add real-time syncing to this.entry when colors change
    textColorInput.addEventListener("input", applyTextColorToEntry);
    this._handlers.push({
      el: textColorInput,
      ev: "input",
      fn: applyTextColorToEntry,
    });

    bgColorInput.addEventListener("input", applyBgColorToEntry);
    this._handlers.push({
      el: bgColorInput,
      ev: "input",
      fn: applyBgColorToEntry,
    });

    // Listen for color changes from HighlightStylingModal and update our inputs
    const colorSyncHandler = (evt) => {
      try {
        if (evt.detail && evt.detail.entry && evt.detail.entry === this.entry) {
          // Colors changed in child modal, sync our inputs
          const initTextColor =
            (this.entry &&
              (this.entry.textColor && this.entry.textColor !== "currentColor"
                ? this.entry.textColor
                : this.plugin.isValidHexColor(this.entry.color)
                  ? this.entry.color
                  : "")) ||
            textColorInput.value ||
            "#000000";
          const initBgColor =
            (this.entry && (this.entry.backgroundColor || "")) ||
            bgColorInput.value ||
            "#000000";
          if (this.plugin.isValidHexColor(initTextColor))
            textColorInput.value = initTextColor;
          if (this.plugin.isValidHexColor(initBgColor))
            bgColorInput.value = initBgColor;
          // Sync styleType dropdown from entry (CustomCssModal may have updated it)
          if (this.entry && this.entry.styleType) {
            styleSelect.value = this.entry.styleType;
            updatePickerVisibility();
          }
          renderPreview();
        }
      } catch (_) {}
    };
    window.addEventListener("act-colors-changed", colorSyncHandler);
    this._handlers.push({
      el: window,
      ev: "act-colors-changed",
      fn: colorSyncHandler,
    });

    // Group change handler
    const groupChangeHandler = async () => {
      const newGroupUid = groupSelect.value || "";
      const originalGroupUid = this.originalGroupUid; // Use stored original group UID
      if (newGroupUid === originalGroupUid) return;

      const settings = this.plugin.settings;
      if (!Array.isArray(settings.wordEntries)) settings.wordEntries = [];
      if (!Array.isArray(settings.wordEntryGroups))
        settings.wordEntryGroups = [];

      // STEP 1: Remove the ACTUAL entry object from ALL locations

      // Remove from wordEntries (Default)
      const wordEntriesIdx = settings.wordEntries.indexOf(this.entry);
      if (wordEntriesIdx !== -1) {
        settings.wordEntries.splice(wordEntriesIdx, 1);
      }

      // Remove from ALL word groups
      for (const group of settings.wordEntryGroups) {
        if (group && Array.isArray(group.entries)) {
          const groupIdx = group.entries.indexOf(this.entry);
          if (groupIdx !== -1) {
            group.entries.splice(groupIdx, 1);
          }
        }
      }

      // STEP 2: Add the SAME entry object to the new location (DO NOT CREATE A COPY!)
      if (newGroupUid === "") {
        // Add to wordEntries (Default)
        try {
          delete this.entry.groupUid;
        } catch (_) {}
        settings.wordEntries.push(this.entry);
      } else {
        // Add to target group
        const newGroup = settings.wordEntryGroups.find(
          (g) => g && g.uid === newGroupUid,
        );
        if (newGroup) {
          if (!Array.isArray(newGroup.entries)) newGroup.entries = [];
          try {
            this.entry.groupUid = newGroupUid;
          } catch (_) {}
          newGroup.entries.push(this.entry);
        }
      }

      currentGroupUid = newGroupUid;

      await this.plugin.saveSettings();

      this.plugin.compileWordEntries();
      this.plugin.compileTextBgColoringEntries();
      this.plugin.reconfigureEditorExtensions();
      this.plugin.forceRefreshAllEditors();
      this.plugin.forceRefreshAllReadingViews();
      this.plugin.triggerActiveDocumentRerender();

      try {
        if (typeof this.onSaved === "function") this.onSaved();
      } catch (_) {}
      try {
        if (
          this.parentModal &&
          typeof this.parentModal._refreshEntries === "function"
        )
          this.parentModal._refreshEntries();
      } catch (_) {}
      try {
        if (
          this.plugin.settingTab &&
          typeof this.plugin.settingTab._refreshEntries === "function"
        )
          this.plugin.settingTab._refreshEntries();
      } catch (_) {}
    };
    groupSelect.addEventListener("change", groupChangeHandler);
    this._handlers.push({
      el: groupSelect,
      ev: "change",
      fn: groupChangeHandler,
    });

    // ===== Initialization =====
    let initialStyle =
      this.entry && this.entry.styleType ? this.entry.styleType : null;
    if (!initialStyle) {
      const hasText = !!(
        this.entry &&
        ((this.entry.textColor && this.entry.textColor !== "currentColor") ||
          this.entry.color)
      );
      const hasBg = !!(this.entry && this.entry.backgroundColor);
      initialStyle = hasText && hasBg ? "both" : hasBg ? "highlight" : "text";
    }
    styleSelect.value = initialStyle || "text";
    const initTextColor =
      (this.entry &&
        (this.entry.textColor && this.entry.textColor !== "currentColor"
          ? this.entry.textColor
          : this.plugin.isValidHexColor(this.entry.color)
            ? this.entry.color
            : "")) ||
      textColorInput.value ||
      "#000000";
    const initBgColor =
      (this.entry && (this.entry.backgroundColor || "")) ||
      bgColorInput.value ||
      "#000000";
    textColorInput.value = this.plugin.isValidHexColor(initTextColor)
      ? initTextColor
      : "#000000";
    if (initBgColor)
      bgColorInput.value = this.plugin.isValidHexColor(initBgColor)
        ? initBgColor
        : "#000000";
    if (isRegex) {
      textInput.value = this.entry.pattern || "";
      if (matchSelect) {
        matchSelect.disabled = true;
        matchSelect.style.opacity = "0.5";
      }
      caseSel.disabled = true;
      caseSel.style.opacity = "0.5";
    } else {
      const patterns =
        Array.isArray(this.entry.groupedPatterns) &&
        this.entry.groupedPatterns.length > 0
          ? this.entry.groupedPatterns
          : [String(this.entry.pattern || "")];
      textInput.value = patterns.map((p) => String(p).trim()).join(", ");
      let defaultMatch =
        typeof this.entry.matchType === "string" && this.entry.matchType
          ? this.entry.matchType.toLowerCase()
          : this.plugin.settings.partialMatch
            ? "contains"
            : "exact";
      if (defaultMatch === "startswith" || defaultMatch === "starts with")
        defaultMatch = "startswith";
      if (defaultMatch === "endswith" || defaultMatch === "ends with")
        defaultMatch = "endswith";
      matchSelect.value =
        defaultMatch === "startswith"
          ? "startsWith"
          : defaultMatch === "endswith"
            ? "endsWith"
            : defaultMatch;
    }
    const isCase =
      typeof this.entry.caseSensitive === "boolean"
        ? this.entry.caseSensitive
        : !!this.plugin.settings.caseSensitive;
    caseSel.value = isCase ? "case" : "nocase";
    const renderPreview = () => {
      const raw = String(textInput.value || "");
      const style = styleSelect.value;
      const t = textColorInput.value;
      const b = bgColorInput.value;
      const p = this.plugin.getHighlightParams(this.entry);
      const rgba = this.plugin.hexToRgba(b, p.opacity ?? 25);
      const radius = p.radius ?? 8;
      const pad = p.hPad ?? 4;
      const vpad = p.vPad ?? 0;
      const borderStyle =
        style === "text"
          ? ""
          : style === "highlight"
            ? this.plugin.generateBorderStyle(null, b, this.entry)
            : this.plugin.generateBorderStyle(t, b, this.entry);
      const bdb = `box-decoration-break: clone; -webkit-box-decoration-break: clone;`;
      const sText = `color:${t};background:transparent;`;
      const sHighlight = `background-color:${rgba};border-radius:${radius}px;padding:${vpad}px ${pad}px;color:var(--text-normal);${borderStyle}${bdb}`;
      const sBoth = `color:${t};background-color:${rgba};border-radius:${radius}px;padding:${vpad}px ${pad}px;${borderStyle}${bdb}`;
      const styleStr =
        style === "text" ? sText : style === "highlight" ? sHighlight : sBoth;

      while (preview.firstChild) preview.removeChild(preview.firstChild);
      if (!raw) return;
      const displayText =
        this.entry && this.entry.isRegex && this.entry.presetLabel
          ? this.entry.presetLabel
          : raw;
      const makeSpan = (text) => {
        const span = document.createElement("span");
        span.setAttribute("style", styleStr);
        span.style.display = "inline";
        // Apply custom CSS on top if present — use current picker colors for immediate preview
        if (this.entry && this.entry.customCss && this.plugin.settings.enableCustomCss) {
          try {
            const tempEntry = Object.assign({}, this.entry, {
              color: style === 'text' ? t : '',
              textColor: style === 'both' ? t : (style === 'highlight' ? 'currentColor' : null),
              backgroundColor: (style === 'highlight' || style === 'both') ? b : null,
            });
            const tempCss = this.plugin.syncEntryCssFromColorsForPreview(tempEntry);
            const decl = this.plugin.sanitizeCssDeclarations(tempCss || this.entry.customCss);
            if (decl) {
              decl.split(";").map(s => s.trim()).filter(Boolean).forEach(p => {
                const idx = p.indexOf(":");
                if (idx === -1) return;
                span.style.setProperty(p.slice(0, idx).trim(), p.slice(idx + 1).trim(), "important");
              });
            }
          } catch (_) {}
        }
        span.textContent = text;
        return span;
      };
      preview.appendChild(makeSpan(displayText));
    };
    if (openRegexBtn) {
      const openRegexFn = async () => {
        try {
          if (!this.entry || !this.entry.isRegex) return;
          const modal = new RealTimeRegexTesterModal(
            this.app,
            this.plugin,
            () => {
              try {
                textInput.value = this.entry.pattern || "";
              } catch (_) {}
              try {
                renderPreview();
              } catch (_) {}
            },
          );
          modal._editingEntry = this.entry;
          if (this.entry.pattern) modal._preFillPattern = this.entry.pattern;
          if (this.entry.flags) modal._preFillFlags = this.entry.flags;
          if (this.entry.presetLabel)
            modal._preFillName = this.entry.presetLabel;
          if (this.entry.styleType)
            modal._preFillStyleType = this.entry.styleType;
          if (this.entry.color) modal._preFillTextColor = this.entry.color;
          else if (this.entry.textColor)
            modal._preFillTextColor = this.entry.textColor;
          else if (this.entry._savedTextColor)
            modal._preFillTextColor = this.entry._savedTextColor;
          if (this.entry.backgroundColor)
            modal._preFillBgColor = this.entry.backgroundColor;
          else if (this.entry._savedBackgroundColor)
            modal._preFillBgColor = this.entry._savedBackgroundColor;
          modal.open();
        } catch (e) {
          new Notice(
            this.plugin.t(
              "notice_error_opening_regex_tester",
              "Error opening regex tester",
            ),
          );
        }
      };
      openRegexBtn.addEventListener("click", openRegexFn);
      this._handlers.push({ el: openRegexBtn, ev: "click", fn: openRegexFn });
    }
    const updatePickerVisibility = () => {
      const v = styleSelect.value;
      if (v === "text") {
        textColorInput.style.display = "inline-block";
        bgColorInput.style.display = "none";
        pickerRow.style.flexDirection = "row";
      } else if (v === "highlight") {
        textColorInput.style.display = "none";
        bgColorInput.style.display = "inline-block";
        pickerRow.style.flexDirection = "row";
      } else {
        textColorInput.style.display = "inline-block";
        bgColorInput.style.display = "inline-block";
        pickerRow.style.flexDirection = "row";
      }
    };
    const onInputImmediate = () => {
      renderPreview();
    };
    const styleChange = async () => {
      const nextStyle = styleSelect.value;
      const curr = this.entry;
      if (nextStyle === "text") {
        curr._savedTextColor =
          textColorInput.value || curr._savedTextColor || curr.color || "";
        curr._savedBackgroundColor =
          bgColorInput.value || curr._savedBackgroundColor || "";
        curr.color = textColorInput.value || curr.color || "";
        curr.textColor = null;
        curr.backgroundColor = null;
      } else if (nextStyle === "highlight") {
        curr._savedTextColor =
          textColorInput.value || curr._savedTextColor || "";
        curr._savedBackgroundColor =
          bgColorInput.value || curr._savedBackgroundColor || "";
        curr.backgroundColor = bgColorInput.value || curr.backgroundColor || "";
        curr.textColor = "currentColor";
        curr.color = "";
      } else {
        curr.textColor = textColorInput.value || "";
        curr.backgroundColor = bgColorInput.value || "";
        curr.color = "";
        curr._savedTextColor =
          textColorInput.value || curr._savedTextColor || "";
        curr._savedBackgroundColor =
          bgColorInput.value || curr._savedBackgroundColor || "";
      }
      curr.styleType = nextStyle;
      updatePickerVisibility();
      renderPreview();
    };
    textInput.addEventListener("input", onInputImmediate);
    this._handlers.push({ el: textInput, ev: "input", fn: onInputImmediate });
    styleSelect.addEventListener("change", styleChange);
    this._handlers.push({ el: styleSelect, ev: "change", fn: styleChange });
    const hlFn = () => {
      new HighlightStylingModal(this.app, this.plugin, this.entry, this).open();
    };
    hlBtn.addEventListener("click", hlFn);
    this._handlers.push({ el: hlBtn, ev: "click", fn: hlFn });
    if (cssBtn) {
      const cssFn = () => {
        new CustomCssModal(this.app, this.plugin, this.entry).open();
      };
      cssBtn.addEventListener("click", cssFn);
      this._handlers.push({ el: cssBtn, ev: "click", fn: cssFn });
    }
    try {
      const styleUpdateHandler = () => {
        renderPreview();
      };
      window.addEventListener("act-style-updated", styleUpdateHandler);
      this._handlers.push({
        el: window,
        ev: "act-style-updated",
        fn: styleUpdateHandler,
      });
    } catch (e) {}
    const caseFn = async () => {
      const v = caseSel.value;
      this.entry.caseSensitive = v === "case";
      // Also update in settings array if needed
      const idx = this.plugin.settings.wordEntries.indexOf(this.entry);
      if (idx !== -1)
        this.plugin.settings.wordEntries[idx].caseSensitive = v === "case";

      await this.plugin.saveSettings();
      this.plugin.compileWordEntries();
      this.plugin.compileTextBgColoringEntries();
      this.plugin.reconfigureEditorExtensions();
      this.plugin.forceRefreshAllEditors();
      this.plugin.forceRefreshAllReadingViews();
      this.plugin.triggerActiveDocumentRerender();
    };
    caseSel.addEventListener("change", caseFn);
    this._handlers.push({ el: caseSel, ev: "change", fn: caseFn });
    const matchFn = async () => {
      if (isRegex || !matchSelect) return;
      let value = matchSelect.value;
      if (value === "startsWith") value = "startswith";
      if (value === "endsWith") value = "endswith";
      this.entry.matchType = value;
      const idx = this.plugin.settings.wordEntries.indexOf(this.entry);
      if (idx !== -1) this.plugin.settings.wordEntries[idx].matchType = value;
      await this.plugin.saveSettings();
      this.plugin.compileWordEntries();
      this.plugin.compileTextBgColoringEntries();
      this.plugin.reconfigureEditorExtensions();
      this.plugin.forceRefreshAllEditors();
      this.plugin.forceRefreshAllReadingViews();
      this.plugin.triggerActiveDocumentRerender();
    };
    if (matchSelect) {
      matchSelect.addEventListener("change", matchFn);
      this._handlers.push({ el: matchSelect, ev: "change", fn: matchFn });
    }
    const buildSuggestions = () => {
      const files = this.plugin.app.vault.getFiles();
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
    // Single stable working list so rules keep their order and don't jump
    // between the include/exclude blocks when a dropdown changes. `mode` is a
    // field on each rule; the separate inc/exc arrays are rebuilt on save.
    if (!Array.isArray(this._rules)) {
      const incRules = Array.isArray(this.entry.inclusionRules)
        ? this.entry.inclusionRules
        : [];
      const excRules = Array.isArray(this.entry.exclusionRules)
        ? this.entry.exclusionRules
        : [];
      const merged = [
        ...incRules.map((r) => ({ ...r, mode: "include" })),
        ...excRules.map((r) => ({ ...r, mode: "exclude" })),
      ];
      // Restore the interleaved order saved via _order; falls back to
      // include-first for rules without an _order (pre-existing data).
      merged.sort(
        (a, b) => (Number(a._order) || 0) - (Number(b._order) || 0),
      );
      this._rules = merged;
    }
    const syncEntryRules = () => {
      // Stamp a stable order index so the interleaved sequence survives a
      // save/reopen (the engine stores includes and excludes in two arrays).
      this._rules.forEach((r, i) => {
        r._order = i;
      });
      this.entry.inclusionRules = this._rules.filter((r) => r.mode !== "exclude");
      this.entry.exclusionRules = this._rules.filter((r) => r.mode === "exclude");
    };
    const renderRules = () => {
      rulesContainer.empty();
      const typeMap = (this._ruleTypeMap = this._ruleTypeMap || new WeakMap());
      this._rules.forEach((r, idx) => {
        const row = rulesContainer.createDiv();
        row.style.display = "flex";
        row.style.gap = "8px";
        row.style.alignItems = "center";
        row.style.marginBottom = "8px";
        const modeSel = row.createEl("select");
        const optIn = modeSel.createEl("option", {
          text: this.plugin.t("mode_only_colors_in", "only colors in"),
        });
        optIn.value = "include";
        const optEx = modeSel.createEl("option", {
          text: this.plugin.t("mode_does_not_color_in", "does not color in"),
        });
        optEx.value = "exclude";
        modeSel.value = r.mode === "exclude" ? "exclude" : "include";
        modeSel.style.textAlign = "center";
        modeSel.style.minWidth = "160px";
        modeSel.style.border = "1px solid var(--background-modifier-border)";
        modeSel.style.borderRadius = "var(--radius-m)";
        modeSel.style.background = "var(--background-modifier-form-field)";

        // Type dropdown (Folder / File / Tag / Property / Pattern)
        const typeSel = row.createEl("select");
        const tOptFolder = typeSel.createEl("option", {
          text: this.plugin.t("rule_type_folder", "Folder"),
        });
        tOptFolder.value = "folder";
        const tOptFile = typeSel.createEl("option", {
          text: this.plugin.t("rule_type_file", "File"),
        });
        tOptFile.value = "file";
        const tOptTag = typeSel.createEl("option", {
          text: this.plugin.t("rule_type_tag", "Tag"),
        });
        tOptTag.value = "tag";
        const tOptProp = typeSel.createEl("option", {
          text: this.plugin.t("rule_type_property", "Property"),
        });
        tOptProp.value = "property";
        const tOptPattern = typeSel.createEl("option", {
          text: this.plugin.t("rule_type_pattern", "Pattern"),
        });
        tOptPattern.value = "pattern";
        const ruleType =
          r.type ||
          (String(r.path || "").startsWith("#")
            ? "tag"
            : /\/$/.test(String(r.path || ""))
              ? "folder"
              : "file");
        typeSel.value = ruleType;
        typeSel.style.minWidth = "100px";
        typeSel.style.border = "1px solid var(--background-modifier-border)";
        typeSel.style.borderRadius = "var(--radius-m)";
        typeSel.style.background = "var(--background-modifier-form-field)";
        // Per-rule memory of chosen value for each type.
        if (!typeMap.has(r)) typeMap.set(r, {});
        const tv = typeMap.get(r);
        if (!(ruleType in tv)) tv[ruleType] = String(r.path || "");
        const typeHandler = async () => {
          const newType = typeSel.value;
          const oldType = r.type || ruleType;
          tv[oldType] = String(r.path || "");
          const restored = tv[newType] !== undefined ? tv[newType] : "";
          r.type = newType;
          r.path = restored;
          syncEntryRules();
          await this.plugin.saveSettings();
          renderRules();
        };
        typeSel.addEventListener("change", typeHandler);

        const modeHandler = async () => {
          r.mode = modeSel.value === "exclude" ? "exclude" : "include";
          syncEntryRules();
          await this.plugin.saveSettings();
          renderRules();
        };
        modeSel.addEventListener("change", modeHandler);

        // Choose area: one full-width button, two (key + value) for property,
        // or a text input for pattern.
        const chooseArea = row.createEl("div");
        chooseArea.style.display = "flex";
        chooseArea.style.gap = "8px";
        chooseArea.style.flex = "1 1 auto";
        chooseArea.style.minWidth = "160px";

        const clip = (b) => {
          b.style.overflow = "hidden";
          b.style.textOverflow = "ellipsis";
          b.style.whiteSpace = "nowrap";
          b.style.textAlign = "left";
          b.style.padding = "6px 10px";
          b.style.border = "1px solid var(--background-modifier-border)";
          b.style.borderRadius = "var(--radius-m)";
        };
        const openPicker = (type, cb) => {
          new RulePickerModal(this.app, this.plugin, type, cb).open();
        };
        const refreshLabels = () => {
          const t = typeSel.value;
          const raw = String(r.path || "");
          chooseArea.empty();
          if (t === "property") {
            const ci = raw.indexOf(":");
            const key = ci > -1 ? raw.slice(0, ci).trim() : raw;
            const val = ci > -1 ? raw.slice(ci + 1).trim() : "";
            const keyBtn = chooseArea.createEl("button", {
              text: key ? key : this.plugin.t("rule_choose_key", "Choose key…"),
            });
            clip(keyBtn);
            keyBtn.style.flex = "1 1 auto";
            keyBtn.addEventListener("click", () => {
              openPicker("property", (v) => {
                r.path = String(v || "");
                r.type = "property";
                syncEntryRules();
                this.plugin.saveSettings();
                renderRules();
              });
            });
            const valBtn = chooseArea.createEl("button", {
              text:
                val ? val : this.plugin.t("rule_choose_value", "Choose value…"),
            });
            clip(valBtn);
            valBtn.style.flex = "1 1 auto";
            valBtn.addEventListener("click", () => {
              const cur = String(r.path || "");
              const curCi = cur.indexOf(":");
              const curKey = curCi > -1 ? cur.slice(0, curCi).trim() : cur;
              new RuleValueModal(this.app, this.plugin, val, (v) => {
                r.path = (curKey ? curKey + ": " : "") + String(v || "");
                r.type = "property";
                syncEntryRules();
                this.plugin.saveSettings();
                renderRules();
              }).open();
            });
          } else if (t === "pattern") {
            const inp = chooseArea.createEl("input", {
              type: "text",
              value: raw,
            });
            inp.placeholder = this.plugin.t(
              "rule_pattern_placeholder",
              "matches file/folder title",
            );
            inp.style.flex = "1 1 auto";
            inp.style.padding = "6px 10px";
            inp.style.border = "1px solid var(--background-modifier-border)";
            inp.style.borderRadius = "var(--radius-m)";
            const patternInputHandler = () => {
              r.path = String(inp.value || "").trim();
              r.type = "pattern";
              syncEntryRules();
              this.plugin.saveSettings();
              renderRules();
            };
            inp.addEventListener("change", patternInputHandler);
          } else {
            const btn = chooseArea.createEl("button", {
              text:
                raw ||
                this.plugin.t(
                  "rule_choose_placeholder_" + t,
                  "Choose " + t + "…",
                ),
            });
            clip(btn);
            btn.style.flex = "1 1 auto";
            btn.addEventListener("click", () => {
              const type = typeSel.value;
              openPicker(type, (v) => {
                let p = String(v || "");
                if (type === "folder") {
                  if (!p.endsWith("/")) p += "/";
                } else if (type === "tag") {
                  if (!p.startsWith("#")) p = "#" + p;
                }
                r.path = p;
                r.type = type;
                syncEntryRules();
                this.plugin.saveSettings();
                renderRules();
              });
            });
          }
        };
        refreshLabels();

        const delBtn = row.createEl("button", {
          text: this.plugin.t("delete_button_text", "✕"),
        });
        delBtn.addClass("mod-warning");
        delBtn.addEventListener("click", async () => {
          this._rules.splice(idx, 1);
          syncEntryRules();
          await this.plugin.saveSettings();
          renderRules();
        });
      });
    };
    const addRuleFn = async () => {
      try {
        this._rules.push({
          path: "",
          type: "file",
          mode: "include",
          isRegex: false,
          flags: "",
        });
        syncEntryRules();
        await this.plugin.saveSettings();
        renderRules();
      } catch (e) {}
    };

    addRuleBtn.addEventListener("click", addRuleFn);
    this._handlers.push({ el: addRuleBtn, ev: "click", fn: addRuleFn });
    renderRules();
    updatePickerVisibility();
    renderPreview();
    const saveRow = contentEl.createDiv();
    saveRow.style.display = "flex";
    saveRow.style.justifyContent = "flex-end";
    saveRow.style.marginTop = "14px";
    const saveBtn = saveRow.createEl("button", {
      text: this.plugin.t("btn_save_entry", "Save Entry"),
    });
    saveBtn.addClass("mod-cta");
    const saveHandler = async (shouldClose = true) => {
      // Collect current UI values from EditEntryModal
      const st = styleSelect.value;
      let matchTypeVal = isRegex ? "regex" : (matchSelect ? matchSelect.value : "exact");
      if (matchTypeVal === "startsWith") matchTypeVal = "startswith";
      if (matchTypeVal === "endsWith") matchTypeVal = "endswith";
      const caseSensitiveVal = caseSel.value === "case";
      const textColorVal = textColorInput.value || "";
      const bgColorVal = bgColorInput.value || "";
      const patternVal = String(textInput.value || "").trim();

      // Check if this is a new entry from pick modal and if anything was actually changed
      if (this.entry._isNewFromPickModal && this.entry._originalState) {
        const originalState = this.entry._originalState;

        // Treat #000000 as "no color" when the original had no color set —
        // this prevents saving a black entry when the user opened edit without
        // picking a color first (browser color inputs default to #000000).
        const noOriginalText = !originalState.color && !originalState.textColor;
        const noOriginalBg   = !originalState.backgroundColor;
        const effectiveText  = (noOriginalText && textColorVal === "#000000") ? "" : textColorVal;
        const effectiveBg    = (noOriginalBg   && bgColorVal   === "#000000") ? "" : bgColorVal;

        // If both effective colors are empty and the original had none, block save entirely
        if (noOriginalText && noOriginalBg && !effectiveText && !effectiveBg) {
          if (shouldClose) this.close();
          return;
        }

        const hasChanges =
          patternVal !== originalState.pattern ||
          st !== originalState.styleType ||
          effectiveText !== (originalState.color || "") ||
          effectiveBg !== (originalState.backgroundColor || "") ||
          matchTypeVal !== originalState.matchType ||
          markTargetSelect.value !== (originalState.markTarget || "text") ||
          this.entry.customCss !== undefined;

        // If no changes were made, just close the modal without saving
        if (!hasChanges) {
          if (shouldClose) this.close();
          return;
        }
      }

      // Update per-entry case sensitivity (do NOT write to global settings)
      this.entry.caseSensitive = caseSensitiveVal;

      // Find entry by uid - more reliable than reference comparison
      const entryUid = this.entry.uid;
      let foundEntry = null;
      let foundIdx = -1;
      let foundArray = null;

      // Search in wordEntries
      for (let i = 0; i < this.plugin.settings.wordEntries.length; i++) {
        if (this.plugin.settings.wordEntries[i].uid === entryUid) {
          foundEntry = this.plugin.settings.wordEntries[i];
          foundIdx = i;
          foundArray = this.plugin.settings.wordEntries;
          break;
        }
      }

      // If not found in wordEntries, search in wordEntryGroups
      if (!foundEntry && Array.isArray(this.plugin.settings.wordEntryGroups)) {
        for (const g of this.plugin.settings.wordEntryGroups) {
          if (!g || !Array.isArray(g.entries)) continue;
          const j = g.entries.findIndex((e) => e && e.uid === entryUid);
          if (j !== -1) {
            foundEntry = g.entries[j];
            foundIdx = j;
            foundArray = g.entries;
            break;
          }
        }
      }

      // If not found in wordEntries or groups, search in textBgColoringEntries
      if (!foundEntry) {
        for (
          let i = 0;
          i < this.plugin.settings.textBgColoringEntries.length;
          i++
        ) {
          if (this.plugin.settings.textBgColoringEntries[i].uid === entryUid) {
            foundEntry = this.plugin.settings.textBgColoringEntries[i];
            foundIdx = i;
            foundArray = this.plugin.settings.textBgColoringEntries;
            break;
          }
        }
      }

      // Update entry in global settings if found there
      if (foundEntry && foundIdx !== -1 && foundArray) {
        // Handle pattern changes
        if (!isRegex) {
          if (!patternVal) {
            foundArray.splice(foundIdx, 1);
          } else {
            const parts = patternVal
              .split(",")
              .map((p) => String(p).trim())
              .filter((p) => p.length > 0);
            foundArray[foundIdx].pattern = parts[0];
            foundArray[foundIdx].groupedPatterns =
              parts.length > 1 ? parts : null;
          }
        }

        // Save entry properties
        foundArray[foundIdx].matchType = matchTypeVal;
        foundArray[foundIdx].caseSensitive = caseSensitiveVal;
        foundArray[foundIdx].styleType = st;
        foundArray[foundIdx].markTarget = markTargetSelect.value || "text";

        // Save color values based on style type
        if (st === "text") {
          foundArray[foundIdx].color = textColorVal;
          foundArray[foundIdx].textColor = null;
          foundArray[foundIdx].backgroundColor = null;
        } else if (st === "highlight") {
          foundArray[foundIdx].color = "";
          foundArray[foundIdx].textColor = "currentColor";
          foundArray[foundIdx].backgroundColor = bgColorVal;
        } else {
          foundArray[foundIdx].color = "";
          foundArray[foundIdx].textColor = textColorVal;
          foundArray[foundIdx].backgroundColor = bgColorVal;
        }

        // Preserve entry-specific highlight styling parameters from this.entry only
        if (typeof this.entry.backgroundOpacity === "number")
          foundArray[foundIdx].backgroundOpacity = this.entry.backgroundOpacity;
        if (typeof this.entry.highlightBorderRadius === "number")
          foundArray[foundIdx].highlightBorderRadius =
            this.entry.highlightBorderRadius;
        if (typeof this.entry.highlightHorizontalPadding === "number")
          foundArray[foundIdx].highlightHorizontalPadding =
            this.entry.highlightHorizontalPadding;
        if (typeof this.entry.highlightVerticalPadding === "number")
          foundArray[foundIdx].highlightVerticalPadding =
            this.entry.highlightVerticalPadding;
        if (typeof this.entry.enableBorderThickness === "boolean")
          foundArray[foundIdx].enableBorderThickness =
            this.entry.enableBorderThickness;
        if (this.entry.borderStyle)
          foundArray[foundIdx].borderStyle = this.entry.borderStyle;
        if (this.entry.borderLineStyle)
          foundArray[foundIdx].borderLineStyle = this.entry.borderLineStyle;
        if (typeof this.entry.borderOpacity === "number")
          foundArray[foundIdx].borderOpacity = this.entry.borderOpacity;
        if (typeof this.entry.borderThickness === "number")
          foundArray[foundIdx].borderThickness = this.entry.borderThickness;
        // Persist inclusion/exclusion rules
        if (this.entry.inclusionRules)
          foundArray[foundIdx].inclusionRules = this.entry.inclusionRules;
        if (this.entry.exclusionRules)
          foundArray[foundIdx].exclusionRules = this.entry.exclusionRules;
        // Persist custom CSS
        if (this.entry.customCss !== undefined)
          foundArray[foundIdx].customCss = this.entry.customCss;
        // Leave undefined values as-is to inherit global defaults

        // Phase 1: Link Identical Matchers (write-through with confirmation)
        // Only prompt when this save actually changed the entry vs. its
        // state when the modal was opened (entries are mutated live while
        // editing, so we compare against the open-time snapshot).
        const _entryChanged =
          JSON.stringify(foundArray[foundIdx]) !== this._originalSnapshot;
        if (
          this.plugin.settings.linkIdenticalMatchers &&
          foundEntry &&
          _entryChanged
        ) {
          const updatedEntry = foundArray[foundIdx];
          const newKey = matcherKey({
            pattern: updatedEntry.pattern,
            isRegex: !!updatedEntry.isRegex,
            flags: updatedEntry.flags || '',
            matchType: updatedEntry.matchType,
          });
          const others = findEntriesWithMatcherKey(
            this.plugin.settings,
            newKey,
            this.entry.uid,
          );
          if (others.length > 0) {
            const choice = await new Promise((resolve) => {
              new LinkedMatcherModal(
                this.app,
                this.plugin,
                others,
                () => resolve('all'),
                () => resolve('single'),
              ).open();
            });
            if (choice === 'all') {
              propagateStyle(updatedEntry, others);
            }
          }
        }

        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.forceRefreshAllReadingViews();
        this.plugin.triggerActiveDocumentRerender();
        try {
          this.onSaved && this.onSaved(this.entry);
        } catch (e) {}

        // Close parent modal; reopen only when appropriate
        if (this.parentModal) {
          try {
            // Prevent ColorPickerModal.onClose from running its submit/delete logic
            // since we've already saved the entry correctly here
            if (this.fromPickColorModal) {
              this.parentModal._hasUserChanges = false;
            }
            this.parentModal.close();
            if (
              !this.fromPickColorModal &&
              this.parentModal instanceof AddToExistingEntryModal
            ) {
              setTimeout(() => {
                try {
                  new AddToExistingEntryModal(
                    this.app,
                    this.plugin,
                    this.parentModal.selectedText,
                    this.parentModal.view,
                  ).open();
                } catch (e) {}
              }, 100);
            }
          } catch (e) {}
        }
      } else if (this.parentModal) {
        // Entry not found in global settings - likely a new entry from pick modal
        // Add it to wordEntries
        if (!patternVal) {
          this.close();
          return;
        }

        const newEntry = {
          pattern: patternVal.split(",")[0],
          groupedPatterns:
            patternVal.split(",").length > 1
              ? patternVal
                  .split(",")
                  .map((p) => String(p).trim())
                  .filter((p) => p.length > 0)
              : null,
          color: st === "text" ? textColorVal : "",
          textColor:
            st === "both"
              ? textColorVal
              : st === "highlight"
                ? "currentColor"
                : null,
          backgroundColor:
            st === "highlight" || st === "both" ? bgColorVal : null,
          isRegex: false,
          flags: "",
          styleType: st,
          markTarget: markTargetSelect.value || "text",
          matchType: matchTypeVal,
          caseSensitive: caseSensitiveVal,
          uid: this.entry.uid,
        };

        // Copy over any styling properties
        if (typeof this.entry.backgroundOpacity === "number")
          newEntry.backgroundOpacity = this.entry.backgroundOpacity;
        if (typeof this.entry.highlightBorderRadius === "number")
          newEntry.highlightBorderRadius = this.entry.highlightBorderRadius;
        if (typeof this.entry.highlightHorizontalPadding === "number")
          newEntry.highlightHorizontalPadding =
            this.entry.highlightHorizontalPadding;
        if (typeof this.entry.highlightVerticalPadding === "number")
          newEntry.highlightVerticalPadding =
            this.entry.highlightVerticalPadding;
        if (typeof this.entry.enableBorderThickness === "boolean")
          newEntry.enableBorderThickness = this.entry.enableBorderThickness;
        if (this.entry.borderStyle)
          newEntry.borderStyle = this.entry.borderStyle;
        if (this.entry.borderLineStyle)
          newEntry.borderLineStyle = this.entry.borderLineStyle;
        if (typeof this.entry.borderOpacity === "number")
          newEntry.borderOpacity = this.entry.borderOpacity;
        if (typeof this.entry.borderThickness === "number")
          newEntry.borderThickness = this.entry.borderThickness;

        // Persist inclusion/exclusion rules
        if (this.entry.inclusionRules)
          newEntry.inclusionRules = this.entry.inclusionRules;
        if (this.entry.exclusionRules)
          newEntry.exclusionRules = this.entry.exclusionRules;
        // Persist custom CSS
        if (this.entry.customCss !== undefined)
          newEntry.customCss = this.entry.customCss;

        const toGroupUid = groupSelect.value || "";
        if (toGroupUid) {
          const groupsList = Array.isArray(this.plugin.settings.wordEntryGroups)
            ? this.plugin.settings.wordEntryGroups
            : [];
          const tgtGroup = groupsList.find((g) => g && g.uid === toGroupUid);
          if (tgtGroup) {
            if (!Array.isArray(tgtGroup.entries)) tgtGroup.entries = [];
            tgtGroup.entries.push(newEntry);
          } else {
            this.plugin.settings.wordEntries.push(newEntry);
          }
        } else {
          this.plugin.settings.wordEntries.push(newEntry);
        }

        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.forceRefreshAllReadingViews();
        this.plugin.triggerActiveDocumentRerender();
        try {
          this.onSaved && this.onSaved(newEntry);
        } catch (e) {}

        // Close parent modal
        if (this.parentModal) {
          try {
            // Prevent ColorPickerModal.onClose from running its submit/delete logic
            if (this.fromPickColorModal) {
              this.parentModal._hasUserChanges = false;
            }
            this.parentModal.close();
          } catch (e) {}
        }
      } else {
        // Fallback: update this.entry directly
        if (!isRegex) {
          if (patternVal) {
            const parts = patternVal
              .split(",")
              .map((p) => String(p).trim())
              .filter((p) => p.length > 0);
            this.entry.pattern = parts[0];
            this.entry.groupedPatterns = parts.length > 1 ? parts : null;
          }
        }

        this.entry.matchType = matchTypeVal;
        this.entry.styleType = st;
        this.entry.markTarget = markTargetSelect.value || "text";

        if (st === "text") {
          this.entry.color = textColorVal;
          this.entry.textColor = null;
          this.entry.backgroundColor = null;
        } else if (st === "highlight") {
          this.entry.color = "";
          this.entry.textColor = "currentColor";
          this.entry.backgroundColor = bgColorVal;
        } else {
          this.entry.color = "";
          this.entry.textColor = textColorVal;
          this.entry.backgroundColor = bgColorVal;
        }

        if (this.entry.customCss) {
          this.plugin.syncEntryCssFromColors(this.entry);
        }

        try {
          this.onSaved && this.onSaved(this.entry);
        } catch (e) {}
      }

      if (shouldClose) this.close();
    };
    const boundSave = () => saveHandler(true);
    saveBtn.addEventListener("click", boundSave);
    this._handlers.push({ el: saveBtn, ev: "click", fn: boundSave });
    this._saveData = saveHandler;

    // Store references to functions for external access
    this._refreshPreview = renderPreview;
  }
  _applyPreset(preset) {
    if (!this.entry || !preset) return;
    const keys = [
      "styleType",
      "textColor",
      "backgroundColor",
      "backgroundOpacity",
      "highlightBorderRadius",
      "highlightHorizontalPadding",
      "highlightVerticalPadding",
      "enableBorderThickness",
      "borderStyle",
      "borderLineStyle",
      "borderOpacity",
      "borderThickness",
      "customCss",
    ];
    for (const k of keys) {
      if (k in preset) this.entry[k] = preset[k];
    }
    try {
      if (preset.styleType && this._styleSelect) {
        this._styleSelect.value = preset.styleType;
      }
    } catch (e) {}
    const tc =
      preset.textColor && preset.textColor !== "currentColor"
        ? preset.textColor
        : "";
    const bc = preset.backgroundColor ? preset.backgroundColor : "";
    try {
      if (this._textColorInput)
        this._textColorInput.value = this.plugin.isValidHexColor(tc)
          ? tc
          : "#000000";
    } catch (e) {}
    try {
      if (this._bgColorInput)
        this._bgColorInput.value = this.plugin.isValidHexColor(bc)
          ? bc
          : "#000000";
    } catch (e) {}
    try {
      this._refreshPreview();
    } catch (e) {}

    // Baseline for change detection (used by Link Identical Matchers).
    try {
      this._originalSnapshot = JSON.stringify(this.entry || {});
    } catch (e) {
      this._originalSnapshot = "";
    }
  }

  onClose() {
    try {
      if (this._saveData) this._saveData(false);
    } catch (e) {}
    try {
      this._handlers.forEach((h) => {
        try {
          h.el.removeEventListener(h.ev, h.fn);
        } catch (e) {}
      });
    } catch (e) {}
    try {
      this._dropdownCleanups.forEach((cleanup) => {
        try {
          cleanup();
        } catch (e) {}
      });
    } catch (e) {}
    this._handlers = [];
    this._dropdownCleanups = [];
    try {
      this.contentEl.empty();
    } catch (e) {}
  }
}
