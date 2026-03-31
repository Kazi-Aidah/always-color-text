import { Modal } from 'obsidian';

export class AlertModal extends Modal {
  constructor(app, plugin, title, message, customAction) {
    super(app);
    this.plugin = plugin;
    this.title = title;
    this.message = message;
    this.customAction = customAction; // { text: string, callback: () => void }
    this._eventListeners = [];
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this._eventListeners = [];

    const h2 = contentEl.createEl("h2", { text: this.title });
    h2.style.marginTop = "0";
    try {
      h2.style.color = "var(--text-warning)";
    } catch (e) {}

    contentEl.createEl("p", { text: this.message });

    const buttonDiv = contentEl.createDiv();
    buttonDiv.style.display = "flex";
    buttonDiv.style.justifyContent = "flex-end";
    buttonDiv.style.marginTop = "20px";
    buttonDiv.style.gap = "10px";

    if (this.customAction) {
      const actionBtn = buttonDiv.createEl("button", {
        text: this.customAction.text,
      });
      actionBtn.addClass("mod-cta");
      const actionHandler = () => {
        this.close();
        if (this.customAction.callback) this.customAction.callback();
      };
      actionBtn.addEventListener("click", actionHandler);
      this._eventListeners.push({
        el: actionBtn,
        event: "click",
        handler: actionHandler,
      });
    }

    const okButton = buttonDiv.createEl("button", {
      text: this.plugin.t("btn_ok", "OK"),
    });
    if (!this.customAction) okButton.addClass("mod-cta");
    const okHandler = () => this.close();
    okButton.addEventListener("click", okHandler);
    this._eventListeners.push({
      el: okButton,
      event: "click",
      handler: okHandler,
    });
  }

  onClose() {
    this._eventListeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    this._eventListeners = [];
    this.contentEl.empty();
  }
}
