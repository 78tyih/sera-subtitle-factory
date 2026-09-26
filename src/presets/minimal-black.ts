import { preset } from './_shared';

/** 02 · black text · pure white background · large radius · active blue */
export const minimalBlack = preset({
  id: 'sera-minimal-black',
  name: 'Minimal Black',
  category: 'Minimal',
  description: '纯白大圆角底 + 黑字，active 词转蓝，浅色画面首选。',
  tags: ['minimal', 'white-bg', 'blue', 'fade'],
  text: { text: '#111111', idle: 'rgba(17,17,17,0.5)', active: '#3B82F6', keyword: '#3B82F6', number: '#111111' },
  activeWord: { color: '#3B82F6', scale: 1.05, animation: 'highlight' },
  number: { color: '#111111', scale: 1.16, fontWeight: 800 },
  background: { type: 'white', opacity: 1, blur: 6, radius: 22, paddingX: 24, paddingY: 12 },
  motion: {
    entrance: { type: 'float', duration: 200 },
    word: { type: 'highlight', duration: 140, intensity: 1 },
    exit: { type: 'fade', duration: 140 }
  }
});
