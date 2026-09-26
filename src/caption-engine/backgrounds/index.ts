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

export function resolveBackground(bg: BackgroundStyle): ResolvedBackground {
  const pad = `${bg.paddingY}px ${bg.paddingX}px`;
  switch (bg.type) {
    case 'white':
      return { background: `rgba(255,255,255,${bg.opacity})`, borderRadius: bg.radius, padding: pad, needsInverseText: true, boxed: true };
    case 'black':
      return { background: `rgba(0,0,0,${bg.opacity})`, borderRadius: bg.radius, padding: pad, needsInverseText: false, boxed: true };
    case 'black80':
      return { background: `rgba(0,0,0,${0.8 * bg.opacity})`, borderRadius: bg.radius, padding: pad, needsInverseText: false, boxed: true };
    case 'white92':
      return { background: `rgba(255,255,255,${0.92 * bg.opacity})`, borderRadius: bg.radius, padding: pad, needsInverseText: true, boxed: true };
    case 'glass':
      return {
        background: 'rgba(20,20,22,0.42)',
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
