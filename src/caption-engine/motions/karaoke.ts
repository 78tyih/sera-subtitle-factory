import { motionTokens } from '../motion-tokens';

/**
 * Karaoke — 卡拉 OK 歌词动效.
 * The classic singing-lyric behaviour:
 *   · words already spoken stay in the emphasis colour (progressive fill)
 *   · the current word is slightly larger
 *   · words not reached yet stay dimmed
 * The colour state is applied by WordRenderer; this only handles the motion.
 */
export const karaoke = {
  name: 'karaoke' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0, y: motionTokens.floatDistance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -motionTokens.floatDistance / 2 },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  word: (duration: number = motionTokens.fast, intensity = 1) => ({
    active: {
      scale: 1 + 0.06 * intensity,
      transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
    },
    idle: { scale: 1, transition: { duration: duration / 1000 } }
  })
};
