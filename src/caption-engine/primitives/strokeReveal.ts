import type { Primitive } from './types';

/** Outline drawn around the active word and then released. */
export const strokeReveal: Primitive = {
  name: 'strokeReveal',
  kind: 'motion',
  initial: { WebkitTextStroke: '0px rgba(255,255,255,0)' },
  animate: { WebkitTextStroke: '2px rgba(255,255,255,0.9)' },
  transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
};
