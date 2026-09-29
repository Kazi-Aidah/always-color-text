/**
 * Reorder Presets saves the dialog's row order back into two settings
 * arrays. The old implementation zipped rows against presets by index, so a
 * hidden row (default preset, uid-less row, "Quick Menu items only" filter)
 * shifted the zip: presets were replaced by quick styles — duplicating them
 * in the presets modal — and the replaced ones disappeared.
 * `reconcilePresetOrder` must reorder without ever adding or losing an item.
 */

import { describe, it, expect } from "vitest";
import {
  reconcilePresetOrder,
  deriveQuickMenuOrder,
  orderQuickMenuByOrder,
  reconcileQuickMenuOrder,
} from "./presetOrdering.js";

const seedUids = new Set(["tsp-default", "tsp-sharp"]);
const mk = (uid, extra = {}) => Object.assign({ uid, name: uid }, extra);

const builtInDefault = mk("tsp-default", { isDefault: true });
const builtInSharp = mk("tsp-sharp");
const customA = mk("tsp-custom-a");
const customB = mk("tsp-custom-b");
const quickStyle = mk("1767537606270rtp1rf9xh9o", { name: "New Style" });
const legacyUidless = { name: "Legacy", styleType: "both" };

const ids = (list) => list.map((x) => x.uid);

describe("reconcilePresetOrder", () => {
  it("keeps quick styles out of the preset list", () => {
    const next = reconcilePresetOrder({
      presets: [builtInDefault, builtInSharp, customA],
      quickStyles: [quickStyle],
      seedUids,
      uidOrder: ["tsp-default", "tsp-sharp", quickStyle.uid, "tsp-custom-a"],
    });

    expect(ids(next.presets)).toEqual(["tsp-default", "tsp-sharp", "tsp-custom-a"]);
    expect(ids(next.quickStyles)).toEqual([quickStyle.uid]);
  });

  it("moves a quick style that already leaked into the presets back out", () => {
    // older saves pushed quick styles into textStylePresets as well
    const next = reconcilePresetOrder({
      presets: [builtInDefault, customA, quickStyle],
      quickStyles: [quickStyle],
      seedUids,
      uidOrder: ["tsp-default", "tsp-custom-a", quickStyle.uid],
    });

    expect(ids(next.presets)).toEqual(["tsp-default", "tsp-custom-a"]);
    expect(next.quickStyles).toEqual([quickStyle]);
  });

  it("keeps items the dialog filtered out instead of replacing them", () => {
    // the default preset has no row, one preset has no uid yet and one quick
    // style is hidden by "Quick Menu items only"
    const hiddenQs = mk("1767510601830z3rwnxtt09j", { showInQuickMenu: false });
    const next = reconcilePresetOrder({
      presets: [builtInDefault, builtInSharp, legacyUidless, customA],
      quickStyles: [quickStyle, hiddenQs],
      seedUids,
      uidOrder: ["tsp-sharp", "tsp-custom-a", quickStyle.uid],
    });

    expect(next.presets).toContain(builtInDefault);
    expect(next.presets).toContain(legacyUidless);
    expect(next.presets).toContain(customA);
    expect(next.quickStyles).toContain(quickStyle);
    expect(next.quickStyles).toContain(hiddenQs);
  });

  it("applies the dragged order to the visible custom presets", () => {
    const next = reconcilePresetOrder({
      presets: [builtInDefault, builtInSharp, customA, customB],
      quickStyles: [],
      seedUids,
      uidOrder: ["tsp-sharp", "tsp-custom-b", "tsp-custom-a", "tsp-default"],
    });

    expect(ids(next.presets)).toEqual([
      "tsp-default",
      "tsp-sharp",
      "tsp-custom-b",
      "tsp-custom-a",
    ]);
  });

  it("ignores duplicated rows and duplicated preset entries", () => {
    const next = reconcilePresetOrder({
      presets: [builtInDefault, builtInSharp, customA, customA],
      quickStyles: [quickStyle],
      seedUids,
      uidOrder: [
        "tsp-custom-a",
        quickStyle.uid,
        "tsp-custom-a",
        quickStyle.uid,
        "tsp-default",
        "tsp-sharp",
      ],
    });

    expect(ids(next.presets)).toEqual(["tsp-default", "tsp-sharp", "tsp-custom-a"]);
    expect(ids(next.quickStyles)).toEqual([quickStyle.uid]);
  });

  it("never loses or duplicates an item across a reorder round trip", () => {
    const presets = [builtInDefault, builtInSharp, legacyUidless, customA, customB];
    const quickStyles = [quickStyle];
    const before = presets.concat(quickStyles);

    const next = reconcilePresetOrder({
      presets,
      quickStyles,
      seedUids,
      uidOrder: ["tsp-custom-b", "tsp-custom-a", "tsp-sharp", quickStyle.uid],
    });

    const after = next.presets.concat(next.quickStyles);
    expect(after.length).toBe(before.length);
    before.forEach((item) => {
      expect(after.filter((x) => x === item).length).toBe(1);
    });
  });

  it("leaves untouched data untouched", () => {
    const presets = [builtInDefault, builtInSharp, customA, customB];
    const quickStyles = [quickStyle];
    const next = reconcilePresetOrder({
      presets,
      quickStyles,
      seedUids,
      uidOrder: ["tsp-default", "tsp-sharp", quickStyle.uid, "tsp-custom-a", "tsp-custom-b"],
    });

    expect(next.presets).toEqual(presets);
    expect(next.quickStyles).toEqual(quickStyles);
  });
});

