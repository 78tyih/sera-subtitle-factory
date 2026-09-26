import type { MotionTokens } from '../motion-tokens';
import { motionTokens } from '../motion-tokens';

/**
 * Fade — entrance / exit / word.
 * The default, quietest motion. Opacity only.
 */
export const fade = {
  name: 'fade' as const,

  entrance: (duration: number = motionTokens.normal) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration / 1000, ease: [0.22, 0.68, 0.24, 1] as const }
  }),

  word: (duration: number = motionTokens.fast) => ({
    active: { opacity: 1, transition: { duration: duration / 1000 } },
    idle: { opacity: 1, transition: { duration: duration / 1000 } }
  })
};

export type FadeSpec = ReturnType<typeof fade.entrance>;
export const _tokens: MotionTokens = motionTokens;
