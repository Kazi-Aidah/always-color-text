// CodeMirror utilities
let RangeSetBuilder, Decoration, ViewPlugin, StateEffect, syntaxTree;
try {
  const cmState = require("@codemirror/state");
  RangeSetBuilder = cmState.RangeSetBuilder;
  StateEffect = cmState.StateEffect;
  const cmView = require("@codemirror/view");
  Decoration = cmView.Decoration;
  ViewPlugin = cmView.ViewPlugin;
  // Try to load syntaxTree from language package if available
  try {
    syntaxTree = require("@codemirror/language").syntaxTree;
  } catch (e) {
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
