/**
 * Unit tests for src/utils/hideChannels.js — the single place where the two
 * visibility commands ("Hide Text Colors" / "Hide Highlights") are resolved.
 *
 * Every rendering path (CM6 decorations, reading DOM, the markdown-element
 * stylesheet, line targets, titles, tags, marks, callouts/tables/Bases)
 * funnels through these three functions, so a change here changes every
 * surface at once — hence the exhaustive cases below.
 */

import { describe, it, expect } from "vitest";
import {
  getHideFlags,
  resolveTextColor,
  resolveChannels,
} from "../../utils/hideChannels.js";

const NO_FLAGS = { hideText: false, hideBg: false };

describe("getHideFlags", () => {
  it("defaults both flags to false for a missing settings object", () => {
    expect(getHideFlags(null)).toEqual({ hideText: false, hideBg: false });
    expect(getHideFlags(undefined)).toEqual({ hideText: false, hideBg: false });
    expect(getHideFlags({})).toEqual({ hideText: false, hideBg: false });
  });

  it("reads the flags only when they are strictly true", () => {
    expect(getHideFlags({ hideTextColors: true })).toEqual({
      hideText: true,
      hideBg: false,
    });
    expect(getHideFlags({ hideHighlights: true })).toEqual({
      hideText: false,
      hideBg: true,
    });
    expect(getHideFlags({ hideTextColors: true, hideHighlights: true })).toEqual(
      { hideText: true, hideBg: true },
    );
  });

  it("treats truthy-but-not-true values as off (loadSettings normalises to boolean)", () => {
    expect(getHideFlags({ hideTextColors: 1 })).toEqual({
      hideText: false,
      hideBg: false,
    });
    expect(getHideFlags({ hideHighlights: "yes" })).toEqual({
      hideText: false,
      hideBg: false,
    });
  });
});

describe("resolveTextColor", () => {
  it("prefers the modern textColor field", () => {
    expect(resolveTextColor({ textColor: "#123456", color: "#654321" })).toBe(
      "#123456",
    );
  });

  it("falls back to the legacy color field", () => {
    expect(resolveTextColor({ color: "#654321" })).toBe("#654321");
    expect(resolveTextColor({ textColor: "", color: "#654321" })).toBe(
      "#654321",
    );
  });

  it("treats currentColor as 'no explicit colour'", () => {
    expect(resolveTextColor({ textColor: "currentColor" })).toBeNull();
    expect(resolveTextColor({ textColor: "currentColor", color: "#111111" })).toBe(
      "#111111",
    );
  });

  it("is null-safe", () => {
    expect(resolveTextColor(null)).toBeNull();
    expect(resolveTextColor({})).toBeNull();
  });
});

describe("resolveChannels — flags off (byte-identical legacy behaviour)", () => {
  it("keeps both channels independent for a 'text' entry", () => {
    const ch = resolveChannels(
      { textColor: "#abc", backgroundColor: "#def", styleType: "text" },
      NO_FLAGS,
    );
    expect(ch).toEqual({
      color: "#abc",
      background: "#def",
      isHighlight: true,
      visible: true,
      styleType: "text",
      hideText: false,
      hideBg: false,
    });
  });

  it("defaults styleType to 'text'", () => {
    const ch = resolveChannels({ textColor: "#abc" }, NO_FLAGS);
    expect(ch.styleType).toBe("text");
    expect(ch.isHighlight).toBe(false);
    expect(ch.visible).toBe(true);
  });

  it("marks highlight/both entries as box-styled", () => {
    for (const styleType of ["highlight", "both"]) {
      const ch = resolveChannels({ styleType, backgroundColor: "#def" }, NO_FLAGS);
      expect(ch.isHighlight).toBe(true);
      expect(ch.background).toBe("#def");
      expect(ch.visible).toBe(true);
    }
  });

  it("an entry with only a background is still visible (isHighlight from backgroundColor)", () => {
    const ch = resolveChannels({ backgroundColor: "#def" }, NO_FLAGS);
    expect(ch.background).toBe("#def");
    expect(ch.isHighlight).toBe(true);
    expect(ch.visible).toBe(true);
  });

  it("an empty entry paints nothing but stays 'visible'-neutral only when it has a box", () => {
    const ch = resolveChannels({}, NO_FLAGS);
    expect(ch.color).toBeNull();
    expect(ch.background).toBeNull();
    expect(ch.isHighlight).toBe(false);
    expect(ch.visible).toBe(false);
  });

  it("tolerates a missing entry", () => {
    const ch = resolveChannels(null, NO_FLAGS);
    expect(ch.visible).toBe(false);
    expect(ch.styleType).toBe("text");
  });

  it("tolerates missing flags", () => {
    const ch = resolveChannels({ textColor: "#abc" }, undefined);
    expect(ch.color).toBe("#abc");
    expect(ch.hideText).toBe(false);
    expect(ch.hideBg).toBe(false);
  });
});

