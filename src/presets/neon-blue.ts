import { preset } from './_shared';

/**
 * 10 · Neon Blue — soft blue glow on the active word.
 * Deliberately NOT cyberpunk: no purple, no RGB, no scanlines.
 */
export const neonBlue = preset({
  id: 'sera-neon-blue',
  name: 'Neon Blue',
  nameZh: '霓虹蓝',
  descriptionEn: 'White text with a soft blue glow on the active word — restrained, never cyberpunk.',
  category: 'Neon',
  description: '白字 + 蓝色 active 微光，克制到不像霓虹。科技内容适用。',
  tags: ['neon', 'blue', 'glow', 'tech'],
  typography: { fontFamily: 'inter', fontWeight: 800, fontSize: 66, letterSpacing: -0.015, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.52)', active: '#7FB4FF', keyword: '#7FB4FF', number: '#7FB4FF' },
  activeWord: { color: '#7FB4FF', scale: 1.06, animation: 'glow' },
  number: { color: '#7FB4FF', scale: 1.2, fontWeight: 800 },
  emphasis: {
    numbers: true,
    percentages: true,
    currency: true,
    keywords: [],
    aiEmphasis: false,
    numberScale: 1.2,
    numberWeight: 800,
    numberColor: '#7FB4FF',
    keywordWeight: 800
  },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: {
    entrance: { type: 'fade', duration: 220 },
    word: { type: 'glow', duration: 280, intensity: 0.85 },
    exit: { type: 'fade', duration: 180 }
  }
});
