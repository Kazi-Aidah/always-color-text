import { Modal, Notice, setIcon, Menu } from 'obsidian';
import { debugLog, debugError } from '../utils/debug.js';
import { HighlightStylingModal } from './HighlightStylingModal.js';
import { RealTimeRegexTesterModal } from './RealTimeRegexTesterModal.js';
import { PresetModal } from './PresetModal.js';
import { ColorPickerModal } from './ColorPickerModal.js';
import { AlertModal } from './AlertModal.js';
import { ConfirmationModal } from './ConfirmationModal.js';
import { EditEntryModal } from './EditEntryModal.js';
import { CustomCssModal } from './CustomCssModal.js';

export class EditWordGroupModal extends Modal {
  constructor(app, plugin, group, onSave, onDelete) {
    super(app);
    this.plugin = plugin;
    this.group = JSON.parse(JSON.stringify(group));
    if (!Array.isArray(this.group.entries)) this.group.entries = [];
    this.onSave = onSave;
    this.onDelete = onDelete;
    this._searchQuery = "";
    this._limit = 0; // 0 = show all
    this._limitRegexOnly = false;
    this._limitWordsOnly = false;
    this._limitStyle = null; // 'text' | 'highlight' | 'both' | null
    this._limitMatchStarts = false;
    this._limitMatchEnds = false;
    this._limitMatchExact = false;
    this._listDiv = null;
    this._cleanupHandlers = [];
    this._sortMode = "last-added";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Style the modal
    this.modalEl.style.width = "1000px";
    this.modalEl.style.maxWidth = "95vw";
    try {
      this.modalEl.addClass("act-edit-word-group-modal");
    } catch (e) {
      try {
        this.modalEl.classList.add("act-edit-word-group-modal");
      } catch (_) {}
    }

    // HEADING
    const heading = contentEl.createEl("h2", {
      text: this.plugin.t("edit_word_group_modal_title", "Edit Word Group"),
    });
    heading.style.marginTop = "0";
    heading.style.marginBottom = "15px";

    // TOP ROW: Active/Inactive & Group Name
    const topRow = contentEl.createDiv();
    topRow.style.display = "flex";
    topRow.style.alignItems = "center";
    topRow.style.gap = "10px";
    topRow.style.marginBottom = "15px";
    topRow.style.flexWrap = "wrap";

    const activeSelect = topRow.createEl("select");
    activeSelect.addClass("act-word-group-active-select");
    activeSelect.style.padding = "6px";
    activeSelect.style.borderRadius = "4px";
    activeSelect.style.border = "1px solid var(--background-modifier-border)";
    activeSelect.style.background = "var(--background-modifier-form-field)";
    activeSelect.style.textAlign = "center";
    activeSelect.style.flex = "0 0 auto";
    activeSelect.style.width = "fit-content";
    const optActive = activeSelect.createEl("option", {
      text: this.plugin.t("group_active_label", "Active"),
      value: "true",
    });
    const optInactive = activeSelect.createEl("option", {
      text: this.plugin.t("group_inactive_label", "Inactive"),
      value: "false",
    });
    activeSelect.value = String(!!this.group.active);
    const activeSelectHandler = () => {
      this.group.active = activeSelect.value === "true";
    };
    activeSelect.addEventListener("change", activeSelectHandler);
    this._cleanupHandlers.push(() =>
      activeSelect.removeEventListener("change", activeSelectHandler),
    );

    const nameInput = topRow.createEl("input", {
      type: "text",
      value: this.group.name || "",
    });
    nameInput.style.flex = "1";
    nameInput.style.padding = "6px";
    nameInput.style.borderRadius = "4px";
    nameInput.style.border = "1px solid var(--background-modifier-border)";
    nameInput.placeholder = this.plugin.t(
      "group_name_placeholder",
      "Name your group",
    );
    const nameInputHandler = () => {
      this.group.name = nameInput.value;
    };
    nameInput.addEventListener("input", nameInputHandler);
    this._cleanupHandlers.push(() =>
      nameInput.removeEventListener("input", nameInputHandler),
    );

    const caseSelect = topRow.createEl("select");
    caseSelect.style.padding = "6px";
    caseSelect.style.borderRadius = "4px";
    caseSelect.style.border = "1px solid var(--background-modifier-border)";
    caseSelect.style.background = "var(--background-modifier-form-field)";
    caseSelect.style.textAlign = "center";
    caseSelect.style.flex = "0 0 auto";
    caseSelect.style.width = "fit-content";
    caseSelect.createEl("option", {
      text: this.plugin.t("opt_case_all", "Case Sensitivity (All)"),
      value: "per-entry",
    });
    caseSelect.createEl("option", {
      text: this.plugin.t("opt_case_sensitive", "is case sensitive"),
      value: "true",
    });
    caseSelect.createEl("option", {
      text: this.plugin.t("opt_not_case_sensitive", "not case sensitive"),
      value: "false",
    });
    caseSelect.value =
      typeof this.group.caseSensitiveOverride === "boolean"
        ? this.group.caseSensitiveOverride
          ? "true"
          : "false"
        : "per-entry";
    const caseSelectHandler = () => {
      const v = caseSelect.value;
      if (v === "per-entry") this.group.caseSensitiveOverride = null;
      else this.group.caseSensitiveOverride = v === "true";
    };
    caseSelect.addEventListener("change", caseSelectHandler);
    this._cleanupHandlers.push(() =>
      caseSelect.removeEventListener("change", caseSelectHandler),
    );

    const matchTypeSelect = topRow.createEl("select");
    matchTypeSelect.style.padding = "6px";
    matchTypeSelect.style.borderRadius = "4px";
    matchTypeSelect.style.border =
      "1px solid var(--background-modifier-border)";
    matchTypeSelect.style.background = "var(--background-modifier-form-field)";
    matchTypeSelect.style.textAlign = "center";
    matchTypeSelect.style.flex = "0 0 auto";
    matchTypeSelect.style.width = "fit-content";
    matchTypeSelect.createEl("option", {
      text: this.plugin.t("opt_match_all", "Match Type (All)"),
      value: "per-entry",
    });
    matchTypeSelect.createEl("option", {
      text: this.plugin.t("match_option_contains", "Contains"),
      value: "contains",
    });
    matchTypeSelect.createEl("option", {
      text: this.plugin.t("match_option_exact", "Exact"),
      value: "exact",
    });
    matchTypeSelect.createEl("option", {
      text: this.plugin.t("match_option_starts_with", "Starts With"),
      value: "startswith",
    });
    matchTypeSelect.createEl("option", {
      text: this.plugin.t("match_option_ends_with", "Ends With"),
      value: "endswith",
    });
    matchTypeSelect.value = this.group.matchTypeOverride
      ? String(this.group.matchTypeOverride)
      : "per-entry";
    const matchTypeHandler = () => {
      const v = matchTypeSelect.value;
      this.group.matchTypeOverride = v === "per-entry" ? null : v;
    };
    matchTypeSelect.addEventListener("change", matchTypeHandler);
    this._cleanupHandlers.push(() =>
      matchTypeSelect.removeEventListener("change", matchTypeHandler),
    );

    const editBtn = topRow.createEl("button");
    try {
      setIcon(editBtn, "edit-3");
    } catch (e) {}
    editBtn.title = this.plugin.t(
      "edit_group_highlight_styling",
      "Edit Group Highlight Styling",
    );
    editBtn.style.flex = "0 0 auto";
    editBtn.style.display = "flex";
    editBtn.style.alignItems = "center";
    editBtn.style.justifyContent = "center";
    editBtn.style.padding = "6px";
    editBtn.style.borderRadius = "4px";
    editBtn.style.border = "1px solid var(--background-modifier-border)";
    editBtn.style.background = "var(--background-modifier-form-field)";
    editBtn.style.cursor = "pointer";

    const editHandler = () => {
      new HighlightStylingModal(
        this.app,
        this.plugin,
        this.group,
        this,
        this.group.name,
      ).open();
    };
    editBtn.addEventListener("click", editHandler);
    this._cleanupHandlers.push(() =>
      editBtn.removeEventListener("click", editHandler),
    );

    if (this.plugin.settings.enableCustomCss) {
      const cssBtn = topRow.createEl("button");
      try {
        setIcon(cssBtn, "code");
      } catch (e) {}
      cssBtn.title = this.plugin.t("edit_custom_css_btn", "Edit Custom CSS");
      cssBtn.style.flex = "0 0 auto";
      cssBtn.style.display = "flex";
      cssBtn.style.alignItems = "center";
      cssBtn.style.justifyContent = "center";
      cssBtn.style.padding = "6px";
      cssBtn.style.borderRadius = "4px";
      cssBtn.style.border = "1px solid var(--background-modifier-border)";
      cssBtn.style.background = "var(--background-modifier-form-field)";
      cssBtn.style.cursor = "pointer";
      const cssHandler = () => {
        new CustomCssModal(this.app, this.plugin, this.group).open();
      };
      cssBtn.addEventListener("click", cssHandler);
      this._cleanupHandlers.push(() =>
        cssBtn.removeEventListener("click", cssHandler),
      );
    }

    const enableDisableRow = contentEl.createDiv();
    enableDisableRow.style.display = "grid";
    enableDisableRow.style.gridTemplateColumns =
      "auto minmax(0, 1fr) minmax(0, 1fr) auto minmax(0, 1fr) minmax(0, 1fr)";
    enableDisableRow.style.gap = "8px";
    enableDisableRow.style.alignItems = "center";
    enableDisableRow.style.marginBottom = "12px";

    const enLabel = enableDisableRow.createEl("div", {
      text: this.plugin.t("label_enable_in", "Enable in"),
    });
    enLabel.style.color = "var(--text-muted)";

    const enFoldersInput = enableDisableRow.createEl("input", { type: "text" });
    enFoldersInput.placeholder = "folder1/, folder2/";
    enFoldersInput.style.padding = "6px";
    enFoldersInput.style.borderRadius = "4px";
    enFoldersInput.style.border = "1px solid var(--background-modifier-border)";
    enFoldersInput.value = Array.isArray(this.group.enableFolders)
      ? this.group.enableFolders.join(", ")
      : "";

    const enTagsInput = enableDisableRow.createEl("input", { type: "text" });
    enTagsInput.placeholder = "#tag1, #tag2";
    enTagsInput.style.padding = "6px";
    enTagsInput.style.borderRadius = "4px";
    enTagsInput.style.border = "1px solid var(--background-modifier-border)";
    enTagsInput.value = Array.isArray(this.group.enableTags)
      ? this.group.enableTags
          .map((t) => (t.startsWith("#") ? t : `#${t}`))
          .join(", ")
      : "";

    const disLabel = enableDisableRow.createEl("div", {
      text: this.plugin.t("label_disable_in", "Disable in"),
    });
    disLabel.style.color = "var(--text-muted)";

    const disFoldersInput = enableDisableRow.createEl("input", {
      type: "text",
    });
    disFoldersInput.placeholder = "folder1/, folder2/";
    disFoldersInput.style.padding = "6px";
    disFoldersInput.style.borderRadius = "4px";
    disFoldersInput.style.border =
      "1px solid var(--background-modifier-border)";
    disFoldersInput.value = Array.isArray(this.group.disableFolders)
      ? this.group.disableFolders.join(", ")
      : "";

    const disTagsInput = enableDisableRow.createEl("input", { type: "text" });
    disTagsInput.placeholder = "#tag1, #tag2";
    disTagsInput.style.padding = "6px";
    disTagsInput.style.borderRadius = "4px";
    disTagsInput.style.border = "1px solid var(--background-modifier-border)";
    disTagsInput.value = Array.isArray(this.group.disableTags)
      ? this.group.disableTags
          .map((t) => (t.startsWith("#") ? t : `#${t}`))
          .join(", ")
      : "";

    // Helper to parse lists
    const parseList = (raw, isTag) => {
      const arr = String(raw || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (isTag) return arr.map((t) => t.replace(/^#/, "")).filter(Boolean);
      return arr;
    };

    const enFoldersHandler = () => {
      this.group.enableFolders = parseList(enFoldersInput.value, false);
    };
    const enTagsHandler = () => {
      this.group.enableTags = parseList(enTagsInput.value, true);
    };
    const disFoldersHandler = () => {
      this.group.disableFolders = parseList(disFoldersInput.value, false);
    };
    const disTagsHandler = () => {
      this.group.disableTags = parseList(disTagsInput.value, true);
    };

    enFoldersInput.addEventListener("input", enFoldersHandler);
    enTagsInput.addEventListener("input", enTagsHandler);
    disFoldersInput.addEventListener("input", disFoldersHandler);
    disTagsInput.addEventListener("input", disTagsHandler);

    this._cleanupHandlers.push(() =>
      enFoldersInput.removeEventListener("input", enFoldersHandler),
    );
    this._cleanupHandlers.push(() =>
      enTagsInput.removeEventListener("input", enTagsHandler),
    );
    this._cleanupHandlers.push(() =>
      disFoldersInput.removeEventListener("input", disFoldersHandler),
    );
    this._cleanupHandlers.push(() =>
      disTagsInput.removeEventListener("input", disTagsHandler),
    );

    // contentEl.createEl('hr');

    // SEARCH BAR & LIMIT INPUT ROW
    const searchRow = contentEl.createDiv();
    try {
      searchRow.addClass("act-search-container");
    } catch (e) {
      try {
        searchRow.classList.add("act-search-container");
      } catch (_) {}
    }
    searchRow.style.display = "flex";
    searchRow.style.alignItems = "center";
    searchRow.style.gap = "8px";
    searchRow.style.margin = "8px 0";

    const searchInput = searchRow.createEl("input", { type: "text" });
    searchInput.placeholder = this.plugin.t(
      "search_colored_words_placeholder",
      "Search colored words/patterns…",
    );
    try {
      searchInput.addClass("act-search-input");
    } catch (e) {
      try {
        searchInput.classList.add("act-search-input");
      } catch (_) {}
    }
    searchInput.style.flex = "1 1 auto";
    searchInput.style.padding = "6px";
    searchInput.style.border = "1px solid var(--background-modifier-border)";
    searchInput.style.borderRadius = "var(--input-radius)";
    searchInput.value = this._searchQuery;
    const searchHandler = () => {
      this._searchQuery = String(searchInput.value || "")
        .trim()
        .toLowerCase();
      this._refreshGroupEntries();
    };
    searchInput.addEventListener("input", searchHandler);
    this._cleanupHandlers.push(() =>
      searchInput.removeEventListener("input", searchHandler),
    );

    const searchIcon = searchRow.createDiv();
    try {
      searchIcon.addClass("act-search-icon");
    } catch (e) {
      try {
        searchIcon.classList.add("act-search-icon");
      } catch (_) {}
    }

    const limitInput = searchRow.createEl("input", { type: "text" });
    limitInput.value = String(this._limit);
    limitInput.placeholder = this.plugin.t("limit_input_placeholder", "limit");
    limitInput.title = this.plugin.t(
      "limit_input_tooltip",
      "0=all; number=last N; r=regex; w=words; h=highlight; c=text; b=text+bg; sw=starts; ew=ends; e=exact",
    );
    limitInput.style.width = "80px";
    limitInput.style.padding = "6px";
    limitInput.style.border = "1px solid var(--background-modifier-border)";
    limitInput.style.borderRadius = "var(--input-radius)";
    const limitHandler = () => {
      const raw = String(limitInput.value || "")
        .trim()
        .toLowerCase();
      const parts = raw.split(/\s+/).filter(Boolean);
      const numPart = parts.find((p) => /^\d+$/.test(p));
      const num = numPart ? parseInt(numPart, 10) : NaN;
      this._limit = !isNaN(num) && num >= 0 ? num : 0;
      this._limitRegexOnly = false;
      this._limitWordsOnly = false;
      this._limitStyle = null;
      this._limitMatchStarts = false;
      this._limitMatchEnds = false;
      this._limitMatchExact = false;
      for (const tok of parts) {
        if (tok === "r") this._limitRegexOnly = true;
        else if (tok === "w") this._limitWordsOnly = true;
        else if (tok === "h") this._limitStyle = "highlight";
        else if (tok === "c") this._limitStyle = "text";
        else if (tok === "b") this._limitStyle = "both";
        else if (tok === "sw") this._limitMatchStarts = true;
        else if (tok === "ew") this._limitMatchEnds = true;
        else if (tok === "e") this._limitMatchExact = true;
      }
      this._refreshGroupEntries();
    };
    limitInput.addEventListener("input", limitHandler);
    this._cleanupHandlers.push(() =>
      limitInput.removeEventListener("input", limitHandler),
    );

    const hrBelowSearch = contentEl.createEl("hr");
    hrBelowSearch.style.marginTop = "6px";
    hrBelowSearch.style.marginBottom = "6px";
    hrBelowSearch.style.border = "0px";
    try {
      hrBelowSearch.addClass("act-edit-word-group-hr");
    } catch (e) {
      try {
        hrBelowSearch.classList.add("act-edit-word-group-hr");
      } catch (_) {}
    }

    // ENTRIES LIST CONTAINER
    this._listDiv = contentEl.createDiv();
    this._listDiv.addClass("color-words-list");
    this._listDiv.style.minHeight = "200px";
    this._listDiv.style.maxHeight = "350px";
    this._listDiv.style.overflowY = "auto";
    this._listDiv.style.marginBottom = "15px";
    this._listDiv.style.borderRadius = "4px";
    this._listDiv.style.backgroundColor = "var(--background-primary)";
    this._refreshGroupEntries();

    // BUTTON ROW: Sort | Add Word | Add Regex | Presets
    const buttonRow = contentEl.createDiv();
    buttonRow.style.display = "flex";
    buttonRow.style.gap = "10px";
    buttonRow.style.marginBottom = "15px";
    buttonRow.style.alignItems = "center";

    const sortModes = [
      "last-added",
      "a-z",
      "reverse-a-z",
      "style-order",
      "color",
    ];
    const sortLabels = {
      "last-added": this.plugin.t("sort_label_last-added", "Sort: Last Added"),
      "a-z": this.plugin.t("sort_label_a-z", "Sort: A-Z"),
      "reverse-a-z": this.plugin.t("sort_label_reverse-a-z", "Sort: Z-A"),
      "style-order": this.plugin.t(
        "sort_label_style-order",
        "Sort: Style Order",
      ),
      color: this.plugin.t("sort_label_color", "Sort: Color"),
    };

    const sortBtn = buttonRow.createEl("button");
    sortBtn.textContent = sortLabels[this._sortMode] || "Sort: Last Added";
    sortBtn.style.cursor = "pointer";
    sortBtn.style.padding = "6px 12px";
    sortBtn.style.borderRadius = "4px";
    const sortBtnHandler = () => {
      const currentIndex = sortModes.indexOf(this._sortMode);
      const nextIndex = (currentIndex + 1) % sortModes.length;
      this._sortMode = sortModes[nextIndex];
      sortBtn.textContent = sortLabels[this._sortMode];
      this._refreshGroupEntries();
    };
    sortBtn.addEventListener("click", sortBtnHandler);
    this._cleanupHandlers.push(() =>
      sortBtn.removeEventListener("click", sortBtnHandler),
    );

    const addWordsBtn = buttonRow.createEl("button");
    addWordsBtn.textContent = this.plugin.t("btn_add_words", "+ Add Words");
    addWordsBtn.style.cursor = "pointer";
    addWordsBtn.style.padding = "6px 12px";
    addWordsBtn.style.borderRadius = "4px";
    addWordsBtn.style.flex = "1";
    addWordsBtn.addClass("mod-cta");
    const addWordsHandler = () => {
      this.group.entries.push({
        pattern: "",
        color: "",
        isRegex: false,
        flags: "",
        styleType: "text",
        matchType: "contains",
      });
      this._sortMode = "last-added";
      this._refreshGroupEntries();
      setTimeout(() => {
        this._listDiv.scrollTop = this._listDiv.scrollHeight;
      }, 50);
    };
    addWordsBtn.addEventListener("click", addWordsHandler);
    this._cleanupHandlers.push(() =>
      addWordsBtn.removeEventListener("click", addWordsHandler),
    );

    if (this.plugin.settings.enableRegexSupport) {
      const addRegexBtn = buttonRow.createEl("button");
      addRegexBtn.textContent = this.plugin.t("btn_add_regex", "+ Add Regex");
      addRegexBtn.style.cursor = "pointer";
      addRegexBtn.style.padding = "6px 12px";
      addRegexBtn.style.borderRadius = "4px";
      addRegexBtn.style.flex = "1";
      addRegexBtn.addClass("mod-cta");
      const addRegexHandler = () => {
        this._sortMode = "last-added";
        const onAdded = (entry) => {
          if (entry) {
            this.group.entries.push(entry);
          }
          this._refreshGroupEntries();
        };
        new RealTimeRegexTesterModal(
          this.app,
          this.plugin,
          onAdded,
          null,
          true,
        ).open();
      };
      addRegexBtn.addEventListener("click", addRegexHandler);
      this._cleanupHandlers.push(() =>
        addRegexBtn.removeEventListener("click", addRegexHandler),
      );
    }

    const presetsBtn = buttonRow.createEl("button");
    presetsBtn.textContent = this.plugin.t("btn_presets", "Presets");
    presetsBtn.style.cursor = "pointer";
    presetsBtn.style.padding = "6px 12px";
    presetsBtn.style.borderRadius = "4px";
    const presetsHandler = () => {
      if (!this.plugin.settings.enableRegexSupport) {
        new AlertModal(
          this.app,
          this.plugin,
          this.plugin.t("regex_support", "Regex Support"),
          this.plugin.t("notice_regex_support_disabled"),
          {
            text: this.plugin.t("btn_take_me_there", "Take me there"),
            callback: () => {
              this.close();
              this.plugin.openSettingsAndFocusRegex();
            },
          },
        ).open();
        return;
      }
      new PresetModal(this.app, this.plugin, async (preset) => {
        if (!preset) return;
        new ColorPickerModal(
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
            if (!tc && !bc && (!color || !this.plugin.isValidHexColor(color)))
              return;
            const entry = {
              pattern: preset.pattern,
              isRegex: true,
              flags: preset.flags || "",
              styleType: "text",
              matchType: "contains",
              presetLabel: preset.label,
            };
            // Copy preset properties like affectMarkElements and targetElement
            if (preset.affectMarkElements) entry.affectMarkElements = true;
            if (preset.targetElement)
              entry.targetElement = preset.targetElement;
            if (tc && bc) {
              entry.textColor = tc;
              entry.backgroundColor = bc;
              entry.color = "";
              entry.styleType = "both";
              entry._savedTextColor = tc;
              entry._savedBackgroundColor = bc;
            } else if (tc) {
              entry.color = tc;
              entry.styleType = "text";
              entry._savedTextColor = tc;
            } else if (bc) {
              entry.textColor = "currentColor";
              entry.backgroundColor = bc;
              entry.color = "";
              entry.styleType = "highlight";
              entry._savedBackgroundColor = bc;
            } else {
              entry.color = color;
              entry._savedTextColor = color;
            }
            this.group.entries.push(entry);
            this._sortMode = "last-added";
            this._refreshGroupEntries();
          },
          "text-and-background",
          "",
          false,
        ).open();
      }).open();
    };
    presetsBtn.addEventListener("click", presetsHandler);
    this._cleanupHandlers.push(() =>
      presetsBtn.removeEventListener("click", presetsHandler),
    );

    // FOOTER: Delete & Save buttons
    const footer = contentEl.createDiv();
    footer.style.display = "flex";
    footer.style.justifyContent = "space-between";
    footer.style.alignItems = "center";
    footer.style.marginTop = "15px";
    footer.style.paddingTop = "15px";
    footer.style.borderTop = "1px solid var(--background-modifier-border)";

    const btnDelete = footer.createEl("button", {
      text: this.plugin.t("btn_delete_group", "Delete Group"),
    });
    btnDelete.addClass("mod-warning");
    btnDelete.style.cursor = "pointer";
    btnDelete.style.padding = "8px 16px";
    const deleteHandler = () => {
      new ConfirmationModal(
        this.app,
        this.plugin,
        this.plugin.t("confirm_delete_group_title", "Delete Group"),
        this.plugin.t(
          "confirm_delete_group_desc",
          "Are you sure you want to delete this group?",
        ),
        async () => {
          this.close();
          this.onDelete(this.group);
        },
      ).open();
    };
    btnDelete.addEventListener("click", deleteHandler);
    this._cleanupHandlers.push(() =>
      btnDelete.removeEventListener("click", deleteHandler),
    );

    const btnSave = footer.createEl("button", {
      text: this.plugin.t("btn_save_group", "Save Group"),
    });
    btnSave.addClass("mod-cta");
    btnSave.style.cursor = "pointer";
    btnSave.style.padding = "8px 16px";
    const saveHandler = () => {
      // Ensure all entries have required fields before saving
      this.group.entries.forEach((entry) => {
        if (!entry.hasOwnProperty("pattern")) entry.pattern = "";
        if (!entry.hasOwnProperty("color")) entry.color = "";
        if (!entry.hasOwnProperty("isRegex")) entry.isRegex = false;
        if (!entry.hasOwnProperty("flags")) entry.flags = "";
        if (!entry.hasOwnProperty("styleType")) entry.styleType = "text";
        if (!entry.hasOwnProperty("matchType")) entry.matchType = "contains";
        if (!entry.hasOwnProperty("textColor")) entry.textColor = null;
        if (!entry.hasOwnProperty("backgroundColor"))
          entry.backgroundColor = null;
      });
      this.onSave(this.group);
      this.close();
    };
    btnSave.addEventListener("click", saveHandler);
    this._cleanupHandlers.push(() =>
      btnSave.removeEventListener("click", saveHandler),
    );
  }
  _refreshGroupEntries() {
    // IMPORTANT: Reload the group from current settings to get any external changes
    // (e.g., if entries were moved via EditEntryModal in another modal)
    const currentGroupInSettings = Array.isArray(
      this.plugin.settings.wordEntryGroups,
    )
      ? this.plugin.settings.wordEntryGroups.find(
          (g) => g && g.uid === this.group?.uid,
        )
      : null;

    if (currentGroupInSettings) {
      // Update our copy with the current state from settings
      this.group = currentGroupInSettings;
    }

    if (!this._listDiv) return;
    this._listDiv.empty();

    // Filter entries
    let entries = [...this.group.entries];
    if (this._searchQuery) {
      const q = this._searchQuery.toLowerCase();
      entries = entries.filter((e) => {
        const patterns =
          Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
            ? e.groupedPatterns
            : [String(e.pattern || "")];
        const text = [
          ...patterns.map((p) => p.toLowerCase()),
          String(e.presetLabel || "").toLowerCase(),
          String(e.flags || "").toLowerCase(),
          String(e.styleType || "").toLowerCase(),
        ].join(" ");
        if (this._limitMatchExact) return text === q;
        if (this._limitMatchStarts) return text.startsWith(q);
        if (this._limitMatchEnds) return text.endsWith(q);
        return text.includes(q);
      });
    }
    if (this._limitStyle === "highlight") {
      entries = entries.filter((e) => (e.styleType || "text") === "highlight");
    } else if (this._limitStyle === "text") {
      entries = entries.filter((e) => (e.styleType || "text") === "text");
    } else if (this._limitStyle === "both") {
      entries = entries.filter((e) => (e.styleType || "text") === "both");
    }
    if (this._limitRegexOnly) {
      entries = entries.filter((e) => !!e.isRegex);
    } else if (this._limitWordsOnly) {
      entries = entries.filter((e) => !e.isRegex);
    }

    // Sort entries
    if (this._sortMode === "a-z") {
      entries.sort((a, b) => {
        const patternA = a.pattern || "";
        const patternB = b.pattern || "";
        const aEmpty = String(patternA).trim().length === 0;
        const bEmpty = String(patternB).trim().length === 0;
        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
      });
    } else if (this._sortMode === "reverse-a-z") {
      entries.sort((a, b) => {
        const patternA = a.pattern || "";
        const patternB = b.pattern || "";
        const aEmpty = String(patternA).trim().length === 0;
        const bEmpty = String(patternB).trim().length === 0;
        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        return patternB.toLowerCase().localeCompare(patternA.toLowerCase());
      });
    } else if (this._sortMode === "style-order") {
      const styleOrder = { text: 0, highlight: 1, both: 2 };
      entries.sort((a, b) => {
        const patternA = a.pattern || "";
        const patternB = b.pattern || "";
        const aEmpty = String(patternA).trim().length === 0;
        const bEmpty = String(patternB).trim().length === 0;
        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        const styleA = styleOrder[a.styleType] ?? 0;
        const styleB = styleOrder[b.styleType] ?? 0;
        if (styleA !== styleB) return styleA - styleB;
        return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
      });
    } else if (this._sortMode === "color") {
      entries.sort((a, b) => {
        const patternA = a.pattern || "";
        const patternB = b.pattern || "";
        const aEmpty = String(patternA).trim().length === 0;
        const bEmpty = String(patternB).trim().length === 0;
        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        const colorA = (
          a.backgroundColor ||
          a.textColor ||
          a.color ||
          ""
        ).toLowerCase();
        const colorB = (
          b.backgroundColor ||
          b.textColor ||
          b.color ||
          ""
        ).toLowerCase();
        if (colorA !== colorB) return colorA.localeCompare(colorB);
        return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
      });
    }

    // Limit entries
    const visibleEntries =
      this._limit && this._limit > 0 ? entries.slice(-this._limit) : entries;

    if (visibleEntries.length === 0) {
      this._listDiv.createDiv({
        text: this.plugin.t("no_entries_found", "No entries found."),
      }).style.color = "var(--text-muted)";
      return;
    }

    // Create entry rows - EXACT ORDER: colorstyle | matchtype | input | flags | regex checkbox | text color | bg color | X
    visibleEntries.forEach((entry) => {
      const row = this._listDiv.createDiv();
      try {
        row.addClass("act-entry-row");
      } catch (e) {
        try {
          row.classList.add("act-entry-row");
        } catch (_) {}
      }
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.borderRadius = "4px";

      // 1. STYLE SELECT (Text/Highlight/Both) - default should be "color" which is "text"
      const styleSelect = row.createEl("select");
      styleSelect.style.padding = "6px";
      styleSelect.style.borderRadius = "4px";
      styleSelect.style.border = "1px solid var(--background-modifier-border)";
      styleSelect.style.background = "var(--background-modifier-form-field)";
      styleSelect.style.textAlign = "center";
      // removed transparent background styling per request
      styleSelect.style.maxWidth = "90px";
      styleSelect.style.minWidth = "70px";
      ["text", "highlight", "both"].forEach((val) => {
        const opt = styleSelect.createEl("option", {
          text: this.plugin.t(
            "style_type_" + val,
            val === "text" ? "color" : val,
          ),
        });
        opt.value = val;
      });
      styleSelect.value = entry.styleType || "text";
      const styleSelectHandler = () => {
        entry.styleType = styleSelect.value;
        this._refreshGroupEntries();
      };
      styleSelect.addEventListener("change", styleSelectHandler);

      // 2. MATCH TYPE SELECT
      const matchSelect = row.createEl("select");
      matchSelect.style.padding = "6px";
      matchSelect.style.borderRadius = "4px";
      matchSelect.style.border = "1px solid var(--background-modifier-border)";
      matchSelect.style.background = "var(--background-modifier-form-field)";
      matchSelect.style.textAlign = "center";
      // removed transparent background styling per request
      matchSelect.style.maxWidth = "110px";
      matchSelect.style.minWidth = "90px";
      matchSelect.innerHTML = `<option value="exact">${this.plugin.t("match_option_exact", "Exact")}</option><option value="contains">${this.plugin.t("match_option_contains", "Contains")}</option><option value="startswith">${this.plugin.t("match_option_starts_with", "Starts with")}</option><option value="endswith">${this.plugin.t("match_option_ends_with", "Ends with")}</option>`;
      matchSelect.value = entry.matchType || "contains";
      const matchSelectHandler = () => {
        entry.matchType = matchSelect.value;
      };
      matchSelect.addEventListener("change", matchSelectHandler);

      // Update visibility based on regex status
      const updateVisibility = () => {
        matchSelect.style.display = entry.isRegex ? "none" : "";
      };
      updateVisibility();

      // 3. PATTERN INPUT (with same placeholder as Always Colored Texts)
      const patternInput = row.createEl("input", {
        type: "text",
        value: entry.pattern || "",
      });
      patternInput.style.flex = "1";
      patternInput.style.padding = "6px";
      patternInput.style.borderRadius = "4px";
      patternInput.style.border = "1px solid var(--background-modifier-border)";
      patternInput.placeholder = this.plugin.t(
        "word_pattern_placeholder_long",
        "pattern, word or comma-separated words (e.g. hello, world, foo)",
      );
      const patternHandler = () => {
        entry.pattern = patternInput.value;
      };
      patternInput.addEventListener("change", patternHandler);
      patternInput.addEventListener("blur", patternHandler);

      // 4. FLAGS INPUT (only if regex) - comes before regex checkbox
      let flagsInput = null;
      if (entry.isRegex) {
        flagsInput = row.createEl("input", {
          type: "text",
          value: entry.flags || "",
        });
        flagsInput.style.width = "50px";
        flagsInput.style.padding = "6px";
        flagsInput.style.borderRadius = "4px";
        flagsInput.style.border = "1px solid var(--background-modifier-border)";
        flagsInput.placeholder = this.plugin.t("flags_placeholder", "Flags");
        flagsInput.title = "e.g., i, g, m";
        const flagsHandler = () => {
          entry.flags = flagsInput.value || "";
        };
        flagsInput.addEventListener("change", flagsHandler);
      }

      // 5. REGEX CHECKBOX (NO LABEL)
      const regexChk = row.createEl("input", { type: "checkbox" });
      regexChk.checked = !!entry.isRegex;
      regexChk.title = this.plugin.t("use_regex", "Use Regex");
      const regexChkHandler = () => {
        entry.isRegex = regexChk.checked;
        updateVisibility();
        this._refreshGroupEntries();
      };
      regexChk.addEventListener("change", regexChkHandler);

      // 6. TEXT COLOR PICKER (if text or both)
      let cp = null;
      if (entry.styleType === "text" || entry.styleType === "both") {
        cp = row.createEl("input", { type: "color" });
        cp.style.width = "40px";
        cp.style.height = "40px";
        cp.style.padding = "0";
        cp.style.border = "none";
        cp.style.cursor = "pointer";
        cp.style.borderRadius = "4px";
        const textColor =
          entry.textColor && entry.textColor !== "currentColor"
            ? entry.textColor
            : entry.color || "#000000";
        cp.value = textColor;
        const cpHandler = () => {
          const newColor = cp.value;
          if (!this.plugin.isValidHexColor(newColor)) return;
          if (entry.backgroundColor) {
            entry.textColor = newColor;
            entry.color = "";
            entry.styleType = "both";
            entry._savedTextColor = newColor;
          } else {
            entry.color = newColor;
            entry.textColor = null;
            entry.backgroundColor = null;
            entry.styleType = "text";
            entry._savedTextColor = newColor;
          }
          styleSelect.value = entry.styleType;
        };
        cp.addEventListener("input", cpHandler);
        cp.title = "Text color";

        // RIGHT-CLICK CONTEXT MENU FOR TEXT COLOR PICKER
        const cpContextHandler = (ev) => {
          try {
            ev && ev.preventDefault && ev.preventDefault();
            if (ev && ev.stopPropagation) ev.stopPropagation();
            const preFillText =
              entry.textColor && entry.textColor !== "currentColor"
                ? entry.textColor
                : this.plugin.isValidHexColor(entry.color)
                  ? entry.color
                  : cp.value;
            const displayText = entry.isRegex
              ? entry.pattern || ""
              : Array.isArray(entry.groupedPatterns) &&
                  entry.groupedPatterns.length > 0
                ? entry.groupedPatterns.join(", ")
                : entry.pattern || "";
            const modal = new ColorPickerModal(
              this.app,
              this.plugin,
              async (color, result) => {
                const tc = (result && result.textColor) || color;
                if (!tc || !this.plugin.isValidHexColor(tc)) return;
                const currentStyle = entry.styleType || "text";
                if (currentStyle === "both") {
                  entry.textColor = tc;
                  entry.color = "";
                  entry._savedTextColor = tc;
                } else {
                  entry.color = tc;
                  entry.textColor = null;
                  entry.backgroundColor = null;
                  entry._savedTextColor = tc;
                }
                cp.value = tc;
                this._refreshGroupEntries();
              },
              "text",
              displayText,
              false,
            );
            try {
              modal._preFillTextColor = preFillText;
            } catch (_) {}
            try {
              modal.open();
            } catch (_) {}
          } catch (e) {}
        };
        cp.addEventListener("contextmenu", cpContextHandler);
      }

      // 7. HIGHLIGHT COLOR PICKER (if highlight or both)
      let cpBg = null;
      if (entry.styleType === "highlight" || entry.styleType === "both") {
        cpBg = row.createEl("input", { type: "color" });
        cpBg.style.width = "40px";
        cpBg.style.height = "40px";
        cpBg.style.padding = "0";
        cpBg.style.border = "none";
        cpBg.style.cursor = "pointer";
        cpBg.style.borderRadius = "4px";
        const bgColor =
          entry.backgroundColor || entry._savedBackgroundColor || "#000000";
        cpBg.value = bgColor;
        const cpBgHandler = () => {
          const newColor = cpBg.value;
          if (!this.plugin.isValidHexColor(newColor)) return;
          entry.backgroundColor = newColor;
          if (!entry.textColor || entry.textColor === "currentColor") {
            entry.textColor = "currentColor";
          }
          entry.color = "";
          const hasText = !!(
            entry.textColor && entry.textColor !== "currentColor"
          );
          const hasBg = !!entry.backgroundColor;
          if (hasText && hasBg) {
            entry.styleType = "both";
          } else if (hasBg) {
            entry.styleType = "highlight";
          } else {
            entry.styleType = "text";
          }
          entry._savedBackgroundColor = newColor;
          styleSelect.value = entry.styleType;
        };
        cpBg.addEventListener("input", cpBgHandler);
        cpBg.title = "Highlight color";

        // RIGHT-CLICK CONTEXT MENU FOR HIGHLIGHT COLOR PICKER
        const cpBgContextHandler = (ev) => {
          try {
            ev && ev.preventDefault && ev.preventDefault();
            if (ev && ev.stopPropagation) ev.stopPropagation();
            const preFillBg =
              entry.backgroundColor ||
              entry._savedBackgroundColor ||
              cpBg.value;
            const displayText = entry.isRegex
              ? entry.pattern || ""
              : Array.isArray(entry.groupedPatterns) &&
                  entry.groupedPatterns.length > 0
                ? entry.groupedPatterns.join(", ")
                : entry.pattern || "";
            const modal = new ColorPickerModal(
              this.app,
              this.plugin,
              async (color, result) => {
                const bc = (result && result.backgroundColor) || color;
                if (!bc || !this.plugin.isValidHexColor(bc)) return;
                entry.backgroundColor = bc;
                if (!entry.textColor || entry.textColor === "currentColor") {
                  entry.textColor = "currentColor";
                }
                entry.color = "";
                entry._savedBackgroundColor = bc;
                cpBg.value = bc;
                this._refreshGroupEntries();
              },
              "background",
              displayText,
              false,
            );
            try {
              modal._preFillBgColor = preFillBg;
            } catch (_) {}
            try {
              modal.open();
            } catch (_) {}
          } catch (e) {}
        };
        cpBg.addEventListener("contextmenu", cpBgContextHandler);
      }

      // 8. DELETE BUTTON (commented out — use right-click context menu to delete)
      /* const btnDel = row.createEl("button", {
        text: this.plugin.t("delete_button_text", "✕"),
      });
      btnDel.addClass("mod-warning");
      btnDel.style.cursor = "pointer";
      btnDel.style.padding = "6px 10px";
      btnDel.style.border = "none"; */
      const delHandler = () => {
        const idx = this.group.entries.indexOf(entry);
        if (idx > -1) {
          this.group.entries.splice(idx, 1);
          this._refreshGroupEntries();
        }
      };
      // btnDel.addEventListener("click", delHandler);

      // RIGHT-CLICK CONTEXT MENU ON ROW
      const contextMenuHandler = (ev) => {
        try {
          ev && ev.preventDefault && ev.preventDefault();
          if (ev && ev.stopPropagation) ev.stopPropagation();
          const menu = new Menu(this.app);
          menu.addItem((item) => {
            item
              .setTitle(
                this.plugin.t("edit_entry_details", "Edit Entry Details"),
              )
              .setIcon("pencil")
              .onClick(() => {
                const modal = new EditEntryModal(
                  this.app,
                  this.plugin,
                  entry,
                  () => {
                    this._refreshGroupEntries();
                  },
                );
                modal.open();
              });
          });
          if (entry.isRegex) {
            menu.addItem((item) => {
              item
                .setTitle(
                  this.plugin.t("open_in_regex_tester", "Open in Regex Tester"),
                )
                .setIcon("regex")
                .onClick(() => {
                  const modal = new RealTimeRegexTesterModal(
                    this.app,
                    this.plugin,
                    (updatedEntry) => {
                      if (updatedEntry) {
                        Object.assign(entry, updatedEntry);
                        this._refreshGroupEntries();
                      }
                    },
                  );
                  modal._editingEntry = entry;
                  if (entry.pattern) modal._preFillPattern = entry.pattern;
                  if (entry.flags) modal._preFillFlags = entry.flags;
                  if (entry.presetLabel) modal._preFillName = entry.presetLabel;
                  modal.open();
                });
            });
          }
          menu.addItem((item) => {
            item
              .setTitle(this.plugin.t("duplicate_entry", "Duplicate Entry"))
              .setIcon("copy")
              .onClick(() => {
                const dup = JSON.parse(JSON.stringify(entry));
                this.group.entries.push(dup);
                this._sortMode = "last-added";
                this._refreshGroupEntries();
              });
          });
          menu.addItem((item) => {
            item
              .setTitle(this.plugin.t("context_delete_entry", "Delete entry"))
              .setIcon("trash")
              .onClick(() => {
                const idx = this.group.entries.indexOf(entry);
                if (idx > -1) {
                  this.group.entries.splice(idx, 1);
                  this._refreshGroupEntries();
                }
              });
          });
          menu.showAtPosition({ x: ev.clientX, y: ev.clientY });
        } catch (e) {
          debugError("MODAL", "context menu error", e);
        }
      };
      row.addEventListener("contextmenu", contextMenuHandler);
    });
  }

  onClose() {
    try {
      this.onSave(this.group);
    } catch (e) {}
    try {
      this._cleanupHandlers.forEach((cleanup) => {
        try {
          cleanup();
        } catch (e) {}
      });
      this._cleanupHandlers = [];
      this.contentEl.empty();
    } catch (e) {}
  }
}
