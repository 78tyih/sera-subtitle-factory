import { motionTokens } from '../motion-tokens';

/**
 * Marquee — 跑马灯.
 * Lives in the WORD-motion set: every word animates with the identical
 * slide loop, so the whole line travels right-to-left like an LED ticker.
 * (kept looping, entrance is untouched)
 */
export const marquee = {
  name: 'marquee' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { x: '55%', opacity: 0 },
    animate: { x: '-55%', opacity: 1 },
    exit: { x: '-55%', opacity: 0 },
    transition: {
      duration: (duration / 1000) * 2.4,
      repeat: Infinity,
      ease: 'linear' as const
    }
  }),

  word: (duration: number = motionTokens.normal) => {
    const t = {
      duration: (duration / 1000) * 2.4,
      repeat: Infinity,
      ease: 'linear' as const
    };
    return {
      active: { x: ['55%', '-55%'], transition: t },
      idle: { x: ['55%', '-55%'], transition: t }
    };
  }
};
