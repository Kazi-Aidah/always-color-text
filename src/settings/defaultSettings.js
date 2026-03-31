export const defaultSettings = {
  // legacy: wordColors map. New model below: wordEntries array
  wordColors: {},
  wordEntries: [],
  wordEntryGroups: [],
  blacklistEntryGroups: [],
  caseSensitive: false,
  enabled: true,
  highlightStyle: "text",
  backgroundOpacity: 35, // percent
  highlightBorderRadius: 4, // px
  highlightHorizontalPadding: 4, // px
  highlightVerticalPadding: 0, // px
  enableBoxDecorationBreak: true, // Toggle for rounded corners on text wrapping
  enableBorderThickness: false, // Toggle for border on background highlights
  borderOpacity: 100, // percent (0-100)
  borderThickness: 2, // px (0-5)
  borderStyle: "full", // 'full', 'top', 'bottom', 'left', 'right', 'top-bottom', 'left-right', 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  borderLineStyle: "solid",
  disabledFiles: [],
  customSwatchesEnabled: false,
  replaceDefaultSwatches: false,
  customSwatches: [],
  // Default named swatches (never edited by user, only read-only display)
  swatches: [
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
  ],
  // User-added custom swatches (separate from defaults)
  userCustomSwatches: [],
  disableToggleModes: {
    statusBar: false,
    command: false,
    ribbon: false,
  },
  enableAlwaysHighlight: false,
  enableAlwaysColor: true,
  partialMatch: true,
  blacklistWords: [],
  // New: pattern-capable blacklist entries
  blacklistEntries: [],
  enableBlacklistMenu: true,
  enableAddToExistingMenu: true,
  enableAlwaysColorTextMenu: true,
  hideInactiveGroupsInDropdowns: true,
  hideInactiveBlacklistGroupsInDropdowns: true,
  showWordGroupsInCommands: true,
  showBlacklistGroupsInCommands: true,
  symbolWordColoring: false,
  // Enable/disable regex support in the settings UI/runtime
  enableRegexSupport: false,
  // Opt-in: force full reading-mode render (WARNING: may freeze UI on large notes)
  forceFullRenderInReading: true,
  // Opt-in: extremely lightweight processing mode (experimental)
  extremeLightweightMode: false,
  // Opt-in: Smart Updates (Freeze non-active lines)
  enableSmartUpdates: false,
  // Opt-in: Word Completion Coloring (Wait for space)
  enableWordCompletionColoring: false,
  // Disable coloring in reading/preview mode (editor remains colored)
  disableReadingModeColoring: false,
  disableLivePreviewColoring: false,
  // Text & Background Coloring entries
  textBgColoringEntries: [],
  // Enable/disable Text & Background Coloring option in right-click menu
  enableTextBgMenu: true,
  // Use swatch names for coloring entries
  useSwatchNamesForText: false,
  linkSwatchUpdatesToEntries: false,
  colorPickerMode: "both",
  advancedRules: [],
  pathRules: [],
  // Allow disabling regex safety checks (dangerous)
  disableRegexSafety: false,
  enableQuickColorHighlightOnce: false,
  enableQuickColorOnce: false,
  enableQuickHighlightOnce: false,
  quickHighlightStyleEnable: false,
  quickColorsEnabled: false,
  quickColorsApplyMode: "html",
  quickColors: [], // Array of { textColor, backgroundColor, uid }
  quickStyles: [], // Array of objects { id, name, style }
  quickHighlightUseGlobalStyle: false,
  quickHighlightOpacity: 25,
  quickHighlightBorderRadius: 8,
  quickHighlightHorizontalPadding: 4,
  quickHighlightVerticalPadding: 0,
  quickHighlightEnableBorder: false,
  quickHighlightBorderStyle: "full",
  quickHighlightBorderOpacity: 100,
  quickHighlightBorderThickness: 1,
  quickHighlightBorderLineStyle: "solid",
  wordsSortMode: "last-added",
  blacklistSortMode: "last-added",
  pathSortMode: "last-added",
  language: "en",
  customSwatchesFolded: false,
  globalHighlightFolded: false,
  readingModeHighlightFilter: null, // null: show all, 'highlight': show only highlights, 'text': show only text colors
  entriesSearchLimit: 0,
  blacklistSearchLimit: 0,
  pathSearchLimit: 0,
  showColoringReasonOnHover: false, // Show tooltip on hover explaining why text is colored
  lightModeFixer: false,
  darkModeFixer: false,
  enableCustomCss: false,
};
