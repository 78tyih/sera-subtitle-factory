import { preset } from './_shared';

/**
 * 06 · Data Focus
 *   numbers are the hero: yellow · 1.25× · weight 800 · tabular
 */
export const dataFocus = preset({
  id: 'sera-data-focus',
  name: 'Data Focus',
  nameZh: '数据放大',
  descriptionEn: 'Numbers are the hero: yellow, ×1.25, weight 800. Everything else stays white.',
  category: 'Data',
  description: '数字是主角：黄色、放大 1.25 倍、字重 800，普通文字保持白。',
  tags: ['data', 'numbers', 'yellow', 'emphasis'],
  typography: { fontFamily: 'inter', fontWeight: 600, fontSize: 62, letterSpacing: -0.01, lineHeight: 1.16, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#FFFFFF', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFFFFF', scale: 1.04, animation: 'highlight' },
  number: { color: '#FFD400', scale: 1.25, fontWeight: 800 },
  emphasis: {
    numbers: true,
    percentages: true,
    currency: true,
    keywords: [],
    aiEmphasis: false,
    numberScale: 1.25,
    numberWeight: 800,
    numberColor: '#FFD400',
    keywordWeight: 800
  },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: {
    entrance: { type: 'slideUp', duration: 200 },
    word: { type: 'pop', duration: 180, intensity: 0.9 },
    exit: { type: 'fade', duration: 140 }
  }
});
