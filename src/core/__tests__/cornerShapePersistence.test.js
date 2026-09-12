/**
 * Regression: highlight shape (cornerShape) must survive save → reload.
 *
 * The load-time wordEntries normalization rebuilt each entry with an
 * explicit allowlist that omitted `cornerShape`, so a saved shape was
 * dropped from live settings on every reload (and the next save made the
 * loss permanent). EditEntryModal's save paths had the same omission.
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
let defaultSettings;

beforeAll(async () => {
  if (typeof globalThis.window === "undefined") {
    globalThis.window = { moment: { locale: () => "en" } };
  } else if (!globalThis.window.moment) {
    globalThis.window.moment = { locale: () => "en" };
  }
  ({ default: AlwaysColorText } = await import("../AlwaysColorText.js"));
  ({ defaultSettings } = await import("../../settings/defaultSettings.js"));
});

function makeFake(loadedData) {
  const fake = {
    settings: null,
    async loadData() {
      return JSON.parse(JSON.stringify(loadedData));
    },
  };
  // Bind the real prototype methods we exercise.
  for (const k of [
    "sanitizeSettings",
    "compressEntry",
    "migrateEntry",
    "generateUid",
    "isValidHexColor",
    "getHighlightParams",
    "getCornerShapeCss",
    "normalizePath",
  ]) {
    fake[k] = AlwaysColorText.prototype[k].bind(fake);
  }
  // loadSettings only needs loadData + the helpers above (+ defaultSettings).
  fake.loadSettings = AlwaysColorText.prototype.loadSettings.bind(fake);
  // Tail of loadSettings compiles caches / starts monitors — stub out.
  fake.compileWordEntries = () => {};
  fake.compileTextBgColoringEntries = () => {};
  fake.compileBlacklistEntries = () => {};
  fake.startMemoryMonitor = () => {};
  return fake;
}

function shapedEntry() {
  return {
    uid: "shape-e1",
    pattern: "shaped",
    color: "",
    textColor: "#ff0000",
    backgroundColor: "#00ff00",
    isRegex: false,
    flags: "",
    styleType: "both",
    matchType: "exact",
    caseSensitive: false,
    markTarget: "text",
    groupedPatterns: null,
    backgroundOpacity: 25,
    highlightBorderRadius: 8,
    cornerShape: "squircle",
    highlightHorizontalPadding: 4,
    highlightVerticalPadding: 0,
    enableBorderThickness: false,
    borderStyle: "full",
    borderLineStyle: "solid",
    borderOpacity: 100,
    borderThickness: 1,
  };
}

describe("cornerShape save/reload persistence", () => {
  it("survives sanitize → compress → JSON → loadSettings", async () => {
    const disk = {
      wordEntries: [shapedEntry()],
      wordEntryGroups: [],
      blacklistEntries: [],
      blacklistEntryGroups: [],
      pathRules: [],
    };
    const fake = makeFake(disk);
    await fake.loadSettings();
    const loaded = fake.settings.wordEntries.find((e) => e.uid === "shape-e1");
    expect(loaded).toBeTruthy();
    expect(loaded.cornerShape).toBe("squircle");

    // Simulate a save cycle then a second reload: still there.
    fake.sanitizeSettings();
    const recompressed = fake.settings.wordEntries.map((e) =>
      fake.compressEntry(e),
    );
    const roundTripped = JSON.parse(JSON.stringify(recompressed));
    expect(roundTripped[0].cornerShape).toBe("squircle");

    const fake2 = makeFake({
      wordEntries: roundTripped,
      wordEntryGroups: [],
      blacklistEntries: [],
      blacklistEntryGroups: [],
      pathRules: [],
    });
    await fake2.loadSettings();
    expect(
      fake2.settings.wordEntries.find((e) => e.uid === "shape-e1").cornerShape,
    ).toBe("squircle");
  });

  it("compress strips a default-equal shape but render still falls back", async () => {
    const fake = makeFake({
      wordEntries: [],
      wordEntryGroups: [],
      blacklistEntries: [],
      blacklistEntryGroups: [],
      pathRules: [],
    });
    await fake.loadSettings();
    // Global default is "round": an explicit "round" is redundant on disk…
    const compressed = fake.compressEntry({
      uid: "r1",
      pattern: "x",
      cornerShape: "round",
    });
    expect(compressed.cornerShape).toBeUndefined();
    // …but resolves back to round for rendering.
    expect(fake.getHighlightParams(compressed).cornerShape).toBe("round");
    expect(fake.getCornerShapeCss({ cornerShape: "squircle" })).toContain(
      "squircle",
    );
    expect(fake.getCornerShapeCss({ cornerShape: "round" })).toBe("");
  });

  it("group member entries keep cornerShape through loadSettings", async () => {
    const fake = makeFake({
      wordEntries: [],
      wordEntryGroups: [
        {
          uid: "g1",
          name: "G",
          active: true,
          entries: [
            Object.assign(shapedEntry(), {
              uid: "shape-g1",
              cornerShape: "notch",
            }),
          ],
        },
      ],
      blacklistEntries: [],
      blacklistEntryGroups: [],
      pathRules: [],
    });
    await fake.loadSettings();
    const g = fake.settings.wordEntryGroups.find((x) => x.uid === "g1");
    expect(g.entries[0].cornerShape).toBe("notch");
  });
});
