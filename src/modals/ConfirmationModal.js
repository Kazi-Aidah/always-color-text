import { Modal } from 'obsidian';

export class ConfirmationModal extends Modal {
  constructor(app, plugin, title, message, onConfirm) {
    super(app);
    this.plugin = plugin;
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this._eventListeners = []; // Track event listeners for cleanup
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this._eventListeners = []; // Reset listeners

    const h2 = contentEl.createEl("h2", { text: this.title });
    h2.style.marginTop = "0"; // Remove top margin
    contentEl.createEl("p", { text: this.message });

    const buttonDiv = contentEl.createDiv();
    buttonDiv.style.display = "flex";
    buttonDiv.style.justifyContent = "flex-end";
    buttonDiv.style.marginTop = "20px";
    buttonDiv.style.gap = "10px";

    const cancelButton = buttonDiv.createEl("button", {
      text: this.plugin.t("btn_cancel", "Cancel"),
    });
    const cancelHandler = () => this.close();
    cancelButton.addEventListener("click", cancelHandler);
    this._eventListeners.push({
      el: cancelButton,
      event: "click",
      handler: cancelHandler,
    });

    const confirmButton = buttonDiv.createEl("button", {
      text: this.plugin.t("btn_confirm", "Confirm"),
    });
    confirmButton.addClass("mod-warning");
    const confirmHandler = () => {
      this.onConfirm();
      this.close();
    };
    confirmButton.addEventListener("click", confirmHandler);
    this._eventListeners.push({
      el: confirmButton,
      event: "click",
      handler: confirmHandler,
    });
  }

  onClose() {
    // Properly clean up all event listeners before emptying
    this._eventListeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    this._eventListeners = [];

    // Now empty the content
    this.contentEl.empty();
  }
}
