// Regression: mobile toolbar icons.
//
// Obsidian's mobile toolbar reads `command.icon` and substitutes a built-in
// "question mark in a circle" glyph when it is empty, so iconless commands
// always render as a "?" there.
//
// It also caches the compiled button list and only rebuilds when the
// configured command id list changes, so icons have to be present on the
// command registry AND the cache has to be invalidated for them to show up.
//
// These tests lock all of that down: every command this plugin registers
// resolves to an icon, enforcement repairs iconless/broken commands, and the
// toolbar cache is refreshed.

import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const HOISTED = vi.hoisted(() => {
  const known = new Set([
    // Icons used by this plugin (validated against Obsidian's Lucide set).
    "palette",
    "file-input",
    "plus-circle",
    "highlighter",
    "file-xcorner",
    "zap",
    "power",
    "eye-off",
    "view",
    "book-open",
    "settings",
    "list",
    "regex",
    "shield-off",
    "tag",
    "circle-slashed",
    "circle",
    // A valid custom icon a user may have picked (e.g. via Commander).
    "star",
  ]);
  // Legacy ids that still render through Obsidian's alias map
  // (e.g. "gear" -> "settings").
  const aliases = { gear: "settings" };
  return { known, aliases };
});

vi.mock("obsidian", () => ({
  getIcon: vi.fn((id) => {
    // Mirrors Obsidian's resolver: `lucide-` prefixed ids are stripped first.
    const bare = id.startsWith("lucide-") ? id.slice(7) : id;
    if (HOISTED.known.has(bare)) return {};
    const target = HOISTED.aliases[bare];
    if (target && HOISTED.known.has(target)) return {};
    return null;
  }),
  getIconIds: vi.fn(() => [
    ...HOISTED.known,
    ...[...HOISTED.known].map((id) => `lucide-${id}`),
  ]),
}));

import { getIcon } from "obsidian";
import {
  COMMAND_ICONS,
  resolveCommandIcon,
  isValidIconId,
  pickIcon,
  enforceCommandIcons,
  refreshMobileToolbar,
  applyCommandIcons,
} from "../commandIcons.js";

const PLUGIN_ID = "always-color-text";

function makeApp({ commands = {}, toolbar = null, toolbarCommands = [] } = {}) {
  return {
    commands: { commands },
    mobileToolbar: toolbar,
    vault: {
      getConfig: (key) =>
        key === "mobileToolbarCommands" ? toolbarCommands : undefined,
    },
  };
}

function command(icon) {
  return icon === undefined ? {} : { icon };
}

describe("resolveCommandIcon", () => {
  it("resolves every static command id, bare and fully qualified", () => {
    for (const id of Object.keys(COMMAND_ICONS)) {
      expect(resolveCommandIcon(id)).toBe(COMMAND_ICONS[id]);
      expect(resolveCommandIcon(`${PLUGIN_ID}:${id}`)).toBe(
        COMMAND_ICONS[id],
      );
    }
  });

  it("covers the commands the plugin registers by default", () => {
    // These four are the defaults pinned to the mobile toolbar.
    expect(resolveCommandIcon(`${PLUGIN_ID}:set-color-for-selection`)).toBe(
      "palette",
    );
    expect(
      resolveCommandIcon(`${PLUGIN_ID}:color-text-for-current-file`),
    ).toBe("file-input");
    expect(resolveCommandIcon(`${PLUGIN_ID}:add-to-existing-entry`)).toBe(
      "plus-circle",
    );
    expect(
      resolveCommandIcon(`${PLUGIN_ID}:color-highlight-once-selected-text`),
    ).toBe("highlighter");
  });

  it("uses the requested icons for the document toggle and hide toggles", () => {
    expect(
      resolveCommandIcon(`${PLUGIN_ID}:toggle-coloring-for-current-document`),
    ).toBe("file-xcorner");
    expect(resolveCommandIcon(`${PLUGIN_ID}:toggle-hide-text-colors`)).toBe(
      "eye-off",
    );
    expect(resolveCommandIcon(`${PLUGIN_ID}:toggle-hide-highlights`)).toBe(
      "view",
    );
  });

  it("resolves dynamically generated group toggle commands", () => {
    expect(resolveCommandIcon(`${PLUGIN_ID}:toggle-word-group-a1b2`)).toBe(
      "tag",
    );
    expect(
      resolveCommandIcon(`${PLUGIN_ID}:toggle-blacklist-group-a1b2`),
    ).toBe("circle-slashed");
  });

  it("ignores unknown ids and other plugins' commands", () => {
    expect(resolveCommandIcon(`${PLUGIN_ID}:nope`)).toBeNull();
    expect(resolveCommandIcon("cmdr:macro-12")).toBeNull();
    expect(resolveCommandIcon("editor:undo")).toBeNull();
    expect(resolveCommandIcon("")).toBeNull();
    expect(resolveCommandIcon(null)).toBeNull();
  });

  it("only returns icons that render in this Obsidian build", () => {
    for (const icon of Object.values(COMMAND_ICONS)) {
      expect(isValidIconId(icon)).toBe(true);
    }
  });
});

