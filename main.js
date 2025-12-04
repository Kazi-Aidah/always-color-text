var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/i18n/en.json
var require_en = __commonJS({
  "src/i18n/en.json"(exports2, module2) {
    module2.exports = {
      __name: "English",
      settings_title: "Always Color Text Settings",
      latest_release_notes_label: "Latest Release Notes",
      latest_release_notes_desc: "View the most recent plugin release notes",
      open_changelog_button: "Open Changelog",
      language_label: "Language",
      language_desc: "Select the language to be used in this plugin",
      language_en: "English",
      language_es: "Spanish",
      language_fr: "French",
      language_eu: "Basque",
      language_ru: "Russian",
      ribbon_title: "Always color text",
      notice_enabled: "Always color text enabled",
      notice_disabled: "Always color text disabled",
      file_menu_enable: "Enable always color text for this file",
      file_menu_disable: "Disable always color text for this file",
      menu_color_once: "Color Once",
      menu_highlight_once: "Highlight Once",
      menu_always_color_text: "Always color text",
      menu_remove_always_color_text: "Remove Always Color Text",
      menu_blacklist_word: "Blacklist Word from Coloring",
      notice_blacklisted_cannot_color: '"{word}" is blacklisted and cannot be colored.',
      notice_removed_always_color: 'Removed always coloring for "{word}".',
      notice_added_to_blacklist: '"{word}" added to blacklist.',
      notice_already_blacklisted: '"{word}" is already blacklisted.',
      command_color_selected: "Color Selected Text",
      command_toggle_current: "Enable/Disable coloring for current document",
      command_toggle_global: "Enable/Disable Always Color Text",
      command_run_self_tests: "Run Always Color Text self-tests",
      command_show_release_notes: "Show Latest Release Notes",
      notice_select_text_first: "Please select some text first.",
      notice_no_active_file: "No active file to toggle coloring for.",
      notice_coloring_enabled_for_path: "Coloring enabled for {path}",
      notice_coloring_disabled_for_path: "Coloring disabled for {path}",
      notice_global_enabled: "Always Color Text Enabled",
      notice_global_disabled: "Always Color Text Disabled",
      notice_self_tests_passed: "Self-tests passed: {details}",
      notice_self_tests_failed: "Self-tests failed: {details}",
      notice_self_tests_error: "Self-tests error: ",
      notice_unable_open_changelog: "Unable to open changelog modal.",
      header_plugin_name: "Always Color Text",
      disabled_files_header: "Files with coloring disabled:",
      tooltip_enable_for_file: "Enable for this file",
      replace_default_swatches: "Replace default swatches",
      replace_default_swatches_desc: "If this is on, only your custom colors will show up in the color picker. No default ones!",
      use_swatch_names: "Use swatch names for coloring text",
      use_swatch_names_desc: "Show a dropdown of swatch names next to word/pattern inputs",
      default_colors_header: "Default Colors",
      custom_swatches_header: "Custom Swatches",
      btn_add_color: "+ Add color",
      enable_document_color: "Enable document color",
      color_in_reading_mode: "Color in reading mode",
      force_full_render_reading: "Force full render in Reading mode",
      force_full_render_reading_desc: "When ON, reading-mode will attempt to color the entire document in one pass. May cause performance issues on large documents. Use with caution!",
      show_toggle_statusbar: "Show Toggle in Status Bar",
      show_toggle_ribbon: "Show Toggle icon in ribbon",
      show_toggle_command: "Show Toggle in command",
      coloring_settings_header: "Coloring Settings",
      regex_support: "Regex support",
      regex_support_desc: "Allow patterns to be regular expressions. Invalid regexes are ignored for safety.",
      disable_regex_safety: "Disable regex safety",
      disable_regex_safety_desc: "Allow complex or potentially dangerous expressions. May cause performance issues or freezes.",
      case_sensitive: "Case sensitive",
      case_sensitive_desc: `If this is on, "word" and "Word" are treated as different. If it's off, they're colored the same.`,
      partial_match: "Partial match",
      partial_match_desc: 'If enabled, the whole word will be colored if any colored word is found inside it (e.g., "as" colors "Jasper").',
      one_time_actions_header: "One-Time Actions",
      setting_color_once: "Color Once",
      setting_color_once_desc: "Inserts HTML inline for the selected text. This persists even if the plugin is turned off.",
      setting_highlight_once: "Highlight Once",
      setting_highlight_once_desc: "Inserts HTML inline with background styling. This persists even if the plugin is turned off.",
      highlight_once_preview: "Highlight Once Preview",
      highlight_once_preview_text: "This is how Highlight Once will look like!",
      highlight_once_opacity: "Highlight once opacity",
      highlight_once_border_radius: "Highlight once border radius (px)",
      reset_to_8: "Reset to 8",
      highlight_horizontal_padding: "Highlight horizontal padding (px)",
      reset_to_4: "Reset to 4",
      enable_border_highlight_once: "Enable Border for Highlight Once",
      enable_border_highlight_once_desc: "Add a border to your inline highlight. The added HTML/CSS WILL be long.",
      highlight_once_border_style: "Highlight Once Border Style",
      opt_border_full: "Full border (all sides)",
      opt_border_top_bottom: "Top & Bottom borders",
      opt_border_left_right: "Left & Right borders",
      opt_border_top_right: "Top & Right borders",
      opt_border_top_left: "Top & Left borders",
      opt_border_bottom_right: "Bottom & Right borders",
      opt_border_bottom_left: "Bottom & Left borders",
      opt_border_top: "Top border only",
      opt_border_bottom: "Bottom border only",
      opt_border_left: "Left border only",
      opt_border_right: "Right border only",
      highlight_once_border_opacity: "Highlight Once Border Opacity",
      highlight_once_border_thickness: "Highlight Once Border Thickness (px)",
      reset_to_1: "Reset to 1",
      global_highlight_appearance_header: "Global Highlight Coloring Appearance",
      highlight_opacity: "Highlight opacity",
      highlight_opacity_desc: "Set the opacity of the highlight (0-100%)",
      highlight_border_radius: "Highlight border radius (px)",
      highlight_border_radius_desc: "Set the border radius (in px) for rounded highlight corners",
      highlight_horizontal_padding_desc: "Set the left and right padding (in px) for highlighted text",
      rounded_corners_wrapping: "Rounded corners on line wrapping",
      rounded_corners_wrapping_desc: "When enabled, highlights will have rounded corners on all sides, even when text wraps to a new line.",
      enable_highlight_border: "Enable Highlight Border",
      enable_highlight_border_desc: "Add a border around highlights. The border will match the text or highlight color.",
      border_style: "Border Style",
      border_style_desc: "Choose which sides to apply the border",
      border_opacity: "Border Opacity",
      border_opacity_desc: "Set the opacity of the border (0-100%)",
      border_thickness: "Border Thickness (px)",
      border_thickness_desc: "Set the border thickness from 0-5 pixels (e.g. 1, 2.5, 5)",
      color_swatches_header: "Color Swatches",
      color_picker_layout: "Color Picker Layout",
      color_picker_layout_desc: "Choose which color types to show when picking colors for text",
      opt_both_text_left: "Both: Text left, Highlight right",
      opt_both_bg_left: "Both: Highlight left, Text right",
      opt_text_only: "Text color only",
      opt_background_only: "Highlight color only",
      always_colored_texts_header: "Always Colored Texts",
      always_colored_texts_desc: "Here's where you manage your word/patterns and their colors.",
      search_colored_words_placeholder: "Search colored words/patterns\u2026",
      "sort_label_last-added": "Sort: Last Added",
      "sort_label_a-z": "Sort: A-Z",
      "sort_label_reverse-a-z": "Sort: Z-A",
      "sort_label_style-order": "Sort: Style Order",
      sort_label_color: "Sort: Color",
      btn_add_new_word: "+ Add new colored word / pattern",
      btn_presets: "Presets",
      tooltip_delete_all_words: "Delete all defined words/patterns",
      confirm_delete_all_title: "Delete all words",
      confirm_delete_all_desc: "Are you sure you want to delete all your colored words/patterns? You can't undo this!",
      blacklist_words_header: "Blacklist words",
      blacklist_words_desc: "Keywords or patterns here will never be colored, even for partial matches.",
      show_blacklist_menu: "Show Blacklist words in right-click menu",
      show_blacklist_menu_desc: "Adds a right-click menu item to blacklist selected text from coloring.",
      search_blacklist_placeholder: "Search blacklisted words or patterns\u2026",
      restart_required_title: "Restart required",
      restart_required_desc: "Disabling the command palette toggle requires restarting Obsidian to fully remove commands from the palette. Restart now?",
      highlight_preview: "Highlight Preview",
      highlight_preview_text: "This is how your highlight will look like!",
      notice_pattern_blocked: "Pattern blocked for Memory Safety:",
      notice_pattern_too_complex: "Pattern too complex:",
      style_type_text: "color",
      style_type_highlight: "highlight",
      style_type_both: "both",
      word_pattern_placeholder_long: "pattern, word or comma-separated words (e.g. hello, world, foo)",
      word_pattern_placeholder_short: "Keyword or pattern, or comma-separated words",
      use_regex: "Use Regex",
      flags_placeholder: "flags",
      text_color_title: "Text color",
      select_swatch: "Select swatch\u2026",
      highlight_color_title: "Highlight color",
      select_highlight_swatch: "Select highlight swatch\u2026",
      path_rule_mode_include: "include",
      path_rule_mode_exclude: "exclude",
      enter_path_or_pattern: "Enter path or pattern",
      btn_add_blacklist: "+ Add blacklist word or pattern",
      tooltip_delete_all_blacklist: "Delete all blacklisted words/patterns",
      confirm_delete_all_blacklist_title: "Delete all blacklisted words",
      confirm_delete_all_blacklist_desc: "Are you sure you want to delete all blacklist entries? You can't undo this!",
      file_folder_rules_header: "File & Folder Coloring Rules",
      file_folder_rules_desc: "Control coloring with name matching, exact paths, or regex patterns. Leave an empty exclude entry to disable coloring vault-wide.",
      search_file_folder_rules_placeholder: "Search file/folder rules\u2026",
      "path_sort_label_last-added": "Sort: Last Added",
      "path_sort_label_a-z": "Sort: A-Z",
      "path_sort_label_reverse-a-z": "Sort: Z-A",
      path_sort_label_mode: "Sort: Mode",
      path_sort_label_type: "Sort: Type",
      btn_add_file_folder_rule: "+ Add file/folder rule",
      disable_coloring_current_file: "Disable coloring for current file",
      disable_coloring_current_file_desc: "Adds an exclude rule for the active file under File & Folder Coloring Rules.",
      btn_disable_for_this_file: "Disable for this file",
      notice_no_active_file_to_disable: "No active file to disable coloring for.",
      notice_already_disabled_for_path: "Coloring is already disabled for {path}",
      data_export_import_header: "Data Export/Import",
      export_plugin_data: "Export plugin data",
      export_plugin_data_desc: "Export settings, words, and rules to a JSON file.",
      btn_export: "Export",
      notice_exported: "Exported: {fname}",
      notice_export_failed: "Export failed",
      import_plugin_data: "Import plugin data",
      import_plugin_data_desc: "Import settings from a JSON file",
      btn_import: "Import",
      notice_import_completed: "Import completed",
      notice_import_failed: "Import failed",
      pick_color_header: "Pick Color",
      selected_text_preview: "Selected Text",
      notice_invalid_hex_format: "Invalid hex color format. Use #RRGGBB or #RGB.",
      notice_error_saving_changes: "Error saving changes. Please try again.",
      notice_invalid_color_format: "Invalid color format.",
      changelog_view_on_github: "View on GitHub",
      changelog_loading: "Loading releases\u2026",
      changelog_no_info: "No release information available.",
      changelog_release: "Release",
      changelog_no_notes: "No notes",
      changelog_failed_to_load: "Failed to load release notes.",
      no_rules_configured: "No rules configured.",
      no_custom_swatches_yet: 'No custom swatches yet. Click "+ Add color" to create one.',
      language_auto: "System Default",
      use_global_highlight_style: "Use Global Highlight Style for Highlight Once",
      use_global_highlight_style_desc: "Uses your global inline style. The added HTML/CSS may be long.",
      style_highlight_once: "Style Highlight Once",
      style_highlight_once_desc: "Uses your custom inline style. The added HTML/CSS may be long.",
      label_built_in: "(built-in)"
    };
  }
});

// src/i18n/es.json
var require_es = __commonJS({
  "src/i18n/es.json"(exports2, module2) {
    module2.exports = {
      __name: "Espa\xF1ol",
      settings_title: "Configuraci\xF3n de Always Color Text",
      latest_release_notes_label: "Notas de la \xDAltima Versi\xF3n",
      latest_release_notes_desc: "Ver las notas de la versi\xF3n m\xE1s reciente del plugin",
      open_changelog_button: "Abrir Registro de Cambios",
      language_label: "Idioma",
      language_desc: "Selecciona el idioma que se utilizar\xE1 en este plugin",
      language_en: "Ingl\xE9s",
      language_es: "Espa\xF1ol",
      language_fr: "Franc\xE9s",
      language_eu: "Euskera",
      language_ru: "Ruso",
      language_auto: "Predeterminado del Sistema",
      ribbon_title: "Always color text",
      notice_enabled: "Always color text activado",
      notice_disabled: "Always color text desactivado",
      file_menu_enable: "Activar always color text para este archivo",
      file_menu_disable: "Desactivar always color text para este archivo",
      menu_color_once: "Colorear Una Vez",
      menu_highlight_once: "Resaltar Una Vez",
      menu_always_color_text: "Always color text",
      menu_remove_always_color_text: "Eliminar Always Color Text",
      menu_blacklist_word: "A\xF1adir Palabra a la Lista Negra",
      notice_blacklisted_cannot_color: '"{word}" est\xE1 en la lista negra y no puede colorearse.',
      notice_removed_always_color: 'Se elimin\xF3 el coloreado permanente de "{word}".',
      notice_added_to_blacklist: '"{word}" a\xF1adido a la lista negra.',
      notice_already_blacklisted: '"{word}" ya est\xE1 en la lista negra.',
      command_color_selected: "Colorear Texto Seleccionado",
      command_toggle_current: "Activar/Desactivar coloreado para el documento actual",
      command_toggle_global: "Activar/Desactivar Always Color Text",
      command_run_self_tests: "Ejecutar autopruebas de Always Color Text",
      command_show_release_notes: "Mostrar Notas de la \xDAltima Versi\xF3n",
      notice_select_text_first: "Por favor, selecciona primero alg\xFAn texto.",
      notice_no_active_file: "No hay un archivo activo para activar o desactivar el coloreado.",
      notice_coloring_enabled_for_path: "Coloreado activado para {path}",
      notice_coloring_disabled_for_path: "Coloreado desactivado para {path}",
      notice_global_enabled: "Always Color Text Activado",
      notice_global_disabled: "Always Color Text Desactivado",
      notice_self_tests_passed: "Autopruebas pasadas: {details}",
      notice_self_tests_failed: "Autopruebas fallidas: {details}",
      notice_self_tests_error: "Error en autopruebas: ",
      notice_unable_open_changelog: "No se pudo abrir el modal del registro de cambios.",
      header_plugin_name: "Always Color Text",
      disabled_files_header: "Archivos con coloreado desactivado:",
      tooltip_enable_for_file: "Activar para este archivo",
      replace_default_swatches: "Reemplazar muestras predeterminadas",
      replace_default_swatches_desc: "Si est\xE1 activo, solo se mostrar\xE1n tus colores personalizados en el selector de color. \xA1No los predeterminados!",
      use_swatch_names: "Usar nombres de muestras para colorear texto",
      use_swatch_names_desc: "Muestra un desplegable de nombres de muestras junto a las entradas de palabra/patr\xF3n",
      default_colors_header: "Colores Predeterminados",
      custom_swatches_header: "Muestras Personalizadas",
      btn_add_color: "+ A\xF1adir color",
      enable_document_color: "Activar color de documento",
      color_in_reading_mode: "Colorear en modo lectura",
      force_full_render_reading: "Forzar renderizado completo en modo Lectura",
      force_full_render_reading_desc: "Cuando est\xE1 ACTIVADO, el modo lectura intentar\xE1 colorear todo el documento de una vez. Puede causar problemas de rendimiento en documentos grandes. \xA1Usar con precauci\xF3n!",
      show_toggle_statusbar: "Mostrar Alternador en Barra de Estado",
      show_toggle_ribbon: "Mostrar icono de alternancia en la cinta",
      show_toggle_command: "Mostrar Alternador en comandos",
      coloring_settings_header: "Configuraci\xF3n de Coloreado",
      regex_support: "Soporte para Regex",
      regex_support_desc: "Permitir que los patrones sean expresiones regulares. Las regex inv\xE1lidas se ignoran por seguridad.",
      disable_regex_safety: "Desactivar seguridad de regex",
      disable_regex_safety_desc: "Permitir expresiones complejas o potencialmente peligrosas. Puede causar problemas de rendimiento o bloqueos.",
      case_sensitive: "Sensible a may\xFAsculas",
      case_sensitive_desc: 'Si est\xE1 activo, "palabra" y "Palabra" se tratan como diferentes. Si est\xE1 desactivado, se colorean igual.',
      partial_match: "Coincidencia parcial",
      partial_match_desc: 'Si est\xE1 habilitado, la palabra completa se colorear\xE1 si se encuentra cualquier palabra coloreada dentro de ella (ej., "as" colorea "Jasper").',
      one_time_actions_header: "Acciones de Una Sola Vez",
      setting_color_once: "Colorear Una Vez",
      setting_color_once_desc: "Inserta HTML en l\xEDnea para el texto seleccionado. Persiste incluso si el plugin est\xE1 desactivado.",
      setting_highlight_once: "Resaltar Una Vez",
      setting_highlight_once_desc: "Inserta HTML en l\xEDnea con estilo de fondo. Persiste incluso si el plugin est\xE1 desactivado.",
      highlight_once_preview: "Vista Previa de Resaltar Una Vez",
      highlight_once_preview_text: "As\xED se ver\xE1 Resaltar Una Vez.",
      highlight_once_opacity: "Opacidad de resaltado \xFAnico",
      highlight_once_border_radius: "Radio del borde para resaltado \xFAnico (px)",
      reset_to_8: "Restablecer a 8",
      highlight_horizontal_padding: "Relleno horizontal del resaltado (px)",
      reset_to_4: "Restablecer a 4",
      enable_border_highlight_once: "Activar Borde para Resaltar Una Vez",
      enable_border_highlight_once_desc: "A\xF1ade un borde a tu resaltado en l\xEDnea. El HTML/CSS a\xF1adido SER\xC1 extenso.",
      highlight_once_border_style: "Estilo de Borde para Resaltar Una Vez",
      opt_border_full: "Borde completo (todos los lados)",
      opt_border_top_bottom: "Bordes superior e inferior",
      opt_border_left_right: "Bordes izquierdo y derecho",
      opt_border_top_right: "Bordes superior y derecho",
      opt_border_top_left: "Bordes superior e izquierdo",
      opt_border_bottom_right: "Bordes inferior y derecho",
      opt_border_bottom_left: "Bordes inferior e izquierdo",
      opt_border_top: "Solo borde superior",
      opt_border_bottom: "Solo borde inferior",
      opt_border_left: "Solo borde izquierdo",
      opt_border_right: "Solo borde derecho",
      highlight_once_border_opacity: "Opacidad del Borde para Resaltar Una Vez",
      highlight_once_border_thickness: "Grosor del Borde para Resaltar Una Vez (px)",
      reset_to_1: "Restablecer a 1",
      global_highlight_appearance_header: "Apariencia Global del Resaltado",
      highlight_opacity: "Opacidad del resaltado",
      highlight_opacity_desc: "Establece la opacidad del resaltado (0-100%)",
      highlight_border_radius: "Radio del borde del resaltado (px)",
      highlight_border_radius_desc: "Establece el radio del borde (en px) para esquinas redondeadas en el resaltado",
      highlight_horizontal_padding_desc: "Establece el relleno izquierdo y derecho (en px) para el texto resaltado",
      rounded_corners_wrapping: "Esquinas redondeadas en ajuste de l\xEDnea",
      rounded_corners_wrapping_desc: "Cuando est\xE1 habilitado, los resaltados mantendr\xE1n esquinas redondeadas incluso cuando el texto pase a otra l\xEDnea.",
      enable_highlight_border: "Activar Borde del Resaltado",
      enable_highlight_border_desc: "A\xF1ade un borde alrededor de los resaltados. El borde coincidir\xE1 con el color del texto o del resaltado.",
      border_style: "Estilo del Borde",
      border_style_desc: "Elige en qu\xE9 lados aplicar el borde",
      border_opacity: "Opacidad del Borde",
      border_opacity_desc: "Establece la opacidad del borde (0-100%)",
      border_thickness: "Grosor del Borde (px)",
      border_thickness_desc: "Establece el grosor del borde de 0 a 5 p\xEDxeles (ej. 1, 2.5, 5)",
      color_swatches_header: "Muestras de Color",
      color_picker_layout: "Disposici\xF3n del Selector de Color",
      color_picker_layout_desc: "Elige qu\xE9 tipos de color mostrar al seleccionar colores para el texto",
      opt_both_text_left: "Ambos: texto a la izquierda, resaltado a la derecha",
      opt_both_bg_left: "Ambos: resaltado a la izquierda, texto a la derecha",
      opt_text_only: "Solo color de texto",
      opt_background_only: "Solo color de fondo",
      always_colored_texts_header: "Textos Coloreados Permanentemente",
      always_colored_texts_desc: "Aqu\xED es donde gestionas tus palabras/patrones y sus colores.",
      search_colored_words_placeholder: "Buscar palabras/patrones coloreados\u2026",
      "sort_label_last-added": "Ordenar: \xDAltimo A\xF1adido",
      "sort_label_a-z": "Ordenar: A-Z",
      "sort_label_reverse-a-z": "Ordenar: Z-A",
      "sort_label_style-order": "Ordenar: Orden de Estilo",
      sort_label_color: "Ordenar: Color",
      btn_add_new_word: "+ A\xF1adir nueva palabra/patr\xF3n coloreado",
      btn_presets: "Ajustes predeterminados",
      tooltip_delete_all_words: "Eliminar todas las palabras/patrones definidos",
      confirm_delete_all_title: "Eliminar todas las palabras",
      confirm_delete_all_desc: "\xBFEst\xE1s seguro de que quieres eliminar todas tus palabras/patrones coloreados? \xA1No podr\xE1s deshacer esta acci\xF3n!",
      blacklist_words_header: "Lista negra de palabras",
      blacklist_words_desc: "Las palabras clave o patrones aqu\xED nunca se colorear\xE1n, incluso para coincidencias parciales.",
      show_blacklist_menu: "Mostrar lista negra en el men\xFA contextual",
      show_blacklist_menu_desc: "A\xF1ade un elemento al men\xFA contextual para a\xF1adir el texto seleccionado a la lista negra del coloreado.",
      search_blacklist_placeholder: "Buscar palabras o patrones en lista negra\u2026",
      restart_required_title: "Reinicio requerido",
      restart_required_desc: "Desactivar el alternador de la paleta de comandos requiere reiniciar Obsidian para eliminar completamente los comandos de la paleta. \xBFReiniciar ahora?",
      highlight_preview: "Vista Previa del Resaltado",
      highlight_preview_text: "\xA1As\xED es como se ver\xE1 tu resaltado!",
      notice_pattern_blocked: "Patr\xF3n bloqueado por Seguridad de Memoria:",
      notice_pattern_too_complex: "Patr\xF3n demasiado complejo:",
      style_type_text: "color",
      style_type_highlight: "resaltado",
      style_type_both: "ambos",
      word_pattern_placeholder_long: "patr\xF3n, palabra o palabras separadas por comas (ej. hola, mundo, foo)",
      word_pattern_placeholder_short: "Palabra clave o patr\xF3n, o palabras separadas por comas",
      use_regex: "Usar Regex",
      flags_placeholder: "banderas",
      text_color_title: "Color del texto",
      select_swatch: "Seleccionar muestra\u2026",
      highlight_color_title: "Color de resaltado",
      select_highlight_swatch: "Seleccionar muestra de resaltado\u2026",
      path_rule_mode_include: "incluir",
      path_rule_mode_exclude: "excluir",
      enter_path_or_pattern: "Introduce ruta o patr\xF3n",
      btn_add_blacklist: "+ A\xF1adir palabra o patr\xF3n a la lista negra",
      tooltip_delete_all_blacklist: "Eliminar todas las palabras/patrones de la lista negra",
      confirm_delete_all_blacklist_title: "Eliminar todas las palabras de la lista negra",
      confirm_delete_all_blacklist_desc: "\xBFEst\xE1s seguro de que quieres eliminar todas las entradas de la lista negra? \xA1No podr\xE1s deshacer esta acci\xF3n!",
      file_folder_rules_header: "Reglas de Coloreado para Archivos y Carpetas",
      file_folder_rules_desc: "Controla el coloreado mediante coincidencia de nombres, rutas exactas o patrones regex. Deja una entrada de exclusi\xF3n vac\xEDa para desactivar el coloreado en toda la b\xF3veda.",
      search_file_folder_rules_placeholder: "Buscar reglas de archivo/carpeta\u2026",
      "path_sort_label_last-added": "Ordenar: \xDAltimo A\xF1adido",
      "path_sort_label_a-z": "Ordenar: A-Z",
      "path_sort_label_reverse-a-z": "Ordenar: Z-A",
      path_sort_label_mode: "Ordenar: Modo",
      path_sort_label_type: "Ordenar: Tipo",
      btn_add_file_folder_rule: "+ A\xF1adir regla de archivo/carpeta",
      disable_coloring_current_file: "Desactivar coloreado para el archivo actual",
      disable_coloring_current_file_desc: "A\xF1ade una regla de exclusi\xF3n para el archivo activo dentro de las Reglas de Coloreado para Archivos y Carpetas.",
      btn_disable_for_this_file: "Desactivar para este archivo",
      notice_no_active_file_to_disable: "No hay un archivo activo para desactivar el coloreado.",
      notice_already_disabled_for_path: "El coloreado ya est\xE1 desactivado para {path}",
      data_export_import_header: "Exportar/Importar Datos",
      export_plugin_data: "Exportar datos del plugin",
      export_plugin_data_desc: "Exporta la configuraci\xF3n, palabras y reglas a un archivo JSON.",
      btn_export: "Exportar",
      notice_exported: "Exportado: {fname}",
      notice_export_failed: "Error en la exportaci\xF3n",
      import_plugin_data: "Importar datos del plugin",
      import_plugin_data_desc: "Importa la configuraci\xF3n desde un archivo JSON",
      btn_import: "Importar",
      notice_import_completed: "Importaci\xF3n completada",
      notice_import_failed: "Error en la importaci\xF3n",
      pick_color_header: "Seleccionar Color",
      selected_text_preview: "Texto Seleccionado",
      notice_invalid_hex_format: "Formato de color hexadecimal inv\xE1lido. Usa #RRGGBB o #RGB.",
      notice_error_saving_changes: "Error guardando cambios. Por favor, int\xE9ntalo de nuevo.",
      notice_invalid_color_format: "Formato de color inv\xE1lido.",
      changelog_view_on_github: "Ver en GitHub",
      changelog_loading: "Cargando versiones\u2026",
      changelog_no_info: "No hay informaci\xF3n de versi\xF3n disponible.",
      changelog_release: "Versi\xF3n",
      changelog_no_notes: "Sin notas",
      changelog_failed_to_load: "Error al cargar las notas de la versi\xF3n.",
      no_rules_configured: "No hay reglas configuradas.",
      no_custom_swatches_yet: 'A\xFAn no hay muestras personalizadas. Haz clic en "+ A\xF1adir color" para crear una.',
      use_global_highlight_style: "Usar estilo de resaltado global para Resaltar Una Vez",
      use_global_highlight_style_desc: "Usa tu estilo en l\xEDnea global. El HTML/CSS a\xF1adido puede ser largo.",
      style_highlight_once: "Estilo para Resaltar Una Vez",
      style_highlight_once_desc: "Usa tu estilo en l\xEDnea personalizado. El HTML/CSS a\xF1adido puede ser largo.",
      label_built_in: "(integrado)"
    };
  }
});

