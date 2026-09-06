import { Modal, setIcon } from 'obsidian';
import { escapeHtml } from '../utils/debug.js';
import { ColorPickerModal } from './ColorPickerModal.js';
import { TextStylePresetsModal } from './TextStylePresetsModal.js';
import { deriveHighlightCssFromEntry, parseCssIntoEntry, patchCssLayoutFromEntry } from './CustomCssModal.js';

function resolveVarToHex(varStr) {
  try {
    const tmp = document.createElement("div");
    tmp.style.color = varStr;
    tmp.style.display = "none";
    document.body.appendChild(tmp);
    const computed = getComputedStyle(tmp).color;
    document.body.removeChild(tmp);
    const m = computed.match(/\d+/g);
    if (m && m.length >= 3) {
      return "#" + [m[0], m[1], m[2]].map(x => parseInt(x, 10).toString(16).padStart(2, "0")).join("");
    }
  } catch (_) {}
  return null;
}
function isVarColor(str) {
  return typeof str === "string" && /^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/.test(str.trim());
}
function setColorInputValue(input, colorStr) {
  if (!colorStr) {
    input.value = input.type === "color" ? "#000000" : "";
    delete input.dataset.varColor;
    return;
  }
  if (isVarColor(colorStr)) {
    input.dataset.varColor = colorStr.trim();
    const resolved = resolveVarToHex(colorStr);
    if (resolved) input.value = resolved;
    else if (input.type === "color") input.value = "#000000";
    else input.value = colorStr;
  } else {
    delete input.dataset.varColor;
    input.value = colorStr;
  }
}
function getColorInputValue(input) {
  if (input.dataset.varColor && isVarColor(input.dataset.varColor)) return input.dataset.varColor;
  return input.value;
}

export class HighlightStylingModal extends Modal {
  constructor(
    app,
    plugin,
    entry = null,
    parentEditEntryModal = null,
    previewTextOverride = null,
  ) {
    super(app);
    this.plugin = plugin;
    this.entry = entry;
    this.parentEditEntryModal = parentEditEntryModal;
    this.previewTextOverride = previewTextOverride;
    this._resetAllApplied = false;
    this._handlers = [];
  }
  onOpen() {
    const { contentEl } = this;
    this._hasUserChanges = false;

    // Global listener to detect user interaction and clear reset flag
    const clearResetFlag = () => {
      this._resetAllApplied = false;
      this._hasUserChanges = true;
    };
    contentEl.addEventListener("input", clearResetFlag, true);
    contentEl.addEventListener("change", clearResetFlag, true);
    this._handlers.push({ el: contentEl, ev: "input", fn: clearResetFlag });
    this._handlers.push({ el: contentEl, ev: "change", fn: clearResetFlag });

    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass("act-highlight-styling-modal");
      this.modalEl.addClass("act-highlight-modal");
      this.modalEl.style.padding = "20px";
    } catch (e) {}

    const isGroup = this.entry && Array.isArray(this.entry.entries);
    let stylePresetBtn = null;

    // If the entry has customCss, parse it into structured fields first so
    // sliders/inputs below read the correct values (makes CSS ↔ UI interchangeable)
    if (this.entry && this.entry.customCss && !isGroup) {
      try { parseCssIntoEntry(this.entry.customCss, this.entry, this.plugin); } catch (_) {}
    }

    // Header Row with Selects
    const headerRow = contentEl.createDiv();
    headerRow.addClass("act-highlight-header-row");
    headerRow.style.display = "flex";
    headerRow.style.alignItems = "center";
    headerRow.style.gap = "8px";
    headerRow.style.marginBottom = "12px";
    headerRow.style.flexWrap = "wrap";
    const fromQuickOnce =
      !!(this._fromQuickOnce || (this.entry && this.entry._quickOnce));

    const headerTitle = isGroup
      ? this.plugin.t(
          "edit_group_highlight_styling",
          "Edit Group Highlight Styling",
        )
      : this.plugin.t("highlight_styling_header", "Edit Highlight Styling");
    const title = headerRow.createEl("h2", { text: headerTitle });
    title.style.margin = "0";

    // Spacer to push selects to the right
    const spacer = headerRow.createDiv();
    spacer.style.flex = "1";

    // Group Select (Only show if NOT editing a group and not from Quick Once)
    if (!isGroup && !fromQuickOnce) {
      const groupSelect = headerRow.createEl("select");
      groupSelect.style.minWidth = "120px";
      groupSelect.style.border = "1px solid var(--background-modifier-border)";
      groupSelect.style.borderRadius = "4px";
      groupSelect.style.background = "var(--background-modifier-form-field)";
      const defaultOpt = groupSelect.createEl("option", {
        text: this.plugin.t("no_group", "No Group"),
      });
      defaultOpt.value = "";
      const groupsList = Array.isArray(this.plugin.settings.wordEntryGroups)
        ? this.plugin.settings.wordEntryGroups
        : [];
      groupsList.forEach((g) => {
        const name =
          g && g.name && String(g.name).trim().length > 0
            ? g.name
            : "(unnamed group)";
        const opt = groupSelect.createEl("option", { text: name });
        opt.value = g.uid || "";
      });
      // Find current group for this.entry
      let currentGroupUid = null;
      if (this.entry) {
        if (this.entry.groupUid) {
          currentGroupUid = this.entry.groupUid;
        } else {
          for (const g of groupsList) {
            if (g.entries && g.entries.includes(this.entry)) {
              currentGroupUid = g.uid;
              break;
            }
          }
        }
      }
      groupSelect.value = currentGroupUid || "";

      groupSelect.addEventListener("change", async () => {
        const toUid = groupSelect.value || "";
        const fromUid = currentGroupUid || "";
        if (toUid === fromUid) return;

        // Handle Quick Styles directly
        if (this.plugin.settings.quickStyles.includes(this.entry)) {
          this.entry.groupUid = toUid;
          currentGroupUid = toUid;
          await this.plugin.saveSettings();
          return;
        }

        const settings = this.plugin.settings;
        if (!Array.isArray(settings.wordEntries)) settings.wordEntries = [];
        if (!Array.isArray(settings.wordEntryGroups))
          settings.wordEntryGroups = [];

        // Step 1: Remove from ALL locations (not just the detected one)
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

        // Step 2: Add to new location
        if (toUid === "") {
          // Add to wordEntries (Default)
          try {
            delete this.entry.groupUid;
          } catch (_) {}
          settings.wordEntries.push(this.entry);
        } else {
          // Add to target group
          const tgtGroup = settings.wordEntryGroups.find(
            (g) => g && g.uid === toUid,
          );
          if (tgtGroup) {
            if (!Array.isArray(tgtGroup.entries)) tgtGroup.entries = [];
            try {
              this.entry.groupUid = toUid;
            } catch (_) {}
            tgtGroup.entries.push(this.entry);
          }
        }

        currentGroupUid = toUid;
        await this.plugin.saveSettings();

        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.triggerActiveDocumentRerender();
      });
    }

