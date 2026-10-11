/**
 * Link-spanning matches (issue: regex \{>>[^\}]*\} on "{>> [[link]]}").
 *
 * Word/regex matching runs per text node and link text is reserved for the
 * Markdown Element link entry, so a pattern spanning a link could never
 * match and its coloring silently vanished. Covered here:
 *  - reading view: _tryPaintLinkSpanningMatches wraps the whole range
 *    (link element included) in one highlight span;
 *  - unwrap preserves the link element;
 *  - link-internal-only matches stay with the link entry;
 *  - live preview: _splitMatchesAtLinks splits link-spanning matches at
 *    link boundaries (outer pieces keep the box, the link piece goes
 *    flat) while matches fully inside a link stay dropped for the link
 *    entry.
 */
import { describe, it, expect, vi, beforeAll } from "vitest";

vi.mock("obsidian", () => {
  class Plugin {}
  class Modal {
    constructor(app) {
      this.app = app;
      this.modalEl = { style: {}, addClass() {}, classList: { add() {} } };
      this.contentEl = null;
    }
    open() {}
    close() {}
  }
  class Notice {}
  function setIcon() {}
  return {
    Plugin,
    PluginSettingTab: class {},
    Setting: class {},
    Modal,
    MarkdownView: class {},
    Notice,
    FuzzySuggestModal: class {},
    debounce: (fn) => fn,
    MarkdownRenderer: {},
    Menu: class {},
    setIcon,
    Component: class {},
    TFile: class {},
    Platform: {},
    requestUrl: async () => ({}),
  };
});

// ---------- tiny DOM ----------
const NF = { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2, FILTER_SKIP: 3 };

