import { preset } from './_shared';

/**
 * 07 · Left Bar  (flagship demo)
 *   black translucent rounded box + blue left bar + slide up
 */
export const leftBar = preset({
  id: 'sera-left-bar',
  name: 'Left Bar',
  nameZh: '左竖条',
  descriptionEn: 'Translucent dark rounded box with a blue left bar, sliding up. Built for opinion content.',
  category: 'Clean',
  description: '黑色半透明圆角底 + 左侧蓝竖条，整行上滑入场。观点输出主力样式。',
  tags: ['left-bar', 'blue', 'slide-up', 'box'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.01, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.55)', active: '#FFFFFF', keyword: '#3B82F6', number: '#3B82F6' },
  activeWord: { color: '#FFFFFF', scale: 1.06, animation: 'highlight' },
  number: { color: '#3B82F6', scale: 1.18, fontWeight: 800 },
  background: { type: 'black80', opacity: 1, blur: 6, radius: 18, paddingX: 24, paddingY: 14 },
  border: { type: 'leftBar', color: '#3B82F6', width: 4, radius: 4 },
  motion: {
    entrance: { type: 'slideUp', duration: 240 },
    word: { type: 'highlight', duration: 140, intensity: 1 },
    exit: { type: 'fade', duration: 160 }
  }
});
