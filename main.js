const {
  Plugin,
  PluginSettingTab,
  Setting,
  Modal,
  MarkdownView,
  Notice,
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
        // Remove always text color:
        if (this.settings.wordColors.hasOwnProperty(selectedText)) {
          menu.addItem(item => {
            item.setTitle("Remove always text color")
              .setIcon('eraser')
              .onClick(async () => {
                delete this.settings.wordColors[selectedText];
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
        if (this.settings.disabledFiles.includes(ctx.sourcePath)) return;
        this.applyHighlights(el);
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
      wordColors: {},
      caseSensitive: false,
      enabled: false,
      highlightStyle: 'text',
      backgroundOpacity: 35, // percent
      highlightBorderRadius: 4, // px
      highlightHorizontalPadding: 4, // px
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
    }, await this.loadData() || {});
  }

  // --- Save settings and refresh plugin state ---
  async saveSettings() {
    await this.saveData(this.settings);

    this.disablePluginFeatures();
    if (this.settings.enabled) {
      this.enablePluginFeatures();
    }
    this.updateStatusBar();
  }

  // --- Save a persistent color for a word ---
  async saveEntry(word, color) {
    this.settings.wordColors[word] = color;
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
    const numWords = Object.keys(this.settings.wordColors).length;
    if (numWords > 200) {
      console.warn(`Always Color Text: You have ${numWords} colored words! That's a lot. Your app might slow down a bit.`);
    }
    return Object.entries(this.settings.wordColors)
      .filter(([word]) => !this.settings.blacklistWords.includes(word))
      .sort((a, b) => b[0].length - a[0].length);
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

  // --- Apply Highlights in Reading View (Markdown Post Processor) ---
  applyHighlights(el) {
    const entries = this.getSortedWordEntries();
    if (entries.length === 0) return;
    if (el.offsetParent === null) return;
    this._wrapMatchesRecursive(el, entries);
  }

  // Efficient, non-recursive, DOM walker for reading mode
  _wrapMatchesRecursive(element, entries) {
    const blockTags = ['P', 'LI', 'DIV', 'SPAN', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const queue = [];
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.ELEMENT_NODE && !['CODE', 'PRE'].includes(node.nodeName)) {
        if (blockTags.includes(node.nodeName)) queue.push(node);
        queue.push(...Array.from(node.querySelectorAll(blockTags.map(t => t.toLowerCase()).join(','))));
      }
    }
    if (element.nodeType === Node.ELEMENT_NODE && blockTags.includes(element.nodeName)) queue.unshift(element);

    for (const block of queue) {
      let processed = 0;
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

        for (const [word, color] of entries) {
          const flags = this.settings.caseSensitive ? 'g' : 'gi';
          let pattern;
          // --- if word contains any letter or digit, match as-is (no word boundary), else treat as symbol ---
          if (/^[^a-zA-Z0-9]+$/.test(word)) {
            // pure symbol: match as symbol
            pattern = this.escapeRegex(word);
          } else {
            // word with any letter/digit (even if it contains symbols): match as-is, no word boundary
            pattern = this.escapeRegex(word);
          }
          const regex = new RegExp(pattern, flags);
          let match;
          while ((match = regex.exec(text))) {
            const matchedText = match[0];
            // Only block if the whole match is blacklisted, not if it contains a blacklisted word as substring
            if (this.settings.caseSensitive) {
              if (this.settings.blacklistWords.includes(matchedText)) continue;
            } else {
              if (this.settings.blacklistWords.map(w => w.toLowerCase()).includes(matchedText.toLowerCase())) continue;
            }
            matches.push({ start: match.index, end: match.index + matchedText.length, color, word: matchedText });
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
            for (const [colored, color] of entries) {
              if (/^[^a-zA-Z0-9]+$/.test(colored)) continue;
              // Skip if the colored word itself is blacklisted
              if (isBlacklisted(colored)) continue;
              // Check if colored word is a substring of w (case-insensitive if needed)
              let found = false;
              if (this.settings.caseSensitive) {
                if (w.includes(colored)) found = true;
              } else {
                if (w.toLowerCase().includes(colored.toLowerCase())) found = true;
              }
              if (found) {
                // Remove any existing matches that overlap this word
                matches = matches.filter(m => m.end <= start || m.start >= end);
                matches.push({
                  start: start,
                  end: end,
                  color,
                  word: w
                });
                break; // Only color once per word
              }
            }
          }
        }

        // --- Symbol-Word Coloring ---
        // Always do normal symbol coloring (individual symbols)
        for (const [word, color] of entries) {
          if (/^[^a-zA-Z0-9]+$/.test(word)) {
            const flags = this.settings.caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(this.escapeRegex(word), flags);
            let match;
            while ((match = regex.exec(text))) {
              matches.push({ start: match.index, end: match.index + match[0].length, color, word });
            }
          }
        }

        // If enabled, also color the whole word if it contains a colored symbol
        if (this.settings.symbolWordColoring) {
          const symbolEntries = entries.filter(([word]) => /^[^a-zA-Z0-9]+$/.test(word));
          if (symbolEntries.length > 0) {
            const wordRegex = /\b\w+[^\s]*\b/g;
            let match;
            while ((match = wordRegex.exec(text))) {
              const w = match[0];
              const start = match.index;
              const end = start + w.length;
              if (isBlacklisted(w)) continue;
              for (const [symbol, color] of symbolEntries) {
                const flags = this.settings.caseSensitive ? '' : 'i';
                const regex = new RegExp(this.escapeRegex(symbol), flags);
                if (regex.test(w)) {
                  matches.push({ start, end, color, word: w });
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
          if (processed > 10) break;
          const frag = document.createDocumentFragment();
          let pos = 0;
          for (const m of nonOverlapping) {
            if (m.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
            const span = document.createElement('span');
            span.className = 'always-color-text-highlight';
            span.textContent = text.slice(m.start, m.end);
            if (this.settings.highlightStyle === 'text') span.style.color = m.color;
            else {
              // background style
              span.style.backgroundColor = this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25);
              span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + 'px';
              span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + 'px';
            }
            frag.appendChild(span);
            pos = m.end;
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
        if (to - from > 10000) return builder.finish();
        const text = view.state.doc.sliceString(from, to);
        const activeFile = plugin.app.workspace.getActiveFile();
        if (!plugin.settings.enabled ||
            (activeFile && plugin.settings.disabledFiles.includes(activeFile.path)) ||
            (view.file && activeFile && view.file.path !== activeFile.path)) {
          return builder.finish();
        }
        const entries = plugin.getSortedWordEntries();
        if (entries.length === 0) return builder.finish();
        let matches = [];

        for (const [word, color] of entries) {
          const flags = plugin.settings.caseSensitive ? 'g' : 'gi';
          let pattern;
          // --- CHANGED LOGIC: if word contains any letter or digit, match as-is (no word boundary), else treat as symbol ---
          if (/^[^a-zA-Z0-9]+$/.test(word)) {
            // pure symbol: match as symbol
            pattern = plugin.escapeRegex(word);
          } else {
            // word with any letter/digit (even if it contains symbols): match as-is, no word boundary
            pattern = plugin.escapeRegex(word);
          }
          const regex = new RegExp(pattern, flags);
          let match;
          while ((match = regex.exec(text))) {
            const matchedText = match[0];
            // Only block if the whole match is blacklisted, not if it contains a blacklisted word as substring
            if (plugin.settings.caseSensitive) {
              if (plugin.settings.blacklistWords.includes(matchedText)) continue;
            } else {
              if (plugin.settings.blacklistWords.map(w => w.toLowerCase()).includes(matchedText.toLowerCase())) continue;
            }
            matches.push({ start: from + match.index, end: from + match.index + matchedText.length, color });
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
            for (const [colored, color] of entries) {
              if (/^[^a-zA-Z0-9]+$/.test(colored)) {
                const flags = plugin.settings.caseSensitive ? 'g' : 'gi';
                const regex = new RegExp(plugin.escapeRegex(colored), flags);
                let match;
                while ((match = regex.exec(w))) {
                  matches.push({ start: pos + match.index, end: pos + match.index + match[0].length, color });
                }
              }
            }
            // Whole word coloring
            if (/\w/.test(w) && !plugin.settings.blacklistWords.includes(w)) {
              for (const [colored, color] of entries) {
                if (/^[^a-zA-Z0-9]+$/.test(colored)) continue;
                const flags = plugin.settings.caseSensitive ? '' : 'i';
                const regex = new RegExp(plugin.escapeRegex(colored), flags);
                if (regex.test(w)) {
                  matches.push({ start: pos, end: pos + w.length, color });
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
          const symbolEntries = entries.filter(([word]) => /^[^a-zA-Z0-9]+$/.test(word));
          if (symbolEntries.length > 0) {
            const wordRegex = /\b\w+[^\s]*\b/g;
            let match;
            while ((match = wordRegex.exec(text))) {
              const w = match[0];
              const start = from + match.index;
              const end = start + w.length;
              if (plugin.settings.blacklistWords.includes(w)) continue;
              for (const [symbol, color] of symbolEntries) {
                const flags = plugin.settings.caseSensitive ? '' : 'i';
                const regex = new RegExp(plugin.escapeRegex(symbol), flags);
                if (regex.test(w)) {
                  matches.push({ start, end, color });
                  break; // Only color once per word
                }
              }
            }
          }
        } else {
          // Default: color symbols individually
          for (const [word, color] of entries) {
            if (/^[^a-zA-Z0-9]+$/.test(word)) {
              const flags = plugin.settings.caseSensitive ? 'g' : 'gi';
              const regex = new RegExp(plugin.escapeRegex(word), flags);
              let match;
              while ((match = regex.exec(text))) {
                matches.push({ start: from + match.index, end: from + match.index + match[0].length, color });
              }
            }
          }
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
        for (const m of nonOverlapping) {
          const style = plugin.settings.highlightStyle === 'text'
            ? `color: ${m.color} !important;`
            : `background-color: ${plugin.hexToRgba(m.color, plugin.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(plugin.settings.highlightBorderRadius ?? 8)}px !important; padding-left: ${(plugin.settings.highlightHorizontalPadding ?? 4)}px !important; padding-right: ${(plugin.settings.highlightHorizontalPadding ?? 4)}px !important;`;
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
      .setDesc('If this is on, "word" and "Word" are totally different. If it\'s off, they\'re the same.')
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
    }
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

    // --- Defined colored words ---
    new Setting(containerEl)
      .setName('Defined colored words')
      .setHeading();
    containerEl.createEl('p', { text: 'Here\'s where you manage your words and their colors. Changes here update your notes instantly!' });

    const listDiv = containerEl.createDiv();
    listDiv.addClass('color-words-list');

    Object.entries(this.plugin.settings.wordColors).forEach(([word, color]) => {
      const row = listDiv.createDiv();
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
          const existingColor = this.plugin.settings.wordColors[word];
          delete this.plugin.settings.wordColors[word];
          this.plugin.settings.wordColors[newWord] = existingColor;
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.display();
        } else if (!newWord) {
          delete this.plugin.settings.wordColors[word];
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.display();
        }
      });

      const cp = row.createEl('input', { type: 'color' });
      cp.value = color;
      cp.style.width = '30px';
      cp.style.height = '30px';
      cp.style.border = 'none';
      cp.style.borderRadius = '4px';
      cp.style.cursor = 'pointer';
      cp.addEventListener('input', async () => {
        this.plugin.settings.wordColors[word] = cp.value;
        await this.debouncedSaveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      });

      const del = row.createEl('button', { text: '✕' });
      del.addClass('mod-warning');
      del.style.marginLeft = '8px';
      del.style.padding = '4px 8px';
      del.style.borderRadius = '4px';
      del.style.cursor = 'pointer';
      del.addEventListener('click', async () => {
        delete this.plugin.settings.wordColors[word];
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.display();
      });
    });

    new Setting(containerEl)
      .addButton(b => b.setButtonText('Add new word').onClick(async () => {
        this.plugin.settings.wordColors[`New word ${Object.keys(this.plugin.settings.wordColors).length + 1}`] = '#000000';
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.display();
      }));

    new Setting(containerEl)
      .addExtraButton(b => b
        .setIcon('trash')
        .setTooltip('Delete all defined words')
        .onClick(async () => {
          new ConfirmationModal(this.app, 'Delete all words', 'Are you sure you want to delete all your colored words? You can\'t undo this!', async () => {
            this.plugin.settings.wordColors = {};
            await this.plugin.saveSettings();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            this.display();
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
