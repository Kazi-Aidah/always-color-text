import {
  MARKDOWN_TARGETS,
  MARKDOWN_TARGET_GROUPS,
  getMarkdownTarget,
} from "./markdownTargets.js";
import { getTargetPatternText } from "./targetLabels.js";
import { getElementConfig } from "./markdownElementConfig.js";

// Sizes a <select> to the width of its *currently selected* label text (plus a
// little room for the arrow), rather than the widest option in the list. This
// keeps the dropdown compact next to the config input.
function fitSelectToText(select) {
  const opt = select.options && select.options[select.selectedIndex];
  const text = opt ? opt.textContent : "";
  if (!text) return;
  let w = 0;
  try {
    const cs = typeof getComputedStyle === "function" ? getComputedStyle(select) : null;
    if (cs && cs.fontFamily) {
      const span = document.createElement("span");
      span.style.fontFamily = cs.fontFamily;
      span.style.fontSize = cs.fontSize;
      span.style.fontWeight = cs.fontWeight;
      span.style.position = "absolute";
      span.style.visibility = "hidden";
      span.style.whiteSpace = "nowrap";
      span.textContent = text;
      document.body.appendChild(span);
      w = span.offsetWidth + 30;
      document.body.removeChild(span);
    }
  } catch (e) {
    w = 0;
  }
  if (!w) w = text.length * 8 + 30;
  select.style.width = w + "px";
}

// Creates a native <select> dropdown (grouped via optgroups) that shows the
// current markdown target element. Changing it switches the entry to a
// different markdown element (Bold -> Italic, etc.). The entry is mutated in
// place and `onChange` is invoked so the caller can persist/re-render.
export function createMarkdownElementButton(app, plugin, entry, onChange) {
  const select = document.createElement("select");
  select.className = "act-md-element-select dropdown";

  // When a per-element config input is rendered beside this dropdown, size the
  // dropdown to its label text and let the input take the remaining width.
  // Otherwise, make the dropdown full width.
  const hasConfig = !!getElementConfig(entry.targetElement);
  select.style.padding = "6px 10px";
  select.style.borderRadius = "var(--input-radius)";
  select.style.border = "1px solid var(--background-modifier-border)";
  select.style.background = "var(--background-modifier-form-field)";
  select.style.color = "var(--text-normal)";
  select.style.cursor = "pointer";
  select.style.maxWidth = "100%";
  // Preserve a visible field shadow (Obsidian's `.dropdown` look) — forcing a
  // solid background above can otherwise make the native shadow disappear.
  select.style.boxShadow = "var(--input-shadow, 0 1px 0 rgba(0, 0, 0, 0.05))";

  if (hasConfig) {
    select.style.flex = "0 0 auto";
    select.style.minWidth = "0";
    select.style.width = "auto";
  } else {
    select.style.flex = "1 1 auto";
    select.style.width = "100%";
  }

  MARKDOWN_TARGET_GROUPS.forEach((grp) => {
    const targets = MARKDOWN_TARGETS.filter((t) => t.group === grp.key);
    if (!targets.length) return;
    const og = document.createElement("optgroup");
    og.label = plugin.t(grp.labelKey, grp.label);
    targets.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.key;
      opt.textContent = plugin.t(t.labelKey, t.label);
      if (t.key === entry.targetElement) opt.selected = true;
      og.appendChild(opt);
    });
    select.appendChild(og);
  });

  // Safety: if the current target is not part of any group, surface it anyway.
  if (!getMarkdownTarget(entry.targetElement)) {
    const opt = document.createElement("option");
    opt.value = entry.targetElement || "";
    opt.textContent = String(
      entry.targetElement || plugin.t("type_markdown", "Markdown Element"),
    );
    opt.selected = true;
    select.appendChild(opt);
  }

  // Fit to the selected label, then re-fit whenever the selection changes.
  try {
    fitSelectToText(select);
  } catch (e) {}

  select.addEventListener("change", () => {
    const newKey = select.value;
    if (!newKey || newKey === entry.targetElement) return;
    entry.targetElement = newKey;
    entry.isRegex = false;
    entry.affectMarkElements = false;
    const t = getMarkdownTarget(newKey);
    entry.presetLabel = plugin.t(t ? t.labelKey : "type_markdown", t ? t.label : newKey);
    entry.pattern = getTargetPatternText(plugin, newKey, false);
    try {
      fitSelectToText(select);
    } catch (e) {}
    if (typeof onChange === "function") onChange();
  });

  return select;
}
