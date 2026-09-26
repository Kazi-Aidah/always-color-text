/**
 * "Time & Date" preset flow: clicking the preset swaps the modal to a format
 * step, the preview renders the format with moment (today's date/time), and
 * "Use format" hands the caller a generated regex plus the rendered text so
 * the color picker's preview shows — and the editor colors — exactly that text.
 * The generated regex itself never appears in the UI; saved entries re-edit
 * through the same format step (startWithFormat mode).
 */

import { describe, it, expect, vi } from "vitest";

function makeStyle() {
  const store = {};
  return new Proxy(
    {},
    {
      get: (_, p) => store[p] ?? "",
      set: (_, p, v) => {
        store[p] = v;
        return true;
      },
    },
  );
}

function makeDomEl(tag = "div") {
  const el = {
    _tag: tag,
    _children: [],
    _parent: null,
    _listeners: {},
    style: makeStyle(),
    className: "",
    textContent: "",
    value: "",
    placeholder: "",
    title: "",
    disabled: false,
    addClass(cls) {
      this.className = `${this.className} ${cls}`.trim();
    },
    removeClass() {},
    addEventListener(event, fn) {
      (this._listeners[event] = this._listeners[event] || []).push(fn);
    },
    removeEventListener(event, fn) {
      this._listeners[event] = (this._listeners[event] || []).filter(
        (f) => f !== fn,
      );
    },
    appendChild(child) {
      child._parent = this;
      this._children.push(child);
      return child;
    },
    remove() {
      if (this._parent) {
        this._parent._children = this._parent._children.filter(
          (c) => c !== this,
        );
        this._parent = null;
      }
    },
    empty() {
      this._children = [];
    },
    createEl(childTag, opts = {}) {
      const child = makeDomEl(childTag);
      if (opts.text !== undefined) child.textContent = opts.text;
      if (opts.cls !== undefined) child.className = opts.cls;
      return this.appendChild(child);
    },
    createDiv(opts = {}) {
      return this.createEl("div", opts);
    },
    _walk(fn) {
      fn(this);
      (this._children || []).forEach((c) => c._walk(fn));
    },
    _findAll(pred) {
      const out = [];
      this._walk((n) => {
        if (pred(n)) out.push(n);
      });
      return out;
    },
    _fire(event) {
      (this._listeners[event] || []).forEach((fn) =>
        fn({ preventDefault() {}, key: "", target: this }),
      );
    },
  };
  return el;
}

if (typeof globalThis.document === "undefined") {
  globalThis.document = {
    createElement: (tag) => makeDomEl(tag),
    createDocumentFragment: () => {
      const frag = makeDomEl("#fragment");
      // Real fragments accept strings in append(); wrap them as text nodes so
      // the element walk still works.
      frag.append = (...items) => {
        for (const item of items) {
          if (typeof item === "string") {
            const text = makeDomEl("#text");
            text.textContent = item;
            frag.appendChild(text);
          } else {
            frag.appendChild(item);
          }
        }
      };
      return frag;
    },
    head: makeDomEl("head"),
    body: makeDomEl("body"),
  };
}

vi.mock("obsidian", () => {
  class Modal {
    constructor(app) {
      this.app = app;
      this.modalEl = { style: {}, addClass() {} };
      this.contentEl = makeDomEl("div");
    }
    open() {}
    close() {}
  }

  // Minimal Setting: enough for a name/desc row with one text field.
  class Setting {
    constructor(el) {
      this.settingEl = el.createDiv();
    }
    setName() {
      return this;
    }
    setDesc(desc) {
      this.descEl = this.settingEl.createDiv({
        cls: "setting-item-description",
      });
      if (typeof desc === "string") this.descEl.textContent = desc;
      else if (desc) this.descEl.appendChild(desc);
      return this;
    }
    setHeading() {
      return this;
    }
    addText(cb) {
      const input = makeDomEl("input");
      const component = {
        inputEl: input,
        setValue(v) {
          input.value = v;
          return component;
        },
        setPlaceholder(p) {
          input.placeholder = p;
          return component;
        },
        onChange(fn) {
          input.addEventListener("input", () => fn(input.value));
          return component;
        },
      };
      this.settingEl.appendChild(input);
      cb(component);
      return this;
    }
  }

  // "Today's date/time" stand-in: renders known formats, otherwise a marker
  // that no pattern can match (used to exercise the mismatch error path).
  const RENDERED = {
    "hh:mm a, D MMMM Y": "09:05 pm, 25 September 2026",
    DD_MMMM_Y: "25_September_2026",
    "YYYY-MM-DD": "2026-09-25",
    MMMM: "September",
  };
  const moment = () => ({
    format: (fmt) => RENDERED[String(fmt)] ?? `rendered:${fmt}`,
    isValid: () => true,
  });
  moment.localeData = () => ({ longDateFormat: () => null });
  moment.locale = () => "en";

  return { Modal, Setting, moment };
});

