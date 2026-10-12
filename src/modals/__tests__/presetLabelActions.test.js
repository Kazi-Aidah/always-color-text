/**
 * Preset-label actions cross-check: save-as-preset / unlink / create-group
 * must behave for main-list entries, group-member clones (the modal edits a
 * detached copy there), and text-style (colored-text) entries alike.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {
    constructor() {}
  },
  Menu: class {},
  FuzzySuggestModal: class {},
  setIcon: () => {},
}));

vi.mock("../TextStylePresetsModal.js", () => ({
  TextStylePresetsModal: class {
    constructor() {}
    open() {}
  },
}));

const { nameStyleInstances } = vi.hoisted(() => ({
  nameStyleInstances: [],
}));

vi.mock("../NameStyleModal.js", () => ({
  NameStyleModal: class {
    constructor(app, plugin, opts) {
      this.app = app;
      this.plugin = plugin;
      this.opts = opts || {};
      nameStyleInstances.push(this);
    }
    open() {
      this.opened = true;
    }
  },
}));

import { EditEntryModal } from "../EditEntryModal.js";

function makePlugin(settings) {
  return {
    settings,
    t: (k, fb) => fb,
    isValidHexColor: (hex) => {
      if (hex === "inherit" || hex === "currentColor") return true;
      if (typeof hex !== "string") return false;
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
    },
    saveSettings: async () => {},
    compileWordEntries: () => {},
    compileTextBgColoringEntries: () => {},
    reconfigureEditorExtensions: () => {},
    forceRefreshAllEditors: () => {},
    forceRefreshAllReadingViews: () => {},
    triggerActiveDocumentRerender: () => {},
  };
}

function makeSettings() {
  return {
    wordEntries: [],
    textBgColoringEntries: [],
    wordEntryGroups: [],
    textStylePresets: [
      {
        uid: "tsp-round",
        name: "Round",
        styleType: "highlight",
        textColor: "currentColor",
        backgroundColor: "#3867d6",
        backgroundOpacity: 35,
        highlightBorderRadius: 4,
        cornerShape: "round",
        highlightHorizontalPadding: 4,
        highlightVerticalPadding: 0,
        enableBorderThickness: false,
        borderStyle: "full",
        borderLineStyle: "solid",
        borderOpacity: 100,
        borderThickness: 2,
      },
    ],
  };
}

function makeModal(plugin, entry) {
  const modal = Object.create(EditEntryModal.prototype);
  modal.app = {};
  modal.plugin = plugin;
  modal.entry = entry;
  modal.onSaved = null;
  modal.parentModal = null;
  modal.close = vi.fn();
  return modal;
}

const bothEntry = (over = {}) => ({
  uid: "e-both",
  pattern: "hello",
  color: "",
  textColor: "#ff0000",
  backgroundColor: "#00ff00",
  styleType: "both",
  highlightBorderRadius: 14,
  backgroundOpacity: 50,
  presetUid: "tsp-round",
  ...over,
});

const textEntry = (over = {}) => ({
  uid: "e-text",
  pattern: "world",
  color: "#123456",
  textColor: null,
  backgroundColor: null,
  styleType: "text",
  highlightBorderRadius: 4,
  presetUid: "tsp-round",
  ...over,
});

describe("unlink preset", () => {
  it("drops the stamp on a main-list entry", async () => {
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._unlinkEntryPreset();
    expect(entry.presetUid).toBeUndefined();
    expect(settings.wordEntries[0].presetUid).toBeUndefined();
  });

  it("mirrors the unlink onto the live entry for a group-member clone", async () => {
    const settings = makeSettings();
    const live = bothEntry({ uid: "e-g" });
    settings.wordEntryGroups.push({
      uid: "g1",
      name: "G",
      active: true,
      entries: [live],
    });
    const clone = JSON.parse(JSON.stringify(live));
    const modal = makeModal(makePlugin(settings), clone);
    await modal._unlinkEntryPreset();
    expect(clone.presetUid).toBeUndefined();
    expect(live.presetUid).toBeUndefined();
  });
});

describe("save as new preset", () => {
  it("snapshots shape and colors, links the entry, and closes the editor", async () => {
    const settings = makeSettings();
    const entry = {
      uid: "e-nc",
      pattern: "plain",
      color: "",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      highlightBorderRadius: 20,
      backgroundOpacity: 70,
      presetUid: "tsp-round",
    };
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._saveEntryStyleAsPreset();

    expect(settings.textStylePresets.length).toBe(2);
    const created = settings.textStylePresets[1];
    expect(created.uid).toMatch(/^tsp-/);
    expect(created.isDefault).toBe(false);
    expect(created.highlightBorderRadius).toBe(20);
    expect(created.backgroundOpacity).toBe(70);
    // A colorless text entry saves empty color channels (never undefined).
    expect(created.textColor).toBe("");
    expect(created.backgroundColor).toBe("");
    expect(entry.presetUid).toBe(created.uid);
    // The "Edit Text Style" editor dismisses once the flow is done.
    expect(modal.close).toHaveBeenCalled();
  });

  it("saves a text entry's color into the preset's text channel", async () => {
    const settings = makeSettings();
    const entry = {
      uid: "e-tc",
      pattern: "plain",
      color: "#abcdef",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      highlightBorderRadius: 12,
    };
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._saveEntryStyleAsPreset("Named");

    const created = settings.textStylePresets[1];
    expect(created.name).toBe("Named");
    // `color` stays entry-side; presets paint through textColor.
    expect(created.textColor).toBe("#abcdef");
    expect(created.backgroundColor).toBe("");
    expect(created.color).toBeUndefined();
    expect(modal.close).toHaveBeenCalled();
  });

  it("keeps a highlight entry's own colors and saves them to the preset", async () => {
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._saveEntryStyleAsPreset();

    expect(entry.textColor).toBe("#ff0000");
    expect(entry.backgroundColor).toBe("#00ff00");
    const created = settings.textStylePresets[1];
    expect(created.textColor).toBe("#ff0000");
    expect(created.backgroundColor).toBe("#00ff00");
    expect(entry.presetUid).toBe(created.uid);
    expect(modal.close).toHaveBeenCalled();
  });

  it("keeps a colored-text entry's color and stamps the live clone", async () => {
    const settings = makeSettings();
    const live = textEntry({ uid: "e-tg" });
    settings.wordEntryGroups.push({
      uid: "g1",
      name: "G",
      active: true,
      entries: [live],
    });
    const clone = JSON.parse(JSON.stringify(live));
    const modal = makeModal(makePlugin(settings), clone);
    await modal._saveEntryStyleAsPreset();

    const created = settings.textStylePresets[1];
    expect(clone.color).toBe("#123456");
    expect(clone.presetUid).toBe(created.uid);
    // The stamp reaches live settings even though the modal edits a clone.
    expect(live.presetUid).toBe(created.uid);
    expect(created.color).toBeUndefined();
    // The entry's text color travels in the preset's text channel.
    expect(created.textColor).toBe("#123456");
    expect(modal.close).toHaveBeenCalled();
  });
});

describe("create group with this style", () => {
  it("moves a main-list colored entry into a per-entry shaped group", async () => {
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._createGroupWithEntryStyle();

    expect(settings.wordEntries.length).toBe(0);
    expect(settings.wordEntryGroups.length).toBe(1);
    const group = settings.wordEntryGroups[0];
    expect(group.entries.length).toBe(1);
    expect(group.entries[0]).toBe(entry);
    expect(entry.groupUid).toBe(group.uid);
    // Per-entry: no colors/type forcing, no preset stamp…
    expect(group.styleType).toBe("");
    expect(group.textColor).toBeUndefined();
    expect(group.backgroundColor).toBeUndefined();
    expect(group.presetUid).toBeUndefined();
    // …but the shape went over, and the entry renders as before.
    expect(group.highlightBorderRadius).toBe(14);
    expect(group.backgroundOpacity).toBe(50);
    expect(entry.textColor).toBe("#ff0000");
    expect(entry.backgroundColor).toBe("#00ff00");
    // The "Edit Text Style" editor dismisses once the flow is done.
    expect(modal.close).toHaveBeenCalled();
  });

  it("moves a group member out of its old group", async () => {
    const settings = makeSettings();
    const live = textEntry({ uid: "e-mv" });
    settings.wordEntryGroups.push({
      uid: "g-old",
      name: "Old",
      active: true,
      entries: [live],
    });
    const clone = JSON.parse(JSON.stringify(live));
    const modal = makeModal(makePlugin(settings), clone);
    await modal._createGroupWithEntryStyle();

    const oldGroup = settings.wordEntryGroups.find((g) => g.uid === "g-old");
    expect(oldGroup.entries.length).toBe(0);
    expect(settings.wordEntryGroups.length).toBe(2);
    const fresh = settings.wordEntryGroups.find((g) => g.uid !== "g-old");
    expect(fresh.entries.length).toBe(1);
    expect(fresh.entries[0].uid).toBe("e-mv");
    expect(fresh.entries[0].groupUid).toBe(fresh.uid);
    expect(fresh.styleType).toBe("");
    // Colored-text member keeps its color.
    expect(fresh.entries[0].color).toBe("#123456");
  });
});

// The pill is always present, so an entry with no presetUid must still reach
// both universal actions. Only "Stop using preset" is unavailable there.
describe("actions on entries without a preset", () => {
  // Param-aware translator so we can assert the interpolated group name.
  function paramT(k, fb, params) {
    let s = fb;
    if (params && typeof s === "string") {
      for (const key of Object.keys(params)) {
        s = s.replace(new RegExp(`\\{${key}\\}`, "g"), String(params[key]));
      }
    }
    return s;
  }

  it("save as new preset uses the default name (no stray ' copy')", async () => {
    const settings = makeSettings();
    const entry = {
      uid: "e-plain",
      pattern: "plain",
      color: "#abcdef",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      highlightBorderRadius: 12,
    };
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._saveEntryStyleAsPreset();

    const created = settings.textStylePresets[1];
    expect(created.name).toBe("New Preset");
    expect(created.textColor).toBe("#abcdef");
    expect(created.highlightBorderRadius).toBe(12);
    expect(entry.presetUid).toBe(created.uid);
    // The stamp reaches live settings even when the entry had no base preset.
    expect(settings.wordEntries[0].presetUid).toBe(created.uid);
  });

  it("create group with this style works without a preset", async () => {
    const settings = makeSettings();
    const entry = {
      uid: "e-plain-g",
      pattern: "hello",
      color: "",
      textColor: "#ff0000",
      backgroundColor: "#00ff00",
      styleType: "both",
      highlightBorderRadius: 14,
      backgroundOpacity: 50,
    };
    settings.wordEntries.push(entry);
    const plugin = makePlugin(settings);
    plugin.t = paramT;
    const modal = makeModal(plugin, entry);
    await modal._createGroupWithEntryStyle();

    expect(settings.wordEntries.length).toBe(0);
    expect(settings.wordEntryGroups.length).toBe(1);
    const group = settings.wordEntryGroups[0];
    expect(group.entries.length).toBe(1);
    expect(group.entries[0]).toBe(entry);
    expect(entry.groupUid).toBe(group.uid);
    // Default group name, since there is no preset to borrow a name from.
    expect(group.name).toBe("New Preset Group");
    expect(group.presetUid).toBeUndefined();
    expect(entry.textColor).toBe("#ff0000");
    expect(entry.backgroundColor).toBe("#00ff00");
  });
});

// "Save as new preset" routes through a naming step; the snapshot itself only
// happens once the user confirms, with the name they typed.
describe("save-as-preset naming step", () => {
  it("uses an explicit name when one is given", async () => {
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._saveEntryStyleAsPreset("My Preset");

    expect(settings.textStylePresets[1].name).toBe("My Preset");
    expect(modal.close).toHaveBeenCalled();
  });

  it("prompts with a '<preset> copy' default and defers the save", async () => {
    nameStyleInstances.length = 0;
    const settings = makeSettings();
    const entry = bothEntry(); // linked to preset "Round"
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    modal._promptSaveEntryStyleAsPreset();

    expect(nameStyleInstances.length).toBe(1);
    const inst = nameStyleInstances[0];
    expect(inst.opened).toBe(true);
    expect(inst.opts.defaultName).toBe("Round copy");
    // Nothing is created until the user confirms.
    expect(settings.textStylePresets.length).toBe(1);
    // Preview carries the entry's resolved colours.
    expect(inst.opts.styleObj.textColor).toBe("#ff0000");
    expect(inst.opts.styleObj.backgroundColor).toBe("#00ff00");

    await inst.opts.onSave("Chosen Name");
    expect(
      settings.textStylePresets[settings.textStylePresets.length - 1].name,
    ).toBe("Chosen Name");
    // Confirming also dismisses the "Edit Text Style" editor.
    expect(modal.close).toHaveBeenCalled();
  });

  it("prompts with the default name for an entry without a preset", () => {
    nameStyleInstances.length = 0;
    const settings = makeSettings();
    const entry = {
      uid: "e-np",
      pattern: "x",
      color: "#123456",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      highlightBorderRadius: 6,
    };
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    modal._promptSaveEntryStyleAsPreset();

    const inst = nameStyleInstances[0];
    expect(inst.opts.defaultName).toBe("New Preset");
    // Text-style entries keep their colour in `color`; the preview resolves it.
    expect(inst.opts.styleObj.textColor).toBe("#123456");
  });
});

// "Create new group with this style" routes through the same naming modal with
// group wording; the group is only created once the user confirms the name.
describe("create-group naming step", () => {
  // Param-aware translator so the interpolated "<preset> Group" default is real.
  function paramT(k, fb, params) {
    let s = fb;
    if (params && typeof s === "string") {
      for (const key of Object.keys(params)) {
        s = s.replace(new RegExp(`\\{${key}\\}`, "g"), String(params[key]));
      }
    }
    return s;
  }

  function pluginWithParamT(settings) {
    const plugin = makePlugin(settings);
    plugin.t = paramT;
    return plugin;
  }

  it("prompts with a '<preset> Group' default and defers creation", async () => {
    nameStyleInstances.length = 0;
    const settings = makeSettings();
    const entry = bothEntry(); // linked to preset "Round"
    settings.wordEntries.push(entry);
    const modal = makeModal(pluginWithParamT(settings), entry);
    modal._promptCreateGroupWithEntryStyle();

    expect(nameStyleInstances.length).toBe(1);
    const inst = nameStyleInstances[0];
    expect(inst.opened).toBe(true);
    expect(inst.opts.titleKey).toBe("save_group_title");
    expect(inst.opts.placeholderKey).toBe("new_group_name");
    expect(inst.opts.defaultName).toBe("Round Group");
    // Nothing is created until the user confirms.
    expect(settings.wordEntryGroups.length).toBe(0);
    expect(settings.wordEntries.length).toBe(1);
    // Preview carries the entry's resolved colours.
    expect(inst.opts.styleObj.textColor).toBe("#ff0000");
    expect(inst.opts.styleObj.backgroundColor).toBe("#00ff00");

    await inst.opts.onSave("My Group");
    expect(settings.wordEntries.length).toBe(0);
    expect(settings.wordEntryGroups.length).toBe(1);
    expect(settings.wordEntryGroups[0].name).toBe("My Group");
    // Confirming also dismisses the "Edit Text Style" editor.
    expect(modal.close).toHaveBeenCalled();
  });

  it("prompts with the default name for an entry without a preset", () => {
    nameStyleInstances.length = 0;
    const settings = makeSettings();
    const entry = {
      uid: "e-npg",
      pattern: "x",
      color: "#123456",
      textColor: null,
      backgroundColor: null,
      styleType: "text",
      highlightBorderRadius: 6,
    };
    settings.wordEntries.push(entry);
    const modal = makeModal(pluginWithParamT(settings), entry);
    modal._promptCreateGroupWithEntryStyle();

    const inst = nameStyleInstances[0];
    expect(inst.opts.defaultName).toBe("New Preset Group");
    expect(inst.opts.styleObj.textColor).toBe("#123456");
  });

  it("uses an explicit name when one is given", async () => {
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    await modal._createGroupWithEntryStyle("Named Group");

    expect(settings.wordEntryGroups.length).toBe(1);
    expect(settings.wordEntryGroups[0].name).toBe("Named Group");
    expect(settings.wordEntryGroups[0].entries[0]).toBe(entry);
    expect(modal.close).toHaveBeenCalled();
  });

  it("does not stack a second naming dialog while one is open", () => {
    nameStyleInstances.length = 0;
    const settings = makeSettings();
    const entry = bothEntry();
    settings.wordEntries.push(entry);
    const modal = makeModal(makePlugin(settings), entry);
    modal._namingModal = { isOpen: true };
    modal._promptCreateGroupWithEntryStyle();
    modal._promptSaveEntryStyleAsPreset();

    expect(nameStyleInstances.length).toBe(0);
  });
});
