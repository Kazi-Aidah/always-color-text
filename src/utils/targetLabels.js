// Maps a CSS target element (or mark flag) to a human-readable label so that
// formatting presets (Bold/Italic/Links/...) can be shown as "Target: …"
// instead of a regex they don't actually use.
const TARGET_KEYS = {
  strong: ["target_strong", "Bold"],
  em: ["target_em", "Italic"],
  "strong-em": ["target_strong_em", "Bold Italic"],
  a: ["target_a", "Links"],
  code: ["target_code", "Inline Code"],
  mark: ["target_mark", "Highlight"],
};

// The actual CodeMirror / rendered-DOM selectors the engine colors for a
// target element. Used to describe what a target entry affects instead of
// showing the (inert) regex it carries.
const TARGET_CSS = {
  strong: ".cm-strong and strong",
  em: ".cm-em and em",
  "strong-em": ".cm-strong.cm-em and strong em",
  a: ".cm-link and a",
  code: ".cm-inline-code and code",
  mark: ".cm-highlight and mark",
};

export function getTargetLabel(plugin, targetElement, affectMarkElements) {
  if (targetElement) {
    const entry = TARGET_KEYS[String(targetElement)];
    if (entry) return plugin.t(entry[0], entry[1]);
  }
  if (affectMarkElements) return plugin.t("target_highlight", "Highlight");
  return null;
}

// Describes, in plain text, what CSS a target entry colors. This is stored as
// the entry's pattern (replacing the dead regex) so the data stays meaningful.
export function getTargetPatternText(plugin, targetElement, affectMarkElements) {
  let css = TARGET_CSS[String(targetElement)];
  if (!css && affectMarkElements) css = TARGET_CSS.mark;
  if (!css) css = String(targetElement || "");
  return plugin.t("targets_css", "Targets") + " " + css;
}

// Resolves a targetElement for an entry even when it wasn't stored explicitly
// (older entries only carried a preset name / regex). This lets us treat
// Bold/Italic/… presets as targets regardless of how they were persisted.
const FORMATTING_NAMES = {
  bold: "strong",
  italic: "em",
  "bold italic": "strong-em",
  bolditalic: "strong-em",
  links: "a",
};

// The exact regex strings the engine's self-heal recognizes as formatting
// targets (see AlwaysColorText.js self-heal). Matching them here lets legacy
// entries that stored ONLY the regex be treated as targets too.
const FORMATTING_REGEX = {
  "(\\*\\*|__)(?=\\S)([^\\r]*?\\S)\\1": "strong",
  "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1": "em",
  "(\\*\\*\\*|___)(?=\\S)([^\\r]*?\\S)\\1": "strong-em",
};

export function resolveTargetElement(plugin, entry) {
  if (!entry) return null;
  if (entry.affectMarkElements) return "mark";
  if (entry.targetElement) return String(entry.targetElement);
  const name = String(entry.presetLabel || "").trim().toLowerCase();
  if (FORMATTING_NAMES[name]) return FORMATTING_NAMES[name];
  if (entry.pattern && FORMATTING_REGEX[String(entry.pattern)])
    return FORMATTING_REGEX[String(entry.pattern)];
  return null;
}

