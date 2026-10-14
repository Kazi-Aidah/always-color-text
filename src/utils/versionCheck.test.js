import { describe, it, expect } from "vitest";
import {
  normalizeVersionTag,
  compareVersions,
  isNewerVersion,
} from "./versionCheck.js";

describe("normalizeVersionTag", () => {
  it("strips a leading v and whitespace", () => {
    expect(normalizeVersionTag("v1.18.0")).toBe("1.18.0");
    expect(normalizeVersionTag("  V2.0.1  ")).toBe("2.0.1");
    expect(normalizeVersionTag("1.2.3")).toBe("1.2.3");
  });

  it("drops pre-release and build metadata for comparison", () => {
    expect(normalizeVersionTag("1.2.3-beta.1")).toBe("1.2.3");
    expect(normalizeVersionTag("1.2.3+build.5")).toBe("1.2.3");
  });

  it("returns empty for nullish input", () => {
    expect(normalizeVersionTag(null)).toBe("");
    expect(normalizeVersionTag(undefined)).toBe("");
    expect(normalizeVersionTag("")).toBe("");
  });
});

describe("compareVersions", () => {
  it("orders major/minor/patch numerically, not lexically", () => {
    expect(compareVersions("1.9.0", "1.10.0")).toBe(-1);
    expect(compareVersions("1.10.0", "1.9.0")).toBe(1);
    expect(compareVersions("2.0.0", "1.99.99")).toBe(1);
    expect(compareVersions("1.18.0", "1.18.0")).toBe(0);
  });

  it("treats missing segments as zero", () => {
    expect(compareVersions("1.2", "1.2.0")).toBe(0);
    expect(compareVersions("1.2.1", "1.2")).toBe(1);
  });

  it("tolerates a leading v", () => {
    expect(compareVersions("v1.18.1", "1.18.0")).toBe(1);
  });
});

describe("isNewerVersion", () => {
  it("is true only when latest is strictly newer", () => {
    expect(isNewerVersion("1.19.0", "1.18.0")).toBe(true);
    expect(isNewerVersion("1.18.0", "1.18.0")).toBe(false);
    expect(isNewerVersion("1.17.9", "1.18.0")).toBe(false);
  });

  it("handles v-prefixed tags from GitHub", () => {
    expect(isNewerVersion("v1.19.0", "1.18.0")).toBe(true);
  });

  it("never reports an update for empty inputs", () => {
    expect(isNewerVersion("", "1.18.0")).toBe(false);
    expect(isNewerVersion("1.19.0", "")).toBe(false);
    expect(isNewerVersion(null, "1.18.0")).toBe(false);
  });
});
