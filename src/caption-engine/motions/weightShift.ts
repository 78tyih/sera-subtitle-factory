import { motionTokens } from '../motion-tokens';

/**
 * Weight Shift — editorial emphasis.
 * The word gets heavier while spoken, no scale, no movement.
 * Requires a variable font for a smooth ramp (Inter / Geist / Roboto);
 * falls back to a 100-step jump on static fonts.
 */
export const weightShift = {
  name: 'weightShift' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration / 1000 }
  }),

  word: (fromWeight: number = 500, toWeight: number = 800, duration: number = motionTokens.normal) => ({
    active: {
      fontWeight: toWeight,
      transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
    },
    idle: {
      fontWeight: fromWeight,
      transition: { duration: motionTokens.fast / 1000 }
    }
  })
};

/** Highlight — pure colour change, no movement (Text Highlight, spec §24). */
export const highlight = {
  name: 'highlight' as const,
  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration / 1000 }
  }),
  word: (duration: number = motionTokens.fast) => ({
    active: { opacity: 1, transition: { duration: duration / 1000 } },
    idle: { opacity: 1, transition: { duration: duration / 1000 } }
  })
};
