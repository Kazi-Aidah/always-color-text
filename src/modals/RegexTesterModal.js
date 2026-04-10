import { Modal, Notice } from 'obsidian';
import { escapeHtml } from '../utils/debug.js';
// ColorPickerModal will be imported once extracted to its own module

export class RegexTesterModal extends Modal {
  constructor(app, plugin, onAdded) {
    super(app);
    this.plugin = plugin;
    this.onAdded = onAdded;
    this._handlers = [];
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.style.maxWidth = "720px";
      this.modalEl.style.padding = "20px";
    } catch (e) {}

    const title = contentEl.createEl("h2", {
      text: this.plugin.t("regex_tester_header", "Regex Tester"),
    });
    title.style.marginTop = "0";
    title.style.marginBottom = "12px";
    try {
      title.style.color = "var(--color-accent)";
    } catch (e) {}
    try {
      title.addClass("act-regex-title");
    } catch (e) {}

    // Row: expression + flags
    const rowExpr = contentEl.createDiv();
    rowExpr.style.display = "flex";
    rowExpr.style.gap = "12px";
    try {
      rowExpr.addClass("act-regex-row-expr");
    } catch (e) {}

    const exprInput = rowExpr.createEl("input", { type: "text" });
    exprInput.placeholder = this.plugin.t(
      "regex_expression_placeholder",
      "Put your Regex Expression here",
    );
    exprInput.style.flex = "1";
    exprInput.style.padding = "10px 14px";
    exprInput.style.borderRadius = "var(--radius-m)";
    exprInput.style.border = "1px solid var(--background-modifier-border)";
    exprInput.style.background = "var(--background-modifier-form-field)";
    try {
      exprInput.addClass("act-regex-expr");
    } catch (e) {}

    const flagsInput = rowExpr.createEl("input", { type: "text" });
    flagsInput.placeholder = this.plugin.t("flags_placeholder", "flags");
    flagsInput.style.flex = "0 0 140px";
    flagsInput.style.padding = "10px 14px";
    flagsInput.style.borderRadius = "var(--radius-m)";
    flagsInput.style.border = "1px solid var(--background-modifier-border)";
    flagsInput.style.background = "var(--background-modifier-form-field)";
    try {
      flagsInput.addClass("act-regex-flags");
    } catch (e) {}

    // Row: style dropdown + color pickers
    const rowStyle = contentEl.createDiv();
    rowStyle.style.display = "flex";
    rowStyle.style.gap = "12px";
    rowStyle.style.marginTop = "12px";
    try {
      rowStyle.addClass("act-regex-row-style");
    } catch (e) {}

    const styleSelect = rowStyle.createEl("select");
    ["text", "highlight", "both"].forEach((val) => {
      const opt = styleSelect.createEl("option", {
        text: this.plugin.t(
          "style_type_" + val,
          val === "text" ? "color" : val,
        ),
      });
      opt.value = val;
    });
    styleSelect.value = "both";
    styleSelect.style.flex = "0 0 stretch";
    styleSelect.style.padding = "";
    styleSelect.style.borderRadius = "var(--radius-m)";
    styleSelect.style.border = "1px solid var(--background-modifier-border)";
    styleSelect.style.background = "var(--background-modifier-form-field)";
    styleSelect.style.textAlign = "center";
    try {
      styleSelect.addClass("act-regex-style");
    } catch (e) {}

    const textColorInput = rowStyle.createEl("input", { type: "color" });
    textColorInput.value = "#58bc54";
    textColorInput.style.width = "48px";
    textColorInput.style.height = "auto";
    textColorInput.style.borderRadius = "var(--radius-s)";
    textColorInput.style.cursor = "pointer";
    try {
      textColorInput.addClass("act-regex-color-text");
    } catch (e) {}

