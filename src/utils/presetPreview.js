// Shared preset-preview renderer.
//
// Draws `text` styled by `styleObj` into `container` as a single span. Both
// the Text Style Presets grid and the "Save as preset" naming modal use this
// so their previews agree: the preview follows the style's own colors when set,
// otherwise falls back to the theme accent, and delegates the border to the
// plugin's generateBorderStyle (colortype-aware) instead of re-deriving it.
//
// `plugin` supplies the render helpers (getHighlightParams, isValidHexColor,
// hexToRgba, generateBorderStyle) and `settings.cornerShape`. `styleObj` is a
// preset, an entry, or any object carrying styleType + shape + colour fields.
// No Obsidian imports — unit testable.

export function applyPresetPreviewStyle(plugin, container, styleObj, text) {
  if (!container) return;
  container.empty();
  const span = container.createSpan({ cls: "act-tsp-span" });
  span.textContent = text;

  const style = (styleObj && styleObj.styleType) || "highlight";
  const p = plugin.getHighlightParams(styleObj);
  const opacity = p.opacity ?? 25;
  const radius = p.radius ?? 8;
  const hpad = p.hPad ?? 4;
  const vpad = p.vPad ?? 0;
  const accent = "var(--color-accent)";

  const bgHex =
    styleObj &&
    styleObj.backgroundColor &&
    plugin.isValidHexColor(styleObj.backgroundColor)
      ? styleObj.backgroundColor
      : null;
  const textHex =
    styleObj &&
    styleObj.textColor &&
    styleObj.textColor !== "currentColor" &&
    plugin.isValidHexColor(styleObj.textColor)
      ? styleObj.textColor
      : null;

  let bg = "";
  if (style !== "text") {
    if (bgHex) {
      bg = `background: ${plugin.hexToRgba(bgHex, opacity)};`;
    } else {
      bg = `background: color-mix(in srgb, ${accent} ${opacity}%, transparent);`;
    }
  }

  let border = "";
  if (style !== "text" && typeof plugin.generateBorderStyle === "function") {
    // Border colour follows the colortype via the plugin's own generator —
    // the same call the editor preview and the runtime use (text colour for
    // both/text colortypes, background for highlight, accent when unset).
    border =
      plugin.generateBorderStyle(
        textHex || accent,
        bgHex || accent,
        styleObj,
      ) || "";
  }

  const textColorVal = textHex || "var(--text-normal)";
  const cornerShape =
    (styleObj && styleObj.cornerShape) ||
    (plugin.settings && plugin.settings.cornerShape) ||
    "round";
  const cornerCss =
    cornerShape && cornerShape !== "round" ? `corner-shape:${cornerShape};` : "";
  const base =
    style === "text"
      ? `color:${textColorVal};background:transparent;`
      : style === "highlight"
        ? `${bg}border-radius:${radius}px;${cornerCss}padding:${vpad}px ${hpad}px;color:var(--text-normal);${border}`
        : `color:${textColorVal};${bg}border-radius:${radius}px;${cornerCss}padding:${vpad}px ${hpad}px;${border}`;

  span.setAttribute(
    "style",
    base + "box-decoration-break:clone;-webkit-box-decoration-break:clone;",
  );
}
