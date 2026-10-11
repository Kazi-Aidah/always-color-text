/**
 * "Create new group with this style" snapshots the entry's highlight/border
 * shape onto a brand-new per-entry word group (no colors, no preset stamp),
 * so the moved entry renders exactly as before while future members inherit
 * the shape.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  Menu: class {},
  FuzzySuggestModal: class {},
  setIcon: () => {},
}));

import { buildStyleGroupForEntry } from "../EditEntryModal.js";
import { PRESET_SHAPE_FIELDS } from "../../utils/presetLinker.js";

const shapedEntry = (over = {}) => {
  const e = {
    uid: "e1",
    pattern: "hello",
    color: "#ff0000",
    textColor: "#ff0000",
    backgroundColor: "#00ff00",
    styleType: "both",
    presetUid: "tsp-1",
    customCss: "font-weight: bold;",
    ...over,
  };
  let n = 0;
  for (const k of PRESET_SHAPE_FIELDS) e[k] = 10 + n++;
  return e;
};

describe("buildStyleGroupForEntry", () => {
  it("copies the entry shape and names the group", () => {
    const entry = shapedEntry();
    const group = buildStyleGroupForEntry(entry, "Round Group", "g1");
    expect(group.uid).toBe("g1");
    expect(group.name).toBe("Round Group");
    expect(group.active).toBe(true);
    expect(group.entries).toEqual([]);
    for (const k of PRESET_SHAPE_FIELDS) {
      expect(group[k]).toBe(entry[k]);
    }
  });

  it("stays per-entry: no colors, no colortype, no preset stamp", () => {
    const group = buildStyleGroupForEntry(shapedEntry(), "Round Group", "g1");
    expect(group.styleType).toBe("");
    expect(group.textColor).toBeUndefined();
    expect(group.backgroundColor).toBeUndefined();
    expect(group.color).toBeUndefined();
    expect(group.customCss).toBeUndefined();
    expect(group.presetUid).toBeUndefined();
  });

  it("carries empty rule/filter scaffolding like a fresh group", () => {
    const group = buildStyleGroupForEntry(shapedEntry(), "G", "g1");
    expect(group.inclusionRules).toEqual([]);
    expect(group.exclusionRules).toEqual([]);
    expect(group.enableFolders).toEqual([]);
    expect(group.disableFolders).toEqual([]);
    expect(group.enableTags).toEqual([]);
    expect(group.disableTags).toEqual([]);
  });

  it("tolerates entries without shape fields", () => {
    const group = buildStyleGroupForEntry({ uid: "e" }, "G", "g1");
    expect(group.uid).toBe("g1");
    for (const k of PRESET_SHAPE_FIELDS) {
      expect(group[k]).toBeUndefined();
    }
  });

  it("tolerates a null entry", () => {
    const group = buildStyleGroupForEntry(null, "G", "g1");
    expect(group.entries).toEqual([]);
    expect(group.styleType).toBe("");
  });
});
