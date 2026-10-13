/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#17251E',
    tint: '#1E6B4E',

    // Core surfaces
    background: '#F5F4EE',
    foreground: '#17251E',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#17251E',

    // Primary action color (buttons, links, active states)
    primary: '#1E6B4E',
    primaryForeground: '#FFFFFF',
    primaryMuted: '#D1E4D5',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E8EEE8',
    secondaryForeground: '#244A37',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#ECEBE4',
    mutedForeground: '#68746D',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#F5E6C5',
    accentForeground: '#805817',
    errorBackground: '#F9E9E5',

    // Destructive actions (delete, error states)
    destructive: '#B84B3E',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#E1E3DA',
    input: '#D7DDD4',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;
