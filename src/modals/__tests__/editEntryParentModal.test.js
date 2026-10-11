/**
 * Saving the Style Text modal must not close a group-modal parent: the word
 * (or blacklist) group list stays open and refreshes via onSaved, while
 * transient parents (color picker, add-to-existing) still close with save.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  Menu: class {},
  FuzzySuggestModal: class {},
  setIcon: () => {},
}));

import { EditEntryModal } from "../EditEntryModal.js";

function makeModal(parentModal) {
  const modal = Object.create(EditEntryModal.prototype);
  modal.parentModal = parentModal;
  return modal;
}

describe("_isGroupParentModal", () => {
  it("is false without a parent", () => {
    expect(makeModal(null)._isGroupParentModal()).toBe(false);
    expect(makeModal(undefined)._isGroupParentModal()).toBe(false);
  });

  it("is true for group-modal parents (word + blacklist)", () => {
    expect(
      makeModal({ _refreshGroupEntries() {} })._isGroupParentModal(),
    ).toBe(true);
    expect(
      makeModal({
        _refreshGroupEntries: async () => {},
        _refreshEntries() {},
      })._isGroupParentModal(),
    ).toBe(true);
  });

  it("is false for transient parents", () => {
    // Color picker step (fromPickColorModal flow).
    expect(
      makeModal({ close() {}, _hasUserChanges: true })._isGroupParentModal(),
    ).toBe(false);
    // Add-to-existing flow.
    expect(
      makeModal({ close() {}, selectedText: "x" })._isGroupParentModal(),
    ).toBe(false);
    // Settings tab (not a modal at all).
    expect(
      makeModal({ _refreshEntries() {} })._isGroupParentModal(),
    ).toBe(false);
  });
});
