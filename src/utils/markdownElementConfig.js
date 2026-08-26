import { MARKDOWN_TARGETS, getMarkdownTarget } from "./markdownTargets.js";

// Editor/rendered selector prefixes used to outrank Obsidian's own base CSS.
export const EDITOR_PREFIX = ".workspace .cm-s-obsidian .cm-content";
export const RENDER_PREFIX = ".markdown-rendered";

// Split a tag filter ("#a, b, #c") into clean lowercased tag names ("a","b","c").
export function parseTagFilterNames(filter) {
  return String(filter || "")
    .split(/[\s,]+/)
    .map((s) => s.replace(/^#/, "").trim().toLowerCase())
    .filter(Boolean);
}

// Escape characters that are invalid in a CSS class selector body.
function cssClassEscape(name) {
  return name.replace(/[^a-z0-9_-]/g, (c) => "\\" + c);
}

// ---- Parsers for per-element configuration ----

export function parseHeadingLevels(input) {
  const raw = input == null ? "" : String(input).trim();
  const levels = new Set();
  raw.split(/[\s,]+/).forEach((tok) => {
    const n = parseInt(tok, 10);
    if (!isNaN(n) && n >= 1 && n <= 6) levels.add(n);
  });
  const arr = [...levels].sort((a, b) => a - b);
  return arr.length ? arr : [1, 2, 3, 4, 5, 6];
}

export function parseTaskTypes(input) {
  const raw = input == null ? "" : String(input).trim();
  const types = new Set();
  const re = /\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    let c = m[1];
    c = c.length === 0 ? " " : c[0];
    types.add(c);
  }
  const arr = [...types];
  return arr.length ? arr : [" ", "x"];
}

// ---- Config descriptor for a given target element ----

export function getElementConfig(key) {
  switch (key) {
    case "heading":
      return {
        field: "headingLevels",
        placeholder: "1, 2, 3, 4, 5, 6",
        defaultValue: "1, 2, 3, 4, 5, 6",
      };
    case "task-list":
      return {
        field: "taskTypes",
        placeholder: "[ ], [x]",
        defaultValue: "[ ], [x]",
      };
    case "tag":
      return {
        field: "tagFilter",
        placeholder: "tag1, tag2",
        defaultValue: "",
      };
    case "inline-title":
      return {
        field: "titleFilter",
        placeholder: "title text",
        defaultValue: "",
      };
    case "tab-title":
      return {
        field: "titleFilter",
        placeholder: "tab title text",
        defaultValue: "",
      };
    default:
      return null;
  }
}

function cssAttr(c) {
  return '"' + String(c).replace(/"/g, '\\"') + '"';
}

// In reading view an unchecked task is rendered with data-task="" (empty) on some
// Obsidian versions and data-task=" " (a space) on others. Produce both attribute
// selectors so the element is matched regardless.
function taskAttrCombos(ch) {
  if (ch === " ") return [`[data-task=" "]`, `[data-task=""]`];
  return [`[data-task="${ch}"]`];
}

// Build the CSS selector for a target element, honoring per-entry config.
function buildMarkdownParts(t, entry, hasBoldItalic) {
  let cm = "";
  let rend = "";
  if (t.key === "strong") {
    cm = `${EDITOR_PREFIX} .cm-strong:not(.cm-em)`;
    rend = `${RENDER_PREFIX} strong:not(:has(em))`;
  } else if (t.key === "em") {
    cm = `${EDITOR_PREFIX} .cm-em:not(.cm-strong)`;
    rend = `${RENDER_PREFIX} em:not(:has(strong))`;
  } else if (t.key === "heading") {
    const levels = parseHeadingLevels(entry.headingLevels);
    cm = levels.map((l) => `${EDITOR_PREFIX} .cm-header-${l}`).join(", ");
    rend = levels.map((l) => `${RENDER_PREFIX} h${l}`).join(", ");
  } else if (t.key === "bullet-list") {
    // Only style plain bullets: exclude any list line that contains a task
    // checkbox (`- [ ]` / `- [x]`), i.e. a line where a `-` is followed by `[]`.
    cm = `${EDITOR_PREFIX} .HyperMD-list-line:not(:has(.cm-task, .HyperMD-task-line)) .cm-formatting-list-ul ~ .cm-list-1`;
    rend = `${RENDER_PREFIX} ul li:not(.task-list-item), ul li:not(.task-list-item)`;
  } else if (t.key === "numbered-list") {
    cm = `${EDITOR_PREFIX} .HyperMD-list-line:not(:has(.cm-task, .HyperMD-task-line)) .cm-formatting-list-ol ~ .cm-list-1`;
    rend = `${RENDER_PREFIX} ol li:not(.task-list-item), ol li:not(.task-list-item)`;
  } else if (t.key === "internal-link") {
    // Force link text color with maximal specificity (links are colored by
    // Obsidian via --link-color / --link-external-color, so we must outrank it).
    cm = `${EDITOR_PREFIX} .cm-line .cm-hmd-internal-link`;
    rend = `.workspace ${RENDER_PREFIX} a.internal-link, ${RENDER_PREFIX} a.internal-link`;
  } else if (t.key === "external-link") {
    cm = `${EDITOR_PREFIX} .cm-line .cm-link`;
    rend = `.workspace ${RENDER_PREFIX} a.external-link, ${RENDER_PREFIX} a.external-link`;
  } else if (t.key === "task-list") {
    const types = parseTaskTypes(entry.taskTypes);
    const cmParts = [];
    const rendParts = [];
    for (const tc of types) {
      for (const attr of taskAttrCombos(tc)) {
        cmParts.push(
          `${EDITOR_PREFIX} .HyperMD-list-line${attr} .cm-list-1:not(.cm-formatting-list)`,
        );
        rendParts.push(`li.task-list-item${attr}, ${RENDER_PREFIX} li.task-list-item${attr}`);
      }
    }
    cm = cmParts.join(", ");
    rend = rendParts.join(", ");
  } else if (t.key === "tag" || t.key === "all-tags") {
    const filter = entry.tagFilter || "";
    // An "All Tags" entry with a filter behaves as a specific tag; only an
    // "All Tags" entry with NO filter colors every hashtag.
    if (t.key === "all-tags" && !filter.trim()) {
      cm = `${EDITOR_PREFIX} .cm-hashtag`;
      rend = `${RENDER_PREFIX} .tag`;
    } else {
      const names = parseTagFilterNames(filter);
      if (!names.length) {
        cm = `${EDITOR_PREFIX} .cm-hashtag`;
        rend = `${RENDER_PREFIX} .tag`;
      } else {
        cm = names
          .map((n) => `${EDITOR_PREFIX} .cm-tag-${cssClassEscape(n)}.cm-hashtag`)
          .join(", ");
        // Reading view: target the tag's href directly (Obsidian renders tags as
        // <a class="tag" href="#name">) since text filtering can't be in pure CSS.
        rend = names
          .map(
            (n) =>
              `${RENDER_PREFIX} a.tag[href*="${cssAttr(n)}"], a.tag[href*="${cssAttr(n)}"]`,
          )
          .join(", ");
      }
    }
  } else if (t.key === "inline-title" || t.key === "tab-title") {
    const field = "titleFilter";
    if (entry[field] && String(entry[field]).trim().length > 0) {
      // Filtered by text — cannot be expressed in CSS; handled by applyTitleHighlights.
      cm = "";
      rend = "";
    } else if (t.key === "tab-title") {
      cm = ".workspace .workspace-tab-header-inner-title";
      rend = ".workspace-tab-header-inner-title";
    } else {
      cm = ".workspace .cm-s-obsidian .inline-title";
      rend = `${RENDER_PREFIX} .inline-title`;
    }
  } else {
    cm = `${EDITOR_PREFIX} ${t.cmSelector}`;
    rend = t.renderedSelector
      ? t.renderedSelector
          .split(",")
          .map((s) => {
            s = s.trim();
            return s.startsWith(RENDER_PREFIX) ? s : `${RENDER_PREFIX} ${s}`;
          })
          .join(", ")
      : "";
  }
  return { cm, rend };
}

// Full selector (editor + reading) used by applyFormattingStyles.
export function buildMarkdownSelector(t, entry, hasBoldItalic) {
  const { cm, rend } = buildMarkdownParts(t, entry, hasBoldItalic);
  return [cm, rend].filter(Boolean).join(", ");
}

// Editor-only selector (used for live-preview tag begin/end splitting).
export function buildMarkdownCmSelector(t, entry, hasBoldItalic) {
  const { cm } = buildMarkdownParts(t, entry, hasBoldItalic);
  return cm;
}

// A text input shown to the right of the element dropdown for configurable
// targets (heading levels, task types, tag filter, inline-title filter).
export function createMarkdownElementConfigInput(plugin, entry, onChange) {
  const cfg = getElementConfig(entry.targetElement);
  if (!cfg) return null;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "act-md-element-config";
  input.style.flex = "1 1 auto";
  input.style.minWidth = "0";
  input.style.padding = "6px 8px";
  input.style.borderRadius = "var(--input-radius)";
  input.style.border = "1px solid var(--background-modifier-border)";
  input.style.background = "var(--background-modifier-form-field)";
  input.style.color = "var(--text-normal)";
  input.placeholder = plugin.t("md_cfg_" + cfg.field, cfg.placeholder);
  input.value = entry[cfg.field] != null ? entry[cfg.field] : cfg.defaultValue;
  input.title = plugin.t(
    "md_cfg_title",
    "Additional matching options for this element",
  );
  const handler = () => {
    entry[cfg.field] = input.value;
    if (onChange) onChange();
  };
  input.addEventListener("input", handler);
  input.addEventListener("change", handler);
  return input;
}

// ---- Reading-view text matching for tag / inline-title filters ----

export function tagTextMatches(filter, text) {
  const t = (text || "").trim();
  if (!t) return false;
  const wanted = (filter || "")
    .split(/[\s,]+/)
    .map((s) => s.replace(/^#/, "").toLowerCase())
    .filter(Boolean);
  if (!wanted.length) return true;
  const cur = t.replace(/^#/, "").toLowerCase();
  return wanted.includes(cur);
}

export function titleTextMatches(filter, text) {
  const f = (filter || "").trim().toLowerCase();
  if (!f) return true;
  return (text || "").toLowerCase().includes(f);
}

// Builds the READING-VIEW (rendered) CSS selector for a markdown entry,
// honoring per-element config (heading levels / task checkbox types).
export function buildRenderedSelector(entry) {
  const t = getMarkdownTarget(entry.targetElement);
  if (!t) return entry.targetElement;
  if (entry.targetElement === "heading") {
    const levels = parseHeadingLevels(entry.headingLevels);
    if (!levels.length) return "";
    return levels
      .map((l) => `${RENDER_PREFIX} h${l}, h${l}`)
      .join(", ");
  }
  if (entry.targetElement === "task-list") {
    const types = parseTaskTypes(entry.taskTypes);
    if (!types.length) return "";
    const parts = [];
    for (const tc of types) {
      for (const attr of taskAttrCombos(tc)) {
        parts.push(`${RENDER_PREFIX} li.task-list-item${attr}, li.task-list-item${attr}`);
      }
    }
    return parts.join(", ");
  }
  if (entry.targetElement === "bullet-list")
    return `${RENDER_PREFIX} ul li:not(.task-list-item), ul li:not(.task-list-item)`;
  if (entry.targetElement === "numbered-list")
    return `${RENDER_PREFIX} ol li:not(.task-list-item), ol li:not(.task-list-item)`;
  if (!t.renderedSelector) return "";
  return t.renderedSelector;
}
