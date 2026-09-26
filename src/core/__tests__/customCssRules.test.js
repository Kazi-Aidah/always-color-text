/**
 * Feature: custom-css-blocks
 *
 * Unit tests for src/core/customCssRules.js — comment stripping, `&`-rooted
 * pseudo-block parsing/validation, scope marker/var machinery, stylesheet
 * emission and modal validation.
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

import {
  stripCssComments,
  splitCustomCss,
  isSafeBlockSelector,
  hasPseudoElement,
  sanitizeDeclString,
  parseDeclPairs,
  blockDeclProperties,
  scopeToken,
  scopeMarkerProp,
  scopeVarName,
  scopeMarkerSelector,
  applyScopeToStyleString,
  applyCustomCssToElementCore,
  buildScopedBlockRules,
  buildSelectorBlockRules,
  validateCustomCssInput,
  reassembleCustomCss,
} from "../customCssRules.js";
import { stripInheritedGroupCssColors } from "../../services/patternCompiler.js";

/* Minimal fake element — only what applyCustomCssToElementCore touches. */
function makeEl(initial = {}) {
  const store = new Map(
    Object.entries(initial).map(([k, v]) => [k, { v, prio: "important" }]),
  );
  return {
    _store: store,
    style: {
      setProperty(p, v, prio) {
        store.set(p, { v, prio: prio || "" });
      },
      getPropertyValue(p) {
        const e = store.get(p);
        return e ? e.v : "";
      },
    },
  };
}

describe("stripCssComments", () => {
  it("removes comments and keeps declarations", () => {
    const out = stripCssComments("color: red; /* note */ padding: 2px;");
    expect(out.replace(/\s+/g, " ")).toBe("color: red; padding: 2px;");
    expect(out).not.toContain("note");
  });

  it("preserves comment-like text inside quoted strings", () => {
    const src = `content: "/* not a comment */";`;
    expect(stripCssComments(src)).toBe(src);
  });

  it("swallows an unterminated comment to end of input", () => {
    const out = stripCssComments("color: red; /* never closed");
    expect(out.startsWith("color: red;")).toBe(true);
    expect(out).not.toContain("never");
  });

  it("collects raw comment texts into a sink array", () => {
    const sink = [];
    stripCssComments("a: 1; /* one */ b: 2; /* two */", sink);
    expect(sink).toEqual(["/* one */", "/* two */"]);
  });

  it("is idempotent (property)", () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const once = stripCssComments(s);
        return stripCssComments(once) === once;
      }),
    );
  });
});

describe("splitCustomCss", () => {
  it("returns declarations untouched when there are no blocks", () => {
    const r = splitCustomCss("color: red;\nbackground-color: #000;");
    expect(r.decls).toBe("color: red;\nbackground-color: #000;");
    expect(r.blocks).toEqual([]);
    expect(r.errors).toEqual([]);
  });

  it("splits a &-block out of the declaration stream", () => {
    const r = splitCustomCss("color: red;\n&:hover {\n  color: blue;\n}");
    expect(r.decls).toBe("color: red;");
    expect(r.blocks).toHaveLength(1);
    expect(r.blocks[0].selector).toBe("&:hover");
    expect(r.blocks[0].body).toBe("color: blue;");
    expect(r.blocks[0].raw).toBe("&:hover {\n  color: blue;\n}");
  });

  it("keeps declarations that follow a block", () => {
    const r = splitCustomCss("&:hover { color: blue; } padding: 2px;");
    expect(r.decls).toBe(" padding: 2px;");
    expect(r.blocks).toHaveLength(1);
    expect(r.blocks[0].selector).toBe("&:hover");
  });

  it("strips comments and collects them separately", () => {
    const r = splitCustomCss("/* hi */ color: red; /* there */");
    expect(r.decls).not.toContain("hi");
    expect(r.decls).not.toContain("there");
    expect(r.comments).toEqual(["/* hi */", "/* there */"]);
  });

  it("reports an unclosed block", () => {
    const r = splitCustomCss("color: red; &:hover { color: blue;");
    expect(r.errors.join(" ")).toMatch(/Unclosed/);
    expect(r.blocks).toEqual([]);
  });

  it("reports nested blocks", () => {
    const r = splitCustomCss("&:hover { &::after { content: \"\"; } }");
    expect(r.errors.join(" ")).toMatch(/Nested blocks/);
    expect(r.blocks).toHaveLength(1);
  });

  it("reports a stray closing brace", () => {
    const r = splitCustomCss("color: red; }");
    expect(r.errors.join(" ")).toMatch(/mismatched braces/);
    expect(r.decls).toBe("color: red; ");
  });

  it("does not treat braces inside quoted strings as blocks", () => {
    const r = splitCustomCss('content: "{"; color: red;');
    expect(r.blocks).toEqual([]);
    expect(r.decls).toBe('content: "{"; color: red;');
  });
});

