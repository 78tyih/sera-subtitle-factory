import type { Primitive } from './types';

/** Sports / Creator snap: Y 3px → 0, scale .96 → 1, almost no overshoot. */
export const snap: Primitive = {
  name: 'snap',
  kind: 'motion',
  initial: { y: 3, scale: 0.96 },
  animate: { y: 0, scale: 1 },
  transition: { duration: 0.12, ease: [0.16, 1, 0.3, 1] },
};
