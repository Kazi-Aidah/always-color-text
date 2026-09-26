/**
 * List / task / checkbox markers are painted as TEXT, so they need their own
 * channel rules on top of the shared hideChannels semantics:
 *
 *   Hide Text Colors → no marker colour at all
 *   Hide Highlights  → only a real text colour survives (a marker painted from
 *                      an entry's background belongs to the highlight channel)
 *
 * The flags-off branch is pinned against the historical expression so the
 * commands stay a pure no-op for existing users.
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

/** Minimal receiver: _markerColorFor only reads this.settings. */
function make(settings) {
  return { settings, _markerColorFor: AlwaysColorText.prototype._markerColorFor };
}

/** The expression the plugin used before the commands existed. */
function legacyMarkerColor(entry) {
  return (
    entry.color ||
    entry.textColor ||
    (entry.backgroundColor && entry.backgroundColor !== "currentColor"
      ? entry.backgroundColor
      : null)
  );
}

const ENTRIES = [
  {},
  { color: "#111111" },
  { textColor: "#222222" },
  { color: "#111111", textColor: "#222222" },
  { backgroundColor: "#333333" },
  { backgroundColor: "currentColor" },
  { textColor: "currentColor" },
  { textColor: "currentColor", backgroundColor: "#333333" },
  { color: "#111111", backgroundColor: "#333333" },
  { textColor: "#222222", backgroundColor: "#333333" },
  { color: "", textColor: "", backgroundColor: "" },
];

describe("_markerColorFor — flags off (unchanged legacy behaviour)", () => {
  it.each(ENTRIES.map((e) => [JSON.stringify(e), e]))(
    "matches the pre-command expression for %s",
    (_label, entry) => {
      const subject = make({})._markerColorFor(entry);
      // Callers only branch on truthiness, and the legacy expression could
      // yield "" or false for empty / currentColor fields — normalise both.
      expect(subject || null).toBe(legacyMarkerColor(entry) || null);
    },
  );

  it("is null-safe", () => {
    expect(make({})._markerColorFor(null)).toBeNull();
    expect(make(undefined)._markerColorFor(undefined)).toBeNull();
  });
});

describe("_markerColorFor — Hide Text Colors", () => {
  const subject = () => make({ hideTextColors: true });

  it.each(ENTRIES.map((e) => [JSON.stringify(e), e]))(
    "returns no marker colour at all for %s",
    (_label, entry) => {
      expect(subject()._markerColorFor(entry)).toBeNull();
    },
  );

  it("does not treat a truthy-but-not-true flag as enabled", () => {
    expect(make({ hideTextColors: "1" })._markerColorFor({ color: "#111111" })).toBe(
      "#111111",
    );
  });
});

describe("_markerColorFor — Hide Highlights", () => {
  const subject = () => make({ hideHighlights: true });

  it("keeps a marker painted from a real text colour", () => {
    expect(subject()._markerColorFor({ color: "#111111" })).toBe("#111111");
    expect(subject()._markerColorFor({ textColor: "#222222" })).toBe("#222222");
    expect(
      subject()._markerColorFor({
        textColor: "#222222",
        backgroundColor: "#333333",
      }),
    ).toBe("#222222");
  });

  it("drops a marker painted from the entry's background", () => {
    expect(subject()._markerColorFor({ backgroundColor: "#333333" })).toBeNull();
    expect(
      subject()._markerColorFor({ backgroundColor: "currentColor" }),
    ).toBeNull();
  });
});

describe("_markerColorFor — mutual exclusivity as enforced by the commands", () => {
  it("never yields a colour when both channels are hidden", () => {
    const subject = make({ hideTextColors: true, hideHighlights: true });
    for (const entry of ENTRIES) {
      expect(subject._markerColorFor(entry)).toBeNull();
    }
  });
});