describe("deriveQuickMenuOrder", () => {
  it("lists visible quick styles first, then flagged presets", () => {
    const hiddenQs = mk("qs-hidden", { showInQuickMenu: false });
    const shownQs = mk("qs-shown");
    const flagged = mk("tsp-flag", { showInQuickMenu: true });
    const plain = mk("tsp-plain");
    const uidless = { name: "No uid yet" };

    const uids = deriveQuickMenuOrder({
      quickStyles: [shownQs, hiddenQs],
      presets: [flagged, plain, uidless],
    });

    expect(uids).toEqual(["qs-shown", "tsp-flag"]);
  });

  it("never lists an item twice when it sits in both lists", () => {
    const leaked = mk("qs-leaked", { showInQuickMenu: true });

    const uids = deriveQuickMenuOrder({
      quickStyles: [leaked],
      presets: [leaked],
    });

    expect(uids).toEqual(["qs-leaked"]);
  });
});

describe("orderQuickMenuByOrder", () => {
  it("orders members by the saved arrangement", () => {
    const a = mk("a");
    const b = mk("b");
    const c = mk("c");

    const ordered = orderQuickMenuByOrder([a, b, c], ["c", "a", "b"]);

    expect(ids(ordered)).toEqual(["c", "a", "b"]);
  });

  it("appends items the arrangement does not mention, in input order", () => {
    const a = mk("a");
    const b = mk("b");
    const flaggedLate = mk("new");

    const ordered = orderQuickMenuByOrder([a, flaggedLate, b], ["b", "a"]);

    expect(ids(ordered)).toEqual(["b", "a", "new"]);
  });

  it("returns the input untouched when no arrangement is saved", () => {
    const items = [mk("a"), mk("b")];

    expect(orderQuickMenuByOrder(items, [])).toBe(items);
    expect(orderQuickMenuByOrder(items, undefined)).toBe(items);
  });
});

describe("reconcileQuickMenuOrder", () => {
  it("applies the dragged row order to the menu arrangement", () => {
    const next = reconcileQuickMenuOrder({
      quickMenuOrder: ["a", "b"],
      memberUids: ["a", "b", "c"],
      uidOrder: ["c", "a", "b"],
    });

    expect(next).toEqual(["c", "a", "b"]);
  });

  it("keeps arranged members that had no row and drops non-members", () => {
    const next = reconcileQuickMenuOrder({
      quickMenuOrder: ["a", "gone", "b"],
      memberUids: ["a", "b", "flagged-late"],
      uidOrder: ["b"],
    });

    expect(next).toEqual(["b", "a", "flagged-late"]);
  });

  it("never duplicates a uid the rows show twice", () => {
    const next = reconcileQuickMenuOrder({
      quickMenuOrder: [],
      memberUids: ["a", "b"],
      uidOrder: ["a", "b", "a"],
    });

    expect(next).toEqual(["a", "b"]);
  });

  it("ignores rows that are not Quick Menu members", () => {
    const next = reconcileQuickMenuOrder({
      quickMenuOrder: ["a"],
      memberUids: ["a"],
      uidOrder: ["not-a-member", "a"],
    });

    expect(next).toEqual(["a"]);
  });
});
