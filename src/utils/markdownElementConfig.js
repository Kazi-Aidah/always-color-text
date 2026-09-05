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
        matchField: "titleMatchType",
        placeholder: "title text",
        defaultValue: "",
      };
    case "tab-title":
      return {
        field: "titleFilter",
        matchField: "titleMatchType",
        placeholder: "tab title text",
        defaultValue: "",
      };
    default:
      return null;
  }
}

export function normalizeTitleMatchType(mode) {
  const m = String(mode || "contains").trim().toLowerCase();
  if (m === "exact") return "exact";
  if (m === "startswith" || m === "starts with") return "startswith";
  if (m === "endswith" || m === "ends with") return "endswith";
  return "contains";
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
    // Exclude bold-italic: strong that contains em OR is inside em (covers ***text*** -> strong>em and em>strong)
    rend = `${RENDER_PREFIX} strong:not(:has(em)):not(em strong)`;
  } else if (t.key === "em") {
    cm = `${EDITOR_PREFIX} .cm-em:not(.cm-strong)`;
    // Exclude bold-italic: em that contains strong OR is inside strong
    rend = `${RENDER_PREFIX} em:not(:has(strong)):not(strong em)`;
  } else if (t.key === "strong-em") {
    cm = `${EDITOR_PREFIX} .cm-strong.cm-em`;
    rend = `${RENDER_PREFIX} strong em, ${RENDER_PREFIX} em strong, ${RENDER_PREFIX} strong:has(em), ${RENDER_PREFIX} em:has(strong)`;
  } else if (t.key === "heading") {
    const levels = parseHeadingLevels(entry.headingLevels);
    cm = levels.map((l) => `${EDITOR_PREFIX} .cm-header-${l}`).join(", ");
    rend = levels.map((l) => `${RENDER_PREFIX} h${l}`).join(", ");
  } else if (t.key === "bullet-list") {
    // Only style plain bullets: exclude any task list line. The task line carries
    // `.HyperMD-task-line` ON the line element itself (not as a descendant), so a
    // bare `:not(:has(.HyperMD-task-line))` would never exclude it — we must also
    // reject the class on the line directly.
    cm = `${EDITOR_PREFIX} .HyperMD-list-line:not(.HyperMD-task-line):not(:has(.cm-task)) .cm-formatting-list-ul ~ .cm-list-1`;
    rend = `${RENDER_PREFIX} ul li:not(.task-list-item), ul li:not(.task-list-item)`;
  } else if (t.key === "numbered-list") {
    cm = `${EDITOR_PREFIX} .HyperMD-list-line:not(.HyperMD-task-line):not(:has(.cm-task)) .cm-formatting-list-ol ~ .cm-list-1`;
    rend = `${RENDER_PREFIX} ol li:not(.task-list-item), ol li:not(.task-list-item)`;
  } else if (t.key === "internal-link") {
    // Fix: previously used `.cm-hmd-internal-link *` etc. which applied
    // background/padding to BOTH the container and each inner span
    // (.is-unresolved, .cm-underline), producing 2-3 nested highlight layers
    // in Live Preview (see provided DOM dumps). For text color we still need
    // to reach the leaf, but for highlight we must only style the leaf.
    // Target the leaf `.cm-underline` inside the link container and the live
    // preview anchor itself. No `*` wildcard.
    cm = [
      `${EDITOR_PREFIX} a.internal-link`,
      `${EDITOR_PREFIX} .cm-hmd-internal-link .cm-underline`,
      // Fallback for Obsidian builds that render the link text without the
      // inner .cm-underline wrapper (direct .cm-hmd-internal-link text node).
      `${EDITOR_PREFIX} .cm-hmd-internal-link:not(:has(.cm-underline))`,
    ].join(", ");
    rend = `.workspace ${RENDER_PREFIX} a.internal-link, ${RENDER_PREFIX} a.internal-link`;
  } else if (t.key === "external-link") {
    // Same fix as internal-link: target only the leaf text span
    // `.cm-link .cm-underline` (display text) and the rendered anchor.
    // Avoid `.cm-link *` / `.cm-url *` which duplicated background onto
    // container + child. Do NOT target `.cm-url` here — the URL is a
    // separate source-mode token; highlighting it would produce a second
    // span alongside the link text (2 spans per link).
    cm = [
      `${EDITOR_PREFIX} a.external-link`,
      `${EDITOR_PREFIX} .cm-link .cm-underline`,
      `${EDITOR_PREFIX} .cm-link:not(:has(.cm-underline))`,
    ].join(", ");
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
    const names = parseTagFilterNames(filter);
    if (!names.length) {
      // No filter: colors every hashtag — same for "tag" with empty filter
      // and "all-tags" with empty filter. Unified so both appear identical.
      cm = `${EDITOR_PREFIX} .cm-hashtag`;
      rend = `${RENDER_PREFIX} .tag`;
    } else {
      // Obsidian DOES emit per-tag classes `.cm-tag-<name>` on both the
      // hashtag begin/end spans in Live Preview (e.g. `.cm-tag-kill`) and
      // reading view anchors carry `href="#<name>"` (and sometimes `data-tag`).
      // The old `data-tag` selector never matched the actual DOM, so specific
      // tags fell back to JS inline on only the end span while the begin `#`
      // stayed pink -> flicker. Reading view never matched at all.
      // Use class for editor and href/data-tag for reading, with doubled
      // class to outrank the All-Tags rule.
      const cmTag = (n) => {
        const esc = cssClassEscape(n);
        return `${EDITOR_PREFIX} .cm-tag-${esc}.cm-tag-${esc}, ${EDITOR_PREFIX} .cm-hashtag.cm-tag-${esc}`;
      };
      const rendTag = (n) => {
        const esc = n.replace(/"/g, '\\"');
        return [
          `${RENDER_PREFIX} a.tag[href="#${esc}" i]`,
          `${RENDER_PREFIX} .tag[href="#${esc}" i]`,
          `a.tag[href="#${esc}" i]`,
          `.tag[href="#${esc}" i]`,
          `${RENDER_PREFIX} .tag[data-tag*="${esc}" i]`,
          `.tag[data-tag*="${esc}" i]`,
        ].join(", ");
      };
      cm = names.map(cmTag).join(", ");
      rend = names.map(rendTag).join(", ");
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
// For inline-title / tab-title also renders a "contains/exact/starts with/ends with"
// dropdown next to the filter input.
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

  if (cfg.matchField) {
    const wrapper = document.createElement("div");
    wrapper.className = "act-md-element-config-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";
    wrapper.style.flex = "1 1 auto";
    wrapper.style.minWidth = "0";

    const select = document.createElement("select");
    select.className = "act-md-title-match-select dropdown";
    select.style.padding = "6px";
    select.style.borderRadius = "var(--input-radius)";
    select.style.border = "1px solid var(--background-modifier-border)";
    select.style.background = "var(--background-modifier-form-field)";
    select.style.color = "var(--text-normal)";
    select.style.flex = "0 0 auto";
    select.style.minWidth = "120px";
    select.style.textAlign = "center";
    select.style.textAlignLast = "center";
    const t = (k, fb) => {
      try {
        return plugin.t(k, fb);
      } catch (_) {
        return fb;
      }
    };
    select.innerHTML =
      `<option value="contains" style="text-align:center">${t("match_option_contains", "Contains")}</option>` +
      `<option value="exact" style="text-align:center">${t("match_option_exact", "Exact")}</option>` +
      `<option value="startswith" style="text-align:center">${t("match_option_starts_with", "Starts with")}</option>` +
      `<option value="endswith" style="text-align:center">${t("match_option_ends_with", "Ends with")}</option>`;
    const cur = normalizeTitleMatchType(entry[cfg.matchField] || "contains");
    select.value = cur;
    select.title = t("title_match_mode_title", "How the title text must match the filter");
    const selHandler = () => {
      entry[cfg.matchField] = normalizeTitleMatchType(select.value);
      if (onChange) onChange();
    };
    select.addEventListener("change", selHandler);

    wrapper.appendChild(select);
    wrapper.appendChild(input);
    return wrapper;
  }

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

export function titleTextMatches(filter, text, mode) {
  const f = (filter || "").trim().toLowerCase();
  if (!f) return true;
  const raw = (text || "").toLowerCase();
  const tTrim = raw.trim();
  const m = normalizeTitleMatchType(mode);
  if (m === "exact") return tTrim === f;
  if (m === "startswith") return tTrim.startsWith(f);
  if (m === "endswith") return tTrim.endsWith(f);
  return raw.includes(f);
}

// Builds the READING-VIEW (rendered) CSS selector for a markdown entry,
// honoring per-element config (heading levels / task checkbox types).
export function buildRenderedSelector(entry) {
  const t = getMarkdownTarget(entry.targetElement);
  if (!t) return entry.targetElement;
  if (entry.targetElement === "strong") {
    // Isolate bold from bold-italic (same logic as buildMarkdownParts reading selector)
    return `${RENDER_PREFIX} strong:not(:has(em)):not(em strong), strong:not(:has(em)):not(em strong)`;
  }
  if (entry.targetElement === "em") {
    return `${RENDER_PREFIX} em:not(:has(strong)):not(strong em), em:not(:has(strong)):not(strong em)`;
  }
  if (entry.targetElement === "strong-em") {
    // Cover both nesting orders Obsidian may produce for ***text*** / ___text___
    return `${RENDER_PREFIX} strong em, strong em, ${RENDER_PREFIX} em strong, em strong, ${RENDER_PREFIX} strong:has(em), strong:has(em), ${RENDER_PREFIX} em:has(strong), em:has(strong)`;
  }
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
