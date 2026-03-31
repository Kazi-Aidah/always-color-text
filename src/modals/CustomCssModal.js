import { Modal } from 'obsidian';

export class CustomCssModal extends Modal {
  constructor(app, plugin, entry) {
    super(app);
    this.plugin = plugin;
    this.entry = entry;
    this._handlers = [];
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-custom-css-modal");
      this.modalEl.style.padding = "20px";
      this.modalEl.style.minWidth = "520px";
    } catch (e) {}
    const title = contentEl.createEl("h2", {
      text: this.plugin.t("custom_css_header", "Edit Custom CSS"),
    });
    title.style.margin = "0 0 12px 0";
    const info = contentEl.createDiv();
    info.style.marginBottom = "8px";
    info.textContent = this.plugin.t(
      "custom_css_instructions",
      "Enter CSS declarations.",
    );
    const box = contentEl.createDiv();
    box.style.border = "1px solid var(--background-modifier-border)";
    box.style.borderRadius = "4px";
    box.style.background = "var(--background-modifier-form-field)";
    const ta = box.createEl("textarea");
    ta.style.width = "100%";
    ta.style.height = "200px";
    ta.style.resize = "vertical";
    ta.style.border = "none";
    ta.style.outline = "none";
    ta.style.background = "transparent";
    ta.style.color = "var(--text-normal)";
    ta.style.padding = "8px";
    ta.style.boxSizing = "border-box";
    ta.placeholder =
      "font-family: 'fontname';\nfont-weight: 600;\nfont-size: 8px;";
    ta.value = String(this.entry?.customCss || "");
    const row = contentEl.createDiv();
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.marginTop = "12px";
    const saveBtn = row.createEl("button", {
      text: this.plugin.t("btn_save", "Save"),
    });
    saveBtn.addClass("mod-cta");
    const clearBtn = row.createEl("button", {
      text: this.plugin.t("btn_reset", "Reset"),
    });
    const save = async () => {
      const raw = String(ta.value || "");
      const sanitized = this.plugin.sanitizeCssDeclarations(raw);
      if (this.entry) this.entry.customCss = raw ? raw : undefined;
      await this.plugin.saveSettings();
      try {
        this.plugin.reconfigureEditorExtensions();
      } catch (_) {}
      try {
        this.plugin.forceRefreshAllEditors();
      } catch (_) {}
      try {
        this.plugin.forceRefreshAllReadingViews();
      } catch (_) {}
      this.close();
    };
    const clear = async () => {
      ta.value = "";
      if (this.entry) this.entry.customCss = undefined;
      await this.plugin.saveSettings();
      try {
        this.plugin.reconfigureEditorExtensions();
      } catch (_) {}
      try {
        this.plugin.forceRefreshAllEditors();
      } catch (_) {}
      try {
        this.plugin.forceRefreshAllReadingViews();
      } catch (_) {}
      this.close();
    };
    saveBtn.addEventListener("click", save);
    clearBtn.addEventListener("click", clear);
    this._handlers.push({ el: saveBtn, ev: "click", fn: save });
    this._handlers.push({ el: clearBtn, ev: "click", fn: clear });
  }
  onClose() {
    try {
      this._handlers?.forEach((h) => {
        try {
          h.el.removeEventListener(h.ev, h.fn);
        } catch (_) {}
      });
    } catch (_) {}
    this.contentEl.empty();
  }
}
