import { Plugin, PluginSettingTab, Setting, Modal, MarkdownView, Notice, FuzzySuggestModal, debounce, MarkdownRenderer, Menu, setIcon, Component, TFile, Platform, requestUrl } from 'obsidian';
import { BloomFilter } from '../utils/BloomFilter.js';
import { PriorityQueue } from '../utils/PriorityQueue.js';
import { SmartEventManager } from '../utils/SmartEventManager.js';
import { CircuitBreaker } from '../utils/CircuitBreaker.js';
import { ErrorRecovery } from '../utils/ErrorRecovery.js';
import { MemoryManager } from '../utils/MemoryManager.js';
import { defaultSettings } from '../settings/defaultSettings.js';
import { ColorSettingTab } from '../settings/SettingsTab.js';
import { buildEditorExtension } from '../features/editorDecorator.js';
import { buildReadingViewProcessor } from '../features/readingViewProcessor.js';
import { compileWordEntriesLogic, compileTextBgColoringEntriesLogic, compileBlacklistEntriesLogic, PatternMatcher, SettingsIndex } from '../services/patternCompiler.js';
import { evaluatePathRulesLogic, hasGlobalExcludeLogic, getBestFolderEntryLogic } from '../services/fileFilter.js';
import { EDITOR_PERFORMANCE_CONSTANTS, REGEX_CONSTANTS, GLOBAL_STYLE_KEYS, IS_DEVELOPMENT } from './constants.js';
import { Decoration, syntaxTree, forceRebuildEffect } from './cmSetup.js';
import { debugLog, debugError, debugWarn, escapeHtml } from '../utils/debug.js';
import { RegexCache } from '../utils/RegexCache.js';
import { getHeadingLevelsFromPattern, getEntryForHeadingLevel } from '../utils/headingUtils.js';
import locales from '../i18n.js';
import { AddToExistingEntryModal } from '../modals/AddToExistingEntryModal.js';
import { PresetModal } from '../modals/PresetModal.js';
import { RegexTesterModal } from '../modals/RegexTesterModal.js';
import { RealTimeRegexTesterModal } from '../modals/RealTimeRegexTesterModal.js';
import { HighlightStylingModal } from '../modals/HighlightStylingModal.js';
import { CustomCssModal } from '../modals/CustomCssModal.js';
import { EditEntryModal } from '../modals/EditEntryModal.js';
import { BlacklistRegexTesterModal } from '../modals/BlacklistRegexTesterModal.js';
import { ChangelogModal } from '../modals/ChangelogModal.js';
import { EditWordGroupModal } from '../modals/EditWordGroupModal.js';
import { SelectBlacklistGroupModal } from '../modals/SelectBlacklistGroupModal.js';
import { EditBlacklistGroupModal } from '../modals/EditBlacklistGroupModal.js';
import { ColorPickerModal } from '../modals/ColorPickerModal.js';
import { AlertModal } from '../modals/AlertModal.js';
import { ConfirmationModal } from '../modals/ConfirmationModal.js';

// Moment is provided by Obsidian
const moment = window.moment;

class AlwaysColorText extends Plugin {
  constructor(...args) {
    super(...args);
    // Global perf monitor to quickly gate heavy operations without capturing `this`
    (function () {
      let lastOperationTime = 0;
      let operationCount = 0;
      const isOverloaded = () => {
        try {
          const now = Date.now();
          if (now - lastOperationTime < 50) {
            // < 50ms ~= 20fps (more lenient)
            operationCount++;
            if (operationCount > 5) return true; // allow a few operations before throttling
          } else {
            operationCount = 0;
          }
          lastOperationTime = now;
        } catch (e) {
          return false;
        }
        return false;
      };
      this.performanceMonitor = { isOverloaded };
    }).call(this);

    // SIMPLIFIED: Keep only essential tracking to reduce memory
    this._perfCounters = {
      totalRegexExecs: 0,
      avoidedRegexExecs: 0,
    };

    // Helper to report or retrieve counters
    this.getPerfCounters = () => Object.assign({}, this._perfCounters);

    // Simple cache for sorted entries
    this._cachedSortedEntries = null;
    this._cacheDirty = true;

    // PERF: Doc version counter - incremented on every docChanged to invalidate blacklist range cache
    this._currentDocVersion = 0;
    this._blacklistRangesCache = null;
    this._blacklistRangesCacheKey = null;

    // WeakMaps to track temporary DOM-related metadata without retaining nodes
    try {
      this._domRefs = new WeakMap();
    } catch (e) {
      // If WeakMap not available, use null (won't happen in modern browsers)
      this._domRefs = null;
    }

    try {
      this._viewportObservers = new Map(); // Use Map for storing observers
    } catch (e) {
      this._viewportObservers = new Map();
    }

    // Throttle perf-gate warnings (timestamp ms)
    this._lastPerfWarning = 0;
    this._commandsRegistered = false;
    this._registeredCommandIds = []; // Track command IDs for re-registration
    this._translations = typeof locales === "object" && locales ? locales : {};
    this._externalTranslations = {};

    this._regexCache = new RegexCache(200); // Increased from 100 to 200 for better caching of compiled regexes

    // OPTIMIZATION: Pre-compile ALL pattern regexes for extreme performance
    // Word entries (regular patterns for coloring text)
    this._compiledWordPatterns = {}; // { patternKey: { regex, pattern, flags, entry } }
    this._wordPatternsCompilationDirty = true;

    // Text+Background entries (patterns for coloring with background)
    this._compiledTextBgPatterns = {}; // { patternKey: { regex, pattern, flags, entry } }
    this._textBgPatternsCompilationDirty = true;

    // Blacklist regexes for performance
    this._compiledBlacklistWords = []; // Pre-compiled regexes for blacklist words
    this._compiledBlacklistEntries = []; // Pre-compiled regexes for blacklist entries
    this._compiledBlacklistGroups = {}; // Pre-compiled regexes for blacklist groups
    this._blacklistCompilationDirty = true; // Track if recompilation needed

    this._bloomFilter = new BloomFilter(2048);
    this._patternMatcher = new PatternMatcher(this.settings, {
      escapeRegex: (s) => this.escapeRegex(s),
      isSentenceLikePattern: (p) => this.isSentenceLikePattern(p),
      safeMatchLoop: (re, t) => this.safeMatchLoop(re, t),
    });
    this._settingsIndex = new SettingsIndex(this.settings);
    this._eventManager = new SmartEventManager();
    this._errorRecovery = new ErrorRecovery();
    this._memoryManager = new MemoryManager(this);
    try {
      this._memoryManager.start();
    } catch (_) {}
    try {
      this._lpObservers = new Map();
    } catch (_) {
      this._lpObservers = new Map();
    }
    try {
      this._readingModeIntervals = new Map();
    } catch (_) {
      this._readingModeIntervals = new Map();
    }
    try {
      this._pathRulesCache = new Map();
    } catch (_) {
      this._pathRulesCache = new Map();
    }

    // Typing tracking for performance optimization
    this._isTyping = false;
    this._lastTypingTime = 0;
    this._typingFlagTimer = null;
    this._lpCalloutRaf = null;
    this._lpTableRaf = null;
  }

  applyDisabledNeutralizerStyles() {
    try {
      let style = document.getElementById("act-inline-neutralizer");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-inline-neutralizer";
        style.textContent = `
          span.always-color-text-highlight { color: inherit !important; background-color: transparent !important; padding: 0 !important; border: none !important; }
          .callout span.always-color-text-highlight { color: inherit !important; background-color: transparent !important; padding: 0 !important; border: none !important; }
          .is-live-preview .callout span.always-color-text-highlight { color: inherit !important; background-color: transparent !important; padding: 0 !important; border: none !important; }
          .is-live-preview .cm-callout span.always-color-text-highlight { color: inherit !important; background-color: transparent !important; padding: 0 !important; border: none !important; }
          .callout .always-color-text-highlight,
          .cm-callout .always-color-text-highlight,
          .markdown-reading-view .callout .always-color-text-highlight,
          .markdown-rendered .callout .always-color-text-highlight {
            --text-normal: inherit !important;
            --link-color: inherit !important;
            --link-external-color: inherit !important;
            --link-unresolved-color: inherit !important;
            --link-color-hover: inherit !important;
            --link-external-color-hover: inherit !important;
            --highlight-color: inherit !important;
          }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {}
  }
  removeDisabledNeutralizerStyles() {
    try {
      const style = document.getElementById("act-inline-neutralizer");
      if (style) style.remove();
    } catch (_) {}
  }

  applyHideHighlightsNeutralizerStyles() {
    try {
      let style = document.getElementById("act-hide-highlights-neutralizer");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-hide-highlights-neutralizer";
        style.textContent = `
          span.always-color-text-highlight { background-color: transparent !important; padding: 0 !important; border: none !important; display: inline !important; box-shadow: none !important; }
          .always-color-text-highlight { background-color: transparent !important; padding: 0 !important; border: none !important; box-shadow: none !important; }
          .callout .always-color-text-highlight,
          .cm-callout .always-color-text-highlight,
          .markdown-reading-view .always-color-text-highlight,
          .markdown-rendered .always-color-text-highlight,
          .cm-content .always-color-text-highlight,
          .cm-line .always-color-text-highlight,
          .is-live-preview .cm-content .always-color-text-highlight { background-color: transparent !important; padding: 0 !important; border: none !important; box-shadow: none !important; }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {}
  }
  removeHideHighlightsNeutralizerStyles() {
    try {
      const style = document.getElementById("act-hide-highlights-neutralizer");
      if (style) style.remove();
    } catch (_) {}
  }

  applyHighlightPresetTransparency() {
    try {
      const hasHighlightPreset =
        Array.isArray(this.settings.wordEntries) &&
        this.settings.wordEntries.some(
          (e) => e.pattern === "==[\\s\\S]*?==" || e.pattern === "==.*?==",
        );

      let style = document.getElementById("act-highlight-preset-transparency");

      if (hasHighlightPreset) {
        if (!style) {
          style = document.createElement("style");
          style.id = "act-highlight-preset-transparency";
          style.textContent = `
            .markdown-rendered mark:not(.always-color-text-highlight-marks) {
              background-color: transparent !important;
              color: inherit !important;
            }
            .cm-highlight {
              background-color: transparent !important;
              color: inherit !important;
            }
            .cm-s-obsidian span.cm-highlight {
              background-color: transparent !important;
              color: inherit !important;
            }
          `;
          document.head.appendChild(style);
        }
      } else {
        if (style) style.remove();
      }
    } catch (_) {}
  }

  removeHighlightPresetTransparency() {
    try {
      const style = document.getElementById(
        "act-highlight-preset-transparency",
      );
      if (style) style.remove();
    } catch (_) {}
  }

  removeFormattingPresetStyles() {
    try {
      const style = document.getElementById("act-formatting-preset-styles");
      if (style) style.remove();
    } catch (_) {}
  }

  applyFormattingPresetStyles() {
    try {
      const entries = Array.isArray(this.settings.wordEntries)
        ? this.settings.wordEntries
        : [];

      // Patterns matching standard Markdown presets in the plugin
      const hasBold = entries.some(
        (e) => e.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1",
      );
      const hasItalic = entries.some(
        (e) => e.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1",
      );
      const hasBoldItalic = entries.some(
        (e) => e.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1",
      );

      let style = document.getElementById("act-formatting-preset-styles");

      if (hasBold || hasItalic || hasBoldItalic) {
        if (!style) {
          style = document.createElement("style");
          style.id = "act-formatting-preset-styles";
          document.head.appendChild(style);
        }

        let css = "";

        if (hasBold) {
          css += `
                .cm-strong, strong {
                    color: inherit !important;
                    background-color: transparent !important;
                }
                .cm-s-obsidian span.cm-strong {
                    color: inherit !important;
                    background-color: transparent !important;
                }
            `;
        }

        if (hasItalic) {
          css += `
                .cm-em, em {
                    color: inherit !important;
                    background-color: transparent !important;
                }
                .cm-s-obsidian span.cm-em {
                    color: inherit !important;
                    background-color: transparent !important;
                }
            `;
        }

        if (hasBoldItalic) {
          css += `
                .cm-strong.cm-em, strong em, em strong {
                    color: inherit !important;
                    background-color: transparent !important;
                }
                 .cm-s-obsidian span.cm-strong.cm-em {
                    color: inherit !important;
                    background-color: transparent !important;
                }
            `;
        }

        style.textContent = css;
      } else {
        if (style) style.remove();
      }
    } catch (_) {}
  }

  neutralizeExistingHighlightBackgrounds() {
    try {
      document
        .querySelectorAll(".always-color-text-highlight")
        .forEach((el) => {
          try {
            el.style.setProperty(
              "background-color",
              "transparent",
              "important",
            );
          } catch (_) {
            el.style.backgroundColor = "transparent";
          }
          el.style.paddingLeft = "0px";
          el.style.paddingRight = "0px";
          el.style.border = "";
          el.style.borderRadius = "";
          el.style.boxShadow = "";
          el.style.display = "inline";
        });
    } catch (_) {}
  }
  applyEnabledLivePreviewCalloutStyles() {
    try {
      let style = document.getElementById("act-livepreview-callout");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-livepreview-callout";
        style.textContent = `
          .is-live-preview .callout .always-color-text-highlight,
          .is-live-preview .callout .always-color-text-highlight *,
          .is-live-preview .cm-callout .always-color-text-highlight,
          .is-live-preview .cm-callout .always-color-text-highlight * {
            --text-normal: var(--highlight-color);
            --link-color: var(--highlight-color);
            --link-external-color: var(--highlight-color);
            --link-unresolved-color: var(--highlight-color);
            --link-color-hover: var(--highlight-color);
            --link-external-color-hover: var(--highlight-color);
            color: var(--highlight-color);
          }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {}
  }
  removeEnabledLivePreviewCalloutStyles() {
    try {
      const style = document.getElementById("act-livepreview-callout");
      if (style) style.remove();
    } catch (_) {}
  }
  applyEnabledLivePreviewTextColorStyles() {
    try {
      let style = document.getElementById("act-livepreview-textcolor");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-livepreview-textcolor";
        style.textContent = `
          .is-live-preview .cm-content .always-color-text-highlight,
          .is-live-preview .cm-content .always-color-text-highlight * {
            color: var(--highlight-color);
          }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {}
  }
  removeEnabledLivePreviewTextColorStyles() {
    try {
      const style = document.getElementById("act-livepreview-textcolor");
      if (style) style.remove();
    } catch (_) {}
  }

  applyEnabledReadingCalloutStyles() {
    try {
      let style = document.getElementById("act-reading-callout");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-reading-callout";
        style.textContent = `
          .markdown-reading-view .callout .always-color-text-highlight,
          .markdown-reading-view .callout .always-color-text-highlight *,
          .markdown-rendered .callout .always-color-text-highlight,
          .markdown-rendered .callout .always-color-text-highlight *,
          .callout .always-color-text-highlight,
          .callout .always-color-text-highlight * {
            --text-normal: var(--highlight-color);
            --link-color: var(--highlight-color);
            --link-external-color: var(--highlight-color);
            --link-unresolved-color: var(--highlight-color);
            --link-color-hover: var(--highlight-color);
            --link-external-color-hover: var(--highlight-color);
            color: var(--highlight-color);
          }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {}
  }
  removeEnabledReadingCalloutStyles() {
    try {
      const style = document.getElementById("act-reading-callout");
      if (style) style.remove();

      // Clear inline CSS variables on existing callout highlight elements
      try {
        document
          .querySelectorAll(
            ".callout .always-color-text-highlight, .cm-callout .always-color-text-highlight, .markdown-reading-view .always-color-text-highlight, .markdown-rendered .always-color-text-highlight",
          )
          .forEach((el) => {
            el.style.removeProperty("--highlight-color");
            el.style.removeProperty("--text-normal");
            el.style.removeProperty("--link-color");
            el.style.removeProperty("--link-external-color");
            el.style.removeProperty("--link-unresolved-color");
            el.style.removeProperty("--link-color-hover");
            el.style.removeProperty("--link-external-color-hover");
            el.style.removeProperty("color");
          });
      } catch (e) {}
    } catch (_) {}
  }

  t(key, fallback, params) {
    try {
      const pref = (this.settings && this.settings.language) || "en";
      const lang = pref === "auto" ? this.resolveSystemLanguageCode() : pref;
      const base =
        this._translations && typeof this._translations === "object"
          ? this._translations
          : typeof locales === "object" && locales
            ? locales
            : {};
      const dict = (base && base[lang]) || (base && base.en) || {};
      let str = dict && dict[key] ? dict[key] : fallback || key;
      if (params && str && typeof str === "string") {
        try {
          for (const k of Object.keys(params)) {
            const v = String(params[k]);
            str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
          }
        } catch (_) {}
      }
      return str;
    } catch (e) {
      return fallback || key;
    }
  }

  resolveSystemLanguageCode() {
    try {
      let raw = "en";
      try {
        raw =
          moment && typeof moment.locale === "function" ? moment.locale() : raw;
      } catch (_) {}
      if (!raw && navigator && navigator.language) raw = navigator.language;
      const code = String(raw).toLowerCase().split("-")[0].split("_")[0];
      const aliases = { bd: "bn", zh: "zh_cn" };
      const resolved = aliases[code] || code;
      const dict =
        this._translations && typeof this._translations === "object"
          ? this._translations
          : typeof locales === "object" && locales
            ? locales
            : {};
      if (dict && dict[resolved]) return resolved;
      return "en";
    } catch (e) {
      return "en";
    }
  }

  getPluginFolderPath() {
    try {
      const id = (this.manifest && this.manifest.id) || "always-color-text";
      return `.obsidian/plugins/${id}`;
    } catch (e) {
      return `.obsidian/plugins/always-color-text`;
    }
  }

  async loadExternalTranslations() {
    // Translations are bundled via i18n.js - keep them loaded
    try {
      const safeLocales = typeof locales === "object" && locales ? locales : {};
      this._externalTranslations = safeLocales;
      this._translations = safeLocales;
    } catch (e) {
      this._translations = {};
    }
  }

  getAvailableLanguages() {
    try {
      const dict =
        this._translations && typeof this._translations === "object"
          ? this._translations
          : typeof locales === "object" && locales
            ? locales
            : {};
      const list = Object.keys(dict);
      return ["auto", ...list];
    } catch (e) {
      return ["auto"];
    }
  }

  async openSettingsAndFocusRegex() {
    try {
      this.app.setting.open();
      await this.app.setting.openTabById(this.manifest.id);

      const tab = this.settingTab;
      if (tab) {
        if (tab._activeTab !== "general") {
          tab._activeTab = "general";
          tab._initializedSettingsUI = false;
          tab.display();
        }

        // Poll for the element in case rendering takes time
        let attempts = 0;
        const findAndScroll = () => {
          const el = tab.containerEl.querySelector(
            ".act-regex-support-setting",
          );
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            // Flash effect
            el.style.transition = "background-color 0.5s";
            const originalBg = el.style.backgroundColor || ""; // Handle empty string case
            el.style.backgroundColor = "var(--text-selection)";
            setTimeout(() => {
              el.style.backgroundColor = originalBg;
            }, 1000);
          } else if (attempts < 20) {
            // Try for ~2 seconds
            attempts++;
            setTimeout(findAndScroll, 100);
          }
        };

        setTimeout(findAndScroll, 100);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async onload() {
    await this.loadSettings();
    this.updateLightModeFixer();
    // Initialize Quick Colors/Styles settings if missing
    if (typeof this.settings.quickColorsEnabled === "undefined")
      this.settings.quickColorsEnabled = false;
    if (!this.settings.quickColorsApplyMode)
      this.settings.quickColorsApplyMode = "html";
    if (!Array.isArray(this.settings.quickColors))
      this.settings.quickColors = [];
    if (!Array.isArray(this.settings.quickStyles))
      this.settings.quickStyles = [];
    if (typeof this.settings.quickStylesEnabled === "undefined")
      this.settings.quickStylesEnabled = true;
    if (typeof this.settings.enableQuickColorHighlightOnce === "undefined")
      this.settings.enableQuickColorHighlightOnce = false;

    // Migrate old global advancedRules to per-entry rules on first load
    try {
      this.migrateAdvancedRulesToPerEntry();
      await this.saveSettings();
    } catch (_) {}
    try {
      await this.loadExternalTranslations();
    } catch (_) {}
    try {
      this.settingTab = new ColorSettingTab(this.app, this);
      this.addSettingTab(this.settingTab);
    } catch (e) {
      try {
        debugError("SETTINGS_TAB", "Failed to initialize settings tab", e);
      } catch (_) {}
    }

    if (this.settings.enabled) {
      this.removeDisabledNeutralizerStyles();
      if (!this.settings.disableLivePreviewColoring) {
        try {
          this.applyEnabledLivePreviewCalloutStyles();
        } catch (_) {}
        try {
          this.applyEnabledLivePreviewTextColorStyles();
        } catch (_) {}
      } else {
        try {
          this.removeEnabledLivePreviewCalloutStyles();
        } catch (_) {}
        try {
          this.removeEnabledLivePreviewTextColorStyles();
        } catch (_) {}
      }
      try {
        this.applyEnabledReadingCalloutStyles();
      } catch (_) {}
      if (this.settings.hideHighlights) {
        this.applyHideHighlightsNeutralizerStyles();
        this.neutralizeExistingHighlightBackgrounds();
      } else {
        this.removeHideHighlightsNeutralizerStyles();
      }
      // Process callouts after a short delay to ensure DOM is ready
      setTimeout(() => {
        if (!this.settings.disableLivePreviewColoring) {
          try {
            this.refreshAllLivePreviewCallouts();
          } catch (_) {}
          try {
            this.refreshAllLivePreviewTables();
          } catch (_) {}
        }
        try {
          this.refreshAllBasesViews();
        } catch (_) {}
        try {
          this.forceRefreshAllReadingViews();
        } catch (_) {}
      }, 250);
    } else {
      this.applyDisabledNeutralizerStyles();
      try {
        this.removeEnabledLivePreviewCalloutStyles();
      } catch (_) {}
      try {
        this.removeEnabledReadingCalloutStyles();
      } catch (_) {}
    }

    if (!this.settings.disableToggleModes.ribbon) {
      this.ribbonIcon = this.addRibbonIcon(
        "palette",
        this.t("ribbon_title", "Always color text"),
        async () => {
          this.settings.enabled = !this.settings.enabled;
          await this.saveSettings();
          this.updateStatusBar();
          // Clear the callout cache when toggling via ribbon
          this._lpCalloutCache = new WeakMap();
          this.reconfigureEditorExtensions();
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
          if (this.settings.enabled)
            new Notice(this.t("notice_enabled", "Always color text enabled"));
          else
            new Notice(this.t("notice_disabled", "Always color text disabled"));
          if (this.settings.enabled) {
            this.removeDisabledNeutralizerStyles();
          } else {
            this.applyDisabledNeutralizerStyles();
          }
          if (!this.settings.enabled) {
            try {
              this.clearAllHighlights();
            } catch (_) {}
          }
          try {
            if (this.settings.enabled) {
              if (!this.settings.disableLivePreviewColoring) {
                this.applyEnabledLivePreviewCalloutStyles();
                this.applyEnabledLivePreviewTextColorStyles();
              } else {
                this.removeEnabledLivePreviewCalloutStyles();
                this.removeEnabledLivePreviewTextColorStyles();
              }
              this.applyEnabledReadingCalloutStyles();
              if (this.settings.hideHighlights) {
                this.applyHideHighlightsNeutralizerStyles();
              } else {
                this.removeHideHighlightsNeutralizerStyles();
              }
            } else {
              this.removeEnabledLivePreviewCalloutStyles();
              this.removeEnabledLivePreviewTextColorStyles();
              this.removeEnabledReadingCalloutStyles();
              this.removeHideHighlightsNeutralizerStyles();
            }
            if (!this.settings.disableLivePreviewColoring) {
              this.refreshAllLivePreviewCallouts();
              this.forceReprocessLivePreviewCallouts();
              this.refreshAllLivePreviewTables();
              this.forceReprocessLivePreviewTables();
            }
            this.refreshAllBasesViews();
            this.forceReprocessBasesViews();
          } catch (_) {}
        },
      );
    }

    // --- The Status bar toggle ---
    if (!this.settings.disableToggleModes.statusBar) {
      this.statusBar = this.addStatusBarItem();
      this.updateStatusBar();
      this.statusBar.onclick = () => {
        this.settings.enabled = !this.settings.enabled;
        this.saveSettings();
        this.updateStatusBar();
        // Clear the callout cache when toggling via status bar
        this._lpCalloutCache = new WeakMap();
        this.reconfigureEditorExtensions();
        this.forceRefreshAllEditors();
        this.forceRefreshAllReadingViews();
        if (this.settings.enabled)
          new Notice(this.t("notice_enabled", "Always color text enabled"));
        else
          new Notice(this.t("notice_disabled", "Always color text disabled"));
        if (this.settings.enabled) {
          this.removeDisabledNeutralizerStyles();
        } else {
          this.applyDisabledNeutralizerStyles();
        }
        if (!this.settings.enabled) {
          try {
            this.clearAllHighlights();
          } catch (_) {}
        }
        try {
          if (this.settings.enabled) {
            if (!this.settings.disableLivePreviewColoring) {
              this.applyEnabledLivePreviewCalloutStyles();
              this.applyEnabledLivePreviewTextColorStyles();
            } else {
              this.removeEnabledLivePreviewCalloutStyles();
              this.removeEnabledLivePreviewTextColorStyles();
            }
            this.applyEnabledReadingCalloutStyles();
            if (this.settings.hideHighlights) {
              this.applyHideHighlightsNeutralizerStyles();
            } else {
              this.removeHideHighlightsNeutralizerStyles();
            }
          } else {
            this.removeEnabledLivePreviewCalloutStyles();
            this.removeEnabledLivePreviewTextColorStyles();
            this.removeEnabledReadingCalloutStyles();
            this.removeHideHighlightsNeutralizerStyles();
          }
          if (!this.settings.disableLivePreviewColoring) {
            this.refreshAllLivePreviewCallouts();
            this.forceReprocessLivePreviewCallouts();
            this.refreshAllLivePreviewTables();
            this.forceReprocessLivePreviewTables();
          }
          this.refreshAllBasesViews();
          this.forceReprocessBasesViews();
        } catch (_) {}
      };
    } else {
      this.statusBar = null;
    }

    // --- Add toggle to the file menu ---
    const { TFile } = require("obsidian");
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (!(file instanceof TFile)) return;
        menu.addItem((item) => {
          const isDisabled = this.settings.disabledFiles.includes(file.path);
          item
            .setTitle(
              isDisabled
                ? this.t(
                    "file_menu_enable",
                    "Enable always color text for this file",
                  )
                : this.t(
                    "file_menu_disable",
                    "Disable always color text for this file",
                  ),
            )
            .setIcon(isDisabled ? "eye" : "eye-off")
            .onClick(async () => {
              if (isDisabled) {
                const index = this.settings.disabledFiles.indexOf(file.path);
                if (index > -1) {
                  this.settings.disabledFiles.splice(index, 1);
                }
              } else {
                this.settings.disabledFiles.push(file.path);
              }
              await this.saveSettings();
              this.forceRefreshAllEditors();
              this.forceRefreshAllReadingViews();
            });
        });
      }),
    );

    // --- Right-click menu for selected text: color and highlight options ---
    // Refresh coloring on metadata changes (tags/properties)
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        if (file === this.app.workspace.getActiveFile()) {
          try {
            if (this._pathRulesCache && file && file.path) {
              this._pathRulesCache.delete(file.path);
            }
          } catch (_) {}
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
        }
      }),
    );

    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        const selectedText = editor.getSelection().trim();
        if (selectedText.length > 0) {
          if (this.settings.enableQuickColorOnce) {
            menu.addItem((item) => {
              item
                .setTitle(this.t("menu_color_once", "Color Once"))
                .setIcon("palette")
                .onClick(() => {
                  new ColorPickerModal(
                    this.app,
                    this,
                    async (color) => {
                      if (color && this.isValidHexColor(color)) {
                        const html = `<span style="color: ${color}">${selectedText}</span>`;
                        editor.replaceSelection(html);
                      }
                    },
                    "text",
                    selectedText,
                    true,
                  ).open();
                });
            });
          }

          if (this.settings.enableQuickHighlightOnce) {
            menu.addItem((item) => {
              item
                .setTitle(this.t("menu_highlight_once", "Highlight Once"))
                .setIcon("highlighter")
                .onClick(() => {
                  new ColorPickerModal(
                    this.app,
                    this,
                    async (color, result) => {
                      const bg =
                        result &&
                        result.backgroundColor &&
                        this.isValidHexColor(result.backgroundColor)
                          ? result.backgroundColor
                          : this.isValidHexColor(color)
                            ? color
                            : null;
                      if (!bg) return;
                      let style = "";
                      const qo = result && result.quickOnceStyle;
                      if (qo) {
                        const params = this.getHighlightParams(qo);
                        const rgba = this.hexToRgba(bg, params.opacity ?? 25);
                        const border = this.generateBorderStyle(null, bg, qo);
                        const hPad = params.hPad ?? 4;
                        const vPad = params.vPad ?? 0;
                        const radius = params.radius ?? 8;
                        const bdb =
                          this.settings.enableBoxDecorationBreak ?? true
                            ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;"
                            : "";
                        style = `background-color: ${rgba}; border-radius: ${radius}px; padding-left: ${hPad}px; padding-right: ${hPad}px; padding-top: ${vPad}px; padding-bottom: ${vPad}px;${bdb}${border}`;
                      } else {
                        if (this.settings.quickHighlightUseGlobalStyle) {
                          const rgba = this.hexToRgba(
                            bg,
                            this.settings.backgroundOpacity ?? 25,
                          );
                          const radius =
                            this.settings.highlightBorderRadius ?? 8;
                          const pad =
                            this.settings.highlightHorizontalPadding ?? 4;
                          const border = this.generateBorderStyle(null, bg);
                          style = `background-color: ${rgba}; border-radius: ${radius}px; padding-left: ${pad}px; padding-right: ${pad}px;${(this.settings.enableBoxDecorationBreak ?? true) ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${border}`;
                        } else if (this.settings.quickHighlightStyleEnable) {
                          const hexWithAlpha = this.hexToHexWithAlpha(
                            bg,
                            this.settings.quickHighlightOpacity ?? 25,
                          );
                          const radius =
                            this.settings.quickHighlightBorderRadius ?? 8;
                          const pad =
                            this.settings.quickHighlightHorizontalPadding ?? 4;
                          const vpad =
                            this.settings.quickHighlightVerticalPadding ?? 0;
                          const border = this.generateOnceBorderStyle(bg);
                          style = `background-color: ${hexWithAlpha}; border-radius: ${radius}px; padding-left: ${pad}px; padding-right: ${pad}px; padding-top: ${vpad}px; padding-bottom: ${vpad}px;${border}`;
                        } else {
                          const rgba = this.hexToRgba(bg, 25);
                          style = `background-color: ${rgba};`;
                        }
                      }
                      const html = `<span style="${style}">${selectedText}</span>`;
                      editor.replaceSelection(html);
                    },
                    "background",
                    selectedText,
                    true,
                  ).open();
                });
            });
          }

          const cpm = this.settings.colorPickerMode || "both";
          const isBoth =
            cpm === "both" ||
            cpm === "both-bg-left" ||
            cpm === "both-v-text-top" ||
            cpm === "both-v-bg-top";
          if (this.settings.enableQuickColorHighlightOnce && isBoth) {
            menu.addItem((item) => {
              item
                .setTitle(
                  this.t("menu_color_highlight_once", "Color / Highlight Once"),
                )
                .setIcon("paintbrush")
                .onClick(() => {
                  new ColorPickerModal(
                    this.app,
                    this,
                    async (color, result) => {
                      const tc =
                        result &&
                        result.textColor &&
                        this.isValidHexColor(result.textColor)
                          ? result.textColor
                          : null;
                      const bg =
                        result &&
                        result.backgroundColor &&
                        this.isValidHexColor(result.backgroundColor)
                          ? result.backgroundColor
                          : null;

                      if (!tc && !bg) return;

                      let style = "";
                      const qo = result && result.quickOnceStyle;
                      if (qo) {
                        if (tc) style += `color: ${tc}; `;
                        if (bg) {
                          const params = this.getHighlightParams(qo);
                          const rgba = this.hexToRgba(
                            bg,
                            params.opacity ?? 25,
                          );
                          const border = this.generateBorderStyle(
                            null,
                            bg,
                            qo,
                          );
                          const hPad = params.hPad ?? 4;
                          const vPad = params.vPad ?? 0;
                          const radius = params.radius ?? 8;
                          const bdb =
                            this.settings.enableBoxDecorationBreak ?? true
                              ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;"
                              : "";
                          style += `background-color: ${rgba}; border-radius: ${radius}px; padding-left: ${hPad}px; padding-right: ${hPad}px; padding-top: ${vPad}px; padding-bottom: ${vPad}px;${bdb}${border}`;
                        }
                      } else {
                        if (tc) style += `color: ${tc}; `;
                        if (bg) {
                          if (this.settings.quickHighlightUseGlobalStyle) {
                            const rgba = this.hexToRgba(
                              bg,
                              this.settings.backgroundOpacity ?? 25,
                            );
                            const radius =
                              this.settings.highlightBorderRadius ?? 8;
                            const pad =
                              this.settings.highlightHorizontalPadding ?? 4;
                            const border = this.generateBorderStyle(null, bg);
                            style += `background-color: ${rgba}; border-radius: ${radius}px; padding-left: ${pad}px; padding-right: ${pad}px;${(this.settings.enableBoxDecorationBreak ?? true) ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${border}`;
                          } else if (this.settings.quickHighlightStyleEnable) {
                            const hexWithAlpha = this.hexToHexWithAlpha(
                              bg,
                              this.settings.quickHighlightOpacity ?? 25,
                            );
                            const radius =
                              this.settings.quickHighlightBorderRadius ?? 8;
                            const pad =
                              this.settings.quickHighlightHorizontalPadding ??
                              4;
                            const vpad =
                              this.settings.quickHighlightVerticalPadding ?? 0;
                            const border = this.generateOnceBorderStyle(bg);
                            style += `background-color: ${hexWithAlpha}; border-radius: ${radius}px; padding-left: ${pad}px; padding-right: ${pad}px; padding-top: ${vpad}px; padding-bottom: ${vpad}px;${border}`;
                          } else {
                            const rgba = this.hexToRgba(bg, 25);
                            style += `background-color: ${rgba};`;
                          }
                        }
                      }

                      const html = `<span style="${style.trim()}">${selectedText}</span>`;
                      editor.replaceSelection(html);
                    },
                    "text-and-background",
                    selectedText,
                    true,
                  ).open();
                });
            });
          }

          // Check if selection contains any colored/highlighted span(s)
          const hasColorSpan =
            /<span\b[^>]*(?:style="[^"]*(?:color|background-color)[^"]*"|class="[^"]*\balways-color-text-highlight\b[^"]*")[^>]*>/i.test(
              selectedText,
            );
          if (hasColorSpan) {
            menu.addItem((item) => {
              item
                .setTitle(
                  this.t("menu_remove_inline_color", "Remove Inline Color"),
                )
                .setIcon("trash")
                .onClick(() => {
                  // Remove ALL span wrappers within the selection, preserving inner text
                  const stripped = String(selectedText)
                    .replace(/<span\b[^>]*>/gi, "")
                    .replace(/<\/span>/gi, "");
                  editor.replaceSelection(stripped);
                });
            });
          }

          if (
            this.settings.enableAddToExistingMenu &&
            Array.isArray(this.settings.wordEntries) &&
            this.settings.wordEntries.length > 0
          ) {
            menu.addItem((item) => {
              item
                .setTitle(
                  this.t(
                    "command_add_to_existing_entry",
                    "add to existing entry",
                  ),
                )
                .setIcon("plus")
                .onClick(() => {
                  try {
                    new AddToExistingEntryModal(
                      this.app,
                      this,
                      selectedText,
                      view,
                    ).open();
                  } catch (e) {
                    new Notice(
                      this.t(
                        "notice_error_opening_modal",
                        "Unable to open modal",
                      ),
                    );
                  }
                });
            });
          }

          if (this.settings.enableAlwaysColorTextMenu) {
            menu.addItem((item) => {
              item
                .setTitle(this.t("menu_always_color_text", "Always color text"))
                .setIcon("palette")
                .onClick(() => {
                  if (this.isWordBlacklisted(selectedText, view.file.path)) {
                    new Notice(
                      this.t(
                        "notice_blacklisted_cannot_color",
                        `"${selectedText}" is blacklisted and cannot be colored.`,
                        { word: selectedText },
                      ),
                    );
                    return;
                  }
                  new ColorPickerModal(
                    this.app,
                    this,
                    async (color, result) => {
                      const sel = result || {};
                      const tc =
                        sel.textColor && this.isValidHexColor(sel.textColor)
                          ? sel.textColor
                          : null;
                      const bc =
                        sel.backgroundColor &&
                        this.isValidHexColor(sel.backgroundColor)
                          ? sel.backgroundColor
                          : null;
                      const selGroupUid = sel.selectedGroupUid || null;
                      const matchType =
                        sel.matchType ||
                        (this.settings.partialMatch ? "contains" : "exact");
                      const applyToArr = (arr) => {
                        const idx = arr.findIndex(
                          (e) => e && e.pattern === selectedText && !e.isRegex,
                        );
                        if (idx !== -1) {
                          const entry = arr[idx];
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
                            entry.textColor = null;
                            entry.backgroundColor = null;
                            entry._savedTextColor = tc;
                          } else if (bc) {
                            entry.color = "";
                            entry.textColor = "currentColor";
                            entry.backgroundColor = bc;
                            entry.styleType = "highlight";
                            entry._savedBackgroundColor = bc;
                          } else if (color && this.isValidHexColor(color)) {
                            entry.color = color;
                            entry.styleType = "text";
                            entry._savedTextColor = color;
                          }
                          if (!entry.isRegex) entry.matchType = matchType;
                        } else {
                          if (tc && bc) {
                            arr.push({
                              pattern: selectedText,
                              color: "",
                              textColor: tc,
                              backgroundColor: bc,
                              isRegex: false,
                              flags: "",
                              styleType: "both",
                              matchType,
                              _savedTextColor: tc,
                              _savedBackgroundColor: bc,
                            });
                          } else if (tc) {
                            arr.push({
                              pattern: selectedText,
                              color: tc,
                              isRegex: false,
                              flags: "",
                              styleType: "text",
                              matchType,
                              _savedTextColor: tc,
                            });
                          } else if (bc) {
                            arr.push({
                              pattern: selectedText,
                              color: "",
                              textColor: "currentColor",
                              backgroundColor: bc,
                              isRegex: false,
                              flags: "",
                              styleType: "highlight",
                              matchType,
                              _savedBackgroundColor: bc,
                            });
                          } else if (color && this.isValidHexColor(color)) {
                            arr.push({
                              pattern: selectedText,
                              color: color,
                              isRegex: false,
                              flags: "",
                              styleType: "text",
                              matchType,
                              _savedTextColor: color,
                            });
                          }
                        }
                      };
                      if (selGroupUid) {
                        const group = Array.isArray(
                          this.settings.wordEntryGroups,
                        )
                          ? this.settings.wordEntryGroups.find(
                              (g) => g && g.uid === selGroupUid,
                            )
                          : null;
                        if (group) {
                          if (!Array.isArray(group.entries)) group.entries = [];
                          applyToArr(group.entries);
                        } else {
                          applyToArr(this.settings.wordEntries);
                        }
                      } else {
                        applyToArr(this.settings.wordEntries);
                      }
                      await this.saveSettings();
                      this.compileWordEntries();
                      this.compileTextBgColoringEntries();
                      this.reconfigureEditorExtensions();
                      this.refreshEditor(view, true);
                    },
                    "text-and-background",
                    selectedText,
                    false,
                  ).open();
                });
            });
          }

          // Quick Colors / Styles menu behavior
          const stylesArr = Array.isArray(this.settings.quickStyles)
            ? this.settings.quickStyles
            : [];
          // Reset active color selection for this context menu
          this._lastSelectedQuickColor = null;
          let closeMenuTimeout = null;
          const openStylesSubmenu = (anchorEvent, anchorElement = null) => {
            if (closeMenuTimeout) {
              clearTimeout(closeMenuTimeout);
              closeMenuTimeout = null;
            }
            if (!this.settings.quickStylesEnabled) return;
            // Remove any previously open submenu to prevent duplicates
            if (this._openQuickStylesSubmenu) {
              try {
                this._openQuickStylesSubmenu.hide();
              } catch (_) {}
              this._openQuickStylesSubmenu = null;
            }
            const sub = new Menu();
            stylesArr.forEach((style) => {
              sub.addItem((subItem) => {
                const frag = document.createDocumentFragment();
                const wrapper = document.createElement("div");
                wrapper.style.display = "flex";
                wrapper.style.alignItems = "center";
                wrapper.style.gap = "8px";
                const nameEl = document.createElement("div");
                nameEl.textContent = style.name || "Style";
                // When a color dot is active, override style colors with the active dot
                const active = this._lastSelectedQuickColor || null;
                const styleType =
                  style && style.styleType ? style.styleType : "both";
                const tc =
                  active &&
                  (styleType === "text" || styleType === "both") &&
                  active.textColor
                    ? active.textColor
                    : style.textColor || style.color || null;
                const bc =
                  active &&
                  (styleType === "highlight" || styleType === "both") &&
                  active.backgroundColor
                    ? active.backgroundColor
                    : style.backgroundColor || null;
                const params = this.getHighlightParams(style);
                const borderCss = this.generateBorderStyle(tc, bc, style);
                let styleStr = "";
                if (tc) styleStr += `color:${tc};`;
                if (bc) {
                  try {
                    const hexWithAlpha = this.hexToHexWithAlpha(
                      bc,
                      params.opacity ?? 25,
                    );
                    styleStr += `background-color:${hexWithAlpha};`;
                  } catch (_) {
                    styleStr += `background-color:${bc};`;
                  }
                }
                styleStr += `border-radius:${params.radius ?? 8}px; padding:${params.vPad ?? 0}px ${params.hPad ?? 4}px;${borderCss}`;
                nameEl.setAttr("style", styleStr);
                wrapper.appendChild(nameEl);
                frag.appendChild(wrapper);
                subItem.setTitle(frag);
                subItem.onClick(async () => {
                  // Close the submenu
                  try {
                    sub.hide();
                  } catch (_) {}
                  this._openQuickStylesSubmenu = null;
                  // Apply the quick style with the selected pair colors
                  await this._applyQuickStyleToSelection(
                    style,
                    this._lastSelectedQuickColor || null,
                    selectedText,
                    editor,
                    view,
                    this.settings.quickColorsApplyMode !== "act" &&
                      !(style && (style.groupUid || style.matchType)),
                  );
                });
              });
            });

            // Smart positioning: check distance to window borders
            try {
              let targetEl = anchorElement;
              if (!targetEl && anchorEvent) {
                if (anchorEvent instanceof Element) targetEl = anchorEvent;
                else if (anchorEvent.target)
                  targetEl =
                    anchorEvent.target.closest(".menu-item") ||
                    anchorEvent.target;
              }

              let rect = null;
              if (targetEl && targetEl.getBoundingClientRect) {
                rect = targetEl.getBoundingClientRect();
              }

              if (rect) {
                const winWidth = window.innerWidth;
                const threshold = 350; // Distance from right edge to trigger left-side positioning
                const estimatedWidth = 160; // Estimated width of the submenu

                const distToRight = winWidth - rect.right;
                let targetX, targetY;

                // Align tops
                targetY = rect.top;

                if (distToRight < threshold) {
                  // Not enough space on right -> Position on LEFT of the menu item
                  // Use a smaller estimated width and add slight overlap to reduce gap
                  targetX = rect.left - estimatedWidth + 5;
                } else {
                  // Enough space -> Position on RIGHT of the menu item
                  // Small overlap for continuity
                  targetX = rect.right - 5;
                }

                // Safety check for left edge
                if (targetX < 10) targetX = 10;

                sub.showAtPosition({ x: targetX, y: targetY });
              } else {
                sub.showAtMouseEvent(anchorEvent);
              }
            } catch (e) {
              sub.showAtMouseEvent(anchorEvent);
            }

            this._openQuickStylesSubmenu = sub;

            // Handle submenu hover persistence
            if (sub.dom) {
              sub.dom.addEventListener("mouseenter", () => {
                if (closeMenuTimeout) {
                  clearTimeout(closeMenuTimeout);
                  closeMenuTimeout = null;
                }
              });
              sub.dom.addEventListener("mouseleave", () => {
                closeMenuTimeout = setTimeout(() => {
                  if (this._openQuickStylesSubmenu) {
                    try {
                      this._openQuickStylesSubmenu.hide();
                    } catch (_) {}
                    this._openQuickStylesSubmenu = null;
                  }
                }, 300);
              });
            }
          };
          if (
            this.settings.quickColorsEnabled &&
            Array.isArray(this.settings.quickColors) &&
            this.settings.quickColors.length > 0
          ) {
            menu.addItem((item) => {
              const titleEl = document.createElement("div");
              titleEl.className = "menu-item tappable has-submenu";
              titleEl.classList.add("act-color-dots");
              titleEl.addEventListener("mouseenter", (ev) => {
                if (closeMenuTimeout) {
                  clearTimeout(closeMenuTimeout);
                  closeMenuTimeout = null;
                }
                if (this.settings.quickStylesEnabled && stylesArr.length > 0) {
                  try {
                    openStylesSubmenu(ev, titleEl);
                  } catch (e) {
                    openStylesSubmenu(ev, titleEl);
                  }
                }
              });
              titleEl.addEventListener("mouseleave", () => {
                closeMenuTimeout = setTimeout(() => {
                  if (this._openQuickStylesSubmenu) {
                    try {
                      this._openQuickStylesSubmenu.hide();
                    } catch (_) {}
                    this._openQuickStylesSubmenu = null;
                  }
                }, 300);
              });
              const iconLeft = document.createElement("div");
              iconLeft.className = "menu-item-icon";
              const titleText = document.createElement("div");
              titleText.className = "menu-item-title";
              // Build dots row (background colors only)
              const dotsContainer = document.createElement("div");
              dotsContainer.classList.add("act-color-dots-container");
              dotsContainer.style.display = "flex";
              dotsContainer.style.flexWrap = "wrap";
              dotsContainer.style.gap = "6px";
              dotsContainer.style.padding = "4px 0";
              dotsContainer.style.width = "100%";
              dotsContainer.style.alignItems = "center";
              let activeDotEl = null;
              this.settings.quickColors.forEach((pair) => {
                if (
                  pair &&
                  pair.backgroundColor &&
                  this.isValidHexColor(pair.backgroundColor)
                ) {
                  const dotB = document.createElement("div");
                  dotB.classList.add(
                    "act-color-dot",
                    "act-color-dot-bg",
                    "has-submenu",
                  );
                  dotB.style.width = "20px";
                  dotB.style.height = "20px";
                  dotB.style.borderRadius = "50%";
                  dotB.style.backgroundColor = pair.backgroundColor;
                  dotB.style.cursor = "pointer";
                  dotB.style.border =
                    "1px solid var(--background-modifier-border)";
                  dotB.addEventListener("click", async (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    // Toggle off logic
                    if (activeDotEl === dotB) {
                      try {
                        activeDotEl.style.outline = "";
                      } catch (_) {}
                      try {
                        activeDotEl.classList.remove("act-color-dot-active");
                      } catch (_) {}
                      activeDotEl = null;
                      this._lastSelectedQuickColor = null;
                      if (
                        this.settings.quickStylesEnabled &&
                        stylesArr.length > 0
                      ) {
                        openStylesSubmenu(ev, titleEl);
                      }
                      return;
                    }
                    this._lastSelectedQuickColor = {
                      textColor: pair.textColor || null,
                      backgroundColor: pair.backgroundColor,
                    };
                    if (activeDotEl && activeDotEl !== dotB) {
                      try {
                        activeDotEl.style.outline = "";
                      } catch (_) {}
                      try {
                        activeDotEl.classList.remove("act-color-dot-active");
                      } catch (_) {}
                    }
                    activeDotEl = dotB;
                    try {
                      dotB.style.outline =
                        "2px solid var(--interactive-accent)";
                    } catch (_) {}
                    try {
                      dotB.classList.add("act-color-dot-active");
                    } catch (_) {}
                    if (
                      this.settings.quickStylesEnabled &&
                      stylesArr.length > 0
                    ) {
                      openStylesSubmenu(ev, titleEl);
                    } else {
                      const firstStyle = stylesArr[0] || null;
                      if (firstStyle) {
                        await this._applyQuickStyleToSelection(
                          firstStyle,
                          this._lastSelectedQuickColor,
                          selectedText,
                          editor,
                          view,
                          this.settings.quickColorsApplyMode !== "act" &&
                            !(
                              firstStyle &&
                              (firstStyle.groupUid || firstStyle.matchType)
                            ),
                        );
                      } else {
                        if (this.settings.quickColorsApplyMode === "act") {
                          await this._applyQuickColorACT(
                            selectedText,
                            null,
                            pair.backgroundColor,
                            view,
                          );
                        } else {
                          const p = this.getHighlightParams(null);
                          const hexWithAlpha = this.hexToHexWithAlpha(
                            pair.backgroundColor,
                            p.opacity ?? 25,
                          );
                          const borderCss = this.generateBorderStyle(
                            null,
                            pair.backgroundColor,
                            null,
                          );
                          const styleStr = `background-color: ${hexWithAlpha}; border-radius: ${p.radius ?? 8}px; padding: ${p.vPad ?? 0}px ${p.hPad ?? 4}px;${borderCss} box-decoration-break: clone; -webkit-box-decoration-break: clone;`;
                          const html = `<span class="always-color-text-highlight" style="${styleStr}">${selectedText}</span>`;
                          editor.replaceSelection(html);
                        }
                      }
                    }
                  });
                  dotsContainer.appendChild(dotB);
                }
              });
              titleText.appendChild(dotsContainer);
              const chevronIcon = document.createElement("div");
              chevronIcon.className = "menu-item-icon";
              chevronIcon.style.cursor = "pointer";
              chevronIcon.style.marginLeft = "auto";
              try {
                setIcon(chevronIcon, "chevron-right");
              } catch (_) {}
              chevronIcon.addEventListener("click", (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                openStylesSubmenu(ev, titleEl);
              });
              const iconRight = document.createElement("div");
              iconRight.className = "menu-item-icon mod-submenu";
              try {
                iconRight.style.cursor = "pointer";
              } catch (_) {}
              iconRight.style.display = "none";
              iconRight.addEventListener("click", (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                openStylesSubmenu(ev, titleEl);
              });
              titleEl.appendChild(iconLeft);
              titleEl.appendChild(titleText);
              if (this.settings.quickStylesEnabled && stylesArr.length > 0) {
                titleEl.appendChild(chevronIcon);
              }
              titleEl.appendChild(iconRight);
              item.setTitle(titleEl);
              item.onClick((evt) => {
                if (this.settings.quickStylesEnabled && stylesArr.length > 0) {
                  openStylesSubmenu(evt, titleEl);
                }
              });
            });
          } else if (
            this.settings.quickStylesEnabled &&
            Array.isArray(this.settings.quickStyles) &&
            this.settings.quickStyles.length > 0
          ) {
            menu.addItem((item) => {
              item.setIcon("heading-glyph");
              item.setTitle(this.t("quick_styles_menu_option", "Quick Styles"));
              try {
                item.dom?.classList.add("has-submenu");
              } catch (_) {}
              try {
                const iconRight = document.createElement("div");
                iconRight.className = "menu-item-icon mod-submenu";
                setIcon(iconRight, "chevron-right");
                item.dom?.appendChild(iconRight);
              } catch (_) {}

              // Add hover support
              try {
                if (item.dom) {
                  item.dom.addEventListener("mouseenter", (ev) => {
                    openStylesSubmenu(ev, item.dom);
                  });
                  item.dom.addEventListener("mouseleave", () => {
                    closeMenuTimeout = setTimeout(() => {
                      if (this._openQuickStylesSubmenu) {
                        try {
                          this._openQuickStylesSubmenu.hide();
                        } catch (_) {}
                        this._openQuickStylesSubmenu = null;
                      }
                    }, 300);
                  });
                }
              } catch (_) {}

              item.onClick((evt) => {
                openStylesSubmenu(evt, item.dom);
              });
            });
          }

          const caseSensitive = !!this.settings.caseSensitive;
          const norm = (s) =>
            caseSensitive ? String(s) : String(s).toLowerCase();
          const a = norm(selectedText);
          const wordEntries = Array.isArray(this.settings.wordEntries)
            ? this.settings.wordEntries
            : [];
          const groupsList = Array.isArray(this.settings.wordEntryGroups)
            ? this.settings.wordEntryGroups
            : [];
          const matchTypeVal = (mt) => {
            const v = String(mt || "").toLowerCase();
            if (v === "startswith" || v === "starts with") return "startswith";
            if (v === "endswith" || v === "ends with") return "endswith";
            if (v === "contains") return "contains";
            return "exact";
          };
          const matchPattern = (p, mt) => {
            const b = norm(p || "");
            const m = matchTypeVal(mt);
            if (m === "startswith") return a.startsWith(b);
            if (m === "endswith") return a.endsWith(b);
            if (m === "contains") return a.includes(b);
            return a === b;
          };
          const findManualMatch = () => {
            for (let i = 0; i < wordEntries.length; i++) {
              const e = wordEntries[i];
              if (!e || e.isRegex) continue;
              if (
                Array.isArray(e.groupedPatterns) &&
                e.groupedPatterns.length > 0
              ) {
                for (const p of e.groupedPatterns) {
                  if (matchPattern(p, e.matchType)) {
                    return {
                      container: wordEntries,
                      index: i,
                      entry: e,
                      kind: "grouped",
                      matchedPattern: p,
                    };
                  }
                }
              } else if (matchPattern(e.pattern || "", e.matchType)) {
                return {
                  container: wordEntries,
                  index: i,
                  entry: e,
                  kind: "literal",
                  matchedPattern: e.pattern || "",
                };
              }
            }
            for (const g of groupsList) {
              if (!g || !Array.isArray(g.entries)) continue;
              for (let j = 0; j < g.entries.length; j++) {
                const e = g.entries[j];
                if (!e || e.isRegex) continue;
                if (
                  Array.isArray(e.groupedPatterns) &&
                  e.groupedPatterns.length > 0
                ) {
                  for (const p of e.groupedPatterns) {
                    if (matchPattern(p, e.matchType)) {
                      return {
                        container: g.entries,
                        index: j,
                        entry: e,
                        kind: "grouped",
                        matchedPattern: p,
                      };
                    }
                  }
                } else if (matchPattern(e.pattern || "", e.matchType)) {
                  return {
                    container: g.entries,
                    index: j,
                    entry: e,
                    kind: "literal",
                    matchedPattern: e.pattern || "",
                  };
                }
              }
            }
            return null;
          };
          const findRegexMatch = () => {
            if (!this.settings.enableRegexSupport) return null;
            for (let i = 0; i < wordEntries.length; i++) {
              const e = wordEntries[i];
              if (!e || !e.isRegex) continue;
              try {
                const re = new RegExp(
                  e.pattern,
                  e.flags || (caseSensitive ? "" : "i"),
                );
                if (re.test(selectedText))
                  return {
                    container: wordEntries,
                    index: i,
                    entry: e,
                    kind: "regex",
                  };
              } catch (_) {}
            }
            for (const g of groupsList) {
              if (!g || !Array.isArray(g.entries)) continue;
              for (let j = 0; j < g.entries.length; j++) {
                const e = g.entries[j];
                if (!e || !e.isRegex) continue;
                try {
                  const re = new RegExp(
                    e.pattern,
                    e.flags || (caseSensitive ? "" : "i"),
                  );
                  if (re.test(selectedText))
                    return {
                      container: g.entries,
                      index: j,
                      entry: e,
                      kind: "regex",
                    };
                } catch (_) {}
              }
            }
            return null;
          };
          const manualMatch = findManualMatch();
          const regexMatch = manualMatch ? null : findRegexMatch();
          if (manualMatch || regexMatch) {
            menu.addItem((item) => {
              item
                .setTitle(
                  this.t(
                    "menu_remove_always_color_text",
                    "Remove Always Color Text",
                  ),
                )
                .setIcon("eraser")
                .onClick(async () => {
                  if (manualMatch) {
                    const { container, index, entry, kind, matchedPattern } =
                      manualMatch;
                    if (
                      kind === "grouped" &&
                      Array.isArray(entry.groupedPatterns)
                    ) {
                      entry.groupedPatterns = entry.groupedPatterns.filter(
                        (p) => !(norm(p) === norm(matchedPattern)),
                      );
                      if (entry.groupedPatterns.length === 1) {
                        entry.pattern = entry.groupedPatterns[0];
                        entry.groupedPatterns = null;
                      } else if (entry.groupedPatterns.length === 0) {
                        container.splice(index, 1);
                      }
                    } else {
                      container.splice(index, 1);
                    }
                  } else if (regexMatch) {
                    const { container, index } = regexMatch;
                    container.splice(index, 1);
                  }
                  await this.saveSettings();
                  this.refreshEditor(view, true);
                  new Notice(
                    this.t(
                      "notice_removed_always_color",
                      `Removed always coloring for "${selectedText}".`,
                      { word: selectedText },
                    ),
                  );
                  if (this.settingTab) {
                    this.settingTab._initializedSettingsUI = false;
                    this.settingTab.display();
                  }
                });
            });
          }

          if (this.settings.enableBlacklistMenu) {
            menu.addItem((item) => {
              item
                .setTitle(
                  this.t("menu_blacklist_word", "Blacklist Word from Coloring"),
                )
                .setIcon("ban")
                .onClick(async () => {
                  const existsLegacy =
                    Array.isArray(this.settings.blacklistWords) &&
                    this.settings.blacklistWords.includes(selectedText);
                  const existsNew =
                    Array.isArray(this.settings.blacklistEntries) &&
                    this.settings.blacklistEntries.some(
                      (e) =>
                        e &&
                        !e.isRegex &&
                        String(e.pattern).toLowerCase() ===
                          String(selectedText).toLowerCase(),
                    );
                  if (!existsLegacy && !existsNew) {
                    if (!Array.isArray(this.settings.blacklistEntries))
                      this.settings.blacklistEntries = [];
                    this.settings.blacklistEntries.push({
                      pattern: selectedText,
                      isRegex: false,
                      flags: "",
                      groupedPatterns: null,
                    });
                    await this.saveSettings();
                    new Notice(
                      this.t(
                        "notice_added_to_blacklist",
                        `"${selectedText}" added to blacklist.`,
                        { word: selectedText },
                      ),
                    );
                    this.refreshEditor(view, true);
                    if (
                      this.settingTab &&
                      this.settingTab._refreshBlacklistWords
                    ) {
                      this.settingTab._refreshBlacklistWords();
                    }
                  } else {
                    new Notice(
                      this.t(
                        "notice_already_blacklisted",
                        `"${selectedText}" is already blacklisted.`,
                        { word: selectedText },
                      ),
                    );
                  }
                });
            });
          }
        }
      }),
    );

    // --- Command palette ---
    if (!this.settings.disableToggleModes.command) {
      this.registerCommandPalette();
    }

    // --- Enable plugin features ---
    if (this.settings.enabled) {
      this.enablePluginFeatures();
    }

    try {
      this.registerEvent(
        this.app.workspace.on("layout-ready", () => {
          try {
            this.refreshAllLivePreviewCallouts();
          } catch (_) {}
        }),
      );
    } catch (_) {}
  }

  registerCommandPalette() {
    try {
      if (this.settings?.disableToggleModes?.command) return;
      if (this._commandsRegistered) return;

      const addTrackedCommand = (cmd) => {
        this._registeredCommandIds.push(cmd.id);
        return this.addCommand(cmd);
      };

      addTrackedCommand({
        id: "set-color-for-selection",
        name: this.t("command_color_selected", "Color Selected Text"),
        editorCallback: (editor, view) => {
          const word = editor.getSelection().trim();
          if (!word) {
            new Notice(
              this.t(
                "notice_select_text_first",
                "Please select some text first.",
              ),
            );
            return;
          }
          new ColorPickerModal(
            this.app,
            this,
            async (color, result) => {
              const sel = result || {};
              const tc =
                sel.textColor && this.isValidHexColor(sel.textColor)
                  ? sel.textColor
                  : null;
              const bc =
                sel.backgroundColor && this.isValidHexColor(sel.backgroundColor)
                  ? sel.backgroundColor
                  : null;
              const selGroupUid = sel.selectedGroupUid || null;
              const matchType =
                sel.matchType ||
                (this.settings.partialMatch ? "contains" : "exact");
              const applyToArr = (arr) => {
                const idx = arr.findIndex(
                  (e) => e && e.pattern === word && !e.isRegex,
                );
                if (idx !== -1) {
                  const entry = arr[idx];
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
                    entry.textColor = null;
                    entry.backgroundColor = null;
                    entry._savedTextColor = tc;
                  } else if (bc) {
                    entry.color = "";
                    entry.textColor = "currentColor";
                    entry.backgroundColor = bc;
                    entry.styleType = "highlight";
                    entry._savedBackgroundColor = bc;
                  } else if (color && this.isValidHexColor(color)) {
                    entry.color = color;
                    entry.styleType = "text";
                    entry._savedTextColor = color;
                  }
                  if (!entry.isRegex) entry.matchType = matchType;
                } else {
                  if (tc && bc) {
                    arr.push({
                      pattern: word,
                      color: "",
                      textColor: tc,
                      backgroundColor: bc,
                      isRegex: false,
                      flags: "",
                      styleType: "both",
                      matchType,
                      _savedTextColor: tc,
                      _savedBackgroundColor: bc,
                    });
                  } else if (tc) {
                    arr.push({
                      pattern: word,
                      color: tc,
                      isRegex: false,
                      flags: "",
                      styleType: "text",
                      matchType,
                      _savedTextColor: tc,
                    });
                  } else if (bc) {
                    arr.push({
                      pattern: word,
                      color: "",
                      textColor: "currentColor",
                      backgroundColor: bc,
                      isRegex: false,
                      flags: "",
                      styleType: "highlight",
                      matchType,
                      _savedBackgroundColor: bc,
                    });
                  } else if (color && this.isValidHexColor(color)) {
                    arr.push({
                      pattern: word,
                      color: color,
                      isRegex: false,
                      flags: "",
                      styleType: "text",
                      matchType,
                      _savedTextColor: color,
                    });
                  }
                }
              };
              if (selGroupUid) {
                const group = Array.isArray(this.settings.wordEntryGroups)
                  ? this.settings.wordEntryGroups.find(
                      (g) => g && g.uid === selGroupUid,
                    )
                  : null;
                if (group) {
                  if (!Array.isArray(group.entries)) group.entries = [];
                  applyToArr(group.entries);
                } else {
                  applyToArr(this.settings.wordEntries);
                }
              } else {
                applyToArr(this.settings.wordEntries);
              }
              await this.saveSettings();
              this.compileWordEntries();
              this.compileTextBgColoringEntries();
              this.reconfigureEditorExtensions();
              this.forceRefreshAllEditors();
            },
            "text-and-background",
            word,
            false,
          ).open();
        },
      });
      addTrackedCommand({
        id: "add-to-existing-entry",
        name: this.t("command_add_to_existing_entry", "Add to Existing Entry"),
        editorCallback: (editor, view) => {
          const word = editor.getSelection().trim();
          if (!word) {
            new Notice(
              this.t(
                "notice_select_text_first",
                "Please select some text first.",
              ),
            );
            return;
          }
          new AddToExistingEntryModal(this.app, this, word, view).open();
        },
      });
      addTrackedCommand({
        id: "toggle-coloring-for-current-document",
        name: (() => {
          try {
            const md = this.app.workspace.getActiveFile();
            if (
              md &&
              this.settings.disabledFiles &&
              this.settings.disabledFiles.includes(md.path)
            ) {
              return this.t(
                "command_enable_current",
                "Enable coloring for current document",
              );
            }
          } catch (_) {}
          return this.t(
            "command_disable_current",
            "Disable coloring for current document",
          );
        })(),
        callback: async () => {
          const md = this.app.workspace.getActiveFile();
          if (!md) {
            new Notice(
              this.t(
                "notice_no_active_file",
                "No active file to toggle coloring for.",
              ),
            );
            return;
          }
          if (this.settings.disabledFiles.includes(md.path)) {
            const index = this.settings.disabledFiles.indexOf(md.path);
            if (index > -1) this.settings.disabledFiles.splice(index, 1);
            await this.saveSettings();
            new Notice(
              this.t(
                "notice_coloring_enabled_for_path",
                `Coloring enabled for ${md.path}`,
                { path: md.path },
              ),
            );
          } else {
            this.settings.disabledFiles.push(md.path);
            await this.saveSettings();
            new Notice(
              this.t(
                "notice_coloring_disabled_for_path",
                `Coloring disabled for ${md.path}`,
                { path: md.path },
              ),
            );
          }
          // Refresh everything to ensure immediate effect (including canvas)
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
          this.refreshCanvasViews();
          this.triggerActiveDocumentRerender();
          try {
            this.reregisterCommandsWithLanguage();
          } catch (_) {}
        },
      });
      addTrackedCommand({
        id: "toggle-lightweight-mode",
        name: (() => {
          try {
            return this.settings.extremeLightweightMode
              ? this.t(
                  "command_disable_lightweight_mode",
                  "Disable Lightweight Mode",
                )
              : this.t(
                  "command_enable_lightweight_mode",
                  "Enable Lightweight Mode",
                );
          } catch (_) {}
          return this.t(
            "command_enable_lightweight_mode",
            "Enable Lightweight Mode",
          );
        })(),
        callback: async () => {
          this.settings.extremeLightweightMode =
            !this.settings.extremeLightweightMode;
          await this.saveSettings();
          new Notice(
            this.settings.extremeLightweightMode
              ? this.t(
                  "notice_lightweight_mode_enabled",
                  "Lightweight Mode enabled",
                )
              : this.t(
                  "notice_lightweight_mode_disabled",
                  "Lightweight Mode disabled",
                ),
          );
          this.reregisterCommandsWithLanguage();
          this.forceRefreshAllEditors();
        },
      });
      addTrackedCommand({
        id: "color-highlight-once-selected-text",
        name: this.t(
          "command_color_highlight_once",
          "Color / Highlight Once Selected Text",
        ),
        editorCallback: (editor, view) => {
          const word = editor.getSelection().trim();
          if (!word) {
            new Notice(
              this.t(
                "notice_select_text_first_once",
                "Please select text first to color/highlight once.",
              ),
            );
            return;
          }
          new ColorPickerModal(
            this.app,
            this,
            async (color, result) => {
              const sel = result || {};
              const tc =
                sel.textColor && this.isValidHexColor(sel.textColor)
                  ? sel.textColor
                  : null;
              const bc =
                sel.backgroundColor && this.isValidHexColor(sel.backgroundColor)
                  ? sel.backgroundColor
                  : null;

              if (!tc && !bc) return;

              const styleParts = [];
              if (tc) styleParts.push(`color: ${tc}`);
              if (bc) {
                const op =
                  typeof this.settings.backgroundOpacity === "number"
                    ? this.settings.backgroundOpacity
                    : 25;
                const rgba = this.hexToRgba(bc, op);
                styleParts.push(`background-color: ${rgba}`);

                let applyStyles = false;
                let hPad = 0,
                  vPad = 0,
                  radius = 0;
                let borderCss = "";

                if (this.settings.quickHighlightUseGlobalStyle) {
                  applyStyles = true;
                  hPad =
                    typeof this.settings.highlightHorizontalPadding === "number"
                      ? this.settings.highlightHorizontalPadding
                      : 4;
                  vPad =
                    typeof this.settings.highlightVerticalPadding === "number"
                      ? this.settings.highlightVerticalPadding
                      : 0;
                  radius =
                    typeof this.settings.highlightBorderRadius === "number"
                      ? this.settings.highlightBorderRadius
                      : 8;

                  // Generate border if enabled globally
                  if (this.settings.enableBorderThickness) {
                    borderCss = this.generateGlobalBorderStyle(bc);
                  }
                } else if (this.settings.quickHighlightStyleEnable) {
                  applyStyles = true;
                  hPad =
                    typeof this.settings.quickHighlightHorizontalPadding ===
                    "number"
                      ? this.settings.quickHighlightHorizontalPadding
                      : 4;
                  vPad =
                    typeof this.settings.quickHighlightVerticalPadding ===
                    "number"
                      ? this.settings.quickHighlightVerticalPadding
                      : 0;
                  radius =
                    typeof this.settings.quickHighlightBorderRadius === "number"
                      ? this.settings.quickHighlightBorderRadius
                      : 8;

                  // Generate border if enabled for quick once
                  if (this.settings.quickHighlightEnableBorder) {
                    borderCss = this.generateOnceBorderStyle(bc);
                  }
                }

                if (applyStyles) {
                  styleParts.push(`padding: ${vPad}px ${hPad}px`);
                  styleParts.push(`border-radius: ${radius}px`);
                  if (this.settings.enableBoxDecorationBreak ?? true) {
                    styleParts.push(`box-decoration-break: clone`);
                    styleParts.push(`-webkit-box-decoration-break: clone`);
                  }
                  if (borderCss) {
                    // borderCss comes as a string of css properties like " border: ...;"
                    // We need to clean it up to fit into styleParts (which joins with '; ')
                    // The generated string has semicolons and 'property: value' format.
                    // Let's strip the leading space and any wrapping if needed.
                    // Actually, generateOnceBorderStyle returns something like " border: ...;"
                    // styleParts.join('; ') expects just "prop: value"
                    // So we should split by semicolon and add parts.
                    const borderParts = borderCss
                      .split(";")
                      .map((s) => s.trim())
                      .filter((s) => s);
                    borderParts.forEach((bp) => styleParts.push(bp));
                  }
                }
              }

              if (styleParts.length > 0) {
                const span = `<span style="${styleParts.join("; ")}">${word}</span>`;
                editor.replaceSelection(span);
              }
            },
            "text-and-background",
            word,
            true,
          ).open();
        },
      });
      addTrackedCommand({
        id: "toggle-always-color-text",
        name: this.settings.enabled
          ? this.t("command_disable_global", "Disable Global Coloring")
          : this.t("command_enable_global", "Enable Global Coloring"),
        callback: async () => {
          this.settings.enabled = !this.settings.enabled;
          await this.saveSettings();
          new Notice(
            this.settings.enabled
              ? this.t("notice_global_enabled", "Always Color Text Enabled")
              : this.t("notice_global_disabled", "Always Color Text Disabled"),
          );
          this._lpCalloutCache = new WeakMap();
          this.reconfigureEditorExtensions();
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
          if (this.settings.enabled) {
            this.removeDisabledNeutralizerStyles();
          } else {
            this.applyDisabledNeutralizerStyles();
            this.clearAllHighlights();
          }
          try {
            if (this.settings.enabled) {
              if (!this.settings.disableLivePreviewColoring) {
                this.applyEnabledLivePreviewCalloutStyles();
              } else {
                this.removeEnabledLivePreviewCalloutStyles();
              }
              this.applyEnabledReadingCalloutStyles();
            } else {
              this.removeEnabledLivePreviewCalloutStyles();
              this.removeEnabledReadingCalloutStyles();
            }
            if (!this.settings.disableLivePreviewColoring) {
              this.refreshAllLivePreviewCallouts();
              this.forceReprocessLivePreviewCallouts();
            }
          } catch (_) {}
          try {
            this.reregisterCommandsWithLanguage();
          } catch (_) {}
        },
      });
      addTrackedCommand({
        id: "show-latest-release-notes",
        name: this.t("command_show_release_notes", "Show Latest Release Notes"),
        callback: async () => {
          try {
            new ChangelogModal(this.app, this).open();
          } catch (e) {
            new Notice(
              this.t(
                "notice_unable_open_changelog",
                "Unable to open changelog modal.",
              ),
            );
          }
        },
      });
      addTrackedCommand({
        id: "manage-colored-texts",
        name: this.t("command_manage_colored_texts", "Manage Colored Texts"),
        callback: () => {
          try {
            this.app.setting.open();
            const tabId =
              (this.manifest && this.manifest.id) || "always-color-text";
            try {
              this.app.setting.openTabById(tabId);
            } catch (e) {}
            setTimeout(() => {
              try {
                const el = document.querySelector(
                  "#always-colored-texts-header",
                );
                if (el && el.scrollIntoView)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              } catch (_) {}
            }, 100);
          } catch (_) {}
        },
      });
      // Add command for opening regex tester
      addTrackedCommand({
        id: "open-regex-tester",
        name: this.t(
          "command_open_regex_tester",
          "Add Regex (Open Regex Tester)",
        ),
        callback: () => {
          try {
            new RealTimeRegexTesterModal(this.app, this, async (entry) => {
              if (!entry) return;
              try {
                this.settingTab && (this.settingTab._suspendSorting = true);
              } catch (e) {}
              if (!Array.isArray(this.settings.wordEntries))
                this.settings.wordEntries = [];
              const idx = this.settings.wordEntries.findIndex(
                (e) => e && e.pattern === entry.pattern && e.isRegex,
              );
              if (idx !== -1) {
                const existing = this.settings.wordEntries[idx];
                existing.pattern = entry.pattern;
                existing.color = entry.color;
                existing.textColor = entry.textColor;
                existing.backgroundColor = entry.backgroundColor;
                existing.styleType = entry.styleType;
                existing.flags = entry.flags;
                existing.presetLabel =
                  entry.presetLabel || existing.presetLabel || undefined;
                existing.persistAtEnd = true;
              } else {
                entry.persistAtEnd = true;
                this.settings.wordEntries.push(entry);
              }
              try {
                this.settingTab &&
                  entry &&
                  entry.uid &&
                  this.settingTab._newEntriesSet &&
                  this.settingTab._newEntriesSet.add(entry.uid);
              } catch (e) {}
              await this.saveSettings();
              this.compileWordEntries();
              this.compileTextBgColoringEntries();
              this.reconfigureEditorExtensions();
              this.forceRefreshAllEditors();
              this.forceRefreshAllReadingViews();
            }).open();
          } catch (e) {
            new Notice(
              this.t(
                "notice_error_opening_regex_tester",
                "Error opening regex tester",
              ),
            );
          }
        },
      });
      // Add command for opening blacklist regex tester
      addTrackedCommand({
        id: "open-blacklist-regex-tester",
        name: this.t(
          "command_open_blacklist_regex_tester",
          "Add Blacklist Regex",
        ),
        callback: () => {
          try {
            new BlacklistRegexTesterModal(this.app, this, async (entry) => {
              if (!entry) return;
              try {
                this.settingTab && (this.settingTab._suspendSorting = true);
              } catch (e) {}
              if (!Array.isArray(this.settings.blacklistEntries))
                this.settings.blacklistEntries = [];
              const idx = this.settings.blacklistEntries.findIndex(
                (e) => e && e.pattern === entry.pattern && e.isRegex,
              );
              if (idx !== -1) {
                const existing = this.settings.blacklistEntries[idx];
                existing.pattern = entry.pattern;
                existing.flags = entry.flags;
                existing.presetLabel =
                  entry.presetLabel || existing.presetLabel || undefined;
                existing.persistAtEnd = true;
              } else {
                entry.persistAtEnd = true;
                this.settings.blacklistEntries.push(entry);
              }
              try {
                this.settingTab &&
                  entry &&
                  entry.uid &&
                  this.settingTab._blacklistNewSet &&
                  this.settingTab._blacklistNewSet.add(entry.uid);
              } catch (e) {}
              await this.saveSettings();
              this.reconfigureEditorExtensions();
              this.forceRefreshAllEditors();
              this.forceRefreshAllReadingViews();
            }).open();
          } catch (e) {
            new Notice(
              this.t(
                "notice_error_opening_blacklist_regex_tester",
                "Error opening blacklist regex tester",
              ),
            );
          }
        },
      });
      // Add command to see only highlights
      addTrackedCommand({
        id: "toggle-hide-text-colors",
        name: this.settings.hideTextColors
          ? this.t("command_unhide_text_colors", "Unhide Text Colors")
          : this.t("command_hide_text_colors", "Hide Text Colors"),
        callback: async () => {
          try {
            this.settings.hideTextColors = !this.settings.hideTextColors;
            if (this.settings.hideTextColors && this.settings.hideHighlights) {
              this.settings.hideHighlights = false;
            }
            await this.saveSettings();
            this.reregisterCommandsWithLanguage();
            this._cacheDirty = true;
            // Update CSS styles for reading callouts based on hideTextColors setting
            this.removeEnabledReadingCalloutStyles();
            if (this.settings.enabled && !this.settings.hideTextColors) {
              this.applyEnabledReadingCalloutStyles();
            }
            // Clear the callout cache to force re-evaluation when hideTextColors changes
            this._lpCalloutCache = new WeakMap();
            this.reconfigureEditorExtensions();
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
            if (!this.settings.disableLivePreviewColoring) {
              try {
                this.refreshAllLivePreviewCallouts();
              } catch (_) {}
              try {
                this.forceReprocessLivePreviewCallouts();
              } catch (_) {}
              try {
                this.refreshAllLivePreviewTables();
              } catch (_) {}
              try {
                this.forceReprocessLivePreviewTables();
              } catch (_) {}
            }
            try {
              this.refreshAllBasesViews();
            } catch (_) {}
            try {
              this.forceReprocessBasesViews();
            } catch (_) {}
            const msg = this.settings.hideTextColors
              ? this.t("notice_text_colors_hidden", "Text colors hidden")
              : this.t("notice_text_colors_visible", "Text colors visible");
            new Notice(msg);
          } catch (_) {}
        },
      });
      // Add command to see only text colors
      addTrackedCommand({
        id: "toggle-hide-highlights",
        name: this.settings.hideHighlights
          ? this.t("command_unhide_highlights", "Unhide Highlights")
          : this.t("command_hide_highlights", "Hide Highlights"),
        callback: async () => {
          try {
            this.settings.hideHighlights = !this.settings.hideHighlights;
            if (this.settings.hideHighlights && this.settings.hideTextColors) {
              this.settings.hideTextColors = false;
            }
            await this.saveSettings();
            this.reregisterCommandsWithLanguage();
            this._cacheDirty = true;
            // Update CSS styles for reading callouts based on hideHighlights setting
            this.removeEnabledReadingCalloutStyles();
            if (this.settings.enabled && !this.settings.hideHighlights) {
              this.applyEnabledReadingCalloutStyles();
            }
            // Apply/remove global neutralizer to fully hide highlight backgrounds
            if (this.settings.hideHighlights) {
              this.applyHideHighlightsNeutralizerStyles();
              this.neutralizeExistingHighlightBackgrounds();
            } else {
              this.removeHideHighlightsNeutralizerStyles();
            }
            // Clear the callout cache to force re-evaluation when hideHighlights changes
            this._lpCalloutCache = new WeakMap();
            this.reconfigureEditorExtensions();
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
            if (!this.settings.disableLivePreviewColoring) {
              try {
                this.refreshAllLivePreviewCallouts();
              } catch (_) {}
              try {
                this.forceReprocessLivePreviewCallouts();
              } catch (_) {}
              try {
                this.refreshAllLivePreviewTables();
              } catch (_) {}
              try {
                this.forceReprocessLivePreviewTables();
              } catch (_) {}
            }
            try {
              this.refreshAllBasesViews();
            } catch (_) {}
            try {
              this.forceReprocessBasesViews();
            } catch (_) {}
            const msg = this.settings.hideHighlights
              ? this.t("notice_highlights_hidden", "Highlights hidden")
              : this.t("notice_highlights_visible", "Highlights visible");
            new Notice(msg);
          } catch (_) {}
        },
      });

      // Add word group commands if enabled
      if (this.settings?.showWordGroupsInCommands) {
        this.registerWordGroupCommands();
      }

      // Add blacklist group commands if enabled
      if (this.settings?.showBlacklistGroupsInCommands) {
        this.registerBlacklistGroupCommands();
      }

      this._commandsRegistered = true;
    } catch (e) {}
  }

  // Register word group commands
  registerWordGroupCommands() {
    try {
      const groups = Array.isArray(this.settings.wordEntryGroups)
        ? this.settings.wordEntryGroups
        : [];

      groups.forEach((group) => {
        if (!group) return;
        const groupName = String(group.name || "").trim();
        if (!groupName) return;
        if (!group.uid) {
          try {
            group.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (_) {}
        }

        const isActive = group.active;
        const commandId = `toggle-word-group-${group.uid}`;
        const commandName = isActive
          ? this.t(
              "command_deactivate_word_group",
              "Deactivate {groupName} Word Group",
              { groupName },
            )
          : this.t(
              "command_activate_word_group",
              "Activate {groupName} Word Group",
              { groupName },
            );

        try {
          this._registeredCommandIds.push(commandId);
        } catch (_) {}
        this.addCommand({
          id: commandId,
          name: commandName,
          callback: async () => {
            try {
              const latestGroup = Array.isArray(this.settings.wordEntryGroups)
                ? this.settings.wordEntryGroups.find(
                    (g) => g && g.uid === group.uid,
                  )
                : null;
              if (!latestGroup) return;
              latestGroup.active = !latestGroup.active;
              await this.saveSettings();

              // Refresh the command palette to update the command name
              this.reregisterCommandsWithLanguage();

              // Show notification
              const latestGroupName = String(
                latestGroup.name || groupName || "",
              ).trim();
              const status = latestGroup.active
                ? this.t(
                    "notice_word_group_activated",
                    `Word group "${latestGroupName}" activated`,
                  )
                : this.t(
                    "notice_word_group_deactivated",
                    `Word group "${latestGroupName}" deactivated`,
                  );
              new Notice(status);

              // Refresh views
              this._cacheDirty = true;
              this.reconfigureEditorExtensions();
              this.forceRefreshAllEditors();
              this.forceRefreshAllReadingViews();
            } catch (e) {
              debugError("COMMANDS", "Error toggling word group:", e);
            }
          },
        });
      });
    } catch (e) {
      debugError("COMMANDS", "Error registering word group commands:", e);
    }
  }

  // Register blacklist group commands
  registerBlacklistGroupCommands() {
    try {
      const groups = Array.isArray(this.settings.blacklistEntryGroups)
        ? this.settings.blacklistEntryGroups
        : [];

      groups.forEach((group) => {
        if (!group) return;
        const groupName = String(group.name || "").trim();
        if (!groupName) return;
        if (!group.uid) {
          try {
            group.uid =
              Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (_) {}
        }

        const isActive = group.active;
        const commandId = `toggle-blacklist-group-${group.uid}`;
        const commandName = isActive
          ? this.t(
              "command_deactivate_blacklist_group",
              "Deactivate {groupName} Blacklist Group",
              { groupName },
            )
          : this.t(
              "command_activate_blacklist_group",
              "Activate {groupName} Blacklist Group",
              { groupName },
            );

        try {
          this._registeredCommandIds.push(commandId);
        } catch (_) {}
        this.addCommand({
          id: commandId,
          name: commandName,
          callback: async () => {
            try {
              const latestGroup = Array.isArray(
                this.settings.blacklistEntryGroups,
              )
                ? this.settings.blacklistEntryGroups.find(
                    (g) => g && g.uid === group.uid,
                  )
                : null;
              if (!latestGroup) return;
              latestGroup.active = !latestGroup.active;
              await this.saveSettings();

              // Refresh the command palette to update the command name
              this.reregisterCommandsWithLanguage();

              // Show notification
              const latestGroupName = String(
                latestGroup.name || groupName || "",
              ).trim();
              const status = latestGroup.active
                ? this.t(
                    "notice_blacklist_group_activated",
                    `Blacklist group "${latestGroupName}" activated`,
                  )
                : this.t(
                    "notice_blacklist_group_deactivated",
                    `Blacklist group "${latestGroupName}" deactivated`,
                  );
              new Notice(status);

              // Refresh views
              this._cacheDirty = true;
              this.reconfigureEditorExtensions();
              this.forceRefreshAllEditors();
              this.forceRefreshAllReadingViews();
            } catch (e) {
              debugError("COMMANDS", "Error toggling blacklist group:", e);
            }
          },
        });
      });
    } catch (e) {
      debugError("COMMANDS", "Error registering blacklist group commands:", e);
    }
  }

  removeRegisteredCommands() {
    try {
      const pluginId =
        (this.manifest && this.manifest.id) || "always-color-text";
      const removeCommandSafe = (fullId) => {
        try {
          if (
            this.app &&
            this.app.commands &&
            typeof this.app.commands.removeCommand === "function"
          ) {
            this.app.commands.removeCommand(fullId);
          }
        } catch (_) {}
      };
      const ids = Array.isArray(this._registeredCommandIds)
        ? Array.from(new Set(this._registeredCommandIds))
        : [];
      ids.forEach((id) => {
        if (!id) return;
        removeCommandSafe(`${pluginId}:${id}`);
        removeCommandSafe(id);
      });
      try {
        const cmds =
          this.app && this.app.commands && this.app.commands.commands;
        if (cmds && typeof cmds === "object") {
          Object.keys(cmds).forEach((fullId) => {
            if (!fullId) return;
            if (
              fullId.startsWith(`${pluginId}:toggle-word-group-`) ||
              fullId.startsWith(`${pluginId}:toggle-blacklist-group-`)
            ) {
              removeCommandSafe(fullId);
            }
          });
        }
      } catch (_) {}
    } catch (_) {}
  }

  // Re-register commands with updated language
  reregisterCommandsWithLanguage() {
    try {
      if (this.settings?.disableToggleModes?.command) return;
      this.removeRegisteredCommands();
      // Clear the flag to allow re-registration
      this._commandsRegistered = false;
      // Clear tracked command IDs
      this._registeredCommandIds = [];
      // Re-register with new language
      this.registerCommandPalette();
    } catch (e) {
      debugError(
        "SETTINGS",
        "Error re-registering commands with new language:",
        e,
      );
    }
  }

  // --- Regex complexity checker to avoid catastrophic patterns ---
  isRegexTooComplex(pattern) {
    if (!pattern || typeof pattern !== "string") return true;

    // ALLOW NON-ROMAN CHARACTERS - Add this at the beginning
    if (this.containsNonRomanCharacters(pattern)) {
      return false; // Never block non-Roman patterns
    }

    // Whitelist of known safe patterns that are allowed despite complexity metrics
    const safePatterns = [
      "\\b\\d+(?:\\.\\d+)?(?:kg|cm|m|km|°C|°F|lbs)\\b", // Measurements (kg, cm, m, km, °C, °F, lbs)
    ];

    // Check if pattern matches a safe pattern exactly
    if (safePatterns.includes(pattern)) return false;

    // Hard block known dangerous patterns
    const dangerousPatterns = [
      /\(\?[=!<]/, // Lookarounds
      /\(\?[<][=!]/, // Lookbehinds
      /\*\+|\+\*/, // Adjacent quantifiers
      /\(\w+\)[*+][*+]/, // Nested quantifiers
      /\{[^}]*\{[^}]*\}/, // Nested quantifier ranges
      /\[[^\]]*\[[^\]]*\]/, // Nested character classes
    ];

    if (dangerousPatterns.some((p) => p.test(pattern))) return true;

    // Length limits
    if (pattern.length > 100) return true;

    // Count dangerous constructs
    const alternations = (pattern.match(/\|/g) || []).length;
    const quantifiers = (pattern.match(/[*+?{]/g) || []).length;
    const groups = (pattern.match(/\([^?]/g) || []).length;

    if (alternations > 5 || quantifiers > 10 || groups > 5) return true;

    // Test compilation with timeout
    try {
      const start = Date.now();
      new RegExp(pattern);
      if (Date.now() - start > 10) return true; // 10ms max compilation time
    } catch (e) {
      return true;
    }

    return false;
  }

  validateAndSanitizeRegex(pattern) {
    if (typeof pattern !== "string" || !pattern) return false;
    if (
      !this.settings.disableRegexSafety &&
      this.isKnownProblematicPattern(pattern)
    )
      return false;
    if (!this.settings.disableRegexSafety && this.isRegexTooComplex(pattern))
      return false;
    return true;
  }

  sanitizePattern(pattern, isRegex) {
    if (typeof pattern !== "string") return "";
    let p = String(pattern).trim();
    p = this.decodeHtmlEntities(p);
    if (isRegex && p.length > 200) throw new Error("Pattern too long");
    return p;
  }

  decodeHtmlEntities(text) {
    if (!text || typeof text !== "string") return text;
    text = text.replace(/&#(\d+);/g, (m, dec) => String.fromCharCode(dec));
    text = text.replace(/&#x([0-9A-Fa-f]+);/g, (m, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
    const entities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&nbsp;": " ",
      "&copy;": "©",
      "&reg;": "®",
      "&trade;": "™",
      "&hellip;": "…",
      "&mdash;": "—",
      "&ndash;": "–",
      "&bull;": "•",
      "&check;": "✓",
      "&checkmark;": "✓",
      "&rarr;": "→",
      "&rightarrow": "→",
      "&larr;": "←",
      "&leftarrow": "←",
      "&uarr;": "↑",
      "&uparrow": "↑",
      "&darr;": "↓",
      "&downarrow": "↓",
    };
    return text.replace(/&[#a-zA-Z0-9]+;/g, (m) => entities[m] || m);
  }

  // NEW HELPER METHOD: Detect non-Roman characters
  containsNonRomanCharacters(text) {
    if (!text) return false;
    // Match any character outside basic Latin, numbers, and common punctuation
    return /[^\u0000-\u007F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/.test(text);
  }

  isCJKChar(ch) {
    try {
      return /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(
        ch || "",
      );
    } catch (e) {
      const code = ch && ch.charCodeAt ? ch.charCodeAt(0) : 0;
      return code > 127 && !/\s/.test(ch);
    }
  }

  // NEW HELPER: Count non-Roman characters
  countNonRomanCharacters(text) {
    if (!text) return 0;
    const nonRomanMatches = text.match(
      /[^\u0000-\u007F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/g,
    );
    return nonRomanMatches ? nonRomanMatches.length : 0;
  }

  // NEW HELPER: Get the ratio of non-Roman characters in text
  getNonRomanCharacterRatio(text) {
    if (!text || typeof text !== "string") return 0;
    const totalChars = text.length;
    if (totalChars === 0) return 0;
    return this.countNonRomanCharacters(text) / totalChars;
  }

  // NEW METHOD: Detect if pattern is simple (no regex needed)
  isSimplePattern(pattern) {
    if (!pattern || typeof pattern !== "string") return false;

    // Decode HTML entities first to handle reading mode
    const decodedPattern = this.decodeHtmlEntities(pattern);

    // Simple patterns: alphanumeric, basic punctuation, common symbols
    // This covers: DO:, (✓), →, etc.
    const isSimple =
      /^[\w\s\u00A0-\u00FF\u2000-\u206F\u25A0-\u25FF\u2700-\u27BF✓✔→←↑↓+\-=*/.()&;]+$/.test(
        decodedPattern,
      );

    // Log checkmark patterns for debugging
    if (pattern.includes("✓") || decodedPattern.includes("✓")) {
      debugLog("ISIMPLE", { pattern, decodedPattern, isSimple });
    }

    return isSimple;
  }

  // NEW METHOD: Ultra-fast simple pattern processing
  processSimplePatternsOptimized(
    element,
    simpleEntries,
    folderEntry = null,
    options = {},
  ) {
    debugLog("SIMPLE", `Processing ${simpleEntries.length} simple patterns`);

    const blockTags = [
      "P",
      "LI",
      "DIV",
      "SPAN",
      "TD",
      "TH",
      "BLOCKQUOTE",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
    ];
    const effectiveStyle = "text";

    // Fast DOM collection - avoid TreeWalker overhead
    // Use a universal selector to find ALL descendant elements and filter
    const allElements = element.querySelectorAll?.("*") || [];
    const blocks = [];
    for (const el of allElements) {
      if (blockTags.includes(el.nodeName) && !el.closest("code, pre")) {
        blocks.push(el);
      }
    }

    for (const block of blocks) {
      // Skip code blocks and preformatted text
      if (block.closest("code, pre")) continue;

      this.processBlockWithSimplePatterns(
        block,
        simpleEntries,
        folderEntry,
        effectiveStyle,
        options.filePath,
      );
    }
  }

  // NEW METHOD: Process block with simple string matching
  processBlockWithSimplePatterns(
    block,
    simpleEntries,
    folderEntry,
    effectiveStyle,
    filePath = null,
  ) {
    try {
      if (
        block &&
        (block.classList?.contains("act-skip-coloring") ||
          block.closest?.(".act-skip-coloring"))
      )
        return;
    } catch (_) {}
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          // Skip text nodes in code blocks
          if (node.parentElement?.closest("code, pre")) {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip text nodes already inside ACT highlight spans to prevent double processing
          if (node.parentElement?.closest(".always-color-text-highlight")) {
            return NodeFilter.FILTER_REJECT;
          }
          try {
            if (node.parentElement?.closest(".act-skip-coloring"))
              return NodeFilter.FILTER_REJECT;
          } catch (_) {}
          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false,
    );

    let node;
    while ((node = walker.nextNode())) {
      let text = node.textContent;
      if (!text) continue;

      // DECODE HTML ENTITIES FOR READING MODE COMPATIBILITY
      const originalText = text;
      text = this.decodeHtmlEntities(text);

      let matches = [];

      // ULTRA-FAST string search for simple patterns
      for (const entry of simpleEntries) {
        let pattern = entry.pattern;
        // ALSO DECODE PATTERN FOR COMPARISON
        pattern = this.decodeHtmlEntities(pattern);
        let pos = 0;

        while ((pos = text.indexOf(pattern, pos)) !== -1) {
          matches.push({
            start: pos,
            end: pos + pattern.length,
            entry: entry,
            folderEntry: folderEntry,
          });
          pos += pattern.length;

          // Conservative limit for performance
          if (matches.length > 50) break;
        }

        if (matches.length > 50) break;
      }

      // Vertical padding input (px)
      {
        let vpInput;
        new Setting(containerEl)
          .setName(
            this.plugin.t(
              "highlight_vertical_padding",
              "Highlight vertical padding (px)",
            ),
          )
          .setDesc(
            this.plugin.t(
              "highlight_vertical_padding_desc",
              "Set the top and bottom padding (in px) for highlighted text",
            ),
          )
          .addText((text) => {
            vpInput = text;
            text
              .setPlaceholder("e.g. 0, 1, 2")
              .setValue(
                String(this.plugin.settings.highlightVerticalPadding ?? 0),
              )
              .onChange(async (v) => {
                let val = parseInt(v);
                if (isNaN(val)) val = 0;
                this.plugin.settings.highlightVerticalPadding = val;
                await this.debouncedSaveSettings();
                updatePreview();
              });
          })
          .addExtraButton((btn) =>
            btn
              .setIcon("reset")
              .setTooltip(this.plugin.t("reset_to_0", "Reset to 0"))
              .onClick(async () => {
                this.plugin.settings.highlightVerticalPadding = 0;
                await this.debouncedSaveSettings();
                if (vpInput) vpInput.setValue("0");
                updatePreview();
              }),
          );
      }

      // Apply highlights if we found matches
      if (matches.length > 0) {
        this.applySimpleHighlights(node, matches, text, filePath);
      }
    }
  }

  processMarkdownFormattingInReading(
    element,
    folderEntry = null,
    entries = null,
    filePath = null,
  ) {
    try {
      let we;
      if (Array.isArray(entries) && entries.length > 0) {
        we = entries;
      } else {
        let weAll = Array.isArray(this.settings.wordEntries)
          ? this.settings.wordEntries.slice()
          : [];
        if (Array.isArray(this.settings.wordEntryGroups)) {
          this.settings.wordEntryGroups.forEach((group) => {
            if (group && group.active && Array.isArray(group.entries)) {
              const groupCase =
                typeof group.caseSensitiveOverride === "boolean"
                  ? group.caseSensitiveOverride
                  : undefined;
              const groupMatch =
                typeof group.matchTypeOverride === "string" &&
                group.matchTypeOverride
                  ? group.matchTypeOverride
                  : undefined;
              const mapped = group.entries.map((e) => {
                const copy = Object.assign({}, e);
                if (groupMatch) copy.matchType = groupMatch;
                if (groupCase !== undefined)
                  copy._caseSensitiveOverride = groupCase;
                return copy;
              });
              weAll = weAll.concat(mapped);
            }
          });
        }
        we = weAll;
      }
      const blEntries = Array.isArray(this.settings.blacklistEntries)
        ? this.settings.blacklistEntries
        : [];

      // NEW: Handle mark elements (==...==) in reading mode
      try {
        const markElements =
          element && element.nodeName === "MARK"
            ? [element]
            : Array.from(element.querySelectorAll?.("mark") || []);

        for (const mark of markElements) {
          // ALWAYS add the identifier class to mark elements so they aren't hidden by our CSS
          try {
            mark.classList.add("always-color-text-highlight-marks");
          } catch (_) {}

          const styledSpan = mark.querySelector(
            "span.always-color-text-highlight",
          );
          const fallbackSpan =
            styledSpan ||
            mark.querySelector(".always-color-text-highlight") ||
            mark;
          try {
            if (
              fallbackSpan &&
              fallbackSpan !== mark &&
              fallbackSpan.classList
            ) {
              fallbackSpan.classList.add("always-color-text-highlight-marks");
            }
          } catch (_) {}

          const markText = mark.textContent || "";

          let folderForMark = null;
          try {
            folderForMark = this.getBestFolderEntry(filePath);
          } catch (_) {}

          // Try to find a matching preset
          const qsEnabled = !!this.settings.quickStylesEnabled;
          const qsArr = Array.isArray(this.settings.quickStyles)
            ? this.settings.quickStyles
            : [];
          const mt = String(markText || "").trim();
          let quickStyle = null;
          if (qsEnabled && qsArr.length > 0 && mt.length > 0) {
            const lc = mt.toLowerCase();
            quickStyle =
              qsArr.find(
                (s) =>
                  s &&
                  typeof s.name === "string" &&
                  s.name.toLowerCase() === lc,
              ) || null;
          }

          // Improved preset detection: Look for 'highlight' type, 'affectMarkElements', or label/pattern match
          // FIX: Search in reverse to find the latest added preset (user's custom one likely overrides default)
          const findHighlightEntry = (entries) => {
            if (!Array.isArray(entries)) return null;
            const reversed = [...entries].reverse();
            return reversed.find(
              (e) =>
                e &&
                (e.presetLabel === "Highlighted Text (==...)" ||
                  e.presetLabel === "Highlights (====)" ||
                  e.affectMarkElements ||
                  (e.styleType === "highlight" && !e.targetElement)),
            );
          };

          const presetEntry =
            findHighlightEntry(we) || findHighlightEntry(weAll) || null;

          const highlightRegexEntry =
            presetEntry ||
            we.find(
              (e) =>
                e &&
                e.isRegex &&
                typeof e.pattern === "string" &&
                e.pattern.includes("==[\\s\\S]*?=="),
            ) ||
            weAll.find(
              (e) =>
                e &&
                e.isRegex &&
                typeof e.pattern === "string" &&
                e.pattern.includes("==[\\s\\S]*?=="),
            ) ||
            null;

          if (quickStyle) {
            const params = this.getHighlightParams(quickStyle);
            const styleType = quickStyle.styleType || "both";
            const tc = quickStyle.textColor || quickStyle.color || null;
            const bc = quickStyle.backgroundColor || null;

            if (bc) {
              const bgRgba = this.hexToRgba(bc, params.opacity);
              fallbackSpan.style.setProperty(
                "background-color",
                bgRgba,
                "important",
              );
              try {
                mark.style.setProperty("background-color", bgRgba, "important");
              } catch (_) {}
              try {
                fallbackSpan.style.setProperty(
                  "--highlight-background",
                  bgRgba,
                );
              } catch (_) {}
              try {
                mark.style.setProperty("--highlight-background", bgRgba);
              } catch (_) {}
            }

            if (tc) {
              fallbackSpan.style.setProperty("color", tc, "important");
              fallbackSpan.style.setProperty("--highlight-color", tc);
              try {
                mark.style.setProperty("color", tc, "important");
              } catch (_) {}
              try {
                mark.style.setProperty("--highlight-color", tc);
              } catch (_) {}
            }

            fallbackSpan.style.setProperty(
              "padding-left",
              params.hPad + "px",
              "important",
            );
            fallbackSpan.style.setProperty(
              "padding-right",
              params.hPad + "px",
              "important",
            );
            const vpad = params.vPad;
            fallbackSpan.style.setProperty(
              "padding-top",
              (vpad >= 0 ? vpad : 0) + "px",
              "important",
            );
            fallbackSpan.style.setProperty(
              "padding-bottom",
              (vpad >= 0 ? vpad : 0) + "px",
              "important",
            );
            const br =
              params.hPad > 0 && params.radius === 0 ? 0 : params.radius;
            fallbackSpan.style.setProperty(
              "border-radius",
              br + "px",
              "important",
            );
            try {
              const borderCss = this.generateBorderStyle(tc, bc, quickStyle);
              if (borderCss) {
                fallbackSpan.style.cssText += borderCss;
              }
              if (borderCss) {
                mark.style.cssText += borderCss;
              }
            } catch (_) {}
          } else if (presetEntry || highlightRegexEntry) {
            const entryForMark = presetEntry || highlightRegexEntry;
            const params = this.getHighlightParams(entryForMark);
            const tc =
              entryForMark.textColor &&
              entryForMark.textColor !== "currentColor"
                ? entryForMark.textColor
                : entryForMark.color || null;
            const bc = entryForMark.backgroundColor || null;

            if (bc) {
              const bgRgba = this.hexToRgba(bc, params.opacity);
              fallbackSpan.style.setProperty(
                "background-color",
                bgRgba,
                "important",
              );
              try {
                mark.style.setProperty("background-color", bgRgba, "important");
              } catch (_) {}
              try {
                fallbackSpan.style.setProperty(
                  "--highlight-background",
                  bgRgba,
                );
              } catch (_) {}
              try {
                mark.style.setProperty("--highlight-background", bgRgba);
              } catch (_) {}
            }

            if (tc) {
              fallbackSpan.style.setProperty("color", tc, "important");
              fallbackSpan.style.setProperty("--highlight-color", tc);
              try {
                mark.style.setProperty("color", tc, "important");
              } catch (_) {}
              try {
                mark.style.setProperty("--highlight-color", tc);
              } catch (_) {}
            }

            fallbackSpan.style.setProperty(
              "padding-left",
              params.hPad + "px",
              "important",
            );
            fallbackSpan.style.setProperty(
              "padding-right",
              params.hPad + "px",
              "important",
            );
            const vpad = params.vPad;
            fallbackSpan.style.setProperty(
              "padding-top",
              (vpad >= 0 ? vpad : 0) + "px",
              "important",
            );
            fallbackSpan.style.setProperty(
              "padding-bottom",
              (vpad >= 0 ? vpad : 0) + "px",
              "important",
            );
            const br =
              params.hPad > 0 && params.radius === 0 ? 0 : params.radius;
            fallbackSpan.style.setProperty(
              "border-radius",
              br + "px",
              "important",
            );
            try {
              const borderCss = this.generateBorderStyle(tc, bc, entryForMark);
              if (borderCss) {
                fallbackSpan.style.cssText += borderCss;
              }
              if (borderCss) {
                mark.style.cssText += borderCss;
              }
            } catch (_) {}
          }
          // Default fallback if no preset found: restore default appearance by ensuring class is present (done at top)
          // and maybe remove the 'transparent' override if possible?
          // The CSS relies on the class being present. If class is present, our CSS applies.
          // If no inline styles are added, it might look like default highlight or transparent depending on our CSS.
        }
      } catch (e) {
        console.error("Always Color Text: Error handling mark elements", e);
      }

      // Handle STRONG and EM elements: Handled by global CSS (applyFormattingStyles) now
      // to ensure permanent changes as requested.

      const taskCheckedEntry = we.find(
        (e) => e && e.presetLabel === "Task List (Checked)",
      );
      const taskUncheckedEntry = we.find(
        (e) => e && e.presetLabel === "Task List (Unchecked)",
      );
      const bulletEntry = we.find(
        (e) => e && e.presetLabel === "Bullet Points",
      );
      const numberedEntry = we.find(
        (e) => e && e.presetLabel === "Numbered Lists",
      );
      const codeblockEntry = we.find(
        (e) => e && e.presetLabel === "Codeblocks",
      );
      const hasTaskCheckedBlacklist = !!blEntries.find(
        (e) => e && e.presetLabel === "Task List (Checked)" && !!e.isRegex,
      );
      const hasTaskUncheckedBlacklist = !!blEntries.find(
        (e) => e && e.presetLabel === "Task List (Unchecked)" && !!e.isRegex,
      );
      const hasBulletBlacklist = !!blEntries.find(
        (e) => e && e.presetLabel === "Bullet Points" && !!e.isRegex,
      );
      const hasNumberedBlacklist = !!blEntries.find(
        (e) => e && e.presetLabel === "Numbered Lists" && !!e.isRegex,
      );
      const hasCodeblockBlacklist = !!blEntries.find(
        (e) => e && e.presetLabel === "Codeblocks" && !!e.isRegex,
      );

      // Handle codeblock coloring/blocking - find all elements that look like code containers
      if (hasCodeblockBlacklist || codeblockEntry) {
        // Strategy: Find all potential code block containers
        // In Obsidian reading mode, codeblocks are in .markdown-rendered pre
        const potentialCodeblocks = [];

        // Direct code/pre elements
        element
          .querySelectorAll?.("pre, code")
          .forEach((el) => potentialCodeblocks.push(el));

        // Look for markdown-rendered pre blocks (Obsidian reading mode)
        element.querySelectorAll?.(".markdown-rendered pre").forEach((el) => {
          if (!potentialCodeblocks.includes(el)) potentialCodeblocks.push(el);
        });

        // Look for divs that contain the code block marker structure
        // Obsidian often wraps code blocks in divs with language indicators
        element.querySelectorAll?.("div").forEach((div) => {
          const text = div.textContent || "";
          const classes = (div.className || "").toLowerCase();

          // Check if div looks like a code block by examining content or class
          if (
            (classes.includes("code") ||
              classes.includes("language-") ||
              (div.querySelector("code") && div.children.length < 5)) &&
            !potentialCodeblocks.includes(div)
          ) {
            potentialCodeblocks.push(div);
          }
        });

        // Check element itself if it matches code patterns
        if (
          element &&
          (element.nodeName === "CODE" ||
            element.nodeName === "PRE" ||
            (element.className && element.className.includes("language-")))
        ) {
          if (!potentialCodeblocks.includes(element))
            potentialCodeblocks.push(element);
        }

        // Process each potential codeblock
        const processedElements = new Set();
        for (const cb of potentialCodeblocks) {
          if (processedElements.has(cb)) continue;
          processedElements.add(cb);

          if (hasCodeblockBlacklist) {
            // Remove all coloring from codeblock
            try {
              cb.classList.add("act-skip-coloring");
              cb.style.color = "";
              const highlights = cb.querySelectorAll(
                "span.always-color-text-highlight",
              );
              for (const ex of highlights) {
                const tn = document.createTextNode(ex.textContent);
                ex.replaceWith(tn);
              }
            } catch (_) {}
          } else if (codeblockEntry) {
            // Color the entire codeblock content
            try {
              this._colorCodeblockContent(cb, codeblockEntry);
            } catch (e) {
              debugError("CODEBLOCK_COLOR", "Failed to color codeblock", e);
            }
          }
        }
      }

      if (
        !taskCheckedEntry &&
        !taskUncheckedEntry &&
        !bulletEntry &&
        !numberedEntry
      )
        return;
      let listItems = Array.from(element.querySelectorAll?.("li") || []);
      if (element && element.nodeName === "LI" && listItems.length === 0)
        listItems = [element];
      try {
        debugLog(
          "MARKDOWN_FORMAT",
          `Found ${listItems.length} list items (node=${element.nodeName})`,
        );
      } catch (_) {}
      for (const li of listItems) {
        if (li.closest("code, pre")) continue;
        // Extract actual content, stripping markdown prefixes
        const contentText = this.extractListItemContent(li);
        const contentBlacklisted = this.containsBlacklistedWord(
          contentText,
          filePath,
        );
        try {
          debugLog("MARKDOWN_FORMAT", "LI", {
            innerHTML: (li.innerHTML || "").substring(0, 100),
            textContent: (li.textContent || "").substring(0, 100),
            hasCheckbox: !!li.querySelector('input[type="checkbox"]'),
            parentTag: li.parentElement?.tagName,
          });
        } catch (_) {}
        const hasTaskAttr = li.getAttribute("data-task");
        const checkbox = li.querySelector('input[type="checkbox"]');
        const isTaskItem = hasTaskAttr !== null || checkbox !== null;
        if (isTaskItem && (taskCheckedEntry || taskUncheckedEntry)) {
          const isChecked =
            hasTaskAttr === "x" ||
            hasTaskAttr === "X" ||
            (checkbox && checkbox.checked);
          const entry = isChecked ? taskCheckedEntry : taskUncheckedEntry;
          const blocked =
            (isChecked && hasTaskCheckedBlacklist) ||
            (!isChecked && hasTaskUncheckedBlacklist);
          if (blocked) {
            try {
              li.classList.add("act-skip-coloring");
              li.classList.remove("act-colored-list-item");
              li.style.removeProperty("--act-marker-color");
              li.style.color = "";
              const highlights = li.querySelectorAll(
                "span.always-color-text-highlight",
              );
              for (const ex of highlights) {
                const tn = document.createTextNode(ex.textContent);
                ex.replaceWith(tn);
              }
            } catch (_) {}
            continue;
          }
          if (entry) {
            if (!contentBlacklisted) this._colorListItemContent(li, entry);
            if (checkbox) this._styleCheckbox(checkbox, entry);
            else this._styleTaskMarker(li, entry);
          }
        } else if (!isTaskItem && (bulletEntry || numberedEntry)) {
          const isOrdered = li.parentElement?.tagName === "OL";
          const entry = isOrdered ? numberedEntry : bulletEntry;
          const blocked =
            (isOrdered && hasNumberedBlacklist) ||
            (!isOrdered && hasBulletBlacklist);
          if (blocked) {
            try {
              li.classList.add("act-skip-coloring");
              li.classList.remove("act-colored-list-item");
              li.style.removeProperty("--act-marker-color");
              li.style.color = "";
              const highlights = li.querySelectorAll(
                "span.always-color-text-highlight",
              );
              for (const ex of highlights) {
                const tn = document.createTextNode(ex.textContent);
                ex.replaceWith(tn);
              }
            } catch (_) {}
            continue;
          }
          if (entry) {
            if (!contentBlacklisted) this._colorListItemContent(li, entry);
            this._styleListMarker(li, entry, isOrdered);
          }
        }
      }
      let paragraphs = Array.from(element.querySelectorAll?.("p") || []);
      if (element && element.nodeName === "P" && paragraphs.length === 0)
        paragraphs = [element];
      for (const p of paragraphs) {
        const checkbox = p.querySelector('input[type="checkbox"]');
        if (!checkbox) continue;
        const isChecked = checkbox.checked;
        const entry = isChecked ? taskCheckedEntry : taskUncheckedEntry;
        // Extract actual content, stripping checkbox prefix
        const contentText = this.extractListItemContent(p);
        const contentBlacklistedP = this.containsBlacklistedWord(
          contentText,
          filePath,
        );
        const blocked =
          (isChecked && hasTaskCheckedBlacklist) ||
          (!isChecked && hasTaskUncheckedBlacklist);
        if (blocked) {
          try {
            p.classList.add("act-skip-coloring");
            p.classList.remove("act-colored-list-item");
            p.style.removeProperty("--act-marker-color");
            p.style.color = "";
            const highlights = p.querySelectorAll(
              "span.always-color-text-highlight",
            );
            for (const ex of highlights) {
              const tn = document.createTextNode(ex.textContent);
              ex.replaceWith(tn);
            }
          } catch (_) {}
          continue;
        }
        if (entry) {
          this._styleCheckbox(checkbox, entry);
          if (!contentBlacklistedP) this._colorListItemContent(p, entry);
        }
      }
    } catch (e) {
      try {
      } catch (_) {}
    }
  }

  // Helper: Style checkbox elements
  _styleCheckbox(checkbox, entry) {
    try {
      // Determine color to use
      const color =
        entry.color ||
        entry.textColor ||
        (entry.backgroundColor && entry.backgroundColor !== "currentColor"
          ? entry.backgroundColor
          : null);

      if (color) {
        // Modern approach: use accent-color (limited browser support)
        checkbox.style.accentColor = color;
      }
    } catch (e) {}
  }

  // Helper: Style list markers (bullets/numbers)
  _styleListMarker(li, entry, isOrdered) {
    try {
      const color =
        entry.color ||
        entry.textColor ||
        (entry.backgroundColor && entry.backgroundColor !== "currentColor"
          ? entry.backgroundColor
          : null);

      if (color) {
        // Method 1: Use CSS ::marker pseudo-element (modern browsers)
        li.style.setProperty("--act-marker-color", color);

        // Method 2: Target Obsidian's specific markup
        const marker = li.querySelector(".list-bullet, .list-number");
        if (marker) {
          marker.style.color = color;
        }

        // Add class for CSS targeting
        li.classList.add("act-colored-list-item");

        // Method 3: Inject CSS for the list item if not already done
        if (!document.getElementById("act-list-marker-style")) {
          const style = document.createElement("style");
          style.id = "act-list-marker-style";
          style.textContent = `
            .act-colored-list-item { position: relative; }
            li.act-colored-list-item::marker { color: var(--act-marker-color, inherit); }
            li.act-colored-list-item .list-bullet,
            li.act-colored-list-item .list-number { color: var(--act-marker-color, inherit); }
            .markdown-preview-view li.act-colored-list-item::marker { color: var(--act-marker-color, inherit); }
            .markdown-reading-view li.act-colored-list-item::marker { color: var(--act-marker-color, inherit); }
          `;
          try {
            document.head.appendChild(style);
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  _styleTaskMarker(li, entry) {
    try {
      const walker = document.createTreeWalker(
        li,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const t = node.textContent || "";
            if (t.includes("[x]") || t.includes("[X]") || t.includes("[ ]"))
              return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_REJECT;
          },
        },
        false,
      );
      let n;
      while ((n = walker.nextNode())) {
        const color =
          entry.color ||
          entry.textColor ||
          (entry.backgroundColor && entry.backgroundColor !== "currentColor"
            ? entry.backgroundColor
            : null);
        if (!color) continue;
        const span = document.createElement("span");
        try {
          span.style.setProperty("color", color, "important");
        } catch (_) {
          span.style.color = color;
        }
        span.textContent = n.textContent;
        n.replaceWith(span);
      }
    } catch (e) {}
  }

  // Helper: Color list item content
  _colorListItemContent(li, entry) {
    try {
      // In live preview, we should only color the content, not the markers
      // Check if we're in live preview mode
      const isLivePreview = li.closest && li.closest(".is-live-preview");

      // If in live preview, extract and color only the content text, excluding markers
      if (isLivePreview) {
        const contentText = this.extractListItemContent(li);
        if (!contentText || !contentText.trim()) return;

        // Find all text nodes that contain the content
        const walker = document.createTreeWalker(
          li,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              if (
                node.parentElement?.closest(
                  "code, pre, .always-color-text-highlight",
                )
              ) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            },
          },
          false,
        );

        const nodes = [];
        let node;
        while ((node = walker.nextNode())) {
          // Skip empty nodes and nodes that are just whitespace or markers
          const text = node.textContent;
          if (!text.trim()) continue;

          // Skip nodes that are only checkbox/marker related
          const parent = node.parentElement;
          if (
            parent &&
            parent.classList &&
            (parent.classList.contains("list-bullet") ||
              parent.classList.contains("list-number") ||
              parent.classList.contains("task-list-item-checkbox") ||
              parent.classList.contains("checkbox-container"))
          ) {
            continue;
          }

          // Skip if parent is input checkbox
          if (parent && parent.nodeName === "INPUT") continue;

          nodes.push(node);
        }

        // Process only content nodes, not marker nodes
        for (let i = nodes.length - 1; i >= 0; i--) {
          this._wrapTextNodeWithColor(nodes[i], entry);
        }
        return;
      }

      // Original behavior for reading mode: color all text nodes
      const walker = document.createTreeWalker(
        li,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            // Skip text nodes in code blocks or already processed
            if (
              node.parentElement?.closest(
                "code, pre, .always-color-text-highlight",
              )
            ) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        },
        false,
      );

      const nodes = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.trim()) {
          nodes.push(node);
        }
      }

      // Process in reverse to avoid invalidating the walker
      for (let i = nodes.length - 1; i >= 0; i--) {
        this._wrapListTextNode(nodes[i], entry);
      }
    } catch (e) {}
  }

  // Helper: Wrap a single text node with color styling
  _wrapTextNodeWithColor(textNode, entry) {
    try {
      try {
        if (textNode.parentElement?.closest(".act-skip-coloring")) return;
      } catch (_) {}
      let text = textNode.textContent;
      if (!text.trim()) return;
      text = this.decodeHtmlEntities(text);

      // Get the regex from entry and find matches
      const regex = entry.regex;
      if (!regex) return;

      // Find all matches in the text
      const rawMatches = [];
      let match;
      const globalRegex = new RegExp(
        regex.source,
        regex.flags.includes("g") ? regex.flags : regex.flags + "g",
      );
      while ((match = globalRegex.exec(text)) !== null) {
        rawMatches.push({ index: match.index, length: match[0].length });
      }

      if (rawMatches.length === 0) return;

      const isSentencePattern = /[\s,\.;:!\?"'\(\)\[\]\{\}<>]/.test(
        entry.pattern || "",
      );
      const mtLower = String(
        (entry && entry.matchType) ||
          (this.settings.partialMatch ? "contains" : "exact"),
      ).toLowerCase();

      // Build expanded ranges: expand all matches to full word boundaries for partial matches
      let ranges = [];
      for (const m of rawMatches) {
        let matchStart = m.index;
        let matchEnd = m.index + m.length;

        debugLog("READING_MATCH", `Found match: "${text.slice(matchStart, matchEnd)}" at ${matchStart}-${matchEnd}`);

        // Check if this match satisfies the match type requirement
        if (!this.matchSatisfiesType(text, matchStart, matchEnd, entry))
          continue;

        let colorStart = matchStart;
        let colorEnd = matchEnd;

        // For non-sentence patterns, expand to full word boundaries for all partial match types
        if (
          !isSentencePattern &&
          (mtLower === "contains" ||
            mtLower === "startswith" ||
            mtLower === "endswith")
        ) {
          colorStart = this.findWordStart(text, matchStart);
          colorEnd = this.findWordEnd(text, matchEnd);
        }
        // For exact matches on non-sentence patterns, no expansion needed (already verified as whole word)
        // For sentence patterns, use the match as-is

        ranges.push({ start: colorStart, end: colorEnd });
      }

      if (ranges.length === 0) return;

      // Resolve overlaps: prefer longer range first (by length), then earlier start position
      ranges.sort((a, b) => {
        const la = a.end - a.start,
          lb = b.end - b.start;
        if (la !== lb) return lb - la; // Prefer longer ranges first
        return a.start - b.start; // Then prefer earlier start position
      });
      const selected = [];
      for (const r of ranges) {
        let overlaps = false;
        for (const s of selected) {
          if (r.start < s.end && r.end > s.start) {
            overlaps = true;
            break;
          }
        }
        if (!overlaps) selected.push(r);
      }

      const frag = document.createDocumentFragment();
      let lastEnd = 0;
      for (const r of selected) {
        if (lastEnd < r.start)
          frag.appendChild(
            document.createTextNode(text.substring(lastEnd, r.start)),
          );
        const span = document.createElement("span");
        span.className = "always-color-text-highlight";
        span.textContent = text.substring(r.start, r.end);

        const styleType = entry.styleType || "text";
        const hideText = this.settings.hideTextColors === true;
        const hideBg = this.settings.hideHighlights === true;
        const textColor =
          entry.textColor && entry.textColor !== "currentColor"
            ? entry.textColor
            : null;
        const resolvedTextColor = textColor || entry.color || null;

        if (resolvedTextColor && this.isDarkColor(resolvedTextColor)) {
          span.classList.add("act-dark-color");
        }

        if (styleType === "text") {
          if (resolvedTextColor && !hideText) {
            try {
              span.style.setProperty("color", resolvedTextColor, "important");
            } catch (_) {
              span.style.color = resolvedTextColor;
            }
            try {
              span.style.setProperty("--highlight-color", resolvedTextColor);
            } catch (_) {
              try {
                span.style["--highlight-color"] = resolvedTextColor;
              } catch (_) {}
            }
          }
        } else if (styleType === "highlight") {
          if (!hideBg) {
            const base =
              entry.backgroundColor || entry.color || resolvedTextColor;
            const bgColor = this.hexToRgba(
              base,
              this.settings.backgroundOpacity ?? 25,
            );
            try {
              span.style.setProperty("background-color", bgColor, "important");
            } catch (_) {
              span.style.backgroundColor = bgColor;
            }
            try {
              span.style.setProperty("display", "inline-block", "important");
            } catch (_) {
              span.style.display = "inline-block";
            }
            span.style.paddingLeft = span.style.paddingRight =
              (this.settings.highlightHorizontalPadding ?? 4) + "px";
            try {
              const vpad = this.settings.highlightVerticalPadding ?? 0;
              span.style.setProperty(
                "padding-top",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              span.style.setProperty(
                "padding-bottom",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              if (vpad < 0) {
                span.style.setProperty("margin-top", vpad + "px", "important");
                span.style.setProperty(
                  "margin-bottom",
                  vpad + "px",
                  "important",
                );
              }
            } catch (_) {
              const vpad = this.settings.highlightVerticalPadding ?? 0;
              span.style.paddingTop = span.style.paddingBottom =
                (vpad >= 0 ? vpad : 0) + "px";
              if (vpad < 0) {
                span.style.marginTop = vpad + "px";
                span.style.marginBottom = vpad + "px";
              }
            }
            span.style.borderRadius =
              (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
          } else {
            try {
              span.style.setProperty(
                "background-color",
                "transparent",
                "important",
              );
            } catch (_) {
              span.style.backgroundColor = "transparent";
            }
            try {
              span.style.setProperty("display", "inline", "important");
            } catch (_) {
              span.style.display = "inline";
            }
            span.style.paddingLeft = span.style.paddingRight = "0px";
            span.style.border = "";
            span.style.borderRadius = "";
          }
        } else {
          if (resolvedTextColor && !hideText) {
            try {
              span.style.setProperty("color", resolvedTextColor, "important");
            } catch (_) {
              span.style.color = resolvedTextColor;
            }
            try {
              span.style.setProperty("--highlight-color", resolvedTextColor);
            } catch (_) {
              try {
                span.style["--highlight-color"] = resolvedTextColor;
              } catch (_) {}
            }
          }
          if (!hideBg) {
            const base =
              entry.backgroundColor || entry.color || resolvedTextColor;
            const bgColor = this.hexToRgba(
              base,
              this.settings.backgroundOpacity ?? 25,
            );
            try {
              span.style.setProperty("background-color", bgColor, "important");
            } catch (_) {
              span.style.backgroundColor = bgColor;
            }
            try {
              span.style.setProperty("display", "inline-block", "important");
            } catch (_) {
              span.style.display = "inline-block";
            }
            span.style.paddingLeft = span.style.paddingRight =
              (this.settings.highlightHorizontalPadding ?? 4) + "px";
            try {
              const vpad = this.settings.highlightVerticalPadding ?? 0;
              span.style.setProperty(
                "padding-top",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              span.style.setProperty(
                "padding-bottom",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              if (vpad < 0) {
                span.style.setProperty("margin-top", vpad + "px", "important");
                span.style.setProperty(
                  "margin-bottom",
                  vpad + "px",
                  "important",
                );
              }
            } catch (_) {
              const vpad = this.settings.highlightVerticalPadding ?? 0;
              span.style.paddingTop = span.style.paddingBottom =
                (vpad >= 0 ? vpad : 0) + "px";
              if (vpad < 0) {
                span.style.marginTop = vpad + "px";
                span.style.marginBottom = vpad + "px";
              }
            }
            span.style.borderRadius =
              (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
          } else {
            try {
              span.style.setProperty(
                "background-color",
                "transparent",
                "important",
              );
            } catch (_) {
              span.style.backgroundColor = "transparent";
            }
            try {
              span.style.setProperty("display", "inline", "important");
            } catch (_) {
              span.style.display = "inline";
            }
            span.style.paddingLeft = span.style.paddingRight = "0px";
            span.style.border = "";
            span.style.borderRadius = "";
          }
        }

        if (this.settings.enableCustomCss && entry?._groupRef?.customCss) {
          this.applyCustomCssToElement(span, entry._groupRef);
        }
        this.applyCustomCssToElement(span, entry);
        frag.appendChild(span);
        lastEnd = r.end;
      }
      if (lastEnd < text.length)
        frag.appendChild(document.createTextNode(text.substring(lastEnd)));
      textNode.replaceWith(frag);
    } catch (e) {
      debugError("WRAP_TEXT_NODE", "Error wrapping text node", e);
    }
  }

  _wrapListTextNode(textNode, entry) {
    try {
      let text = textNode.textContent;
      if (!text || !text.trim()) return;
      text = this.decodeHtmlEntities(text);

      // Get the regex from entry and find matches
      const regex = entry.regex;
      if (!regex) return;

      // Find all matches in the text
      const rawMatches = [];
      let match;
      const globalRegex = new RegExp(
        regex.source,
        regex.flags.includes("g") ? regex.flags : regex.flags + "g",
      );
      while ((match = globalRegex.exec(text)) !== null) {
        rawMatches.push({ index: match.index, length: match[0].length });
      }

      if (rawMatches.length === 0) return;

      const isSentencePattern = /[\s,\.;:!\?"'\(\)\[\]\{\}<>]/.test(
        entry.pattern || "",
      );
      const mtLower = String(
        (entry && entry.matchType) ||
          (this.settings.partialMatch ? "contains" : "exact"),
      ).toLowerCase();

      // Build expanded ranges: expand all matches to full word boundaries for partial matches
      let ranges = [];
      for (const m of rawMatches) {
        let matchStart = m.index;
        let matchEnd = m.index + m.length;

        // Check if this match satisfies the match type requirement
        if (!this.matchSatisfiesType(text, matchStart, matchEnd, entry))
          continue;

        let colorStart = matchStart;
        let colorEnd = matchEnd;

        // For non-sentence patterns, expand to full word boundaries for all partial match types
        if (
          !isSentencePattern &&
          (mtLower === "contains" ||
            mtLower === "startswith" ||
            mtLower === "endswith")
        ) {
          colorStart = this.findWordStart(text, matchStart);
          colorEnd = this.findWordEnd(text, matchEnd);
        }
        // For exact matches on non-sentence patterns, no expansion needed (already verified as whole word)
        // For sentence patterns, use the match as-is

        ranges.push({ start: colorStart, end: colorEnd });
      }

      if (ranges.length === 0) return;

      // Resolve overlaps: prefer longer range first (by length), then earlier start position
      ranges.sort((a, b) => {
        const la = a.end - a.start,
          lb = b.end - b.start;
        if (la !== lb) return lb - la; // Prefer longer ranges first
        return a.start - b.start; // Then prefer earlier start position
      });
      const selected = [];
      for (const r of ranges) {
        let overlaps = false;
        for (const s of selected) {
          if (r.start < s.end && r.end > s.start) {
            overlaps = true;
            break;
          }
        }
        if (!overlaps) selected.push(r);
      }

      const frag = document.createDocumentFragment();
      let lastEnd = 0;
      for (const r of selected) {
        if (lastEnd < r.start)
          frag.appendChild(
            document.createTextNode(text.substring(lastEnd, r.start)),
          );
        const span = document.createElement("span");
        span.className = "always-color-text-highlight";
        span.textContent = text.substring(r.start, r.end);

        const styleType = entry.styleType || "text";
        const hideText = this.settings.hideTextColors === true;
        const hideBg = this.settings.hideHighlights === true;
        const textColor =
          entry.textColor && entry.textColor !== "currentColor"
            ? entry.textColor
            : null;
        const resolvedTextColor = textColor || entry.color || null;

        if (styleType === "text") {
          if (resolvedTextColor && !hideText) {
            try {
              span.style.setProperty("color", resolvedTextColor, "important");
            } catch (_) {
              span.style.color = resolvedTextColor;
            }
            try {
              span.style.setProperty("--highlight-color", resolvedTextColor);
            } catch (_) {
              try {
                span.style["--highlight-color"] = resolvedTextColor;
              } catch (_) {}
            }
          }
        } else if (styleType === "highlight") {
          if (!hideBg) {
            const base =
              entry.backgroundColor || entry.color || resolvedTextColor;
            const bgColor = this.hexToRgba(
              base,
              this.settings.backgroundOpacity ?? 25,
            );
            try {
              span.style.setProperty("background-color", bgColor, "important");
            } catch (_) {
              span.style.backgroundColor = bgColor;
            }
            try {
              span.style.setProperty("display", "inline-block", "important");
            } catch (_) {
              span.style.display = "inline-block";
            }
            span.style.paddingLeft = span.style.paddingRight =
              (this.settings.highlightHorizontalPadding ?? 4) + "px";
            try {
              const vpad = this.settings.highlightVerticalPadding ?? 0;
              span.style.setProperty(
                "padding-top",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              span.style.setProperty(
                "padding-bottom",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              if (vpad < 0) {
                span.style.setProperty("margin-top", vpad + "px", "important");
                span.style.setProperty(
                  "margin-bottom",
                  vpad + "px",
                  "important",
                );
              }
            } catch (_) {
              const vpad = this.settings.highlightVerticalPadding ?? 0;
              span.style.paddingTop = span.style.paddingBottom =
                (vpad >= 0 ? vpad : 0) + "px";
              if (vpad < 0) {
                span.style.marginTop = vpad + "px";
                span.style.marginBottom = vpad + "px";
              }
            }
            span.style.borderRadius =
              (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
            this.applyBorderStyleToElement(span, null, base);
          } else {
            try {
              span.style.setProperty(
                "background-color",
                "transparent",
                "important",
              );
            } catch (_) {
              span.style.backgroundColor = "transparent";
            }
            try {
              span.style.setProperty("display", "inline", "important");
            } catch (_) {
              span.style.display = "inline";
            }
            span.style.paddingLeft = span.style.paddingRight = "0px";
            span.style.border = "";
            span.style.borderRadius = "";
          }
        } else {
          if (resolvedTextColor && !hideText) {
            try {
              span.style.setProperty("color", resolvedTextColor, "important");
            } catch (_) {
              span.style.color = resolvedTextColor;
            }
            try {
              span.style.setProperty("--highlight-color", resolvedTextColor);
            } catch (_) {
              try {
                span.style["--highlight-color"] = resolvedTextColor;
              } catch (_) {}
            }
          }
          if (!hideBg) {
            const base =
              entry.backgroundColor || entry.color || resolvedTextColor;
            const bgColor = this.hexToRgba(
              base,
              this.settings.backgroundOpacity ?? 25,
            );
            try {
              span.style.setProperty("background-color", bgColor, "important");
            } catch (_) {
              span.style.backgroundColor = bgColor;
            }
            try {
              span.style.setProperty("display", "inline-block", "important");
            } catch (_) {
              span.style.display = "inline-block";
            }
            span.style.paddingLeft = span.style.paddingRight =
              (this.settings.highlightHorizontalPadding ?? 4) + "px";
            try {
              const vpad = this.settings.highlightVerticalPadding ?? 0;
              span.style.setProperty(
                "padding-top",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              span.style.setProperty(
                "padding-bottom",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              if (vpad < 0) {
                span.style.setProperty("margin-top", vpad + "px", "important");
                span.style.setProperty(
                  "margin-bottom",
                  vpad + "px",
                  "important",
                );
              }
            } catch (_) {
              const vpad = this.settings.highlightVerticalPadding ?? 0;
              span.style.paddingTop = span.style.paddingBottom =
                (vpad >= 0 ? vpad : 0) + "px";
              if (vpad < 0) {
                span.style.marginTop = vpad + "px";
                span.style.marginBottom = vpad + "px";
              }
            }
            span.style.borderRadius =
              (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
            this.applyBorderStyleToElement(
              span,
              hideText ? null : resolvedTextColor,
              base,
            );
          } else {
            try {
              span.style.setProperty(
                "background-color",
                "transparent",
                "important",
              );
            } catch (_) {
              span.style.backgroundColor = "transparent";
            }
            try {
              span.style.setProperty("display", "inline", "important");
            } catch (_) {
              span.style.display = "inline";
            }
            span.style.paddingLeft = span.style.paddingRight = "0px";
            span.style.border = "";
            span.style.borderRadius = "";
          }
        }

        if (this.settings.enableCustomCss && entry?._groupRef?.customCss) {
          this.applyCustomCssToElement(span, entry._groupRef);
        }
        this.applyCustomCssToElement(span, entry);
        frag.appendChild(span);
        lastEnd = r.end;
      }
      if (lastEnd < text.length)
        frag.appendChild(document.createTextNode(text.substring(lastEnd)));
      textNode.replaceWith(frag);
    } catch (e) {}
  }

  // NEW METHOD: Color all content within a codeblock
  _colorCodeblockContent(codeblock, entry) {
    try {
      // Check hide flags early
      const hideText = this.settings.hideTextColors === true;
      const hideBg = this.settings.hideHighlights === true;

      // Verify this is actually a codeblock-like element
      const classes = (codeblock.className || "").toLowerCase();
      const isCodeBlock =
        codeblock.nodeName === "CODE" ||
        codeblock.nodeName === "PRE" ||
        classes.includes("code") ||
        classes.includes("language-") ||
        codeblock.querySelector("code") ||
        codeblock.querySelector("pre");

      if (!isCodeBlock) {
        return; // Not a code block, skip
      }

      // Get the color/style settings
      const color = entry.color || entry.textColor;
      const bgColor = entry.backgroundColor;
      const styleType = entry.styleType || "text";

      // Skip if appropriate hide flag is set
      if (
        (styleType === "text" && hideText) ||
        ((styleType === "highlight" || styleType === "both") && hideBg)
      ) {
        return;
      }

      // Find all text nodes in the codeblock
      const walker = document.createTreeWalker(
        codeblock,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const text = node.textContent || "";
            if (text.trim()) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_REJECT;
          },
        },
        false,
      );

      const nodes = [];
      let node;
      while ((node = walker.nextNode())) {
        nodes.push(node);
      }

      // Process text nodes in reverse to avoid invalidating walker
      for (let i = nodes.length - 1; i >= 0; i--) {
        const textNode = nodes[i];
        const text = textNode.textContent;
        if (!text.trim()) continue;

        // Create span with appropriate styling
        const span = document.createElement("span");
        span.className = "always-color-text-highlight";
        if (
          (color && this.isDarkColor(color)) ||
          (bgColor && this.isDarkColor(bgColor))
        ) {
          span.classList.add("act-dark-color");
        }
        span.textContent = text;

        if (styleType === "text" && color) {
          try {
            span.style.setProperty("color", color, "important");
          } catch (_) {
            span.style.color = color;
          }
        } else if (styleType === "highlight" && bgColor) {
          const rgba = this.hexToRgba(
            bgColor,
            this.settings.backgroundOpacity ?? 25,
          );
          try {
            span.style.setProperty("background-color", rgba, "important");
          } catch (_) {
            span.style.backgroundColor = rgba;
          }
          span.style.paddingLeft =
            (this.settings.highlightHorizontalPadding ?? 4) + "px";
          span.style.paddingRight =
            (this.settings.highlightHorizontalPadding ?? 4) + "px";
          try {
            span.style.setProperty(
              "padding-top",
              (this.settings.highlightVerticalPadding ?? 0) + "px",
              "important",
            );
            span.style.setProperty(
              "padding-bottom",
              (this.settings.highlightVerticalPadding ?? 0) + "px",
              "important",
            );
          } catch (_) {
            span.style.paddingTop = span.style.paddingBottom =
              (this.settings.highlightVerticalPadding ?? 0) + "px";
          }
          span.style.borderRadius =
            (this.settings.highlightBorderRadius ?? 8) + "px";
          if (this.settings.enableBoxDecorationBreak ?? true) {
            span.style.boxDecorationBreak = "clone";
            span.style.WebkitBoxDecorationBreak = "clone";
          }
        } else if (styleType === "both") {
          if (color) {
            try {
              span.style.setProperty("color", color, "important");
            } catch (_) {
              span.style.color = color;
            }
          }
          if (bgColor) {
            const rgba = this.hexToRgba(
              bgColor,
              this.settings.backgroundOpacity ?? 25,
            );
            try {
              span.style.setProperty("background-color", rgba, "important");
            } catch (_) {
              span.style.backgroundColor = rgba;
            }
            span.style.paddingLeft =
              (this.settings.highlightHorizontalPadding ?? 4) + "px";
            span.style.paddingRight =
              (this.settings.highlightHorizontalPadding ?? 4) + "px";
            try {
              span.style.setProperty(
                "padding-top",
                (this.settings.highlightVerticalPadding ?? 0) + "px",
                "important",
              );
              span.style.setProperty(
                "padding-bottom",
                (this.settings.highlightVerticalPadding ?? 0) + "px",
                "important",
              );
            } catch (_) {
              span.style.paddingTop = span.style.paddingBottom =
                (this.settings.highlightVerticalPadding ?? 0) + "px";
            }
            span.style.borderRadius =
              (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
          }
        }

        if (this.settings.enableCustomCss && entry?._groupRef?.customCss) {
          this.applyCustomCssToElement(span, entry._groupRef);
        }
        this.applyCustomCssToElement(span, entry);
        textNode.replaceWith(span);
      }

      debugLog("CODEBLOCK", `Colored codeblock with style: ${styleType}`);
    } catch (e) {
      debugError("COLOR_CODEBLOCK", "Error coloring codeblock content", e);
    }
  }

  // NEW METHOD: Only use complex processing when absolutely necessary
  processComplexPatterns(element, complexEntries, folderEntry, options = {}) {
    // Use existing _wrapMatchesRecursive logic but with performance safeguards
    const blockTags = [
      "P",
      "LI",
      "DIV",
      "SPAN",
      "TD",
      "TH",
      "BLOCKQUOTE",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
    ];
    const blocks = element.querySelectorAll?.(blockTags.join(", ")) || [];

    // Process in small batches to avoid UI freeze
    const BATCH_SIZE = 10;
    let processed = 0;

    for (const block of blocks) {
      if (block.closest("code, pre")) continue;

      this.processSingleBlockComplex(
        block,
        complexEntries,
        folderEntry,
        options,
      );
      processed++;

      // Yield to browser every BATCH_SIZE blocks
      if (processed % BATCH_SIZE === 0) {
        setTimeout(() => {
          // Continue processing if needed
        }, 0);
        break; // Process rest in next frame
      }
    }
  }

  // --- When the plugin is UNLOADING, remove all its UI and features ---
  onunload() {
    // Clear any pending timers
    try {
      if (this._refreshTimeout) {
        clearTimeout(this._refreshTimeout);
        this._refreshTimeout = null;
      }
      if (this._editorRefreshTimeout) {
        clearTimeout(this._editorRefreshTimeout);
        this._editorRefreshTimeout = null;
      }
    } catch (e) {}

    // Remove event listeners that may hold onto closures
    try {
      if (this.activeLeafChangeListener) {
        this.app.workspace.off(
          "active-leaf-change",
          this.activeLeafChangeListener,
        );
        this.activeLeafChangeListener = null;
      }
    } catch (e) {}

    // Clean up global event listeners
    try {
      if (this._docCtx) {
        document.removeEventListener("contextmenu", this._docCtx, true);
        document.removeEventListener("mousedown", this._docCtx, true);
        document.removeEventListener("pointerdown", this._docCtx, true);
      }
      if (this._docAux) {
        document.removeEventListener("auxclick", this._docAux, true);
      }
      if (this._dropdownClickListener) {
        document.removeEventListener("click", this._dropdownClickListener);
      }
      if (this._dropdownKeyListener) {
        document.removeEventListener("keydown", this._dropdownKeyListener);
      }
      if (this._scrollListener) {
        document.removeEventListener("scroll", this._scrollListener, true);
      }
      window.removeEventListener(
        "act-colors-changed",
        this.syncColorsFromParent,
      );
      window.removeEventListener("act-style-updated", this.styleUpdateHandler);
    } catch (e) {}

    // Clean up DOM references
    try {
      this.ribbonIcon?.remove();
    } catch (e) {}
    try {
      this.statusBar?.remove();
    } catch (e) {}

    // Clear large in-memory structures
    try {
      if (
        Array.isArray(this._compiledWordEntries) &&
        this._compiledWordEntries.length > 0
      ) {
        const top = this._compiledWordEntries
          .slice()
          .sort((a, b) => (b.execs || 0) - (a.execs || 0))
          .slice(0, 5);
        if (IS_DEVELOPMENT) {
          for (const e of top) {
            debugLog(
              "UNLOAD",
              `pattern: ${e.pattern}, execs: ${e.execs || 0}, avoided: ${e.avoidedExecs || 0}, matches: ${e.matchesFound || 0}`,
            );
          }
        }
      }
    } catch (e) {}
    try {
      // Stop memory monitor and perform a full cleanup to release large refs
      try {
        this.stopMemoryMonitor();
      } catch (e) {}
      try {
        this.cleanup();
      } catch (e) {}
      try {
        this._compiledWordEntries = [];
        this._cachedSortedEntries = null;
        this._cacheDirty = true;
      } catch (e) {}
    } catch (e) {}
    try {
      if (this.settings && Array.isArray(this.settings.wordEntries))
        this.settings.wordEntries.length = 0;
    } catch (e) {}
    try {
      if (Array.isArray(this._eventListeners)) {
        this._eventListeners.forEach(({ el, event, handler }) => {
          try {
            el &&
              el.removeEventListener &&
              el.removeEventListener(event, handler);
          } catch (e) {}
        });
        this._eventListeners = [];
      }
    } catch (e) {}
    try {
      this._domRefs = new WeakMap();
    } catch (e) {}
    try {
      if (Array.isArray(this._dynamicHandlers)) {
        this._dynamicHandlers.forEach((fn) => {
          try {
            typeof fn === "function" && fn();
          } catch (e) {}
        });
        this._dynamicHandlers = [];
      }
    } catch (e) {}
    try {
      this._eventManager &&
        this._eventManager.clear &&
        this._eventManager.clear();
    } catch (_) {}
    try {
      this._memoryManager &&
        this._memoryManager.stop &&
        this._memoryManager.stop();
    } catch (_) {}
    // Clean up reading mode intervals
    try {
      if (
        this._readingModeIntervals &&
        this._readingModeIntervals instanceof Map
      ) {
        for (const interval of this._readingModeIntervals.values()) {
          try {
            clearInterval(interval);
          } catch (e) {}
        }
        this._readingModeIntervals.clear();
      }
    } catch (e) {}
    // Clear all highlights when plugin is unloaded
    try {
      this.clearAllHighlights();
    } catch (e) {}
    // Disable features (unregister processors/listeners) as final step
    this.disablePluginFeatures();
  }

  // --- Register CodeMirror, markdown, and listeners ---
  updateLightModeFixer() {
    try {
      if (this.settings.enabled && this.settings.lightModeFixer) {
        document.body.classList.add("act-light-mode-fix");
      } else {
        document.body.classList.remove("act-light-mode-fix");
      }
    } catch (e) {}
  }

  updateDarkModeFixer() {
    try {
      if (this.settings.enabled && this.settings.darkModeFixer) {
        document.body.classList.add("act-dark-mode-fix");
      } else {
        document.body.classList.remove("act-dark-mode-fix");
      }
    } catch (e) {}
  }

  enablePluginFeatures() {
    this.updateLightModeFixer();
    this.updateDarkModeFixer();
    this.applyFormattingPresetStyles();
    this.applyFormattingStyles();
    this.applyHighlightPresetTransparency();
    if (!this.cmExtensionRegistered) {
      this.extension = this.buildEditorExtension();
      this.registerEditorExtension(this.extension);
      this.cmExtensionRegistered = true;
    }

    if (!this.markdownPostProcessorRegistered) {
      this._unregisterMarkdownPostProcessor =
        this.registerMarkdownPostProcessor(buildReadingViewProcessor(this));
      this.markdownPostProcessorRegistered = true;
    }

    try {
      if (!this._canvasObserver) {
        this._canvasDebounceTimers = new WeakMap();
        const resolveEmbedSourcePath = (embedEl) => {
          try {
            const host =
              embedEl.closest("[data-path]") ||
              embedEl.querySelector("[data-path]");
            if (
              host &&
              host.dataset &&
              typeof host.dataset.path === "string" &&
              host.dataset.path.length > 0
            ) {
              return host.dataset.path;
            }
          } catch (_) {}
          try {
            const link = embedEl
              .closest(".markdown-embed")
              ?.querySelector(".internal-link, a[href]");
            if (link && link.getAttribute) {
              const href = link.getAttribute("href") || "";
              if (href && !href.startsWith("http")) return href;
            }
          } catch (_) {}
          try {
            return this.app?.workspace?.getActiveFile()?.path || null;
          } catch (_) {
            return null;
          }
        };
        const scheduleCanvasProcess = (embedEl) => {
          if (!embedEl) return;
          const prev = this._canvasDebounceTimers.get(embedEl);
          if (prev) {
            try {
              clearTimeout(prev);
            } catch (_) {}
          }
          const sp = resolveEmbedSourcePath(embedEl);
          if (!sp) return;
          const timer = setTimeout(() => {
            try {
              this.processActiveFileOnly(embedEl, { sourcePath: sp });
            } catch (e) {
              debugWarn("CANVAS", "Failed to process canvas embed", e);
            }
          }, 80);
          try {
            this._canvasDebounceTimers.set(embedEl, timer);
          } catch (_) {}
        };
        this.scheduleCanvasProcess = scheduleCanvasProcess;
        try {
          const existingEmbeds = document.querySelectorAll(
            ".canvas-node .markdown-embed-content",
          );
          existingEmbeds.forEach((el) => scheduleCanvasProcess(el));
        } catch (_) {}
        this._canvasObserver = new MutationObserver((mutations) => {
          try {
            for (const m of mutations) {
              if (m.type === "childList") {
                const added = Array.from(m.addedNodes || []).filter(
                  (n) => n.nodeType === Node.ELEMENT_NODE,
                );
                for (const node of added) {
                  try {
                    if (
                      node.classList &&
                      node.classList.contains("markdown-embed-content") &&
                      node.closest(".canvas-node")
                    ) {
                      scheduleCanvasProcess(node);
                    }
                    const embeds = node.querySelectorAll
                      ? node.querySelectorAll(
                          ".canvas-node .markdown-embed-content",
                        )
                      : [];
                    embeds.forEach((el) => scheduleCanvasProcess(el));
                  } catch (_) {}
                }
              } else if (
                m.type === "attributes" ||
                m.type === "characterData"
              ) {
                try {
                  const el =
                    m.target && m.target.closest
                      ? m.target.closest(".canvas-node .markdown-embed-content")
                      : null;
                  if (el) scheduleCanvasProcess(el);
                } catch (_) {}
              }
            }
          } catch (e) {
            debugWarn("CANVAS", "Mutation observer error", e);
          }
        });
        try {
          this._canvasObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
          });
        } catch (_) {}
      }
    } catch (e) {
      debugWarn("CANVAS", "Failed to initialize canvas observer", e);
    }

    if (!this.activeLeafChangeListenerRegistered) {
      this.activeLeafChangeListener = this.app.workspace.on(
        "active-leaf-change",
        (leaf) => {
          if (leaf && leaf.view instanceof MarkdownView) {
            try {
              if (leaf.view.getMode && leaf.view.getMode() === "preview") {
                this.forceRefreshAllReadingViews();

                // Fallback: try to process the rendered preview root directly
                setTimeout(() => {
                  try {
                    const active =
                      this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (
                      active &&
                      active.getMode &&
                      active.getMode() === "preview"
                    ) {
                      // Use previewMode.containerEl as fallback to contentEl/containerEl
                      const root =
                        (active.previewMode &&
                          active.previewMode.containerEl) ||
                        active.contentEl ||
                        active.containerEl;
                      if (root && active.file && active.file.path) {
                        try {
                          this.processActiveFileOnly(root, {
                            sourcePath: active.file.path,
                          });
                        } catch (e) {
                          // swallow - best-effort
                        }
                      }
                    }
                  } catch (e) {}
                }, 120);
              } else {
                // Editor mode (Live Preview): refresh editor and process callouts
                this.refreshEditor(leaf.view, true);
                // Process live preview callouts when file changes
                try {
                  const view =
                    leaf.view &&
                    (leaf.view.editor?.cm?.view ||
                      leaf.view.editor?.view ||
                      leaf.view.view ||
                      null);
                  if (view) {
                    // Clear cache to force re-processing on file change
                    this._lpCalloutCache = new WeakMap();
                    this._processLivePreviewCallouts(view);
                    this._processLivePreviewTables(view);
                  }
                } catch (e) {}
              }
            } catch (e) {}
          }
        },
      );
      this.registerEvent(this.activeLeafChangeListener);
      this.activeLeafChangeListenerRegistered = true;
    }

    // --- Enable search results coloring ---
    this.setupSearchObserver();

    // --- switching to reading view and refresh coloring fix ---
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (
          activeLeaf &&
          activeLeaf.getMode &&
          activeLeaf.getMode() === "preview"
        ) {
          clearTimeout(this._layoutChangeReadingTimer);
          this._layoutChangeReadingTimer = setTimeout(() => {
            this.forceRefreshAllReadingViews();
          }, 80);
        } else if (
          activeLeaf &&
          activeLeaf.getMode &&
          activeLeaf.getMode() === "source"
        ) {
          try {
            this.refreshAllLivePreviewCallouts();
          } catch (_) {}
        }
      }),
    );

    // --- Refresh coloring when file is moved/renamed (folder-specific styling changes) ---
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        try {
          // If the active file was moved, refresh it immediately
          const activeFile = this.app.workspace.getActiveFile();
          if (activeFile && activeFile.path === file.path) {
            // File was moved while it was active, force refresh
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
          }
        } catch (e) {
          debugError("RENAME", "File rename handler failed", e);
        }
      }),
    );

    this.refreshActiveEditor(true);
  }

  // --- Remove all CodeMirror extensions & listeners ---
  disablePluginFeatures() {
    this.removeHighlightPresetTransparency();
    this.removeFormattingPresetStyles();
    try {
      const s = document.getElementById("act-formatting-styles");
      if (s) s.remove();
    } catch (_) {}
    try {
      document.body.classList.remove("act-light-mode-fix");
    } catch (_) {}
    try {
      document.body.classList.remove("act-dark-mode-fix");
    } catch (_) {}
    if (this.cmExtensionRegistered && this.extension) {
      this.app.workspace.unregisterEditorExtension(this.extension);
      this.cmExtensionRegistered = false;
      this.extension = null;
    }

    if (
      this.markdownPostProcessorRegistered &&
      this._unregisterMarkdownPostProcessor
    ) {
      this._unregisterMarkdownPostProcessor();
      this.markdownPostProcessorRegistered = false;
      this._unregisterMarkdownPostProcessor = null;
    }

    try {
      if (this._canvasObserver) {
        try {
          this._canvasObserver.disconnect();
        } catch (_) {}
        this._canvasObserver = null;
      }
      try {
        if (this._canvasDebounceTimers) {
          const embeds = document.querySelectorAll(
            ".canvas-node .markdown-embed-content",
          );
          embeds.forEach((el) => {
            try {
              const t = this._canvasDebounceTimers.get(el);
              if (t) clearTimeout(t);
            } catch (_) {}
          });
          this._canvasDebounceTimers = new WeakMap();
        }
      } catch (_) {}
    } catch (_) {}

    if (
      this.activeLeafChangeListenerRegistered &&
      this.activeLeafChangeListener
    ) {
      this.app.workspace.off(
        "active-leaf-change",
        this.activeLeafChangeListener,
      );
      this.activeLeafChangeListenerRegistered = false;
      this.activeLeafChangeListener = null;
    }

    this.teardownSearchObserver();

    this.refreshActiveEditor(true);

    // Register command to show latest release notes (safe to call repeatedly)
    try {
      if (!this._changelogCommandRegistered) {
        this.addCommand({
          id: "show-latest-release-notes",
          name: this.t(
            "command_show_release_notes",
            "Show Latest Release Notes",
          ),
          callback: async () => {
            try {
              new ChangelogModal(this.app, this).open();
            } catch (e) {}
          },
        });
        this._changelogCommandRegistered = true;
      }
    } catch (e) {}
  }

  // --- Search Results Support ---
  setupSearchObserver() {
    try {
      if (this._searchObserversMap) return;
      this._searchObserversMap = new Map();

      const processSearchLeaf = (leaf) => {
        try {
          const container = leaf.view.containerEl;
          if (!container) return;

          const results = container.querySelectorAll(
            ".search-result-file-match",
          );

          if (results.length === 0) return;

          const sourcePath = "search-results";
          const folderEntry = this.getBestFolderEntry(sourcePath);
          const allEntries = this.getSortedWordEntries();
          const allowedEntries = this.filterEntriesByAdvancedRules(
            sourcePath,
            allEntries,
          );

          if (allowedEntries.length === 0) return;

          for (const result of results) {
            try {
              this._processSearchResultBlock(
                result,
                allowedEntries,
                folderEntry,
              );
            } catch (err) {}
          }
        } catch (e) {
          debugWarn("SEARCH", "Failed to process search leaf", e);
        }
      };

      const attachObserver = (leaf) => {
        if (this._searchObserversMap.has(leaf)) return;

        const container = leaf.view.containerEl;
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
          let shouldUpdate = false;
          for (const m of mutations) {
            let isOurChange = false;
            if (m.type === "childList") {
              for (const node of m.addedNodes) {
                if (
                  node.nodeType === 1 &&
                  node.classList.contains("always-color-text-highlight")
                ) {
                  isOurChange = true;
                  break;
                }
              }
            }
            if (!isOurChange) {
              shouldUpdate = true;
              break;
            }
          }

          if (shouldUpdate) {
            if (leaf._actSearchDebounce) clearTimeout(leaf._actSearchDebounce);
            leaf._actSearchDebounce = setTimeout(
              () => processSearchLeaf(leaf),
              60,
            );
          }
        });

        observer.observe(container, { childList: true, subtree: true });
        this._searchObserversMap.set(leaf, observer);

        // Initial processing
        processSearchLeaf(leaf);
      };

      this.app.workspace.getLeavesOfType("search").forEach(attachObserver);

      this.registerEvent(
        this.app.workspace.on("layout-change", () => {
          const leaves = this.app.workspace.getLeavesOfType("search");
          leaves.forEach(attachObserver);

          // Cleanup old observers
          for (const [leaf, obs] of this._searchObserversMap.entries()) {
            if (!leaves.includes(leaf)) {
              obs.disconnect();
              this._searchObserversMap.delete(leaf);
            }
          }
        }),
      );
    } catch (e) {
      debugError("SEARCH", "Failed to setup search observer", e);
    }
  }

  _processSearchResultBlock(block, entries, folderEntry) {
    try {
      const textNodes = [];
      const walker = document.createTreeWalker(
        block,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            if (node.parentElement?.closest(".always-color-text-highlight"))
              return NodeFilter.FILTER_REJECT;
            if (node.parentElement?.closest("code, pre"))
              return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        },
        false,
      );
      let n;
      while ((n = walker.nextNode())) {
        const isMatch = !!(
          n.parentElement &&
          n.parentElement.closest(".search-result-file-matched-text")
        );
        textNodes.push({ node: n, text: n.textContent || "", isMatch });
      }
      if (textNodes.length === 0) return;
      const combined = textNodes.map((s) => s.text).join("");
      if (!combined) return;
      const regexEntries = (entries || []).filter(
        (e) => e && !e.invalid && e.isRegex,
      );
      try {
        for (const entry of regexEntries) {
          if (!entry.regex && this._patternMatcher)
            this._patternMatcher.compilePattern(entry);
        }
      } catch (_) {}
      let matches = [];
      const textBgEntries = (entries || []).filter(
        (e) => e && e.isTextBg === true,
      );
      for (const entry of textBgEntries) {
        const re = entry.regex;
        if (!re) continue;
        const mlist = this.safeMatchLoop(re, combined);
        for (const m of mlist) {
          const s = m.index;
          const e = m.index + m[0].length;
          if (!this.matchSatisfiesType(combined, s, e, entry)) continue;
          matches.push({
            start: s,
            end: e,
            textColor: entry.textColor,
            backgroundColor: entry.backgroundColor,
            isTextBg: true,
            entryRef: entry,
          });
        }
      }
      const textOnlyCandidates = (entries || []).filter(
        (e) => e && !e.isTextBg,
      );
      const pm = this._patternMatcher
        ? this._patternMatcher.match(combined, textOnlyCandidates, folderEntry)
        : [];
      for (const m of pm) matches.push(m);
      if (matches.length === 0) return;
      matches.sort((a, b) => {
        const la = a.end - a.start;
        const lb = b.end - b.start;
        if (la !== lb) return lb - la;
        if (a.start !== b.start) return a.start - b.start;
        const aT = a.isTextBg
          ? !!(a.textColor && a.textColor !== "currentColor")
          : !!a.color;
        const bT = b.isTextBg
          ? !!(b.textColor && b.textColor !== "currentColor")
          : !!b.color;
        if (aT && !bT) return -1;
        if (!aT && bT) return 1;
        if (a.isTextBg && !b.isTextBg) return -1;
        if (!a.isTextBg && b.isTextBg) return 1;
        return 0;
      });
      const nonOverlap = [];
      for (const m of matches) {
        let ok = true;
        for (const s of nonOverlap) {
          if (m.start < s.end && m.end > s.start) {
            ok = false;
            break;
          }
        }
        if (ok) nonOverlap.push(m);
      }
      matches = nonOverlap.sort((a, b) => a.start - b.start);
      const segBounds = [];
      let acc = 0;
      for (const seg of textNodes) {
        const start = acc;
        const end = acc + seg.text.length;
        segBounds.push({ start, end, seg });
        acc = end;
      }
      const appendRange = (frag, rStart, rEnd) => {
        if (rEnd <= rStart) return;
        let pos = rStart;
        for (const b of segBounds) {
          if (b.end <= pos) continue;
          if (b.start >= rEnd) break;
          const s = Math.max(b.start, pos);
          const e = Math.min(b.end, rEnd);
          const slice = b.seg.text.slice(s - b.start, e - b.start);
          if (b.seg.isMatch) {
            const span = document.createElement("span");
            span.className = "search-result-file-matched-text";
            span.textContent = slice;
            frag.appendChild(span);
          } else {
            frag.appendChild(document.createTextNode(slice));
          }
          pos = e;
        }
      };
      const frag = document.createDocumentFragment();
      let pos = 0;
      for (const m of matches) {
        if (m.start > pos) appendRange(frag, pos, m.start);

        // Check for double-span prevention (User Request: No spans inside .cm-strong/.cm-em for bold/italic presets)
        const entry = m.entryRef || m.entry;
        const presetLabel = entry?.presetLabel || "";
        const isBoldItalicPreset = /bold|italic/i.test(presetLabel);
        let skipWrapper = false;

        if (isBoldItalicPreset) {
          for (const b of segBounds) {
            if (b.end <= m.start) continue;
            if (b.start >= m.end) break;
            // overlapping segment
            const parent = b.seg.node.parentElement;
            if (
              parent &&
              (parent.closest(
                ".cm-strong, .cm-em, .markdown-rendered strong, .markdown-rendered em",
              ) ||
                (parent.matches &&
                  parent.matches(
                    ".cm-strong, .cm-em, .markdown-rendered strong, .markdown-rendered em",
                  )))
            ) {
              skipWrapper = true;
              break;
            }
          }
        }

        if (skipWrapper) {
          appendRange(frag, m.start, m.end);
          pos = m.end;
          continue;
        }

        const span = document.createElement("span");
        span.className = "always-color-text-highlight";
        const styleType = m.isTextBg ? "both" : m.styleType || "text";
        const hideText = this.settings.hideTextColors === true;
        const hideBg = this.settings.hideHighlights === true;
        if (styleType === "text") {
          const color =
            m.color ||
            (m.textColor && m.textColor !== "currentColor"
              ? m.textColor
              : null);
          if (!hideText && color) {
            try {
              span.style.setProperty("color", color, "important");
            } catch (_) {
              span.style.color = color;
            }
            try {
              span.style.setProperty("--highlight-color", color);
            } catch (_) {}
          }
        } else if (styleType === "highlight") {
          if (!hideBg) {
            const bgColor =
              m.backgroundColor ||
              m.color ||
              (m.textColor && m.textColor !== "currentColor"
                ? m.textColor
                : null) ||
              (folderEntry && folderEntry.defaultColor
                ? folderEntry.defaultColor
                : null);
            span.style.background = "";
            const params = this.getHighlightParams(
              m.entryRef || m.entry || null,
            );
            try {
              span.style.setProperty(
                "background-color",
                this.hexToRgba(bgColor, params.opacity ?? 25),
                "important",
              );
            } catch (_) {
              span.style.backgroundColor = this.hexToRgba(
                bgColor,
                params.opacity ?? 25,
              );
            }
            const vpad = params.vPad;
            try {
              span.style.setProperty(
                "padding-left",
                params.hPad + "px",
                "important",
              );
              span.style.setProperty(
                "padding-right",
                params.hPad + "px",
                "important",
              );
              span.style.setProperty(
                "padding-top",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              span.style.setProperty(
                "padding-bottom",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
            } catch (_) {
              span.style.paddingLeft = span.style.paddingRight =
                params.hPad + "px";
              span.style.paddingTop = span.style.paddingBottom =
                (vpad >= 0 ? vpad : 0) + "px";
            }
            const br =
              (params.hPad > 0 && params.radius === 0 ? 0 : params.radius) +
              "px";
            try {
              span.style.setProperty("border-radius", br, "important");
            } catch (_) {
              span.style.borderRadius = br;
            }
            const borderCss = this.generateBorderStyle(
              null,
              bgColor,
              m.entryRef || m.entry || null,
            );
            if (borderCss) {
              span.style.cssText += borderCss;
            }
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
          }
        } else {
          const textColor =
            m.textColor && m.textColor !== "currentColor"
              ? m.textColor
              : m.color || null;
          const bgColor =
            m.backgroundColor ||
            m.color ||
            (folderEntry && folderEntry.defaultColor
              ? folderEntry.defaultColor
              : null);
          if (!hideText && textColor) {
            try {
              span.style.setProperty("color", textColor, "important");
            } catch (_) {
              span.style.color = textColor;
            }
            try {
              span.style.setProperty("--highlight-color", textColor);
            } catch (_) {}
          }
          if (!hideBg) {
            span.style.background = "";
            const params = this.getHighlightParams(
              m.entryRef || m.entry || null,
            );
            try {
              span.style.setProperty(
                "background-color",
                this.hexToRgba(bgColor, params.opacity ?? 25),
                "important",
              );
            } catch (_) {
              span.style.backgroundColor = this.hexToRgba(
                bgColor,
                params.opacity ?? 25,
              );
            }
            const vpad = params.vPad;
            try {
              span.style.setProperty(
                "padding-left",
                params.hPad + "px",
                "important",
              );
              span.style.setProperty(
                "padding-right",
                params.hPad + "px",
                "important",
              );
              span.style.setProperty(
                "padding-top",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
              span.style.setProperty(
                "padding-bottom",
                (vpad >= 0 ? vpad : 0) + "px",
                "important",
              );
            } catch (_) {
              span.style.paddingLeft = span.style.paddingRight =
                params.hPad + "px";
              span.style.paddingTop = span.style.paddingBottom =
                (vpad >= 0 ? vpad : 0) + "px";
            }
            const br2 =
              (params.hPad > 0 && params.radius === 0 ? 0 : params.radius) +
              "px";
            try {
              span.style.setProperty("border-radius", br2, "important");
            } catch (_) {
              span.style.borderRadius = br2;
            }
            const borderCss2 = this.generateBorderStyle(
              hideText ? null : textColor,
              hideBg ? null : bgColor,
              m.entryRef || m.entry || null,
            );
            if (borderCss2) {
              span.style.cssText += borderCss2;
            }
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
            this.applyBorderStyleToElement(
              span,
              hideText ? null : textColor,
              hideBg ? null : bgColor,
              m.entryRef || m.entry || null,
            );
          }
        }
        const innerFrag = document.createDocumentFragment();
        appendRange(innerFrag, m.start, m.end);
        span.appendChild(innerFrag);
        frag.appendChild(span);
        pos = m.end;
      }
      if (pos < combined.length) appendRange(frag, pos, combined.length);
      while (block.firstChild) block.removeChild(block.firstChild);
      block.appendChild(frag);
    } catch (e) {
      try {
        debugError("SEARCH", "process block error", e);
      } catch (_) {}
    }
  }
  teardownSearchObserver() {
    try {
      if (this._searchObserversMap) {
        for (const obs of this._searchObserversMap.values()) {
          obs.disconnect();
        }
        this._searchObserversMap.clear();
        this._searchObserversMap = null;
      }
    } catch (_) {}
  }

  // --- REFACTOR HELPERS ---

  generateUid() {
    try {
      return Date.now().toString(36) + Math.random().toString(36).slice(2);
    } catch (e) {
      return Date.now().toString();
    }
  }

  migrateEntry(entry) {
    if (!entry) return null;
    // 1. Ensure UID
    if (!entry.uid) entry.uid = this.generateUid();

    // 2. Consolidate Color Naming
    // If 'textColor' is missing but 'color' exists, use 'color'
    if (
      (entry.textColor === undefined || entry.textColor === null) &&
      entry.color
    ) {
      entry.textColor = entry.color;
    }
    // Remove legacy fields
    // delete entry.color; // Kept for compatibility with 'both' style background color fallback
    delete entry._savedtextcolor;
    delete entry._savedbackgroundcolor;
    delete entry._savedTextColor;
    delete entry._savedBackgroundColor;

    return entry;
  }

  compressEntry(entry) {
    if (!entry) return null;
    const e = Object.assign({}, entry); // Clone to avoid modifying memory state
    const s = this.settings;

    // Consolidate Color Naming (just in case)
    if ((e.textColor === undefined || e.textColor === null) && e.color) {
      e.textColor = e.color;
    }
    // delete e.color; // Kept for compatibility
    delete e._savedtextcolor;
    delete e._savedbackgroundcolor;
    delete e._savedTextColor;
    delete e._savedBackgroundColor;

    // 1. Remove Nulls, Empty Arrays, and Empty Strings
    if (e.inclusionRules && e.inclusionRules.length === 0)
      delete e.inclusionRules;
    if (e.exclusionRules && e.exclusionRules.length === 0)
      delete e.exclusionRules;
    if (
      e.groupedPatterns &&
      (e.groupedPatterns.length === 0 || e.groupedPatterns === null)
    )
      delete e.groupedPatterns;
    if (e.textColor === null) delete e.textColor;
    if (e.backgroundColor === null) delete e.backgroundColor;
    if (e.presetLabel === "") delete e.presetLabel;

    // Remove empty string colors (fix for quickStyles/quickColors)
    if (e.color === "") delete e.color;
    if (e.textColor === "") delete e.textColor;
    if (e.backgroundColor === "") delete e.backgroundColor;

    // 2. Remove Redundant Styling (if matches global default)
    // We check against the current effective global settings (which are flat in this.settings at runtime)
    if (e.backgroundOpacity === s.backgroundOpacity) delete e.backgroundOpacity;
    if (e.highlightBorderRadius === s.highlightBorderRadius)
      delete e.highlightBorderRadius;
    if (e.highlightHorizontalPadding === s.highlightHorizontalPadding)
      delete e.highlightHorizontalPadding;
    if (e.highlightVerticalPadding === s.highlightVerticalPadding)
      delete e.highlightVerticalPadding;
    if (e.enableBoxDecorationBreak === s.enableBoxDecorationBreak)
      delete e.enableBoxDecorationBreak;
    if (e.enableBorderThickness === s.enableBorderThickness)
      delete e.enableBorderThickness;
    if (e.borderOpacity === s.borderOpacity) delete e.borderOpacity;
    if (e.borderThickness === s.borderThickness) delete e.borderThickness;
    if (e.borderStyle === s.borderStyle) delete e.borderStyle;
    if (e.borderLineStyle === s.borderLineStyle) delete e.borderLineStyle;

    return e;
  }

  // Helper to merge entry styles with global defaults
  getEffectiveStyles(entry) {
    if (!entry) return {};
    const s = this.settings;
    // We only merge keys that are considered "Global Styles"
    const effective = {};
    GLOBAL_STYLE_KEYS.forEach((key) => {
      // If entry has defined value, use it; otherwise fallback to global setting
      effective[key] =
        entry[key] !== undefined && entry[key] !== null ? entry[key] : s[key];
    });
    // Merge other entry properties
    return Object.assign({}, entry, effective);
  }

  // --- Load plugin settings from disk, with defaults ---
  async loadSettings() {
    const loadedData = (await this.loadData()) || {};

    // --- REFACTOR MIGRATION: Flatten globalStyles back to root for runtime compatibility ---
    if (
      loadedData.globalStyles &&
      typeof loadedData.globalStyles === "object"
    ) {
      Object.assign(loadedData, loadedData.globalStyles);
      delete loadedData.globalStyles;
    } else {
      // Legacy/Fallback: If globalStyles is missing, we rely on the fact that
      // old data format stored these values at the root of the JSON object.
      // Since loadedData is merged into this.settings (which has defaults),
      // we don't need to do anything extra here.
      //
      // Note: If we wanted to "analyze entries" to find common values as a heuristic,
      // it would go here, but it is safer to respect the user's explicit (or default)
      // global settings rather than guessing from entry frequency.
    }

    // Validate that critical arrays exist before assignment
    if (!Array.isArray(loadedData.wordEntries)) loadedData.wordEntries = [];
    if (!Array.isArray(loadedData.wordEntryGroups))
      loadedData.wordEntryGroups = [];
    if (!Array.isArray(loadedData.blacklistEntries))
      loadedData.blacklistEntries = [];
    if (!Array.isArray(loadedData.blacklistEntryGroups))
      loadedData.blacklistEntryGroups = [];
    if (!Array.isArray(loadedData.pathRules)) loadedData.pathRules = [];

    // DEBUG: Log what was loaded from disk for entries with custom properties
    try {
      const weWithCustom = (loadedData.wordEntries || []).filter(
        (e) =>
          e &&
          (typeof e.backgroundOpacity === "number" ||
            typeof e.highlightBorderRadius === "number"),
      );
      if (weWithCustom.length > 0) {
        debugLog(
          "[LOAD_FROM_DISK_WE]",
          `Found ${weWithCustom.length} entries with custom: ${weWithCustom
            .slice(0, 3)
            .map(
              (e) =>
                `${e.pattern}(op=${e.backgroundOpacity}, rad=${e.highlightBorderRadius})`,
            )
            .join(", ")}`,
        );
      }
      const tbgWithCustom = (loadedData.textBgColoringEntries || []).filter(
        (e) =>
          e &&
          (typeof e.backgroundOpacity === "number" ||
            typeof e.highlightBorderRadius === "number"),
      );
      if (tbgWithCustom.length > 0) {
        debugLog(
          "[LOAD_FROM_DISK_TBG]",
          `Found ${tbgWithCustom.length} tbg entries with custom: ${tbgWithCustom
            .slice(0, 3)
            .map(
              (e) =>
                `${e.pattern}(op=${e.backgroundOpacity}, rad=${e.highlightBorderRadius})`,
            )
            .join(", ")}`,
        );
      }
    } catch (e) {}

    this.settings = Object.assign(
      defaultSettings,
      loadedData,
    );

    // Migrate legacy keys and structures
    try {
      if (typeof loadedData.quickColorsEnabled === "boolean") {
        this.settings.quickColorsEnabled = loadedData.quickColorsEnabled;
      } else if (
        typeof loadedData.enableQuickColors === "boolean" &&
        typeof loadedData.quickColorsEnabled !== "boolean"
      ) {
        this.settings.quickColorsEnabled = loadedData.enableQuickColors;
      }
      if (
        Array.isArray(this.settings.quickColors) &&
        this.settings.quickColors.length > 0 &&
        typeof this.settings.quickColors[0] === "string"
      ) {
        this.settings.quickColors = this.settings.quickColors.map((hex) => ({
          textColor: hex,
          backgroundColor: null,
          uid: Date.now().toString(36) + Math.random().toString(36).slice(2),
        }));
      }
    } catch (_) {}

    try {
      this.sanitizeSettings();
    } catch (e) {}

    // --- REFACTOR MIGRATION ---
    // Ensure all entries have UIDs and consolidate legacy fields
    try {
      if (Array.isArray(this.settings.wordEntries)) {
        this.settings.wordEntries.forEach((e) => this.migrateEntry(e));
      }
      if (Array.isArray(this.settings.wordEntryGroups)) {
        this.settings.wordEntryGroups.forEach((group) => {
          if (Array.isArray(group.entries)) {
            group.entries.forEach((e) => this.migrateEntry(e));
          }
        });
      }
    } catch (e) {
      debugError("MIGRATION", "Refactor migration failed", e);
    }

    // DEBUG: Check if custom properties survived sanitizeSettings
    try {
      const weAfterSanitize = (this.settings.wordEntries || []).filter(
        (e) =>
          e &&
          (typeof e.backgroundOpacity === "number" ||
            typeof e.highlightBorderRadius === "number"),
      );
      if (weAfterSanitize.length > 0) {
        debugLog(
          "[AFTER_SANITIZE_WE]",
          `Found ${weAfterSanitize.length} entries with custom: ${weAfterSanitize
            .slice(0, 3)
            .map(
              (e) =>
                `${e.pattern}(op=${e.backgroundOpacity}, rad=${e.highlightBorderRadius})`,
            )
            .join(", ")}`,
        );
      } else {
        debugLog(
          "[AFTER_SANITIZE_WE]",
          `NO entries with custom properties found after sanitize`,
        );
      }
      const tbgAfterSanitize = (
        this.settings.textBgColoringEntries || []
      ).filter(
        (e) =>
          e &&
          (typeof e.backgroundOpacity === "number" ||
            typeof e.highlightBorderRadius === "number"),
      );
      if (tbgAfterSanitize.length > 0) {
        debugLog(
          "[AFTER_SANITIZE_TBG]",
          `Found ${tbgAfterSanitize.length} entries with custom: ${tbgAfterSanitize
            .slice(0, 3)
            .map(
              (e) =>
                `${e.pattern}(op=${e.backgroundOpacity}, rad=${e.highlightBorderRadius})`,
            )
            .join(", ")}`,
        );
      } else {
        debugLog(
          "[AFTER_SANITIZE_TBG]",
          `NO TBG entries with custom properties found after sanitize`,
        );
      }
    } catch (e) {}

    // Migrate legacy customSwatches (array of hex strings) into userCustomSwatches
    try {
      if (
        Array.isArray(this.settings.customSwatches) &&
        this.settings.customSwatches.length > 0
      ) {
        const hasStringItems = this.settings.customSwatches.some(
          (s) => typeof s === "string",
        );
        if (hasStringItems) {
          const migrated = this.settings.customSwatches
            .filter((s) => typeof s === "string")
            .map((c, idx) => ({ name: `Swatch ${idx + 1}`, color: c }));
          // Move legacy custom swatches to userCustomSwatches (user-added colors)
          if (!Array.isArray(this.settings.userCustomSwatches)) {
            this.settings.userCustomSwatches = [];
          }
          // Avoid duplicating colors if already present in userCustomSwatches
          const existingColors = new Set(
            this.settings.userCustomSwatches.map((s) => s && s.color),
          );
          migrated.forEach((ms) => {
            if (ms && !existingColors.has(ms.color))
              this.settings.userCustomSwatches.push(ms);
          });
          // Clear the legacy customSwatches array
          this.settings.customSwatches = [];
        }
      } else {
        // Ensure customSwatches is empty or mirrors userCustomSwatches colors
        this.settings.customSwatches = Array.isArray(
          this.settings.userCustomSwatches,
        )
          ? this.settings.userCustomSwatches.map((s) => s.color)
          : [];
      }
    } catch (e) {}

    // Migrate user-added swatches from swatches array to userCustomSwatches
    // (before 1.0.0, it used to add extra swatches directly to the swatches array) boooooooooooooooooooooooo
    try {
      const defaultSwatches = [
        { name: "Red", color: "#eb3b5a" },
        { name: "Orange", color: "#fa8231" },
        { name: "Yellow", color: "#e5a216" },
        { name: "Green", color: "#20bf6b" },
        { name: "Cyan", color: "#0fb9b1" },
        { name: "Blue", color: "#2d98da" },
        { name: "Dark Blue", color: "#3867d6" },
        { name: "Indigo", color: "#5454d0" },
        { name: "Purple", color: "#8854d0" },
        { name: "Light Purple", color: "#b554d0" },
        { name: "Neon Pink", color: "#e832c1" },
        { name: "Hot Pink", color: "#e83289" },
        { name: "Brown", color: "#965b3b" },
        { name: "Gray", color: "#8392a4" },
      ];

      if (
        Array.isArray(this.settings.swatches) &&
        this.settings.swatches.length > defaultSwatches.length
      ) {
        // User has added extra swatches beyond the default 14
        const userAddedSwatches = this.settings.swatches.slice(
          defaultSwatches.length,
        );

        if (!Array.isArray(this.settings.userCustomSwatches)) {
          this.settings.userCustomSwatches = [];
        }

        // Avoid duplicating colors
        const existingColors = new Set(
          this.settings.userCustomSwatches.map((s) => s && s.color),
        );
        userAddedSwatches.forEach((swatch) => {
          if (swatch && swatch.color && !existingColors.has(swatch.color)) {
            this.settings.userCustomSwatches.push(swatch);
            existingColors.add(swatch.color);
          }
        });

        // Remove the user-added swatches from the swatches array, keeping only the default 14
        this.settings.swatches = defaultSwatches;
      }
    } catch (e) {}

    try {
      if (Array.isArray(this.settings.pathRules)) {
        this.settings.pathRules = this.settings.pathRules.map((r) => {
          if (!r) return r;
          const mt = r.matchType;
          if (mt === "wildcard") {
            const p = String(r.path || "").trim();
            if (p.includes("*")) {
              const raw = this.normalizePath(p);
              const esc = raw.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
              const re = "^" + esc.replace(/\*/g, ".*") + "$";
              return { ...r, matchType: "regex", path: re };
            } else {
              return { ...r, matchType: "has-name" };
            }
          }
          if (!mt) {
            return { ...r, matchType: "has-name" };
          }
          return r;
        });
      }
    } catch (e) {}

    // --- Migrate wordColors -> wordEntries (backwards compatible) --- yay
    if (
      !Array.isArray(this.settings.wordEntries) ||
      this.settings.wordEntries.length === 0
    ) {
      // If user already has wordEntries saved, keep them. Otherwise convert old map.
      const obj = this.settings.wordColors || {};
      const arr = [];
      for (const k of Object.keys(obj)) {
        const c = obj[k];
        arr.push({
          pattern: String(k),
          color: this.isValidHexColor(String(c)) ? String(c) : "",
          isRegex: false,
          flags: "",
          groupedPatterns: null,
          styleType: "text",
        });
      }
      this.settings.wordEntries = arr;
    } else {
      // Ensure shape for existing entries and derive styleType
      this.settings.wordEntries = this.settings.wordEntries
        .map((e) => {
          if (!e) return null;
          if (typeof e === "string")
            return {
              pattern: e,
              color: "",
              isRegex: false,
              flags: "",
              groupedPatterns: null,
              styleType: "text",
            };
          const color = e.color || e.hex || "";
          const textColor = e.textColor;
          const backgroundColor = e.backgroundColor;
          const hasValidColor = this.isValidHexColor(color);
          const hasValidText =
            textColor === "currentColor" || this.isValidHexColor(textColor);
          const hasValidBg = this.isValidHexColor(backgroundColor);
          let styleType = e.styleType;
          if (!styleType) {
            if (hasValidText && hasValidBg) styleType = "both";
            else if (hasValidBg) styleType = "highlight";
            else styleType = "text";
          }
          // If text+bg, clear plain color to avoid conflicting compile
          const finalColor =
            styleType === "both" || styleType === "highlight"
              ? ""
              : hasValidColor
                ? color
                : "";
          const finalText = hasValidText
            ? textColor
            : styleType === "highlight"
              ? "currentColor"
              : null;
          const finalBg = hasValidBg ? backgroundColor : null;
          const mapped = {
            pattern: e.pattern || e.word || "",
            color: finalColor,
            textColor: finalText,
            backgroundColor: finalBg,
            styleType,
            isRegex: !!e.isRegex,
            flags: e.flags || "",
            groupedPatterns: e.groupedPatterns || null,
            matchType:
              typeof e.matchType === "string" &&
              new Set(["exact", "contains", "startswith", "endswith"]).has(
                e.matchType.toLowerCase(),
              )
                ? e.matchType.toLowerCase()
                : this.settings.partialMatch
                  ? "contains"
                  : "exact",
            presetLabel: e.presetLabel || undefined,
            // PRESERVE targetElement (Critical for reading mode formatting)
            targetElement:
              e.targetElement ||
              (e.presetLabel && /bold\s*italic/i.test(e.presetLabel)
                ? "strong-em"
                : e.presetLabel && /bold/i.test(e.presetLabel)
                  ? "strong"
                  : e.presetLabel && /italic/i.test(e.presetLabel)
                    ? "em"
                    : e.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1"
                      ? "strong"
                      : e.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1"
                        ? "em"
                        : e.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1"
                          ? "strong-em"
                          : undefined),
            // PRESERVE custom styling properties from original entry
            backgroundOpacity: e.backgroundOpacity,
            highlightBorderRadius: e.highlightBorderRadius,
            highlightHorizontalPadding: e.highlightHorizontalPadding,
            highlightVerticalPadding: e.highlightVerticalPadding,
            enableBorderThickness: e.enableBorderThickness,
            borderStyle: e.borderStyle,
            borderLineStyle: e.borderLineStyle,
            borderOpacity: e.borderOpacity,
            borderThickness: e.borderThickness,
            uid: e.uid, // Also preserve UID
            customCss:
              typeof e.customCss === "string" && e.customCss.trim().length > 0
                ? e.customCss
                : undefined,
          };
          // Preserve per-entry inclusion/exclusion rules on load
          try {
            if (Array.isArray(e.inclusionRules)) {
              mapped.inclusionRules = e.inclusionRules
                .map((r) => ({
                  path: String((r && r.path) || ""),
                  isRegex: !!(r && r.isRegex),
                  flags: String((r && r.flags) || "").replace(/[^gimsuy]/g, ""),
                }))
                .filter((r) => r.path.length > 0);
            } else {
              mapped.inclusionRules = [];
            }
            if (Array.isArray(e.exclusionRules)) {
              mapped.exclusionRules = e.exclusionRules
                .map((r) => ({
                  path: String((r && r.path) || ""),
                  isRegex: !!(r && r.isRegex),
                  flags: String((r && r.flags) || "").replace(/[^gimsuy]/g, ""),
                }))
                .filter((r) => r.path.length > 0);
            } else {
              mapped.exclusionRules = [];
            }
          } catch (_) {
            mapped.inclusionRules = Array.isArray(mapped.inclusionRules)
              ? mapped.inclusionRules
              : [];
            mapped.exclusionRules = Array.isArray(mapped.exclusionRules)
              ? mapped.exclusionRules
              : [];
          }
          return mapped;
        })
        .filter((x) => x && String(x.pattern).trim() !== "");
    }

    // Migrate textBgColoringEntries into wordEntries (unify storage)
    try {
      const tbg = Array.isArray(this.settings.textBgColoringEntries)
        ? this.settings.textBgColoringEntries
        : [];
      if (tbg.length > 0) {
        debugLog(
          "[MIGRATE_TBG]",
          `Starting migration of ${tbg.length} TBG entries into wordEntries. wordEntries before: ${this.settings.wordEntries.length}`,
        );
        for (const e of tbg) {
          if (!e) continue;
          const patterns =
            Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
              ? e.groupedPatterns
              : [String(e.pattern || "").trim()];
          const textColor = e.textColor || "currentColor";
          const backgroundColor = e.backgroundColor;
          const isRegex = !!e.isRegex;
          const flags = e.flags || "";
          if (!patterns[0]) continue;
          let merged = false;
          for (let i = 0; i < this.settings.wordEntries.length; i++) {
            const we = this.settings.wordEntries[i];
            if (!we) continue;
            const wePatterns =
              Array.isArray(we.groupedPatterns) && we.groupedPatterns.length > 0
                ? we.groupedPatterns
                : [String(we.pattern || "").trim()];
            const match = wePatterns.some(
              (p) => String(p).trim() === String(patterns[0]).trim(),
            );
            if (match) {
              we.textColor = textColor;
              we.backgroundColor = backgroundColor;
              we.color = "";
              we.styleType =
                textColor && textColor !== "currentColor"
                  ? backgroundColor
                    ? "both"
                    : "text"
                  : backgroundColor
                    ? "highlight"
                    : we.styleType || "text";
              we.isRegex = isRegex;
              we.flags = flags;
              we.groupedPatterns =
                Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
                  ? e.groupedPatterns
                  : we.groupedPatterns || null;
              // Preserve custom styling properties from source textBgColoringEntries entry
              if (typeof e.backgroundOpacity === "number")
                we.backgroundOpacity = e.backgroundOpacity;
              if (typeof e.highlightBorderRadius === "number")
                we.highlightBorderRadius = e.highlightBorderRadius;
              if (typeof e.highlightHorizontalPadding === "number")
                we.highlightHorizontalPadding = e.highlightHorizontalPadding;
              if (typeof e.highlightVerticalPadding === "number")
                we.highlightVerticalPadding = e.highlightVerticalPadding;
              if (typeof e.enableBorderThickness === "boolean")
                we.enableBorderThickness = e.enableBorderThickness;
              if (typeof e.borderStyle === "string")
                we.borderStyle = e.borderStyle;
              if (typeof e.borderLineStyle === "string")
                we.borderLineStyle = e.borderLineStyle;
              if (typeof e.borderOpacity === "number")
                we.borderOpacity = e.borderOpacity;
              if (typeof e.borderThickness === "number")
                we.borderThickness = e.borderThickness;
              // Preserve per-entry inclusion/exclusion rules
              try {
                if (Array.isArray(e.inclusionRules)) {
                  we.inclusionRules = e.inclusionRules
                    .map((r) => ({
                      path: String((r && r.path) || ""),
                      isRegex: !!(r && r.isRegex),
                      flags: String((r && r.flags) || "").replace(
                        /[^gimsuy]/g,
                        "",
                      ),
                    }))
                    .filter((r) => r.path.length > 0);
                } else if (!Array.isArray(we.inclusionRules)) {
                  we.inclusionRules = [];
                }
                if (Array.isArray(e.exclusionRules)) {
                  we.exclusionRules = e.exclusionRules
                    .map((r) => ({
                      path: String((r && r.path) || ""),
                      isRegex: !!(r && r.isRegex),
                      flags: String((r && r.flags) || "").replace(
                        /[^gimsuy]/g,
                        "",
                      ),
                    }))
                    .filter((r) => r.path.length > 0);
                } else if (!Array.isArray(we.exclusionRules)) {
                  we.exclusionRules = [];
                }
              } catch (_) {
                if (!Array.isArray(we.inclusionRules)) we.inclusionRules = [];
                if (!Array.isArray(we.exclusionRules)) we.exclusionRules = [];
              }
              merged = true;
              break;
            }
          }
          if (!merged) {
            const styleType =
              textColor && textColor !== "currentColor"
                ? backgroundColor
                  ? "both"
                  : "text"
                : backgroundColor
                  ? "highlight"
                  : "text";
            const newEntry = {
              pattern: patterns[0],
              color: styleType === "text" ? textColor || "" : "",
              isRegex,
              flags,
              groupedPatterns:
                Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
                  ? e.groupedPatterns
                  : null,
              textColor: styleType !== "text" ? textColor : null,
              backgroundColor,
              styleType,
              matchType: this.settings.partialMatch ? "contains" : "exact",
              customCss:
                typeof e.customCss === "string" && e.customCss.trim().length > 0
                  ? e.customCss
                  : undefined,
            };
            // Preserve custom styling properties when creating new entry from textBgColoringEntries
            if (typeof e.backgroundOpacity === "number")
              newEntry.backgroundOpacity = e.backgroundOpacity;
            if (typeof e.highlightBorderRadius === "number")
              newEntry.highlightBorderRadius = e.highlightBorderRadius;
            if (typeof e.highlightHorizontalPadding === "number")
              newEntry.highlightHorizontalPadding =
                e.highlightHorizontalPadding;
            if (typeof e.highlightVerticalPadding === "number")
              newEntry.highlightVerticalPadding = e.highlightVerticalPadding;
            if (typeof e.enableBorderThickness === "boolean")
              newEntry.enableBorderThickness = e.enableBorderThickness;
            if (typeof e.borderStyle === "string")
              newEntry.borderStyle = e.borderStyle;
            if (typeof e.borderLineStyle === "string")
              newEntry.borderLineStyle = e.borderLineStyle;
            if (typeof e.borderOpacity === "number")
              newEntry.borderOpacity = e.borderOpacity;
            if (typeof e.borderThickness === "number")
              newEntry.borderThickness = e.borderThickness;
            // Preserve per-entry inclusion/exclusion rules when creating from textBgColoringEntries
            try {
              if (Array.isArray(e.inclusionRules)) {
                newEntry.inclusionRules = e.inclusionRules
                  .map((r) => ({
                    path: String((r && r.path) || ""),
                    isRegex: !!(r && r.isRegex),
                    flags: String((r && r.flags) || "").replace(
                      /[^gimsuy]/g,
                      "",
                    ),
                  }))
                  .filter((r) => r.path.length > 0);
              } else {
                newEntry.inclusionRules = [];
              }
              if (Array.isArray(e.exclusionRules)) {
                newEntry.exclusionRules = e.exclusionRules
                  .map((r) => ({
                    path: String((r && r.path) || ""),
                    isRegex: !!(r && r.isRegex),
                    flags: String((r && r.flags) || "").replace(
                      /[^gimsuy]/g,
                      "",
                    ),
                  }))
                  .filter((r) => r.path.length > 0);
              } else {
                newEntry.exclusionRules = [];
              }
            } catch (_) {
              newEntry.inclusionRules = Array.isArray(newEntry.inclusionRules)
                ? newEntry.inclusionRules
                : [];
              newEntry.exclusionRules = Array.isArray(newEntry.exclusionRules)
                ? newEntry.exclusionRules
                : [];
            }
            this.settings.wordEntries.push(newEntry);
          }
        }
        this.settings.textBgColoringEntries = [];
        debugLog(
          "[MIGRATE_TBG]",
          `Migration complete. wordEntries after: ${this.settings.wordEntries.length}`,
        );
      }
    } catch (e) {}

    // DEBUG: Check if properties still in wordEntries before compile
    try {
      const weBeforeCompile = (this.settings.wordEntries || []).filter(
        (e) =>
          e &&
          (typeof e.backgroundOpacity === "number" ||
            typeof e.highlightBorderRadius === "number"),
      );
      if (weBeforeCompile.length > 0) {
        debugLog(
          "[BEFORE_COMPILE_WE]",
          `Found ${weBeforeCompile.length} entries with custom: ${weBeforeCompile
            .slice(0, 3)
            .map(
              (e) =>
                `${e.pattern}(op=${e.backgroundOpacity}, rad=${e.highlightBorderRadius})`,
            )
            .join(", ")}`,
        );
      }
    } catch (e) {}

    // Auto-enable regex support if any regex entries are present
    if (
      Array.isArray(this.settings.wordEntries) &&
      this.settings.wordEntries.some((e) => e && e.isRegex)
    ) {
      this.settings.enableRegexSupport = true;
    }
    if (
      Array.isArray(this.settings.blacklistEntries) &&
      this.settings.blacklistEntries.some((e) => e && e.isRegex)
    ) {
      this.settings.enableRegexSupport = true;
    }

    // compile word entries into fast runtime structures
    this.compileWordEntries();
    this.compileTextBgColoringEntries();
    this.compileBlacklistEntries();
    // Mark pattern caches dirty so they recompile on next use
    this._wordPatternsCompilationDirty = true;
    this._textBgPatternsCompilationDirty = true;
    this._blacklistCompilationDirty = true;
    this.compileBlacklistEntries(); // OPTIMIZATION: Pre-compile blacklist regexes

    // Start memory monitoring to proactively cleanup if heap usage gets high
    try {
      this.startMemoryMonitor();
    } catch (e) {}
  }

  async fetchLatestRelease() {
    const url =
      "https://api.github.com/repos/Kazi-Aidah/always-color-text/releases/latest";
    try {
      if (typeof requestUrl === "function") {
        const res = await requestUrl({
          url,
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Obsidian-Always-Color-Text",
          },
        });
        const data = res.json || (res.text ? JSON.parse(res.text) : null);
        return data;
      }
    } catch (e) {
      // fallback
    }
    try {
      const r = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Obsidian-Always-Color-Text",
        },
      });
      if (!r.ok) throw new Error("Network error");
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  async fetchAllReleases() {
    const allReleases = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const url = `https://api.github.com/repos/Kazi-Aidah/always-color-text/releases?page=${page}&per_page=100`;
      try {
        let data = null;
        if (typeof requestUrl === "function") {
          try {
            const res = await requestUrl({
              url,
              headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Obsidian-Always-Color-Text",
              },
            });
            data = res.json || (res.text ? JSON.parse(res.text) : null);
          } catch (e) {}
        }

        if (!data) {
          try {
            const r = await fetch(url, {
              headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Obsidian-Always-Color-Text",
              },
            });
            if (!r.ok) throw new Error("Network error");
            data = await r.json();
          } catch (e) {
            hasMorePages = false;
            break;
          }
        }

        if (!Array.isArray(data) || data.length === 0) {
          hasMorePages = false;
        } else {
          allReleases.push(...data);
          // GitHub returns up to 100 per page; if we got fewer, we're on the last page
          if (data.length < 100) {
            hasMorePages = false;
          } else {
            page++;
          }
        }
      } catch (e) {
        hasMorePages = false;
      }
    }

    return allReleases;
  }

  // --- Save settings and refresh plugin state ---
  applyFormattingStyles() {
    try {
      const styleId = "act-formatting-styles";
      let styleEl = document.getElementById(styleId);

      const we = this.settings.wordEntries || [];
      const weAll = (this.settings.wordEntryGroups || [])
        .reduce((acc, g) => acc.concat(g.entries || []), [])
        .concat(we);

      const hasBoldItalic =
        we.some((e) => e.targetElement === "strong-em") ||
        weAll.some((e) => e.targetElement === "strong-em");

      const targets = [
        {
          type: "strong",
          selector: hasBoldItalic
            ? ".cm-strong:not(.cm-em), .markdown-rendered strong:not(:has(em)), .cm-s-obsidian span.cm-strong:not(.cm-em)"
            : ".cm-strong, .markdown-rendered strong, .cm-s-obsidian span.cm-strong",
        },
        {
          type: "em",
          selector: hasBoldItalic
            ? ".cm-em:not(.cm-strong), .markdown-rendered em:not(:has(strong)), .cm-s-obsidian span.cm-em:not(.cm-strong)"
            : ".cm-em, .markdown-rendered em, .cm-s-obsidian span.cm-em",
        },
        {
          type: "strong-em",
          selector:
            ".cm-strong.cm-em, .cm-strong .cm-em, .cm-em .cm-strong, .markdown-rendered strong em, .markdown-rendered em strong, .cm-s-obsidian span.cm-strong.cm-em",
        },
      ];

      let css = "";

      targets.forEach((t) => {
        // Find the LAST matching entry to ensure we get the user's latest configuration
        const reversedWe = [...we].reverse();
        const reversedWeAll = [...weAll].reverse();
        const entry =
          reversedWe.find((e) => e && e.targetElement === t.type) ||
          reversedWeAll.find((e) => e && e.targetElement === t.type);

        if (entry) {
          const textColor =
            entry.textColor && entry.textColor !== "currentColor"
              ? entry.textColor
              : entry.color || null;
          const bgColor = entry.backgroundColor || null;

          css += `${t.selector} {`;

          if (textColor || bgColor) {
            if (textColor) css += ` color: ${textColor} !important;`;
            if (bgColor) {
              const opacityRaw =
                typeof entry.backgroundOpacity === "number"
                  ? entry.backgroundOpacity
                  : (this.settings.backgroundOpacity ?? 25);
              // hexToRgba expects 0-100. If we have a small float (<=1), it might be a legacy 0-1 value, so multiply by 100.
              // Otherwise assume it's 0-100.
              const opacity =
                opacityRaw <= 1 && opacityRaw > 0
                  ? opacityRaw * 100
                  : opacityRaw;
              const bgRgba = this.hexToRgba(bgColor, opacity);
              css += ` background-color: ${bgRgba} !important;`;
            }
          }

          // Add highlight styling properties
          // Force apply these if we found a matching entry, regardless of color presence
          // (User might want to style existing bold/italic without changing color)
          // But to be safe, check if we have any relevant setting or global default
          {
            const hPad =
              typeof entry.highlightHorizontalPadding === "number"
                ? entry.highlightHorizontalPadding
                : (this.settings.highlightHorizontalPadding ?? 4);
            const vPad =
              typeof entry.highlightVerticalPadding === "number"
                ? entry.highlightVerticalPadding
                : (this.settings.highlightVerticalPadding ?? 0);
            const radius =
              typeof entry.highlightBorderRadius === "number"
                ? entry.highlightBorderRadius
                : (this.settings.highlightBorderRadius ?? 8);
            const borderCSS = this.generateBorderStyle(
              textColor,
              bgColor,
              entry,
            );

            // Ensure element behaves like a box for padding/radius
            // For some themes, bold/italic might be inline, so padding works horizontally but radius might need display adjustment
            // However, changing display to inline-block might break flow in some cases.
            // Usually box-decoration-break handles line wrapping nicely.

            css += ` padding-left: ${hPad}px !important; padding-right: ${hPad}px !important;`;
            css += ` padding-top: ${vPad}px !important; padding-bottom: ${vPad}px !important;`;
            css += ` border-radius: ${radius}px !important;`;

            if (borderCSS) css += borderCSS;

            if (this.settings.enableBoxDecorationBreak !== false) {
              css += ` box-decoration-break: clone; -webkit-box-decoration-break: clone;`;
            }
          }
          {
            const extra = this.settings.enableCustomCss
              ? this.sanitizeCssDeclarations(entry.customCss || "")
              : "";
            if (extra) css += ` ${extra}`;
          }
          css += ` } \n`;
        }
      });

      if (css) {
        if (!styleEl) {
          styleEl = document.createElement("style");
          styleEl.id = styleId;
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;
      } else {
        if (styleEl) styleEl.remove();
      }
    } catch (e) {
      console.error("ACT: Error applying formatting styles", e);
    }
  }

  async saveSettings() {
    try {
      this.sanitizeSettings();
    } catch (e) {}

    // Create compressed copy for storage
    const data = Object.assign({}, this.settings);

    // Extract Global Styles to dedicated object
    const globalStyles = {};
    GLOBAL_STYLE_KEYS.forEach((key) => {
      if (data[key] !== undefined) {
        globalStyles[key] = data[key];
        delete data[key];
      }
    });
    data.globalStyles = globalStyles;

    // Compress wordEntries
    if (Array.isArray(data.wordEntries)) {
      data.wordEntries = data.wordEntries.map((e) => this.compressEntry(e));
    }

    // Compress wordEntryGroups
    if (Array.isArray(data.wordEntryGroups)) {
      data.wordEntryGroups = data.wordEntryGroups.map((g) => {
        const ng = Object.assign({}, g);
        if (Array.isArray(ng.entries)) {
          ng.entries = ng.entries.map((e) => this.compressEntry(e));
        }
        return ng;
      });
    }

    // Compress quickStyles and quickColors (remove empty strings)
    if (Array.isArray(data.quickStyles)) {
      data.quickStyles = data.quickStyles.map((e) => this.compressEntry(e));
    }
    if (Array.isArray(data.quickColors)) {
      data.quickColors = data.quickColors.map((e) => this.compressEntry(e));
    }

    await this.saveData(data);

    // Recompile entries after saving
    this.compileWordEntries();
    this.compileTextBgColoringEntries();
    this.compileBlacklistEntries(); // OPTIMIZATION: Pre-compile blacklist regexes
    try {
      this._pathRulesCache = new Map();
    } catch (e) {
      this._pathRulesCache = new Map();
    }

    this.disablePluginFeatures();
    if (this.settings.enabled) {
      this.enablePluginFeatures();
    }
    this.updateStatusBar();
    try {
      this.forceRefreshAllEditors();
    } catch (e) {}
    try {
      this.forceRefreshAllReadingViews();
    } catch (e) {}
  }

  async exportSettingsToVault() {
    const payload = this.buildExportPayload();
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    let vaultName = "vault";
    try {
      const n = this.app?.vault?.getName?.();
      vaultName = String(n || "vault").trim();
    } catch (e) {}
    const safeVault = vaultName.replace(/[^a-z0-9-_]+/gi, "_");
    const fname = `always-color-text-export-${safeVault}-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.json`;
    const path = `.obsidian/plugins/always-color-text/${fname}`;
    await this.app.vault.adapter.write(path, JSON.stringify(payload, null, 2));
    return path;
  }

  async importSettingsFromJson(text) {
    let obj = null;
    try {
      obj = JSON.parse(String(text || ""));
    } catch (e) {
      throw new Error("invalid json");
    }
    const incoming = obj && obj.settings ? obj.settings : obj;
    if (!incoming || typeof incoming !== "object")
      throw new Error("invalid payload");
    const merged = Object.assign({}, this.settings, incoming);
    this.settings = merged;
    try {
      this.sanitizeSettings();
    } catch (e) {}
    await this.saveSettings();
    this.reconfigureEditorExtensions();
    this.forceRefreshAllEditors();
    this.forceRefreshAllReadingViews();
  }

  buildExportPayload() {
    return {
      plugin: "always-color-text",
      version: (this.manifest && this.manifest.version) || "",
      settings: this.settings,
      // Note: Each entry in settings.wordEntries includes per-entry highlight style settings:
      // - styleType: 'text' | 'highlight' | 'both'
      // - backgroundOpacity, highlightBorderRadius, highlightHorizontalPadding, etc. (individual entry customizations)
    };
  }

  async exportSettingsToPickedLocation() {
    const payload = this.buildExportPayload();
    const json = JSON.stringify(payload, null, 2);
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    let vaultName = "vault";
    try {
      const n = this.app?.vault?.getName?.();
      vaultName = String(n || "vault").trim();
    } catch (e) {}
    const safeVault = vaultName.replace(/[^a-z0-9-_]+/gi, "_");
    const fname = `always-color-text-export-${safeVault}-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.json`;
    // Prefer vault write on mobile platforms where download APIs are unsupported
    try {
      const { Platform } = require("obsidian");
      const isMobile = !!(
        Platform &&
        (Platform.isMobileApp || Platform.isMobile)
      );
      if (isMobile) {
        try {
          if (typeof navigator !== "undefined") {
            const file = new File([json], fname, { type: "application/json" });
            const canShare = !!(
              navigator.canShare && navigator.canShare({ files: [file] })
            );
            if (canShare && navigator.share) {
              await navigator.share({
                files: [file],
                title: fname,
                text: this.plugin.t(
                  "share_export_title",
                  "Always Color Text export",
                ),
              });
              return fname;
            }
          }
        } catch (e) {}
        return await this.exportSettingsToVault();
      }
      if (typeof window === "undefined") {
        return await this.exportSettingsToVault();
      }
    } catch (e) {}

    if (typeof window !== "undefined" && window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fname,
          types: [
            { description: "JSON", accept: { "application/json": [".json"] } },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        return fname;
      } catch (e) {
        // Fallback to vault write if picker fails (e.g., mobile browsers)
        return await this.exportSettingsToVault();
      }
    } else {
      try {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          try {
            document.body.removeChild(a);
          } catch (e) {}
          try {
            URL.revokeObjectURL(url);
          } catch (e) {}
        }, 0);
        return fname;
      } catch (e) {
        // Final fallback: vault write
        return await this.exportSettingsToVault();
      }
    }
  }

  sanitizeSettings() {
    try {
      const s = this.settings || {};
      if (!Array.isArray(s.wordEntries)) s.wordEntries = [];
      if (!Array.isArray(s.blacklistEntries)) s.blacklistEntries = [];
      if (!Array.isArray(s.pathRules)) s.pathRules = [];
      s.wordEntries = s.wordEntries.map((e) => {
        const x = Object.assign({}, e || {});
        x.pattern = String(x.pattern || "");
        if (Array.isArray(x.groupedPatterns)) {
          x.groupedPatterns = x.groupedPatterns
            .map((p) => String(p || ""))
            .filter((p) => (p || "").length > 0);
          if (x.groupedPatterns.length === 0) x.groupedPatterns = null;
        } else {
          x.groupedPatterns = null;
        }
        x.color = this.isValidHexColor(x.color) ? x.color : "";
        x.textColor =
          x.textColor &&
          x.textColor !== "currentColor" &&
          this.isValidHexColor(x.textColor)
            ? x.textColor
            : x.textColor === "currentColor"
              ? "currentColor"
              : null;
        x.backgroundColor = this.isValidHexColor(x.backgroundColor)
          ? x.backgroundColor
          : null;
        x.flags = String(x.flags || "").replace(/[^gimsuy]/g, "");
        x.isRegex = !!x.isRegex;
        x.styleType =
          x.styleType ||
          (x.backgroundColor
            ? x.textColor && x.textColor !== "currentColor"
              ? "both"
              : "highlight"
            : x.color
              ? "text"
              : "text");
        const rawMt = String(x.matchType || "").trim();
        const mtLower = rawMt.toLowerCase();
        const normalized =
          mtLower === "startswith" ||
          rawMt === "startsWith" ||
          mtLower === "starts with"
            ? "startswith"
            : mtLower === "endswith" ||
                rawMt === "endsWith" ||
                mtLower === "ends with"
              ? "endswith"
              : mtLower === "exact"
                ? "exact"
                : mtLower === "contains"
                  ? "contains"
                  : this.settings.partialMatch
                    ? "contains"
                    : "exact";
        x.matchType = normalized;
        x._savedTextColor =
          x._savedTextColor && this.isValidHexColor(x._savedTextColor)
            ? x._savedTextColor
            : this.isValidHexColor(x.color)
              ? x.color
              : null;
        x._savedBackgroundColor =
          x._savedBackgroundColor &&
          this.isValidHexColor(x._savedBackgroundColor)
            ? x._savedBackgroundColor
            : this.isValidHexColor(x.backgroundColor)
              ? x.backgroundColor
              : null;
        // Preserve per-entry path rules
        if (Array.isArray(e.inclusionRules)) {
          x.inclusionRules = e.inclusionRules
            .map((r) => ({
              path: String((r && r.path) || ""),
              isRegex: !!(r && r.isRegex),
              flags: String((r && r.flags) || "").replace(/[^gimsuy]/g, ""),
            }))
            .filter((r) => r.path.length > 0);
        } else {
          x.inclusionRules = [];
        }
        if (!Array.isArray(x.enableFolders)) x.enableFolders = [];
        if (!Array.isArray(x.disableFolders)) x.disableFolders = [];
        if (!Array.isArray(x.enableTags)) x.enableTags = [];
        if (!Array.isArray(x.disableTags)) x.disableTags = [];
        if (Array.isArray(e.exclusionRules)) {
          x.exclusionRules = e.exclusionRules
            .map((r) => ({
              path: String((r && r.path) || ""),
              isRegex: !!(r && r.isRegex),
              flags: String((r && r.flags) || "").replace(/[^gimsuy]/g, ""),
            }))
            .filter((r) => r.path.length > 0);
        } else {
          x.exclusionRules = [];
        }

        // PRESERVE custom styling properties (per-entry highlight customization)
        x.backgroundOpacity =
          typeof e.backgroundOpacity === "number"
            ? e.backgroundOpacity
            : undefined;
        x.highlightBorderRadius =
          typeof e.highlightBorderRadius === "number"
            ? e.highlightBorderRadius
            : undefined;
        x.highlightHorizontalPadding =
          typeof e.highlightHorizontalPadding === "number"
            ? e.highlightHorizontalPadding
            : undefined;
        x.highlightVerticalPadding =
          typeof e.highlightVerticalPadding === "number"
            ? e.highlightVerticalPadding
            : undefined;
        x.enableBorderThickness =
          typeof e.enableBorderThickness === "boolean"
            ? e.enableBorderThickness
            : undefined;
        x.borderStyle =
          typeof e.borderStyle === "string" ? e.borderStyle : undefined;
        x.borderLineStyle =
          typeof e.borderLineStyle === "string" ? e.borderLineStyle : undefined;
        x.borderOpacity =
          typeof e.borderOpacity === "number" ? e.borderOpacity : undefined;
        x.borderThickness =
          typeof e.borderThickness === "number" ? e.borderThickness : undefined;
        x.affectMarkElements =
          typeof e.affectMarkElements === "boolean"
            ? e.affectMarkElements
            : undefined;
        // Preserve custom CSS text for per-entry styling
        x.customCss =
          typeof e.customCss === "string" && e.customCss.trim().length > 0
            ? e.customCss
            : undefined;

        return x;
      });

      // Sanitize wordEntryGroups
      if (!Array.isArray(s.wordEntryGroups)) s.wordEntryGroups = [];
      s.wordEntryGroups = s.wordEntryGroups.map((g) => {
        const group = Object.assign({}, g || {});
        if (!Array.isArray(group.entries)) group.entries = [];
        if (!Array.isArray(group.enableFolders)) group.enableFolders = [];
        if (!Array.isArray(group.disableFolders)) group.disableFolders = [];
        if (!Array.isArray(group.enableTags)) group.enableTags = [];
        if (!Array.isArray(group.disableTags)) group.disableTags = [];
        group.entries = group.entries.map((e) => Object.assign({}, e || {}));
        return group;
      });

      s.blacklistEntries = s.blacklistEntries.map((e) => {
        const x = Object.assign({}, e || {});
        x.pattern = String(x.pattern || "");
        if (Array.isArray(x.groupedPatterns)) {
          x.groupedPatterns = x.groupedPatterns
            .map((p) => String(p || ""))
            .filter((p) => (p || "").length > 0);
          if (x.groupedPatterns.length === 0) x.groupedPatterns = null;
        } else {
          x.groupedPatterns = null;
        }
        x.flags = String(x.flags || "").replace(/[^gimsuy]/g, "");
        x.isRegex = !!x.isRegex;
        return x;
      });
      // Also sanitize and preserve custom properties for textBgColoringEntries
      if (Array.isArray(s.textBgColoringEntries)) {
        s.textBgColoringEntries = s.textBgColoringEntries.map((e) => {
          const x = Object.assign({}, e || {});
          x.pattern = String(x.pattern || "");
          if (Array.isArray(x.groupedPatterns)) {
            x.groupedPatterns = x.groupedPatterns
              .map((p) => String(p || ""))
              .filter((p) => (p || "").length > 0);
            if (x.groupedPatterns.length === 0) x.groupedPatterns = null;
          } else {
            x.groupedPatterns = null;
          }
          x.textColor =
            x.textColor &&
            x.textColor !== "currentColor" &&
            this.isValidHexColor(x.textColor)
              ? x.textColor
              : x.textColor === "currentColor"
                ? "currentColor"
                : null;
          x.backgroundColor = this.isValidHexColor(x.backgroundColor)
            ? x.backgroundColor
            : null;
          x.flags = String(x.flags || "").replace(/[^gimsuy]/g, "");
          x.isRegex = !!x.isRegex;
          x.styleType =
            x.styleType ||
            (x.backgroundColor
              ? x.textColor && x.textColor !== "currentColor"
                ? "both"
                : "highlight"
              : "text");
          // Preserve per-entry path rules for text+bg entries too
          if (Array.isArray(e.inclusionRules)) {
            x.inclusionRules = e.inclusionRules
              .map((r) => ({
                path: String((r && r.path) || ""),
                isRegex: !!(r && r.isRegex),
                flags: String((r && r.flags) || "").replace(/[^gimsuy]/g, ""),
              }))
              .filter((r) => r.path.length > 0);
          } else {
            x.inclusionRules = [];
          }
          if (Array.isArray(e.exclusionRules)) {
            x.exclusionRules = e.exclusionRules
              .map((r) => ({
                path: String((r && r.path) || ""),
                isRegex: !!(r && r.isRegex),
                flags: String((r && r.flags) || "").replace(/[^gimsuy]/g, ""),
              }))
              .filter((r) => r.path.length > 0);
          } else {
            x.exclusionRules = [];
          }
          // PRESERVE custom styling properties for textBgColoringEntries too
          x.backgroundOpacity =
            typeof e.backgroundOpacity === "number"
              ? e.backgroundOpacity
              : undefined;
          x.highlightBorderRadius =
            typeof e.highlightBorderRadius === "number"
              ? e.highlightBorderRadius
              : undefined;
          x.highlightHorizontalPadding =
            typeof e.highlightHorizontalPadding === "number"
              ? e.highlightHorizontalPadding
              : undefined;
          x.highlightVerticalPadding =
            typeof e.highlightVerticalPadding === "number"
              ? e.highlightVerticalPadding
              : undefined;
          x.enableBorderThickness =
            typeof e.enableBorderThickness === "boolean"
              ? e.enableBorderThickness
              : undefined;
          x.borderStyle =
            typeof e.borderStyle === "string" ? e.borderStyle : undefined;
          x.borderLineStyle =
            typeof e.borderLineStyle === "string"
              ? e.borderLineStyle
              : undefined;
          x.borderOpacity =
            typeof e.borderOpacity === "number" ? e.borderOpacity : undefined;
          x.borderThickness =
            typeof e.borderThickness === "number"
              ? e.borderThickness
              : undefined;
          // Preserve custom CSS for text+bg entries as well (future-proof)
          x.customCss =
            typeof e.customCss === "string" && e.customCss.trim().length > 0
              ? e.customCss
              : undefined;
          return x;
        });
      }
      s.pathRules = s.pathRules.map((r) => {
        const x = Object.assign({}, r || {});
        x.path = String(x.path || "");
        x.mode = x.mode === "exclude" ? "exclude" : "include";
        x.matchType =
          x.matchType === "regex"
            ? "regex"
            : x.matchType === "exact"
              ? "exact"
              : x.matchType === "has-name"
                ? "has-name"
                : "has-name";
        x.isFolder = !!x.isFolder;
        return x;
      });
      s.enableQuickColorOnce = !!s.enableQuickColorOnce;
      s.enableQuickHighlightOnce = !!s.enableQuickHighlightOnce;
      s.quickHighlightStyleEnable = !!s.quickHighlightStyleEnable;
      s.quickHighlightUseGlobalStyle = !!s.quickHighlightUseGlobalStyle;
      s.quickHighlightOpacity = Math.max(
        0,
        Math.min(100, Number(s.quickHighlightOpacity ?? 25)),
      );
      s.quickHighlightBorderRadius = Math.max(
        0,
        parseInt(s.quickHighlightBorderRadius ?? 8) || 0,
      );
      s.quickHighlightHorizontalPadding = Math.max(
        0,
        parseInt(s.quickHighlightHorizontalPadding ?? 4) || 0,
      );
      s.quickHighlightVerticalPadding = Math.max(
        0,
        parseInt(s.quickHighlightVerticalPadding ?? 0) || 0,
      );
      s.quickHighlightEnableBorder = !!s.quickHighlightEnableBorder;
      s.quickHighlightBorderStyle = String(
        s.quickHighlightBorderStyle || "full",
      );
      s.quickHighlightBorderOpacity = Math.max(
        0,
        Math.min(100, Number(s.quickHighlightBorderOpacity ?? 100)),
      );
      s.quickHighlightBorderThickness = Math.max(
        0,
        Math.min(5, Number(s.quickHighlightBorderThickness ?? 1)),
      );
      s.hideHighlights = !!s.hideHighlights;
      s.hideTextColors = !!s.hideTextColors;
      if (s.hideHighlights && s.hideTextColors) {
        s.hideHighlights = false;
        s.hideTextColors = false;
      }
      const allowedSort = new Set([
        "last-added",
        "a-z",
        "reverse-a-z",
        "style-order",
        "color",
      ]);
      if (!allowedSort.has(s.wordsSortMode)) s.wordsSortMode = "last-added";
      const allowedBl = new Set(["last-added", "a-z", "reverse-a-z"]);
      if (!allowedBl.has(s.blacklistSortMode))
        s.blacklistSortMode = "last-added";
      const allowedPath = new Set([
        "last-added",
        "a-z",
        "reverse-a-z",
        "mode",
        "type",
      ]);
      if (!allowedPath.has(s.pathSortMode)) s.pathSortMode = "last-added";
      s.language = String(s.language || "en");
      s.highlightVerticalPadding = Math.max(
        0,
        parseInt(s.highlightVerticalPadding ?? 0) || 0,
      );
      s.entriesSearchLimit = Math.max(
        0,
        parseInt(s.entriesSearchLimit ?? 0) || 0,
      );
      s.blacklistSearchLimit = Math.max(
        0,
        parseInt(s.blacklistSearchLimit ?? 0) || 0,
      );
      s.pathSearchLimit = Math.max(0, parseInt(s.pathSearchLimit ?? 0) || 0);

      // Sync forceFullRenderInReading with disableReadingModeColoring
      // If Reading Mode coloring is ENABLED, forceFullRenderInReading MUST be true
      if (!s.disableReadingModeColoring) {
        s.forceFullRenderInReading = true;
      } else {
        // If Reading Mode coloring is DISABLED, forceFullRenderInReading MUST be false
        s.forceFullRenderInReading = false;
      }

      this.settings = s;
    } catch (e) {}
  }

  // --- Save a persistent color for a word ---
  async saveEntry(word, color) {
    // Save or update a literal (non-regex) entry in the new wordEntries model
    const pattern = String(word);
    const col = String(color);
    debugLog("SAVE", "saveEntry", { pattern, color: col });
    const idx = this.settings.wordEntries.findIndex(
      (e) => e && e.pattern === pattern && !e.isRegex,
    );
    if (idx !== -1) {
      this.settings.wordEntries[idx].color = col;
      this.settings.wordEntries[idx].styleType = "text"; // EXPLICITLY SET TO TEXT
      // Clear any background/text color fields to ensure it's pure text coloring
      this.settings.wordEntries[idx].textColor = null;
      this.settings.wordEntries[idx].backgroundColor = null;
    } else {
      this.settings.wordEntries.push({
        pattern,
        color: col,
        isRegex: false,
        flags: "",
        styleType: "text",
        textColor: null,
        backgroundColor: null,
        matchType: this.settings.partialMatch ? "contains" : "exact",
      });
    }
    await this.saveSettings();
    this.reconfigureEditorExtensions();
  }

  // Add a new entry (word or regex)
  async addNewEntry(pattern, color, isRegex, flags = "", name = "") {
    try {
      // Input validation for security and sanity
      const patternStr = String(pattern || "").trim();
      if (!patternStr) {
        debugWarn("ADD_ENTRY", "Pattern is empty");
        return;
      }
      if (patternStr.length > 10000) {
        debugWarn("ADD_ENTRY", "Pattern exceeds max length (10KB)");
        return;
      }

      // Validate regex if applicable
      if (isRegex) {
        const flagsStr = String(flags || "").replace(/[^gimsuy]/g, "");
        try {
          new RegExp(patternStr, flagsStr);
        } catch (regexErr) {
          debugWarn("ADD_ENTRY", "Invalid regex pattern", regexErr);
          return;
        }
      }

      const uid = (() => {
        try {
          return Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          return Date.now();
        }
      })();
      const entry = {
        uid,
        pattern: patternStr,
        textColor: String(color || "#000000"),
        isRegex: !!isRegex,
        flags: String(flags || "").replace(/[^gimsuy]/g, ""),
        styleType: "text",
        backgroundColor: null,
        matchType: !isRegex
          ? this.settings.partialMatch
            ? "contains"
            : "exact"
          : "regex",
        presetLabel: name ? String(name) : undefined,
        persistAtEnd: true,
        groupedPatterns: null,
        inclusionRules: [],
        exclusionRules: [],
      };
      this.settings.wordEntries.push(entry);
      await this.saveSettings();
      this.compileWordEntries();
      this.compileTextBgColoringEntries();
      try {
        this.reconfigureEditorExtensions();
      } catch (_) {}
      try {
        this.settingTab &&
          this.settingTab._newEntriesSet &&
          this.settingTab._newEntriesSet.add(uid);
      } catch (_) {}
    } catch (e) {
      debugError("ADD_ENTRY", "addNewEntry failed", e);
    }
  }

  // --- MIGRATION: Convert global advancedRules to per-entry rules ---
  migrateAdvancedRulesToPerEntry() {
    try {
      const advRules = Array.isArray(this.settings.advancedRules)
        ? this.settings.advancedRules
        : [];
      if (advRules.length === 0) return; // Nothing to migrate

      const wordEntries = Array.isArray(this.settings.wordEntries)
        ? this.settings.wordEntries
        : [];
      const caseInsensitive = !this.settings.caseSensitive;

      // Process each global rule
      advRules.forEach((rule) => {
        if (!rule || !rule.text) return;

        const ruleText = String(rule.text || "").trim();
        const ruleMode = rule.mode === "exclude" ? "exclude" : "include";
        const rulePath = String(rule.path || "").trim();
        const ruleIsRegex = !!rule.isRegex;
        const ruleFlags = String(rule.flags || "").replace(/[^gimsuy]/g, "");

        // Find matching entry (case-sensitive or insensitive based on settings)
        const matchingEntry = wordEntries.find((entry) => {
          if (!entry || !entry.pattern) return false;
          const entryPattern = String(entry.pattern || "").trim();

          if (caseInsensitive) {
            return ruleText.toLowerCase() === entryPattern.toLowerCase();
          } else {
            return ruleText === entryPattern;
          }
        });

        // If matching entry found, add rule to it
        if (matchingEntry) {
          // Initialize arrays if they don't exist
          if (!Array.isArray(matchingEntry.inclusionRules))
            matchingEntry.inclusionRules = [];
          if (!Array.isArray(matchingEntry.exclusionRules))
            matchingEntry.exclusionRules = [];

          const newRule = {
            path: rulePath,
            isRegex: ruleIsRegex,
            flags: ruleFlags,
          };

          if (ruleMode === "include") {
            // Only add if not already present
            if (
              !matchingEntry.inclusionRules.some(
                (r) => r.path === rulePath && r.isRegex === ruleIsRegex,
              )
            ) {
              matchingEntry.inclusionRules.push(newRule);
            }
          } else {
            // Only add if not already present
            if (
              !matchingEntry.exclusionRules.some(
                (r) => r.path === rulePath && r.isRegex === ruleIsRegex,
              )
            ) {
              matchingEntry.exclusionRules.push(newRule);
            }
          }
        }
      });

      // Clear the old global advancedRules
      this.settings.advancedRules = [];

      // Ensure all entries have the new properties
      wordEntries.forEach((entry) => {
        if (!Array.isArray(entry.inclusionRules)) entry.inclusionRules = [];
        if (!Array.isArray(entry.exclusionRules)) entry.exclusionRules = [];
      });

      debugLog(
        "MIGRATION",
        `Migrated ${advRules.length} global rules to per-entry rules`,
      );
    } catch (e) {
      debugError("MIGRATION", "Error migrating advancedRules", e);
    }
  }

  // --- FORCE REFRESH all open Markdown editors ---
  forceRefreshAllEditors() {
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view instanceof MarkdownView && leaf.view.editor?.cm) {
        // Dispatch a state effect to force decoration rebuild
        leaf.view.editor.cm.dispatch({
          effects: forceRebuildEffect.of(null),
        });
      }
    });

    // Migrate simple blacklistWords to pattern-capable blacklistEntries
    try {
      if (
        Array.isArray(this.settings.blacklistWords) &&
        this.settings.blacklistWords.length > 0
      ) {
        const existing = Array.isArray(this.settings.blacklistEntries)
          ? this.settings.blacklistEntries
          : [];
        const existingPatterns = new Set(existing.map((e) => e && e.pattern));
        const migrated = this.settings.blacklistWords
          .filter((w) => typeof w === "string" && String(w).length > 0)
          .map((w) => ({
            pattern: String(w),
            isRegex: false,
            flags: "",
            groupedPatterns: null,
          }));
        migrated.forEach((m) => {
          if (m && !existingPatterns.has(m.pattern)) existing.push(m);
        });
        this.settings.blacklistEntries = existing;
      } else if (!Array.isArray(this.settings.blacklistEntries)) {
        this.settings.blacklistEntries = [];
      }
    } catch (e) {}
  }

  // Clear all highlight spans from the entire document (used when disabling plugin)
  clearAllHighlights() {
    try {
      const highlights = document.querySelectorAll(
        ".always-color-text-highlight",
      );
      for (const hl of highlights) {
        try {
          const textNode = document.createTextNode(hl.textContent);
          hl.replaceWith(textNode);
        } catch (_) {}
      }
      debugLog("CLEAR_ALL", `Cleared ${highlights.length} highlights`);
    } catch (e) {
      debugError("CLEAR_ALL", "Failed to clear highlights", e);
    }
  }

  // --- FORCE REFRESH all reading views (reading mode panes) ---
  forceRefreshAllReadingViews() {
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (
        leaf.view instanceof MarkdownView &&
        leaf.view.getMode &&
        leaf.view.getMode() === "preview"
      ) {
        const root =
          (leaf.view.previewMode && leaf.view.previewMode.containerEl) ||
          leaf.view.contentEl ||
          leaf.view.containerEl;
        let scroller = null;
        try {
          let cur = root;
          for (let i = 0; i < 8 && cur; i++) {
            if (
              cur.scrollHeight &&
              cur.clientHeight &&
              cur.scrollHeight - cur.clientHeight > 4
            ) {
              scroller = cur;
              break;
            }
            cur = cur.parentElement;
          }
        } catch (_) {}
        if (!scroller) {
          try {
            scroller =
              document.scrollingElement ||
              document.documentElement ||
              document.body ||
              null;
          } catch (_) {}
        }
        const prevTop = scroller ? scroller.scrollTop : 0;
        const prevLeft = scroller ? scroller.scrollLeft : 0;
        if (typeof leaf.view.previewMode?.rerender === "function") {
          leaf.view.previewMode.rerender(true);
        } else if (typeof leaf.view.previewMode?.render === "function") {
          leaf.view.previewMode.render();
        } else if (typeof leaf.view?.rerender === "function") {
          leaf.view.rerender();
        }
        if (scroller) {
          setTimeout(() => {
            try {
              if (typeof scroller.scrollTo === "function") {
                scroller.scrollTo({ top: prevTop, left: prevLeft, behavior: "auto" });
              } else {
                scroller.scrollTop = prevTop;
                scroller.scrollLeft = prevLeft;
              }
            } catch (_) {}
          }, 0);
        }

        try {
          if (this.settings.enabled) {
            const path =
              leaf.view.file && leaf.view.file.path
                ? leaf.view.file.path
                : null;
            if (root && path) {
              try {
                this.processActiveFileOnly(root, { sourcePath: path });
              } catch (_) {}
            }
          }
        } catch (_) {}
      }
    });
  }

  // --- Reconfigure CodeMirror extensions for all editors ---
  reconfigureEditorExtensions() {
    if (this.extension) {
      this.app.workspace.unregisterEditorExtension(this.extension);
      this.app.workspace.registerEditorExtension(this.extension);
    }
    this.forceRefreshAllEditors();
  }

  // --- Trigger active document rerender ---
  triggerActiveDocumentRerender() {
    // Prevent multiple rapid re-renders (race condition protection)
    if (this._lastRerender && Date.now() - this._lastRerender < 100) {
      return;
    }
    this._lastRerender = Date.now();

    // Prioritize active document first for better perceived performance
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      this.refreshEditor(activeView, true);

      // Defer full refresh for better performance
      setTimeout(() => {
        this.forceRefreshAllEditors();
        this.forceRefreshAllReadingViews();
      }, 50);
      return;
    }

    // Fallback: refresh all if no active view
    this.forceRefreshAllEditors();
    this.forceRefreshAllReadingViews();
    if (activeView) {
      this.refreshEditor(activeView, true);

      // Force a more aggressive refresh for reading mode
      if (activeView.getMode && activeView.getMode() === "preview") {
        try {
          if (
            activeView.previewMode &&
            typeof activeView.previewMode.rerender === "function"
          ) {
            activeView.previewMode.rerender(true);
          }
        } catch (e) {
          // Fallback to processing the content directly
          setTimeout(() => {
            try {
              const root =
                (activeView.previewMode &&
                  activeView.previewMode.containerEl) ||
                activeView.contentEl ||
                activeView.containerEl;
              if (root && activeView.file && activeView.file.path) {
                this.processActiveFileOnly(root, {
                  sourcePath: activeView.file.path,
                });
              }
            } catch (err) {
              // Final fallback
              this.forceRefreshAllReadingViews();
            }
          }, 100);
        }
      }
    }
  }

  // --- Update Status Bar Text ---
  updateStatusBar() {
    if (this.statusBar) {
      this.statusBar.setText(`COL: ${this.settings.enabled ? "ON" : "OFF"}`);
    }
  }

  // --- Refresh only the Active Editor!!! ---
  refreshActiveEditor(force = false) {
    if (this._refreshTimeout) clearTimeout(this._refreshTimeout);
    this._refreshSeq = (this._refreshSeq || 0) + 1;
    const token = this._refreshSeq;
    // Use a weak callback pattern: check if plugin is still active before executing
    const callback = () => {
      if (token !== this._refreshSeq) return;
      // Guard: if plugin unloaded, don't execute
      if (!this.app || !this.app.workspace) return;

      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        this.refreshEditor(activeView, force);
      }

      // Ensure canvas views are also refreshed if they are active or visible
      this.refreshCanvasViews();
    };

    this._refreshTimeout = setTimeout(callback, 100);
  }

  // --- Refresh all Canvas Views ---
  refreshCanvasViews() {
    try {
      this.app.workspace.iterateAllLeaves((leaf) => {
        try {
          if (leaf && leaf.view && leaf.view.getViewType() === "canvas") {
            const embeds = leaf.containerEl.querySelectorAll(
              ".canvas-node .markdown-embed-content",
            );
            embeds.forEach((el) => {
              if (typeof this.scheduleCanvasProcess === "function") {
                this.scheduleCanvasProcess(el);
              } else {
                // Fallback if scheduleCanvasProcess is not accessible (it's inside onload try-catch)
                // We'll trigger a mutation to let the observer handle it
                const dummy = el.createDiv();
                dummy.remove();
              }
            });
          }
        } catch (_) {}
      });
    } catch (e) {
      debugWarn("CANVAS", "Failed to refresh canvas views", e);
    }
  }

  // --- Refresh a Specific Editor ---
  refreshEditor(view, force = false) {
    if (view?.editor?.cm) {
      if (this._editorRefreshTimeout) clearTimeout(this._editorRefreshTimeout);
      this._editorRefreshSeq = (this._editorRefreshSeq || 0) + 1;
      const token = this._editorRefreshSeq;
      // Use a weak callback pattern: check if view/editor still valid before executing
      const callback = () => {
        if (token !== this._editorRefreshSeq) return;
        // Guard: if view or editor no longer exists, don't execute
        if (!view?.editor?.cm) return;

        try {
          const cm = view.editor.cm;
          cm.dispatch({ changes: [] });
        } catch (e) {
          // Editor may have been disposed or closed
        }
      };

      this._editorRefreshTimeout = setTimeout(callback, 100);
    }
  }

  // --- Escape Regex Special Characters ---
  escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // NEW HELPER: Check if a match is a whole word (word boundaries on both sides)
  isWholeWordMatch(text, matchStart, matchEnd) {
    const leftChar = matchStart > 0 ? text[matchStart - 1] : "";
    const rightChar = matchEnd < text.length ? text[matchEnd] : "";
    const slice = text.substring(matchStart, matchEnd);
    const nonRoman =
      this.containsNonRomanCharacters &&
      this.containsNonRomanCharacters(slice);
    if (nonRoman) {
      const leftOk = matchStart === 0 || !this.isCJKChar(leftChar);
      const rightOk = matchEnd === text.length || !this.isCJKChar(rightChar);
      return leftOk && rightOk;
    }
    const isWordChar = (ch) => /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
    const leftOk = matchStart === 0 || !isWordChar(leftChar);
    const rightOk = matchEnd === text.length || !isWordChar(rightChar);
    return leftOk && rightOk;
  }

  isSentenceLikePattern(p) {
    try {
      const s = String(p || "");
      if (/^[A-Za-z0-9'\-]+(?:\s+[A-Za-z0-9'\-]+)+$/.test(s)) return false;
      return /[\s,\.;:!\?"'\(\)\[\]\{\}<>@#]/.test(s);
    } catch (e) {
      return false;
    }
  }
  isLatinWordPattern(p) {
    try {
      const s = String(p || "");
      return /^[A-Za-z0-9'\-]+$/.test(s);
    } catch (e) {
      return false;
    }
  }

  _isWordStart(text, idx) {
    const leftChar = idx > 0 ? text[idx - 1] : "";
    const currChar = idx < text.length ? text[idx] : "";
    const isWordChar = (ch) =>
      /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
    return (idx === 0 || !isWordChar(leftChar)) && isWordChar(currChar);
  }

  _isWordEnd(text, idx) {
    const rightChar = idx < text.length ? text[idx] : "";
    const leftChar = idx > 0 ? text[idx - 1] : "";
    const isWordChar = (ch) =>
      /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
    return (
      (idx === text.length || !isWordChar(rightChar)) && isWordChar(leftChar)
    );
  }

  _isWordChar(ch) {
    return /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
  }

  findWordStart(text, position) {
    let start = position;
    while (start > 0 && this._isWordChar(text[start - 1])) {
      start--;
    }
    return start;
  }

  findWordEnd(text, position) {
    let end = position;
    while (end < text.length && this._isWordChar(text[end])) {
      end++;
    }
    return end;
  }

  _extractWordAtPosition(text, start, end) {
    let ws = start;
    let we = end;
    while (ws > 0 && this._isWordChar(text[ws - 1])) ws--;
    while (we < text.length && this._isWordChar(text[we])) we++;
    return text.substring(ws, we);
  }

  _isPatternAtWordStart(text, start, end, pattern) {
    const word = this._extractWordAtPosition(text, start, end);
    if (typeof pattern !== "string") pattern = String(pattern || "");
    if (!pattern) return false;
    const a = this.settings.caseSensitive ? word : word.toLowerCase();
    const b = this.settings.caseSensitive ? pattern : pattern.toLowerCase();
    return a.startsWith(b);
  }

  _isPatternAtWordEnd(text, start, end, pattern) {
    const word = this._extractWordAtPosition(text, start, end);
    if (typeof pattern !== "string") pattern = String(pattern || "");
    if (!pattern) return false;
    const a = this.settings.caseSensitive ? word : word.toLowerCase();
    const b = this.settings.caseSensitive ? pattern : pattern.toLowerCase();
    return a.endsWith(b);
  }

  // Helper: Extract full word at given position
  extractFullWordAtPosition(text, start, end) {
    let wordStart = start;
    let wordEnd = end;

    const slice = text.substring(start, end);
    const hasNonRoman =
      this.containsNonRomanCharacters && this.containsNonRomanCharacters(slice);
    if (hasNonRoman) {
      while (wordStart > 0 && this.isCJKChar(text[wordStart - 1])) wordStart--;
      while (wordEnd < text.length && this.isCJKChar(text[wordEnd])) wordEnd++;
    } else {
      while (wordStart > 0 && this._isWordChar(text[wordStart - 1])) wordStart--;
      while (wordEnd < text.length && this._isWordChar(text[wordEnd])) wordEnd++;
    }

    return text.substring(wordStart, wordEnd);
  }

  matchSatisfiesType(text, start, end, entry) {
    try {
      // CRITICAL: For regex patterns, the regex itself defines the matching logic
      // (including boundaries via \b). We should always return true here to avoid
      // incorrectly comparing the regex pattern string with the matched text.
      if (entry && entry.isRegex) {
        return true;
      }

      const matchType = String(
        entry?.matchType || (this.settings.partialMatch ? "contains" : "exact"),
      ).toLowerCase();
      const pattern = entry?.pattern || "";

      // For sentence-like patterns (containing spaces/punctuation), always match
      if (this.isSentenceLikePattern(pattern)) {
        return true;
      }

      // Extract the full word at the match position
      const fullWord = this.extractFullWordAtPosition(text, start, end);

      switch (matchType) {
        case "exact":
          // Exact match: pattern must exactly equal the full word
          const exactMatch = this.settings.caseSensitive
            ? fullWord === pattern
            : fullWord.toLowerCase() === pattern.toLowerCase();
          return exactMatch;

        case "contains":
          // Contains: pattern must be found anywhere within the full word
          const containsMatch = this.settings.caseSensitive
            ? fullWord.includes(pattern)
            : fullWord.toLowerCase().includes(pattern.toLowerCase());
          return containsMatch;

        case "startswith":
          try {
            // For non‑Roman patterns, do plain startsWith without ASCII anchors
            if (
              this.containsNonRomanCharacters &&
              this.containsNonRomanCharacters(pattern)
            ) {
              const startsWithMatch = this.settings.caseSensitive
                ? fullWord.startsWith(pattern)
                : fullWord.toLowerCase().startsWith(pattern.toLowerCase());
              return startsWithMatch;
            }
            // OPTIMIZATION: Skip RegExp creation while typing
            if (this._isTyping) throw new Error("Skip strict check");
            const flags = this.settings.caseSensitive ? "" : "i";
            const re = new RegExp(
              `^${this.helpers.escapeRegex ? this.helpers.escapeRegex(pattern) : pattern.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}[A-Za-z]*$`,
              flags,
            );
            return re.test(fullWord);
          } catch (_) {
            const startsWithMatch = this.settings.caseSensitive
              ? fullWord.startsWith(pattern)
              : fullWord.toLowerCase().startsWith(pattern.toLowerCase());
            return startsWithMatch;
          }

        case "endswith":
          try {
            // For non‑Roman patterns, do plain endsWith without ASCII anchors
            if (
              this.containsNonRomanCharacters &&
              this.containsNonRomanCharacters(pattern)
            ) {
              const endsWithMatch = this.settings.caseSensitive
                ? fullWord.endsWith(pattern)
                : fullWord.toLowerCase().endsWith(pattern.toLowerCase());
              return endsWithMatch;
            }
            // OPTIMIZATION: Skip RegExp creation while typing
            if (this._isTyping) throw new Error("Skip strict check");
            const flags = this.settings.caseSensitive ? "" : "i";
            const re = new RegExp(
              `^[A-Za-z]*${this.helpers.escapeRegex ? this.helpers.escapeRegex(pattern) : pattern.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}$`,
              flags,
            );
            return re.test(fullWord);
          } catch (_) {
            const endsWithMatch = this.settings.caseSensitive
              ? fullWord.endsWith(pattern)
              : fullWord.toLowerCase().endsWith(pattern.toLowerCase());
            return endsWithMatch;
          }

        default:
          return true;
      }
    } catch (_) {
      return true;
    }
  }

  safeRegexTest(regex, text, timeout = 50) {
    // BAIL OUT EARLY FOR NON-ROMAN TEXT
    if (this.containsNonRomanCharacters(text)) {
      try {
        return Promise.resolve(regex.test(text));
      } catch (e) {
        return Promise.resolve(false);
      }
    }

    // ... existing timeout logic for Roman scripts
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(false); // Return false if timeout occurs
      }, timeout);

      try {
        const result = regex.test(text);
        clearTimeout(timeoutId);
        resolve(result);
      } catch (e) {
        clearTimeout(timeoutId);
        resolve(false);
      }
    });
  }

  // --- Safe Regex Matching Loop with Protection ---
  safeMatchLoop(regex, text) {
    // OPTIMIZATION: Trigger lazy compilation if needed (ensures patterns are pre-compiled)
    if (this._wordPatternsCompilationDirty)
      try {
        this.compileWordPatterns();
      } catch (e) {}
    if (this._textBgPatternsCompilationDirty)
      try {
        this.compileTextBgPatterns();
      } catch (e) {}

    const matches = [];
    try {
      if (regex) regex.lastIndex = 0;
    } catch (e) {}
    let lastIndex = 0;
    let safetyCounter = 0;
    // OPTIMIZATION: Aggressive limits on regex iterations to prevent lag
    const maxIterations = Math.min(
      EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN,
      100,
    );

    const startTime = Date.now();
    try {
      while (safetyCounter < maxIterations) {
        // OPTIMIZATION: Safety timeout for complex regex (10ms limit per pattern)
        if (safetyCounter > 10 && Date.now() - startTime > 10) break;

        const match = regex.exec(text);
        if (!match) break;

        matches.push(match);
        if (regex.lastIndex === lastIndex) break; // Avoid infinite loops
        lastIndex = regex.lastIndex;
        safetyCounter++;

        // OPTIMIZATION: Early exit if we've found enough matches
        if (
          matches.length >= EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN
        )
          break;
      }
    } catch (e) {
      debugWarn("MATCH", "safeMatchLoop error", e);
    }

    return matches;
  }

  // Create a lightweight fastTest function to reject texts that cannot contain the pattern
  createFastTester(pattern, isRegex, caseSensitive) {
    try {
      if (!pattern)
        return (text) => {
          const bloom = this._bloomFilter;
          if (bloom && !bloom.mightContain(text)) return false;
          return true;
        };

      // IMPORTANT: For preset patterns (Times, @username, etc.), bypass bloom filter
      // Presets are always-on and should not be filtered by content-based checks
      const isPresetPattern =
        pattern &&
        (pattern.includes("am") ||
          pattern.includes("pm") ||
          pattern.includes("[ap]m") ||
          pattern.includes(":[0-5][0-9]") ||
          pattern.includes("@[a-zA-Z") ||
          /am|pm|\[ap\]m|:[0-5][0-9]|@\[a-zA-Z/.test(pattern));

      if (isPresetPattern) {
        if (pattern && (pattern.includes("pm") || pattern.includes("[ap]m"))) {
          debugLog("FASTTEST_PRESET_BYPASS", `Pattern: ${pattern}, bypassing ALL filters`);
        }
        return (text) => true; // Presets ALWAYS bypass performance filters
      }

      const bloom = this._bloomFilter;
      const withBloom = (fn) => (text) => {
        if (bloom && !bloom.mightContain(text)) return false;
        return fn(text);
      };

      // NON-ROMAN CHARACTERS - SIMPLE HANDLING
      if (this.containsNonRomanCharacters(pattern)) {
        if (caseSensitive) {
          return withBloom(
            (text) => typeof text === "string" && text.includes(pattern),
          );
        } else {
          const lowerPattern = pattern.toLowerCase();
          return withBloom(
            (text) =>
              typeof text === "string" &&
              text.toLowerCase().includes(lowerPattern),
          );
        }
      }

      // Literal patterns: simple substring check
      if (!isRegex) {
        if (caseSensitive) {
          return withBloom(
            (text) => typeof text === "string" && text.includes(pattern),
          );
        } else {
          const lowerPattern = pattern.toLowerCase();
          return withBloom(
            (text) =>
              typeof text === "string" &&
              text.toLowerCase().includes(lowerPattern),
          );
        }
      }

      // For regex patterns, attempt to extract obvious required literals
      try {
        // Quick checks for some punctuation-heavy patterns
        if (
          pattern.includes("$") ||
          pattern.includes("€") ||
          pattern.includes("£")
        ) {
          return withBloom(
            (text) =>
              typeof text === "string" &&
              (text.includes("$") || text.includes("€") || text.includes("£")),
          );
        }
        // Smarter colon check: only if it's likely a literal colon, not part of (?: or (?<= or (?<!
        if (
          pattern.includes(":") &&
          (!isRegex ||
            (pattern.includes(" :") ||
              pattern.includes(": ") ||
              /\\:/.test(pattern) ||
              /[^?]:/.test(pattern)))
        ) {
          // If it's a regex and contains (?: we should be careful.
          // For now, if it's a regex and contains (?:, we bypass the colon check unless it's a literal \:
          const isNonCapturing = isRegex && /\(\?:/.test(pattern);
          const hasLiteralColon = isRegex && /\\:/.test(pattern);

          if (!isRegex || hasLiteralColon || !isNonCapturing) {
            return withBloom(
              (text) => typeof text === "string" && text.includes(":"),
            );
          }
        }
        if (pattern.includes("@")) {
          return withBloom(
            (text) => typeof text === "string" && text.includes("@"),
          );
        }
        if (pattern.includes("-")) {
          return withBloom(
            (text) => typeof text === "string" && text.includes("-"),
          );
        }

        // Look for a reasonably long literal sequence inside the regex
        const literalMatch = pattern.match(/[A-Za-z]{3,}/);
        if (literalMatch) {
          const literal = literalMatch[0];
          if (caseSensitive) {
            return withBloom(
              (text) => typeof text === "string" && text.includes(literal),
            );
          } else {
            const lowerLiteral = literal.toLowerCase();
            return withBloom(
              (text) =>
                typeof text === "string" &&
                text.toLowerCase().includes(lowerLiteral),
            );
          }
        }
      } catch (e) {
        // Fall through to permissive test below
      }
    } catch (e) {}
    if (isRegex) {
      return (text) => true;
    }
    return (text) => {
      const bloom = this._bloomFilter;
      if (bloom && !bloom.mightContain(text)) return false;
      return true;
    };
  }

  // --- Lightweight mode decision for very large documents ---
  shouldUseLightweightMode(textLength, textContent = "") {
    try {
      if (this.settings && this.settings.extremeLightweightMode) {
        return true;
      }
      const isLargeDoc = Number(textLength) > 50000;
      const isNonRomanHeavy = this.getNonRomanCharacterRatio(textContent) > 0.3;
      return isLargeDoc || isNonRomanHeavy;
    } catch (e) {
      return false;
    }
  }

  // NEW METHOD: Check if we should skip complex processing
  isPerformanceOverloaded() {
    try {
      // Simple performance check - avoid complex processing if system is busy
      if (typeof performance !== "undefined" && performance.memory) {
        const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
        if (usedMB > 1000) {
          // If using >1GB RAM, skip complex processing
          debugWarn(
            "[ACT] High memory usage, skipping complex pattern processing",
          );
          return true;
        }
      }

      // Quick check if we have too many entries
      const totalEntries = this.getSortedWordEntries().length;
      if (totalEntries > 100) {
        debugLog("ACT", "Many patterns defined, using conservative processing");
        return true;
      }

      return false;
    } catch (e) {
      return false; // Default to processing if we can't check
    }
  }

  // --- Get Sorted Word Entries (Longest words first!!!) ---
  getSortedWordEntries() {
    // Return cached result when possible to avoid creating new arrays on every call
    if (!this._cachedSortedEntries || this._cacheDirty) {
      const textEntries = Array.isArray(this._compiledWordEntries)
        ? this._compiledWordEntries
        : [];
      const bgEntries = Array.isArray(this._compiledTextBgEntries)
        ? this._compiledTextBgEntries
        : [];
      const entries = textEntries.concat(bgEntries);
      const numWords = entries.length;
      if (numWords > 500) {
        debugWarn(
          "GET_SORTED",
          `You have ${numWords} colored words/patterns! That's a lot and may impact performance.`,
        );
      }
      // Filter out patterns that are blacklisted (supports regex/literals)
      let filtered = entries.filter((e) => {
        if (!e || !e.pattern) return false;
        const bw = Array.isArray(this.settings.blacklistWords)
          ? this.settings.blacklistWords
          : [];
        if (this.settings.caseSensitive) {
          if (bw.includes(e.pattern)) return false;
        } else {
          const lower = e.pattern.toLowerCase();
          if (bw.map((w) => String(w).toLowerCase()).includes(lower))
            return false;
        }
        const blEntries = Array.isArray(this.settings.blacklistEntries)
          ? this.settings.blacklistEntries
          : [];
        for (const be of blEntries) {
          if (!be || be.isRegex) continue;
          const patterns =
            Array.isArray(be.groupedPatterns) && be.groupedPatterns.length > 0
              ? be.groupedPatterns
              : [be.pattern];
          for (const p of patterns) {
            if (!p) continue;
            if (this.settings.caseSensitive) {
              if (p === e.pattern) return false;
            } else {
              if (String(p).toLowerCase() === e.pattern.toLowerCase())
                return false;
            }
          }
        }
        return true;
      });

      if (this.settings.hideHighlights || this.settings.hideTextColors) {
        filtered = filtered
          .map((orig) => {
            const e = Object.assign({}, orig);
            if (this.settings.hideHighlights) {
              if (e.styleType === "highlight") return null;
              // IMPORTANT: Don't remove backgroundColor from explicit text+bg entries (isTextBg flag)
              // They should remain as 'both' even when hideHighlights is enabled
              if (e.styleType === "both" && !e.isTextBg) {
                e.styleType = "text";
                e.backgroundColor = null;
                e.textColor = e.textColor || e.color || null;
              }
              if (e.backgroundColor && !e.styleType && !e.isTextBg) {
                e.backgroundColor = null;
                e.styleType = "text";
                e.textColor = e.textColor || e.color || null;
              }
            }
            if (this.settings.hideTextColors) {
              if (e.styleType === "text") return null;
              if (e.styleType === "both") {
                e.styleType = "highlight";
              }
              if (!e.styleType && e.color && !e.backgroundColor) {
                return null;
              }
            }
            return e;
          })
          .filter(Boolean);
      }
      // Sort by specificity and pattern length (prioritize longer words)
      filtered.sort((a, b) => {
        // EXPERT OPTIMIZATION: Prioritize simple exact matches over complex regex
        const aIsRegex = !!a.isRegex;
        const bIsRegex = !!b.isRegex;
        if (!aIsRegex && bIsRegex) return -1;
        if (aIsRegex && !bIsRegex) return 1;

        const sa =
          typeof a.specificity === "number"
            ? a.specificity
            : String(a.pattern || "").replace(/\*/g, "").length;
        const sb =
          typeof b.specificity === "number"
            ? b.specificity
            : String(b.pattern || "").replace(/\*/g, "").length;
        const specDiff = sb - sa;
        if (specDiff !== 0) return specDiff;
        return String(b.pattern || "").length - String(a.pattern || "").length;
      });
      // Cache and clear dirty flag
      this._cachedSortedEntries = filtered;
      this._cacheDirty = false;
    }
    return this._cachedSortedEntries;
  }

  // --- Helper: Convert hex to rgba with opacity ---
  // Helper: Validate hex color format to prevent CSS injection
  isValidHexColor(hex) {
    if (hex === "inherit" || hex === "currentColor") return true;
    if (typeof hex !== "string") return false;
    if (
      hex.includes(";") ||
      hex.toLowerCase().includes("!important") ||
      /\s/.test(hex)
    )
      return false;
    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    return hexRegex.test(hex);
  }

  // Helper: Check if a color is "dark" (low luminance)
  isDarkColor(color) {
    if (!color) return false;
    try {
      let r, g, b;
      if (color.startsWith("#")) {
        let hex = color.substring(1);
        if (hex.length === 3)
          hex = hex
            .split("")
            .map((x) => x + x)
            .join("");
        if (hex.length !== 6) return false;
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (color.startsWith("rgb")) {
        const parts = color.match(/\d+/g);
        if (!parts || parts.length < 3) return false;
        r = parseInt(parts[0]);
        g = parseInt(parts[1]);
        b = parseInt(parts[2]);
      } else {
        return false;
      }
      // Perceived luminance (YIQ/NTSC)
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      return luma < 60; // Threshold for "dark" (approx < 25% brightness)
    } catch (e) {
      return false;
    }
  }

  hexToRgba(hex, opacityPercent) {
    // Validate hex color to prevent CSS injection
    if (!this.isValidHexColor(hex)) {
      // Fallback to black if invalid
      return `rgba(0,0,0,1)`;
    }

    let c = hex.replace("#", "");
    if (c.length === 3)
      c = c
        .split("")
        .map((x) => x + x)
        .join("");
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    // Clamp and convert percent to 0-1
    let o = Math.max(0, Math.min(100, Number(opacityPercent)));
    o = o / 100;
    return `rgba(${r},${g},${b},${o})`;
  }

  hexToHexWithAlpha(hex, opacityPercent) {
    try {
      const h = String(hex || "").trim();
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(h)) return h;
      const pct = Math.max(0, Math.min(100, Number(opacityPercent)));
      const alpha = Math.round((pct / 100) * 255)
        .toString(16)
        .padStart(2, "0");
      if (h.length === 4) {
        const r = h[1];
        const g = h[2];
        const b = h[3];
        const full = `#${r}${r}${g}${g}${b}${b}`;
        return `${full}${alpha}`;
      }
      return `${h}${alpha}`;
    } catch (_) {
      return hex;
    }
  }

  // Helper: Apply border style to a span element based on settings or entry overrides
  applyBorderStyleToElement(element, textColor, backgroundColor, entry = null) {
    const enable =
      entry && typeof entry.enableBorderThickness !== "undefined"
        ? !!entry.enableBorderThickness
        : !!this.settings.enableBorderThickness;
    if (this.settings.hideHighlights === true || !enable) {
      element.style.border = "";
      element.style.borderTop = "";
      element.style.borderRight = "";
      element.style.borderBottom = "";
      element.style.borderLeft = "";
      return;
    }
    const borderThickness =
      entry && typeof entry.borderThickness === "number"
        ? entry.borderThickness
        : (this.settings.borderThickness ?? 1);
    const borderOpacity =
      entry && typeof entry.borderOpacity === "number"
        ? entry.borderOpacity
        : (this.settings.borderOpacity ?? 100);
    let sourceColor = null;
    if (
      textColor &&
      textColor !== "currentColor" &&
      this.isValidHexColor(textColor)
    ) {
      sourceColor = textColor;
    } else if (backgroundColor && this.isValidHexColor(backgroundColor)) {
      sourceColor = backgroundColor;
    } else {
      sourceColor = "#000000";
    }
    const borderColorRgba = this.hexToRgba(sourceColor, borderOpacity);
    const borderStyleType =
      entry && typeof entry.borderStyle === "string"
        ? entry.borderStyle
        : (this.settings.borderStyle ?? "full");
    const lineStyle =
      entry && typeof entry.borderLineStyle === "string"
        ? entry.borderLineStyle
        : (this.settings.borderLineStyle ?? "solid");
    const borderCSS = `${borderThickness}px ${lineStyle} ${borderColorRgba}`;
    switch (borderStyleType) {
      case "bottom":
        element.style.borderBottom = borderCSS;
        break;
      case "top":
        element.style.borderTop = borderCSS;
        break;
      case "left":
        element.style.borderLeft = borderCSS;
        break;
      case "right":
        element.style.borderRight = borderCSS;
        break;
      case "top-bottom":
        element.style.borderTop = borderCSS;
        element.style.borderBottom = borderCSS;
        break;
      case "left-right":
        element.style.borderLeft = borderCSS;
        element.style.borderRight = borderCSS;
        break;
      case "top-right":
        element.style.borderTop = borderCSS;
        element.style.borderRight = borderCSS;
        break;
      case "top-left":
        element.style.borderTop = borderCSS;
        element.style.borderLeft = borderCSS;
        break;
      case "bottom-right":
        element.style.borderBottom = borderCSS;
        element.style.borderRight = borderCSS;
        break;
      case "bottom-left":
        element.style.borderBottom = borderCSS;
        element.style.borderLeft = borderCSS;
        break;
      case "full":
      default:
        element.style.border = borderCSS;
        break;
    }
  }

  /**
   * Merges a base inline style string with sanitized custom CSS declarations.
   * Custom CSS properties take priority — any base property that the custom CSS
   * also declares is stripped from the base string so the custom value wins.
   *
   * @param {string} baseStyle  - The base inline style string (may contain !important)
   * @param {string} customCss  - Raw custom CSS declarations from entry.customCss
   * @returns {string} Merged style string with custom CSS winning on conflicts
   */
  _mergeStyleWithCustomCss(baseStyle, customCss) {
    if (!customCss || !customCss.trim()) return baseStyle;
    const sanitized = this.sanitizeCssDeclarations(customCss);
    if (!sanitized) return baseStyle;

    // Collect the property names declared in custom CSS
    const customProps = new Set();
    const customParts = sanitized.split(";").map(s => s.trim()).filter(Boolean);
    for (const p of customParts) {
      const idx = p.indexOf(":");
      if (idx === -1) continue;
      const prop = p.slice(0, idx).trim().toLowerCase();
      customProps.add(prop);
      // If custom CSS declares `background` shorthand, also strip `background-color`
      if (prop === "background") customProps.add("background-color");
      if (prop === "background-color") customProps.add("background");
      if (prop === "padding") {
        customProps.add("padding-left"); customProps.add("padding-right");
        customProps.add("padding-top"); customProps.add("padding-bottom");
      }
      if (prop === "border") {
        customProps.add("border-top"); customProps.add("border-right");
        customProps.add("border-bottom"); customProps.add("border-left");
      }
    }

    // Strip those properties from the base style string
    // Base style is semicolon-separated; split carefully
    const baseParts = baseStyle.split(";").map(s => s.trim()).filter(Boolean);
    const filteredBase = baseParts.filter(p => {
      const idx = p.indexOf(":");
      if (idx === -1) return true;
      const prop = p.slice(0, idx).trim().toLowerCase();
      return !customProps.has(prop);
    });

    // Rebuild: filtered base + custom CSS with !important
    const customWithImportant = customParts
      .map(p => {
        const idx = p.indexOf(":");
        if (idx === -1) return p;
        return `${p.slice(0, idx).trim()}: ${p.slice(idx + 1).trim()} !important`;
      })
      .join("; ");

    const base = filteredBase.join("; ");
    return base ? `${base}; ${customWithImportant}` : customWithImportant;
  }

  sanitizeCssDeclarations(input) {
    try {
      if (!input || typeof input !== "string") return "";
      debugLog("SANITIZE_CSS_START", `Input: "${input}"`);
      // Normalize line endings, then split only on semicolons
      // (newlines within a value like linear-gradient(...\n...) must be preserved)
      const normalized = String(input).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      // Split on semicolons only; collapse newlines inside values to spaces
      const parts = normalized
        .split(";")
        .map((s) => s.replace(/\n/g, " ").trim())
        .filter((s) => s.length > 0);
      const out = [];
      for (const p of parts) {
        const idx = p.indexOf(":");
        if (idx === -1) {
          debugLog("SANITIZE_CSS_SKIP", `No colon in: "${p}"`);
          continue;
        }
        const prop = p.slice(0, idx).trim().toLowerCase();
        let val = p.slice(idx + 1).trim();
        if (!/^[a-z\-]+$/.test(prop)) {
          debugLog("SANITIZE_CSS_SKIP", `Invalid prop name: "${prop}"`);
          continue;
        }

        // Remove !important if user added it, we will add it ourselves
        val = val.replace(/!important/gi, "").trim();

        // BLOCKLIST: skip declarations with dangerous value patterns
        const valLower = val.toLowerCase();
        if (
          valLower.includes("url(") ||
          valLower.includes("expression(") ||
          valLower.includes("javascript:") ||
          val.includes("<") ||
          val.includes(">")
        ) {
          debugLog("SANITIZE_CSS_SKIP", `Dangerous value for: "${prop}": "${val}"`);
          continue;
        }

        if (val.length === 0) {
          debugLog("SANITIZE_CSS_SKIP", `Empty value for: "${prop}"`);
          continue;
        }
        out.push(`${prop}: ${val}`);
      }
      const result = out.join("; ") + (out.length > 0 ? ";" : "");
      debugLog("SANITIZE_CSS_RESULT", `Output: "${result}"`);
      return result;
    } catch (e) {
      debugError("SANITIZE_CSS_ERROR", e);
      return "";
    }
  }

  applyCustomCssToElement(element, entry = null) {
    try {
      if (!this.settings || !this.settings.enableCustomCss) {
        debugLog("APPLY_CSS_SKIP", "Feature disabled");
        return;
      }
      if (!entry || !entry.customCss) {
        debugLog("APPLY_CSS_SKIP", "No entry or no customCss");
        return;
      }
      const decl = this.sanitizeCssDeclarations(entry.customCss);
      if (!decl) {
        debugLog("APPLY_CSS_SKIP", "Sanitized decl is empty");
        return;
      }

      debugLog("APPLY_CSS_START", `Applying to element: ${element.nodeName}, decl: ${decl}`);

      // Split declarations and apply them with !important
      const parts = decl
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const p of parts) {
        const idx = p.indexOf(":");
        if (idx === -1) continue;
        const prop = p.slice(0, idx).trim();
        const val = p.slice(idx + 1).trim();
        try {
          debugLog("APPLY_CSS_PROP", `Setting ${prop}: ${val}`);
          // Use setProperty with 'important' to override Obsidian's defaults
          element.style.setProperty(prop, val, "important");
        } catch (e) {
          debugLog("APPLY_CSS_FALLBACK", `Setting ${prop}: ${val} via fallback`);
          // Fallback if setProperty fails
          element.style[prop] = val;
        }
      }
    } catch (e) {
      debugError("APPLY_CSS_ERROR", e);
    }
  }

  // Helper: Generate border CSS string based on settings (border always uses text color)
  generateBorderStyle(textColor, backgroundColor) {
    const entry = arguments.length > 2 ? arguments[2] : null;
    const enable =
      entry && typeof entry.enableBorderThickness !== "undefined"
        ? !!entry.enableBorderThickness
        : !!this.settings.enableBorderThickness;
    if (this.settings.hideHighlights === true || !enable) {
      return "";
    }
    const borderThickness =
      entry && typeof entry.borderThickness === "number"
        ? entry.borderThickness
        : (this.settings.borderThickness ?? 1);
    const borderOpacity =
      entry && typeof entry.borderOpacity === "number"
        ? entry.borderOpacity
        : (this.settings.borderOpacity ?? 100);
    let borderColor;
    if (
      textColor &&
      textColor !== "currentColor" &&
      this.isValidHexColor(textColor)
    ) {
      borderColor = this.hexToRgba(textColor, borderOpacity);
    } else if (backgroundColor && this.isValidHexColor(backgroundColor)) {
      borderColor = this.hexToRgba(backgroundColor, borderOpacity);
    } else {
      borderColor = "rgba(0,0,0,1)";
    }
    const borderStyleType =
      entry && typeof entry.borderStyle === "string"
        ? entry.borderStyle
        : (this.settings.borderStyle ?? "full");
    const lineStyle =
      entry && typeof entry.borderLineStyle === "string"
        ? entry.borderLineStyle
        : (this.settings.borderLineStyle ?? "solid");
    const borderCSS = `${borderThickness}px ${lineStyle} ${borderColor} !important;`;
    switch (borderStyleType) {
      case "bottom":
        return ` border-bottom: ${borderCSS}`;
      case "top":
        return ` border-top: ${borderCSS}`;
      case "left":
        return ` border-left: ${borderCSS}`;
      case "right":
        return ` border-right: ${borderCSS}`;
      case "top-bottom":
        return ` border-top: ${borderCSS} border-bottom: ${borderCSS}`;
      case "left-right":
        return ` border-left: ${borderCSS} border-right: ${borderCSS}`;
      case "top-left-right":
        return ` border-top: ${borderCSS} border-left: ${borderCSS} border-right: ${borderCSS}`;
      case "bottom-left-right":
        return ` border-bottom: ${borderCSS} border-left: ${borderCSS} border-right: ${borderCSS}`;
      case "top-right":
        return ` border-top: ${borderCSS} border-right: ${borderCSS}`;
      case "top-left":
        return ` border-top: ${borderCSS} border-left: ${borderCSS}`;
      case "bottom-right":
        return ` border-bottom: ${borderCSS} border-right: ${borderCSS}`;
      case "bottom-left":
        return ` border-bottom: ${borderCSS} border-left: ${borderCSS}`;
      case "full":
      default:
        return ` border: ${borderCSS}`;
    }
  }
  getHighlightParams(entry) {
    const result = {
      opacity:
        entry && typeof entry.backgroundOpacity === "number"
          ? entry.backgroundOpacity
          : (this.settings.backgroundOpacity ?? 25),
      radius:
        entry && typeof entry.highlightBorderRadius === "number"
          ? entry.highlightBorderRadius
          : (this.settings.highlightBorderRadius ?? 8),
      hPad:
        entry && typeof entry.highlightHorizontalPadding === "number"
          ? entry.highlightHorizontalPadding
          : (this.settings.highlightHorizontalPadding ?? 4),
      vPad:
        entry && typeof entry.highlightVerticalPadding === "number"
          ? entry.highlightVerticalPadding
          : (this.settings.highlightVerticalPadding ?? 0),
      enableBorder:
        entry && typeof entry.enableBorderThickness !== "undefined"
          ? !!entry.enableBorderThickness
          : !!this.settings.enableBorderThickness,
      borderStyle:
        entry && typeof entry.borderStyle === "string"
          ? entry.borderStyle
          : (this.settings.borderStyle ?? "full"),
      borderLineStyle:
        entry && typeof entry.borderLineStyle === "string"
          ? entry.borderLineStyle
          : (this.settings.borderLineStyle ?? "solid"),
      borderOpacity:
        entry && typeof entry.borderOpacity === "number"
          ? entry.borderOpacity
          : (this.settings.borderOpacity ?? 100),
      borderThickness:
        entry && typeof entry.borderThickness === "number"
          ? entry.borderThickness
          : (this.settings.borderThickness ?? 1),
    };

    return result;
  }

  // Helper: Generate tooltip text explaining why text is colored
  getColoringReasonTooltip(match) {
    try {
      if (!match || !match.entry) return "";
      const entry = match.entry;
      const pattern = entry.pattern || "";
      const matchType = (
        entry.matchType || (this.settings.partialMatch ? "contains" : "exact")
      ).toLowerCase();

      if (matchType === "exact") {
        return `matches exactly "${pattern}"`;
      } else if (matchType === "contains") {
        return `contains "${pattern}"`;
      } else if (matchType === "startswith" || matchType === "starts with") {
        return `starts with "${pattern}"`;
      } else if (matchType === "endswith" || matchType === "ends with") {
        return `ends with "${pattern}"`;
      }

      return `matches "${pattern}"`;
    } catch (e) {
      return "";
    }
  }

  generateOnceBorderStyle(backgroundColor) {
    try {
      if (this.settings.hideHighlights === true) return "";
      if (!this.settings.quickHighlightEnableBorder) return "";
      const thickness = this.settings.quickHighlightBorderThickness ?? 1;
      const opacity = this.settings.quickHighlightBorderOpacity ?? 100;
      const borderColor = this.hexToRgba(backgroundColor, opacity);
      const type = this.settings.quickHighlightBorderStyle ?? "full";
      const lineStyle = this.settings.quickHighlightBorderLineStyle ?? "solid";
      const css = `${thickness}px ${lineStyle} ${borderColor}`;
      switch (type) {
        case "bottom":
          return ` border-bottom: ${css};`;
        case "top":
          return ` border-top: ${css};`;
        case "left":
          return ` border-left: ${css};`;
        case "right":
          return ` border-right: ${css};`;
        case "top-bottom":
          return ` border-top: ${css}; border-bottom: ${css};`;
        case "left-right":
          return ` border-left: ${css}; border-right: ${css};`;
        case "top-right":
          return ` border-top: ${css}; border-right: ${css};`;
        case "top-left":
          return ` border-top: ${css}; border-left: ${css};`;
        case "bottom-right":
          return ` border-bottom: ${css}; border-right: ${css};`;
        case "bottom-left":
          return ` border-bottom: ${css}; border-left: ${css};`;
        case "full":
        default:
          return ` border: ${css};`;
      }
    } catch (_) {
      return "";
    }
  }

  generateGlobalBorderStyle(backgroundColor) {
    try {
      if (this.settings.hideHighlights === true) return "";
      if (!this.settings.enableBorderThickness) return "";
      const thickness = this.settings.borderThickness ?? 1;
      const opacity = this.settings.borderOpacity ?? 100;
      const borderColor = this.hexToRgba(backgroundColor, opacity);
      const type = this.settings.borderStyle ?? "full";
      const lineStyle = this.settings.borderLineStyle ?? "solid";
      const css = `${thickness}px ${lineStyle} ${borderColor}`;
      switch (type) {
        case "bottom":
          return ` border-bottom: ${css};`;
        case "top":
          return ` border-top: ${css};`;
        case "left":
          return ` border-left: ${css};`;
        case "right":
          return ` border-right: ${css};`;
        case "top-bottom":
          return ` border-top: ${css}; border-bottom: ${css};`;
        case "left-right":
          return ` border-left: ${css}; border-right: ${css};`;
        case "top-right":
          return ` border-top: ${css}; border-right: ${css};`;
        case "top-left":
          return ` border-top: ${css}; border-left: ${css};`;
        case "bottom-right":
          return ` border-bottom: ${css}; border-right: ${css};`;
        case "bottom-left":
          return ` border-bottom: ${css}; border-left: ${css};`;
        case "full":
        default:
          return ` border: ${css};`;
      }
    } catch (_) {
      return "";
    }
  }

  async _applyQuickColorACT(
    selectedText,
    textColor,
    backgroundColor,
    view,
    styleEntry = null,
  ) {
    if (this.isWordBlacklisted(selectedText, view?.file?.path)) {
      new Notice(
        this.t(
          "notice_blacklisted_cannot_color",
          `"${selectedText}" is blacklisted and cannot be colored.`,
          { word: selectedText },
        ),
      );
      return;
    }
    if (!Array.isArray(this.settings.wordEntries))
      this.settings.wordEntries = [];
    const matchType = this.settings.partialMatch ? "contains" : "exact";
    const styleType =
      textColor && backgroundColor
        ? "both"
        : backgroundColor
          ? "highlight"
          : "text";
    const targetGroupUid =
      styleEntry && styleEntry.groupUid ? styleEntry.groupUid : null;
    const groupsList = Array.isArray(this.settings.wordEntryGroups)
      ? this.settings.wordEntryGroups
      : [];
    const targetGroup = targetGroupUid
      ? groupsList.find((g) => g && g.uid === targetGroupUid)
      : null;
    const matchesEntry = (a, b) => {
      if (!a || !b) return false;
      if (a.uid && b.uid) return String(a.uid) === String(b.uid);
      return (
        String(a.pattern || "") === String(b.pattern || "") &&
        !!a.isRegex === !!b.isRegex
      );
    };
    const applyStyleToEntry = (entry) => {
      entry.styleType = styleType;
      if (textColor) {
        entry.color = "";
        entry.textColor = textColor;
        entry._savedTextColor = textColor;
      }
      if (backgroundColor) {
        entry.backgroundColor = backgroundColor;
        entry._savedBackgroundColor = backgroundColor;
        entry.textColor = entry.textColor || "currentColor";
      }
      if (!entry.isRegex) entry.matchType = matchType;
      if (styleEntry) {
        if (styleEntry.groupUid) entry.groupUid = styleEntry.groupUid;
        if (styleEntry.matchType) entry.matchType = styleEntry.matchType;
        if (typeof styleEntry.backgroundOpacity === "number")
          entry.backgroundOpacity = styleEntry.backgroundOpacity;
        if (typeof styleEntry.highlightBorderRadius === "number")
          entry.highlightBorderRadius = styleEntry.highlightBorderRadius;
        if (typeof styleEntry.highlightHorizontalPadding === "number")
          entry.highlightHorizontalPadding =
            styleEntry.highlightHorizontalPadding;
        if (typeof styleEntry.highlightVerticalPadding === "number")
          entry.highlightVerticalPadding = styleEntry.highlightVerticalPadding;
        if (typeof styleEntry.enableBorderThickness !== "undefined")
          entry.enableBorderThickness = styleEntry.enableBorderThickness;
        if (styleEntry.borderStyle) entry.borderStyle = styleEntry.borderStyle;
        if (styleEntry.borderLineStyle)
          entry.borderLineStyle = styleEntry.borderLineStyle;
        if (typeof styleEntry.borderOpacity === "number")
          entry.borderOpacity = styleEntry.borderOpacity;
        if (typeof styleEntry.borderThickness === "number")
          entry.borderThickness = styleEntry.borderThickness;
      }
    };
    const removeFromAllGroups = (entry) => {
      for (const g of groupsList) {
        if (!g || !Array.isArray(g.entries) || g.entries.length === 0) continue;
        for (let i = g.entries.length - 1; i >= 0; i--) {
          if (matchesEntry(g.entries[i], entry)) g.entries.splice(i, 1);
        }
      }
    };
    const removeFromWordEntries = (entry) => {
      if (
        !Array.isArray(this.settings.wordEntries) ||
        this.settings.wordEntries.length === 0
      )
        return;
      for (let i = this.settings.wordEntries.length - 1; i >= 0; i--) {
        if (matchesEntry(this.settings.wordEntries[i], entry))
          this.settings.wordEntries.splice(i, 1);
      }
    };
    const findInGroups = () => {
      for (const g of groupsList) {
        if (!g || !Array.isArray(g.entries)) continue;
        const idx = g.entries.findIndex(
          (e) => e && e.pattern === selectedText && !e.isRegex,
        );
        if (idx !== -1) return { group: g, idx, entry: g.entries[idx] };
      }
      return null;
    };

    const idx = this.settings.wordEntries.findIndex(
      (e) => e && e.pattern === selectedText && !e.isRegex,
    );
    let existing = null;
    let existingSource = null;
    if (idx !== -1) {
      existing = this.settings.wordEntries[idx];
      existingSource = { type: "wordEntries", idx };
    } else {
      const gFound = findInGroups();
      if (gFound && gFound.entry) {
        existing = gFound.entry;
        existingSource = {
          type: "group",
          group: gFound.group,
          idx: gFound.idx,
        };
      }
    }

    if (existing) {
      applyStyleToEntry(existing);
      if (targetGroup) {
        removeFromWordEntries(existing);
        removeFromAllGroups(existing);
        if (!Array.isArray(targetGroup.entries)) targetGroup.entries = [];
        targetGroup.entries.push(existing);
      } else {
        removeFromAllGroups(existing);
        if (!existingSource || existingSource.type !== "wordEntries") {
          removeFromWordEntries(existing);
          this.settings.wordEntries.push(existing);
        }
      }
    } else {
      const newEntry = {
        pattern: selectedText,
        isRegex: false,
        flags: "",
        matchType,
        styleType,
      };
      if (styleType === "text") {
        newEntry.color = textColor;
        newEntry._savedTextColor = textColor;
      } else if (styleType === "highlight") {
        newEntry.color = "";
        newEntry.textColor = "currentColor";
        newEntry.backgroundColor = backgroundColor;
        newEntry._savedBackgroundColor = backgroundColor;
      } else {
        newEntry.color = "";
        newEntry.textColor = textColor;
        newEntry.backgroundColor = backgroundColor;
        newEntry._savedTextColor = textColor;
        newEntry._savedBackgroundColor = backgroundColor;
      }
      if (styleEntry) {
        if (styleEntry.groupUid) newEntry.groupUid = styleEntry.groupUid;
        if (styleEntry.matchType) newEntry.matchType = styleEntry.matchType;
        if (typeof styleEntry.backgroundOpacity === "number")
          newEntry.backgroundOpacity = styleEntry.backgroundOpacity;
        if (typeof styleEntry.highlightBorderRadius === "number")
          newEntry.highlightBorderRadius = styleEntry.highlightBorderRadius;
        if (typeof styleEntry.highlightHorizontalPadding === "number")
          newEntry.highlightHorizontalPadding =
            styleEntry.highlightHorizontalPadding;
        if (typeof styleEntry.highlightVerticalPadding === "number")
          newEntry.highlightVerticalPadding =
            styleEntry.highlightVerticalPadding;
        if (typeof styleEntry.enableBorderThickness !== "undefined")
          newEntry.enableBorderThickness = styleEntry.enableBorderThickness;
        if (styleEntry.borderStyle)
          newEntry.borderStyle = styleEntry.borderStyle;
        if (styleEntry.borderLineStyle)
          newEntry.borderLineStyle = styleEntry.borderLineStyle;
        if (typeof styleEntry.borderOpacity === "number")
          newEntry.borderOpacity = styleEntry.borderOpacity;
        if (typeof styleEntry.borderThickness === "number")
          newEntry.borderThickness = styleEntry.borderThickness;
      }
      if (targetGroup) {
        if (!Array.isArray(targetGroup.entries)) targetGroup.entries = [];
        targetGroup.entries.push(newEntry);
      } else {
        this.settings.wordEntries.push(newEntry);
      }
    }
    await this.saveSettings();
    this.compileWordEntries();
    this.compileTextBgColoringEntries();
    this.reconfigureEditorExtensions();
    this.refreshEditor(view, true);
  }

  async _applyQuickStyleToSelection(
    style,
    selectedPair,
    selectedText,
    editor,
    view,
    forceInline = false,
  ) {
    const styleType = style && style.styleType ? style.styleType : "both";
    const tc =
      selectedPair && selectedPair.textColor
        ? selectedPair.textColor
        : style.textColor || style.color || null;
    const bc =
      selectedPair && selectedPair.backgroundColor
        ? selectedPair.backgroundColor
        : style.backgroundColor || null;
    if (this.settings.quickColorsApplyMode === "act" && !forceInline) {
      // When using ACT mode, pass the style object so custom settings are preserved
      await this._applyQuickColorACT(
        selectedText,
        styleType === "text" ? tc : styleType === "both" ? tc : null,
        styleType === "highlight" ? bc : styleType === "both" ? bc : null,
        view,
        style,
      );
      return;
    }
    const params = this.getHighlightParams(style);
    const borderCss = this.generateBorderStyle(tc, bc, style);
    if (styleType === "text") {
      const html = `<span style="color: ${tc || ""}">${selectedText}</span>`;
      editor.replaceSelection(html);
      return;
    }
    if (styleType === "highlight") {
      const bg = bc ? this.hexToHexWithAlpha(bc, params.opacity ?? 25) : null;
      const styleStr = `${bg ? `background-color: ${bg}; ` : ""}border-radius: ${params.radius ?? 8}px; padding: ${params.vPad ?? 0}px ${params.hPad ?? 4}px;${borderCss} box-decoration-break: clone; -webkit-box-decoration-break: clone;`;
      const html = `<span class="always-color-text-highlight" style="${styleStr}">${selectedText}</span>`;
      editor.replaceSelection(html);
      return;
    }
    // both
    const bg = bc ? this.hexToHexWithAlpha(bc, params.opacity ?? 25) : null;
    let styleStr = "";
    if (tc) styleStr += `color: ${tc}; `;
    if (bg) styleStr += `background-color: ${bg}; `;
    styleStr += `border-radius: ${params.radius ?? 8}px; padding: ${params.vPad ?? 0}px ${params.hPad ?? 4}px;${borderCss} box-decoration-break: clone; -webkit-box-decoration-break: clone;`;
    const html = `<span style="${styleStr}">${selectedText}</span>`;
    editor.replaceSelection(html);
  }

  // Helper: Extract color and background from selected HTML text in editor
  extractSelectedTextStyles(selectedText) {
    try {
      // If selectedText is plain text, no styles to extract
      if (!selectedText || typeof selectedText !== "string") {
        return { textColor: null, backgroundColor: null };
      }

      // Check if it contains HTML span with style attribute
      // Looking for patterns like <span style="...color: #XXXXXX...">
      const spanMatch = selectedText.match(
        /<span\s+(?:class="[^"]*"\s+)?style="([^"]*)"/i,
      );
      if (!spanMatch || !spanMatch[1]) {
        return { textColor: null, backgroundColor: null };
      }

      const styleString = spanMatch[1];
      let textColor = null;
      let backgroundColor = null;

      // Extract color: (hex, rgb, rgba, or named color)
      const colorMatch = styleString.match(
        /color\s*:\s*(#[0-9A-Fa-f]{3,6}|rgb\([^)]*\)|rgba\([^)]*\)|[a-z]+)/i,
      );
      if (colorMatch && colorMatch[1]) {
        const colorValue = colorMatch[1].trim();
        // Only accept hex colors for consistency
        if (/^#[0-9A-Fa-f]{3,6}$/.test(colorValue)) {
          textColor = colorValue;
        }
      }

      // Extract background-color: (hex, rgb, rgba, or named color)
      const bgMatch = styleString.match(
        /background-color\s*:\s*(#[0-9A-Fa-f]{3,6}|rgb\([^)]*\)|rgba\([^)]*\)|[a-z]+)/i,
      );
      if (bgMatch && bgMatch[1]) {
        const bgValue = bgMatch[1].trim();
        // Only accept hex colors for consistency
        if (/^#[0-9A-Fa-f]{3,6}$/.test(bgValue)) {
          backgroundColor = bgValue;
        }
      }

      return { textColor, backgroundColor };
    } catch (e) {
      debugError("EXTRACT_STYLES", e);
      return { textColor: null, backgroundColor: null };
    }
  }

  // Helper: Check frontmatter for disabling coloring (`always-color-text: false` disables)
  isFrontmatterColoringDisabled(source) {
    if (!source) return false;
    const { TFile } = require("obsidian");
    let file = null;
    if (typeof source === "string") {
      file = this.app.vault.getAbstractFileByPath(source);
    } else if (source instanceof TFile) {
      file = source;
    } else if (source.path) {
      file = source;
    }
    if (!file) return false;
    const cache = this.app.metadataCache.getFileCache(file);
    if (!cache || !cache.frontmatter) return false;
    // If frontmatter sets always-color-text: false -> disable
    if (
      Object.prototype.hasOwnProperty.call(
        cache.frontmatter,
        "always-color-text",
      )
    ) {
      return cache.frontmatter["always-color-text"] === false;
    }
    return false;
  }

  // --- Helper: RegExp Folder Pattern ---
  normalizePath(p) {
    return String(p || "").replace(/\\/g, "/");
  }
  _folderPatternToRegExp(p) {
    const raw = this.normalizePath(p).replace(/\/$/, "");
    const esc = raw.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    const re = "^" + esc.replace(/\*/g, ".*") + "(?:\/.*)?$";
    try {
      return new RegExp(re);
    } catch (e) {
      return null;
    }
  }
  _pathPatternToRegExp(p) {
    const raw = this.normalizePath(p);
    const esc = raw.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    const re = "^" + esc.replace(/\*/g, ".*") + "$";
    try {
      return new RegExp(re);
    } catch (e) {
      return null;
    }
  }
  _basename(p) {
    const fp = this.normalizePath(p);
    const idx = fp.lastIndexOf("/");
    return idx === -1 ? fp : fp.slice(idx + 1);
  }
  _parentFolders(p) {
    const fp = this.normalizePath(p);
    const parts = fp.split("/");
    parts.pop();
    const res = [];
    let acc = "";
    for (const part of parts) {
      acc = acc ? acc + "/" + part : part;
      res.push(acc);
    }
    return res;
  }
  detectRuleTarget(path, matchType) {
    const s = String(path || "");
    const hasSlash = s.includes("/");
    const endsWithSlash = /\/$/.test(s);
    const hasStarSlash = s.includes("*/");
    const hasExt = /\.[a-zA-Z0-9]+$/.test(s);
    const hasStarDotStar = s.includes("*.*");
    if (matchType === "exact") {
      if (endsWithSlash || hasStarSlash) return "folder";
      if (hasExt || hasStarDotStar) return "file";
      return hasSlash ? "folder" : "file";
    }
    if (matchType === "regex") {
      return "both";
    }
    if (matchType === "has-name") {
      return "both";
    }
    return "both";
  }
  detectRuleKind(path) {
    const s = String(path || "").trim();
    if (!s) return { kind: "vault" };
    if (s.startsWith("#")) return { kind: "tag", tag: s.slice(1) };
    const isParenRegex = s.startsWith("(") && s.endsWith(")");
    if (isParenRegex) return { kind: "regex", pattern: s.slice(1, -1) };
    if (/\/$/.test(s))
      return { kind: "exact-folder", path: s.replace(/\/$/, "") };
    if (s.includes("/")) return { kind: "exact-file", path: s };
    return { kind: "name", name: s };
  }
  _matchesByName(filePath, name) {
    const fp = this.normalizePath(filePath);
    const nm = String(name || "").trim();
    if (!nm) return { fileMatch: true, folderMatch: true };
    const base = this._basename(fp);
    const stem = base.replace(/\.[^/.]+$/, "");
    const fileMatch = base === nm || stem === nm;
    let folderMatch = false;
    const parents = this._parentFolders(fp);
    for (const folder of parents) {
      if (this._basename(folder) === nm) {
        folderMatch = true;
        break;
      }
    }
    return { fileMatch, folderMatch };
  }
  _matchFolder(pattern, filePath) {
    const fp = this.normalizePath(filePath);
    const re = this._folderPatternToRegExp(pattern);
    return !!(re && re.test(fp));
  }
  _matchFile(rulePath, filePath) {
    const a = this.normalizePath(rulePath);
    const b = this.normalizePath(filePath);
    return a === b;
  }
  evaluatePathRules(filePath) {
    return evaluatePathRulesLogic(
      filePath,
      this.settings,
      this._pathRulesCache,
      (p) => this.normalizePath(p),
      (p) => this._parentFolders(p),
      (p) => this.detectRuleKind(p),
      (fp, name) => this._matchesByName(fp, name),
      (fp) => this.getFileTags(fp),
      (rulePath, fp) => this._matchFile(rulePath, fp),
    );
  }

  // Advanced Rules: filter word entries based on file/folder path rules
  // CLEAR RULE ENGINE: Apply your four rules in strict order
  // Rule 1: Folder excluded? → No files in folder get colored
  // Rule 2: File explicitly included in excluded folder? → File gets colored
  // Rule 3: Text "only colors in" this file/folder? → Color only here
  // Rule 4: Text "does not color in" this file/folder? → Don't color here
  shouldColorText(filePath, textPattern, entry = null) {
    try {
      if (!filePath || !textPattern) return true;

      const fp = this.normalizePath(filePath);

      // Check group-level folder/tag restrictions if entry belongs to a group
      if (entry) {
        const enableFolders = Array.isArray(entry.groupEnableFolders)
          ? entry.groupEnableFolders
          : [];
        const disableFolders = Array.isArray(entry.groupDisableFolders)
          ? entry.groupDisableFolders
          : [];
        const hasEnableFolders = enableFolders.length > 0;
        const hasDisableFolders = disableFolders.length > 0;

        let folderDecision = 0; // 0: Neutral, 1: Allowed, -1: Denied
        if (hasEnableFolders || hasDisableFolders) {
          const parents = this._parentFolders(fp).map((p) =>
            this.normalizePath(p),
          );
          const normRule = (p) => {
            const n = this.normalizePath(String(p || "").trim());
            if (n === "/") return "/";
            return n.replace(/\/$/, "");
          };

          let enableMatch = false;
          let disableMatch = false;
          let bestEnableDepth = -1;
          let bestDisableDepth = -1;

          for (const f of enableFolders) {
            const fNorm = normRule(f);
            if (!fNorm) continue;
            if (fNorm === "/" || fNorm === "") {
              enableMatch = true;
              if (bestEnableDepth < 0) bestEnableDepth = 0;
              continue;
            }
            const matchParent = parents.find((p) => p === fNorm);
            if (matchParent) {
              enableMatch = true;
              const depth = matchParent.split("/").length;
              if (depth > bestEnableDepth) bestEnableDepth = depth;
            }
          }

          for (const f of disableFolders) {
            const fNorm = normRule(f);
            if (!fNorm) continue;
            if (fNorm === "/" || fNorm === "") {
              disableMatch = true;
              if (bestDisableDepth < 0) bestDisableDepth = 0;
              continue;
            }
            const matchParent = parents.find((p) => p === fNorm);
            if (matchParent) {
              disableMatch = true;
              const depth = matchParent.split("/").length;
              if (depth > bestDisableDepth) bestDisableDepth = depth;
            }
          }

          if (!enableMatch && !disableMatch) {
            if (hasEnableFolders) folderDecision = -1; // Implicit deny
          } else if (enableMatch && disableMatch) {
            if (bestDisableDepth > bestEnableDepth) folderDecision = -1;
            else folderDecision = 1;
          } else if (!enableMatch && disableMatch) {
            folderDecision = -1;
          } else if (enableMatch && !disableMatch) {
            folderDecision = 1;
          }
        }

        const hasEnableTags =
          Array.isArray(entry.groupEnableTags) &&
          entry.groupEnableTags.length > 0;
        const hasDisableTags =
          Array.isArray(entry.groupDisableTags) &&
          entry.groupDisableTags.length > 0;

        let tagDecision = 0; // 0: Neutral, 1: Allowed, -1: Denied
        if (hasEnableTags || hasDisableTags) {
          const fileTags = this.getFileTags(filePath);
          const normTag = (t) =>
            String(t || "")
              .replace(/^#/, "")
              .trim();
          const enableTags = hasEnableTags
            ? entry.groupEnableTags.map(normTag).filter(Boolean)
            : [];
          const disableTags = hasDisableTags
            ? entry.groupDisableTags.map(normTag).filter(Boolean)
            : [];

          const enableMatchTag =
            enableTags.length > 0 &&
            fileTags.some((t) => enableTags.includes(normTag(t)));
          const disableMatchTag =
            disableTags.length > 0 &&
            fileTags.some((t) => disableTags.includes(normTag(t)));

          if (enableTags.length > 0 && !enableMatchTag) {
            tagDecision = -1; // Implicit deny
          }

          if (disableMatchTag) tagDecision = -1;
          if (enableMatchTag) tagDecision = 1; // Explicit allow overrides explicit deny (matches legacy behavior)
        }

        // OR Logic for Enabling: If EITHER is explicitly allowed, allow it.
        if (folderDecision === 1 || tagDecision === 1) {
          // Allow (return true implied, but we must not return false here)
        } else if (folderDecision === -1 || tagDecision === -1) {
          return false;
        }
      }

      const pathRules = Array.isArray(this.settings.pathRules)
        ? this.settings.pathRules
        : [];
      const advRules = Array.isArray(this.settings.advancedRules)
        ? this.settings.advancedRules
        : [];
      const caseInsensitive = !this.settings.caseSensitive;

      // DEBUG: Log when checking "belmo"
      if (String(textPattern).includes("belmo")) {
        debugLog(
          "RULE_CHECK_BELMO",
          `Checking pattern "${textPattern}" in file "${filePath}"`,
        );
        debugLog("RULE_CHECK_BELMO", `advRules count: ${advRules.length}`);
        advRules.forEach((r, i) => {
          debugLog(
            "RULE_CHECK_BELMO",
            `Rule ${i}: text="${r.text}" mode="${r.mode}" path="${r.path}"`,
          );
        });
      }

      // Helper: Check if text matches a rule pattern
      const textMatches = (rule, pattern) => {
        const ruleText = String(rule.text || "").trim();
        if (!ruleText) return false;

        const patternStr = String(pattern).trim();

        // If rule is regex, compare as strings (both are regex patterns)
        if (rule.isRegex) {
          if (caseInsensitive) {
            return ruleText.toLowerCase() === patternStr.toLowerCase();
          } else {
            return ruleText === patternStr;
          }
        }

        // For non-regex rules, do case-sensitive or insensitive comparison
        if (caseInsensitive) {
          return ruleText.toLowerCase() === patternStr.toLowerCase();
        } else {
          return ruleText === patternStr;
        }
      };

      // Helper: Check if path matches a rule path
      const pathMatches = (rule) => {
        const pathStr = String(rule.path || "").trim();
        if (pathStr.length === 0) return true; // vault-wide
        const dk = this.detectRuleKind(pathStr);
        if (dk.kind === "tag") {
          const tags = this.getFileTags(filePath).map((t) =>
            t.replace(/^#/, ""),
          );
          if (tags.includes(String(dk.tag || "").replace(/^#/, "")))
            return "file";
          return null;
        }
        if (dk.kind === "name") {
          const { fileMatch, folderMatch } = this._matchesByName(fp, dk.name);
          return fileMatch || folderMatch;
        }
        if (dk.kind === "exact-file") return this._matchFile(dk.path, fp);
        if (dk.kind === "exact-folder") {
          const parents = this._parentFolders(fp);
          for (const p of parents) {
            if (this.normalizePath(p) === this.normalizePath(dk.path))
              return true;
          }
          return false;
        }
        if (dk.kind === "regex") {
          try {
            const re = new RegExp(dk.pattern);
            if (re.test(fp)) return true;
            const parents = this._parentFolders(fp);
            for (const p of parents) {
              if (re.test(p)) return true;
            }
          } catch (e) {
            return false;
          }
        }
        return false;
      };

      // RULE 1: Folder excluded? → No files in folder get colored
      // RULE 2: File explicitly included in excluded folder? → File gets colored
      // Note: evaluatePathRules already handles the precedence of File Rules > Folder Rules
      const pathEval = this.evaluatePathRules(filePath);

      if (pathEval.excluded) {
        debugLog("RULE_ENGINE", `Skipping: path excluded for ${filePath}`);
        return false;
      }

      const matchType = (rule) => {
        const pathStr = String(rule.path || "").trim();
        if (pathStr.length === 0) return "vault";
        const dk = this.detectRuleKind(pathStr);
        if (dk.kind === "tag") {
          const tags = this.getFileTags(filePath).map((t) =>
            t.replace(/^#/, ""),
          );
          if (tags.includes(String(dk.tag || "").replace(/^#/, "")))
            return "file";
          return null;
        }
        if (dk.kind === "name") {
          const { fileMatch, folderMatch } = this._matchesByName(fp, dk.name);
          if (fileMatch) return "file";
          if (folderMatch) return "folder";
          return null;
        }
        if (dk.kind === "exact-file")
          return this._matchFile(dk.path, fp) ? "file" : null;
        if (dk.kind === "exact-folder") {
          const parents = this._parentFolders(fp);
          for (const p of parents) {
            if (this.normalizePath(p) === this.normalizePath(dk.path))
              return "folder";
          }
          return null;
        }
        if (dk.kind === "regex") {
          try {
            const re = new RegExp(dk.pattern);
            if (re.test(fp)) return "file";
            const parents = this._parentFolders(fp);
            for (const p of parents) {
              if (re.test(p)) return "folder";
            }
          } catch (e) {
            return null;
          }
        }
        return null;
      };

      const perEntryInclude =
        entry && Array.isArray(entry.inclusionRules)
          ? entry.inclusionRules
          : [];
      const perEntryExclude =
        entry && Array.isArray(entry.exclusionRules)
          ? entry.exclusionRules
          : [];
      const globalInclude = advRules
        .filter((r) => r && r.mode === "include" && textMatches(r, textPattern))
        .map((r) => ({ path: r.path, isRegex: r.isRegex, flags: r.flags }));
      const globalExclude = advRules
        .filter((r) => r && r.mode === "exclude" && textMatches(r, textPattern))
        .map((r) => ({ path: r.path, isRegex: r.isRegex, flags: r.flags }));

      const includeRules = [...perEntryInclude, ...globalInclude];
      const excludeRules = [...perEntryExclude, ...globalExclude];

      const includeMatches = includeRules
        .map((r) => matchType(r))
        .filter((t) => t);
      const hasIncludeRules = includeRules.length > 0;
      const includeMatched = includeMatches.length > 0;
      const hasFileInclude = includeMatches.includes("file");

      if (hasIncludeRules && !includeMatched) {
        debugLog(
          "RULE_ENGINE",
          `Skipping: text "${textPattern}" only colors elsewhere`,
        );
        return false;
      }

      const excludeMatches = excludeRules
        .map((r) => matchType(r))
        .filter((t) => t);
      const hasFileExclude = excludeMatches.includes("file");
      const hasFolderOrVaultExclude =
        excludeMatches.includes("folder") || excludeMatches.includes("vault");

      if (hasFileExclude) {
        debugLog(
          "RULE_ENGINE",
          `Skipping: text "${textPattern}" does not color in this file`,
        );
        return false;
      }
      if (hasFolderOrVaultExclude && !hasFileInclude) {
        debugLog(
          "RULE_ENGINE",
          `Skipping: text "${textPattern}" does not color here due to folder/vault rule`,
        );
        return false;
      }

      // No rules prevent coloring
      // debugLog('RULE_ENGINE', `Allowing: text "${textPattern}" in ${filePath}`);
      return true;
    } catch (e) {
      debugError("RULE_ENGINE", "Error in shouldColorText", e);
      return true; // Default: allow coloring on error
    }
  }

  // Filter entries based on the four rules using shouldColorText
  filterEntriesByAdvancedRules(filePath, entries) {
    try {
      if (!filePath || !Array.isArray(entries) || entries.length === 0)
        return entries;

      const filtered = entries.filter((entry) => {
        if (!entry || !entry.pattern) return true;
        return this.shouldColorText(filePath, entry.pattern, entry);
      });

      return filtered;
    } catch (e) {
      return entries;
    }
  }

  hasGlobalExclude() {
    return hasGlobalExcludeLogic(this.settings);
  }

  getFileTags(filePath) {
    try {
      const af = this.app.vault.getAbstractFileByPath(filePath);
      if (!af) return [];
      const cache = this.app.metadataCache.getFileCache(af);
      if (!cache) return [];

      const tags = new Set();
      const normalize = (t) =>
        String(t || "")
          .replace(/^#/, "")
          .trim();

      // Frontmatter tags
      const raw = cache.frontmatter?.tags;
      if (Array.isArray(raw)) {
        raw.forEach((t) => tags.add(normalize(t)));
      } else if (typeof raw === "string") {
        raw.split(",").forEach((t) => tags.add(normalize(t)));
      }

      // Inline tags
      if (Array.isArray(cache.tags)) {
        cache.tags.forEach((t) => tags.add(normalize(t.tag)));
      }

      return Array.from(tags).filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  // Return the most specific folder rule that matches filePath, or null
  getBestFolderEntry(filePath) {
    return getBestFolderEntryLogic(
      filePath,
      this.settings,
      (p) => this.normalizePath(p),
      (p) => this._parentFolders(p),
      (p) => this.detectRuleKind(p),
      (p) => this._basename(p),
    );
  }

  // Check for known problematic patterns that should be blocked
  isKnownProblematicPattern(pattern) {
    if (!pattern || typeof pattern !== "string") return false;

    const p = pattern.trim();

    // Hard-blocked literal patterns (exact matches after whitespace normalization)
    const hardBlocked = [
      '"[^" ]*"',
      "'[^' ]*'",
      "(.*)*",
      "(.+)+",
      "(a*)*",
      "^(.|\\n)*?$",
      "\\b\\w{1,15}\\b\\s+\\b\\w{1,15}\\b\\s+\\b\\w{1,15}\\b",
    ];

    const normalize = (s) => String(s || "").replace(/\s/g, "");
    if (hardBlocked.some((h) => normalize(h) === normalize(p))) return true;

    // Quick syntactic checks
    if (/\(\?[=!<]/.test(p)) return true; // lookarounds
    if (p.includes("*.*") || p.includes("+.+")) return true;

    // Fallback list of known-dangerous patterns (keep previous list short and conservative)
    const dangerousPatterns = [
      '"[^"]*"',
      "'[^']*'",
      '"(?:[^"\\]|\\\\.)*"',
      "'(?:[^'\\\\]|\\\\.)*'",
      "\\b\\d{4}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)-\\d{1,2}\\b",
      "(\\w+)*\\s+",
      "([a-z]+)*\\d+",
      "(a*)*b",
      "(a+)*b",
      "(\\w+)\\1+",
      "(\\w+)(\\1){3,}",
      "(?:\\w+|\\d+)*\\s+",
      "(?:[a-z]*|[0-9]*)*",
      "^(a|a?)+$",
      "^(a|aa)+$",
      "^(.*a){10}.*$",
      "\\((?:[^()\\]|\\([^()]*\\))*\\)",
      "\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}",
    ];

    return dangerousPatterns.some((d) => normalize(d) === normalize(p));
  }

  // Compile word entries into runtime structures (regexes, testRegex, validity)
  compileWordEntries() {
    return compileWordEntriesLogic(this);
  }

  // Compile text + background coloring entries
  compileTextBgColoringEntries() {
    return compileTextBgColoringEntriesLogic(this);
  }

  // OPTIMIZATION: Pre-compile word pattern regexes for extreme performance
  // This builds lookup table for quick pattern matching without recreating RegExp
  compileWordPatterns() {
    try {
      this._compiledWordPatterns = {};
      const entries = Array.isArray(this._compiledWordEntries)
        ? this._compiledWordEntries
        : [];

      for (const entry of entries) {
        if (!entry || entry.invalid || !entry.regex) continue;

        // Create unique key for this pattern
        const key = `${entry.pattern}::${entry.flags || ""}`;

        // Store pre-compiled regex for reuse
        this._compiledWordPatterns[key] = {
          regex: entry.regex,
          pattern: entry.pattern,
          flags: entry.flags,
          entry,
        };
      }

      this._wordPatternsCompilationDirty = false;
      debugLog(
        "COMPILE_WORD_PATTERNS",
        `Compiled ${Object.keys(this._compiledWordPatterns).length} word patterns`,
      );
    } catch (e) {
      debugError("COMPILE_WORD_PATTERNS", "Failed to compile word patterns", e);
    }
  }

  // OPTIMIZATION: Pre-compile text+bg pattern regexes for extreme performance
  compileTextBgPatterns() {
    try {
      this._compiledTextBgPatterns = {};
      const entries = Array.isArray(this._compiledTextBgEntries)
        ? this._compiledTextBgEntries
        : [];

      for (const entry of entries) {
        if (!entry || entry.invalid || !entry.regex) continue;

        // Create unique key for this pattern
        const key = `${entry.pattern}::${entry.flags || ""}`;

        // Store pre-compiled regex for reuse
        this._compiledTextBgPatterns[key] = {
          regex: entry.regex,
          pattern: entry.pattern,
          flags: entry.flags,
          entry,
        };
      }

      this._textBgPatternsCompilationDirty = false;
      debugLog(
        "COMPILE_TEXTBG_PATTERNS",
        `Compiled ${Object.keys(this._compiledTextBgPatterns).length} text+bg patterns`,
      );
    } catch (e) {
      debugError(
        "COMPILE_TEXTBG_PATTERNS",
        "Failed to compile text+bg patterns",
        e,
      );
    }
  }

  // OPTIMIZATION: Pre-compile blacklist regexes for performance
  // This avoids creating new RegExp objects on every blacklist check
  compileBlacklistEntries() {
    return compileBlacklistEntriesLogic(this);
  }

  // NEW METHOD: Apply highlights to specific HTML elements (for logic-based coloring)
  applyElementHighlights(el, entries, folderEntry = null) {
    if (!el || !entries || entries.length === 0) return;

    for (const entry of entries) {
      if (!entry || !entry.targetElement) continue;

      // Map targetElement to selector if needed, or use as is
      let selector = entry.targetElement;
      if (selector === "strong-em") selector = "strong > em, em > strong";

      let elements;
      try {
        elements = el.querySelectorAll(selector);
      } catch (e) {
        continue;
      }
      if (elements.length === 0) continue;

      const textColor =
        entry.textColor && entry.textColor !== "currentColor"
          ? entry.textColor
          : entry.color || null;
      const backgroundColor = entry.backgroundColor || null;

      // Determine effective colors
      const finalTextColor =
        folderEntry && folderEntry.defaultColor
          ? folderEntry.defaultColor
          : textColor;

      const hideText = this.settings.hideTextColors === true;
      const hideBg = this.settings.hideHighlights === true;

      for (const element of elements) {
        // Apply text color
        if (!hideText && finalTextColor) {
          element.style.setProperty("color", finalTextColor, "important");
          element.style.setProperty("--highlight-color", finalTextColor);
        }

        // Apply background color
        if (!hideBg && backgroundColor) {
          const params = this.getHighlightParams(entry);
          const bgRgba = this.hexToRgba(backgroundColor, params.opacity);

          element.style.setProperty("background-color", bgRgba, "important");
          element.style.setProperty(
            "border-radius",
            params.radius + "px",
            "important",
          );
          element.style.setProperty(
            "padding-left",
            params.hPad + "px",
            "important",
          );
          element.style.setProperty(
            "padding-right",
            params.hPad + "px",
            "important",
          );

          const vPad = params.vPad;
          if (vPad >= 0) {
            element.style.setProperty("padding-top", vPad + "px", "important");
            element.style.setProperty(
              "padding-bottom",
              vPad + "px",
              "important",
            );
          } else {
            element.style.setProperty("padding-top", "0px", "important");
            element.style.setProperty("padding-bottom", "0px", "important");
            element.style.setProperty("margin-top", vPad + "px", "important");
            element.style.setProperty(
              "margin-bottom",
              vPad + "px",
              "important",
            );
          }

          if (this.settings.enableBoxDecorationBreak ?? true) {
            element.style.boxDecorationBreak = "clone";
            element.style.WebkitBoxDecorationBreak = "clone";
          }
        }
      }
    }
  }

  // Apply Highlights in Reading View (Markdown Post Processor) - optional folderEntry may override match colors
  applyHighlights(el, folderEntry = null, options = {}) {
    const entries =
      options && Array.isArray(options.entries)
        ? options.entries
        : this.getSortedWordEntries();
    if (entries.length === 0) return;
    // Ensure element is attached to document (isConnected is more reliable than offsetParent)
    if (!el.isConnected) return;

    // Split entries into element-targeted and regex-based
    const elementEntries = entries.filter((e) => e && e.targetElement);
    const regexEntries = entries.filter((e) => e && !e.targetElement);

    // Apply element-targeted highlights first
    if (elementEntries.length > 0) {
      this.applyElementHighlights(el, elementEntries, folderEntry);
    }

    // Continue with regex-based highlights
    if (regexEntries.length > 0) {
      // options: immediateBlocks, skipFirstN, clearExisting
      this._wrapMatchesRecursive(el, regexEntries, folderEntry, options || {});
    }
  }

  // NEW METHOD: Apply highlights for simple patterns (ultra-fast version)
  applySimpleHighlights(textNode, matches, text, filePath = null) {
    if (!matches || matches.length === 0) return;
    // Guard: if this text node is already within a highlight span, skip to avoid nested spans
    try {
      if (textNode.parentElement?.closest(".always-color-text-highlight"))
        return;
    } catch (_) {}
    const decodedText = this.decodeHtmlEntities(text);
    // Filter out matches that fall inside blacklisted contexts (e.g., @username)
    try {
      const filtered = [];
      for (const m of matches) {
        if (this.isContextBlacklisted(decodedText, m.start, m.end, filePath))
          continue;
        filtered.push(m);
      }
      matches = filtered;
      if (matches.length === 0) return;
    } catch (_) {}

    // Sort matches by start position and remove overlaps
    matches.sort((a, b) => a.start - b.start);

    const nonOverlapping = [];
    for (const m of matches) {
      let overlaps = false;
      const overlappingIndices = [];
      for (let i = 0; i < nonOverlapping.length; i++) {
        const existing = nonOverlapping[i];
        if (m.start < existing.end && m.end > existing.start) {
          overlaps = true;
          overlappingIndices.push(i);
        }
      }
      if (!overlaps) {
        nonOverlapping.push(m);
      } else {
        // Check if the new match is longer than ALL overlapping matches
        // If so, remove the overlapping ones and add this longer match instead
        const mLength = m.end - m.start;
        const allShorter = overlappingIndices.every((i) => {
          const existing = nonOverlapping[i];
          return existing.end - existing.start < mLength;
        });

        if (allShorter) {
          // Remove overlapping matches in reverse order to maintain indices
          for (let i = overlappingIndices.length - 1; i >= 0; i--) {
            nonOverlapping.splice(overlappingIndices[i], 1);
          }
          nonOverlapping.push(m);
        }
      }
    }

    const frag = document.createDocumentFragment();
    let pos = 0;
    try {
      const txtCount = nonOverlapping.filter(
        (m) => !m.isTextBg && (m.styleType || "text") === "text",
      ).length;
      debugLog(
        "READING_MATCHES",
        `total=${nonOverlapping.length}, text=${txtCount}, hideTextColors=${this.settings.hideTextColors === true}`,
      );
    } catch (_) {}

    for (const m of nonOverlapping) {
      if (m.start > pos) {
        frag.appendChild(
          document.createTextNode(decodedText.slice(pos, m.start)),
        );
      }

      const span = document.createElement("span");
      // Get the entry to check for affectMarkElements flag
      const entryForClass = m.entryRef || m.entry;
      const classNames = ["always-color-text-highlight"];
      // Add special class if this entry targets mark elements and .cm-highlight
      if (entryForClass && entryForClass.affectMarkElements) {
        classNames.push("always-color-text-highlight-marks");
      }
      span.className = classNames.join(" ");
      span.textContent = decodedText.slice(m.start, m.end);

      // Add tooltip for hover explanation if enabled
      if (this.settings.showColoringReasonOnHover && m.entry) {
        const tooltip = this.getColoringReasonTooltip(m);
        debugLog(
          "TOOLTIP_DEBUG",
          `Setting tooltip for "${span.textContent}": "${tooltip}", entry=${m.entry?.pattern}`,
        );
        span.title = tooltip;
        debugLog("TOOLTIP_DEBUG", `span.title is now: "${span.title}"`);
      } else {
        debugLog(
          "TOOLTIP_DEBUG",
          `NOT setting tooltip. showColoringReasonOnHover=${this.settings.showColoringReasonOnHover}, m.entry=${m.entry ? "yes" : "no"}`,
        );
      }

      // Get the entry and determine the style type
      // IMPORTANT: Use entryRef if available (has full entry with custom styling), otherwise fall back to entry
      const entry = m.entryRef || m.entry;
      // If affectMarkElements flag is set, force 'highlight' styleType to apply background
      let styleType =
        entry && entry.affectMarkElements
          ? "highlight"
          : entry && entry.styleType
            ? entry.styleType
            : "text";

      // DEBUG: Log per-entry styling in reading mode with detailed entry inspection
      if (entry && entry.pattern) {
        debugLog(
          "[READING_ENTRY_STYLE]",
          `Pattern: ${entry.pattern}, styleType: ${styleType}, textColor: ${entry.textColor}, bgColor: ${entry.backgroundColor}, hasCustomBgOpacity: ${entry.backgroundOpacity !== undefined}`,
        );

        // Check if entry has custom styling properties - this is the critical check
        const hasOpacity = typeof entry.backgroundOpacity === "number";
        const hasRadius = typeof entry.highlightBorderRadius === "number";
        const hasPadding = typeof entry.highlightHorizontalPadding === "number";
        if (hasOpacity || hasRadius || hasPadding) {
          debugLog(
            "[ENTRY_CUSTOM_CHECK]",
            `Pattern: ${entry.pattern} has custom props: opacity=${hasOpacity}, radius=${hasRadius}, padding=${hasPadding}`,
          );
        }
      }

      // Determine text color with robust fallback
      const folderDefault =
        m.folderEntry && m.folderEntry.defaultColor
          ? m.folderEntry.defaultColor
          : null;
      const entryTextColor =
        entry && entry.textColor && entry.textColor !== "currentColor"
          ? entry.textColor
          : null;
      const resolvedTextColor =
        folderDefault || entryTextColor || (entry ? entry.color : null);

      // Apply styling based on styleType with hide toggles and !important where needed
      const hideText = this.settings.hideTextColors === true;
      const hideBg = this.settings.hideHighlights === true;
      if (styleType === "text") {
        if (hideText) {
          frag.appendChild(
            document.createTextNode(decodedText.slice(m.start, m.end)),
          );
          pos = m.end;
          continue;
        }
        if (resolvedTextColor) {
          try {
            span.style.setProperty("color", resolvedTextColor, "important");
          } catch (_) {
            span.style.color = resolvedTextColor;
          }
          try {
            span.style.setProperty("--highlight-color", resolvedTextColor);
          } catch (e) {}
        }
        try {
          debugLog(
            "READING_TEXT",
            `applied color=${resolvedTextColor || "none"}`,
          );
        } catch (_) {}
      } else if (styleType === "highlight") {
        if (hideBg) {
          frag.appendChild(
            document.createTextNode(decodedText.slice(m.start, m.end)),
          );
          pos = m.end;
          continue;
        }
        const params = this.getHighlightParams(entry);
        const bgBase =
          entry && entry.backgroundColor
            ? entry.backgroundColor
            : entry && entry.color
              ? entry.color
              : resolvedTextColor;
        const bgRgba = this.hexToRgba(bgBase, params.opacity);
        try {
          span.style.setProperty("background-color", bgRgba, "important");
        } catch (_) {
          span.style.backgroundColor = bgRgba;
        }
        try {
          const vpad = params.vPad;
          span.style.setProperty(
            "padding-left",
            params.hPad + "px",
            "important",
          );
          span.style.setProperty(
            "padding-right",
            params.hPad + "px",
            "important",
          );
          span.style.setProperty(
            "padding-top",
            (vpad >= 0 ? vpad : 0) + "px",
            "important",
          );
          span.style.setProperty(
            "padding-bottom",
            (vpad >= 0 ? vpad : 0) + "px",
            "important",
          );
          if (vpad < 0) {
            span.style.setProperty("margin-top", vpad + "px", "important");
            span.style.setProperty("margin-bottom", vpad + "px", "important");
          }
        } catch (_) {
          const vpad = params.vPad;
          span.style.paddingLeft = span.style.paddingRight = params.hPad + "px";
          span.style.paddingTop = span.style.paddingBottom =
            (vpad >= 0 ? vpad : 0) + "px";
          if (vpad < 0) {
            span.style.marginTop = vpad + "px";
            span.style.marginBottom = vpad + "px";
          }
        }
        const br =
          (params.hPad > 0 && params.radius === 0 ? 0 : params.radius) + "px";
        try {
          span.style.setProperty("border-radius", br, "important");
        } catch (_) {
          span.style.borderRadius = br;
        }
        if (this.settings.enableBoxDecorationBreak ?? true) {
          span.style.boxDecorationBreak = "clone";
          span.style.WebkitBoxDecorationBreak = "clone";
        }
        try {
          const borderCss = this.generateBorderStyle(null, bgBase, entry);
          if (borderCss) {
            span.style.cssText += borderCss;
          }
        } catch (_) {}
      } else if (styleType === "both") {
        const textColor =
          entry.textColor && entry.textColor !== "currentColor"
            ? entry.textColor
            : null;
        const bgColor =
          entry && entry.backgroundColor
            ? entry.backgroundColor
            : entry && entry.color
              ? entry.color
              : resolvedTextColor;
        if (!hideText && textColor) {
          try {
            span.style.setProperty("color", textColor, "important");
          } catch (_) {
            span.style.color = textColor;
          }
          try {
            span.style.setProperty("--highlight-color", textColor);
          } catch (e) {}
        }
        if (!hideBg) {
          const params = this.getHighlightParams(entry);
          const bgRgba = this.hexToRgba(bgColor, params.opacity);
          try {
            span.style.setProperty("background-color", bgRgba, "important");
          } catch (_) {
            span.style.backgroundColor = bgRgba;
          }
          try {
            const vpad = params.vPad;
            span.style.setProperty(
              "padding-left",
              params.hPad + "px",
              "important",
            );
            span.style.setProperty(
              "padding-right",
              params.hPad + "px",
              "important",
            );
            span.style.setProperty(
              "padding-top",
              (vpad >= 0 ? vpad : 0) + "px",
              "important",
            );
            span.style.setProperty(
              "padding-bottom",
              (vpad >= 0 ? vpad : 0) + "px",
              "important",
            );
            if (vpad < 0) {
              span.style.setProperty("margin-top", vpad + "px", "important");
              span.style.setProperty("margin-bottom", vpad + "px", "important");
            }
          } catch (_) {
            const vpad = params.vPad;
            span.style.paddingLeft = span.style.paddingRight =
              params.hPad + "px";
            span.style.paddingTop = span.style.paddingBottom =
              (vpad >= 0 ? vpad : 0) + "px";
            if (vpad < 0) {
              span.style.marginTop = vpad + "px";
              span.style.marginBottom = vpad + "px";
            }
          }
          const br2 =
            (params.hPad > 0 && params.radius === 0 ? 0 : params.radius) + "px";
          try {
            span.style.setProperty("border-radius", br2, "important");
          } catch (_) {
            span.style.borderRadius = br2;
          }
          if (this.settings.enableBoxDecorationBreak ?? true) {
            span.style.boxDecorationBreak = "clone";
            span.style.WebkitBoxDecorationBreak = "clone";
          }
        } else {
          try {
            span.style.setProperty(
              "background-color",
              "transparent",
              "important",
            );
          } catch (_) {
            span.style.backgroundColor = "transparent";
          }
          span.style.paddingLeft = span.style.paddingRight = "0px";
          span.style.border = "";
          span.style.borderRadius = "";
        }
        try {
          const borderCss = this.generateBorderStyle(
            hideText ? null : textColor,
            hideBg ? null : bgColor,
            entry,
          );
          if (borderCss) {
            span.style.cssText += borderCss;
          }
        } catch (_) {}
      }

      frag.appendChild(span);
      pos = m.end;
    }

    if (pos < decodedText.length) {
      frag.appendChild(document.createTextNode(decodedText.slice(pos)));
    }

    debugLog(
      "HIGHLIGHT_APPLY",
      `Created ${nonOverlapping.length} spans, replacing text node`,
    );
    const parentNode = textNode.parentNode;
    const isConnected = textNode.isConnected;
    debugLog(
      "HIGHLIGHT_APPLY",
      `TextNode connected: ${isConnected}, parent: ${parentNode?.nodeName || "none"}`,
    );

    textNode.replaceWith(frag);

    // Verify the replacement worked
    const highlightsNow =
      parentNode?.querySelectorAll?.(".always-color-text-highlight")?.length ||
      0;
    debugLog(
      "HIGHLIGHT_APPLY",
      `After replacement: ${highlightsNow} highlights in parent`,
    );
  }

  setupReadingModeObserver(el, sourcePath) {
    try {
      if (!el || !sourcePath) return;

      // debugLog('READING_OBS', 'Setting up reading mode observer');

      // Use a simple interval-based approach: keep highlights applied in reading mode
      if (!this._readingModeIntervals) this._readingModeIntervals = new Map();

      // Clear any existing interval for this element
      if (this._readingModeIntervals.has(el)) {
        clearInterval(this._readingModeIntervals.get(el));
      }

      // Disabled: interval was causing unnecessary repeated processing every second
      // The highlights should be applied once during initial processing
      // let checkCount = 0;
      // const interval = setInterval(() => {
      //   try {
      //     checkCount++;
      //     if (!document.body.contains(el)) {
      //       clearInterval(interval);
      //       this._readingModeIntervals.delete(el);
      //       return;
      //     }
      //     const highlightCount = el.querySelectorAll('.always-color-text-highlight').length;
      //     if (highlightCount === 0 && checkCount % 5 === 0) {
      //       this.processActiveFileOnly(el, { sourcePath });
      //     }
      //   } catch (e) {
      //     debugError('READING_INTERVAL', 'Interval check failed', e);
      //   }
      // }, 200);
      // this._readingModeIntervals.set(el, interval);
    } catch (e) {
      debugError("READING_OBS", "Failed to set up observer", e);
    }
  }

  // Cleanup reading mode observers and disconnect viewport observers
  cleanupObserversForElement(el) {
    // Clear any reading mode intervals associated with this element
    try {
      if (
        this._readingModeIntervals &&
        this._readingModeIntervals instanceof Map
      ) {
        const intervals = this._readingModeIntervals.get(el);
        if (Array.isArray(intervals)) {
          for (const intervalId of intervals) {
            try {
              clearInterval(intervalId);
            } catch (e) {}
          }
        }
        this._readingModeIntervals.delete(el);
      }
    } catch (e) {}

    if (!el) return;
    try {
      // Clear reading mode interval if exists
      if (this._readingModeIntervals && this._readingModeIntervals.has(el)) {
        const interval = this._readingModeIntervals.get(el);
        if (interval) clearInterval(interval);
        this._readingModeIntervals.delete(el);
      }
    } catch (e) {}

    try {
      // Disconnect viewport observer if exists
      if (this._viewportObservers && this._viewportObservers.has(el)) {
        const observer = this._viewportObservers.get(el);
        if (observer && typeof observer.disconnect === "function") {
          observer.disconnect();
        }
        this._viewportObservers.delete(el);
      }
    } catch (e) {}
  }

  // Process only the active file: immediate visible blocks then deferred idle processing
  processActiveFileOnly(el, ctx) {
    debugLog("PROC_ACTIVE", `Path: ${ctx?.sourcePath}`);
    if (!el || !ctx || !ctx.sourcePath) return;
    if (!this.settings.enabled) return;
    try {
      this.removeDisabledNeutralizerStyles();
    } catch (_) {}

    // Ensure sourcePath is a string
    if (typeof ctx.sourcePath !== "string") {
      debugWarn("ACT", `Invalid sourcePath type: ${typeof ctx.sourcePath}`);
      return;
    }

    const startTime = performance.now();
    debugLog("ACT", "Processing active file", ctx.sourcePath.slice(-30));

    // Force full reading-mode rendering (user explicitly opted in - bypass perf gates)
    if (this.settings.forceFullRenderInReading) {
      try {
        debugWarn(
          "ACT",
          "forceFullRenderInReading enabled - forcing full processing",
        );
        try {
          debugLog(
            "ACT_FLAGS",
            `hideTextColors=${this.settings.hideTextColors === true}, hideHighlights=${this.settings.hideHighlights === true}`,
          );
        } catch (_) {}
        const pr0 = this.evaluatePathRules(ctx.sourcePath);
        const allowedEntriesForce = this.filterEntriesByAdvancedRules(
          ctx.sourcePath,
          this.getSortedWordEntries(),
        );
        if (
          (pr0.excluded ||
            (this.hasGlobalExclude() && pr0.hasIncludes && !pr0.included)) &&
          allowedEntriesForce.length === 0
        )
          return;
        if (this.settings.disabledFiles.includes(ctx.sourcePath)) {
      // CRITICAL: Must clear existing highlights when disabled
      this.applyHighlights(el, null, {
        clearExisting: true,
        entries: [],
        filePath: ctx.sourcePath,
      });
      return;
    }
        if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;
        const folderEntry = this.getBestFolderEntry(ctx.sourcePath);
        this.processInChunks(el, allowedEntriesForce, folderEntry, {
          skipFirstN: 0,
          batchSize: 30,
          clearExisting: true,
          forceProcess: true,
          maxMatches: Infinity,
        });
      } catch (e) {
        debugError("ACT", "forceFullRenderInReading failed", e);
      }
      return;
    }

    // Global performance gate
    try {
      if (
        this.performanceMonitor &&
        this.performanceMonitor.isOverloaded &&
        this.performanceMonitor.isOverloaded()
      ) {
        // Throttle perf-gate warnings to avoid spamming console (only warn once per second)
        try {
          const now = Date.now();
          if (!this._lastPerfWarning || now - this._lastPerfWarning > 1000) {
            debugLog("ACT", "Skipping: perf overload");
            this._lastPerfWarning = now;
          }
        } catch (e) {
          debugError("ACT", "perf gate error", e);
        }
        return;
      }
    } catch (e) {
      debugError("ACT", "perf gate error", e);
    }
    // NOTE: detailed DOM-size checks handled in block-level walker using TreeWalker (less false positives)
    // Avoid querying entire document to prevent skipping preview processing on busy pages

    // File-specific disable via settings
    const pr = this.evaluatePathRules(ctx.sourcePath);
    if (this.settings.disabledFiles.includes(ctx.sourcePath)) {
      // CRITICAL: Must clear existing highlights when disabled
      this.applyHighlights(el, null, {
        clearExisting: true,
        entries: [],
        filePath: ctx.sourcePath,
      });
      return;
    }

    // --- CANVAS HOST DISABLE CHECK ---
    try {
      if (el && el.closest && el.closest(".canvas-node")) {
        // Search leaves for the canvas that contains this element
        let hostCanvasPath = null;
        this.app.workspace.iterateAllLeaves((leaf) => {
          try {
            if (
              leaf &&
              leaf.view &&
              leaf.view.getViewType() === "canvas" &&
              leaf.containerEl &&
              leaf.containerEl.contains(el)
            ) {
              hostCanvasPath = leaf.view.file?.path || null;
            }
          } catch (_) {}
        });

        if (hostCanvasPath) {
          if (this.settings.disabledFiles.includes(hostCanvasPath)) {
            debugLog("ACT", "Skipping: host canvas file is disabled", hostCanvasPath);
            // CRITICAL: Must clear existing highlights when disabled
            this.applyHighlights(el, null, {
              clearExisting: true,
              entries: [],
              filePath: ctx.sourcePath,
            });
            return;
          }
          const hostPr = this.evaluatePathRules(hostCanvasPath);
          if (hostPr.excluded) {
            debugLog("ACT", "Skipping: host canvas file is excluded by rules", hostCanvasPath);
            // CRITICAL: Must clear existing highlights when disabled
            this.applyHighlights(el, null, {
              clearExisting: true,
              entries: [],
              filePath: ctx.sourcePath,
            });
            return;
          }
        }
      }
    } catch (e) {
      debugWarn("ACT", "Canvas host check failed", e);
    }
    // ---------------------------------

    // Frontmatter can override per-file disabling: always-color-text: false
    if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;

    // CRITICAL FIX: Get folder entry BEFORE filtering entries
    const folderEntry = this.getBestFolderEntry(ctx.sourcePath);

    // Get ALL entries first
    const allEntries = this.getSortedWordEntries();

    // Then filter by advanced rules
    const allowedEntries = this.filterEntriesByAdvancedRules(
      ctx.sourcePath,
      allEntries,
    );

    // VALIDATION: Ensure targetElement is present for formatting entries (self-healing)
    for (const entry of allowedEntries) {
      if (!entry.targetElement && entry.isRegex) {
        if (entry.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1")
          entry.targetElement = "strong";
        else if (entry.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1")
          entry.targetElement = "em";
        else if (entry.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1")
          entry.targetElement = "strong-em";
      }
    }

    // FIX: BoldItalic conflicting styles in Reading Mode (prevent double background)
    try {
      if (el && el.querySelectorAll) {
        const strongs = el.querySelectorAll("strong");
        for (let i = 0; i < strongs.length; i++) {
          const strong = strongs[i];
          const ems = strong.getElementsByTagName("em");
          if (ems.length > 0) {
            let allEmText = "";
            for (let j = 0; j < ems.length; j++)
              allEmText += ems[j].textContent;
            if (strong.textContent.trim() === allEmText.trim()) {
              strong.classList.add("act-transparent-strong");
            }
          }
        }
      }
    } catch (e) {}

    // Check if we should skip coloring entirely
    const isExcludedByPathRules =
      pr.excluded ||
      (this.hasGlobalExclude() && pr.hasIncludes && !pr.included);

    // If excluded by path rules AND no entries match advanced rules, return early
    if (isExcludedByPathRules && allowedEntries.length === 0) {
      debugLog(
        "ACT",
        "Skipping: excluded by path rules with no advanced rule exceptions",
      );
      return;
    }

    // Respect user preference to disable reading/preview coloring
    if (this.settings.disableReadingModeColoring) {
      try {
        // Disconnect any viewport observer attached to this root to avoid leaks
        const prev =
          this._viewportObservers &&
          this._viewportObservers.get &&
          this._viewportObservers.get(el);
        if (prev && typeof prev.disconnect === "function") {
          try {
            prev.disconnect();
          } catch (e) {}
          try {
            this._viewportObservers.delete(el);
          } catch (e) {}
        }
      } catch (e) {}
      return;
    }

    // If this is a very large document, prefer viewport-based incremental rendering
    try {
      if (
        this.shouldUseLightweightMode &&
        this.shouldUseLightweightMode(
          el.textContent ? el.textContent.length : 0,
        )
      ) {
        debugLog("ACT", "Large doc detected -> using viewport-based rendering");
        try {
          this.setupViewportObserver(el, folderEntry || null, {
            clearExisting: true,
            entries: allowedEntries,
          });
          // Ensure bases are processed for large documents
          this._processBasesViews();

          // CRITICAL FIX: Ensure callouts and tables are processed in lightweight mode
          // Pass a pseudo-view object since we only have the element
          try {
            const pseudoView = { dom: el, file: { path: ctx.sourcePath } };
            // We can skip the is-live-preview check here or let the methods handle it
            // The methods _processLivePreviewCallouts/_processLivePreviewTables check for .is-live-preview
            // so it is safe to call them even if this is reading mode (they will just return)
            this._processLivePreviewCallouts(pseudoView);
            this._processLivePreviewTables(pseudoView);
          } catch (err) {
            debugError(
              "ACT",
              "lightweight mode element processing failed",
              err,
            );
          }
        } catch (e) {
          debugError("ACT", "setupViewportObserver failed", e);
          this.applyHighlights(el, folderEntry || null, {
            immediateBlocks,
            clearExisting: true,
            entries: allowedEntries,
            filePath: ctx.sourcePath,
          });
        }
        return;
      }
    } catch (e) {}

    const processNow = () =>
      this.applyHighlights(el, folderEntry || null, {
        immediateBlocks,
        clearExisting: true,
        entries: allowedEntries,
        filePath: ctx.sourcePath,
      });

    const isReadingRoot =
      el &&
      (el.classList.contains("markdown-rendered") ||
        el.closest(".markdown-reading-view"));
    const immediateBlocks = isReadingRoot ? 100 : 10;

    // Fast-path immediate pass for visible content
    const t0 = performance.now();
    processNow();
    debugLog("ACT", `immediate pass: ${(performance.now() - t0).toFixed(1)}ms`);

    // Schedule deferred pass for remaining content in idle time, guarding callback to run at most once per root
    // We use requestIdleCallback with setTimeout fallback to ensure eventual completion
    try {
      try {
        this._domRefs.set(
          el,
          Object.assign(this._domRefs.get(el) || {}, {
            deferredScheduled: true,
            deferredDone: false,
          }),
        );
      } catch (e) {}

      const runDeferred = (label) => {
        try {
          const meta = this._domRefs.get(el) || {};
          if (meta.deferredDone) return;
          meta.deferredDone = true;
          try {
            this._domRefs.set(el, meta);
          } catch (e) {}
          const t1 = performance.now();
          // More aggressive deferred processing: force chunked processing of remaining blocks
          debugLog(
            "DEFERRED",
            `Start: ${label}, skipFirstN=${immediateBlocks}`,
          );
          try {
            // Prefer chunked processing for large documents; force completion (bypass perf gate)
            this.processInChunks(el, allowedEntries, folderEntry || null, {
              skipFirstN: immediateBlocks,
              batchSize: 30,
              clearExisting: true,
              forceProcess: true,
              filePath: ctx.sourcePath,
            })
              .then(() =>
                debugLog(
                  "DEFERRED",
                  `Completed: ${label} in ${(performance.now() - t1).toFixed(1)}ms`,
                ),
              )
              .catch((e) => debugError("DEFERRED", "processInChunks error", e));
          } catch (e) {
            debugError("DEFERRED", "fallback applyHighlights due to error", e);
            this.applyHighlights(el, folderEntry || null, {
              skipFirstN: immediateBlocks,
              clearExisting: true,
              entries: allowedEntries,
              filePath: ctx.sourcePath,
            });
          }
        } catch (e) {
          debugError("ACT", "deferred pass error", e);
        }
      };

      if (isReadingRoot) {
        try {
          runDeferred("reading-immediate");
        } catch (e) {
          debugError("DEFERRED", "reading immediate failed", e);
        }
      } else if (
        typeof window !== "undefined" &&
        typeof window.requestIdleCallback === "function"
      ) {
        try {
          window.requestIdleCallback(() => runDeferred("idleCallback"), {
            timeout: 2000,
          });
        } catch (e) {
          // If requestIdleCallback throws, ensure fallback via setTimeout
          setTimeout(() => runDeferred("setTimeout-after-idle-error"), 1200);
        }
      } else {
        // No requestIdleCallback support; schedule fallback
        setTimeout(() => runDeferred("setTimeout-fallback"), 1200);
      }

      if (!isReadingRoot) {
        setTimeout(() => runDeferred("safety-timeout"), 3000);
      }
    } catch (e) {
      // As a last resort, attempt a simple timeout run
      setTimeout(() => {
        try {
          const t3 = performance.now();
          this.applyHighlights(el, folderEntry || null, {
            skipFirstN: immediateBlocks,
            clearExisting: false,
            entries: allowedEntries,
            filePath: ctx.sourcePath,
          });
          debugLog(
            "ACT",
            `deferred (fallback-final) in ${(performance.now() - t3).toFixed(1)}ms`,
          );
        } catch (err) {
          debugError("ACT", "fallback-final error", err);
        }
      }, 1500);
    }
    debugLog(
      "ACT",
      `scheduled total: ${(performance.now() - startTime).toFixed(1)}ms`,
    );
  }

  // Progressive optimized processing for very large documents
  processLargeDocument(el, ctx, folderEntry) {
    try {
      debugLog("LARGE", "Processing large document with optimized mode");
      // Process only visible/initial content first
      const entries = this.filterEntriesByAdvancedRules(
        ctx.sourcePath,
        this.getSortedWordEntries(),
      );
      this.applyHighlights(el, folderEntry, {
        immediateBlocks: 50,
        skipFirstN: 0,
        clearExisting: true,
        entries,
        filePath: ctx.sourcePath,
      });

      // Schedule the rest to run after a short delay in larger batches
      setTimeout(() => {
        try {
          this.processInChunks(el, entries, folderEntry, {
            batchSize: 30,
            clearExisting: false,
            forceProcess: true, // Force full render even in lightweight mode as per user request
          });
          // Ensure bases are processed
          this._processBasesViews();

          // CRITICAL: Ensure callouts and tables are processed even in large documents
          try {
            const pseudoView = { dom: el, file: { path: ctx.sourcePath } };
            // Pass force=true to bypass throttling and force processing in this context
            this._processLivePreviewCallouts(pseudoView, true);
            this._processLivePreviewTables(pseudoView, true);
          } catch (_) {}
        } catch (e) {
          debugError("LARGE", "deferred processing failed", e);
        }
      }, 1000);
    } catch (e) {
      debugError("LARGE", "processLargeDocument failed", e);
    }
  }

  // NEW METHOD: Optimized processing for non-Roman text
  processNonRomanOptimized(element, entries, folderEntry = null, options = {}) {
    const nonRomanEntries = entries.filter(
      (entry) =>
        entry &&
        !entry.invalid &&
        this.containsNonRomanCharacters(entry.pattern),
    );

    if (nonRomanEntries.length === 0) return;

    const blockTags = [
      "P",
      "LI",
      "DIV",
      "SPAN",
      "TD",
      "TH",
      "BLOCKQUOTE",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
    ];
    const queue = [];

    // Simplified DOM collection - avoid heavy TreeWalker for non-Roman text
    for (const node of element.childNodes) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        blockTags.includes(node.nodeName)
      ) {
        queue.push(node);
      }
    }

    // Process each block with language-specific optimizations
    for (const block of queue) {
      this.processNonRomanBlock(block, nonRomanEntries, folderEntry, options);
    }
  }

  // NEW METHOD: Process single block with non-Roman text
  processNonRomanBlock(block, entries, folderEntry, opts = {}) {
    try {
      if (
        block &&
        (block.classList?.contains("act-skip-coloring") ||
          block.closest?.(".act-skip-coloring"))
      )
        return;
    } catch (_) {}
    const clearExisting = opts.clearExisting !== false;

    // Clear existing highlights
    if (clearExisting) {
      const highlights = block.querySelectorAll(
        "span.always-color-text-highlight",
      );
      for (const ex of highlights) {
        const tn = document.createTextNode(ex.textContent);
        ex.replaceWith(tn);
      }
    }

    // Process text nodes - SIMPLIFIED for non-Roman scripts
    for (const node of block.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;

      let text = node.textContent;
      if (!text || text.length > 5000) continue; // Conservative limit

      // DECODE HTML ENTITIES FOR READING MODE COMPATIBILITY
      text = this.decodeHtmlEntities(text);

      let matches = [];

      // SIMPLE string matching for non-Roman scripts - avoid complex regex
      for (const entry of entries) {
        if (!entry || entry.invalid) continue;

        let pattern = entry.pattern;
        // ALSO DECODE PATTERN FOR COMPARISON
        pattern = this.decodeHtmlEntities(pattern);

        const styleType = entry.styleType || "text";
        const textColor =
          entry.textColor && entry.textColor !== "currentColor"
            ? entry.textColor
            : entry.color || null;
        const resolvedTextColor =
          folderEntry && folderEntry.defaultColor
            ? folderEntry.defaultColor
            : textColor;
        const backgroundColor = entry.backgroundColor || null;

        // Simple string search for non-Roman patterns (more efficient)
        let pos = 0;
        while ((pos = text.indexOf(pattern, pos)) !== -1) {
          // Check blacklist with folder/tag rules
          if (
            this.isContextBlacklisted(
              text,
              pos,
              pos + pattern.length,
              opts.filePath,
            )
          ) {
            pos += pattern.length;
            continue;
          }

          matches.push({
            start: pos,
            end: pos + pattern.length,
            styleType,
            textColor: resolvedTextColor || null,
            backgroundColor: backgroundColor || null,
          });
          pos += pattern.length;

          if (matches.length > 100) break; // Conservative limit
        }

        if (matches.length > 100) break;
      }

      // Apply highlights
      if (matches.length > 0) {
        matches.sort((a, b) => a.start - b.start);

        const frag = document.createDocumentFragment();
        let pos = 0;

        for (const m of matches) {
          if (m.start > pos) {
            frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
          }

          const span = document.createElement("span");
          span.className = "always-color-text-highlight";
          span.textContent = text.slice(m.start, m.end);

          const hideText = this.settings.hideTextColors === true;
          const hideBg = this.settings.hideHighlights === true;
          if (m.styleType === "text") {
            if (!hideText && m.textColor) {
              try {
                span.style.setProperty("color", m.textColor, "important");
              } catch (_) {
                span.style.color = m.textColor;
              }
              try {
                span.style.setProperty("--highlight-color", m.textColor);
              } catch (e) {}
            }
          } else if (m.styleType === "highlight") {
            if (!hideBg) {
              const bg = m.backgroundColor || m.textColor;
              if (bg) {
                try {
                  span.style.setProperty(
                    "background-color",
                    this.hexToRgba(bg, this.settings.backgroundOpacity ?? 0.3),
                    "important",
                  );
                } catch (_) {
                  span.style.backgroundColor = this.hexToRgba(
                    bg,
                    this.settings.backgroundOpacity ?? 0.3,
                  );
                }
                try {
                  span.style.setProperty(
                    "padding-left",
                    (this.settings.highlightHorizontalPadding ?? 4) + "px",
                    "important",
                  );
                  span.style.setProperty(
                    "padding-right",
                    (this.settings.highlightHorizontalPadding ?? 4) + "px",
                    "important",
                  );
                  span.style.setProperty(
                    "padding-top",
                    (this.settings.highlightVerticalPadding ?? 0) + "px",
                    "important",
                  );
                  span.style.setProperty(
                    "padding-bottom",
                    (this.settings.highlightVerticalPadding ?? 0) + "px",
                    "important",
                  );
                } catch (_) {
                  span.style.paddingLeft = span.style.paddingRight =
                    (this.settings.highlightHorizontalPadding ?? 4) + "px";
                  span.style.paddingTop = span.style.paddingBottom =
                    (this.settings.highlightVerticalPadding ?? 0) + "px";
                }
                const br = (this.settings.highlightBorderRadius ?? 8) + "px";
                try {
                  span.style.setProperty("border-radius", br, "important");
                } catch (_) {
                  span.style.borderRadius = br;
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  span.style.boxDecorationBreak = "clone";
                  span.style.WebkitBoxDecorationBreak = "clone";
                }
                this.applyBorderStyleToElement(span, null, bg);
              }
            } else {
              try {
                span.style.setProperty(
                  "background-color",
                  "transparent",
                  "important",
                );
              } catch (_) {
                span.style.backgroundColor = "transparent";
              }
              span.style.paddingLeft = span.style.paddingRight = "0px";
              span.style.border = "";
              span.style.borderRadius = "";
            }
          } else {
            // 'both'
            const tc = m.textColor;
            const bg = m.backgroundColor || m.textColor;
            if (!hideText && tc) {
              try {
                span.style.setProperty("color", tc, "important");
              } catch (_) {
                span.style.color = tc;
              }
              try {
                span.style.setProperty("--highlight-color", tc);
              } catch (e) {}
            }
            if (!hideBg && bg) {
              try {
                span.style.setProperty(
                  "background-color",
                  this.hexToRgba(bg, this.settings.backgroundOpacity ?? 0.3),
                  "important",
                );
              } catch (_) {
                span.style.backgroundColor = this.hexToRgba(
                  bg,
                  this.settings.backgroundOpacity ?? 0.3,
                );
              }
              try {
                span.style.setProperty(
                  "padding-left",
                  (this.settings.highlightHorizontalPadding ?? 4) + "px",
                  "important",
                );
                span.style.setProperty(
                  "padding-right",
                  (this.settings.highlightHorizontalPadding ?? 4) + "px",
                  "important",
                );
                span.style.setProperty(
                  "padding-top",
                  (this.settings.highlightVerticalPadding ?? 0) + "px",
                  "important",
                );
                span.style.setProperty(
                  "padding-bottom",
                  (this.settings.highlightVerticalPadding ?? 0) + "px",
                  "important",
                );
              } catch (_) {
                span.style.paddingLeft = span.style.paddingRight =
                  (this.settings.highlightHorizontalPadding ?? 4) + "px";
                span.style.paddingTop = span.style.paddingBottom =
                  (this.settings.highlightVerticalPadding ?? 0) + "px";
              }
              const br2 = (this.settings.highlightBorderRadius ?? 8) + "px";
              try {
                span.style.setProperty("border-radius", br2, "important");
              } catch (_) {
                span.style.borderRadius = br2;
              }
              if (this.settings.enableBoxDecorationBreak ?? true) {
                span.style.boxDecorationBreak = "clone";
                span.style.WebkitBoxDecorationBreak = "clone";
              }
              this.applyBorderStyleToElement(
                span,
                hideText ? null : tc,
                hideBg ? null : bg,
              );
            } else if (hideBg) {
              try {
                span.style.setProperty(
                  "background-color",
                  "transparent",
                  "important",
                );
              } catch (_) {
                span.style.backgroundColor = "transparent";
              }
              span.style.paddingLeft = span.style.paddingRight = "0px";
              span.style.border = "";
              span.style.borderRadius = "";
            }
          }

          frag.appendChild(span);
          pos = m.end;
        }

        if (pos < text.length) {
          frag.appendChild(document.createTextNode(text.slice(pos)));
        }

        node.replaceWith(frag);
      }
    }
  }

  // CRITICAL PERFORMANCE FIX: Check if element is inside a collapsed header section
  // This prevents processing hidden text that contributes to lag
  isElementInCollapsedSection(element) {
    try {
      // Check if element itself is hidden with display:none
      const style = window.getComputedStyle(element);
      if (style.display === "none") return true;
      if (style.visibility === "hidden") return true;
    } catch (_) {}

    // Walk up the DOM tree to find a collapsed heading
    let current = element.parentElement;
    while (current && current !== document.body) {
      try {
        // Check for Obsidian's collapsed header marker
        if (current.classList.contains("is-collapsed")) {
          return true;
        }

        // Check for inline hidden/collapsed markers
        const style = window.getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden") {
          return true;
        }
      } catch (_) {}
      current = current.parentElement;
    }

    return false;
  }

  _wrapMatchesRecursive(element, entries, folderEntry = null, options = {}) {
    debugLog("WRAP", `Starting with ${entries.length} entries`);

    // EARLY BAILOUT FOR LARGE NON-ROMAN TEXTS
    try {
      const textContent = element.textContent || "";
      const nonRomanCharCount = this.countNonRomanCharacters(textContent);
      const totalChars = textContent.length;

      // If text is primarily non-Roman and large, use optimized processing
      if (nonRomanCharCount > 100 && nonRomanCharCount / totalChars > 0.3) {
        debugLog("ACT", "Using optimized non-Roman text processing");
        return this.processNonRomanOptimized(
          element,
          entries,
          folderEntry,
          options,
        );
      }
    } catch (e) {
      // Continue with normal processing if check fails
    }

    try {
      this.processMarkdownFormattingInReading(
        element,
        folderEntry,
        entries,
        options.filePath,
      );
    } catch (e) {}

    // SEPARATE SIMPLE PATTERNS FOR OPTIMIZED PROCESSING (but not in reading mode)
    const simpleEntries = entries.filter(
      (entry) => entry && !entry.invalid && this.isSimplePattern(entry.pattern),
    );
    const complexEntries = entries.filter(
      (entry) =>
        entry && !entry.invalid && !this.isSimplePattern(entry.pattern),
    );

    debugLog(
      "WRAP",
      `Pattern split: ${simpleEntries.length} simple, ${complexEntries.length} complex`,
    );

    // Combine all entries for unified processing
    // In reading mode, we need to use the standard _processBlock path to ensure highlights persist
    const allEntriesToProcess = simpleEntries.concat(complexEntries);

    // Only process complex patterns if needed (and if we have capacity)
    if (complexEntries.length > 0 && !this.isPerformanceOverloaded()) {
      // Continue with standard complex pattern processing below
      debugLog(
        "ACT",
        `Processing ${allEntriesToProcess.length} total patterns (${simpleEntries.length} simple + ${complexEntries.length} complex)`,
      );
    } else if (complexEntries.length > 0) {
      debugLog(
        "ACT",
        "Skipping complex pattern processing due to performance constraints",
      );
      // DON'T return here - we still need to process simple patterns through standard path!
    }

    const immediateLimit = Number(options.immediateBlocks) || 0;
    const skipFirstN = Number(options.skipFirstN) || 0;
    const clearExisting = options.clearExisting !== false;
    const blockTags = [
      "P",
      "LI",
      "DIV",
      "SPAN",
      "TD",
      "TH",
      "BLOCKQUOTE",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "CODE",
      "PRE",
      "A",
    ];

    // Early DOM-safety checks using TreeWalker to avoid materializing huge NodeLists
    try {
      // If the user requested a full render in reading mode, skip these safety checks
      if (this.settings.forceFullRenderInReading) {
        try {
          debugWarn(
            "DOM",
            "forceFullRenderInReading active - skipping DOM size checks",
          );
        } catch (e) {}
      } else {
        // Global performance gate for DOM work
        try {
          if (
            this.performanceMonitor &&
            this.performanceMonitor.isOverloaded &&
            this.performanceMonitor.isOverloaded()
          ) {
            // Throttle DOM perf warnings to avoid excessive logging
            try {
              const now = Date.now();
              if (
                !this._lastPerfWarning ||
                now - this._lastPerfWarning > 1000
              ) {
                debugLog(
                  "DOM",
                  "Perf overload detected -> using chunked processing",
                );
                this._lastPerfWarning = now;
              }
            } catch (e) {}
            // Fallback to chunked processing instead of skipping entirely
            try {
              this.processInChunks(element, entries, folderEntry, options);
            } catch (e) {
              debugError("DOM", "Chunking on overload failed", e);
            }
            return;
          }
        } catch (e) {}
        const MAX_DOM_NODES = 10000;
        const MAX_BLOCK_NODES = 2000;
        let nodeCount = 0;
        const tw = document.createTreeWalker(
          element,
          NodeFilter.SHOW_ELEMENT,
          null,
          false,
        );
        while (tw.nextNode()) {
          nodeCount++;
          if (nodeCount > MAX_DOM_NODES) break;
        }
        if (nodeCount > MAX_DOM_NODES) {
          debugLog(
            "DOM",
            `DOM too large (${nodeCount} nodes) -> using chunked processing`,
          );
          try {
            this.processInChunks(element, entries, folderEntry, options);
          } catch (e) {
            debugError("DOM", "Chunking failed", e);
          }
          return;
        }

        // Count only block-like elements up to MAX_BLOCK_NODES
        const blockSet = new Set(blockTags);
        let blockCount = 0;
        const tw2 = document.createTreeWalker(
          element,
          NodeFilter.SHOW_ELEMENT,
          {
            acceptNode(node) {
              return blockSet.has(node.nodeName)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP;
            },
          },
          false,
        );
        while (tw2.nextNode()) {
          blockCount++;
          if (blockCount > MAX_BLOCK_NODES) break;
        }
        if (blockCount > MAX_BLOCK_NODES) {
          // Defer to chunked processor for large numbers of blocks to avoid UI freeze
          debugLog("DOM", `Chunking large block count: ${blockCount}`);
          try {
            this.processInChunks(element, entries, folderEntry, options);
          } catch (e) {
            // Fallback: warn and return
            debugError("DOM", "Chunking failed", e);
          }
          return;
        }
      }
    } catch (e) {
      // If TreeWalker isn't available or another error occurs, continue with the old path
      debugError("DOM", "TreeWalker error", e);
    }

    // Use TreeWalker instead of querySelectorAll to avoid materializing large arrays of DOM references
    const queue = [];
    const blockSet = new Set(blockTags);

    // Ensure we process the element itself if it's a block
    if (
      element.nodeType === Node.ELEMENT_NODE &&
      blockTags.includes(element.nodeName)
    ) {
      queue.unshift(element);
    }

    // Walk through ALL descendant elements to find blocks, including nested containers
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(n) {
          // Skip code and pre blocks entirely
          if (["CODE", "PRE"].includes(n.nodeName)) {
            return NodeFilter.FILTER_REJECT;
          }
          // Accept block-level elements
          if (blockSet.has(n.nodeName)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          // Skip non-block elements but continue descending to find nested blocks
          return NodeFilter.FILTER_SKIP;
        },
      },
      false,
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      queue.push(currentNode);
    }

    // Debug: report how many block-like elements were discovered and what will be skipped
    try {
      debugLog(
        "COLOR",
        `Processing ${queue.length} blocks, skipping first ${skipFirstN}`,
      );
    } catch (e) {}
    let visited = 0;
    let collapsedSkipped = 0;
    for (let qIndex = 0; qIndex < queue.length; qIndex++) {
      const block = queue[qIndex];
      // Skip blocks we've been asked to skip (deferred pass)
      if (qIndex < skipFirstN) {
        // Debug: note skipped block index
        try {
          if (qIndex % 50 === 0) debugLog("COLOR", `Skipping block ${qIndex}`);
        } catch (e) {}
        visited++;
        continue;
      }

      // CRITICAL PERFORMANCE FIX: Skip blocks inside collapsed sections
      if (this.isElementInCollapsedSection(block)) {
        collapsedSkipped++;
        if (collapsedSkipped % 50 === 1) {
          try {
            debugLog(
              "COLLAPSE_SKIP",
              `Skipping block in collapsed section (${collapsedSkipped} total skipped)`,
            );
          } catch (e) {}
        }
        continue;
      }

      const effectiveStyle = "text";
      // Call extracted per-block processor
      try {
        if (qIndex % 100 === 0) debugLog("COLOR", `Processing block ${qIndex}`);
      } catch (e) {}
      this._errorRecovery.wrap(
        "PROCESS_BLOCK",
        () =>
          this._processBlock(block, allEntriesToProcess, folderEntry, {
            clearExisting,
            effectiveStyle,
            immediateLimit,
            qIndex,
            skipFirstN,
            element,
            forceProcess:
              (options && options.forceProcess) ||
              this.settings.forceFullRenderInReading,
            maxMatches:
              (options && options.maxMatches) ||
              (this.settings.forceFullRenderInReading ? Infinity : undefined),
            filePath: options.filePath,
          }),
        () => null,
      );
    }

    if (collapsedSkipped > 0) {
      try {
        debugLog(
          "COLLAPSE_SKIP",
          `Total collapsed blocks skipped: ${collapsedSkipped}`,
        );
      } catch (e) {}
    }

    // Clear queue references to help GC
    queue.length = 0;
  }

  // Extracted helper: process a single block element (previously inlined inside _wrapMatchesRecursive)
  _processBlock(block, entries, folderEntry, opts = {}) {
    if (block.matches && block.matches(".inline_spoilers-spoiler")) return;
    try {
      const blockText = block.textContent || "";
      if (
        blockText.toLowerCase().includes("pm") ||
        blockText.toLowerCase().includes("am")
      ) {
        debugLog(
          "BLOCK_PROC_START",
          `Block: ${block.nodeName}.${block.className}, text snippet: "${blockText.substring(0, 30)}"`,
        );
      }
    } catch (e) {}
    try {
      this._domRefs.set(block, { processedAt: Date.now(), matchCount: 0 });
    } catch (e) {}

    const clearExisting = opts.clearExisting !== false;
    // Resolve effectiveStyle safely: prefer explicit option, then folderEntry, then global setting
    let effectiveStyle;
    if (
      typeof opts.effectiveStyle === "string" &&
      opts.effectiveStyle.length > 0
    ) {
      effectiveStyle = opts.effectiveStyle;
    } else if (folderEntry && folderEntry.defaultStyle) {
      effectiveStyle = folderEntry.defaultStyle;
    } else {
      effectiveStyle = "text";
    }
    const immediateLimit = opts.immediateLimit || 0;

    // instrumentation: count this block being processed
    try {
      this._perfCounters.totalBlocksProcessed =
        (this._perfCounters.totalBlocksProcessed || 0) + 1;
    } catch (e) {}

    // Unwrap any existing highlights created by this plugin to avoid stacking when re-applying
    try {
      if (clearExisting) {
        // Use TreeWalker instead of querySelectorAll to avoid materializing NodeList
        const highlights = [];
        const walker = document.createTreeWalker(
          block,
          NodeFilter.SHOW_ELEMENT,
          {
            acceptNode(node) {
              return node.classList &&
                node.classList.contains("always-color-text-highlight")
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP;
            },
          },
          false,
        );

        let highlightNode;
        while ((highlightNode = walker.nextNode())) {
          highlights.push(highlightNode);
        }

        // Now remove highlights (separate loop to avoid modifying DOM during walk)
        for (const ex of highlights) {
          const tn = document.createTextNode(ex.textContent);
          ex.replaceWith(tn);
        }
        highlights.length = 0; // Clear array
      }
    } catch (e) {}

    try {
      this.processMarkdownFormattingInReading(
        block,
        folderEntry,
        entries,
        opts.filePath,
      );
    } catch (e) {
      try {
        debugError("MARKDOWN_FORMAT", "per-block processing error", e);
      } catch (_) {}
    }

    // Use TreeWalker to find text nodes at any depth, including inside formatting tags like <em>, <i>, <b>, <strong>
    const textNodes = [];
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          // Skip text nodes in code blocks
          if (node.parentElement?.closest("code, pre")) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.parentElement?.closest("mark")) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.parentElement?.closest(".inline_spoilers-spoiler")) {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip text nodes already inside ACT highlight spans to prevent double processing
          if (node.parentElement?.closest(".always-color-text-highlight")) {
            return NodeFilter.FILTER_REJECT;
          }
          try {
            if (node.parentElement?.closest(".act-skip-coloring")) {
              return NodeFilter.FILTER_REJECT;
            }
          } catch (_) {}
          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false,
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      textNodes.push(currentNode);
    }

    // LITERAL PATTERN FAST PATH - COLLECT MATCHES (DON'T APPLY YET)
    // Collect literal matches to be resolved together with text+bg matches for proper priority
    const literalMatches = [];
    try {
      // Process only text-only entries here; text+bg entries have their own processing loop below
      let literalEntries = (entries || []).filter(
        (e) =>
          e &&
          !e.invalid &&
          !e.isRegex &&
          typeof e.pattern === "string" &&
          !e.isTextBg,
      );
      if (literalEntries.length > 0) {
        // We'll collect literal matches during per-node processing, not at block level
        // Store entries for later use in the per-node loop
        try {
          this._literalEntriesToProcess = literalEntries;
        } catch (e) {}
      }
    } catch (e) {
      debugLog(
        "LITERAL_PATH",
        `Error setting up literal entries: ${e.message}`,
      );
    }

    // REFRESH text nodes after literal path modified them
    // The literal path replaced some text nodes with fragments, so we need to find the updated text nodes
    if (
      (entries || []).filter((e) => e && !e.invalid && e.isRegex).length > 0
    ) {
      textNodes.length = 0; // Clear the array
      let refreshWalker = document.createTreeWalker(
        block,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            // Skip text nodes in code blocks
            if (node.parentElement?.closest("code, pre")) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.parentElement?.closest("mark")) {
              return NodeFilter.FILTER_REJECT;
            }
            // CRITICAL FIX: Skip text nodes that are already inside highlight spans to prevent double-processing
            if (node.parentElement?.closest(".always-color-text-highlight")) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.parentElement?.closest(".inline_spoilers-spoiler")) {
              return NodeFilter.FILTER_REJECT;
            }
            try {
              if (node.parentElement?.closest(".act-skip-coloring")) {
                return NodeFilter.FILTER_REJECT;
              }
            } catch (_) {}
            return NodeFilter.FILTER_ACCEPT;
          },
        },
        false,
      );
      let currentRefreshNode;
      while ((currentRefreshNode = refreshWalker.nextNode())) {
        textNodes.push(currentRefreshNode);
      }
    }

    // NOTE: Regex patterns (including presets like Time and @username) are now processed in the main
    // pattern matching loop below (via _patternMatcher.match()) to avoid duplicate span creation.
    // The separate early regex processing path has been removed because:
    // 1. It caused duplicate matches for preset patterns (time 10:24pm, @username)
    // 2. applySimpleHighlights() was called twice on the same text nodes
    // 3. The main pattern matching loop (lines ~5290+) handles all entries uniformly

    // Ensure all regex entries are compiled for the main matching loop below
    try {
      const regexEntries = (entries || []).filter(
        (e) => e && !e.invalid && e.isRegex,
      );
      for (const entry of regexEntries) {
        if (!entry.regex) {
          this._patternMatcher && this._patternMatcher.compilePattern(entry);
        }
      }
    } catch (e) {
      debugLog("REGEX_COMPILE", `Error compiling regex entries: ${e.message}`);
    }

    // REFRESH text nodes after literal path modified them
    // The literal path replaced some text nodes with fragments, so we need to find the updated text nodes
    textNodes.length = 0; // Clear the array
    let refreshWalker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          // Skip text nodes in code blocks
          if (node.parentElement?.closest("code, pre")) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.parentElement?.closest("mark")) {
            return NodeFilter.FILTER_REJECT;
          }
          // CRITICAL FIX: Skip text nodes that are already inside highlight spans to prevent double-processing
          if (node.parentElement?.closest(".always-color-text-highlight")) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.parentElement?.closest(".inline_spoilers-spoiler")) {
            return NodeFilter.FILTER_REJECT;
          }
          try {
            if (node.parentElement?.closest(".act-skip-coloring")) {
              return NodeFilter.FILTER_REJECT;
            }
          } catch (_) {}
          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false,
    );
    let refreshNode;
    while ((refreshNode = refreshWalker.nextNode())) {
      textNodes.push(refreshNode);
      if (refreshNode.textContent.toLowerCase().includes("pm")) {
        debugLog("TEXT_NODE_FOUND", `Found text node with 'pm': "${refreshNode.textContent}"`);
      }
    }

    for (const node of textNodes) {
      let text = node.textContent;
      const headingEl = node.parentElement?.closest("h1, h2, h3, h4, h5, h6");
      if (headingEl) {
        const we = entries;
        const tagName = (headingEl.tagName || "").toUpperCase();
        let level = 0;
        if (tagName.startsWith("H")) {
          const parsed = parseInt(tagName.substring(1), 10);
          if (!isNaN(parsed)) level = parsed;
        }

        const headingEntry =
          level > 0 ? getEntryForHeadingLevel(we, level) : null;

        if (headingEntry) {
          if (
            headingEntry.styleType === "highlight" ||
            headingEntry.styleType === "both"
          ) {
            if (!headingEl.querySelector(".act-heading-wrapper")) {
              const wrapper = document.createElement("span");
              wrapper.className =
                "always-color-text-highlight act-heading-wrapper";
              try {
                wrapper.style.display = "inline-block";
              } catch (e) {}
              if (headingEntry.styleType === "both") {
                wrapper.style.color = headingEntry.textColor;
                try {
                  wrapper.style.setProperty(
                    "--highlight-color",
                    headingEntry.textColor,
                  );
                } catch (e) {}
                wrapper.style.background = "";
                {
                  const params = this.getHighlightParams(headingEntry);
                  wrapper.style.backgroundColor = this.hexToRgba(
                    headingEntry.backgroundColor,
                    params.opacity,
                  );
                  const vpad = params.vPad;
                  wrapper.style.paddingLeft = wrapper.style.paddingRight =
                    params.hPad + "px";
                  wrapper.style.paddingTop = wrapper.style.paddingBottom =
                    (vpad >= 0 ? vpad : 0) + "px";
                  if (vpad < 0) {
                    wrapper.style.marginTop = vpad + "px";
                    wrapper.style.marginBottom = vpad + "px";
                  }
                  const br =
                    (params.hPad > 0 && params.radius === 0
                      ? 0
                      : params.radius) + "px";
                  wrapper.style.borderRadius = br;
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  wrapper.style.boxDecorationBreak = "clone";
                  wrapper.style.WebkitBoxDecorationBreak = "clone";
                }
                this.applyBorderStyleToElement(
                  wrapper,
                  headingEntry.textColor,
                  headingEntry.backgroundColor,
                  headingEntry,
                );
              } else {
                wrapper.style.background = "";
                {
                  const params = this.getHighlightParams(headingEntry);
                  wrapper.style.backgroundColor = this.hexToRgba(
                    headingEntry.backgroundColor,
                    params.opacity,
                  );
                  const vpad = params.vPad;
                  wrapper.style.paddingLeft = wrapper.style.paddingRight =
                    params.hPad + "px";
                  wrapper.style.paddingTop = wrapper.style.paddingBottom =
                    (vpad >= 0 ? vpad : 0) + "px";
                  if (vpad < 0) {
                    wrapper.style.marginTop = vpad + "px";
                    wrapper.style.marginBottom = vpad + "px";
                  }
                  const br =
                    (params.hPad > 0 && params.radius === 0
                      ? 0
                      : params.radius) + "px";
                  wrapper.style.borderRadius = br;
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  wrapper.style.boxDecorationBreak = "clone";
                  wrapper.style.WebkitBoxDecorationBreak = "clone";
                }
                this.applyBorderStyleToElement(
                  wrapper,
                  null,
                  headingEntry.backgroundColor,
                  headingEntry,
                );
              }
              const children = Array.from(headingEl.childNodes);
              children.forEach((ch) => wrapper.appendChild(ch));
              headingEl.appendChild(wrapper);
              try {
                const info = this._domRefs.get(block);
                if (info) info.matchCount = 1;
              } catch (e) {}
            }
            continue;
          } else {
            const c = headingEntry.color || headingEntry.textColor;
            if (c) {
              headingEl.style.color = c;
              try {
                headingEl.style.setProperty("--highlight-color", c);
              } catch (e) {}
              try {
                const info = this._domRefs.get(block);
                if (info) info.matchCount = 1;
              } catch (e) {}
              continue;
            }
          }
        }
      }

      // DECODE HTML ENTITIES FOR READING MODE COMPATIBILITY
      const originalText = text;
      text = this.decodeHtmlEntities(text);

      // Log if decoding changed the text (for debugging)
      if (
        originalText !== text &&
        (text.includes("✓") || originalText.includes("&#10003;"))
      ) {
        debugLog("PROCESSBLOCK", "Decoded checkmark:", {
          from: originalText.substring(0, 30),
          to: text.substring(0, 30),
        });
      }

      // Define isBlacklisted helper function early so it can be used throughout
      const isBlacklisted = (textToCheck) => {
        try {
          return this.isWordBlacklisted(textToCheck, opts.filePath);
        } catch (e) {
          return false;
        }
      };

      // For forced processing, use unlimited matches; otherwise cap (lower in extreme mode)
      const isForced =
        (opts && opts.forceProcess) || this.settings.forceFullRenderInReading;
      const maxMatches =
        typeof opts.maxMatches === "number"
          ? opts.maxMatches
          : isForced
            ? Infinity
            : this.settings && this.settings.extremeLightweightMode
              ? 200
              : 500;
      let matches = [];

      // DETECT INLINE SPOILERS to skip (Reading Mode)
      try {
        const spoilerRegex = /\|\|.*?\|\|/g;
        let sMatch;
        while ((sMatch = spoilerRegex.exec(text)) !== null) {
          matches.push({
            start: sMatch.index,
            end: sMatch.index + sMatch[0].length,
            skip: true,
            // Dummy props for sorting/merging compatibility
            color: undefined,
            styleType: "text",
          });
        }
      } catch (e) {}

      // FIRST: Process text+bg entries (they have priority) - with chunking for performance
      // Extract text+bg entries from the already-filtered entries array to ensure they match the same rules
      let textBgEntries = entries.filter((e) => e && e.isTextBg === true);
      const TEXT_BG_CHUNK_SIZE = 10; // Process text+bg entries in chunks of 10 to avoid lag
      try {
        debugLog("TEXTBG_ENTRIES", `count=${textBgEntries.length}`);
      } catch (_) {}
      try {
        debugLog(
          "PROCESSBLOCK_TEXT",
          `text="${text}", length=${text.length}, containsColon=${text.includes(":")}, containsPM=${text.toLowerCase().includes("pm")}`,
        );
      } catch (_) {}

      if (textBgEntries.length > TEXT_BG_CHUNK_SIZE) {
        debugLog("TEXTBG_CHUNK", `Processing ${textBgEntries.length} entries in chunks`);
        // Process in chunks
        for (
          let i = 0;
          i < textBgEntries.length && matches.length < maxMatches;
          i += TEXT_BG_CHUNK_SIZE
        ) {
          const chunk = textBgEntries.slice(i, i + TEXT_BG_CHUNK_SIZE);
          for (const entry of chunk) {
            if (!entry || entry.invalid) continue;

            try {
              if (entry.fastTest && typeof entry.fastTest === "function") {
                const fastTestResult = entry.fastTest(text);
                if (!fastTestResult) {
                  if (entry.presetLabel && entry.presetLabel.includes("Time")) {
                    debugLog("FASTTEST_SKIP", `Skipped '${entry.presetLabel}' for text: "${text}"`);
                  }
                  continue;
                }
              }
            } catch (e) {}

            const regex = entry.regex;
            if (!regex) continue;

            const _matches = this.safeMatchLoop(regex, text);
            if (entry.presetLabel && entry.presetLabel.includes("Time")) {
              debugLog("TIME_MATCH_CHECK", `Entry: ${entry.presetLabel}, pattern: ${entry.pattern}, matches: ${_matches.length}, text: "${text}"`);
            }
            for (const match of _matches) {
              const matchedText = match[0];
              const matchStart = match.index;
              const matchEnd = match.index + matchedText.length;

              if (!this.matchSatisfiesType(text, matchStart, matchEnd, entry))
                continue;

              let fullWordStart = matchStart;
              let fullWordEnd = matchEnd;
              if (!this.isSentenceLikePattern(entry.pattern)) {
                while (
                  fullWordStart > 0 &&
                  (/[A-Za-z0-9]/.test(text[fullWordStart - 1]) ||
                    text[fullWordStart - 1] === "-" ||
                    text[fullWordStart - 1] === "'")
                ) {
                  fullWordStart--;
                }
                while (
                  fullWordEnd < text.length &&
                  (/[A-Za-z0-9]/.test(text[fullWordEnd]) ||
                    text[fullWordEnd] === "-" ||
                    text[fullWordEnd] === "'")
                ) {
                  fullWordEnd++;
                }
              }
              const fullWord = this.isSentenceLikePattern(entry.pattern)
                ? matchedText
                : text.substring(fullWordStart, fullWordEnd);

              if (isBlacklisted(fullWord)) continue;

              const mtLower = String(
                (entry && entry.matchType) ||
                  (this.settings.partialMatch ? "contains" : "exact"),
              ).toLowerCase();
              let colorStart = matchStart;
              let colorEnd = matchEnd;
              if (
                !this.isSentenceLikePattern(entry.pattern) &&
                (mtLower === "contains" ||
                  mtLower === "startswith" ||
                  mtLower === "endswith")
              ) {
                colorStart = fullWordStart;
                colorEnd = fullWordEnd;
              }

              matches.push({
                start: colorStart,
                end: colorEnd,
                textColor: entry.textColor,
                backgroundColor: entry.backgroundColor,
                isTextBg: true,
                entryLabel: entry.presetLabel || entry.pattern.substring(0, 20),
                entryRef: entry,
              });
              try {
                debugLog(
                  "TEXTBG_MATCH_ADDED",
                  `entry="${entry.presetLabel || entry.pattern.substring(0, 20)}", text="${text.substring(colorStart, colorEnd)}", position=${colorStart}-${colorEnd}`,
                );
              } catch (_) {}

              if (matches.length > maxMatches) break;
            }

            if (matches.length > maxMatches) break;
          }
        }
      } else {
        debugLog("TEXTBG_SMALL", `Processing ${textBgEntries.length} entries directly`);
        // Process all at once if fewer than chunk size
        for (const entry of textBgEntries) {
          if (!entry || entry.invalid) continue;

          try {
            if (entry.fastTest && typeof entry.fastTest === "function") {
              const fastTestResult = entry.fastTest(text);
              if (!fastTestResult) {
                if (entry.presetLabel && entry.presetLabel.includes("Time")) {
                  debugLog("FASTTEST_SKIP_SMALL", `Skipped '${entry.presetLabel}' for text: "${text}"`);
                }
                continue;
              }
            }
          } catch (e) {}

          const regex = entry.regex;
          if (!regex) continue;

          const _matches = this.safeMatchLoop(regex, text);
          if (entry.presetLabel && entry.presetLabel.includes("Time")) {
            debugLog("TIME_MATCH_CHECK_SMALL", `Entry: ${entry.presetLabel}, matches: ${_matches.length}, text: "${text}"`);
          }
          for (const match of _matches) {
            const matchedText = match[0];
            const matchStart = match.index;
            const matchEnd = match.index + matchedText.length;

            if (!this.matchSatisfiesType(text, matchStart, matchEnd, entry))
              continue;

            let fullWordStart = matchStart;
            let fullWordEnd = matchEnd;
            if (!this.isSentenceLikePattern(entry.pattern)) {
              while (
                fullWordStart > 0 &&
                (/[A-Za-z0-9]/.test(text[fullWordStart - 1]) ||
                  text[fullWordStart - 1] === "-" ||
                  text[fullWordStart - 1] === "'")
              ) {
                fullWordStart--;
              }
              while (
                fullWordEnd < text.length &&
                (/[A-Za-z0-9]/.test(text[fullWordEnd]) ||
                  text[fullWordEnd] === "-" ||
                  text[fullWordEnd] === "'")
              ) {
                fullWordEnd++;
              }
            }
            const fullWord = this.isSentenceLikePattern(entry.pattern)
              ? matchedText
              : text.substring(fullWordStart, fullWordEnd);

            if (isBlacklisted(fullWord)) continue;

            const mtLower = String(
              (entry && entry.matchType) ||
                (this.settings.partialMatch ? "contains" : "exact"),
            ).toLowerCase();
            let colorStart = matchStart;
            let colorEnd = matchEnd;
            if (
              !this.isSentenceLikePattern(entry.pattern) &&
              (mtLower === "contains" ||
                mtLower === "startswith" ||
                mtLower === "endswith")
            ) {
              colorStart = fullWordStart;
              colorEnd = fullWordEnd;
            }

            matches.push({
              start: colorStart,
              end: colorEnd,
              textColor: entry.textColor,
              backgroundColor: entry.backgroundColor,
              isTextBg: true,
              entryLabel: entry.presetLabel || entry.pattern.substring(0, 20),
              entryRef: entry,
            });
            try {
              debugLog(
                "TEXTBG_MATCH_ADDED",
                `entry="${entry.presetLabel || entry.pattern.substring(0, 20)}", text="${text.substring(colorStart, colorEnd)}", position=${colorStart}-${colorEnd}`,
              );
            } catch (_) {}

            if (matches.length > maxMatches) break;
          }

          if (matches.length > maxMatches) break;
        }
      }
      try {
        const tbCount = matches.filter((m) => m && m.isTextBg).length;
        debugLog("TEXTBG_MATCHES", `count=${tbCount}`);
      } catch (_) {}

      {
        // Filter out text+bg entries from simple pattern matching (they're already handled above)
        // This prevents creating duplicate spans for entries with styleType: "both"
        // ALSO: Exclude text-only partial match entries (contains, startsWith, endsWith) since they're handled by the dedicated partial match section below
        let textOnlyEntries = entries.filter((e) => !e || !e.isTextBg);
        // Exclude entries with partial match types based on actual matchType (with defaults)
        textOnlyEntries = textOnlyEntries.filter((e) => {
          if (!e || e.isTextBg || !(!e.styleType || e.styleType === "text"))
            return true;
          const actualMatchType = String(
            e.matchType || (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase();
          const isSentence = this.isSentenceLikePattern(e.pattern);
          const isLatin = this.isLatinWordPattern(e.pattern);
          return !(
            ["contains", "startswith", "endswith"].includes(actualMatchType) &&
            !isSentence &&
            isLatin
          );
        });
        try {
          const tbCount = entries.filter((e) => e && e.isTextBg).length;
          const toCount = textOnlyEntries.length;
          debugLog(
            "PATTERN_MATCH_FILTER",
            `Total entries=${entries.length}, TextBg=${tbCount}, TextOnly=${toCount}, partialMatch=${this.settings.partialMatch}`,
          );
        } catch (_) {}
        const candidates = textOnlyEntries;
        try {
          debugLog(
            "REGEX_MATCH_INPUT",
            `text="${text.substring(0, 100)}${text.length > 100 ? "..." : ""}", length=${text.length}, candidatesCount=${candidates.length}`,
          );
        } catch (_) {}
        const pm = this._patternMatcher
          ? this._patternMatcher.match(text, candidates, folderEntry)
          : [];
        try {
          debugLog(
            "REGEX_MATCH_RESULT",
            `found=${pm.length} matches from PatternMatcher`,
          );
        } catch (_) {}
        for (const m of pm) {
          const overlappingTextBgIndices = [];
          for (let i = 0; i < matches.length; i++) {
            const tbMatch = matches[i];
            if (!tbMatch || !tbMatch.isTextBg) continue;
            if (m.start < tbMatch.end && m.end > tbMatch.start) {
              overlappingTextBgIndices.push(i);
            }
          }
          if (overlappingTextBgIndices.length > 0) {
            const mLength = m.end - m.start;
            const allShorter = overlappingTextBgIndices.every((i) => {
              const s = matches[i];
              return s.end - s.start < mLength;
            });
            if (!allShorter) {
              continue;
            }
            for (let i = overlappingTextBgIndices.length - 1; i >= 0; i--) {
              matches.splice(overlappingTextBgIndices[i], 1);
            }
          }
          matches.push(m);
          if (matches.length > maxMatches) break;
        }
      }

      // Resolve overlaps from main matching loop first (must run BEFORE Partial Match so longer matches win)
      if (matches.length > 1) {
        debugLog(
          "OVERLAP",
          `Before resolution: ${matches.length} matches found`,
        );

        matches.sort((a, b) => {
          // Prioritize by length first (longer matches win)
          const lenA = a.end - a.start;
          const lenB = b.end - b.start;
          if (lenA !== lenB) return lenB - lenA;

          // Prioritize by pattern length (longer pattern/specificity wins)
          const pLenA = String(
            (a.entryRef || a.entry || {}).pattern || "",
          ).length;
          const pLenB = String(
            (b.entryRef || b.entry || {}).pattern || "",
          ).length;
          if (pLenA !== pLenB) return pLenB - pLenA;

          // Then by start position (earlier wins)
          if (a.start !== b.start) return a.start - b.start;
          // Then by style (text+bg before text-only)
          const aHasText = a.isTextBg
            ? !!(a.textColor && a.textColor !== "currentColor")
            : !!a.color;
          const bHasText = b.isTextBg
            ? !!(b.textColor && b.textColor !== "currentColor")
            : !!b.color;
          if (aHasText && !bHasText) return -1;
          if (!aHasText && bHasText) return 1;
          if (a.isTextBg && !b.isTextBg) return -1;
          if (!a.isTextBg && b.isTextBg) return 1;
          return 0;
        });

        // Use a greedy algorithm: iterate through sorted matches and skip any that overlap
        let nonOverlapping = [];
        for (const m of matches) {
          let overlapsWithSelected = false;

          for (const selected of nonOverlapping) {
            if (m.start < selected.end && m.end > selected.start) {
              overlapsWithSelected = true;
              break;
            }
          }

          if (!overlapsWithSelected) {
            nonOverlapping.push(m);
          }
        }

        matches = nonOverlapping;
      }

      // --- Partial Match coloring for text+bg entries ---
      if (
        textBgEntries.some((e) =>
          ["contains", "startswith", "endswith"].includes(
            String(e.matchType || "").toLowerCase(),
          ),
        )
      ) {
        const wordRegex = /[A-Za-z0-9'\-]+/g;
        let match;
        while ((match = wordRegex.exec(text))) {
          const w = match[0];
          const start = match.index;
          const end = start + w.length;

          // EXPERT EXPERIMENT: Word Completion Coloring
          // If enabled, skip matches that are not followed by a space or punctuation (i.e. skip if at EOF or followed by newline)
          if (this.settings.enableWordCompletionColoring) {
            const nextChar = text[end];
            if (!nextChar || nextChar === "\n" || nextChar === "\r") continue;
          }

          if (isBlacklisted(w)) continue;

          // Check text & background entries for partial matches
          for (const entry of textBgEntries.filter((e) =>
            ["contains", "startswith", "endswith"].includes(
              String(e.matchType || "").toLowerCase(),
            ),
          )) {
            if (!entry || entry.invalid) continue;
            if (/^[\s~`!@#$%^&*()\-\_=+\[\]{};:'",.<>\/?\\|]+$/.test(entry.pattern))
              continue;
            if (isBlacklisted(entry.pattern)) continue;

            const mt = String(entry.matchType || "").toLowerCase();
            const cs =
              typeof entry._caseSensitiveOverride === "boolean"
                ? entry._caseSensitiveOverride
                : typeof entry.caseSensitive === "boolean"
                  ? entry.caseSensitive
                  : this.settings.caseSensitive;
            const word = cs ? w : w.toLowerCase();
            const pat = cs
              ? String(entry.pattern || "")
              : String(entry.pattern || "").toLowerCase();
            const ok =
              mt === "contains"
                ? word.includes(pat)
                : mt === "startswith"
                  ? word.startsWith(pat)
                  : mt === "endswith"
                    ? word.endsWith(pat)
                    : false;
            if (ok) {
              // Check if this partial match overlaps with any existing match
              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                if (start < existingMatch.end && end > existingMatch.start) {
                  overlapsWithExisting = true;
                  break;
                }
              }

              // Add partial match if no overlap with existing, or replace if replacing smaller overlaps
              if (!overlapsWithExisting) {
                matches.push({
                  start: start,
                  end: end,
                  textColor: entry.textColor,
                  backgroundColor: entry.backgroundColor,
                  isTextBg: true,
                  styleType: "both",
                  entryRef: entry,
                });
              } else {
                // Remove smaller overlapping matches and add the full word instead
                matches = matches.filter(
                  (m) =>
                    !(
                      m.start >= start &&
                      m.end <= end &&
                      m.end - m.start < end - start
                    ),
                );
                matches.push({
                  start: start,
                  end: end,
                  textColor: entry.textColor,
                  backgroundColor: entry.backgroundColor,
                  isTextBg: true,
                  styleType: "both",
                  entryRef: entry,
                });
              }
              break;
            }
          }

          // Avoid infinite loop on zero-length matches for this wordRegex
          try {
            if (
              typeof wordRegex.lastIndex === "number" &&
              wordRegex.lastIndex === match.index
            )
              wordRegex.lastIndex++;
          } catch (e) {}
        }
      }

      // --- Partial Match coloring --- (respect already-resolved matches)
      // Only process text-only entries (styleType === 'text') in this section
      {
        const textOnlyEntries = entries.filter(
          (e) =>
            e &&
            !e.invalid &&
            (!e.styleType || e.styleType === "text") &&
            !e.isTextBg &&
            ["contains", "startswith", "endswith"].includes(
              String(e.matchType || "").toLowerCase(),
            ),
        );
        if (textOnlyEntries.length > 0) {
          const wordRegex = /[A-Za-z0-9'\-]+/g;
          let match;
          while ((match = wordRegex.exec(text))) {
            const w = match[0];
            const start = match.index;
            const end = start + w.length;
            if (isBlacklisted(w)) continue;
            for (const entry of textOnlyEntries) {
              if (!entry || entry.invalid) continue;
              if (
                /^[\s~`!@#$%^&*()\-\_=+\[\]{};:'",.<>\/?\\|]+$/.test(
                  entry.pattern,
                )
              )
                continue;
              if (isBlacklisted(entry.pattern)) continue;
              // Use same default logic as PatternMatcher to determine actual matchType
              const mt = String(
                entry.matchType ||
                  (this.settings.partialMatch ? "contains" : "exact"),
              ).toLowerCase();
              const cs =
                typeof entry._caseSensitiveOverride === "boolean"
                  ? entry._caseSensitiveOverride
                  : typeof entry.caseSensitive === "boolean"
                    ? entry.caseSensitive
                    : this.settings.caseSensitive;
              const word = cs ? w : w.toLowerCase();
              const pat = cs
                ? String(entry.pattern || "")
                : String(entry.pattern || "").toLowerCase();
              const ok =
                mt === "contains"
                  ? word.includes(pat)
                  : mt === "startswith"
                    ? word.startsWith(pat)
                    : mt === "endswith"
                      ? word.endsWith(pat)
                      : false;
              if (ok) {
                // wordRegex already found the complete word, so start/end are word boundaries
                // No need to expand further
                const matchStart = start;
                const matchEnd = end;

                // Check if this partial match overlaps with any existing match
                let overlapsWithExisting = false;
                for (const existingMatch of matches) {
                  if (
                    matchStart < existingMatch.end &&
                    matchEnd > existingMatch.start
                  ) {
                    overlapsWithExisting = true;
                    break;
                  }
                }
                // Add partial match if no overlap with existing, or replace if replacing smaller overlaps
                if (!overlapsWithExisting) {
                  const useColor =
                    folderEntry && folderEntry.defaultColor
                      ? folderEntry.defaultColor
                      : entry.textColor && entry.textColor !== "currentColor"
                        ? entry.textColor
                        : entry.color;
                  matches.push({
                    start: matchStart,
                    end: matchEnd,
                    color: useColor,
                    styleType: "text",
                    word: w,
                    entry: entry,
                    folderEntry: folderEntry,
                  });
                } else {
                  // Remove smaller overlapping matches and add the full word instead
                  matches = matches.filter(
                    (m) =>
                      !(
                        m.start >= matchStart &&
                        m.end <= matchEnd &&
                        m.end - m.start < matchEnd - matchStart
                      ),
                  );
                  const useColor =
                    folderEntry && folderEntry.defaultColor
                      ? folderEntry.defaultColor
                      : entry.textColor && entry.textColor !== "currentColor"
                        ? entry.textColor
                        : entry.color;
                  matches.push({
                    start: matchStart,
                    end: matchEnd,
                    color: useColor,
                    styleType: "text",
                    word: w,
                    entry: entry,
                    folderEntry: folderEntry,
                  });
                }
                break;
              }
            }
            // Avoid infinite loop on zero-length matches for this wordRegex
            try {
              if (
                typeof wordRegex.lastIndex === "number" &&
                wordRegex.lastIndex === match.index
              )
                wordRegex.lastIndex++;
            } catch (e) {}
          }
        }
      }

      // --- Add literal pattern matches to the main matches array ---
      // Collect literal matches per-node (not at block level) to ensure proper positioning
      try {
        const literalEntries = this._literalEntriesToProcess || [];
        for (const entry of literalEntries) {
          const rawPatt = String(entry.pattern || "");
          const patt = this.decodeHtmlEntities(rawPatt);
          if (!patt) continue;
          const cs =
            typeof entry._caseSensitiveOverride === "boolean"
              ? entry._caseSensitiveOverride
              : typeof entry.caseSensitive === "boolean"
                ? entry.caseSensitive
                : this.settings.caseSensitive;
          const textSearch = cs ? text : text.toLowerCase();
          const pattSearch = cs ? patt : patt.toLowerCase();
          let pos = 0;
          while ((pos = textSearch.indexOf(pattSearch, pos)) !== -1) {
            const start = pos;
            const end = pos + pattSearch.length;
            pos += pattSearch.length;
            if (!this.matchSatisfiesType(text, start, end, entry)) continue;
            const mtLower = String(
              (entry && entry.matchType) ||
                (this.settings.partialMatch ? "contains" : "exact"),
            ).toLowerCase();
            let expandedStart = start;
            let expandedEnd = end;
            if (
              !this.isSentenceLikePattern(entry.pattern) &&
              (mtLower === "contains" ||
                mtLower === "startswith" ||
                mtLower === "endswith")
            ) {
              while (
                expandedStart > 0 &&
                (/[A-Za-z0-9]/.test(text[expandedStart - 1]) ||
                  text[expandedStart - 1] === "-" ||
                  text[expandedStart - 1] === "'")
              ) {
                expandedStart--;
              }
              while (
                expandedEnd < text.length &&
                (/[A-Za-z0-9]/.test(text[expandedEnd]) ||
                  text[expandedEnd] === "-" ||
                  text[expandedEnd] === "'")
              ) {
                expandedEnd++;
              }
            }
            const fullWord = this.isSentenceLikePattern(entry.pattern)
              ? text.substring(start, end)
              : text.substring(expandedStart, expandedEnd);
            if (isBlacklisted(fullWord)) continue;

            const useColor =
              folderEntry && folderEntry.defaultColor
                ? folderEntry.defaultColor
                : entry.textColor && entry.textColor !== "currentColor"
                  ? entry.textColor
                  : entry.color;
            matches.push({
              start: expandedStart,
              end: expandedEnd,
              color: useColor,
              styleType: entry.styleType || "text",
              word: entry.pattern,
              entry: entry,
              folderEntry: folderEntry,
            });
          }
        }
      } catch (e) {
        debugLog(
          "LITERAL_MATCH_ADDITION",
          `Error adding literal matches: ${e.message}`,
        );
      }

      // --- Symbol-Word Coloring ---
      for (const entry of entries) {
        if (!entry || entry.invalid) continue;
        if (/^[\s~`!@#$%^&*()\-\_=+\[\]{};:'",.<>\/?\\|]+$/.test(entry.pattern)) {
          const regex = entry.regex;
          if (!regex) continue;
          const _matches = this.safeMatchLoop(regex, text);
          for (const match of _matches) {
            // Check if entry is text+bg (has both colors) or regular (single color)
            if (entry.isTextBg && entry.backgroundColor) {
              matches.push({
                start: match.index,
                end: match.index + match[0].length,
                textColor: entry.textColor,
                backgroundColor: entry.backgroundColor,
                isTextBg: true,
                styleType: "both",
                word: match[0],
                entryRef: entry,
                // Copy custom styling properties
                backgroundOpacity: entry.backgroundOpacity,
                highlightBorderRadius: entry.highlightBorderRadius,
                highlightHorizontalPadding: entry.highlightHorizontalPadding,
                highlightVerticalPadding: entry.highlightVerticalPadding,
                enableBorderThickness: entry.enableBorderThickness,
                borderStyle: entry.borderStyle,
                borderLineStyle: entry.borderLineStyle,
                borderOpacity: entry.borderOpacity,
                borderThickness: entry.borderThickness,
              });
            } else {
              const useColor =
                folderEntry && folderEntry.defaultColor
                  ? folderEntry.defaultColor
                  : entry.textColor && entry.textColor !== "currentColor"
                    ? entry.textColor
                    : entry.color;
              matches.push({
                start: match.index,
                end: match.index + match[0].length,
                color: useColor,
                word: match[0],
                highlightHorizontalPadding:
                  this.settings.highlightHorizontalPadding ?? 4,
                highlightBorderRadius: this.settings.highlightBorderRadius ?? 8,
              });
            }
          }
        }
      }

      if (this.settings.symbolWordColoring) {
        const symbolEntries = entries.filter(
          (entry) =>
            entry &&
            !entry.invalid &&
            /^[\s~`!@#$%^&*()\-\_=+\[\]{};:'",.<>\/?\\|]+$/.test(
              entry.pattern,
            ),
        );
        if (symbolEntries.length > 0) {
          const wordRegex = /\b\w+[^\s]*\b/g;
          let match;
          while ((match = wordRegex.exec(text))) {
            const w = match[0];
            const start = match.index;
            const end = start + w.length;
            if (isBlacklisted(w)) continue;
            for (const symEntry of symbolEntries) {
              const testRe =
                symEntry.testRegex ||
                (this.settings.caseSensitive
                  ? new RegExp(this.escapeRegex(symEntry.pattern))
                  : new RegExp(this.escapeRegex(symEntry.pattern), "i"));
              if (testRe.test(w)) {
                // Check if entry is text+bg (has both colors) or regular (single color)
                if (symEntry.isTextBg && symEntry.backgroundColor) {
                  matches.push({
                    start,
                    end,
                    textColor: symEntry.textColor,
                    backgroundColor: symEntry.backgroundColor,
                    isTextBg: true,
                    styleType: "both",
                    word: w,
                    entryRef: symEntry,
                    // Copy custom styling properties
                    backgroundOpacity: symEntry.backgroundOpacity,
                    highlightBorderRadius: symEntry.highlightBorderRadius,
                    highlightHorizontalPadding:
                      symEntry.highlightHorizontalPadding,
                    highlightVerticalPadding: symEntry.highlightVerticalPadding,
                    enableBorderThickness: symEntry.enableBorderThickness,
                    borderStyle: symEntry.borderStyle,
                    borderLineStyle: symEntry.borderLineStyle,
                    borderOpacity: symEntry.borderOpacity,
                    borderThickness: symEntry.borderThickness,
                  });
                } else {
                  const useColor =
                    folderEntry && folderEntry.defaultColor
                      ? folderEntry.defaultColor
                      : symEntry.textColor &&
                          symEntry.textColor !== "currentColor"
                        ? symEntry.textColor
                        : symEntry.color;
                  matches.push({ start, end, color: useColor, word: w });
                }
                break;
              }
            }
            // Avoid infinite loop on zero-length matches for this wordRegex
            try {
              if (
                typeof wordRegex.lastIndex === "number" &&
                wordRegex.lastIndex === match.index
              )
                wordRegex.lastIndex++;
            } catch (e) {}
          }
        }
      }

      // Remove overlapping matches, prefer longest - handles overlaps from Partial Match and Symbol-Word features
      // (main loop overlaps are already resolved above)
      if (matches.length > 1) {
        matches.sort((a, b) => {
          // Prioritize by length first (longer matches win)
          const lenA = a.end - a.start;
          const lenB = b.end - b.start;
          if (lenA !== lenB) return lenB - lenA;

          // Prioritize by pattern length (longer pattern/specificity wins)
          const pLenA = String(
            (a.entryRef || a.entry || {}).pattern || "",
          ).length;
          const pLenB = String(
            (b.entryRef || b.entry || {}).pattern || "",
          ).length;
          if (pLenA !== pLenB) return pLenB - pLenA;

          // Then by start position (earlier wins)
          if (a.start !== b.start) return a.start - b.start;
          // Then by style (text+bg before text-only)
          const aHasText = a.isTextBg
            ? !!(a.textColor && a.textColor !== "currentColor")
            : !!a.color;
          const bHasText = b.isTextBg
            ? !!(b.textColor && b.textColor !== "currentColor")
            : !!b.color;
          if (aHasText && !bHasText) return -1;
          if (!aHasText && bHasText) return 1;
          if (a.isTextBg && !b.isTextBg) return -1;
          if (!a.isTextBg && b.isTextBg) return 1;
          return 0;
        });

        // Use a greedy algorithm to remove overlaps
        let nonOverlapping = [];
        for (const m of matches) {
          let overlapsWithSelected = false;

          for (const selected of nonOverlapping) {
            if (m.start < selected.end && m.end > selected.start) {
              overlapsWithSelected = true;
              break;
            }
          }

          if (!overlapsWithSelected) {
            nonOverlapping.push(m);
          }
        }

        matches = nonOverlapping;
      }

      // Sort the final result by start position for rendering
      matches.sort((a, b) => a.start - b.start);
      let nonOverlapping = matches;
      // Dedup exact overlaps (same start and end) - can happen when preset patterns are processed specially
      const seenRanges = new Set();
      const beforeDedup = nonOverlapping.length;
      nonOverlapping = nonOverlapping.filter((m) => {
        const key = `${m.start}-${m.end}`;
        if (seenRanges.has(key)) {
          debugLog(
            "DEDUP_MATCH",
            `Removing duplicate match: '${m.word || "unknown"}' at ${m.start}-${m.end}`,
          );
          return false;
        }
        seenRanges.add(key);
        return true;
      });
      if (beforeDedup !== nonOverlapping.length) {
        debugLog(
          "DEDUP_SUMMARY",
          `Removed ${beforeDedup - nonOverlapping.length} duplicates`,
        );
      }

      let lastEnd = 0;
      try {
        debugLog(
          "READING_BLOCK",
          `matches=${nonOverlapping.length}, hideTextColors=${this.settings.hideTextColors === true}, hideHighlights=${this.settings.hideHighlights === true}`,
        );
      } catch (_) {}
      if (nonOverlapping.length) {
        const frag = document.createDocumentFragment();
        let pos = 0;
        let i = 0;
        while (i < nonOverlapping.length) {
          let m = nonOverlapping[i];
          let j = i + 1;
          // Merge consecutive matches with same color or style (including time patterns and other presets)
          while (
            j < nonOverlapping.length &&
            nonOverlapping[j].start === nonOverlapping[j - 1].end &&
            !m.isTextBg &&
            !nonOverlapping[j].isTextBg &&
            (nonOverlapping[j].color === m.color ||
              (nonOverlapping[j].textColor === m.textColor &&
                nonOverlapping[j].backgroundColor === m.backgroundColor) ||
              nonOverlapping[j].styleType === m.styleType)
          ) {
            m = {
              start: m.start,
              end: nonOverlapping[j].end,
              color: m.color,
              styleType: m.styleType,
              textColor: m.textColor,
              backgroundColor: m.backgroundColor,
              skip: m.skip,
            };
            j++;
          }
          if (m.start > pos)
            frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
          if (m.skip) {
            frag.appendChild(
              document.createTextNode(text.slice(m.start, m.end)),
            );
            pos = m.end;
            i = j;
            continue;
          }
          if (effectiveStyle === "none") {
            // Explicit 'none' style: do not apply any coloring, just append raw text
            frag.appendChild(
              document.createTextNode(text.slice(m.start, m.end)),
            );
          } else {
            // Check for double-span prevention (User Request: No spans inside .cm-strong/.cm-em for bold/italic presets)
            // This prevents creating duplicate highlights when CSS already styles the parent strong/em element
            const entry = m.entryRef || m.entry;
            const presetLabel = entry?.presetLabel || "";
            const isBoldItalicPreset = /bold|italic/i.test(presetLabel);
            let skipWrapper = false;
            if (isBoldItalicPreset) {
              const parent = node.parentElement;
              if (
                parent &&
                (parent.closest(
                  ".cm-strong, .cm-em, .markdown-rendered strong, .markdown-rendered em",
                ) ||
                  (parent.matches &&
                    parent.matches(
                      ".cm-strong, .cm-em, .markdown-rendered strong, .markdown-rendered em",
                    )))
              ) {
                skipWrapper = true;
              }
            }

            if (skipWrapper) {
              frag.appendChild(
                document.createTextNode(text.slice(m.start, m.end)),
              );
              pos = m.end;
              i = j;
              continue;
            }

            const span = document.createElement("span");
            span.className = "always-color-text-highlight";
            span.textContent = text.slice(m.start, m.end);

            // Determine style based on styleType (for regular entries) or isTextBg flag
            const styleType = m.isTextBg ? "both" : m.styleType || "text";

            const hideText = this.settings.hideTextColors === true;
            const hideBg = this.settings.hideHighlights === true;
            let shouldAppendSpan = true; // Flag to track if we should append the span

            if (styleType === "text") {
              if (hideText) {
                // If text is hidden but we have custom CSS, we should still use a span
                if (
                  this.settings.enableCustomCss &&
                  m.entryRef &&
                  m.entryRef.customCss
                ) {
                  // Keep span, don't set shouldAppendSpan to false
                } else {
                  frag.appendChild(
                    document.createTextNode(text.slice(m.start, m.end)),
                  );
                  shouldAppendSpan = false; // Don't append the span if we're hiding text
                }
              }

              if (shouldAppendSpan) {
                const textColor =
                  m.color ||
                  (m.textColor && m.textColor !== "currentColor"
                    ? m.textColor
                    : null);
                if (textColor && !hideText) {
                  try {
                    span.style.setProperty("color", textColor, "important");
                  } catch (_) {
                    span.style.color = textColor;
                  }
                  try {
                    span.style.setProperty("--highlight-color", textColor);
                  } catch (e) {}
                }
                try {
                  debugLog(
                    "READING_TEXT_FULL",
                    `applied color=${textColor || "none"}, hideTextColors=${this.settings.hideTextColors === true}, hideHighlights=${this.settings.hideHighlights === true}`,
                  );
                } catch (_) {}
              }
            } else if (styleType === "highlight") {
              if (hideBg) {
                // If bg is hidden but we have custom CSS, we should still use a span
                if (
                  this.settings.enableCustomCss &&
                  m.entryRef &&
                  m.entryRef.customCss
                ) {
                  // Keep span, don't set shouldAppendSpan to false
                } else {
                  frag.appendChild(
                    document.createTextNode(text.slice(m.start, m.end)),
                  );
                  shouldAppendSpan = false; // Don't append the span if we're hiding highlights
                }
              }

              if (shouldAppendSpan) {
                const bgColor =
                  m.backgroundColor ||
                  m.color ||
                  (m.textColor && m.textColor !== "currentColor"
                    ? m.textColor
                    : null) ||
                  (folderEntry && folderEntry.defaultColor
                    ? folderEntry.defaultColor
                    : null);
                span.style.background = "";
                try {
                  span.style.setProperty(
                    "display",
                    "inline-block",
                    "important",
                  );
                } catch (_) {
                  span.style.display = "inline-block";
                }
                if (!hideBg) {
                  const entryRef = m.entryRef || m.entry || null;
                  const params = this.getHighlightParams(entryRef);
                  try {
                    span.style.setProperty(
                      "background-color",
                      this.hexToRgba(bgColor, params.opacity ?? 25),
                      "important",
                    );
                  } catch (_) {
                    span.style.backgroundColor = this.hexToRgba(
                      bgColor,
                      params.opacity ?? 25,
                    );
                  }
                  try {
                    const vpad = params.vPad;
                    span.style.setProperty(
                      "padding-left",
                      params.hPad + "px",
                      "important",
                    );
                    span.style.setProperty(
                      "padding-right",
                      params.hPad + "px",
                      "important",
                    );
                    span.style.setProperty(
                      "padding-top",
                      (vpad >= 0 ? vpad : 0) + "px",
                      "important",
                    );
                    span.style.setProperty(
                      "padding-bottom",
                      (vpad >= 0 ? vpad : 0) + "px",
                      "important",
                    );
                    if (vpad < 0) {
                      span.style.setProperty(
                        "margin-top",
                        vpad + "px",
                        "important",
                      );
                      span.style.setProperty(
                        "margin-bottom",
                        vpad + "px",
                        "important",
                      );
                    }
                  } catch (_) {
                    const vpad = params.vPad;
                    span.style.paddingLeft = span.style.paddingRight =
                      params.hPad + "px";
                    span.style.paddingTop = span.style.paddingBottom =
                      (vpad >= 0 ? vpad : 0) + "px";
                    if (vpad < 0) {
                      span.style.marginTop = vpad + "px";
                      span.style.marginBottom = vpad + "px";
                    }
                  }
                  const br =
                    (params.hPad > 0 && params.radius === 0
                      ? 0
                      : params.radius) + "px";
                  try {
                    span.style.setProperty("border-radius", br, "important");
                  } catch (_) {
                    span.style.borderRadius = br;
                  }
                  const borderCss = this.generateBorderStyle(
                    null,
                    bgColor,
                    entryRef,
                  );
                  if (borderCss) {
                    borderCss.trim().split(";").map(s => s.trim()).filter(Boolean).forEach(decl => {
                      const ci = decl.indexOf(":");
                      if (ci === -1) return;
                      const bp = decl.slice(0, ci).trim();
                      const bv = decl.slice(ci + 1).replace(/!important/gi, "").trim();
                      try { span.style.setProperty(bp, bv, "important"); } catch (_) {}
                    });
                  }
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  span.style.boxDecorationBreak = "clone";
                  span.style.WebkitBoxDecorationBreak = "clone";
                }
                try {
                  debugLog(
                    "READING_HIGHLIGHT",
                    `applied bg=${bgColor || "none"}`,
                  );
                } catch (_) {}
              }
            } else if (styleType === "both") {
              const textColor =
                m.textColor && m.textColor !== "currentColor"
                  ? m.textColor
                  : m.color || null;
              const bgColor =
                m.backgroundColor ||
                m.color ||
                (folderEntry && folderEntry.defaultColor
                  ? folderEntry.defaultColor
                  : null);
              if (!hideText && textColor) {
                try {
                  span.style.setProperty("color", textColor, "important");
                } catch (_) {
                  span.style.color = textColor;
                }
                try {
                  span.style.setProperty("--highlight-color", textColor);
                } catch (e) {}
              } else if (hideText && !hideBg && !textColor && bgColor) {
                // If we're hiding text but showing bg, and there's no textColor, still apply the span
              }
              if (!hideBg) {
                span.style.background = "";
                const entryRef = m.entryRef || m.entry || null;
                const params = this.getHighlightParams(entryRef);
                try {
                  span.style.setProperty(
                    "background-color",
                    this.hexToRgba(bgColor, params.opacity ?? 25),
                    "important",
                  );
                } catch (_) {
                  span.style.backgroundColor = this.hexToRgba(
                    bgColor,
                    params.opacity ?? 25,
                  );
                }
                try {
                  const vpad = params.vPad;
                  span.style.setProperty(
                    "padding-left",
                    params.hPad + "px",
                    "important",
                  );
                  span.style.setProperty(
                    "padding-right",
                    params.hPad + "px",
                    "important",
                  );
                  span.style.setProperty(
                    "padding-top",
                    (vpad >= 0 ? vpad : 0) + "px",
                    "important",
                  );
                  span.style.setProperty(
                    "padding-bottom",
                    (vpad >= 0 ? vpad : 0) + "px",
                    "important",
                  );
                  if (vpad < 0) {
                    span.style.setProperty(
                      "margin-top",
                      vpad + "px",
                      "important",
                    );
                    span.style.setProperty(
                      "margin-bottom",
                      vpad + "px",
                      "important",
                    );
                  }
                } catch (_) {
                  const vpad = params.vPad;
                  span.style.paddingLeft = span.style.paddingRight =
                    params.hPad + "px";
                  span.style.paddingTop = span.style.paddingBottom =
                    (vpad >= 0 ? vpad : 0) + "px";
                  if (vpad < 0) {
                    span.style.marginTop = vpad + "px";
                    span.style.marginBottom = vpad + "px";
                  }
                }
                const br2 =
                  (params.hPad > 0 && params.radius === 0
                    ? 0
                    : params.radius) + "px";
                try {
                  span.style.setProperty("border-radius", br2, "important");
                } catch (_) {
                  span.style.borderRadius = br2;
                }
                const borderCss = this.generateBorderStyle(
                  hideText ? null : textColor,
                  hideBg ? null : bgColor,
                  entryRef,
                );
                if (borderCss) {
                  borderCss.trim().split(";").map(s => s.trim()).filter(Boolean).forEach(decl => {
                    const ci = decl.indexOf(":");
                    if (ci === -1) return;
                    const bp = decl.slice(0, ci).trim();
                    const bv = decl.slice(ci + 1).replace(/!important/gi, "").trim();
                    try { span.style.setProperty(bp, bv, "important"); } catch (_) {}
                  });
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  span.style.boxDecorationBreak = "clone";
                  span.style.WebkitBoxDecorationBreak = "clone";
                }
                try {
                  debugLog(
                    "READING_BOTH",
                    `applied text=${textColor || "none"}, bg=${bgColor || "none"}`,
                  );
                } catch (_) {}
              } else if (
                hideBg &&
                this.settings.enableCustomCss &&
                m.entryRef &&
                m.entryRef.customCss
              ) {
                // If bg is hidden but we have custom CSS, we should still use a span
                // and maybe set some default layout for custom CSS
                try {
                  span.style.setProperty(
                    "display",
                    "inline-block",
                    "important",
                  );
                } catch (_) {
                  span.style.display = "inline-block";
                }
              }

              if (hideText && hideBg) {
                // Check if we have custom CSS before deciding to hide completely
                if (
                  this.settings.enableCustomCss &&
                  m.entryRef &&
                  m.entryRef.customCss
                ) {
                  // Keep span
                } else {
                  // If both text and bg are hidden, just append the raw text
                  frag.appendChild(
                    document.createTextNode(text.slice(m.start, m.end)),
                  );
                  shouldAppendSpan = false;
                }
              }
            }

            // Apply custom CSS if enabled and entry has it, regardless of hide flags (as long as span exists)
            if (shouldAppendSpan) {
              const entryRef = m.entryRef || m.entry || null;
              debugLog("READING_RENDER_CSS", `Checking for custom CSS on: ${m.pattern || "unknown"}`);
              if (this.settings.enableCustomCss && entryRef?._groupRef?.customCss) {
                this.applyCustomCssToElement(span, entryRef._groupRef);
              }
              this.applyCustomCssToElement(span, entryRef);

              // Also apply border style if it was skipped due to hideBg (only for non-text styleType)
              const entryStyleType = (m.entryRef || m.entry)?.styleType || 'text';
              if (entryStyleType !== 'text') {
                this.applyBorderStyleToElement(
                  span,
                  hideText ? null : (m.textColor || m.color),
                  hideBg ? null : (m.backgroundColor || m.color),
                  entryRef,
                );
              }
            }

            if (shouldAppendSpan) {
              frag.appendChild(span);
            }
          }
          pos = m.end;
          i = j;
        }
        if (pos < text.length)
          frag.appendChild(document.createTextNode(text.slice(pos)));
        node.replaceWith(frag);
        // update dom ref with match count (zero for 'none' style since no highlights applied)
        try {
          const info = this._domRefs.get(block);
          if (info)
            info.matchCount =
              effectiveStyle === "none" ? 0 : nonOverlapping.length;
        } catch (e) {}
      }
    }
  }

  // Async chunked processing to prevent UI freezes on large documents
  async processInChunks(element, entries, folderEntry = null, options = {}) {
    debugLog("CHUNK_START", `Processing ${element.nodeName}.${element.className}, entries: ${entries.length}`);
    // Use TreeWalker to avoid materializing large array of DOM references
    const selector =
      "p, li, div, span, td, th, blockquote, h1, h2, h3, h4, h5, h6";
    const batch = Number(options.batchSize) || 20; // larger default batch to process more blocks per tick

    // Collect blocks using TreeWalker instead of querySelectorAll to be more memory-efficient
    const blocks = [];
    const tags = new Set(
      selector.split(",").map((s) => s.trim().toUpperCase()),
    );

    // OPTION: Include the root element itself if requested (for leaf nodes like table cells)
    if (options.includeSelf && element && tags.has(element.nodeName)) {
      blocks.push(element);
    }

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          return tags.has(node.nodeName)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      },
      false,
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      blocks.push(currentNode);
    }

    const startIndex = Number(options.skipFirstN) || 0;
    const forceProcess = !!options.forceProcess;
    debugLog(
      "CHUNK",
      `start: ${blocks.length} blocks, batch=${batch}, startIndex=${startIndex}, forceProcess=${forceProcess}`,
    );

    for (let i = startIndex; i < blocks.length; i++) {
      // Check global performance monitor per batch unless forced
      if (
        !forceProcess &&
        this.performanceMonitor &&
        this.performanceMonitor.isOverloaded &&
        this.performanceMonitor.isOverloaded()
      ) {
        debugWarn("CHUNK", `paused at block ${i} due to perf overload`);
        const resumeOpts = Object.assign({}, options, { skipFirstN: i });
        setTimeout(() => {
          try {
            this.processInChunks(element, entries, folderEntry, resumeOpts);
          } catch (e) {
            debugError("CHUNK", "retry failed", e);
          }
        }, 300);
        blocks.length = 0; // Clear array to help GC
        return;
      }

      try {
        this._errorRecovery.wrap(
          "PROCESS_BLOCK",
          () =>
            this._processBlock(blocks[i], entries, folderEntry, {
              clearExisting: options.clearExisting !== false,
              effectiveStyle: "text",
              forceProcess:
                forceProcess || this.settings.forceFullRenderInReading,
              maxMatches:
                options && typeof options.maxMatches !== "undefined"
                  ? options.maxMatches
                  : forceProcess || this.settings.forceFullRenderInReading
                    ? Infinity
                    : undefined,
              filePath: options.filePath,
            }),
          () => null,
        );
      } catch (e) {
        debugError("CHUNK", "block error", e);
      }

      // Yield to browser every batch blocks to keep UI responsive
      // Even with forceProcess, we yield periodically to prevent main thread lockup
      const yieldInterval = forceProcess ? 50 : batch; // More frequent yields when forced
      if (i % yieldInterval === 0 && i > 0) {
        // yield to the browser to keep UI responsive
        // use a very short timeout so large documents progress quickly
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    debugLog("CHUNK", `done: ${blocks.length} blocks processed`);

    // Clear blocks array to help garbage collection
    blocks.length = 0;
  }

  _processLivePreviewCallouts(view, force = false) {
    try {
      if (this.settings.disableLivePreviewColoring) return;
      const now = Date.now();
      // OPTIMIZATION: More aggressive throttling (1 second) and skip during typing
      if (
        !force &&
        this._lpLastRun &&
        now - this._lpLastRun < EDITOR_PERFORMANCE_CONSTANTS.CALLOUT_THROTTLE_MS
      )
        return;
      this._lpLastRun = now;
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      // Allow processing in Live Preview, Canvas, or if forced (for lightweight mode support)
      const isLP =
        (root.closest && root.closest(".is-live-preview")) ||
        (root.closest && root.closest(".canvas-node")) ||
        (root.closest && root.closest(".markdown-embed")) ||
        force;
      if (!isLP) return;

      // OPTIMIZATION: Skip processing entirely during active typing - this is key to reducing lag
      if (
        !force &&
        this._isTyping &&
        now - this._lastTypingTime <
          EDITOR_PERFORMANCE_CONSTANTS.TYPING_GRACE_PERIOD_MS
      )
        return;

      // Use requestAnimationFrame to batch DOM reads
      if (this._lpCalloutRaf) return;
      this._lpCalloutRaf = requestAnimationFrame(() => {
        this._lpCalloutRaf = null;
        this._processLivePreviewCalloutsInternal(view, force);
      });
      return;
    } catch (e) {
      try {
        debugError("LP_CALLOUT", "Failed coloring live preview callouts", e);
      } catch (_) {}
    }
  }

  _processLivePreviewCalloutsInternal(view, force = false) {
    try {
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      // Allow processing in Live Preview, Canvas, or if forced
      const isLP =
        (root.closest && root.closest(".is-live-preview")) ||
        (root.closest && root.closest(".canvas-node")) ||
        (root.closest && root.closest(".markdown-embed")) ||
        force;
      if (!isLP) return;

      // Process only visible callouts using IntersectionObserver-like approach
      // Get viewport bounds for visibility check
      const viewport = {
        top: window.scrollY || 0,
        bottom: (window.scrollY || 0) + (window.innerHeight || 0),
        left: 0,
        right: window.innerWidth || 0,
      };

      const callouts = root.querySelectorAll(".cm-callout, .callout");
      if (!callouts || callouts.length === 0) return;

      // If plugin is disabled or file coloring is disabled, clear highlights
      const fileForView = view.file || this.app.workspace.getActiveFile();
      const filePath = fileForView ? fileForView.path : null;
      const docDisabled = !!(
        filePath &&
        this.settings.disabledFiles &&
        this.settings.disabledFiles.includes(filePath)
      );
      const fmDisabled = !!(
        filePath &&
        this.isFrontmatterColoringDisabled &&
        this.isFrontmatterColoringDisabled(filePath)
      );
      if (!this.settings.enabled || docDisabled || fmDisabled) {
        for (const co of callouts) {
          try {
            const highlights = co.querySelectorAll(
              ".always-color-text-highlight",
            );
            for (const hl of highlights) {
              // Replace highlight span with its text content
              const textNode = document.createTextNode(hl.textContent);
              hl.replaceWith(textNode);
            }
          } catch (_) {}
        }
        return;
      }

      const allEntries = this.getSortedWordEntries();
      const entries = filePath
        ? this.filterEntriesByAdvancedRules(filePath, allEntries)
        : allEntries;
      const folderEntry = filePath ? this.getBestFolderEntry(filePath) : null;
      if (!this._lpCalloutCache) this._lpCalloutCache = new WeakMap();

      for (const co of callouts) {
        try {
          // Check if this callout has actual text content to avoid empty callouts
          const hasContent = co.textContent && co.textContent.trim().length > 0;
          if (!hasContent) continue;

          const sig = [
            co.textContent ? co.textContent.length : 0,
            co.childElementCount || 0,
            this.settings.enabled ? 1 : 0,
            this.settings.hideTextColors ? 1 : 0,
            this.settings.hideHighlights ? 1 : 0,
            docDisabled ? 1 : 0,
            fmDisabled ? 1 : 0,
          ].join(":");
          const prev = this._lpCalloutCache.get(co);
          if (prev === sig) continue;
          this._lpCalloutCache.set(co, sig);
          this.processInChunks(co, entries, folderEntry, {
            clearExisting: true,
            batchSize: 10,
            forceProcess: true,
            maxMatches: Infinity,
          });
        } catch (_) {}
      }
    } catch (e) {
      try {
        debugError("LP_CALLOUT", "Failed coloring live preview callouts", e);
      } catch (_) {}
    }
  }

  _processLivePreviewTables(view, force = false) {
    try {
      if (this.settings.disableLivePreviewColoring) return;
      const now = Date.now();
      // OPTIMIZATION: More aggressive throttling (1 second) and skip during typing
      if (
        !force &&
        this._lpTablesLastRun &&
        now - this._lpTablesLastRun <
          EDITOR_PERFORMANCE_CONSTANTS.TABLE_THROTTLE_MS
      )
        return;
      this._lpTablesLastRun = now;
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      // Allow processing in Live Preview, Canvas, or if forced
      const isLP =
        (root.closest && root.closest(".is-live-preview")) ||
        (root.closest && root.closest(".canvas-node")) ||
        (root.closest && root.closest(".markdown-embed")) ||
        force;
      if (!isLP) return;

      // OPTIMIZATION: Skip processing entirely during active typing - this is key to reducing lag
      if (
        !force &&
        this._isTyping &&
        now - this._lastTypingTime <
          EDITOR_PERFORMANCE_CONSTANTS.TYPING_GRACE_PERIOD_MS
      )
        return;

      // Use requestAnimationFrame to batch DOM reads
      if (this._lpTableRaf) cancelAnimationFrame(this._lpTableRaf); // Cancel pending if forced or new request comes
      this._lpTableRaf = requestAnimationFrame(() => {
        this._lpTableRaf = null;
        this._processLivePreviewTablesInternal(view, force);
      });
      return;
    } catch (e) {
      try {
        debugError("LP_TABLES", "Failed coloring live preview tables", e);
      } catch (_) {}
    }
  }

  _processLivePreviewTablesInternal(view, force = false) {
    try {
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      // Allow processing in Live Preview, Canvas, or if forced
      const isLP =
        (root.closest && root.closest(".is-live-preview")) ||
        (root.closest && root.closest(".canvas-node")) ||
        (root.closest && root.closest(".markdown-embed")) ||
        force;
      if (!isLP) return;

      const cells = root.querySelectorAll(
        ".cm-content table td, .cm-content table th",
      );
      if (!cells || cells.length === 0) return;

      const fileForView = view.file || this.app.workspace.getActiveFile();
      const filePath = fileForView ? fileForView.path : null;
      const docDisabled = !!(
        filePath &&
        this.settings.disabledFiles &&
        this.settings.disabledFiles.includes(filePath)
      );
      const fmDisabled = !!(
        filePath &&
        this.isFrontmatterColoringDisabled &&
        this.isFrontmatterColoringDisabled(filePath)
      );
      if (!this.settings.enabled || docDisabled || fmDisabled) {
        for (const cell of cells) {
          try {
            const highlights = cell.querySelectorAll(
              ".always-color-text-highlight",
            );
            for (const hl of highlights) {
              const textNode = document.createTextNode(hl.textContent);
              hl.replaceWith(textNode);
            }
          } catch (_) {}
        }
        return;
      }

      const allEntries = this.getSortedWordEntries();
      const entries = filePath
        ? this.filterEntriesByAdvancedRules(filePath, allEntries)
        : allEntries;
      const folderEntry = filePath ? this.getBestFolderEntry(filePath) : null;
      if (!this._lpTableCache) this._lpTableCache = new WeakMap();

      // Helper to check if element is visible in viewport
      const isVisible = (el) => {
        try {
          const rect = el.getBoundingClientRect();
          return (
            rect.bottom >= 0 &&
            rect.top <=
              (window.innerHeight || document.documentElement.clientHeight)
          );
        } catch (_) {
          return true;
        } // If we can't check, assume visible
      };

      // Detect current caret location to avoid DOM replacements in the actively edited cell
      let caretAnchor = null,
        caretFocus = null;
      try {
        const sel = window.getSelection && window.getSelection();
        if (sel && sel.rangeCount > 0) {
          caretAnchor = sel.anchorNode || null;
          caretFocus = sel.focusNode || null;
        }
      } catch (_) {}

      // Process only visible cells to improve performance
      let processedCount = 0;
      const maxProcessPerFrame = 100; // Limit processing to 100 cells per frame

      for (const cell of cells) {
        try {
          // Skip if we've processed enough this frame
          if (processedCount >= maxProcessPerFrame) {
            // Schedule remaining for next frame
            requestAnimationFrame(() => {
              try {
                this._processLivePreviewTablesInternal(view);
              } catch (_) {}
            });
            break;
          }

          const hasContent =
            cell.textContent && cell.textContent.trim().length > 0;
          if (!hasContent) continue;

          // Only process visible cells (with some margin for near-viewport elements)
          if (!isVisible(cell)) continue;

          // Skip processing if the current text selection/caret is inside this cell
          try {
            if (
              (caretAnchor && cell.contains(caretAnchor)) ||
              (caretFocus && cell.contains(caretFocus))
            ) {
              continue;
            }
          } catch (_) {}
          const sig = [
            cell.textContent ? cell.textContent.length : 0,
            cell.childElementCount || 0,
            this.settings.enabled ? 1 : 0,
            this.settings.hideTextColors ? 1 : 0,
            this.settings.hideHighlights ? 1 : 0,
            docDisabled ? 1 : 0,
            fmDisabled ? 1 : 0,
          ].join(":");
          const prev = this._lpTableCache.get(cell);
          if (prev === sig) continue;
          this._lpTableCache.set(cell, sig);

          // Use applyHighlights instead of processInChunks if processInChunks doesn't exist
          try {
            if (typeof this.processInChunks === "function") {
              this.processInChunks(cell, entries, folderEntry, {
                clearExisting: true,
                batchSize: 10,
                forceProcess: true,
                maxMatches: Infinity,
                filePath: filePath,
              });
            } else {
              this.applyHighlights(cell, folderEntry, {
                clearExisting: true,
                entries: entries,
                filePath: filePath,
              });
            }
          } catch (e) {
            // Fallback to applyHighlights
            try {
              this.applyHighlights(cell, folderEntry, {
                clearExisting: true,
                entries: entries,
                filePath: filePath,
              });
            } catch (_) {}
          }
          processedCount++;
        } catch (_) {}
      }
    } catch (e) {
      try {
        debugError("LP_TABLES", "Failed coloring live preview tables", e);
      } catch (_) {}
    }
  }

  refreshAllLivePreviewTables() {
    try {
      this._lpTableCache = new WeakMap();
      try {
        this._lpTablesLastRun = 0;
      } catch (_) {}
      this.app.workspace.iterateAllLeaves((leaf) => {
        try {
          if (!(leaf.view instanceof MarkdownView)) return;
          if (leaf.view.getMode && leaf.view.getMode() !== "source") return;
          const view =
            leaf.view &&
            (leaf.view.editor?.cm?.view ||
              leaf.view.editor?.view ||
              leaf.view.view ||
              null);
          if (view) {
            const root = view && view.dom ? view.dom : null;
            if (root) {
              try {
                const cells = root.querySelectorAll(
                  ".cm-content table td, .cm-content table th",
                );
                for (const cell of cells) {
                  const highlights = cell.querySelectorAll(
                    ".always-color-text-highlight",
                  );
                  for (const hl of highlights) {
                    const textNode = document.createTextNode(hl.textContent);
                    hl.replaceWith(textNode);
                  }
                }
              } catch (e) {}
            }
            if (
              this.settings.enabled &&
              !this.settings.disableLivePreviewColoring
            ) {
              this._processLivePreviewTables(view);
              try {
                this._attachLivePreviewTableObserver(view);
              } catch (_) {}
              setTimeout(() => {
                try {
                  this._processLivePreviewTables(view);
                } catch (_) {}
              }, 250);
            }
          }
        } catch (_) {}
      });
    } catch (_) {}
  }

  forceReprocessLivePreviewTables() {
    const runPass = (delay) => {
      setTimeout(() => {
        try {
          this._lpTablesLastRun = 0;
        } catch (_) {}
        try {
          this._lpTableCache = new WeakMap();
        } catch (_) {}
        try {
          this.app.workspace.iterateAllLeaves((leaf) => {
            try {
              if (!(leaf.view instanceof MarkdownView)) return;
              if (leaf.view.getMode && leaf.view.getMode() !== "source") return;
              const view =
                leaf.view &&
                (leaf.view.editor?.cm?.view ||
                  leaf.view.editor?.view ||
                  leaf.view.view ||
                  null);
              if (view) {
                try {
                  this._attachLivePreviewTableObserver(view);
                } catch (_) {}
                try {
                  this.refreshEditor(leaf.view, true);
                } catch (_) {}
                try {
                  this._processLivePreviewTables(view);
                } catch (_) {}
              }
            } catch (_) {}
          });
        } catch (_) {}
      }, delay);
    };
    runPass(0);
    runPass(60);
    runPass(260);
    runPass(800);
  }

  _attachLivePreviewTableObserver(view) {
    try {
      if (this.settings.disableLivePreviewColoring) return;
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      if (!this._lpTableObservers) this._lpTableObservers = new Map();
      const existing = this._lpTableObservers.get(root);
      if (existing) return;

      // Debounce timer for this observer
      let debounceTimer = null;
      const DEBOUNCE_MS = 300; // Debounce observer callbacks

      const observer = new MutationObserver((mutations) => {
        // Clear existing timer
        if (debounceTimer) clearTimeout(debounceTimer);

        // Only process if there are meaningful changes
        let hasRelevantChange = false;
        for (const m of mutations) {
          try {
            if (m.type === "childList") {
              for (const node of m.addedNodes || []) {
                if (node && node.nodeType === 1) {
                  const el = node;
                  if (
                    (el.classList && el.classList.contains("cm-content")) ||
                    (el.querySelector && el.querySelector(".cm-content table"))
                  ) {
                    hasRelevantChange = true;
                    break;
                  }
                }
              }
            } else if (m.type === "characterData") {
              // Only process characterData changes if they're in tables
              const target = m.target;
              if (
                target &&
                target.closest &&
                target.closest(".cm-content table")
              ) {
                hasRelevantChange = true;
              }
            }
            // Skip attribute changes to reduce processing
            if (hasRelevantChange) break;
          } catch (_) {}
        }

        // Debounce the processing
        if (hasRelevantChange) {
          debounceTimer = setTimeout(() => {
            try {
              this._processLivePreviewTables(view);
            } catch (_) {}
          }, DEBOUNCE_MS);
        }
      });

      // Only observe childList to reduce overhead (removed characterData and attributes)
      observer.observe(root, { childList: true, subtree: true });
      try {
        this._lpTableObservers.set(root, observer);
      } catch (_) {}
    } catch (_) {}
  }

  _detachLivePreviewTableObserver(view) {
    try {
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      const existing =
        this._lpTableObservers && this._lpTableObservers.get
          ? this._lpTableObservers.get(root)
          : null;
      if (existing && existing.disconnect) {
        try {
          existing.disconnect();
        } catch (_) {}
        try {
          this._lpTableObservers.delete(root);
        } catch (_) {}
      }
    } catch (_) {}
  }

  refreshAllLivePreviewCallouts() {
    try {
      // Clear the callout cache to force re-evaluation of all cached signatures
      // This ensures that when settings like hideTextColors or hideHighlights change,
      // the cache signatures are re-computed and callouts are re-processed
      this._lpCalloutCache = new WeakMap();
      try {
        this._lpLastRun = 0;
      } catch (_) {}
      try {
        this._lpTableCache = new WeakMap();
      } catch (_) {}
      try {
        this._lpTablesLastRun = 0;
      } catch (_) {}
      try {
        this._basesCache = new WeakMap();
      } catch (_) {}
      try {
        this._basesLastRun = 0;
      } catch (_) {}

      this.app.workspace.iterateAllLeaves((leaf) => {
        try {
          if (!(leaf.view instanceof MarkdownView)) return;
          if (leaf.view.getMode && leaf.view.getMode() !== "source") return;
          // Try to get CM6 view instance
          const view =
            leaf.view &&
            (leaf.view.editor?.cm?.view ||
              leaf.view.editor?.view ||
              leaf.view.view ||
              null);
          if (view) {
            const root = view && view.dom ? view.dom : null;
            if (root) {
              // Clear all existing highlights before reprocessing
              try {
                const callouts = root.querySelectorAll(".cm-callout, .callout");
                for (const co of callouts) {
                  const highlights = co.querySelectorAll(
                    ".always-color-text-highlight",
                  );
                  for (const hl of highlights) {
                    const textNode = document.createTextNode(hl.textContent);
                    hl.replaceWith(textNode);
                  }
                }
                const cells = root.querySelectorAll(
                  ".cm-content table td, .cm-content table th",
                );
                for (const cell of cells) {
                  const highlights = cell.querySelectorAll(
                    ".always-color-text-highlight",
                  );
                  for (const hl of highlights) {
                    const textNode = document.createTextNode(hl.textContent);
                    hl.replaceWith(textNode);
                  }
                }
              } catch (e) {}
            }
            // Now reprocess if enabled
            if (
              this.settings.enabled &&
              !this.settings.disableLivePreviewColoring
            ) {
              this._processLivePreviewCallouts(view);
              this._processLivePreviewTables(view);
              this._processBasesViews();
              try {
                this._attachLivePreviewCalloutObserver(view);
              } catch (_) {}
              try {
                this._attachLivePreviewTableObserver(view);
              } catch (_) {}
              setTimeout(() => {
                try {
                  this._processLivePreviewCallouts(view);
                } catch (_) {}
              }, 250);
              setTimeout(() => {
                try {
                  this._processLivePreviewTables(view);
                } catch (_) {}
              }, 250);
              setTimeout(() => {
                try {
                  this._processBasesViews();
                } catch (_) {}
              }, 250);
            }
          }
        } catch (_) {}
      });
    } catch (_) {}
  }

  forceReprocessLivePreviewCallouts() {
    const runPass = (delay) => {
      setTimeout(() => {
        try {
          this._lpLastRun = 0;
        } catch (_) {}
        try {
          this._lpCalloutCache = new WeakMap();
        } catch (_) {}
        try {
          this._lpTablesLastRun = 0;
        } catch (_) {}
        try {
          this._lpTableCache = new WeakMap();
        } catch (_) {}
        try {
          this._basesLastRun = 0;
        } catch (_) {}
        try {
          this._basesCache = new WeakMap();
        } catch (_) {}
        try {
          this.app.workspace.iterateAllLeaves((leaf) => {
            try {
              if (!(leaf.view instanceof MarkdownView)) return;
              if (leaf.view.getMode && leaf.view.getMode() !== "source") return;
              const view =
                leaf.view &&
                (leaf.view.editor?.cm?.view ||
                  leaf.view.editor?.view ||
                  leaf.view.view ||
                  null);
              if (view) {
                try {
                  this._attachLivePreviewCalloutObserver(view);
                } catch (_) {}
                try {
                  this.refreshEditor(leaf.view, true);
                } catch (_) {}
                try {
                  this._processLivePreviewCallouts(view);
                } catch (_) {}
                try {
                  this._attachLivePreviewTableObserver(view);
                } catch (_) {}
                try {
                  this._processLivePreviewTables(view);
                } catch (_) {}
                try {
                  this._processBasesViews();
                } catch (_) {}
              }
            } catch (_) {}
          });
        } catch (_) {}
      }, delay);
    };
    runPass(0);
    runPass(60);
    runPass(260);
    runPass(800);
  }

  _processBasesViews() {
    try {
      const now = Date.now();
      if (this._basesLastRun && now - this._basesLastRun < 200) return;
      this._basesLastRun = now;
      const roots = Array.from(document.querySelectorAll(".bases-view"));
      if (!roots || roots.length === 0) return;
      const fileForView = this.app.workspace.getActiveFile();
      const filePath = fileForView ? fileForView.path : null;
      const docDisabled = !!(
        filePath &&
        this.settings.disabledFiles &&
        this.settings.disabledFiles.includes(filePath)
      );
      const fmDisabled = !!(
        filePath &&
        this.isFrontmatterColoringDisabled &&
        this.isFrontmatterColoringDisabled(filePath)
      );
      const allEntries = this.getSortedWordEntries();
      const entries = filePath
        ? this.filterEntriesByAdvancedRules(filePath, allEntries)
        : allEntries;
      const folderEntry = filePath ? this.getBestFolderEntry(filePath) : null;
      if (!this._basesCache) this._basesCache = new WeakMap();
      for (const root of roots) {
        const targets = root.querySelectorAll(
          ".bases-table-cell, .metadata-input-longtext, .multi-select-pill-content, .multi-select-input",
        );
        if (!targets || targets.length === 0) continue;
        if (!this.settings.enabled || docDisabled || fmDisabled) {
          for (const el of targets) {
            try {
              const highlights = el.querySelectorAll(
                ".always-color-text-highlight",
              );
              for (const hl of highlights) {
                const textNode = document.createTextNode(hl.textContent);
                hl.replaceWith(textNode);
              }
            } catch (_) {}
          }
          continue;
        }
        for (const el of targets) {
          try {
            const hasContent =
              el.textContent && el.textContent.trim().length > 0;
            if (!hasContent) continue;
            const sig = [
              el.textContent ? el.textContent.length : 0,
              el.childElementCount || 0,
              this.settings.enabled ? 1 : 0,
              this.settings.hideTextColors ? 1 : 0,
              this.settings.hideHighlights ? 1 : 0,
              docDisabled ? 1 : 0,
              fmDisabled ? 1 : 0,
            ].join(":");
            const prev = this._basesCache.get(el);
            if (prev === sig) continue;
            this._basesCache.set(el, sig);
            this.processInChunks(el, entries, folderEntry, {
              clearExisting: true,
              batchSize: 10,
              forceProcess: true,
              maxMatches: Infinity,
              includeSelf: true,
            });
          } catch (_) {}
        }
      }
      try {
        this._attachBasesObserver();
      } catch (_) {}
    } catch (e) {}
  }

  _attachBasesObserver() {
    try {
      if (!this._basesObservers) this._basesObservers = new Map();
      const key = document.body || document;
      if (this._basesObservers.get(key)) return;
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          try {
            if (
              m.type === "childList" ||
              m.type === "characterData" ||
              m.type === "attributes"
            ) {
              const added = Array.from(m.addedNodes || []);
              if (
                added.some(
                  (n) =>
                    n.nodeType === 1 &&
                    (n.classList?.contains("bases-view") ||
                      n.querySelector?.(".bases-view")),
                )
              ) {
                this._processBasesViews();
                return;
              }
              const t = m.target;
              if (t && t.closest && t.closest(".bases-view")) {
                this._processBasesViews();
                return;
              }
            }
          } catch (_) {}
        }
      });
      observer.observe(document.body || document, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
      this._basesObservers.set(key, observer);
    } catch (_) {}
  }

  refreshAllBasesViews() {
    try {
      this._basesCache = new WeakMap();
      try {
        this._basesLastRun = 0;
      } catch (_) {}
      const roots = Array.from(document.querySelectorAll(".bases-view"));
      for (const root of roots) {
        try {
          const targets = root.querySelectorAll(
            ".bases-table-cell, .metadata-input-longtext, .multi-select-pill-content, .multi-select-input",
          );
          for (const el of targets) {
            const highlights = el.querySelectorAll(
              ".always-color-text-highlight",
            );
            for (const hl of highlights) {
              const textNode = document.createTextNode(hl.textContent);
              hl.replaceWith(textNode);
            }
          }
        } catch (_) {}
      }
      if (this.settings.enabled) {
        this._processBasesViews();
        setTimeout(() => {
          try {
            this._processBasesViews();
          } catch (_) {}
        }, 250);
      }
    } catch (_) {}
  }

  forceReprocessBasesViews() {
    const runPass = (delay) => {
      setTimeout(() => {
        try {
          this._basesLastRun = 0;
        } catch (_) {}
        try {
          this._basesCache = new WeakMap();
        } catch (_) {}
        try {
          this._processBasesViews();
        } catch (_) {}
      }, delay);
    };
    runPass(0);
    runPass(60);
    runPass(260);
    runPass(800);
  }

  _attachLivePreviewCalloutObserver(view) {
    try {
      if (this.settings.disableLivePreviewColoring) return;
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      if (!this._lpObservers) this._lpObservers = new Map();
      const existing = this._lpObservers.get(root);
      if (existing) return;

      // Debounce timer for this observer
      let debounceTimer = null;
      const DEBOUNCE_MS = 300; // Debounce observer callbacks

      const observer = new MutationObserver((mutations) => {
        // Clear existing timer
        if (debounceTimer) clearTimeout(debounceTimer);

        // Only process if there are meaningful changes
        let hasRelevantChange = false;
        for (const m of mutations) {
          try {
            if (m.type === "childList") {
              for (const node of m.addedNodes || []) {
                if (node && node.nodeType === 1) {
                  const el = node;
                  if (
                    (el.classList &&
                      (el.classList.contains("cm-callout") ||
                        el.classList.contains("callout"))) ||
                    (el.querySelector &&
                      el.querySelector(".cm-callout, .callout"))
                  ) {
                    hasRelevantChange = true;
                    break;
                  }
                }
              }
            } else if (m.type === "characterData") {
              // Only process characterData changes if they're in callouts
              const target = m.target;
              if (
                target &&
                target.closest &&
                target.closest(".cm-callout, .callout")
              ) {
                hasRelevantChange = true;
              }
            }
            // Skip attribute changes to reduce processing
            if (hasRelevantChange) break;
          } catch (_) {}
        }

        // Debounce the processing
        if (hasRelevantChange) {
          debounceTimer = setTimeout(() => {
            try {
              this._processLivePreviewCallouts(view);
            } catch (_) {}
          }, DEBOUNCE_MS);
        }
      });

      // Only observe childList to reduce overhead (removed characterData and attributes)
      observer.observe(root, { childList: true, subtree: true });
      try {
        this._lpObservers.set(root, observer);
      } catch (_) {}
    } catch (_) {}
  }

  _detachLivePreviewCalloutObserver(view) {
    try {
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      const existing =
        this._lpObservers && this._lpObservers.get
          ? this._lpObservers.get(root)
          : null;
      if (existing && existing.disconnect) {
        try {
          existing.disconnect();
        } catch (_) {}
        try {
          this._lpObservers.delete(root);
        } catch (_) {}
      }
    } catch (_) {}
  }

  // Setup IntersectionObserver to process only blocks as they enter the viewport
  setupViewportObserver(rootEl, folderEntry = null, options = {}) {
    try {
      if (!rootEl || !rootEl.isConnected) return;

      // Ensure _viewportObservers is initialized
      if (!this._viewportObservers) {
        this._viewportObservers = new Map();
      }

      // If an observer already exists for this root, disconnect and recreate
      try {
        const prev = this._viewportObservers.get(rootEl);
        if (prev && typeof prev.disconnect === "function") prev.disconnect();
      } catch (e) {
        debugError("VIEWPORT", "Error disconnecting old observer", e);
      }

      const selectorTags = new Set([
        "P",
        "LI",
        "DIV",
        "SPAN",
        "TD",
        "TH",
        "BLOCKQUOTE",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
      ]);

      // Collect candidate block elements (skip CODE/PRE)
      const blocks = [];
      try {
        const walker = document.createTreeWalker(
          rootEl,
          NodeFilter.SHOW_ELEMENT,
          null,
          false,
        );
        let node;
        while ((node = walker.nextNode())) {
          if (!node || !node.nodeName) continue;
          if (["CODE", "PRE"].includes(node.nodeName)) continue;
          try {
            if (
              node.closest(".act-skip-coloring") ||
              node.classList.contains("act-skip-coloring")
            )
              continue;
          } catch (_) {}
          if (selectorTags.has(node.nodeName)) blocks.push(node);
        }
      } catch (e) {
        // fallback: querySelectorAll
        try {
          const nodeList = rootEl.querySelectorAll(
            "p:not(.act-skip-coloring), li:not(.act-skip-coloring), div:not(.act-skip-coloring), span:not(.act-skip-coloring), td:not(.act-skip-coloring), th:not(.act-skip-coloring), blockquote:not(.act-skip-coloring), h1:not(.act-skip-coloring), h2:not(.act-skip-coloring), h3:not(.act-skip-coloring), h4:not(.act-skip-coloring), h5:not(.act-skip-coloring), h6:not(.act-skip-coloring)",
          );
          for (const n of nodeList) blocks.push(n);
        } catch (err) {
          debugError("VIEWPORT", "querySelectorAll fallback failed", err);
        }
      }

      if (blocks.length === 0) return;

      // Process queue bookkeeping
      const processed = new WeakSet();

      const observerOptions = {
        root: rootEl,
        rootMargin: options.rootMargin || "300px 0px 300px 0px",
        threshold: options.threshold || 0.01,
      };

      const pq = new PriorityQueue();
      let processing = false;
      const processNext = () => {
        if (processing) return;
        processing = true;
        const run = () => {
          const blk = pq.pop();
          if (!blk) {
            processing = false;
            return;
          }
          try {
            const es =
              options && Array.isArray(options.entries)
                ? options.entries
                : this.getSortedWordEntries();
            this._errorRecovery.wrap(
              "PROCESS_BLOCK",
              () =>
                this._processBlock(blk, es, folderEntry, {
                  clearExisting: options.clearExisting !== false,
                  effectiveStyle: "text",
                  forceProcess:
                    options.forceProcess ||
                    this.settings.forceFullRenderInReading,
                  maxMatches:
                    options.maxMatches ||
                    (this.settings.forceFullRenderInReading
                      ? Infinity
                      : undefined),
                  filePath: options.filePath,
                }),
              () => null,
            );
          } catch (e) {
            debugError("VIEWPORT", "_processBlock failed", e);
          }
          if (pq.size() > 0) {
            setTimeout(run, 0);
          } else {
            processing = false;
          }
        };
        setTimeout(run, 0);
      };
      const io = new IntersectionObserver((entries) => {
        for (const ent of entries) {
          try {
            const block = ent.target;
            if (ent.isIntersecting) {
              try {
                if (
                  block.closest(".act-skip-coloring") ||
                  block.classList.contains("act-skip-coloring")
                ) {
                  io.unobserve(block);
                  continue;
                }
              } catch (_) {}
              if (processed.has(block)) {
                try {
                  io.unobserve(block);
                } catch (e) {}
                continue;
              }
              processed.add(block);
              try {
                io.unobserve(block);
              } catch (e) {}
              const r = ent.intersectionRatio || 0;
              const rect = block.getBoundingClientRect();
              const dist =
                Math.abs(rect.top - 0) +
                Math.abs(rect.bottom - window.innerHeight);
              const pr = r * 1000 - dist;
              pq.push(block, pr);
            }
          } catch (e) {
            debugError("VIEWPORT", "observer entry error", e);
          }
        }
        processNext();
      }, observerOptions);

      // Observe each block
      for (const b of blocks) {
        try {
          io.observe(b);
        } catch (e) {
          debugError("VIEWPORT", "Error observing block", e);
        }
      }

      // Store observer so we can disconnect later
      try {
        if (!this._viewportObservers) this._viewportObservers = new Map();
        this._viewportObservers.set(rootEl, io);
      } catch (e) {
        debugError("VIEWPORT", "Error storing observer", e);
      }

      try {
        const firstN = Number(options.immediateBlocks) || 10;
        let count = 0;
        for (const b of blocks) {
          if (count >= firstN) break;
          const rect = b.getBoundingClientRect();
          if (rect.top < window.innerHeight + 400 && rect.bottom > -400) {
            if (!processed.has(b)) {
              processed.add(b);
              try {
                io.unobserve(b);
              } catch (e) {}
              try {
                if (
                  b.closest(".act-skip-coloring") ||
                  b.classList.contains("act-skip-coloring")
                ) {
                  continue;
                }
              } catch (_) {}
              pq.push(b, 1000);
            }
            count++;
          }
        }
        processNext();
      } catch (e) {
        debugError("VIEWPORT", "Error prefetching visible blocks", e);
      }

      debugLog(
        "VIEWPORT",
        `observer set: ${blocks.length} blocks, immediate=${options.immediateBlocks || 10}`,
      );
      const debounce = (fn, ms) => {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn(...args), ms);
        };
      };
      const onChange = debounce(() => {
        processNext();
      }, 100);
      const scrollH = this._eventManager.add(window, "scroll", onChange, {
        passive: true,
        debounceMs: 100,
        useRaf: true,
        viewType: "reading",
        priority: 1,
      });
      const resizeH = this._eventManager.add(window, "resize", onChange, {
        debounceMs: 100,
        useRaf: true,
        viewType: "reading",
        priority: 1,
      });
      const memCheck = () => {
        try {
          if (performance && performance.memory) {
            const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
            if (usedMB > 1000) {
              for (const b of blocks) {
                const rect = b.getBoundingClientRect();
                if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
                  const highlights = b.querySelectorAll(
                    "span.always-color-text-highlight",
                  );
                  for (const ex of highlights) {
                    const tn = document.createTextNode(ex.textContent);
                    ex.replaceWith(tn);
                  }
                }
              }
            }
          }
        } catch (_) {}
      };
      const memCheckInterval = setInterval(memCheck, 2000);
      try {
        if (!this._readingModeIntervals) this._readingModeIntervals = new Map();
        if (!this._readingModeIntervals.has(rootEl))
          this._readingModeIntervals.set(rootEl, []);
        this._readingModeIntervals.get(rootEl).push(memCheckInterval);
      } catch (_) {}
    } catch (e) {
      debugError("VIEWPORT", "setup failed", e);
    }
  }

  // NEW METHOD: Optimized decorations for non-Roman text
  buildNonRomanOptimizedDeco(view, builder, from, to, text) {
    const plugin = this;
    const activeFile = this.app.workspace.getActiveFile();
    if (!this.settings.enabled) return builder.finish();
    if (activeFile) {
      const prnr = this.evaluatePathRules(activeFile.path);
      if (
        prnr.excluded ||
        (this.hasGlobalExclude() && prnr.hasIncludes && !prnr.included)
      )
        return builder.finish();
    }
    if (activeFile && this.settings.disabledFiles.includes(activeFile.path))
      return builder.finish();
    if (activeFile && this.isFrontmatterColoringDisabled(activeFile.path))
      return builder.finish();

    const folderEntry = activeFile
      ? this.getBestFolderEntry(activeFile.path)
      : null;

    const entries = this.getSortedWordEntries();
    const nonRomanEntries = entries.filter(
      (entry) =>
        entry &&
        !entry.invalid &&
        this.containsNonRomanCharacters(entry.pattern),
    );

    if (nonRomanEntries.length === 0) return builder.finish();

    let matches = [];

    // Simple string search for non-Roman patterns
    for (const entry of nonRomanEntries) {
      const pattern = entry.pattern;
      let pos = 0;

      while ((pos = text.indexOf(pattern, pos)) !== -1) {
        matches.push({
          start: from + pos,
          end: from + pos + pattern.length,
          color: entry.color,
        });
        pos += pattern.length;

        if (matches.length > 200) break;
      }

      if (matches.length > 200) break;
    }

    // Apply decorations
    const effectiveStyle = "text";
    if (effectiveStyle === "none") return builder.finish();

    for (const m of matches) {
      let style;
      if (effectiveStyle === "text") {
        style = `color: ${m.color} !important; --highlight-color: ${m.color};`;
      } else {
        // Use per-entry properties if available, otherwise fall back to global settings
        const hPad =
          typeof m.highlightHorizontalPadding === "number"
            ? m.highlightHorizontalPadding
            : (this.settings.highlightHorizontalPadding ?? 4);
        const vPad =
          typeof m.highlightVerticalPadding === "number"
            ? m.highlightVerticalPadding
            : (this.settings.highlightVerticalPadding ?? 0);
        const radius =
          typeof m.highlightBorderRadius === "number"
            ? m.highlightBorderRadius
            : (this.settings.highlightBorderRadius ?? 8);
        const opacity =
          typeof m.backgroundOpacity === "number"
            ? m.backgroundOpacity
            : (this.settings.backgroundOpacity ?? 25);

        const vPadCss =
          vPad >= 0
            ? `padding-top: ${vPad}px !important; padding-bottom: ${vPad}px !important;`
            : `padding-top: 0px !important; padding-bottom: 0px !important; margin-top: ${vPad}px !important; margin-bottom: ${vPad}px !important;`;
        const br = hPad > 0 && radius === 0 ? 0 : radius;
        const boxDecoBreak =
          (this.settings.enableBoxDecorationBreak ?? true)
            ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;"
            : "";

        style = `background: none; background-color: ${this.hexToRgba(m.color, opacity)} !important; border-radius: ${br}px !important; padding-left: ${hPad}px !important; padding-right: ${hPad}px !important; ${vPadCss}${boxDecoBreak}`;
      }

      const isDark = m.color && this.isDarkColor(m.color);
      const deco = Decoration.mark({
        attributes: {
          style,
          class: isDark
            ? "always-color-text-highlight act-dark-color"
            : "always-color-text-highlight",
          title:
            this.settings.showColoringReasonOnHover && m.color
              ? `matches "${m.entry?.pattern || ""}"`
              : "",
        },
      });
      builder.add(m.start, m.end, deco);
    }

    return builder.finish();
  }

  // --- Build CodeMirror Editor Extension (Editing View) ---
  buildEditorExtension() {
    return buildEditorExtension(this);
  }

  // NEW METHOD: Extract full word containing a match
  extractFullWord(text, matchStart, matchEnd) {
    let fullWordStart = matchStart;
    let fullWordEnd = matchEnd;

    // Expand left to word boundary
    while (
      fullWordStart > 0 &&
      /\w/.test(text[fullWordStart - 1]) &&
      text[fullWordStart - 1] !== "_" &&
      text[fullWordStart - 1] !== "*"
    ) {
      fullWordStart--;
    }

    // Expand right to word boundary
    while (
      fullWordEnd < text.length &&
      /\w/.test(text[fullWordEnd]) &&
      text[fullWordEnd] !== "_" &&
      text[fullWordEnd] !== "*"
    ) {
      fullWordEnd++;
    }

    return text.substring(fullWordStart, fullWordEnd);
  }

  // NEW METHOD: Extract content from list item element, stripping markdown prefixes
  extractListItemContent(liElement) {
    try {
      if (!liElement) return "";
      const text = this.decodeHtmlEntities(String(liElement.textContent || ""));
      if (!text) return "";

      // Remove checkbox prefix: [ ], [x], [X]
      let content = text.replace(REGEX_CONSTANTS.CHECKBOX_PREFIX, "");

      // Remove task marker prefix (duplicate, for safety)
      if (content === text) {
        content = text.replace(REGEX_CONSTANTS.TASK_MARKER_PREFIX, "");
      }

      // Remove bullet prefix: -, *
      if (content === text) {
        content = text.replace(REGEX_CONSTANTS.BULLET_PREFIX, "");
      }

      // Remove numbered list prefix: 1., 2., etc.
      if (content === text) {
        content = text.replace(REGEX_CONSTANTS.NUMBERED_PREFIX, "");
      }

      return content;
    } catch (e) {
      return "";
    }
  }

  // NEW METHOD: Check if word is blacklisted
  isGroupEnabledForFile(group, filePath) {
    if (!group || !filePath) return true;

    const enableFolders = Array.isArray(group.enableFolders)
      ? group.enableFolders
      : [];
    const disableFolders = Array.isArray(group.disableFolders)
      ? group.disableFolders
      : [];
    const hasEnableFolders = enableFolders.length > 0;
    const hasDisableFolders = disableFolders.length > 0;

    let folderDecision = 0; // 0: Neutral, 1: Allowed, -1: Denied

    if (hasEnableFolders || hasDisableFolders) {
      const fp = this.normalizePath(filePath);
      const parents = this._parentFolders(fp).map((p) => this.normalizePath(p));
      const normRule = (p) => {
        const n = this.normalizePath(String(p || "").trim());
        if (n === "/") return "/";
        return n.replace(/\/$/, "");
      };

      let enableMatch = false;
      let disableMatch = false;
      let bestEnableDepth = -1;
      let bestDisableDepth = -1;

      for (const f of enableFolders) {
        const fNorm = normRule(f);
        if (!fNorm) continue;
        if (fNorm === "/" || fNorm === "") {
          enableMatch = true;
          if (bestEnableDepth < 0) bestEnableDepth = 0;
          continue;
        }
        const matchParent = parents.find((p) => p === fNorm);
        if (matchParent) {
          enableMatch = true;
          const depth = matchParent.split("/").length;
          if (depth > bestEnableDepth) bestEnableDepth = depth;
        }
      }

      for (const f of disableFolders) {
        const fNorm = normRule(f);
        if (!fNorm) continue;
        if (fNorm === "/" || fNorm === "") {
          disableMatch = true;
          if (bestDisableDepth < 0) bestDisableDepth = 0;
          continue;
        }
        const matchParent = parents.find((p) => p === fNorm);
        if (matchParent) {
          disableMatch = true;
          const depth = matchParent.split("/").length;
          if (depth > bestDisableDepth) bestDisableDepth = depth;
        }
      }

      if (!enableMatch && !disableMatch) {
        if (hasEnableFolders) folderDecision = -1;
      } else if (enableMatch && disableMatch) {
        if (bestDisableDepth > bestEnableDepth) folderDecision = -1;
        else folderDecision = 1;
      } else if (!enableMatch && disableMatch) {
        folderDecision = -1;
      } else if (enableMatch && !disableMatch) {
        folderDecision = 1;
      }
    }

    const enableTags = Array.isArray(group.enableTags) ? group.enableTags : [];
    const disableTags = Array.isArray(group.disableTags)
      ? group.disableTags
      : [];
    const hasEnableTags = enableTags.length > 0;
    const hasDisableTags = disableTags.length > 0;

    let tagDecision = 0;

    if (hasEnableTags || hasDisableTags) {
      const fileTags = this.getFileTags(filePath);
      const normTag = (t) =>
        String(t || "")
          .replace(/^#/, "")
          .trim();
      const enableTagsNorm = hasEnableTags
        ? enableTags.map(normTag).filter(Boolean)
        : [];
      const disableTagsNorm = hasDisableTags
        ? disableTags.map(normTag).filter(Boolean)
        : [];

      const enableMatchTag =
        enableTagsNorm.length > 0 &&
        fileTags.some((t) => enableTagsNorm.includes(normTag(t)));
      const disableMatchTag =
        disableTagsNorm.length > 0 &&
        fileTags.some((t) => disableTagsNorm.includes(normTag(t)));

      if (enableTagsNorm.length > 0 && !enableMatchTag) {
        tagDecision = -1;
      }

      if (disableMatchTag) tagDecision = -1;
      if (enableMatchTag) tagDecision = 1;
    }

    if (folderDecision === 1 || tagDecision === 1) return true;
    if (folderDecision === -1 || tagDecision === -1) return false;
    return true;
  }

  isWordBlacklisted(word, filePath = null) {
    // OPTIMIZATION: Use pre-compiled blacklist regexes instead of creating new ones each time
    try {
      if (this._blacklistCompilationDirty) this.compileBlacklistEntries();

      const w = String(word || "");

      // Check pre-compiled blacklist words
      for (const compiled of this._compiledBlacklistWords) {
        compiled.regex.lastIndex = 0;
        if (compiled.regex.test(w)) return true;
      }

      // Check pre-compiled blacklist entries
      for (const compiled of this._compiledBlacklistEntries) {
        for (const pattern of compiled.patterns) {
          pattern.regex.lastIndex = 0;
          if (pattern.regex.test(w)) return true;
        }
      }

      // Check pre-compiled blacklist groups (only active ones)
      for (const compiled of Object.values(this._compiledBlacklistGroups)) {
        if (!compiled.group.active) continue;
        if (filePath && !this.isGroupEnabledForFile(compiled.group, filePath))
          continue;

        for (const entryCompiled of compiled.entries) {
          for (const pattern of entryCompiled.patterns) {
            pattern.regex.lastIndex = 0;
            if (pattern.regex.test(w)) return true;
          }
        }
      }
    } catch (e) {}
    return false;
  }

  containsBlacklistedWord(text, filePath = null) {
    // OPTIMIZATION: Use pre-compiled blacklist regexes instead of creating new ones each time
    try {
      if (this._blacklistCompilationDirty) this.compileBlacklistEntries();

      const t = String(text || "");

      // Check pre-compiled blacklist words
      for (const compiled of this._compiledBlacklistWords) {
        compiled.regex.lastIndex = 0;
        if (compiled.regex.test(t)) return true;
      }

      // Check pre-compiled blacklist entries
      for (const compiled of this._compiledBlacklistEntries) {
        for (const pattern of compiled.patterns) {
          pattern.regex.lastIndex = 0;
          if (pattern.regex.test(t)) return true;
        }
      }

      // Check pre-compiled blacklist groups (only active ones)
      for (const compiled of Object.values(this._compiledBlacklistGroups)) {
        if (!compiled.group.active) continue;
        if (filePath && !this.isGroupEnabledForFile(compiled.group, filePath))
          continue;

        for (const entryCompiled of compiled.entries) {
          for (const pattern of entryCompiled.patterns) {
            pattern.regex.lastIndex = 0;
            if (pattern.regex.test(t)) return true;
          }
        }
      }
    } catch (e) {}
    return false;
  }

  // NEW METHOD: Check if a full line is blacklisted by regex pattern (for markdown formatting)
  isLineBlacklistedByRegex(line, filePath = null) {
    try {
      // OPTIMIZATION: Use pre-compiled blacklist regexes
      if (this._blacklistCompilationDirty) this.compileBlacklistEntries();

      const l = String(line);

      // Check pre-compiled blacklist entries
      for (const compiled of this._compiledBlacklistEntries) {
        for (const pattern of compiled.patterns) {
          if (!pattern.isRegex) continue; // Only regex entries apply to full lines
          pattern.regex.lastIndex = 0;
          if (pattern.regex.test(l)) return true;
        }
      }

      // Check pre-compiled blacklist groups (only active ones)
      for (const compiled of Object.values(this._compiledBlacklistGroups)) {
        if (!compiled.group.active) continue;
        if (filePath && !this.isGroupEnabledForFile(compiled.group, filePath))
          continue;

        for (const entryCompiled of compiled.entries) {
          for (const pattern of entryCompiled.patterns) {
            if (!pattern.isRegex) continue; // Only regex entries apply to full lines
            pattern.regex.lastIndex = 0;
            if (pattern.regex.test(l)) return true;
          }
        }
      }
    } catch (e) {}
    return false;
  }

  // NEW METHOD: Get all text ranges that are within blacklisted list items
  getBlacklistedListItemRanges(text, baseOffset = 0, filePath = null) {
    // OPTIMIZATION: Skip heavy blacklist scanning while typing to prevent lag
    if (this._isTyping) return [];

    // PERF FIX: Cache result keyed on doc version + filePath to avoid re-scanning on every viewport change
    const cacheKey = `${this._currentDocVersion || 0}:${baseOffset}:${filePath || ""}`;
    if (this._blacklistRangesCache && this._blacklistRangesCacheKey === cacheKey) {
      return this._blacklistRangesCache;
    }

    const ranges = [];
    try {
      let pos = 0;
      while (pos <= text.length) {
        const lineStart = pos;
        const nextNL = text.indexOf("\n", pos);
        const lineEnd = nextNL === -1 ? text.length : nextNL;
        const line = text.substring(lineStart, lineEnd);

        // Check if this line is a list item that's blacklisted
        if (this.isLineBlacklistedByRegex(line, filePath)) {
          // This entire line's content should be excluded from coloring
          ranges.push({
            start: baseOffset + lineStart,
            end: baseOffset + lineEnd,
          });
        }

        if (nextNL === -1) break;
        pos = nextNL + 1;
      }
    } catch (e) {}
    // Store in cache before returning
    this._blacklistRangesCache = ranges;
    this._blacklistRangesCacheKey = cacheKey;
    return ranges;
  }

  // NEW METHOD: Check if a match position falls within blacklisted ranges
  isMatchInBlacklistedRange(matchStart, matchEnd, blacklistedRanges) {
    try {
      for (const range of blacklistedRanges) {
        // Optimization: Since ranges are sorted by start, if we passed the match, we can stop
        if (range.start >= matchEnd) return false;

        // Check if match overlaps with blacklisted range
        if (matchStart < range.end && matchEnd > range.start) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  // PERF: Build a Set of blacklisted words for O(1) lookup during a chunk pass.
  // Call once per buildDecoChunked, pass the result into processPatternChunk/processTextChunk.
  buildBlacklistWordSet(filePath = null) {
    try {
      if (this._blacklistCompilationDirty) this.compileBlacklistEntries();
      const set = new Set();
      for (const compiled of this._compiledBlacklistWords) {
        if (compiled.word) set.add(compiled.word.toLowerCase());
      }
      return set;
    } catch (e) {}
    return new Set();
  }

  // NEW METHOD: Context-aware blacklist check with prefix-aware tokens
  isContextBlacklisted(text, matchStart, matchEnd, filePath = null) {
    try {
      const fullWord = this.extractFullWord(text, matchStart, matchEnd);
      if (this.isWordBlacklisted(fullWord, filePath)) return true;
      if (matchStart > 0) {
        const prev = text[matchStart - 1];
        if (prev && /[@#]/.test(prev)) {
          const token = prev + fullWord;
          if (this.isWordBlacklisted(token, filePath)) return true;
        }
      }

      // OPTIMIZATION: Skip heavy context checks (line extraction & regexes) while typing
      if (this._isTyping) return false;

      let ls = matchStart;
      while (ls > 0 && text[ls - 1] !== "\n") ls--;
      let le = matchEnd;
      while (le < text.length && text[le] !== "\n") le++;
      const line = text.substring(ls, le);
      const mTaskChecked = /^\s*[\-\*]\s+\[[xX]\]\s+(.*)$/.exec(line);
      const mTaskUnchecked = /^\s*[\-\*]\s+\[\s\]\s+(.*)$/.exec(line);
      const mNumbered = /^\s*\d+\.\s+(.*)$/.exec(line);
      const mBullet = /^\s*[\-\*]\s+(.*)$/.exec(line);
      const content =
        (mTaskChecked && mTaskChecked[1]) ||
        (mTaskUnchecked && mTaskUnchecked[1]) ||
        (mNumbered && mNumbered[1]) ||
        (mBullet && mBullet[1]) ||
        null;
      if (content && this.containsBlacklistedWord(content, filePath))
        return true;
    } catch (e) {}
    return false;
  }

  // Helper: Check if a position is within a codeblock
  isPositionInCodeblock(pos, text, from) {
    try {
      // Find all codeblock ranges
      const codeblockPattern = /```[\s\S]*?```/g;
      let match;
      while ((match = codeblockPattern.exec(text)) !== null) {
        const cbStart = from + match.index;
        const cbEnd = from + match.index + match[0].length;
        if (pos >= cbStart && pos <= cbEnd) return true;
      }
    } catch (e) {}
    return false;
  }

  // NEW METHOD: Standard editor processing for small/medium pattern/text sizes
  buildDecoStandard(
    view,
    builder,
    from,
    to,
    text,
    entries,
    folderEntry,
    filePath = null,
  ) {
    // OPTIMIZATION: Limit matches while typing
    const MAX_MATCHES_LIMIT = this._isTyping ? 500 : 3000;
    const entries_copy = entries || this.getSortedWordEntries();

    // DEBUG: Log timepm entry status
    const allTimeEntries = entries_copy.filter(
      (e) =>
        e &&
        e.presetLabel &&
        (e.presetLabel.includes("Times") || e.pattern.includes("am")),
    );
    debugLog(
      "TIMEPM_ENTRY",
      `Total entries=${entries_copy.length}, Time entries found=${allTimeEntries.length}`,
    );
    if (allTimeEntries.length > 0) {
      allTimeEntries.forEach((e, i) => {
        debugLog(
          "TIMEPM_ENTRY",
          `[${i}] pattern=${e.pattern.substring(0, 50)}, regex=${e.regex ? "yes" : "no"}, invalid=${e.invalid}, presetLabel=${e.presetLabel}`,
        );
      });
    }
    const timeEntry = entries_copy.find(
      (e) => e && e.presetLabel && e.presetLabel.includes("Times"),
    );
    if (timeEntry) {
      debugLog(
        "TIMEPM_ENTRY",
        `Found timepm entry, regex=${timeEntry.regex ? "yes" : "no"}, invalid=${timeEntry.invalid}`,
      );
    } else {
      debugLog("TIMEPM_ENTRY", "No timepm entry found in entries");
    }

    let matches = [];
    let headingRanges = [];
    let hasHeadingBlacklist = false;
    let codeblockRanges = []; // Track codeblocks to exclude from coloring

    try {
      // DETECT CODEBLOCKS: Find all ``` ... ``` ranges to mark as protected
      const codeblockPattern = /```[\s\S]*?```/g;
      let cbMatch;
      while ((cbMatch = codeblockPattern.exec(text)) !== null) {
        const codeblockStart = from + cbMatch.index;
        const codeblockEnd = from + cbMatch.index + cbMatch[0].length;
        codeblockRanges.push({ start: codeblockStart, end: codeblockEnd });
      }

      // Check for codeblock blacklist/whitelist entries
      // Use the filtered entries parameter, not unfiltered wordEntries
      const we = entries;
      const blEntries = Array.isArray(this.settings.blacklistEntries)
        ? this.settings.blacklistEntries
        : [];
      const codeblockEntry = we.find(
        (e) => e && e.presetLabel === "Codeblocks",
      );
      const hasCodeblockBlacklist = !!blEntries.find(
        (e) => e && e.presetLabel === "Codeblocks" && !!e.isRegex,
      );

      // If codeblock is blacklisted, skip all codeblock content from coloring
      // If codeblock entry exists, color all codeblock content
      if (hasCodeblockBlacklist) {
        // Skip all content inside codeblocks
        for (const cbRange of codeblockRanges) {
          matches.push({ start: cbRange.start, end: cbRange.end, skip: true });
        }
      } else if (codeblockEntry) {
        // Color all content inside codeblocks
        for (const cbMatch of text.matchAll(/```[\s\S]*?```/g)) {
          const start = from + cbMatch.index;
          const end = from + cbMatch.index + cbMatch[0].length;
          if (codeblockEntry.backgroundColor) {
            const tc = codeblockEntry.textColor || "currentColor";
            const bc = codeblockEntry.backgroundColor;
            matches.push({
              start,
              end,
              textColor: tc,
              backgroundColor: bc,
              isTextBg: true,
            });
          } else {
            const c = codeblockEntry.color || codeblockEntry.textColor;
            if (c) matches.push({ start, end, color: c });
          }
        }
      }
    } catch (e) {}

    // DETECT HEADINGS: Use Regex for fast detection (skips complex loops)
    // OPTIMIZATION: Removed skip-while-typing to fix flickering
    try {
      const we = entries;
      const headingRegex = /^(#{1,6})\s+(.*)$/gm;
      let match;

      while ((match = headingRegex.exec(text)) !== null) {
        const lineStart = match.index;
        const lineEnd = match.index + match[0].length;

        headingRanges.push({ start: from + lineStart, end: from + lineEnd });

        const hashes = match[1].length;
        const entryToUse = getEntryForHeadingLevel(we, hashes);

        if (entryToUse) {
          const contentStart = lineStart + hashes + 1; // +1 for space
          // Only color content if needed, or whole line? Original logic colored whole line minus hashes?
          // Original: while (i < lineEnd && text[i] === ' ') i++; const start = from + i;

          // Re-implement precise start calculation
          let contentStartOffset = hashes;
          while (
            contentStartOffset < match[0].length &&
            /\s/.test(match[0][contentStartOffset])
          )
            contentStartOffset++;

          const start = from + match.index + contentStartOffset;
          const end = from + lineEnd;

          if (entryToUse.backgroundColor) {
            const tc = entryToUse.textColor || "currentColor";
            const bc = entryToUse.backgroundColor;
            matches.push({
              start,
              end,
              textColor: tc,
              backgroundColor: bc,
              isTextBg: true,
            });
          } else {
            const c = entryToUse.color || entryToUse.textColor;
            if (c) matches.push({ start, end, color: c });
          }
        }
      }
    } catch (e) {}

    // PROCESS MARKDOWN FORMATTING: Bullet Points, Numbered Lists, Tasks
    // OPTIMIZATION: Skip heavy list processing while typing
    if (!this._isTyping) {
      try {
        // Use the filtered entries (already filtered by filterEntriesByAdvancedRules), not unfiltered wordEntries
        const we = entries;
        const blEntries = Array.isArray(this.settings.blacklistEntries)
          ? this.settings.blacklistEntries
          : [];

        const taskCheckedEntry = we.find(
          (e) => e && e.presetLabel === "Task List (Checked)",
        );
        const taskUncheckedEntry = we.find(
          (e) => e && e.presetLabel === "Task List (Unchecked)",
        );
        const numberedEntry = we.find(
          (e) => e && e.presetLabel === "Numbered Lists",
        );
        const bulletEntry = we.find(
          (e) => e && e.presetLabel === "Bullet Points",
        );

        const taskCheckedBlacklisted = !!blEntries.find(
          (e) => e && e.presetLabel === "Task List (Checked)" && !!e.isRegex,
        );
        const taskUncheckedBlacklisted = !!blEntries.find(
          (e) => e && e.presetLabel === "Task List (Unchecked)" && !!e.isRegex,
        );
        const numberedBlacklisted = !!blEntries.find(
          (e) => e && e.presetLabel === "Numbered Lists" && !!e.isRegex,
        );
        const bulletBlacklisted = !!blEntries.find(
          (e) => e && e.presetLabel === "Bullet Points" && !!e.isRegex,
        );

        // Check if entries should be colored based on advanced rules
        const taskCheckedAllowed =
          !filePath ||
          this.shouldColorText(
            filePath,
            taskCheckedEntry ? taskCheckedEntry.pattern : null,
          );
        const taskUncheckedAllowed =
          !filePath ||
          this.shouldColorText(
            filePath,
            taskUncheckedEntry ? taskUncheckedEntry.pattern : null,
          );
        const numberedAllowed =
          !filePath ||
          this.shouldColorText(
            filePath,
            numberedEntry ? numberedEntry.pattern : null,
          );
        const bulletAllowed =
          !filePath ||
          this.shouldColorText(
            filePath,
            bulletEntry ? bulletEntry.pattern : null,
          );

        // Process each line and check patterns in priority order
        let pos = 0;
        while (pos <= text.length) {
          const lineStart = pos;
          const nextNL = text.indexOf("\n", pos);
          const lineEnd = nextNL === -1 ? text.length : nextNL;
          const line = text.substring(lineStart, lineEnd);

          // Check in priority order: most specific first
          let matched = false;

          // Task checked
          if (
            !matched &&
            !taskCheckedBlacklisted &&
            taskCheckedEntry &&
            taskCheckedAllowed
          ) {
            const pattern = REGEX_CONSTANTS.TASK_CHECKED;
            const mdMatch = pattern.exec(line);
            if (mdMatch) {
              const contentStart =
                lineStart +
                mdMatch.index +
                (mdMatch[1].length +
                  mdMatch[2].length +
                  mdMatch[3].length +
                  mdMatch[4].length +
                  mdMatch[5].length);
              const contentEnd = lineEnd;
              const contentText = mdMatch[6] || "";
              // Check both content blacklist AND line-level regex blacklist
              const lineBlacklisted = this.isLineBlacklistedByRegex(
                line,
                filePath,
              );
              if (
                contentStart < contentEnd &&
                !this.containsBlacklistedWord(contentText, filePath) &&
                !lineBlacklisted
              ) {
                const start = from + contentStart;
                const end = from + contentEnd;
                if (taskCheckedEntry.backgroundColor) {
                  const tc = taskCheckedEntry.textColor || "currentColor";
                  const bc = taskCheckedEntry.backgroundColor;
                  matches.push({
                    start,
                    end,
                    textColor: tc,
                    backgroundColor: bc,
                    isTextBg: true,
                  });
                } else {
                  const c =
                    taskCheckedEntry.color || taskCheckedEntry.textColor;
                  if (c) matches.push({ start, end, color: c });
                }
                matched = true;
              }
            }
          }

          // Task unchecked
          if (
            !matched &&
            !taskUncheckedBlacklisted &&
            taskUncheckedEntry &&
            taskUncheckedAllowed
          ) {
            const pattern = /^(\s*)([\-\*])(\s+)(\[\s\])(\s+)(.*)$/;
            const mdMatch = pattern.exec(line);
            if (mdMatch) {
              const contentStart =
                lineStart +
                mdMatch.index +
                (mdMatch[1].length +
                  mdMatch[2].length +
                  mdMatch[3].length +
                  mdMatch[4].length +
                  mdMatch[5].length);
              const contentEnd = lineEnd;
              const contentText = mdMatch[6] || "";
              // Check both content blacklist AND line-level regex blacklist
              const lineBlacklisted = this.isLineBlacklistedByRegex(
                line,
                filePath,
              );
              if (
                contentStart < contentEnd &&
                !this.containsBlacklistedWord(contentText, filePath) &&
                !lineBlacklisted
              ) {
                const start = from + contentStart;
                const end = from + contentEnd;
                if (taskUncheckedEntry.backgroundColor) {
                  const tc = taskUncheckedEntry.textColor || "currentColor";
                  const bc = taskUncheckedEntry.backgroundColor;
                  matches.push({
                    start,
                    end,
                    textColor: tc,
                    backgroundColor: bc,
                    isTextBg: true,
                  });
                } else {
                  const c =
                    taskUncheckedEntry.color || taskUncheckedEntry.textColor;
                  if (c) matches.push({ start, end, color: c });
                }
                matched = true;
              }
            }
          }

          // Numbered lists
          if (
            !matched &&
            !numberedBlacklisted &&
            numberedEntry &&
            numberedAllowed
          ) {
            const pattern = REGEX_CONSTANTS.NUMBERED_LIST;
            const mdMatch = pattern.exec(line);
            if (mdMatch) {
              const contentStart =
                lineStart +
                mdMatch.index +
                (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length);
              const contentEnd = lineEnd;
              const contentText = mdMatch[4] || "";
              // Check both content blacklist AND line-level regex blacklist
              const lineBlacklisted = this.isLineBlacklistedByRegex(
                line,
                filePath,
              );
              if (
                contentStart < contentEnd &&
                !this.containsBlacklistedWord(contentText, filePath) &&
                !lineBlacklisted
              ) {
                const start = from + contentStart;
                const end = from + contentEnd;
                if (numberedEntry.backgroundColor) {
                  const tc = numberedEntry.textColor || "currentColor";
                  const bc = numberedEntry.backgroundColor;
                  matches.push({
                    start,
                    end,
                    textColor: tc,
                    backgroundColor: bc,
                    isTextBg: true,
                  });
                } else {
                  const c = numberedEntry.color || numberedEntry.textColor;
                  if (c) matches.push({ start, end, color: c });
                }
                matched = true;
              }
            }
          }

          // Bullet points
          if (!matched && !bulletBlacklisted && bulletEntry && bulletAllowed) {
            const mdMatch = REGEX_CONSTANTS.BULLET_POINT.exec(line);
            if (mdMatch) {
              const contentStart =
                lineStart +
                mdMatch.index +
                (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length);
              const contentEnd = lineEnd;
              const contentText = mdMatch[4] || "";
              // Check both content blacklist AND line-level regex blacklist
              const lineBlacklisted = this.isLineBlacklistedByRegex(
                line,
                filePath,
              );
              if (
                contentStart < contentEnd &&
                !this.containsBlacklistedWord(contentText, filePath) &&
                !lineBlacklisted
              ) {
                const start = from + contentStart;
                const end = from + contentEnd;
                if (bulletEntry.backgroundColor) {
                  const tc = bulletEntry.textColor || "currentColor";
                  const bc = bulletEntry.backgroundColor;
                  matches.push({
                    start,
                    end,
                    textColor: tc,
                    backgroundColor: bc,
                    isTextBg: true,
                  });
                } else {
                  const c = bulletEntry.color || bulletEntry.textColor;
                  if (c) matches.push({ start, end, color: c });
                }
                matched = true;
              }
            }
          }

          if (nextNL === -1) break;
          pos = nextNL + 1;
        }
      } catch (e) {}
    }

    // Get all blacklisted list item ranges (so we can exclude individual word matches from being colored)
    const blacklistedListRanges = this.getBlacklistedListItemRanges(
      text,
      from,
      filePath,
    );

    // FIRST: Process text+bg entries (they have priority and override other styling)
    // Filter text+bg entries by file rules just like regular entries
    let textBgEntries = Array.isArray(this._compiledTextBgEntries)
      ? this._compiledTextBgEntries
      : [];
    if (filePath) {
      textBgEntries = textBgEntries.filter((entry) => {
        if (!entry || !entry.pattern) return true;
        return this.shouldColorText(filePath, entry.pattern, entry);
      });
    }
    for (const entry of textBgEntries) {
      if (!entry || entry.invalid) continue;
      try {
        if (
          entry.fastTest &&
          typeof entry.fastTest === "function" &&
          !entry.fastTest(text)
        )
          continue;
      } catch (e) {}

      const regex = entry.regex;
      if (!regex) continue;

      const _matches = this.safeMatchLoop(regex, text);
      for (const match of _matches) {
        const matchedText = match[0];
        const matchStart = match.index;
        const matchEnd = match.index + matchedText.length;

        if (!this.matchSatisfiesType(text, matchStart, matchEnd, entry))
          continue;

        if (this.isContextBlacklisted(text, matchStart, matchEnd, filePath))
          continue;

        const absStart = from + matchStart;
        const absEnd = from + matchEnd;

        // Skip if in blacklisted list item range
        if (
          this.isMatchInBlacklistedRange(
            absStart,
            absEnd,
            blacklistedListRanges,
          )
        )
          continue;

        if (hasHeadingBlacklist && headingRanges && headingRanges.length > 0) {
          let inHeading = false;
          for (const hr of headingRanges) {
            if (absStart < hr.end && absEnd > hr.start) {
              inHeading = true;
              break;
            }
          }
          if (inHeading) continue;
        }

        // For 'contains' matchType, color the ENTIRE full word, not just the matched part
        const fullWordStart = this.extractFullWord(text, matchStart, matchEnd);
        let colorStart = matchStart;
        let colorEnd = matchEnd;

        {
          const mt = String(entry.matchType || "").toLowerCase();
          if (
            (mt === "contains" || mt === "startswith" || mt === "endswith") &&
            !this.isSentenceLikePattern(entry.pattern)
          ) {
            // Find actual word boundaries
            colorStart = matchStart;
            colorEnd = matchEnd;
            while (
              colorStart > 0 &&
              (/[A-Za-z0-9]/.test(text[colorStart - 1]) ||
                text[colorStart - 1] === "-" ||
                text[colorStart - 1] === "'")
            ) {
              colorStart--;
            }
            while (
              colorEnd < text.length &&
              (/[A-Za-z0-9]/.test(text[colorEnd]) ||
                text[colorEnd] === "-" ||
                text[colorEnd] === "'")
            ) {
              colorEnd++;
            }

            // Validate that the expanded full word satisfies the match type strictly
            const fullWord = text.substring(colorStart, colorEnd);
            const cs =
              typeof entry._caseSensitiveOverride === "boolean"
                ? entry._caseSensitiveOverride
                : typeof entry.caseSensitive === "boolean"
                  ? entry.caseSensitive
                  : this.settings.caseSensitive;
            const patRaw = String(entry.pattern || "");
            const pat = cs ? patRaw : patRaw.toLowerCase();
            const word = cs ? fullWord : fullWord.toLowerCase();
            let satisfies = false;

            if (mt === "contains") {
              satisfies = word.includes(pat);
            } else if (mt === "startswith") {
              satisfies = word.startsWith(pat);
            } else if (mt === "endswith") {
              satisfies = word.endsWith(pat);
            }

            // If expanded word doesn't satisfy the match type, use original match range
            if (!satisfies) {
              colorStart = matchStart;
              colorEnd = matchEnd;
            }
          }
        }

        matches.push({
          start: from + colorStart,
          end: from + colorEnd,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor,
          isTextBg: true,
          entryRef: entry,
        });

        if (matches.length > MAX_MATCHES_LIMIT) break;
      }

      if (matches.length > MAX_MATCHES_LIMIT) break;
    }

    // SECOND: Process regular entries, but skip areas covered by text+bg entries
    // NOTE: Text-only entries with no explicit matchType (using default 'contains' from partialMatch setting) are processed separately in the "Partial Match coloring" section below
    for (const entry of entries_copy) {
      if (!entry || entry.invalid) continue;

      // Skip text-only entries without explicit matchType that use the default 'contains' - they're handled in the partial match section
      const isTextOnly =
        !entry.isTextBg && (!entry.styleType || entry.styleType === "text");
      // Only skip if NO explicit matchType is set (using setting default), partialMatch is enabled,
      // AND the pattern is not sentence-like (i.e., does not include punctuation/whitespace).
      const hasExplicitMatchType =
        entry.matchType && String(entry.matchType).toLowerCase() !== "exact";
      const shouldSkipToPartialSection =
        isTextOnly &&
        !hasExplicitMatchType &&
        this.settings.partialMatch &&
        !this.isSentenceLikePattern(entry.pattern) &&
        this.isLatinWordPattern(entry.pattern);

      if (shouldSkipToPartialSection) {
        debugLog(
          "MAIN_LOOP_SKIP_PARTIAL",
          `pattern="${entry.pattern}" matchType="${entry.matchType}" (undefined means using setting default) isTextOnly=${isTextOnly}`,
        );
        continue;
      }

      const actualMatchType = String(
        entry.matchType || (this.settings.partialMatch ? "contains" : "exact"),
      ).toLowerCase();
      debugLog(
        "MAIN_LOOP_PROCESS",
        `pattern="${entry.pattern}" isTextOnly=${isTextOnly} matchType="${entry.matchType}" actualMatchType="${actualMatchType}"`,
      );

      // OPTIMIZATION: Cache expensive checks
      const isSentenceLike = this.isSentenceLikePattern(entry.pattern);

      // OPTIMIZATION: Pre-calculate regex for startswith/endswith
      let startswithRegex = null;
      let endswithRegex = null;
      if (
        isSentenceLike &&
        (actualMatchType === "startswith" || actualMatchType === "endswith")
      ) {
        try {
          const cs =
            typeof entry._caseSensitiveOverride === "boolean"
              ? entry._caseSensitiveOverride
              : typeof entry.caseSensitive === "boolean"
                ? entry.caseSensitive
                : this.settings.caseSensitive;
          const patRaw = String(entry.pattern || "");
          const flags = cs ? "" : "i";
          const esc = this.helpers.escapeRegex
            ? this.helpers.escapeRegex(patRaw)
            : patRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

          if (actualMatchType === "startswith") {
            startswithRegex = new RegExp(`^${esc}[A-Za-z]*$`, flags);
          } else if (actualMatchType === "endswith") {
            endswithRegex = new RegExp(`^[A-Za-z]*${esc}$`, flags);
          }
        } catch (_) {}
      }

      try {
        if (entry.fastTest && typeof entry.fastTest === "function") {
          const fastTestResult = entry.fastTest(text);
          if (
            (entry.pattern && entry.pattern.includes("am")) ||
            (entry.presetLabel && entry.presetLabel.includes("Times"))
          ) {
            debugLog(
              "FASTTEST_CHECK",
              `Pattern: ${entry.presetLabel || entry.pattern.substring(0, 40)}, fastTest result=${fastTestResult}, text length=${text.length}, text="${text.substring(0, 50)}"`,
            );
          }
          if (!fastTestResult) continue;
        }
      } catch (e) {}

      const regex = entry.regex;
      if (!regex) continue;

      // DEBUG: Log if we're processing timepm or username patterns
      if (
        (entry.pattern && entry.pattern.includes("am")) ||
        (entry.presetLabel && entry.presetLabel.includes("Times"))
      ) {
        debugLog(
          "REGEX_ENTRY",
          `Processing ${entry.presetLabel || entry.pattern}, fastTest=${entry.fastTest ? "yes" : "no"}`,
        );
      }

      let iterCount = 0;
      const _matches2 = this.safeMatchLoop(regex, text);

      // DEBUG: Log timepm/username matches found
      if (
        (entry.pattern && entry.pattern.includes("am")) ||
        (entry.presetLabel && entry.presetLabel.includes("Times"))
      ) {
        debugLog(
          "REGEX_FOUND",
          `${entry.presetLabel || entry.pattern}: found ${_matches2.length} matches`,
        );
      }

      for (const match of _matches2) {
        iterCount++;
        const matchedText = match[0];

        const matchStart = from + match.index;
        const matchEnd = from + match.index + matchedText.length;

        // Skip if in blacklisted list item range
        if (
          this.isMatchInBlacklistedRange(
            matchStart,
            matchEnd,
            blacklistedListRanges,
          )
        ) {
          try {
            if (
              typeof regex.lastIndex === "number" &&
              regex.lastIndex === match.index
            )
              regex.lastIndex++;
          } catch (e) {}
          continue;
        }

        const overlappingTextBgIndices = [];
        for (let i = 0; i < matches.length; i++) {
          const tbMatch = matches[i];
          if (!tbMatch || !tbMatch.isTextBg) continue;
          if (matchStart < tbMatch.end && matchEnd > tbMatch.start) {
            overlappingTextBgIndices.push(i);
          }
        }
        if (overlappingTextBgIndices.length > 0) {
          const mLength = matchEnd - matchStart;
          // IMPORTANT: Preset patterns (like Times, @username) should NOT be blocked by text+bg entries
          // Presets are meant to be always-on patterns that take priority
          const isPresetPattern =
            entry.presetLabel &&
            (entry.presetLabel.includes("Times") ||
              entry.presetLabel.includes("username"));

          if (!isPresetPattern) {
            const allShorter = overlappingTextBgIndices.every(
              (i) => matches[i].end - matches[i].start < mLength,
            );
            if (entry.presetLabel && entry.presetLabel.includes("Times")) {
              debugLog(
                "OVERLAP_CHECK",
                `Time match '${matchedText}' length=${mLength}, overlaps=${overlappingTextBgIndices.length}, allShorter=${allShorter}, isPreset=${isPresetPattern}`,
              );
            }
            if (!allShorter) {
              try {
                if (
                  typeof regex.lastIndex === "number" &&
                  regex.lastIndex === match.index
                )
                  regex.lastIndex++;
              } catch (e) {}
              continue;
            }
          } else {
            // For preset patterns, always remove overlapping text+bg entries
            if (entry.presetLabel && entry.presetLabel.includes("Times")) {
              debugLog(
                "OVERLAP_CHECK",
                `Time match '${matchedText}' length=${mLength}, overlaps=${overlappingTextBgIndices.length}, isPreset=${isPresetPattern} - REMOVING overlaps`,
              );
            }
          }
          for (let i = overlappingTextBgIndices.length - 1; i >= 0; i--) {
            matches.splice(overlappingTextBgIndices[i], 1);
          }
        }

        if (hasHeadingBlacklist && headingRanges && headingRanges.length > 0) {
          let inHeading = false;
          for (const hr of headingRanges) {
            if (matchStart < hr.end && matchEnd > hr.start) {
              inHeading = true;
              break;
            }
          }
          if (inHeading) continue;
        }

        {
          const mt = String(
            entry.matchType ||
              (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase();
          if (
            !this.isSentenceLikePattern(entry.pattern) &&
            mt === "exact" &&
            !this.isWholeWordMatch(
              text,
              match.index,
              match.index + matchedText.length,
            )
          ) {
            continue;
          }
        }

        // Use helper to extract full word and check if blacklisted
        if (
          this.isContextBlacklisted(
            text,
            match.index,
            match.index + matchedText.length,
            filePath,
          )
        )
          continue;

        const mt = String(
          entry.matchType ||
            (this.settings.partialMatch ? "contains" : "exact"),
        ).toLowerCase();
        let colorStart = match.index;
        let colorEnd = match.index + matchedText.length;

        // For partial match types on non-sentence patterns, ALWAYS expand to full word first
        if (
          (mt === "contains" || mt === "startswith" || mt === "endswith") &&
          !this.isSentenceLikePattern(entry.pattern)
        ) {
          while (
            colorStart > 0 &&
            (/[A-Za-z0-9]/.test(text[colorStart - 1]) ||
              text[colorStart - 1] === "-" ||
              text[colorStart - 1] === "'")
          )
            colorStart--;
          while (
            colorEnd < text.length &&
            (/[A-Za-z0-9]/.test(text[colorEnd]) ||
              text[colorEnd] === "-" ||
              text[colorEnd] === "'")
          )
            colorEnd++;
        }

        // Validate that the expanded full word satisfies the partial match type
        if (
          (mt === "contains" || mt === "startswith" || mt === "endswith") &&
          !this.isSentenceLikePattern(entry.pattern)
        ) {
          const fullWord = text.substring(colorStart, colorEnd);
          const cs =
            typeof entry._caseSensitiveOverride === "boolean"
              ? entry._caseSensitiveOverride
              : typeof entry.caseSensitive === "boolean"
                ? entry.caseSensitive
                : this.settings.caseSensitive;
          const patRaw = String(entry.pattern || "");
          const pat = cs ? patRaw : patRaw.toLowerCase();
          const word = cs ? fullWord : fullWord.toLowerCase();
          let ok = false;

          if (mt === "contains") {
            ok = word.includes(pat);
          } else if (mt === "startswith") {
            // For startswith, the full word must start with the pattern
            ok = word.startsWith(pat);
          } else if (mt === "endswith") {
            // For endswith, the full word must end with the pattern
            ok = word.endsWith(pat);
          }

          if (!ok) {
            // Full word does not satisfy the rule, skip this match entirely
            try {
              if (
                typeof regex.lastIndex === "number" &&
                regex.lastIndex === match.index
              )
                regex.lastIndex++;
            } catch (e) {}
            continue;
          }
        } else if (
          mt === "contains" ||
          mt === "startswith" ||
          mt === "endswith"
        ) {
          // For sentence-like patterns, do the old validation
          // If it's a regex entry, we trust the regex match (string inclusion check would fail for regex patterns)
          if (entry.isRegex) {
            matches.push({
              start: from + colorStart,
              end: from + colorEnd,
              color:
                entry.textColor && entry.textColor !== "currentColor"
                  ? entry.textColor
                  : entry.color,
              styleType: entry.styleType,
              textColor: entry.textColor,
              backgroundColor: entry.backgroundColor,
              entryRef: entry,
            });
            continue;
          }

          const fullWord = text.substring(colorStart, colorEnd);
          const cs =
            typeof entry._caseSensitiveOverride === "boolean"
              ? entry._caseSensitiveOverride
              : typeof entry.caseSensitive === "boolean"
                ? entry.caseSensitive
                : this.settings.caseSensitive;
          const patRaw = String(entry.pattern || "");
          const pat = cs ? patRaw : patRaw.toLowerCase();
          const word = cs ? fullWord : fullWord.toLowerCase();
          let ok = false;
          if (mt === "contains") {
            ok = word.includes(pat);
          } else if (mt === "startswith") {
            try {
              const flags = cs ? "" : "i";
              const esc = this.helpers.escapeRegex
                ? this.helpers.escapeRegex(patRaw)
                : patRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              const re = new RegExp(`^${esc}[A-Za-z]*$`, flags);
              ok = re.test(fullWord);
            } catch (_) {
              ok = word.startsWith(pat);
            }
          } else if (mt === "endswith") {
            try {
              const flags = cs ? "" : "i";
              const esc = this.helpers.escapeRegex
                ? this.helpers.escapeRegex(patRaw)
                : patRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              const re = new RegExp(`^[A-Za-z0-9'\\-]*${esc}$`, flags);
              ok = re.test(fullWord);
            } catch (_) {
              ok = word.endsWith(pat);
            }
          } else if (mt === "exact") {
            ok = word === pat;
          }
          if (!ok) {
            try {
              if (
                typeof regex.lastIndex === "number" &&
                regex.lastIndex === match.index
              )
                regex.lastIndex++;
            } catch (e) {}
            continue;
          }
        }
        matches.push({
          start: from + colorStart,
          end: from + colorEnd,
          color:
            entry.textColor && entry.textColor !== "currentColor"
              ? entry.textColor
              : entry.color,
          styleType: entry.styleType,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor,
          entryRef: entry,
        });

        if (matches.length > 3000) break;
      }

      if (iterCount > 0) {
        try {
          entry.execs = (entry.execs || 0) + iterCount;
        } catch (e) {}
        try {
          this._perfCounters.totalRegexExecs =
            (this._perfCounters.totalRegexExecs || 0) + iterCount;
        } catch (e) {}
      }

      if (matches.length > 3000) break;
    }

    // --- Partial Match coloring (for editor, matching reading mode behavior) ---
    const checkPartialMatch = (e) => {
      if (
        !e ||
        e.invalid ||
        !(!e.styleType || e.styleType === "text") ||
        e.isTextBg
      )
        return false;
      // Only include entries without explicit matchType (using the setting default)
      // Entries with explicit 'startswith' or 'endswith' should go through main loop
      if (
        e.matchType &&
        String(e.matchType).toLowerCase() !== "contains" &&
        String(e.matchType).toLowerCase() !== "exact"
      ) {
        return false; // Skip entries with explicit startswith/endswith
      }
      // Do not include sentence-like patterns in partial match; handle them in main loop
      try {
        if (this.isSentenceLikePattern(e.pattern)) return false;
        if (!this.isLatinWordPattern(e.pattern)) return false;
      } catch (_) {}
      const actualMatchType = String(
        e.matchType || (this.settings.partialMatch ? "contains" : "exact"),
      ).toLowerCase();
      return actualMatchType === "contains"; // Only 'contains' goes here (whether explicit or default)
    };
    debugLog(
      "PARTIAL_MATCH_SECTION_ENTRY",
      `entries_copy.length=${entries_copy.length}, some matches partial=${entries_copy.some(checkPartialMatch)}, matches.length=${matches.length}`,
    );
    if (entries_copy.some(checkPartialMatch) && matches.length < 3000) {
      const textOnlyEntries = entries_copy.filter(checkPartialMatch);
      debugLog(
        "PARTIAL_MATCH_RUNNING",
        `textOnlyEntries.length=${textOnlyEntries.length}, text="${text.substring(0, 100)}", partialMatch setting=${this.settings.partialMatch}`,
      );
      textOnlyEntries.forEach((e, idx) =>
        debugLog(
          "PARTIAL_ENTRY_DETAIL",
          `[${idx}] pattern="${e.pattern}" matchType="${e.matchType}" styleType="${e.styleType}"`,
        ),
      );
      if (textOnlyEntries.length > 0) {
        const wordRegex = /[A-Za-z0-9'\-]+/g;
        let match;
        let wordMatchCount = 0;
        while ((match = wordRegex.exec(text))) {
          wordMatchCount++;
          const w = match[0];
          const wStart = match.index;
          const wEnd = wStart + w.length;

          if (this.isWordBlacklisted(w, filePath)) continue;

          const absWStart = from + wStart;
          const absWEnd = from + wEnd;

          // Skip if in blacklisted list item range
          if (
            this.isMatchInBlacklistedRange(
              absWStart,
              absWEnd,
              blacklistedListRanges,
            )
          )
            continue;

          if (
            hasHeadingBlacklist &&
            headingRanges &&
            headingRanges.length > 0
          ) {
            let inHeading = false;
            for (const hr of headingRanges) {
              if (absWStart < hr.end && absWEnd > hr.start) {
                inHeading = true;
                break;
              }
            }
            if (inHeading) continue;
          }

          for (const entry of textOnlyEntries) {
            if (!entry || entry.invalid) continue;
            // Skip pure symbol patterns in partial match
            if (/^[\s~`!@#$%^&*()\-\_=+\[\]{};:'",.<>\/?\\|]+$/.test(entry.pattern))
              continue;
            if (this.isWordBlacklisted(entry.pattern, filePath)) continue;

            // This section only handles 'contains' matchType
            const mt = String(
              entry.matchType ||
                (this.settings.partialMatch ? "contains" : "exact"),
            ).toLowerCase();
            const cs =
              typeof entry._caseSensitiveOverride === "boolean"
                ? entry._caseSensitiveOverride
                : typeof entry.caseSensitive === "boolean"
                  ? entry.caseSensitive
                  : this.settings.caseSensitive;
            const word = cs ? w : w.toLowerCase();
            const pat = cs
              ? String(entry.pattern || "")
              : String(entry.pattern || "").toLowerCase();

            // Only 'contains' should reach here (startswith/endswith handled in main loop)
            let ok = false;
            if (mt === "contains") {
              ok = word.includes(pat);
            }

            if (w === "should" || w === "colored")
              debugLog(
                "PARTIAL_WORD_CHECK",
                `w="${w}" entry.pattern="${entry.pattern}" mt="${mt}" word="${word}" pat="${pat}" ok=${ok}`,
              );
            if (ok) {
              // For text-only coloring, expand to full word boundaries
              let expandedWStart = wStart;
              let expandedWEnd = wEnd;

              // OPTIMIZATION: Skip expansion in extreme lightweight mode
              if (
                !this.settings.extremeLightweightMode &&
                !this.isSentenceLikePattern(entry.pattern)
              ) {
                const nonRoman =
                  this.containsNonRomanCharacters &&
                  this.containsNonRomanCharacters(entry.pattern);
                if (nonRoman) {
                  while (
                    expandedWStart > 0 &&
                    this.isCJKChar(text[expandedWStart - 1])
                  )
                    expandedWStart--;
                  while (
                    expandedWEnd < text.length &&
                    this.isCJKChar(text[expandedWEnd])
                  )
                    expandedWEnd++;
                } else {
                  while (
                    expandedWStart > 0 &&
                    (/[A-Za-z0-9]/.test(text[expandedWStart - 1]) ||
                      text[expandedWStart - 1] === "-" ||
                      text[expandedWStart - 1] === "'")
                  )
                    expandedWStart--;
                  while (
                    expandedWEnd < text.length &&
                    (/[A-Za-z0-9]/.test(text[expandedWEnd]) ||
                      text[expandedWEnd] === "-" ||
                      text[expandedWEnd] === "'")
                  )
                    expandedWEnd++;
                }
              }

              debugLog(
                "PARTIAL_EXPANSION",
                `pattern="${entry.pattern}" word="${w}" wStart=${wStart} wEnd=${wEnd} expanded=${expandedWStart}-${expandedWEnd} (${text.substring(expandedWStart, expandedWEnd)})`,
              );

              // Check if this partial match overlaps with any existing match (convert existing to text-relative for comparison)
              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                const existStart = existingMatch.start - from;
                const existEnd = existingMatch.end - from;
                if (expandedWStart < existEnd && expandedWEnd > existStart) {
                  overlapsWithExisting = true;
                  break;
                }
              }

              // Add partial match if no overlap with existing, or replace if replacing smaller overlaps
              if (!overlapsWithExisting) {
                const useColor =
                  folderEntry && folderEntry.defaultColor
                    ? folderEntry.defaultColor
                    : entry.textColor && entry.textColor !== "currentColor"
                      ? entry.textColor
                      : entry.color;
                debugLog(
                  "PARTIAL_MATCH_ADDED",
                  `pattern="${entry.pattern}" word="${w}" final_range=${from + expandedWStart}-${from + expandedWEnd}`,
                );
                matches.push({
                  start: from + expandedWStart,
                  end: from + expandedWEnd,
                  color: useColor,
                  styleType: "text",
                  entryRef: entry,
                });
                if (matches.length > 3000) break;
              } else {
                // Remove smaller overlapping matches and add the full word instead
                matches = matches.filter(
                  (m) =>
                    !(
                      m.start >= from + expandedWStart &&
                      m.end <= from + expandedWEnd &&
                      m.end - m.start < expandedWEnd - expandedWStart
                    ),
                );
                const useColor =
                  folderEntry && folderEntry.defaultColor
                    ? folderEntry.defaultColor
                    : entry.textColor && entry.textColor !== "currentColor"
                      ? entry.textColor
                      : entry.color;
                matches.push({
                  start: from + expandedWStart,
                  end: from + expandedWEnd,
                  color: useColor,
                  styleType: "text",
                  entryRef: entry,
                });
                if (matches.length > 3000) break;
              }
              break;
            }
          }

          if (matches.length > 3000) break;
          try {
            if (
              typeof wordRegex.lastIndex === "number" &&
              wordRegex.lastIndex === match.index
            )
              wordRegex.lastIndex++;
          } catch (e) {}
        }
      }
    }

    // Apply folder color override (but not to text+bg entries)
    if (folderEntry && folderEntry.defaultColor) {
      matches = matches.map((m) =>
        m.isTextBg
          ? m
          : Object.assign({}, m, { color: folderEntry.defaultColor }),
      );
    }

    // Priority: text+bg with explicit text color should suppress background-only overlaps
    if (matches.some((m) => m.isTextBg)) {
      const fullTextBg = matches.filter(
        (m) => m.isTextBg && m.textColor && m.textColor !== "currentColor",
      );
      if (fullTextBg.length > 0) {
        matches = matches.filter((m) => {
          if (!(m.isTextBg && (!m.textColor || m.textColor === "currentColor")))
            return true;
          // Suppress bg-only if overlaps any full text+bg
          return !fullTextBg.some((f) => m.start < f.end && m.end > f.start);
        });
      }
    }

    if (matches.length > 1) {
      const all = matches.slice().sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start;
        const lenA = a.end - a.start;
        const lenB = b.end - b.start;
        if (lenA !== lenB) return lenB - lenA;
        const ar = a.entryRef && !!a.entryRef.isRegex;
        const br = b.entryRef && !!b.entryRef.isRegex;
        if (ar !== br) return ar ? 1 : -1;
        if (a.isTextBg && !b.isTextBg) return -1;
        if (!a.isTextBg && b.isTextBg) return 1;
        return 0;
      });
      const selected = [];
      for (const m of all) {
        let overlaps = false;
        const overlappingIndices = [];
        for (let i = 0; i < selected.length; i++) {
          const s = selected[i];
          if (m.start < s.end && m.end > s.start) {
            overlaps = true;
            overlappingIndices.push(i);
          }
        }
        if (!overlaps) {
          selected.push(m);
        } else {
          // Check if the new match is longer than ALL overlapping matches
          // If so, remove the overlapping ones and add this longer match instead
          const mLength = m.end - m.start;
          const allShorter = overlappingIndices.every((i) => {
            const s = selected[i];
            return s.end - s.start < mLength;
          });

          if (allShorter) {
            // Remove overlapping matches in reverse order to maintain indices
            for (let i = overlappingIndices.length - 1; i >= 0; i--) {
              selected.splice(overlappingIndices[i], 1);
            }
            selected.push(m);
          }
        }
      }
      matches = selected;
    }

    matches = matches.slice(0, 3000);

    matches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return a.end - b.end;
    });

    // DEBUG: Check if timepm or @username matches are in the final matches list
    try {
      const viewportText = text.substring(0, 100);
      if (viewportText.includes(":")) {
        const timeMatches = matches.filter((m) => {
          const matchText = text.substring(m.start - from, m.end - from);
          return (
            matchText && (matchText.includes("pm") || matchText.includes("am"))
          );
        });
        if (timeMatches.length > 0) {
          debugLog(
            "MATCHES_TIME",
            `Found ${timeMatches.length} time matches in ${matches.length} total matches`,
          );
        }
      }
      if (viewportText.includes("@")) {
        const userMatches = matches.filter((m) => {
          const matchText = text.substring(m.start - from, m.end - from);
          return matchText && matchText.startsWith("@");
        });
        if (userMatches.length > 0) {
          debugLog(
            "MATCHES_USER",
            `Found ${userMatches.length} username matches in ${matches.length} total matches`,
          );
        }
      }
    } catch (_) {}

    // Apply decorations
    const effectiveStyle = "text";
    if (
      effectiveStyle === "none" &&
      matches.length > 0 &&
      !matches.some((m) => m.isTextBg)
    )
      return builder.finish();

    let toApply = matches;
    if (matches.length > 1 && effectiveStyle !== "text") {
      const merged = [];
      for (const m of matches) {
        const last = merged[merged.length - 1];
        if (
          last &&
          ((m.isTextBg &&
            last.isTextBg &&
            m.textColor === last.textColor &&
            m.backgroundColor === last.backgroundColor &&
            m.start <= last.end) ||
            (!m.isTextBg &&
              !last.isTextBg &&
              effectiveStyle === "background" &&
              m.color === last.color &&
              m.start <= last.end))
        ) {
          if (m.end > last.end) last.end = m.end;
        } else {
          merged.push(Object.assign({}, m));
        }
      }
      toApply = merged;
    }

    for (const m of toApply) {
      // CRITICAL: Prevent nested spans in Bold/Italic elements in Live Preview
      // If we have a syntax tree, check if this match is inside a strong/em node
      if (tree) {
        try {
          // Check the center of the match to avoid boundary edge cases
          const checkPos = Math.min(
            m.end - 1,
            Math.max(m.start, Math.floor((m.start + m.end) / 2)),
          );
          const node = tree.resolve(checkPos, 1);
          // Check current node and parents for Strong/Emphasis
          let curr = node;
          let isInsideFormat = false;
          while (curr) {
            if (
              curr.name === "Strong" ||
              curr.name === "Emphasis" ||
              curr.name === "StrongEmphasis"
            ) {
              isInsideFormat = true;
              break;
            }
            curr = curr.parent;
          }
          if (isInsideFormat) {
            continue; // SKIP this decoration
          }
        } catch (e) {}
      }

      let style;
      if (m.isTextBg) {
        const hideText = this.settings.hideTextColors === true;
        const hideBg = this.settings.hideHighlights === true;
        if (hideText && hideBg) continue;
        const params = this.getHighlightParams(m.entryRef);
        const borderStyle = this.generateBorderStyle(
          hideText ? null : m.textColor,
          hideBg ? null : m.backgroundColor,
          m.entryRef,
        );
        const textPart = hideText
          ? ""
          : `color: ${m.textColor} !important; --highlight-color: ${m.textColor}; `;
        const vPad = params.vPad;
        const vPadCss =
          vPad >= 0
            ? `padding-top: ${vPad}px !important; padding-bottom: ${vPad}px !important;`
            : `padding-top: 0px !important; padding-bottom: 0px !important; margin-top: ${vPad}px !important; margin-bottom: ${vPad}px !important;`;
        const bgPart = hideBg
          ? ""
          : `background-color: ${this.hexToRgba(m.backgroundColor, params.opacity)} !important; border-radius: ${params.radius}px !important; padding-left: ${params.hPad}px !important; padding-right: ${params.hPad}px !important; ${vPadCss}${(this.settings.enableBoxDecorationBreak ?? true) ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
        style = `${textPart}${bgPart}${borderStyle}`;
      } else {
        // Check the styleType to determine how to apply the color
        // If affectMarkElements flag is set, force 'highlight' styleType
        let styleType =
          m.entryRef && m.entryRef.affectMarkElements
            ? "highlight"
            : m.styleType || "text";

        if (styleType === "text") {
          if (this.settings.hideTextColors) continue;
          style = `color: ${m.color} !important; --highlight-color: ${m.color};`;
        } else if (styleType === "highlight") {
          if (this.settings.hideHighlights) continue;
          // Background highlight only
          const bgColor = m.backgroundColor || m.color;
          const params = this.getHighlightParams(m.entryRef);
          const borderStyle = this.generateBorderStyle(
            null,
            bgColor,
            m.entryRef,
          );
          const vPadH = params.vPad;
          const vPadCssH =
            vPadH >= 0
              ? `padding-top: ${vPadH}px !important; padding-bottom: ${vPadH}px !important;`
              : `padding-top: 0px !important; padding-bottom: 0px !important; margin-top: ${vPadH}px !important; margin-bottom: ${vPadH}px !important;`;
          style = `background: none; background-color: ${this.hexToRgba(bgColor, params.opacity)} !important; border-radius: ${params.hPad > 0 && params.radius === 0 ? 0 : params.radius}px !important; padding-left: ${params.hPad}px !important; padding-right: ${params.hPad}px !important; ${vPadCssH}${(this.settings.enableBoxDecorationBreak ?? true) ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
        } else if (styleType === "both") {
          // Both text and background color
          const textColor =
            m.textColor && m.textColor !== "currentColor"
              ? m.textColor
              : m.color || null;
          const bgColor = m.backgroundColor || m.color;
          const hideText = this.settings.hideTextColors === true;
          const hideBg = this.settings.hideHighlights === true;
          if (hideText && hideBg) continue;
          const params = this.getHighlightParams(m.entryRef);
          const borderStyle = this.generateBorderStyle(
            hideText ? null : textColor,
            hideBg ? null : bgColor,
            m.entryRef,
          );
          const textPart = hideText
            ? ""
            : textColor
              ? `color: ${textColor} !important; --highlight-color: ${textColor}; `
              : "";
          const vPadB = params.vPad;
          const vPadCssB =
            vPadB >= 0
              ? `padding-top: ${vPadB}px !important; padding-bottom: ${vPadB}px !important;`
              : `padding-top: 0px !important; padding-bottom: 0px !important; margin-top: ${vPadB}px !important; margin-bottom: ${vPadB}px !important;`;
          const bgPart = hideBg
            ? ""
            : `background-color: ${this.hexToRgba(bgColor, params.opacity)} !important; border-radius: ${params.radius}px !important; padding-left: ${params.hPad}px !important; padding-right: ${params.hPad}px !important; ${vPadCssB}${(this.settings.enableBoxDecorationBreak ?? true) ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
          style = `${textPart}${bgPart}${borderStyle}`;
        } else {
          // Default to text color
          if (this.settings.hideTextColors) continue;
          style = `color: ${m.color} !important; --highlight-color: ${m.color};`;
        }
      }
      const isDark =
        (m.color || m.textColor || m.backgroundColor) &&
        this.isDarkColor(m.color || m.textColor || m.backgroundColor);
      const baseClass =
        m.entryRef && m.entryRef.affectMarkElements
          ? "always-color-text-highlight always-color-text-highlight-marks"
          : "always-color-text-highlight";

      const deco = Decoration.mark({
        attributes: {
          style,
          class: isDark ? `${baseClass} act-dark-color` : baseClass,
          title:
            this.settings.showColoringReasonOnHover && m.entry
              ? this.getColoringReasonTooltip(m)
              : "",
        },
      });
      builder.add(m.start, m.end, deco);

      // DEBUG: Log decoration applications for @username and timepm patterns
      try {
        if (m.start >= 0 && m.end > m.start) {
          const matchText = "";
          if (matchText.includes("@") || matchText.includes(":")) {
            debugLog(
              "DECO_APPLY",
              `Applied deco at ${m.start}-${m.end}, style=${styleType}`,
            );
          }
        }
      } catch (_) {}
    }

    return builder.finish();
  }

  // NEW METHOD: Chunked editor processing for large pattern sets or large text
  buildDecoChunked(
    view,
    builder,
    from,
    to,
    text,
    entries,
    folderEntry,
    filePath = null,
    syntaxTreeFn = null,
  ) {
    try {
      const nonRomanCount = Array.isArray(entries)
        ? entries.filter(
            (e) =>
              e &&
              e.pattern &&
              this.containsNonRomanCharacters &&
              this.containsNonRomanCharacters(String(e.pattern)),
          ).length
        : 0;
      debugLog(
        "CJK",
        `LP buildDecoChunked: entries=${entries?.length || 0}, nonRomanEntries=${nonRomanCount}, textLen=${String(text || "").length}`,
      );
    } catch (_) {}
    const startTime = performance.now();
    const TIME_BUDGET_MS = 12; // 12ms budget for 60fps (16ms frame)

    // Resolve syntax tree function if passed
    const tree =
      syntaxTreeFn && view && view.state ? syntaxTreeFn(view.state) : null;

    // EXPERT FIX: Get active line ranges to restrict Word Completion Coloring
    // This ensures that "wait for space" logic only applies to lines currently being edited
    const activeLineRanges = [];
    if (view && view.state && view.state.selection) {
      const ranges = view.state.selection.ranges;
      for (const range of ranges) {
        const line = view.state.doc.lineAt(range.head);
        activeLineRanges.push({ start: line.from, end: line.to });
      }
    }

    const CHUNK_SIZE = EDITOR_PERFORMANCE_CONSTANTS.PATTERN_CHUNK_SIZE;
    const TEXT_CHUNK_SIZE = EDITOR_PERFORMANCE_CONSTANTS.TEXT_CHUNK_SIZE;
    // Increase limit for extreme lightweight mode to prevent dropped matches
    const MAX_MATCHES = this._isTyping
      ? 500
      : this.settings.extremeLightweightMode
        ? EDITOR_PERFORMANCE_CONSTANTS.LIGHTWEIGHT_MAX_TOTAL_MATCHES
        : EDITOR_PERFORMANCE_CONSTANTS.MAX_TOTAL_MATCHES;
    let allMatches = [];

    // Handle codeblocks first (same as in buildDecoStandard)
    try {
      // Use the filtered entries (already filtered by filterEntriesByAdvancedRules), not the unfiltered wordEntries
      const we = entries;
      const blEntries = Array.isArray(this.settings.blacklistEntries)
        ? this.settings.blacklistEntries
        : [];
      const codeblockEntry = we.find(
        (e) => e && e.presetLabel === "Codeblocks",
      );
      const hasCodeblockBlacklist = !!blEntries.find(
        (e) => e && e.presetLabel === "Codeblocks" && !!e.isRegex,
      );

      if (hasCodeblockBlacklist) {
        // Skip all content inside codeblocks
        for (const cbMatch of text.matchAll(/```[\s\S]*?```/g)) {
          const start = from + cbMatch.index;
          const end = from + cbMatch.index + cbMatch[0].length;
          allMatches.push({ start, end, skip: true });
        }
      }

      // Skip content inside inline spoilers (||...||)
      try {
        for (const spoilerMatch of text.matchAll(/\|\|[\s\S]*?\|\|/g)) {
          const start = from + spoilerMatch.index;
          const end = from + spoilerMatch.index + spoilerMatch[0].length;
          allMatches.push({ start, end, skip: true });
        }
      } catch (e) {}

      if (codeblockEntry && !hasCodeblockBlacklist) {
        // Color all content inside codeblocks
        for (const cbMatch of text.matchAll(/```[\s\S]*?```/g)) {
          const start = from + cbMatch.index;
          const end = from + cbMatch.index + cbMatch[0].length;
          if (codeblockEntry.backgroundColor) {
            const tc = codeblockEntry.textColor || "currentColor";
            const bc = codeblockEntry.backgroundColor;
            allMatches.push({
              start,
              end,
              textColor: tc,
              backgroundColor: bc,
              isTextBg: true,
              entryRef: codeblockEntry,
            });
          } else {
            const c = codeblockEntry.color || codeblockEntry.textColor;
            if (c)
              allMatches.push({
                start,
                end,
                color: c,
                entryRef: codeblockEntry,
              });
          }
        }
      }
    } catch (e) {}

    let headingRanges = [];
    let hasHeadingBlacklist = false;

    // OPTIMIZATION: Use Regex for heading detection (fast)
    // Removed skip-while-typing to prevent flickering
    try {
      const we = entries;
      const headingRegex = /^(#{1,6})\s+(.*)$/gm;
      let match;

      while ((match = headingRegex.exec(text)) !== null) {
        const lineStart = match.index;
        const lineEnd = match.index + match[0].length;

        headingRanges.push({ start: from + lineStart, end: from + lineEnd });

        const hashes = match[1].length;
        const entryToUse = getEntryForHeadingLevel(we, hashes);

        if (entryToUse) {
          const start = from + lineStart;
          const end = from + lineEnd;

          if (entryToUse.backgroundColor) {
            const tc = entryToUse.textColor || "currentColor";
            const bc = entryToUse.backgroundColor;
            allMatches.push({
              start,
              end,
              textColor: tc,
              backgroundColor: bc,
              isTextBg: true,
              entryRef: entryToUse,
            });
          } else {
            const c = entryToUse.color || entryToUse.textColor;
            if (c)
              allMatches.push({ start, end, color: c, entryRef: entryToUse });
          }
        }
      }
    } catch (e) {}

    // PROCESS MARKDOWN FORMATTING: Bullet Points, Numbered Lists, Tasks
    try {
      // Use the filtered entries (already filtered by filterEntriesByAdvancedRules), not unfiltered wordEntries
      const we = entries;
      const blEntries = Array.isArray(this.settings.blacklistEntries)
        ? this.settings.blacklistEntries
        : [];

      const taskCheckedEntry = we.find(
        (e) => e && e.presetLabel === "Task List (Checked)",
      );
      const taskUncheckedEntry = we.find(
        (e) => e && e.presetLabel === "Task List (Unchecked)",
      );
      const numberedEntry = we.find(
        (e) => e && e.presetLabel === "Numbered Lists",
      );
      const bulletEntry = we.find(
        (e) => e && e.presetLabel === "Bullet Points",
      );

      const taskCheckedBlacklisted = !!blEntries.find(
        (e) => e && e.presetLabel === "Task List (Checked)" && !!e.isRegex,
      );
      const taskUncheckedBlacklisted = !!blEntries.find(
        (e) => e && e.presetLabel === "Task List (Unchecked)" && !!e.isRegex,
      );
      const numberedBlacklisted = !!blEntries.find(
        (e) => e && e.presetLabel === "Numbered Lists" && !!e.isRegex,
      );
      const bulletBlacklisted = !!blEntries.find(
        (e) => e && e.presetLabel === "Bullet Points" && !!e.isRegex,
      );

      // PERF FIX: Entries are already filtered by filterEntriesByAdvancedRules before reaching here.
      // These shouldColorText calls are redundant and add O(entries) work per rebuild.
      const taskCheckedAllowed = true;
      const taskUncheckedAllowed = true;
      const numberedAllowed = true;
      const bulletAllowed = true;

      // Process each line and check patterns in priority order
      let pos = 0;
      while (pos <= text.length) {
        const lineStart = pos;
        const nextNL = text.indexOf("\n", pos);
        const lineEnd = nextNL === -1 ? text.length : nextNL;
        const line = text.substring(lineStart, lineEnd);

        // Check in priority order: most specific first
        let matched = false;

        // Task checked
        if (
          !matched &&
          !taskCheckedBlacklisted &&
          taskCheckedEntry &&
          taskCheckedAllowed
        ) {
          const pattern = /^(\s*)([\-\*])(\s+)(\[[xX]\])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart =
              lineStart +
              mdMatch.index +
              (mdMatch[1].length +
                mdMatch[2].length +
                mdMatch[3].length +
                mdMatch[4].length +
                mdMatch[5].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[6] || "";
            // Check both content blacklist AND line-level regex blacklist
            const lineBlacklisted = this.isLineBlacklistedByRegex(
              line,
              filePath,
            );
            if (
              contentStart < contentEnd &&
              !this.containsBlacklistedWord(contentText, filePath) &&
              !lineBlacklisted
            ) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (taskCheckedEntry.backgroundColor) {
                const tc = taskCheckedEntry.textColor || "currentColor";
                const bc = taskCheckedEntry.backgroundColor;
                allMatches.push({
                  start,
                  end,
                  textColor: tc,
                  backgroundColor: bc,
                  isTextBg: true,
                  entryRef: taskCheckedEntry,
                });
              } else {
                const c = taskCheckedEntry.color || taskCheckedEntry.textColor;
                if (c)
                  allMatches.push({
                    start,
                    end,
                    color: c,
                    entryRef: taskCheckedEntry,
                  });
              }
              matched = true;
            }
          }
        }

        // Task unchecked
        if (!matched && !taskUncheckedBlacklisted && taskUncheckedEntry) {
          const pattern = /^(\s*)([\-\*])(\s+)(\[\s\])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart =
              lineStart +
              mdMatch.index +
              (mdMatch[1].length +
                mdMatch[2].length +
                mdMatch[3].length +
                mdMatch[4].length +
                mdMatch[5].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[6] || "";
            // Check both content blacklist AND line-level regex blacklist
            const lineBlacklisted = this.isLineBlacklistedByRegex(
              line,
              filePath,
            );
            if (
              contentStart < contentEnd &&
              !this.containsBlacklistedWord(contentText, filePath) &&
              !lineBlacklisted
            ) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (taskUncheckedEntry.backgroundColor) {
                const tc = taskUncheckedEntry.textColor || "currentColor";
                const bc = taskUncheckedEntry.backgroundColor;
                allMatches.push({
                  start,
                  end,
                  textColor: tc,
                  backgroundColor: bc,
                  isTextBg: true,
                  entryRef: taskUncheckedEntry,
                });
              } else {
                const c =
                  taskUncheckedEntry.color || taskUncheckedEntry.textColor;
                if (c)
                  allMatches.push({
                    start,
                    end,
                    color: c,
                    entryRef: taskUncheckedEntry,
                  });
              }
              matched = true;
            }
          }
        }

        // Numbered lists
        if (
          !matched &&
          !numberedBlacklisted &&
          numberedEntry &&
          numberedAllowed
        ) {
          const pattern = /^(\s*)(\d+\.)(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart =
              lineStart +
              mdMatch.index +
              (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[4] || "";
            // Check both content blacklist AND line-level regex blacklist
            const lineBlacklisted = this.isLineBlacklistedByRegex(
              line,
              filePath,
            );
            if (
              contentStart < contentEnd &&
              !this.containsBlacklistedWord(contentText, filePath) &&
              !lineBlacklisted
            ) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (numberedEntry.backgroundColor) {
                const tc = numberedEntry.textColor || "currentColor";
                const bc = numberedEntry.backgroundColor;
                allMatches.push({
                  start,
                  end,
                  textColor: tc,
                  backgroundColor: bc,
                  isTextBg: true,
                  entryRef: numberedEntry,
                });
              } else {
                const c = numberedEntry.color || numberedEntry.textColor;
                if (c)
                  allMatches.push({
                    start,
                    end,
                    color: c,
                    entryRef: numberedEntry,
                  });
              }
              matched = true;
            }
          }
        }

        // Bullet points
        if (!matched && !bulletBlacklisted && bulletEntry && bulletAllowed) {
          const pattern = /^(\s*)([\-\*])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart =
              lineStart +
              mdMatch.index +
              (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[4] || "";
            // Check both content blacklist AND line-level regex blacklist
            const lineBlacklisted = this.isLineBlacklistedByRegex(
              line,
              filePath,
            );
            if (
              contentStart < contentEnd &&
              !this.containsBlacklistedWord(contentText, filePath) &&
              !lineBlacklisted
            ) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (bulletEntry.backgroundColor) {
                const tc = bulletEntry.textColor || "currentColor";
                const bc = bulletEntry.backgroundColor;
                allMatches.push({
                  start,
                  end,
                  textColor: tc,
                  backgroundColor: bc,
                  isTextBg: true,
                  entryRef: bulletEntry,
                });
              } else {
                const c = bulletEntry.color || bulletEntry.textColor;
                if (c)
                  allMatches.push({
                    start,
                    end,
                    color: c,
                    entryRef: bulletEntry,
                  });
              }
              matched = true;
            }
          }
        }

        if (nextNL === -1) break;
        pos = nextNL + 1;
      }
    } catch (e) {}

    // Get all blacklisted list item ranges (so we can exclude individual word matches from being colored)
    const blacklistedListRanges = this.getBlacklistedListItemRanges(
      text,
      from,
      filePath,
    );

    // PERF FIX: Build blacklist word set once per rebuild for O(1) per-match lookup
    const blacklistWordSet = this.buildBlacklistWordSet(filePath);

    // FIRST: Process text+bg entries (they have priority)
    // Filter text+bg entries by file rules just like regular entries
    let textBgEntries = Array.isArray(this._compiledTextBgEntries)
      ? this._compiledTextBgEntries
      : [];
    if (filePath) {
      textBgEntries = textBgEntries.filter((entry) => {
        if (!entry || !entry.pattern) return true;
        return this.shouldColorText(filePath, entry.pattern, entry);
      });
    }
    if (textBgEntries.length > 0) {
      for (const entry of textBgEntries) {
        if (!entry || entry.invalid) continue;

        if (entry.fastTest && !entry.fastTest(text)) {
          if (entry.presetLabel && entry.presetLabel.includes("Time")) {
            debugLog("TBG_FASTTEST_SKIP", `Skipped '${entry.presetLabel}' for text snippet: "${text.substring(0, 30)}"`);
          }
          continue;
        }

        const regex = entry.regex;
        if (!regex) continue;

        let match;
        try {
          regex.lastIndex = 0;
        } catch (e) {}

        if (entry.presetLabel && entry.presetLabel.includes("Time")) {
          debugLog("TBG_REGEX_CHECK", `Entry: ${entry.presetLabel}, pattern: ${entry.pattern}, text length: ${text.length}`);
        }

        while ((match = regex.exec(text))) {
          if (entry.presetLabel && entry.presetLabel.includes("Time")) {
            debugLog("TBG_MATCH_FOUND", `Found match: "${match[0]}" at ${match.index}`);
          }
          const matchStart = match.index;
          const matchEnd = match.index + match[0].length;

          // EXPERT FIX: Word Completion Coloring - Only trigger after space/newline
          if (this.settings.enableWordCompletionColoring) {
            const nextChar = text[matchEnd];
            if (!nextChar || !/[\s]/.test(nextChar)) continue;
          }

          if (!this.matchSatisfiesType(text, matchStart, matchEnd, entry)) {
            try {
              if (
                typeof regex.lastIndex === "number" &&
                regex.lastIndex === match.index
              )
                regex.lastIndex++;
            } catch (e) {}
            continue;
          }

          if (this.isContextBlacklisted(text, matchStart, matchEnd, filePath))
            continue;

          const absStart = from + matchStart;
          const absEnd = from + matchEnd;

          // Skip if in blacklisted list item range
          if (
            this.isMatchInBlacklistedRange(
              absStart,
              absEnd,
              blacklistedListRanges,
            )
          ) {
            try {
              if (
                typeof regex.lastIndex === "number" &&
                regex.lastIndex === match.index
              )
                regex.lastIndex++;
            } catch (e) {}
            continue;
          }

          if (
            hasHeadingBlacklist &&
            headingRanges &&
            headingRanges.length > 0
          ) {
            let inHeading = false;
            for (const hr of headingRanges) {
              if (absStart < hr.end && absEnd > hr.start) {
                inHeading = true;
                break;
              }
            }
            if (inHeading) continue;
          }

          // For 'contains' matchType, color the ENTIRE full word, not just the matched part
          let colorStart = matchStart;
          let colorEnd = matchEnd;

          {
            const mt = String(entry.matchType || "").toLowerCase();
            if (
              (mt === "contains" || mt === "startswith" || mt === "endswith") &&
              !this.isSentenceLikePattern(entry.pattern)
            ) {
              const nonRoman =
                this.containsNonRomanCharacters &&
                this.containsNonRomanCharacters(entry.pattern);
              colorStart = matchStart;
              colorEnd = matchEnd;
              if (nonRoman) {
                while (
                  colorStart > 0 &&
                  this.isCJKChar(text[colorStart - 1])
                )
                  colorStart--;
                while (
                  colorEnd < text.length &&
                  this.isCJKChar(text[colorEnd])
                )
                  colorEnd++;
              } else {
                while (
                  colorStart > 0 &&
                  (/[A-Za-z0-9]/.test(text[colorStart - 1]) ||
                    text[colorStart - 1] === "-" ||
                    text[colorStart - 1] === "'")
                )
                  colorStart--;
                while (
                  colorEnd < text.length &&
                  (/[A-Za-z0-9]/.test(text[colorEnd]) ||
                    text[colorEnd] === "-" ||
                    text[colorEnd] === "'")
                )
                  colorEnd++;
              }
            }
          }

          allMatches.push({
            start: from + colorStart,
            end: from + colorEnd,
            textColor: entry.textColor,
            backgroundColor: entry.backgroundColor,
            isTextBg: true,
            entryRef: entry,
            customCss: entry.customCss, // Add customCss to match object
          });

          if (allMatches.length > MAX_MATCHES) break;
        }

        if (allMatches.length > MAX_MATCHES) break;
      }
    }

    // PROCESS ELEMENT TARGETING (Bold, Italic, etc.) via Syntax Tree - REMOVED to prevent double spans (handled by CSS)
    // if (syntaxTree && view && view.state) { ... }

    // SECOND: Process regular patterns, avoiding text+bg matches
    // Filter out entries that have targetElement (they are handled by syntax tree)
    // AND filter out entries that look like Bold/Italic presets (to prevent double spans)
    const regexEntries = entries.filter((e) => {
      if (e.targetElement) return false;

      // Safety check: Filter out obvious Bold/Italic presets even if targetElement is missing
      if (e.presetLabel) {
        const label = String(e.presetLabel).toLowerCase();
        if (label.includes("bold") || label.includes("italic")) return false;
      }

      // Also check standard regex patterns as a fallback
      if (e.pattern === "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1") return false;
      if (e.pattern === "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1") return false;
      if (e.pattern === "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1") return false;

      return true;
    });

    // Strategy 1: If too many patterns, process patterns in chunks
    if (regexEntries.length > CHUNK_SIZE) {
      debugLog(
        "PATTERN_PROCESSING",
        `Starting pattern processing for ${regexEntries.length} patterns`,
      );
      // Editor chunking logs removed - too verbose

      for (let i = 0; i < regexEntries.length; i += CHUNK_SIZE) {
        const chunk = regexEntries.slice(i, i + CHUNK_SIZE);
        const chunkMatches = this.processPatternChunk(
          text,
          from,
          chunk,
          folderEntry,
          allMatches,
          hasHeadingBlacklist ? headingRanges : [],
          blacklistedListRanges,
          filePath,
          activeLineRanges,
          blacklistWordSet,
        );
        allMatches = allMatches.concat(chunkMatches);

        // Chunk processing logs removed - too verbose

        // Hard limit to prevent excessive decorations
        if (allMatches.length > MAX_MATCHES) {
          // Match limit reached - stopped early
          break;
        }
      }
    }
    // Strategy 2: If text is very long, process text in chunks
    else if (text.length > TEXT_CHUNK_SIZE) {
      debugLog(
        "EDITOR",
        `Processing long text (${text.length} chars) in chunks (chunk size: ${TEXT_CHUNK_SIZE})`,
      );

      let chunkNum = 0;
      const totalChunks = Math.ceil(text.length / TEXT_CHUNK_SIZE);
      for (let pos = 0; pos < text.length; pos += TEXT_CHUNK_SIZE) {
        chunkNum++;
        const chunkEnd = Math.min(pos + TEXT_CHUNK_SIZE, text.length);
        const chunkText = text.slice(pos, chunkEnd);
        const chunkFrom = from + pos;

        const chunkMatches = this.processTextChunk(
          chunkText,
          chunkFrom,
          regexEntries,
          folderEntry,
          allMatches,
          hasHeadingBlacklist ? headingRanges : [],
          blacklistedListRanges,
          filePath,
          activeLineRanges,
          blacklistWordSet,
        );
        allMatches = allMatches.concat(chunkMatches);

        // Text chunk processing logs removed - too verbose

        if (allMatches.length > MAX_MATCHES) {
          // Match limit reached during text chunk processing
          break;
        }
      }
    } else {
      // Strategy 3: Default processing (few patterns, short text)
      const chunkMatches = this.processPatternChunk(
        text,
        from,
        regexEntries,
        folderEntry,
        allMatches,
        hasHeadingBlacklist ? headingRanges : [],
        blacklistedListRanges,
        filePath,
        activeLineRanges,
        blacklistWordSet,
      );
      allMatches = allMatches.concat(chunkMatches);
    }

    // Pattern processing completed

    // Apply decorations from collected matches
    return this.applyDecorationsFromMatches(
      builder,
      allMatches,
      folderEntry,
      tree,
    );
  }

  // NEW METHOD: Process a chunk of patterns
  processPatternChunk(
    text,
    baseFrom,
    patternChunk,
    folderEntry,
    existingMatches = [],
    headingRanges = [],
    blacklistedListRanges = [],
    filePath = null,
    activeLineRanges = [],
    blacklistWordSet = null,
  ) {
    const MAX_MATCHES_PER_PATTERN = this.settings.extremeLightweightMode
      ? EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN
      : EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN;
    const matches = [];

    for (const entry of patternChunk) {
      if (!entry || entry.invalid) continue;
      try {
        const isCjk =
          entry &&
          entry.pattern &&
          this.containsNonRomanCharacters &&
          this.containsNonRomanCharacters(String(entry.pattern));
        if (isCjk) {
          debugLog(
            "CJK",
            `LP entry: pat="${entry.pattern}", mt="${entry.matchType}", regex=${!!entry.isRegex}, cs=${!!entry.caseSensitive}`,
          );
        }
      } catch (_) {}

      const isPartialEntry =
        !entry.isRegex &&
        ["contains", "startswith", "endswith"].includes(
          String(
            entry.matchType ||
              (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase(),
        ) &&
        !this.isSentenceLikePattern(entry.pattern);
      if (isPartialEntry) {
        try {
          const isCjk =
            entry &&
            entry.pattern &&
            this.containsNonRomanCharacters &&
            this.containsNonRomanCharacters(String(entry.pattern));
          if (isCjk) {
            debugLog("CJK", `LP skip regex pass (partial): "${entry.pattern}"`);
          }
        } catch (_) {}
        continue;
      }

      // Fast pre-check
      if (entry.fastTest && !entry.fastTest(text)) {
        try {
          const isCjk =
            entry &&
            entry.pattern &&
            this.containsNonRomanCharacters &&
            this.containsNonRomanCharacters(String(entry.pattern));
          if (isCjk) {
            debugLog(
              "CJK",
              `LP fastTest=false: pat="${entry.pattern}", textSnippet="${String(text).substring(
                0,
                40,
              )}"`,
            );
          }
        } catch (_) {}
        if (entry.presetLabel && entry.presetLabel.includes("Time")) {
          debugLog("LP_FASTTEST_SKIP", `Skipped '${entry.presetLabel}' for text snippet: "${text.substring(0, 30)}"`);
        }
        continue;
      }

      const regex = entry.regex;
      if (!regex) continue;

      let match;
      let matchCount = 0;

      // CRITICAL FIX: Always reset regex state before processing
      try {
        regex.lastIndex = 0;
      } catch (e) {}

      if (entry.presetLabel && entry.presetLabel.includes("Time")) {
        debugLog("LP_REGEX_CHECK", `Entry: ${entry.presetLabel}, pattern: ${entry.pattern}, text length: ${text.length}`);
      }

      while (
        (match = regex.exec(text)) &&
        matchCount < MAX_MATCHES_PER_PATTERN
      ) {
        try {
          const isCjk =
            entry &&
            entry.pattern &&
            this.containsNonRomanCharacters &&
            this.containsNonRomanCharacters(String(entry.pattern));
          if (isCjk) {
            debugLog(
              "CJK",
              `LP regex hit: "${match[0]}" at ${match.index} for pat="${entry.pattern}"`,
            );
          }
        } catch (_) {}
        if (entry.presetLabel && entry.presetLabel.includes("Time")) {
          debugLog("LP_MATCH_FOUND", `Found match: "${match[0]}" at ${match.index}`);
        }
        const matchedText = match[0];
        const matchStart = baseFrom + match.index;
        const matchEnd = baseFrom + match.index + matchedText.length;

        // EXPERT FIX: Word Completion Coloring - Only trigger after space/newline on ACTIVE lines
        if (this.settings.enableWordCompletionColoring) {
          let isActiveLine = false;
          if (activeLineRanges.length > 0) {
            for (const range of activeLineRanges) {
              if (matchStart >= range.start && matchStart <= range.end) {
                isActiveLine = true;
                break;
              }
            }
          }

          if (isActiveLine) {
            // Find full word end for the check
            let fullWordEnd = match.index + matchedText.length;
            // Expand forward to find the end of the full word
            while (
              fullWordEnd < text.length &&
              (/[A-Za-z0-9]/.test(text[fullWordEnd]) ||
                text[fullWordEnd] === "-" ||
                text[fullWordEnd] === "'")
            ) {
              fullWordEnd++;
            }

            const nextChar = text[fullWordEnd];
            if (!nextChar || !/[\s]/.test(nextChar)) continue;
          }
        }

        // Skip if in blacklisted list item range
        if (
          this.isMatchInBlacklistedRange(
            matchStart,
            matchEnd,
            blacklistedListRanges,
          )
        ) {
          continue;
        }

        const overlappingTextBgIndices = [];
        for (let i = 0; i < existingMatches.length; i++) {
          const existing = existingMatches[i];
          if (!existing || !existing.isTextBg) continue;
          if (matchStart < existing.end && matchEnd > existing.start) {
            overlappingTextBgIndices.push(i);
          }
        }
        if (overlappingTextBgIndices.length > 0) {
          const mLength = matchEnd - matchStart;
          const allShorter = overlappingTextBgIndices.every(
            (i) => existingMatches[i].end - existingMatches[i].start < mLength,
          );
          if (!allShorter) {
            continue;
          }
          for (let i = overlappingTextBgIndices.length - 1; i >= 0; i--) {
            existingMatches.splice(overlappingTextBgIndices[i], 1);
          }
        }

        // OPTIMIZATION: Simple early exit for heading range check
        // With 220+ headers, checking all headers per match was O(n²)
        // Early exits skip headers that can't possibly overlap
        if (headingRanges && headingRanges.length > 0) {
          let inHeading = false;
          for (const hr of headingRanges) {
            if (matchEnd <= hr.start) continue;
            if (matchStart >= hr.end) continue;
            if (matchStart < hr.end && matchEnd > hr.start) {
              inHeading = true;
              break;
            }
          }
          if (inHeading) continue;
        }

        // ALWAYS check for whole-word matches (the main loop only accepts exact pattern matches at word boundaries)
        // The partialMatch flag is handled by a SEPARATE pass after this loop
        {
          const mt = String(
            entry.matchType ||
              (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase();
          if (
            mt === "exact" &&
            !this.isWholeWordMatch(
              text,
              match.index,
              match.index + matchedText.length,
            )
          ) {
            try {
              const isCjk =
                entry &&
                entry.pattern &&
                this.containsNonRomanCharacters &&
                this.containsNonRomanCharacters(String(entry.pattern));
              if (isCjk) {
                debugLog(
                  "CJK",
                  `LP wholeWord rejected: "${matchedText}" for pat="${entry.pattern}"`,
                );
              }
            } catch (_) {}
            continue;
          }
        }

        // Context-aware blacklist check
        // PERF FIX: Use pre-built word set for O(1) lookup; fall back to full check only when set unavailable
        if (blacklistWordSet && blacklistWordSet.size > 0) {
          const fullWord = this.extractFullWord(text, match.index, match.index + matchedText.length);
          if (blacklistWordSet.has(fullWord.toLowerCase())) continue;
        } else if (this.isContextBlacklisted(text, match.index, match.index + matchedText.length, filePath)) {
          continue;
        }

        matches.push({
          start: matchStart,
          end: matchEnd,
          color:
            folderEntry && folderEntry.defaultColor
              ? folderEntry.defaultColor
              : entry.textColor && entry.textColor !== "currentColor"
                ? entry.textColor
                : entry.color,
          styleType: entry.styleType,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor,
          entryRef: entry,
          customCss: entry.customCss, // Add customCss
        });

        matchCount++;
        if (matches.length > 2000) break;
      }

      if (matches.length > 2000) break;
    }

    const partialEntries = patternChunk.filter(
      (e) =>
        e &&
        !e.invalid &&
        !e.isRegex &&
        ["contains", "startswith", "endswith"].includes(
          String(
            e.matchType || (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase(),
        ) &&
        !this.isSentenceLikePattern(e.pattern),
    );
    const wordPartialEntries = partialEntries.filter((e) =>
      this.isLatinWordPattern(e.pattern),
    );
    const phrasePartialEntries = partialEntries.filter(
      (e) => !this.isLatinWordPattern(e.pattern),
    );

    if (partialEntries.length > 0 && matches.length < 2000) {
      for (const entry of wordPartialEntries) {
        const mt = String(
          entry.matchType ||
            (this.settings.partialMatch ? "contains" : "exact"),
        ).toLowerCase();
        if (mt === "startswith" || mt === "endswith") {
          const cs =
            typeof entry._caseSensitiveOverride === "boolean"
              ? entry._caseSensitiveOverride
              : typeof entry.caseSensitive === "boolean"
                ? entry.caseSensitive
                : this.settings.caseSensitive;
          if (
            (mt === "startswith" &&
              (!entry._startswithRegex || entry._lastCs !== cs)) ||
            (mt === "endswith" &&
              (!entry._endswithRegex || entry._lastCs !== cs))
          ) {
            const pat = cs
              ? String(entry.pattern || "")
              : String(entry.pattern || "").toLowerCase();
            const flags = cs ? "" : "i";
            const esc = this.escapeRegex(pat);
            try {
              if (mt === "startswith")
                entry._startswithRegex = new RegExp(
                  `^${esc}[A-Za-z0-9'\\-]*$`,
                  flags,
                );
              else
                entry._endswithRegex = new RegExp(
                  `^[A-Za-z0-9'\\-]*${esc}$`,
                  flags,
                );
              entry._lastCs = cs;
            } catch (_) {}
          }
        }
      }

      const wordRegex = /[A-Za-z0-9'\-]+/g;
      let match;
      while ((match = wordRegex.exec(text))) {
        const w = match[0];
        const wStart = match.index;
        const wEnd = wStart + w.length;

        // EXPERT FIX: Word Completion Coloring - Only trigger after space/newline on ACTIVE lines
        if (this.settings.enableWordCompletionColoring) {
          let isActiveLine = false;
          const absStart = baseFrom + wStart;
          if (activeLineRanges.length > 0) {
            for (const range of activeLineRanges) {
              if (absStart >= range.start && absStart <= range.end) {
                isActiveLine = true;
                break;
              }
            }
          }

          if (isActiveLine) {
            const nextChar = text[wEnd];
            if (!nextChar || !/[\s]/.test(nextChar)) continue;
          }
        }

        if (
          this.isMatchInBlacklistedRange(
            baseFrom + wStart,
            baseFrom + wEnd,
            blacklistedListRanges,
          )
        )
          continue;

        for (const entry of wordPartialEntries) {
          if (/^[\s~`!@#$%^&*()\-\_=+\[\]{};:'",.<>\/?\\|]+$/.test(entry.pattern))
            continue;
          // PERF FIX: Use pre-built set for O(1) lookup
          if (blacklistWordSet && blacklistWordSet.has(entry.pattern.toLowerCase())) continue;
          else if (!blacklistWordSet && this.isWordBlacklisted(entry.pattern, filePath)) continue;

          const mt = String(
            entry.matchType ||
              (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase();
          const cs =
            typeof entry._caseSensitiveOverride === "boolean"
              ? entry._caseSensitiveOverride
              : typeof entry.caseSensitive === "boolean"
                ? entry.caseSensitive
                : this.settings.caseSensitive;
          const word = cs ? w : w.toLowerCase();
          const pat = cs
            ? String(entry.pattern || "")
            : String(entry.pattern || "").toLowerCase();
          let ok = false;
          if (mt === "contains") {
            ok = word.includes(pat);
          } else if (mt === "startswith") {
            if (entry._startswithRegex) ok = entry._startswithRegex.test(word);
            else ok = word.startsWith(pat);
          } else if (mt === "endswith") {
            if (entry._endswithRegex) ok = entry._endswithRegex.test(word);
            else ok = word.endsWith(pat);
          }
          if (ok) {
            let expandedWStart = wStart;
            let expandedWEnd = wEnd;

            if (!this.isSentenceLikePattern(entry.pattern)) {
              const nonRoman =
                this.containsNonRomanCharacters &&
                this.containsNonRomanCharacters(entry.pattern);
              if (nonRoman) {
                while (
                  expandedWStart > 0 &&
                  this.isCJKChar(text[expandedWStart - 1])
                )
                  expandedWStart--;
                while (
                  expandedWEnd < text.length &&
                  this.isCJKChar(text[expandedWEnd])
                )
                  expandedWEnd++;
              } else {
                while (
                  expandedWStart > 0 &&
                  (/[A-Za-z0-9]/.test(text[expandedWStart - 1]) ||
                    text[expandedWStart - 1] === "-" ||
                    text[expandedWStart - 1] === "'")
                )
                  expandedWStart--;
                while (
                  expandedWEnd < text.length &&
                  (/[A-Za-z0-9]/.test(text[expandedWEnd]) ||
                    text[expandedWEnd] === "-" ||
                    text[expandedWEnd] === "'")
                )
                  expandedWEnd++;
              }
            }

            let overlapsWithExisting = false;
            for (const existingMatch of matches) {
              if (
                baseFrom + expandedWStart < existingMatch.end &&
                baseFrom + expandedWEnd > existingMatch.start
              ) {
                overlapsWithExisting = true;
                break;
              }
            }
            for (const textBgMatch of existingMatches) {
              if (
                textBgMatch.isTextBg &&
                baseFrom + expandedWStart < textBgMatch.end &&
                baseFrom + expandedWEnd > textBgMatch.start
              ) {
                overlapsWithExisting = true;
                break;
              }
            }

            if (!overlapsWithExisting) {
              matches.push({
                start: baseFrom + expandedWStart,
                end: baseFrom + expandedWEnd,
                color:
                  folderEntry && folderEntry.defaultColor
                    ? folderEntry.defaultColor
                    : entry.textColor && entry.textColor !== "currentColor"
                      ? entry.textColor
                      : entry.color,
                styleType: entry.styleType,
                textColor: entry.textColor,
                backgroundColor: entry.backgroundColor,
                entryRef: entry,
              });
              if (matches.length > 2000) break;
            }
            break;
          }
        }

        if (matches.length > 2000) break;
        try {
          if (
            typeof wordRegex.lastIndex === "number" &&
            wordRegex.lastIndex === match.index
          )
            wordRegex.lastIndex++;
        } catch (e) {}
      }

      if (phrasePartialEntries.length > 0 && matches.length < 2000) {
        let textLower = null;
        const getTextForCase = (cs) => {
          if (cs) return text;
          if (!textLower) textLower = text.toLowerCase();
          return textLower;
        };

        for (const entry of phrasePartialEntries) {
          if (/^[\s~`!@#$%^&*()\-\_=+\[\]{};:'",.<>\/?\\|]+$/.test(entry.pattern))
            continue;
          // PERF FIX: Use pre-built set for O(1) lookup
          if (blacklistWordSet && blacklistWordSet.has(entry.pattern.toLowerCase())) continue;
          else if (!blacklistWordSet && this.isWordBlacklisted(entry.pattern, filePath)) continue;

          const mt = String(
            entry.matchType ||
              (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase();
          const cs =
            typeof entry._caseSensitiveOverride === "boolean"
              ? entry._caseSensitiveOverride
              : typeof entry.caseSensitive === "boolean"
                ? entry.caseSensitive
                : this.settings.caseSensitive;

          const textForSearch = getTextForCase(cs);
          const rawPattern = String(entry.pattern || "");
          const pat = cs ? rawPattern : rawPattern.toLowerCase();
          if (!pat) continue;

          let fromIndex = 0;
          let localMatchCount = 0;

          while (
            matches.length < 2000 &&
            localMatchCount < MAX_MATCHES_PER_PATTERN
          ) {
            const idx = textForSearch.indexOf(pat, fromIndex);
            if (idx === -1) break;

            const mStart = idx;
            const mEnd = idx + pat.length;

            let ok = false;
            if (mt === "contains") {
              ok = true;
            } else if (mt === "startswith") {
              const leftChar = mStart > 0 ? text[mStart - 1] : "";
              const isWordChar = (ch) =>
                /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
              ok = mStart === 0 || !isWordChar(leftChar);
              try {
                const isCjk =
                  entry &&
                  entry.pattern &&
                  this.containsNonRomanCharacters &&
                  this.containsNonRomanCharacters(String(entry.pattern));
                if (isCjk && !ok) {
                  debugLog(
                    "CJK",
                    `LP startswith boundary reject at ${mStart} for pat="${entry.pattern}", leftChar="${leftChar}"`,
                  );
                }
              } catch (_) {}
            } else if (mt === "endswith") {
              const rightChar = mEnd < text.length ? text[mEnd] : "";
              const isWordChar = (ch) =>
                /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
              ok = mEnd === text.length || !isWordChar(rightChar);
              try {
                const isCjk =
                  entry &&
                  entry.pattern &&
                  this.containsNonRomanCharacters &&
                  this.containsNonRomanCharacters(String(entry.pattern));
                if (isCjk && !ok) {
                  debugLog(
                    "CJK",
                    `LP endswith boundary reject at ${mEnd} for pat="${entry.pattern}", rightChar="${rightChar}"`,
                  );
                }
              } catch (_) {}
            }

            if (ok) {
              const absStart = baseFrom + mStart;
              const absEnd = baseFrom + mEnd;

              if (
                this.isMatchInBlacklistedRange(
                  absStart,
                  absEnd,
                  blacklistedListRanges,
                )
              ) {
                fromIndex = mStart + 1;
                continue;
              }

              let expandedStart = mStart;
              let expandedEnd = mEnd;

              while (
                expandedStart > 0 &&
                (/[A-Za-z0-9]/.test(text[expandedStart - 1]) ||
                  text[expandedStart - 1] === "-" ||
                  text[expandedStart - 1] === "'")
              ) {
                expandedStart--;
              }
              while (
                expandedEnd < text.length &&
                (/[A-Za-z0-9]/.test(text[expandedEnd]) ||
                  text[expandedEnd] === "-" ||
                  text[expandedEnd] === "'")
              ) {
                expandedEnd++;
              }

              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                if (
                  baseFrom + expandedStart < existingMatch.end &&
                  baseFrom + expandedEnd > existingMatch.start
                ) {
                  overlapsWithExisting = true;
                  break;
                }
              }
              for (const textBgMatch of existingMatches) {
                if (
                  textBgMatch.isTextBg &&
                  baseFrom + expandedStart < textBgMatch.end &&
                  baseFrom + expandedEnd > textBgMatch.start
                ) {
                  overlapsWithExisting = true;
                  break;
                }
              }

              if (!overlapsWithExisting) {
                matches.push({
                  start: baseFrom + expandedStart,
                  end: baseFrom + expandedEnd,
                  color:
                    folderEntry && folderEntry.defaultColor
                      ? folderEntry.defaultColor
                      : entry.textColor && entry.textColor !== "currentColor"
                        ? entry.textColor
                        : entry.color,
                  styleType: entry.styleType,
                  textColor: entry.textColor,
                  backgroundColor: entry.backgroundColor,
                  entryRef: entry,
                  customCss: entry.customCss, // Add customCss
                });
                if (matches.length > 2000) break;
              }

              localMatchCount++;
            }

            fromIndex = mStart + 1;
          }

          if (matches.length > 2000) break;
        }
      }
    }

    return matches;
  }

  // NEW METHOD: Process a chunk of text
  processTextChunk(
    chunkText,
    chunkFrom,
    entries,
    folderEntry,
    existingMatches = [],
    headingRanges = [],
    blacklistedListRanges = [],
    filePath = null,
    activeLineRanges = [],
    blacklistWordSet = null,
  ) {
    const matches = [];
    const MAX_MATCHES_PER_PATTERN = this.settings.extremeLightweightMode
      ? EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN
      : EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN;

    for (const entry of entries) {
      if (!entry || entry.invalid) continue;

      // Skip entries with partial match types - they're handled in the partial match section below
      // Use same default logic as PatternMatcher to determine actual matchType
      const actualMatchType = String(
        entry.matchType || (this.settings.partialMatch ? "contains" : "exact"),
      ).toLowerCase();
      const isPartialMatch = ["contains", "startswith", "endswith"].includes(
        actualMatchType,
      );
      if (
        !entry.isRegex &&
        isPartialMatch &&
        this.isLatinWordPattern(entry.pattern)
      )
        continue;

      // Fast pre-check on chunk text
      if (entry.fastTest && !entry.fastTest(chunkText)) continue;

      const regex = entry.regex;
      if (!regex) continue;

      let match;
      let matchCount = 0;

      // CRITICAL FIX: Always reset regex state before processing
      try {
        regex.lastIndex = 0;
      } catch (e) {}

      while (
        (match = regex.exec(chunkText)) &&
        matchCount < MAX_MATCHES_PER_PATTERN
      ) {
        const matchedText = match[0];
        const matchStart = chunkFrom + match.index;
        const matchEnd = chunkFrom + match.index + matchedText.length;

        // EXPERT FIX: Word Completion Coloring - Only trigger after space/newline on ACTIVE lines
        if (this.settings.enableWordCompletionColoring) {
          let isActiveLine = false;
          if (activeLineRanges.length > 0) {
            for (const range of activeLineRanges) {
              if (matchStart >= range.start && matchStart <= range.end) {
                isActiveLine = true;
                break;
              }
            }
          }

          if (isActiveLine) {
            // Find full word end
            let fullWordEnd = match.index + matchedText.length;
            while (
              fullWordEnd < chunkText.length &&
              (/[A-Za-z0-9]/.test(chunkText[fullWordEnd]) ||
                chunkText[fullWordEnd] === "-" ||
                chunkText[fullWordEnd] === "'")
            ) {
              fullWordEnd++;
            }
            const nextChar = chunkText[fullWordEnd];
            if (!nextChar || !/[\s]/.test(nextChar)) continue;
          }
        }

        if (
          this.isMatchInBlacklistedRange(
            matchStart,
            matchEnd,
            blacklistedListRanges,
          )
        ) {
          continue;
        }

        const overlappingTextBgIndices2 = [];
        for (let i = 0; i < existingMatches.length; i++) {
          const existing = existingMatches[i];
          if (!existing || !existing.isTextBg) continue;
          if (matchStart < existing.end && matchEnd > existing.start) {
            overlappingTextBgIndices2.push(i);
          }
        }
        if (overlappingTextBgIndices2.length > 0) {
          const mLength2 = matchEnd - matchStart;
          const allShorter2 = overlappingTextBgIndices2.every(
            (i) => existingMatches[i].end - existingMatches[i].start < mLength2,
          );
          if (!allShorter2) {
            continue;
          }
          for (let i = overlappingTextBgIndices2.length - 1; i >= 0; i--) {
            existingMatches.splice(overlappingTextBgIndices2[i], 1);
          }
        }

        if (headingRanges && headingRanges.length > 0) {
          let inHeading = false;
          for (const hr of headingRanges) {
            if (matchStart < hr.end && matchEnd > hr.start) {
              inHeading = true;
              break;
            }
          }
          if (inHeading) continue;
        }

        {
          const mt = String(
            entry.matchType ||
              (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase();
          if (
            !this.isSentenceLikePattern(entry.pattern) &&
            mt === "exact" &&
            !this.isWholeWordMatch(
              chunkText,
              match.index,
              match.index + matchedText.length,
            )
          ) {
            continue;
          }
        }

        // Use helper to extract full word and check if blacklisted
        // PERF FIX: Use pre-built word set for O(1) lookup; fall back to full check only when set unavailable
        if (blacklistWordSet && blacklistWordSet.size > 0) {
          const fullWord = this.extractFullWord(chunkText, match.index, match.index + matchedText.length);
          if (blacklistWordSet.has(fullWord.toLowerCase())) continue;
        } else if (this.isContextBlacklisted(chunkText, match.index, match.index + matchedText.length, filePath)) {
          continue;
        }

        matches.push({
          start: matchStart,
          end: matchEnd,
          color:
            folderEntry && folderEntry.defaultColor
              ? folderEntry.defaultColor
              : entry.textColor && entry.textColor !== "currentColor"
                ? entry.textColor
                : entry.color,
          styleType: entry.styleType,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor,
          entryRef: entry,
          customCss: entry.customCss, // Add customCss
        });

        matchCount++;
        if (matches.length > 2000) break;
      }

      if (matches.length > 2000) break;
    }

    // --- Partial Match coloring for chunked processing ---
    if (matches.length < 2000) {
      const textOnlyEntries = entries.filter(
        (e) =>
          e &&
          !e.invalid &&
          !e.isRegex &&
          ["contains", "startswith", "endswith"].includes(
            String(
              e.matchType ||
                (this.settings.partialMatch ? "contains" : "exact"),
            ).toLowerCase(),
          ) &&
          !this.isSentenceLikePattern(e.pattern) &&
          this.isLatinWordPattern(e.pattern),
      );
      if (textOnlyEntries.length > 0) {
        // OPTIMIZATION: Pre-calculate regexes for startswith/endswith
        for (const entry of textOnlyEntries) {
          const mt = String(
            entry.matchType ||
              (this.settings.partialMatch ? "contains" : "exact"),
          ).toLowerCase();
          if (mt === "startswith" || mt === "endswith") {
            const cs =
              typeof entry._caseSensitiveOverride === "boolean"
                ? entry._caseSensitiveOverride
                : typeof entry.caseSensitive === "boolean"
                  ? entry.caseSensitive
                  : this.settings.caseSensitive;
            if (
              (mt === "startswith" &&
                (!entry._startswithRegex || entry._lastCs !== cs)) ||
              (mt === "endswith" &&
                (!entry._endswithRegex || entry._lastCs !== cs))
            ) {
              const pat = cs
                ? String(entry.pattern || "")
                : String(entry.pattern || "").toLowerCase();
              const flags = cs ? "" : "i";
              const esc = this.escapeRegex(pat);
              try {
                if (mt === "startswith")
                  entry._startswithRegex = new RegExp(
                    `^${esc}[A-Za-z0-9'\\-]*$`,
                    flags,
                  );
                else
                  entry._endswithRegex = new RegExp(
                    `^[A-Za-z0-9'\\-]*${esc}$`,
                    flags,
                  );
                entry._lastCs = cs;
              } catch (_) {}
            }
          }
        }

        const wordRegex = /[A-Za-z0-9'\-]+/g;
        let match;
        while ((match = wordRegex.exec(chunkText))) {
          const w = match[0];
          const wStart = match.index;
          const wEnd = wStart + w.length;

          // EXPERT FIX: Word Completion Coloring - Only trigger after space/newline on ACTIVE lines
          if (this.settings.enableWordCompletionColoring) {
            let isActiveLine = false;
            const absStart = chunkFrom + wStart;
            if (activeLineRanges.length > 0) {
              for (const range of activeLineRanges) {
                if (absStart >= range.start && absStart <= range.end) {
                  isActiveLine = true;
                  break;
                }
              }
            }

            if (isActiveLine) {
              const nextChar = chunkText[wEnd];
              if (!nextChar || !/[\s]/.test(nextChar)) continue;
            }
          }

          // PERF FIX: Use pre-built set for O(1) word blacklist lookup
          if (blacklistWordSet && blacklistWordSet.has(w.toLowerCase())) continue;
          else if (!blacklistWordSet && this.isWordBlacklisted(w, filePath)) continue;
          if (
            this.isMatchInBlacklistedRange(
              chunkFrom + wStart,
              chunkFrom + wEnd,
              blacklistedListRanges,
            )
          )
            continue;

          for (const entry of textOnlyEntries) {
            if (!entry || entry.invalid) continue;
            if (/^[\s~`!@#$%^&*()\-\_=+\[\]{};:'",.<>\/?\\|]+$/.test(entry.pattern))
              continue;
            // PERF FIX: Use pre-built set for O(1) entry pattern blacklist lookup
            if (blacklistWordSet && blacklistWordSet.has(entry.pattern.toLowerCase())) continue;
            else if (!blacklistWordSet && this.isWordBlacklisted(entry.pattern, filePath)) continue;

            const mt = String(
              entry.matchType ||
                (this.settings.partialMatch ? "contains" : "exact"),
            ).toLowerCase();
            const cs =
              typeof entry._caseSensitiveOverride === "boolean"
                ? entry._caseSensitiveOverride
                : typeof entry.caseSensitive === "boolean"
                  ? entry.caseSensitive
                  : this.settings.caseSensitive;
            const word = cs ? w : w.toLowerCase();
            const pat = cs
              ? String(entry.pattern || "")
              : String(entry.pattern || "").toLowerCase();
            let ok = false;
            if (mt === "contains") {
              ok = word.includes(pat);
            } else if (mt === "startswith") {
              if (entry._startswithRegex)
                ok = entry._startswithRegex.test(word);
              else ok = word.startsWith(pat);
            } else if (mt === "endswith") {
              if (entry._endswithRegex) ok = entry._endswithRegex.test(word);
              else ok = word.endsWith(pat);
            }
            if (ok) {
              // For text-only coloring, expand to full word boundaries
              let expandedWStart = wStart;
              let expandedWEnd = wEnd;

              if (!this.isSentenceLikePattern(entry.pattern)) {
                const nonRoman =
                  this.containsNonRomanCharacters &&
                  this.containsNonRomanCharacters(entry.pattern);
                if (nonRoman) {
                  while (
                    expandedWStart > 0 &&
                    this.isCJKChar(chunkText[expandedWStart - 1])
                  )
                    expandedWStart--;
                  while (
                    expandedWEnd < chunkText.length &&
                    this.isCJKChar(chunkText[expandedWEnd])
                  )
                    expandedWEnd++;
                } else {
                  while (
                    expandedWStart > 0 &&
                    (/[A-Za-z0-9]/.test(chunkText[expandedWStart - 1]) ||
                      chunkText[expandedWStart - 1] === "-" ||
                      chunkText[expandedWStart - 1] === "'")
                  )
                    expandedWStart--;
                  while (
                    expandedWEnd < chunkText.length &&
                    (/[A-Za-z0-9]/.test(chunkText[expandedWEnd]) ||
                      chunkText[expandedWEnd] === "-" ||
                      chunkText[expandedWEnd] === "'")
                  )
                    expandedWEnd++;
                }
              }

              // Check if this partial match overlaps with any existing match or text+bg
              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                if (
                  chunkFrom + expandedWStart < existingMatch.end &&
                  chunkFrom + expandedWEnd > existingMatch.start
                ) {
                  overlapsWithExisting = true;
                  break;
                }
              }
              for (const textBgMatch of existingMatches) {
                if (
                  textBgMatch.isTextBg &&
                  chunkFrom + expandedWStart < textBgMatch.end &&
                  chunkFrom + expandedWEnd > textBgMatch.start
                ) {
                  overlapsWithExisting = true;
                  break;
                }
              }

              if (!overlapsWithExisting) {
                const useColor =
                  folderEntry && folderEntry.defaultColor
                    ? folderEntry.defaultColor
                    : entry.textColor && entry.textColor !== "currentColor"
                      ? entry.textColor
                      : entry.color;
                matches.push({
                  start: chunkFrom + expandedWStart,
                  end: chunkFrom + expandedWEnd,
                  color: useColor,
                  styleType: "text",
                  entryRef: entry,
                  customCss: entry.customCss, // Add customCss
                });
                if (matches.length > 2000) break;
              } else {
                // Remove smaller overlapping matches and add the full word instead
                for (let i = matches.length - 1; i >= 0; i--) {
                  const m = matches[i];
                  if (
                    m.start >= chunkFrom + expandedWStart &&
                    m.end <= chunkFrom + expandedWEnd &&
                    m.end - m.start < expandedWEnd - expandedWStart
                  ) {
                    matches.splice(i, 1);
                  }
                }
                const useColor =
                  folderEntry && folderEntry.defaultColor
                    ? folderEntry.defaultColor
                    : entry.textColor && entry.textColor !== "currentColor"
                      ? entry.textColor
                      : entry.color;
                matches.push({
                  start: chunkFrom + expandedWStart,
                  end: chunkFrom + expandedWEnd,
                  color: useColor,
                  styleType: "text",
                  entryRef: entry,
                  customCss: entry.customCss, // Add customCss
                });
                if (matches.length > 2000) break;
              }
              break;
            }
          }

          if (matches.length > 2000) break;
          try {
            if (
              typeof wordRegex.lastIndex === "number" &&
              wordRegex.lastIndex === match.index
            )
              wordRegex.lastIndex++;
          } catch (e) {}
        }
      }
    }

    return matches;
  }

  // NEW METHOD: Apply decorations from collected matches
  applyDecorationsFromMatches(builder, matches, folderEntry) {
    const all = matches.slice().sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      const lenDiff = b.end - b.start - (a.end - a.start);
      if (lenDiff !== 0) return lenDiff;
      const ar = a.entryRef && !!a.entryRef.isRegex;
      const br = b.entryRef && !!b.entryRef.isRegex;
      if (ar !== br) return ar ? 1 : -1;
      return 0;
    });
    const selected = [];
    for (const m of all) {
      let overlaps = false;
      const overlappingIndices = [];
      for (let i = 0; i < selected.length; i++) {
        const s = selected[i];
        if (m.start < s.end && m.end > s.start) {
          overlaps = true;
          overlappingIndices.push(i);
        }
      }
      if (!overlaps) {
        selected.push(Object.assign({}, m));
      } else {
        // Check if the new match is longer than ALL overlapping matches
        // If so, remove the overlapping ones and add this longer match instead
        const mLength = m.end - m.start;
        const allShorter = overlappingIndices.every((i) => {
          const s = selected[i];
          return s.end - s.start < mLength;
        });

        if (allShorter) {
          // Remove overlapping matches in reverse order to maintain indices
          for (let i = overlappingIndices.length - 1; i >= 0; i--) {
            selected.splice(overlappingIndices[i], 1);
          }
          selected.push(Object.assign({}, m));
        }
      }
    }
    const sortedSel = selected
      .sort((a, b) => a.start - b.start || a.end - b.end)
      .slice(0, 1000);
    const limited = (() => {
      const merged = [];
      for (const m of sortedSel) {
        const last = merged[merged.length - 1];
        if (
          last &&
          m.isTextBg &&
          last.isTextBg &&
          m.textColor === last.textColor &&
          m.backgroundColor === last.backgroundColor &&
          m.start <= last.end
        ) {
          if (m.end > last.end) last.end = m.end;
        } else {
          merged.push(m);
        }
      }
      return merged;
    })();

    // Apply decorations
    const effectiveStyle = "text";

    if (limited.some((m) => m.isTextBg)) {
      const fullTextBg = limited.filter((m) => m.isTextBg);
      const filtered = [];
      for (const m of limited) {
        if (!m.isTextBg) {
          let overlapsTextBg = false;
          for (const f of fullTextBg) {
            if (m.start < f.end && m.end > f.start) {
              // Only skip if the overlapping entry provides text color (is not 'highlight')
              // This allows text-only matches to compose with highlight-only matches
              const fStyle =
                f.styleType || (f.entryRef ? f.entryRef.styleType : null);
              if (fStyle !== "highlight") {
                overlapsTextBg = true;
                break;
              }
            }
          }
          if (overlapsTextBg) continue;
        }
        filtered.push(m);
      }
      limited.length = 0;
      for (const m of filtered) limited.push(m);
    }

    for (const m of limited) {
      if (m.skip) continue;
      let style;
      const hideText = this.settings.hideTextColors === true;
      const hideBg = this.settings.hideHighlights === true;
      if (m.isTextBg) {
        const textColor = m.textColor;
        const bgColor = m.backgroundColor;
        
        // If both are hidden, we only proceed if custom CSS is enabled and present
        if (hideText && hideBg) {
          if (!(this.settings.enableCustomCss && m.entryRef && m.entryRef.customCss)) {
            continue;
          }
        }

        const params = this.getHighlightParams(m.entryRef);
        const borderStyle = this.generateBorderStyle(
          hideText ? null : textColor,
          hideBg ? null : bgColor,
          m.entryRef,
        );
        const textPart = hideText || !textColor ? "" : `color: ${textColor} !important; `;
        const bgPart = hideBg || !bgColor
          ? ""
          : `background-color: ${this.hexToRgba(bgColor, params.opacity)} !important; border-radius: ${params.radius}px !important; padding-left: ${params.hPad}px !important; padding-right: ${params.hPad}px !important; padding-top: ${params.vPad}px !important; padding-bottom: ${params.vPad}px !important;${(this.settings.enableBoxDecorationBreak ?? true) ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
        style = `${textPart}${bgPart}${borderStyle}`;

        // Merge group CSS then entry CSS (custom CSS wins over base styles)
        if (this.settings.enableCustomCss) {
          if (m.entryRef?._groupRef?.customCss) {
            style = this._mergeStyleWithCustomCss(style, m.entryRef._groupRef.customCss);
          }
          if (m.entryRef?.customCss) {
            style = this._mergeStyleWithCustomCss(style, m.entryRef.customCss);
          }
        }
      } else {
        if (effectiveStyle === "none") {
          // Even if style is none, we might apply custom CSS
          if (!(this.settings.enableCustomCss && m.entryRef && m.entryRef.customCss)) {
            continue;
          }
          style = "";
        } else {
          // If affectMarkElements flag is set, force 'highlight' styleType
          let styleType =
            m.entryRef && m.entryRef.affectMarkElements
              ? "highlight"
              : m.styleType || "text";

          if (styleType === "text") {
            if (hideText) {
              if (!(this.settings.enableCustomCss && m.entryRef && m.entryRef.customCss)) {
                continue;
              }
              style = "";
            } else {
              style = `color: ${m.color} !important; --highlight-color: ${m.color};`;
            }
          } else if (styleType === "highlight") {
            const bgColor = m.backgroundColor || m.color;
            if (hideBg) {
              if (!(this.settings.enableCustomCss && m.entryRef && m.entryRef.customCss)) {
                continue;
              }
              style = "";
            } else {
              const params = this.getHighlightParams(m.entryRef);
              const borderStyle = this.generateBorderStyle(
                null,
                bgColor,
                m.entryRef,
              );
              style = (() => {
                const vPad = params.vPad;
                const vPadCss =
                  vPad >= 0
                    ? `padding-top: ${vPad}px !important; padding-bottom: ${vPad}px !important;`
                    : `padding-top: 0px !important; padding-bottom: 0px !important; margin-top: ${vPad}px !important; margin-bottom: ${vPad}px !important;`;
                return `background: none; background-color: ${this.hexToRgba(bgColor, params.opacity)} !important; border-radius: ${params.hPad > 0 && params.radius === 0 ? 0 : params.radius}px !important; padding-left: ${params.hPad}px !important; padding-right: ${params.hPad}px !important; ${vPadCss}${(this.settings.enableBoxDecorationBreak ?? true) ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
              })();
            }
          } else if (styleType === "both") {
            const textColor =
              m.textColor && m.textColor !== "currentColor"
                ? m.textColor
                : m.color || null;
            const bgColor = m.backgroundColor || m.color;
            
            if (hideText && hideBg) {
              if (!(this.settings.enableCustomCss && m.entryRef && m.entryRef.customCss)) {
                continue;
              }
              style = "";
            } else {
              const params = this.getHighlightParams(m.entryRef);
              const borderStyle = this.generateBorderStyle(
                hideText ? null : textColor,
                hideBg ? null : bgColor,
                m.entryRef,
              );
              const textPart = hideText
                ? ""
                : textColor
                  ? `color: ${textColor} !important; --highlight-color: ${textColor}; `
                  : "";
              const bgPart = (() => {
                if (hideBg) return "";
                const vPad = params.vPad;
                const vPadCss =
                  vPad >= 0
                    ? `padding-top: ${vPad}px !important; padding-bottom: ${vPad}px !important;`
                    : `padding-top: 0px !important; padding-bottom: 0px !important; margin-top: ${vPad}px !important; margin-bottom: ${vPad}px !important;`;
                return `background-color: ${this.hexToRgba(bgColor, params.opacity)} !important; border-radius: ${params.radius}px !important; padding-left: ${params.hPad}px !important; padding-right: ${params.hPad}px !important; ${vPadCss}${(this.settings.enableBoxDecorationBreak ?? true) ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
              })();
              style = `${textPart}${bgPart}${borderStyle}`;
            }
          } else {
            if (hideText) {
              if (!(this.settings.enableCustomCss && m.entryRef && m.entryRef.customCss)) {
                continue;
              }
              style = "";
            } else {
              style = `color: ${m.color} !important; --highlight-color: ${m.color};`;
            }
          }
        }

        // Merge group CSS then entry CSS (custom CSS wins over base styles)
        if (this.settings.enableCustomCss) {
          if (m.entryRef?._groupRef?.customCss) {
            style = this._mergeStyleWithCustomCss(style, m.entryRef._groupRef.customCss);
          }
          if (m.entryRef?.customCss) {
            style = this._mergeStyleWithCustomCss(style, m.entryRef.customCss);
          }
        }
      }
      const isDark =
        (m.color || m.textColor || m.backgroundColor) &&
        this.isDarkColor(m.color || m.textColor || m.backgroundColor);
      const deco = Decoration.mark({
        attributes: {
          style,
          class:
            (m.entryRef && m.entryRef.affectMarkElements
              ? "always-color-text-highlight always-color-text-highlight-marks"
              : "always-color-text-highlight") +
            (isDark ? " act-dark-color" : ""),
          title:
            this.settings.showColoringReasonOnHover && m.entry
              ? this.getColoringReasonTooltip(m)
              : "",
        },
      });

      builder.add(m.start, m.end, deco);
    }

    return builder.finish();
  }

  // --- Memory management helpers ---
  async cleanup() {
    try {
      // Clear caches
      try {
        this._cachedSortedEntries = null;
        this._cacheDirty = true;
      } catch (e) {}
      try {
        if (this._regexCache) this._regexCache.clear();
      } catch (e) {}
      try {
        this._compiledWordEntries = [];
      } catch (e) {}
      try {
        this._lpCalloutCache = null;
      } catch (e) {}
      try {
        this._lpTableCache = null;
      } catch (e) {}
      try {
        this._canvasDebounceTimers = null;
      } catch (e) {}

      // Clear all reading mode intervals
      try {
        if (
          this._readingModeIntervals &&
          this._readingModeIntervals instanceof Map
        ) {
          for (const intervals of this._readingModeIntervals.values()) {
            if (Array.isArray(intervals)) {
              for (const intervalId of intervals) {
                try {
                  clearInterval(intervalId);
                } catch (e) {}
              }
            }
          }
          this._readingModeIntervals.clear();
        }
      } catch (e) {}

      // Clear timers
      try {
        if (this._refreshTimeout) {
          clearTimeout(this._refreshTimeout);
          this._refreshTimeout = null;
        }
      } catch (e) {}
      try {
        if (this._editorRefreshTimeout) {
          clearTimeout(this._editorRefreshTimeout);
          this._editorRefreshTimeout = null;
        }
      } catch (e) {}

      // Clear large settings arrays safely
      try {
        if (this.settings) {
          if (Array.isArray(this.settings.wordEntries))
            this.settings.wordEntries.length = 0;
          if (Array.isArray(this.settings.blacklistWords))
            this.settings.blacklistWords.length = 0;
          if (Array.isArray(this.settings.disabledFiles))
            this.settings.disabledFiles.length = 0;
        }
      } catch (e) {}

      // Stop memory monitor if running
      try {
        this.stopMemoryMonitor();
      } catch (e) {}

      // Disconnect any viewport observers to avoid leaks
      try {
        if (
          this._viewportObservers &&
          typeof this._viewportObservers.forEach === "function"
        ) {
          this._viewportObservers.forEach((obs, key) => {
            try {
              obs.disconnect();
            } catch (e) {}
          });
          try {
            this._viewportObservers.clear();
          } catch (e) {}
        }
      } catch (e) {}

      // Disconnect bases observers
      try {
        if (
          this._basesObservers &&
          typeof this._basesObservers.forEach === "function"
        ) {
          this._basesObservers.forEach((obs, key) => {
            try {
              obs.disconnect();
            } catch (e) {}
          });
          try {
            this._basesObservers.clear();
          } catch (e) {}
        }
      } catch (e) {}

      // Disconnect LP observers
      try {
        if (
          this._lpObservers &&
          typeof this._lpObservers.forEach === "function"
        ) {
          this._lpObservers.forEach((obs, key) => {
            try {
              obs.disconnect();
            } catch (e) {}
          });
          try {
            this._lpObservers.clear();
          } catch (e) {}
        }
      } catch (e) {}

      // Clear event manager
      try {
        if (
          this._eventManager &&
          typeof this._eventManager.clear === "function"
        )
          this._eventManager.clear();
      } catch (e) {}

      // Hint GC if available (may not be in renderer)
      try {
        if (typeof global !== "undefined" && typeof global.gc === "function")
          global.gc();
      } catch (e) {}
    } catch (e) {
      debugError("CLEANUP", "cleanup error", e);
    }
  }

  // --- Helper: Remove highlights created by this plugin from a root element ---
  clearHighlightsInRoot(rootEl) {
    try {
      if (!rootEl || !rootEl.isConnected) return;

      // Cleanup associated observers before clearing highlights
      this.cleanupObserversForElement(rootEl);

      // Use TreeWalker to find highlight spans and unwrap them
      const walker = document.createTreeWalker(
        rootEl,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode(node) {
            return node.classList &&
              node.classList.contains("always-color-text-highlight")
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP;
          },
        },
        false,
      );
      const toRemove = [];
      let n;
      while ((n = walker.nextNode())) {
        toRemove.push(n);
      }
      for (const el of toRemove) {
        try {
          const tn = document.createTextNode(el.textContent);
          el.replaceWith(tn);
        } catch (e) {}
      }
    } catch (e) {
      debugError("CLEAR", "clearHighlightsInRoot failed", e);
    }
  }

  startMemoryMonitor() {
    // DISABLED: Removed memory monitoring to reduce overhead
    // Memory checks happen dynamically in isPerformanceOverloaded()
  }

  stopMemoryMonitor() {
    // DISABLED: Memory monitoring disabled
  }
};


export default AlwaysColorText;

