const FALLBACK_WHEEL_COLORS = ['#e11d48', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

function expandHex(hex) {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  if (h.length === 6) {
    return `#${h}`;
  }
  return null;
}

function relativeLuminance(hex6) {
  const h = hex6.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Keeps admin-configured colors when readable; replaces very dark fills with the bright palette. */
export function normalizeWheelColor(color, index) {
  if (!color || typeof color !== 'string') {
    return FALLBACK_WHEEL_COLORS[index % FALLBACK_WHEEL_COLORS.length];
  }
  const trimmed = color.trim();
  const expanded = expandHex(trimmed);
  if (!expanded) {
    return FALLBACK_WHEEL_COLORS[index % FALLBACK_WHEEL_COLORS.length];
  }
  try {
    if (relativeLuminance(expanded) < 0.14) {
      return FALLBACK_WHEEL_COLORS[index % FALLBACK_WHEEL_COLORS.length];
    }
  } catch {
    return FALLBACK_WHEEL_COLORS[index % FALLBACK_WHEEL_COLORS.length];
  }
  return trimmed;
}