function matchSimple(el, sel) {
  sel = sel.trim();
  if (!sel) return false;
  const m = sel.match(/^([a-zA-Z][a-zA-Z0-9]*)?((?:\.[a-zA-Z0-9_-]+)*)$/);
  if (!m) return false;
  const [, tag, cls] = m;
  if (tag && el.tagName !== tag.toUpperCase()) return false;
  if (cls) {
    const need = cls.split(".").filter(Boolean);
    const have = (el.className || "").split(/\s+/).filter(Boolean);
    for (const c of need) if (!have.includes(c)) return false;
  }
  return true;
}
function matches(el, selector) {
  return selector.split(",").some((s) => matchSimple(el, s));
}
class TNode {
  constructor() {
    this.parentNode = null;
    this.childNodes = [];
  }
  get parentElement() {
    const p = this.parentNode;
    return p && p.nodeType === 1 ? p : null;
  }
  get firstChild() {
    return this.childNodes[0] || null;
  }
  appendChild(c) {
    if (c.parentNode) {
      try {
        c.parentNode.removeChild(c);
      } catch (_) {}
    }
    c.parentNode = this;
    this.childNodes.push(c);
    return c;
  }
  insertBefore(c, ref) {
    if (c.parentNode) {
      try {
        c.parentNode.removeChild(c);
      } catch (_) {}
    }
    c.parentNode = this;
    const i = ref ? this.childNodes.indexOf(ref) : -1;
    if (i === -1) this.childNodes.push(c);
    else this.childNodes.splice(i, 0, c);
    return c;
  }
  removeChild(c) {
    this.childNodes = this.childNodes.filter((x) => x !== c);
    c.parentNode = null;
    return c;
  }
  replaceWith(...nodes) {
    const p = this.parentNode;
    if (!p) return;
    const i = p.childNodes.indexOf(this);
    p.childNodes.splice(i, 1);
    nodes.forEach((nn, k) => {
      nn.parentNode = p;
      p.childNodes.splice(i + k, 0, nn);
    });
    this.parentNode = null;
  }
  contains(n) {
    if (n === this) return true;
    return this.childNodes.some((c) => c.contains(n));
  }
  walk(fn) {
    fn(this);
    [...this.childNodes].forEach((c) => c.walk(fn));
  }
  querySelectorAll(sel) {
    const out = [];
    this.walk((n) => {
      if (n !== this && n.nodeType === 1 && matches(n, sel)) out.push(n);
    });
    return out;
  }
  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }
  closest(sel) {
    let n = this;
    while (n) {
      if (n.nodeType === 1 && matches(n, sel)) return n;
      n = n.parentNode;
    }
    return null;
  }
}
class TText extends TNode {
  constructor(text) {
    super();
    this.nodeType = 3;
    this._text = String(text);
  }
  get textContent() {
    return this._text;
  }
  splitText(off) {
    const right = new TText(this._text.slice(off));
    this._text = this._text.slice(0, off);
    if (this.parentNode) {
      const i = this.parentNode.childNodes.indexOf(this);
      right.parentNode = this.parentNode;
      this.parentNode.childNodes.splice(i + 1, 0, right);
    }
    return right;
  }
  clone() {
    return new TText(this._text);
  }
}
class TEl extends TNode {
  constructor(tag) {
    super();
    this.nodeType = 1;
    this.tagName = String(tag).toUpperCase();
    this.className = "";
    this.style = {
      _p: {},
      setProperty(k, v) {
        this._p[k] = String(v);
      },
      removeProperty(k) {
        delete this._p[k];
      },
    };
  }
  get textContent() {
    return this.childNodes.map((c) => c.textContent).join("");
  }
  clone(deep) {
    const e = new TEl(this.tagName);
    e.className = this.className;
    if (deep) this.childNodes.forEach((c) => e.appendChild(c.clone(true)));
    return e;
  }
}
class TFrag extends TNode {
  constructor() {
    super();
    this.nodeType = 11;
  }
  get textContent() {
    return this.childNodes.map((c) => c.textContent).join("");
  }
  clone(deep) {
    const f = new TFrag();
    if (deep) this.childNodes.forEach((c) => f.appendChild(c.clone(true)));
    return f;
  }
}
class TRange {
  constructor() {
    this.sc = null;
    this.so = 0;
    this.ec = null;
    this.eo = 0;
  }
  setStart(n, o) {
    this.sc = n;
    this.so = o;
  }
  setEnd(n, o) {
    this.ec = n;
    this.eo = o;
  }
  _collect() {
    // ordered text nodes under common root
    const root = (() => {
      let n = this.sc;
      while (n.parentNode) n = n.parentNode;
      return n;
    })();
    const texts = [];
    root.walk((n) => {
      if (n.nodeType === 3) texts.push(n);
    });
    return { root, texts };
  }
  cloneContents() {
    const { texts } = this._collect();
    const frag = new TFrag();
    const inRange = (n) => {
      if (n === this.sc && n === this.ec) return [this.so, this.eo];
      if (n === this.sc) return [this.so, n.textContent.length];
      if (n === this.ec) return [0, this.eo];
      // fully contained if between (document order)
      return null; // resolved below
    };
    let started = false;
    // find ancestor elements fully inside: walk from sc up
    const order = [];
    const root = (() => {
      let n = this.sc;
      while (n.parentNode) n = n.parentNode;
      return n;
    })();
    const seq = [];
    root.walk((n) => seq.push(n));
    const si = seq.indexOf(this.sc);
    const ei = seq.indexOf(this.ec);
    for (let i = Math.min(si, ei); i <= Math.max(si, ei); i++) {
      const n = seq[i];
      if (n.nodeType === 3) {
        let a = 0;
        let b = n.textContent.length;
        if (n === this.sc) a = this.so;
        if (n === this.ec) b = this.eo;
        if (b > a) {
          const t = new TText(n.textContent.slice(a, b));
          frag.appendChild(t);
        }
      } else if (n.nodeType === 1 && n !== root) {
        // include element if fully inside range: check via its text extent
        const tn = [];
        n.walk((x) => {
          if (x.nodeType === 3) tn.push(x);
        });
        if (!tn.length) continue;
        const first = seq.indexOf(tn[0]);
        const last = seq.indexOf(tn[tn.length - 1]);
        const coversFirst = tn[0] === this.sc ? this.so === 0 : first > si || (first === si);
        void coversFirst;
        const fullyIn =
          (tn[0] !== this.sc || this.so === 0) &&
          (tn[tn.length - 1] !== this.ec || this.eo === tn[tn.length - 1].textContent.length) &&
          first >= Math.min(si, ei) &&
          last <= Math.max(si, ei);
        if (fullyIn) frag.appendChild(n.clone(true));
      }
    }
    void started;
    void inRange;
    return frag;
  }
  surroundContents(span) {
    if (!this.sc || !this.ec) throw new Error("bad range");
    if (this.sc.nodeType !== 3 || this.ec.nodeType !== 3) throw new Error("partial element");
    let startNode = this.sc;
    let endNode = this.ec;
    // split end first (keeps start offsets valid)
    if (this.eo < endNode.textContent.length) {
      endNode.splitText(this.eo);
    }
    if (startNode === endNode) {
      const right = startNode.splitText(this.so);
      // range is [right-start, right-(eo-so)]
      const mid = right.splitText(this.eo - this.so);
      void mid;
      span.appendChild(right);
      right.parentNode && null;
      // insert span where right was
      const p = mid.parentNode;
      const i = p.childNodes.indexOf(mid);
      p.childNodes.splice(i, 0, span);
      span.parentNode = p;
      // move right into span (already removed? right still in p)
      p.removeChild(right);
      span.appendChild(right);
    } else {
      if (this.so > 0) {
        startNode = startNode.splitText(this.so);
      }
      // collect siblings from startNode to endNode inclusive
      const p = startNode.parentNode;
      const nodes = [];
      let cur = startNode;
      while (cur) {
        nodes.push(cur);
        if (cur === endNode) break;
        cur = p.childNodes[p.childNodes.indexOf(cur) + 1];
        if (!cur) throw new Error("discontiguous");
      }
      p.insertBefore(span, startNode);
      nodes.forEach((nn) => {
        p.removeChild(nn);
        span.appendChild(nn);
      });
    }
  }
}

