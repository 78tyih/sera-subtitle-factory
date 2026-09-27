import type { Primitive } from './types';

/** Fast impact: 1 → 1.07 → 0.99 → 1 (distinct from the softer Pop). */
export const recoil: Primitive = {
  name: 'recoil',
  kind: 'motion',
  initial: { scale: 1 },
  animate: { scale: [1, 1.07, 0.99, 1] },
  transition: { duration: 0.18, times: [0, 0.35, 0.7, 1] },
};
