import { Modal } from 'obsidian';

export class PresetModal extends Modal {
  constructor(app, plugin, onChoose) {
    super(app);
    this.plugin = plugin;
    this.onChoose = onChoose;
    this._listeners = [];
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    // Add class to force styling via CSS
    this.modalEl.addClass("act-preset-modal");
    // Force wider modal - override Obsidian's default dialog width!!
    try {
      this.modalEl.style.maxWidth = "1200px !important";
      this.modalEl.style.width = "1200px !important";
    } catch (e) {}
    contentEl.style.maxWidth = "1200px !important";

    const presets = [
      {
        label: this.plugin.t("preset_bold", "Bold"),
        pattern: "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1",
        flags: "",
        examples: ["**bold**"],
        group: "markdown",
        isFormatting: true,
        targetElement: "strong",
      },
      {
        label: this.plugin.t("preset_italic", "Italic"),
        pattern: "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1",
        flags: "",
        examples: ["*italic*"],
        group: "markdown",
        isFormatting: true,
        targetElement: "em",
      },
      {
        label: this.plugin.t("preset_bold_italic", "Bold Italic"),
        pattern: "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1",
        flags: "",
        examples: ["***bold_italic***"],
        group: "markdown",
        isFormatting: true,
        targetElement: "strong-em",
      },
      {
        label: this.plugin.t("preset_all_headings", "All Headings (H1-H6)"),
        pattern: "^\\s*#{1,6}\\s+.*$",
        flags: "m",
        examples: [this.plugin.t("preset_example_heading", "# Heading")],
      },
      {
        label: this.plugin.t("preset_headings_h3", "Headings (H3)"),
        pattern: "^\\s*#{3}\\s+.*$",
        flags: "m",
        examples: [this.plugin.t("preset_example_heading_h3", "### Heading")],
        group: "markdown",
      },
      {
        label: this.plugin.t("preset_bullet_points", "Bullet Points"),
        pattern: "^\\s*[\\-\\*]\\s+.*$",
        flags: "m",
        examples: [this.plugin.t("preset_example_bullet", "- Bullet point")],
        group: "markdown",
      },
      {
        label: this.plugin.t("preset_numbered_lists", "Numbered Lists"),
        pattern: "^\\s*\\d+\\.\\s+.*$",
        flags: "m",
        examples: [this.plugin.t("preset_example_numbered", "1. First item")],
        group: "markdown",
      },
      {
        label: this.plugin.t("preset_task_checked", "Task List (Checked)"),
        pattern: "^\\s*[\\-\\*]\\s+\\[[xX]\\]\\s+.*$",
        flags: "m",
        examples: [
          this.plugin.t("preset_example_task_checked", "- [x] Completed"),
        ],
        group: "markdown",
      },
      {
        label: this.plugin.t("preset_task_unchecked", "Task List (Unchecked)"),
        pattern: "^\\s*[\\-\\*]\\s+\\[\\s\\]\\s+.*$",
        flags: "m",
        examples: [
          this.plugin.t("preset_example_task_unchecked", "- [ ] Todo"),
        ],
        group: "markdown",
      },
      {
        label: this.plugin.t("preset_codeblocks", "Codeblocks"),
        pattern: "```[\\s\\S]*?```",
        flags: "",
        examples: [this.plugin.t("preset_example_codeblock", "``` code ```")],
        group: "markdown",
      },
      {
        label: this.plugin.t("preset_dates_yyyy_mm_dd", "Dates (YYYY-MM-DD)"),
        pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_date_iso", "2009-01-19")],
      },
      {
        label: this.plugin.t("preset_dates_yyyy_mmm_dd", "Dates (YYYY-MMM-DD)"),
        pattern:
          "\\b\\d{4}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\\d{2}\\b",
        flags: "i",
        examples: [this.plugin.t("preset_example_date_text", "2025-Jan-19")],
      },
      {
        label: this.plugin.t("preset_times_am_pm", "Times (AM/PM)"),
        pattern: "(?:1[0-2]|0?[1-9]):[0-5][0-9](?:am|pm)",
        flags: "i",
        examples: [this.plugin.t("preset_example_time_ampm", "9:05pm")],
      },
      {
        label: this.plugin.t("preset_times_short_am_pm", "Times (2pm, 10pm)"),
        pattern: "(?:1[0-2]|0?[1-9])(?:\\s?[ap]m)",
        flags: "i",
        examples: [
          this.plugin.t("preset_example_time_short_ampm", "2pm, 10pm"),
        ],
      },
      {
        label: this.plugin.t("preset_times_24h", "Times (24h)"),
        pattern: "\\b(?:[01]\\d|2[0-3]):[0-5]\\d\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_time_24h", "13:00")],
      },
      {
        label: this.plugin.t("preset_relative_dates", "Relative dates"),
        pattern: "\\b(?:today|tomorrow|yesterday|next week|last week)\\b",
        flags: "i",
        examples: [this.plugin.t("preset_example_relative", "today, tomorrow")],
      },
      {
        label: this.plugin.t("preset_basic_urls", "Basic URLs"),
        pattern: "\\bhttps?://\\S+\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_url", "https://example.com")],
        group: "markdown",
      },
      {
        label: this.plugin.t("preset_markdown_links", "Markdown links"),
        pattern: "\\[[^\\]]+\\]\\(https?://[^)]+\\)",
        flags: "",
        examples: [
          this.plugin.t(
            "preset_example_markdown_link",
            "[Link](https://example.com)",
          ),
        ],
        group: "markdown",
      },
      {
        label: this.plugin.t("preset_inline_comments", "Comments (%%…%%)"),
        pattern: "%%\\s*[\\s\\S]*?\\s*%%",
        flags: "s",
        examples: [this.plugin.t("preset_example_comment", "%% comment %%")],
        group: "markdown",
      },
      {
        label: this.plugin.t(
          "preset_highlighted_text",
          "Highlighted Text (==...)",
        ),
        pattern: "==[\\s\\S]*?==",
        flags: "s",
        examples: [
          this.plugin.t("preset_example_highlight", "==highlighted text=="),
        ],
        group: "markdown",
        affectMarkElements: true,
      },
      {
        label: this.plugin.t("preset_domain_names", "Domain names"),
        pattern: "\\b[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_domain", "example.com")],
      },
      {
        label: this.plugin.t("preset_email_addresses", "Email addresses"),
        pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_email", "name@example.com")],
      },
      {
        label: this.plugin.t("preset_at_username", "@username"),
        pattern: "@[a-zA-Z0-9_]+",
        flags: "",
        examples: [this.plugin.t("preset_example_username", "@username")],
      },
      {
        label: this.plugin.t("preset_currency", "Currency"),
        pattern: "\\$\\d+(?:\\.\\d{2})?|\\b[€£¥]\\d+(?:\\.\\d{2})?\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_currency", "$29.99")],
      },
      {
        label: this.plugin.t("preset_measurements", "Measurements"),
        pattern: "\\b\\d+(?:\\.\\d+)?(?:kg|cm|m|km|°C|°F|lbs)\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_measurement", "25kg")],
      },
      {
        label: this.plugin.t("preset_phone_numbers", "Phone numbers"),
        pattern: "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_phone", "123-456-7890")],
      },
      {
        label: this.plugin.t("preset_parentheses", "Parentheses ()"),
        pattern: "\\(([^)]*)\\)",
        flags: "g",
        examples: [this.plugin.t("preset_example_parentheses", "( text )")],
        group: "brackets",
      },
      {
        label: this.plugin.t("preset_square_brackets", "Square Brackets []"),
        pattern: "\\[([^\\]]*)\\]",
        flags: "g",
        examples: [this.plugin.t("preset_example_square_brackets", "[ yes ]")],
        group: "brackets",
        disableRegexSafety: true,
      },
      {
        label: this.plugin.t("preset_curly_braces", "Curly Braces {}"),
        pattern: "\\{([^}]*)\\}",
        flags: "g",
        examples: [this.plugin.t("preset_example_curly_braces", "{ no }")],
        group: "brackets",
      },
      {
        label: this.plugin.t("preset_angle_brackets", "Angle Brackets <>"),
        pattern: "<([^>]*)>",
        flags: "g",
        examples: [this.plugin.t("preset_example_angle_brackets", "< text >")],
        group: "brackets",
      },
      {
        label: this.plugin.t("preset_colons", "Colons :"),
        pattern: ":([^:]*):",
        flags: "g",
        examples: [this.plugin.t("preset_example_colons", ": text :")],
        group: "brackets",
      },
      {
        label: this.plugin.t("preset_double_quotes", 'Double Quotes ""'),
        pattern: '"[^"]*"',
        flags: "",
        examples: [this.plugin.t("preset_example_double_quotes", '"text"')],
        group: "brackets",
        disableRegexSafety: true,
      },
      {
        label: this.plugin.t("preset_single_quotes", "Single Quotes ''"),
        pattern: "'[^'\\r\\n]*'",
        flags: "",
        examples: [this.plugin.t("preset_example_single_quotes", "'text'")],
        group: "brackets",
        disableRegexSafety: true,
      },
      {
        label: this.plugin.t(
          "preset_single_quotes_word_bounded",
          "Single Quotes '' (word-bounded)",
        ),
        pattern: "'\\b[^'\\r\\n]*\\b'",
        flags: "",
        examples: [
          this.plugin.t("preset_example_single_quotes_word", "'word'"),
        ],
        group: "brackets",
        disableRegexSafety: true,
      },
      {
        label: this.plugin.t("preset_all_texts", "All texts"),
        pattern: ".+",
        flags: "",
        examples: [
          this.plugin.t(
            "preset_example_all_text",
            "This will target all texts.",
          ),
        ],
        group: "markdown",
      },
    ];

    // Separate presets into three groups
    const formattingPresets = presets.filter((p) => p.isFormatting);
    const markdownPresets = presets.filter(
      (p) =>
        (p.group === "markdown" ||
          [
            this.plugin.t("preset_all_headings", "All Headings (H1-H6)"),
          ].includes(p.label)) &&
        !p.isFormatting,
    );
    const bracketPresets = presets.filter((p) => p.group === "brackets");
    const otherPresets = presets.filter(
      (p) =>
        !markdownPresets.includes(p) &&
        !bracketPresets.includes(p) &&
        !formattingPresets.includes(p),
    );

    // Create three-column container
    const container = contentEl.createDiv();
    container.style.display = "grid";
    container.style.gridTemplateColumns = "1fr 1fr 1fr";
    container.style.gap = "12px";
    container.style.maxWidth = "100%";

    // Add responsive styles
    const mediaRule = `
      @media (max-width: 1024px) {
        .preset-columns { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
      }
      @media (max-width: 600px) {
        .preset-columns { grid-template-columns: 1fr !important; gap: 8px !important; }
      }
    `;
    const style = document.createElement("style");
    style.textContent = mediaRule;
    document.head.appendChild(style);

    container.className = "preset-columns";

    // Left column: Markdown presets
    const leftCol = container.createDiv();
    const leftTitle = leftCol.createEl("h3", {
      text: this.plugin.t(
        "preset_group_markdown_formatting",
        "Markdown Formatting",
      ),
    });
    leftTitle.style.marginTop = "0";
    leftTitle.style.marginBottom = "12px";
    leftTitle.style.fontSize = "14px";
    leftTitle.style.fontWeight = "600";
    leftTitle.style.opacity = "0.8";

    const leftList = leftCol.createDiv();

    if (formattingPresets.length > 0) {
      const row = leftList.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";

      formattingPresets.forEach((p) => {
        const btn = row.createEl("button", { text: p.label });
        btn.style.fontSize = "12px";
        btn.style.padding = "6px 10px";
        btn.style.flex = "1";
        btn.title = p.examples && p.examples[0] ? p.examples[0] : "";

        const handler = () => {
          try {
            this.onChoose && this.onChoose(p);
          } finally {
            this.close();
          }
        };
        btn.addEventListener("click", handler);
        this._listeners.push({ el: btn, h: handler });
      });
    }

    markdownPresets.forEach((p) => {
      const row = leftList.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";
      const btn = row.createEl("button", { text: p.label });
      btn.style.fontSize = "12px";
      btn.style.padding = "6px 10px";
      const infoDiv = row.createDiv();
      infoDiv.style.flex = "1";
      infoDiv.style.display = "flex";
      infoDiv.style.flexDirection = "column";
      infoDiv.style.gap = "2px";
      const sample = infoDiv.createEl("span", {
        text: p.examples && p.examples[0] ? p.examples[0] : "",
      });
      sample.style.opacity = "0.7";
      sample.style.fontSize = "11px";
      if (p.disableRegexSafety) {
        const badge = infoDiv.createEl("span", {
          text: this.plugin.t(
            "requires_regex_safety_disabled",
            "Requires regex safety disabled",
          ),
        });
        badge.style.opacity = "0.6";
        badge.style.fontSize = "10px";
        badge.style.color = "var(--text-warning)";
      }
      const handler = () => {
        try {
          this.onChoose && this.onChoose(p);
        } finally {
          this.close();
        }
      };
      btn.addEventListener("click", handler);
      this._listeners.push({ el: btn, h: handler });
    });

    // Right column: Other presets
    const rightCol = container.createDiv();
    const rightTitle = rightCol.createEl("h3", {
      text: this.plugin.t("preset_group_other_patterns", "Other Patterns"),
    });
    rightTitle.style.marginTop = "0";
    rightTitle.style.marginBottom = "12px";
    rightTitle.style.fontSize = "14px";
    rightTitle.style.fontWeight = "600";
    rightTitle.style.opacity = "0.8";

    const rightList = rightCol.createDiv();
    otherPresets.forEach((p) => {
      const row = rightList.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";
      const btn = row.createEl("button", { text: p.label });
      btn.style.fontSize = "12px";
      btn.style.padding = "6px 10px";
      const infoDiv = row.createDiv();
      infoDiv.style.flex = "1";
      infoDiv.style.display = "flex";
      infoDiv.style.flexDirection = "column";
      infoDiv.style.gap = "2px";
      const sample = infoDiv.createEl("span", {
        text: p.examples && p.examples[0] ? p.examples[0] : "",
      });
      sample.style.opacity = "0.7";
      sample.style.fontSize = "11px";
      if (p.disableRegexSafety) {
        const badge = infoDiv.createEl("span", {
          text: this.plugin.t(
            "requires_regex_safety_disabled",
            "Requires regex safety disabled",
          ),
        });
        badge.style.opacity = "0.6";
        badge.style.fontSize = "10px";
        badge.style.color = "var(--text-warning)";
      }
      const handler = () => {
        try {
          this.onChoose && this.onChoose(p);
        } finally {
          this.close();
        }
      };
      btn.addEventListener("click", handler);
      this._listeners.push({ el: btn, h: handler });
    });

    // Middle column: Bracket presets
    const middleCol = container.createDiv();
    const middleTitle = middleCol.createEl("h3", {
      text: this.plugin.t("preset_group_brackets", "Brackets"),
    });
    middleTitle.style.marginTop = "0";
    middleTitle.style.marginBottom = "12px";
    middleTitle.style.fontSize = "14px";
    middleTitle.style.fontWeight = "600";
    middleTitle.style.opacity = "0.8";

    const middleList = middleCol.createDiv();
    bracketPresets.forEach((p) => {
      const row = middleList.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";
      const btn = row.createEl("button", { text: p.label });
      btn.style.fontSize = "12px";
      btn.style.padding = "6px 10px";
      const infoDiv = row.createDiv();
      infoDiv.style.flex = "1";
      infoDiv.style.display = "flex";
      infoDiv.style.flexDirection = "column";
      infoDiv.style.gap = "2px";
      const sample = infoDiv.createEl("span", {
        text: p.examples && p.examples[0] ? p.examples[0] : "",
      });
      sample.style.opacity = "0.7";
      sample.style.fontSize = "11px";
      if (p.disableRegexSafety) {
        const badge = infoDiv.createEl("span", {
          text: this.plugin.t(
            "requires_regex_safety_disabled",
            "Requires regex safety disabled",
          ),
        });
        badge.style.opacity = "0.6";
        badge.style.fontSize = "10px";
        badge.style.color = "var(--text-warning)";
      }
      const handler = () => {
        try {
          this.onChoose && this.onChoose(p);
        } finally {
          this.close();
        }
      };
      btn.addEventListener("click", handler);
      this._listeners.push({ el: btn, h: handler });
    });
  }
  onClose() {
    this._listeners.forEach((x) => {
      try {
        x.el.removeEventListener("click", x.h);
      } catch (e) {}
    });
    this._listeners = [];
    this.contentEl.empty();
  }
}
