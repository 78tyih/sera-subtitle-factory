import type { Primitive } from './types';

/** Reveals the word from left to right with a hard mask. */
export const maskReveal: Primitive = {
  name: 'maskReveal',
  kind: 'motion',
  initial: { clipPath: 'inset(0 100% 0 0)' },
  animate: { clipPath: 'inset(0 0% 0 0)' },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};
