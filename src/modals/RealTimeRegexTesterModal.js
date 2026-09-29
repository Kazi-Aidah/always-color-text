import { Modal, Notice, setIcon } from 'obsidian';
import { escapeHtml, debugError } from '../utils/debug.js';
import { ColorPickerModal } from './ColorPickerModal.js';
import { EditEntryModal } from './EditEntryModal.js';
import { TextStylePresetsModal } from './TextStylePresetsModal.js';
import { adoptPresetColortype, applyPresetStyleToEntry } from '../utils/presetLinker.js';
import {
  computePreviewMatches,
  describePreviewStatus,
  describePreviewNotes,
} from '../services/previewMatcher.js';

const HARDCODED_LEGACY_DEFAULTS = ["#87c760", "#1d5010", "#58bc54", "#205613"];

function isHardcodedLegacyDefault(c) {
  return HARDCODED_LEGACY_DEFAULTS.includes(String(c || "").toLowerCase());
}

function isBareBlack(c) {
  return String(c || "").toLowerCase() === "#000000";
}

/**
 * Entry fields a Style preset (or an Edit Entry visit) can carry onto the
 * regex being built here. They drive the preview's shape and are merged onto
 * the entry when the tester saves.
 */
const STYLE_SHAPE_KEYS = [
  "backgroundOpacity",
  "highlightBorderRadius",
  "cornerShape",
  "highlightHorizontalPadding",
  "highlightVerticalPadding",
  "enableBorderThickness",
  "borderStyle",
  "borderLineStyle",
  "borderOpacity",
  "borderThickness",
  "customCss",
];

const VAR_COLOR_RE = /^var\(\s*--[\w-]+\s*(,\s*[^)]+)?\)$/;

function isVarColor(str) {
  return typeof str === "string" && VAR_COLOR_RE.test(str.trim());
}

/** Resolve a var(--…) colour to hex so a native <input type="color"> can show it. */
function resolveVarToHex(varStr) {
  try {
    const tmp = document.createElement("div");
    tmp.style.color = varStr;
    tmp.style.display = "none";
    document.body.appendChild(tmp);
    const computed = getComputedStyle(tmp).color;
    document.body.removeChild(tmp);
    const m = computed.match(/\d+/g);
    if (m && m.length >= 3) {
      return (
        "#" +
        m
          .slice(0, 3)
          .map((x) => parseInt(x, 10).toString(16).padStart(2, "0"))
          .join("")
      );
    }
  } catch (_) {}
  return null;
}

/**
 * Write a colour into a native colour input. var(--…) colours (which the
 * input cannot hold) are staged in `dataset.varColor` and shown as their
 * resolved hex.
 */
function setColorInputValue(input, colorStr) {
  if (!colorStr) {
    input.value = "#000000";
    delete input.dataset.varColor;
    return;
  }
  if (isVarColor(colorStr)) {
    input.dataset.varColor = colorStr.trim();
    input.value = resolveVarToHex(colorStr) || "#000000";
  } else {
    delete input.dataset.varColor;
    input.value = colorStr;
  }
}

