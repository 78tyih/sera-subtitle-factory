import { preset } from './_shared';

/** 08 · Clean White Card — black text on a pure white rounded card */
export const cleanWhiteCard = preset({
  id: 'sera-clean-white-card',
  name: 'Clean White Card',
  nameZh: '纯白卡片',
  descriptionEn: 'Pure white rounded card, black text, keyword highlighted in yellow.',
  category: 'Clean',
  description: '纯白大圆角卡片 + 黑字，关键词黄底高亮。',
  tags: ['white-card', 'black-text', 'yellow', 'clean'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.01, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#111111', idle: 'rgba(17,17,17,0.45)', active: '#111111', keyword: '#111111', number: '#111111' },
  activeWord: { color: '#111111', scale: 1.05, animation: 'highlight', background: 'rgba(255,212,0,0.85)' },
  number: { color: '#111111', scale: 1.18, fontWeight: 800 },
  emphasis: {
    numbers: true,
    percentages: true,
    currency: true,
    keywords: [],
    aiEmphasis: false,
    numberScale: 1.18,
    numberWeight: 800,
    numberColor: '#111111',
    keywordWeight: 800
  },
  background: { type: 'white', opacity: 1, blur: 6, radius: 22, paddingX: 26, paddingY: 14 },
  motion: {
    entrance: { type: 'float', duration: 200 },
    word: { type: 'pop', duration: 180, intensity: 0.8 },
    exit: { type: 'fade', duration: 140 }
  }
});
