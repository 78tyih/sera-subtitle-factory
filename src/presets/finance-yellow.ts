import { preset } from './_shared';

/**
 * 04 · Finance Yellow  (flagship demo)
 *   white · yellow active · numbers ×1.20 · restrained pop
 */
export const financeYellow = preset({
  id: 'sera-finance-yellow',
  name: 'Finance Yellow',
  nameZh: '财经黄标',
  descriptionEn: 'White text with a yellow active word; numbers scale ×1.20 with a restrained pop. The workhorse finance style.',
  category: 'Broadcast',
  description: '白字 + 黄色 active，数字放大 1.20 并弹跳。金融播报主力样式。',
  tags: ['finance', 'yellow', 'numbers', 'pop'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 68, letterSpacing: -0.02, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.56)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.09, animation: 'pop' },
  number: { color: '#FFD400', scale: 1.2, fontWeight: 800 },
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
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: {
    entrance: { type: 'float', duration: 200 },
    word: { type: 'pop', duration: 200, intensity: 1 },
    exit: { type: 'fade', duration: 140 }
  }
});
