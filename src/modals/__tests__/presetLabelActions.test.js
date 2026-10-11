/**
 * Preset-label actions cross-check: save-as-preset / unlink / create-group
 * must behave for main-list entries, group-member clones (the modal edits a
 * detached copy there), and text-style (colored-text) entries alike.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {
    constructor() {}
  },
  Menu: class {},
  FuzzySuggestModal: class {},
  setIcon: () => {},
}));

vi.mock("../TextStylePresetsModal.js", () => ({
  TextStylePresetsModal: class {
    constructor() {}
    open() {}
  },
}));

import { EditEntryModal } from "../EditEntryModal.js";

function makePlugin(settings) {
  return {
    settings,
    t: (k, fb) => fb,
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
    },
    saveSettings: async () => {},
    compileWordEntries: () => {},
    compileTextBgColoringEntries: () => {},
    reconfigureEditorExtensions: () => {},
    forceRefreshAllEditors: () => {},
    forceRefreshAllReadingViews: () => {},
    triggerActiveDocumentRerender: () => {},
  };
}

function makeSettings() {
  return {
    wordEntries: [],
    textBgColoringEntries: [],
    wordEntryGroups: [],
    textStylePresets: [
      {
        uid: "tsp-round",
        name: "Round",
        styleType: "highlight",
        textColor: "currentColor",
        backgroundColor: "#3867d6",
        backgroundOpacity: 35,
        highlightBorderRadius: 4,
        cornerShape: "round",
        highlightHorizontalPadding: 4,
        highlightVerticalPadding: 0,
        enableBorderThickness: false,
        borderStyle: "full",
        borderLineStyle: "solid",
        borderOpacity: 100,
        borderThickness: 2,
      },
    ],
  };
}

function makeModal(plugin, entry) {
  const modal = Object.create(EditEntryModal.prototype);
  modal.app = {};
  modal.plugin = plugin;
  modal.entry = entry;
  modal.onSaved = null;
  modal.parentModal = null;
  return modal;
}

const bothEntry = (over = {}) => ({
  uid: "e-both",
  pattern: "hello",
  color: "",
  textColor: "#ff0000",
  backgroundColor: "#00ff00",
  styleType: "both",
  highlightBorderRadius: 14,
  backgroundOpacity: 50,
  presetUid: "tsp-round",
  ...over,
});

const textEntry = (over = {}) => ({
  uid: "e-text",
  pattern: "world",
  color: "#123456",
  textColor: null,
  backgroundColor: null,
  styleType: "text",
  highlightBorderRadius: 4,
  presetUid: "tsp-round",
  ...over,
});

describe("unlink preset", () => {
  it("drops the stamp on a main-list entry", async () => {
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._unlinkEntryPreset();
    expect(entry.presetUid).toBeUndefined();
    expect(settings.wordEntries[0].presetUid).toBeUndefined();
  });

  it("mirrors the unlink onto the live entry for a group-member clone", async () => {
    const settings = makeSettings();
    const live = bothEntry({ uid: "e-g" });
    settings.wordEntryGroups.push({
      uid: "g1",
      name: "G",
      active: true,
      entries: [live],
    });
    const clone = JSON.parse(JSON.stringify(live));
    const modal = makeModal(makePlugin(settings), clone);
    await modal._unlinkEntryPreset();
    expect(clone.presetUid).toBeUndefined();
    expect(live.presetUid).toBeUndefined();
  });
});

describe("save as new preset", () => {
  it("snapshots shape without colors and links a colorless entry", async () => {
    const settings = makeSettings();
    const entry = {
      uid: "e-nc",
      pattern: "plain",
      color: "",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      highlightBorderRadius: 20,
      backgroundOpacity: 70,
      presetUid: "tsp-round",
    };
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._saveEntryStyleAsPreset();

    expect(settings.textStylePresets.length).toBe(2);
    const created = settings.textStylePresets[1];
    expect(created.uid).toMatch(/^tsp-/);
    expect(created.isDefault).toBe(false);
    expect(created.highlightBorderRadius).toBe(20);
    expect(created.backgroundOpacity).toBe(70);
    expect(created.backgroundColor).toBeUndefined();
    expect(created.textColor).toBeUndefined();
    expect(entry.presetUid).toBe(created.uid);
  });

  it("keeps a highlight entry's own colors", async () => {
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._saveEntryStyleAsPreset();

    expect(entry.textColor).toBe("#ff0000");
    expect(entry.backgroundColor).toBe("#00ff00");
    const created = settings.textStylePresets[1];
    expect(created.backgroundColor).toBeUndefined();
    expect(entry.presetUid).toBe(created.uid);
  });

  it("keeps a colored-text entry's color and stamps the live clone", async () => {
    const settings = makeSettings();
    const live = textEntry({ uid: "e-tg" });
    settings.wordEntryGroups.push({
      uid: "g1",
      name: "G",
      active: true,
      entries: [live],
    });
    const clone = JSON.parse(JSON.stringify(live));
    const modal = makeModal(makePlugin(settings), clone);
    await modal._saveEntryStyleAsPreset();

    const created = settings.textStylePresets[1];
    expect(clone.color).toBe("#123456");
    expect(clone.presetUid).toBe(created.uid);
    // The stamp reaches live settings even though the modal edits a clone.
    expect(live.presetUid).toBe(created.uid);
    expect(created.color).toBeUndefined();
  });
});

describe("create group with this style", () => {
  it("moves a main-list colored entry into a per-entry shaped group", async () => {
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._createGroupWithEntryStyle();

    expect(settings.wordEntries.length).toBe(0);
    expect(settings.wordEntryGroups.length).toBe(1);
    const group = settings.wordEntryGroups[0];
    expect(group.entries.length).toBe(1);
    expect(group.entries[0]).toBe(entry);
    expect(entry.groupUid).toBe(group.uid);
    // Per-entry: no colors/type forcing, no preset stamp…
    expect(group.styleType).toBe("");
    expect(group.textColor).toBeUndefined();
    expect(group.backgroundColor).toBeUndefined();
    expect(group.presetUid).toBeUndefined();
    // …but the shape went over, and the entry renders as before.
    expect(group.highlightBorderRadius).toBe(14);
    expect(group.backgroundOpacity).toBe(50);
    expect(entry.textColor).toBe("#ff0000");
    expect(entry.backgroundColor).toBe("#00ff00");
  });

  it("moves a group member out of its old group", async () => {
    const settings = makeSettings();
    const live = textEntry({ uid: "e-mv" });
    settings.wordEntryGroups.push({
      uid: "g-old",
      name: "Old",
      active: true,
      entries: [live],
    });
    const clone = JSON.parse(JSON.stringify(live));
    const modal = makeModal(makePlugin(settings), clone);
    await modal._createGroupWithEntryStyle();

    const oldGroup = settings.wordEntryGroups.find((g) => g.uid === "g-old");
    expect(oldGroup.entries.length).toBe(0);
    expect(settings.wordEntryGroups.length).toBe(2);
    const fresh = settings.wordEntryGroups.find((g) => g.uid !== "g-old");
    expect(fresh.entries.length).toBe(1);
    expect(fresh.entries[0].uid).toBe("e-mv");
    expect(fresh.entries[0].groupUid).toBe(fresh.uid);
    expect(fresh.styleType).toBe("");
    // Colored-text member keeps its color.
    expect(fresh.entries[0].color).toBe("#123456");
  });
});