describe("isValidIconId", () => {
  it("rejects empty and non-string values", () => {
    expect(isValidIconId("")).toBe(false);
    expect(isValidIconId("   ")).toBe(false);
    expect(isValidIconId(null)).toBe(false);
    expect(isValidIconId(undefined)).toBe(false);
    expect(isValidIconId(42)).toBe(false);
  });

  it("accepts ids that render directly or through a legacy alias", () => {
    expect(isValidIconId("palette")).toBe(true);
    expect(isValidIconId("lucide-palette")).toBe(true);
    // "gear" is not a Lucide id but resolves via Obsidian's alias map.
    expect(isValidIconId("gear")).toBe(true);
  });

  it("rejects ids that cannot be rendered", () => {
    expect(isValidIconId("no-such-icon")).toBe(false);
    expect(isValidIconId("question")).toBe(false);
  });

  it("falls back to getIconIds() when getIcon() is unavailable", () => {
    getIcon.mockImplementationOnce(() => {
      throw new Error("no resolver");
    });
    expect(isValidIconId("star")).toBe(true);

    getIcon.mockImplementationOnce(() => {
      throw new Error("no resolver");
    });
    expect(isValidIconId("definitely-not-an-icon")).toBe(false);
  });
});

describe("pickIcon", () => {
  it("keeps a preferred icon that exists in the build", () => {
    expect(pickIcon("palette")).toBe("palette");
  });

  it("falls back when the preferred icon does not exist", () => {
    expect(pickIcon("definitely-not-an-icon")).toBe("circle");
  });

  it("returns null without a preference", () => {
    expect(pickIcon(null)).toBeNull();
    expect(pickIcon("")).toBeNull();
  });
});

describe("enforceCommandIcons", () => {
  it("fills iconless commands with their default icon", () => {
    const app = makeApp({
      commands: {
        [`${PLUGIN_ID}:set-color-for-selection`]: command(),
        [`${PLUGIN_ID}:toggle-always-color-text`]: command(null),
        [`${PLUGIN_ID}:toggle-word-group-x`]: command(""),
      },
    });

    const changed = enforceCommandIcons(app, PLUGIN_ID);

    expect(changed).toBe(3);
    expect(
      app.commands.commands[`${PLUGIN_ID}:set-color-for-selection`].icon,
    ).toBe("palette");
    expect(
      app.commands.commands[`${PLUGIN_ID}:toggle-always-color-text`].icon,
    ).toBe("power");
    expect(app.commands.commands[`${PLUGIN_ID}:toggle-word-group-x`].icon).toBe(
      "tag",
    );
  });

  it("repairs icons that do not exist in this build", () => {
    const app = makeApp({
      commands: {
        [`${PLUGIN_ID}:add-to-existing-entry`]: command("no-such-icon"),
      },
    });

    enforceCommandIcons(app, PLUGIN_ID);

    expect(
      app.commands.commands[`${PLUGIN_ID}:add-to-existing-entry`].icon,
    ).toBe("plus-circle");
  });

  it("leaves valid custom icons alone (Commander-style overrides)", () => {
    const app = makeApp({
      commands: {
        [`${PLUGIN_ID}:set-color-for-selection`]: command("star"),
      },
    });

    const changed = enforceCommandIcons(app, PLUGIN_ID);

    expect(changed).toBe(0);
    expect(
      app.commands.commands[`${PLUGIN_ID}:set-color-for-selection`].icon,
    ).toBe("star");
  });

  it("keeps custom icons that only render through a legacy alias", () => {
    const app = makeApp({
      commands: {
        [`${PLUGIN_ID}:open-plugin-settings`]: command("gear"),
      },
    });

    expect(enforceCommandIcons(app, PLUGIN_ID)).toBe(0);
    expect(
      app.commands.commands[`${PLUGIN_ID}:open-plugin-settings`].icon,
    ).toBe("gear");
  });

  it("does not touch other plugins' commands", () => {
    const app = makeApp({
      commands: {
        "cmdr:macro-12": command(),
        "editor:undo": command(),
      },
    });

    expect(enforceCommandIcons(app, PLUGIN_ID)).toBe(0);
    expect(app.commands.commands["cmdr:macro-12"].icon).toBeUndefined();
    expect(app.commands.commands["editor:undo"].icon).toBeUndefined();
  });

  it("is a no-op without a command registry", () => {
    expect(enforceCommandIcons(null, PLUGIN_ID)).toBe(0);
    expect(enforceCommandIcons({}, PLUGIN_ID)).toBe(0);
  });
});

