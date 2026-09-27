/**
 * Regression: the 6 medium + 4 low findings from the full-feature audit.
 *
 * 5. Live Preview callout/table/Bases caches keyed on content length + flags
 *    (not entries) and never force-refreshed after entry edits → stale paint.
 * 6. Heading colour clear nested under `if (headingEntry)` → deleting the
 *    entry left the inline colour behind.
 * 7. List/task markers painted but never cleared on entry deletion; the
 *    "no list entries" path returned before any reset could run.
 * 8. "Color in reading mode" OFF only unwrapped highlight spans — element
 *    stylesheet rules, line-target sheets and reading callout styles stayed.
 * 9. Orphan `style[data-act-line-style]` sheets when entries are deleted.
 * 10. setGlobalEnabled(true) re-applied reading callout styles without the
 *     `!hideTextColors` guard the hide command uses.
 * 11. `el.style.cssText += borderCss` re-appended borders every pass.
 * 12. Group commands bypassed the hidden-commands gate.
 * 13. Whole refresh sequences wrapped in one silent `catch (_)`.
 * 14. Unreachable dead branch in triggerActiveDocumentRerender.
 * 15. The palette "Color / Highlight Once" command always opened the
 *     both-channels modal regardless of which once-flags are enabled (the
 *     context menu gates each action individually).
 * 16. Seven settings keys declared in defaultSettings.js and read nowhere.
 *
 * Source-level assertions (same approach as hideCommandsReachAllSurfaces.test.js)
 * except buildMarkdownSelector, which is a pure util and unit-tested directly.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { buildMarkdownSelector } from "../../utils/markdownElementConfig.js";

const ROOT = join(__dirname, "..", "..", "..");
const mainSrc = readFileSync(
  join(ROOT, "src", "core", "AlwaysColorText.js"),
  "utf8",
);
const settingsSrc = readFileSync(
  join(ROOT, "src", "settings", "SettingsTab.js"),
  "utf8",
);

/** Split the module into its (2-space indented) class methods. */
function classMethods(src) {
  const lines = src.split("\n");
  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    if (
      /^  (?:async\s+)?[A-Za-z_$][\w$]*\s*\(/.test(lines[i]) ||
      /^  [A-Za-z_$][\w$]*\s*=\s*(?:async\s*)?\(/.test(lines[i])
    ) {
      starts.push({ i, line: lines[i].trim() });
    }
  }
  return starts.map((s, k) => ({
    name: s.line
      .replace(/^\s*(?:async\s+|get\s+|set\s+)?/, "")
      .replace(/[\(:=].*$/, ""),
    line: s.i + 1,
    body: lines
      .slice(s.i, k + 1 < starts.length ? starts[k + 1].i : lines.length)
      .join("\n"),
  }));
}

const methods = classMethods(mainSrc);
const methodBody = (name) => {
  const m = methods.find((x) => x.name === name);
  if (!m) throw new Error(`method not found: ${name}`);
  return m.body;
};

describe("5. entry edits repaint Live Preview callout/table/Bases", () => {
  const save = methodBody("saveSettings");

  it("detects an entries change via a signature of the persisted lists", () => {
    expect(save).toContain("entriesSig");
    expect(save).toContain("this._lastSavedEntriesSig");
    expect(save).toContain("data.wordEntries");
    expect(save).toContain("data.wordEntryGroups");
    expect(save).toContain("data.blacklistEntries");
  });

  it("forces a repaint of all three sig-cached pipelines on change", () => {
    expect(save).toMatch(
      /if \(entriesSig !== this\._lastSavedEntriesSig\) \{[\s\S]*?sweepOrphanLineTargets\(\)/,
    );
    for (const fn of [
      "forceReprocessLivePreviewCallouts",
      "forceReprocessLivePreviewTables",
      "forceReprocessBasesViews",
    ]) {
      expect(save).toContain(`${fn}()`);
    }
  });

  it("forceReprocess really clears the caches (repaint, not sig-skip)", () => {
    const body = methodBody("forceReprocessLivePreviewCallouts");
    expect(body).toContain("_lpCalloutCache = new WeakMap()");
    expect(body).toContain("_lpTableCache = new WeakMap()");
    expect(body).toContain("_basesCache = new WeakMap()");
  });
});

describe("6. heading colour is cleared when its entry is gone", () => {
  it("hoists the clear out of `if (headingEntry)`", () => {
    // Exactly 8-space indent: the INNER else-if (inside the text-channel
    // branch) sits at 12 spaces, so only the hoisted sibling matches.
    expect(mainSrc).toMatch(
      /\n {8}\} else if \(headingEl\.hasAttribute\("data-act-md-colored"\)\) \{/,
    );
    // ...and it really chains onto `if (headingEntry)`, not a deeper block.
    const hoisted = mainSrc.search(
      /\n {8}\} else if \(headingEl\.hasAttribute\("data-act-md-colored"\)\) \{/,
    );
    const opener = mainSrc.indexOf("if (headingEntry) {");
    expect(opener).toBeGreaterThan(-1);
    expect(hoisted).toBeGreaterThan(opener);
  });

  it("drops an earlier text pass when the wrapper takes over", () => {
    expect(mainSrc).toContain(
      "The entry may have changed from text to highlight/both",
    );
    const at = mainSrc.indexOf("headingEl.appendChild(wrapper);");
    expect(at).toBeGreaterThan(-1);
    const after = mainSrc.slice(at, at + 700);
    expect(after).toContain('removeAttribute("data-act-md-colored")');
  });
});

describe("7. list/task marker paint has a clear path", () => {
  const body = methodBody("processMarkdownFormattingInReading");
  const clear = methodBody("_clearListItemPaint");

  it("the no-entries path clears instead of returning early", () => {
    expect(body).toContain("hasAnyListEntry");
    // [^}]*? keeps the match inside the no-entries block — an unbounded
    // [\s\S]*? would hop to a _clearListItemPaint call further down.
    expect(body).toMatch(
      /if \(!hasAnyListEntry\) \{[^}]*?_clearListItemPaint\(li\)/,
    );
    // The old early return is gone.
    expect(body).not.toMatch(
      /!taskCheckedEntry &&\s*\n\s*!taskUncheckedEntry &&\s*\n\s*!bulletEntry &&\s*\n\s*!numberedEntry\s*\n\s*\)\s*\n\s*return;/,
    );
  });

  it("paints only under the guard and clears on every missing-entry path", () => {
    expect(body).toContain("if (hasAnyListEntry) for (const li of listItems)");
    // task-branch else, bullet-branch else, outer else, paragraphs else,
    // blocked li branches ×2, blocked p branch, no-entries path …
    const calls = body.match(/_clearListItemPaint\(/g) || [];
    expect(calls.length).toBeGreaterThanOrEqual(7);
  });

  it("the helper removes colours and unwraps task-marker spans", () => {
    expect(clear).toContain('removeProperty("--act-marker-color")');
    expect(clear).toContain('removeProperty("color")');
    expect(clear).toContain('classList.remove("act-colored-list-item")');
    expect(clear).toContain('querySelectorAll("span[data-act-task-marker]")');
    expect(clear).toContain("parent.removeChild(s)");
  });
});

describe('8. "Color in reading mode" OFF clears everything reading-side', () => {
  const handler = settingsSrc.slice(
    settingsSrc.indexOf('color_in_reading_mode'),
    settingsSrc.indexOf('color_in_live_preview_mode'),
  );

  it("runs the full teardown when switched off", () => {
    expect(handler).toContain("removeEnabledReadingCalloutStyles");
    expect(handler).toContain('style[data-act-line-style="reading"]');
    expect(handler).toContain("clearMarkdownElementDecorations(root)");
    expect(handler).toContain("clearReadingLineTargetClasses(root)");
  });

  it("re-applies the callout stylesheet when switched back on", () => {
    expect(handler).toMatch(
      /forceRefreshAllReadingViews\(\);[\s\S]*?applyEnabledReadingCalloutStyles\(\)/,
    );
  });

  it("the element stylesheet gates its two scopes independently", () => {
    const body = methodBody("applyFormattingStyles");
    expect(body).toContain("editor: !this.settings.disableLivePreviewColoring");
    expect(body).toContain("reading: !this.settings.disableReadingModeColoring");
    // The LP-only tag pill fixups are gated too.
    expect(body).toMatch(
      /isHighlight &&\s*\n\s*!this\.settings\.disableLivePreviewColoring/,
    );
  });

  it("buildMarkdownSelector honours the modes, defaults unchanged", () => {
    const t = { key: "strong", label: "Bold" };
    const both = buildMarkdownSelector(t, null, false);
    const noReading = buildMarkdownSelector(t, null, false, {
      reading: false,
    });
    const noEditor = buildMarkdownSelector(t, null, false, { editor: false });
    // Defaults must be byte-identical to the old `[cm, rend].join(", ")`.
    expect(both).toBe(
      buildMarkdownSelector(t, null, false, { editor: true, reading: true }),
    );
    if (both.includes(", ")) {
      const [cm, rend] = both.split(", ");
      expect(noReading).toBe(cm);
      expect(noEditor).toBe(rend);
      expect(noReading).not.toBe(noEditor);
    }
    expect(buildMarkdownSelector(t, null, false, { editor: false, reading: false })).toBe("");
  });

  it("the live-preview toggle regenerates the element stylesheet too", () => {
    const lpStart = settingsSrc.indexOf("color_in_live_preview_mode");
    expect(lpStart).toBeGreaterThan(-1);
    // The next section divider AFTER the toggle (the settings page has
    // earlier dividers).
    const lpEnd = settingsSrc.indexOf("act-settings-divider", lpStart);
    const lp = settingsSrc.slice(lpStart, lpEnd > -1 ? lpEnd : undefined);
    expect(lp).toContain("applyFormattingStyles()");
  });
});

describe("9. orphan line-target sheets are swept", () => {
  const sweep = methodBody("sweepOrphanLineTargets");
  const cls = methodBody("lineTargetCssClass");

  it("derives ONE class for both sheet flavours", () => {
    expect(cls).toContain(".replace(/[^a-z0-9_-]/g, \"-\")");
    expect(cls).toContain("act-line-");
    const uses = mainSrc.match(/this\.lineTargetCssClass\(m\.entryRef\)/g) || [];
    expect(uses.length).toBe(2); // reading + Live Preview both use it
  });

  it("removes sheets whose class is no longer produced", () => {
    expect(sweep).toContain('querySelectorAll("style[data-act-line-style]")');
    expect(sweep).toContain("keep.has(cls)");
    expect(sweep).toContain("s.remove()");
    // and the recorded reading classes follow the same keep-set
    expect(sweep).toContain('querySelectorAll("[data-act-line-targets]")');
    expect(sweep).toContain("el.classList.remove(cls)");
  });

  it("fails safe: no keep-set → no sweep", () => {
    expect(sweep).toMatch(
      /catch \(_\) \{\s*\n\s*return; \/\/ cannot compute the keep-set/,
    );
  });
});

describe("10. setGlobalEnabled mirrors the hide-text command's callout guard", () => {
  const body = methodBody("setGlobalEnabled");
  it("keeps reading callout styles removed while Hide Text Colors is on", () => {
    expect(body).toMatch(
      /if \(this\.settings\.hideTextColors\) \{\s*\n\s*this\.removeEnabledReadingCalloutStyles\(\);[\s\S]*?this\.applyEnabledReadingCalloutStyles\(\);/,
    );
  });
});

describe("11. border CSS is applied idempotently", () => {
  it("no cssText append remains anywhere", () => {
    expect(mainSrc).not.toContain("cssText +=");
  });

  it("the helper strips and honours !important as written", () => {
    const body = methodBody("applyInlineBorderCss");
    expect(body).toContain("setProperty(prop, val,");
    expect(body).toContain('replace(/\\s*!important\\s*$/i, "")');
  });
});

describe("12. group commands honour the hidden-commands list", () => {
  it("one shared isCommandHidden implementation", () => {
    expect(methodBody("isCommandHidden")).toContain("hiddenCommands");
    expect(mainSrc).toContain(
      "const isCommandHidden = (id) => this.isCommandHidden(id);",
    );
  });

  it("both group registrars gate on it before addCommand", () => {
    const word = methodBody("registerWordGroupCommands");
    const black = methodBody("registerBlacklistGroupCommands");
    for (const body of [word, black]) {
      expect(body).toContain("if (this.isCommandHidden(commandId)) return;");
      const gateAt = body.indexOf("if (this.isCommandHidden(commandId)) return;");
      const pushAt = body.indexOf("_registeredCommandIds.push(commandId)");
      expect(gateAt).toBeGreaterThan(-1);
      expect(gateAt).toBeLessThan(pushAt);
    }
  });
});

describe("13. refresh failures are logged, not silently swallowed", () => {
  it("both hide callbacks report failures", () => {
    expect(mainSrc).toContain(
      '"toggle-hide-text-colors callback failed"',
    );
    expect(mainSrc).toContain(
      '"toggle-hide-highlights callback failed"',
    );
  });

  it("setGlobalEnabled refreshes are individually guarded and logged", () => {
    const body = methodBody("setGlobalEnabled");
    for (const fn of [
      "refreshAllLivePreviewCallouts",
      "forceReprocessLivePreviewCallouts",
      "refreshAllLivePreviewTables",
      "forceReprocessLivePreviewTables",
      "refreshAllBasesViews",
      "forceReprocessBasesViews",
    ]) {
      expect(body).toMatch(
        new RegExp(`try \\{\\s*\\n\\s*this\\.${fn}\\(\\);[\\s\\S]{0,80}?debugError`),
      );
    }
  });
});

describe("14. triggerActiveDocumentRerender has no dead branch", () => {
  const body = methodBody("triggerActiveDocumentRerender");
  it("references activeView exactly once (the live branch)", () => {
    const uses = body.match(/if \(activeView\)/g) || [];
    expect(uses.length).toBe(1);
  });
  it("keeps both refresh paths", () => {
    expect(body).toContain("forceRefreshAllEditors()");
    expect(body).toContain("forceRefreshAllReadingViews()");
  });
});

describe("15. quick-once palette command honours the per-action flags", () => {
  const at = mainSrc.indexOf("notice_select_text_first_once");
  const typeAt = mainSrc.indexOf("onceType,", at);
  const cmd = mainSrc.slice(at, typeAt > -1 ? typeAt + 200 : at + 6000);

  it("derives the modal type from the three once-flags", () => {
    expect(at).toBeGreaterThan(-1);
    expect(typeAt).toBeGreaterThan(-1);
    expect(cmd).toContain("const onceType");
    for (const flag of [
      "enableQuickColorOnce",
      "enableQuickHighlightOnce",
      "enableQuickColorHighlightOnce",
    ]) {
      expect(cmd).toContain(flag);
    }
    // the derived type is what the modal actually receives
    expect(cmd).toMatch(/onceType,\s*\n\s*word,/);
  });

  it("no longer hardcodes the both-channels modal", () => {
    // The literal may legitimately appear inside the onceType ternary —
    // what must not appear is a literal passed as the modal's type arg.
    expect(cmd).not.toMatch(/"text-and-background",\s*\n\s*word,/);
  });
});

describe("16. dead settings keys are gone from the defaults", () => {
  const defaultsSrc = readFileSync(
    join(ROOT, "src", "settings", "defaultSettings.js"),
    "utf8",
  );
  it.each([
    "enableAlwaysColor",
    "enableAlwaysHighlight",
    "enableTextBgMenu",
    "globalHighlightFolded",
    "hideInactiveBlacklistGroupsInDropdowns",
    "highlightStyle",
    "readingModeHighlightFilter",
  ])("%s is no longer declared", (key) => {
    expect(defaultsSrc).not.toMatch(new RegExp(`\\b${key}\\b`));
  });
});
