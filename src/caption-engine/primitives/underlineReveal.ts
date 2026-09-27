import type { Primitive } from './types';

/** A line growing under the active word. */
export const underlineReveal: Primitive = {
  name: 'underlineReveal',
  kind: 'layer',
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  style: (ctx) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '-0.1em',
    height: 3,
    background: ctx.color,
    transformOrigin: 'left center',
  }),
};
