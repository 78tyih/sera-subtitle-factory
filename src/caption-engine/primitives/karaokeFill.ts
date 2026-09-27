import type { Primitive } from './types';

/** Progressive left-to-right fill of the active word (clip reveal). */
export const karaokeFill: Primitive = {
  name: 'karaokeFill',
  kind: 'motion',
  initial: { clipPath: 'inset(0 100% 0 0)' },
  animate: { clipPath: 'inset(0 0% 0 0)' },
  transition: { duration: 0.22, ease: 'linear' },
};
