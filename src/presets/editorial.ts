import { preset } from './_shared';

/**
 * 03 · Editorial — font-led, no background.
 * Keyword gets a Weight Shift instead of a colour, motion stays quiet.
 */
export const editorial = preset({
  id: 'sera-editorial',
  name: 'Editorial',
  category: 'Editorial',
  description: '衬线字体主导，无背景，关键词靠字重变化强调，浮动入场。',
  tags: ['editorial', 'none', 'weight-shift', 'float'],
  typography: { fontFamily: 'editorial', fontWeight: 500, fontSize: 62, letterSpacing: 0.01, lineHeight: 1.2, textTransform: 'none' },
  text: { text: '#F5F3EE', idle: 'rgba(245,243,238,0.5)', active: '#FFFFFF', keyword: '#FFFFFF', number: '#FFFFFF' },
  activeWord: { color: '#FFFFFF', scale: 1, animation: 'weightShift' },
  number: { color: '#FFFFFF', scale: 1.14, fontWeight: 700 },
  emphasis: {
    numbers: true,
    percentages: true,
    currency: true,
    keywords: ['资金', '流向', '纪律', '风险'],
    aiEmphasis: false,
    numberScale: 1.14,
    numberWeight: 700,
    numberColor: '#FFFFFF',
    keywordWeight: 800
  },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: {
    entrance: { type: 'float', duration: 240 },
    word: { type: 'weightShift', duration: 200, intensity: 1 },
    exit: { type: 'fade', duration: 160 }
  }
});
