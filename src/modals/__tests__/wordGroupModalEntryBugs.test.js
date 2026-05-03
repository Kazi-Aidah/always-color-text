/**
 * Bugfix spec: word-group-modal-entry-bugs
 * Task 1: Bug condition exploration test
 *
 * These tests demonstrate that BOTH bugs exist on UNFIXED code.
 * They are EXPECTED TO FAIL on unfixed code — failure confirms the bugs exist.
 *
 * Bug 1 (Requirement 1.1 / 2.1): Regex entries rendered in EditWordGroupModal
 *   do not have a presetLabel input field.
 *
 * Bug 2 (Requirement 2.2): EditEntryModal is opened from the word group modal
 *   without a parentModal reference (5th arg is undefined), and
 *   EditWordGroupModal.prototype._refreshEntries does not exist.
 */

import { describe, it, expect, vi, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Minimal DOM helpers
// ---------------------------------------------------------------------------

/**
 * Creates a minimal DOM-like element that supports the Obsidian-style
 * createEl / createDiv / addClass / addEventListener / style API.
 */
function makeDomEl(tag = "div") {
  const el = {
    _tag: tag,
    _children: [],
    _classes: [],
    _listeners: {},
    style: {},
    textContent: "",
    innerHTML: "",
    placeholder: "",
    value: "",
    checked: false,
    disabled: false,
    title: "",
    type: "",

    createEl(childTag, opts = {}) {
      const child = makeDomEl(childTag);
      if (opts.text) child.textContent = opts.text;
      if (opts.type) child.type = opts.type;
      if (opts.value !== undefined) child.value = opts.value;
      this._children.push(child);
      return child;
    },

    createDiv(opts = {}) {
      const child = makeDomEl("div");
      if (opts && opts.text) child.textContent = opts.text;
      this._children.push(child);
      return child;
    },

    addClass(cls) {
      this._classes.push(cls);
    },

    addEventListener(event, fn) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
    },

    removeEventListener(event, fn) {
      if (this._listeners[event]) {
        this._listeners[event] = this._listeners[event].filter((f) => f !== fn);
      }
    },

    empty() {
      this._children = [];
    },

    /** Trigger a contextmenu event on this element */
    _triggerContextMenu() {
      const handlers = this._listeners["contextmenu"] || [];
      const fakeEv = {
        type: "contextmenu",
        clientX: 0,
        clientY: 0,
        preventDefault() {},
        stopPropagation() {},
      };
      handlers.forEach((fn) => fn(fakeEv));
    },

    /** Recursively find all input elements matching a predicate */
    _findInputs(predicate) {
      const results = [];
      const walk = (node) => {
        if (node._tag === "input" && predicate(node)) results.push(node);
        (node._children || []).forEach(walk);
      };
      walk(this);
      return results;
    },
  };
  return el;
}

// ---------------------------------------------------------------------------
// Obsidian mock
// ---------------------------------------------------------------------------
// NOTE: vi.mock is hoisted. The Menu constructor stores the last instance on
// globalThis.__lastMenuInstance so tests can access it without closure issues.

vi.mock("obsidian", () => {
  class Modal {
    constructor(app) {
      this.app = app;
      this.modalEl = {
        style: {},
        addClass() {},
        classList: { add() {} },
      };
      this.contentEl = makeDomEl("div");
    }
    open() {}
    close() {}
  }

  class FuzzySuggestModal extends Modal {
    constructor(app) {
      super(app);
    }
    setPlaceholder() {}
    getItems() { return []; }
    getItemText() { return ""; }
    onChooseItem() {}
    open() {}
    close() {}
  }

  class Menu {
    constructor() {
      this._items = [];
      // Store on globalThis so tests can access the last created Menu instance
      globalThis.__lastMenuInstance = this;
    }
    addItem(fn) {
      const item = {
        _title: "",
        _onClick: null,
        setTitle(t) {
          this._title = t;
          return this;
        },
        setIcon() {
          return this;
        },
        onClick(fn) {
          this._onClick = fn;
          return this;
        },
      };
      fn(item);
      this._items.push(item);
      return this;
    }
    showAtPosition() {}
  }

  function setIcon() {}
  class Notice {}
  class Component {}
  class MarkdownRenderer {}

  return { Modal, FuzzySuggestModal, Menu, setIcon, Notice, Component, MarkdownRenderer };
});

// ---------------------------------------------------------------------------
// Mock all other modal imports so they don't blow up on import
// ---------------------------------------------------------------------------

vi.mock("../HighlightStylingModal.js", () => ({
  HighlightStylingModal: class {
    constructor() {}
    open() {}
  },
}));

