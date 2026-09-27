import type { Primitive } from './types';

/** Unspoken words sit dim + 1–2px blur; the active word snaps into focus. */
export const blurFocus: Primitive = {
  name: 'blurFocus',
  kind: 'motion',
  initial: { opacity: 0.4, filter: 'blur(2px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
};
