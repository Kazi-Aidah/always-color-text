import { FuzzySuggestModal, TFolder } from 'obsidian';

// Accessible picker for Inclusion/Exclusion rule targets.
// type: 'file' | 'folder' | 'tag' | 'property'.
// onChoose receives the selected value (vault path, folder path,
// tag with leading '#', or property key).
export class RulePickerModal extends FuzzySuggestModal {
  constructor(app, plugin, type, onChoose) {
    super(app);
    this.plugin = plugin;
    this.type = type;
    this.onChoose = onChoose;
  }

  getItems() {
    try {
      if (this.type === 'tag') {
        const mc = this.app.metadataCache;
        let tags = [];
        if (mc) {
          if (typeof mc.getAllTags === 'function') tags = mc.getAllTags();
          else if (typeof mc.getTags === 'function') tags = mc.getTags();
        }
        if (tags && !Array.isArray(tags)) tags = Object.keys(tags);
        return Array.from(new Set(tags.map((t) => String(t)))).sort();
      }
      if (this.type === 'property') {
        const cache = this.app.metadataCache;
        if (cache && typeof cache.getAllPropertyInfos === 'function') {
          return Object.keys(cache.getAllPropertyInfos()).sort();
        }
        return [];
      }
      const files =
        this.app.vault && typeof this.app.vault.getFiles === 'function'
          ? this.app.vault.getFiles()
          : [];
      if (this.type === 'folder') {
        const all =
          this.app.vault && typeof this.app.vault.getAllLoadedFiles === 'function'
            ? this.app.vault.getAllLoadedFiles()
            : [];
        return all
          .filter((f) => f instanceof TFolder && f.path)
          .map((f) => f.path)
          .sort();
      }
      // file
      return files.map((f) => f.path).sort();
    } catch (e) {
      return [];
    }
  }

  getItemText(item) {
    return item;
  }

  onChooseItem(item) {
    Promise.resolve(this.onChoose(item));
  }
}
