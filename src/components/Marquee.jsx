import React from 'react';

/* ── Infinite horizontal marquee ticker ────────────────────────
   items: string[]   — items to display
   speed: number     — seconds for one full loop (default 30)
   direction: 'left' | 'right'
──────────────────────────────────────────────────────────────── */
export default function Marquee({ items, speed = 30, direction = 'left', className = '' }) {
  const doubled = [...items, ...items];
  const dir = direction === 'right' ? 'reverse' : 'normal';

  return (
    <div
      className={`marquee-outer overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="marquee-track whitespace-nowrap inline-flex gap-0"
        style={{
          animation: `marqueeScroll ${speed}s linear infinite ${dir}`,
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item inline-flex items-center gap-4 px-6">
            <span className="label text-[11px]">{item}</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-30 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}
