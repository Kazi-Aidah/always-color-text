const {
  Plugin,
  PluginSettingTab,
  Setting,
  Modal,
  MarkdownView,
  Notice,
  FuzzySuggestModal,
  debounce
} = require('obsidian');
const { RangeSetBuilder } = require('@codemirror/state');
const { Decoration, ViewPlugin } = require('@codemirror/view');
const { syntaxTree } = require('@codemirror/language');



module.exports = class AlwaysColorText extends Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ColorSettingTab(this.app, this));

    // --- Ribbon icon ---
    this.ribbonIcon = this.addRibbonIcon('palette', 'Always color text', async () => {
      this.settings.enabled = !this.settings.enabled;
      await this.saveSettings();
      this.updateStatusBar();
      this.reconfigureEditorExtensions();
      this.forceRefreshAllEditors();
      this.forceRefreshAllReadingViews();
      new Notice(`Always color text ${this.settings.enabled ? 'enabled' : 'disabled'}`);
    });

    // --- The Status bar toggle ---
    if (!this.settings.disableToggleModes.statusBar) {
      this.statusBar = this.addStatusBarItem();
      this.updateStatusBar();
      this.statusBar.onclick = () => {
        this.settings.enabled = !this.settings.enabled;
        this.saveSettings();
        this.updateStatusBar();
        this.reconfigureEditorExtensions();
        this.forceRefreshAllEditors();
        this.forceRefreshAllReadingViews();
      };
    } else {
      this.statusBar = null;
    }

    // --- Add toggle to the file menu ---
    const { TFile } = require('obsidian');
    this.registerEvent(this.app.workspace.on('file-menu', (menu, file) => {
      if (!(file instanceof TFile)) return;
      menu.addItem(item => {
        const isDisabled = this.settings.disabledFiles.includes(file.path);
        item.setTitle(`${isDisabled ? 'Enable' : 'Disable'} always color text for this file`)
          .setIcon(isDisabled ? 'eye' : 'eye-off')
          .onClick(async () => {
            if (isDisabled) {
              this.settings.disabledFiles.remove(file.path);
            } else {
              this.settings.disabledFiles.push(file.path);
            }
            await this.saveSettings();
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
          });
      });
    }));

    // --- Right-click menu for selected text: color and highlight options ---
    this.registerEvent(this.app.workspace.on('editor-menu', (menu, editor, view) => {
      const selectedText = editor.getSelection().trim();
      if (selectedText.length > 0) {
        // Color once:
        menu.addItem(item => {
          item.setTitle("Color once")
            .setIcon('brush')
            .onClick(() => {
              // Warn if blacklisted
              if (this.settings.blacklistWords.includes(selectedText)) {
                new Notice(`"${selectedText}" is blacklisted and cannot be colored.`);
                return;
              }
              new ColorPickerModal(this.app, this, (color) => {
                const html = `<span style="color: ${color}">${selectedText}</span>`;
                editor.replaceSelection(html);
              }).open();
            });
        });
        // Highlight once:
        if (this.settings.enableAlwaysHighlight) {
          menu.addItem(item => {
            item.setTitle("Highlight once")
              .setIcon('highlighter')
              .onClick(() => {
                // Warn if blacklisted
                if (this.settings.blacklistWords.includes(selectedText)) {
                  new Notice(`"${selectedText}" is blacklisted and cannot be highlighted.`);
                  return;
                }
                new ColorPickerModal(this.app, this, (color) => {
                  const html = `<span style="background-color: ${color}">${selectedText}</span>`;
                  editor.replaceSelection(html);
                }).open();
              });
          });
        }
        // Always color text:
        menu.addItem(item => {
          item.setTitle("Always color text")
            .setIcon('palette')
            .onClick(() => {
              // Warn if blacklisted
              if (this.settings.blacklistWords.includes(selectedText)) {
                new Notice(`"${selectedText}" is blacklisted and cannot be colored.`);
                return;
              }
              new ColorPickerModal(this.app, this, async (color) => {
                await this.saveEntry(selectedText, color);
                this.refreshEditor(view, true);
              }).open();
            });
        });
        // Remove always text color (checks new wordEntries model)
        const hasLiteralEntry = this.settings.wordEntries.some(e => e && e.pattern === selectedText && !e.isRegex);
        if (hasLiteralEntry) {
          menu.addItem(item => {
            item.setTitle("Remove always text color")
              .setIcon('eraser')
              .onClick(async () => {
                this.settings.wordEntries = this.settings.wordEntries.filter(e => !(e && e.pattern === selectedText && !e.isRegex));
                await this.saveSettings();
                this.refreshEditor(view, true);
                new Notice(`Removed always color for \"${selectedText}\".`);
              });
          });
        }
        // Blacklist words from coloring
        if (this.settings.enableBlacklistMenu) {
          menu.addItem(item => {
            item.setTitle("Blacklist words from coloring")
              .setIcon('ban')
              .onClick(async () => {
                if (!this.settings.blacklistWords.includes(selectedText)) {
                  this.settings.blacklistWords.push(selectedText);
                  await this.saveSettings();
                  new Notice(`"${selectedText}" added to blacklist.`);
                  this.refreshEditor(view, true);
                } else {
                  new Notice(`"${selectedText}" is already blacklisted.`);
                }
              });
          });
        }
      }
    }));
    

    // --- Command palette thingy ---
    if (!this.settings.disableToggleModes.command) {
      this.addCommand({
        id: 'set-color-for-selection',
  name: 'Always color text',
        editorCallback: (editor, view) => {
          const word = editor.getSelection().trim();
          if (!word) {
            new Notice("Please select some text first.");
            return;
          }
          new ColorPickerModal(this.app, this, async (color) => {
            await this.saveEntry(word, color);
            this.forceRefreshAllEditors();
          }).open();
        }
      });

      // --- Disable coloring for current document ---
      this.addCommand({
        id: 'disable-coloring-for-current-document',
  name: 'Disable coloring for current document',
        callback: async () => {
          const md = this.app.workspace.getActiveFile();
          if (md && !this.settings.disabledFiles.includes(md.path)) {
            this.settings.disabledFiles.push(md.path);
            await this.saveSettings();
            new Notice(`Coloring disabled for ${md.path}`);
          } else if (md && this.settings.disabledFiles.includes(md.path)) {
            new Notice(`Coloring is already disabled for ${md.path}`);
          } else {
            new Notice('No active file to disable coloring for.');
          }
        }
      });

      // --- Disable Always Color Text globally ---
      this.addCommand({
        id: 'disable-always-color-text',
  name: 'Disable always color text',
        callback: async () => {
          if (!this.settings.enabled) {
            new Notice('Always Color Text is already disabled.');
            return;
          }
          this.settings.enabled = false;
          await this.saveSettings();
          new Notice('Always Color Text Disabled');
          this.reconfigureEditorExtensions();
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
        }
      });

      // --- Enable Always Color Text globally ---
      this.addCommand({
        id: 'enable-always-color-text',
  name: 'Enable always color text',
        callback: async () => {
          if (this.settings.enabled) {
            new Notice('Always Color Text is already enabled.');
            return;
          }
          this.settings.enabled = true;
          await this.saveSettings();
          new Notice('Always Color Text Enabled');
          this.reconfigureEditorExtensions();
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
        }
      });
    }

    // --- Enable plugin features ---
    if (this.settings.enabled) {
      this.enablePluginFeatures();
    }
  }

  // --- Regex complexity checker to avoid catastrophic patterns ---
  isRegexTooComplex(pattern) {
    if (!pattern || typeof pattern !== 'string') return false;
    try {
      // Special handling for quoted strings pattern
      if (pattern === '\"[^\"]*\"') {
        return false; // Allow this specific pattern
      }

      // Special handling for time patterns
      if (pattern.includes(':00') && /(?:AM|PM)/.test(pattern)) {
        return false; // Allow time patterns
      }

      // Special handling for measurement patterns
      if (pattern === '\\b\\d+(?:\\.\\d+)?(?:kg|cm|m|km|°C|°F|lbs)\\b' || 
          /^\b\d+(?:\.\d+)?(?:kg|cm|m|km|°C|°F|lbs)\b$/.test(pattern)) {
        return false; // Allow measurement patterns
      }

      // Check for certain safe patterns we want to allow
      const safePatterns = [
        /^https?:\/\/[^\s?]+(?:\?[^\s#]+)?(?:#[^\s]*)?$/,  // URLs
        /^\b\d{4}-\d{2}-\d{2}\b$/,                         // Dates
        /^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/, // Emails
        /^\\b(?:1[0-2]|0?[1-9]):[0-5][0-9]\\s?(?:AM|PM|am|pm)?\\b$/,  // Times with AM/PM
        /^\\b(?:[0-2]?[0-9]|2[0-3]):[0-5][0-9](?:am|pm)?\\b$/,        // 24hr times + am/pm
        /^\\b(?:today|tomorrow|yesterday|next week|last week)\\b$/,  // Time words
        /^\b\d+(?:\.\d+)?(?:kg|cm|m|km|°C|°F|lbs)\b$/,             // Measurements
      ];

      for (const safePattern of safePatterns) {
        if (safePattern.test(pattern)) return false;
      }

      // Limit alternations (a|b|c|d|e|f)
      if ((pattern.match(/\|/g) || []).length > 5) return true;
      
      // Length limit with exceptions for known good patterns
      if (pattern.length > 150 && !pattern.startsWith('https?://')) return true;
      
      // Block nested quantifiers like (.*)* or (.+)+ or similar constructs
      if (/\([^)]*\)[*+][*+]/.test(pattern)) return true;

      // Block known problematic constructs
      const dangerousPatterns = [
        /\([^)]*[*+]\)[*+]/,        // Nested groups with quantifiers
        /\{.+\}\{.+\}/,             // Multiple numeric quantifiers
        /\[([^\]]+\]){5,}/,         // Too many character classes
        /\(\?[=!<]/,                // Lookaheads/lookbehinds
        /\(\?[<][=!]/,              // Lookbehinds specifically
        /\*\+|\+\*/,                // Adjacent quantifiers
        /[*+]{3,}/,                 // Three or more consecutive quantifiers
        /\[[^\]]{100,}\]/,          // Very large character classes
        /\(\?[^:)].*\(\?[^:)]/      // Nested lookarounds
      ];
      
      if (dangerousPatterns.some(p => p.test(pattern))) return true;

      // Test compilation time but with a higher threshold for known patterns
      const start = Date.now();
      new RegExp(pattern);
      const compileTime = Date.now() - start;
      
      // More lenient timeout for known good patterns
      const isKnownGoodPattern = pattern.includes('https?://') || 
                                pattern.includes(':[0-5][0-9]') ||
                                pattern.includes('\"[^\"]*\"');
                                
      return isKnownGoodPattern ? compileTime > 100 : compileTime > 50;
      
    } catch (e) {
      return true;
    }
    return false;
  }

  // --- When the plugin is UNLOADING, remove all its UI and features ---
  onunload() {
    this.ribbonIcon?.remove();
    this.statusBar?.remove();
    this.disablePluginFeatures();
  }

  // --- Register CodeMirror, markdown, and listeners ---
  enablePluginFeatures() {
    if (!this.cmExtensionRegistered) {
      this.extension = this.buildEditorExtension();
      this.registerEditorExtension(this.extension);
      this.cmExtensionRegistered = true;
    }

    if (!this.markdownPostProcessorRegistered) {
      this._unregisterMarkdownPostProcessor = this.registerMarkdownPostProcessor((el, ctx) => {
        if (!this.settings.enabled) return;
        if (!ctx || !ctx.sourcePath) return;

        // ONLY process the active file to avoid coloring all open notes
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile || ctx.sourcePath !== activeFile.path) return;

        // Delegate to the active-file-only processor (handles DOM caps, deferral)
        try {
          this.processActiveFileOnly(el, ctx);
        } catch (e) {
          console.warn('Always Color Text: processActiveFileOnly failed', e);
        }
      });
      this.markdownPostProcessorRegistered = true;
    }

    if (!this.activeLeafChangeListenerRegistered) {
      this.activeLeafChangeListener = this.app.workspace.on('active-leaf-change', leaf => {
        if (leaf && leaf.view instanceof MarkdownView) {
          this.refreshEditor(leaf.view, true);
        }
      });
      this.registerEvent(this.activeLeafChangeListener);
      this.activeLeafChangeListenerRegistered = true;
    }

    // --- switching to reading view and refresh coloring fix ---
    this.registerEvent(
      this.app.workspace.on('layout-change', () => {
        const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeLeaf && activeLeaf.getMode && activeLeaf.getMode() === 'preview') {
          this.forceRefreshAllReadingViews();
        }
      })
    );

    this.refreshActiveEditor(true);
  }

  // --- Remove all CodeMirror extensions & listeners ---
  disablePluginFeatures() {
    if (this.cmExtensionRegistered && this.extension) {
      this.app.workspace.unregisterEditorExtension(this.extension);
      this.cmExtensionRegistered = false;
      this.extension = null;
    }

    if (this.markdownPostProcessorRegistered && this._unregisterMarkdownPostProcessor) {
      this._unregisterMarkdownPostProcessor();
      this.markdownPostProcessorRegistered = false;
      this._unregisterMarkdownPostProcessor = null;
    }

    if (this.activeLeafChangeListenerRegistered && this.activeLeafChangeListener) {
      this.app.workspace.off('active-leaf-change', this.activeLeafChangeListener);
      this.activeLeafChangeListenerRegistered = false;
      this.activeLeafChangeListener = null;
    }

    this.refreshActiveEditor(true);
  }

  // --- Load plugin settings from disk, with defaults ---
  async loadSettings() {
    this.settings = Object.assign({
      // legacy: wordColors map. New model below: wordEntries array
      wordColors: {},
      wordEntries: [],
      caseSensitive: false,
      enabled: false,
      highlightStyle: 'text',
      backgroundOpacity: 35, // percent
      highlightBorderRadius: 4, // px
      highlightHorizontalPadding: 4, // px
      enableFolderRestrictions: false,
      excludedFolders: [],
      disabledFiles: [],
      customSwatchesEnabled: false,
      replaceDefaultSwatches: false,
      customSwatches: [
        '#eb3b5a', '#fa8231', '#e5a216', '#20bf6b',
        '#0fb9b1', '#2d98da', '#3867d6', 
        '#5454d0', 
        '#8854d0', // 0p
        '#a954d0', 
        '#e832c1', '#e83289', '#965b3b', '#8392a4'
      ],
      disableToggleModes: {
        statusBar: false,
        command: false,
        ribbon: false
      },
      enableAlwaysHighlight: false,
      partialMatch: false,
      blacklistWords: [],
      enableBlacklistMenu: false,
      symbolWordColoring: false,
      // Enable/disable regex support in the settings UI/runtime
      enableRegexSupport: false,
    }, await this.loadData() || {});
  // --- Normalize migrated folder exclusion settings ---
    if (!Array.isArray(this.settings.excludedFolders)) this.settings.excludedFolders = [];
    // Support old format (array of strings) by converting to objects { path, excluded }
    this.settings.excludedFolders = this.settings.excludedFolders.map(f => {
      if (!f) return null;
      if (typeof f === 'string') return { path: f, excluded: true, defaultColor: null, defaultStyle: null };
      if (typeof f === 'object' && f.path) return {
        path: f.path,
        excluded: typeof f.excluded === 'boolean' ? f.excluded : true,
        defaultColor: f.defaultColor || f.color || null,
        defaultStyle: f.defaultStyle || null
      };
      return null;
    }).filter(x => x && x.path && String(x.path).trim() !== '');

    // --- Migrate wordColors -> wordEntries (backwards compatible) ---
    if (!Array.isArray(this.settings.wordEntries) || this.settings.wordEntries.length === 0) {
      // If user already has wordEntries saved, keep them. Otherwise convert old map.
      const obj = this.settings.wordColors || {};
      const arr = [];
      for (const k of Object.keys(obj)) {
        const c = obj[k];
        arr.push({ pattern: String(k), color: String(c), isRegex: false, flags: '' });
      }
      this.settings.wordEntries = arr;
    } else {
      // Ensure shape for existing entries
      this.settings.wordEntries = this.settings.wordEntries.map(e => {
        if (!e) return null;
        if (typeof e === 'string') return { pattern: e, color: '#000000', isRegex: false, flags: '' };
        return {
          pattern: e.pattern || e.word || '',
          color: e.color || e.hex || '#000000',
          isRegex: !!e.isRegex,
          flags: e.flags || ''
        };
      }).filter(x => x && String(x.pattern).trim() !== '');
    }

    // compile word entries into fast runtime structures
    this.compileWordEntries();
  }

  // --- Save settings and refresh plugin state ---
  async saveSettings() {
    await this.saveData(this.settings);
    // Recompile entries after saving
    this.compileWordEntries();

    this.disablePluginFeatures();
    if (this.settings.enabled) {
      this.enablePluginFeatures();
    }
    this.updateStatusBar();
  }

  // --- Save a persistent color for a word ---
  async saveEntry(word, color) {
    // Save or update a literal (non-regex) entry in the new wordEntries model
    const pattern = String(word);
    const col = String(color);
    const idx = this.settings.wordEntries.findIndex(e => e && e.pattern === pattern && !e.isRegex);
    if (idx !== -1) {
      this.settings.wordEntries[idx].color = col;
    } else {
      this.settings.wordEntries.push({ pattern, color: col, isRegex: false, flags: '' });
    }
    await this.saveSettings();
    this.reconfigureEditorExtensions();
  }

  // --- FORCE REFRESH all open Markdown editors ---
  forceRefreshAllEditors() {
    this.app.workspace.iterateAllLeaves(leaf => {
      if (leaf.view instanceof MarkdownView && leaf.view.editor?.cm) {
        leaf.view.editor.cm.dispatch({ changes: [] });
      }
    });
  }

  // --- FORCE REFRESH all reading views (reading mode panes) ---
  forceRefreshAllReadingViews() {
    this.app.workspace.iterateAllLeaves(leaf => {
      if (leaf.view instanceof MarkdownView && leaf.view.getMode && leaf.view.getMode() === 'preview') {
        // Re-render reading mode
        if (typeof leaf.view.previewMode?.rerender === 'function') {
          leaf.view.previewMode.rerender(true);
        } else if (typeof leaf.view.previewMode?.render === 'function') {
          leaf.view.previewMode.render();
        } else if (typeof leaf.view?.rerender === 'function') {
          leaf.view.rerender();
        }
      }
    });
  }

  // --- Reconfigure CodeMirror extensions for all editors ---
  reconfigureEditorExtensions() {
    if (this.extension) {
      this.app.workspace.unregisterEditorExtension(this.extension);
      this.app.workspace.registerEditorExtension(this.extension);
    }
    this.forceRefreshAllEditors();
  }

  // --- Update Status Bar Text ---
  updateStatusBar() {
    if (this.statusBar) {
  this.statusBar.setText(`COL: ${this.settings.enabled ? 'ON' : 'OFF'}`);
    }
  }

  // --- Refresh only the Active Editor!!! ---
  refreshActiveEditor(force = false) {
    if (this._refreshTimeout) clearTimeout(this._refreshTimeout);
    this._refreshTimeout = setTimeout(() => {
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        this.refreshEditor(activeView, force);
      }
    }, 100);
  }

  // --- Refresh a Specific Editor ---
  refreshEditor(view, force = false) {
    if (view?.editor?.cm) {
      if (this._editorRefreshTimeout) clearTimeout(this._editorRefreshTimeout);
      this._editorRefreshTimeout = setTimeout(() => {
        const cm = view.editor.cm;
        cm.dispatch({ changes: [] });
      }, 100);
    }
  }

  // --- Escape Regex Special Characters ---
  escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --- Get Sorted Word Entries (Longest words first!!!) ---
  getSortedWordEntries() {
    const entries = Array.isArray(this._compiledWordEntries) ? this._compiledWordEntries.slice() : [];
    const numWords = entries.length;
    if (numWords > 200) {
      console.warn(`Always Color Text: You have ${numWords} colored words/patterns! That's a lot. Your app might slow down a bit.`);
    }
    // Filter out blacklisted simple patterns (case-sensitive handling)
    const filtered = entries.filter(e => {
      if (!e || !e.pattern) return false;
      if (!this.settings.blacklistWords || this.settings.blacklistWords.length === 0) return true;
      if (this.settings.caseSensitive) {
        return !this.settings.blacklistWords.includes(e.pattern);
      }
      const lower = e.pattern.toLowerCase();
      return !this.settings.blacklistWords.map(w => w.toLowerCase()).includes(lower);
    });
    // Already sorted by specificity during compilation, return filtered list
    return filtered;
  }

  // --- Helper: Convert hex to rgba with opacity ---
  hexToRgba(hex, opacityPercent) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    // Clampe and convert percent to 0-1
    let o = Math.max(0, Math.min(100, Number(opacityPercent)));
    o = o / 100;
    return `rgba(${r},${g},${b},${o})`;
  }

  // --- Helper: Check frontmatter for disabling coloring ---
  // `always-color-text: false` means no coloring
  isFrontmatterColoringDisabled(source) {
    if (!source) return false;
    const { TFile } = require('obsidian');
    let file = null;
    if (typeof source === 'string') {
      file = this.app.vault.getAbstractFileByPath(source);
    } else if (source instanceof TFile) {
      file = source;
    } else if (source.path) {
      file = source;
    }
    if (!file) return false;
    const cache = this.app.metadataCache.getFileCache(file);
    if (!cache || !cache.frontmatter) return false;
    // If frontmatter sets always-color-text: false -> disable
    if (Object.prototype.hasOwnProperty.call(cache.frontmatter, 'always-color-text')) {
      return cache.frontmatter['always-color-text'] === false;
    }
    return false;
  }

  // --- Helper: RegExp Folder Pattern ---
  _folderPatternToRegExp(pattern) {
    // Normalize slashes
    let p = String(pattern || '').replace(/\\/g, '/').trim();
    if (!p) return null;
    if (p.endsWith('/')) p = p.slice(0, -1);
    const hasWildcard = p.includes('*');
    if (!hasWildcard) {
      const esc = this.escapeRegex(p);
      return new RegExp('^' + esc + '(?:/.*)?$');
    }
    let regexStr = this.escapeRegex(p)
      .replace(/\\\*\\\*/g, '::DOUBLESTAR::')
      .replace(/\\\*/g, '[^/]*')
      .replace(/::DOUBLESTAR::/g, '.*');
    return new RegExp('^' + regexStr + '$');
  }

  // Return the most specific folder entry that matches filePath, or null
  getBestFolderEntry(filePath) {
    if (!filePath) return null;
    const fp = String(filePath).replace(/\\/g, '/');
    if (!Array.isArray(this.settings.excludedFolders) || this.settings.excludedFolders.length === 0) return null;
    const matched = [];
    for (const entry of this.settings.excludedFolders) {
      if (!entry || typeof entry.path !== 'string') continue;
      const pattern = entry.path.trim();
      if (!pattern) continue;
      const specificity = pattern.replace(/\*/g, '').length;
      if (pattern.includes('*')) {
        const re = this._folderPatternToRegExp(pattern);
        if (re && re.test(fp)) matched.push({ entry, specificity });
      } else {
        const norm = pattern.replace(/\\/g, '/');
        if (fp === norm || fp.startsWith(norm + '/')) matched.push({ entry, specificity });
      }
    }
    if (matched.length === 0) return null;
    matched.sort((a, b) => {
      if (b.specificity !== a.specificity) return b.specificity - a.specificity;
      const aExact = String(a.entry.path).replace(/\\/g, '/') === fp ? 1 : 0;
      const bExact = String(b.entry.path).replace(/\\/g, '/') === fp ? 1 : 0;
      return bExact - aExact;
    });
    return matched[0].entry;
  }

  // Check for known problematic patterns that should be blocked
  isKnownProblematicPattern(pattern) {
    if (!pattern || typeof pattern !== 'string') return false;
    
    // List of patterns known to cause issues
    const dangerousPatterns = [
      // Quote patterns that cause freezing
      '"[^"]*"',
      '\'[^\']*\'',
      '\\"[^\\"]*\\"',
      '\'(?:[^\'\\\\]|\\\\.)*\'',
      '"(?:[^"\\\\]|\\\\.)*"',

      // Complex date patterns
      '\\b\\d{4}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)-\\d{1,2}\\b',
      
      // Nested quantifiers (catastrophic backtracking)
      '(\\w+)*\\s+',
      '([a-z]+)*\\d+',
      '(\\d+){2,}*',
      '(a*)*b',
      '(a+)*b',
      
      // Backreferences with quantifiers
      '(\\w+)\\1+',
      '(\\w+)(\\1){3,}',
      
      // Complex lookarounds
      '(?<=\\b\\w{3})\\w+(?=\\w{3}\\b)',
      '\\w+(?<!bad)\\w+(?!worst)',
      '(?<!bad)(?<!worst)(?<!terrible)\\w+',
      
      // Long alternations with backreferences
      '\\b(word1|word2|word3|word4|word5)\\s+\\1\\b',
      
      // Complex nested groups
      '\\b((\\w+)\\s+((\\d+)\\s*)){3,}\\b',
      
      // HTML-like patterns
      '<([a-z]+)(?:\\s+\\w+="[^"]*")*>.*?</\\1>',
      
      // Overlapping patterns with quantifiers
      '(?:\\w+|\\d+)*\\s+',
      '(?:[a-z]*|[0-9]*)*',
      
      // Exponential patterns
      '^(a|a?)+$',
      '^(a|aa)+$',
      '^(.*a){10}.*$',
      
      // Deeply nested structures
      '\\((?:[^()]|\\([^()]*\\))*\\)',
      
      // Multiple lookarounds
      '(?<=\\w+)(?<!\\d+)\\w+(?=\\s+)(?!\\d+)',
      
      // Greedy patterns with nested groups
      '\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}',
    ];
    
    // Normalize patterns by removing whitespace before comparison
    return dangerousPatterns.some(dangerous => 
      pattern.replace(/\s/g, '') === dangerous.replace(/\s/g, '')
    );
  }

  // Compile word entries into runtime structures (regexes, testRegex, validity)
  compileWordEntries() {
    try {
      this._compiledWordEntries = [];
      if (!Array.isArray(this.settings.wordEntries)) return;
      for (const e of this.settings.wordEntries) {
        if (!e) continue;
        const pattern = String(e.pattern || '').trim();
        const color = e.color || '#000000';
        const isRegex = !!e.isRegex;
        
        // HARD-BLOCK known problematic patterns
        if (this.isKnownProblematicPattern(pattern)) {
          console.warn(`BLOCKED dangerous pattern: ${pattern.substring(0, 50)}`);
          const compiled = { pattern, color, isRegex, flags: '', regex: null, testRegex: null, invalid: true, specificity: 0 };
          this._compiledWordEntries.push(compiled);
          try {
            new Notice(`Pattern blocked for Memory Safety: ${pattern.substring(0, 30)}...`);
          } catch (e) {}
          continue;
        }

        const rawFlags = String(e.flags || '').replace(/[^gimsuy]/g, '');
        // base flags (without g for testRegex)
        let flags = rawFlags || '';
        if (!flags.includes('g')) flags += 'g';
        if (!this.settings.caseSensitive && !flags.includes('i')) flags += 'i';

        const compiled = { pattern, color, isRegex, flags, regex: null, testRegex: null, invalid: false, specificity: pattern.replace(/\*/g, '').length };
        if (!pattern) {
          compiled.invalid = true;
          this._compiledWordEntries.push(compiled);
          continue;
        }
        try {
          if (this.settings.enableRegexSupport && isRegex) {
            // Safety: block overly complex regexes early
            if (this.isRegexTooComplex(pattern)) {
              compiled.invalid = true;
              try {
                new Notice(`Pattern too complex: ${pattern.substring(0, 60)}...`);
              } catch (e) {}
              this._compiledWordEntries.push(compiled);
              continue;
            }
            // compile with combined flags
            compiled.regex = new RegExp(pattern, flags);
            // testRegex: same flags but without global to safely use .test()
            const testFlags = flags.replace(/g/g, '');
            compiled.testRegex = testFlags === '' ? new RegExp(pattern) : new RegExp(pattern, testFlags);
          } else {
            // literal: escape pattern
            const esc = this.escapeRegex(pattern);
            const literalFlags = this.settings.caseSensitive ? 'g' : 'gi';
            compiled.regex = new RegExp(esc, literalFlags);
            compiled.testRegex = this.settings.caseSensitive ? new RegExp(esc) : new RegExp(esc, 'i');
          }
        } catch (err) {
          compiled.invalid = true;
        }
        this._compiledWordEntries.push(compiled);
      }
      // sort by specificity (longer patterns first)
      this._compiledWordEntries.sort((a, b) => b.specificity - a.specificity || b.pattern.length - a.pattern.length);
    } catch (err) {
      console.error('Always Color Text: compileWordEntries failed', err);
      this._compiledWordEntries = [];
    }
  }

  // Helper: Check if a file path is in an excluded folder
  isFileInExcludedFolder(filePath) {
    if (!this.settings.enableFolderRestrictions) return false;
    if (!filePath) return false;
    const fp = String(filePath).replace(/\\/g, '/');
    if (!Array.isArray(this.settings.excludedFolders) || this.settings.excludedFolders.length === 0) return false;
    // Collect matching entries and pick the most specific one (child overrides parent), IMP
    const matched = [];
    for (const entry of this.settings.excludedFolders) {
      if (!entry || typeof entry.path !== 'string') continue;
      const pattern = entry.path.trim();
      if (!pattern) continue;
      // Longer means more specifiv
      const specificity = pattern.replace(/\*/g, '').length;
      if (pattern.includes('*')) {
        const re = this._folderPatternToRegExp(pattern);
        if (re && re.test(fp)) matched.push({ entry, specificity });
      } else {
        const norm = pattern.replace(/\\/g, '/');
        if (fp === norm || fp.startsWith(norm + '/')) matched.push({ entry, specificity });
      }
    }
    if (matched.length === 0) return false;
    // Choose the most specific match. If no, prefer exact match to the file path.
    matched.sort((a, b) => {
      if (b.specificity !== a.specificity) return b.specificity - a.specificity;
      const aExact = String(a.entry.path).replace(/\\/g, '/') === fp ? 1 : 0;
      const bExact = String(b.entry.path).replace(/\\/g, '/') === fp ? 1 : 0;
      return bExact - aExact;
    });
    return !!matched[0].entry.excluded;
  }

  // --- Apply Highlights in Reading View (Markdown Post Processor) ---
  // optional folderEntry may contain defaultColor to override match colors
  applyHighlights(el, folderEntry = null, options = {}) {
    const entries = this.getSortedWordEntries();
    if (entries.length === 0) return;
    if (el.offsetParent === null) return;
    // options: immediateBlocks, skipFirstN, clearExisting
    this._wrapMatchesRecursive(el, entries, folderEntry, options || {});
  }

  // Process only the active file: immediate visible blocks then deferred idle processing
  processActiveFileOnly(el, ctx) {
    if (!el || !ctx || !ctx.sourcePath) return;
    // Safety: skip if DOM is already large
    try {
      if (document.querySelectorAll('*').length > 2000) {
        console.warn('Always Color Text: Skipping processing because DOM is too large');
        return;
      }
    } catch (e) {}

    // File-specific disable via settings
    if (this.settings.disabledFiles.includes(ctx.sourcePath)) return;
    // Frontmatter can override per-file disabling: always-color-text: false
    if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;
    // Folder-specific rules
    const folderEntry = this.getBestFolderEntry(ctx.sourcePath);
    if (folderEntry && folderEntry.excluded) return;

    const immediateBlocks = 20;
    const processNow = () => this.applyHighlights(el, folderEntry || null, { immediateBlocks, clearExisting: true });

    // Fast-path immediate pass for visible content
    processNow();

    // Schedule deferred pass for remaining content in idle time
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      try {
        window.requestIdleCallback(() => {
          try {
            this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: false });
          } catch (e) {}
        }, { timeout: 2000 });
      } catch (e) {
        setTimeout(() => {
          try {
            this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: false });
          } catch (e) {}
        }, 1000);
      }
    } else {
      setTimeout(() => {
        try {
          this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: false });
        } catch (e) {}
      }, 1000);
    }
  }

  // Efficient, non-recursive, DOM walker for reading mode
  _wrapMatchesRecursive(element, entries, folderEntry = null, options = {}) {
    const immediateLimit = Number(options.immediateBlocks) || 0;
    const skipFirstN = Number(options.skipFirstN) || 0;
    const clearExisting = options.clearExisting !== false;
    const blockTags = ['P', 'LI', 'DIV', 'SPAN', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'EM', 'I', 'B', 'STRONG', 'CODE', 'PRE', 'A'];
    const queue = [];
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.ELEMENT_NODE && !['CODE', 'PRE'].includes(node.nodeName)) {
        if (blockTags.includes(node.nodeName)) queue.push(node);
        queue.push(...Array.from(node.querySelectorAll(blockTags.map(t => t.toLowerCase()).join(','))));
      }
    }
    if (element.nodeType === Node.ELEMENT_NODE && blockTags.includes(element.nodeName)) queue.unshift(element);
    let visited = 0;
    for (let qIndex = 0; qIndex < queue.length; qIndex++) {
      const block = queue[qIndex];
      // Skip blocks we've been asked to skip (deferred pass)
      if (qIndex < skipFirstN) {
        visited++;
        continue;
      }
      const effectiveStyle = (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle;
      let processed = 0;
      // Unwrap any existing highlights created by this plugin to avoid stacking when re-applying
      if (clearExisting) {
        const existingHighlights = Array.from(block.querySelectorAll('span.always-color-text-highlight'));
        for (const ex of existingHighlights) {
          const tn = document.createTextNode(ex.textContent);
          ex.replaceWith(tn);
        }
      }
      for (const node of Array.from(block.childNodes)) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        const text = node.textContent;
        if (!text || text.length > 2000) continue;
        let matches = [];

        const isBlacklisted = (textToCheck, coloredWord = null) => {
          return this.settings.blacklistWords.some(bw => {
            if (!bw) return false;
            if (this.settings.caseSensitive) {
              if (textToCheck === bw) return true;
              if (coloredWord && bw.includes(coloredWord)) return true;
            } else {
              const lowerText = textToCheck.toLowerCase();
              const lowerBW = bw.toLowerCase();
              if (lowerText === lowerBW) return true;
              if (coloredWord && lowerBW.includes(coloredWord.toLowerCase())) return true;
            }
            return false;
          });
        };

        for (const entry of entries) {
          if (!entry || entry.invalid) continue;
          const flags = entry.flags || (this.settings.caseSensitive ? 'g' : 'gi');
          const regex = entry.regex;
          if (!regex) continue;
          let match;
          while ((match = regex.exec(text))) {
            const matchedText = match[0];
            // Only block if the whole match is blacklisted
            if (this.settings.caseSensitive) {
              if (this.settings.blacklistWords.includes(matchedText)) continue;
            } else {
              if (this.settings.blacklistWords.map(w => w.toLowerCase()).includes(matchedText.toLowerCase())) continue;
            }
            const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
            matches.push({ start: match.index, end: match.index + matchedText.length, color: useColor, word: matchedText, highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
            if (matches.length > 100) break;
          }
          if (matches.length > 100) break;
        }

        // --- Partial Match coloring ---
        if (this.settings.partialMatch) {
          // Find all word-like substrings
          const wordRegex = /\w+/g;
          let match;
          while ((match = wordRegex.exec(text))) {
            const w = match[0];
            const start = match.index;
            const end = start + w.length;
            // Check if the entire word is blacklisted first
            if (isBlacklisted(w)) continue;
            for (const entry of entries) {
              if (!entry || entry.invalid) continue;
              if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue; // skip symbols here
              // Skip if the colored word itself is blacklisted
              if (isBlacklisted(entry.pattern)) continue;
              // Use testRegex to check substring membership without global lastIndex issues
              const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), 'i'));
              if (testRe.test(w)) {
                matches = matches.filter(m => m.end <= start || m.start >= end);
                const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
                matches.push({
                  start: start,
                  end: end,
                  color: useColor,
                  word: w,
                  highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4,
                  highlightBorderRadius: this.settings.highlightBorderRadius ?? 8
                });
                break; // Only color once per word
              }
            }
          }
        }

        // --- Symbol-Word Coloring ---
        // Always do normal symbol coloring (individual symbols)
        for (const entry of entries) {
          if (!entry || entry.invalid) continue;
          if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) {
            const regex = entry.regex;
            if (!regex) continue;
            let match;
            while ((match = regex.exec(text))) {
              const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
              matches.push({ start: match.index, end: match.index + match[0].length, color: useColor, word: match[0], highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
            }
          }
        }

        // If enabled, also color the whole word if it contains a colored symbol
        if (this.settings.symbolWordColoring) {
          const symbolEntries = entries.filter(entry => entry && !entry.invalid && /^[^a-zA-Z0-9]+$/.test(entry.pattern));
          if (symbolEntries.length > 0) {
            const wordRegex = /\b\w+[^\s]*\b/g;
            let match;
            while ((match = wordRegex.exec(text))) {
              const w = match[0];
              const start = match.index;
              const end = start + w.length;
              if (isBlacklisted(w)) continue;
              for (const symEntry of symbolEntries) {
                const testRe = symEntry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(symEntry.pattern)) : new RegExp(this.escapeRegex(symEntry.pattern), 'i'));
                if (testRe.test(w)) {
                  const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : symEntry.color;
                  matches.push({ start, end, color: useColor, word: w });
                  break;
                }
              }
            }
          }
        }

        // --- Remove overlapping matches, prefer longest ---
        matches.sort((a, b) => a.start - b.start || b.end - a.end);
        let lastEnd = 0;
        let nonOverlapping = [];
        for (const m of matches) {
          if (m.start >= lastEnd) {
            nonOverlapping.push(m);
            lastEnd = m.end;
          }
        }
        if (nonOverlapping.length) {
          processed++;
          // If we reached the immediate limit, schedule remaining work and return
          if (immediateLimit > 0 && processed >= immediateLimit) {
            const remainingSkip = qIndex + 1; // skip blocks we've already visited in the queue
            try {
              if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
                window.requestIdleCallback(() => this.applyHighlights(element, folderEntry, { skipFirstN: remainingSkip, clearExisting: false }), { timeout: 2000 });
              } else {
                setTimeout(() => this.applyHighlights(element, folderEntry, { skipFirstN: remainingSkip, clearExisting: false }), 50);
              }
            } catch (e) {
              setTimeout(() => this.applyHighlights(element, folderEntry, { skipFirstN: remainingSkip, clearExisting: false }), 50);
            }
            return;
          }
          const frag = document.createDocumentFragment();
          let pos = 0;
          
          let i = 0;
          while (i < nonOverlapping.length) {
            let m = nonOverlapping[i];
            let j = i + 1;
            
            // Merge adjacent highlights with the same color
            while (j < nonOverlapping.length && 
                  nonOverlapping[j].start === nonOverlapping[j - 1].end && 
                  nonOverlapping[j].color === m.color) {
              m = { start: m.start, end: nonOverlapping[j].end, color: m.color };
              j++;
            }
            
            if (m.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
            
            const span = document.createElement('span');
            span.className = 'always-color-text-highlight';
            span.textContent = text.slice(m.start, m.end);
            
            if (effectiveStyle === 'text') {
              span.style.color = m.color;
            } else {
              span.style.background = '';
              span.style.backgroundColor = this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25);
              span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + 'px';
              if ((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) {
                span.style.borderRadius = '0px';
              } else {
                span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + 'px';
              }
            }
            
            frag.appendChild(span);
            pos = m.end;
            i = j;
          }
          
          if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
          node.replaceWith(frag);
        }
      }
    }
  }


  // --- Build CodeMirror Editor Extension (Editing View) ---
  buildEditorExtension() {
    const plugin = this;
    return ViewPlugin.fromClass(class {
      constructor(view) {
        this.decorations = this.buildDeco(view);
      }
      update(update) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.buildDeco(update.view);
        }
      }
      buildDeco(view) {
        const builder = new RangeSetBuilder();
        const { from, to } = view.viewport;
        const chunkSize = 50000; // Process in 50k char chunks for better performance!!!
        const text = view.state.doc.sliceString(from, to);
        const activeFile = plugin.app.workspace.getActiveFile();
        if (!plugin.settings.enabled) return builder.finish();
        if (activeFile && plugin.settings.disabledFiles.includes(activeFile.path)) return builder.finish();
        if (activeFile && plugin.isFrontmatterColoringDisabled(activeFile.path)) return builder.finish();
        // Determine folder rule for this file (may contain defaultColor/excluded)
        const folderEntry = activeFile ? plugin.getBestFolderEntry(activeFile.path) : null;
        if (folderEntry && folderEntry.excluded) return builder.finish();
        if (view.file && activeFile && view.file.path !== activeFile.path) return builder.finish();
        const entries = plugin.getSortedWordEntries();
        if (entries.length === 0) return builder.finish();
        let matches = [];

        for (const entry of entries) {
          if (!entry || entry.invalid) continue;
          const regex = entry.regex;
          if (!regex) continue;
          let match;
          while ((match = regex.exec(text))) {
            const matchedText = match[0];
            if (plugin.settings.caseSensitive) {
              if (plugin.settings.blacklistWords.includes(matchedText)) continue;
            } else {
              if (plugin.settings.blacklistWords.map(w => w.toLowerCase()).includes(matchedText.toLowerCase())) continue;
            }
            matches.push({ start: from + match.index, end: from + match.index + matchedText.length, color: entry.color });
            if (matches.length > 100) break;
          }
          if (matches.length > 100) break;
        }

        // --- Partial Match coloring ---
        if (plugin.settings.partialMatch) {
          const words = text.split(/(\b|\W+)/);
          let pos = from;
          for (const w of words) {
            if (!w) {
              pos += w.length;
              continue;
            }
            // Symbol coloring
            for (const entry of entries) {
              if (!entry || entry.invalid) continue;
              if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) {
                const regex = entry.testRegex || entry.regex;
                if (!regex) continue;
                let match;
                while ((match = regex.exec(w))) {
                  matches.push({ start: pos + match.index, end: pos + match.index + match[0].length, color: entry.color });
                }
              }
            }
            // Whole word coloring
            if (/\w/.test(w) && !plugin.settings.blacklistWords.includes(w)) {
              for (const entry of entries) {
                if (!entry || entry.invalid) continue;
                if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
                const testRe = entry.testRegex || (plugin.settings.caseSensitive ? new RegExp(plugin.escapeRegex(entry.pattern)) : new RegExp(plugin.escapeRegex(entry.pattern), 'i'));
                if (testRe.test(w)) {
                  matches.push({ start: pos, end: pos + w.length, color: entry.color });
                  break;
                }
              }
            }
            pos += w.length;
          }
        }

        // --- Symbol-Word Coloring ---
        if (plugin.settings.symbolWordColoring) {
          // If enabled, color the whole word if it contains a colored symbol
          const symbolEntries = entries.filter(e => e && /^[^a-zA-Z0-9]+$/.test(e.pattern));
          if (symbolEntries.length > 0) {
            const wordRegex = /\b\w+[^\s]*\b/g;
            let match;
            while ((match = wordRegex.exec(text))) {
              const w = match[0];
              const start = from + match.index;
              const end = start + w.length;
              if (plugin.settings.blacklistWords.includes(w)) continue;
              for (const entry of symbolEntries) {
                const symbol = entry.pattern;
                const color = entry.color;
                const flags = plugin.settings.caseSensitive ? '' : 'i';
                // Use compiled testRegex if available (regex entries) or a simple escaped regex
                const regex = entry.testRegex || (entry.isRegex ? entry.regex : new RegExp(plugin.escapeRegex(symbol), flags));
                if (!regex) continue;
                if (regex.test(w)) {
                  matches.push({ start, end, color });
                  break; // Only color once per word
                }
              }
            }
          }
        } else {
          // Default: color symbols individually
          for (const entry of entries) {
            if (!entry) continue;
            if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) {
              const flags = plugin.settings.caseSensitive ? 'g' : 'gi';
              const regex = entry.testRegex || (entry.isRegex ? entry.regex : new RegExp(plugin.escapeRegex(entry.pattern), flags));
              if (!regex) continue;
              let match;
              while ((match = regex.exec(text))) {
                matches.push({ start: from + match.index, end: from + match.index + match[0].length, color: entry.color });
              }
            }
          }
        }

        // If folder sets a default color for this path, override collected match colors
        if (folderEntry && folderEntry.defaultColor) {
          matches = matches.map(m => Object.assign({}, m, { color: folderEntry.defaultColor }));
        }

        // --- Remove overlapping matches, prefer longest ---
        matches.sort((a, b) => a.start - b.start || b.end - a.end);
        let lastEnd = from;
        let nonOverlapping = [];
        for (let m of matches) {
          if (m.start >= lastEnd) {
            nonOverlapping.push(m);
            lastEnd = m.end;
          }
        }
        nonOverlapping = nonOverlapping.slice(0, 100);
        const effectiveStyle = (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : plugin.settings.highlightStyle;
        for (const m of nonOverlapping) {
          const style = effectiveStyle === 'text'
            ? `color: ${m.color} !important;`
            : `background: none !important; background-color: ${plugin.hexToRgba(m.color, plugin.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(((plugin.settings.highlightHorizontalPadding ?? 4) > 0 && (plugin.settings.highlightBorderRadius ?? 8) === 0) ? 0 : (plugin.settings.highlightBorderRadius ?? 8))}px !important; padding-left: ${(plugin.settings.highlightHorizontalPadding ?? 4)}px !important; padding-right: ${(plugin.settings.highlightHorizontalPadding ?? 4)}px !important;`;
          const deco = Decoration.mark({
            attributes: { style }
          });
          builder.add(m.start, m.end, deco);
        }
        return builder.finish();
      }
    }, {
      decorations: v => v.decorations
    });
  }
}

