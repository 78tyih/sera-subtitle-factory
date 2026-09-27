import type { Primitive } from './types';
import { markerSweep } from './markerSweep';
import { underlineReveal } from './underlineReveal';
import { boxFollow } from './boxFollow';
import { karaokeFill } from './karaokeFill';
import { snap } from './snap';
import { recoil } from './recoil';
import { widen } from './widen';
import { maskReveal } from './maskReveal';
import { blurFocus } from './blurFocus';
import { trackIn } from './trackIn';
import { hardShadow } from './hardShadow';
import { strokeReveal } from './strokeReveal';

export type { Primitive, PrimitiveCtx } from './types';

/** registry — every primitive is reachable by name so a recipe can call it. */
export const primitives: Primitive[] = [
  markerSweep,
  underlineReveal,
  boxFollow,
  karaokeFill,
  snap,
  recoil,
  widen,
  maskReveal,
  blurFocus,
  trackIn,
  hardShadow,
  strokeReveal,
];

export const primitiveNames = primitives.map((p) => p.name);

export function getPrimitive(name?: string | null): Primitive | null {
  if (!name) return null;
  return primitives.find((p) => p.name === name) ?? null;
}

/* PART E — the first batch (12 primitives) is complete. Each is:
   · an isolated module (own file)
   · registered here (registry based)
   · callable from a recipe via motion.decorator (see WordRenderer) */
