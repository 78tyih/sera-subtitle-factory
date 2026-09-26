import { motionTokens } from '../motion-tokens';

/**
 * Wave — 波浪.
 * The active word bobs up and down once, like a wave passing through.
 * Travel is tiny (≤6px), by design.
 */
export const wave = {
  name: 'wave' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, y: motionTokens.floatDistance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -motionTokens.floatDistance / 2 },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  word: (duration: number = motionTokens.normal, intensity: number = 1) => {
    const d = 6 * intensity;
    return {
      active: {
        y: [0, -d, 0, d, 0],
        transition: {
          duration: duration / 1000,
          times: [0, 0.25, 0.5, 0.75, 1],
          ease: ['easeInOut', 'easeInOut', 'easeInOut', 'easeInOut'] as const
        }
      },
      idle: { y: 0, transition: { duration: 0.16 } }
    };
  }
};