function makeDocument() {
  return {
    createElement: (t) => new TEl(t),
    createTextNode: (t) => new TText(t),
    createDocumentFragment: () => new TFrag(),
    createRange: () => new TRange(),
    createTreeWalker: (root, what, filter) => {
      const list = [];
      root.walk((n) => {
        if (n !== root && n.nodeType === 3) {
          let r = 1;
          try {
            r = filter.acceptNode(n);
          } catch (_) {
            r = 1;
          }
          if (r === 1) list.push(n);
        }
      });
      let i = 0;
      return { nextNode: () => (i < list.length ? list[i++] : null) };
    },
  };
}

function buildP() {
  // <p>{>> <a class="internal-link">link</a>}</p>
  const doc = globalThis.document;
  const p = doc.createElement("p");
  p.appendChild(doc.createTextNode("{>> "));
  const a = doc.createElement("a");
  a.className = "internal-link";
  a.appendChild(doc.createTextNode("link"));
  p.appendChild(a);
  p.appendChild(doc.createTextNode("}"));
  return { p, a };
}

let ACT = null;
beforeAll(async () => {
  globalThis.document = makeDocument();
  globalThis.window = globalThis.window || {};
  globalThis.window.moment = { locale: () => "en" };
  globalThis.NodeFilter = NF;
  globalThis.getComputedStyle = () => ({ color: "rgb(0, 0, 0)" });
  const mod = await import("../AlwaysColorText.js");
  ACT = mod.default;
});

function makeHost() {
  const host = Object.create(ACT.prototype);
  host.settings = {
    enabled: true,
    wordEntries: [],
    wordEntryGroups: [],
    caseSensitive: false,
    partialMatch: false,
    enableRegexSupport: true,
    disableRegexSafety: true,
    enableCustomCss: false,
    hideTextColors: false,
    hideHighlights: false,
    backgroundOpacity: 25,
    highlightBorderRadius: 8,
    highlightHorizontalPadding: 4,
    highlightVerticalPadding: 0,
    enableBoxDecorationBreak: true,
    enableBorderThickness: false,
    borderStyle: "full",
    borderLineStyle: "solid",
    borderOpacity: 100,
    borderThickness: 1,
  };
  host._domRefs = new Map();
  host.isWordBlacklisted = () => false;
  return host;
}
function regexEntry(pattern, extra = {}) {
  return Object.assign(
    {
      uid: "r1",
      pattern,
      isRegex: true,
      flags: "gi",
      regex: new RegExp(pattern, "gi"),
      styleType: "text",
      color: "#ff0000",
      textColor: null,
      backgroundColor: null,
      markTarget: "text",
    },
    extra,
  );
}

