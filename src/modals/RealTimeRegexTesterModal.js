import { Modal, Notice } from 'obsidian';
import { escapeHtml, debugError } from '../utils/debug.js';
import { ColorPickerModal } from './ColorPickerModal.js';

const HARDCODED_LEGACY_DEFAULTS = ["#87c760", "#1d5010", "#58bc54", "#205613"];

function isHardcodedLegacyDefault(c) {
  return HARDCODED_LEGACY_DEFAULTS.includes(String(c || "").toLowerCase());
}

function isBareBlack(c) {
  return String(c || "").toLowerCase() === "#000000";
}

/**
 * Pure decision logic for the regex tester color pickers.
 * Determines whether each picker holds a REAL color (user intent) vs NULL
 * (never picked — preview must show var(--text-normal)/var(--color-accent), save must store "").
 *
 * Rules (preset colors are ignored — NULL always previews as var):
 * - Fresh add (no editingEntry): both NULL, unless the caller passed a real color.
 * - Editing: keep the entry's stored colors, EXCEPT legacy pollution is dropped:
 *   hardcoded greens (#87c760/#1d5010/…) and bare "#000000" with no other signal are NULL.
 *   Stored both-sides-#000000 is treated as NULL (native picker default leaked into storage by old saves).
 *   A solitary #000000 on one side with the other side empty is kept as a legit black choice.
 *
 * @param {object} opts
 * @param {object|null} opts.editingEntry
 * @param {string} opts.preFillTextColor
 * @param {string} opts.preFillBgColor
 * @param {Function} opts.isValidHexColor
 * @returns {{preFillTextColor:string, preFillBgColor:string, tTouched:boolean, bTouched:boolean}}
 */
export function resolveRegexTesterColorInit({ editingEntry, preFillTextColor, preFillBgColor, isValidHexColor }) {
  const storedText = editingEntry
    ? ((editingEntry.textColor && editingEntry.textColor !== "currentColor") ? editingEntry.textColor : (editingEntry.color || ""))
    : "";
  const storedBg = editingEntry ? (editingEntry.backgroundColor || "") : "";
  const hasStoredText = !!(storedText && isValidHexColor(storedText));
  const hasStoredBg = !!(storedBg && isValidHexColor(storedBg));
  // Legacy pollution: native picker default "#000000" leaked into storage on both sides → NULL
  const isPollutedBothBlack = !!editingEntry && isBareBlack(storedText) && isBareBlack(storedBg);
  const effHasRealText = hasStoredText && !isPollutedBothBlack;
  const effHasRealBg = hasStoredBg && !isPollutedBothBlack;

  const isRealPrefill = (c) => !!c && isValidHexColor(c) && !isHardcodedLegacyDefault(c) && !isBareBlack(c);
  let preT = preFillTextColor || "";
  let preB = preFillBgColor || "";
  let tTouched;
  let bTouched;
  if (!editingEntry) {
    // Fresh add: both NULL unless caller passed a real color. Preset ignored.
    if (!isRealPrefill(preT)) preT = "";
    if (!isRealPrefill(preB)) preB = "";
    tTouched = isRealPrefill(preT);
    bTouched = isRealPrefill(preB);
  } else {
    if (!effHasRealText && (!preT || isHardcodedLegacyDefault(preT) || isBareBlack(preT))) preT = "";
    if (!effHasRealBg && (!preB || isHardcodedLegacyDefault(preB) || isBareBlack(preB))) preB = "";
    tTouched = !!effHasRealText || isRealPrefill(preT);
    bTouched = !!effHasRealBg || isRealPrefill(preB);
  }
  return { preFillTextColor: preT, preFillBgColor: preB, tTouched, bTouched };
}

/**
 * Pure mapping from picker state to preview colors.
 * NULL (untouched native "#000000") → text var(--text-normal), bg/border var(--color-accent). Never black.
 *
 * @param {object} opts
 * @param {string} opts.tRaw native text picker value
 * @param {string} opts.bRaw native bg picker value
 * @param {boolean} opts.tTouched
 * @param {boolean} opts.bTouched
 * @param {Function} opts.isValidHexColor
 * @param {number} opts.opacity 0-100
 * @param {Function} opts.hexToRgba (hex, opacity) => css color
 * @returns {{hasValidT:boolean, hasValidB:boolean, t:string, bgCss:string, effectiveTForBorder:string, effectiveBForBorder:string}}
 */
