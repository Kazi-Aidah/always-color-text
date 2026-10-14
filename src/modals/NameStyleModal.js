import { Modal } from 'obsidian';
import { applyPresetPreviewStyle } from '../utils/presetPreview.js';

/**
 * Naming step for creating a styled object (a text style preset, or a word
 * group snapshotting an entry's style): type a name and watch that style
 * applied to the name live in the preview, then save.
 *
 * The preview text mirrors the name field, falling back to the placeholder
 * text when the field is empty, so the box always shows a styled sample.
 * Closing without saving (Cancel / Esc) creates nothing.
 *
 * Locale strings are supplied as (key, fallback) pairs so the caller fully
 * owns the wording: the title, the field label, and the placeholder/empty
 * preview text.
 */
export class NameStyleModal extends Modal {
  constructor(app, plugin, opts = {}) {
    super(app);
    this.plugin = plugin;
    this.styleObj = opts.styleObj || null;
    this.defaultName = typeof opts.defaultName === "string" ? opts.defaultName : "";
    this.onSave = typeof opts.onSave === "function" ? opts.onSave : null;
    this.titleKey = opts.titleKey || "name_style_title";
    this.titleFallback = opts.titleFallback || "Name";
    this.labelKey = opts.labelKey || "name_style_label";
    this.labelFallback = opts.labelFallback || "Name";
    this.placeholderKey = opts.placeholderKey || "name_style_placeholder";
    this.placeholderFallback = opts.placeholderFallback || "New";
    this._eventListeners = [];
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this._eventListeners = [];
    try {
      this.modalEl.addClass("act-modal");
    } catch (_) {}
    const t = (k, fb, params) => {
      try {
        return this.plugin.t(k, fb, params);
      } catch (_) {
        return fb;
      }
    };

    contentEl.createEl("h2", {
      text: t(this.titleKey, this.titleFallback),
    });

    const input = contentEl.createEl("input", { type: "text" });
    input.value = this.defaultName;
    input.placeholder = t(this.placeholderKey, this.placeholderFallback);
    input.setAttribute("aria-label", t(this.labelKey, this.labelFallback));
    input.style.width = "100%";
    input.style.display = "block";
    input.style.margin = "10px 0";

    // Preview box: same chrome as the preset grid, styled by the shared
    // renderer so what you type here looks like what the grid will show.
    const previewBox = contentEl.createDiv({ cls: "act-tsp-box" });
    const preview = previewBox.createDiv({ cls: "act-tsp-preview" });
    const renderPreview = () => {
      const text =
        String(input.value || "").trim() ||
        t(this.placeholderKey, this.placeholderFallback);
      try {
        applyPresetPreviewStyle(this.plugin, preview, this.styleObj, text);
      } catch (_) {}
    };
    const onInput = () => renderPreview();
    input.addEventListener("input", onInput);
    this._eventListeners.push({ el: input, event: "input", handler: onInput });
    renderPreview();

    const row = contentEl.createDiv();
    row.style.display = "flex";
    row.style.justifyContent = "flex-end";
    row.style.gap = "10px";
    row.style.marginTop = "16px";

    const cancelBtn = row.createEl("button", {
      text: t("btn_cancel", "Cancel"),
    });
    const onCancel = () => this.close();
    cancelBtn.addEventListener("click", onCancel);
    this._eventListeners.push({
      el: cancelBtn,
      event: "click",
      handler: onCancel,
    });

    const saveBtn = row.createEl("button", {
      text: t("save", "Save"),
      cls: "mod-cta",
    });
    const onSave = () => {
      const name = String(input.value || "").trim();
      // Run the save first, then close: close is always the last word, even
      // if the save work throws, so the dialog can never be left behind.
      try {
        if (this.onSave) this.onSave(name);
      } catch (_) {}
      try {
        this.close();
      } catch (_) {}
      // Safety net: Obsidian's close() detaches only when its internal open
      // flag agrees; if the dialog is somehow still attached (stale flag),
      // detach it directly so save always dismisses the dialog.
      try {
        if (this.containerEl && this.containerEl.isConnected) {
          this.containerEl.remove();
        }
      } catch (_) {}
      try {
        this.isOpen = false;
      } catch (_) {}
    };
    saveBtn.addEventListener("click", onSave);
    this._eventListeners.push({ el: saveBtn, event: "click", handler: onSave });

    const onKeydown = (e) => {
      if (e && e.key === "Enter") {
        e.preventDefault();
        onSave();
      }
    };
    input.addEventListener("keydown", onKeydown);
    this._eventListeners.push({
      el: input,
      event: "keydown",
      handler: onKeydown,
    });

    try {
      input.focus();
      input.select();
    } catch (_) {}
  }

  onClose() {
    this._eventListeners.forEach(({ el, event, handler }) => {
      try {
        el.removeEventListener(event, handler);
      } catch (_) {}
    });
    this._eventListeners = [];
    this.contentEl.empty();
  }
}