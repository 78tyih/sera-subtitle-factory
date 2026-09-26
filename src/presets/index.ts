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

/** Phase 1 ships 12 high-quality presets — quality over quantity (spec §34). */
export const presets: CaptionRecipe[] = [
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

export const presetCategories: PresetCategory[] = [
  'Minimal',
  'Editorial',
  'Finance',
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
