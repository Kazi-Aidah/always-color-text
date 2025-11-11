![Version](https://img.shields.io/github/manifest-json/v/Kazi-Aidah/always-color-text?style=for-the-badge&color=9ccfd8&labelColor=26233a) ![Downloads](https://img.shields.io/badge/Downloads-748+-brightgreen?style=for-the-badge&labelColor=26233a)  ![Stars](https://img.shields.io/github/stars/Kazi-Aidah/always-color-text?style=for-the-badge&color=c4a7e7&labelColor=26233a) ![Last update](https://img.shields.io/github/last-commit/Kazi-Aidah/always-color-text?style=for-the-badge&color=ebbcba&labelColor=26233a)

## Always Color Text
Color keywords, status words, dates, names, anything! Once assigned, the color triggers everywhere in your vault, in Live Preview and Reading view.

Just select a word, pick a color, and that word will automatically appear in that color every time you type it, in both live preview and reading modes. ![Different Styles in different Folders](https://github.com/user-attachments/assets/905f5f4b-8b8b-440a-b00f-b32548e721db)

![Example](https://github.com/user-attachments/assets/9c38d1f9-e2fb-4291-b68e-23d96837ebce)

This was inspired by the warn deprecated text I'd see in the terminal. I thought it'd be so cool, especially since I often need to repeat a bunch of categorized words!

## Key Features

Assign colors to words or phrases that stay consistent across your vault, right from the right-click menu, command palette, or the plugin settings.

![Image](https://github.com/user-attachments/assets/43e5c595-ceaa-4193-b20b-86432554b5b4) ![Image](https://github.com/user-attachments/assets/1d558d80-de34-405c-b32d-141006ec0931)

Right-click to **Color Once**, **Highlight Once**, or add to the always-colored list. You can either color the text itself or highlight it with a background color.

![Image](https://github.com/user-attachments/assets/43717d51-8b5a-40e3-96ce-2fd35c1abb31)

Choose your Coloring Style, whether you want to color the words or highlight them across your vault. ![Document](https://github.com/user-attachments/assets/d7797516-93ae-4f13-b571-e70fc290d164)

Customize your **Own Color Swatches** for faster picking, you can even replace the default swatches.

![Image](https://github.com/user-attachments/assets/67e60575-8939-4111-979f-ec9bd4e6d6de) ![Image](https://github.com/user-attachments/assets/bab2aade-042d-4ab3-9c9e-3a95f75262f7)

Toggle Case-Sensitive and **Partial-Word matching**. For example, if "Art" is colored blue and partial matching is enabled, any word containing "Art" will turn blue, like "Artist" or "Artbook".

![Image](https://github.com/user-attachments/assets/c467045f-0cef-4285-82b4-dcb84bb7ff4f)

Blacklisting can be added to the right-click menu for easier access.

![Image](https://github.com/user-attachments/assets/190cde28-5e15-4cb7-8582-1a5abd0137fa) ![Image](https://github.com/user-attachments/assets/eda79d09-de1f-476a-9dcd-0729de4f6161)


### File & Folder Coloring Exclusion

Disable coloring for specific files, or toggle **Global Coloring** ON or OFF via the ribbon, status bar, or command palette.


![Image](https://github.com/user-attachments/assets/83d2aa60-d7a0-49d2-9338-e92bcb0933b0) ![Image](https://github.com/user-attachments/assets/657fce97-13e7-457e-ad35-826452cecb3b)


When Global Coloring is off, text colored with "Always Color Text" disappears, but one-time colors remain since they use inline HTML.


YAML Frontmatter works too, you can use this to hide colors for specific documents:

```
---
always-color-text: false
---
```

For folders, you can target different folders to have different styles, or no colour at all!

![Folder Specific Exclusion Settings](https://github.com/user-attachments/assets/a6920d6d-9cd9-410a-bf60-0c556b15cb2e)


## Advanced Regex Support

Enable powerful pattern matching using JavaScript regular expressions. When "Use regex" is checked for an entry, your pattern becomes a full regex with advanced capabilities:
![](https://github.com/user-attachments/assets/8bafe832-7d95-46ac-ae2d-8580fa010138)
You will have to enable regex support for this.


### Supported Features

- **Lookahead/lookbehind**: `(?<=\$)\d+` (numbers after dollar signs)
- **Unicode properties**: `\p{Emoji}+` (match emojis, requires `u` flag)
- **Word boundaries**: `\bTODO\b` (match "TODO" as whole word only)
- **Character classes**: `[A-Z]{2,}` (2+ uppercase letters)
- **Alternation**: `TODO|DONE|WIP` (multiple status words)

### Available Flags

- `g` - Global match (always enabled for matching)
- `i` - Case insensitive (auto-added if case-sensitive setting is off)
- `m` - Multiline mode
- `s` - Dot matches newlines
- `u` - Unicode mode (enables `\p{...}` properties)
- `y` - Sticky matching

### Examples

- `\b[A-Z]{3,}\b` - Match acronyms (3+ capital letters)
- `\$\d+\.\d{2}` - Match currency amounts like `$29.99`
- `\p{Script=Han}+` - Match Chinese characters (with `u` flag)
- `^#\s+.*$` - Match heading lines (start with # and space)

_Note: For literal text with special characters like `.` or `*`, leave "Use regex" unchecked - they'll be matched exactly._


### Safety and Pattern Restrictions
To ensure optimal performance and prevent freezing, the plugin includes automatic safety measures:
- **Pattern Validation**: Complex patterns that might cause performance issues are automatically blocked.
- **Progressive Loading**: Colors visible content first, then processes the rest during browser idle time.
- **Active File Only**: Only colors the file you're currently viewing for better performance.
- **Memory Monitoring**: Automatically cleans up if memory usage gets too high.

#### Reading Mode Safety
Coloring in reading mode is buggy by default. To make the text color smoothly, please turn on **"Force full render in Reading mode"**. Just note that this *might* cause performance issues.

![](https://github.com/user-attachments/assets/ed7d77c4-277a-4544-8dfe-a9d61fb9ac7c)

I tested it with 200,000-character documents without any issues, but to protect users from potential freezing, this setting is disabled by default.


Now, if you're going to be using expressions...

## Practical Regex Examples
Here are ready-to-use regex patterns for common scenarios!!

### **Date & Time Patterns**
```regex
# YYYY-MM-DD (2009-01-19)
\b\d{4}-\d{2}-\d{2}\b

# or a lighter date format
\b\d{4}-[A-Za-z]+-\d{1,2}\b

# Time patterns (Targets 14:30, 9:05 AM, 12:30pm)
\b(?:1[0-2]|0?[1-9]):[0-5][0-9]\s?(?:AM|PM)?\b

# Time Pattern Only (Targets 9:05 AM & 12:30pm but not 13:20)
\b(?:1[0-2]|0?[1-9]):[0-5][0-9](?:am|pm)\b

# Relative dates (today, tomorrow, next week)
\b(?:today|tomorrow|yesterday|next week|last week)\b
```

### **URLs & Links Patterns**
```regex
# Basic URLs (https://kaziaidah.dev.pages)
https?://(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})

# Markdown links
\[[^\]]+\]\(https?://[^)]+\)

# Simple domain names
\b[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\b
```

### **Status & Priority Systems**
```regex
# Common status words
\b(?:TODO|DONE|WIP|INPROGRESS|BLOCKED|REVIEW|URGENT)\b

# Priority indicators (!!!URGENT!!!, *IMPORTANT*)
\b!{2,}.+!{2,}\b|\*{1,}.+\*{1,}\b

# Progress percentages (25%, 100%)
\b\d{1,3}%\b
```

### **People & Names**
```regex
# Capitalized names
\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b

# Email addresses
\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b

# Username mentions (@username)
@[a-zA-Z0-9_]+

# Code-like patterns (variable_name, functionName)
\b[a-z_][a-z0-9_]*\b
```

### **Numbers & Measurements**
```regex
# Currency ($29.99, €50, ¥1000)
\$\d+(?:\.\d{2})?|\b[€£¥]\d+(?:\.\d{2})?\b

# Measurements (25kg, 180cm, 98.6°F)
\b\d+(?:\.\d+)?(?:kg|cm|m|km|°C|°F|lbs)\b

# Phone numbers (basic pattern)
\b\d{3}[-.]?\d{3}[-.]?\d{4}\b
```

#### Blocked Patterns
The following types of patterns are automatically blocked for safety:
- Nested quote patterns (e.g., `"[^"]*"`, `'[^']*'`)
- Patterns with nested quantifiers (e.g., `(\w+)*`, `(a+)+`)
- Complex lookarounds and backreferences (e.g., `(?<=...)`, `\1`)
- Deeply nested groups and exponential patterns
- Patterns known to cause catastrophic backtracking

When a pattern is blocked, you'll see a notice explaining why. Use simpler alternatives from the [Practical Regex Examples](#practical-regex-examples) section.


### Quick Tips for Using These Patterns
1. **Enable "Treat Pattern as Expression"** (The checkbox) in your color entry settings
2. **Test patterns** in a regex tester first if unsure
3. **Use flags wisely**:
    - `i` for case-insensitive matching
    - `u` for Unicode/emoji patterns
4. **Start simple** - test basic patterns before complex ones

**Example**: To color all dates in blue:

- Pattern: `\b\d{4}-\d{2}-\d{2}\b`
- Enable the Checkbox beside the color circle.
- Color: Blue
![Blue Dates Example](https://github.com/user-attachments/assets/b5ab1939-6de5-4092-be09-ce2fc6d5c83c)
## Use Cases

- **Status Tracking:** Color `TODO`, `INPROGRESS`, and `DONE` in different colors
- **Name Highlighting:** Color names, words, and sentences to recognize them at a glance
- **People & Characters:** Color names in novels or RPG notes
- **Priority Systems:** Highlight `!!!URGENT!!!` or `Low-Effort`
- **Learning:** Color key vocabulary terms in study notes
- **Advanced Patterns:** Use regex to match complex patterns like dates, currencies, or specific text structures

![repeating words example](https://github.com/user-attachments/assets/e16e3121-2c14-43fe-b022-9e442d031f25)

## Installation
This plugin is now available on Obsidian Community Plugins!
