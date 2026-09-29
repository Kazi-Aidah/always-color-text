/**
 * The Quick Menu's arrangement lives in its own settings list
 * (`settings.quickMenuOrder`) so it stays separate from the regular preset
 * and quick-style orderings:
 * - `ensureQuickMenuOrder()` snapshots the menu's derived order once at
 *   load (and keeps any arrangement a reorder already saved), so regular
 *   preset reorders stop dragging Quick Menu items along;
 * - `getQuickMenuStyles()` renders members in that arrangement — skipping
 *   stale uids of deleted items and appending members flagged after the
 *   arrangement was saved.
 */

import { describe, it, expect, vi, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

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

// Bind the two prototype methods without running the heavy constructor.
function makePlugin(settings) {
  const fake = { settings };
  fake.ensureQuickMenuOrder =
    AlwaysColorText.prototype.ensureQuickMenuOrder.bind(fake);
  fake.getQuickMenuStyles =
    AlwaysColorText.prototype.getQuickMenuStyles.bind(fake);
  return fake;
}

const qs = { uid: "qs-1", name: "Quick One" };
const hiddenQs = { uid: "qs-2", name: "Hidden", showInQuickMenu: false };
const flaggedA = { uid: "qa-a", name: "Alpha", showInQuickMenu: true };
const flaggedB = { uid: "qa-b", name: "Beta", showInQuickMenu: true };
const plain = { uid: "qp-1", name: "Plain" };

const uids = (list) => list.map((s) => s.uid);

describe("ensureQuickMenuOrder", () => {
  it("snapshots the derived menu order on load when none is saved", () => {
    const plugin = makePlugin({
      quickStyles: [qs, hiddenQs],
      textStylePresets: [flaggedA, flaggedB, plain],
    });

    plugin.ensureQuickMenuOrder();

    // Visible quick styles first, then flagged presets; hidden/unflagged out.
    expect(plugin.settings.quickMenuOrder).toEqual(["qs-1", "qa-a", "qa-b"]);
  });

  it("keeps an existing arrangement even when the regular lists differ", () => {
    const plugin = makePlugin({
      quickMenuOrder: ["qa-b", "qa-a", "qs-1"],
      quickStyles: [qs],
      textStylePresets: [flaggedB, flaggedA, plain],
    });

    plugin.ensureQuickMenuOrder();

    expect(plugin.settings.quickMenuOrder).toEqual(["qa-b", "qa-a", "qs-1"]);
  });

  it("stays empty while the menu has no members yet", () => {
    const plugin = makePlugin({
      quickStyles: [],
      textStylePresets: [plain],
    });

    plugin.ensureQuickMenuOrder();

    expect(plugin.settings.quickMenuOrder).toEqual([]);
  });
});

describe("getQuickMenuStyles", () => {
  it("renders members in the saved arrangement, not the regular order", () => {
    const plugin = makePlugin({
      quickMenuOrder: ["qa-b", "qs-1", "qa-a"],
      quickStyles: [qs],
      textStylePresets: [flaggedA, flaggedB, plain],
    });

    expect(uids(plugin.getQuickMenuStyles())).toEqual(["qa-b", "qs-1", "qa-a"]);
  });

  it("appends members flagged after the save and skips stale uids", () => {
    const plugin = makePlugin({
      quickMenuOrder: ["qa-a", "deleted-uid"],
      quickStyles: [qs],
      textStylePresets: [flaggedA, flaggedB, plain],
    });

    // "deleted-uid" matches nothing; "qs-1"/"qa-b" are unranked → end.
    expect(uids(plugin.getQuickMenuStyles())).toEqual(["qa-a", "qs-1", "qa-b"]);
  });

  it("falls back to the derived order when no arrangement is saved", () => {
    const plugin = makePlugin({
      quickStyles: [qs],
      textStylePresets: [flaggedA, plain],
    });

    expect(uids(plugin.getQuickMenuStyles())).toEqual(["qs-1", "qa-a"]);
  });
});

describe("load-time wiring", () => {
  it("onload snapshots the arrangement after the list repair", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../AlwaysColorText.js", import.meta.url)),
      "utf8",
    );
    expect(src).toMatch(/this\.ensureQuickMenuOrder\(\);/);
  });
});
