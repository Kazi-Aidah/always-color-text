import { Modal, Notice, setIcon } from 'obsidian';
import { EditEntryModal } from './EditEntryModal.js';
import { HighlightStylingModal } from './HighlightStylingModal.js';
import { debugLog } from '../utils/debug.js';

export class ColorPickerModal extends Modal {
  constructor(
    app,
    plugin,
    callback,
    mode = "text",
    selectedText = "",
    isQuickOnce = false,
  ) {
    super(app);
    this.plugin = plugin;
    this.callback = callback;
    this.mode =
      mode === "background" || mode === "text-and-background" ? mode : "text";
    this._selectedText = selectedText || "";
    this._eventListeners = []; // Track event listeners for cleanup
    this.isQuickOnce = !!isQuickOnce;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this._eventListeners = []; // Reset listeners
    this._hasUserChanges = false;
    const cpm = this.plugin.settings.colorPickerMode || "both";
    const forcedSingle = this.mode === "text" || this.mode === "background";
    const isBoth =
      !forcedSingle &&
      (cpm === "both" ||
        cpm === "both-bg-left" ||
        cpm === "both-v-text-top" ||
        cpm === "both-v-bg-top");
    const isHorizontalBoth =
      !forcedSingle && (cpm === "both" || cpm === "both-bg-left");
    const isVerticalBoth =
      !forcedSingle && (cpm === "both-v-text-top" || cpm === "both-v-bg-top");
    this.modalEl.style.maxWidth = isHorizontalBoth ? "650px" : "480px";
    this.modalEl.style.width = "100%";
    this.modalEl.style.margin = "0";
    this.modalEl.style.padding = "0";
    try {
      this.modalEl.addClass("act-color-picker-modal");
    } catch (e) {}

    contentEl.style.padding = "24px";
    contentEl.style.boxSizing = "border-box";
    contentEl.style.display = "grid";
    contentEl.style.gridTemplateColumns = isHorizontalBoth ? "1fr 1fr" : "1fr";
    contentEl.style.columnGap = "10px"; // this
    contentEl.style.rowGap = "10px"; // this this lookie
    contentEl.style.alignItems = "stretch";
    try {
      contentEl.addClass("act-color-picker-content");
    } catch (e) {}

    const headerRow = contentEl.createDiv();
    headerRow.style.display = "flex";
    headerRow.style.alignItems = "center";
    headerRow.style.gap = "8px";
    headerRow.style.gridColumn = "1 / -1";
    headerRow.style.marginBottom = "16px";
    try {
      headerRow.addClass("act-modal-header-controls");
    } catch (e) {
      try {
        headerRow.classList.add("act-modal-header-controls");
      } catch (_) {}
    }
    const h2 = headerRow.createEl("h2", {
      text: this.plugin.t("pick_color_header", "Pick Color"),
    });
    h2.style.marginTop = "0";
    h2.style.marginBottom = "0px";
    h2.style.flex = "1 1 auto";
    const hideControls = !!this._hideHeaderControls;
    const isQuick = !!this.isQuickOnce;
    const quickColor = isQuick && this.mode === "text";
    const quickHighlight = isQuick && this.mode === "background";
    const quickBoth = isQuick && this.mode === "text-and-background";
    const groupsRaw = Array.isArray(this.plugin.settings.wordEntryGroups)
      ? this.plugin.settings.wordEntryGroups
      : [];
    const groups = this.plugin.settings.hideInactiveGroupsInDropdowns
      ? groupsRaw.filter((g) => g && g.active)
      : groupsRaw;
    if (!hideControls && !isQuick && groups.length > 0) {
      const groupSelect = headerRow.createEl("select");
      groupSelect.style.padding = "6px";
      groupSelect.style.borderRadius = "4px";
      groupSelect.style.border = "1px solid var(--background-modifier-border)";
      groupSelect.style.textAlign = "center";
      groupSelect.style.maxWidth = "120px";
      try {
        groupSelect.style.setProperty("max-width", "120px", "important");
        groupSelect.style.setProperty("width", "120px", "important");
        groupSelect.style.setProperty("min-width", "120px", "important");
      } catch (e) {}
      groupSelect.style.flex = "0 0 auto";
      groupSelect.style.marginLeft = "auto";
      groupSelect.createEl("option", {
        text: this.plugin.t("default", "Default"),
        value: "",
      });
      groups.forEach((g) => {
        groupSelect.createEl("option", {
          text: String(g?.name || "Unnamed Group"),
          value: String(g?.uid || ""),
        });
      });
      groupSelect.value = "";
      const groupChange = () => {
        this._selectedGroupUid = groupSelect.value || null;
        this._hasUserChanges = true;
      };
      groupSelect.addEventListener("change", groupChange);
      this._eventListeners.push({
        el: groupSelect,
        event: "change",
        handler: groupChange,
      });
      this._groupSelect = groupSelect;
    }
    if (!hideControls && !isQuick) {
      const matchSelect = headerRow.createEl("select");
      matchSelect.style.padding = "6px";
      matchSelect.style.borderRadius = "4px";
      matchSelect.style.border = "1px solid var(--background-modifier-border)";
      matchSelect.style.textAlign = "center";
      matchSelect.style.maxWidth = "100px";
      try {
        matchSelect.style.setProperty("max-width", "100px", "important");
        matchSelect.style.setProperty("width", "100px", "important");
        matchSelect.style.setProperty("min-width", "100px", "important");
      } catch (e) {}
      matchSelect.style.flex = "0 0 auto";
      matchSelect.innerHTML = `<option value="exact">${this.plugin.t("match_option_exact", "Exact")}</option><option value="contains">${this.plugin.t("match_option_contains", "Contains")}</option><option value="startswith">${this.plugin.t("match_option_starts_with", "Starts with")}</option><option value="endswith">${this.plugin.t("match_option_ends_with", "Ends with")}</option>`;
      this._matchType = this.plugin.settings.partialMatch
        ? "contains"
        : "exact";
      matchSelect.value = this._matchType;
      const mtHandler = () => {
        this._matchType = matchSelect.value;
        this._hasUserChanges = true;
      };
      matchSelect.addEventListener("change", mtHandler);
      this._eventListeners.push({
        el: matchSelect,
        event: "change",
        handler: mtHandler,
      });
      this._matchSelect = matchSelect;
    }

    let editBtn = null;
    const shouldShowEdit =
      (!hideControls && !isQuick) || quickHighlight || quickBoth;
    if (shouldShowEdit) {
      editBtn = headerRow.createEl("button");
      try {
        setIcon(editBtn, "edit-3");
      } catch (e) {}
      editBtn.title = this.plugin.t("edit_entry_header", "Edit Entry");
      editBtn.style.flex = "0 0 auto";
      editBtn.style.display = "flex";
      editBtn.style.alignItems = "center";
      editBtn.style.justifyContent = "center";
      editBtn.style.padding = "6px";
      editBtn.style.borderRadius = "4px";
      editBtn.style.border = "1px solid var(--background-modifier-border)";
      editBtn.style.background = "var(--background-modifier-form-field)";
      editBtn.style.cursor = "pointer";
      editBtn.disabled = true;
    }

    this.selectedTextColor = null;
    this.selectedBgColor = null;

    const previewWrap = contentEl.createDiv();
    previewWrap.style.border = "1px solid var(--background-modifier-border)";
    previewWrap.style.borderRadius = "14px";
    previewWrap.style.padding = "14px";
    previewWrap.style.marginBottom = "0";
    previewWrap.style.display = "block";
    previewWrap.style.gridColumn = "1 / -1";
    // previewWrap.style.backgroundColor = 'var(--background-primary-alt)';

    const preview = previewWrap.createEl("span");
    const displayText = String(
      this._selectedText || this._preFillPattern || this._preFillName || "",
    ).trim();
    preview.textContent = displayText
      ? displayText
      : this.plugin.t("selected_text_preview", "Selected Text");
    preview.style.display = "inline";
    preview.style.borderRadius = "8px";
    // preview.style.padding = '6px 12px';
    preview.style.fontWeight = "600";
    preview.style.backgroundColor = "";
    preview.style.color = "";

    // For Highlight Once: show no styling until a color is picked
    if (this.isQuickOnce) {
      try {
        preview.style.backgroundColor = "";
        preview.style.border = "";
        preview.style.borderTop = "";
        preview.style.borderBottom = "";
        preview.style.borderLeft = "";
        preview.style.borderRight = "";
        preview.style.borderRadius = "";
        preview.style.paddingLeft = "";
        preview.style.paddingRight = "";
      } catch (e) {}
    }

    const updateGridCols = () => {
      try {
        if (isHorizontalBoth && window.innerWidth > 768) {
          contentEl.style.gridTemplateColumns = "1fr 1fr";
        } else {
          contentEl.style.gridTemplateColumns = "1fr";
        }
      } catch (e) {}
    };
    updateGridCols();
    try {
      window.addEventListener("resize", updateGridCols);
      this._eventListeners.push({
        el: window,
        event: "resize",
        handler: updateGridCols,
      });
    } catch (e) {}

    const defaultSwatches = [
      "#eb3b5a",
      "#fa8231",
      "#e5a216",
      "#20bf6b",
      "#0fb9b1",
      "#2d98da",
      "#3867d6",
      "#5454d0",
      "#8854d0",
      "#b554d0",
      "#e832c1",
      "#e83289",
      "#965b3b",
      "#8392a4",
    ];

    const namedSwatches = Array.isArray(this.plugin.settings.swatches)
      ? this.plugin.settings.swatches
      : [];
    const namedColors = namedSwatches
      .map((sw) => sw && sw.color)
      .filter(Boolean);
    const userCustomSwatches = Array.isArray(
      this.plugin.settings.userCustomSwatches,
    )
      ? this.plugin.settings.userCustomSwatches
      : [];
    const userCustomColors = userCustomSwatches
      .map((sw) => sw && sw.color)
      .filter((c) => typeof c === "string" && this.plugin.isValidHexColor(c));

    let colorPool = [];
    const replaceDefaults = !!this.plugin.settings.replaceDefaultSwatches;

    // Logic for color pool:
    // 1. If replaceDefaults is ON and there are custom colors, ONLY show custom colors
    // 2. If replaceDefaults is OFF, show defaults THEN custom colors after
    if (replaceDefaults && userCustomColors.length > 0) {
      // ONLY custom colors
      colorPool = userCustomColors;
    } else if (
      replaceDefaults &&
      namedColors.length > 0 &&
      userCustomColors.length === 0
    ) {
      // User turned on replaceDefaults but has no custom colors, show named defaults only
      colorPool = namedColors;
    } else if (!replaceDefaults) {
      // Show defaults first, then custom colors after
      colorPool = namedColors.concat(userCustomColors);
    } else {
      // Fallback
      colorPool = namedColors;
    }

    const seen = new Set();
    const swatchItems = [];
    for (const c of colorPool) {
      if (!c || typeof c !== "string") continue;
      const lc = c.toLowerCase();
      if (!this.plugin.isValidHexColor(c)) continue;
      if (seen.has(lc)) continue;
      seen.add(lc);
      const match = namedSwatches.find(
        (sw) => sw && sw.color && sw.color.toLowerCase() === lc,
      );
      const customMatch = userCustomSwatches.find(
        (sw) => sw && sw.color && sw.color.toLowerCase() === lc,
      );
      swatchItems.push({
        color: c,
        name: (customMatch && customMatch.name) || (match && match.name),
      });
    }

    const panelStates = {};
    const buildPanel = (titleText, type) => {
      const col = contentEl.createDiv();
      col.style.border = "1px solid var(--background-modifier-border)";
      col.style.borderRadius = "12px";
      col.style.padding = "12px";
      col.addClass("color-picker-panel");
      col.style.marginBottom = "0";
      col.style.height = "100%";
      // col.style.backgroundColor = 'var(--background-primary-alt)';

      const header = col.createDiv();
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.gap = "8px";
      const label = header.createEl("div", { text: titleText });
      label.style.opacity = "0.9";

      const resetBtn = header.createEl("button", {
        text: this.plugin.t("btn_reset", "Reset"),
      });
      resetBtn.style.marginLeft = "auto";
      resetBtn.style.fontSize = "12px";
      resetBtn.style.padding = "4px 8px";

      const row = col.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "10px";
      row.style.marginTop = "10px";
      row.style.flexWrap = "wrap";

      const colorInput = row.createEl("input", { type: "color" });
      colorInput.title = titleText;
      colorInput.style.width = "44px";
      colorInput.style.height = "44px";
      colorInput.style.border = "none";
      colorInput.style.borderRadius = "12px";
      colorInput.style.cursor = "pointer";
      colorInput.value = "#000000";

      const hex = row.createEl("input", { type: "text" });
      hex.title = titleText;
      hex.style.flex = "1";
      hex.style.padding = "8px";
      hex.style.borderRadius = "8px";
      hex.style.border = "1px solid var(--background-modifier-border)";
      hex.style.width = "120px";
      hex.placeholder = "#000000";
      hex.value = "";

      const grid = col.createDiv();
      grid.title = titleText;
      grid.addClass("color-swatch-grid");

      const apply = (val) => {
        if (type === "text") {
          this.selectedTextColor = val;
          preview.style.color = val;
          try {
            preview.style.setProperty("--highlight-color", val);
          } catch (e) {}
          this._hasUserChanges = true;
        } else {
          this.selectedBgColor = val;
          // Clear any existing border styles first
          preview.style.border = "";
          preview.style.borderTop = "";
          preview.style.borderBottom = "";
          preview.style.borderLeft = "";
          preview.style.borderRight = "";
          // Use quick-highlight styling only when invoked for Highlight Once
          if (this.isQuickOnce) {
            if (this.plugin.settings.quickHighlightUseGlobalStyle) {
              const rgba = this.plugin.hexToRgba(
                val,
                this.plugin.settings.backgroundOpacity ?? 25,
              );
              const radius = this.plugin.settings.highlightBorderRadius ?? 8;
              const pad = this.plugin.settings.highlightHorizontalPadding ?? 4;
              const vpad = this.plugin.settings.highlightVerticalPadding ?? 0;
              preview.style.backgroundColor = rgba;
              preview.style.borderRadius = radius + "px";
              preview.style.paddingLeft = preview.style.paddingRight =
                pad + "px";
              try {
                preview.style.setProperty("padding-top", vpad + "px");
                preview.style.setProperty("padding-bottom", vpad + "px");
              } catch (e) {
                preview.style.paddingTop = preview.style.paddingBottom =
                  vpad + "px";
              }
              if (this.plugin.settings.enableBoxDecorationBreak ?? true) {
                preview.style.boxDecorationBreak = "clone";
                preview.style.WebkitBoxDecorationBreak = "clone";
              }
              this.plugin.applyBorderStyleToElement(preview, null, val);
            } else if (this.plugin.settings.quickHighlightStyleEnable) {
              const hexWithAlpha = this.plugin.hexToHexWithAlpha(
                val,
                this.plugin.settings.quickHighlightOpacity ?? 25,
              );
              const radius =
                this.plugin.settings.quickHighlightBorderRadius ?? 8;
              const pad =
                this.plugin.settings.quickHighlightHorizontalPadding ?? 4;
              const vpad =
                this.plugin.settings.quickHighlightVerticalPadding ?? 0;
              preview.style.backgroundColor = hexWithAlpha;
              preview.style.borderRadius = radius + "px";
              preview.style.paddingLeft = preview.style.paddingRight =
                pad + "px";
              try {
                preview.style.setProperty("padding-top", vpad + "px");
                preview.style.setProperty("padding-bottom", vpad + "px");
              } catch (e) {
                preview.style.paddingTop = preview.style.paddingBottom =
                  vpad + "px";
              }
              // Apply once-style border using generated CSS
              const borderCss = this.plugin.generateOnceBorderStyle(val);
              try {
                preview.style.cssText += borderCss;
              } catch (e) {}
            } else {
              // Default simple highlight
              const rgba = this.plugin.hexToRgba(val, 25);
              preview.style.backgroundColor = rgba;
              preview.style.borderRadius = "";
              preview.style.paddingLeft = preview.style.paddingRight = "";
              preview.style.paddingTop = preview.style.paddingBottom = "";
            }
            this._hasUserChanges = true;
          } else {
            const op =
              matchedEntry && typeof matchedEntry.backgroundOpacity === "number"
                ? matchedEntry.backgroundOpacity
                : (this.plugin.settings.backgroundOpacity ?? 25);
            const rgba = this.plugin.hexToRgba(val, op);
            preview.style.backgroundColor = rgba;
            this.plugin.applyBorderStyleToElement(
              preview,
              null,
              val,
              matchedEntry,
            );
            const hPad =
              matchedEntry &&
              typeof matchedEntry.highlightHorizontalPadding === "number"
                ? matchedEntry.highlightHorizontalPadding
                : (this.plugin.settings.highlightHorizontalPadding ?? 4);
            const vPad =
              matchedEntry &&
              typeof matchedEntry.highlightVerticalPadding === "number"
                ? matchedEntry.highlightVerticalPadding
                : (this.plugin.settings.highlightVerticalPadding ?? 0);
            const radius =
              matchedEntry &&
              typeof matchedEntry.highlightBorderRadius === "number"
                ? matchedEntry.highlightBorderRadius
                : (this.plugin.settings.highlightBorderRadius ?? 8);
            preview.style.paddingLeft = preview.style.paddingRight =
              hPad + "px";
            try {
              preview.style.setProperty("padding-top", vPad + "px");
              preview.style.setProperty("padding-bottom", vPad + "px");
            } catch (e) {
              preview.style.paddingTop = preview.style.paddingBottom =
                vPad + "px";
            }
            preview.style.borderRadius = radius + "px";
            if (this.plugin.settings.enableBoxDecorationBreak ?? true) {
              preview.style.boxDecorationBreak = "clone";
              preview.style.WebkitBoxDecorationBreak = "clone";
            }
            this._hasUserChanges = true;
          }
        }
        hex.value = val;
        colorInput.value = val;
      };

      const colorChange = () => {
        const v = colorInput.value;
        apply(v);
      };
      colorInput.addEventListener("input", colorChange);
      this._eventListeners.push({
        el: colorInput,
        event: "input",
        handler: colorChange,
      });
      colorInput.addEventListener("change", colorChange);
      this._eventListeners.push({
        el: colorInput,
        event: "change",
        handler: colorChange,
      });

      const hexChange = () => {
        let v = hex.value.trim();
        if (!v.startsWith("#")) v = "#" + v;
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v)) {
          apply(v);
        } else {
          new Notice(
            this.plugin.t(
              "notice_invalid_hex_format",
              "Invalid hex color format. Use #RRGGBB or #RGB.",
            ),
          );
        }
      };
      hex.addEventListener("change", hexChange);
      this._eventListeners.push({
        el: hex,
        event: "change",
        handler: hexChange,
      });

