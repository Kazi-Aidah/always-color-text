import { Modal, setIcon } from 'obsidian';

/**
 * Derives a CSS string from an entry's highlight styling properties,
 * falling back to global plugin settings for any unset entry property.
 * @param {object} entry - Entry or Group object
 * @param {object} plugin - AlwaysColorText plugin instance
 * @returns {string} CSS declarations string
 */
function deriveHighlightCssFromEntry(entry, plugin) {
  const lines = [];
  const settings = plugin.settings;

  // Determine effective style type
  const styleType = entry.styleType || (entry.backgroundColor ? 'highlight' : 'text');
  const isTextOnly = styleType === 'text';

  // color
  const tc = (entry.textColor && entry.textColor !== 'currentColor')
    ? entry.textColor : entry.color;
  if (tc) lines.push(`color: ${tc}`);

  // background-color as rgba (skip for text-only)
  const bg = entry.backgroundColor;
  if (bg && !isTextOnly) {
    const opacity = entry.backgroundOpacity ?? settings.backgroundOpacity ?? 35;
    lines.push(`background-color: ${plugin.hexToRgba(bg, opacity)}`);
  }

  // border-radius and padding only for non-text-only entries
  if (!isTextOnly) {
    const radius = entry.highlightBorderRadius ?? settings.highlightBorderRadius ?? 4;
    lines.push(`border-radius: ${radius}px`);

    const hpad = entry.highlightHorizontalPadding ?? settings.highlightHorizontalPadding ?? 4;
    const vpad = entry.highlightVerticalPadding ?? settings.highlightVerticalPadding ?? 0;
    lines.push(`padding: ${vpad}px ${hpad}px`);

    // border (only if enabled) — respect the border side setting
    const enableBorder = entry.enableBorderThickness ?? settings.enableBorderThickness ?? false;
    if (enableBorder) {
      const thickness = entry.borderThickness ?? settings.borderThickness ?? 1;
      const lineStyle = entry.borderLineStyle ?? settings.borderLineStyle ?? 'solid';
      const borderSide = entry.borderStyle ?? settings.borderStyle ?? 'full';
      // Use explicit color instead of currentColor so it works regardless of context
      const borderColor = tc || 'currentColor';
      const borderVal = `${thickness}px ${lineStyle} ${borderColor}`;
      switch (borderSide) {
        case 'top':    lines.push(`border-top: ${borderVal}`); break;
        case 'bottom': lines.push(`border-bottom: ${borderVal}`); break;
        case 'left':   lines.push(`border-left: ${borderVal}`); break;
        case 'right':  lines.push(`border-right: ${borderVal}`); break;
        case 'top-bottom':
          lines.push(`border-top: ${borderVal}`);
          lines.push(`border-bottom: ${borderVal}`);
          break;
        case 'left-right':
          lines.push(`border-left: ${borderVal}`);
          lines.push(`border-right: ${borderVal}`);
          break;
        case 'top-right':
          lines.push(`border-top: ${borderVal}`);
          lines.push(`border-right: ${borderVal}`);
          break;
        case 'top-left':
          lines.push(`border-top: ${borderVal}`);
          lines.push(`border-left: ${borderVal}`);
          break;
        case 'bottom-right':
          lines.push(`border-bottom: ${borderVal}`);
          lines.push(`border-right: ${borderVal}`);
          break;
        case 'bottom-left':
          lines.push(`border-bottom: ${borderVal}`);
          lines.push(`border-left: ${borderVal}`);
          break;
        case 'full':
        default:
          lines.push(`border: ${borderVal}`);
          break;
      }
    }
  }

  return lines.join(';\n') + ';';
}

const DANGEROUS_PATTERNS = ['url(', 'expression(', 'javascript:', '<', '>'];

