import { motionTokens } from '../motion-tokens';

/**
 * Float — entrance + word emphasis.
 * Travel is capped at motionTokens.floatDistance (8px). Never 30px.
 */
export const float = {
  name: 'float' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, y: motionTokens.floatDistance, filter: `blur(${motionTokens.blurIn}px)` },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -motionTokens.floatDistance / 2, filter: 'blur(2px)' },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  word: (duration: number = motionTokens.normal, intensity: number = 1) => ({
    active: {
      y: [0, -motionTokens.floatDistance * intensity, 0],
      opacity: 1,
      transition: { duration: duration / 1000, times: [0, 0.42, 1], ease: [0.22, 0.68, 0.24, 1] as const }
    },
    idle: { y: 0, opacity: 1, transition: { duration: 0.16 } }
  })
};
