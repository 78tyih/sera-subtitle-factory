import type { CaptionRecipe, PresetCategory } from '@/types/caption';

import { minimalWhite } from './minimal-white';
import { minimalBlack } from './minimal-black';
import { editorial } from './editorial';
import { financeYellow } from './finance-yellow';
import { financeBlue } from './finance-blue';
import { dataFocus } from './data-focus';
import { leftBar } from './left-bar';
import { cleanWhiteCard } from './clean-white-card';
import { cleanBlackCard } from './clean-black-card';
import { neonBlue } from './neon-blue';
import { wordPop } from './word-pop';
import { wordFloat } from './word-float';
import { extendedPresets } from './extended';
import { masterPresets } from '@/styles/masters';
import { generatedPresets } from './generated';

/** Core pack (12 hand-tuned styles, spec §34) + extended pack (28 more). */
export const corePresets: CaptionRecipe[] = [
  minimalWhite,
  minimalBlack,
  editorial,
  financeYellow,
  financeBlue,
  dataFocus,
  leftBar,
  cleanWhiteCard,
  cleanBlackCard,
  neonBlue,
  wordPop,
  wordFloat
];

/* V2.3 masters come first — the Library's Featured row is built from the head of this list. */
export const presets: CaptionRecipe[] = [...masterPresets, ...corePresets, ...extendedPresets, ...generatedPresets];

export const presetCategories: PresetCategory[] = [
  'Minimal',
  'Editorial',
  'Broadcast',
  'Data',
  'Tech',
  'Neon',
  'Podcast',
  'Clean',
  'Bold',
  'Kinetic'
];

export const backgroundFilters = [
  { id: 'all', label: 'All backgrounds' },
  { id: 'none', label: 'No background' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' }
] as const;

export const motionFilters = [
  { id: 'all', label: 'All motion' },
  { id: 'highlight', label: 'Highlight' },
  { id: 'pop', label: 'Pop' },
  { id: 'float', label: 'Float' },
  { id: 'slideUp', label: 'Slide' },
  { id: 'scale', label: 'Scale' },
  { id: 'glow', label: 'Glow' }
] as const;

export function getPreset(id: string): CaptionRecipe | undefined {
  return presets.find((p) => p.id === id);
}

/** The four flagship demos the whole visual system is judged by (spec §108). */
export const FLAGSHIP_IDS = ['sera-finance-yellow', 'sera-finance-blue', 'sera-editorial', 'sera-left-bar'];
export const flagshipPresets = presets.filter((p) => FLAGSHIP_IDS.includes(p.id));

export { minimalWhite, minimalBlack, editorial, financeYellow, financeBlue, dataFocus, leftBar, cleanWhiteCard, cleanBlackCard, neonBlue, wordPop, wordFloat };

/* ------------------------------------------------------------------ V2 tiers */

/** Signature = hand-designed styles (6 V2.3 masters + core 12 + curated 28). */
export const signaturePresets: CaptionRecipe[] = [...masterPresets, ...corePresets, ...extendedPresets];

/** Variants Lab = systematic parameter combinations (generated). */
export const variantPresets: CaptionRecipe[] = generatedPresets;

export function tierOf(id: string): 'signature' | 'variant' {
  return generatedPresets.some((p) => p.id === id) ? 'variant' : 'signature';
}

/** The six V2.3 master styles — always shown first in Featured. */
export const masterIds = masterPresets.map((p) => p.id);

export function isMaster(id: string): boolean {
  return masterIds.includes(id);
}
