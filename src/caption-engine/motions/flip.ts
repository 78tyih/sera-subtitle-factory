import { motionTokens } from '../motion-tokens';

/**
 * Flip — 翻转.
 * The active word flips once around the X axis (top-over), subtle 3D.
 */
export const flip = {
  name: 'flip' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, y: motionTokens.slideDistance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -motionTokens.slideDistance / 2 },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  word: (duration: number = motionTokens.normal) => ({
    active: {
      rotateX: [0, -90, 0],
      transformPerspective: 420,
      transition: {
        duration: duration / 1000,
        times: [0, 0.5, 1],
        ease: ['easeIn', 'easeOut'] as const
      }
    },
    idle: { rotateX: 0, transition: { duration: 0.16 } }
  })
};
