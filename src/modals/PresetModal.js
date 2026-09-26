import { Modal, Setting, moment } from 'obsidian';
import {
  DEFAULT_DATE_TIME_FORMAT,
  evaluateDateTimeFormat,
} from '../utils/momentFormat.js';
import { getEntryDateTimeFormat } from '../utils/entryDateTimeFormat.js';

// moment.js displaying/format docs — the "format reference" link in the step.
const DATE_TIME_DOCS_URL = "https://momentjs.com/docs/#/displaying/format/";

export class PresetModal extends Modal {
  constructor(app, plugin, onChoose, opts) {
    super(app);
    this.plugin = plugin;
    this.onChoose = onChoose;
    this._opts = opts || {};
    this._listeners = [];
    this._pendingFormat =
      (this._opts.startWithFormat && this._opts.initialFormat) ||
      DEFAULT_DATE_TIME_FORMAT;
  }
  /**
   * Open only the Time & Date format step for an EXISTING entry — the format
   * buttons in the entry rows use this so users edit the moment.js format and
   * never see the generated regex. `onSaved(entry)` persists/recompiles.
   */
  static openForDateTimeFormat(app, plugin, entry, onSaved) {
    const modal = new PresetModal(
      app,
      plugin,
      async (preset) => {
        if (!preset) return;
        entry.pattern = preset.pattern;
        entry.flags = preset.flags || "";
        entry.presetLabel = preset.label;
        if (preset.dateTimeFormat) entry.dateTimeFormat = preset.dateTimeFormat;
        else delete entry.dateTimeFormat;
        try {
          if (typeof onSaved === "function") await onSaved(entry);
        } catch (e) {}
      },
      {
        startWithFormat: true,
        initialFormat: getEntryDateTimeFormat(entry, plugin),
      },
    );
    modal.open();
    return modal;
  }
  onOpen() {
    const { contentEl } = this;
    this._clearListeners();
    contentEl.empty();
    // Add class to force styling via CSS
    this.modalEl.addClass("act-modal");
    this.modalEl.addClass("act-preset-modal");
    // Force wider modal - override Obsidian's default dialog width!!
    try {
      this.modalEl.style.maxWidth = "1200px !important";
      this.modalEl.style.width = "1200px !important";
    } catch (e) {}
    contentEl.style.maxWidth = "1200px !important";

    // "Edit format" mode: opened from an entry's format button to re-edit its
    // moment.js format — skip the preset list entirely.
    if (this._opts.startWithFormat) {
      this._showFormatStep({
        label: this.plugin.t("preset_time_date", "Time & Date"),
        needsFormat: true,
      });
      return;
    }

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
        group: "markdown",
        targetElement: "heading",
      },
      {
        label: this.plugin.t("preset_bullet_points", "Bullet Points"),
        pattern: "^\\s*[\\-\\*]\\s+.*$",
        flags: "m",
        examples: [this.plugin.t("preset_example_bullet", "- Bullet point")],
        group: "markdown",
        targetElement: "bullet-list",
      },
      {
        label: this.plugin.t("preset_numbered_lists", "Numbered Lists"),
        pattern: "^\\s*\\d+\\.\\s+.*$",
        flags: "m",
        examples: [this.plugin.t("preset_example_numbered", "1. First item")],
        group: "markdown",
        targetElement: "numbered-list",
      },
      {
        label: this.plugin.t("preset_task_checked", "Task List (Checked)"),
        pattern: "^\\s*[\\-\\*]\\s+\\[[xX]\\]\\s+.*$",
        flags: "m",
        examples: [
          this.plugin.t("preset_example_task_checked", "- [x] Completed"),
        ],
        group: "markdown",
        targetElement: "task-list",
      },
      {
        label: this.plugin.t("preset_task_unchecked", "Task List (Unchecked)"),
        pattern: "^\\s*[\\-\\*]\\s+\\[\\s\\]\\s+.*$",
        flags: "m",
        examples: [
          this.plugin.t("preset_example_task_unchecked", "- [ ] Todo"),
        ],
        group: "markdown",
        targetElement: "task-list",
      },
      {
        label: this.plugin.t("preset_codeblocks", "Codeblocks"),
        pattern: "```[\\s\\S]*?```",
        flags: "",
        examples: [this.plugin.t("preset_example_codeblock", "``` code ```")],
        group: "markdown",
        targetElement: "codeblock",
      },
      {
        label: this.plugin.t("preset_time_date", "Time & Date"),
        pattern: "",
        flags: "",
        examples: [
          this.plugin.t(
            "preset_example_time_date",
            "Any moment.js format (hh:mm a, D MMMM Y)",
          ),
        ],
        // Opens the format step instead of choosing immediately: the pattern
        // is built from whatever format the user types.
        needsFormat: true,
      },
      {
        label: this.plugin.t("preset_basic_urls", "Basic URLs"),
        pattern: "\\bhttps?://\\S+\\b",
        flags: "",
        examples: [this.plugin.t("preset_example_url", "https://example.com")],
        group: "markdown",
        targetElement: "external-link",
      },
      {
        label: this.plugin.t("preset_internal_link", "Internal Link ([[note]])"),
        pattern: "\\[\\[[^\\]]+\\]\\]",
        flags: "",
        examples: [this.plugin.t("preset_example_internal_link", "[[My Note]]")],
        group: "markdown",
        targetElement: "internal-link",
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
        targetElement: "external-link",
      },
      {
        label: this.plugin.t("preset_inline_comments", "Comments (%%…%%)"),
        pattern: "%%\\s*[\\s\\S]*?\\s*%%",
        flags: "s",
        examples: [this.plugin.t("preset_example_comment", "%% comment %%")],
        group: "markdown",
        targetElement: "comment",
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
        targetElement: "highlight",
      },
      {
        label: this.plugin.t("preset_inline_code", "Inline Code (`code`)"),
        pattern: "`[^`\\n]+`",
        flags: "",
        examples: [this.plugin.t("preset_example_inline_code", "`code`")],
        group: "markdown",
        targetElement: "inline-code",
      },
      {
        label: this.plugin.t("preset_strikethrough", "Strikethrough (~~...~~)"),
        pattern: "~~[^\\s\\S]*?~~",
        flags: "s",
        examples: [this.plugin.t("preset_example_strike", "~~struck~~")],
        group: "markdown",
        targetElement: "strikethrough",
      },
      {
        label: this.plugin.t("preset_blockquote", "Blockquote"),
        pattern: "^\\s*>\\s+.*$",
        flags: "m",
        examples: [this.plugin.t("preset_example_quote", "> quoted text")],
        group: "markdown",
        targetElement: "blockquote",
      },
      {
        label: this.plugin.t("preset_tag", "Tag (#tag)"),
        pattern: "(?:^|\\s)#[\\p{L}\\p{N}_/-]+",
        flags: "u",
        examples: [this.plugin.t("preset_example_tag", "#project")],
        group: "markdown",
        targetElement: "tag",
      },
      {
        label: this.plugin.t("preset_all_tags", "All Tags"),
        pattern: "(?:^|\\s)#[\\p{L}\\p{N}_/-]+",
        flags: "u",
        examples: [this.plugin.t("preset_example_tag_all", "#any-tag")],
        group: "markdown",
        targetElement: "all-tags",
      },
      {
        label: this.plugin.t("preset_inline_title", "Inline Title (note name)"),
        pattern: "",
        flags: "",
        examples: [this.plugin.t("preset_example_inline_title", "Note title")],
        group: "markdown",
        targetElement: "inline-title",
      },
      {
        label: this.plugin.t("preset_tab_title", "Tab Title (note name in tab)"),
        pattern: "",
        flags: "",
        examples: [this.plugin.t("preset_example_tab_title", "Note title")],
        group: "markdown",
        targetElement: "tab-title",
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

    // Presets that need extra input (Time & Date) swap this modal to their own
    // step first; everything else is handed straight to the caller.
    const choosePreset = (p) => {
      if (!p) return;
      if (p.needsFormat) {
        this._showFormatStep(p);
        return;
      }
      try {
        this.onChoose && this.onChoose(p);
      } finally {
        this.close();
      }
    };

    // Create three-column container
    const container = contentEl.createDiv();
    container.style.display = "grid";
    container.style.gridTemplateColumns = "1fr 1fr 1fr";
    container.style.gap = "12px";
    container.style.maxWidth = "100%";

    // Add responsive styles (removed again in onClose — reopening must not
    // stack duplicate style elements on <head>)
    const mediaRule = `
      @media (max-width: 1024px) {
        .preset-columns { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
      }
      @media (max-width: 600px) {
        .preset-columns { grid-template-columns: 1fr !important; gap: 8px !important; }
      }
    `;
    if (this._mediaStyleEl) {
      try {
        this._mediaStyleEl.remove();
      } catch (e) {}
      this._mediaStyleEl = null;
    }
    const style = document.createElement("style");
    style.textContent = mediaRule;
    document.head.appendChild(style);
    this._mediaStyleEl = style;

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
      row.style.maxWidth = "250px";

      formattingPresets.forEach((p) => {
        const btn = row.createEl("button", { text: p.label });
        btn.style.fontSize = "12px";
        btn.style.padding = "6px 10px";
        btn.style.flex = "1";
        btn.title = p.examples && p.examples[0] ? p.examples[0] : "";

        const handler = () => choosePreset(p);
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
      const handler = () => choosePreset(p);
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
      const handler = () => choosePreset(p);
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
      const handler = () => choosePreset(p);
      btn.addEventListener("click", handler);
      this._listeners.push({ el: btn, h: handler });
    });
  }
  _clearListeners() {
    (this._listeners || []).forEach((x) => {
      try {
        x.el.removeEventListener(x.event || "click", x.h);
      } catch (e) {}
    });
    this._listeners = [];
  }
  _formatErrorText(code) {
    const errors = {
      empty: [
        "preset_time_date_error_empty",
        "Enter a moment.js format to see a preview.",
      ],
      render: [
        "preset_time_date_error_render",
        "moment.js can't render this format.",
      ],
      mismatch: [
        "preset_time_date_error_mismatch",
        "This format can't be matched reliably — try a simpler one.",
      ],
      "too-long": [
        "preset_time_date_error_too_long",
        "This format makes a pattern that is too long — simplify it.",
      ],
      blocked: [
        "preset_time_date_error_blocked",
        "Regex safety blocks this pattern — simplify the format.",
      ],
    };
    const err = errors[code];
    return err ? this.plugin.t(err[0], err[1]) : "";
  }
  /**
   * Description of the Format field: the "{link}" placeholder in
   * "For more syntax, refer to {link}." is replaced by a real moment.js docs
   * anchor, so the reference lives inside the description line itself.
   */
  _formatDescFragment() {
    const frag = document.createDocumentFragment();
    const anchor = document.createElement("a");
    anchor.href = DATE_TIME_DOCS_URL;
    anchor.target = "_blank";
    anchor.className = "act-preset-format-link";
    anchor.textContent = this.plugin.t(
      "preset_time_date_docs",
      "format reference",
    );
    const sentence = this.plugin.t(
      "preset_time_date_format_desc",
      "For more syntax, refer to {link}.",
    );
    const parts = String(sentence).split("{link}");
    if (parts.length > 1) {
      frag.append(parts[0], anchor, parts.slice(1).join("{link}"));
    } else {
      // Translation lost the placeholder — keep the link anyway.
      frag.append(sentence, " ", anchor);
    }
    return frag;
  }
  /**
   * Second step of the "Time & Date" preset: type a moment.js format and see
   * the rendered text it produces. The generated regex is handed to the caller
   * internally — the user never sees it; entries keep showing the format.
   */
  _showFormatStep(preset) {
    const { contentEl } = this;
    this._clearListeners();
    contentEl.empty();

    const step = contentEl.createDiv({ cls: "act-preset-format-step" });
    step.createEl("h3", { text: preset.label, cls: "act-preset-format-title" });

    const previewWrap = step.createDiv({ cls: "act-preset-format-preview" });
    previewWrap.createEl("span", {
      text: this.plugin.t("preset_time_date_preview", "Preview"),
      cls: "act-preset-format-label",
    });
    const previewText = previewWrap.createEl("span", {
      cls: "act-preset-format-preview-text",
    });
    const errorEl = step.createEl("span", { cls: "act-preset-format-error" });

    let format = this._pendingFormat || DEFAULT_DATE_TIME_FORMAT;
    let state = { ok: false, error: "empty", sample: "", pattern: "" };

    const formatSetting = new Setting(step)
      .setName(this.plugin.t("preset_time_date_format", "Format"))
      .setDesc(this._formatDescFragment());
    let inputEl = null;
    formatSetting.addText((text) => {
      text.setPlaceholder(DEFAULT_DATE_TIME_FORMAT);
      text.setValue(format);
      text.onChange((value) => {
        format = value;
        this._pendingFormat = value;
        update();
      });
      inputEl = text.inputEl || null;
    });

    const actions = step.createDiv({ cls: "act-preset-format-actions" });

    const backBtn = actions.createEl("button", {
      text: this.plugin.t("btn_back", "Back"),
    });
    const backHandler = () => {
      // Edit mode has no preset list behind it — Back simply cancels.
      if (this._opts.startWithFormat) this.close();
      else this.onOpen();
    };
    backBtn.addEventListener("click", backHandler);
    this._listeners.push({ el: backBtn, h: backHandler });

    const useBtn = actions.createEl("button", {
      text: this.plugin.t("btn_use_format", "Use format"),
    });
    useBtn.addClass("mod-cta");

    const update = () => {
      state = evaluateDateTimeFormat(format, moment, (pattern) => {
        try {
          return this.plugin.validateAndSanitizeRegex(pattern);
        } catch (_) {
          return true;
        }
      });
      previewText.textContent = state.sample || format || "";
      errorEl.textContent = state.ok ? "" : this._formatErrorText(state.error);
      useBtn.disabled = !state.ok;
    };

    const useHandler = () => {
      if (!state.ok) return;
      const chosen = Object.assign({}, preset, {
        pattern: state.pattern,
        // `i` for locale month/weekday names, `u` for the \p{L} name class.
        flags: "iu",
        label: `${preset.label} (${String(format).trim()})`,
        examples: [state.sample],
        previewText: state.sample,
        // The entry stores the format itself so its row can show a format
        // button instead of the generated regex.
        dateTimeFormat: String(format).trim(),
        needsFormat: false,
      });
      try {
        this.onChoose && this.onChoose(chosen);
      } finally {
        this.close();
      }
    };
    useBtn.addEventListener("click", useHandler);
    this._listeners.push({ el: useBtn, h: useHandler });

    if (inputEl) {
      const keyHandler = (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          useHandler();
        }
      };
      inputEl.addEventListener("keydown", keyHandler);
      this._listeners.push({ el: inputEl, h: keyHandler, event: "keydown" });
    }

    update();
    try {
      inputEl && inputEl.focus && inputEl.focus();
    } catch (e) {}
  }
  onClose() {
    this._clearListeners();
    if (this._mediaStyleEl) {
      try {
        this._mediaStyleEl.remove();
      } catch (e) {}
      this._mediaStyleEl = null;
    }
    this.contentEl.empty();
  }
}

/**
 * Format button shown INSTEAD of the pattern/flags inputs for Time & Date
 * entries: it displays the moment.js format and re-opens the format step on
 * click, so the generated regex never surfaces in the UI.
 * @returns {HTMLButtonElement}
 */
export function createDateTimeFormatButton(host, app, plugin, entry, onSaved) {
  const btn = host.createEl("button", {
    text: getEntryDateTimeFormat(entry, plugin),
    cls: "act-datetime-format-btn",
  });
  btn.title = plugin.t("edit_date_time_format", "Edit date & time format");
  const handler = () => {
    PresetModal.openForDateTimeFormat(app, plugin, entry, onSaved);
  };
  btn.addEventListener("click", handler);
  return btn;
}
