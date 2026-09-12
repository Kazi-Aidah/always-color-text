/**
 * Bugfix: word group null colors must be ignored so member entries' own
 * colours apply in the editor.
 *
 * Repro (from live data.json): group "Alight Motion Terms" has
 * styleType "both" with polluted textColor/backgroundColor "#000000".
 * Its entries have their own colours (e.g. text "#f07a7a"). After
 * compileWordEntriesLogic the compiled entries carried "#000000", so the
 * editor rendered them black instead of the entries' colours.
 *
 * Correct behaviour: a null (or polluted both-black) group color is ignored
 * and the entries' colours apply. A real group color override still applies.
 */

import { describe, it, expect } from "vitest";
import {
  compileWordEntriesLogic,
  compileTextBgColoringEntriesLogic,
  stripInheritedGroupCssColors,
  resolveGroupColorOverride,
  resolveBorderSourceColor,
} from "./patternCompiler.js";

function makePlugin(settings) {
  return {
    settings,
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
    },
    sanitizePattern: (p) => String(p || "").trim(),
    isKnownProblematicPattern: () => false,
    escapeRegex: (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    validateAndSanitizeRegex: () => true,
    createFastTester: () => () => true,
    _regexCache: {
      clear: () => {},
      getOrCreate: (pattern, flags) => new RegExp(pattern, flags),
    },
    _bloomFilter: null,
    _settingsIndex: null,
    _compiledWordEntries: [],
    _compiledTextBgEntries: [],
    _cachedSortedEntries: null,
    _cacheDirty: false,
    t: (k, d) => d,
  };
}

function compileWithGroup(group, entries) {
  const plugin = makePlugin({
    wordEntries: [],
    wordEntryGroups: [{ ...group, entries }],
    matchType: "contains",
    partialMatch: true,
    caseSensitive: false,
    disableRegexSafety: true,
    enableRegexSupport: false,
  });
  compileWordEntriesLogic(plugin);
  return plugin._compiledWordEntries;
}

function compileTextBgWithGroup(group, entries) {
  const plugin = makePlugin({
    wordEntries: [],
    wordEntryGroups: [{ ...group, entries }],
    matchType: "contains",
    partialMatch: true,
    caseSensitive: false,
    disableRegexSafety: true,
    enableRegexSupport: false,
  });
  compileTextBgColoringEntriesLogic(plugin);
  return plugin._compiledTextBgEntries;
}

