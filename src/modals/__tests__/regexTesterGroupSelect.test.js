import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  FuzzySuggestModal: class {},
  Menu: class {},
  setIcon: () => {},
}));

import {
  resolveRegexTesterGroupInit,
  placeEntryInGroup,
} from "../RealTimeRegexTesterModal.js";

const makeSettings = () => ({
  wordEntries: [],
  wordEntryGroups: [
    { uid: "g1", name: "Terms", active: true, entries: [] },
    { uid: "g2", name: "Characters", active: true, entries: [] },
  ],
  partialMatch: true,
});

describe("resolveRegexTesterGroupInit", () => {
  it("preselects the group holding the entry being edited", () => {
    const entry = { uid: "e1", pattern: "foo" };
    const groupsList = [{ uid: "g1", entries: [entry] }];
    expect(
      resolveRegexTesterGroupInit({ editingEntry: entry, groupsList }),
    ).toBe("g1");
  });

  it("trusts entry.groupUid when the group exists", () => {
    const entry = { uid: "e1", groupUid: "g2" };
    const groupsList = [{ uid: "g1", entries: [] }, { uid: "g2", entries: [] }];
    expect(
      resolveRegexTesterGroupInit({ editingEntry: entry, groupsList }),
    ).toBe("g2");
  });

  it("returns No Group for an entry in the default list", () => {
    const entry = { uid: "e1" };
    expect(
      resolveRegexTesterGroupInit({
        editingEntry: entry,
        groupsList: [{ uid: "g1", entries: [] }],
      }),
    ).toBe("");
  });

  it("uses an explicitly preselected group when there is no editing entry", () => {
    const groupsList = [{ uid: "g1", entries: [] }];
    expect(
      resolveRegexTesterGroupInit({
        editingEntry: null,
        preselectedGroupUid: "g1",
        groupsList,
      }),
    ).toBe("g1");
  });

  it("ignores a stale preselected uid", () => {
    expect(
      resolveRegexTesterGroupInit({
        editingEntry: null,
        preselectedGroupUid: "gone",
        groupsList: [{ uid: "g1", entries: [] }],
      }),
    ).toBe("");
  });
});

describe("placeEntryInGroup", () => {
  it("files a new entry under the selected group, not the default list", () => {
    const settings = makeSettings();
    const entry = { uid: "e1", pattern: "foo" };
    const placed = placeEntryInGroup(settings, entry, "g2");
    expect(placed).toBe("g2");
    expect(settings.wordEntries).toHaveLength(0);
    expect(settings.wordEntryGroups[1].entries).toEqual([entry]);
    expect(entry.groupUid).toBe("g2");
  });

  it("moves an entry out of a group back to the default list", () => {
    const settings = makeSettings();
    const entry = { uid: "e1", pattern: "foo", groupUid: "g1" };
    settings.wordEntryGroups[0].entries.push(entry);
    const placed = placeEntryInGroup(settings, entry, "");
    expect(placed).toBe("");
    expect(settings.wordEntryGroups[0].entries).toHaveLength(0);
    expect(settings.wordEntries).toEqual([entry]);
    expect("groupUid" in entry).toBe(false);
    expect(entry.matchType).toBe("contains");
  });

  it("moves an entry between groups exactly once", () => {
    const settings = makeSettings();
    const entry = { uid: "e1", pattern: "foo", groupUid: "g1" };
    settings.wordEntryGroups[0].entries.push(entry);
    placeEntryInGroup(settings, entry, "g2");
    expect(settings.wordEntryGroups[0].entries).toHaveLength(0);
    expect(settings.wordEntryGroups[1].entries).toEqual([entry]);
    expect(entry.groupUid).toBe("g2");
  });

  it("leaves an entry that is already in the target location untouched", () => {
    const settings = makeSettings();
    const first = { uid: "e1", pattern: "foo", groupUid: "g1" };
    const second = { uid: "e2", pattern: "bar", groupUid: "g1" };
    settings.wordEntryGroups[0].entries.push(first, second);
    const placed = placeEntryInGroup(settings, first, "g1");
    expect(placed).toBe("g1");
    // Order drives render priority, so it must not change.
    expect(settings.wordEntryGroups[0].entries).toEqual([first, second]);
  });

  it("falls back to the default list when the target group is gone", () => {
    const settings = makeSettings();
    const entry = { uid: "e1", pattern: "foo" };
    const placed = placeEntryInGroup(settings, entry, "missing");
    expect(placed).toBe("");
    expect(settings.wordEntries).toEqual([entry]);
  });
});
