import { preset } from './_shared';

/** 12 · Word Float — white with a blue floating active word (8px max travel) */
export const wordFloat = preset({
  id: 'sera-word-float',
  name: 'Word Float',
  nameZh: '浮动强调',
  descriptionEn: 'White text with a blue floating active word (8px max travel) — quiet but alive.',
  category: 'Kinetic',
  description: '白字 + 蓝色 active 上浮（最多 8px），安静但有呼吸感。',
  tags: ['float', 'blue', 'kinetic', 'none'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 64, letterSpacing: -0.01, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.54)', active: '#3B82F6', keyword: '#3B82F6', number: '#3B82F6' },
  activeWord: { color: '#3B82F6', scale: 1.06, animation: 'float' },
  number: { color: '#3B82F6', scale: 1.18, fontWeight: 800 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: {
    entrance: { type: 'float', duration: 220 },
    word: { type: 'float', duration: 240, intensity: 1 },
    exit: { type: 'fade', duration: 160 }
  }
});