describe("scratch: reading link-spanning", () => {
  it("wraps {>> [[link]]} incl. the link element", () => {
    const host = makeHost();
    const { p, a } = buildP();
    const entry = regexEntry("\\{>>[^\\}]*\\}");
    host._tryPaintLinkSpanningMatches(p, [entry], null, {
      clearExisting: true,
      effectiveStyle: "text",
      filePath: "n.md",
    });
    const spans = p.querySelectorAll(".always-color-text-highlight");
    expect(spans.length).toBe(1);
    const span = spans[0];
    // link element moved inside the span, text preserved
    expect(span.querySelectorAll("a.internal-link").length).toBe(1);
    expect(p.textContent).toBe("{>> link}");
    expect(span.style._p["color"]).toBe("#ff0000");
    expect(a.parentNode).toBe(span);
  });

  it("unwrap preserves the link element", () => {
    const host = makeHost();
    const { p } = buildP();
    const entry = regexEntry("\\{>>[^\\}]*\\}");
    host._tryPaintLinkSpanningMatches(p, [entry], null, {
      clearExisting: true,
      effectiveStyle: "text",
      filePath: "n.md",
    });
    const span = p.querySelectorAll(".always-color-text-highlight")[0];
    host._unwrapHighlightSpan(span);
    expect(p.querySelectorAll(".always-color-text-highlight").length).toBe(0);
    expect(p.querySelectorAll("a.internal-link").length).toBe(1);
    expect(p.textContent).toBe("{>> link}");
  });

  it("no link -> no-op; link-internal-only match untouched", () => {
    const host = makeHost();
    const doc = globalThis.document;
    const p2 = doc.createElement("p");
    p2.appendChild(doc.createTextNode("{>> abcd}"));
    host._tryPaintLinkSpanningMatches(p2, [regexEntry("\\{>>[^\\}]*\\}")], null, {
      clearExisting: true,
      effectiveStyle: "text",
      filePath: "n.md",
    });
    expect(p2.querySelectorAll(".always-color-text-highlight").length).toBe(0);

    const { p } = buildP();
    host._tryPaintLinkSpanningMatches(p, [regexEntry("link")], null, {
      clearExisting: true,
      effectiveStyle: "text",
      filePath: "n.md",
    });
    expect(p.querySelectorAll(".always-color-text-highlight").length).toBe(0);
    expect(p.querySelectorAll("a.internal-link").length).toBe(1);
  });

  it("highlight style paints background on spanning span", () => {
    const host = makeHost();
    const { p } = buildP();
    const entry = regexEntry("\\{>>[^\\}]*\\}", {
      styleType: "highlight",
      color: "",
      textColor: "currentColor",
      backgroundColor: "#00ff00",
    });
    host._tryPaintLinkSpanningMatches(p, [entry], null, {
      clearExisting: true,
      effectiveStyle: "text",
      filePath: "n.md",
    });
    const span = p.querySelectorAll(".always-color-text-highlight")[0];
    expect(span).toBeTruthy();
    expect(span.style._p["background-color"]).toContain("255,0");
  });
  it("isTextBg entries paint both channels when spanning", () => {
    const host = makeHost();
    const { p } = buildP();
    const entry = regexEntry("\\{>>[^\\}]*\\}", {
      isTextBg: true,
      styleType: "both",
      color: "",
      textColor: "#111111",
      backgroundColor: "#222222",
    });
    host._tryPaintLinkSpanningMatches(p, [entry], null, {
      clearExisting: true,
      effectiveStyle: "text",
      filePath: "n.md",
    });
    const span = p.querySelectorAll(".always-color-text-highlight")[0];
    expect(span).toBeTruthy();
    expect(span.style._p["color"]).toBe("#111111");
    expect(span.style._p["background-color"]).toContain("34,34,34");
  });

  it("blacklisted spanning text is left alone", () => {
    const host = makeHost();
    host.isWordBlacklisted = (w) => String(w).includes("{>>");
    const { p } = buildP();
    host._tryPaintLinkSpanningMatches(p, [regexEntry("\\{>>[^\\}]*\\}")], null, {
      clearExisting: true,
      effectiveStyle: "text",
      filePath: "n.md",
    });
    expect(p.querySelectorAll(".always-color-text-highlight").length).toBe(0);
    expect(p.querySelectorAll("a.internal-link").length).toBe(1);
  });
});

