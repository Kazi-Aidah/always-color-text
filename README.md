![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&style=for-the-badge&label=downloads&labelColor=26233a&color=483699&query=%24%5B%22always-color-text%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json) ![Stars](https://img.shields.io/github/stars/Kazi-Aidah/always-color-text?style=for-the-badge&color=c4a7e7&labelColor=26244a) ![Version](https://img.shields.io/github/manifest-json/v/Kazi-Aidah/always-color-text?style=for-the-badge&color=9ccfd8&labelColor=26233a) ![Last update](https://img.shields.io/github/last-commit/Kazi-Aidah/always-color-text?style=for-the-badge&color=9fc387&labelColor=26233a)

# Always Color Text

Color & highlight keywords, status words, dates, names, ***anything***! Once assigned, colors appear automatically throughout your vault in both Live Preview and Reading view.

![banner](assets/banner.png)

**Just select a word → pick a color → watch it appear everywhere.** Lightning-fast performance.

![highlight coloring example in editor](assets/highlight-color-example.gif)

Whether you're a writer tracking characters, a student highlighting key terms, or someone who wants to recognize important words at a glance, this plugin adapts to your workflow.

<!-- ## Table of Contents

- [Color Anything, Exactly How You Want](#color-anything-exactly-how-you-want)
  - [Unified Color Picker](#unified-color-picker)
  - [Customizable Highlights](#customizable-highlights)
  - [Custom CSS Styling](#custom-css-styling)
- [Save all the styles you like!](#save-all-the-styles-you-like)
  - [Quick Menu](#quick-menu)
    - [How do I actually add Presets to the Quick Menu?](#how-do-i-actually-add-presets-to-the-quick-menu)
- [Look & Feel](#look--feel)
  - [Your Color Palette](#your-color-palette)
- [Adjust Colors for Dark & Light Modes](#adjust-colors-for-dark--light-modes)
- [Smart Text Matching](#smart-text-matching)
  - [Simple Matching](#simple-matching)
    - [Match Types](#match-types)
    - [Case Sensitivity](#case-sensitivity)
    - [Color Targets](#color-targets)
  - [Markdown Elements & Time Matching](#markdown-elements--time-matching)
  - [Regex Matching](#regex-matching)
- [Color Exclusion Rules](#color-exclusion-rules)
  - [Single Entry & Word Group Rules](#single-entry--word-group-rules)
  - [Settings Rules](#settings-rules)
- [Organize Your Colors](#organize-your-colors)
  - [Centralized Word Management](#centralized-word-management)
  - [Grouped Entries](#grouped-entries)
- [Extra Features](#extra-features)
  - [Deactivate Entries](#deactivate-entries)
  - [Entry Filtering (Limit Input)](#entry-filtering-limit-input)
  - [Add to Existing Entry](#add-to-existing-entry)
  - [Link Matches / Presets / Swatches](#link-matches--presets--swatches)
  - [Optimization Settings](#optimization-settings)
  - [Automatic Backups](#automatic-backups)
  - [Display Commands](#display-commands)
  - [One-Time Actions](#one-time-actions)
- [Installation](#installation)
  - [Questions or Suggestions?](#questions-or-suggestions)
- [Contributing Translations](#contributing-translations)
  - [Contributors](#contributors) -->

---

## Color Anything, Exactly How You Want

### Unified Color Picker

Color text, add highlights, or both, right from a simple modal.

![Unified color picker modal with hex input, variation slider, and panels](assets/1.17.0/modal-pc-hex-var.png)

Customize your interface by hiding panels you don't need.

![Color picker modal customized to show a single panel](assets/1.17.0/modal-single-panel.png)

### Customizable Highlights

Make highlights look exactly how you imagine: adjust borders, corner shapes, transparency, and more.

![Edit Highlight Styling modal with border, corner, and transparency options](assets/1.17.0/modal-edit-highlight-styling.png)

> Did you know? You can right-click on a color picker to open the Pick Color modal with your custom swatches.

### Custom CSS Styling

Take styling to the next level with per-entry and per-group custom CSS. When enabled, you can add advanced CSS to individual entries or entire word groups, including font size adjustments, gradients, and more!

![custom CSS bevel and font size example](assets/custom-css-bevel-font-size.png)

## Save all the styles you like!

A "Style" button pops up in every modal for you to apply your styles!
![Style button and saved style presets in a modal](assets/1.17.0/text-style-presets.png)

---
### Quick Menu

- **Quick Colors**: Choose a text color and a background color that appear directly in the right-click menu.

  ![Quick Colors shown as color dots in the right-click menu](assets/1.17.0/quick-color-dots.png)

- **Quick Styles**: Apply a highlight style to selected text. Each Quick Style can be set to apply as either **Always Color Text** or **Inline HTML**.

  ![Quick Styles applied to selected text from the right-click menu](assets/1.17.0/quick-color-dots-red.png)

If **Quick Colors** are enabled, the applied style uses the selected Quick Color. If they are disabled, the style falls back to its own colors and inherits the colors set in Presets.

Word Groups and Match Types can also be assigned to a Quick Style!

#### How do I actually add Presets to the Quick Menu?

From the Edit Text Presets modal, you can click the ellipsis and choose the "Show in Quick Menu" option.
![Show in Quick Menu option in the Edit Text Presets modal](assets/1.17.0/show-in-quick-menu.png)


---

## Look & Feel
### Your Color Palette

Replace default swatches with your favorite colors for instant access!

![Pick Color modal with custom swatches](assets/1.17.0/modal-pick-color-swatches.png)

## Adjust Colors for Dark & Light Modes

Colors added in Dark mode can appear unreadable in Light mode. You can adjust your overall colors in the settings.
![Theme color adjustment settings for dark and light modes](assets/1.17.0/theme-color-adjustments.png)

---

## Smart Text Matching

### Simple Matching
#### Match Types
Control *how* text is matched with flexible, per-entry options:

- **Contains** – matches anywhere in the word or text
- **Exact** – matches the full word only
- **Starts with** – matches text that begins with the entry
- **Ends with** – matches text that ends with the entry

#### Case Sensitivity
- **Case-sensitive** – Matches exactly as entered.
  - If the input is `Art`, only `Art` is colored. `ART` and `art` are not colored.
- **Case-insensitive** – Ignores letter case when matching.
  - If the input is `Art`, all case variations are colored, such as `Art`, `ART`, `art`, and `aRt`.

#### Color Targets
Choose exactly how your colors are applied with three targeting modes:

- **Color Text** – colors only the matched text (default)
- **Color Line** – colors the entire line containing the matched text
- **Color Next Line** – colors the line directly after the matched text


I personally love doing this for my tasks, using Color Line and a bit of custom CSS for center alignment.
![Personal task list with matched lines colored using Color Line](assets/1.17.0/personal-list.png)

### Markdown Elements & Time Matching

Markdown elements like bold, links, etc., can be added from the Presets. The same goes for the "Time & Date" preset, which allows users to match time using the simple moment.js format.
![Time & Date preset modal with moment.js format input](assets/1.17.0/modal-time-date.png)

### Regex Matching

Regex Support allows you to add regex to color specific patterns. You can preview them in the Regex Tester before applying them.
![Regex Tester modal previewing a regular expression](assets/1.17.0/modal-regex-tester.png)

---

## Color Exclusion Rules

By default, colors apply all over your vault. To keep specific files from getting colored, you can set up rules.

### Single Entry & Word Group Rules

For both single colored texts and grouped entries, you can set up rules to keep specific files from being colored.

You can choose not to color in Specific Files and Folders, Files containing a specific tag or property, or even a File or Folder name pattern.

For example, I can have "TODO" get colored only in my tasks.md file, or have "TODO" get colored EVERYWHERE except in my files containing a `done` tag.

![Edit rules modal for a single entry or word group](assets/1.17.0/modal-edit-rules.png)

### Settings Rules
This one is a complete inclusion and exclusion. Whereas the earlier exclusion allowed you to color or not color different texts in different folders, this one completely excludes a file or folder, or excludes a parent folder while allowing coloring inside a child folder.

![Settings rules for including and excluding files and folders](assets/1.17.0/rules.png)


---

## Organize Your Colors

### Centralized Word Management

All colored texts appear in settings with search and multiple sort options.

![Colored Texts settings tab with search and sort options](assets/1.17.0/settings-colored-texts.png)

The coolest part about them is the ability to [[#Deactivate Entries|deactivate entries]] and [[#Entry Filtering (Limit Input)|limits]].


### Grouped Entries

Put multiple entries into a group.
![Grouped entries in the settings tab](assets/1.17.0/settings-grouped-entries.png)

This allows you to apply a setting or style that all your grouped entries will use.


---

## Extra Features

### Deactivate Entries
In the Colored Texts tab, you can right-click on an entry and deactivate it so it stays but does not apply.
![Deactivating an entry from the Colored Texts tab](assets/1.17.0/deactivate-entries.png)

---
### Entry Filtering (Limit Input)

Use the **limit input** beside the search bar to instantly filter entries by type, match type, color target, status, or count.
![Limit input filter beside the search bar in settings](assets/1.17.0/limit-wide.png)

**Count & Display**

- `0` → show all entries
- `N` (number) → show only the last N entries

**Filter by Type**

- `r` → regex entries only
- `w` → word entries only
- `c` → colored text entries
- `h` → highlighted entries
- `b` → both text + highlight entries

**Filter by Match Type**

- `e` → exact match-type entries
- `sw` → starts-with match-type entries
- `ew` → ends-with match-type entries

**Filter by Color Target**

- `ct` → color text targeting entries
- `cl` → color line targeting entries
- `cc` → color next line targeting entries

**Filter by Status**

- `on` → active entries only
- `off` → deactivated entries only

---
### Add to Existing Entry
Select some text and choose **Add to Existing Entry** to add the selected text to an existing entry:
![Add to Existing Entry menu option](assets/1.17.0/existing-entries.png)

---
### Link Matches / Presets / Swatches
Found in **Settings → General → Advanced**. These keep shared styles in sync:
- **Link identical matchers:** edit a word or regex that several entries share, and you'll be asked whether to update all of them or only this one
- **Link swatch updates to text colors:** change a swatch once, and every text colored with it uses the updated color
- **Link preset updates to entries:** edit a preset, and the entries and word groups using it adopt the new style

---

### Optimization Settings

- **Word Completion Color**: Renders text colors only after a space is typed, which helps significantly with typing performance.
- **Lightweight Mode**: Skips partial match expansion and uses a stricter match limit for maximum performance.
- **Smart Updates**: Only updates active lines of the document to keep the editor responsive.

---

### Automatic Backups

Never lose your color settings! The plugin can automatically back up all your configuration to a folder inside your vault.

- **Scheduled Backups**: Hourly, daily, or weekly
- **One-Click Backup**: Manually trigger a backup anytime
- **Overwrite Option**: Replace the previous backup or keep multiple versions

Backups include all plugin data: colored texts, blacklists, file/folder rules, word groups, and settings. Restore via the "Import Data" button in settings.

---
### Display Commands

Hide commands you do not need or will never use.
![Display Commands settings for hiding unused commands](assets/1.17.0/display-commands.png)

---
### One-Time Actions

- **Deprecation notice:** One-Time Actions will be removed and moved to a dedicated plugin.
- One-Time Actions allow you to apply HTML color to your files. They are inline coloring and cannot be disabled by the Global Toggle.

---

## Installation

Available in Obsidian Community Plugins. Check the [Release Notes](https://github.com/Kazi-Aidah/always-color-text/releases) for updates and new features.

### Questions or Suggestions?

Create a new issue [here](https://github.com/Kazi-Aidah/always-color-text/issues) to report bugs or request new features! I love seeing new issues to fix \\(≧ᗜ≦)/ and this plugin wouldn't have advanced so far without the feedback from users!!

---

## Contributing Translations

Want to add your language to Always Color Text?

1. Go to `src/i18n/` and copy `en.js`.
2. Rename it to your language code (like `es.js`, `fr.js`).
3. Translate the values only, like this:

```js
{
    "notice_import_completed": "ইম্পোর্ট সম্পন্ন",
    "key": "translation"
}
```

4. Go to `src/i18n.js` and add your language code to the list of supported languages.
5. Submit a pull request with your translation file in `src/i18n/`.

That's it! Your language will be available to all users.

### Contributors

- [@wanghong322](https://github.com/wanghong322) – Simplified Chinese Translation
- [@Frumkin13](https://github.com/Frumkin13) – Russian Translation

Thanks a lot to them for taking the time to translate Always Color Text!