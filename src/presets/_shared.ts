import type { CaptionRecipe, DeepPartial } from '@/types/caption';
import { defaultBackground } from '@/caption-engine/backgrounds';
import { defaultBorder } from '@/caption-engine/borders';
import { motionTokens } from '@/caption-engine/motion-tokens';

/**
 * Shared recipe skeleton. Every preset only overrides what makes it different —
 * this keeps the 12 presets readable and guarantees RULE #1 (maxLines: 1).
 */
export const baseRecipe: CaptionRecipe = {
  id: 'base',
  name: 'Base',
  category: 'Minimal',
  description: '',
  tags: [],

  layout: {
    maxLines: 1,
    position: 'bottom',
    yOffset: 0.13,
    align: 'center',
    maxWidth: 0.86,
    aspect: '16:9',
    safeArea: false
  },

  typography: {
    fontFamily: 'inter',
    fontWeight: 700,
    fontSize: 64,
    letterSpacing: -0.01,
    lineHeight: 1.14,
    textTransform: 'none'
  },

  text: {
    text: '#FFFFFF',
    idle: 'rgba(255,255,255,0.58)',
    active: '#FFFFFF',
    keyword: '#FFD400',
    number: '#FFD400'
  },

  activeWord: {
    scale: motionTokens.popScale,
    animation: 'highlight'
  },

  number: {
    color: '#FFD400',
    scale: 1.2,
    fontWeight: 800
  },

  emphasis: {
    numbers: true,
    percentages: true,
    currency: true,
    keywords: [],
    aiEmphasis: false,
    numberScale: 1.2,
    numberWeight: 800,
    numberColor: '#FFD400',
    keywordWeight: 800
  },

  background: { ...defaultBackground },
  border: { ...defaultBorder },

  motion: {
    entrance: { type: 'float', duration: motionTokens.normal },
    word: { type: 'pop', duration: motionTokens.normal, intensity: 1 },
    exit: { type: 'fade', duration: motionTokens.fast }
  }
};

/** helper: build a preset from overrides */
export function preset(
  overrides: DeepPartial<CaptionRecipe> & Pick<CaptionRecipe, 'id' | 'name' | 'category'>
): CaptionRecipe {
  return {
    ...baseRecipe,
    ...overrides,
    layout: { ...baseRecipe.layout, maxLines: 1, ...(overrides.layout ?? {}) },
    typography: { ...baseRecipe.typography, ...(overrides.typography ?? {}) },
    text: { ...baseRecipe.text, ...(overrides.text ?? {}) },
    activeWord: { ...baseRecipe.activeWord, ...(overrides.activeWord ?? {}) },
    number: { ...baseRecipe.number, ...(overrides.number ?? {}) },
    emphasis: { ...baseRecipe.emphasis, ...(overrides.emphasis ?? {}) },
    background: { ...baseRecipe.background, ...(overrides.background ?? {}) },
    border: { ...baseRecipe.border, ...(overrides.border ?? {}) },
    motion: {
      entrance: { ...baseRecipe.motion.entrance, ...(overrides.motion?.entrance ?? {}) },
      word: { ...baseRecipe.motion.word, ...(overrides.motion?.word ?? {}) },
      exit: { ...baseRecipe.motion.exit, ...(overrides.motion?.exit ?? {}) }
    },
    tags: (overrides.tags as string[]) ?? baseRecipe.tags
  };
}
