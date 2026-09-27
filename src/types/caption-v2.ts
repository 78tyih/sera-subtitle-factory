import type { CaptionRecipe, FontKey } from './caption';

/**
 * CaptionRecipeV2 — additive schema. V1 recipes keep working unchanged.
 * Adds: identity, per-role typography, treatment (stroke·shadow·marker·underline·fill)
 * and rhythm (when to cut the next segment). Motion is restructured into
 * segmentIn · activeWord · segmentTransition · decorator · exit.
 */

export type TreatmentFill = 'solid' | 'karaoke';

export interface Treatment {
  /** outline around the glyphs — the Creator Impact backbone */
  stroke?: { enabled: boolean; color: string; width: number };
  /** soft shadow for legibility over busy footage */
  shadow?: { enabled: boolean; x: number; y: number; blur: number; color: string };
  /** highlighter sweep behind the active word (scaleX 0 → 1, origin left) */
  marker?: { enabled: boolean; color: string; opacity: number; rotation: number };
  /** underline that grows under the active word */
  underline?: { enabled: boolean; color: string; width: number };
  fill?: { type: TreatmentFill };
}

export type RhythmMode = 'phrase' | 'compact' | 'word' | 'data';

export interface Rhythm {
  mode: RhythmMode;
  maxWords: number;
  maxCharacters?: number;
  /** merge adjacent tokens closer than this into one segment */
  combineWithinMs: number;
  /** a pause longer than this forces a new segment */
  pauseBreakMs: number;
  punctuationBreak: boolean;
  density: 'tight' | 'normal' | 'open';
}

/** typography override for a role (keyword / number / active word). */
export interface TypographyOverride {
  fontFamily?: FontKey;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number;
  scale?: number;
  color?: string;
}

export type MotionV2Name =
  | 'none'
  | 'fade'
  | 'softFade'
  | 'float'
  | 'slideUp'
  | 'slideDown'
  | 'scale'
  | 'snap'
  | 'recoil'
  | 'pop'
  | 'bounce'
  | 'wave'
  | 'glow'
  | 'weightShift'
  | 'blurReveal'
  | 'karaoke';

export type SegmentTransitionName = 'none' | 'crossfade' | 'slideUp' | 'softPush' | 'recoil' | 'widen' | 'maskReveal';

export type DecoratorName =
  | 'none'
  | 'markerSweep'
  | 'underlineReveal'
  | 'boxFollow'
  | 'karaokeFill'
  | 'glowPulse'
  | 'cursorBlink'
  | 'strokeReveal';

export interface MotionV2 {
  segmentIn: MotionV2Name;
  activeWord: MotionV2Name;
  segmentTransition: SegmentTransitionName;
  decorator: DecoratorName;
  exit: MotionV2Name;
  duration: number;
  intensity: number;
}

export interface RecipeIdentity {
  id: string;
  name: string;
  nameZh: string;
  /** Style Family key, e.g. 'creator-impact' */
  family: string;
  tier: 'signature' | 'variant';
  /** master id when this is a variant */
  masterId?: string;
  tags?: string[];
}

export interface CaptionRecipeV2 extends Omit<CaptionRecipe, 'motion' | 'typography' | 'layout'> {
  identity: RecipeIdentity;
  typography: CaptionRecipe['typography'];
  keywordTypography?: TypographyOverride;
  numberTypography?: TypographyOverride;
  treatment: Treatment;
  motion: MotionV2;
  rhythm: Rhythm;
  preview: {
    /** preferred preview contexts for this recipe */
    contexts: string[];
    /** demo line used in the library preview */
    demoText?: string;
  };
}

/** Default treatment — everything off. */
export const defaultTreatment: Treatment = {
  stroke: { enabled: false, color: '#000000', width: 3 },
  shadow: { enabled: false, x: 0, y: 2, blur: 8, color: 'rgba(0,0,0,0.45)' },
  marker: { enabled: false, color: '#FFD400', opacity: 0.85, rotation: -0.5 },
  underline: { enabled: false, color: '#FFD400', width: 4 },
  fill: { type: 'solid' }
};

/** Recommended rhythm presets (PART C §29). */
export const rhythmPresetTable: Record<string, Rhythm> = {
  creator: { mode: 'word', maxWords: 3, combineWithinMs: 550, pauseBreakMs: 260, punctuationBreak: true, density: 'tight' },
  podcast: { mode: 'phrase', maxWords: 7, combineWithinMs: 1200, pauseBreakMs: 420, punctuationBreak: true, density: 'open' },
  editorial: { mode: 'phrase', maxWords: 5, combineWithinMs: 1000, pauseBreakMs: 380, punctuationBreak: true, density: 'normal' },
  data: { mode: 'data', maxWords: 4, combineWithinMs: 700, pauseBreakMs: 320, punctuationBreak: true, density: 'normal' },
  business: { mode: 'phrase', maxWords: 5, combineWithinMs: 900, pauseBreakMs: 360, punctuationBreak: true, density: 'normal' }
};