describe("group null colors are ignored; entry colours apply", () => {
  it("polluted both-black group colors do not override entry colours", () => {
    const compiled = compileWithGroup(
      {
        uid: "g1",
        name: "Alight Motion Terms",
        active: true,
        styleType: "both",
        textColor: "#000000",
        backgroundColor: "#000000",
        color: "",
      },
      [
        {
          uid: "e1",
          pattern: "helmetina",
          isRegex: false,
          styleType: "text",
          textColor: "#f07a7a",
          color: "",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    const c = compiled[0];
    // Entry's own colours must survive; black pollution must not leak in.
    expect(c.entryRef.textColor).toBe("#f07a7a");
    expect(c.entryRef.backgroundColor).not.toBe("#000000");
    expect(c.textColor).toBe("#f07a7a");
  });

  it("null group colors do not override entry colours", () => {
    const compiled = compileWithGroup(
      {
        uid: "g2",
        name: "null colors",
        active: true,
        styleType: "both",
        textColor: null,
        backgroundColor: null,
        color: "",
      },
      [
        {
          uid: "e2",
          pattern: "pasa",
          isRegex: false,
          styleType: "text",
          textColor: "#965b3b",
          color: "",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    expect(compiled[0].entryRef.textColor).toBe("#965b3b");
    expect(compiled[0].textColor).toBe("#965b3b");
  });

  it("a real group color override still applies to entries", () => {
    // A background override routes entries through the text-bg pipeline;
    // the group colours must arrive there intact.
    const compiled = compileTextBgWithGroup(
      {
        uid: "g3",
        name: "real override",
        active: true,
        styleType: "both",
        textColor: "#2d98da",
        backgroundColor: "#3867d6",
        color: "",
      },
      [
        {
          uid: "e3",
          pattern: "bend",
          isRegex: false,
          styleType: "text",
          textColor: "#fa8231",
          color: "",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    expect(compiled[0].entryRef.textColor).toBe("#2d98da");
    expect(compiled[0].entryRef.backgroundColor).toBe("#3867d6");
  });

  it("text colortype forces group text and strips entry highlights", () => {
    const compiled = compileWithGroup(
      {
        uid: "g5",
        name: "force text",
        active: true,
        styleType: "text",
        color: "#ff0000",
        textColor: null,
        backgroundColor: null,
      },
      [
        {
          uid: "e5",
          pattern: "both-entry",
          isRegex: false,
          styleType: "both",
          textColor: "#2d98da",
          color: "",
          backgroundColor: "#00ff00",
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    const c = compiled[0];
    expect(c.entryRef.styleType).toBe("text");
    expect(c.entryRef.backgroundColor).toBeNull();
    expect(c.textColor).toBe("#ff0000");
  });

  it("text colortype with null group color does not strip entries", () => {
    const compiled = compileWithGroup(
      {
        uid: "g6",
        name: "text but reset",
        active: true,
        styleType: "text",
        color: "",
        textColor: null,
        backgroundColor: null,
      },
      [
        {
          uid: "e6",
          pattern: "keep-both",
          isRegex: false,
          styleType: "text",
          textColor: "#965b3b",
          color: "",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    // Forced-but-reset behaves like per-entry: own colours survive.
    expect(compiled[0].entryRef.styleType).toBe("text");
    expect(compiled[0].textColor).toBe("#965b3b");
  });

  it("highlight colortype forces group bg and clears entry text", () => {
    const compiled = compileTextBgWithGroup(
      {
        uid: "g7",
        name: "force highlight",
        active: true,
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "#3867d6",
      },
      [
        {
          uid: "e7",
          pattern: "text-entry",
          isRegex: false,
          styleType: "text",
          textColor: "#fa8231",
          color: "#fa8231",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    expect(compiled[0].entryRef.styleType).toBe("highlight");
    expect(compiled[0].entryRef.backgroundColor).toBe("#3867d6");
    expect(compiled[0].entryRef.textColor).toBe("currentColor");
  });

  it("highlight colortype with null bg leaves entries alone", () => {
    const compiled = compileTextBgWithGroup(
      {
        uid: "g8",
        name: "highlight but reset",
        active: true,
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: null,
      },
      [
        {
          uid: "e8",
          pattern: "own-bg",
          isRegex: false,
          styleType: "highlight",
          textColor: "currentColor",
          color: "",
          backgroundColor: "#00ff00",
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    expect(compiled[0].entryRef.backgroundColor).toBe("#00ff00");
  });

  it("both with only text narrows to text forcing", () => {
    const compiled = compileWithGroup(
      {
        uid: "g9",
        name: "both text only",
        active: true,
        styleType: "both",
        textColor: "#ff0000",
        color: "",
        backgroundColor: null,
      },
      [
        {
          uid: "e9",
          pattern: "narrow",
          isRegex: false,
          styleType: "text",
          textColor: "#2d98da",
          color: "",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    expect(compiled[0].entryRef.styleType).toBe("text");
    expect(compiled[0].textColor).toBe("#ff0000");
  });

  it("per-entry group layout still applies when set", () => {
    const compiled = compileTextBgWithGroup(
      {
        uid: "g10",
        name: "per-entry layout",
        active: true,
        styleType: undefined,
        textColor: undefined,
        backgroundColor: undefined,
        color: undefined,
        backgroundOpacity: 80,
        highlightBorderRadius: 12,
      },
      [
        {
          uid: "e10",
          pattern: "shaped",
          isRegex: false,
          styleType: "highlight",
          textColor: "currentColor",
          color: "",
          backgroundColor: "#00ff00",
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    // Own colours kept; group layout overrides.
    expect(compiled[0].entryRef.backgroundColor).toBe("#00ff00");
    expect(compiled[0].entryRef.backgroundOpacity).toBe(80);
    expect(compiled[0].entryRef.highlightBorderRadius).toBe(12);
  });

  it("stripInheritedGroupCssColors drops colors but keeps layout", () => {
    const out = stripInheritedGroupCssColors(
      "padding: 2px 4px;\nborder-radius: 6px;\nborder: 2px solid #fa8231;\nbackground-color: rgba(15,185,177,0.31);\ncolor: #fa8231;",
    );
    expect(out).not.toMatch(/(^|;)\s*color\s*:/);
    expect(out).not.toMatch(/(^|;)\s*background-color\s*:/);
    expect(out).toContain("padding: 2px 4px");
    expect(out).toContain("border-radius: 6px");
    expect(out).toContain("currentColor");
    expect(out).not.toContain("#fa8231");
  });

  it("per-entry group css colors do not leak into members", () => {
    const compiled = compileWithGroup(
      {
        uid: "g11",
        name: "stale css",
        active: true,
        styleType: undefined,
        textColor: undefined,
        backgroundColor: undefined,
        color: undefined,
        customCss:
          "padding: 2px 4px;\nborder-radius: 6px;\nborder: 2px solid #fa8231;\nbackground-color: rgba(15,185,177,0.31);\ncolor: #fa8231;",
      },
      [
        {
          uid: "e11",
          pattern: "helmetina",
          isRegex: false,
          styleType: "text",
          textColor: "#f07a7a",
          color: "",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    const css = compiled[0].entryRef.customCss || "";
    // Layout inherits; stale orange/teal do not.
    expect(css).toContain("padding: 2px 4px");
    expect(css).not.toContain("#fa8231");
    expect(css).not.toMatch(/(^|;)\s*color\s*:/);
    expect(css).not.toMatch(/(^|;)\s*background-color\s*:/);
    expect(compiled[0].textColor).toBe("#f07a7a");
  });

  it("resolveGroupColorOverride narrows forced types by availability", () => {
    const isValid = (c) =>
      typeof c === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c.trim());
    // Per-entry: no forcing.
    expect(
      resolveGroupColorOverride({ styleType: undefined }, isValid).type,
    ).toBe("");
    // Forced text with a color.
    expect(
      resolveGroupColorOverride({ styleType: "text", color: "#ff0000" }, isValid)
        .type,
    ).toBe("text");
    // Forced text with reset color: no forcing.
    expect(
      resolveGroupColorOverride(
        { styleType: "text", color: "", textColor: null },
        isValid,
      ).type,
    ).toBe("");
    // Both with only bg narrows to highlight.
    expect(
      resolveGroupColorOverride(
        { styleType: "both", backgroundColor: "#00ff00" },
        isValid,
      ).type,
    ).toBe("highlight");
    // Both-black pollution: no forcing.
    expect(
      resolveGroupColorOverride(
        { styleType: "both", textColor: "#000000", backgroundColor: "#000000" },
        isValid,
      ).type,
    ).toBe("");
  });

  it("per-entry group layout still reaches members with own highlights", () => {
    const compiled = compileTextBgWithGroup(
      {
        uid: "g13",
        name: "layout only",
        active: true,
        styleType: undefined,
        textColor: undefined,
        backgroundColor: undefined,
        color: undefined,
        highlightBorderRadius: 20,
        enableBorderThickness: true,
        borderThickness: 3,
      },
      [
        {
          uid: "e13",
          pattern: "shaped-own-bg",
          isRegex: false,
          styleType: "highlight",
          textColor: "currentColor",
          color: "",
          backgroundColor: "#00ff00",
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    // Own highlight kept; group layout applied regardless of colortype.
    expect(compiled[0].entryRef.backgroundColor).toBe("#00ff00");
    expect(compiled[0].entryRef.highlightBorderRadius).toBe(20);
    expect(compiled[0].entryRef.enableBorderThickness).toBe(true);
    expect(compiled[0].entryRef.borderThickness).toBe(3);
  });

  it("forced text strips highlight/border from member css", () => {
    const compiled = compileWithGroup(
      {
        uid: "g14",
        name: "force text strict",
        active: true,
        styleType: "text",
        color: "#ff0000",
        textColor: null,
        backgroundColor: null,
      },
      [
        {
          uid: "e14",
          pattern: "strict-text",
          isRegex: false,
          styleType: "both",
          textColor: "#2d98da",
          color: "",
          backgroundColor: "#00ff00",
          customCss:
            "color: #2d98da;\nbackground-color: rgba(0,255,0,0.3);\nborder: 2px solid #2d98da;\nborder-radius: 9px;",
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    const ref = compiled[0].entryRef;
    expect(ref.styleType).toBe("text");
    expect(ref.backgroundColor).toBeNull();
    expect(compiled[0].textColor).toBe("#ff0000");
    const css = ref.customCss || "";
    // No highlight, no border from CSS either — layout props survive.
    expect(css).not.toMatch(/(^|;)\s*color\s*:/);
    expect(css).not.toMatch(/(^|;)\s*background-color\s*:/);
    expect(css).not.toMatch(/(^|;)\s*border\s*:/);
    expect(css).not.toMatch(/(^|;)\s*border-(top|bottom|left|right)\s*:/);
    expect(css).toContain("border-radius: 9px");
  });

  it("forced highlight strips text color from member css, borders follow group bg", () => {
    const compiled = compileTextBgWithGroup(
      {
        uid: "g15",
        name: "force highlight strict",
        active: true,
        styleType: "highlight",
        color: "",
        textColor: "currentColor",
        backgroundColor: "#3867d6",
      },
      [
        {
          uid: "e15",
          pattern: "strict-hl",
          isRegex: false,
          styleType: "both",
          textColor: "#fa8231",
          color: "",
          backgroundColor: "#00ff00",
          customCss:
            "color: #fa8231;\nbackground-color: rgba(0,255,0,0.3);\nborder: 2px solid #fa8231;",
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    const ref = compiled[0].entryRef;
    expect(ref.styleType).toBe("highlight");
    expect(ref.textColor).toBe("currentColor");
    expect(ref.backgroundColor).toBe("#3867d6");
    const css = ref.customCss || "";
    expect(css).not.toMatch(/(^|;)\s*color\s*:/);
    expect(css).not.toMatch(/(^|;)\s*background-color\s*:/);
    expect(css).toContain("#3867d6");
    expect(css).not.toContain("#fa8231");
  });

  it("highlight colortype borders follow the background, never text", () => {
    const isValid = (c) =>
      typeof c === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c.trim());
    // Highlight with both colors set: background wins.
    expect(
      resolveBorderSourceColor("highlight", "#ff0000", "#00ff00", isValid),
    ).toBe("#00ff00");
    // Highlight with currentColor text marker: background wins.
    expect(
      resolveBorderSourceColor(
        "highlight",
        "currentColor",
        "#00ff00",
        isValid,
      ),
    ).toBe("#00ff00");
    // Highlight with no background: nothing (callers fall back to black).
    expect(
      resolveBorderSourceColor("highlight", "#ff0000", null, isValid),
    ).toBeNull();
    // Other types unchanged: real text wins, then background.
    expect(resolveBorderSourceColor("both", "#ff0000", "#00ff00", isValid)).toBe(
      "#ff0000",
    );
    expect(resolveBorderSourceColor("text", "#ff0000", null, isValid)).toBe(
      "#ff0000",
    );
    expect(
      resolveBorderSourceColor(undefined, "#ff0000", "#00ff00", isValid),
    ).toBe("#ff0000");
  });

  it("forced group css colors still reach members", () => {
    const compiled = compileWithGroup(
      {
        uid: "g12",
        name: "forced css",
        active: true,
        styleType: "text",
        color: "#ff0000",
        textColor: null,
        backgroundColor: null,
        customCss: "color: #ff0000;",
      },
      [
        {
          uid: "e12",
          pattern: "forced",
          isRegex: false,
          styleType: "text",
          textColor: "#2d98da",
          color: "",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    expect(compiled[0].textColor).toBe("#ff0000");
    // Structured fields (not CSS) carry forced colors; group CSS contributes
    // layout only.
    expect(compiled[0].entryRef.textColor || compiled[0].entryRef.color).toBe(
      "#ff0000",
    );
  });

  it("single black text group color (non-polluted) still overrides", () => {
    const compiled = compileTextBgWithGroup(
      {
        uid: "g4",
        name: "black text on red",
        active: true,
        styleType: "both",
        textColor: "#000000",
        backgroundColor: "#ff0000",
        color: "",
      },
      [
        {
          uid: "e4",
          pattern: "warp",
          isRegex: false,
          styleType: "text",
          textColor: "#2d98da",
          color: "",
          backgroundColor: null,
        },
      ],
    );
    expect(compiled.length).toBeGreaterThan(0);
    // Only the both-black combination is treated as pollution; a deliberate
    // black-on-red override must keep working.
    expect(compiled[0].entryRef.textColor).toBe("#000000");
    expect(compiled[0].entryRef.backgroundColor).toBe("#ff0000");
  });
});
