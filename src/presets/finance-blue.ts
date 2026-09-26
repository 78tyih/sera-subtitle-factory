import { preset } from './_shared';

/**
 * 05 · Finance Blue  (flagship demo)
 *   white · blue active · numbers ×1.20 · soft scale
 */
export const financeBlue = preset({
  id: 'sera-finance-blue',
  name: 'Finance Blue',
  category: 'Finance',
  description: '白字 + 蓝色 active，数字放大 1.20，柔和缩放而非弹跳。',
  tags: ['finance', 'blue', 'numbers', 'scale'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 68, letterSpacing: -0.02, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.56)', active: '#3B82F6', keyword: '#3B82F6', number: '#3B82F6' },
  activeWord: { color: '#3B82F6', scale: 1.08, animation: 'scale' },
  number: { color: '#3B82F6', scale: 1.2, fontWeight: 800 },
  emphasis: {
    numbers: true,
    percentages: true,
    currency: true,
    keywords: [],
    aiEmphasis: false,
    numberScale: 1.2,
    numberWeight: 800,
    numberColor: '#3B82F6',
    keywordWeight: 800
  },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: {
    entrance: { type: 'float', duration: 200 },
    word: { type: 'scale', duration: 220, intensity: 1 },
    exit: { type: 'fade', duration: 140 }
  }
});
