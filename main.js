const {
  Plugin,
  PluginSettingTab,
  Setting,
  Modal,
  MarkdownView,
  Notice
} = require('obsidian');
const { RangeSetBuilder } = require('@codemirror/state');
const { Decoration, ViewPlugin } = require('@codemirror/view');
const { syntaxTree } = require('@codemirror/language');


function debounce(func, wait = 100) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

module.exports = class AlwaysColorText extends Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ColorSettingTab(this.app, this));

    // --- Ribbon icon ---
    if (!this.settings.disableToggleModes.ribbon) {
      this.ribbonIcon = this.addRibbonIcon('palette', 'Toggle Always Color Text', () => {
        this.settings.enabled = !this.settings.enabled;
        this.saveSettings();
        new Notice(`Always Color Text ${this.settings.enabled ? 'Enabled' : 'Disabled'}`);
        this.updateStatusBar();
      });
    } else {
      this.ribbonIcon = null;
    }

    // --- The Status bar toggle ---
    if (!this.settings.disableToggleModes.statusBar) {
      this.statusBar = this.addStatusBarItem();
      this.updateStatusBar();
      this.statusBar.onclick = () => {
        this.settings.enabled = !this.settings.enabled;
        this.saveSettings();
        this.updateStatusBar();
      };
    } else {
      this.statusBar = null;
    }

    // --- Add toggle to the file menu ---
    this.registerEvent(this.app.workspace.on('file-menu', (menu, file) => {
      menu.addItem(item => {
        const isDisabled = this.settings.disabledFiles.includes(file.path);
        item.setTitle(`${isDisabled ? 'Enable' : 'Disable'} Always Color Text for this file`)
          .setIcon(isDisabled ? 'eye' : 'eye-off')
          .onClick(async () => {
            if (isDisabled) {
              this.settings.disabledFiles.remove(file.path);
            } else {
              this.settings.disabledFiles.push(file.path);
            }
            await this.saveSettings();
          });
      });
    }));

    // --- Right-click menu for selected text: color and highlight options ---
    this.registerEvent(this.app.workspace.on('editor-menu', (menu, editor, view) => {
      const selectedText = editor.getSelection().trim();
      if (selectedText.length > 0) {
        // Color Once:
        menu.addItem(item => {
          item.setTitle("Color Once")
            .setIcon('brush')
            .onClick(() => {
              new ColorPickerModal(this.app, this, (color) => {
                const html = `<span style="color: ${color}">${selectedText}</span>`;
                editor.replaceSelection(html);
              }).open();
            });
        });
        // Highlight Once:
        if (this.settings.enableAlwaysHighlight) {
          menu.addItem(item => {
            item.setTitle("Highlight Once")
              .setIcon('highlighter')
              .onClick(() => {
                new ColorPickerModal(this.app, this, (color) => {
                  const html = `<span style="background-color: ${color}">${selectedText}</span>`;
                  editor.replaceSelection(html);
                }).open();
              });
          });
        }
        // Always Color Text:
        menu.addItem(item => {
          item.setTitle("Always Color Text")
            .setIcon('palette')
            .onClick(() => {
              new ColorPickerModal(this.app, this, async (color) => {
                await this.saveEntry(selectedText, color);
                this.refreshEditor(view, true);
              }).open();
            });
        });
      }
    }));

    // --- Command palette thingy ---
    if (!this.settings.disableToggleModes.command) {
      this.addCommand({
        id: 'set-color-for-selection',
        name: 'Always Color Text',
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
      partialMatch: false,
      highlightStyle: 'text',
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
    this.reconfigureEditorExtensions();
  }

  // --- Save a persistent color for a word ---
  async saveEntry(word, color) {
    this.settings.wordColors[word] = color;
    await this.saveSettings();
    this.reconfigureEditorExtensions();
  }

  // --- Force refresh all open Markdown editors ---
  forceRefreshAllEditors() {
    this.app.workspace.iterateAllLeaves(leaf => {
      if (leaf.view instanceof MarkdownView && leaf.view.editor?.cm) {
        leaf.view.editor.cm.dispatch({ changes: [] });
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

  // --- Refresh only the Active Editor ---
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

  // --- Get Sorted Word Entries (Longest words first for correct matching) ---
  getSortedWordEntries() {
    const numWords = Object.keys(this.settings.wordColors).length;
    if (numWords > 200) {
      console.warn(`Always Color Text: You have ${numWords} colored words! That's a lot. Your app might slow down a bit.`);
    }
    return Object.entries(this.settings.wordColors)
      .sort((a, b) => b[0].length - a[0].length);
  }

  // --- Efficient Apply Highlights in Reading View (Markdown Post Processor) ---
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
        for (const [word, color] of entries) {
          const flags = this.settings.caseSensitive ? 'g' : 'gi';
          let pattern;
          if (this.settings.partialMatch) {
            pattern = `${this.escapeRegex(word)}\\w*`;
          } else {
            pattern = (word.includes(' ') ? this.escapeRegex(word) : `\\b${this.escapeRegex(word)}\\b`);
          }
          const regex = new RegExp(pattern, flags);
          let match;
          while ((match = regex.exec(text))) {
            matches.push({ start: match.index, end: match.index + match[0].length, color, word: match[0] });
            if (matches.length > 50) break;
          }
          if (matches.length > 50) break;
        }
        if (matches.length > 50) continue;
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
            else span.style.backgroundColor = m.color;
            frag.appendChild(span);
            pos = m.end;
          }
          if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
          node.replaceWith(frag);
        }
      }
    }
  }

  // --- Efficient Build CodeMirror Editor Extension (Editing View) ---
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
          if (plugin.settings.partialMatch) {
            pattern = `${plugin.escapeRegex(word)}\\w*`;
          } else {
            pattern = (word.includes(' ') ? plugin.escapeRegex(word) : `\\b${plugin.escapeRegex(word)}\\b`);
          }
          const regex = new RegExp(pattern, flags);
          let match;
          while ((match = regex.exec(text))) {
            matches.push({ start: from + match.index, end: from + match.index + match[0].length, color });
            if (matches.length > 50) break;
          }
          if (matches.length > 50) break;
        }
        matches.sort((a, b) => a.start - b.start || b.end - a.end);
        let lastEnd = from;
        let nonOverlapping = [];
        for (let m of matches) {
          if (m.start >= lastEnd) {
            nonOverlapping.push(m);
            lastEnd = m.end;
          }
        }
        nonOverlapping = nonOverlapping.slice(0, 50);
        for (const m of nonOverlapping) {
          const deco = Decoration.mark({
            attributes: plugin.settings.highlightStyle === 'text'
              ? { style: `color: ${m.color} !important;` }
              : { style: `background-color: ${m.color} !important;` }
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

    // --- Main plugin settings header ---
    const h2 = containerEl.createEl('h2', { text: 'Always Color Text Settings' });
    h2.style.marginTop = '0.5em';

    new Setting(containerEl)
      .setName('Enable Document Colour')
      .addToggle(t => t.setValue(this.plugin.settings.enabled).onChange(async v => {
        this.plugin.settings.enabled = v;
        await this.debouncedSaveSettings();
      }));

    new Setting(containerEl)
      .setName('Enable Highlight Once')
      .setDesc('This adds "Highlight Once" to your right-click menu. You can highlight selected text with a background color.')
      .addToggle(t => t.setValue(this.plugin.settings.enableAlwaysHighlight).onChange(async v => {
        this.plugin.settings.enableAlwaysHighlight = v;
        await this.debouncedSaveSettings();
      }));

    new Setting(containerEl)
      .setName('Case Sensitive')
      .setDesc('If this is on, "word" and "Word" are totally different. If it\'s off, they\'re the same.')
      .addToggle(t => t.setValue(this.plugin.settings.caseSensitive).onChange(async v => {
        this.plugin.settings.caseSensitive = v;
        await this.debouncedSaveSettings();
      }));

    new Setting(containerEl)
      .setName('Partial Match')
      .setDesc('If this is on, "Art" will color "Artist" too! It matches words that contain your defined word.')
      .addToggle(t => t.setValue(this.plugin.settings.partialMatch).onChange(async v => {
        this.plugin.settings.partialMatch = v;
        await this.debouncedSaveSettings();
      }));

    new Setting(containerEl)
      .setName('Highlight Style')
      .setDesc('Do you want to color the text itself or the background behind it?')
      .addDropdown(d => d
        .addOption('text', 'Text Color')
        .addOption('background', 'Background Highlight')
        .setValue(this.plugin.settings.highlightStyle)
        .onChange(async v => {
          this.plugin.settings.highlightStyle = v;
          await this.debouncedSaveSettings();
        }));

    // --- Custom Swatches Settings ---
    containerEl.createEl('h3', { text: 'Color Swatches' });

    new Setting(containerEl)
      .setName('Enable Custom Swatches')
      .setDesc('Turn this on if you want to pick your own colors for the color picker.')
      .addToggle(t => t.setValue(this.plugin.settings.customSwatchesEnabled).onChange(async v => {
        this.plugin.settings.customSwatchesEnabled = v;
        await this.plugin.saveSettings();
        this.display();
      }));

    if (this.plugin.settings.customSwatchesEnabled) {
      new Setting(containerEl)
        .setName('Replace Default Swatches')
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
          .addExtraButton(btn => btn.setIcon('trash').setTooltip('Remove Swatch').onClick(async () => {
            this.plugin.settings.customSwatches.splice(i, 1);
            await this.plugin.saveSettings();
            this.display();
          }));
      });

      new Setting(containerEl)
        .addButton(b => b.setButtonText('+ Add Colour').onClick(async () => {
          this.plugin.settings.customSwatches.push('#000000');
          await this.plugin.saveSettings();
          this.display();
        }));
    }

    // --- Colored Words List UI ---
    containerEl.createEl('h3', { text: 'Defined Colored Words' });
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
          this.display();
        } else if (!newWord) {
          delete this.plugin.settings.wordColors[word];
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
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
        this.display();
      });
    });

    new Setting(containerEl)
      .addButton(b => b.setButtonText('Add New Word').onClick(async () => {
        this.plugin.settings.wordColors[`New Word ${Object.keys(this.plugin.settings.wordColors).length + 1}`] = '#000000';
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.display();
      }));

    new Setting(containerEl)
      .addExtraButton(b => b
        .setIcon('trash')
        .setTooltip('Delete All Defined Words')
        .onClick(async () => {
          new ConfirmationModal(this.app, 'Delete All Words', 'Are you sure you want to delete ALL your colored words? You can\'t undo this!', async () => {
            this.plugin.settings.wordColors = {};
            await this.plugin.saveSettings();
            this.plugin.reconfigureEditorExtensions();
            this.display();
          }).open();
        }));

    // --- File-Specific Settings ---
    containerEl.createEl('h3', { text: 'File-Specific Settings' });
    containerEl.createEl('p', { text: 'Here\'s where you manage files where coloring is taking a break.' });

    if (this.plugin.settings.disabledFiles.length > 0) {
      const disabledFilesDiv = containerEl.createDiv();
      disabledFilesDiv.createEl('h4', { text: 'Files with Coloring Disabled:' });
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
      .setName('Disable Coloring for Current File')
      .setDesc('Click this to turn off coloring just for the note you\'re looking at right now.')
      .addButton(b => b.setButtonText('Disable for This File').onClick(async () => {
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

    // --- Toggle Visibility Settings ---
    containerEl.createEl('h3', { text: 'Toggle Visibility' });
    containerEl.createEl('p', { text: 'These settings control where you can turn the coloring feature on or off.' });

    new Setting(containerEl)
      .setName('Disable Toggle on Statusbar')
      .addToggle(t => t
        .setValue(this.plugin.settings.disableToggleModes.statusBar)
        .onChange(async v => {
          this.plugin.settings.disableToggleModes.statusBar = v;
          await this.plugin.saveSettings();
          location.reload();
        }));

    new Setting(containerEl)
      .setName('Disable Toggle in Command')
      .addToggle(t => t
        .setValue(this.plugin.settings.disableToggleModes.command)
        .onChange(async v => {
          this.plugin.settings.disableToggleModes.command = v;
          await this.plugin.saveSettings();
          location.reload();
        }));

    new Setting(containerEl)
      .setName('Disable Toggle in Ribbon')
      .addToggle(t => t
        .setValue(this.plugin.settings.disableToggleModes.ribbon)
        .onChange(async v => {
          this.plugin.settings.disableToggleModes.ribbon = v;
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
    h2.style.marginTop = '-10px'; // oulta remove top margin of H2!!!
    h2.style.marginBottom = '18px';

    const inputDiv = contentEl.createDiv();
    inputDiv.style.display = 'flex';
    inputDiv.style.gap = '8px';
    inputDiv.style.marginBottom = '15px';

    const picker = inputDiv.createEl('input', { type: 'color' });
    picker.value = '#000000';
    picker.style.width = '60px'; // Colour Picker Box Width (pill)
    picker.style.height = '35px';
    picker.style.border = 'none';
    picker.style.borderRadius = '5px';
    picker.style.cursor = 'pointer';

    const hexInput = inputDiv.createEl('input', { type: 'text' });
    hexInput.value = picker.value;
    hexInput.placeholder = '#RRGGBB';
    hexInput.style.flex = '1';
    hexInput.style.padding = '8px';
    hexInput.style.borderRadius = '5px';
    hexInput.style.border = '1px solid var(--background-modifier-border)';
    hexInput.style.width = '100px'; // Hex Box Input Width

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
