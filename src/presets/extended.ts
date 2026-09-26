import { preset } from './_shared';

/**
 * Extended preset pack — 24 more styles so the library actually feels like a
 * library (spec: "为每个字幕增加尽可能多的模板库 / 风格尽可能多样化").
 * Every one is a full CaptionRecipe built on the shared base, so RULE #1
 * (single line) and the primitive system stay intact.
 */

/* ---------------------------------------------------------------- Bold 结构派 */

export const outlineHollow = preset({
  id: 'sera-outline-hollow',
  name: 'Outline Hollow',
  nameZh: '描边空心',
  description: '空心描边大字，不加背景，适合压在画面上做冲击标题。',
  descriptionEn: 'Hollow outlined caps — no background, built to punch through video.',
  category: 'Bold',
  tags: ['outline', 'bold', 'impact'],
  typography: { fontFamily: 'poppins', fontWeight: 800, fontSize: 74, letterSpacing: 0.01, lineHeight: 1.12, textTransform: 'none' },
  text: { text: 'transparent', idle: 'rgba(255,255,255,0.28)', active: '#FFFFFF', keyword: '#FFFFFF', number: '#FFFFFF' },
  activeWord: { color: '#FFFFFF', scale: 1.04, animation: 'highlight' },
  number: { color: '#FFFFFF', scale: 1.2, fontWeight: 900 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  border: { type: 'none', color: '#FFFFFF', width: 2, radius: 16 },
  motion: { entrance: { type: 'scale', duration: 200 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const uppercaseTight = preset({
  id: 'sera-uppercase-tight',
  name: 'Uppercase Tight',
  nameZh: '全大写紧凑',
  description: '全大写 + 收紧字距，新闻标题式的力量感。',
  descriptionEn: 'All caps with tight tracking — headline torque for western copy.',
  category: 'Bold',
  tags: ['uppercase', 'tight', 'news', 'bold'],
  typography: { fontFamily: 'interTight', fontWeight: 800, fontSize: 66, letterSpacing: -0.035, lineHeight: 1.1, textTransform: 'uppercase' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.45)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.05, animation: 'highlight' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'slideUp', duration: 200 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const wideTracking = preset({
  id: 'sera-wide-tracking',
  name: 'Wide Tracking',
  nameZh: '宽字距',
  description: '大字距慢节奏，电影字幕与品牌口播都合适。',
  descriptionEn: 'Generous tracking and slow pacing — cinematic and brand-safe.',
  category: 'Editorial',
  tags: ['tracking', 'cinematic', 'calm'],
  typography: { fontFamily: 'ibmPlex', fontWeight: 500, fontSize: 54, letterSpacing: 0.2, lineHeight: 1.4, textTransform: 'none' },
  text: { text: '#F2F2F0', idle: 'rgba(242,242,240,0.45)', active: '#FFFFFF', keyword: '#FFFFFF', number: '#FFFFFF' },
  activeWord: { color: '#FFFFFF', scale: 1.03, animation: 'float' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'float', duration: 260 }, word: { type: 'float', duration: 240, intensity: 0.7 }, exit: { type: 'fade', duration: 200 } }
});

export const softShadow = preset({
  id: 'sera-soft-shadow',
  name: 'Soft Shadow',
  nameZh: '柔和投影',
  description: '白字带柔和投影，无需背景块即可在复杂画面上读清。',
  descriptionEn: 'White text with a soft drop shadow — readable over busy footage, no box.',
  category: 'Minimal',
  tags: ['shadow', 'minimal', 'safe'],
  typography: { fontFamily: 'manrope', fontWeight: 700, fontSize: 64, letterSpacing: -0.01, lineHeight: 1.16, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#FFFFFF', keyword: '#7FB4FF', number: '#7FB4FF' },
  activeWord: { color: '#7FB4FF', scale: 1.05, animation: 'highlight' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  border: { type: 'none', color: '#000000', width: 0, radius: 16 },
  motion: { entrance: { type: 'fade', duration: 200 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

/* ---------------------------------------------------------------- 标记 / 强调派 */

export const markerYellow = preset({
  id: 'sera-marker-yellow',
  name: 'Marker Yellow',
  nameZh: '荧光笔',
  description: '当前词后面出现黄色荧光块，像用马克笔划过。',
  descriptionEn: 'A yellow marker block sweeps behind the active word.',
  category: 'Bold',
  tags: ['marker', 'yellow', 'highlight'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 64, letterSpacing: -0.01, lineHeight: 1.16, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.52)', active: '#111111', keyword: '#111111', number: '#111111' },
  activeWord: { color: '#111111', scale: 1.05, animation: 'highlight', background: 'rgba(255,212,0,0.92)' },
  number: { color: '#FFD400', scale: 1.2, fontWeight: 800 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'float', duration: 200 }, word: { type: 'highlight', duration: 150, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const underlineAccent = preset({
  id: 'sera-underline-accent',
  name: 'Underline Accent',
  nameZh: '下划线强调',
  description: '当前词下方一条彩色下划线，强调克制不抢画面。',
  descriptionEn: 'A coloured underline under the active word — emphasis without shouting.',
  category: 'Tech',
  tags: ['underline', 'accent', 'quiet'],
  typography: { fontFamily: 'spaceGrotesk', fontWeight: 700, fontSize: 62, letterSpacing: -0.005, lineHeight: 1.16, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#7FB4FF', keyword: '#7FB4FF', number: '#7FB4FF' },
  activeWord: { color: '#7FB4FF', scale: 1.04, animation: 'highlight' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  border: { type: 'bottomLine', color: '#7FB4FF', width: 3, radius: 4 },
  motion: { entrance: { type: 'slideUp', duration: 200 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const numberHero = preset({
  id: 'sera-number-hero',
  name: 'Number Hero',
  nameZh: '数字主角',
  description: '数字放大到 1.3 倍、900 字重、金色，其余文字退到背景。',
  descriptionEn: 'Numbers take the stage: 1.3×, weight 900, gold. Everything else recedes.',
  category: 'Data',
  tags: ['number', 'data', 'hero'],
  typography: { fontFamily: 'inter', fontWeight: 600, fontSize: 58, letterSpacing: -0.01, lineHeight: 1.18, textTransform: 'none' },
  text: { text: '#E8E8E8', idle: 'rgba(232,232,232,0.45)', active: '#FFFFFF', keyword: '#F5B942', number: '#F5B942' },
  activeWord: { color: '#FFFFFF', scale: 1.04, animation: 'highlight' },
  number: { color: '#F5B942', scale: 1.3, fontWeight: 900 },
  emphasis: { numbers: true, percentages: true, currency: true, keywords: [], aiEmphasis: false, numberScale: 1.3, numberWeight: 900, numberColor: '#F5B942', keywordWeight: 800 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'slideUp', duration: 200 }, word: { type: 'pop', duration: 180, intensity: 0.85 }, exit: { type: 'fade', duration: 140 } }
});

export const crimsonStrong = preset({
  id: 'sera-crimson-strong',
  name: 'Crimson Strong',
  nameZh: '深红强',
  description: '深红强调色，用于风险提示与止损类内容。',
  descriptionEn: 'Deep crimson emphasis for risk warnings and stop-loss talk.',
  category: 'Broadcast',
  tags: ['crimson', 'risk', 'alert'],
  typography: { fontFamily: 'inter', fontWeight: 800, fontSize: 66, letterSpacing: -0.02, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.48)', active: '#FF4D4D', keyword: '#FF4D4D', number: '#FF4D4D' },
  activeWord: { color: '#FF4D4D', scale: 1.08, animation: 'pop' },
  number: { color: '#FF4D4D', scale: 1.2, fontWeight: 900 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'slideUp', duration: 200 }, word: { type: 'pop', duration: 200, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const amberAlert = preset({
  id: 'sera-amber-alert',
  name: 'Amber Alert',
  nameZh: '琥珀警示',
  description: '琥珀色强调，比纯黄更稳，适合提醒类口播。',
  descriptionEn: 'Amber emphasis — steadier than pure yellow, good for warnings.',
  category: 'Broadcast',
  tags: ['amber', 'alert', 'warm'],
  typography: { fontFamily: 'dmSans', fontWeight: 700, fontSize: 64, letterSpacing: -0.015, lineHeight: 1.15, textTransform: 'none' },
  text: { text: '#FDF6E3', idle: 'rgba(253,246,227,0.5)', active: '#FFB020', keyword: '#FFB020', number: '#FFB020' },
  activeWord: { color: '#FFB020', scale: 1.07, animation: 'bounce' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'float', duration: 200 }, word: { type: 'bounce', duration: 220, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const emeraldCalm = preset({
  id: 'sera-emerald-calm',
  name: 'Emerald Calm',
  nameZh: '翠绿沉静',
  description: '翠绿强调，正向收益与稳健策略的配色。',
  descriptionEn: 'Emerald emphasis for gains and steady strategies.',
  category: 'Broadcast',
  tags: ['emerald', 'gain', 'calm'],
  typography: { fontFamily: 'workSans', fontWeight: 700, fontSize: 62, letterSpacing: -0.01, lineHeight: 1.16, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#35D07F', keyword: '#35D07F', number: '#35D07F' },
  activeWord: { color: '#35D07F', scale: 1.06, animation: 'scale' },
  number: { color: '#35D07F', scale: 1.2, fontWeight: 800 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'fade', duration: 200 }, word: { type: 'scale', duration: 220, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const purpleGlow = preset({
  id: 'sera-purple-glow',
  name: 'Purple Glow',
  nameZh: '紫光',
  description: '紫色微光强调，科技与 AI 语境的克制版本。',
  descriptionEn: 'Restrained purple glow for AI and tech topics.',
  category: 'Neon',
  tags: ['purple', 'glow', 'tech'],
  typography: { fontFamily: 'outfit', fontWeight: 800, fontSize: 66, letterSpacing: -0.01, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#B77CFF', keyword: '#B77CFF', number: '#B77CFF' },
  activeWord: { color: '#B77CFF', scale: 1.06, animation: 'glow' },
  number: { color: '#B77CFF', scale: 1.2, fontWeight: 800 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'fade', duration: 220 }, word: { type: 'glow', duration: 300, intensity: 0.8 }, exit: { type: 'fade', duration: 180 } }
});

/* ---------------------------------------------------------------- 容器 / 版式派 */

export const leftBox = preset({
  id: 'sera-left-box',
  name: 'Left Box',
  nameZh: '左侧色块',
  description: '左侧竖色块 + 深色底，观点式内容的经典版式。',
  descriptionEn: 'Dark rounded box with a coloured left block — classic opinion layout.',
  category: 'Clean',
  tags: ['left-bar', 'box', 'opinion'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 56, letterSpacing: -0.01, lineHeight: 1.15, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.52)', active: '#FFFFFF', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFFFFF', scale: 1.05, animation: 'highlight' },
  background: { type: 'black80', opacity: 1, blur: 6, radius: 14, paddingX: 24, paddingY: 14 },
  border: { type: 'leftBar', color: '#FFD400', width: 5, radius: 4 },
  motion: { entrance: { type: 'slideUp', duration: 220 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 150 } }
});

export const glassSoft = preset({
  id: 'sera-glass-soft',
  name: 'Glass Soft',
  nameZh: '轻玻璃',
  description: '极轻的磨砂玻璃底，克制使用，不上重效果。',
  descriptionEn: 'A barely-there frosted glass panel. Light touch only.',
  category: 'Tech',
  tags: ['glass', 'soft', 'tech'],
  typography: { fontFamily: 'geist', fontWeight: 600, fontSize: 60, letterSpacing: -0.01, lineHeight: 1.16, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#7FB4FF', keyword: '#7FB4FF', number: '#7FB4FF' },
  activeWord: { color: '#7FB4FF', scale: 1.05, animation: 'highlight' },
  background: { type: 'glass', opacity: 1, blur: 8, radius: 20, paddingX: 26, paddingY: 14 },
  motion: { entrance: { type: 'float', duration: 220 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 150 } }
});

export const topBand = preset({
  id: 'sera-top-band',
  name: 'Top Band',
  nameZh: '顶部色带',
  description: '字幕放顶部、配全宽色带，适合被画面底部占用的场景。',
  descriptionEn: 'Full-width band pinned to the top — for when the lower frame is busy.',
  category: 'Clean',
  tags: ['top', 'band', 'layout'],
  typography: { fontFamily: 'ibmPlex', fontWeight: 700, fontSize: 52, letterSpacing: 0.01, lineHeight: 1.2, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.05, animation: 'highlight' },
  background: { type: 'black80', opacity: 1, blur: 6, radius: 0, paddingX: 30, paddingY: 16 },
  motion: { entrance: { type: 'slideDown', duration: 220 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 150 } },
  layout: { position: 'top', yOffset: 0.07, align: 'center', maxWidth: 1 }
});

export const quoteSerif = preset({
  id: 'sera-quote-serif',
  name: 'Quote Serif',
  nameZh: '引号衬线',
  description: '衬线体加引号气质，适合金句与转场。',
  descriptionEn: 'Serif with a quotation feel — for pull quotes and transitions.',
  category: 'Editorial',
  tags: ['quote', 'serif', 'story'],
  typography: { fontFamily: 'playfair', fontWeight: 500, fontSize: 62, letterSpacing: 0.005, lineHeight: 1.35, textTransform: 'none' },
  text: { text: '#F5F3EE', idle: 'rgba(245,243,238,0.5)', active: '#FFFFFF', keyword: '#E63946', number: '#E63946' },
  activeWord: { color: '#FFFFFF', scale: 1, animation: 'weightShift' },
  emphasis: { numbers: true, percentages: true, currency: true, keywords: [], aiEmphasis: false, numberScale: 1.14, numberWeight: 700, numberColor: '#E63946', keywordWeight: 700 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'float', duration: 260 }, word: { type: 'weightShift', duration: 220, intensity: 1 }, exit: { type: 'fade', duration: 200 } }
});

export const classicSubtitle = preset({
  id: 'sera-classic-subtitle',
  name: 'Classic Subtitle',
  nameZh: '经典底部',
  description: '最标准的底部字幕：描边 + 投影，任何画面都读得清。',
  descriptionEn: 'The standard bottom subtitle: stroke + shadow, readable anywhere.',
  category: 'Minimal',
  tags: ['classic', 'stroke', 'safe'],
  typography: { fontFamily: 'sourceHanSans', fontWeight: 700, fontSize: 62, letterSpacing: 0.01, lineHeight: 1.2, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.55)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.04, animation: 'highlight' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  border: { type: 'none', color: '#000000', width: 0, radius: 16 },
  motion: { entrance: { type: 'fade', duration: 180 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } },
  layout: { position: 'bottom', yOffset: 0.11, align: 'center', maxWidth: 0.9 }
});

export const newsBand2 = preset({
  id: 'sera-news-band',
  name: 'News Band',
  nameZh: '新闻条',
  description: '底部新闻条结构：色带 + 左对齐标题。',
  descriptionEn: 'A news-band structure: band plus a left-aligned title.',
  category: 'Broadcast',
  tags: ['news', 'band', 'finance'],
  typography: { fontFamily: 'inter', fontWeight: 700, fontSize: 54, letterSpacing: -0.01, lineHeight: 1.18, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#FF4D4D', keyword: '#FF4D4D', number: '#FF4D4D' },
  activeWord: { color: '#FF4D4D', scale: 1.06, animation: 'highlight' },
  background: { type: 'black', opacity: 0.88, blur: 6, radius: 8, paddingX: 26, paddingY: 14 },
  border: { type: 'leftBar', color: '#FF4D4D', width: 6, radius: 3 },
  motion: { entrance: { type: 'slideUp', duration: 200 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } },
  layout: { position: 'bottom', yOffset: 0.1, align: 'left', maxWidth: 0.86 }
});

export const serifMinimal = preset({
  id: 'sera-serif-minimal',
  name: 'Serif Minimal',
  nameZh: '极简衬线',
  description: '宋体小字、宽字距、无背景，安静的研究感。',
  descriptionEn: 'Small serif, wide tracking, no background — quiet and research-like.',
  category: 'Editorial',
  tags: ['serif', 'minimal', 'research'],
  typography: { fontFamily: 'sourceHanSerif', fontWeight: 500, fontSize: 50, letterSpacing: 0.14, lineHeight: 1.45, textTransform: 'none' },
  text: { text: '#F2F2F0', idle: 'rgba(242,242,240,0.45)', active: '#FFFFFF', keyword: '#E63946', number: '#E63946' },
  activeWord: { color: '#FFFFFF', scale: 1.02, animation: 'float' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'float', duration: 280 }, word: { type: 'float', duration: 260, intensity: 0.6 }, exit: { type: 'fade', duration: 220 } }
});

export const karaokeYellow = preset({
  id: 'sera-karaoke-yellow',
  name: 'Karaoke Yellow',
  nameZh: '逐词黄',
  description: '逐词推进高亮（黄），短视频口播的标配。',
  descriptionEn: 'Word-by-word yellow highlight — the short-form default.',
  category: 'Kinetic',
  tags: ['karaoke', 'yellow', 'short-video'],
  typography: { fontFamily: 'montserrat', fontWeight: 800, fontSize: 68, letterSpacing: 0, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.42)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.08, animation: 'highlight' },
  number: { color: '#FFD400', scale: 1.22, fontWeight: 900 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'fade', duration: 160 }, word: { type: 'highlight', duration: 130, intensity: 1 }, exit: { type: 'fade', duration: 130 } }
});

export const karaokeBlue = preset({
  id: 'sera-karaoke-blue',
  name: 'Karaoke Blue',
  nameZh: '逐词蓝',
  description: '逐词推进高亮（蓝），更理性克制的版本。',
  descriptionEn: 'Word-by-word blue highlight — the quieter version.',
  category: 'Kinetic',
  tags: ['karaoke', 'blue', 'short-video'],
  typography: { fontFamily: 'montserrat', fontWeight: 800, fontSize: 68, letterSpacing: 0, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.42)', active: '#4F8CFF', keyword: '#4F8CFF', number: '#4F8CFF' },
  activeWord: { color: '#4F8CFF', scale: 1.08, animation: 'highlight' },
  number: { color: '#4F8CFF', scale: 1.22, fontWeight: 900 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'fade', duration: 160 }, word: { type: 'highlight', duration: 130, intensity: 1 }, exit: { type: 'fade', duration: 130 } }
});

export const wordPopSoft = preset({
  id: 'sera-word-pop-soft',
  name: 'Word Pop Soft',
  nameZh: '轻弹跳',
  description: '很轻的弹跳强调，只动 5px，不抢节奏。',
  descriptionEn: 'A very light bounce — 5px only, never steals the rhythm.',
  category: 'Kinetic',
  tags: ['pop', 'soft', 'kinetic'],
  typography: { fontFamily: 'dmSans', fontWeight: 700, fontSize: 62, letterSpacing: -0.01, lineHeight: 1.15, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.05, animation: 'bounce' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'fade', duration: 180 }, word: { type: 'bounce', duration: 200, intensity: 0.6 }, exit: { type: 'fade', duration: 140 } }
});

export const editorialWeight = preset({
  id: 'sera-editorial-weight',
  name: 'Editorial Weight',
  nameZh: '编辑字重',
  description: '靠字重变化强调，不动位置、不变颜色，最安静的高级感。',
  descriptionEn: 'Emphasis by weight alone — no movement, no colour change.',
  category: 'Editorial',
  tags: ['weight', 'quiet', 'editorial'],
  typography: { fontFamily: 'lora', fontWeight: 400, fontSize: 58, letterSpacing: 0.02, lineHeight: 1.35, textTransform: 'none' },
  text: { text: '#EDEDED', idle: 'rgba(237,237,237,0.4)', active: '#FFFFFF', keyword: '#FFFFFF', number: '#FFFFFF' },
  activeWord: { color: '#FFFFFF', scale: 1, animation: 'weightShift' },
  emphasis: { numbers: true, percentages: true, currency: true, keywords: [], aiEmphasis: false, numberScale: 1.15, numberWeight: 700, numberColor: '#FFFFFF', keywordWeight: 800 },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'fade', duration: 240 }, word: { type: 'weightShift', duration: 200, intensity: 1 }, exit: { type: 'fade', duration: 200 } }
});

export const monoTerminal = preset({
  id: 'sera-mono-terminal',
  name: 'Mono Terminal',
  nameZh: '等宽终端',
  description: '等宽字体 + 绿色高亮，代码与信号类内容。',
  descriptionEn: 'Monospace with green emphasis — for code and signals.',
  category: 'Tech',
  tags: ['mono', 'terminal', 'code'],
  typography: { fontFamily: 'jetbrains', fontWeight: 600, fontSize: 54, letterSpacing: 0.01, lineHeight: 1.3, textTransform: 'none' },
  text: { text: '#D7FFE6', idle: 'rgba(215,255,230,0.4)', active: '#35D07F', keyword: '#35D07F', number: '#35D07F' },
  activeWord: { color: '#35D07F', scale: 1.05, animation: 'highlight' },
  background: { type: 'black', opacity: 0.72, blur: 6, radius: 10, paddingX: 24, paddingY: 14 },
  motion: { entrance: { type: 'slideUp', duration: 200 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const splitColor = preset({
  id: 'sera-split-color',
  name: 'Split Color',
  nameZh: '双色分割',
  description: '普通词冷白、关键词暖黄，冷暖对比但不花。',
  descriptionEn: 'Cool white body with warm yellow keywords — contrast without noise.',
  category: 'Minimal',
  tags: ['split', 'color', 'contrast'],
  typography: { fontFamily: 'interTight', fontWeight: 700, fontSize: 66, letterSpacing: -0.02, lineHeight: 1.14, textTransform: 'none' },
  text: { text: '#EAF2FF', idle: 'rgba(234,242,255,0.48)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.06, animation: 'highlight' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 },
  motion: { entrance: { type: 'fade', duration: 190 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const boldOutlineBox = preset({
  id: 'sera-bold-outline-box',
  name: 'Bold Outline Box',
  nameZh: '描边框盒',
  description: '透明底 + 彩色描边框，硬朗的编辑部风格。',
  descriptionEn: 'Transparent fill with a coloured outline box — hard editorial edges.',
  category: 'Bold',
  tags: ['outline', 'box', 'editorial'],
  typography: { fontFamily: 'spaceGrotesk', fontWeight: 700, fontSize: 54, letterSpacing: 0.01, lineHeight: 1.2, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#FFD400', keyword: '#FFD400', number: '#FFD400' },
  activeWord: { color: '#FFD400', scale: 1.05, animation: 'highlight' },
  background: { type: 'none', opacity: 1, blur: 6, radius: 10, paddingX: 24, paddingY: 14 },
  border: { type: 'outline', color: 'rgba(255,255,255,0.5)', width: 2, radius: 10 },
  motion: { entrance: { type: 'scale', duration: 200 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 140 } }
});

export const podcastLower = preset({
  id: 'sera-podcast-lower',
  name: 'Podcast Lower',
  nameZh: '播客下三分之一',
  description: '左下角小字 + 半透明底，访谈与播客场景。',
  descriptionEn: 'Small lower-left text on a translucent panel — interviews and podcasts.',
  category: 'Podcast',
  tags: ['lower-third', 'podcast', 'interview'],
  typography: { fontFamily: 'manrope', fontWeight: 600, fontSize: 46, letterSpacing: 0.01, lineHeight: 1.3, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#7FB4FF', keyword: '#7FB4FF', number: '#7FB4FF' },
  activeWord: { color: '#7FB4FF', scale: 1.04, animation: 'highlight' },
  background: { type: 'black80', opacity: 0.85, blur: 6, radius: 10, paddingX: 22, paddingY: 12 },
  border: { type: 'leftBar', color: '#7FB4FF', width: 4, radius: 3 },
  motion: { entrance: { type: 'slideUp', duration: 220 }, word: { type: 'highlight', duration: 140, intensity: 1 }, exit: { type: 'fade', duration: 150 } },
  layout: { position: 'bottom', yOffset: 0.12, align: 'left', maxWidth: 0.72 }
});

export const editorialInverse = preset({
  id: 'sera-editorial-inverse',
  name: 'Editorial Inverse',
  nameZh: '反白编辑',
  description: '纯黑底 + 米白字 + 红点，反白版的编辑风格。',
  descriptionEn: 'Inverted editorial: black card, cream text, one red accent.',
  category: 'Editorial',
  tags: ['inverse', 'editorial', 'contrast'],
  typography: { fontFamily: 'instrumentSerif', fontWeight: 400, fontSize: 60, letterSpacing: 0.005, lineHeight: 1.3, textTransform: 'none' },
  text: { text: '#F5F3EE', idle: 'rgba(245,243,238,0.48)', active: '#FFFFFF', keyword: '#E63946', number: '#E63946' },
  activeWord: { color: '#E63946', scale: 1.05, animation: 'highlight' },
  background: { type: 'black', opacity: 0.9, blur: 6, radius: 6, paddingX: 26, paddingY: 16 },
  motion: { entrance: { type: 'fade', duration: 220 }, word: { type: 'highlight', duration: 150, intensity: 1 }, exit: { type: 'fade', duration: 180 } }
});

export const techBlueBar = preset({
  id: 'sera-tech-blue-bar',
  name: 'Tech Blue Bar',
  nameZh: '科技蓝条',
  description: '深蓝底 + 蓝竖条 + 白字，产品与技术播报。',
  descriptionEn: 'Deep-blue panel, blue left bar, white text — product and tech briefings.',
  category: 'Tech',
  tags: ['blue', 'bar', 'product'],
  typography: { fontFamily: 'geist', fontWeight: 700, fontSize: 56, letterSpacing: -0.01, lineHeight: 1.16, textTransform: 'none' },
  text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#7FB4FF', keyword: '#7FB4FF', number: '#7FB4FF' },
  activeWord: { color: '#7FB4FF', scale: 1.06, animation: 'scale' },
  background: { type: 'black', opacity: 0.8, blur: 6, radius: 12, paddingX: 26, paddingY: 15 },
  border: { type: 'leftBar', color: '#3B82F6', width: 5, radius: 4 },
  motion: { entrance: { type: 'slideUp', duration: 210 }, word: { type: 'scale', duration: 220, intensity: 1 }, exit: { type: 'fade', duration: 150 } }
});

export const extendedPresets = [
  outlineHollow,
  uppercaseTight,
  wideTracking,
  softShadow,
  markerYellow,
  underlineAccent,
  numberHero,
  crimsonStrong,
  amberAlert,
  emeraldCalm,
  purpleGlow,
  leftBox,
  glassSoft,
  topBand,
  quoteSerif,
  classicSubtitle,
  newsBand2,
  serifMinimal,
  karaokeYellow,
  karaokeBlue,
  wordPopSoft,
  editorialWeight,
  monoTerminal,
  splitColor,
  boldOutlineBox,
  podcastLower,
  editorialInverse,
  techBlueBar
];