    const bgColorInput = rowStyle.createEl("input", { type: "color" });
    bgColorInput.value = "#205613";
    bgColorInput.style.width = "48px";
    bgColorInput.style.height = "auto";
    bgColorInput.style.borderRadius = "var(--radius-m)";
    bgColorInput.style.cursor = "pointer";
    try {
      bgColorInput.addClass("act-regex-color-bg");
    } catch (e) {}
    const onTextPickerContext = (ev) => {
      try {
        ev.preventDefault();
      } catch (e) {}
      try {
        const modal = new ColorPickerModal(
          this.app,
          this.plugin,
          async (color, result) => {
            const sel = result || {};
            const tc =
              sel.textColor && this.plugin.isValidHexColor(sel.textColor)
                ? sel.textColor
                : this.plugin.isValidHexColor(color)
                  ? color
                  : null;
            if (tc) {
              textColorInput.value = tc;
              renderPreview();
            }
          },
          "text",
          regexInput.value || "",
        );
        modal._hideHeaderControls = true;
        modal._preFillTextColor = textColorInput.value;
        modal.open();
      } catch (e) {}
    };
    const onBgPickerContext = (ev) => {
      try {
        ev.preventDefault();
      } catch (e) {}
      try {
        const modal = new ColorPickerModal(
          this.app,
          this.plugin,
          async (color, result) => {
            const sel = result || {};
            const bc =
              sel.backgroundColor &&
              this.plugin.isValidHexColor(sel.backgroundColor)
                ? sel.backgroundColor
                : this.plugin.isValidHexColor(color)
                  ? color
                  : null;
            if (bc) {
              bgColorInput.value = bc;
              renderPreview();
            }
          },
          "background",
          regexInput.value || "",
        );
        modal._hideHeaderControls = true;
        modal._preFillBgColor = bgColorInput.value;
        modal.open();
      } catch (e) {}
    };
    try {
      textColorInput.addEventListener("contextmenu", onTextPickerContext);
      bgColorInput.addEventListener("contextmenu", onBgPickerContext);
      this._handlers.push({
        el: textColorInput,
        ev: "contextmenu",
        fn: onTextPickerContext,
      });
      this._handlers.push({
        el: bgColorInput,
        ev: "contextmenu",
        fn: onBgPickerContext,
      });
    } catch (e) {}
    const updatePickerVisibility = () => {
      const v = styleSelect.value;
      if (v === "text") {
        textColorInput.style.display = "inline-block";
        bgColorInput.style.display = "none";
      } else if (v === "highlight") {
        textColorInput.style.display = "none";
        bgColorInput.style.display = "inline-block";
      } else {
        textColorInput.style.display = "inline-block";
        bgColorInput.style.display = "inline-block";
      }
    };
    updatePickerVisibility();
    const visHandler = () => {
      updatePickerVisibility();
    };
    styleSelect.addEventListener("change", visHandler);
    this._handlers.push({ el: styleSelect, ev: "change", fn: visHandler });

    const nameInput = rowStyle.createEl("input", { type: "text" });
    nameInput.placeholder = this.plugin.t(
      "regex_name_placeholder",
      "name your regex",
    );
    nameInput.style.padding = "10px 14px";
    nameInput.style.borderRadius = "var(--radius-m)";
    nameInput.style.border = "1px solid var(--background-modifier-border)";
    nameInput.style.background = "var(--background-modifier-form-field)";
    nameInput.style.width = "stretch";
    try {
      nameInput.addClass("act-regex-name");
    } catch (e) {}

    // Split layout: editor on left, preview on right
    const splitContainer = contentEl.createDiv();
    splitContainer.style.display = "flex";
    splitContainer.style.gap = "12px";
    splitContainer.style.marginTop = "12px";
    splitContainer.style.height = "300px";

    // Left: CodeMirror editor for test input
    const editorWrap = splitContainer.createDiv();
    editorWrap.style.flex = "1";
    editorWrap.style.border = "1px solid var(--background-modifier-border)";
    editorWrap.style.borderRadius = "var(--button-radius)";
    editorWrap.style.overflow = "hidden";
    editorWrap.style.background = "var(--background-modifier-form-field)";

