/**
 * `settings.swatchOrder` is the arrangement the user makes in Edit Color
 * Swatches. The colour picker grid reads it back, and every Settings-tab
 * change to the swatch lists rewrites it, so the order the user set survives
 * reorders, additions, deletions and recolors instead of falling back to
 * defaults-first.
 */

import { describe, it, expect } from "vitest";
import {
  orderSwatchesByOrder,
  syncSwatchOrder,
  replaceSwatchColorInOrder,
} from "./swatchOrdering.js";

const sw = (name, color) => ({ name, color });

describe("orderSwatchesByOrder", () => {
  it("lays swatches out exactly as saved, defaults and customs interleaved", () => {
    const items = [
      sw("Red", "#eb3b5a"),
      sw("Cyan", "#0fb9b1"),
      sw("Mine", "#b1f062"),
    ];
    const ordered = orderSwatchesByOrder(items, [
      "#b1f062",
      "#eb3b5a",
      "#0fb9b1",
    ]);
    expect(ordered.map((s) => s.color)).toEqual([
      "#b1f062",
      "#eb3b5a",
      "#0fb9b1",
    ]);
    // Input array is never mutated.
    expect(items.map((s) => s.color)).toEqual([
      "#eb3b5a",
      "#0fb9b1",
      "#b1f062",
    ]);
  });

  it("matches saved colors case-insensitively", () => {
    const items = [sw("Mine", "#b1f062"), sw("Red", "#eb3b5a")];
    const ordered = orderSwatchesByOrder(items, ["#EB3B5A", "#B1F062"]);
    expect(ordered.map((s) => s.color)).toEqual(["#eb3b5a", "#b1f062"]);
  });

  it("keeps the defaults-then-customs layout when no order is saved", () => {
    const items = [sw("Red", "#eb3b5a"), sw("Mine", "#b1f062")];
    expect(orderSwatchesByOrder(items, undefined)).toBe(items);
    expect(orderSwatchesByOrder(items, [])).toBe(items);
  });

  it("sends swatches the saved order never saw to the end, in input order", () => {
    const items = [
      sw("Red", "#eb3b5a"),
      sw("Cyan", "#0fb9b1"),
      sw("Brand new", "#123456"),
    ];
    const ordered = orderSwatchesByOrder(items, ["#0fb9b1"]);
    expect(ordered.map((s) => s.color)).toEqual([
      "#0fb9b1",
      "#eb3b5a",
      "#123456",
    ]);
  });
});

describe("syncSwatchOrder", () => {
  it("starts from defaults-then-customs while nothing has been arranged", () => {
    const settings = {
      swatches: [sw("Red", "#eb3b5a"), sw("Cyan", "#0fb9b1")],
      userCustomSwatches: [sw("Mine", "#b1f062")],
    };
    syncSwatchOrder(settings);
    expect(settings.swatchOrder).toEqual(["#eb3b5a", "#0fb9b1", "#b1f062"]);
  });

  it("keeps each default's slot while the customs sequence changes", () => {
    const settings = {
      swatches: [sw("Red", "#eb3b5a")],
      userCustomSwatches: [sw("B", "#00ff00"), sw("A", "#00aa00")],
      // Previously saved as Red, A, B — the customs are now dragged to swap.
      swatchOrder: ["#eb3b5a", "#00aa00", "#00ff00"],
    };
    syncSwatchOrder(settings);
    expect(settings.swatchOrder).toEqual(["#eb3b5a", "#00ff00", "#00aa00"]);
  });

  it("drops deleted colors and appends a new custom at the end", () => {
    const settings = {
      swatches: [sw("Red", "#eb3b5a")],
      userCustomSwatches: [sw("A", "#00aa00"), sw("C", "#00cc00")],
      // "B" was deleted between save and sync.
      swatchOrder: ["#eb3b5a", "#00aa00", "#00ff00", "#00cc00"],
    };
    syncSwatchOrder(settings);
    expect(settings.swatchOrder).toEqual([
      "#eb3b5a",
      "#00aa00",
      "#00cc00",
    ]);

    settings.userCustomSwatches.push(sw("D", "#00dd00"));
    syncSwatchOrder(settings);
    expect(settings.swatchOrder).toEqual([
      "#eb3b5a",
      "#00aa00",
      "#00cc00",
      "#00dd00",
    ]);
  });
});

describe("replaceSwatchColorInOrder", () => {
  it("recolors in place so the swatch keeps its slot", () => {
    const settings = {
      swatches: [sw("Red", "#eb3b5a")],
      userCustomSwatches: [sw("Mine", "#123456")],
      swatchOrder: ["#eb3b5a", "#b1f062"],
    };
    settings.userCustomSwatches[0].color = "#123456";
    replaceSwatchColorInOrder(settings, "#b1f062", "#123456");
    syncSwatchOrder(settings);
    expect(settings.swatchOrder).toEqual(["#eb3b5a", "#123456"]);
  });

  it("leaves settings without a saved order alone", () => {
    const settings = {};
    expect(() =>
      replaceSwatchColorInOrder(settings, "#b1f062", "#123456"),
    ).not.toThrow();
    expect(settings.swatchOrder).toBeUndefined();
  });
});
