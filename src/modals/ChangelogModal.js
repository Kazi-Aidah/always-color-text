import { Modal, Component, MarkdownRenderer } from 'obsidian';

export class ChangelogModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this._mdComp = null;
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.style.maxWidth = "900px";
      this.modalEl.style.width = "900px";
      this.modalEl.style.padding = "25px";
    } catch (e) {}

    // Header with title and link
    const header = contentEl.createEl("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.marginBottom = "0px";
    header.style.paddingBottom = "16px";
    header.style.borderBottom = "1px solid var(--divider-color)";

    const title = header.createEl("h2", {
      text: this.plugin.t("header_plugin_name", "Always Color Text"),
    });
    title.style.margin = "0";
    title.style.fontSize = "1.5em";
    title.style.fontWeight = "600";

    const link = header.createEl("a", {
      text: this.plugin.t("changelog_view_on_github", "View on GitHub"),
    });
    link.href = "https://github.com/Kazi-Aidah/always-color-text/releases";
    link.target = "_blank";
    link.style.fontSize = "0.9em";
    link.style.opacity = "0.8";
    link.style.transition = "opacity 0.2s";
    link.addEventListener("mouseenter", () => (link.style.opacity = "1"));
    link.addEventListener("mouseleave", () => (link.style.opacity = "0.8"));

    const body = contentEl.createDiv();
    body.style.maxHeight = "70vh";
    body.style.overflow = "auto";

    const loading = body.createEl("div", {
      text: this.plugin.t("changelog_loading", "Loading releases…"),
    });
    loading.style.opacity = "0.7";
    loading.style.fontSize = "0.95em";
    loading.style.marginTop = "12px";

    try {
      const rels = await this.plugin.fetchAllReleases();
      body.empty();
      if (!Array.isArray(rels) || rels.length === 0) {
        const noInfo = body.createEl("div", {
          text: this.plugin.t(
            "changelog_no_info",
            "No release information available.",
          ),
        });
        try {
          noInfo.style.marginTop = "12px";
        } catch (e) {}
        return;
      }
      rels.forEach(async (rel) => {
        const meta = body.createEl("div");
        meta.style.marginBottom = "6px";
        meta.style.borderBottom = "1px solid var(--divider-color)";
        const releaseName = meta.createEl("div", {
          text:
            rel.name ||
            rel.tag_name ||
            this.plugin.t("changelog_release", "Release"),
        });
        releaseName.style.fontSize = "2em";
        releaseName.style.fontWeight = "900";
        releaseName.style.marginTop = "12px";
        releaseName.style.marginBottom = "12px";
        releaseName.style.color = "var(--text-normal)";
        try {
          const dateRaw =
            rel.published_at || rel.created_at || rel.release_date || null;
          if (dateRaw) {
            const dt = new Date(dateRaw);
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            const formatted = `${dt.getFullYear()} ${monthNames[dt.getMonth()]} ${String(dt.getDate()).padStart(2, "0")}`;
            const dateEl = meta.createEl("div", { text: formatted });
            dateEl.style.display = "block";
            dateEl.style.opacity = "0.8";
            dateEl.style.fontSize = "0.9em";
            dateEl.style.marginTop = "-4px";
            dateEl.style.marginBottom = "16px";
          }
        } catch (_) {}
        const notes = body.createEl("div");
        notes.style.marginTop = "16px";
        notes.addClass("markdown-preview-view");
        notes.style.lineHeight = "1.6";
        notes.style.fontSize = "0.95em";
        try {
          notes.style.padding = "0 var(--file-margin)";
        } catch (e) {}
        const md = rel.body || this.plugin.t("changelog_no_notes", "No notes");
        try {
          if (!this._mdComp) {
            try {
              this._mdComp = new Component();
            } catch (e) {
              this._mdComp = null;
            }
          }
          await MarkdownRenderer.render(
            this.plugin.app,
            md,
            notes,
            "",
            this._mdComp || undefined,
          );
        } catch (e) {
          const preEl = notes.createEl("pre");
          preEl.style.whiteSpace = "pre-wrap";
          preEl.style.wordWrap = "break-word";
          preEl.style.backgroundColor = "var(--background-secondary)";
          preEl.style.padding = "12px";
          preEl.style.borderRadius = "4px";
          preEl.style.fontSize = "0.9em";
          preEl.style.lineHeight = "1.5";
          preEl.textContent = md;
        }
      });
    } catch (e) {
      body.empty();
      const failed = body.createEl("div", {
        text: this.plugin.t(
          "changelog_failed_to_load",
          "Failed to load release notes.",
        ),
      });
      try {
        failed.style.marginTop = "12px";
      } catch (e2) {}
    }
  }
  onClose() {
    try {
      if (this._mdComp && typeof this._mdComp.unload === "function") {
        this._mdComp.unload();
      }
    } catch (e) {}
    this._mdComp = null;
    try {
      this.contentEl.empty();
    } catch (e) {}
  }
}
