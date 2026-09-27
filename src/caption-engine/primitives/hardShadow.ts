import type { Primitive } from './types';

/** Comic punch: a hard drop shadow that pops in with the word. */
export const hardShadow: Primitive = {
  name: 'hardShadow',
  kind: 'motion',
  initial: { textShadow: '0px 0px 0 rgba(0,0,0,0)' },
  animate: { textShadow: '3px 3px 0 rgba(0,0,0,0.85)' },
  transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
};