describe("linkSpanning: LP link split helper", () => {
  it("splits spanning (outer kept, link flagged flat), drops inner", () => {
    const host = makeHost();
    const e = { pattern: "x" };
    const skip = { start: 1, end: 3, skip: true };
    const line = { start: 0, end: 5, entryRef: { markTarget: "line" } };
    const spanning = { start: 0, end: 13, entryRef: e };
    const inner = { start: 5, end: 7, entryRef: e };
    const outside = { start: 20, end: 25, entryRef: e };
    const out = host._splitMatchesAtLinks(
      [spanning, inner, outside, skip, line],
      [[4, 12]],
    );
    // spanning -> [0,4) flat-right, [4,12) flat link, [12,13) flat-left
    const pieces = out.filter((m) => m.entryRef === e && !m.skip);
    expect(pieces.map((m) => [m.start, m.end])).toEqual([
      [0, 4],
      [4, 12],
      [12, 13],
      [20, 25],
    ]);
    const [pre, link, post] = pieces;
    expect(pre._linkInner).toBeUndefined();
    expect(pre._flatRight).toBe(true);
    expect(pre._flatLeft).toBeUndefined();
    expect(link._linkInner).toBe(true);
    expect(post._linkInner).toBeUndefined();
    expect(post._flatLeft).toBe(true);
    expect(post._flatRight).toBeUndefined();
    // inner dropped, skip/line/outer pass through untouched
    expect(out).not.toContain(inner);
    expect(out).toContain(outside);
    expect(out).toContain(skip);
    expect(out).toContain(line);
    expect(out.length).toBe(6);
  });

  it("piece box flattens only the link-facing sides", () => {
    const host = makeHost();
    const full = { hPad: 4, radius: 8 };
    expect(host._linkPieceBox(full, {})).toEqual({
      padL: 4,
      padR: 4,
      tl: 8,
      tr: 8,
      bl: 8,
      br: 8,
      flat: false,
    });
    expect(host._linkPieceBox(full, { _linkInner: true })).toEqual({
      padL: 0,
      padR: 0,
      tl: 0,
      tr: 0,
      bl: 0,
      br: 0,
      flat: true,
    });
    expect(host._linkPieceBox(full, { _flatRight: true })).toMatchObject({
      padL: 4,
      padR: 0,
      tl: 8,
      tr: 0,
      bl: 8,
      br: 0,
      flat: true,
    });
    expect(host._linkPieceBox(full, { _flatLeft: true })).toMatchObject({
      padL: 0,
      padR: 4,
      tl: 0,
      tr: 8,
      bl: 0,
      br: 8,
      flat: true,
    });
    expect(
      host._linkPieceRadius({ flat: false }, 8),
    ).toBe("border-radius: 8px !important;");
    expect(
      host._linkPieceRadius(
        { flat: true, tl: 8, tr: 0, bl: 8, br: 0 },
        8,
      ),
    ).toBe(
      "border-top-left-radius: 8px !important;" +
        " border-top-right-radius: 0px !important;" +
        " border-bottom-left-radius: 8px !important;" +
        " border-bottom-right-radius: 0px !important;",
    );
  });
});

describe("usableElementEntries: deactivation respected", () => {
  function hostWith(settings) {
    const host = makeHost();
    Object.assign(host.settings, settings);
    return host;
  }
  it("drops inactive entries and inactive-group members", () => {
    const host = hostWith({
      wordEntries: [
        { uid: "on", pattern: "a", targetElement: "tag" },
        { uid: "off", pattern: "b", targetElement: "tag", active: false },
      ],
      wordEntryGroups: [
        {
          uid: "g-off",
          active: false,
          entries: [{ uid: "g1", pattern: "c", targetElement: "tag" }],
        },
        {
          uid: "g-on",
          active: true,
          entries: [
            { uid: "g2", pattern: "d", targetElement: "tag" },
            { uid: "g3", pattern: "e", targetElement: "tag", active: false },
          ],
        },
      ],
    });
    const { main, all } = host._usableElementEntries();
    expect(main.map((e) => e.uid)).toEqual(["on"]);
    expect(all.map((e) => e.uid)).toEqual(["g2", "on"]);
  });
});
