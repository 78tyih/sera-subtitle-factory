import { motionTokens } from '../motion-tokens';

/**
 * Bounce — spec §21.
 *   Y: 0 → -5 → 1 → 0      scale: 1 → 1.05 → 1     · 180–260ms
 * Deliberately tiny travel. No big vertical jumps.
 */
export const bounce = {
  name: 'bounce' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, y: motionTokens.bounceDistance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -motionTokens.bounceDistance },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  word: (duration: number = motionTokens.normal, intensity: number = 1) => {
    const d = motionTokens.bounceDistance * intensity;
    return {
      active: {
        y: [0, -d, d * 0.2, 0],
        scale: [1, 1 + 0.05 * intensity, 1],
        transition: {
          duration: duration / 1000,
          times: [0, 0.4, 0.68, 1],
          ease: [0.22, 0.68, 0.24, 1] as const
        }
      },
      idle: { y: 0, scale: 1, transition: { duration: 0.16 } }
    };
  }
};
