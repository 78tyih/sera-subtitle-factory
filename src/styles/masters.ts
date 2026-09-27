import type { CaptionRecipe } from '@/types/caption';

/**
 * V2.3 — the first six Master Styles (PART C 第二轮).
 *
 * Every master is composed out of V2.2 primitives:
 *   Creator Impact  → snap (fast impact, almost no overshoot)
 *   Clean Spoken    → weight shift only (nothing else moves)
 *   Marker Note     → markerSweep (highlighter, scaleX 0 → 1 from the left)
 *   Active Box      → boxFollow (rectangular block, radius 6 — never a pill)
 *   Karaoke Sweep   → karaokeFill (progressive left-to-right fill)
 *   Editorial Serif → keywordTypography italic + weight shift
 *
 * Each master declares its own rhythm + demo line + preview context (PART G/T),
 * so a family is always judged inside the scene it was designed for.
 * Variants (2 per master) come in V2.5 → 54 Signature Presets.
 */

type Recipe = CaptionRecipe;

const base = (o: Partial<Recipe>): Recipe =>
  ({
    id: 'sera-m-base',
    name: 'Base',
    nameZh: '基础',
    category: 'Minimal',
    categories: ['Minimal'],
    priority: 'signature',
    description: '基础主样式',
    descriptionEn: 'Base master style',
    tags: ['master'],
    layout: {
      maxLines: 1,
      position: 'bottom',
      yOffset: 0.16,
      align: 'center',
      maxWidth: 0.86,
      aspect: '16:9',
      safeArea: false
    },
    typography: {
      fontFamily: 'inter',
      fontWeight: 700,
      fontSize: 66,
      letterSpacing: 0.01,
      lineHeight: 1.14,
      textTransform: 'none'
    },
    text: {
      text: '#FFFFFF',
      idle: 'rgba(255,255,255,0.56)',
      active: '#FFD400',
      keyword: '#FFD400',
      number: '#FFD400'
    },
    activeWord: { color: '#FFD400', scale: 1.06, animation: 'highlight' },
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
    border: { type: 'none', color: '#4F8CFF', width: 3, radius: 16 },
    motion: {
      entrance: { type: 'fade', duration: 200 },
      word: { type: 'highlight', duration: 200, intensity: 1 },
      exit: { type: 'fade', duration: 140 }
    },
    rhythm: {
      mode: 'phrase',
      maxWords: 4,
      combineWithinMs: 700,
      pauseBreakMs: 300,
      punctuationBreak: true,
      density: 'normal'
    },
    preview: { contexts: ['creator'], demoText: '你只需要记住这一件事。' },
    ...o
  }) as Recipe;

