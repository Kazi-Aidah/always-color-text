import { Modal } from 'obsidian';

// Simple text-entry modal used to type a property value for a rule.
export class RuleValueModal extends Modal {
  constructor(app, plugin, initialValue, onChoose) {
    super(app);
    this.plugin = plugin;
    this.initialValue = initialValue || '';
    this.onChoose = onChoose;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass('act-modal');
    } catch (e) {}

    contentEl.createEl('h2', {
      text: this.plugin.t('rule_value_title', 'Property value'),
    });

    const input = contentEl.createEl('input', { type: 'text' });
    input.value = this.initialValue;
    input.placeholder = this.plugin.t('rule_value_placeholder', 'e.g. done');
    input.style.width = '100%';
    input.style.padding = '6px';
    input.style.boxSizing = 'border-box';
    input.style.marginBottom = '12px';

    const btnRow = contentEl.createDiv();
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'flex-end';
    btnRow.style.gap = '10px';

    const cancelBtn = btnRow.createEl('button', {
      text: this.plugin.t('btn_cancel', 'Cancel'),
    });
    cancelBtn.addEventListener('click', () => this.close());

    const okBtn = btnRow.createEl('button', {
      text: this.plugin.t('btn_ok', 'OK'),
    });
    okBtn.addClass('mod-warning');
    const submit = () => {
      try {
        this.onChoose && this.onChoose(input.value);
      } catch (e) {}
      this.close();
    };
    okBtn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });

    setTimeout(() => {
      try {
        input.focus();
      } catch (e) {}
    }, 30);
  }

  onClose() {
    this.contentEl.empty();
  }
}
