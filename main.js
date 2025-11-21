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

// Performance tuning constants for editor decoration
const EDITOR_PERFORMANCE_CONSTANTS = {
  MAX_PATTERNS_STANDARD: 30,      // Use standard processing for <= 30 patterns
  MAX_TEXT_LENGTH_STANDARD: 10000, // Use standard processing for <= 10k chars
  PATTERN_CHUNK_SIZE: 20,         // Process 20 patterns per chunk  
  TEXT_CHUNK_SIZE: 5000,          // Process 5k chars per chunk
  MAX_MATCHES_PER_PATTERN: 100,   // Max matches per pattern in chunks
  MAX_TOTAL_MATCHES: 3000         // Absolute limit for decorations
};

// Development mode flag - set to false for production
const IS_DEVELOPMENT = false;

// Helper function for conditional debug logging
const debugLog = (tag, ...args) => {
  if (IS_DEVELOPMENT) {
    console.log(`[${tag}]`, ...args);
  }
};

const debugError = (tag, ...args) => {
  if (IS_DEVELOPMENT) {
    console.error(`[${tag}]`, ...args);
  }
};

const debugWarn = (tag, ...args) => {
  if (IS_DEVELOPMENT) {
    console.warn(`[${tag}]`, ...args);
  }
};

module.exports = class AlwaysColorText extends Plugin {
  constructor(...args) {
    super(...args);
    // Global perf monitor to quickly gate heavy operations without capturing `this`
    (function(){
      let lastOperationTime = 0;
      let operationCount = 0;
      const isOverloaded = () => {
        try {
          const now = Date.now();
          if (now - lastOperationTime < 50) { // < 50ms ~= 20fps (more lenient)
            operationCount++;
            if (operationCount > 5) return true; // allow a few operations before throttling
          } else {
            operationCount = 0;
          }
          lastOperationTime = now;
        } catch (e) {
          return false;
        }
        return false;
      };
      this.performanceMonitor = { isOverloaded };
    }).call(this);
    
    // SIMPLIFIED: Keep only essential tracking to reduce memory
    this._perfCounters = {
      totalRegexExecs: 0,
      avoidedRegexExecs: 0,
    };
    
    // Helper to report or retrieve counters
    this.getPerfCounters = () => Object.assign({}, this._perfCounters);
    
    // Simple cache for sorted entries
    this._cachedSortedEntries = null;
    this._cacheDirty = true;
    
    // WeakMaps to track temporary DOM-related metadata without retaining nodes
    try {
      this._domRefs = new WeakMap();
    } catch (e) {
      this._domRefs = new WeakMap();
    }
    
    try {
      this._viewportObservers = new Map(); // Use Map for storing observers
    } catch (e) {
      this._viewportObservers = new Map();
    }
    
    // Throttle perf-gate warnings (timestamp ms)
    this._lastPerfWarning = 0;
  }

  async onload() {
    await this.loadSettings();
    this.settingTab = new ColorSettingTab(this.app, this);
    this.addSettingTab(this.settingTab);

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
              const index = this.settings.disabledFiles.indexOf(file.path);
              if (index > -1) {
                this.settings.disabledFiles.splice(index, 1);
              }
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
        if (this.settings.enableAlwaysColor) {
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
        }
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
        // Helper function to compare patterns with case-sensitivity setting
        const patternMatches = (pattern, text) => {
          if (this.settings.caseSensitive) {
            return pattern === text;
          } else {
            return pattern.toLowerCase() === text.toLowerCase();
          }
        };
        
        const hasLiteralEntry = this.settings.wordEntries.some(e => e && patternMatches(e.pattern, selectedText) && !e.isRegex);
        const hasGroupedEntry = this.settings.wordEntries.some(e => e && !e.isRegex && Array.isArray(e.groupedPatterns) && e.groupedPatterns.some(p => patternMatches(p, selectedText)));
        if (hasLiteralEntry || hasGroupedEntry) {
          menu.addItem(item => {
            item.setTitle("Remove always text color")
              .setIcon('eraser')
              .onClick(async () => {
                // If it's a grouped pattern, remove only that pattern from the group
                if (hasGroupedEntry) {
                  const entryWithGroup = this.settings.wordEntries.find(e => e && !e.isRegex && Array.isArray(e.groupedPatterns) && e.groupedPatterns.some(p => patternMatches(p, selectedText)));
                  if (entryWithGroup) {
                    const idx = this.settings.wordEntries.indexOf(entryWithGroup);
                    if (idx !== -1) {
                      // Remove the selected text from groupedPatterns (case-insensitive comparison)
                      entryWithGroup.groupedPatterns = entryWithGroup.groupedPatterns.filter(p => !patternMatches(p, selectedText));
                      // If only one pattern remains, move it to pattern and clear groupedPatterns
                      if (entryWithGroup.groupedPatterns.length === 1) {
                        entryWithGroup.pattern = entryWithGroup.groupedPatterns[0];
                        entryWithGroup.groupedPatterns = null;
                      } else if (entryWithGroup.groupedPatterns.length === 0) {
                        // If no patterns left, remove the entire entry
                        this.settings.wordEntries.splice(idx, 1);
                      }
                    }
                  }
                } else {
                  // Remove the entire entry if it's a literal pattern
                  this.settings.wordEntries = this.settings.wordEntries.filter(e => !(e && patternMatches(e.pattern, selectedText) && !e.isRegex));
                }
                await this.saveSettings();
                this.refreshEditor(view, true);
                new Notice(`Removed always color for \"${selectedText}\".`);
                // Refresh settings UI if the settings tab is open - force full re-render
                if (this.settingTab) {
                  this.settingTab._initializedSettingsUI = false;
                  this.settingTab.display();
                }
              });
          });
        }
        // Text & Background Coloring:
        if (this.settings.enableTextBgMenu) {
          menu.addItem(item => {
            item.setTitle("Text & Background Color")
              .setIcon('paint-bucket')
              .onClick(() => {
                // Warn if blacklisted
                if (this.settings.blacklistWords.includes(selectedText)) {
                  new Notice(`"${selectedText}" is blacklisted and cannot be colored.`);
                  return;
                }
                // Open settings window
                this.app.setting.open();
                // Wait for settings to open, then navigate to our tab and focus the entry
                setTimeout(() => {
                  try {
                    // Find and click on our plugin's settings tab
                    const settingsTabs = document.querySelectorAll('.vertical-tab-nav-item');
                    for (const tab of settingsTabs) {
                      if (tab.textContent && tab.textContent.includes('Always Color Text')) {
                        tab.click();
                        break;
                      }
                    }
                    // Now focus the text & background entry
                    setTimeout(() => {
                      if (this.settingTab) {
                        try {
                          this.settingTab.focusTextBgEntry(selectedText);
                        } catch (e) {
                          debugError('MENU', 'Failed to focus text bg entry', e);
                        }
                      }
                    }, 200);
                  } catch (e) {
                    debugError('MENU', 'Failed to open settings tab', e);
                  }
                }, 100);
              });
          });
        }
        // Remove Text & Background Color
        const hasTextBgEntry = this.settings.textBgColoringEntries.some(e => 
          e && (patternMatches(e.pattern, selectedText) || (Array.isArray(e.groupedPatterns) && e.groupedPatterns.some(p => patternMatches(p, selectedText))))
        );
        if (hasTextBgEntry) {
          menu.addItem(item => {
            item.setTitle("Remove Text & Background Color")
              .setIcon('eraser')
              .onClick(async () => {
                // If it's a grouped pattern, remove only that pattern from the group
                const entryWithGroup = this.settings.textBgColoringEntries.find(e => 
                  e && Array.isArray(e.groupedPatterns) && e.groupedPatterns.some(p => patternMatches(p, selectedText))
                );
                if (entryWithGroup) {
                  const idx = this.settings.textBgColoringEntries.indexOf(entryWithGroup);
                  if (idx !== -1) {
                    // Remove the selected text from groupedPatterns (case-insensitive comparison)
                    entryWithGroup.groupedPatterns = entryWithGroup.groupedPatterns.filter(p => !patternMatches(p, selectedText));
                    // If only one pattern remains, move it to pattern and clear groupedPatterns
                    if (entryWithGroup.groupedPatterns.length === 1) {
                      entryWithGroup.pattern = entryWithGroup.groupedPatterns[0];
                      entryWithGroup.groupedPatterns = null;
                    } else if (entryWithGroup.groupedPatterns.length === 0) {
                      // If no patterns left, remove the entire entry
                      this.settings.textBgColoringEntries.splice(idx, 1);
                    }
                  }
                } else {
                  // Remove the entire entry if it's a direct pattern match (case-insensitive comparison)
                  this.settings.textBgColoringEntries = this.settings.textBgColoringEntries.filter(e => !(e && patternMatches(e.pattern, selectedText)));
                }
                await this.saveSettings();
                this.refreshEditor(view, true);
                new Notice(`Removed Text & Background Color for \"${selectedText}\".`);
                // Refresh settings UI if the settings tab is open - force full re-render
                if (this.settingTab) {
                  try {
                    this.settingTab._initializedSettingsUI = false;
                    this.settingTab.display();
                  } catch (e) {
                    debugError('MENU', 'Failed to refresh settings', e);
                  }
                }
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
                  // Refresh blacklist section in settings if open
                  if (this.settingTab && this.settingTab._refreshBlacklistWords) {
                    this.settingTab._refreshBlacklistWords();
                  }
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
  name: 'Color Selected Text',
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

      // --- Enable/Disable coloring for current document ---
      this.addCommand({
        id: 'toggle-coloring-for-current-document',
  name: 'Enable/Disable coloring for current document',
        callback: async () => {
          const md = this.app.workspace.getActiveFile();
          if (!md) {
            new Notice('No active file to toggle coloring for.');
            return;
          }
          
          if (this.settings.disabledFiles.includes(md.path)) {
            // Re-enable coloring for this file
            const index = this.settings.disabledFiles.indexOf(md.path);
            if (index > -1) {
              this.settings.disabledFiles.splice(index, 1);
            }
            await this.saveSettings();
            new Notice(`Coloring enabled for ${md.path}`);
          } else {
            // Disable coloring for this file
            this.settings.disabledFiles.push(md.path);
            await this.saveSettings();
            new Notice(`Coloring disabled for ${md.path}`);
          }
        }
      });

      // --- Enable/Disable Always Color Text globally ---
      this.addCommand({
        id: 'toggle-always-color-text',
  name: 'Enable/Disable Always Color Text',
        callback: async () => {
          this.settings.enabled = !this.settings.enabled;
          await this.saveSettings();
          new Notice(this.settings.enabled ? 'Always Color Text Enabled' : 'Always Color Text Disabled');
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
    if (!pattern || typeof pattern !== 'string') return true;
    
    // ALLOW NON-ROMAN CHARACTERS - Add this at the beginning
    if (this.containsNonRomanCharacters(pattern)) {
      return false; // Never block non-Roman patterns
    }
    
    // Whitelist of known safe patterns that are allowed despite complexity metrics
    const safePatterns = [
      '\\b\\d+(?:\\.\\d+)?(?:kg|cm|m|km|°C|°F|lbs)\\b',  // Measurements (kg, cm, m, km, °C, °F, lbs)
    ];
    
    // Check if pattern matches a safe pattern exactly
    if (safePatterns.includes(pattern)) return false;
    
    // Hard block known dangerous patterns
    const dangerousPatterns = [
      /\(\?[=!<]/,                // Lookarounds
      /\(\?[<][=!]/,              // Lookbehinds
      /\*\+|\+\*/,                // Adjacent quantifiers
      /\(\w+\)[*+][*+]/,          // Nested quantifiers
      /\{[^}]*\{[^}]*\}/,         // Nested quantifier ranges
      /\[[^\]]*\[[^\]]*\]/,       // Nested character classes
    ];
    
    if (dangerousPatterns.some(p => p.test(pattern))) return true;
    
    // Length limits
    if (pattern.length > 100) return true;
    
    // Count dangerous constructs
    const alternations = (pattern.match(/\|/g) || []).length;
    const quantifiers = (pattern.match(/[*+?{]/g) || []).length;
    const groups = (pattern.match(/\([^?]/g) || []).length;
    
    if (alternations > 5 || quantifiers > 10 || groups > 5) return true;
    
    // Test compilation with timeout
    try {
      const start = Date.now();
      new RegExp(pattern);
      if (Date.now() - start > 10) return true; // 10ms max compilation time
    } catch (e) {
      return true;
    }
    
    return false;
  }

  // NEW METHOD: Decode HTML entities for reading mode compatibility
  decodeHtmlEntities(text) {
    if (!text || typeof text !== 'string') return text;
    
    const entities = {
      '&amp;': '&',
      '&lt;': '<', 
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x22;': '"',
      '&#x3C;': '<',
      '&#x3E;': '>',
      '&#x26;': '&',
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
      '&hellip;': '…',
      '&mdash;': '—',
      '&ndash;': '–',
      '&bull;': '•',
      '&check;': '✓',
      '&checkmark;': '✓',
      '&#10003;': '✓',
      '&#x2713;': '✓',
      '&#10004;': '✔',
      '&#x2714;': '✔',
      '&rarr;': '→',
      '&rightarrow;': '→',
      '&#8594;': '→',
      '&#x2192;': '→',
      '&larr;': '←',
      '&leftarrow;': '←',
      '&#8592;': '←',
      '&#x2190;': '←',
      '&uarr;': '↑',
      '&uparrow;': '↑',
      '&#8593;': '↑',
      '&#x2191;': '↑',
      '&darr;': '↓',
      '&downarrow;': '↓',
      '&#8595;': '↓',
      '&#x2193;': '↓'
    };
    
    return text.replace(/&[#a-zA-Z0-9]+;/g, match => {
      return entities[match] || match;
    });
  }

  // NEW HELPER METHOD: Detect non-Roman characters
  containsNonRomanCharacters(text) {
    if (!text) return false;
    // Match any character outside basic Latin, numbers, and common punctuation
    return /[^\u0000-\u007F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/.test(text);
  }

  // NEW HELPER: Count non-Roman characters
  countNonRomanCharacters(text) {
    if (!text) return 0;
    const nonRomanMatches = text.match(/[^\u0000-\u007F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/g);
    return nonRomanMatches ? nonRomanMatches.length : 0;
  }

  // NEW HELPER: Get the ratio of non-Roman characters in text
  getNonRomanCharacterRatio(text) {
    if (!text || typeof text !== 'string') return 0;
    const totalChars = text.length;
    if (totalChars === 0) return 0;
    return this.countNonRomanCharacters(text) / totalChars;
  }

  // NEW METHOD: Detect if pattern is simple (no regex needed)
  isSimplePattern(pattern) {
    if (!pattern || typeof pattern !== 'string') return false;
    
    // Decode HTML entities first to handle reading mode
    const decodedPattern = this.decodeHtmlEntities(pattern);
    
    // Simple patterns: alphanumeric, basic punctuation, common symbols
    // This covers: DO:, (✓), →, etc.
    const isSimple = /^[\w\s\u00A0-\u00FF\u2000-\u206F\u25A0-\u25FF\u2700-\u27BF✓✔→←↑↓+\-=*/.()&;]+$/.test(decodedPattern);
    
    // Log checkmark patterns for debugging
    if (pattern.includes('✓') || decodedPattern.includes('✓')) {
      debugLog('ISIMPLE', { pattern, decodedPattern, isSimple });
    }
    
    return isSimple;
  }

  // NEW METHOD: Ultra-fast simple pattern processing
  processSimplePatternsOptimized(element, simpleEntries, folderEntry = null, options = {}) {
    debugLog('SIMPLE', `Processing ${simpleEntries.length} simple patterns`);
    
    const blockTags = ['P', 'LI', 'DIV', 'SPAN', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const effectiveStyle = (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle;
    
    // Fast DOM collection - avoid TreeWalker overhead
    const blocks = element.querySelectorAll?.(blockTags.join(', ')) || [];
    
    for (const block of blocks) {
      // Skip code blocks and preformatted text
      if (block.closest('code, pre')) continue;
      
      this.processBlockWithSimplePatterns(block, simpleEntries, folderEntry, effectiveStyle);
    }
  }

  // NEW METHOD: Process block with simple string matching
  processBlockWithSimplePatterns(block, simpleEntries, folderEntry, effectiveStyle) {
    const walker = document.createTreeWalker(
      block, 
      NodeFilter.SHOW_TEXT, 
      { 
        acceptNode: function(node) {
          // Skip text nodes in code blocks
          if (node.parentElement?.closest('code, pre')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      let text = node.textContent;
      if (!text) continue;
      
      // DECODE HTML ENTITIES FOR READING MODE COMPATIBILITY
      const originalText = text;
      text = this.decodeHtmlEntities(text);
      
      let matches = [];
      
      // ULTRA-FAST string search for simple patterns
      for (const entry of simpleEntries) {
        let pattern = entry.pattern;
        // ALSO DECODE PATTERN FOR COMPARISON
        pattern = this.decodeHtmlEntities(pattern);
        let pos = 0;
        
        while ((pos = text.indexOf(pattern, pos)) !== -1) {
          matches.push({
            start: pos,
            end: pos + pattern.length,
            color: (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color
          });
          pos += pattern.length;
          
          // Conservative limit for performance
          if (matches.length > 50) break;
        }
        
        if (matches.length > 50) break;
      }
      
      // Apply highlights if we found matches
      if (matches.length > 0) {
        this.applySimpleHighlights(node, matches, text, effectiveStyle);
      }
    }
  }

  // NEW METHOD: Only use complex processing when absolutely necessary
  processComplexPatterns(element, complexEntries, folderEntry, options = {}) {
    // Use existing _wrapMatchesRecursive logic but with performance safeguards
    const blockTags = ['P', 'LI', 'DIV', 'SPAN', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const blocks = element.querySelectorAll?.(blockTags.join(', ')) || [];
    
    // Process in small batches to avoid UI freeze
    const BATCH_SIZE = 10;
    let processed = 0;
    
    for (const block of blocks) {
      if (block.closest('code, pre')) continue;
      
      this.processSingleBlockComplex(block, complexEntries, folderEntry, options);
      processed++;
      
      // Yield to browser every BATCH_SIZE blocks
      if (processed % BATCH_SIZE === 0) {
        setTimeout(() => {
          // Continue processing if needed
        }, 0);
        break; // Process rest in next frame
      }
    }
  }

  // --- When the plugin is UNLOADING, remove all its UI and features ---
  onunload() {
    // Clear any pending timers
    try {
      if (this._refreshTimeout) {
        clearTimeout(this._refreshTimeout);
        this._refreshTimeout = null;
      }
      if (this._editorRefreshTimeout) {
        clearTimeout(this._editorRefreshTimeout);
        this._editorRefreshTimeout = null;
      }
    } catch (e) {}

    // Remove event listeners that may hold onto closures
    try {
      if (this.activeLeafChangeListener) {
        this.app.workspace.off('active-leaf-change', this.activeLeafChangeListener);
        this.activeLeafChangeListener = null;
      }
    } catch (e) {}

    // Clean up DOM references
    try { this.ribbonIcon?.remove(); } catch (e) {}
    try { this.statusBar?.remove(); } catch (e) {}

    // Clear large in-memory structures
    try {
      if (Array.isArray(this._compiledWordEntries) && this._compiledWordEntries.length > 0) {
        const top = this._compiledWordEntries.slice().sort((a, b) => (b.execs || 0) - (a.execs || 0)).slice(0, 5);
        if (IS_DEVELOPMENT) {
          for (const e of top) {
            debugLog('UNLOAD', `pattern: ${e.pattern}, execs: ${e.execs || 0}, avoided: ${e.avoidedExecs || 0}, matches: ${e.matchesFound || 0}`);
          }
        }
      }
    } catch (e) {}
    try {
      // Stop memory monitor and perform a full cleanup to release large refs
      try { this.stopMemoryMonitor(); } catch (e) {}
      try { this.cleanup(); } catch (e) {}
      try { this._compiledWordEntries = []; this._cachedSortedEntries = null; this._cacheDirty = true; } catch (e) {}
    } catch (e) {}
    try {
      if (this.settings && Array.isArray(this.settings.wordEntries)) this.settings.wordEntries.length = 0;
    } catch (e) {}
    // Disable features (unregister processors/listeners) as final step
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

        // Delegate to active-file-only processor which applies file/folder/frontmatter rules
        try {
          this.processActiveFileOnly(el, ctx);
        } catch (e) {
          debugWarn('ACT', 'processActiveFileOnly failed', e);
        }

        // Don't call processActiveFileOnly twice to avoid double-processing
      });
      this.markdownPostProcessorRegistered = true;
    }

    if (!this.activeLeafChangeListenerRegistered) {
      this.activeLeafChangeListener = this.app.workspace.on('active-leaf-change', leaf => {
        if (leaf && leaf.view instanceof MarkdownView) {
          try {
            // Trigger rerender in preview mode or fallback to refresh all reading views
            if (leaf.view.getMode && leaf.view.getMode() === 'preview') {
              try {
                if (leaf.view.previewMode && typeof leaf.view.previewMode.rerender === 'function') {
                  leaf.view.previewMode.rerender(true);
                } else if (typeof leaf.view.rerender === 'function') {
                  leaf.view.rerender();
                } else {
                  // Fallback: refresh all reading views (less ideal but safe)
                  this.forceRefreshAllReadingViews();
                }
              } catch (e) {
                // If the above fails, fallback to global refresh
                this.forceRefreshAllReadingViews();
              }

              // Fallback: try to process the rendered preview root directly
              setTimeout(() => {
                try {
                  const active = this.app.workspace.getActiveViewOfType(MarkdownView);
                  if (active && active.getMode && active.getMode() === 'preview') {
                    // Use previewMode.containerEl as fallback to contentEl/containerEl
                    const root = (active.previewMode && active.previewMode.containerEl) || active.contentEl || active.containerEl;
                    if (root && active.file && active.file.path) {
                      try {
                        this.processActiveFileOnly(root, { sourcePath: active.file.path });
                      } catch (e) {
                        // swallow - best-effort
                      }
                    }
                  }
                } catch (e) {}
              }, 120);
            } else {
              // Editor mode: refresh editor as before
              this.refreshEditor(leaf.view, true);
            }
          } catch (e) {}
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

    // --- Refresh coloring when file is moved/renamed (folder-specific styling changes) ---
    this.registerEvent(
      this.app.vault.on('rename', (file, oldPath) => {
        try {
          // If the active file was moved, refresh it immediately
          const activeFile = this.app.workspace.getActiveFile();
          if (activeFile && activeFile.path === file.path) {
            // File was moved while it was active, force refresh
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
          }
        } catch (e) {
          debugError('RENAME', 'File rename handler failed', e);
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
      enableBoxDecorationBreak: true, // Toggle for rounded corners on text wrapping
      enableBorderThickness: false, // Toggle for border on background highlights
      borderOpacity: 100, // percent (0-100)
      borderThickness: 2, // px (0-5)
      borderStyle: 'full', // 'full', 'top', 'bottom', 'left', 'right', 'top-bottom', 'left-right'
      enableFolderRestrictions: false,
      excludedFolders: [],
      disabledFiles: [],
      customSwatchesEnabled: false,
      replaceDefaultSwatches: false,
      customSwatches: [
        
      ],
      disableToggleModes: {
        statusBar: false,
        command: false,
        ribbon: false
      },
      enableAlwaysHighlight: false,
      enableAlwaysColor: true,
      partialMatch: false,
      blacklistWords: [],
      enableBlacklistMenu: false,
      symbolWordColoring: false,
      // Enable/disable regex support in the settings UI/runtime
      enableRegexSupport: false,
      // Opt-in: force full reading-mode render (WARNING: may freeze UI on large notes)
      forceFullRenderInReading: false,
      // Disable coloring in reading/preview mode (editor remains colored)
      disableReadingModeColoring: false,
      // Text & Background Coloring entries
      textBgColoringEntries: [],
      // Enable/disable Text & Background Coloring option in right-click menu
      enableTextBgMenu: true,
    }, await this.loadData() || {});
  // --- Normalize migrated folder exclusion settings ---
    if (!Array.isArray(this.settings.excludedFolders)) this.settings.excludedFolders = [];
    // Support old format (array of strings) by converting to objects { path, defaultStyle }
    this.settings.excludedFolders = this.settings.excludedFolders.map(f => {
      if (!f) return null;
      if (typeof f === 'string') return { path: f, defaultColor: null, defaultStyle: null };
      if (typeof f === 'object' && f.path) {
        const defaultColor = f.defaultColor || f.color;
        // Sanitize color: if invalid, set to null
        const sanitizedColor = defaultColor && this.isValidHexColor(defaultColor) ? defaultColor : null;
        return {
          path: f.path,
          defaultColor: sanitizedColor,
          defaultStyle: f.defaultStyle || null
        };
      }
      return null;
    }).filter(x => x && x.path && String(x.path).trim() !== '');

    // --- Migrate wordColors -> wordEntries (backwards compatible) ---
    if (!Array.isArray(this.settings.wordEntries) || this.settings.wordEntries.length === 0) {
      // If user already has wordEntries saved, keep them. Otherwise convert old map.
      const obj = this.settings.wordColors || {};
      const arr = [];
      for (const k of Object.keys(obj)) {
        const c = obj[k];
        arr.push({ pattern: String(k), color: String(c), isRegex: false, flags: '', groupedPatterns: null });
      }
      this.settings.wordEntries = arr;
    } else {
      // Ensure shape for existing entries
      this.settings.wordEntries = this.settings.wordEntries.map(e => {
        if (!e) return null;
        if (typeof e === 'string') return { pattern: e, color: '#000000', isRegex: false, flags: '', groupedPatterns: null };
        const color = e.color || e.hex || '#000000';
        // Sanitize color: if invalid, default to black
        const sanitizedColor = this.isValidHexColor(color) ? color : '#000000';
        return {
          pattern: e.pattern || e.word || '',
          color: sanitizedColor,
          isRegex: !!e.isRegex,
          flags: e.flags || '',
          groupedPatterns: e.groupedPatterns || null
        };
      }).filter(x => x && String(x.pattern).trim() !== '');
    }

    // compile word entries into fast runtime structures
    this.compileWordEntries();
    this.compileTextBgColoringEntries();

    // Start memory monitoring to proactively cleanup if heap usage gets high
    try { this.startMemoryMonitor(); } catch (e) {}
  }

  // --- Save settings and refresh plugin state ---
  async saveSettings() {
    await this.saveData(this.settings);
    
    // Recompile entries after saving
    this.compileWordEntries();
    this.compileTextBgColoringEntries();

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
    
    // Use a weak callback pattern: check if plugin is still active before executing
    const callback = () => {
      // Guard: if plugin unloaded, don't execute
      if (!this.app || !this.app.workspace) return;
      
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        this.refreshEditor(activeView, force);
      }
    };
    
    this._refreshTimeout = setTimeout(callback, 100);
  }

  // --- Refresh a Specific Editor ---
  refreshEditor(view, force = false) {
    if (view?.editor?.cm) {
      if (this._editorRefreshTimeout) clearTimeout(this._editorRefreshTimeout);
      
      // Use a weak callback pattern: check if view/editor still valid before executing
      const callback = () => {
        // Guard: if view or editor no longer exists, don't execute
        if (!view?.editor?.cm) return;
        
        try {
          const cm = view.editor.cm;
          cm.dispatch({ changes: [] });
        } catch (e) {
          // Editor may have been disposed or closed
        }
      };
      
      this._editorRefreshTimeout = setTimeout(callback, 100);
    }
  }

  // --- Escape Regex Special Characters ---
  escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // NEW HELPER: Check if a match is a whole word (word boundaries on both sides)
  isWholeWordMatch(text, matchStart, matchEnd) {
    const leftOk = matchStart === 0 || !/\w/.test(text[matchStart - 1]);
    const rightOk = matchEnd === text.length || !/\w/.test(text[matchEnd]);
    return leftOk && rightOk;
  }

    safeRegexTest(regex, text, timeout = 50) {
    // BAIL OUT EARLY FOR NON-ROMAN TEXT
    if (this.containsNonRomanCharacters(text)) {
      try {
        return Promise.resolve(regex.test(text));
      } catch (e) {
        return Promise.resolve(false);
      }
    }
    
    // ... existing timeout logic for Roman scripts
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(false); // Return false if timeout occurs
      }, timeout);
      
      try {
        const result = regex.test(text);
        clearTimeout(timeoutId);
        resolve(result);
      } catch (e) {
        clearTimeout(timeoutId);
        resolve(false);
      }
    });
  }

  // --- Safe Regex Matching Loop with Protection ---
  safeMatchLoop(regex, text) {
    const matches = [];
    let lastIndex = 0;
    let safetyCounter = 0;
    const maxIterations = 1000; // Hard limit on iterations
    
    try {
      while (safetyCounter < maxIterations) {
        const match = regex.exec(text);
        if (!match) break;
        
        matches.push(match);
        if (regex.lastIndex === lastIndex) break; // Avoid infinite loops
        lastIndex = regex.lastIndex;
        safetyCounter++;
      }
    } catch (e) {
      debugWarn('MATCH', 'safeMatchLoop error', e);
    }
    
    return matches;
  }

  // Create a lightweight fastTest function to reject texts that cannot contain the pattern
  createFastTester(pattern, isRegex, caseSensitive) {
    try {
      if (!pattern) return () => true;

      // NON-ROMAN CHARACTERS - SIMPLE HANDLING
      if (this.containsNonRomanCharacters(pattern)) {
        if (caseSensitive) {
          return (text) => typeof text === 'string' && text.includes(pattern);
        } else {
          // For non-Roman, case sensitivity often doesn't apply, but we'll respect the setting
          const lowerPattern = pattern.toLowerCase();
          return (text) => typeof text === 'string' && text.toLowerCase().includes(lowerPattern);
        }
      }

      // Literal patterns: simple substring check
      if (!isRegex) {
        if (caseSensitive) {
          return (text) => typeof text === 'string' && text.includes(pattern);
        } else {
          const lowerPattern = pattern.toLowerCase();
          return (text) => typeof text === 'string' && text.toLowerCase().includes(lowerPattern);
        }
      }

      // For regex patterns, attempt to extract obvious required literals
      try {
        // Quick checks for some punctuation-heavy patterns
        if (pattern.includes('$') || pattern.includes('€') || pattern.includes('£')) {
          return (text) => typeof text === 'string' && (text.includes('$') || text.includes('€') || text.includes('£'));
        }
        if (pattern.includes(':')) {
          return (text) => typeof text === 'string' && text.includes(':');
        }
        if (pattern.includes('-')) {
          return (text) => typeof text === 'string' && text.includes('-');
        }

        // Look for a reasonably long literal sequence inside the regex
        const literalMatch = pattern.match(/[A-Za-z]{3,}/);
        if (literalMatch) {
          const literal = literalMatch[0];
          if (caseSensitive) {
            return (text) => typeof text === 'string' && text.includes(literal);
          } else {
            const lowerLiteral = literal.toLowerCase();
            return (text) => typeof text === 'string' && text.toLowerCase().includes(lowerLiteral);
          }
        }
      } catch (e) {
        // Fall through to permissive test below
      }
    } catch (e) {
      // If anything goes wrong, keep a permissive test to avoid false negatives
    }
    // Default: permissive tester (rarely used)
    return () => true;
  }

  // --- Lightweight mode decision for very large documents ---
  shouldUseLightweightMode(textLength, textContent = '') {
    try {
      // Use lightweight mode for very large documents OR non-Roman heavy content
      const isLargeDoc = Number(textLength) > 50000;
      const isNonRomanHeavy = this.getNonRomanCharacterRatio(textContent) > 0.3;
      
      return isLargeDoc || isNonRomanHeavy;
    } catch (e) {
      return false;
    }
  }

  // NEW METHOD: Check if we should skip complex processing
  isPerformanceOverloaded() {
    try {
      // Simple performance check - avoid complex processing if system is busy
      if (typeof performance !== 'undefined' && performance.memory) {
        const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
        if (usedMB > 1000) { // If using >1GB RAM, skip complex processing
          debugWarn('[ACT] High memory usage, skipping complex pattern processing');
          return true;
        }
      }
      
      // Quick check if we have too many entries
      const totalEntries = this.getSortedWordEntries().length;
      if (totalEntries > 100) {
        debugLog('ACT', 'Many patterns defined, using conservative processing');
        return true;
      }
      
      return false;
    } catch (e) {
      return false; // Default to processing if we can't check
    }
  }


  // --- Get Sorted Word Entries (Longest words first!!!) ---
  getSortedWordEntries() {
    // Return cached result when possible to avoid creating new arrays on every call
    if (!this._cachedSortedEntries || this._cacheDirty) {
      const entries = Array.isArray(this._compiledWordEntries) ? this._compiledWordEntries : [];
      const numWords = entries.length;
      if (numWords > 200) {
        debugWarn('GET_SORTED', `You have ${numWords} colored words/patterns! That's a lot and may impact performance.`);
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
      // Cache and clear dirty flag
      this._cachedSortedEntries = filtered;
      this._cacheDirty = false;
    }
    return this._cachedSortedEntries;
  }

  // --- Helper: Convert hex to rgba with opacity ---
  // Helper: Validate hex color format to prevent CSS injection
  isValidHexColor(hex) {
    // Only allow valid hex colors: #RGB or #RRGGBB
    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    return hexRegex.test(hex);
  }

  hexToRgba(hex, opacityPercent) {
    // Validate hex color to prevent CSS injection
    if (!this.isValidHexColor(hex)) {
      // Fallback to black if invalid
      return `rgba(0,0,0,1)`;
    }
    
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    // Clamp and convert percent to 0-1
    let o = Math.max(0, Math.min(100, Number(opacityPercent)));
    o = o / 100;
    return `rgba(${r},${g},${b},${o})`;
  }

  // Helper: Apply border style to a span element based on settings
  applyBorderStyleToElement(element, textColor) {
    if (!this.settings.enableBorderThickness) {
      return;
    }
    
    const borderThickness = this.settings.borderThickness ?? 1;
    const borderOpacity = this.settings.borderOpacity ?? 100;
    const borderColorRgba = this.hexToRgba(textColor, borderOpacity);
    const borderStyleType = this.settings.borderStyle ?? 'full';
    
    const borderCSS = `${borderThickness}px solid ${borderColorRgba}`;
    
    switch (borderStyleType) {
      case 'bottom':
        element.style.borderBottom = borderCSS;
        break;
      case 'top':
        element.style.borderTop = borderCSS;
        break;
      case 'left':
        element.style.borderLeft = borderCSS;
        break;
      case 'right':
        element.style.borderRight = borderCSS;
        break;
      case 'top-bottom':
        element.style.borderTop = borderCSS;
        element.style.borderBottom = borderCSS;
        break;
      case 'left-right':
        element.style.borderLeft = borderCSS;
        element.style.borderRight = borderCSS;
        break;
      case 'full':
      default:
        element.style.border = borderCSS;
        break;
    }
  }

  // Helper: Generate border CSS string based on settings (border always uses text color)
  generateBorderStyle(textColor, backgroundColor) {
    if (!this.settings.enableBorderThickness) {
      return '';
    }
    
    const borderThickness = this.settings.borderThickness ?? 1;
    const borderOpacity = this.settings.borderOpacity ?? 100;
    const borderColorRgba = this.hexToRgba(textColor, borderOpacity);
    const borderStyleType = this.settings.borderStyle ?? 'full';
    const borderCSS = `${borderThickness}px solid ${borderColorRgba} !important;`;
    
    switch (borderStyleType) {
      case 'bottom':
        return ` border-bottom: ${borderCSS}`;
      case 'top':
        return ` border-top: ${borderCSS}`;
      case 'left':
        return ` border-left: ${borderCSS}`;
      case 'right':
        return ` border-right: ${borderCSS}`;
      case 'top-bottom':
        return ` border-top: ${borderCSS} border-bottom: ${borderCSS}`;
      case 'left-right':
        return ` border-left: ${borderCSS} border-right: ${borderCSS}`;
      case 'full':
      default:
        return ` border: ${borderCSS}`;
    }
  }

  // Helper: Check frontmatter for disabling coloring (`always-color-text: false` disables)
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

    const p = pattern.trim();

    // Hard-blocked literal patterns (exact matches after whitespace normalization)
    const hardBlocked = [
      '"[^" ]*"',
      "'[^' ]*'",
      '(.*)*',
      '(.+)+',
      '(a*)*',
      '^(.|\\n)*?$',
      '\\b\\w{1,15}\\b\\s+\\b\\w{1,15}\\b\\s+\\b\\w{1,15}\\b'
    ];

    const normalize = s => String(s || '').replace(/\s/g, '');
    if (hardBlocked.some(h => normalize(h) === normalize(p))) return true;

    // Quick syntactic checks
    if (/\(\?[=!<]/.test(p)) return true; // lookarounds
    if (p.includes('*.*') || p.includes('+.+')) return true;

    // Fallback list of known-dangerous patterns (keep previous list short and conservative)
    const dangerousPatterns = [
      '"[^"]*"',
      "'[^']*'",
      "\"(?:[^\"\\]|\\\\.)*\"",
      "'(?:[^'\\\\]|\\\\.)*'",
      "\\b\\d{4}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)-\\d{1,2}\\b",
      '(\\w+)*\\s+',
      '([a-z]+)*\\d+',
      '(a*)*b',
      '(a+)*b',
      '(\\w+)\\1+',
      '(\\w+)(\\1){3,}',
      '(?:\\w+|\\d+)*\\s+',
      '(?:[a-z]*|[0-9]*)*',
      '^(a|a?)+$',
      '^(a|aa)+$',
      '^(.*a){10}.*$',
      '\\((?:[^()\\]|\\([^()]*\\))*\\)',
      '\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}'
    ];

    return dangerousPatterns.some(d => normalize(d) === normalize(p));
  }

  // Compile word entries into runtime structures (regexes, testRegex, validity)
  compileWordEntries() {
    try {
  try { this._compiledWordEntries = []; this._cachedSortedEntries = null; this._cacheDirty = true; } catch (e) {}
      if (!Array.isArray(this.settings.wordEntries)) return;
      for (const e of this.settings.wordEntries) {
        if (!e) continue;
        
        // Support comma-separated grouped patterns: compile each pattern separately with same color
        const patterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
          ? e.groupedPatterns
          : [String(e.pattern || '').trim()];
        
        const color = e.color || '#000000';
        const isRegex = !!e.isRegex;
        
        // Compile each pattern individually
        for (let pattern of patterns) {
          pattern = String(pattern).trim();
          if (!pattern) continue;
        
          // DECODE HTML ENTITIES FOR READING MODE COMPATIBILITY
          pattern = this.decodeHtmlEntities(pattern);
        
        // HARD-BLOCK known problematic patterns
        if (this.isKnownProblematicPattern(pattern)) {
          debugWarn('COMPILE', `Blocked dangerous pattern: ${pattern.substring(0, 50)}`);
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

        const compiled = {
          pattern,
          color,
          isRegex,
          flags,
          regex: null,
          testRegex: null,
          invalid: false,
          specificity: pattern.replace(/\*/g, '').length,
          // instrumentation counters
          execs: 0,
          avoidedExecs: 0,
          matchesFound: 0,
          blocksProcessed: 0,
          _hotLogged: false
        };
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
        // Build a cheap fastTest function to quickly reject impossible texts
        try {
          // Use minimal closure factory method to avoid large closures
          compiled.fastTest = this.createFastTester(pattern, compiled.isRegex, this.settings.caseSensitive);
          // Invalid patterns get permissive test (no filtering)
        } catch (e) {
          compiled.fastTest = (text) => true;
        }
        this._compiledWordEntries.push(compiled);
        } // End of inner for loop for each pattern in groupedPatterns
      } // End of outer for loop for each entry
      // sort by specificity (longer patterns first)
      this._compiledWordEntries.sort((a, b) => b.specificity - a.specificity || b.pattern.length - a.pattern.length);
      // mark cached filtered/sorted entries dirty so callers rebuild lazily
      try { this._cacheDirty = true; this._cachedSortedEntries = null; } catch (e) {}
    } catch (err) {
      debugError('COMPILE', 'compileWordEntries failed', err);
      try { this._compiledWordEntries = []; this._cachedSortedEntries = null; this._cacheDirty = true; } catch (e) {}
    }
  }

  // Compile text + background coloring entries
  compileTextBgColoringEntries() {
    try {
      try { this._compiledTextBgEntries = []; } catch (e) {}
      if (!Array.isArray(this.settings.textBgColoringEntries)) return;
      
      for (const e of this.settings.textBgColoringEntries) {
        if (!e) continue;
        
        // Support comma-separated grouped patterns: compile each pattern separately with same colors
        const patterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0
          ? e.groupedPatterns
          : [String(e.pattern || '').trim()];
        
        const textColor = e.textColor || '#000000';
        const backgroundColor = e.backgroundColor || '#FFFF00';
        const isRegex = !!e.isRegex;
        
        // Validate colors
        if (!this.isValidHexColor(textColor) || !this.isValidHexColor(backgroundColor)) {
          continue;
        }
        
        // Compile each pattern individually
        for (let pattern of patterns) {
          pattern = String(pattern).trim();
          if (!pattern) continue;
          
          // Decode HTML entities for reading mode compatibility
          pattern = this.decodeHtmlEntities(pattern);
          
          // Block dangerous patterns
          if (this.isKnownProblematicPattern(pattern)) {
            debugWarn('COMPILE_TEXTBG', `Blocked dangerous pattern: ${pattern.substring(0, 50)}`);
            const compiled = { 
              pattern, 
              textColor, 
              backgroundColor, 
              isRegex, 
              flags: '', 
              regex: null, 
              testRegex: null, 
              invalid: true, 
              specificity: 0,
              isTextBg: true 
            };
            this._compiledTextBgEntries.push(compiled);
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
          
          const compiled = {
            pattern,
            textColor,
            backgroundColor,
            isRegex,
            flags,
            regex: null,
            testRegex: null,
            invalid: false,
            specificity: pattern.replace(/\*/g, '').length,
            isTextBg: true // Mark as text+bg entry
          };
          
          try {
            if (this.settings.enableRegexSupport && isRegex) {
              // Safety: block overly complex regexes early
              if (this.isRegexTooComplex(pattern)) {
                compiled.invalid = true;
                try {
                  new Notice(`Pattern too complex: ${pattern.substring(0, 60)}...`);
                } catch (e) {}
                this._compiledTextBgEntries.push(compiled);
                continue;
              }
              // compile with combined flags
              compiled.regex = new RegExp(pattern, flags);
              // testRegex: same flags but without global to safely use .test()
              const testFlags = flags.replace(/g/g, '');
              compiled.testRegex = testFlags === '' ? new RegExp(pattern) : new RegExp(pattern, testFlags);
            } else {
              // literal: escape pattern and create with appropriate flags
              const esc = this.escapeRegex(pattern);
              compiled.regex = new RegExp(esc, flags);
              const testFlags = flags.replace(/g/g, '');
              compiled.testRegex = testFlags === '' ? new RegExp(esc) : new RegExp(esc, testFlags);
            }
            
            // Create fast tester for performance
            try {
              compiled.fastTest = this.createFastTester(pattern, isRegex, this.settings.caseSensitive);
            } catch (e) {
              compiled.fastTest = (text) => true;
            }
            
            this._compiledTextBgEntries.push(compiled);
          } catch (err) {
            compiled.invalid = true;
            compiled.regex = null;
            compiled.testRegex = null;
            debugError('COMPILE_TEXTBG', `Failed to compile pattern: ${pattern}`, err);
            this._compiledTextBgEntries.push(compiled);
          }
        }
      }
      
      // Sort by specificity (longer patterns first)
      this._compiledTextBgEntries.sort((a, b) => b.specificity - a.specificity);
    } catch (err) {
      debugError('COMPILE_TEXTBG', 'compileTextBgColoringEntries failed', err);
      try { this._compiledTextBgEntries = []; } catch (e) {}
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

  // Apply Highlights in Reading View (Markdown Post Processor) - optional folderEntry may override match colors
  applyHighlights(el, folderEntry = null, options = {}) {
    const entries = this.getSortedWordEntries();
    if (entries.length === 0) return;
    // Ensure element is attached to document (isConnected is more reliable than offsetParent)
    if (!el.isConnected) return;
    // options: immediateBlocks, skipFirstN, clearExisting
    this._wrapMatchesRecursive(el, entries, folderEntry, options || {});
  }

  // NEW METHOD: Apply highlights for simple patterns (ultra-fast version)
  applySimpleHighlights(textNode, matches, text, effectiveStyle) {
    if (!matches || matches.length === 0) return;
    
    // Sort matches by start position and remove overlaps
    matches.sort((a, b) => a.start - b.start);
    
    const nonOverlapping = [];
    for (const m of matches) {
      let overlaps = false;
      for (const existing of nonOverlapping) {
        if (m.start < existing.end && m.end > existing.start) {
          overlaps = true;
          break;
        }
      }
      if (!overlaps) nonOverlapping.push(m);
    }
    
    // Build DOM fragment with highlights
    const frag = document.createDocumentFragment();
    let pos = 0;
    
    for (const m of nonOverlapping) {
      if (m.start > pos) {
        frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
      }
      
      const span = document.createElement('span');
      span.className = 'always-color-text-highlight';
      span.textContent = text.slice(m.start, m.end);
      
      if (effectiveStyle === 'text') {
        span.style.color = m.color;
      } else if (effectiveStyle !== 'none') {
        span.style.backgroundColor = this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25);
        span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + 'px';
        span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + 'px';
        if (this.settings.enableBoxDecorationBreak ?? true) {
          span.style.boxDecorationBreak = 'clone';
          span.style.WebkitBoxDecorationBreak = 'clone';
        }
        
        // Add border styling if enabled
        this.applyBorderStyleToElement(span, m.color);
      }
      
      frag.appendChild(span);
      pos = m.end;
    }
    
    if (pos < text.length) {
      frag.appendChild(document.createTextNode(text.slice(pos)));
    }
    
    textNode.replaceWith(frag);
  }

  // Process only the active file: immediate visible blocks then deferred idle processing
  processActiveFileOnly(el, ctx) {
    if (!el || !ctx || !ctx.sourcePath) return;
    const startTime = performance.now();
    debugLog('ACT', 'Processing active file', ctx.sourcePath.slice(-30));
    
         // Force full reading-mode rendering (user explicitly opted in - bypass perf gates)
         if (this.settings.forceFullRenderInReading) {
           try {
             debugWarn('ACT', 'forceFullRenderInReading enabled - forcing full processing');
             // File-specific disable via settings
             if (this.settings.disabledFiles.includes(ctx.sourcePath)) return;
             // Frontmatter can override per-file disabling: always-color-text: false
             if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;
             // Folder-specific rules
             const folderEntry = this.getBestFolderEntry(ctx.sourcePath);
             // Force immediate full chunked processing with regular batch size to avoid UI lockup
             this.processInChunks(el, this.getSortedWordEntries(), folderEntry, {
               skipFirstN: 0,
               batchSize: 30,  // Use regular batch size even when forced to yield periodically
               clearExisting: true,
               forceProcess: true,
               maxMatches: Infinity
             });
           } catch (e) {
             debugError('ACT', 'forceFullRenderInReading failed', e);
           }
           return;
         }
    // Global performance gate
    try {
      if (this.performanceMonitor && this.performanceMonitor.isOverloaded && this.performanceMonitor.isOverloaded()) {
        // Throttle perf-gate warnings to avoid spamming console (only warn once per second)
        try {
          const now = Date.now();
          if (!this._lastPerfWarning || (now - this._lastPerfWarning) > 1000) {
            debugLog('ACT', 'Skipping: perf overload');
            this._lastPerfWarning = now;
          }
        } catch (e) { debugError('ACT', 'perf gate error', e); }
        return;
      }
    } catch (e) { debugError('ACT', 'perf gate error', e); }
    // NOTE: detailed DOM-size checks handled in block-level walker using TreeWalker (less false positives)
    // Avoid querying entire document to prevent skipping preview processing on busy pages

    // File-specific disable via settings
    if (this.settings.disabledFiles.includes(ctx.sourcePath)) return;
    // Frontmatter can override per-file disabling: always-color-text: false
    if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;
    // Folder-specific rules
    const folderEntry = this.getBestFolderEntry(ctx.sourcePath);

    // Respect user preference to disable reading/preview coloring
    if (this.settings.disableReadingModeColoring) {
      try {
        // Disconnect any viewport observer attached to this root to avoid leaks
        const prev = this._viewportObservers && this._viewportObservers.get && this._viewportObservers.get(el);
        if (prev && typeof prev.disconnect === 'function') {
          try { prev.disconnect(); } catch (e) {}
          try { this._viewportObservers.delete(el); } catch (e) {}
        }
      } catch (e) {}
      return;
    }


    // If this is a very large document, use progressive large-document processing
    try {
      if (el && el.textContent && this.shouldUseLightweightMode(el.textContent.length)) {
        this.processLargeDocument(el, ctx, folderEntry);
        return;
      }
    } catch (e) {}

    const immediateBlocks = 20;

    // If this is a very large document, prefer viewport-based incremental rendering
    try {
      if (this.shouldUseLightweightMode && this.shouldUseLightweightMode(el.textContent ? el.textContent.length : 0)) {
        debugLog('ACT', 'Large doc detected -> using viewport-based rendering');
        // Setup an IntersectionObserver-based pipeline to process blocks as they enter view
        try {
          this.setupViewportObserver(el, folderEntry || null, { clearExisting: true });
        } catch (e) {
          debugError('ACT', 'setupViewportObserver failed', e);
          // fallback to immediate small-pass
          this.applyHighlights(el, folderEntry || null, { immediateBlocks, clearExisting: true });
        }
        return;
      }

    } catch (e) {}

    const processNow = () => this.applyHighlights(el, folderEntry || null, { immediateBlocks, clearExisting: true });

    // Fast-path immediate pass for visible content
    const t0 = performance.now();
    processNow();
    debugLog('ACT', `immediate pass: ${(performance.now() - t0).toFixed(1)}ms`);

    // Schedule deferred pass for remaining content in idle time, guarding callback to run at most once per root
    // We use requestIdleCallback with setTimeout fallback to ensure eventual completion
    try {
      try { this._domRefs.set(el, Object.assign(this._domRefs.get(el) || {}, { deferredScheduled: true, deferredDone: false })); } catch (e) {}

      const runDeferred = (label) => {
        try {
          const meta = this._domRefs.get(el) || {};
          if (meta.deferredDone) return;
          meta.deferredDone = true;
          try { this._domRefs.set(el, meta); } catch (e) {}
          const t1 = performance.now();
          // More aggressive deferred processing: force chunked processing of remaining blocks
          debugLog('DEFERRED', `Start: ${label}, skipFirstN=${immediateBlocks}`);
          try {
            // Prefer chunked processing for large documents; force completion (bypass perf gate)
            this.processInChunks(el, this.getSortedWordEntries(), folderEntry || null, { skipFirstN: immediateBlocks, batchSize: 30, clearExisting: true, forceProcess: true })
              .then(() => debugLog('DEFERRED', `Completed: ${label} in ${(performance.now() - t1).toFixed(1)}ms`))
              .catch(e => debugError('DEFERRED', 'processInChunks error', e));
          } catch (e) {
            debugError('DEFERRED', 'fallback applyHighlights due to error', e);
            this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: true });
          }
        } catch (e) { debugError('ACT', 'deferred pass error', e); }
      };

      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        try {
          window.requestIdleCallback(() => runDeferred('idleCallback'), { timeout: 2000 });
        } catch (e) {
          // If requestIdleCallback throws, ensure fallback via setTimeout
          setTimeout(() => runDeferred('setTimeout-after-idle-error'), 1200);
        }
      } else {
        // No requestIdleCallback support; schedule fallback
        setTimeout(() => runDeferred('setTimeout-fallback'), 1200);
      }

      // Extra safety: ensure deferred runs even if idle callback never fires (e.g. user navigates)
      setTimeout(() => runDeferred('safety-timeout'), 3000);
    } catch (e) {
      // As a last resort, attempt a simple timeout run
      setTimeout(() => {
        try {
          const t3 = performance.now();
          this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: false });
          debugLog('ACT', `deferred (fallback-final) in ${(performance.now() - t3).toFixed(1)}ms`);
        } catch (err) { debugError('ACT', 'fallback-final error', err); }
      }, 1500);
    }
    debugLog('ACT', `scheduled total: ${(performance.now() - startTime).toFixed(1)}ms`);
  }

  // Progressive optimized processing for very large documents
  processLargeDocument(el, ctx, folderEntry) {
    try {
      debugLog('LARGE', 'Processing large document with optimized mode');
      // Process only visible/initial content first
      this.applyHighlights(el, folderEntry, {
        immediateBlocks: 50,
        skipFirstN: 0,
        clearExisting: true
      });

      // Schedule the rest to run after a short delay in larger batches
      setTimeout(() => {
        try {
          this.processInChunks(el, this.getSortedWordEntries(), folderEntry, {
            batchSize: 30,
            clearExisting: false
          });
        } catch (e) { debugError('LARGE', 'deferred processing failed', e); }
      }, 1000);
    } catch (e) { debugError('LARGE', 'processLargeDocument failed', e); }
  }

  // NEW METHOD: Optimized processing for non-Roman text
  processNonRomanOptimized(element, entries, folderEntry = null, options = {}) {
    const nonRomanEntries = entries.filter(entry => 
      entry && !entry.invalid && this.containsNonRomanCharacters(entry.pattern)
    );
    
    if (nonRomanEntries.length === 0) return;
    
    const blockTags = ['P', 'LI', 'DIV', 'SPAN', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const queue = [];
    
    // Simplified DOM collection - avoid heavy TreeWalker for non-Roman text
    for (const node of element.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && blockTags.includes(node.nodeName)) {
        queue.push(node);
      }
    }
    
    // Process each block with language-specific optimizations
    for (const block of queue) {
      this.processNonRomanBlock(block, nonRomanEntries, folderEntry, options);
    }
  }

  // NEW METHOD: Process single block with non-Roman text
  processNonRomanBlock(block, entries, folderEntry, opts = {}) {
    const clearExisting = opts.clearExisting !== false;
    const effectiveStyle = (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle;
    
    // Clear existing highlights
    if (clearExisting) {
      const highlights = block.querySelectorAll('span.always-color-text-highlight');
      for (const ex of highlights) {
        const tn = document.createTextNode(ex.textContent);
        ex.replaceWith(tn);
      }
    }
    
    // Process text nodes - SIMPLIFIED for non-Roman scripts
    for (const node of block.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      
      let text = node.textContent;
      if (!text || text.length > 5000) continue; // Conservative limit
      
      // DECODE HTML ENTITIES FOR READING MODE COMPATIBILITY
      text = this.decodeHtmlEntities(text);
      
      let matches = [];
      
      // SIMPLE string matching for non-Roman scripts - avoid complex regex
      for (const entry of entries) {
        if (!entry || entry.invalid) continue;
        
        let pattern = entry.pattern;
        // ALSO DECODE PATTERN FOR COMPARISON
        pattern = this.decodeHtmlEntities(pattern);
        
        const color = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
        
        // Simple string search for non-Roman patterns (more efficient)
        let pos = 0;
        while ((pos = text.indexOf(pattern, pos)) !== -1) {
          matches.push({
            start: pos,
            end: pos + pattern.length,
            color: color,
            word: pattern
          });
          pos += pattern.length;
          
          if (matches.length > 100) break; // Conservative limit
        }
        
        if (matches.length > 100) break;
      }
      
      // Apply highlights
      if (matches.length > 0) {
        matches.sort((a, b) => a.start - b.start);
        
        const frag = document.createDocumentFragment();
        let pos = 0;
        
        for (const m of matches) {
          if (m.start > pos) {
            frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
          }
          
          const span = document.createElement('span');
          span.className = 'always-color-text-highlight';
          span.textContent = text.slice(m.start, m.end);
          
          if (effectiveStyle === 'text') {
            span.style.color = m.color;
          } else {
            span.style.backgroundColor = this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25);
            span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + 'px';
            span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + 'px';
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = 'clone';
              span.style.WebkitBoxDecorationBreak = 'clone';
            }
            
            // Add border styling if enabled
            this.applyBorderStyleToElement(span, m.color);
          }
          
          frag.appendChild(span);
          pos = m.end;
        }
        
        if (pos < text.length) {
          frag.appendChild(document.createTextNode(text.slice(pos)));
        }
        
        node.replaceWith(frag);
      }
    }
  }

  // Efficient, non-recursive, DOM walker for reading mode
  _wrapMatchesRecursive(element, entries, folderEntry = null, options = {}) {
    debugLog('WRAP', `Starting with ${entries.length} entries`);
    
    // EARLY BAILOUT FOR LARGE NON-ROMAN TEXTS
    try {
      const textContent = element.textContent || '';
      const nonRomanCharCount = this.countNonRomanCharacters(textContent);
      const totalChars = textContent.length;
      
      // If text is primarily non-Roman and large, use optimized processing
      if (nonRomanCharCount > 100 && nonRomanCharCount / totalChars > 0.3) {
        debugLog('ACT', 'Using optimized non-Roman text processing');
        return this.processNonRomanOptimized(element, entries, folderEntry, options);
      }
    } catch (e) {
      // Continue with normal processing if check fails
    }

    // SEPARATE SIMPLE PATTERNS FOR OPTIMIZED PROCESSING
    const simpleEntries = entries.filter(entry => 
      entry && !entry.invalid && this.isSimplePattern(entry.pattern)
    );
    const complexEntries = entries.filter(entry => 
      entry && !entry.invalid && !this.isSimplePattern(entry.pattern)
    );

    debugLog('WRAP', `Pattern split: ${simpleEntries.length} simple, ${complexEntries.length} complex`);

    // Process simple patterns first (fast path)
    if (simpleEntries.length > 0) {
      try {
        debugLog('WRAP', `Processing ${simpleEntries.length} simple patterns`);
        this.processSimplePatternsOptimized(element, simpleEntries, folderEntry, options);
      } catch (e) {
        debugError('SIMPLE', 'processSimplePatternsOptimized failed', e);
      }
    }

    // Only process complex patterns if needed (and if we have capacity)
    if (complexEntries.length > 0 && !this.isPerformanceOverloaded()) {
      // Continue with standard complex pattern processing below
      debugLog('ACT', `Processing ${complexEntries.length} complex patterns`);
    } else if (complexEntries.length > 0) {
      debugLog('ACT', 'Skipping complex pattern processing due to performance constraints');
      // DON'T return here - we already processed simple patterns!
    }
    
    const immediateLimit = Number(options.immediateBlocks) || 0;
    const skipFirstN = Number(options.skipFirstN) || 0;
    const clearExisting = options.clearExisting !== false;
    const blockTags = ['P', 'LI', 'DIV', 'SPAN', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'CODE', 'PRE', 'A'];

    // Early DOM-safety checks using TreeWalker to avoid materializing huge NodeLists
    try {
      // If the user requested a full render in reading mode, skip these safety checks
      if (this.settings.forceFullRenderInReading) {
        try { debugWarn('DOM', 'forceFullRenderInReading active - skipping DOM size checks'); } catch (e) {}
      } else {
        // Global performance gate for DOM work
        try {
          if (this.performanceMonitor && this.performanceMonitor.isOverloaded && this.performanceMonitor.isOverloaded()) {
            // Throttle DOM perf warnings to avoid excessive logging
            try {
              const now = Date.now();
              if (!this._lastPerfWarning || (now - this._lastPerfWarning) > 1000) {
                debugLog('DOM', 'Skipping: perf overload');
                this._lastPerfWarning = now;
              }
            } catch (e) { debugLog('DOM', 'Skipping: perf overload'); }
            return;
          }
        } catch (e) {}
        const MAX_DOM_NODES = 10000;
        const MAX_BLOCK_NODES = 2000;
        let nodeCount = 0;
        const tw = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null, false);
        while (tw.nextNode()) {
          nodeCount++;
          if (nodeCount > MAX_DOM_NODES) break;
        }
        if (nodeCount > MAX_DOM_NODES) {
          debugLog('DOM', `Skipping: DOM too large (${nodeCount} nodes)`);
          return;
        }

        // Count only block-like elements up to MAX_BLOCK_NODES
        const blockSet = new Set(blockTags);
        let blockCount = 0;
        const tw2 = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
          acceptNode(node) {
            return blockSet.has(node.nodeName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
        }, false);
        while (tw2.nextNode()) {
          blockCount++;
          if (blockCount > MAX_BLOCK_NODES) break;
        }
        if (blockCount > MAX_BLOCK_NODES) {
          // Defer to chunked processor for large numbers of blocks to avoid UI freeze
          debugLog('DOM', `Chunking large block count: ${blockCount}`);
          try {
            this.processInChunks(element, entries, folderEntry, options);
          } catch (e) {
            // Fallback: warn and return
            debugError('DOM', 'Chunking failed', e);
          }
          return;
        }
      }
    } catch (e) {
      // If TreeWalker isn't available or another error occurs, continue with the old path
      debugError('DOM', 'TreeWalker error', e);
    }

    // Use TreeWalker instead of querySelectorAll to avoid materializing large arrays of DOM references
    const queue = [];
    const blockSet = new Set(blockTags);
    
    // Walk through child nodes
    for (const node of element.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && !['CODE', 'PRE'].includes(node.nodeName)) {
        if (blockTags.includes(node.nodeName)) queue.push(node);
        
        // Use TreeWalker instead of querySelectorAll to avoid creating large arrays
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
          acceptNode(n) {
            return blockSet.has(n.nodeName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
        }, false);
        
        let currentNode;
        while (currentNode = walker.nextNode()) {
          queue.push(currentNode);
        }
      }
    }
    
    if (element.nodeType === Node.ELEMENT_NODE && blockTags.includes(element.nodeName)) {
      queue.unshift(element);
    }
    
    // Debug: report how many block-like elements were discovered and what will be skipped
    try { debugLog('COLOR', `Processing ${queue.length} blocks, skipping first ${skipFirstN}`); } catch (e) {}
    let visited = 0;
    for (let qIndex = 0; qIndex < queue.length; qIndex++) {
      const block = queue[qIndex];
      // Skip blocks we've been asked to skip (deferred pass)
      if (qIndex < skipFirstN) {
        // Debug: note skipped block index
        try { if ((qIndex % 50) === 0) debugLog('COLOR', `Skipping block ${qIndex}`); } catch (e) {}
        visited++;
        continue;
      }
      const effectiveStyle = (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle;
      // Call extracted per-block processor
      try { if ((qIndex % 100) === 0) debugLog('COLOR', `Processing block ${qIndex}`); } catch (e) {}
      this._processBlock(block, entries, folderEntry, { clearExisting, effectiveStyle, immediateLimit, qIndex, skipFirstN, element, forceProcess: (options && options.forceProcess) || this.settings.forceFullRenderInReading, maxMatches: (options && options.maxMatches) || (this.settings.forceFullRenderInReading ? Infinity : undefined) });
    }
    
    // Clear queue references to help GC
    queue.length = 0;
  }

  // Extracted helper: process a single block element (previously inlined inside _wrapMatchesRecursive)
  _processBlock(block, entries, folderEntry, opts = {}) {
    try {
      // Track lightweight metadata about this block without attaching to DOM
      try { this._domRefs.set(block, { processedAt: Date.now(), matchCount: 0 }); } catch (e) {}
    } catch (e) {}
    const clearExisting = opts.clearExisting !== false;
    // Resolve effectiveStyle safely: prefer explicit option, then folderEntry, then global setting
    let effectiveStyle;
    if (typeof opts.effectiveStyle === 'string' && opts.effectiveStyle.length > 0) {
      effectiveStyle = opts.effectiveStyle;
    } else if (folderEntry && folderEntry.defaultStyle) {
      effectiveStyle = folderEntry.defaultStyle;
    } else {
      effectiveStyle = this.settings.highlightStyle;
    }
    const immediateLimit = opts.immediateLimit || 0;

    // instrumentation: count this block being processed
    try { this._perfCounters.totalBlocksProcessed = (this._perfCounters.totalBlocksProcessed || 0) + 1; } catch (e) {}

    // Unwrap any existing highlights created by this plugin to avoid stacking when re-applying
    try {
      if (clearExisting) {
        // Use TreeWalker instead of querySelectorAll to avoid materializing NodeList
        const highlights = [];
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_ELEMENT, {
          acceptNode(node) {
            return node.classList && node.classList.contains('always-color-text-highlight') 
              ? NodeFilter.FILTER_ACCEPT 
              : NodeFilter.FILTER_SKIP;
          }
        }, false);
        
        let highlightNode;
        while (highlightNode = walker.nextNode()) {
          highlights.push(highlightNode);
        }
        
        // Now remove highlights (separate loop to avoid modifying DOM during walk)
        for (const ex of highlights) {
          const tn = document.createTextNode(ex.textContent);
          ex.replaceWith(tn);
        }
        highlights.length = 0; // Clear array
      }
    } catch (e) {}

    // Use TreeWalker to find text nodes at any depth, including inside formatting tags like <em>, <i>, <b>, <strong>
    const textNodes = [];
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          // Skip text nodes in code blocks
          if (node.parentElement?.closest('code, pre')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );
    
    let currentNode;
    while (currentNode = walker.nextNode()) {
      textNodes.push(currentNode);
    }

    // Process each text node
    for (const node of textNodes) {
      let text = node.textContent;
      
      // DECODE HTML ENTITIES FOR READING MODE COMPATIBILITY
      const originalText = text;
      text = this.decodeHtmlEntities(text);
      
      // Log if decoding changed the text (for debugging)
      if (originalText !== text && (text.includes('✓') || originalText.includes('&#10003;'))) {
        debugLog('PROCESSBLOCK', 'Decoded checkmark:', { 
          from: originalText.substring(0, 30),
          to: text.substring(0, 30)
        });
      }
      
      // Define isBlacklisted helper function early so it can be used throughout
      const isBlacklisted = (textToCheck, coloredWord = null) => {
        if (!this.settings.blacklistWords || this.settings.blacklistWords.length === 0) return false;
        
        // Check if textToCheck exactly matches any blacklisted word
        return this.settings.blacklistWords.some(bw => {
          if (!bw) return false;
          if (this.settings.caseSensitive) {
            return textToCheck === bw;
          } else {
            return textToCheck.toLowerCase() === bw.toLowerCase();
          }
        });
      };
      
  // For forced processing, use unlimited matches; otherwise cap at 500
  const isForced = (opts && opts.forceProcess) || this.settings.forceFullRenderInReading;
  const maxMatches = typeof opts.maxMatches === 'number' ? opts.maxMatches : (isForced ? Infinity : 500);
  let matches = [];

      // FIRST: Process text+bg entries (they have priority) - with chunking for performance
      const textBgEntries = Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : [];
      const TEXT_BG_CHUNK_SIZE = 10; // Process text+bg entries in chunks of 10 to avoid lag
      
      if (textBgEntries.length > TEXT_BG_CHUNK_SIZE) {
        // Process in chunks
        for (let i = 0; i < textBgEntries.length && matches.length < maxMatches; i += TEXT_BG_CHUNK_SIZE) {
          const chunk = textBgEntries.slice(i, i + TEXT_BG_CHUNK_SIZE);
          for (const entry of chunk) {
            if (!entry || entry.invalid) continue;
            
            try {
              if (entry.fastTest && typeof entry.fastTest === 'function') {
                if (!entry.fastTest(text)) continue;
              }
            } catch (e) {}
            
            const regex = entry.regex;
            if (!regex) continue;
            
            let match;
            try { regex.lastIndex = 0; } catch (e) {}
            
            while ((match = regex.exec(text))) {
              const matchedText = match[0];
              const matchStart = match.index;
              const matchEnd = match.index + matchedText.length;
              
              // Respect partialMatch setting: if disabled, only accept whole-word matches
              if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
                try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
                continue;
              }
              
              // Extract full word and check blacklist
              let fullWordStart = matchStart;
              let fullWordEnd = matchEnd;
              while (fullWordStart > 0 && /\w/.test(text[fullWordStart - 1])) {
                fullWordStart--;
              }
              while (fullWordEnd < text.length && /\w/.test(text[fullWordEnd])) {
                fullWordEnd++;
              }
              const fullWord = text.substring(fullWordStart, fullWordEnd);
              
              if (isBlacklisted(fullWord)) continue;
              
              // When partialMatch is enabled, color the ENTIRE full word, not just the matched part
              const colorStart = this.settings.partialMatch ? fullWordStart : matchStart;
              const colorEnd = this.settings.partialMatch ? fullWordEnd : matchEnd;
              
              matches.push({
                start: colorStart,
                end: colorEnd,
                textColor: entry.textColor,
                backgroundColor: entry.backgroundColor,
                isTextBg: true
              });
              
              if (matches.length > maxMatches) break;
            }
            
            if (matches.length > maxMatches) break;
          }
        }
      } else {
        // Process all at once if fewer than chunk size
        for (const entry of textBgEntries) {
          if (!entry || entry.invalid) continue;
          
          try {
            if (entry.fastTest && typeof entry.fastTest === 'function') {
              if (!entry.fastTest(text)) continue;
            }
          } catch (e) {}
          
          const regex = entry.regex;
          if (!regex) continue;
          
          let match;
          try { regex.lastIndex = 0; } catch (e) {}
          
          while ((match = regex.exec(text))) {
            const matchedText = match[0];
            const matchStart = match.index;
            const matchEnd = match.index + matchedText.length;
            
            // Respect partialMatch setting: if disabled, only accept whole-word matches
            if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
              try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
              continue;
            }
            
            // Extract full word and check blacklist
            let fullWordStart = matchStart;
            let fullWordEnd = matchEnd;
            while (fullWordStart > 0 && /\w/.test(text[fullWordStart - 1])) {
              fullWordStart--;
            }
            while (fullWordEnd < text.length && /\w/.test(text[fullWordEnd])) {
              fullWordEnd++;
            }
            const fullWord = text.substring(fullWordStart, fullWordEnd);
            
            if (isBlacklisted(fullWord)) continue;
            
            // When partialMatch is enabled, color the ENTIRE full word, not just the matched part
            const colorStart = this.settings.partialMatch ? fullWordStart : matchStart;
            const colorEnd = this.settings.partialMatch ? fullWordEnd : matchEnd;
            
            matches.push({
              start: colorStart,
              end: colorEnd,
              textColor: entry.textColor,
              backgroundColor: entry.backgroundColor,
              isTextBg: true
            });
            
            if (matches.length > maxMatches) break;
          }
          
          if (matches.length > maxMatches) break;
        }
      }

      for (const entry of entries) {
        if (!entry || entry.invalid) continue;
        // mark that this entry was considered for a block
        try { entry.blocksProcessed = (entry.blocksProcessed || 0) + 1; } catch (e) {}
        // Fast pre-check to avoid running expensive regexes on text that can't match
        try {
          const skipFastTest = (opts && opts.forceProcess) || this.settings.forceFullRenderInReading;
          if (entry.fastTest && typeof entry.fastTest === 'function' && !skipFastTest) {
            const possible = entry.fastTest(text);
            if (!possible) {
              entry.avoidedExecs = (entry.avoidedExecs || 0) + 1;
              this._perfCounters.avoidedRegexExecs = (this._perfCounters.avoidedRegexExecs || 0) + 1;
              debugLog('BLOCK', `fastTest rejected: ${entry.pattern.slice(0, 20)}`);
              continue;
            }
          } else if (entry.fastTest && skipFastTest) {
            // Forced processing: bypass fastTest to ensure full scanning
            try { entry.fastTestBypassed = (entry.fastTestBypassed || 0) + 1; } catch (e) {}
          }
        } catch (e) { debugError('BLOCK', 'fastTest error', e); }
        const regex = entry.regex;
        if (!regex) continue;
        let match;
        let iterCount = 0;
        try { regex.lastIndex = 0; } catch (e) {}
        while ((match = regex.exec(text))) {
          const matchedText = match[0];
          const matchStart = match.index;
          const matchEnd = match.index + matchedText.length;
          
          // NEW: If partialMatch is disabled, only accept whole-word matches
          if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
            iterCount++;
            try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
            continue;
          }
          
          // Extract full word containing this match by expanding left and right to word boundaries
          let fullWordStart = matchStart;
          let fullWordEnd = matchEnd;
          
          // Expand left to find word boundary
          while (fullWordStart > 0 && /\w/.test(text[fullWordStart - 1])) {
            fullWordStart--;
          }
          
          // Expand right to find word boundary
          while (fullWordEnd < text.length && /\w/.test(text[fullWordEnd])) {
            fullWordEnd++;
          }
          
          const fullWord = text.substring(fullWordStart, fullWordEnd);
          
          // Check if the full word is blacklisted
          let isBlacklistedMatch = false;
          if (this.settings.blacklistWords && this.settings.blacklistWords.length > 0) {
            for (const bw of this.settings.blacklistWords) {
              if (!bw) continue;
              if (this.settings.caseSensitive) {
                if (fullWord === bw) {
                  isBlacklistedMatch = true;
                  break;
                }
              } else {
                if (fullWord.toLowerCase() === bw.toLowerCase()) {
                  isBlacklistedMatch = true;
                  break;
                }
              }
            }
          }
          
          if (isBlacklistedMatch) continue;
          
          // Skip if overlaps with any text+bg entry
          let overlapsWithTextBg = false;
          for (const tbMatch of matches.filter(m => m.isTextBg)) {
            if (match.index < tbMatch.end && match.index + matchedText.length > tbMatch.start) {
              overlapsWithTextBg = true;
              break;
            }
          }
          if (overlapsWithTextBg) continue;
          
          const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
          matches.push({ start: match.index, end: match.index + matchedText.length, color: useColor, word: matchedText, highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
          
          // instrumentation
          try { entry.matchesFound = (entry.matchesFound || 0) + 1; } catch (e) {}
          try { this._perfCounters.totalMatchesFound = (this._perfCounters.totalMatchesFound || 0) + 1; } catch (e) {}
          if (matches.length > maxMatches) break;
          iterCount++;
          // Avoid infinite loop on zero-length matches for global regexes
          try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
        }
  if (matches.length > maxMatches) break;
        if (iterCount > 0) {
          try { entry.execs = (entry.execs || 0) + iterCount; } catch (e) {}
          try { this._perfCounters.totalRegexExecs = (this._perfCounters.totalRegexExecs || 0) + iterCount; } catch (e) {}
        }
        // Log very hot patterns to help identify problematic entries (but avoid spamming)
        try {
          const HOT_ITERS_SINGLE = 100; // many iterations in a single block (lowered from 200)
          const HOT_ITERS_TOTAL = 500; // many execs over time for this pattern (lowered from 1000)
          if ((iterCount > HOT_ITERS_SINGLE || (entry.execs || 0) > HOT_ITERS_TOTAL) && !entry._hotLogged) {
            debugWarn('BLOCK', `HOT: "${entry.pattern.slice(0, 30)}" iter=${iterCount} total=${entry.execs}`);
            entry._hotLogged = true;
          }
        } catch (e) {}
      }

      // Resolve overlaps from main matching loop first (must run BEFORE Partial Match so longer matches win)
      if (matches.length > 1) {
        debugLog('OVERLAP', `Before resolution: ${matches.length} matches found`);
        
        // Sort by start position, then by LENGTH (longest first)
        matches.sort((a, b) => {
          if (a.start !== b.start) return a.start - b.start;
          return (b.end - b.start) - (a.end - a.start); // Longer first
        });
        
        // Use a greedy algorithm: iterate through sorted matches and skip any that overlap
        let nonOverlapping = [];
        for (const m of matches) {
          let overlapsWithSelected = false;
          
          for (const selected of nonOverlapping) {
            if (m.start < selected.end && m.end > selected.start) {
              overlapsWithSelected = true;
              break;
            }
          }
          
          if (!overlapsWithSelected) {
            nonOverlapping.push(m);
          }
        }
        
        matches = nonOverlapping;
      }

      // --- Partial Match coloring for text+bg entries ---
      if (this.settings.partialMatch && textBgEntries.length > 0) {
        const wordRegex = /\w+/g;
        let match;
        while ((match = wordRegex.exec(text))) {
          const w = match[0];
          const start = match.index;
          const end = start + w.length;
          if (isBlacklisted(w)) continue;
          
          // Check text & background entries for partial matches
          for (const entry of textBgEntries) {
            if (!entry || entry.invalid) continue;
            if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
            if (isBlacklisted(entry.pattern)) continue;
            
            const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), 'i'));
            if (testRe.test(w)) {
              // Check if this partial match overlaps with any existing match
              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                if (start < existingMatch.end && end > existingMatch.start) {
                  overlapsWithExisting = true;
                  break;
                }
              }
              
              // Add partial match if no overlap with existing, or replace if replacing smaller overlaps
              if (!overlapsWithExisting) {
                matches.push({ 
                  start: start, 
                  end: end, 
                  textColor: entry.textColor,
                  backgroundColor: entry.backgroundColor,
                  isTextBg: true
                });
              } else {
                // Remove smaller overlapping matches and add the full word instead
                matches = matches.filter(m => !(m.start >= start && m.end <= end && (m.end - m.start) < (end - start)));
                matches.push({ 
                  start: start, 
                  end: end, 
                  textColor: entry.textColor,
                  backgroundColor: entry.backgroundColor,
                  isTextBg: true
                });
              }
              break;
            }
          }
          
          // Avoid infinite loop on zero-length matches for this wordRegex
          try { if (typeof wordRegex.lastIndex === 'number' && wordRegex.lastIndex === match.index) wordRegex.lastIndex++; } catch (e) {}
        }
      }

      // --- Partial Match coloring --- (respect already-resolved matches)
      if (this.settings.partialMatch) {
        const wordRegex = /\w+/g;
        let match;
        while ((match = wordRegex.exec(text))) {
          const w = match[0];
          const start = match.index;
          const end = start + w.length;
          if (isBlacklisted(w)) continue;
          for (const entry of entries) {
            if (!entry || entry.invalid) continue;
            if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
            if (isBlacklisted(entry.pattern)) continue;
            const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), 'i'));
            if (testRe.test(w)) {
              // Check if this partial match overlaps with any existing match
              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                if (start < existingMatch.end && end > existingMatch.start) {
                  overlapsWithExisting = true;
                  break;
                }
              }
              // Add partial match if no overlap with existing, or replace if replacing smaller overlaps
              if (!overlapsWithExisting) {
                const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
                matches.push({ start: start, end: end, color: useColor, word: w, highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
              } else {
                // Remove smaller overlapping matches and add the full word instead
                matches = matches.filter(m => !(m.start >= start && m.end <= end && (m.end - m.start) < (end - start)));
                const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
                matches.push({ start: start, end: end, color: useColor, word: w, highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
              }
              break;
            }
          }
          // Avoid infinite loop on zero-length matches for this wordRegex
          try { if (typeof wordRegex.lastIndex === 'number' && wordRegex.lastIndex === match.index) wordRegex.lastIndex++; } catch (e) {}
        }
      }

      // --- Symbol-Word Coloring ---
      for (const entry of entries) {
        if (!entry || entry.invalid) continue;
        if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) {
          const regex = entry.regex;
          if (!regex) continue;
          let match;
          while ((match = regex.exec(text))) {
            const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
            matches.push({ start: match.index, end: match.index + match[0].length, color: useColor, word: match[0], highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
            // Avoid infinite loop on zero-length matches
            try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
          }
        }
      }

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
              // Avoid infinite loop on zero-length matches for this wordRegex
              try { if (typeof wordRegex.lastIndex === 'number' && wordRegex.lastIndex === match.index) wordRegex.lastIndex++; } catch (e) {}
          }
        }
      }

      // Remove overlapping matches, prefer longest - handles overlaps from Partial Match and Symbol-Word features
      // (main loop overlaps are already resolved above)
      if (matches.length > 1) {
        // Sort by start position, then by LENGTH (longest first)
        matches.sort((a, b) => {
          if (a.start !== b.start) return a.start - b.start;
          return (b.end - b.start) - (a.end - a.start); // Longer first
        });
        
        // Use a greedy algorithm to remove overlaps
        let nonOverlapping = [];
        for (const m of matches) {
          let overlapsWithSelected = false;
          
          for (const selected of nonOverlapping) {
            if (m.start < selected.end && m.end > selected.start) {
              overlapsWithSelected = true;
              break;
            }
          }
          
          if (!overlapsWithSelected) {
            nonOverlapping.push(m);
          }
        }
        
        matches = nonOverlapping;
      }
      
      // Sort the final result by start position for rendering
      matches.sort((a, b) => a.start - b.start);
      let nonOverlapping = matches;
      let lastEnd = 0;
      if (nonOverlapping.length) {
        const frag = document.createDocumentFragment();
        let pos = 0;
        let i = 0;
        while (i < nonOverlapping.length) {
          let m = nonOverlapping[i];
          let j = i + 1;
          // Don't merge text+bg entries; only merge regular entries with same color
          while (j < nonOverlapping.length && nonOverlapping[j].start === nonOverlapping[j - 1].end && !m.isTextBg && !nonOverlapping[j].isTextBg && nonOverlapping[j].color === m.color) {
            m = { start: m.start, end: nonOverlapping[j].end, color: m.color };
            j++;
          }
          if (m.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
          if (effectiveStyle === 'none') {
            // Explicit 'none' style: do not apply any coloring, just append raw text
            frag.appendChild(document.createTextNode(text.slice(m.start, m.end)));
          } else {
            const span = document.createElement('span');
            span.className = 'always-color-text-highlight';
            span.textContent = text.slice(m.start, m.end);
            if (m.isTextBg) {
              // For text+bg entries, always apply both colors
              span.style.color = m.textColor;
              span.style.background = '';
              span.style.backgroundColor = this.hexToRgba(m.backgroundColor, this.settings.backgroundOpacity ?? 25);
              span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + 'px';
              if ((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) {
                span.style.borderRadius = '0px';
              } else {
                span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + 'px';
              }
              if (this.settings.enableBoxDecorationBreak ?? true) {
                span.style.boxDecorationBreak = 'clone';
                span.style.WebkitBoxDecorationBreak = 'clone';
              }
              // Add border for text+bg entries
              this.applyBorderStyleToElement(span, m.textColor);
            } else if (effectiveStyle === 'text') {
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
              if (this.settings.enableBoxDecorationBreak ?? true) {
                span.style.boxDecorationBreak = 'clone';
                span.style.WebkitBoxDecorationBreak = 'clone';
              }
              // Add border for regular background highlights
              this.applyBorderStyleToElement(span, m.color);
            }
            frag.appendChild(span);
          }
          pos = m.end;
          i = j;
        }
        if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
        node.replaceWith(frag);
        // update dom ref with match count (zero for 'none' style since no highlights applied)
        try {
          const info = this._domRefs.get(block);
          if (info) info.matchCount = (effectiveStyle === 'none') ? 0 : nonOverlapping.length;
        } catch (e) {}
      }
    }
  }

  // Async chunked processing to prevent UI freezes on large documents
  async processInChunks(element, entries, folderEntry = null, options = {}) {
    // Use TreeWalker to avoid materializing large array of DOM references
    const selector = 'p, li, div, span, td, th, blockquote, h1, h2, h3, h4, h5, h6';
  const batch = Number(options.batchSize) || 20; // larger default batch to process more blocks per tick
    
    // Collect blocks using TreeWalker instead of querySelectorAll to be more memory-efficient
    const blocks = [];
    const tags = new Set(selector.split(',').map(s => s.trim().toUpperCase()));
    
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        return tags.has(node.nodeName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    }, false);
    
    let currentNode;
    while (currentNode = walker.nextNode()) {
      blocks.push(currentNode);
    }
    
    const startIndex = Number(options.skipFirstN) || 0;
    const forceProcess = !!options.forceProcess;
    debugLog('CHUNK', `start: ${blocks.length} blocks, batch=${batch}, startIndex=${startIndex}, forceProcess=${forceProcess}`);

    for (let i = startIndex; i < blocks.length; i++) {
      // Check global performance monitor per batch unless forced
      if (!forceProcess && this.performanceMonitor && this.performanceMonitor.isOverloaded && this.performanceMonitor.isOverloaded()) {
        debugWarn('CHUNK', `paused at block ${i} due to perf overload`);
        // schedule continuation to avoid tight retry loops
        setTimeout(() => {
          try {
            this.processInChunks(element, entries, folderEntry, options);
          } catch (e) { debugError('CHUNK', 'retry failed', e); }
        }, 300);
        blocks.length = 0; // Clear array to help GC
        return;
      }
      
      try {
        this._processBlock(blocks[i], entries, folderEntry, { 
          clearExisting: options.clearExisting !== false, 
          effectiveStyle: (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle,
          forceProcess: forceProcess || this.settings.forceFullRenderInReading,
          maxMatches: (options && typeof options.maxMatches !== 'undefined') ? options.maxMatches : (forceProcess || this.settings.forceFullRenderInReading ? Infinity : undefined)
        });
      } catch (e) { 
        debugError('CHUNK', 'block error', e); 
      }
      
      // Yield to browser every batch blocks to keep UI responsive
      // Even with forceProcess, we yield periodically to prevent main thread lockup
      const yieldInterval = forceProcess ? 50 : batch; // More frequent yields when forced
      if (i % yieldInterval === 0 && i > 0) {
        // yield to the browser to keep UI responsive
        // use a very short timeout so large documents progress quickly
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    debugLog('CHUNK', `done: ${blocks.length} blocks processed`);
    
    // Clear blocks array to help garbage collection
    blocks.length = 0;
  }


  // Setup IntersectionObserver to process only blocks as they enter the viewport
  setupViewportObserver(rootEl, folderEntry = null, options = {}) {
    try {
      if (!rootEl || !rootEl.isConnected) return;
      
      // Ensure _viewportObservers is initialized
      if (!this._viewportObservers) {
        this._viewportObservers = new Map();
      }
      
      // If an observer already exists for this root, disconnect and recreate
      try {
        const prev = this._viewportObservers.get(rootEl);
        if (prev && typeof prev.disconnect === 'function') prev.disconnect();
      } catch (e) {
        debugError('VIEWPORT', 'Error disconnecting old observer', e);
      }

      const selectorTags = new Set(['P','LI','DIV','SPAN','TD','TH','BLOCKQUOTE','H1','H2','H3','H4','H5','H6']);

      // Collect candidate block elements (skip CODE/PRE)
      const blocks = [];
      try {
        const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        while (node = walker.nextNode()) {
          if (!node || !node.nodeName) continue;
          if (['CODE','PRE'].includes(node.nodeName)) continue;
          if (selectorTags.has(node.nodeName)) blocks.push(node);
        }
      } catch (e) {
        // fallback: querySelectorAll
        try {
          const nodeList = rootEl.querySelectorAll('p, li, div, span, td, th, blockquote, h1, h2, h3, h4, h5, h6');
          for (const n of nodeList) blocks.push(n);
        } catch (err) {
          debugError('VIEWPORT', 'querySelectorAll fallback failed', err);
        }
      }

      if (blocks.length === 0) return;

      // Process queue bookkeeping
      const processed = new WeakSet();

      const observerOptions = {
        root: rootEl,
        rootMargin: (options.rootMargin || '300px 0px 300px 0px'),
        threshold: options.threshold || 0.01
      };

      const io = new IntersectionObserver((entries) => {
        for (const ent of entries) {
          try {
            if (ent.isIntersecting) {
              const block = ent.target;
              if (processed.has(block)) {
                try { io.unobserve(block); } catch (e) {}
                continue;
              }
              // Mark processed before running to avoid races
              processed.add(block);
              try { io.unobserve(block); } catch (e) {}
              // Process the block (clearExisting true to avoid conflicts)
              try {
                this._processBlock(block, this.getSortedWordEntries(), folderEntry, { clearExisting: options.clearExisting !== false, effectiveStyle: (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle, forceProcess: options.forceProcess || this.settings.forceFullRenderInReading, maxMatches: (options.maxMatches || (this.settings.forceFullRenderInReading ? Infinity : undefined)) });
              } catch (e) { debugError('VIEWPORT', '_processBlock failed', e); }
            }
          } catch (e) { debugError('VIEWPORT', 'observer entry error', e); }
        }
      }, observerOptions);

      // Observe each block
      for (const b of blocks) {
        try { io.observe(b); } catch (e) {
          debugError('VIEWPORT', 'Error observing block', e);
        }
      }

      // Store observer so we can disconnect later
      try { 
        if (!this._viewportObservers) this._viewportObservers = new Map();
        this._viewportObservers.set(rootEl, io); 
      } catch (e) { 
        debugError('VIEWPORT', 'Error storing observer', e); 
      }

      // Prefetch: process first N visible blocks synchronously to reduce perceived delay
      try {
        const firstN = Number(options.immediateBlocks) || 10;
        let count = 0;
        for (const b of blocks) {
          if (count >= firstN) break;
          const rect = b.getBoundingClientRect();
          // If block is near top of viewport, process now
          if (rect.top < (window.innerHeight + 400) && rect.bottom > -400) {
            if (!processed.has(b)) {
              processed.add(b);
              try { io.unobserve(b); } catch (e) {}
              this._processBlock(b, this.getSortedWordEntries(), folderEntry, { clearExisting: options.clearExisting !== false, effectiveStyle: (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle, forceProcess: options.forceProcess || this.settings.forceFullRenderInReading, maxMatches: (options.maxMatches || (this.settings.forceFullRenderInReading ? Infinity : undefined)) });
            }
            count++;
          }
        }
      } catch (e) {
        debugError('VIEWPORT', 'Error prefetching visible blocks', e);
      }

      debugLog('VIEWPORT', `observer set: ${blocks.length} blocks, immediate=${options.immediateBlocks || 10}`);
    } catch (e) {
      debugError('VIEWPORT', 'setup failed', e);
    }
  }

  // NEW METHOD: Optimized decorations for non-Roman text
  buildNonRomanOptimizedDeco(view, builder, from, to, text) {
    const plugin = this;
    const activeFile = this.app.workspace.getActiveFile();
    if (!this.settings.enabled) return builder.finish();
    if (activeFile && this.settings.disabledFiles.includes(activeFile.path)) return builder.finish();
    if (activeFile && this.isFrontmatterColoringDisabled(activeFile.path)) return builder.finish();
    
    const folderEntry = activeFile ? this.getBestFolderEntry(activeFile.path) : null;
    
    const entries = this.getSortedWordEntries();
    const nonRomanEntries = entries.filter(entry => 
      entry && !entry.invalid && this.containsNonRomanCharacters(entry.pattern)
    );
    
    if (nonRomanEntries.length === 0) return builder.finish();
    
    let matches = [];
    
    // Simple string search for non-Roman patterns
    for (const entry of nonRomanEntries) {
      const pattern = entry.pattern;
      let pos = 0;
      
      while ((pos = text.indexOf(pattern, pos)) !== -1) {
        matches.push({
          start: from + pos,
          end: from + pos + pattern.length,
          color: entry.color
        });
        pos += pattern.length;
        
        if (matches.length > 200) break;
      }
      
      if (matches.length > 200) break;
    }
    
    // Apply decorations
    const effectiveStyle = (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle;
    if (effectiveStyle === 'none') return builder.finish();
    
    for (const m of matches) {
      const style = effectiveStyle === 'text'
        ? `color: ${m.color} !important;`
        : `background: none !important; background-color: ${this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) ? 0 : (this.settings.highlightBorderRadius ?? 8))}px !important; padding-left: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important; padding-right: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important;${(this.settings.enableBoxDecorationBreak ?? true) ? ' box-decoration-break: clone; -webkit-box-decoration-break: clone;' : ''}`;
      
      const deco = Decoration.mark({
        attributes: { style }
      });
      builder.add(m.start, m.end, deco);
    }
    
    return builder.finish();
  }

  // --- Build CodeMirror Editor Extension (Editing View) ---
  buildEditorExtension() {
    const plugin = this;
    return ViewPlugin.fromClass(class {
      constructor(view) {
        this.decorations = this.buildDeco(view);
        this.lastFilePath = view.file ? view.file.path : null;
      }
      update(update) {
        // Get current active file to detect folder changes
        const currentFilePath = plugin.app.workspace.getActiveFile()?.path;
        const fileChanged = this.lastFilePath !== currentFilePath;
        this.lastFilePath = currentFilePath;
        
        // Rebuild decorations if document changed, viewport changed, OR file/folder changed
        if (update.docChanged || update.viewportChanged || fileChanged) {
          this.decorations = this.buildDeco(update.view);
        }
      }
      buildDeco(view) {
        const builder = new RangeSetBuilder();
        
        const entries = plugin.getSortedWordEntries();
        const { from, to } = view.viewport;
        const text = view.state.doc.sliceString(from, to);
        
        const activeFile = plugin.app.workspace.getActiveFile();
        if (!plugin.settings.enabled) return builder.finish();
        if (activeFile && plugin.settings.disabledFiles.includes(activeFile.path)) return builder.finish();
        if (activeFile && plugin.isFrontmatterColoringDisabled(activeFile.path)) return builder.finish();
        
        const folderEntry = activeFile ? plugin.getBestFolderEntry(activeFile.path) : null;
        if (view.file && activeFile && view.file.path !== activeFile.path) return builder.finish();
        
        if (entries.length === 0) return builder.finish();
        
        // CHUNKED PROCESSING: Handle large pattern sets or large text with chunking
        if (entries.length > EDITOR_PERFORMANCE_CONSTANTS.MAX_PATTERNS_STANDARD || 
            text.length > EDITOR_PERFORMANCE_CONSTANTS.MAX_TEXT_LENGTH_STANDARD) {
          return plugin.buildDecoChunked(view, builder, from, to, text, entries, folderEntry);
        }
        
        // Standard processing for small/medium cases
        return plugin.buildDecoStandard(view, builder, from, to, text, entries, folderEntry);
      }
    }, {
      decorations: v => v.decorations
    });
  }

  // NEW METHOD: Extract full word containing a match
  extractFullWord(text, matchStart, matchEnd) {
    let fullWordStart = matchStart;
    let fullWordEnd = matchEnd;
    
    // Expand left to word boundary
    while (fullWordStart > 0 && /\w/.test(text[fullWordStart - 1])) {
      fullWordStart--;
    }
    
    // Expand right to word boundary  
    while (fullWordEnd < text.length && /\w/.test(text[fullWordEnd])) {
      fullWordEnd++;
    }
    
    return text.substring(fullWordStart, fullWordEnd);
  }

  // NEW METHOD: Check if word is blacklisted
  isWordBlacklisted(word) {
    if (!this.settings.blacklistWords || this.settings.blacklistWords.length === 0) {
      return false;
    }
    
    return this.settings.blacklistWords.some(bw => {
      if (!bw) return false;
      if (this.settings.caseSensitive) {
        return word === bw;
      } else {
        return word.toLowerCase() === bw.toLowerCase();
      }
    });
  }

  // NEW METHOD: Standard editor processing for small/medium pattern/text sizes
  buildDecoStandard(view, builder, from, to, text, entries, folderEntry) {
    const entries_copy = entries || this.getSortedWordEntries();
    let matches = [];

    // FIRST: Process text+bg entries (they have priority and override other styling)
    const textBgEntries = Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : [];
    for (const entry of textBgEntries) {
      if (!entry || entry.invalid) continue;
      try {
        if (entry.fastTest && typeof entry.fastTest === 'function' && !entry.fastTest(text)) continue;
      } catch (e) {}
      
      const regex = entry.regex;
      if (!regex) continue;
      
      let match;
      try { regex.lastIndex = 0; } catch (e) {}
      
      while ((match = regex.exec(text))) {
        const matchedText = match[0];
        const matchStart = match.index;
        const matchEnd = match.index + matchedText.length;
        
        // Respect partialMatch setting: if disabled, only accept whole-word matches
        if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
          try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
          continue;
        }
        
        // Check blacklist
        const fullWord = this.extractFullWord(text, matchStart, matchEnd);
        if (this.isWordBlacklisted(fullWord)) continue;
        
        // When partialMatch is enabled, color the ENTIRE full word, not just the matched part
        const fullWordStart = this.extractFullWord(text, matchStart, matchEnd);
        let colorStart = matchStart;
        let colorEnd = matchEnd;
        
        if (this.settings.partialMatch) {
          // Find actual word boundaries
          colorStart = matchStart;
          colorEnd = matchEnd;
          while (colorStart > 0 && /\w/.test(text[colorStart - 1])) {
            colorStart--;
          }
          while (colorEnd < text.length && /\w/.test(text[colorEnd])) {
            colorEnd++;
          }
        }
        
        matches.push({
          start: from + colorStart,
          end: from + colorEnd,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor,
          isTextBg: true
        });
        
        if (matches.length > 3000) break;
      }
      
      if (matches.length > 3000) break;
    }

    // SECOND: Process regular entries, but skip areas covered by text+bg entries
    for (const entry of entries_copy) {
      if (!entry || entry.invalid) continue;
      try {
        if (entry.fastTest && typeof entry.fastTest === 'function' && !entry.fastTest(text)) continue;
      } catch (e) {}
      
      const regex = entry.regex;
      if (!regex) continue;
      
      let match;
      let iterCount = 0;
      
      try { regex.lastIndex = 0; } catch (e) {}
      
      while ((match = regex.exec(text))) {
        iterCount++;
        const matchedText = match[0];
        
        // Check if this match overlaps with any text+bg entry
        const matchStart = from + match.index;
        const matchEnd = from + match.index + matchedText.length;
        let overlapsWithTextBg = false;
        for (const tbMatch of matches.filter(m => m.isTextBg)) {
          if (matchStart < tbMatch.end && matchEnd > tbMatch.start) {
            overlapsWithTextBg = true;
            break;
          }
        }
        if (overlapsWithTextBg) {
          try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
          continue;
        }
        
        // ALWAYS check for whole-word matches (the main loop only accepts exact pattern matches at word boundaries)
        // The partialMatch flag is handled by a SEPARATE pass after this loop
        if (!this.isWholeWordMatch(text, match.index, match.index + matchedText.length)) {
          try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
          continue;
        }
        
        // Use helper to extract full word and check if blacklisted
        const fullWord = this.extractFullWord(text, match.index, match.index + matchedText.length);
        if (this.isWordBlacklisted(fullWord)) continue;
        
        matches.push({
          start: from + match.index,
          end: from + match.index + matchedText.length,
          color: entry.color
        });
        
        if (matches.length > 3000) break;
      }
      
      if (iterCount > 0) {
        try { entry.execs = (entry.execs || 0) + iterCount; } catch (e) {}
        try { this._perfCounters.totalRegexExecs = (this._perfCounters.totalRegexExecs || 0) + iterCount; } catch (e) {}
      }
      
      if (matches.length > 3000) break;
    }

    // --- Partial Match coloring (for editor, matching reading mode behavior) ---
    if (this.settings.partialMatch && matches.length < 3000) {
      const wordRegex = /\w+/g;
      let match;
      while ((match = wordRegex.exec(text))) {
        const w = match[0];
        const wStart = match.index;
        const wEnd = wStart + w.length;
        
        if (this.isWordBlacklisted(w)) continue;
        
        for (const entry of entries_copy) {
          if (!entry || entry.invalid) continue;
          // Skip pure symbol patterns in partial match
          if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
          if (this.isWordBlacklisted(entry.pattern)) continue;
          
          const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), 'i'));
          if (testRe.test(w)) {
            // Check if this partial match overlaps with any existing match (convert existing to text-relative for comparison)
            let overlapsWithExisting = false;
            for (const existingMatch of matches) {
              const existStart = existingMatch.start - from;
              const existEnd = existingMatch.end - from;
              if (wStart < existEnd && wEnd > existStart) {
                overlapsWithExisting = true;
                break;
              }
            }
            
            // Add partial match if no overlap with existing, or replace if replacing smaller overlaps
            if (!overlapsWithExisting) {
              const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
              matches.push({ start: from + wStart, end: from + wEnd, color: useColor });
              if (matches.length > 3000) break;
            } else {
              // Remove smaller overlapping matches and add the full word instead
              matches = matches.filter(m => !(m.start >= (from + wStart) && m.end <= (from + wEnd) && (m.end - m.start) < (wEnd - wStart)));
              const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
              matches.push({ start: from + wStart, end: from + wEnd, color: useColor });
              if (matches.length > 3000) break;
            }
            break;
          }
        }
        
        if (matches.length > 3000) break;
        try { if (typeof wordRegex.lastIndex === 'number' && wordRegex.lastIndex === match.index) wordRegex.lastIndex++; } catch (e) {}
      }
    }

    // Apply folder color override (but not to text+bg entries)
    if (folderEntry && folderEntry.defaultColor) {
      matches = matches.map(m => m.isTextBg ? m : Object.assign({}, m, { color: folderEntry.defaultColor }));
    }

    // Remove overlapping matches - greedy algorithm (prefer longest, but keep text+bg matches)
    if (matches.length > 1) {
      const textBgMatches = matches.filter(m => m.isTextBg);
      const regularMatches = matches.filter(m => !m.isTextBg);
      
      regularMatches.sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start;
        return (b.end - b.start) - (a.end - a.start); // Longer first
      });
      
      let nonOverlapping = [...textBgMatches]; // Start with text+bg entries
      for (const m of regularMatches) {
        let overlapsWithSelected = false;
        for (const selected of nonOverlapping) {
          if (m.start < selected.end && m.end > selected.start) {
            overlapsWithSelected = true;
            break;
          }
        }
        if (!overlapsWithSelected) {
          nonOverlapping.push(m);
        }
      }
      matches = nonOverlapping;
    }
    
    matches = matches.slice(0, 3000);

    // CRITICAL: Sort matches by `start` then `end` BEFORE adding to RangeSetBuilder.
    // RangeSetBuilder requires ranges in order, and the overlap removal above can unsort them.
    // This is especially important when text+bg entries are mixed with regular entries.
    matches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return a.end - b.end;
    });

    // Apply decorations
    const effectiveStyle = (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle;
    if (effectiveStyle === 'none' && matches.length > 0 && !matches.some(m => m.isTextBg)) return builder.finish();

    for (const m of matches) {
      let style;
      if (m.isTextBg) {
        // Text+bg entries always use both colors
        const borderStyle = this.generateBorderStyle(m.textColor, m.backgroundColor);
        style = `color: ${m.textColor} !important; background-color: ${this.hexToRgba(m.backgroundColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(this.settings.highlightBorderRadius ?? 8)}px !important; padding-left: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important; padding-right: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important;${(this.settings.enableBoxDecorationBreak ?? true) ? ' box-decoration-break: clone; -webkit-box-decoration-break: clone;' : ''}${borderStyle}`;
      } else {
        if (effectiveStyle === 'text') {
          style = `color: ${m.color} !important;`;
        } else {
          const borderStyle = this.generateBorderStyle(m.color, m.color);
          style = `background: none !important; background-color: ${this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) ? 0 : (this.settings.highlightBorderRadius ?? 8))}px !important; padding-left: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important; padding-right: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important;${(this.settings.enableBoxDecorationBreak ?? true) ? ' box-decoration-break: clone; -webkit-box-decoration-break: clone;' : ''}${borderStyle}`;
        }
      }
      const deco = Decoration.mark({ attributes: { style } });
      builder.add(m.start, m.end, deco);
    }

    return builder.finish();
  }

  // NEW METHOD: Chunked editor processing for large pattern sets or large text
  buildDecoChunked(view, builder, from, to, text, entries, folderEntry) {
    const CHUNK_SIZE = EDITOR_PERFORMANCE_CONSTANTS.PATTERN_CHUNK_SIZE;
    const TEXT_CHUNK_SIZE = EDITOR_PERFORMANCE_CONSTANTS.TEXT_CHUNK_SIZE;
    const MAX_MATCHES = EDITOR_PERFORMANCE_CONSTANTS.MAX_TOTAL_MATCHES;
    let allMatches = [];

    // FIRST: Process text+bg entries (they have priority)
    const textBgEntries = Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : [];
    if (textBgEntries.length > 0) {
      for (const entry of textBgEntries) {
        if (!entry || entry.invalid) continue;
        
        if (entry.fastTest && !entry.fastTest(text)) continue;
        
        const regex = entry.regex;
        if (!regex) continue;
        
        let match;
        try { regex.lastIndex = 0; } catch (e) {}
        
        while ((match = regex.exec(text))) {
          const matchStart = match.index;
          const matchEnd = match.index + match[0].length;
          
          // Respect partialMatch setting: if disabled, only accept whole-word matches
          if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
            try { if (typeof regex.lastIndex === 'number' && regex.lastIndex === match.index) regex.lastIndex++; } catch (e) {}
            continue;
          }
          
          const fullWord = this.extractFullWord(text, matchStart, matchEnd);
          if (this.isWordBlacklisted(fullWord)) continue;
          
          // When partialMatch is enabled, color the ENTIRE full word, not just the matched part
          let colorStart = matchStart;
          let colorEnd = matchEnd;
          
          if (this.settings.partialMatch) {
            // Find actual word boundaries
            colorStart = matchStart;
            colorEnd = matchEnd;
            while (colorStart > 0 && /\w/.test(text[colorStart - 1])) {
              colorStart--;
            }
            while (colorEnd < text.length && /\w/.test(text[colorEnd])) {
              colorEnd++;
            }
          }
          
          allMatches.push({
            start: from + colorStart,
            end: from + colorEnd,
            textColor: entry.textColor,
            backgroundColor: entry.backgroundColor,
            isTextBg: true
          });
          
          if (allMatches.length > MAX_MATCHES) break;
        }
        
        if (allMatches.length > MAX_MATCHES) break;
      }
    }

    // SECOND: Process regular patterns, avoiding text+bg matches
    // Strategy 1: If too many patterns, process patterns in chunks
    if (entries.length > CHUNK_SIZE) {
      debugLog('EDITOR', `Processing ${entries.length} patterns in chunks (chunk size: ${CHUNK_SIZE})`);
      
      for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
        const chunk = entries.slice(i, i + CHUNK_SIZE);
        const chunkMatches = this.processPatternChunk(text, from, chunk, folderEntry, allMatches);
        allMatches = allMatches.concat(chunkMatches);
        
        // Log progress
        const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
        const totalChunks = Math.ceil(entries.length / CHUNK_SIZE);
        debugLog('EDITOR', `Chunk ${chunkNum}/${totalChunks}: ${chunkMatches.length} matches`);
        
        // Hard limit to prevent excessive decorations
        if (allMatches.length > MAX_MATCHES) {
          debugLog('EDITOR', `Reached match limit (${allMatches.length}), stopping early`);
          break;
        }
      }
    }
    // Strategy 2: If text is very long, process text in chunks
    else if (text.length > TEXT_CHUNK_SIZE) {
      debugLog('EDITOR', `Processing long text (${text.length} chars) in chunks (chunk size: ${TEXT_CHUNK_SIZE})`);
      
      let chunkNum = 0;
      const totalChunks = Math.ceil(text.length / TEXT_CHUNK_SIZE);
      for (let pos = 0; pos < text.length; pos += TEXT_CHUNK_SIZE) {
        chunkNum++;
        const chunkEnd = Math.min(pos + TEXT_CHUNK_SIZE, text.length);
        const chunkText = text.slice(pos, chunkEnd);
        const chunkFrom = from + pos;
        
        const chunkMatches = this.processTextChunk(chunkText, chunkFrom, entries, folderEntry, allMatches);
        allMatches = allMatches.concat(chunkMatches);
        
        debugLog('EDITOR', `Text chunk ${chunkNum}/${totalChunks}: ${chunkMatches.length} matches`);
        
        if (allMatches.length > MAX_MATCHES) {
          debugLog('EDITOR', `Reached match limit (${allMatches.length}), stopping early`);
          break;
        }
      }
    }

    debugLog('EDITOR', `Processing complete: ${allMatches.length} total matches`);

    // Apply decorations from collected matches
    return this.applyDecorationsFromMatches(builder, allMatches, folderEntry);
  }

  // NEW METHOD: Process a chunk of patterns
  processPatternChunk(text, baseFrom, patternChunk, folderEntry, existingMatches = []) {
    const MAX_MATCHES_PER_PATTERN = EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN;
    const matches = [];
    
    for (const entry of patternChunk) {
      if (!entry || entry.invalid) continue;
      
      // Fast pre-check
      if (entry.fastTest && !entry.fastTest(text)) continue;
      
      const regex = entry.regex;
      if (!regex) continue;
      
      let match;
      let matchCount = 0;
      
      // CRITICAL FIX: Always reset regex state before processing
      try { regex.lastIndex = 0; } catch (e) {}
      
      while ((match = regex.exec(text)) && matchCount < MAX_MATCHES_PER_PATTERN) {
        const matchedText = match[0];
        const matchStart = baseFrom + match.index;
        const matchEnd = baseFrom + match.index + matchedText.length;
        
        // Skip if overlaps with text+bg entries
        let overlapsWithTextBg = false;
        for (const existing of existingMatches) {
          if (existing.isTextBg && matchStart < existing.end && matchEnd > existing.start) {
            overlapsWithTextBg = true;
            break;
          }
        }
        if (overlapsWithTextBg) continue;
        
        // ALWAYS check for whole-word matches (the main loop only accepts exact pattern matches at word boundaries)
        // The partialMatch flag is handled by a SEPARATE pass after this loop
        if (!this.isWholeWordMatch(text, match.index, match.index + matchedText.length)) {
          continue;
        }
        
        // Use helper to extract full word and check if blacklisted
        const fullWord = this.extractFullWord(text, match.index, match.index + matchedText.length);
        if (this.isWordBlacklisted(fullWord)) continue;
        
        matches.push({
          start: matchStart,
          end: matchEnd,
          color: (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color
        });
        
        matchCount++;
        if (matches.length > 200) break;
      }
      
      if (matches.length > 200) break;
    }

    // --- Partial Match coloring for pattern chunks ---
    if (this.settings.partialMatch && matches.length < 200) {
      const wordRegex = /\w+/g;
      let match;
      while ((match = wordRegex.exec(text))) {
        const w = match[0];
        const wStart = match.index;
        const wEnd = wStart + w.length;
        
        if (this.isWordBlacklisted(w)) continue;
        
        for (const entry of patternChunk) {
          if (!entry || entry.invalid) continue;
          if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
          if (this.isWordBlacklisted(entry.pattern)) continue;
          
          const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), 'i'));
          if (testRe.test(w)) {
            // Check if this partial match overlaps with any existing match or text+bg
            let overlapsWithExisting = false;
            for (const existingMatch of matches) {
              if ((baseFrom + wStart) < existingMatch.end && (baseFrom + wEnd) > existingMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            for (const textBgMatch of existingMatches) {
              if (textBgMatch.isTextBg && (baseFrom + wStart) < textBgMatch.end && (baseFrom + wEnd) > textBgMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            
            if (!overlapsWithExisting) {
              matches.push({
                start: baseFrom + wStart,
                end: baseFrom + wEnd,
                color: (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color
              });
              if (matches.length > 200) break;
            }
            break;
          }
        }
        
        if (matches.length > 200) break;
        try { if (typeof wordRegex.lastIndex === 'number' && wordRegex.lastIndex === match.index) wordRegex.lastIndex++; } catch (e) {}
      }
    }
    
    return matches;
  }

  // NEW METHOD: Process a chunk of text
  processTextChunk(chunkText, chunkFrom, entries, folderEntry, existingMatches = []) {
    const matches = [];
    
    for (const entry of entries) {
      if (!entry || entry.invalid) continue;
      
      // Fast pre-check on chunk text
      if (entry.fastTest && !entry.fastTest(chunkText)) continue;
      
      const regex = entry.regex;
      if (!regex) continue;
      
      let match;
      let matchCount = 0;
      
      // CRITICAL FIX: Always reset regex state before processing
      try { regex.lastIndex = 0; } catch (e) {}
      
      while ((match = regex.exec(chunkText)) && matchCount < 5) {
        const matchedText = match[0];
        const matchStart = chunkFrom + match.index;
        const matchEnd = chunkFrom + match.index + matchedText.length;
        
        // Skip if overlaps with text+bg entries
        let overlapsWithTextBg = false;
        for (const existing of existingMatches) {
          if (existing.isTextBg && matchStart < existing.end && matchEnd > existing.start) {
            overlapsWithTextBg = true;
            break;
          }
        }
        if (overlapsWithTextBg) continue;
        
        // ALWAYS check for whole-word matches (the main loop only accepts exact pattern matches at word boundaries)
        // The partialMatch flag is handled by a SEPARATE pass after this loop
        if (!this.isWholeWordMatch(chunkText, match.index, match.index + matchedText.length)) {
          continue;
        }
        
        // Use helper to extract full word and check if blacklisted
        const fullWord = this.extractFullWord(chunkText, match.index, match.index + matchedText.length);
        if (this.isWordBlacklisted(fullWord)) continue;
        
        matches.push({
          start: matchStart,
          end: matchEnd,
          color: (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color
        });
        
        matchCount++;
        if (matches.length > 100) break;
      }
      
      if (matches.length > 30) break;
    }

    // --- Partial Match coloring for chunked processing ---
    if (this.settings.partialMatch && matches.length < 100) {
      const wordRegex = /\w+/g;
      let match;
      while ((match = wordRegex.exec(chunkText))) {
        const w = match[0];
        const wStart = match.index;
        const wEnd = wStart + w.length;
        
        if (this.isWordBlacklisted(w)) continue;
        
        for (const entry of entries) {
          if (!entry || entry.invalid) continue;
          if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
          if (this.isWordBlacklisted(entry.pattern)) continue;
          
          const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), 'i'));
          if (testRe.test(w)) {
            // Check if this partial match overlaps with any existing match or text+bg
            let overlapsWithExisting = false;
            for (const existingMatch of matches) {
              if ((chunkFrom + wStart) < existingMatch.end && (chunkFrom + wEnd) > existingMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            for (const textBgMatch of existingMatches) {
              if (textBgMatch.isTextBg && (chunkFrom + wStart) < textBgMatch.end && (chunkFrom + wEnd) > textBgMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            
            if (!overlapsWithExisting) {
              const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
              matches.push({
                start: chunkFrom + wStart,
                end: chunkFrom + wEnd,
                color: useColor
              });
              if (matches.length > 100) break;
            } else {
              // Remove smaller overlapping matches and add the full word instead
              for (let i = matches.length - 1; i >= 0; i--) {
                const m = matches[i];
                if (m.start >= (chunkFrom + wStart) && m.end <= (chunkFrom + wEnd) && (m.end - m.start) < (wEnd - wStart)) {
                  matches.splice(i, 1);
                }
              }
              const useColor = (folderEntry && folderEntry.defaultColor) ? folderEntry.defaultColor : entry.color;
              matches.push({
                start: chunkFrom + wStart,
                end: chunkFrom + wEnd,
                color: useColor
              });
              if (matches.length > 100) break;
            }
            break;
          }
        }
        
        if (matches.length > 100) break;
        try { if (typeof wordRegex.lastIndex === 'number' && wordRegex.lastIndex === match.index) wordRegex.lastIndex++; } catch (e) {}
      }
    }
    
    return matches;
  }

  // NEW METHOD: Apply decorations from collected matches
  applyDecorationsFromMatches(builder, matches, folderEntry) {
    // Separate text+bg entries from regular ones
    const textBgMatches = matches.filter(m => m.isTextBg);
    const regularMatches = matches.filter(m => !m.isTextBg);
    
    // Remove overlapping matches in regular matches
    regularMatches.sort((a, b) => a.start - b.start || b.end - a.end);
    let lastEnd = -Infinity;
    let nonOverlappingRegular = [];
    for (let m of regularMatches) {
      // Skip if overlaps with any text+bg match
      let overlapsWithTextBg = false;
      for (const tbm of textBgMatches) {
        if (m.start < tbm.end && m.end > tbm.start) {
          overlapsWithTextBg = true;
          break;
        }
      }
      if (overlapsWithTextBg) continue;
      
      if (m.start >= lastEnd) {
        nonOverlappingRegular.push(m);
        lastEnd = m.end;
      }
    }
    
    const nonOverlapping = [...textBgMatches, ...nonOverlappingRegular];
    const sorted = nonOverlapping.sort((a, b) => a.start - b.start);
    const limited = sorted.slice(0, 1000);

    // Apply decorations
    const effectiveStyle = (folderEntry && folderEntry.defaultStyle) ? folderEntry.defaultStyle : this.settings.highlightStyle;

    for (const m of limited) {
      let style;
      if (m.isTextBg) {
        // Text+bg entries always use both colors
        const borderStyle = this.generateBorderStyle(m.textColor, m.backgroundColor);
        style = `color: ${m.textColor} !important; background-color: ${this.hexToRgba(m.backgroundColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(this.settings.highlightBorderRadius ?? 8)}px !important; padding-left: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important; padding-right: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important;${(this.settings.enableBoxDecorationBreak ?? true) ? ' box-decoration-break: clone; -webkit-box-decoration-break: clone;' : ''}${borderStyle}`;
      } else {
        if (effectiveStyle === 'none') continue;
        if (effectiveStyle === 'text') {
          style = `color: ${m.color} !important;`;
        } else {
          const borderStyle = this.generateBorderStyle(m.color, m.color);
          style = `background: none !important; background-color: ${this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) ? 0 : (this.settings.highlightBorderRadius ?? 8))}px !important; padding-left: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important; padding-right: ${(this.settings.highlightHorizontalPadding ?? 4)}px !important;${(this.settings.enableBoxDecorationBreak ?? true) ? ' box-decoration-break: clone; -webkit-box-decoration-break: clone;' : ''}${borderStyle}`;
        }
      }
      const deco = Decoration.mark({ attributes: { style } });
      builder.add(m.start, m.end, deco);
    }

    return builder.finish();
  }

  // --- Memory management helpers ---
  async cleanup() {
    try {
      // Clear caches
      try { this._cachedSortedEntries = null; this._cacheDirty = true; } catch (e) {}
      try { this._compiledWordEntries = []; } catch (e) {}

      // Clear timers
      try {
        if (this._refreshTimeout) { clearTimeout(this._refreshTimeout); this._refreshTimeout = null; }
      } catch (e) {}
      try {
        if (this._editorRefreshTimeout) { clearTimeout(this._editorRefreshTimeout); this._editorRefreshTimeout = null; }
      } catch (e) {}

      // Clear large settings arrays safely
      try {
        if (this.settings) {
          if (Array.isArray(this.settings.wordEntries)) this.settings.wordEntries.length = 0;
          if (Array.isArray(this.settings.blacklistWords)) this.settings.blacklistWords.length = 0;
          if (Array.isArray(this.settings.disabledFiles)) this.settings.disabledFiles.length = 0;
          if (Array.isArray(this.settings.excludedFolders)) this.settings.excludedFolders.length = 0;
        }
      } catch (e) {}

      // Stop memory monitor if running
      try { this.stopMemoryMonitor(); } catch (e) {}

      // Disconnect any viewport observers to avoid leaks
      try {
        if (this._viewportObservers && typeof this._viewportObservers.forEach === 'function') {
          this._viewportObservers.forEach((obs, key) => {
            try { obs.disconnect(); } catch (e) {}
          });
          try { this._viewportObservers.clear(); } catch (e) {}
        }
      } catch (e) {}

      // Hint GC if available (may not be in renderer)
      try { if (typeof global !== 'undefined' && typeof global.gc === 'function') global.gc(); } catch (e) {}
    } catch (e) {
      debugError('CLEANUP', 'cleanup error', e);
    }
  }

  // --- Helper: Remove highlights created by this plugin from a root element ---
  clearHighlightsInRoot(rootEl) {
    try {
      if (!rootEl || !rootEl.isConnected) return;
      // Use TreeWalker to find highlight spans and unwrap them
      const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
          return node.classList && node.classList.contains('always-color-text-highlight') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      }, false);
      const toRemove = [];
      let n;
      while (n = walker.nextNode()) {
        toRemove.push(n);
      }
      for (const el of toRemove) {
        try {
          const tn = document.createTextNode(el.textContent);
          el.replaceWith(tn);
        } catch (e) {}
      }
    } catch (e) { debugError('CLEAR', 'clearHighlightsInRoot failed', e); }
  }

  startMemoryMonitor() {
    // DISABLED: Removed memory monitoring to reduce overhead
    // Memory checks happen dynamically in isPerformanceOverloaded()
  }

  stopMemoryMonitor() {
    // DISABLED: Memory monitoring disabled
  }
}

// --- Color Setting Tab Class ---
class ColorSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.debouncedSaveSettings = debounce(this.plugin.saveSettings.bind(this.plugin), 300);
    this._cleanupHandlers = [];
    this._entryRows = new Map();
    // Dynamic handlers and cached suggestions for folder UI
    this._dynamicHandlers = [];
    this._cachedFolderSuggestions = null;
    this._disabledFilesContainer = null;
    this._blacklistWordsContainer = null;
    this._customSwatchesContainer = null;
    // Sorting state for word entries (null, 'last-added', or 'a-z')
    this._wordsSortMode = 'last-added';
    // Sorting state for text & background coloring entries
    this._textBgSortMode = 'last-added';
  }

  // Create a settings row for a single entry and track cleanup
  _createEntryRow(entry, listDiv) {
    try {
      const row = listDiv.createDiv();
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.marginBottom = '8px';

      // Display comma-separated patterns if grouped, otherwise just the pattern
      const displayPatterns = (Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0)
        ? entry.groupedPatterns.join(', ')
        : entry.pattern;

      const textInput = row.createEl('input', { type: 'text', value: displayPatterns });
      textInput.style.flex = '1';
      textInput.style.padding = '6px';
      textInput.style.borderRadius = '4px';
      textInput.style.border = '1px solid var(--background-modifier-border)';
      textInput.style.marginRight = '8px';
      textInput.placeholder = 'pattern, word or comma-separated words (e.g. hello, world, foo)';

      const cp = row.createEl('input', { type: 'color' });
      cp.value = entry.color || '#000000';
      cp.style.width = '30px';
      cp.style.height = '30px';
      cp.style.border = 'none';
      cp.style.borderRadius = '4px';
      cp.style.cursor = 'pointer';

      const regexChk = row.createEl('input', { type: 'checkbox' });
      regexChk.checked = !!entry.isRegex;
      regexChk.title = 'Treat pattern as a JavaScript regular expression';
      regexChk.style.marginLeft = '8px';

      const flagsInput = row.createEl('input', { type: 'text', value: entry.flags || '' });
      flagsInput.placeholder = 'flags (e.g. gi)';
      flagsInput.style.width = '64px';
      flagsInput.style.marginLeft = '8px';
      if (!entry.isRegex) flagsInput.style.display = 'none';

      const del = row.createEl('button', { text: '✕' });
      del.addClass('mod-warning');
      del.style.marginLeft = '8px';
      del.style.padding = '4px 8px';
      del.style.borderRadius = '4px';
      del.style.cursor = 'pointer';

      const textInputHandler = async () => {
        const newPattern = textInput.value.trim();
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx === -1) return;
        if (!newPattern) {
          this.plugin.settings.wordEntries.splice(idx, 1);
        } else if (this.plugin.settings.enableRegexSupport && entry.isRegex && this.plugin.isRegexTooComplex(newPattern)) {
          new Notice(`Pattern too complex: ${newPattern.substring(0, 60)}...`);
          textInput.value = entry.pattern;
          return;
        } else {
          // Parse comma-separated patterns
          const patterns = newPattern.split(',').map(p => p.trim()).filter(p => p.length > 0);
          this.plugin.settings.wordEntries[idx].pattern = patterns[0]; // Keep first pattern as main
          this.plugin.settings.wordEntries[idx].groupedPatterns = patterns.length > 1 ? patterns : null;
        }
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this._refreshEntries();
      };

      const cpHandler = async () => {
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx === -1) return;
        // Validate color before saving
        const newColor = cp.value;
        if (!this.plugin.isValidHexColor(newColor)) {
          new Notice('Invalid color format. Please use the color picker.');
          return;
        }
        this.plugin.settings.wordEntries[idx].color = newColor;
        await this.debouncedSaveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const regexChkHandler = async () => {
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx === -1) return;
        this.plugin.settings.wordEntries[idx].isRegex = regexChk.checked;
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this._refreshEntries();
      };

      const flagsInputHandler = async () => {
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx === -1) return;
        this.plugin.settings.wordEntries[idx].flags = flagsInput.value || '';
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const delHandler = async () => {
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx === -1) return;
        this.plugin.settings.wordEntries.splice(idx, 1);
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        const info = this._entryRows.get(entry);
        if (info) {
          try { info.cleanup(); } catch (e) {}
          this._entryRows.delete(entry);
        }
        this._refreshEntries();
      };

      textInput.addEventListener('change', textInputHandler);
      cp.addEventListener('input', cpHandler);
      regexChk.addEventListener('change', regexChkHandler);
      flagsInput.addEventListener('change', flagsInputHandler);
      del.addEventListener('click', delHandler);

      const cleanup = () => {
        try { textInput.removeEventListener('change', textInputHandler); } catch (e) {}
        try { cp.removeEventListener('input', cpHandler); } catch (e) {}
        try { regexChk.removeEventListener('change', regexChkHandler); } catch (e) {}
        try { flagsInput.removeEventListener('change', flagsInputHandler); } catch (e) {}
        try { del.removeEventListener('click', delHandler); } catch (e) {}
        try { row.remove(); } catch (e) {}
      };

      this._entryRows.set(entry, { row, elements: { textInput, cp, regexChk, flagsInput, del }, cleanup });
      this._cleanupHandlers.push(cleanup);
    } catch (e) { debugError('SETTINGS', '_createEntryRow error', e); }
  }

  _refreshDisabledFiles() {
    try {
      if (!this._disabledFilesContainer) return;
      this._disabledFilesContainer.empty();
      
      if (this.plugin.settings.disabledFiles.length > 0) {
        const h4 = this._disabledFilesContainer.createEl('h5', { text: 'Files with coloring disabled:' });
        h4.style.margin = '-10px 0 8px 0';
        this.plugin.settings.disabledFiles.forEach(filePath => {
          new Setting(this._disabledFilesContainer)
            .setName(filePath)
            .addExtraButton(btn => btn.setIcon('x').setTooltip('Enable for this file').onClick(async () => {
              const index = this.plugin.settings.disabledFiles.indexOf(filePath);
              if (index > -1) {
                this.plugin.settings.disabledFiles.splice(index, 1);
              }
              await this.plugin.saveSettings();
              this._refreshDisabledFiles();
            }));
        });
      } else {
        this._disabledFilesContainer.createEl('p', { text: 'No files currently have coloring disabled.' });
      }
    } catch (e) { debugError('SETTINGS', '_refreshDisabledFiles error', e); }
  }

  _refreshBlacklistWords() {
    try {
      if (!this._blacklistWordsContainer) return;
      this._blacklistWordsContainer.empty();
      
      this.plugin.settings.blacklistWords.forEach((word, i) => {
        const row = this._blacklistWordsContainer.createDiv();
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.marginBottom = '8px';

        const textInput = row.createEl('input', { type: 'text', value: word });
        textInput.style.flex = '1';
        textInput.style.padding = '6px';
        textInput.style.borderRadius = '4px';
        textInput.style.border = '1px solid var(--background-modifier-border)';
        textInput.style.marginRight = '8px';
        
        const textInputHandler = async () => {
          const newWord = textInput.value.trim();
          if (newWord && newWord !== word) {
            this.plugin.settings.blacklistWords[i] = newWord;
            await this.plugin.saveSettings();
            this._refreshBlacklistWords();
          } else if (!newWord) {
            this.plugin.settings.blacklistWords.splice(i, 1);
            await this.plugin.saveSettings();
            this._refreshBlacklistWords();
          }
        };
        textInput.addEventListener('change', textInputHandler);
        this._cleanupHandlers.push(() => textInput.removeEventListener('change', textInputHandler));

        const del = row.createEl('button', { text: '✕' });
        del.addClass('mod-warning');
        del.style.marginLeft = '8px';
        del.style.padding = '4px 8px';
        del.style.borderRadius = '4px';
        del.style.cursor = 'pointer';
        
        const delHandler = async () => {
          this.plugin.settings.blacklistWords.splice(i, 1);
          await this.plugin.saveSettings();
          this._refreshBlacklistWords();
        };
        del.addEventListener('click', delHandler);
        this._cleanupHandlers.push(() => del.removeEventListener('click', delHandler));
      });
    } catch (e) { debugError('SETTINGS', '_refreshBlacklistWords error', e); }
  }

  _refreshCustomSwatches() {
    try {
      if (!this._customSwatchesContainer) return;
      this._customSwatchesContainer.empty();
      
      if (this.plugin.settings.customSwatchesEnabled) {
        new Setting(this._customSwatchesContainer)
          .setName('Replace default swatches')
          .setDesc('If this is on, only your custom colors will show up in the color picker. No default ones!')
          .addToggle(t => t.setValue(this.plugin.settings.replaceDefaultSwatches).onChange(async v => {
            this.plugin.settings.replaceDefaultSwatches = v;
            await this.plugin.saveSettings();
          }));

        this.plugin.settings.customSwatches.forEach((color, i) => {
          new Setting(this._customSwatchesContainer)
            .setName(`Swatch ${i + 1}`)
            .addColorPicker(cp => cp.setValue(color).onChange(async c => {
              this.plugin.settings.customSwatches[i] = c;
              await this.plugin.saveSettings();
            }))
            .addExtraButton(btn => btn.setIcon('trash').setTooltip('Remove swatch').onClick(async () => {
              this.plugin.settings.customSwatches.splice(i, 1);
              await this.plugin.saveSettings();
              this._refreshCustomSwatches();
            }));
        });

        new Setting(this._customSwatchesContainer)
          .addButton(b => b.setButtonText('+ Add color').onClick(async () => {
            this.plugin.settings.customSwatches.push('#000000');
            await this.plugin.saveSettings();
            this._refreshCustomSwatches();
          }));
      }
    } catch (e) { debugError('SETTINGS', '_refreshCustomSwatches error', e); }
  }

  _refreshEntries() {
    try {
      const listDiv = this.containerEl.querySelector('.color-words-list');
      if (!listDiv) return;
      
      // Clear existing rows first
      listDiv.empty();
      
      // Apply sorting based on current sort mode
      const entriesToDisplay = [...this.plugin.settings.wordEntries];
      
      if (this._wordsSortMode === 'a-z') {
        entriesToDisplay.sort((a, b) => {
          // Extract patterns for comparison
          const patternA = (Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0) 
            ? a.groupedPatterns[0] 
            : (a.pattern || '');
          
          const patternB = (Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0) 
            ? b.groupedPatterns[0] 
            : (b.pattern || '');
          
          // Check if patterns contain special characters (expressions)
          const aHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternA);
          const bHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternB);
          
          // Expressions first, then alphabetical
          if (aHasSpecialChars && !bHasSpecialChars) return -1;
          if (!aHasSpecialChars && bHasSpecialChars) return 1;
          
          // Both are same type, sort alphabetically
          return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
        });
      }
      // 'last-added' keeps original array order (newest at bottom)
      
      // Re-create all rows in the correct order
      entriesToDisplay.forEach((entry) => {
        this._createEntryRow(entry, listDiv);
      });
      
      // Clear the map since we recreated all rows
      this._entryRows.clear();
      
      // Re-populate the map with new rows
      entriesToDisplay.forEach((entry) => {
        const rowInfo = this._entryRows.get(entry);
        if (rowInfo) {
          // Row was already created, keep the reference
        } else {
          // This will be populated by _createEntryRow
        }
      });
      
      // mark initialized so subsequent display() calls refresh only entries
      this._initializedSettingsUI = true;
    } catch (e) { 
      debugError('SETTINGS', '_refreshEntries error', e); 
    }
  }

  // Clean up event listeners to prevent leaks
  onClose() {
    try {
      // Force close any open dropdowns and clean up their listeners
      try {
        const allInputs = this.containerEl?.querySelectorAll('input[type="text"]') || [];
        allInputs.forEach(input => {
          if (input._actDropdown) {
            const dd = input._actDropdown;
            if (input._dropdownScrollListener) {
              document.removeEventListener('scroll', input._dropdownScrollListener, true);
              input._dropdownScrollListener = null;
            }
            if (input._dropdownClickListener) {
              document.removeEventListener('click', input._dropdownClickListener);
              input._dropdownClickListener = null;
            }
            if (input._dropdownKeyListener) {
              document.removeEventListener('keydown', input._dropdownKeyListener);
              input._dropdownKeyListener = null;
            }
            dd.remove();
            input._actDropdown = null;
          }
        });
      } catch (e) { debugError('SETTINGS', 'dropdown cleanup error', e); }
      
      // Run standard cleanup handlers
      this._cleanupHandlers?.forEach(cleanup => {
        try { cleanup(); } catch (e) { debugError('SETTINGS', 'cleanup error', e); }
      });
      this._cleanupHandlers = [];
      // Run any dynamic handlers (e.g., dropdown click watchers)
      if (Array.isArray(this._dynamicHandlers)) {
        this._dynamicHandlers.forEach(h => { try { h(); } catch (e) {} });
        this._dynamicHandlers = [];
      }
      // Clear cached UI data
      this._cachedFolderSuggestions = null;
      // Clear DOM content to drop references
      try { this.containerEl?.empty(); } catch (e) {}
    } catch (e) { debugError('SETTINGS', 'onClose error', e); }
  }

  display() {
    const { containerEl } = this;
    // Store reference to containerEl for use in other methods like focusTextBgEntry
    this.containerEl = containerEl;
    // If we've already created the static UI once, only refresh dynamic sections
    if (this._initializedSettingsUI) {
      try { this._refreshEntries(); } catch (e) {}
      return;
    }
    // First-time render: build full UI
    containerEl.empty();
    // Clear any previous cleanup handlers
    this.onClose();
    this._cleanupHandlers = [];

    containerEl.createEl('h1', { text: 'Always Color Text Settings' });
    
    // 1. Enable document color
    new Setting(containerEl)
      .setName('Enable document color')
      .addToggle(t => t.setValue(this.plugin.settings.enabled).onChange(async v => {
        this.plugin.settings.enabled = v;
        await this.debouncedSaveSettings();
      }));

    // Option: disable coloring in reading/preview panes
    new Setting(containerEl)
      .setName('Disable coloring in Reading mode')
      // .setDesc('When ON, coloring will not be applied to reading/preview panes. Editor coloring remains active.')
      .addToggle(t => t.setValue(this.plugin.settings.disableReadingModeColoring).onChange(async v => {
        this.plugin.settings.disableReadingModeColoring = v;
        await this.debouncedSaveSettings();
        // If disabling, immediately clear any existing highlights in all preview roots
        try {
          if (v) {
            this.plugin.app.workspace.iterateAllLeaves(leaf => {
              if (leaf.view instanceof MarkdownView && leaf.view.getMode && leaf.view.getMode() === 'preview') {
                try {
                  const root = (leaf.view.previewMode && leaf.view.previewMode.containerEl) || leaf.view.contentEl || leaf.view.containerEl;
                  if (root) {
                    try { this.plugin.clearHighlightsInRoot(root); } catch (e) {}
                    // disconnect any viewport observer tied to this root
                    try {
                      const obs = this.plugin._viewportObservers && this.plugin._viewportObservers.get && this.plugin._viewportObservers.get(root);
                      if (obs && typeof obs.disconnect === 'function') {
                        try { obs.disconnect(); } catch (e) {}
                        try { this.plugin._viewportObservers.delete(root); } catch (e) {}
                      }
                    } catch (e) {}
                  }
                } catch (e) {}
              }
            });
          } else {
            // Re-enable: force previews to rerender so highlights are applied again
            try { this.plugin.forceRefreshAllReadingViews(); } catch (e) {}
          }
        } catch (e) { debugError('SETTINGS', 'disableReadingModeColoring handler failed', e); }
      }));

    // Opt-in: Force full reading-mode render (dangerous)
    new Setting(containerEl)
      .setName('Force full render in Reading mode')
      .setDesc('When ON, reading-mode will attempt to color the entire document in one pass. May cause performance issues on large documents. Use with caution!')
      .addToggle(t => t.setValue(this.plugin.settings.forceFullRenderInReading).onChange(async v => {
        this.plugin.settings.forceFullRenderInReading = v;
        await this.debouncedSaveSettings();
        // Trigger immediate refresh of reading views so the new mode takes effect
        try { this.plugin.forceRefreshAllReadingViews(); } catch (e) { debugError('SETTINGS', 'forceFullRenderInReading handler failed', e); }
      }));

    // 2. Case sensitive
    new Setting(containerEl)
      .setName('Case sensitive')
      .setDesc('If this is on, "word" and "Word" are treated as different. If it\'s off, they\'re colored the same.')
      .addToggle(t => t.setValue(this.plugin.settings.caseSensitive).onChange(async v => {
        this.plugin.settings.caseSensitive = v;
        await this.debouncedSaveSettings();
      }));

    // Partial match (moved before Color Style)
    new Setting(containerEl)
      .setName('Partial match')
      .setDesc('If enabled, the whole word will be colored if any colored word is found inside it (e.g., "as" colors "Jasper").')
      .addToggle(t => t.setValue(this.plugin.settings.partialMatch).onChange(async v => {
        this.plugin.settings.partialMatch = v;
        await this.debouncedSaveSettings();
      }));

    // --- Global Coloring Appearance ---
    containerEl.createEl('h3', { text: 'Global Coloring Appearance' });

    // 3. Color style (was highlight style)
    new Setting(containerEl)
      .setName('Color style')
      .setDesc('Do you want to color the text itself or the background behind it?')
      .addDropdown(d => d
        .addOption('text', 'Text color')
        .addOption('background', 'Background highlight')
        .addOption('none', 'None')
        .setValue(this.plugin.settings.highlightStyle)
        .onChange(async v => {
          this.plugin.settings.highlightStyle = v;
          await this.debouncedSaveSettings();
          this.display();
        }));

    // --- Background opacity and border radius (only if background) ---
    if (this.plugin.settings.highlightStyle === 'background') {
      // Opacity slider (percent)
      new Setting(containerEl)
        .setName('Background opacity')
        .setDesc('Set the opacity of the background highlight (0-100%)')
        .addSlider(slider => slider
          .setLimits(0, 100, 1)
          .setValue(this.plugin.settings.backgroundOpacity ?? 25)
          .setDynamicTooltip()
          .onChange(async v => {
            this.plugin.settings.backgroundOpacity = v;
            await this.debouncedSaveSettings();
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

      // Toggle for box decoration break on line wrapping
      new Setting(containerEl)
        .setName('Rounded corners on line wrapping')
        .setDesc('When enabled, highlights will have rounded corners on all sides, even when text wraps to a new line. When disabled, only the outer edges will be rounded.')
        .addToggle(t => t
          .setValue(this.plugin.settings.enableBoxDecorationBreak ?? true)
          .onChange(async v => {
            this.plugin.settings.enableBoxDecorationBreak = v;
            await this.debouncedSaveSettings();
          }));

      // NEW: Enable Background Highlight Border toggle
      new Setting(containerEl)
        .setName('Enable Background Highlight Border')
        .setDesc('Add a border around background highlights. The border will match the text or background color.')
        .addToggle(t => t
          .setValue(this.plugin.settings.enableBorderThickness ?? false)
          .onChange(async v => {
            this.plugin.settings.enableBorderThickness = v;
            await this.plugin.saveSettings();
            // Force full re-render to show/hide border settings
            this._initializedSettingsUI = false;
            this.display();
          }));

      // Show border controls only when enabled
      if (this.plugin.settings.enableBorderThickness) {
        // Border Style dropdown
        new Setting(containerEl)
          .setName('Border Style')
          .setDesc('Choose which sides to apply the border')
          .addDropdown(d => d
            .addOption('full', 'Full border (all sides)')
            .addOption('top-bottom', 'Top & Bottom borders')
            .addOption('left-right', 'Left & Right borders')
            .addOption('top', 'Top border only')
            .addOption('bottom', 'Bottom border only')
            .addOption('left', 'Left border only')
            .addOption('right', 'Right border only')
            .setValue(this.plugin.settings.borderStyle ?? 'full')
            .onChange(async v => {
              this.plugin.settings.borderStyle = v;
              await this.debouncedSaveSettings();
            }));

        // Border Opacity slider
        new Setting(containerEl)
          .setName('Border Opacity')
          .setDesc('Set the opacity of the border (0-100%)')
          .addSlider(slider => slider
            .setLimits(0, 100, 1)
            .setValue(this.plugin.settings.borderOpacity ?? 100)
            .setDynamicTooltip()
            .onChange(async v => {
              this.plugin.settings.borderOpacity = v;
              await this.debouncedSaveSettings();
            }));

        // Border Thickness input
        new Setting(containerEl)
          .setName('Border Thickness (px)')
          .setDesc('Set the border thickness from 0-5 pixels (e.g. 1, 2.5, 5)')
          .addText(text => text
            .setPlaceholder('e.g. 1, 2.5, 3.7')
            .setValue(String(this.plugin.settings.borderThickness ?? 1))
            .onChange(async v => {
              let val = parseFloat(v);
              if (isNaN(val) || val < 0) val = 0;
              if (val > 5) val = 5;
              this.plugin.settings.borderThickness = val;
              await this.debouncedSaveSettings();
            }))
          .addExtraButton(btn => btn
            .setIcon('reset')
            .setTooltip('Reset to 1')
            .onClick(async () => {
              this.plugin.settings.borderThickness = 1;
              await this.debouncedSaveSettings();
              this.display();
            }));
      }
    }

    // --- Quick Actions (One-time coloring/highlighting) ---
    containerEl.createEl('h2', { text: 'Quick Actions' });

    // Color Once
    new Setting(containerEl)
      .setName('Enable Color Once')
      .setDesc('This adds "Color once" to your right-click menu. You can color selected text with a single tap.')
      .addToggle(t => t.setValue(this.plugin.settings.enableAlwaysColor).onChange(async v => {
        this.plugin.settings.enableAlwaysColor = v;
        await this.debouncedSaveSettings();
      }));

    // Highlight Once
    new Setting(containerEl)
      .setName('Enable Highlight Once')
      .setDesc('This adds "Highlight once" to your right-click menu. You can highlight selected text with a background color.')
      .addToggle(t => t.setValue(this.plugin.settings.enableAlwaysHighlight).onChange(async v => {
        this.plugin.settings.enableAlwaysHighlight = v;
        await this.debouncedSaveSettings();
      }));

    // --- Custom swatches settings ---
    containerEl.createEl('h2', { text: 'Color Swatches' });

    new Setting(containerEl)
      .setName('Enable custom swatches')
      .setDesc('Turn this on if you want to pick your own colors for the color picker.')
      .addToggle(t => t.setValue(this.plugin.settings.customSwatchesEnabled).onChange(async v => {
        this.plugin.settings.customSwatchesEnabled = v;
        await this.plugin.saveSettings();
        this._refreshCustomSwatches();
      }));

    // Store reference and render custom swatches
    this._customSwatchesContainer = containerEl.createDiv();
    this._refreshCustomSwatches();

    // --- Defined colored words / patterns ---
    containerEl.createEl('h3', { text: 'Defined colored words' });
    containerEl.createEl('p', { text: 'Here\'s where you manage your words/patterns and their colors. Changes here update your notes instantly!' });
    new Setting(containerEl);

    const listDiv = containerEl.createDiv();
    listDiv.addClass('color-words-list');
    // Populate initial entries list via shared refresh helper
    try { this._refreshEntries(); } catch (e) {}

    // Create a custom button row with sort and add buttons side by side
    const buttonRowDiv = containerEl.createDiv();
    buttonRowDiv.style.display = 'flex';
    buttonRowDiv.style.gap = '8px';
    buttonRowDiv.style.marginBottom = '16px';
    buttonRowDiv.style.marginTop = '14px';

    // Sort button (left side)
    const sortBtn = buttonRowDiv.createEl('button');
    sortBtn.textContent = this._wordsSortMode === 'a-z' ? 'Sort: A-Z' : 'Sort: Last Added';
    sortBtn.style.cursor = 'pointer';
    sortBtn.style.flex = '0 0 auto';
    const sortBtnHandler = async () => {
      // Toggle between sort modes
      this._wordsSortMode = this._wordsSortMode === 'a-z' ? 'last-added' : 'a-z';
      sortBtn.textContent = this._wordsSortMode === 'a-z' ? 'Sort: A-Z' : 'Sort: Last Added';
      this._refreshEntries();
    };
    sortBtn.addEventListener('click', sortBtnHandler);
    this._cleanupHandlers.push(() => sortBtn.removeEventListener('click', sortBtnHandler));

    // Add button (right side, takes remaining space)
    const addBtn = buttonRowDiv.createEl('button');
    addBtn.textContent = '+ Add new word / pattern';
    addBtn.style.cursor = 'pointer';
    addBtn.style.flex = '1';
    addBtn.addClass('mod-cta');
    const addBtnHandler = async () => {
      this.plugin.settings.wordEntries.push({ pattern: '', color: '#000000', isRegex: false, flags: '', groupedPatterns: null });
      await this.plugin.saveSettings();
      this.plugin.reconfigureEditorExtensions();
      this.plugin.forceRefreshAllEditors();
      this._refreshEntries();
    };
    addBtn.addEventListener('click', addBtnHandler);
    this._cleanupHandlers.push(() => addBtn.removeEventListener('click', addBtnHandler));

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
            this._refreshEntries();
          }).open();
        }));

    // --- Text & Background Coloring ---
    const textBgHeading = containerEl.createEl('h3', { text: 'Text & Background Coloring' });
    textBgHeading.style.marginTop = '8px';
    containerEl.createEl('p', { text: 'Keywords here will always use both text color and background color, ignoring folder style.' });

    // Toggle for enabling/disabling Text & Background Coloring in right-click menu
    new Setting(containerEl)
      .setName('Show Text & Background Coloring in right-click menu')
      .setDesc('Enable or disable the "Text & Background Color" option in the editor right-click menu')
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.enableTextBgMenu ?? true)
          .onChange(async (value) => {
            this.plugin.settings.enableTextBgMenu = value;
            await this.plugin.saveSettings();
          });
      });

    // Native divider (creates a visual separator like other settings sections)
    new Setting(containerEl);

    const textBgListDiv = containerEl.createDiv();
    textBgListDiv.addClass('text-bg-coloring-list');

    // Reference to the empty state paragraph for dynamic removal
    let textBgEmptyStateP = null;

    // Initialize textBgColoringEntries if not present in settings
    if (!Array.isArray(this.plugin.settings.textBgColoringEntries)) {
      this.plugin.settings.textBgColoringEntries = [];
    }

    const createTextBgRow = (entry) => {
      const row = textBgListDiv.createDiv();
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.marginBottom = '8px';
      row.style.gap = '8px';

      // Display comma-separated patterns if grouped, otherwise just the pattern
      const displayPatterns = (Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0)
        ? entry.groupedPatterns.join(', ')
        : entry.pattern;

      const textInput = row.createEl('input', { type: 'text', value: displayPatterns || '' });
      textInput.placeholder = 'Keyword or pattern, or comma-separated words (e.g. hello, world)';
      textInput.style.flex = '1';
      textInput.style.padding = '6px';
      textInput.style.borderRadius = '4px';
      textInput.style.border = '1px solid var(--background-modifier-border)';

      const regexChk = row.createEl('input', { type: 'checkbox' });
      regexChk.checked = !!entry.isRegex;
      regexChk.title = 'Treat pattern as a JavaScript regular expression';
      regexChk.style.cursor = 'pointer';

      const flagsInput = row.createEl('input', { type: 'text', value: entry.flags || '' });
      flagsInput.placeholder = 'flags';
      flagsInput.style.width = '50px';
      flagsInput.style.padding = '6px';
      flagsInput.style.borderRadius = '4px';
      flagsInput.style.border = '1px solid var(--background-modifier-border)';
      if (!entry.isRegex) flagsInput.style.display = 'none';

      const textColorPicker = row.createEl('input', { type: 'color' });
      textColorPicker.value = entry.textColor || '#000000';
      textColorPicker.style.width = '30px';
      textColorPicker.style.height = '30px';
      textColorPicker.style.border = 'none';
      textColorPicker.style.borderRadius = '4px';
      textColorPicker.style.cursor = 'pointer';
      textColorPicker.title = 'Text color';

      const bgColorPicker = row.createEl('input', { type: 'color' });
      bgColorPicker.value = entry.backgroundColor || '#FFFF00';
      bgColorPicker.style.width = '30px';
      bgColorPicker.style.height = '30px';
      bgColorPicker.style.border = 'none';
      bgColorPicker.style.borderRadius = '4px';
      bgColorPicker.style.cursor = 'pointer';
      bgColorPicker.title = 'Background color';

      const del = row.createEl('button', { text: '✕' });
      del.addClass('mod-warning');
      del.style.padding = '4px 8px';
      del.style.borderRadius = '4px';
      del.style.cursor = 'pointer';

      const textInputHandler = async () => {
        const entryIdx = this.plugin.settings.textBgColoringEntries.indexOf(entry);
        if (entryIdx === -1) return; // Entry was removed
        const newPattern = textInput.value.trim();
        if (!newPattern) {
          this.plugin.settings.textBgColoringEntries.splice(entryIdx, 1);
        } else if (this.plugin.settings.enableRegexSupport && entry.isRegex && this.plugin.isRegexTooComplex(newPattern)) {
          new Notice(`Pattern too complex: ${newPattern.substring(0, 60)}...`);
          textInput.value = displayPatterns;
          return;
        } else {
          // Parse comma-separated patterns
          const patterns = newPattern.split(',').map(p => p.trim()).filter(p => p.length > 0);
          this.plugin.settings.textBgColoringEntries[entryIdx].pattern = patterns[0]; // Keep first pattern as main
          this.plugin.settings.textBgColoringEntries[entryIdx].groupedPatterns = patterns.length > 1 ? patterns : null;
        }
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const textColorHandler = async () => {
        const entryIdx = this.plugin.settings.textBgColoringEntries.indexOf(entry);
        if (entryIdx === -1) return; // Entry was removed
        const newColor = textColorPicker.value;
        if (!this.plugin.isValidHexColor(newColor)) {
          new Notice('Invalid color format.');
          return;
        }
        this.plugin.settings.textBgColoringEntries[entryIdx].textColor = newColor;
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const bgColorHandler = async () => {
        const entryIdx = this.plugin.settings.textBgColoringEntries.indexOf(entry);
        if (entryIdx === -1) return; // Entry was removed
        const newColor = bgColorPicker.value;
        if (!this.plugin.isValidHexColor(newColor)) {
          new Notice('Invalid color format.');
          return;
        }
        this.plugin.settings.textBgColoringEntries[entryIdx].backgroundColor = newColor;
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const regexChkHandler = async () => {
        const entryIdx = this.plugin.settings.textBgColoringEntries.indexOf(entry);
        if (entryIdx === -1) return; // Entry was removed
        this.plugin.settings.textBgColoringEntries[entryIdx].isRegex = regexChk.checked;
        flagsInput.style.display = regexChk.checked ? 'inline-block' : 'none';
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const flagsInputHandler = async () => {
        const entryIdx = this.plugin.settings.textBgColoringEntries.indexOf(entry);
        if (entryIdx === -1) return; // Entry was removed
        this.plugin.settings.textBgColoringEntries[entryIdx].flags = flagsInput.value || '';
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };

      const delHandler = async () => {
        const entryIdx = this.plugin.settings.textBgColoringEntries.indexOf(entry);
        if (entryIdx === -1) return; // Entry was already removed
        this.plugin.settings.textBgColoringEntries.splice(entryIdx, 1);
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        row.remove();
      };

      textInput.addEventListener('change', textInputHandler);
      regexChk.addEventListener('change', regexChkHandler);
      flagsInput.addEventListener('change', flagsInputHandler);
      textColorPicker.addEventListener('input', textColorHandler);
      bgColorPicker.addEventListener('input', bgColorHandler);
      del.addEventListener('click', delHandler);

      this._cleanupHandlers.push(() => {
        textInput.removeEventListener('change', textInputHandler);
        regexChk.removeEventListener('change', regexChkHandler);
        flagsInput.removeEventListener('change', flagsInputHandler);
        textColorPicker.removeEventListener('input', textColorHandler);
        bgColorPicker.removeEventListener('input', bgColorHandler);
        del.removeEventListener('click', delHandler);
      });
    };

    // Render existing rows
    if (this.plugin.settings.textBgColoringEntries.length > 0) {
      this.plugin.settings.textBgColoringEntries.forEach((entry, i) => {
        createTextBgRow(entry);
      });
    }

    // Create button row with sort and add buttons
    const textBgButtonRowDiv = containerEl.createDiv();
    textBgButtonRowDiv.style.display = 'flex';
    textBgButtonRowDiv.style.gap = '8px';
    textBgButtonRowDiv.style.marginBottom = '16px';
    textBgButtonRowDiv.style.marginTop = '8px';

    // Sort button
    const textBgSortBtn = textBgButtonRowDiv.createEl('button');
    textBgSortBtn.textContent = this._textBgSortMode === 'a-z' ? 'Sort: A-Z' : 'Sort: Last Added';
    textBgSortBtn.style.cursor = 'pointer';
    textBgSortBtn.style.flex = '0 0 auto';
    
    const textBgSortHandler = async () => {
      this._textBgSortMode = this._textBgSortMode === 'a-z' ? 'last-added' : 'a-z';
      textBgSortBtn.textContent = this._textBgSortMode === 'a-z' ? 'Sort: A-Z' : 'Sort: Last Added';
      // Re-render rows with new sort order
      textBgListDiv.empty();
      const entriesToDisplay = [...this.plugin.settings.textBgColoringEntries];
      if (this._textBgSortMode === 'a-z') {
        entriesToDisplay.sort((a, b) => (a.pattern || '').toLowerCase().localeCompare((b.pattern || '').toLowerCase()));
      }
      entriesToDisplay.forEach((entry, i) => {
        createTextBgRow(entry);
      });
    };
    textBgSortBtn.addEventListener('click', textBgSortHandler);
    this._cleanupHandlers.push(() => textBgSortBtn.removeEventListener('click', textBgSortHandler));

    // Add button
    const textBgAddBtn = textBgButtonRowDiv.createEl('button');
    textBgAddBtn.textContent = '+ Add new word / pattern';
    textBgAddBtn.style.cursor = 'pointer';
    textBgAddBtn.style.flex = '1';
    textBgAddBtn.addClass('mod-cta');
    
    const textBgAddHandler = async () => {
      if (textBgEmptyStateP) {
        textBgEmptyStateP.remove();
        textBgEmptyStateP = null;
      }
      
      const newEntry = { pattern: '', textColor: '#000000', backgroundColor: '#FFFF00', isRegex: false, flags: '', groupedPatterns: null };
      this.plugin.settings.textBgColoringEntries.push(newEntry);
      await this.plugin.saveSettings();
      createTextBgRow(newEntry);
    };
    textBgAddBtn.addEventListener('click', textBgAddHandler);
    this._cleanupHandlers.push(() => textBgAddBtn.removeEventListener('click', textBgAddHandler));

    new Setting(containerEl)
      .addExtraButton(b => b
        .setIcon('trash')
        .setTooltip('Delete all text & background coloring entries')
        .onClick(async () => {
          new ConfirmationModal(this.app, 'Delete all text & background colors', 'Are you sure you want to delete all your text & background coloring entries? You can\'t undo this!', async () => {
            this.plugin.settings.textBgColoringEntries = [];
            await this.plugin.saveSettings();
            this.plugin.compileTextBgColoringEntries();
            this.plugin.forceRefreshAllEditors();
            this._initializedSettingsUI = false;
            this.display();
          }).open();
        }));

    // Divider before Blacklist section
    new Setting(containerEl);

    // Blacklist words
    containerEl.createEl('h2', { text: 'Blacklist words' });
    containerEl.createEl('p', { text: 'Words in this list will never be colored, even if they match (including partial matches).' });

    // Store reference to blacklist words container for updating
    this._blacklistWordsContainer = containerEl.createDiv();
    this._blacklistWordsContainer.addClass('blacklist-words-list');
    this._refreshBlacklistWords();

    new Setting(containerEl)
      .addButton(b => b.setButtonText('+ Add blacklist word').onClick(async () => {
        this.plugin.settings.blacklistWords.push('');
        await this.plugin.saveSettings();
        this._refreshBlacklistWords();
      }));

    new Setting(containerEl)
      .setName('Enable "Blacklist words from coloring" in right-click menu')
      .setDesc('Adds a right-click menu item to blacklist selected text from coloring.')
      .addToggle(t => t.setValue(this.plugin.settings.enableBlacklistMenu).onChange(async v => {
        this.plugin.settings.enableBlacklistMenu = v;
        await this.plugin.saveSettings();
      }));

  // Folder-specific settings
    containerEl.createEl('h3', { text: 'Folder-Specific Coloring' });

  // Folder list (always show)
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

      const textInput = row.createEl('input', { type: 'text', value: entry.path });
      textInput.style.flex = '1';
      textInput.style.padding = '6px';
      textInput.style.borderRadius = '4px';
      textInput.style.border = '1px solid var(--background-modifier-border)';
      textInput.style.marginRight = '8px';
      
      // Helper function to create and update the dropdown
      const updateDropdown = () => {
        // remove existing dropdown and clean up its listeners
        if (textInput._actDropdown) {
          const dd = textInput._actDropdown;
          // Clean up any listeners attached to this dropdown
          if (textInput._dropdownScrollListener) {
            document.removeEventListener('scroll', textInput._dropdownScrollListener, true);
            textInput._dropdownScrollListener = null;
          }
          if (textInput._dropdownClickListener) {
            document.removeEventListener('click', textInput._dropdownClickListener);
            textInput._dropdownClickListener = null;
          }
          dd.remove();
          textInput._actDropdown = null;
        }

        const allSuggestions = populateFolderSuggestions();
        const inputValue = textInput.value.trim().toLowerCase();
        
        // Filter suggestions based on input value
        const suggestions = inputValue === '' 
          ? allSuggestions 
          : allSuggestions.filter(folder => folder.toLowerCase().includes(inputValue));

        if (suggestions.length === 0) {
          return; // Don't show dropdown if no matches
        }

        const dd = document.createElement('div');
        dd.className = 'act-folder-dropdown';
        Object.assign(dd.style, {
          position: 'fixed',
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

        // Track highlighted item for keyboard navigation
        let highlightedIndex = -1;
        
        const buildItem = (folder) => {
          const item = document.createElement('div');
          item.className = 'act-folder-item';
          item.textContent = folder === '' ? '/' : folder;
          Object.assign(item.style, {
            padding: '8px 12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          });
          item.onmouseenter = () => {
            // Unhighlight previous item
            if (highlightedIndex >= 0) {
              dd.children[highlightedIndex].style.background = 'transparent';
            }
            // Highlight this item
            item.style.background = 'var(--background-secondary)';
            highlightedIndex = Array.from(dd.children).indexOf(item);
          };
          item.onmouseleave = () => item.style.background = 'transparent';
          item.onclick = async (e) => {
            e.stopPropagation();
            textInput.value = folder;
            const ev = new Event('change', { bubbles: true });
            textInput.dispatchEvent(ev);
            dd.remove();
            textInput._actDropdown = null;
            textInput._dropdownKeyListener = null;
            document.removeEventListener('scroll', updateDropdownPosition, true);
          };
          return item;
        };

        suggestions.forEach(s => dd.appendChild(buildItem(s)));

        document.body.appendChild(dd);
        
        // Function to position dropdown
        const updateDropdownPosition = () => {
          const rect = textInput.getBoundingClientRect();
          dd.style.left = rect.left + 'px';
          dd.style.top = (rect.bottom + 6) + 'px';
          dd.style.width = textInput.offsetWidth + 'px';
        };
        
        updateDropdownPosition();

        textInput._actDropdown = dd;
        
        // Store listeners so they can be cleaned up later
        textInput._dropdownScrollListener = updateDropdownPosition;
        textInput._dropdownClickListener = (ev) => {
          if (ev.target === textInput) return;
          if (!dd.contains(ev.target)) {
            dd.remove();
            textInput._actDropdown = null;
            document.removeEventListener('click', textInput._dropdownClickListener);
            document.removeEventListener('scroll', textInput._dropdownScrollListener, true);
            document.removeEventListener('keydown', textInput._dropdownKeyListener);
            textInput._dropdownClickListener = null;
            textInput._dropdownScrollListener = null;
            textInput._dropdownKeyListener = null;
          }
        };
        
        // Update position on scroll
        document.addEventListener('scroll', updateDropdownPosition, true);
        document.addEventListener('click', textInput._dropdownClickListener);
        
        // Keyboard navigation for dropdown (up/down arrow keys)
        textInput._dropdownKeyListener = (ev) => {
          if (!textInput._actDropdown || !textInput._actDropdown.isConnected) return;
          
          const items = Array.from(dd.children);
          if (items.length === 0) return;
          
          if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
            // Unhighlight all
            items.forEach(item => item.style.background = 'transparent');
            // Highlight new item
            if (highlightedIndex >= 0) {
              items[highlightedIndex].style.background = 'var(--background-secondary)';
              items[highlightedIndex].scrollIntoView({ block: 'nearest' });
            }
          } else if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            highlightedIndex = Math.max(highlightedIndex - 1, -1);
            // Unhighlight all
            items.forEach(item => item.style.background = 'transparent');
            // Highlight new item if available
            if (highlightedIndex >= 0) {
              items[highlightedIndex].style.background = 'var(--background-secondary)';
              items[highlightedIndex].scrollIntoView({ block: 'nearest' });
            }
          } else if (ev.key === 'Enter' && highlightedIndex >= 0) {
            ev.preventDefault();
            // Simulate click on highlighted item
            items[highlightedIndex].click();
          } else if (ev.key === 'Escape') {
            ev.preventDefault();
            // Close dropdown
            dd.remove();
            textInput._actDropdown = null;
            document.removeEventListener('keydown', textInput._dropdownKeyListener);
            textInput._dropdownKeyListener = null;
          }
        };
        document.addEventListener('keydown', textInput._dropdownKeyListener);
        
        // Add cleanup handlers for dropdown listeners to prevent DOM leaks
        this._cleanupHandlers.push(() => {
          try { document.removeEventListener('scroll', updateDropdownPosition, true); } catch (e) {}
          try { document.removeEventListener('click', textInput._dropdownClickListener); } catch (e) {}
          try { document.removeEventListener('keydown', textInput._dropdownKeyListener); } catch (e) {}
          if (textInput._actDropdown) {
            try { textInput._actDropdown.remove(); } catch (e) {}
            textInput._actDropdown = null;
          }
        });
      };

      // Show dropdown on focus with all suggestions
      const focusHandler = () => {
        updateDropdown();
      };
      textInput.addEventListener('focus', focusHandler);
      this._cleanupHandlers.push(() => textInput.removeEventListener('focus', focusHandler));
      
      // Update dropdown as user types
      const inputHandler = () => {
        updateDropdown();
      };
      textInput.addEventListener('input', inputHandler);
      this._cleanupHandlers.push(() => textInput.removeEventListener('input', inputHandler));
      
      const textChangeHandler = async () => {
        const newPath = textInput.value.trim();
        if (!newPath) {
          this.plugin.settings.excludedFolders.splice(idx, 1);
        } else {
          this.plugin.settings.excludedFolders[idx].path = newPath.replace(/\\\\/g, '/');
        }
        await this.debouncedSaveSettings();
        this.display();
      };
      textInput.addEventListener('change', textChangeHandler);
      this._cleanupHandlers.push(() => textInput.removeEventListener('change', textChangeHandler));

    // Folder color style dropdown
    const styleSelect = row.createEl('select');
    styleSelect.style.marginRight = '8px';
    styleSelect.style.height = '30px';
    styleSelect.style.flex = '0 0 180px';
    styleSelect.style.minWidth = '140px';
    styleSelect.style.maxWidth = '320px';
    styleSelect.style.boxSizing = 'border-box';
    styleSelect.innerHTML = `<option value="">(use global)</option><option value="text">Text color</option><option value="background">Background highlight</option><option value="none">None</option>`;
      styleSelect.value = entry.defaultStyle || '';
      
      const styleChangeHandler = async () => {
        this.plugin.settings.excludedFolders[idx].defaultStyle = styleSelect.value || null;
        await this.debouncedSaveSettings();
        this.display();
      };
      styleSelect.addEventListener('change', styleChangeHandler);
      this._cleanupHandlers.push(() => styleSelect.removeEventListener('change', styleChangeHandler));

      const del = row.createEl('button', { text: '✕' });
      del.addClass('mod-warning');
      del.style.marginLeft = '8px';
      del.style.padding = '4px 8px';
      del.style.borderRadius = '4px';
      del.style.cursor = 'pointer';
      
      const delHandler = async () => {
        // Find the entry in the settings array and remove it
        const entryIndex = this.plugin.settings.excludedFolders.indexOf(entry);
        if (entryIndex !== -1) {
          this.plugin.settings.excludedFolders.splice(entryIndex, 1);
          await this.plugin.saveSettings();
        }
        // Remove the row from the DOM
        row.remove();
        
        // If no folders left, show the empty state message
        if (this.plugin.settings.excludedFolders.length === 0) {
          emptyStateP = folderListDiv.createEl('p', { text: 'No folder exclusions configured.' });
          emptyStateP.style.marginBottom = '8px';
        }
      };
      del.addEventListener('click', delHandler);
      this._cleanupHandlers.push(() => del.removeEventListener('click', delHandler));
    };

    // Reference to the empty state paragraph for dynamic removal
    let emptyStateP = null;

    // Render existing rows
    if (this.plugin.settings.excludedFolders.length > 0) {
      this.plugin.settings.excludedFolders.forEach((entry, i) => {
        createFolderRow(entry, i);
      });
    } else {
      emptyStateP = folderListDiv.createEl('p', { text: 'No folder exclusions configured.' });
      emptyStateP.style.marginBottom = '8px';
    }

    // [ Add folder ] button
    new Setting(containerEl)
      .addButton(b => b.setButtonText('+ Add folder').onClick(async () => {
        // Remove empty state if it exists
        if (emptyStateP) {
          emptyStateP.remove();
          emptyStateP = null;
        }
        
        // Add new entry to settings
        const newEntry = { path: '', excluded: false, defaultColor: null, defaultStyle: null };
        this.plugin.settings.excludedFolders.push(newEntry);
        
        // Create the row in the DOM immediately without full re-render
        const idx = this.plugin.settings.excludedFolders.length - 1;
        createFolderRow(newEntry, idx);
        
        // Save settings
        await this.plugin.saveSettings();
      }));

    // --- File-specific options ---
    const fileOptHeading = containerEl.createEl('h3', { text: 'File-specific options' });
    fileOptHeading.style.marginTop = '38px';
    containerEl.createEl('p', { text: 'Here\'s where you manage files where coloring is taking a break.' });
    new Setting(containerEl);

    // Store reference to disabled files container for updating
    this._disabledFilesContainer = containerEl.createDiv();
    this._refreshDisabledFiles();

    new Setting(containerEl)
      .setName('Disable coloring for current file')
      .setDesc('Click this to turn off coloring just for the note you\'re looking at right now.')
      .addButton(b => b.setButtonText('Disable for this file').onClick(async () => {
        const md = this.app.workspace.getActiveFile();
        if (md && !this.plugin.settings.disabledFiles.includes(md.path)) {
          this.plugin.settings.disabledFiles.push(md.path);
          await this.plugin.saveSettings();
          new Notice(`Coloring disabled for ${md.path}`);
          this._refreshDisabledFiles();
        } else if (md && this.plugin.settings.disabledFiles.includes(md.path)) {
          new Notice(`Coloring is already disabled for ${md.path}`);
        } else {
          new Notice('No active file to disable coloring for.');
        }
      }));


    // --- Toggle visibility ---
    containerEl.createEl('h3', { text: 'Toggle visibility' });
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

  // Method to focus and/or create a text & background coloring entry with pre-filled text
  async focusTextBgEntry(selectedText) {
    try {
      if (!selectedText || !this.containerEl) return;
      
      // Find the text input for this entry, or create a new one
      let foundEntry = this.plugin.settings.textBgColoringEntries.find(e => 
        e && (e.pattern === selectedText || (Array.isArray(e.groupedPatterns) && e.groupedPatterns.includes(selectedText)))
      );
      
      let isNewEntry = false;
      // If entry doesn't exist, create it
      if (!foundEntry) {
        isNewEntry = true;
        foundEntry = {
          pattern: selectedText,
          textColor: '#000000',
          backgroundColor: '#FFFF00',
          isRegex: false,
          flags: '',
          groupedPatterns: null
        };
        this.plugin.settings.textBgColoringEntries.push(foundEntry);
        // Need to recompile entries when a new one is added
        this.plugin.compileTextBgColoringEntries();
        // Save the settings
        await this.plugin.saveSettings();
        
        // Force a full re-render by clearing the initialization flag
        this._initializedSettingsUI = false;
        this.display();
      }
      
      // Scroll to the text & background coloring section after a delay to let DOM update
      setTimeout(() => {
        const textBgListDiv = this.containerEl.querySelector('.text-bg-coloring-list');
        if (textBgListDiv) {
          textBgListDiv.scrollIntoView({ behavior: 'auto', block: 'center' });
          
          // Find and focus the text input for this entry
          setTimeout(() => {
            const inputs = textBgListDiv.querySelectorAll('input[type="text"]');
            for (const input of inputs) {
              if (input.value.includes(selectedText)) {
                input.focus();
                input.select();
                // Add visual focus highlight with accent color border
                input.style.borderColor = 'var(--color-accent)';
                input.style.boxShadow = '0 0 0 2px var(--color-accent-1)';
                input.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
                
                // Remove the highlight after 3 seconds
                setTimeout(() => {
                  input.style.borderColor = 'var(--background-modifier-border)';
                  input.style.boxShadow = 'none';
                }, 3000);
                break;
              }
            }
          }, 300); // Wait for scroll to complete
        }
      }, isNewEntry ? 500 : 100); // Wait longer if we just re-rendered the display
    } catch (e) {
      debugError('FOCUS_TEXTBG', 'Failed to focus text bg entry', e);
    }
  }
}

// --- Color Picker Modal Class ---
class ColorPickerModal extends Modal {
  constructor(app, plugin, callback) {
    super(app);
    this.plugin = plugin;
    this.callback = callback;
    this._eventListeners = []; // Track event listeners for cleanup
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this._eventListeners = []; // Reset listeners

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

    // Handle picker change with tracked listener
    const pickerChangeHandler = () => {
      hexInput.value = picker.value;
      this.callback(picker.value);
      this.plugin.forceRefreshAllEditors();
      this.close();
    };
    picker.addEventListener('change', pickerChangeHandler);
    this._eventListeners.push({ el: picker, event: 'change', handler: pickerChangeHandler });

    // Handle hex input change with tracked listener
    const hexInputChangeHandler = () => {
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
    hexInput.addEventListener('change', hexInputChangeHandler);
    this._eventListeners.push({ el: hexInput, event: 'change', handler: hexInputChangeHandler });

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
      
      // Track mouseover listener
      const mouseoverHandler = () => btn.style.transform = 'scale(1.05)';
      btn.addEventListener('mouseover', mouseoverHandler);
      this._eventListeners.push({ el: btn, event: 'mouseover', handler: mouseoverHandler });
      
      // Track mouseout listener
      const mouseoutHandler = () => btn.style.transform = 'scale(1)';
      btn.addEventListener('mouseout', mouseoutHandler);
      this._eventListeners.push({ el: btn, event: 'mouseout', handler: mouseoutHandler });
      
      // Track click listener
      const clickHandler = () => {
        this.callback(c);
        this.close();
      };
      btn.addEventListener('click', clickHandler);
      this._eventListeners.push({ el: btn, event: 'click', handler: clickHandler });
    });
  }

  onClose() {
    // Properly clean up all event listeners before emptying
    this._eventListeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    this._eventListeners = [];
    
    // Now empty the content
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
    this._eventListeners = []; // Track event listeners for cleanup
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this._eventListeners = []; // Reset listeners
    
    const h2 = contentEl.createEl('h2', { text: this.title });
    h2.style.marginTop = '0'; // Remove top margin
    contentEl.createEl('p', { text: this.message });

    const buttonDiv = contentEl.createDiv();
    buttonDiv.style.display = 'flex';
    buttonDiv.style.justifyContent = 'flex-end';
    buttonDiv.style.marginTop = '20px';
    buttonDiv.style.gap = '10px';

    const cancelButton = buttonDiv.createEl('button', { text: 'Cancel' });
    const cancelHandler = () => this.close();
    cancelButton.addEventListener('click', cancelHandler);
    this._eventListeners.push({ el: cancelButton, event: 'click', handler: cancelHandler });

    const confirmButton = buttonDiv.createEl('button', { text: 'Confirm' });
    confirmButton.addClass('mod-warning');
    const confirmHandler = () => {
      this.onConfirm();
      this.close();
    };
    confirmButton.addEventListener('click', confirmHandler);
    this._eventListeners.push({ el: confirmButton, event: 'click', handler: confirmHandler });
  }

  onClose() {
    // Properly clean up all event listeners before emptying
    this._eventListeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    this._eventListeners = [];
    
    // Now empty the content
    this.contentEl.empty();
  }
}

// last cleanup on unload
try {
  if (module && module.exports && module.exports.prototype) {
    module.exports.prototype.onunload = function() {
      try { this._viewportObservers?.forEach(obs => obs.disconnect()); } catch (e) {}
      try { this._viewportObservers?.clear(); } catch (e) {}
      try { this._dynamicHandlers?.forEach(cleanup => cleanup()); } catch (e) {}
    };
  }
} catch (e) {}

// 0.1.12 yay 25NOV17