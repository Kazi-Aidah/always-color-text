import { Modal, Menu, setIcon } from 'obsidian';
import { defaultSettings } from '../settings/defaultSettings.js';
import {
  reconcilePresetOrder,
  deriveQuickMenuOrder,
  orderQuickMenuByOrder,
  reconcileQuickMenuOrder,
} from '../utils/presetOrdering.js';

export class ReorderPresetsModal extends Modal {
  constructor(app, plugin, onComplete = null) {
    super(app);
    this.plugin = plugin;
    this.onComplete = onComplete;
    this._quickMenuOnly = false;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass("act-reorder-presets-modal");
    } catch (e) {}
    this._buildContent();
  }

  _buildContent() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl("h2", {
      text: this.plugin.t("reorder_presets_header", "Reorder Presets"),
    });

    const toggleRow = contentEl.createDiv({ cls: "act-reorder-toggle-row" });
    const toggleLabel = toggleRow.createEl("label", { cls: "act-reorder-toggle-label" });
    const toggle = toggleLabel.createEl("input", { type: "checkbox" });
    toggle.checked = this._quickMenuOnly;
    toggle.addEventListener("change", () => {
      this._quickMenuOnly = toggle.checked;
      this._renderList();
    });
    toggleLabel.createSpan({ text: this.plugin.t("reorder_quick_menu_only", "Show Quick Menu items only") });

    this._listContainer = contentEl.createDiv({ cls: "act-reorder-list" });
    this._renderList();
  }

  _renderList() {
    const container = this._listContainer;
    if (!container) return;
    container.empty();

    const presets = Array.isArray(this.plugin.settings.textStylePresets)
      ? this.plugin.settings.textStylePresets : [];
    const quickStyles = Array.isArray(this.plugin.settings.quickStyles)
      ? this.plugin.settings.quickStyles : [];

    const seedUids = new Set(
      (defaultSettings.textStylePresets || []).map((s) => s.uid),
    );

    const defaultPreset = presets.find((p) => p && p.isDefault) || presets[0] || null;

    const builtInPresets = presets.filter((p) => p && seedUids.has(p.uid));
    const customPresets = presets.filter((p) => p && !seedUids.has(p.uid));
    const allItems = builtInPresets.concat(quickStyles).concat(customPresets);

    const quickMenuShown = (style) => {
      const isQs = Array.isArray(quickStyles) && quickStyles.includes(style);
      if (isQs) return style.showInQuickMenu !== false;
      return style.showInQuickMenu === true;
    };

    // One row per uid: a quick style kept in both settings lists would show
    // up twice here, and saving that duplicated order amplified the damage.
    const renderedUids = new Set();

    // In "Quick Menu items only" mode the rows follow the Quick Menu's own
    // arrangement, so what is dragged is exactly what the menu displays —
    // and saving writes only that arrangement, never the regular lists.
    const items =
      this._quickMenuOnly
        ? orderQuickMenuByOrder(allItems, this.plugin.settings.quickMenuOrder)
        : allItems;

    items.forEach((preset) => {
      if (!preset) return;
      if (defaultPreset && preset.uid === defaultPreset.uid) return;
      if (!preset.uid) return;
      if (renderedUids.has(preset.uid)) return;
      renderedUids.add(preset.uid);

      const isBuiltIn = seedUids.has(preset.uid);
      const isQuickStyle = Array.isArray(quickStyles) && quickStyles.includes(preset);
      const isCustom = !isBuiltIn && !isQuickStyle;

      const isQuickMenu = quickMenuShown(preset);

      if (this._quickMenuOnly && !isQuickMenu) return;

      const row = container.createDiv({ cls: "act-reorder-row" });
      row.setAttribute("data-uid", preset.uid);
      if (isBuiltIn) row.setAttribute("data-built-in", "true");
      if (isQuickStyle) row.setAttribute("data-quick-style", "true");
      if (isCustom) row.setAttribute("data-custom", "true");

      const dragHandle = row.createDiv({ cls: "clickable-icon act-reorder-drag-handle" });
      setIcon(dragHandle, "menu");
      dragHandle.addClass("act-drag-handle");
      dragHandle.setAttribute(
        "aria-label",
        this.plugin.t("drag_to_reorder", "Drag to reorder"),
      );

      const preview = row.createDiv({ cls: "act-reorder-row-preview" });
      this._applyStyle(preview, preset, preset.name || "Style");

      this._setupDrag(row, dragHandle, container);

      row.addEventListener("contextmenu", (evt) => {
        evt.preventDefault();
        const allRows = Array.from(container.querySelectorAll(".act-reorder-row"));
        const idx = allRows.indexOf(row);
        if (idx === -1) return;
        const menu = new Menu();
        menu.addItem((item) =>
          item
            .setTitle(this.plugin.t("move_up", "Move Up"))
            .setIcon("arrow-up")
            .setDisabled(idx === 0)
            .onClick(() => {
              if (idx > 0) container.insertBefore(row, allRows[idx - 1]);
            }),
        );
        menu.addItem((item) =>
          item
            .setTitle(this.plugin.t("move_down", "Move Down"))
            .setIcon("arrow-down")
            .setDisabled(idx === allRows.length - 1)
            .onClick(() => {
              if (idx < allRows.length - 1) {
                const next = allRows[idx + 1];
                if (next.nextSibling) container.insertBefore(row, next.nextSibling);
                else container.appendChild(row);
              }
            }),
        );
        menu.addSeparator();
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
            .onClick(() => {
              this._toggleQuickMenu(preset);
              this._renderList();
            });
        });
        menu.showAtMouseEvent(evt);
      });
    });
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
  }

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
        ? styleObj.backgroundColor : null;
    const textHex =
      styleObj.textColor && styleObj.textColor !== "currentColor" &&
      this.plugin.isValidHexColor(styleObj.textColor)
        ? styleObj.textColor : null;

    let bg = "";
    if (style !== "text") {
      if (bgHex) {
        bg = `background: ${this.plugin.hexToRgba(bgHex, opacity)};`;
      } else {
        bg = `background: color-mix(in srgb, ${accent} ${opacity}%, transparent);`;
      }
    }

    let border = "";
    if (style !== "text" && typeof this.plugin.generateBorderStyle === "function") {
      // Same generator as the editor preview and runtime: border colour
      // follows the colortype (text for both/text, background for highlight)
      // instead of always taking the background.
      border =
        this.plugin.generateBorderStyle(textHex || accent, bgHex || accent, styleObj) ||
        "";
    }

    const textColorVal = textHex || "var(--text-normal)";
    const cornerShape = styleObj.cornerShape || this.plugin.settings.cornerShape || "round";
    const cornerCss = cornerShape && cornerShape !== "round" ? `corner-shape:${cornerShape};` : "";
    const base =
      style === "text"
        ? `color:${textColorVal};background:transparent;`
        : style === "highlight"
          ? `${bg}border-radius:${radius}px;${cornerCss}padding:${vpad}px ${hpad}px;color:var(--text-normal);${border}`
          : `color:${textColorVal};${bg}border-radius:${radius}px;${cornerCss}padding:${vpad}px ${hpad}px;${border}`;

    span.setAttribute(
      "style",
      base + "box-decoration-break:clone;-webkit-box-decoration-break:clone;",
    );
  }

  _setupDrag(row, dragHandle, container) {
    let dragStarted = false;
    let ghost = null;
    let sX = 0, sY = 0;
    let oX = 0, oY = 0;

    const createGhost = () => {
      const rect = row.getBoundingClientRect();
      ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
      const clone = row.cloneNode(true);
      ghost.appendChild(clone);
      ghost.style.width = rect.width + "px";
      ghost.style.height = rect.height + "px";
      ghost.style.left = rect.left + "px";
      ghost.style.top = rect.top + "px";
      row.classList.add("drag-ghost-hidden");
      document.body.classList.add("act-dragging-active");
      dragHandle.style.cursor = "grabbing";
      if (navigator.vibrate) navigator.vibrate(30);
    };

    const doReorder = (currentX, currentY) => {
      if (!ghost) return;
      ghost.style.left = (currentX - oX) + "px";
      ghost.style.top = (currentY - oY) + "px";

      ghost.style.display = "none";
      const from = document.elementFromPoint(currentX, currentY);
      ghost.style.display = "";

      const targetRow = from ? from.closest(".act-reorder-row") : null;
      if (!targetRow || targetRow === row || targetRow.parentNode !== container) return;

      const children = Array.from(container.querySelectorAll(".act-reorder-row"));
      const cur = children.indexOf(row);
      const tgt = children.indexOf(targetRow);
      if (cur === -1 || tgt === -1 || cur === tgt) return;

      if (navigator.vibrate) navigator.vibrate(30);
      if (cur < tgt) targetRow.after(row);
      else container.insertBefore(row, targetRow);
    };

    const cleanupDrag = () => {
      document.removeEventListener("mousemove", onDocMouseMove, { capture: true });
      document.removeEventListener("mouseup", onDocMouseUp, { capture: true });
      document.removeEventListener("touchmove", onDocTouchMove, { capture: true });
      document.removeEventListener("touchend", onDocTouchEnd, { capture: true });
      document.removeEventListener("touchcancel", onDocTouchEnd, { capture: true });
      document.body.classList.remove("act-dragging-active");
      dragHandle.style.cursor = "grab";
      if (ghost) { try { ghost.remove(); } catch (_) {} ghost = null; }
      row.classList.remove("drag-ghost-hidden");
      dragStarted = false;
    };

    const onDocMouseMove = (e) => {
      if (!dragHandle) return;
      e.preventDefault();
      if (!dragStarted) {
        if (Math.hypot(e.clientX - sX, e.clientY - sY) > 4) {
          createGhost();
          dragStarted = true;
        } else {
          return;
        }
      }
      doReorder(e.clientX, e.clientY);
    };
    const onDocMouseUp = () => { cleanupDrag(); };

    const onDocTouchMove = (e) => {
      if (!dragHandle || e.touches.length !== 1) return;
      e.preventDefault();
      const t = e.touches[0];
      if (!dragStarted) {
        if (Math.hypot(t.clientX - sX, t.clientY - sY) > 4) {
          createGhost();
          dragStarted = true;
        } else {
          return;
        }
      }
      doReorder(t.clientX, t.clientY);
    };
    const onDocTouchEnd = () => { cleanupDrag(); };

    dragHandle.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      sX = e.clientX; sY = e.clientY;
      const rect = row.getBoundingClientRect();
      oX = e.clientX - rect.left;
      oY = e.clientY - rect.top;
      dragStarted = false;
      document.addEventListener("mousemove", onDocMouseMove, { passive: false, capture: true });
      document.addEventListener("mouseup", onDocMouseUp, { passive: false, capture: true });
    });

    dragHandle.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      e.stopPropagation();
      const t = e.touches[0];
      sX = t.clientX; sY = t.clientY;
      const rect = row.getBoundingClientRect();
      oX = t.clientX - rect.left;
      oY = t.clientY - rect.top;
      dragStarted = false;
      document.addEventListener("touchmove", onDocTouchMove, { passive: false, capture: true });
      document.addEventListener("touchend", onDocTouchEnd, { passive: false, capture: true });
      document.addEventListener("touchcancel", onDocTouchEnd, { passive: false, capture: true });
    }, { passive: false });
  }

  _saveOrder() {
    const container = this._listContainer;
    if (!container) return;

    const rows = Array.from(container.querySelectorAll(".act-reorder-row"));
    const uidOrder = rows.map((r) => r.getAttribute("data-uid")).filter(Boolean);

    if (this._quickMenuOnly) {
      // Quick Menu arrangement only: the regular preset and quick-style
      // lists keep their own ordering untouched, so arranging the menu can
      // never reshuffle a preset (the old save applied this row order to
      // both lists, which moved presets the filter had hidden).
      this.plugin.settings.quickMenuOrder = reconcileQuickMenuOrder({
        quickMenuOrder: this.plugin.settings.quickMenuOrder,
        memberUids: deriveQuickMenuOrder({
          quickStyles: this.plugin.settings.quickStyles,
          presets: this.plugin.settings.textStylePresets,
        }),
        uidOrder,
      });
      this.plugin.saveSettings();
      return;
    }

    // Regular ordering. Snapshot the Quick Menu's arrangement first when it
    // does not exist yet, so this reorder cannot drag menu items along.
    if (
      !Array.isArray(this.plugin.settings.quickMenuOrder) ||
      !this.plugin.settings.quickMenuOrder.length
    ) {
      this.plugin.settings.quickMenuOrder = deriveQuickMenuOrder({
        quickStyles: this.plugin.settings.quickStyles,
        presets: this.plugin.settings.textStylePresets,
      });
    }

    const seedUids = new Set(
      (defaultSettings.textStylePresets || []).map((s) => s.uid),
    );
    const next = reconcilePresetOrder({
      presets: this.plugin.settings.textStylePresets,
      quickStyles: this.plugin.settings.quickStyles,
      seedUids,
      uidOrder,
    });

    this.plugin.settings.textStylePresets = next.presets;
    this.plugin.settings.quickStyles = next.quickStyles;

    this.plugin.saveSettings();
  }

  _render() {
    this._buildContent();
  }

  onClose() {
    this._saveOrder();
    this.contentEl.empty();
    if (typeof this.onComplete === "function") {
      try { this.onComplete(); } catch (_) {}
    }
  }
}
