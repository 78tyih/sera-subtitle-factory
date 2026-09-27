import type { BackgroundStyle, BackgroundType } from '@/types/caption';

/**
 * Background primitives.
 * RULE: never a pill / capsule. Radius stays 16–24 on purpose.
 */

export const backgroundPresets: Array<{ type: BackgroundType; label: string }> = [
  { type: 'none', label: 'None' },
  { type: 'white', label: 'Pure White' },
  { type: 'black', label: 'Pure Black' },
  { type: 'black80', label: 'Black 80%' },
  { type: 'white92', label: 'White 92%' },
  { type: 'glass', label: 'Glass (light)' }
];

export const defaultBackground: BackgroundStyle = {
  type: 'none',
  opacity: 1,
  blur: 6,
  radius: 20,
  paddingX: 22,
  paddingY: 12
};

export interface ResolvedBackground {
  background?: string;
  backdropFilter?: string;
  borderRadius?: number;
  padding?: string;
  border?: string;
  /** true when text colour must flip for contrast */
  needsInverseText: boolean;
  /** wrapper is inline-block only when a real box exists */
  boxed: boolean;
}

function rgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return `rgba(0,0,0,${alpha})`;
  const [r, g, bl] = [m[1].slice(0, 2), m[1].slice(2, 4), m[1].slice(4, 6)].map((h) => parseInt(h, 16));
  return `rgba(${r},${g},${bl},${alpha})`;
}

/** is this colour light enough to need dark text on top? */
function isLight(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return false;
  const [r, g, b] = [m[1].slice(0, 2), m[1].slice(2, 4), m[1].slice(4, 6)].map((h) => parseInt(h, 16) / 255);
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.62;
}

export function resolveBackground(bg: BackgroundStyle): ResolvedBackground {
  const pad = `${bg.paddingY}px ${bg.paddingX}px`;
  /* a custom colour wins; otherwise fall back to the preset's own colour */
  const light = bg.color ? isLight(bg.color) : false;
  switch (bg.type) {
    case 'white':
      return { background: rgba(bg.color ?? '#FFFFFF', bg.opacity), borderRadius: bg.radius, padding: pad, needsInverseText: bg.color ? light : true, boxed: true };
    case 'black':
      return { background: rgba(bg.color ?? '#000000', bg.opacity), borderRadius: bg.radius, padding: pad, needsInverseText: bg.color ? light : false, boxed: true };
    case 'black80':
      return { background: rgba(bg.color ?? '#000000', 0.8 * bg.opacity), borderRadius: bg.radius, padding: pad, needsInverseText: bg.color ? light : false, boxed: true };
    case 'white92':
      return { background: rgba(bg.color ?? '#FFFFFF', 0.92 * bg.opacity), borderRadius: bg.radius, padding: pad, needsInverseText: bg.color ? light : true, boxed: true };
    case 'glass':
      return {
        background: rgba(bg.color ?? '#141416', 0.42),
        backdropFilter: `blur(${bg.blur}px) saturate(120%)`,
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: bg.radius,
        padding: pad,
        needsInverseText: false,
        boxed: true
      };
    default:
      return { needsInverseText: false, boxed: false };
  }
}