// src/i18n/fr.json
var require_fr = __commonJS({
  "src/i18n/fr.json"(exports2, module2) {
    module2.exports = {
      __name: "Fran\xE7ais",
      settings_title: "Param\xE8tres de Always Color Text",
      latest_release_notes_label: "Notes de version les plus r\xE9centes",
      latest_release_notes_desc: "Voir les notes de version les plus r\xE9centes du plugin",
      open_changelog_button: "Ouvrir le journal des modifications",
      language_label: "Langue",
      language_desc: "S\xE9lectionnez la langue \xE0 utiliser dans ce plugin",
      language_en: "Anglais",
      language_es: "Espagnol",
      language_fr: "Fran\xE7ais",
      language_eu: "Basque",
      language_ru: "Russe",
      language_auto: "Par d\xE9faut du syst\xE8me",
      ribbon_title: "Toujours colorer le texte",
      notice_enabled: "Always color text activ\xE9",
      notice_disabled: "Always color text d\xE9sactiv\xE9",
      file_menu_enable: "Activer toujours colorer le texte pour ce fichier",
      file_menu_disable: "D\xE9sactiver toujours colorer le texte pour ce fichier",
      menu_color_once: "Colorer une fois",
      menu_highlight_once: "Surligner une fois",
      menu_always_color_text: "Toujours colorer le texte",
      menu_remove_always_color_text: "Supprimer Always Color Text",
      menu_blacklist_word: "Mettre le mot en liste noire pour le coloriage",
      notice_blacklisted_cannot_color: '"{word}" est sur liste noire et ne peut pas \xEAtre color\xE9.',
      notice_removed_always_color: 'Coloriage permanent supprim\xE9 pour "{word}".',
      notice_added_to_blacklist: '"{word}" ajout\xE9 \xE0 la liste noire.',
      notice_already_blacklisted: '"{word}" est d\xE9j\xE0 sur liste noire.',
      command_color_selected: "Colorer le texte s\xE9lectionn\xE9",
      command_toggle_current: "Activer/D\xE9sactiver le coloriage pour le document actuel",
      command_toggle_global: "Activer/D\xE9sactiver Always Color Text",
      command_run_self_tests: "Ex\xE9cuter les auto-tests de Always Color Text",
      command_show_release_notes: "Afficher les derni\xE8res notes de version",
      notice_select_text_first: "Veuillez d'abord s\xE9lectionner du texte.",
      notice_no_active_file: "Aucun fichier actif pour activer/d\xE9sactiver le coloriage.",
      notice_coloring_enabled_for_path: "Coloriage activ\xE9 pour {path}",
      notice_coloring_disabled_for_path: "Coloriage d\xE9sactiv\xE9 pour {path}",
      notice_global_enabled: "Always Color Text Activ\xE9",
      notice_global_disabled: "Always Color Text D\xE9sactiv\xE9",
      notice_self_tests_passed: "Auto-tests r\xE9ussis : {details}",
      notice_self_tests_failed: "Auto-tests \xE9chou\xE9s : {details}",
      notice_self_tests_error: "Erreur d'auto-tests : ",
      notice_unable_open_changelog: "Impossible d'ouvrir la fen\xEAtre du journal des modifications.",
      header_plugin_name: "Always Color Text",
      disabled_files_header: "Fichiers avec coloriage d\xE9sactiv\xE9 :",
      tooltip_enable_for_file: "Activer pour ce fichier",
      replace_default_swatches: "Remplacer les nuanciers par d\xE9faut",
      replace_default_swatches_desc: "Si activ\xE9, seules vos couleurs personnalis\xE9es appara\xEEtront dans le s\xE9lecteur de couleur. Aucune couleur par d\xE9faut !",
      use_swatch_names: "Utiliser les noms des nuanciers pour colorer le texte",
      use_swatch_names_desc: "Afficher une liste d\xE9roulante des noms de nuanciers \xE0 c\xF4t\xE9 des champs de saisie de mots/motifs",
      default_colors_header: "Couleurs par d\xE9faut",
      custom_swatches_header: "Nuanciers personnalis\xE9s",
      btn_add_color: "+ Ajouter une couleur",
      enable_document_color: "Activer la couleur du document",
      color_in_reading_mode: "Colorer en mode lecture",
      force_full_render_reading: "Forcer le rendu complet en mode Lecture",
      force_full_render_reading_desc: "Quand ACTIF, le mode lecture tentera de colorer l'ensemble du document en une seule passe. Peut causer des probl\xE8mes de performance sur les grands documents. \xC0 utiliser avec prudence !",
      show_toggle_statusbar: "Afficher le bouton d'activation dans la barre d'\xE9tat",
      show_toggle_ribbon: "Afficher l'ic\xF4ne d'activation dans le ruban",
      show_toggle_command: "Afficher l'activation dans les commandes",
      coloring_settings_header: "Param\xE8tres de coloriage",
      regex_support: "Support des expressions r\xE9guli\xE8res",
      regex_support_desc: "Permet aux motifs d'\xEAtre des expressions r\xE9guli\xE8res. Les regex invalides sont ignor\xE9es pour des raisons de s\xE9curit\xE9.",
      disable_regex_safety: "D\xE9sactiver la s\xE9curit\xE9 des regex",
      disable_regex_safety_desc: "Autorise des expressions complexes ou potentiellement dangereuses. Peut causer des probl\xE8mes de performance ou des blocages.",
      case_sensitive: "Sensible \xE0 la casse",
      case_sensitive_desc: 'Si activ\xE9, "mot" et "Mot" sont trait\xE9s diff\xE9remment. Si d\xE9sactiv\xE9, ils sont color\xE9s de la m\xEAme mani\xE8re.',
      partial_match: "Correspondance partielle",
      partial_match_desc: `Si activ\xE9, le mot entier sera color\xE9 si un mot color\xE9 est trouv\xE9 \xE0 l'int\xE9rieur (ex: "as" colorera "Jasper").`,
      one_time_actions_header: "Actions ponctuelles",
      setting_color_once: "Colorer une fois",
      setting_color_once_desc: "Ins\xE8re du code HTML en ligne pour le texte s\xE9lectionn\xE9. Persiste m\xEAme si le plugin est d\xE9sactiv\xE9.",
      setting_highlight_once: "Surligner une fois",
      setting_highlight_once_desc: "Ins\xE8re du code HTML en ligne avec un style de fond. Persiste m\xEAme si le plugin est d\xE9sactiv\xE9.",
      highlight_once_preview: "Aper\xE7u de Surligner une fois",
      highlight_once_preview_text: "Voici \xE0 quoi ressemblera Surligner une fois !",
      highlight_once_opacity: "Opacit\xE9 de Surligner une fois",
      highlight_once_border_radius: "Rayon de la bordure de Surligner une fois (px)",
      reset_to_8: "R\xE9initialiser \xE0 8",
      highlight_horizontal_padding: "Marge horizontale du surlignage (px)",
      reset_to_4: "R\xE9initialiser \xE0 4",
      enable_border_highlight_once: "Activer la bordure pour Surligner une fois",
      enable_border_highlight_once_desc: "Ajoute une bordure \xE0 votre surlignage en ligne. Le code HTML/CSS ajout\xE9 sera LONG.",
      highlight_once_border_style: "Style de bordure de Surligner une fois",
      opt_border_full: "Bordure compl\xE8te (tous les c\xF4t\xE9s)",
      opt_border_top_bottom: "Bordures Haut & Bas",
      opt_border_left_right: "Bordures Gauche & Droite",
      opt_border_top_right: "Bordures Haut & Droite",
      opt_border_top_left: "Bordures Haut & Gauche",
      opt_border_bottom_right: "Bordures Bas & Droite",
      opt_border_bottom_left: "Bordures Bas & Gauche",
      opt_border_top: "Bordure du haut seulement",
      opt_border_bottom: "Bordure du bas seulement",
      opt_border_left: "Bordure de gauche seulement",
      opt_border_right: "Bordure de droite seulement",
      highlight_once_border_opacity: "Opacit\xE9 de la bordure de Surligner une fois",
      highlight_once_border_thickness: "\xC9paisseur de la bordure de Surligner une fois (px)",
      reset_to_1: "R\xE9initialiser \xE0 1",
      global_highlight_appearance_header: "Apparence globale du surlignage color\xE9",
      highlight_opacity: "Opacit\xE9 du surlignage",
      highlight_opacity_desc: "D\xE9finit l'opacit\xE9 du surlignage (0-100%)",
      highlight_border_radius: "Rayon de la bordure du surlignage (px)",
      highlight_border_radius_desc: "D\xE9finit le rayon de la bordure (en px) pour les coins arrondis du surlignage",
      highlight_horizontal_padding_desc: "D\xE9finit la marge gauche et droite (en px) pour le texte surlign\xE9",
      rounded_corners_wrapping: "Coins arrondis sur le retour \xE0 la ligne",
      rounded_corners_wrapping_desc: "Quand activ\xE9, les surlignages auront des coins arrondis sur tous les c\xF4t\xE9s, m\xEAme quand le texte revient \xE0 la ligne.",
      enable_highlight_border: "Activer la bordure du surlignage",
      enable_highlight_border_desc: "Ajoute une bordure autour des surlignages. La bordure correspondra \xE0 la couleur du texte ou du surlignage.",
      border_style: "Style de bordure",
      border_style_desc: "Choisissez les c\xF4t\xE9s sur lesquels appliquer la bordure",
      border_opacity: "Opacit\xE9 de la bordure",
      border_opacity_desc: "D\xE9finit l'opacit\xE9 de la bordure (0-100%)",
      border_thickness: "\xC9paisseur de la bordure (px)",
      border_thickness_desc: "D\xE9finit l'\xE9paisseur de la bordure de 0 \xE0 5 pixels (ex: 1, 2.5, 5)",
      color_swatches_header: "Nuanciers de couleur",
      color_picker_layout: "Disposition du s\xE9lecteur de couleur",
      color_picker_layout_desc: "Choisissez les types de couleur \xE0 afficher lors de la s\xE9lection des couleurs pour le texte",
      opt_both_text_left: "Les deux : Texte \xE0 gauche, Surlignage \xE0 droite",
      opt_both_bg_left: "Les deux : Surlignage \xE0 gauche, Texte \xE0 droite",
      opt_text_only: "Couleur du texte seulement",
      opt_background_only: "Couleur de surlignage seulement",
      always_colored_texts_header: "Textes toujours color\xE9s",
      always_colored_texts_desc: "C'est ici que vous g\xE9rez vos mots/motifs et leurs couleurs.",
      search_colored_words_placeholder: "Rechercher des mots/motifs color\xE9s\u2026",
      "sort_label_last-added": "Trier : Dernier ajout",
      "sort_label_a-z": "Trier : A-Z",
      "sort_label_reverse-a-z": "Trier : Z-A",
      "sort_label_style-order": "Trier : Ordre de style",
      sort_label_color: "Trier : Couleur",
      btn_add_new_word: "+ Ajouter un nouveau mot / motif color\xE9",
      btn_presets: "Pr\xE9r\xE9glages",
      tooltip_delete_all_words: "Supprimer tous les mots/motifs d\xE9finis",
      confirm_delete_all_title: "Supprimer tous les mots",
      confirm_delete_all_desc: "\xCAtes-vous s\xFBr de vouloir supprimer tous vos mots/motifs color\xE9s ? Cette action est irr\xE9versible !",
      blacklist_words_header: "Mots en liste noire",
      blacklist_words_desc: "Les mots-cl\xE9s ou motifs ici ne seront jamais color\xE9s, m\xEAme pour les correspondances partielles.",
      show_blacklist_menu: "Afficher les mots en liste noire dans le menu clic-droit",
      show_blacklist_menu_desc: "Ajoute un \xE9l\xE9ment au menu clic-droit pour mettre le texte s\xE9lectionn\xE9 en liste noire pour le coloriage.",
      search_blacklist_placeholder: "Rechercher des mots ou motifs en liste noire\u2026",
      restart_required_title: "Red\xE9marrage requis",
      restart_required_desc: "D\xE9sactiver le bouton de la palette de commandes n\xE9cessite de red\xE9marrer Obsidian pour supprimer compl\xE8tement les commandes de la palette. Red\xE9marrer maintenant ?",
      highlight_preview: "Aper\xE7u du surlignage",
      highlight_preview_text: "Voici \xE0 quoi ressemblera votre surlignage !",
      notice_pattern_blocked: "Motif bloqu\xE9 pour la s\xE9curit\xE9 m\xE9moire :",
      notice_pattern_too_complex: "Motif trop complexe :",
      style_type_text: "couleur",
      style_type_highlight: "surlignage",
      style_type_both: "les deux",
      word_pattern_placeholder_long: "motif, mot ou mots s\xE9par\xE9s par des virgules (ex: bonjour, monde, foo)",
      word_pattern_placeholder_short: "Mot-cl\xE9 ou motif, ou mots s\xE9par\xE9s par des virgules",
      use_regex: "Utiliser Regex",
      flags_placeholder: "drapeaux",
      text_color_title: "Couleur du texte",
      select_swatch: "S\xE9lectionner un nuancier\u2026",
      highlight_color_title: "Couleur de surlignage",
      select_highlight_swatch: "S\xE9lectionner un nuancier de surlignage\u2026",
      path_rule_mode_include: "inclure",
      path_rule_mode_exclude: "exclure",
      enter_path_or_pattern: "Entrer un chemin ou un motif",
      btn_add_blacklist: "+ Ajouter un mot ou motif en liste noire",
      tooltip_delete_all_blacklist: "Supprimer tous les mots/motifs en liste noire",
      confirm_delete_all_blacklist_title: "Supprimer tous les mots en liste noire",
      confirm_delete_all_blacklist_desc: "\xCAtes-vous s\xFBr de vouloir supprimer toutes les entr\xE9es de la liste noire ? Cette action est irr\xE9versible !",
      file_folder_rules_header: "R\xE8gles de coloriage des fichiers et dossiers",
      file_folder_rules_desc: "Contr\xF4lez le coloriage par correspondance de nom, chemins exacts ou motifs regex. Laissez une entr\xE9e d'exclusion vide pour d\xE9sactiver le coloriage dans l'ensemble du coffre.",
      search_file_folder_rules_placeholder: "Rechercher des r\xE8gles de fichier/dossier\u2026",
      "path_sort_label_last-added": "Trier : Dernier ajout",
      "path_sort_label_a-z": "Trier : A-Z",
      "path_sort_label_reverse-a-z": "Trier : Z-A",
      path_sort_label_mode: "Trier : Mode",
      path_sort_label_type: "Trier : Type",
      btn_add_file_folder_rule: "+ Ajouter une r\xE8gle de fichier/dossier",
      disable_coloring_current_file: "D\xE9sactiver le coloriage pour le fichier actuel",
      disable_coloring_current_file_desc: "Ajoute une r\xE8gle d'exclusion pour le fichier actif dans R\xE8gles de coloriage des fichiers et dossiers.",
      btn_disable_for_this_file: "D\xE9sactiver pour ce fichier",
      notice_no_active_file_to_disable: "Aucun fichier actif pour d\xE9sactiver le coloriage.",
      notice_already_disabled_for_path: "Le coloriage est d\xE9j\xE0 d\xE9sactiv\xE9 pour {path}",
      data_export_import_header: "Export/Import des donn\xE9es",
      export_plugin_data: "Exporter les donn\xE9es du plugin",
      export_plugin_data_desc: "Exporter les param\xE8tres, mots et r\xE8gles vers un fichier JSON.",
      btn_export: "Exporter",
      notice_exported: "Export\xE9 : {fname}",
      notice_export_failed: "\xC9chec de l'exportation",
      import_plugin_data: "Importer les donn\xE9es du plugin",
      import_plugin_data_desc: "Importer les param\xE8tres depuis un fichier JSON",
      btn_import: "Importer",
      notice_import_completed: "Importation termin\xE9e",
      notice_import_failed: "\xC9chec de l'importation",
      pick_color_header: "Choisir une couleur",
      selected_text_preview: "Texte s\xE9lectionn\xE9",
      notice_invalid_hex_format: "Format de couleur hexad\xE9cimale invalide. Utilisez #RRGGBB ou #RGB.",
      notice_error_saving_changes: "Erreur lors de l'enregistrement des modifications. Veuillez r\xE9essayer.",
      notice_invalid_color_format: "Format de couleur invalide.",
      changelog_view_on_github: "Voir sur GitHub",
      changelog_loading: "Chargement des versions\u2026",
      changelog_no_info: "Aucune information de version disponible.",
      changelog_release: "Version",
      changelog_no_notes: "Aucune note",
      changelog_failed_to_load: "\xC9chec du chargement des notes de version.",
      no_rules_configured: "Aucune r\xE8gle configur\xE9e.",
      no_custom_swatches_yet: 'Aucun nuancier personnalis\xE9 pour le moment. Cliquez sur "+ Ajouter une couleur" pour en cr\xE9er un.',
      use_global_highlight_style: "Utiliser le style de surlignage global pour Surligner une fois",
      use_global_highlight_style_desc: "Utilise votre style en ligne global. Le HTML/CSS ajout\xE9 peut \xEAtre volumineux.",
      style_highlight_once: "Style pour Surligner une fois",
      style_highlight_once_desc: "Utilise votre style en ligne personnalis\xE9. Le HTML/CSS ajout\xE9 peut \xEAtre volumineux.",
      label_built_in: "(int\xE9gr\xE9)"
    };
  }
});

