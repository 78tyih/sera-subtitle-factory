import { motionTokens } from '../motion-tokens';

/**
 * Slide Up — entrance.
 * Product default for captions that "arrive" with the voice.
 */
export const slideUp = {
  name: 'slideUp' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, y: motionTokens.slideDistance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -motionTokens.slideDistance / 2 },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  word: (duration: number = motionTokens.fast) => ({
    active: { y: [0, -2, 0], transition: { duration: duration / 1000 } },
    idle: { y: 0, transition: { duration: 0.14 } }
  })
};

/** Slide Down — reserved for top-positioned captions. */
export const slideDown = {
  name: 'slideDown' as const,
  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, y: -motionTokens.slideDistance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: motionTokens.slideDistance / 3 },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  })
};
