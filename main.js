var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/i18n/en.js
var require_en = __commonJS({
  "src/i18n/en.js"(exports2, module2) {
    module2.exports = {
      // Plugin Metadata & Basic Labels
      "__name": "English",
      "settings_title": "Always Color Text Settings",
      "header_plugin_name": "Always Color Text",
      "ribbon_title": "Always color text",
      // Language Settings
      "language_label": "Language",
      "language_desc": "Select the language to be used in this plugin",
      "language_en": "English",
      "language_es": "Spanish",
      "language_fr": "French",
      "language_eu": "Basque",
      "language_ru": "Russian",
      "language_auto": "System Default",
      // Release Notes
      "latest_release_notes_label": "Latest Release Notes",
      "latest_release_notes_desc": "View the most recent plugin release notes",
      "open_changelog_button": "Open Changelog",
      "command_show_release_notes": "Show Latest Release Notes",
      "changelog_view_on_github": "View on GitHub",
      "changelog_loading": "Loading releases\u2026",
      "changelog_no_info": "No release information available.",
      "changelog_release": "Release",
      "changelog_no_notes": "No notes",
      "changelog_failed_to_load": "Failed to load release notes.",
      // UI Elements & Menus
      "file_menu_enable": "Enable always color text for this file",
      "file_menu_disable": "Disable always color text for this file",
      "menu_color_once": "Color Once",
      "menu_highlight_once": "Highlight Once",
      "menu_always_color_text": "Always color text",
      "menu_remove_always_color_text": "Remove Always Color Text",
      "menu_blacklist_word": "Blacklist Word from Coloring",
      "show_toggle_statusbar": "Show Toggle in Status Bar",
      "show_toggle_ribbon": "Show Toggle icon in ribbon",
      "show_toggle_command": "Show Toggle in command",
      "show_blacklist_menu": "Show Blacklist words in right-click menu",
      "show_blacklist_menu_desc": "Adds a right-click menu item to blacklist selected text from coloring.",
      "tooltip_enable_for_file": "Enable for this file",
      "tooltip_delete_all_words": "Delete all defined words/patterns",
      "tooltip_delete_all_blacklist": "Delete all blacklisted words/patterns",
      "tooltip_use_regex": "Use as regex pattern",
      "drag_to_reorder": "Drag to reorder",
      "reset_text_color": "Reset Text Color",
      "reset_highlight": "Reset Highlight",
      // Commands
      "command_color_selected": "Color Selected Text",
      "command_toggle_current": "Enable/Disable coloring for current document",
      "command_toggle_global": "Enable/Disable Always Color Text",
      "command_manage_advanced_rules": "Manage Advanced Rules",
      "command_open_regex_tester": "Add Regex (Open Regex Tester)",
      "command_open_blacklist_regex_tester": "Add Blacklist Regex",
      "command_manage_colored_texts": "Manage Colored Texts",
      "command_toggle_hide_text_colors": "Hide/Unhide Text Colors",
      "command_toggle_hide_highlights": "Hide/Unhide Highlights",
      // Notifications
      "notice_enabled": "Always color text enabled",
      "notice_disabled": "Always color text disabled",
      "notice_blacklisted_cannot_color": '"{word}" is blacklisted and cannot be colored.',
      "notice_removed_always_color": 'Removed always coloring for "{word}".',
      "notice_added_to_blacklist": '"{word}" added to blacklist.',
      "notice_already_blacklisted": '"{word}" is already blacklisted.',
      "notice_select_text_first": "Please select some text first.",
      "notice_no_active_file": "No active file to toggle coloring for.",
      "notice_coloring_enabled_for_path": "Coloring enabled for {path}",
      "notice_coloring_disabled_for_path": "Coloring disabled for {path}",
      "notice_global_enabled": "Always Color Text Enabled",
      "notice_global_disabled": "Always Color Text Disabled",
      "notice_unable_open_changelog": "Unable to open changelog modal.",
      "notice_pattern_blocked": "Pattern blocked for Memory Safety:",
      "notice_pattern_too_complex": "Pattern too complex:",
      "notice_invalid_hex_format": "Invalid hex color format. Use #RRGGBB or #RGB.",
      "notice_error_saving_changes": "Error saving changes. Please try again.",
      "notice_invalid_color_format": "Invalid color format.",
      "notice_exported": "Exported: {fname}",
      "notice_export_failed": "Export failed",
      "notice_import_completed": "Import completed",
      "notice_import_failed": "Import failed",
      "notice_invalid_regex": "Invalid regular expression",
      "notice_empty_pattern": "Pattern is empty",
      "notice_added_regex": "Regex added",
      "notice_rule_updated": "Rule updated",
      "notice_regex_updated": "Regex updated",
      "notice_entry_updated": "Entry updated",
      "notice_entry_duplicated": "Entry duplicated",
      "notice_error_opening_regex_tester": "Error opening regex tester",
      "notice_error_opening_blacklist_regex_tester": "Error opening blacklist regex tester",
      "notice_error_opening_advanced_rules": "Error opening advanced rules modal",
      "notice_text_color_reset": "Text color reset",
      "notice_highlight_reset": "Highlight color reset",
      "notice_text_colors_hidden": "Text colors hidden",
      "notice_text_colors_visible": "Text colors visible",
      "notice_highlights_hidden": "Highlights hidden",
      "notice_highlights_visible": "Highlights visible",
      "notice_regex_support_disabled": "Regex support is disabled. Enable it in settings to use regex patterns.",
      "notice_no_active_file_to_disable": "No active file to disable coloring for.",
      "notice_already_disabled_for_path": "Coloring is already disabled for {path}",
      // Confirmation Dialogs
      "confirm_delete_all_title": "Delete all words",
      "confirm_delete_all_desc": "Are you sure you want to delete all your colored words/patterns? You can't undo this!",
      "confirm_delete_all_blacklist_title": "Delete all blacklisted words",
      "confirm_delete_all_blacklist_desc": "Are you sure you want to delete all blacklist entries? You can't undo this!",
      "restart_required_title": "Restart required",
      "restart_required_desc": "Disabling the command palette toggle requires restarting Obsidian to fully remove commands from the palette. Restart now?",
      // Basic Settings
      "enable_document_color": "Enable document color",
      "color_in_reading_mode": "Color in reading mode",
      "force_full_render_reading": "Force full render in Reading mode",
      "force_full_render_reading_desc": "When ON, reading-mode will attempt to color the entire document in one pass. May cause performance issues on large documents. Use with caution!",
      "disable_coloring_current_file": "Disable coloring for current file",
      "disable_coloring_current_file_desc": "Adds an exclude rule for the active file under File & Folder Coloring Rules.",
      "btn_disable_for_this_file": "Disable for this file",
      // Coloring Settings
      "coloring_settings_header": "Coloring Settings",
      "regex_support": "Regex support",
      "regex_support_desc": "Allow patterns to be regular expressions. Invalid regexes are ignored for safety.",
      "disable_regex_safety": "Disable regex safety",
      "disable_regex_safety_desc": "Allow complex or potentially dangerous expressions. May cause performance issues or freezes.",
      "case_sensitive": "Case sensitive",
      "case_sensitive_desc": `If this is on, "word" and "Word" are treated as different. If it's off, they're colored the same.`,
      "partial_match": "Partial match",
      "partial_match_desc": 'If enabled, the whole word will be colored if any colored word is found inside it (e.g., "as" colors "Jasper").',
      // One-Time Actions
      "one_time_actions_header": "One-Time Actions",
      "setting_color_once": "Color Once",
      "setting_color_once_desc": "Inserts HTML inline for the selected text. This persists even if the plugin is turned off.",
      "setting_highlight_once": "Highlight Once",
      "setting_highlight_once_desc": "Inserts HTML inline with background styling. This persists even if the plugin is turned off.",
      "highlight_once_preview": "Highlight Once Preview",
      "highlight_once_preview_text": "This is how Highlight Once will look like!",
      // Highlight Once Settings
      "highlight_once_opacity": "Highlight once opacity",
      "highlight_once_border_radius": "Highlight once border radius (px)",
      "reset_to_8": "Reset to 8",
      "highlight_horizontal_padding": "Highlight horizontal padding (px)",
      "reset_to_4": "Reset to 4",
      "enable_border_highlight_once": "Enable Border for Highlight Once",
      "enable_border_highlight_once_desc": "Add a border to your inline highlight. The added HTML/CSS WILL be long.",
      "highlight_once_border_style": "Highlight Once Border Style",
      "opt_border_full": "Full border (all sides)",
      "opt_border_top_bottom": "Top & Bottom borders",
      "opt_border_left_right": "Left & Right borders",
      "opt_border_top_right": "Top & Right borders",
      "opt_border_top_left": "Top & Left borders",
      "opt_border_bottom_right": "Bottom & Right borders",
      "opt_border_bottom_left": "Bottom & Left borders",
      "opt_border_top": "Top border only",
      "opt_border_bottom": "Bottom border only",
      "opt_border_left": "Left border only",
      "opt_border_right": "Right border only",
      "highlight_once_border_opacity": "Highlight Once Border Opacity",
      "highlight_once_border_thickness": "Highlight Once Border Thickness (px)",
      "reset_to_1": "Reset to 1",
      "use_global_highlight_style": "Use Global Highlight Style for Highlight Once",
      "use_global_highlight_style_desc": "Uses your global inline style. The added HTML/CSS may be long.",
      "style_highlight_once": "Style Highlight Once",
      "style_highlight_once_desc": "Uses your custom inline style. The added HTML/CSS may be long.",
      // Global Highlight Appearance
      "global_highlight_appearance_header": "Global Highlight Coloring Appearance",
      "highlight_opacity": "Highlight opacity",
      "highlight_opacity_desc": "Set the opacity of the highlight (0-100%)",
      "highlight_border_radius": "Highlight border radius (px)",
      "highlight_border_radius_desc": "Set the border radius (in px) for rounded highlight corners",
      "highlight_horizontal_padding_desc": "Set the left and right padding (in px) for highlighted text",
      "rounded_corners_wrapping": "Rounded corners on line wrapping",
      "rounded_corners_wrapping_desc": "When enabled, highlights will have rounded corners on all sides, even when text wraps to a new line.",
      "enable_highlight_border": "Enable Highlight Border",
      "enable_highlight_border_desc": "Add a border around highlights. The border will match the text or highlight color.",
      "border_style": "Border Style",
      "border_style_desc": "Choose which sides to apply the border",
      "border_opacity": "Border Opacity",
      "border_opacity_desc": "Set the opacity of the border (0-100%)",
      "border_thickness": "Border Thickness (px)",
      "border_thickness_desc": "Set the border thickness from 0-5 pixels (e.g. 1, 2.5, 5)",
      "highlight_preview": "Highlight Preview",
      "highlight_preview_text": "This is how your highlight will look like!",
      // Color Swatches
      "color_swatches_header": "Color Swatches",
      "color_picker_layout": "Color Picker Layout",
      "color_picker_layout_desc": "Choose which color types to show when picking colors for text",
      "opt_both_text_left": "Both: Text left, Highlight right",
      "opt_both_bg_left": "Both: Highlight left, Text right",
      "opt_text_only": "Text color only",
      "opt_background_only": "Highlight color only",
      "replace_default_swatches": "Replace default swatches",
      "replace_default_swatches_desc": "If this is on, only your custom colors will show up in the color picker. No default ones!",
      "enable_custom_swatches": "Enable custom swatches",
      "enable_custom_swatches_desc": "If this is on, your custom swatches will show up in the color picker.",
      "use_swatch_names": "Use swatch names for coloring text",
      "use_swatch_names_desc": "Show a dropdown of swatch names next to word/pattern inputs",
      "default_colors_header": "Default Colors",
      "custom_swatches_header": "Custom Swatches",
      "btn_add_color": "+ Add color",
      "no_custom_swatches_yet": 'No custom swatches yet. Click "+ Add color" to create one.',
      "label_built_in": "(built-in)",
      // Color Picker
      "pick_color_header": "Pick Color",
      "selected_text_preview": "Selected Text",
      "text_color_title": "Text color",
      "select_swatch": "Select swatch\u2026",
      "highlight_color_title": "Highlight color",
      "select_highlight_swatch": "Select highlight swatch\u2026",
      // Always Colored Texts
      "always_colored_texts_header": "Always Colored Texts",
      "always_colored_texts_desc": "Here's where you manage your word/patterns and their colors.",
      "search_colored_words_placeholder": "Search colored words/patterns\u2026",
      "sort_label_last-added": "Sort: Last Added",
      "sort_label_a-z": "Sort: A-Z",
      "sort_label_reverse-a-z": "Sort: Z-A",
      "sort_label_style-order": "Sort: Style Order",
      "sort_label_color": "Sort: Color",
      "btn_add_new_word": "+ Add new colored word / pattern",
      "style_type_text": "color",
      "style_type_highlight": "highlight",
      "style_type_both": "both",
      "word_pattern_placeholder_long": "pattern, word or comma-separated words (e.g. hello, world, foo)",
      "word_pattern_placeholder_short": "Keyword or pattern, or comma-separated words",
      "use_regex": "Use Regex",
      "flags_placeholder": "flags",
      "text_or_regex_placeholder": "text / regex input",
      "duplicate_entry": "Duplicate entry",
      "open_in_regex_tester": "Open in Regex Tester",
      "no_rules_configured": "No rules configured.",
      "no_rules_found": "No rules found.",
      // Presets
      "btn_presets": "Presets",
      "preset_all_headings": "All Headings (H1-H6)",
      "preset_bullet_points": "Bullet Points",
      "preset_numbered_lists": "Numbered Lists",
      "preset_task_checked": "Task List (Checked)",
      "preset_task_unchecked": "Task List (Unchecked)",
      "preset_dates_yyyy_mm_dd": "Dates (YYYY-MM-DD)",
      "preset_times_am_pm": "Times (AM/PM)",
      "preset_dates_yyyy_mmm_dd": "Dates (YYYY-MMM-DD)",
      "preset_relative_dates": "Relative dates",
      "preset_basic_urls": "Basic URLs",
      "preset_markdown_links": "Markdown links",
      "preset_domain_names": "Domain names",
      "preset_email_addresses": "Email addresses",
      "preset_at_username": "@username",
      "preset_currency": "Currency",
      "preset_measurements": "Measurements",
      "preset_phone_numbers": "Phone numbers",
      "preset_all_texts": "All texts",
      "preset_codeblocks": "Codeblocks",
      "preset_inline_comments": "Comments (%%\u2026%%)",
      "preset_parentheses": "Parentheses ()",
      "preset_square_brackets": "Square Brackets []",
      "preset_curly_braces": "Curly Braces {}",
      "preset_angle_brackets": "Angle Brackets <>",
      "preset_colons": "Colons :",
      "preset_double_quotes": 'Double Quotes ""',
      "preset_single_quotes": "Single Quotes ''",
      "preset_single_quotes_word_bounded": "Single Quotes '' (word-bounded)",
      "preset_group_markdown_formatting": "Markdown Formatting",
      "preset_group_other_patterns": "Other Patterns",
      "preset_group_brackets": "Brackets",
      // Blacklist Settings
      "blacklist_words_header": "Blacklist words",
      "blacklist_words_desc": "Keywords or patterns here will never be colored, even for partial matches.",
      "search_blacklist_placeholder": "Search blacklisted words or patterns\u2026",
      "blacklist_sort_label_last-added": "Sort: Last Added",
      "blacklist_sort_label_a-z": "Sort: A-Z",
      "blacklist_sort_label_reverse-a-z": "Sort: Z-A",
      "btn_add_blacklist": "+ Add blacklist word or pattern",
      "btn_add_to_blacklist": "+ Add to Blacklist",
      "btn_add_blacklist_word": "+ Add blacklist word",
      "btn_add_blacklist_regex": "+ Add blacklist regex",
      // File & Folder Rules
      "file_folder_rules_header": "File & Folder Coloring Rules",
      "file_folder_rules_desc": "Control coloring with name matching, exact paths, or regex patterns. Leave an empty exclude entry to disable coloring vault-wide.",
      "search_file_folder_rules_placeholder": "Search file/folder rules\u2026",
      "path_sort_label_last-added": "Sort: Last Added",
      "path_sort_label_a-z": "Sort: A-Z",
      "path_sort_label_reverse-a-z": "Sort: Z-A",
      "path_sort_label_mode": "Sort: Mode",
      "path_sort_label_type": "Sort: Type",
      "btn_add_file_folder_rule": "+ Add file/folder rule",
      "disabled_files_header": "Files with coloring disabled:",
      // Advanced Settings - Inclusion Exclusion Labels
      "path_rule_mode_include": "Include",
      "path_rule_mode_exclude": "Exclude",
      "text_rule_mode_include": "only colors in (whitelist)",
      "text_rule_mode_exclude": "does not color in (blacklist)",
      "mode_only_colors_in": "only colors in",
      "mode_does_not_color_in": "does not color in",
      "label_text_include": "Whitelist",
      "label_text_exclude": "Blacklist",
      "enter_path_or_pattern": "Enter path or pattern",
      "label_regex": "Regex",
      // Advanced Rules
      "advanced_rules_header": "Advanced Rules",
      "advanced_rules_modal_header": "Advanced Rules",
      "advanced_rules_manage_button": "manage advanced rules",
      "edit_rule_header": "Edit Rule",
      "add_rule_header": "Add New Rule",
      "btn_add_rule": "+ Add Rule",
      "btn_save_rule": "Save Rule",
      "btn_add_words": "+ Add Words",
      "btn_add_regex": "+ Add Regex",
      "btn_save_regex": "Save Regex",
      // Regex Tester
      "regex_tester_header": "Regex Tester",
      "regex_tester_blacklist": "Regex tester - blacklist",
      "regex_expression_placeholder": "Put your Regex Expression here",
      "regex_subject_placeholder": "type your subject / test string here...",
      "regex_name_placeholder": "name your regex",
      "matches": "matches",
      "matches_found": "matches found",
      // Regex Flags
      "flag_g": "global flag: find all matches",
      "flag_i": "case-insensitive flag",
      "flag_m": "multiline flag: ^ and $ match line boundaries",
      "flag_s": "dotAll flag: . matches newlines",
      "flag_u": "unicode flag: treat as unicode code points",
      "flag_y": "sticky flag: match from lastIndex position",
      // Data Export/Import
      "data_export_import_header": "Data Export/Import",
      "export_plugin_data": "Export plugin data",
      "export_plugin_data_desc": "Export settings, words, and rules to a JSON file.",
      "btn_export": "Export",
      "import_plugin_data": "Import plugin data",
      "import_plugin_data_desc": "Import settings from a JSON file",
      "btn_import": "Import"
    };
  }
});

// src/i18n/es.js
var require_es = __commonJS({
  "src/i18n/es.js"(exports2, module2) {
    module2.exports = {
      // Plugin Metadata & Basic Labels
      "__name": "Espa\xF1ol",
      "settings_title": "Configuraci\xF3n de Always Color Text",
      "header_plugin_name": "Always Color Text",
      "ribbon_title": "Always color text",
      // Language Settings
      "language_label": "Idioma",
      "language_desc": "Selecciona el idioma que se utilizar\xE1 en este plugin",
      "language_en": "Ingl\xE9s",
      "language_es": "Espa\xF1ol",
      "language_fr": "Franc\xE9s",
      "language_eu": "Euskera",
      "language_ru": "Ruso",
      "language_auto": "Predeterminado del Sistema",
      // Release Notes
      "latest_release_notes_label": "Notas de la \xDAltima Versi\xF3n",
      "latest_release_notes_desc": "Ver las notas de la versi\xF3n m\xE1s reciente del plugin",
      "open_changelog_button": "Abrir Registro de Cambios",
      "command_show_release_notes": "Mostrar Notas de la \xDAltima Versi\xF3n",
      "changelog_view_on_github": "Ver en GitHub",
      "changelog_loading": "Cargando versiones\u2026",
      "changelog_no_info": "No hay informaci\xF3n de versi\xF3n disponible.",
      "changelog_release": "Versi\xF3n",
      "changelog_no_notes": "Sin notas",
      "changelog_failed_to_load": "Error al cargar las notas de la versi\xF3n.",
      // UI Elements & Menus
      "file_menu_enable": "Activar always color text para este archivo",
      "file_menu_disable": "Desactivar always color text para este archivo",
      "menu_color_once": "Colorear Una Vez",
      "menu_highlight_once": "Resaltar Una Vez",
      "menu_always_color_text": "Always color text",
      "menu_remove_always_color_text": "Eliminar Always Color Text",
      "menu_blacklist_word": "A\xF1adir Palabra a la Lista Negra",
      "show_toggle_statusbar": "Mostrar Alternador en Barra de Estado",
      "show_toggle_ribbon": "Mostrar icono de alternancia en la cinta",
      "show_toggle_command": "Mostrar Alternador en comandos",
      "show_blacklist_menu": "Mostrar lista negra en el men\xFA contextual",
      "show_blacklist_menu_desc": "A\xF1ade un elemento al men\xFA contextual para a\xF1adir el texto seleccionado a la lista negra del coloreado.",
      "tooltip_enable_for_file": "Activar para este archivo",
      "tooltip_delete_all_words": "Eliminar todas las palabras/patrones definidos",
      "tooltip_delete_all_blacklist": "Eliminar todas las palabras/patrones de la lista negra",
      "tooltip_use_regex": "Usar como patr\xF3n regex",
      "drag_to_reorder": "Arrastra para reordenar",
      "reset_text_color": "Restablecer color de texto",
      "reset_highlight": "Restablecer resaltado",
      // Commands
      "command_color_selected": "Colorear Texto Seleccionado",
      "command_toggle_current": "Activar/Desactivar coloreado para el documento actual",
      "command_toggle_global": "Activar/Desactivar Always Color Text",
      "command_manage_advanced_rules": "Gestionar Reglas Avanzadas",
      "command_open_regex_tester": "A\xF1adir Regex (Abrir Probador de Regex)",
      "command_open_blacklist_regex_tester": "Agregar Expresi\xF3n Regular de Lista Negra",
      "command_manage_colored_texts": "Gestionar Textos Coloreados",
      "command_toggle_hide_text_colors": "Ocultar/Mostrar colores de texto",
      "command_toggle_hide_highlights": "Ocultar/Mostrar resaltados",
      // Notifications
      "notice_enabled": "Always color text activado",
      "notice_disabled": "Always color text desactivado",
      "notice_blacklisted_cannot_color": '"{word}" est\xE1 en la lista negra y no puede colorearse.',
      "notice_removed_always_color": 'Se elimin\xF3 el coloreado permanente de "{word}".',
      "notice_added_to_blacklist": '"{word}" a\xF1adido a la lista negra.',
      "notice_already_blacklisted": '"{word}" ya est\xE1 en la lista negra.',
      "notice_select_text_first": "Por favor, selecciona primero alg\xFAn texto.",
      "notice_no_active_file": "No hay un archivo activo para activar o desactivar el coloreado.",
      "notice_coloring_enabled_for_path": "Coloreado activado para {path}",
      "notice_coloring_disabled_for_path": "Coloreado desactivado para {path}",
      "notice_global_enabled": "Always Color Text Activado",
      "notice_global_disabled": "Always Color Text Desactivado",
      "notice_unable_open_changelog": "No se pudo abrir el modal del registro de cambios.",
      "notice_pattern_blocked": "Patr\xF3n bloqueado por Seguridad de Memoria:",
      "notice_pattern_too_complex": "Patr\xF3n demasiado complejo:",
      "notice_invalid_hex_format": "Formato de color hexadecimal inv\xE1lido. Usa #RRGGBB o #RGB.",
      "notice_error_saving_changes": "Error guardando cambios. Por favor, int\xE9ntalo de nuevo.",
      "notice_invalid_color_format": "Formato de color inv\xE1lido.",
      "notice_exported": "Exportado: {fname}",
      "notice_export_failed": "Error en la exportaci\xF3n",
      "notice_import_completed": "Importaci\xF3n completada",
      "notice_import_failed": "Error en la importaci\xF3n",
      "notice_invalid_regex": "Expresi\xF3n regular inv\xE1lida",
      "notice_empty_pattern": "El patr\xF3n est\xE1 vac\xEDo",
      "notice_added_regex": "Expresi\xF3n regular a\xF1adida",
      "notice_rule_updated": "Regla actualizada",
      "notice_regex_updated": "Expresi\xF3n regular actualizada",
      "notice_entry_updated": "Entrada actualizada",
      "notice_entry_duplicated": "Entrada duplicada",
      "notice_error_opening_regex_tester": "Error al abrir el probador de regex",
      "notice_error_opening_blacklist_regex_tester": "Error al abrir el probador de regex de lista negra",
      "notice_error_opening_advanced_rules": "Error al abrir el modal de reglas avanzadas",
      "notice_text_color_reset": "Color de texto restablecido",
      "notice_highlight_reset": "Resaltado restablecido",
      "notice_text_colors_hidden": "Colores de texto ocultos",
      "notice_text_colors_visible": "Colores de texto visibles",
      "notice_highlights_hidden": "Resaltados ocultos",
      "notice_highlights_visible": "Resaltados visibles",
      "notice_regex_support_disabled": "El soporte de regex est\xE1 deshabilitado. Habil\xEDtalo en la configuraci\xF3n para usar patrones regex.",
      "notice_no_active_file_to_disable": "No hay un archivo activo para desactivar el coloreado.",
      "notice_already_disabled_for_path": "El coloreado ya est\xE1 desactivado para {path}",
      "notice_filter_disabled": "Filtro deshabilitado",
      // Confirmation Dialogs
      "confirm_delete_all_title": "Eliminar todas las palabras",
      "confirm_delete_all_desc": "\xBFEst\xE1s seguro de que quieres eliminar todas tus palabras/patrones coloreados? \xA1No podr\xE1s deshacer esta acci\xF3n!",
      "confirm_delete_all_blacklist_title": "Eliminar todas las palabras de la lista negra",
      "confirm_delete_all_blacklist_desc": "\xBFEst\xE1s seguro de que quieres eliminar todas las entradas de la lista negra? \xA1No podr\xE1s deshacer esta acci\xF3n!",
      "restart_required_title": "Reinicio requerido",
      "restart_required_desc": "Desactivar el alternador de la paleta de comandos requiere reiniciar Obsidian para eliminar completamente los comandos de la paleta. \xBFReiniciar ahora?",
      // Basic Settings
      "enable_document_color": "Activar color de documento",
      "color_in_reading_mode": "Colorear en modo lectura",
      "force_full_render_reading": "Forzar renderizado completo en modo Lectura",
      "force_full_render_reading_desc": "Cuando est\xE1 ACTIVADO, el modo lectura intentar\xE1 colorear todo el documento de una vez. Puede causar problemas de rendimiento en documentos grandes. \xA1Usar con precauci\xF3n!",
      "disable_coloring_current_file": "Desactivar coloreado para el archivo actual",
      "disable_coloring_current_file_desc": "A\xF1ade una regla de exclusi\xF3n para el archivo activo dentro de las Reglas de Coloreado para Archivos y Carpetas.",
      "btn_disable_for_this_file": "Desactivar para este archivo",
      // Coloring Settings
      "coloring_settings_header": "Configuraci\xF3n de Coloreado",
      "regex_support": "Soporte para Regex",
      "regex_support_desc": "Permitir que los patrones sean expresiones regulares. Las regex inv\xE1lidas se ignoran por seguridad.",
      "disable_regex_safety": "Desactivar seguridad de regex",
      "disable_regex_safety_desc": "Permitir expresiones complejas o potencialmente peligrosas. Puede causar problemas de rendimiento o bloqueos.",
      "case_sensitive": "Sensible a may\xFAsculas",
      "case_sensitive_desc": 'Si est\xE1 activo, "palabra" y "Palabra" se tratan como diferentes. Si est\xE1 desactivado, se colorean igual.',
      "partial_match": "Coincidencia parcial",
      "partial_match_desc": 'Si est\xE1 habilitado, la palabra completa se colorear\xE1 si se encuentra cualquier palabra coloreada dentro de ella (ej., "as" colorea "Jasper").',
      // One-Time Actions
      "one_time_actions_header": "Acciones de Una Sola Vez",
      "setting_color_once": "Colorear Una Vez",
      "setting_color_once_desc": "Inserta HTML en l\xEDnea para el texto seleccionado. Persiste incluso si el plugin est\xE1 desactivado.",
      "setting_highlight_once": "Resaltar Una Vez",
      "setting_highlight_once_desc": "Inserta HTML en l\xEDnea con estilo de fondo. Persiste incluso si el plugin est\xE1 desactivado.",
      "highlight_once_preview": "Vista Previa de Resaltar Una Vez",
      "highlight_once_preview_text": "As\xED se ver\xE1 Resaltar Una Vez.",
      // Highlight Once Settings
      "highlight_once_opacity": "Opacidad de resaltado \xFAnico",
      "highlight_once_border_radius": "Radio del borde para resaltado \xFAnico (px)",
      "reset_to_8": "Restablecer a 8",
      "highlight_horizontal_padding": "Relleno horizontal del resaltado (px)",
      "reset_to_4": "Restablecer a 4",
      "enable_border_highlight_once": "Activar Borde para Resaltar Una Vez",
      "enable_border_highlight_once_desc": "A\xF1ade un borde a tu resaltado en l\xEDnea. El HTML/CSS a\xF1adido SER\xC1 extenso.",
      "highlight_once_border_style": "Estilo de Borde para Resaltar Una Vez",
      "opt_border_full": "Borde completo (todos los lados)",
      "opt_border_top_bottom": "Bordes superior e inferior",
      "opt_border_left_right": "Bordes izquierdo y derecho",
      "opt_border_top_right": "Bordes superior y derecho",
      "opt_border_top_left": "Bordes superior e izquierdo",
      "opt_border_bottom_right": "Bordes inferior y derecho",
      "opt_border_bottom_left": "Bordes inferior e izquierdo",
      "opt_border_top": "Solo borde superior",
      "opt_border_bottom": "Solo borde inferior",
      "opt_border_left": "Solo borde izquierdo",
      "opt_border_right": "Solo borde derecho",
      "highlight_once_border_opacity": "Opacidad del Borde para Resaltar Una Vez",
      "highlight_once_border_thickness": "Grosor del Borde para Resaltar Una Vez (px)",
      "reset_to_1": "Restablecer a 1",
      "use_global_highlight_style": "Usar estilo de resaltado global para Resaltar Una Vez",
      "use_global_highlight_style_desc": "Usa tu estilo en l\xEDnea global. El HTML/CSS a\xF1adido puede ser largo.",
      "style_highlight_once": "Estilo para Resaltar Una Vez",
      "style_highlight_once_desc": "Usa tu estilo en l\xEDnea personalizado. El HTML/CSS a\xF1adido puede ser largo.",
      // Global Highlight Appearance
      "global_highlight_appearance_header": "Apariencia Global del Resaltado",
      "highlight_opacity": "Opacidad del resaltado",
      "highlight_opacity_desc": "Establece la opacidad del resaltado (0-100%)",
      "highlight_border_radius": "Radio del borde del resaltado (px)",
      "highlight_border_radius_desc": "Establece el radio del borde (en px) para esquinas redondeadas en el resaltado",
      "highlight_horizontal_padding_desc": "Establece el relleno izquierdo y derecho (en px) para el texto resaltado",
      "rounded_corners_wrapping": "Esquinas redondeadas en ajuste de l\xEDnea",
      "rounded_corners_wrapping_desc": "Cuando est\xE1 habilitado, los resaltados mantendr\xE1n esquinas redondeadas incluso cuando el texto pase a otra l\xEDnea.",
      "enable_highlight_border": "Activar Borde del Resaltado",
      "enable_highlight_border_desc": "A\xF1ade un borde alrededor de los resaltados. El borde coincidir\xE1 con el color del texto o del resaltado.",
      "border_style": "Estilo del Borde",
      "border_style_desc": "Elige en qu\xE9 lados aplicar el borde",
      "border_opacity": "Opacidad del Borde",
      "border_opacity_desc": "Establece la opacidad del borde (0-100%)",
      "border_thickness": "Grosor del Borde (px)",
      "border_thickness_desc": "Establece el grosor del borde de 0 a 5 p\xEDxeles (ej. 1, 2.5, 5)",
      "highlight_preview": "Vista Previa del Resaltado",
      "highlight_preview_text": "\xA1As\xED es como se ver\xE1 tu resaltado!",
      // Color Swatches
      "color_swatches_header": "Muestras de Color",
      "color_picker_layout": "Disposici\xF3n del Selector de Color",
      "color_picker_layout_desc": "Elige qu\xE9 tipos de color mostrar al seleccionar colores para el texto",
      "opt_both_text_left": "Ambos: texto a la izquierda, resaltado a la derecha",
      "opt_both_bg_left": "Ambos: resaltado a la izquierda, texto a la derecha",
      "opt_text_only": "Solo color de texto",
      "opt_background_only": "Solo color de fondo",
      "replace_default_swatches": "Reemplazar muestras predeterminadas",
      "replace_default_swatches_desc": "Si est\xE1 activo, solo se mostrar\xE1n tus colores personalizados en el selector de color. \xA1No los predeterminados!",
      "enable_custom_swatches": "Activar muestras personalizadas",
      "enable_custom_swatches_desc": "Si est\xE1 activo, tus muestras personalizadas aparecer\xE1n en el selector de color.",
      "use_swatch_names": "Usar nombres de muestras para colorear texto",
      "use_swatch_names_desc": "Muestra un desplegable de nombres de muestras junto a las entradas de palabra/patr\xF3n",
      "default_colors_header": "Colores Predeterminados",
      "custom_swatches_header": "Muestras Personalizadas",
      "btn_add_color": "+ A\xF1adir color",
      "no_custom_swatches_yet": 'A\xFAn no hay muestras personalizadas. Haz clic en "+ A\xF1adir color" para crear una.',
      "label_built_in": "(integrado)",
      // Color Picker
      "pick_color_header": "Seleccionar Color",
      "selected_text_preview": "Texto Seleccionado",
      "text_color_title": "Color del texto",
      "select_swatch": "Seleccionar muestra\u2026",
      "highlight_color_title": "Color de resaltado",
      "select_highlight_swatch": "Seleccionar muestra de resaltado\u2026",
      // Always Colored Texts
      "always_colored_texts_header": "Textos Coloreados Permanentemente",
      "always_colored_texts_desc": "Aqu\xED es donde gestionas tus palabras/patrones y sus colores.",
      "search_colored_words_placeholder": "Buscar palabras/patrones coloreados\u2026",
      "sort_label_last-added": "Ordenar: \xDAltimo A\xF1adido",
      "sort_label_a-z": "Ordenar: A-Z",
      "sort_label_reverse-a-z": "Ordenar: Z-A",
      "sort_label_style-order": "Ordenar: Orden de Estilo",
      "sort_label_color": "Ordenar: Color",
      "btn_add_new_word": "+ A\xF1adir nueva palabra/patr\xF3n coloreado",
      "style_type_text": "color",
      "style_type_highlight": "resaltado",
      "style_type_both": "ambos",
      "word_pattern_placeholder_long": "patr\xF3n, palabra o palabras separadas por comas (ej. hola, mundo, foo)",
      "word_pattern_placeholder_short": "Palabra clave o patr\xF3n, o palabras separadas por comas",
      "use_regex": "Usar Regex",
      "flags_placeholder": "banderas",
      "text_or_regex_placeholder": "texto / entrada de regex",
      "duplicate_entry": "entrada duplicada",
      "open_in_regex_tester": "Abrir en Probador de Regex",
      "no_rules_configured": "No hay reglas configuradas.",
      "no_rules_found": "No se encontraron reglas.",
      // Presets
      "btn_presets": "Ajustes predeterminados",
      "preset_all_headings": "Todos los encabezados (H1-H6)",
      "preset_bullet_points": "Puntos de vi\xF1eta",
      "preset_numbered_lists": "Listas numeradas",
      "preset_task_checked": "Lista de tareas (marcada)",
      "preset_task_unchecked": "Lista de tareas (desmarcada)",
      "preset_dates_yyyy_mm_dd": "Fechas (YYYY-MM-DD)",
      "preset_times_am_pm": "Horas (AM/PM)",
      "preset_dates_yyyy_mmm_dd": "Fechas (YYYY-MMM-DD)",
      "preset_relative_dates": "Fechas relativas",
      "preset_basic_urls": "URLs b\xE1sicas",
      "preset_markdown_links": "Enlaces Markdown",
      "preset_domain_names": "Nombres de dominio",
      "preset_email_addresses": "Direcciones de correo",
      "preset_at_username": "@usuario",
      "preset_currency": "Moneda",
      "preset_measurements": "Mediciones",
      "preset_phone_numbers": "N\xFAmeros de tel\xE9fono",
      "preset_all_texts": "Todo el texto",
      "preset_codeblocks": "Bloques de c\xF3digo",
      "preset_inline_comments": "Comentarios (%%\u2026%%)",
      "preset_parentheses": "Par\xE9ntesis ()",
      "preset_square_brackets": "Corchetes []",
      "preset_curly_braces": "Llaves {}",
      "preset_angle_brackets": "\xC1ngulos <>",
      "preset_colons": "Dos puntos :",
      "preset_double_quotes": "Comillas dobles",
      "preset_single_quotes": "Comillas simples",
      "preset_single_quotes_word_bounded": "Comillas simples (l\xEDmites de palabra)",
      "preset_group_markdown_formatting": "Formato Markdown",
      "preset_group_other_patterns": "Otros Patrones",
      "preset_group_brackets": "Corchetes",
      // Blacklist Settings
      "blacklist_words_header": "Lista negra de palabras",
      "blacklist_words_desc": "Las palabras clave o patrones aqu\xED nunca se colorear\xE1n, incluso para coincidencias parciales.",
      "search_blacklist_placeholder": "Buscar palabras o patrones en lista negra\u2026",
      "blacklist_sort_label_last-added": "Ordenar: \xDAltimo A\xF1adido",
      "blacklist_sort_label_a-z": "Ordenar: A-Z",
      "blacklist_sort_label_reverse-a-z": "Ordenar: Z-A",
      "btn_add_blacklist": "+ A\xF1adir palabra o patr\xF3n a la lista negra",
      "btn_add_to_blacklist": "+ A\xF1adir a lista negra",
      "btn_add_blacklist_word": "+ A\xF1adir palabra a lista negra",
      "btn_add_blacklist_regex": "+ A\xF1adir regex a lista negra",
      // File & Folder Rules
      "file_folder_rules_header": "Reglas de Coloreado para Archivos y Carpetas",
      "file_folder_rules_desc": "Controla el coloreado mediante coincidencia de nombres, rutas exactas o patrones regex. Deja una entrada de exclusi\xF3n vac\xEDa para desactivar el coloreado en toda la b\xF3veda.",
      "search_file_folder_rules_placeholder": "Buscar reglas de archivo/carpeta\u2026",
      "path_sort_label_last-added": "Ordenar: \xDAltimo A\xF1adido",
      "path_sort_label_a-z": "Ordenar: A-Z",
      "path_sort_label_reverse-a-z": "Ordenar: Z-A",
      "path_sort_label_mode": "Ordenar: Modo",
      "path_sort_label_type": "Ordenar: Tipo",
      "btn_add_file_folder_rule": "+ A\xF1adir regla de archivo/carpeta",
      "disabled_files_header": "Archivos con coloreado desactivado:",
      // Advanced Settings - Inclusion Exclusion Labels
      "path_rule_mode_include": "incluir",
      "path_rule_mode_exclude": "excluir",
      "text_rule_mode_include": "solo colores en (lista blanca)",
      "text_rule_mode_exclude": "no colorea en (lista negra)",
      "mode_only_colors_in": "solo colores en",
      "mode_does_not_color_in": "no colores en",
      "label_text_include": "Lista Blanca",
      "label_text_exclude": "Lista Negra",
      "enter_path_or_pattern": "Ingrese ruta o patr\xF3n",
      "label_regex": "Expresi\xF3n regular",
      // Advanced Rules
      "advanced_rules_header": "Reglas Avanzadas",
      "advanced_rules_modal_header": "Reglas Avanzadas",
      "advanced_rules_manage_button": "gestionar reglas avanzadas",
      "edit_rule_header": "Editar Regla",
      "add_rule_header": "A\xF1adir Nueva Regla",
      "btn_add_rule": "+ A\xF1adir Regla",
      "btn_save_rule": "Guardar Regla",
      "btn_add_words": "+ A\xF1adir Palabras",
      "btn_add_regex": "+ A\xF1adir Regex",
      "btn_save_regex": "Guardar Expresi\xF3n Regular",
      // Regex Tester
      "regex_tester_header": "Probador de Expresiones Regulares",
      "regex_tester_blacklist": "Probador de regex - lista negra",
      "regex_expression_placeholder": "Pon tu expresi\xF3n regex aqu\xED",
      "regex_subject_placeholder": "escribe el texto a probar aqu\xED...",
      "regex_name_placeholder": "nombra tu regex",
      "matches": "coincidencias",
      "matches_found": "coincidencias encontradas",
      // Regex Flags
      "flag_g": "bandera global: encontrar todas las coincidencias",
      "flag_i": "bandera sin distinci\xF3n de may\xFAsculas",
      "flag_m": "bandera multilinea: ^ y $ coinciden con l\xEDmites de l\xEDnea",
      "flag_s": "bandera dotAll: . coincide con saltos de l\xEDnea",
      "flag_u": "bandera unicode: tratar como puntos de c\xF3digo unicode",
      "flag_y": "bandera sticky: coincidir desde la posici\xF3n lastIndex",
      // Data Export/Import
      "data_export_import_header": "Exportar/Importar Datos",
      "export_plugin_data": "Exportar datos del plugin",
      "export_plugin_data_desc": "Exporta la configuraci\xF3n, palabras y reglas a un archivo JSON.",
      "btn_export": "Exportar",
      "import_plugin_data": "Importar datos del plugin",
      "import_plugin_data_desc": "Importa la configuraci\xF3n desde un archivo JSON",
      "btn_import": "Importar"
    };
  }
});

// src/i18n/fr.js
var require_fr = __commonJS({
  "src/i18n/fr.js"(exports2, module2) {
    module2.exports = {
      // Plugin Metadata & Basic Labels
      "__name": "Fran\xE7ais",
      "settings_title": "Param\xE8tres de Always Color Text",
      "header_plugin_name": "Always Color Text",
      "ribbon_title": "Toujours colorer le texte",
      // Language Settings
      "language_label": "Langue",
      "language_desc": "S\xE9lectionnez la langue \xE0 utiliser dans ce plugin",
      "language_en": "Anglais",
      "language_es": "Espagnol",
      "language_fr": "Fran\xE7ais",
      "language_eu": "Basque",
      "language_ru": "Russe",
      "language_auto": "Par d\xE9faut du syst\xE8me",
      // Release Notes
      "latest_release_notes_label": "Notes de version les plus r\xE9centes",
      "latest_release_notes_desc": "Voir les notes de version les plus r\xE9centes du plugin",
      "open_changelog_button": "Ouvrir le journal des modifications",
      "command_show_release_notes": "Afficher les derni\xE8res notes de version",
      "changelog_view_on_github": "Voir sur GitHub",
      "changelog_loading": "Chargement des versions\u2026",
      "changelog_no_info": "Aucune information de version disponible.",
      "changelog_release": "Version",
      "changelog_no_notes": "Aucune note",
      "changelog_failed_to_load": "\xC9chec du chargement des notes de version.",
      // UI Elements & Menus
      "file_menu_enable": "Activer toujours colorer le texte pour ce fichier",
      "file_menu_disable": "D\xE9sactiver toujours colorer le texte pour ce fichier",
      "menu_color_once": "Colorer une fois",
      "menu_highlight_once": "Surligner une fois",
      "menu_always_color_text": "Toujours colorer le texte",
      "menu_remove_always_color_text": "Supprimer Always Color Text",
      "menu_blacklist_word": "Mettre le mot en liste noire pour le coloriage",
      "show_toggle_statusbar": "Afficher le bouton d'activation dans la barre d'\xE9tat",
      "show_toggle_ribbon": "Afficher l'ic\xF4ne d'activation dans le ruban",
      "show_toggle_command": "Afficher l'activation dans les commandes",
      "show_blacklist_menu": "Afficher les mots en liste noire dans le menu clic-droit",
      "show_blacklist_menu_desc": "Ajoute un \xE9l\xE9ment au menu clic-droit pour mettre le texte s\xE9lectionn\xE9 en liste noire pour le coloriage.",
      "tooltip_enable_for_file": "Activer pour ce fichier",
      "tooltip_delete_all_words": "Supprimer tous les mots/motifs d\xE9finis",
      "tooltip_delete_all_blacklist": "Supprimer tous les mots/motifs en liste noire",
      "tooltip_use_regex": "Utiliser comme mod\xE8le d'expression r\xE9guli\xE8re",
      "drag_to_reorder": "Glisser pour r\xE9organiser",
      "reset_text_color": "R\xE9initialiser la couleur du texte",
      "reset_highlight": "R\xE9initialiser la surbrillance",
      // Commands
      "command_color_selected": "Colorer le texte s\xE9lectionn\xE9",
      "command_toggle_current": "Activer/D\xE9sactiver le coloriage pour le document actuel",
      "command_toggle_global": "Activer/D\xE9sactiver Always Color Text",
      "command_manage_advanced_rules": "G\xE9rer les R\xE8gles Avanc\xE9es",
      "command_open_regex_tester": "Ajouter Regex (Ouvrir le Testeur Regex)",
      "command_open_blacklist_regex_tester": "Ajouter Regex \xE0 la Liste Noire",
      "command_manage_colored_texts": "G\xE9rer les textes color\xE9s",
      "command_toggle_hide_text_colors": "Masquer/Afficher les couleurs de texte",
      "command_toggle_hide_highlights": "Masquer/Afficher les surbrillances",
      // Notifications
      "notice_enabled": "Always color text activ\xE9",
      "notice_disabled": "Always color text d\xE9sactiv\xE9",
      "notice_blacklisted_cannot_color": '"{word}" est sur liste noire et ne peut pas \xEAtre color\xE9.',
      "notice_removed_always_color": 'Coloriage permanent supprim\xE9 pour "{word}".',
      "notice_added_to_blacklist": '"{word}" ajout\xE9 \xE0 la liste noire.',
      "notice_already_blacklisted": '"{word}" est d\xE9j\xE0 sur liste noire.',
      "notice_select_text_first": "Veuillez d'abord s\xE9lectionner du texte.",
      "notice_no_active_file": "Aucun fichier actif pour activer/d\xE9sactiver le coloriage.",
      "notice_coloring_enabled_for_path": "Coloriage activ\xE9 pour {path}",
      "notice_coloring_disabled_for_path": "Coloriage d\xE9sactiv\xE9 pour {path}",
      "notice_global_enabled": "Always Color Text Activ\xE9",
      "notice_global_disabled": "Always Color Text D\xE9sactiv\xE9",
      "notice_unable_open_changelog": "Impossible d'ouvrir la fen\xEAtre du journal des modifications.",
      "notice_pattern_blocked": "Motif bloqu\xE9 pour la s\xE9curit\xE9 m\xE9moire :",
      "notice_pattern_too_complex": "Motif trop complexe :",
      "notice_invalid_hex_format": "Format de couleur hexad\xE9cimale invalide. Utilisez #RRGGBB ou #RGB.",
      "notice_error_saving_changes": "Erreur lors de l'enregistrement des modifications. Veuillez r\xE9essayer.",
      "notice_invalid_color_format": "Format de couleur invalide.",
      "notice_exported": "Export\xE9 : {fname}",
      "notice_export_failed": "\xC9chec de l'exportation",
      "notice_import_completed": "Importation termin\xE9e",
      "notice_import_failed": "\xC9chec de l'importation",
      "notice_invalid_regex": "Expression r\xE9guli\xE8re invalide",
      "notice_empty_pattern": "Le motif est vide",
      "notice_added_regex": "Expression r\xE9guli\xE8re ajout\xE9e",
      "notice_rule_updated": "R\xE8gle mise \xE0 jour",
      "notice_regex_updated": "Expression r\xE9guli\xE8re mise \xE0 jour",
      "notice_entry_updated": "Entr\xE9e mise \xE0 jour",
      "notice_entry_duplicated": "Entr\xE9e dupliqu\xE9e",
      "notice_error_opening_regex_tester": "Erreur lors de l'ouverture du testeur regex",
      "notice_error_opening_blacklist_regex_tester": "Erreur lors de l'ouverture du testeur regex de liste noire",
      "notice_error_opening_advanced_rules": "Erreur lors de l'ouverture de la bo\xEEte de dialogue des r\xE8gles avanc\xE9es",
      "notice_text_color_reset": "Couleur du texte r\xE9initialis\xE9e",
      "notice_highlight_reset": "Surbrillance r\xE9initialis\xE9e",
      "notice_text_colors_hidden": "Couleurs de texte masqu\xE9es",
      "notice_text_colors_visible": "Couleurs de texte visibles",
      "notice_highlights_hidden": "Surbrillances masqu\xE9es",
      "notice_highlights_visible": "Surbrillances visibles",
      "notice_regex_support_disabled": "Le support des expressions r\xE9guli\xE8res est d\xE9sactiv\xE9. Activez-le dans les param\xE8tres pour utiliser des motifs regex.",
      "notice_no_active_file_to_disable": "Aucun fichier actif pour d\xE9sactiver le coloriage.",
      "notice_already_disabled_for_path": "Le coloriage est d\xE9j\xE0 d\xE9sactiv\xE9 pour {path}",
      "notice_filter_disabled": "Filtre d\xE9sactiv\xE9",
      // Confirmation Dialogs
      "confirm_delete_all_title": "Supprimer tous les mots",
      "confirm_delete_all_desc": "\xCAtes-vous s\xFBr de vouloir supprimer tous vos mots/motifs color\xE9s ? Cette action est irr\xE9versible !",
      "confirm_delete_all_blacklist_title": "Supprimer tous les mots en liste noire",
      "confirm_delete_all_blacklist_desc": "\xCAtes-vous s\xFBr de vouloir supprimer toutes les entr\xE9es de la liste noire ? Cette action est irr\xE9versible !",
      "restart_required_title": "Red\xE9marrage requis",
      "restart_required_desc": "D\xE9sactiver le bouton de la palette de commandes n\xE9cessite de red\xE9marrer Obsidian pour supprimer compl\xE8tement les commandes de la palette. Red\xE9marrer maintenant ?",
      // Basic Settings
      "enable_document_color": "Activer la couleur du document",
      "color_in_reading_mode": "Colorer en mode lecture",
      "force_full_render_reading": "Forcer le rendu complet en mode Lecture",
      "force_full_render_reading_desc": "Quand ACTIF, le mode lecture tentera de colorer l'ensemble du document en une seule passe. Peut causer des probl\xE8mes de performance sur les grands documents. \xC0 utiliser avec prudence !",
      "disable_coloring_current_file": "D\xE9sactiver le coloriage pour le fichier actuel",
      "disable_coloring_current_file_desc": "Ajoute une r\xE8gle d'exclusion pour le fichier actif dans R\xE8gles de coloriage des fichiers et dossiers.",
      "btn_disable_for_this_file": "D\xE9sactiver pour ce fichier",
      // Coloring Settings
      "coloring_settings_header": "Param\xE8tres de coloriage",
      "regex_support": "Support des expressions r\xE9guli\xE8res",
      "regex_support_desc": "Permet aux motifs d'\xEAtre des expressions r\xE9guli\xE8res. Les regex invalides sont ignor\xE9es pour des raisons de s\xE9curit\xE9.",
      "disable_regex_safety": "D\xE9sactiver la s\xE9curit\xE9 des regex",
      "disable_regex_safety_desc": "Autorise des expressions complexes ou potentiellement dangereuses. Peut causer des probl\xE8mes de performance ou des blocages.",
      "case_sensitive": "Sensible \xE0 la casse",
      "case_sensitive_desc": 'Si activ\xE9, "mot" et "Mot" sont trait\xE9s diff\xE9remment. Si d\xE9sactiv\xE9, ils sont color\xE9s de la m\xEAme mani\xE8re.',
      "partial_match": "Correspondance partielle",
      "partial_match_desc": `Si activ\xE9, le mot entier sera color\xE9 si un mot color\xE9 est trouv\xE9 \xE0 l'int\xE9rieur (ex: "as" colorera "Jasper").`,
      // One-Time Actions
      "one_time_actions_header": "Actions ponctuelles",
      "setting_color_once": "Colorer une fois",
      "setting_color_once_desc": "Ins\xE8re du code HTML en ligne pour le texte s\xE9lectionn\xE9. Persiste m\xEAme si le plugin est d\xE9sactiv\xE9.",
      "setting_highlight_once": "Surligner une fois",
      "setting_highlight_once_desc": "Ins\xE8re du code HTML en ligne avec un style de fond. Persiste m\xEAme si le plugin est d\xE9sactiv\xE9.",
      "highlight_once_preview": "Aper\xE7u de Surligner une fois",
      "highlight_once_preview_text": "Voici \xE0 quoi ressemblera Surligner une fois !",
      // Highlight Once Settings
      "highlight_once_opacity": "Opacit\xE9 de Surligner une fois",
      "highlight_once_border_radius": "Rayon de la bordure de Surligner une fois (px)",
      "reset_to_8": "R\xE9initialiser \xE0 8",
      "highlight_horizontal_padding": "Marge horizontale du surlignage (px)",
      "reset_to_4": "R\xE9initialiser \xE0 4",
      "enable_border_highlight_once": "Activer la bordure pour Surligner une fois",
      "enable_border_highlight_once_desc": "Ajoute une bordure \xE0 votre surlignage en ligne. Le code HTML/CSS ajout\xE9 sera LONG.",
      "highlight_once_border_style": "Style de bordure de Surligner une fois",
      "opt_border_full": "Bordure compl\xE8te (tous les c\xF4t\xE9s)",
      "opt_border_top_bottom": "Bordures Haut & Bas",
      "opt_border_left_right": "Bordures Gauche & Droite",
      "opt_border_top_right": "Bordures Haut & Droite",
      "opt_border_top_left": "Bordures Haut & Gauche",
      "opt_border_bottom_right": "Bordures Bas & Droite",
      "opt_border_bottom_left": "Bordures Bas & Gauche",
      "opt_border_top": "Bordure du haut seulement",
      "opt_border_bottom": "Bordure du bas seulement",
      "opt_border_left": "Bordure de gauche seulement",
      "opt_border_right": "Bordure de droite seulement",
      "highlight_once_border_opacity": "Opacit\xE9 de la bordure de Surligner une fois",
      "highlight_once_border_thickness": "\xC9paisseur de la bordure de Surligner une fois (px)",
      "reset_to_1": "R\xE9initialiser \xE0 1",
      "use_global_highlight_style": "Utiliser le style de surlignage global pour Surligner une fois",
      "use_global_highlight_style_desc": "Utilise votre style en ligne global. Le HTML/CSS ajout\xE9 peut \xEAtre volumineux.",
      "style_highlight_once": "Style pour Surligner une fois",
      "style_highlight_once_desc": "Utilise votre style en ligne personnalis\xE9. Le HTML/CSS ajout\xE9 peut \xEAtre volumineux.",
      // Global Highlight Appearance
      "global_highlight_appearance_header": "Apparence globale du surlignage color\xE9",
      "highlight_opacity": "Opacit\xE9 du surlignage",
      "highlight_opacity_desc": "D\xE9finit l'opacit\xE9 du surlignage (0-100%)",
      "highlight_border_radius": "Rayon de la bordure du surlignage (px)",
      "highlight_border_radius_desc": "D\xE9finit le rayon de la bordure (en px) pour les coins arrondis du surlignage",
      "highlight_horizontal_padding_desc": "D\xE9finit la marge gauche et droite (en px) pour le texte surlign\xE9",
      "rounded_corners_wrapping": "Coins arrondis sur le retour \xE0 la ligne",
      "rounded_corners_wrapping_desc": "Quand activ\xE9, les surlignages auront des coins arrondis sur tous les c\xF4t\xE9s, m\xEAme quand le texte revient \xE0 la ligne.",
      "enable_highlight_border": "Activer la bordure du surlignage",
      "enable_highlight_border_desc": "Ajoute une bordure autour des surlignages. La bordure correspondra \xE0 la couleur du texte ou du surlignage.",
      "border_style": "Style de bordure",
      "border_style_desc": "Choisissez les c\xF4t\xE9s sur lesquels appliquer la bordure",
      "border_opacity": "Opacit\xE9 de la bordure",
      "border_opacity_desc": "D\xE9finit l'opacit\xE9 de la bordure (0-100%)",
      "border_thickness": "\xC9paisseur de la bordure (px)",
      "border_thickness_desc": "D\xE9finit l'\xE9paisseur de la bordure de 0 \xE0 5 pixels (ex: 1, 2.5, 5)",
      "highlight_preview": "Aper\xE7u du surlignage",
      "highlight_preview_text": "Voici \xE0 quoi ressemblera votre surlignage !",
      // Color Swatches
      "color_swatches_header": "Nuanciers de couleur",
      "color_picker_layout": "Disposition du s\xE9lecteur de couleur",
      "color_picker_layout_desc": "Choisissez les types de couleur \xE0 afficher lors de la s\xE9lection des couleurs pour le texte",
      "opt_both_text_left": "Les deux : Texte \xE0 gauche, Surlignage \xE0 droite",
      "opt_both_bg_left": "Les deux : Surlignage \xE0 gauche, Texte \xE0 droite",
      "opt_text_only": "Couleur du texte seulement",
      "opt_background_only": "Couleur de surlignage seulement",
      "replace_default_swatches": "Remplacer les nuanciers par d\xE9faut",
      "replace_default_swatches_desc": "Si activ\xE9, seules vos couleurs personnalis\xE9es appara\xEEtront dans le s\xE9lecteur de couleur. Aucune couleur par d\xE9faut !",
      "enable_custom_swatches": "Activer les nuanciers personnalis\xE9s",
      "enable_custom_swatches_desc": "Si activ\xE9, vos nuanciers personnalis\xE9s appara\xEEtront dans le s\xE9lecteur de couleur.",
      "use_swatch_names": "Utiliser les noms des nuanciers pour colorer le texte",
      "use_swatch_names_desc": "Afficher une liste d\xE9roulante des noms de nuanciers \xE0 c\xF4t\xE9 des champs de saisie de mots/motifs",
      "default_colors_header": "Couleurs par d\xE9faut",
      "custom_swatches_header": "Nuanciers personnalis\xE9s",
      "btn_add_color": "+ Ajouter une couleur",
      "no_custom_swatches_yet": 'Aucun nuancier personnalis\xE9 pour le moment. Cliquez sur "+ Ajouter une couleur" pour en cr\xE9er un.',
      "label_built_in": "(int\xE9gr\xE9)",
      // Color Picker
      "pick_color_header": "Choisir une couleur",
      "selected_text_preview": "Texte s\xE9lectionn\xE9",
      "text_color_title": "Couleur du texte",
      "select_swatch": "S\xE9lectionner un nuancier\u2026",
      "highlight_color_title": "Couleur de surlignage",
      "select_highlight_swatch": "S\xE9lectionner un nuancier de surlignage\u2026",
      // Always Colored Texts
      "always_colored_texts_header": "Textes toujours color\xE9s",
      "always_colored_texts_desc": "C'est ici que vous g\xE9rez vos mots/motifs et leurs couleurs.",
      "search_colored_words_placeholder": "Rechercher des mots/motifs color\xE9s\u2026",
      "sort_label_last-added": "Trier : Dernier ajout",
      "sort_label_a-z": "Trier : A-Z",
      "sort_label_reverse-a-z": "Trier : Z-A",
      "sort_label_style-order": "Trier : Ordre de style",
      "sort_label_color": "Trier : Couleur",
      "btn_add_new_word": "+ Ajouter un nouveau mot / motif color\xE9",
      "style_type_text": "couleur",
      "style_type_highlight": "surlignage",
      "style_type_both": "les deux",
      "word_pattern_placeholder_long": "motif, mot ou mots s\xE9par\xE9s par des virgules (ex: bonjour, monde, foo)",
      "word_pattern_placeholder_short": "Mot-cl\xE9 ou motif, ou mots s\xE9par\xE9s par des virgules",
      "use_regex": "Utiliser Regex",
      "flags_placeholder": "drapeaux",
      "text_or_regex_placeholder": "entr\xE9e texte / regex",
      "duplicate_entry": "entr\xE9e en double",
      "open_in_regex_tester": "Ouvrir dans le testeur Regex",
      "no_rules_configured": "Aucune r\xE8gle configur\xE9e.",
      "no_rules_found": "Aucune r\xE8gle trouv\xE9e.",
      // Presets
      "btn_presets": "Pr\xE9r\xE9glages",
      "preset_all_headings": "Tous les titres (H1-H6)",
      "preset_bullet_points": "Listes \xE0 puces",
      "preset_numbered_lists": "Listes num\xE9rot\xE9es",
      "preset_task_checked": "Liste des t\xE2ches (coch\xE9e)",
      "preset_task_unchecked": "Liste des t\xE2ches (non coch\xE9e)",
      "preset_dates_yyyy_mm_dd": "Dates (AAAA-MM-JJ)",
      "preset_times_am_pm": "Heures (AM/PM)",
      "preset_dates_yyyy_mmm_dd": "Dates (AAAA-MMM-JJ)",
      "preset_relative_dates": "Dates relatives",
      "preset_basic_urls": "URLs basiques",
      "preset_markdown_links": "Liens Markdown",
      "preset_domain_names": "Noms de domaine",
      "preset_email_addresses": "Adresses e\u2011mail",
      "preset_at_username": "@nom d'utilisateur",
      "preset_currency": "Monnaie",
      "preset_measurements": "Mesures",
      "preset_phone_numbers": "Num\xE9ros de t\xE9l\xE9phone",
      "preset_all_texts": "Tout le texte",
      "preset_codeblocks": "Blocs de code",
      "preset_inline_comments": "Commentaires (%%\u2026%%)",
      "preset_parentheses": "Parenth\xE8ses ()",
      "preset_square_brackets": "Crochets []",
      "preset_curly_braces": "Accolades {}",
      "preset_angle_brackets": "Chevrons <>",
      "preset_colons": "Deux-points :",
      "preset_double_quotes": "Guillemets doubles",
      "preset_single_quotes": "Guillemets simples",
      "preset_single_quotes_word_bounded": "Guillemets simples (bornes de mot)",
      "preset_group_markdown_formatting": "Formatage Markdown",
      "preset_group_other_patterns": "Autres Motifs",
      "preset_group_brackets": "Crochets",
      // Blacklist Settings
      "blacklist_words_header": "Mots en liste noire",
      "blacklist_words_desc": "Les mots-cl\xE9s ou motifs ici ne seront jamais color\xE9s, m\xEAme pour les correspondances partielles.",
      "search_blacklist_placeholder": "Rechercher des mots ou motifs en liste noire\u2026",
      "blacklist_sort_label_last-added": "Trier : Dernier ajout",
      "blacklist_sort_label_a-z": "Trier : A-Z",
      "blacklist_sort_label_reverse-a-z": "Trier : Z-A",
      "btn_add_blacklist": "+ Ajouter un mot ou motif en liste noire",
      "btn_add_to_blacklist": "+ Ajouter \xE0 la liste noire",
      "btn_add_blacklist_word": "+ Ajouter un mot \xE0 la liste noire",
      "btn_add_blacklist_regex": "+ Ajouter un regex \xE0 la liste noire",
      // File & Folder Rules
      "file_folder_rules_header": "R\xE8gles de coloriage des fichiers et dossiers",
      "file_folder_rules_desc": "Contr\xF4lez le coloriage par correspondance de nom, chemins exacts ou motifs regex. Laissez une entr\xE9e d'exclusion vide pour d\xE9sactiver le coloriage dans l'ensemble du coffre.",
      "search_file_folder_rules_placeholder": "Rechercher des r\xE8gles de fichier/dossier\u2026",
      "path_sort_label_last-added": "Trier : Dernier ajout",
      "path_sort_label_a-z": "Trier : A-Z",
      "path_sort_label_reverse-a-z": "Trier : Z-A",
      "path_sort_label_mode": "Trier : Mode",
      "path_sort_label_type": "Trier : Type",
      "btn_add_file_folder_rule": "+ Ajouter une r\xE8gle de fichier/dossier",
      "disabled_files_header": "Fichiers avec coloriage d\xE9sactiv\xE9 :",
      // Advanced Settings - Inclusion Exclusion Labels
      "path_rule_mode_include": "inclure",
      "path_rule_mode_exclude": "exclure",
      "text_rule_mode_include": "colore uniquement en (liste blanche)",
      "text_rule_mode_exclude": "ne colore pas en (liste noire)",
      "mode_only_colors_in": "ne colore que dans",
      "mode_does_not_color_in": "ne colore pas dans",
      "label_text_include": "Liste Blanche",
      "label_text_exclude": "Liste Noire",
      "enter_path_or_pattern": "Entrer un chemin ou un motif",
      "label_regex": "Expression r\xE9guli\xE8re",
      // Advanced Rules
      "advanced_rules_header": "R\xE8gles avanc\xE9es",
      "advanced_rules_modal_header": "R\xE8gles avanc\xE9es",
      "advanced_rules_manage_button": "g\xE9rer les r\xE8gles avanc\xE9es",
      "edit_rule_header": "Modifier la r\xE8gle",
      "add_rule_header": "Ajouter une nouvelle r\xE8gle",
      "btn_add_rule": "+ Ajouter une r\xE8gle",
      "btn_save_rule": "Enregistrer la r\xE8gle",
      "btn_add_words": "+ Ajouter des mots",
      "btn_add_regex": "+ Ajouter Regex",
      "btn_save_regex": "Enregistrer l'expression r\xE9guli\xE8re",
      // Regex Tester
      "regex_tester_header": "Testeur d'expressions r\xE9guli\xE8res",
      "regex_tester_blacklist": "Testeur regex - liste noire",
      "regex_expression_placeholder": "Mettez votre expression regex ici",
      "regex_subject_placeholder": "tapez votre texte \xE0 tester ici...",
      "regex_name_placeholder": "nommez votre regex",
      "matches": "correspondances",
      "matches_found": "correspondances trouv\xE9es",
      // Regex Flags
      "flag_g": "indicateur global : trouver tous les correspondances",
      "flag_i": "indicateur de casse insensible",
      "flag_m": "indicateur multiligne : ^ et $ correspondent aux limites de ligne",
      "flag_s": "indicateur dotAll : . correspond aux sauts de ligne",
      "flag_u": "indicateur unicode : traiter comme des points de code unicode",
      "flag_y": "indicateur sticky : correspondance \xE0 partir de la position lastIndex",
      // Data Export/Import
      "data_export_import_header": "Export/Import des donn\xE9es",
      "export_plugin_data": "Exporter les donn\xE9es du plugin",
      "export_plugin_data_desc": "Exporter les param\xE8tres, mots et r\xE8gles vers un fichier JSON.",
      "btn_export": "Exporter",
      "import_plugin_data": "Importer les donn\xE9es du plugin",
      "import_plugin_data_desc": "Importer les param\xE8tres depuis un fichier JSON",
      "btn_import": "Importer"
    };
  }
});

// src/i18n/hi.js
var require_hi = __commonJS({
  "src/i18n/hi.js"(exports2, module2) {
    module2.exports = {
      // Plugin Metadata & Basic Labels
      "__name": "\u0939\u093F\u0928\u094D\u0926\u0940",
      "settings_title": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938",
      "header_plugin_name": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      "ribbon_title": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      // Language Settings
      "language_label": "\u092D\u093E\u0937\u093E",
      "language_desc": "\u0907\u0938 \u092A\u094D\u0932\u0917\u0907\u0928 \u092E\u0947\u0902 \u0909\u092A\u092F\u094B\u0917 \u0915\u0940 \u091C\u093E\u0928\u0947 \u0935\u093E\u0932\u0940 \u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902",
      "language_en": "\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940",
      "language_es": "\u0938\u094D\u092A\u0947\u0928\u093F\u0936",
      "language_fr": "\u092B\u094D\u0930\u0947\u0902\u091A",
      "language_eu": "\u092C\u093E\u0938\u094D\u0915",
      "language_ru": "\u0930\u0942\u0938\u0940",
      "language_auto": "\u0938\u093F\u0938\u094D\u091F\u092E \u0921\u093F\u092B\u0949\u0932\u094D\u091F",
      // Release Notes
      "latest_release_notes_label": "\u0928\u0935\u0940\u0928\u0924\u092E \u0930\u093F\u0932\u0940\u091C\u093C \u0928\u094B\u091F\u094D\u0938",
      "latest_release_notes_desc": "\u092A\u094D\u0932\u0917\u0907\u0928 \u0915\u0947 \u0928\u0935\u0940\u0928\u0924\u092E \u0930\u093F\u0932\u0940\u091C\u093C \u0928\u094B\u091F\u094D\u0938 \u0926\u0947\u0916\u0947\u0902",
      "open_changelog_button": "\u091A\u0947\u0902\u091C\u0932\u0949\u0917 \u0916\u094B\u0932\u0947\u0902",
      "command_show_release_notes": "\u0928\u0935\u0940\u0928\u0924\u092E \u0930\u093F\u0932\u0940\u091C\u093C \u0928\u094B\u091F\u094D\u0938 \u0926\u093F\u0916\u093E\u090F\u0901",
      "changelog_view_on_github": "GitHub \u092A\u0930 \u0926\u0947\u0916\u0947\u0902",
      "changelog_loading": "\u0930\u093F\u0932\u0940\u091C\u093C \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0940 \u0939\u0948\u0902\u2026",
      "changelog_no_info": "\u0915\u094B\u0908 \u0930\u093F\u0932\u0940\u091C\u093C \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      "changelog_release": "\u0930\u093F\u0932\u0940\u091C\u093C",
      "changelog_no_notes": "\u0915\u094B\u0908 \u0928\u094B\u091F\u094D\u0938 \u0928\u0939\u0940\u0902",
      "changelog_failed_to_load": "\u0930\u093F\u0932\u0940\u091C\u093C \u0928\u094B\u091F\u094D\u0938 \u0932\u094B\u0921 \u0915\u0930\u0928\u0947 \u092E\u0947\u0902 \u0935\u093F\u092B\u0932\u0964",
      // UI Elements & Menus
      "file_menu_enable": "\u0907\u0938 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      "file_menu_disable": "\u0907\u0938 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      "menu_color_once": "\u090F\u0915 \u092C\u093E\u0930 \u0930\u0902\u0917 \u0932\u0917\u093E\u090F\u0901",
      "menu_highlight_once": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0930\u0947\u0902",
      "menu_always_color_text": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      "menu_remove_always_color_text": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0939\u091F\u093E\u090F\u0901",
      "menu_blacklist_word": "\u0930\u0902\u0917\u093E\u0908 \u0938\u0947 \u0936\u092C\u094D\u0926 \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0915\u0930\u0947\u0902",
      "show_toggle_statusbar": "\u0938\u094D\u091F\u0947\u091F\u0938 \u092C\u093E\u0930 \u092E\u0947\u0902 \u091F\u0949\u0917\u0932 \u0926\u093F\u0916\u093E\u090F\u0901",
      "show_toggle_ribbon": "\u0930\u093F\u092C\u0928 \u092E\u0947\u0902 \u091F\u0949\u0917\u0932 \u0906\u0907\u0915\u0928 \u0926\u093F\u0916\u093E\u090F\u0901",
      "show_toggle_command": "\u0915\u092E\u093E\u0902\u0921 \u092E\u0947\u0902 \u091F\u0949\u0917\u0932 \u0926\u093F\u0916\u093E\u090F\u0901",
      "show_blacklist_menu": "\u0930\u093E\u0907\u091F-\u0915\u094D\u0932\u093F\u0915 \u092E\u0947\u0928\u0942 \u092E\u0947\u0902 \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0936\u092C\u094D\u0926 \u0926\u093F\u0916\u093E\u090F\u0901",
      "show_blacklist_menu_desc": "\u0930\u0902\u0917\u093E\u0908 \u0938\u0947 \u091A\u092F\u0928\u093F\u0924 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u094B \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0930\u093E\u0907\u091F-\u0915\u094D\u0932\u093F\u0915 \u092E\u0947\u0928\u0942 \u0906\u0907\u091F\u092E \u091C\u094B\u0921\u093C\u0924\u093E \u0939\u0948\u0964",
      "tooltip_enable_for_file": "\u0907\u0938 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      "tooltip_delete_all_words": "\u092A\u0930\u093F\u092D\u093E\u0937\u093F\u0924 \u0938\u092D\u0940 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0939\u091F\u093E\u090F\u0901",
      "tooltip_delete_all_blacklist": "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0938\u092D\u0940 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0939\u091F\u093E\u090F\u0901",
      "tooltip_use_regex": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u092A\u0948\u091F\u0930\u094D\u0928 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
      "drag_to_reorder": "\u092A\u0941\u0928\u0903 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0916\u0940\u0902\u091A\u0947\u0902",
      "reset_text_color": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917 \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      "reset_highlight": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      // Commands
      "command_color_selected": "\u091A\u092F\u0928\u093F\u0924 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917\u0947\u0902",
      "command_toggle_current": "\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u091A\u093E\u0932\u0942/\u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      "command_toggle_global": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u093E\u0932\u0942/\u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      "command_manage_advanced_rules": "\u0909\u0928\u094D\u0928\u0924 \u0928\u093F\u092F\u092E \u092A\u094D\u0930\u092C\u0902\u0927\u093F\u0924 \u0915\u0930\u0947\u0902",
      "command_open_regex_tester": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091C\u094B\u0921\u093C\u0947\u0902 (\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091F\u0947\u0938\u094D\u091F\u0930 \u0916\u094B\u0932\u0947\u0902)",
      "command_open_blacklist_regex_tester": "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u092E\u0947\u0902 \u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091C\u094B\u0921\u093C\u0947\u0902",
      "command_manage_colored_texts": "\u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092A\u094D\u0930\u092C\u0902\u0927\u093F\u0924 \u0915\u0930\u0947\u0902",
      "command_toggle_hide_text_colors": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917 \u091B\u093F\u092A\u093E\u090F\u0901/\u0926\u093F\u0916\u093E\u090F\u0901",
      "command_toggle_hide_highlights": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F\u094D\u0938 \u091B\u093F\u092A\u093E\u090F\u0901/\u0926\u093F\u0916\u093E\u090F\u0901",
      // Notifications
      "notice_enabled": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u093E\u0932\u0942",
      "notice_disabled": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092C\u0902\u0926",
      "notice_blacklisted_cannot_color": '"{word}" \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0939\u0948 \u0914\u0930 \u0930\u0902\u0917 \u0928\u0939\u0940\u0902 \u0932\u0917\u093E\u092F\u093E \u091C\u093E \u0938\u0915\u0924\u093E\u0964',
      "notice_removed_always_color": '"{word}" \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u0947\u0936\u093E \u0915\u0940 \u0930\u0902\u0917\u093E\u0908 \u0939\u091F\u093E\u0908 \u0917\u0908\u0964',
      "notice_added_to_blacklist": '"{word}" \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u092E\u0947\u0902 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E\u0964',
      "notice_already_blacklisted": '"{word}" \u092A\u0939\u0932\u0947 \u0938\u0947 \u0939\u0940 \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0939\u0948\u0964',
      "notice_select_text_first": "\u0915\u0943\u092A\u092F\u093E \u092A\u0939\u0932\u0947 \u0915\u0941\u091B \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u0941\u0928\u0947\u0902\u0964",
      "notice_no_active_file": "\u0930\u0902\u0917\u093E\u0908 \u091F\u0949\u0917\u0932 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u094B\u0908 \u0938\u0915\u094D\u0930\u093F\u092F \u092B\u093C\u093E\u0907\u0932 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      "notice_coloring_enabled_for_path": "{path} \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u091A\u093E\u0932\u0942",
      "notice_coloring_disabled_for_path": "{path} \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926",
      "notice_global_enabled": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u093E\u0932\u0942",
      "notice_global_disabled": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092C\u0902\u0926",
      "notice_unable_open_changelog": "\u091A\u0947\u0902\u091C\u0932\u0949\u0917 \u0916\u094B\u0932\u0928\u0947 \u092E\u0947\u0902 \u0905\u0938\u092E\u0930\u094D\u0925\u0964",
      "notice_pattern_blocked": "\u092E\u0947\u092E\u094B\u0930\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0915\u0947 \u0932\u093F\u090F \u092A\u0948\u091F\u0930\u094D\u0928 \u092C\u094D\u0932\u0949\u0915 \u0915\u093F\u092F\u093E \u0917\u092F\u093E:",
      "notice_pattern_too_complex": "\u092A\u0948\u091F\u0930\u094D\u0928 \u092C\u0939\u0941\u0924 \u091C\u091F\u093F\u0932:",
      "notice_invalid_hex_format": "\u0905\u092E\u093E\u0928\u094D\u092F \u0939\u0947\u0915\u094D\u0938 \u0930\u0902\u0917 \u092B\u0949\u0930\u094D\u092E\u0947\u091F\u0964 #RRGGBB \u092F\u093E #RGB \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964",
      "notice_error_saving_changes": "\u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u0938\u0939\u0947\u091C\u0928\u0947 \u092E\u0947\u0902 \u0924\u094D\u0930\u0941\u091F\u093F\u0964 \u0915\u0943\u092A\u092F\u093E \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964",
      "notice_invalid_color_format": "\u0905\u092E\u093E\u0928\u094D\u092F \u0930\u0902\u0917 \u092B\u0949\u0930\u094D\u092E\u0947\u091F\u0964",
      "notice_exported": "\u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0915\u093F\u092F\u093E \u0917\u092F\u093E: {fname}",
      "notice_export_failed": "\u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0935\u093F\u092B\u0932",
      "notice_import_completed": "\u0906\u092F\u093E\u0924 \u092A\u0942\u0930\u094D\u0923",
      "notice_import_failed": "\u0906\u092F\u093E\u0924 \u0935\u093F\u092B\u0932",
      "notice_invalid_regex": "\u0905\u092E\u093E\u0928\u094D\u092F \u0928\u093F\u092F\u092E\u093F\u0924 \u0905\u092D\u093F\u0935\u094D\u092F\u0915\u094D\u0924\u093F",
      "notice_empty_pattern": "\u092A\u0948\u091F\u0930\u094D\u0928 \u0916\u093E\u0932\u0940 \u0939\u0948",
      "notice_added_regex": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E",
      "notice_rule_updated": "\u0928\u093F\u092F\u092E \u0905\u092A\u0921\u0947\u091F \u0915\u093F\u092F\u093E \u0917\u092F\u093E",
      "notice_regex_updated": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u0905\u092A\u0921\u0947\u091F \u0915\u093F\u092F\u093E \u0917\u092F\u093E",
      "notice_entry_updated": "\u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F \u0905\u092A\u0921\u0947\u091F \u0915\u0940 \u0917\u0908",
      "notice_entry_duplicated": "\u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F \u0921\u0941\u092A\u094D\u0932\u093F\u0915\u0947\u091F \u0915\u0940 \u0917\u0908",
      "notice_error_opening_regex_tester": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091F\u0947\u0938\u094D\u091F\u0930 \u0916\u094B\u0932\u0928\u0947 \u092E\u0947\u0902 \u0924\u094D\u0930\u0941\u091F\u093F",
      "notice_error_opening_blacklist_regex_tester": "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091F\u0947\u0938\u094D\u091F\u0930 \u0916\u094B\u0932\u0928\u0947 \u092E\u0947\u0902 \u0924\u094D\u0930\u0941\u091F\u093F",
      "notice_error_opening_advanced_rules": "\u0909\u0928\u094D\u0928\u0924 \u0928\u093F\u092F\u092E \u092E\u0949\u0921\u0932 \u0916\u094B\u0932\u0928\u0947 \u092E\u0947\u0902 \u0924\u094D\u0930\u0941\u091F\u093F",
      "notice_text_color_reset": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917 \u0930\u0940\u0938\u0947\u091F \u0915\u093F\u092F\u093E \u0917\u092F\u093E",
      "notice_highlight_reset": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0940\u0938\u0947\u091F \u0915\u093F\u092F\u093E \u0917\u092F\u093E",
      "notice_text_colors_hidden": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917 \u091B\u093F\u092A\u093E\u090F \u0917\u090F",
      "notice_text_colors_visible": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917 \u0926\u093F\u0916\u093E\u0908 \u0926\u0947 \u0930\u0939\u0947 \u0939\u0948\u0902",
      "notice_highlights_hidden": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F\u094D\u0938 \u091B\u093F\u092A\u093E\u090F \u0917\u090F",
      "notice_highlights_visible": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F\u094D\u0938 \u0926\u093F\u0916\u093E\u0908 \u0926\u0947 \u0930\u0939\u0947 \u0939\u0948\u0902",
      "notice_regex_support_disabled": "Regex \u0938\u0939\u093E\u092F\u0924\u093E \u092C\u0902\u0926 \u0939\u0948\u0964 Regex \u092A\u0948\u091F\u0930\u094D\u0928 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u0947\u091F\u093F\u0902\u0917 \u092E\u0947\u0902 \u0938\u0915\u094D\u0937\u092E \u0915\u0930\u0947\u0902\u0964",
      "notice_no_active_file_to_disable": "\u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u094B\u0908 \u0938\u0915\u094D\u0930\u093F\u092F \u092B\u093C\u093E\u0907\u0932 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      "notice_already_disabled_for_path": "{path} \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u092A\u0939\u0932\u0947 \u0938\u0947 \u0939\u0940 \u092C\u0902\u0926 \u0939\u0948",
      "notice_filter_disabled": "\u092B\u093F\u0932\u094D\u091F\u0930 \u092C\u0902\u0926 \u0915\u0940",
      // Confirmation Dialogs
      "confirm_delete_all_title": "\u0938\u092D\u0940 \u0936\u092C\u094D\u0926 \u0939\u091F\u093E\u090F\u0901",
      "confirm_delete_all_desc": "\u0915\u094D\u092F\u093E \u0906\u092A \u0935\u093E\u0915\u0908 \u0905\u092A\u0928\u0947 \u0938\u092D\u0940 \u0930\u0902\u0917\u0947 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0939\u091F\u093E\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902? \u0906\u092A \u0907\u0938\u0947 \u092A\u0942\u0930\u094D\u0935\u0935\u0924 \u0928\u0939\u0940\u0902 \u0915\u0930 \u0938\u0915\u0924\u0947!",
      "confirm_delete_all_blacklist_title": "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0938\u092D\u0940 \u0936\u092C\u094D\u0926 \u0939\u091F\u093E\u090F\u0901",
      "confirm_delete_all_blacklist_desc": "\u0915\u094D\u092F\u093E \u0906\u092A \u0935\u093E\u0915\u0908 \u0938\u092D\u0940 \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u090F\u0902\u091F\u094D\u0930\u0940\u091C\u093C \u0939\u091F\u093E\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902? \u0906\u092A \u0907\u0938\u0947 \u092A\u0942\u0930\u094D\u0935\u0935\u0924 \u0928\u0939\u0940\u0902 \u0915\u0930 \u0938\u0915\u0924\u0947!",
      "restart_required_title": "\u0930\u0940\u0938\u094D\u091F\u093E\u0930\u094D\u091F \u0906\u0935\u0936\u094D\u092F\u0915",
      "restart_required_desc": "\u0915\u092E\u093E\u0902\u0921 \u092A\u0948\u0932\u0947\u091F \u091F\u0949\u0917\u0932 \u092C\u0902\u0926 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092A\u0948\u0932\u0947\u091F \u0938\u0947 \u0915\u092E\u093E\u0902\u0921\u094D\u0938 \u0915\u094B \u092A\u0942\u0930\u0940 \u0924\u0930\u0939 \u0939\u091F\u093E\u0928\u0947 \u0939\u0947\u0924\u0941 \u0911\u092C\u094D\u0938\u0940\u0921\u093F\u092F\u0928 \u0915\u094B \u0930\u0940\u0938\u094D\u091F\u093E\u0930\u094D\u091F \u0915\u0930\u0928\u093E \u0906\u0935\u0936\u094D\u092F\u0915 \u0939\u0948\u0964 \u0905\u092D\u0940 \u0930\u0940\u0938\u094D\u091F\u093E\u0930\u094D\u091F \u0915\u0930\u0947\u0902?",
      // Basic Settings
      "enable_document_color": "\u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u0930\u0902\u0917 \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      "color_in_reading_mode": "\u0930\u0940\u0921\u093F\u0902\u0917 \u092E\u094B\u0921 \u092E\u0947\u0902 \u0930\u0902\u0917 \u0932\u0917\u093E\u090F\u0901",
      "force_full_render_reading": "\u0930\u0940\u0921\u093F\u0902\u0917 \u092E\u094B\u0921 \u092E\u0947\u0902 \u092A\u0942\u0930\u094D\u0923 \u0930\u0947\u0902\u0921\u0930 \u092B\u094B\u0930\u094D\u0938 \u0915\u0930\u0947\u0902",
      "force_full_render_reading_desc": "\u091C\u092C \u091A\u093E\u0932\u0942 \u0939\u094B, \u0924\u094B \u0930\u0940\u0921\u093F\u0902\u0917-\u092E\u094B\u0921 \u092A\u0942\u0930\u0947 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u0915\u094B \u090F\u0915 \u092A\u093E\u0938 \u092E\u0947\u0902 \u0930\u0902\u0917\u0928\u0947 \u0915\u093E \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0917\u093E\u0964 \u092C\u0921\u093C\u0947 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C\u094B\u0902 \u092A\u0930 \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u0928 \u0938\u092E\u0938\u094D\u092F\u093E\u090F\u0901 \u0939\u094B \u0938\u0915\u0924\u0940 \u0939\u0948\u0902\u0964 \u0938\u093E\u0935\u0927\u093E\u0928\u0940 \u0938\u0947 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902!",
      "disable_coloring_current_file": "\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      "disable_coloring_current_file_desc": "\u092B\u093C\u093E\u0907\u0932 \u0914\u0930 \u092B\u093C\u094B\u0932\u094D\u0921\u0930 \u0930\u0902\u0917\u093E\u0908 \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u0947 \u0924\u0939\u0924 \u0938\u0915\u094D\u0930\u093F\u092F \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u092C\u0939\u093F\u0937\u094D\u0915\u0930\u0923 \u0928\u093F\u092F\u092E \u091C\u094B\u0921\u093C\u0924\u093E \u0939\u0948\u0964",
      "btn_disable_for_this_file": "\u0907\u0938 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      // Coloring Settings
      "coloring_settings_header": "\u0930\u0902\u0917\u093E\u0908 \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938",
      "regex_support": "\u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u0938\u092A\u094B\u0930\u094D\u091F",
      "regex_support_desc": "\u092A\u0948\u091F\u0930\u094D\u0928 \u0915\u094B \u0930\u0947\u0917\u0941\u0932\u0930 \u090F\u0915\u094D\u0938\u092A\u094D\u0930\u0947\u0936\u0928 \u0939\u094B\u0928\u0947 \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F \u0926\u0947\u0902\u0964 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0915\u0947 \u0932\u093F\u090F \u0905\u092E\u093E\u0928\u094D\u092F \u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u0915\u094B \u0928\u091C\u093C\u0930\u0905\u0902\u0926\u093E\u091C\u093C \u0915\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
      "disable_regex_safety": "\u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      "disable_regex_safety_desc": "\u091C\u091F\u093F\u0932 \u092F\u093E \u0938\u0902\u092D\u093E\u0935\u093F\u0924 \u0916\u0924\u0930\u0928\u093E\u0915 \u090F\u0915\u094D\u0938\u092A\u094D\u0930\u0947\u0936\u0928\u094D\u0938 \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F \u0926\u0947\u0902\u0964 \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u0928 \u0938\u092E\u0938\u094D\u092F\u093E\u090F\u0901 \u092F\u093E \u092B\u094D\u0930\u0940\u091C\u093C \u0939\u094B \u0938\u0915\u0924\u0940 \u0939\u0948\u0902\u0964",
      "case_sensitive": "\u0915\u0947\u0938 \u0938\u0947\u0902\u0938\u093F\u091F\u093F\u0935",
      "case_sensitive_desc": '\u092F\u0926\u093F \u092F\u0939 \u091A\u093E\u0932\u0942 \u0939\u0948, \u0924\u094B "word" \u0914\u0930 "Word" \u0915\u094B \u0905\u0932\u0917 \u092E\u093E\u0928\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u092C\u0902\u0926 \u0939\u0948, \u0924\u094B \u0935\u0947 \u0938\u092E\u093E\u0928 \u0930\u0942\u092A \u0938\u0947 \u0930\u0902\u0917\u0947 \u091C\u093E\u0924\u0947 \u0939\u0948\u0902\u0964',
      "partial_match": "\u0906\u0902\u0936\u093F\u0915 \u092E\u093F\u0932\u093E\u0928",
      "partial_match_desc": '\u092F\u0926\u093F \u0938\u0915\u094D\u0937\u092E \u0939\u0948, \u0924\u094B \u092A\u0942\u0930\u093E \u0936\u092C\u094D\u0926 \u0930\u0902\u0917\u093E \u091C\u093E\u090F\u0917\u093E \u092F\u0926\u093F \u0909\u0938\u0915\u0947 \u0905\u0902\u0926\u0930 \u0915\u094B\u0908 \u0930\u0902\u0917\u093E \u0939\u0941\u0906 \u0936\u092C\u094D\u0926 \u092E\u093F\u0932\u0924\u093E \u0939\u0948 (\u091C\u0948\u0938\u0947, "as" "Jasper" \u0915\u094B \u0930\u0902\u0917\u0947\u0917\u093E)\u0964',
      // One-Time Actions
      "one_time_actions_header": "\u090F\u0915-\u092C\u093E\u0930 \u0915\u0940 \u0915\u094D\u0930\u093F\u092F\u093E\u090F\u0901",
      "setting_color_once": "\u090F\u0915 \u092C\u093E\u0930 \u0930\u0902\u0917 \u0932\u0917\u093E\u090F\u0901",
      "setting_color_once_desc": "\u091A\u092F\u0928\u093F\u0924 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u0947 \u0932\u093F\u090F HTML \u0907\u0928\u0932\u093E\u0907\u0928 \u0938\u092E\u094D\u092E\u093F\u0932\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u092A\u094D\u0932\u0917\u0907\u0928 \u092C\u0902\u0926 \u0939\u094B\u0928\u0947 \u092A\u0930 \u092D\u0940 \u092F\u0939 \u092C\u0928\u093E \u0930\u0939\u0924\u093E \u0939\u0948\u0964",
      "setting_highlight_once": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0930\u0947\u0902",
      "setting_highlight_once_desc": "\u092C\u0948\u0915\u0917\u094D\u0930\u093E\u0909\u0902\u0921 \u0938\u094D\u091F\u093E\u0907\u0932\u093F\u0902\u0917 \u0915\u0947 \u0938\u093E\u0925 HTML \u0907\u0928\u0932\u093E\u0907\u0928 \u0938\u092E\u094D\u092E\u093F\u0932\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u092A\u094D\u0932\u0917\u0907\u0928 \u092C\u0902\u0926 \u0939\u094B\u0928\u0947 \u092A\u0930 \u092D\u0940 \u092F\u0939 \u092C\u0928\u093E \u0930\u0939\u0924\u093E \u0939\u0948\u0964",
      "highlight_once_preview": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092A\u094D\u0930\u0940\u0935\u094D\u092F\u0942",
      "highlight_once_preview_text": "\u0926\u0947\u0916\u0947\u0902 \u0915\u093F \u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0948\u0938\u093E \u0926\u093F\u0916\u0947\u0917\u093E!",
      // Highlight Once Settings
      "highlight_once_opacity": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0913\u092A\u0947\u0938\u093F\u091F\u0940",
      "highlight_once_border_radius": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938 (px)",
      "reset_to_8": "8 \u092A\u0930 \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      "highlight_horizontal_padding": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u094D\u0937\u0948\u0924\u093F\u091C \u092A\u0948\u0921\u093F\u0902\u0917 (px)",
      "reset_to_4": "4 \u092A\u0930 \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      "enable_border_highlight_once": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0947 \u0932\u093F\u090F \u092C\u0949\u0930\u094D\u0921\u0930 \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      "enable_border_highlight_once_desc": "\u0905\u092A\u0928\u0947 \u0907\u0928\u0932\u093E\u0907\u0928 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092E\u0947\u0902 \u092C\u0949\u0930\u094D\u0921\u0930 \u091C\u094B\u0921\u093C\u0947\u0902\u0964 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E HTML/CSS \u0932\u0902\u092C\u093E \u0939\u094B\u0917\u093E\u0964",
      "highlight_once_border_style": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u0938\u094D\u091F\u093E\u0907\u0932",
      "opt_border_full": "\u092A\u0942\u0930\u094D\u0923 \u092C\u0949\u0930\u094D\u0921\u0930 (\u0938\u092D\u0940 \u0913\u0930)",
      "opt_border_top_bottom": "\u090A\u092A\u0930 \u0914\u0930 \u0928\u0940\u091A\u0947 \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_left_right": "\u092C\u093E\u090F\u0901 \u0914\u0930 \u0926\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_top_right": "\u090A\u092A\u0930 \u0914\u0930 \u0926\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_top_left": "\u090A\u092A\u0930 \u0914\u0930 \u092C\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_bottom_right": "\u0928\u0940\u091A\u0947 \u0914\u0930 \u0926\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_bottom_left": "\u0928\u0940\u091A\u0947 \u0914\u0930 \u092C\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_top": "\u0915\u0947\u0935\u0932 \u090A\u092A\u0930\u0940 \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_bottom": "\u0915\u0947\u0935\u0932 \u0928\u093F\u091A\u0932\u093E \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_left": "\u0915\u0947\u0935\u0932 \u092C\u093E\u092F\u093E\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      "opt_border_right": "\u0915\u0947\u0935\u0932 \u0926\u093E\u092F\u093E\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      "highlight_once_border_opacity": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u0913\u092A\u0947\u0938\u093F\u091F\u0940",
      "highlight_once_border_thickness": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u092E\u094B\u091F\u093E\u0908 (px)",
      "reset_to_1": "1 \u092A\u0930 \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      "use_global_highlight_style": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0947 \u0932\u093F\u090F \u0917\u094D\u0932\u094B\u092C\u0932 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0938\u094D\u091F\u093E\u0907\u0932 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
      "use_global_highlight_style_desc": "\u0906\u092A\u0915\u0940 \u0917\u094D\u0932\u094B\u092C\u0932 \u0907\u0928\u0932\u093E\u0907\u0928 \u0938\u094D\u091F\u093E\u0907\u0932 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E HTML/CSS \u0932\u0902\u092C\u093E \u0939\u094B \u0938\u0915\u0924\u093E \u0939\u0948\u0964",
      "style_highlight_once": "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0938\u094D\u091F\u093E\u0907\u0932 \u0915\u0930\u0947\u0902",
      "style_highlight_once_desc": "\u0906\u092A\u0915\u0940 \u0915\u0938\u094D\u091F\u092E \u0907\u0928\u0932\u093E\u0907\u0928 \u0938\u094D\u091F\u093E\u0907\u0932 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E HTML/CSS \u0932\u0902\u092C\u093E \u0939\u094B \u0938\u0915\u0924\u093E \u0939\u0948\u0964",
      // Global Highlight Appearance
      "global_highlight_appearance_header": "\u0917\u094D\u0932\u094B\u092C\u0932 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0902\u0917\u093E\u0908 \u0938\u094D\u0935\u0930\u0942\u092A",
      "highlight_opacity": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0913\u092A\u0947\u0938\u093F\u091F\u0940",
      "highlight_opacity_desc": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0940 \u0913\u092A\u0947\u0938\u093F\u091F\u0940 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (0-100%)",
      "highlight_border_radius": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938 (px)",
      "highlight_border_radius_desc": "\u0917\u094B\u0932 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u094B\u0928\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (px \u092E\u0947\u0902)",
      "highlight_horizontal_padding_desc": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u093F\u090F \u0917\u090F \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u0947 \u0932\u093F\u090F \u092C\u093E\u090F\u0901 \u0914\u0930 \u0926\u093E\u090F\u0901 \u092A\u0948\u0921\u093F\u0902\u0917 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (px \u092E\u0947\u0902)",
      "rounded_corners_wrapping": "\u0932\u093E\u0907\u0928 \u0930\u0948\u092A\u093F\u0902\u0917 \u092A\u0930 \u0917\u094B\u0932 \u0915\u094B\u0928\u0947",
      "rounded_corners_wrapping_desc": "\u091C\u092C \u091A\u093E\u0932\u0942 \u0939\u094B, \u0939\u093E\u0907\u0932\u093E\u0907\u091F\u094D\u0938 \u0915\u0947 \u0938\u092D\u0940 \u0913\u0930 \u0917\u094B\u0932 \u0915\u094B\u0928\u0947 \u0939\u094B\u0902\u0917\u0947, \u092F\u0939\u093E\u0901 \u0924\u0915 \u0915\u093F \u091C\u092C \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0928\u0908 \u0932\u093E\u0907\u0928 \u092A\u0930 \u0930\u0948\u092A \u0939\u094B\u0924\u093E \u0939\u0948\u0964",
      "enable_highlight_border": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      "enable_highlight_border_desc": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F\u094D\u0938 \u0915\u0947 \u091A\u093E\u0930\u094B\u0902 \u0913\u0930 \u092C\u0949\u0930\u094D\u0921\u0930 \u091C\u094B\u0921\u093C\u0947\u0902\u0964 \u092C\u0949\u0930\u094D\u0921\u0930 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092F\u093E \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0902\u0917 \u0938\u0947 \u092E\u0947\u0932 \u0916\u093E\u090F\u0917\u093E\u0964",
      "border_style": "\u092C\u0949\u0930\u094D\u0921\u0930 \u0938\u094D\u091F\u093E\u0907\u0932",
      "border_style_desc": "\u091A\u0941\u0928\u0947\u0902 \u0915\u093F \u092C\u0949\u0930\u094D\u0921\u0930 \u0915\u093F\u0928 \u0913\u0930 \u0932\u093E\u0917\u0942 \u0915\u0930\u0928\u093E \u0939\u0948",
      "border_opacity": "\u092C\u0949\u0930\u094D\u0921\u0930 \u0913\u092A\u0947\u0938\u093F\u091F\u0940",
      "border_opacity_desc": "\u092C\u0949\u0930\u094D\u0921\u0930 \u0915\u0940 \u0913\u092A\u0947\u0938\u093F\u091F\u0940 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (0-100%)",
      "border_thickness": "\u092C\u0949\u0930\u094D\u0921\u0930 \u092E\u094B\u091F\u093E\u0908 (px)",
      "border_thickness_desc": "\u092C\u0949\u0930\u094D\u0921\u0930 \u092E\u094B\u091F\u093E\u0908 0-5 \u092A\u093F\u0915\u094D\u0938\u0947\u0932 \u0938\u0947 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (\u091C\u0948\u0938\u0947 1, 2.5, 5)",
      "highlight_preview": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092A\u094D\u0930\u0940\u0935\u094D\u092F\u0942",
      "highlight_preview_text": "\u0926\u0947\u0916\u0947\u0902 \u0915\u093F \u0906\u092A\u0915\u093E \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0948\u0938\u093E \u0926\u093F\u0916\u0947\u0917\u093E!",
      // Color Swatches
      "color_swatches_header": "\u0930\u0902\u0917 \u0938\u094D\u0935\u0948\u091A\u0947\u0938",
      "color_picker_layout": "\u0930\u0902\u0917 \u092A\u093F\u0915\u0930 \u0932\u0947\u0906\u0909\u091F",
      "color_picker_layout_desc": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917 \u091A\u0941\u0928\u0924\u0947 \u0938\u092E\u092F \u0915\u094C\u0928 \u0938\u0947 \u0930\u0902\u0917 \u092A\u094D\u0930\u0915\u093E\u0930 \u0926\u093F\u0916\u093E\u0928\u0947 \u0939\u0948\u0902 \u091A\u0941\u0928\u0947\u0902",
      "opt_both_text_left": "\u0926\u094B\u0928\u094B\u0902: \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092C\u093E\u090F\u0901, \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0926\u093E\u090F\u0901",
      "opt_both_bg_left": "\u0926\u094B\u0928\u094B\u0902: \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u093E\u090F\u0901, \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0926\u093E\u090F\u0901",
      "opt_text_only": "\u0915\u0947\u0935\u0932 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917",
      "opt_background_only": "\u0915\u0947\u0935\u0932 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0902\u0917",
      "replace_default_swatches": "\u0921\u093F\u092B\u0949\u0932\u094D\u091F \u0938\u094D\u0935\u0948\u091A\u0947\u0938 \u092C\u0926\u0932\u0947\u0902",
      "replace_default_swatches_desc": "\u092F\u0926\u093F \u092F\u0939 \u091A\u093E\u0932\u0942 \u0939\u0948, \u0924\u094B \u0915\u0947\u0935\u0932 \u0906\u092A\u0915\u0947 \u0915\u0938\u094D\u091F\u092E \u0930\u0902\u0917 \u0939\u0940 \u0915\u0932\u0930 \u092A\u093F\u0915\u0930 \u092E\u0947\u0902 \u0926\u093F\u0916\u0947\u0902\u0917\u0947\u0964 \u0915\u094B\u0908 \u0921\u093F\u092B\u0949\u0932\u094D\u091F \u0928\u0939\u0940\u0902!",
      "enable_custom_swatches": "\u0915\u0938\u094D\u091F\u092E \u0938\u094D\u0935\u0948\u091A\u0947\u0938 \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      "enable_custom_swatches_desc": "\u092F\u0926\u093F \u092F\u0939 \u091A\u093E\u0932\u0942 \u0939\u0948, \u0924\u094B \u0906\u092A\u0915\u0947 \u0915\u0938\u094D\u091F\u092E \u0938\u094D\u0935\u0948\u091A\u0947\u0938 \u0915\u0932\u0930 \u092A\u093F\u0915\u0930 \u092E\u0947\u0902 \u0926\u093F\u0916\u0947\u0902\u0917\u0947\u0964",
      "use_swatch_names": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917\u093E\u0908 \u0915\u0947 \u0932\u093F\u090F \u0938\u094D\u0935\u0948\u091A \u0928\u093E\u092E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
      "use_swatch_names_desc": "\u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0907\u0928\u092A\u0941\u091F\u094D\u0938 \u0915\u0947 \u092C\u0917\u0932 \u092E\u0947\u0902 \u0938\u094D\u0935\u0948\u091A \u0928\u093E\u092E\u094B\u0902 \u0915\u093E \u0921\u094D\u0930\u0949\u092A\u0921\u093E\u0909\u0928 \u0926\u093F\u0916\u093E\u090F\u0901",
      "default_colors_header": "\u0921\u093F\u092B\u0949\u0932\u094D\u091F \u0930\u0902\u0917",
      "custom_swatches_header": "\u0915\u0938\u094D\u091F\u092E \u0938\u094D\u0935\u0948\u091A\u0947\u0938",
      "btn_add_color": "+ \u0930\u0902\u0917 \u091C\u094B\u0921\u093C\u0947\u0902",
      "no_custom_swatches_yet": '\u0905\u092D\u0940 \u0924\u0915 \u0915\u094B\u0908 \u0915\u0938\u094D\u091F\u092E \u0938\u094D\u0935\u0948\u091A\u0947\u0938 \u0928\u0939\u0940\u0902\u0964 \u092C\u0928\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F "+ \u0930\u0902\u0917 \u091C\u094B\u0921\u093C\u0947\u0902" \u0915\u094D\u0932\u093F\u0915 \u0915\u0930\u0947\u0902\u0964',
      "label_built_in": "(\u092C\u093F\u0932\u094D\u091F-\u0907\u0928)",
      // Color Picker
      "pick_color_header": "\u0930\u0902\u0917 \u091A\u0941\u0928\u0947\u0902",
      "selected_text_preview": "\u091A\u092F\u0928\u093F\u0924 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      "text_color_title": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917",
      "select_swatch": "\u0938\u094D\u0935\u0948\u091A \u091A\u0941\u0928\u0947\u0902\u2026",
      "highlight_color_title": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0902\u0917",
      "select_highlight_swatch": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0938\u094D\u0935\u0948\u091A \u091A\u0941\u0928\u0947\u0902\u2026",
      // Always Colored Texts
      "always_colored_texts_header": "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0947 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      "always_colored_texts_desc": "\u092F\u0939\u093E\u0901 \u0906\u092A \u0905\u092A\u0928\u0947 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0914\u0930 \u0909\u0928\u0915\u0947 \u0930\u0902\u0917\u094B\u0902 \u0915\u093E \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964",
      "search_colored_words_placeholder": "\u0930\u0902\u0917\u0947 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0916\u094B\u091C\u0947\u0902\u2026",
      "sort_label_last-added": "\u0915\u094D\u0930\u092E: \u0905\u0902\u0924\u093F\u092E \u091C\u094B\u0921\u093C\u093E \u0939\u0941\u0906",
      "sort_label_a-z": "\u0915\u094D\u0930\u092E: A-Z",
      "sort_label_reverse-a-z": "\u0915\u094D\u0930\u092E: Z-A",
      "sort_label_style-order": "\u0915\u094D\u0930\u092E: \u0938\u094D\u091F\u093E\u0907\u0932 \u0911\u0930\u094D\u0921\u0930",
      "sort_label_color": "\u0915\u094D\u0930\u092E: \u0930\u0902\u0917",
      "btn_add_new_word": "+ \u0928\u092F\u093E \u0930\u0902\u0917\u0940\u0928 \u0936\u092C\u094D\u0926 / \u092A\u0948\u091F\u0930\u094D\u0928 \u091C\u094B\u0921\u093C\u0947\u0902",
      "style_type_text": "\u0930\u0902\u0917",
      "style_type_highlight": "\u0939\u093E\u0907\u0932\u093E\u0907\u091F",
      "style_type_both": "\u0926\u094B\u0928\u094B\u0902",
      "word_pattern_placeholder_long": "\u092A\u0948\u091F\u0930\u094D\u0928, \u0936\u092C\u094D\u0926 \u092F\u093E \u0905\u0932\u094D\u092A\u0935\u093F\u0930\u093E\u092E \u0938\u0947 \u0905\u0932\u0917 \u0915\u093F\u090F \u0917\u090F \u0936\u092C\u094D\u0926 (\u091C\u0948\u0938\u0947 hello, world, foo)",
      "word_pattern_placeholder_short": "\u0915\u0940\u0935\u0930\u094D\u0921 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928, \u092F\u093E \u0905\u0932\u094D\u092A\u0935\u093F\u0930\u093E\u092E \u0938\u0947 \u0905\u0932\u0917 \u0915\u093F\u090F \u0917\u090F \u0936\u092C\u094D\u0926",
      "use_regex": "\u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
      "flags_placeholder": "\u092B\u094D\u0932\u0948\u0917\u094D\u0938",
      "text_or_regex_placeholder": "\u091F\u0947\u0915\u094D\u0938\u094D\u091F / \u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u0907\u0928\u092A\u0941\u091F",
      "duplicate_entry": "\u0921\u0941\u092A\u094D\u0932\u093F\u0915\u0947\u091F \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F",
      "open_in_regex_tester": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091F\u0947\u0938\u094D\u091F\u0930 \u092E\u0947\u0902 \u0916\u094B\u0932\u0947\u0902",
      "no_rules_configured": "\u0915\u094B\u0908 \u0928\u093F\u092F\u092E \u0915\u0949\u0928\u094D\u092B\u093C\u093F\u0917\u0930 \u0928\u0939\u0940\u0902 \u0915\u093F\u090F \u0917\u090F\u0964",
      "no_rules_found": "\u0915\u094B\u0908 \u0928\u093F\u092F\u092E \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u093E\u0964",
      // Presets
      "btn_presets": "\u092A\u094D\u0930\u0940\u0938\u0947\u091F\u094D\u0938",
      "preset_all_headings": "\u0938\u092D\u0940 \u0939\u0947\u0921\u093F\u0902\u0917\u094D\u0938 (H1-H6)",
      "preset_bullet_points": "\u092C\u0941\u0932\u0947\u091F \u092A\u0949\u0907\u0902\u091F\u094D\u0938",
      "preset_numbered_lists": "\u0938\u0902\u0916\u094D\u092F\u093E\u092F\u093F\u0924 \u0938\u0942\u091A\u093F\u092F\u093E\u0901",
      "preset_task_checked": "\u091F\u093E\u0938\u094D\u0915 \u0932\u093F\u0938\u094D\u091F (\u091A\u0947\u0915 \u0915\u093F\u092F\u093E \u0939\u0941\u0906)",
      "preset_task_unchecked": "\u091F\u093E\u0938\u094D\u0915 \u0932\u093F\u0938\u094D\u091F (\u0905\u0928\u091A\u0947\u0915 \u0915\u093F\u092F\u093E \u0939\u0941\u0906)",
      "preset_dates_yyyy_mm_dd": "\u0924\u093F\u0925\u093F\u092F\u093E\u0901 (YYYY-MM-DD)",
      "preset_times_am_pm": "\u0938\u092E\u092F (AM/PM)",
      "preset_dates_yyyy_mmm_dd": "\u0924\u093F\u0925\u093F\u092F\u093E\u0901 (YYYY-MMM-DD)",
      "preset_relative_dates": "\u0938\u093E\u092A\u0947\u0915\u094D\u0937 \u0924\u093F\u0925\u093F\u092F\u093E\u0901",
      "preset_basic_urls": "\u092C\u0947\u0938\u093F\u0915 URL",
      "preset_markdown_links": "\u092E\u093E\u0930\u094D\u0915\u0921\u093E\u0909\u0928 \u0932\u093F\u0902\u0915",
      "preset_domain_names": "\u0921\u094B\u092E\u0947\u0928 \u0928\u093E\u092E",
      "preset_email_addresses": "\u0908\u092E\u0947\u0932 \u092A\u0924\u0947",
      "preset_at_username": "@\u0909\u092A\u092F\u094B\u0917\u0915\u0930\u094D\u0924\u093E \u0928\u093E\u092E",
      "preset_currency": "\u092E\u0941\u0926\u094D\u0930\u093E",
      "preset_measurements": "\u092E\u093E\u092A",
      "preset_phone_numbers": "\u092B\u094B\u0928 \u0928\u0902\u092C\u0930",
      "preset_all_texts": "\u0938\u092D\u0940 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      "preset_codeblocks": "\u0915\u094B\u0921 \u092C\u094D\u0932\u0949\u0915",
      "preset_inline_comments": "\u091F\u093F\u092A\u094D\u092A\u0923\u093F\u092F\u093E\u0901 (%%\u2026%%)",
      "preset_parentheses": "\u0915\u094B\u0937\u094D\u0920\u0915 ()",
      "preset_square_brackets": "\u0935\u0930\u094D\u0917 \u0915\u094B\u0937\u094D\u0920\u0915 []",
      "preset_curly_braces": "\u0918\u0941\u0902\u0918\u0930\u093E\u0932\u0947 \u092C\u094D\u0930\u0947\u0938\u0947\u0938 {}",
      "preset_angle_brackets": "\u0915\u094B\u0923 \u0915\u094B\u0937\u094D\u0920\u0915 <>",
      "preset_colons": "\u0915\u094B\u0932\u0928 :",
      "preset_double_quotes": "\u0921\u092C\u0932 \u0915\u094B\u091F\u094D\u0938",
      "preset_single_quotes": "\u0938\u093F\u0902\u0917\u0932 \u0915\u094B\u091F\u094D\u0938",
      "preset_single_quotes_word_bounded": "\u0938\u093F\u0902\u0917\u0932 \u0915\u094B\u091F\u094D\u0938 (\u0936\u092C\u094D\u0926-\u0938\u0940\u092E\u093F\u0924)",
      "preset_group_markdown_formatting": "\u092E\u093E\u0930\u094D\u0915\u0921\u093E\u0909\u0928 \u092B\u0949\u0930\u094D\u092E\u0947\u091F\u093F\u0902\u0917",
      "preset_group_other_patterns": "\u0905\u0928\u094D\u092F \u092A\u0948\u091F\u0930\u094D\u0928",
      "preset_group_brackets": "\u0915\u094B\u0937\u094D\u0920\u0915",
      // Blacklist Settings
      "blacklist_words_header": "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0936\u092C\u094D\u0926",
      "blacklist_words_desc": "\u092F\u0939\u093E\u0901 \u0915\u0940\u0935\u0930\u094D\u0921 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u0915\u092D\u0940 \u0930\u0902\u0917\u0947 \u0928\u0939\u0940\u0902 \u091C\u093E\u090F\u0901\u0917\u0947, \u092F\u0939\u093E\u0901 \u0924\u0915 \u0915\u093F \u0906\u0902\u0936\u093F\u0915 \u092E\u093F\u0932\u093E\u0928 \u0915\u0947 \u0932\u093F\u090F \u092D\u0940\u0964",
      "search_blacklist_placeholder": "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0936\u092C\u094D\u0926 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u0916\u094B\u091C\u0947\u0902\u2026",
      "blacklist_sort_label_last-added": "\u0915\u094D\u0930\u092E: \u0905\u0902\u0924\u093F\u092E \u091C\u094B\u0921\u093C\u093E \u0939\u0941\u0906",
      "blacklist_sort_label_a-z": "\u0915\u094D\u0930\u092E: A-Z",
      "blacklist_sort_label_reverse-a-z": "\u0915\u094D\u0930\u092E: Z-A",
      "btn_add_blacklist": "+ \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0936\u092C\u094D\u0926 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u091C\u094B\u0921\u093C\u0947\u0902",
      "btn_add_to_blacklist": "+ \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u092E\u0947\u0902 \u091C\u094B\u0921\u093C\u0947\u0902",
      "btn_add_blacklist_word": "+ \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0936\u092C\u094D\u0926 \u091C\u094B\u0921\u093C\u0947\u0902",
      "btn_add_blacklist_regex": "+ \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091C\u094B\u0921\u093C\u0947\u0902",
      // File & Folder Rules
      "file_folder_rules_header": "\u092B\u093C\u093E\u0907\u0932 \u0914\u0930 \u092B\u093C\u094B\u0932\u094D\u0921\u0930 \u0930\u0902\u0917\u093E\u0908 \u0928\u093F\u092F\u092E",
      "file_folder_rules_desc": "\u0928\u093E\u092E \u092E\u093F\u0932\u093E\u0928, \u0938\u091F\u0940\u0915 \u092A\u0925 \u092F\u093E \u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u092A\u0948\u091F\u0930\u094D\u0928 \u0915\u0947 \u0938\u093E\u0925 \u0930\u0902\u0917\u093E\u0908 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0915\u0930\u0947\u0902\u0964 \u0935\u0949\u0932\u094D\u091F-\u0935\u093E\u0907\u0921 \u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u0916\u093E\u0932\u0940 \u092C\u0939\u093F\u0937\u094D\u0915\u0930\u0923 \u090F\u0902\u091F\u094D\u0930\u0940 \u091B\u094B\u0921\u093C\u0947\u0902\u0964",
      "search_file_folder_rules_placeholder": "\u092B\u093C\u093E\u0907\u0932/\u092B\u093C\u094B\u0932\u094D\u0921\u0930 \u0928\u093F\u092F\u092E \u0916\u094B\u091C\u0947\u0902\u2026",
      "path_sort_label_last-added": "\u0915\u094D\u0930\u092E: \u0905\u0902\u0924\u093F\u092E \u091C\u094B\u0921\u093C\u093E \u0939\u0941\u0906",
      "path_sort_label_a-z": "\u0915\u094D\u0930\u092E: A-Z",
      "path_sort_label_reverse-a-z": "\u0915\u094D\u0930\u092E: Z-A",
      "path_sort_label_mode": "\u0915\u094D\u0930\u092E: \u092E\u094B\u0921",
      "path_sort_label_type": "\u0915\u094D\u0930\u092E: \u092A\u094D\u0930\u0915\u093E\u0930",
      "btn_add_file_folder_rule": "+ \u092B\u093C\u093E\u0907\u0932/\u092B\u093C\u094B\u0932\u094D\u0921\u0930 \u0928\u093F\u092F\u092E \u091C\u094B\u0921\u093C\u0947\u0902",
      "disabled_files_header": "\u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926 \u0915\u0940 \u0917\u0908 \u092B\u093C\u093E\u0907\u0932\u0947\u0902:",
      // Advanced Settings - Inclusion Exclusion Labels
      "path_rule_mode_include": "\u0936\u093E\u092E\u093F\u0932 \u0915\u0930\u0947\u0902",
      "path_rule_mode_exclude": "\u092C\u093E\u0939\u0930 \u0915\u0930\u0947\u0902",
      "text_rule_mode_include": "\u0915\u0947\u0935\u0932 (\u0935\u094D\u0939\u093E\u0907\u091F\u0932\u093F\u0938\u094D\u091F) \u092E\u0947\u0902 \u0930\u0902\u0917 \u0915\u0930\u0947\u0902",
      "text_rule_mode_exclude": "(\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F) \u092E\u0947\u0902 \u0930\u0902\u0917 \u0928 \u0915\u0930\u0947\u0902",
      "mode_only_colors_in": "\u0915\u0947 \u092D\u0940\u0924\u0930 \u0939\u0940 \u0930\u0902\u0917 \u0915\u0930\u0924\u093E \u0939\u0948",
      "mode_does_not_color_in": "\u0915\u0947 \u092D\u0940\u0924\u0930 \u0930\u0902\u0917 \u0928\u0939\u0940\u0902 \u0915\u0930\u0924\u093E",
      "label_text_include": "\u0935\u094D\u0939\u093E\u0907\u091F\u0932\u093F\u0938\u094D\u091F",
      "label_text_exclude": "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F",
      "enter_path_or_pattern": "\u092A\u0925 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",
      "label_regex": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938",
      // Advanced Rules
      "advanced_rules_header": "\u0909\u0928\u094D\u0928\u0924 \u0928\u093F\u092F\u092E",
      "advanced_rules_modal_header": "\u0909\u0928\u094D\u0928\u0924 \u0928\u093F\u092F\u092E",
      "advanced_rules_manage_button": "\u0909\u0928\u094D\u0928\u0924 \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u093E \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0915\u0930\u0947\u0902",
      "edit_rule_header": "\u0928\u093F\u092F\u092E \u0938\u0902\u092A\u093E\u0926\u093F\u0924 \u0915\u0930\u0947\u0902",
      "add_rule_header": "\u0928\u092F\u093E \u0928\u093F\u092F\u092E \u091C\u094B\u0921\u093C\u0947\u0902",
      "btn_add_rule": "+ \u0928\u093F\u092F\u092E \u091C\u094B\u0921\u093C\u0947\u0902",
      "btn_save_rule": "\u0928\u093F\u092F\u092E \u0938\u0939\u0947\u091C\u0947\u0902",
      "btn_add_words": "+ \u0936\u092C\u094D\u0926 \u091C\u094B\u0921\u093C\u0947\u0902",
      "btn_add_regex": "+ \u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091C\u094B\u0921\u093C\u0947\u0902",
      "btn_save_regex": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u0938\u0939\u0947\u091C\u0947\u0902",
      // Regex Tester
      "regex_tester_header": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091F\u0947\u0938\u094D\u091F\u0930",
      "regex_tester_blacklist": "\u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u091F\u0947\u0938\u094D\u091F\u0930 - \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F",
      "regex_expression_placeholder": "\u0905\u092A\u0928\u093E \u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u0935\u094D\u092F\u0902\u091C\u0928 \u092F\u0939\u093E\u0901 \u0921\u093E\u0932\u0947\u0902",
      "regex_subject_placeholder": "\u092F\u0939\u093E\u0901 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091F\u093E\u0907\u092A \u0915\u0930\u0947\u0902...",
      "regex_name_placeholder": "\u0905\u092A\u0928\u0947 \u0930\u0947\u091C\u0947\u0915\u094D\u0938 \u0915\u093E \u0928\u093E\u092E \u0926\u0947\u0902",
      "matches": "\u092E\u0947\u0932",
      "matches_found": "\u092E\u0947\u0932 \u092E\u093F\u0932 \u0917\u090F",
      // Regex Flags
      "flag_g": "\u0935\u0948\u0936\u094D\u0935\u093F\u0915 \u092B\u094D\u0932\u0948\u0917: \u0938\u092D\u0940 \u092E\u0947\u0932 \u0916\u094B\u091C\u0947\u0902",
      "flag_i": "\u0915\u0947\u0938-\u0905\u0938\u0902\u0935\u0947\u0926\u0928\u0936\u0940\u0932 \u092B\u094D\u0932\u0948\u0917",
      "flag_m": "\u092E\u0932\u094D\u091F\u0940\u0932\u093E\u0907\u0928 \u092B\u094D\u0932\u0948\u0917: ^ \u0914\u0930 $ \u0932\u093E\u0907\u0928 \u0938\u0940\u092E\u093E\u0913\u0902 \u0938\u0947 \u092E\u0947\u0932 \u0916\u093E\u0924\u0947 \u0939\u0948\u0902",
      "flag_s": "dotAll \u092B\u094D\u0932\u0948\u0917: . \u0928\u0908 \u092A\u0902\u0915\u094D\u0924\u093F\u092F\u094B\u0902 \u0938\u0947 \u092E\u0947\u0932 \u0916\u093E\u0924\u093E \u0939\u0948",
      "flag_u": "\u092F\u0942\u0928\u093F\u0915\u094B\u0921 \u092B\u094D\u0932\u0948\u0917: \u092F\u0942\u0928\u093F\u0915\u094B\u0921 \u0915\u094B\u0921 \u092A\u0949\u0907\u0902\u091F\u094D\u0938 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0935\u094D\u092F\u0935\u0939\u093E\u0930 \u0915\u0930\u0947\u0902",
      "flag_y": "\u0938\u094D\u091F\u093F\u0915\u0940 \u092B\u094D\u0932\u0948\u0917: lastIndex \u0938\u094D\u0925\u093F\u0924\u093F \u0938\u0947 \u092E\u0947\u0932 \u0916\u093E\u090F\u0902",
      // Data Export/Import
      "data_export_import_header": "\u0921\u0947\u091F\u093E \u0928\u093F\u0930\u094D\u092F\u093E\u0924/\u0906\u092F\u093E\u0924",
      "export_plugin_data": "\u092A\u094D\u0932\u0917\u0907\u0928 \u0921\u0947\u091F\u093E \u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0915\u0930\u0947\u0902",
      "export_plugin_data_desc": "\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938, \u0936\u092C\u094D\u0926 \u0914\u0930 \u0928\u093F\u092F\u092E JSON \u092B\u093C\u093E\u0907\u0932 \u092E\u0947\u0902 \u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0915\u0930\u0947\u0902\u0964",
      "btn_export": "\u0928\u093F\u0930\u094D\u092F\u093E\u0924",
      "import_plugin_data": "\u092A\u094D\u0932\u0917\u0907\u0928 \u0921\u0947\u091F\u093E \u0906\u092F\u093E\u0924 \u0915\u0930\u0947\u0902",
      "import_plugin_data_desc": "JSON \u092B\u093C\u093E\u0907\u0932 \u0938\u0947 \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u0906\u092F\u093E\u0924 \u0915\u0930\u0947\u0902",
      "btn_import": "\u0906\u092F\u093E\u0924"
    };
  }
});

// src/i18n/it.js
var require_it = __commonJS({
  "src/i18n/it.js"(exports2, module2) {
    module2.exports = {
      // Plugin Metadata & Basic Labels
      "__name": "Italiano",
      "settings_title": "Impostazioni Always Color Text",
      "header_plugin_name": "Always Color Text",
      "ribbon_title": "Always Color Text",
      // Language Settings
      "language_label": "Lingua",
      "language_desc": "Seleziona la lingua da utilizzare in questo plugin",
      "language_en": "Inglese",
      "language_es": "Spagnolo",
      "language_fr": "Francese",
      "language_eu": "Basco",
      "language_ru": "Russo",
      "language_auto": "Predefinito di sistema",
      // Release Notes
      "latest_release_notes_label": "Note di rilascio pi\xF9 recenti",
      "latest_release_notes_desc": "Visualizza le note di rilascio pi\xF9 recenti del plugin",
      "open_changelog_button": "Apri changelog",
      "command_show_release_notes": "Mostra note di rilascio pi\xF9 recenti",
      "changelog_view_on_github": "Visualizza su GitHub",
      "changelog_loading": "Caricamento rilasci\u2026",
      "changelog_no_info": "Nessuna informazione di rilascio disponibile.",
      "changelog_release": "Rilascio",
      "changelog_no_notes": "Nessuna nota",
      "changelog_failed_to_load": "Caricamento note di rilascio fallito.",
      // UI Elements & Menus
      "file_menu_enable": "Abilita Always Color Text per questo file",
      "file_menu_disable": "Disabilita Always Color Text per questo file",
      "menu_color_once": "Colora una volta",
      "menu_highlight_once": "Evidenzia una volta",
      "menu_always_color_text": "Always Color Text",
      "menu_remove_always_color_text": "Rimuovi Always Color Text",
      "menu_blacklist_word": "Aggiungi parola alla blacklist",
      "show_toggle_statusbar": "Mostra toggle nella barra di stato",
      "show_toggle_ribbon": "Mostra icona toggle nel ribbon",
      "show_toggle_command": "Mostra toggle nei comandi",
      "show_blacklist_menu": "Mostra parole in blacklist nel menu tasto destro",
      "show_blacklist_menu_desc": "Aggiunge una voce nel menu tasto destro per mettere in blacklist il testo selezionato dalla colorazione.",
      "tooltip_enable_for_file": "Abilita per questo file",
      "tooltip_delete_all_words": "Elimina tutte le parole/pattern definiti",
      "tooltip_delete_all_blacklist": "Elimina tutte le parole/pattern in blacklist",
      "tooltip_use_regex": "Usa come pattern regex",
      "drag_to_reorder": "Trascina per riordinare",
      "reset_text_color": "Ripristina colore del testo",
      "reset_highlight": "Ripristina evidenziazione",
      // Commands
      "command_color_selected": "Colora testo selezionato",
      "command_toggle_current": "Abilita/Disabilita colorazione per il documento corrente",
      "command_toggle_global": "Abilita/Disabilita Always Color Text",
      "command_manage_advanced_rules": "Gestisci Regole Avanzate",
      "command_open_regex_tester": "Aggiungi Regex (Apri Tester Regex)",
      "command_open_blacklist_regex_tester": "Aggiungi Regex alla Lista Nera",
      "command_manage_colored_texts": "Gestisci testi colorati",
      "command_toggle_hide_text_colors": "Nascondi/Mostra colori del testo",
      "command_toggle_hide_highlights": "Nascondi/Mostra evidenziazioni",
      // Notifications
      "notice_enabled": "Always Color Text abilitato",
      "notice_disabled": "Always Color Text disabilitato",
      "notice_blacklisted_cannot_color": '"{word}" \xE8 in blacklist e non pu\xF2 essere colorata.',
      "notice_removed_always_color": 'Rimossa colorazione permanente per "{word}".',
      "notice_added_to_blacklist": '"{word}" aggiunta alla blacklist.',
      "notice_already_blacklisted": '"{word}" \xE8 gi\xE0 in blacklist.',
      "notice_select_text_first": "Seleziona prima del testo da colorare.",
      "notice_no_active_file": "Nessun file attivo per attivare/disattivare la colorazione.",
      "notice_coloring_enabled_for_path": "Colorazione abilitata per {path}",
      "notice_coloring_disabled_for_path": "Colorazione disabilitata per {path}",
      "notice_global_enabled": "Always Color Text abilitato",
      "notice_global_disabled": "Always Color Text disabilitato",
      "notice_unable_open_changelog": "Impossibile aprire la finestra del changelog.",
      "notice_pattern_blocked": "Pattern bloccato per sicurezza memoria:",
      "notice_pattern_too_complex": "Pattern troppo complesso:",
      "notice_invalid_hex_format": "Formato colore esadecimale non valido. Usa #RRGGBB o #RGB.",
      "notice_error_saving_changes": "Errore nel salvare le modifiche. Riprova.",
      "notice_invalid_color_format": "Formato colore non valido.",
      "notice_exported": "Esportato: {fname}",
      "notice_export_failed": "Esportazione fallita",
      "notice_import_completed": "Importazione completata",
      "notice_import_failed": "Importazione fallita",
      "notice_invalid_regex": "Espressione regolare non valida",
      "notice_empty_pattern": "Il modello \xE8 vuoto",
      "notice_added_regex": "Espressione regolare aggiunta",
      "notice_rule_updated": "Regola aggiornata",
      "notice_regex_updated": "Espressione regolare aggiornata",
      "notice_entry_updated": "Voce aggiornata",
      "notice_entry_duplicated": "Voce duplicata",
      "notice_error_opening_regex_tester": "Errore nell'apertura del tester regex",
      "notice_error_opening_blacklist_regex_tester": "Errore nell'apertura del tester regex della lista nera",
      "notice_error_opening_advanced_rules": "Errore nell'apertura della finestra delle regole avanzate",
      "notice_text_color_reset": "Colore del testo ripristinato",
      "notice_highlight_reset": "Evidenziazione ripristinata",
      "notice_text_colors_hidden": "Colori del testo nascosti",
      "notice_text_colors_visible": "Colori del testo visibili",
      "notice_highlights_hidden": "Evidenziazioni nascoste",
      "notice_highlights_visible": "Evidenziazioni visibili",
      "notice_regex_support_disabled": "Il supporto regex \xE8 disabilitato. Abilitalo nelle impostazioni per utilizzare i pattern regex.",
      "notice_no_active_file_to_disable": "Nessun file attivo per disabilitare la colorazione.",
      "notice_already_disabled_for_path": "La colorazione \xE8 gi\xE0 disabilitata per {path}",
      "notice_filter_disabled": "Filtro disabilitato",
      // Confirmation Dialogs
      "confirm_delete_all_title": "Elimina tutte le parole",
      "confirm_delete_all_desc": "Sei sicuro di voler eliminare tutte le tue parole/pattern colorati? Non potrai annullare questa azione!",
      "confirm_delete_all_blacklist_title": "Elimina tutte le parole in blacklist",
      "confirm_delete_all_blacklist_desc": "Sei sicuro di voler eliminare tutte le voci della blacklist? Non potrai annullare questa azione!",
      "restart_required_title": "Riavvio richiesto",
      "restart_required_desc": "Disabilitare il toggle della palette comandi richiede il riavvio di Obsidian per rimuovere completamente i comandi dalla palette. Riavviare ora?",
      // Basic Settings
      "enable_document_color": "Abilita colore documento",
      "color_in_reading_mode": "Colora in modalit\xE0 lettura",
      "force_full_render_reading": "Forza rendering completo in modalit\xE0 lettura",
      "force_full_render_reading_desc": "Se attivo, la modalit\xE0 lettura tenter\xE0 di colorare l'intero documento in una sola passata. Pu\xF2 causare problemi di prestazioni su documenti grandi. Usare con cautela!",
      "disable_coloring_current_file": "Disabilita colorazione per file corrente",
      "disable_coloring_current_file_desc": "Aggiunge una regola di esclusione per il file attivo sotto regole colorazione file e cartelle.",
      "btn_disable_for_this_file": "Disabilita per questo file",
      // Coloring Settings
      "coloring_settings_header": "Impostazioni colorazione",
      "regex_support": "Supporto regex",
      "regex_support_desc": "Permetti ai pattern di essere espressioni regolari. Le regex non valide vengono ignorate per sicurezza.",
      "disable_regex_safety": "Disabilita sicurezza regex",
      "disable_regex_safety_desc": "Permetti espressioni complesse o potenzialmente pericolose. Pu\xF2 causare problemi di prestazioni o blocchi.",
      "case_sensitive": "Distingui maiuscole/minuscole",
      "case_sensitive_desc": 'Se attivo, "word" e "Word" sono trattati come diversi. Se disattivo, sono colorati allo stesso modo.',
      "partial_match": "Corrispondenza parziale",
      "partial_match_desc": `Se abilitato, l'intera parola sar\xE0 colorata se viene trovata al suo interno una parola colorata (es. "as" colora "Jasper").`,
      // One-Time Actions
      "one_time_actions_header": "Azioni una tantum",
      "setting_color_once": "Colora una volta",
      "setting_color_once_desc": "Inserisce HTML inline per il testo selezionato. Persiste anche se il plugin \xE8 disattivato.",
      "setting_highlight_once": "Evidenzia una volta",
      "setting_highlight_once_desc": "Inserisce HTML inline con stile di sfondo. Persiste anche se il plugin \xE8 disattivato.",
      "highlight_once_preview": "Anteprima evidenziazione una volta",
      "highlight_once_preview_text": "Ecco come apparir\xE0 l'evidenziazione!",
      // Highlight Once Settings
      "highlight_once_opacity": "Opacit\xE0 evidenziazione una volta",
      "highlight_once_border_radius": "Raggio bordo evidenziazione una volta (px)",
      "reset_to_8": "Reimposta a 8",
      "highlight_horizontal_padding": "Spaziatura orizzontale evidenziazione (px)",
      "reset_to_4": "Reimposta a 4",
      "enable_border_highlight_once": "Abilita bordo per evidenziazione una volta",
      "enable_border_highlight_once_desc": "Aggiungi un bordo all'evidenziazione inline. L'HTML/CSS generato pu\xF2 essere lungo.",
      "highlight_once_border_style": "Stile bordo evidenziazione una volta",
      "opt_border_full": "Bordo completo (tutti i lati)",
      "opt_border_top_bottom": "Bordi superiore e inferiore",
      "opt_border_left_right": "Bordi sinistro e destro",
      "opt_border_top_right": "Bordi superiore e destro",
      "opt_border_top_left": "Bordi superiore e sinistro",
      "opt_border_bottom_right": "Bordi inferiore e destro",
      "opt_border_bottom_left": "Bordi inferiore e sinistro",
      "opt_border_top": "Solo bordo superiore",
      "opt_border_bottom": "Solo bordo inferiore",
      "opt_border_left": "Solo bordo sinistro",
      "opt_border_right": "Solo bordo destro",
      "highlight_once_border_opacity": "Opacit\xE0 bordo evidenziazione una volta",
      "highlight_once_border_thickness": "Spessore bordo evidenziazione una volta (px)",
      "reset_to_1": "Reimposta a 1",
      "use_global_highlight_style": "Usa stile evidenziazione globale per evidenzia una volta",
      "use_global_highlight_style_desc": "Utilizza il tuo stile inline globale. L'HTML/CSS generato potrebbe essere lungo.",
      "style_highlight_once": "Stile evidenzia una volta",
      "style_highlight_once_desc": "Utilizza il tuo stile inline personalizzato. L'HTML/CSS generato potrebbe essere lungo.",
      // Global Highlight Appearance
      "global_highlight_appearance_header": "Aspetto globale evidenziazione colorata",
      "highlight_opacity": "Opacit\xE0 evidenziazione",
      "highlight_opacity_desc": "Imposta l'opacit\xE0 dell'evidenziazione (0-100%)",
      "highlight_border_radius": "Raggio bordo evidenziazione (px)",
      "highlight_border_radius_desc": "Imposta il raggio del bordo (in px) per angoli arrotondati dell'evidenziazione",
      "highlight_horizontal_padding_desc": "Imposta la spaziatura sinistra e destra (in px) per il testo evidenziato",
      "rounded_corners_wrapping": "Angoli arrotondati sull'a capo",
      "rounded_corners_wrapping_desc": "Se abilitato, le evidenziazioni avranno angoli arrotondati su tutti i lati, anche quando il testo va a capo.",
      "enable_highlight_border": "Abilita bordo evidenziazione",
      "enable_highlight_border_desc": "Aggiungi un bordo attorno alle evidenziazioni. Il bordo corrisponder\xE0 al colore del testo o dell'evidenziazione.",
      "border_style": "Stile bordo",
      "border_style_desc": "Scegli quali lati applicare il bordo",
      "border_opacity": "Opacit\xE0 bordo",
      "border_opacity_desc": "Imposta l'opacit\xE0 del bordo (0-100%)",
      "border_thickness": "Spessore bordo (px)",
      "border_thickness_desc": "Imposta lo spessore del bordo da 0-5 pixel (es. 1, 2.5, 5)",
      "highlight_preview": "Anteprima evidenziazione",
      "highlight_preview_text": "Ecco come apparir\xE0 la tua evidenziazione!",
      // Color Swatches
      "color_swatches_header": "Campioni colore",
      "color_picker_layout": "Layout selettore colore",
      "color_picker_layout_desc": "Scegli quali tipi di colore mostrare quando si selezionano colori per il testo",
      "opt_both_text_left": "Entrambi: Testo sinistra, Evidenziazione destra",
      "opt_both_bg_left": "Entrambi: Evidenziazione sinistra, Testo destra",
      "opt_text_only": "Solo colore testo",
      "opt_background_only": "Solo colore evidenziazione",
      "replace_default_swatches": "Sostituisci campioni predefiniti",
      "replace_default_swatches_desc": "Se attivo, nel selettore colori appariranno solo i tuoi colori personalizzati. Nessuno predefinito!",
      "enable_custom_swatches": "Abilita campioni personalizzati",
      "enable_custom_swatches_desc": "Se attivo, i tuoi campioni personalizzati appariranno nel selettore colori.",
      "use_swatch_names": "Usa nomi campioni per colorare il testo",
      "use_swatch_names_desc": "Mostra un menu a tendina con i nomi dei campioni accanto ai campi di inserimento parole/pattern",
      "default_colors_header": "Colori predefiniti",
      "custom_swatches_header": "Campioni personalizzati",
      "btn_add_color": "+ Aggiungi colore",
      "no_custom_swatches_yet": 'Ancora nessun campione personalizzato. Clicca "+ Aggiungi colore" per crearne uno.',
      "label_built_in": "(integrato)",
      // Color Picker
      "pick_color_header": "Seleziona colore",
      "selected_text_preview": "Testo selezionato",
      "text_color_title": "Colore testo",
      "select_swatch": "Seleziona campione\u2026",
      "highlight_color_title": "Colore evidenziazione",
      "select_highlight_swatch": "Seleziona campione evidenziazione\u2026",
      // Always Colored Texts
      "always_colored_texts_header": "Testi sempre colorati",
      "always_colored_texts_desc": "Qui gestisci le tue parole/pattern e i loro colori.",
      "search_colored_words_placeholder": "Cerca parole/pattern colorati\u2026",
      "sort_label_last-added": "Ordina: ultimi aggiunti",
      "sort_label_a-z": "Ordina: A-Z",
      "sort_label_reverse-a-z": "Ordina: Z-A",
      "sort_label_style-order": "Ordina: ordine stile",
      "sort_label_color": "Ordina: colore",
      "btn_add_new_word": "+ Aggiungi nuova parola/pattern colorato",
      "style_type_text": "colore",
      "style_type_highlight": "evidenziazione",
      "style_type_both": "entrambi",
      "word_pattern_placeholder_long": "pattern, parola o parole separate da virgola (es. hello, world, foo)",
      "word_pattern_placeholder_short": "Parola chiave o pattern, o parole separate da virgola",
      "use_regex": "Usa regex",
      "flags_placeholder": "flag",
      "text_or_regex_placeholder": "input di testo/regex",
      "duplicate_entry": "voce duplicata",
      "open_in_regex_tester": "Apri in Tester Regex",
      "no_rules_configured": "Nessuna regola configurata.",
      "no_rules_found": "Nessuna regola trovata.",
      // Presets
      "btn_presets": "Preset",
      "preset_all_headings": "Tutti i titoli (H1-H6)",
      "preset_bullet_points": "Punti elenco",
      "preset_numbered_lists": "Elenchi numerati",
      "preset_task_checked": "Elenco attivit\xE0 (selezionato)",
      "preset_task_unchecked": "Elenco attivit\xE0 (non selezionato)",
      "preset_dates_yyyy_mm_dd": "Date (AAAA-MM-GG)",
      "preset_times_am_pm": "Orari (AM/PM)",
      "preset_dates_yyyy_mmm_dd": "Date (AAAA-MMM-GG)",
      "preset_relative_dates": "Date relative",
      "preset_basic_urls": "URL di base",
      "preset_markdown_links": "Link Markdown",
      "preset_domain_names": "Nomi di dominio",
      "preset_email_addresses": "Indirizzi email",
      "preset_at_username": "@nome utente",
      "preset_currency": "Valuta",
      "preset_measurements": "Misurazioni",
      "preset_phone_numbers": "Numeri di telefono",
      "preset_all_texts": "Tutti i testi",
      "preset_codeblocks": "Blocchi di codice",
      "preset_inline_comments": "Commenti (%%\u2026%%)",
      "preset_parentheses": "Parentesi ()",
      "preset_square_brackets": "Parentesi quadre []",
      "preset_curly_braces": "Parentesi graffe {}",
      "preset_angle_brackets": "Parentesi angolari <>",
      "preset_colons": "Due punti :",
      "preset_double_quotes": "Virgolette",
      "preset_single_quotes": "Virgolette singole",
      "preset_single_quotes_word_bounded": "Virgolette singole (delimitate da parola)",
      "preset_group_markdown_formatting": "Formattazione Markdown",
      "preset_group_other_patterns": "Altri Pattern",
      "preset_group_brackets": "Parentesi",
      // Blacklist Settings
      "blacklist_words_header": "Parole in blacklist",
      "blacklist_words_desc": "Parole chiave o pattern qui non saranno mai colorati, nemmeno per corrispondenze parziali.",
      "search_blacklist_placeholder": "Cerca parole o pattern in blacklist\u2026",
      "blacklist_sort_label_last-added": "Ordina: ultimi aggiunti",
      "blacklist_sort_label_a-z": "Ordina: A-Z",
      "blacklist_sort_label_reverse-a-z": "Ordina: Z-A",
      "btn_add_blacklist": "+ Aggiungi parola o pattern in blacklist",
      "btn_add_to_blacklist": "+ Aggiungi a lista nera",
      "btn_add_blacklist_word": "+ Aggiungi parola lista nera",
      "btn_add_blacklist_regex": "+ Aggiungi regex lista nera",
      // File & Folder Rules
      "file_folder_rules_header": "Regole colorazione file e cartelle",
      "file_folder_rules_desc": "Gestisci la colorazione usando nomi, percorsi esatti o pattern regex. Lascia una voce di esclusione vuota per disabilitare la colorazione in tutta la vault.",
      "search_file_folder_rules_placeholder": "Cerca regole file/cartella\u2026",
      "path_sort_label_last-added": "Ordina: ultimi aggiunti",
      "path_sort_label_a-z": "Ordina: A-Z",
      "path_sort_label_reverse-a-z": "Ordina: Z-A",
      "path_sort_label_mode": "Ordina: modalit\xE0",
      "path_sort_label_type": "Ordina: tipo",
      "btn_add_file_folder_rule": "+ Aggiungi regola file/cartella",
      "disabled_files_header": "File con colorazione disabilitata:",
      // Advanced Settings - Inclusion Exclusion Labels
      "path_rule_mode_include": "includi",
      "path_rule_mode_exclude": "escludi",
      "text_rule_mode_include": "colora solo in (whitelist)",
      "text_rule_mode_exclude": "non colorare in (blacklist)",
      "mode_only_colors_in": "colora solo in",
      "mode_does_not_color_in": "non colora in",
      "label_text_include": "Whitelist",
      "label_text_exclude": "Blacklist",
      "enter_path_or_pattern": "Inserisci percorso o modello",
      "label_regex": "Espressione regolare",
      // Advanced Rules
      "advanced_rules_header": "Regole avanzate",
      "advanced_rules_modal_header": "Regole avanzate",
      "advanced_rules_manage_button": "gestisci regole avanzate",
      "edit_rule_header": "Modifica Regola",
      "add_rule_header": "Aggiungi Nuova Regola",
      "btn_add_rule": "+ Aggiungi regola",
      "btn_save_rule": "Salva regola",
      "btn_add_words": "+ Aggiungi parole",
      "btn_add_regex": "+ Aggiungi Regex",
      "btn_save_regex": "Salva Espressione Regolare",
      // Regex Tester
      "regex_tester_header": "Tester di espressioni regolari",
      "regex_tester_blacklist": "Tester Regex - lista nera",
      "regex_expression_placeholder": "Inserisci la tua espressione regex qui",
      "regex_subject_placeholder": "digita il testo da testare qui...",
      "regex_name_placeholder": "dai un nome alla tua regex",
      "matches": "corrispondenze",
      "matches_found": "corrispondenze trovate",
      // Regex Flags
      "flag_g": "flag globale: trova tutte le corrispondenze",
      "flag_i": "flag case-insensitive",
      "flag_m": "flag multilinea: ^ e $ corrispondono ai limiti di riga",
      "flag_s": "flag dotAll: . corrisponde ai caratteri di nuova riga",
      "flag_u": "flag unicode: tratta come punti di codice unicode",
      "flag_y": "flag sticky: corrisponde dalla posizione lastIndex",
      // Data Export/Import
      "data_export_import_header": "Esportazione/Importazione dati",
      "export_plugin_data": "Esporta dati plugin",
      "export_plugin_data_desc": "Esporta impostazioni, parole e regole in un file JSON.",
      "btn_export": "Esporta",
      "import_plugin_data": "Importa dati plugin",
      "import_plugin_data_desc": "Importa impostazioni da un file JSON",
      "btn_import": "Importa"
    };
  }
});

// src/i18n/bn.js
var require_bn = __commonJS({
  "src/i18n/bn.js"(exports2, module2) {
    module2.exports = {
      // Plugin Metadata & Basic Labels
      "__name": "\u09AC\u09BE\u0982\u09B2\u09BE",
      "settings_title": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u09C7\u099F\u09BF\u0982\u09B8",
      "header_plugin_name": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      "ribbon_title": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      // Language Settings
      "language_label": "\u09AD\u09BE\u09B7\u09BE",
      "language_desc": "\u098F\u0987 \u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AD\u09BE\u09B7\u09BE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8",
      "language_en": "\u0987\u0982\u09B0\u09C7\u099C\u09BF",
      "language_es": "\u09B8\u09CD\u09AA\u09CD\u09AF\u09BE\u09A8\u09BF\u09B6",
      "language_fr": "\u09AB\u09CD\u09B0\u09C7\u099E\u09CD\u099A",
      "language_eu": "\u09AC\u09BE\u09B8\u09CD\u0995",
      "language_ru": "\u09B0\u09BE\u09B6\u09BF\u09AF\u09BC\u09BE\u09A8",
      "language_auto": "\u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u09A1\u09BF\u09AB\u09B2\u09CD\u099F",
      // Release Notes
      "latest_release_notes_label": "\u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09B0\u09BF\u09B2\u09BF\u099C \u09A8\u09CB\u099F\u09B8",
      "latest_release_notes_desc": "\u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8\u09C7\u09B0 \u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09B0\u09BF\u09B2\u09BF\u099C \u09A8\u09CB\u099F\u09B8 \u09A6\u09C7\u0996\u09C1\u09A8",
      "open_changelog_button": "\u099A\u09C7\u099E\u09CD\u099C\u09B2\u0997 \u0996\u09C1\u09B2\u09C1\u09A8",
      "command_show_release_notes": "\u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09B0\u09BF\u09B2\u09BF\u099C \u09A8\u09CB\u099F\u09B8 \u09A6\u09C7\u0996\u09BE\u09A8",
      "changelog_view_on_github": "GitHub \u098F \u09A6\u09C7\u0996\u09C1\u09A8",
      "changelog_loading": "\u09B0\u09BF\u09B2\u09BF\u099C \u09B2\u09CB\u09A1 \u09B9\u099A\u09CD\u099B\u09C7\u2026",
      "changelog_no_info": "\u0995\u09CB\u09A8\u09CB \u09B0\u09BF\u09B2\u09BF\u099C \u09A4\u09A5\u09CD\u09AF \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964",
      "changelog_release": "\u09B0\u09BF\u09B2\u09BF\u099C",
      "changelog_no_notes": "\u0995\u09CB\u09A8\u09CB \u09A8\u09CB\u099F \u09A8\u09C7\u0987",
      "changelog_failed_to_load": "\u09B0\u09BF\u09B2\u09BF\u099C \u09A8\u09CB\u099F\u09B8 \u09B2\u09CB\u09A1 \u0995\u09B0\u09A4\u09C7 \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5\u0964",
      // UI Elements & Menus
      "file_menu_enable": "\u098F\u0987 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "file_menu_disable": "\u098F\u0987 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "menu_color_once": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      "menu_highlight_once": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09B0\u09C1\u09A8",
      "menu_always_color_text": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      "menu_remove_always_color_text": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u09B0\u09BE\u09A8",
      "menu_blacklist_word": "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09A5\u09C7\u0995\u09C7 \u09B6\u09AC\u09CD\u09A6 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09C1\u09A8",
      "show_toggle_statusbar": "\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u099F\u09BE\u09B8 \u09AC\u09BE\u09B0\u09C7 \u099F\u0997\u09B2 \u09A6\u09C7\u0996\u09BE\u09A8",
      "show_toggle_ribbon": "\u09B0\u09BF\u09AC\u09A8\u09C7 \u099F\u0997\u09B2 \u0986\u0987\u0995\u09A8 \u09A6\u09C7\u0996\u09BE\u09A8",
      "show_toggle_command": "\u0995\u09AE\u09BE\u09A8\u09CD\u09A1\u09C7 \u099F\u0997\u09B2 \u09A6\u09C7\u0996\u09BE\u09A8",
      "show_blacklist_menu": "\u09B0\u09BE\u0987\u099F-\u0995\u09CD\u09B2\u09BF\u0995 \u09AE\u09C7\u09A8\u09C1\u09A4\u09C7 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u09B6\u09AC\u09CD\u09A6\u0997\u09C1\u09B2\u09BF \u09A6\u09C7\u0996\u09BE\u09A8",
      "show_blacklist_menu_desc": "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09A5\u09C7\u0995\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u099F\u09BF \u09B0\u09BE\u0987\u099F-\u0995\u09CD\u09B2\u09BF\u0995 \u09AE\u09C7\u09A8\u09C1 \u0986\u0987\u099F\u09C7\u09AE \u09AF\u09CB\u0997 \u0995\u09B0\u09C7\u0964",
      "tooltip_enable_for_file": "\u098F\u0987 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "tooltip_delete_all_words": "\u09B8\u0982\u099C\u09CD\u099E\u09BE\u09AF\u09BC\u09BF\u09A4 \u09B8\u09AE\u09B8\u09CD\u09A4 \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09C1\u099B\u09C1\u09A8",
      "tooltip_delete_all_blacklist": "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09BE \u09B8\u09AE\u09B8\u09CD\u09A4 \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09C1\u099B\u09C1\u09A8",
      "tooltip_use_regex": "\u09B0\u09C7\u099C\u09C7\u0995\u09CD\u09B8 \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09B9\u09BF\u09B8\u09BE\u09AC\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8",
      "drag_to_reorder": "\u09AA\u09C1\u09A8\u09B0\u09CD\u09AC\u09BF\u09A8\u09CD\u09AF\u09BE\u09B8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u099F\u09C7\u09A8\u09C7 \u0986\u09A8\u09C1\u09A8",
      "reset_text_color": "\u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999 \u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8",
      "reset_highlight": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8",
      // Commands
      "command_color_selected": "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      "command_toggle_current": "\u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B8\u0995\u09CD\u09B7\u09AE/\u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "command_toggle_global": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u0995\u09CD\u09B7\u09AE/\u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "command_manage_advanced_rules": "\u0989\u09A8\u09CD\u09A8\u09A4 \u09A8\u09BF\u09AF\u09BC\u09AE \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09C1\u09A8",
      "command_open_regex_tester": "Regex \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8 (Regex \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u0995 \u0996\u09C1\u09B2\u09C1\u09A8)",
      "command_open_blacklist_regex_tester": "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 Regex \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "command_manage_colored_texts": "\u09B0\u0999\u09BE\u09AF\u09BC\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F\u0997\u09C1\u09B2\u09BF \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09C1\u09A8",
      "command_toggle_hide_text_colors": "\u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999 \u09B2\u09C1\u0995\u09BE\u09A8/\u09A6\u09C7\u0996\u09BE\u09A8",
      "command_toggle_hide_highlights": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B2\u09C1\u0995\u09BE\u09A8/\u09A6\u09C7\u0996\u09BE\u09A8",
      // Notifications
      "notice_enabled": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC",
      "notice_disabled": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC",
      "notice_blacklisted_cannot_color": '"{word}" \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09B0\u09AF\u09BC\u09C7\u099B\u09C7 \u098F\u09AC\u0982 \u09B0\u0999 \u0995\u09B0\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\u0964',
      "notice_removed_always_color": '"{word}" \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09B0\u09CD\u09AC\u09A6\u09BE \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B8\u09B0\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964',
      "notice_added_to_blacklist": '"{word}" \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964',
      "notice_already_blacklisted": '"{word}" \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7\u0987 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09B0\u09AF\u09BC\u09C7\u099B\u09C7\u0964',
      "notice_select_text_first": "\u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u09AA\u09CD\u09B0\u09A5\u09AE\u09C7 \u0995\u09BF\u099B\u09C1 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964",
      "notice_no_active_file": "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u099F\u0997\u09B2 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09CB\u09A8\u09CB \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BE\u0987\u09B2 \u09A8\u09C7\u0987\u0964",
      "notice_coloring_enabled_for_path": "{path} \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_coloring_disabled_for_path": "{path} \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_global_enabled": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u0995\u09CD\u09B7\u09AE",
      "notice_global_disabled": "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u0985\u0995\u09CD\u09B7\u09AE",
      "notice_unable_open_changelog": "\u099A\u09C7\u099E\u09CD\u099C\u09B2\u0997 \u0996\u09C1\u09B2\u09A4\u09C7 \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964",
      "notice_pattern_blocked": "\u09AE\u09C7\u09AE\u09CB\u09B0\u09BF \u09B8\u09C7\u09AB\u099F\u09BF\u09B0 \u099C\u09A8\u09CD\u09AF \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AC\u09CD\u09B2\u0995 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7:",
      "notice_pattern_too_complex": "\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0996\u09C1\u09AC \u099C\u099F\u09BF\u09B2:",
      "notice_invalid_hex_format": "\u0985\u09AC\u09C8\u09A7 \u09B9\u09C7\u0995\u09CD\u09B8 \u09B0\u0999 \u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u099F\u0964 #RRGGBB \u09AC\u09BE #RGB \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8\u0964",
      "notice_error_saving_changes": "\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8\u0997\u09C1\u09B2\u09BF \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0995\u09B0\u09A4\u09C7 \u09A4\u09CD\u09B0\u09C1\u099F\u09BF\u0964 \u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u0986\u09AC\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964",
      "notice_invalid_color_format": "\u0985\u09AC\u09C8\u09A7 \u09B0\u0999 \u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u099F\u0964",
      "notice_exported": "\u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7: {fname}",
      "notice_export_failed": "\u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5",
      "notice_import_completed": "\u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8",
      "notice_import_failed": "\u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5",
      "notice_invalid_regex": "\u0985\u09AC\u09C8\u09A7 \u09A8\u09BF\u09AF\u09BC\u09AE\u09BF\u09A4 \u0985\u09AD\u09BF\u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF",
      "notice_empty_pattern": "\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0996\u09BE\u09B2\u09BF",
      "notice_added_regex": "\u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_rule_updated": "\u09A8\u09BF\u09AF\u09BC\u09AE \u0986\u09AA\u09A1\u09C7\u099F \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_regex_updated": "\u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u0986\u09AA\u09A1\u09C7\u099F \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_entry_updated": "\u09AA\u09CD\u09B0\u09AC\u09BF\u09B7\u09CD\u099F\u09BF \u0986\u09AA\u09A1\u09C7\u099F \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_entry_duplicated": "\u09AA\u09CD\u09B0\u09AC\u09BF\u09B7\u09CD\u099F\u09BF \u09A1\u09C1\u09AA\u09CD\u09B2\u09BF\u0995\u09C7\u099F \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_error_opening_regex_tester": "\u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u0995 \u0996\u09C1\u09B2\u09A4\u09C7 \u09A4\u09CD\u09B0\u09C1\u099F\u09BF",
      "notice_error_opening_blacklist_regex_tester": "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u0995 \u0996\u09C1\u09B2\u09A4\u09C7 \u09A4\u09CD\u09B0\u09C1\u099F\u09BF",
      "notice_error_opening_advanced_rules": "\u0989\u09A8\u09CD\u09A8\u09A4 \u09A8\u09BF\u09AF\u09BC\u09AE \u09AE\u09CB\u09A1\u09BE\u09B2 \u0996\u09C1\u09B2\u09A4\u09C7 \u09A4\u09CD\u09B0\u09C1\u099F\u09BF",
      "notice_text_color_reset": "\u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999 \u09B0\u09BF\u09B8\u09C7\u099F \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_highlight_reset": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B0\u09BF\u09B8\u09C7\u099F \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_text_colors_hidden": "\u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999 \u09B2\u09C1\u0995\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_text_colors_visible": "\u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999 \u09A6\u09C3\u09B6\u09CD\u09AF\u09AE\u09BE\u09A8",
      "notice_highlights_hidden": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B2\u09C1\u0995\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      "notice_highlights_visible": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09A6\u09C3\u09B6\u09CD\u09AF\u09AE\u09BE\u09A8",
      "notice_regex_support_disabled": "\u09B0\u09C7\u099C\u09C7\u0995\u09CD\u09B8 \u09B8\u0982\u0998\u09BE\u09A4 \u09B8\u09A8\u09CD\u09AC\u09AC\u09B0\u09A8 \u099C\u09A8\u0995 \u0985\u0995\u09CD\u09B7\u09AE\u0964 \u09B0\u09C7\u099C\u09C7\u0995\u09CD\u09B8 \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09A8 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09AC\u09BE\u09B0 \u0985\u09A8\u09C1\u09AE\u09A4\u09BF \u09A6\u09BF\u09AF\u09BC\u09C7 \u098F\u099F\u09BF \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8\u0964",
      "notice_no_active_file_to_disable": "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09CB\u09A8\u09CB \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BE\u0987\u09B2 \u09A8\u09C7\u0987\u0964",
      "notice_already_disabled_for_path": "{path} \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7\u0987 \u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC",
      "notice_filter_disabled": "\u09AB\u09BF\u09B2\u09CD\u099F\u09BE\u09B0 \u0985\u0995\u09CD\u09B7\u09AE",
      // Confirmation Dialogs
      "confirm_delete_all_title": "\u09B8\u09AE\u09B8\u09CD\u09A4 \u09B6\u09AC\u09CD\u09A6 \u09AE\u09C1\u099B\u09C1\u09A8",
      "confirm_delete_all_desc": "\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u09AF\u09C7 \u0986\u09AA\u09A8\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09B8\u09AE\u09B8\u09CD\u09A4 \u09B0\u0999 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09C1\u099B\u09A4\u09C7 \u099A\u09BE\u09A8? \u0986\u09AA\u09A8\u09BF \u098F\u099F\u09BF \u09AA\u09C2\u09B0\u09CD\u09AC\u09BE\u09AC\u09B8\u09CD\u09A5\u09BE\u09AF\u09BC \u09AB\u09BF\u09B0\u09BF\u09AF\u09BC\u09C7 \u0986\u09A8\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8 \u09A8\u09BE!",
      "confirm_delete_all_blacklist_title": "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09BE \u09B8\u09AE\u09B8\u09CD\u09A4 \u09B6\u09AC\u09CD\u09A6 \u09AE\u09C1\u099B\u09C1\u09A8",
      "confirm_delete_all_blacklist_desc": "\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u09AF\u09C7 \u0986\u09AA\u09A8\u09BF \u09B8\u09AE\u09B8\u09CD\u09A4 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF \u09AE\u09C1\u099B\u09A4\u09C7 \u099A\u09BE\u09A8? \u0986\u09AA\u09A8\u09BF \u098F\u099F\u09BF \u09AA\u09C2\u09B0\u09CD\u09AC\u09BE\u09AC\u09B8\u09CD\u09A5\u09BE\u09AF\u09BC \u09AB\u09BF\u09B0\u09BF\u09AF\u09BC\u09C7 \u0986\u09A8\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8 \u09A8\u09BE!",
      "restart_required_title": "\u09B0\u09BF\u09B8\u09CD\u099F\u09BE\u09B0\u09CD\u099F \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8",
      "restart_required_desc": "\u0995\u09AE\u09BE\u09A8\u09CD\u09A1 \u09AA\u09CD\u09AF\u09BE\u09B2\u09C7\u099F \u099F\u0997\u09B2 \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09A4\u09C7 \u09AA\u09CD\u09AF\u09BE\u09B2\u09C7\u099F \u09A5\u09C7\u0995\u09C7 \u0995\u09AE\u09BE\u09A8\u09CD\u09A1\u0997\u09C1\u09B2\u09BF \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3\u09AD\u09BE\u09AC\u09C7 \u09B8\u09B0\u09BE\u09A8\u09CB\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09AC\u09B8\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE\u09A8 \u09B0\u09BF\u09B8\u09CD\u099F\u09BE\u09B0\u09CD\u099F \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964 \u098F\u0996\u09A8\u0987 \u09B0\u09BF\u09B8\u09CD\u099F\u09BE\u09B0\u09CD\u099F \u0995\u09B0\u09AC\u09C7\u09A8?",
      // Basic Settings
      "enable_document_color": "\u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F \u09B0\u0999 \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "color_in_reading_mode": "\u09B0\u09BF\u09A1\u09BF\u0982 \u09AE\u09CB\u09A1\u09C7 \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      "force_full_render_reading": "\u09B0\u09BF\u09A1\u09BF\u0982 \u09AE\u09CB\u09A1\u09C7 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B0\u09C7\u09A8\u09CD\u09A1\u09BE\u09B0 \u099C\u09CB\u09B0 \u0995\u09B0\u09C1\u09A8",
      "force_full_render_reading_desc": "\u099A\u09BE\u09B2\u09C1 \u09A5\u09BE\u0995\u09B2\u09C7, \u09B0\u09BF\u09A1\u09BF\u0982-\u09AE\u09CB\u09A1 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F \u098F\u0995 \u09AA\u09BE\u09B8\u09C7 \u09B0\u0999 \u0995\u09B0\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09AC\u09C7\u0964 \u09AC\u09A1\u09BC \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7 \u09AA\u09BE\u09B0\u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8 \u0987\u09B8\u09CD\u09AF\u09C1 \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964 \u09B8\u09A4\u09B0\u09CD\u0995\u09A4\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8!",
      "disable_coloring_current_file": "\u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "disable_coloring_current_file_desc": "\u09AB\u09BE\u0987\u09B2 \u0993 \u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B0\u09C1\u09B2\u09B8 \u098F\u09B0 \u0985\u09A7\u09C0\u09A8\u09C7 \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u099F\u09BF \u098F\u0995\u09CD\u09B8\u0995\u09CD\u09B2\u09C1\u09A1 \u09B0\u09C1\u09B2 \u09AF\u09CB\u0997 \u0995\u09B0\u09C7\u0964",
      "btn_disable_for_this_file": "\u098F\u0987 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      // Coloring Settings
      "coloring_settings_header": "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B8\u09C7\u099F\u09BF\u0982\u09B8",
      "regex_support": "\u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u09B8\u09BE\u09AA\u09CB\u09B0\u09CD\u099F",
      "regex_support_desc": "\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8\u0997\u09C1\u09B2\u09BF\u0995\u09C7 \u09B0\u09C7\u0997\u09C1\u09B2\u09BE\u09B0 \u098F\u0995\u09CD\u09B8\u09AA\u09CD\u09B0\u09C7\u09B6\u09A8 \u09B9\u09A4\u09C7 \u0985\u09A8\u09C1\u09AE\u09A4\u09BF \u09A6\u09BF\u09A8\u0964 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09AC\u09C8\u09A7 \u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u0989\u09AA\u09C7\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u0964",
      "disable_regex_safety": "\u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "disable_regex_safety_desc": "\u099C\u099F\u09BF\u09B2 \u09AC\u09BE \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF \u09AC\u09BF\u09AA\u099C\u09CD\u099C\u09A8\u0995 \u098F\u0995\u09CD\u09B8\u09AA\u09CD\u09B0\u09C7\u09B6\u09A8 \u0985\u09A8\u09C1\u09AE\u09A4\u09BF \u09A6\u09BF\u09A8\u0964 \u09AA\u09BE\u09B0\u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8 \u0987\u09B8\u09CD\u09AF\u09C1 \u09AC\u09BE \u09AB\u09CD\u09B0\u09BF\u099C \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
      "case_sensitive": "\u0995\u09C7\u09B8 \u09B8\u09C7\u09A8\u09CD\u09B8\u09BF\u099F\u09BF\u09AD",
      "case_sensitive_desc": '\u098F\u099F\u09BF \u099A\u09BE\u09B2\u09C1 \u09A5\u09BE\u0995\u09B2\u09C7, "word" \u098F\u09AC\u0982 "Word" \u0986\u09B2\u09BE\u09A6\u09BE \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09AC\u09BF\u09AC\u09C7\u099A\u09BF\u09A4 \u09B9\u09AC\u09C7\u0964 \u09AC\u09A8\u09CD\u09A7 \u09A5\u09BE\u0995\u09B2\u09C7, \u09A4\u09BE\u09B0\u09BE \u098F\u0995\u0987\u09AD\u09BE\u09AC\u09C7 \u09B0\u0999 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964',
      "partial_match": "\u0986\u0982\u09B6\u09BF\u0995 \u09AE\u09CD\u09AF\u09BE\u099A",
      "partial_match_desc": '\u09B8\u0995\u09CD\u09B7\u09AE \u09A5\u09BE\u0995\u09B2\u09C7, \u09AA\u09C1\u09B0\u09CB \u09B6\u09AC\u09CD\u09A6\u099F\u09BF \u09B0\u0999 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7 \u09AF\u09A6\u09BF \u098F\u09B0 \u09AD\u09BF\u09A4\u09B0\u09C7 \u0995\u09CB\u09A8\u09CB \u09B0\u0999 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC (\u09AF\u09C7\u09AE\u09A8, "as" "Jasper" \u0995\u09C7 \u09B0\u0999 \u0995\u09B0\u09AC\u09C7)\u0964',
      // One-Time Actions
      "one_time_actions_header": "\u098F\u0995-\u09AC\u09BE\u09B0\u09C7\u09B0 \u0995\u09BE\u099C\u0997\u09C1\u09B2\u09BF",
      "setting_color_once": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      "setting_color_once_desc": "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF HTML \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u09A8\u09CD\u09A8\u09BF\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7\u0964 \u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8 \u09AC\u09A8\u09CD\u09A7 \u09A5\u09BE\u0995\u09B2\u09C7\u0993 \u098F\u099F\u09BF \u09B8\u09CD\u09A5\u09BE\u09AF\u09BC\u09C0 \u09A5\u09BE\u0995\u09C7\u0964",
      "setting_highlight_once": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09B0\u09C1\u09A8",
      "setting_highlight_once_desc": "\u09AC\u09CD\u09AF\u09BE\u0995\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1 \u09B8\u09CD\u099F\u09BE\u0987\u09B2\u09BF\u0982 \u09B8\u09B9 HTML \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u09A8\u09CD\u09A8\u09BF\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7\u0964 \u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8 \u09AC\u09A8\u09CD\u09A7 \u09A5\u09BE\u0995\u09B2\u09C7\u0993 \u098F\u099F\u09BF \u09B8\u09CD\u09A5\u09BE\u09AF\u09BC\u09C0 \u09A5\u09BE\u0995\u09C7\u0964",
      "highlight_once_preview": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989",
      "highlight_once_preview_text": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09C7\u09AE\u09A8 \u09A6\u09C7\u0996\u09BE\u09AC\u09C7 \u09A4\u09BE \u09A6\u09C7\u0996\u09C1\u09A8!",
      // Highlight Once Settings
      "highlight_once_opacity": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE",
      "highlight_once_border_radius": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C7\u09A1\u09BF\u09AF\u09BC\u09BE\u09B8 (px)",
      "reset_to_8": "\u09EE \u098F \u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8",
      "highlight_horizontal_padding": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B9\u09B0\u09BE\u0987\u099C\u09A8\u099F\u09BE\u09B2 \u09AA\u09CD\u09AF\u09BE\u09A1\u09BF\u0982 (px)",
      "reset_to_4": "\u09EA \u098F \u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8",
      "enable_border_highlight_once": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "enable_border_highlight_once_desc": "\u0986\u09AA\u09A8\u09BE\u09B0 \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7 \u098F\u0995\u099F\u09BF \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE HTML/CSS \u09A6\u09C0\u09B0\u09CD\u0998 \u09B9\u09AC\u09C7\u0964",
      "highlight_once_border_style": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u09CD\u099F\u09BE\u0987\u09B2",
      "opt_border_full": "\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 (\u09B8\u09AC \u09A6\u09BF\u0995)",
      "opt_border_top_bottom": "\u0989\u09AA\u09B0 \u098F\u09AC\u0982 \u09A8\u09BF\u099A\u09C7\u09B0 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_left_right": "\u09AC\u09BE\u09AE \u098F\u09AC\u0982 \u09A1\u09BE\u09A8 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_top_right": "\u0989\u09AA\u09B0 \u098F\u09AC\u0982 \u09A1\u09BE\u09A8 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_top_left": "\u0989\u09AA\u09B0 \u098F\u09AC\u0982 \u09AC\u09BE\u09AE \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_bottom_right": "\u09A8\u09BF\u099A \u098F\u09AC\u0982 \u09A1\u09BE\u09A8 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_bottom_left": "\u09A8\u09BF\u099A \u098F\u09AC\u0982 \u09AC\u09BE\u09AE \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_top": "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u0989\u09AA\u09B0\u09C7\u09B0 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_bottom": "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09A8\u09BF\u099A\u09C7\u09B0 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_left": "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09AC\u09BE\u09AE \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "opt_border_right": "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09A1\u09BE\u09A8 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      "highlight_once_border_opacity": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE",
      "highlight_once_border_thickness": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A5\u09BF\u0995\u09A8\u09C7\u09B8 (px)",
      "reset_to_1": "\u09E7 \u098F \u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8",
      "use_global_highlight_style": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0997\u09CD\u09B2\u09CB\u09AC\u09BE\u09B2 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8",
      "use_global_highlight_style_desc": "\u0986\u09AA\u09A8\u09BE\u09B0 \u0997\u09CD\u09B2\u09CB\u09AC\u09BE\u09B2 \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7\u0964 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE HTML/CSS \u09A6\u09C0\u09B0\u09CD\u0998 \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
      "style_highlight_once": "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u0995\u09B0\u09C1\u09A8",
      "style_highlight_once_desc": "\u0986\u09AA\u09A8\u09BE\u09B0 \u0995\u09BE\u09B8\u09CD\u099F\u09AE \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7\u0964 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE HTML/CSS \u09A6\u09C0\u09B0\u09CD\u0998 \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
      // Global Highlight Appearance
      "global_highlight_appearance_header": "\u0997\u09CD\u09B2\u09CB\u09AC\u09BE\u09B2 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0985\u09CD\u09AF\u09BE\u09AA\u09BF\u09AF\u09BC\u09BE\u09B0\u09C7\u09A8\u09CD\u09B8",
      "highlight_opacity": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE",
      "highlight_opacity_desc": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (0-100%)",
      "highlight_border_radius": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C7\u09A1\u09BF\u09AF\u09BC\u09BE\u09B8 (px)",
      "highlight_border_radius_desc": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u0997\u09CB\u09B2\u09BE\u0995\u09BE\u09B0 \u0995\u09CB\u09A3\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C7\u09A1\u09BF\u09AF\u09BC\u09BE\u09B8 \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (px \u098F)",
      "highlight_horizontal_padding_desc": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09B0\u09BE \u099F\u09C7\u0995\u09CD\u09B8\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09BE\u09AE \u098F\u09AC\u0982 \u09A1\u09BE\u09A8 \u09AA\u09CD\u09AF\u09BE\u09A1\u09BF\u0982 \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (px \u098F)",
      "rounded_corners_wrapping": "\u09B2\u09BE\u0987\u09A8 \u09B0\u200D\u09CD\u09AF\u09BE\u09AA\u09BF\u0982\u09AF\u09BC\u09C7 \u0997\u09CB\u09B2\u09BE\u0995\u09BE\u09B0 \u0995\u09CB\u09A3",
      "rounded_corners_wrapping_desc": "\u09B8\u0995\u09CD\u09B7\u09AE \u09B9\u09B2\u09C7, \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u0997\u09C1\u09B2\u09BF\u09B0 \u09B8\u09AC \u09A6\u09BF\u0995\u09C7 \u0997\u09CB\u09B2\u09BE\u0995\u09BE\u09B0 \u0995\u09CB\u09A3 \u09A5\u09BE\u0995\u09AC\u09C7, \u098F\u09AE\u09A8\u0995\u09BF \u09AF\u0996\u09A8 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A8\u09A4\u09C1\u09A8 \u09B2\u09BE\u0987\u09A8\u09C7 \u09B0\u200D\u09CD\u09AF\u09BE\u09AA \u09B9\u09AF\u09BC\u0964",
      "enable_highlight_border": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      "enable_highlight_border_desc": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u099A\u09BE\u09B0\u09AA\u09BE\u09B6\u09C7 \u098F\u0995\u099F\u09BF \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0\u099F\u09BF \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09AC\u09BE \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B0\u0999\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AE\u09BF\u09B2\u09AC\u09C7\u0964",
      "border_style": "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u09CD\u099F\u09BE\u0987\u09B2",
      "border_style_desc": "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u0995\u09CB\u09A8 \u09A6\u09BF\u0995\u0997\u09C1\u09B2\u09BF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8",
      "border_opacity": "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE",
      "border_opacity_desc": "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0\u09C7\u09B0 \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (0-100%)",
      "border_thickness": "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A5\u09BF\u0995\u09A8\u09C7\u09B8 (px)",
      "border_thickness_desc": "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A5\u09BF\u0995\u09A8\u09C7\u09B8 0-5 \u09AA\u09BF\u0995\u09CD\u09B8\u09C7\u09B2 \u09A5\u09C7\u0995\u09C7 \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (\u09AF\u09C7\u09AE\u09A8 1, 2.5, 5)",
      "highlight_preview": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989",
      "highlight_preview_text": "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09C7\u09AE\u09A8 \u09A6\u09C7\u0996\u09BE\u09AC\u09C7 \u09A4\u09BE \u09A6\u09C7\u0996\u09C1\u09A8!",
      // Color Swatches
      "color_swatches_header": "\u09B0\u0999 \u09B8\u09CB\u09AF\u09BC\u09BE\u099A\u0997\u09C1\u09B2\u09BF",
      "color_picker_layout": "\u09B0\u0999 \u09AA\u09BF\u0995\u09BE\u09B0 \u09B2\u09C7\u0986\u0989\u099F",
      "color_picker_layout_desc": "\u099F\u09C7\u0995\u09CD\u09B8\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999 \u09AA\u09BF\u0995 \u0995\u09B0\u09BE\u09B0 \u09B8\u09AE\u09AF\u09BC \u0995\u09CB\u09A8 \u09B0\u0999 \u099F\u09BE\u0987\u09AA \u09A6\u09C7\u0996\u09BE\u09A4\u09C7 \u09B9\u09AC\u09C7 \u09A4\u09BE \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8",
      "opt_both_text_left": "\u0989\u09AD\u09AF\u09BC: \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09AC\u09BE\u09AE, \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09A1\u09BE\u09A8",
      "opt_both_bg_left": "\u0989\u09AD\u09AF\u09BC: \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09BE\u09AE, \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A1\u09BE\u09A8",
      "opt_text_only": "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999",
      "opt_background_only": "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B0\u0999",
      "replace_default_swatches": "\u09A1\u09BF\u09AB\u09B2\u09CD\u099F \u09B8\u09CB\u09AF\u09BC\u09BE\u099A\u0997\u09C1\u09B2\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8 \u0995\u09B0\u09C1\u09A8",
      "replace_default_swatches_desc": "\u098F\u099F\u09BF \u099A\u09BE\u09B2\u09C1 \u09A5\u09BE\u0995\u09B2\u09C7, \u0995\u09C7\u09AC\u09B2 \u0986\u09AA\u09A8\u09BE\u09B0 \u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09B0\u0999\u0997\u09C1\u09B2\u09BF \u0995\u09BE\u09B2\u09BE\u09B0 \u09AA\u09BF\u0995\u09BE\u09B0\u09C7 \u09A6\u09C7\u0996\u09BE\u09AC\u09C7\u0964 \u0995\u09CB\u09A8\u09CB \u09A1\u09BF\u09AB\u09B2\u09CD\u099F \u09B0\u0999 \u09A8\u09AF\u09BC!",
      "enable_custom_swatches": "\u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09B8\u09CB\u09AF\u09BC\u09BE\u099A\u0997\u09C1\u09B2\u09BF \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u0995\u09B0\u09C1\u09A8",
      "enable_custom_swatches_desc": "\u098F\u099F\u09BF \u099A\u09BE\u09B2\u09C1 \u09A5\u09BE\u0995\u09B2\u09C7, \u0986\u09AA\u09A8\u09BE\u09B0 \u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09B8\u09CB\u09AF\u09BC\u09BE\u099A\u0997\u09C1\u09B2\u09BF \u0995\u09BE\u09B2\u09BE\u09B0 \u09AA\u09BF\u0995\u09BE\u09B0\u09C7 \u09A6\u09C7\u0996\u09BE\u09AC\u09C7\u0964",
      "use_swatch_names": "\u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999\u09BE\u09AF\u09BC\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09BE\u09AE \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8",
      "use_swatch_names_desc": "\u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0987\u09A8\u09AA\u09C1\u099F\u09C7\u09B0 \u09AA\u09BE\u09B6\u09C7 \u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09BE\u09AE\u09C7\u09B0 \u09A1\u09CD\u09B0\u09AA\u09A1\u09BE\u0989\u09A8 \u09A6\u09C7\u0996\u09BE\u09A8",
      "default_colors_header": "\u09A1\u09BF\u09AB\u09B2\u09CD\u099F \u09B0\u0999\u0997\u09C1\u09B2\u09BF",
      "custom_swatches_header": "\u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09B8\u09CB\u09AF\u09BC\u09BE\u099A\u0997\u09C1\u09B2\u09BF",
      "btn_add_color": "+ \u09B0\u0999 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "no_custom_swatches_yet": '\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8\u09CB \u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09C7\u0987\u0964 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 "+ \u09B0\u0999 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8" \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8\u0964',
      "label_built_in": "(\u09AC\u09BF\u09B2\u09CD\u099F-\u0987\u09A8)",
      // Color Picker
      "pick_color_header": "\u09B0\u0999 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8",
      "selected_text_preview": "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      "text_color_title": "\u099F\u09C7\u0995\u09CD\u09B8\u099F\u09C7\u09B0 \u09B0\u0999",
      "select_swatch": "\u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      "highlight_color_title": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u09B0\u0999",
      "select_highlight_swatch": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      // Always Colored Texts
      "always_colored_texts_header": "\u09B8\u09B0\u09CD\u09AC\u09A6\u09BE \u09B0\u0999 \u0995\u09B0\u09BE \u099F\u09C7\u0995\u09CD\u09B8\u099F\u0997\u09C1\u09B2\u09BF",
      "always_colored_texts_desc": "\u098F\u0996\u09BE\u09A8\u09C7\u0987 \u0986\u09AA\u09A8\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u098F\u09AC\u0982 \u09A4\u09BE\u09A6\u09C7\u09B0 \u09B0\u0999\u0997\u09C1\u09B2\u09BF \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C \u0995\u09B0\u09C7\u09A8\u0964",
      "search_colored_words_placeholder": "\u09B0\u0999 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0985\u09A8\u09C1\u09B8\u09A8\u09CD\u09A7\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      "sort_label_last-added": "\u09B8\u09B0\u09CD\u099F: \u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09AF\u09CB\u0997",
      "sort_label_a-z": "\u09B8\u09B0\u09CD\u099F: A-Z",
      "sort_label_reverse-a-z": "\u09B8\u09B0\u09CD\u099F: Z-A",
      "sort_label_style-order": "\u09B8\u09B0\u09CD\u099F: \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0",
      "sort_label_color": "\u09B8\u09B0\u09CD\u099F: \u09B0\u0999",
      "btn_add_new_word": "+ \u09A8\u09A4\u09C1\u09A8 \u09B0\u0999\u09BE\u09AF\u09BC\u09BF\u09A4 \u09B6\u09AC\u09CD\u09A6 / \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "style_type_text": "\u09B0\u0999",
      "style_type_highlight": "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F",
      "style_type_both": "\u0989\u09AD\u09AF\u09BC",
      "word_pattern_placeholder_long": "\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8, \u09B6\u09AC\u09CD\u09A6 \u09AC\u09BE \u0995\u09AE\u09BE \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09AA\u09C3\u09A5\u0995 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6 (\u09AF\u09C7\u09AE\u09A8 hello, world, foo)",
      "word_pattern_placeholder_short": "\u0995\u09C0\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8, \u09AC\u09BE \u0995\u09AE\u09BE \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09AA\u09C3\u09A5\u0995 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6",
      "use_regex": "\u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8",
      "flags_placeholder": "\u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u0997\u09CD\u09B8",
      "text_or_regex_placeholder": "\u099F\u09C7\u0995\u09CD\u09B8\u099F / \u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u0987\u09A8\u09AA\u09C1\u099F",
      "duplicate_entry": "\u09A1\u09C1\u09AA\u09CD\u09B2\u09BF\u0995\u09C7\u099F \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF",
      "open_in_regex_tester": "\u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u099F\u09C7\u09B8\u09CD\u099F\u09BE\u09B0\u09C7 \u0996\u09C1\u09B2\u09C1\u09A8",
      "no_rules_configured": "\u0995\u09CB\u09A8\u09CB \u09B0\u09C1\u09B2 \u0995\u09A8\u09AB\u09BF\u0997\u09BE\u09B0 \u0995\u09B0\u09BE \u09A8\u09C7\u0987\u0964",
      "no_rules_found": "\u0995\u09CB\u09A8\u09CB \u09A8\u09BF\u09AF\u09BC\u09AE \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964",
      // Presets
      "btn_presets": "\u09AA\u09CD\u09B0\u09BF\u09B8\u09C7\u099F\u0997\u09C1\u09B2\u09BF",
      "preset_all_headings": "\u09B8\u09AC \u09B6\u09BF\u09B0\u09CB\u09A8\u09BE\u09AE (H1-H6)",
      "preset_bullet_points": "\u09AC\u09C1\u09B2\u09C7\u099F \u09AA\u09AF\u09BC\u09C7\u09A8\u09CD\u099F\u0997\u09C1\u09B2\u09BF",
      "preset_numbered_lists": "\u09B8\u0982\u0996\u09CD\u09AF\u09BE\u09AF\u09BC\u09BF\u09A4 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\u0997\u09C1\u09B2\u09BF",
      "preset_task_checked": "\u099F\u09BE\u09B8\u09CD\u0995 \u09B2\u09BF\u09B8\u09CD\u099F (\u099A\u09C7\u0995 \u0995\u09B0\u09BE)",
      "preset_task_unchecked": "\u099F\u09BE\u09B8\u09CD\u0995 \u09B2\u09BF\u09B8\u09CD\u099F (\u0985\u099A\u09C7\u0995 \u0995\u09B0\u09BE)",
      "preset_dates_yyyy_mm_dd": "\u09A4\u09BE\u09B0\u09BF\u0996 (YYYY-MM-DD)",
      "preset_times_am_pm": "\u09B8\u09AE\u09AF\u09BC (AM/PM)",
      "preset_dates_yyyy_mmm_dd": "\u09A4\u09BE\u09B0\u09BF\u0996 (YYYY-MMM-DD)",
      "preset_relative_dates": "\u0986\u09AA\u09C7\u0995\u09CD\u09B7\u09BF\u0995 \u09A4\u09BE\u09B0\u09BF\u0996",
      "preset_basic_urls": "\u09AC\u09C7\u09B8\u09BF\u0995 URL",
      "preset_markdown_links": "\u09AE\u09BE\u09B0\u09CD\u0995\u09A1\u09BE\u0989\u09A8 \u09B2\u09BF\u0982\u0995",
      "preset_domain_names": "\u09A1\u09CB\u09AE\u09C7\u0987\u09A8 \u09A8\u09BE\u09AE",
      "preset_email_addresses": "\u0987\u09AE\u09C7\u0987\u09B2 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
      "preset_at_username": "@\u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u0995\u09BE\u09B0\u09C0\u09B0 \u09A8\u09BE\u09AE",
      "preset_currency": "\u09AE\u09C1\u09A6\u09CD\u09B0\u09BE",
      "preset_measurements": "\u09AA\u09B0\u09BF\u09AE\u09BE\u09AA",
      "preset_phone_numbers": "\u09AB\u09CB\u09A8 \u09A8\u09AE\u09CD\u09AC\u09B0",
      "preset_all_texts": "\u09B8\u09AC \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      "preset_codeblocks": "\u0995\u09CB\u09A1\u09AC\u09CD\u09B2\u0995",
      "preset_inline_comments": "\u09AE\u09A8\u09CD\u09A4\u09AC\u09CD\u09AF (%%\u2026%%)",
      "preset_parentheses": "\u09AC\u09A8\u09CD\u09A7\u09A8\u09C0 ()",
      "preset_square_brackets": "\u09AC\u09B0\u09CD\u0997 \u09AC\u09A8\u09CD\u09A7\u09A8\u09C0 []",
      "preset_curly_braces": "\u0995\u09BE\u09B0\u09CD\u09B2\u09BF \u09AC\u09CD\u09B0\u09C7\u09B8\u09C7\u09B8 {}",
      "preset_angle_brackets": "\u0995\u09CB\u09A3 \u09AC\u09A8\u09CD\u09A7\u09A8\u09C0 <>",
      "preset_colons": "\u0995\u09CB\u09B2\u09A8 :",
      "preset_double_quotes": "\u09A1\u09BE\u09AC\u09B2 \u0995\u09CB\u099F",
      "preset_single_quotes": "\u09B8\u09BF\u0999\u09CD\u0997\u09C7\u09B2 \u0995\u09CB\u099F\u09B8",
      "preset_single_quotes_word_bounded": "\u09B8\u09BF\u0999\u09CD\u0997\u09C7\u09B2 \u0995\u09CB\u099F\u09B8 (\u09B6\u09AC\u09CD\u09A6-\u09B8\u09C0\u09AE\u09BF\u09A4)",
      "preset_group_markdown_formatting": "\u09AE\u09BE\u09B0\u09CD\u0995\u09A1\u09BE\u0989\u09A8 \u09B8\u09CD\u0995\u09C3\u09AA\u09CD\u09A4",
      "preset_group_other_patterns": "\u0985\u09A8\u09CD\u09AF \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8",
      "preset_group_brackets": "\u09AC\u09A8\u09CD\u09A7\u09A8\u09C0",
      // Blacklist Settings
      "blacklist_words_header": "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u09B6\u09AC\u09CD\u09A6\u0997\u09C1\u09B2\u09BF",
      "blacklist_words_desc": "\u098F\u0996\u09BE\u09A8\u09C7\u09B0 \u0995\u09C0\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8\u0997\u09C1\u09B2\u09BF \u0995\u0996\u09A8\u0993 \u09B0\u0999 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7 \u09A8\u09BE, \u098F\u09AE\u09A8\u0995\u09BF \u0986\u0982\u09B6\u09BF\u0995 \u09AE\u09CD\u09AF\u09BE\u099A\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF\u0993\u0964",
      "search_blacklist_placeholder": "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0985\u09A8\u09C1\u09B8\u09A8\u09CD\u09A7\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      "blacklist_sort_label_last-added": "\u09B8\u09B0\u09CD\u099F: \u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09AF\u09CB\u0997",
      "blacklist_sort_label_a-z": "\u09B8\u09B0\u09CD\u099F: A-Z",
      "blacklist_sort_label_reverse-a-z": "\u09B8\u09B0\u09CD\u099F: Z-A",
      "btn_add_blacklist": "+ \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u09B6\u09AC\u09CD\u09A6 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "btn_add_to_blacklist": "+ \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "btn_add_blacklist_word": "+ \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09B6\u09AC\u09CD\u09A6 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "btn_add_blacklist_regex": "+ \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      // File & Folder Rules
      "file_folder_rules_header": "\u09AB\u09BE\u0987\u09B2 \u0993 \u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B0\u09C1\u09B2\u09B8",
      "file_folder_rules_desc": "\u09A8\u09BE\u09AE \u09AE\u09CD\u09AF\u09BE\u099A\u09BF\u0982, \u09B8\u09A0\u09BF\u0995 \u09AA\u09BE\u09A5, \u09AC\u09BE \u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0995\u09A8\u09CD\u099F\u09CD\u09B0\u09CB\u09B2 \u0995\u09B0\u09C1\u09A8\u0964 \u09AD\u09B2\u09CD\u099F-\u0993\u09AF\u09BC\u09BE\u0987\u09A1 \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09A4\u09C7 \u098F\u0995\u099F\u09BF \u09AB\u09BE\u0981\u0995\u09BE \u098F\u0995\u09CD\u09B8\u0995\u09CD\u09B2\u09C1\u09A1 \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF \u09B0\u09BE\u0996\u09C1\u09A8\u0964",
      "search_file_folder_rules_placeholder": "\u09AB\u09BE\u0987\u09B2/\u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C1\u09B2\u09B8 \u0985\u09A8\u09C1\u09B8\u09A8\u09CD\u09A7\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      "path_sort_label_last-added": "\u09B8\u09B0\u09CD\u099F: \u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09AF\u09CB\u0997",
      "path_sort_label_a-z": "\u09B8\u09B0\u09CD\u099F: A-Z",
      "path_sort_label_reverse-a-z": "\u09B8\u09B0\u09CD\u099F: Z-A",
      "path_sort_label_mode": "\u09B8\u09B0\u09CD\u099F: \u09AE\u09CB\u09A1",
      "path_sort_label_type": "\u09B8\u09B0\u09CD\u099F: \u099F\u09BE\u0987\u09AA",
      "btn_add_file_folder_rule": "+ \u09AB\u09BE\u0987\u09B2/\u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C1\u09B2 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "disabled_files_header": "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u0995\u09B0\u09BE \u09AB\u09BE\u0987\u09B2\u0997\u09C1\u09B2\u09BF:",
      // Advanced Settings - Inclusion Exclusion Labels
      "path_rule_mode_include": "\u0985\u09A8\u09CD\u09A4\u09B0\u09CD\u09AD\u09C1\u0995\u09CD\u09A4",
      "path_rule_mode_exclude": "\u09AC\u09BE\u09A6 \u09A6\u09BF\u09A8",
      "text_rule_mode_include": "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 (\u09B9\u09CB\u09AF\u09BC\u09BE\u0987\u099F\u09B2\u09BF\u09B8\u09CD\u099F\u09C7) \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      "text_rule_mode_exclude": "(\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7) \u09B0\u0999 \u0995\u09B0\u09AC\u09C7\u09A8 \u09A8\u09BE",
      "mode_only_colors_in": "\u09B6\u09C1\u09A7\u09C1 \u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09B0\u0999 \u0995\u09B0\u09C7",
      "mode_does_not_color_in": "\u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09B0\u0999 \u0995\u09B0\u09C7 \u09A8\u09BE",
      "label_text_include": "\u09B9\u09CB\u09AF\u09BC\u09BE\u0987\u099F\u09B2\u09BF\u09B8\u09CD\u099F",
      "label_text_exclude": "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F",
      "enter_path_or_pattern": "\u09AA\u09BE\u09A5 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8",
      "label_regex": "\u09B0\u09C7\u099C\u09C7\u0995\u09CD\u09B8",
      // Advanced Rules
      "advanced_rules_header": "\u0989\u09A8\u09CD\u09A8\u09A4 \u09A8\u09BF\u09AF\u09BC\u09AE",
      "advanced_rules_modal_header": "\u0989\u09A8\u09CD\u09A8\u09A4 \u09A8\u09BF\u09AF\u09BC\u09AE",
      "advanced_rules_manage_button": "\u0989\u09A8\u09CD\u09A8\u09A4 \u09A8\u09BF\u09AF\u09BC\u09AE \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09C1\u09A8",
      "edit_rule_header": "\u09A8\u09BF\u09AF\u09BC\u09AE \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8",
      "add_rule_header": "\u09A8\u09A4\u09C1\u09A8 \u09A8\u09BF\u09AF\u09BC\u09AE \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "btn_add_rule": "+ \u09A8\u09BF\u09AF\u09BC\u09AE \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "btn_save_rule": "\u09A8\u09BF\u09AF\u09BC\u09AE \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0995\u09B0\u09C1\u09A8",
      "btn_add_words": "+ \u09B6\u09AC\u09CD\u09A6 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "btn_add_regex": "+ \u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      "btn_save_regex": "\u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0995\u09B0\u09C1\u09A8",
      // Regex Tester
      "regex_tester_header": "\u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u0995",
      "regex_tester_blacklist": "\u09B0\u09C7\u099C\u09C7\u0995\u09CD\u09B8 \u099F\u09C7\u09B8\u09CD\u099F\u09BE\u09B0 - \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F",
      "regex_expression_placeholder": "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8 \u0985\u09AD\u09BF\u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF \u098F\u0996\u09BE\u09A8\u09C7 \u09B0\u09BE\u0996\u09C1\u09A8",
      "regex_subject_placeholder": "\u098F\u0996\u09BE\u09A8\u09C7 \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09BE\u09B0 \u09AC\u09BF\u09B7\u09AF\u09BC \u099F\u09BE\u0987\u09AA \u0995\u09B0\u09C1\u09A8...",
      "regex_name_placeholder": "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B0\u09BF\u099C\u09C7\u0995\u09CD\u09B8\u09C7\u09B0 \u09A8\u09BE\u09AE \u09A6\u09BF\u09A8",
      "matches": "\u09AE\u09C7\u09B2",
      "matches_found": "\u09AE\u09C7\u09B2 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u0997\u09C7\u099B\u09C7",
      // Regex Flags
      "flag_g": "\u0997\u09CD\u09B2\u09CB\u09AC\u09BE\u09B2 \u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u0997: \u09B8\u09AE\u09B8\u09CD\u09A4 \u09AE\u09C7\u09B2 \u0996\u09C1\u0981\u099C\u09C1\u09A8",
      "flag_i": "\u0995\u09C7\u09B8-\u0985\u09B8\u0982\u09AC\u09C7\u09A6\u09A8\u09B6\u09C0\u09B2 \u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u0997",
      "flag_m": "\u09AE\u09BE\u09B2\u09CD\u099F\u09BF\u09B2\u09BE\u0987\u09A8 \u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u0997: ^ \u098F\u09AC\u0982 $ \u09B2\u09BE\u0987\u09A8 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AE\u09C7\u09B2 \u0996\u09BE\u09AF\u09BC",
      "flag_s": "dotAll \u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u0997: . \u09A8\u09A4\u09C1\u09A8 \u09B2\u09BE\u0987\u09A8\u0997\u09C1\u09B2\u09BF\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AE\u09C7\u09B2 \u0996\u09BE\u09AF\u09BC",
      "flag_u": "\u0987\u0989\u09A8\u09BF\u0995\u09CB\u09A1 \u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u0997: \u0987\u0989\u09A8\u09BF\u0995\u09CB\u09A1 \u0995\u09CB\u09A1 \u09AA\u09AF\u09BC\u09C7\u09A8\u09CD\u099F \u09B9\u09BF\u09B8\u09BE\u09AC\u09C7 \u09AC\u09BF\u09AC\u09C7\u099A\u09A8\u09BE \u0995\u09B0\u09C1\u09A8",
      "flag_y": "\u09B8\u09CD\u099F\u09BF\u0995\u09BF \u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u0997: lastIndex \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 \u09A5\u09C7\u0995\u09C7 \u09AE\u09C7\u09B2 \u0996\u09BE\u09A8",
      // Data Export/Import
      "data_export_import_header": "\u09A1\u09C7\u099F\u09BE \u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F/\u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F",
      "export_plugin_data": "\u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8 \u09A1\u09C7\u099F\u09BE \u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C1\u09A8",
      "export_plugin_data_desc": "\u09B8\u09C7\u099F\u09BF\u0982\u09B8, \u09B6\u09AC\u09CD\u09A6 \u098F\u09AC\u0982 \u09B0\u09C1\u09B2\u0997\u09C1\u09B2\u09BF \u098F\u0995\u099F\u09BF JSON \u09AB\u09BE\u0987\u09B2\u09C7 \u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C1\u09A8\u0964",
      "btn_export": "\u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F",
      "import_plugin_data": "\u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8 \u09A1\u09C7\u099F\u09BE \u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C1\u09A8",
      "import_plugin_data_desc": "\u098F\u0995\u099F\u09BF JSON \u09AB\u09BE\u0987\u09B2 \u09A5\u09C7\u0995\u09C7 \u09B8\u09C7\u099F\u09BF\u0982\u09B8 \u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C1\u09A8",
      "btn_import": "\u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F"
    };
  }
});

// src/i18n/ru.js
var require_ru = __commonJS({
  "src/i18n/ru.js"(exports2, module2) {
    module2.exports = {
      // Plugin Metadata & Basic Labels
      "__name": "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
      "settings_title": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 Always Color Text",
      "header_plugin_name": "Always Color Text",
      "ribbon_title": "Always Color Text",
      // Language Settings
      "language_label": "\u042F\u0437\u044B\u043A",
      "language_desc": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430 \u043F\u043B\u0430\u0433\u0438\u043D\u0430",
      "language_en": "\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439",
      "language_es": "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439",
      "language_fr": "\u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0438\u0439",
      "language_eu": "\u0411\u0430\u0441\u043A\u0441\u043A\u0438\u0439",
      "language_ru": "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
      "language_auto": "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0439",
      // Release Notes
      "latest_release_notes_label": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u043A \u0432\u044B\u043F\u0443\u0441\u043A\u0443",
      "latest_release_notes_desc": "\u041F\u0440\u043E\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0439\u0442\u0435 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u043A \u0432\u044B\u043F\u0443\u0441\u043A\u0443 \u043F\u043B\u0430\u0433\u0438\u043D\u0430",
      "open_changelog_button": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439",
      "command_show_release_notes": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u043A \u0432\u044B\u043F\u0443\u0441\u043A\u0443",
      "changelog_view_on_github": "\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043D\u0430 GitHub",
      "changelog_loading": "\u0412\u044B\u043F\u0443\u0441\u043A\u0438 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u044E\u0442\u0441\u044F\u2026",
      "changelog_no_info": "\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0432\u044B\u043F\u0443\u0441\u043A\u0430\u0445 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430.",
      "changelog_release": "\u0412\u044B\u043F\u0443\u0441\u043A\u0438",
      "changelog_no_notes": "\u041D\u0435\u0442 \u0437\u0430\u043C\u0435\u0442\u043E\u043A",
      "changelog_failed_to_load": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u043A \u0432\u044B\u043F\u0443\u0441\u043A\u0430\u043C.",
      // UI Elements & Menus
      "file_menu_enable": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430",
      "file_menu_disable": "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430",
      "menu_color_once": "\u041E\u043A\u0440\u0430\u0441\u0438\u0442\u044C \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E",
      "menu_highlight_once": "\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u0438\u0442\u044C \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E",
      "menu_always_color_text": "Always Color Text",
      "menu_remove_always_color_text": "\u0423\u0431\u0440\u0430\u0442\u044C Always Color Text",
      "menu_blacklist_word": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043B\u043E\u0432\u043E \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      "show_toggle_statusbar": "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0432 \u0441\u0442\u0440\u043E\u043A\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F",
      "show_toggle_ribbon": "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043D\u0430 \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u043E\u0439 \u043F\u0430\u043D\u0435\u043B\u0438",
      "show_toggle_command": "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0432 \u043F\u0430\u043B\u0438\u0442\u0440\u0435 \u043A\u043E\u043C\u0430\u043D\u0434",
      "show_blacklist_menu": "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \xAB\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A\xBB \u0432 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u043D\u043E\u043C \u043C\u0435\u043D\u044E",
      "show_blacklist_menu_desc": "\u0412 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u043D\u043E\u043C \u043C\u0435\u043D\u044E \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043B\u043E\u0432\u043E \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A, \u0447\u0442\u043E\u0431\u044B \u043E\u043D\u043E \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043B\u043E\u0441\u044C.",
      "tooltip_enable_for_file": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430",
      "tooltip_delete_all_words": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u0441\u043B\u043E\u0432\u0430/\u0448\u0430\u0431\u043B\u043E\u043D\u044B",
      "tooltip_delete_all_blacklist": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0438\u0437 \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430 \u0432\u0441\u0435 \u0441\u043B\u043E\u0432\u0430/\u0448\u0430\u0431\u043B\u043E\u043D\u044B",
      "tooltip_use_regex": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043A\u0430\u043A \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
      "drag_to_reorder": "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0434\u043B\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u043E\u0440\u044F\u0434\u043A\u0430",
      "reset_text_color": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0446\u0432\u0435\u0442 \u0442\u0435\u043A\u0441\u0442\u0430",
      "reset_highlight": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0443",
      // Commands
      "command_color_selected": "\u041E\u043A\u0440\u0430\u0441\u0438\u0442\u044C \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442",
      "command_toggle_current": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C/\u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430",
      "command_toggle_global": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C/\u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C Always Color Text",
      "command_manage_advanced_rules": "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u043C\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438",
      "command_open_regex_tester": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C Regex (\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043E\u0440 Regex)",
      "command_open_blacklist_regex_tester": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C Regex \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      "command_manage_colored_texts": "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u043A\u0440\u0430\u0448\u0435\u043D\u043D\u044B\u043C\u0438 \u0442\u0435\u043A\u0441\u0442\u0430\u043C\u0438",
      "command_toggle_hide_text_colors": "\u0421\u043A\u0440\u044B\u0442\u044C/\u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0446\u0432\u0435\u0442\u0430 \u0442\u0435\u043A\u0441\u0442\u0430",
      "command_toggle_hide_highlights": "\u0421\u043A\u0440\u044B\u0442\u044C/\u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      // Notifications
      "notice_enabled": "Always Color Text \u0432\u043A\u043B\u044E\u0447\u0451\u043D",
      "notice_disabled": "Always Color Text \u043E\u0442\u043A\u043B\u044E\u0447\u0451\u043D",
      "notice_blacklisted_cannot_color": "\xAB{word}\xBB \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u0447\u0451\u0440\u043D\u043E\u043C \u0441\u043F\u0438\u0441\u043A\u0435 \u0438 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043E\u043A\u0440\u0430\u0448\u0435\u043D\u043E.",
      "notice_removed_always_color": "\u041E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0434\u043B\u044F \xAB{word}\xBB.",
      "notice_added_to_blacklist": "\xAB{word}\xBB \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A.",
      "notice_already_blacklisted": "\xAB{word}\xBB \u0443\u0436\u0435 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u0447\u0451\u0440\u043D\u043E\u043C \u0441\u043F\u0438\u0441\u043A\u0435.",
      "notice_select_text_first": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0434\u0435\u043B\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442.",
      "notice_no_active_file": "\u041D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430 \u0434\u043B\u044F \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u044F.",
      "notice_coloring_enabled_for_path": "\u041E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0434\u043B\u044F {path}",
      "notice_coloring_disabled_for_path": "\u041E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0434\u043B\u044F {path}",
      "notice_global_enabled": "Always Color Text \u0432\u043A\u043B\u044E\u0447\u0451\u043D",
      "notice_global_disabled": "Always Color Text \u043E\u0442\u043A\u043B\u044E\u0447\u0451\u043D",
      "notice_unable_open_changelog": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439.",
      "notice_pattern_blocked": "\u0428\u0430\u0431\u043B\u043E\u043D \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D \u0432 \u0446\u0435\u043B\u044F\u0445 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 \u043F\u0430\u043C\u044F\u0442\u0438:",
      "notice_pattern_too_complex": "\u0428\u0430\u0431\u043B\u043E\u043D \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u043B\u043E\u0436\u043D\u044B\u0439:",
      "notice_invalid_hex_format": "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 hex \u0444\u043E\u0440\u043C\u0430\u0442 \u0446\u0432\u0435\u0442\u0430. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 #RRGGBB \u0438\u043B\u0438 #RGB.",
      "notice_error_saving_changes": "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430.",
      "notice_invalid_color_format": "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0446\u0432\u0435\u0442\u0430.",
      "notice_exported": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D: {fname}",
      "notice_export_failed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u044D\u043A\u0441\u043F\u043E\u0440\u0442",
      "notice_import_completed": "\u0418\u043C\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D",
      "notice_import_failed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0438\u043C\u043F\u043E\u0440\u0442",
      "notice_invalid_regex": "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
      "notice_empty_pattern": "\u0428\u0430\u0431\u043B\u043E\u043D \u043F\u0443\u0441\u0442",
      "notice_added_regex": "Regex \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D",
      "notice_rule_updated": "\u041F\u0440\u0430\u0432\u0438\u043B\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E",
      "notice_regex_updated": "Regex \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D",
      "notice_entry_updated": "\u0417\u0430\u043F\u0438\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430",
      "notice_entry_duplicated": "\u0417\u0430\u043F\u0438\u0441\u044C \u043F\u0440\u043E\u0434\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0430",
      "notice_error_opening_regex_tester": "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043E\u0440\u0430 regex",
      "notice_error_opening_blacklist_regex_tester": "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043E\u0440\u0430 \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430 Regex",
      "notice_error_opening_advanced_rules": "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043E\u0440\u0430 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u0430\u0432\u0438\u043B",
      "notice_text_color_reset": "\u0426\u0432\u0435\u0442 \u0442\u0435\u043A\u0441\u0442\u0430 \u0441\u0431\u0440\u043E\u0448\u0435\u043D",
      "notice_highlight_reset": "\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u0430",
      "notice_text_colors_hidden": "\u0426\u0432\u0435\u0442\u0430 \u0442\u0435\u043A\u0441\u0442\u0430 \u0441\u043A\u0440\u044B\u0442\u044B",
      "notice_text_colors_visible": "\u0426\u0432\u0435\u0442\u0430 \u0442\u0435\u043A\u0441\u0442\u0430 \u0432\u0438\u0434\u043D\u044B",
      "notice_highlights_hidden": "\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438 \u0441\u043A\u0440\u044B\u0442\u044B",
      "notice_highlights_visible": "\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438 \u0432\u0438\u0434\u043D\u044B",
      "notice_regex_support_disabled": "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0445 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0439 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0430. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0435\u0451 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445, \u0447\u0442\u043E\u0431\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F.",
      "notice_no_active_file_to_disable": "\u041D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430, \u0434\u043B\u044F \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043C\u043E\u0436\u043D\u043E \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435.",
      "notice_already_disabled_for_path": "\u041E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u0443\u0436\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0434\u043B\u044F {path}",
      // Confirmation Dialogs
      "confirm_delete_all_title": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u0441\u043B\u043E\u0432\u0430",
      "confirm_delete_all_desc": "\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u043E\u043A\u0440\u0430\u0448\u0435\u043D\u043D\u044B\u0435 \u0441\u043B\u043E\u0432\u0430/\u0448\u0430\u0431\u043B\u043E\u043D\u044B? \u0412\u044B \u043D\u0435 \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u044D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435!",
      "confirm_delete_all_blacklist_title": "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0432\u0441\u0435\u0445 \u0441\u043B\u043E\u0432 \u0438\u0437 \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430",
      "confirm_delete_all_blacklist_desc": "\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u043F\u0438\u0441\u0438 \u0438\u0437 \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430? \u0412\u044B \u043D\u0435 \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u044D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435!",
      "restart_required_title": "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u043A",
      "restart_required_desc": "\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044F \u0432 \u043F\u0430\u043B\u0438\u0442\u0440\u0435 \u043A\u043E\u043C\u0430\u043D\u0434 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u043A\u0430 Obsidian, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0443\u0431\u0440\u0430\u0442\u044C \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0438\u0437 \u043F\u0430\u043B\u0438\u0442\u0440\u044B. \u041F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0435\u0439\u0447\u0430\u0441?",
      // Basic Settings
      "enable_document_color": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430",
      "color_in_reading_mode": "\u0426\u0432\u0435\u0442\u0430 \u0432 \u0440\u0435\u0436\u0438\u043C\u0435 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430",
      "force_full_render_reading": "\u041F\u0440\u0438\u043D\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u043E\u043B\u043D\u044B\u0439 \u0440\u0435\u043D\u0434\u0435\u0440\u0438\u043D\u0433 \u0432 \u0440\u0435\u0436\u0438\u043C\u0435 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430",
      "force_full_render_reading_desc": "\u041F\u0440\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u0440\u0435\u0436\u0438\u043C\u0430 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430 \u043F\u043B\u0430\u0433\u0438\u043D \u043F\u043E\u043F\u044B\u0442\u0430\u0435\u0442\u0441\u044F \u043E\u043A\u0440\u0430\u0441\u0438\u0442\u044C \u0432\u0435\u0441\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u0437\u0430 \u043E\u0434\u0438\u043D \u043F\u043E\u0434\u0445\u043E\u0434. \u041C\u043E\u0436\u0435\u0442 \u0432\u044B\u0437\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u044B \u0441 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E \u0432 \u0431\u043E\u043B\u044C\u0448\u0438\u0445 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0445. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0441 \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E\u0441\u0442\u044C\u044E!",
      "disable_coloring_current_file": "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430",
      "disable_coloring_current_file_desc": "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u0434\u043B\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430 \u0432 \u0440\u0430\u0437\u0434\u0435\u043B\u0435 \u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u044F \u043F\u0430\u043F\u043E\u043A \u0438 \u0444\u0430\u0439\u043B\u043E\u0432.",
      "btn_disable_for_this_file": "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430",
      // Coloring Settings
      "coloring_settings_header": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u044F",
      "regex_support": "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 Regex",
      "regex_support_desc": "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0448\u0430\u0431\u043B\u043E\u043D\u0430\u043C \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0445 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0439. \u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u044E\u0442\u0441\u044F \u0434\u043B\u044F \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438.",
      "disable_regex_safety": "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0439 Regex",
      "disable_regex_safety_desc": "\u041F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u043B\u043E\u0436\u043D\u044B\u0435 \u0438\u043B\u0438 \u043F\u043E\u0442\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u043E\u043F\u0430\u0441\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F. \u041C\u043E\u0433\u0443\u0442 \u0432\u044B\u0437\u044B\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u044B \u0441 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E \u0438\u043B\u0438 \u0437\u0430\u0432\u0438\u0441\u0430\u043D\u0438\u044F.",
      "case_sensitive": "\u0427\u0443\u0432\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043A \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0443",
      "case_sensitive_desc": "\u041F\u0440\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \xAB\u0441\u043B\u043E\u0432\u043E\xBB \u0438 \xAB\u0421\u043B\u043E\u0432\u043E\xBB \u0431\u0443\u0434\u0443\u0442 \u043E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u043F\u043E-\u0440\u0430\u0437\u043D\u043E\u043C\u0443. \u041F\u0440\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u0431\u0443\u0434\u0443\u0442 \u043E\u043A\u0440\u0430\u0448\u0435\u043D\u044B \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u043E.",
      "partial_match": "\u0427\u0430\u0441\u0442\u0438\u0447\u043D\u043E\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435",
      "partial_match_desc": "\u041F\u0440\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0432\u0441\u0451 \u0441\u043B\u043E\u0432\u043E, \u0435\u0441\u043B\u0438 \u0432\u043D\u0443\u0442\u0440\u0438 \u043D\u0435\u0433\u043E \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043E\u043A\u0440\u0430\u0448\u0435\u043D\u043D\u043E\u0435 (\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \xAB\u0447\u0442\u043E\xBB \u043E\u043A\u0440\u0430\u0441\u0438\u0442 \xAB\u0447\u0442\u043E\u0431\u044B\xBB).",
      // One-Time Actions
      "one_time_actions_header": "\u041E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
      "setting_color_once": "\u041E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E\u0435 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435",
      "setting_color_once_desc": "\u0412\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 HTML-\u043A\u043E\u0434 \u0434\u043B\u044F \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u044F \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u043D\u043E\u0433\u043E \u0442\u0435\u043A\u0441\u0442\u0430. \u041E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0434\u0430\u0436\u0435 \u043F\u0440\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u043F\u043B\u0430\u0433\u0438\u043D\u0430. (\u041C\u043E\u0436\u043D\u043E \u0443\u0431\u0440\u0430\u0442\u044C, \u0443\u0434\u0430\u043B\u0438\u0432 \u0432\u0440\u0443\u0447\u043D\u0443\u044E \u0447\u0430\u0441\u0442\u0438 \u043A\u043E\u0434\u0430)",
      "setting_highlight_once": "\u041E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u0430\u044F \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430",
      "setting_highlight_once_desc": "\u0412\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 HTML-\u043A\u043E\u0434, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442. \u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F \u0434\u0430\u0436\u0435 \u043F\u0440\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u043F\u043B\u0430\u0433\u0438\u043D\u0430. (\u041C\u043E\u0436\u043D\u043E \u0443\u0431\u0440\u0430\u0442\u044C, \u0443\u0434\u0430\u043B\u0438\u0432 \u0432\u0440\u0443\u0447\u043D\u0443\u044E \u0447\u0430\u0441\u0442\u0438 \u043A\u043E\u0434\u0430)",
      "highlight_once_preview": "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E\u0439 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      "highlight_once_preview_text": "\u0422\u0430\u043A \u0431\u0443\u0434\u0435\u0442 \u0432\u044B\u0433\u043B\u044F\u0434\u0435\u0442\u044C \u0432\u0430\u0448\u0430 \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u0430\u044F \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430!",
      // Highlight Once Settings
      "highlight_once_opacity": "\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C",
      "highlight_once_border_radius": "\u0420\u0430\u0434\u0438\u0443\u0441 \u0433\u0440\u0430\u043D\u0438\u0446\u044B (px)",
      "reset_to_8": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0434\u043E 8",
      "highlight_horizontal_padding": "\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u043E\u0442\u0441\u0442\u0443\u043F\u044B (px)",
      "reset_to_4": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0434\u043E 4",
      "enable_border_highlight_once": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0440\u0430\u043C\u043A\u0443",
      "enable_border_highlight_once_desc": "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0440\u0430\u043C\u043A\u0443 \u0434\u043B\u044F \u0432\u0430\u0448\u0435\u0439 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438. \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 HTML/CSS-\u043A\u043E\u0434 \u0431\u0443\u0434\u0435\u0442 \u0434\u043B\u0438\u043D\u043D\u044B\u043C.",
      "highlight_once_border_style": "\u0421\u0442\u0438\u043B\u044C \u0440\u0430\u043C\u043A\u0438 \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E\u0439 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      "opt_border_full": "\u041F\u043E\u043B\u043D\u0430\u044F \u0440\u0430\u043C\u043A\u0430 (\u0432\u0441\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B)",
      "opt_border_top_bottom": "\u0421\u0432\u0435\u0440\u0445\u0443 \u0438 \u0441\u043D\u0438\u0437\u0443",
      "opt_border_left_right": "\u0421\u043B\u0435\u0432\u0430 \u0438 \u0441\u043F\u0440\u0430\u0432\u0430",
      "opt_border_top_right": "\u0421\u0432\u0435\u0440\u0445\u0443 \u0438 \u0441\u043F\u0440\u0430\u0432\u0430",
      "opt_border_top_left": "\u0421\u0432\u0435\u0440\u0445\u0443 \u0438 \u0441\u043B\u0435\u0432\u0430",
      "opt_border_bottom_right": "\u0412\u043D\u0438\u0437\u0443 \u0438 \u0441\u043F\u0440\u0430\u0432\u0430",
      "opt_border_bottom_left": "\u0412\u043D\u0438\u0437\u0443 \u0438 \u0441\u043B\u0435\u0432\u0430",
      "opt_border_top": "\u0422\u043E\u043B\u044C\u043A\u043E \u0441\u0432\u0435\u0440\u0445\u0443",
      "opt_border_bottom": "\u0422\u043E\u043B\u044C\u043A\u043E \u0441\u043D\u0438\u0437\u0443",
      "opt_border_left": "\u0422\u043E\u043B\u044C\u043A\u043E \u0441\u043B\u0435\u0432\u0430",
      "opt_border_right": "\u0422\u043E\u043B\u044C\u043A\u043E \u0441\u043F\u0440\u0430\u0432\u0430",
      "highlight_once_border_opacity": "\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C \u0440\u0430\u043C\u043A\u0438",
      "highlight_once_border_thickness": "\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0440\u0430\u043C\u043A\u0438 (px)",
      "reset_to_1": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0434\u043E 1",
      "use_global_highlight_style": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0432\u043D\u0435\u0448\u043D\u0438\u0439 \u0432\u0438\u0434 \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u043E\u0439 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438 \u0434\u043B\u044F \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E\u0439",
      "use_global_highlight_style_desc": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u0432\u0430\u0448 \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C. \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 HTML/CSS-\u043A\u043E\u0434 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u043B\u0438\u043D\u043D\u044B\u043C.",
      "style_highlight_once": "\u0421\u0442\u0438\u043B\u044C \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E\u0439 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      "style_highlight_once_desc": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0432\u0430\u0448 \u0441\u0442\u0438\u043B\u044C \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438. \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 HTML/CSS-\u043A\u043E\u0434 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u043B\u0438\u043D\u043D\u044B\u043C.",
      // Global Highlight Appearance
      "global_highlight_appearance_header": "\u0412\u043D\u0435\u0448\u043D\u0438\u0439 \u0432\u0438\u0434 \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u043E\u0439 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      "highlight_opacity": "\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      "highlight_opacity_desc": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u0435\u043F\u0435\u043D\u044C \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u0438 (0-100%)",
      "highlight_border_radius": "\u0420\u0430\u0434\u0438\u0443\u0441 \u0440\u0430\u043C\u043A\u0438 (px)",
      "highlight_border_radius_desc": "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0440\u0430\u0434\u0438\u0443\u0441 \u0440\u0430\u043C\u043A\u0438 (\u0432 px) \u0434\u043B\u044F \u0441\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0439",
      "highlight_horizontal_padding_desc": "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u043B\u0435\u0432\u044B\u0439 \u0438 \u043F\u0440\u0430\u0432\u044B\u0439 \u043E\u0442\u0441\u0442\u0443\u043F\u044B (\u0432 px)",
      "rounded_corners_wrapping": "\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u043D\u044B\u0435 \u0443\u0433\u043B\u044B \u043F\u0440\u0438 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0435",
      "rounded_corners_wrapping_desc": "\u041F\u0440\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C \u0441\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u043D\u044B\u0435 \u0443\u0433\u043B\u044B \u0441\u043E \u0432\u0441\u0435\u0445 \u0441\u0442\u043E\u0440\u043E\u043D, \u0434\u0430\u0436\u0435 \u043A\u043E\u0433\u0434\u0430 \u0442\u0435\u043A\u0441\u0442 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043D\u0430 \u043D\u043E\u0432\u0443\u044E \u0441\u0442\u0440\u043E\u043A\u0443.",
      "enable_highlight_border": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0440\u0430\u043C\u043A\u0443 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      "enable_highlight_border_desc": "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0440\u0430\u043C\u043A\u0443 \u0432\u043E\u043A\u0440\u0443\u0433 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438. \u0426\u0432\u0435\u0442 \u0440\u0430\u043C\u043A\u0438 \u0431\u0443\u0434\u0435\u0442 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0442\u044C \u0441 \u0446\u0432\u0435\u0442\u043E\u043C \u0442\u0435\u043A\u0441\u0442\u0430 \u0438\u043B\u0438 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438.",
      "border_style": "\u0421\u0442\u0438\u043B\u044C \u0440\u0430\u043C\u043A\u0438",
      "border_style_desc": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u0441 \u043A\u0430\u043A\u043E\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0440\u0430\u043C\u043A\u0443",
      "border_opacity": "\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C \u0440\u0430\u043C\u043A\u0438",
      "border_opacity_desc": "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C \u0440\u0430\u043C\u043A\u0438 (0-100%)",
      "border_thickness": "\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0440\u0430\u043C\u043A\u0438 (px)",
      "border_thickness_desc": "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0442\u043E\u043B\u0449\u0438\u043D\u0443 \u0440\u0430\u043C\u043A\u0438 \u043E\u0442 0-5 px (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, 1, 2.5, 5)",
      "highlight_preview": "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      "highlight_preview_text": "\u0422\u0430\u043A \u0431\u0443\u0434\u0435\u0442 \u0432\u044B\u0433\u043B\u044F\u0434\u0435\u0442\u044C \u0432\u0430\u0448\u0430 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430!",
      // Color Swatches
      "color_swatches_header": "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u0446\u0432\u0435\u0442\u0430",
      "color_picker_layout": "\u041C\u0430\u043A\u0435\u0442 \u043F\u043E\u0434\u0431\u043E\u0440\u0430 \u0446\u0432\u0435\u0442\u043E\u0432",
      "color_picker_layout_desc": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u043A\u0430\u043A\u0438\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C \u043F\u0440\u0438 \u0432\u044B\u0431\u043E\u0440\u0435 \u0446\u0432\u0435\u0442\u043E\u0432 \u0434\u043B\u044F \u0442\u0435\u043A\u0441\u0442\u0430",
      "opt_both_text_left": "\u041E\u0431\u0430: \u0422\u0435\u043A\u0441\u0442 \u0441\u043B\u0435\u0432\u0430, \u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u0441\u043F\u0440\u0430\u0432\u0430",
      "opt_both_bg_left": "\u041E\u0431\u0430: \u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u0441\u043B\u0435\u0432\u0430, \u0422\u0435\u043A\u0441\u0442 \u0441\u043F\u0440\u0430\u0432\u0430",
      "opt_text_only": "\u0422\u043E\u043B\u044C\u043A\u043E \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435",
      "opt_background_only": "\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430",
      "replace_default_swatches": "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0435 \u0446\u0432\u0435\u0442\u0430",
      "replace_default_swatches_desc": "\u041F\u0440\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u0432 \u043F\u0430\u043B\u0438\u0442\u0440\u0435 \u0431\u0443\u0434\u0443\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u0430\u0448\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u0446\u0432\u0435\u0442\u0430.",
      "enable_custom_swatches": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u0446\u0432\u0435\u0442\u0430",
      "enable_custom_swatches_desc": "\u041F\u0440\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u0432\u0430\u0448\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u0446\u0432\u0435\u0442\u0430 \u0431\u0443\u0434\u0443\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u0432 \u043F\u0430\u043B\u0438\u0442\u0440\u0435.",
      "use_swatch_names": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F \u0446\u0432\u0435\u0442\u043E\u0432 \u043F\u0440\u0438 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0438",
      "use_swatch_names_desc": "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0432\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0445 \u0446\u0432\u0435\u0442\u043E\u0432 \u0440\u044F\u0434\u043E\u043C \u0441 \u043F\u043E\u043B\u0435\u043C \u0432\u0432\u043E\u0434\u0430 \u0441\u043B\u043E\u0432/\u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432",
      "default_colors_header": "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0435 \u0446\u0432\u0435\u0442\u0430",
      "custom_swatches_header": "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u0446\u0432\u0435\u0442\u0430",
      "btn_add_color": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0446\u0432\u0435\u0442",
      "no_custom_swatches_yet": "\u041D\u0435\u0442 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0445 \u0446\u0432\u0435\u0442\u043E\u0432. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0446\u0432\u0435\u0442\xBB.",
      "label_built_in": "(\u0412\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439)",
      // Color Picker
      "pick_color_header": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0432\u0435\u0442",
      "selected_text_preview": "\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442",
      "text_color_title": "\u0426\u0432\u0435\u0442 \u0442\u0435\u043A\u0441\u0442\u0430",
      "select_swatch": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0432\u0435\u0442\u2026",
      "highlight_color_title": "\u0426\u0432\u0435\u0442 \u043F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0438",
      "select_highlight_swatch": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0432\u0435\u0442\u2026",
      // Always Colored Texts
      "always_colored_texts_header": "\u0412\u0441\u0435\u0433\u0434\u0430 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0442\u0435\u043A\u0441\u0442",
      "always_colored_texts_desc": "\u0417\u0434\u0435\u0441\u044C \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0442\u044C \u0432\u0430\u0448\u0438 \u0441\u043B\u043E\u0432\u0430/\u0448\u0430\u0431\u043B\u043E\u043D\u044B \u0438 \u0438\u0445 \u0446\u0432\u0435\u0442\u0430.",
      "search_colored_words_placeholder": "\u041F\u043E\u0438\u0441\u043A \u043E\u043A\u0440\u0430\u0448\u0435\u043D\u043D\u044B\u0445 \u0441\u043B\u043E\u0432/\u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432\u2026",
      "sort_label_last-added": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435",
      "sort_label_a-z": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u0410-\u042F",
      "sort_label_reverse-a-z": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u042F-\u0410",
      "sort_label_style-order": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u041F\u043E\u0440\u044F\u0434\u043E\u043A \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F",
      "sort_label_color": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u041F\u043E \u0446\u0432\u0435\u0442\u0443",
      "btn_add_new_word": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0435 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u043C\u043E\u0435 \u0441\u043B\u043E\u0432\u043E / \u0448\u0430\u0431\u043B\u043E\u043D",
      "style_type_text": "\u041E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435",
      "style_type_highlight": "\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430",
      "style_type_both": "\u041E\u0431\u0430",
      "word_pattern_placeholder_long": "\u0428\u0430\u0431\u043B\u043E\u043D\u044B \u0438\u043B\u0438 \u0441\u043B\u043E\u0432\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E (\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u043F\u0440\u0438\u0432\u0435\u0442, \u043C\u0438\u0440, \u0441\u043B\u043E\u0432\u043E)",
      "word_pattern_placeholder_short": "\u041A\u043B\u044E\u0447\u0435\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E \u0438\u043B\u0438 \u0448\u0430\u0431\u043B\u043E\u043D, \u0438\u043B\u0438 \u0441\u043B\u043E\u0432\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E",
      "use_regex": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C Regex",
      "flags_placeholder": "\u0424\u043B\u0430\u0433",
      "text_or_regex_placeholder": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442/regex",
      "duplicate_entry": "\u0434\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C",
      "open_in_regex_tester": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0432 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043E\u0440\u0435 Regex",
      "no_rules_configured": "\u041D\u0435\u0442 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u0430\u0432\u0438\u043B.",
      "no_rules_found": "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B.",
      // Presets
      "btn_presets": "\u041F\u0440\u0435\u0441\u0435\u0442\u044B",
      "preset_all_headings": "\u0412\u0441\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438 (H1-H6)",
      "preset_bullet_points": "\u041C\u0430\u0440\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u0441\u043F\u0438\u0441\u043A\u0438",
      "preset_numbered_lists": "\u041D\u0443\u043C\u0435\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u0441\u043F\u0438\u0441\u043A\u0438",
      "preset_task_checked": "\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u0434\u0430\u0447 (\u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E)",
      "preset_task_unchecked": "\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u0434\u0430\u0447 (\u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E)",
      "preset_dates_yyyy_mm_dd": "\u0414\u0430\u0442\u044B (YYYY-MM-DD)",
      "preset_times_am_pm": "\u0412\u0440\u0435\u043C\u044F (AM/PM)",
      "preset_dates_yyyy_mmm_dd": "\u0414\u0430\u0442\u044B (YYYY-MMM-DD)",
      "preset_relative_dates": "\u041E\u0442\u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0434\u0430\u0442\u044B",
      "preset_basic_urls": "\u041F\u0440\u043E\u0441\u0442\u044B\u0435 URL-\u0441\u0441\u044B\u043B\u043A\u0438",
      "preset_markdown_links": "Markdown-\u0441\u0441\u044B\u043B\u043A\u0438",
      "preset_domain_names": "\u0414\u043E\u043C\u0435\u043D\u043D\u044B\u0435 \u0438\u043C\u0435\u043D\u0430",
      "preset_email_addresses": "Email-\u0430\u0434\u0440\u0435\u0441\u0430",
      "preset_at_username": "@\u0418\u043C\u0435\u043D\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439",
      "preset_currency": "\u0412\u0430\u043B\u044E\u0442\u044B",
      "preset_measurements": "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F",
      "preset_phone_numbers": "\u041D\u043E\u043C\u0435\u0440\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u043E\u0432",
      "preset_all_texts": "\u0412\u0435\u0441\u044C \u0442\u0435\u043A\u0441\u0442",
      "preset_codeblocks": "\u0411\u043B\u043E\u043A\u0438 \u043A\u043E\u0434\u0430",
      "preset_inline_comments": "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 (%%\u2026%%)",
      "preset_parentheses": "\u041A\u0440\u0443\u0433\u043B\u044B\u0435 \u0441\u043A\u043E\u0431\u043A\u0438 ()",
      "preset_square_brackets": "\u041A\u0432\u0430\u0434\u0440\u0430\u0442\u043D\u044B\u0435 \u0441\u043A\u043E\u0431\u043A\u0438 []",
      "preset_curly_braces": "\u0424\u0438\u0433\u0443\u0440\u043D\u044B\u0435 \u0441\u043A\u043E\u0431\u043A\u0438 {}",
      "preset_angle_brackets": "\u0423\u0433\u043B\u043E\u0432\u044B\u0435 \u0441\u043A\u043E\u0431\u043A\u0438 <>",
      "preset_colons": "\u0414\u0432\u043E\u0435\u0442\u043E\u0447\u0438\u0435 :",
      "preset_double_quotes": "\u0414\u0432\u043E\u0439\u043D\u044B\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438",
      "preset_single_quotes": "\u041E\u0434\u0438\u043D\u0430\u0440\u043D\u044B\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438",
      "preset_single_quotes_word_bounded": "\u041E\u0434\u0438\u043D\u0430\u0440\u043D\u044B\u0435 \u043A\u0430\u0432\u044B\u0447\u043A\u0438 (\u0433\u0440\u0430\u043D\u0438\u0446\u044B \u0441\u043B\u043E\u0432\u0430)",
      "preset_group_markdown_formatting": "\u0424\u043E\u0440\u043C\u0430\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 Markdown",
      "preset_group_other_patterns": "\u0414\u0440\u0443\u0433\u0438\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B",
      "preset_group_brackets": "\u0421\u043A\u043E\u0431\u043A\u0438",
      // Blacklist Settings
      "blacklist_words_header": "\u0427\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0441\u043B\u043E\u0432",
      "blacklist_words_desc": "\u041A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0441\u043B\u043E\u0432\u0430 \u0438\u043B\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u044B \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u0441\u044E\u0434\u0430 \u041D\u0418\u041A\u041E\u0413\u0414\u0410 \u043D\u0435 \u0431\u0443\u0434\u0443\u0442 \u043E\u043A\u0440\u0430\u0448\u0435\u043D\u044B, \u0434\u0430\u0436\u0435 \u043F\u0440\u0438 \u0447\u0430\u0441\u0442\u0438\u0447\u043D\u043E\u043C \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0438.",
      "search_blacklist_placeholder": "\u041F\u043E\u0438\u0441\u043A \u0441\u043B\u043E\u0432 \u0438\u043B\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432, \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445 \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A\u2026",
      "blacklist_sort_label_last-added": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435",
      "blacklist_sort_label_a-z": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u0410-\u042F",
      "blacklist_sort_label_reverse-a-z": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u042F-\u0410",
      "btn_add_blacklist": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043B\u043E\u0432\u043E \u0438\u043B\u0438 \u0448\u0430\u0431\u043B\u043E\u043D \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      "btn_add_to_blacklist": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      "btn_add_blacklist_word": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043B\u043E\u0432\u043E \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      "btn_add_blacklist_regex": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C regex \u0432 \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      // File & Folder Rules
      "file_folder_rules_header": "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u044F \u0444\u0430\u0439\u043B\u043E\u0432 \u0438 \u043F\u0430\u043F\u043E\u043A",
      "file_folder_rules_desc": "\u0423\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435\u043C \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439 \u043F\u043E \u0438\u043C\u0435\u043D\u0430\u043C, \u0442\u043E\u0447\u043D\u044B\u0445 \u043F\u0443\u0442\u0435\u0439 \u0438\u043B\u0438 regex \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432. \u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u043E\u0435 \u043F\u043E\u043B\u0435 \u0432\u0432\u043E\u0434\u0430 \u0441 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043E\u043C \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u043F\u043E \u0432\u0441\u0435\u043C\u0443 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0443.",
      "search_file_folder_rules_placeholder": "\u041F\u043E\u0438\u0441\u043A \u043F\u0440\u0430\u0432\u0438\u043B \u0434\u043B\u044F \u0444\u0430\u0439\u043B\u043E\u0432/\u043F\u0430\u043F\u043E\u043A\u2026",
      "path_sort_label_last-added": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435",
      "path_sort_label_a-z": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u0410-\u042F",
      "path_sort_label_reverse-a-z": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u042F-\u0410",
      "path_sort_label_mode": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u0420\u0435\u0436\u0438\u043C",
      "path_sort_label_type": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u0422\u0438\u043F",
      "btn_add_file_folder_rule": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0434\u043B\u044F \u0444\u0430\u0439\u043B\u0430/\u043F\u0430\u043F\u043A\u0438",
      "disabled_files_header": "\u0424\u0430\u0439\u043B\u044B \u0441 \u043E\u0442\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u044B\u043C \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u043D\u0438\u0435\u043C:",
      // Advanced Settings - Inclusion Exclusion Labels
      "path_rule_mode_include": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
      "path_rule_mode_exclude": "\u0418\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
      "text_rule_mode_include": "\u041E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u0442\u044C \u0432 (\u0441\u043F\u0438\u0441\u043E\u043A \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0439)",
      "text_rule_mode_exclude": "\u041D\u0435 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u0442\u044C \u0432 (\u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A)",
      "mode_only_colors_in": "\u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0432",
      "mode_does_not_color_in": "\u043D\u0435 \u043E\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442 \u0432",
      "label_text_include": "\u0411\u0435\u043B\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      "label_text_exclude": "\u0427\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      "enter_path_or_pattern": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0443\u0442\u044C \u0438\u043B\u0438 \u0448\u0430\u0431\u043B\u043E\u043D",
      "label_regex": "Regex",
      // Advanced Rules
      "advanced_rules_header": "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
      "advanced_rules_modal_header": "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
      "advanced_rules_manage_button": "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u043C\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438",
      "edit_rule_header": "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
      "add_rule_header": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
      "btn_add_rule": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
      "btn_save_rule": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
      "btn_add_words": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043B\u043E\u0432\u043E",
      "btn_add_regex": "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C Regex",
      "btn_save_regex": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C Regex",
      // Regex Tester
      "regex_tester_header": "\u041A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043E\u0440 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0445 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0439",
      "regex_tester_blacklist": "\u041A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043E\u0440 regex - \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
      "regex_expression_placeholder": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
      "regex_subject_placeholder": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442...",
      "regex_name_placeholder": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 regex",
      "matches": "\u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F",
      "matches_found": "\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439",
      // Regex Flags
      "flag_g": "\u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u043B\u0430\u0433: \u043D\u0430\u0439\u0442\u0438 \u0432\u0441\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F",
      "flag_i": "\u0444\u043B\u0430\u0433 \u0431\u0435\u0437 \u0443\u0447\u0435\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430",
      "flag_m": "\u043C\u043D\u043E\u0433\u043E\u0441\u0442\u0440\u043E\u0447\u043D\u044B\u0439 \u0444\u043B\u0430\u0433: ^ \u0438 $ \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442 \u0441 \u0433\u0440\u0430\u043D\u0438\u0446\u0430\u043C\u0438 \u0441\u0442\u0440\u043E\u043A",
      "flag_s": "\u0444\u043B\u0430\u0433 dotAll: . \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 \u0440\u0430\u0437\u0440\u044B\u0432\u0430\u043C\u0438 \u0441\u0442\u0440\u043E\u043A",
      "flag_u": "\u0444\u043B\u0430\u0433 unicode: \u043E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u043A\u0430\u043A \u0442\u043E\u0447\u043A\u0438 \u043A\u043E\u0434\u0430 unicode",
      "flag_y": "\u043B\u0438\u043F\u043A\u0438\u0439 \u0444\u043B\u0430\u0433: \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0441 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 lastIndex",
      // Data Export/Import
      "data_export_import_header": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442/\u0418\u043C\u043F\u043E\u0440\u0442 \u0434\u0430\u043D\u043D\u044B\u0445",
      "export_plugin_data": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043B\u0430\u0433\u0438\u043D\u0430",
      "export_plugin_data_desc": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438, \u0441\u043B\u043E\u0432\u0430 \u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u044B \u0432 \u0444\u0430\u0439\u043B JSON.",
      "btn_export": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442",
      "import_plugin_data": "\u0418\u043C\u043F\u043E\u0440\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043B\u0430\u0433\u0438\u043D\u0430",
      "import_plugin_data_desc": "\u0418\u043C\u043F\u043E\u0440\u0442 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0438\u0437 JSON \u0444\u0430\u0439\u043B\u0430",
      "btn_import": "\u0418\u043C\u043F\u043E\u0440\u0442"
    };
  }
});

// src/i18n/zh_cn.js
var require_zh_cn = __commonJS({
  "src/i18n/zh_cn.js"(exports2, module2) {
    module2.exports = {
      // Plugin Metadata & Basic Labels
      "__name": "\u7B80\u4F53\u4E2D\u6587",
      "settings_title": "\u6587\u5B57\u81EA\u52A8\u7740\u8272\u8BBE\u7F6E",
      "header_plugin_name": "\u6587\u5B57\u81EA\u52A8\u7740\u8272",
      "ribbon_title": "\u6587\u5B57\u81EA\u52A8\u7740\u8272",
      // Language Settings
      "language_label": "\u8BED\u8A00",
      "language_desc": "\u9009\u62E9\u63D2\u4EF6\u4F7F\u7528\u7684\u8BED\u8A00",
      "language_en": "\u82F1\u8BED",
      "language_es": "\u897F\u73ED\u7259\u8BED",
      "language_fr": "\u6CD5\u8BED",
      "language_eu": "\u5DF4\u65AF\u514B\u8BED",
      "language_ru": "\u4FC4\u8BED",
      "language_auto": "\u7CFB\u7EDF\u9ED8\u8BA4",
      // Release Notes
      "latest_release_notes_label": "\u6700\u65B0\u53D1\u5E03\u8BF4\u660E",
      "latest_release_notes_desc": "\u67E5\u770B\u63D2\u4EF6\u7684\u6700\u65B0\u53D1\u5E03\u8BF4\u660E",
      "open_changelog_button": "\u6253\u5F00\u66F4\u65B0\u65E5\u5FD7",
      "command_show_release_notes": "\u663E\u793A\u6700\u65B0\u53D1\u5E03\u8BF4\u660E",
      "changelog_view_on_github": "\u5728GitHub\u4E0A\u67E5\u770B",
      "changelog_loading": "\u52A0\u8F7D\u53D1\u5E03\u2026",
      "changelog_no_info": "\u6CA1\u6709\u53EF\u7528\u7684\u53D1\u5E03\u4FE1\u606F\u3002",
      "changelog_release": "\u53D1\u5E03",
      "changelog_no_notes": "\u6CA1\u6709\u8BF4\u660E",
      "changelog_failed_to_load": "\u52A0\u8F7D\u53D1\u5E03\u8BF4\u660E\u5931\u8D25\u3002",
      // UI Elements & Menus
      "file_menu_enable": "\u4E3A\u6B64\u6587\u4EF6\u542F\u7528\u6587\u5B57\u81EA\u52A8\u7740\u8272",
      "file_menu_disable": "\u4E3A\u6B64\u6587\u4EF6\u7981\u7528\u6587\u5B57\u81EA\u52A8\u7740\u8272",
      "menu_color_once": "\u7740\u8272\u4E00\u6B21",
      "menu_highlight_once": "\u9AD8\u4EAE\u4E00\u6B21",
      "menu_always_color_text": "\u6587\u5B57\u81EA\u52A8\u7740\u8272",
      "menu_remove_always_color_text": "\u79FB\u9664\u6587\u5B57\u81EA\u52A8\u7740\u8272",
      "menu_blacklist_word": "\u5C06\u5355\u8BCD\u52A0\u5165\u7740\u8272\u9ED1\u540D\u5355",
      "show_toggle_statusbar": "\u5728\u72B6\u6001\u680F\u663E\u793A\u5207\u6362\u6309\u94AE",
      "show_toggle_ribbon": "\u5728\u529F\u80FD\u533A\u663E\u793A\u5207\u6362\u56FE\u6807",
      "show_toggle_command": "\u5728\u547D\u4EE4\u4E2D\u663E\u793A\u5207\u6362",
      "show_blacklist_menu": "\u5728\u53F3\u952E\u83DC\u5355\u4E2D\u663E\u793A\u9ED1\u540D\u5355\u5355\u8BCD",
      "show_blacklist_menu_desc": "\u6DFB\u52A0\u53F3\u952E\u83DC\u5355\u9879\uFF0C\u5C06\u9009\u4E2D\u7684\u6587\u5B57\u52A0\u5165\u7740\u8272\u9ED1\u540D\u5355\u3002",
      "tooltip_enable_for_file": "\u4E3A\u6B64\u6587\u4EF6\u542F\u7528",
      "tooltip_delete_all_words": "\u5220\u9664\u6240\u6709\u5DF2\u5B9A\u4E49\u7684\u5355\u8BCD/\u6A21\u5F0F",
      "tooltip_delete_all_blacklist": "\u5220\u9664\u6240\u6709\u9ED1\u540D\u5355\u5355\u8BCD/\u6A21\u5F0F",
      "tooltip_use_regex": "\u4F5C\u4E3A\u6B63\u5219\u8868\u8FBE\u5F0F\u6A21\u5F0F\u4F7F\u7528",
      "drag_to_reorder": "\u62D6\u52A8\u4EE5\u91CD\u65B0\u6392\u5E8F",
      "reset_text_color": "\u91CD\u7F6E\u6587\u672C\u989C\u8272",
      "reset_highlight": "\u91CD\u7F6E\u9AD8\u4EAE",
      // Commands
      "command_color_selected": "\u7740\u8272\u9009\u4E2D\u6587\u5B57",
      "command_toggle_current": "\u542F\u7528/\u7981\u7528\u5F53\u524D\u6587\u6863\u7740\u8272",
      "command_toggle_global": "\u542F\u7528/\u7981\u7528\u6587\u5B57\u81EA\u52A8\u7740\u8272",
      "command_manage_advanced_rules": "\u7BA1\u7406\u9AD8\u7EA7\u89C4\u5219",
      "command_open_regex_tester": "\u6DFB\u52A0\u6B63\u5219\u8868\u8FBE\u5F0F\uFF08\u6253\u5F00\u6B63\u5219\u8868\u8FBE\u5F0F\u6D4B\u8BD5\u5668\uFF09",
      "command_open_blacklist_regex_tester": "\u6DFB\u52A0\u9ED1\u540D\u5355\u6B63\u5219\u8868\u8FBE\u5F0F",
      "command_manage_colored_texts": "\u7BA1\u7406\u5DF2\u7740\u8272\u7684\u6587\u672C",
      "command_toggle_hide_text_colors": "\u9690\u85CF/\u663E\u793A\u6587\u672C\u989C\u8272",
      "command_toggle_hide_highlights": "\u9690\u85CF/\u663E\u793A\u9AD8\u4EAE",
      // Notifications
      "notice_enabled": "\u6587\u5B57\u81EA\u52A8\u7740\u8272\u5DF2\u542F\u7528",
      "notice_disabled": "\u6587\u5B57\u81EA\u52A8\u7740\u8272\u5DF2\u7981\u7528",
      "notice_blacklisted_cannot_color": '"{word}" \u5DF2\u52A0\u5165\u9ED1\u540D\u5355\uFF0C\u65E0\u6CD5\u7740\u8272\u3002',
      "notice_removed_always_color": '\u5DF2\u79FB\u9664 "{word}" \u7684\u81EA\u52A8\u7740\u8272\u3002',
      "notice_added_to_blacklist": '"{word}" \u5DF2\u52A0\u5165\u9ED1\u540D\u5355\u3002',
      "notice_already_blacklisted": '"{word}" \u5DF2\u5728\u9ED1\u540D\u5355\u4E2D\u3002',
      "notice_select_text_first": "\u8BF7\u5148\u9009\u62E9\u4E00\u4E9B\u6587\u5B57\u3002",
      "notice_no_active_file": "\u6CA1\u6709\u6D3B\u52A8\u6587\u4EF6\u53EF\u5207\u6362\u7740\u8272\u3002",
      "notice_coloring_enabled_for_path": "\u5DF2\u4E3A {path} \u542F\u7528\u7740\u8272",
      "notice_coloring_disabled_for_path": "\u5DF2\u4E3A {path} \u7981\u7528\u7740\u8272",
      "notice_global_enabled": "\u6587\u5B57\u81EA\u52A8\u7740\u8272\u5DF2\u542F\u7528",
      "notice_global_disabled": "\u6587\u5B57\u81EA\u52A8\u7740\u8272\u5DF2\u7981\u7528",
      "notice_unable_open_changelog": "\u65E0\u6CD5\u6253\u5F00\u66F4\u65B0\u65E5\u5FD7\u7A97\u53E3\u3002",
      "notice_pattern_blocked": "\u6A21\u5F0F\u56E0\u5185\u5B58\u5B89\u5168\u88AB\u963B\u6B62:",
      "notice_pattern_too_complex": "\u6A21\u5F0F\u8FC7\u4E8E\u590D\u6742:",
      "notice_invalid_hex_format": "\u65E0\u6548\u7684\u5341\u516D\u8FDB\u5236\u989C\u8272\u683C\u5F0F\u3002\u4F7F\u7528 #RRGGBB \u6216 #RGB\u3002",
      "notice_error_saving_changes": "\u4FDD\u5B58\u66F4\u6539\u65F6\u51FA\u9519\u3002\u8BF7\u91CD\u8BD5\u3002",
      "notice_invalid_color_format": "\u65E0\u6548\u7684\u989C\u8272\u683C\u5F0F\u3002",
      "notice_exported": "\u5DF2\u5BFC\u51FA: {fname}",
      "notice_export_failed": "\u5BFC\u51FA\u5931\u8D25",
      "notice_import_completed": "\u5BFC\u5165\u5B8C\u6210",
      "notice_import_failed": "\u5BFC\u5165\u5931\u8D25",
      "notice_invalid_regex": "\u65E0\u6548\u7684\u6B63\u5219\u8868\u8FBE\u5F0F",
      "notice_empty_pattern": "\u6A21\u5F0F\u4E3A\u7A7A",
      "notice_added_regex": "\u6B63\u5219\u8868\u8FBE\u5F0F\u5DF2\u6DFB\u52A0",
      "notice_rule_updated": "\u89C4\u5219\u5DF2\u66F4\u65B0",
      "notice_regex_updated": "\u6B63\u5219\u8868\u8FBE\u5F0F\u5DF2\u66F4\u65B0",
      "notice_entry_updated": "\u6761\u76EE\u5DF2\u66F4\u65B0",
      "notice_entry_duplicated": "\u6761\u76EE\u5DF2\u91CD\u590D",
      "notice_error_opening_regex_tester": "\u6253\u5F00\u6B63\u5219\u8868\u8FBE\u5F0F\u6D4B\u8BD5\u5668\u51FA\u9519",
      "notice_error_opening_blacklist_regex_tester": "\u6253\u5F00\u9ED1\u540D\u5355\u6B63\u5219\u8868\u8FBE\u5F0F\u6D4B\u8BD5\u5668\u51FA\u9519",
      "notice_error_opening_advanced_rules": "\u6253\u5F00\u9AD8\u7EA7\u89C4\u5219\u6A21\u6001\u6846\u51FA\u9519",
      "notice_text_color_reset": "\u6587\u672C\u989C\u8272\u5DF2\u91CD\u7F6E",
      "notice_highlight_reset": "\u9AD8\u4EAE\u5DF2\u91CD\u7F6E",
      "notice_text_colors_hidden": "\u6587\u672C\u989C\u8272\u5DF2\u9690\u85CF",
      "notice_text_colors_visible": "\u6587\u672C\u989C\u8272\u53EF\u89C1",
      "notice_highlights_hidden": "\u9AD8\u4EAE\u5DF2\u9690\u85CF",
      "notice_highlights_visible": "\u9AD8\u4EAE\u53EF\u89C1",
      "notice_regex_support_disabled": "\u6B63\u5219\u8868\u8FBE\u5F0F\u652F\u6301\u5DF2\u7981\u7528\u3002\u5728\u8BBE\u7F6E\u4E2D\u542F\u7528\u5B83\u4EE5\u4F7F\u7528\u6B63\u5219\u8868\u8FBE\u5F0F\u6A21\u5F0F\u3002",
      "notice_no_active_file_to_disable": "\u6CA1\u6709\u6D3B\u52A8\u6587\u4EF6\u53EF\u7981\u7528\u7740\u8272\u3002",
      "notice_already_disabled_for_path": "\u5DF2\u4E3A {path} \u7981\u7528\u7740\u8272",
      "notice_filter_disabled": "\u7B5B\u9009\u5668\u5DF2\u7981\u7528",
      // Confirmation Dialogs
      "confirm_delete_all_title": "\u5220\u9664\u6240\u6709\u5355\u8BCD",
      "confirm_delete_all_desc": "\u60A8\u786E\u5B9A\u8981\u5220\u9664\u6240\u6709\u5DF2\u7740\u8272\u7684\u5355\u8BCD/\u6A21\u5F0F\u5417\uFF1F\u6B64\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\uFF01",
      "confirm_delete_all_blacklist_title": "\u5220\u9664\u6240\u6709\u9ED1\u540D\u5355\u5355\u8BCD",
      "confirm_delete_all_blacklist_desc": "\u60A8\u786E\u5B9A\u8981\u5220\u9664\u6240\u6709\u9ED1\u540D\u5355\u6761\u76EE\u5417\uFF1F\u6B64\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\uFF01",
      "restart_required_title": "\u9700\u8981\u91CD\u542F",
      "restart_required_desc": "\u7981\u7528\u547D\u4EE4\u9762\u677F\u5207\u6362\u9700\u8981\u91CD\u542FObsidian\u624D\u80FD\u5B8C\u5168\u4ECE\u9762\u677F\u4E2D\u79FB\u9664\u547D\u4EE4\u3002\u73B0\u5728\u91CD\u542F\uFF1F",
      // Basic Settings
      "enable_document_color": "\u542F\u7528\u6587\u6863\u989C\u8272",
      "color_in_reading_mode": "\u5728\u9605\u8BFB\u6A21\u5F0F\u4E2D\u7740\u8272",
      "force_full_render_reading": "\u5728\u9605\u8BFB\u6A21\u5F0F\u4E2D\u5F3A\u5236\u5B8C\u5168\u6E32\u67D3",
      "force_full_render_reading_desc": "\u5F00\u542F\u65F6\uFF0C\u9605\u8BFB\u6A21\u5F0F\u5C06\u5C1D\u8BD5\u4E00\u6B21\u6027\u4E3A\u6574\u4E2A\u6587\u6863\u7740\u8272\u3002\u5728\u5927\u578B\u6587\u6863\u4E0A\u53EF\u80FD\u4F1A\u5BFC\u81F4\u6027\u80FD\u95EE\u9898\uFF0C\u8BF7\u8C28\u614E\u4F7F\u7528\uFF01",
      "disable_coloring_current_file": "\u7981\u7528\u5F53\u524D\u6587\u4EF6\u7684\u7740\u8272",
      "disable_coloring_current_file_desc": "\u5728\u6587\u4EF6\u548C\u6587\u4EF6\u5939\u7740\u8272\u89C4\u5219\u4E0B\u4E3A\u6D3B\u52A8\u6587\u4EF6\u6DFB\u52A0\u6392\u9664\u89C4\u5219\u3002",
      "btn_disable_for_this_file": "\u4E3A\u6B64\u6587\u4EF6\u7981\u7528",
      // Coloring Settings
      "coloring_settings_header": "\u7740\u8272\u8BBE\u7F6E",
      "regex_support": "\u6B63\u5219\u8868\u8FBE\u5F0F\u652F\u6301",
      "regex_support_desc": "\u5141\u8BB8\u6A21\u5F0F\u4E3A\u6B63\u5219\u8868\u8FBE\u5F0F\u3002\u4E3A\u5B89\u5168\u8D77\u89C1\uFF0C\u65E0\u6548\u7684\u6B63\u5219\u8868\u8FBE\u5F0F\u5C06\u88AB\u5FFD\u7565\u3002",
      "disable_regex_safety": "\u7981\u7528\u6B63\u5219\u8868\u8FBE\u5F0F\u5B89\u5168\u68C0\u67E5",
      "disable_regex_safety_desc": "\u5141\u8BB8\u590D\u6742\u6216\u6F5C\u5728\u5371\u9669\u7684\u8868\u8FBE\u5F0F\u3002\u53EF\u80FD\u4F1A\u5BFC\u81F4\u6027\u80FD\u95EE\u9898\u6216\u51BB\u7ED3\u3002",
      "case_sensitive": "\u533A\u5206\u5927\u5C0F\u5199",
      "case_sensitive_desc": '\u5982\u679C\u5F00\u542F\u6B64\u9879\uFF0C"word" \u548C "Word" \u5C06\u88AB\u89C6\u4E3A\u4E0D\u540C\u3002\u5982\u679C\u5173\u95ED\uFF0C\u5219\u5B83\u4EEC\u4F1A\u88AB\u7740\u6210\u76F8\u540C\u989C\u8272\u3002',
      "partial_match": "\u90E8\u5206\u5339\u914D",
      "partial_match_desc": '\u5982\u679C\u542F\u7528\uFF0C\u53EA\u8981\u5728\u5355\u8BCD\u4E2D\u627E\u5230\u4EFB\u4F55\u5DF2\u7740\u8272\u7684\u5355\u8BCD\uFF0C\u6574\u4E2A\u5355\u8BCD\u90FD\u4F1A\u88AB\u7740\u8272\uFF08\u4F8B\u5982\uFF0C"as" \u4F1A\u7740\u8272 "Jasper"\uFF09\u3002',
      // One-Time Actions
      "one_time_actions_header": "\u4E00\u6B21\u6027\u64CD\u4F5C",
      "setting_color_once": "\u7740\u8272\u4E00\u6B21",
      "setting_color_once_desc": "\u4E3A\u9009\u4E2D\u7684\u6587\u5B57\u63D2\u5165HTML\u5185\u8054\u6837\u5F0F\u3002\u5373\u4F7F\u63D2\u4EF6\u5173\u95ED\uFF0C\u8FD9\u4E5F\u4F1A\u4FDD\u7559\u3002",
      "setting_highlight_once": "\u9AD8\u4EAE\u4E00\u6B21",
      "setting_highlight_once_desc": "\u63D2\u5165\u5E26\u6709\u80CC\u666F\u6837\u5F0F\u7684HTML\u5185\u8054\u6837\u5F0F\u3002\u5373\u4F7F\u63D2\u4EF6\u5173\u95ED\uFF0C\u8FD9\u4E5F\u4F1A\u4FDD\u7559\u3002",
      "highlight_once_preview": "\u9AD8\u4EAE\u4E00\u6B21\u9884\u89C8",
      "highlight_once_preview_text": "\u8FD9\u5C31\u662F\u9AD8\u4EAE\u4E00\u6B21\u7684\u6548\u679C\uFF01",
      // Highlight Once Settings
      "highlight_once_opacity": "\u9AD8\u4EAE\u4E00\u6B21\u900F\u660E\u5EA6",
      "highlight_once_border_radius": "\u9AD8\u4EAE\u4E00\u6B21\u8FB9\u6846\u5706\u89D2 (px)",
      "reset_to_8": "\u91CD\u7F6E\u4E3A8",
      "highlight_horizontal_padding": "\u9AD8\u4EAE\u6C34\u5E73\u5185\u8FB9\u8DDD (px)",
      "reset_to_4": "\u91CD\u7F6E\u4E3A4",
      "enable_border_highlight_once": "\u4E3A\u9AD8\u4EAE\u4E00\u6B21\u542F\u7528\u8FB9\u6846",
      "enable_border_highlight_once_desc": "\u4E3A\u5185\u8054\u9AD8\u4EAE\u6DFB\u52A0\u8FB9\u6846\u3002\u6DFB\u52A0\u7684HTML/CSS\u4F1A\u5F88\u957F\u3002",
      "highlight_once_border_style": "\u9AD8\u4EAE\u4E00\u6B21\u8FB9\u6846\u6837\u5F0F",
      "opt_border_full": "\u5B8C\u6574\u8FB9\u6846\uFF08\u6240\u6709\u8FB9\uFF09",
      "opt_border_top_bottom": "\u4E0A\u4E0B\u8FB9\u6846",
      "opt_border_left_right": "\u5DE6\u53F3\u8FB9\u6846",
      "opt_border_top_right": "\u53F3\u4E0A\u8FB9\u6846",
      "opt_border_top_left": "\u5DE6\u4E0A\u8FB9\u6846",
      "opt_border_bottom_right": "\u53F3\u4E0B\u8FB9\u6846",
      "opt_border_bottom_left": "\u5DE6\u4E0B\u8FB9\u6846",
      "opt_border_top": "\u4EC5\u4E0A\u8FB9\u6846",
      "opt_border_bottom": "\u4EC5\u4E0B\u8FB9\u6846",
      "opt_border_left": "\u4EC5\u5DE6\u8FB9\u6846",
      "opt_border_right": "\u4EC5\u53F3\u8FB9\u6846",
      "highlight_once_border_opacity": "\u9AD8\u4EAE\u4E00\u6B21\u8FB9\u6846\u900F\u660E\u5EA6",
      "highlight_once_border_thickness": "\u9AD8\u4EAE\u4E00\u6B21\u8FB9\u6846\u539A\u5EA6 (px)",
      "reset_to_1": "\u91CD\u7F6E\u4E3A1",
      "use_global_highlight_style": "\u4E3A\u9AD8\u4EAE\u4E00\u6B21\u4F7F\u7528\u5168\u5C40\u9AD8\u4EAE\u6837\u5F0F",
      "use_global_highlight_style_desc": "\u4F7F\u7528\u60A8\u7684\u5168\u5C40\u5185\u8054\u6837\u5F0F\u3002\u6DFB\u52A0\u7684HTML/CSS\u53EF\u80FD\u4F1A\u5F88\u957F\u3002",
      "style_highlight_once": "\u6837\u5F0F\u9AD8\u4EAE\u4E00\u6B21",
      "style_highlight_once_desc": "\u4F7F\u7528\u60A8\u7684\u81EA\u5B9A\u4E49\u5185\u8054\u6837\u5F0F\u3002\u6DFB\u52A0\u7684HTML/CSS\u53EF\u80FD\u4F1A\u5F88\u957F\u3002",
      // Global Highlight Appearance
      "global_highlight_appearance_header": "\u5168\u5C40\u9AD8\u4EAE\u7740\u8272\u5916\u89C2",
      "highlight_opacity": "\u9AD8\u4EAE\u900F\u660E\u5EA6",
      "highlight_opacity_desc": "\u8BBE\u7F6E\u9AD8\u4EAE\u7684\u900F\u660E\u5EA6 (0-100%)",
      "highlight_border_radius": "\u9AD8\u4EAE\u8FB9\u6846\u5706\u89D2 (px)",
      "highlight_border_radius_desc": "\u8BBE\u7F6E\u9AD8\u4EAE\u5706\u89D2\u7684\u8FB9\u6846\u534A\u5F84\uFF08\u4EE5px\u4E3A\u5355\u4F4D\uFF09",
      "highlight_horizontal_padding_desc": "\u8BBE\u7F6E\u9AD8\u4EAE\u6587\u5B57\u7684\u5DE6\u53F3\u5185\u8FB9\u8DDD\uFF08\u4EE5px\u4E3A\u5355\u4F4D\uFF09",
      "rounded_corners_wrapping": "\u6362\u884C\u65F6\u7684\u5706\u89D2",
      "rounded_corners_wrapping_desc": "\u542F\u7528\u65F6\uFF0C\u5373\u4F7F\u6587\u5B57\u6362\u884C\u5230\u65B0\u884C\uFF0C\u9AD8\u4EAE\u4E5F\u4F1A\u5728\u6240\u6709\u8FB9\u4E0A\u90FD\u6709\u5706\u89D2\u3002",
      "enable_highlight_border": "\u542F\u7528\u9AD8\u4EAE\u8FB9\u6846",
      "enable_highlight_border_desc": "\u5728\u9AD8\u4EAE\u5468\u56F4\u6DFB\u52A0\u8FB9\u6846\u3002\u8FB9\u6846\u5C06\u5339\u914D\u6587\u5B57\u6216\u9AD8\u4EAE\u989C\u8272\u3002",
      "border_style": "\u8FB9\u6846\u6837\u5F0F",
      "border_style_desc": "\u9009\u62E9\u8981\u5E94\u7528\u8FB9\u6846\u7684\u8FB9",
      "border_opacity": "\u8FB9\u6846\u900F\u660E\u5EA6",
      "border_opacity_desc": "\u8BBE\u7F6E\u8FB9\u6846\u7684\u900F\u660E\u5EA6 (0-100%)",
      "border_thickness": "\u8FB9\u6846\u539A\u5EA6 (px)",
      "border_thickness_desc": "\u8BBE\u7F6E\u8FB9\u6846\u539A\u5EA6\u4ECE0-5\u50CF\u7D20\uFF08\u4F8B\u59821, 2.5, 5\uFF09",
      "highlight_preview": "\u9AD8\u4EAE\u9884\u89C8",
      "highlight_preview_text": "\u8FD9\u5C31\u662F\u60A8\u7684\u9AD8\u4EAE\u6548\u679C\uFF01",
      // Color Swatches
      "color_swatches_header": "\u989C\u8272\u8272\u677F",
      "color_picker_layout": "\u989C\u8272\u9009\u62E9\u5668\u5E03\u5C40",
      "color_picker_layout_desc": "\u9009\u62E9\u4E3A\u6587\u5B57\u9009\u62E9\u989C\u8272\u65F6\u663E\u793A\u7684\u989C\u8272\u7C7B\u578B",
      "opt_both_text_left": "\u4E24\u8005\uFF1A\u6587\u5B57\u5DE6\uFF0C\u9AD8\u4EAE\u53F3",
      "opt_both_bg_left": "\u4E24\u8005\uFF1A\u9AD8\u4EAE\u5DE6\uFF0C\u6587\u5B57\u53F3",
      "opt_text_only": "\u4EC5\u6587\u5B57\u989C\u8272",
      "opt_background_only": "\u4EC5\u9AD8\u4EAE\u989C\u8272",
      "replace_default_swatches": "\u66FF\u6362\u9ED8\u8BA4\u8272\u677F",
      "replace_default_swatches_desc": "\u5982\u679C\u5F00\u542F\u6B64\u9879\uFF0C\u989C\u8272\u9009\u62E9\u5668\u4E2D\u53EA\u4F1A\u663E\u793A\u60A8\u7684\u81EA\u5B9A\u4E49\u989C\u8272\uFF0C\u4E0D\u4F1A\u663E\u793A\u9ED8\u8BA4\u989C\u8272\uFF01",
      "enable_custom_swatches": "\u542F\u7528\u81EA\u5B9A\u4E49\u8272\u677F",
      "enable_custom_swatches_desc": "\u5F00\u542F\u540E\uFF0C\u60A8\u7684\u81EA\u5B9A\u4E49\u8272\u677F\u4F1A\u5728\u989C\u8272\u9009\u62E9\u5668\u4E2D\u663E\u793A\u3002",
      "use_swatch_names": "\u4F7F\u7528\u8272\u677F\u540D\u79F0\u7740\u8272\u6587\u5B57",
      "use_swatch_names_desc": "\u5728\u5355\u8BCD/\u6A21\u5F0F\u8F93\u5165\u6846\u65C1\u663E\u793A\u8272\u677F\u540D\u79F0\u4E0B\u62C9\u83DC\u5355",
      "default_colors_header": "\u9ED8\u8BA4\u989C\u8272",
      "custom_swatches_header": "\u81EA\u5B9A\u4E49\u8272\u677F",
      "btn_add_color": "+ \u6DFB\u52A0\u989C\u8272",
      "no_custom_swatches_yet": '\u8FD8\u6CA1\u6709\u81EA\u5B9A\u4E49\u8272\u677F\u3002\u70B9\u51FB "+ \u6DFB\u52A0\u989C\u8272" \u521B\u5EFA\u4E00\u4E2A\u3002',
      "label_built_in": "(\u5185\u7F6E)",
      // Color Picker
      "pick_color_header": "\u9009\u62E9\u989C\u8272",
      "selected_text_preview": "\u9009\u4E2D\u6587\u5B57",
      "text_color_title": "\u6587\u5B57\u989C\u8272",
      "select_swatch": "\u9009\u62E9\u8272\u677F\u2026",
      "highlight_color_title": "\u9AD8\u4EAE\u989C\u8272",
      "select_highlight_swatch": "\u9009\u62E9\u9AD8\u4EAE\u8272\u677F\u2026",
      // Always Colored Texts
      "always_colored_texts_header": "\u59CB\u7EC8\u7740\u8272\u7684\u6587\u5B57",
      "always_colored_texts_desc": "\u8FD9\u91CC\u662F\u7BA1\u7406\u60A8\u7684\u5355\u8BCD/\u6A21\u5F0F\u53CA\u5176\u989C\u8272\u7684\u5730\u65B9\u3002",
      "search_colored_words_placeholder": "\u641C\u7D22\u5DF2\u7740\u8272\u7684\u5355\u8BCD/\u6A21\u5F0F\u2026",
      "sort_label_last-added": "\u6392\u5E8F\uFF1A\u6700\u540E\u6DFB\u52A0",
      "sort_label_a-z": "\u6392\u5E8F\uFF1AA-Z",
      "sort_label_reverse-a-z": "\u6392\u5E8F\uFF1AZ-A",
      "sort_label_style-order": "\u6392\u5E8F\uFF1A\u6837\u5F0F\u987A\u5E8F",
      "sort_label_color": "\u6392\u5E8F\uFF1A\u989C\u8272",
      "btn_add_new_word": "+ \u6DFB\u52A0\u65B0\u7684\u7740\u8272\u5355\u8BCD / \u6A21\u5F0F",
      "style_type_text": "\u989C\u8272",
      "style_type_highlight": "\u9AD8\u4EAE",
      "style_type_both": "\u4E24\u8005",
      "word_pattern_placeholder_long": "\u6A21\u5F0F\u3001\u5355\u8BCD\u6216\u9017\u53F7\u5206\u9694\u7684\u5355\u8BCD\uFF08\u4F8B\u5982 hello, world, foo\uFF09",
      "word_pattern_placeholder_short": "\u5173\u952E\u8BCD\u6216\u6A21\u5F0F\uFF0C\u6216\u9017\u53F7\u5206\u9694\u7684\u5355\u8BCD",
      "use_regex": "\u4F7F\u7528\u6B63\u5219\u8868\u8FBE\u5F0F",
      "flags_placeholder": "\u6807\u5FD7",
      "text_or_regex_placeholder": "\u6587\u672C/\u6B63\u5219\u8868\u8FBE\u5F0F\u8F93\u5165",
      "duplicate_entry": "\u91CD\u590D\u6761\u76EE",
      "open_in_regex_tester": "\u5728\u6B63\u5219\u8868\u8FBE\u5F0F\u6D4B\u8BD5\u5668\u4E2D\u6253\u5F00",
      "no_rules_configured": "\u6CA1\u6709\u914D\u7F6E\u89C4\u5219\u3002",
      "no_rules_found": "\u672A\u627E\u5230\u89C4\u5219\u3002",
      // Presets
      "btn_presets": "\u9884\u8BBE",
      "preset_all_headings": "\u6240\u6709\u6807\u9898\uFF08H1-H6\uFF09",
      "preset_bullet_points": "\u9879\u76EE\u7B26\u53F7\u5217\u8868",
      "preset_numbered_lists": "\u6709\u5E8F\u5217\u8868",
      "preset_task_checked": "\u4EFB\u52A1\u5217\u8868\uFF08\u5DF2\u68C0\u67E5\uFF09",
      "preset_task_unchecked": "\u4EFB\u52A1\u5217\u8868\uFF08\u672A\u68C0\u67E5\uFF09",
      "preset_dates_yyyy_mm_dd": "\u65E5\u671F\uFF08YYYY-MM-DD\uFF09",
      "preset_times_am_pm": "\u65F6\u95F4\uFF08AM/PM\uFF09",
      "preset_dates_yyyy_mmm_dd": "\u65E5\u671F\uFF08YYYY-MMM-DD\uFF09",
      "preset_relative_dates": "\u76F8\u5BF9\u65E5\u671F",
      "preset_basic_urls": "\u57FA\u7840 URL",
      "preset_markdown_links": "Markdown \u94FE\u63A5",
      "preset_domain_names": "\u57DF\u540D",
      "preset_email_addresses": "\u7535\u5B50\u90AE\u7BB1\u5730\u5740",
      "preset_at_username": "@\u7528\u6237\u540D",
      "preset_currency": "\u8D27\u5E01",
      "preset_measurements": "\u5EA6\u91CF\u503C",
      "preset_phone_numbers": "\u7535\u8BDD\u53F7\u7801",
      "preset_all_texts": "\u6240\u6709\u6587\u672C",
      "preset_codeblocks": "\u4EE3\u7801\u5757",
      "preset_inline_comments": "\u6CE8\u91CA (%%\u2026%%)",
      "preset_parentheses": "\u5706\u62EC\u53F7 ()",
      "preset_square_brackets": "\u65B9\u62EC\u53F7 []",
      "preset_curly_braces": "\u82B1\u62EC\u53F7 {}",
      "preset_angle_brackets": "\u5C16\u62EC\u53F7 <>",
      "preset_colons": "\u5192\u53F7 :",
      "preset_double_quotes": "\u53CC\u5F15\u53F7",
      "preset_single_quotes": "\u5355\u5F15\u53F7",
      "preset_single_quotes_word_bounded": "\u5355\u5F15\u53F7\uFF08\u5355\u8BCD\u8FB9\u754C\uFF09",
      "preset_group_markdown_formatting": "\u6807\u8BB0\u683C\u5F0F\u5316",
      "preset_group_other_patterns": "\u5176\u4ED6\u6A21\u5F0F",
      "preset_group_brackets": "\u62EC\u53F7",
      // Blacklist Settings
      "blacklist_words_header": "\u9ED1\u540D\u5355\u5355\u8BCD",
      "blacklist_words_desc": "\u8FD9\u91CC\u7684\u5173\u952E\u8BCD\u6216\u6A21\u5F0F\u6C38\u8FDC\u4E0D\u4F1A\u88AB\u7740\u8272\uFF0C\u5373\u4F7F\u662F\u90E8\u5206\u5339\u914D\u3002",
      "search_blacklist_placeholder": "\u641C\u7D22\u9ED1\u540D\u5355\u5355\u8BCD\u6216\u6A21\u5F0F\u2026",
      "blacklist_sort_label_last-added": "\u6392\u5E8F\uFF1A\u6700\u540E\u6DFB\u52A0",
      "blacklist_sort_label_a-z": "\u6392\u5E8F\uFF1AA-Z",
      "blacklist_sort_label_reverse-a-z": "\u6392\u5E8F\uFF1AZ-A",
      "btn_add_blacklist": "+ \u6DFB\u52A0\u9ED1\u540D\u5355\u5355\u8BCD\u6216\u6A21\u5F0F",
      "btn_add_to_blacklist": "+ \u6DFB\u52A0\u5230\u9ED1\u540D\u5355",
      "btn_add_blacklist_word": "+ \u6DFB\u52A0\u9ED1\u540D\u5355\u5355\u8BCD",
      "btn_add_blacklist_regex": "+ \u6DFB\u52A0\u9ED1\u540D\u5355\u6B63\u5219\u8868\u8FBE\u5F0F",
      // File & Folder Rules
      "file_folder_rules_header": "\u6587\u4EF6\u548C\u6587\u4EF6\u5939\u7740\u8272\u89C4\u5219",
      "file_folder_rules_desc": "\u901A\u8FC7\u540D\u79F0\u5339\u914D\u3001\u7CBE\u786E\u8DEF\u5F84\u6216\u6B63\u5219\u8868\u8FBE\u5F0F\u6A21\u5F0F\u63A7\u5236\u7740\u8272\u3002\u7559\u7A7A\u6392\u9664\u6761\u76EE\u4EE5\u5728\u6574\u4E2A\u5E93\u4E2D\u7981\u7528\u7740\u8272\u3002",
      "search_file_folder_rules_placeholder": "\u641C\u7D22\u6587\u4EF6/\u6587\u4EF6\u5939\u89C4\u5219\u2026",
      "path_sort_label_last-added": "\u6392\u5E8F\uFF1A\u6700\u540E\u6DFB\u52A0",
      "path_sort_label_a-z": "\u6392\u5E8F\uFF1AA-Z",
      "path_sort_label_reverse-a-z": "\u6392\u5E8F\uFF1AZ-A",
      "path_sort_label_mode": "\u6392\u5E8F\uFF1A\u6A21\u5F0F",
      "path_sort_label_type": "\u6392\u5E8F\uFF1A\u7C7B\u578B",
      "btn_add_file_folder_rule": "+ \u6DFB\u52A0\u6587\u4EF6/\u6587\u4EF6\u5939\u89C4\u5219",
      "disabled_files_header": "\u5DF2\u7981\u7528\u7740\u8272\u7684\u6587\u4EF6:",
      // Advanced Settings - Inclusion Exclusion Labels
      "path_rule_mode_include": "\u5305\u542B",
      "path_rule_mode_exclude": "\u6392\u9664",
      "text_rule_mode_include": "\u4EC5\u5728\uFF08\u767D\u540D\u5355\uFF09\u4E2D\u7740\u8272",
      "text_rule_mode_exclude": "\u4E0D\u5728\uFF08\u9ED1\u540D\u5355\uFF09\u4E2D\u7740\u8272",
      "mode_only_colors_in": "\u4EC5\u5728\u5176\u4E2D\u7740\u8272",
      "mode_does_not_color_in": "\u4E0D\u5728\u5176\u4E2D\u7740\u8272",
      "label_text_include": "\u767D\u540D\u5355",
      "label_text_exclude": "\u9ED1\u540D\u5355",
      "enter_path_or_pattern": "\u8F93\u5165\u8DEF\u5F84\u6216\u6A21\u5F0F",
      "label_regex": "\u6B63\u5219\u8868\u8FBE\u5F0F",
      // Advanced Rules
      "advanced_rules_header": "\u9AD8\u7EA7\u89C4\u5219",
      "advanced_rules_modal_header": "\u9AD8\u7EA7\u89C4\u5219",
      "advanced_rules_manage_button": "\u7BA1\u7406\u9AD8\u7EA7\u89C4\u5219",
      "edit_rule_header": "\u7F16\u8F91\u89C4\u5219",
      "add_rule_header": "\u6DFB\u52A0\u65B0\u89C4\u5219",
      "btn_add_rule": "+ \u6DFB\u52A0\u89C4\u5219",
      "btn_save_rule": "\u4FDD\u5B58\u89C4\u5219",
      "btn_add_words": "+ \u6DFB\u52A0\u5355\u8BCD",
      "btn_add_regex": "+ \u6DFB\u52A0\u6B63\u5219\u8868\u8FBE\u5F0F",
      "btn_save_regex": "\u4FDD\u5B58\u6B63\u5219\u8868\u8FBE\u5F0F",
      // Regex Tester
      "regex_tester_header": "\u6B63\u5219\u8868\u8FBE\u5F0F\u6D4B\u8BD5\u5668",
      "regex_tester_blacklist": "\u6B63\u5219\u8868\u8FBE\u5F0F\u6D4B\u8BD5\u5668 - \u9ED1\u540D\u5355",
      "regex_expression_placeholder": "\u5728\u6B64\u8F93\u5165\u60A8\u7684\u6B63\u5219\u8868\u8FBE\u5F0F",
      "regex_subject_placeholder": "\u5728\u6B64\u8F93\u5165\u8981\u6D4B\u8BD5\u7684\u6587\u672C...",
      "regex_name_placeholder": "\u547D\u540D\u60A8\u7684\u6B63\u5219\u8868\u8FBE\u5F0F",
      "matches": "\u5339\u914D\u9879",
      "matches_found": "\u627E\u5230\u5339\u914D\u9879",
      // Regex Flags
      "flag_g": "\u5168\u5C40\u6807\u5FD7\uFF1A\u67E5\u627E\u6240\u6709\u5339\u914D\u9879",
      "flag_i": "\u4E0D\u533A\u5206\u5927\u5C0F\u5199\u6807\u5FD7",
      "flag_m": "\u591A\u884C\u6807\u5FD7\uFF1A^ \u548C $ \u5339\u914D\u884C\u8FB9\u754C",
      "flag_s": "dotAll \u6807\u5FD7\uFF1A. \u5339\u914D\u6362\u884C\u7B26",
      "flag_u": "unicode \u6807\u5FD7\uFF1A\u89C6\u4E3A unicode \u4EE3\u7801\u70B9",
      "flag_y": "\u7C98\u6027\u6807\u5FD7\uFF1A\u4ECE lastIndex \u4F4D\u7F6E\u5339\u914D",
      // Data Export/Import
      "data_export_import_header": "\u6570\u636E\u5BFC\u51FA/\u5BFC\u5165",
      "export_plugin_data": "\u5BFC\u51FA\u63D2\u4EF6\u6570\u636E",
      "export_plugin_data_desc": "\u5C06\u8BBE\u7F6E\u3001\u5355\u8BCD\u548C\u89C4\u5219\u5BFC\u51FA\u5230JSON\u6587\u4EF6\u3002",
      "btn_export": "\u5BFC\u51FA",
      "import_plugin_data": "\u5BFC\u5165\u63D2\u4EF6\u6570\u636E",
      "import_plugin_data_desc": "\u4ECEJSON\u6587\u4EF6\u5BFC\u5165\u8BBE\u7F6E",
      "btn_import": "\u5BFC\u5165"
    };
  }
});

// src/i18n.js
var require_i18n = __commonJS({
  "src/i18n.js"(exports2, module2) {
    var en = require_en();
    var es = require_es();
    var fr = require_fr();
    var hi = require_hi();
    var it = require_it();
    var bn = require_bn();
    var ru = require_ru();
    var zh_cn = require_zh_cn();
    module2.exports = {
      en,
      es,
      fr,
      hi,
      it,
      bn,
      ru,
      zh_cn
    };
  }
});

// src/main.js
var {
  Plugin,
  PluginSettingTab,
  Setting,
  Modal,
  MarkdownView,
  Notice,
  FuzzySuggestModal,
  debounce,
  MarkdownRenderer,
  Menu,
  setIcon,
  Component
} = require("obsidian");
var moment = window.moment;
var RangeSetBuilder;
var Decoration;
var ViewPlugin;
try {
  RangeSetBuilder = require("@codemirror/state").RangeSetBuilder;
  Decoration = require("@codemirror/view").Decoration;
  ViewPlugin = require("@codemirror/view").ViewPlugin;
} catch (e) {
  RangeSetBuilder = class {
  };
  Decoration = { mark: () => ({}) };
  ViewPlugin = { fromClass: () => ({}) };
}
var locales = require_i18n();
var EDITOR_PERFORMANCE_CONSTANTS = {
  MAX_PATTERNS_STANDARD: 30,
  // Use standard processing for <= 30 patterns
  MAX_TEXT_LENGTH_STANDARD: 1e4,
  // Use standard processing for <= 10k chars
  PATTERN_CHUNK_SIZE: 20,
  // Process 20 patterns per chunk  
  TEXT_CHUNK_SIZE: 5e3,
  // Process 5k chars per chunk
  MAX_MATCHES_PER_PATTERN: 100,
  // Max matches per pattern in chunks
  MAX_TOTAL_MATCHES: 3e3
  // Absolute limit for decorations
};
var IS_DEVELOPMENT = false;
var debugLog = (tag, ...args) => {
  if (IS_DEVELOPMENT) {
    console.log(`[${tag}]`, ...args);
  }
};
var debugError = (tag, ...args) => {
  if (IS_DEVELOPMENT) {
    console.error(`[${tag}]`, ...args);
  }
};
var debugWarn = (tag, ...args) => {
  if (IS_DEVELOPMENT) {
    console.warn(`[${tag}]`, ...args);
  }
};
var RegexCache = class {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.map = /* @__PURE__ */ new Map();
    this.hits = 0;
    this.misses = 0;
    this.entryMap = /* @__PURE__ */ new WeakMap();
  }
  _key(pattern, flags) {
    return `${pattern}::${flags || ""}`;
  }
  getOrCreate(pattern, flags) {
    const k = this._key(pattern, flags);
    if (this.map.has(k)) {
      const r2 = this.map.get(k);
      this.map.delete(k);
      this.map.set(k, r2);
      this.hits++;
      return r2;
    }
    let r;
    try {
      r = flags && flags !== "" ? new RegExp(pattern, flags) : new RegExp(pattern);
    } catch (_) {
      r = null;
    }
    this.misses++;
    if (r) {
      this.map.set(k, r);
      if (this.map.size > this.maxSize) {
        const oldestKey = this.map.keys().next().value;
        this.map.delete(oldestKey);
      }
    }
    return r;
  }
  associate(entry, regex) {
    if (entry && regex) {
      try {
        this.entryMap.set(entry, regex);
      } catch (_) {
      }
    }
  }
  clear() {
    this.map.clear();
    this.hits = 0;
    this.misses = 0;
  }
  stats() {
    return { hits: this.hits, misses: this.misses, size: this.map.size };
  }
};
var BloomFilter = class {
  constructor(size = 2048) {
    this.size = size;
    this.bits = new Uint8Array(size);
  }
  reset() {
    this.bits.fill(0);
  }
  _hashes(s) {
    let h1 = 0, h2 = 0, h3 = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = (h1 << 5) - h1 + c >>> 0;
      h2 = (h2 << 7 ^ c) >>> 0;
      h3 = h3 * 33 + c >>> 0;
    }
    return [h1 % this.size, h2 % this.size, h3 % this.size];
  }
  _setToken(token) {
    const idx = this._hashes(token);
    for (const i of idx) this.bits[i] = 1;
  }
  addPattern(pattern, isRegex) {
    if (!pattern) return;
    const p = String(pattern).toLowerCase();
    let base = p;
    if (isRegex) {
      const m = p.match(/[a-z0-9]{3,}/i);
      base = m ? m[0].toLowerCase() : "";
    }
    if (!base || base.length < 3) return;
    for (let i = 0; i <= base.length - 3; i++) {
      const tok = base.slice(i, i + 3);
      this._setToken(tok);
    }
  }
  mightContain(text) {
    if (!text) return false;
    const t = String(text).toLowerCase();
    const L = t.length;
    if (L < 3) return false;
    for (let i = 0; i <= L - 3; i++) {
      const tok = t.slice(i, i + 3);
      const [a, b, c] = this._hashes(tok);
      if (this.bits[a] && this.bits[b] && this.bits[c]) {
        return true;
      }
    }
    return false;
  }
};
var PatternMatcher = class {
  constructor(settings, helpers) {
    this.settings = settings || {};
    this.helpers = helpers || {};
    this.counters = { regexExecs: 0, matchesFound: 0 };
  }
  compilePattern(entry, cache) {
    if (!entry || !entry.pattern) return entry;
    const isRegex = !!entry.isRegex;
    const rawFlags = String(entry.flags || "").replace(/[^gimsuy]/g, "");
    let flags = rawFlags || "";
    if (!flags.includes("g")) flags += "g";
    if (!this.settings.caseSensitive && !flags.includes("i")) flags += "i";
    try {
      if (isRegex && this.settings.enableRegexSupport) {
        entry.regex = cache ? cache.getOrCreate(entry.pattern, flags) : new RegExp(entry.pattern, flags);
        const tf = flags.replace(/g/g, "");
        entry.testRegex = cache ? cache.getOrCreate(entry.pattern, tf) : tf === "" ? new RegExp(entry.pattern) : new RegExp(entry.pattern, tf);
      } else {
        const esc = this.helpers.escapeRegex ? this.helpers.escapeRegex(entry.pattern) : entry.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const lf = this.settings.caseSensitive ? "g" : "gi";
        entry.regex = cache ? cache.getOrCreate(esc, lf) : new RegExp(esc, lf);
        entry.testRegex = this.settings.caseSensitive ? cache ? cache.getOrCreate(esc, "") : new RegExp(esc) : cache ? cache.getOrCreate(esc, "i") : new RegExp(esc, "i");
      }
    } catch (_) {
      entry.invalid = true;
    }
    return entry;
  }
  match(text, entries, folderEntry) {
    const out = [];
    const isSentence = (p) => this.helpers.isSentenceLikePattern ? this.helpers.isSentenceLikePattern(p) : /[\s,\.;:!\?"'\(\)\[\]\{\}<>]/.test(p || "");
    const wholeWord = (t, s, e) => {
      const lc = s > 0 ? t[s - 1] : "";
      const rc = e < t.length ? t[e] : "";
      const isW = (ch) => /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
      return (s === 0 || !isW(lc)) && (e === t.length || !isW(rc));
    };
    for (const entry of entries) {
      if (!entry || entry.invalid) continue;
      try {
        if (entry.fastTest && typeof entry.fastTest === "function") {
          if (!entry.fastTest(text)) continue;
        }
      } catch (_) {
      }
      const regex = entry.regex;
      if (!regex) continue;
      const matches = this.helpers.safeMatchLoop ? this.helpers.safeMatchLoop(regex, text) : (text.match(regex) || []).map((m) => ({ 0: m, index: text.indexOf(m) }));
      let iters = 0;
      for (const m of matches) {
        const matchedText = m[0];
        const ms = m.index;
        const me = m.index + matchedText.length;
        if (!this.settings.partialMatch && !isSentence(entry.pattern) && !wholeWord(text, ms, me)) {
          iters++;
          continue;
        }
        let fws = ms;
        let fwe = me;
        if (!isSentence(entry.pattern)) {
          while (fws > 0 && (/[A-Za-z0-9]/.test(text[fws - 1]) || text[fws - 1] === "-" || text[fws - 1] === "'")) fws--;
          while (fwe < text.length && (/[A-Za-z0-9]/.test(text[fwe]) || text[fwe] === "-" || text[fwe] === "'")) fwe++;
        }
        const fullWord = isSentence(entry.pattern) ? matchedText : text.substring(fws, fwe);
        const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
        const priority = me - ms + (entry.isTextBg ? -10 : 0);
        out.push({ start: ms, end: me, color: useColor, word: matchedText, styleType: entry.styleType, textColor: entry.textColor, backgroundColor: entry.backgroundColor, isTextBg: entry.isTextBg === true, priority });
        iters++;
      }
      if (iters > 0) {
        this.counters.regexExecs += iters;
        this.counters.matchesFound += out.length;
      }
    }
    if (out.length > 1) {
      out.sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start;
        const la = a.end - a.start;
        const lb = b.end - b.start;
        if (la !== lb) return lb - la;
        return (b.priority || 0) - (a.priority || 0);
      });
      const no = [];
      for (const m of out) {
        let ov = false;
        for (const s of no) {
          if (m.start < s.end && m.end > s.start) {
            ov = true;
            break;
          }
        }
        if (!ov) no.push(m);
      }
      return no;
    }
    return out;
  }
};
var SettingsIndex = class {
  constructor(settings) {
    this.settings = settings || {};
    this.firstChar = /* @__PURE__ */ new Map();
    this.lengthRanges = /* @__PURE__ */ new Map();
    this.regexPrefixes = /* @__PURE__ */ new Map();
  }
  rebuild(entries) {
    this.firstChar.clear();
    this.lengthRanges.clear();
    this.regexPrefixes.clear();
    for (const e of entries || []) {
      if (!e || e.invalid || !e.pattern) continue;
      const p = String(e.pattern);
      if (!e.isRegex) {
        const d = p[0] || "";
        const bucket = this.firstChar.get(d) || [];
        bucket.push(e);
        this.firstChar.set(d, bucket);
        const len = p.length;
        const rangeKey = len < 5 ? "lt5" : len < 10 ? "lt10" : len < 20 ? "lt20" : "ge20";
        const lr = this.lengthRanges.get(rangeKey) || [];
        lr.push(e);
        this.lengthRanges.set(rangeKey, lr);
      } else {
        const m = p.match(/[A-Za-z0-9]{3,}/);
        if (m) {
          const pref = m[0][0];
          const list = this.regexPrefixes.get(pref) || [];
          list.push(e);
          this.regexPrefixes.set(pref, list);
        }
      }
    }
  }
  query(text) {
    if (!text) return [];
    const t = String(text);
    const set = /* @__PURE__ */ new Set();
    const d = t[0] || "";
    const cands = this.firstChar.get(d) || [];
    for (const e of cands) set.add(e);
    const len = t.length;
    const rk = len < 5 ? "lt5" : len < 10 ? "lt10" : len < 20 ? "lt20" : "ge20";
    const lr = this.lengthRanges.get(rk) || [];
    for (const e of lr) set.add(e);
    if (t.length >= 1) {
      const rp = this.regexPrefixes.get(t[0]) || [];
      for (const e of rp) set.add(e);
    }
    return Array.from(set);
  }
};
var PriorityQueue = class {
  constructor() {
    this.a = [];
  }
  push(item, pr) {
    this.a.push({ item, pr });
    this.a.sort((x, y) => y.pr - x.pr);
  }
  pop() {
    return this.a.length ? this.a.shift().item : null;
  }
  size() {
    return this.a.length;
  }
  clear() {
    this.a.length = 0;
  }
};
var SmartEventManager = class {
  constructor() {
    this.registry = [];
    this.rafQueue = /* @__PURE__ */ new Set();
    this.pq = new PriorityQueue();
    this.running = false;
  }
  add(el, event, handler, opts = {}) {
    const priority = opts.priority || 0;
    const debounceMs = typeof opts.debounceMs === "number" ? opts.debounceMs : this._defaultDebounce(event, opts.viewType);
    const useRaf = !!opts.useRaf;
    let wrapped = handler;
    if (debounceMs > 0) {
      let t;
      wrapped = (...args) => {
        clearTimeout(t);
        t = setTimeout(() => handler(...args), debounceMs);
      };
    }
    if (useRaf) {
      const key = `${event}:${Math.random()}`;
      const fn = (...args) => {
        this.rafQueue.add(() => handler(...args));
        this._drainRaf();
      };
      wrapped = fn;
    }
    el.addEventListener(event, wrapped, opts);
    this.registry.push({ el, event, wrapped, priority });
    return wrapped;
  }
  remove(el, event, wrapped) {
    try {
      el.removeEventListener(event, wrapped);
    } catch (_) {
    }
    this.registry = this.registry.filter((r) => r.el !== el || r.event !== event || r.wrapped !== wrapped);
  }
  _drainRaf() {
    if (this.running) return;
    this.running = true;
    const run = () => {
      const tasks = Array.from(this.rafQueue);
      this.rafQueue.clear();
      for (const fn of tasks) {
        try {
          fn();
        } catch (_) {
        }
      }
      if (this.rafQueue.size > 0) {
        requestAnimationFrame(run);
      } else {
        this.running = false;
      }
    };
    requestAnimationFrame(run);
  }
  _defaultDebounce(event, viewType) {
    if (viewType === "editor") {
      if (event === "scroll" || event === "resize") return 50;
      if (event === "mousemove") return 25;
      return 0;
    }
    if (event === "scroll" || event === "resize") return 100;
    if (event === "mousemove") return 50;
    return 0;
  }
  clear() {
    for (const r of this.registry) {
      try {
        r.el.removeEventListener(r.event, r.wrapped);
      } catch (_) {
      }
    }
    this.registry = [];
    this.rafQueue.clear();
    this.pq.clear();
  }
};
var CircuitBreaker = class {
  constructor(threshold = 5, timeoutMs = 5e3) {
    this.threshold = threshold;
    this.timeoutMs = timeoutMs;
    this.failures = 0;
    this.state = "closed";
    this.openedAt = 0;
  }
  canExecute() {
    if (this.state === "open") {
      const now = Date.now();
      if (now - this.openedAt > this.timeoutMs) {
        this.state = "half";
        return true;
      }
      return false;
    }
    return true;
  }
  recordSuccess() {
    this.failures = 0;
    if (this.state !== "closed") this.state = "closed";
  }
  recordFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = "open";
      this.openedAt = Date.now();
    }
  }
};
var ErrorRecovery = class {
  constructor() {
    this.breakers = /* @__PURE__ */ new Map();
  }
  getBreaker(key) {
    const b = this.breakers.get(key) || new CircuitBreaker();
    this.breakers.set(key, b);
    return b;
  }
  wrap(key, fn, fallback) {
    const br = this.getBreaker(key);
    if (!br.canExecute()) {
      return typeof fallback === "function" ? fallback() : null;
    }
    try {
      const res = fn();
      br.recordSuccess();
      return res;
    } catch (_) {
      br.recordFailure();
      try {
        return typeof fallback === "function" ? fallback() : null;
      } catch (_2) {
        return null;
      }
    }
  }
};
var MemoryManager = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.interval = 2e3;
    this.timer = null;
    this.spanPool = [];
  }
  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.tick();
    }, this.interval);
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  setIntervalMs(ms) {
    this.interval = ms;
    if (this.timer) {
      this.stop();
      this.start();
    }
  }
  tick() {
    try {
      if (performance && performance.memory) {
        const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
        if (usedMB > 800) {
          try {
            if (this.plugin._regexCache) this.plugin._regexCache.clear();
          } catch (_) {
          }
          try {
            if (this.plugin._bloomFilter) this.plugin._bloomFilter.reset();
          } catch (_) {
          }
        }
      }
    } catch (_) {
    }
  }
  getSpan(text) {
    let span = null;
    if (this.spanPool.length) {
      const wr = this.spanPool.pop();
      const obj = wr && wr.deref ? wr.deref() : null;
      if (obj) span = obj;
    }
    if (!span) span = document.createElement("span");
    span.textContent = text || "";
    return span;
  }
  returnSpan(span) {
    try {
      span.textContent = "";
      this.spanPool.push(new WeakRef(span));
    } catch (_) {
    }
  }
  hintGC() {
    try {
      const arr = new Array(1e5);
      for (let i = 0; i < arr.length; i++) arr[i] = i;
      setTimeout(() => {
        arr.length = 0;
      }, 0);
    } catch (_) {
    }
  }
};
module.exports = class AlwaysColorText extends Plugin {
  constructor(...args) {
    super(...args);
    (function() {
      let lastOperationTime = 0;
      let operationCount = 0;
      const isOverloaded = () => {
        try {
          const now = Date.now();
          if (now - lastOperationTime < 50) {
            operationCount++;
            if (operationCount > 5) return true;
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
    this._perfCounters = {
      totalRegexExecs: 0,
      avoidedRegexExecs: 0
    };
    this.getPerfCounters = () => Object.assign({}, this._perfCounters);
    this._cachedSortedEntries = null;
    this._cacheDirty = true;
    try {
      this._domRefs = /* @__PURE__ */ new WeakMap();
    } catch (e) {
      this._domRefs = /* @__PURE__ */ new WeakMap();
    }
    try {
      this._viewportObservers = /* @__PURE__ */ new Map();
    } catch (e) {
      this._viewportObservers = /* @__PURE__ */ new Map();
    }
    this._lastPerfWarning = 0;
    this._commandsRegistered = false;
    this._registeredCommandIds = [];
    this._translations = typeof locales === "object" && locales ? locales : {};
    this._externalTranslations = {};
    this._regexCache = new RegexCache(100);
    this._bloomFilter = new BloomFilter(2048);
    this._patternMatcher = new PatternMatcher(this.settings, {
      escapeRegex: (s) => this.escapeRegex(s),
      isSentenceLikePattern: (p) => this.isSentenceLikePattern(p),
      safeMatchLoop: (re, t) => this.safeMatchLoop(re, t)
    });
    this._settingsIndex = new SettingsIndex(this.settings);
    this._eventManager = new SmartEventManager();
    this._errorRecovery = new ErrorRecovery();
    this._memoryManager = new MemoryManager(this);
    try {
      this._memoryManager.start();
    } catch (_) {
    }
    try {
      this._lpObservers = /* @__PURE__ */ new WeakMap();
    } catch (_) {
      this._lpObservers = /* @__PURE__ */ new WeakMap();
    }
  }
  applyDisabledNeutralizerStyles() {
    try {
      let style = document.getElementById("act-inline-neutralizer");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-inline-neutralizer";
        style.textContent = `
          span.always-color-text-highlight { color: inherit !important; background-color: transparent !important; padding: 0 !important; border: none !important; }
          .callout span.always-color-text-highlight { color: inherit !important; background-color: transparent !important; padding: 0 !important; border: none !important; }
          .is-live-preview .callout span.always-color-text-highlight { color: inherit !important; background-color: transparent !important; padding: 0 !important; border: none !important; }
          .is-live-preview .cm-callout span.always-color-text-highlight { color: inherit !important; background-color: transparent !important; padding: 0 !important; border: none !important; }
          .callout .always-color-text-highlight,
          .cm-callout .always-color-text-highlight,
          .markdown-reading-view .callout .always-color-text-highlight,
          .markdown-rendered .callout .always-color-text-highlight {
            --text-normal: inherit !important;
            --link-color: inherit !important;
            --link-external-color: inherit !important;
            --link-unresolved-color: inherit !important;
            --link-color-hover: inherit !important;
            --link-external-color-hover: inherit !important;
            --highlight-color: inherit !important;
          }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {
    }
  }
  removeDisabledNeutralizerStyles() {
    try {
      const style = document.getElementById("act-inline-neutralizer");
      if (style) style.remove();
    } catch (_) {
    }
  }
  applyHideHighlightsNeutralizerStyles() {
    try {
      let style = document.getElementById("act-hide-highlights-neutralizer");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-hide-highlights-neutralizer";
        style.textContent = `
          span.always-color-text-highlight { background-color: transparent !important; padding: 0 !important; border: none !important; display: inline !important; box-shadow: none !important; }
          .always-color-text-highlight { background-color: transparent !important; padding: 0 !important; border: none !important; box-shadow: none !important; }
          .callout .always-color-text-highlight,
          .cm-callout .always-color-text-highlight,
          .markdown-reading-view .always-color-text-highlight,
          .markdown-rendered .always-color-text-highlight,
          .cm-content .always-color-text-highlight,
          .cm-line .always-color-text-highlight,
          .is-live-preview .cm-content .always-color-text-highlight { background-color: transparent !important; padding: 0 !important; border: none !important; box-shadow: none !important; }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {
    }
  }
  removeHideHighlightsNeutralizerStyles() {
    try {
      const style = document.getElementById("act-hide-highlights-neutralizer");
      if (style) style.remove();
    } catch (_) {
    }
  }
  neutralizeExistingHighlightBackgrounds() {
    try {
      document.querySelectorAll(".always-color-text-highlight").forEach((el) => {
        try {
          el.style.setProperty("background-color", "transparent", "important");
        } catch (_) {
          el.style.backgroundColor = "transparent";
        }
        el.style.paddingLeft = "0px";
        el.style.paddingRight = "0px";
        el.style.border = "";
        el.style.borderRadius = "";
        el.style.boxShadow = "";
        el.style.display = "inline";
      });
    } catch (_) {
    }
  }
  applyEnabledLivePreviewCalloutStyles() {
    try {
      let style = document.getElementById("act-livepreview-callout");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-livepreview-callout";
        style.textContent = `
          .is-live-preview .callout .always-color-text-highlight,
          .is-live-preview .callout .always-color-text-highlight *,
          .is-live-preview .cm-callout .always-color-text-highlight,
          .is-live-preview .cm-callout .always-color-text-highlight * {
            --text-normal: var(--highlight-color);
            --link-color: var(--highlight-color);
            --link-external-color: var(--highlight-color);
            --link-unresolved-color: var(--highlight-color);
            --link-color-hover: var(--highlight-color);
            --link-external-color-hover: var(--highlight-color);
            color: var(--highlight-color) !important;
          }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {
    }
  }
  removeEnabledLivePreviewCalloutStyles() {
    try {
      const style = document.getElementById("act-livepreview-callout");
      if (style) style.remove();
    } catch (_) {
    }
  }
  applyEnabledReadingCalloutStyles() {
    try {
      let style = document.getElementById("act-reading-callout");
      if (!style) {
        style = document.createElement("style");
        style.id = "act-reading-callout";
        style.textContent = `
          .markdown-reading-view .callout .always-color-text-highlight,
          .markdown-reading-view .callout .always-color-text-highlight *,
          .markdown-rendered .callout .always-color-text-highlight,
          .markdown-rendered .callout .always-color-text-highlight *,
          .callout .always-color-text-highlight,
          .callout .always-color-text-highlight * {
            --text-normal: var(--highlight-color);
            --link-color: var(--highlight-color);
            --link-external-color: var(--highlight-color);
            --link-unresolved-color: var(--highlight-color);
            --link-color-hover: var(--highlight-color);
            --link-external-color-hover: var(--highlight-color);
            color: var(--highlight-color) !important;
          }
        `;
        document.head.appendChild(style);
      }
    } catch (_) {
    }
  }
  removeEnabledReadingCalloutStyles() {
    try {
      const style = document.getElementById("act-reading-callout");
      if (style) style.remove();
      try {
        document.querySelectorAll(".callout .always-color-text-highlight, .cm-callout .always-color-text-highlight, .markdown-reading-view .always-color-text-highlight, .markdown-rendered .always-color-text-highlight").forEach((el) => {
          el.style.removeProperty("--highlight-color");
          el.style.removeProperty("--text-normal");
          el.style.removeProperty("--link-color");
          el.style.removeProperty("--link-external-color");
          el.style.removeProperty("--link-unresolved-color");
          el.style.removeProperty("--link-color-hover");
          el.style.removeProperty("--link-external-color-hover");
          el.style.removeProperty("color");
        });
      } catch (e) {
      }
    } catch (_) {
    }
  }
  t(key, fallback, params) {
    try {
      const pref = this.settings && this.settings.language || "en";
      const lang = pref === "auto" ? this.resolveSystemLanguageCode() : pref;
      const base = this._translations && typeof this._translations === "object" ? this._translations : typeof locales === "object" && locales ? locales : {};
      const dict = base && base[lang] || base && base.en || {};
      let str = dict && dict[key] ? dict[key] : fallback || key;
      if (params && str && typeof str === "string") {
        try {
          for (const k of Object.keys(params)) {
            const v = String(params[k]);
            str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
          }
        } catch (_) {
        }
      }
      return str;
    } catch (e) {
      return fallback || key;
    }
  }
  resolveSystemLanguageCode() {
    try {
      let raw = "en";
      try {
        raw = moment && typeof moment.locale === "function" ? moment.locale() : raw;
      } catch (_) {
      }
      if (!raw && navigator && navigator.language) raw = navigator.language;
      const code = String(raw).toLowerCase().split("-")[0].split("_")[0];
      const aliases = { bd: "bn", zh: "zh_cn" };
      const resolved = aliases[code] || code;
      const dict = this._translations && typeof this._translations === "object" ? this._translations : typeof locales === "object" && locales ? locales : {};
      if (dict && dict[resolved]) return resolved;
      return "en";
    } catch (e) {
      return "en";
    }
  }
  getPluginFolderPath() {
    try {
      const id = this.manifest && this.manifest.id || "always-color-text";
      return `.obsidian/plugins/${id}`;
    } catch (e) {
      return `.obsidian/plugins/always-color-text`;
    }
  }
  async loadExternalTranslations() {
    try {
      const safeLocales = typeof locales === "object" && locales ? locales : {};
      this._externalTranslations = safeLocales;
      this._translations = safeLocales;
    } catch (e) {
      this._translations = {};
    }
  }
  getAvailableLanguages() {
    try {
      const dict = this._translations && typeof this._translations === "object" ? this._translations : typeof locales === "object" && locales ? locales : {};
      const list = Object.keys(dict);
      return ["auto", ...list];
    } catch (e) {
      return ["auto"];
    }
  }
  async onload() {
    await this.loadSettings();
    try {
      await this.loadExternalTranslations();
    } catch (_) {
    }
    try {
      this.settingTab = new ColorSettingTab(this.app, this);
      this.addSettingTab(this.settingTab);
    } catch (e) {
      try {
        debugError("SETTINGS_TAB", "Failed to initialize settings tab", e);
      } catch (_) {
      }
    }
    if (this.settings.enabled) {
      this.removeDisabledNeutralizerStyles();
      try {
        this.applyEnabledLivePreviewCalloutStyles();
      } catch (_) {
      }
      try {
        this.applyEnabledReadingCalloutStyles();
      } catch (_) {
      }
      if (this.settings.hideHighlights) {
        this.applyHideHighlightsNeutralizerStyles();
        this.neutralizeExistingHighlightBackgrounds();
      } else {
        this.removeHideHighlightsNeutralizerStyles();
      }
      setTimeout(() => {
        try {
          this.refreshAllLivePreviewCallouts();
        } catch (_) {
        }
        try {
          this.forceRefreshAllReadingViews();
        } catch (_) {
        }
      }, 250);
    } else {
      this.applyDisabledNeutralizerStyles();
      try {
        this.removeEnabledLivePreviewCalloutStyles();
      } catch (_) {
      }
      try {
        this.removeEnabledReadingCalloutStyles();
      } catch (_) {
      }
    }
    if (!this.settings.disableToggleModes.ribbon) {
      this.ribbonIcon = this.addRibbonIcon("palette", this.t("ribbon_title", "Always color text"), async () => {
        this.settings.enabled = !this.settings.enabled;
        await this.saveSettings();
        this.updateStatusBar();
        this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
        this.reconfigureEditorExtensions();
        this.forceRefreshAllEditors();
        this.forceRefreshAllReadingViews();
        if (this.settings.enabled) new Notice(this.t("notice_enabled", "Always color text enabled"));
        else new Notice(this.t("notice_disabled", "Always color text disabled"));
        if (this.settings.enabled) {
          this.removeDisabledNeutralizerStyles();
        } else {
          this.applyDisabledNeutralizerStyles();
        }
        if (!this.settings.enabled) {
          try {
            this.clearAllHighlights();
          } catch (_) {
          }
        }
        try {
          if (this.settings.enabled) {
            this.applyEnabledLivePreviewCalloutStyles();
            this.applyEnabledReadingCalloutStyles();
            if (this.settings.hideHighlights) {
              this.applyHideHighlightsNeutralizerStyles();
            } else {
              this.removeHideHighlightsNeutralizerStyles();
            }
          } else {
            this.removeEnabledLivePreviewCalloutStyles();
            this.removeEnabledReadingCalloutStyles();
            this.removeHideHighlightsNeutralizerStyles();
          }
          this.refreshAllLivePreviewCallouts();
          this.forceReprocessLivePreviewCallouts();
        } catch (_) {
        }
      });
    }
    if (!this.settings.disableToggleModes.statusBar) {
      this.statusBar = this.addStatusBarItem();
      this.updateStatusBar();
      this.statusBar.onclick = () => {
        this.settings.enabled = !this.settings.enabled;
        this.saveSettings();
        this.updateStatusBar();
        this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
        this.reconfigureEditorExtensions();
        this.forceRefreshAllEditors();
        this.forceRefreshAllReadingViews();
        if (this.settings.enabled) new Notice(this.t("notice_enabled", "Always color text enabled"));
        else new Notice(this.t("notice_disabled", "Always color text disabled"));
        if (this.settings.enabled) {
          this.removeDisabledNeutralizerStyles();
        } else {
          this.applyDisabledNeutralizerStyles();
        }
        if (!this.settings.enabled) {
          try {
            this.clearAllHighlights();
          } catch (_) {
          }
        }
        try {
          if (this.settings.enabled) {
            this.applyEnabledLivePreviewCalloutStyles();
            this.applyEnabledReadingCalloutStyles();
            if (this.settings.hideHighlights) {
              this.applyHideHighlightsNeutralizerStyles();
            } else {
              this.removeHideHighlightsNeutralizerStyles();
            }
          } else {
            this.removeEnabledLivePreviewCalloutStyles();
            this.removeEnabledReadingCalloutStyles();
            this.removeHideHighlightsNeutralizerStyles();
          }
          this.refreshAllLivePreviewCallouts();
          this.forceReprocessLivePreviewCallouts();
        } catch (_) {
        }
      };
    } else {
      this.statusBar = null;
    }
    const { TFile } = require("obsidian");
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
      if (!(file instanceof TFile)) return;
      menu.addItem((item) => {
        const isDisabled = this.settings.disabledFiles.includes(file.path);
        item.setTitle(isDisabled ? this.t("file_menu_enable", "Enable always color text for this file") : this.t("file_menu_disable", "Disable always color text for this file")).setIcon(isDisabled ? "eye" : "eye-off").onClick(async () => {
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
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
      const selectedText = editor.getSelection().trim();
      if (selectedText.length > 0) {
        if (this.settings.enableQuickColorOnce) {
          menu.addItem((item) => {
            item.setTitle(this.t("menu_color_once", "Color Once")).setIcon("palette").onClick(() => {
              new ColorPickerModal(this.app, this, async (color) => {
                if (color && this.isValidHexColor(color)) {
                  const html = `<span style="color: ${color}">${selectedText}</span>`;
                  editor.replaceSelection(html);
                }
              }, "text", selectedText).open();
            });
          });
        }
        if (this.settings.enableQuickHighlightOnce) {
          menu.addItem((item) => {
            item.setTitle(this.t("menu_highlight_once", "Highlight Once")).setIcon("highlighter").onClick(() => {
              new ColorPickerModal(this.app, this, async (color, result) => {
                const bg = result && result.backgroundColor && this.isValidHexColor(result.backgroundColor) ? result.backgroundColor : this.isValidHexColor(color) ? color : null;
                if (!bg) return;
                let style = "";
                if (this.settings.quickHighlightUseGlobalStyle) {
                  const rgba = this.hexToRgba(bg, this.settings.backgroundOpacity ?? 25);
                  const radius = this.settings.highlightBorderRadius ?? 8;
                  const pad = this.settings.highlightHorizontalPadding ?? 4;
                  const border = this.generateBorderStyle(null, bg);
                  style = `background-color: ${rgba}; border-radius: ${radius}px; padding-left: ${pad}px; padding-right: ${pad}px;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${border}`;
                } else if (this.settings.quickHighlightStyleEnable) {
                  const hexWithAlpha = this.hexToHexWithAlpha(bg, this.settings.quickHighlightOpacity ?? 25);
                  const radius = this.settings.quickHighlightBorderRadius ?? 8;
                  const pad = this.settings.quickHighlightHorizontalPadding ?? 4;
                  const border = this.generateOnceBorderStyle(bg);
                  style = `background-color: ${hexWithAlpha}; border-radius: ${radius}px; padding-left: ${pad}px; padding-right: ${pad}px;${border}`;
                } else {
                  const rgba = this.hexToRgba(bg, 25);
                  style = `background-color: ${rgba};`;
                }
                const html = `<span class="always-color-text-highlight" style="${style}">${selectedText}</span>`;
                editor.replaceSelection(html);
              }, "background", selectedText, true).open();
            });
          });
        }
        menu.addItem((item) => {
          item.setTitle(this.t("menu_always_color_text", "Always color text")).setIcon("palette").onClick(() => {
            if (this.isWordBlacklisted(selectedText)) {
              new Notice(this.t("notice_blacklisted_cannot_color", `"${selectedText}" is blacklisted and cannot be colored.`, { word: selectedText }));
              return;
            }
            new ColorPickerModal(this.app, this, async (color, result) => {
              const sel = result || {};
              const tc = sel.textColor && this.isValidHexColor(sel.textColor) ? sel.textColor : null;
              const bc = sel.backgroundColor && this.isValidHexColor(sel.backgroundColor) ? sel.backgroundColor : null;
              const idx = this.settings.wordEntries.findIndex((e) => e && e.pattern === selectedText && !e.isRegex);
              if (idx !== -1) {
                const entry = this.settings.wordEntries[idx];
                if (tc && bc) {
                  entry.textColor = tc;
                  entry.backgroundColor = bc;
                  entry.color = "";
                  entry.styleType = "both";
                  entry._savedTextColor = tc;
                  entry._savedBackgroundColor = bc;
                } else if (tc) {
                  entry.color = tc;
                  entry.styleType = "text";
                  entry.textColor = null;
                  entry.backgroundColor = null;
                  entry._savedTextColor = tc;
                } else if (bc) {
                  entry.color = "";
                  entry.textColor = "currentColor";
                  entry.backgroundColor = bc;
                  entry.styleType = "highlight";
                  entry._savedBackgroundColor = bc;
                } else if (color && this.isValidHexColor(color)) {
                  entry.color = color;
                  entry.styleType = "text";
                  entry._savedTextColor = color;
                }
              } else {
                if (tc && bc) {
                  this.settings.wordEntries.push({ pattern: selectedText, color: "", textColor: tc, backgroundColor: bc, isRegex: false, flags: "", styleType: "both", _savedTextColor: tc, _savedBackgroundColor: bc });
                } else if (tc) {
                  this.settings.wordEntries.push({ pattern: selectedText, color: tc, isRegex: false, flags: "", styleType: "text", _savedTextColor: tc });
                } else if (bc) {
                  this.settings.wordEntries.push({ pattern: selectedText, color: "", textColor: "currentColor", backgroundColor: bc, isRegex: false, flags: "", styleType: "highlight", _savedBackgroundColor: bc });
                } else if (color && this.isValidHexColor(color)) {
                  this.settings.wordEntries.push({ pattern: selectedText, color, isRegex: false, flags: "", styleType: "text", _savedTextColor: color });
                }
              }
              await this.saveSettings();
              this.compileWordEntries();
              this.compileTextBgColoringEntries();
              this.reconfigureEditorExtensions();
              this.refreshEditor(view, true);
            }, "text-and-background", selectedText, false).open();
          });
        });
        const patternMatches = (pattern, text) => {
          if (this.settings.caseSensitive) {
            return pattern === text;
          } else {
            return pattern.toLowerCase() === text.toLowerCase();
          }
        };
        const hasRegexEntry = this.settings.enableRegexSupport && this.settings.wordEntries.some((e) => e && e.isRegex && (() => {
          try {
            const re = new RegExp(e.pattern, e.flags || (this.settings.caseSensitive ? "" : "i"));
            return re.test(selectedText);
          } catch (err) {
            return false;
          }
        })());
        const hasLiteralEntry = this.settings.wordEntries.some((e) => e && patternMatches(e.pattern, selectedText) && !e.isRegex);
        const hasGroupedEntry = this.settings.wordEntries.some((e) => e && !e.isRegex && Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => patternMatches(p, selectedText)));
        const hasTextBgEntry = (Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : []).some((e) => {
          if (!e || !e.backgroundColor) return false;
          if (e.isRegex && this.settings.enableRegexSupport) {
            try {
              const re = new RegExp(e.pattern, e.flags || (this.settings.caseSensitive ? "" : "i"));
              return re.test(selectedText);
            } catch (err) {
              return false;
            }
          } else {
            const literal = patternMatches(e.pattern || "", selectedText);
            const grouped = Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => patternMatches(p, selectedText));
            return literal || grouped;
          }
        });
        if (hasLiteralEntry || hasGroupedEntry || hasRegexEntry || hasTextBgEntry) {
          menu.addItem((item) => {
            item.setTitle(this.t("menu_remove_always_color_text", "Remove Always Color Text")).setIcon("eraser").onClick(async () => {
              if (hasGroupedEntry) {
                const entryWithGroup = this.settings.wordEntries.find((e) => e && !e.isRegex && Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => patternMatches(p, selectedText)));
                if (entryWithGroup) {
                  const idx = this.settings.wordEntries.indexOf(entryWithGroup);
                  if (idx !== -1) {
                    entryWithGroup.groupedPatterns = entryWithGroup.groupedPatterns.filter((p) => !patternMatches(p, selectedText));
                    if (entryWithGroup.groupedPatterns.length === 1) {
                      entryWithGroup.pattern = entryWithGroup.groupedPatterns[0];
                      entryWithGroup.groupedPatterns = null;
                    } else if (entryWithGroup.groupedPatterns.length === 0) {
                      this.settings.wordEntries.splice(idx, 1);
                    }
                  }
                }
              }
              if (hasLiteralEntry) {
                this.settings.wordEntries = this.settings.wordEntries.filter((e) => !(e && patternMatches(e.pattern, selectedText) && !e.isRegex));
              }
              if (hasRegexEntry) {
                const idxToRemove = this.settings.wordEntries.findIndex((e) => e && e.isRegex && (() => {
                  try {
                    const re = new RegExp(e.pattern, e.flags || (this.settings.caseSensitive ? "" : "i"));
                    return re.test(selectedText);
                  } catch (err) {
                    return false;
                  }
                })());
                if (idxToRemove !== -1) {
                  this.settings.wordEntries.splice(idxToRemove, 1);
                }
              }
              if (hasTextBgEntry) {
                const entries = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
                const matchedGrouped = entries.find((e) => e && e.backgroundColor && !e.isRegex && Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => patternMatches(p, selectedText)));
                if (matchedGrouped) {
                  const idx = entries.indexOf(matchedGrouped);
                  matchedGrouped.groupedPatterns = matchedGrouped.groupedPatterns.filter((p) => !patternMatches(p, selectedText));
                  if (matchedGrouped.groupedPatterns.length === 1) {
                    matchedGrouped.pattern = matchedGrouped.groupedPatterns[0];
                    matchedGrouped.groupedPatterns = null;
                  } else if (matchedGrouped.groupedPatterns.length === 0) {
                    entries.splice(idx, 1);
                  }
                }
                this.settings.wordEntries = entries.filter((e) => !(e && e.backgroundColor && !e.isRegex && patternMatches(e.pattern || "", selectedText)));
                const ridx = this.settings.wordEntries.findIndex((e) => e && e.backgroundColor && e.isRegex && (() => {
                  try {
                    const re = new RegExp(e.pattern, e.flags || (this.settings.caseSensitive ? "" : "i"));
                    return re.test(selectedText);
                  } catch (err) {
                    return false;
                  }
                })());
                if (ridx !== -1) {
                  this.settings.wordEntries.splice(ridx, 1);
                }
              }
              await this.saveSettings();
              this.refreshEditor(view, true);
              new Notice(this.t("notice_removed_always_color", `Removed always coloring for "${selectedText}".`, { word: selectedText }));
              if (this.settingTab) {
                this.settingTab._initializedSettingsUI = false;
                this.settingTab.display();
              }
            });
          });
        }
        if (this.settings.enableBlacklistMenu) {
          menu.addItem((item) => {
            item.setTitle(this.t("menu_blacklist_word", "Blacklist Word from Coloring")).setIcon("ban").onClick(async () => {
              const existsLegacy = Array.isArray(this.settings.blacklistWords) && this.settings.blacklistWords.includes(selectedText);
              const existsNew = Array.isArray(this.settings.blacklistEntries) && this.settings.blacklistEntries.some((e) => e && !e.isRegex && String(e.pattern).toLowerCase() === String(selectedText).toLowerCase());
              if (!existsLegacy && !existsNew) {
                if (!Array.isArray(this.settings.blacklistEntries)) this.settings.blacklistEntries = [];
                this.settings.blacklistEntries.push({ pattern: selectedText, isRegex: false, flags: "", groupedPatterns: null });
                await this.saveSettings();
                new Notice(this.t("notice_added_to_blacklist", `"${selectedText}" added to blacklist.`, { word: selectedText }));
                this.refreshEditor(view, true);
                if (this.settingTab && this.settingTab._refreshBlacklistWords) {
                  this.settingTab._refreshBlacklistWords();
                }
              } else {
                new Notice(this.t("notice_already_blacklisted", `"${selectedText}" is already blacklisted.`, { word: selectedText }));
              }
            });
          });
        }
      }
    }));
    if (!this.settings.disableToggleModes.command) {
      this.registerCommandPalette();
    }
    if (this.settings.enabled) {
      this.enablePluginFeatures();
    }
    try {
      this.registerEvent(this.app.workspace.on("layout-ready", () => {
        try {
          this.refreshAllLivePreviewCallouts();
        } catch (_) {
        }
      }));
    } catch (_) {
    }
  }
  registerCommandPalette() {
    try {
      if (this.settings?.disableToggleModes?.command) return;
      if (this._commandsRegistered) return;
      const addTrackedCommand = (cmd) => {
        this._registeredCommandIds.push(cmd.id);
        return this.addCommand(cmd);
      };
      addTrackedCommand({
        id: "set-color-for-selection",
        name: this.t("command_color_selected", "Color Selected Text"),
        editorCallback: (editor, view) => {
          const word = editor.getSelection().trim();
          if (!word) {
            new Notice(this.t("notice_select_text_first", "Please select some text first."));
            return;
          }
          new ColorPickerModal(this.app, this, async (color, result) => {
            const sel = result || {};
            const tc = sel.textColor && this.isValidHexColor(sel.textColor) ? sel.textColor : null;
            const bc = sel.backgroundColor && this.isValidHexColor(sel.backgroundColor) ? sel.backgroundColor : null;
            const idx = this.settings.wordEntries.findIndex((e) => e && e.pattern === word && !e.isRegex);
            if (idx !== -1) {
              const entry = this.settings.wordEntries[idx];
              if (tc && bc) {
                entry.textColor = tc;
                entry.backgroundColor = bc;
                entry.color = "";
                entry.styleType = "both";
                entry._savedTextColor = tc;
                entry._savedBackgroundColor = bc;
              } else if (tc) {
                entry.color = tc;
                entry.styleType = "text";
                entry.textColor = null;
                entry.backgroundColor = null;
                entry._savedTextColor = tc;
              } else if (bc) {
                entry.color = "";
                entry.textColor = "currentColor";
                entry.backgroundColor = bc;
                entry.styleType = "highlight";
                entry._savedBackgroundColor = bc;
              } else if (color && this.isValidHexColor(color)) {
                entry.color = color;
                entry.styleType = "text";
                entry._savedTextColor = color;
              }
            } else {
              if (tc && bc) {
                this.settings.wordEntries.push({ pattern: word, color: "", textColor: tc, backgroundColor: bc, isRegex: false, flags: "", styleType: "both", _savedTextColor: tc, _savedBackgroundColor: bc });
              } else if (tc) {
                this.settings.wordEntries.push({ pattern: word, color: tc, isRegex: false, flags: "", styleType: "text", _savedTextColor: tc });
              } else if (bc) {
                this.settings.wordEntries.push({ pattern: word, color: "", textColor: "currentColor", backgroundColor: bc, isRegex: false, flags: "", styleType: "highlight", _savedBackgroundColor: bc });
              } else if (color && this.isValidHexColor(color)) {
                this.settings.wordEntries.push({ pattern: word, color, isRegex: false, flags: "", styleType: "text", _savedTextColor: color });
              }
            }
            await this.saveSettings();
            this.compileWordEntries();
            this.compileTextBgColoringEntries();
            this.reconfigureEditorExtensions();
            this.forceRefreshAllEditors();
          }, "text-and-background", word, false).open();
        }
      });
      addTrackedCommand({
        id: "toggle-coloring-for-current-document",
        name: this.t("command_toggle_current", "Enable/Disable coloring for current document"),
        callback: async () => {
          const md = this.app.workspace.getActiveFile();
          if (!md) {
            new Notice(this.t("notice_no_active_file", "No active file to toggle coloring for."));
            return;
          }
          if (this.settings.disabledFiles.includes(md.path)) {
            const index = this.settings.disabledFiles.indexOf(md.path);
            if (index > -1) this.settings.disabledFiles.splice(index, 1);
            await this.saveSettings();
            new Notice(this.t("notice_coloring_enabled_for_path", `Coloring enabled for ${md.path}`, { path: md.path }));
          } else {
            this.settings.disabledFiles.push(md.path);
            await this.saveSettings();
            new Notice(this.t("notice_coloring_disabled_for_path", `Coloring disabled for ${md.path}`, { path: md.path }));
          }
        }
      });
      addTrackedCommand({
        id: "toggle-always-color-text",
        name: this.t("command_toggle_global", "Enable/Disable Always Color Text"),
        callback: async () => {
          this.settings.enabled = !this.settings.enabled;
          await this.saveSettings();
          new Notice(this.settings.enabled ? this.t("notice_global_enabled", "Always Color Text Enabled") : this.t("notice_global_disabled", "Always Color Text Disabled"));
          this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
          this.reconfigureEditorExtensions();
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
          if (this.settings.enabled) {
            this.removeDisabledNeutralizerStyles();
          } else {
            this.applyDisabledNeutralizerStyles();
            this.clearAllHighlights();
          }
          try {
            if (this.settings.enabled) {
              this.applyEnabledLivePreviewCalloutStyles();
              this.applyEnabledReadingCalloutStyles();
            } else {
              this.removeEnabledLivePreviewCalloutStyles();
              this.removeEnabledReadingCalloutStyles();
            }
            this.refreshAllLivePreviewCallouts();
            this.forceReprocessLivePreviewCallouts();
          } catch (_) {
          }
        }
      });
      addTrackedCommand({
        id: "show-latest-release-notes",
        name: this.t("command_show_release_notes", "Show Latest Release Notes"),
        callback: async () => {
          try {
            new ChangelogModal(this.app, this).open();
          } catch (e) {
            new Notice(this.t("notice_unable_open_changelog", "Unable to open changelog modal."));
          }
        }
      });
      addTrackedCommand({
        id: "manage-colored-texts",
        name: this.t("command_manage_colored_texts", "Manage Colored Texts"),
        callback: () => {
          try {
            this.app.setting.open();
            const tabId = this.manifest && this.manifest.id || "always-color-text";
            try {
              this.app.setting.openTabById(tabId);
            } catch (e) {
            }
            setTimeout(() => {
              try {
                const el = document.querySelector("#always-colored-texts-header");
                if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
              } catch (_) {
              }
            }, 100);
          } catch (_) {
          }
        }
      });
      addTrackedCommand({
        id: "manage-advanced-rules",
        name: this.t("command_manage_advanced_rules", "Manage Advanced Rules"),
        callback: () => {
          try {
            new ManageRulesModal(this.app, this).open();
          } catch (e) {
            new Notice(this.t("notice_error_opening_advanced_rules", "Error opening advanced rules modal"));
          }
        }
      });
      addTrackedCommand({
        id: "open-regex-tester",
        name: this.t("command_open_regex_tester", "Add Regex (Open Regex Tester)"),
        callback: () => {
          try {
            new RealTimeRegexTesterModal(this.app, this, async (entry) => {
              if (!entry) return;
              try {
                this.settingTab && (this.settingTab._suspendSorting = true);
              } catch (e) {
              }
              if (!Array.isArray(this.settings.wordEntries)) this.settings.wordEntries = [];
              const idx = this.settings.wordEntries.findIndex((e) => e && e.pattern === entry.pattern && e.isRegex);
              if (idx !== -1) {
                const existing = this.settings.wordEntries[idx];
                existing.pattern = entry.pattern;
                existing.color = entry.color;
                existing.textColor = entry.textColor;
                existing.backgroundColor = entry.backgroundColor;
                existing.styleType = entry.styleType;
                existing.flags = entry.flags;
                existing.presetLabel = entry.presetLabel || existing.presetLabel || void 0;
                existing.persistAtEnd = true;
              } else {
                entry.persistAtEnd = true;
                this.settings.wordEntries.push(entry);
              }
              try {
                this.settingTab && entry && entry.uid && this.settingTab._newEntriesSet && this.settingTab._newEntriesSet.add(entry.uid);
              } catch (e) {
              }
              await this.saveSettings();
              this.compileWordEntries();
              this.compileTextBgColoringEntries();
              this.reconfigureEditorExtensions();
              this.forceRefreshAllEditors();
              this.forceRefreshAllReadingViews();
            }).open();
          } catch (e) {
            new Notice(this.t("notice_error_opening_regex_tester", "Error opening regex tester"));
          }
        }
      });
      addTrackedCommand({
        id: "open-blacklist-regex-tester",
        name: this.t("command_open_blacklist_regex_tester", "Add Blacklist Regex"),
        callback: () => {
          try {
            new BlacklistRegexTesterModal(this.app, this, async (entry) => {
              if (!entry) return;
              try {
                this.settingTab && (this.settingTab._suspendSorting = true);
              } catch (e) {
              }
              if (!Array.isArray(this.settings.blacklistEntries)) this.settings.blacklistEntries = [];
              const idx = this.settings.blacklistEntries.findIndex((e) => e && e.pattern === entry.pattern && e.isRegex);
              if (idx !== -1) {
                const existing = this.settings.blacklistEntries[idx];
                existing.pattern = entry.pattern;
                existing.flags = entry.flags;
                existing.presetLabel = entry.presetLabel || existing.presetLabel || void 0;
                existing.persistAtEnd = true;
              } else {
                entry.persistAtEnd = true;
                this.settings.blacklistEntries.push(entry);
              }
              try {
                this.settingTab && entry && entry.uid && this.settingTab._blacklistNewSet && this.settingTab._blacklistNewSet.add(entry.uid);
              } catch (e) {
              }
              await this.saveSettings();
              this.reconfigureEditorExtensions();
              this.forceRefreshAllEditors();
              this.forceRefreshAllReadingViews();
            }).open();
          } catch (e) {
            new Notice(this.t("notice_error_opening_blacklist_regex_tester", "Error opening blacklist regex tester"));
          }
        }
      });
      this.addCommand({
        id: "toggle-hide-text-colors",
        name: this.t("command_toggle_hide_text_colors", "Hide/Unhide Text Colors"),
        callback: async () => {
          try {
            this.settings.hideTextColors = !this.settings.hideTextColors;
            await this.saveSettings();
            this._cacheDirty = true;
            this.removeEnabledReadingCalloutStyles();
            if (this.settings.enabled && !this.settings.hideTextColors) {
              this.applyEnabledReadingCalloutStyles();
            }
            this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
            this.reconfigureEditorExtensions();
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
            try {
              this.refreshAllLivePreviewCallouts();
            } catch (_) {
            }
            try {
              this.forceReprocessLivePreviewCallouts();
            } catch (_) {
            }
            const msg = this.settings.hideTextColors ? this.t("notice_text_colors_hidden", "Text colors hidden") : this.t("notice_text_colors_visible", "Text colors visible");
            new Notice(msg);
          } catch (_) {
          }
        }
      });
      addTrackedCommand({
        id: "toggle-hide-highlights",
        name: this.t("command_toggle_hide_highlights", "Hide/Unhide Highlights"),
        callback: async () => {
          try {
            this.settings.hideHighlights = !this.settings.hideHighlights;
            await this.saveSettings();
            this._cacheDirty = true;
            this.removeEnabledReadingCalloutStyles();
            if (this.settings.enabled && !this.settings.hideHighlights) {
              this.applyEnabledReadingCalloutStyles();
            }
            if (this.settings.hideHighlights) {
              this.applyHideHighlightsNeutralizerStyles();
              this.neutralizeExistingHighlightBackgrounds();
            } else {
              this.removeHideHighlightsNeutralizerStyles();
            }
            this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
            this.reconfigureEditorExtensions();
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
            try {
              this.refreshAllLivePreviewCallouts();
            } catch (_) {
            }
            try {
              this.forceReprocessLivePreviewCallouts();
            } catch (_) {
            }
            const msg = this.settings.hideHighlights ? this.t("notice_highlights_hidden", "Highlights hidden") : this.t("notice_highlights_visible", "Highlights visible");
            new Notice(msg);
          } catch (_) {
          }
        }
      });
      this._commandsRegistered = true;
    } catch (e) {
    }
  }
  // Re-register commands with updated language
  reregisterCommandsWithLanguage() {
    try {
      if (this.settings?.disableToggleModes?.command) return;
      this._commandsRegistered = false;
      this._registeredCommandIds = [];
      this.registerCommandPalette();
    } catch (e) {
      console.error("Error re-registering commands with new language:", e);
    }
  }
  // --- Regex complexity checker to avoid catastrophic patterns ---
  isRegexTooComplex(pattern) {
    if (!pattern || typeof pattern !== "string") return true;
    if (this.containsNonRomanCharacters(pattern)) {
      return false;
    }
    const safePatterns = [
      "\\b\\d+(?:\\.\\d+)?(?:kg|cm|m|km|\xB0C|\xB0F|lbs)\\b"
      // Measurements (kg, cm, m, km, °C, °F, lbs)
    ];
    if (safePatterns.includes(pattern)) return false;
    const dangerousPatterns = [
      /\(\?[=!<]/,
      // Lookarounds
      /\(\?[<][=!]/,
      // Lookbehinds
      /\*\+|\+\*/,
      // Adjacent quantifiers
      /\(\w+\)[*+][*+]/,
      // Nested quantifiers
      /\{[^}]*\{[^}]*\}/,
      // Nested quantifier ranges
      /\[[^\]]*\[[^\]]*\]/
      // Nested character classes
    ];
    if (dangerousPatterns.some((p) => p.test(pattern))) return true;
    if (pattern.length > 100) return true;
    const alternations = (pattern.match(/\|/g) || []).length;
    const quantifiers = (pattern.match(/[*+?{]/g) || []).length;
    const groups = (pattern.match(/\([^?]/g) || []).length;
    if (alternations > 5 || quantifiers > 10 || groups > 5) return true;
    try {
      const start = Date.now();
      new RegExp(pattern);
      if (Date.now() - start > 10) return true;
    } catch (e) {
      return true;
    }
    return false;
  }
  validateAndSanitizeRegex(pattern) {
    if (typeof pattern !== "string" || !pattern) return false;
    if (!this.settings.disableRegexSafety && this.isKnownProblematicPattern(pattern)) return false;
    if (!this.settings.disableRegexSafety && this.isRegexTooComplex(pattern)) return false;
    return true;
  }
  sanitizePattern(pattern, isRegex) {
    if (typeof pattern !== "string") return "";
    let p = String(pattern).trim();
    p = this.decodeHtmlEntities(p);
    if (isRegex && p.length > 200) throw new Error("Pattern too long");
    return p;
  }
  decodeHtmlEntities(text) {
    if (!text || typeof text !== "string") return text;
    text = text.replace(/&#(\d+);/g, (m, dec) => String.fromCharCode(dec));
    text = text.replace(/&#x([0-9A-Fa-f]+);/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)));
    const entities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&nbsp;": " ",
      "&copy;": "\xA9",
      "&reg;": "\xAE",
      "&trade;": "\u2122",
      "&hellip;": "\u2026",
      "&mdash;": "\u2014",
      "&ndash;": "\u2013",
      "&bull;": "\u2022",
      "&check;": "\u2713",
      "&checkmark;": "\u2713",
      "&rarr;": "\u2192",
      "&rightarrow": "\u2192",
      "&larr;": "\u2190",
      "&leftarrow": "\u2190",
      "&uarr;": "\u2191",
      "&uparrow": "\u2191",
      "&darr;": "\u2193",
      "&downarrow": "\u2193"
    };
    return text.replace(/&[#a-zA-Z0-9]+;/g, (m) => entities[m] || m);
  }
  // NEW HELPER METHOD: Detect non-Roman characters
  containsNonRomanCharacters(text) {
    if (!text) return false;
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
    if (!text || typeof text !== "string") return 0;
    const totalChars = text.length;
    if (totalChars === 0) return 0;
    return this.countNonRomanCharacters(text) / totalChars;
  }
  // NEW METHOD: Detect if pattern is simple (no regex needed)
  isSimplePattern(pattern) {
    if (!pattern || typeof pattern !== "string") return false;
    const decodedPattern = this.decodeHtmlEntities(pattern);
    const isSimple = /^[\w\s\u00A0-\u00FF\u2000-\u206F\u25A0-\u25FF\u2700-\u27BF✓✔→←↑↓+\-=*/.()&;]+$/.test(decodedPattern);
    if (pattern.includes("\u2713") || decodedPattern.includes("\u2713")) {
      debugLog("ISIMPLE", { pattern, decodedPattern, isSimple });
    }
    return isSimple;
  }
  // NEW METHOD: Ultra-fast simple pattern processing
  processSimplePatternsOptimized(element, simpleEntries, folderEntry = null, options = {}) {
    debugLog("SIMPLE", `Processing ${simpleEntries.length} simple patterns`);
    const blockTags = ["P", "LI", "DIV", "SPAN", "TD", "TH", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"];
    const effectiveStyle = "text";
    const allElements = element.querySelectorAll?.("*") || [];
    const blocks = [];
    for (const el of allElements) {
      if (blockTags.includes(el.nodeName) && !el.closest("code, pre")) {
        blocks.push(el);
      }
    }
    for (const block of blocks) {
      if (block.closest("code, pre")) continue;
      this.processBlockWithSimplePatterns(block, simpleEntries, folderEntry, effectiveStyle);
    }
  }
  // NEW METHOD: Process block with simple string matching
  processBlockWithSimplePatterns(block, simpleEntries, folderEntry, effectiveStyle) {
    try {
      if (block && (block.classList?.contains("act-skip-coloring") || block.closest?.(".act-skip-coloring"))) return;
    } catch (_) {
    }
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node2) {
          if (node2.parentElement?.closest("code, pre")) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node2.parentElement?.closest(".always-color-text-highlight")) {
            return NodeFilter.FILTER_REJECT;
          }
          try {
            if (node2.parentElement?.closest(".act-skip-coloring")) return NodeFilter.FILTER_REJECT;
          } catch (_) {
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
      const originalText = text;
      text = this.decodeHtmlEntities(text);
      let matches = [];
      for (const entry of simpleEntries) {
        let pattern = entry.pattern;
        pattern = this.decodeHtmlEntities(pattern);
        let pos = 0;
        while ((pos = text.indexOf(pattern, pos)) !== -1) {
          matches.push({
            start: pos,
            end: pos + pattern.length,
            entry,
            folderEntry
          });
          pos += pattern.length;
          if (matches.length > 50) break;
        }
        if (matches.length > 50) break;
      }
      if (matches.length > 0) {
        this.applySimpleHighlights(node, matches, text);
      }
    }
  }
  processMarkdownFormattingInReading(element, folderEntry = null) {
    try {
      try {
        debugLog("MARKDOWN_FORMAT", "Processing markdown formatting");
      } catch (_) {
      }
      const weAll = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
      let filePath = null;
      try {
        filePath = this.app?.workspace?.getActiveFile()?.path || null;
      } catch (_) {
      }
      const we = filePath ? this.filterEntriesByAdvancedRules(filePath, weAll) : weAll;
      const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const taskCheckedEntry = we.find((e) => e && e.presetLabel === "Task List (Checked)");
      const taskUncheckedEntry = we.find((e) => e && e.presetLabel === "Task List (Unchecked)");
      const bulletEntry = we.find((e) => e && e.presetLabel === "Bullet Points");
      const numberedEntry = we.find((e) => e && e.presetLabel === "Numbered Lists");
      const codeblockEntry = we.find((e) => e && e.presetLabel === "Codeblocks");
      const hasTaskCheckedBlacklist = !!blEntries.find((e) => e && e.presetLabel === "Task List (Checked)" && !!e.isRegex);
      const hasTaskUncheckedBlacklist = !!blEntries.find((e) => e && e.presetLabel === "Task List (Unchecked)" && !!e.isRegex);
      const hasBulletBlacklist = !!blEntries.find((e) => e && e.presetLabel === "Bullet Points" && !!e.isRegex);
      const hasNumberedBlacklist = !!blEntries.find((e) => e && e.presetLabel === "Numbered Lists" && !!e.isRegex);
      const hasCodeblockBlacklist = !!blEntries.find((e) => e && e.presetLabel === "Codeblocks" && !!e.isRegex);
      if (hasCodeblockBlacklist || codeblockEntry) {
        const potentialCodeblocks = [];
        element.querySelectorAll?.("pre, code").forEach((el) => potentialCodeblocks.push(el));
        element.querySelectorAll?.(".markdown-rendered pre").forEach((el) => {
          if (!potentialCodeblocks.includes(el)) potentialCodeblocks.push(el);
        });
        element.querySelectorAll?.("div").forEach((div) => {
          const text = div.textContent || "";
          const classes = (div.className || "").toLowerCase();
          if ((classes.includes("code") || classes.includes("language-") || div.querySelector("code") && div.children.length < 5) && !potentialCodeblocks.includes(div)) {
            potentialCodeblocks.push(div);
          }
        });
        if (element && (element.nodeName === "CODE" || element.nodeName === "PRE" || element.className && element.className.includes("language-"))) {
          if (!potentialCodeblocks.includes(element)) potentialCodeblocks.push(element);
        }
        const processedElements = /* @__PURE__ */ new Set();
        for (const cb of potentialCodeblocks) {
          if (processedElements.has(cb)) continue;
          processedElements.add(cb);
          if (hasCodeblockBlacklist) {
            try {
              cb.classList.add("act-skip-coloring");
              cb.style.color = "";
              const highlights = cb.querySelectorAll("span.always-color-text-highlight");
              for (const ex of highlights) {
                const tn = document.createTextNode(ex.textContent);
                ex.replaceWith(tn);
              }
            } catch (_) {
            }
          } else if (codeblockEntry) {
            try {
              this._colorCodeblockContent(cb, codeblockEntry);
            } catch (e) {
              debugError("CODEBLOCK_COLOR", "Failed to color codeblock", e);
            }
          }
        }
      }
      if (!taskCheckedEntry && !taskUncheckedEntry && !bulletEntry && !numberedEntry) return;
      let listItems = Array.from(element.querySelectorAll?.("li") || []);
      if (element && element.nodeName === "LI" && listItems.length === 0) listItems = [element];
      try {
        debugLog("MARKDOWN_FORMAT", `Found ${listItems.length} list items (node=${element.nodeName})`);
      } catch (_) {
      }
      for (const li of listItems) {
        if (li.closest("code, pre")) continue;
        const contentText = this.extractListItemContent(li);
        const contentBlacklisted = this.containsBlacklistedWord(contentText);
        try {
          debugLog("MARKDOWN_FORMAT", "LI", {
            innerHTML: (li.innerHTML || "").substring(0, 100),
            textContent: (li.textContent || "").substring(0, 100),
            hasCheckbox: !!li.querySelector('input[type="checkbox"]'),
            parentTag: li.parentElement?.tagName
          });
        } catch (_) {
        }
        const hasTaskAttr = li.getAttribute("data-task");
        const checkbox = li.querySelector('input[type="checkbox"]');
        const isTaskItem = hasTaskAttr !== null || checkbox !== null;
        if (isTaskItem && (taskCheckedEntry || taskUncheckedEntry)) {
          const isChecked = hasTaskAttr === "x" || hasTaskAttr === "X" || checkbox && checkbox.checked;
          const entry = isChecked ? taskCheckedEntry : taskUncheckedEntry;
          const blocked = isChecked && hasTaskCheckedBlacklist || !isChecked && hasTaskUncheckedBlacklist;
          if (blocked) {
            try {
              li.classList.add("act-skip-coloring");
              li.classList.remove("act-colored-list-item");
              li.style.removeProperty("--act-marker-color");
              li.style.color = "";
              const highlights = li.querySelectorAll("span.always-color-text-highlight");
              for (const ex of highlights) {
                const tn = document.createTextNode(ex.textContent);
                ex.replaceWith(tn);
              }
            } catch (_) {
            }
            continue;
          }
          if (entry) {
            if (!contentBlacklisted) this._colorListItemContent(li, entry);
            if (checkbox) this._styleCheckbox(checkbox, entry);
            else this._styleTaskMarker(li, entry);
          }
        } else if (!isTaskItem && (bulletEntry || numberedEntry)) {
          const isOrdered = li.parentElement?.tagName === "OL";
          const entry = isOrdered ? numberedEntry : bulletEntry;
          const blocked = isOrdered && hasNumberedBlacklist || !isOrdered && hasBulletBlacklist;
          if (blocked) {
            try {
              li.classList.add("act-skip-coloring");
              li.classList.remove("act-colored-list-item");
              li.style.removeProperty("--act-marker-color");
              li.style.color = "";
              const highlights = li.querySelectorAll("span.always-color-text-highlight");
              for (const ex of highlights) {
                const tn = document.createTextNode(ex.textContent);
                ex.replaceWith(tn);
              }
            } catch (_) {
            }
            continue;
          }
          if (entry) {
            if (!contentBlacklisted) this._colorListItemContent(li, entry);
            this._styleListMarker(li, entry, isOrdered);
          }
        }
      }
      let paragraphs = Array.from(element.querySelectorAll?.("p") || []);
      if (element && element.nodeName === "P" && paragraphs.length === 0) paragraphs = [element];
      for (const p of paragraphs) {
        const checkbox = p.querySelector('input[type="checkbox"]');
        if (!checkbox) continue;
        const isChecked = checkbox.checked;
        const entry = isChecked ? taskCheckedEntry : taskUncheckedEntry;
        const contentText = this.extractListItemContent(p);
        const contentBlacklistedP = this.containsBlacklistedWord(contentText);
        const blocked = isChecked && hasTaskCheckedBlacklist || !isChecked && hasTaskUncheckedBlacklist;
        if (blocked) {
          try {
            p.classList.add("act-skip-coloring");
            p.classList.remove("act-colored-list-item");
            p.style.removeProperty("--act-marker-color");
            p.style.color = "";
            const highlights = p.querySelectorAll("span.always-color-text-highlight");
            for (const ex of highlights) {
              const tn = document.createTextNode(ex.textContent);
              ex.replaceWith(tn);
            }
          } catch (_) {
          }
          continue;
        }
        if (entry) {
          this._styleCheckbox(checkbox, entry);
          if (!contentBlacklistedP) this._colorListItemContent(p, entry);
        }
      }
    } catch (e) {
      try {
        debugError("MARKDOWN_FORMAT", "Error processing markdown formatting", e);
      } catch (_) {
      }
    }
  }
  // Helper: Style checkbox elements
  _styleCheckbox(checkbox, entry) {
    try {
      const color = entry.color || entry.textColor || (entry.backgroundColor && entry.backgroundColor !== "currentColor" ? entry.backgroundColor : null);
      if (color) {
        checkbox.style.accentColor = color;
      }
    } catch (e) {
    }
  }
  // Helper: Style list markers (bullets/numbers)
  _styleListMarker(li, entry, isOrdered) {
    try {
      const color = entry.color || entry.textColor || (entry.backgroundColor && entry.backgroundColor !== "currentColor" ? entry.backgroundColor : null);
      if (color) {
        li.style.setProperty("--act-marker-color", color);
        const marker = li.querySelector(".list-bullet, .list-number");
        if (marker) {
          marker.style.color = color;
        }
        li.classList.add("act-colored-list-item");
        if (!document.getElementById("act-list-marker-style")) {
          const style = document.createElement("style");
          style.id = "act-list-marker-style";
          style.textContent = `
            .act-colored-list-item { position: relative; }
            li.act-colored-list-item::marker { color: var(--act-marker-color, inherit) !important; }
            li.act-colored-list-item .list-bullet,
            li.act-colored-list-item .list-number { color: var(--act-marker-color, inherit) !important; }
            .markdown-preview-view li.act-colored-list-item::marker { color: var(--act-marker-color, inherit) !important; }
            .markdown-reading-view li.act-colored-list-item::marker { color: var(--act-marker-color, inherit) !important; }
          `;
          try {
            document.head.appendChild(style);
          } catch (e) {
          }
        }
      }
    } catch (e) {
    }
  }
  _styleTaskMarker(li, entry) {
    try {
      const walker = document.createTreeWalker(
        li,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const t = node.textContent || "";
            if (t.includes("[x]") || t.includes("[X]") || t.includes("[ ]")) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_REJECT;
          }
        },
        false
      );
      let n;
      while (n = walker.nextNode()) {
        const color = entry.color || entry.textColor || (entry.backgroundColor && entry.backgroundColor !== "currentColor" ? entry.backgroundColor : null);
        if (!color) continue;
        const span = document.createElement("span");
        try {
          span.style.setProperty("color", color, "important");
        } catch (_) {
          span.style.color = color;
        }
        span.textContent = n.textContent;
        n.replaceWith(span);
      }
    } catch (e) {
    }
  }
  // Helper: Color list item content
  _colorListItemContent(li, entry) {
    try {
      const isLivePreview = li.closest && li.closest(".is-live-preview");
      if (isLivePreview) {
        const contentText = this.extractListItemContent(li);
        if (!contentText || !contentText.trim()) return;
        const walker2 = document.createTreeWalker(
          li,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node3) {
              if (node3.parentElement?.closest("code, pre, .always-color-text-highlight")) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          },
          false
        );
        const nodes2 = [];
        let node2;
        while (node2 = walker2.nextNode()) {
          const text = node2.textContent;
          if (!text.trim()) continue;
          const parent = node2.parentElement;
          if (parent && parent.classList && (parent.classList.contains("list-bullet") || parent.classList.contains("list-number") || parent.classList.contains("task-list-item-checkbox") || parent.classList.contains("checkbox-container"))) {
            continue;
          }
          if (parent && parent.nodeName === "INPUT") continue;
          nodes2.push(node2);
        }
        for (let i = nodes2.length - 1; i >= 0; i--) {
          this._wrapTextNodeWithColor(nodes2[i], entry);
        }
        return;
      }
      const walker = document.createTreeWalker(
        li,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node2) {
            if (node2.parentElement?.closest("code, pre, .always-color-text-highlight")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        },
        false
      );
      const nodes = [];
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
          nodes.push(node);
        }
      }
      for (let i = nodes.length - 1; i >= 0; i--) {
        this._wrapListTextNode(nodes[i], entry);
      }
    } catch (e) {
    }
  }
  // Helper: Wrap a single text node with color styling
  _wrapTextNodeWithColor(textNode, entry) {
    try {
      if (IS_DEVELOPMENT) console.time("wrapTextNodeWithColor");
      try {
        if (textNode.parentElement?.closest(".act-skip-coloring")) {
          if (IS_DEVELOPMENT) console.timeEnd("wrapTextNodeWithColor");
          return;
        }
      } catch (_) {
      }
      let text = textNode.textContent;
      if (!text.trim()) {
        if (IS_DEVELOPMENT) console.timeEnd("wrapTextNodeWithColor");
        return;
      }
      text = this.decodeHtmlEntities(text);
      const regex = entry.regex;
      if (!regex) {
        if (IS_DEVELOPMENT) console.timeEnd("wrapTextNodeWithColor");
        return;
      }
      const matches = [];
      let match;
      const globalRegex = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
      while ((match = globalRegex.exec(text)) !== null) {
        matches.push({ index: match.index, length: match[0].length });
      }
      if (matches.length === 0) {
        if (IS_DEVELOPMENT) console.timeEnd("wrapTextNodeWithColor");
        return;
      }
      const isWholeWord = (text2, startIdx, endIdx) => {
        const lc = startIdx > 0 ? text2[startIdx - 1] : "";
        const rc = endIdx < text2.length ? text2[endIdx] : "";
        const isWordChar = (ch) => /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
        return (startIdx === 0 || !isWordChar(lc)) && (endIdx === text2.length || !isWordChar(rc));
      };
      const isSentencePattern = /[\s,\.;:!\?"'\(\)\[\]\{\}<>]/.test(entry.pattern || "");
      const validMatches = [];
      for (const m of matches) {
        const matchStart = m.index;
        const matchEnd = m.index + m.length;
        if (!this.settings.partialMatch && !isSentencePattern && !isWholeWord(text, matchStart, matchEnd)) {
          continue;
        }
        validMatches.push(m);
      }
      if (validMatches.length === 0) {
        if (IS_DEVELOPMENT) console.timeEnd("wrapTextNodeWithColor");
        return;
      }
      const frag = document.createDocumentFragment();
      let lastEnd = 0;
      for (const m of validMatches) {
        const matchStart = m.index;
        const matchEnd = m.index + m.length;
        if (lastEnd < matchStart) {
          frag.appendChild(document.createTextNode(text.substring(lastEnd, matchStart)));
        }
        const span = document.createElement("span");
        span.className = "always-color-text-highlight";
        span.textContent = text.substring(matchStart, matchEnd);
        const styleType2 = entry.styleType || "text";
        const hideText = this.settings.hideTextColors === true;
        const hideBg = this.settings.hideHighlights === true;
        const textColor = entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : null;
        const resolvedTextColor = textColor || entry.color || null;
        if (styleType2 === "text") {
          if (resolvedTextColor && !hideText) {
            try {
              span.style.setProperty("color", resolvedTextColor, "important");
            } catch (_) {
              span.style.color = resolvedTextColor;
            }
          }
        } else if (styleType2 === "highlight") {
          if (!hideBg) {
            const base = entry.backgroundColor || entry.color || resolvedTextColor;
            const bgColor = this.hexToRgba(base, this.settings.backgroundOpacity ?? 25);
            try {
              span.style.setProperty("background-color", bgColor, "important");
            } catch (_) {
              span.style.backgroundColor = bgColor;
            }
            try {
              span.style.setProperty("display", "inline-block", "important");
            } catch (_) {
              span.style.display = "inline-block";
            }
            span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
            span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
          } else {
            try {
              span.style.setProperty("background-color", "transparent", "important");
            } catch (_) {
              span.style.backgroundColor = "transparent";
            }
            try {
              span.style.setProperty("display", "inline", "important");
            } catch (_) {
              span.style.display = "inline";
            }
            span.style.paddingLeft = span.style.paddingRight = "0px";
            span.style.border = "";
            span.style.borderRadius = "";
          }
        } else {
          if (resolvedTextColor && !hideText) {
            try {
              span.style.setProperty("color", resolvedTextColor, "important");
            } catch (_) {
              span.style.color = resolvedTextColor;
            }
          }
          if (!hideBg) {
            const base = entry.backgroundColor || entry.color || resolvedTextColor;
            const bgColor = this.hexToRgba(base, this.settings.backgroundOpacity ?? 25);
            try {
              span.style.setProperty("background-color", bgColor, "important");
            } catch (_) {
              span.style.backgroundColor = bgColor;
            }
            try {
              span.style.setProperty("display", "inline-block", "important");
            } catch (_) {
              span.style.display = "inline-block";
            }
            span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
            span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
          } else {
            try {
              span.style.setProperty("background-color", "transparent", "important");
            } catch (_) {
              span.style.backgroundColor = "transparent";
            }
            try {
              span.style.setProperty("display", "inline", "important");
            } catch (_) {
              span.style.display = "inline";
            }
            span.style.paddingLeft = span.style.paddingRight = "0px";
            span.style.border = "";
            span.style.borderRadius = "";
          }
        }
        frag.appendChild(span);
        lastEnd = matchEnd;
      }
      if (lastEnd < text.length) {
        frag.appendChild(document.createTextNode(text.substring(lastEnd)));
      }
      textNode.replaceWith(frag);
      if (IS_DEVELOPMENT) console.timeEnd("wrapTextNodeWithColor");
    } catch (e) {
      debugError("WRAP_TEXT_NODE", "Error wrapping text node", e);
    }
  }
  _wrapListTextNode(textNode, entry) {
    try {
      let text = textNode.textContent;
      if (!text || !text.trim()) return;
      const span = document.createElement("span");
      span.className = "always-color-text-highlight";
      span.textContent = text;
      const styleType2 = entry.styleType || "text";
      const hideText = this.settings.hideTextColors === true;
      const hideBg = this.settings.hideHighlights === true;
      const textColor = entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : null;
      const resolvedTextColor = textColor || entry.color || null;
      if (styleType2 === "text") {
        if (resolvedTextColor && !hideText) {
          try {
            span.style.setProperty("color", resolvedTextColor, "important");
          } catch (_) {
            span.style.color = resolvedTextColor;
          }
        }
      } else if (styleType2 === "highlight") {
        if (!hideBg) {
          const base = entry.backgroundColor || entry.color || resolvedTextColor;
          const bgColor = this.hexToRgba(base, this.settings.backgroundOpacity ?? 25);
          try {
            span.style.setProperty("background-color", bgColor, "important");
          } catch (_) {
            span.style.backgroundColor = bgColor;
          }
          try {
            span.style.setProperty("display", "inline-block", "important");
          } catch (_) {
            span.style.display = "inline-block";
          }
          span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
          span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
          if (this.settings.enableBoxDecorationBreak ?? true) {
            span.style.boxDecorationBreak = "clone";
            span.style.WebkitBoxDecorationBreak = "clone";
          }
          this.applyBorderStyleToElement(span, null, base);
        } else {
          try {
            span.style.setProperty("background-color", "transparent", "important");
          } catch (_) {
            span.style.backgroundColor = "transparent";
          }
          try {
            span.style.setProperty("display", "inline", "important");
          } catch (_) {
            span.style.display = "inline";
          }
          span.style.paddingLeft = span.style.paddingRight = "0px";
          span.style.border = "";
          span.style.borderRadius = "";
        }
      } else {
        if (resolvedTextColor && !hideText) {
          try {
            span.style.setProperty("color", resolvedTextColor, "important");
          } catch (_) {
            span.style.color = resolvedTextColor;
          }
        }
        if (!hideBg) {
          const base = entry.backgroundColor || entry.color || resolvedTextColor;
          const bgColor = this.hexToRgba(base, this.settings.backgroundOpacity ?? 25);
          try {
            span.style.setProperty("background-color", bgColor, "important");
          } catch (_) {
            span.style.backgroundColor = bgColor;
          }
          try {
            span.style.setProperty("display", "inline-block", "important");
          } catch (_) {
            span.style.display = "inline-block";
          }
          span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
          span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
          if (this.settings.enableBoxDecorationBreak ?? true) {
            span.style.boxDecorationBreak = "clone";
            span.style.WebkitBoxDecorationBreak = "clone";
          }
          this.applyBorderStyleToElement(span, hideText ? null : resolvedTextColor, base);
        } else {
          try {
            span.style.setProperty("background-color", "transparent", "important");
          } catch (_) {
            span.style.backgroundColor = "transparent";
          }
          try {
            span.style.setProperty("display", "inline", "important");
          } catch (_) {
            span.style.display = "inline";
          }
          span.style.paddingLeft = span.style.paddingRight = "0px";
          span.style.border = "";
          span.style.borderRadius = "";
        }
      }
      textNode.replaceWith(span);
    } catch (e) {
    }
  }
  // NEW METHOD: Color all content within a codeblock  
  _colorCodeblockContent(codeblock, entry) {
    try {
      const hideText = this.settings.hideTextColors === true;
      const hideBg = this.settings.hideHighlights === true;
      const classes = (codeblock.className || "").toLowerCase();
      const isCodeBlock = codeblock.nodeName === "CODE" || codeblock.nodeName === "PRE" || classes.includes("code") || classes.includes("language-") || codeblock.querySelector("code") || codeblock.querySelector("pre");
      if (!isCodeBlock) {
        return;
      }
      const color = entry.color || entry.textColor;
      const bgColor = entry.backgroundColor;
      const styleType2 = entry.styleType || "text";
      if (styleType2 === "text" && hideText || (styleType2 === "highlight" || styleType2 === "both") && hideBg) {
        return;
      }
      const walker = document.createTreeWalker(
        codeblock,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node2) {
            const text = node2.textContent || "";
            if (text.trim()) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_REJECT;
          }
        },
        false
      );
      const nodes = [];
      let node;
      while (node = walker.nextNode()) {
        nodes.push(node);
      }
      for (let i = nodes.length - 1; i >= 0; i--) {
        const textNode = nodes[i];
        const text = textNode.textContent;
        if (!text.trim()) continue;
        const span = document.createElement("span");
        span.className = "always-color-text-highlight";
        span.textContent = text;
        if (styleType2 === "text" && color) {
          try {
            span.style.setProperty("color", color, "important");
          } catch (_) {
            span.style.color = color;
          }
        } else if (styleType2 === "highlight" && bgColor) {
          const rgba = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
          try {
            span.style.setProperty("background-color", rgba, "important");
          } catch (_) {
            span.style.backgroundColor = rgba;
          }
          span.style.paddingLeft = (this.settings.highlightHorizontalPadding ?? 4) + "px";
          span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
          span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
          if (this.settings.enableBoxDecorationBreak ?? true) {
            span.style.boxDecorationBreak = "clone";
            span.style.WebkitBoxDecorationBreak = "clone";
          }
        } else if (styleType2 === "both") {
          if (color) {
            try {
              span.style.setProperty("color", color, "important");
            } catch (_) {
              span.style.color = color;
            }
          }
          if (bgColor) {
            const rgba = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
            try {
              span.style.setProperty("background-color", rgba, "important");
            } catch (_) {
              span.style.backgroundColor = rgba;
            }
            span.style.paddingLeft = (this.settings.highlightHorizontalPadding ?? 4) + "px";
            span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
            span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
          }
        }
        textNode.replaceWith(span);
      }
      debugLog("CODEBLOCK", `Colored codeblock with style: ${styleType2}`);
    } catch (e) {
      debugError("COLOR_CODEBLOCK", "Error coloring codeblock content", e);
    }
  }
  // NEW METHOD: Only use complex processing when absolutely necessary
  processComplexPatterns(element, complexEntries, folderEntry, options = {}) {
    const blockTags = ["P", "LI", "DIV", "SPAN", "TD", "TH", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"];
    const blocks = element.querySelectorAll?.(blockTags.join(", ")) || [];
    const BATCH_SIZE = 10;
    let processed = 0;
    for (const block of blocks) {
      if (block.closest("code, pre")) continue;
      this.processSingleBlockComplex(block, complexEntries, folderEntry, options);
      processed++;
      if (processed % BATCH_SIZE === 0) {
        setTimeout(() => {
        }, 0);
        break;
      }
    }
  }
  // --- When the plugin is UNLOADING, remove all its UI and features ---
  onunload() {
    try {
      if (this._refreshTimeout) {
        clearTimeout(this._refreshTimeout);
        this._refreshTimeout = null;
      }
      if (this._editorRefreshTimeout) {
        clearTimeout(this._editorRefreshTimeout);
        this._editorRefreshTimeout = null;
      }
    } catch (e) {
    }
    try {
      if (this.activeLeafChangeListener) {
        this.app.workspace.off("active-leaf-change", this.activeLeafChangeListener);
        this.activeLeafChangeListener = null;
      }
    } catch (e) {
    }
    try {
      this.ribbonIcon?.remove();
    } catch (e) {
    }
    try {
      this.statusBar?.remove();
    } catch (e) {
    }
    try {
      if (Array.isArray(this._compiledWordEntries) && this._compiledWordEntries.length > 0) {
        const top = this._compiledWordEntries.slice().sort((a, b) => (b.execs || 0) - (a.execs || 0)).slice(0, 5);
        if (IS_DEVELOPMENT) {
          for (const e of top) {
            debugLog("UNLOAD", `pattern: ${e.pattern}, execs: ${e.execs || 0}, avoided: ${e.avoidedExecs || 0}, matches: ${e.matchesFound || 0}`);
          }
        }
      }
    } catch (e) {
    }
    try {
      try {
        this.stopMemoryMonitor();
      } catch (e) {
      }
      try {
        this.cleanup();
      } catch (e) {
      }
      try {
        this._compiledWordEntries = [];
        this._cachedSortedEntries = null;
        this._cacheDirty = true;
      } catch (e) {
      }
    } catch (e) {
    }
    try {
      if (this.settings && Array.isArray(this.settings.wordEntries)) this.settings.wordEntries.length = 0;
    } catch (e) {
    }
    try {
      if (Array.isArray(this._eventListeners)) {
        this._eventListeners.forEach(({ el, event, handler }) => {
          try {
            el && el.removeEventListener && el.removeEventListener(event, handler);
          } catch (e) {
          }
        });
        this._eventListeners = [];
      }
    } catch (e) {
    }
    try {
      this._domRefs = /* @__PURE__ */ new WeakMap();
    } catch (e) {
    }
    try {
      if (Array.isArray(this._dynamicHandlers)) {
        this._dynamicHandlers.forEach((fn) => {
          try {
            typeof fn === "function" && fn();
          } catch (e) {
          }
        });
        this._dynamicHandlers = [];
      }
    } catch (e) {
    }
    try {
      this._eventManager && this._eventManager.clear && this._eventManager.clear();
    } catch (_) {
    }
    try {
      this._memoryManager && this._memoryManager.stop && this._memoryManager.stop();
    } catch (_) {
    }
    try {
      if (this._readingModeIntervals && this._readingModeIntervals instanceof Map) {
        for (const interval of this._readingModeIntervals.values()) {
          try {
            clearInterval(interval);
          } catch (e) {
          }
        }
        this._readingModeIntervals.clear();
      }
    } catch (e) {
    }
    try {
      this.clearAllHighlights();
    } catch (e) {
    }
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
        let sp = null;
        try {
          sp = ctx && typeof ctx.sourcePath === "string" ? ctx.sourcePath : this.app && this.app.workspace && this.app.workspace.getActiveFile && this.app.workspace.getActiveFile() ? this.app.workspace.getActiveFile().path : null;
        } catch (_) {
        }
        if (!sp) return;
        try {
          debugLog("POST_PROC", `Processing element: ${el.className}, nodeName: ${el.nodeName}, hasCallout: ${el.querySelector(".callout") ? "yes" : "no"}`);
        } catch (_) {
        }
        try {
          this.processActiveFileOnly(el, { sourcePath: sp });
        } catch (e) {
          debugWarn("ACT", "processActiveFileOnly failed", e);
        }
        try {
          const isReadingMode = el && (el.classList.contains("markdown-rendered") || el.closest(".markdown-reading-view"));
          if (isReadingMode) {
            debugLog("POST_PROC", "Detected reading mode, setting up highlight maintenance");
            this.setupReadingModeObserver(el, sp);
          }
        } catch (e) {
        }
      });
      this.markdownPostProcessorRegistered = true;
    }
    if (!this.activeLeafChangeListenerRegistered) {
      this.activeLeafChangeListener = this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf && leaf.view instanceof MarkdownView) {
          try {
            if (leaf.view.getMode && leaf.view.getMode() === "preview") {
              try {
                if (leaf.view.previewMode && typeof leaf.view.previewMode.rerender === "function") {
                  leaf.view.previewMode.rerender(true);
                } else if (typeof leaf.view.rerender === "function") {
                  leaf.view.rerender();
                } else {
                  this.forceRefreshAllReadingViews();
                }
              } catch (e) {
                this.forceRefreshAllReadingViews();
              }
              setTimeout(() => {
                try {
                  const active = this.app.workspace.getActiveViewOfType(MarkdownView);
                  if (active && active.getMode && active.getMode() === "preview") {
                    const root = active.previewMode && active.previewMode.containerEl || active.contentEl || active.containerEl;
                    if (root && active.file && active.file.path) {
                      try {
                        this.processActiveFileOnly(root, { sourcePath: active.file.path });
                      } catch (e) {
                      }
                    }
                  }
                } catch (e) {
                }
              }, 120);
            } else {
              this.refreshEditor(leaf.view, true);
              try {
                const view = leaf.view && (leaf.view.editor?.cm?.view || leaf.view.editor?.view || leaf.view.view || null);
                if (view) {
                  this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
                  this._processLivePreviewCallouts(view);
                }
              } catch (e) {
              }
            }
          } catch (e) {
          }
        }
      });
      this.registerEvent(this.activeLeafChangeListener);
      this.activeLeafChangeListenerRegistered = true;
    }
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeLeaf && activeLeaf.getMode && activeLeaf.getMode() === "preview") {
          this.forceRefreshAllReadingViews();
        } else if (activeLeaf && activeLeaf.getMode && activeLeaf.getMode() === "source") {
          try {
            this.refreshAllLivePreviewCallouts();
          } catch (_) {
          }
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        try {
          const activeFile = this.app.workspace.getActiveFile();
          if (activeFile && activeFile.path === file.path) {
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
          }
        } catch (e) {
          debugError("RENAME", "File rename handler failed", e);
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
      this.app.workspace.off("active-leaf-change", this.activeLeafChangeListener);
      this.activeLeafChangeListenerRegistered = false;
      this.activeLeafChangeListener = null;
    }
    this.refreshActiveEditor(true);
    try {
      if (!this._changelogCommandRegistered) {
        this.addCommand({
          id: "show-latest-release-notes",
          name: this.t("command_show_release_notes", "Show Latest Release Notes"),
          callback: async () => {
            try {
              new ChangelogModal(this.app, this).open();
            } catch (e) {
            }
          }
        });
        this._changelogCommandRegistered = true;
      }
    } catch (e) {
    }
  }
  // --- Load plugin settings from disk, with defaults ---
  async loadSettings() {
    const loadedData = await this.loadData() || {};
    if (!Array.isArray(loadedData.wordEntries)) loadedData.wordEntries = [];
    if (!Array.isArray(loadedData.blacklistEntries)) loadedData.blacklistEntries = [];
    if (!Array.isArray(loadedData.pathRules)) loadedData.pathRules = [];
    this.settings = Object.assign({
      // legacy: wordColors map. New model below: wordEntries array
      wordColors: {},
      wordEntries: [],
      caseSensitive: false,
      enabled: true,
      highlightStyle: "text",
      backgroundOpacity: 35,
      // percent
      highlightBorderRadius: 4,
      // px
      highlightHorizontalPadding: 4,
      // px
      enableBoxDecorationBreak: true,
      // Toggle for rounded corners on text wrapping
      enableBorderThickness: false,
      // Toggle for border on background highlights
      borderOpacity: 100,
      // percent (0-100)
      borderThickness: 2,
      // px (0-5)
      borderStyle: "full",
      // 'full', 'top', 'bottom', 'left', 'right', 'top-bottom', 'left-right', 'top-right', 'top-left', 'bottom-right', 'bottom-left'
      disabledFiles: [],
      customSwatchesEnabled: false,
      replaceDefaultSwatches: false,
      customSwatches: [],
      // Default named swatches (never edited by user, only read-only display)
      swatches: [
        { name: "Red", color: "#eb3b5a" },
        { name: "Orange", color: "#fa8231" },
        { name: "Yellow", color: "#e5a216" },
        { name: "Green", color: "#20bf6b" },
        { name: "Cyan", color: "#0fb9b1" },
        { name: "Blue", color: "#2d98da" },
        { name: "Dark Blue", color: "#3867d6" },
        { name: "Indigo", color: "#5454d0" },
        { name: "Purple", color: "#8854d0" },
        { name: "Light Purple", color: "#b554d0" },
        { name: "Neon Pink", color: "#e832c1" },
        { name: "Hot Pink", color: "#e83289" },
        { name: "Brown", color: "#965b3b" },
        { name: "Gray", color: "#8392a4" }
      ],
      // User-added custom swatches (separate from defaults)
      userCustomSwatches: [],
      disableToggleModes: {
        statusBar: false,
        command: false,
        ribbon: false
      },
      enableAlwaysHighlight: false,
      enableAlwaysColor: true,
      partialMatch: false,
      blacklistWords: [],
      // New: pattern-capable blacklist entries
      blacklistEntries: [],
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
      // Use swatch names for coloring entries
      useSwatchNamesForText: false,
      colorPickerMode: "both",
      advancedRules: [],
      pathRules: [],
      // Allow disabling regex safety checks (dangerous)
      disableRegexSafety: false,
      enableQuickColorOnce: false,
      enableQuickHighlightOnce: false,
      quickHighlightStyleEnable: false,
      quickHighlightUseGlobalStyle: false,
      quickHighlightOpacity: 25,
      quickHighlightBorderRadius: 8,
      quickHighlightHorizontalPadding: 4,
      quickHighlightEnableBorder: false,
      quickHighlightBorderStyle: "full",
      quickHighlightBorderOpacity: 100,
      quickHighlightBorderThickness: 1,
      wordsSortMode: "last-added",
      blacklistSortMode: "last-added",
      pathSortMode: "last-added",
      language: "en",
      customSwatchesFolded: false,
      // Persist custom swatches folded state
      readingModeHighlightFilter: null
      // null: show all, 'highlight': show only highlights, 'text': show only text colors
    }, loadedData);
    try {
      this.sanitizeSettings();
    } catch (e) {
    }
    try {
      if (Array.isArray(this.settings.customSwatches) && this.settings.customSwatches.length > 0) {
        const hasStringItems = this.settings.customSwatches.some((s) => typeof s === "string");
        if (hasStringItems) {
          const migrated = this.settings.customSwatches.filter((s) => typeof s === "string").map((c, idx) => ({ name: `Swatch ${idx + 1}`, color: c }));
          if (!Array.isArray(this.settings.userCustomSwatches)) {
            this.settings.userCustomSwatches = [];
          }
          const existingColors = new Set(this.settings.userCustomSwatches.map((s) => s && s.color));
          migrated.forEach((ms) => {
            if (ms && !existingColors.has(ms.color)) this.settings.userCustomSwatches.push(ms);
          });
          this.settings.customSwatches = [];
        }
      } else {
        this.settings.customSwatches = Array.isArray(this.settings.userCustomSwatches) ? this.settings.userCustomSwatches.map((s) => s.color) : [];
      }
    } catch (e) {
    }
    try {
      const defaultSwatches = [
        { name: "Red", color: "#eb3b5a" },
        { name: "Orange", color: "#fa8231" },
        { name: "Yellow", color: "#e5a216" },
        { name: "Green", color: "#20bf6b" },
        { name: "Cyan", color: "#0fb9b1" },
        { name: "Blue", color: "#2d98da" },
        { name: "Dark Blue", color: "#3867d6" },
        { name: "Indigo", color: "#5454d0" },
        { name: "Purple", color: "#8854d0" },
        { name: "Light Purple", color: "#b554d0" },
        { name: "Neon Pink", color: "#e832c1" },
        { name: "Hot Pink", color: "#e83289" },
        { name: "Brown", color: "#965b3b" },
        { name: "Gray", color: "#8392a4" }
      ];
      if (Array.isArray(this.settings.swatches) && this.settings.swatches.length > defaultSwatches.length) {
        const userAddedSwatches = this.settings.swatches.slice(defaultSwatches.length);
        if (!Array.isArray(this.settings.userCustomSwatches)) {
          this.settings.userCustomSwatches = [];
        }
        const existingColors = new Set(this.settings.userCustomSwatches.map((s) => s && s.color));
        userAddedSwatches.forEach((swatch) => {
          if (swatch && swatch.color && !existingColors.has(swatch.color)) {
            this.settings.userCustomSwatches.push(swatch);
            existingColors.add(swatch.color);
          }
        });
        this.settings.swatches = defaultSwatches;
      }
    } catch (e) {
    }
    try {
      if (Array.isArray(this.settings.pathRules)) {
        this.settings.pathRules = this.settings.pathRules.map((r) => {
          if (!r) return r;
          const mt = r.matchType;
          if (mt === "wildcard") {
            const p = String(r.path || "").trim();
            if (p.includes("*")) {
              const raw = this.normalizePath(p);
              const esc = raw.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
              const re = "^" + esc.replace(/\*/g, ".*") + "$";
              return { ...r, matchType: "regex", path: re };
            } else {
              return { ...r, matchType: "has-name" };
            }
          }
          if (!mt) {
            return { ...r, matchType: "has-name" };
          }
          return r;
        });
      }
    } catch (e) {
    }
    if (!Array.isArray(this.settings.wordEntries) || this.settings.wordEntries.length === 0) {
      const obj = this.settings.wordColors || {};
      const arr = [];
      for (const k of Object.keys(obj)) {
        const c = obj[k];
        arr.push({ pattern: String(k), color: this.isValidHexColor(String(c)) ? String(c) : "", isRegex: false, flags: "", groupedPatterns: null, styleType: "text" });
      }
      this.settings.wordEntries = arr;
    } else {
      this.settings.wordEntries = this.settings.wordEntries.map((e) => {
        if (!e) return null;
        if (typeof e === "string") return { pattern: e, color: "", isRegex: false, flags: "", groupedPatterns: null, styleType: "text" };
        const color = e.color || e.hex || "";
        const textColor = e.textColor;
        const backgroundColor = e.backgroundColor;
        const hasValidColor = this.isValidHexColor(color);
        const hasValidText = textColor === "currentColor" || this.isValidHexColor(textColor);
        const hasValidBg = this.isValidHexColor(backgroundColor);
        let styleType2 = e.styleType;
        if (!styleType2) {
          if (hasValidText && hasValidBg) styleType2 = "both";
          else if (hasValidBg) styleType2 = "highlight";
          else styleType2 = "text";
        }
        const finalColor = styleType2 === "both" || styleType2 === "highlight" ? "" : hasValidColor ? color : "";
        const finalText = hasValidText ? textColor : styleType2 === "highlight" ? "currentColor" : null;
        const finalBg = hasValidBg ? backgroundColor : null;
        return {
          pattern: e.pattern || e.word || "",
          color: finalColor,
          textColor: finalText,
          backgroundColor: finalBg,
          styleType: styleType2,
          isRegex: !!e.isRegex,
          flags: e.flags || "",
          groupedPatterns: e.groupedPatterns || null,
          presetLabel: e.presetLabel || void 0
        };
      }).filter((x) => x && String(x.pattern).trim() !== "");
    }
    try {
      const tbg = Array.isArray(this.settings.textBgColoringEntries) ? this.settings.textBgColoringEntries : [];
      if (tbg.length > 0) {
        for (const e of tbg) {
          if (!e) continue;
          const patterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : [String(e.pattern || "").trim()];
          const textColor = e.textColor || "currentColor";
          const backgroundColor = e.backgroundColor;
          const isRegex = !!e.isRegex;
          const flags = e.flags || "";
          if (!patterns[0]) continue;
          let merged = false;
          for (let i = 0; i < this.settings.wordEntries.length; i++) {
            const we = this.settings.wordEntries[i];
            if (!we) continue;
            const wePatterns = Array.isArray(we.groupedPatterns) && we.groupedPatterns.length > 0 ? we.groupedPatterns : [String(we.pattern || "").trim()];
            const match = wePatterns.some((p) => String(p).trim() === String(patterns[0]).trim());
            if (match) {
              we.textColor = textColor;
              we.backgroundColor = backgroundColor;
              we.color = "";
              we.styleType = textColor && textColor !== "currentColor" ? backgroundColor ? "both" : "text" : backgroundColor ? "highlight" : we.styleType || "text";
              we.isRegex = isRegex;
              we.flags = flags;
              we.groupedPatterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : we.groupedPatterns || null;
              merged = true;
              break;
            }
          }
          if (!merged) {
            const styleType2 = textColor && textColor !== "currentColor" ? backgroundColor ? "both" : "text" : backgroundColor ? "highlight" : "text";
            this.settings.wordEntries.push({ pattern: patterns[0], color: styleType2 === "text" ? textColor || "" : "", isRegex, flags, groupedPatterns: Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : null, textColor: styleType2 !== "text" ? textColor : null, backgroundColor, styleType: styleType2 });
          }
        }
        this.settings.textBgColoringEntries = [];
      }
    } catch (e) {
    }
    if (Array.isArray(this.settings.wordEntries) && this.settings.wordEntries.some((e) => e && e.isRegex)) {
      this.settings.enableRegexSupport = true;
    }
    if (Array.isArray(this.settings.blacklistEntries) && this.settings.blacklistEntries.some((e) => e && e.isRegex)) {
      this.settings.enableRegexSupport = true;
    }
    this.compileWordEntries();
    this.compileTextBgColoringEntries();
    try {
      this.startMemoryMonitor();
    } catch (e) {
    }
  }
  async fetchLatestRelease() {
    const url = "https://api.github.com/repos/Kazi-Aidah/always-color-text/releases/latest";
    try {
      if (typeof requestUrl === "function") {
        const res = await requestUrl({ url, headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "Obsidian-Always-Color-Text" } });
        const data = res.json || (res.text ? JSON.parse(res.text) : null);
        return data;
      }
    } catch (e) {
    }
    try {
      const r = await fetch(url, { headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "Obsidian-Always-Color-Text" } });
      if (!r.ok) throw new Error("Network error");
      return await r.json();
    } catch (e) {
      return null;
    }
  }
  async fetchAllReleases() {
    const allReleases = [];
    let page = 1;
    let hasMorePages = true;
    while (hasMorePages) {
      const url = `https://api.github.com/repos/Kazi-Aidah/always-color-text/releases?page=${page}&per_page=100`;
      try {
        let data = null;
        if (typeof requestUrl === "function") {
          try {
            const res = await requestUrl({ url, headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "Obsidian-Always-Color-Text" } });
            data = res.json || (res.text ? JSON.parse(res.text) : null);
          } catch (e) {
          }
        }
        if (!data) {
          try {
            const r = await fetch(url, { headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "Obsidian-Always-Color-Text" } });
            if (!r.ok) throw new Error("Network error");
            data = await r.json();
          } catch (e) {
            hasMorePages = false;
            break;
          }
        }
        if (!Array.isArray(data) || data.length === 0) {
          hasMorePages = false;
        } else {
          allReleases.push(...data);
          if (data.length < 100) {
            hasMorePages = false;
          } else {
            page++;
          }
        }
      } catch (e) {
        hasMorePages = false;
      }
    }
    return allReleases;
  }
  // --- Save settings and refresh plugin state ---
  async saveSettings() {
    try {
      this.sanitizeSettings();
    } catch (e) {
    }
    await this.saveData(this.settings);
    this.compileWordEntries();
    this.compileTextBgColoringEntries();
    this.disablePluginFeatures();
    if (this.settings.enabled) {
      this.enablePluginFeatures();
    }
    this.updateStatusBar();
    try {
      this.forceRefreshAllEditors();
    } catch (e) {
    }
    try {
      this.forceRefreshAllReadingViews();
    } catch (e) {
    }
  }
  async exportSettingsToVault() {
    const payload = this.buildExportPayload();
    const d = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fname = `always-color-text-export-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.json`;
    const path = `.obsidian/plugins/always-color-text/${fname}`;
    await this.app.vault.adapter.write(path, JSON.stringify(payload, null, 2));
    return path;
  }
  async importSettingsFromJson(text) {
    let obj = null;
    try {
      obj = JSON.parse(String(text || ""));
    } catch (e) {
      throw new Error("invalid json");
    }
    const incoming = obj && obj.settings ? obj.settings : obj;
    if (!incoming || typeof incoming !== "object") throw new Error("invalid payload");
    const merged = Object.assign({}, this.settings, incoming);
    this.settings = merged;
    try {
      this.sanitizeSettings();
    } catch (e) {
    }
    await this.saveSettings();
    this.reconfigureEditorExtensions();
    this.forceRefreshAllEditors();
    this.forceRefreshAllReadingViews();
  }
  buildExportPayload() {
    return { plugin: "always-color-text", version: this.manifest && this.manifest.version || "", settings: this.settings };
  }
  async exportSettingsToPickedLocation() {
    const payload = this.buildExportPayload();
    const json = JSON.stringify(payload, null, 2);
    const d = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fname = `always-color-text-export-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.json`;
    try {
      const { Platform } = require("obsidian");
      const isMobile = !!(Platform && (Platform.isMobileApp || Platform.isMobile));
      if (isMobile) {
        try {
          if (typeof navigator !== "undefined") {
            const file = new File([json], fname, { type: "application/json" });
            const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
            if (canShare && navigator.share) {
              await navigator.share({ files: [file], title: fname, text: "Always Color Text export" });
              return fname;
            }
          }
        } catch (e) {
        }
        return await this.exportSettingsToVault();
      }
      if (typeof window === "undefined") {
        return await this.exportSettingsToVault();
      }
    } catch (e) {
    }
    if (typeof window !== "undefined" && window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({ suggestedName: fname, types: [{ description: "JSON", accept: { "application/json": [".json"] } }] });
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        return fname;
      } catch (e) {
        return await this.exportSettingsToVault();
      }
    } else {
      try {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          try {
            document.body.removeChild(a);
          } catch (e) {
          }
          try {
            URL.revokeObjectURL(url);
          } catch (e) {
          }
        }, 0);
        return fname;
      } catch (e) {
        return await this.exportSettingsToVault();
      }
    }
  }
  sanitizeSettings() {
    try {
      const s = this.settings || {};
      if (!Array.isArray(s.wordEntries)) s.wordEntries = [];
      if (!Array.isArray(s.blacklistEntries)) s.blacklistEntries = [];
      if (!Array.isArray(s.pathRules)) s.pathRules = [];
      s.wordEntries = s.wordEntries.map((e) => {
        const x = Object.assign({}, e || {});
        x.pattern = String(x.pattern || "");
        if (Array.isArray(x.groupedPatterns)) {
          x.groupedPatterns = x.groupedPatterns.map((p) => String(p || "")).filter((p) => (p || "").length > 0);
          if (x.groupedPatterns.length === 0) x.groupedPatterns = null;
        } else {
          x.groupedPatterns = null;
        }
        x.color = this.isValidHexColor(x.color) ? x.color : "";
        x.textColor = x.textColor && x.textColor !== "currentColor" && this.isValidHexColor(x.textColor) ? x.textColor : x.textColor === "currentColor" ? "currentColor" : null;
        x.backgroundColor = this.isValidHexColor(x.backgroundColor) ? x.backgroundColor : null;
        x.flags = String(x.flags || "").replace(/[^gimsuy]/g, "");
        x.isRegex = !!x.isRegex;
        x.styleType = x.styleType || (x.backgroundColor ? x.textColor && x.textColor !== "currentColor" ? "both" : "highlight" : x.color ? "text" : "text");
        x._savedTextColor = x._savedTextColor && this.isValidHexColor(x._savedTextColor) ? x._savedTextColor : this.isValidHexColor(x.color) ? x.color : null;
        x._savedBackgroundColor = x._savedBackgroundColor && this.isValidHexColor(x._savedBackgroundColor) ? x._savedBackgroundColor : this.isValidHexColor(x.backgroundColor) ? x.backgroundColor : null;
        return x;
      });
      s.blacklistEntries = s.blacklistEntries.map((e) => {
        const x = Object.assign({}, e || {});
        x.pattern = String(x.pattern || "");
        if (Array.isArray(x.groupedPatterns)) {
          x.groupedPatterns = x.groupedPatterns.map((p) => String(p || "")).filter((p) => (p || "").length > 0);
          if (x.groupedPatterns.length === 0) x.groupedPatterns = null;
        } else {
          x.groupedPatterns = null;
        }
        x.flags = String(x.flags || "").replace(/[^gimsuy]/g, "");
        x.isRegex = !!x.isRegex;
        return x;
      });
      s.pathRules = s.pathRules.map((r) => {
        const x = Object.assign({}, r || {});
        x.path = String(x.path || "");
        x.mode = x.mode === "exclude" ? "exclude" : "include";
        x.matchType = x.matchType === "regex" ? "regex" : x.matchType === "exact" ? "exact" : x.matchType === "has-name" ? "has-name" : "has-name";
        x.isFolder = !!x.isFolder;
        return x;
      });
      s.enableQuickColorOnce = !!s.enableQuickColorOnce;
      s.enableQuickHighlightOnce = !!s.enableQuickHighlightOnce;
      s.quickHighlightStyleEnable = !!s.quickHighlightStyleEnable;
      s.quickHighlightUseGlobalStyle = !!s.quickHighlightUseGlobalStyle;
      s.quickHighlightOpacity = Math.max(0, Math.min(100, Number(s.quickHighlightOpacity ?? 25)));
      s.quickHighlightBorderRadius = Math.max(0, parseInt(s.quickHighlightBorderRadius ?? 8) || 0);
      s.quickHighlightHorizontalPadding = Math.max(0, parseInt(s.quickHighlightHorizontalPadding ?? 4) || 0);
      s.quickHighlightEnableBorder = !!s.quickHighlightEnableBorder;
      s.quickHighlightBorderStyle = String(s.quickHighlightBorderStyle || "full");
      s.quickHighlightBorderOpacity = Math.max(0, Math.min(100, Number(s.quickHighlightBorderOpacity ?? 100)));
      s.quickHighlightBorderThickness = Math.max(0, Math.min(5, Number(s.quickHighlightBorderThickness ?? 1)));
      s.hideHighlights = !!s.hideHighlights;
      s.hideTextColors = !!s.hideTextColors;
      const allowedSort = /* @__PURE__ */ new Set(["last-added", "a-z", "reverse-a-z", "style-order", "color"]);
      if (!allowedSort.has(s.wordsSortMode)) s.wordsSortMode = "last-added";
      const allowedBl = /* @__PURE__ */ new Set(["last-added", "a-z", "reverse-a-z"]);
      if (!allowedBl.has(s.blacklistSortMode)) s.blacklistSortMode = "last-added";
      const allowedPath = /* @__PURE__ */ new Set(["last-added", "a-z", "reverse-a-z", "mode", "type"]);
      if (!allowedPath.has(s.pathSortMode)) s.pathSortMode = "last-added";
      s.language = String(s.language || "en");
      this.settings = s;
    } catch (e) {
    }
  }
  // --- Save a persistent color for a word ---
  async saveEntry(word, color) {
    const pattern = String(word);
    const col = String(color);
    debugLog("SAVE", "saveEntry", { pattern, color: col });
    const idx = this.settings.wordEntries.findIndex((e) => e && e.pattern === pattern && !e.isRegex);
    if (idx !== -1) {
      this.settings.wordEntries[idx].color = col;
      this.settings.wordEntries[idx].styleType = "text";
      this.settings.wordEntries[idx].textColor = null;
      this.settings.wordEntries[idx].backgroundColor = null;
    } else {
      this.settings.wordEntries.push({
        pattern,
        color: col,
        isRegex: false,
        flags: "",
        styleType: "text",
        // EXPLICITLY SET TO TEXT
        textColor: null,
        // Ensure no textColor
        backgroundColor: null
        // Ensure no backgroundColor
      });
    }
    await this.saveSettings();
    this.reconfigureEditorExtensions();
  }
  // --- FORCE REFRESH all open Markdown editors ---
  forceRefreshAllEditors() {
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view instanceof MarkdownView && leaf.view.editor?.cm) {
        leaf.view.editor.cm.dispatch({ changes: [] });
      }
    });
    try {
      if (Array.isArray(this.settings.blacklistWords) && this.settings.blacklistWords.length > 0) {
        const existing = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
        const existingPatterns = new Set(existing.map((e) => e && e.pattern));
        const migrated = this.settings.blacklistWords.filter((w) => typeof w === "string" && String(w).length > 0).map((w) => ({ pattern: String(w), isRegex: false, flags: "", groupedPatterns: null }));
        migrated.forEach((m) => {
          if (m && !existingPatterns.has(m.pattern)) existing.push(m);
        });
        this.settings.blacklistEntries = existing;
      } else if (!Array.isArray(this.settings.blacklistEntries)) {
        this.settings.blacklistEntries = [];
      }
    } catch (e) {
    }
  }
  // Clear all highlight spans from the entire document (used when disabling plugin)
  clearAllHighlights() {
    try {
      const highlights = document.querySelectorAll(".always-color-text-highlight");
      for (const hl of highlights) {
        try {
          const textNode = document.createTextNode(hl.textContent);
          hl.replaceWith(textNode);
        } catch (_) {
        }
      }
      debugLog("CLEAR_ALL", `Cleared ${highlights.length} highlights`);
    } catch (e) {
      debugError("CLEAR_ALL", "Failed to clear highlights", e);
    }
  }
  // --- FORCE REFRESH all reading views (reading mode panes) ---
  forceRefreshAllReadingViews() {
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view instanceof MarkdownView && leaf.view.getMode && leaf.view.getMode() === "preview") {
        if (typeof leaf.view.previewMode?.rerender === "function") {
          leaf.view.previewMode.rerender(true);
        } else if (typeof leaf.view.previewMode?.render === "function") {
          leaf.view.previewMode.render();
        } else if (typeof leaf.view?.rerender === "function") {
          leaf.view.rerender();
        }
        try {
          if (this.settings.enabled) {
            const root = leaf.view.previewMode && leaf.view.previewMode.containerEl || leaf.view.contentEl || leaf.view.containerEl;
            const path = leaf.view.file && leaf.view.file.path ? leaf.view.file.path : null;
            if (root && path) {
              try {
                this.processActiveFileOnly(root, { sourcePath: path });
              } catch (_) {
              }
            }
          }
        } catch (_) {
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
  // --- Trigger active document rerender ---
  triggerActiveDocumentRerender() {
    if (this._lastRerender && Date.now() - this._lastRerender < 100) {
      return;
    }
    this._lastRerender = Date.now();
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      this.refreshEditor(activeView, true);
      setTimeout(() => {
        this.forceRefreshAllEditors();
        this.forceRefreshAllReadingViews();
      }, 50);
      return;
    }
    this.forceRefreshAllEditors();
    this.forceRefreshAllReadingViews();
    if (activeView) {
      this.refreshEditor(activeView, true);
      if (activeView.getMode && activeView.getMode() === "preview") {
        try {
          if (activeView.previewMode && typeof activeView.previewMode.rerender === "function") {
            activeView.previewMode.rerender(true);
          }
        } catch (e) {
          setTimeout(() => {
            try {
              const root = activeView.previewMode && activeView.previewMode.containerEl || activeView.contentEl || activeView.containerEl;
              if (root && activeView.file && activeView.file.path) {
                this.processActiveFileOnly(root, { sourcePath: activeView.file.path });
              }
            } catch (err) {
              this.forceRefreshAllReadingViews();
            }
          }, 100);
        }
      }
    }
  }
  // --- Update Status Bar Text ---
  updateStatusBar() {
    if (this.statusBar) {
      this.statusBar.setText(`COL: ${this.settings.enabled ? "ON" : "OFF"}`);
    }
  }
  // --- Refresh only the Active Editor!!! ---
  refreshActiveEditor(force = false) {
    if (this._refreshTimeout) clearTimeout(this._refreshTimeout);
    this._refreshSeq = (this._refreshSeq || 0) + 1;
    const token = this._refreshSeq;
    const callback = () => {
      if (token !== this._refreshSeq) return;
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
      this._editorRefreshSeq = (this._editorRefreshSeq || 0) + 1;
      const token = this._editorRefreshSeq;
      const callback = () => {
        if (token !== this._editorRefreshSeq) return;
        if (!view?.editor?.cm) return;
        try {
          const cm = view.editor.cm;
          cm.dispatch({ changes: [] });
        } catch (e) {
        }
      };
      this._editorRefreshTimeout = setTimeout(callback, 100);
    }
  }
  // --- Escape Regex Special Characters ---
  escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  // NEW HELPER: Check if a match is a whole word (word boundaries on both sides)
  isWholeWordMatch(text, matchStart, matchEnd) {
    const leftChar = matchStart > 0 ? text[matchStart - 1] : "";
    const rightChar = matchEnd < text.length ? text[matchEnd] : "";
    const isWordChar = (ch) => /[A-Za-z0-9]/.test(ch) || ch === "-" || ch === "'";
    const leftOk = matchStart === 0 || !isWordChar(leftChar);
    const rightOk = matchEnd === text.length || !isWordChar(rightChar);
    return leftOk && rightOk;
  }
  isSentenceLikePattern(p) {
    try {
      const s = String(p || "");
      return /[\s,\.;:!\?"'\(\)\[\]\{\}<>@#]/.test(s);
    } catch (e) {
      return false;
    }
  }
  safeRegexTest(regex, text, timeout = 50) {
    if (this.containsNonRomanCharacters(text)) {
      try {
        return Promise.resolve(regex.test(text));
      } catch (e) {
        return Promise.resolve(false);
      }
    }
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(false);
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
    const maxIterations = 1e3;
    try {
      while (safetyCounter < maxIterations) {
        const match = regex.exec(text);
        if (!match) break;
        matches.push(match);
        if (regex.lastIndex === lastIndex) break;
        lastIndex = regex.lastIndex;
        safetyCounter++;
      }
    } catch (e) {
      debugWarn("MATCH", "safeMatchLoop error", e);
    }
    return matches;
  }
  // Create a lightweight fastTest function to reject texts that cannot contain the pattern
  createFastTester(pattern, isRegex, caseSensitive) {
    try {
      if (!pattern) return (text) => {
        const bloom2 = this._bloomFilter;
        if (bloom2 && !bloom2.mightContain(text)) return false;
        return true;
      };
      const isPresetPattern = pattern && (pattern.includes("am") || pattern.includes("@[a-zA-Z"));
      const bloom = this._bloomFilter;
      const withBloom = isPresetPattern ? (fn) => fn : (fn) => (text) => {
        if (bloom && !bloom.mightContain(text)) return false;
        return fn(text);
      };
      if (this.containsNonRomanCharacters(pattern)) {
        if (caseSensitive) {
          return withBloom((text) => typeof text === "string" && text.includes(pattern));
        } else {
          const lowerPattern = pattern.toLowerCase();
          return withBloom((text) => typeof text === "string" && text.toLowerCase().includes(lowerPattern));
        }
      }
      if (!isRegex) {
        if (caseSensitive) {
          return withBloom((text) => typeof text === "string" && text.includes(pattern));
        } else {
          const lowerPattern = pattern.toLowerCase();
          return withBloom((text) => typeof text === "string" && text.toLowerCase().includes(lowerPattern));
        }
      }
      try {
        if (pattern.includes("$") || pattern.includes("\u20AC") || pattern.includes("\xA3")) {
          return withBloom((text) => typeof text === "string" && (text.includes("$") || text.includes("\u20AC") || text.includes("\xA3")));
        }
        if (pattern.includes(":")) {
          return withBloom((text) => typeof text === "string" && text.includes(":"));
        }
        if (pattern.includes("@")) {
          return withBloom((text) => typeof text === "string" && text.includes("@"));
        }
        if (pattern.includes("-")) {
          return withBloom((text) => typeof text === "string" && text.includes("-"));
        }
        const literalMatch = pattern.match(/[A-Za-z]{3,}/);
        if (literalMatch) {
          const literal = literalMatch[0];
          if (caseSensitive) {
            return withBloom((text) => typeof text === "string" && text.includes(literal));
          } else {
            const lowerLiteral = literal.toLowerCase();
            return withBloom((text) => typeof text === "string" && text.toLowerCase().includes(lowerLiteral));
          }
        }
      } catch (e) {
      }
    } catch (e) {
    }
    return (text) => {
      const bloom = this._bloomFilter;
      if (bloom && !bloom.mightContain(text)) return false;
      return true;
    };
  }
  // --- Lightweight mode decision for very large documents ---
  shouldUseLightweightMode(textLength, textContent = "") {
    try {
      const isLargeDoc = Number(textLength) > 5e4;
      const isNonRomanHeavy = this.getNonRomanCharacterRatio(textContent) > 0.3;
      return isLargeDoc || isNonRomanHeavy;
    } catch (e) {
      return false;
    }
  }
  // NEW METHOD: Check if we should skip complex processing
  isPerformanceOverloaded() {
    try {
      if (typeof performance !== "undefined" && performance.memory) {
        const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
        if (usedMB > 1e3) {
          debugWarn("[ACT] High memory usage, skipping complex pattern processing");
          return true;
        }
      }
      const totalEntries = this.getSortedWordEntries().length;
      if (totalEntries > 100) {
        debugLog("ACT", "Many patterns defined, using conservative processing");
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  // --- Get Sorted Word Entries (Longest words first!!!) ---
  getSortedWordEntries() {
    if (!this._cachedSortedEntries || this._cacheDirty) {
      const textEntries = Array.isArray(this._compiledWordEntries) ? this._compiledWordEntries : [];
      const bgEntries = Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : [];
      const entries = textEntries.concat(bgEntries);
      const numWords = entries.length;
      if (numWords > 500) {
        debugWarn("GET_SORTED", `You have ${numWords} colored words/patterns! That's a lot and may impact performance.`);
      }
      let filtered = entries.filter((e) => {
        if (!e || !e.pattern) return false;
        const bw = Array.isArray(this.settings.blacklistWords) ? this.settings.blacklistWords : [];
        if (this.settings.caseSensitive) {
          if (bw.includes(e.pattern)) return false;
        } else {
          const lower = e.pattern.toLowerCase();
          if (bw.map((w) => String(w).toLowerCase()).includes(lower)) return false;
        }
        const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
        for (const be of blEntries) {
          if (!be || be.isRegex) continue;
          const patterns = Array.isArray(be.groupedPatterns) && be.groupedPatterns.length > 0 ? be.groupedPatterns : [be.pattern];
          for (const p of patterns) {
            if (!p) continue;
            if (this.settings.caseSensitive) {
              if (p === e.pattern) return false;
            } else {
              if (String(p).toLowerCase() === e.pattern.toLowerCase()) return false;
            }
          }
        }
        return true;
      });
      if (this.settings.hideHighlights || this.settings.hideTextColors) {
        filtered = filtered.map((orig) => {
          const e = Object.assign({}, orig);
          if (this.settings.hideHighlights) {
            if (e.styleType === "highlight") return null;
            if (e.styleType === "both" && !e.isTextBg) {
              e.styleType = "text";
              e.backgroundColor = null;
              e.textColor = e.textColor || e.color || null;
            }
            if (e.backgroundColor && !e.styleType && !e.isTextBg) {
              e.backgroundColor = null;
              e.styleType = "text";
              e.textColor = e.textColor || e.color || null;
            }
          }
          if (this.settings.hideTextColors) {
            if (e.styleType === "text") return null;
            if (e.styleType === "both") {
              e.styleType = "highlight";
            }
            if (!e.styleType && e.color && !e.backgroundColor) {
              return null;
            }
          }
          return e;
        }).filter(Boolean);
      }
      this._cachedSortedEntries = filtered;
      this._cacheDirty = false;
    }
    return this._cachedSortedEntries;
  }
  // --- Helper: Convert hex to rgba with opacity ---
  // Helper: Validate hex color format to prevent CSS injection
  isValidHexColor(hex) {
    if (hex === "inherit" || hex === "currentColor") return true;
    if (typeof hex !== "string") return false;
    if (hex.includes(";") || hex.toLowerCase().includes("!important") || /\s/.test(hex)) return false;
    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    return hexRegex.test(hex);
  }
  hexToRgba(hex, opacityPercent) {
    if (!this.isValidHexColor(hex)) {
      return `rgba(0,0,0,1)`;
    }
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    const r = num >> 16 & 255;
    const g = num >> 8 & 255;
    const b = num & 255;
    let o = Math.max(0, Math.min(100, Number(opacityPercent)));
    o = o / 100;
    return `rgba(${r},${g},${b},${o})`;
  }
  hexToHexWithAlpha(hex, opacityPercent) {
    try {
      const h = String(hex || "").trim();
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(h)) return h;
      const pct = Math.max(0, Math.min(100, Number(opacityPercent)));
      const alpha = Math.round(pct / 100 * 255).toString(16).padStart(2, "0");
      if (h.length === 4) {
        const r = h[1];
        const g = h[2];
        const b = h[3];
        const full = `#${r}${r}${g}${g}${b}${b}`;
        return `${full}${alpha}`;
      }
      return `${h}${alpha}`;
    } catch (_) {
      return hex;
    }
  }
  // Helper: Apply border style to a span element based on settings
  applyBorderStyleToElement(element, textColor, backgroundColor) {
    if (this.settings.hideHighlights === true || !this.settings.enableBorderThickness) {
      element.style.border = "";
      element.style.borderTop = "";
      element.style.borderRight = "";
      element.style.borderBottom = "";
      element.style.borderLeft = "";
      return;
    }
    const borderThickness = this.settings.borderThickness ?? 1;
    const borderOpacity = this.settings.borderOpacity ?? 100;
    let sourceColor = null;
    if (textColor && textColor !== "currentColor" && this.isValidHexColor(textColor)) {
      sourceColor = textColor;
    } else if (backgroundColor && this.isValidHexColor(backgroundColor)) {
      sourceColor = backgroundColor;
    } else {
      sourceColor = "#000000";
    }
    const borderColorRgba = this.hexToRgba(sourceColor, borderOpacity);
    const borderStyleType = this.settings.borderStyle ?? "full";
    const borderCSS = `${borderThickness}px solid ${borderColorRgba}`;
    switch (borderStyleType) {
      case "bottom":
        element.style.borderBottom = borderCSS;
        break;
      case "top":
        element.style.borderTop = borderCSS;
        break;
      case "left":
        element.style.borderLeft = borderCSS;
        break;
      case "right":
        element.style.borderRight = borderCSS;
        break;
      case "top-bottom":
        element.style.borderTop = borderCSS;
        element.style.borderBottom = borderCSS;
        break;
      case "left-right":
        element.style.borderLeft = borderCSS;
        element.style.borderRight = borderCSS;
        break;
      case "top-right":
        element.style.borderTop = borderCSS;
        element.style.borderRight = borderCSS;
        break;
      case "top-left":
        element.style.borderTop = borderCSS;
        element.style.borderLeft = borderCSS;
        break;
      case "bottom-right":
        element.style.borderBottom = borderCSS;
        element.style.borderRight = borderCSS;
        break;
      case "bottom-left":
        element.style.borderBottom = borderCSS;
        element.style.borderLeft = borderCSS;
        break;
      case "full":
      default:
        element.style.border = borderCSS;
        break;
    }
  }
  // Helper: Generate border CSS string based on settings (border always uses text color)
  generateBorderStyle(textColor, backgroundColor) {
    if (this.settings.hideHighlights === true || !this.settings.enableBorderThickness) {
      return "";
    }
    const borderThickness = this.settings.borderThickness ?? 1;
    const borderOpacity = this.settings.borderOpacity ?? 100;
    let borderColor;
    if (textColor && textColor !== "currentColor" && this.isValidHexColor(textColor)) {
      borderColor = this.hexToRgba(textColor, borderOpacity);
    } else if (backgroundColor && this.isValidHexColor(backgroundColor)) {
      borderColor = this.hexToRgba(backgroundColor, borderOpacity);
    } else {
      borderColor = "rgba(0,0,0,1)";
    }
    const borderStyleType = this.settings.borderStyle ?? "full";
    const borderCSS = `${borderThickness}px solid ${borderColor} !important;`;
    switch (borderStyleType) {
      case "bottom":
        return ` border-bottom: ${borderCSS}`;
      case "top":
        return ` border-top: ${borderCSS}`;
      case "left":
        return ` border-left: ${borderCSS}`;
      case "right":
        return ` border-right: ${borderCSS}`;
      case "top-bottom":
        return ` border-top: ${borderCSS} border-bottom: ${borderCSS}`;
      case "left-right":
        return ` border-left: ${borderCSS} border-right: ${borderCSS}`;
      case "top-right":
        return ` border-top: ${borderCSS} border-right: ${borderCSS}`;
      case "top-left":
        return ` border-top: ${borderCSS} border-left: ${borderCSS}`;
      case "bottom-right":
        return ` border-bottom: ${borderCSS} border-right: ${borderCSS}`;
      case "bottom-left":
        return ` border-bottom: ${borderCSS} border-left: ${borderCSS}`;
      case "full":
      default:
        return ` border: ${borderCSS}`;
    }
  }
  generateOnceBorderStyle(backgroundColor) {
    try {
      if (this.settings.hideHighlights === true) return "";
      if (!this.settings.quickHighlightEnableBorder) return "";
      const thickness = this.settings.quickHighlightBorderThickness ?? 1;
      const opacity = this.settings.quickHighlightBorderOpacity ?? 100;
      const borderColor = this.hexToRgba(backgroundColor, opacity);
      const type = this.settings.quickHighlightBorderStyle ?? "full";
      const css = `${thickness}px solid ${borderColor}`;
      switch (type) {
        case "bottom":
          return ` border-bottom: ${css};`;
        case "top":
          return ` border-top: ${css};`;
        case "left":
          return ` border-left: ${css};`;
        case "right":
          return ` border-right: ${css};`;
        case "top-bottom":
          return ` border-top: ${css}; border-bottom: ${css};`;
        case "left-right":
          return ` border-left: ${css}; border-right: ${css};`;
        case "top-right":
          return ` border-top: ${css}; border-right: ${css};`;
        case "top-left":
          return ` border-top: ${css}; border-left: ${css};`;
        case "bottom-right":
          return ` border-bottom: ${css}; border-right: ${css};`;
        case "bottom-left":
          return ` border-bottom: ${css}; border-left: ${css};`;
        case "full":
        default:
          return ` border: ${css};`;
      }
    } catch (_) {
      return "";
    }
  }
  // Helper: Extract color and background from selected HTML text in editor
  extractSelectedTextStyles(selectedText) {
    try {
      if (!selectedText || typeof selectedText !== "string") {
        return { textColor: null, backgroundColor: null };
      }
      const spanMatch = selectedText.match(/<span\s+(?:class="[^"]*"\s+)?style="([^"]*)"/i);
      if (!spanMatch || !spanMatch[1]) {
        return { textColor: null, backgroundColor: null };
      }
      const styleString = spanMatch[1];
      let textColor = null;
      let backgroundColor = null;
      const colorMatch = styleString.match(/color\s*:\s*(#[0-9A-Fa-f]{3,6}|rgb\([^)]*\)|rgba\([^)]*\)|[a-z]+)/i);
      if (colorMatch && colorMatch[1]) {
        const colorValue = colorMatch[1].trim();
        if (/^#[0-9A-Fa-f]{3,6}$/.test(colorValue)) {
          textColor = colorValue;
        }
      }
      const bgMatch = styleString.match(/background-color\s*:\s*(#[0-9A-Fa-f]{3,6}|rgb\([^)]*\)|rgba\([^)]*\)|[a-z]+)/i);
      if (bgMatch && bgMatch[1]) {
        const bgValue = bgMatch[1].trim();
        if (/^#[0-9A-Fa-f]{3,6}$/.test(bgValue)) {
          backgroundColor = bgValue;
        }
      }
      return { textColor, backgroundColor };
    } catch (e) {
      debugError("EXTRACT_STYLES", e);
      return { textColor: null, backgroundColor: null };
    }
  }
  // Helper: Check frontmatter for disabling coloring (`always-color-text: false` disables)
  isFrontmatterColoringDisabled(source) {
    if (!source) return false;
    const { TFile } = require("obsidian");
    let file = null;
    if (typeof source === "string") {
      file = this.app.vault.getAbstractFileByPath(source);
    } else if (source instanceof TFile) {
      file = source;
    } else if (source.path) {
      file = source;
    }
    if (!file) return false;
    const cache = this.app.metadataCache.getFileCache(file);
    if (!cache || !cache.frontmatter) return false;
    if (Object.prototype.hasOwnProperty.call(cache.frontmatter, "always-color-text")) {
      return cache.frontmatter["always-color-text"] === false;
    }
    return false;
  }
  // --- Helper: RegExp Folder Pattern ---
  normalizePath(p) {
    return String(p || "").replace(/\\/g, "/");
  }
  _folderPatternToRegExp(p) {
    const raw = this.normalizePath(p).replace(/\/$/, "");
    const esc = raw.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    const re = "^" + esc.replace(/\*/g, ".*") + "(?:/.*)?$";
    try {
      return new RegExp(re);
    } catch (e) {
      return null;
    }
  }
  _pathPatternToRegExp(p) {
    const raw = this.normalizePath(p);
    const esc = raw.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    const re = "^" + esc.replace(/\*/g, ".*") + "$";
    try {
      return new RegExp(re);
    } catch (e) {
      return null;
    }
  }
  _basename(p) {
    const fp = this.normalizePath(p);
    const idx = fp.lastIndexOf("/");
    return idx === -1 ? fp : fp.slice(idx + 1);
  }
  _parentFolders(p) {
    const fp = this.normalizePath(p);
    const parts = fp.split("/");
    parts.pop();
    const res = [];
    let acc = "";
    for (const part of parts) {
      acc = acc ? acc + "/" + part : part;
      res.push(acc);
    }
    return res;
  }
  detectRuleTarget(path, matchType) {
    const s = String(path || "");
    const hasSlash = s.includes("/");
    const endsWithSlash = /\/$/.test(s);
    const hasStarSlash = s.includes("*/");
    const hasExt = /\.[a-zA-Z0-9]+$/.test(s);
    const hasStarDotStar = s.includes("*.*");
    if (matchType === "exact") {
      if (endsWithSlash || hasStarSlash) return "folder";
      if (hasExt || hasStarDotStar) return "file";
      return hasSlash ? "folder" : "file";
    }
    if (matchType === "regex") {
      return "both";
    }
    if (matchType === "has-name") {
      return "both";
    }
    return "both";
  }
  detectRuleKind(path) {
    const s = String(path || "").trim();
    if (!s) return { kind: "vault" };
    const isParenRegex = s.startsWith("(") && s.endsWith(")");
    if (isParenRegex) return { kind: "regex", pattern: s.slice(1, -1) };
    if (/\/$/.test(s)) return { kind: "exact-folder", path: s.replace(/\/$/, "") };
    if (s.includes("/")) return { kind: "exact-file", path: s };
    return { kind: "name", name: s };
  }
  _matchesByName(filePath, name) {
    const fp = this.normalizePath(filePath);
    const nm = String(name || "").trim();
    if (!nm) return { fileMatch: true, folderMatch: true };
    const base = this._basename(fp);
    const stem = base.replace(/\.[^/.]+$/, "");
    const fileMatch = base === nm || stem === nm;
    let folderMatch = false;
    const parents = this._parentFolders(fp);
    for (const folder of parents) {
      if (this._basename(folder) === nm) {
        folderMatch = true;
        break;
      }
    }
    return { fileMatch, folderMatch };
  }
  _matchFolder(pattern, filePath) {
    const fp = this.normalizePath(filePath);
    const re = this._folderPatternToRegExp(pattern);
    return !!(re && re.test(fp));
  }
  _matchFile(rulePath, filePath) {
    const a = this.normalizePath(rulePath);
    const b = this.normalizePath(filePath);
    return a === b;
  }
  evaluatePathRules(filePath) {
    const rules = Array.isArray(this.settings.pathRules) ? this.settings.pathRules : [];
    if (!filePath || rules.length === 0) return { included: false, excluded: false, hasIncludes: false };
    const fp = this.normalizePath(filePath);
    let fileInclude = false;
    let fileExclude = false;
    let folderInclude = false;
    let folderExclude = false;
    let hasIncludes = false;
    const parents = this._parentFolders(fp);
    for (const r of rules) {
      if (!r) continue;
      const mode = r.mode === "exclude" ? "exclude" : "include";
      const pathStr = String(r.path || "").trim();
      const pathEmpty = pathStr.length === 0;
      if (mode === "include") hasIncludes = true;
      if (pathEmpty) {
        if (mode === "include") {
          folderInclude = true;
          fileInclude = true;
        } else {
          folderExclude = true;
          fileExclude = true;
        }
        continue;
      }
      const dk = this.detectRuleKind(pathStr);
      if (dk.kind === "name") {
        const { fileMatch, folderMatch } = this._matchesByName(fp, dk.name);
        if (fileMatch) {
          if (mode === "include") fileInclude = true;
          else fileExclude = true;
        }
        if (folderMatch) {
          if (mode === "include") folderInclude = true;
          else folderExclude = true;
        }
        continue;
      }
      if (dk.kind === "exact-folder") {
        for (const p of parents) {
          if (this.normalizePath(p) === this.normalizePath(dk.path)) {
            if (mode === "include") folderInclude = true;
            else folderExclude = true;
            break;
          }
        }
        continue;
      }
      if (dk.kind === "exact-file") {
        if (this._matchFile(dk.path, fp)) {
          if (mode === "include") fileInclude = true;
          else fileExclude = true;
        }
        continue;
      }
      if (dk.kind === "regex") {
        let re = null;
        try {
          re = new RegExp(dk.pattern);
        } catch (e) {
          re = null;
        }
        if (re) {
          if (re.test(fp)) {
            if (mode === "include") fileInclude = true;
            else fileExclude = true;
          }
          for (const p of parents) {
            if (re.test(p)) {
              if (mode === "include") folderInclude = true;
              else folderExclude = true;
              break;
            }
          }
        }
        continue;
      }
    }
    let included = false;
    let excluded = false;
    if (fileInclude) {
      included = true;
      excluded = false;
    } else if (fileExclude) {
      included = false;
      excluded = true;
    } else if (folderInclude) {
      included = true;
      excluded = false;
    } else if (folderExclude) {
      included = false;
      excluded = true;
    }
    const hasFileRule = fileInclude || fileExclude;
    return { included, excluded, hasIncludes, hasFileRule };
  }
  // Advanced Rules: filter word entries based on file/folder path rules
  // CLEAR RULE ENGINE: Apply your four rules in strict order
  // Rule 1: Folder excluded? → No files in folder get colored
  // Rule 2: File explicitly included in excluded folder? → File gets colored
  // Rule 3: Text "only colors in" this file/folder? → Color only here
  // Rule 4: Text "does not color in" this file/folder? → Don't color here
  shouldColorText(filePath, textPattern) {
    try {
      if (!filePath || !textPattern) return true;
      const fp = this.normalizePath(filePath);
      const pathRules = Array.isArray(this.settings.pathRules) ? this.settings.pathRules : [];
      const advRules = Array.isArray(this.settings.advancedRules) ? this.settings.advancedRules : [];
      const caseInsensitive = !this.settings.caseSensitive;
      const textMatches = (rule, pattern) => {
        const ruleText = String(rule.text || "").trim();
        if (!ruleText) return false;
        const patternStr = String(pattern).trim();
        if (rule.isRegex) {
          if (caseInsensitive) {
            return ruleText.toLowerCase() === patternStr.toLowerCase();
          } else {
            return ruleText === patternStr;
          }
        }
        if (caseInsensitive) {
          return ruleText.toLowerCase() === patternStr.toLowerCase();
        } else {
          return ruleText === patternStr;
        }
      };
      const pathMatches = (rule) => {
        const pathStr = String(rule.path || "").trim();
        if (pathStr.length === 0) return true;
        const dk = this.detectRuleKind(pathStr);
        if (dk.kind === "name") {
          const { fileMatch, folderMatch } = this._matchesByName(fp, dk.name);
          return fileMatch || folderMatch;
        }
        if (dk.kind === "exact-file") return this._matchFile(dk.path, fp);
        if (dk.kind === "exact-folder") {
          const parents = this._parentFolders(fp);
          for (const p of parents) {
            if (this.normalizePath(p) === this.normalizePath(dk.path)) return true;
          }
          return false;
        }
        if (dk.kind === "regex") {
          try {
            const re = new RegExp(dk.pattern);
            if (re.test(fp)) return true;
            const parents = this._parentFolders(fp);
            for (const p of parents) {
              if (re.test(p)) return true;
            }
          } catch (e) {
            return false;
          }
        }
        return false;
      };
      const pathEval = this.evaluatePathRules(filePath);
      const isFolderExcluded = pathEval.excluded && !pathEval.hasFileRule;
      const isFileExplicitlyIncluded = pathEval.hasFileRule && pathEval.included;
      if (isFolderExcluded && !isFileExplicitlyIncluded) {
        debugLog("RULE_ENGINE", `Skipping: folder excluded for ${filePath}`);
        return false;
      }
      const onlyIncludeRules = advRules.filter((r) => r && r.mode === "include" && textMatches(r, textPattern));
      if (onlyIncludeRules.length > 0) {
        const matchesIncludeRule = onlyIncludeRules.some((r) => pathMatches(r));
        if (!matchesIncludeRule) {
          debugLog("RULE_ENGINE", `Skipping: text "${textPattern}" only colors elsewhere`);
          return false;
        }
      }
      const excludeRules = advRules.filter((r) => r && r.mode === "exclude" && textMatches(r, textPattern));
      if (excludeRules.length > 0) {
        const matchesExcludeRule = excludeRules.some((r) => pathMatches(r));
        if (matchesExcludeRule) {
          debugLog("RULE_ENGINE", `Skipping: text "${textPattern}" does not color here`);
          return false;
        }
      }
      return true;
    } catch (e) {
      debugError("RULE_ENGINE", "Error in shouldColorText", e);
      return true;
    }
  }
  // Filter entries based on the four rules using shouldColorText
  filterEntriesByAdvancedRules(filePath, entries) {
    try {
      if (!filePath || !Array.isArray(entries) || entries.length === 0) return entries;
      const filtered = entries.filter((entry) => {
        if (!entry || !entry.pattern) return true;
        return this.shouldColorText(filePath, entry.pattern);
      });
      debugLog("ADV_RULES", {
        filePath,
        originalEntries: entries.length,
        filteredEntries: filtered.length
      });
      return filtered;
    } catch (e) {
      debugError("ADV_RULES", "Error filtering entries", e);
      return entries;
    }
  }
  hasGlobalExclude() {
    try {
      const rules = Array.isArray(this.settings.pathRules) ? this.settings.pathRules : [];
      return rules.some((r) => r && r.mode === "exclude" && String(r.path || "").trim().length === 0);
    } catch (e) {
      return false;
    }
  }
  // Return the most specific folder rule that matches filePath, or null
  getBestFolderEntry(filePath) {
    try {
      const rules = Array.isArray(this.settings.pathRules) ? this.settings.pathRules : [];
      if (!filePath || rules.length === 0) return null;
      const fp = this.normalizePath(filePath);
      const parents = this._parentFolders(fp);
      let best = null;
      for (const r of rules) {
        if (!r) continue;
        const mode = r.mode === "exclude" ? "exclude" : "include";
        const pathStr = String(r.path || "").trim();
        const dk = this.detectRuleKind(pathStr);
        if (pathStr.length === 0) {
          const candidate = { path: "", mode };
          best = candidate;
          continue;
        }
        if (dk.kind === "name") {
          for (const p of parents) {
            if (this._basename(p) === dk.name) {
              if (!best || p.length > best.path.length) best = { path: p, mode };
              break;
            }
          }
          continue;
        }
        if (dk.kind === "exact-folder") {
          for (const p of parents) {
            if (this.normalizePath(p) === this.normalizePath(dk.path)) {
              if (!best || p.length > best.path.length) best = { path: p, mode };
              break;
            }
          }
          continue;
        }
        if (dk.kind === "regex") {
          let re = null;
          try {
            re = new RegExp(dk.pattern);
          } catch (e) {
            re = null;
          }
          if (re) {
            for (const p of parents) {
              if (re.test(p)) {
                if (!best || p.length > best.path.length) best = { path: p, mode };
                break;
              }
            }
          }
          continue;
        }
      }
      return best;
    } catch (e) {
      return null;
    }
  }
  // Check for known problematic patterns that should be blocked
  isKnownProblematicPattern(pattern) {
    if (!pattern || typeof pattern !== "string") return false;
    const p = pattern.trim();
    const hardBlocked = [
      '"[^" ]*"',
      "'[^' ]*'",
      "(.*)*",
      "(.+)+",
      "(a*)*",
      "^(.|\\n)*?$",
      "\\b\\w{1,15}\\b\\s+\\b\\w{1,15}\\b\\s+\\b\\w{1,15}\\b"
    ];
    const normalize = (s) => String(s || "").replace(/\s/g, "");
    if (hardBlocked.some((h) => normalize(h) === normalize(p))) return true;
    if (/\(\?[=!<]/.test(p)) return true;
    if (p.includes("*.*") || p.includes("+.+")) return true;
    const dangerousPatterns = [
      '"[^"]*"',
      "'[^']*'",
      '"(?:[^"\\]|\\\\.)*"',
      "'(?:[^'\\\\]|\\\\.)*'",
      "\\b\\d{4}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)-\\d{1,2}\\b",
      "(\\w+)*\\s+",
      "([a-z]+)*\\d+",
      "(a*)*b",
      "(a+)*b",
      "(\\w+)\\1+",
      "(\\w+)(\\1){3,}",
      "(?:\\w+|\\d+)*\\s+",
      "(?:[a-z]*|[0-9]*)*",
      "^(a|a?)+$",
      "^(a|aa)+$",
      "^(.*a){10}.*$",
      "\\((?:[^()\\]|\\([^()]*\\))*\\)",
      "\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}"
    ];
    return dangerousPatterns.some((d) => normalize(d) === normalize(p));
  }
  // Compile word entries into runtime structures (regexes, testRegex, validity)
  compileWordEntries() {
    try {
      try {
        this._compiledWordEntries = [];
        this._cachedSortedEntries = null;
        this._cacheDirty = true;
      } catch (e) {
      }
      try {
        this._regexCache && this._regexCache.clear();
      } catch (_) {
      }
      try {
        this._bloomFilter && this._bloomFilter.reset();
      } catch (_) {
      }
      if (!Array.isArray(this.settings.wordEntries)) return;
      for (const e of this.settings.wordEntries) {
        if (!e) continue;
        if (e && e.backgroundColor) {
          continue;
        }
        const patterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : [String(e.pattern || "").trim()];
        const color = e.color;
        if (!this.isValidHexColor(color)) {
          continue;
        }
        const isRegex = !!e.isRegex;
        for (let pattern of patterns) {
          pattern = String(pattern).trim();
          if (!pattern) continue;
          pattern = this.sanitizePattern(pattern, isRegex);
          if (!this.settings.disableRegexSafety && this.isKnownProblematicPattern(pattern)) {
            debugWarn("COMPILE", `Blocked dangerous pattern: ${pattern.substring(0, 50)}`);
            const compiled2 = { pattern, color, isRegex, flags: "", regex: null, testRegex: null, invalid: true, specificity: 0 };
            this._compiledWordEntries.push(compiled2);
            try {
              new Notice(this.t("notice_pattern_blocked", "Pattern blocked for Memory Safety: " + pattern.substring(0, 30) + "..."));
            } catch (e2) {
            }
            continue;
          }
          const rawFlags = String(e.flags || "").replace(/[^gimsuy]/g, "");
          let flags = rawFlags || "";
          if (!flags.includes("g")) flags += "g";
          if (!this.settings.caseSensitive && !flags.includes("i")) flags += "i";
          const compiled = {
            pattern,
            color,
            textColor: e.textColor || e.color || color,
            backgroundColor: e.backgroundColor || null,
            styleType: e.styleType || "text",
            isRegex,
            flags,
            regex: null,
            testRegex: null,
            invalid: false,
            specificity: pattern.replace(/\*/g, "").length,
            presetLabel: e.presetLabel || void 0,
            // Preserve presetLabel from original entry
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
              if (!this.validateAndSanitizeRegex(pattern)) {
                compiled.invalid = true;
                try {
                  new Notice(this.t("notice_pattern_too_complex", "Pattern too complex: " + pattern.substring(0, 60) + "..."));
                } catch (e2) {
                }
                this._compiledWordEntries.push(compiled);
                continue;
              }
              compiled.regex = this._regexCache.getOrCreate(pattern, flags);
              const testFlags = flags.replace(/g/g, "");
              compiled.testRegex = this._regexCache.getOrCreate(pattern, testFlags);
            } else {
              const esc = this.escapeRegex(pattern);
              const literalFlags = this.settings.caseSensitive ? "g" : "gi";
              compiled.regex = this._regexCache.getOrCreate(esc, literalFlags);
              compiled.testRegex = this.settings.caseSensitive ? this._regexCache.getOrCreate(esc, "") : this._regexCache.getOrCreate(esc, "i");
            }
          } catch (err) {
            compiled.invalid = true;
          }
          try {
            this._bloomFilter && this._bloomFilter.addPattern(pattern, isRegex);
          } catch (_) {
          }
          try {
            compiled.fastTest = this.createFastTester(pattern, compiled.isRegex, this.settings.caseSensitive);
          } catch (e2) {
            compiled.fastTest = (text) => true;
          }
          this._compiledWordEntries.push(compiled);
        }
      }
      this._compiledWordEntries.sort((a, b) => b.specificity - a.specificity || b.pattern.length - a.pattern.length);
      try {
        this._cacheDirty = true;
        this._cachedSortedEntries = null;
      } catch (e) {
      }
      try {
        const all = (Array.isArray(this._compiledWordEntries) ? this._compiledWordEntries : []).concat(Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : []);
        this._settingsIndex && this._settingsIndex.rebuild(all);
      } catch (_) {
      }
    } catch (err) {
      debugError("COMPILE", "compileWordEntries failed", err);
      try {
        this._compiledWordEntries = [];
        this._cachedSortedEntries = null;
        this._cacheDirty = true;
      } catch (e) {
      }
    }
  }
  // Compile text + background coloring entries
  compileTextBgColoringEntries() {
    try {
      try {
        this._compiledTextBgEntries = [];
      } catch (e) {
      }
      const source = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
      for (const e of source) {
        if (!e || !e.backgroundColor) continue;
        const patterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : [String(e.pattern || "").trim()];
        const textColor = e.textColor || "currentColor";
        const backgroundColor = e.backgroundColor;
        const isRegex = !!e.isRegex;
        const textOk = textColor === "currentColor" || this.isValidHexColor(textColor);
        const bgOk = this.isValidHexColor(backgroundColor);
        if (!textOk || !bgOk) {
          continue;
        }
        for (let pattern of patterns) {
          pattern = String(pattern).trim();
          if (!pattern) continue;
          pattern = this.sanitizePattern(pattern, isRegex);
          if (!this.settings.disableRegexSafety && this.isKnownProblematicPattern(pattern)) {
            debugWarn("COMPILE_TEXTBG", `Blocked dangerous pattern: ${pattern.substring(0, 50)}`);
            const compiled2 = {
              pattern,
              textColor,
              backgroundColor,
              isRegex,
              flags: "",
              regex: null,
              testRegex: null,
              invalid: true,
              specificity: 0,
              isTextBg: true
            };
            this._compiledTextBgEntries.push(compiled2);
            try {
              new Notice(this.t("notice_pattern_blocked", "Pattern blocked for Memory Safety: " + pattern.substring(0, 30) + "..."));
            } catch (e2) {
            }
            continue;
          }
          const rawFlags = String(e.flags || "").replace(/[^gimsuy]/g, "");
          let flags = rawFlags || "";
          if (!flags.includes("g")) flags += "g";
          if (!this.settings.caseSensitive && !flags.includes("i")) flags += "i";
          const compiled = {
            pattern,
            textColor,
            backgroundColor,
            styleType: e.styleType || "both",
            isRegex,
            flags,
            regex: null,
            testRegex: null,
            invalid: false,
            specificity: pattern.replace(/\*/g, "").length,
            isTextBg: true,
            // Mark as text+bg entry
            presetLabel: e.presetLabel || void 0
            // Preserve presetLabel from original entry
          };
          try {
            if (this.settings.enableRegexSupport && isRegex) {
              if (!this.validateAndSanitizeRegex(pattern)) {
                compiled.invalid = true;
                try {
                  new Notice(this.t("notice_pattern_too_complex", "Pattern too complex: " + pattern.substring(0, 60) + "..."));
                } catch (e2) {
                }
                this._compiledTextBgEntries.push(compiled);
                continue;
              }
              compiled.regex = this._regexCache.getOrCreate(pattern, flags);
              const testFlags = flags.replace(/g/g, "");
              compiled.testRegex = this._regexCache.getOrCreate(pattern, testFlags);
            } else {
              const esc = this.escapeRegex(pattern);
              compiled.regex = this._regexCache.getOrCreate(esc, flags);
              const testFlags = flags.replace(/g/g, "");
              compiled.testRegex = testFlags === "" ? this._regexCache.getOrCreate(esc, "") : this._regexCache.getOrCreate(esc, testFlags);
            }
            try {
              compiled.fastTest = this.createFastTester(pattern, isRegex, this.settings.caseSensitive);
            } catch (e2) {
              compiled.fastTest = (text) => true;
            }
            try {
              this._bloomFilter && this._bloomFilter.addPattern(pattern, isRegex);
            } catch (_) {
            }
            this._compiledTextBgEntries.push(compiled);
          } catch (err) {
            compiled.invalid = true;
            compiled.regex = null;
            compiled.testRegex = null;
            debugError("COMPILE_TEXTBG", `Failed to compile pattern: ${pattern}`, err);
            this._compiledTextBgEntries.push(compiled);
          }
        }
      }
      this._compiledTextBgEntries.sort((a, b) => b.specificity - a.specificity);
    } catch (err) {
      debugError("COMPILE_TEXTBG", "compileTextBgColoringEntries failed", err);
      try {
        this._compiledTextBgEntries = [];
      } catch (e) {
      }
    }
    try {
      const all = (Array.isArray(this._compiledWordEntries) ? this._compiledWordEntries : []).concat(Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : []);
      this._settingsIndex && this._settingsIndex.rebuild(all);
    } catch (_) {
    }
  }
  // Apply Highlights in Reading View (Markdown Post Processor) - optional folderEntry may override match colors
  applyHighlights(el, folderEntry = null, options = {}) {
    const entries = options && Array.isArray(options.entries) ? options.entries : this.getSortedWordEntries();
    if (entries.length === 0) return;
    if (!el.isConnected) return;
    this._wrapMatchesRecursive(el, entries, folderEntry, options || {});
  }
  // NEW METHOD: Apply highlights for simple patterns (ultra-fast version)
  applySimpleHighlights(textNode, matches, text) {
    if (IS_DEVELOPMENT) console.time("applySimpleHighlights");
    if (!matches || matches.length === 0) {
      if (IS_DEVELOPMENT) console.timeEnd("applySimpleHighlights");
      return;
    }
    try {
      if (textNode.parentElement?.closest(".always-color-text-highlight")) {
        if (IS_DEVELOPMENT) console.timeEnd("applySimpleHighlights");
        return;
      }
    } catch (_) {
    }
    const decodedText = this.decodeHtmlEntities(text);
    try {
      const filtered = [];
      for (const m of matches) {
        if (this.isContextBlacklisted(decodedText, m.start, m.end)) continue;
        filtered.push(m);
      }
      matches = filtered;
      if (matches.length === 0) {
        if (IS_DEVELOPMENT) console.timeEnd("applySimpleHighlights");
        return;
      }
    } catch (_) {
    }
    matches.sort((a, b) => a.start - b.start);
    const nonOverlapping = [];
    for (const m of matches) {
      let overlaps = false;
      const overlappingIndices = [];
      for (let i = 0; i < nonOverlapping.length; i++) {
        const existing = nonOverlapping[i];
        if (m.start < existing.end && m.end > existing.start) {
          overlaps = true;
          overlappingIndices.push(i);
        }
      }
      if (!overlaps) {
        nonOverlapping.push(m);
      } else {
        const mLength = m.end - m.start;
        const allShorter = overlappingIndices.every((i) => {
          const existing = nonOverlapping[i];
          return existing.end - existing.start < mLength;
        });
        if (allShorter) {
          for (let i = overlappingIndices.length - 1; i >= 0; i--) {
            nonOverlapping.splice(overlappingIndices[i], 1);
          }
          nonOverlapping.push(m);
        }
      }
    }
    const frag = document.createDocumentFragment();
    let pos = 0;
    try {
      const txtCount = nonOverlapping.filter((m) => !m.isTextBg && (m.styleType || "text") === "text").length;
      debugLog("READING_MATCHES", `total=${nonOverlapping.length}, text=${txtCount}, hideTextColors=${this.settings.hideTextColors === true}`);
    } catch (_) {
    }
    for (const m of nonOverlapping) {
      if (m.start > pos) {
        frag.appendChild(document.createTextNode(decodedText.slice(pos, m.start)));
      }
      const span = document.createElement("span");
      span.className = "always-color-text-highlight";
      span.textContent = decodedText.slice(m.start, m.end);
      const entry = m.entry;
      const styleType2 = entry && entry.styleType ? entry.styleType : "text";
      const folderDefault = m.folderEntry && m.folderEntry.defaultColor ? m.folderEntry.defaultColor : null;
      const entryTextColor = entry && entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : null;
      const resolvedTextColor = folderDefault || entryTextColor || (entry ? entry.color : null);
      const hideText = this.settings.hideTextColors === true;
      const hideBg = this.settings.hideHighlights === true;
      if (styleType2 === "text") {
        if (hideText) {
          frag.appendChild(document.createTextNode(decodedText.slice(m.start, m.end)));
          pos = m.end;
          continue;
        }
        if (resolvedTextColor) {
          try {
            span.style.setProperty("color", resolvedTextColor, "important");
          } catch (_) {
            span.style.color = resolvedTextColor;
          }
          try {
            span.style.setProperty("--highlight-color", resolvedTextColor);
          } catch (e) {
          }
        }
        try {
          debugLog("READING_TEXT", `applied color=${resolvedTextColor || "none"}`);
        } catch (_) {
        }
      } else if (styleType2 === "highlight") {
        if (hideBg) {
          frag.appendChild(document.createTextNode(decodedText.slice(m.start, m.end)));
          pos = m.end;
          continue;
        }
        const bgColor = entry && entry.backgroundColor ? entry.backgroundColor : entry && entry.color ? entry.color : resolvedTextColor;
        try {
          span.style.setProperty("background-color", this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25), "important");
        } catch (_) {
          span.style.backgroundColor = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
        }
        try {
          span.style.setProperty("padding-left", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
          span.style.setProperty("padding-right", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
        } catch (_) {
          span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
        }
        const br = (this.settings.highlightBorderRadius ?? 8) + "px";
        try {
          span.style.setProperty("border-radius", br, "important");
        } catch (_) {
          span.style.borderRadius = br;
        }
        if (this.settings.enableBoxDecorationBreak ?? true) {
          span.style.boxDecorationBreak = "clone";
          span.style.WebkitBoxDecorationBreak = "clone";
        }
        this.applyBorderStyleToElement(span, null, bgColor);
      } else if (styleType2 === "both") {
        const textColor = entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : null;
        const bgColor = entry && entry.backgroundColor ? entry.backgroundColor : entry && entry.color ? entry.color : resolvedTextColor;
        if (!hideText && textColor) {
          try {
            span.style.setProperty("color", textColor, "important");
          } catch (_) {
            span.style.color = textColor;
          }
          try {
            span.style.setProperty("--highlight-color", textColor);
          } catch (e) {
          }
        }
        if (!hideBg) {
          try {
            span.style.setProperty("background-color", this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25), "important");
          } catch (_) {
            span.style.backgroundColor = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
          }
          try {
            span.style.setProperty("padding-left", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
            span.style.setProperty("padding-right", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
          } catch (_) {
            span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
          }
          const br2 = (this.settings.highlightBorderRadius ?? 8) + "px";
          try {
            span.style.setProperty("border-radius", br2, "important");
          } catch (_) {
            span.style.borderRadius = br2;
          }
          if (this.settings.enableBoxDecorationBreak ?? true) {
            span.style.boxDecorationBreak = "clone";
            span.style.WebkitBoxDecorationBreak = "clone";
          }
        } else {
          try {
            span.style.setProperty("background-color", "transparent", "important");
          } catch (_) {
            span.style.backgroundColor = "transparent";
          }
          span.style.paddingLeft = span.style.paddingRight = "0px";
          span.style.border = "";
          span.style.borderRadius = "";
        }
        this.applyBorderStyleToElement(span, hideText ? null : textColor, hideBg ? null : bgColor);
      }
      frag.appendChild(span);
      pos = m.end;
    }
    if (pos < decodedText.length) {
      frag.appendChild(document.createTextNode(decodedText.slice(pos)));
    }
    debugLog("HIGHLIGHT_APPLY", `Created ${nonOverlapping.length} spans, replacing text node`);
    const parentNode = textNode.parentNode;
    const isConnected = textNode.isConnected;
    debugLog("HIGHLIGHT_APPLY", `TextNode connected: ${isConnected}, parent: ${parentNode?.nodeName || "none"}`);
    textNode.replaceWith(frag);
    const highlightsNow = parentNode?.querySelectorAll?.(".always-color-text-highlight")?.length || 0;
    debugLog("HIGHLIGHT_APPLY", `After replacement: ${highlightsNow} highlights in parent`);
    if (IS_DEVELOPMENT) console.timeEnd("applySimpleHighlights");
  }
  setupReadingModeObserver(el, sourcePath) {
    try {
      if (!el || !sourcePath) return;
      if (!this._readingModeIntervals) this._readingModeIntervals = /* @__PURE__ */ new Map();
      if (this._readingModeIntervals.has(el)) {
        clearInterval(this._readingModeIntervals.get(el));
      }
    } catch (e) {
      debugError("READING_OBS", "Failed to set up observer", e);
    }
  }
  // Process only the active file: immediate visible blocks then deferred idle processing
  processActiveFileOnly(el, ctx) {
    if (!el || !ctx || !ctx.sourcePath) return;
    if (!this.settings.enabled) return;
    try {
      this.removeDisabledNeutralizerStyles();
    } catch (_) {
    }
    if (typeof ctx.sourcePath !== "string") {
      debugWarn("ACT", `Invalid sourcePath type: ${typeof ctx.sourcePath}`);
      return;
    }
    const startTime = performance.now();
    debugLog("ACT", "Processing active file", ctx.sourcePath.slice(-30));
    if (this.settings.forceFullRenderInReading) {
      try {
        debugWarn("ACT", "forceFullRenderInReading enabled - forcing full processing");
        try {
          debugLog("ACT_FLAGS", `hideTextColors=${this.settings.hideTextColors === true}, hideHighlights=${this.settings.hideHighlights === true}`);
        } catch (_) {
        }
        const pr0 = this.evaluatePathRules(ctx.sourcePath);
        const allowedEntriesForce = this.filterEntriesByAdvancedRules(ctx.sourcePath, this.getSortedWordEntries());
        if ((pr0.excluded || this.hasGlobalExclude() && pr0.hasIncludes && !pr0.included) && allowedEntriesForce.length === 0) return;
        if (this.settings.disabledFiles.includes(ctx.sourcePath)) return;
        if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;
        const folderEntry2 = this.getBestFolderEntry(ctx.sourcePath);
        this.processInChunks(el, allowedEntriesForce, folderEntry2, {
          skipFirstN: 0,
          batchSize: 30,
          clearExisting: true,
          forceProcess: true,
          maxMatches: Infinity
        });
      } catch (e) {
        debugError("ACT", "forceFullRenderInReading failed", e);
      }
      return;
    }
    try {
      if (this.performanceMonitor && this.performanceMonitor.isOverloaded && this.performanceMonitor.isOverloaded()) {
        try {
          const now = Date.now();
          if (!this._lastPerfWarning || now - this._lastPerfWarning > 1e3) {
            debugLog("ACT", "Skipping: perf overload");
            this._lastPerfWarning = now;
          }
        } catch (e) {
          debugError("ACT", "perf gate error", e);
        }
        return;
      }
    } catch (e) {
      debugError("ACT", "perf gate error", e);
    }
    const pr = this.evaluatePathRules(ctx.sourcePath);
    if (this.settings.disabledFiles.includes(ctx.sourcePath)) return;
    if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;
    const folderEntry = this.getBestFolderEntry(ctx.sourcePath);
    const allEntries = this.getSortedWordEntries();
    const allowedEntries = this.filterEntriesByAdvancedRules(ctx.sourcePath, allEntries);
    const isExcludedByPathRules = pr.excluded || this.hasGlobalExclude() && pr.hasIncludes && !pr.included;
    if (isExcludedByPathRules && allowedEntries.length === 0) {
      debugLog("ACT", "Skipping: excluded by path rules with no advanced rule exceptions");
      return;
    }
    if (this.settings.disableReadingModeColoring) {
      try {
        const prev = this._viewportObservers && this._viewportObservers.get && this._viewportObservers.get(el);
        if (prev && typeof prev.disconnect === "function") {
          try {
            prev.disconnect();
          } catch (e) {
          }
          try {
            this._viewportObservers.delete(el);
          } catch (e) {
          }
        }
      } catch (e) {
      }
      return;
    }
    try {
      if (el && el.textContent && this.shouldUseLightweightMode(el.textContent.length)) {
        this.processLargeDocument(el, ctx, folderEntry);
        return;
      }
    } catch (e) {
    }
    const immediateBlocks = 20;
    try {
      if (this.shouldUseLightweightMode && this.shouldUseLightweightMode(el.textContent ? el.textContent.length : 0)) {
        debugLog("ACT", "Large doc detected -> using viewport-based rendering");
        try {
          this.setupViewportObserver(el, folderEntry || null, { clearExisting: true, entries: allowedEntries });
        } catch (e) {
          debugError("ACT", "setupViewportObserver failed", e);
          this.applyHighlights(el, folderEntry || null, { immediateBlocks, clearExisting: true, entries: allowedEntries });
        }
        return;
      }
    } catch (e) {
    }
    const processNow = () => this.applyHighlights(el, folderEntry || null, { immediateBlocks, clearExisting: true, entries: allowedEntries });
    const t0 = performance.now();
    processNow();
    debugLog("ACT", `immediate pass: ${(performance.now() - t0).toFixed(1)}ms`);
    try {
      try {
        this._domRefs.set(el, Object.assign(this._domRefs.get(el) || {}, { deferredScheduled: true, deferredDone: false }));
      } catch (e) {
      }
      const runDeferred = (label) => {
        try {
          const meta = this._domRefs.get(el) || {};
          if (meta.deferredDone) return;
          meta.deferredDone = true;
          try {
            this._domRefs.set(el, meta);
          } catch (e) {
          }
          const t1 = performance.now();
          debugLog("DEFERRED", `Start: ${label}, skipFirstN=${immediateBlocks}`);
          try {
            this.processInChunks(el, allowedEntries, folderEntry || null, { skipFirstN: immediateBlocks, batchSize: 30, clearExisting: true, forceProcess: true }).then(() => debugLog("DEFERRED", `Completed: ${label} in ${(performance.now() - t1).toFixed(1)}ms`)).catch((e) => debugError("DEFERRED", "processInChunks error", e));
          } catch (e) {
            debugError("DEFERRED", "fallback applyHighlights due to error", e);
            this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: true, entries: allowedEntries });
          }
        } catch (e) {
          debugError("ACT", "deferred pass error", e);
        }
      };
      if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
        try {
          window.requestIdleCallback(() => runDeferred("idleCallback"), { timeout: 2e3 });
        } catch (e) {
          setTimeout(() => runDeferred("setTimeout-after-idle-error"), 1200);
        }
      } else {
        setTimeout(() => runDeferred("setTimeout-fallback"), 1200);
      }
      setTimeout(() => runDeferred("safety-timeout"), 3e3);
    } catch (e) {
      setTimeout(() => {
        try {
          const t3 = performance.now();
          this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: false, entries: allowedEntries });
          debugLog("ACT", `deferred (fallback-final) in ${(performance.now() - t3).toFixed(1)}ms`);
        } catch (err) {
          debugError("ACT", "fallback-final error", err);
        }
      }, 1500);
    }
    debugLog("ACT", `scheduled total: ${(performance.now() - startTime).toFixed(1)}ms`);
  }
  // Progressive optimized processing for very large documents
  processLargeDocument(el, ctx, folderEntry) {
    try {
      debugLog("LARGE", "Processing large document with optimized mode");
      const entries = this.filterEntriesByAdvancedRules(ctx.sourcePath, this.getSortedWordEntries());
      this.applyHighlights(el, folderEntry, {
        immediateBlocks: 50,
        skipFirstN: 0,
        clearExisting: true,
        entries
      });
      setTimeout(() => {
        try {
          this.processInChunks(el, entries, folderEntry, {
            batchSize: 30,
            clearExisting: false
          });
        } catch (e) {
          debugError("LARGE", "deferred processing failed", e);
        }
      }, 1e3);
    } catch (e) {
      debugError("LARGE", "processLargeDocument failed", e);
    }
  }
  // NEW METHOD: Optimized processing for non-Roman text
  processNonRomanOptimized(element, entries, folderEntry = null, options = {}) {
    const nonRomanEntries = entries.filter(
      (entry) => entry && !entry.invalid && this.containsNonRomanCharacters(entry.pattern)
    );
    if (nonRomanEntries.length === 0) return;
    const blockTags = ["P", "LI", "DIV", "SPAN", "TD", "TH", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"];
    const queue = [];
    for (const node of element.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && blockTags.includes(node.nodeName)) {
        queue.push(node);
      }
    }
    for (const block of queue) {
      this.processNonRomanBlock(block, nonRomanEntries, folderEntry, options);
    }
  }
  // NEW METHOD: Process single block with non-Roman text
  processNonRomanBlock(block, entries, folderEntry, opts = {}) {
    if (IS_DEVELOPMENT) console.time("processNonRomanBlock");
    try {
      if (block && (block.classList?.contains("act-skip-coloring") || block.closest?.(".act-skip-coloring"))) {
        if (IS_DEVELOPMENT) console.timeEnd("processNonRomanBlock");
        return;
      }
    } catch (_) {
    }
    const clearExisting = opts.clearExisting !== false;
    if (clearExisting) {
      const highlights = block.querySelectorAll("span.always-color-text-highlight");
      for (const ex of highlights) {
        const tn = document.createTextNode(ex.textContent);
        ex.replaceWith(tn);
      }
    }
    for (const node of block.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      let text = node.textContent;
      if (!text || text.length > 5e3) continue;
      text = this.decodeHtmlEntities(text);
      let matches = [];
      for (const entry of entries) {
        if (!entry || entry.invalid) continue;
        let pattern = entry.pattern;
        pattern = this.decodeHtmlEntities(pattern);
        const styleType2 = entry.styleType || "text";
        const textColor = entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : entry.color || null;
        const resolvedTextColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : textColor;
        const backgroundColor = entry.backgroundColor || null;
        let pos = 0;
        while ((pos = text.indexOf(pattern, pos)) !== -1) {
          matches.push({
            start: pos,
            end: pos + pattern.length,
            styleType: styleType2,
            textColor: resolvedTextColor || null,
            backgroundColor: backgroundColor || null
          });
          pos += pattern.length;
          if (matches.length > 100) break;
        }
        if (matches.length > 100) break;
      }
      if (matches.length > 0) {
        matches.sort((a, b) => a.start - b.start);
        const frag = document.createDocumentFragment();
        let pos = 0;
        for (const m of matches) {
          if (m.start > pos) {
            frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
          }
          const span = document.createElement("span");
          span.className = "always-color-text-highlight";
          span.textContent = text.slice(m.start, m.end);
          const hideText = this.settings.hideTextColors === true;
          const hideBg = this.settings.hideHighlights === true;
          if (m.styleType === "text") {
            if (!hideText && m.textColor) {
              try {
                span.style.setProperty("color", m.textColor, "important");
              } catch (_) {
                span.style.color = m.textColor;
              }
              try {
                span.style.setProperty("--highlight-color", m.textColor);
              } catch (e) {
              }
            }
          } else if (m.styleType === "highlight") {
            if (!hideBg) {
              const bg = m.backgroundColor || m.textColor;
              if (bg) {
                try {
                  span.style.setProperty("background-color", this.hexToRgba(bg, this.settings.backgroundOpacity ?? 25), "important");
                } catch (_) {
                  span.style.backgroundColor = this.hexToRgba(bg, this.settings.backgroundOpacity ?? 25);
                }
                try {
                  span.style.setProperty("padding-left", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
                  span.style.setProperty("padding-right", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
                } catch (_) {
                  span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
                }
                const br = (this.settings.highlightBorderRadius ?? 8) + "px";
                try {
                  span.style.setProperty("border-radius", br, "important");
                } catch (_) {
                  span.style.borderRadius = br;
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  span.style.boxDecorationBreak = "clone";
                  span.style.WebkitBoxDecorationBreak = "clone";
                }
                this.applyBorderStyleToElement(span, null, bg);
              }
            } else {
              try {
                span.style.setProperty("background-color", "transparent", "important");
              } catch (_) {
                span.style.backgroundColor = "transparent";
              }
              span.style.paddingLeft = span.style.paddingRight = "0px";
              span.style.border = "";
              span.style.borderRadius = "";
            }
          } else {
            const tc = m.textColor;
            const bg = m.backgroundColor || m.textColor;
            if (!hideText && tc) {
              try {
                span.style.setProperty("color", tc, "important");
              } catch (_) {
                span.style.color = tc;
              }
              try {
                span.style.setProperty("--highlight-color", tc);
              } catch (e) {
              }
            }
            if (!hideBg && bg) {
              try {
                span.style.setProperty("background-color", this.hexToRgba(bg, this.settings.backgroundOpacity ?? 25), "important");
              } catch (_) {
                span.style.backgroundColor = this.hexToRgba(bg, this.settings.backgroundOpacity ?? 25);
              }
              try {
                span.style.setProperty("padding-left", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
                span.style.setProperty("padding-right", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
              } catch (_) {
                span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
              }
              const br2 = (this.settings.highlightBorderRadius ?? 8) + "px";
              try {
                span.style.setProperty("border-radius", br2, "important");
              } catch (_) {
                span.style.borderRadius = br2;
              }
              if (this.settings.enableBoxDecorationBreak ?? true) {
                span.style.boxDecorationBreak = "clone";
                span.style.WebkitBoxDecorationBreak = "clone";
              }
              this.applyBorderStyleToElement(span, hideText ? null : tc, hideBg ? null : bg);
            } else if (hideBg) {
              try {
                span.style.setProperty("background-color", "transparent", "important");
              } catch (_) {
                span.style.backgroundColor = "transparent";
              }
              span.style.paddingLeft = span.style.paddingRight = "0px";
              span.style.border = "";
              span.style.borderRadius = "";
            }
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
    if (IS_DEVELOPMENT) console.timeEnd("processNonRomanBlock");
  }
  // Efficient, non-recursive, DOM walker for reading mode
  _wrapMatchesRecursive(element, entries, folderEntry = null, options = {}) {
    debugLog("WRAP", `Starting with ${entries.length} entries`);
    let filePath = null;
    try {
      filePath = this.app?.workspace?.getActiveFile()?.path || null;
    } catch (_) {
    }
    try {
      if (filePath) {
        entries = this.filterEntriesByAdvancedRules(filePath, entries || this.getSortedWordEntries());
        debugLog("WRAP", `After advanced rules filtering: ${entries.length} entries`);
      }
    } catch (_) {
    }
    try {
      const textContent = element.textContent || "";
      const nonRomanCharCount = this.countNonRomanCharacters(textContent);
      const totalChars = textContent.length;
      if (nonRomanCharCount > 100 && nonRomanCharCount / totalChars > 0.3) {
        debugLog("ACT", "Using optimized non-Roman text processing");
        return this.processNonRomanOptimized(element, entries, folderEntry, options);
      }
    } catch (e) {
    }
    try {
      this.processMarkdownFormattingInReading(element, folderEntry);
    } catch (e) {
    }
    const simpleEntries = entries.filter(
      (entry) => entry && !entry.invalid && this.isSimplePattern(entry.pattern)
    );
    const complexEntries = entries.filter(
      (entry) => entry && !entry.invalid && !this.isSimplePattern(entry.pattern)
    );
    debugLog("WRAP", `Pattern split: ${simpleEntries.length} simple, ${complexEntries.length} complex`);
    const allEntriesToProcess = simpleEntries.concat(complexEntries);
    if (complexEntries.length > 0 && !this.isPerformanceOverloaded()) {
      debugLog("ACT", `Processing ${allEntriesToProcess.length} total patterns (${simpleEntries.length} simple + ${complexEntries.length} complex)`);
    } else if (complexEntries.length > 0) {
      debugLog("ACT", "Skipping complex pattern processing due to performance constraints");
    }
    const immediateLimit = Number(options.immediateBlocks) || 0;
    const skipFirstN = Number(options.skipFirstN) || 0;
    const clearExisting = options.clearExisting !== false;
    const blockTags = ["P", "LI", "DIV", "SPAN", "TD", "TH", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6", "CODE", "PRE", "A"];
    try {
      if (this.settings.forceFullRenderInReading) {
        try {
          debugWarn("DOM", "forceFullRenderInReading active - skipping DOM size checks");
        } catch (e) {
        }
      } else {
        try {
          if (this.performanceMonitor && this.performanceMonitor.isOverloaded && this.performanceMonitor.isOverloaded()) {
            try {
              const now = Date.now();
              if (!this._lastPerfWarning || now - this._lastPerfWarning > 1e3) {
                debugLog("DOM", "Perf overload detected -> using chunked processing");
                this._lastPerfWarning = now;
              }
            } catch (e) {
            }
            try {
              this.processInChunks(element, entries, folderEntry, options);
            } catch (e) {
              debugError("DOM", "Chunking on overload failed", e);
            }
            return;
          }
        } catch (e) {
        }
        const MAX_DOM_NODES = 1e4;
        const MAX_BLOCK_NODES = 2e3;
        let nodeCount = 0;
        const tw = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null, false);
        while (tw.nextNode()) {
          nodeCount++;
          if (nodeCount > MAX_DOM_NODES) break;
        }
        if (nodeCount > MAX_DOM_NODES) {
          debugLog("DOM", `DOM too large (${nodeCount} nodes) -> using chunked processing`);
          try {
            this.processInChunks(element, entries, folderEntry, options);
          } catch (e) {
            debugError("DOM", "Chunking failed", e);
          }
          return;
        }
        const blockSet2 = new Set(blockTags);
        let blockCount = 0;
        const tw2 = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
          acceptNode(node) {
            return blockSet2.has(node.nodeName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
        }, false);
        while (tw2.nextNode()) {
          blockCount++;
          if (blockCount > MAX_BLOCK_NODES) break;
        }
        if (blockCount > MAX_BLOCK_NODES) {
          debugLog("DOM", `Chunking large block count: ${blockCount}`);
          try {
            this.processInChunks(element, entries, folderEntry, options);
          } catch (e) {
            debugError("DOM", "Chunking failed", e);
          }
          return;
        }
      }
    } catch (e) {
      debugError("DOM", "TreeWalker error", e);
    }
    const queue = [];
    const blockSet = new Set(blockTags);
    if (element.nodeType === Node.ELEMENT_NODE && blockTags.includes(element.nodeName)) {
      queue.unshift(element);
    }
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode(n) {
        if (["CODE", "PRE"].includes(n.nodeName)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (blockSet.has(n.nodeName)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }, false);
    let currentNode;
    while (currentNode = walker.nextNode()) {
      queue.push(currentNode);
    }
    try {
      debugLog("COLOR", `Processing ${queue.length} blocks, skipping first ${skipFirstN}`);
    } catch (e) {
    }
    let visited = 0;
    for (let qIndex = 0; qIndex < queue.length; qIndex++) {
      const block = queue[qIndex];
      if (qIndex < skipFirstN) {
        try {
          if (qIndex % 50 === 0) debugLog("COLOR", `Skipping block ${qIndex}`);
        } catch (e) {
        }
        visited++;
        continue;
      }
      const effectiveStyle = "text";
      try {
        if (qIndex % 100 === 0) debugLog("COLOR", `Processing block ${qIndex}`);
      } catch (e) {
      }
      this._errorRecovery.wrap("PROCESS_BLOCK", () => this._processBlock(block, allEntriesToProcess, folderEntry, { clearExisting, effectiveStyle, immediateLimit, qIndex, skipFirstN, element, forceProcess: options && options.forceProcess || this.settings.forceFullRenderInReading, maxMatches: options && options.maxMatches || (this.settings.forceFullRenderInReading ? Infinity : void 0) }), () => null);
    }
    queue.length = 0;
  }
  // Extracted helper: process a single block element (previously inlined inside _wrapMatchesRecursive)
  _processBlock(block, entries, folderEntry, opts = {}) {
    try {
      try {
        this._domRefs.set(block, { processedAt: Date.now(), matchCount: 0 });
      } catch (e) {
      }
    } catch (e) {
    }
    const clearExisting = opts.clearExisting !== false;
    let effectiveStyle;
    if (typeof opts.effectiveStyle === "string" && opts.effectiveStyle.length > 0) {
      effectiveStyle = opts.effectiveStyle;
    } else if (folderEntry && folderEntry.defaultStyle) {
      effectiveStyle = folderEntry.defaultStyle;
    } else {
      effectiveStyle = "text";
    }
    const immediateLimit = opts.immediateLimit || 0;
    let filePath = null;
    try {
      filePath = this.app?.workspace?.getActiveFile()?.path || null;
    } catch (_) {
    }
    try {
      if (filePath) entries = this.filterEntriesByAdvancedRules(filePath, entries || this.getSortedWordEntries());
    } catch (_) {
    }
    try {
      this._perfCounters.totalBlocksProcessed = (this._perfCounters.totalBlocksProcessed || 0) + 1;
    } catch (e) {
    }
    try {
      if (clearExisting) {
        const highlights = [];
        const walker2 = document.createTreeWalker(block, NodeFilter.SHOW_ELEMENT, {
          acceptNode(node) {
            return node.classList && node.classList.contains("always-color-text-highlight") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
        }, false);
        let highlightNode;
        while (highlightNode = walker2.nextNode()) {
          highlights.push(highlightNode);
        }
        for (const ex of highlights) {
          const tn = document.createTextNode(ex.textContent);
          ex.replaceWith(tn);
        }
        highlights.length = 0;
      }
    } catch (e) {
    }
    try {
      this.processMarkdownFormattingInReading(block, folderEntry);
    } catch (e) {
      try {
        debugError("MARKDOWN_FORMAT", "per-block processing error", e);
      } catch (_) {
      }
    }
    const textNodes = [];
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (node.parentElement?.closest("code, pre")) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.parentElement?.closest(".always-color-text-highlight")) {
            return NodeFilter.FILTER_REJECT;
          }
          try {
            if (node.parentElement?.closest(".act-skip-coloring")) {
              return NodeFilter.FILTER_REJECT;
            }
          } catch (_) {
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
    try {
      let literalEntries = (entries || []).filter((e) => e && !e.invalid && !e.isRegex && !e.isTextBg && typeof e.pattern === "string");
      if (this.settings.partialMatch) {
        literalEntries = literalEntries.filter((e) => e && e.styleType && e.styleType !== "text");
      }
      if (literalEntries.length > 0 && textNodes.length > 0) {
        const decodedTexts = textNodes.map((n) => this.decodeHtmlEntities(String(n.textContent || "")));
        const offsets = [];
        let acc = 0;
        for (const t of decodedTexts) {
          offsets.push(acc);
          acc += t.length;
        }
        const blockText = decodedTexts.join("");
        const blockSearch = this.settings.caseSensitive ? blockText : blockText.toLowerCase();
        const nodeMatchesMap = /* @__PURE__ */ new Map();
        for (const entry of literalEntries) {
          const rawPatt = String(entry.pattern || "");
          const patt = this.decodeHtmlEntities(rawPatt);
          if (!patt) continue;
          const pattSearch = this.settings.caseSensitive ? patt : patt.toLowerCase();
          let pos = 0;
          while ((pos = blockSearch.indexOf(pattSearch, pos)) !== -1) {
            const start = pos;
            const end = pos + pattSearch.length;
            pos += pattSearch.length;
            if (!this.settings.partialMatch && !this.isSentenceLikePattern(rawPatt) && !this.isWholeWordMatch(blockText, start, end)) {
              continue;
            }
            const fullWord = blockText.substring(start, end);
            if (this.isWordBlacklisted(fullWord)) continue;
            let remainingStart = start;
            let remainingEnd = end;
            for (let ni = 0; ni < decodedTexts.length && remainingStart < remainingEnd; ni++) {
              const nodeStart = offsets[ni];
              const nodeEnd = nodeStart + decodedTexts[ni].length;
              const overlapStart = Math.max(nodeStart, remainingStart);
              const overlapEnd = Math.min(nodeEnd, remainingEnd);
              if (overlapEnd > overlapStart) {
                const localStart = overlapStart - nodeStart;
                const localEnd = overlapEnd - nodeStart;
                const arr = nodeMatchesMap.get(textNodes[ni]) || [];
                arr.push({ start: localStart, end: localEnd, entry, folderEntry });
                nodeMatchesMap.set(textNodes[ni], arr);
              }
              if (nodeEnd >= remainingEnd) break;
            }
          }
        }
        if (nodeMatchesMap.size > 0) {
          for (const [n, m] of nodeMatchesMap.entries()) {
            const textDec = this.decodeHtmlEntities(String(n.textContent || ""));
            this.applySimpleHighlights(n, m, textDec);
          }
          try {
            const info = this._domRefs.get(block);
            if (info) info.matchCount = 1;
          } catch (e) {
          }
        }
      }
    } catch (e) {
      debugLog("LITERAL_PATH", `Error in literal processing: ${e.message}`);
    }
    if ((entries || []).filter((e) => e && !e.invalid && e.isRegex).length > 0) {
      textNodes.length = 0;
      let refreshWalker2 = document.createTreeWalker(
        block,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            if (node.parentElement?.closest("code, pre")) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.parentElement?.closest(".always-color-text-highlight")) {
              return NodeFilter.FILTER_REJECT;
            }
            try {
              if (node.parentElement?.closest(".act-skip-coloring")) {
                return NodeFilter.FILTER_REJECT;
              }
            } catch (_) {
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        },
        false
      );
      let currentRefreshNode;
      while (currentRefreshNode = refreshWalker2.nextNode()) {
        textNodes.push(currentRefreshNode);
      }
    }
    try {
      const regexEntries = (entries || []).filter((e) => e && !e.invalid && e.isRegex);
      for (const entry of regexEntries) {
        if (!entry.regex) {
          this._patternMatcher && this._patternMatcher.compilePattern(entry);
        }
      }
    } catch (e) {
      debugLog("REGEX_COMPILE", `Error compiling regex entries: ${e.message}`);
    }
    textNodes.length = 0;
    let refreshWalker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (node.parentElement?.closest("code, pre")) {
            return NodeFilter.FILTER_REJECT;
          }
          try {
            if (node.parentElement?.closest(".act-skip-coloring")) {
              return NodeFilter.FILTER_REJECT;
            }
          } catch (_) {
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );
    let refreshNode;
    while (refreshNode = refreshWalker.nextNode()) {
      textNodes.push(refreshNode);
    }
    for (const node of textNodes) {
      let text = node.textContent;
      const headingEl = node.parentElement?.closest("h1, h2, h3, h4, h5, h6");
      if (headingEl) {
        const label = "All Headings (H1-H6)";
        const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
        const hasHeadingBlacklist = !!blEntries.find((e) => e && e.presetLabel === label && !!e.isRegex);
        if (hasHeadingBlacklist) {
          continue;
        }
        const we = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
        const headingEntry = we.find((e) => e && e.presetLabel === label);
        if (headingEntry) {
          if (headingEntry.styleType === "highlight" || headingEntry.styleType === "both") {
            if (!headingEl.querySelector(".act-heading-wrapper")) {
              const wrapper = document.createElement("span");
              wrapper.className = "always-color-text-highlight act-heading-wrapper";
              try {
                wrapper.style.display = "inline-block";
              } catch (e) {
              }
              if (headingEntry.styleType === "both") {
                wrapper.style.color = headingEntry.textColor;
                try {
                  wrapper.style.setProperty("--highlight-color", headingEntry.textColor);
                } catch (e) {
                }
                wrapper.style.background = "";
                wrapper.style.backgroundColor = this.hexToRgba(headingEntry.backgroundColor, this.settings.backgroundOpacity ?? 25);
                wrapper.style.paddingLeft = wrapper.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
                if ((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) {
                  wrapper.style.borderRadius = "0px";
                } else {
                  wrapper.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  wrapper.style.boxDecorationBreak = "clone";
                  wrapper.style.WebkitBoxDecorationBreak = "clone";
                }
                this.applyBorderStyleToElement(wrapper, headingEntry.textColor, headingEntry.backgroundColor);
              } else {
                wrapper.style.background = "";
                wrapper.style.backgroundColor = this.hexToRgba(headingEntry.backgroundColor, this.settings.backgroundOpacity ?? 25);
                wrapper.style.paddingLeft = wrapper.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
                if ((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) {
                  wrapper.style.borderRadius = "0px";
                } else {
                  wrapper.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  wrapper.style.boxDecorationBreak = "clone";
                  wrapper.style.WebkitBoxDecorationBreak = "clone";
                }
                this.applyBorderStyleToElement(wrapper, null, headingEntry.backgroundColor);
              }
              const children = Array.from(headingEl.childNodes);
              children.forEach((ch) => wrapper.appendChild(ch));
              headingEl.appendChild(wrapper);
              try {
                const info = this._domRefs.get(block);
                if (info) info.matchCount = 1;
              } catch (e) {
              }
            }
            continue;
          } else {
            const c = headingEntry.color || headingEntry.textColor;
            if (c) {
              headingEl.style.color = c;
              try {
                headingEl.style.setProperty("--highlight-color", c);
              } catch (e) {
              }
              try {
                const info = this._domRefs.get(block);
                if (info) info.matchCount = 1;
              } catch (e) {
              }
              continue;
            }
          }
        }
      }
      const originalText = text;
      text = this.decodeHtmlEntities(text);
      if (originalText !== text && (text.includes("\u2713") || originalText.includes("&#10003;"))) {
        debugLog("PROCESSBLOCK", "Decoded checkmark:", {
          from: originalText.substring(0, 30),
          to: text.substring(0, 30)
        });
      }
      const isBlacklisted = (textToCheck) => {
        try {
          return this.isWordBlacklisted(textToCheck);
        } catch (e) {
          return false;
        }
      };
      const isForced = opts && opts.forceProcess || this.settings.forceFullRenderInReading;
      const maxMatches = typeof opts.maxMatches === "number" ? opts.maxMatches : isForced ? Infinity : 500;
      let matches = [];
      let textBgEntries = entries.filter((e) => e && e.isTextBg === true);
      const TEXT_BG_CHUNK_SIZE = 10;
      try {
        debugLog("TEXTBG_ENTRIES", `count=${textBgEntries.length}`);
      } catch (_) {
      }
      try {
        debugLog("PROCESSBLOCK_TEXT", `text="${text}", length=${text.length}, containsColon=${text.includes(":")}, containsPM=${text.toLowerCase().includes("pm")}`);
      } catch (_) {
      }
      if (textBgEntries.length > TEXT_BG_CHUNK_SIZE) {
        for (let i = 0; i < textBgEntries.length && matches.length < maxMatches; i += TEXT_BG_CHUNK_SIZE) {
          const chunk = textBgEntries.slice(i, i + TEXT_BG_CHUNK_SIZE);
          for (const entry of chunk) {
            if (!entry || entry.invalid) continue;
            try {
              if (entry.fastTest && typeof entry.fastTest === "function") {
                if (!entry.fastTest(text)) continue;
              }
            } catch (e) {
            }
            const regex = entry.regex;
            if (!regex) continue;
            const _matches = this.safeMatchLoop(regex, text);
            for (const match of _matches) {
              const matchedText = match[0];
              const matchStart = match.index;
              const matchEnd = match.index + matchedText.length;
              if (!this.settings.partialMatch && !this.isSentenceLikePattern(entry.pattern) && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
                continue;
              }
              let fullWordStart = matchStart;
              let fullWordEnd = matchEnd;
              if (!this.isSentenceLikePattern(entry.pattern)) {
                while (fullWordStart > 0 && (/[A-Za-z0-9]/.test(text[fullWordStart - 1]) || text[fullWordStart - 1] === "-" || text[fullWordStart - 1] === "'")) {
                  fullWordStart--;
                }
                while (fullWordEnd < text.length && (/[A-Za-z0-9]/.test(text[fullWordEnd]) || text[fullWordEnd] === "-" || text[fullWordEnd] === "'")) {
                  fullWordEnd++;
                }
              }
              const fullWord = this.isSentenceLikePattern(entry.pattern) ? matchedText : text.substring(fullWordStart, fullWordEnd);
              if (isBlacklisted(fullWord)) continue;
              const colorStart = matchStart;
              const colorEnd = matchEnd;
              matches.push({
                start: colorStart,
                end: colorEnd,
                textColor: entry.textColor,
                backgroundColor: entry.backgroundColor,
                isTextBg: true,
                entryLabel: entry.presetLabel || entry.pattern.substring(0, 20)
              });
              try {
                debugLog("TEXTBG_MATCH_ADDED", `entry="${entry.presetLabel || entry.pattern.substring(0, 20)}", text="${text.substring(colorStart, colorEnd)}", position=${colorStart}-${colorEnd}`);
              } catch (_) {
              }
              if (matches.length > maxMatches) break;
            }
            if (matches.length > maxMatches) break;
          }
        }
      } else {
        for (const entry of textBgEntries) {
          if (!entry || entry.invalid) continue;
          try {
            if (entry.fastTest && typeof entry.fastTest === "function") {
              if (!entry.fastTest(text)) continue;
            }
          } catch (e) {
          }
          const regex = entry.regex;
          if (!regex) continue;
          const _matches = this.safeMatchLoop(regex, text);
          for (const match of _matches) {
            const matchedText = match[0];
            const matchStart = match.index;
            const matchEnd = match.index + matchedText.length;
            if (!this.settings.partialMatch && !this.isSentenceLikePattern(entry.pattern) && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
              continue;
            }
            let fullWordStart = matchStart;
            let fullWordEnd = matchEnd;
            if (!this.isSentenceLikePattern(entry.pattern)) {
              while (fullWordStart > 0 && (/[A-Za-z0-9]/.test(text[fullWordStart - 1]) || text[fullWordStart - 1] === "-" || text[fullWordStart - 1] === "'")) {
                fullWordStart--;
              }
              while (fullWordEnd < text.length && (/[A-Za-z0-9]/.test(text[fullWordEnd]) || text[fullWordEnd] === "-" || text[fullWordEnd] === "'")) {
                fullWordEnd++;
              }
            }
            const fullWord = this.isSentenceLikePattern(entry.pattern) ? matchedText : text.substring(fullWordStart, fullWordEnd);
            if (isBlacklisted(fullWord)) continue;
            const colorStart = matchStart;
            const colorEnd = matchEnd;
            matches.push({
              start: colorStart,
              end: colorEnd,
              textColor: entry.textColor,
              backgroundColor: entry.backgroundColor,
              isTextBg: true,
              entryLabel: entry.presetLabel || entry.pattern.substring(0, 20)
            });
            try {
              debugLog("TEXTBG_MATCH_ADDED", `entry="${entry.presetLabel || entry.pattern.substring(0, 20)}", text="${text.substring(colorStart, colorEnd)}", position=${colorStart}-${colorEnd}`);
            } catch (_) {
            }
            if (matches.length > maxMatches) break;
          }
          if (matches.length > maxMatches) break;
        }
      }
      try {
        const tbCount = matches.filter((m) => m && m.isTextBg).length;
        debugLog("TEXTBG_MATCHES", `count=${tbCount}`);
      } catch (_) {
      }
      {
        let textOnlyEntries = entries.filter((e) => !e || !e.isTextBg);
        if (this.settings.partialMatch) {
          textOnlyEntries = textOnlyEntries.filter((e) => !e || e.styleType !== "text");
        }
        try {
          const tbCount = entries.filter((e) => e && e.isTextBg).length;
          const toCount = textOnlyEntries.length;
          debugLog("PATTERN_MATCH_FILTER", `Total entries=${entries.length}, TextBg=${tbCount}, TextOnly=${toCount}, partialMatch=${this.settings.partialMatch}`);
        } catch (_) {
        }
        const candidates = textOnlyEntries;
        const pm = this._patternMatcher ? this._patternMatcher.match(text, candidates, folderEntry) : [];
        for (const m of pm) {
          const overlappingTextBgIndices = [];
          for (let i = 0; i < matches.length; i++) {
            const tbMatch = matches[i];
            if (!tbMatch || !tbMatch.isTextBg) continue;
            if (m.start < tbMatch.end && m.end > tbMatch.start) {
              overlappingTextBgIndices.push(i);
            }
          }
          if (overlappingTextBgIndices.length > 0) {
            const mLength = m.end - m.start;
            const allShorter = overlappingTextBgIndices.every((i) => {
              const s = matches[i];
              return s.end - s.start < mLength;
            });
            if (!allShorter) {
              continue;
            }
            for (let i = overlappingTextBgIndices.length - 1; i >= 0; i--) {
              matches.splice(overlappingTextBgIndices[i], 1);
            }
          }
          matches.push(m);
          if (matches.length > maxMatches) break;
        }
      }
      if (matches.length > 1) {
        debugLog("OVERLAP", `Before resolution: ${matches.length} matches found`);
        matches.sort((a, b) => {
          if (a.start !== b.start) return a.start - b.start;
          const lenA = a.end - a.start;
          const lenB = b.end - b.start;
          if (lenA !== lenB) return lenB - lenA;
          const aHasText = a.isTextBg ? !!(a.textColor && a.textColor !== "currentColor") : !!a.color;
          const bHasText = b.isTextBg ? !!(b.textColor && b.textColor !== "currentColor") : !!b.color;
          if (aHasText && !bHasText) return -1;
          if (!aHasText && bHasText) return 1;
          if (a.isTextBg && !b.isTextBg) return -1;
          if (!a.isTextBg && b.isTextBg) return 1;
          return 0;
        });
        let nonOverlapping2 = [];
        for (const m of matches) {
          let overlapsWithSelected = false;
          for (const selected of nonOverlapping2) {
            if (m.start < selected.end && m.end > selected.start) {
              overlapsWithSelected = true;
              break;
            }
          }
          if (!overlapsWithSelected) {
            nonOverlapping2.push(m);
          }
        }
        matches = nonOverlapping2;
      }
      if (this.settings.partialMatch && textBgEntries.length > 0) {
        const wordRegex = /\S+/g;
        let match;
        while (match = wordRegex.exec(text)) {
          const w = match[0];
          const start = match.index;
          const end = start + w.length;
          if (isBlacklisted(w)) continue;
          for (const entry of textBgEntries) {
            if (!entry || entry.invalid) continue;
            if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
            if (isBlacklisted(entry.pattern)) continue;
            const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), "i"));
            if (testRe.test(w)) {
              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                if (start < existingMatch.end && end > existingMatch.start) {
                  overlapsWithExisting = true;
                  break;
                }
              }
              if (!overlapsWithExisting) {
                matches.push({
                  start,
                  end,
                  textColor: entry.textColor,
                  backgroundColor: entry.backgroundColor,
                  isTextBg: true,
                  styleType: "both"
                });
              } else {
                matches = matches.filter((m) => !(m.start >= start && m.end <= end && m.end - m.start < end - start));
                matches.push({
                  start,
                  end,
                  textColor: entry.textColor,
                  backgroundColor: entry.backgroundColor,
                  isTextBg: true,
                  styleType: "both"
                });
              }
              break;
            }
          }
          try {
            if (typeof wordRegex.lastIndex === "number" && wordRegex.lastIndex === match.index) wordRegex.lastIndex++;
          } catch (e) {
          }
        }
      }
      if (this.settings.partialMatch) {
        const textOnlyEntries = entries.filter((e) => e && !e.invalid && (!e.styleType || e.styleType === "text") && !e.isTextBg);
        if (textOnlyEntries.length > 0) {
          const wordRegex = /\S+/g;
          let match;
          while (match = wordRegex.exec(text)) {
            const w = match[0];
            const start = match.index;
            const end = start + w.length;
            if (isBlacklisted(w)) continue;
            for (const entry of textOnlyEntries) {
              if (!entry || entry.invalid) continue;
              if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
              if (isBlacklisted(entry.pattern)) continue;
              const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), "i"));
              if (testRe.test(w)) {
                let matchStart = start;
                let matchEnd = end;
                if (!this.isSentenceLikePattern(entry.pattern)) {
                  while (matchStart > 0 && (/[A-Za-z0-9]/.test(text[matchStart - 1]) || text[matchStart - 1] === "-" || text[matchStart - 1] === "'")) {
                    matchStart--;
                  }
                  while (matchEnd < text.length && (/[A-Za-z0-9]/.test(text[matchEnd]) || text[matchEnd] === "-" || text[matchEnd] === "'")) {
                    matchEnd++;
                  }
                }
                let overlapsWithExisting = false;
                for (const existingMatch of matches) {
                  if (matchStart < existingMatch.end && matchEnd > existingMatch.start) {
                    overlapsWithExisting = true;
                    break;
                  }
                }
                if (!overlapsWithExisting) {
                  const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
                  matches.push({ start: matchStart, end: matchEnd, color: useColor, styleType: "text", word: w, entry, folderEntry });
                } else {
                  matches = matches.filter((m) => !(m.start >= matchStart && m.end <= matchEnd && m.end - m.start < matchEnd - matchStart));
                  const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
                  matches.push({ start: matchStart, end: matchEnd, color: useColor, styleType: "text", word: w, entry, folderEntry });
                }
                break;
              }
            }
            try {
              if (typeof wordRegex.lastIndex === "number" && wordRegex.lastIndex === match.index) wordRegex.lastIndex++;
            } catch (e) {
            }
          }
        }
      }
      for (const entry of entries) {
        if (!entry || entry.invalid) continue;
        if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) {
          const regex = entry.regex;
          if (!regex) continue;
          const _matches = this.safeMatchLoop(regex, text);
          for (const match of _matches) {
            if (entry.isTextBg && entry.backgroundColor) {
              matches.push({ start: match.index, end: match.index + match[0].length, textColor: entry.textColor, backgroundColor: entry.backgroundColor, isTextBg: true, styleType: "both", word: match[0] });
            } else {
              const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
              matches.push({ start: match.index, end: match.index + match[0].length, color: useColor, word: match[0], highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
            }
          }
        }
      }
      if (this.settings.symbolWordColoring) {
        const symbolEntries = entries.filter((entry) => entry && !entry.invalid && /^[^a-zA-Z0-9]+$/.test(entry.pattern));
        if (symbolEntries.length > 0) {
          const wordRegex = /\b\w+[^\s]*\b/g;
          let match;
          while (match = wordRegex.exec(text)) {
            const w = match[0];
            const start = match.index;
            const end = start + w.length;
            if (isBlacklisted(w)) continue;
            for (const symEntry of symbolEntries) {
              const testRe = symEntry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(symEntry.pattern)) : new RegExp(this.escapeRegex(symEntry.pattern), "i"));
              if (testRe.test(w)) {
                if (symEntry.isTextBg && symEntry.backgroundColor) {
                  matches.push({ start, end, textColor: symEntry.textColor, backgroundColor: symEntry.backgroundColor, isTextBg: true, styleType: "both", word: w });
                } else {
                  const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : symEntry.color;
                  matches.push({ start, end, color: useColor, word: w });
                }
                break;
              }
            }
            try {
              if (typeof wordRegex.lastIndex === "number" && wordRegex.lastIndex === match.index) wordRegex.lastIndex++;
            } catch (e) {
            }
          }
        }
      }
      if (matches.length > 1) {
        matches.sort((a, b) => {
          if (a.start !== b.start) return a.start - b.start;
          const lenA = a.end - a.start;
          const lenB = b.end - b.start;
          if (lenA !== lenB) return lenB - lenA;
          const aHasText = a.isTextBg ? !!(a.textColor && a.textColor !== "currentColor") : !!a.color;
          const bHasText = b.isTextBg ? !!(b.textColor && b.textColor !== "currentColor") : !!b.color;
          if (aHasText && !bHasText) return -1;
          if (!aHasText && bHasText) return 1;
          if (a.isTextBg && !b.isTextBg) return -1;
          if (!a.isTextBg && b.isTextBg) return 1;
          return 0;
        });
        let nonOverlapping2 = [];
        for (const m of matches) {
          let overlapsWithSelected = false;
          for (const selected of nonOverlapping2) {
            if (m.start < selected.end && m.end > selected.start) {
              overlapsWithSelected = true;
              break;
            }
          }
          if (!overlapsWithSelected) {
            nonOverlapping2.push(m);
          }
        }
        matches = nonOverlapping2;
      }
      matches.sort((a, b) => a.start - b.start);
      let nonOverlapping = matches;
      const seenRanges = /* @__PURE__ */ new Set();
      const beforeDedup = nonOverlapping.length;
      nonOverlapping = nonOverlapping.filter((m) => {
        const key = `${m.start}-${m.end}`;
        if (seenRanges.has(key)) {
          debugLog("DEDUP_MATCH", `Removing duplicate match: '${m.word || "unknown"}' at ${m.start}-${m.end}`);
          return false;
        }
        seenRanges.add(key);
        return true;
      });
      if (beforeDedup !== nonOverlapping.length) {
        debugLog("DEDUP_SUMMARY", `Removed ${beforeDedup - nonOverlapping.length} duplicates`);
      }
      let lastEnd = 0;
      try {
        debugLog("READING_BLOCK", `matches=${nonOverlapping.length}, hideTextColors=${this.settings.hideTextColors === true}, hideHighlights=${this.settings.hideHighlights === true}`);
      } catch (_) {
      }
      if (nonOverlapping.length) {
        const frag = document.createDocumentFragment();
        let pos = 0;
        let i = 0;
        while (i < nonOverlapping.length) {
          let m = nonOverlapping[i];
          let j = i + 1;
          while (j < nonOverlapping.length && nonOverlapping[j].start === nonOverlapping[j - 1].end && !m.isTextBg && !nonOverlapping[j].isTextBg && (nonOverlapping[j].color === m.color || nonOverlapping[j].textColor === m.textColor && nonOverlapping[j].backgroundColor === m.backgroundColor || nonOverlapping[j].styleType === m.styleType)) {
            m = { start: m.start, end: nonOverlapping[j].end, color: m.color, styleType: m.styleType, textColor: m.textColor, backgroundColor: m.backgroundColor };
            j++;
          }
          if (m.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
          if (effectiveStyle === "none") {
            frag.appendChild(document.createTextNode(text.slice(m.start, m.end)));
          } else {
            const span = document.createElement("span");
            span.className = "always-color-text-highlight";
            span.textContent = text.slice(m.start, m.end);
            const styleType2 = m.isTextBg ? "both" : m.styleType || "text";
            const hideText = this.settings.hideTextColors === true;
            const hideBg = this.settings.hideHighlights === true;
            let shouldAppendSpan = true;
            if (styleType2 === "text") {
              if (hideText) {
                frag.appendChild(document.createTextNode(text.slice(m.start, m.end)));
                shouldAppendSpan = false;
              } else {
                const textColor = m.color || (m.textColor && m.textColor !== "currentColor" ? m.textColor : null);
                if (textColor) {
                  try {
                    span.style.setProperty("color", textColor, "important");
                  } catch (_) {
                    span.style.color = textColor;
                  }
                  try {
                    span.style.setProperty("--highlight-color", textColor);
                  } catch (e) {
                  }
                }
                try {
                  debugLog("READING_TEXT_FULL", `applied color=${textColor || "none"}, hideTextColors=${this.settings.hideTextColors === true}, hideHighlights=${this.settings.hideHighlights === true}`);
                } catch (_) {
                }
              }
            } else if (styleType2 === "highlight") {
              if (hideBg) {
                frag.appendChild(document.createTextNode(text.slice(m.start, m.end)));
                shouldAppendSpan = false;
              } else {
                const bgColor = m.backgroundColor || m.color || (m.textColor && m.textColor !== "currentColor" ? m.textColor : null) || (folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : null);
                span.style.background = "";
                try {
                  span.style.setProperty("background-color", this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25), "important");
                } catch (_) {
                  span.style.backgroundColor = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
                }
                try {
                  span.style.setProperty("padding-left", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
                  span.style.setProperty("padding-right", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
                } catch (_) {
                  span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
                }
                const br = (this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0 ? "0px" : (this.settings.highlightBorderRadius ?? 8) + "px";
                try {
                  span.style.setProperty("border-radius", br, "important");
                } catch (_) {
                  span.style.borderRadius = br;
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  span.style.boxDecorationBreak = "clone";
                  span.style.WebkitBoxDecorationBreak = "clone";
                }
                this.applyBorderStyleToElement(span, null, bgColor);
                try {
                  debugLog("READING_HIGHLIGHT", `applied bg=${bgColor || "none"}`);
                } catch (_) {
                }
              }
            } else if (styleType2 === "both") {
              const textColor = m.textColor && m.textColor !== "currentColor" ? m.textColor : m.color || null;
              const bgColor = m.backgroundColor || m.color || (folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : null);
              if (!hideText && textColor) {
                try {
                  span.style.setProperty("color", textColor, "important");
                } catch (_) {
                  span.style.color = textColor;
                }
                try {
                  span.style.setProperty("--highlight-color", textColor);
                } catch (e) {
                }
              } else if (hideText && !hideBg && !textColor && bgColor) {
              }
              if (!hideBg) {
                span.style.background = "";
                try {
                  span.style.setProperty("background-color", this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25), "important");
                } catch (_) {
                  span.style.backgroundColor = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
                }
                try {
                  span.style.setProperty("padding-left", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
                  span.style.setProperty("padding-right", (this.settings.highlightHorizontalPadding ?? 4) + "px", "important");
                } catch (_) {
                  span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
                }
                const br2 = (this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0 ? "0px" : (this.settings.highlightBorderRadius ?? 8) + "px";
                try {
                  span.style.setProperty("border-radius", br2, "important");
                } catch (_) {
                  span.style.borderRadius = br2;
                }
                if (this.settings.enableBoxDecorationBreak ?? true) {
                  span.style.boxDecorationBreak = "clone";
                  span.style.WebkitBoxDecorationBreak = "clone";
                }
                try {
                  debugLog("READING_BOTH", `applied text=${textColor || "none"}, bg=${bgColor || "none"}`);
                } catch (_) {
                }
              }
              if (hideText && hideBg) {
                frag.appendChild(document.createTextNode(text.slice(m.start, m.end)));
                shouldAppendSpan = false;
              }
              this.applyBorderStyleToElement(span, hideText ? null : textColor, hideBg ? null : bgColor);
            }
            if (shouldAppendSpan) {
              frag.appendChild(span);
            }
          }
          pos = m.end;
          i = j;
        }
        if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
        node.replaceWith(frag);
        try {
          const info = this._domRefs.get(block);
          if (info) info.matchCount = effectiveStyle === "none" ? 0 : nonOverlapping.length;
        } catch (e) {
        }
      }
    }
  }
  // Async chunked processing to prevent UI freezes on large documents
  async processInChunks(element, entries, folderEntry = null, options = {}) {
    const selector = "p, li, div, span, td, th, blockquote, h1, h2, h3, h4, h5, h6";
    const batch = Number(options.batchSize) || 20;
    const blocks = [];
    const tags = new Set(selector.split(",").map((s) => s.trim().toUpperCase()));
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
    debugLog("CHUNK", `start: ${blocks.length} blocks, batch=${batch}, startIndex=${startIndex}, forceProcess=${forceProcess}`);
    for (let i = startIndex; i < blocks.length; i++) {
      if (!forceProcess && this.performanceMonitor && this.performanceMonitor.isOverloaded && this.performanceMonitor.isOverloaded()) {
        debugWarn("CHUNK", `paused at block ${i} due to perf overload`);
        const resumeOpts = Object.assign({}, options, { skipFirstN: i });
        setTimeout(() => {
          try {
            this.processInChunks(element, entries, folderEntry, resumeOpts);
          } catch (e) {
            debugError("CHUNK", "retry failed", e);
          }
        }, 300);
        blocks.length = 0;
        return;
      }
      try {
        this._errorRecovery.wrap("PROCESS_BLOCK", () => this._processBlock(blocks[i], entries, folderEntry, {
          clearExisting: options.clearExisting !== false,
          effectiveStyle: "text",
          forceProcess: forceProcess || this.settings.forceFullRenderInReading,
          maxMatches: options && typeof options.maxMatches !== "undefined" ? options.maxMatches : forceProcess || this.settings.forceFullRenderInReading ? Infinity : void 0
        }), () => null);
      } catch (e) {
        debugError("CHUNK", "block error", e);
      }
      const yieldInterval = forceProcess ? 50 : batch;
      if (i % yieldInterval === 0 && i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    debugLog("CHUNK", `done: ${blocks.length} blocks processed`);
    blocks.length = 0;
  }
  _processLivePreviewCallouts(view) {
    try {
      const now = Date.now();
      if (this._lpLastRun && now - this._lpLastRun < 200) return;
      this._lpLastRun = now;
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      const isLP = root.closest && root.closest(".is-live-preview");
      if (!isLP) return;
      const callouts = root.querySelectorAll(".cm-callout, .callout");
      if (!callouts || callouts.length === 0) return;
      const fileForView = view.file || this.app.workspace.getActiveFile();
      const filePath = fileForView ? fileForView.path : null;
      const docDisabled = !!(filePath && this.settings.disabledFiles && this.settings.disabledFiles.includes(filePath));
      const fmDisabled = !!(filePath && this.isFrontmatterColoringDisabled && this.isFrontmatterColoringDisabled(filePath));
      if (!this.settings.enabled || docDisabled || fmDisabled) {
        for (const co of callouts) {
          try {
            const highlights = co.querySelectorAll(".always-color-text-highlight");
            for (const hl of highlights) {
              const textNode = document.createTextNode(hl.textContent);
              hl.replaceWith(textNode);
            }
          } catch (_) {
          }
        }
        return;
      }
      const allEntries = this.getSortedWordEntries();
      const entries = filePath ? this.filterEntriesByAdvancedRules(filePath, allEntries) : allEntries;
      const folderEntry = filePath ? this.getBestFolderEntry(filePath) : null;
      if (!this._lpCalloutCache) this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
      for (const co of callouts) {
        try {
          const hasContent = co.textContent && co.textContent.trim().length > 0;
          if (!hasContent) continue;
          const sig = [
            co.textContent ? co.textContent.length : 0,
            co.childElementCount || 0,
            this.settings.enabled ? 1 : 0,
            this.settings.hideTextColors ? 1 : 0,
            this.settings.hideHighlights ? 1 : 0,
            docDisabled ? 1 : 0,
            fmDisabled ? 1 : 0
          ].join(":");
          const prev = this._lpCalloutCache.get(co);
          if (prev === sig) continue;
          this._lpCalloutCache.set(co, sig);
          this.processInChunks(co, entries, folderEntry, {
            clearExisting: true,
            batchSize: 10,
            forceProcess: true,
            maxMatches: Infinity
          });
        } catch (_) {
        }
      }
    } catch (e) {
      try {
        debugError("LP_CALLOUT", "Failed coloring live preview callouts", e);
      } catch (_) {
      }
    }
  }
  refreshAllLivePreviewCallouts() {
    try {
      this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
      try {
        this._lpLastRun = 0;
      } catch (_) {
      }
      this.app.workspace.iterateAllLeaves((leaf) => {
        try {
          if (!(leaf.view instanceof MarkdownView)) return;
          if (leaf.view.getMode && leaf.view.getMode() !== "source") return;
          const view = leaf.view && (leaf.view.editor?.cm?.view || leaf.view.editor?.view || leaf.view.view || null);
          if (view) {
            const root = view && view.dom ? view.dom : null;
            if (root) {
              try {
                const callouts = root.querySelectorAll(".cm-callout, .callout");
                for (const co of callouts) {
                  const highlights = co.querySelectorAll(".always-color-text-highlight");
                  for (const hl of highlights) {
                    const textNode = document.createTextNode(hl.textContent);
                    hl.replaceWith(textNode);
                  }
                }
              } catch (e) {
              }
            }
            if (this.settings.enabled) {
              this._processLivePreviewCallouts(view);
              try {
                this._attachLivePreviewCalloutObserver(view);
              } catch (_) {
              }
              setTimeout(() => {
                try {
                  this._processLivePreviewCallouts(view);
                } catch (_) {
                }
              }, 250);
            }
          }
        } catch (_) {
        }
      });
    } catch (_) {
    }
  }
  forceReprocessLivePreviewCallouts() {
    const runPass = (delay) => {
      setTimeout(() => {
        try {
          this._lpLastRun = 0;
        } catch (_) {
        }
        try {
          this._lpCalloutCache = /* @__PURE__ */ new WeakMap();
        } catch (_) {
        }
        try {
          this.app.workspace.iterateAllLeaves((leaf) => {
            try {
              if (!(leaf.view instanceof MarkdownView)) return;
              if (leaf.view.getMode && leaf.view.getMode() !== "source") return;
              const view = leaf.view && (leaf.view.editor?.cm?.view || leaf.view.editor?.view || leaf.view.view || null);
              if (view) {
                try {
                  this._attachLivePreviewCalloutObserver(view);
                } catch (_) {
                }
                try {
                  this.refreshEditor(leaf.view, true);
                } catch (_) {
                }
                try {
                  this._processLivePreviewCallouts(view);
                } catch (_) {
                }
              }
            } catch (_) {
            }
          });
        } catch (_) {
        }
      }, delay);
    };
    runPass(0);
    runPass(60);
    runPass(260);
    runPass(800);
  }
  _attachLivePreviewCalloutObserver(view) {
    try {
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      const existing = this._lpObservers && this._lpObservers.get ? this._lpObservers.get(root) : null;
      if (existing) return;
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          try {
            if (m.type === "childList") {
              for (const node of m.addedNodes || []) {
                if (node && node.nodeType === 1) {
                  const el = node;
                  if (el.classList && (el.classList.contains("cm-callout") || el.classList.contains("callout")) || el.querySelector && el.querySelector(".cm-callout, .callout")) {
                    this._processLivePreviewCallouts(view);
                    return;
                  }
                }
              }
            } else if (m.type === "characterData" || m.type === "attributes") {
              this._processLivePreviewCallouts(view);
              return;
            }
          } catch (_) {
          }
        }
      });
      observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true });
      try {
        this._lpObservers.set(root, observer);
      } catch (_) {
      }
    } catch (_) {
    }
  }
  _detachLivePreviewCalloutObserver(view) {
    try {
      const root = view && view.dom ? view.dom : null;
      if (!root) return;
      const existing = this._lpObservers && this._lpObservers.get ? this._lpObservers.get(root) : null;
      if (existing && existing.disconnect) {
        try {
          existing.disconnect();
        } catch (_) {
        }
        try {
          this._lpObservers.delete(root);
        } catch (_) {
        }
      }
    } catch (_) {
    }
  }
  // Setup IntersectionObserver to process only blocks as they enter the viewport
  setupViewportObserver(rootEl, folderEntry = null, options = {}) {
    try {
      if (!rootEl || !rootEl.isConnected) return;
      if (!this._viewportObservers) {
        this._viewportObservers = /* @__PURE__ */ new Map();
      }
      try {
        const prev = this._viewportObservers.get(rootEl);
        if (prev && typeof prev.disconnect === "function") prev.disconnect();
      } catch (e) {
        debugError("VIEWPORT", "Error disconnecting old observer", e);
      }
      const selectorTags = /* @__PURE__ */ new Set(["P", "LI", "DIV", "SPAN", "TD", "TH", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"]);
      const blocks = [];
      try {
        const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        while (node = walker.nextNode()) {
          if (!node || !node.nodeName) continue;
          if (["CODE", "PRE"].includes(node.nodeName)) continue;
          try {
            if (node.closest(".act-skip-coloring") || node.classList.contains("act-skip-coloring")) continue;
          } catch (_) {
          }
          if (selectorTags.has(node.nodeName)) blocks.push(node);
        }
      } catch (e) {
        try {
          const nodeList = rootEl.querySelectorAll("p:not(.act-skip-coloring), li:not(.act-skip-coloring), div:not(.act-skip-coloring), span:not(.act-skip-coloring), td:not(.act-skip-coloring), th:not(.act-skip-coloring), blockquote:not(.act-skip-coloring), h1:not(.act-skip-coloring), h2:not(.act-skip-coloring), h3:not(.act-skip-coloring), h4:not(.act-skip-coloring), h5:not(.act-skip-coloring), h6:not(.act-skip-coloring)");
          for (const n of nodeList) blocks.push(n);
        } catch (err) {
          debugError("VIEWPORT", "querySelectorAll fallback failed", err);
        }
      }
      if (blocks.length === 0) return;
      const processed = /* @__PURE__ */ new WeakSet();
      const observerOptions = {
        root: rootEl,
        rootMargin: options.rootMargin || "300px 0px 300px 0px",
        threshold: options.threshold || 0.01
      };
      const pq = new PriorityQueue();
      let processing = false;
      const processNext = () => {
        if (processing) return;
        processing = true;
        const run = () => {
          const blk = pq.pop();
          if (!blk) {
            processing = false;
            return;
          }
          try {
            const es = options && Array.isArray(options.entries) ? options.entries : this.getSortedWordEntries();
            this._errorRecovery.wrap("PROCESS_BLOCK", () => this._processBlock(blk, es, folderEntry, { clearExisting: options.clearExisting !== false, effectiveStyle: "text", forceProcess: options.forceProcess || this.settings.forceFullRenderInReading, maxMatches: options.maxMatches || (this.settings.forceFullRenderInReading ? Infinity : void 0) }), () => null);
          } catch (e) {
            debugError("VIEWPORT", "_processBlock failed", e);
          }
          if (pq.size() > 0) {
            setTimeout(run, 0);
          } else {
            processing = false;
          }
        };
        setTimeout(run, 0);
      };
      const io = new IntersectionObserver((entries) => {
        for (const ent of entries) {
          try {
            const block = ent.target;
            if (ent.isIntersecting) {
              try {
                if (block.closest(".act-skip-coloring") || block.classList.contains("act-skip-coloring")) {
                  io.unobserve(block);
                  continue;
                }
              } catch (_) {
              }
              if (processed.has(block)) {
                try {
                  io.unobserve(block);
                } catch (e) {
                }
                continue;
              }
              processed.add(block);
              try {
                io.unobserve(block);
              } catch (e) {
              }
              const r = ent.intersectionRatio || 0;
              const rect = block.getBoundingClientRect();
              const dist = Math.abs(rect.top - 0) + Math.abs(rect.bottom - window.innerHeight);
              const pr = r * 1e3 - dist;
              pq.push(block, pr);
            }
          } catch (e) {
            debugError("VIEWPORT", "observer entry error", e);
          }
        }
        processNext();
      }, observerOptions);
      for (const b of blocks) {
        try {
          io.observe(b);
        } catch (e) {
          debugError("VIEWPORT", "Error observing block", e);
        }
      }
      try {
        if (!this._viewportObservers) this._viewportObservers = /* @__PURE__ */ new Map();
        this._viewportObservers.set(rootEl, io);
      } catch (e) {
        debugError("VIEWPORT", "Error storing observer", e);
      }
      try {
        const firstN = Number(options.immediateBlocks) || 10;
        let count = 0;
        for (const b of blocks) {
          if (count >= firstN) break;
          const rect = b.getBoundingClientRect();
          if (rect.top < window.innerHeight + 400 && rect.bottom > -400) {
            if (!processed.has(b)) {
              processed.add(b);
              try {
                io.unobserve(b);
              } catch (e) {
              }
              try {
                if (b.closest(".act-skip-coloring") || b.classList.contains("act-skip-coloring")) {
                  continue;
                }
              } catch (_) {
              }
              pq.push(b, 1e3);
            }
            count++;
          }
        }
        processNext();
      } catch (e) {
        debugError("VIEWPORT", "Error prefetching visible blocks", e);
      }
      debugLog("VIEWPORT", `observer set: ${blocks.length} blocks, immediate=${options.immediateBlocks || 10}`);
      const debounce2 = (fn, ms) => {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn(...args), ms);
        };
      };
      const onChange = debounce2(() => {
        processNext();
      }, 100);
      const scrollH = this._eventManager.add(window, "scroll", onChange, { passive: true, debounceMs: 100, useRaf: true, viewType: "reading", priority: 1 });
      const resizeH = this._eventManager.add(window, "resize", onChange, { debounceMs: 100, useRaf: true, viewType: "reading", priority: 1 });
      const memCheck = () => {
        try {
          if (performance && performance.memory) {
            const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
            if (usedMB > 1e3) {
              for (const b of blocks) {
                const rect = b.getBoundingClientRect();
                if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
                  const highlights = b.querySelectorAll("span.always-color-text-highlight");
                  for (const ex of highlights) {
                    const tn = document.createTextNode(ex.textContent);
                    ex.replaceWith(tn);
                  }
                }
              }
            }
          }
        } catch (_) {
        }
      };
      setInterval(memCheck, 2e3);
    } catch (e) {
      debugError("VIEWPORT", "setup failed", e);
    }
  }
  // NEW METHOD: Optimized decorations for non-Roman text
  buildNonRomanOptimizedDeco(view, builder, from, to, text) {
    const plugin = this;
    const activeFile = this.app.workspace.getActiveFile();
    if (!this.settings.enabled) return builder.finish();
    if (activeFile) {
      const prnr = this.evaluatePathRules(activeFile.path);
      if (prnr.excluded || this.hasGlobalExclude() && prnr.hasIncludes && !prnr.included) return builder.finish();
    }
    if (activeFile && this.settings.disabledFiles.includes(activeFile.path)) return builder.finish();
    if (activeFile && this.isFrontmatterColoringDisabled(activeFile.path)) return builder.finish();
    const folderEntry = activeFile ? this.getBestFolderEntry(activeFile.path) : null;
    const entries = this.getSortedWordEntries();
    const nonRomanEntries = entries.filter(
      (entry) => entry && !entry.invalid && this.containsNonRomanCharacters(entry.pattern)
    );
    if (nonRomanEntries.length === 0) return builder.finish();
    let matches = [];
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
    const effectiveStyle = "text";
    if (effectiveStyle === "none") return builder.finish();
    for (const m of matches) {
      const style = effectiveStyle === "text" ? `color: ${m.color} !important; --highlight-color: ${m.color};` : `background: none !important; background-color: ${this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0 ? 0 : this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
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
        this.view = view;
        this.decorations = this.buildDeco(view);
        this.lastFilePath = view.file ? view.file.path : null;
        try {
          if (plugin.settings.enabled) plugin._processLivePreviewCallouts(view);
        } catch (_) {
        }
        try {
          if (plugin.settings.enabled) plugin._attachLivePreviewCalloutObserver(view);
        } catch (_) {
        }
      }
      update(update) {
        const currentFilePath = plugin.app.workspace.getActiveFile()?.path;
        const fileChanged = this.lastFilePath !== currentFilePath;
        this.lastFilePath = currentFilePath;
        if (update.docChanged || update.viewportChanged || fileChanged) {
          this.decorations = this.buildDeco(update.view);
          try {
            if (plugin.settings.enabled) plugin._processLivePreviewCallouts(update.view);
          } catch (_) {
          }
        }
      }
      destroy() {
        try {
          plugin._detachLivePreviewCalloutObserver(this.view);
        } catch (_) {
        }
      }
      buildDeco(view) {
        const builder = new RangeSetBuilder();
        let entries = plugin.getSortedWordEntries();
        const { from, to } = view.viewport;
        const docLength = view.state.doc.length;
        const extendedTo = Math.min(to + 50, docLength);
        const text = view.state.doc.sliceString(from, extendedTo);
        const fileForView = view.file || plugin.app.workspace.getActiveFile();
        if (!plugin.settings.enabled) return builder.finish();
        if (fileForView) {
          const prb = plugin.evaluatePathRules(fileForView.path);
          if (plugin.settings.disabledFiles.includes(fileForView.path)) return builder.finish();
          if (plugin.isFrontmatterColoringDisabled(fileForView.path)) return builder.finish();
          let previewEntries = entries;
          if (fileForView && fileForView.path) previewEntries = plugin.filterEntriesByAdvancedRules(fileForView.path, entries);
          if ((prb.excluded || plugin.hasGlobalExclude() && prb.hasIncludes && !prb.included) && previewEntries.length === 0) return builder.finish();
          entries = previewEntries;
        }
        const folderEntry = fileForView ? plugin.getBestFolderEntry(fileForView.path) : null;
        if (fileForView && fileForView.path) {
          entries = plugin.filterEntriesByAdvancedRules(fileForView.path, entries);
        }
        if (entries.length === 0) return builder.finish();
        if (entries.length > EDITOR_PERFORMANCE_CONSTANTS.MAX_PATTERNS_STANDARD || text.length > EDITOR_PERFORMANCE_CONSTANTS.MAX_TEXT_LENGTH_STANDARD) {
          return plugin.buildDecoChunked(view, builder, from, extendedTo, text, entries, folderEntry, fileForView ? fileForView.path : null);
        }
        return plugin.buildDecoStandard(view, builder, from, extendedTo, text, entries, folderEntry, fileForView ? fileForView.path : null);
      }
    }, {
      decorations: (v) => v.decorations
    });
  }
  // NEW METHOD: Extract full word containing a match
  extractFullWord(text, matchStart, matchEnd) {
    let fullWordStart = matchStart;
    let fullWordEnd = matchEnd;
    while (fullWordStart > 0 && /\w/.test(text[fullWordStart - 1]) && text[fullWordStart - 1] !== "_" && text[fullWordStart - 1] !== "*") {
      fullWordStart--;
    }
    while (fullWordEnd < text.length && /\w/.test(text[fullWordEnd]) && text[fullWordEnd] !== "_" && text[fullWordEnd] !== "*") {
      fullWordEnd++;
    }
    return text.substring(fullWordStart, fullWordEnd);
  }
  // NEW METHOD: Extract content from list item element, stripping markdown prefixes
  extractListItemContent(liElement) {
    try {
      if (!liElement) return "";
      const text = this.decodeHtmlEntities(String(liElement.textContent || ""));
      if (!text) return "";
      let content = text.replace(/^\s*\[[\s\xX]\]\s*/, "");
      if (content === text) {
        content = text.replace(/^\s*[\-\*]\s+\[[^\]]*\]\s+/, "");
      }
      if (content === text) {
        content = text.replace(/^\s*[\-\*]\s+/, "");
      }
      if (content === text) {
        content = text.replace(/^\s*\d+\.\s+/, "");
      }
      return content;
    } catch (e) {
      return "";
    }
  }
  // NEW METHOD: Check if word is blacklisted
  isWordBlacklisted(word) {
    try {
      const entries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const words = Array.isArray(this.settings.blacklistWords) ? this.settings.blacklistWords : [];
      const w = String(word);
      for (const bw of words) {
        if (!bw) continue;
        const re = this.settings.caseSensitive ? new RegExp(`\\b${this.escapeRegex(String(bw))}\\b`) : new RegExp(`\\b${this.escapeRegex(String(bw))}\\b`, "i");
        if (re.test(w)) return true;
      }
      for (const entry of entries) {
        if (!entry) continue;
        if (entry.isRegex && this.settings.enableRegexSupport) {
          try {
            const flags = entry.flags || (this.settings.caseSensitive ? "" : "i");
            const re = new RegExp(entry.pattern, flags);
            if (re.test(w)) return true;
          } catch (e) {
          }
        } else {
          const patterns = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns : [entry.pattern];
          for (const p of patterns) {
            if (!p) continue;
            const re2 = this.settings.caseSensitive ? new RegExp(`\\b${this.escapeRegex(String(p))}\\b`) : new RegExp(`\\b${this.escapeRegex(String(p))}\\b`, "i");
            if (re2.test(w)) return true;
          }
        }
      }
    } catch (e) {
    }
    return false;
  }
  containsBlacklistedWord(text) {
    try {
      const entries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const words = Array.isArray(this.settings.blacklistWords) ? this.settings.blacklistWords : [];
      const t = String(text);
      for (const bw of words) {
        if (!bw) continue;
        const re = this.settings.caseSensitive ? new RegExp(`\\b${this.escapeRegex(String(bw))}\\b`) : new RegExp(`\\b${this.escapeRegex(String(bw))}\\b`, "i");
        if (re.test(t)) return true;
      }
      for (const entry of entries) {
        if (!entry) continue;
        if (entry.isRegex && this.settings.enableRegexSupport) {
          try {
            const flags = entry.flags || (this.settings.caseSensitive ? "" : "i");
            const re = new RegExp(entry.pattern, flags);
            if (re.test(t)) return true;
          } catch (e) {
          }
        } else {
          const patterns = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns : [entry.pattern];
          for (const p of patterns) {
            if (!p) continue;
            const re2 = this.settings.caseSensitive ? new RegExp(`\\b${this.escapeRegex(String(p))}\\b`) : new RegExp(`\\b${this.escapeRegex(String(p))}\\b`, "i");
            if (re2.test(t)) return true;
          }
        }
      }
    } catch (e) {
    }
    return false;
  }
  // NEW METHOD: Check if a full line is blacklisted by regex pattern (for markdown formatting)
  isLineBlacklistedByRegex(line) {
    try {
      const entries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const l = String(line);
      for (const entry of entries) {
        if (!entry || !entry.isRegex) continue;
        try {
          const flags = entry.flags || (this.settings.caseSensitive ? "" : "i");
          const re = new RegExp(entry.pattern, flags);
          if (re.test(l)) return true;
        } catch (e) {
        }
      }
    } catch (e) {
    }
    return false;
  }
  // NEW METHOD: Get all text ranges that are within blacklisted list items
  getBlacklistedListItemRanges(text, baseOffset = 0) {
    const ranges = [];
    try {
      let pos = 0;
      while (pos <= text.length) {
        const lineStart = pos;
        const nextNL = text.indexOf("\n", pos);
        const lineEnd = nextNL === -1 ? text.length : nextNL;
        const line = text.substring(lineStart, lineEnd);
        if (this.isLineBlacklistedByRegex(line)) {
          ranges.push({
            start: baseOffset + lineStart,
            end: baseOffset + lineEnd
          });
        }
        if (nextNL === -1) break;
        pos = nextNL + 1;
      }
    } catch (e) {
    }
    return ranges;
  }
  // NEW METHOD: Check if a match position falls within blacklisted ranges
  isMatchInBlacklistedRange(matchStart, matchEnd, blacklistedRanges) {
    try {
      for (const range of blacklistedRanges) {
        if (matchStart < range.end && matchEnd > range.start) {
          return true;
        }
      }
    } catch (e) {
    }
    return false;
  }
  // NEW METHOD: Context-aware blacklist check with prefix-aware tokens
  isContextBlacklisted(text, matchStart, matchEnd) {
    try {
      const fullWord = this.extractFullWord(text, matchStart, matchEnd);
      if (this.isWordBlacklisted(fullWord)) return true;
      if (matchStart > 0) {
        const prev = text[matchStart - 1];
        if (prev && /[@#]/.test(prev)) {
          const token = prev + fullWord;
          if (this.isWordBlacklisted(token)) return true;
        }
      }
      let ls = matchStart;
      while (ls > 0 && text[ls - 1] !== "\n") ls--;
      let le = matchEnd;
      while (le < text.length && text[le] !== "\n") le++;
      const line = text.substring(ls, le);
      const mTaskChecked = /^\s*[\-\*]\s+\[[xX]\]\s+(.*)$/.exec(line);
      const mTaskUnchecked = /^\s*[\-\*]\s+\[\s\]\s+(.*)$/.exec(line);
      const mNumbered = /^\s*\d+\.\s+(.*)$/.exec(line);
      const mBullet = /^\s*[\-\*]\s+(.*)$/.exec(line);
      const content = mTaskChecked && mTaskChecked[1] || mTaskUnchecked && mTaskUnchecked[1] || mNumbered && mNumbered[1] || mBullet && mBullet[1] || null;
      if (content && this.containsBlacklistedWord(content)) return true;
    } catch (e) {
    }
    return false;
  }
  // Helper: Check if a position is within a codeblock
  isPositionInCodeblock(pos, text, from) {
    try {
      const codeblockPattern = /```[\s\S]*?```/g;
      let match;
      while ((match = codeblockPattern.exec(text)) !== null) {
        const cbStart = from + match.index;
        const cbEnd = from + match.index + match[0].length;
        if (pos >= cbStart && pos <= cbEnd) return true;
      }
    } catch (e) {
    }
    return false;
  }
  // NEW METHOD: Standard editor processing for small/medium pattern/text sizes
  buildDecoStandard(view, builder, from, to, text, entries, folderEntry, filePath = null) {
    const entries_copy = entries || this.getSortedWordEntries();
    const allTimeEntries = entries_copy.filter((e) => e && e.presetLabel && (e.presetLabel.includes("Times") || e.pattern.includes("am")));
    debugLog("TIMEPM_ENTRY", `Total entries=${entries_copy.length}, Time entries found=${allTimeEntries.length}`);
    if (allTimeEntries.length > 0) {
      allTimeEntries.forEach((e, i) => {
        debugLog("TIMEPM_ENTRY", `[${i}] pattern=${e.pattern.substring(0, 50)}, regex=${e.regex ? "yes" : "no"}, invalid=${e.invalid}, presetLabel=${e.presetLabel}`);
      });
    }
    const timeEntry = entries_copy.find((e) => e && e.presetLabel && e.presetLabel.includes("Times"));
    if (timeEntry) {
      debugLog("TIMEPM_ENTRY", `Found timepm entry, regex=${timeEntry.regex ? "yes" : "no"}, invalid=${timeEntry.invalid}`);
    } else {
      debugLog("TIMEPM_ENTRY", "No timepm entry found in entries");
    }
    let matches = [];
    let headingRanges = [];
    let hasHeadingBlacklist = false;
    let codeblockRanges = [];
    try {
      const codeblockPattern = /```[\s\S]*?```/g;
      let cbMatch;
      while ((cbMatch = codeblockPattern.exec(text)) !== null) {
        const codeblockStart = from + cbMatch.index;
        const codeblockEnd = from + cbMatch.index + cbMatch[0].length;
        codeblockRanges.push({ start: codeblockStart, end: codeblockEnd });
      }
      const we = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
      const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const codeblockEntry = we.find((e) => e && e.presetLabel === "Codeblocks");
      const hasCodeblockBlacklist = !!blEntries.find((e) => e && e.presetLabel === "Codeblocks" && !!e.isRegex);
      if (hasCodeblockBlacklist) {
        for (const cbRange of codeblockRanges) {
          matches.push({ start: cbRange.start, end: cbRange.end, skip: true });
        }
      } else if (codeblockEntry) {
        for (const cbMatch2 of text.matchAll(/```[\s\S]*?```/g)) {
          const start = from + cbMatch2.index;
          const end = from + cbMatch2.index + cbMatch2[0].length;
          if (codeblockEntry.backgroundColor) {
            const tc = codeblockEntry.textColor || "currentColor";
            const bc = codeblockEntry.backgroundColor;
            matches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
          } else {
            const c = codeblockEntry.color || codeblockEntry.textColor;
            if (c) matches.push({ start, end, color: c });
          }
        }
      }
    } catch (e) {
    }
    try {
      const label = "All Headings (H1-H6)";
      const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      hasHeadingBlacklist = !!blEntries.find((e) => e && e.presetLabel === label && !!e.isRegex);
      headingRanges = [];
      let posScan = 0;
      while (posScan <= text.length) {
        const lineStartScan = posScan;
        const nextNLScan = text.indexOf("\n", posScan);
        const lineEndScan = nextNLScan === -1 ? text.length : nextNLScan;
        let iScan = lineStartScan;
        while (iScan < lineEndScan && /\s/.test(text[iScan])) iScan++;
        let hScan = 0;
        while (iScan < lineEndScan && text[iScan] === "#" && hScan < 6) {
          hScan++;
          iScan++;
        }
        if (hScan > 0 && iScan < lineEndScan && text[iScan] === " ") {
          headingRanges.push({ start: from + lineStartScan, end: from + lineEndScan });
        }
        if (nextNLScan === -1) break;
        posScan = nextNLScan + 1;
      }
      if (!hasHeadingBlacklist) {
        const we = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
        const headingEntry = we.find((e) => e && e.presetLabel === label);
        if (headingEntry) {
          let pos = 0;
          while (pos <= text.length) {
            const lineStart = pos;
            const nextNL = text.indexOf("\n", pos);
            const lineEnd = nextNL === -1 ? text.length : nextNL;
            let i = lineStart;
            while (i < lineEnd && /\s/.test(text[i])) i++;
            let hashes = 0;
            while (i < lineEnd && text[i] === "#" && hashes < 6) {
              hashes++;
              i++;
            }
            if (hashes > 0 && i < lineEnd && text[i] === " ") {
              while (i < lineEnd && text[i] === " ") i++;
              const start = from + i;
              const end = from + lineEnd;
              if (headingEntry.backgroundColor) {
                const tc = headingEntry.textColor || "currentColor";
                const bc = headingEntry.backgroundColor;
                matches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = headingEntry.color || headingEntry.textColor;
                if (c) matches.push({ start, end, color: c });
              }
            }
            if (nextNL === -1) break;
            pos = nextNL + 1;
          }
        }
      }
    } catch (e) {
    }
    try {
      const we = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
      const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const taskCheckedEntry = we.find((e) => e && e.presetLabel === "Task List (Checked)");
      const taskUncheckedEntry = we.find((e) => e && e.presetLabel === "Task List (Unchecked)");
      const numberedEntry = we.find((e) => e && e.presetLabel === "Numbered Lists");
      const bulletEntry = we.find((e) => e && e.presetLabel === "Bullet Points");
      const taskCheckedBlacklisted = !!blEntries.find((e) => e && e.presetLabel === "Task List (Checked)" && !!e.isRegex);
      const taskUncheckedBlacklisted = !!blEntries.find((e) => e && e.presetLabel === "Task List (Unchecked)" && !!e.isRegex);
      const numberedBlacklisted = !!blEntries.find((e) => e && e.presetLabel === "Numbered Lists" && !!e.isRegex);
      const bulletBlacklisted = !!blEntries.find((e) => e && e.presetLabel === "Bullet Points" && !!e.isRegex);
      const taskCheckedAllowed = !filePath || this.shouldColorText(filePath, taskCheckedEntry ? taskCheckedEntry.pattern : null);
      const taskUncheckedAllowed = !filePath || this.shouldColorText(filePath, taskUncheckedEntry ? taskUncheckedEntry.pattern : null);
      const numberedAllowed = !filePath || this.shouldColorText(filePath, numberedEntry ? numberedEntry.pattern : null);
      const bulletAllowed = !filePath || this.shouldColorText(filePath, bulletEntry ? bulletEntry.pattern : null);
      let pos = 0;
      while (pos <= text.length) {
        const lineStart = pos;
        const nextNL = text.indexOf("\n", pos);
        const lineEnd = nextNL === -1 ? text.length : nextNL;
        const line = text.substring(lineStart, lineEnd);
        let matched = false;
        if (!matched && !taskCheckedBlacklisted && taskCheckedEntry && taskCheckedAllowed) {
          const pattern = /^(\s*)([\-\*])(\s+)(\[[xX]\])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart = lineStart + mdMatch.index + (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length + mdMatch[4].length + mdMatch[5].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[6] || "";
            const lineBlacklisted = this.isLineBlacklistedByRegex(line);
            if (contentStart < contentEnd && !this.containsBlacklistedWord(contentText) && !lineBlacklisted) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (taskCheckedEntry.backgroundColor) {
                const tc = taskCheckedEntry.textColor || "currentColor";
                const bc = taskCheckedEntry.backgroundColor;
                matches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = taskCheckedEntry.color || taskCheckedEntry.textColor;
                if (c) matches.push({ start, end, color: c });
              }
              matched = true;
            }
          }
        }
        if (!matched && !taskUncheckedBlacklisted && taskUncheckedEntry && taskUncheckedAllowed) {
          const pattern = /^(\s*)([\-\*])(\s+)(\[\s\])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart = lineStart + mdMatch.index + (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length + mdMatch[4].length + mdMatch[5].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[6] || "";
            const lineBlacklisted = this.isLineBlacklistedByRegex(line);
            if (contentStart < contentEnd && !this.containsBlacklistedWord(contentText) && !lineBlacklisted) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (taskUncheckedEntry.backgroundColor) {
                const tc = taskUncheckedEntry.textColor || "currentColor";
                const bc = taskUncheckedEntry.backgroundColor;
                matches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = taskUncheckedEntry.color || taskUncheckedEntry.textColor;
                if (c) matches.push({ start, end, color: c });
              }
              matched = true;
            }
          }
        }
        if (!matched && !numberedBlacklisted && numberedEntry && numberedAllowed) {
          const pattern = /^(\s*)(\d+\.)(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart = lineStart + mdMatch.index + (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[4] || "";
            const lineBlacklisted = this.isLineBlacklistedByRegex(line);
            if (contentStart < contentEnd && !this.containsBlacklistedWord(contentText) && !lineBlacklisted) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (numberedEntry.backgroundColor) {
                const tc = numberedEntry.textColor || "currentColor";
                const bc = numberedEntry.backgroundColor;
                matches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = numberedEntry.color || numberedEntry.textColor;
                if (c) matches.push({ start, end, color: c });
              }
              matched = true;
            }
          }
        }
        if (!matched && !bulletBlacklisted && bulletEntry && bulletAllowed) {
          const pattern = /^(\s*)([\-\*])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart = lineStart + mdMatch.index + (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[4] || "";
            const lineBlacklisted = this.isLineBlacklistedByRegex(line);
            if (contentStart < contentEnd && !this.containsBlacklistedWord(contentText) && !lineBlacklisted) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (bulletEntry.backgroundColor) {
                const tc = bulletEntry.textColor || "currentColor";
                const bc = bulletEntry.backgroundColor;
                matches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = bulletEntry.color || bulletEntry.textColor;
                if (c) matches.push({ start, end, color: c });
              }
              matched = true;
            }
          }
        }
        if (nextNL === -1) break;
        pos = nextNL + 1;
      }
    } catch (e) {
    }
    const blacklistedListRanges = this.getBlacklistedListItemRanges(text, from);
    const textBgEntries = Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : [];
    for (const entry of textBgEntries) {
      if (!entry || entry.invalid) continue;
      try {
        if (entry.fastTest && typeof entry.fastTest === "function" && !entry.fastTest(text)) continue;
      } catch (e) {
      }
      const regex = entry.regex;
      if (!regex) continue;
      const _matches = this.safeMatchLoop(regex, text);
      for (const match of _matches) {
        const matchedText = match[0];
        const matchStart = match.index;
        const matchEnd = match.index + matchedText.length;
        if (!this.settings.partialMatch && !this.isSentenceLikePattern(entry.pattern) && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
          continue;
        }
        if (this.isContextBlacklisted(text, matchStart, matchEnd)) continue;
        const absStart = from + matchStart;
        const absEnd = from + matchEnd;
        if (this.isMatchInBlacklistedRange(absStart, absEnd, blacklistedListRanges)) continue;
        if (hasHeadingBlacklist && headingRanges && headingRanges.length > 0) {
          let inHeading = false;
          for (const hr of headingRanges) {
            if (absStart < hr.end && absEnd > hr.start) {
              inHeading = true;
              break;
            }
          }
          if (inHeading) continue;
        }
        const fullWordStart = this.extractFullWord(text, matchStart, matchEnd);
        let colorStart = matchStart;
        let colorEnd = matchEnd;
        if (this.settings.partialMatch && !this.isSentenceLikePattern(entry.pattern)) {
          colorStart = matchStart;
          colorEnd = matchEnd;
          while (colorStart > 0 && (/[A-Za-z0-9]/.test(text[colorStart - 1]) || text[colorStart - 1] === "-" || text[colorStart - 1] === "'")) {
            colorStart--;
          }
          while (colorEnd < text.length && (/[A-Za-z0-9]/.test(text[colorEnd]) || text[colorEnd] === "-" || text[colorEnd] === "'")) {
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
        if (matches.length > 3e3) break;
      }
      if (matches.length > 3e3) break;
    }
    for (const entry of entries_copy) {
      if (!entry || entry.invalid) continue;
      try {
        if (entry.fastTest && typeof entry.fastTest === "function") {
          const fastTestResult = entry.fastTest(text);
          if (entry.pattern && entry.pattern.includes("am") || entry.presetLabel && entry.presetLabel.includes("Times")) {
            debugLog("FASTTEST_CHECK", `Pattern: ${entry.presetLabel || entry.pattern.substring(0, 40)}, fastTest result=${fastTestResult}, text length=${text.length}, text="${text.substring(0, 50)}"`);
          }
          if (!fastTestResult) continue;
        }
      } catch (e) {
      }
      const regex = entry.regex;
      if (!regex) continue;
      if (entry.pattern && entry.pattern.includes("am") || entry.presetLabel && entry.presetLabel.includes("Times")) {
        debugLog("REGEX_ENTRY", `Processing ${entry.presetLabel || entry.pattern}, fastTest=${entry.fastTest ? "yes" : "no"}`);
      }
      let iterCount = 0;
      const _matches2 = this.safeMatchLoop(regex, text);
      if (entry.pattern && entry.pattern.includes("am") || entry.presetLabel && entry.presetLabel.includes("Times")) {
        debugLog("REGEX_FOUND", `${entry.presetLabel || entry.pattern}: found ${_matches2.length} matches`);
      }
      for (const match of _matches2) {
        iterCount++;
        const matchedText = match[0];
        const matchStart = from + match.index;
        const matchEnd = from + match.index + matchedText.length;
        if (this.isMatchInBlacklistedRange(matchStart, matchEnd, blacklistedListRanges)) {
          try {
            if (typeof regex.lastIndex === "number" && regex.lastIndex === match.index) regex.lastIndex++;
          } catch (e) {
          }
          continue;
        }
        const overlappingTextBgIndices = [];
        for (let i = 0; i < matches.length; i++) {
          const tbMatch = matches[i];
          if (!tbMatch || !tbMatch.isTextBg) continue;
          if (matchStart < tbMatch.end && matchEnd > tbMatch.start) {
            overlappingTextBgIndices.push(i);
          }
        }
        if (overlappingTextBgIndices.length > 0) {
          const mLength = matchEnd - matchStart;
          const isPresetPattern = entry.presetLabel && (entry.presetLabel.includes("Times") || entry.presetLabel.includes("username"));
          if (!isPresetPattern) {
            const allShorter = overlappingTextBgIndices.every((i) => matches[i].end - matches[i].start < mLength);
            if (entry.presetLabel && entry.presetLabel.includes("Times")) {
              debugLog("OVERLAP_CHECK", `Time match '${matchedText}' length=${mLength}, overlaps=${overlappingTextBgIndices.length}, allShorter=${allShorter}, isPreset=${isPresetPattern}`);
            }
            if (!allShorter) {
              try {
                if (typeof regex.lastIndex === "number" && regex.lastIndex === match.index) regex.lastIndex++;
              } catch (e) {
              }
              continue;
            }
          } else {
            if (entry.presetLabel && entry.presetLabel.includes("Times")) {
              debugLog("OVERLAP_CHECK", `Time match '${matchedText}' length=${mLength}, overlaps=${overlappingTextBgIndices.length}, isPreset=${isPresetPattern} - REMOVING overlaps`);
            }
          }
          for (let i = overlappingTextBgIndices.length - 1; i >= 0; i--) {
            matches.splice(overlappingTextBgIndices[i], 1);
          }
        }
        if (hasHeadingBlacklist && headingRanges && headingRanges.length > 0) {
          let inHeading = false;
          for (const hr of headingRanges) {
            if (matchStart < hr.end && matchEnd > hr.start) {
              inHeading = true;
              break;
            }
          }
          if (inHeading) continue;
        }
        if (!this.isSentenceLikePattern(entry.pattern) && !this.isWholeWordMatch(text, match.index, match.index + matchedText.length)) {
          continue;
        }
        if (this.isContextBlacklisted(text, match.index, match.index + matchedText.length)) continue;
        matches.push({
          start: from + match.index,
          end: from + match.index + matchedText.length,
          color: entry.color,
          styleType: entry.styleType,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor
        });
        if (matches.length > 3e3) break;
      }
      if (iterCount > 0) {
        try {
          entry.execs = (entry.execs || 0) + iterCount;
        } catch (e) {
        }
        try {
          this._perfCounters.totalRegexExecs = (this._perfCounters.totalRegexExecs || 0) + iterCount;
        } catch (e) {
        }
      }
      if (matches.length > 3e3) break;
    }
    if (this.settings.partialMatch && matches.length < 3e3) {
      const textOnlyEntries = entries_copy.filter((e) => e && !e.invalid && (!e.styleType || e.styleType === "text") && !e.isTextBg);
      if (textOnlyEntries.length > 0) {
        const wordRegex = /\S+/g;
        let match;
        while (match = wordRegex.exec(text)) {
          const w = match[0];
          const wStart = match.index;
          const wEnd = wStart + w.length;
          if (this.isWordBlacklisted(w)) continue;
          const absWStart = from + wStart;
          const absWEnd = from + wEnd;
          if (this.isMatchInBlacklistedRange(absWStart, absWEnd, blacklistedListRanges)) continue;
          if (hasHeadingBlacklist && headingRanges && headingRanges.length > 0) {
            let inHeading = false;
            for (const hr of headingRanges) {
              if (absWStart < hr.end && absWEnd > hr.start) {
                inHeading = true;
                break;
              }
            }
            if (inHeading) continue;
          }
          for (const entry of textOnlyEntries) {
            if (!entry || entry.invalid) continue;
            if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
            if (this.isWordBlacklisted(entry.pattern)) continue;
            const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), "i"));
            if (testRe.test(w)) {
              let expandedWStart = wStart;
              let expandedWEnd = wEnd;
              if (!this.isSentenceLikePattern(entry.pattern)) {
                while (expandedWStart > 0 && (/[A-Za-z0-9]/.test(text[expandedWStart - 1]) || text[expandedWStart - 1] === "-" || text[expandedWStart - 1] === "'")) {
                  expandedWStart--;
                }
                while (expandedWEnd < text.length && (/[A-Za-z0-9]/.test(text[expandedWEnd]) || text[expandedWEnd] === "-" || text[expandedWEnd] === "'")) {
                  expandedWEnd++;
                }
              }
              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                const existStart = existingMatch.start - from;
                const existEnd = existingMatch.end - from;
                if (expandedWStart < existEnd && expandedWEnd > existStart) {
                  overlapsWithExisting = true;
                  break;
                }
              }
              if (!overlapsWithExisting) {
                const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
                matches.push({ start: from + expandedWStart, end: from + expandedWEnd, color: useColor, styleType: "text" });
                if (matches.length > 3e3) break;
              } else {
                matches = matches.filter((m) => !(m.start >= from + expandedWStart && m.end <= from + expandedWEnd && m.end - m.start < expandedWEnd - expandedWStart));
                const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
                matches.push({ start: from + expandedWStart, end: from + expandedWEnd, color: useColor, styleType: "text" });
                if (matches.length > 3e3) break;
              }
              break;
            }
          }
          if (matches.length > 3e3) break;
          try {
            if (typeof wordRegex.lastIndex === "number" && wordRegex.lastIndex === match.index) wordRegex.lastIndex++;
          } catch (e) {
          }
        }
      }
    }
    if (folderEntry && folderEntry.defaultColor) {
      matches = matches.map((m) => m.isTextBg ? m : Object.assign({}, m, { color: folderEntry.defaultColor }));
    }
    if (matches.some((m) => m.isTextBg)) {
      const fullTextBg = matches.filter((m) => m.isTextBg && m.textColor && m.textColor !== "currentColor");
      if (fullTextBg.length > 0) {
        matches = matches.filter((m) => {
          if (!(m.isTextBg && (!m.textColor || m.textColor === "currentColor"))) return true;
          return !fullTextBg.some((f) => m.start < f.end && m.end > f.start);
        });
      }
    }
    if (matches.length > 1) {
      const all = matches.slice().sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start;
        const lenA = a.end - a.start;
        const lenB = b.end - b.start;
        if (lenA !== lenB) return lenB - lenA;
        if (a.isTextBg && !b.isTextBg) return -1;
        if (!a.isTextBg && b.isTextBg) return 1;
        return 0;
      });
      const selected = [];
      for (const m of all) {
        let overlaps = false;
        const overlappingIndices = [];
        for (let i = 0; i < selected.length; i++) {
          const s = selected[i];
          if (m.start < s.end && m.end > s.start) {
            overlaps = true;
            overlappingIndices.push(i);
          }
        }
        if (!overlaps) {
          selected.push(m);
        } else {
          const mLength = m.end - m.start;
          const allShorter = overlappingIndices.every((i) => {
            const s = selected[i];
            return s.end - s.start < mLength;
          });
          if (allShorter) {
            for (let i = overlappingIndices.length - 1; i >= 0; i--) {
              selected.splice(overlappingIndices[i], 1);
            }
            selected.push(m);
          }
        }
      }
      matches = selected;
    }
    matches = matches.slice(0, 3e3);
    matches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return a.end - b.end;
    });
    try {
      const viewportText = text.substring(0, 100);
      if (viewportText.includes(":")) {
        const timeMatches = matches.filter((m) => {
          const matchText = text.substring(m.start - from, m.end - from);
          return matchText && (matchText.includes("pm") || matchText.includes("am"));
        });
        if (timeMatches.length > 0) {
          debugLog("MATCHES_TIME", `Found ${timeMatches.length} time matches in ${matches.length} total matches`);
        }
      }
      if (viewportText.includes("@")) {
        const userMatches = matches.filter((m) => {
          const matchText = text.substring(m.start - from, m.end - from);
          return matchText && matchText.startsWith("@");
        });
        if (userMatches.length > 0) {
          debugLog("MATCHES_USER", `Found ${userMatches.length} username matches in ${matches.length} total matches`);
        }
      }
    } catch (_) {
    }
    const effectiveStyle = "text";
    if (effectiveStyle === "none" && matches.length > 0 && !matches.some((m) => m.isTextBg)) return builder.finish();
    let toApply = matches;
    if (matches.length > 1 && effectiveStyle !== "text") {
      const merged = [];
      for (const m of matches) {
        const last = merged[merged.length - 1];
        if (last && (m.isTextBg && last.isTextBg && m.textColor === last.textColor && m.backgroundColor === last.backgroundColor && m.start <= last.end || !m.isTextBg && !last.isTextBg && effectiveStyle === "background" && m.color === last.color && m.start <= last.end)) {
          if (m.end > last.end) last.end = m.end;
        } else {
          merged.push(Object.assign({}, m));
        }
      }
      toApply = merged;
    }
    for (const m of toApply) {
      let style;
      if (m.isTextBg) {
        const hideText = this.settings.hideTextColors === true;
        const hideBg = this.settings.hideHighlights === true;
        if (hideText && hideBg) continue;
        const borderStyle = this.generateBorderStyle(hideText ? null : m.textColor, hideBg ? null : m.backgroundColor);
        const textPart = hideText ? "" : `color: ${m.textColor} !important; --highlight-color: ${m.textColor}; `;
        const bgPart = hideBg ? "" : `background-color: ${this.hexToRgba(m.backgroundColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
        style = `${textPart}${bgPart}${borderStyle}`;
      } else {
        const styleType2 = m.styleType || "text";
        if (styleType2 === "text") {
          if (this.settings.hideTextColors) continue;
          style = `color: ${m.color} !important; --highlight-color: ${m.color};`;
        } else if (styleType2 === "highlight") {
          if (this.settings.hideHighlights) continue;
          const bgColor = m.backgroundColor || m.color;
          const borderStyle = this.generateBorderStyle(null, bgColor);
          style = `background: none !important; background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0 ? 0 : this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
        } else if (styleType2 === "both") {
          const textColor = m.textColor && m.textColor !== "currentColor" ? m.textColor : m.color || null;
          const bgColor = m.backgroundColor || m.color;
          const hideText = this.settings.hideTextColors === true;
          const hideBg = this.settings.hideHighlights === true;
          if (hideText && hideBg) continue;
          const borderStyle = this.generateBorderStyle(hideText ? null : textColor, hideBg ? null : bgColor);
          const textPart = hideText ? "" : textColor ? `color: ${textColor} !important; --highlight-color: ${textColor}; ` : "";
          const bgPart = hideBg ? "" : `background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
          style = `${textPart}${bgPart}${borderStyle}`;
        } else {
          if (this.settings.hideTextColors) continue;
          style = `color: ${m.color} !important; --highlight-color: ${m.color};`;
        }
      }
      const deco = Decoration.mark({ attributes: { style, class: "always-color-text-highlight" } });
      builder.add(m.start, m.end, deco);
      try {
        if (m.start >= 0 && m.end > m.start) {
          const matchText = "";
          if (matchText.includes("@") || matchText.includes(":")) {
            debugLog("DECO_APPLY", `Applied deco at ${m.start}-${m.end}, style=${styleType}`);
          }
        }
      } catch (_) {
      }
    }
    return builder.finish();
  }
  // NEW METHOD: Chunked editor processing for large pattern sets or large text
  buildDecoChunked(view, builder, from, to, text, entries, folderEntry, filePath = null) {
    const CHUNK_SIZE = EDITOR_PERFORMANCE_CONSTANTS.PATTERN_CHUNK_SIZE;
    const TEXT_CHUNK_SIZE = EDITOR_PERFORMANCE_CONSTANTS.TEXT_CHUNK_SIZE;
    const MAX_MATCHES = EDITOR_PERFORMANCE_CONSTANTS.MAX_TOTAL_MATCHES;
    let allMatches = [];
    try {
      const we = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
      const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const codeblockEntry = we.find((e) => e && e.presetLabel === "Codeblocks");
      const hasCodeblockBlacklist = !!blEntries.find((e) => e && e.presetLabel === "Codeblocks" && !!e.isRegex);
      if (hasCodeblockBlacklist) {
        for (const cbMatch of text.matchAll(/```[\s\S]*?```/g)) {
          const start = from + cbMatch.index;
          const end = from + cbMatch.index + cbMatch[0].length;
          allMatches.push({ start, end, skip: true });
        }
      } else if (codeblockEntry) {
        for (const cbMatch of text.matchAll(/```[\s\S]*?```/g)) {
          const start = from + cbMatch.index;
          const end = from + cbMatch.index + cbMatch[0].length;
          if (codeblockEntry.backgroundColor) {
            const tc = codeblockEntry.textColor || "currentColor";
            const bc = codeblockEntry.backgroundColor;
            allMatches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
          } else {
            const c = codeblockEntry.color || codeblockEntry.textColor;
            if (c) allMatches.push({ start, end, color: c });
          }
        }
      }
    } catch (e) {
    }
    let headingRanges = [];
    let hasHeadingBlacklist = false;
    try {
      const label = "All Headings (H1-H6)";
      const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      hasHeadingBlacklist = !!blEntries.find((e) => e && e.presetLabel === label && !!e.isRegex);
      headingRanges = [];
      let posScan = 0;
      while (posScan <= text.length) {
        const lineStartScan = posScan;
        const nextNLScan = text.indexOf("\n", posScan);
        const lineEndScan = nextNLScan === -1 ? text.length : nextNLScan;
        let iScan = lineStartScan;
        while (iScan < lineEndScan && /\s/.test(text[iScan])) iScan++;
        let hScan = 0;
        while (iScan < lineEndScan && text[iScan] === "#" && hScan < 6) {
          hScan++;
          iScan++;
        }
        if (hScan > 0 && iScan < lineEndScan && text[iScan] === " ") {
          headingRanges.push({ start: from + lineStartScan, end: from + lineEndScan });
        }
        if (nextNLScan === -1) break;
        posScan = nextNLScan + 1;
      }
      if (!hasHeadingBlacklist) {
        const we = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
        const headingEntry = we.find((e) => e && e.presetLabel === label);
        if (headingEntry) {
          let pos = 0;
          while (pos <= text.length) {
            const lineStart = pos;
            const nextNL = text.indexOf("\n", pos);
            const lineEnd = nextNL === -1 ? text.length : nextNL;
            let i = lineStart;
            while (i < lineEnd && /\s/.test(text[i])) i++;
            let hashes = 0;
            while (i < lineEnd && text[i] === "#" && hashes < 6) {
              hashes++;
              i++;
            }
            if (hashes > 0 && i < lineEnd && text[i] === " ") {
              const start = from + lineStart;
              const end = from + lineEnd;
              if (headingEntry.backgroundColor) {
                const tc = headingEntry.textColor || "currentColor";
                const bc = headingEntry.backgroundColor;
                allMatches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = headingEntry.color || headingEntry.textColor;
                if (c) allMatches.push({ start, end, color: c });
              }
            }
            if (nextNL === -1) break;
            pos = nextNL + 1;
          }
        }
      }
    } catch (e) {
    }
    try {
      const we = Array.isArray(this.settings.wordEntries) ? this.settings.wordEntries : [];
      const blEntries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const taskCheckedEntry = we.find((e) => e && e.presetLabel === "Task List (Checked)");
      const taskUncheckedEntry = we.find((e) => e && e.presetLabel === "Task List (Unchecked)");
      const numberedEntry = we.find((e) => e && e.presetLabel === "Numbered Lists");
      const bulletEntry = we.find((e) => e && e.presetLabel === "Bullet Points");
      const taskCheckedBlacklisted = !!blEntries.find((e) => e && e.presetLabel === "Task List (Checked)" && !!e.isRegex);
      const taskUncheckedBlacklisted = !!blEntries.find((e) => e && e.presetLabel === "Task List (Unchecked)" && !!e.isRegex);
      const numberedBlacklisted = !!blEntries.find((e) => e && e.presetLabel === "Numbered Lists" && !!e.isRegex);
      const bulletBlacklisted = !!blEntries.find((e) => e && e.presetLabel === "Bullet Points" && !!e.isRegex);
      const taskCheckedAllowed = !filePath || this.shouldColorText(filePath, taskCheckedEntry ? taskCheckedEntry.pattern : null);
      const taskUncheckedAllowed = !filePath || this.shouldColorText(filePath, taskUncheckedEntry ? taskUncheckedEntry.pattern : null);
      const numberedAllowed = !filePath || this.shouldColorText(filePath, numberedEntry ? numberedEntry.pattern : null);
      const bulletAllowed = !filePath || this.shouldColorText(filePath, bulletEntry ? bulletEntry.pattern : null);
      let pos = 0;
      while (pos <= text.length) {
        const lineStart = pos;
        const nextNL = text.indexOf("\n", pos);
        const lineEnd = nextNL === -1 ? text.length : nextNL;
        const line = text.substring(lineStart, lineEnd);
        let matched = false;
        if (!matched && !taskCheckedBlacklisted && taskCheckedEntry && taskCheckedAllowed) {
          const pattern = /^(\s*)([\-\*])(\s+)(\[[xX]\])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart = lineStart + mdMatch.index + (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length + mdMatch[4].length + mdMatch[5].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[6] || "";
            const lineBlacklisted = this.isLineBlacklistedByRegex(line);
            if (contentStart < contentEnd && !this.containsBlacklistedWord(contentText) && !lineBlacklisted) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (taskCheckedEntry.backgroundColor) {
                const tc = taskCheckedEntry.textColor || "currentColor";
                const bc = taskCheckedEntry.backgroundColor;
                allMatches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = taskCheckedEntry.color || taskCheckedEntry.textColor;
                if (c) allMatches.push({ start, end, color: c });
              }
              matched = true;
            }
          }
        }
        if (!matched && !taskUncheckedBlacklisted && taskUncheckedEntry) {
          const pattern = /^(\s*)([\-\*])(\s+)(\[\s\])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart = lineStart + mdMatch.index + (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length + mdMatch[4].length + mdMatch[5].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[6] || "";
            const lineBlacklisted = this.isLineBlacklistedByRegex(line);
            if (contentStart < contentEnd && !this.containsBlacklistedWord(contentText) && !lineBlacklisted) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (taskUncheckedEntry.backgroundColor) {
                const tc = taskUncheckedEntry.textColor || "currentColor";
                const bc = taskUncheckedEntry.backgroundColor;
                allMatches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = taskUncheckedEntry.color || taskUncheckedEntry.textColor;
                if (c) allMatches.push({ start, end, color: c });
              }
              matched = true;
            }
          }
        }
        if (!matched && !numberedBlacklisted && numberedEntry && numberedAllowed) {
          const pattern = /^(\s*)(\d+\.)(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart = lineStart + mdMatch.index + (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[4] || "";
            const lineBlacklisted = this.isLineBlacklistedByRegex(line);
            if (contentStart < contentEnd && !this.containsBlacklistedWord(contentText) && !lineBlacklisted) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (numberedEntry.backgroundColor) {
                const tc = numberedEntry.textColor || "currentColor";
                const bc = numberedEntry.backgroundColor;
                allMatches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = numberedEntry.color || numberedEntry.textColor;
                if (c) allMatches.push({ start, end, color: c });
              }
              matched = true;
            }
          }
        }
        if (!matched && !bulletBlacklisted && bulletEntry && bulletAllowed) {
          const pattern = /^(\s*)([\-\*])(\s+)(.*)$/;
          const mdMatch = pattern.exec(line);
          if (mdMatch) {
            const contentStart = lineStart + mdMatch.index + (mdMatch[1].length + mdMatch[2].length + mdMatch[3].length);
            const contentEnd = lineEnd;
            const contentText = mdMatch[4] || "";
            const lineBlacklisted = this.isLineBlacklistedByRegex(line);
            if (contentStart < contentEnd && !this.containsBlacklistedWord(contentText) && !lineBlacklisted) {
              const start = from + contentStart;
              const end = from + contentEnd;
              if (bulletEntry.backgroundColor) {
                const tc = bulletEntry.textColor || "currentColor";
                const bc = bulletEntry.backgroundColor;
                allMatches.push({ start, end, textColor: tc, backgroundColor: bc, isTextBg: true });
              } else {
                const c = bulletEntry.color || bulletEntry.textColor;
                if (c) allMatches.push({ start, end, color: c });
              }
              matched = true;
            }
          }
        }
        if (nextNL === -1) break;
        pos = nextNL + 1;
      }
    } catch (e) {
    }
    const blacklistedListRanges = this.getBlacklistedListItemRanges(text, from);
    const textBgEntries = Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : [];
    if (textBgEntries.length > 0) {
      for (const entry of textBgEntries) {
        if (!entry || entry.invalid) continue;
        if (entry.fastTest && !entry.fastTest(text)) continue;
        const regex = entry.regex;
        if (!regex) continue;
        let match;
        try {
          regex.lastIndex = 0;
        } catch (e) {
        }
        while (match = regex.exec(text)) {
          const matchStart = match.index;
          const matchEnd = match.index + match[0].length;
          if (!this.settings.partialMatch && !this.isSentenceLikePattern(entry.pattern) && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
            try {
              if (typeof regex.lastIndex === "number" && regex.lastIndex === match.index) regex.lastIndex++;
            } catch (e) {
            }
            continue;
          }
          if (this.isContextBlacklisted(text, matchStart, matchEnd)) continue;
          const absStart = from + matchStart;
          const absEnd = from + matchEnd;
          if (this.isMatchInBlacklistedRange(absStart, absEnd, blacklistedListRanges)) {
            try {
              if (typeof regex.lastIndex === "number" && regex.lastIndex === match.index) regex.lastIndex++;
            } catch (e) {
            }
            continue;
          }
          if (hasHeadingBlacklist && headingRanges && headingRanges.length > 0) {
            let inHeading = false;
            for (const hr of headingRanges) {
              if (absStart < hr.end && absEnd > hr.start) {
                inHeading = true;
                break;
              }
            }
            if (inHeading) continue;
          }
          let colorStart = matchStart;
          let colorEnd = matchEnd;
          if (this.settings.partialMatch && !this.isSentenceLikePattern(entry.pattern)) {
            colorStart = matchStart;
            colorEnd = matchEnd;
            while (colorStart > 0 && (/[A-Za-z0-9]/.test(text[colorStart - 1]) || text[colorStart - 1] === "-" || text[colorStart - 1] === "'")) {
              colorStart--;
            }
            while (colorEnd < text.length && (/[A-Za-z0-9]/.test(text[colorEnd]) || text[colorEnd] === "-" || text[colorEnd] === "'")) {
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
    if (entries.length > CHUNK_SIZE) {
      debugLog("EDITOR", `Processing ${entries.length} patterns in chunks (chunk size: ${CHUNK_SIZE})`);
      for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
        const chunk = entries.slice(i, i + CHUNK_SIZE);
        const chunkMatches = this.processPatternChunk(text, from, chunk, folderEntry, allMatches, hasHeadingBlacklist ? headingRanges : [], blacklistedListRanges);
        allMatches = allMatches.concat(chunkMatches);
        const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
        const totalChunks = Math.ceil(entries.length / CHUNK_SIZE);
        debugLog("EDITOR", `Chunk ${chunkNum}/${totalChunks}: ${chunkMatches.length} matches`);
        if (allMatches.length > MAX_MATCHES) {
          debugLog("EDITOR", `Reached match limit (${allMatches.length}), stopping early`);
          break;
        }
      }
    } else if (text.length > TEXT_CHUNK_SIZE) {
      debugLog("EDITOR", `Processing long text (${text.length} chars) in chunks (chunk size: ${TEXT_CHUNK_SIZE})`);
      let chunkNum = 0;
      const totalChunks = Math.ceil(text.length / TEXT_CHUNK_SIZE);
      for (let pos = 0; pos < text.length; pos += TEXT_CHUNK_SIZE) {
        chunkNum++;
        const chunkEnd = Math.min(pos + TEXT_CHUNK_SIZE, text.length);
        const chunkText = text.slice(pos, chunkEnd);
        const chunkFrom = from + pos;
        const chunkMatches = this.processTextChunk(chunkText, chunkFrom, entries, folderEntry, allMatches, hasHeadingBlacklist ? headingRanges : []);
        allMatches = allMatches.concat(chunkMatches);
        debugLog("EDITOR", `Text chunk ${chunkNum}/${totalChunks}: ${chunkMatches.length} matches`);
        if (allMatches.length > MAX_MATCHES) {
          debugLog("EDITOR", `Reached match limit (${allMatches.length}), stopping early`);
          break;
        }
      }
    }
    debugLog("EDITOR", `Processing complete: ${allMatches.length} total matches`);
    return this.applyDecorationsFromMatches(builder, allMatches, folderEntry);
  }
  // NEW METHOD: Process a chunk of patterns
  processPatternChunk(text, baseFrom, patternChunk, folderEntry, existingMatches = [], headingRanges = [], blacklistedListRanges = []) {
    const MAX_MATCHES_PER_PATTERN = EDITOR_PERFORMANCE_CONSTANTS.MAX_MATCHES_PER_PATTERN;
    const matches = [];
    for (const entry of patternChunk) {
      if (!entry || entry.invalid) continue;
      if (entry.fastTest && !entry.fastTest(text)) continue;
      const regex = entry.regex;
      if (!regex) continue;
      let match;
      let matchCount = 0;
      try {
        regex.lastIndex = 0;
      } catch (e) {
      }
      while ((match = regex.exec(text)) && matchCount < MAX_MATCHES_PER_PATTERN) {
        const matchedText = match[0];
        const matchStart = baseFrom + match.index;
        const matchEnd = baseFrom + match.index + matchedText.length;
        if (this.isMatchInBlacklistedRange(matchStart, matchEnd, blacklistedListRanges)) {
          continue;
        }
        const overlappingTextBgIndices = [];
        for (let i = 0; i < existingMatches.length; i++) {
          const existing = existingMatches[i];
          if (!existing || !existing.isTextBg) continue;
          if (matchStart < existing.end && matchEnd > existing.start) {
            overlappingTextBgIndices.push(i);
          }
        }
        if (overlappingTextBgIndices.length > 0) {
          const mLength = matchEnd - matchStart;
          const allShorter = overlappingTextBgIndices.every((i) => existingMatches[i].end - existingMatches[i].start < mLength);
          if (!allShorter) {
            continue;
          }
          for (let i = overlappingTextBgIndices.length - 1; i >= 0; i--) {
            existingMatches.splice(overlappingTextBgIndices[i], 1);
          }
        }
        if (headingRanges && headingRanges.length > 0) {
          let inHeading = false;
          for (const hr of headingRanges) {
            if (matchStart < hr.end && matchEnd > hr.start) {
              inHeading = true;
              break;
            }
          }
          if (inHeading) continue;
        }
        if (!this.isWholeWordMatch(text, match.index, match.index + matchedText.length)) {
          continue;
        }
        if (this.isContextBlacklisted(text, match.index, match.index + matchedText.length)) continue;
        matches.push({
          start: matchStart,
          end: matchEnd,
          color: folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color,
          styleType: entry.styleType,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor
        });
        matchCount++;
        if (matches.length > 200) break;
      }
      if (matches.length > 200) break;
    }
    if (this.settings.partialMatch && matches.length < 200) {
      const wordRegex = /\S+/g;
      let match;
      while (match = wordRegex.exec(text)) {
        const w = match[0];
        const wStart = match.index;
        const wEnd = wStart + w.length;
        if (this.isWordBlacklisted(w)) continue;
        if (this.isMatchInBlacklistedRange(baseFrom + wStart, baseFrom + wEnd, blacklistedListRanges)) continue;
        for (const entry of patternChunk) {
          if (!entry || entry.invalid) continue;
          if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
          if (this.isWordBlacklisted(entry.pattern)) continue;
          const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), "i"));
          if (testRe.test(w)) {
            let expandedWStart = wStart;
            let expandedWEnd = wEnd;
            const entryStyleType = entry && entry.styleType ? entry.styleType : "text";
            if (entryStyleType === "text" && !this.isSentenceLikePattern(entry.pattern)) {
              while (expandedWStart > 0 && (/[A-Za-z0-9]/.test(text[expandedWStart - 1]) || text[expandedWStart - 1] === "-" || text[expandedWStart - 1] === "'")) {
                expandedWStart--;
              }
              while (expandedWEnd < text.length && (/[A-Za-z0-9]/.test(text[expandedWEnd]) || text[expandedWEnd] === "-" || text[expandedWEnd] === "'")) {
                expandedWEnd++;
              }
            }
            let overlapsWithExisting = false;
            for (const existingMatch of matches) {
              if (baseFrom + expandedWStart < existingMatch.end && baseFrom + expandedWEnd > existingMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            for (const textBgMatch of existingMatches) {
              if (textBgMatch.isTextBg && baseFrom + expandedWStart < textBgMatch.end && baseFrom + expandedWEnd > textBgMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            if (!overlapsWithExisting) {
              matches.push({
                start: baseFrom + expandedWStart,
                end: baseFrom + expandedWEnd,
                color: folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color,
                styleType: entry.styleType,
                textColor: entry.textColor,
                backgroundColor: entry.backgroundColor
              });
              if (matches.length > 200) break;
            }
            break;
          }
        }
        if (matches.length > 200) break;
        try {
          if (typeof wordRegex.lastIndex === "number" && wordRegex.lastIndex === match.index) wordRegex.lastIndex++;
        } catch (e) {
        }
      }
    }
    return matches;
  }
  // NEW METHOD: Process a chunk of text
  processTextChunk(chunkText, chunkFrom, entries, folderEntry, existingMatches = [], headingRanges = []) {
    const matches = [];
    for (const entry of entries) {
      if (!entry || entry.invalid) continue;
      if (entry.fastTest && !entry.fastTest(chunkText)) continue;
      const regex = entry.regex;
      if (!regex) continue;
      let match;
      let matchCount = 0;
      try {
        regex.lastIndex = 0;
      } catch (e) {
      }
      while ((match = regex.exec(chunkText)) && matchCount < 5) {
        const matchedText = match[0];
        const matchStart = chunkFrom + match.index;
        const matchEnd = chunkFrom + match.index + matchedText.length;
        const overlappingTextBgIndices2 = [];
        for (let i = 0; i < existingMatches.length; i++) {
          const existing = existingMatches[i];
          if (!existing || !existing.isTextBg) continue;
          if (matchStart < existing.end && matchEnd > existing.start) {
            overlappingTextBgIndices2.push(i);
          }
        }
        if (overlappingTextBgIndices2.length > 0) {
          const mLength2 = matchEnd - matchStart;
          const allShorter2 = overlappingTextBgIndices2.every((i) => existingMatches[i].end - existingMatches[i].start < mLength2);
          if (!allShorter2) {
            continue;
          }
          for (let i = overlappingTextBgIndices2.length - 1; i >= 0; i--) {
            existingMatches.splice(overlappingTextBgIndices2[i], 1);
          }
        }
        if (headingRanges && headingRanges.length > 0) {
          let inHeading = false;
          for (const hr of headingRanges) {
            if (matchStart < hr.end && matchEnd > hr.start) {
              inHeading = true;
              break;
            }
          }
          if (inHeading) continue;
        }
        if (!this.isSentenceLikePattern(entry.pattern) && !this.isWholeWordMatch(chunkText, match.index, match.index + matchedText.length)) {
          continue;
        }
        if (this.isContextBlacklisted(chunkText, match.index, match.index + matchedText.length)) continue;
        matches.push({
          start: matchStart,
          end: matchEnd,
          color: folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color,
          styleType: entry.styleType,
          textColor: entry.textColor,
          backgroundColor: entry.backgroundColor
        });
        matchCount++;
        if (matches.length > 100) break;
      }
      if (matches.length > 30) break;
    }
    if (this.settings.partialMatch && matches.length < 100) {
      const textOnlyEntries = entries.filter((e) => e && !e.invalid && (!e.styleType || e.styleType === "text") && !e.isTextBg);
      if (textOnlyEntries.length > 0) {
        const wordRegex = /\S+/g;
        let match;
        while (match = wordRegex.exec(chunkText)) {
          const w = match[0];
          const wStart = match.index;
          const wEnd = wStart + w.length;
          if (this.isWordBlacklisted(w)) continue;
          for (const entry of textOnlyEntries) {
            if (!entry || entry.invalid) continue;
            if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
            if (this.isWordBlacklisted(entry.pattern)) continue;
            const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), "i"));
            if (testRe.test(w)) {
              let expandedWStart = wStart;
              let expandedWEnd = wEnd;
              if (!this.isSentenceLikePattern(entry.pattern)) {
                while (expandedWStart > 0 && (/[A-Za-z0-9]/.test(chunkText[expandedWStart - 1]) || chunkText[expandedWStart - 1] === "-" || chunkText[expandedWStart - 1] === "'")) {
                  expandedWStart--;
                }
                while (expandedWEnd < chunkText.length && (/[A-Za-z0-9]/.test(chunkText[expandedWEnd]) || chunkText[expandedWEnd] === "-" || chunkText[expandedWEnd] === "'")) {
                  expandedWEnd++;
                }
              }
              let overlapsWithExisting = false;
              for (const existingMatch of matches) {
                if (chunkFrom + expandedWStart < existingMatch.end && chunkFrom + expandedWEnd > existingMatch.start) {
                  overlapsWithExisting = true;
                  break;
                }
              }
              for (const textBgMatch of existingMatches) {
                if (textBgMatch.isTextBg && chunkFrom + expandedWStart < textBgMatch.end && chunkFrom + expandedWEnd > textBgMatch.start) {
                  overlapsWithExisting = true;
                  break;
                }
              }
              if (!overlapsWithExisting) {
                const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
                matches.push({
                  start: chunkFrom + expandedWStart,
                  end: chunkFrom + expandedWEnd,
                  color: useColor,
                  styleType: "text"
                });
                if (matches.length > 100) break;
              } else {
                for (let i = matches.length - 1; i >= 0; i--) {
                  const m = matches[i];
                  if (m.start >= chunkFrom + expandedWStart && m.end <= chunkFrom + expandedWEnd && m.end - m.start < expandedWEnd - expandedWStart) {
                    matches.splice(i, 1);
                  }
                }
                const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
                matches.push({
                  start: chunkFrom + expandedWStart,
                  end: chunkFrom + expandedWEnd,
                  color: useColor,
                  styleType: "text"
                });
                if (matches.length > 100) break;
              }
              break;
            }
          }
          if (matches.length > 100) break;
          try {
            if (typeof wordRegex.lastIndex === "number" && wordRegex.lastIndex === match.index) wordRegex.lastIndex++;
          } catch (e) {
          }
        }
      }
    }
    return matches;
  }
  // NEW METHOD: Apply decorations from collected matches
  applyDecorationsFromMatches(builder, matches, folderEntry) {
    const all = matches.slice().sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return b.end - b.start - (a.end - a.start);
    });
    const selected = [];
    for (const m of all) {
      let overlaps = false;
      const overlappingIndices = [];
      for (let i = 0; i < selected.length; i++) {
        const s = selected[i];
        if (m.start < s.end && m.end > s.start) {
          overlaps = true;
          overlappingIndices.push(i);
        }
      }
      if (!overlaps) {
        selected.push(Object.assign({}, m));
      } else {
        const mLength = m.end - m.start;
        const allShorter = overlappingIndices.every((i) => {
          const s = selected[i];
          return s.end - s.start < mLength;
        });
        if (allShorter) {
          for (let i = overlappingIndices.length - 1; i >= 0; i--) {
            selected.splice(overlappingIndices[i], 1);
          }
          selected.push(Object.assign({}, m));
        }
      }
    }
    const sortedSel = selected.sort((a, b) => a.start - b.start || a.end - b.end).slice(0, 1e3);
    const limited = (() => {
      const merged = [];
      for (const m of sortedSel) {
        const last = merged[merged.length - 1];
        if (last && m.isTextBg && last.isTextBg && m.textColor === last.textColor && m.backgroundColor === last.backgroundColor && m.start <= last.end) {
          if (m.end > last.end) last.end = m.end;
        } else {
          merged.push(m);
        }
      }
      return merged;
    })();
    const effectiveStyle = "text";
    for (const m of limited) {
      let style;
      const hideText = this.settings.hideTextColors === true;
      const hideBg = this.settings.hideHighlights === true;
      if (m.isTextBg) {
        const textColor = m.textColor;
        const bgColor = m.backgroundColor;
        if (hideText && hideBg) continue;
        const borderStyle = this.generateBorderStyle(hideText ? null : textColor, hideBg ? null : bgColor);
        const textPart = hideText ? "" : `color: ${textColor} !important; `;
        const bgPart = hideBg ? "" : `background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
        style = `${textPart}${bgPart}${borderStyle}`;
      } else {
        if (effectiveStyle === "none") continue;
        const styleType2 = m.styleType || "text";
        if (styleType2 === "text") {
          if (hideText) continue;
          style = `color: ${m.color} !important;`;
        } else if (styleType2 === "highlight") {
          const bgColor = m.backgroundColor || m.color;
          if (hideBg) continue;
          const borderStyle = this.generateBorderStyle(null, bgColor);
          style = `background: none !important; background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0 ? 0 : this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
        } else if (styleType2 === "both") {
          const textColor = m.textColor && m.textColor !== "currentColor" ? m.textColor : m.color || null;
          const bgColor = m.backgroundColor || m.color;
          if (hideText && hideBg) continue;
          const borderStyle = this.generateBorderStyle(hideText ? null : textColor, hideBg ? null : bgColor);
          const textPart = hideText ? "" : textColor ? `color: ${textColor} !important; ` : "";
          const bgPart = hideBg ? "" : `background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
          style = `${textPart}${bgPart}${borderStyle}`;
        } else {
          if (hideText) continue;
          style = `color: ${m.color} !important;`;
        }
      }
      const deco = Decoration.mark({ attributes: { style, class: "always-color-text-highlight" } });
      builder.add(m.start, m.end, deco);
    }
    return builder.finish();
  }
  // --- Memory management helpers ---
  async cleanup() {
    try {
      try {
        this._cachedSortedEntries = null;
        this._cacheDirty = true;
      } catch (e) {
      }
      try {
        this._compiledWordEntries = [];
      } catch (e) {
      }
      try {
        if (this._refreshTimeout) {
          clearTimeout(this._refreshTimeout);
          this._refreshTimeout = null;
        }
      } catch (e) {
      }
      try {
        if (this._editorRefreshTimeout) {
          clearTimeout(this._editorRefreshTimeout);
          this._editorRefreshTimeout = null;
        }
      } catch (e) {
      }
      try {
        if (this.settings) {
          if (Array.isArray(this.settings.wordEntries)) this.settings.wordEntries.length = 0;
          if (Array.isArray(this.settings.blacklistWords)) this.settings.blacklistWords.length = 0;
          if (Array.isArray(this.settings.disabledFiles)) this.settings.disabledFiles.length = 0;
        }
      } catch (e) {
      }
      try {
        this.stopMemoryMonitor();
      } catch (e) {
      }
      try {
        if (this._viewportObservers && typeof this._viewportObservers.forEach === "function") {
          this._viewportObservers.forEach((obs, key) => {
            try {
              obs.disconnect();
            } catch (e) {
            }
          });
          try {
            this._viewportObservers.clear();
          } catch (e) {
          }
        }
      } catch (e) {
      }
      try {
        if (typeof global !== "undefined" && typeof global.gc === "function") global.gc();
      } catch (e) {
      }
    } catch (e) {
      debugError("CLEANUP", "cleanup error", e);
    }
  }
  // --- Helper: Remove highlights created by this plugin from a root element ---
  clearHighlightsInRoot(rootEl) {
    try {
      if (!rootEl || !rootEl.isConnected) return;
      const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
          return node.classList && node.classList.contains("always-color-text-highlight") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
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
        } catch (e) {
        }
      }
    } catch (e) {
      debugError("CLEAR", "clearHighlightsInRoot failed", e);
    }
  }
  startMemoryMonitor() {
  }
  stopMemoryMonitor() {
  }
};
var PresetModal = class extends Modal {
  constructor(app, plugin, onChoose) {
    super(app);
    this.plugin = plugin;
    this.onChoose = onChoose;
    this._listeners = [];
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass("act-preset-modal");
    try {
      this.modalEl.style.maxWidth = "1200px !important";
      this.modalEl.style.width = "1200px !important";
    } catch (e) {
    }
    contentEl.style.maxWidth = "1200px !important";
    const presets = [
      { label: this.plugin.t("preset_all_headings", "All Headings (H1-H6)"), pattern: "^\\s*#{1,6}\\s+.*$", flags: "m", examples: ["# Heading"] },
      { label: this.plugin.t("preset_bullet_points", "Bullet Points"), pattern: "^\\s*[\\-\\*]\\s+.*$", flags: "m", examples: ["- Bullet point"], group: "markdown" },
      { label: this.plugin.t("preset_numbered_lists", "Numbered Lists"), pattern: "^\\s*\\d+\\.\\s+.*$", flags: "m", examples: ["1. First item"], group: "markdown" },
      { label: this.plugin.t("preset_task_checked", "Task List (Checked)"), pattern: "^\\s*[\\-\\*]\\s+\\[[xX]\\]\\s+.*$", flags: "m", examples: ["- [x] Completed"], group: "markdown" },
      { label: this.plugin.t("preset_task_unchecked", "Task List (Unchecked)"), pattern: "^\\s*[\\-\\*]\\s+\\[\\s\\]\\s+.*$", flags: "m", examples: ["- [ ] Todo"], group: "markdown" },
      { label: this.plugin.t("preset_codeblocks", "Codeblocks"), pattern: "```[\\s\\S]*?```", flags: "", examples: ["``` code ```"], group: "markdown" },
      { label: this.plugin.t("preset_dates_yyyy_mm_dd", "Dates (YYYY-MM-DD)"), pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b", flags: "", examples: ["2009-01-19"] },
      { label: this.plugin.t("preset_dates_yyyy_mmm_dd", "Dates (YYYY-MMM-DD)"), pattern: "\\b\\d{4}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\\d{2}\\b", flags: "i", examples: ["2025-Jan-19"] },
      { label: this.plugin.t("preset_times_am_pm", "Times (AM/PM)"), pattern: "\\b(?:1[0-2]|0?[1-9]):[0-5][0-9](?:am|pm)\\b", flags: "i", examples: ["9:05pm"] },
      { label: this.plugin.t("preset_relative_dates", "Relative dates"), pattern: "\\b(?:today|tomorrow|yesterday|next week|last week)\\b", flags: "i", examples: ["today, tomorrow"] },
      { label: this.plugin.t("preset_basic_urls", "Basic URLs"), pattern: "\\bhttps?://\\S+\\b", flags: "", examples: ["https://example.com"], group: "markdown" },
      { label: this.plugin.t("preset_markdown_links", "Markdown links"), pattern: "\\[[^\\]]+\\]\\(https?://[^)]+\\)", flags: "", examples: ["[Link](https://example.com)"], group: "markdown" },
      { label: this.plugin.t("preset_inline_comments", "Comments (%%\u2026%%)"), pattern: "%%[\\s\\S]*?%%", flags: "s", examples: ["%% comment %%"], group: "markdown" },
      { label: this.plugin.t("preset_domain_names", "Domain names"), pattern: "\\b[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}\\b", flags: "", examples: ["example.com"] },
      { label: this.plugin.t("preset_email_addresses", "Email addresses"), pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b", flags: "", examples: ["name@example.com"] },
      { label: this.plugin.t("preset_at_username", "@username"), pattern: "@[a-zA-Z0-9_]+", flags: "", examples: ["@username"] },
      { label: this.plugin.t("preset_currency", "Currency"), pattern: "\\$\\d+(?:\\.\\d{2})?|\\b[\u20AC\xA3\xA5]\\d+(?:\\.\\d{2})?\\b", flags: "", examples: ["$29.99"] },
      { label: this.plugin.t("preset_measurements", "Measurements"), pattern: "\\b\\d+(?:\\.\\d+)?(?:kg|cm|m|km|\xB0C|\xB0F|lbs)\\b", flags: "", examples: ["25kg"] },
      { label: this.plugin.t("preset_phone_numbers", "Phone numbers"), pattern: "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b", flags: "", examples: ["123-456-7890"] },
      { label: this.plugin.t("preset_parentheses", "Parentheses ()"), pattern: "\\(([^)]*)\\)", flags: "g", examples: ["( text )"], group: "brackets" },
      { label: this.plugin.t("preset_square_brackets", "Square Brackets []"), pattern: "\\[([^\\]]*)\\]", flags: "g", examples: ["[ yes ]"], group: "brackets", disableRegexSafety: true },
      { label: this.plugin.t("preset_curly_braces", "Curly Braces {}"), pattern: "\\{([^}]*)\\}", flags: "g", examples: ["{ no }"], group: "brackets" },
      { label: this.plugin.t("preset_angle_brackets", "Angle Brackets <>"), pattern: "<([^>]*)>", flags: "g", examples: ["< text >"], group: "brackets" },
      { label: this.plugin.t("preset_colons", "Colons :"), pattern: ":([^:]*):", flags: "g", examples: [": text :"], group: "brackets" },
      { label: this.plugin.t("preset_double_quotes", 'Double Quotes ""'), pattern: '"[^"]*"', flags: "", examples: ['"text"'], group: "brackets", disableRegexSafety: true },
      { label: this.plugin.t("preset_single_quotes", "Single Quotes ''"), pattern: "'[^'\\r\\n]*'", flags: "", examples: ["'text'"], group: "brackets", disableRegexSafety: true },
      { label: this.plugin.t("preset_single_quotes_word_bounded", "Single Quotes '' (word-bounded)"), pattern: "'\\b[^'\\r\\n]*\\b'", flags: "", examples: ["'word'"], group: "brackets", disableRegexSafety: true },
      { label: this.plugin.t("preset_all_texts", "All texts"), pattern: ".+", flags: "", examples: ["This will target all texts."], group: "markdown" }
    ];
    const markdownPresets = presets.filter((p) => p.group === "markdown" || [
      this.plugin.t("preset_all_headings", "All Headings (H1-H6)")
    ].includes(p.label));
    const bracketPresets = presets.filter((p) => p.group === "brackets");
    const otherPresets = presets.filter((p) => !markdownPresets.includes(p) && !bracketPresets.includes(p));
    const container = contentEl.createDiv();
    container.style.display = "grid";
    container.style.gridTemplateColumns = "1fr 1fr 1fr";
    container.style.gap = "12px";
    container.style.maxWidth = "100%";
    const mediaRule = `
      @media (max-width: 1024px) { 
        .preset-columns { grid-template-columns: 1fr 1fr !important; gap: 8px !important; } 
      }
      @media (max-width: 600px) { 
        .preset-columns { grid-template-columns: 1fr !important; gap: 8px !important; } 
      }
    `;
    const style = document.createElement("style");
    style.textContent = mediaRule;
    document.head.appendChild(style);
    container.className = "preset-columns";
    const leftCol = container.createDiv();
    const leftTitle = leftCol.createEl("h3", { text: this.plugin.t("preset_group_markdown_formatting", "Markdown Formatting") });
    leftTitle.style.marginTop = "0";
    leftTitle.style.marginBottom = "12px";
    leftTitle.style.fontSize = "14px";
    leftTitle.style.fontWeight = "600";
    leftTitle.style.opacity = "0.8";
    const leftList = leftCol.createDiv();
    markdownPresets.forEach((p) => {
      const row = leftList.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";
      const btn = row.createEl("button", { text: p.label });
      btn.style.fontSize = "12px";
      btn.style.padding = "6px 10px";
      const infoDiv = row.createDiv();
      infoDiv.style.flex = "1";
      infoDiv.style.display = "flex";
      infoDiv.style.flexDirection = "column";
      infoDiv.style.gap = "2px";
      const sample = infoDiv.createEl("span", { text: p.examples && p.examples[0] ? p.examples[0] : "" });
      sample.style.opacity = "0.7";
      sample.style.fontSize = "11px";
      if (p.disableRegexSafety) {
        const badge = infoDiv.createEl("span", { text: "Requires regex safety disabled" });
        badge.style.opacity = "0.6";
        badge.style.fontSize = "10px";
        badge.style.color = "var(--text-warning)";
      }
      const handler = () => {
        try {
          this.onChoose && this.onChoose(p);
        } finally {
          this.close();
        }
      };
      btn.addEventListener("click", handler);
      this._listeners.push({ el: btn, h: handler });
    });
    const rightCol = container.createDiv();
    const rightTitle = rightCol.createEl("h3", { text: this.plugin.t("preset_group_other_patterns", "Other Patterns") });
    rightTitle.style.marginTop = "0";
    rightTitle.style.marginBottom = "12px";
    rightTitle.style.fontSize = "14px";
    rightTitle.style.fontWeight = "600";
    rightTitle.style.opacity = "0.8";
    const rightList = rightCol.createDiv();
    otherPresets.forEach((p) => {
      const row = rightList.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";
      const btn = row.createEl("button", { text: p.label });
      btn.style.fontSize = "12px";
      btn.style.padding = "6px 10px";
      const infoDiv = row.createDiv();
      infoDiv.style.flex = "1";
      infoDiv.style.display = "flex";
      infoDiv.style.flexDirection = "column";
      infoDiv.style.gap = "2px";
      const sample = infoDiv.createEl("span", { text: p.examples && p.examples[0] ? p.examples[0] : "" });
      sample.style.opacity = "0.7";
      sample.style.fontSize = "11px";
      if (p.disableRegexSafety) {
        const badge = infoDiv.createEl("span", { text: "Requires regex safety disabled" });
        badge.style.opacity = "0.6";
        badge.style.fontSize = "10px";
        badge.style.color = "var(--text-warning)";
      }
      const handler = () => {
        try {
          this.onChoose && this.onChoose(p);
        } finally {
          this.close();
        }
      };
      btn.addEventListener("click", handler);
      this._listeners.push({ el: btn, h: handler });
    });
    const middleCol = container.createDiv();
    const middleTitle = middleCol.createEl("h3", { text: this.plugin.t("preset_group_brackets", "Brackets") });
    middleTitle.style.marginTop = "0";
    middleTitle.style.marginBottom = "12px";
    middleTitle.style.fontSize = "14px";
    middleTitle.style.fontWeight = "600";
    middleTitle.style.opacity = "0.8";
    const middleList = middleCol.createDiv();
    bracketPresets.forEach((p) => {
      const row = middleList.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";
      const btn = row.createEl("button", { text: p.label });
      btn.style.fontSize = "12px";
      btn.style.padding = "6px 10px";
      const infoDiv = row.createDiv();
      infoDiv.style.flex = "1";
      infoDiv.style.display = "flex";
      infoDiv.style.flexDirection = "column";
      infoDiv.style.gap = "2px";
      const sample = infoDiv.createEl("span", { text: p.examples && p.examples[0] ? p.examples[0] : "" });
      sample.style.opacity = "0.7";
      sample.style.fontSize = "11px";
      if (p.disableRegexSafety) {
        const badge = infoDiv.createEl("span", { text: "Requires regex safety disabled" });
        badge.style.opacity = "0.6";
        badge.style.fontSize = "10px";
        badge.style.color = "var(--text-warning)";
      }
      const handler = () => {
        try {
          this.onChoose && this.onChoose(p);
        } finally {
          this.close();
        }
      };
      btn.addEventListener("click", handler);
      this._listeners.push({ el: btn, h: handler });
    });
  }
  onClose() {
    this._listeners.forEach((x) => {
      try {
        x.el.removeEventListener("click", x.h);
      } catch (e) {
      }
    });
    this._listeners = [];
    this.contentEl.empty();
  }
};
var RealTimeRegexTesterModal = class extends Modal {
  constructor(app, plugin, onAdded, advancedRuleEntry = null) {
    super(app);
    this.plugin = plugin;
    this.onAdded = onAdded;
    this._advancedRuleEntry = advancedRuleEntry;
    this._editingEntry = null;
    this._preFillPattern = "";
    this._preFillFlags = "";
    this._preFillName = "";
    this._preFillStyleType = "both";
    this._preFillTextColor = "#87c760";
    this._preFillBgColor = "#1d5010";
    this._handlers = [];
    this._rafId = null;
    this._debounceId = null;
    this._lastValidHTML = "";
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.style.maxWidth = "820px";
      this.modalEl.style.padding = "20px";
    } catch (e) {
    }
    const title = contentEl.createEl("h2", { text: this.plugin.t("regex_tester_header", "Regex Tester") });
    title.style.marginTop = "0";
    title.style.marginBottom = "12px";
    try {
      title.addClass("act-regex-title");
    } catch (e) {
    }
    const controlsRow = contentEl.createDiv();
    controlsRow.style.display = "flex";
    controlsRow.style.gap = "12px";
    const flagsRow = controlsRow.createDiv();
    flagsRow.style.display = "flex";
    flagsRow.style.gap = "6px";
    const flagNames = ["i", "g", "m", "s", "u", "y"];
    const flagButtons = {};
    flagNames.forEach((f) => {
      const b = flagsRow.createEl("button", { text: f });
      b.style.padding = "6px 10px";
      b.style.borderRadius = "var(--radius-m)";
      b.style.border = "1px solid var(--background-modifier-border)";
      b.style.background = "var(--background-modifier-form-field)";
      b.style.cursor = "pointer";
      flagButtons[f] = b;
    });
    const styleSelect = controlsRow.createEl("select");
    styleSelect.innerHTML = `<option value="text">${this.plugin.t("style_type_text", "color")}</option><option value="highlight">${this.plugin.t("style_type_highlight", "highlight")}</option><option value="both">${this.plugin.t("style_type_both", "both")}</option>`;
    styleSelect.value = this._preFillStyleType || "both";
    styleSelect.style.border = "1px solid var(--background-modifier-border)";
    styleSelect.style.borderRadius = "var(--radius-m)";
    styleSelect.style.background = "var(--background-modifier-form-field)";
    styleSelect.style.textAlign = "center";
    styleSelect.style.marginTop = "0";
    const textColorInput = controlsRow.createEl("input", { type: "color" });
    textColorInput.value = this._preFillTextColor || "#87c760";
    textColorInput.style.width = "48px";
    const bgColorInput = controlsRow.createEl("input", { type: "color" });
    bgColorInput.value = this._preFillBgColor || "#1d5010";
    bgColorInput.style.width = "48px";
    const regexInput = contentEl.createEl("input", { type: "text" });
    regexInput.placeholder = this.plugin.t("regex_expression_placeholder", "put your expression here");
    regexInput.style.marginTop = "10px";
    regexInput.style.width = "100%";
    regexInput.style.padding = "10px 14px";
    regexInput.style.borderRadius = "var(--radius-s)";
    regexInput.style.border = "1px solid var(--background-modifier-border)";
    regexInput.style.background = "var(--background-modifier-form-field)";
    regexInput.style.fontFamily = "var(--font-ui-medium)";
    const subjectWrap = contentEl.createDiv();
    subjectWrap.style.marginTop = "10px";
    subjectWrap.style.border = "1px solid var(--background-modifier-border)";
    subjectWrap.style.borderRadius = "var(--radius-m)";
    subjectWrap.style.overflow = "hidden";
    subjectWrap.style.background = "var(--background-modifier-form-field)";
    const testInput = subjectWrap.createEl("textarea");
    testInput.placeholder = this.plugin.t("regex_subject_placeholder", "type your subject / test string here...");
    testInput.style.width = "100%";
    testInput.style.height = "120px";
    testInput.style.padding = "12px";
    testInput.style.border = "none";
    testInput.style.outline = "none";
    testInput.style.background = "transparent";
    testInput.style.color = "var(--text-normal)";
    testInput.style.fontFamily = "var(--font-ui-medium)";
    testInput.style.resize = "none";
    const previewWrap = contentEl.createDiv();
    previewWrap.style.marginTop = "10px";
    previewWrap.style.border = "1px solid var(--background-modifier-border)";
    previewWrap.style.borderRadius = "var(--radius-m)";
    previewWrap.style.padding = "12px";
    previewWrap.style.background = "var(--background-modifier-form-field)";
    previewWrap.style.whiteSpace = "pre-wrap";
    previewWrap.style.wordWrap = "break-word";
    previewWrap.style.fontFamily = "var(--font-ui-medium)";
    previewWrap.style.fontSize = "var(--font-small)";
    previewWrap.style.lineHeight = "1.5";
    const nameInput = contentEl.createEl("input", { type: "text" });
    nameInput.placeholder = this.plugin.t("regex_name_placeholder", "name your regex");
    nameInput.style.marginTop = "10px";
    nameInput.style.width = "100%";
    nameInput.style.padding = "10px 14px";
    nameInput.style.borderRadius = "var(--radius-m)";
    nameInput.style.border = "1px solid var(--background-modifier-border)";
    nameInput.style.background = "var(--background-modifier-form-field)";
    nameInput.style.boxSizing = "border-box";
    const statusRow = contentEl.createDiv();
    statusRow.style.display = "flex";
    statusRow.style.justifyContent = "space-between";
    statusRow.style.alignItems = "center";
    statusRow.style.gap = "8px";
    statusRow.style.marginTop = "14px";
    const matchFooter = statusRow.createDiv();
    matchFooter.style.opacity = "0.8";
    matchFooter.style.flex = "1";
    const addBtn = statusRow.createEl("button", { text: this._editingEntry ? this.plugin.t("btn_save_regex", "Save Regex") : this.plugin.t("btn_add_regex", "+ Add Regex") });
    addBtn.addClass("mod-cta");
    const infoWrap = contentEl.createDiv();
    infoWrap.style.marginTop = "8px";
    infoWrap.style.fontFamily = "monospace";
    infoWrap.style.fontSize = "var(--font-small)";
    const status = infoWrap.createDiv();
    status.style.opacity = "0.8";
    const sanitizeFlags = (f) => {
      const s = String(f || "").toLowerCase().replace(/[^gimsuy]/g, "");
      let out = "";
      for (const ch of ["g", "i", "m", "s", "u", "y"]) {
        if (s.includes(ch)) out += ch;
      }
      return out;
    };
    const escapeHtml = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const renderPreview = () => {
      const raw = String(testInput.value || "");
      const patRaw = String(regexInput.value || "").trim();
      const flags = Object.keys(flagButtons).filter((k) => flagButtons[k].dataset.on === "1").join("");
      const f = flags.includes("g") ? flags : flags + "g";
      if (!patRaw) {
        status.textContent = "";
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      const pat = this.plugin.sanitizePattern(patRaw, true);
      if (!pat) {
        status.textContent = "";
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      if (!this.plugin.settings.disableRegexSafety && !this.plugin.validateAndSanitizeRegex(pat)) {
        status.textContent = "";
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      let re;
      try {
        re = new RegExp(pat, f);
      } catch (e) {
        status.textContent = "";
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      let lastIndex = 0;
      let out = "";
      let count = 0;
      const style = styleSelect.value;
      const t = textColorInput.value;
      const b = bgColorInput.value;
      const rgba = this.plugin.hexToRgba(b, this.plugin.settings.backgroundOpacity ?? 25);
      const radius = this.plugin.settings.highlightBorderRadius ?? 8;
      const pad = this.plugin.settings.highlightHorizontalPadding ?? 4;
      const borderStyle = style === "text" ? "" : style === "highlight" ? this.plugin.generateBorderStyle(null, b) : this.plugin.generateBorderStyle(t, b);
      const matchStyle = style === "text" ? `color:${t};background:transparent;` : style === "highlight" ? `background:${rgba};border-radius:${radius}px;padding:0 ${pad}px;color:var(--text-normal);${borderStyle}` : `color:${t};background:${rgba};border-radius:${radius}px;padding:0 ${pad}px;${borderStyle}`;
      for (const m of raw.matchAll(re)) {
        const s = m.index ?? 0;
        const e = s + (m[0] ? m[0].length : 0);
        out += escapeHtml(raw.slice(lastIndex, s));
        out += `<mark style="${matchStyle}">${escapeHtml(raw.slice(s, e))}</mark>`;
        lastIndex = e;
        count++;
      }
      out += escapeHtml(raw.slice(lastIndex));
      previewWrap.innerHTML = out.replace(/\n/g, "<br>");
      matchFooter.textContent = `${count} match${count === 1 ? "" : "es"}`;
      status.textContent = "";
    };
    const render = () => {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this._rafId = requestAnimationFrame(renderPreview);
    };
    const renderDebounced = () => {
      if (this._debounceId) clearTimeout(this._debounceId);
      this._debounceId = setTimeout(() => {
        render();
      }, 100);
    };
    const updateFlagButtonUI = () => {
      const active = Object.keys(flagButtons).filter((k) => flagButtons[k].dataset.on === "1");
      Object.keys(flagButtons).forEach((k) => {
        const on = flagButtons[k].dataset.on === "1";
        flagButtons[k].style.background = on ? "var(--interactive-accent)" : "var(--background-modifier-form-field)";
        flagButtons[k].style.color = on ? "var(--text-on-accent)" : "var(--text-normal)";
      });
    };
    Object.keys(flagButtons).forEach((k) => {
      const btn = flagButtons[k];
      const flagTooltips = { "i": "ignore case", "g": "global", "m": "multiline", "s": "dotall", "u": "unicode", "y": "sticky" };
      if (flagTooltips[k]) {
        btn.setAttribute("title", flagTooltips[k]);
      }
      const fn = () => {
        btn.dataset.on = btn.dataset.on === "1" ? "0" : "1";
        updateFlagButtonUI();
        render();
      };
      btn.addEventListener("click", fn);
      this._handlers.push({ el: btn, ev: "click", fn });
    });
    updateFlagButtonUI();
    if (this._preFillPattern) {
      regexInput.value = this._preFillPattern;
    }
    if (this._preFillFlags) {
      const flags = String(this._preFillFlags || "").split("");
      flags.forEach((f) => {
        if (flagButtons[f]) {
          flagButtons[f].dataset.on = "1";
        }
      });
      updateFlagButtonUI();
    }
    if (this._preFillName) {
      nameInput.value = this._preFillName;
    }
    if (this._preFillStyleType) {
      styleSelect.value = this._preFillStyleType;
    }
    if (this._preFillTextColor) {
      textColorInput.value = this._preFillTextColor;
    }
    if (this._preFillBgColor) {
      bgColorInput.value = this._preFillBgColor;
    }
    const onInputImmediate = () => {
      render();
    };
    const onInputDebounced = () => {
      renderDebounced();
    };
    const styleChange = () => {
      render();
    };
    [textColorInput, bgColorInput, styleSelect].forEach((el) => {
      const ev = el === styleSelect ? "change" : "input";
      const fn = el === styleSelect ? styleChange : onInputImmediate;
      el.addEventListener(ev, fn);
      this._handlers.push({ el, ev, fn });
    });
    testInput.addEventListener("input", onInputDebounced);
    this._handlers.push({ el: testInput, ev: "input", fn: onInputDebounced });
    regexInput.addEventListener("input", onInputDebounced);
    this._handlers.push({ el: regexInput, ev: "input", fn: onInputDebounced });
    render();
    const addHandler = async () => {
      const patRaw = String(regexInput.value || "").trim();
      const pat = this.plugin.sanitizePattern(patRaw, true);
      const label = String(nameInput.value || "").trim();
      const flags = Object.keys(flagButtons).filter((k) => flagButtons[k].dataset.on === "1").join("");
      if (!pat) {
        new Notice(this.plugin.t("notice_empty_pattern", "Pattern is empty"));
        return;
      }
      if (!this.plugin.settings.disableRegexSafety && !this.plugin.validateAndSanitizeRegex(pat)) {
        new Notice(this.plugin.t("notice_pattern_too_complex", "Pattern too complex"));
        return;
      }
      try {
        this.plugin.settings.enableRegexSupport = true;
      } catch (e) {
      }
      if (this._advancedRuleEntry) {
        try {
          this._advancedRuleEntry.text = pat;
          this._advancedRuleEntry.flags = flags;
          await this.plugin.saveSettings();
          try {
            this.onAdded && this.onAdded(this._advancedRuleEntry);
          } catch (e) {
          }
          new Notice(this.plugin.t("notice_rule_updated", "Rule updated"));
          this.close();
          return;
        } catch (e) {
          debugError("REGEX_TESTER", "advanced rule update error", e);
        }
      }
      if (this._editingEntry) {
        try {
          const style2 = styleSelect.value;
          const updated = Object.assign({}, this._editingEntry, {
            pattern: pat,
            flags,
            presetLabel: label || void 0,
            styleType: style2,
            isRegex: true
          });
          if (style2 === "text") {
            updated.color = textColorInput.value || "";
            updated.textColor = null;
            updated.backgroundColor = null;
          } else if (style2 === "highlight") {
            updated.color = "";
            updated.textColor = "currentColor";
            updated.backgroundColor = bgColorInput.value || "";
          } else {
            updated.color = "";
            updated.textColor = textColorInput.value || "";
            updated.backgroundColor = bgColorInput.value || "";
          }
          let idx = -1;
          if (updated && updated.uid) idx = this.plugin.settings.wordEntries.findIndex((e) => e && e.uid === updated.uid);
          if (idx === -1) idx = this.plugin.settings.wordEntries.indexOf(this._editingEntry);
          if (idx === -1) idx = this.plugin.settings.wordEntries.findIndex((e) => e && e.isRegex && String(e.pattern) === String(this._editingEntry.pattern));
          if (idx !== -1) this.plugin.settings.wordEntries[idx] = updated;
          else this.plugin.settings.wordEntries.push(updated);
          this._editingEntry.pattern = updated.pattern;
          this._editingEntry.flags = updated.flags;
          this._editingEntry.presetLabel = updated.presetLabel;
          this._editingEntry.styleType = updated.styleType;
          this._editingEntry.color = updated.color;
          this._editingEntry.textColor = updated.textColor;
          this._editingEntry.backgroundColor = updated.backgroundColor;
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this.plugin.triggerActiveDocumentRerender();
          try {
            this.onAdded && this.onAdded(updated);
          } catch (e) {
          }
          new Notice(this.plugin.t("notice_regex_updated", "Regex updated"));
          this.close();
          return;
        } catch (e) {
          debugError("REGEX_TESTER", "entry update error", e);
        }
      }
      const uid = (() => {
        try {
          return Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          return Date.now();
        }
      })();
      const style = styleSelect.value;
      const entry = { uid, isRegex: true, pattern: pat, flags, presetLabel: label || void 0, styleType: style, persistAtEnd: true };
      if (style === "text") {
        entry.color = textColorInput.value || "";
        entry.textColor = null;
        entry.backgroundColor = null;
      } else if (style === "highlight") {
        entry.color = "";
        entry.textColor = "currentColor";
        entry.backgroundColor = bgColorInput.value || "";
      } else {
        entry.color = "";
        entry.textColor = textColorInput.value || "";
        entry.backgroundColor = bgColorInput.value || "";
      }
      this.plugin.settings.wordEntries.push(entry);
      await this.plugin.saveSettings();
      this.plugin.compileWordEntries();
      this.plugin.compileTextBgColoringEntries();
      this.plugin.reconfigureEditorExtensions();
      this.plugin.forceRefreshAllEditors();
      this.plugin.forceRefreshAllReadingViews();
      this.plugin.triggerActiveDocumentRerender();
      try {
        this.onAdded && this.onAdded(entry);
      } catch (e) {
      }
      new Notice(this.plugin.t("notice_added_regex", "Regex added"));
      this.close();
    };
    addBtn.addEventListener("click", addHandler);
    this._handlers.push({ el: addBtn, ev: "click", fn: addHandler });
  }
  onClose() {
    try {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      if (this._debounceId) clearTimeout(this._debounceId);
      this._handlers.forEach((h) => {
        try {
          h.el.removeEventListener(h.ev, h.fn);
        } catch (e) {
        }
      });
    } catch (e) {
    }
    this._handlers = [];
    try {
      this.contentEl.empty();
    } catch (e) {
    }
  }
};
var BlacklistRegexTesterModal = class extends Modal {
  constructor(app, plugin, onAdded) {
    super(app);
    this.plugin = plugin;
    this.onAdded = onAdded;
    this._editingEntry = null;
    this._handlers = [];
    this._rafId = null;
    this._debounceId = null;
    this._preFillPattern = "";
    this._preFillFlags = "";
    this._preFillName = "";
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.style.maxWidth = "820px";
      this.modalEl.style.padding = "20px";
    } catch (e) {
    }
    const title = contentEl.createEl("h2", { text: this.plugin.t("regex_tester_blacklist", "Regex tester - blacklist") });
    title.style.marginTop = "0";
    title.style.marginBottom = "12px";
    try {
      title.addClass("act-regex-title");
    } catch (e) {
    }
    const controlsRow = contentEl.createDiv();
    controlsRow.style.display = "flex";
    controlsRow.style.gap = "12px";
    const flagsRow = controlsRow.createDiv();
    flagsRow.style.display = "flex";
    flagsRow.style.gap = "6px";
    const flagNames = ["i", "g", "m", "s", "u", "y"];
    const flagButtons = {};
    flagNames.forEach((f) => {
      const b = flagsRow.createEl("button", { text: f });
      b.style.padding = "6px 10px";
      b.style.borderRadius = "var(--radius-m)";
      b.style.border = "1px solid var(--background-modifier-border)";
      b.style.background = "var(--background-modifier-form-field)";
      b.style.cursor = "pointer";
      flagButtons[f] = b;
    });
    const regexInput = contentEl.createEl("input", { type: "text" });
    regexInput.placeholder = this.plugin.t("regex_expression_placeholder", "put your expression here");
    regexInput.style.marginTop = "10px";
    regexInput.style.width = "100%";
    regexInput.style.padding = "10px 14px";
    regexInput.style.borderRadius = "var(--radius-m)";
    regexInput.style.border = "1px solid var(--background-modifier-border)";
    regexInput.style.background = "var(--background-modifier-form-field)";
    regexInput.style.fontFamily = "var(--font-ui-medium)";
    const subjectWrap = contentEl.createDiv();
    subjectWrap.style.marginTop = "10px";
    subjectWrap.style.border = "1px solid var(--background-modifier-border)";
    subjectWrap.style.borderRadius = "var(--radius-m)";
    subjectWrap.style.overflow = "hidden";
    subjectWrap.style.background = "var(--background-modifier-form-field)";
    const testInput = subjectWrap.createEl("textarea");
    testInput.placeholder = this.plugin.t("regex_subject_placeholder", "type your subject / test string here...");
    testInput.style.width = "100%";
    testInput.style.height = "120px";
    testInput.style.padding = "12px";
    testInput.style.border = "none";
    testInput.style.outline = "none";
    testInput.style.background = "transparent";
    testInput.style.color = "var(--text-normal)";
    testInput.style.fontFamily = "var(--font-ui-medium)";
    testInput.style.resize = "none";
    const previewWrap = contentEl.createDiv();
    previewWrap.style.marginTop = "10px";
    previewWrap.style.border = "1px solid var(--background-modifier-border)";
    previewWrap.style.borderRadius = "var(--radius-m)";
    previewWrap.style.padding = "12px";
    previewWrap.style.background = "var(--background-modifier-form-field)";
    previewWrap.style.whiteSpace = "pre-wrap";
    previewWrap.style.wordWrap = "break-word";
    previewWrap.style.fontFamily = "var(--font-ui-medium)";
    previewWrap.style.fontSize = "var(--font-small)";
    previewWrap.style.lineHeight = "1.5";
    const nameInput = contentEl.createEl("input", { type: "text" });
    nameInput.placeholder = this.plugin.t("regex_name_placeholder", "name your regex");
    nameInput.style.marginTop = "10px";
    nameInput.style.width = "100%";
    nameInput.style.padding = "10px 14px";
    nameInput.style.borderRadius = "var(--radius-m)";
    nameInput.style.border = "1px solid var(--background-modifier-border)";
    nameInput.style.background = "var(--background-modifier-form-field)";
    nameInput.style.boxSizing = "border-box";
    nameInput.style.fontFamily = "var(--font-ui-medium)";
    const statusRow = contentEl.createDiv();
    statusRow.style.display = "flex";
    statusRow.style.justifyContent = "space-between";
    statusRow.style.alignItems = "center";
    statusRow.style.gap = "8px";
    statusRow.style.marginTop = "14px";
    const matchFooter = statusRow.createDiv();
    matchFooter.style.opacity = "0.8";
    matchFooter.style.flex = "1";
    const addBtn = statusRow.createEl("button", { text: this._editingEntry ? this.plugin.t("btn_save_regex", "Save Regex") : this.plugin.t("btn_add_regex", "+ Add to Blacklist") });
    addBtn.addClass("mod-cta");
    const sanitizeFlags = (f) => {
      const s = String(f || "").toLowerCase().replace(/[^gimsuy]/g, "");
      let out = "";
      for (const ch of ["g", "i", "m", "s", "u", "y"]) {
        if (s.includes(ch)) out += ch;
      }
      return out;
    };
    const escapeHtml = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const renderPreview = () => {
      const raw = String(testInput.value || "");
      const patRaw = String(regexInput.value || "").trim();
      const flags = Object.keys(flagButtons).filter((k) => flagButtons[k].dataset.on === "1").join("");
      const f = flags.includes("g") ? flags : flags + "g";
      if (!patRaw) {
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      const pat = this.plugin.sanitizePattern(patRaw, true);
      if (!pat) {
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      if (!this.plugin.settings.disableRegexSafety && !this.plugin.validateAndSanitizeRegex(pat)) {
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      let re;
      try {
        re = new RegExp(pat, f);
      } catch (e) {
        previewWrap.innerHTML = escapeHtml(raw).replace(/\n/g, "<br>");
        matchFooter.textContent = "0 matches";
        return;
      }
      let lastIndex = 0;
      let out = "";
      let count = 0;
      const matchStyle = "background:rgba(255, 68, 68, 0.5);border-radius:4px;padding:0 4px;";
      for (const m of raw.matchAll(re)) {
        const s = m.index ?? 0;
        const e = s + (m[0] ? m[0].length : 0);
        out += escapeHtml(raw.slice(lastIndex, s));
        out += `<mark style="${matchStyle}">${escapeHtml(raw.slice(s, e))}</mark>`;
        lastIndex = e;
        count++;
      }
      out += escapeHtml(raw.slice(lastIndex));
      previewWrap.innerHTML = out.replace(/\n/g, "<br>");
      matchFooter.textContent = `${count} match${count === 1 ? "" : "es"}`;
    };
    const render = () => {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this._rafId = requestAnimationFrame(renderPreview);
    };
    const renderDebounced = () => {
      if (this._debounceId) clearTimeout(this._debounceId);
      this._debounceId = setTimeout(() => {
        render();
      }, 100);
    };
    const updateFlagButtonUI = () => {
      const active = Object.keys(flagButtons).filter((k) => flagButtons[k].dataset.on === "1");
      Object.keys(flagButtons).forEach((k) => {
        const on = flagButtons[k].dataset.on === "1";
        flagButtons[k].style.background = on ? "var(--interactive-accent)" : "var(--background-modifier-form-field)";
        flagButtons[k].style.color = on ? "var(--text-on-accent)" : "var(--text-normal)";
      });
    };
    const flagTooltips = { "i": "ignore case", "g": "global", "m": "multiline", "s": "dotall", "u": "unicode", "y": "sticky" };
    Object.keys(flagButtons).forEach((k) => {
      const btn = flagButtons[k];
      if (flagTooltips[k]) {
        btn.setAttribute("title", flagTooltips[k]);
      }
      const fn = () => {
        btn.dataset.on = btn.dataset.on === "1" ? "0" : "1";
        updateFlagButtonUI();
        render();
      };
      btn.addEventListener("click", fn);
      this._handlers.push({ el: btn, ev: "click", fn });
    });
    updateFlagButtonUI();
    if (this._preFillPattern) {
      regexInput.value = this._preFillPattern;
    }
    if (this._preFillFlags) {
      const flags = String(this._preFillFlags || "").split("");
      flags.forEach((f) => {
        if (flagButtons[f]) {
          flagButtons[f].dataset.on = "1";
        }
      });
      updateFlagButtonUI();
    }
    if (this._preFillName) {
      nameInput.value = this._preFillName;
    }
    const onInputImmediate = () => {
      render();
    };
    const onInputDebounced = () => {
      renderDebounced();
    };
    [regexInput, testInput].forEach((el) => {
      const ev = el === regexInput ? "input" : "input";
      const fn = onInputDebounced;
      el.addEventListener(ev, fn);
      this._handlers.push({ el, ev, fn });
    });
    render();
    const addHandler = async () => {
      const patRaw = String(regexInput.value || "").trim();
      const pat = this.plugin.sanitizePattern(patRaw, true);
      const label = String(nameInput.value || "").trim();
      const flags = Object.keys(flagButtons).filter((k) => flagButtons[k].dataset.on === "1").join("");
      if (!pat) {
        new Notice(this.plugin.t("notice_empty_pattern", "Pattern is empty"));
        return;
      }
      if (!this.plugin.settings.disableRegexSafety && !this.plugin.validateAndSanitizeRegex(pat)) {
        new Notice(this.plugin.t("notice_pattern_too_complex", "Pattern too complex"));
        return;
      }
      try {
        this.plugin.settings.enableRegexSupport = true;
      } catch (e) {
      }
      if (this._advancedRuleEntry) {
        try {
          this._advancedRuleEntry.text = pat;
          this._advancedRuleEntry.flags = flags;
          await this.plugin.saveSettings();
          try {
            this.onAdded && this.onAdded(this._advancedRuleEntry);
          } catch (e) {
          }
          new Notice(this.plugin.t("notice_rule_updated", "Rule updated"));
          this.close();
          return;
        } catch (e) {
          debugError("REGEX_TESTER", "advanced rule update error", e);
        }
      }
      if (this._editingEntry) {
        try {
          const updated = Object.assign({}, this._editingEntry, {
            pattern: pat,
            flags,
            presetLabel: label || void 0,
            isRegex: true
          });
          let entryIdx = -1;
          if (updated && updated.uid) entryIdx = this.plugin.settings.blacklistEntries.findIndex((e) => e && e.uid === updated.uid);
          if (entryIdx === -1) entryIdx = this.plugin.settings.blacklistEntries.indexOf(this._editingEntry);
          if (entryIdx === -1) entryIdx = this.plugin.settings.blacklistEntries.findIndex((e) => e && e.isRegex && String(e.pattern) === String(this._editingEntry.pattern));
          if (entryIdx !== -1) this.plugin.settings.blacklistEntries[entryIdx] = updated;
          else this.plugin.settings.blacklistEntries.push(updated);
          this._editingEntry.pattern = updated.pattern;
          this._editingEntry.flags = updated.flags;
          this._editingEntry.presetLabel = updated.presetLabel;
          this._editingEntry.isRegex = updated.isRegex;
          await this.plugin.saveSettings();
          try {
            this.onAdded && this.onAdded(updated);
          } catch (e) {
          }
          new Notice(this.plugin.t("notice_entry_updated", "Entry updated"));
          this.close();
          return;
        } catch (e) {
          debugError("REGEX_TESTER", "entry update error", e);
        }
      }
      const uid = (() => {
        try {
          return Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          return Date.now();
        }
      })();
      const entry = { uid, isRegex: true, pattern: pat, flags, presetLabel: label || void 0, persistAtEnd: true };
      if (!Array.isArray(this.plugin.settings.blacklistEntries)) this.plugin.settings.blacklistEntries = [];
      this.plugin.settings.blacklistEntries.push(entry);
      try {
        this.plugin.settingTab && (this.plugin.settingTab._suspendSorting = true);
      } catch (e) {
      }
      try {
        this.plugin.settingTab && entry && entry.uid && this.plugin.settingTab._blacklistNewSet && this.plugin.settingTab._blacklistNewSet.add(entry.uid);
      } catch (e) {
      }
      await this.plugin.saveSettings();
      try {
        this.onAdded && this.onAdded(entry);
      } catch (e) {
      }
      new Notice(this.plugin.t("notice_added_to_blacklist", "Pattern added to blacklist"));
      this.close();
    };
    addBtn.addEventListener("click", addHandler);
    this._handlers.push({ el: addBtn, ev: "click", fn: addHandler });
  }
  onClose() {
    try {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      if (this._debounceId) clearTimeout(this._debounceId);
      this._handlers.forEach((h) => {
        try {
          h.el.removeEventListener(h.ev, h.fn);
        } catch (e) {
        }
      });
    } catch (e) {
    }
    this._handlers = [];
    try {
      this.contentEl.empty();
    } catch (e) {
    }
  }
};
var ChangelogModal = class extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this._mdComp = null;
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.style.maxWidth = "900px";
      this.modalEl.style.width = "900px";
      this.modalEl.style.padding = "25px";
    } catch (e) {
    }
    const header = contentEl.createEl("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.marginBottom = "0px";
    header.style.paddingBottom = "16px";
    header.style.borderBottom = "1px solid var(--divider-color)";
    const title = header.createEl("h2", { text: this.plugin.t("header_plugin_name", "Always Color Text") });
    title.style.margin = "0";
    title.style.fontSize = "1.5em";
    title.style.fontWeight = "600";
    const link = header.createEl("a", { text: this.plugin.t("changelog_view_on_github", "View on GitHub") });
    link.href = "https://github.com/Kazi-Aidah/always-color-text/releases";
    link.target = "_blank";
    link.style.fontSize = "0.9em";
    link.style.opacity = "0.8";
    link.style.transition = "opacity 0.2s";
    link.addEventListener("mouseenter", () => link.style.opacity = "1");
    link.addEventListener("mouseleave", () => link.style.opacity = "0.8");
    const body = contentEl.createDiv();
    body.style.maxHeight = "70vh";
    body.style.overflow = "auto";
    const loading = body.createEl("div", { text: this.plugin.t("changelog_loading", "Loading releases\u2026") });
    loading.style.opacity = "0.7";
    loading.style.fontSize = "0.95em";
    loading.style.marginTop = "12px";
    try {
      const rels = await this.plugin.fetchAllReleases();
      body.empty();
      if (!Array.isArray(rels) || rels.length === 0) {
        const noInfo = body.createEl("div", { text: this.plugin.t("changelog_no_info", "No release information available.") });
        try {
          noInfo.style.marginTop = "12px";
        } catch (e) {
        }
        return;
      }
      rels.forEach(async (rel) => {
        const meta = body.createEl("div");
        meta.style.marginBottom = "6px";
        meta.style.borderBottom = "1px solid var(--divider-color)";
        const releaseName = meta.createEl("div", { text: rel.name || rel.tag_name || this.plugin.t("changelog_release", "Release") });
        releaseName.style.fontSize = "2em";
        releaseName.style.fontWeight = "900";
        releaseName.style.marginTop = "12px";
        releaseName.style.marginBottom = "12px";
        releaseName.style.color = "var(--text-normal)";
        try {
          const dateRaw = rel.published_at || rel.created_at || rel.release_date || null;
          if (dateRaw) {
            const dt = new Date(dateRaw);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const formatted = `${dt.getFullYear()} ${monthNames[dt.getMonth()]} ${String(dt.getDate()).padStart(2, "0")}`;
            const dateEl = meta.createEl("div", { text: formatted });
            dateEl.style.display = "block";
            dateEl.style.opacity = "0.8";
            dateEl.style.fontSize = "0.9em";
            dateEl.style.marginTop = "-4px";
          }
        } catch (_) {
        }
        const notes = body.createEl("div");
        notes.style.marginTop = "16px";
        notes.addClass("markdown-preview-view");
        notes.style.lineHeight = "1.6";
        notes.style.fontSize = "0.95em";
        try {
          notes.style.padding = "0 var(--file-margin)";
        } catch (e) {
        }
        const md = rel.body || this.plugin.t("changelog_no_notes", "No notes");
        try {
          if (!this._mdComp) {
            try {
              this._mdComp = new Component();
            } catch (e) {
              this._mdComp = null;
            }
          }
          await MarkdownRenderer.render(this.plugin.app, md, notes, "", this._mdComp || void 0);
        } catch (e) {
          const preEl = notes.createEl("pre");
          preEl.style.whiteSpace = "pre-wrap";
          preEl.style.wordWrap = "break-word";
          preEl.style.backgroundColor = "var(--background-secondary)";
          preEl.style.padding = "12px";
          preEl.style.borderRadius = "4px";
          preEl.style.fontSize = "0.9em";
          preEl.style.lineHeight = "1.5";
          preEl.textContent = md;
        }
      });
    } catch (e) {
      body.empty();
      const failed = body.createEl("div", { text: this.plugin.t("changelog_failed_to_load", "Failed to load release notes.") });
      try {
        failed.style.marginTop = "12px";
      } catch (e2) {
      }
    }
  }
  onClose() {
    try {
      if (this._mdComp && typeof this._mdComp.unload === "function") {
        this._mdComp.unload();
      }
    } catch (e) {
    }
    this._mdComp = null;
    try {
      this.contentEl.empty();
    } catch (e) {
    }
  }
};
var ManageRulesModal = class extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this._handlers = [];
    this._drag = { from: -1, to: -1 };
    this._filter = { text: "", regex: false };
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.style.maxWidth = "780px";
      this.modalEl.style.padding = "20px";
    } catch (e) {
    }
    const title = contentEl.createEl("h2", { text: this.plugin.t("advanced_rules_modal_header", "Advanced Rules") });
    title.style.marginTop = "0";
    title.style.marginBottom = "12px";
    const addBtnFull = contentEl.createEl("button", { text: this.plugin.t("btn_add_file_folder_rule", "+ Add file/folder rule") });
    addBtnFull.addClass("mod-cta");
    addBtnFull.style.width = "100%";
    addBtnFull.style.marginBottom = "12px";
    const addHandlerOpen = () => {
      try {
        new AddRuleModal(this.app, this.plugin, () => {
          renderList();
        }).open();
      } catch (e) {
      }
    };
    addBtnFull.addEventListener("click", addHandlerOpen);
    this._handlers.push({ el: addBtnFull, ev: "click", fn: addHandlerOpen });
    const searchRow = contentEl.createDiv();
    try {
      searchRow.addClass("act-search-container");
    } catch (e) {
      try {
        searchRow.classList.add("act-search-container");
      } catch (_) {
      }
    }
    searchRow.style.marginBottom = "12px";
    const searchInput = searchRow.createEl("input", { type: "text" });
    try {
      searchInput.addClass("act-search-input");
    } catch (e) {
      try {
        searchInput.classList.add("act-search-input");
      } catch (_) {
      }
    }
    searchInput.placeholder = this.plugin.t("search_file_folder_rules_placeholder", "Search file/folder rules\u2026");
    searchInput.style.width = "100%";
    searchInput.style.padding = "8px";
    searchInput.style.border = "1px solid var(--background-modifier-border)";
    searchInput.style.borderRadius = "6px";
    const searchIcon = searchRow.createDiv();
    try {
      searchIcon.addClass("act-search-icon");
    } catch (e) {
      try {
        searchIcon.classList.add("act-search-icon");
      } catch (_) {
      }
    }
    const searchHandler = () => {
      this._filter.text = String(searchInput.value || "").trim();
      renderList();
    };
    searchInput.addEventListener("input", searchHandler);
    this._handlers.push({ el: searchInput, ev: "input", fn: searchHandler });
    const listWrap = contentEl.createDiv();
    listWrap.style.borderRadius = "8px";
    listWrap.style.padding = "8px";
    listWrap.style.maxHeight = "50vh";
    listWrap.style.overflow = "auto";
    const list = listWrap.createDiv();
    const renderList = () => {
      list.empty();
      const rows = Array.isArray(this.plugin.settings.advancedRules) ? [...this.plugin.settings.advancedRules] : [];
      const q = String(this._filter.text || "").trim().toLowerCase();
      const filtered = q ? rows.filter((r) => [String(r.text || ""), String(r.path || "")].join(" ").toLowerCase().includes(q)) : rows;
      filtered.forEach((entry, i) => {
        const row = list.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.marginBottom = "8px";
        row.style.border = "1px solid var(--background-modifier-border)";
        row.style.borderRadius = "6px";
        row.style.padding = "8px";
        row.style.cursor = "pointer";
        row.setAttr("draggable", "true");
        const drag = row.createEl("span", { text: "\u2261" });
        drag.style.cursor = "grab";
        drag.style.flex = "0 0 auto";
        const textEl = row.createEl("span", { text: entry.text || "" });
        textEl.style.flex = "1";
        const modeText = entry.mode === "exclude" ? this.plugin.t("mode_does_not_color_in", "does not color in") : this.plugin.t("mode_only_colors_in", "only colors in");
        const pathText = entry.path || "(vault-wide)";
        const modeEl = row.createEl("span", { text: `${modeText} ${pathText}` });
        modeEl.style.flex = "1";
        modeEl.style.fontSize = "0.9em";
        modeEl.style.color = "var(--text-muted)";
        const clickToEdit = () => {
          try {
            const all = Array.isArray(this.plugin.settings.advancedRules) ? this.plugin.settings.advancedRules : [];
            const originalIndex = all.indexOf(entry);
            new AddRuleModal(this.app, this.plugin, () => {
              renderList();
            }, entry, originalIndex).open();
          } catch (e) {
          }
        };
        row.addEventListener("click", clickToEdit);
        this._handlers.push({ el: row, ev: "click", fn: clickToEdit });
        const duplicateHandler = async () => {
          try {
            const dup = JSON.parse(JSON.stringify(entry));
            if (!Array.isArray(this.plugin.settings.advancedRules)) this.plugin.settings.advancedRules = [];
            this.plugin.settings.advancedRules.push(dup);
            await this.plugin.saveSettings();
            renderList();
            new Notice(this.plugin.t("notice_entry_duplicated", "Entry duplicated"));
          } catch (e) {
            debugError("MANAGE_RULES", "duplicate entry error", e);
          }
        };
        const openInRegexTesterHandler = async () => {
          try {
            if (!entry.isRegex) return;
            const onAdded = () => {
              try {
                renderList();
              } catch (e) {
              }
            };
            const modal = new RealTimeRegexTesterModal(this.app, this.plugin, onAdded, entry);
            modal._preFillPattern = String(entry.text || "");
            modal._preFillFlags = String(entry.flags || "");
            debugLog("MANAGE_RULES", `Pre-filling regex tester: pattern="${modal._preFillPattern}", flags="${modal._preFillFlags}"`);
            modal.open();
          } catch (e) {
            debugError("MANAGE_RULES", "open in regex tester error", e);
          }
        };
        const contextMenuHandler = (ev) => {
          try {
            ev && ev.preventDefault && ev.preventDefault();
            if (ev && ev.stopPropagation) ev.stopPropagation();
            const menu = new Menu(this.app);
            menu.addItem((item) => {
              item.setTitle(this.plugin.t("duplicate_entry", "Duplicate Entry")).setIcon("copy").onClick(duplicateHandler);
            });
            if (entry.isRegex) {
              menu.addItem((item) => {
                item.setTitle(this.plugin.t("open_in_regex_tester", "Open in Regex Tester")).setIcon("pencil").onClick(openInRegexTesterHandler);
              });
            }
            menu.showAtPosition({ x: ev.clientX, y: ev.clientY });
          } catch (e) {
            debugError("MANAGE_RULES", "context menu error", e);
          }
        };
        row.addEventListener("contextmenu", contextMenuHandler);
        this._handlers.push({ el: row, ev: "contextmenu", fn: contextMenuHandler });
        const dragStart = (ev) => {
          this._drag.from = i;
          ev.dataTransfer?.setData("text/plain", "");
        };
        const dragOver = (ev) => {
          ev.preventDefault();
        };
        const drop = async (ev) => {
          ev.preventDefault();
          const from = this._drag.from;
          const to = i;
          if (from === -1 || to === -1 || from === to) return;
          const arr = this.plugin.settings.advancedRules;
          if (!Array.isArray(arr)) return;
          const [item] = arr.splice(from, 1);
          arr.splice(to, 0, item);
          await this.plugin.saveSettings();
          renderList();
        };
        row.addEventListener("dragstart", dragStart);
        row.addEventListener("dragover", dragOver);
        row.addEventListener("drop", drop);
        this._handlers.push({ el: row, ev: "dragstart", fn: dragStart });
        this._handlers.push({ el: row, ev: "dragover", fn: dragOver });
        this._handlers.push({ el: row, ev: "drop", fn: drop });
      });
      if (filtered.length === 0) {
        const q2 = String(this._filter.text || "").trim();
        list.createEl("p", { text: q2 ? this.plugin.t("no_rules_found", "No rules found.") : this.plugin.t("no_rules_configured", "No rules configured.") });
      }
    };
    renderList();
  }
  onClose() {
    try {
      this._handlers.forEach((h) => {
        try {
          h.el.removeEventListener(h.ev, h.fn);
        } catch (e) {
        }
      });
    } catch (e) {
    }
    this._handlers = [];
    try {
      this.contentEl.empty();
    } catch (e) {
    }
  }
};
var AddRuleModal = class extends Modal {
  constructor(app, plugin, onAdded, editRule = null, editIndex = -1) {
    super(app);
    this.plugin = plugin;
    this.onAdded = onAdded;
    this._editRule = editRule;
    this._editIndex = editIndex;
    this._handlers = [];
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    try {
      this.modalEl.style.maxWidth = "600px";
      this.modalEl.style.padding = "20px";
    } catch (e) {
    }
    const isEdit = this._editRule && typeof this._editIndex === "number" && this._editIndex >= 0;
    const title = contentEl.createEl("h2", { text: isEdit ? this.plugin.t("edit_rule_header", "Edit Rule") : this.plugin.t("add_rule_header", "Add New Rule") });
    title.style.marginTop = "0";
    title.style.marginBottom = "12px";
    const row1 = contentEl.createDiv();
    row1.style.display = "flex";
    row1.style.gap = "8px";
    const textInput = row1.createEl("input", { type: "text" });
    textInput.placeholder = this.plugin.t("text_or_regex_placeholder", "text / regex input");
    textInput.style.flex = "1";
    textInput.style.padding = "8px";
    textInput.style.border = "1px solid var(--background-modifier-border)";
    textInput.style.borderRadius = "6px";
    const flagsInput = row1.createEl("input", { type: "text" });
    flagsInput.placeholder = this.plugin.t("flags_placeholder", "flags");
    flagsInput.style.flex = "0 0 100px";
    flagsInput.style.padding = "8px";
    flagsInput.style.border = "1px solid var(--background-modifier-border)";
    flagsInput.style.borderRadius = "6px";
    const regexCheckbox = row1.createEl("input", { type: "checkbox" });
    regexCheckbox.style.flex = "0 0 auto";
    regexCheckbox.style.cursor = "pointer";
    regexCheckbox.title = this.plugin.t("tooltip_use_regex", "Use as regex pattern");
    const regexLabel = row1.createEl("label");
    regexLabel.appendChild(document.createTextNode(this.plugin.t("label_regex", "Regex")));
    regexLabel.style.flex = "0 0 auto";
    regexLabel.style.cursor = "pointer";
    regexLabel.style.userSelect = "none";
    regexLabel.style.fontSize = "0.9em";
    regexLabel.style.display = "none";
    regexLabel.onclick = () => {
      regexCheckbox.checked = !regexCheckbox.checked;
    };
    regexCheckbox.style.margin = "0";
    const modeSel = contentEl.createEl("select");
    modeSel.style.width = "100%";
    modeSel.style.marginTop = "8px";
    modeSel.style.padding = "8px";
    modeSel.style.border = "1px solid var(--background-modifier-border)";
    modeSel.style.borderRadius = "6px";
    modeSel.innerHTML = `<option value="include">${this.plugin.t("text_rule_mode_include", "only colors in (whitelist)")}</option><option value="exclude">${this.plugin.t("text_rule_mode_exclude", "does not color in (blacklist)")}</option>`;
    const pathInput = contentEl.createEl("input", { type: "text" });
    pathInput.placeholder = this.plugin.t("enter_path_or_pattern", "Enter path or pattern");
    pathInput.style.width = "100%";
    pathInput.style.marginTop = "8px";
    pathInput.style.padding = "8px";
    pathInput.style.border = "1px solid var(--background-modifier-border)";
    pathInput.style.borderRadius = "6px";
    const buildSuggestions = () => {
      const files = this.plugin.app.vault.getFiles();
      const folders = /* @__PURE__ */ new Set();
      const filePaths = [];
      files.forEach((f) => {
        const p = String(f.path).replace(/\\/g, "/");
        filePaths.push(p);
        const idx = p.lastIndexOf("/");
        const folder = idx !== -1 ? p.slice(0, idx) : "";
        if (folder) {
          const parts = folder.split("/");
          let acc = "";
          parts.forEach((part) => {
            acc = acc ? acc + "/" + part : part;
            folders.add(acc);
          });
        }
      });
      return { files: filePaths.sort(), folders: Array.from(folders).sort() };
    };
    const sugg = buildSuggestions();
    const updateDropdown = () => {
      if (pathInput._actDropdown) {
        const dd2 = pathInput._actDropdown;
        if (pathInput._dropdownScrollListener) {
          document.removeEventListener("scroll", pathInput._dropdownScrollListener, true);
          pathInput._dropdownScrollListener = null;
        }
        if (pathInput._dropdownClickListener) {
          document.removeEventListener("click", pathInput._dropdownClickListener);
          pathInput._dropdownClickListener = null;
        }
        if (pathInput._dropdownKeyListener) {
          document.removeEventListener("keydown", pathInput._dropdownKeyListener);
          pathInput._dropdownKeyListener = null;
        }
        dd2.remove();
        pathInput._actDropdown = null;
      }
      const val = String(pathInput.value || "").trim().toLowerCase();
      const list = [];
      sugg.folders.forEach((f) => list.push({ t: "folder", p: f }));
      sugg.files.forEach((f) => list.push({ t: "file", p: f }));
      const filtered = val ? list.filter((x) => x.p.toLowerCase().includes(val)) : list;
      if (filtered.length === 0) return;
      const dd = document.createElement("div");
      Object.assign(dd.style, { position: "fixed", zIndex: 2e3, background: "var(--background-primary)", color: "var(--text-normal)", border: "1px solid var(--background-modifier-border)", borderRadius: "6px", boxShadow: "0 6px 18px rgba(0,0,0,0.4)", maxHeight: "240px", overflowY: "auto", padding: "6px 0", minWidth: Math.max(240, pathInput.offsetWidth) + "px" });
      let hi = -1;
      filtered.forEach((item) => {
        const it = document.createElement("div");
        it.textContent = item.p || "/";
        Object.assign(it.style, { padding: "8px 12px", cursor: "pointer", whiteSpace: "nowrap" });
        it.onmouseenter = () => {
          if (hi >= 0 && dd.children[hi]) dd.children[hi].style.background = "transparent";
          it.style.background = "var(--background-secondary)";
          hi = Array.from(dd.children).indexOf(it);
        };
        it.onmouseleave = () => {
          it.style.background = "transparent";
        };
        it.onclick = (e) => {
          e.stopPropagation();
          pathInput.value = item.p + (item.t === "folder" ? "/" : "");
          const ev = new Event("change", { bubbles: true });
          pathInput.dispatchEvent(ev);
          dd.remove();
          pathInput._actDropdown = null;
        };
        dd.appendChild(it);
      });
      document.body.appendChild(dd);
      const pos = () => {
        const r = pathInput.getBoundingClientRect();
        dd.style.left = r.left + "px";
        dd.style.top = r.bottom + 6 + "px";
        dd.style.width = pathInput.offsetWidth + "px";
      };
      pos();
      pathInput._actDropdown = dd;
      pathInput._dropdownScrollListener = pos;
      pathInput._dropdownClickListener = (ev) => {
        if (ev.target === pathInput) return;
        if (!dd.contains(ev.target)) {
          dd.remove();
          pathInput._actDropdown = null;
          document.removeEventListener("click", pathInput._dropdownClickListener);
          document.removeEventListener("scroll", pathInput._dropdownScrollListener, true);
          document.removeEventListener("keydown", pathInput._dropdownKeyListener);
          pathInput._dropdownClickListener = null;
          pathInput._dropdownScrollListener = null;
          pathInput._dropdownKeyListener = null;
        }
      };
      pathInput._dropdownKeyListener = (ev) => {
        const items = Array.from(dd.children);
        if (items.length === 0) return;
        if (ev.key === "ArrowDown") {
          ev.preventDefault();
          hi = Math.min(hi + 1, items.length - 1);
          items.forEach((item) => item.style.background = "transparent");
          if (hi >= 0) {
            items[hi].style.background = "var(--background-secondary)";
            items[hi].scrollIntoView({ block: "nearest" });
          }
        } else if (ev.key === "ArrowUp") {
          ev.preventDefault();
          hi = Math.max(hi - 1, -1);
          items.forEach((item) => item.style.background = "transparent");
          if (hi >= 0) {
            items[hi].style.background = "var(--background-secondary)";
            items[hi].scrollIntoView({ block: "nearest" });
          }
        } else if (ev.key === "Enter" && hi >= 0) {
          ev.preventDefault();
          items[hi].click();
        } else if (ev.key === "Escape") {
          ev.preventDefault();
          dd.remove();
          pathInput._actDropdown = null;
          document.removeEventListener("keydown", pathInput._dropdownKeyListener);
          pathInput._dropdownKeyListener = null;
        }
      };
      document.addEventListener("scroll", pos, true);
      document.addEventListener("click", pathInput._dropdownClickListener);
      document.addEventListener("keydown", pathInput._dropdownKeyListener);
    };
    const focusHandler = () => {
      updateDropdown();
    };
    const clickHandler = () => {
      updateDropdown();
    };
    const inputHandler = () => {
      updateDropdown();
    };
    pathInput.addEventListener("focus", focusHandler);
    pathInput.addEventListener("click", clickHandler);
    pathInput.addEventListener("input", inputHandler);
    this._handlers.push({ el: pathInput, ev: "focus", fn: focusHandler });
    this._handlers.push({ el: pathInput, ev: "click", fn: clickHandler });
    this._handlers.push({ el: pathInput, ev: "input", fn: inputHandler });
    if (isEdit) {
      try {
        textInput.value = String(this._editRule.text || "");
        flagsInput.value = String(this._editRule.flags || "");
        regexCheckbox.checked = !!this._editRule.isRegex;
        modeSel.value = this._editRule.mode === "exclude" ? "exclude" : "include";
        pathInput.value = String(this._editRule.path || "");
      } catch (e) {
      }
    }
    const actions = contentEl.createDiv();
    actions.style.display = "flex";
    actions.style.justifyContent = "space-between";
    actions.style.alignItems = "center";
    actions.style.marginTop = "10px";
    let deleteBtn = null;
    if (isEdit) {
      deleteBtn = actions.createEl("button", { text: this.plugin.t("btn_delete_rule", "Delete Rule") });
      deleteBtn.classList.add("mod-warning");
      deleteBtn.style.marginRight = "auto";
    }
    const addBtn = actions.createEl("button", { text: isEdit ? this.plugin.t("btn_save_rule", "Save Rule") : this.plugin.t("btn_add_rule", "+ Add Rule") });
    addBtn.addClass("mod-cta");
    const addHandler = async () => {
      const text = String(textInput.value || "").trim();
      const flagsRaw = String(flagsInput.value || "").trim();
      const flags = flagsRaw.replace(/[^gimsuy]/g, "");
      const path = String(pathInput.value || "").trim().replace(/\\/g, "/");
      const mode = modeSel.value === "exclude" ? "exclude" : "include";
      const isRegex = regexCheckbox.checked;
      if (!Array.isArray(this.plugin.settings.advancedRules)) this.plugin.settings.advancedRules = [];
      const updated = { text, flags, isRegex, mode, path };
      if (isEdit && this._editIndex >= 0) {
        this.plugin.settings.advancedRules[this._editIndex] = updated;
      } else {
        this.plugin.settings.advancedRules.push(updated);
      }
      await this.plugin.saveSettings();
      try {
        this.onAdded && this.onAdded();
      } catch (e) {
      }
      this.close();
    };
    addBtn.addEventListener("click", addHandler);
    this._handlers.push({ el: addBtn, ev: "click", fn: addHandler });
    if (deleteBtn && isEdit && this._editIndex >= 0) {
      const deleteHandler = async () => {
        if (!Array.isArray(this.plugin.settings.advancedRules)) return;
        this.plugin.settings.advancedRules.splice(this._editIndex, 1);
        await this.plugin.saveSettings();
        try {
          this.onAdded && this.onAdded();
        } catch (e) {
        }
        this.close();
      };
      deleteBtn.addEventListener("click", deleteHandler);
      this._handlers.push({ el: deleteBtn, ev: "click", fn: deleteHandler });
    }
  }
  onClose() {
    try {
      this._handlers.forEach((h) => {
        try {
          h.el.removeEventListener(h.ev, h.fn);
        } catch (e) {
        }
      });
    } catch (e) {
    }
    this._handlers = [];
    try {
      this.contentEl.empty();
    } catch (e) {
    }
  }
};
var ColorSettingTab = class extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.debouncedSaveSettings = debounce(this.plugin.saveSettings.bind(this.plugin), 800);
    this._lastRerender = 0;
    this._cleanupHandlers = [];
    this._entryRows = /* @__PURE__ */ new Map();
    this._suspendSorting = false;
    this._newEntriesSet = /* @__PURE__ */ new Set();
    this._blacklistNewSet = /* @__PURE__ */ new Set();
    this._dynamicHandlers = [];
    this._cachedFolderSuggestions = null;
    this._pathRulesContainer = null;
    this._disabledFilesContainer = null;
    this._blacklistWordsContainer = null;
    this._customSwatchesContainer = null;
    this._wordsSortMode = this.plugin.settings && this.plugin.settings.wordsSortMode ? this.plugin.settings.wordsSortMode : "last-added";
    this._textBgSortMode = "last-added";
    this._blacklistSortMode = this.plugin.settings && this.plugin.settings.blacklistSortMode ? this.plugin.settings.blacklistSortMode : "last-added";
    this._pathSortMode = this.plugin.settings && this.plugin.settings.pathSortMode ? this.plugin.settings.pathSortMode : "last-added";
    this._defaultColorsFolded = true;
    this._customSwatchesFolded = this.plugin.settings && typeof this.plugin.settings.customSwatchesFolded !== "undefined" ? !!this.plugin.settings.customSwatchesFolded : false;
    this._filterMode = null;
  }
  // Create a settings row for a single entry and track cleanup
  _createEntryRow(entry, listDiv) {
    try {
      if (!entry.uid) {
        try {
          entry.uid = Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          entry.uid = Date.now();
        }
      }
      const row = listDiv.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";
      const styleSelect = row.createEl("select");
      styleSelect.style.padding = "6px";
      styleSelect.style.borderRadius = "4px";
      styleSelect.style.border = "1px solid var(--background-modifier-border)";
      styleSelect.style.background = "var(--background-modifier-form-field)";
      styleSelect.style.color = "var(--text-normal)";
      styleSelect.style.flex = "0 0 auto";
      styleSelect.style.maxWidth = "80px";
      styleSelect.style.width = "stretch";
      styleSelect.style.minWidth = "60px";
      styleSelect.style.textAlign = "center";
      try {
        styleSelect.addClass("act-style-select");
      } catch (e) {
        try {
          styleSelect.classList.add("act-style-select");
        } catch (_) {
        }
      }
      styleSelect.innerHTML = `<option value="text">${this.plugin.t("style_type_text", "color")}</option><option value="highlight">${this.plugin.t("style_type_highlight", "highlight")}</option><option value="both">${this.plugin.t("style_type_both", "both")}</option>`;
      let nameInput = null;
      if (entry.isRegex) {
        nameInput = row.createEl("input", { type: "text", value: String(entry.presetLabel || "") });
        nameInput.style.flex = "0 0 60px";
        nameInput.style.padding = "6px";
        nameInput.style.borderRadius = "4px";
        nameInput.style.border = "1px solid var(--background-modifier-border)";
        nameInput.placeholder = this.plugin.t("regex_name_placeholder", "name your regex");
        try {
          nameInput.addClass("act-regex-name");
        } catch (e) {
        }
      }
      const displayPatterns = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns.join(", ") : entry.pattern;
      const textInput = row.createEl("input", { type: "text", value: displayPatterns });
      textInput.style.flex = "1";
      textInput.style.minWidth = "100px";
      textInput.style.padding = "6px";
      textInput.style.borderRadius = "4px";
      textInput.style.border = "1px solid var(--background-modifier-border)";
      textInput.placeholder = this.plugin.t("word_pattern_placeholder_long", "pattern, word or comma-separated words (e.g. hello, world, foo)");
      const regexChk = row.createEl("input", { type: "checkbox" });
      regexChk.checked = !!entry.isRegex;
      regexChk.title = this.plugin.t("use_regex", "Use Regex");
      regexChk.style.cursor = "pointer";
      regexChk.style.flex = "0 0 auto";
      const regexLabel = row.createEl("label");
      regexLabel.appendChild(document.createTextNode(this.plugin.t("label_regex", "Regex")));
      regexLabel.style.flex = "0 0 auto";
      regexLabel.style.cursor = "pointer";
      regexLabel.style.userSelect = "none";
      regexLabel.style.fontSize = "0.9em";
      regexLabel.onclick = () => {
        regexChk.checked = !regexChk.checked;
      };
      regexChk.style.margin = "0";
      regexLabel.style.display = "none";
      const flagsInput = row.createEl("input", { type: "text", value: entry.flags || "" });
      flagsInput.placeholder = this.plugin.t("flags_placeholder", "flags");
      flagsInput.style.width = "64px";
      flagsInput.style.padding = "6px";
      flagsInput.style.borderRadius = "4px";
      flagsInput.style.border = "1px solid var(--background-modifier-border)";
      flagsInput.style.flex = "0 0 auto";
      const swatchesArr = Array.isArray(this.plugin.settings.swatches) ? this.plugin.settings.swatches : [];
      const cp = row.createEl("input", { type: "color" });
      cp.title = this.plugin.t("text_color_title", "Text color");
      cp.value = entry.color || "#000000";
      cp.style.width = "30px";
      cp.style.height = "30px";
      cp.style.border = "none";
      cp.style.borderRadius = "4px";
      cp.style.cursor = "pointer";
      cp.style.flex = "0 0 auto";
      let swatchSelect = null;
      if (this.plugin.settings.useSwatchNamesForText && swatchesArr.length > 0) {
        swatchSelect = row.createEl("select");
        swatchSelect.style.padding = "6px";
        swatchSelect.style.borderRadius = "4px";
        swatchSelect.style.border = "1px solid var(--background-modifier-border)";
        swatchSelect.style.background = "var(--background-modifier-form-field)";
        swatchSelect.style.color = "var(--text-normal)";
        swatchSelect.style.flex = "0 0 auto";
        swatchSelect.style.textAlign = "center";
        const defaultOpt = swatchSelect.createEl("option", { text: this.plugin.t("select_swatch", "Select swatch\u2026") });
        defaultOpt.value = "";
        swatchesArr.forEach((sw) => {
          const opt = swatchSelect.createEl("option", { text: sw.name || "" });
          opt.value = sw.name || "";
          if (sw.color && (entry.color || "").toLowerCase() === sw.color.toLowerCase()) {
            swatchSelect.value = opt.value;
          }
        });
      }
      const cpBg = row.createEl("input", { type: "color" });
      cpBg.title = this.plugin.t("highlight_color_title", "Highlight color");
      cpBg.value = entry.backgroundColor || "#000000";
      cpBg.style.width = "30px";
      cpBg.style.height = "30px";
      cpBg.style.border = "none";
      cpBg.style.borderRadius = "4px";
      cpBg.style.cursor = "pointer";
      cpBg.style.flex = "0 0 auto";
      let swatchSelect2 = null;
      if (this.plugin.settings.useSwatchNamesForText && swatchesArr.length > 0) {
        swatchSelect2 = row.createEl("select");
        swatchSelect2.style.padding = "6px";
        swatchSelect2.style.borderRadius = "4px";
        swatchSelect2.style.border = "1px solid var(--background-modifier-border)";
        swatchSelect2.style.background = "var(--background-modifier-form-field)";
        swatchSelect2.style.color = "var(--text-normal)";
        swatchSelect2.style.flex = "0 0 auto";
        swatchSelect2.style.textAlign = "center";
        const defaultOpt2 = swatchSelect2.createEl("option", { text: this.plugin.t("select_highlight_swatch", "Select highlight swatch\u2026") });
        defaultOpt2.value = "";
        swatchesArr.forEach((sw) => {
          const opt = swatchSelect2.createEl("option", { text: sw.name || "" });
          opt.value = sw.name || "";
        });
      }
      const del = row.createEl("button", { text: "\u2715" });
      del.addClass("mod-warning");
      del.style.padding = "4px 8px";
      del.style.borderRadius = "4px";
      del.style.cursor = "pointer";
      del.style.flex = "0 0 auto";
      const initBgEntry = entry;
      const initialStyle = initBgEntry && initBgEntry.styleType ? initBgEntry.styleType : null;
      if (initialStyle) {
        styleSelect.value = initialStyle;
      } else if (initBgEntry && (initBgEntry.backgroundColor || initBgEntry.textColor)) {
        const hasText = !!(initBgEntry.textColor && initBgEntry.textColor !== "currentColor");
        const hasBg = !!initBgEntry.backgroundColor;
        styleSelect.value = hasText && hasBg ? "both" : hasBg ? "highlight" : "text";
      } else {
        styleSelect.value = "text";
      }
      if (initBgEntry && initBgEntry.textColor && initBgEntry.textColor !== "currentColor") cp.value = initBgEntry.textColor;
      if (initBgEntry && initBgEntry.backgroundColor) cpBg.value = initBgEntry.backgroundColor;
      flagsInput.style.display = entry.isRegex ? "" : "none";
      const updateInputDisplay = () => {
        if (entry.isRegex) {
          textInput.value = entry.pattern || "";
        } else {
          const patterns = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns : entry.pattern ? [entry.pattern] : [];
          textInput.value = patterns.map((p) => String(p).trim()).join(", ");
        }
      };
      const resolveIdx = () => {
        if (entry && entry.uid) {
          const byUid = this.plugin.settings.wordEntries.findIndex((e) => e && e.uid === entry.uid);
          if (byUid !== -1) return byUid;
        }
        let idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx !== -1) return idx;
        const curr = String(textInput.value || "");
        if (!curr) return -1;
        const found = this.plugin.settings.wordEntries.findIndex((e) => {
          const pats = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : [String(e.pattern || "")];
          const joined = pats.map((p) => String(p).trim()).join(", ");
          return joined === curr;
        });
        return found;
      };
      const textInputHandler = async () => {
        try {
          const newPattern = textInput.value;
          const idx = resolveIdx();
          if (idx === -1) return;
          if (!newPattern) {
            this.plugin.settings.wordEntries.splice(idx, 1);
          } else if (this.plugin.settings.enableRegexSupport && entry.isRegex && !this.plugin.settings.disableRegexSafety && this.plugin.isRegexTooComplex(newPattern)) {
            new Notice(this.plugin.t("notice_pattern_too_complex", "Pattern too complex: " + newPattern.substring(0, 60) + "..."));
            updateInputDisplay();
            return;
          } else {
            if (entry.isRegex) {
              this.plugin.settings.wordEntries[idx].pattern = newPattern;
              this.plugin.settings.wordEntries[idx].groupedPatterns = null;
              entry.pattern = newPattern;
              entry.groupedPatterns = null;
            } else {
              const patterns = newPattern.split(",").map((p) => String(p).trim()).filter((p) => p.length > 0);
              this.plugin.settings.wordEntries[idx].pattern = patterns[0];
              this.plugin.settings.wordEntries[idx].groupedPatterns = patterns.length > 1 ? patterns : null;
              entry.pattern = this.plugin.settings.wordEntries[idx].pattern;
              entry.groupedPatterns = this.plugin.settings.wordEntries[idx].groupedPatterns;
            }
          }
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this.plugin.triggerActiveDocumentRerender();
          this._suspendSorting = this._wordsSortMode !== "last-added";
          this._refreshEntries();
        } catch (error) {
          debugError("SETTINGS", "Error saving word entry", error);
          new Notice(this.plugin.t("notice_error_saving_changes", "Error saving changes. Please try again."));
        }
      };
      const duplicateHandler = async () => {
        try {
          const idx = resolveIdx();
          if (idx === -1) return;
          const orig = this.plugin.settings.wordEntries[idx];
          const dup = Object.assign({}, orig);
          try {
            dup.uid = Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (e) {
            dup.uid = Date.now();
          }
          this.plugin.settings.wordEntries.splice(idx + 1, 0, dup);
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this._suspendSorting = this._wordsSortMode !== "last-added";
          this._refreshEntries();
        } catch (e) {
          debugError("SETTINGS", "duplicate entry error", e);
        }
      };
      const openInRegexTesterHandler = async () => {
        try {
          if (!entry.isRegex) return;
          const onAdded = () => {
            try {
              this._refreshEntries();
            } catch (e) {
            }
          };
          const modal = new RealTimeRegexTesterModal(this.app, this.plugin, onAdded);
          modal._editingEntry = entry;
          if (entry.pattern) modal._preFillPattern = entry.pattern;
          if (entry.flags) modal._preFillFlags = entry.flags;
          if (entry.presetLabel) modal._preFillName = entry.presetLabel;
          if (entry.styleType) modal._preFillStyleType = entry.styleType;
          if (entry.textColor) modal._preFillTextColor = entry.textColor;
          if (entry.backgroundColor) modal._preFillBgColor = entry.backgroundColor;
          if (entry.color) modal._preFillTextColor = entry.color;
          modal.open();
        } catch (e) {
          debugError("SETTINGS", "open in regex tester error", e);
        }
      };
      const resetTextColorHandler = async () => {
        try {
          const idx = resolveIdx();
          if (idx !== -1) {
            const entry2 = this.plugin.settings.wordEntries[idx];
            entry2.textColor = null;
            entry2.color = "";
            if (entry2.backgroundColor) {
              entry2.styleType = "highlight";
            } else {
              entry2.styleType = "text";
            }
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.compileTextBgColoringEntries();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            this.plugin.forceRefreshAllReadingViews();
            this._refreshEntries();
            new Notice(this.plugin.t("notice_text_color_reset", "Text color reset"));
          }
        } catch (e) {
          debugError("SETTINGS", "reset text color error", e);
        }
      };
      const resetHighlightHandler = async () => {
        try {
          const idx = resolveIdx();
          if (idx !== -1) {
            const entry2 = this.plugin.settings.wordEntries[idx];
            entry2.backgroundColor = null;
            if (entry2.textColor || entry2.color) {
              entry2.styleType = "text";
            } else {
              entry2.styleType = "text";
            }
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.compileTextBgColoringEntries();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            this.plugin.forceRefreshAllReadingViews();
            this._refreshEntries();
            new Notice(this.plugin.t("notice_highlight_reset", "Highlight color reset"));
          }
        } catch (e) {
          debugError("SETTINGS", "reset highlight error", e);
        }
      };
      const contextMenuHandler = (ev) => {
        try {
          ev && ev.preventDefault && ev.preventDefault();
          if (ev && ev.stopPropagation) ev.stopPropagation();
          const menu = new Menu(this.app);
          menu.addItem((item) => {
            item.setTitle(this.plugin.t("duplicate_entry", "Duplicate Entry")).setIcon("copy").onClick(duplicateHandler);
          });
          menu.addItem((item) => {
            item.setTitle(this.plugin.t("reset_text_color", "Reset Text Color")).setIcon("text").onClick(resetTextColorHandler);
          });
          menu.addItem((item) => {
            item.setTitle(this.plugin.t("reset_highlight", "Reset Highlight")).setIcon("rectangle-horizontal").onClick(resetHighlightHandler);
          });
          if (entry.isRegex) {
            menu.addItem((item) => {
              item.setTitle(this.plugin.t("open_in_regex_tester", "Open in Regex Tester")).setIcon("pencil").onClick(openInRegexTesterHandler);
            });
          }
          menu.showAtPosition({ x: ev.clientX, y: ev.clientY });
        } catch (e) {
          debugError("SETTINGS", "context menu error", e);
        }
      };
      const cpHandler = async () => {
        const newColor = cp.value;
        if (!this.plugin.isValidHexColor(newColor)) {
          new Notice(this.plugin.t("notice_invalid_color_format", "Invalid color format."));
          return;
        }
        const idx = resolveIdx();
        if (idx !== -1) {
          const hasBg = !!this.plugin.settings.wordEntries[idx].backgroundColor;
          if (hasBg) {
            this.plugin.settings.wordEntries[idx].textColor = newColor;
            this.plugin.settings.wordEntries[idx].color = "";
            this.plugin.settings.wordEntries[idx].styleType = "both";
            this.plugin.settings.wordEntries[idx]._savedTextColor = newColor;
          } else {
            this.plugin.settings.wordEntries[idx].color = newColor;
            this.plugin.settings.wordEntries[idx].textColor = null;
            this.plugin.settings.wordEntries[idx].backgroundColor = null;
            this.plugin.settings.wordEntries[idx].styleType = "text";
            this.plugin.settings.wordEntries[idx]._savedTextColor = newColor;
          }
          styleSelect.value = this.plugin.settings.wordEntries[idx].styleType || "text";
        }
        if (swatchSelect) {
          try {
            const match = (Array.isArray(this.plugin.settings.swatches) ? this.plugin.settings.swatches : []).find((sw) => sw.color && sw.color.toLowerCase() === newColor.toLowerCase());
            swatchSelect.value = match ? match.name || "" : "";
          } catch (e) {
          }
        }
        await this.debouncedSaveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };
      const cpBgHandler = async () => {
        const newColor = cpBg.value;
        if (!this.plugin.isValidHexColor(newColor)) return;
        const idx = resolveIdx();
        if (idx !== -1) {
          this.plugin.settings.wordEntries[idx].backgroundColor = newColor;
          if (!this.plugin.settings.wordEntries[idx].textColor || this.plugin.settings.wordEntries[idx].textColor === "currentColor") {
            this.plugin.settings.wordEntries[idx].textColor = "currentColor";
          }
          this.plugin.settings.wordEntries[idx].color = "";
          this.plugin.settings.wordEntries[idx]._savedBackgroundColor = newColor;
          const hasText = !!(this.plugin.settings.wordEntries[idx].textColor && this.plugin.settings.wordEntries[idx].textColor !== "currentColor");
          const hasBg = !!this.plugin.settings.wordEntries[idx].backgroundColor;
          if (hasText && hasBg) {
            this.plugin.settings.wordEntries[idx].styleType = "both";
          } else if (hasBg) {
            this.plugin.settings.wordEntries[idx].styleType = "highlight";
          } else {
            this.plugin.settings.wordEntries[idx].styleType = "text";
          }
          styleSelect.value = this.plugin.settings.wordEntries[idx].styleType || "text";
        }
        if (swatchSelect2) {
          try {
            const match = (Array.isArray(this.plugin.settings.swatches) ? this.plugin.settings.swatches : []).find((sw) => sw.color && sw.color.toLowerCase() === newColor.toLowerCase());
            swatchSelect2.value = match ? match.name || "" : "";
          } catch (e) {
          }
        }
        await this.debouncedSaveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
      };
      const regexChkHandler = async () => {
        const idx = resolveIdx();
        if (idx !== -1) this.plugin.settings.wordEntries[idx].isRegex = regexChk.checked;
        flagsInput.style.display = regexChk.checked ? "" : "none";
        if (regexChk.checked && !this.plugin.settings.enableRegexSupport) {
          new Notice(this.plugin.t("notice_regex_support_disabled", "Regex support is disabled. Enable it in settings to use regex patterns."));
        }
        await this.plugin.saveSettings();
        this.plugin.compileWordEntries();
        this.plugin.compileTextBgColoringEntries();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        entry.isRegex = regexChk.checked;
        this._refreshEntries();
      };
      const flagsInputHandler = async () => {
        const idx = resolveIdx();
        if (idx !== -1) this.plugin.settings.wordEntries[idx].flags = flagsInput.value || "";
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        entry.flags = flagsInput.value || "";
        this._refreshEntries();
      };
      const delHandler = async () => {
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx !== -1) this.plugin.settings.wordEntries.splice(idx, 1);
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        const info = this._entryRows.get(entry);
        if (info) {
          try {
            info.cleanup();
          } catch (e) {
          }
          this._entryRows.delete(entry);
        }
        this._refreshEntries();
      };
      textInput.addEventListener("change", textInputHandler);
      textInput.addEventListener("blur", textInputHandler);
      row.addEventListener("contextmenu", contextMenuHandler);
      cp.addEventListener("input", cpHandler);
      cpBg.addEventListener("input", cpBgHandler);
      regexChk.addEventListener("change", regexChkHandler);
      flagsInput.addEventListener("change", flagsInputHandler);
      del.addEventListener("click", delHandler);
      const nameInputHandler = async () => {
        if (!nameInput) return;
        const idx = resolveIdx();
        if (idx !== -1) {
          const val = String(nameInput.value || "").trim();
          this.plugin.settings.wordEntries[idx].presetLabel = val || void 0;
          entry.presetLabel = val || void 0;
          await this.plugin.saveSettings();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
        }
      };
      if (nameInput) {
        nameInput.addEventListener("change", nameInputHandler);
        nameInput.addEventListener("blur", nameInputHandler);
      }
      const swatchSelectHandler = async () => {
        if (!swatchSelect) return;
        const chosen = (Array.isArray(this.plugin.settings.swatches) ? this.plugin.settings.swatches : []).find((sw) => (sw.name || "") === swatchSelect.value);
        if (!chosen) return;
        const c = chosen.color;
        if (!this.plugin.isValidHexColor(c)) return;
        cp.value = c;
        await cpHandler();
      };
      if (swatchSelect) {
        swatchSelect.addEventListener("change", swatchSelectHandler);
      }
      const swatchSelect2Handler = async () => {
        if (!swatchSelect2) return;
        const chosen = (Array.isArray(this.plugin.settings.swatches) ? this.plugin.settings.swatches : []).find((sw) => (sw.name || "") === swatchSelect2.value);
        if (!chosen) return;
        const c = chosen.color;
        if (!this.plugin.isValidHexColor(c)) return;
        cpBg.value = c;
        await cpBgHandler();
      };
      if (swatchSelect2) {
        swatchSelect2.addEventListener("change", swatchSelect2Handler);
      }
      const updateVisibility = () => {
        const style = styleSelect.value;
        if (style === "text") {
          cp.style.display = "";
          if (swatchSelect) swatchSelect.style.display = "";
          cpBg.style.display = "none";
          if (swatchSelect2) swatchSelect2.style.display = "none";
          flagsInput.style.display = entry.isRegex ? "" : "none";
          if (nameInput) nameInput.style.display = entry.isRegex ? "" : "none";
          try {
            const val = entry.color || (entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : entry.backgroundColor || "") || cp.value;
            if (val && this.plugin.isValidHexColor(val)) cp.value = val;
          } catch (e) {
          }
        } else if (style === "highlight") {
          cp.style.display = "none";
          if (swatchSelect) swatchSelect.style.display = "none";
          cpBg.style.display = "";
          if (swatchSelect2) swatchSelect2.style.display = "";
          flagsInput.style.display = entry.isRegex ? "" : "none";
          if (nameInput) nameInput.style.display = entry.isRegex ? "" : "none";
          try {
            const val = entry.backgroundColor || (entry.color || (entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : "")) || cpBg.value;
            if (val && this.plugin.isValidHexColor(val)) cpBg.value = val;
          } catch (e) {
          }
        } else {
          cp.style.display = "";
          if (swatchSelect) swatchSelect.style.display = "";
          cpBg.style.display = "";
          if (swatchSelect2) swatchSelect2.style.display = "";
          flagsInput.style.display = entry.isRegex ? "" : "none";
          if (nameInput) nameInput.style.display = entry.isRegex ? "" : "none";
          try {
            const t = entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : entry.color || "";
            const b = entry.backgroundColor || "";
            if (t && this.plugin.isValidHexColor(t)) cp.value = t;
            if (b && this.plugin.isValidHexColor(b)) cpBg.value = b;
          } catch (e) {
          }
        }
      };
      updateVisibility();
      const styleChangeHandler = async () => {
        const idx = this.plugin.settings.wordEntries.indexOf(entry);
        if (idx !== -1) {
          const curr = this.plugin.settings.wordEntries[idx];
          const prevStyle = curr.styleType || "text";
          const nextStyle = styleSelect.value;
          if (prevStyle !== nextStyle) {
            if (nextStyle === "text") {
              if (curr.textColor && curr.textColor !== "currentColor") curr._savedTextColor = curr.textColor;
              if (curr.color) curr._savedTextColor = curr.color;
              if (curr.backgroundColor) curr._savedBackgroundColor = curr.backgroundColor;
              const textOnly = curr._savedTextColor || (curr.textColor && curr.textColor !== "currentColor" ? curr.textColor : this.plugin.isValidHexColor(curr.color) ? curr.color : "");
              curr.color = textOnly || curr.color || "";
              curr.textColor = null;
              curr.backgroundColor = null;
            } else if (nextStyle === "highlight") {
              if (curr.textColor && curr.textColor !== "currentColor") curr._savedTextColor = curr.textColor;
              if (curr.color) curr._savedTextColor = curr.color;
              if (curr.backgroundColor) curr._savedBackgroundColor = curr.backgroundColor;
              const bgOnly = curr._savedBackgroundColor || curr.backgroundColor || curr._savedTextColor || (this.plugin.isValidHexColor(curr.color) ? curr.color : null);
              curr.backgroundColor = bgOnly;
              curr.textColor = "currentColor";
              curr.color = "";
            } else {
              const textBase = curr._savedTextColor || (curr.textColor && curr.textColor !== "currentColor" ? curr.textColor : null) || (curr.color || null);
              const bgBase = curr._savedBackgroundColor || (curr.backgroundColor || null);
              if (textBase) curr.textColor = textBase;
              if (bgBase) curr.backgroundColor = bgBase;
              curr.color = "";
            }
          }
          curr.styleType = nextStyle;
          await this.plugin.saveSettings();
        }
        updateVisibility();
        try {
          const t = entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : entry.color || "";
          const b = entry.backgroundColor || "";
          if (t && this.plugin.isValidHexColor(t)) cp.value = t;
          if (b && this.plugin.isValidHexColor(b)) cpBg.value = b;
        } catch (e) {
        }
      };
      styleSelect.addEventListener("change", styleChangeHandler);
      const cleanup = () => {
        try {
          textInput.removeEventListener("change", textInputHandler);
        } catch (e) {
        }
        try {
          textInput.removeEventListener("blur", textInputHandler);
        } catch (e) {
        }
        try {
          row.removeEventListener("contextmenu", contextMenuHandler);
        } catch (e) {
        }
        try {
          cp.removeEventListener("input", cpHandler);
        } catch (e) {
        }
        try {
          cpBg.removeEventListener("input", cpBgHandler);
        } catch (e) {
        }
        try {
          regexChk.removeEventListener("change", regexChkHandler);
        } catch (e) {
        }
        try {
          flagsInput.removeEventListener("change", flagsInputHandler);
        } catch (e) {
        }
        try {
          del.removeEventListener("click", delHandler);
        } catch (e) {
        }
        try {
          if (swatchSelect) swatchSelect.removeEventListener("change", swatchSelectHandler);
        } catch (e) {
        }
        try {
          if (swatchSelect2) swatchSelect2.removeEventListener("change", swatchSelect2Handler);
        } catch (e) {
        }
        try {
          styleSelect.removeEventListener("change", styleChangeHandler);
        } catch (e) {
        }
        try {
          row.remove();
        } catch (e) {
        }
      };
      this._entryRows.set(entry, { row, elements: { nameInput, textInput, styleSelect, cp, cpBg, regexChk, flagsInput, del }, cleanup });
      this._cleanupHandlers.push(cleanup);
    } catch (e) {
      debugError("SETTINGS", "_createEntryRow error", e);
    }
  }
  _refreshDisabledFiles() {
    try {
      if (!this._disabledFilesContainer) return;
      this._disabledFilesContainer.empty();
      if (this.plugin.settings.disabledFiles.length > 0) {
        const h4 = this._disabledFilesContainer.createEl("h5", { text: this.plugin.t("disabled_files_header", "Files with coloring disabled:") });
        h4.style.margin = "-10px 0 8px 0";
        this.plugin.settings.disabledFiles.forEach((filePath) => {
          new Setting(this._disabledFilesContainer).setName(filePath).addExtraButton((btn) => btn.setIcon("x").setTooltip(this.plugin.t("tooltip_enable_for_file", "Enable for this file")).onClick(async () => {
            const index = this.plugin.settings.disabledFiles.indexOf(filePath);
            if (index > -1) {
              this.plugin.settings.disabledFiles.splice(index, 1);
            }
            await this.plugin.saveSettings();
            this._refreshDisabledFiles();
          }));
        });
      }
    } catch (e) {
      debugError("SETTINGS", "_refreshDisabledFiles error", e);
    }
  }
  _refreshBlacklistWords() {
    try {
      if (!this._blacklistWordsContainer) return;
      this._blacklistWordsContainer.empty();
      let entries = Array.isArray(this.plugin.settings.blacklistEntries) ? [...this.plugin.settings.blacklistEntries] : [];
      const q = String(this._blacklistSearchQuery || "").trim().toLowerCase();
      if (q) {
        entries = entries.filter((e) => {
          const patterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : [String(e.pattern || "")];
          const text = [
            ...patterns.map((p) => p.toLowerCase()),
            String(e.presetLabel || "").toLowerCase(),
            String(e.flags || "").toLowerCase()
          ].join(" ");
          return text.includes(q);
        });
      }
      if (this._blacklistSortMode === "a-z") {
        entries.sort((a, b) => {
          const aPat = Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0 ? a.groupedPatterns[0] : a.pattern || "";
          const bPat = Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0 ? b.groupedPatterns[0] : b.pattern || "";
          const aEmpty = String(aPat).trim().length === 0;
          const bEmpty = String(bPat).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          return String(aPat).toLowerCase().localeCompare(String(bPat).toLowerCase());
        });
      } else if (this._blacklistSortMode === "reverse-a-z") {
        entries.sort((a, b) => {
          const aPat = Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0 ? a.groupedPatterns[0] : a.pattern || "";
          const bPat = Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0 ? b.groupedPatterns[0] : b.pattern || "";
          const aEmpty = String(aPat).trim().length === 0;
          const bEmpty = String(bPat).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          return String(bPat).toLowerCase().localeCompare(String(aPat).toLowerCase());
        });
      }
      if (this._blacklistNewSet && this._blacklistNewSet.size > 0) {
        const newList = [];
        const baseOrder = Array.isArray(this.plugin.settings.blacklistEntries) ? [...this.plugin.settings.blacklistEntries] : [];
        baseOrder.forEach((e) => {
          if (e && e.uid && this._blacklistNewSet.has(e.uid)) newList.push(e);
        });
        const oldList = entries.filter((e) => !(e && e.uid && this._blacklistNewSet.has(e.uid)));
        entries = [...oldList, ...newList];
      }
      entries.forEach((entry) => {
        const row = this._blacklistWordsContainer.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.marginBottom = "8px";
        row.style.gap = "8px";
        const displayPatterns = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns.join(", ") : entry.pattern || "";
        if (entry.presetLabel) {
          const badge = row.createEl("span", { text: entry.presetLabel });
          badge.style.marginRight = "8px";
          badge.style.opacity = "0.7";
        }
        const textInput = row.createEl("input", { type: "text", value: displayPatterns });
        textInput.style.flex = "1";
        textInput.style.padding = "6px";
        textInput.style.borderRadius = "4px";
        textInput.style.border = "1px solid var(--background-modifier-border)";
        textInput.placeholder = this.plugin.t("word_pattern_placeholder_short", "Keyword or pattern, or comma-separated words");
        const regexChk = row.createEl("input", { type: "checkbox" });
        regexChk.checked = !!entry.isRegex;
        regexChk.title = this.plugin.t("use_regex", "Use Regex");
        regexChk.style.cursor = "pointer";
        const flagsInput = row.createEl("input", { type: "text", value: entry.flags || "" });
        flagsInput.placeholder = this.plugin.t("flags_placeholder", "flags");
        flagsInput.style.width = "50px";
        flagsInput.style.padding = "6px";
        flagsInput.style.borderRadius = "4px";
        flagsInput.style.border = "1px solid var(--background-modifier-border)";
        if (!entry.isRegex) flagsInput.style.display = "none";
        const del = row.createEl("button", { text: "\u2715" });
        del.addClass("mod-warning");
        del.style.padding = "4px 8px";
        del.style.borderRadius = "4px";
        del.style.cursor = "pointer";
        if (!entry.uid) {
          try {
            entry.uid = Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (e) {
            entry.uid = Date.now();
          }
        }
        const updateInputDisplay = () => {
          if (regexChk && regexChk.checked) {
            textInput.value = entry.pattern || "";
          } else {
            const patterns = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns : entry.pattern ? [entry.pattern] : [];
            textInput.value = patterns.map((p) => String(p).trim()).join(", ");
          }
        };
        const resolveBlacklistIndex = () => {
          let entryIdx = -1;
          if (entry && entry.uid) {
            entryIdx = this.plugin.settings.blacklistEntries.findIndex((e) => e && e.uid === entry.uid);
          }
          if (entryIdx === -1) {
            const currJoined = (() => {
              const pats = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns : entry.pattern ? [entry.pattern] : [];
              return pats.map((p) => String(p).trim()).join(", ");
            })();
            entryIdx = this.plugin.settings.blacklistEntries.findIndex((e) => {
              const pats = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : e.pattern ? [e.pattern] : [];
              const joined = pats.map((p) => String(p).trim()).join(", ");
              return joined === currJoined && !!e.isRegex === !!entry.isRegex && String(e.flags || "") === String(entry.flags || "") && String(e.presetLabel || "") === String(entry.presetLabel || "");
            });
          }
          if (entryIdx !== -1 && (!entry.uid || !this.plugin.settings.blacklistEntries[entryIdx].uid)) {
            try {
              const uid = entry.uid || Date.now().toString(36) + Math.random().toString(36).slice(2);
              this.plugin.settings.blacklistEntries[entryIdx].uid = uid;
              entry.uid = uid;
            } catch (e) {
            }
          }
          return entryIdx;
        };
        const textInputHandler = async () => {
          try {
            const newPattern = textInput.value;
            let entryIdx = resolveBlacklistIndex();
            if (entryIdx === -1) return;
            if (!newPattern) {
              this.plugin.settings.blacklistEntries.splice(entryIdx, 1);
            } else if (this.plugin.settings.enableRegexSupport && entry.isRegex && !this.plugin.settings.disableRegexSafety && this.plugin.isRegexTooComplex(newPattern)) {
              new Notice(this.plugin.t("notice_pattern_too_complex", "Pattern too complex: " + newPattern.substring(0, 60) + "..."));
              updateInputDisplay();
              return;
            } else {
              if (entry.isRegex) {
                this.plugin.settings.blacklistEntries[entryIdx].pattern = newPattern;
                this.plugin.settings.blacklistEntries[entryIdx].groupedPatterns = null;
                entry.pattern = newPattern;
                entry.groupedPatterns = null;
              } else {
                const patterns = newPattern.split(",").map((p) => String(p).trim()).filter((p) => p.length > 0);
                this.plugin.settings.blacklistEntries[entryIdx].pattern = patterns[0];
                this.plugin.settings.blacklistEntries[entryIdx].groupedPatterns = patterns.length > 1 ? patterns : null;
                entry.pattern = this.plugin.settings.blacklistEntries[entryIdx].pattern;
                entry.groupedPatterns = this.plugin.settings.blacklistEntries[entryIdx].groupedPatterns;
              }
            }
            await this.plugin.saveSettings();
            this.plugin.compileWordEntries();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            this.plugin.forceRefreshAllReadingViews();
            this.plugin.triggerActiveDocumentRerender();
            this._refreshBlacklistWords();
          } catch (error) {
            debugError("SETTINGS", "Error saving blacklist entry", error);
            new Notice(this.plugin.t("notice_error_saving_changes", "Error saving changes. Please try again."));
          }
        };
        const regexChkHandler = async () => {
          let entryIdx = resolveBlacklistIndex();
          if (entryIdx === -1) return;
          this.plugin.settings.blacklistEntries[entryIdx].isRegex = regexChk.checked;
          flagsInput.style.display = regexChk.checked ? "inline-block" : "none";
          await this.plugin.saveSettings();
          entry.isRegex = regexChk.checked;
          this._refreshBlacklistWords();
        };
        const flagsInputHandler = async () => {
          let entryIdx = resolveBlacklistIndex();
          if (entryIdx === -1) return;
          this.plugin.settings.blacklistEntries[entryIdx].flags = flagsInput.value || "";
          await this.plugin.saveSettings();
          entry.flags = flagsInput.value || "";
          this._refreshBlacklistWords();
        };
        const delHandler = async () => {
          let entryIdx = resolveBlacklistIndex();
          if (entryIdx === -1) return;
          this.plugin.settings.blacklistEntries.splice(entryIdx, 1);
          await this.plugin.saveSettings();
          this._refreshBlacklistWords();
        };
        const duplicateHandler = async () => {
          try {
            let entryIdx = resolveBlacklistIndex();
            if (entryIdx === -1) return;
            const orig = this.plugin.settings.blacklistEntries[entryIdx];
            const dup = Object.assign({}, orig);
            try {
              dup.uid = Date.now().toString(36) + Math.random().toString(36).slice(2);
            } catch (e) {
              dup.uid = Date.now();
            }
            this.plugin.settings.blacklistEntries.splice(entryIdx + 1, 0, dup);
            await this.plugin.saveSettings();
            this._suspendSorting = this._blacklistSortMode !== "last-added";
            this._refreshBlacklistWords();
          } catch (e) {
            debugError("SETTINGS", "duplicate blacklist entry error", e);
          }
        };
        const openInRegexTesterHandler = async () => {
          try {
            if (!entry.isRegex) return;
            const onAdded = () => {
              try {
                this._refreshBlacklistWords();
              } catch (e) {
              }
            };
            const modal = new BlacklistRegexTesterModal(this.app, this.plugin, onAdded);
            modal._editingEntry = entry;
            if (entry.pattern) modal._preFillPattern = entry.pattern;
            if (entry.flags) modal._preFillFlags = entry.flags;
            if (entry.presetLabel) modal._preFillName = entry.presetLabel;
            modal.open();
          } catch (e) {
            debugError("SETTINGS", "open in regex tester error", e);
          }
        };
        const contextMenuHandler = (ev) => {
          try {
            ev && ev.preventDefault && ev.preventDefault();
            if (ev && ev.stopPropagation) ev.stopPropagation();
            const menu = new Menu(this.app);
            menu.addItem((item) => {
              item.setTitle("Duplicate Entry").setIcon("copy").onClick(duplicateHandler);
            });
            if (entry.isRegex) {
              menu.addItem((item) => {
                item.setTitle("Open in Regex Tester").setIcon("pencil").onClick(openInRegexTesterHandler);
              });
            }
            menu.showAtPosition({ x: ev.clientX, y: ev.clientY });
          } catch (e) {
            debugError("SETTINGS", "context menu error", e);
          }
        };
        textInput.addEventListener("change", textInputHandler);
        textInput.addEventListener("blur", textInputHandler);
        row.addEventListener("contextmenu", contextMenuHandler);
        regexChk.addEventListener("change", regexChkHandler);
        flagsInput.addEventListener("change", flagsInputHandler);
        del.addEventListener("click", delHandler);
        this._cleanupHandlers.push(() => {
          try {
            textInput.removeEventListener("change", textInputHandler);
          } catch (e) {
          }
          try {
            textInput.removeEventListener("blur", textInputHandler);
          } catch (e) {
          }
          try {
            row.removeEventListener("contextmenu", contextMenuHandler);
          } catch (e) {
          }
          try {
            regexChk.removeEventListener("change", regexChkHandler);
          } catch (e) {
          }
          try {
            flagsInput.removeEventListener("change", flagsInputHandler);
          } catch (e) {
          }
          try {
            del.removeEventListener("click", delHandler);
          } catch (e) {
          }
        });
      });
    } catch (e) {
      debugError("SETTINGS", "_refreshBlacklistWords error", e);
    }
  }
  _refreshPathRules() {
    try {
      if (!this._pathRulesContainer) return;
      this._pathRulesContainer.empty();
      const rows = Array.isArray(this.plugin.settings.pathRules) ? [...this.plugin.settings.pathRules] : [];
      const q = String(this._pathRulesSearchQuery || "").trim().toLowerCase();
      const filteredRows = q ? rows.filter((r) => {
        const text = [String(r.path || ""), String(r.mode || ""), String(r.matchType || "")].join(" ").toLowerCase();
        return text.includes(q);
      }) : rows;
      if (!this._suspendSorting) {
        if (this._pathSortMode === "a-z") {
          filteredRows.sort((a, b) => {
            const aPath = String(a.path || "");
            const bPath = String(b.path || "");
            const aEmpty = aPath.trim().length === 0;
            const bEmpty = bPath.trim().length === 0;
            if (aEmpty && !bEmpty) return 1;
            if (!aEmpty && bEmpty) return -1;
            return aPath.toLowerCase().localeCompare(bPath.toLowerCase());
          });
        } else if (this._pathSortMode === "reverse-a-z") {
          filteredRows.sort((a, b) => {
            const aPath = String(a.path || "");
            const bPath = String(b.path || "");
            const aEmpty = aPath.trim().length === 0;
            const bEmpty = bPath.trim().length === 0;
            if (aEmpty && !bEmpty) return 1;
            if (!aEmpty && bEmpty) return -1;
            return bPath.toLowerCase().localeCompare(aPath.toLowerCase());
          });
        } else if (this._pathSortMode === "mode") {
          const order = { "exclude": 0, "include": 1 };
          filteredRows.sort((a, b) => {
            const aPath = String(a.path || "");
            const bPath = String(b.path || "");
            const aEmpty = aPath.trim().length === 0;
            const bEmpty = bPath.trim().length === 0;
            if (aEmpty && !bEmpty) return 1;
            if (!aEmpty && bEmpty) return -1;
            const styleCmp = (order[String(a.mode || "")] ?? 1) - (order[String(b.mode || "")] ?? 1);
            if (styleCmp !== 0) return styleCmp;
            return aPath.toLowerCase().localeCompare(bPath.toLowerCase());
          });
        } else if (this._pathSortMode === "type") {
          filteredRows.sort((a, b) => {
            const aPath = String(a.path || "");
            const bPath = String(b.path || "");
            const aEmpty = aPath.trim().length === 0;
            const bEmpty = bPath.trim().length === 0;
            if (aEmpty && !bEmpty) return 1;
            if (!aEmpty && bEmpty) return -1;
            const typeCmp = Boolean(a.isFolder) === Boolean(b.isFolder) ? 0 : a.isFolder ? -1 : 1;
            if (typeCmp !== 0) return typeCmp;
            return aPath.toLowerCase().localeCompare(bPath.toLowerCase());
          });
        }
      }
      const buildSuggestions = () => {
        const files = this.app.vault.getFiles();
        const folders = /* @__PURE__ */ new Set();
        const filePaths = [];
        files.forEach((f) => {
          const p = String(f.path).replace(/\\/g, "/");
          filePaths.push(p);
          const idx = p.lastIndexOf("/");
          const folder = idx !== -1 ? p.slice(0, idx) : "";
          if (folder) {
            const parts = folder.split("/");
            let acc = "";
            parts.forEach((part) => {
              acc = acc ? acc + "/" + part : part;
              folders.add(acc);
            });
          }
        });
        return { files: filePaths.sort(), folders: Array.from(folders).sort() };
      };
      const sugg = buildSuggestions();
      filteredRows.forEach((entry, filterIndex) => {
        const actualIndex = rows.indexOf(entry);
        if (actualIndex === -1) return;
        const row = this._pathRulesContainer.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.marginBottom = "8px";
        const modeSel = row.createEl("select");
        modeSel.style.flex = "0 0 auto";
        modeSel.style.padding = "6px";
        modeSel.style.borderRadius = "4px";
        modeSel.style.border = "1px solid var(--background-modifier-border)";
        modeSel.style.background = "var(--background-modifier-form-field)";
        modeSel.style.textAlign = "center";
        modeSel.innerHTML = `<option value="include">${this.plugin.t("path_rule_mode_include", "Include")}</option><option value="exclude">${this.plugin.t("path_rule_mode_exclude", "Exclude")}</option>`;
        modeSel.value = entry.mode === "exclude" ? "exclude" : "include";
        const input = row.createEl("input", { type: "text", value: entry.path || "" });
        input.placeholder = this.plugin.t("enter_path_or_pattern", "Enter path or pattern");
        input.style.flex = "1";
        input.style.padding = "6px";
        input.style.borderRadius = "4px";
        input.style.border = "1px solid var(--background-modifier-border)";
        const del = row.createEl("button", { text: "\u2715" });
        del.addClass("mod-warning");
        del.style.cursor = "pointer";
        del.style.flex = "0 0 auto";
        const updateDropdown = () => {
          if (input._actDropdown) {
            const dd2 = input._actDropdown;
            if (input._dropdownScrollListener) {
              document.removeEventListener("scroll", input._dropdownScrollListener, true);
              input._dropdownScrollListener = null;
            }
            if (input._dropdownClickListener) {
              document.removeEventListener("click", input._dropdownClickListener);
              input._dropdownClickListener = null;
            }
            if (input._dropdownKeyListener) {
              document.removeEventListener("keydown", input._dropdownKeyListener);
              input._dropdownKeyListener = null;
            }
            dd2.remove();
            input._actDropdown = null;
          }
          const val = String(input.value || "").trim().toLowerCase();
          const list = [];
          sugg.folders.forEach((f) => list.push({ t: "folder", p: f }));
          sugg.files.forEach((f) => list.push({ t: "file", p: f }));
          const filtered = val ? list.filter((x) => x.p.toLowerCase().includes(val)) : list;
          if (filtered.length === 0) return;
          const dd = document.createElement("div");
          Object.assign(dd.style, { position: "fixed", zIndex: 2e3, background: "var(--background-primary)", color: "var(--text-normal)", border: "1px solid var(--background-modifier-border)", borderRadius: "6px", boxShadow: "0 6px 18px rgba(0,0,0,0.4)", maxHeight: "240px", overflowY: "auto", padding: "6px 0", minWidth: Math.max(240, input.offsetWidth) + "px" });
          let hi = -1;
          filtered.forEach((item) => {
            const it = document.createElement("div");
            it.textContent = item.p || "/";
            Object.assign(it.style, { padding: "8px 12px", cursor: "pointer", whiteSpace: "nowrap" });
            it.onmouseenter = () => {
              if (hi >= 0 && dd.children[hi]) dd.children[hi].style.background = "transparent";
              it.style.background = "var(--background-secondary)";
              hi = Array.from(dd.children).indexOf(it);
            };
            it.onmouseleave = () => {
              it.style.background = "transparent";
            };
            it.onclick = async (e) => {
              e.stopPropagation();
              input.value = item.p + (item.t === "folder" ? "/" : "");
              const ev = new Event("change", { bubbles: true });
              input.dispatchEvent(ev);
              dd.remove();
              input._actDropdown = null;
            };
            dd.appendChild(it);
          });
          document.body.appendChild(dd);
          const pos = () => {
            const r = input.getBoundingClientRect();
            dd.style.left = r.left + "px";
            dd.style.top = r.bottom + 6 + "px";
            dd.style.width = input.offsetWidth + "px";
          };
          pos();
          input._actDropdown = dd;
          input._dropdownScrollListener = pos;
          input._dropdownClickListener = (ev) => {
            if (ev.target === input) return;
            if (!dd.contains(ev.target)) {
              dd.remove();
              input._actDropdown = null;
              document.removeEventListener("click", input._dropdownClickListener);
              document.removeEventListener("scroll", input._dropdownScrollListener, true);
              document.removeEventListener("keydown", input._dropdownKeyListener);
              input._dropdownClickListener = null;
              input._dropdownScrollListener = null;
              input._dropdownKeyListener = null;
            }
          };
          input._dropdownKeyListener = (ev) => {
            const items = Array.from(dd.children);
            if (items.length === 0) return;
            if (ev.key === "ArrowDown") {
              ev.preventDefault();
              hi = Math.min(hi + 1, items.length - 1);
              items.forEach((item) => item.style.background = "transparent");
              if (hi >= 0) {
                items[hi].style.background = "var(--background-secondary)";
                items[hi].scrollIntoView({ block: "nearest" });
              }
            } else if (ev.key === "ArrowUp") {
              ev.preventDefault();
              hi = Math.max(hi - 1, -1);
              items.forEach((item) => item.style.background = "transparent");
              if (hi >= 0) {
                items[hi].style.background = "var(--background-secondary)";
                items[hi].scrollIntoView({ block: "nearest" });
              }
            } else if (ev.key === "Enter" && hi >= 0) {
              ev.preventDefault();
              items[hi].click();
            } else if (ev.key === "Escape") {
              ev.preventDefault();
              dd.remove();
              input._actDropdown = null;
              document.removeEventListener("keydown", input._dropdownKeyListener);
              input._dropdownKeyListener = null;
            }
          };
          document.addEventListener("scroll", pos, true);
          document.addEventListener("click", input._dropdownClickListener);
          document.addEventListener("keydown", input._dropdownKeyListener);
          this._cleanupHandlers.push(() => {
            try {
              document.removeEventListener("scroll", pos, true);
            } catch (e) {
            }
            try {
              document.removeEventListener("click", input._dropdownClickListener);
            } catch (e) {
            }
            try {
              document.removeEventListener("keydown", input._dropdownKeyListener);
            } catch (e) {
            }
            if (input._actDropdown) {
              try {
                input._actDropdown.remove();
              } catch (e) {
              }
              input._actDropdown = null;
            }
          });
        };
        const focusHandler = () => {
          updateDropdown();
        };
        input.addEventListener("focus", focusHandler);
        const clickHandler = () => {
          updateDropdown();
        };
        input.addEventListener("click", clickHandler);
        this._cleanupHandlers.push(() => input.removeEventListener("focus", focusHandler));
        this._cleanupHandlers.push(() => input.removeEventListener("click", clickHandler));
        const inputHandler = () => {
          updateDropdown();
        };
        input.addEventListener("input", inputHandler);
        this._cleanupHandlers.push(() => input.removeEventListener("input", inputHandler));
        const changeHandler = async () => {
          let newPath = String(input.value || "").trim().replace(/\\\\/g, "/");
          const isFolderSel = /\/$/.test(newPath) || !/\.[a-zA-Z0-9]+$/.test(newPath) && newPath.includes("/");
          if (isFolderSel && !/\/$/.test(newPath)) newPath = newPath + "/";
          this.plugin.settings.pathRules[actualIndex].path = newPath;
          this.plugin.settings.pathRules[actualIndex].isFolder = isFolderSel;
          await this.plugin.saveSettings();
          this._refreshPathRules();
        };
        input.addEventListener("change", changeHandler);
        this._cleanupHandlers.push(() => input.removeEventListener("change", changeHandler));
        const modeHandler = async () => {
          this.plugin.settings.pathRules[actualIndex].mode = modeSel.value;
          await this.plugin.saveSettings();
          this._refreshPathRules();
        };
        modeSel.addEventListener("change", modeHandler);
        this._cleanupHandlers.push(() => modeSel.removeEventListener("change", modeHandler));
        const delHandler = async () => {
          if (actualIndex !== -1 && this.plugin.settings.pathRules[actualIndex]) {
            this.plugin.settings.pathRules.splice(actualIndex, 1);
            await this.plugin.saveSettings();
            this._refreshPathRules();
          }
        };
        del.addEventListener("click", delHandler);
        this._cleanupHandlers.push(() => del.removeEventListener("click", delHandler));
      });
      if (rows.length === 0) {
        this._pathRulesContainer.createEl("p", { text: this.plugin.t("no_rules_configured", "No rules configured.") });
      }
    } catch (e) {
      debugError("SETTINGS", "_refreshPathRules error", e);
    }
  }
  _refreshCustomSwatches() {
    try {
      if (!this._customSwatchesContainer) return;
      this._customSwatchesContainer.empty();
      new Setting(this._customSwatchesContainer).setName(this.plugin.t("replace_default_swatches", "Replace default swatches")).setDesc(this.plugin.t("replace_default_swatches_desc", "If this is on, only your custom colors will show up in the color picker. No default ones!")).addToggle((t) => t.setValue(this.plugin.settings.replaceDefaultSwatches).onChange(async (v) => {
        this.plugin.settings.replaceDefaultSwatches = v;
        await this.plugin.saveSettings();
      }));
      new Setting(this._customSwatchesContainer).setName(this.plugin.t("use_swatch_names", "Use swatch names for coloring text")).setDesc(this.plugin.t("use_swatch_names_desc", "Show a dropdown of swatch names next to word/pattern inputs")).addToggle((t) => t.setValue(this.plugin.settings.useSwatchNamesForText).onChange(async (v) => {
        this.plugin.settings.useSwatchNamesForText = v;
        await this.plugin.saveSettings();
        this._initializedSettingsUI = false;
        try {
          this.display();
        } catch (e) {
        }
      }));
      if (typeof this._defaultColorsFolded === "undefined") {
        this._defaultColorsFolded = true;
      }
      if (typeof this._customSwatchesFolded === "undefined") {
        this._customSwatchesFolded = this.plugin.settings.customSwatchesFolded || false;
      }
      const defaultColorsHeaderDiv = this._customSwatchesContainer.createDiv();
      defaultColorsHeaderDiv.style.display = "flex";
      defaultColorsHeaderDiv.style.alignItems = "center";
      defaultColorsHeaderDiv.style.gap = "8px";
      defaultColorsHeaderDiv.style.marginTop = "16px";
      defaultColorsHeaderDiv.style.marginBottom = "8px";
      defaultColorsHeaderDiv.style.cursor = "pointer";
      const defaultColorsToggle = defaultColorsHeaderDiv.createEl("span");
      defaultColorsToggle.textContent = this._defaultColorsFolded ? "\u25B6" : "\u25BC";
      defaultColorsToggle.style.fontSize = "12px";
      defaultColorsToggle.style.fontWeight = "bold";
      defaultColorsToggle.style.display = "inline-block";
      defaultColorsToggle.style.width = "16px";
      const defaultColorsTitle = defaultColorsHeaderDiv.createEl("h3", { text: this.plugin.t("default_colors_header", "Default Colors") });
      defaultColorsTitle.style.margin = "0";
      defaultColorsTitle.style.padding = "0";
      defaultColorsTitle.style.flex = "1";
      defaultColorsTitle.style.fontSize = "16px";
      defaultColorsTitle.style.fontWeight = "600";
      const defaultColorsContent = this._customSwatchesContainer.createDiv();
      defaultColorsContent.style.display = this._defaultColorsFolded ? "none" : "block";
      defaultColorsContent.style.marginBottom = "16px";
      const defaultColorsToggleHandler = () => {
        this._defaultColorsFolded = !this._defaultColorsFolded;
        defaultColorsToggle.textContent = this._defaultColorsFolded ? "\u25B6" : "\u25BC";
        defaultColorsContent.style.display = this._defaultColorsFolded ? "none" : "block";
      };
      defaultColorsHeaderDiv.addEventListener("click", defaultColorsToggleHandler);
      this._cleanupHandlers.push(() => defaultColorsHeaderDiv.removeEventListener("click", defaultColorsToggleHandler));
      const swatches = Array.isArray(this.plugin.settings.swatches) ? this.plugin.settings.swatches : [];
      swatches.forEach((sw) => {
        const row = defaultColorsContent.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.marginBottom = "8px";
        const nameInput = row.createEl("input", { type: "text", value: sw && sw.name ? sw.name : "Unnamed" });
        nameInput.style.flex = "1";
        nameInput.style.padding = "6px";
        nameInput.style.borderRadius = "4px";
        nameInput.style.border = "1px solid var(--background-modifier-border)";
        nameInput.disabled = true;
        const colorPicker = row.createEl("input", { type: "color" });
        colorPicker.value = sw && sw.color ? sw.color : "#000000";
        colorPicker.style.width = "30px";
        colorPicker.style.height = "30px";
        colorPicker.style.border = "none";
        colorPicker.style.borderRadius = "4px";
        colorPicker.style.cursor = "pointer";
        colorPicker.disabled = true;
        const infoSpan = row.createEl("span", { text: this.plugin.t("label_built_in", "(built-in)") });
        infoSpan.style.fontSize = "12px";
        infoSpan.style.opacity = "0.6";
        infoSpan.style.flex = "0 0 auto";
      });
      const customSwatchesHeaderDiv = this._customSwatchesContainer.createDiv();
      customSwatchesHeaderDiv.style.display = "flex";
      customSwatchesHeaderDiv.style.alignItems = "center";
      customSwatchesHeaderDiv.style.gap = "8px";
      customSwatchesHeaderDiv.style.marginTop = "16px";
      customSwatchesHeaderDiv.style.marginBottom = "8px";
      customSwatchesHeaderDiv.style.cursor = "pointer";
      const customSwatchesToggle = customSwatchesHeaderDiv.createEl("span");
      customSwatchesToggle.textContent = this._customSwatchesFolded ? "\u25B6" : "\u25BC";
      customSwatchesToggle.style.fontSize = "12px";
      customSwatchesToggle.style.fontWeight = "bold";
      customSwatchesToggle.style.display = "inline-block";
      customSwatchesToggle.style.width = "16px";
      const customSwatchesTitle = customSwatchesHeaderDiv.createEl("h3", { text: this.plugin.t("custom_swatches_header", "Custom Swatches") });
      customSwatchesTitle.style.margin = "0";
      customSwatchesTitle.style.padding = "0";
      customSwatchesTitle.style.flex = "1";
      customSwatchesTitle.style.fontSize = "16px";
      customSwatchesTitle.style.fontWeight = "600";
      const customSwatchesContent = this._customSwatchesContainer.createDiv();
      customSwatchesContent.style.display = this._customSwatchesFolded ? "none" : "block";
      customSwatchesContent.style.marginBottom = "16px";
      const customSwatchesToggleHandler = async () => {
        this._customSwatchesFolded = !this._customSwatchesFolded;
        this.plugin.settings.customSwatchesFolded = this._customSwatchesFolded;
        await this.plugin.saveSettings();
        customSwatchesToggle.textContent = this._customSwatchesFolded ? "\u25B6" : "\u25BC";
        customSwatchesContent.style.display = this._customSwatchesFolded ? "none" : "block";
      };
      customSwatchesHeaderDiv.addEventListener("click", customSwatchesToggleHandler);
      this._cleanupHandlers.push(() => customSwatchesHeaderDiv.removeEventListener("click", customSwatchesToggleHandler));
      const userCustomSwatches = Array.isArray(this.plugin.settings.userCustomSwatches) ? this.plugin.settings.userCustomSwatches : [];
      if (userCustomSwatches.length === 0) {
        const emptyMsg = customSwatchesContent.createEl("p", { text: this.plugin.t("no_custom_swatches_yet", 'No custom swatches yet. Click "+ Add color" to create one.') });
        emptyMsg.style.opacity = "0.6";
        emptyMsg.style.fontSize = "12px";
      } else {
        let dragSource = null;
        let dragStartOrder = null;
        const saveDragReorder = async () => {
          const swatchRows = Array.from(customSwatchesContent.querySelectorAll("div[data-swatch-index]"));
          const newOrder = swatchRows.map((r) => {
            const idx = parseInt(r.getAttribute("data-swatch-index"), 10);
            return this.plugin.settings.userCustomSwatches[idx];
          });
          this.plugin.settings.userCustomSwatches = newOrder;
          this.plugin.settings.customSwatches = this.plugin.settings.userCustomSwatches.map((s) => s.color);
          await this.plugin.saveSettings();
          this._refreshCustomSwatches();
        };
        userCustomSwatches.forEach((sw, i) => {
          const row = customSwatchesContent.createDiv();
          row.style.display = "flex";
          row.style.alignItems = "center";
          row.style.gap = "8px";
          row.style.marginBottom = "8px";
          row.setAttribute("data-swatch-index", i.toString());
          const dragHandle = row.createEl("button");
          setIcon(dragHandle, "menu");
          dragHandle.setAttribute("draggable", "true");
          dragHandle.style.padding = "0";
          dragHandle.style.border = "none";
          dragHandle.style.background = "transparent";
          dragHandle.style.boxShadow = "none";
          dragHandle.style.cursor = "grab";
          dragHandle.style.color = "var(--text-muted)";
          dragHandle.style.flexShrink = "0";
          dragHandle.style.display = "flex";
          dragHandle.style.alignItems = "center";
          dragHandle.style.justifyContent = "center";
          dragHandle.setAttribute("aria-label", this.plugin.t("drag_to_reorder", "Drag to reorder"));
          const nameInput = row.createEl("input", { type: "text", value: sw && sw.name ? sw.name : `Swatch ${i + 1}` });
          nameInput.style.flex = "1";
          nameInput.style.padding = "6px";
          nameInput.style.borderRadius = "4px";
          nameInput.style.border = "1px solid var(--background-modifier-border)";
          const colorPicker = row.createEl("input", { type: "color" });
          colorPicker.value = sw && sw.color ? sw.color : "#000000";
          colorPicker.style.width = "30px";
          colorPicker.style.height = "30px";
          colorPicker.style.border = "none";
          colorPicker.style.borderRadius = "4px";
          colorPicker.style.cursor = "pointer";
          colorPicker.style.flexShrink = "0";
          const delBtn = row.createEl("button", { text: "\u2715" });
          delBtn.addClass("mod-warning");
          delBtn.style.padding = "4px 8px";
          delBtn.style.borderRadius = "4px";
          delBtn.style.cursor = "pointer";
          delBtn.style.flexShrink = "0";
          const nameHandler = async () => {
            const val = nameInput.value.trim();
            this.plugin.settings.userCustomSwatches[i].name = val || `Swatch ${i + 1}`;
            this.plugin.settings.customSwatches = this.plugin.settings.userCustomSwatches.map((s) => s.color);
            await this.plugin.saveSettings();
          };
          const colorHandler = async () => {
            const val = colorPicker.value;
            if (!this.plugin.isValidHexColor(val)) return;
            this.plugin.settings.userCustomSwatches[i].color = val;
            this.plugin.settings.customSwatches = this.plugin.settings.userCustomSwatches.map((s) => s.color);
            await this.plugin.saveSettings();
          };
          const delHandler = async () => {
            this.plugin.settings.userCustomSwatches.splice(i, 1);
            this.plugin.settings.customSwatches = this.plugin.settings.userCustomSwatches.map((s) => s.color);
            await this.plugin.saveSettings();
            this._refreshCustomSwatches();
          };
          const dragstartHandler = (e) => {
            dragSource = row;
            dragStartOrder = Array.from(customSwatchesContent.querySelectorAll("div[data-swatch-index]")).map((r) => r.getAttribute("data-swatch-index"));
            row.style.opacity = "0.5";
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/html", row.innerHTML);
          };
          const dragoverHandler = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (dragSource && dragSource !== row) {
              const rect = row.getBoundingClientRect();
              const midpoint = rect.top + rect.height / 2;
              if (e.clientY < midpoint) {
                row.parentNode.insertBefore(dragSource, row);
              } else {
                row.parentNode.insertBefore(dragSource, row.nextSibling);
              }
            }
          };
          const dragendHandler = async (e) => {
            if (dragSource) dragSource.style.opacity = "1";
            if (dragSource && dragStartOrder) {
              const currentOrder = Array.from(customSwatchesContent.querySelectorAll("div[data-swatch-index]")).map((r) => r.getAttribute("data-swatch-index"));
              const orderChanged = !dragStartOrder.every((val, idx) => val === currentOrder[idx]);
              if (orderChanged) {
                await saveDragReorder();
              }
            }
            dragSource = null;
            dragStartOrder = null;
          };
          dragHandle.addEventListener("dragstart", dragstartHandler);
          row.addEventListener("dragover", dragoverHandler);
          dragHandle.addEventListener("dragend", dragendHandler);
          nameInput.addEventListener("change", nameHandler);
          colorPicker.addEventListener("input", colorHandler);
          delBtn.addEventListener("click", delHandler);
        });
      }
      const addButtonSetting = new Setting(customSwatchesContent);
      addButtonSetting.addButton((b) => b.setButtonText(this.plugin.t("btn_add_color", "+ Add color")).onClick(async () => {
        const nextIndex = (Array.isArray(this.plugin.settings.userCustomSwatches) ? this.plugin.settings.userCustomSwatches.length : 0) + 1;
        const newSwatch = { name: `Swatch ${nextIndex}`, color: "#000000" };
        if (!Array.isArray(this.plugin.settings.userCustomSwatches)) this.plugin.settings.userCustomSwatches = [];
        this.plugin.settings.userCustomSwatches.push(newSwatch);
        this.plugin.settings.customSwatches = this.plugin.settings.userCustomSwatches.map((s) => s.color);
        await this.plugin.saveSettings();
        this._customSwatchesFolded = false;
        this._refreshCustomSwatches();
      }));
    } catch (e) {
      debugError("SETTINGS", "_refreshCustomSwatches error", e);
    }
  }
  _refreshEntries() {
    try {
      const listDiv = this.containerEl.querySelector(".color-words-list");
      if (!listDiv) return;
      const newIds = this._newEntriesSet || /* @__PURE__ */ new Set();
      const isNew = (e) => {
        try {
          return e && e.uid && newIds.has(e.uid) || !!e.persistAtEnd;
        } catch (_) {
          return !!(e && e.persistAtEnd);
        }
      };
      listDiv.empty();
      const entriesToDisplay = [...this.plugin.settings.wordEntries];
      const q = String(this._entriesSearchQuery || "").trim().toLowerCase();
      const filtered = q ? entriesToDisplay.filter((e) => {
        const patterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : [String(e.pattern || "")];
        const text = [
          ...patterns.map((p) => p.toLowerCase()),
          String(e.presetLabel || "").toLowerCase(),
          String(e.flags || "").toLowerCase(),
          String(e.styleType || "").toLowerCase()
        ].join(" ");
        return text.includes(q);
      }) : entriesToDisplay;
      let finalFiltered = filtered;
      if (this._filterMode === "highlight") {
        finalFiltered = filtered.filter((e) => e.styleType === "highlight" || e.styleType === "both");
      } else if (this._filterMode === "text") {
        finalFiltered = filtered.filter((e) => e.styleType === "text" || e.styleType === "both");
      }
      const newFiltered = finalFiltered.filter((e) => isNew(e));
      let oldFiltered = finalFiltered.filter((e) => !isNew(e));
      if (!this._suspendSorting && this._wordsSortMode === "a-z") {
        oldFiltered.sort((a, b) => {
          const patternA = Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0 ? a.groupedPatterns[0] : a.pattern || "";
          const patternB = Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0 ? b.groupedPatterns[0] : b.pattern || "";
          const aEmpty = String(patternA).trim().length === 0;
          const bEmpty = String(patternB).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          const aHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternA);
          const bHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternB);
          if (aHasSpecialChars && !bHasSpecialChars) return -1;
          if (!aHasSpecialChars && bHasSpecialChars) return 1;
          return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
        });
      } else if (!this._suspendSorting && this._wordsSortMode === "reverse-a-z") {
        oldFiltered.sort((a, b) => {
          const patternA = Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0 ? a.groupedPatterns[0] : a.pattern || "";
          const patternB = Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0 ? b.groupedPatterns[0] : b.pattern || "";
          const aEmpty = String(patternA).trim().length === 0;
          const bEmpty = String(patternB).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          const aHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternA);
          const bHasSpecialChars = /[^a-zA-Z0-9\s]/.test(patternB);
          if (aHasSpecialChars && !bHasSpecialChars) return -1;
          if (!aHasSpecialChars && bHasSpecialChars) return 1;
          return patternB.toLowerCase().localeCompare(patternA.toLowerCase());
        });
      } else if (!this._suspendSorting && this._wordsSortMode === "style-order") {
        const styleOrder = { "text": 0, "highlight": 1, "both": 2 };
        oldFiltered.sort((a, b) => {
          const patternA = Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0 ? a.groupedPatterns[0] : a.pattern || "";
          const patternB = Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0 ? b.groupedPatterns[0] : b.pattern || "";
          const aEmpty = String(patternA).trim().length === 0;
          const bEmpty = String(patternB).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          const styleA = styleOrder[a.styleType] ?? 0;
          const styleB = styleOrder[b.styleType] ?? 0;
          if (styleA !== styleB) return styleA - styleB;
          return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
        });
      } else if (!this._suspendSorting && this._wordsSortMode === "color") {
        oldFiltered.sort((a, b) => {
          const patternA = Array.isArray(a.groupedPatterns) && a.groupedPatterns.length > 0 ? a.groupedPatterns[0] : a.pattern || "";
          const patternB = Array.isArray(b.groupedPatterns) && b.groupedPatterns.length > 0 ? b.groupedPatterns[0] : b.pattern || "";
          const aEmpty = String(patternA).trim().length === 0;
          const bEmpty = String(patternB).trim().length === 0;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          const colorA = (a.backgroundColor || a.textColor || a.color || "").toLowerCase();
          const colorB = (b.backgroundColor || b.textColor || b.color || "").toLowerCase();
          if (colorA !== colorB) return colorA.localeCompare(colorB);
          return patternA.toLowerCase().localeCompare(patternB.toLowerCase());
        });
      }
      const baseOrder = [...this.plugin.settings.wordEntries];
      const newInInsertionOrder = baseOrder.filter((e) => isNew(e) && newFiltered.includes(e));
      const entriesFiltered = [...oldFiltered, ...newInInsertionOrder];
      entriesFiltered.forEach((entry) => {
        this._createEntryRow(entry, listDiv);
      });
      this._entryRows.clear();
      entriesFiltered.forEach((entry) => {
        const rowInfo = this._entryRows.get(entry);
        if (rowInfo) {
        } else {
        }
      });
      this._initializedSettingsUI = true;
    } catch (e) {
      debugError("SETTINGS", "_refreshEntries error", e);
    }
  }
  // Clean up event listeners to prevent leaks
  onClose() {
    try {
      try {
        if (this.debouncedSaveSettings && typeof this.debouncedSaveSettings.flush === "function") {
          this.debouncedSaveSettings.flush();
        }
      } catch (e) {
        debugError("SETTINGS", "debounce flush error", e);
      }
      try {
        const rows = Array.from(this._entryRows?.entries() || []);
        rows.forEach(([entry, info]) => {
          if (!entry || !info || !info.elements) return;
          const { textInput, styleSelect, cp, cpBg, regexChk, flagsInput } = info.elements;
          let idx = -1;
          if (entry && entry.uid) idx = this.plugin.settings.wordEntries.findIndex((e) => e && e.uid === entry.uid);
          if (idx === -1) idx = this.plugin.settings.wordEntries.indexOf(entry);
          if (idx === -1) return;
          const s = this.plugin.settings.wordEntries[idx];
          if (textInput && typeof textInput.value === "string") {
            const raw = String(textInput.value || "");
            const patterns = raw.split(",").filter((p) => p.length > 0);
            s.pattern = patterns[0] || "";
            s.groupedPatterns = patterns.length > 1 ? patterns : null;
          }
          if (regexChk) {
            s.isRegex = !!regexChk.checked;
          }
          if (flagsInput && typeof flagsInput.value === "string") {
            s.flags = String(flagsInput.value || "");
          }
          const style = styleSelect ? styleSelect.value : s.styleType || "text";
          if (style === "text") {
            const val = cp && typeof cp.value === "string" ? cp.value : s.color;
            s.color = this.plugin.isValidHexColor(val) ? val : "";
            s.textColor = null;
            s.backgroundColor = null;
            s.styleType = "text";
            s._savedTextColor = this.plugin.isValidHexColor(s.color) ? s.color : s._savedTextColor || null;
          } else if (style === "highlight") {
            const bgCandidate = cpBg && typeof cpBg.value === "string" ? cpBg.value : s.backgroundColor || s._savedBackgroundColor || s._savedTextColor || (this.plugin.isValidHexColor(s.color) ? s.color : "");
            s.backgroundColor = this.plugin.isValidHexColor(bgCandidate) ? bgCandidate : null;
            s.textColor = "currentColor";
            s.color = "";
            s.styleType = "highlight";
            s._savedBackgroundColor = this.plugin.isValidHexColor(s.backgroundColor) ? s.backgroundColor : s._savedBackgroundColor || null;
          } else {
            const t = cp && typeof cp.value === "string" ? cp.value : s.textColor;
            const b = cpBg && typeof cpBg.value === "string" ? cpBg.value : s.backgroundColor;
            s.textColor = this.plugin.isValidHexColor(t) ? t : s.textColor === "currentColor" ? "currentColor" : null;
            s.backgroundColor = this.plugin.isValidHexColor(b) ? b : null;
            s.color = "";
            s.styleType = "both";
            s._savedTextColor = this.plugin.isValidHexColor(s.textColor) ? s.textColor : s._savedTextColor || null;
            s._savedBackgroundColor = this.plugin.isValidHexColor(s.backgroundColor) ? s.backgroundColor : s._savedBackgroundColor || null;
          }
        });
        this.plugin.saveSettings();
      } catch (e) {
        debugError("SETTINGS", "snapshot rows on close error", e);
      }
      try {
        const allInputs = this.containerEl?.querySelectorAll('input[type="text"]') || [];
        allInputs.forEach((input) => {
          if (input._actDropdown) {
            const dd = input._actDropdown;
            if (input._dropdownScrollListener) {
              document.removeEventListener("scroll", input._dropdownScrollListener, true);
              input._dropdownScrollListener = null;
            }
            if (input._dropdownClickListener) {
              document.removeEventListener("click", input._dropdownClickListener);
              input._dropdownClickListener = null;
            }
            if (input._dropdownKeyListener) {
              document.removeEventListener("keydown", input._dropdownKeyListener);
              input._dropdownKeyListener = null;
            }
            try {
              dd.remove();
            } catch (e) {
            }
            input._actDropdown = null;
          }
          if (input._dropdownCleanup && typeof input._dropdownCleanup === "function") {
            try {
              input._dropdownCleanup();
            } catch (e) {
            }
            input._dropdownCleanup = null;
          }
        });
      } catch (e) {
        debugError("SETTINGS", "dropdown cleanup error", e);
      }
      this._cleanupHandlers?.forEach((cleanup) => {
        try {
          cleanup();
        } catch (e) {
          debugError("SETTINGS", "cleanup error", e);
        }
      });
      this._cleanupHandlers = [];
      if (Array.isArray(this._dynamicHandlers)) {
        this._dynamicHandlers.forEach((h) => {
          try {
            h();
          } catch (e) {
          }
        });
        this._dynamicHandlers = [];
      }
      this._cachedFolderSuggestions = null;
      try {
        this.containerEl?.empty();
      } catch (e) {
      }
      this._suspendSorting = false;
      try {
        this._newEntriesSet && this._newEntriesSet.clear();
      } catch (e) {
      }
      try {
        this._blacklistNewSet && this._blacklistNewSet.clear();
      } catch (e) {
      }
      try {
        if (Array.isArray(this.plugin.settings.wordEntries)) {
          this.plugin.settings.wordEntries.forEach((e) => {
            if (e && e.persistAtEnd) delete e.persistAtEnd;
          });
        }
        if (Array.isArray(this.plugin.settings.blacklistEntries)) {
          this.plugin.settings.blacklistEntries.forEach((e) => {
            if (e && e.persistAtEnd) delete e.persistAtEnd;
          });
        }
      } catch (e) {
      }
      try {
        this._refreshPathRules();
      } catch (e) {
      }
      try {
        this._refreshBlacklistWords();
      } catch (e) {
      }
    } catch (e) {
      debugError("SETTINGS", "onClose error", e);
    }
  }
  display() {
    const { containerEl } = this;
    this.containerEl = containerEl;
    if (this._initializedSettingsUI) {
      try {
        this._refreshEntries();
      } catch (e) {
      }
      return;
    }
    containerEl.empty();
    this.onClose();
    this._cleanupHandlers = [];
    containerEl.createEl("h1", { text: this.plugin.t("settings_title", "Always Color Text Settings") });
    new Setting(containerEl).setName(this.plugin.t("latest_release_notes_label", "Latest Release Notes")).setDesc(this.plugin.t("latest_release_notes_desc", "View the most recent plugin release notes")).addButton((btn) => btn.setButtonText(this.plugin.t("open_changelog_button", "Open Changelog")).onClick(() => {
      try {
        new ChangelogModal(this.app, this.plugin).open();
      } catch (e) {
      }
    }));
    new Setting(containerEl).setName(this.plugin.t("language_label", "Language")).setDesc(this.plugin.t("language_desc", "Select the language to be used in this plugin")).addDropdown((d) => {
      const langs = this.plugin.getAvailableLanguages();
      const names = { auto: this.plugin.t("language_auto", "System Default"), en: "English", es: "Spanish", fr: "French", eu: "Basque", ru: "Russian" };
      try {
        d.selectEl.style.textAlign = "center";
      } catch (e) {
      }
      langs.forEach((code) => {
        const dict = this.plugin._translations && this.plugin._translations[code] || {};
        const display = String(dict.__name || names[code] || code.toUpperCase());
        d.addOption(code, display);
      });
      d.setValue(this.plugin.settings.language || "en").onChange(async (v) => {
        this.plugin.settings.language = v;
        await this.plugin.saveSettings();
        this._initializedSettingsUI = false;
        this.plugin.reregisterCommandsWithLanguage();
        this.display();
      });
      return d;
    });
    new Setting(containerEl).setName(this.plugin.t("enable_document_color", "Enable document color")).addToggle((t) => t.setValue(this.plugin.settings.enabled).onChange(async (v) => {
      this.plugin.settings.enabled = v;
      await this.debouncedSaveSettings();
    }));
    new Setting(containerEl).setName(this.plugin.t("color_in_reading_mode", "Color in reading mode")).addToggle((t) => t.setValue(!this.plugin.settings.disableReadingModeColoring).onChange(async (v) => {
      this.plugin.settings.disableReadingModeColoring = !v;
      await this.debouncedSaveSettings();
      try {
        if (!v) {
          this.plugin.app.workspace.iterateAllLeaves((leaf) => {
            if (leaf.view instanceof MarkdownView && leaf.view.getMode && leaf.view.getMode() === "preview") {
              try {
                const root = leaf.view.previewMode && leaf.view.previewMode.containerEl || leaf.view.contentEl || leaf.view.containerEl;
                if (root) {
                  try {
                    this.plugin.clearHighlightsInRoot(root);
                  } catch (e) {
                  }
                  try {
                    const obs = this.plugin._viewportObservers && this.plugin._viewportObservers.get && this.plugin._viewportObservers.get(root);
                    if (obs && typeof obs.disconnect === "function") {
                      try {
                        obs.disconnect();
                      } catch (e) {
                      }
                      try {
                        this.plugin._viewportObservers.delete(root);
                      } catch (e) {
                      }
                    }
                  } catch (e) {
                  }
                }
              } catch (e) {
              }
            }
          });
        } else {
          try {
            this.plugin.forceRefreshAllReadingViews();
          } catch (e) {
          }
        }
      } catch (e) {
        debugError("SETTINGS", "disableReadingModeColoring handler failed", e);
      }
    }));
    new Setting(containerEl).setName(this.plugin.t("force_full_render_reading", "Force full render in Reading mode")).setDesc(this.plugin.t("force_full_render_reading_desc", "When ON, reading-mode will attempt to color the entire document in one pass. May cause performance issues on large documents. Use with caution!")).addToggle((t) => t.setValue(this.plugin.settings.forceFullRenderInReading).onChange(async (v) => {
      this.plugin.settings.forceFullRenderInReading = v;
      await this.debouncedSaveSettings();
      try {
        this.plugin.forceRefreshAllReadingViews();
      } catch (e) {
        debugError("SETTINGS", "forceFullRenderInReading handler failed", e);
      }
    }));
    new Setting(containerEl).setName(this.plugin.t("show_toggle_statusbar", "Show Toggle in Status Bar")).addToggle((t) => t.setValue(!this.plugin.settings.disableToggleModes.statusBar).onChange(async (v) => {
      this.plugin.settings.disableToggleModes.statusBar = !v;
      await this.plugin.saveSettings();
      try {
        if (v && !this.plugin.statusBar) {
          this.plugin.statusBar = this.plugin.addStatusBarItem();
          this.plugin.updateStatusBar();
          this.plugin.statusBar.onclick = () => {
            this.plugin.settings.enabled = !this.plugin.settings.enabled;
            this.plugin.saveSettings();
            this.plugin.updateStatusBar();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            this.plugin.forceRefreshAllReadingViews();
          };
        } else if (!v && this.plugin.statusBar) {
          try {
            this.plugin.statusBar.remove();
          } catch (e) {
          }
          this.plugin.statusBar = null;
        }
      } catch (e) {
      }
    }));
    new Setting(containerEl).setName(this.plugin.t("show_toggle_ribbon", "Show Toggle icon in ribbon")).addToggle((t) => t.setValue(!this.plugin.settings.disableToggleModes.ribbon).onChange(async (v) => {
      this.plugin.settings.disableToggleModes.ribbon = !v;
      await this.plugin.saveSettings();
      try {
        if (v && !this.ribbonIcon) {
          this.ribbonIcon = this.addRibbonIcon("palette", this.t("ribbon_title", "Always color text"), async () => {
            this.settings.enabled = !this.settings.enabled;
            await this.saveSettings();
            this.updateStatusBar();
            this.reconfigureEditorExtensions();
            this.forceRefreshAllEditors();
            this.forceRefreshAllReadingViews();
            if (this.settings.enabled) new Notice(this.t("notice_enabled", "Always color text enabled"));
            else new Notice(this.t("notice_disabled", "Always color text disabled"));
          });
        } else if (!v && this.ribbonIcon && this.ribbonIcon.remove) {
          try {
            this.ribbonIcon.remove();
          } catch (e) {
          }
          this.ribbonIcon = null;
        }
      } catch (e) {
      }
    }));
    new Setting(containerEl).setName(this.plugin.t("show_toggle_command", "Show Toggle in command")).addToggle((t) => t.setValue(!this.plugin.settings.disableToggleModes.command).onChange(async (v) => {
      this.plugin.settings.disableToggleModes.command = !v;
      await this.plugin.saveSettings();
      try {
        if (v) {
          if (!this.plugin._commandsRegistered) {
            try {
              this.plugin.registerCommandPalette?.();
            } catch (e) {
            }
            this.plugin._commandsRegistered = true;
          }
        } else {
          new ConfirmationModal(this.app, this.plugin.t("restart_required_title", "Restart required"), this.plugin.t("restart_required_desc", "Disabling the command palette toggle requires restarting Obsidian to fully remove commands from the palette. Restart now?"), () => {
            try {
              location.reload();
            } catch (e) {
            }
          }).open();
        }
      } catch (e) {
      }
    }));
    containerEl.createEl("h3", { text: this.plugin.t("coloring_settings_header", "Coloring Settings") });
    new Setting(containerEl).setName(this.plugin.t("regex_support", "Regex support")).setDesc(this.plugin.t("regex_support_desc", "Allow patterns to be regular expressions. Invalid regexes are ignored for safety.")).addToggle((t) => t.setValue(this.plugin.settings.enableRegexSupport).onChange(async (v) => {
      this.plugin.settings.enableRegexSupport = v;
      await this.plugin.saveSettings();
      this._initializedSettingsUI = false;
      this.display();
    }));
    new Setting(containerEl).setName(this.plugin.t("disable_regex_safety", "Disable regex safety")).setDesc(this.plugin.t("disable_regex_safety_desc", "Allow complex or potentially dangerous expressions. May cause performance issues or freezes.")).addToggle((t) => t.setValue(this.plugin.settings.disableRegexSafety).onChange(async (v) => {
      this.plugin.settings.disableRegexSafety = v;
      await this.plugin.saveSettings();
      try {
        this.plugin.reconfigureEditorExtensions();
      } catch (e) {
      }
      try {
        this.plugin.forceRefreshAllEditors();
      } catch (e) {
      }
      try {
        this.plugin.forceRefreshAllReadingViews();
      } catch (e) {
      }
    }));
    new Setting(containerEl).setName(this.plugin.t("case_sensitive", "Case sensitive")).setDesc(this.plugin.t("case_sensitive_desc", `If this is on, "word" and "Word" are treated as different. If it's off, they're colored the same.`)).addToggle((t) => t.setValue(this.plugin.settings.caseSensitive).onChange(async (v) => {
      this.plugin.settings.caseSensitive = v;
      await this.debouncedSaveSettings();
    }));
    new Setting(containerEl).setName(this.plugin.t("partial_match", "Partial match")).setDesc(this.plugin.t("partial_match_desc", 'If enabled, the whole word will be colored if any colored word is found inside it (e.g., "as" colors "Jasper").')).addToggle((t) => t.setValue(this.plugin.settings.partialMatch).onChange(async (v) => {
      this.plugin.settings.partialMatch = v;
      await this.debouncedSaveSettings();
    }));
    containerEl.createEl("h2", { text: this.plugin.t("one_time_actions_header", "One-Time Actions") });
    new Setting(containerEl).setName(this.plugin.t("setting_color_once", "Color Once")).setDesc(this.plugin.t("setting_color_once_desc", "Inserts HTML inline for the selected text. This persists even if the plugin is turned off.")).addToggle((t) => t.setValue(this.plugin.settings.enableQuickColorOnce).onChange(async (v) => {
      this.plugin.settings.enableQuickColorOnce = v;
      await this.plugin.saveSettings();
    }));
    new Setting(containerEl).setName(this.plugin.t("setting_highlight_once", "Highlight Once")).setDesc(this.plugin.t("setting_highlight_once_desc", "Inserts HTML inline with background styling. This persists even if the plugin is turned off.")).addToggle((t) => t.setValue(this.plugin.settings.enableQuickHighlightOnce).onChange(async (v) => {
      this.plugin.settings.enableQuickHighlightOnce = v;
      await this.plugin.saveSettings();
      this._initializedSettingsUI = false;
      this.display();
    }));
    if (this.plugin.settings.enableQuickHighlightOnce) {
      new Setting(containerEl).setName(this.plugin.t("use_global_highlight_style", "Use Global Highlight Style for Highlight Once")).setDesc(this.plugin.t("use_global_highlight_style_desc", "Uses your global inline style. The added HTML/CSS may be long.")).addToggle((t) => t.setValue(this.plugin.settings.quickHighlightUseGlobalStyle).onChange(async (v) => {
        this.plugin.settings.quickHighlightUseGlobalStyle = v;
        await this.plugin.saveSettings();
        this._initializedSettingsUI = false;
        this.display();
      }));
      new Setting(containerEl).setName(this.plugin.t("style_highlight_once", "Style Highlight Once")).setDesc(this.plugin.t("style_highlight_once_desc", "Uses your custom inline style. The added HTML/CSS may be long.")).addToggle((t) => t.setValue(this.plugin.settings.quickHighlightStyleEnable).onChange(async (v) => {
        this.plugin.settings.quickHighlightStyleEnable = v;
        await this.plugin.saveSettings();
        this._initializedSettingsUI = false;
        this.display();
      }));
      if (this.plugin.settings.quickHighlightStyleEnable && !this.plugin.settings.quickHighlightUseGlobalStyle) {
        const previewSection2 = containerEl.createDiv();
        previewSection2.style.margin = "8px 0 12px 0";
        previewSection2.style.padding = "12px";
        previewSection2.style.borderRadius = "8px";
        previewSection2.style.border = "1px solid var(--background-modifier-border)";
        previewSection2.style.backgroundColor = "var(--background-secondary)";
        const previewLabel2 = previewSection2.createEl("div");
        previewLabel2.style.marginBottom = "8px";
        previewLabel2.style.fontWeight = "600";
        previewLabel2.style.fontSize = "14px";
        previewLabel2.textContent = this.plugin.t("highlight_once_preview", "Highlight Once Preview");
        const previewText2 = previewSection2.createEl("div");
        previewText2.textContent = this.plugin.t("highlight_once_preview_text", "This is how Highlight Once will look like!");
        previewText2.style.display = "inline-block";
        const updateQuickOncePreview = () => {
          const sampleColor = "#fa8231";
          const hexWithAlpha = this.plugin.hexToHexWithAlpha(sampleColor, this.plugin.settings.quickHighlightOpacity ?? 25);
          const radius = this.plugin.settings.quickHighlightBorderRadius ?? 8;
          const pad = this.plugin.settings.quickHighlightHorizontalPadding ?? 4;
          previewText2.style.backgroundColor = hexWithAlpha;
          previewText2.style.borderRadius = radius + "px";
          previewText2.style.paddingLeft = previewText2.style.paddingRight = pad + "px";
          previewText2.style.border = "";
          previewText2.style.borderTop = "";
          previewText2.style.borderBottom = "";
          previewText2.style.borderLeft = "";
          previewText2.style.borderRight = "";
          const borderCss = this.plugin.generateOnceBorderStyle(sampleColor);
          try {
            previewText2.style.cssText += borderCss;
          } catch (e) {
          }
        };
        updateQuickOncePreview();
        this._updateQuickOncePreview = updateQuickOncePreview;
      }
      if (this.plugin.settings.quickHighlightStyleEnable && !this.plugin.settings.quickHighlightUseGlobalStyle) {
        new Setting(containerEl).setName(this.plugin.t("highlight_once_opacity", "Highlight once opacity")).addSlider((slider) => slider.setLimits(0, 100, 1).setValue(this.plugin.settings.quickHighlightOpacity ?? 25).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.quickHighlightOpacity = v;
          await this.plugin.saveSettings();
          try {
            this._updateQuickOncePreview?.();
          } catch (e) {
          }
        }));
        {
          let brInput;
          new Setting(containerEl).setName(this.plugin.t("highlight_once_border_radius", "Highlight once border radius (px)")).addText((text) => {
            brInput = text;
            text.setPlaceholder("e.g. 0, 4, 8").setValue(String(this.plugin.settings.quickHighlightBorderRadius ?? 8)).onChange(async (v) => {
              let val = parseInt(v);
              if (isNaN(val) || val < 0) val = 0;
              this.plugin.settings.quickHighlightBorderRadius = val;
              await this.plugin.saveSettings();
              try {
                this._updateQuickOncePreview?.();
              } catch (e) {
              }
            });
          }).addExtraButton((btn) => btn.setIcon("reset").setTooltip(this.plugin.t("reset_to_8", "Reset to 8")).onClick(async () => {
            this.plugin.settings.quickHighlightBorderRadius = 8;
            await this.plugin.saveSettings();
            if (brInput) brInput.setValue("8");
            try {
              this._updateQuickOncePreview?.();
            } catch (e) {
            }
          }));
        }
        {
          let hpInput;
          new Setting(containerEl).setName(this.plugin.t("highlight_horizontal_padding", "Highlight horizontal padding (px)")).addText((text) => {
            hpInput = text;
            text.setPlaceholder("e.g. 0, 4, 8").setValue(String(this.plugin.settings.quickHighlightHorizontalPadding ?? 4)).onChange(async (v) => {
              let val = parseInt(v);
              if (isNaN(val) || val < 0) val = 0;
              this.plugin.settings.quickHighlightHorizontalPadding = val;
              await this.plugin.saveSettings();
              try {
                this._updateQuickOncePreview?.();
              } catch (e) {
              }
            });
          }).addExtraButton((btn) => btn.setIcon("reset").setTooltip(this.plugin.t("reset_to_4", "Reset to 4")).onClick(async () => {
            this.plugin.settings.quickHighlightHorizontalPadding = 4;
            await this.plugin.saveSettings();
            if (hpInput) hpInput.setValue("4");
            try {
              this._updateQuickOncePreview?.();
            } catch (e) {
            }
          }));
        }
        new Setting(containerEl).setName(this.plugin.t("enable_border_highlight_once", "Enable Border for Highlight Once")).setDesc(this.plugin.t("enable_border_highlight_once_desc", "Add a border to your inline highlight. The added HTML/CSS WILL be long.")).addToggle((t) => t.setValue(this.plugin.settings.quickHighlightEnableBorder ?? false).onChange(async (v) => {
          this.plugin.settings.quickHighlightEnableBorder = v;
          await this.plugin.saveSettings();
          try {
            this._updateQuickOncePreview?.();
          } catch (e) {
          }
          this._initializedSettingsUI = false;
          this.display();
        }));
        if (this.plugin.settings.quickHighlightEnableBorder) {
          new Setting(containerEl).setName(this.plugin.t("highlight_once_border_style", "Highlight Once Border Style")).addDropdown((d) => {
            d.selectEl.style.width = "200px";
            return d.addOption("full", this.plugin.t("opt_border_full", "Full border (all sides)")).addOption("top-bottom", this.plugin.t("opt_border_top_bottom", "Top & Bottom borders")).addOption("left-right", this.plugin.t("opt_border_left_right", "Left & Right borders")).addOption("top-right", this.plugin.t("opt_border_top_right", "Top & Right borders")).addOption("top-left", this.plugin.t("opt_border_top_left", "Top & Left borders")).addOption("bottom-right", this.plugin.t("opt_border_bottom_right", "Bottom & Right borders")).addOption("bottom-left", this.plugin.t("opt_border_bottom_left", "Bottom & Left borders")).addOption("top", this.plugin.t("opt_border_top", "Top border only")).addOption("bottom", this.plugin.t("opt_border_bottom", "Bottom border only")).addOption("left", this.plugin.t("opt_border_left", "Left border only")).addOption("right", this.plugin.t("opt_border_right", "Right border only")).setValue(this.plugin.settings.quickHighlightBorderStyle ?? "full").onChange(async (v) => {
              this.plugin.settings.quickHighlightBorderStyle = v;
              await this.plugin.saveSettings();
              try {
                this._updateQuickOncePreview?.();
              } catch (e) {
              }
            });
          });
          new Setting(containerEl).setName(this.plugin.t("highlight_once_border_opacity", "Highlight Once Border Opacity")).addSlider((slider) => slider.setLimits(0, 100, 1).setValue(this.plugin.settings.quickHighlightBorderOpacity ?? 100).setDynamicTooltip().onChange(async (v) => {
            this.plugin.settings.quickHighlightBorderOpacity = v;
            await this.plugin.saveSettings();
            try {
              this._updateQuickOncePreview?.();
            } catch (e) {
            }
          }));
          {
            let btInput;
            new Setting(containerEl).setName(this.plugin.t("highlight_once_border_thickness", "Highlight Once Border Thickness (px)")).addText((text) => {
              btInput = text;
              text.setPlaceholder("e.g. 1, 2.5, 3.7").setValue(String(this.plugin.settings.quickHighlightBorderThickness ?? 1)).onChange(async (v) => {
                let val = parseFloat(v);
                if (isNaN(val) || val < 0) val = 0;
                if (val > 5) val = 5;
                this.plugin.settings.quickHighlightBorderThickness = val;
                await this.plugin.saveSettings();
                try {
                  this._updateQuickOncePreview?.();
                } catch (e) {
                }
              });
            }).addExtraButton((btn) => btn.setIcon("reset").setTooltip(this.plugin.t("reset_to_1", "Reset to 1")).onClick(async () => {
              this.plugin.settings.quickHighlightBorderThickness = 1;
              await this.plugin.saveSettings();
              if (btInput) btInput.setValue("1");
              try {
                this._updateQuickOncePreview?.();
              } catch (e) {
              }
            }));
          }
        }
      }
    }
    containerEl.createEl("h3", { text: this.plugin.t("global_highlight_appearance_header", "Global Highlight Coloring Appearance") });
    const previewSection = containerEl.createDiv();
    previewSection.style.marginBottom = "16px";
    previewSection.style.padding = "12px";
    previewSection.style.borderRadius = "8px";
    previewSection.style.border = "1px solid var(--background-modifier-border)";
    previewSection.style.backgroundColor = "var(--background-secondary)";
    const previewLabel = previewSection.createEl("div");
    previewLabel.style.marginBottom = "8px";
    previewLabel.style.fontWeight = "600";
    previewLabel.style.fontSize = "14px";
    previewLabel.textContent = this.plugin.t("highlight_preview", "Highlight Preview");
    const previewText = previewSection.createEl("div");
    previewText.style.borderRadius = `${this.plugin.settings.highlightBorderRadius ?? 8}px`;
    previewText.style.display = "inline-block";
    previewText.style.maxWidth = "auto";
    previewText.style.wordWrap = "break-word";
    previewText.textContent = this.plugin.t("highlight_preview_text", "This is how your highlight will look like!");
    const updatePreview = () => {
      const color = "#01c8ff";
      const rgba = this.plugin.hexToRgba(color, this.plugin.settings.backgroundOpacity ?? 25);
      previewText.style.backgroundColor = rgba;
      previewText.style.borderRadius = `${this.plugin.settings.highlightBorderRadius ?? 8}px`;
      previewText.style.paddingLeft = previewText.style.paddingRight = `${this.plugin.settings.highlightHorizontalPadding ?? 4}px`;
      previewText.style.border = "";
      previewText.style.borderTop = "";
      previewText.style.borderBottom = "";
      previewText.style.borderLeft = "";
      previewText.style.borderRight = "";
      if (this.plugin.settings.enableBorderThickness) {
        this.plugin.applyBorderStyleToElement(previewText, null, color);
      }
    };
    updatePreview();
    new Setting(containerEl).setName(this.plugin.t("highlight_opacity", "Highlight opacity")).setDesc(this.plugin.t("highlight_opacity_desc", "Set the opacity of the highlight (0-100%)")).addSlider((slider) => slider.setLimits(0, 100, 1).setValue(this.plugin.settings.backgroundOpacity ?? 25).setDynamicTooltip().onChange(async (v) => {
      this.plugin.settings.backgroundOpacity = v;
      await this.debouncedSaveSettings();
      updatePreview();
    }));
    {
      let brInput;
      new Setting(containerEl).setName(this.plugin.t("highlight_border_radius", "Highlight border radius (px)")).setDesc(this.plugin.t("highlight_border_radius_desc", "Set the border radius (in px) for rounded highlight corners")).addText((text) => {
        brInput = text;
        text.setPlaceholder("e.g. 0, 4, 8").setValue(String(this.plugin.settings.highlightBorderRadius ?? 8)).onChange(async (v) => {
          let val = parseInt(v);
          if (isNaN(val) || val < 0) val = 0;
          this.plugin.settings.highlightBorderRadius = val;
          await this.debouncedSaveSettings();
          updatePreview();
        });
      }).addExtraButton((btn) => btn.setIcon("reset").setTooltip(this.plugin.t("reset_to_8", "Reset to 8")).onClick(async () => {
        this.plugin.settings.highlightBorderRadius = 8;
        await this.debouncedSaveSettings();
        if (brInput) brInput.setValue("8");
        updatePreview();
      }));
    }
    {
      let hpInput;
      new Setting(containerEl).setName(this.plugin.t("highlight_horizontal_padding", "Highlight horizontal padding (px)")).setDesc(this.plugin.t("highlight_horizontal_padding_desc", "Set the left and right padding (in px) for highlighted text")).addText((text) => {
        hpInput = text;
        text.setPlaceholder("e.g. 0, 4, 8").setValue(String(this.plugin.settings.highlightHorizontalPadding ?? 4)).onChange(async (v) => {
          let val = parseInt(v);
          if (isNaN(val) || val < 0) val = 0;
          this.plugin.settings.highlightHorizontalPadding = val;
          await this.debouncedSaveSettings();
          updatePreview();
        });
      }).addExtraButton((btn) => btn.setIcon("reset").setTooltip(this.plugin.t("reset_to_4", "Reset to 4")).onClick(async () => {
        this.plugin.settings.highlightHorizontalPadding = 4;
        await this.debouncedSaveSettings();
        if (hpInput) hpInput.setValue("4");
        updatePreview();
      }));
    }
    new Setting(containerEl).setName(this.plugin.t("rounded_corners_wrapping", "Rounded corners on line wrapping")).setDesc(this.plugin.t("rounded_corners_wrapping_desc", "When enabled, highlights will have rounded corners on all sides, even when text wraps to a new line.")).addToggle((t) => t.setValue(this.plugin.settings.enableBoxDecorationBreak ?? true).onChange(async (v) => {
      this.plugin.settings.enableBoxDecorationBreak = v;
      await this.debouncedSaveSettings();
    }));
    new Setting(containerEl).setName(this.plugin.t("enable_highlight_border", "Enable Highlight Border")).setDesc(this.plugin.t("enable_highlight_border_desc", "Add a border around highlights. The border will match the text or highlight color.")).addToggle((t) => t.setValue(this.plugin.settings.enableBorderThickness ?? false).onChange(async (v) => {
      this.plugin.settings.enableBorderThickness = v;
      await this.plugin.saveSettings();
      updatePreview();
      this._initializedSettingsUI = false;
      this.display();
    }));
    if (this.plugin.settings.enableBorderThickness) {
      new Setting(containerEl).setName(this.plugin.t("border_style", "Border Style")).setDesc(this.plugin.t("border_style_desc", "Choose which sides to apply the border")).addDropdown((d) => {
        d.selectEl.style.width = "200px";
        try {
          d.selectEl.style.textAlign = "center";
        } catch (e) {
        }
        return d.addOption("full", this.plugin.t("opt_border_full", "Full border (all sides)")).addOption("top-bottom", this.plugin.t("opt_border_top_bottom", "Top & Bottom borders")).addOption("left-right", this.plugin.t("opt_border_left_right", "Left & Right borders")).addOption("top-right", this.plugin.t("opt_border_top_right", "Top & Right borders")).addOption("top-left", this.plugin.t("opt_border_top_left", "Top & Left borders")).addOption("bottom-right", this.plugin.t("opt_border_bottom_right", "Bottom & Right borders")).addOption("bottom-left", this.plugin.t("opt_border_bottom_left", "Bottom & Left borders")).addOption("top", this.plugin.t("opt_border_top", "Top border only")).addOption("bottom", this.plugin.t("opt_border_bottom", "Bottom border only")).addOption("left", this.plugin.t("opt_border_left", "Left border only")).addOption("right", this.plugin.t("opt_border_right", "Right border only")).setValue(this.plugin.settings.borderStyle ?? "full").onChange(async (v) => {
          this.plugin.settings.borderStyle = v;
          await this.debouncedSaveSettings();
          updatePreview();
        });
      });
      new Setting(containerEl).setName(this.plugin.t("border_opacity", "Border Opacity")).setDesc(this.plugin.t("border_opacity_desc", "Set the opacity of the border (0-100%)")).addSlider((slider) => slider.setLimits(0, 100, 1).setValue(this.plugin.settings.borderOpacity ?? 100).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.borderOpacity = v;
        await this.debouncedSaveSettings();
        updatePreview();
      }));
      {
        let btInput;
        new Setting(containerEl).setName(this.plugin.t("border_thickness", "Border Thickness (px)")).setDesc(this.plugin.t("border_thickness_desc", "Set the border thickness from 0-5 pixels (e.g. 1, 2.5, 5)")).addText((text) => {
          btInput = text;
          text.setPlaceholder("e.g. 1, 2.5, 3.7").setValue(String(this.plugin.settings.borderThickness ?? 1)).onChange(async (v) => {
            let val = parseFloat(v);
            if (isNaN(val) || val < 0) val = 0;
            if (val > 5) val = 5;
            this.plugin.settings.borderThickness = val;
            await this.debouncedSaveSettings();
            updatePreview();
          });
        }).addExtraButton((btn) => btn.setIcon("reset").setTooltip(this.plugin.t("reset_to_1", "Reset to 1")).onClick(async () => {
          this.plugin.settings.borderThickness = 1;
          await this.debouncedSaveSettings();
          if (btInput) btInput.setValue("1");
          updatePreview();
        }));
      }
    }
    containerEl.createEl("h2", { text: this.plugin.t("color_swatches_header", "Color Swatches") });
    new Setting(containerEl).setName(this.plugin.t("color_picker_layout", "Color Picker Layout")).setDesc(this.plugin.t("color_picker_layout_desc", "Choose which color types to show when picking colors for text")).addDropdown((dd) => {
      dd.addOption("both", this.plugin.t("opt_both_text_left", "Both: Text left, Highlight right"));
      dd.addOption("both-bg-left", this.plugin.t("opt_both_bg_left", "Both: Highlight left, Text right"));
      dd.addOption("text", this.plugin.t("opt_text_only", "Text color only"));
      dd.addOption("background", this.plugin.t("opt_background_only", "Highlight color only"));
      dd.setValue(this.plugin.settings.colorPickerMode || "both");
      try {
        dd.selectEl.style.minWidth = "230px";
      } catch (e) {
      }
      try {
        dd.selectEl.style.textAlign = "center";
      } catch (e) {
      }
      dd.onChange(async (v) => {
        this.plugin.settings.colorPickerMode = v;
        await this.plugin.saveSettings();
      });
    });
    new Setting(containerEl).setName(this.plugin.t("enable_custom_swatches", "Enable custom swatches")).setDesc(this.plugin.t("enable_custom_swatches_desc", "Turn this on if you want to pick your own colors for the color picker.")).addToggle((t) => t.setValue(this.plugin.settings.customSwatchesEnabled).onChange(async (v) => {
      this.plugin.settings.customSwatchesEnabled = v;
      await this.plugin.saveSettings();
      this._refreshCustomSwatches();
    }));
    this._customSwatchesContainer = containerEl.createDiv();
    this._refreshCustomSwatches();
    const headerEl = containerEl.createEl("h3", { text: this.plugin.t("always_colored_texts_header", "Always Colored Texts") });
    try {
      headerEl.id = "always-colored-texts-header";
    } catch (e) {
    }
    try {
      headerEl.style.marginTop = "20px !important";
    } catch (e) {
    }
    containerEl.createEl("p", { text: this.plugin.t("always_colored_texts_desc", "Here's where you manage your word / patterns and their colors.") });
    new Setting(containerEl);
    const entriesSearchContainer = containerEl.createDiv();
    try {
      entriesSearchContainer.addClass("act-search-container");
    } catch (e) {
      try {
        entriesSearchContainer.classList.add("act-search-container");
      } catch (_) {
      }
    }
    entriesSearchContainer.style.margin = "8px 0";
    entriesSearchContainer.style.marginTop = "-10px";
    const entriesSearch = entriesSearchContainer.createEl("input", { type: "text" });
    try {
      entriesSearch.addClass("act-search-input");
    } catch (e) {
      try {
        entriesSearch.classList.add("act-search-input");
      } catch (_) {
      }
    }
    entriesSearch.placeholder = this.plugin.t("search_colored_words_placeholder", "Search colored words/patterns\u2026");
    entriesSearch.style.width = "100%";
    entriesSearch.style.padding = "6px";
    entriesSearch.style.border = "1px solid var(--background-modifier-border)";
    entriesSearch.style.borderRadius = "4px";
    const entriesIcon = entriesSearchContainer.createDiv();
    try {
      entriesIcon.addClass("act-search-icon");
    } catch (e) {
      try {
        entriesIcon.classList.add("act-search-icon");
      } catch (_) {
      }
    }
    const entriesSearchHandler = () => {
      this._entriesSearchQuery = String(entriesSearch.value || "").trim().toLowerCase();
      try {
        this._refreshEntries();
      } catch (e) {
      }
    };
    entriesSearch.addEventListener("input", entriesSearchHandler);
    this._cleanupHandlers.push(() => entriesSearch.removeEventListener("input", entriesSearchHandler));
    const listDiv = containerEl.createDiv();
    listDiv.addClass("color-words-list");
    try {
      this._refreshEntries();
    } catch (e) {
    }
    const buttonRowDiv = containerEl.createDiv();
    buttonRowDiv.addClass("entries-button-row");
    const sortBtn = buttonRowDiv.createEl("button");
    const sortModes = ["last-added", "a-z", "reverse-a-z", "style-order", "color"];
    const sortLabels = {
      "last-added": this.plugin.t("sort_label_last-added", "Sort: Last Added"),
      "a-z": this.plugin.t("sort_label_a-z", "Sort: A-Z"),
      "reverse-a-z": this.plugin.t("sort_label_reverse-a-z", "Sort: Z-A"),
      "style-order": this.plugin.t("sort_label_style-order", "Sort: Style Order"),
      "color": this.plugin.t("sort_label_color", "Sort: Color")
    };
    sortBtn.textContent = this.plugin.t("sort_label_" + (this._wordsSortMode || "last-added"), sortLabels[this._wordsSortMode] || "Sort: Last Added");
    sortBtn.style.cursor = "pointer";
    sortBtn.style.flex = "0 0 auto";
    const sortBtnHandler = async () => {
      const currentIndex = sortModes.indexOf(this._wordsSortMode);
      const nextIndex = (currentIndex + 1) % sortModes.length;
      this._wordsSortMode = sortModes[nextIndex];
      sortBtn.textContent = sortLabels[this._wordsSortMode];
      try {
        this.plugin.settings.wordsSortMode = this._wordsSortMode;
        await this.plugin.saveSettings();
      } catch (e) {
      }
      this._refreshEntries();
    };
    sortBtn.addEventListener("click", sortBtnHandler);
    this._cleanupHandlers.push(() => sortBtn.removeEventListener("click", sortBtnHandler));
    const addWordsBtn = buttonRowDiv.createEl("button");
    addWordsBtn.textContent = this.plugin.t("btn_add_words", "+ Add Words");
    addWordsBtn.style.cursor = "pointer";
    addWordsBtn.style.flex = "1";
    addWordsBtn.addClass("mod-cta");
    const addWordsHandler = async () => {
      const uid = (() => {
        try {
          return Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          return Date.now();
        }
      })();
      this.plugin.settings.wordEntries.push({ pattern: "", color: "", isRegex: false, flags: "", groupedPatterns: null, styleType: "text", uid, persistAtEnd: true });
      this._suspendSorting = true;
      try {
        this._newEntriesSet && this._newEntriesSet.add(uid);
      } catch (e) {
      }
      await this.plugin.saveSettings();
      this.plugin.reconfigureEditorExtensions();
      this.plugin.forceRefreshAllEditors();
      this.plugin.forceRefreshAllReadingViews();
      this._refreshEntries();
    };
    addWordsBtn.addEventListener("click", addWordsHandler);
    this._cleanupHandlers.push(() => addWordsBtn.removeEventListener("click", addWordsHandler));
    const addRegexBtn = buttonRowDiv.createEl("button");
    addRegexBtn.textContent = this.plugin.t("btn_add_regex", "+ Add Regex");
    addRegexBtn.style.cursor = "pointer";
    addRegexBtn.style.flex = "1";
    addRegexBtn.addClass("mod-cta");
    addRegexBtn.style.display = this.plugin.settings.enableRegexSupport ? "" : "none";
    const addRegexHandler = () => {
      try {
        this._suspendSorting = true;
        const onAdded = (entry) => {
          try {
            if (entry && entry.uid) {
              this._newEntriesSet && this._newEntriesSet.add(entry.uid);
            }
            this._refreshEntries();
          } catch (e) {
          }
        };
        new RealTimeRegexTesterModal(this.app, this.plugin, onAdded).open();
      } catch (e) {
      }
    };
    addRegexBtn.addEventListener("click", addRegexHandler);
    this._cleanupHandlers.push(() => addRegexBtn.removeEventListener("click", addRegexHandler));
    const presetsBtn = buttonRowDiv.createEl("button");
    presetsBtn.textContent = this.plugin.t("btn_presets", "Presets");
    presetsBtn.style.cursor = "pointer";
    presetsBtn.style.flex = "0 0 auto";
    const presetsHandler = () => {
      new PresetModal(this.app, this.plugin, async (preset) => {
        if (!preset) return;
        new ColorPickerModal(this.app, this.plugin, async (color, result) => {
          const sel = result || {};
          const tc = sel.textColor && this.plugin.isValidHexColor(sel.textColor) ? sel.textColor : null;
          const bc = sel.backgroundColor && this.plugin.isValidHexColor(sel.backgroundColor) ? sel.backgroundColor : null;
          if (!tc && !bc && (!color || !this.plugin.isValidHexColor(color))) return;
          const entry = { pattern: preset.pattern, isRegex: true, flags: preset.flags || "", groupedPatterns: null, presetLabel: preset.label, persistAtEnd: true };
          try {
            entry.uid = Date.now().toString(36) + Math.random().toString(36).slice(2);
          } catch (e) {
            entry.uid = Date.now();
          }
          if (tc && bc) {
            entry.textColor = tc;
            entry.backgroundColor = bc;
            entry.color = "";
            entry.styleType = "both";
            entry._savedTextColor = tc;
            entry._savedBackgroundColor = bc;
          } else if (tc) {
            entry.color = tc;
            entry.styleType = "text";
            entry._savedTextColor = tc;
          } else if (bc) {
            entry.textColor = "currentColor";
            entry.backgroundColor = bc;
            entry.color = "";
            entry.styleType = "highlight";
            entry._savedBackgroundColor = bc;
          } else {
            entry.color = color;
            entry._savedTextColor = color;
          }
          this.plugin.settings.wordEntries.push(entry);
          this._suspendSorting = true;
          try {
            this._newEntriesSet && entry && entry.uid && this._newEntriesSet.add(entry.uid);
          } catch (e) {
          }
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this._refreshEntries();
        }, "text-and-background", "", false).open();
      }).open();
    };
    presetsBtn.addEventListener("click", presetsHandler);
    this._cleanupHandlers.push(() => presetsBtn.removeEventListener("click", presetsHandler));
    new Setting(containerEl).addExtraButton((b) => b.setIcon("trash").setTooltip(this.plugin.t("tooltip_delete_all_words", "Delete all defined words/patterns")).onClick(async () => {
      new ConfirmationModal(this.app, this.plugin.t("confirm_delete_all_title", "Delete all words"), this.plugin.t("confirm_delete_all_desc", "Are you sure you want to delete all your colored words/patterns? You can't undo this!"), async () => {
        this.plugin.settings.wordEntries = [];
        await this.plugin.saveSettings();
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this._refreshEntries();
      }).open();
    }));
    containerEl.createEl("h2", { text: this.plugin.t("blacklist_words_header", "Blacklist words") });
    containerEl.createEl("p", { text: this.plugin.t("blacklist_words_desc", "Keywords or patterns here will never be colored, even for partial matches.") });
    new Setting(containerEl).setName(this.plugin.t("show_blacklist_menu", "Show Blacklist words in right-click menu")).setDesc(this.plugin.t("show_blacklist_menu_desc", "Adds a right-click menu item to blacklist selected text from coloring.")).addToggle((t) => t.setValue(this.plugin.settings.enableBlacklistMenu).onChange(async (v) => {
      this.plugin.settings.enableBlacklistMenu = v;
      await this.plugin.saveSettings();
    }));
    const blSearchContainer = containerEl.createDiv();
    try {
      blSearchContainer.addClass("act-search-container");
    } catch (e) {
      try {
        blSearchContainer.classList.add("act-search-container");
      } catch (_) {
      }
    }
    blSearchContainer.style.margin = "8px 0";
    const blSearch = blSearchContainer.createEl("input", { type: "text" });
    try {
      blSearch.addClass("act-search-input");
    } catch (e) {
      try {
        blSearch.classList.add("act-search-input");
      } catch (_) {
      }
    }
    blSearch.placeholder = this.plugin.t("search_blacklist_placeholder", "Search blacklisted words or patterns\u2026");
    blSearch.style.width = "100%";
    blSearch.style.padding = "6px";
    blSearch.style.border = "1px solid var(--background-modifier-border)";
    blSearch.style.borderRadius = "4px";
    const blIcon = blSearchContainer.createDiv();
    try {
      blIcon.addClass("act-search-icon");
    } catch (e) {
      try {
        blIcon.classList.add("act-search-icon");
      } catch (_) {
      }
    }
    const blSearchHandler = () => {
      this._blacklistSearchQuery = String(blSearch.value || "").trim().toLowerCase();
      try {
        this._refreshBlacklistWords();
      } catch (e) {
      }
    };
    blSearch.addEventListener("input", blSearchHandler);
    this._cleanupHandlers.push(() => blSearch.removeEventListener("input", blSearchHandler));
    this._blacklistWordsContainer = containerEl.createDiv();
    this._blacklistWordsContainer.addClass("blacklist-words-list");
    this._refreshBlacklistWords();
    const blacklistButtonRowDiv = containerEl.createDiv();
    blacklistButtonRowDiv.addClass("blacklist-button-row");
    const blacklistSortBtn = blacklistButtonRowDiv.createEl("button");
    const blSortModes = ["last-added", "a-z", "reverse-a-z"];
    const blSortLabels = {
      "last-added": this.plugin.t("blacklist_sort_label_last-added", "Sort: Last Added"),
      "a-z": this.plugin.t("blacklist_sort_label_a-z", "Sort: A-Z"),
      "reverse-a-z": this.plugin.t("blacklist_sort_label_reverse-a-z", "Sort: Z-A")
    };
    blacklistSortBtn.textContent = blSortLabels[this._blacklistSortMode] || "Sort: Last Added";
    blacklistSortBtn.style.cursor = "pointer";
    blacklistSortBtn.style.flex = "0 0 auto";
    const blacklistSortHandler = async () => {
      const i = blSortModes.indexOf(this._blacklistSortMode);
      const ni = (i + 1) % blSortModes.length;
      this._blacklistSortMode = blSortModes[ni];
      blacklistSortBtn.textContent = blSortLabels[this._blacklistSortMode];
      try {
        this.plugin.settings.blacklistSortMode = this._blacklistSortMode;
        await this.plugin.saveSettings();
      } catch (e) {
      }
      this._refreshBlacklistWords();
    };
    blacklistSortBtn.addEventListener("click", blacklistSortHandler);
    this._cleanupHandlers.push(() => blacklistSortBtn.removeEventListener("click", blacklistSortHandler));
    const blacklistAddBtn = blacklistButtonRowDiv.createEl("button");
    blacklistAddBtn.textContent = this.plugin.t("btn_add_blacklist_word", "+ Add blacklist word");
    blacklistAddBtn.style.cursor = "pointer";
    blacklistAddBtn.style.flex = "1";
    blacklistAddBtn.addClass("mod-cta");
    const blacklistAddHandler = async () => {
      const uid = (() => {
        try {
          return Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          return Date.now();
        }
      })();
      const newEntry = { pattern: "", isRegex: false, flags: "", groupedPatterns: null, uid, persistAtEnd: true };
      if (!Array.isArray(this.plugin.settings.blacklistEntries)) this.plugin.settings.blacklistEntries = [];
      this.plugin.settings.blacklistEntries.push(newEntry);
      this._suspendSorting = true;
      try {
        this._blacklistNewSet && this._blacklistNewSet.add(uid);
      } catch (e) {
      }
      await this.plugin.saveSettings();
      this._refreshBlacklistWords();
    };
    blacklistAddBtn.addEventListener("click", blacklistAddHandler);
    this._cleanupHandlers.push(() => blacklistAddBtn.removeEventListener("click", blacklistAddHandler));
    const blacklistAddRegexBtn = blacklistButtonRowDiv.createEl("button");
    blacklistAddRegexBtn.textContent = this.plugin.t("btn_add_blacklist_regex", "+ Add blacklist regex");
    blacklistAddRegexBtn.style.cursor = "pointer";
    blacklistAddRegexBtn.style.flex = "1";
    blacklistAddRegexBtn.addClass("mod-cta");
    blacklistAddRegexBtn.style.display = this.plugin.settings.enableRegexSupport ? "" : "none";
    const blacklistAddRegexHandler = () => {
      try {
        const onAdded = (entry) => {
          try {
            if (entry && entry.uid) {
              this._blacklistNewSet && this._blacklistNewSet.add(entry.uid);
            }
            this._refreshBlacklistWords();
          } catch (e) {
          }
        };
        new BlacklistRegexTesterModal(this.app, this.plugin, onAdded).open();
      } catch (e) {
      }
    };
    blacklistAddRegexBtn.addEventListener("click", blacklistAddRegexHandler);
    this._cleanupHandlers.push(() => blacklistAddRegexBtn.removeEventListener("click", blacklistAddRegexHandler));
    const blacklistPresetsBtn = blacklistButtonRowDiv.createEl("button");
    blacklistPresetsBtn.textContent = this.plugin.t("btn_presets", "Presets");
    blacklistPresetsBtn.style.cursor = "pointer";
    blacklistPresetsBtn.style.flex = "0 0 auto";
    const blacklistPresetsHandler = () => {
      new PresetModal(this.app, this.plugin, async (preset) => {
        if (!preset) return;
        const newEntry = { pattern: preset.pattern, isRegex: true, flags: preset.flags || "", groupedPatterns: null, presetLabel: preset.label, persistAtEnd: true };
        try {
          newEntry.uid = Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          newEntry.uid = Date.now();
        }
        if (!Array.isArray(this.plugin.settings.blacklistEntries)) this.plugin.settings.blacklistEntries = [];
        this.plugin.settings.blacklistEntries.push(newEntry);
        this._suspendSorting = true;
        try {
          this._blacklistNewSet && newEntry && newEntry.uid && this._blacklistNewSet.add(newEntry.uid);
        } catch (e) {
        }
        await this.plugin.saveSettings();
        this._refreshBlacklistWords();
      }).open();
    };
    blacklistPresetsBtn.addEventListener("click", blacklistPresetsHandler);
    this._cleanupHandlers.push(() => blacklistPresetsBtn.removeEventListener("click", blacklistPresetsHandler));
    new Setting(containerEl).addExtraButton((b) => b.setIcon("trash").setTooltip(this.plugin.t("tooltip_delete_all_blacklist", "Delete all blacklisted words/patterns")).onClick(async () => {
      new ConfirmationModal(this.app, this.plugin.t("confirm_delete_all_blacklist_title", "Delete all blacklisted words"), this.plugin.t("confirm_delete_all_blacklist_desc", "Are you sure you want to delete all blacklist entries? You can't undo this!"), async () => {
        this.plugin.settings.blacklistEntries = [];
        await this.plugin.saveSettings();
        this._refreshBlacklistWords();
      }).open();
    }));
    containerEl.createEl("h3", { text: this.plugin.t("file_folder_rules_header", "File & Folder Coloring Rules") });
    containerEl.createEl("p", { text: this.plugin.t("file_folder_rules_desc", "Control coloring with name matching, exact paths, or regex patterns. Leave an empty exclude entry to disable coloring vault-wide.") });
    const prSearchContainer = containerEl.createDiv();
    try {
      prSearchContainer.addClass("act-search-container");
    } catch (e) {
      try {
        prSearchContainer.classList.add("act-search-container");
      } catch (_) {
      }
    }
    prSearchContainer.style.margin = "8px 0";
    const prSearch = prSearchContainer.createEl("input", { type: "text" });
    try {
      prSearch.addClass("act-search-input");
    } catch (e) {
      try {
        prSearch.classList.add("act-search-input");
      } catch (_) {
      }
    }
    prSearch.placeholder = this.plugin.t("search_file_folder_rules_placeholder", "Search file/folder rules\u2026");
    prSearch.style.width = "100%";
    prSearch.style.padding = "6px";
    prSearch.style.border = "1px solid var(--background-modifier-border)";
    prSearch.style.borderRadius = "4px";
    const prIcon = prSearchContainer.createDiv();
    try {
      prIcon.addClass("act-search-icon");
    } catch (e) {
      try {
        prIcon.classList.add("act-search-icon");
      } catch (_) {
      }
    }
    const prSearchHandler = () => {
      this._pathRulesSearchQuery = String(prSearch.value || "").trim().toLowerCase();
      try {
        this._refreshPathRules();
      } catch (e) {
      }
    };
    prSearch.addEventListener("input", prSearchHandler);
    prSearch.addEventListener("click", prSearchHandler);
    this._cleanupHandlers.push(() => prSearch.removeEventListener("input", prSearchHandler));
    this._pathRulesContainer = containerEl.createDiv();
    this._pathRulesContainer.addClass("path-rules-list");
    this._refreshPathRules();
    const pathBtnRow = containerEl.createDiv();
    pathBtnRow.addClass("path-button-row");
    const pathSortBtn = pathBtnRow.createEl("button");
    const pathSortModes = ["last-added", "a-z", "reverse-a-z", "mode", "type"];
    const pathSortLabels = { "last-added": "Sort: Last Added", "a-z": "Sort: A-Z", "reverse-a-z": "Sort: Z-A", "mode": "Sort: Mode", "type": "Sort: Type" };
    pathSortBtn.textContent = this.plugin.t("path_sort_label_" + (this._pathSortMode || "last-added"), pathSortLabels[this._pathSortMode] || "Sort: Last Added");
    pathSortBtn.style.cursor = "pointer";
    pathSortBtn.style.flex = "0 0 auto";
    const pathSortHandler = async () => {
      const i = pathSortModes.indexOf(this._pathSortMode);
      const ni = (i + 1) % pathSortModes.length;
      this._pathSortMode = pathSortModes[ni];
      pathSortBtn.textContent = this.plugin.t("path_sort_label_" + (this._pathSortMode || "last-added"), pathSortLabels[this._pathSortMode] || "Sort: Last Added");
      try {
        this.plugin.settings.pathSortMode = this._pathSortMode;
        await this.plugin.saveSettings();
      } catch (e) {
      }
      this._refreshPathRules();
    };
    pathSortBtn.addEventListener("click", pathSortHandler);
    this._cleanupHandlers.push(() => pathSortBtn.removeEventListener("click", pathSortHandler));
    const pathAddBtn = pathBtnRow.createEl("button");
    pathAddBtn.textContent = this.plugin.t("btn_add_file_folder_rule", "+ Add file/folder rule");
    pathAddBtn.style.cursor = "pointer";
    pathAddBtn.style.flex = "1";
    pathAddBtn.addClass("mod-cta");
    const pathAddHandler = async () => {
      const newEntry = { path: "", mode: "include", matchType: "has-name" };
      if (!Array.isArray(this.plugin.settings.pathRules)) this.plugin.settings.pathRules = [];
      this.plugin.settings.pathRules.push(newEntry);
      this._suspendSorting = true;
      await this.plugin.saveSettings();
      this._refreshPathRules();
    };
    pathAddBtn.addEventListener("click", pathAddHandler);
    this._cleanupHandlers.push(() => pathAddBtn.removeEventListener("click", pathAddHandler));
    new Setting(containerEl).setName(this.plugin.t("disable_coloring_current_file", "Disable coloring for current file")).setDesc(this.plugin.t("disable_coloring_current_file_desc", "Adds an exclude rule for the active file under File & Folder Coloring Rules.")).addButton((b) => b.setButtonText(this.plugin.t("btn_disable_for_this_file", "Disable for this file")).onClick(async () => {
      const md = this.app.workspace.getActiveFile();
      if (!md) {
        new Notice(this.plugin.t("notice_no_active_file_to_disable", "No active file to disable coloring for."));
        return;
      }
      const p = String(md.path || "");
      if (!Array.isArray(this.plugin.settings.pathRules)) this.plugin.settings.pathRules = [];
      const np = this.plugin.normalizePath(p);
      const exists = this.plugin.settings.pathRules.some((r) => r && r.mode === "exclude" && !r.isFolder && this.plugin.normalizePath(String(r.path || "")) === np);
      if (exists) {
        new Notice(this.plugin.t("notice_already_disabled_for_path", `Coloring is already disabled for {path}`, { path: md.path }));
        return;
      }
      this.plugin.settings.pathRules.push({ path: p, mode: "exclude", isFolder: false });
      await this.plugin.saveSettings();
      this._refreshPathRules();
      this._initializedSettingsUI = false;
      try {
        this.display();
      } catch (e) {
      }
      new Notice(this.plugin.t("notice_coloring_disabled_for_path", `Coloring disabled for {path}`, { path: md.path }));
    }));
    this._disabledFilesContainer = containerEl.createDiv();
    this._refreshDisabledFiles();
    containerEl.createEl("hr");
    const advRow = containerEl.createDiv();
    advRow.style.display = "flex";
    advRow.style.alignItems = "center";
    advRow.style.justifyContent = "space-between";
    advRow.style.marginTop = "12px";
    advRow.style.flexWrap = "wrap";
    const advTitle = advRow.createEl("h2", { text: this.plugin.t("advanced_rules_header", "Advanced Rules") });
    advTitle.style.margin = "0";
    advTitle.style.flex = "1 1 auto";
    const manageBtn = advRow.createEl("button", { text: this.plugin.t("advanced_rules_manage_button", "manage advanced rules") });
    manageBtn.addClass("mod-cta");
    manageBtn.style.flex = "0 0 auto";
    manageBtn.style.marginTop = "8px";
    manageBtn.style.cursor = "pointer";
    const manageHandler = () => {
      try {
        new ManageRulesModal(this.app, this.plugin).open();
      } catch (e) {
      }
    };
    manageBtn.addEventListener("click", manageHandler);
    this._cleanupHandlers.push(() => manageBtn.removeEventListener("click", manageHandler));
    containerEl.createEl("hr");
    containerEl.createEl("h2", { text: this.plugin.t("data_export_import_header", "Data Export/Import") });
    new Setting(containerEl).setName(this.plugin.t("export_plugin_data", "Export plugin data")).setDesc(this.plugin.t("export_plugin_data_desc", "Export settings, words, and rules to a JSON file.")).addButton((b) => b.setButtonText(this.plugin.t("btn_export", "Export")).onClick(async () => {
      try {
        const fname = await this.plugin.exportSettingsToPickedLocation();
        new Notice(this.plugin.t("notice_exported", `Exported: {fname}`, { fname }));
      } catch (e) {
        new Notice(this.plugin.t("notice_export_failed", "Export failed"));
      }
    }));
    new Setting(containerEl).setName(this.plugin.t("import_plugin_data", "Import plugin data")).setDesc(this.plugin.t("import_plugin_data_desc", "Import settings from a JSON file")).addButton((b) => b.setButtonText(this.plugin.t("btn_import", "Import")).onClick(() => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.addEventListener("change", () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            await this.plugin.importSettingsFromJson(String(reader.result || ""));
            this._initializedSettingsUI = false;
            this.display();
            new Notice(this.plugin.t("notice_import_completed", "Import completed"));
          } catch (e) {
            new Notice(this.plugin.t("notice_import_failed", "Import failed"));
          }
        };
        reader.readAsText(file);
      });
      input.click();
    }));
  }
  // Method to focus and/or create a text & background coloring entry with pre-filled text
  async focusTextBgEntry(selectedText) {
    try {
      if (!selectedText || !this.containerEl) return;
      let foundEntry = (Array.isArray(this.plugin.settings.wordEntries) ? this.plugin.settings.wordEntries : []).find(
        (e) => e && (e.pattern === selectedText || Array.isArray(e.groupedPatterns) && e.groupedPatterns.includes(selectedText))
      );
      let isNewEntry = false;
      if (!foundEntry) {
        isNewEntry = true;
        foundEntry = {
          pattern: selectedText,
          color: "",
          textColor: "currentColor",
          backgroundColor: "",
          isRegex: false,
          flags: "",
          groupedPatterns: null
        };
        if (!Array.isArray(this.plugin.settings.wordEntries)) this.plugin.settings.wordEntries = [];
        this.plugin.settings.wordEntries.push(foundEntry);
        this.plugin.compileTextBgColoringEntries();
        await this.plugin.saveSettings();
        this._initializedSettingsUI = false;
        this.display();
      }
      setTimeout(() => {
        const textBgListDiv = this.containerEl.querySelector(".text-bg-coloring-list");
        if (textBgListDiv) {
          textBgListDiv.scrollIntoView({ behavior: "auto", block: "center" });
          setTimeout(() => {
            const inputs = textBgListDiv.querySelectorAll('input[type="text"]');
            for (const input of inputs) {
              if (input.value.includes(selectedText)) {
                input.focus();
                input.select();
                input.style.borderColor = "var(--color-accent)";
                input.style.boxShadow = "0 0 0 2px var(--color-accent-1)";
                input.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
                setTimeout(() => {
                  input.style.borderColor = "var(--background-modifier-border)";
                  input.style.boxShadow = "none";
                }, 3e3);
                break;
              }
            }
          }, 300);
        }
      }, isNewEntry ? 500 : 100);
    } catch (e) {
      debugError("FOCUS_TEXTBG", "Failed to focus text bg entry", e);
    }
  }
};
var ColorPickerModal = class extends Modal {
  constructor(app, plugin, callback, mode = "text", selectedText = "", isQuickOnce = false) {
    super(app);
    this.plugin = plugin;
    this.callback = callback;
    this.mode = mode === "background" || mode === "text-and-background" ? mode : "text";
    this._selectedText = selectedText || "";
    this._eventListeners = [];
    this.isQuickOnce = !!isQuickOnce;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this._eventListeners = [];
    const cpm = this.plugin.settings.colorPickerMode || "both";
    const forcedSingle = this.mode === "text" || this.mode === "background";
    const isBoth = !forcedSingle && (cpm === "both" || cpm === "both-bg-left");
    this.modalEl.style.maxWidth = isBoth ? "650px" : "480px";
    this.modalEl.style.width = "100%";
    this.modalEl.style.margin = "0";
    this.modalEl.style.padding = "0";
    contentEl.style.padding = "24px";
    contentEl.style.boxSizing = "border-box";
    contentEl.style.display = "grid";
    contentEl.style.gridTemplateColumns = isBoth ? "1fr 1fr" : "1fr";
    contentEl.style.gap = "10px";
    const h2 = contentEl.createEl("h2", { text: this.plugin.t("pick_color_header", "Pick Color") });
    h2.style.marginTop = "0";
    h2.style.marginBottom = "16px";
    h2.style.gridColumn = "1 / -1";
    this.selectedTextColor = null;
    this.selectedBgColor = null;
    const previewWrap = contentEl.createDiv();
    previewWrap.style.border = "1px solid var(--background-modifier-border)";
    previewWrap.style.borderRadius = "14px";
    previewWrap.style.padding = "14px";
    previewWrap.style.marginBottom = "0";
    previewWrap.style.display = "flex";
    previewWrap.style.alignItems = "center";
    previewWrap.style.justifyContent = "center";
    previewWrap.style.gridColumn = "1 / -1";
    const preview = previewWrap.createDiv();
    preview.textContent = this._selectedText || this.plugin.t("selected_text_preview", "Selected Text");
    preview.style.display = "inline-block";
    preview.style.borderRadius = "8px";
    preview.style.fontWeight = "600";
    preview.style.backgroundColor = "";
    preview.style.color = "";
    if (this.isQuickOnce) {
      try {
        preview.style.backgroundColor = "";
        preview.style.border = "";
        preview.style.borderTop = "";
        preview.style.borderBottom = "";
        preview.style.borderLeft = "";
        preview.style.borderRight = "";
        preview.style.borderRadius = "";
        preview.style.paddingLeft = "";
        preview.style.paddingRight = "";
      } catch (e) {
      }
    }
    const updateGridCols = () => {
      try {
        contentEl.style.gridTemplateColumns = isBoth && window.innerWidth > 768 ? "1fr 1fr" : "1fr";
      } catch (e) {
      }
    };
    updateGridCols();
    try {
      window.addEventListener("resize", updateGridCols);
      this._eventListeners.push({ el: window, event: "resize", handler: updateGridCols });
    } catch (e) {
    }
    const defaultSwatches = [
      "#eb3b5a",
      "#fa8231",
      "#e5a216",
      "#20bf6b",
      "#0fb9b1",
      "#2d98da",
      "#3867d6",
      "#5454d0",
      "#8854d0",
      "#b554d0",
      "#e832c1",
      "#e83289",
      "#965b3b",
      "#8392a4"
    ];
    const namedSwatches = Array.isArray(this.plugin.settings.swatches) ? this.plugin.settings.swatches : [];
    const namedColors = namedSwatches.map((sw) => sw && sw.color).filter(Boolean);
    const userCustomSwatches = Array.isArray(this.plugin.settings.userCustomSwatches) ? this.plugin.settings.userCustomSwatches : [];
    const userCustomColors = userCustomSwatches.map((sw) => sw && sw.color).filter((c) => typeof c === "string" && this.plugin.isValidHexColor(c));
    let colorPool = [];
    const replaceDefaults = !!this.plugin.settings.replaceDefaultSwatches;
    if (replaceDefaults && userCustomColors.length > 0) {
      colorPool = userCustomColors;
    } else if (replaceDefaults && namedColors.length > 0 && userCustomColors.length === 0) {
      colorPool = namedColors;
    } else if (!replaceDefaults) {
      colorPool = namedColors.concat(userCustomColors);
    } else {
      colorPool = namedColors;
    }
    const seen = /* @__PURE__ */ new Set();
    const swatchItems = [];
    for (const c of colorPool) {
      if (!c || typeof c !== "string") continue;
      const lc = c.toLowerCase();
      if (!this.plugin.isValidHexColor(c)) continue;
      if (seen.has(lc)) continue;
      seen.add(lc);
      const match = namedSwatches.find((sw) => sw && sw.color && sw.color.toLowerCase() === lc);
      const customMatch = userCustomSwatches.find((sw) => sw && sw.color && sw.color.toLowerCase() === lc);
      swatchItems.push({ color: c, name: customMatch && customMatch.name || match && match.name });
    }
    const panelStates = {};
    const buildPanel = (titleText, type) => {
      const col = contentEl.createDiv();
      col.style.border = "1px solid var(--background-modifier-border)";
      col.style.borderRadius = "12px";
      col.style.padding = "12px";
      col.addClass("color-picker-panel");
      col.style.marginBottom = "-23px";
      const header = col.createDiv();
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.gap = "8px";
      const label = header.createEl("div", { text: titleText });
      label.style.opacity = "0.9";
      const resetBtn = header.createEl("button", { text: "Reset" });
      resetBtn.style.marginLeft = "auto";
      resetBtn.style.fontSize = "12px";
      resetBtn.style.padding = "4px 8px";
      const row = col.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "10px";
      row.style.marginTop = "10px";
      row.style.flexWrap = "wrap";
      const colorInput = row.createEl("input", { type: "color" });
      colorInput.title = titleText;
      colorInput.style.width = "44px";
      colorInput.style.height = "44px";
      colorInput.style.border = "none";
      colorInput.style.borderRadius = "12px";
      colorInput.style.cursor = "pointer";
      colorInput.value = "#000000";
      const hex = row.createEl("input", { type: "text" });
      hex.title = titleText;
      hex.style.flex = "1";
      hex.style.padding = "8px";
      hex.style.borderRadius = "8px";
      hex.style.border = "1px solid var(--background-modifier-border)";
      hex.style.width = "120px";
      hex.placeholder = "#000000";
      hex.value = "";
      const grid = col.createDiv();
      grid.title = titleText;
      grid.addClass("color-swatch-grid");
      const apply = (val) => {
        if (type === "text") {
          this.selectedTextColor = val;
          preview.style.color = val;
          try {
            preview.style.setProperty("--highlight-color", val);
          } catch (e) {
          }
        } else {
          this.selectedBgColor = val;
          preview.style.border = "";
          preview.style.borderTop = "";
          preview.style.borderBottom = "";
          preview.style.borderLeft = "";
          preview.style.borderRight = "";
          if (this.isQuickOnce) {
            if (this.plugin.settings.quickHighlightUseGlobalStyle) {
              const rgba = this.plugin.hexToRgba(val, this.plugin.settings.backgroundOpacity ?? 25);
              const radius = this.plugin.settings.highlightBorderRadius ?? 8;
              const pad = this.plugin.settings.highlightHorizontalPadding ?? 4;
              preview.style.backgroundColor = rgba;
              preview.style.borderRadius = radius + "px";
              preview.style.paddingLeft = preview.style.paddingRight = pad + "px";
              if (this.plugin.settings.enableBoxDecorationBreak ?? true) {
                preview.style.boxDecorationBreak = "clone";
                preview.style.WebkitBoxDecorationBreak = "clone";
              }
              this.plugin.applyBorderStyleToElement(preview, null, val);
            } else if (this.plugin.settings.quickHighlightStyleEnable) {
              const hexWithAlpha = this.plugin.hexToHexWithAlpha(val, this.plugin.settings.quickHighlightOpacity ?? 25);
              const radius = this.plugin.settings.quickHighlightBorderRadius ?? 8;
              const pad = this.plugin.settings.quickHighlightHorizontalPadding ?? 4;
              preview.style.backgroundColor = hexWithAlpha;
              preview.style.borderRadius = radius + "px";
              preview.style.paddingLeft = preview.style.paddingRight = pad + "px";
              const borderCss = this.plugin.generateOnceBorderStyle(val);
              try {
                preview.style.cssText += borderCss;
              } catch (e) {
              }
            } else {
              const rgba = this.plugin.hexToRgba(val, 25);
              preview.style.backgroundColor = rgba;
              preview.style.borderRadius = "";
              preview.style.paddingLeft = preview.style.paddingRight = "";
            }
          } else {
            const rgba = this.plugin.hexToRgba(val, this.plugin.settings.backgroundOpacity ?? 25);
            preview.style.backgroundColor = rgba;
            this.plugin.applyBorderStyleToElement(preview, null, val);
            preview.style.paddingLeft = preview.style.paddingRight = (this.plugin.settings.highlightHorizontalPadding ?? 4) + "px";
            if ((this.plugin.settings.highlightHorizontalPadding ?? 4) > 0 && (this.plugin.settings.highlightBorderRadius ?? 8) === 0) {
              preview.style.borderRadius = "0px";
            } else {
              preview.style.borderRadius = (this.plugin.settings.highlightBorderRadius ?? 8) + "px";
            }
            if (this.plugin.settings.enableBoxDecorationBreak ?? true) {
              preview.style.boxDecorationBreak = "clone";
              preview.style.WebkitBoxDecorationBreak = "clone";
            }
          }
        }
        hex.value = val;
        colorInput.value = val;
      };
      const colorChange = () => {
        const v = colorInput.value;
        apply(v);
      };
      colorInput.addEventListener("input", colorChange);
      this._eventListeners.push({ el: colorInput, event: "input", handler: colorChange });
      colorInput.addEventListener("change", colorChange);
      this._eventListeners.push({ el: colorInput, event: "change", handler: colorChange });
      const hexChange = () => {
        let v = hex.value.trim();
        if (!v.startsWith("#")) v = "#" + v;
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v)) {
          apply(v);
        } else {
          new Notice(this.plugin.t("notice_invalid_hex_format", "Invalid hex color format. Use #RRGGBB or #RGB."));
        }
      };
      hex.addEventListener("change", hexChange);
      this._eventListeners.push({ el: hex, event: "change", handler: hexChange });
      const resetHandler = () => {
        if (type === "text") {
          this.selectedTextColor = null;
          preview.style.color = "";
        } else {
          this.selectedBgColor = null;
          preview.style.backgroundColor = "";
          preview.style.border = "";
          preview.style.borderTop = "";
          preview.style.borderBottom = "";
          preview.style.borderLeft = "";
          preview.style.borderRight = "";
        }
        hex.value = "";
        colorInput.value = "#000000";
      };
      resetBtn.addEventListener("click", resetHandler);
      this._eventListeners.push({ el: resetBtn, event: "click", handler: resetHandler });
      swatchItems.forEach((item) => {
        const btn = grid.createEl("button");
        btn.style.backgroundColor = item.color;
        btn.style.width = "100%";
        btn.style.aspectRatio = "1 / 1";
        btn.style.minWidth = "44px";
        btn.style.minHeight = "44px";
        btn.style.border = "1px solid var(--background-modifier-border)";
        btn.style.borderRadius = "12px";
        btn.style.cursor = "pointer";
        btn.style.opacity = "1";
        btn.setAttr("title", item.name || item.color);
        const clickHandler = () => {
          apply(item.color);
        };
        btn.addEventListener("click", clickHandler);
        this._eventListeners.push({ el: btn, event: "click", handler: clickHandler });
      });
      panelStates[type] = { hex, colorInput };
      return col;
    };
    if (this.mode === "text") {
      buildPanel("Text Color", "text");
    } else if (this.mode === "background") {
      buildPanel("Highlight Color", "background");
    } else {
      if (cpm === "text") {
        buildPanel("Text Color", "text");
      } else if (cpm === "background") {
        buildPanel("Highlight Color", "background");
      } else if (cpm === "both-bg-left") {
        buildPanel("Highlight Color", "background");
        buildPanel("Text Color", "text");
      } else {
        buildPanel("Text Color", "text");
        buildPanel("Highlight Color", "background");
      }
    }
    const s = this._selectedText || "";
    let initText = null;
    let initBg = null;
    let existingStyle = null;
    const caseSensitive = !!this.plugin.settings.caseSensitive;
    const eq = (a, b) => caseSensitive ? String(a) === String(b) : String(a).toLowerCase() === String(b).toLowerCase();
    const wordEntries = Array.isArray(this.plugin.settings.wordEntries) ? this.plugin.settings.wordEntries : [];
    for (const e of wordEntries) {
      if (!e) continue;
      if (e.isRegex && this.plugin.settings.enableRegexSupport) {
        try {
          const re = new RegExp(e.pattern, e.flags || "");
          if (re.test(s) && e.color) {
            initText = e.color;
            existingStyle = existingStyle || "text";
            break;
          }
        } catch (err) {
        }
      } else {
        if (eq(e.pattern || "", s) && e.color) {
          initText = e.color;
          existingStyle = existingStyle || "text";
          break;
        }
        if (this.plugin.settings.partialMatch) {
          const a = caseSensitive ? String(s) : String(s).toLowerCase();
          const b = caseSensitive ? String(e.pattern || "") : String(e.pattern || "").toLowerCase();
          if (b && a.includes(b) && e.color) {
            initText = e.color;
            existingStyle = existingStyle || "text";
            break;
          }
        }
        if (Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => eq(p, s)) && e.color) {
          initText = e.color;
          existingStyle = existingStyle || "text";
          break;
        }
      }
    }
    const tbgEntries = (Array.isArray(this.plugin.settings.wordEntries) ? this.plugin.settings.wordEntries : []).filter((e) => e && e.backgroundColor);
    for (const e of tbgEntries) {
      if (!e) continue;
      let match = false;
      if (e.isRegex && this.plugin.settings.enableRegexSupport) {
        try {
          const re = new RegExp(e.pattern, e.flags || "");
          match = re.test(s);
        } catch (err) {
          match = false;
        }
      } else {
        match = eq(e.pattern || "", s) || Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => eq(p, s));
      }
      if (match) {
        if (e.textColor && e.textColor !== "currentColor") initText = e.textColor;
        if (e.backgroundColor) initBg = e.backgroundColor;
        existingStyle = e.styleType || (e.textColor && e.textColor !== "currentColor" && e.backgroundColor ? "both" : e.backgroundColor ? "highlight" : "text");
        break;
      }
    }
    const tp = panelStates["text"];
    const bp = panelStates["background"];
    if (!existingStyle) {
      existingStyle = initText && initBg ? "both" : initBg ? "highlight" : initText ? "text" : this.mode;
    }
    if (!forcedSingle) {
      this.mode = existingStyle === "highlight" ? "background" : existingStyle === "both" ? "text-and-background" : "text";
    }
    if (initText && tp && this.mode !== "background") {
      preview.style.color = initText;
      tp.hex.value = initText;
      tp.colorInput.value = initText;
      if (this.mode === "text" || this.mode === "text-and-background") this.selectedTextColor = initText;
    }
    if (initBg && bp && this.mode !== "text") {
      const rgba = this.plugin.hexToRgba(initBg, this.plugin.settings.backgroundOpacity ?? 25);
      preview.style.backgroundColor = rgba;
      this.plugin.applyBorderStyleToElement(preview, initText, initBg);
      preview.style.paddingLeft = preview.style.paddingRight = (this.plugin.settings.highlightHorizontalPadding ?? 4) + "px";
      if ((this.plugin.settings.highlightHorizontalPadding ?? 4) > 0 && (this.plugin.settings.highlightBorderRadius ?? 8) === 0) {
        preview.style.borderRadius = "0px";
      } else {
        preview.style.borderRadius = (this.plugin.settings.highlightBorderRadius ?? 8) + "px";
      }
      if (this.plugin.settings.enableBoxDecorationBreak ?? true) {
        preview.style.boxDecorationBreak = "clone";
        preview.style.WebkitBoxDecorationBreak = "clone";
      }
      bp.hex.value = initBg;
      bp.colorInput.value = initBg;
      if (this.mode === "background" || this.mode === "text-and-background") this.selectedBgColor = initBg;
    }
    const actionRow = contentEl.createDiv();
    actionRow.style.display = "flex";
    actionRow.style.justifyContent = "flex-end";
    actionRow.style.gap = "8px";
    actionRow.style.marginTop = "16px";
    actionRow.style.gridColumn = "1 / -1";
    const submitFn = async () => {
      const textPanel = panelStates["text"];
      const bgPanel = panelStates["background"];
      const textColor = this.selectedTextColor || (textPanel && textPanel.hex.value ? textPanel.hex.value : null);
      const bgColor = this.selectedBgColor || (bgPanel && bgPanel.hex.value ? bgPanel.hex.value : null);
      const textSelected = !!(textColor && this.plugin.isValidHexColor(textColor));
      const bgSelected = !!(bgColor && this.plugin.isValidHexColor(bgColor));
      debugLog("MODAL", "submit", { word: this._selectedText, textSelected, bgSelected, textColor, bgColor });
      if (!textSelected && !bgSelected) {
        const word2 = this._selectedText || "";
        const caseSensitive2 = !!this.plugin.settings.caseSensitive;
        const eq2 = (a, b) => caseSensitive2 ? String(a) === String(b) : String(a).toLowerCase() === String(b).toLowerCase();
        const arr = Array.isArray(this.plugin.settings.wordEntries) ? this.plugin.settings.wordEntries : [];
        for (let i = arr.length - 1; i >= 0; i--) {
          const e = arr[i];
          if (!e) continue;
          let match = false;
          if (e.isRegex && this.plugin.settings.enableRegexSupport) {
            try {
              const re = new RegExp(e.pattern, e.flags || "");
              match = re.test(word2);
            } catch (err) {
              match = false;
            }
          } else {
            match = eq2(e.pattern || "", word2) || Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => eq2(p, word2));
          }
          if (match) {
            arr.splice(i, 1);
            await this.plugin.saveSettings();
            this.plugin.reconfigureEditorExtensions();
            this.plugin.forceRefreshAllEditors();
            break;
          }
        }
        return;
      }
      const word = this._selectedText || "";
      try {
        if (typeof this.callback === "function") {
          try {
            this.callback(textSelected ? textColor : bgSelected ? bgColor : null, { textColor: textSelected ? textColor : null, backgroundColor: bgSelected ? bgColor : null, word });
          } catch (e) {
          }
          return;
        }
        const caseSensitive2 = !!this.plugin.settings.caseSensitive;
        const eq2 = (a, b) => caseSensitive2 ? String(a) === String(b) : String(a).toLowerCase() === String(b).toLowerCase();
        let updated = false;
        if (textSelected && bgSelected) {
          const arr = Array.isArray(this.plugin.settings.wordEntries) ? this.plugin.settings.wordEntries : [];
          for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (!e) continue;
            let match = false;
            if (e.isRegex && this.plugin.settings.enableRegexSupport) {
              try {
                const re = new RegExp(e.pattern, e.flags || "");
                match = re.test(word);
              } catch (err) {
                match = false;
              }
            } else {
              match = eq2(e.pattern || "", word) || Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => eq2(p, word));
            }
            if (match) {
              e.textColor = textColor;
              e.backgroundColor = bgColor;
              e.color = "";
              e.styleType = "both";
              debugLog("MODAL", "update both", e);
              updated = true;
              break;
            }
          }
          if (!updated) {
            const newEntry = {
              pattern: word,
              color: "",
              // No plain color
              textColor,
              backgroundColor: bgColor,
              isRegex: false,
              flags: "",
              styleType: "both"
              // EXPLICITLY SET TO BOTH
            };
            if (!Array.isArray(this.plugin.settings.wordEntries)) this.plugin.settings.wordEntries = [];
            this.plugin.settings.wordEntries.push(newEntry);
            debugLog("MODAL", "create both", newEntry);
          }
          await this.plugin.saveSettings();
          this.plugin.compileTextBgColoringEntries();
        } else if (textSelected) {
          const arr = Array.isArray(this.plugin.settings.wordEntries) ? this.plugin.settings.wordEntries : [];
          for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (!e) continue;
            if (e.isRegex && this.plugin.settings.enableRegexSupport) {
              try {
                const re = new RegExp(e.pattern, e.flags || "");
                if (re.test(word)) {
                  e.color = textColor;
                  e.textColor = null;
                  e.backgroundColor = null;
                  e.styleType = "text";
                  updated = true;
                  break;
                }
              } catch (err) {
              }
            } else {
              if (eq2(e.pattern || "", word)) {
                e.color = textColor;
                e.textColor = null;
                e.backgroundColor = null;
                e.styleType = "text";
                updated = true;
                break;
              }
              if (Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => eq2(p, word))) {
                e.color = textColor;
                e.textColor = null;
                e.backgroundColor = null;
                e.styleType = "text";
                updated = true;
                break;
              }
            }
          }
          if (!updated) {
            await this.plugin.saveEntry(word, textColor);
            const newEntry = this.plugin.settings.wordEntries.find((e) => e && e.pattern === word && !e.isRegex);
            if (newEntry) {
              newEntry.styleType = "text";
            }
          } else {
            await this.plugin.saveSettings();
          }
          debugLog("MODAL", "text-only", { word, textColor });
        } else if (bgSelected) {
          const arr = Array.isArray(this.plugin.settings.wordEntries) ? this.plugin.settings.wordEntries : [];
          for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (!e) continue;
            let match = false;
            if (e.isRegex && this.plugin.settings.enableRegexSupport) {
              try {
                const re = new RegExp(e.pattern, e.flags || "");
                match = re.test(word);
              } catch (err) {
                match = false;
              }
            } else {
              match = eq2(e.pattern || "", word) || Array.isArray(e.groupedPatterns) && e.groupedPatterns.some((p) => eq2(p, word));
            }
            if (match) {
              e.backgroundColor = bgColor;
              e.textColor = "currentColor";
              e.color = "";
              e.styleType = "highlight";
              debugLog("MODAL", "update highlight", e);
              updated = true;
              break;
            }
          }
          if (!updated) {
            const newEntry = {
              pattern: word,
              color: "",
              // No plain color
              textColor: "currentColor",
              backgroundColor: bgColor,
              isRegex: false,
              flags: "",
              styleType: "highlight"
              // EXPLICITLY SET TO HIGHLIGHT
            };
            if (!Array.isArray(this.plugin.settings.wordEntries)) this.plugin.settings.wordEntries = [];
            this.plugin.settings.wordEntries.push(newEntry);
            debugLog("MODAL", "create highlight", newEntry);
          }
          await this.plugin.saveSettings();
          this.plugin.compileTextBgColoringEntries();
        }
        this.plugin.reconfigureEditorExtensions();
        this.plugin.forceRefreshAllEditors();
        this.plugin.forceRefreshAllReadingViews();
      } catch (e) {
      }
    };
    this._submitFn = submitFn;
    try {
      const originalSubmit = this._submitFn;
      this._submitFn = async () => {
        await originalSubmit();
        if (this.plugin.settingTab) {
          try {
            this.plugin.settingTab._suspendSorting = true;
          } catch (e) {
          }
          try {
            this.plugin.settingTab._refreshEntries();
          } catch (e) {
          }
        }
      };
    } catch (e) {
    }
  }
  onClose() {
    try {
      if (typeof this._submitFn === "function") this._submitFn();
    } catch (e) {
    }
    this._eventListeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    this._eventListeners = [];
    this.contentEl.empty();
  }
};
var ConfirmationModal = class extends Modal {
  constructor(app, title, message, onConfirm) {
    super(app);
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this._eventListeners = [];
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this._eventListeners = [];
    const h2 = contentEl.createEl("h2", { text: this.title });
    h2.style.marginTop = "0";
    contentEl.createEl("p", { text: this.message });
    const buttonDiv = contentEl.createDiv();
    buttonDiv.style.display = "flex";
    buttonDiv.style.justifyContent = "flex-end";
    buttonDiv.style.marginTop = "20px";
    buttonDiv.style.gap = "10px";
    const cancelButton = buttonDiv.createEl("button", { text: "Cancel" });
    const cancelHandler = () => this.close();
    cancelButton.addEventListener("click", cancelHandler);
    this._eventListeners.push({ el: cancelButton, event: "click", handler: cancelHandler });
    const confirmButton = buttonDiv.createEl("button", { text: "Confirm" });
    confirmButton.addClass("mod-warning");
    const confirmHandler = () => {
      this.onConfirm();
      this.close();
    };
    confirmButton.addEventListener("click", confirmHandler);
    this._eventListeners.push({ el: confirmButton, event: "click", handler: confirmHandler });
  }
  onClose() {
    this._eventListeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    this._eventListeners = [];
    this.contentEl.empty();
  }
};