export function resolveRegexTesterPreviewColors({ tRaw, bRaw, tTouched, bTouched, isValidHexColor, opacity, hexToRgba }) {
  const isVar = (s) => !!s && /^var\(/.test(String(s).trim());
  const hasValidT = !!(tRaw && isValidHexColor(tRaw) && (isVar(tRaw) || tTouched));
  const hasValidB = !!(bRaw && isValidHexColor(bRaw) && (isVar(bRaw) || bTouched));
  const t = hasValidT ? String(tRaw).trim() : "var(--text-normal)";
  const op = opacity ?? 25;
  const bgCss = hasValidB
    ? (isVar(bRaw) ? `color-mix(in srgb, ${String(bRaw).trim()} ${op}%, transparent)` : hexToRgba(bRaw, op))
    : `color-mix(in srgb, var(--color-accent) ${op}%, transparent)`;
  return {
    hasValidT,
    hasValidB,
    t,
    bgCss,
    effectiveTForBorder: hasValidT ? String(tRaw).trim() : "var(--color-accent)",
    effectiveBForBorder: hasValidB ? String(bRaw).trim() : "var(--color-accent)",
  };
}

export class RealTimeRegexTesterModal extends Modal {
  constructor(
    app,
    plugin,
    onAdded,
    advancedRuleEntry = null,
    skipWordEntriesPush = false,
  ) {
    super(app);
    this.plugin = plugin;
    this.onAdded = onAdded;
    this._advancedRuleEntry = advancedRuleEntry;
    this._skipWordEntriesPush = skipWordEntriesPush;
    this._editingEntry = null;
    this._preFillPattern = "";
    this._preFillFlags = "";
    this._preFillName = "";
    this._preFillStyleType = "both";
    this._preFillTextColor = "";
    this._preFillBgColor = "";
    this._handlers = [];
    this._rafId = null;
    this._debounceId = null;
    this._lastValidHTML = "";
    this._tPickerTouched = false;
    this._bPickerTouched = false;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.style.setProperty("--dialog-width", "760px");
      this.modalEl.style.width = "760px";
      this.modalEl.style.maxWidth = "95vw";
      this.modalEl.style.padding = "20px";
    } catch (e) {}
    const title = contentEl.createEl("h2", {
      text: this.plugin.t("regex_tester_header", "Regex Tester"),
    });
    title.style.marginTop = "0";
    title.style.marginBottom = "12px";
    try {
      title.addClass("act-regex-title");
    } catch (e) {}
    const controlsRow = contentEl.createDiv();
    controlsRow.style.display = "flex";
    controlsRow.style.gap = "8px";
    controlsRow.style.flexWrap = "wrap";
    controlsRow.style.alignItems = "center";
    try {
      controlsRow.addClass("act-regex-tester-controls");
    } catch (e) {}
    const flagsRow = controlsRow.createDiv();
    flagsRow.style.display = "flex";
    flagsRow.style.gap = "6px";
    flagsRow.style.flexWrap = "wrap";
    flagsRow.style.alignItems = "center";
    try {
      flagsRow.addClass("act-regex-tester-flags");
    } catch (e) {}
    const flagNames = ["i", "g", "m", "s", "u", "y"];
    const flagButtons = {};
    flagNames.forEach((f) => {
      const b = flagsRow.createEl("button", { text: f });
      b.style.padding = "6px 10px";
      b.style.borderRadius = "var(--input-radius)";
      b.style.border = "1px solid var(--background-modifier-border)";
      b.style.background = "var(--background-modifier-form-field)";
      b.style.cursor = "pointer";
      try {
        b.addClass("act-regex-tester-flag");
      } catch (e) {}
      flagButtons[f] = b;
    });
    const styleSelect = controlsRow.createEl("select");
    try {
      styleSelect.addClass("act-regex-tester-style");
    } catch (e) {}
    ["text", "highlight", "both"].forEach((val) => {
      const opt = styleSelect.createEl("option", {
        text: this.plugin.t(
          "style_type_" + val,
          val === "text" ? "color" : val,
        ),
      });
      opt.value = val;
    });
    styleSelect.value = this._preFillStyleType || "both";
    styleSelect.style.border = "1px solid var(--background-modifier-border)";
    styleSelect.style.borderRadius = "var(--input-radius)";
    styleSelect.style.background = "var(--background-modifier-form-field)";
    styleSelect.style.marginTop = "0";

    const markTargetSelect = controlsRow.createEl("select");
    try {
      markTargetSelect.addClass("act-regex-tester-mark-target");
    } catch (e) {}
    [
      ["text", this.plugin.t("mark_target_text", "Color Text")],
      ["line", this.plugin.t("mark_target_line", "Color Line")],
      ["nextLine", this.plugin.t("mark_target_child_line", "Color Child")],
    ].forEach(([val, label]) => {
      const opt = markTargetSelect.createEl("option", { text: label });
      opt.value = val;
    });
    markTargetSelect.value =
      (this._editingEntry && this._editingEntry.markTarget) || "text";
    markTargetSelect.style.border = "1px solid var(--background-modifier-border)";
    markTargetSelect.style.borderRadius = "var(--input-radius)";
    markTargetSelect.style.background = "var(--background-modifier-form-field)";
    markTargetSelect.style.marginTop = "0";

    const textColorInput = controlsRow.createEl("input", { type: "color" });
    try {
      textColorInput.addClass("act-regex-tester-text-color");
    } catch (e) {}
    // Resolve NULL vs REAL via pure helper (tested): untouched pickers are NULL
    // (native black display) → preview var(--text-normal)/var(--color-accent),
    // save "". Preset colors are ignored here: NULL always previews as var.
    const _init = resolveRegexTesterColorInit({
      editingEntry: this._editingEntry,
      preFillTextColor: this._preFillTextColor,
      preFillBgColor: this._preFillBgColor,
      isValidHexColor: (c) => this.plugin.isValidHexColor(c),
    });
    this._preFillTextColor = _init.preFillTextColor;
    this._preFillBgColor = _init.preFillBgColor;
    this._tPickerTouched = _init.tTouched;
    this._bPickerTouched = _init.bTouched;
    // Native color inputs cannot be empty — NULL shows black until the user picks.
    textColorInput.value = this._preFillTextColor || "#000000";
    textColorInput.style.width = "48px";
    const bgColorInput = controlsRow.createEl("input", { type: "color" });
    try {
      bgColorInput.addClass("act-regex-tester-bg-color");
    } catch (e) {}
    bgColorInput.value = this._preFillBgColor || "#000000";
    bgColorInput.style.width = "48px";
    const onTextPickerContext = (ev) => {
      try {
        ev.preventDefault();
      } catch (e) {}
      try {
        ev.stopPropagation();
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
                : null;
            const bc =
              sel.backgroundColor &&
              this.plugin.isValidHexColor(sel.backgroundColor)
                ? sel.backgroundColor
                : null;
            const fallback =
              color && this.plugin.isValidHexColor(color) ? color : null;
            let changed = false;
            if (tc) {
              textColorInput.value = tc;
              this._tPickerTouched = true;
              changed = true;
            } else if (fallback && !bc) {
              textColorInput.value = fallback;
              this._tPickerTouched = true;
              changed = true;
            }
            if (bc) {
              bgColorInput.value = bc;
              this._bPickerTouched = true;
              changed = true;
            }
            if (changed) render();
          },
          "text-and-background",
          (typeof regexInput !== "undefined" && regexInput.value) || "",
          false,
          this._editingEntry ? this._editingEntry.markTarget : "text",
          this._editingEntry,
        );
        modal._hideHeaderControls = true;
        if (textColorInput.value) modal._preFillTextColor = textColorInput.value;
        if (bgColorInput.value) {
          modal._preFillBgColor = bgColorInput.value;
          modal._preFillBorderColor = bgColorInput.value;
        }
        modal.open();
      } catch (e) {}
    };
    const onBgPickerContext = (ev) => {
      try {
        ev.preventDefault();
      } catch (e) {}
      try {
        ev.stopPropagation();
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
                : null;
            const bc =
              sel.backgroundColor &&
              this.plugin.isValidHexColor(sel.backgroundColor)
                ? sel.backgroundColor
                : null;
            const fallback =
              color && this.plugin.isValidHexColor(color) ? color : null;
            let changed = false;
            if (bc) {
              bgColorInput.value = bc;
              this._bPickerTouched = true;
              changed = true;
            } else if (fallback && !tc) {
              bgColorInput.value = fallback;
              this._bPickerTouched = true;
              changed = true;
            }
            if (tc) {
              textColorInput.value = tc;
              this._tPickerTouched = true;
              changed = true;
            }
            if (changed) render();
          },
          "text-and-background",
          (typeof regexInput !== "undefined" && regexInput.value) || "",
          false,
          this._editingEntry ? this._editingEntry.markTarget : "text",
          this._editingEntry,
        );
        modal._hideHeaderControls = true;
        if (textColorInput.value) modal._preFillTextColor = textColorInput.value;
        if (bgColorInput.value) {
          modal._preFillBgColor = bgColorInput.value;
          modal._preFillBorderColor = bgColorInput.value;
        }
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
    const regexInput = contentEl.createEl("input", { type: "text" });
    try {
      regexInput.addClass("act-regex-tester-pattern");
    } catch (e) {}
    regexInput.placeholder = this.plugin.t(
      "regex_expression_placeholder",
      "put your expression here",
    );
    regexInput.style.marginTop = "10px";
    regexInput.style.width = "100%";
    regexInput.style.padding = "10px 14px";
    regexInput.style.borderRadius = "var(--input-radius)";
    regexInput.style.border = "1px solid var(--background-modifier-border)";
    regexInput.style.background = "var(--background-modifier-form-field)";
    regexInput.style.fontFamily = "var(--font-ui-medium)";
    const subjectWrap = contentEl.createDiv();
    subjectWrap.style.marginTop = "10px";
    subjectWrap.style.border = "1px solid var(--background-modifier-border)";
    subjectWrap.addClass("act-subject-wrap");
    subjectWrap.style.borderRadius = "var(--input-radius)";
    subjectWrap.style.cornerShape = "var(--corner-shape)";
    subjectWrap.style.overflow = "hidden";
    subjectWrap.style.background = "var(--background-modifier-form-field)";
    const testInput = subjectWrap.createEl("textarea");
    try {
      testInput.addClass("act-regex-tester-subject");
    } catch (e) {}
    testInput.placeholder = this.plugin.t(
      "regex_subject_placeholder",
      "type your subject / test string here...",
    );
    testInput.style.width = "100%";
    testInput.style.minHeight = "120px";
    testInput.style.height = "120px";
    testInput.style.padding = "12px";
    testInput.style.border = "none";
    testInput.style.outline = "none";
    testInput.style.background = "transparent";
    testInput.style.color = "var(--text-normal)";
    testInput.style.fontFamily = "var(--font-monospace)";
    testInput.style.whiteSpace = "pre-wrap";
    testInput.style.wordBreak = "break-word";
    testInput.style.wordWrap = "break-word";
    testInput.style.boxSizing = "border-box";
    testInput.style.resize = "none";
    const previewWrap = contentEl.createDiv();
    try {
      previewWrap.addClass("act-regex-tester-preview");
    } catch (e) {}
    previewWrap.style.marginTop = "10px";
    previewWrap.style.border = "1px solid var(--background-modifier-border)";
    previewWrap.style.borderRadius = "var(--input-radius)";
    previewWrap.style.cornerShape = "var(--corner-shape)";
    previewWrap.style.padding = "12px";
    previewWrap.style.background = "var(--background-modifier-form-field)";
    previewWrap.style.whiteSpace = "pre-wrap";
    previewWrap.style.wordWrap = "break-word";
    previewWrap.style.fontFamily = "var(--font-ui-medium)";
    previewWrap.style.fontSize = "var(--font-small)";
    previewWrap.style.lineHeight = "1.5";
    previewWrap.style.display = "flex";
    previewWrap.style.alignItems = "center";
    previewWrap.style.justifyContent = "center";
    const nameInput = contentEl.createEl("input", { type: "text" });
    try {
      nameInput.addClass("act-regex-tester-name");
    } catch (e) {}
    nameInput.placeholder = this.plugin.t(
      "regex_name_placeholder",
      "name your regex",
    );
    nameInput.style.marginTop = "10px";
    nameInput.style.width = "100%";
    nameInput.style.padding = "10px 14px";
    nameInput.style.borderRadius = "var(--input-radius)";
    nameInput.style.border = "1px solid var(--background-modifier-border)";
    nameInput.style.background = "var(--background-modifier-form-field)";
    nameInput.style.boxSizing = "border-box";
    const statusRow = contentEl.createDiv();
    try {
      statusRow.addClass("act-regex-tester-status-row");
    } catch (e) {}
    statusRow.style.display = "flex";
    statusRow.style.justifyContent = "space-between";
    statusRow.style.alignItems = "center";
    statusRow.style.gap = "8px";
    statusRow.style.marginTop = "14px";
    const matchFooter = statusRow.createDiv();
    try {
      matchFooter.addClass("act-regex-tester-match");
    } catch (e) {}
    matchFooter.style.opacity = "0.8";
    matchFooter.style.flex = "1";
    const addBtn = statusRow.createEl("button", {
      text: this._editingEntry
        ? this.plugin.t("btn_save_regex", "Save Regex")
        : this.plugin.t("btn_add_regex", "+ Add Regex"),
    });
    addBtn.addClass("mod-cta");
    try {
      addBtn.addClass("act-regex-tester-add");
    } catch (e) {}
    const infoWrap = contentEl.createDiv();
    try {
      infoWrap.addClass("act-regex-tester-info");
    } catch (e) {}
    infoWrap.style.marginTop = "8px";
    infoWrap.style.fontFamily = "monospace";
    infoWrap.style.fontSize = "var(--font-small)";
    const status = infoWrap.createDiv();
    try {
      status.addClass("act-regex-tester-status");
    } catch (e) {}
    status.style.opacity = "0.8";
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
      // Use textarea value for reliable line break handling (plaintext)
      const rawRaw = String(testInput.value || "");
      // Normalize line breaks to \n for consistent regex matching
      const raw = rawRaw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      const patRaw = String(regexInput.value || "").trim();
      const flags = Object.keys(flagButtons)
        .filter((k) => flagButtons[k].dataset.on === "1")
        .join("");
      const f = flags.includes("g") ? flags : flags + "g";
      const markTarget = markTargetSelect.value || "text";
      const style = styleSelect.value;
      const tRaw = textColorInput.value;
      const bRaw = bgColorInput.value;
      // NULL (untouched picker) → text var(--text-normal), bg/border var(--color-accent). Never black.
      const _pv = resolveRegexTesterPreviewColors({
        tRaw,
        bRaw,
        tTouched: this._tPickerTouched,
        bTouched: this._bPickerTouched,
        isValidHexColor: (c) => this.plugin.isValidHexColor(c),
        opacity: this.plugin.settings.backgroundOpacity ?? 25,
        hexToRgba: (c, o) => this.plugin.hexToRgba(c, o),
      });
      const hasValidT = _pv.hasValidT;
      const hasValidB = _pv.hasValidB;
      const t = _pv.t;
      const rgba = _pv.bgCss;
      const radius = this.plugin.settings.highlightBorderRadius ?? 8;
      const pad = this.plugin.settings.highlightHorizontalPadding ?? 4;
      const vpad = this.plugin.settings.highlightVerticalPadding ?? 0;
      const effectiveBForBorder = _pv.effectiveBForBorder;
      const effectiveTForBorder = _pv.effectiveTForBorder;
      const borderStyle =
        style === "text"
          ? ""
          : style === "highlight"
            ? this.plugin.generateBorderStyle(null, effectiveBForBorder)
            : this.plugin.generateBorderStyle(effectiveTForBorder, effectiveBForBorder);
      const matchStyle =
        style === "text"
          ? `color:${t};background:transparent;`
          : style === "highlight"
            ? `background-color:${rgba};border-radius:${radius}px;padding:${vpad}px ${pad}px;color:var(--text-normal);${borderStyle}`
            : `color:${t};background-color:${rgba};border-radius:${radius}px;padding:${vpad}px ${pad}px;${borderStyle}`;
      // For line-level previews, adjust wrapper to block layout
      if (markTarget === "line" || markTarget === "nextLine") {
        previewWrap.style.display = "block";
        previewWrap.style.textAlign = "left";
        previewWrap.style.alignItems = "";
        previewWrap.style.justifyContent = "";
      } else {
        previewWrap.style.display = "flex";
        previewWrap.style.alignItems = "center";
        previewWrap.style.justifyContent = "center";
        previewWrap.style.textAlign = "";
      }
      if (!patRaw) {
        status.textContent = "";
        // For line targets, render lines as blocks to preview line backgrounds even when no pattern
        if (markTarget === "line" || markTarget === "nextLine") {
          if (!raw) {
            previewWrap.innerHTML = `<div style="display:block;opacity:0.6;">${escapeHtml(raw) || "<br>"}</div>`;
          } else {
            const lines = raw.split("\n");
            let out = "";
            for (let i = 0; i < lines.length; i++) {
              const esc = escapeHtml(lines[i]);
              out += `<div style="display:block;min-height:1.2em;">${esc || "&#8203;"}</div>`;
            }
            previewWrap.innerHTML = out;
          }
        } else {
          previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        }
        matchFooter.textContent = "0 " + this.plugin.t("matches", "matches");
        return;
      }
      const pat = this.plugin.sanitizePattern(patRaw, true);
      if (!pat) {
        status.textContent = "";
        if (markTarget === "line" || markTarget === "nextLine") {
          const lines = raw.split("\n");
          let out = "";
          for (let i = 0; i < lines.length; i++) {
            const esc = escapeHtml(lines[i]);
            out += `<div style="display:block;min-height:1.2em;">${esc || "&#8203;"}</div>`;
          }
          previewWrap.innerHTML = out || escapeHtml(raw).replace(/\n/g, "<br>");
        } else {
          previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        }
        matchFooter.textContent = "0 " + this.plugin.t("matches", "matches");
        return;
      }
      if (
        !this.plugin.settings.disableRegexSafety &&
        !this.plugin.validateAndSanitizeRegex(pat)
      ) {
        status.textContent = "";
        if (markTarget === "line" || markTarget === "nextLine") {
          const lines = raw.split("\n");
          let out = "";
          for (let i = 0; i < lines.length; i++) {
            const esc = escapeHtml(lines[i]);
            out += `<div style="display:block;min-height:1.2em;">${esc || "&#8203;"}</div>`;
          }
          previewWrap.innerHTML = out || escapeHtml(raw).replace(/\n/g, "<br>");
        } else {
          previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        }
        matchFooter.textContent = "0 " + this.plugin.t("matches", "matches");
        return;
      }
      let re;
      try {
        re = new RegExp(pat, f);
      } catch (e) {
        status.textContent = "";
        if (markTarget === "line" || markTarget === "nextLine") {
          const lines = raw.split("\n");
          let out = "";
          for (let i = 0; i < lines.length; i++) {
            const esc = escapeHtml(lines[i]);
            out += `<div style="display:block;min-height:1.2em;">${esc || "&#8203;"}</div>`;
          }
          previewWrap.innerHTML = out || escapeHtml(raw).replace(/\n/g, "<br>");
        } else {
          previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        }
        matchFooter.textContent = "0 matches";
        return;
      }
      // Line-level preview: highlight whole lines
      if (markTarget === "line" || markTarget === "nextLine") {
        const lines = raw.split("\n");
        const active = new Set();
        let count = 0;
        // Prevent infinite loop on zero-length matches
        let iter = 0;
        for (const m of raw.matchAll(re)) {
          if (iter++ > 4000) break;
          const s = m.index ?? 0;
          const lineIdx = raw.slice(0, s).split("\n").length - 1;
          let targetIdx = lineIdx;
          if (markTarget === "nextLine") targetIdx = lineIdx + 1;
          if (targetIdx >= 0 && targetIdx < lines.length) active.add(targetIdx);
          // Count even zero-length matches but avoid counting empty that would flood
          if (m[0] !== undefined) count++;
          // Safety for zero-length that could produce excessive matches
          if (count > 2000) break;
        }
        let out = "";
        for (let i = 0; i < lines.length; i++) {
          const esc = escapeHtml(lines[i]);
          const content = esc || "&#8203;";
          if (active.has(i)) {
            out += `<div style="display:block;${matchStyle};margin:0 -12px;padding:2px 12px;box-sizing:border-box;min-height:1.2em;">${content}</div>`;
          } else {
            out += `<div style="display:block;min-height:1.2em;">${content}</div>`;
          }
        }
        // Handle empty input (no lines)
        if (lines.length === 1 && lines[0] === "") {
          out = `<div style="display:block;min-height:1.2em;opacity:0.6;">&#8203;</div>`;
        }
        previewWrap.innerHTML = out;
        matchFooter.textContent = `${count} match${count === 1 ? "" : "es"}`;
        status.textContent = "";
        return;
      }
      // Text-level preview: inline highlights
      let lastIndex = 0;
      let out = "";
      let count = 0;
      let iter = 0;
      for (const m of raw.matchAll(re)) {
        if (iter++ > 4000) break;
        const s = m.index ?? 0;
        const matched = m[0] ?? "";
        const len = matched.length;
        const e = s + len;
        // Guard against zero-length causing infinite empty spans
        if (len === 0) {
          out += escapeHtml(raw.slice(lastIndex, s));
          // Show zero-width match indicator
          out += `<span style="${matchStyle};border-left:2px solid ${t};margin:0 1px;">&#8203;</span>`;
          lastIndex = s;
          // Move lastIndex forward by 1 to avoid re-processing same position if needed
          // But keep count and let engine advance naturally; adjust slice for next iter
          if (lastIndex < raw.length && raw.slice(s, s + 1)) {
            // Consume one char in display to avoid duplicate rendering
            // The next loop's slice will handle the char between s and next match
          }
          count++;
          if (count > 2000) break;
          // Avoid infinite loop when pattern matches empty string at every position
          if (iter > 1000 && len === 0) {
            // If we have many zero-length matches, break early
            if (s >= raw.length) break;
          }
          continue;
        }
        out += escapeHtml(raw.slice(lastIndex, s));
        out += `<span style="${matchStyle}">${escapeHtml(raw.slice(s, e))}</span>`;
        lastIndex = e;
        count++;
        if (count > 2000) break;
      }
      out += escapeHtml(raw.slice(lastIndex));
      previewWrap.innerHTML = out.replace(/\n/g, "<br>");
      matchFooter.textContent = `${count} match${count === 1 ? "" : "es"}`;
      status.textContent = "";
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
    Object.keys(flagButtons).forEach((k) => {
      const btn = flagButtons[k];
      const flagTooltips = {
        i: "ignore case",
        g: "global",
        m: "multiline",
        s: "dotall",
        u: "unicode",
        y: "sticky",
      };
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
    if (this._preFillStyleType) {
      styleSelect.value = this._preFillStyleType;
    }
    if (this._preFillTextColor) {
      textColorInput.value = this._preFillTextColor;
    }
    if (this._preFillBgColor) {
      bgColorInput.value = this._preFillBgColor;
    }
    updatePickerVisibility();
    const onInputImmediate = () => {
      render();
    };
    const onInputDebounced = () => {
      renderDebounced();
    };
    const styleChange = () => {
      updatePickerVisibility();
      render();
    };
    [textColorInput, bgColorInput, styleSelect].forEach((el) => {
      const ev = el === styleSelect ? "change" : "input";
      const baseFn = el === styleSelect ? styleChange : onInputImmediate;
      const fn = (...args) => {
        if (el === textColorInput) this._tPickerTouched = true;
        if (el === bgColorInput) this._bPickerTouched = true;
        return baseFn(...args);
      };
      el.addEventListener(ev, fn);
      this._handlers.push({ el, ev, fn });
    });
    const markTargetChange = () => {
      render();
    };
    markTargetSelect.addEventListener("change", markTargetChange);
    this._handlers.push({ el: markTargetSelect, ev: "change", fn: markTargetChange });
    testInput.addEventListener("input", onInputDebounced);
    this._handlers.push({ el: testInput, ev: "input", fn: onInputDebounced });
    regexInput.addEventListener("input", onInputDebounced);
    this._handlers.push({ el: regexInput, ev: "input", fn: onInputDebounced });
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

      // Handle editing existing word entry - use hasValid so empty pickers save as "" (var preview) not "#000000" black
      if (this._editingEntry) {
        try {
          const style = styleSelect.value;
          const markTarget = markTargetSelect.value;
          const tRawForSave = textColorInput.value;
          const bRawForSave = bgColorInput.value;
          const hasValidTForSave = tRawForSave && this.plugin.isValidHexColor(tRawForSave) && (this._tPickerTouched || !!this._preFillTextColor);
          const hasValidBForSave = bRawForSave && this.plugin.isValidHexColor(bRawForSave) && (this._bPickerTouched || !!this._preFillBgColor);
          const updated = Object.assign({}, this._editingEntry, {
            pattern: pat,
            flags,
            presetLabel: label || undefined,
            styleType: style,
            markTarget: markTarget,
            isRegex: true,
          });
          if (style === "text") {
            updated.color = hasValidTForSave ? tRawForSave : "";
            updated.textColor = null;
            updated._savedTextColor =
              hasValidTForSave ? tRawForSave :
              this._editingEntry._savedTextColor ||
              updated.color ||
              "";
            updated._savedBackgroundColor =
              hasValidBForSave ? bRawForSave :
              this._editingEntry._savedBackgroundColor ||
              "";
            updated.backgroundColor = null;
          } else if (style === "highlight") {
            updated.color = "";
            updated.textColor = "currentColor";
            updated._savedTextColor =
              hasValidTForSave ? tRawForSave : this._editingEntry._savedTextColor || "";
            updated.backgroundColor = hasValidBForSave ? bRawForSave : "";
            updated._savedBackgroundColor =
              hasValidBForSave ? bRawForSave :
              this._editingEntry._savedBackgroundColor ||
              "";
          } else {
            updated.color = "";
            updated.textColor = hasValidTForSave ? tRawForSave : "";
            updated.backgroundColor = hasValidBForSave ? bRawForSave : "";
            updated._savedTextColor =
              hasValidTForSave ? tRawForSave : this._editingEntry._savedTextColor || "";
            updated._savedBackgroundColor =
              hasValidBForSave ? bRawForSave :
              this._editingEntry._savedBackgroundColor ||
              "";
          }
          let idx = -1;
          if (updated && updated.uid)
            idx = this.plugin.settings.wordEntries.findIndex(
              (e) => e && e.uid === updated.uid,
            );
          if (idx === -1)
            idx = this.plugin.settings.wordEntries.indexOf(this._editingEntry);
          if (idx === -1)
            idx = this.plugin.settings.wordEntries.findIndex(
              (e) =>
                e &&
                e.isRegex &&
                String(e.pattern) === String(this._editingEntry.pattern),
            );
          if (idx !== -1) this.plugin.settings.wordEntries[idx] = updated;
          else
            this.plugin.settings.wordEntries.push(
              Object.assign(
                {
                  matchType: this.plugin.settings.partialMatch
                    ? "contains"
                    : "exact",
                },
                updated,
              ),
            );
          this._editingEntry.pattern = updated.pattern;
          this._editingEntry.flags = updated.flags;
          this._editingEntry.presetLabel = updated.presetLabel;
          this._editingEntry.styleType = updated.styleType;
          this._editingEntry.markTarget = updated.markTarget;
          this._editingEntry.color = updated.color;
          this._editingEntry.textColor = updated.textColor;
          this._editingEntry.backgroundColor = updated.backgroundColor;
          this._editingEntry._savedTextColor = updated._savedTextColor;
          this._editingEntry._savedBackgroundColor =
            updated._savedBackgroundColor;
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this.plugin.triggerActiveDocumentRerender();
          try {
            this.onAdded && this.onAdded(updated);
          } catch (e) {}
          new Notice(this.plugin.t("notice_regex_updated", "Regex updated"));
          try {
            const pm = this._parentModal;
            if (pm) {
              try {
                pm.close();
              } catch (_) {}
              setTimeout(() => {
                try {
                  pm.open();
                } catch (_) {}
              }, 50);
            }
          } catch (_) {}
          this.close();
          return;
        } catch (e) {
          debugError("REGEX_TESTER", "entry update error", e);
        }
      }

      // Default: add to word entries (colored texts) - but skip if skipWordEntriesPush flag is set
      if (!this._skipWordEntriesPush) {
        const uid = (() => {
          try {
            return (
              Date.now().toString(36) + Math.random().toString(36).slice(2)
            );
          } catch (e) {
            return Date.now();
          }
        })();
        const style = styleSelect.value;
        const markTarget = markTargetSelect.value;
        const entry = {
          uid,
          isRegex: true,
          pattern: pat,
          flags,
          presetLabel: label || undefined,
          styleType: style,
          markTarget: markTarget,
          persistAtEnd: true,
        };
        const tRawForSave2 = textColorInput.value;
        const bRawForSave2 = bgColorInput.value;
        const hasValidTForSave2 = tRawForSave2 && this.plugin.isValidHexColor(tRawForSave2) && (this._tPickerTouched || !!this._preFillTextColor);
        const hasValidBForSave2 = bRawForSave2 && this.plugin.isValidHexColor(bRawForSave2) && (this._bPickerTouched || !!this._preFillBgColor);
        if (style === "text") {
          entry.color = hasValidTForSave2 ? tRawForSave2 : "";
          entry.textColor = null;
          entry.backgroundColor = null;
          entry._savedTextColor = hasValidTForSave2 ? tRawForSave2 : "";
          entry._savedBackgroundColor = hasValidBForSave2 ? bRawForSave2 : "";
        } else if (style === "highlight") {
          entry.color = "";
          entry.textColor = "currentColor";
          entry.backgroundColor = hasValidBForSave2 ? bRawForSave2 : "";
          entry._savedTextColor = hasValidTForSave2 ? tRawForSave2 : "";
          entry._savedBackgroundColor = hasValidBForSave2 ? bRawForSave2 : "";
        } else {
          entry.color = "";
          entry.textColor = hasValidTForSave2 ? tRawForSave2 : "";
          entry.backgroundColor = hasValidBForSave2 ? bRawForSave2 : "";
          entry._savedTextColor = hasValidTForSave2 ? tRawForSave2 : "";
          entry._savedBackgroundColor = hasValidBForSave2 ? bRawForSave2 : "";
        }
        this.plugin.settings.wordEntries.push(
          Object.assign(
            {
              matchType: this.plugin.settings.partialMatch
                ? "contains"
                : "exact",
            },
            entry,
          ),
        );
        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.forceRefreshAllReadingViews();
        this.plugin.triggerActiveDocumentRerender();
      }

      // Always call the onAdded callback with the entry object (use hasValid so empty pickers → var preview not black)
      const cbTForSave = textColorInput.value;
      const cbBForSave = bgColorInput.value;
      const cbHasValidT = cbTForSave && this.plugin.isValidHexColor(cbTForSave) && (this._tPickerTouched || !!this._preFillTextColor);
      const cbHasValidB = cbBForSave && this.plugin.isValidHexColor(cbBForSave) && (this._bPickerTouched || !!this._preFillBgColor);
      const cbStyle = styleSelect.value;
      const cbMarkTarget = markTargetSelect.value;
      const cbEntry = {
        isRegex: true,
        pattern: pat,
        flags,
        presetLabel: label || undefined,
        styleType: cbStyle,
        markTarget: cbMarkTarget,
        caseSensitive: !!this.plugin.settings.caseSensitive,
      };
      if (cbStyle === "text") {
        cbEntry.color = cbHasValidT ? cbTForSave : "";
        cbEntry.textColor = null;
        cbEntry.backgroundColor = null;
        cbEntry._savedTextColor = cbHasValidT ? cbTForSave : "";
        cbEntry._savedBackgroundColor = cbHasValidB ? cbBForSave : "";
      } else if (cbStyle === "highlight") {
        cbEntry.color = "";
        cbEntry.textColor = "currentColor";
        cbEntry.backgroundColor = cbHasValidB ? cbBForSave : "";
        cbEntry._savedTextColor = cbHasValidT ? cbTForSave : "";
        cbEntry._savedBackgroundColor = cbHasValidB ? cbBForSave : "";
      } else {
        cbEntry.color = "";
        cbEntry.textColor = cbHasValidT ? cbTForSave : "";
        cbEntry.backgroundColor = cbHasValidB ? cbBForSave : "";
        cbEntry._savedTextColor = cbHasValidT ? cbTForSave : "";
        cbEntry._savedBackgroundColor = cbHasValidB ? cbBForSave : "";
      }
      try {
        this.onAdded && this.onAdded(cbEntry);
      } catch (e) {}
      new Notice(this.plugin.t("notice_added_regex", "Regex added"));
      try {
        const pm = this._parentModal;
        if (pm) {
          try {
            pm.close();
          } catch (_) {}
          setTimeout(() => {
            try {
              pm.open();
            } catch (_) {}
          }, 50);
        }
      } catch (_) {}
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
