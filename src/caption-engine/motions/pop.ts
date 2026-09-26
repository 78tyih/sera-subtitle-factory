import { motionTokens } from '../motion-tokens';

/**
 * Pop — the restrained emphasis curve from the spec (§20).
 *   1.00 → 1.09 → 1.04 → 1.00   · 160–240ms · low overshoot
 * Never 1 → 1.4 → 1.
 */
export const pop = {
  name: 'pop' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.99 },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  word: (duration: number = motionTokens.normal, intensity: number = 1) => {
    const peak = 1 + (motionTokens.popScale - 1) * intensity;
    const settle = 1 + (motionTokens.popPeak - 1) * intensity;
    return {
      active: {
        scale: [1, peak, settle, 1],
        transition: {
          duration: duration / 1000,
          times: [0, 0.34, 0.62, 1],
          ease: [0.22, 0.68, 0.24, 1] as const
        }
      },
      idle: { scale: 1, transition: { duration: 0.16 } }
    };
  }
};
