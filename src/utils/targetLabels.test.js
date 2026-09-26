/**
 * Regression: plain-object key lookups must only resolve OWN properties.
 * A pattern or preset label that happens to be an Object.prototype key
 * ("toString", "valueOf", …) used to resolve through the prototype chain,
 * misclassifying plain word entries as markdown targets (this crashed the
 * word-group row renderer under test, where mock rows have no classList).
 */

import { describe, it, expect } from "vitest";
import {
  resolveTargetElement,
  getTargetLabel,
  getTargetPatternText,
} from "./targetLabels.js";

const plugin = { t: (key, fallback) => fallback };

describe("targetLabels — prototype-key safety", () => {
  const protoKeys = ["toString", "valueOf", "constructor", "hasOwnProperty"];

  it("does not resolve Object.prototype keys as formatting targets", () => {
    for (const key of protoKeys) {
      expect(
        resolveTargetElement(plugin, { isRegex: false, pattern: key }),
      ).toBeNull();
      expect(resolveTargetElement(plugin, { presetLabel: key })).toBeNull();
    }
  });

  it("does not resolve Object.prototype keys as display labels", () => {
    for (const key of protoKeys) {
      expect(getTargetLabel(plugin, key)).toBeNull();
    }
  });

  it("renders plain text (not function source) for unknown targets", () => {
    expect(getTargetPatternText(plugin, "toString")).toBe("Targets toString");
  });

  it("still resolves the real formatting names and patterns", () => {
    expect(resolveTargetElement(plugin, { presetLabel: "Bold" })).toBe(
      "strong",
    );
    expect(
      resolveTargetElement(plugin, {
        pattern: "(\\*|_)(?=\\S)([^\\r]*?\\S)\\1",
      }),
    ).toBe("em");
    expect(resolveTargetElement(plugin, { targetElement: "strong" })).toBe(
      "strong",
    );
    expect(resolveTargetElement(plugin, { affectMarkElements: true })).toBe(
      "mark",
    );
    expect(getTargetLabel(plugin, "strong")).toBe("Bold");
    expect(getTargetPatternText(plugin, "strong")).toBe(
      "Targets .cm-strong and strong",
    );
  });
});
