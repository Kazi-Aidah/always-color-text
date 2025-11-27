![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&style=for-the-badge&label=downloads&labelColor=26233a&color=483699&query=%24%5B%22always-color-text%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json) ![Stars](https://img.shields.io/github/stars/Kazi-Aidah/always-color-text?style=for-the-badge&color=c4a7e7&labelColor=26233a) ![Version](https://img.shields.io/github/manifest-json/v/Kazi-Aidah/always-color-text?style=for-the-badge&color=9ccfd8&labelColor=26233a) ![Last update](https://img.shields.io/github/last-commit/Kazi-Aidah/always-color-text?style=for-the-badge&color=9fc387&labelColor=26233a)
# Always Color Text
Color & highlight keywords, status words, dates, names, ***anything***! Once assigned, colors appear automatically throughout your vault in both Live Preview and Reading view.

![banner](assets/banner.png)

**Just select a word → pick a color → watch it appear everywhere.** Lightning-fast performance.
![highlight coloring example in editor](assets/highlight-color-example.gif)

Whether you're a writer tracking characters, a student highlighting key terms, or someone who wants to recognize important words at a glance, this plugin adapts to your workflow.

---

## Color Anything, Exactly How You Want

### Smart Color Picker
Color text, add highlights, or both, right from a simple modal. 
![color picker modal with both panels](assets/color-picker-modal.png)

Customize your interface by hiding panels you don't need.
![color picker modal with single panel](assets/single-color-picker-modal.png)

### Customizable Highlights
Make highlights look exactly how you imagine: adjust borders, rounded corners, transparency, and more.
![Plugin Settings Highlight Appearance Section](assets/highlight-appearance.png)

### Your Color Palette
Replace default swatches with your favorite colors for instant access!
![Custom Swatches in Color Picker](assets/custom-swatches.png)

---

## Smart Text Matching

### Case Sensitivity & Partial Matching
- **Case sensitive**: "art" colors only "art", not "Art" or "ART"
- **Partial matching**: "art" colors "artist", "artisan", "cart"  
- **Both enabled**: Matches case first, then colors whole word

### Advanced Pattern Matching with Regex
Color complex patterns like dates, currencies, or specific text structures:
![Regex examples showing dates and times](assets/time-example.png)

**Common patterns:**
- `\b\d{4}-\d{2}-\d{2}\b` → Dates like 2024-01-19
- `\bTODO|DONE|WIP\b` → Status words
- `\$\d+\.\d{2}` → Currency amounts
![Blue Dates Example](assets/blue-dates.png)

**Quick tips:**
- Enable "Use Regex" in your color entry settings
- Test patterns at regex101.com first if unsure
- Use **presets** for common patterns

---

## Organize Your Colors

### Centralized Word Management
All colored texts appear in settings with search and multiple sort options.
![Plugin Settings Always Colored Texts](assets/always-colored-words.png)

Switch styles seamlessly, changing from "Both" to "Highlight" and back retains your original colors.
<!-- ![Color Style Dropdown](assets/color-style.png) -->

### File & Folder Control
Set different color schemes for different projects. Use "Include" to color specific documents or "Exclude" to disable coloring in entire folders.
![File & Folder Coloring Rules](assets/file-folder-rules.png)

**Note**: File-level rules override folder-level rules, giving you precise control.

---

## Performance & Safety

### Built-in Protection
- **Pattern validation** automatically blocks problematic regex
- **Progressive loading** colors visible content first
- **Memory monitoring** prevents slowdowns
- **Active file only** coloring for optimal performance

### Reading Mode Note
For best results in Reading mode, enable **"Force full render"** in settings. This ensures smooth coloring but is disabled by default to prevent potential performance issues.

---

## Real-World Uses
- **Status tracking**: Color `TODO`, `INPROGRESS`, `DONE` in different colors
- **Writing projects**: Highlight character names, locations, and key plot points
- **Learning & study**: Make key terms and vocabulary stand out
- **Technical documentation**: Color code warnings, notes, and important sections
- **Project management**: Highlight priorities like `!!!URGENT!!!` or `Low-Effort`

![Use case examples](https://github.com/user-attachments/assets/e16e3121-2c14-43fe-b022-9e442d031f25)

---

## Installation
Available in Obsidian Community Plugins. Check [Release Notes](https://github.com/Kazi-Aidah/always-color-text/releases) for updates and new features.

**Known issue**: Colored text inside links may render without your set color in Live Preview mode due to Obsidian's rendering engine.

### Questions or Suggestions?
Create a new issue [here](https://github.com/Kazi-Aidah/always-color-text/issues) to report bugs or request new features!

---

## My personal favourite use cases,
![Double Quotes Example](assets/double-quotes-example.png)
pattern: `"[^"]*"`
requirements: Disable Regex Safety

![Single Quote Example](assets/single-quote-example.png)
pattern: `'[^']*'`
requirements: Disable Regex Safety

![Tasks Example](assets/tasks-ss.png)