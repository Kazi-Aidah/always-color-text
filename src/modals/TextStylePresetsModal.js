import { Modal, setIcon, Menu } from 'obsidian';
import { HighlightStylingModal } from './HighlightStylingModal.js';
import { CustomCssModal } from './CustomCssModal.js';
import { ConfirmationModal } from './ConfirmationModal.js';
import { defaultSettings } from '../settings/defaultSettings.js';

export class TextStylePresetsModal extends Modal {
  constructor(app, plugin, onPick = null) {
    super(app);
    this.plugin = plugin;
    this.onPick = onPick;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass("act-text-style-presets-modal");
    } catch (e) {}

    this._buildContent();
  }

  _buildContent() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl("h2", {
      text: this.plugin.t("text_style_presets_header", "Text Style Presets"),
    });

    const presets = Array.isArray(this.plugin.settings.textStylePresets)
      ? this.plugin.settings.textStylePresets
      : [];

    const defaultPreset =
      presets.find((p) => p && p.isDefault) || presets[0] || null;

    // Full-width default box mirrors the Global Highlight Appearance settings
    if (defaultPreset) {
      const topBox = contentEl.createDiv({ cls: "act-tsp-top-box" });
      const topPreview = topBox.createDiv({ cls: "act-tsp-preview" });
      this._applyStyle(topPreview, this._globalStyleObj(), "Default Style");
      if (typeof this.onPick === "function") {
        topBox.style.cursor = "pointer";
        topBox.addEventListener("click", () => this._pickPreset(defaultPreset));
      }
      const menuBtn = topBox.createEl("div", {
        cls: "clickable-icon act-tsp-edit-btn",
      });
      setIcon(menuBtn, "more-vertical");
      menuBtn.setAttribute(
        "aria-label",
        this.plugin.t("preset_options_label", "Preset options"),
      );
      menuBtn.addEventListener("click", (evt) => {
        evt.stopPropagation();
        this._openDefaultMenu(defaultPreset, evt);
      });
    }

    // Grid of the remaining presets + user-defined Quick Styles
    const grid = contentEl.createDiv({ cls: "act-tsp-grid" });
    const quickStyles = Array.isArray(this.plugin.settings.quickStyles)
      ? this.plugin.settings.quickStyles
      : [];
    const seedUids = new Set(
      (defaultSettings.textStylePresets || []).map((s) => s.uid),
    );
    const builtInPresets = presets.filter(
      (p) => p && seedUids.has(p.uid),
    );
    const customPresets = presets.filter(
      (p) => p && !seedUids.has(p.uid),
    );
    const allItems = builtInPresets.concat(quickStyles).concat(customPresets);
    allItems.forEach((preset) => {
      if (!preset) return;
      if (defaultPreset && preset.uid === defaultPreset.uid) return;
      if (!preset.uid)
        preset.uid =
          "qs-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
      const box = grid.createDiv({ cls: "act-tsp-box" });
      const preview = box.createDiv({ cls: "act-tsp-preview" });
      this._applyStyle(preview, preset, preset.name || "Style");
      if (typeof this.onPick === "function") {
        box.style.cursor = "pointer";
        box.addEventListener("click", () => this._pickPreset(preset));
      }
      const menuBtn = box.createEl("div", {
        cls: "clickable-icon act-tsp-edit-btn",
      });
      setIcon(menuBtn, "more-vertical");
      menuBtn.setAttribute(
        "aria-label",
        this.plugin.t("preset_options_label", "Preset options"),
      );
      menuBtn.addEventListener("click", (evt) => {
        evt.stopPropagation();
        if (this._isQuickStyle(preset)) {
          this._openQuickStyleMenu(preset, evt);
        } else {
          this._openPresetMenu(preset, evt);
        }
      });
    });

    // Reset (left) + Add Style (right)
    const addRow = contentEl.createDiv({ cls: "act-tsp-add-row" });
    const resetBtn = addRow.createEl("button", {
      text: this.plugin.t("btn_reset_presets", "Reset"),
    });
    resetBtn.addEventListener("click", () => this._resetBuiltInPresets());
    const addBtn = addRow.createEl("button", {
      text: this.plugin.t("btn_add_preset", "+ Add Style"),
      cls: "mod-cta",
    });
    addBtn.addEventListener("click", () => this._addPreset());
  }

  // Render a preview span. Uses the preset's own colors when set, otherwise
  // falls back to the theme accent (var(--color-accent)) for a consistent look.
  _applyStyle(container, styleObj, text) {
    container.empty();
    const span = container.createSpan({ cls: "act-tsp-span" });
    span.textContent = text;

    const style = styleObj.styleType || "highlight";
    const p = this.plugin.getHighlightParams(styleObj);
    const opacity = p.opacity ?? 25;
    const radius = p.radius ?? 8;
    const hpad = p.hPad ?? 4;
    const vpad = p.vPad ?? 0;
    const accent = "var(--color-accent)";

    const bgHex =
      styleObj.backgroundColor && this.plugin.isValidHexColor(styleObj.backgroundColor)
        ? styleObj.backgroundColor
        : null;
    const textHex =
      styleObj.textColor &&
      styleObj.textColor !== "currentColor" &&
      this.plugin.isValidHexColor(styleObj.textColor)
        ? styleObj.textColor
        : null;

    let bg = "";
    if (style !== "text") {
      if (bgHex) {
        bg = `background: ${this.plugin.hexToRgba(bgHex, opacity)};`;
      } else {
        bg = `background: color-mix(in srgb, ${accent} ${opacity}%, transparent);`;
      }
    }

    let border = "";
    if (style !== "text" && p.enableBorder) {
      const thickness = p.borderThickness ?? 1;
      const line = p.borderLineStyle || "solid";
      const color = bgHex || accent;
      const css = `${thickness}px ${line} ${color} !important;`;
      switch (p.borderStyle || "full") {
        case "bottom":
          border = ` border-bottom: ${css}`;
          break;
        case "top":
          border = ` border-top: ${css}`;
          break;
        case "left":
          border = ` border-left: ${css}`;
          break;
        case "right":
          border = ` border-right: ${css}`;
          break;
        case "top-bottom":
          border = ` border-top: ${css} border-bottom: ${css}`;
          break;
        case "left-right":
          border = ` border-left: ${css} border-right: ${css}`;
          break;
        case "top-left-right":
          border = ` border-top: ${css} border-left: ${css} border-right: ${css}`;
          break;
        case "bottom-left-right":
          border = ` border-bottom: ${css} border-left: ${css} border-right: ${css}`;
          break;
        case "top-right":
          border = ` border-top: ${css} border-right: ${css}`;
          break;
        case "top-left":
          border = ` border-top: ${css} border-left: ${css}`;
          break;
        case "bottom-right":
          border = ` border-bottom: ${css} border-right: ${css}`;
          break;
        case "full":
        default:
          border = ` border: ${css}`;
      }
    }

    const textColorVal = textHex || accent;
    const base =
      style === "text"
        ? `color:${textColorVal};background:transparent;`
        : style === "highlight"
          ? `${bg}border-radius:${radius}px;padding:${vpad}px ${hpad}px;color:var(--text-normal);${border}`
          : `color:${textColorVal};${bg}border-radius:${radius}px;padding:${vpad}px ${hpad}px;${border}`;

    span.setAttribute(
      "style",
      base + "box-decoration-break:clone;-webkit-box-decoration-break:clone;",
    );
  }

  // Build a style object that reflects the current Global Highlight Appearance
  _globalStyleObj() {
    const s = this.plugin.settings;
    return {
      styleType: "highlight",
      textColor: "currentColor",
      backgroundColor: "",
      backgroundOpacity: s.backgroundOpacity ?? 35,
      highlightBorderRadius: s.highlightBorderRadius ?? 4,
      highlightHorizontalPadding: s.highlightHorizontalPadding ?? 4,
      highlightVerticalPadding: s.highlightVerticalPadding ?? 0,
      enableBorderThickness: s.enableBorderThickness ?? false,
      borderStyle: s.borderStyle ?? "full",
      borderLineStyle: s.borderLineStyle ?? "solid",
      borderOpacity: s.borderOpacity ?? 100,
      borderThickness: s.borderThickness ?? 2,
    };
  }

  // Resolve the theme accent to a concrete hex so it can be used in native
  // <input type="color"> pickers and stored on the entry.
  _resolveAccentHex() {
    try {
      const tmp = document.createElement("span");
      tmp.style.color = "var(--color-accent)";
      tmp.style.display = "none";
      document.body.appendChild(tmp);
      const computed = getComputedStyle(tmp).color;
      document.body.removeChild(tmp);
      const m = computed.match(/\d+/g);
      if (m && m.length >= 3) {
        return (
          "#" +
          [m[0], m[1], m[2]]
            .map((x) => parseInt(x, 10).toString(16).padStart(2, "0"))
            .join("")
        );
      }
    } catch (_) {}
    return "#7c3aed";
  }

  // Ensure the entry has concrete colors set; default unset colors to the accent.
  _ensureAccentColors(entry) {
    const accent = this._resolveAccentHex();
    if (!entry.backgroundColor || !this.plugin.isValidHexColor(entry.backgroundColor)) {
      entry.backgroundColor = accent;
    }
    if (entry.styleType === "both" || entry.styleType === "text") {
      if (
        !entry.textColor ||
        entry.textColor === "currentColor" ||
        !this.plugin.isValidHexColor(entry.textColor)
      ) {
        entry.textColor = accent;
      }
    }
  }

  _editGlobalStyle() {
    const s = this.plugin.settings;
    const entry = this._globalStyleObj();
    this._ensureAccentColors(entry);
    try {
      const modal = new HighlightStylingModal(
        this.app,
        this.plugin,
        entry,
        null,
        "Default Style",
      );
      const orig = modal.onClose.bind(modal);
      modal.onClose = () => {
        try {
          orig();
        } catch (_) {}
        s.backgroundOpacity = entry.backgroundOpacity;
        s.highlightBorderRadius = entry.highlightBorderRadius;
        s.highlightHorizontalPadding = entry.highlightHorizontalPadding;
        s.highlightVerticalPadding = entry.highlightVerticalPadding;
        s.enableBorderThickness = entry.enableBorderThickness;
        s.borderStyle = entry.borderStyle;
        s.borderLineStyle = entry.borderLineStyle;
        s.borderOpacity = entry.borderOpacity;
        s.borderThickness = entry.borderThickness;
        this.plugin.saveSettings();
        this._render();
      };
      modal.open();
    } catch (e) {}
  }

  _editPreset(preset) {
    try {
      const accent = this._resolveAccentHex();
      // Edit a clone so the original stays "unset" (accent) unless the user
      // actually picks a different color.
      const temp = JSON.parse(JSON.stringify(preset));
      if (!temp.backgroundColor || !this.plugin.isValidHexColor(temp.backgroundColor)) {
        temp.backgroundColor = accent;
      }
      if (temp.styleType === "both" || temp.styleType === "text") {
        if (
          !temp.textColor ||
          temp.textColor === "currentColor" ||
          !this.plugin.isValidHexColor(temp.textColor)
        ) {
          temp.textColor = accent;
        }
      }
      const modal = new HighlightStylingModal(
        this.app,
        this.plugin,
        temp,
        null,
        preset.name || "Style",
      );
      const orig = modal.onClose.bind(modal);
      modal.onClose = () => {
        try {
          orig();
        } catch (_) {}
        // Shape fields always persist
        preset.styleType = temp.styleType;
        preset.backgroundOpacity = temp.backgroundOpacity;
        preset.highlightBorderRadius = temp.highlightBorderRadius;
        preset.highlightHorizontalPadding = temp.highlightHorizontalPadding;
        preset.highlightVerticalPadding = temp.highlightVerticalPadding;
        preset.enableBorderThickness = temp.enableBorderThickness;
        preset.borderStyle = temp.borderStyle;
        preset.borderLineStyle = temp.borderLineStyle;
        preset.borderOpacity = temp.borderOpacity;
        preset.borderThickness = temp.borderThickness;
        // Colors persist only if the preset already had a real color, or the
        // user picked a color different from the accent default.
        if (
          preset.backgroundColor &&
          this.plugin.isValidHexColor(preset.backgroundColor)
        ) {
          preset.backgroundColor = temp.backgroundColor;
          preset.textColor = temp.textColor;
        } else {
          if (
            temp.backgroundColor &&
            temp.backgroundColor.toLowerCase() !== accent.toLowerCase()
          ) {
            preset.backgroundColor = temp.backgroundColor;
          }
          if (
            temp.textColor &&
            temp.textColor.toLowerCase() !== accent.toLowerCase()
          ) {
            preset.textColor = temp.textColor;
          }
        }
        this.plugin.saveSettings();
        this._render();
      };
      modal.open();
    } catch (e) {}
  }

  _editCustomCss(preset) {
    try {
      const modal = new CustomCssModal(this.app, this.plugin, preset);
      const orig = modal.onClose.bind(modal);
      modal.onClose = () => {
        try {
          orig();
        } catch (_) {}
        this.plugin.saveSettings();
        this._render();
      };
      modal.open();
    } catch (e) {}
  }

  _renamePreset(preset) {
    try {
      const modal = new Modal(this.app);
      modal.titleEl.setText(this.plugin.t("rename_preset", "Rename Preset"));
      const input = modal.contentEl.createEl("input", { type: "text" });
      input.value = preset.name || "";
      input.style.margin = "10px 0";
      input.style.width = "100%";
      input.style.display = "block";
      const save = modal.contentEl.createEl("button", {
        text: this.plugin.t("save", "Save"),
        cls: "mod-cta",
      });
      save.style.marginTop = "8px";
      save.addEventListener("click", () => {
        const v = input.value.trim();
        if (v) preset.name = v;
        this.plugin.saveSettings();
        modal.close();
        this._render();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save.click();
      });
      modal.onOpen = () => {
        input.focus();
        input.select();
      };
      modal.open();
    } catch (e) {}
  }

  _openDefaultMenu(preset, evt) {
    const menu = new Menu();
    // Style group
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("edit_highlight_styling", "Edit Highlight Styling"))
        .setIcon("pencil")
        .onClick(() => this._editGlobalStyle()),
    );
    if (this.plugin.settings.enableCustomCss) {
      menu.addItem((item) =>
        item
          .setTitle(this.plugin.t("edit_custom_css", "Edit Custom CSS"))
          .setIcon("code")
          .onClick(() => this._editCustomCss(preset)),
      );
    }
    // Manage group
    menu.addSeparator();
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("rename", "Rename"))
        .setIcon("pencil")
        .onClick(() => this._renamePreset(preset)),
    );
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("duplicate", "Duplicate"))
        .setIcon("copy")
        .onClick(() => this._duplicatePreset(preset)),
    );
    menu.showAtMouseEvent(evt);
  }

  _openPresetMenu(preset, evt) {
    const menu = new Menu();
    // Style group
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("edit_highlight_styling", "Edit Highlight Styling"))
        .setIcon("pencil")
        .onClick(() => this._editPreset(preset)),
    );
    if (this.plugin.settings.enableCustomCss) {
      menu.addItem((item) =>
        item
          .setTitle(this.plugin.t("edit_custom_css", "Edit Custom CSS"))
          .setIcon("code")
          .onClick(() => this._editCustomCss(preset)),
      );
    }
    // Manage group
    menu.addSeparator();
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("rename", "Rename"))
        .setIcon("pencil")
        .onClick(() => this._renamePreset(preset)),
    );
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("duplicate", "Duplicate"))
        .setIcon("copy")
        .onClick(() => this._duplicatePreset(preset)),
    );
    menu.addItem((item) => {
      const shown = this._quickMenuShown(preset);
      return item
        .setTitle(
          shown
            ? this.plugin.t("hide_from_quick_menu", "Hide from Quick Menu")
            : this.plugin.t("show_in_quick_menu", "Show in Quick Menu"),
        )
        .setIcon("menu")
        .setChecked(shown)
        .onClick(() => this._toggleQuickMenu(preset));
    });
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("make_default", "Make Default"))
        .setIcon("star")
        .onClick(() => this._makeDefault(preset)),
    );
    // Danger group
    menu.addSeparator();
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("delete", "Delete"))
        .setIcon("trash")
        .onClick(() => this._deletePreset(preset)),
    );
    menu.showAtMouseEvent(evt);
  }

  _isQuickStyle(preset) {
    const list = this.plugin.settings.quickStyles;
    return Array.isArray(list) && list.includes(preset);
  }

  _quickMenuShown(style) {
    if (this._isQuickStyle(style)) return style.showInQuickMenu !== false;
    return style.showInQuickMenu === true;
  }

  _toggleQuickMenu(style) {
    style.showInQuickMenu = !this._quickMenuShown(style);
    this.plugin.saveSettings();
    this._render();
  }

  _openQuickStyleMenu(preset, evt) {
    const menu = new Menu();
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("edit_highlight_styling", "Edit Highlight Styling"))
        .setIcon("pencil")
        .onClick(() => this._editQuickStyle(preset)),
    );
    if (this.plugin.settings.enableCustomCss) {
      menu.addItem((item) =>
        item
          .setTitle(this.plugin.t("edit_custom_css", "Edit Custom CSS"))
          .setIcon("code")
          .onClick(() => this._editCustomCss(preset)),
      );
    }
    menu.addSeparator();
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("rename", "Rename"))
        .setIcon("pencil")
        .onClick(() => this._renamePreset(preset)),
    );
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("duplicate", "Duplicate"))
        .setIcon("copy")
        .onClick(() => this._duplicateQuickStyle(preset)),
    );
    menu.addItem((item) => {
      const shown = this._quickMenuShown(preset);
      return item
        .setTitle(
          shown
            ? this.plugin.t("hide_from_quick_menu", "Hide from Quick Menu")
            : this.plugin.t("show_in_quick_menu", "Show in Quick Menu"),
        )
        .setIcon("menu")
        .setChecked(shown)
        .onClick(() => this._toggleQuickMenu(preset));
    });
    menu.addSeparator();
    menu.addItem((item) =>
      item
        .setTitle(this.plugin.t("delete", "Delete"))
        .setIcon("trash")
        .onClick(() => this._deleteQuickStyle(preset)),
    );
    menu.showAtMouseEvent(evt);
  }

  _editQuickStyle(preset) {
    try {
      const modal = new HighlightStylingModal(
        this.app,
        this.plugin,
        preset,
        null,
        preset.name || "Style",
      );
      const orig = modal.onClose.bind(modal);
      modal.onClose = () => {
        try {
          orig();
        } catch (_) {}
        this.plugin.saveSettings();
        this._render();
      };
      modal.open();
    } catch (e) {}
  }

  _duplicateQuickStyle(preset) {
    const list = this.plugin.settings.quickStyles;
    if (!Array.isArray(list)) return;
    const copy = JSON.parse(JSON.stringify(preset));
    copy.uid =
      "qs-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
    copy.name = (preset.name || "Style") + " copy";
    list.push(copy);
    this.plugin.saveSettings();
    this._render();
  }

  _deleteQuickStyle(preset) {
    const list = this.plugin.settings.quickStyles;
    if (!Array.isArray(list)) return;
    const idx = list.indexOf(preset);
    if (idx === -1) return;
    list.splice(idx, 1);
    this.plugin.saveSettings();
    this._render();
  }

  _duplicatePreset(preset) {
    const list = this.plugin.settings.textStylePresets;
    const copy = JSON.parse(JSON.stringify(preset));
    copy.uid =
      "tsp-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
    copy.name = (preset.name || "Style") + " copy";
    copy.isDefault = false;
    list.push(copy);
    this.plugin.saveSettings();
    this._render();
  }

  _deletePreset(preset) {
    const list = this.plugin.settings.textStylePresets;
    const idx = list.indexOf(preset);
    if (idx === -1) return;
    const wasDefault = !!preset.isDefault;
    list.splice(idx, 1);
    if (wasDefault && list.length > 0) list[0].isDefault = true;
    this.plugin.saveSettings();
    this._render();
  }

  _makeDefault(preset) {
    const list = this.plugin.settings.textStylePresets;
    list.forEach((p) => (p.isDefault = false));
    preset.isDefault = true;
    this.plugin.saveSettings();
    this._render();
  }

  _pickPreset(preset) {
    try {
      if (typeof this.onPick === "function") this.onPick(preset);
    } catch (e) {}
    this.close();
  }

  _addPreset() {
    const list = Array.isArray(this.plugin.settings.textStylePresets)
      ? this.plugin.settings.textStylePresets
      : (this.plugin.settings.textStylePresets = []);
    const base = list.find((p) => p && p.isDefault) || {};
    const preset = Object.assign({}, base, {
      uid:
        "tsp-" + Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: this.plugin.t("new_preset_name", "New Preset"),
      isDefault: false,
    });
    list.push(preset);
    this.plugin.saveSettings();
    this._editPreset(preset);
  }

  // Restore built-in presets to their original styles, keeping any
  // user-added presets (even those with tsp- uids) untouched.
  _resetBuiltInPresets() {
    try {
      const seedUids = new Set(
        (defaultSettings.textStylePresets || []).map((s) => s.uid),
      );
      const doReset = () => {
        const userPresets = (this.plugin.settings.textStylePresets || []).filter(
          (p) => p && !seedUids.has(p.uid),
        );
        const restored = (defaultSettings.textStylePresets || []).map((s) =>
          JSON.parse(JSON.stringify(s)),
        );
        this.plugin.settings.textStylePresets = restored.concat(userPresets);
        this.plugin.saveSettings();
        this._render();
      };
      new ConfirmationModal(
        this.app,
        this.plugin,
        this.plugin.t("confirm_reset_presets_title", "Reset built-in presets?"),
        this.plugin.t(
          "confirm_reset_presets",
          "Reset built-in presets to their original styles? Your added styles will not be deleted.",
        ),
        doReset,
      ).open();
    } catch (e) {}
  }

  _render() {
    this._buildContent();
  }

  onClose() {
    this.contentEl.empty();
  }
}
