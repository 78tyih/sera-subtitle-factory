import type { Primitive } from './types';

/** Slight horizontal widening on the active word, then settle. */
export const widen: Primitive = {
  name: 'widen',
  kind: 'motion',
  initial: { scaleX: 0.94 },
  animate: { scaleX: 1 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};
