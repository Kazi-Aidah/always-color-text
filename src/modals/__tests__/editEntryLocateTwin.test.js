/**
 * Twin-entry regression: two entries with identical matchers (same pattern
 * key — e.g. two Time & Date presets built from the same format) but
 * different uids/colors must not be confused when Edit Entry resolves the
 * live settings reference. The old single-pass uid-or-key `.find()` stopped
 * at the first twin in array order, so opening the purple entry silently
 * swapped to the orange one — including a deactivated orange twin.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  Menu: class {},
  FuzzySuggestModal: class {},
  setIcon: () => {},
}));

import {
  entryMatcherKey,
  locateEntryInSettings,
} from "../EditEntryModal.js";

// Mirrors the reported setup: deactivated orange Time preset first,
// activated purple entry second, identical matchers.
function twinSettings() {
  const orange = {
    uid: "uid-orange",
    isRegex: true,
    pattern: "\\b\\d{1,2}:\\d{2} [ap]m\\b",
    flags: "iu",
    matchType: "exact",
    presetLabel: "Time & Date (h:m a)",
    dateTimeFormat: "h:m a",
    color: "#ff8800",
    styleType: "text",
    active: false,
  };
  const purple = {
    uid: "uid-purple",
    isRegex: true,
    pattern: "\\b\\d{1,2}:\\d{2} [ap]m\\b",
    flags: "iu",
    matchType: "exact",
    presetLabel: "Time & Date (h:m a)",
    dateTimeFormat: "h:m a",
    color: "#aa00ff",
    styleType: "text",
  };
  return {
    settings: { wordEntries: [orange, purple], wordEntryGroups: [] },
    orange,
    purple,
  };
}

describe("entryMatcherKey", () => {
  it("is identical for twins with the same matchers", () => {
    const { orange, purple } = twinSettings();
    expect(entryMatcherKey(orange)).toBe(entryMatcherKey(purple));
    expect(entryMatcherKey(orange).length).toBeGreaterThan(0);
  });
});

describe("locateEntryInSettings — twin entries", () => {
  it("resolves the purple entry by uid even when the orange twin is first", () => {
    const { settings, purple } = twinSettings();
    const loc = locateEntryInSettings(settings, purple);
    expect(loc).not.toBeNull();
    expect(loc.entry.uid).toBe("uid-purple");
    expect(loc.entry.color).toBe("#aa00ff");
    expect(loc.groupUid).toBeNull();
  });

  it("resolves the deactivated orange twin by its own uid too", () => {
    const { settings, orange } = twinSettings();
    const loc = locateEntryInSettings(settings, orange);
    expect(loc).not.toBeNull();
    expect(loc.entry.uid).toBe("uid-orange");
  });

  it("attributes the group of the requested twin, not the earlier twin's group", () => {
    const { orange, purple } = twinSettings();
    const settings = {
      wordEntries: [],
      wordEntryGroups: [
        { uid: "g-a", name: "A", entries: [orange] },
        { uid: "g-b", name: "B", entries: [purple] },
      ],
    };
    const loc = locateEntryInSettings(settings, purple);
    expect(loc).not.toBeNull();
    expect(loc.entry.uid).toBe("uid-purple");
    expect(loc.groupUid).toBe("g-b");
  });

  it("falls back to the matcher key for uid-less entries", () => {
    const { settings, purple } = twinSettings();
    const noUid = { ...purple };
    delete noUid.uid;
    const loc = locateEntryInSettings(settings, noUid);
    expect(loc).not.toBeNull();
    // Ambiguous by nature — either twin is acceptable, but it must match.
    expect(entryMatcherKey(loc.entry)).toBe(entryMatcherKey(purple));
  });

  it("returns null for entries not filed in settings", () => {
    const { settings } = twinSettings();
    const fresh = {
      uid: "uid-fresh",
      isRegex: false,
      pattern: "brand-new-word",
      matchType: "exact",
    };
    expect(locateEntryInSettings(settings, fresh)).toBeNull();
    expect(locateEntryInSettings(settings, null)).toBeNull();
  });
});