vi.mock("../RealTimeRegexTesterModal.js", () => ({
  RealTimeRegexTesterModal: class {
    constructor() {}
    open() {}
  },
}));

vi.mock("../PresetModal.js", () => ({
  PresetModal: class {
    constructor() {}
    open() {}
  },
}));

vi.mock("../ColorPickerModal.js", () => ({
  ColorPickerModal: class {
    constructor() {}
    open() {}
  },
}));

vi.mock("../AlertModal.js", () => ({
  AlertModal: class {
    constructor() {}
    open() {}
  },
}));

vi.mock("../ConfirmationModal.js", () => ({
  ConfirmationModal: class {
    constructor() {}
    open() {}
  },
}));

vi.mock("../CustomCssModal.js", () => ({
  CustomCssModal: class {
    constructor() {}
    open() {}
  },
}));

vi.mock("../AddToExistingEntryModal.js", () => ({
  AddToExistingEntryModal: class {
    constructor() {}
    open() {}
  },
}));

vi.mock("../../utils/debug.js", () => ({
  debugLog: () => {},
  debugError: () => {},
}));

// ---------------------------------------------------------------------------
// Import the real classes under test
// ---------------------------------------------------------------------------

import { EditWordGroupModal } from "../EditWordGroupModal.js";
import { EditEntryModal } from "../EditEntryModal.js";

// ---------------------------------------------------------------------------
// Minimal mock plugin factory
// ---------------------------------------------------------------------------

function makeMockPlugin(entries = []) {
  const group = {
    uid: "test-group-uid",
    name: "Test Group",
    active: true,
    entries,
  };

  return {
    settings: {
      wordEntryGroups: [group],
      wordEntries: [],
      enableRegexSupport: true,
      enableCustomCss: false,
      caseSensitive: false,
      partialMatch: true,
    },
    t(key, fallback) {
      return fallback || key;
    },
    isValidHexColor(c) {
      return /^#[0-9A-Fa-f]{6}$/.test(c);
    },
  };
}

/**
 * Build a minimal EditWordGroupModal instance with a pre-wired _listDiv
 * so _refreshGroupEntries can render into it without calling onOpen().
 */
