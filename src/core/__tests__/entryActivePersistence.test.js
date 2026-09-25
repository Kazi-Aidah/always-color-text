/**
 * Regression: per-entry state must survive save → reload.
 *
 * The load-time wordEntries normalization rebuilt every entry from an
 * explicit allowlist, so fields it did not mention were dropped from live
 * settings on every reload — and the next save made the loss permanent.
 * The reported case: an entry deactivated through the row context menu came
 * back ACTIVE after a restart.
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
  fake.loadSettings = AlwaysColorText.prototype.loadSettings.bind(fake);
  fake.compileWordEntries = () => {};
  fake.compileTextBgColoringEntries = () => {};
  fake.compileBlacklistEntries = () => {};
  fake.startMemoryMonitor = () => {};
  return fake;
}

function deactivatedEntry() {
  return {
    uid: "inactive-e1",
    pattern: "deactivated",
    color: "#ff0000",
    textColor: "#ff0000",
    backgroundColor: null,
    isRegex: false,
    flags: "",
    styleType: "text",
    matchType: "contains",
    caseSensitive: true,
    markTarget: "text",
    groupedPatterns: null,
    // The reported bug: deactivated entries re-activated on reload.
    active: false,
    // Same allowlist dropped these per-entry fields too.
    colorTarget: "line",
    affectMarkElements: true,
    persistAtEnd: true,
  };
}

describe("per-entry state persistence", () => {
  it("keeps a deactivated entry deactivated through save → reload", async () => {
    const fake = makeFake({
      wordEntries: [deactivatedEntry()],
      wordEntryGroups: [],
      blacklistEntries: [],
      blacklistEntryGroups: [],
      pathRules: [],
    });
    await fake.loadSettings();
    const loaded = fake.settings.wordEntries.find(
      (e) => e.uid === "inactive-e1",
    );
    expect(loaded).toBeTruthy();
    expect(loaded.active).toBe(false);

    // Simulate a save cycle (sanitize → compress → JSON) and reload.
    fake.sanitizeSettings();
    const disk = JSON.parse(
      JSON.stringify(fake.settings.wordEntries.map((e) => fake.compressEntry(e))),
    );
    expect(disk[0].active).toBe(false);

    const fake2 = makeFake({
      wordEntries: disk,
      wordEntryGroups: [],
      blacklistEntries: [],
      blacklistEntryGroups: [],
      pathRules: [],
    });
    await fake2.loadSettings();
    const reloaded = fake2.settings.wordEntries.find(
      (e) => e.uid === "inactive-e1",
    );
    expect(reloaded.active).toBe(false);
    // …and the other per-entry fields the allowlist used to drop.
    expect(reloaded.caseSensitive).toBe(true);
    expect(reloaded.colorTarget).toBe("line");
    expect(reloaded.affectMarkElements).toBe(true);
    expect(reloaded.persistAtEnd).toBe(true);
  });

  it("keeps an active entry active without inventing a flag", async () => {
    const entry = deactivatedEntry();
    delete entry.active;
    const fake = makeFake({
      wordEntries: [entry],
      wordEntryGroups: [],
      blacklistEntries: [],
      blacklistEntryGroups: [],
      pathRules: [],
    });
    await fake.loadSettings();
    const loaded = fake.settings.wordEntries.find(
      (e) => e.uid === "inactive-e1",
    );
    expect(loaded.active).not.toBe(false);
  });

  it("keeps a deactivated group member entry deactivated", async () => {
    const fake = makeFake({
      wordEntries: [],
      wordEntryGroups: [
        {
          uid: "g1",
          name: "G",
          active: false,
          entries: [Object.assign(deactivatedEntry(), { uid: "inactive-g1" })],
        },
      ],
      blacklistEntries: [],
      blacklistEntryGroups: [],
      pathRules: [],
    });
    await fake.loadSettings();
    const g = fake.settings.wordEntryGroups.find((x) => x.uid === "g1");
    expect(g.active).toBe(false);
    expect(g.entries[0].active).toBe(false);

    fake.sanitizeSettings();
    const disk = JSON.parse(
      JSON.stringify(
        fake.settings.wordEntryGroups.map((grp) => ({
          ...grp,
          entries: grp.entries.map((e) => fake.compressEntry(e)),
        })),
      ),
    );
    expect(disk[0].active).toBe(false);
    expect(disk[0].entries[0].active).toBe(false);
  });
});
