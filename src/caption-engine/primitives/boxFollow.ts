import type { Primitive } from './types';

/** Rectangular block on the active word — radius 4–10px, never a pill. */
export const boxFollow: Primitive = {
  name: 'boxFollow',
  kind: 'layer',
  initial: { scaleX: 0.4, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  transition: { duration: 0.14, ease: [0.16, 1, 0.3, 1] },
  style: (ctx) => ({
    position: 'absolute',
    left: '-0.1em',
    right: '-0.1em',
    top: '-0.04em',
    bottom: '-0.02em',
    borderRadius: 6,
    background: ctx.color,
    transformOrigin: 'left center',
    zIndex: -1,
  }),
};