// src/i18n/hi.json
var require_hi = __commonJS({
  "src/i18n/hi.json"(exports2, module2) {
    module2.exports = {
      __name: "\u0939\u093F\u0928\u094D\u0926\u0940",
      settings_title: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938",
      latest_release_notes_label: "\u0928\u0935\u0940\u0928\u0924\u092E \u0930\u093F\u0932\u0940\u091C\u093C \u0928\u094B\u091F\u094D\u0938",
      latest_release_notes_desc: "\u092A\u094D\u0932\u0917\u0907\u0928 \u0915\u0947 \u0928\u0935\u0940\u0928\u0924\u092E \u0930\u093F\u0932\u0940\u091C\u093C \u0928\u094B\u091F\u094D\u0938 \u0926\u0947\u0916\u0947\u0902",
      open_changelog_button: "\u091A\u0947\u0902\u091C\u0932\u0949\u0917 \u0916\u094B\u0932\u0947\u0902",
      language_label: "\u092D\u093E\u0937\u093E",
      language_desc: "\u0907\u0938 \u092A\u094D\u0932\u0917\u0907\u0928 \u092E\u0947\u0902 \u0909\u092A\u092F\u094B\u0917 \u0915\u0940 \u091C\u093E\u0928\u0947 \u0935\u093E\u0932\u0940 \u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902",
      language_en: "\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940",
      language_es: "\u0938\u094D\u092A\u0947\u0928\u093F\u0936",
      language_fr: "\u092B\u094D\u0930\u0947\u0902\u091A",
      language_eu: "\u092C\u093E\u0938\u094D\u0915",
      language_ru: "\u0930\u0942\u0938\u0940",
      language_auto: "\u0938\u093F\u0938\u094D\u091F\u092E \u0921\u093F\u092B\u0949\u0932\u094D\u091F",
      ribbon_title: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      notice_enabled: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u093E\u0932\u0942",
      notice_disabled: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092C\u0902\u0926",
      file_menu_enable: "\u0907\u0938 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      file_menu_disable: "\u0907\u0938 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      menu_color_once: "\u090F\u0915 \u092C\u093E\u0930 \u0930\u0902\u0917 \u0932\u0917\u093E\u090F\u0901",
      menu_highlight_once: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0930\u0947\u0902",
      menu_always_color_text: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      menu_remove_always_color_text: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0939\u091F\u093E\u090F\u0901",
      menu_blacklist_word: "\u0930\u0902\u0917\u093E\u0908 \u0938\u0947 \u0936\u092C\u094D\u0926 \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0915\u0930\u0947\u0902",
      notice_blacklisted_cannot_color: '"{word}" \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0939\u0948 \u0914\u0930 \u0930\u0902\u0917 \u0928\u0939\u0940\u0902 \u0932\u0917\u093E\u092F\u093E \u091C\u093E \u0938\u0915\u0924\u093E\u0964',
      notice_removed_always_color: '"{word}" \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u0947\u0936\u093E \u0915\u0940 \u0930\u0902\u0917\u093E\u0908 \u0939\u091F\u093E\u0908 \u0917\u0908\u0964',
      notice_added_to_blacklist: '"{word}" \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u092E\u0947\u0902 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E\u0964',
      notice_already_blacklisted: '"{word}" \u092A\u0939\u0932\u0947 \u0938\u0947 \u0939\u0940 \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0939\u0948\u0964',
      command_color_selected: "\u091A\u092F\u0928\u093F\u0924 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917\u0947\u0902",
      command_toggle_current: "\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u091A\u093E\u0932\u0942/\u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      command_toggle_global: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u093E\u0932\u0942/\u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      command_run_self_tests: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0938\u0947\u0932\u094D\u092B-\u091F\u0947\u0938\u094D\u091F \u091A\u0932\u093E\u090F\u0901",
      command_show_release_notes: "\u0928\u0935\u0940\u0928\u0924\u092E \u0930\u093F\u0932\u0940\u091C\u093C \u0928\u094B\u091F\u094D\u0938 \u0926\u093F\u0916\u093E\u090F\u0901",
      notice_select_text_first: "\u0915\u0943\u092A\u092F\u093E \u092A\u0939\u0932\u0947 \u0915\u0941\u091B \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u0941\u0928\u0947\u0902\u0964",
      notice_no_active_file: "\u0930\u0902\u0917\u093E\u0908 \u091F\u0949\u0917\u0932 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u094B\u0908 \u0938\u0915\u094D\u0930\u093F\u092F \u092B\u093C\u093E\u0907\u0932 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      notice_coloring_enabled_for_path: "{path} \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u091A\u093E\u0932\u0942",
      notice_coloring_disabled_for_path: "{path} \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926",
      notice_global_enabled: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u091A\u093E\u0932\u0942",
      notice_global_disabled: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092C\u0902\u0926",
      notice_self_tests_passed: "\u0938\u0947\u0932\u094D\u092B-\u091F\u0947\u0938\u094D\u091F \u092A\u093E\u0938: {details}",
      notice_self_tests_failed: "\u0938\u0947\u0932\u094D\u092B-\u091F\u0947\u0938\u094D\u091F \u0935\u093F\u092B\u0932: {details}",
      notice_self_tests_error: "\u0938\u0947\u0932\u094D\u092B-\u091F\u0947\u0938\u094D\u091F \u0924\u094D\u0930\u0941\u091F\u093F: ",
      notice_unable_open_changelog: "\u091A\u0947\u0902\u091C\u0932\u0949\u0917 \u0916\u094B\u0932\u0928\u0947 \u092E\u0947\u0902 \u0905\u0938\u092E\u0930\u094D\u0925\u0964",
      header_plugin_name: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0940\u0928 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      disabled_files_header: "\u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926 \u0915\u0940 \u0917\u0908 \u092B\u093C\u093E\u0907\u0932\u0947\u0902:",
      tooltip_enable_for_file: "\u0907\u0938 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      replace_default_swatches: "\u0921\u093F\u092B\u0949\u0932\u094D\u091F \u0938\u094D\u0935\u0948\u091A\u0947\u0938 \u092C\u0926\u0932\u0947\u0902",
      replace_default_swatches_desc: "\u092F\u0926\u093F \u092F\u0939 \u091A\u093E\u0932\u0942 \u0939\u0948, \u0924\u094B \u0915\u0947\u0935\u0932 \u0906\u092A\u0915\u0947 \u0915\u0938\u094D\u091F\u092E \u0930\u0902\u0917 \u0939\u0940 \u0915\u0932\u0930 \u092A\u093F\u0915\u0930 \u092E\u0947\u0902 \u0926\u093F\u0916\u0947\u0902\u0917\u0947\u0964 \u0915\u094B\u0908 \u0921\u093F\u092B\u0949\u0932\u094D\u091F \u0928\u0939\u0940\u0902!",
      use_swatch_names: "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917\u093E\u0908 \u0915\u0947 \u0932\u093F\u090F \u0938\u094D\u0935\u0948\u091A \u0928\u093E\u092E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
      use_swatch_names_desc: "\u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0907\u0928\u092A\u0941\u091F\u094D\u0938 \u0915\u0947 \u092C\u0917\u0932 \u092E\u0947\u0902 \u0938\u094D\u0935\u0948\u091A \u0928\u093E\u092E\u094B\u0902 \u0915\u093E \u0921\u094D\u0930\u0949\u092A\u0921\u093E\u0909\u0928 \u0926\u093F\u0916\u093E\u090F\u0901",
      default_colors_header: "\u0921\u093F\u092B\u0949\u0932\u094D\u091F \u0930\u0902\u0917",
      custom_swatches_header: "\u0915\u0938\u094D\u091F\u092E \u0938\u094D\u0935\u0948\u091A\u0947\u0938",
      btn_add_color: "+ \u0930\u0902\u0917 \u091C\u094B\u0921\u093C\u0947\u0902",
      enable_document_color: "\u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u0930\u0902\u0917 \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      color_in_reading_mode: "\u0930\u0940\u0921\u093F\u0902\u0917 \u092E\u094B\u0921 \u092E\u0947\u0902 \u0930\u0902\u0917 \u0932\u0917\u093E\u090F\u0901",
      force_full_render_reading: "\u0930\u0940\u0921\u093F\u0902\u0917 \u092E\u094B\u0921 \u092E\u0947\u0902 \u092A\u0942\u0930\u094D\u0923 \u0930\u0947\u0902\u0921\u0930 \u092B\u094B\u0930\u094D\u0938 \u0915\u0930\u0947\u0902",
      force_full_render_reading_desc: "\u091C\u092C \u091A\u093E\u0932\u0942 \u0939\u094B, \u0924\u094B \u0930\u0940\u0921\u093F\u0902\u0917-\u092E\u094B\u0921 \u092A\u0942\u0930\u0947 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u0915\u094B \u090F\u0915 \u092A\u093E\u0938 \u092E\u0947\u0902 \u0930\u0902\u0917\u0928\u0947 \u0915\u093E \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0917\u093E\u0964 \u092C\u0921\u093C\u0947 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C\u094B\u0902 \u092A\u0930 \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u0928 \u0938\u092E\u0938\u094D\u092F\u093E\u090F\u0901 \u0939\u094B \u0938\u0915\u0924\u0940 \u0939\u0948\u0902\u0964 \u0938\u093E\u0935\u0927\u093E\u0928\u0940 \u0938\u0947 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902!",
      show_toggle_statusbar: "\u0938\u094D\u091F\u0947\u091F\u0938 \u092C\u093E\u0930 \u092E\u0947\u0902 \u091F\u0949\u0917\u0932 \u0926\u093F\u0916\u093E\u090F\u0901",
      show_toggle_ribbon: "\u0930\u093F\u092C\u0928 \u092E\u0947\u0902 \u091F\u0949\u0917\u0932 \u0906\u0907\u0915\u0928 \u0926\u093F\u0916\u093E\u090F\u0901",
      show_toggle_command: "\u0915\u092E\u093E\u0902\u0921 \u092E\u0947\u0902 \u091F\u0949\u0917\u0932 \u0926\u093F\u0916\u093E\u090F\u0901",
      coloring_settings_header: "\u0930\u0902\u0917\u093E\u0908 \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938",
      regex_support: "\u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u0938\u092A\u094B\u0930\u094D\u091F",
      regex_support_desc: "\u092A\u0948\u091F\u0930\u094D\u0928 \u0915\u094B \u0930\u0947\u0917\u0941\u0932\u0930 \u090F\u0915\u094D\u0938\u092A\u094D\u0930\u0947\u0936\u0928 \u0939\u094B\u0928\u0947 \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F \u0926\u0947\u0902\u0964 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0915\u0947 \u0932\u093F\u090F \u0905\u092E\u093E\u0928\u094D\u092F \u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u0915\u094B \u0928\u091C\u093C\u0930\u0905\u0902\u0926\u093E\u091C\u093C \u0915\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
      disable_regex_safety: "\u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      disable_regex_safety_desc: "\u091C\u091F\u093F\u0932 \u092F\u093E \u0938\u0902\u092D\u093E\u0935\u093F\u0924 \u0916\u0924\u0930\u0928\u093E\u0915 \u090F\u0915\u094D\u0938\u092A\u094D\u0930\u0947\u0936\u0928\u094D\u0938 \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F \u0926\u0947\u0902\u0964 \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u0928 \u0938\u092E\u0938\u094D\u092F\u093E\u090F\u0901 \u092F\u093E \u092B\u094D\u0930\u0940\u091C\u093C \u0939\u094B \u0938\u0915\u0924\u0940 \u0939\u0948\u0902\u0964",
      case_sensitive: "\u0915\u0947\u0938 \u0938\u0947\u0902\u0938\u093F\u091F\u093F\u0935",
      case_sensitive_desc: '\u092F\u0926\u093F \u092F\u0939 \u091A\u093E\u0932\u0942 \u0939\u0948, \u0924\u094B "word" \u0914\u0930 "Word" \u0915\u094B \u0905\u0932\u0917 \u092E\u093E\u0928\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u092C\u0902\u0926 \u0939\u0948, \u0924\u094B \u0935\u0947 \u0938\u092E\u093E\u0928 \u0930\u0942\u092A \u0938\u0947 \u0930\u0902\u0917\u0947 \u091C\u093E\u0924\u0947 \u0939\u0948\u0902\u0964',
      partial_match: "\u0906\u0902\u0936\u093F\u0915 \u092E\u093F\u0932\u093E\u0928",
      partial_match_desc: '\u092F\u0926\u093F \u0938\u0915\u094D\u0937\u092E \u0939\u0948, \u0924\u094B \u092A\u0942\u0930\u093E \u0936\u092C\u094D\u0926 \u0930\u0902\u0917\u093E \u091C\u093E\u090F\u0917\u093E \u092F\u0926\u093F \u0909\u0938\u0915\u0947 \u0905\u0902\u0926\u0930 \u0915\u094B\u0908 \u0930\u0902\u0917\u093E \u0939\u0941\u0906 \u0936\u092C\u094D\u0926 \u092E\u093F\u0932\u0924\u093E \u0939\u0948 (\u091C\u0948\u0938\u0947, "as" "Jasper" \u0915\u094B \u0930\u0902\u0917\u0947\u0917\u093E)\u0964',
      one_time_actions_header: "\u090F\u0915-\u092C\u093E\u0930 \u0915\u0940 \u0915\u094D\u0930\u093F\u092F\u093E\u090F\u0901",
      setting_color_once: "\u090F\u0915 \u092C\u093E\u0930 \u0930\u0902\u0917 \u0932\u0917\u093E\u090F\u0901",
      setting_color_once_desc: "\u091A\u092F\u0928\u093F\u0924 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u0947 \u0932\u093F\u090F HTML \u0907\u0928\u0932\u093E\u0907\u0928 \u0938\u092E\u094D\u092E\u093F\u0932\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u092A\u094D\u0932\u0917\u0907\u0928 \u092C\u0902\u0926 \u0939\u094B\u0928\u0947 \u092A\u0930 \u092D\u0940 \u092F\u0939 \u092C\u0928\u093E \u0930\u0939\u0924\u093E \u0939\u0948\u0964",
      setting_highlight_once: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0930\u0947\u0902",
      setting_highlight_once_desc: "\u092C\u0948\u0915\u0917\u094D\u0930\u093E\u0909\u0902\u0921 \u0938\u094D\u091F\u093E\u0907\u0932\u093F\u0902\u0917 \u0915\u0947 \u0938\u093E\u0925 HTML \u0907\u0928\u0932\u093E\u0907\u0928 \u0938\u092E\u094D\u092E\u093F\u0932\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u092A\u094D\u0932\u0917\u0907\u0928 \u092C\u0902\u0926 \u0939\u094B\u0928\u0947 \u092A\u0930 \u092D\u0940 \u092F\u0939 \u092C\u0928\u093E \u0930\u0939\u0924\u093E \u0939\u0948\u0964",
      highlight_once_preview: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092A\u094D\u0930\u0940\u0935\u094D\u092F\u0942",
      highlight_once_preview_text: "\u0926\u0947\u0916\u0947\u0902 \u0915\u093F \u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0948\u0938\u093E \u0926\u093F\u0916\u0947\u0917\u093E!",
      highlight_once_opacity: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0913\u092A\u0947\u0938\u093F\u091F\u0940",
      highlight_once_border_radius: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938 (px)",
      reset_to_8: "8 \u092A\u0930 \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      highlight_horizontal_padding: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u094D\u0937\u0948\u0924\u093F\u091C \u092A\u0948\u0921\u093F\u0902\u0917 (px)",
      reset_to_4: "4 \u092A\u0930 \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      enable_border_highlight_once: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0947 \u0932\u093F\u090F \u092C\u0949\u0930\u094D\u0921\u0930 \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      enable_border_highlight_once_desc: "\u0905\u092A\u0928\u0947 \u0907\u0928\u0932\u093E\u0907\u0928 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092E\u0947\u0902 \u092C\u0949\u0930\u094D\u0921\u0930 \u091C\u094B\u0921\u093C\u0947\u0902\u0964 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E HTML/CSS \u0932\u0902\u092C\u093E \u0939\u094B\u0917\u093E\u0964",
      highlight_once_border_style: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u0938\u094D\u091F\u093E\u0907\u0932",
      opt_border_full: "\u092A\u0942\u0930\u094D\u0923 \u092C\u0949\u0930\u094D\u0921\u0930 (\u0938\u092D\u0940 \u0913\u0930)",
      opt_border_top_bottom: "\u090A\u092A\u0930 \u0914\u0930 \u0928\u0940\u091A\u0947 \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_left_right: "\u092C\u093E\u090F\u0901 \u0914\u0930 \u0926\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_top_right: "\u090A\u092A\u0930 \u0914\u0930 \u0926\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_top_left: "\u090A\u092A\u0930 \u0914\u0930 \u092C\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_bottom_right: "\u0928\u0940\u091A\u0947 \u0914\u0930 \u0926\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_bottom_left: "\u0928\u0940\u091A\u0947 \u0914\u0930 \u092C\u093E\u090F\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_top: "\u0915\u0947\u0935\u0932 \u090A\u092A\u0930\u0940 \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_bottom: "\u0915\u0947\u0935\u0932 \u0928\u093F\u091A\u0932\u093E \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_left: "\u0915\u0947\u0935\u0932 \u092C\u093E\u092F\u093E\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      opt_border_right: "\u0915\u0947\u0935\u0932 \u0926\u093E\u092F\u093E\u0901 \u092C\u0949\u0930\u094D\u0921\u0930",
      highlight_once_border_opacity: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u0913\u092A\u0947\u0938\u093F\u091F\u0940",
      highlight_once_border_thickness: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u092E\u094B\u091F\u093E\u0908 (px)",
      reset_to_1: "1 \u092A\u0930 \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0947\u0902",
      global_highlight_appearance_header: "\u0917\u094D\u0932\u094B\u092C\u0932 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0902\u0917\u093E\u0908 \u0938\u094D\u0935\u0930\u0942\u092A",
      highlight_opacity: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0913\u092A\u0947\u0938\u093F\u091F\u0940",
      highlight_opacity_desc: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0940 \u0913\u092A\u0947\u0938\u093F\u091F\u0940 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (0-100%)",
      highlight_border_radius: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938 (px)",
      highlight_border_radius_desc: "\u0917\u094B\u0932 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u094B\u0928\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (px \u092E\u0947\u0902)",
      highlight_horizontal_padding_desc: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u093F\u090F \u0917\u090F \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u0947 \u0932\u093F\u090F \u092C\u093E\u090F\u0901 \u0914\u0930 \u0926\u093E\u090F\u0901 \u092A\u0948\u0921\u093F\u0902\u0917 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (px \u092E\u0947\u0902)",
      rounded_corners_wrapping: "\u0932\u093E\u0907\u0928 \u0930\u0948\u092A\u093F\u0902\u0917 \u092A\u0930 \u0917\u094B\u0932 \u0915\u094B\u0928\u0947",
      rounded_corners_wrapping_desc: "\u091C\u092C \u091A\u093E\u0932\u0942 \u0939\u094B, \u0939\u093E\u0907\u0932\u093E\u0907\u091F\u094D\u0938 \u0915\u0947 \u0938\u092D\u0940 \u0913\u0930 \u0917\u094B\u0932 \u0915\u094B\u0928\u0947 \u0939\u094B\u0902\u0917\u0947, \u092F\u0939\u093E\u0901 \u0924\u0915 \u0915\u093F \u091C\u092C \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0928\u0908 \u0932\u093E\u0907\u0928 \u092A\u0930 \u0930\u0948\u092A \u0939\u094B\u0924\u093E \u0939\u0948\u0964",
      enable_highlight_border: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u0949\u0930\u094D\u0921\u0930 \u091A\u093E\u0932\u0942 \u0915\u0930\u0947\u0902",
      enable_highlight_border_desc: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F\u094D\u0938 \u0915\u0947 \u091A\u093E\u0930\u094B\u0902 \u0913\u0930 \u092C\u0949\u0930\u094D\u0921\u0930 \u091C\u094B\u0921\u093C\u0947\u0902\u0964 \u092C\u0949\u0930\u094D\u0921\u0930 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092F\u093E \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0902\u0917 \u0938\u0947 \u092E\u0947\u0932 \u0916\u093E\u090F\u0917\u093E\u0964",
      border_style: "\u092C\u0949\u0930\u094D\u0921\u0930 \u0938\u094D\u091F\u093E\u0907\u0932",
      border_style_desc: "\u091A\u0941\u0928\u0947\u0902 \u0915\u093F \u092C\u0949\u0930\u094D\u0921\u0930 \u0915\u093F\u0928 \u0913\u0930 \u0932\u093E\u0917\u0942 \u0915\u0930\u0928\u093E \u0939\u0948",
      border_opacity: "\u092C\u0949\u0930\u094D\u0921\u0930 \u0913\u092A\u0947\u0938\u093F\u091F\u0940",
      border_opacity_desc: "\u092C\u0949\u0930\u094D\u0921\u0930 \u0915\u0940 \u0913\u092A\u0947\u0938\u093F\u091F\u0940 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (0-100%)",
      border_thickness: "\u092C\u0949\u0930\u094D\u0921\u0930 \u092E\u094B\u091F\u093E\u0908 (px)",
      border_thickness_desc: "\u092C\u0949\u0930\u094D\u0921\u0930 \u092E\u094B\u091F\u093E\u0908 0-5 \u092A\u093F\u0915\u094D\u0938\u0947\u0932 \u0938\u0947 \u0938\u0947\u091F \u0915\u0930\u0947\u0902 (\u091C\u0948\u0938\u0947 1, 2.5, 5)",
      color_swatches_header: "\u0930\u0902\u0917 \u0938\u094D\u0935\u0948\u091A\u0947\u0938",
      color_picker_layout: "\u0930\u0902\u0917 \u092A\u093F\u0915\u0930 \u0932\u0947\u0906\u0909\u091F",
      color_picker_layout_desc: "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917 \u091A\u0941\u0928\u0924\u0947 \u0938\u092E\u092F \u0915\u094C\u0928 \u0938\u0947 \u0930\u0902\u0917 \u092A\u094D\u0930\u0915\u093E\u0930 \u0926\u093F\u0916\u093E\u0928\u0947 \u0939\u0948\u0902 \u091A\u0941\u0928\u0947\u0902",
      opt_both_text_left: "\u0926\u094B\u0928\u094B\u0902: \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u092C\u093E\u090F\u0901, \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0926\u093E\u090F\u0901",
      opt_both_bg_left: "\u0926\u094B\u0928\u094B\u0902: \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092C\u093E\u090F\u0901, \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0926\u093E\u090F\u0901",
      opt_text_only: "\u0915\u0947\u0935\u0932 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917",
      opt_background_only: "\u0915\u0947\u0935\u0932 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0902\u0917",
      always_colored_texts_header: "\u0939\u092E\u0947\u0936\u093E \u0930\u0902\u0917\u0947 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      always_colored_texts_desc: "\u092F\u0939\u093E\u0901 \u0906\u092A \u0905\u092A\u0928\u0947 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0914\u0930 \u0909\u0928\u0915\u0947 \u0930\u0902\u0917\u094B\u0902 \u0915\u093E \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964",
      search_colored_words_placeholder: "\u0930\u0902\u0917\u0947 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0916\u094B\u091C\u0947\u0902\u2026",
      "sort_label_last-added": "\u0915\u094D\u0930\u092E: \u0905\u0902\u0924\u093F\u092E \u091C\u094B\u0921\u093C\u093E \u0939\u0941\u0906",
      "sort_label_a-z": "\u0915\u094D\u0930\u092E: A-Z",
      "sort_label_reverse-a-z": "\u0915\u094D\u0930\u092E: Z-A",
      "sort_label_style-order": "\u0915\u094D\u0930\u092E: \u0938\u094D\u091F\u093E\u0907\u0932 \u0911\u0930\u094D\u0921\u0930",
      sort_label_color: "\u0915\u094D\u0930\u092E: \u0930\u0902\u0917",
      btn_add_new_word: "+ \u0928\u092F\u093E \u0930\u0902\u0917\u093E \u0936\u092C\u094D\u0926 / \u092A\u0948\u091F\u0930\u094D\u0928 \u091C\u094B\u0921\u093C\u0947\u0902",
      btn_presets: "\u092A\u094D\u0930\u0940\u0938\u0947\u091F\u094D\u0938",
      tooltip_delete_all_words: "\u092A\u0930\u093F\u092D\u093E\u0937\u093F\u0924 \u0938\u092D\u0940 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0939\u091F\u093E\u090F\u0901",
      confirm_delete_all_title: "\u0938\u092D\u0940 \u0936\u092C\u094D\u0926 \u0939\u091F\u093E\u090F\u0901",
      confirm_delete_all_desc: "\u0915\u094D\u092F\u093E \u0906\u092A \u0935\u093E\u0915\u0908 \u0905\u092A\u0928\u0947 \u0938\u092D\u0940 \u0930\u0902\u0917\u0947 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0939\u091F\u093E\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902? \u0906\u092A \u0907\u0938\u0947 \u092A\u0942\u0930\u094D\u0935\u0935\u0924 \u0928\u0939\u0940\u0902 \u0915\u0930 \u0938\u0915\u0924\u0947!",
      blacklist_words_header: "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0936\u092C\u094D\u0926",
      blacklist_words_desc: "\u092F\u0939\u093E\u0901 \u0915\u0940\u0935\u0930\u094D\u0921 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u0915\u092D\u0940 \u0930\u0902\u0917\u0947 \u0928\u0939\u0940\u0902 \u091C\u093E\u090F\u0901\u0917\u0947, \u092F\u0939\u093E\u0901 \u0924\u0915 \u0915\u093F \u0906\u0902\u0936\u093F\u0915 \u092E\u093F\u0932\u093E\u0928 \u0915\u0947 \u0932\u093F\u090F \u092D\u0940\u0964",
      show_blacklist_menu: "\u0930\u093E\u0907\u091F-\u0915\u094D\u0932\u093F\u0915 \u092E\u0947\u0928\u0942 \u092E\u0947\u0902 \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0936\u092C\u094D\u0926 \u0926\u093F\u0916\u093E\u090F\u0901",
      show_blacklist_menu_desc: "\u0930\u0902\u0917\u093E\u0908 \u0938\u0947 \u091A\u092F\u0928\u093F\u0924 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u094B \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0930\u093E\u0907\u091F-\u0915\u094D\u0932\u093F\u0915 \u092E\u0947\u0928\u0942 \u0906\u0907\u091F\u092E \u091C\u094B\u0921\u093C\u0924\u093E \u0939\u0948\u0964",
      search_blacklist_placeholder: "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0936\u092C\u094D\u0926 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u0916\u094B\u091C\u0947\u0902\u2026",
      restart_required_title: "\u0930\u0940\u0938\u094D\u091F\u093E\u0930\u094D\u091F \u0906\u0935\u0936\u094D\u092F\u0915",
      restart_required_desc: "\u0915\u092E\u093E\u0902\u0921 \u092A\u0948\u0932\u0947\u091F \u091F\u0949\u0917\u0932 \u092C\u0902\u0926 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092A\u0948\u0932\u0947\u091F \u0938\u0947 \u0915\u092E\u093E\u0902\u0921\u094D\u0938 \u0915\u094B \u092A\u0942\u0930\u0940 \u0924\u0930\u0939 \u0939\u091F\u093E\u0928\u0947 \u0939\u0947\u0924\u0941 \u0911\u092C\u094D\u0938\u0940\u0921\u093F\u092F\u0928 \u0915\u094B \u0930\u0940\u0938\u094D\u091F\u093E\u0930\u094D\u091F \u0915\u0930\u0928\u093E \u0906\u0935\u0936\u094D\u092F\u0915 \u0939\u0948\u0964 \u0905\u092D\u0940 \u0930\u0940\u0938\u094D\u091F\u093E\u0930\u094D\u091F \u0915\u0930\u0947\u0902?",
      highlight_preview: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u092A\u094D\u0930\u0940\u0935\u094D\u092F\u0942",
      highlight_preview_text: "\u0926\u0947\u0916\u0947\u0902 \u0915\u093F \u0906\u092A\u0915\u093E \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0948\u0938\u093E \u0926\u093F\u0916\u0947\u0917\u093E!",
      notice_pattern_blocked: "\u092E\u0947\u092E\u094B\u0930\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0915\u0947 \u0932\u093F\u090F \u092A\u0948\u091F\u0930\u094D\u0928 \u092C\u094D\u0932\u0949\u0915 \u0915\u093F\u092F\u093E \u0917\u092F\u093E:",
      notice_pattern_too_complex: "\u092A\u0948\u091F\u0930\u094D\u0928 \u092C\u0939\u0941\u0924 \u091C\u091F\u093F\u0932:",
      style_type_text: "\u0930\u0902\u0917",
      style_type_highlight: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F",
      style_type_both: "\u0926\u094B\u0928\u094B\u0902",
      word_pattern_placeholder_long: "\u092A\u0948\u091F\u0930\u094D\u0928, \u0936\u092C\u094D\u0926 \u092F\u093E \u0905\u0932\u094D\u092A\u0935\u093F\u0930\u093E\u092E \u0938\u0947 \u0905\u0932\u0917 \u0915\u093F\u090F \u0917\u090F \u0936\u092C\u094D\u0926 (\u091C\u0948\u0938\u0947 hello, world, foo)",
      word_pattern_placeholder_short: "\u0915\u0940\u0935\u0930\u094D\u0921 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928, \u092F\u093E \u0905\u0932\u094D\u092A\u0935\u093F\u0930\u093E\u092E \u0938\u0947 \u0905\u0932\u0917 \u0915\u093F\u090F \u0917\u090F \u0936\u092C\u094D\u0926",
      use_regex: "\u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
      flags_placeholder: "\u092B\u094D\u0932\u0948\u0917\u094D\u0938",
      text_color_title: "\u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0930\u0902\u0917",
      select_swatch: "\u0938\u094D\u0935\u0948\u091A \u091A\u0941\u0928\u0947\u0902\u2026",
      highlight_color_title: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0930\u0902\u0917",
      select_highlight_swatch: "\u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0938\u094D\u0935\u0948\u091A \u091A\u0941\u0928\u0947\u0902\u2026",
      path_rule_mode_include: "\u0936\u093E\u092E\u093F\u0932 \u0915\u0930\u0947\u0902",
      path_rule_mode_exclude: "\u092C\u093E\u0939\u0930 \u0915\u0930\u0947\u0902",
      enter_path_or_pattern: "\u092A\u0925 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",
      btn_add_blacklist: "+ \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u0936\u092C\u094D\u0926 \u092F\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u091C\u094B\u0921\u093C\u0947\u0902",
      tooltip_delete_all_blacklist: "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0938\u092D\u0940 \u0936\u092C\u094D\u0926/\u092A\u0948\u091F\u0930\u094D\u0928 \u0939\u091F\u093E\u090F\u0901",
      confirm_delete_all_blacklist_title: "\u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F\u0947\u0921 \u0938\u092D\u0940 \u0936\u092C\u094D\u0926 \u0939\u091F\u093E\u090F\u0901",
      confirm_delete_all_blacklist_desc: "\u0915\u094D\u092F\u093E \u0906\u092A \u0935\u093E\u0915\u0908 \u0938\u092D\u0940 \u092C\u094D\u0932\u0948\u0915\u0932\u093F\u0938\u094D\u091F \u090F\u0902\u091F\u094D\u0930\u0940\u091C\u093C \u0939\u091F\u093E\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902? \u0906\u092A \u0907\u0938\u0947 \u092A\u0942\u0930\u094D\u0935\u0935\u0924 \u0928\u0939\u0940\u0902 \u0915\u0930 \u0938\u0915\u0924\u0947!",
      file_folder_rules_header: "\u092B\u093C\u093E\u0907\u0932 \u0914\u0930 \u092B\u093C\u094B\u0932\u094D\u0921\u0930 \u0930\u0902\u0917\u093E\u0908 \u0928\u093F\u092F\u092E",
      file_folder_rules_desc: "\u0928\u093E\u092E \u092E\u093F\u0932\u093E\u0928, \u0938\u091F\u0940\u0915 \u092A\u0925 \u092F\u093E \u0930\u0947\u0917\u0947\u0915\u094D\u0938 \u092A\u0948\u091F\u0930\u094D\u0928 \u0915\u0947 \u0938\u093E\u0925 \u0930\u0902\u0917\u093E\u0908 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0915\u0930\u0947\u0902\u0964 \u0935\u0949\u0932\u094D\u091F-\u0935\u093E\u0907\u0921 \u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u0916\u093E\u0932\u0940 \u092C\u0939\u093F\u0937\u094D\u0915\u0930\u0923 \u090F\u0902\u091F\u094D\u0930\u0940 \u091B\u094B\u0921\u093C\u0947\u0902\u0964",
      search_file_folder_rules_placeholder: "\u092B\u093C\u093E\u0907\u0932/\u092B\u093C\u094B\u0932\u094D\u0921\u0930 \u0928\u093F\u092F\u092E \u0916\u094B\u091C\u0947\u0902\u2026",
      "path_sort_label_last-added": "\u0915\u094D\u0930\u092E: \u0905\u0902\u0924\u093F\u092E \u091C\u094B\u0921\u093C\u093E \u0939\u0941\u0906",
      "path_sort_label_a-z": "\u0915\u094D\u0930\u092E: A-Z",
      "path_sort_label_reverse-a-z": "\u0915\u094D\u0930\u092E: Z-A",
      path_sort_label_mode: "\u0915\u094D\u0930\u092E: \u092E\u094B\u0921",
      path_sort_label_type: "\u0915\u094D\u0930\u092E: \u092A\u094D\u0930\u0915\u093E\u0930",
      btn_add_file_folder_rule: "+ \u092B\u093C\u093E\u0907\u0932/\u092B\u093C\u094B\u0932\u094D\u0921\u0930 \u0928\u093F\u092F\u092E \u091C\u094B\u0921\u093C\u0947\u0902",
      disable_coloring_current_file: "\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      disable_coloring_current_file_desc: "\u092B\u093C\u093E\u0907\u0932 \u0914\u0930 \u092B\u093C\u094B\u0932\u094D\u0921\u0930 \u0930\u0902\u0917\u093E\u0908 \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u0947 \u0924\u0939\u0924 \u0938\u0915\u094D\u0930\u093F\u092F \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u092C\u0939\u093F\u0937\u094D\u0915\u0930\u0923 \u0928\u093F\u092F\u092E \u091C\u094B\u0921\u093C\u0924\u093E \u0939\u0948\u0964",
      btn_disable_for_this_file: "\u0907\u0938 \u092B\u093C\u093E\u0907\u0932 \u0915\u0947 \u0932\u093F\u090F \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      notice_no_active_file_to_disable: "\u0930\u0902\u0917\u093E\u0908 \u092C\u0902\u0926 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u094B\u0908 \u0938\u0915\u094D\u0930\u093F\u092F \u092B\u093C\u093E\u0907\u0932 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      notice_already_disabled_for_path: "{path} \u0915\u0947 \u0932\u093F\u090F \u0930\u0902\u0917\u093E\u0908 \u092A\u0939\u0932\u0947 \u0938\u0947 \u0939\u0940 \u092C\u0902\u0926 \u0939\u0948",
      data_export_import_header: "\u0921\u0947\u091F\u093E \u0928\u093F\u0930\u094D\u092F\u093E\u0924/\u0906\u092F\u093E\u0924",
      export_plugin_data: "\u092A\u094D\u0932\u0917\u0907\u0928 \u0921\u0947\u091F\u093E \u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0915\u0930\u0947\u0902",
      export_plugin_data_desc: "\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938, \u0936\u092C\u094D\u0926 \u0914\u0930 \u0928\u093F\u092F\u092E JSON \u092B\u093C\u093E\u0907\u0932 \u092E\u0947\u0902 \u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0915\u0930\u0947\u0902\u0964",
      btn_export: "\u0928\u093F\u0930\u094D\u092F\u093E\u0924",
      notice_exported: "\u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0915\u093F\u092F\u093E \u0917\u092F\u093E: {fname}",
      notice_export_failed: "\u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0935\u093F\u092B\u0932",
      import_plugin_data: "\u092A\u094D\u0932\u0917\u0907\u0928 \u0921\u0947\u091F\u093E \u0906\u092F\u093E\u0924 \u0915\u0930\u0947\u0902",
      import_plugin_data_desc: "JSON \u092B\u093C\u093E\u0907\u0932 \u0938\u0947 \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u0906\u092F\u093E\u0924 \u0915\u0930\u0947\u0902",
      btn_import: "\u0906\u092F\u093E\u0924",
      notice_import_completed: "\u0906\u092F\u093E\u0924 \u092A\u0942\u0930\u094D\u0923",
      notice_import_failed: "\u0906\u092F\u093E\u0924 \u0935\u093F\u092B\u0932",
      pick_color_header: "\u0930\u0902\u0917 \u091A\u0941\u0928\u0947\u0902",
      selected_text_preview: "\u091A\u092F\u0928\u093F\u0924 \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      notice_invalid_hex_format: "\u0905\u092E\u093E\u0928\u094D\u092F \u0939\u0947\u0915\u094D\u0938 \u0930\u0902\u0917 \u092B\u0949\u0930\u094D\u092E\u0947\u091F\u0964 #RRGGBB \u092F\u093E #RGB \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964",
      notice_error_saving_changes: "\u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u0938\u0939\u0947\u091C\u0928\u0947 \u092E\u0947\u0902 \u0924\u094D\u0930\u0941\u091F\u093F\u0964 \u0915\u0943\u092A\u092F\u093E \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964",
      notice_invalid_color_format: "\u0905\u092E\u093E\u0928\u094D\u092F \u0930\u0902\u0917 \u092B\u0949\u0930\u094D\u092E\u0947\u091F\u0964",
      changelog_view_on_github: "GitHub \u092A\u0930 \u0926\u0947\u0916\u0947\u0902",
      changelog_loading: "\u0930\u093F\u0932\u0940\u091C\u093C \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0940 \u0939\u0948\u0902\u2026",
      changelog_no_info: "\u0915\u094B\u0908 \u0930\u093F\u0932\u0940\u091C\u093C \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      changelog_release: "\u0930\u093F\u0932\u0940\u091C\u093C",
      changelog_no_notes: "\u0915\u094B\u0908 \u0928\u094B\u091F\u094D\u0938 \u0928\u0939\u0940\u0902",
      changelog_failed_to_load: "\u0930\u093F\u0932\u0940\u091C\u093C \u0928\u094B\u091F\u094D\u0938 \u0932\u094B\u0921 \u0915\u0930\u0928\u0947 \u092E\u0947\u0902 \u0935\u093F\u092B\u0932\u0964",
      no_rules_configured: "\u0915\u094B\u0908 \u0928\u093F\u092F\u092E \u0915\u0949\u0928\u094D\u092B\u093C\u093F\u0917\u0930 \u0928\u0939\u0940\u0902 \u0915\u093F\u090F \u0917\u090F\u0964",
      no_custom_swatches_yet: '\u0905\u092D\u0940 \u0924\u0915 \u0915\u094B\u0908 \u0915\u0938\u094D\u091F\u092E \u0938\u094D\u0935\u0948\u091A\u0947\u0938 \u0928\u0939\u0940\u0902\u0964 \u092C\u0928\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F "+ \u0930\u0902\u0917 \u091C\u094B\u0921\u093C\u0947\u0902" \u0915\u094D\u0932\u093F\u0915 \u0915\u0930\u0947\u0902\u0964',
      use_global_highlight_style: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0947 \u0932\u093F\u090F \u0917\u094D\u0932\u094B\u092C\u0932 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0938\u094D\u091F\u093E\u0907\u0932 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
      use_global_highlight_style_desc: "\u0906\u092A\u0915\u0940 \u0917\u094D\u0932\u094B\u092C\u0932 \u0907\u0928\u0932\u093E\u0907\u0928 \u0938\u094D\u091F\u093E\u0907\u0932 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E HTML/CSS \u0932\u0902\u092C\u093E \u0939\u094B \u0938\u0915\u0924\u093E \u0939\u0948\u0964",
      style_highlight_once: "\u090F\u0915 \u092C\u093E\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0938\u094D\u091F\u093E\u0907\u0932 \u0915\u0930\u0947\u0902",
      style_highlight_once_desc: "\u0906\u092A\u0915\u0940 \u0915\u0938\u094D\u091F\u092E \u0907\u0928\u0932\u093E\u0907\u0928 \u0938\u094D\u091F\u093E\u0907\u0932 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u091C\u094B\u0921\u093C\u093E \u0917\u092F\u093E HTML/CSS \u0932\u0902\u092C\u093E \u0939\u094B \u0938\u0915\u0924\u093E \u0939\u0948\u0964",
      label_built_in: "(\u092C\u093F\u0932\u094D\u091F-\u0907\u0928)"
    };
  }
});