describe("isSafeBlockSelector", () => {
  const ok = [
    "&:hover",
    "&:active",
    "&:focus",
    "&:focus-visible",
    "&:visited",
    "&::before",
    "&::after",
    "&:before",
    "&:hover::after",
    "&:focus::before",
    "&:nth-child(2n)",
    "&:nth-child(2n + 1)",
    "&:nth-last-of-type(3)",
    "&:lang(en-US)",
    "&:dir(rtl)",
    "&:hover, &:focus",
    "  &::after  ",
  ];
  it.each(ok)("accepts %s", (s) => {
    expect(isSafeBlockSelector(s)).toBe(true);
  });

  const bad = [
    "",
    "&",
    "div:hover",
    "& .child",
    "& > span",
    "& + span",
    "& ~ span",
    "&.cls",
    "#id:hover",
    "&[data-x]",
    "&:has(div)",
    "&:is(:hover)",
    "&:not(.foo)",
    "&:where(.a)",
    "@media screen",
    "@media (hover: hover) { &",
    "&:hover, div",
    "& :hover",
    "&:nth-child(2n of .foo)",
    "&:hover { color: red",
    null,
    42,
  ];
  it.each(bad)("rejects %j", (s) => {
    expect(isSafeBlockSelector(s)).toBe(false);
  });
});

describe("hasPseudoElement", () => {
  it("detects double-colon and legacy single-colon pseudo-elements", () => {
    expect(hasPseudoElement("&::after")).toBe(true);
    expect(hasPseudoElement("&:after")).toBe(true);
    expect(hasPseudoElement("&:before")).toBe(true);
    expect(hasPseudoElement("&:first-line")).toBe(true);
    expect(hasPseudoElement("&:hover::after")).toBe(true);
  });
  it("detects pseudo-classes as not pseudo-elements", () => {
    expect(hasPseudoElement("&:hover")).toBe(false);
    expect(hasPseudoElement("&:focus-visible")).toBe(false);
    expect(hasPseudoElement("&:nth-child(2n)")).toBe(false);
  });
});

describe("sanitizeDeclString", () => {
  it("keeps safe declarations and lowercases properties", () => {
    expect(sanitizeDeclString("Color: red; padding: 2px;")).toBe(
      "color: red; padding: 2px;",
    );
  });

  it("strips user-supplied !important", () => {
    expect(sanitizeDeclString("color: red !important;")).toBe("color: red;");
  });

  it("drops dangerous values", () => {
    expect(sanitizeDeclString("background: url(x.png);")).toBe("");
    expect(sanitizeDeclString("color: expression(alert(1));")).toBe("");
    expect(sanitizeDeclString("content: '<script>';")).toBe("");
    expect(sanitizeDeclString("behavior: url(#x);")).toBe("");
  });

  it("drops invalid property names and colonless junk", () => {
    expect(sanitizeDeclString("1bad: red")).toBe("");
    expect(sanitizeDeclString("not a declaration")).toBe("");
  });

  it("collapses newlines inside values (semicolon-only splitting)", () => {
    expect(
      sanitizeDeclString("background: linear-gradient(\nto right,\nred,\nblue\n)"),
    ).toBe("background: linear-gradient( to right, red, blue );");
  });
});

describe("parseDeclPairs / blockDeclProperties", () => {
  it("parses pairs with lowercased properties", () => {
    expect(parseDeclPairs("Color: Red ; padding:2px")).toEqual([
      { prop: "color", val: "Red" },
      { prop: "padding", val: "2px" },
    ]);
  });

  it("collects properties from safe pseudo-class blocks only", () => {
    const { blocks } = splitCustomCss(`
      color: red;
      &:hover { background-color: #000; transform: scale(1.1); }
      &::after { content: ""; color: blue; }
      &:has(div) { color: green; }
    `);
    const props = blockDeclProperties(blocks);
    expect(props.has("background-color")).toBe(true);
    expect(props.has("transform")).toBe(true);
    // pseudo-element block never touches the element's own declarations
    expect(props.has("content")).toBe(false);
    // unsafe selector block is ignored
    expect(props.has("color")).toBe(false);
  });
});

