/**
 * Design tokens — UI layer (not caption layer).
 * Dark first. Black / white / gray + a little blue and yellow.
 */

export const tokens = {
  color: {
    bg: '#0A0A0A',
    panel: '#0F0F10',
    panel2: '#141416',
    line: '#1F1F22',
    line2: '#2A2A2E',
    ink: '#EDEDED',
    ink2: '#B4B4B8',
    muted: '#7A7A80',
    accent: '#3B82F6',
    highlight: '#FFD400'
  },
  radius: {
    sm: 8,
    md: 12,
    card: 14,
    lg: 20
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  duration: {
    fast: 140,
    normal: 200,
    slow: 280
  },
  ease: {
    out: 'cubic-bezier(0.22, 0.68, 0.24, 1)'
  }
} as const;

export type Tokens = typeof tokens;