export class CustomCssModal extends Modal {
  constructor(app, plugin, entry) {
    super(app);
    this.plugin = plugin;
    this.entry = entry;
    this._handlers = [];
    this._debounceTimer = null;
    this._previewSpan = null;
    this._validationEl = null;
    this._textarea = null;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Guard: entry must exist
    if (!this.entry) {
      contentEl.createEl('p', { text: 'Error: no entry provided to CustomCssModal.' });
      return;
    }

    try {
      this.modalEl.addClass('act-custom-css-modal');
      this.modalEl.style.minWidth = '540px';
    } catch (_) {}

    // 1. Heading
    const heading = contentEl.createEl('h2', {
      text: this.plugin.t('custom_css_header', 'Edit Custom CSS'),
    });
    heading.style.margin = '0 0 12px 0';

    // 2. Preview wrap
    const previewWrap = contentEl.createDiv();
    previewWrap.style.marginBottom = '12px';
    previewWrap.style.padding = '10px 12px';
    previewWrap.style.border = '1px solid var(--background-modifier-border)';
    previewWrap.style.borderRadius = 'var(--button-radius)';
    previewWrap.style.background = 'var(--background-modifier-form-field)';

    const previewArea = previewWrap.createDiv();
    previewArea.style.minHeight = '2.5em';
    previewArea.style.display = 'flex';
    previewArea.style.alignItems = 'center';
    previewArea.style.justifyContent = 'center';

    const sampleText = this.entry.isRegex
      ? (this.entry.presetLabel || this.entry.pattern || 'Sample Text')
      : (this.entry.pattern || 'Sample Text');

    this._previewSpan = previewArea.createEl('span', { text: sampleText });
    this._previewSpan.style.display = 'inline-block';
    this._previewSpan.style.padding = '4px 8px';
    this._previewSpan.style.minHeight = '1.5em';
    this._previewSpan.style.borderRadius = 'var(--button-radius)';

    // 3. CSS editor
    const textareaWrap = contentEl.createDiv();
    textareaWrap.style.marginBottom = '10px';

    const textareaLabel = textareaWrap.createEl('div', { text: 'CSS Declarations' });
    textareaLabel.style.fontSize = '11px';
    textareaLabel.style.color = 'var(--text-muted)';
    textareaLabel.style.marginBottom = '4px';
    textareaLabel.style.textTransform = 'uppercase';
    textareaLabel.style.letterSpacing = '0.05em';

    const taBox = textareaWrap.createDiv();
    taBox.style.border = '1px solid var(--background-modifier-border)';
    taBox.style.borderRadius = 'var(--button-radius)';
    taBox.style.background = 'var(--background-modifier-form-field)';
    taBox.style.transition = 'border-color 0.15s';

    this._textarea = taBox.createEl('div');
    this._textarea.contentEditable = 'true';
    this._textarea.style.width = '100%';
    this._textarea.style.minHeight = '160px';
    this._textarea.style.border = 'none';
    this._textarea.style.outline = 'none';
    this._textarea.style.background = 'transparent';
    this._textarea.style.color = 'var(--text-normal)';
    this._textarea.style.padding = '8px';
    this._textarea.style.boxSizing = 'border-box';
    this._textarea.style.fontFamily = 'var(--font-monospace)';
    this._textarea.style.fontSize = '13px';
    this._textarea.style.whiteSpace = 'pre-wrap';
    this._textarea.style.wordBreak = 'break-word';
    this._textarea.style.lineHeight = '1.6';

    // Focus/blur accent border on the wrapper
    const focusHandler = () => { taBox.style.borderColor = 'var(--color-accent)'; taBox.style.borderWidth = '2px'; };
    const blurHandler = () => { taBox.style.borderColor = ''; taBox.style.borderWidth = ''; };
    this._textarea.addEventListener('focus', focusHandler);
    this._textarea.addEventListener('blur', blurHandler);
    this._handlers.push({ el: this._textarea, ev: 'focus', fn: focusHandler });
    this._handlers.push({ el: this._textarea, ev: 'blur', fn: blurHandler });

    // value shim: get/set via textContent
    Object.defineProperty(this._textarea, 'value', {
      get() { return this.textContent; },
      set(v) { this.textContent = v; },
      configurable: true,
    });

    // Pre-fill
    if (this.entry.customCss && this.entry.customCss.trim().length > 0) {
      this._textarea.value = this.entry.customCss;
    } else {
      this._textarea.value = deriveHighlightCssFromEntry(this.entry, this.plugin);
    }

    // 4. Validation area
    this._validationEl = contentEl.createDiv();
    this._validationEl.style.display = 'none';
    this._validationEl.style.marginBottom = '8px';
    this._validationEl.style.padding = '6px 10px';
    this._validationEl.style.borderRadius = '4px';
    this._validationEl.style.background = 'var(--background-modifier-error)';
    this._validationEl.style.color = 'var(--text-error)';
    this._validationEl.style.fontSize = '12px';
    this._validationEl.style.whiteSpace = 'pre-wrap';

    // 6. Button row
    const row = contentEl.createDiv();
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.marginTop = '4px';
    row.style.justifyContent = 'space-between';

    const clearBtn = row.createEl('button', {
      text: this.plugin.t('btn_reset', 'Clear'),
    });

    const saveBtn = row.createEl('button', {
      text: this.plugin.t('btn_save', 'Save'),
    });
    saveBtn.addClass('mod-cta');

    // Wire textarea input event (debounced 300ms)
    const inputHandler = () => {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        this._updatePreview();
        this._validateInput();
      }, 300);
    };
    this._textarea.addEventListener('input', inputHandler);
    this._handlers.push({ el: this._textarea, ev: 'input', fn: inputHandler });

    // Save handler
    const save = async () => {
      if (this.entry) {
        this.entry.customCss = this._textarea.value.trim() || undefined;
      }
      await this.plugin.saveSettings();
      try {
        window.dispatchEvent(new CustomEvent('act-colors-changed', { detail: { entry: this.entry } }));
      } catch (_) {}
      try { this.plugin.reconfigureEditorExtensions(); } catch (_) {}
      try { this.plugin.forceRefreshAllEditors(); } catch (_) {}
      try { this.plugin.forceRefreshAllReadingViews(); } catch (_) {}
      this.close();
    };

    // Clear handler
    const clear = async () => {
      if (this.entry) this.entry.customCss = undefined;
      await this.plugin.saveSettings();
      try {
        window.dispatchEvent(new CustomEvent('act-colors-changed', { detail: { entry: this.entry } }));
      } catch (_) {}
      try { this.plugin.reconfigureEditorExtensions(); } catch (_) {}
      try { this.plugin.forceRefreshAllEditors(); } catch (_) {}
      try { this.plugin.forceRefreshAllReadingViews(); } catch (_) {}
      this.close();
    };

    saveBtn.addEventListener('click', save);
    clearBtn.addEventListener('click', clear);
    this._handlers.push({ el: saveBtn, ev: 'click', fn: save });
    this._handlers.push({ el: clearBtn, ev: 'click', fn: clear });

    // Initial render (no debounce)
    this._updatePreview();
    this._validateInput();
  }

  _updatePreview() {
    if (!this._previewSpan || !this.entry) return;

    // Reset inline styles
    this._previewSpan.removeAttribute('style');
    this._previewSpan.style.display = 'inline-block';
    this._previewSpan.style.padding = '4px 8px';
    this._previewSpan.style.minHeight = '1.5em';
    this._previewSpan.style.borderRadius = 'var(--button-radius)';

    // Apply base text color
    const tc = (this.entry.textColor && this.entry.textColor !== 'currentColor')
      ? this.entry.textColor : this.entry.color;
    if (tc) this._previewSpan.style.setProperty('color', tc, 'important');

    // Apply base background color (skip for text-only entries)
    const styleType = this.entry.styleType || (this.entry.backgroundColor ? 'highlight' : 'text');
    if (styleType !== 'text' && this.entry.backgroundColor) {
      const opacity = this.entry.backgroundOpacity
        ?? this.plugin.settings.backgroundOpacity
        ?? 35;
      const rgba = this.plugin.hexToRgba(this.entry.backgroundColor, opacity);
      this._previewSpan.style.setProperty('background-color', rgba, 'important');
    }

    // Apply sanitized custom CSS on top (directly, bypassing enableCustomCss gate)
    const raw = this._textarea ? this._textarea.value : '';
    if (raw.trim()) {
      const sanitized = this.plugin.sanitizeCssDeclarations(raw);
      if (sanitized) {
        const parts = sanitized.split(';').map(s => s.trim()).filter(Boolean);
        for (const p of parts) {
          const idx = p.indexOf(':');
          if (idx === -1) continue;
          const prop = p.slice(0, idx).trim();
          const val = p.slice(idx + 1).trim();
          try {
            this._previewSpan.style.setProperty(prop, val, 'important');
          } catch (_) {
            this._previewSpan.style[prop] = val;
          }
        }
      }
    }
  }

  _validateInput() {
    if (!this._validationEl || !this._textarea) return;

    const raw = this._textarea.value;
    if (!raw.trim()) {
      this._validationEl.style.display = 'none';
      return;
    }

    const warnings = [];
    const parts = raw.split(";").map(s => s.replace(/\n/g, " ").trim()).filter(Boolean);

    for (const part of parts) {
      const idx = part.indexOf(':');
      if (idx === -1) continue;
      const prop = part.slice(0, idx).trim().toLowerCase();
      const val = part.slice(idx + 1).trim();

      if (!/^[a-z\-]+$/.test(prop)) {
        warnings.push(`Invalid property name: "${prop}" (must match /^[a-z\\-]+$/)`);
      }

      for (const d of DANGEROUS_PATTERNS) {
        if (val.toLowerCase().includes(d)) {
          warnings.push(`Dangerous value in "${prop}": contains "${d}"`);
          break;
        }
      }
    }

    if (warnings.length > 0) {
      this._validationEl.textContent = warnings.join('\n');
      this._validationEl.style.display = 'block';
    } else {
      this._validationEl.style.display = 'none';
    }
  }

  _insertAtCursor(text) {
    const ta = this._textarea;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    ta.value = before + text + after;
    ta.selectionStart = ta.selectionEnd = start + text.length;
    ta.focus();
  }

  onClose() {
    clearTimeout(this._debounceTimer);
    try {
      this._handlers?.forEach(h => {
        try { h.el.removeEventListener(h.ev, h.fn); } catch (_) {}
      });
    } catch (_) {}
    this._handlers = [];
    this.contentEl.empty();
  }
}