    // --- markTarget select (Color Text / Color Line / Color Child) ---
    if (!fromQuickOnce) {
      const markTargetSelect = headerRow.createEl("select");
      this._markTargetSelect = markTargetSelect;
      markTargetSelect.style.minWidth = "120px";
      markTargetSelect.style.border = "1px solid var(--background-modifier-border)";
      markTargetSelect.style.borderRadius = "4px";
      markTargetSelect.style.background = "var(--background-modifier-form-field)";

      [
        ["text", this.plugin.t("mark_target_text", "Color Text")],
        ["line", this.plugin.t("mark_target_line", "Color Line")],
        ["nextLine", this.plugin.t("mark_target_child_line", "Color Child")],
      ].forEach(([val, label]) => {
        const opt = markTargetSelect.createEl("option", { text: label });
        opt.value = val;
      });

      // Initialise from entry
      markTargetSelect.value =
        this.entry && this.entry.markTarget ? this.entry.markTarget : "text";

      markTargetSelect.addEventListener("change", async () => {
        if (!this.entry) return;
        this.entry.markTarget = markTargetSelect.value;
        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.triggerActiveDocumentRerender();
      });
    }

    // Match Select (hide for Quick Once)
    let matchSelect = null;
    if (!fromQuickOnce) {
      matchSelect = headerRow.createEl("select");
      matchSelect.style.minWidth = "120px";
      matchSelect.style.border = "1px solid var(--background-modifier-border)";
      matchSelect.style.borderRadius = "4px";
      matchSelect.style.background = "var(--background-modifier-form-field)";

      const caseSelect = headerRow.createEl("select");
      caseSelect.style.minWidth = "120px";
      caseSelect.style.marginLeft = "6px";
      caseSelect.style.border = "1px solid var(--background-modifier-border)";
      caseSelect.style.borderRadius = "4px";
      caseSelect.style.background = "var(--background-modifier-form-field)";
      caseSelect.innerHTML = `<option value="is_case_sensitive">${this.plugin.t("is_case_sensitive", "Is case sensitive")}</option>
        <option value="not_case_sensitive">${this.plugin.t("not_case_sensitive", "Not case sensitive")}</option>`;
      const csVal =
        this.entry && typeof this.entry.caseSensitive === "boolean"
          ? this.entry.caseSensitive
            ? "is_case_sensitive"
            : "not_case_sensitive"
          : "not_case_sensitive";
      caseSelect.value = csVal;
      caseSelect.addEventListener("change", async () => {
        if (!this.entry) return;
        this.entry.caseSensitive = caseSelect.value === "is_case_sensitive";
        await this.plugin.saveSettings();
        try {
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.triggerActiveDocumentRerender();
        } catch (_) {}
      });
      // Hide case sensitivity dropdown for both entry and group modals, replace with Style button
      caseSelect.style.display = "none";
      stylePresetBtn = headerRow.createEl("button", { text: this.plugin.t("btn_style", "Style") });
      stylePresetBtn.style.minWidth = "80px";
      stylePresetBtn.style.padding = "6px 10px";
      stylePresetBtn.style.border = "1px solid var(--background-modifier-border)";
      stylePresetBtn.style.borderRadius = "4px";
      stylePresetBtn.style.background = "var(--background-modifier-form-field)";
      stylePresetBtn.style.cursor = "pointer";
    }

