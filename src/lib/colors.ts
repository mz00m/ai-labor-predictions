/**
 * Shared color tokens for use in JavaScript/TypeScript contexts
 * (charts, SVG, inline styles, dynamic backgrounds).
 *
 * For Tailwind classes, use the CSS variables defined in globals.css
 * via the color tokens in tailwind.config.ts (e.g., text-accent, bg-signal-positive).
 *
 * These values MUST stay in sync with the :root CSS variables in globals.css.
 */

// Brand
export const ACCENT = "#5C61F6";
export const ACCENT_TEXT = "#4F52D4";
export const ACCENT_LIGHT = "#eef0ff";
export const HIGHLIGHT = "#F66B5C";
export const HEADING = "#2E3650";

// Neutrals
export const FOREGROUND = "#1a1a1a";
export const MUTED = "#6b7280";
export const MUTED_LIGHT = "#9ca3af";
export const MUTED_LIGHTER = "#d1d5db";

// Semantic signals
export const SIGNAL_POSITIVE = "#22c55e";
export const SIGNAL_POSITIVE_STRONG = "#16a34a";
export const SIGNAL_POSITIVE_MUTED = "#10B981";
export const SIGNAL_NEGATIVE = "#ef4444";
export const SIGNAL_NEGATIVE_STRONG = "#dc2626";
export const SIGNAL_WARNING = "#f59e0b";
export const SIGNAL_WARNING_MUTED = "#d97706";

// Chart-specific
export const CHART_PRIMARY = ACCENT;
export const CHART_SECONDARY = "#6366F1";
export const CHART_BLUE = "#3b82f6";
export const CHART_PURPLE = "#7c3aed";
