export const EDITOR_PERFORMANCE_CONSTANTS = {
  MAX_PATTERNS_STANDARD: 20, // Use standard processing for <= 20 patterns (reduced)
  MAX_TEXT_LENGTH_STANDARD: 5000, // Use standard processing for <= 5k chars (reduced)
  PATTERN_CHUNK_SIZE: 20, // INCREASED: Process 20 patterns per chunk (better throughput)
  TEXT_CHUNK_SIZE: 2000, // REDUCED: Process 2k chars per chunk during typing
  MAX_MATCHES_PER_PATTERN: 500, // Max matches per pattern (increased for better UX)
  MAX_TOTAL_MATCHES: 4000, // Absolute limit for decorations (increased)
  LIGHTWEIGHT_MAX_TOTAL_MATCHES: 1000, // Reduced limit for lightweight mode
  TYPING_DEBOUNCE_MS: 500, // INCREASED: Delay rebuilds while typing - 500ms (wait longer before recomputing)
  TYPING_GRACE_PERIOD_MS: 1500, // INCREASED: Skip decoration during active typing (1.5 seconds after last keystroke)
  VIEWPORT_EXTENSION: 200, // INCREASED: Buffer beyond viewport to include in text processing
  CALLOUT_THROTTLE_MS: 1000, // Throttle callout processing to 1 second
  TABLE_THROTTLE_MS: 1000, // Throttle table processing to 1 second
};

// Pre-compiled regex patterns for performance
export const REGEX_CONSTANTS = {
  // List item content extraction
  CHECKBOX_PREFIX: /^\s*\[[\s\xX]\]\s*/,
  TASK_MARKER_PREFIX: /^\s*[\-\*]\s+\[[^\]]*\]\s+/,
  BULLET_PREFIX: /^\s*[\-\*]\s+/,
  NUMBERED_PREFIX: /^\s*\d+\.\s+/,

  // Markdown formatting patterns
  TASK_CHECKED: /^(\s*)([\-\*])(\s+)(\[[xX]\])(\s+)(.*)$/,
  TASK_UNCHECKED: /^(\s*)([\-\*])(\s+)(\[\s\])(\s+)(.*)$/,
  NUMBERED_LIST: /^(\s*)(\d+\.)(\s+)(.*)$/,
  BULLET_POINT: /^(\s*)([\-\*])(\s+)(.*)$/,
};

// Development mode flag
export const IS_DEVELOPMENT = true;

// Keys that are considered "Global Styles" and should be extracted to globalStyles object in JSON
export const GLOBAL_STYLE_KEYS = [
  "borderLineStyle",
  "borderOpacity",
  "borderThickness",
  "enableBorderThickness",
  "highlightHorizontalPadding",
  "highlightVerticalPadding",
  "backgroundOpacity",
  "highlightBorderRadius",
];