    if (!fromQuickOnce && isGroup) {
      // Group Mode: Include "Match Type (All)" option
      matchSelect.innerHTML = `<option value="per-entry">${this.plugin.t("opt_match_all", "Match Type (All)")}</option>
        <option value="exact">${this.plugin.t("match_option_exact", "exact")}</option>
        <option value="contains">${this.plugin.t("match_option_contains", "contains")}</option>
        <option value="startsWith">${this.plugin.t("match_option_starts_with", "starts with")}</option>
        <option value="endsWith">${this.plugin.t("match_option_ends_with", "ends with")}</option>`;

      const currentOverride = this.entry.matchTypeOverride;
      matchSelect.value =
        typeof currentOverride === "string" && currentOverride
          ? currentOverride
          : "per-entry";
    } else if (!fromQuickOnce) {
      // Entry Mode
      matchSelect.innerHTML = `<option value="exact">${this.plugin.t("match_option_exact", "exact")}</option>
        <option value="contains">${this.plugin.t("match_option_contains", "contains")}</option>
        <option value="startsWith">${this.plugin.t("match_option_starts_with", "starts with")}</option>
        <option value="endsWith">${this.plugin.t("match_option_ends_with", "ends with")}</option>`;

      if (this.entry) {
        if (this.entry.isRegex) {
          matchSelect.disabled = true;
          matchSelect.style.opacity = "0.5";
        } else {
          let defaultMatch =
            typeof this.entry.matchType === "string" && this.entry.matchType
              ? this.entry.matchType.toLowerCase()
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
      }
    }

    if (matchSelect) {
      matchSelect.addEventListener("change", async () => {
        if (!this.entry) return;
        let value = matchSelect.value;
        if (value === "startsWith") value = "startswith";
        if (value === "endsWith") value = "endswith";

        if (isGroup) {
          this.entry.matchTypeOverride = value === "per-entry" ? null : value;
        } else {
          this.entry.matchType = value;
        }

        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.triggerActiveDocumentRerender();
      });
    }

    const topRow = contentEl.createDiv();
    topRow.addClass("act-highlight-top-row");
    const previewWrap = topRow.createDiv();
    previewWrap.addClass("act-highlight-preview-wrap");

    const words = previewWrap.createDiv();
    previewWrap.style.display = "flex";
    previewWrap.style.alignItems = "center";
    previewWrap.style.justifyContent = "center";
    words.style.textAlign = "center";
    words.style.opacity = "0.8";
    words.textContent = this.previewTextOverride
      ? this.previewTextOverride
      : isGroup
        ? this.entry.name || "Group"
        : this.entry
          ? this.entry.isRegex
            ? this.entry.presetLabel || String(this.entry.pattern || "")
            : Array.isArray(this.entry.groupedPatterns) &&
                this.entry.groupedPatterns.length > 0
              ? this.entry.groupedPatterns.join(", ")
              : String(this.entry.pattern || "")
          : "";
    const styleCol = topRow.createDiv();
    styleCol.addClass("act-highlight-style-col");
    const styleSelect = styleCol.createEl("select");
    styleSelect.addClass("act-highlight-style-select");
    if (isGroup) {
      const defaultOpt = styleSelect.createEl("option", {
        text: this.plugin.t("opt_style_default", "Default (Per-Entry)"),
      });
      defaultOpt.value = "";
    }
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
    styleSelect.value =
      this.entry && this.entry.styleType
        ? this.entry.styleType
        : isGroup
          ? ""
          : "both";
    const pickerRow = styleCol.createDiv();
    pickerRow.addClass("act-highlight-picker-row");
    if (isGroup && !styleSelect.value) pickerRow.style.display = "none";
    const tColor = pickerRow.createEl("input", { type: "color" });
    const bColor = pickerRow.createEl("input", { type: "color" });
    this._tPickerTouched = false;
    this._bPickerTouched = false;
    setColorInputValue(tColor,
      (this.entry &&
        (this.entry.textColor && this.entry.textColor !== "currentColor"
          ? this.entry.textColor
          : this.plugin.isValidHexColor(this.entry.color)
            ? this.entry.color
            : "#ffffff")) ||
      "#ffffff");
    setColorInputValue(bColor,
      this.entry && this.entry.backgroundColor
        ? this.entry.backgroundColor
        : "#000000");

    // Listen for color changes from parent EditEntryModal and update in real-time
    const syncColorsFromParent = (evt) => {
      try {
        if (evt.detail && evt.detail.entry && evt.detail.entry === this.entry) {
          // Colors changed in parent EditEntryModal, sync our inputs immediately
          const initTextColor =
            (this.entry &&
              (this.entry.textColor && this.entry.textColor !== "currentColor"
                ? this.entry.textColor
                : this.plugin.isValidHexColor(this.entry.color)
                  ? this.entry.color
                  : "")) ||
            getColorInputValue(tColor) ||
            "#ffffff";
          const initBgColor =
            (this.entry && (this.entry.backgroundColor || "")) ||
            getColorInputValue(bColor) ||
            "#000000";
          if (this.plugin.isValidHexColor(initTextColor))
            setColorInputValue(tColor, initTextColor);
          if (this.plugin.isValidHexColor(initBgColor))
            setColorInputValue(bColor, initBgColor);
          // Don't trigger renderPreview here to avoid loops
        }
      } catch (_) {}
    };
    window.addEventListener("act-colors-changed", syncColorsFromParent);
    this._handlers.push({
      el: window,
      ev: "act-colors-changed",
      fn: syncColorsFromParent,
    });

    const paneRow = contentEl.createDiv();
    paneRow.addClass("act-highlight-pane-row");

    /*
    // Individual Apply Mode for Quick Styles
    const isQuickStyle = this.plugin.settings.quickStyles && this.plugin.settings.quickStyles.includes(this.entry);
    const showIndividualApplyMode = isQuickStyle && this.plugin.settings.enableIndividualQuickStyleApplyMode;
    if (showIndividualApplyMode) {
      const applyModeRow = contentEl.createDiv();
      applyModeRow.style.display = "flex";
      applyModeRow.style.alignItems = "center";
      applyModeRow.style.gap = "12px";
      applyModeRow.style.marginTop = "12px";
      applyModeRow.style.padding = "0 4px";

      applyModeRow.createEl("span", {
        text: this.plugin.t("quick_colors_apply_mode_label", "The text coloring will apply as")
      });

      const applyModeSelect = applyModeRow.createEl("select");
      applyModeSelect.style.minWidth = "150px";
      applyModeSelect.style.border = "1px solid var(--background-modifier-border)";
      applyModeSelect.style.borderRadius = "4px";
      applyModeSelect.style.background = "var(--background-modifier-form-field)";

      [
        ["act", this.plugin.t("quick_colors_apply_mode_act", "Always Color Text")],
        ["html", this.plugin.t("quick_colors_apply_mode_html", "Inline HTML")]
      ].forEach(([val, label]) => {
        const opt = applyModeSelect.createEl("option", { text: label });
        opt.value = val;
      });

      const currentVal = this.entry.applyMode || this.plugin.settings.quickColorsApplyMode || "html";
      applyModeSelect.value = currentVal;
      
      // Ensure it's set on the entry if it was missing
       if (!this.entry.applyMode) {
         this.entry.applyMode = currentVal;
         this.plugin.saveSettings();
       }

      applyModeSelect.addEventListener("change", async () => {
        this.entry.applyMode = applyModeSelect.value;
        await this.plugin.saveSettings();
      });
    }
    */
    const hlWrap = paneRow.createDiv();
    hlWrap.addClass("act-highlight-pane");
    const borderWrap = paneRow.createDiv();
    borderWrap.addClass("act-highlight-pane");
    const section1Title = hlWrap.createEl("h3", {
      text: this.plugin.t("section_highlight_styling", "Highlight Styling"),
    });
    const grid = hlWrap.createDiv();
    grid.addClass("act-highlight-grid");
    const makeSliderRow = (label, min, max, value, onChange, onReset) => {
      const left = grid.createDiv();
      const lab = left.createDiv();
      lab.textContent = label;
      const right = grid.createDiv();
      const slider = right.createEl("input", { type: "range" });
      slider.min = String(min);
      slider.max = String(max);
      slider.value = String(value);
      const resetBtn = right.createEl("button");
      resetBtn.addClass("act-highlight-reset-btn", "clickable-icon");
      try {
        setIcon(resetBtn, "reset");
      } catch (e) {}
      const handler = () => {
        onChange(Number(slider.value));
        renderPreview();
      };
      slider.addEventListener("input", handler);
      this._handlers.push({ el: slider, ev: "input", fn: handler });
      const resetHandler = () => {
        onReset(slider);
        renderPreview();
      };
      resetBtn.addEventListener("click", resetHandler);
      this._handlers.push({ el: resetBtn, ev: "click", fn: resetHandler });
      return slider;
    };
    const initOpacity =
      this.entry && typeof this.entry.backgroundOpacity === "number"
        ? this.entry.backgroundOpacity
        : Number(this.plugin.settings.backgroundOpacity ?? 35);
    const opacitySlider = makeSliderRow(
      this.plugin.t("label_highlight_opacity", "Highlight Opacity"),
      0,
      100,
      initOpacity,
      (v) => {
        if (this.entry) this.entry.backgroundOpacity = v;
      },
      (sliderEl) => {
        if (this.entry) {
          this.entry.backgroundOpacity = undefined;
        }
        sliderEl.value = String(this.plugin.settings.backgroundOpacity ?? 35);
      },
    );
    opacitySlider.setAttribute("data-act-opacity-slider", "true");
    const radiusInputLeft = grid.createDiv();
    radiusInputLeft.textContent = this.plugin.t(
      "label_highlight_radius",
      "Highlight Border Radius",
    );
    const radiusInputRight = grid.createDiv();
    const initRadius =
      this.entry && typeof this.entry.highlightBorderRadius === "number"
        ? this.entry.highlightBorderRadius
        : (this.plugin.settings.highlightBorderRadius ?? 4);
    const radiusInput = radiusInputRight.createEl("input", {
      type: "number",
      value: String(initRadius),
    });
    radiusInput.addClass("act-highlight-input-small");
    radiusInput.setAttribute("data-act-radius-input", "true");
    radiusInput.addEventListener("change", () => {
      if (this.entry)
        this.entry.highlightBorderRadius = Number(radiusInput.value || 0);
      renderPreview();
    });
    const radiusReset = radiusInputRight.createEl("button");
    radiusReset.addClass("act-highlight-reset-btn", "clickable-icon");
    try {
      setIcon(radiusReset, "reset");
    } catch (e) {}
    radiusReset.addEventListener("click", () => {
      if (this.entry) this.entry.highlightBorderRadius = undefined;
      radiusInput.value = String(
        this.plugin.settings.highlightBorderRadius ?? 4,
      );
      renderPreview();
    });
    this._handlers.push({ el: radiusInput, ev: "change", fn: () => {} });
    const hPadLeft = grid.createDiv();
    hPadLeft.textContent = this.plugin.t(
      "label_horizontal_padding",
      "Horizontal Padding",
    );
    const initHPad =
      this.entry && typeof this.entry.highlightHorizontalPadding === "number"
        ? this.entry.highlightHorizontalPadding
        : (this.plugin.settings.highlightHorizontalPadding ?? 4);
    const hPadRight = grid.createDiv();
    const hPadInput = hPadRight.createEl("input", {
      type: "number",
      value: String(initHPad),
    });
    hPadInput.addClass("act-highlight-input-small");
    hPadInput.setAttribute("data-act-hpad-input", "true");
    hPadInput.addEventListener("change", () => {
      if (this.entry)
        this.entry.highlightHorizontalPadding = Number(hPadInput.value || 0);
      renderPreview();
    });
    const hPadReset = hPadRight.createEl("button");
    hPadReset.addClass("act-highlight-reset-btn", "clickable-icon");
    try {
      setIcon(hPadReset, "reset");
    } catch (e) {}
    hPadReset.addEventListener("click", () => {
      if (this.entry) this.entry.highlightHorizontalPadding = undefined;
      hPadInput.value = String(
        this.plugin.settings.highlightHorizontalPadding ?? 4,
      );
      renderPreview();
    });
    const vPadLeft = grid.createDiv();
    vPadLeft.textContent = this.plugin.t(
      "label_vertical_padding",
      "Vertical Padding",
    );
    const initVPad =
      this.entry && typeof this.entry.highlightVerticalPadding === "number"
        ? this.entry.highlightVerticalPadding
        : (this.plugin.settings.highlightVerticalPadding ?? 0);
    const vPadRight = grid.createDiv();
    const vPadInput = vPadRight.createEl("input", {
      type: "number",
      value: String(initVPad),
    });
    vPadInput.addClass("act-highlight-input-small");
    vPadInput.setAttribute("data-act-vpad-input", "true");
    vPadInput.addEventListener("change", () => {
      if (this.entry)
        this.entry.highlightVerticalPadding = Number(vPadInput.value || 0);
      renderPreview();
    });
    const vPadReset = vPadRight.createEl("button");
    vPadReset.addClass("act-highlight-reset-btn", "clickable-icon");
    try {
      setIcon(vPadReset, "reset");
    } catch (e) {}
    vPadReset.addEventListener("click", () => {
      if (this.entry) this.entry.highlightVerticalPadding = undefined;
      vPadInput.value = String(
        this.plugin.settings.highlightVerticalPadding ?? 0,
      );
      renderPreview();
    });
    const grid2Title = borderWrap.createEl("h3", {
      text: this.plugin.t(
        "section_highlight_border_styling",
        "Highlight Border Styling",
      ),
    });
    const grid2 = borderWrap.createDiv();
    grid2.addClass("act-highlight-grid");
    const enableLeft = grid2.createDiv();
    enableLeft.textContent = this.plugin.t(
      "label_enable_border",
      "Enable Border",
    );
    const enableRight = grid2.createDiv();
    const enableChk = enableRight.createEl("input", { type: "checkbox" });
    enableChk.setAttribute("data-act-border-enable", "true");
    enableChk.checked =
      this.entry && typeof this.entry.enableBorderThickness !== "undefined"
        ? !!this.entry.enableBorderThickness
        : !!this.plugin.settings.enableBorderThickness;
    enableChk.addEventListener("change", () => {
      if (this.entry) this.entry.enableBorderThickness = !!enableChk.checked;
      renderPreview();
    });
    const sidesLeft = grid2.createDiv();
    sidesLeft.textContent = this.plugin.t("label_border_sides", "Border Sides");
    const sidesRight = grid2.createDiv();
    const sidesSel = sidesRight.createEl("select");
    sidesSel.setAttribute("data-act-border-sides", "true");
    [
      ["full", this.plugin.t("opt_border_full", "Full Border (All Sides)")],
      ["top-bottom", this.plugin.t("opt_border_top_bottom", "Top & Bottom")],
      ["left-right", this.plugin.t("opt_border_left_right", "Left & Right")],
      [
        "top-left-right",
        this.plugin.t("opt_border_top_left_right", "Top, Left & Right"),
      ],
      [
        "bottom-left-right",
        this.plugin.t("opt_border_bottom_left_right", "Bottom, Left & Right"),
      ],
      ["top-right", this.plugin.t("opt_border_top_right", "Top & Right")],
      ["top-left", this.plugin.t("opt_border_top_left", "Top & Left")],
      [
        "bottom-right",
        this.plugin.t("opt_border_bottom_right", "Bottom & Right"),
      ],
      ["bottom-left", this.plugin.t("opt_border_bottom_left", "Bottom & Left")],
      ["top", this.plugin.t("opt_border_top", "Top Only")],
      ["bottom", this.plugin.t("opt_border_bottom", "Bottom Only")],
      ["left", this.plugin.t("opt_border_left", "Left Only")],
      ["right", this.plugin.t("opt_border_right", "Right Only")],
    ].forEach(([value, label]) => {
      const o = sidesSel.createEl("option", { text: label });
      o.value = value;
    });
    sidesSel.value =
      this.entry && this.entry.borderStyle
        ? this.entry.borderStyle
        : (this.plugin.settings.borderStyle ?? "full");
    sidesSel.addEventListener("change", () => {
      if (this.entry) this.entry.borderStyle = sidesSel.value;
      renderPreview();
    });
    const sidesReset = sidesRight.createEl("button");
    sidesReset.addClass("act-highlight-reset-btn", "clickable-icon");
    try {
      setIcon(sidesReset, "reset");
    } catch (e) {}
    sidesReset.addEventListener("click", () => {
      if (this.entry) this.entry.borderStyle = undefined;
      sidesSel.value = this.plugin.settings.borderStyle ?? "full";
      renderPreview();
    });
    const styleLeft = grid2.createDiv();
    styleLeft.textContent = this.plugin.t("label_border_style", "Border Style");
    const styleRight = grid2.createDiv();
    const lineSel = styleRight.createEl("select");
    lineSel.setAttribute("data-act-border-line", "true");
    [
      ["solid", this.plugin.t("opt_line_solid", "Solid")],
      ["dashed", this.plugin.t("opt_line_dashed", "Dashed")],
      ["dotted", this.plugin.t("opt_line_dotted", "Dotted")],
      ["double", this.plugin.t("opt_line_double", "Double")],
      ["groove", this.plugin.t("opt_line_groove", "Groove")],
      ["ridge", this.plugin.t("opt_line_ridge", "Ridge")],
      ["inset", this.plugin.t("opt_line_inset", "Inset")],
      ["outset", this.plugin.t("opt_line_outset", "Outset")],
    ].forEach(([value, label]) => {
      const o = lineSel.createEl("option", { text: label });
      o.value = value;
    });
    lineSel.value =
      this.entry && this.entry.borderLineStyle
        ? this.entry.borderLineStyle
        : (this.plugin.settings.borderLineStyle ?? "solid");
    lineSel.addEventListener("change", () => {
      if (this.entry) this.entry.borderLineStyle = lineSel.value;
      renderPreview();
    });
    const styleReset = styleRight.createEl("button");
    styleReset.addClass("act-highlight-reset-btn", "clickable-icon");
    try {
      setIcon(styleReset, "reset");
    } catch (e) {}
    styleReset.addEventListener("click", () => {
      if (this.entry) this.entry.borderLineStyle = undefined;
      lineSel.value = this.plugin.settings.borderLineStyle ?? "solid";
      renderPreview();
    });
    const bOpLeft = grid2.createDiv();
    bOpLeft.textContent = this.plugin.t(
      "label_border_opacity",
      "Border Opacity",
    );
    const bOpRight = grid2.createDiv();
    const bOpSlider = bOpRight.createEl("input", { type: "range" });
    bOpSlider.setAttribute("data-act-border-opacity", "true");
    bOpSlider.min = "0";
    bOpSlider.max = "100";
    bOpSlider.value = String(
      this.entry && typeof this.entry.borderOpacity === "number"
        ? this.entry.borderOpacity
        : (this.plugin.settings.borderOpacity ?? 100),
    );
    bOpSlider.addEventListener("input", () => {
      if (this.entry) this.entry.borderOpacity = Number(bOpSlider.value || 0);
      renderPreview();
    });
    const bOpReset = bOpRight.createEl("button");
    bOpReset.addClass("act-highlight-reset-btn", "clickable-icon");
    try {
      setIcon(bOpReset, "reset");
    } catch (e) {}
    bOpReset.addEventListener("click", () => {
      if (this.entry) this.entry.borderOpacity = undefined;
      bOpSlider.value = String(this.plugin.settings.borderOpacity ?? 100);
      renderPreview();
    });
    const thickLeft = grid2.createDiv();
    thickLeft.textContent = this.plugin.t(
      "label_border_thickness",
      "Border Thickness",
    );
    const thickRight = grid2.createDiv();
    const thickInput = thickRight.createEl("input", {
      type: "number",
      value: String(
        this.entry && typeof this.entry.borderThickness === "number"
          ? this.entry.borderThickness
          : (this.plugin.settings.borderThickness ?? 1),
      ),
    });
    thickInput.addClass("act-highlight-input-small");
    thickInput.setAttribute("data-act-border-thickness", "true");
    thickInput.addEventListener("change", () => {
      if (this.entry)
        this.entry.borderThickness = Number(thickInput.value || 0);
      renderPreview();
    });
    const thickReset = thickRight.createEl("button");
    thickReset.addClass("act-highlight-reset-btn", "clickable-icon");
    try {
      setIcon(thickReset, "reset");
    } catch (e) {}
    thickReset.addEventListener("click", () => {
      if (this.entry) this.entry.borderThickness = undefined;
      thickInput.value = String(this.plugin.settings.borderThickness ?? 1);
      renderPreview();
    });
    const renderPreview = () => {
      const style = styleSelect.value;
      if (isGroup && !style) {
        const txt = words.textContent || "";
        try {
          while (previewWrap.firstChild)
            previewWrap.removeChild(previewWrap.firstChild);
          const span = document.createElement("span");
          span.textContent = txt;
          span.style.display = "inline";
          span.style.opacity = "1";
          // Keep spans inline so multi-line wrapping can clone highlights correctly
          previewWrap.appendChild(span);
        } catch (_) {
          previewWrap.innerHTML = `<span style="display:inline">${escapeHtml(
            txt,
          )}</span>`;
        }
        return;
      }

      const tRaw = getColorInputValue(tColor);
      const bRaw = getColorInputValue(bColor);
      const hasEntryText = !!(this.entry && ((this.entry.textColor && this.entry.textColor !== "currentColor" && this.plugin.isValidHexColor(this.entry.textColor)) || (this.entry.color && this.plugin.isValidHexColor(this.entry.color))));
      const hasEntryBg = !!(this.entry && this.entry.backgroundColor && this.plugin.isValidHexColor(this.entry.backgroundColor));
      const isVarT = tRaw && /^var\(/.test(tRaw.trim());
      const isVarB = bRaw && /^var\(/.test(bRaw.trim());
      const hasValidT = tRaw && this.plugin.isValidHexColor(tRaw) && (isVarT || hasEntryText || this._tPickerTouched);
      const hasValidB = bRaw && this.plugin.isValidHexColor(bRaw) && (isVarB || hasEntryBg || this._bPickerTouched);
      const t = hasValidT ? tRaw : "var(--text-normal)";
      const b = hasValidB ? bRaw : "var(--color-accent)";
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
      const matchStyle =
        style === "text"
          ? `color:${t};background:transparent;`
          : style === "highlight"
            ? `background:${rgba};border-radius:${radius}px;padding:${vpad}px ${pad}px;color:var(--text-normal);${borderStyle}box-decoration-break: clone; -webkit-box-decoration-break: clone;`
            : `color:${t};background:${rgba};border-radius:${radius}px;padding:${vpad}px ${pad}px;${borderStyle}box-decoration-break: clone; -webkit-box-decoration-break: clone;`;
      const txt = words.textContent || "";
      while (previewWrap.firstChild)
        previewWrap.removeChild(previewWrap.firstChild);
      const span = document.createElement("span");
      span.setAttribute("style", matchStyle);
      span.style.display = "inline";
      const displayText =
        !isGroup && this.entry && this.entry.isRegex && this.entry.presetLabel
          ? this.entry.presetLabel
          : words.textContent || "";
      
      // Clear out the span's content before adding text to avoid doubling up
      span.textContent = "";
      span.textContent = displayText;
      // Apply custom CSS on top if present — use current picker colors, not stored entry colors
      if (this.entry && this.entry.customCss && this.plugin.settings.enableCustomCss) {
        try {
          // Build a temporary patched CSS using the current picker values so the
          // preview reflects the color the user is currently hovering over
          const tempEntry = Object.assign({}, this.entry, {
            color: style === 'text' ? t : '',
            textColor: (style === 'both') ? t : (style === 'highlight' ? 'currentColor' : null),
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
      previewWrap.appendChild(span);
    };
    const updatePickerVisibility = () => {
      const style = styleSelect.value;
      if (style === "text") {
        tColor.style.display = "inline-block";
        bColor.style.display = "none";
      } else if (style === "highlight") {
        tColor.style.display = "none";
        bColor.style.display = "inline-block";
      } else {
        tColor.style.display = "inline-block";
        bColor.style.display = "inline-block";
      }
    };
    const styleChange = () => {
      updatePickerVisibility();
      renderPreview();
    };
    styleSelect.addEventListener("change", styleChange);
    const tColorStyleChange = () => { this._tPickerTouched = true; styleChange(); };
    const bColorStyleChange = () => { this._bPickerTouched = true; styleChange(); };
    tColor.addEventListener("input", tColorStyleChange);
    bColor.addEventListener("input", bColorStyleChange);
    this._handlers.push({ el: styleSelect, ev: "change", fn: styleChange });
    this._handlers.push({ el: tColor, ev: "input", fn: tColorStyleChange });
    this._handlers.push({ el: bColor, ev: "input", fn: bColorStyleChange });
    updatePickerVisibility();
    renderPreview();
    // Style preset button handler (replaces case sensitivity dropdown)
    if (stylePresetBtn) {
      const presetHandler = () => {
        new TextStylePresetsModal(this.app, this.plugin, (preset) => {
          if (!preset || !this.entry) return;
          const shapeKeys = ["styleType","backgroundOpacity","highlightBorderRadius","highlightHorizontalPadding","highlightVerticalPadding","enableBorderThickness","borderStyle","borderLineStyle","borderOpacity","borderThickness","customCss"];
          for (const k of shapeKeys) if (k in preset) this.entry[k] = preset[k];
          // Colors: only apply if preset has them, preserve entry colors otherwise
          if ("textColor" in preset) this.entry.textColor = preset.textColor;
          if ("backgroundColor" in preset) this.entry.backgroundColor = preset.backgroundColor;
          if ("color" in preset) this.entry.color = preset.color;
          if (preset.styleType === "text" && preset.textColor && this.plugin.isValidHexColor(preset.textColor)) {
            this.entry.color = preset.textColor;
            this.entry.textColor = null;
            this.entry.backgroundColor = null;
          } else if (preset.styleType === "highlight" && preset.backgroundColor) {
            this.entry.backgroundColor = preset.backgroundColor;
            this.entry.textColor = "currentColor";
            this.entry.color = "";
          }
          try { if (styleSelect) styleSelect.value = this.entry.styleType || "both"; } catch(_){}
          try { if (tColor) { const tv = (this.entry.textColor && this.entry.textColor !== "currentColor" && this.plugin.isValidHexColor(this.entry.textColor) ? this.entry.textColor : (this.entry.color && this.plugin.isValidHexColor(this.entry.color) ? this.entry.color : getColorInputValue(tColor))); if (tv) setColorInputValue(tColor, tv); } } catch(_){}
          try { if (bColor) { const bv = (this.entry.backgroundColor && this.plugin.isValidHexColor(this.entry.backgroundColor) ? this.entry.backgroundColor : getColorInputValue(bColor)); if (bv) setColorInputValue(bColor, bv); } } catch(_){}
          try { opacitySlider.value = String(this.entry.backgroundOpacity ?? this.plugin.settings.backgroundOpacity ?? 35); } catch(_){}
          try { radiusInput.value = String(this.entry.highlightBorderRadius ?? this.plugin.settings.highlightBorderRadius ?? 4); } catch(_){}
          try { hPadInput.value = String(this.entry.highlightHorizontalPadding ?? this.plugin.settings.highlightHorizontalPadding ?? 4); } catch(_){}
          try { vPadInput.value = String(this.entry.highlightVerticalPadding ?? this.plugin.settings.highlightVerticalPadding ?? 0); } catch(_){}
          try { enableChk.checked = !! (typeof this.entry.enableBorderThickness !== "undefined" ? this.entry.enableBorderThickness : this.plugin.settings.enableBorderThickness); } catch(_){}
          try { sidesSel.value = this.entry.borderStyle || this.plugin.settings.borderStyle || "full"; } catch(_){}
          try { lineSel.value = this.entry.borderLineStyle || this.plugin.settings.borderLineStyle || "solid"; } catch(_){}
          try { bOpSlider.value = String(this.entry.borderOpacity ?? this.plugin.settings.borderOpacity ?? 100); } catch(_){}
          try { thickInput.value = String(this.entry.borderThickness ?? this.plugin.settings.borderThickness ?? 1); } catch(_){}
          try { updatePickerVisibility(); } catch(_){}
          try { renderPreview(); } catch(_){}
          try { window.dispatchEvent(new CustomEvent("act-colors-changed", { detail: { entry: this.entry } })); } catch(_){}
        }).open();
      };
      stylePresetBtn.addEventListener("click", presetHandler);
      this._handlers.push({ el: stylePresetBtn, ev: "click", fn: presetHandler });
    }
    const actions = contentEl.createDiv();
    actions.style.display = "flex";
    actions.style.justifyContent = "space-between";
    actions.style.marginTop = "12px";
    const resetAllBtn = actions.createEl("button", {
      text: this.plugin.t("btn_reset_all", "Reset Highlight Style"),
    });
    const resetAllHandler = () => {
      const isGroup = this.entry && Array.isArray(this.entry.entries);
      if (this.entry) {
        this.entry.backgroundOpacity = undefined;
        this.entry.highlightBorderRadius = undefined;
        this.entry.highlightHorizontalPadding = undefined;
        this.entry.highlightVerticalPadding = undefined;
        this.entry.enableBorderThickness = undefined;
        this.entry.borderStyle = undefined;
        this.entry.borderLineStyle = undefined;
        this.entry.borderOpacity = undefined;
        this.entry.borderThickness = undefined;

        if (isGroup) {
          this.entry.styleType = undefined;
          this.entry.color = undefined;
          this.entry.textColor = undefined;
          this.entry.backgroundColor = undefined;
        }
      }
      this._resetAllApplied = true;
      try {
        opacitySlider.value = String(
          this.plugin.settings.backgroundOpacity ?? 35,
        );
        radiusInput.value = String(
          this.plugin.settings.highlightBorderRadius ?? 4,
        );
        hPadInput.value = String(
          this.plugin.settings.highlightHorizontalPadding ?? 4,
        );
        vPadInput.value = String(
          this.plugin.settings.highlightVerticalPadding ?? 0,
        );
        enableChk.checked = !!this.plugin.settings.enableBorderThickness;
        sidesSel.value = this.plugin.settings.borderStyle ?? "full";
        lineSel.value = this.plugin.settings.borderLineStyle ?? "solid";
        bOpSlider.value = String(this.plugin.settings.borderOpacity ?? 100);
        thickInput.value = String(this.plugin.settings.borderThickness ?? 1);

        if (isGroup) {
          styleSelect.value = "";
          pickerRow.style.display = "none";
        }
      } catch (_) {}
      renderPreview();
      try {
        window.dispatchEvent(new CustomEvent("act-style-updated"));
      } catch (_) {}
    };
    resetAllBtn.addEventListener("click", resetAllHandler);
    this._handlers.push({ el: resetAllBtn, ev: "click", fn: resetAllHandler });

    // Add right-click handlers for color pickers (after renderPreview is defined)
    const syncEntryColorsFromInputs = () => {
      if (!this.entry) return;
      const style = styleSelect.value;
      const curT = getColorInputValue(tColor);
      const curB = getColorInputValue(bColor);
      this.entry._savedTextColor =
        curT ||
        this.entry._savedTextColor ||
        this.entry.color ||
        this.entry.textColor ||
        "";
      this.entry._savedBackgroundColor =
        curB ||
        this.entry._savedBackgroundColor ||
        this.entry.backgroundColor ||
        "";
      if (style === "text") {
        this.entry.color = curT || "";
      } else if (style === "highlight") {
        this.entry.backgroundColor = curB || "";
        this.entry.textColor = "currentColor";
        this.entry.color = "";
      } else {
        this.entry.textColor = curT || "";
        this.entry.backgroundColor = curB || "";
        this.entry.color = "";
      }
    };
    const dispatchHighlightColorsChanged = () => {
      syncEntryColorsFromInputs();
      try {
        window.dispatchEvent(
          new CustomEvent("act-colors-changed", {
            detail: { entry: this.entry },
          }),
        );
      } catch (_) {}
    };
    const setupHighlightColorPickerRightClick = (colorInput) => {
      colorInput.addEventListener("contextmenu", (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        const currentColor = getColorInputValue(colorInput) || "#000000";
        const isTextPicker = colorInput === tColor;
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
              setColorInputValue(tColor, tc);
              this._tPickerTouched = true;
              changed = true;
            } else if (fallback && isTextPicker) {
              setColorInputValue(tColor, fallback);
              this._tPickerTouched = true;
              changed = true;
            }

            if (bc) {
              setColorInputValue(bColor, bc);
              this._bPickerTouched = true;
              changed = true;
            } else if (fallback && !isTextPicker) {
              setColorInputValue(bColor, fallback);
              this._bPickerTouched = true;
              changed = true;
            }

            if (result && result.markTarget) {
              if (this._markTargetSelect) this._markTargetSelect.value = result.markTarget;
              if (this.entry) {
                this.entry.markTarget = result.markTarget;
                await this.plugin.saveSettings();
                this.plugin.compileWordEntries();
                this.plugin.compileTextBgColoringEntries();
                this.plugin.reconfigureEditorExtensions();
                this.plugin.forceRefreshAllEditors();
                this.plugin.triggerActiveDocumentRerender();
              }
            }

            if (!changed) {
              if (currentColor && this.plugin.isValidHexColor(currentColor)) {
                if (isTextPicker) setColorInputValue(tColor, currentColor);
                else setColorInputValue(bColor, currentColor);
              }
            }

            dispatchHighlightColorsChanged();
            renderPreview();
          },
          isTextPicker ? "text" : "background",
          this.previewTextOverride || currentColor,
          false,
          this.entry ? this.entry.markTarget : "text",
          this.entry,
        );
        modal._hideHeaderControls = true;
        const preT = getColorInputValue(tColor);
        const preB = getColorInputValue(bColor);
        if (preT) modal._preFillTextColor = preT;
        if (preB) {
          modal._preFillBgColor = preB;
          modal._preFillBorderColor = preB;
        }
        modal.open();
      });
    };
    setupHighlightColorPickerRightClick(tColor);
    setupHighlightColorPickerRightClick(bColor);

    // Add real-time syncing to this.entry when colors change
    const tColorInputHandler = () => {
      this._tPickerTouched = true;
      dispatchHighlightColorsChanged();
      renderPreview();
    };
    const bColorInputHandler = () => {
      this._bPickerTouched = true;
      dispatchHighlightColorsChanged();
      renderPreview();
    };
    tColor.addEventListener("input", tColorInputHandler);
    bColor.addEventListener("input", bColorInputHandler);
    this._handlers.push({ el: tColor, ev: "input", fn: tColorInputHandler });
    this._handlers.push({ el: bColor, ev: "input", fn: bColorInputHandler });

    // Listen for color changes from EditEntryModal and update our inputs
    const colorSyncHandler = (evt) => {
      try {
        if (evt.detail && evt.detail.entry && evt.detail.entry === this.entry) {
          // Colors changed in parent modal, sync our inputs
          const initTextColor =
            (this.entry &&
              (this.entry.textColor && this.entry.textColor !== "currentColor"
                ? this.entry.textColor
                : this.plugin.isValidHexColor(this.entry.color)
                  ? this.entry.color
                  : "#ffffff")) ||
            "#ffffff";
          const initBgColor =
            this.entry && this.entry.backgroundColor
              ? this.entry.backgroundColor
              : "#000000";
          if (this.plugin.isValidHexColor(initTextColor))
            setColorInputValue(tColor, initTextColor);
          if (this.plugin.isValidHexColor(initBgColor))
            setColorInputValue(bColor, initBgColor);
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

    // Sync style changes to entry
    styleSelect.addEventListener("change", () => {
      if (this.entry) {
        const st = styleSelect.value;
        if (isGroup && !st) {
          // Default/None
          this.entry.styleType = undefined;
          this.entry.color = undefined;
          this.entry.textColor = undefined;
          this.entry.backgroundColor = undefined;
          pickerRow.style.display = "none";
        } else {
          this.entry.styleType = st;
          pickerRow.style.display = "";
          try {
            updatePickerVisibility();
          } catch (_) {}
          if (st === "text") {
            this.entry.color = getColorInputValue(tColor) || "";
            this.entry.textColor = null;
            this.entry.backgroundColor = null;
          } else if (st === "highlight") {
            this.entry.color = "";
            this.entry.textColor = "currentColor";
            this.entry.backgroundColor = getColorInputValue(bColor) || "";
          } else {
            this.entry.color = "";
            this.entry.textColor = getColorInputValue(tColor) || "";
            this.entry.backgroundColor = getColorInputValue(bColor) || "";
          }
        }
      }
      renderPreview();
    });

    const saveBtn = actions.createEl("button", {
      text: this.plugin.t("btn_save_style", "Save Style"),
    });
    saveBtn.addClass("mod-cta");

    const saveData = async (shouldClose = true) => {
      if (this.entry) {
        // Persist style type and picker choices into entry
        const st = styleSelect.value;
        if (isGroup && !st) {
          this.entry.styleType = undefined;
          this.entry.color = undefined;
          this.entry.textColor = undefined;
          this.entry.backgroundColor = undefined;
        } else {
          const tRawSave = getColorInputValue(tColor);
          const bRawSave = getColorInputValue(bColor);
          const hasEntryTextSave = !!(this.entry && ((this.entry.textColor && this.entry.textColor !== "currentColor" && this.plugin.isValidHexColor(this.entry.textColor)) || (this.entry.color && this.plugin.isValidHexColor(this.entry.color))));
          const hasEntryBgSave = !!(this.entry && this.entry.backgroundColor && this.plugin.isValidHexColor(this.entry.backgroundColor));
          const isVarTSave = tRawSave && /^var\(/.test(tRawSave.trim());
          const isVarBSave = bRawSave && /^var\(/.test(bRawSave.trim());
          const hasValidTSave = tRawSave && this.plugin.isValidHexColor(tRawSave) && (isVarTSave || hasEntryTextSave || this._tPickerTouched);
          const hasValidBSave = bRawSave && this.plugin.isValidHexColor(bRawSave) && (isVarBSave || hasEntryBgSave || this._bPickerTouched);
          // When style needs a color but picker is null, save var(--text-normal)/var(--color-accent) for preview consistency
          const effectiveTSave = hasValidTSave ? tRawSave : "var(--text-normal)";
          const effectiveBSave = hasValidBSave ? bRawSave : "var(--color-accent)";
          this.entry.styleType = st;
          if (st === "text") {
            this.entry.color = hasValidTSave ? tRawSave : "var(--text-normal)";
            this.entry.textColor = null;
            this.entry.backgroundColor = null;
          } else if (st === "highlight") {
            this.entry.color = "";
            this.entry.textColor = "currentColor";
            this.entry.backgroundColor = hasValidBSave ? bRawSave : "var(--color-accent)";
          } else {
            this.entry.color = "";
            this.entry.textColor = hasValidTSave ? tRawSave : "var(--text-normal)";
            this.entry.backgroundColor = hasValidBSave ? bRawSave : "var(--color-accent)";
          }
        }
        // Save highlight styling parameters
        if (this._resetAllApplied) {
          this.entry.backgroundOpacity = undefined;
          this.entry.highlightBorderRadius = undefined;
          this.entry.highlightHorizontalPadding = undefined;
          this.entry.highlightVerticalPadding = undefined;
          this.entry.enableBorderThickness = undefined;
          this.entry.borderStyle = undefined;
          this.entry.borderLineStyle = undefined;
          this.entry.borderOpacity = undefined;
          this.entry.borderThickness = undefined;
        } else {
          const rawOpacity = opacitySlider.value
            ? Number(opacitySlider.value)
            : (this.plugin.settings.backgroundOpacity ?? 35);
          const rawRadius = radiusInput.value
            ? Number(radiusInput.value)
            : (this.plugin.settings.highlightBorderRadius ?? 4);
          const rawHPad = hPadInput.value
            ? Number(hPadInput.value)
            : (this.plugin.settings.highlightHorizontalPadding ?? 4);
          const rawVPad = vPadInput.value
            ? Number(vPadInput.value)
            : (this.plugin.settings.highlightVerticalPadding ?? 0);
          const rawBOpacity = bOpSlider.value
            ? Number(bOpSlider.value)
            : (this.plugin.settings.borderOpacity ?? 100);
          const rawBThickness = thickInput.value
            ? Number(thickInput.value)
            : (this.plugin.settings.borderThickness ?? 1);

          this.entry.backgroundOpacity = rawOpacity;
          this.entry.highlightBorderRadius = rawRadius;
          this.entry.highlightHorizontalPadding = rawHPad;
          this.entry.highlightVerticalPadding = rawVPad;
          this.entry.enableBorderThickness = !!enableChk.checked;
          this.entry.borderStyle =
            sidesSel.value || (this.plugin.settings.borderStyle ?? "full");
          this.entry.borderLineStyle =
            lineSel.value || (this.plugin.settings.borderLineStyle ?? "solid");
          this.entry.borderOpacity = rawBOpacity;
          this.entry.borderThickness = rawBThickness;
        }

        // Find and update entry in the settings array using uid
        const entryUid = this.entry.uid;
        let foundArray = null;
        let foundIdx = -1;

        for (let i = 0; i < this.plugin.settings.wordEntries.length; i++) {
          if (this.plugin.settings.wordEntries[i].uid === entryUid) {
            foundArray = this.plugin.settings.wordEntries;
            foundIdx = i;
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
              this.plugin.settings.textBgColoringEntries[i].uid === entryUid
            ) {
              foundArray = this.plugin.settings.textBgColoringEntries;
              foundIdx = i;
              break;
            }
          }
        }

        // Also check groups
        if (
          foundIdx === -1 &&
          Array.isArray(this.plugin.settings.wordEntryGroups)
        ) {
          for (const group of this.plugin.settings.wordEntryGroups) {
            if (group && Array.isArray(group.entries)) {
              for (let i = 0; i < group.entries.length; i++) {
                if (group.entries[i].uid === entryUid) {
                  foundArray = group.entries;
                  foundIdx = i;
                  break;
                }
              }
            }
            if (foundIdx !== -1) break;
          }
        }

        if (foundIdx !== -1 && foundArray) {
          // Explicitly set all properties on the array entry
          foundArray[foundIdx].styleType = this.entry.styleType;
          foundArray[foundIdx].color = this.entry.color;
          foundArray[foundIdx].textColor = this.entry.textColor;
          foundArray[foundIdx].backgroundColor = this.entry.backgroundColor;
          foundArray[foundIdx].backgroundOpacity = this.entry.backgroundOpacity;
          foundArray[foundIdx].highlightBorderRadius =
            this.entry.highlightBorderRadius;
          foundArray[foundIdx].highlightHorizontalPadding =
            this.entry.highlightHorizontalPadding;
          foundArray[foundIdx].highlightVerticalPadding =
            this.entry.highlightVerticalPadding;
          foundArray[foundIdx].enableBorderThickness =
            this.entry.enableBorderThickness;
          foundArray[foundIdx].borderStyle = this.entry.borderStyle;
          foundArray[foundIdx].borderLineStyle = this.entry.borderLineStyle;
          foundArray[foundIdx].borderOpacity = this.entry.borderOpacity;
          foundArray[foundIdx].borderThickness = this.entry.borderThickness;
          // If entry has customCss, patch only the color/layout properties that
          // HighlightStylingModal controls — preserve any user-added custom properties
          if (this.entry.customCss) {
            try { this.plugin.syncEntryCssFromColors(this.entry); } catch (_) {}
            // Also patch padding/radius/border from the updated structured fields
            try {
              const patched = patchCssLayoutFromEntry(this.entry.customCss, this.entry, this.plugin);
              this.entry.customCss = patched;
            } catch (_) {}
            foundArray[foundIdx].customCss = this.entry.customCss;
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
          window.dispatchEvent(new CustomEvent("act-style-updated"));
        } catch (_) {}
      }

      // Update parent EditEntryModal's color inputs with the new values
      if (this.parentEditEntryModal) {
        try {
          // Find the color inputs in parent modal by looking for input[type="color"]
          const parentInputs =
            this.parentEditEntryModal.modalEl?.querySelectorAll(
              'input[type="color"]',
            );
          if (parentInputs && parentInputs.length >= 2) {
            const textColorInput = parentInputs[0];
            const bgColorInput = parentInputs[1];

            // Update based on current style
            const st = this.entry?.styleType || "both";
            if (st === "text" || st === "both") {
              const textColor =
                (this.entry?.textColor &&
                this.entry.textColor !== "currentColor"
                  ? this.entry.textColor
                  : this.entry?.color) || getColorInputValue(textColorInput);
              if (this.plugin.isValidHexColor(textColor)) {
                setColorInputValue(textColorInput, textColor);
                try { this.parentEditEntryModal._textPickerTouched = true; } catch(_) {}
              }
            }
            if (st === "highlight" || st === "both") {
              const bgColor = this.entry?.backgroundColor || getColorInputValue(bgColorInput);
              if (this.plugin.isValidHexColor(bgColor)) {
                setColorInputValue(bgColorInput, bgColor);
                try { this.parentEditEntryModal._bgPickerTouched = true; } catch(_) {}
              }
            }
          }

          // Refresh the preview in parent modal
          if (typeof this.parentEditEntryModal._refreshPreview === "function") {
            this.parentEditEntryModal._refreshPreview();
          }
        } catch (e) {}
      }

      if (shouldClose) this.close();
    };

    const saveHandler = () => saveData(true);
    saveBtn.addEventListener("click", saveHandler);
    this._handlers.push({ el: saveBtn, ev: "click", fn: saveHandler });

    // Expose saveData for onClose
    this._saveData = saveData;
  }
  onClose() {
    try {
      if (this._hasUserChanges && this._saveData) {
        this._saveData(false);
      }
    } catch (e) {}

    try {
      this._handlers.forEach((h) => {
        try {
          h.el.removeEventListener(h.ev, h.fn);
        } catch (e) {}
      });
    } catch (e) {}
    this._handlers = [];
    try {
      this.contentEl.empty();
    } catch (e) {}
  }
}
