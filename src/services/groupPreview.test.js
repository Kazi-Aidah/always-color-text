/**
 * Group settings-row preview paints through the same member pipeline the
 * compiler uses, so the "Text" sample can never disagree with the editor:
 * forced colortypes show group colors, legacy groups override colors while
 * members keep their type, per-entry groups show member colors, and layout
 * always comes from the group (falling back to the member, like the editor).
 */

import { describe, it, expect } from "vitest";
import { applyGroupPreviewStyle } from "./patternCompiler.js";

function makePreviewEl() {
  const important = {};
  const el = {
    style: {
      cssText: "",
      setProperty(p, v) {
        important[p] = String(v);
      },
      removeProperty(p) {
        delete important[p];
      },
    },
    _important: important,
  };
  return el;
}

function makePlugin(settings = {}) {
  const calls = { highlightParamsWith: [], borderWith: [], rgbaWith: [] };
  const isValidHexColor = (hex) => {
    if (hex === "inherit" || hex === "currentColor") return true;
    if (typeof hex !== "string") return false;
    return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
  };
  return {
    calls,
    settings: Object.assign(
      {
        backgroundOpacity: 25,
        highlightBorderRadius: 8,
        highlightHorizontalPadding: 4,
        highlightVerticalPadding: 0,
      },
      settings,
    ),
    isValidHexColor,
    getHighlightParams: (entry) => {
      calls.highlightParamsWith.push(entry);
      return {
        opacity:
          entry && typeof entry.backgroundOpacity === "number"
            ? entry.backgroundOpacity
            : 25,
        radius:
          entry && typeof entry.highlightBorderRadius === "number"
            ? entry.highlightBorderRadius
            : 8,
        hPad:
          entry && typeof entry.highlightHorizontalPadding === "number"
            ? entry.highlightHorizontalPadding
            : 4,
        vPad:
          entry && typeof entry.highlightVerticalPadding === "number"
            ? entry.highlightVerticalPadding
            : 0,
        enableBorder:
          entry && typeof entry.enableBorderThickness !== "undefined"
            ? !!entry.enableBorderThickness
            : false,
      };
    },
    hexToRgba: (hex, op) => {
      calls.rgbaWith.push([hex, op]);
      return `rgba(${hex},${op})`;
    },
    generateBorderStyle: (t, b, entry) => {
      calls.borderWith.push([t, b]);
      const enabled =
        entry && typeof entry.enableBorderThickness !== "undefined"
          ? !!entry.enableBorderThickness
          : false;
      if (!enabled) return "";
      const src =
        t && t !== "currentColor" && isValidHexColor(t)
          ? t
          : b && isValidHexColor(b)
            ? b
            : null;
      return src ? `border: 2px solid ${src};` : "";
    },
    getCornerShapeCss: () => "",
    groupCssForMembers: () => "",
    sanitizeCssDeclarations: (css) => css,
  };
}

