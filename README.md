
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&style=for-the-badge&label=downloads&labelColor=26233a&color=483699&query=%24%5B%22always-color-text%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json) ![Stars](https://img.shields.io/github/stars/Kazi-Aidah/always-color-text?style=for-the-badge&color=c4a7e7&labelColor=26233a) ![Version](https://img.shields.io/github/manifest-json/v/Kazi-Aidah/always-color-text?style=for-the-badge&color=9ccfd8&labelColor=26233a) ![Last update](https://img.shields.io/github/last-commit/Kazi-Aidah/always-color-text?style=for-the-badge&color=9fc387&labelColor=26233a)
# Always Color Text
Color & highlight keywords, status words, dates, names, ***anything***! Once assigned, colors appear automatically throughout your vault in both Live Preview and Reading view.

![banner](assets/banner.png)

**Just select a word → pick a color → watch it appear everywhere.** Lightning-fast performance.
![highlight coloring example in editor](assets/highlight-color-example.gif)

Whether you're a writer tracking characters, a student highlighting key terms, or someone who wants to recognize important words at a glance, this plugin adapts to your workflow.

---

## Color Anything, Exactly How You Want

### Unified Color Picker
Color text, add highlights, or both, right from a simple modal.
![color picker modal with both panels](assets/color-picker-modal.png)

Customize your interface by hiding panels you don't need.
![color picker modal with single panel](assets/single-color-picker-modal.png)

### Customizable Highlights
Make highlights look exactly how you imagine: adjust borders, rounded corners, transparency, and more.
![Plugin Settings Highlight Appearance Section](assets/highlight-appearance.png)

### Custom CSS Styling
Take styling to the next level with per-entry and per-group custom CSS. When enabled, you can add advanced CSS to individual entries or entire word groups, including font size adjustments, gradients, and more. Works in both Live Preview and Reading Mode.

![](assets/custom-css-bevel-font-size.png)

### Your Color Palette
Replace default swatches with your favorite colors for instant access!
![Custom Swatches in Color Picker](assets/custom-swatches.png)

### Quick Actions
- **Quick Colors**: Choose a text color and background color group that appears directly in the right-click menu.
  ![Quick Colors with Quick Styles](assets/quick-color+quick-styles.png)

- **Quick Styles**: Apply a highlight style to selected text. Each Quick Style can be set to apply as either **Always Color Text** or **Inline HTML** — name them differently to tell them apart.
  ![Quick Colors and Quick Styles](assets/quick-color-AND-quick-styles.png)

If **Quick Colors** are enabled, the style uses the selected Quick Color. If they are disabled, the style falls back to its own colors and inherits the styling from the first Quick Style entry. If no Quick Style exists, the default styling is applied.

Word Groups and Match Types can also be assigned to a Quick Style!

---

## Smart Text Matching

### Match Types
Control *how* text is matched with flexible, per-entry options:

- **Contains** – matches anywhere in the word or text
- **Exact** – matches the full word only
- **Starts with** – matches text that begins with the entry
- **Ends with** – matches text that ends with the entry

### Color Targeting Modes
Choose exactly how your colors are applied with three targeting modes:

- **Color Text** – Colors only the matched text (default)
- **Color Line** – Colors the entire line containing the matched text
- **Color Next Line** – Colors the line directly after the matched text

These modes give you precise control over how colors are applied, especially useful for complex documents with nested structures.

### Per-Entry Configuration
Customize the styling and rules for each colored entry via "Edit Entry Details":

- **Case Sensitivity**
  When enabled, matches respect letter casing.
  `"art"` matches `"art"` but not `"Art"` or `"ART"`.

- **Highlight Styling**
  Adjust borders, rounded corners, transparency, and more per entry.
  ![Edit Highlight Styling Modal](assets/modal-highlight-styling.png)

- **Inclusion / Exclusion Rules**
  Exclude specific folders, files, or files with specific tags from coloring, or limit coloring to specific folders.
  ![Edit Entry Modal with Paths](assets/edit-entry-modal-w-paths.png)

### Advanced Pattern Matching with Regex
Color complex patterns like dates, currencies, or specific text structures automatically:
![Regex examples showing dates and times](assets/time-example.png)

**Built-in Regex Tester**
Test patterns instantly before applying them! The Regex Tester lets you preview matches and fine-tune expressions right in Obsidian.
![Regex Tester with Example](assets/regex-tester.png)

**Ready-to-Use Presets**
Jumpstart your coloring with curated pattern collections:
- **Markdown Formatting** – Headings, lists, tasks, comments, and links
- **Brackets** – Color content inside [square], {curly}, (round), \<angle>, and "double quote" brackets
- **Other Patterns** – Dates, times, emails, @mentions, currencies, and measurements

**Common patterns:**
- `\b\d{4}-\d{2}-\d{2}\b` → Dates like 2024-01-19
- `\bTODO|DONE|WIP\b` → Status words
- `\$\d+\.\d{2}` → Currency amounts

![Blue Dates Example](assets/blue-dates.png)

---

## Organize Your Colors

### Centralized Word Management
All colored texts appear in settings with search and multiple sort options.
![Plugin Settings Always Colored Texts](assets/always-colored-texts.png)
Tip: Right-click on any color picker to bring up the Color Picker Modal.

Switch styles seamlessly — changing from "Both" to "Highlight" and back retains your original colors. Right-click any entry to **edit it**, **duplicate it**, or **open in Regex Tester** for quick adjustments.

### Word Groups
Entries can be added to a word group right from the Pick Color modal, and the word group can be set as active when you need it, otherwise kept inactive.

You can also set a **match type** and **case sensitivity** for all entries in a word group, and **enable or disable entire word groups** for specific folders or files with specific tags.

![](assets/word-group-selects.png)

**Note:** Use `/` to target the root folder (whole vault) for Enable in/Disable in.

### Word Group Styling
Style the word group itself — this styling applies to all entries within that group, including Custom CSS.
![Word Group Styling](assets/word-group-styling.png)

### Entry Filtering (Limit Input)
Use the **limit input** beside the search bar to instantly filter entries by type, match type, color target, or count.

![Limit Input Example 1](assets/limit-input-1.png)
![Limit Input Example 2](assets/limit-input-2.png)

**Available limit filters:**

**Count & Display:**
- `0` → show all entries
- `N` (number) → show only the last N entries

**Filter by Type:**
- `r` → regex entries only
- `w` → word entries only
- `c` → colored text entries
- `h` → highlighted entries
- `b` → both text + highlight entries

**Filter by Match Type:**
- `e` → exact match-type entries
- `sw` → starts-with match-type entries
- `ew` → ends-with match-type entries

**Filter by Color Target:**
- `ct` → color text targeting entries
- `cl` → color line targeting entries
- `cc` → color next line targeting entries

### Add to Existing Entry
Right-click any entry and choose "Add to Existing Entry" to add the selected text to that entry:
![Add to Existing Entry Modal](assets/add-to-existing-entry.png)

### File & Folder Control
Use "Include" to color specific documents or "Exclude" to disable coloring in entire folders.
Create rules based on tags — include or exclude files that contain specific tags (e.g., `#private`, `#draft`).

![File & Folder Coloring Rules](assets/file-folder-rules.png)

**Note**: File-level rules override folder-level rules.

---

## Automatic Backups
Never lose your color settings! The plugin can automatically back up all your configuration to a folder inside your vault.

- **Scheduled Backups**: Hourly, daily, or weekly
- **One-Click Backup**: Manually trigger a backup anytime
- **Overwrite Option**: Replace the previous backup or keep multiple versions

Backups include all plugin data: colored texts, blacklists, file/folder rules, word groups, and settings. Restore via the "Import Data" button in settings.

---

## Theme Compatibility

### Light & Dark Mode Text Fixers
Ensure your colors look great in any theme!
- **Dark Mode Text Fixer**: If you usually set colors in Light Mode, turn this on to automatically adjust dark text for readability in Dark Mode.
- **Light Mode Text Fixer**: If you set colors in Dark Mode, turn this on to adjust light text for visibility in Light Mode.

---

## Performance & Safety

### Built-in Protection
- **Pattern validation** automatically blocks problematic regex
- **Progressive loading** colors visible content first
- **Memory monitoring** prevents slowdowns
- **Active file only** coloring for optimal performance

### Optimization Settings
- **Lightweight Mode**: Skips partial match expansion and uses a stricter match limit for maximum performance.
- **Smart Updates**: Only updates active lines of the document to keep the editor responsive.
- **Word Completion Color**: Renders text colors only after a space is typed, helps significantly with typing performance.

---

## Real-World Uses
- **Status tracking**: Color `TODO`, `INPROGRESS`, `DONE` in different colors
- **Writing projects**: Highlight character names, locations, and key plot points
- **Learning & study**: Make key terms and vocabulary stand out
- **Technical documentation**: Color code warnings, notes, and important sections
- **Project management**: Highlight priorities like `!!!URGENT!!!` or `Low-Effort`

![Use case examples](https://github.com/user-attachments/assets/e16e3121-2c14-43fe-b022-9e442d031f25)

![Coloring Symbols](assets/symbol-cool.png)
Note: Coloring symbols affect word coloring, not just the symbol itself.
Using symbols like `+` may trigger bullets so color `\+` instead.

---

## Installation
Available in Obsidian Community Plugins. Check [Release Notes](https://github.com/Kazi-Aidah/always-color-text/releases) for updates and new features.

### Questions or Suggestions?
Create a new issue [here](https://github.com/Kazi-Aidah/always-color-text/issues) to report bugs or request new features! I love seeing new issues for me to fix \\(≧ᗜ≦)/ and this plugin wouldn't have advanced so far without the feedback from users!!

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
