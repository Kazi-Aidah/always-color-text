import { Menu, Modal, Notice } from 'obsidian';
import { defaultSettings } from '../settings/defaultSettings.js';
import { ConfirmationModal } from './ConfirmationModal.js';

export class EditColorSwatchesModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this._eventListeners = [];
    this._activeIndex = null;
    this._ghost = null;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass("act-edit-swatches-modal");
      this.modalEl.style.maxWidth = "700px";
      this.modalEl.style.padding = "20px";
    } catch (e) {}

    // ===== Heading on the left =====
    const headerRow = contentEl.createDiv();
    headerRow.style.display = "flex";
    headerRow.style.alignItems = "center";
    headerRow.style.justifyContent = "flex-start";
    const title = headerRow.createEl("h2", {
      text: this.plugin.t("edit_color_swatches_header", "Edit Color Swatches"),
    });
    title.style.margin = "0";

    // ===== Preview row: Background Color (left) + Text Color (right) =====
    const previewRow = contentEl.createDiv();
    previewRow.style.display = "flex";
    previewRow.style.gap = "8px";
    previewRow.style.marginTop = "8px";
    previewRow.style.marginBottom = "4px";
    previewRow.style.flexWrap = "wrap";

    const bgWrap = previewRow.createDiv();
    bgWrap.addClass("act-color-picker-preview-wrap");
    bgWrap.style.flex = "1 1 120px";
    bgWrap.style.minWidth = "120px";
    bgWrap.style.marginTop = "20px";

    const bgSample = bgWrap.createDiv();
    bgSample.textContent = this.plugin.t(
      "bg_color_preview_label",
      "Background Color",
    );
    bgSample.style.padding = "2px 6px";
    bgSample.style.borderRadius = "6px";

    const textWrap = previewRow.createDiv();
    textWrap.addClass("act-color-picker-preview-wrap");
    textWrap.style.flex = "1 1 120px";
    textWrap.style.minWidth = "120px";
    textWrap.style.marginTop = "20px";

    const textSample = textWrap.createDiv();
    textSample.textContent = this.plugin.t("text_color_title", "Text Color");
    textSample.style.padding = "2px 6px";

    // ===== Color picker + hex input row (bordered panel) =====
    const pickerWrap = contentEl.createDiv();
    pickerWrap.addClass("act-edit-swatches-picker");
    pickerWrap.style.display = "flex";
    pickerWrap.style.alignItems = "center";
    pickerWrap.style.gap = "10px";
    pickerWrap.style.marginTop = "6px";
    pickerWrap.style.flexWrap = "wrap";
    pickerWrap.style.padding = "12px";
    pickerWrap.style.border = "1px solid var(--background-modifier-border)";
    pickerWrap.style.borderRadius = "var(--input-radius)";
    pickerWrap.style.boxSizing = "border-box";

    const colorInput = pickerWrap.createEl("input", { type: "color" });
    colorInput.title = this.plugin.t("color_input_title", "Pick a color");
    colorInput.style.width = "44px";
    colorInput.style.height = "44px";
    colorInput.style.border = "none";
    colorInput.style.borderRadius = "12px";
    colorInput.style.cursor = "pointer";
    colorInput.value = "#000000";

    const hex = pickerWrap.createEl("input", { type: "text" });
    hex.title = this.plugin.t("hex_input_title", "Hex code");
    hex.style.flex = "1";
    hex.style.padding = "8px";
    hex.style.borderRadius = "8px";
    hex.style.border = "1px solid var(--background-modifier-border)";
    hex.style.width = "120px";
    hex.placeholder = "#000000";
    hex.value = "";

    // ===== Action button (right of the picker row) =====
    const actionBtn = pickerWrap.createEl("button");
    actionBtn.addClass("mod-cta");
    actionBtn.style.whiteSpace = "nowrap";
    actionBtn.style.flexShrink = "0";
    actionBtn.style.marginLeft = "auto";

    // ===== Swatch panel (defaults + custom, both editable) =====
    const panel = contentEl.createDiv();
    panel.addClass("color-picker-panel");
    panel.style.marginTop = "6px";
    panel.style.padding = "12px";

    const grid = panel.createDiv();
    grid.addClass("color-swatch-grid");

    // Combined working list: default swatches (editable) followed by user custom
    // swatches. Each entry is tagged with _src so saves can be split back.
    const buildCombined = () => {
      const def = Array.isArray(this.plugin.settings.swatches)
        ? this.plugin.settings.swatches
        : [];
      const cus = Array.isArray(this.plugin.settings.userCustomSwatches)
        ? this.plugin.settings.userCustomSwatches
        : [];
      const out = [];
      def.forEach((s, i) =>
        out.push({ name: s.name, color: s.color, _src: "default", _idx: i }),
      );
      cus.forEach((s, i) =>
        out.push({ name: s.name, color: s.color, _src: "custom", _idx: i }),
      );
      return out;
    };

    let combined = buildCombined();

    const getSwatches = () => combined;

    const saveSwatches = async () => {
      const def = combined
        .filter((s) => s._src === "default")
        .map((s) => ({ name: s.name, color: s.color }));
      const cus = combined
        .filter((s) => s._src === "custom")
        .map((s) => ({ name: s.name, color: s.color }));
      this.plugin.settings.swatches = def;
      this.plugin.settings.userCustomSwatches = cus;
      this.plugin.settings.customSwatches = combined.map((s) => s.color);
      await this.plugin.saveSettings();
    };

    // Syncs hex text input from color picker, then renders previews.
    // This is the single source of truth for color→preview sync.
    const applyCurrentColor = (sourceIsColorInput = false) => {
      let color;
      if (sourceIsColorInput) {
        // Color wheel moved: pull value directly from colorInput and push to hex
        color = colorInput.value;
        hex.value = color;
      } else {
        // Hex typed: validate and sync back to colorInput
        const raw = hex.value.trim();
        const normalised = raw.startsWith("#") ? raw : "#" + raw;
        if (this.plugin.isValidHexColor(normalised)) {
          color = normalised;
          hex.value = normalised;
          colorInput.value = normalised;
        } else {
          // Not yet valid — still update colorInput best-effort so wheel moves
          color = colorInput.value;
        }
      }
      renderPreviews(color);
    };

    const renderPreviews = (color) => {
      if (!this.plugin.isValidHexColor(color)) {
        bgSample.style.backgroundColor = "";
        bgSample.style.borderRadius = "";
        bgSample.style.padding = "";
        bgSample.style.border = "";
        textSample.style.color = "";
        return;
      }
      const params = this.plugin.getHighlightParams(null);
      const rgba = this.plugin.hexToRgba(color, params.opacity ?? 25);
      const radius = params.radius ?? 8;
      const hPad = params.hPad ?? 4;
      const vPad = params.vPad ?? 0;

      // Background color preview — full global highlight styling
      bgSample.style.backgroundColor = rgba;
      bgSample.style.borderRadius = radius + "px";
      bgSample.style.paddingLeft = hPad + "px";
      bgSample.style.paddingRight = hPad + "px";
      bgSample.style.paddingTop = vPad + "px";
      bgSample.style.paddingBottom = vPad + "px";
      if (this.plugin.settings.enableBoxDecorationBreak ?? true) {
        bgSample.style.boxDecorationBreak = "clone";
        bgSample.style.webkitBoxDecorationBreak = "clone";
      }
      this.plugin.applyBorderStyleToElement(bgSample, null, color, null);

      // Text color preview
      textSample.style.color = color;
    };

    const updateButtonLabel = () => {
      actionBtn.textContent =
        this._activeIndex === null
          ? this.plugin.t("btn_save_swatch", "Save Swatch")
          : this.plugin.t("btn_update_swatch", "Update Swatch");
    };

    const removeGhost = () => {
      if (this._ghost) {
        this._ghost.remove();
        this._ghost = null;
      }
      grid
        .querySelectorAll(".drag-ghost-hidden")
        .forEach((el) => el.classList.remove("drag-ghost-hidden"));
    };

    // ===== Mobile-only "Delete Swatch" button (shown below grid when active) =====
    const mobileDeleteRow = contentEl.createDiv();
    mobileDeleteRow.style.display = "none"; // hidden until a swatch is active
    mobileDeleteRow.style.marginTop = "8px";
    const mobileDeleteBtn = mobileDeleteRow.createEl("button");
    mobileDeleteBtn.textContent = this.plugin.t("delete_swatch", "Delete Swatch");
    mobileDeleteBtn.style.color = "var(--text-error)";
    mobileDeleteBtn.style.width = "100%";

    const updateMobileDelete = () => {
      // Show only on touch devices and only when a swatch is selected
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      mobileDeleteRow.style.display =
        isTouch && this._activeIndex !== null ? "block" : "none";
    };

    const mobileDeleteHandler = async () => {
      if (this._activeIndex === null) return;
      const swatches = getSwatches();
      swatches.splice(this._activeIndex, 1);
      this._activeIndex = null;
      await saveSwatches();
      renderGrid();
      updateButtonLabel();
      updateMobileDelete();
    };
    mobileDeleteBtn.addEventListener("click", mobileDeleteHandler);
    this._eventListeners.push({ el: mobileDeleteBtn, event: "click", handler: mobileDeleteHandler });

    const renderGrid = () => {
      grid.empty();
      const swatches = getSwatches();
      if (swatches.length === 0) {
        const empty = grid.createDiv();
        empty.style.gridColumn = "1 / -1";
        empty.textContent = this.plugin.t(
          "no_custom_swatches_yet",
          'No custom swatches yet. Pick a color and click "Save Swatch".',
        );
        empty.style.opacity = "0.6";
        empty.style.fontSize = "12px";
        empty.style.textAlign = "center";
        return;
      }

      swatches.forEach((sw, i) => {
        const btn = grid.createEl("button");
        btn.setAttribute("data-swatch-index", i.toString());
        btn.style.backgroundColor =
          sw && sw.color && this.plugin.isValidHexColor(sw.color)
            ? sw.color
            : "#000000";
        btn.style.width = "100%";
        btn.style.aspectRatio = "1 / 1";
        btn.style.minWidth = "44px";
        btn.style.minHeight = "44px";
        btn.style.setProperty("border", "transparent", "important");
        btn.style.borderRadius = "12px";
        btn.style.cursor = "grab";
        btn.draggable = false;
        if (i === this._activeIndex) btn.addClass("act-swatch-active");
        btn.setAttr("title", sw && sw.name ? sw.name : `Swatch ${i + 1}`);

        // Right-click → context menu (desktop)
        const ctxHandler = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const menu = new Menu();
          menu.addItem((item) =>
            item
              .setTitle(this.plugin.t("delete_swatch", "Delete Swatch"))
              .setIcon("trash")
              .onClick(async () => {
                const swatches = getSwatches();
                swatches.splice(i, 1);
                if (this._activeIndex === i) this._activeIndex = null;
                else if (this._activeIndex !== null && this._activeIndex > i)
                  this._activeIndex -= 1;
                await saveSwatches();
                renderGrid();
                updateButtonLabel();
                updateMobileDelete();
              }),
          );
          menu.showAtMouseEvent(ev);
        };
        btn.addEventListener("contextmenu", ctxHandler);
        this._eventListeners.push({ el: btn, event: "contextmenu", handler: ctxHandler });
      });
    };

    // ===== Single delegated drag + click controller =====
    // Attached once to `grid`. Mouse: click = select, hold + move > 4px = drag.
    // Touch: tap = select, finger move > 4px = drag.
    {
      let dragBtn       = null;
      let dragActive    = false;
      let startX        = 0, startY = 0;
      let offsetX       = 0, offsetY = 0;
      let didDrag       = false; // flag to suppress click after drag

      // --- Ghost helpers ---
      const startDrag = (btn) => {
        removeGhost();
        const rect = btn.getBoundingClientRect();
        const ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
        ghost.style.position        = "fixed";   // MUST be fixed for left/top to track cursor
        ghost.style.backgroundColor = btn.style.backgroundColor;
        ghost.style.borderRadius    = btn.style.borderRadius || "12px";
        ghost.style.opacity         = "0.85";
        ghost.style.pointerEvents   = "none";
        ghost.style.zIndex          = "99999";
        ghost.style.width  = rect.width  + "px";
        ghost.style.height = rect.height + "px";
        ghost.style.left   = rect.left   + "px";
        ghost.style.top    = rect.top    + "px";
        btn.classList.add("drag-ghost-hidden");
        this._ghost = ghost;
        dragActive  = true;
        dragBtn.style.cursor = "grabbing";
      };

      const swapAtPoint = (clientX, clientY) => {
        if (!this._ghost || !dragBtn) return;
        this._ghost.style.left = clientX - offsetX + "px";
        this._ghost.style.top  = clientY - offsetY + "px";

        // elementFromPoint ignores pointer-events:none, so briefly hide the ghost
        // to let the hit-test reach the actual swatch button underneath.
        this._ghost.style.display = "none";
        const from = document.elementFromPoint(clientX, clientY);
        this._ghost.style.display = "";

        const targetBtn = from ? from.closest("button[data-swatch-index]") : null;
        if (!targetBtn || targetBtn === dragBtn || targetBtn.parentNode !== grid) return;

        const children = Array.from(grid.querySelectorAll("button[data-swatch-index]"));
        const cur = children.indexOf(dragBtn);
        const tgt = children.indexOf(targetBtn);
        if (cur === -1 || tgt === -1 || cur === tgt) return;

        if (navigator.vibrate) navigator.vibrate(30);
        if (cur < tgt) targetBtn.after(dragBtn);
        else grid.insertBefore(dragBtn, targetBtn);

        const swatches = getSwatches();
        const item = swatches.splice(cur, 1)[0];
        swatches.splice(tgt, 0, item);

        // Keep _activeIndex in sync if the active swatch moved
        if (this._activeIndex === cur) this._activeIndex = tgt;
        else if (this._activeIndex === tgt) this._activeIndex = cur;

        Array.from(grid.querySelectorAll("button[data-swatch-index]"))
          .forEach((r, idx) => {
            r.setAttribute("data-swatch-index", String(idx));
            if (idx === this._activeIndex) r.addClass("act-swatch-active");
            else r.removeClass("act-swatch-active");
          });
      };

      const endDrag = async () => {
        document.removeEventListener("mousemove",   onMouseMove);
        document.removeEventListener("mouseup",     onMouseUp);
        document.removeEventListener("touchmove",   onTouchMove);
        document.removeEventListener("touchend",    onTouchEnd);
        document.removeEventListener("touchcancel", onTouchEnd);
        if (dragBtn) dragBtn.style.cursor = "grab";
        removeGhost();

        if (dragActive) {
          didDrag = true;
          await saveSwatches();
          renderGrid();
          updateMobileDelete();
        }

        dragActive = false;
        dragBtn    = null;
      };

      // ---- Mouse: ghost created ONLY after movement > 4px, matches touch behaviour ----
      const onMouseMove = (e) => {
        if (!dragBtn) return;
        e.preventDefault();
        if (!dragActive) {
          // Start dragging once mouse moves > 4px
          if (Math.hypot(e.clientX - startX, e.clientY - startY) > 4) {
            startDrag(dragBtn);
          } else {
            return;
          }
        }
        swapAtPoint(e.clientX, e.clientY);
      };
      const onMouseUp = async () => { await endDrag(); };

      const gridMouseDown = (e) => {
        if (e.button !== 0) return; // left button only
        const btn = e.target.closest("button[data-swatch-index]");
        if (!btn || btn.parentNode !== grid) return;
        // DO NOT preventDefault here — it would kill the click event for selection
        didDrag = false;
        dragBtn = btn;
        const rect = btn.getBoundingClientRect();
        startX  = e.clientX;
        startY  = e.clientY;
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        // Do NOT start drag here immediately — wait for movement threshold in onMouseMove
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup",   onMouseUp);
      };
      grid.addEventListener("mousedown", gridMouseDown);
      this._eventListeners.push({ el: grid, event: "mousedown", handler: gridMouseDown });

      // Click handler (delegated) — activate / deactivate swatch
      const gridClick = (e) => {
        // Swallow click that was the tail of a drag
        if (didDrag) { didDrag = false; return; }
        const btn = e.target.closest("button[data-swatch-index]");
        if (!btn || btn.parentNode !== grid) return;
        const i = parseInt(btn.getAttribute("data-swatch-index"), 10);
        const swatches = getSwatches();
        const sw = swatches[i];
        if (this._activeIndex === i) {
          this._activeIndex = null;
          updateButtonLabel();
          renderGrid();
          updateMobileDelete();
          return;
        }
        this._activeIndex = i;
        const color = sw && this.plugin.isValidHexColor(sw.color) ? sw.color : "#000000";
        colorInput.value = color;
        hex.value = color;
        renderPreviews(color);
        renderGrid();
        updateButtonLabel();
        updateMobileDelete();
      };
      grid.addEventListener("click", gridClick);
      this._eventListeners.push({ el: grid, event: "click", handler: gridClick });

      // ---- Touch: touchstart immediately starts drag (same as Quick Colors) ----
      // A tap (no significant movement + quick release) still selects via gridClick.
      const onTouchMove = (e) => {
        if (e.touches.length !== 1 || !dragBtn) return;
        e.preventDefault();
        const { clientX, clientY } = e.touches[0];
        if (!dragActive) {
          // Start dragging once finger moves > 4px
          if (Math.hypot(clientX - startX, clientY - startY) > 4) {
            startDrag(dragBtn);
          }
          return;
        }
        swapAtPoint(clientX, clientY);
      };
      const onTouchEnd = async () => { await endDrag(); };

      const gridTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        const btn = e.target.closest("button[data-swatch-index]");
        if (!btn || btn.parentNode !== grid) return;
        dragBtn = btn;
        const { clientX, clientY } = e.touches[0];
        startX = clientX;
        startY = clientY;
        const r = btn.getBoundingClientRect();
        offsetX = clientX - r.left;
        offsetY = clientY - r.top;
        document.addEventListener("touchmove",   onTouchMove,  { passive: false });
        document.addEventListener("touchend",    onTouchEnd);
        document.addEventListener("touchcancel", onTouchEnd);
      };
      grid.addEventListener("touchstart", gridTouchStart, { passive: true });
      this._eventListeners.push({ el: grid, event: "touchstart", handler: gridTouchStart });
    }

    // ===== Action button handler =====
    const actionHandler = async () => {
      // Use colorInput as the authoritative source — it's always a valid hex.
      // Prefer hex if the user has typed a valid one, fall back to colorInput.
      let color = hex.value.trim();
      if (!color.startsWith("#")) color = "#" + color;
      if (!this.plugin.isValidHexColor(color)) {
        color = colorInput.value;
      }
      if (!this.plugin.isValidHexColor(color)) {
        new Notice(
          this.plugin.t(
            "notice_invalid_hex_format",
            "Invalid hex color format. Use #RRGGBB or #RGB.",
          ),
        );
        return;
      }
      // Keep inputs in sync
      colorInput.value = color;
      hex.value = color;

      const swatches = getSwatches();
      if (this._activeIndex === null) {
        // ADD: push new swatch, then reset to add mode so button goes back to "Save Swatch"
        const nextIndex = swatches.length + 1;
        swatches.push({ name: `Swatch ${nextIndex}`, color, _src: "custom" });
        await saveSwatches();
        renderPreviews(color);
        // Clear active so the button returns to "Save Swatch" after adding
        this._activeIndex = null;
      } else {
        // UPDATE: patch the existing swatch in-place
        swatches[this._activeIndex].color = color;
        await saveSwatches();
        renderPreviews(color);
      }
      renderGrid();
      updateButtonLabel();
    };
    actionBtn.addEventListener("click", actionHandler);
    this._eventListeners.push({
      el: actionBtn,
      event: "click",
      handler: actionHandler,
    });

    // Hex change / color input keep preview in sync
    const pickerHandler = () => applyCurrentColor(true);   // color wheel → push hex
    colorInput.addEventListener("input", pickerHandler);
    this._eventListeners.push({
      el: colorInput,
      event: "input",
      handler: pickerHandler,
    });
    // Also listen to "change" for browsers/Electron that don't fire "input" reliably
    colorInput.addEventListener("change", pickerHandler);
    this._eventListeners.push({
      el: colorInput,
      event: "change",
      handler: pickerHandler,
    });
    const hexHandler = () => applyCurrentColor(false);     // hex typed → validate and pull
    hex.addEventListener("input", hexHandler);
    this._eventListeners.push({
      el: hex,
      event: "input",
      handler: hexHandler,
    });

    // Build everything AFTER the action button exists so the label can reference it
    renderGrid();
    updateButtonLabel();
    updateMobileDelete();

    // ===== Footer: Reset button on the bottom-left, under the swatches =====
    const footer = contentEl.createDiv();
    footer.style.marginTop = "12px";
    const resetBtn = footer.createEl("button");
    resetBtn.textContent = this.plugin.t("btn_reset_swatches", "Reset");
    resetBtn.style.whiteSpace = "nowrap";
    resetBtn.style.flexShrink = "0";

    const doResetSwatches = () => {
      new ConfirmationModal(
        this.app,
        this.plugin,
        this.plugin.t(
          "confirm_reset_swatches_title",
          "Reset default swatches?",
        ),
        this.plugin.t(
          "confirm_reset_swatches_desc",
          "Reset the default swatches back to their original colours? Edited defaults will be restored and deleted ones re-added.",
        ),
        async () => {
          const originals = (defaultSettings.swatches || []).map((s) => ({
            name: s.name,
            color: s.color,
          }));
          this.plugin.settings.swatches = JSON.parse(
            JSON.stringify(originals),
          );
          combined = buildCombined();
          this._activeIndex = null;
          await this.plugin.saveSettings();
          renderGrid();
          updateButtonLabel();
          updateMobileDelete();
        },
      ).open();
    };
    resetBtn.addEventListener("click", doResetSwatches);
  }

  onClose() {
    this._eventListeners.forEach(({ el, event, handler }) => {
      try {
        el.removeEventListener(event, handler);
      } catch (e) {}
    });
    this._eventListeners = [];
    // Actually remove the ghost element from the DOM before nulling it
    if (this._ghost) {
      try { this._ghost.remove(); } catch (e) {}
      this._ghost = null;
    }
    try {
      this.contentEl.empty();
    } catch (e) {}
  }
}