// --- Color Setting Tab Class ---
class ColorSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.debouncedSaveSettings = debounce(this.plugin.saveSettings.bind(this.plugin), 300);
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();



    // 1. Enable document color
    new Setting(containerEl)
      .setName('Enable document color')
      .addToggle(t => t.setValue(this.plugin.settings.enabled).onChange(async v => {
        this.plugin.settings.enabled = v;
        await this.debouncedSaveSettings();
      }));

    // 2. Case sensitive
    new Setting(containerEl)
      .setName('Case sensitive')
      .setDesc('If this is on, "word" and "Word" are treated as different. If it\'s off, they\'re colored the same.')
      .addToggle(t => t.setValue(this.plugin.settings.caseSensitive).onChange(async v => {
        this.plugin.settings.caseSensitive = v;
        await this.debouncedSaveSettings();
      }));

    // 3. Color style (was highlight style)
    new Setting(containerEl)
      .setName('Color style')
      .setDesc('Do you want to color the text itself or the background behind it?')
      .addDropdown(d => d
        .addOption('text', 'Text color')
        .addOption('background', 'Background highlight')
        .setValue(this.plugin.settings.highlightStyle)
        .onChange(async v => {
          this.plugin.settings.highlightStyle = v;
          await this.debouncedSaveSettings();
          this.display();
        }));

    // --- Background opacity and border radius (only if background) ---
    if (this.plugin.settings.highlightStyle === 'background') {
      // Opacity input (percent)
      new Setting(containerEl)
        .setName('Background opacity (%)')
        .setDesc('Set the opacity of the background highlight (0-100, percent)')
        .addText(text => text
          .setPlaceholder('0-100')
          .setValue(String(this.plugin.settings.backgroundOpacity ?? 25))
          .onChange(async v => {
            let val = parseInt(v);
            if (isNaN(val) || val < 0) val = 0;
            if (val > 100) val = 100;
            this.plugin.settings.backgroundOpacity = val;
            await this.debouncedSaveSettings();
          })
        )
        .addExtraButton(btn => btn
          .setIcon('reset')
          .setTooltip('Reset to 25')
          .onClick(async () => {
            this.plugin.settings.backgroundOpacity = 25;
            await this.debouncedSaveSettings();
            this.display();
          }));

      // Border radius input (px)
      new Setting(containerEl)
        .setName('Highlight border radius (px)')
        .setDesc('Set the border radius (in px) for rounded highlight corners')
        .addText(text => text
          .setPlaceholder('e.g. 0, 4, 8')
          .setValue(String(this.plugin.settings.highlightBorderRadius ?? 8))
          .onChange(async v => {
            let val = parseInt(v);
            if (isNaN(val) || val < 0) val = 0;
            this.plugin.settings.highlightBorderRadius = val;
            await this.debouncedSaveSettings();
          })
        )
        .addExtraButton(btn => btn
          .setIcon('reset')
          .setTooltip('Reset to 8')
          .onClick(async () => {
            this.plugin.settings.highlightBorderRadius = 8;
            await this.debouncedSaveSettings();
            this.display();
          }));

      // Horizontal padding input (px)
      new Setting(containerEl)
        .setName('Highlight horizontal padding (px)')
        .setDesc('Set the left and right padding (in px) for highlighted text')
        .addText(text => text
          .setPlaceholder('e.g. 0, 4, 8')
          .setValue(String(this.plugin.settings.highlightHorizontalPadding ?? 4))
          .onChange(async v => {
            let val = parseInt(v);
            if (isNaN(val) || val < 0) val = 0;
            this.plugin.settings.highlightHorizontalPadding = val;
            await this.debouncedSaveSettings();
          })
        )
        .addExtraButton(btn => btn
          .setIcon('reset')
          .setTooltip('Reset to 4')
          .onClick(async () => {
            this.plugin.settings.highlightHorizontalPadding = 4;
            await this.debouncedSaveSettings();
            this.display();
          }));
    }

    // 4. Enable highlight once
    new Setting(containerEl)
      .setName('Enable highlight once')
      .setDesc('This adds "Highlight once" to your right-click menu. You can highlight selected text with a background color.')
      .addToggle(t => t.setValue(this.plugin.settings.enableAlwaysHighlight).onChange(async v => {
        this.plugin.settings.enableAlwaysHighlight = v;
        await this.debouncedSaveSettings();
      }));

    // 5. Partial match
    new Setting(containerEl)
      .setName('Partial match')
      .setDesc('If enabled, the whole word will be colored if any colored word is found inside it (e.g., "as" colors "Jasper").')
      .addToggle(t => t.setValue(this.plugin.settings.partialMatch).onChange(async v => {
        this.plugin.settings.partialMatch = v;
        await this.debouncedSaveSettings();
      }));

    // 6. Symbol-word coloring
    new Setting(containerEl)
      .setName('Symbol-word coloring')
      .setDesc('If enabled, any word containing a colored symbol will inherit the symbol\'s color (e.g., "9:30" will be colored if ":" is colored).')
      .addToggle(t => t.setValue(this.plugin.settings.symbolWordColoring).onChange(async v => {
        this.plugin.settings.symbolWordColoring = v;
        await this.debouncedSaveSettings();
      }));

    // --- Custom swatches settings ---
    new Setting(containerEl)
      .setName('Color swatches')
      .setHeading();

    new Setting(containerEl)
      .setName('Enable custom swatches')
      .setDesc('Turn this on if you want to pick your own colors for the color picker.')
      .addToggle(t => t.setValue(this.plugin.settings.customSwatchesEnabled).onChange(async v => {
        this.plugin.settings.customSwatchesEnabled = v;
        await this.plugin.saveSettings();
        this.display();
      }));

    if (this.plugin.settings.customSwatchesEnabled) {
      new Setting(containerEl)
        .setName('Replace default swatches')
        .setDesc('If this is on, only your custom colors will show up in the color picker. No default ones!')
        .addToggle(t => t.setValue(this.plugin.settings.replaceDefaultSwatches).onChange(async v => {
          this.plugin.settings.replaceDefaultSwatches = v;
          await this.debouncedSaveSettings();
        }));

      this.plugin.settings.customSwatches.forEach((color, i) => {
        new Setting(containerEl)
          .setName(`Swatch ${i + 1}`)
          .addColorPicker(cp => cp.setValue(color).onChange(async c => {
            this.plugin.settings.customSwatches[i] = c;
            await this.debouncedSaveSettings();
          }))
          .addExtraButton(btn => btn.setIcon('trash').setTooltip('Remove swatch').onClick(async () => {
            this.plugin.settings.customSwatches.splice(i, 1);
            await this.plugin.saveSettings();
            this.display();
          }));
      });

      new Setting(containerEl)
        .addButton(b => b.setButtonText('+ Add color').onClick(async () => {
          this.plugin.settings.customSwatches.push('#000000');
          await this.plugin.saveSettings();
          this.display();
        }));
    }

    // --- Defined colored words / patterns ---
    new Setting(containerEl)
      .setName('Defined colored words')
      .setHeading();
    containerEl.createEl('p', { text: 'Here\'s where you manage your words/patterns and their colors. Changes here update your notes instantly!' });

    const listDiv = containerEl.createDiv();
    listDiv.addClass('color-words-list');

    // Render entries from the unified wordEntries array
    const renderEntries = () => {
      listDiv.empty();
      this.plugin.settings.wordEntries.forEach((entry, i) => {
        const row = listDiv.createDiv();
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.marginBottom = '8px';

        const textInput = row.createEl('input', { type: 'text', value: entry.pattern });
        textInput.style.flex = '1';
        textInput.style.padding = '6px';
        textInput.style.borderRadius = '4px';
        textInput.style.border = '1px solid var(--background-modifier-border)';
        textInput.style.marginRight = '8px';
        textInput.addEventListener('change', async () => {
          const newPattern = textInput.value.trim();
          if (!newPattern) {
            this.plugin.settings.wordEntries.splice(i, 1);
          } else if (this.plugin.settings.enableRegexSupport && entry.isRegex && this.plugin.isRegexTooComplex(newPattern)) {
            new Notice(`Pattern too complex: ${newPattern.substring(0, 60)}...`);
            // Revert to previous pattern
            textInput.value = entry.pattern;
            return;
          } else {
            this.plugin.settings.wordEntries[i].pattern = newPattern;
          }
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          renderEntries();
        });

        const cp = row.createEl('input', { type: 'color' });
        cp.value = entry.color || '#000000';
        cp.style.width = '30px';
        cp.style.height = '30px';
        cp.style.border = 'none';
        cp.style.borderRadius = '4px';
        cp.style.cursor = 'pointer';
        cp.addEventListener('input', async () => {
          this.plugin.settings.wordEntries[i].color = cp.value;
          await this.debouncedSaveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
        });

        // Use regex checkbox (toggled per-entry)
        const regexChk = row.createEl('input', { type: 'checkbox' });
        regexChk.checked = !!entry.isRegex;
        regexChk.title = 'Treat pattern as a JavaScript regular expression';
        regexChk.style.marginLeft = '8px';
        regexChk.addEventListener('change', async () => {
          this.plugin.settings.wordEntries[i].isRegex = regexChk.checked;
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          renderEntries();
        });

        // Flags input (visible when isRegex true)
        const flagsInput = row.createEl('input', { type: 'text', value: entry.flags || '' });
        flagsInput.placeholder = 'flags (e.g. gi)';
        flagsInput.style.width = '64px';
        flagsInput.style.marginLeft = '8px';
        flagsInput.addEventListener('change', async () => {
          this.plugin.settings.wordEntries[i].flags = flagsInput.value || '';
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
        });

        // Only show flags input when regex is enabled for this entry
        if (!entry.isRegex) flagsInput.style.display = 'none';

        const del = row.createEl('button', { text: '✕' });
        del.addClass('mod-warning');
        del.style.marginLeft = '8px';
        del.style.padding = '4px 8px';
        del.style.borderRadius = '4px';
        del.style.cursor = 'pointer';
        del.addEventListener('click', async () => {
          this.plugin.settings.wordEntries.splice(i, 1);
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          renderEntries();
        });
      });
    };

    renderEntries();

    new Setting(containerEl)
      .addButton(b => b.setButtonText('Add new word/pattern').onClick(async () => {
        const n = this.plugin.settings.wordEntries.length + 1;
        this.plugin.settings.wordEntries.push({ pattern: `New word ${n}`, color: '#000000', isRegex: false, flags: '' });
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        renderEntries();
      }));

    new Setting(containerEl)
      .addExtraButton(b => b
        .setIcon('trash')
        .setTooltip('Delete all defined words/patterns')
        .onClick(async () => {
          new ConfirmationModal(this.app, 'Delete all words', 'Are you sure you want to delete all your colored words/patterns? You can\'t undo this!', async () => {
            this.plugin.settings.wordEntries = [];
            await this.plugin.saveSettings();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            renderEntries();
          }).open();
        }));

    // Blacklist words
    new Setting(containerEl)
      .setName('Blacklist words')
      .setHeading();
    containerEl.createEl('p', { text: 'Words in this list will never be colored, even if they match (including partial matches).' });

    const blDiv = containerEl.createDiv();
    blDiv.addClass('blacklist-words-list');

    this.plugin.settings.blacklistWords.forEach((word, i) => {
      const row = blDiv.createDiv();
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.marginBottom = '8px';

      const textInput = row.createEl('input', { type: 'text', value: word });
      textInput.style.flex = '1';
      textInput.style.padding = '6px';
      textInput.style.borderRadius = '4px';
      textInput.style.border = '1px solid var(--background-modifier-border)';
      textInput.style.marginRight = '8px';
      textInput.addEventListener('change', async () => {
        const newWord = textInput.value.trim();
        if (newWord && newWord !== word) {
          this.plugin.settings.blacklistWords[i] = newWord;
          await this.plugin.saveSettings();
          this.display();
        } else if (!newWord) {
          this.plugin.settings.blacklistWords.splice(i, 1);
          await this.plugin.saveSettings();
          this.display();
        }
      });

      const del = row.createEl('button', { text: '✕' });
      del.addClass('mod-warning');
      del.style.marginLeft = '8px';
      del.style.padding = '4px 8px';
      del.style.borderRadius = '4px';
      del.style.cursor = 'pointer';
      del.addEventListener('click', async () => {
        this.plugin.settings.blacklistWords.splice(i, 1);
        await this.plugin.saveSettings();
        this.display();
      });
    });

    new Setting(containerEl)
      .addButton(b => b.setButtonText('Add blacklist word').onClick(async () => {
        this.plugin.settings.blacklistWords.push('');
        await this.plugin.saveSettings();
        this.display();
      }));

    new Setting(containerEl)
      .setName('Enable "Blacklist words from coloring" in right-click menu')
      .setDesc('Adds a right-click menu item to blacklist selected text from coloring.')
      .addToggle(t => t.setValue(this.plugin.settings.enableBlacklistMenu).onChange(async v => {
        this.plugin.settings.enableBlacklistMenu = v;
        await this.plugin.saveSettings();
        this.display();
      }));

    // --- File-specific options ---
    new Setting(containerEl)
      .setName('File-specific options')
      .setHeading();
    containerEl.createEl('p', { text: 'Here\'s where you manage files where coloring is taking a break.' });

    if (this.plugin.settings.disabledFiles.length > 0) {
      const disabledFilesDiv = containerEl.createDiv();
      disabledFilesDiv.createEl('h4', { text: 'Files with coloring disabled:' });
      this.plugin.settings.disabledFiles.forEach(filePath => {
        new Setting(disabledFilesDiv)
          .setName(filePath)
          .addExtraButton(btn => btn.setIcon('x').setTooltip('Enable for this file').onClick(async () => {
            this.plugin.settings.disabledFiles.remove(filePath);
            await this.plugin.saveSettings();
            this.display();
          }));
      });
    } else {
      containerEl.createEl('p', { text: 'No files currently have coloring disabled.' });
    }

    new Setting(containerEl)
      .setName('Disable coloring for current file')
      .setDesc('Click this to turn off coloring just for the note you\'re looking at right now.')
      .addButton(b => b.setButtonText('Disable for this file').onClick(async () => {
        const md = this.app.workspace.getActiveFile();
        if (md && !this.plugin.settings.disabledFiles.includes(md.path)) {
          this.plugin.settings.disabledFiles.push(md.path);
          await this.plugin.saveSettings();
          new Notice(`Coloring disabled for ${md.path}`);
          this.display();
        } else if (md && this.plugin.settings.disabledFiles.includes(md.path)) {
          new Notice(`Coloring is already disabled for ${md.path}`);
        } else {
          new Notice('No active file to disable coloring for.');
        }
      }));

  // Folder-specific settings
    new Setting(containerEl)
      .setName('Folder-Specific Coloring')
      .setHeading();

    new Setting(containerEl)
      .setName('Enable folder restrictions')
      .setDesc('When ON, files in the checked folders below will have coloring disabled. Leave OFF to ignore the list.')
      .addToggle(t => t.setValue(this.plugin.settings.enableFolderRestrictions).onChange(async v => {
        this.plugin.settings.enableFolderRestrictions = v;
        await this.debouncedSaveSettings();
        this.display();
      }));

  // Folder list
    const folderListDiv = containerEl.createDiv();
    folderListDiv.addClass('excluded-folders-list');

  // Folder suggestions
  const populateFolderSuggestions = () => {
      const files = this.app.vault.getFiles();
      const folders = new Set();
      files.forEach(f => {
        const p = f.path.replace(/\\/g, '/');
        const idx = p.lastIndexOf('/');
        const folder = idx !== -1 ? p.slice(0, idx) : '';
        if (folder) {
          const parts = folder.split('/');
          let acc = '';
          parts.forEach(part => {
            acc = acc ? `${acc}/${part}` : part;
            folders.add(acc);
          });
        } else {
          folders.add('');
        }
      });
      return Array.from(folders).sort();
    };

    const createFolderRow = (entry, idx) => {
      const row = folderListDiv.createDiv();
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.marginBottom = '8px';

      const chk = row.createEl('input', { type: 'checkbox' });
      chk.checked = !!entry.excluded;
      chk.style.marginRight = '8px';
      chk.onchange = async () => {
        this.plugin.settings.excludedFolders[idx].excluded = chk.checked;
        await this.debouncedSaveSettings();
      };

      const textInput = row.createEl('input', { type: 'text', value: entry.path });
      textInput.style.flex = '1';
      textInput.style.padding = '6px';
      textInput.style.borderRadius = '4px';
      textInput.style.border = '1px solid var(--background-modifier-border)';
      textInput.style.marginRight = '8px';
      // Show folder picker on focus
      textInput.addEventListener('focus', () => {
        // remove existing dropdown
        if (textInput._actDropdown) {
          textInput._actDropdown.remove();
          textInput._actDropdown = null;
        }

        const suggestions = populateFolderSuggestions();
  // build dropdown
        const dd = document.createElement('div');
        dd.className = 'act-folder-dropdown';
        Object.assign(dd.style, {
          position: 'absolute',
          zIndex: 2000,
          background: 'var(--background-primary)',
          color: 'var(--text-normal)',
          border: '1px solid var(--background-modifier-border)',
          borderRadius: '6px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
          maxHeight: '240px',
          overflowY: 'auto',
          padding: '6px 0',
          minWidth: Math.max(240, textInput.offsetWidth) + 'px'
        });

        const buildItem = (folder) => {
          const item = document.createElement('div');
          item.className = 'act-folder-item';
          item.textContent = folder === '' ? '/' : folder;
          Object.assign(item.style, {
            padding: '8px 12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          });
          item.onmouseenter = () => item.style.background = 'var(--background-secondary)';
          item.onmouseleave = () => item.style.background = 'transparent';
          item.onclick = async (e) => {
            e.stopPropagation();
            textInput.value = folder;
            // trigger change handler
            const ev = new Event('change', { bubbles: true });
            textInput.dispatchEvent(ev);
            dd.remove();
            textInput._actDropdown = null;
          };
          return item;
        };

        suggestions.forEach(s => dd.appendChild(buildItem(s)));

        // position dropdown
        document.body.appendChild(dd);
        const rect = textInput.getBoundingClientRect();
        dd.style.left = (rect.left + window.scrollX) + 'px';
        dd.style.top = (rect.bottom + window.scrollY + 6) + 'px';

        // store reference
        textInput._actDropdown = dd;

        // close on outside click
        const onDocClick = (ev) => {
          if (ev.target === textInput) return;
          if (!dd.contains(ev.target)) {
            dd.remove();
            textInput._actDropdown = null;
            document.removeEventListener('click', onDocClick);
          }
        };
        setTimeout(() => document.addEventListener('click', onDocClick));
      });
      textInput.addEventListener('change', async () => {
        const newPath = textInput.value.trim();
        if (!newPath) {
          // remove if empty
          this.plugin.settings.excludedFolders.splice(idx, 1);
        } else {
          this.plugin.settings.excludedFolders[idx].path = newPath.replace(/\\\\/g, '/');
        }
        await this.debouncedSaveSettings();
        this.display();
      });

      // Folder color style dropdown
      const styleSelect = row.createEl('select');
      styleSelect.style.marginRight = '8px';
      styleSelect.style.height = '30px';
      styleSelect.innerHTML = `<option value="">(use global)</option><option value="text">Text color</option><option value="background">Background highlight</option>`;
      styleSelect.value = entry.defaultStyle || '';
      styleSelect.addEventListener('change', async () => {
        this.plugin.settings.excludedFolders[idx].defaultStyle = styleSelect.value || null;
        await this.debouncedSaveSettings();
        this.display();
      });

      const del = row.createEl('button', { text: '✕' });
      del.addClass('mod-warning');
      del.style.marginLeft = '8px';
      del.style.padding = '4px 8px';
      del.style.borderRadius = '4px';
      del.style.cursor = 'pointer';
      del.addEventListener('click', async () => {
        this.plugin.settings.excludedFolders.splice(idx, 1);
        await this.plugin.saveSettings();
        this.display();
      });
    };

    // Render existing rows
    if (this.plugin.settings.excludedFolders.length > 0) {
      this.plugin.settings.excludedFolders.forEach((entry, i) => {
        createFolderRow(entry, i);
      });
    } else {
      const p = folderListDiv.createEl('p', { text: 'No folder exclusions configured.' });
      p.style.marginBottom = '8px';
    }

    // [ Add Excluded folder ] button
    new Setting(containerEl)
      .addButton(b => b.setButtonText('+ Add excluded folder').onClick(async () => {
        this.plugin.settings.excludedFolders.push({ path: '', excluded: true, defaultColor: null, defaultStyle: null });
        await this.plugin.saveSettings();
        this.display();
      }));


    // --- Toggle visibility ---
    new Setting(containerEl)
      .setName('Toggle visibility')
      .setHeading();
    containerEl.createEl('p', { text: 'These options control where you can turn the coloring feature on or off.' });

    new Setting(containerEl)
      .setName('Disable toggle on status bar')
      .addToggle(t => t
        .setValue(this.plugin.settings.disableToggleModes.statusBar)
        .onChange(async v => {
          this.plugin.settings.disableToggleModes.statusBar = v;
          await this.plugin.saveSettings();
          location.reload();
        }));

    new Setting(containerEl)
      .setName('Disable toggle in command')
      .addToggle(t => t
        .setValue(this.plugin.settings.disableToggleModes.command)
        .onChange(async v => {
          this.plugin.settings.disableToggleModes.command = v;
          await this.plugin.saveSettings();
          location.reload();
        }));

    // --- Regex support (global toggle) ---
    new Setting(containerEl)
      .setName('Enable regex support')
      .setDesc('Allow patterns to be regular expressions. Invalid regexes are ignored for safety.')
      .addToggle(t => t.setValue(this.plugin.settings.enableRegexSupport).onChange(async v => {
        this.plugin.settings.enableRegexSupport = v;
        await this.plugin.saveSettings();
        this.display();
      }));
  }
}