      const resetHandler = () => {
        if (type === "text") {
          this.selectedTextColor = null;
          preview.style.color = "";
        } else {
          this.selectedBgColor = null;
          preview.style.backgroundColor = "";
          // Clear all border styles when resetting background color
          preview.style.border = "";
          preview.style.borderTop = "";
          preview.style.borderBottom = "";
          preview.style.borderLeft = "";
          preview.style.borderRight = "";
        }
        hex.value = "";
        colorInput.value = "#000000";
        this._hasUserChanges = true;
      };
      resetBtn.addEventListener("click", resetHandler);
      this._eventListeners.push({
        el: resetBtn,
        event: "click",
        handler: resetHandler,
      });

      swatchItems.forEach((item) => {
        const btn = grid.createEl("button");
        btn.style.backgroundColor = item.color;
        btn.style.width = "100%";
        btn.style.aspectRatio = "1 / 1";
        btn.style.minWidth = "44px";
        btn.style.minHeight = "44px";
        // btn.style.border = '1px solid var(--background-modifier-border)';
        btn.style.setProperty("border", "transparent", "important");
        btn.style.borderRadius = "12px";
        btn.style.cursor = "pointer";
        btn.style.opacity = "1";
        btn.setAttr("title", item.name || item.color);
        const clickHandler = () => {
          apply(item.color);
        };
        btn.addEventListener("click", clickHandler);
        this._eventListeners.push({
          el: btn,
          event: "click",
          handler: clickHandler,
        });
      });

