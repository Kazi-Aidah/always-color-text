import { Modal } from 'obsidian';
import { RulePickerModal } from './RulePickerModal.js';
import { RuleValueModal } from './RuleValueModal.js';

// Modal for editing a word group's inclusion / exclusion rules using the same
// rich UI as entry rules (type dropdown + fuzzy picker + choose button).
// Mutates the passed `group` object's inclusionRules / exclusionRules in place.
export class GroupRulesModal extends Modal {
  constructor(app, plugin, group, onClose) {
    super(app);
    this.app = app;
    this.plugin = plugin;
    this.group = group;
    if (!Array.isArray(this.group.inclusionRules))
      this.group.inclusionRules = [];
    if (!Array.isArray(this.group.exclusionRules))
      this.group.exclusionRules = [];
    this._onCloseCb = onClose;
    this._rules = [
      ...this.group.inclusionRules.map((r) => ({ ...r, mode: 'include' })),
      ...this.group.exclusionRules.map((r) => ({ ...r, mode: 'exclude' })),
    ];
    this._ruleTypeMap = new WeakMap();
  }

  syncGroupRules() {
    this.group.inclusionRules = this._rules.filter((r) => r.mode !== 'exclude');
    this.group.exclusionRules = this._rules.filter((r) => r.mode === 'exclude');
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.style.maxWidth = '700px';

    const header = contentEl.createEl('h3', {
      text: this.plugin.t('group_rules_modal_title', 'Group inclusion / exclusion rules'),
    });
    header.style.marginTop = '0';

    const rulesContainer = contentEl.createDiv();
    rulesContainer.style.display = 'flex';
    rulesContainer.style.flexDirection = 'column';

    const addRuleBtn = contentEl.createEl('button', {
      text: this.plugin.t('group_rules_add', '+ Add rule'),
    });
    addRuleBtn.addClass('mod-cta');
    addRuleBtn.style.marginTop = '10px';
    addRuleBtn.addEventListener('click', () => {
      this._rules.push({
        path: '',
        type: 'file',
        mode: 'include',
        isRegex: false,
        flags: '',
      });
      this.syncGroupRules();
      renderRules();
    });

    const renderRules = () => {
      rulesContainer.empty();
      const typeMap = this._ruleTypeMap;
      this._rules.forEach((r, idx) => {
        const row = rulesContainer.createDiv();
        row.style.display = 'flex';
        row.style.gap = '8px';
        row.style.alignItems = 'center';
        row.style.marginBottom = '8px';

        const modeSel = row.createEl('select');
        const optIn = modeSel.createEl('option', {
          text: this.plugin.t('mode_only_colors_in', 'only colors in'),
        });
        optIn.value = 'include';
        const optEx = modeSel.createEl('option', {
          text: this.plugin.t('mode_does_not_color_in', 'does not color in'),
        });
        optEx.value = 'exclude';
        modeSel.value = r.mode === 'exclude' ? 'exclude' : 'include';
        modeSel.style.minWidth = '160px';
        modeSel.style.border = '1px solid var(--background-modifier-border)';
        modeSel.style.borderRadius = 'var(--radius-m)';
        modeSel.style.background = 'var(--background-modifier-form-field)';

        const typeSel = row.createEl('select');
        const tOptFolder = typeSel.createEl('option', {
          text: this.plugin.t('rule_type_folder', 'Folder'),
        });
        tOptFolder.value = 'folder';
        const tOptFile = typeSel.createEl('option', {
          text: this.plugin.t('rule_type_file', 'File'),
        });
        tOptFile.value = 'file';
        const tOptTag = typeSel.createEl('option', {
          text: this.plugin.t('rule_type_tag', 'Tag'),
        });
        tOptTag.value = 'tag';
        const tOptProp = typeSel.createEl('option', {
          text: this.plugin.t('rule_type_property', 'Property'),
        });
        tOptProp.value = 'property';
        const tOptPattern = typeSel.createEl('option', {
          text: this.plugin.t('rule_type_pattern', 'Pattern'),
        });
        tOptPattern.value = 'pattern';
        const ruleType =
          r.type ||
          (String(r.path || '').startsWith('#')
            ? 'tag'
            : /\/$/.test(String(r.path || ''))
              ? 'folder'
              : 'file');
        typeSel.value = ruleType;
        typeSel.style.minWidth = '100px';
        typeSel.style.border = '1px solid var(--background-modifier-border)';
        typeSel.style.borderRadius = 'var(--radius-m)';
        typeSel.style.background = 'var(--background-modifier-form-field)';

        if (!typeMap.has(r)) typeMap.set(r, {});
        const tv = typeMap.get(r);
        if (!(ruleType in tv)) tv[ruleType] = String(r.path || '');

        const typeHandler = () => {
          const newType = typeSel.value;
          const oldType = r.type || ruleType;
          tv[oldType] = String(r.path || '');
          r.type = newType;
          r.path = tv[newType] !== undefined ? tv[newType] : '';
          this.syncGroupRules();
          renderRules();
        };
        typeSel.addEventListener('change', typeHandler);

        const modeHandler = () => {
          r.mode = modeSel.value === 'exclude' ? 'exclude' : 'include';
          this.syncGroupRules();
          renderRules();
        };
        modeSel.addEventListener('change', modeHandler);

        const chooseArea = row.createEl('div');
        chooseArea.style.display = 'flex';
        chooseArea.style.gap = '8px';
        chooseArea.style.flex = '1 1 auto';
        chooseArea.style.minWidth = '160px';

        const clip = (b) => {
          b.style.overflow = 'hidden';
          b.style.textOverflow = 'ellipsis';
          b.style.whiteSpace = 'nowrap';
          b.style.textAlign = 'left';
          b.style.padding = '6px 10px';
          b.style.border = '1px solid var(--background-modifier-border)';
          b.style.borderRadius = 'var(--radius-m)';
        };
        const openPicker = (type, cb) => {
          new RulePickerModal(this.app, this.plugin, type, cb).open();
        };

        const refreshLabels = () => {
          const t = typeSel.value;
          const raw = String(r.path || '');
          chooseArea.empty();
          if (t === 'property') {
            const ci = raw.indexOf(':');
            const key = ci > -1 ? raw.slice(0, ci).trim() : raw;
            const val = ci > -1 ? raw.slice(ci + 1).trim() : '';
            const keyBtn = chooseArea.createEl('button', {
              text: key ? key : this.plugin.t('rule_choose_key', 'Choose key…'),
            });
            clip(keyBtn);
            keyBtn.style.flex = '1 1 auto';
            keyBtn.addEventListener('click', () => {
              openPicker('property', (v) => {
                r.path = String(v || '');
                r.type = 'property';
                this.syncGroupRules();
                renderRules();
              });
            });
            const valBtn = chooseArea.createEl('button', {
              text: val ? val : this.plugin.t('rule_choose_value', 'Choose value…'),
            });
            clip(valBtn);
            valBtn.style.flex = '1 1 auto';
            valBtn.addEventListener('click', () => {
              const cur = String(r.path || '');
              const curCi = cur.indexOf(':');
              const curKey = curCi > -1 ? cur.slice(0, curCi).trim() : cur;
              new RuleValueModal(this.app, this.plugin, val, (v) => {
                r.path = (curKey ? curKey + ': ' : '') + String(v || '');
                r.type = 'property';
                this.syncGroupRules();
                renderRules();
              }).open();
            });
          } else if (t === 'pattern') {
            const inp = chooseArea.createEl('input', {
              type: 'text',
              value: raw,
            });
            inp.placeholder = this.plugin.t(
              'rule_pattern_placeholder',
              'matches file/folder title',
            );
            inp.style.flex = '1 1 auto';
            inp.style.padding = '6px 10px';
            inp.style.border = '1px solid var(--background-modifier-border)';
            inp.style.borderRadius = 'var(--radius-m)';
            const patternInputHandler = () => {
              r.path = String(inp.value || '').trim();
              r.type = 'pattern';
              this.syncGroupRules();
              renderRules();
            };
            inp.addEventListener('change', patternInputHandler);
          } else {
            const btn = chooseArea.createEl('button', {
              text:
                raw ||
                this.plugin.t(
                  'rule_choose_placeholder_' + t,
                  'Choose ' + t + '…',
                ),
            });
            clip(btn);
            btn.style.flex = '1 1 auto';
            btn.addEventListener('click', () => {
              const type = typeSel.value;
              openPicker(type, (v) => {
                let p = String(v || '');
                if (type === 'folder') {
                  if (!p.endsWith('/')) p += '/';
                } else if (type === 'tag') {
                  if (!p.startsWith('#')) p = '#' + p;
                }
                r.path = p;
                r.type = type;
                this.syncGroupRules();
                renderRules();
              });
            });
          }
        };
        refreshLabels();

        const delBtn = row.createEl('button', {
          text: this.plugin.t('delete_button_text', '✕'),
        });
        delBtn.addClass('mod-warning');
        delBtn.addEventListener('click', () => {
          this._rules.splice(idx, 1);
          this.syncGroupRules();
          renderRules();
        });
      });
    };

    renderRules();
  }

  onClose() {
    this.syncGroupRules();
    // Propagate to the live settings group so unsaved entry edits in the
    // parent modal (which reset its copy to the live group) don't drop these.
    const uid = this.group && this.group.uid;
    if (uid != null && this.plugin && this.plugin.settings) {
      const allGroups = [
        ...(Array.isArray(this.plugin.settings.wordEntryGroups)
          ? this.plugin.settings.wordEntryGroups
          : []),
        ...(Array.isArray(this.plugin.settings.blacklistEntryGroups)
          ? this.plugin.settings.blacklistEntryGroups
          : []),
      ];
      const live = allGroups.find((g) => g && g.uid === uid);
      if (live) {
        live.inclusionRules = this.group.inclusionRules;
        live.exclusionRules = this.group.exclusionRules;
      }
    }
    if (this.plugin && typeof this.plugin.saveSettings === 'function') {
      this.plugin.saveSettings();
    }
    if (typeof this._onCloseCb === 'function') this._onCloseCb();
  }
}