    // Right: Live preview panel
    const previewWrap = splitContainer.createDiv();
    previewWrap.style.flex = "1";
    previewWrap.style.border = "1px solid var(--background-modifier-border)";
    previewWrap.style.borderRadius = "var(--button-radius)";
    previewWrap.style.padding = "12px";
    previewWrap.style.overflow = "auto";
    previewWrap.style.background = "var(--background-modifier-form-field)";
    previewWrap.style.whiteSpace = "pre-wrap";
    previewWrap.style.wordWrap = "break-word";
    previewWrap.style.fontFamily = "monospace";
    previewWrap.style.fontSize = "var(--font-small)";
    previewWrap.style.lineHeight = "1.5";
    previewWrap.style.display = "flex";
    previewWrap.style.alignItems = "center";
    previewWrap.style.justifyContent = "center";

    let cmEditor = null;
    try {
      const { EditorState } = require("@codemirror/state");
      const { EditorView, basicSetup } = require("@codemirror/view");
      cmEditor = new EditorView({
        state: EditorState.create({
          doc: this.plugin.t(
            "regex_subject_placeholder",
            "type your subject / test string here...",
          ),
          extensions: [basicSetup],
        }),
        parent: editorWrap,
      });
    } catch (e) {
      // Fallback to textarea if CodeMirror fails
      const textarea = editorWrap.createEl("textarea");
      textarea.placeholder = this.plugin.t(
        "regex_subject_placeholder",
        "type your subject / test string here...",
      );
      textarea.style.width = "100%";
      textarea.style.height = "100%";
      textarea.style.padding = "12px";
      textarea.style.border = "none";
      textarea.style.outline = "none";
      textarea.style.background = "transparent";
      textarea.style.color = "var(--text-normal)";
      textarea.style.fontFamily = "monospace";
      textarea.style.resize = "none";
      cmEditor = {
        getValue: () => textarea.value,
        setValue: (v) => {
          textarea.value = v;
        },
      };
    }

    const sanitizeFlags = (f) => {
      const s = String(f || "")
        .toLowerCase()
        .replace(/[^gimsuy]/g, "");
      let out = "";
      for (const ch of ["g", "i", "m", "s", "u", "y"]) {
        if (s.includes(ch)) out += ch;
      }
      return out;
    };

