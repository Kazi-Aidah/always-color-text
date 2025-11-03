## Always Color Text
This plugin lets you color specific words and updates it across your Obsidian vault. Just select a word, pick a color, and that word will automatically appear in that color every time you type it, in both live preview and reading modes.

![Example](https://github.com/user-attachments/assets/9c38d1f9-e2fb-4291-b68e-23d96837ebce)

This was inspired by the <span style="color: #2d98da">warn</span> <span style="color: #e5a216">deprecated</span> text I’d see in the terminal. I thought it’d be so cool, especially since I often need to repeat a bunch of categorized words!

## Key Features
Assign colors to words or phrases that stay consistent across your vault, right from the right-click menu, command palette or the plugin settings.

![Image](https://github.com/user-attachments/assets/43e5c595-ceaa-4193-b20b-86432554b5b4)
![Image](https://github.com/user-attachments/assets/1d558d80-de34-405c-b32d-141006ec0931)

Right-click to **Color Once**, **Highlight Once**, or add to the always-colored list. You can either color the text itself or highlight it with a background color.

![Image](https://github.com/user-attachments/assets/43717d51-8b5a-40e3-96ce-2fd35c1abb31)

You can choose your Coloring Style, whether you want to Colour the words or Highlight them across your vault.


Customize your **Own Color Swatches** for faster picking, you can even replace the default swatches.

![Image](https://github.com/user-attachments/assets/67e60575-8939-4111-979f-ec9bd4e6d6de)
![Image](https://github.com/user-attachments/assets/bab2aade-042d-4ab3-9c9e-3a95f75262f7)
    
Toggle Case-Sensitive and ***Partial-Word matching***. For example, if "Art" is colored blue and partial matching is enabled, any word containing "Art" will turn blue, like "Artist" or "Artbook".
<img width="1796" height="726" alt="Image" src="https://github.com/user-attachments/assets/c467045f-0cef-4285-82b4-dcb84bb7ff4f" />

There is Blacklisting, which can be added to the Right-click menu for easier access.
![Image](https://github.com/user-attachments/assets/190cde28-5e15-4cb7-8582-1a5abd0137fa)
<img width="548" height="192" alt="Image" src="https://github.com/user-attachments/assets/eda79d09-de1f-476a-9dcd-0729de4f6161" />

Disable coloring for specific files, or toggle **Global Coloring** ON or OFF via the ribbon, status bar, or command palette.
![Image](https://github.com/user-attachments/assets/83d2aa60-d7a0-49d2-9338-e92bcb0933b0)
<img width="1796" height="882" alt="Image" src="https://github.com/user-attachments/assets/657fce97-13e7-457e-ad35-826452cecb3b" />

When Global Coloring is off, Texts coloured with "Always Color Text" disappear but one-time colors remain, since they use inline HTML.
    
Use the tiny “Delete All Words” button to clear everything, with a confirmation modal, just to be safe :D
![Image](https://github.com/user-attachments/assets/4767546e-e646-4e96-b89e-9df0b38abe70)

Frontmatter YAML works too, you can use this to hide colors for the specific document.
```
---
always-color-text: false
---
```

## Use Cases
- **Status Tracking:** Color `TODO`, `INPROGRESS`, and `DONE` in different colors.
- **Name Highlighting:** Color names, words, and sentences to recognize them at a glance from their colors alone!
- **People & Characters:** Color names in novels or RPG notes.
- **Priority Systems:** Highlight `!!!URGENT!!!` or `Low-Effort`.
- **Learning:** Color key vocabulary terms in study notes.
<img width="1113" height="433" alt="repeating words example" src="https://github.com/user-attachments/assets/e16e3121-2c14-43fe-b022-9e442d031f25" />

# Installation:
This plugin is now available on Obsidian Community Plugins!

## TO-DO:
- [ ] Allow folder-specific colouring
