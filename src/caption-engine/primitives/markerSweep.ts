import type { Primitive } from './types';

/** Highlighter sweeping behind the active word (scaleX 0 → 1, origin left). */
export const markerSweep: Primitive = {
  name: 'markerSweep',
  kind: 'layer',
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
  style: (ctx) => ({
    position: 'absolute',
    left: '-0.12em',
    right: '-0.12em',
    top: '0.08em',
    bottom: '0.06em',
    borderRadius: 2,
    background: ctx.color,
    opacity: 0.85,
    transformOrigin: 'left center',
    zIndex: -1,
  }),
};
