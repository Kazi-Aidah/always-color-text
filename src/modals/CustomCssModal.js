import { Modal, setIcon } from 'obsidian';

/**
 * Derives a CSS string from an entry's highlight styling properties,
 * falling back to global plugin settings for any unset entry property.
 * @param {object} entry - Entry or Group object
 * @param {object} plugin - AlwaysColorText plugin instance
 * @returns {string} CSS declarations string
 */
export function deriveHighlightCssFromEntry(entry, plugin) {
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

const DANGEROUS_PATTERNS = ['url(', 'expression(', 'javascript:', 'vbscript:', 'data:', '@import', '@charset', '@namespace', '<', '>', '{', '}', ';'];

/**
 * Parses a CSS declarations string back into an entry's structured fields.
 * This makes CustomCssModal and HighlightStylingModal interchangeable.
 * Only updates fields that are explicitly present in the CSS.
 * @param {string} css - CSS declarations string
 * @param {object} entry - Entry object to update in-place
 * @param {object} plugin - Plugin instance (for isValidHexColor)
 */
export function parseCssIntoEntry(css, entry, plugin) {
  if (!css || !entry) return;
  const parts = css.split(';').map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();

    switch (prop) {
      case 'color': {
        // Extract hex from rgba/rgb/hex
        const hex = extractHex(val, plugin);
        if (hex) {
          const styleType = entry.styleType || 'text';
          if (styleType === 'both' || styleType === 'highlight') {
            entry.textColor = hex;
            entry.color = '';
          } else {
            entry.color = hex;
            entry.textColor = null;
          }
        }
        break;
      }
      case 'background-color': {
        const hex = extractHex(val, plugin);
        if (hex) {
          entry.backgroundColor = hex;
          // Back-calculate opacity from rgba(r,g,b,a)
          const rgbaMatch = val.match(/rgba\s*\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/i);
          if (rgbaMatch) {
            const alpha = parseFloat(rgbaMatch[1]);
            if (!isNaN(alpha)) entry.backgroundOpacity = Math.round(alpha * 100);
          }
          // Back-calculate opacity from 8-digit hex (#rrggbbaa)
          const hexAlphaMatch = val.trim().match(/^#[0-9a-f]{6}([0-9a-f]{2})$/i);
          if (hexAlphaMatch) {
            const alpha = parseInt(hexAlphaMatch[1], 16) / 255;
            entry.backgroundOpacity = Math.round(alpha * 100);
          }
          // Promote styleType: text → highlight, keep both as both
          if (!entry.styleType || entry.styleType === 'text') {
            entry.styleType = 'highlight';
          }
        }
        break;
      }
      case 'border-radius': {
        const n = parseFloat(val);
        if (!isNaN(n)) entry.highlightBorderRadius = n;
        break;
      }
      case 'padding': {
        // "Vpx Hpx" or "Vpx Hpx Vpx Hpx" etc.
        const nums = val.match(/[\d.]+/g);
        if (nums && nums.length >= 2) {
          entry.highlightVerticalPadding = parseFloat(nums[0]);
          entry.highlightHorizontalPadding = parseFloat(nums[1]);
        } else if (nums && nums.length === 1) {
          entry.highlightVerticalPadding = parseFloat(nums[0]);
          entry.highlightHorizontalPadding = parseFloat(nums[0]);
        }
        break;
      }
      case 'padding-top':
      case 'padding-bottom': {
        const n = parseFloat(val);
        if (!isNaN(n)) entry.highlightVerticalPadding = n;
        break;
      }
      case 'padding-left':
      case 'padding-right': {
        const n = parseFloat(val);
        if (!isNaN(n)) entry.highlightHorizontalPadding = n;
        break;
      }
      // border shorthand: "1px solid #color"
      case 'border':
      case 'border-top':
      case 'border-bottom':
      case 'border-left':
      case 'border-right': {
        entry.enableBorderThickness = true;
        const thicknessMatch = val.match(/^([\d.]+)px/);
        if (thicknessMatch) entry.borderThickness = parseFloat(thicknessMatch[1]);
        const lineStyles = ['solid','dashed','dotted','double','groove','ridge','inset','outset'];
        for (const ls of lineStyles) {
          if (val.includes(ls)) { entry.borderLineStyle = ls; break; }
        }
        // Map property to borderStyle side
        const sideMap = {
          'border': 'full', 'border-top': 'top', 'border-bottom': 'bottom',
          'border-left': 'left', 'border-right': 'right',
        };
        if (sideMap[prop]) entry.borderStyle = sideMap[prop];
        break;
      }
    }
  }

  // After parsing all declarations, derive the correct styleType from populated fields
  const hasText = !!(entry.color || (entry.textColor && entry.textColor !== 'currentColor'));
  const hasBg = !!entry.backgroundColor;
  if (hasText && hasBg) {
    entry.styleType = 'both';
    // Ensure textColor is set correctly for 'both'
    if (entry.color && !entry.textColor) {
      entry.textColor = entry.color;
      entry.color = '';
    }
  } else if (hasBg) {
    entry.styleType = 'highlight';
    if (!entry.textColor) entry.textColor = 'currentColor';
  } else if (hasText) {
    entry.styleType = 'text';
    entry.textColor = null;
    entry.backgroundColor = null;
  }
}

/**
 * Patches layout properties (padding, border-radius, border thickness/style)
 * in an existing CSS string from the entry's structured fields.
 * Color properties are handled separately by syncEntryCssFromColors.
 * User-defined properties not managed by HighlightStylingModal are preserved.
 */
export function patchCssLayoutFromEntry(css, entry, plugin) {
  if (!css || !entry) return css;
  const settings = plugin.settings;
  const styleType = entry.styleType || (entry.backgroundColor ? 'highlight' : 'text');
  const isTextOnly = styleType === 'text';

  // Build map of layout properties to update
  const updates = {};
  if (!isTextOnly) {
    const radius = entry.highlightBorderRadius ?? settings.highlightBorderRadius ?? 4;
    updates['border-radius'] = `${radius}px`;

    const hpad = entry.highlightHorizontalPadding ?? settings.highlightHorizontalPadding ?? 4;
    const vpad = entry.highlightVerticalPadding ?? settings.highlightVerticalPadding ?? 0;
    updates['padding'] = `${vpad}px ${hpad}px`;

    const enableBorder = entry.enableBorderThickness ?? settings.enableBorderThickness ?? false;
    if (enableBorder) {
      const thickness = entry.borderThickness ?? settings.borderThickness ?? 1;
      const lineStyle = entry.borderLineStyle ?? settings.borderLineStyle ?? 'solid';
      const tc = (entry.textColor && entry.textColor !== 'currentColor') ? entry.textColor : entry.color;
      const borderColor = tc || 'currentColor';
      const borderVal = `${thickness}px ${lineStyle} ${borderColor}`;
      const borderSide = entry.borderStyle ?? settings.borderStyle ?? 'full';
      const borderProps = {
        'full': ['border'],
        'top': ['border-top'], 'bottom': ['border-bottom'],
        'left': ['border-left'], 'right': ['border-right'],
        'top-bottom': ['border-top', 'border-bottom'],
        'left-right': ['border-left', 'border-right'],
        'top-right': ['border-top', 'border-right'],
        'top-left': ['border-top', 'border-left'],
        'bottom-right': ['border-bottom', 'border-right'],
        'bottom-left': ['border-bottom', 'border-left'],
      };
      for (const p of (borderProps[borderSide] || ['border'])) {
        updates[p] = borderVal;
      }
    }
  }

  // Parse, patch, rebuild
  const sanitized = plugin.sanitizeCssDeclarations(css);
  if (!sanitized) return css;
  const parts = sanitized.split(';').map(s => s.trim()).filter(Boolean);
  const parsed = parts.map(p => {
    const idx = p.indexOf(':');
    if (idx === -1) return { prop: p, val: '' };
    return { prop: p.slice(0, idx).trim().toLowerCase(), val: p.slice(idx + 1).trim() };
  });

  const found = new Set();
  const rebuilt = parsed.map(({ prop, val }) => {
    if (updates.hasOwnProperty(prop)) {
      found.add(prop);
      return `${prop}: ${updates[prop]}`;
    }
    return `${prop}: ${val}`;
  });

  for (const [prop, val] of Object.entries(updates)) {
    if (!found.has(prop)) rebuilt.push(`${prop}: ${val}`);
  }

  return rebuilt.join(';\n') + ';';
}

/** Extract a hex color from a CSS value (handles #hex, rgb(), rgba()) */
function extractHex(val, plugin) {
  const trimmed = val.trim();
  // 8-digit hex (#rrggbbaa) — strip alpha, return 6-digit base color
  if (/^#[0-9a-f]{8}$/i.test(trimmed)) return trimmed.slice(0, 7);
  // Direct hex (3 or 6 digit)
  if (/^#[0-9a-f]{3,6}$/i.test(trimmed)) return trimmed;
  // rgb(r,g,b) or rgba(r,g,b,a)
  const rgbMatch = val.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return null;
}

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
      this.modalEl.addClass("act-modal");
      this.modalEl.addClass('act-custom-css-modal');
      this.modalEl.style.minWidth = '540px';
    } catch (_) {}

    // 1. Heading
    const heading = contentEl.createEl('h2', {
      text: this.plugin.t('edit_custom_css_btn', 'Edit Custom CSS'),
    });
    heading.style.margin = '0 0 12px 0';

    // 2. Preview wrap
    const previewWrap = contentEl.createDiv();
    previewWrap.addClass('act-custom-css-preview-wrap');
    previewWrap.style.marginBottom = '12px';
    previewWrap.style.padding = '10px 12px';
    previewWrap.style.border = '1px solid var(--background-modifier-border)';
    previewWrap.style.borderRadius = 'var(--button-radius)';
    previewWrap.style.background = 'var(--background-modifier-form-field)';
    previewWrap.style.minHeight = '2.5em';
    previewWrap.style.display = 'flex';
    previewWrap.style.alignItems = 'center';
    previewWrap.style.justifyContent = 'center';

    const sampleText = this.entry.name
      ? this.entry.name
      : this.entry.isRegex
        ? (this.entry.presetLabel || this.entry.pattern || 'Sample Text')
        : (this.entry.pattern || 'Sample Text');

    this._previewSpan = previewWrap.createEl('span');
    this._previewSpan.style.display = 'inline';
    this._previewSpan.textContent = sampleText;

    // 3. CSS editor
    const textareaWrap = contentEl.createDiv();
    textareaWrap.style.marginBottom = '10px';

    const textareaLabel = textareaWrap.createEl('div', { text: this.plugin.t('css_declarations_label', 'CSS Declarations') });
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

    // value shim: get/set via textContent with newline preservation
    Object.defineProperty(this._textarea, 'value', {
      get() {
        // Use innerText to get rendered text without HTML tags; <br> becomes \n automatically
        return (this.innerText || '').replace(/\r\n/g, '\n');
      },
      set(v) {
        // Convert newlines to <br> elements for proper display in contentEditable
        const div = document.createElement('div');
        v.split('\n').forEach((line, i) => {
          if (i > 0) div.appendChild(document.createElement('br'));
          div.appendChild(document.createTextNode(line));
        });
        this.innerHTML = div.innerHTML;
      },
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
      text: this.plugin.t('btn_reset', 'Reset'),
    });

    const saveBtn = row.createEl('button', {
      text: this.plugin.t('btn_save', 'Save'),
    });
    saveBtn.addClass('mod-cta');
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
        const css = this._textarea.value.trim() || undefined;
        this.entry.customCss = css;
        // Parse CSS back into structured fields so HighlightStylingModal stays in sync
        if (css) parseCssIntoEntry(css, this.entry, this.plugin);
      }
      await this.plugin.saveSettings();
      try { this.plugin.compileWordEntries(); } catch (_) {}
      try { this.plugin.compileTextBgColoringEntries(); } catch (_) {}
      try {
        window.dispatchEvent(new CustomEvent('act-colors-changed', { detail: { entry: this.entry } }));
      } catch (_) {}
      try { this.plugin.reconfigureEditorExtensions(); } catch (_) {}
      try { this.plugin.forceRefreshAllEditors(); } catch (_) {}
      try { this.plugin.forceRefreshAllReadingViews(); } catch (_) {}
      this.close();
    };

    // Reset handler — restores textarea to the derived CSS (discards any custom CSS)
    const clear = () => {
      this._textarea.value = deriveHighlightCssFromEntry(this.entry, this.plugin);
      this._updatePreview();
      this._validateInput();
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
    this._previewSpan.style.display = 'inline';

    // Apply base text color
    const tc = (this.entry.textColor && this.entry.textColor !== 'currentColor')
      ? this.entry.textColor : this.entry.color;
    if (tc) this._previewSpan.style.setProperty('color', tc, 'important');

    // Apply base background color (skip for text-only entries)
    const styleType = this.entry.styleType || (this.entry.backgroundColor ? 'highlight' : 'text');
    if (styleType !== 'text' && this.entry.backgroundColor) {
      const p = this.plugin.getHighlightParams(this.entry);
      const rgba = this.plugin.hexToRgba(this.entry.backgroundColor, p.opacity ?? 35);
      const radius = p.radius ?? 4;
      const hpad = p.hPad ?? 4;
      const vpad = p.vPad ?? 0;

      this._previewSpan.style.setProperty('background-color', rgba, 'important');
      this._previewSpan.style.setProperty('border-radius', `${radius}px`, 'important');
      this._previewSpan.style.setProperty('padding', `${vpad}px ${hpad}px`, 'important');
      this._previewSpan.style.setProperty('box-decoration-break', 'clone', 'important');
      this._previewSpan.style.setProperty('-webkit-box-decoration-break', 'clone', 'important');

      // Add border if enabled
      if (this.entry.enableBorderThickness || this.plugin.settings.enableBorderThickness) {
        const borderStyle = this.plugin.generateBorderStyle(tc, this.entry.backgroundColor, this.entry);
        if (borderStyle) {
          const parts = borderStyle.split(';').map(s => s.trim()).filter(Boolean);
          for (const part of parts) {
            const idx = part.indexOf(':');
            if (idx === -1) continue;
            this._previewSpan.style.setProperty(part.slice(0, idx).trim(), part.slice(idx + 1).trim(), 'important');
          }
        }
      }
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
