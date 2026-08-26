// Central registry of Obsidian markdown elements that can be "targeted" for
// coloring. Each entry maps a stable `key` to:
//   - i18n label info (labelKey + default label)
//   - group:       logical grouping used to build the dropdown's optgroups
//   - cmSelector:    the CodeMirror / live-preview selector used by the
//                    injected-editor-stylesheet path (applyFormattingStyles)
//   - renderedSelector: the reading-mode / rendered DOM selector used by the
//                    inline-highlight path (applyElementHighlights)
//
// This replaces the old hardcoded strong/em/strong-em list so that the "Markdown
// Element" matcher type can target any of these without a regex magic string.

export const MARKDOWN_TARGETS = [
  // --- Text Formatting ---
  {
    key: "heading",
    labelKey: "target_heading",
    label: "Heading",
    group: "text",
    cmSelector: ".cm-header",
    renderedSelector:
      "h1, h2, h3, h4, h5, h6, .markdown-rendered h1, .markdown-rendered h2, .markdown-rendered h3, .markdown-rendered h4, .markdown-rendered h5, .markdown-rendered h6",
  },
  {
    key: "strong",
    labelKey: "target_strong",
    label: "Bold",
    group: "text",
    cmSelector: ".cm-strong",
    renderedSelector: "strong, .markdown-rendered strong",
  },
  {
    key: "em",
    labelKey: "target_em",
    label: "Italic",
    group: "text",
    cmSelector: ".cm-em",
    renderedSelector: "em, .markdown-rendered em",
  },
  {
    key: "strong-em",
    labelKey: "target_strong_em",
    label: "Bold Italic",
    group: "text",
    cmSelector: ".cm-strong.cm-em",
    renderedSelector: "strong em, .markdown-rendered strong em",
  },
  {
    key: "strikethrough",
    labelKey: "target_strikethrough",
    label: "Strikethrough",
    group: "text",
    cmSelector: ".cm-strikethrough",
    renderedSelector: "del, s, .markdown-rendered del",
  },
  {
    key: "highlight",
    labelKey: "target_highlight",
    label: "Highlight",
    group: "text",
    cmSelector: ".cm-highlight",
    renderedSelector: "mark, .markdown-rendered mark",
  },
  {
    key: "inline-code",
    labelKey: "target_inline_code",
    label: "Inline Code",
    group: "text",
    cmSelector: ".cm-inline-code",
    renderedSelector: "code, .markdown-rendered code",
  },
  {
    key: "codeblock",
    labelKey: "target_codeblock",
    label: "Code Block",
    group: "text",
    cmSelector: ".HyperMD-codeblock",
    renderedSelector: "pre code, .markdown-rendered pre code",
  },
  {
    key: "comment",
    labelKey: "target_comment",
    label: "Comment",
    group: "text",
    cmSelector: ".cm-comment",
    renderedSelector: "",
  },
  // --- Links ---
  {
    key: "internal-link",
    labelKey: "target_internal_link",
    label: "Internal Link",
    group: "links",
    cmSelector: ".cm-hmd-internal-link",
    renderedSelector: "a.internal-link, .markdown-rendered a.internal-link",
  },
  {
    key: "external-link",
    labelKey: "target_external_link",
    label: "External Link",
    group: "links",
    cmSelector: ".cm-link",
    renderedSelector: "a.external-link, .markdown-rendered a.external-link",
  },
  // --- Lists ---
  {
    key: "bullet-list",
    labelKey: "target_bullet_list",
    label: "Bullet Lists",
    group: "lists",
    cmSelector: ".cm-formatting-list-ul ~ .cm-list-1",
    renderedSelector: "ul li, .markdown-rendered ul li",
  },
  {
    key: "numbered-list",
    labelKey: "target_numbered_list",
    label: "Numbered Lists",
    group: "lists",
    cmSelector: ".cm-formatting-list-ol ~ .cm-list-1",
    renderedSelector: "ol li, .markdown-rendered ol li",
  },
  {
    key: "task-list",
    labelKey: "target_task_list",
    label: "Checkbox / Task List",
    group: "lists",
    cmSelector: ".HyperMD-task-line .cm-list-1",
    renderedSelector: "li.task-list-item, .markdown-rendered li.task-list-item",
  },
  // --- Other ---
  {
    key: "blockquote",
    labelKey: "target_blockquote",
    label: "Blockquote",
    group: "other",
    cmSelector: ".cm-quote",
    renderedSelector: "blockquote, .markdown-rendered blockquote",
  },
  {
    key: "tag",
    labelKey: "target_tag",
    label: "Tag",
    group: "other",
    cmSelector: ".cm-hashtag",
    renderedSelector: ".tag, .markdown-rendered .tag",
  },
  {
    key: "all-tags",
    labelKey: "target_all_tags",
    label: "All Tags",
    group: "other",
    cmSelector: ".cm-hashtag",
    renderedSelector: ".tag, .markdown-rendered .tag",
  },
  {
    key: "tab-title",
    labelKey: "target_tab_title",
    label: "Tab Title",
    group: "other",
    cmSelector: ".workspace-tab-header-inner-title",
    renderedSelector: ".workspace-tab-header-inner-title",
  },
  {
    key: "inline-title",
    labelKey: "target_inline_title",
    label: "Inline Title",
    group: "other",
    cmSelector: ".inline-title",
    renderedSelector: ".inline-title",
  },
];

// Ordered groups used to build the dropdown's optgroups.
export const MARKDOWN_TARGET_GROUPS = [
  { key: "text", labelKey: "target_group_text", label: "Text Formatting" },
  { key: "links", labelKey: "target_group_links", label: "Links" },
  { key: "lists", labelKey: "target_group_lists", label: "Lists" },
  { key: "other", labelKey: "target_group_other", label: "Other" },
];

const BY_KEY = Object.fromEntries(MARKDOWN_TARGETS.map((t) => [t.key, t]));

export function getMarkdownTarget(key) {
  return BY_KEY[String(key)] || null;
}

// Returns the CSS selector to use for the editor (cm) path.
export function getCmSelector(key) {
  const t = getMarkdownTarget(key);
  return t ? t.cmSelector : null;
}

// Returns the CSS selector to use for the reading / rendered path.
export function getRenderedSelector(key) {
  const t = getMarkdownTarget(key);
  return t ? t.renderedSelector : null;
}
