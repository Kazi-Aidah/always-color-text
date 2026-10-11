import { Modal } from 'obsidian';
import {
  MARKDOWN_TARGETS as TARGETS,
  MARKDOWN_TARGET_GROUPS as GROUPS,
  getMarkdownTarget,
} from '../utils/markdownTargets.js';
import {
  createMarkdownElementConfigInput,
  getElementConfig,
  normalizeHighlightColor,
  normalizeTitleMatchType,
  DEFAULT_HIGHLIGHT_COLOR,
} from '../utils/markdownElementConfig.js';

// Picker used by the "+ Add entry" menu when the user chooses
// "Markdown element". Shows the same grouped element list as the row
// dropdown, plus the element's own config input underneath (heading levels,
// task types, tag filter, title filter + match mode, highlight color, …),
// re-rendered every time the selection changes — mirroring the row and
// Style Target editing surfaces. Confirm hands the chosen target key AND the
// picked config to the caller (`onSelect(key, config)`) so each context can
// finish the flow its own way (color picker for colored lists, direct add
// for blacklists).
export class MarkdownElementSelectModal extends Modal {
  constructor(app, plugin, onSelect, opts) {
    super(app);
    this.plugin = plugin;
    this.onSelect = onSelect;
    this._opts = opts || {};
    this._initialKey = this._opts.initialKey || 'strong';
    // Draft entry the config input mutates in place (the same object
    // createMarkdownElementConfigInput writes into on every keystroke), so
    // whatever is on screen at confirm time is what gets handed over.
    this._draft = { targetElement: this._initialKey };
  }

  // Snapshot of the draft for the given element, with element defaults filled
  // in for anything the user never touched (an untouched input still shows
  // its default, and that is what the entry must store).
  _collectConfig(key) {
    const out = {};
    try {
      const cfg = getElementConfig(key);
      if (cfg) {
        out[cfg.field] =
          this._draft[cfg.field] != null
            ? this._draft[cfg.field]
            : cfg.defaultValue;
        if (cfg.matchField) {
          const raw =
            this._draft[cfg.matchField] != null
              ? this._draft[cfg.matchField]
              : 'contains';
          try {
            out[cfg.matchField] = normalizeTitleMatchType(raw);
          } catch (_) {
            out[cfg.matchField] = 'contains';
          }
        }
      }
    } catch (_) {}
    if (key === 'highlight-color') {
      out.highlightColor =
        normalizeHighlightColor(this._draft.highlightColor) ||
        DEFAULT_HIGHLIGHT_COLOR;
    }
    return out;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass('act-modal');
      this.modalEl.addClass('act-markdown-element-select-modal');
    } catch (_) {}

    contentEl.createEl('h2', {
      text: this.plugin.t(
        'markdown_picker_title',
        'Choose markdown element',
      ),
    }).style.marginTop = '0';

    contentEl.createEl('p', {
      text: this.plugin.t(
        'markdown_picker_desc',
        'Pick which markdown element this entry should match.',
      ),
    });

    const select = contentEl.createEl('select');
    select.style.width = '100%';
    select.style.padding = '6px 10px';
    select.style.borderRadius = 'var(--input-radius)';

    GROUPS.forEach((grp) => {
      const targets = TARGETS.filter((t) => t.group === grp.key);
      if (!targets.length) return;
      const og = document.createElement('optgroup');
      og.label = this.plugin.t(grp.labelKey, grp.label);
      og.style.backgroundColor = 'hsla(var(--interactive-accent-hsl), 0.5)';
      targets.forEach((t) => {
        const opt = document.createElement('option');
        opt.value = t.key;
        opt.textContent = this.plugin.t(t.labelKey, t.label);
        // Options inherit their optgroup's background natively, so they must
        // be pinned back to the neutral surface — otherwise the heading color
        // bleeds onto every option and only the headings should carry it.
        opt.style.backgroundColor = 'var(--background-modifier-form-field)';
        if (t.key === this._initialKey) opt.selected = true;
        og.appendChild(opt);
      });
      select.appendChild(og);
    });
    if (!getMarkdownTarget(select.value)) {
      select.value = 'strong';
    }
    this._draft.targetElement = select.value || 'strong';

    // Per-element config (heading levels, task types, tag/title filters +
    // match mode, highlight color). Rebuilt on every selection change so the
    // visible inputs always belong to the chosen element. Flex layout (like
    // the entry rows) so the single config input/select stretches full width.
    const configWrap = contentEl.createDiv();
    configWrap.style.marginTop = '12px';
    configWrap.style.display = 'flex';
    configWrap.style.alignItems = 'center';
    configWrap.style.gap = '8px';
    configWrap.style.width = '100%';
    configWrap.style.boxSizing = 'border-box';
    const renderConfig = () => {
      try {
        const key = select.value || 'strong';
        this._draft.targetElement = key;
        configWrap.empty();
        const input = createMarkdownElementConfigInput(
          this.plugin,
          this._draft,
          null,
        );
        if (input) configWrap.appendChild(input);
        configWrap.style.display = input ? 'flex' : 'none';
      } catch (_) {}
    };
    select.addEventListener('change', renderConfig);
    renderConfig();

    const footer = contentEl.createDiv();
    footer.style.display = 'flex';
    footer.style.justifyContent = 'flex-end';
    footer.style.gap = '8px';
    footer.style.marginTop = '16px';

    const cancelBtn = footer.createEl('button', {
      text: this.plugin.t('btn_cancel', 'Cancel'),
    });
    cancelBtn.addEventListener('click', () => this.close());

    const confirmBtn = footer.createEl('button', {
      text:
        this._opts.confirmLabel ||
        this.plugin.t('btn_choose', 'Choose'),
    });
    confirmBtn.addClass('mod-cta');
    confirmBtn.addEventListener('click', () => {
      const key = select.value || 'strong';
      const config = this._collectConfig(key);
      this.close();
      try {
        if (typeof this.onSelect === 'function') this.onSelect(key, config);
      } catch (_) {}
    });
  }

  onClose() {
    try {
      this.contentEl.empty();
    } catch (_) {}
  }
}
