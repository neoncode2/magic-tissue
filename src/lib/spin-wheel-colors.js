/** Preset swatches for admin wheel color picker (distinct, wheel-friendly). */
export const SPIN_WHEEL_PALETTE_PRESETS = [
  '#e11d48',
  '#f43f5e',
  '#f97316',
  '#fb923c',
  '#eab308',
  '#facc15',
  '#22c55e',
  '#14b8a6',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#78716c',
];

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

function lightenTowardWhite(hex6, amount) {
  const h = hex6.replace('#', '');
  const mix = (channel) => {
    const v = parseInt(channel, 16);
    return Math.round(v + (255 - v) * amount);
  };
  const r = mix(h.slice(0, 2));
  const g = mix(h.slice(2, 4));
  const b = mix(h.slice(4, 6));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

function ensureReadableOnWheel(hex6, minLuminance = 0.2) {
  let current = hex6;
  for (let step = 0; step < 14; step += 1) {
    if (relativeLuminance(current) >= minLuminance) {
      return current;
    }
    current = lightenTowardWhite(current, 0.18);
  }
  return lightenTowardWhite(hex6, 0.72);
}

/**
 * Valid hex for <input type="color" /> (always #rrggbb).
 */
export function coerceHexForColorInput(color) {
  const expanded = expandHex(String(color || '').trim());
  if (expanded) {
    return expanded.toLowerCase();
  }
  return '#e11d48';
}

/**
 * Segment fill for the wheel: keeps admin hue when possible; lightens very dark
 * colors instead of swapping to a shared palette (which merged adjacent slices).
 */
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
    return ensureReadableOnWheel(expanded);
  } catch {
    return FALLBACK_WHEEL_COLORS[index % FALLBACK_WHEEL_COLORS.length];
  }
}