describe("scope naming", () => {
  it("sanitizes tokens", () => {
    expect(scopeToken("e123")).toBe("e123");
    expect(scopeToken("g/a b")).toBe("g_a_b");
    expect(scopeToken(null)).toBeNull();
    expect(scopeToken(undefined)).toBeNull();
    expect(scopeToken("")).toBeNull();
  });

  it("builds marker/var names without prefix collisions (e1 vs e10)", () => {
    const m1 = scopeMarkerProp(scopeToken("e1"));
    const m10 = scopeMarkerProp(scopeToken("e10"));
    expect(m1).toBe("--act-hov-e1-_s");
    expect(m10).not.toContain(m1.replace(/_s$/, ""));
    // scopeMarkerSelector for e1 must not match styles carrying only e10's marker
    const s1 = scopeMarkerSelector("e1");
    expect(s1).toBe('[style*="--act-hov-e1-"]');
    expect(m10).not.toContain("--act-hov-e1-");
    expect(m1).toContain("--act-hov-e1-");
  });

  it("builds var names from properties", () => {
    expect(scopeVarName("e9", "background-color")).toBe(
      "--act-hov-e9-background-color",
    );
  });
});

describe("applyScopeToStyleString", () => {
  it("is a no-op without a scope id", () => {
    const s = "color: red !important";
    expect(applyScopeToStyleString(s, "&:hover { color: blue; }", null)).toBe(s);
  });

  it("is a no-op when the CSS has no blocks", () => {
    const s = "color: red !important";
    expect(applyScopeToStyleString(s, "color: blue;", "e1")).toBe(s);
  });

  it("wraps touched properties in the scope var, keeping !important", () => {
    const out = applyScopeToStyleString(
      "color: red !important",
      "&:hover { color: blue; }",
      "e1",
      "",
    );
    expect(out).toContain("color: var(--act-hov-e1-color, red) !important");
    expect(out).toContain("--act-hov-e1-_s: 1");
  });

  it("appends the marker exactly once", () => {
    const out = applyScopeToStyleString(
      "color: red !important",
      "&:hover { color: blue; }",
      "e1",
      "",
    );
    expect(out.split("--act-hov-e1-_s").length - 1).toBe(1);
  });

  it("leaves untouched properties alone", () => {
    const out = applyScopeToStyleString(
      "padding: 2px !important; color: red !important",
      "&:hover { color: blue; }",
      "e1",
      "",
    );
    expect(out).toContain("padding: 2px !important");
    expect(out).not.toContain("padding: var(");
  });

  it("nests an earlier scope's var as fallback when touched", () => {
    const prev = "color: var(--act-hov-g1-color, red) !important; --act-hov-g1-_s: 1";
    const out = applyScopeToStyleString(
      prev,
      "&:hover { color: blue; }",
      "e2",
      prev,
    );
    expect(out).toContain(
      "color: var(--act-hov-e2-color, var(--act-hov-g1-color, red)) !important",
    );
  });

  it("keeps an earlier scope's var alive when this scope only overrides the base", () => {
    const prev = "color: var(--act-hov-g1-color, red) !important; --act-hov-g1-_s: 1";
    const out = applyScopeToStyleString(
      "--act-hov-g1-_s: 1; color: green !important",
      "color: green;",
      "e2",
      prev,
    );
    expect(out).toContain("color: var(--act-hov-g1-color, green) !important");
    // No state rules for this scope → no marker (matches applyCustomCssToElementCore).
    expect(out).not.toContain("--act-hov-e2-_s");
    // The earlier scope's marker survives untouched.
    expect(out).toContain("--act-hov-g1-_s: 1");
  });

  it("does not double-wrap a value that already carries the scope var", () => {
    const out = applyScopeToStyleString(
      "color: var(--act-hov-e1-color, red) !important",
      "&:hover { color: blue; }",
      "e1",
      "",
    );
    // Re-wrapping happens only for the merged (plain) base; a value that is
    // already routed through this scope's var must keep a single level.
    expect(out.match(/--act-hov-e1-color/g)).toHaveLength(1);
  });
});

