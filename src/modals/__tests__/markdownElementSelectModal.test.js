/**
 * MarkdownElementSelectModal must show the chosen element's own config
 * inputs underneath the dropdown (heading levels, task types, tag filter,
 * title filter + match mode, highlight color, …) and re-render them on
 * every selection change — mirroring the row and Style Target surfaces.
 * Confirm passes `(key, config)` so callers can store what was picked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Minimal DOM
// ---------------------------------------------------------------------------

function makeEl(tag = "div") {
  const el = {
    _tag: tag,
    _children: [],
    _listeners: {},
    _classes: [],
    style: {},
    dataset: {},
    value: "",
    textContent: "",
    innerHTML: "",
    title: "",
    type: "",
    placeholder: "",
    className: "",
    appendChild(child) {
      this._children.push(child);
      return child;
    },
    insertBefore(child) {
      this._children.unshift(child);
      return child;
    },
    addEventListener(ev, fn) {
      if (!this._listeners[ev]) this._listeners[ev] = [];
      this._listeners[ev].push(fn);
    },
    removeEventListener() {},
    empty() {
      this._children = [];
    },
    addClass(...clses) {
      this._classes.push(...clses);
    },
    createEl(childTag, opts = {}) {
      const child = makeEl(childTag);
      if (opts.text !== undefined) child.textContent = opts.text;
      if (opts.type !== undefined) child.type = opts.type;
      if (opts.cls) child.addClass(opts.cls);
      this._children.push(child);
      return child;
    },
    createDiv(opts = {}) {
      const child = makeEl("div");
      if (opts && opts.text) child.textContent = opts.text;
      if (opts && opts.cls) child.addClass(opts.cls);
      this._children.push(child);
      return child;
    },
    _fire(ev, arg) {
      (this._listeners[ev] || []).forEach((fn) =>
        fn(arg || { preventDefault() {}, stopPropagation() {} }),
      );
    },
  };
  return el;
}

vi.mock("obsidian", () => {
  class Modal {
    constructor(app) {
      this.app = app;
      this.modalEl = { style: {}, addClass() {} };
      this.contentEl = makeEl("div");
    }
    open() {}
    close() {}
  }
  return { Modal };
});

import { MarkdownElementSelectModal } from "../MarkdownElementSelectModal.js";
import { applyPickedElementConfig } from "../../utils/markdownElementConfig.js";

const plugin = { t: (key, fallback) => fallback };

let docStub;
beforeEach(() => {
  docStub = { body: makeEl("body"), head: makeEl("head") };
  docStub.createElement = (tag) => makeEl(tag);
  globalThis.document = docStub;
});

function openModal(opts) {
  const calls = [];
  const modal = new MarkdownElementSelectModal(
    {},
    plugin,
    (key, config) => calls.push([key, config]),
    opts,
  );
  modal.onOpen();
  const root = modal.contentEl;
  const select = root._children.find((n) => n._tag === "select");
  const configWrap = root._children.find(
    (n) => n._tag === "div" && n.style && n.style.marginTop === "12px",
  );
  const footer = root._children.filter((n) => n._tag === "div").pop();
  const buttons = footer ? footer._children : [];
  return { modal, calls, select, configWrap, buttons };
}

describe("MarkdownElementSelectModal — config inputs", () => {
  it("shows no config for elements without one (Bold)", () => {
    const { configWrap } = openModal({ initialKey: "strong" });
    expect(configWrap._children.length).toBe(0);
    expect(configWrap.style.display).toBe("none");
  });

  it("renders the heading levels input when Heading is picked", () => {
    const { select, configWrap } = openModal({ initialKey: "strong" });
    select.value = "heading";
    select._fire("change");
    // Flex container so the single config input stretches full width.
    expect(configWrap.style.display).toBe("flex");
    expect(configWrap._children.length).toBe(1);
    const input = configWrap._children[0];
    expect(input._tag).toBe("input");
    expect(input.value).toBe("1, 2, 3, 4, 5, 6");
  });

  it("renders the title filter + match mode for Tab Title", () => {
    const { select, configWrap } = openModal({ initialKey: "strong" });
    select.value = "tab-title";
    select._fire("change");
    expect(configWrap._children.length).toBe(1);
    const wrapper = configWrap._children[0];
    expect(wrapper._tag).toBe("div");
    const tags = wrapper._children.map((n) => n._tag);
    expect(tags).toContain("select");
    expect(tags).toContain("input");
  });

  it("renders the color dropdown for Highlight Color", () => {
    const { select, configWrap } = openModal({ initialKey: "strong" });
    select.value = "highlight-color";
    select._fire("change");
    // Same full-width flex layout as the text inputs.
    expect(configWrap.style.display).toBe("flex");
    expect(configWrap._children.length).toBe(1);
    const colorSelect = configWrap._children[0];
    expect(colorSelect._tag).toBe("select");
    expect(colorSelect._children.length).toBe(8);
    expect(colorSelect._children.map((o) => o.value)).toContain("red");
    expect(colorSelect._children.map((o) => o.value)).toContain("purple");
  });

  it("clears the config again when switching back to a plain element", () => {
    const { select, configWrap } = openModal({ initialKey: "strong" });
    select.value = "heading";
    select._fire("change");
    expect(configWrap._children.length).toBe(1);
    select.value = "strong";
    select._fire("change");
    expect(configWrap._children.length).toBe(0);
    expect(configWrap.style.display).toBe("none");
  });
});

describe("MarkdownElementSelectModal — confirm payload", () => {
  it("passes defaults for untouched inputs (tag)", () => {
    const { select, buttons, calls } = openModal({ initialKey: "strong" });
    select.value = "tag";
    select._fire("change");
    buttons[1]._fire("click");
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("tag");
    expect(calls[0][1]).toMatchObject({ tagFilter: "" });
  });

  it("passes typed filter text and the default match mode", () => {
    const { select, configWrap, buttons, calls } = openModal({
      initialKey: "strong",
    });
    select.value = "tab-title";
    select._fire("change");
    const wrapper = configWrap._children[0];
    const input = wrapper._children.find((n) => n._tag === "input");
    input.value = "Chapter";
    input._fire("input");
    buttons[1]._fire("click");
    expect(calls[0][0]).toBe("tab-title");
    expect(calls[0][1]).toMatchObject({
      titleFilter: "Chapter",
      titleMatchType: "contains",
    });
  });

  it("passes the picked highlight color", () => {
    const { select, configWrap, buttons, calls } = openModal({
      initialKey: "strong",
    });
    select.value = "highlight-color";
    select._fire("change");
    const colorSelect = configWrap._children[0];
    colorSelect.value = "blue";
    colorSelect._fire("change");
    buttons[1]._fire("click");
    expect(calls[0][0]).toBe("highlight-color");
    expect(calls[0][1]).toMatchObject({ highlightColor: "blue" });
  });

  it("defaults the highlight color to red when untouched", () => {
    const { select, buttons, calls } = openModal({ initialKey: "strong" });
    select.value = "highlight-color";
    select._fire("change");
    buttons[1]._fire("click");
    expect(calls[0][1]).toMatchObject({ highlightColor: "red" });
  });
});

describe("applyPickedElementConfig", () => {
  it("stores the picked highlight color and rebuilds the pattern", () => {
    const entry = { targetElement: "highlight-color" };
    applyPickedElementConfig(plugin, entry, "highlight-color", {
      highlightColor: "purple",
    });
    expect(entry.highlightColor).toBe("purple");
    expect(entry.pattern).toBe(
      'Targets .cm-highlight-purple and mark[data-highlight="purple"]',
    );
  });

  it("falls back to red for a missing/invalid picked color", () => {
    const entry = { targetElement: "highlight-color" };
    applyPickedElementConfig(plugin, entry, "highlight-color", {});
    expect(entry.highlightColor).toBe("red");
    const bad = { targetElement: "highlight-color" };
    applyPickedElementConfig(plugin, bad, "highlight-color", {
      highlightColor: "bogus",
    });
    expect(bad.highlightColor).toBe("red");
  });

  it("copies heading levels, task types and tag/title filters", () => {
    const heading = { targetElement: "heading" };
    applyPickedElementConfig(plugin, heading, "heading", {
      headingLevels: "1, 2",
    });
    expect(heading.headingLevels).toBe("1, 2");

    const title = { targetElement: "tab-title" };
    applyPickedElementConfig(plugin, title, "tab-title", {
      titleFilter: "Chapter",
      titleMatchType: "startswith",
    });
    expect(title.titleFilter).toBe("Chapter");
    expect(title.titleMatchType).toBe("startswith");

    const tag = { targetElement: "tag" };
    applyPickedElementConfig(plugin, tag, "tag", { tagFilter: "project" });
    expect(tag.tagFilter).toBe("project");
  });
});
