import { FuzzySuggestModal } from 'obsidian';

// Disambiguation picker shown when a selection is colored by more than one
// entry (e.g. a literal word AND a regex, or overlapping regexes). Lets the
// user open the pick-color modal for the entry that really colors the text,
// or fall back to creating a brand-new entry.
export class SelectColoringEntryModal extends FuzzySuggestModal {
  constructor(app, plugin, selectedText, candidates, onChoose) {
    super(app);
    this.plugin = plugin;
    this.selectedText = String(selectedText || '');
    this.candidates = Array.isArray(candidates) ? candidates : [];
    this.onChoose = onChoose;
    try {
      this.setPlaceholder('Pick the rule that colors this text…');
    } catch (_) {}
  }

  _labelFor(c) {
    try {
      const e = c?.entry || {};
      const loc = c?.groupName ? ` — ${c.groupName}` : '';
      if (e.targetElement) {
        const kind = this.plugin?.t ? this.plugin.t('kind_markdown', 'Markdown') : 'Markdown';
        return `${kind}: ${e.targetElement}${loc}  ·  ${c.kind || ''}`;
      }
      if (e.isRegex) return `Regex: ${e.pattern || ''}${loc}`;
      return `Text: ${e.pattern || ''}${loc}`;
    } catch (_) {
      return 'Entry';
    }
  }

  getItems() {
    // Extra sentinel for "create new" appended after real candidates.
    return [...this.candidates, { __createNew: true }];
  }

  getItemText(item) {
    try {
      if (item && item.__createNew) {
        const t = this.plugin?.t
          ? this.plugin.t('create_new_entry_for', 'Create new entry for "{word}"', { word: this.selectedText })
          : `Create new entry for "${this.selectedText}"`;
        return typeof t === 'string' ? t : `Create new entry for "${this.selectedText}"`;
      }
      return this._labelFor(item);
    } catch (_) {
      return 'Entry';
    }
  }

  onChooseItem(item) {
    try {
      if (item && item.__createNew) {
        this.onChoose && this.onChoose(null);
      } else {
        this.onChoose && this.onChoose(item || null);
      }
    } catch (_) {}
  }
}
