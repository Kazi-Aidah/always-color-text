import { Modal, setIcon } from "obsidian";

export class CommandVisibilityModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass("act-command-visibility-modal");
      this.modalEl.style.maxWidth = "640px";
    } catch (e) {}

    const title = contentEl.createEl("h2", {
      text: this.plugin.t("display_commands", "Display Commands"),
    });
    title.style.margin = "0";

    const desc = contentEl.createEl("p", {
      text: this.plugin.t(
        "display_commands_desc",
        "Choose which plugin commands are visible in the command palette.",
      ),
    });
    desc.style.marginTop = "4px";
    desc.style.opacity = "0.7";
    desc.style.marginBottom = "8px";

    const pluginId =
      (this.plugin.manifest && this.plugin.manifest.id) || "always-color-text";
    const getHidden = () =>
      Array.isArray(this.plugin.settings.hiddenCommands)
        ? this.plugin.settings.hiddenCommands
        : [];
    const isHidden = (fullId) => getHidden().includes(fullId);

    const list = contentEl.createDiv();
    list.style.marginTop = "8px";
    list.style.maxHeight = "62vh";
    list.style.overflowY = "auto";

    let commands = [];
    try {
      const all = this.app.commands.listCommands();
      commands = (all || [])
        .filter(
          (c) =>
            c && typeof c.id === "string" && c.id.startsWith(pluginId + ":"),
        )
        .sort((a, b) => String(a.name).localeCompare(String(b.name)));
    } catch (e) {}

    if (commands.length === 0) {
      list.createEl("p", {
        text: this.plugin.t("no_commands", "No commands available."),
      });
      return;
    }

    commands.forEach((cmd) => {
      const row = list.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.gap = "8px";
      row.style.padding = "6px 4px";
      row.style.borderBottom =
        "1px solid var(--background-modifier-border)";

      let label = String(cmd.name || cmd.id);
      const pluginName =
        (this.plugin.manifest && this.plugin.manifest.name) || "";
      if (pluginName && label.startsWith(pluginName + ":")) {
        label = label.slice(pluginName.length + 1).trim();
      }

      row.createEl("span", { text: label });

      const btn = row.createEl("button", {
        cls: "act-cmd-eye-btn",
      });
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.minWidth = "30px";
      btn.style.minHeight = "30px";

      const render = (hiddenState) => {
        btn.empty();
        setIcon(btn, hiddenState ? "eye-off" : "eye");
        btn.style.backgroundColor = hiddenState
          ? "color-mix(in srgb, var(--color-red) 25%, transparent)"
          : "color-mix(in srgb, var(--color-green) 25%, transparent)";
        btn.style.color = hiddenState
          ? "var(--color-red)"
          : "var(--color-green)";
        btn.setAttribute(
          "aria-label",
          hiddenState
            ? this.plugin.t("command_hidden", "Hidden from palette")
            : this.plugin.t("command_visible", "Visible in palette"),
        );
      };
      render(isHidden(cmd.id));

      btn.addEventListener("click", () => {
        const arr = getHidden().slice();
        const idx = arr.indexOf(cmd.id);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(cmd.id);
        this.plugin.settings.hiddenCommands = arr;
        this.plugin.saveSettings();
        render(arr.includes(cmd.id));
        try {
          this.plugin.reregisterCommandsWithLanguage();
        } catch (_) {}
      });
    });
  }

  onClose() {
    try {
      this.contentEl.empty();
    } catch (_) {}
  }
}