import { PresetModal } from "../PresetModal.js";

function makePlugin(overrides = {}) {
  return {
    t: (key, fallback) => fallback,
    validateAndSanitizeRegex: (pattern) => pattern.length <= 100,
    ...overrides,
  };
}

function findButton(modal, label) {
  return modal.contentEl._findAll(
    (n) => n._tag === "button" && n.textContent === label,
  )[0];
}

function findByClass(modal, cls) {
  return modal.contentEl._findAll((n) =>
    String(n.className || "")
      .split(/\s+/)
      .includes(cls),
  )[0];
}

function openModal(plugin) {
  const chosen = [];
  const modal = new PresetModal({}, plugin, (preset) => chosen.push(preset));
  modal.onOpen();
  return { modal, chosen };
}

describe("Time & Date preset — format step", () => {
  it("renders the preview from the format without exposing any regex", () => {
    const { modal } = openModal(makePlugin());
    const presetBtn = findButton(modal, "Time & Date");
    expect(presetBtn).toBeTruthy();

    presetBtn._fire("click");

    const preview = findByClass(modal, "act-preset-format-preview-text");
    // moment renders today's date/time with the default hh:mm a, D MMMM Y.
    expect(preview.textContent).toBe("09:05 pm, 25 September 2026");

    // The generated pattern must never surface in the UI.
    expect(findByClass(modal, "act-preset-format-regex")).toBeUndefined();

    // The description line carries the moment.js link — no separate
    // description paragraph or standalone reference link above it.
    expect(findByClass(modal, "act-preset-format-desc")).toBeUndefined();
    expect(findByClass(modal, "setting-item-description")).toBeTruthy();
    const link = findByClass(modal, "act-preset-format-link");
    expect(link).toBeTruthy();
    expect(link.href).toBe("https://momentjs.com/docs/#/displaying/format/");
    expect(link.textContent).toBe("format reference");
    // Sentence assembled around the link: "For more syntax, refer to <a>…".
    expect(link._parent._children[0].textContent).toBe(
      "For more syntax, refer to ",
    );

    expect(findByClass(modal, "act-preset-format-error").textContent).toBe("");
    expect(findButton(modal, "Use format").disabled).toBe(false);
  });

  it("updates the preview as the format is typed", () => {
    const { modal } = openModal(makePlugin());
    findButton(modal, "Time & Date")._fire("click");

    const preview = findByClass(modal, "act-preset-format-preview-text");
    const input = modal.contentEl._findAll((n) => n._tag === "input")[0];
    expect(input).toBeTruthy();

    input.value = "YYYY-MM-DD";
    input._fire("input");

    expect(preview.textContent).toBe("2026-09-25");
    expect(findByClass(modal, "act-preset-format-error").textContent).toBe("");
    expect(findButton(modal, "Use format").disabled).toBe(false);
  });

  it("shows an error and disables the button when the pattern can't match", () => {
    const { modal } = openModal(makePlugin());
    findButton(modal, "Time & Date")._fire("click");

    const input = modal.contentEl._findAll((n) => n._tag === "input")[0];
    input.value = "YYYY"; // moment stub renders `rendered:YYYY` — no match
    input._fire("input");

    expect(findByClass(modal, "act-preset-format-error").textContent).toContain(
      "can't be matched",
    );
    expect(findButton(modal, "Use format").disabled).toBe(true);
  });

  it("blocks formats the plugin's regex safety would reject", () => {
    const { modal } = openModal(
      makePlugin({ validateAndSanitizeRegex: () => false }),
    );
    findButton(modal, "Time & Date")._fire("click");

    expect(findByClass(modal, "act-preset-format-error").textContent).toContain(
      "Regex safety blocks this pattern",
    );
    expect(findButton(modal, "Use format").disabled).toBe(true);
  });

  it("hands the caller the generated regex and the rendered preview text", () => {
    const { modal, chosen } = openModal(makePlugin());
    findButton(modal, "Time & Date")._fire("click");

    const input = modal.contentEl._findAll((n) => n._tag === "input")[0];
    input.value = "YYYY-MM-DD";
    input._fire("input");
    findButton(modal, "Use format")._fire("click");

    expect(chosen).toHaveLength(1);
    const preset = chosen[0];
    // No targetElement ⇒ callers store it as a regex entry (and auto-enable
    // regex support), which is what makes the coloring apply in the editor.
    expect(preset.targetElement).toBeFalsy();
    expect(preset.flags).toBe("iu");
    expect(preset.previewText).toBe("2026-09-25");
    expect(preset.label).toBe("Time & Date (YYYY-MM-DD)");
    expect(preset.dateTimeFormat).toBe("YYYY-MM-DD");
    expect(preset.needsFormat).toBe(false);
    expect(new RegExp(preset.pattern, "iu").test("2009-01-19")).toBe(true);
  });

  it("goes back to the preset list", () => {
    const { modal } = openModal(makePlugin());
    findButton(modal, "Time & Date")._fire("click");
    expect(findByClass(modal, "act-preset-format-step")).toBeTruthy();

    findButton(modal, "Back")._fire("click");

    expect(findByClass(modal, "act-preset-format-step")).toBeFalsy();
    expect(findButton(modal, "Time & Date")).toBeTruthy();
  });

  it("still chooses regular presets directly", () => {
    const { modal, chosen } = openModal(makePlugin());
    findButton(modal, "Email addresses")._fire("click");

    expect(chosen).toHaveLength(1);
    expect(chosen[0].label).toBe("Email addresses");
    expect(chosen[0].pattern).toBe(
      "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
    );
    expect(chosen[0].previewText).toBeUndefined();
  });

  it("offers no date/time regex presets — only Time & Date", () => {
    const { modal } = openModal(makePlugin());
    for (const label of [
      "Dates (YYYY-MM-DD)",
      "Dates (YYYY-MMM-DD)",
      "Times (AM/PM)",
      "Times (2pm, 10pm)",
      "Times (24h)",
      "Relative dates",
    ]) {
      expect(findButton(modal, label)).toBeUndefined();
    }
    expect(findButton(modal, "Time & Date")).toBeTruthy();
  });
});