/** Read back what the picker holds — the staged var() colour when present. */
function getColorInputValue(input) {
  if (input.dataset.varColor && isVarColor(input.dataset.varColor)) {
    return input.dataset.varColor;
  }
  return input.value;
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

/** Scratch uid for the style holder of a brand-new regex. */
function makeStyleHolderUid() {
  return (
    "rt-style-" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

/**
 * What a freshly opened tester stages from the DEFAULT Style preset.
 *
 * A brand-new tester (no entry being edited, no colour staged by the caller)
 * opens with the default preset already applied: its shape (radius, padding,
 * border, corner shape, CSS) seeds the style holder, and the colours its
 * colortype needs come back for the pickers — so the first match paints
 * instead of the preview falling over to "no usable colour".
 *
 * Returns null when the preset must keep out of the way: an entry is being
 * edited, the caller staged colours of its own (an explicit pick always wins
 * over the default), or there is no preset at all.
 *
 * @param {object} opts
 * @param {object|null} opts.editingEntry entry being edited (no seed then)
 * @param {string} opts.preFillTextColor colour staged by the caller
 * @param {string} opts.preFillBgColor colour staged by the caller
 * @param {string} opts.preFillStyleType colortype staged by the caller
 * @param {Array<object>} opts.presets plugin.settings.textStylePresets
 * @param {Function} opts.isValidHexColor
 * @returns {{styleEntry:object, styleType:string, textColor:string, bgColor:string}|null}
 */
export function resolveRegexTesterDefaultPreset({
  editingEntry,
  preFillTextColor,
  preFillBgColor,
  preFillStyleType,
  presets,
  isValidHexColor,
}) {
  if (editingEntry) return null;
  if (preFillTextColor || preFillBgColor) return null;
  const list = (Array.isArray(presets) ? presets : []).filter(Boolean);
  const preset = list.find((p) => p && p.isDefault) || list[0] || null;
  if (!preset) return null;
  const styleEntry = {
    uid: makeStyleHolderUid(),
    isRegex: true,
    styleType: preFillStyleType || "both",
    markTarget: "text",
  };
  // Same call a manual preset application makes: shape + preset link + a
  // colortype whose every channel actually holds a colour.
  applyPresetStyleToEntry(styleEntry, preset, isValidHexColor);
  const st = styleEntry.styleType || preFillStyleType || "both";
  const text =
    st === "text"
      ? styleEntry.color || styleEntry.textColor || ""
      : styleEntry.textColor && styleEntry.textColor !== "currentColor"
        ? styleEntry.textColor
        : styleEntry.color || "";
  const bg = st === "text" ? "" : styleEntry.backgroundColor || "";
  return { styleEntry, styleType: st, textColor: text, bgColor: bg };
}

/**
 * Which entry a group dropdown should preselect in the regex tester.
 *
 * - Editing an existing entry → the group that currently holds it (by
 *   `entry.groupUid` first, then by searching every group's entries).
 * - Otherwise an explicitly preselected group (`_preselectedGroupUid`) that
 *   still exists, so callers can open the tester inside a group context.
 *
 * @param {object} opts
 * @param {object|null} opts.editingEntry
 * @param {string|null} [opts.preselectedGroupUid]
 * @param {Array<object>} opts.groupsList
 * @returns {string} group uid, or "" for the default list (No Group)
 */
export function resolveRegexTesterGroupInit({
  editingEntry,
  preselectedGroupUid = null,
  groupsList,
}) {
  const groups = (Array.isArray(groupsList) ? groupsList : []).filter(Boolean);
  if (editingEntry) {
    if (
      editingEntry.groupUid &&
      groups.some((g) => g.uid === editingEntry.groupUid)
    ) {
      return editingEntry.groupUid;
    }
    const sameEntry = (e) =>
      !!e && (e === editingEntry || (!!editingEntry.uid && e.uid === editingEntry.uid));
    for (const g of groups) {
      if (Array.isArray(g.entries) && g.entries.some(sameEntry)) {
        return g.uid || "";
      }
    }
    return "";
  }
  if (preselectedGroupUid && groups.some((g) => g.uid === preselectedGroupUid)) {
    return String(preselectedGroupUid);
  }
  return "";
}

/**
 * File an entry in exactly one place: a word group, or the default word list.
 * An entry that already sits in the target location is left untouched so the
 * group's ordering (which drives render priority) stays stable.
 *
 * Mutates `settings`.
 *
 * @param {object} settings plugin settings
 * @param {object} entry the entry to place
 * @param {string} [targetGroupUid] group uid, or "" for the default list
 * @returns {string} the group uid the entry now belongs to ("" = default list)
 */
export function placeEntryInGroup(settings, entry, targetGroupUid = "") {
  if (!entry || !settings) return "";
  if (!Array.isArray(settings.wordEntries)) settings.wordEntries = [];
  if (!Array.isArray(settings.wordEntryGroups)) settings.wordEntryGroups = [];
  const targetUid = targetGroupUid ? String(targetGroupUid) : "";
  const targetGroup = targetUid
    ? settings.wordEntryGroups.find((g) => g && g.uid === targetUid) || null
    : null;
  const sameEntry = (e) =>
    !!e && (e === entry || (!!entry.uid && e.uid === entry.uid));
  const holds = (list) => Array.isArray(list) && list.some(sameEntry);
  const currentGroup =
    settings.wordEntryGroups.find((g) => g && holds(g.entries)) || null;
  const alreadyPlaced = targetGroup
    ? currentGroup === targetGroup
    : !currentGroup && holds(settings.wordEntries);
  if (alreadyPlaced) return targetGroup ? targetGroup.uid || "" : "";

  const removeFrom = (list) => {
    if (!Array.isArray(list)) return;
    for (let i = list.length - 1; i >= 0; i--) {
      if (sameEntry(list[i])) list.splice(i, 1);
    }
  };
  removeFrom(settings.wordEntries);
  settings.wordEntryGroups.forEach((g) => removeFrom(g && g.entries));

  if (targetGroup) {
    if (!Array.isArray(targetGroup.entries)) targetGroup.entries = [];
    try {
      entry.groupUid = targetGroup.uid || "";
    } catch (e) {}
    targetGroup.entries.push(entry);
    return targetGroup.uid || "";
  }
  try {
    delete entry.groupUid;
  } catch (e) {}
  if (!entry.matchType) {
    entry.matchType = settings.partialMatch ? "contains" : "exact";
  }
  settings.wordEntries.push(entry);
  return "";
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
    this._preselectedGroupUid = null;
    this._handlers = [];
    this._rafId = null;
    this._debounceId = null;
    this._lastValidHTML = "";
    this._tPickerTouched = false;
    this._bPickerTouched = false;
    // Holds the entry's Style (preset / Edit Entry) shape while editing, or a
    // scratch object for a brand new regex. The preview reads its shape and
    // the save path merges it onto the created entry.
    this._styleEntry = null;
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
    // A brand-new tester opens with the default Style preset already applied
    // (shape holder + colours), unless this is an edit or the caller staged
    // colours of its own. Runs first: the controls below read these fields.
    try {
      const seed = resolveRegexTesterDefaultPreset({
        editingEntry: this._editingEntry,
        preFillTextColor: this._preFillTextColor,
        preFillBgColor: this._preFillBgColor,
        preFillStyleType: this._preFillStyleType,
        presets: (this.plugin.settings &&
          this.plugin.settings.textStylePresets) || [],
        isValidHexColor: (c) => this.plugin.isValidHexColor(c),
      });
      if (seed) {
        this._styleEntry = seed.styleEntry;
        this._preFillStyleType = seed.styleType;
        this._preFillTextColor = seed.textColor;
        this._preFillBgColor = seed.bgColor;
      }
    } catch (e) {
      debugError("REGEX_TESTER", "default preset seed failed", e);
    }
    // Header row: "Regex Tester" heading on the left, word group dropdown on the right
    const headerRow = contentEl.createDiv();
    try {
      headerRow.addClass("act-regex-tester-header");
    } catch (e) {}
    headerRow.style.display = "flex";
    headerRow.style.alignItems = "center";
    headerRow.style.gap = "8px";
    headerRow.style.flexWrap = "wrap";
    headerRow.style.marginBottom = "12px";
    const title = headerRow.createEl("h2", {
      text: this.plugin.t("regex_tester_header", "Regex Tester"),
    });
    title.style.marginTop = "0";
    title.style.marginBottom = "0";
    title.style.flex = "1 1 auto";
    try {
      title.addClass("act-regex-title");
    } catch (e) {}

    // Group dropdown: which word group the saved regex is filed under
    const groupsRaw = Array.isArray(this.plugin.settings.wordEntryGroups)
      ? this.plugin.settings.wordEntryGroups
      : [];
    const currentGroupUid = resolveRegexTesterGroupInit({
      editingEntry: this._editingEntry,
      preselectedGroupUid: this._preselectedGroupUid,
      groupsList: groupsRaw,
    });
    const visibleGroups = this.plugin.settings.hideInactiveGroupsInDropdowns
      ? groupsRaw.filter((g) => g && g.active)
      : groupsRaw.filter(Boolean);
    // Never hide the group the entry already belongs to — saving would
    // otherwise silently move it out of that group.
    const currentGroup = currentGroupUid
      ? groupsRaw.find((g) => g && g.uid === currentGroupUid)
      : null;
    if (currentGroup && !visibleGroups.includes(currentGroup)) {
      visibleGroups.push(currentGroup);
    }
    let groupSelect = null;
    if (visibleGroups.length > 0) {
      groupSelect = headerRow.createEl("select");
      try {
        groupSelect.addClass("act-regex-tester-group-select");
      } catch (e) {}
      groupSelect.createEl("option", {
        text: this.plugin.t("no_group", "No Group"),
        value: "",
      });
      visibleGroups.forEach((g) => {
        const name =
          g.name && String(g.name).trim().length > 0
            ? g.name
            : "(unnamed group)";
        groupSelect.createEl("option", { text: name, value: String(g.uid || "") });
      });
      groupSelect.value = currentGroupUid || "";
    }
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
      b.style.cursor = "pointer";
      try {
        b.addClass("act-regex-tester-flag");
      } catch (e) {}
      flagButtons[f] = b;
    });
    // Style holder: the entry itself while editing, the default-preset seed
    // (staged above) for a brand-new regex, or null until one is needed.
    if (this._editingEntry) this._styleEntry = this._editingEntry;
    // The mark-target (Color Text/Line/Child) dropdown no longer lives in the
    // tester — the value simply follows the entry being edited.
    let markTargetValue =
      (this._editingEntry && this._editingEntry.markTarget) || "text";

    // Style (preset) button — same entry point the Pick Color modal has.
    const styleBtn = controlsRow.createEl("button");
    try {
      styleBtn.title = this.plugin.t("btn_style", "Style");
      styleBtn.addClass("act-regex-tester-style-btn");
    } catch (e) {}
    styleBtn.style.flex = "0 0 auto";
    styleBtn.style.display = "flex";
    styleBtn.style.alignItems = "center";
    styleBtn.style.justifyContent = "center";
    styleBtn.style.padding = "6px 10px";
    styleBtn.style.cursor = "pointer";
    styleBtn.style.gap = "4px";
    const styleBtnLabel = styleBtn.createEl("span", {
      text: this.plugin.t("btn_style", "Style"),
    });
    styleBtnLabel.style.fontSize = "12px";

    // Settings icon — opens Edit Entry, exactly like the Pick Color modal.
    const entrySettingsBtn = controlsRow.createEl("button");
    try {
      setIcon(entrySettingsBtn, "settings");
    } catch (e) {}
    entrySettingsBtn.title = this.plugin.t("edit_entry_header", "Edit Entry");
    try {
      entrySettingsBtn.addClass("act-pickr-icon-btn");
    } catch (e) {}
    entrySettingsBtn.style.flex = "0 0 auto";
    entrySettingsBtn.style.display = "flex";
    entrySettingsBtn.style.alignItems = "center";
    entrySettingsBtn.style.justifyContent = "center";
    entrySettingsBtn.style.padding = "6px";
    entrySettingsBtn.style.cursor = "pointer";

    // Color type (text / highlight / both)
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
    styleSelect.style.marginTop = "0";

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
    setColorInputValue(textColorInput, this._preFillTextColor || "");
    const bgColorInput = controlsRow.createEl("input", { type: "color" });
    try {
      bgColorInput.addClass("act-regex-tester-bg-color");
    } catch (e) {}
    setColorInputValue(bgColorInput, this._preFillBgColor || "");
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
              setColorInputValue(textColorInput, tc);
              this._tPickerTouched = true;
              changed = true;
            } else if (fallback && !bc) {
              setColorInputValue(textColorInput, fallback);
              this._tPickerTouched = true;
              changed = true;
            }
            if (bc) {
              setColorInputValue(bgColorInput, bc);
              this._bPickerTouched = true;
              changed = true;
            }
            if (changed) render();
          },
          "text-and-background",
          (typeof regexInput !== "undefined" && regexInput.value) || "",
          false,
          markTargetValue,
          this._editingEntry,
        );
        modal._hideHeaderControls = true;
        modal._forceBothPanels = true;
        const stagedText = getColorInputValue(textColorInput);
        const stagedBg = getColorInputValue(bgColorInput);
        if (stagedText) modal._preFillTextColor = stagedText;
        if (stagedBg) {
          modal._preFillBgColor = stagedBg;
          modal._preFillBorderColor = stagedBg;
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
              setColorInputValue(bgColorInput, bc);
              this._bPickerTouched = true;
              changed = true;
            } else if (fallback && !tc) {
              setColorInputValue(bgColorInput, fallback);
              this._bPickerTouched = true;
              changed = true;
            }
            if (tc) {
              setColorInputValue(textColorInput, tc);
              this._tPickerTouched = true;
              changed = true;
            }
            if (changed) render();
          },
          "text-and-background",
          (typeof regexInput !== "undefined" && regexInput.value) || "",
          false,
          markTargetValue,
          this._editingEntry,
        );
        modal._hideHeaderControls = true;
        modal._forceBothPanels = true;
        const stagedText = getColorInputValue(textColorInput);
        const stagedBg = getColorInputValue(bgColorInput);
        if (stagedText) modal._preFillTextColor = stagedText;
        if (stagedBg) {
          modal._preFillBgColor = stagedBg;
          modal._preFillBorderColor = stagedBg;
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
    subjectWrap.addClass("act-subject-wrap");
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
      const markTarget = markTargetValue;
      const style = styleSelect.value;
      const tRaw = getColorInputValue(textColorInput);
      const bRaw = getColorInputValue(bgColorInput);
      // Shape (radius, padding, opacity, border, corner shape) comes from the
      // entry / applied Style preset, falling back to the global defaults.
      const hp = this.plugin.getHighlightParams(this._styleEntry);
      // NULL (untouched picker) → text var(--text-normal), bg/border var(--color-accent). Never black.
      const _pv = resolveRegexTesterPreviewColors({
        tRaw,
        bRaw,
        tTouched: this._tPickerTouched,
        bTouched: this._bPickerTouched,
        isValidHexColor: (c) => this.plugin.isValidHexColor(c),
        opacity: hp.opacity ?? 25,
        hexToRgba: (c, o) => this.plugin.hexToRgba(c, o),
      });
      const hasValidT = _pv.hasValidT;
      const hasValidB = _pv.hasValidB;
      const t = _pv.t;
      const rgba = _pv.bgCss;
      const radius = hp.radius ?? 8;
      const pad = hp.hPad ?? 4;
      const vpad = hp.vPad ?? 0;
      const cornerShape = hp.cornerShape || "round";
      const cornerCss =
        cornerShape && cornerShape !== "round"
          ? `corner-shape:${cornerShape};`
          : "";
      const effectiveBForBorder = _pv.effectiveBForBorder;
      const effectiveTForBorder = _pv.effectiveTForBorder;
      const borderStyle =
        style === "text"
          ? ""
          : style === "highlight"
            ? this.plugin.generateBorderStyle(
                null,
                effectiveBForBorder,
                this._styleEntry,
              )
            : this.plugin.generateBorderStyle(
                effectiveTForBorder,
                effectiveBForBorder,
                this._styleEntry,
              );
      const matchStyle =
        style === "text"
          ? `color:${t};background:transparent;`
          : style === "highlight"
            ? `background-color:${rgba};border-radius:${radius}px;${cornerCss}padding:${vpad}px ${pad}px;color:var(--text-normal);${borderStyle}`
            : `color:${t};background-color:${rgba};border-radius:${radius}px;${cornerCss}padding:${vpad}px ${pad}px;${borderStyle}`;
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
      // Unified plain renderer for every no-match diagnostic path.
      const renderPlain = (msg, footer) => {
        status.textContent = msg || "";
        if (markTarget === "line" || markTarget === "nextLine") {
          if (!raw) {
            previewWrap.innerHTML = `<div style="display:block;opacity:0.6;">${escapeHtml(raw) || "<br>"}</div>`;
          } else {
            const lines = raw.split("\n");
            let outPlain = "";
            for (let i = 0; i < lines.length; i++) {
              const esc = escapeHtml(lines[i]);
              outPlain += `<div style="display:block;min-height:1.2em;">${esc || "&#8203;"}</div>`;
            }
            previewWrap.innerHTML =
              outPlain || escapeHtml(raw).replace(/\n/g, "<br>");
          }
        } else {
          previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        }
        matchFooter.textContent =
          footer || "0 " + this.plugin.t("matches", "matches");
      };
      if (!patRaw) return renderPlain("");
      // Draft colors computed with the SAME rules the save button uses
      // (add/edit paths) so the preview compiles what the editor will.
      const draftTValid = !!(
        tRaw &&
        this.plugin.isValidHexColor(tRaw) &&
        (this._tPickerTouched || !!this._preFillTextColor)
      );
      const draftBValid = !!(
        bRaw &&
        this.plugin.isValidHexColor(bRaw) &&
        (this._bPickerTouched || !!this._preFillBgColor)
      );
      let draftColor = "";
      let draftTextColor = null;
      let draftBgColor = null;
      if (style === "text") {
        draftColor = draftTValid ? tRaw : "";
      } else if (style === "highlight") {
        draftTextColor = "currentColor";
        draftBgColor = draftBValid ? bRaw : "";
      } else {
        draftTextColor = draftTValid ? tRaw : "";
        draftBgColor = draftBValid ? bRaw : "";
      }
      // Selected group — same resolution the save button files it under.
      let selGroup = null;
      if (groupSelect && groupSelect.value) {
        selGroup =
          (groupsRaw || []).find(
            (g) => g && String(g.uid || "") === String(groupSelect.value),
          ) || null;
      }
      let result;
      try {
        result = computePreviewMatches(this.plugin, {
          pattern: patRaw,
          flags,
          sample: raw,
          caseSensitive:
            this._editingEntry &&
            typeof this._editingEntry.caseSensitive === "boolean"
              ? this._editingEntry.caseSensitive
              : !!this.plugin.settings.caseSensitive,
          matchType: this._editingEntry
            ? this._editingEntry.matchType
            : undefined,
          presetLabel: nameInput.value.trim() || undefined,
          styleType: style,
          markTarget,
          color: draftColor,
          textColor: draftTextColor,
          backgroundColor: draftBgColor,
          entryActive:
            this._editingEntry && typeof this._editingEntry.active === "boolean"
              ? this._editingEntry.active
              : undefined,
          group: selGroup,
          filePath: (() => {
            try {
              const f = this.app.workspace.getActiveFile();
              return f ? f.path : null;
            } catch (_) {
              return null;
            }
          })(),
          editing: !!this._editingEntry,
          // The tester is a style-design surface: it keeps painting matches
          // while the global toggle is off (the editor itself paints nothing).
          ignoreGlobalEnabled: true,
          customCss: this._styleEntry ? this._styleEntry.customCss : undefined,
          affectMarkElements: this._editingEntry
            ? this._editingEntry.affectMarkElements
            : undefined,
        });
      } catch (err) {
        debugError("REGEX_TESTER", "preview compute failed", err);
        return renderPlain(this.plugin.t("preview_error", "Preview failed"));
      }
      if (result.status !== "ok") {
        return renderPlain(
          describePreviewStatus(result, (k, d) => this.plugin.t(k, d)),
        );
      }
      const matches = result.matches;
      const matchCount = matches.length;
      const footerText = `${matchCount} match${matchCount === 1 ? "" : "es"}`;
      // Status line: parity diagnostics (flags forced, whole-word rejections,
      // spoilers/codeblocks, caps, …) — "" when the editor agrees silently.
      status.textContent = describePreviewNotes(
        result,
        (k, d) => this.plugin.t(k, d),
      );
      // Line-level preview: highlight whole lines
      if (markTarget === "line" || markTarget === "nextLine") {
        const lines = raw.split("\n");
        const active = new Set();
        for (const m of matches) {
          const lineIdx = raw.slice(0, m.start).split("\n").length - 1;
          let targetIdx = lineIdx;
          if (markTarget === "nextLine") targetIdx = lineIdx + 1;
          if (targetIdx >= 0 && targetIdx < lines.length) active.add(targetIdx);
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
        matchFooter.textContent = footerText;
        return;
      }
      // Text-level preview: inline highlights (matches are already sorted,
      // non-overlapping and zero-width-free — exactly what the editor paints)
      let lastIndex = 0;
      let out = "";
      for (const m of matches) {
        if (m.start < lastIndex) continue;
        out += escapeHtml(raw.slice(lastIndex, m.start));
        out += `<span style="${matchStyle}">${escapeHtml(raw.slice(m.start, m.end))}</span>`;
        lastIndex = m.end;
      }
      out += escapeHtml(raw.slice(lastIndex));
      previewWrap.innerHTML = out.replace(/\n/g, "<br>");
      matchFooter.textContent = footerText;
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
      setColorInputValue(textColorInput, this._preFillTextColor);
    }
    if (this._preFillBgColor) {
      setColorInputValue(bgColorInput, this._preFillBgColor);
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
        // A hand-picked colour replaces any staged var(--…) value.
        if (el === textColorInput) {
          delete textColorInput.dataset.varColor;
          this._tPickerTouched = true;
        }
        if (el === bgColorInput) {
          delete bgColorInput.dataset.varColor;
          this._bPickerTouched = true;
        }
        return baseFn(...args);
      };
      el.addEventListener(ev, fn);
      this._handlers.push({ el, ev, fn });
    });

    // ── Style button + Settings icon (same pair the Pick Color modal has) ──
    const pickedTextColor = () => {
      const v = getColorInputValue(textColorInput);
      return v && this._tPickerTouched && this.plugin.isValidHexColor(v)
        ? v
        : "";
    };
    const pickedBgColor = () => {
      const v = getColorInputValue(bgColorInput);
      return v && this._bPickerTouched && this.plugin.isValidHexColor(v)
        ? v
        : "";
    };
    const stageTextColor = (c) => {
      if (c && this.plugin.isValidHexColor(c)) {
        setColorInputValue(textColorInput, c);
        this._tPickerTouched = true;
      } else {
        setColorInputValue(textColorInput, "");
        this._tPickerTouched = false;
      }
    };
    const stageBgColor = (c) => {
      if (c && this.plugin.isValidHexColor(c)) {
        setColorInputValue(bgColorInput, c);
        this._bPickerTouched = true;
      } else {
        setColorInputValue(bgColorInput, "");
        this._bPickerTouched = false;
      }
    };
    // Reflect a style entry's colortype + colours back into the controls.
    const syncControlsFromStyleEntry = (entry) => {
      if (!entry) return;
      try {
        if (entry.styleType) styleSelect.value = entry.styleType;
        if (entry.markTarget) markTargetValue = entry.markTarget;
      } catch (e) {}
      const st = entry.styleType || styleSelect.value;
      if (st !== "highlight") {
        const t = st === "text" ? entry.color : entry.textColor;
        if (st === "text" || (t && t !== "currentColor")) stageTextColor(t);
      }
      if (st !== "text") {
        const b = entry.backgroundColor;
        if (st === "highlight" || b) stageBgColor(b);
      }
    };
    const ensureStyleEntry = () => {
      if (!this._styleEntry) {
        this._styleEntry = {
          uid:
            "rt-style-" +
            Date.now().toString(36) +
            Math.random().toString(36).slice(2),
          isRegex: true,
          styleType: styleSelect.value || "both",
          markTarget: markTargetValue,
        };
      }
      return this._styleEntry;
    };
    // Copy the Style holder's shape (+ preset link / matching defaults) onto a
    // freshly created entry. The colours themselves always come from the
    // picker state the save path already reads.
    const mergeStyleInto = (target) => {
      const st = this._styleEntry;
      if (!st || !target || st === target) return;
      for (const k of STYLE_SHAPE_KEYS) {
        if (st[k] !== undefined && st[k] !== null) target[k] = st[k];
      }
      if (st.presetUid) target.presetUid = st.presetUid;
      // case sensitivity only — Edit Entry disables (and forces "regex" on)
      // the match type for regex entries, so that one is never a user choice.
      if (typeof st.caseSensitive === "boolean")
        target.caseSensitive = st.caseSensitive;
    };
    // A Style preset: shape always applies, colours keep whatever is already
    // painted here and the preset fills the channels the colortype needs.
    const applyPresetStyle = (preset) => {
      if (!preset) return;
      try {
        const entry = ensureStyleEntry();
        const st = styleSelect.value || "both";
        const tCur = pickedTextColor();
        const bCur = pickedBgColor();
        if (st === "text") {
          entry.color = tCur;
          entry.textColor = null;
          entry.backgroundColor = null;
        } else if (st === "highlight") {
          entry.color = "";
          entry.textColor = "currentColor";
          entry.backgroundColor = bCur;
        } else {
          entry.color = "";
          entry.textColor = tCur;
          entry.backgroundColor = bCur;
        }
        for (const k of STYLE_SHAPE_KEYS) {
          if (k in preset && preset[k] != null) entry[k] = preset[k];
        }
        if (preset.uid) entry.presetUid = preset.uid;
        entry.styleType = preset.styleType || st;
        adoptPresetColortype(entry, preset, (c) =>
          this.plugin.isValidHexColor(c),
        );
        syncControlsFromStyleEntry(entry);
        updatePickerVisibility();
        render();
      } catch (e) {
        debugError("REGEX_TESTER", "preset apply failed", e);
      }
    };
    const makeDraftEntry = () => {
      const st = styleSelect.value || "both";
      const t = pickedTextColor();
      const b = pickedBgColor();
      const draft = {
        uid:
          "rt-" + Date.now().toString(36) + Math.random().toString(36).slice(2),
        isRegex: true,
        pattern: String(regexInput.value || "").trim(),
        flags: Object.keys(flagButtons)
          .filter((k) => flagButtons[k].dataset.on === "1")
          .join(""),
        presetLabel: String(nameInput.value || "").trim() || undefined,
        styleType: st,
        markTarget: markTargetValue,
        caseSensitive: !!this.plugin.settings.caseSensitive,
        matchType: this.plugin.settings.partialMatch ? "contains" : "exact",
      };
      if (st === "text") {
        draft.color = t;
        draft.textColor = null;
        draft.backgroundColor = null;
      } else if (st === "highlight") {
        draft.color = "";
        draft.textColor = "currentColor";
        draft.backgroundColor = b;
      } else {
        draft.color = "";
        draft.textColor = t;
        draft.backgroundColor = b;
      }
      // Scratch entry: Edit Entry edits it in place and never files it —
      // the tester's own Add/Save button creates the real entry.
      draft._isNewFromPickModal = true;
      draft._originalState = {
        pattern: draft.pattern,
        styleType: draft.styleType,
        color: draft.color,
        textColor: draft.textColor,
        backgroundColor: draft.backgroundColor,
        matchType: draft.matchType,
        markTarget: draft.markTarget,
      };
      return draft;
    };
    const openEntrySettings = () => {
      try {
        let target;
        if (this._editingEntry) {
          // Live entry: Edit Entry writes the style straight onto it.
          target = this._editingEntry;
          this._styleEntry = this._editingEntry;
        } else {
          const draft = makeDraftEntry();
          target = this._styleEntry = Object.assign(
            {},
            this._styleEntry || {},
            draft,
          );
        }
        const onSaved = (entry) => {
          try {
            const e = entry || target;
            this._styleEntry = this._editingEntry ? this._editingEntry : e;
            syncControlsFromStyleEntry(e);
            updatePickerVisibility();
            render();
          } catch (err) {
            debugError("REGEX_TESTER", "entry settings sync failed", err);
          }
        };
        new EditEntryModal(
          this.app,
          this.plugin,
          target,
          onSaved,
          null,
          false,
        ).open();
      } catch (e) {
        debugError("REGEX_TESTER", "open entry settings failed", e);
      }
    };
    const styleBtnHandler = () => {
      try {
        new TextStylePresetsModal(
          this.app,
          this.plugin,
          (preset) => applyPresetStyle(preset),
        ).open();
      } catch (e) {
        debugError("REGEX_TESTER", "open style presets failed", e);
      }
    };
    styleBtn.addEventListener("click", styleBtnHandler);
    this._handlers.push({ el: styleBtn, ev: "click", fn: styleBtnHandler });
    entrySettingsBtn.addEventListener("click", openEntrySettings);
    this._handlers.push({
      el: entrySettingsBtn,
      ev: "click",
      fn: openEntrySettings,
    });
    testInput.addEventListener("input", onInputDebounced);
    this._handlers.push({ el: testInput, ev: "input", fn: onInputDebounced });
    regexInput.addEventListener("input", onInputDebounced);
    this._handlers.push({ el: regexInput, ev: "input", fn: onInputDebounced });
    render();
    const addHandler = async () => {
      const patRaw = String(regexInput.value || "").trim();
      let pat;
      try {
        pat = this.plugin.sanitizePattern(patRaw, true);
      } catch (err) {
        debugError("REGEX_TESTER", "sanitizePattern failed", err);
        new Notice(
          this.plugin.t(
            "notice_pattern_too_long",
            "Pattern too long — the editor limits patterns to 200 characters",
          ),
        );
        return;
      }
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
          const markTarget = markTargetValue;
          const tRawForSave = getColorInputValue(textColorInput);
          const bRawForSave = getColorInputValue(bgColorInput);
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
          // Keep the ORIGINAL entry object — parent modals and the group
          // lists hold a reference to it — and file it under the group chosen
          // in the header dropdown (or leave it alone when there is none).
          Object.assign(this._editingEntry, updated);
          try {
            if (this._editingEntry.customCss)
              this.plugin.syncEntryCssFromColors(this._editingEntry);
          } catch (e) {}
          if (groupSelect) {
            const placedGroupUid = placeEntryInGroup(
              this.plugin.settings,
              this._editingEntry,
              groupSelect.value || "",
            );
            updated.groupUid = placedGroupUid || undefined;
          }
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

      // Default: file in the word group picked in the header (or the default
      // list) - but skip if skipWordEntriesPush flag is set
      let savedGroupUid = null;
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
        const markTarget = markTargetValue;
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
        const tRawForSave2 = getColorInputValue(textColorInput);
        const bRawForSave2 = getColorInputValue(bgColorInput);
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
        // Style (preset / Edit Entry) shape travels with the new entry.
        mergeStyleInto(entry);
        try {
          if (entry.customCss) this.plugin.syncEntryCssFromColors(entry);
        } catch (e) {}
        savedGroupUid = placeEntryInGroup(
          this.plugin.settings,
          entry,
          groupSelect ? groupSelect.value || "" : "",
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
      const cbTForSave = getColorInputValue(textColorInput);
      const cbBForSave = getColorInputValue(bgColorInput);
      const cbHasValidT = cbTForSave && this.plugin.isValidHexColor(cbTForSave) && (this._tPickerTouched || !!this._preFillTextColor);
      const cbHasValidB = cbBForSave && this.plugin.isValidHexColor(cbBForSave) && (this._bPickerTouched || !!this._preFillBgColor);
      const cbStyle = styleSelect.value;
      const cbMarkTarget = markTargetValue;
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
      // Style (preset / Edit Entry) shape travels with the callback entry too.
      mergeStyleInto(cbEntry);
      try {
        if (cbEntry.customCss) this.plugin.syncEntryCssFromColors(cbEntry);
      } catch (e) {}
      // Let the caller know the entry was filed under a word group
      if (savedGroupUid) cbEntry.groupUid = savedGroupUid;
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
