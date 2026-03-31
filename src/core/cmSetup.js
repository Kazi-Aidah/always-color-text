// CodeMirror utilities
let RangeSetBuilder, Decoration, ViewPlugin, StateEffect, syntaxTree;
try {
  const cmState = require("@codemirror/state");
  RangeSetBuilder = cmState.RangeSetBuilder;
  StateEffect = cmState.StateEffect;
  Decoration = require("@codemirror/view").Decoration;
  ViewPlugin = require("@codemirror/view").ViewPlugin;
  // Try to load syntaxTree from language package if available
  try {
    syntaxTree = require("@codemirror/language").syntaxTree;
  } catch (e) {
    // Fallback if @codemirror/language is not directly available (e.g. older Obsidian)
    // We might be able to get it from global or other means, but for now leave undefined
    console.warn("Always Color Text: syntaxTree not available");
  }
} catch (e) {
  // Fallback if not available
  RangeSetBuilder = class {};
  Decoration = { mark: () => ({}) };
  ViewPlugin = { fromClass: () => ({}) };
  StateEffect = { define: () => ({ of: () => ({}) }) };
}

// Define a state effect to force decoration rebuilds
const forceRebuildEffect = StateEffect.define();

export { RangeSetBuilder, Decoration, ViewPlugin, StateEffect, syntaxTree, forceRebuildEffect };
