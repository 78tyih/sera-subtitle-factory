import { motionTokens } from '../motion-tokens';

/**
 * Glow — keywords / numbers only, never the whole line.
 * Colours: blue · yellow · white. Never over-exposed.
 */
export const glow = {
  name: 'glow' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration / 1000 }
  }),

  /** `color` should be the glow colour (blue / yellow / white). */
  word: (color: string = '#3B82F6', duration: number = motionTokens.slow, intensity: number = 1) => ({
    active: {
      textShadow: [
        `0 0 0px ${color}00`,
        `0 0 ${10 * intensity}px ${color}cc`,
        `0 0 ${6 * intensity}px ${color}80`
      ],
      transition: { duration: duration / 1000, times: [0, 0.4, 1] }
    },
    idle: {
      textShadow: `0 0 0px ${color}00`,
      transition: { duration: motionTokens.fast / 1000 }
    }
  })
};

/** Blur reveal — soft focus pull, used sparingly. */
export const blurReveal = {
  name: 'blurReveal' as const,
  entrance: (duration: number = motionTokens.slow) => ({
    initial: { opacity: 0, filter: `blur(${motionTokens.blurIn}px)` },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: `blur(${motionTokens.blurIn / 2}px)` },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),
  word: (duration: number = motionTokens.normal) => ({
    active: {
      filter: [`blur(${motionTokens.blurIn}px)`, 'blur(0px)'],
      opacity: [0.4, 1],
      transition: { duration: duration / 1000 }
    },
    idle: { filter: 'blur(0px)', opacity: 1, transition: { duration: 0.16 } }
  })
};