    const renderPreview = () => {
      const raw = cmEditor.getValue
        ? cmEditor.getValue()
        : cmEditor.state?.doc.toString() || "";
      const patRaw = String(exprInput.value || "").trim();
      status.textContent = "";
      previewWrap.innerHTML = "";

      // Always show raw text if no pattern
      if (!patRaw) {
        previewWrap.innerHTML = escapeHtml(String(raw)).replace(/\n/g, "<br>");
        return;
      }

      const pat = this.plugin.sanitizePattern(patRaw, true);
      let flags = sanitizeFlags(flagsInput.value || "");

      if (!pat) {
        status.textContent = this.plugin.t(
          "notice_invalid_regex",
          "Invalid regular expression",
        );
        const escaped = String(raw)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");
        previewWrap.innerHTML = escaped;
        return;
      }
      if (this.plugin.settings.enableRegexSupport === false) {
        try {
          this.plugin.settings.enableRegexSupport = true;
        } catch (e) {}
      }
      if (
        !this.plugin.settings.disableRegexSafety &&
        !this.plugin.validateAndSanitizeRegex(pat)
      ) {
        status.textContent = this.plugin.t(
          "notice_pattern_too_complex",
          "Pattern too complex",
        );
        const escaped = String(raw)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");
        previewWrap.innerHTML = escaped;
        return;
      }

      // Force rendering even if there's an error
      try {
        const f = flags.includes("g") ? flags : flags + "g";
        const re = new RegExp(pat, f);
        let lastIndex = 0;
        let out = "";
        const applyStyle = (txt) => {
          const style = styleSelect.value;
          const t = textColorInput.value;
          const b = bgColorInput.value;
          if (style === "text") {
            return `<span style="color:${t}">${txt}</span>`;
          } else if (style === "highlight") {
            const rgba = this.plugin.hexToRgba(
              b,
              this.plugin.settings.backgroundOpacity ?? 25,
            );
            const radius = this.plugin.settings.highlightBorderRadius ?? 8;
            const pad = this.plugin.settings.highlightHorizontalPadding ?? 4;
            const vpad = this.plugin.settings.highlightVerticalPadding ?? 0;
            const padCss =
              vpad >= 0
                ? `padding:${vpad}px ${pad}px;`
                : `padding:0px ${pad}px; margin:${vpad}px 0;`;
            return `<span style="background:${rgba};border-radius:${radius}px;${padCss}">${txt}</span>`;
          } else {
            const rgba = this.plugin.hexToRgba(
              b,
              this.plugin.settings.backgroundOpacity ?? 25,
            );
            const radius = this.plugin.settings.highlightBorderRadius ?? 8;
            const pad = this.plugin.settings.highlightHorizontalPadding ?? 4;
            const vpad = this.plugin.settings.highlightVerticalPadding ?? 0;
            const padCss =
              vpad >= 0
                ? `padding:${vpad}px ${pad}px;`
                : `padding:0px ${pad}px; margin:${vpad}px 0;`;
            return `<span style="color:${t};background:${rgba};border-radius:${radius}px;${padCss}">${txt}</span>`;
          }
        };
        for (const m of raw.matchAll(re)) {
          const s = m.index ?? 0;
          const e = s + (m[0] ? m[0].length : 0);
          out += escapeHtml(raw.slice(lastIndex, s));
          out += applyStyle(escapeHtml(raw.slice(s, e)));
          lastIndex = e;
        }
        out += escapeHtml(raw.slice(lastIndex));
        // Preserve line breaks
        out = out.replace(/\n/g, "<br>");
        previewWrap.innerHTML = out;
        status.textContent = `${(raw.match(re) || []).length} match(es) found`;
      } catch (err) {
        status.textContent =
          this.plugin.t("notice_invalid_regex", "Invalid regular expression") +
          ": " +
          String(err.message || err);
        previewWrap.innerHTML = escapeHtml(String(raw)).replace(/\n/g, "<br>");
      }
    };

    // Call renderPreview immediately on first load
    renderPreview();

    // Instant rendering on all changes
    const handlers = [
      { el: exprInput, ev: "input", fn: renderPreview },
      { el: flagsInput, ev: "input", fn: renderPreview },
      { el: styleSelect, ev: "change", fn: renderPreview },
      { el: textColorInput, ev: "input", fn: renderPreview },
      { el: bgColorInput, ev: "input", fn: renderPreview },
    ];
    handlers.forEach((h) => {
      try {
        h.el.addEventListener(h.ev, h.fn);
        this._handlers.push(h);
      } catch (e) {}
    });

    // Add instant rendering for editor input with multiple methods
    if (cmEditor && cmEditor.dom) {
      try {
        // Method 1: Direct input event
        cmEditor.dom.addEventListener("input", renderPreview);
        this._handlers.push({
          el: cmEditor.dom,
          ev: "input",
          fn: renderPreview,
        });

        // Method 2: MutationObserver to catch all DOM changes
        const observer = new MutationObserver(() => {
          renderPreview();
        });
        observer.observe(cmEditor.dom, {
          childList: true,
          subtree: true,
          characterData: true,
          characterDataOldValue: false,
        });
        this._handlers.push({ observer, fn: () => observer.disconnect() });
      } catch (e) {}
    }

    const actionRow = contentEl.createDiv();
    actionRow.style.display = "flex";
    actionRow.style.justifyContent = "space-between";
    actionRow.style.alignItems = "center";
    actionRow.style.gap = "8px";
    actionRow.style.marginTop = "14px";

    const status = actionRow.createDiv();
    status.style.opacity = "0.8";
    status.style.flex = "1";
    try {
      status.addClass("act-regex-status");
    } catch (e) {}