describe("applyCustomCssToElementCore", () => {
  it("applies declarations with important priority", () => {
    const el = makeEl();
    const r = applyCustomCssToElementCore(el, "color: red; padding: 2px;", null);
    expect(r.declCount).toBe(2);
    expect(el._store.get("color")).toEqual({ v: "red", prio: "important" });
    expect(el._store.get("padding")).toEqual({ v: "2px", prio: "important" });
  });

  it("stamps the scope marker when blocks are present", () => {
    const el = makeEl({ color: "red" });
    const r = applyCustomCssToElementCore(el, "&:hover { color: blue; }", "e7");
    expect(r.blockCount).toBe(1);
    expect(el._store.get(scopeMarkerProp("e7"))).toBeTruthy();
  });

  it("wraps a derived (base) property touched by a block", () => {
    const el = makeEl({ "background-color": "rgba(0,0,0,0.3)" });
    applyCustomCssToElementCore(el, "&:hover { background-color: red; }", "e7");
    expect(el._store.get("background-color").v).toBe(
      "var(--act-hov-e7-background-color, rgba(0,0,0,0.3))",
    );
    expect(el._store.get("background-color").prio).toBe("important");
  });

  it("wraps declared properties touched by a block", () => {
    const el = makeEl();
    applyCustomCssToElementCore(
      el,
      "color: green;\n&:hover { color: blue; }",
      "e7",
    );
    expect(el._store.get("color").v).toBe("var(--act-hov-e7-color, green)");
  });

  it("preserves an earlier scope's var chain when overriding the base only", () => {
    const el = makeEl({ color: "var(--act-hov-g1-color, red)" });
    applyCustomCssToElementCore(el, "color: green;", "e2");
    expect(el._store.get("color").v).toBe("var(--act-hov-g1-color, green)");
  });

  it("blocks-only CSS stamps the marker without declarations", () => {
    const el = makeEl({ color: "red" });
    const r = applyCustomCssToElementCore(el, "/* only */ &:after { content: \"\"; }", "e7");
    expect(r.declCount).toBe(0);
    expect(r.blockCount).toBe(1);
    expect(el._store.get(scopeMarkerProp("e7"))).toBeTruthy();
    expect(el._store.get("color").v).toBe("red"); // untouched
  });
});

describe("buildScopedBlockRules", () => {
  it("emits marker-scoped var + direct halves for pseudo-class blocks", () => {
    const css = "color: red;\n&:hover { color: blue; }";
    const out = buildScopedBlockRules(css, "e1");
    expect(out).toContain('[style*="--act-hov-e1-"]:hover');
    expect(out).toContain("--act-hov-e1-color: blue");
    expect(out).toContain("color: blue !important");
    // base declarations never leak into scoped rules
    expect(out).not.toMatch(/\{[^}]*red/);
  });

  it("emits direct-only rules for pseudo-element blocks", () => {
    const out = buildScopedBlockRules('&::after { content: ""; background: red; }', "e1");
    expect(out).toContain('[style*="--act-hov-e1-"]::after');
    expect(out).toContain('content: "" !important');
    expect(out).not.toContain("--act-hov-e1-content");
  });

  it("marks every selector of a comma list", () => {
    const out = buildScopedBlockRules("&:hover, &:focus { color: blue; }", "e1");
    expect(out).toContain('[style*="--act-hov-e1-"]:hover');
    expect(out).toContain('[style*="--act-hov-e1-"]:focus');
    expect(out).toContain("{");
  });

  it("skips unsafe selectors and dangerous values", () => {
    const out = buildScopedBlockRules(
      "&:has(div) { color: red; }\n&:hover { background: url(x); }",
      "e1",
    );
    expect(out).not.toContain(":has");
    expect(out).not.toContain("url");
    expect(out).not.toContain("background");
  });

  it("returns an empty string without blocks or scope", () => {
    expect(buildScopedBlockRules("color: red;", "e1")).toBe("");
    expect(buildScopedBlockRules("&:hover { color: red; }", null)).toBe("");
  });
});

describe("buildSelectorBlockRules", () => {
  it("rewrites & to the base selector with !important", () => {
    const out = buildSelectorBlockRules("&:hover { color: blue; }", "div.cm-line.x");
    expect(out).toContain("div.cm-line.x:hover");
    expect(out).toContain("color: blue !important");
  });

  it("handles a comma base selector via cross product", () => {
    const out = buildSelectorBlockRules("&:hover, &:focus { color: blue; }", ".a, .b");
    expect(out).toContain(".a:hover");
    expect(out).toContain(".b:hover");
    expect(out).toContain(".a:focus");
    expect(out).toContain(".b:focus");
  });

  it("skips unsafe selectors", () => {
    expect(buildSelectorBlockRules("&:has(div) { color: red; }", ".x")).toBe("");
    expect(buildSelectorBlockRules("color: red;", ".x")).toBe("");
    expect(buildSelectorBlockRules("&:hover { color: red; }", "")).toBe("");
  });
});