function makeModal(entries) {
  const plugin = makeMockPlugin(entries);
  const group = plugin.settings.wordEntryGroups[0];
  const app = {};

  const modal = new EditWordGroupModal(
    app,
    plugin,
    group,
    () => {}, // onSave
    () => {}, // onDelete
  );

  // Wire up _listDiv manually (normally set in onOpen)
  modal._listDiv = makeDomEl("div");

  return { modal, plugin, group };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Bug condition exploration — word-group-modal-entry-bugs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.__lastMenuInstance = null;
  });

  // -------------------------------------------------------------------------
  // Bug 1: Regex entry rendered without presetLabel input
  // -------------------------------------------------------------------------
  describe("Bug 1: presetLabel input missing for regex entries", () => {
    it(
      "Bug 1 sub-test: rendered row for a regex entry MUST contain an input " +
        "with value === presetLabel and placeholder matching 'name your regex'",
      () => {
        /**
         * Validates: Requirements 1.1, 2.1
         *
         * On UNFIXED code this test FAILS because _refreshGroupEntries never
         * creates a presetLabel input for regex entries.
         */
        const regexEntry = {
          uid: "entry-uid-1",
          isRegex: true,
          presetLabel: "My Regex",
          pattern: "\\bfoo\\b",
          flags: "i",
          color: "#ff0000",
          styleType: "text",
          matchType: "contains",
        };

        const { modal } = makeModal([regexEntry]);

        // Render the entry rows
        modal._refreshGroupEntries();

        // Collect all input elements rendered inside _listDiv
        const allInputs = modal._listDiv._findInputs(() => true);

        // Find an input whose value equals the presetLabel
        const labelInput = allInputs.find((inp) => inp.value === "My Regex");

        // Find an input whose placeholder matches "name your regex"
        const placeholderInput = allInputs.find(
          (inp) =>
            typeof inp.placeholder === "string" &&
            inp.placeholder.toLowerCase().includes("name your regex"),
        );

        // ASSERTION: On unfixed code, both of these will be undefined → test FAILS
        expect(labelInput).toBeDefined();
        expect(placeholderInput).toBeDefined();
        // Both should be the same input element
        expect(labelInput).toBe(placeholderInput);
      },
    );
  });

  // -------------------------------------------------------------------------
  // Bug 2a: EditEntryModal opened without parentModal (5th arg is undefined)
  // -------------------------------------------------------------------------
  describe("Bug 2a: EditEntryModal constructed without parentModal", () => {
    it(
      "Bug 2a sub-test: the 5th argument passed to new EditEntryModal(...) " +
        "from the context-menu 'Edit Entry Details' handler MUST be the " +
        "EditWordGroupModal instance (this)",
      () => {
        /**
         * Validates: Requirements 2.2
         *
         * On UNFIXED code this test FAILS because the EditEntryModal constructor
         * call in _refreshGroupEntries omits the 5th argument (parentModal),
         * so this.parentModal is undefined inside EditEntryModal.
         */
        const entry = {
          uid: "entry-uid-2",
          isRegex: false,
          pattern: "hello",
          color: "#0000ff",
          styleType: "text",
          matchType: "contains",
        };

        const { modal } = makeModal([entry]);

        // Spy on EditEntryModal.prototype.open to capture this.parentModal
        // when the modal is opened from the context menu handler.
        let capturedParentModal = "NOT_SET";
        vi.spyOn(EditEntryModal.prototype, "open").mockImplementation(
          function () {
            capturedParentModal = this.parentModal;
          },
        );

        // Render the entry rows
        modal._refreshGroupEntries();

        // Trigger the context menu on the first rendered row.
        // This creates a Menu (stored in globalThis.__lastMenuInstance),
        // adds items, and calls menu.showAtPosition().
        const rows = modal._listDiv._children;
        expect(rows.length).toBeGreaterThan(0);
        rows[0]._triggerContextMenu();

        // Access the Menu instance created by the contextmenu handler
        const menuInstance = globalThis.__lastMenuInstance;
        expect(menuInstance).not.toBeNull();

        // Find the "Edit Entry Details" item and click it
        const editItem = menuInstance._items.find(
          (item) =>
            typeof item._title === "string" &&
            item._title.toLowerCase().includes("edit entry details"),
        );
        expect(editItem).toBeDefined();
        expect(typeof editItem._onClick).toBe("function");

        // Click "Edit Entry Details" — this constructs and opens EditEntryModal
        editItem._onClick();

        // ASSERTION: On unfixed code, capturedParentModal will be undefined → test FAILS
        expect(capturedParentModal).toBe(modal);
      },
    );
  });

  // -------------------------------------------------------------------------
  // Bug 2b: _refreshEntries alias missing on EditWordGroupModal
  // -------------------------------------------------------------------------
  describe("Bug 2b: _refreshEntries alias missing", () => {
    it(
      "Bug 2b sub-test: EditWordGroupModal.prototype._refreshEntries MUST be a function",
      () => {
        /**
         * Validates: Requirements 2.2
         *
         * On UNFIXED code this test FAILS because EditWordGroupModal only exposes
         * _refreshGroupEntries, not _refreshEntries.
         * EditEntryModal.saveHandler calls this.parentModal._refreshEntries(),
         * so the alias is required for the refresh to work.
         */
        expect(typeof EditWordGroupModal.prototype._refreshEntries).toBe(
          "function",
        );
      },
    );
  });
});

// ---------------------------------------------------------------------------
// Task 2: Preservation property tests
//
// These tests verify that the fix does NOT break existing correct behavior.
// They are written BEFORE the fix is applied and MUST PASS on unfixed code
// (except Preservation PBT 2, which is a fix-checking property and is
// expected to fail on unfixed code — it is marked with .fails).
// ---------------------------------------------------------------------------

import * as fc from "fast-check";

