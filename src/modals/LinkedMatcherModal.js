import { Modal } from 'obsidian';

// Phase 1: prompts the user when an edited matcher is shared by other entries.
// "Update all N" propagates the style; "Only this entry" keeps the edit local.
export class LinkedMatcherModal extends Modal {
  constructor(app, plugin, others, onUpdateAll, onOnlyThis) {
    super(app);
    this.plugin = plugin;
    this.others = others || [];
    this.onUpdateAll = onUpdateAll;
    this.onOnlyThis = onOnlyThis;
    this._resolved = false;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass('act-modal');
    } catch (e) {}

    const n = this.others.length;
    contentEl.createEl('h2', {
      text: this.plugin.t('link_matchers_title', 'Linked matchers found'),
    });

    const p = contentEl.createEl('p');
    p.textContent = this.plugin.t(
      'link_matchers_msg',
      `This matcher is shared by ${n} other entries. Update them to match this one?`,
      { n }
    );

    const list = contentEl.createEl('ul');
    list.style.marginTop = '10px';
    for (const o of this.others.slice(0, 20)) {
      const li = list.createEl('li');
      li.textContent = `${o.entry.pattern || ''}  (${o.location})`;
    }
    if (this.others.length > 20) {
      contentEl.createEl('p', {
        text: this.plugin.t(
          'link_matchers_more',
          `…and ${this.others.length - 20} more`,
          { n: this.others.length - 20 }
        ),
      });
    }

    const btnRow = contentEl.createDiv();
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'flex-end';
    btnRow.style.gap = '10px';
    btnRow.style.marginTop = '20px';

    const onlyBtn = btnRow.createEl('button', {
      text: this.plugin.t('btn_only_this', 'Only this entry'),
    });
    onlyBtn.addEventListener('click', () => {
      this._finish('single');
    });

    const allBtn = btnRow.createEl('button', {
      text: this.plugin.t('btn_update_all', `Update all ${n}`, { n }),
    });
    allBtn.addClass('mod-warning');
    allBtn.addEventListener('click', () => {
      this._finish('all');
    });
  }

  _finish(choice) {
    if (this._resolved) return;
    this._resolved = true;
    try {
      if (choice === 'all') {
        this.onUpdateAll && this.onUpdateAll();
      } else {
        this.onOnlyThis && this.onOnlyThis();
      }
    } catch (e) {}
    this.close();
  }

  onClose() {
    // Resolve defensively so the awaiting save handler never hangs.
    if (!this._resolved) {
      this._resolved = true;
      try {
        this.onOnlyThis && this.onOnlyThis();
      } catch (e) {}
    }
    this.contentEl.empty();
  }
}
