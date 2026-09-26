import { motionTokens } from '../motion-tokens';

/**
 * Scale — entrance + word.
 * Scale is applied via transform only, so neighbours never reflow.
 */
export const scale = {
  name: 'scale' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  /** soft, sustained emphasis while the word is being spoken */
  word: (duration: number = motionTokens.normal, intensity: number = 1) => ({
    active: {
      scale: 1 + 0.06 * intensity,
      transition: { type: 'spring' as const, ...motionTokens.spring.soft, duration: duration / 1000 }
    },
    idle: { scale: 1, transition: { duration: motionTokens.fast / 1000 } }
  })
};