export const masterPresets: Recipe[] = [
  /* ---------------------------------------------------------------- 01 */
  base({
    id: 'sera-m-creator-impact',
    name: 'Creator Impact Yellow',
    nameZh: '口播冲击 · 黄',
    category: 'Bold',
    categories: ['Bold'],
    description: '粗体大字 + 黑描边 + 轻投影，当前词黄色并以 snap 快速落位。1–3 词节奏。',
    descriptionEn:
      'Heavy condensed type with a black outline and a soft shadow; the active word snaps in yellow. 1–3 word rhythm.',
    tags: ['master', 'creator', 'impact'],
    typography: {
      fontFamily: 'uppercaseTight',
      fontWeight: 800,
      fontSize: 76,
      letterSpacing: 0.005,
      lineHeight: 1.1,
      textTransform: 'none'
    },
    activeWord: { color: '#FFD400', scale: 1.08, animation: 'highlight' },
    motion: {
      entrance: { type: 'fade', duration: 160 },
      word: { type: 'highlight', duration: 160, intensity: 1 },
      exit: { type: 'fade', duration: 120 },
      decorator: 'snap'
    },
    treatment: {
      stroke: { enabled: true, color: '#000000', width: 4 },
      shadow: { enabled: true, x: 0, y: 2, blur: 10, color: 'rgba(0,0,0,0.5)' }
    },
    rhythm: {
      mode: 'word',
      maxWords: 3,
      combineWithinMs: 550,
      pauseBreakMs: 260,
      punctuationBreak: true,
      density: 'tight'
    },
    preview: { contexts: ['creator'], demoText: '你只需要记住这一件事。' }
  }),

  /* ---------------------------------------------------------------- 02 */
  base({
    id: 'sera-m-clean-spoken',
    name: 'Clean Spoken',
    nameZh: '极简口语',
    category: 'Minimal',
    categories: ['Minimal'],
    description: '无背景无边框，只靠字重与透明度变化。安静、premium、干净。',
    descriptionEn:
      'No background, no border — only weight and opacity shift. Quiet, premium, clean.',
    tags: ['master', 'minimal', 'clean'],
    typography: {
      fontFamily: 'inter',
      fontWeight: 600,
      fontSize: 62,
      letterSpacing: 0.01,
      lineHeight: 1.16,
      textTransform: 'none'
    },
    text: {
      text: '#FFFFFF',
      idle: 'rgba(255,255,255,0.42)',
      active: '#FFFFFF',
      keyword: '#FFD400',
      number: '#FFD400'
    },
    activeWord: { color: '#FFFFFF', scale: 1.04, animation: 'weightShift' },
    motion: {
      entrance: { type: 'softFade', duration: 240 },
      word: { type: 'weightShift', duration: 200, intensity: 0.8 },
      exit: { type: 'fade', duration: 200 }
    },
    rhythm: {
      mode: 'phrase',
      maxWords: 4,
      combineWithinMs: 700,
      pauseBreakMs: 300,
      punctuationBreak: true,
      density: 'normal'
    },
    preview: { contexts: ['creator', 'product'], demoText: '你只需要记住这一件事。' }
  }),

  /* ---------------------------------------------------------------- 03 */
  base({
    id: 'sera-m-marker-note',
    name: 'Marker Note Yellow',
    nameZh: '荧光笔 · 黄',
    category: 'Bold',
    categories: ['Bold'],
    description: '当前词像被荧光笔划过：色块 scaleX 0→1 左原点，160ms，轻微 rotate(-0.5deg)。',
    descriptionEn:
      'The active word is swept by a highlighter: scaleX 0 → 1 from the left in 160ms, with a subtle -0.5deg rotation.',
    tags: ['master', 'marker', 'note'],
    typography: {
      fontFamily: 'inter',
      fontWeight: 700,
      fontSize: 66,
      letterSpacing: 0.01,
      lineHeight: 1.14,
      textTransform: 'none'
    },
    text: {
      text: '#FFFFFF',
      idle: 'rgba(255,255,255,0.56)',
      active: '#111111',
      keyword: '#111111',
      number: '#111111'
    },
    activeWord: { color: '#111111', scale: 1.06, animation: 'highlight' },
    motion: {
      entrance: { type: 'fade', duration: 180 },
      word: { type: 'highlight', duration: 160, intensity: 1 },
      exit: { type: 'fade', duration: 140 },
      decorator: 'markerSweep'
    },
    treatment: {
      marker: { enabled: true, color: '#FFD400', opacity: 0.85, rotation: -0.5 }
    },
    rhythm: {
      mode: 'compact',
      maxWords: 4,
      combineWithinMs: 600,
      pauseBreakMs: 280,
      punctuationBreak: true,
      density: 'tight'
    },
    preview: { contexts: ['creator', 'lifestyle'], demoText: '你只需要记住这一件事。' }
  }),

  /* ---------------------------------------------------------------- 04 */
  base({
    id: 'sera-m-active-box',
    name: 'Active Box Yellow',
    nameZh: '当前词色块 · 黄',
    category: 'Clean',
    categories: ['Clean'],
    description: '当前词出现矩形色块，半径 6px（禁胶囊）。硬朗、结构化。',
    descriptionEn:
      'A rectangular block on the active word, radius 6px — never a pill. Structured and crisp.',
    tags: ['master', 'box', 'active'],
    typography: {
      fontFamily: 'inter',
      fontWeight: 700,
      fontSize: 64,
      letterSpacing: 0.01,
      lineHeight: 1.14,
      textTransform: 'none'
    },
    text: {
      text: '#FFFFFF',
      idle: 'rgba(255,255,255,0.56)',
      active: '#111111',
      keyword: '#111111',
      number: '#111111'
    },
    activeWord: { color: '#111111', scale: 1.06, animation: 'highlight' },
    motion: {
      entrance: { type: 'fade', duration: 180 },
      word: { type: 'highlight', duration: 150, intensity: 1 },
      exit: { type: 'fade', duration: 140 },
      decorator: 'boxFollow'
    },
    rhythm: {
      mode: 'phrase',
      maxWords: 5,
      combineWithinMs: 900,
      pauseBreakMs: 360,
      punctuationBreak: true,
      density: 'normal'
    },
    preview: { contexts: ['business', 'creator'], demoText: '市场正在重新寻找新的增长方向。' }
  }),

  /* ---------------------------------------------------------------- 05 */
  base({
    id: 'sera-m-karaoke-sweep',
    name: 'Karaoke Sweep Yellow',
    nameZh: '卡拉OK填充 · 黄',
    category: 'Kinetic',
    categories: ['Kinetic'],
    description: '真正的逐词渐进填充：按当前词内进度从左到右填充，不是整词瞬间变色。',
    descriptionEn:
      'True progressive fill: the word fills left-to-right as the voice moves through it — not an instant colour swap.',
    tags: ['master', 'karaoke', 'sweep'],
    typography: {
      fontFamily: 'inter',
      fontWeight: 800,
      fontSize: 70,
      letterSpacing: 0.01,
      lineHeight: 1.12,
      textTransform: 'none'
    },
    text: {
      text: '#FFFFFF',
      idle: 'rgba(255,255,255,0.5)',
      active: '#FFD400',
      keyword: '#FFD400',
      number: '#FFD400'
    },
    motion: {
      entrance: { type: 'fade', duration: 160 },
      word: { type: 'karaoke', duration: 200, intensity: 1 },
      exit: { type: 'fade', duration: 120 },
      decorator: 'karaokeFill'
    },
    rhythm: {
      mode: 'word',
      maxWords: 3,
      combineWithinMs: 550,
      pauseBreakMs: 260,
      punctuationBreak: true,
      density: 'tight'
    },
    preview: { contexts: ['creator', 'podcast'], demoText: '你只需要记住这一件事。' }
  }),

  /* ---------------------------------------------------------------- 06 */
  base({
    id: 'sera-m-editorial-serif',
    name: 'Editorial Serif',
    nameZh: '编辑衬线',
    category: 'Editorial',
    categories: ['Editorial'],
    description: '杂志级排版：衬线 + 关键词斜体加粗 + 米白配色，不靠复杂背景。',
    descriptionEn:
      'Magazine-grade: serif with italic keywords on cream — no decorative background.',
    tags: ['master', 'editorial', 'serif'],
    typography: {
      fontFamily: 'editorial',
      fontWeight: 500,
      fontSize: 58,
      letterSpacing: 0.01,
      lineHeight: 1.4,
      textTransform: 'none'
    },
    text: {
      text: '#F5F3EE',
      idle: 'rgba(245,243,238,0.5)',
      active: '#FFFFFF',
      keyword: '#E63946',
      number: '#E63946'
    },
    activeWord: { color: '#FFFFFF', scale: 1.04, animation: 'weightShift' },
    /* PART C §14 — a keyword can carry its own typography */
    keywordTypography: { fontStyle: 'italic', fontWeight: 700 },
    numberTypography: { fontWeight: 700, color: '#E63946' },
    motion: {
      entrance: { type: 'softFade', duration: 260 },
      word: { type: 'weightShift', duration: 220, intensity: 0.9 },
      exit: { type: 'fade', duration: 200 }
    },
    rhythm: {
      mode: 'phrase',
      maxWords: 5,
      combineWithinMs: 1000,
      pauseBreakMs: 380,
      punctuationBreak: true,
      density: 'normal'
    },
    preview: { contexts: ['editorial'], demoText: '真正重要的变化，往往发生得很安静。' }
  })
];

export const masterIds = masterPresets.map((p) => p.id);
