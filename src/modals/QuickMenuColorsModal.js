import { Modal, Notice, setIcon } from 'obsidian';
import { ColorPickerModal } from './ColorPickerModal.js';
import { debugError } from '../utils/debug.js';

export class QuickMenuColorsModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this._eventListeners = [];
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass("act-quick-menu-colors-modal");
      this.modalEl.style.maxWidth = "800px";
      this.modalEl.style.padding = "20px";
    } catch (e) {}

    // ===== Heading on the left =====
    const headerRow = contentEl.createDiv();
    headerRow.style.display = "flex";
    headerRow.style.alignItems = "center";
    headerRow.style.justifyContent = "flex-start";
    const title = headerRow.createEl("h2", {
      text: this.plugin.t("quick_colors_header", "Quick Colors"),
    });
    title.style.margin = "0";

    // Create a container for the quick colors UI
    const quickColorsContainer = contentEl.createDiv();
    quickColorsContainer.style.marginTop = "20px";

    // Now we need to replicate the _refreshQuickColors() logic from SettingsTab.js
    // but without the toggle switch and apply mode settings (just the swatch groups)
    this._renderQuickColorsUI(quickColorsContainer);
  }

  _renderQuickColorsUI(container) {
    try {
      container.empty();

      // Quick Colors pairs container - similar to _refreshQuickColors() but without toggle
      const listDiv = container.createDiv();
      listDiv.style.display = "flex";
      listDiv.style.flexWrap = "wrap";
      listDiv.style.gap = "8px";
      listDiv.style.alignItems = "center";
      listDiv.style.width = "100%";
      listDiv.style.boxSizing = "border-box";

      const colors = Array.isArray(this.plugin.settings.quickColors)
        ? this.plugin.settings.quickColors
        : [];
      
      if (colors.length > 0) {
        colors.forEach((pair, i) => {
          if (!pair || typeof pair !== "object")
            pair = {
              textColor: "#87c760",
              backgroundColor: "#1d5010",
              uid: Date.now().toString(36) + Math.random().toString(36).slice(2),
            };
          
          const row = listDiv.createDiv();
          row.style.display = "inline-flex";
          row.style.alignItems = "center";
          row.style.gap = "6px";
          row.style.marginBottom = "8px";
          row.style.border = "1px solid var(--background-modifier-border)";
          row.style.borderRadius = "var(--setting-items-radius)";
          row.style.backgroundColor = "var(--setting-items-background)";
          row.style.padding = "6px 10px";
          row.style.flex = "0 0 auto";
          row.setAttribute("data-qc-index", String(i));

          // Drag handle
          const dragHandle = row.createEl("button");
          setIcon(dragHandle, "menu");
          dragHandle.addClass("act-drag-handle");
          dragHandle.style.padding = "0";
          dragHandle.style.border = "none";
          dragHandle.style.background = "transparent";
          dragHandle.style.boxShadow = "none";
          dragHandle.style.cursor = "grab";
          dragHandle.style.color = "var(--text-muted)";
          dragHandle.style.flexShrink = "0";
          dragHandle.style.display = "flex";
          dragHandle.style.alignItems = "center";
          dragHandle.style.justifyContent = "center";
          dragHandle.style.width = "24px";
          dragHandle.style.height = "24px";
          dragHandle.setAttribute(
            "aria-label",
            this.plugin.t("drag_to_reorder", "Drag to reorder"),
          );

          // Text color picker
          const tCp = row.createEl("input", { type: "color" });
          tCp.value =
            pair.textColor && this.plugin.isValidHexColor(pair.textColor)
              ? pair.textColor
              : "#87c760";
          tCp.style.width = "30px";
          tCp.style.height = "30px";
          tCp.style.border = "none";
          tCp.style.borderRadius = "var(--input-radius)";
          tCp.style.cursor = "pointer";
          tCp.style.flex = "0 0 auto";
          tCp.title = this.plugin.t("text_color_title", "Text Color");
          
          const tChange = async () => {
            const val = tCp.value;
            if (!this.plugin.isValidHexColor(val)) return;
            this.plugin.settings.quickColors[i].textColor = val;
            await this.plugin.saveSettings();
          };
          tCp.addEventListener("input", tChange);
          tCp.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            openCombinedPicker();
          });
          this._eventListeners.push({ el: tCp, event: "contextmenu", handler: () => {} });

          // Highlight color picker
          const bCp = row.createEl("input", { type: "color" });
          bCp.value =
            pair.backgroundColor && this.plugin.isValidHexColor(pair.backgroundColor)
              ? pair.backgroundColor
              : "#1d5010";
          bCp.style.width = "30px";
          bCp.style.height = "30px";
          bCp.style.border = "none";
          bCp.style.borderRadius = "var(--input-radius)";
          bCp.style.cursor = "pointer";
          bCp.style.flex = "0 0 auto";
          bCp.title = this.plugin.t("highlight_color_title", "Highlight Color");
          
          const bChange = async () => {
            const val = bCp.value;
            if (!this.plugin.isValidHexColor(val)) return;
            this.plugin.settings.quickColors[i].backgroundColor = val;
            await this.plugin.saveSettings();
          };
          bCp.addEventListener("input", bChange);

          // Right-clicking either picker opens the combined picker with both
          // text and highlight panels, prefilled with this pair's colors.
          const openCombinedPicker = () => {
            const modal = new ColorPickerModal(
              this.app,
              this.plugin,
              async (color, result) => {
                const newText =
                  result &&
                  result.textColor &&
                  this.plugin.isValidHexColor(result.textColor)
                    ? result.textColor
                    : null;
                const newBg =
                  result &&
                  result.backgroundColor &&
                  this.plugin.isValidHexColor(result.backgroundColor)
                    ? result.backgroundColor
                    : null;
                let changed = false;
                if (newText && this.plugin.isValidHexColor(newText)) {
                  tCp.value = newText;
                  this.plugin.settings.quickColors[i].textColor = newText;
                  changed = true;
                }
                if (newBg && this.plugin.isValidHexColor(newBg)) {
                  bCp.value = newBg;
                  this.plugin.settings.quickColors[i].backgroundColor = newBg;
                  changed = true;
                }
                if (changed) {
                  await this.plugin.saveSettings();
                  this._renderQuickColorsUI(container);
                }
              },
              "text-and-background",
              this.plugin.t("selected_text_preview", "Selected Text"),
            );
            modal._hideHeaderControls = true;
            modal._preFillTextColor = tCp.value;
            modal._preFillBgColor = bCp.value;
            modal._preFillBorderColor = bCp.value;
            modal.open();
          };

          bCp.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            openCombinedPicker();
          });
          this._eventListeners.push({ el: bCp, event: "contextmenu", handler: () => {} });

          // Delete button
          const delBtn = row.createDiv();
          setIcon(delBtn, "x");
          delBtn.style.cursor = "pointer";
          delBtn.style.flexShrink = "0";
          delBtn.style.display = "flex";
          delBtn.style.alignItems = "center";
          delBtn.style.color = "var(--text-muted)";
          
          const delHandler = async () => {
            this.plugin.settings.quickColors.splice(i, 1);
            await this.plugin.saveSettings();
            this._renderQuickColorsUI(container);
          };
          delBtn.addEventListener("click", delHandler);
          this._eventListeners.push({ el: delBtn, event: "click", handler: delHandler });

          // Full drag & drop reordering (the old handlers only recorded the
          // start point, so reordering never actually happened).
          this._setupDrag(row, dragHandle, listDiv, container, colors);
        });
      }

      // Add button row
      const btnRow = container.createDiv();
      btnRow.style.display = "flex";
      btnRow.style.justifyContent = "flex-end";
      btnRow.style.marginTop = "10px";
      
      const addBtn = btnRow.createEl("button", {
        text: this.plugin.t("btn_add_color", "+ Add Color"),
      });
      
      const addHandler = async () => {
        const newPair = {
          textColor: "#87c760",
          backgroundColor: "#1d5010",
          uid: Date.now().toString(36) + Math.random().toString(36).slice(2),
        };
        this.plugin.settings.quickColors.push(newPair);
        await this.plugin.saveSettings();
        this._renderQuickColorsUI(container);
      };
      addBtn.addEventListener("click", addHandler);
      this._eventListeners.push({ el: addBtn, event: "click", handler: addHandler });

    } catch (e) {
      debugError("QUICK_MENU_COLORS_MODAL", e);
    }
  }

  /**
   * Robust drag & drop reordering for one Quick Colors row. Same approach as
   * ReorderPresetsModal: a document-level (capture) mouse/touch listener pair,
   * a cloned ghost that follows the cursor, and an elementFromPoint hit test
   * that reorders both the DOM row and the `colors` array in lockstep.
   * On release the new order is written back to settings and re-rendered.
   */
  _setupDrag(row, dragHandle, listDiv, container, colors) {
    let dragStarted = false;
    let ghost = null;
    let sX = 0,
      sY = 0,
      oX = 0,
      oY = 0;

    const createGhost = () => {
      const rect = row.getBoundingClientRect();
      ghost = document.body.createDiv({ cls: "drag-reorder-ghost" });
      const clone = row.cloneNode(true);
      // cloneNode does not copy live input values — copy them across.
      const origInputs = row.querySelectorAll("input, select, textarea");
      const cloneInputs = clone.querySelectorAll("input, select, textarea");
      origInputs.forEach((el, idx) => {
        if (cloneInputs[idx]) cloneInputs[idx].value = el.value;
      });
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
      ghost.style.left = currentX - oX + "px";
      ghost.style.top = currentY - oY + "px";

      // Hide the ghost so the hit test reaches the row underneath it.
      ghost.style.display = "none";
      const from = document.elementFromPoint(currentX, currentY);
      ghost.style.display = "";

      let targetRow = from ? from.closest("div[data-qc-index]") : null;
      if (!targetRow || targetRow.parentNode !== listDiv) {
        // Fallback: match by geometry, so an overlay (or a pointer-events
        // quirk) can never silently swallow every swap.
        targetRow = null;
        const rows = listDiv.querySelectorAll("div[data-qc-index]");
        for (const r of rows) {
          const rect = r.getBoundingClientRect();
          if (
            currentX >= rect.left &&
            currentX <= rect.right &&
            currentY >= rect.top &&
            currentY <= rect.bottom
          ) {
            targetRow = r;
            break;
          }
        }
      }
      if (!targetRow || targetRow === row || targetRow.parentNode !== listDiv)
        return;

      const children = Array.from(listDiv.querySelectorAll("div[data-qc-index]"));
      const cur = children.indexOf(row);
      const tgt = children.indexOf(targetRow);
      if (cur === -1 || tgt === -1 || cur === tgt) return;

      if (navigator.vibrate) navigator.vibrate(30);
      if (cur < tgt) targetRow.after(row);
      else listDiv.insertBefore(row, targetRow);

      const item = colors.splice(cur, 1)[0];
      colors.splice(tgt, 0, item);
      Array.from(listDiv.querySelectorAll("div[data-qc-index]")).forEach(
        (r, idx) => r.setAttribute("data-qc-index", idx.toString()),
      );
    };

    const cleanupDrag = async () => {
      document.removeEventListener("mousemove", onDocMouseMove, { capture: true });
      document.removeEventListener("mouseup", onDocMouseUp, { capture: true });
      document.removeEventListener("touchmove", onDocTouchMove, { capture: true });
      document.removeEventListener("touchend", onDocTouchEnd, { capture: true });
      document.removeEventListener("touchcancel", onDocTouchEnd, { capture: true });
      document.body.classList.remove("act-dragging-active");
      dragHandle.style.cursor = "grab";
      if (ghost) {
        try {
          ghost.remove();
        } catch (_) {}
        ghost = null;
      }
      row.classList.remove("drag-ghost-hidden");
      if (dragStarted) {
        this.plugin.settings.quickColors = colors;
        try {
          await this.plugin.saveSettings();
        } catch (e) {
          debugError("QUICK_MENU_COLORS_MODAL", "save order failed", e);
        }
        this._renderQuickColorsUI(container);
      }
      dragStarted = false;
    };

    const onDocMouseMove = (e) => {
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
    const onDocMouseUp = () => {
      cleanupDrag();
    };

    const onDocTouchMove = (e) => {
      if (e.touches.length !== 1) return;
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
    const onDocTouchEnd = () => {
      cleanupDrag();
    };

    dragHandle.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      sX = e.clientX;
      sY = e.clientY;
      const rect = row.getBoundingClientRect();
      oX = e.clientX - rect.left;
      oY = e.clientY - rect.top;
      dragStarted = false;
      document.addEventListener("mousemove", onDocMouseMove, {
        passive: false,
        capture: true,
      });
      document.addEventListener("mouseup", onDocMouseUp, {
        passive: false,
        capture: true,
      });
    });
    dragHandle.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) return;
        e.preventDefault();
        e.stopPropagation();
        const t = e.touches[0];
        sX = t.clientX;
        sY = t.clientY;
        const rect = row.getBoundingClientRect();
        oX = t.clientX - rect.left;
        oY = t.clientY - rect.top;
        dragStarted = false;
        document.addEventListener("touchmove", onDocTouchMove, {
          passive: false,
          capture: true,
        });
        document.addEventListener("touchend", onDocTouchEnd, {
          passive: false,
          capture: true,
        });
        document.addEventListener("touchcancel", onDocTouchEnd, {
          passive: false,
          capture: true,
        });
      },
      { passive: false },
    );
  }

  onClose() {
    this._eventListeners.forEach(({ el, event, handler }) => {
      try {
        el.removeEventListener(event, handler);
      } catch (e) {}
    });
    this._eventListeners = [];
    this.contentEl.empty();
  }
}