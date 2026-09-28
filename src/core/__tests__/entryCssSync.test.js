/**
 * Feature: custom CSS must mirror the color picker.
 *
 * Custom CSS declarations win over the base style at render time, so a
 * `color:` / `background-color:` literal that is never refreshed freezes the
 * entry on the color it had when the CSS was written. syncEntryCssFromColors
 * patches only the color-bearing declarations from the entry's structured
 * colors — verbatim for `var()` inputs — and leaves everything else alone.
 */

import { describe, it, expect, vi, beforeAll } from "vitest";

vi.mock("obsidian", () => {
  class Plugin {}
  class PluginSettingTab {}
  class Setting {}
  class Modal {}
  class MarkdownView {}
  class Notice {}
  class FuzzySuggestModal {}
  const debounce = (fn) => fn;
  class MarkdownRenderer {}
  class Menu {}
  const setIcon = () => {};
  class Component {}
  class TFile {}
  const Platform = {};
  const requestUrl = async () => ({});
  return {
    Plugin,
    PluginSettingTab,
    Setting,
    Modal,
    MarkdownView,
    Notice,
    FuzzySuggestModal,
    debounce,
    MarkdownRenderer,
    Menu,
    setIcon,
    Component,
    TFile,
    Platform,
    requestUrl,
  };
});

let AlwaysColorText;

beforeAll(async () => {
  if (typeof globalThis.window === "undefined") {
    globalThis.window = { moment: { locale: () => "en" } };
  } else if (!globalThis.window.moment) {
    globalThis.window.moment = { locale: () => "en" };
  }
  ({ default: AlwaysColorText } = await import("../AlwaysColorText.js"));
});

/** Minimal instance: only the methods syncEntryCssFromColors needs. */
function makeFake(settings = {}) {
  const fake = { settings: { backgroundOpacity: 35, ...settings } };
  for (const k of [
    "syncEntryCssFromColors",
    "syncEntryCssFromColorsForPreview",
    "syncAllEntriesCssFromColors",
    "_entriesWithCustomCss",
    "_entryBackgroundCss",
    "sanitizeCssDeclarations",
    "hexToRgba",
    "isValidHexColor",
  ]) {
    fake[k] = AlwaysColorText.prototype[k].bind(fake);
  }
  return fake;
}

describe("syncEntryCssFromColors", () => {
  it("rewrites the color declaration when the entry is recolored", () => {
    const fake = makeFake();
    const entry = {
      styleType: "text",
      textColor: "#222222",
      customCss: "color: #111111;\nfont-size: 18px;",
    };
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).toContain("color: #222222");
    expect(entry.customCss).not.toContain("#111111");
    expect(entry.customCss).toContain("font-size: 18px");
  });

  it("keeps the background in sync with the picker's color and opacity", () => {
    const fake = makeFake();
    const entry = {
      styleType: "highlight",
      backgroundColor: "#ff0000",
      backgroundOpacity: 40,
      customCss: "background-color: rgba(1,2,3,0.9);",
    };
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).toContain("background-color: rgba(255,0,0,0.4)");

    entry.backgroundColor = "#00ff00";
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).toContain("background-color: rgba(0,255,0,0.4)");
    expect(entry.customCss).not.toContain("rgba(255,0,0");
  });

  it("writes var() inputs back verbatim and keeps the variable link", () => {
    const fake = makeFake();
    const entry = {
      styleType: "highlight",
      textColor: "var(--color-accent)",
      backgroundColor: "var(--color-red)",
      backgroundOpacity: 50,
      customCss: "color: #111111; background-color: #111111;",
    };
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).toContain("color: var(--color-accent)");
    expect(
      entry.customCss,
    ).toContain("background-color: color-mix(in srgb, var(--color-red) 50%, transparent)");
    expect(entry.customCss).not.toContain("#111111");
  });

  it("leaves an entry with no structured colors untouched", () => {
    const fake = makeFake();
    const css = "color: #fa8231;\nbackground-color: #000000;";
    const entry = { styleType: "text", customCss: css };
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).toBe(css);
  });

  it("drops declarations for a color the entry no longer has", () => {
    const fake = makeFake();
    const entry = {
      styleType: "highlight",
      backgroundColor: "#ff0000",
      customCss: "color: #fa8231;\nbackground-color: #111111;",
    };
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).not.toContain("color: #fa8231");
    expect(entry.customCss).toContain("background-color: rgba(255,0,0,0.35)");
  });

  it("patches the color inside a border shorthand", () => {
    const fake = makeFake();
    const entry = {
      styleType: "highlight",
      backgroundColor: "#00ff00",
      customCss: "border: 2px solid #123456;",
    };
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).toContain("border: 2px solid #00ff00");
  });

  it("preserves blocks, which are explicit states such as &:hover", () => {
    const fake = makeFake();
    const entry = {
      styleType: "text",
      textColor: "#222222",
      customCss: "color: #111111;\n&:hover {\n  color: #111111;\n}",
    };
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).toContain("color: #222222");
    expect(entry.customCss).toContain("&:hover");
    expect(entry.customCss).toContain("color: #111111");
  });

  it("is idempotent", () => {
    const fake = makeFake();
    const entry = {
      styleType: "highlight",
      textColor: "#222222",
      backgroundColor: "#00ff00",
      backgroundOpacity: 35,
      customCss: "color: #111111; border: 1px solid #111111;",
    };
    fake.syncEntryCssFromColors(entry);
    const once = entry.customCss;
    fake.syncEntryCssFromColors(entry);
    expect(entry.customCss).toBe(once);
  });

  it("returns the same CSS from the preview path without mutating the entry", () => {
    const fake = makeFake();
    const entry = {
      styleType: "text",
      textColor: "#222222",
      customCss: "color: #111111;",
    };
    const preview = fake.syncEntryCssFromColorsForPreview(entry);
    expect(preview).toContain("color: #222222");
    expect(entry.customCss).toBe("color: #111111;");
  });
});

describe("syncAllEntriesCssFromColors", () => {
  it("walks every place custom CSS can live", () => {
    const fake = makeFake();
    const mk = (color) => ({
      styleType: "text",
      textColor: color,
      customCss: "color: #111111;",
    });
    const settings = {
      wordEntries: [mk("#222222")],
      textBgColoringEntries: [mk("#333333")],
      wordEntryGroups: [{ entries: [mk("#444444")] }],
      quickStyles: [mk("#555555")],
      backgroundOpacity: 35,
    };
    fake.settings = settings;
    fake.syncAllEntriesCssFromColors();

    const colors = [
      ...settings.wordEntries,
      ...settings.textBgColoringEntries,
      ...settings.wordEntryGroups[0].entries,
      ...settings.quickStyles,
    ].map((e) => e.customCss);
    expect(colors[0]).toContain("color: #222222");
    expect(colors[1]).toContain("color: #333333");
    expect(colors[2]).toContain("color: #444444");
    expect(colors[3]).toContain("color: #555555");
  });

  it("skips entries without custom CSS", () => {
    const fake = makeFake();
    const settings = {
      wordEntries: [
        { uid: "plain", textColor: "#222222" },
        { uid: "css", textColor: "#222222", customCss: "color: #111111;" },
      ],
      backgroundOpacity: 35,
    };
    fake.settings = settings;
    fake.syncAllEntriesCssFromColors();
    expect(settings.wordEntries[0].customCss).toBeUndefined();
    expect(settings.wordEntries[1].customCss).toContain("color: #222222");
  });
});
