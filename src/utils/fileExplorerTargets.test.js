/**
 * File-explorer targets ("File Name" / "Folder Name") mirror the tab-title
 * matching: the name lives outside `.cm-content` / `.markdown-rendered`, so it
 * is matched by `titleFilter` / `titleMatchType` in JS, and the CSS selector is
 * only emitted while no filter is set.
 */

import { describe, it, expect } from "vitest";
import { getMarkdownTarget } from "./markdownTargets.js";
import {
  buildMarkdownSelector,
  getElementConfig,
  isTitleFilterTarget,
} from "./markdownElementConfig.js";
import { getTargetLabel } from "./targetLabels.js";
import { matchTargetElementEntry } from "./reverseLookup.js";

const plugin = { t: (key, fallback) => fallback };

describe("file explorer targets — registry", () => {
  it("registers the file and folder name elements", () => {
    const file = getMarkdownTarget("file-name");
    const folder = getMarkdownTarget("folder-name");
    expect(file).toBeTruthy();
    expect(file.cmSelector).toBe(".nav-file-title-content");
    expect(file.renderedSelector).toBe(".nav-file-title-content");
    expect(folder).toBeTruthy();
    expect(folder.cmSelector).toBe(".nav-folder-title-content");
    expect(folder.group).toBe(file.group);
  });

  it("resolves display labels", () => {
    expect(getTargetLabel(plugin, "file-name")).toBe("File Name");
    expect(getTargetLabel(plugin, "folder-name")).toBe("Folder Name");
  });

  it("is part of the text-filtered (JS-resolved) target set", () => {
    expect(isTitleFilterTarget("file-name")).toBe(true);
    expect(isTitleFilterTarget("folder-name")).toBe(true);
    expect(isTitleFilterTarget("tab-title")).toBe(true);
    expect(isTitleFilterTarget("strong")).toBe(false);
  });
});

describe("file explorer targets — config", () => {
  it("reuses the shared title filter field and match mode", () => {
    for (const key of ["file-name", "folder-name"]) {
      const cfg = getElementConfig(key);
      expect(cfg.field).toBe("titleFilter");
      expect(cfg.matchField).toBe("titleMatchType");
      expect(cfg.defaultValue).toBe("");
      expect(cfg.placeholderKey).toBeTruthy();
    }
  });

  it("emits CSS only while the name filter is empty", () => {
    const file = getMarkdownTarget("file-name");
    const folder = getMarkdownTarget("folder-name");
    expect(
      buildMarkdownSelector(file, { targetElement: "file-name" }, false),
    ).toContain(".nav-file-title-content");
    expect(
      buildMarkdownSelector(folder, { targetElement: "folder-name" }, false),
    ).toContain(".nav-folder-title-content");
    // A filter cannot be expressed in CSS → JS (applyTitleHighlights) owns it.
    expect(
      buildMarkdownSelector(
        file,
        { targetElement: "file-name", titleFilter: "note" },
        false,
      ),
    ).toBe("");
    expect(
      buildMarkdownSelector(
        folder,
        { targetElement: "folder-name", titleFilter: "  " },
        false,
      ),
    ).toContain(".nav-folder-title-content");
  });
});

describe("file explorer targets — text matching", () => {
  const entry = (extra) =>
    Object.assign(
      {
        uid: "fe",
        targetElement: "file-name",
        isRegex: false,
        pattern: "Targets file-name",
      },
      extra,
    );
  const pick = (e, text) => matchTargetElementEntry(e, { selectedText: text });

  it("treats an empty filter as a possible match on any name", () => {
    expect(pick(entry({}), "anything").kind).toBe("markdown-possible");
    expect(pick(entry({ titleFilter: "" }), "anything").kind).toBe(
      "markdown-possible",
    );
  });

  it("matches contains / exact / starts with / ends with", () => {
    expect(pick(entry({ titleFilter: "note" }), "My note").kind).toBe(
      "markdown",
    );
    expect(pick(entry({ titleFilter: "note" }), "notes").kind).toBe("markdown");
    expect(
      pick(
        entry({ titleFilter: "note", titleMatchType: "exact" }),
        "My note",
      ),
    ).toBeNull();
    expect(
      pick(
        entry({ titleFilter: "note", titleMatchType: "exact" }),
        "note",
      ).kind,
    ).toBe("markdown");
    expect(
      pick(
        entry({ titleFilter: "My", titleMatchType: "startswith" }),
        "My note",
      ).kind,
    ).toBe("markdown");
    expect(
      pick(
        entry({ titleFilter: "My", titleMatchType: "startswith" }),
        "Your note",
      ),
    ).toBeNull();
    expect(
      pick(
        entry({ titleFilter: "note", titleMatchType: "endswith" }),
        "My note",
      ).kind,
    ).toBe("markdown");
    expect(
      pick(entry({ titleFilter: "note" }), "noteworthy").kind,
    ).toBe("markdown");
    expect(pick(entry({ titleFilter: "note" }), "other")).toBeNull();
  });

  it("applies the same rules to folder names", () => {
    const folder = entry({ targetElement: "folder-name", titleFilter: "arc" });
    expect(pick(folder, "Archive").kind).toBe("markdown");
    expect(pick(folder, "Inbox")).toBeNull();
  });
});
