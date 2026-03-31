import { Modal, Notice } from 'obsidian';
import { ColorPickerModal } from './ColorPickerModal.js';
import { HighlightStylingModal } from './HighlightStylingModal.js';
import { RealTimeRegexTesterModal } from './RealTimeRegexTesterModal.js';
import { CustomCssModal } from './CustomCssModal.js';
import { AddToExistingEntryModal } from './AddToExistingEntryModal.js';

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
      this.modalEl.addClass("act-edit-entry-modal");
      this.modalEl.style.maxWidth = "900px";
      this.modalEl.style.padding = "20px";
    } catch (e) {}

    // Determine if regex early
    const isRegex = !!(this.entry && this.entry.isRegex);

    const title = contentEl.createEl("h2", {
      text: this.plugin.t("edit_entry_header", "Edit Entry"),
    });
    title.style.marginTop = "0";
    title.style.marginBottom = "12px";
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

    // Main layout: two columns (left: input/preview, right: controls)
    const mainContainer = contentEl.createDiv();
    mainContainer.style.display = "flex";
    mainContainer.style.gap = "8px";
    mainContainer.style.width = "100%";
    mainContainer.style.boxSizing = "border-box";

    // Left column: text input + preview
    const leftColumn = mainContainer.createDiv();
    leftColumn.addClass("act-edit-entry-left-column");
    leftColumn.style.flex = "1";
    leftColumn.style.minWidth = "0";
    leftColumn.style.display = "flex";
    leftColumn.style.flexDirection = "column";

    // Row 1: input
    const row1 = leftColumn.createDiv();
    row1.addClass("act-edit-entry-row1");
    const box = row1.createDiv();
    box.addClass("act-edit-entry-textbox");
    box.style.border = "1px solid var(--background-modifier-border)";
    box.style.borderRadius = "4px";
    box.style.background = "var(--background-modifier-form-field)";
    const textInput = box.createEl("textarea");
    textInput.style.width = "100%";
    textInput.style.height = "40px";
    textInput.style.resize = "none";
    textInput.style.border = "none";
    textInput.style.outline = "none";
    textInput.style.background = "transparent";
    textInput.style.color = "var(--text-normal)";
    textInput.style.padding = "6px";
    textInput.style.boxSizing = "border-box";

    // Row 2: preview
    const row2 = leftColumn.createDiv();
    row2.addClass("act-edit-entry-row2");

    const preview = row2.createDiv();
    preview.addClass("act-edit-entry-preview");
    preview.style.display = "block";
    preview.style.flex = "1";
    preview.style.border = "1px dashed var(--background-modifier-border)";
    preview.style.borderRadius = "4px";
    preview.style.padding = "10px";
    preview.style.background = "var(--background-modifier-form-field)";
    preview.style.whiteSpace = "pre-wrap";
    preview.style.wordWrap = "break-word";
    // preview.style.minHeight = "60px";

    // Right column: controls
    const rightColumn = mainContainer.createDiv();
    rightColumn.addClass("act-edit-entry-right-column");
    rightColumn.style.flex = "0 0 auto";
    rightColumn.style.display = "flex";
    rightColumn.style.flexDirection = "column";
    rightColumn.style.gap = "8px";

    const styleSelect = rightColumn.createEl("select");
    styleSelect.addClass("act-edit-entry-style-select");
    styleSelect.style.minWidth = "140px";
    ["text", "highlight", "both"].forEach((val) => {
      const opt = styleSelect.createEl("option", {
        text: this.plugin.t(
          "style_type_" + val,
          val === "text" ? "color" : val,
        ),
      });
      opt.value = val;
    });
    styleSelect.style.border = "1px solid var(--background-modifier-border)";
    styleSelect.style.borderRadius = "4px";
    styleSelect.style.background = "var(--background-modifier-form-field)";
    styleSelect.style.textAlign = "center";
    styleSelect.style.flex = "1 0%";

    const pickerRow = rightColumn.createDiv();
    pickerRow.addClass("act-edit-entry-pickers");
    pickerRow.style.flex = "0";
    pickerRow.style.display = "flex";
    pickerRow.style.gap = "8px";
    pickerRow.style.alignItems = "center";
    pickerRow.style.justifyContent = "center";
    const textColorInput = pickerRow.createEl("input", { type: "color" });
    const bgColorInput = pickerRow.createEl("input", { type: "color" });

    // Add right-click handlers for color pickers to open ColorPickerModal
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
          (color, result) => {
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

    // Row 3: group/match/case/regex/styling
    const controls = contentEl.createDiv();
    controls.addClass("act-edit-entry-controls");
    controls.style.display = "flex";
    controls.style.flexWrap = "wrap";
    controls.style.gap = "8px";
    controls.style.marginTop = "12px";
    controls.style.alignItems = "center";
    controls.style.width = "100%";
    controls.style.boxSizing = "border-box";

    const groupSelect = controls.createEl("select");
    groupSelect.addClass("act-edit-entry-group-select");
    groupSelect.style.flex = "1 1 max-content";
    groupSelect.style.minWidth = "max-content";
    groupSelect.style.maxWidth = "100%";
    groupSelect.style.width = "auto";
    groupSelect.style.height = "32px";
    groupSelect.style.padding = "0 10px";
    groupSelect.style.boxSizing = "border-box";
    groupSelect.style.border = "1px solid var(--background-modifier-border)";
    groupSelect.style.borderRadius = "4px";
    groupSelect.style.background = "var(--background-modifier-form-field)";
    groupSelect.style.textAlign = "center";
    const defaultOpt = groupSelect.createEl("option", {
      text: this.plugin.t("default"),
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

    const matchSelect = controls.createEl("select");
    matchSelect.style.flex = "0.5 0 auto";
    matchSelect.style.minWidth = "160px";
    matchSelect.style.height = "32px";
    matchSelect.style.padding = "0 10px";
    matchSelect.style.boxSizing = "border-box";
    matchSelect.style.border = "1px solid var(--background-modifier-border)";
    matchSelect.style.borderRadius = "4px";
    matchSelect.style.background = "var(--background-modifier-form-field)";
    matchSelect.style.textAlign = "center";
    matchSelect.innerHTML = `<option value="exact">${this.plugin.t("match_option_exact", "exact")}</option><option value="contains">${this.plugin.t("match_option_contains", "contains")}</option><option value="startsWith">${this.plugin.t("match_option_starts_with", "starts with")}</option><option value="endsWith">${this.plugin.t("match_option_ends_with", "ends with")}</option>`;

    const caseSel = controls.createEl("select");
    caseSel.style.flex = "0.5 0 auto";
    caseSel.style.minWidth = "160px";
    caseSel.style.height = "32px";
    caseSel.style.padding = "0 10px";
    caseSel.style.boxSizing = "border-box";
    caseSel.style.border = "1px solid var(--background-modifier-border)";
    caseSel.style.borderRadius = "4px";
    caseSel.style.background = "var(--background-modifier-form-field)";
    caseSel.style.textAlign = "center";
    caseSel.innerHTML = `<option value="case">${this.plugin.t("opt_case_sensitive", "is case sensitive")}</option><option value="nocase">${this.plugin.t("opt_not_case_sensitive", "not case sensitive")}</option>`;
    let openRegexBtn = null;
    if (isRegex) {
      openRegexBtn = controls.createEl("button", {
        text: this.plugin.t("open_in_regex_tester", "Open in Regex Tester"),
      });
      openRegexBtn.style.flex = "1 1 max-content";
      openRegexBtn.style.minWidth = "max-content";
      openRegexBtn.style.maxWidth = "100%";
      openRegexBtn.style.width = "auto";
      openRegexBtn.style.height = "32px";
      openRegexBtn.style.padding = "0 10px";
      openRegexBtn.style.boxSizing = "border-box";
      openRegexBtn.style.whiteSpace = "nowrap";
    }
    const hlBtn = controls.createEl("button", {
      text: this.plugin.t(
        "edit_highlight_styling_btn",
        "Edit Highlight Styling",
      ),
    });
    hlBtn.style.flex = "1 1 max-content";
    hlBtn.style.minWidth = "max-content";
    hlBtn.style.maxWidth = "100%";
    hlBtn.style.width = "auto";
    hlBtn.style.height = "32px";
    hlBtn.style.padding = "0 10px";
    hlBtn.style.boxSizing = "border-box";
    hlBtn.style.whiteSpace = "nowrap";
    let cssBtn = null;
    if (this.plugin.settings.enableCustomCss) {
      cssBtn = controls.createEl("button", {
        text: this.plugin.t("edit_custom_css_btn", "Edit Custom CSS"),
      });
      cssBtn.style.flex = "1 1 max-content";
      cssBtn.style.minWidth = "max-content";
      cssBtn.style.maxWidth = "100%";
      cssBtn.style.width = "auto";
      cssBtn.style.height = "32px";
      cssBtn.style.padding = "0 10px";
      cssBtn.style.boxSizing = "border-box";
      cssBtn.style.whiteSpace = "nowrap";
    }
    const rulesHeader = contentEl.createEl("h3", {
      text: this.plugin.t(
        "inclusion_exclusion_header",
        "Inclusion / Exclusion Rules",
      ),
    });
    const rulesContainer = contentEl.createDiv();
    rulesContainer.style.marginTop = "8px";
    const addRuleBtn = contentEl.createEl("button", {
      text: this.plugin.t("btn_add_rule", "+ Add Rule"),
    });
    addRuleBtn.addClass("mod-cta");
    addRuleBtn.style.marginTop = "6px";
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
    // const isRegex = !!this.entry.isRegex; // Already defined at top
    if (isRegex) {
      textInput.value = this.entry.pattern || "";
      matchSelect.disabled = true;
      matchSelect.style.opacity = "0.5";
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
      hlBtn.style.display = v === "text" ? "none" : "";
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
      if (isRegex) return;
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
    matchSelect.addEventListener("change", matchFn);
    this._handlers.push({ el: matchSelect, ev: "change", fn: matchFn });
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
    const renderRules = () => {
      rulesContainer.empty();
      const inc = Array.isArray(this.entry.inclusionRules)
        ? this.entry.inclusionRules
        : [];
      const exc = Array.isArray(this.entry.exclusionRules)
        ? this.entry.exclusionRules
        : [];
      const combined = [
        ...inc.map((r, idx) => ({ ...r, _mode: "include", _idx: idx })),
        ...exc.map((r, idx) => ({ ...r, _mode: "exclude", _idx: idx })),
      ];
      combined.forEach((r) => {
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
        modeSel.value = r._mode === "exclude" ? "exclude" : "include";
        modeSel.style.textAlign = "center";
        modeSel.style.minWidth = "160px";
        modeSel.style.border = "1px solid var(--background-modifier-border)";
        modeSel.style.borderRadius = "var(--radius-m)";
        modeSel.style.background = "var(--background-modifier-form-field)";
        const pathInput = row.createEl("input", {
          type: "text",
          value: String(r.path || ""),
          placeholder: this.plugin.t(
            "enter_path_or_pattern",
            "Enter path, pattern or tags",
          ),
        });
        pathInput.style.flex = "1";
        pathInput.style.padding = "6px";
        pathInput.style.border = "1px solid var(--background-modifier-border)";
        pathInput.style.borderRadius = "var(--radius-m)";
        const delBtn = row.createEl("button", {
          text: this.plugin.t("delete_button_text", "✕"),
        });
        delBtn.addClass("mod-warning");
        const modeHandler = async () => {
          const currMode = r._mode;
          const nextMode = modeSel.value === "exclude" ? "exclude" : "include";
          if (currMode === nextMode) return;
          // Remove from current array and add to target array
          try {
            if (currMode === "include") {
              const idx = inc.indexOf(inc[r._idx]);
              if (idx > -1) inc.splice(idx, 1);
              exc.push({
                path: String(r.path || ""),
                isRegex: !!r.isRegex,
                flags: String(r.flags || "").replace(/[^gimsuy]/g, ""),
              });
            } else {
              const idx = exc.indexOf(exc[r._idx]);
              if (idx > -1) exc.splice(idx, 1);
              inc.push({
                path: String(r.path || ""),
                isRegex: !!r.isRegex,
                flags: String(r.flags || "").replace(/[^gimsuy]/g, ""),
              });
            }
            this.entry.inclusionRules = inc;
            this.entry.exclusionRules = exc;
            await this.plugin.saveSettings();
            renderRules();
          } catch (e) {}
        };
        modeSel.addEventListener("change", modeHandler);
        const updateDropdown = () => {
          if (pathInput._actDropdown) {
            const dd = pathInput._actDropdown;
            if (pathInput._dropdownScrollListener) {
              document.removeEventListener(
                "scroll",
                pathInput._dropdownScrollListener,
                true,
              );
              pathInput._dropdownScrollListener = null;
            }
            if (pathInput._dropdownClickListener) {
              document.removeEventListener(
                "click",
                pathInput._dropdownClickListener,
              );
              pathInput._dropdownClickListener = null;
            }
            if (pathInput._dropdownKeyListener) {
              document.removeEventListener(
                "keydown",
                pathInput._dropdownKeyListener,
              );
              pathInput._dropdownKeyListener = null;
            }
            dd.remove();
            pathInput._actDropdown = null;
          }
          const val = String(pathInput.value || "")
            .trim()
            .toLowerCase();
          const list = [];
          sugg.folders.forEach((f) => list.push({ t: "folder", p: f }));
          sugg.files.forEach((f) => list.push({ t: "file", p: f }));
          const filteredList = val
            ? list.filter((x) => x.p.toLowerCase().includes(val))
            : list;
          if (filteredList.length === 0) return;
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
            minWidth: Math.max(240, pathInput.offsetWidth) + "px",
          });
          let hi = -1;
          filteredList.forEach((item) => {
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
            it.onclick = (e) => {
              e.stopPropagation();
              pathInput.value = item.p + (item.t === "folder" ? "/" : "");
              const ev = new Event("change", { bubbles: true });
              pathInput.dispatchEvent(ev);
              dd.remove();
              pathInput._actDropdown = null;
            };
            dd.appendChild(it);
          });
          document.body.appendChild(dd);
          const pos = () => {
            const rct = pathInput.getBoundingClientRect();
            dd.style.left = rct.left + "px";
            dd.style.top = rct.bottom + 6 + "px";
            dd.style.width = pathInput.offsetWidth + "px";
          };
          pos();
          pathInput._actDropdown = dd;
          pathInput._dropdownScrollListener = pos;
          pathInput._dropdownClickListener = (ev) => {
            if (ev.target === pathInput) return;
            if (!dd.contains(ev.target)) {
              dd.remove();
              pathInput._actDropdown = null;
              document.removeEventListener(
                "click",
                pathInput._dropdownClickListener,
              );
              document.removeEventListener(
                "scroll",
                pathInput._dropdownScrollListener,
                true,
              );
              document.removeEventListener(
                "keydown",
                pathInput._dropdownKeyListener,
              );
              pathInput._dropdownClickListener = null;
              pathInput._dropdownScrollListener = null;
              pathInput._dropdownKeyListener = null;
            }
          };
          pathInput._dropdownKeyListener = (ev) => {
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
              pathInput._actDropdown = null;
              document.removeEventListener(
                "keydown",
                pathInput._dropdownKeyListener,
              );
              pathInput._dropdownKeyListener = null;
            }
          };
          document.addEventListener("scroll", pos, true);
          document.addEventListener("click", pathInput._dropdownClickListener);
          document.addEventListener("keydown", pathInput._dropdownKeyListener);
          // Track cleanup for onClose
          this._dropdownCleanups.push(() => {
            if (pathInput._actDropdown) {
              const dd = pathInput._actDropdown;
              if (pathInput._dropdownScrollListener)
                document.removeEventListener(
                  "scroll",
                  pathInput._dropdownScrollListener,
                  true,
                );
              if (pathInput._dropdownClickListener)
                document.removeEventListener(
                  "click",
                  pathInput._dropdownClickListener,
                );
              if (pathInput._dropdownKeyListener)
                document.removeEventListener(
                  "keydown",
                  pathInput._dropdownKeyListener,
                );
              dd.remove();
              pathInput._actDropdown = null;
            }
          });
        };
        const pathHandler = async () => {
          const newPath = String(pathInput.value || "");
          try {
            if (r._mode === "include") {
              inc[r._idx].path = newPath;
            } else {
              exc[r._idx].path = newPath;
            }
            this.entry.inclusionRules = inc;
            this.entry.exclusionRules = exc;
            await this.plugin.saveSettings();
          } catch (e) {}
        };
        pathInput.addEventListener("focus", updateDropdown);
        pathInput.addEventListener("click", updateDropdown);
        pathInput.addEventListener("input", updateDropdown);
        pathInput.addEventListener("change", pathHandler);
        const delHandler = async () => {
          try {
            if (r._mode === "include") {
              if (inc[r._idx]) inc.splice(r._idx, 1);
            } else {
              if (exc[r._idx]) exc.splice(r._idx, 1);
            }
            this.entry.inclusionRules = inc;
            this.entry.exclusionRules = exc;
            await this.plugin.saveSettings();
            renderRules();
          } catch (e) {}
        };
        delBtn.addEventListener("click", delHandler);
      });
      if (combined.length === 0) {
        // no output
      }
    };
    const addRuleFn = async () => {
      try {
        if (!Array.isArray(this.entry.inclusionRules))
          this.entry.inclusionRules = [];
        this.entry.inclusionRules.push({ path: "", isRegex: false, flags: "" });
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
      let matchTypeVal = isRegex ? "regex" : matchSelect.value;
      if (matchTypeVal === "startsWith") matchTypeVal = "startswith";
      if (matchTypeVal === "endsWith") matchTypeVal = "endswith";
      const caseSensitiveVal = caseSel.value === "case";
      const textColorVal = textColorInput.value || "";
      const bgColorVal = bgColorInput.value || "";
      const patternVal = String(textInput.value || "").trim();

      // Check if this is a new entry from pick modal and if anything was actually changed
      if (this.entry._isNewFromPickModal && this.entry._originalState) {
        const originalState = this.entry._originalState;
        const hasChanges =
          patternVal !== originalState.pattern ||
          st !== originalState.styleType ||
          textColorVal !== originalState.color ||
          bgColorVal !== originalState.backgroundColor ||
          matchTypeVal !== originalState.matchType;

        // If no changes were made, just close the modal without saving
        if (!hasChanges) {
          if (shouldClose) this.close();
          return;
        }
      }

      // Update global settings
      this.plugin.settings.caseSensitive = caseSensitiveVal;

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
        foundArray[foundIdx].styleType = st;

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
        // Leave undefined values as-is to inherit global defaults

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
          matchType: matchTypeVal,
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
        this.plugin.settings.caseSensitive = caseSensitiveVal;

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