      panelStates[type] = { hex, colorInput };
      return col;
    };

    let lastPanelEl = null;
    if (this.mode === "text") {
      lastPanelEl = buildPanel(
        this.plugin.t("text_color_title", "Text Color"),
        "text",
      );
    } else if (this.mode === "background") {
      lastPanelEl = buildPanel(
        this.plugin.t("highlight_color_title", "Highlight Color"),
        "background",
      );
    } else {
      if (cpm === "text") {
        lastPanelEl = buildPanel(
          this.plugin.t("text_color_title", "Text Color"),
          "text",
        );
      } else if (cpm === "background") {
        lastPanelEl = buildPanel(
          this.plugin.t("highlight_color_title", "Highlight Color"),
          "background",
        );
      } else if (cpm === "both-v-bg-top") {
        buildPanel(
          this.plugin.t("highlight_color_title", "Highlight Color"),
          "background",
        );
        lastPanelEl = buildPanel(
          this.plugin.t("text_color_title", "Text Color"),
          "text",
        );
      } else if (cpm === "both-v-text-top") {
        buildPanel(this.plugin.t("text_color_title", "Text Color"), "text");
        lastPanelEl = buildPanel(
          this.plugin.t("highlight_color_title", "Highlight Color"),
          "background",
        );
      } else if (cpm === "both-bg-left") {
        buildPanel(
          this.plugin.t("highlight_color_title", "Highlight Color"),
          "background",
        );
        lastPanelEl = buildPanel(
          this.plugin.t("text_color_title", "Text Color"),
          "text",
        );
      } else {
        buildPanel(this.plugin.t("text_color_title", "Text Color"), "text");
        lastPanelEl = buildPanel(
          this.plugin.t("highlight_color_title", "Highlight Color"),
          "background",
        );
      }
    }
    // Gap below panels is managed by a smaller margin-top on the action row, not per-panel margins

    const s = this._selectedText || "";
    let initText = null;
    let initBg = null;
    let existingStyle = null;
    let matchedEntry = null;
    let matchedGroupUid = null;
    let matchedMatchType = null;
    const caseSensitive = !!this.plugin.settings.caseSensitive;
    const eq = (a, b) =>
      caseSensitive
        ? String(a) === String(b)
        : String(a).toLowerCase() === String(b).toLowerCase();
    let allEntries = Array.isArray(this.plugin.settings.wordEntries)
      ? this.plugin.settings.wordEntries.map((e) =>
          Object.assign({}, e, { _groupUid: null }),
        )
      : [];
    if (Array.isArray(this.plugin.settings.wordEntryGroups)) {
      this.plugin.settings.wordEntryGroups.forEach((g) => {
        if (g && g.active && Array.isArray(g.entries)) {
          g.entries.forEach((e) => {
            allEntries.push(Object.assign({}, e, { _groupUid: g.uid }));
          });
        }
      });
    }
    for (const e of allEntries) {
      if (!e || e.isRegex) continue;
      const entryMatchType = (e.matchType || "").toLowerCase();
      const a = caseSensitive ? String(s) : String(s).toLowerCase();
      const b = caseSensitive
        ? String(e.pattern || "")
        : String(e.pattern || "").toLowerCase();

      let matches = false;
      // Check if selected text matches based on the entry's matchType
      if (entryMatchType === "exact") {
        matches =
          eq(e.pattern || "", s) ||
          (Array.isArray(e.groupedPatterns) &&
            e.groupedPatterns.some((p) => eq(p, s)));
      } else if (entryMatchType === "startswith") {
        matches = b && a.startsWith(b);
      } else if (entryMatchType === "endswith") {
        matches = b && a.endsWith(b);
      } else if (entryMatchType === "contains") {
        matches = b && a.includes(b);
      } else {
        // Fallback to entry's literal match or use global partialMatch setting
        const literalMatch =
          eq(e.pattern || "", s) ||
          (Array.isArray(e.groupedPatterns) &&
            e.groupedPatterns.some((p) => eq(p, s)));
        if (!literalMatch && this.plugin.settings.partialMatch && !e.isRegex) {
          matches = b && a.includes(b);
        } else if (!literalMatch && !this.plugin.settings.partialMatch) {
          matches = false;
        } else {
          matches = literalMatch;
        }
      }

      if (!matches) continue;

      if (e.backgroundColor) {
        if (
          e.textColor &&
          e.textColor !== "currentColor" &&
          this.plugin.isValidHexColor(e.textColor)
        )
          initText = e.textColor;
        if (this.plugin.isValidHexColor(e.backgroundColor))
          initBg = e.backgroundColor;
        existingStyle =
          e.styleType ||
          (e.textColor && e.textColor !== "currentColor" && e.backgroundColor
            ? "both"
            : e.backgroundColor
              ? "highlight"
              : "text");
        matchedGroupUid = e._groupUid || null;
        matchedMatchType = e.matchType || matchedMatchType;
        matchedEntry = e;
        break;
      } else if (e.color && this.plugin.isValidHexColor(e.color)) {
        initText = e.color;
        existingStyle = existingStyle || "text";
        matchedGroupUid = e._groupUid || null;
        matchedMatchType = e.matchType || matchedMatchType;
        matchedEntry = e;
        break;
      }
    }
    if (!initText && this.plugin.settings.enableRegexSupport) {
      for (const e of allEntries) {
        if (!e || !e.isRegex) continue;
        try {
          const re = new RegExp(e.pattern, e.flags || "");
          if (re.test(s)) {
            if (e.backgroundColor) {
              if (
                e.textColor &&
                e.textColor !== "currentColor" &&
                this.plugin.isValidHexColor(e.textColor)
              )
                initText = e.textColor;
              if (this.plugin.isValidHexColor(e.backgroundColor))
                initBg = e.backgroundColor;
              existingStyle =
                e.styleType ||
                (e.textColor &&
                e.textColor !== "currentColor" &&
                e.backgroundColor
                  ? "both"
                  : e.backgroundColor
                    ? "highlight"
                    : "text");
            } else if (e.color && this.plugin.isValidHexColor(e.color)) {
              initText = e.color;
              existingStyle = existingStyle || "text";
            }
            matchedGroupUid = e._groupUid || null;
            matchedMatchType = e.matchType || matchedMatchType;
            matchedEntry = e;
            break;
          }
        } catch (err) {}
      }
    }
    this._selectedGroupUid = matchedGroupUid || null;
    if (this._groupSelect) {
      this._groupSelect.value = this._selectedGroupUid || "";
    }
    if (this._matchSelect) {
      this._matchType =
        matchedMatchType ||
        (this.plugin.settings.partialMatch ? "contains" : "exact");
      this._matchSelect.value = this._matchType;
    }

    if (editBtn) {
      // Resolve original entry reference from settings arrays (not a clone)
      let originalEntry = null;
      if (!this.isQuickOnce) {
        if (matchedEntry) {
          try {
            const word = this._selectedText || "";
            const caseSensitive2 = !!this.plugin.settings.caseSensitive;
            const eq2 = (a, b) =>
              caseSensitive2
                ? String(a) === String(b)
                : String(a).toLowerCase() === String(b).toLowerCase();
            if (matchedGroupUid) {
              const group = (
                Array.isArray(this.plugin.settings.wordEntryGroups)
                  ? this.plugin.settings.wordEntryGroups
                  : []
              ).find((g) => g && g.uid === matchedGroupUid);
              if (group && Array.isArray(group.entries)) {
                originalEntry =
                  group.entries.find((e) => {
                    if (!e) return false;
                    if (e.isRegex && this.plugin.settings.enableRegexSupport) {
                      try {
                        const re = new RegExp(e.pattern, e.flags || "");
                        return re.test(word);
                      } catch (_) {
                        return false;
                      }
                    }
                    return (
                      eq2(e.pattern || "", word) ||
                      (Array.isArray(e.groupedPatterns) &&
                        e.groupedPatterns.some((p) => eq2(p, word)))
                    );
                  }) || null;
              }
            } else {
              const arr = Array.isArray(this.plugin.settings.wordEntries)
                ? this.plugin.settings.wordEntries
                : [];
              originalEntry =
                arr.find((e) => {
                  if (!e) return false;
                  if (e.isRegex && this.plugin.settings.enableRegexSupport) {
                    try {
                      const re = new RegExp(e.pattern, e.flags || "");
                      return re.test(word);
                    } catch (_) {
                      return false;
                    }
                  }
                  return (
                    eq2(e.pattern || "", word) ||
                    (Array.isArray(e.groupedPatterns) &&
                      e.groupedPatterns.some((p) => eq2(p, word)))
                  );
                }) || null;
            }
          } catch (_) {
            originalEntry = null;
          }
        }
      }
      editBtn.disabled = false;
      const editHandler = () => {
        try {
          if (this.isQuickOnce) {
            const defaultStyleType =
              this.mode === "text"
                ? "text"
                : this.mode === "background"
                  ? "highlight"
                  : "both";
            if (!this._quickOnceEntry) {
              this._quickOnceEntry = {
                uid:
                  "quick-once-" +
                  Date.now().toString(36) +
                  Math.random().toString(36).slice(2),
                _quickOnce: true,
                styleType: defaultStyleType,
                color: "",
                textColor:
                  (this.selectedTextColor &&
                    this.plugin.isValidHexColor(this.selectedTextColor) &&
                    this.selectedTextColor) ||
                  initText ||
                  "",
                backgroundColor:
                  (this.selectedBgColor &&
                    this.plugin.isValidHexColor(this.selectedBgColor) &&
                    this.selectedBgColor) ||
                  initBg ||
                  "",
                backgroundOpacity: this.plugin.settings.backgroundOpacity ?? 25,
                highlightBorderRadius:
                  this.plugin.settings.highlightBorderRadius ?? 8,
                highlightHorizontalPadding:
                  this.plugin.settings.highlightHorizontalPadding ?? 4,
                highlightVerticalPadding:
                  this.plugin.settings.highlightVerticalPadding ?? 0,
                enableBorderThickness:
                  this.plugin.settings.enableBorderThickness ?? false,
                borderStyle: this.plugin.settings.borderStyle ?? "full",
                borderLineStyle:
                  this.plugin.settings.borderLineStyle ?? "solid",
                borderOpacity: this.plugin.settings.borderOpacity ?? 100,
                borderThickness: this.plugin.settings.borderThickness ?? 1,
              };
            }
            const tempEntry = this._quickOnceEntry;
            const modal = new HighlightStylingModal(
              this.app,
              this.plugin,
              tempEntry,
              null,
              this._selectedText ||
                this.plugin.t("selected_text_preview", "Selected Text"),
            );
            modal._fromQuickOnce = true;
            const orig = modal.onClose.bind(modal);
            modal.onClose = () => {
              try {
                orig();
              } catch (_) {}
              this._quickOnceEntry = tempEntry;
              try {
                const params = this.plugin.getHighlightParams(tempEntry);
                if (tempEntry.styleType === "text") {
                  if (
                    tempEntry.textColor &&
                    this.plugin.isValidHexColor(tempEntry.textColor)
                  ) {
                    preview.style.color = tempEntry.textColor;
                    this.selectedTextColor = tempEntry.textColor;
                  }
                } else {
                  if (
                    tempEntry.backgroundColor &&
                    this.plugin.isValidHexColor(tempEntry.backgroundColor)
                  ) {
                    const rgba = this.plugin.hexToRgba(
                      tempEntry.backgroundColor,
                      params.opacity ?? 25,
                    );
                    preview.style.backgroundColor = rgba;
                    preview.style.borderRadius = (params.radius ?? 8) + "px";
                    preview.style.paddingLeft = preview.style.paddingRight =
                      (params.hPad ?? 4) + "px";
                    try {
                      preview.style.setProperty(
                        "padding-top",
                        (params.vPad ?? 0) + "px",
                      );
                      preview.style.setProperty(
                        "padding-bottom",
                        (params.vPad ?? 0) + "px",
                      );
                    } catch (e) {
                      preview.style.paddingTop = (params.vPad ?? 0) + "px";
                      preview.style.paddingBottom = (params.vPad ?? 0) + "px";
                    }
                    this.plugin.applyBorderStyleToElement(
                      preview,
                      tempEntry.textColor || null,
                      tempEntry.backgroundColor || null,
                      tempEntry,
                    );
                    this.selectedBgColor = tempEntry.backgroundColor;
                  }
                  if (
                    tempEntry.textColor &&
                    this.plugin.isValidHexColor(tempEntry.textColor)
                  ) {
                    preview.style.color = tempEntry.textColor;
                    this.selectedTextColor = tempEntry.textColor;
                  }
                }
                this._hasUserChanges = true;
              } catch (_) {}
            };
            modal.open();
            return;
          }
          let entryToEdit = originalEntry;
          if (!entryToEdit) {
            const ts = this.selectedTextColor;
            const bs = this.selectedBgColor;
            const textSelected = ts && this.plugin.isValidHexColor(ts);
            const bgSelected = bs && this.plugin.isValidHexColor(bs);
            const mt =
              this._matchType ||
              (this.plugin.settings.partialMatch ? "contains" : "exact");
            if (textSelected && bgSelected) {
              entryToEdit = {
                pattern: this._selectedText || "",
                color: "",
                textColor: ts,
                backgroundColor: bs,
                isRegex: false,
                flags: "",
                styleType: "both",
                matchType: mt,
                uid:
                  Date.now().toString(36) + Math.random().toString(36).slice(2),
                _isNewFromPickModal: true,
                _preselectedGroupUid: this._selectedGroupUid || null,
                _originalState: {
                  pattern: this._selectedText || "",
                  color: "",
                  textColor: ts,
                  backgroundColor: bs,
                  isRegex: false,
                  flags: "",
                  styleType: "both",
                  matchType: mt,
                },
              };
            } else if (textSelected) {
              entryToEdit = {
                pattern: this._selectedText || "",
                color: ts,
                textColor: null,
                backgroundColor: null,
                isRegex: false,
                flags: "",
                styleType: "text",
                matchType: mt,
                uid:
                  Date.now().toString(36) + Math.random().toString(36).slice(2),
                _isNewFromPickModal: true,
                _preselectedGroupUid: this._selectedGroupUid || null,
                _originalState: {
                  pattern: this._selectedText || "",
                  color: ts,
                  textColor: null,
                  backgroundColor: null,
                  isRegex: false,
                  flags: "",
                  styleType: "text",
                  matchType: mt,
                },
              };
            } else if (bgSelected) {
              entryToEdit = {
                pattern: this._selectedText || "",
                color: "",
                textColor: "currentColor",
                backgroundColor: bs,
                isRegex: false,
                flags: "",
                styleType: "highlight",
                matchType: mt,
                uid:
                  Date.now().toString(36) + Math.random().toString(36).slice(2),
                _isNewFromPickModal: true,
                _preselectedGroupUid: this._selectedGroupUid || null,
                _originalState: {
                  pattern: this._selectedText || "",
                  color: "",
                  textColor: "currentColor",
                  backgroundColor: bs,
                  isRegex: false,
                  flags: "",
                  styleType: "highlight",
                  matchType: mt,
                },
              };
            } else {
              entryToEdit = {
                pattern: this._selectedText || "",
                color: "",
                textColor: null,
                backgroundColor: null,
                isRegex: false,
                flags: "",
                styleType: "text",
                matchType: mt,
                uid:
                  Date.now().toString(36) + Math.random().toString(36).slice(2),
                _isNewFromPickModal: true,
                _preselectedGroupUid: this._selectedGroupUid || null,
                _originalState: {
                  pattern: this._selectedText || "",
                  color: "",
                  textColor: null,
                  backgroundColor: null,
                  isRegex: false,
                  flags: "",
                  styleType: "text",
                  matchType: mt,
                },
              };
            }
          }
          const onSaved = async () => {
            try {
              await this.plugin.saveSettings();
              this.plugin.compileWordEntries();
              this.plugin.reconfigureEditorExtensions();
              this.plugin.forceRefreshAllEditors();
              this.plugin.forceRefreshAllReadingViews();
              this.plugin.triggerActiveDocumentRerender();
            } catch (_) {}
          };
          new EditEntryModal(
            this.app,
            this.plugin,
            entryToEdit,
            onSaved,
            this,
            true,
          ).open();
        } catch (_) {}
      };
      editBtn.addEventListener("click", editHandler);
      this._eventListeners.push({
        el: editBtn,
        event: "click",
        handler: editHandler,
      });
    }

    // Check for prefill values set from context menu handlers
    // Always prioritize prefill values if they exist, as they come from direct user interaction (context menu)
    if (
      this._preFillTextColor &&
      this.plugin.isValidHexColor(this._preFillTextColor)
    ) {
      initText = this._preFillTextColor;
      existingStyle = existingStyle || "text";
    }
    if (
      this._preFillBgColor &&
      this.plugin.isValidHexColor(this._preFillBgColor)
    ) {
      initBg = this._preFillBgColor;
      existingStyle = existingStyle || (initText ? "both" : "highlight");
    }
    const tp = panelStates["text"];
    const bp = panelStates["background"];
    // Initialize modal mode based on existing entry
    if (!existingStyle) {
      existingStyle =
        initText && initBg
          ? "both"
          : initBg
            ? "highlight"
            : initText
              ? "text"
              : this.mode;
    }
    if (!forcedSingle) {
      this.mode =
        existingStyle === "highlight"
          ? "background"
          : existingStyle === "both"
            ? "text-and-background"
            : "text";
    }

    if (initText && tp && this.mode !== "background") {
      preview.style.color = initText;
      tp.hex.value = initText;
      tp.colorInput.value = initText;
      this.selectedTextColor = initText;
      // prefill does not count as a change; do not set selectedTextColor
    }
    // Helper to apply prefilled values and update preview
    const applyPrefill = (val, type) => {
      if (type === "text") {
        if (tp && val) {
          tp.colorInput.value = val;
          tp.hex.value = val;
          this.selectedTextColor = val;
          preview.style.color = val;
          try {
            preview.style.setProperty("--highlight-color", val);
          } catch (e) {}
        }
      } else if (type === "background") {
        if (bp && val) {
          bp.colorInput.value = val;
          bp.hex.value = val;
          this.selectedBgColor = val;
          const op =
            matchedEntry && typeof matchedEntry.backgroundOpacity === "number"
              ? matchedEntry.backgroundOpacity
              : (this.plugin.settings.backgroundOpacity ?? 25);
          const rgba = this.plugin.hexToRgba(val, op);
          preview.style.backgroundColor = rgba;
          const borderSrc =
            this._preFillBorderColor &&
            this.plugin.isValidHexColor(this._preFillBorderColor)
              ? this._preFillBorderColor
              : initText || this.selectedTextColor;
          this.plugin.applyBorderStyleToElement(
            preview,
            borderSrc,
            val,
            matchedEntry,
          );
        }
      }
    };
    if (initBg && bp && this.mode !== "text") {
      applyPrefill(initBg, "background");
      const hPad =
        matchedEntry &&
        typeof matchedEntry.highlightHorizontalPadding === "number"
          ? matchedEntry.highlightHorizontalPadding
          : (this.plugin.settings.highlightHorizontalPadding ?? 4);
      const vPad =
        matchedEntry &&
        typeof matchedEntry.highlightVerticalPadding === "number"
          ? matchedEntry.highlightVerticalPadding
          : (this.plugin.settings.highlightVerticalPadding ?? 0);
      const radius =
        matchedEntry && typeof matchedEntry.highlightBorderRadius === "number"
          ? matchedEntry.highlightBorderRadius
          : (this.plugin.settings.highlightBorderRadius ?? 8);
      preview.style.paddingLeft = preview.style.paddingRight = hPad + "px";
      try {
        preview.style.setProperty("padding-top", vPad + "px");
        preview.style.setProperty("padding-bottom", vPad + "px");
      } catch (e) {
        preview.style.paddingTop = preview.style.paddingBottom = vPad + "px";
      }
      if (hPad > 0 && radius === 0) {
        preview.style.borderRadius = "0px";
      } else {
        preview.style.borderRadius = radius + "px";
      }
      if (this.plugin.settings.enableBoxDecorationBreak ?? true) {
        preview.style.boxDecorationBreak = "clone";
        preview.style.WebkitBoxDecorationBreak = "clone";
      }
      bp.hex.value = initBg;
      bp.colorInput.value = initBg;
      this.selectedBgColor = initBg;
      // prefill does not count as a change; do not set selectedBgColor
      // border style already applied via applyBorderStyleToElement using _preFillBorderColor when available
    }
    // Also update the mode handling to properly detect text-and-background
    const actionRow = contentEl.createDiv();
    actionRow.style.display = "flex";
    actionRow.style.justifyContent = "flex-end";
    actionRow.style.gap = "8px";
    actionRow.style.marginTop = "6px";
    actionRow.style.gridColumn = "1 / -1";

    const submitFn = async () => {
      const textPanel = panelStates["text"];
      const bgPanel = panelStates["background"];
      const textColor =
        this.selectedTextColor ||
        (textPanel && textPanel.hex.value ? textPanel.hex.value : null);
      const bgColor =
        this.selectedBgColor ||
        (bgPanel && bgPanel.hex.value ? bgPanel.hex.value : null);

      const textSelected = !!(
        textColor && this.plugin.isValidHexColor(textColor)
      );
      const bgSelected = !!(bgColor && this.plugin.isValidHexColor(bgColor));
      debugLog("MODAL", "submit", {
        word: this._selectedText,
        textSelected,
        bgSelected,
        textColor,
        bgColor,
      });
      const groupsList = Array.isArray(this.plugin.settings.wordEntryGroups)
        ? this.plugin.settings.wordEntryGroups
        : [];
      const selectedGroup = groupsList.find(
        (g) => g && g.uid === this._selectedGroupUid,
      );
      const targetArr = selectedGroup
        ? Array.isArray(selectedGroup.entries)
          ? selectedGroup.entries
          : (selectedGroup.entries = [])
        : Array.isArray(this.plugin.settings.wordEntries)
          ? this.plugin.settings.wordEntries
          : (this.plugin.settings.wordEntries = []);

      // Replacement behavior for group reassignment:
      // If the matched entry belongs to a different group than the newly selected one,
      // move it (remove from the original container and add to the new container) before updating colors.
      try {
        const fromGroupUid = matchedGroupUid || null;
        const toGroupUid = this._selectedGroupUid || null;
        if (matchedEntry && fromGroupUid !== toGroupUid) {
          const word = this._selectedText || "";
          const caseSensitive = !!this.plugin.settings.caseSensitive;
          const eq = (a, b) =>
            caseSensitive
              ? String(a) === String(b)
              : String(a).toLowerCase() === String(b).toLowerCase();
          let sourceArr = null;
          if (fromGroupUid) {
            const srcGroup = groupsList.find(
              (g) => g && g.uid === fromGroupUid,
            );
            sourceArr =
              srcGroup && Array.isArray(srcGroup.entries)
                ? srcGroup.entries
                : null;
          } else {
            sourceArr = Array.isArray(this.plugin.settings.wordEntries)
              ? this.plugin.settings.wordEntries
              : null;
          }
          if (sourceArr) {
            let srcIdx = -1;
            for (let i = 0; i < sourceArr.length; i++) {
              const e = sourceArr[i];
              if (!e) continue;
              let match = false;
              if (e.isRegex && this.plugin.settings.enableRegexSupport) {
                try {
                  const re = new RegExp(e.pattern, e.flags || "");
                  match = re.test(word);
                } catch (_) {
                  match = false;
                }
              } else {
                match =
                  eq(e.pattern || "", word) ||
                  (Array.isArray(e.groupedPatterns) &&
                    e.groupedPatterns.some((p) => eq(p, word)));
              }
              if (match) {
                srcIdx = i;
                break;
              }
            }
            if (srcIdx !== -1) {
              const moved = sourceArr.splice(srcIdx, 1)[0];
              // Push the moved entry into targetArr if not already present there
              const existsInTarget = targetArr.some((e) => {
                if (!e) return false;
                if (e.isRegex && this.plugin.settings.enableRegexSupport) {
                  try {
                    const re = new RegExp(e.pattern, e.flags || "");
                    return re.test(word);
                  } catch (_) {
                    return false;
                  }
                }
                return (
                  eq(e.pattern || "", word) ||
                  (Array.isArray(e.groupedPatterns) &&
                    e.groupedPatterns.some((p) => eq(p, word)))
                );
              });
              if (!existsInTarget) {
                targetArr.push(moved);
              }
              matchedGroupUid = toGroupUid;
            }
          }
        }
      } catch (_) {}

      // If both colors are empty/reset, remove the entry
      if (!textSelected && !bgSelected) {
        const word = this._selectedText || "";
        const caseSensitive = !!this.plugin.settings.caseSensitive;
        const eq = (a, b) =>
          caseSensitive
            ? String(a) === String(b)
            : String(a).toLowerCase() === String(b).toLowerCase();
        for (let i = targetArr.length - 1; i >= 0; i--) {
          const e = targetArr[i];
          if (!e) continue;
          let match = false;
          if (e.isRegex && this.plugin.settings.enableRegexSupport) {
            try {
              const re = new RegExp(e.pattern, e.flags || "");
              match = re.test(word);
            } catch (err) {
              match = false;
            }
          } else {
            match =
              eq(e.pattern || "", word) ||
              (Array.isArray(e.groupedPatterns) &&
                e.groupedPatterns.some((p) => eq(p, word)));
          }
          if (match) {
            targetArr.splice(i, 1);
            await this.plugin.saveSettings();
            if (selectedGroup) {
              this.plugin.compileWordEntries();
            }
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            break;
          }
        }
        return;
      }

      const word = this._selectedText || "";
      try {
        if (typeof this.callback === "function") {
          try {
            const qo =
              this.isQuickOnce && this._quickOnceEntry
                ? {
                    styleType: this._quickOnceEntry.styleType || null,
                    backgroundOpacity:
                      this._quickOnceEntry.backgroundOpacity ?? null,
                    highlightBorderRadius:
                      this._quickOnceEntry.highlightBorderRadius ?? null,
                    highlightHorizontalPadding:
                      this._quickOnceEntry.highlightHorizontalPadding ?? null,
                    highlightVerticalPadding:
                      this._quickOnceEntry.highlightVerticalPadding ?? null,
                    enableBorderThickness:
                      typeof this._quickOnceEntry.enableBorderThickness !==
                      "undefined"
                        ? !!this._quickOnceEntry.enableBorderThickness
                        : null,
                    borderStyle: this._quickOnceEntry.borderStyle || null,
                    borderLineStyle:
                      this._quickOnceEntry.borderLineStyle || null,
                    borderOpacity: this._quickOnceEntry.borderOpacity ?? null,
                    borderThickness:
                      this._quickOnceEntry.borderThickness ?? null,
                  }
                : null;
            this.callback(
              textSelected ? textColor : bgSelected ? bgColor : null,
              {
                textColor: textSelected ? textColor : null,
                backgroundColor: bgSelected ? bgColor : null,
                word,
                selectedGroupUid: this._selectedGroupUid || null,
                matchType:
                  this._matchType ||
                  (this.plugin.settings.partialMatch ? "contains" : "exact"),
                quickOnceStyle: qo || undefined,
              },
            );
          } catch (e) {}
          return;
        }
        const caseSensitive = !!this.plugin.settings.caseSensitive;
        const eq = (a, b) =>
          caseSensitive
            ? String(a) === String(b)
            : String(a).toLowerCase() === String(b).toLowerCase();
        let updated = false;

        // FIXED LOGIC: Clear logic for each case
        if (textSelected && bgSelected) {
          // BOTH: text color + background color
          for (let i = 0; i < targetArr.length; i++) {
            const e = targetArr[i];
            if (!e) continue;
            let match = false;
            if (e.isRegex && this.plugin.settings.enableRegexSupport) {
              try {
                const re = new RegExp(e.pattern, e.flags || "");
                match = re.test(word);
              } catch (err) {
                match = false;
              }
            } else {
              match =
                eq(e.pattern || "", word) ||
                (Array.isArray(e.groupedPatterns) &&
                  e.groupedPatterns.some((p) => eq(p, word)));
            }
            if (match) {
              e.textColor = textColor;
              e.backgroundColor = bgColor;
              e.color = ""; // Clear plain color field
              e.styleType = "both"; // EXPLICITLY SET TO BOTH
              debugLog("MODAL", "update both", e);
              updated = true;
              break;
            }
          }
          if (!updated) {
            const newEntry = {
              pattern: word,
              color: "",
              textColor: textColor,
              backgroundColor: bgColor,
              isRegex: false,
              flags: "",
              styleType: "both",
              matchType:
                this._matchType ||
                (this.plugin.settings.partialMatch ? "contains" : "exact"),
            };

            // Add targetElement for formatting patterns
            if (newEntry.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1")
              newEntry.targetElement = "strong";
            else if (newEntry.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1")
              newEntry.targetElement = "em";
            else if (
              newEntry.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1"
            )
              newEntry.targetElement = "strong-em";

            targetArr.push(newEntry);
            debugLog("MODAL", "create both", newEntry);
          }
          await this.plugin.saveSettings();
          if (selectedGroup) {
            this.plugin.compileWordEntries();
          } else {
            this.plugin.compileTextBgColoringEntries();
          }
        } else if (textSelected) {
          // TEXT ONLY: text color only
          for (let i = 0; i < targetArr.length; i++) {
            const e = targetArr[i];
            if (!e) continue;
            if (e.isRegex && this.plugin.settings.enableRegexSupport) {
              try {
                const re = new RegExp(e.pattern, e.flags || "");
                if (re.test(word)) {
                  e.color = textColor;
                  e.textColor = null; // Clear textColor field
                  e.backgroundColor = null; // Clear background field
                  e.styleType = "text"; // EXPLICITLY SET TO TEXT
                  updated = true;
                  if (!e.isRegex)
                    e.matchType =
                      this._matchType ||
                      e.matchType ||
                      (this.plugin.settings.partialMatch
                        ? "contains"
                        : "exact");
                  break;
                }
              } catch (err) {}
            } else {
              if (eq(e.pattern || "", word)) {
                e.color = textColor;
                e.textColor = null; // Clear textColor field
                e.backgroundColor = null; // Clear background field
                e.styleType = "text"; // EXPLICITLY SET TO TEXT
                updated = true;
                if (!e.isRegex)
                  e.matchType =
                    this._matchType ||
                    e.matchType ||
                    (this.plugin.settings.partialMatch ? "contains" : "exact");
                break;
              }
              if (
                Array.isArray(e.groupedPatterns) &&
                e.groupedPatterns.some((p) => eq(p, word))
              ) {
                e.color = textColor;
                e.textColor = null; // Clear textColor field
                e.backgroundColor = null; // Clear background field
                e.styleType = "text"; // EXPLICITLY SET TO TEXT
                updated = true;
                if (!e.isRegex)
                  e.matchType =
                    this._matchType ||
                    e.matchType ||
                    (this.plugin.settings.partialMatch ? "contains" : "exact");
                break;
              }
            }
          }
          if (!updated) {
            if (selectedGroup) {
              const newEntry = {
                pattern: word,
                color: textColor,
                isRegex: false,
                flags: "",
                styleType: "text",
                matchType:
                  this._matchType ||
                  (this.plugin.settings.partialMatch ? "contains" : "exact"),
              };

              // Add targetElement for formatting patterns
              if (newEntry.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1")
                newEntry.targetElement = "strong";
              else if (newEntry.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1")
                newEntry.targetElement = "em";
              else if (
                newEntry.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1"
              )
                newEntry.targetElement = "strong-em";

              targetArr.push(newEntry);
              await this.plugin.saveSettings();
              this.plugin.compileWordEntries();
            } else {
              await this.plugin.saveEntry(word, textColor);
              const ne = this.plugin.settings.wordEntries.find(
                (e) => e && e.pattern === word && !e.isRegex,
              );
              if (ne) {
                ne.styleType = "text";
              }
            }
          } else {
            await this.plugin.saveSettings();
            if (selectedGroup) {
              this.plugin.compileWordEntries();
            }
          }
          debugLog("MODAL", "text-only", { word, textColor });
        } else if (bgSelected) {
          // BACKGROUND ONLY: highlight only
          const arr = Array.isArray(this.plugin.settings.wordEntries)
            ? this.plugin.settings.wordEntries
            : [];
          for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (!e) continue;
            let match = false;
            if (e.isRegex && this.plugin.settings.enableRegexSupport) {
              try {
                const re = new RegExp(e.pattern, e.flags || "");
                match = re.test(word);
              } catch (err) {
                match = false;
              }
            } else {
              match =
                eq(e.pattern || "", word) ||
                (Array.isArray(e.groupedPatterns) &&
                  e.groupedPatterns.some((p) => eq(p, word)));
            }
            if (match) {
              e.backgroundColor = bgColor;
              // HIGHLIGHT ONLY: set textColor to currentColor and clear plain color
              e.textColor = "currentColor";
              e.color = ""; // Clear plain color field
              e.styleType = "highlight"; // EXPLICITLY SET TO HIGHLIGHT
              debugLog("MODAL", "update highlight", e);
              updated = true;
              break;
            }
          }
          if (!updated) {
            const newEntry = {
              pattern: word,
              color: "",
              textColor: "currentColor",
              backgroundColor: bgColor,
              isRegex: false,
              flags: "",
              styleType: "highlight",
              matchType:
                this._matchType ||
                (this.plugin.settings.partialMatch ? "contains" : "exact"),
            };

            // Add targetElement for formatting patterns
            if (newEntry.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1")
              newEntry.targetElement = "strong";
            else if (newEntry.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1")
              newEntry.targetElement = "em";
            else if (
              newEntry.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1"
            )
              newEntry.targetElement = "strong-em";

            targetArr.push(newEntry);
            debugLog("MODAL", "create highlight", newEntry);
          }
          await this.plugin.saveSettings();
          if (selectedGroup) {
            this.plugin.compileWordEntries();
          } else {
            this.plugin.compileTextBgColoringEntries();
          }
        }
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.forceRefreshAllReadingViews();
      } catch (e) {}
    };

    this._submitFn = submitFn;
    // If settings tab is open, ensure it refreshes after modal actions
    try {
      const originalSubmit = this._submitFn;
      this._submitFn = async () => {
        await originalSubmit();
        if (this.plugin.settingTab) {
          try {
            this.plugin.settingTab._suspendSorting = true;
          } catch (e) {}
          try {
            this.plugin.settingTab._refreshEntries();
          } catch (e) {}
        }
      };
    } catch (e) {}
  }

  onClose() {
    // Properly clean up all event listeners before emptying
    try {
      if (this._hasUserChanges && typeof this._submitFn === "function")
        this._submitFn();
    } catch (e) {}
    this._eventListeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    this._eventListeners = [];

    // Now empty the content
    this.contentEl.empty();
  }
}