describe("Time & Date entries — re-editing the format from an entry", () => {
  function openForEntry(entry) {
    const saved = [];
    const plugin = makePlugin();
    const modal = PresetModal.openForDateTimeFormat(
      {},
      plugin,
      entry,
      async (e) => saved.push(e),
    );
    modal.onOpen();
    return { modal, saved };
  }

  it("opens straight into the format step with the saved format prefilled", () => {
    const entry = {
      isRegex: true,
      pattern: "old-pattern",
      flags: "iu",
      presetLabel: "Time & Date (YYYY-MM-DD)",
      dateTimeFormat: "YYYY-MM-DD",
    };
    const { modal } = openForEntry(entry);

    // No preset list behind it — straight to the format step.
    expect(findByClass(modal, "act-preset-format-step")).toBeTruthy();
    expect(findButton(modal, "Bold")).toBeUndefined();

    const input = modal.contentEl._findAll((n) => n._tag === "input")[0];
    expect(input.value).toBe("YYYY-MM-DD");
    expect(
      findByClass(modal, "act-preset-format-preview-text").textContent,
    ).toBe("2026-09-25");
  });

  it("regenerates the entry's pattern from the format and reports it saved", async () => {
    const entry = {
      isRegex: true,
      pattern: "old-pattern",
      flags: "",
      presetLabel: "Time & Date (YYYY-MM-DD)",
      dateTimeFormat: "YYYY-MM-DD",
    };
    const { modal, saved } = openForEntry(entry);

    findButton(modal, "Use format")._fire("click");
    await new Promise((r) => setTimeout(r, 0));

    expect(entry.pattern).not.toBe("old-pattern");
    expect(new RegExp(entry.pattern, "iu").test("2009-01-19")).toBe(true);
    expect(entry.flags).toBe("iu");
    expect(entry.presetLabel).toBe("Time & Date (YYYY-MM-DD)");
    expect(entry.dateTimeFormat).toBe("YYYY-MM-DD");
    expect(saved).toHaveLength(1);
  });

  it("closes on Back instead of falling back to the preset list", () => {
    const entry = {
      isRegex: true,
      pattern: "p",
      presetLabel: "Time & Date (DD_MMMM_Y)",
      dateTimeFormat: "DD_MMMM_Y",
    };
    const { modal } = openForEntry(entry);
    modal.close = vi.fn();

    findButton(modal, "Back")._fire("click");

    expect(modal.close).toHaveBeenCalled();
    expect(findButton(modal, "Bold")).toBeUndefined();
  });
});
