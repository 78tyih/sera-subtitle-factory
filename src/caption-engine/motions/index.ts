/**
 * Motion registry.
 * Every motion module is independent — nothing is hardcoded inside components.
 * A Recipe only stores motion NAMES; the renderer resolves them here.
 */
import { fade } from './fade';
import { float } from './float';
import { slideUp, slideDown } from './slideUp';
import { scale } from './scale';
import { pop } from './pop';
import { bounce } from './bounce';
import { glow, blurReveal } from './glow';
import { weightShift, highlight } from './weightShift';
import { typewriter } from './typewriter';
import { wave } from './wave';
import { karaoke } from './karaoke';

import type { EntranceMotionName, WordMotionName, ExitMotionName } from '@/types/caption';

export { fade, float, slideUp, slideDown, scale, pop, bounce, glow, blurReveal, weightShift, highlight };

/* ---------- entrance ---------- */

type EntranceFactory = (duration?: number) => {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit: Record<string, unknown>;
  transition: Record<string, unknown>;
};

const ENTRANCES: Partial<Record<EntranceMotionName, EntranceFactory>> = {
  fade: fade.entrance,
  /* V2 — softFade is a slower fade with a gentler ease (Clean Spoken / Editorial) */
  softFade: (duration = 240) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration / 1000, ease: [0.16, 1, 0.3, 1] }
  }),
  float: float.entrance,
  slideUp: slideUp.entrance,
  slideDown: slideDown.entrance,
  scale: scale.entrance,
  blurReveal: blurReveal.entrance,
  typewriter: typewriter.entrance as unknown as EntranceFactory
};

export function getEntrance(name: EntranceMotionName, duration: number) {
  const f = ENTRANCES[name];
  if (!f) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: duration / 1000 }
    };
  }
  return f(duration);
}

export const entranceNames: EntranceMotionName[] = ['none', 'fade', 'float', 'slideUp', 'slideDown', 'scale', 'blurReveal', 'typewriter'];

/* ---------- word ---------- */

export interface WordMotionEnv {
  duration: number;
  intensity: number;
  activeColor: string;
  baseWeight: number;
  emphasisWeight: number;
}

export function getWordMotion(name: WordMotionName, env: WordMotionEnv) {
  const { duration, intensity } = env;
  switch (name) {
    case 'pop':
      return pop.word(duration, intensity);
    case 'bounce':
      return bounce.word(duration, intensity);
    case 'float':
      return float.word(duration, intensity);
    case 'scale':
      return scale.word(duration, intensity);
    case 'glow':
      return glow.word(env.activeColor, Math.max(duration, 260), intensity);
    case 'blurReveal':
      return blurReveal.word(duration);
    case 'weightShift':
      return weightShift.word(env.baseWeight, env.emphasisWeight, duration);
    case 'wave':
      return wave.word(duration, intensity);
    case 'karaoke':
      return karaoke.word(duration, intensity);
    case 'highlight':
      return highlight.word(duration);
    default:
      return { active: {}, idle: {} };
  }
}

export const wordMotionNames: WordMotionName[] = [
  'none',
  'highlight',
  'pop',
  'bounce',
  'float',
  'scale',
  'glow',
  'weightShift',
  'blurReveal',
  'wave',
  'karaoke'
];

export const exitNames: ExitMotionName[] = ['none', 'fade', 'slideDown', 'scale', 'blurReveal'];