// --- Color Picker Modal Class ---
class ColorPickerModal extends Modal {
  constructor(app, plugin, callback) {
    super(app);
    this.plugin = plugin;
    this.callback = callback;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    this.modalEl.style.maxWidth = '360px'; // Pick Color Modal Width
    this.modalEl.style.width = '100%';
    this.modalEl.style.margin = '0 auto';
    this.modalEl.style.padding = '0';

    contentEl.style.padding = '32px 28px 24px 28px';
    contentEl.style.boxSizing = 'border-box';

    const h2 = contentEl.createEl('h2', { text: 'Pick Color' });
    h2.style.marginTop = '-15px'; // oulta remove top margin of H2!!!
    h2.style.marginBottom = '18px';

    const inputDiv = contentEl.createDiv();
    inputDiv.style.display = 'flex';
    inputDiv.style.gap = '8px';
    inputDiv.style.marginBottom = '15px';

    const picker = inputDiv.createEl('input', { type: 'color' });
    picker.value = '#000000';
    picker.style.width = '80px'; // Colour Picker Box Width (pill)
    picker.style.height = '30px';
    picker.style.border = 'none';
    picker.style.borderRadius = '0px';
    picker.style.cursor = 'pointer';

    const hexInput = inputDiv.createEl('input', { type: 'text' });
    hexInput.value = picker.value;
    hexInput.placeholder = '#RRGGBB';
    hexInput.style.flex = '1';
    hexInput.style.padding = '8px';
    hexInput.style.borderRadius = '5px';
    hexInput.style.border = '1px solid var(--background-modifier-border)';
    hexInput.style.width = '100px'; // Hex Box Input Width
    hexInput.textalign = 'center';

    picker.onchange = () => {
      hexInput.value = picker.value;
      this.callback(picker.value);
      this.plugin.forceRefreshAllEditors();
      this.close();
    };

    hexInput.onchange = () => {
      let v = hexInput.value.trim();
      if (!v.startsWith('#')) v = '#' + v;
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v)) {
        picker.value = v;
        this.callback(v);
        this.plugin.forceRefreshAllEditors();
        this.close();
      } else {
        new Notice('Invalid hex color format. Please use #RRGGBB or #RGB.');
      }
    };

    const defaultSwatches = [
      '#eb3b5a', '#fa8231', '#e5a216', '#20bf6b',
      '#0fb9b1', '#2d98da', '#3867d6',
      '#5454d0', 
      '#8854d0', // OG
      '#b554d0', 
      '#e832c1', '#e83289', '#965b3b', '#8392a4'
    ];

    const swatches = this.plugin.settings.customSwatchesEnabled
      ? (this.plugin.settings.replaceDefaultSwatches
        ? this.plugin.settings.customSwatches
        : this.plugin.settings.customSwatches.concat(defaultSwatches)
      )
      : defaultSwatches;

    const swDiv = contentEl.createDiv();
    swDiv.style.display = 'grid';
    swDiv.style.gridTemplateColumns = 'repeat(auto-fill, minmax(35px, 1fr))';
    swDiv.style.gap = '8px';
    swDiv.style.maxWidth = '300px';
    swDiv.style.margin = '0 auto';

    swatches.forEach(c => {
      const btn = swDiv.createEl('button');
      btn.style.cssText = `
        background-color:${c};
        width:35px;
        height:35px;
        border:1px solid var(--background-modifier-border);
        border-radius:5px;
        cursor:pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.1s ease-in-out;
      `;
      btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
      btn.onmouseout = () => btn.style.transform = 'scale(1)';
      btn.onclick = () => {
        this.callback(c);
        this.close();
      };
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

// --- Confirmation Modal Class (for delete all words) ---
class ConfirmationModal extends Modal {
  constructor(app, title, message, onConfirm) {
    super(app);
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    const h2 = contentEl.createEl('h2', { text: this.title });
    h2.style.marginTop = '0'; // Remove top margin
    contentEl.createEl('p', { text: this.message });

    const buttonDiv = contentEl.createDiv();
    buttonDiv.style.display = 'flex';
    buttonDiv.style.justifyContent = 'flex-end';
    buttonDiv.style.marginTop = '20px';
    buttonDiv.style.gap = '10px';

    const cancelButton = buttonDiv.createEl('button', { text: 'Cancel' });
    cancelButton.onclick = () => this.close();

    const confirmButton = buttonDiv.createEl('button', { text: 'Confirm' });
    confirmButton.addClass('mod-warning');
    confirmButton.onclick = () => {
      this.onConfirm();
      this.close();
    };
  }

  onClose() {
    this.contentEl.empty();
  }
}
