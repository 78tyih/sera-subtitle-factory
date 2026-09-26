import { preset } from './_shared';

/** 11 · Word Pop — white with a restrained yellow pop on the active word */
export const wordPop = preset({
  id: 'sera-word-pop',
  name: 'Word Pop',
  category: 'Kinetic',
  description: '白字 + 黄色 active，克制的 pop（1.00→1.09→1.04→1.00）。',
  tags: ['pop', 'yellow', 'kinetic', 'none'],
  typography: { fontFamily: 'inter', fontWeight: 800, fontSize: 66, letterSpacing: -0.01, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.54)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.09, animation: 'pop' },
  number: { color: '#FFD400', scale: 1.2, fontWeight: 800 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: {
    entrance: { type: 'scale', duration: 200 },
    word: { type: 'pop', duration: 200, intensity: 1 },
    exit: { type: 'scale', duration: 140 }
  }
});