    const addBtn = actionRow.createEl("button", {
      text: this.plugin.t("btn_add_regex", "+ Add Regex"),
    });
    addBtn.addClass("mod-cta");
    addBtn.style.padding = "10px 16px";
    addBtn.style.borderRadius = "var(--radius-m)";
    addBtn.style.border = "2px solid var(--color-accent)";
    addBtn.style.background = "var(--interactive-accent)";
    try {
      addBtn.addClass("act-regex-add");
    } catch (e) {}
    const addHandler = async () => {
      const patRaw = String(exprInput.value || "").trim();
      const pat = this.plugin.sanitizePattern(patRaw, true);
      const label = String(nameInput.value || "").trim();
      let flags = sanitizeFlags(flagsInput.value || "");
      if (!pat) {
        new Notice(this.plugin.t("notice_empty_pattern", "Pattern is empty"));
        return;
      }
      if (
        !this.plugin.settings.disableRegexSafety &&
        !this.plugin.validateAndSanitizeRegex(pat)
      ) {
        new Notice(
          this.plugin.t("notice_pattern_too_complex", "Pattern too complex"),
        );
        return;
      }
      try {
        this.plugin.settings.enableRegexSupport = true;
      } catch (e) {}
      const uid = (() => {
        try {
          return Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          return Date.now();
        }
      })();
      const style = styleSelect.value;
      const entry = {
        uid,
        isRegex: true,
        pattern: pat,
        flags,
        presetLabel: label || undefined,
        styleType: style,
        _savedTextColor: textColorInput.value || "",
        _savedBackgroundColor: bgColorInput.value || "",
      };

      // Add targetElement for formatting patterns
      if (entry.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1")
        entry.targetElement = "strong";
      else if (entry.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1")
        entry.targetElement = "em";
      else if (entry.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1")
        entry.targetElement = "strong-em";

      if (style === "text") {
        entry.color = textColorInput.value || "";
        entry.textColor = null;
        entry.backgroundColor = null;
      } else if (style === "highlight") {
        entry.color = "";
        entry.textColor = "currentColor";
        entry.backgroundColor = bgColorInput.value || "";
      } else {
        entry.color = "";
        entry.textColor = textColorInput.value || "";
        entry.backgroundColor = bgColorInput.value || "";
      }
      this.plugin.settings.wordEntries.push(
        Object.assign(
          {
            matchType: this.plugin.settings.partialMatch ? "contains" : "exact",
          },
          entry,
        ),
      );
      try {
        this.plugin.settingTab &&
          (this.plugin.settingTab._suspendSorting = true);
      } catch (e) {}
      try {
        this.plugin.settingTab &&
          entry &&
          entry.uid &&
          this.plugin.settingTab._newEntriesSet &&
          this.plugin.settingTab._newEntriesSet.add(entry.uid);
      } catch (e) {}
      await this.plugin.saveSettings();
      this.plugin.compileWordEntries();
      this.plugin.compileTextBgColoringEntries();
      this.plugin.reconfigureEditorExtensions();
      this.plugin.forceRefreshAllEditors();
      this.plugin.forceRefreshAllReadingViews();
      this.plugin.triggerActiveDocumentRerender();
      try {
        this.onAdded && this.onAdded(entry);
      } catch (e) {}
      new Notice(this.plugin.t("notice_added_regex", "Regex added"));
      this.close();
    };
    addBtn.addEventListener("click", addHandler);
    this._handlers.push({ el: addBtn, ev: "click", fn: addHandler });
  }
  onClose() {
    try {
      if (this._handlers && Array.isArray(this._handlers)) {
        this._handlers.forEach((h) => {
          try {
            if (
              h.el &&
              h.ev &&
              h.fn &&
              typeof h.el.removeEventListener === "function"
            ) {
              h.el.removeEventListener(h.ev, h.fn);
            }
            if (h.observer && typeof h.fn === "function") {
              h.fn(); // Disconnect MutationObserver
            }
          } catch (e) {}
        });
      }
    } catch (e) {}
    this._handlers = [];
    try {
      this.contentEl?.empty();
    } catch (e) {}
  }
}
