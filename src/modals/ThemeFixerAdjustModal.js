import { Modal } from "obsidian";

export class ThemeFixerAdjustModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass("act-theme-fixer-modal");
      this.modalEl.style.width = "min(90vw, 1000px)";
      this.modalEl.style.maxWidth = "1000px";
    } catch (e) {}

    const title = contentEl.createEl("h3", {
      text: this.plugin.t("theme_fixer_adjust_title", "Theme Color Adjustments"),
    });
    title.style.marginTop = "0";

    const modes = [
      {
        key: "dark",
        labelKey: "theme_fixer_dark",
        labelText: "Dark mode",
        bg: "#1e1e1e",
        fg: "#dcddde",
      },
      {
        key: "light",
        labelKey: "theme_fixer_light",
        labelText: "Light mode",
        bg: "#ffffff",
        fg: "#2e2e2e",
      },
    ];

    const themeBg = {
      dark: this._themeVar("--background-primary", "theme-dark") || "#1e1e1e",
      light: this._themeVar("--background-primary", "theme-light") || "#ffffff",
    };
    const themeFg = {
      dark: this._themeVar("--text-normal", "theme-dark") || "#dcddde",
      light: this._themeVar("--text-normal", "theme-light") || "#2e2e2e",
    };

    const panels = contentEl.createDiv();
    panels.classList.add("act-fixer-panels");
    panels.style.display = "flex";
    panels.style.gap = "16px";
    panels.style.marginTop = "6px";

    for (const mode of modes) {
      const col = panels.createDiv();
      col.style.flex = "1 1 0";
      col.style.minWidth = "0";
      col.style.marginBottom = "8px";

      const panel = col.createDiv();
      panel.style.position = "relative";
      panel.style.borderRadius = "8px";
      panel.style.padding = "14px";
      panel.style.minHeight = "150px";
      panel.classList.add(mode.key === "dark" ? "theme-dark" : "theme-light");
      panel.style.background = themeBg[mode.key];
      panel.style.color = themeFg[mode.key];
      panel.style.border = "1px solid var(--background-modifier-border)";

      const cap = panel.createEl("div", {
        text: this.plugin.t(mode.labelKey, mode.labelText),
      });
      cap.style.fontSize = "12px";
      cap.style.fontWeight = "bold";
      cap.style.marginBottom = "10px";

      const resetBtn = panel.createEl("button", {
        text: this.plugin.t("theme_fixer_reset", "Reset"),
      });
      resetBtn.style.position = "absolute";
      resetBtn.style.top = "8px";
      resetBtn.style.right = "8px";
      resetBtn.style.fontSize = "11px";
      resetBtn.style.padding = "2px 8px";
      resetBtn.style.cursor = "pointer";

      const sampleSwatch = panel.createDiv();

      const samplePreset = panel.createDiv();
      samplePreset.style.marginTop = "16px";

      this._fillSwatches(sampleSwatch);
      this._fillPresets(samplePreset);

      const k = this._keysFor(mode.key);
      let b = this._num(this.plugin.settings[k.b], 1);
      let c = this._num(this.plugin.settings[k.c], 1);
      let s = this._num(this.plugin.settings[k.s], 1);

      // Collect every highlight span so we can drive the filter inline on each
      // one (and mark them to skip the document-level rule).
      const spans = [];
      sampleSwatch
        .querySelectorAll(".always-color-text-highlight")
        .forEach((sp) => {
          sp.classList.add("act-fixer-noauto");
          spans.push(sp);
        });
      samplePreset
        .querySelectorAll(".always-color-text-highlight")
        .forEach((sp) => {
          sp.classList.add("act-fixer-noauto");
          spans.push(sp);
        });

      const applyThis = () => {
        const f = `brightness(${b}) contrast(${c}) saturate(${s})`;
        for (const sp of spans) sp.style.filter = f;
      };
      applyThis();

      const sliderWrap = col.createDiv();
      sliderWrap.style.marginTop = "12px";
      const refs = [];
      refs.push(
        this._addSlider(sliderWrap, "theme_fixer_brightness", "Brightness", b, k.b, "b", (v) => {
          this.plugin.settings[k.b] = v;
          b = v;
          applyThis();
          this._live();
        }),
      );
      refs.push(
        this._addSlider(sliderWrap, "theme_fixer_contrast", "Contrast", c, k.c, "c", (v) => {
          this.plugin.settings[k.c] = v;
          c = v;
          applyThis();
          this._live();
        }),
      );
      refs.push(
        this._addSlider(sliderWrap, "theme_fixer_saturation", "Saturation", s, k.s, "s", (v) => {
          this.plugin.settings[k.s] = v;
          s = v;
          applyThis();
          this._live();
        }),
      );

      resetBtn.addEventListener("click", () => {
        const def = { b: 1, c: 1, s: 1 };
        b = def.b;
        c = def.c;
        s = def.s;
        this.plugin.settings[k.b] = def.b;
        this.plugin.settings[k.c] = def.c;
        this.plugin.settings[k.s] = def.s;
        for (const ref of refs) {
          const dv = def[ref.axis];
          ref.input.value = String(dv);
          ref.val.textContent = dv.toFixed(2);
        }
        applyThis();
        this._live();
      });
    }
  }

  // Resolve a theme variable by temporarily applying the theme class to
  // <body>, reading the computed value, then restoring the class. No repaint
  // happens between, so there is no visible flash.
  _themeVar(name, cls) {
    try {
      const prev = document.body.className;
      document.body.classList.add(cls);
      const v = getComputedStyle(document.body).getPropertyValue(name).trim();
      document.body.className = prev;
      return v;
    } catch (e) {
      return "";
    }
  }

  _keysFor(mode) {
    const cap = mode === "dark" ? "Dark" : "Light";
    return {
      b: "themeFixer" + cap + "Brightness",
      c: "themeFixer" + cap + "Contrast",
      s: "themeFixer" + cap + "Saturation",
    };
  }

  _addSlider(parent, labelKey, labelText, value, settingKey, axis, onInput) {
    const wrap = parent.createDiv();
    wrap.style.marginBottom = "10px";
    const head = wrap.createDiv();
    head.style.display = "flex";
    head.style.justifyContent = "space-between";
    head.style.fontSize = "12px";
    head.style.marginBottom = "4px";
    head.createSpan({ text: this.plugin.t(labelKey, labelText) });
    const val = head.createSpan();
    val.style.color = "var(--text-muted)";
    val.textContent = value.toFixed(2);
    const input = wrap.createEl("input");
    input.type = "range";
    input.min = "0.3";
    input.max = "2";
    input.step = "0.05";
    input.value = String(value);
    input.style.width = "100%";
    input.addEventListener("input", () => {
      const v = parseFloat(input.value);
      val.textContent = v.toFixed(2);
      onInput(v);
    });
    return { input, val, settingKey, axis };
  }

  _fillSwatches(container) {
    const text = this.plugin.t(
      "theme_fixer_sample_text",
      "I look different in each theme mode! Tune me so your colors stay readable and pleasing whether your Obsidian is in Dark or Light :)",
    );
    const colors = this._sampleColors();
    const words = text.split(" ");
    const line = container.createDiv();
    line.style.lineHeight = "1.5";
    words.forEach((w) => {
      const span = line.createEl("span");
      span.className = "always-color-text-highlight";
      const c = colors.length ? colors[0] : "#888888";
      // cycle through as many swatch colors as possible
      colors.push(colors.shift());
      span.style.setProperty("--highlight-color", c);
      span.style.color = c;
      span.textContent = w + " ";
      span.style.padding = "1px 4px";
      span.style.borderRadius = "3px";
    });
  }

  _fillPresets(container) {
    const all = Array.isArray(this.plugin.settings.textStylePresets)
      ? this.plugin.settings.textStylePresets
      : [];
    if (all.length === 0) {
      const none = container.createEl("div");
      none.style.fontSize = "12px";
      none.style.color = "var(--text-muted)";
      none.textContent = this.plugin.t("theme_fixer_no_presets", "No presets yet.");
      return;
    }
    // Cap how many presets render in the preview so the row stays manageable.
    const MAX_PRESETS_PREVIEW = 10;
    const presets = all.slice(0, MAX_PRESETS_PREVIEW);
    const sw = this._sampleColors();
    const line = container.createDiv();
    line.style.lineHeight = "2";
    line.style.textAlign = "center";
    presets.forEach((pst, i) => {
      const fallback = sw.length ? sw[i % sw.length] : "#3b82f6";
      const { text, bg, hasBg } = this._presetColors(pst, fallback);
      const span = line.createEl("span");
      span.className = "always-color-text-highlight act-fixer-noauto";
      span.style.display = "inline-block";
      span.style.margin = "4px 5px";
      span.style.textAlign = "center";
      const params = this.plugin.getHighlightParams(pst);
      const radius = params.radius ?? 8;
      const hPad = params.hPad ?? 4;
      const vPad = params.vPad ?? 0;
      if (text) {
        span.style.setProperty("--highlight-color", text);
        span.style.color = text;
      }
      if (hasBg) {
        const op =
          typeof pst.backgroundOpacity === "number"
            ? pst.backgroundOpacity
            : params.opacity ?? 25;
        const bgColor = this._withAlpha(bg, op / 100);
        span.style.setProperty("--highlight-background", bgColor);
        span.style.backgroundColor = bgColor;
      }
      // Respect border sides / line style / thickness per preset via the
      // plugin's own generator (handles "underline", "left", etc.).
      const border = this.plugin.generateBorderStyle(
        text || null,
        hasBg ? bg : null,
        pst,
      );
      if (border) {
        span.style.cssText = span.style.cssText + border;
      }
      span.style.borderRadius = radius + "px";
      span.style.padding = `${vPad}px ${hPad}px`;
      // The highlight CSS class forces `vertical-align: baseline !important`
      // and `line-height: inherit !important`; override them so each preset's
      // own vertical padding / height is actually reflected in the preview.
      span.style.setProperty("vertical-align", "middle", "important");
      span.style.setProperty("line-height", "normal", "important");
      span.textContent = (pst.name || "Preset") + " ";
    });
  }

  _presetColors(pst, fallback) {
    const okHex = (x) =>
      typeof this.plugin.isValidHexColor === "function"
        ? this.plugin.isValidHexColor(x)
        : /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(x || "");
    const tcRaw = pst && pst.textColor ? pst.textColor : null;
    const bcRaw = pst && pst.backgroundColor ? pst.backgroundColor : null;
    const tcHex = tcRaw && tcRaw !== "currentColor" && okHex(tcRaw) ? tcRaw : null;
    const bcHex = bcRaw && okHex(bcRaw) ? bcRaw : null;
    if (bcHex) return { text: tcHex, bg: bcHex, hasBg: true };
    if (tcHex) return { text: tcHex, bg: null, hasBg: false };
    // Preset has no usable color of its own → borrow a swatch color so a
    // highlight actually appears in the preview.
    return { text: null, bg: fallback || "#3b82f6", hasBg: true };
  }

  _sampleColors() {
    const def = Array.isArray(this.plugin.settings.swatches)
      ? this.plugin.settings.swatches
      : [];
    const cus = Array.isArray(this.plugin.settings.userCustomSwatches)
      ? this.plugin.settings.userCustomSwatches
      : [];
    const combined = [...def, ...cus]
      .map((x) => (x && x.color ? x.color : null))
      .filter(Boolean);
    const out = combined.slice();
    if (out.length === 0) out.push("#ff5555", "#37d67a", "#5b9bff");
    return out;
  }

  _withAlpha(hex, a) {
    if (!hex) return "transparent";
    hex = String(hex).trim();
    if (hex.startsWith("#")) {
      let h = hex.slice(1);
      if (h.length === 3)
        h = h
          .split("")
          .map((c) => c + c)
          .join("");
      if (h.length === 6) {
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
    }
    return hex;
  }

  _num(v, dflt) {
    return typeof v === "number" && isFinite(v) ? v : dflt;
  }

  _live() {
    try {
      this.plugin.applyThemeFixer();
    } catch (e) {}
    this._save();
  }

  _save() {
    try {
      this.plugin.saveSettings();
    } catch (e) {}
  }

  onClose() {
    // Flush any pending change so adjusting sliders persists even if the modal
    // is dismissed by clicking outside.
    this._save();
    const { contentEl } = this;
    contentEl.empty();
  }
}