// src/i18n/it.json
var require_it = __commonJS({
  "src/i18n/it.json"(exports2, module2) {
    module2.exports = {
      __name: "Italiano",
      settings_title: "Impostazioni Always Color Text",
      latest_release_notes_label: "Note di rilascio pi\xF9 recenti",
      latest_release_notes_desc: "Visualizza le note di rilascio pi\xF9 recenti del plugin",
      open_changelog_button: "Apri changelog",
      language_label: "Lingua",
      language_desc: "Seleziona la lingua da utilizzare in questo plugin",
      language_en: "Inglese",
      language_es: "Spagnolo",
      language_fr: "Francese",
      language_eu: "Basco",
      language_ru: "Russo",
      language_auto: "Predefinito di sistema",
      ribbon_title: "Always Color Text",
      notice_enabled: "Always Color Text abilitato",
      notice_disabled: "Always Color Text disabilitato",
      file_menu_enable: "Abilita Always Color Text per questo file",
      file_menu_disable: "Disabilita Always Color Text per questo file",
      menu_color_once: "Colora una volta",
      menu_highlight_once: "Evidenzia una volta",
      menu_always_color_text: "Always Color Text",
      menu_remove_always_color_text: "Rimuovi Always Color Text",
      menu_blacklist_word: "Aggiungi parola alla blacklist",
      notice_blacklisted_cannot_color: '"{word}" \xE8 in blacklist e non pu\xF2 essere colorata.',
      notice_removed_always_color: 'Rimossa colorazione permanente per "{word}".',
      notice_added_to_blacklist: '"{word}" aggiunta alla blacklist.',
      notice_already_blacklisted: '"{word}" \xE8 gi\xE0 in blacklist.',
      command_color_selected: "Colora testo selezionato",
      command_toggle_current: "Abilita/Disabilita colorazione per il documento corrente",
      command_toggle_global: "Abilita/Disabilita Always Color Text",
      command_run_self_tests: "Esegui autotest di Always Color Text",
      command_show_release_notes: "Mostra note di rilascio pi\xF9 recenti",
      notice_select_text_first: "Seleziona prima del testo da colorare.",
      notice_no_active_file: "Nessun file attivo per attivare/disattivare la colorazione.",
      notice_coloring_enabled_for_path: "Colorazione abilitata per {path}",
      notice_coloring_disabled_for_path: "Colorazione disabilitata per {path}",
      notice_global_enabled: "Always Color Text abilitato",
      notice_global_disabled: "Always Color Text disabilitato",
      notice_self_tests_passed: "Autotest superati: {details}",
      notice_self_tests_failed: "Autotest falliti: {details}",
      notice_self_tests_error: "Errore autotest: ",
      notice_unable_open_changelog: "Impossibile aprire la finestra del changelog.",
      header_plugin_name: "Always Color Text",
      disabled_files_header: "File con colorazione disabilitata:",
      tooltip_enable_for_file: "Abilita per questo file",
      replace_default_swatches: "Sostituisci campioni predefiniti",
      replace_default_swatches_desc: "Se attivo, nel selettore colori appariranno solo i tuoi colori personalizzati. Nessuno predefinito!",
      use_swatch_names: "Usa nomi campioni per colorare il testo",
      use_swatch_names_desc: "Mostra un menu a tendina con i nomi dei campioni accanto ai campi di inserimento parole/pattern",
      default_colors_header: "Colori predefiniti",
      custom_swatches_header: "Campioni personalizzati",
      btn_add_color: "+ Aggiungi colore",
      enable_document_color: "Abilita colore documento",
      color_in_reading_mode: "Colora in modalit\xE0 lettura",
      force_full_render_reading: "Forza rendering completo in modalit\xE0 lettura",
      force_full_render_reading_desc: "Se attivo, la modalit\xE0 lettura tenter\xE0 di colorare l'intero documento in una sola passata. Pu\xF2 causare problemi di prestazioni su documenti grandi. Usare con cautela!",
      show_toggle_statusbar: "Mostra toggle nella barra di stato",
      show_toggle_ribbon: "Mostra icona toggle nel ribbon",
      show_toggle_command: "Mostra toggle nei comandi",
      coloring_settings_header: "Impostazioni colorazione",
      regex_support: "Supporto regex",
      regex_support_desc: "Permetti ai pattern di essere espressioni regolari. Le regex non valide vengono ignorate per sicurezza.",
      disable_regex_safety: "Disabilita sicurezza regex",
      disable_regex_safety_desc: "Permetti espressioni complesse o potenzialmente pericolose. Pu\xF2 causare problemi di prestazioni o blocchi.",
      case_sensitive: "Distingui maiuscole/minuscole",
      case_sensitive_desc: 'Se attivo, "word" e "Word" sono trattati come diversi. Se disattivo, sono colorati allo stesso modo.',
      partial_match: "Corrispondenza parziale",
      partial_match_desc: `Se abilitato, l'intera parola sar\xE0 colorata se viene trovata al suo interno una parola colorata (es. "as" colora "Jasper").`,
      one_time_actions_header: "Azioni una tantum",
      setting_color_once: "Colora una volta",
      setting_color_once_desc: "Inserisce HTML inline per il testo selezionato. Persiste anche se il plugin \xE8 disattivato.",
      setting_highlight_once: "Evidenzia una volta",
      setting_highlight_once_desc: "Inserisce HTML inline con stile di sfondo. Persiste anche se il plugin \xE8 disattivato.",
      highlight_once_preview: "Anteprima evidenziazione una volta",
      highlight_once_preview_text: "Ecco come apparir\xE0 l'evidenziazione!",
      highlight_once_opacity: "Opacit\xE0 evidenziazione una volta",
      highlight_once_border_radius: "Raggio bordo evidenziazione una volta (px)",
      reset_to_8: "Reimposta a 8",
      highlight_horizontal_padding: "Spaziatura orizzontale evidenziazione (px)",
      reset_to_4: "Reimposta a 4",
      enable_border_highlight_once: "Abilita bordo per evidenziazione una volta",
      enable_border_highlight_once_desc: "Aggiungi un bordo all'evidenziazione inline. L'HTML/CSS generato pu\xF2 essere lungo.",
      highlight_once_border_style: "Stile bordo evidenziazione una volta",
      opt_border_full: "Bordo completo (tutti i lati)",
      opt_border_top_bottom: "Bordi superiore e inferiore",
      opt_border_left_right: "Bordi sinistro e destro",
      opt_border_top_right: "Bordi superiore e destro",
      opt_border_top_left: "Bordi superiore e sinistro",
      opt_border_bottom_right: "Bordi inferiore e destro",
      opt_border_bottom_left: "Bordi inferiore e sinistro",
      opt_border_top: "Solo bordo superiore",
      opt_border_bottom: "Solo bordo inferiore",
      opt_border_left: "Solo bordo sinistro",
      opt_border_right: "Solo bordo destro",
      highlight_once_border_opacity: "Opacit\xE0 bordo evidenziazione una volta",
      highlight_once_border_thickness: "Spessore bordo evidenziazione una volta (px)",
      reset_to_1: "Reimposta a 1",
      global_highlight_appearance_header: "Aspetto globale evidenziazione colorata",
      highlight_opacity: "Opacit\xE0 evidenziazione",
      highlight_opacity_desc: "Imposta l'opacit\xE0 dell'evidenziazione (0-100%)",
      highlight_border_radius: "Raggio bordo evidenziazione (px)",
      highlight_border_radius_desc: "Imposta il raggio del bordo (in px) per angoli arrotondati dell'evidenziazione",
      highlight_horizontal_padding_desc: "Imposta la spaziatura sinistra e destra (in px) per il testo evidenziato",
      rounded_corners_wrapping: "Angoli arrotondati sull'a capo",
      rounded_corners_wrapping_desc: "Se abilitato, le evidenziazioni avranno angoli arrotondati su tutti i lati, anche quando il testo va a capo.",
      enable_highlight_border: "Abilita bordo evidenziazione",
      enable_highlight_border_desc: "Aggiungi un bordo attorno alle evidenziazioni. Il bordo corrisponder\xE0 al colore del testo o dell'evidenziazione.",
      border_style: "Stile bordo",
      border_style_desc: "Scegli quali lati applicare il bordo",
      border_opacity: "Opacit\xE0 bordo",
      border_opacity_desc: "Imposta l'opacit\xE0 del bordo (0-100%)",
      border_thickness: "Spessore bordo (px)",
      border_thickness_desc: "Imposta lo spessore del bordo da 0-5 pixel (es. 1, 2.5, 5)",
      color_swatches_header: "Campioni colore",
      color_picker_layout: "Layout selettore colore",
      color_picker_layout_desc: "Scegli quali tipi di colore mostrare quando si selezionano colori per il testo",
      opt_both_text_left: "Entrambi: Testo sinistra, Evidenziazione destra",
      opt_both_bg_left: "Entrambi: Evidenziazione sinistra, Testo destra",
      opt_text_only: "Solo colore testo",
      opt_background_only: "Solo colore evidenziazione",
      always_colored_texts_header: "Testi sempre colorati",
      always_colored_texts_desc: "Qui gestisci le tue parole/pattern e i loro colori.",
      search_colored_words_placeholder: "Cerca parole/pattern colorati\u2026",
      "sort_label_last-added": "Ordina: ultimi aggiunti",
      "sort_label_a-z": "Ordina: A-Z",
      "sort_label_reverse-a-z": "Ordina: Z-A",
      "sort_label_style-order": "Ordina: ordine stile",
      sort_label_color: "Ordina: colore",
      btn_add_new_word: "+ Aggiungi nuova parola/pattern colorato",
      btn_presets: "Preset",
      tooltip_delete_all_words: "Elimina tutte le parole/pattern definiti",
      confirm_delete_all_title: "Elimina tutte le parole",
      confirm_delete_all_desc: "Sei sicuro di voler eliminare tutte le tue parole/pattern colorati? Non potrai annullare questa azione!",
      blacklist_words_header: "Parole in blacklist",
      blacklist_words_desc: "Parole chiave o pattern qui non saranno mai colorati, nemmeno per corrispondenze parziali.",
      show_blacklist_menu: "Mostra parole in blacklist nel menu tasto destro",
      show_blacklist_menu_desc: "Aggiunge una voce nel menu tasto destro per mettere in blacklist il testo selezionato dalla colorazione.",
      search_blacklist_placeholder: "Cerca parole o pattern in blacklist\u2026",
      restart_required_title: "Riavvio richiesto",
      restart_required_desc: "Disabilitare il toggle della palette comandi richiede il riavvio di Obsidian per rimuovere completamente i comandi dalla palette. Riavviare ora?",
      highlight_preview: "Anteprima evidenziazione",
      highlight_preview_text: "Ecco come apparir\xE0 la tua evidenziazione!",
      notice_pattern_blocked: "Pattern bloccato per sicurezza memoria:",
      notice_pattern_too_complex: "Pattern troppo complesso:",
      style_type_text: "colore",
      style_type_highlight: "evidenziazione",
      style_type_both: "entrambi",
      word_pattern_placeholder_long: "pattern, parola o parole separate da virgola (es. hello, world, foo)",
      word_pattern_placeholder_short: "Parola chiave o pattern, o parole separate da virgola",
      use_regex: "Usa regex",
      flags_placeholder: "flag",
      text_color_title: "Colore testo",
      select_swatch: "Seleziona campione\u2026",
      highlight_color_title: "Colore evidenziazione",
      select_highlight_swatch: "Seleziona campione evidenziazione\u2026",
      path_rule_mode_include: "includi",
      path_rule_mode_exclude: "escludi",
      enter_path_or_pattern: "Inserisci percorso o pattern",
      btn_add_blacklist: "+ Aggiungi parola o pattern in blacklist",
      tooltip_delete_all_blacklist: "Elimina tutte le parole/pattern in blacklist",
      confirm_delete_all_blacklist_title: "Elimina tutte le parole in blacklist",
      confirm_delete_all_blacklist_desc: "Sei sicuro di voler eliminare tutte le voci della blacklist? Non potrai annullare questa azione!",
      file_folder_rules_header: "Regole colorazione file e cartelle",
      file_folder_rules_desc: "Gestisci la colorazione usando nomi, percorsi esatti o pattern regex. Lascia una voce di esclusione vuota per disabilitare la colorazione in tutta la vault.",
      search_file_folder_rules_placeholder: "Cerca regole file/cartella\u2026",
      "path_sort_label_last-added": "Ordina: ultimi aggiunti",
      "path_sort_label_a-z": "Ordina: A-Z",
      "path_sort_label_reverse-a-z": "Ordina: Z-A",
      path_sort_label_mode: "Ordina: modalit\xE0",
      path_sort_label_type: "Ordina: tipo",
      btn_add_file_folder_rule: "+ Aggiungi regola file/cartella",
      disable_coloring_current_file: "Disabilita colorazione per file corrente",
      disable_coloring_current_file_desc: "Aggiunge una regola di esclusione per il file attivo sotto regole colorazione file e cartelle.",
      btn_disable_for_this_file: "Disabilita per questo file",
      notice_no_active_file_to_disable: "Nessun file attivo per disabilitare la colorazione.",
      notice_already_disabled_for_path: "La colorazione \xE8 gi\xE0 disabilitata per {path}",
      data_export_import_header: "Esportazione/Importazione dati",
      export_plugin_data: "Esporta dati plugin",
      export_plugin_data_desc: "Esporta impostazioni, parole e regole in un file JSON.",
      btn_export: "Esporta",
      notice_exported: "Esportato: {fname}",
      notice_export_failed: "Esportazione fallita",
      import_plugin_data: "Importa dati plugin",
      import_plugin_data_desc: "Importa impostazioni da un file JSON",
      btn_import: "Importa",
      notice_import_completed: "Importazione completata",
      notice_import_failed: "Importazione fallita",
      pick_color_header: "Seleziona colore",
      selected_text_preview: "Testo selezionato",
      notice_invalid_hex_format: "Formato colore esadecimale non valido. Usa #RRGGBB o #RGB.",
      notice_error_saving_changes: "Errore nel salvare le modifiche. Riprova.",
      notice_invalid_color_format: "Formato colore non valido.",
      changelog_view_on_github: "Visualizza su GitHub",
      changelog_loading: "Caricamento rilasci\u2026",
      changelog_no_info: "Nessuna informazione di rilascio disponibile.",
      changelog_release: "Rilascio",
      changelog_no_notes: "Nessuna nota",
      changelog_failed_to_load: "Caricamento note di rilascio fallito.",
      no_rules_configured: "Nessuna regola configurata.",
      no_custom_swatches_yet: 'Ancora nessun campione personalizzato. Clicca "+ Aggiungi colore" per crearne uno.',
      use_global_highlight_style: "Usa stile evidenziazione globale per evidenzia una volta",
      use_global_highlight_style_desc: "Utilizza il tuo stile inline globale. L'HTML/CSS generato potrebbe essere lungo.",
      style_highlight_once: "Stile evidenzia una volta",
      style_highlight_once_desc: "Utilizza il tuo stile inline personalizzato. L'HTML/CSS generato potrebbe essere lungo.",
      label_built_in: "(integrato)"
    };
  }
});

