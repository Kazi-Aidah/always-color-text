import { Modal, setIcon } from 'obsidian';
import { escapeHtml } from '../utils/debug.js';
import { ColorPickerModal } from './ColorPickerModal.js';
import { TextStylePresetsModal } from './TextStylePresetsModal.js';
import { deriveHighlightCssFromEntry, parseCssIntoEntry, patchCssLayoutFromEntry } from './CustomCssModal.js';
import { stripInheritedGroupCssColors } from '../services/patternCompiler.js';

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
        text: this.plugin.t("opt_style_default", "Per-Entry"),
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
    // Snapshot whether entry had real colors AT OPEN TIME — used in renderPreview to
    // prevent picker-default (#000000/#ffffff) values written by syncEntryColorsFromInputs
    // from being treated as intentional colors. Stored on `this` (not consts) so
    // Reset can invalidate them — otherwise stale open-time state keeps forcing
    // old picker colors into the preview after a reset nulled the colors.
    // Polluted groups saved with default black/black (both #000000) are treated as NULL for preview.
    const isPollutedGroupBothBlackAtOpen = isGroup && String(this.entry?.textColor||"").toLowerCase()==="#000000" && String(this.entry?.backgroundColor||"").toLowerCase()==="#000000";
    this._openHadRealText = !isPollutedGroupBothBlackAtOpen && !!(this.entry &&
      ((this.entry.textColor && this.entry.textColor !== "currentColor" && this.plugin.isValidHexColor(this.entry.textColor)) ||
       (this.entry.color && this.plugin.isValidHexColor(this.entry.color))));
    this._openHadRealBg = !isPollutedGroupBothBlackAtOpen && !!(this.entry && this.entry.backgroundColor && this.plugin.isValidHexColor(this.entry.backgroundColor));
    // Null-color display: native color inputs cannot show "null", so show the
    // null black (#000000). The previewWrap (not the picker) shows what null
    // actually renders as — var(--text-normal) text and var(--color-accent)
    // highlight/border — for accessibility. Untouched null pickers are still
    // treated as null by the open-time/touched guards, so this black fill
    // never persists as a real color.
    const nullTextDisplay = "#000000";
    const nullBgDisplay = "#000000";
    setColorInputValue(tColor,
      (this.entry &&
        (this.entry.textColor && this.entry.textColor !== "currentColor"
          ? this.entry.textColor
          : this.plugin.isValidHexColor(this.entry.color)
            ? this.entry.color
            : nullTextDisplay)) ||
      nullTextDisplay);
    setColorInputValue(bColor,
      this.entry && this.entry.backgroundColor
        ? this.entry.backgroundColor
        : nullBgDisplay);

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
            nullTextDisplay;
          const initBgColor =
            (this.entry && (this.entry.backgroundColor || "")) ||
            getColorInputValue(bColor) ||
            nullBgDisplay;
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
    // Instant preview while typing, not just on blur/Enter.
    radiusInput.addEventListener("input", () => {
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
    const shapeLeft = grid.createDiv();
    shapeLeft.textContent = this.plugin.t(
      "label_highlight_shape",
      "Highlight Shape",
    );
    const shapeRight = grid.createDiv();
    const CORNER_SHAPES = [
      "round",
      "scoop",
      "bevel",
      "notch",
      "square",
      "squircle",
    ];
    const shapeSel = shapeRight.createEl("select");
    shapeSel.setAttribute("data-act-corner-shape", "true");
    CORNER_SHAPES.forEach((value) => {
      const o = shapeSel.createEl("option", {
        text: this.plugin.t(
          "opt_corner_" + value,
          value.charAt(0).toUpperCase() + value.slice(1),
        ),
      });
      o.value = value;
    });
    const initShapeRaw =
      this.entry && typeof this.entry.cornerShape === "string" && this.entry.cornerShape
        ? this.entry.cornerShape.toLowerCase()
        : String(this.plugin.settings.cornerShape ?? "round").toLowerCase();
    shapeSel.value = CORNER_SHAPES.includes(initShapeRaw) ? initShapeRaw : "round";
    shapeSel.addEventListener("change", () => {
      if (this.entry) this.entry.cornerShape = shapeSel.value;
      renderPreview();
    });
    const shapeReset = shapeRight.createEl("button");
    shapeReset.addClass("act-highlight-reset-btn", "clickable-icon");
    try {
      setIcon(shapeReset, "reset");
    } catch (e) {}
    shapeReset.addEventListener("click", () => {
      if (this.entry) this.entry.cornerShape = undefined;
      shapeSel.value = String(
        this.plugin.settings.cornerShape ?? "round",
      ).toLowerCase();
      if (!CORNER_SHAPES.includes(shapeSel.value)) shapeSel.value = "round";
      renderPreview();
    });
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
    hPadInput.addEventListener("input", () => {
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
    vPadInput.addEventListener("input", () => {
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
    thickInput.addEventListener("input", () => {
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
      // Groups in Default (Per-Entry) mode still impose layout (radius,
      // shape, padding, opacity, border) on member entries via the compiler,
      // so preview that geometry with fallback colors instead of plain text —
      // otherwise radius/shape/etc. controls appear dead in the preview.
      // Null colors fall back to var(--text-normal) text and
      // var(--color-accent) background/border (see below).
      const renderStyle = (isGroup && !style) ? "highlight" : style;

      const tRaw = getColorInputValue(tColor);
      const bRaw = getColorInputValue(bColor);
      const isVarT = tRaw && /^var\(/.test(tRaw.trim());
      const isVarB = bRaw && /^var\(/.test(bRaw.trim());
      const hasValidT = tRaw && this.plugin.isValidHexColor(tRaw) && (isVarT || this._openHadRealText || this._tPickerTouched);
      const hasValidB = bRaw && this.plugin.isValidHexColor(bRaw) && (isVarB || this._openHadRealBg || this._bPickerTouched);
      const t = hasValidT ? tRaw : "var(--text-normal)";
      const p = this.plugin.getHighlightParams(this.entry);
      const opacity = p.opacity ?? 25;
      const radius = p.radius ?? 8;
      const pad = p.hPad ?? 4;
      const vpad = p.vPad ?? 0;
      const cornerShape = p.cornerShape ?? "round";
      // When bg is NULL or is a CSS var use color-mix() so the browser resolves it natively
      // instead of hexToRgba which can return black when getComputedStyle hasn't resolved the var yet.
      const bgCss = hasValidB
        ? (isVarB ? `color-mix(in srgb, ${bRaw.trim()} ${opacity}%, transparent)` : this.plugin.hexToRgba(bRaw, opacity))
        : `color-mix(in srgb, var(--color-accent) ${opacity}%, transparent)`;
      // Border: when text/bg is NULL border must be var(--color-accent) (not var(--text-normal) nor black)
      const effectiveBForBorder = hasValidB ? bRaw : "var(--color-accent)";
      const effectiveTForBorder = hasValidT ? tRaw : "var(--color-accent)";
      const borderStyle = renderStyle === "text" ? "" : (renderStyle === "highlight"
            ? this.plugin.generateBorderStyle(null, effectiveBForBorder, this.entry)
            : this.plugin.generateBorderStyle(effectiveTForBorder, effectiveBForBorder, this.entry));
      const bdb = "box-decoration-break:clone;-webkit-box-decoration-break:clone;";
      while (previewWrap.firstChild)
        previewWrap.removeChild(previewWrap.firstChild);
      const span = document.createElement("span");
      span.style.display = "inline";
      // Set each property individually so CSS variables are resolved natively by the browser
      if (renderStyle === "text") {
        span.style.setProperty("color", t, "important");
        span.style.setProperty("background", "transparent", "important");
      } else if (renderStyle === "highlight") {
        span.style.setProperty("background-color", bgCss, "important");
        span.style.setProperty("color", "var(--text-normal)", "important");
        span.style.setProperty("border-radius", radius + "px", "important");
        if (cornerShape && cornerShape !== "round") span.style.setProperty("corner-shape", cornerShape, "important");
        span.style.setProperty("padding", `${vpad}px ${pad}px`, "important");
        span.style.setProperty("box-decoration-break", "clone", "important");
        span.style.setProperty("-webkit-box-decoration-break", "clone", "important");
      } else {
        span.style.setProperty("color", t, "important");
        span.style.setProperty("background-color", bgCss, "important");
        span.style.setProperty("border-radius", radius + "px", "important");
        if (cornerShape && cornerShape !== "round") span.style.setProperty("corner-shape", cornerShape, "important");
        span.style.setProperty("padding", `${vpad}px ${pad}px`, "important");
        span.style.setProperty("box-decoration-break", "clone", "important");
        span.style.setProperty("-webkit-box-decoration-break", "clone", "important");
      }
      if (borderStyle) {
        borderStyle.split(';').map(s => s.trim()).filter(Boolean).forEach(bs => {
          // strip embedded !important from value before passing to setProperty
          const idx = bs.indexOf(':');
          if (idx === -1) return;
          const prop = bs.slice(0, idx).trim();
          const val = bs.slice(idx + 1).trim().replace(/\s*!important\s*$/, '');
          span.style.setProperty(prop, val, 'important');
        });
      }
      const displayText =
        !isGroup && this.entry && this.entry.isRegex && this.entry.presetLabel
          ? this.entry.presetLabel
          : words.textContent || "";
      span.textContent = displayText;
      // Apply custom CSS on top if present — use current picker colors, not stored entry colors
      if (this.entry && this.entry.customCss && this.plugin.settings.enableCustomCss) {
        try {
          const tempEntry = Object.assign({}, this.entry, {
            color: renderStyle === 'text' ? t : '',
            textColor: (renderStyle === 'both') ? t : (renderStyle === 'highlight' ? 'currentColor' : null),
            backgroundColor: (renderStyle === 'highlight' || renderStyle === 'both') ? (hasValidB ? bRaw : null) : null,
          });
          const tempCss = this.plugin.syncEntryCssFromColorsForPreview(tempEntry);
          let decl = this.plugin.sanitizeCssDeclarations(tempCss || this.entry.customCss);
          // Previews must match forced rendering (option 1): stale CSS colors
          // never repaint the preview — per-entry shows theme/accent, text
          // shows no highlight or border, highlight/both show the background
          // with borders following it. Highlight entries additionally get
          // border tokens rewritten to the background so a stale text-colored
          // border in their own CSS can't leak through. Layout previews.
          if (decl && !isGroup && renderStyle === "highlight") {
            try {
              const _bHl =
                hasValidB && bRaw ? bRaw.trim() : "var(--color-accent)";
              decl = this.plugin.sanitizeCssDeclarations(
                stripInheritedGroupCssColors(decl, _bHl, {}),
              );
            } catch (_) {}
          }
          if (decl && isGroup) {
            try {
              if (!style) {
                decl = this.plugin.sanitizeCssDeclarations(
                  stripInheritedGroupCssColors(decl, "var(--color-accent)"),
                );
              } else if (style === "text") {
                decl = this.plugin.sanitizeCssDeclarations(
                  stripInheritedGroupCssColors(decl, "currentColor", {
                    dropBorder: true,
                  }),
                );
              } else {
                const _bForBorder =
                  hasValidB && bRaw
                    ? bRaw.trim()
                    : "var(--color-accent)";
                decl = this.plugin.sanitizeCssDeclarations(
                  stripInheritedGroupCssColors(decl, _bForBorder, {}),
                );
              }
            } catch (_) {}
          }
          if (decl) {
            decl.split(";").map(s => s.trim()).filter(Boolean).forEach(p => {
              const idx = p.indexOf(":");
              if (idx === -1) return;
              span.style.setProperty(p.slice(0, idx).trim(), p.slice(idx + 1).trim(), "important");
            });
          }
        } catch (_) {}
      }
      // Final re-enforce: fallback colors must always win over stale customCss values
      if (!hasValidT && renderStyle !== 'highlight') {
        span.style.setProperty('color', 'var(--text-normal)', 'important');
      }
      if (!hasValidB && renderStyle !== 'text') {
        span.style.setProperty('background-color', bgCss, 'important');
      }
      // Sliders/inputs mutate entry fields live and recompute the managed
      // values above on every render — stale geometry in customCss (radius,
      // padding, border, shape) must not freeze the preview over them.
      if (renderStyle !== 'text') {
        span.style.setProperty("border-radius", radius + "px", "important");
        if (cornerShape && cornerShape !== "round") {
          span.style.setProperty("corner-shape", cornerShape, "important");
        } else {
          try {
            span.style.removeProperty("corner-shape");
          } catch (_) {}
        }
        span.style.setProperty("padding", `${vpad}px ${pad}px`, "important");
        try {
          span.style.setProperty("box-decoration-break", "clone", "important");
          span.style.setProperty("-webkit-box-decoration-break", "clone", "important");
        } catch (_) {}
        if (borderStyle) {
          borderStyle.split(';').map(s => s.trim()).filter(Boolean).forEach(bs => {
            const idx = bs.indexOf(':');
            if (idx === -1) return;
            const prop = bs.slice(0, idx).trim();
            const val = bs.slice(idx + 1).trim().replace(/\s*!important\s*$/, '');
            span.style.setProperty(prop, val, 'important');
          });
        } else {
          // No border wanted — clear any stale border the customCss added.
          ["border", "border-top", "border-bottom", "border-left", "border-right"].forEach((bp) => {
            try {
              span.style.removeProperty(bp);
            } catch (_) {}
          });
        }
      }
      previewWrap.appendChild(span);
    };
    const updateStyleSelectHeight = () => {
      // Per-entry groups hide the color pickers, so let the dropdown fill
      // the column height for a prettier UI. Any other type keeps its
      // natural height.
      try {
        styleSelect.style.height =
          isGroup && !styleSelect.value ? "100%" : "";
      } catch (_) {}
    };
    const updatePickerVisibility = () => {
      updateStyleSelectHeight();
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
          const shapeKeys = ["styleType","backgroundOpacity","highlightBorderRadius","cornerShape","highlightHorizontalPadding","highlightVerticalPadding","enableBorderThickness","borderStyle","borderLineStyle","borderOpacity","borderThickness","customCss"];
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
          try { shapeSel.value = String(this.entry.cornerShape ?? this.plugin.settings.cornerShape ?? "round").toLowerCase(); } catch(_){}
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
        this.entry.cornerShape = undefined;
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
      // Recompute color state from the entry's CURRENT (just-cleared) colors
      // so the preview falls back to var(--text-normal) text and
      // var(--color-accent) background/border instead of forcibly
      // re-applying stale picker values (#ffffff/#000000) via open-time
      // snapshots or earlier picker touches. Entries whose colors survive a
      // reset keep previewing those colors.
      this._openHadRealText = !!(this.entry &&
        ((this.entry.textColor && this.entry.textColor !== "currentColor" && this.plugin.isValidHexColor(this.entry.textColor)) ||
         (this.entry.color && this.plugin.isValidHexColor(this.entry.color))));
      this._openHadRealBg = !!(this.entry && this.entry.backgroundColor && this.plugin.isValidHexColor(this.entry.backgroundColor));
      this._tPickerTouched = false;
      this._bPickerTouched = false;
      try {
        opacitySlider.value = String(
          this.plugin.settings.backgroundOpacity ?? 35,
        );
        radiusInput.value = String(
          this.plugin.settings.highlightBorderRadius ?? 4,
        );
        try {
          shapeSel.value = String(
            this.plugin.settings.cornerShape ?? "round",
          ).toLowerCase();
        } catch (_) {}
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
          try {
            updateStyleSelectHeight();
          } catch (_) {}
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
      // Only treat the picker value as a real color if the user touched it or the
      // entry already had that color at open time. Without this guard, the browser
      // default #000000/#ffffff gets written to the entry and hasEntryBg becomes true.
      const realT = (this._tPickerTouched || this._openHadRealText) ? curT : "";
      const realB = (this._bPickerTouched || this._openHadRealBg) ? curB : "";
      this.entry._savedTextColor =
        realT ||
        this.entry._savedTextColor ||
        this.entry.color ||
        this.entry.textColor ||
        "";
      this.entry._savedBackgroundColor =
        realB ||
        this.entry._savedBackgroundColor ||
        this.entry.backgroundColor ||
        "";
      if (style === "text") {
        this.entry.color = realT || "";
      } else if (style === "highlight") {
        this.entry.backgroundColor = realB || "";
        this.entry.textColor = "currentColor";
        this.entry.color = "";
      } else {
        this.entry.textColor = realT || "";
        this.entry.backgroundColor = realB || "";
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
        // Show only the panels matching the colortype: text shows the color
        // panel, highlight the highlight panel, both shows both panels.
        // Per-entry (no type) shows both so either channel can be picked.
        const nestedStyle =
          (this.entry && this.entry.styleType) || styleSelect.value || "";
        const nestedMode =
          nestedStyle === "text"
            ? "text"
            : nestedStyle === "highlight"
              ? "background"
              : "text-and-background";
        const showNestedText = nestedMode !== "background";
        const showNestedBg = nestedMode !== "text";
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

            // The nested picker is authoritative per shown panel: a null
            // result for a shown panel means Reset (untouched panels keep
            // their prefilled valid color). Clearing removes hex/var codes
            // and shows null black — never restore the old color. Hidden
            // panels are left untouched.
            if (showNestedText) {
              if (tc) {
                setColorInputValue(tColor, tc);
                this._tPickerTouched = true;
              } else {
                setColorInputValue(tColor, "#000000");
                this._tPickerTouched = false;
                this._openHadRealText = false;
              }
            }

            if (showNestedBg) {
              if (bc) {
                setColorInputValue(bColor, bc);
                this._bPickerTouched = true;
              } else {
                setColorInputValue(bColor, "#000000");
                this._bPickerTouched = false;
                this._openHadRealBg = false;
              }
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

            dispatchHighlightColorsChanged();
            renderPreview();
          },
          nestedMode,
          this.previewTextOverride || currentColor,
          false,
          this.entry ? this.entry.markTarget : "text",
          this.entry,
        );
        modal._hideHeaderControls = true;
        // Only prefill real colors — never the null-black display fill.
        // Otherwise a reset-to-null entry reopens with #000000 ghosted as real.
        try {
          const _e = this.entry;
          const _realT = (_e && ((_e.textColor && _e.textColor !== "currentColor" && this.plugin.isValidHexColor(_e.textColor)) ? _e.textColor : (this.plugin.isValidHexColor(_e.color) ? _e.color : null)))
            || ((this._tPickerTouched || this._openHadRealText) ? getColorInputValue(tColor) : null);
          const _realB = (_e && _e.backgroundColor && this.plugin.isValidHexColor(_e.backgroundColor) ? _e.backgroundColor : null)
            || ((this._bPickerTouched || this._openHadRealBg) ? getColorInputValue(bColor) : null);
          if (showNestedText && _realT && this.plugin.isValidHexColor(_realT)) modal._preFillTextColor = _realT;
          if (showNestedBg && _realB && this.plugin.isValidHexColor(_realB)) {
            modal._preFillBgColor = _realB;
            modal._preFillBorderColor = _realB;
          }
        } catch (_) {}
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
                  : nullTextDisplay)) ||
            nullTextDisplay;
          const initBgColor =
            this.entry && this.entry.backgroundColor
              ? this.entry.backgroundColor
              : nullBgDisplay;
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
          try {
            updateStyleSelectHeight();
          } catch (_) {}
        } else {
          this.entry.styleType = st;
          pickerRow.style.display = "";
          try {
            updateStyleSelectHeight();
          } catch (_) {}
          try {
            updatePickerVisibility();
          } catch (_) {}
          // Groups: a null group color must stay null so member entries'
          // own colours apply. Only write picker values when the picker was
          // touched or the group already had a real color at open time —
          // otherwise the native input's default (#ffffff/#000000) would
          // pollute the group and override every entry (e.g. black bg).
          const tHad = this._tPickerTouched || this._openHadRealText;
          const bHad = this._bPickerTouched || this._openHadRealBg;
          if (st === "text") {
            this.entry.color = isGroup && !tHad ? undefined : (getColorInputValue(tColor) || "");
            this.entry.textColor = null;
            this.entry.backgroundColor = null;
          } else if (st === "highlight") {
            this.entry.color = "";
            this.entry.textColor = "currentColor";
            this.entry.backgroundColor = isGroup && !bHad ? undefined : (getColorInputValue(bColor) || "");
          } else {
            this.entry.color = "";
            this.entry.textColor = isGroup && !tHad ? undefined : (getColorInputValue(tColor) || "");
            this.entry.backgroundColor = isGroup && !bHad ? undefined : (getColorInputValue(bColor) || "");
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
        let st = styleSelect.value;
        // Validity predicate shared by narrowing (groups) and saving below:
        // a picker value only counts as a real color for vars, touched
        // pickers, or entries that already held a real color at open time.
        // Untouched null-black display fills (#000000) never count.
        const tRawPeek = getColorInputValue(tColor);
        const bRawPeek = getColorInputValue(bColor);
        const hasEntryTextPeek = !!(
          this.entry &&
          ((this.entry.textColor &&
            this.entry.textColor !== "currentColor" &&
            this.plugin.isValidHexColor(this.entry.textColor)) ||
            (this.entry.color && this.plugin.isValidHexColor(this.entry.color)))
        );
        const hasEntryBgPeek = !!(
          this.entry &&
          this.entry.backgroundColor &&
          this.plugin.isValidHexColor(this.entry.backgroundColor)
        );
        const isVarPeek = (v) => v && /^var\(/.test(String(v).trim());
        const validTPeek =
          tRawPeek &&
          this.plugin.isValidHexColor(tRawPeek) &&
          (isVarPeek(tRawPeek) || hasEntryTextPeek || this._tPickerTouched);
        const validBPeek =
          bRawPeek &&
          this.plugin.isValidHexColor(bRawPeek) &&
          (isVarPeek(bRawPeek) || hasEntryBgPeek || this._bPickerTouched);
        if (isGroup && st) {
          // Narrow a forced group type by availability: a forced channel with
          // a null/reset color must not apply — it would otherwise strip
          // members of their own colours with nothing to force with.
          if (st === "text" && !validTPeek) st = "";
          else if (st === "highlight" && !validBPeek) st = "";
          else if (st === "both")
            st =
              validTPeek && validBPeek
                ? "both"
                : validTPeek
                  ? "text"
                  : validBPeek
                    ? "highlight"
                    : "";
        }
        if (isGroup && !st) {
          this.entry.styleType = undefined;
          this.entry.color = undefined;
          this.entry.textColor = undefined;
          this.entry.backgroundColor = undefined;
          // Drop stale auto-derived CSS colors (e.g. orange from a previous
          // forced type) so per-entry members keep their own colours; layout
          // declarations are preserved by the sync.
          if (this.entry.customCss) {
            try {
              this.plugin.syncEntryCssFromColors(this.entry);
            } catch (_) {}
          }
        } else {
          const tRawSave = getColorInputValue(tColor);
          const bRawSave = getColorInputValue(bColor);
          const hasEntryTextSave = !!(this.entry && ((this.entry.textColor && this.entry.textColor !== "currentColor" && this.plugin.isValidHexColor(this.entry.textColor)) || (this.entry.color && this.plugin.isValidHexColor(this.entry.color))));
          const hasEntryBgSave = !!(this.entry && this.entry.backgroundColor && this.plugin.isValidHexColor(this.entry.backgroundColor));
          const isVarTSave = tRawSave && /^var\(/.test(tRawSave.trim());
          const isVarBSave = bRawSave && /^var\(/.test(bRawSave.trim());
          const hasValidTSave = tRawSave && this.plugin.isValidHexColor(tRawSave) && (isVarTSave || hasEntryTextSave || this._tPickerTouched);
          const hasValidBSave = bRawSave && this.plugin.isValidHexColor(bRawSave) && (isVarBSave || hasEntryBgSave || this._bPickerTouched);
          // When style needs a color but picker is null, save var(--text-normal)/var(--color-accent) for preview consistency.
          // Groups are exempt: a null group color must stay null (undefined)
          // so it is ignored and member entries' own colours apply. Saving a
          // placeholder var here would override every entry in the group.
          const effectiveTSave = hasValidTSave ? tRawSave : "var(--text-normal)";
          const effectiveBSave = hasValidBSave ? bRawSave : "var(--color-accent)";
          this.entry.styleType = st;
          if (st === "text") {
            this.entry.color = hasValidTSave ? tRawSave : (isGroup ? undefined : "var(--text-normal)");
            this.entry.textColor = null;
            this.entry.backgroundColor = null;
          } else if (st === "highlight") {
            this.entry.color = "";
            this.entry.textColor = "currentColor";
            this.entry.backgroundColor = hasValidBSave ? bRawSave : (isGroup ? undefined : "var(--color-accent)");
          } else {
            this.entry.color = "";
            this.entry.textColor = hasValidTSave ? tRawSave : (isGroup ? undefined : "var(--text-normal)");
            this.entry.backgroundColor = hasValidBSave ? bRawSave : (isGroup ? undefined : "var(--color-accent)");
          }
          if (isGroup) {
            // Collapse a both-black text+background combo (native picker
            // defaults saved as #000000/#000000) back to null. A single
            // black (e.g. black text on red) is legitimate and is kept.
            const _gT = st === "text" ? this.entry.color : this.entry.textColor;
            const _gB = this.entry.backgroundColor;
            if (
              String(_gT || "").toLowerCase() === "#000000" &&
              String(_gB || "").toLowerCase() === "#000000"
            ) {
              if (st === "text") this.entry.color = undefined;
              else this.entry.textColor = undefined;
              this.entry.backgroundColor = undefined;
            }
          }
        }
        // Save highlight styling parameters
        if (this._resetAllApplied) {
          this.entry.backgroundOpacity = undefined;
          this.entry.highlightBorderRadius = undefined;
          this.entry.cornerShape = undefined;
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
          this.entry.cornerShape = shapeSel.value || (this.plugin.settings.cornerShape ?? "round");
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

        // If entry has customCss, patch only the color/layout properties that
        // HighlightStylingModal controls — preserve any user-added custom properties.
        // Runs for entries AND groups so a stale border-radius/padding in
        // customCss can't silently override the saved styling (custom CSS wins
        // at render time).
        if (this.entry.customCss) {
          try { this.plugin.syncEntryCssFromColors(this.entry); } catch (_) {}
          // Also patch padding/radius/border/corner-shape from the updated structured fields
          try {
            const patched = patchCssLayoutFromEntry(this.entry.customCss, this.entry, this.plugin);
            this.entry.customCss = patched;
          } catch (_) {}
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
          foundArray[foundIdx].cornerShape =
            this.entry.cornerShape;
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
          foundArray[foundIdx].customCss = this.entry.customCss;
        }

        // Groups: this.entry may itself be a word group (has .entries). The
        // uid lookup above only matches member entries, so without this the
        // group styling save silently persisted nothing to settings.
        if (
          isGroup &&
          this.entry &&
          this.entry.uid &&
          Array.isArray(this.plugin.settings.wordEntryGroups)
        ) {
          const gIdx = this.plugin.settings.wordEntryGroups.findIndex(
            (g) => g && g.uid === this.entry.uid,
          );
          if (gIdx !== -1) {
            const g = this.plugin.settings.wordEntryGroups[gIdx];
            g.styleType = this.entry.styleType;
            g.color = this.entry.color;
            g.textColor = this.entry.textColor;
            g.backgroundColor = this.entry.backgroundColor;
            g.backgroundOpacity = this.entry.backgroundOpacity;
            g.highlightBorderRadius = this.entry.highlightBorderRadius;
            g.cornerShape = this.entry.cornerShape;
            g.highlightHorizontalPadding = this.entry.highlightHorizontalPadding;
            g.highlightVerticalPadding = this.entry.highlightVerticalPadding;
            g.enableBorderThickness = this.entry.enableBorderThickness;
            g.borderStyle = this.entry.borderStyle;
            g.borderLineStyle = this.entry.borderLineStyle;
            g.borderOpacity = this.entry.borderOpacity;
            g.borderThickness = this.entry.borderThickness;
            g.customCss = this.entry.customCss;
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
