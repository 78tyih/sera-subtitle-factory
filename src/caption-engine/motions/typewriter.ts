import { motionTokens } from '../motion-tokens';

/**
 * Typewriter — 打字机.
 * The line is revealed left-to-right with a hard edge, as if being typed.
 * (entrance level)
 */
export const typewriter = {
  name: 'typewriter' as const,

  entrance: (duration: number = motionTokens.slow) => ({
    initial: { clipPath: 'inset(0 100% 0 0)' },
    animate: { clipPath: 'inset(0 0% 0 0)' },
    exit: { clipPath: 'inset(0 0% 0 0)', opacity: 0 },
    transition: { duration: duration / 1000, ease: 'linear' as const }
  })
};