describe("applyGroupPreviewStyle", () => {
  it("forced text shows the group text color only (no highlight, no border)", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(
      plugin,
      el,
      {
        styleType: "text",
        textColor: "#eb3b5a",
        backgroundColor: "#00ff00",
        enableBorderThickness: true,
        entries: [{ uid: "e1", color: "#111111", styleType: "text" }],
      },
    );
    expect(el.style.color).toBe("#eb3b5a");
    expect(el.style.backgroundColor).toBe("transparent");
    expect(el.style.cssText).not.toContain("border:");
  });

  it("forced highlight shows the group background with a background-following border", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(
      plugin,
      el,
      {
        styleType: "highlight",
        textColor: "#eb3b5a",
        backgroundColor: "#fa8231",
        backgroundOpacity: 60,
        enableBorderThickness: true,
        entries: [{ uid: "e1", color: "#111111", styleType: "text" }],
      },
    );
    expect(el.style.color).toBe("");
    expect(el.style.backgroundColor).toBe("rgba(#fa8231,60)");
    expect(el.style.cssText).toContain("border: 2px solid #fa8231;");
  });

  it("forced both shows both group colors with a text-following border", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(
      plugin,
      el,
      {
        styleType: "both",
        textColor: "#eb3b5a",
        backgroundColor: "#fa8231",
        enableBorderThickness: true,
        entries: [{ uid: "e1", color: "#111111", styleType: "text" }],
      },
    );
    expect(el.style.color).toBe("#eb3b5a");
    expect(el.style.backgroundColor).toBe("rgba(#fa8231,25)");
    expect(el.style.cssText).toContain("border: 2px solid #eb3b5a;");
  });

  it("per-entry previews the first colored member with group layout inherited", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      styleType: "",
      backgroundOpacity: 60,
      highlightBorderRadius: 0,
      entries: [
        {
          uid: "e1",
          textColor: "#ff0000",
          backgroundColor: "#00ff00",
          styleType: "both",
          backgroundOpacity: 10,
          enableBorderThickness: true,
        },
      ],
    });
    expect(el.style.color).toBe("#ff0000");
    // Group layout wins over the member's own (compiler parity).
    expect(el.style.backgroundColor).toBe("rgba(#00ff00,60)");
    expect(el.style.borderRadius).toBe("0px");
    // Highlight params resolve from the member copy, not the bare group.
    expect(plugin.calls.highlightParamsWith[0].textColor).toBe("#ff0000");
    expect(plugin.calls.highlightParamsWith[0].backgroundOpacity).toBe(60);
  });

  it("per-entry with no colored members shows plain theme text (never accent)", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      styleType: "",
      enableBorderThickness: true,
      entries: [{ uid: "e1", styleType: "text" }],
    });
    expect(el.style.color).toBe("");
    expect(el.style.backgroundColor).toBe("transparent");
    expect(el.style.cssText).not.toContain("accent");
  });

  it("empty groups show plain theme text instead of throwing", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, { styleType: "" });
    expect(el.style.color).toBe("");
    expect(el.style.backgroundColor).toBe("transparent");
  });

  it("legacy groups (colors, no colortype) override colors; members keep type", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      textColor: "#123456",
      backgroundColor: "#654321",
      entries: [{ uid: "e1", styleType: "text", color: "#aaaaaa" }],
    });
    // Member keeps text type: group text color, no highlight, no border.
    expect(el.style.color).toBe("#123456");
    expect(el.style.backgroundColor).toBe("transparent");
    expect(el.style.cssText).not.toContain("border:");
  });

  it("polluted both-black group colors are ignored; member colours apply", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      styleType: "both",
      textColor: "#000000",
      backgroundColor: "#000000",
      entries: [{ uid: "e1", styleType: "text", color: "#f07a7a" }],
    });
    expect(el.style.color).toBe("#f07a7a");
    expect(el.style.backgroundColor).toBe("transparent");
  });

  it("text members prefer textColor over color (matcher parity)", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      styleType: "",
      entries: [
        { uid: "e1", styleType: "text", color: "#111111", textColor: "#222222" },
      ],
    });
    expect(el.style.color).toBe("#222222");
  });

  it("respects disabled borders", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      styleType: "both",
      textColor: "#eb3b5a",
      backgroundColor: "#fa8231",
      enableBorderThickness: false,
      entries: [{ uid: "e1", styleType: "both" }],
    });
    expect(el.style.cssText).not.toContain("border:");
    expect(el.style.backgroundColor).toBe("rgba(#fa8231,25)");
  });

  it("negative vPad pulls via margins (editor parity)", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      styleType: "highlight",
      backgroundColor: "#fa8231",
      highlightVerticalPadding: -4,
      entries: [{ uid: "e1", styleType: "highlight" }],
    });
    expect(el.style.paddingTop).toBe("0px");
    expect(el.style.marginTop).toBe("-4px");
    expect(el.style.marginBottom).toBe("-4px");
  });

  it("member's own css is narrowed by a forced text type (colors+border dropped, layout kept)", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      styleType: "text",
      textColor: "#111111",
      entries: [
        {
          uid: "e1",
          styleType: "text",
          color: "#222222",
          customCss:
            "color:#999999;border:2px solid #999999;padding:3px;",
        },
      ],
    });
    expect(el.style.color).toBe("#111111");
    expect(el._important.color).toBeUndefined();
    expect(el._important.border).toBeUndefined();
    expect(el._important.padding).toBe("3px");
  });

  it("group css applies through groupCssForMembers when the member has none", () => {
    const plugin = makePlugin();
    plugin.groupCssForMembers = () => "padding:9px;";
    const el = makePreviewEl();
    applyGroupPreviewStyle(plugin, el, {
      styleType: "",
      customCss: "padding:9px;",
      entries: [{ uid: "e1", styleType: "text", color: "#222222" }],
    });
    expect(el._important.padding).toBe("9px");
  });

  it("never throws on hostile input", () => {
    const plugin = makePlugin();
    const el = makePreviewEl();
    expect(() =>
      applyGroupPreviewStyle(plugin, el, null),
    ).not.toThrow();
    expect(() =>
      applyGroupPreviewStyle(plugin, null, { styleType: "both" }),
    ).not.toThrow();
    expect(() =>
      applyGroupPreviewStyle(null, el, { styleType: "both" }),
    ).not.toThrow();
  });
});
