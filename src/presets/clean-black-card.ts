import { preset } from './_shared';

/** 09 · Clean Black Card — white text on a pure black rounded card */
export const cleanBlackCard = preset({
  id: 'sera-clean-black-card',
  name: 'Clean Black Card',
  category: 'Clean',
  description: '纯黑大圆角卡片 + 白字，关键词蓝底高亮。',
  tags: ['black-card', 'white-text', 'blue', 'clean'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.01, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#FFFFFF', keyword: '#FFFFFF', number: '#FFD400' },
  activeWord: { color: '#FFFFFF', scale: 1.05, animation: 'highlight', background: 'rgba(59,130,246,0.9)' },
  number: { color: '#FFD400', scale: 1.18, fontWeight: 800 },
  background: { type: 'black', opacity: 1, blur: 6, radius: 22, paddingX: 26, paddingY: 14 },
  motion: {
    entrance: { type: 'float', duration: 200 },
    word: { type: 'pop', duration: 180, intensity: 0.8 },
    exit: { type: 'fade', duration: 140 }
  }
});
