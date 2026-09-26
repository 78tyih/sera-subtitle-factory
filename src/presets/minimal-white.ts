import { preset } from './_shared';

/** 01 · white text · no background · active yellow · fade */
export const minimalWhite = preset({
  id: 'sera-minimal-white',
  name: 'Minimal White',
  category: 'Minimal',
  description: '白字无背景，active 词转黄，最克制的基础字幕。',
  tags: ['minimal', 'none', 'yellow', 'fade'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 64, letterSpacing: -0.01, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.55)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.06, animation: 'highlight' },
  number: { color: '#FFD400', scale: 1.18, fontWeight: 800 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: {
    entrance: { type: 'fade', duration: 180 },
    word: { type: 'highlight', duration: 140, intensity: 1 },
    exit: { type: 'fade', duration: 140 }
  }
});
