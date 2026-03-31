import { FuzzySuggestModal } from 'obsidian';

export class SelectBlacklistGroupModal extends FuzzySuggestModal {
  constructor(app, plugin, onSelected) {
    super(app);
    this.plugin = plugin;
    this.onSelected = onSelected;
    this.setPlaceholder(
      this.plugin.t(
        "search_blacklist_groups_placeholder",
        "Search blacklist groups…",
      ),
    );
  }

  getItems() {
    const groups = Array.isArray(this.plugin.settings.blacklistEntryGroups)
      ? this.plugin.settings.blacklistEntryGroups
      : [];
    const items = groups.map((group) => ({
      group: group,
      label:
        group && group.name && String(group.name).trim().length > 0
          ? String(group.name)
          : "(unnamed group)",
    }));
    // Add Default option to send to main blacklist
    items.unshift({
      group: null,
      label: this.plugin.t("default"),
    });
    return items;
  }

  getItemText(item) {
    return String(item.label || "");
  }

  onChooseItem(item, evt) {
    if (evt && evt.button === 2) return; // Prevent right-click
    const actualItem = item.item || item;
    if (this.onSelected) {
      this.onSelected(actualItem.group);
    }
  }
}
