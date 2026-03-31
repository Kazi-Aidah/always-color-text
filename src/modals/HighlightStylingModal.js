import { Modal, setIcon } from 'obsidian';
import { escapeHtml } from '../utils/debug.js';
import { ColorPickerModal } from './ColorPickerModal.js';

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

    // Global listener to detect user interaction and clear reset flag
    const clearResetFlag = () => {
      this._resetAllApplied = false;
    };
    contentEl.addEventListener("input", clearResetFlag, true);
    contentEl.addEventListener("change", clearResetFlag, true);
    this._handlers.push({ el: contentEl, ev: "input", fn: clearResetFlag });
    this._handlers.push({ el: contentEl, ev: "change", fn: clearResetFlag });

    contentEl.empty();
    try {
      this.modalEl.addClass("act-highlight-styling-modal");
      this.modalEl.addClass("act-highlight-modal");
      this.modalEl.style.padding = "20px";
    } catch (e) {}

    const isGroup = this.entry && Array.isArray(this.entry.entries);

    // Header Row with Selects
    const headerRow = contentEl.createDiv();
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
      groupSelect.style.textAlign = "center";
      const defaultOpt = groupSelect.createEl("option", {
        text: this.plugin.t("default"),
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

    // Match Select (hide for Quick Once)
    let matchSelect = null;
    if (!fromQuickOnce) {
      matchSelect = headerRow.createEl("select");
      matchSelect.style.minWidth = "120px";
      matchSelect.style.border = "1px solid var(--background-modifier-border)";
      matchSelect.style.borderRadius = "4px";
      matchSelect.style.background = "var(--background-modifier-form-field)";
      matchSelect.style.textAlign = "center";
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
    previewWrap.style.display = "block";
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
    styleSelect.style.textAlign = "center";
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
    tColor.value =
      (this.entry &&
        (this.entry.textColor && this.entry.textColor !== "currentColor"
          ? this.entry.textColor
          : this.plugin.isValidHexColor(this.entry.color)
            ? this.entry.color
            : "#ffffff")) ||
      "#ffffff";
    bColor.value =
      this.entry && this.entry.backgroundColor
        ? this.entry.backgroundColor
        : "#000000";

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
            tColor.value ||
            "#ffffff";
          const initBgColor =
            (this.entry && (this.entry.backgroundColor || "")) ||
            bColor.value ||
            "#000000";
          if (this.plugin.isValidHexColor(initTextColor))
            tColor.value = initTextColor;
          if (this.plugin.isValidHexColor(initBgColor))
            bColor.value = initBgColor;
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
      resetBtn.addClass("act-highlight-reset-btn");
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
    radiusReset.addClass("act-highlight-reset-btn");
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
    hPadReset.addClass("act-highlight-reset-btn");
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
    vPadReset.addClass("act-highlight-reset-btn");
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
    sidesReset.addClass("act-highlight-reset-btn");
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
    styleReset.addClass("act-highlight-reset-btn");
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
    bOpReset.addClass("act-highlight-reset-btn");
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
    thickReset.addClass("act-highlight-reset-btn");
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

      const t = tColor.value;
      const b = bColor.value;
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
      span.textContent = displayText;
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
    tColor.addEventListener("input", styleChange);
    bColor.addEventListener("input", styleChange);
    this._handlers.push({ el: styleSelect, ev: "change", fn: styleChange });
    this._handlers.push({ el: tColor, ev: "input", fn: styleChange });
    this._handlers.push({ el: bColor, ev: "input", fn: styleChange });
    updatePickerVisibility();
    renderPreview();
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
      this.entry._savedTextColor =
        tColor.value ||
        this.entry._savedTextColor ||
        this.entry.color ||
        this.entry.textColor ||
        "";
      this.entry._savedBackgroundColor =
        bColor.value ||
        this.entry._savedBackgroundColor ||
        this.entry.backgroundColor ||
        "";
      if (style === "text") {
        this.entry.color = tColor.value || "";
      } else if (style === "highlight") {
        this.entry.backgroundColor = bColor.value || "";
        this.entry.textColor = "currentColor";
        this.entry.color = "";
      } else {
        this.entry.textColor = tColor.value || "";
        this.entry.backgroundColor = bColor.value || "";
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
        const currentColor = colorInput.value || "#000000";
        const isTextPicker = colorInput === tColor;
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
              tColor.value = tc;
              changed = true;
            } else if (fallback && isTextPicker) {
              tColor.value = fallback;
              changed = true;
            }

            if (bc) {
              bColor.value = bc;
              changed = true;
            } else if (fallback && !isTextPicker) {
              bColor.value = fallback;
              changed = true;
            }

            if (!changed) {
              if (currentColor && this.plugin.isValidHexColor(currentColor)) {
                if (isTextPicker) tColor.value = currentColor;
                else bColor.value = currentColor;
              }
            }

            dispatchHighlightColorsChanged();
            renderPreview();
          },
          isTextPicker ? "text" : "background",
          this.previewTextOverride || currentColor,
          false,
        );
        modal._hideHeaderControls = true;
        if (tColor.value) modal._preFillTextColor = tColor.value;
        if (bColor.value) {
          modal._preFillBgColor = bColor.value;
          modal._preFillBorderColor = bColor.value;
        }
        modal.open();
      });
    };
    setupHighlightColorPickerRightClick(tColor);
    setupHighlightColorPickerRightClick(bColor);

    // Add real-time syncing to this.entry when colors change
    const tColorInputHandler = () => {
      dispatchHighlightColorsChanged();
      renderPreview();
    };
    const bColorInputHandler = () => {
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
            tColor.value = initTextColor;
          if (this.plugin.isValidHexColor(initBgColor))
            bColor.value = initBgColor;
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
            this.entry.color = tColor.value || "";
            this.entry.textColor = null;
            this.entry.backgroundColor = null;
          } else if (st === "highlight") {
            this.entry.color = "";
            this.entry.textColor = "currentColor";
            this.entry.backgroundColor = bColor.value || "";
          } else {
            this.entry.color = "";
            this.entry.textColor = tColor.value || "";
            this.entry.backgroundColor = bColor.value || "";
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
          this.entry.styleType = st;
          if (st === "text") {
            this.entry.color = tColor.value || "";
            this.entry.textColor = null;
            this.entry.backgroundColor = null;
          } else if (st === "highlight") {
            this.entry.color = "";
            this.entry.textColor = "currentColor";
            this.entry.backgroundColor = bColor.value || "";
          } else {
            this.entry.color = "";
            this.entry.textColor = tColor.value || "";
            this.entry.backgroundColor = bColor.value || "";
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
                  : this.entry?.color) || textColorInput.value;
              if (this.plugin.isValidHexColor(textColor)) {
                textColorInput.value = textColor;
              }
            }
            if (st === "highlight" || st === "both") {
              const bgColor = this.entry?.backgroundColor || bgColorInput.value;
              if (this.plugin.isValidHexColor(bgColor)) {
                bgColorInput.value = bgColor;
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
    // Auto-save on close if not already saved via button (implicit check via state?)
    // Actually we just trigger saveData(false) which saves current state.
    // If user clicked Save, modal is closed and this is called again?
    // Modal.close() -> ... -> onClose().
    // If saveHandler calls close(), close() calls onClose().
    // So we need to know if we should auto-save.
    // Ideally, saveData() is idempotent or harmless if called twice.
    // But we don't want to double-save if we can avoid it.
    // However, since we can't easily pass state, we'll just save. It's safe.
    try {
      if (this._saveData) {
        // We must ensure we don't trigger this if the modal is already closing due to save button?
        // Actually, if save button was clicked, we already saved.
        // But it's hard to distinguish.
        // Let's just save. It's a few ms overhead.
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
