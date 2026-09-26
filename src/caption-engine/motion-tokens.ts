/**
 * Motion tokens — every duration / distance / scale lives here.
 * Components must NOT hardcode animation numbers.
 *
 * Motion philosophy (see product spec §20–23):
 *  - pop is RESTRAINED: 1.00 → 1.09 → 1.04 → 1.00, low overshoot
 *  - bounce never travels more than ~5px
 *  - float never travels more than 8px, blur 4 → 0
 */

export const motionTokens = {
  fast: 140,
  normal: 200,
  slow: 280,

  /* word emphasis */
  popScale: 1.09,
  popPeak: 1.04,
  emphasisScale: 1.2,

  /* distances (px, at 1080-wide reference) */
  floatDistance: 8,
  bounceDistance: 5,
  slideDistance: 26,
  blurIn: 4,

  /* springs — low bounce by design */
  spring: {
    /** pop / keyword emphasis */
    soft: { stiffness: 320, damping: 26, mass: 0.9 },
    /** entrance */
    settle: { stiffness: 220, damping: 30, mass: 1 },
    /** float — almost no spring, pure ease */
    quiet: { stiffness: 160, damping: 34, mass: 1 }
  },

  /** timeline defaults */
  cycleSeconds: 5,
  playbackFps: 60
} as const;

export type MotionTokens = typeof motionTokens;
