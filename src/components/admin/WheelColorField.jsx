'use client';

import { SPIN_WHEEL_PALETTE_PRESETS, coerceHexForColorInput } from '@/lib/spin-wheel-colors';

export default function WheelColorField({ value, onChange, label = 'Segment color' }) {
  const safe = coerceHexForColorInput(value);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SPIN_WHEEL_PALETTE_PRESETS.map((hex) => {
          const selected = safe.toLowerCase() === hex.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              title={hex}
              onClick={() => onChange(hex)}
              className={`h-8 w-8 shrink-0 rounded-full border-2 shadow-inner transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-400/60 ${
                selected ? 'border-white ring-2 ring-white/40' : 'border-black/40'
              }`}
              style={{ backgroundColor: hex }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="color"
          value={safe}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-14 cursor-pointer overflow-hidden rounded-xl border border-white/15 bg-black p-0 shadow [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0"
          aria-label="Custom wheel color"
        />
        <input
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white"
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#hex"
          spellCheck={false}
        />
        <div
          className="h-10 w-10 shrink-0 rounded-xl border-2 border-white/20 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]"
          style={{ backgroundColor: safe }}
          title="Preview"
        />
      </div>
    </div>
  );
}
