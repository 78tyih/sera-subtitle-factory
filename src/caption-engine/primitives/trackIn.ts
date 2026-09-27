import type { Primitive } from './types';

/** The word slides in from the right with a short travel. */
export const trackIn: Primitive = {
  name: 'trackIn',
  kind: 'motion',
  initial: { x: 12, opacity: 0.4 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};