describe("Preservation — word-group-modal-entry-bugs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.__lastMenuInstance = null;
  });

  // -------------------------------------------------------------------------
  // Structural unit tests — must pass on both unfixed and fixed code
  // -------------------------------------------------------------------------

  describe("Structural unit tests", () => {
    it(
      "EditWordGroupModal.prototype._refreshGroupEntries MUST be a function " +
        "(must not be renamed or removed by the fix)",
      () => {
        /**
         * Validates: Requirements 3.1, 3.5
         *
         * The fix must not rename or remove _refreshGroupEntries.
         * This test PASSES on unfixed code and must continue to pass after the fix.
         */
        expect(typeof EditWordGroupModal.prototype._refreshGroupEntries).toBe(
          "function",
        );
      },
    );

    it(
      "onClose MUST call this.onSave(this.group) — save-on-close contract preserved",
      () => {
        /**
         * Validates: Requirements 3.4
         *
         * The fix must not break the save-on-close contract.
         * This test PASSES on unfixed code and must continue to pass after the fix.
         */
        const entry = {
          uid: "entry-uid-onclose",
          isRegex: false,
          pattern: "hello",
          color: "#123456",
          styleType: "text",
          matchType: "contains",
        };

        let savedGroup = null;
        const plugin = makeMockPlugin([entry]);
        const group = plugin.settings.wordEntryGroups[0];
        const app = {};

        const modal = new EditWordGroupModal(
          app,
          plugin,
          group,
          (g) => {
            savedGroup = g;
          }, // onSave — capture the group passed to it
          () => {},
        );
        modal._listDiv = makeDomEl("div");

        // Call onClose — it should invoke onSave with the current group
        modal.onClose();

        expect(savedGroup).not.toBeNull();
        // The saved group should have the same uid as the original group
        expect(savedGroup.uid).toBe(group.uid);
      },
    );
  });

  // -------------------------------------------------------------------------
  // Preservation PBT 1 — non-regex entries must NOT have a presetLabel input
  // MUST PASS on unfixed code (confirms baseline behavior to preserve)
  // -------------------------------------------------------------------------

  describe("Preservation PBT 1: non-regex entries have no presetLabel input", () => {
    it(
      "for any non-regex entry, the rendered row MUST NOT contain an input " +
        "with placeholder matching 'name your regex'",
      () => {
        /**
         * Validates: Requirements 3.1, 3.5
         *
         * Generates random non-regex entries (varying styleType, matchType,
         * pattern). For each, asserts the rendered row does NOT contain a
         * presetLabel input.
         *
         * This test PASSES on unfixed code (no presetLabel input is ever
         * rendered) and must continue to pass after the fix (the new block
         * is guarded by `if (entry.isRegex)`).
         */
        fc.assert(
          fc.property(
            // styleType ∈ ["text", "highlight", "both"]
            fc.constantFrom("text", "highlight", "both"),
            // matchType ∈ ["contains", "exact", "startswith", "endswith"]
            fc.constantFrom("contains", "exact", "startswith", "endswith"),
            // arbitrary pattern string (printable ASCII, may be empty)
            fc.string({ minLength: 0, maxLength: 40 }),
            (styleType, matchType, pattern) => {
              const entry = {
                uid: "pbt1-entry",
                isRegex: false,
                pattern,
                color: "#aabbcc",
                styleType,
                matchType,
              };

              const { modal } = makeModal([entry]);
              modal._refreshGroupEntries();

              const allInputs = modal._listDiv._findInputs(() => true);

              // No input should have a placeholder matching "name your regex"
              const labelInput = allInputs.find(
                (inp) =>
                  typeof inp.placeholder === "string" &&
                  inp.placeholder.toLowerCase().includes("name your regex"),
              );

              expect(labelInput).toBeUndefined();
            },
          ),
          { numRuns: 100 },
        );
      },
    );
  });

  // -------------------------------------------------------------------------
  // Preservation PBT 2 — fix-checking property for presetLabel input value
  // This is a FIX-CHECKING property, NOT a preservation property.
  // It is EXPECTED TO FAIL on unfixed code (no presetLabel input exists yet).
  // It will PASS after the fix is applied.
  // -------------------------------------------------------------------------

  describe("Preservation PBT 2 (fix-checking): presetLabel input value matches entry.presetLabel", () => {
    it.fails(
      "EXPECTED TO FAIL on unfixed code — for any regex entry, the rendered " +
        "presetLabel input value MUST equal String(entry.presetLabel || '')",
      () => {
        /**
         * Validates: Requirements 2.1, 3.2
         *
         * Generates random presetLabel strings (empty, whitespace-only,
         * unicode, long strings). For each regex entry, asserts the rendered
         * presetLabel input value always equals String(entry.presetLabel || "").
         *
         * EXPECTED TO FAIL on unfixed code — no presetLabel input is rendered.
         * Will PASS after the fix is applied.
         */
        fc.assert(
          fc.property(
            // presetLabel: empty, whitespace, unicode, long strings
            fc.oneof(
              fc.constant(""),
              fc.constant("   "),
              fc.string({ minLength: 1, maxLength: 80 }),
              fc.fullUnicodeString({ minLength: 1, maxLength: 40 }),
            ),
            (presetLabel) => {
              const entry = {
                uid: "pbt2-entry",
                isRegex: true,
                presetLabel,
                pattern: "\\btest\\b",
                flags: "i",
                color: "#ff0000",
                styleType: "text",
                matchType: "contains",
              };

              const { modal } = makeModal([entry]);
              modal._refreshGroupEntries();

              const allInputs = modal._listDiv._findInputs(() => true);

              // Find the presetLabel input by placeholder
              const labelInput = allInputs.find(
                (inp) =>
                  typeof inp.placeholder === "string" &&
                  inp.placeholder.toLowerCase().includes("name your regex"),
              );

              // Must exist and have the correct value
              expect(labelInput).toBeDefined();
              expect(labelInput.value).toBe(String(presetLabel || ""));
            },
          ),
          { numRuns: 100 },
        );
      },
    );
  });
});
