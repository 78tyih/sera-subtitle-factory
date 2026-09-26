import { motionTokens } from '../motion-tokens';

/**
 * Marquee — 跑马灯.
 * The whole line keeps sliding right-to-left in a loop, like an LED ticker.
 * (entrance level; loops while the segment is on screen)
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
  })
};