describe("validateCustomCssInput", () => {
  it("returns no warnings for empty input or plain declarations", () => {
    expect(validateCustomCssInput("")).toEqual([]);
    expect(validateCustomCssInput("   ")).toEqual([]);
    expect(validateCustomCssInput("color: red; padding: 2px;")).toEqual([]);
  });

  it("ignores comments, including dangerous-looking text inside them", () => {
    expect(
      validateCustomCssInput("/* url(evil) <script> { */ color: red;"),
    ).toEqual([]);
  });

  it("accepts safe &-blocks", () => {
    expect(
      validateCustomCssInput("color: red;\n&:hover { color: blue; }\n&::after { content: \"\"; }"),
    ).toEqual([]);
  });

  it("warns on an unsupported block selector", () => {
    const w = validateCustomCssInput("div:hover { color: red; }");
    expect(w.join("\n")).toMatch(/Unsupported block selector/);
    expect(w.join("\n")).toMatch(/div:hover/);
  });

  it("warns on invalid property names (historical message prefix)", () => {
    const w = validateCustomCssInput("1bad: red");
    expect(w.join("\n")).toMatch(/Invalid property name/);
  });

  it("warns on dangerous values, including inside blocks", () => {
    const w = validateCustomCssInput("color: red;\n&:hover { background: url(x); }");
    expect(w.join("\n")).toMatch(/Dangerous value in "background"/);
    expect(w.join("\n")).toMatch(/in block "&:hover"/);
  });

  it("warns on an unclosed block", () => {
    const w = validateCustomCssInput("&:hover { color: blue;");
    expect(w.join("\n")).toMatch(/Unclosed/);
  });
});

describe("reassembleCustomCss", () => {
  it("appends blocks and comments after rebuilt declarations", () => {
    const split = splitCustomCss("color: red; /* keep */\n&:hover { color: blue; }");
    const out = reassembleCustomCss(split, "color: green;");
    expect(out).toContain("color: green;");
    expect(out).toContain("&:hover { color: blue; }");
    expect(out).toContain("/* keep */");
  });

  it("round-trips declaration-only input", () => {
    const src = "color: red; padding: 2px;";
    const split = splitCustomCss(src);
    expect(reassembleCustomCss(split, split.decls.trim())).toBe(src);
  });
});

describe("stripInheritedGroupCssColors with blocks", () => {
  it("keeps blocks, strips top-level colors", () => {
    const out = stripInheritedGroupCssColors(
      "padding: 2px; color: #fa8231; &:hover { color: #fa8231; padding: 4px; }",
    );
    expect(out).not.toMatch(/(^|;)\s*color\s*:/);
    expect(out).toContain("padding: 2px");
    expect(out).toContain("&:hover{");
    expect(out).toContain("padding: 4px");
    expect(out).not.toContain("#fa8231");
  });

  it("keeps layout-only block colors' structure when border is dropped", () => {
    const out = stripInheritedGroupCssColors(
      "color: #fff; &::after { border: 2px solid #fa8231; content: \"\"; }",
      "currentColor",
      { dropBorder: true },
    );
    expect(out).toContain('&::after{');
    expect(out).toContain('content: ""');
    expect(out).not.toContain("border");
  });

  it("behavior on declaration-only input is unchanged", () => {
    const out = stripInheritedGroupCssColors("padding: 2px;\nborder-radius: 6px;");
    expect(out).toBe("padding: 2px;\nborder-radius: 6px;");
  });
});

describe("properties", () => {
  it("safe declaration strings round-trip through split", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[^{}/*]*$/),
        (s) => {
          const r = splitCustomCss(s);
          expect(r.blocks).toEqual([]);
          expect(r.decls).toBe(s);
        },
      ),
    );
  });

  it("sanitizer round-trips generated safe declarations", () => {
    const prop = fc.stringMatching(/^[a-z][a-z-]{0,15}$/);
    const val = fc.stringMatching(/^[a-z0-9][a-z0-9 #%,-]{0,29}$/);
    fc.assert(
      fc.property(
        fc.array(fc.record({ prop, val }), { minLength: 1, maxLength: 6 }),
        (pairs) => {
          const src = pairs.map((p) => `${p.prop}: ${p.val}`).join("; ") + ";";
          const parsed = parseDeclPairs(sanitizeDeclString(src));
          expect(parsed).toEqual(
            pairs.map((p) => ({ prop: p.prop, val: p.val.trim() })),
          );
        },
      ),
    );
  });
});
