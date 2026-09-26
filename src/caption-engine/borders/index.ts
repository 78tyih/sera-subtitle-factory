import type { BorderStyle, BorderType } from '@/types/caption';

/**
 * Border primitives.
 * `leftBar` is the flagship border (spec §15): a 3–6px bar, never thicker.
 */

export const borderPresets: Array<{ type: BorderType; label: string }> = [
  { type: 'none', label: 'None' },
  { type: 'outline', label: 'Outline' },
  { type: 'bottomLine', label: 'Bottom Line' },
  { type: 'leftBar', label: 'Left Bar' }
];

export const defaultBorder: BorderStyle = {
  type: 'none',
  color: '#3B82F6',
  width: 4,
  radius: 16
};

export interface ResolvedBorder {
  /** styles for the caption shell (outline mode) */
  shell: React.CSSProperties;
  /** the left bar element, when type === 'leftBar' */
  bar: { width: number; color: string; radius: number } | null;
  /** bottom rule, when type === 'bottomLine' */
  bottomRule: { height: number; color: string } | null;
  /** extra inline padding needed so text clears the bar */
  padLeft: number;
}

export function resolveBorder(border: BorderStyle): ResolvedBorder {
  const w = Math.max(0, border.width);
  switch (border.type) {
    case 'outline':
      return {
        shell: { border: `${w}px solid ${border.color}`, borderRadius: border.radius },
        bar: null,
        bottomRule: null,
        padLeft: 0
      };
    case 'leftBar':
      return {
        shell: {},
        bar: { width: Math.min(Math.max(w, 3), 6), color: border.color, radius: Math.min(border.radius, 6) },
        bottomRule: null,
        padLeft: 14
      };
    case 'bottomLine':
      return {
        shell: {},
        bar: null,
        bottomRule: { height: Math.min(Math.max(w, 2), 5), color: border.color },
        padLeft: 0
      };
    default:
      return { shell: {}, bar: null, bottomRule: null, padLeft: 0 };
  }
}
