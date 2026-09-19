import { Modal, Menu, setIcon } from 'obsidian';
import { defaultSettings } from '../settings/defaultSettings.js';

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

    allItems.forEach((preset) => {
      if (!preset) return;
      if (defaultPreset && preset.uid === defaultPreset.uid) return;
      if (!preset.uid) return;

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
    if (style !== "text" && p.enableBorder) {
      const thickness = p.borderThickness ?? 1;
      const line = p.borderLineStyle || "solid";
      const color = bgHex || accent;
      const css = `${thickness}px ${line} ${color} !important;`;
      switch (p.borderStyle || "full") {
        case "bottom": border = ` border-bottom: ${css}`; break;
        case "top": border = ` border-top: ${css}`; break;
        case "left": border = ` border-left: ${css}`; break;
        case "right": border = ` border-right: ${css}`; break;
        case "top-bottom": border = ` border-top: ${css} border-bottom: ${css}`; break;
        case "left-right": border = ` border-left: ${css} border-right: ${css}`; break;
        case "top-left-right": border = ` border-top: ${css} border-left: ${css} border-right: ${css}`; break;
        case "bottom-left-right": border = ` border-bottom: ${css} border-left: ${css} border-right: ${css}`; break;
        case "top-right": border = ` border-top: ${css} border-right: ${css}`; break;
        case "top-left": border = ` border-top: ${css} border-left: ${css}`; break;
        case "bottom-right": border = ` border-bottom: ${css} border-right: ${css}`; break;
        case "full": default: border = ` border: ${css}`;
      }
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

    const presets = this.plugin.settings.textStylePresets;
    const quickStyles = this.plugin.settings.quickStyles;
    const seedUids = new Set(
      (defaultSettings.textStylePresets || []).map((s) => s.uid),
    );

    const presetByUid = new Map();
    presets.forEach((p) => { if (p && p.uid) presetByUid.set(p.uid, p); });
    const qsByUid = new Map();
    if (Array.isArray(quickStyles)) {
      quickStyles.forEach((s) => { if (s && s.uid) qsByUid.set(s.uid, s); });
    }

    const reorderableUids = uidOrder.filter((uid) => {
      return qsByUid.has(uid) || !seedUids.has(uid);
    });

    const newTsp = [];
    let ri = 0;
    presets.forEach((p) => {
      if (!p) return;
      if (seedUids.has(p.uid)) {
        newTsp.push(p);
      } else {
        if (ri < reorderableUids.length) {
          const uid = reorderableUids[ri++];
          const item = presetByUid.get(uid) || qsByUid.get(uid);
          if (item) newTsp.push(item);
        } else {
          newTsp.push(p);
        }
      }
    });
    while (ri < reorderableUids.length) {
      const uid = reorderableUids[ri++];
      const item = presetByUid.get(uid) || qsByUid.get(uid);
      if (item) newTsp.push(item);
    }

    this.plugin.settings.textStylePresets = newTsp;

    if (Array.isArray(quickStyles)) {
      const newQs = [];
      reorderableUids.forEach((uid) => {
        if (qsByUid.has(uid)) newQs.push(qsByUid.get(uid));
      });
      this.plugin.settings.quickStyles = newQs;
    }

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
