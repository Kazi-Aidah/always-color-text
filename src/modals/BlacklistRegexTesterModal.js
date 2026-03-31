import { Modal, Notice } from 'obsidian';
import { escapeHtml, debugError } from '../utils/debug.js';

export class BlacklistRegexTesterModal extends Modal {
  constructor(app, plugin, onAdded) {
    super(app);
    this.plugin = plugin;
    this.onAdded = onAdded;
    this._editingEntry = null;
    this._handlers = [];
    this._rafId = null;
    this._debounceId = null;
    this._preFillPattern = "";
    this._preFillFlags = "";
    this._preFillName = "";
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.style.maxWidth = "820px";
      this.modalEl.style.padding = "20px";
    } catch (e) {}
    const title = contentEl.createEl("h2", {
      text: this.plugin.t("regex_tester_blacklist", "Regex tester - blacklist"),
    });
    title.style.marginTop = "0";
    title.style.marginBottom = "12px";
    try {
      title.addClass("act-regex-title");
    } catch (e) {}
    const controlsRow = contentEl.createDiv();
    controlsRow.style.display = "flex";
    controlsRow.style.gap = "12px";
    const flagsRow = controlsRow.createDiv();
    flagsRow.style.display = "flex";
    flagsRow.style.gap = "6px";
    const flagNames = ["i", "g", "m", "s", "u", "y"];
    const flagButtons = {};
    flagNames.forEach((f) => {
      const b = flagsRow.createEl("button", { text: f });
      b.style.padding = "6px 10px";
      b.style.borderRadius = "var(--radius-m)";
      b.style.border = "1px solid var(--background-modifier-border)";
      b.style.background = "var(--background-modifier-form-field)";
      b.style.cursor = "pointer";
      flagButtons[f] = b;
    });
    const regexInput = contentEl.createEl("input", { type: "text" });
    regexInput.placeholder = this.plugin.t(
      "regex_expression_placeholder",
      "put your expression here",
    );
    regexInput.style.marginTop = "10px";
    regexInput.style.width = "100%";
    regexInput.style.padding = "10px 14px";
    regexInput.style.borderRadius = "var(--radius-m)";
    regexInput.style.border = "1px solid var(--background-modifier-border)";
    regexInput.style.background = "var(--background-modifier-form-field)";
    regexInput.style.fontFamily = "var(--font-ui-medium)";
    const subjectWrap = contentEl.createDiv();
    subjectWrap.style.marginTop = "10px";
    subjectWrap.style.border = "1px solid var(--background-modifier-border)";
    subjectWrap.style.borderRadius = "var(--radius-m)";
    subjectWrap.style.overflow = "hidden";
    subjectWrap.style.background = "var(--background-modifier-form-field)";
    const testInput = subjectWrap.createEl("textarea");
    testInput.placeholder = this.plugin.t(
      "regex_subject_placeholder",
      "type your subject / test string here...",
    );
    testInput.style.width = "100%";
    testInput.style.height = "120px";
    testInput.style.padding = "12px";
    testInput.style.border = "none";
    testInput.style.outline = "none";
    testInput.style.background = "transparent";
    testInput.style.color = "var(--text-normal)";
    testInput.style.fontFamily = "var(--font-ui-medium)";
    testInput.style.resize = "none";
    const previewWrap = contentEl.createDiv();
    previewWrap.style.marginTop = "10px";
    previewWrap.style.border = "1px solid var(--background-modifier-border)";
    previewWrap.style.borderRadius = "var(--radius-m)";
    previewWrap.style.padding = "12px";
    previewWrap.style.background = "var(--background-modifier-form-field)";
    previewWrap.style.whiteSpace = "pre-wrap";
    previewWrap.style.wordWrap = "break-word";
    previewWrap.style.fontFamily = "var(--font-ui-medium)";
    previewWrap.style.fontSize = "var(--font-small)";
    previewWrap.style.lineHeight = "1.5";
    const nameInput = contentEl.createEl("input", { type: "text" });
    nameInput.placeholder = this.plugin.t(
      "regex_name_placeholder",
      "name your regex",
    );
    nameInput.style.marginTop = "10px";
    nameInput.style.width = "100%";
    nameInput.style.padding = "10px 14px";
    nameInput.style.borderRadius = "var(--radius-m)";
    nameInput.style.border = "1px solid var(--background-modifier-border)";
    nameInput.style.background = "var(--background-modifier-form-field)";
    nameInput.style.boxSizing = "border-box";
    nameInput.style.fontFamily = "var(--font-ui-medium)";
    const statusRow = contentEl.createDiv();
    statusRow.style.display = "flex";
    statusRow.style.justifyContent = "space-between";
    statusRow.style.alignItems = "center";
    statusRow.style.gap = "8px";
    statusRow.style.marginTop = "14px";
    const matchFooter = statusRow.createDiv();
    matchFooter.style.opacity = "0.8";
    matchFooter.style.flex = "1";
    const addBtn = statusRow.createEl("button", {
      text: this._editingEntry
        ? this.plugin.t("btn_save_regex", "Save Regex")
        : this.plugin.t("btn_add_regex", "+ Add to Blacklist"),
    });
    addBtn.addClass("mod-cta");
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
      const raw = String(testInput.value || "");
      const patRaw = String(regexInput.value || "").trim();
      const flags = Object.keys(flagButtons)
        .filter((k) => flagButtons[k].dataset.on === "1")
        .join("");
      const f = flags.includes("g") ? flags : flags + "g";
      if (!patRaw) {
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      const pat = this.plugin.sanitizePattern(patRaw, true);
      if (!pat) {
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      if (
        !this.plugin.settings.disableRegexSafety &&
        !this.plugin.validateAndSanitizeRegex(pat)
      ) {
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      let re;
      try {
        re = new RegExp(pat, f);
      } catch (e) {
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      let lastIndex = 0;
      let out = "";
      let count = 0;
      const matchStyle =
        "background:rgba(255, 68, 68, 0.5);border-radius:4px;padding:0 4px;";
      for (const m of raw.matchAll(re)) {
        const s = m.index ?? 0;
        const e = s + (m[0] ? m[0].length : 0);
        out += escapeHtml(raw.slice(lastIndex, s));
        out += `<mark style="${matchStyle}">${escapeHtml(raw.slice(s, e))}</mark>`;
        lastIndex = e;
        count++;
      }
      out += escapeHtml(raw.slice(lastIndex));
      previewWrap.innerHTML = out.replace(/\n/g, "<br>");
      matchFooter.textContent = `${count} match${count === 1 ? "" : "es"}`;
    };
    const render = () => {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this._rafId = requestAnimationFrame(renderPreview);
    };
    const renderDebounced = () => {
      if (this._debounceId) clearTimeout(this._debounceId);
      this._debounceId = setTimeout(() => {
        render();
      }, 100);
    };
    const updateFlagButtonUI = () => {
      const active = Object.keys(flagButtons).filter(
        (k) => flagButtons[k].dataset.on === "1",
      );
      Object.keys(flagButtons).forEach((k) => {
        const on = flagButtons[k].dataset.on === "1";
        if (on) {
          flagButtons[k].addClass("mod-cta");
        } else {
          flagButtons[k].removeClass("mod-cta");
        }
      });
    };
    const flagTooltips = {
      i: "ignore case",
      g: "global",
      m: "multiline",
      s: "dotall",
      u: "unicode",
      y: "sticky",
    };
    Object.keys(flagButtons).forEach((k) => {
      const btn = flagButtons[k];
      if (flagTooltips[k]) {
        btn.setAttribute("title", flagTooltips[k]);
      }
      const fn = () => {
        btn.dataset.on = btn.dataset.on === "1" ? "0" : "1";
        updateFlagButtonUI();
        render();
      };
      btn.addEventListener("click", fn);
      this._handlers.push({ el: btn, ev: "click", fn });
    });
    updateFlagButtonUI();
    // Pre-fill pattern and flags if provided
    if (this._preFillPattern) {
      regexInput.value = this._preFillPattern;
    }
    if (this._preFillFlags) {
      const flags = String(this._preFillFlags || "").split("");
      flags.forEach((f) => {
        if (flagButtons[f]) {
          flagButtons[f].dataset.on = "1";
        }
      });
      updateFlagButtonUI();
    }
    if (this._preFillName) {
      nameInput.value = this._preFillName;
    }
    const onInputImmediate = () => {
      render();
    };
    const onInputDebounced = () => {
      renderDebounced();
    };
    [regexInput, testInput].forEach((el) => {
      const ev = el === regexInput ? "input" : "input";
      const fn = onInputDebounced;
      el.addEventListener(ev, fn);
      this._handlers.push({ el, ev, fn });
    });
    render();
    const addHandler = async () => {
      const patRaw = String(regexInput.value || "").trim();
      const pat = this.plugin.sanitizePattern(patRaw, true);
      const label = String(nameInput.value || "").trim();
      const flags = Object.keys(flagButtons)
        .filter((k) => flagButtons[k].dataset.on === "1")
        .join("");
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

      // Handle advanced rules context
      if (this._advancedRuleEntry) {
        try {
          this._advancedRuleEntry.text = pat;
          this._advancedRuleEntry.flags = flags;
          await this.plugin.saveSettings();
          try {
            this.onAdded && this.onAdded(this._advancedRuleEntry);
          } catch (e) {}
          new Notice(this.plugin.t("notice_rule_updated", "Rule updated"));
          this.close();
          return;
        } catch (e) {
          debugError("REGEX_TESTER", "advanced rule update error", e);
        }
      }

      // Handle editing existing blacklist entry
      if (this._editingEntry) {
        try {
          const updated = Object.assign({}, this._editingEntry, {
            pattern: pat,
            flags,
            presetLabel: label || undefined,
            isRegex: true,
          });
          let entryIdx = -1;
          if (updated && updated.uid)
            entryIdx = this.plugin.settings.blacklistEntries.findIndex(
              (e) => e && e.uid === updated.uid,
            );
          if (entryIdx === -1)
            entryIdx = this.plugin.settings.blacklistEntries.indexOf(
              this._editingEntry,
            );
          if (entryIdx === -1)
            entryIdx = this.plugin.settings.blacklistEntries.findIndex(
              (e) =>
                e &&
                e.isRegex &&
                String(e.pattern) === String(this._editingEntry.pattern),
            );
          if (entryIdx !== -1)
            this.plugin.settings.blacklistEntries[entryIdx] = updated;
          else this.plugin.settings.blacklistEntries.push(updated);
          this._editingEntry.pattern = updated.pattern;
          this._editingEntry.flags = updated.flags;
          this._editingEntry.presetLabel = updated.presetLabel;
          this._editingEntry.isRegex = updated.isRegex;
          await this.plugin.saveSettings();
          try {
            this.onAdded && this.onAdded(updated);
          } catch (e) {}
          new Notice(this.plugin.t("notice_entry_updated", "Entry updated"));
          this.close();
          return;
        } catch (e) {
          debugError("REGEX_TESTER", "entry update error", e);
        }
      }

      // Default: add to blacklist
      const uid = (() => {
        try {
          return Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          return Date.now();
        }
      })();
      const entry = {
        uid,
        isRegex: true,
        pattern: pat,
        flags,
        presetLabel: label || undefined,
        persistAtEnd: true,
      };
      if (!Array.isArray(this.plugin.settings.blacklistEntries))
        this.plugin.settings.blacklistEntries = [];
      this.plugin.settings.blacklistEntries.push(entry);
      try {
        this.plugin.settingTab &&
          (this.plugin.settingTab._suspendSorting = true);
      } catch (e) {}
      try {
        this.plugin.settingTab &&
          entry &&
          entry.uid &&
          this.plugin.settingTab._blacklistNewSet &&
          this.plugin.settingTab._blacklistNewSet.add(entry.uid);
      } catch (e) {}
      await this.plugin.saveSettings();
      try {
        this.onAdded && this.onAdded(entry);
      } catch (e) {}
      new Notice(
        this.plugin.t(
          "notice_added_to_blacklist",
          "Pattern added to blacklist",
        ),
      );
      this.close();
    };
    addBtn.addEventListener("click", addHandler);
    this._handlers.push({ el: addBtn, ev: "click", fn: addHandler });
  }
  onClose() {
    try {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      if (this._debounceId) clearTimeout(this._debounceId);
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