describe("resolveChannels — hideTextColors", () => {
  const flags = { hideText: true, hideBg: false };

  it("drops only the colour channel", () => {
    const ch = resolveChannels(
      { textColor: "#abc", backgroundColor: "#def", styleType: "both" },
      flags,
    );
    expect(ch.color).toBeNull();
    expect(ch.background).toBe("#def");
    expect(ch.isHighlight).toBe(true);
    expect(ch.visible).toBe(true);
    expect(ch.hideText).toBe(true);
    expect(ch.hideBg).toBe(false);
  });

  it("makes a text-only entry invisible so the whole rule can be dropped", () => {
    const ch = resolveChannels(
      { textColor: "#abc", styleType: "text" },
      flags,
    );
    expect(ch.visible).toBe(false);
  });
});

describe("resolveChannels — hideHighlights", () => {
  const flags = { hideText: false, hideBg: true };

  it("drops the background AND the box styling, keeping the text colour", () => {
    const ch = resolveChannels(
      { textColor: "#abc", backgroundColor: "#def", styleType: "both" },
      flags,
    );
    expect(ch.color).toBe("#abc");
    expect(ch.background).toBeNull();
    expect(ch.isHighlight).toBe(false);
    expect(ch.visible).toBe(true);
    expect(ch.hideBg).toBe(true);
  });

  it("makes a highlight-only entry invisible so the whole rule can be dropped", () => {
    for (const entry of [
      { backgroundColor: "#def", styleType: "highlight" },
      { backgroundColor: "#def", styleType: "text" },
      { textColor: "currentColor", backgroundColor: "#def", styleType: "both" },
    ]) {
      const ch = resolveChannels(entry, flags);
      expect(ch.background).toBeNull();
      expect(ch.isHighlight).toBe(false);
      expect(ch.visible).toBe(false);
    }
  });
});

describe("resolveChannels — the two commands are mutually exclusive in practice", () => {
  it("both flags on yields nothing visible for any colour-only entry", () => {
    const flags = { hideText: true, hideBg: true };
    for (const entry of [
      { textColor: "#abc", styleType: "text" },
      { backgroundColor: "#def", styleType: "highlight" },
      { textColor: "#abc", backgroundColor: "#def", styleType: "both" },
    ]) {
      expect(resolveChannels(entry, flags).visible).toBe(false);
    }
  });

  it("hiding one channel never leaks into the other", () => {
    const entry = { textColor: "#abc", backgroundColor: "#def", styleType: "both" };
    expect(resolveChannels(entry, { hideText: true, hideBg: false })).toEqual({
      ...resolveChannels(entry, { hideText: false, hideBg: false }),
      color: null,
      hideText: true,
    });
    expect(resolveChannels(entry, { hideText: false, hideBg: true })).toMatchObject(
      {
        color: "#abc",
        background: null,
        isHighlight: false,
        hideBg: true,
      },
    );
  });
});