// src/i18n/bd.json
var require_bd = __commonJS({
  "src/i18n/bd.json"(exports2, module2) {
    module2.exports = {
      __name: "\u09AC\u09BE\u0982\u09B2\u09BE",
      settings_title: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u09C7\u099F\u09BF\u0982\u09B8",
      latest_release_notes_label: "\u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09B0\u09BF\u09B2\u09BF\u099C \u09A8\u09CB\u099F\u09B8",
      latest_release_notes_desc: "\u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8\u09C7\u09B0 \u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09B0\u09BF\u09B2\u09BF\u099C \u09A8\u09CB\u099F\u09B8 \u09A6\u09C7\u0996\u09C1\u09A8",
      open_changelog_button: "\u099A\u09C7\u099E\u09CD\u099C\u09B2\u0997 \u0996\u09C1\u09B2\u09C1\u09A8",
      language_label: "\u09AD\u09BE\u09B7\u09BE",
      language_desc: "\u098F\u0987 \u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AD\u09BE\u09B7\u09BE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8",
      language_en: "\u0987\u0982\u09B0\u09C7\u099C\u09BF",
      language_es: "\u09B8\u09CD\u09AA\u09CD\u09AF\u09BE\u09A8\u09BF\u09B6",
      language_fr: "\u09AB\u09CD\u09B0\u09C7\u099E\u09CD\u099A",
      language_eu: "\u09AC\u09BE\u09B8\u09CD\u0995",
      language_ru: "\u09B0\u09BE\u09B6\u09BF\u09AF\u09BC\u09BE\u09A8",
      language_auto: "\u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u09A1\u09BF\u09AB\u09B2\u09CD\u099F",
      ribbon_title: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      notice_enabled: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC",
      notice_disabled: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC",
      file_menu_enable: "\u098F\u0987 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      file_menu_disable: "\u098F\u0987 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      menu_color_once: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      menu_highlight_once: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09B0\u09C1\u09A8",
      menu_always_color_text: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      menu_remove_always_color_text: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u09B0\u09BE\u09A8",
      menu_blacklist_word: "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09A5\u09C7\u0995\u09C7 \u09B6\u09AC\u09CD\u09A6 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09C1\u09A8",
      notice_blacklisted_cannot_color: '"{word}" \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09B0\u09AF\u09BC\u09C7\u099B\u09C7 \u098F\u09AC\u0982 \u09B0\u0999 \u0995\u09B0\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\u0964',
      notice_removed_always_color: '"{word}" \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09B0\u09CD\u09AC\u09A6\u09BE \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B8\u09B0\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964',
      notice_added_to_blacklist: '"{word}" \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964',
      notice_already_blacklisted: '"{word}" \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7\u0987 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F\u09C7 \u09B0\u09AF\u09BC\u09C7\u099B\u09C7\u3002',
      command_color_selected: "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      command_toggle_current: "\u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B8\u0995\u09CD\u09B7\u09AE/\u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      command_toggle_global: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u0995\u09CD\u09B7\u09AE/\u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      command_run_self_tests: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u09C7\u09B2\u09AB-\u099F\u09C7\u09B8\u09CD\u099F \u099A\u09BE\u09B2\u09BE\u09A8",
      command_show_release_notes: "\u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09B0\u09BF\u09B2\u09BF\u099C \u09A8\u09CB\u099F\u09B8 \u09A6\u09C7\u0996\u09BE\u09A8",
      notice_select_text_first: "\u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u09AA\u09CD\u09B0\u09A5\u09AE\u09C7 \u0995\u09BF\u099B\u09C1 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u3002",
      notice_no_active_file: "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u099F\u0997\u09B2 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09CB\u09A8\u09CB \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BE\u0987\u09B2 \u09A8\u09C7\u0987\u3002",
      notice_coloring_enabled_for_path: "{path} \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      notice_coloring_disabled_for_path: "{path} \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7",
      notice_global_enabled: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B8\u0995\u09CD\u09B7\u09AE",
      notice_global_disabled: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u0985\u0995\u09CD\u09B7\u09AE",
      notice_self_tests_passed: "\u09B8\u09C7\u09B2\u09AB-\u099F\u09C7\u09B8\u09CD\u099F \u09AA\u09BE\u09B8: {details}",
      notice_self_tests_failed: "\u09B8\u09C7\u09B2\u09AB-\u099F\u09C7\u09B8\u09CD\u099F \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5: {details}",
      notice_self_tests_error: "\u09B8\u09C7\u09B2\u09AB-\u099F\u09C7\u09B8\u09CD\u099F \u09A4\u09CD\u09B0\u09C1\u099F\u09BF: ",
      notice_unable_open_changelog: "\u099A\u09C7\u099E\u09CD\u099C\u09B2\u0997 \u0996\u09C1\u09B2\u09A4\u09C7 \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u3002",
      header_plugin_name: "\u0985\u09B2\u0993\u09AF\u09BC\u09C7\u099C \u0995\u09BE\u09B2\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      disabled_files_header: "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u0995\u09B0\u09BE \u09AB\u09BE\u0987\u09B2\u0997\u09C1\u09B2\u09BF:",
      tooltip_enable_for_file: "\u098F\u0987 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      replace_default_swatches: "\u09A1\u09BF\u09AB\u09B2\u09CD\u099F \u09B8\u09CB\u09AF\u09BC\u09BE\u099A\u0997\u09C1\u09B2\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8 \u0995\u09B0\u09C1\u09A8",
      replace_default_swatches_desc: "\u098F\u099F\u09BF \u099A\u09BE\u09B2\u09C1 \u09A5\u09BE\u0995\u09B2\u09C7, \u0995\u09C7\u09AC\u09B2 \u0986\u09AA\u09A8\u09BE\u09B0 \u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09B0\u0999\u0997\u09C1\u09B2\u09BF \u0995\u09BE\u09B2\u09BE\u09B0 \u09AA\u09BF\u0995\u09BE\u09B0\u09C7 \u09A6\u09C7\u0996\u09BE\u09AC\u09C7\u0964 \u0995\u09CB\u09A8\u09CB \u09A1\u09BF\u09AB\u09B2\u09CD\u099F \u09B0\u0999 \u09A8\u09AF\u09BC!",
      use_swatch_names: "\u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999\u09BE\u09AF\u09BC\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09BE\u09AE \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8",
      use_swatch_names_desc: "\u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0987\u09A8\u09AA\u09C1\u099F\u09C7\u09B0 \u09AA\u09BE\u09B6\u09C7 \u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09BE\u09AE\u09C7\u09B0 \u09A1\u09CD\u09B0\u09AA\u09A1\u09BE\u0989\u09A8 \u09A6\u09C7\u0996\u09BE\u09A8",
      default_colors_header: "\u09A1\u09BF\u09AB\u09B2\u09CD\u099F \u09B0\u0999\u0997\u09C1\u09B2\u09BF",
      custom_swatches_header: "\u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09B8\u09CB\u09AF\u09BC\u09BE\u099A\u0997\u09C1\u09B2\u09BF",
      btn_add_color: "+ \u09B0\u0999 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      enable_document_color: "\u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F \u09B0\u0999 \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      color_in_reading_mode: "\u09B0\u09BF\u09A1\u09BF\u0982 \u09AE\u09CB\u09A1\u09C7 \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      force_full_render_reading: "\u09B0\u09BF\u09A1\u09BF\u0982 \u09AE\u09CB\u09A1\u09C7 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B0\u09C7\u09A8\u09CD\u09A1\u09BE\u09B0 \u099C\u09CB\u09B0 \u0995\u09B0\u09C1\u09A8",
      force_full_render_reading_desc: "\u099A\u09BE\u09B2\u09C1 \u09A5\u09BE\u0995\u09B2\u09C7, \u09B0\u09BF\u09A1\u09BF\u0982-\u09AE\u09CB\u09A1 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F \u098F\u0995 \u09AA\u09BE\u09B8\u09C7 \u09B0\u0999 \u0995\u09B0\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09AC\u09C7\u0964 \u09AC\u09A1\u09BC \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7 \u09AA\u09BE\u09B0\u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8 \u0987\u09B8\u09CD\u09AF\u09C1 \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964 \u09B8\u09A4\u09B0\u09CD\u0995\u09A4\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8!",
      show_toggle_statusbar: "\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u099F\u09BE\u09B8 \u09AC\u09BE\u09B0\u09C7 \u099F\u0997\u09B2 \u09A6\u09C7\u0996\u09BE\u09A8",
      show_toggle_ribbon: "\u09B0\u09BF\u09AC\u09A8\u09C7 \u099F\u0997\u09B2 \u0986\u0987\u0995\u09A8 \u09A6\u09C7\u0996\u09BE\u09A8",
      show_toggle_command: "\u0995\u09AE\u09BE\u09A8\u09CD\u09A1\u09C7 \u099F\u0997\u09B2 \u09A6\u09C7\u0996\u09BE\u09A8",
      coloring_settings_header: "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B8\u09C7\u099F\u09BF\u0982\u09B8",
      regex_support: "\u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u09B8\u09BE\u09AA\u09CB\u09B0\u09CD\u099F",
      regex_support_desc: "\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8\u0997\u09C1\u09B2\u09BF\u0995\u09C7 \u09B0\u09C7\u0997\u09C1\u09B2\u09BE\u09B0 \u098F\u0995\u09CD\u09B8\u09AA\u09CD\u09B0\u09C7\u09B6\u09A8 \u09B9\u09A4\u09C7 \u0985\u09A8\u09C1\u09AE\u09A4\u09BF \u09A6\u09BF\u09A8\u0964 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09AC\u09C8\u09A7 \u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u0989\u09AA\u09C7\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u3002",
      disable_regex_safety: "\u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      disable_regex_safety_desc: "\u099C\u099F\u09BF\u09B2 \u09AC\u09BE \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF \u09AC\u09BF\u09AA\u099C\u09CD\u099C\u09A8\u0995 \u098F\u0995\u09CD\u09B8\u09AA\u09CD\u09B0\u09C7\u09B6\u09A8 \u0985\u09A8\u09C1\u09AE\u09A4\u09BF \u09A6\u09BF\u09A8\u0964 \u09AA\u09BE\u09B0\u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8 \u0987\u09B8\u09CD\u09AF\u09C1 \u09AC\u09BE \u09AB\u09CD\u09B0\u09BF\u099C \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
      case_sensitive: "\u0995\u09C7\u09B8 \u09B8\u09C7\u09A8\u09CD\u09B8\u09BF\u099F\u09BF\u09AD",
      case_sensitive_desc: '\u098F\u099F\u09BF \u099A\u09BE\u09B2\u09C1 \u09A5\u09BE\u0995\u09B2\u09C7, "word" \u098F\u09AC\u0982 "Word" \u0986\u09B2\u09BE\u09A6\u09BE \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09AC\u09BF\u09AC\u09C7\u099A\u09BF\u09A4 \u09B9\u09AC\u09C7\u0964 \u09AC\u09A8\u09CD\u09A7 \u09A5\u09BE\u0995\u09B2\u09C7, \u09A4\u09BE\u09B0\u09BE \u098F\u0995\u0987\u09AD\u09BE\u09AC\u09C7 \u09B0\u0999 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964',
      partial_match: "\u0986\u0982\u09B6\u09BF\u0995 \u09AE\u09CD\u09AF\u09BE\u099A",
      partial_match_desc: '\u09B8\u0995\u09CD\u09B7\u09AE \u09A5\u09BE\u0995\u09B2\u09C7, \u09AA\u09C1\u09B0\u09CB \u09B6\u09AC\u09CD\u09A6\u099F\u09BF \u09B0\u0999 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7 \u09AF\u09A6\u09BF \u098F\u09B0 \u09AD\u09BF\u09A4\u09B0\u09C7 \u0995\u09CB\u09A8\u09CB \u09B0\u0999 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC (\u09AF\u09C7\u09AE\u09A8, "as" "Jasper" \u0995\u09C7 \u09B0\u0999 \u0995\u09B0\u09AC\u09C7)\u0964',
      one_time_actions_header: "\u098F\u0995-\u09AC\u09BE\u09B0\u09C7\u09B0 \u0995\u09BE\u099C\u0997\u09C1\u09B2\u09BF",
      setting_color_once: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B0\u0999 \u0995\u09B0\u09C1\u09A8",
      setting_color_once_desc: "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF HTML \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u09A8\u09CD\u09A8\u09BF\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7\u0964 \u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8 \u09AC\u09A8\u09CD\u09A7 \u09A5\u09BE\u0995\u09B2\u09C7\u0993 \u098F\u099F\u09BF \u09B8\u09CD\u09A5\u09BE\u09AF\u09BC\u09C0 \u09A5\u09BE\u0995\u09C7\u0964",
      setting_highlight_once: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09B0\u09C1\u09A8",
      setting_highlight_once_desc: "\u09AC\u09CD\u09AF\u09BE\u0995\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1 \u09B8\u09CD\u099F\u09BE\u0987\u09B2\u09BF\u0982 \u09B8\u09B9 HTML \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u09A8\u09CD\u09A8\u09BF\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7\u0964 \u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8 \u09AC\u09A8\u09CD\u09A7 \u09A5\u09BE\u0995\u09B2\u09C7\u0993 \u098F\u099F\u09BF \u09B8\u09CD\u09A5\u09BE\u09AF\u09BC\u09C0 \u09A5\u09BE\u0995\u09C7\u3002",
      highlight_once_preview: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989",
      highlight_once_preview_text: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09C7\u09AE\u09A8 \u09A6\u09C7\u0996\u09BE\u09AC\u09C7 \u09A4\u09BE \u09A6\u09C7\u0996\u09C1\u09A8!",
      highlight_once_opacity: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE",
      highlight_once_border_radius: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C7\u09A1\u09BF\u09AF\u09BC\u09BE\u09B8 (px)",
      reset_to_8: "\u09EE \u098F \u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8",
      highlight_horizontal_padding: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B9\u09B0\u09BE\u0987\u099C\u09A8\u099F\u09BE\u09B2 \u09AA\u09CD\u09AF\u09BE\u09A1\u09BF\u0982 (px)",
      reset_to_4: "\u09EA \u098F \u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8",
      enable_border_highlight_once: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      enable_border_highlight_once_desc: "\u0986\u09AA\u09A8\u09BE\u09B0 \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7 \u098F\u0995\u099F\u09BF \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE HTML/CSS \u09A6\u09C0\u09B0\u09CD\u0998 \u09B9\u09AC\u09C7\u0964",
      highlight_once_border_style: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u09CD\u099F\u09BE\u0987\u09B2",
      opt_border_full: "\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 (\u09B8\u09AC \u09A6\u09BF\u0995)",
      opt_border_top_bottom: "\u0989\u09AA\u09B0 \u098F\u09AC\u0982 \u09A8\u09BF\u099A\u09C7\u09B0 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_left_right: "\u09AC\u09BE\u09AE \u098F\u09AC\u0982 \u09A1\u09BE\u09A8 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_top_right: "\u0989\u09AA\u09B0 \u098F\u09AC\u0982 \u09A1\u09BE\u09A8 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_top_left: "\u0989\u09AA\u09B0 \u098F\u09AC\u0982 \u09AC\u09BE\u09AE \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_bottom_right: "\u09A8\u09BF\u099A \u098F\u09AC\u0982 \u09A1\u09BE\u09A8 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_bottom_left: "\u09A8\u09BF\u099A \u098F\u09AC\u0982 \u09AC\u09BE\u09AE \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_top: "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u0989\u09AA\u09B0\u09C7\u09B0 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_bottom: "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09A8\u09BF\u099A\u09C7\u09B0 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_left: "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09AC\u09BE\u09AE \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      opt_border_right: "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09A1\u09BE\u09A8 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0",
      highlight_once_border_opacity: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE",
      highlight_once_border_thickness: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A5\u09BF\u0995\u09A8\u09C7\u09B8 (px)",
      reset_to_1: "\u09E7 \u098F \u09B0\u09BF\u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8",
      global_highlight_appearance_header: "\u0997\u09CD\u09B2\u09CB\u09AC\u09BE\u09B2 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0985\u09CD\u09AF\u09BE\u09AA\u09BF\u09AF\u09BC\u09BE\u09B0\u09C7\u09A8\u09CD\u09B8",
      highlight_opacity: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE",
      highlight_opacity_desc: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (0-100%)",
      highlight_border_radius: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C7\u09A1\u09BF\u09AF\u09BC\u09BE\u09B8 (px)",
      highlight_border_radius_desc: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u0997\u09CB\u09B2\u09BE\u0995\u09BE\u09B0 \u0995\u09CB\u09A3\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C7\u09A1\u09BF\u09AF\u09BC\u09BE\u09B8 \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (px \u098F)",
      highlight_horizontal_padding_desc: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09B0\u09BE \u099F\u09C7\u0995\u09CD\u09B8\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09BE\u09AE \u098F\u09AC\u0982 \u09A1\u09BE\u09A8 \u09AA\u09CD\u09AF\u09BE\u09A1\u09BF\u0982 \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (px \u098F)",
      rounded_corners_wrapping: "\u09B2\u09BE\u0987\u09A8 \u09B0\u200D\u09CD\u09AF\u09BE\u09AA\u09BF\u0982\u09AF\u09BC\u09C7 \u0997\u09CB\u09B2\u09BE\u0995\u09BE\u09B0 \u0995\u09CB\u09A3",
      rounded_corners_wrapping_desc: "\u09B8\u0995\u09CD\u09B7\u09AE \u09B9\u09B2\u09C7, \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u0997\u09C1\u09B2\u09BF\u09B0 \u09B8\u09AC \u09A6\u09BF\u0995\u09C7 \u0997\u09CB\u09B2\u09BE\u0995\u09BE\u09B0 \u0995\u09CB\u09A3 \u09A5\u09BE\u0995\u09AC\u09C7, \u098F\u09AE\u09A8\u0995\u09BF \u09AF\u0996\u09A8 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A8\u09A4\u09C1\u09A8 \u09B2\u09BE\u0987\u09A8\u09C7 \u09B0\u200D\u09CD\u09AF\u09BE\u09AA \u09B9\u09AF\u09BC\u0964",
      enable_highlight_border: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      enable_highlight_border_desc: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u099A\u09BE\u09B0\u09AA\u09BE\u09B6\u09C7 \u098F\u0995\u099F\u09BF \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964 \u09AC\u09B0\u09CD\u09A1\u09BE\u09B0\u099F\u09BF \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09AC\u09BE \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B0\u0999\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AE\u09BF\u09B2\u09AC\u09C7\u0964",
      border_style: "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u09CD\u099F\u09BE\u0987\u09B2",
      border_style_desc: "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u0995\u09CB\u09A8 \u09A6\u09BF\u0995\u0997\u09C1\u09B2\u09BF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8",
      border_opacity: "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE",
      border_opacity_desc: "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0\u09C7\u09B0 \u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09A4\u09BE \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (0-100%)",
      border_thickness: "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A5\u09BF\u0995\u09A8\u09C7\u09B8 (px)",
      border_thickness_desc: "\u09AC\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A5\u09BF\u0995\u09A8\u09C7\u09B8 0-5 \u09AA\u09BF\u0995\u09CD\u09B8\u09C7\u09B2 \u09A5\u09C7\u0995\u09C7 \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8 (\u09AF\u09C7\u09AE\u09A8 1, 2.5, 5)",
      color_swatches_header: "\u09B0\u0999 \u09B8\u09CB\u09AF\u09BC\u09BE\u099A\u0997\u09C1\u09B2\u09BF",
      color_picker_layout: "\u09B0\u0999 \u09AA\u09BF\u0995\u09BE\u09B0 \u09B2\u09C7\u0986\u0989\u099F",
      color_picker_layout_desc: "\u099F\u09C7\u0995\u09CD\u09B8\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999 \u09AA\u09BF\u0995 \u0995\u09B0\u09BE\u09B0 \u09B8\u09AE\u09AF\u09BC \u0995\u09CB\u09A8 \u09B0\u0999 \u099F\u09BE\u0987\u09AA \u09A6\u09C7\u0996\u09BE\u09A4\u09C7 \u09B9\u09AC\u09C7 \u09A4\u09BE \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8",
      opt_both_text_left: "\u0989\u09AD\u09AF\u09BC: \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09AC\u09BE\u09AE, \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09A1\u09BE\u09A8",
      opt_both_bg_left: "\u0989\u09AD\u09AF\u09BC: \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AC\u09BE\u09AE, \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A1\u09BE\u09A8",
      opt_text_only: "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09B0\u0999",
      opt_background_only: "\u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B0\u0999",
      always_colored_texts_header: "\u09B8\u09B0\u09CD\u09AC\u09A6\u09BE \u09B0\u0999 \u0995\u09B0\u09BE \u099F\u09C7\u0995\u09CD\u09B8\u099F\u0997\u09C1\u09B2\u09BF",
      always_colored_texts_desc: "\u098F\u0996\u09BE\u09A8\u09C7\u0987 \u0986\u09AA\u09A8\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u098F\u09AC\u0982 \u09A4\u09BE\u09A6\u09C7\u09B0 \u09B0\u0999\u0997\u09C1\u09B2\u09BF \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C \u0995\u09B0\u09C7\u09A8\u0964",
      search_colored_words_placeholder: "\u09B0\u0999 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0985\u09A8\u09C1\u09B8\u09A8\u09CD\u09A7\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      "sort_label_last-added": "\u09B8\u09B0\u09CD\u099F: \u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09AF\u09CB\u0997",
      "sort_label_a-z": "\u09B8\u09B0\u09CD\u099F: A-Z",
      "sort_label_reverse-a-z": "\u09B8\u09B0\u09CD\u099F: Z-A",
      "sort_label_style-order": "\u09B8\u09B0\u09CD\u099F: \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0",
      sort_label_color: "\u09B8\u09B0\u09CD\u099F: \u09B0\u0999",
      btn_add_new_word: "+ \u09A8\u09A4\u09C1\u09A8 \u09B0\u0999 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6 / \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      btn_presets: "\u09AA\u09CD\u09B0\u09BF\u09B8\u09C7\u099F\u0997\u09C1\u09B2\u09BF",
      tooltip_delete_all_words: "\u09B8\u0982\u099C\u09CD\u099E\u09BE\u09AF\u09BC\u09BF\u09A4 \u09B8\u09AE\u09B8\u09CD\u09A4 \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09C1\u099B\u09C1\u09A8",
      confirm_delete_all_title: "\u09B8\u09AE\u09B8\u09CD\u09A4 \u09B6\u09AC\u09CD\u09A6 \u09AE\u09C1\u099B\u09C1\u09A8",
      confirm_delete_all_desc: "\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u09AF\u09C7 \u0986\u09AA\u09A8\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09B8\u09AE\u09B8\u09CD\u09A4 \u09B0\u0999 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09C1\u099B\u09A4\u09C7 \u099A\u09BE\u09A8? \u0986\u09AA\u09A8\u09BF \u098F\u099F\u09BF \u09AA\u09C2\u09B0\u09CD\u09AC\u09BE\u09AC\u09B8\u09CD\u09A5\u09BE\u09AF\u09BC \u09AB\u09BF\u09B0\u09BF\u09AF\u09BC\u09C7 \u0986\u09A8\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8 \u09A8\u09BE!",
      blacklist_words_header: "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u09B6\u09AC\u09CD\u09A6\u0997\u09C1\u09B2\u09BF",
      blacklist_words_desc: "\u098F\u0996\u09BE\u09A8\u09C7\u09B0 \u0995\u09C0\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8\u0997\u09C1\u09B2\u09BF \u0995\u0996\u09A8\u0993 \u09B0\u0999 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7 \u09A8\u09BE, \u098F\u09AE\u09A8\u0995\u09BF \u0986\u0982\u09B6\u09BF\u0995 \u09AE\u09CD\u09AF\u09BE\u099A\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF\u0993\u0964",
      show_blacklist_menu: "\u09B0\u09BE\u0987\u099F-\u0995\u09CD\u09B2\u09BF\u0995 \u09AE\u09C7\u09A8\u09C1\u09A4\u09C7 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u09B6\u09AC\u09CD\u09A6\u0997\u09C1\u09B2\u09BF \u09A6\u09C7\u0996\u09BE\u09A8",
      show_blacklist_menu_desc: "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09A5\u09C7\u0995\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u099F\u09BF \u09B0\u09BE\u0987\u099F-\u0915\u094D\u0932\u093F\u0915 \u092E\u0947\u0928\u09C1 \u0986\u0987\u099F\u09C7\u09AE \u09AF\u09CB\u0997 \u0995\u09B0\u09C7\u0964",
      search_blacklist_placeholder: "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0985\u09A8\u09C1\u09B8\u09A8\u09CD\u09A7\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      restart_required_title: "\u09B0\u09BF\u09B8\u09CD\u099F\u09BE\u09B0\u09CD\u099F \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8",
      restart_required_desc: "\u0995\u09AE\u09BE\u09A8\u09CD\u09A1 \u09AA\u09CD\u09AF\u09BE\u09B2\u09C7\u099F \u099F\u0997\u09B2 \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09A4\u09C7 \u09AA\u09CD\u09AF\u09BE\u09B2\u09C7\u099F \u09A5\u09C7\u0995\u09C7 \u0995\u09AE\u09BE\u09A8\u09CD\u09A1\u0997\u09C1\u09B2\u09BF \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3\u09AD\u09BE\u09AC\u09C7 \u09B8\u09B0\u09BE\u09A8\u09CB\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09AC\u09B8\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE\u09A8 \u09B0\u09BF\u09B8\u09CD\u099F\u09BE\u09B0\u09CD\u099F \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964 \u098F\u0996\u09A8\u0987 \u09B0\u09BF\u09B8\u09CD\u099F\u09BE\u09B0\u09CD\u099F \u0995\u09B0\u09AC\u09C7\u09A8?",
      highlight_preview: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989",
      highlight_preview_text: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u0995\u09C7\u09AE\u09A8 \u09A6\u09C7\u0996\u09BE\u09AC\u09C7 \u09A4\u09BE \u09A6\u09C7\u0996\u09C1\u09A8!",
      notice_pattern_blocked: "\u09AE\u09C7\u09AE\u09CB\u09B0\u09BF \u09B8\u09C7\u09AB\u099F\u09BF\u09B0 \u099C\u09A8\u09CD\u09AF \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AC\u09CD\u09B2\u0995 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7:",
      notice_pattern_too_complex: "\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u0996\u09C1\u09AC \u099C\u099F\u09BF\u09B2:",
      style_type_text: "\u09B0\u0999",
      style_type_highlight: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F",
      style_type_both: "\u0989\u09AD\u09AF\u09BC",
      word_pattern_placeholder_long: "\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8, \u09B6\u09AC\u09CD\u09A6 \u09AC\u09BE \u0995\u09AE\u09BE \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09AA\u09C3\u09A5\u0995 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6 (\u09AF\u09C7\u09AE\u09A8 hello, world, foo)",
      word_pattern_placeholder_short: "\u0995\u09C0\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8, \u09AC\u09BE \u0995\u09AE\u09BE \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09AA\u09C3\u09A5\u0995 \u0995\u09B0\u09BE \u09B6\u09AC\u09CD\u09A6",
      use_regex: "\u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8",
      flags_placeholder: "\u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u0997\u09CD\u09B8",
      text_color_title: "\u099F\u09C7\u0995\u09CD\u09B8\u099F\u09C7\u09B0 \u09B0\u0999",
      select_swatch: "\u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      highlight_color_title: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u09B0\u0999",
      select_highlight_swatch: "\u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      path_rule_mode_include: "\u0985\u09A8\u09CD\u09A4\u09B0\u09CD\u09AD\u09C1\u0995\u09CD\u09A4",
      path_rule_mode_exclude: "\u09AC\u09BE\u09A6 \u09A6\u09BF\u09A8",
      enter_path_or_pattern: "\u09AA\u09BE\u09A5 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8",
      btn_add_blacklist: "+ \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u09B6\u09AC\u09CD\u09A6 \u09AC\u09BE \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      tooltip_delete_all_blacklist: "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09BE \u09B8\u09AE\u09B8\u09CD\u09A4 \u09B6\u09AC\u09CD\u09A6/\u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09C1\u099B\u09C1\u09A8",
      confirm_delete_all_blacklist_title: "\u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0995\u09B0\u09BE \u09B8\u09AE\u09B8\u09CD\u09A4 \u09B6\u09AC\u09CD\u09A6 \u09AE\u09C1\u099B\u09C1\u09A8",
      confirm_delete_all_blacklist_desc: "\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u09AF\u09C7 \u0986\u09AA\u09A8\u09BF \u09B8\u09AE\u09B8\u09CD\u09A4 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF \u09AE\u09C1\u099B\u09A4\u09C7 \u099A\u09BE\u09A8? \u0986\u09AA\u09A8\u09BF \u098F\u099F\u09BF \u09AA\u09C2\u09B0\u09CD\u09AC\u09BE\u09AC\u09B8\u09CD\u09A5\u09BE\u09AF\u09BC \u09AB\u09BF\u09B0\u09BF\u09AF\u09BC\u09C7 \u0986\u09A8\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8 \u09A8\u09BE!",
      file_folder_rules_header: "\u09AB\u09BE\u0987\u09B2 \u0993 \u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B0\u09C1\u09B2\u09B8",
      file_folder_rules_desc: "\u09A8\u09BE\u09AE \u09AE\u09CD\u09AF\u09BE\u099A\u09BF\u0982, \u09B8\u09A0\u09BF\u0995 \u09AA\u09BE\u09A5, \u09AC\u09BE \u09B0\u09C7\u0997\u09C7\u0995\u09CD\u09B8 \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0995\u09A8\u09CD\u099F\u09CD\u09B0\u09CB\u09B2 \u0995\u09B0\u09C1\u09A8\u0964 \u09AD\u09B2\u09CD\u099F-\u0993\u09AF\u09BC\u09BE\u0987\u09A1 \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09A4\u09C7 \u098F\u0995\u099F\u09BF \u09AB\u09BE\u0981\u0995\u09BE \u098F\u0995\u09CD\u09B8\u0995\u09CD\u09B2\u09C1\u09A1 \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF \u09B0\u09BE\u0996\u09C1\u09A8\u0964",
      search_file_folder_rules_placeholder: "\u09AB\u09BE\u0987\u09B2/\u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C1\u09B2\u09B8 \u0985\u09A8\u09C1\u09B8\u09A8\u09CD\u09A7\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u2026",
      "path_sort_label_last-added": "\u09B8\u09B0\u09CD\u099F: \u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09AF\u09CB\u0997",
      "path_sort_label_a-z": "\u0633\u09B0\u09CD\u099F: A-Z",
      "path_sort_label_reverse-a-z": "\u09B8\u09B0\u09CD\u099F: Z-A",
      path_sort_label_mode: "\u09B8\u09B0\u09CD\u099F: \u09AE\u09CB\u09A1",
      path_sort_label_type: "\u09B8\u09B0\u09CD\u099F: \u099F\u09BE\u0987\u09AA",
      btn_add_file_folder_rule: "+ \u09AB\u09BE\u0987\u09B2/\u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C1\u09B2 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
      disable_coloring_current_file: "\u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      disable_coloring_current_file_desc: "\u09AB\u09BE\u0987\u09B2 \u0993 \u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u09B0\u09C1\u09B2\u09B8 \u098F\u09B0 \u0985\u09A7\u09C0\u09A8\u09C7 \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u099F\u09BF \u098F\u0995\u09CD\u09B8\u0995\u09CD\u09B2\u09C1\u09A1 \u09B0\u09C1\u09B2 \u09AF\u09CB\u0997 \u0995\u09B0\u09C7\u0964",
      btn_disable_for_this_file: "\u098F\u0987 \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C1\u09A8",
      notice_no_active_file_to_disable: "\u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0985\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09CB\u09A8\u09CB \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BE\u0987\u09B2 \u09A8\u09C7\u0987\u3002",
      notice_already_disabled_for_path: "{path} \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u0999\u09BE\u09AF\u09BC\u09A8 \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7\u0987 \u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC",
      data_export_import_header: "\u09A1\u09C7\u099F\u09BE \u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F/\u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F",
      export_plugin_data: "\u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8 \u09A1\u09C7\u099F\u09BE \u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C1\u09A8",
      export_plugin_data_desc: "\u09B8\u09C7\u099F\u09BF\u0982\u09B8, \u09B6\u09AC\u09CD\u09A6 \u098F\u09AC\u0982 \u09B0\u09C1\u09B2\u0997\u09C1\u09B2\u09BF \u098F\u0995\u099F\u09BF JSON \u09AB\u09BE\u0987\u09B2\u09C7 \u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C1\u09A8\u3002",
      btn_export: "\u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F",
      notice_exported: "\u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7: {fname}",
      notice_export_failed: "\u098F\u0995\u09CD\u09B8\u09AA\u09CB\u09B0\u09CD\u099F \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5",
      import_plugin_data: "\u09AA\u09CD\u09B2\u09BE\u0997\u0987\u09A8 \u09A1\u09C7\u099F\u09BE \u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C1\u09A8",
      import_plugin_data_desc: "\u098F\u0995\u099F\u09BF JSON \u09AB\u09BE\u0987\u09B2 \u09A5\u09C7\u0995\u09C7 \u09B8\u09C7\u099F\u09BF\u0982\u09B8 \u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C1\u09A8",
      btn_import: "\u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F",
      notice_import_completed: "\u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8",
      notice_import_failed: "\u0987\u09AE\u09CD\u09AA\u09CB\u09B0\u09CD\u099F \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5",
      pick_color_header: "\u09B0\u0999 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8",
      selected_text_preview: "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09C7\u0995\u09CD\u09B8\u099F",
      notice_invalid_hex_format: "\u0985\u09AC\u09C8\u09A7 \u09B9\u09C7\u0995\u09CD\u09B8 \u09B0\u0999 \u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u099F\u0964 #RRGGBB \u09AC\u09BE #RGB \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8\u0964",
      notice_error_saving_changes: "\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8\u0997\u09C1\u09B2\u09BF \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0995\u09B0\u09A4\u09C7 \u09A4\u09CD\u09B0\u09C1\u099F\u09BF\u0964 \u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u0986\u09AC\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964",
      notice_invalid_color_format: "\u0985\u09AC\u09C8\u09A7 \u09B0\u0999 \u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u099F\u0964",
      changelog_view_on_github: "GitHub \u098F \u09A6\u09C7\u0996\u09C1\u09A8",
      changelog_loading: "\u09B0\u09BF\u09B2\u09BF\u099C \u09B2\u09CB\u09A1 \u09B9\u099A\u09CD\u099B\u09C7\u2026",
      changelog_no_info: "\u0995\u09CB\u09A8\u09CB \u09B0\u09BF\u09B2\u09BF\u099C \u09A4\u09A5\u09CD\u09AF \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964",
      changelog_release: "\u09B0\u09BF\u09B2\u09BF\u099C",
      changelog_no_notes: "\u0995\u09CB\u09A8\u09CB \u09A8\u09CB\u099F \u09A8\u09C7\u0987",
      changelog_failed_to_load: "\u09B0\u09BF\u09B2\u09BF\u099C \u09A8\u09CB\u099F\u09B8 \u09B2\u09CB\u09A1 \u0995\u09B0\u09A4\u09C7 \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5\u0964",
      no_rules_configured: "\u0995\u09CB\u09A8\u09CB \u09B0\u09C1\u09B2 \u0995\u09A8\u09AB\u09BF\u0997\u09BE\u09B0 \u0995\u09B0\u09BE \u09A8\u09C7\u0987\u0964",
      no_custom_swatches_yet: '\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8\u09CB \u0995\u0627\u0633\u09CD\u099F\u09AE \u09B8\u09CB\u09AF\u09BC\u09BE\u099A \u09A8\u09C7\u0987\u0964 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 "+ \u09B0\u0999 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8" \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8\u0964',
      use_global_highlight_style: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0997\u09CD\u09B2\u09CB\u09AC\u09BE\u09B2 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8",
      use_global_highlight_style_desc: "\u0986\u09AA\u09A8\u09BE\u09B0 \u0997\u09CD\u09B2\u09CB\u09AC\u09BE\u09B2 \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7\u0964 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE HTML/CSS \u09A6\u09C0\u09B0\u09CD\u0998 \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
      style_highlight_once: "\u098F\u0995\u09AC\u09BE\u09B0 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u0995\u09B0\u09C1\u09A8",
      style_highlight_once_desc: "\u0986\u09AA\u09A8\u09BE\u09B0 \u0995\u09BE\u09B8\u09CD\u099F\u09AE \u0987\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u09CD\u099F\u09BE\u0987\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7\u0964 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE HTML/CSS \u09A6\u09C0\u09B0\u09CD\u0998 \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
      label_built_in: "(\u09AC\u09BF\u09B2\u09CD\u099F-\u0987\u09A8)"
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
    var bd = require_bd();
    module2.exports = {
      en,
      es,
      fr,
      hi,
      it,
      bd
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
  MarkdownRenderer
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
    this._translations = typeof locales === "object" && locales ? locales : {};
    this._externalTranslations = {};
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
      const dict = this._translations && typeof this._translations === "object" ? this._translations : typeof locales === "object" && locales ? locales : {};
      if (dict && dict[code]) return code;
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
    if (!this.settings.disableToggleModes.ribbon) {
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
    }
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
        if (this.settings.enabled) new Notice(this.t("notice_enabled", "Always color text enabled"));
        else new Notice(this.t("notice_disabled", "Always color text disabled"));
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
      this.addCommand({
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
      this.addCommand({
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
            if (index > -1) {
              this.settings.disabledFiles.splice(index, 1);
            }
            await this.saveSettings();
            new Notice(this.t("notice_coloring_enabled_for_path", `Coloring enabled for ${md.path}`, { path: md.path }));
          } else {
            this.settings.disabledFiles.push(md.path);
            await this.saveSettings();
            new Notice(this.t("notice_coloring_disabled_for_path", `Coloring disabled for ${md.path}`, { path: md.path }));
          }
        }
      });
      this.addCommand({
        id: "toggle-always-color-text",
        name: this.t("command_toggle_global", "Enable/Disable Always Color Text"),
        callback: async () => {
          this.settings.enabled = !this.settings.enabled;
          await this.saveSettings();
          new Notice(this.settings.enabled ? this.t("notice_global_enabled", "Always Color Text Enabled") : this.t("notice_global_disabled", "Always Color Text Disabled"));
          this.reconfigureEditorExtensions();
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
        }
      });
      this._commandsRegistered = true;
    }
    if (this.settings.enabled) {
      this.enablePluginFeatures();
    }
  }
  registerCommandPalette() {
    try {
      if (this._commandsRegistered) return;
      this.addCommand({
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
      this.addCommand({
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
      this.addCommand({
        id: "toggle-always-color-text",
        name: this.t("command_toggle_global", "Enable/Disable Always Color Text"),
        callback: async () => {
          this.settings.enabled = !this.settings.enabled;
          await this.saveSettings();
          new Notice(this.settings.enabled ? this.t("notice_global_enabled", "Always Color Text Enabled") : this.t("notice_global_disabled", "Always Color Text Disabled"));
          this.reconfigureEditorExtensions();
          this.forceRefreshAllEditors();
          this.forceRefreshAllReadingViews();
        }
      });
      this.addCommand({
        id: "run-self-tests",
        name: this.t("command_run_self_tests", "Run Always Color Text self-tests"),
        callback: async () => {
          const results = [];
          try {
            const alpha = { pattern: "alpha", color: "#123456", isRegex: false, flags: "", styleType: "text" };
            const beta = { pattern: "beta", textColor: "#111111", backgroundColor: "#222222", isRegex: false, flags: "", styleType: "both" };
            const gamma = { pattern: "gamma", textColor: "currentColor", backgroundColor: "#333333", isRegex: false, flags: "", styleType: "highlight" };
            this.settings.wordEntries = this.settings.wordEntries.filter((e) => !e || e.pattern !== "alpha" && e.pattern !== "beta" && e.pattern !== "gamma");
            this.settings.wordEntries.push(alpha, beta, gamma);
            await this.saveSettings();
            this.compileWordEntries();
            this.compileTextBgColoringEntries();
            await this.loadSettings();
            await this.saveSettings();
            await this.loadSettings();
            const a = this.settings.wordEntries.find((e) => e.pattern === "alpha");
            const b = this.settings.wordEntries.find((e) => e.pattern === "beta");
            const g = this.settings.wordEntries.find((e) => e.pattern === "gamma");
            results.push(a && a.styleType === "text" && a.color === "#123456" ? "A: OK" : "A: FAIL");
            results.push(b && b.styleType === "both" && b.textColor === "#111111" && b.backgroundColor === "#222222" ? "B: OK" : "B: FAIL");
            results.push(g && g.styleType === "highlight" && g.backgroundColor === "#333333" && g.textColor === "currentColor" ? "C: OK" : "C: FAIL");
            try {
              a.backgroundColor = a.color;
              a.textColor = "currentColor";
              a.color = "";
              a.styleType = "highlight";
            } catch (e) {
            }
            try {
              g.color = g.backgroundColor;
              g.textColor = null;
              g.backgroundColor = null;
              g.styleType = "text";
            } catch (e) {
            }
            await this.saveSettings();
            await this.loadSettings();
            const a2 = this.settings.wordEntries.find((e) => e.pattern === "alpha");
            const g2 = this.settings.wordEntries.find((e) => e.pattern === "gamma");
            results.push(a2 && a2.styleType === "highlight" && a2.backgroundColor === "#123456" && a2.textColor === "currentColor" && (!a2.color || a2.color === "") ? "D: OK" : "D: FAIL");
            results.push(g2 && g2.styleType === "text" && g2.color === "#333333" && !g2.backgroundColor ? "E: OK" : "E: FAIL");
            const ok = results.every((r) => r.includes("OK"));
            new Notice(this.t(ok ? "notice_self_tests_passed" : "notice_self_tests_failed", `Self-tests ${ok ? "passed" : "failed"}: ${results.join(", ")}`, { details: results.join(", ") }));
          } catch (e) {
            new Notice(this.t("notice_self_tests_error", "Self-tests error: " + (e && e.message ? e.message : String(e))));
          }
        }
      });
      this.addCommand({
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
      this._commandsRegistered = true;
    } catch (e) {
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
    if (p.length > 200) throw new Error("Pattern too long");
    if (!isRegex) {
      p = p.replace(/[<>"'`]/g, "");
    }
    return p;
  }
  // NEW METHOD: Decode HTML entities for reading mode compatibility
  decodeHtmlEntities(text) {
    if (!text || typeof text !== "string") return text;
    const entities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&#x27;": "'",
      "&#x2F;": "/",
      "&#x22;": '"',
      "&#x3C;": "<",
      "&#x3E;": ">",
      "&#x26;": "&",
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
      "&#10003;": "\u2713",
      "&#x2713;": "\u2713",
      "&#10004;": "\u2714",
      "&#x2714;": "\u2714",
      "&rarr;": "\u2192",
      "&rightarrow;": "\u2192",
      "&#8594;": "\u2192",
      "&#x2192;": "\u2192",
      "&larr;": "\u2190",
      "&leftarrow;": "\u2190",
      "&#8592;": "\u2190",
      "&#x2190;": "\u2190",
      "&uarr;": "\u2191",
      "&uparrow;": "\u2191",
      "&#8593;": "\u2191",
      "&#x2191;": "\u2191",
      "&darr;": "\u2193",
      "&downarrow;": "\u2193",
      "&#8595;": "\u2193",
      "&#x2193;": "\u2193"
    };
    return text.replace(/&[#a-zA-Z0-9]+;/g, (match) => {
      return entities[match] || match;
    });
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
    const blocks = element.querySelectorAll?.(blockTags.join(", ")) || [];
    for (const block of blocks) {
      if (block.closest("code, pre")) continue;
      this.processBlockWithSimplePatterns(block, simpleEntries, folderEntry, effectiveStyle);
    }
  }
  // NEW METHOD: Process block with simple string matching
  processBlockWithSimplePatterns(block, simpleEntries, folderEntry, effectiveStyle) {
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node2) {
          if (node2.parentElement?.closest("code, pre")) {
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
        try {
          this.processActiveFileOnly(el, ctx);
        } catch (e) {
          debugWarn("ACT", "processActiveFileOnly failed", e);
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
          name: "Show Latest Release Notes",
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
      language: "en"
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
        let styleType = e.styleType;
        if (!styleType) {
          if (hasValidText && hasValidBg) styleType = "both";
          else if (hasValidBg) styleType = "highlight";
          else styleType = "text";
        }
        const finalColor = styleType === "both" || styleType === "highlight" ? "" : hasValidColor ? color : "";
        const finalText = hasValidText ? textColor : styleType === "highlight" ? "currentColor" : null;
        const finalBg = hasValidBg ? backgroundColor : null;
        return {
          pattern: e.pattern || e.word || "",
          color: finalColor,
          textColor: finalText,
          backgroundColor: finalBg,
          styleType,
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
            const styleType = textColor && textColor !== "currentColor" ? backgroundColor ? "both" : "text" : backgroundColor ? "highlight" : "text";
            this.settings.wordEntries.push({ pattern: patterns[0], color: styleType === "text" ? textColor || "" : "", isRegex, flags, groupedPatterns: Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : null, textColor: styleType !== "text" ? textColor : null, backgroundColor, styleType });
          }
        }
        this.settings.textBgColoringEntries = [];
      }
    } catch (e) {
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
    const url = "https://api.github.com/repos/Kazi-Aidah/always-color-text/releases";
    try {
      if (typeof requestUrl === "function") {
        const res = await requestUrl({ url, headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "Obsidian-Always-Color-Text" } });
        const data = res.json || (res.text ? JSON.parse(res.text) : null);
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {
    }
    try {
      const r = await fetch(url, { headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "Obsidian-Always-Color-Text" } });
      if (!r.ok) throw new Error("Network error");
      const data = await r.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
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
    if (typeof window !== "undefined" && window.showSaveFilePicker) {
      const handle = await window.showSaveFilePicker({ suggestedName: fname, types: [{ description: "JSON", accept: { "application/json": [".json"] } }] });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      return fname;
    } else {
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
    const isWordChar = (ch) => /\w/.test(ch) && ch !== "_" && ch !== "*";
    const leftOk = matchStart === 0 || !isWordChar(leftChar);
    const rightOk = matchEnd === text.length || !isWordChar(rightChar);
    return leftOk && rightOk;
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
      if (!pattern) return () => true;
      if (this.containsNonRomanCharacters(pattern)) {
        if (caseSensitive) {
          return (text) => typeof text === "string" && text.includes(pattern);
        } else {
          const lowerPattern = pattern.toLowerCase();
          return (text) => typeof text === "string" && text.toLowerCase().includes(lowerPattern);
        }
      }
      if (!isRegex) {
        if (caseSensitive) {
          return (text) => typeof text === "string" && text.includes(pattern);
        } else {
          const lowerPattern = pattern.toLowerCase();
          return (text) => typeof text === "string" && text.toLowerCase().includes(lowerPattern);
        }
      }
      try {
        if (pattern.includes("$") || pattern.includes("\u20AC") || pattern.includes("\xA3")) {
          return (text) => typeof text === "string" && (text.includes("$") || text.includes("\u20AC") || text.includes("\xA3"));
        }
        if (pattern.includes(":")) {
          return (text) => typeof text === "string" && text.includes(":");
        }
        if (pattern.includes("-")) {
          return (text) => typeof text === "string" && text.includes("-");
        }
        const literalMatch = pattern.match(/[A-Za-z]{3,}/);
        if (literalMatch) {
          const literal = literalMatch[0];
          if (caseSensitive) {
            return (text) => typeof text === "string" && text.includes(literal);
          } else {
            const lowerLiteral = literal.toLowerCase();
            return (text) => typeof text === "string" && text.toLowerCase().includes(lowerLiteral);
          }
        }
      } catch (e) {
      }
    } catch (e) {
    }
    return () => true;
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
      const entries = Array.isArray(this._compiledWordEntries) ? this._compiledWordEntries : [];
      const numWords = entries.length;
      if (numWords > 200) {
        debugWarn("GET_SORTED", `You have ${numWords} colored words/patterns! That's a lot and may impact performance.`);
      }
      const filtered = entries.filter((e) => {
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
    if (!this.settings.enableBorderThickness) {
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
    if (!this.settings.enableBorderThickness) {
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
    const fileMatch = this._basename(fp) === nm;
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
    return { included, excluded, hasIncludes };
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
            isRegex,
            flags,
            regex: null,
            testRegex: null,
            invalid: false,
            specificity: pattern.replace(/\*/g, "").length,
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
              compiled.regex = new RegExp(pattern, flags);
              const testFlags = flags.replace(/g/g, "");
              compiled.testRegex = testFlags === "" ? new RegExp(pattern) : new RegExp(pattern, testFlags);
            } else {
              const esc = this.escapeRegex(pattern);
              const literalFlags = this.settings.caseSensitive ? "g" : "gi";
              compiled.regex = new RegExp(esc, literalFlags);
              compiled.testRegex = this.settings.caseSensitive ? new RegExp(esc) : new RegExp(esc, "i");
            }
          } catch (err) {
            compiled.invalid = true;
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
            isRegex,
            flags,
            regex: null,
            testRegex: null,
            invalid: false,
            specificity: pattern.replace(/\*/g, "").length,
            isTextBg: true
            // Mark as text+bg entry
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
              compiled.regex = new RegExp(pattern, flags);
              const testFlags = flags.replace(/g/g, "");
              compiled.testRegex = testFlags === "" ? new RegExp(pattern) : new RegExp(pattern, testFlags);
            } else {
              const esc = this.escapeRegex(pattern);
              compiled.regex = new RegExp(esc, flags);
              const testFlags = flags.replace(/g/g, "");
              compiled.testRegex = testFlags === "" ? new RegExp(esc) : new RegExp(esc, testFlags);
            }
            try {
              compiled.fastTest = this.createFastTester(pattern, isRegex, this.settings.caseSensitive);
            } catch (e2) {
              compiled.fastTest = (text) => true;
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
  }
  // Apply Highlights in Reading View (Markdown Post Processor) - optional folderEntry may override match colors
  applyHighlights(el, folderEntry = null, options = {}) {
    const entries = this.getSortedWordEntries();
    if (entries.length === 0) return;
    if (!el.isConnected) return;
    this._wrapMatchesRecursive(el, entries, folderEntry, options || {});
  }
  // NEW METHOD: Apply highlights for simple patterns (ultra-fast version)
  applySimpleHighlights(textNode, matches, text) {
    if (!matches || matches.length === 0) return;
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
    for (const m of nonOverlapping) {
      if (m.start > pos) {
        frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
      }
      const span = document.createElement("span");
      span.className = "always-color-text-highlight";
      span.textContent = text.slice(m.start, m.end);
      const entry = m.entry;
      const styleType = entry && entry.styleType ? entry.styleType : "text";
      const color = m.folderEntry && m.folderEntry.defaultColor ? m.folderEntry.defaultColor : entry.color;
      if (styleType === "text") {
        span.style.color = color;
        try {
          span.style.setProperty("--highlight-color", color);
        } catch (e) {
        }
      } else if (styleType === "highlight") {
        const bgColor = entry.backgroundColor || color;
        span.style.backgroundColor = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
        span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
        span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
        if (this.settings.enableBoxDecorationBreak ?? true) {
          span.style.boxDecorationBreak = "clone";
          span.style.WebkitBoxDecorationBreak = "clone";
        }
        this.applyBorderStyleToElement(span, null, bgColor);
      } else if (styleType === "both") {
        const textColor = entry.textColor && entry.textColor !== "currentColor" ? entry.textColor : null;
        const bgColor = entry.backgroundColor || color;
        if (textColor) {
          span.style.color = textColor;
          try {
            span.style.setProperty("--highlight-color", textColor);
          } catch (e) {
          }
        }
        span.style.backgroundColor = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
        span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
        span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
        if (this.settings.enableBoxDecorationBreak ?? true) {
          span.style.boxDecorationBreak = "clone";
          span.style.WebkitBoxDecorationBreak = "clone";
        }
        this.applyBorderStyleToElement(span, textColor, bgColor);
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
    debugLog("ACT", "Processing active file", ctx.sourcePath.slice(-30));
    if (this.settings.forceFullRenderInReading) {
      try {
        debugWarn("ACT", "forceFullRenderInReading enabled - forcing full processing");
        const pr0 = this.evaluatePathRules(ctx.sourcePath);
        if (pr0.excluded || this.hasGlobalExclude() && pr0.hasIncludes && !pr0.included) return;
        if (this.settings.disabledFiles.includes(ctx.sourcePath)) return;
        if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;
        const folderEntry2 = this.getBestFolderEntry(ctx.sourcePath);
        this.processInChunks(el, this.getSortedWordEntries(), folderEntry2, {
          skipFirstN: 0,
          batchSize: 30,
          // Use regular batch size even when forced to yield periodically
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
    if (pr.excluded || this.hasGlobalExclude() && pr.hasIncludes && !pr.included) return;
    if (this.settings.disabledFiles.includes(ctx.sourcePath)) return;
    if (this.isFrontmatterColoringDisabled(ctx.sourcePath)) return;
    const folderEntry = this.getBestFolderEntry(ctx.sourcePath);
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
          this.setupViewportObserver(el, folderEntry || null, { clearExisting: true });
        } catch (e) {
          debugError("ACT", "setupViewportObserver failed", e);
          this.applyHighlights(el, folderEntry || null, { immediateBlocks, clearExisting: true });
        }
        return;
      }
    } catch (e) {
    }
    const processNow = () => this.applyHighlights(el, folderEntry || null, { immediateBlocks, clearExisting: true });
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
            this.processInChunks(el, this.getSortedWordEntries(), folderEntry || null, { skipFirstN: immediateBlocks, batchSize: 30, clearExisting: true, forceProcess: true }).then(() => debugLog("DEFERRED", `Completed: ${label} in ${(performance.now() - t1).toFixed(1)}ms`)).catch((e) => debugError("DEFERRED", "processInChunks error", e));
          } catch (e) {
            debugError("DEFERRED", "fallback applyHighlights due to error", e);
            this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: true });
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
          this.applyHighlights(el, folderEntry || null, { skipFirstN: immediateBlocks, clearExisting: false });
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
      this.applyHighlights(el, folderEntry, {
        immediateBlocks: 50,
        skipFirstN: 0,
        clearExisting: true
      });
      setTimeout(() => {
        try {
          this.processInChunks(el, this.getSortedWordEntries(), folderEntry, {
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
    const clearExisting = opts.clearExisting !== false;
    const effectiveStyle = "text";
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
        const color = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
        let pos = 0;
        while ((pos = text.indexOf(pattern, pos)) !== -1) {
          matches.push({
            start: pos,
            end: pos + pattern.length,
            color,
            word: pattern
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
          if (effectiveStyle === "text") {
            span.style.color = m.color;
            try {
              span.style.setProperty("--highlight-color", m.color);
            } catch (e) {
            }
          } else {
            span.style.backgroundColor = this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25);
            span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
            span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
            if (this.settings.enableBoxDecorationBreak ?? true) {
              span.style.boxDecorationBreak = "clone";
              span.style.WebkitBoxDecorationBreak = "clone";
            }
            this.applyBorderStyleToElement(span, null, m.color);
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
    debugLog("WRAP", `Starting with ${entries.length} entries`);
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
    const simpleEntries = entries.filter(
      (entry) => entry && !entry.invalid && this.isSimplePattern(entry.pattern)
    );
    const complexEntries = entries.filter(
      (entry) => entry && !entry.invalid && !this.isSimplePattern(entry.pattern)
    );
    debugLog("WRAP", `Pattern split: ${simpleEntries.length} simple, ${complexEntries.length} complex`);
    if (simpleEntries.length > 0) {
      try {
        debugLog("WRAP", `Processing ${simpleEntries.length} simple patterns`);
        this.processSimplePatternsOptimized(element, simpleEntries, folderEntry, options);
      } catch (e) {
        debugError("SIMPLE", "processSimplePatternsOptimized failed", e);
      }
    }
    if (complexEntries.length > 0 && !this.isPerformanceOverloaded()) {
      debugLog("ACT", `Processing ${complexEntries.length} complex patterns`);
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
                debugLog("DOM", "Skipping: perf overload");
                this._lastPerfWarning = now;
              }
            } catch (e) {
              debugLog("DOM", "Skipping: perf overload");
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
          debugLog("DOM", `Skipping: DOM too large (${nodeCount} nodes)`);
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
    for (const node of element.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && !["CODE", "PRE"].includes(node.nodeName)) {
        if (blockTags.includes(node.nodeName)) queue.push(node);
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
      this._processBlock(block, entries, folderEntry, { clearExisting, effectiveStyle, immediateLimit, qIndex, skipFirstN, element, forceProcess: options && options.forceProcess || this.settings.forceFullRenderInReading, maxMatches: options && options.maxMatches || (this.settings.forceFullRenderInReading ? Infinity : void 0) });
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
    const textNodes = [];
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (node.parentElement?.closest("code, pre")) {
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
      const textBgEntries = Array.isArray(this._compiledTextBgEntries) ? this._compiledTextBgEntries : [];
      const TEXT_BG_CHUNK_SIZE = 10;
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
              if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
                continue;
              }
              let fullWordStart = matchStart;
              let fullWordEnd = matchEnd;
              while (fullWordStart > 0 && /\w/.test(text[fullWordStart - 1]) && text[fullWordStart - 1] !== "_" && text[fullWordStart - 1] !== "*") {
                fullWordStart--;
              }
              while (fullWordEnd < text.length && /\w/.test(text[fullWordEnd]) && text[fullWordEnd] !== "_" && text[fullWordEnd] !== "*") {
                fullWordEnd++;
              }
              const fullWord = text.substring(fullWordStart, fullWordEnd);
              if (isBlacklisted(fullWord)) continue;
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
            if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
              continue;
            }
            let fullWordStart = matchStart;
            let fullWordEnd = matchEnd;
            while (fullWordStart > 0 && /\w/.test(text[fullWordStart - 1]) && text[fullWordStart - 1] !== "_" && text[fullWordStart - 1] !== "*") {
              fullWordStart--;
            }
            while (fullWordEnd < text.length && /\w/.test(text[fullWordEnd]) && text[fullWordEnd] !== "_" && text[fullWordEnd] !== "*") {
              fullWordEnd++;
            }
            const fullWord = text.substring(fullWordStart, fullWordEnd);
            if (isBlacklisted(fullWord)) continue;
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
        try {
          entry.blocksProcessed = (entry.blocksProcessed || 0) + 1;
        } catch (e) {
        }
        try {
          const skipFastTest = opts && opts.forceProcess || this.settings.forceFullRenderInReading;
          if (entry.fastTest && typeof entry.fastTest === "function" && !skipFastTest) {
            const possible = entry.fastTest(text);
            if (!possible) {
              entry.avoidedExecs = (entry.avoidedExecs || 0) + 1;
              this._perfCounters.avoidedRegexExecs = (this._perfCounters.avoidedRegexExecs || 0) + 1;
              debugLog("BLOCK", `fastTest rejected: ${entry.pattern.slice(0, 20)}`);
              continue;
            }
          } else if (entry.fastTest && skipFastTest) {
            try {
              entry.fastTestBypassed = (entry.fastTestBypassed || 0) + 1;
            } catch (e) {
            }
          }
        } catch (e) {
          debugError("BLOCK", "fastTest error", e);
        }
        const regex = entry.regex;
        if (!regex) continue;
        let iterCount = 0;
        const _matches = this.safeMatchLoop(regex, text);
        for (const match of _matches) {
          const matchedText = match[0];
          const matchStart = match.index;
          const matchEnd = match.index + matchedText.length;
          if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
            iterCount++;
            continue;
          }
          let fullWordStart = matchStart;
          let fullWordEnd = matchEnd;
          while (fullWordStart > 0 && /\w/.test(text[fullWordStart - 1]) && text[fullWordStart - 1] !== "_" && text[fullWordStart - 1] !== "*") {
            fullWordStart--;
          }
          while (fullWordEnd < text.length && /\w/.test(text[fullWordEnd]) && text[fullWordEnd] !== "_" && text[fullWordEnd] !== "*") {
            fullWordEnd++;
          }
          const fullWord = text.substring(fullWordStart, fullWordEnd);
          if (this.isWordBlacklisted(fullWord)) continue;
          const overlappingTextBgIndices = [];
          for (let i = 0; i < matches.length; i++) {
            const tbMatch = matches[i];
            if (!tbMatch || !tbMatch.isTextBg) continue;
            if (match.index < tbMatch.end && match.index + matchedText.length > tbMatch.start) {
              overlappingTextBgIndices.push(i);
            }
          }
          if (overlappingTextBgIndices.length > 0) {
            const mLength = matchedText.length;
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
          const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
          matches.push({
            start: match.index,
            end: match.index + matchedText.length,
            color: useColor,
            word: matchedText,
            highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4,
            highlightBorderRadius: this.settings.highlightBorderRadius ?? 8,
            styleType: entry.styleType,
            textColor: entry.textColor,
            backgroundColor: entry.backgroundColor
          });
          try {
            entry.matchesFound = (entry.matchesFound || 0) + 1;
          } catch (e) {
          }
          try {
            this._perfCounters.totalMatchesFound = (this._perfCounters.totalMatchesFound || 0) + 1;
          } catch (e) {
          }
          if (matches.length > maxMatches) break;
          iterCount++;
        }
        if (matches.length > maxMatches) break;
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
        try {
          const HOT_ITERS_SINGLE = 100;
          const HOT_ITERS_TOTAL = 500;
          if ((iterCount > HOT_ITERS_SINGLE || (entry.execs || 0) > HOT_ITERS_TOTAL) && !entry._hotLogged) {
            debugWarn("BLOCK", `HOT: "${entry.pattern.slice(0, 30)}" iter=${iterCount} total=${entry.execs}`);
            entry._hotLogged = true;
          }
        } catch (e) {
        }
      }
      if (matches.length > 1) {
        debugLog("OVERLAP", `Before resolution: ${matches.length} matches found`);
        matches.sort((a, b) => {
          if (a.start !== b.start) return a.start - b.start;
          const lenA = a.end - a.start;
          const lenB = b.end - b.start;
          if (lenA !== lenB) return lenB - lenA;
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
                  isTextBg: true
                });
              } else {
                matches = matches.filter((m) => !(m.start >= start && m.end <= end && m.end - m.start < end - start));
                matches.push({
                  start,
                  end,
                  textColor: entry.textColor,
                  backgroundColor: entry.backgroundColor,
                  isTextBg: true
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
        const wordRegex = /\S+/g;
        let match;
        while (match = wordRegex.exec(text)) {
          const w = match[0];
          const start = match.index;
          const end = start + w.length;
          if (isBlacklisted(w)) continue;
          for (const entry of entries) {
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
                const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
                matches.push({ start, end, color: useColor, word: w, highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
              } else {
                matches = matches.filter((m) => !(m.start >= start && m.end <= end && m.end - m.start < end - start));
                const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
                matches.push({ start, end, color: useColor, word: w, highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
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
      for (const entry of entries) {
        if (!entry || entry.invalid) continue;
        if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) {
          const regex = entry.regex;
          if (!regex) continue;
          const _matches = this.safeMatchLoop(regex, text);
          for (const match of _matches) {
            const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
            matches.push({ start: match.index, end: match.index + match[0].length, color: useColor, word: match[0], highlightHorizontalPadding: this.settings.highlightHorizontalPadding ?? 4, highlightBorderRadius: this.settings.highlightBorderRadius ?? 8 });
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
                const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : symEntry.color;
                matches.push({ start, end, color: useColor, word: w });
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
      let lastEnd = 0;
      if (nonOverlapping.length) {
        const frag = document.createDocumentFragment();
        let pos = 0;
        let i = 0;
        while (i < nonOverlapping.length) {
          let m = nonOverlapping[i];
          let j = i + 1;
          while (j < nonOverlapping.length && nonOverlapping[j].start === nonOverlapping[j - 1].end && !m.isTextBg && !nonOverlapping[j].isTextBg && nonOverlapping[j].color === m.color) {
            m = { start: m.start, end: nonOverlapping[j].end, color: m.color };
            j++;
          }
          if (m.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, m.start)));
          if (effectiveStyle === "none") {
            frag.appendChild(document.createTextNode(text.slice(m.start, m.end)));
          } else {
            const span = document.createElement("span");
            span.className = "always-color-text-highlight";
            span.textContent = text.slice(m.start, m.end);
            const styleType = m.isTextBg ? "both" : m.styleType || "text";
            if (styleType === "text") {
              span.style.color = m.color;
              try {
                span.style.setProperty("--highlight-color", m.color);
              } catch (e) {
              }
            } else if (styleType === "highlight") {
              const bgColor = m.backgroundColor || m.color;
              span.style.background = "";
              span.style.backgroundColor = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
              span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
              if ((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) {
                span.style.borderRadius = "0px";
              } else {
                span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
              }
              if (this.settings.enableBoxDecorationBreak ?? true) {
                span.style.boxDecorationBreak = "clone";
                span.style.WebkitBoxDecorationBreak = "clone";
              }
              this.applyBorderStyleToElement(span, null, bgColor);
            } else if (styleType === "both") {
              const textColor = m.textColor && m.textColor !== "currentColor" ? m.textColor : m.color || null;
              const bgColor = m.backgroundColor || m.color;
              if (textColor) {
                span.style.color = textColor;
                try {
                  span.style.setProperty("--highlight-color", textColor);
                } catch (e) {
                }
              }
              span.style.background = "";
              span.style.backgroundColor = this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25);
              span.style.paddingLeft = span.style.paddingRight = (this.settings.highlightHorizontalPadding ?? 4) + "px";
              if ((this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0) {
                span.style.borderRadius = "0px";
              } else {
                span.style.borderRadius = (this.settings.highlightBorderRadius ?? 8) + "px";
              }
              if (this.settings.enableBoxDecorationBreak ?? true) {
                span.style.boxDecorationBreak = "clone";
                span.style.WebkitBoxDecorationBreak = "clone";
              }
              this.applyBorderStyleToElement(span, textColor, bgColor);
            }
            frag.appendChild(span);
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
        setTimeout(() => {
          try {
            this.processInChunks(element, entries, folderEntry, options);
          } catch (e) {
            debugError("CHUNK", "retry failed", e);
          }
        }, 300);
        blocks.length = 0;
        return;
      }
      try {
        this._processBlock(blocks[i], entries, folderEntry, {
          clearExisting: options.clearExisting !== false,
          effectiveStyle: "text",
          forceProcess: forceProcess || this.settings.forceFullRenderInReading,
          maxMatches: options && typeof options.maxMatches !== "undefined" ? options.maxMatches : forceProcess || this.settings.forceFullRenderInReading ? Infinity : void 0
        });
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
          if (selectorTags.has(node.nodeName)) blocks.push(node);
        }
      } catch (e) {
        try {
          const nodeList = rootEl.querySelectorAll("p, li, div, span, td, th, blockquote, h1, h2, h3, h4, h5, h6");
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
      const io = new IntersectionObserver((entries) => {
        for (const ent of entries) {
          try {
            if (ent.isIntersecting) {
              const block = ent.target;
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
              try {
                this._processBlock(block, this.getSortedWordEntries(), folderEntry, { clearExisting: options.clearExisting !== false, effectiveStyle: "text", forceProcess: options.forceProcess || this.settings.forceFullRenderInReading, maxMatches: options.maxMatches || (this.settings.forceFullRenderInReading ? Infinity : void 0) });
              } catch (e) {
                debugError("VIEWPORT", "_processBlock failed", e);
              }
            }
          } catch (e) {
            debugError("VIEWPORT", "observer entry error", e);
          }
        }
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
              this._processBlock(b, this.getSortedWordEntries(), folderEntry, { clearExisting: options.clearExisting !== false, effectiveStyle: "text", forceProcess: options.forceProcess || this.settings.forceFullRenderInReading, maxMatches: options.maxMatches || (this.settings.forceFullRenderInReading ? Infinity : void 0) });
            }
            count++;
          }
        }
      } catch (e) {
        debugError("VIEWPORT", "Error prefetching visible blocks", e);
      }
      debugLog("VIEWPORT", `observer set: ${blocks.length} blocks, immediate=${options.immediateBlocks || 10}`);
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
      const style = effectiveStyle === "text" ? `color: ${m.color} !important;` : `background: none !important; background-color: ${this.hexToRgba(m.color, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0 ? 0 : this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}`;
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
        const currentFilePath = plugin.app.workspace.getActiveFile()?.path;
        const fileChanged = this.lastFilePath !== currentFilePath;
        this.lastFilePath = currentFilePath;
        if (update.docChanged || update.viewportChanged || fileChanged) {
          this.decorations = this.buildDeco(update.view);
        }
      }
      buildDeco(view) {
        const builder = new RangeSetBuilder();
        const entries = plugin.getSortedWordEntries();
        const { from, to } = view.viewport;
        const text = view.state.doc.sliceString(from, to);
        const fileForView = view.file || plugin.app.workspace.getActiveFile();
        if (!plugin.settings.enabled) return builder.finish();
        if (fileForView) {
          const prb = plugin.evaluatePathRules(fileForView.path);
          if (prb.excluded || plugin.hasGlobalExclude() && prb.hasIncludes && !prb.included) return builder.finish();
          if (plugin.settings.disabledFiles.includes(fileForView.path)) return builder.finish();
          if (plugin.isFrontmatterColoringDisabled(fileForView.path)) return builder.finish();
        }
        const folderEntry = fileForView ? plugin.getBestFolderEntry(fileForView.path) : null;
        if (entries.length === 0) return builder.finish();
        if (entries.length > EDITOR_PERFORMANCE_CONSTANTS.MAX_PATTERNS_STANDARD || text.length > EDITOR_PERFORMANCE_CONSTANTS.MAX_TEXT_LENGTH_STANDARD) {
          return plugin.buildDecoChunked(view, builder, from, to, text, entries, folderEntry);
        }
        return plugin.buildDecoStandard(view, builder, from, to, text, entries, folderEntry);
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
  // NEW METHOD: Check if word is blacklisted
  isWordBlacklisted(word) {
    try {
      const entries = Array.isArray(this.settings.blacklistEntries) ? this.settings.blacklistEntries : [];
      const words = Array.isArray(this.settings.blacklistWords) ? this.settings.blacklistWords : [];
      const w = this.settings.caseSensitive ? String(word) : String(word).toLowerCase();
      for (const bw of words) {
        if (!bw) continue;
        const cmp = this.settings.caseSensitive ? String(bw) : String(bw).toLowerCase();
        if (w === cmp) return true;
      }
      for (const entry of entries) {
        if (!entry) continue;
        if (entry.isRegex && this.settings.enableRegexSupport) {
          try {
            const flags = entry.flags || (this.settings.caseSensitive ? "" : "i");
            const re = new RegExp(entry.pattern, flags);
            if (re.test(word)) return true;
          } catch (e) {
          }
        } else {
          const patterns = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns : [entry.pattern];
          for (const p of patterns) {
            if (!p) continue;
            const cmp = this.settings.caseSensitive ? String(p) : String(p).toLowerCase();
            if (w === cmp) return true;
          }
        }
      }
    } catch (e) {
    }
    return false;
  }
  // NEW METHOD: Standard editor processing for small/medium pattern/text sizes
  buildDecoStandard(view, builder, from, to, text, entries, folderEntry) {
    const entries_copy = entries || this.getSortedWordEntries();
    let matches = [];
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
        if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
          continue;
        }
        const fullWord = this.extractFullWord(text, matchStart, matchEnd);
        if (this.isWordBlacklisted(fullWord)) continue;
        const absStart = from + matchStart;
        const absEnd = from + matchEnd;
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
        if (this.settings.partialMatch) {
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
        if (matches.length > 3e3) break;
      }
      if (matches.length > 3e3) break;
    }
    for (const entry of entries_copy) {
      if (!entry || entry.invalid) continue;
      try {
        if (entry.fastTest && typeof entry.fastTest === "function" && !entry.fastTest(text)) continue;
      } catch (e) {
      }
      const regex = entry.regex;
      if (!regex) continue;
      let iterCount = 0;
      const _matches2 = this.safeMatchLoop(regex, text);
      for (const match of _matches2) {
        iterCount++;
        const matchedText = match[0];
        const matchStart = from + match.index;
        const matchEnd = from + match.index + matchedText.length;
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
          const allShorter = overlappingTextBgIndices.every((i) => matches[i].end - matches[i].start < mLength);
          if (!allShorter) {
            try {
              if (typeof regex.lastIndex === "number" && regex.lastIndex === match.index) regex.lastIndex++;
            } catch (e) {
            }
            continue;
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
        if (!this.isWholeWordMatch(text, match.index, match.index + matchedText.length)) {
          continue;
        }
        const fullWord = this.extractFullWord(text, match.index, match.index + matchedText.length);
        if (this.isWordBlacklisted(fullWord)) continue;
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
      const wordRegex = /\S+/g;
      let match;
      while (match = wordRegex.exec(text)) {
        const w = match[0];
        const wStart = match.index;
        const wEnd = wStart + w.length;
        if (this.isWordBlacklisted(w)) continue;
        const absWStart = from + wStart;
        const absWEnd = from + wEnd;
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
        for (const entry of entries_copy) {
          if (!entry || entry.invalid) continue;
          if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
          if (this.isWordBlacklisted(entry.pattern)) continue;
          const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), "i"));
          if (testRe.test(w)) {
            let overlapsWithExisting = false;
            for (const existingMatch of matches) {
              const existStart = existingMatch.start - from;
              const existEnd = existingMatch.end - from;
              if (wStart < existEnd && wEnd > existStart) {
                overlapsWithExisting = true;
                break;
              }
            }
            if (!overlapsWithExisting) {
              const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
              matches.push({ start: from + wStart, end: from + wEnd, color: useColor });
              if (matches.length > 3e3) break;
            } else {
              matches = matches.filter((m) => !(m.start >= from + wStart && m.end <= from + wEnd && m.end - m.start < wEnd - wStart));
              const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
              matches.push({ start: from + wStart, end: from + wEnd, color: useColor });
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
        const borderStyle = this.generateBorderStyle(m.textColor, m.backgroundColor);
        style = `color: ${m.textColor} !important; background-color: ${this.hexToRgba(m.backgroundColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
      } else {
        const styleType = m.styleType || "text";
        if (styleType === "text") {
          style = `color: ${m.color} !important;`;
        } else if (styleType === "highlight") {
          const bgColor = m.backgroundColor || m.color;
          const borderStyle = this.generateBorderStyle(null, bgColor);
          style = `background: none !important; background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0 ? 0 : this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
        } else if (styleType === "both") {
          const textColor = m.textColor && m.textColor !== "currentColor" ? m.textColor : m.color || null;
          const bgColor = m.backgroundColor || m.color;
          const borderStyle = this.generateBorderStyle(textColor, bgColor);
          style = `${textColor ? `color: ${textColor} !important; ` : ""}background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
        } else {
          style = `color: ${m.color} !important;`;
        }
      }
      const deco = Decoration.mark({ attributes: { style, class: "always-color-text-highlight" } });
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
          if (!this.settings.partialMatch && !this.isWholeWordMatch(text, matchStart, matchEnd)) {
            try {
              if (typeof regex.lastIndex === "number" && regex.lastIndex === match.index) regex.lastIndex++;
            } catch (e) {
            }
            continue;
          }
          const fullWord = this.extractFullWord(text, matchStart, matchEnd);
          if (this.isWordBlacklisted(fullWord)) continue;
          if (hasHeadingBlacklist && headingRanges && headingRanges.length > 0) {
            const absStart = from + matchStart;
            const absEnd = from + matchEnd;
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
          if (this.settings.partialMatch) {
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
    if (entries.length > CHUNK_SIZE) {
      debugLog("EDITOR", `Processing ${entries.length} patterns in chunks (chunk size: ${CHUNK_SIZE})`);
      for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
        const chunk = entries.slice(i, i + CHUNK_SIZE);
        const chunkMatches = this.processPatternChunk(text, from, chunk, folderEntry, allMatches, hasHeadingBlacklist ? headingRanges : []);
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
  processPatternChunk(text, baseFrom, patternChunk, folderEntry, existingMatches = [], headingRanges = []) {
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
        const fullWord = this.extractFullWord(text, match.index, match.index + matchedText.length);
        if (this.isWordBlacklisted(fullWord)) continue;
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
        for (const entry of patternChunk) {
          if (!entry || entry.invalid) continue;
          if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
          if (this.isWordBlacklisted(entry.pattern)) continue;
          const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), "i"));
          if (testRe.test(w)) {
            let overlapsWithExisting = false;
            for (const existingMatch of matches) {
              if (baseFrom + wStart < existingMatch.end && baseFrom + wEnd > existingMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            for (const textBgMatch of existingMatches) {
              if (textBgMatch.isTextBg && baseFrom + wStart < textBgMatch.end && baseFrom + wEnd > textBgMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            if (!overlapsWithExisting) {
              matches.push({
                start: baseFrom + wStart,
                end: baseFrom + wEnd,
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
        if (!this.isWholeWordMatch(chunkText, match.index, match.index + matchedText.length)) {
          continue;
        }
        const fullWord = this.extractFullWord(chunkText, match.index, match.index + matchedText.length);
        if (this.isWordBlacklisted(fullWord)) continue;
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
      const wordRegex = /\S+/g;
      let match;
      while (match = wordRegex.exec(chunkText)) {
        const w = match[0];
        const wStart = match.index;
        const wEnd = wStart + w.length;
        if (this.isWordBlacklisted(w)) continue;
        for (const entry of entries) {
          if (!entry || entry.invalid) continue;
          if (/^[^a-zA-Z0-9]+$/.test(entry.pattern)) continue;
          if (this.isWordBlacklisted(entry.pattern)) continue;
          const testRe = entry.testRegex || (this.settings.caseSensitive ? new RegExp(this.escapeRegex(entry.pattern)) : new RegExp(this.escapeRegex(entry.pattern), "i"));
          if (testRe.test(w)) {
            let overlapsWithExisting = false;
            for (const existingMatch of matches) {
              if (chunkFrom + wStart < existingMatch.end && chunkFrom + wEnd > existingMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            for (const textBgMatch of existingMatches) {
              if (textBgMatch.isTextBg && chunkFrom + wStart < textBgMatch.end && chunkFrom + wEnd > textBgMatch.start) {
                overlapsWithExisting = true;
                break;
              }
            }
            if (!overlapsWithExisting) {
              const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
              matches.push({
                start: chunkFrom + wStart,
                end: chunkFrom + wEnd,
                color: useColor,
                styleType: entry.styleType,
                textColor: entry.textColor,
                backgroundColor: entry.backgroundColor
              });
              if (matches.length > 100) break;
            } else {
              for (let i = matches.length - 1; i >= 0; i--) {
                const m = matches[i];
                if (m.start >= chunkFrom + wStart && m.end <= chunkFrom + wEnd && m.end - m.start < wEnd - wStart) {
                  matches.splice(i, 1);
                }
              }
              const useColor = folderEntry && folderEntry.defaultColor ? folderEntry.defaultColor : entry.color;
              matches.push({
                start: chunkFrom + wStart,
                end: chunkFrom + wEnd,
                color: useColor,
                styleType: entry.styleType,
                textColor: entry.textColor,
                backgroundColor: entry.backgroundColor
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
      if (m.isTextBg) {
        const borderStyle = this.generateBorderStyle(m.textColor, m.backgroundColor);
        style = `color: ${m.textColor} !important; background-color: ${this.hexToRgba(m.backgroundColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
      } else {
        if (effectiveStyle === "none") continue;
        const styleType = m.styleType || "text";
        if (styleType === "text") {
          style = `color: ${m.color} !important;`;
        } else if (styleType === "highlight") {
          const bgColor = m.backgroundColor || m.color;
          const borderStyle = this.generateBorderStyle(null, bgColor);
          style = `background: none !important; background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${(this.settings.highlightHorizontalPadding ?? 4) > 0 && (this.settings.highlightBorderRadius ?? 8) === 0 ? 0 : this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
        } else if (styleType === "both") {
          const textColor = m.textColor && m.textColor !== "currentColor" ? m.textColor : m.color || null;
          const bgColor = m.backgroundColor || m.color;
          const borderStyle = this.generateBorderStyle(textColor, bgColor);
          style = `${textColor ? `color: ${textColor} !important; ` : ""}background-color: ${this.hexToRgba(bgColor, this.settings.backgroundOpacity ?? 25)} !important; border-radius: ${this.settings.highlightBorderRadius ?? 8}px !important; padding-left: ${this.settings.highlightHorizontalPadding ?? 4}px !important; padding-right: ${this.settings.highlightHorizontalPadding ?? 4}px !important;${this.settings.enableBoxDecorationBreak ?? true ? " box-decoration-break: clone; -webkit-box-decoration-break: clone;" : ""}${borderStyle}`;
        } else {
          style = `color: ${m.color} !important;`;
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
    const presets = [
      { label: "All Headings (H1-H6)", pattern: "^\\s*#{1,6}\\s+.*$", flags: "m", examples: ["# Heading"] },
      { label: "Dates (YYYY-MM-DD)", pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b", flags: "", examples: ["2009-01-19"] },
      { label: "Times (AM/PM)", pattern: "\\b(?:1[0-2]|0?[1-9]):[0-5][0-9](?:am|pm)\\b", flags: "i", examples: ["9:05pm"] },
      { label: "Relative dates", pattern: "\\b(?:today|tomorrow|yesterday|next week|last week)\\b", flags: "i", examples: ["today, tomorrow"] },
      { label: "Basic URLs", pattern: "\\bhttps?://\\S+\\b", flags: "", examples: ["https://example.com"] },
      { label: "Markdown links", pattern: "\\[[^\\]]+\\]\\(https?://[^)]+\\)", flags: "", examples: ["[Link](https://example.com)"] },
      { label: "Domain names", pattern: "\\b[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}\\b", flags: "", examples: ["example.com"] },
      // { label: 'Status words', pattern: '\\b(?:TODO|DONE|WIP|INPROGRESS|BLOCKED|REVIEW|URGENT)\\b', flags: 'i', examples: ['TODO'] },
      // { label: 'Capitalized names', pattern: '\\b[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*\\b', flags: '', examples: ['John Doe'] },
      { label: "Email addresses", pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b", flags: "", examples: ["name@example.com"] },
      { label: "Username mentions", pattern: "@[a-zA-Z0-9_]+", flags: "", examples: ["@username"] },
      { label: "Currency", pattern: "\\$\\d+(?:\\.\\d{2})?|\\b[\u20AC\xA3\xA5]\\d+(?:\\.\\d{2})?\\b", flags: "", examples: ["$29.99"] },
      { label: "Measurements", pattern: "\\b\\d+(?:\\.\\d+)?(?:kg|cm|m|km|\xB0C|\xB0F|lbs)\\b", flags: "", examples: ["25kg"] },
      { label: "Phone numbers", pattern: "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b", flags: "", examples: ["123-456-7890"] },
      { label: "All texts", pattern: ".+", flags: "", examples: ["This will target all texts."] }
    ];
    const list = contentEl.createDiv();
    presets.forEach((p) => {
      const row = list.createDiv();
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "8px";
      const btn = row.createEl("button", { text: p.label });
      const sample = row.createEl("span", { text: p.examples && p.examples[0] ? `(${p.examples[0]})` : "" });
      sample.style.opacity = "0.7";
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
    loading.style.marginTop = "6px";
    try {
      const rels = await this.plugin.fetchAllReleases();
      body.empty();
      if (!Array.isArray(rels) || rels.length === 0) {
        body.createEl("div", { text: this.plugin.t("changelog_no_info", "No release information available.") });
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
      body.createEl("div", { text: this.plugin.t("changelog_failed_to_load", "Failed to load release notes.") });
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
var ColorSettingTab = class extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.debouncedSaveSettings = debounce(this.plugin.saveSettings.bind(this.plugin), 800);
    this._lastRerender = 0;
    this._cleanupHandlers = [];
    this._entryRows = /* @__PURE__ */ new Map();
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
    this._customSwatchesFolded = false;
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
      const displayPatterns = Array.isArray(entry.groupedPatterns) && entry.groupedPatterns.length > 0 ? entry.groupedPatterns.join(", ") : entry.pattern;
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
      textInput.placeholder = this.plugin.t("word_pattern_placeholder_long", "pattern, word or comma-separated words (e.g. hello, world, foo)");
      const regexChk = row.createEl("input", { type: "checkbox" });
      regexChk.checked = !!entry.isRegex;
      regexChk.title = this.plugin.t("use_regex", "Use Regex");
      regexChk.style.cursor = "pointer";
      regexChk.style.flex = "0 0 auto";
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
          this._refreshEntries();
        } catch (error) {
          debugError("SETTINGS", "Error saving word entry", error);
          new Notice(this.plugin.t("notice_error_saving_changes", "Error saving changes. Please try again."));
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
        await this.plugin.saveSettings();
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
      cp.addEventListener("input", cpHandler);
      cpBg.addEventListener("input", cpBgHandler);
      regexChk.addEventListener("change", regexChkHandler);
      flagsInput.addEventListener("change", flagsInputHandler);
      del.addEventListener("click", delHandler);
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
      this._entryRows.set(entry, { row, elements: { textInput, styleSelect, cp, cpBg, regexChk, flagsInput, del }, cleanup });
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
        textInput.addEventListener("change", textInputHandler);
        textInput.addEventListener("blur", textInputHandler);
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
      filteredRows.forEach((entry, i) => {
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
        modeSel.innerHTML = `<option value="include">${this.plugin.t("path_rule_mode_include", "include")}</option><option value="exclude">${this.plugin.t("path_rule_mode_exclude", "exclude")}</option>`;
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
              input.value = item.p;
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
        this._cleanupHandlers.push(() => input.removeEventListener("focus", focusHandler));
        const inputHandler = () => {
          updateDropdown();
        };
        input.addEventListener("input", inputHandler);
        this._cleanupHandlers.push(() => input.removeEventListener("input", inputHandler));
        const changeHandler = async () => {
          const newPath = String(input.value || "").trim().replace(/\\\\/g, "/");
          this.plugin.settings.pathRules[i].path = newPath;
          await this.plugin.saveSettings();
          this._refreshPathRules();
        };
        input.addEventListener("change", changeHandler);
        this._cleanupHandlers.push(() => input.removeEventListener("change", changeHandler));
        const modeHandler = async () => {
          this.plugin.settings.pathRules[i].mode = modeSel.value;
          await this.plugin.saveSettings();
        };
        modeSel.addEventListener("change", modeHandler);
        this._cleanupHandlers.push(() => modeSel.removeEventListener("change", modeHandler));
        const delHandler = async () => {
          const idx = this.plugin.settings.pathRules.indexOf(entry);
          if (idx !== -1) {
            this.plugin.settings.pathRules.splice(idx, 1);
            await this.plugin.saveSettings();
          }
          row.remove();
          if (!this.plugin.settings.pathRules.length) {
            this._pathRulesContainer.createEl("p", { text: this.plugin.t("no_rules_configured", "No rules configured.") });
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
        this._customSwatchesFolded = false;
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
      const customSwatchesToggleHandler = () => {
        this._customSwatchesFolded = !this._customSwatchesFolded;
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
        userCustomSwatches.forEach((sw, i) => {
          const row = customSwatchesContent.createDiv();
          row.style.display = "flex";
          row.style.alignItems = "center";
          row.style.gap = "8px";
          row.style.marginBottom = "8px";
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
          const delBtn = row.createEl("button", { text: "\u2715" });
          delBtn.addClass("mod-warning");
          delBtn.style.padding = "4px 8px";
          delBtn.style.borderRadius = "4px";
          delBtn.style.cursor = "pointer";
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
      listDiv.empty();
      const entriesToDisplay = [...this.plugin.settings.wordEntries];
      let entriesFiltered = entriesToDisplay;
      const q = String(this._entriesSearchQuery || "").trim().toLowerCase();
      if (q) {
        entriesFiltered = entriesToDisplay.filter((e) => {
          const patterns = Array.isArray(e.groupedPatterns) && e.groupedPatterns.length > 0 ? e.groupedPatterns : [String(e.pattern || "")];
          const text = [
            ...patterns.map((p) => p.toLowerCase()),
            String(e.presetLabel || "").toLowerCase(),
            String(e.flags || "").toLowerCase(),
            String(e.styleType || "").toLowerCase()
          ].join(" ");
          return text.includes(q);
        });
      }
      if (this._wordsSortMode === "a-z") {
        entriesFiltered.sort((a, b) => {
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
      } else if (this._wordsSortMode === "reverse-a-z") {
        entriesFiltered.sort((a, b) => {
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
      } else if (this._wordsSortMode === "style-order") {
        const styleOrder = { "text": 0, "highlight": 1, "both": 2 };
        entriesFiltered.sort((a, b) => {
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
      } else if (this._wordsSortMode === "color") {
        entriesFiltered.sort((a, b) => {
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
    containerEl.createEl("h3", { text: this.plugin.t("always_colored_texts_header", "Always Colored Texts") });
    containerEl.createEl("p", { text: this.plugin.t("always_colored_texts_desc", "Here's where you manage your word/patterns and their colors.") });
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
      "last-added": "Sort: Last Added",
      "a-z": "Sort: A-Z",
      "reverse-a-z": "Sort: Z-A",
      "style-order": "Sort: Style Order",
      "color": "Sort: Color"
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
    const addBtn = buttonRowDiv.createEl("button");
    addBtn.textContent = this.plugin.t("btn_add_new_word", "+ Add new colored word / pattern");
    addBtn.style.cursor = "pointer";
    addBtn.style.flex = "1";
    addBtn.addClass("mod-cta");
    const addBtnHandler = async () => {
      const uid = (() => {
        try {
          return Date.now().toString(36) + Math.random().toString(36).slice(2);
        } catch (e) {
          return Date.now();
        }
      })();
      this.plugin.settings.wordEntries.push({ pattern: "", color: "", isRegex: false, flags: "", groupedPatterns: null, styleType: "text", uid });
      await this.plugin.saveSettings();
      this.plugin.reconfigureEditorExtensions();
      this.plugin.forceRefreshAllEditors();
      this.plugin.forceRefreshAllReadingViews();
      this._refreshEntries();
    };
    addBtn.addEventListener("click", addBtnHandler);
    this._cleanupHandlers.push(() => addBtn.removeEventListener("click", addBtnHandler));
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
          const entry = { pattern: preset.pattern, isRegex: true, flags: preset.flags || "", groupedPatterns: null, presetLabel: preset.label };
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
          await this.plugin.saveSettings();
          this.plugin.compileWordEntries();
          this.plugin.compileTextBgColoringEntries();
          this.plugin.reconfigureEditorExtensions();
          this.plugin.forceRefreshAllEditors();
          this.plugin.forceRefreshAllReadingViews();
          this._initializedSettingsUI = false;
          this.display();
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
    const blSortLabels = { "last-added": "Sort: Last Added", "a-z": "Sort: A-Z", "reverse-a-z": "Sort: Z-A" };
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
    blacklistAddBtn.textContent = this.plugin.t("btn_add_blacklist", "+ Add blacklist word or pattern");
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
      const newEntry = { pattern: "", isRegex: false, flags: "", groupedPatterns: null, uid };
      if (!Array.isArray(this.plugin.settings.blacklistEntries)) this.plugin.settings.blacklistEntries = [];
      this.plugin.settings.blacklistEntries.push(newEntry);
      await this.plugin.saveSettings();
      this._refreshBlacklistWords();
    };
    blacklistAddBtn.addEventListener("click", blacklistAddHandler);
    this._cleanupHandlers.push(() => blacklistAddBtn.removeEventListener("click", blacklistAddHandler));
    const blacklistPresetsBtn = blacklistButtonRowDiv.createEl("button");
    blacklistPresetsBtn.textContent = this.plugin.t("btn_presets", "Presets");
    blacklistPresetsBtn.style.cursor = "pointer";
    blacklistPresetsBtn.style.flex = "0 0 auto";
    const blacklistPresetsHandler = () => {
      new PresetModal(this.app, this.plugin, async (preset) => {
        if (!preset) return;
        const newEntry = { pattern: preset.pattern, isRegex: true, flags: preset.flags || "", groupedPatterns: null, presetLabel: preset.label };
        if (!Array.isArray(this.plugin.settings.blacklistEntries)) this.plugin.settings.blacklistEntries = [];
        this.plugin.settings.blacklistEntries.push(newEntry);
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
          this.plugin.settingTab._initializedSettingsUI = false;
          this.plugin.settingTab.display();
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