describe("refreshMobileToolbar", () => {
  it("invalidates the compiled-toolbar cache and recompiles", () => {
    const toolbar = {
      lastCommandIds: '[ "editor:undo" ]',
      compileToolbar: vi.fn(),
    };
    const app = makeApp({ toolbar, toolbarCommands: ["editor:undo"] });

    expect(refreshMobileToolbar(app)).toBe(true);
    expect(toolbar.lastCommandIds).toBeNull();
    expect(toolbar.compileToolbar).toHaveBeenCalledTimes(1);
  });

  it("is a no-op on desktop (no mobile toolbar)", () => {
    expect(refreshMobileToolbar({ mobileToolbar: null })).toBe(false);
    expect(refreshMobileToolbar({})).toBe(false);
    expect(refreshMobileToolbar(null)).toBe(false);
  });

  it("does not rebuild when the toolbar config is missing", () => {
    const toolbar = { lastCommandIds: "x", compileToolbar: vi.fn() };
    const app = makeApp({ toolbar });
    app.vault.getConfig = () => undefined;

    expect(refreshMobileToolbar(app)).toBe(false);
    expect(toolbar.compileToolbar).not.toHaveBeenCalled();
    expect(toolbar.lastCommandIds).toBe("x");
  });

  it("swallows toolbar errors", () => {
    const toolbar = {
      lastCommandIds: "x",
      compileToolbar: () => {
        throw new Error("boom");
      },
    };
    const app = makeApp({ toolbar, toolbarCommands: ["editor:undo"] });
    expect(refreshMobileToolbar(app)).toBe(false);
  });
});

describe("applyCommandIcons", () => {
  it("enforces icons and refreshes the toolbar in one pass", () => {
    const toolbar = { lastCommandIds: "x", compileToolbar: vi.fn() };
    const app = makeApp({
      commands: { [`${PLUGIN_ID}:set-color-for-selection`]: command() },
      toolbar,
    });

    expect(applyCommandIcons(app, PLUGIN_ID)).toBe(1);
    expect(
      app.commands.commands[`${PLUGIN_ID}:set-color-for-selection`].icon,
    ).toBe("palette");
    expect(toolbar.compileToolbar).toHaveBeenCalledTimes(1);
  });
});

describe("source regression: no iconless commands can be registered", () => {
  const root = join(__dirname, "..", "..", "..");
  const source = readFileSync(
    join(root, "src", "core", "AlwaysColorText.js"),
    "utf8",
  );

  it("finds the command registration call sites", () => {
    expect(source).toContain("addTrackedCommand({");
    expect(source).toContain("this.addCommand({");
  });

  it("keeps manage-colored-texts and drops its duplicate", () => {
    // "Colored Texts Settings" did exactly the same as "Manage Colored
    // Texts" — the first one is the canonical command now.
    expect(source).toContain('id: "manage-colored-texts"');
    expect(source).not.toContain('id: "open-colored-texts-settings"');
    expect(COMMAND_ICONS["manage-colored-texts"]).toBeTruthy();
    expect(COMMAND_ICONS["open-colored-texts-settings"]).toBeUndefined();
  });

  it("every literal command id used at registration resolves an icon", () => {
    const literalIds = [];
    const re = /add(?:Tracked)?Command\(\{[\s\S]{0,400}?id:\s*"([^"]+)"/g;
    let match;
    while ((match = re.exec(source)) !== null) {
      literalIds.push(match[1]);
    }

    // The static command palette plus the standalone changelog command.
    expect(literalIds.length).toBeGreaterThanOrEqual(10);

    for (const id of literalIds) {
      expect(
        resolveCommandIcon(id),
        `command "${id}" is registered without a default mobile toolbar icon`,
      ).toBeTruthy();
    }
  });
});
