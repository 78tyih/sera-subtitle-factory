import { preset } from './_shared';
import type { CaptionRecipe, WordMotionName, BackgroundType, FontKey } from '@/types/caption';

/**
 * Generated preset pack — 160 systematically-enumerated variants.
 * ============================================================
 * 8 style families × 3 axes:
 *   · accent   (8 colours)
 *   · word motion (7)
 *   · background  (5)
 * = 8 × (8 + 7 + 5) = 160 presets.
 *
 * Every one is a full CaptionRecipe (single-line rule intact, primitives
 * untouched), so it drops straight into the library, the studio and exports.
 */

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const ACCENTS: Array<[string, string, string]> = [
  ['yellow', '黄', '#FFD400'],
  ['blue', '蓝', '#4F8CFF'],
  ['green', '绿', '#35D07F'],
  ['red', '红', '#E63946'],
  ['orange', '橙', '#FF8A3D'],
  ['purple', '紫', '#B77CFF'],
  ['cyan', '青', '#35C8D0'],
  ['pink', '粉', '#FF5ACD']
];

const MOTIONS: Array<[WordMotionName, string]> = [
  ['highlight', '高亮'],
  ['pop', '弹跳'],
  ['bounce', '回弹'],
  ['float', '浮动'],
  ['scale', '缩放'],
  ['glow', '发光'],
  ['weightShift', '字重变化']
];

const BACKGROUNDS: Array<[string, string, BackgroundType]> = [
  ['none', '无背景', 'none'],
  ['white', '纯白底', 'white'],
  ['black', '纯黑底', 'black'],
  ['black80', '黑底80', 'black80'],
  ['glass', '轻玻璃', 'glass']
];

interface Family {
  key: string;
  nameZh: string;
  nameEn: string;
  category: CaptionRecipe['category'];
  font: FontKey;
  base: Partial<CaptionRecipe>;
  /** text colour on a light background (for white / white92) */
  darkText: string;
}

const FAMILIES: Family[] = [
  {
    key: 'sans',
    nameZh: '极简白字',
    nameEn: 'Sans',
    category: 'Minimal',
    font: 'inter',
    darkText: '#111111',
    base: { background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 } }
  },
  {
    key: 'card',
    nameZh: '黑底圆角',
    nameEn: 'Card',
    category: 'Clean',
    font: 'inter',
    darkText: '#111111',
    base: { background: { type: 'black80', opacity: 1, blur: 6, radius: 20, paddingX: 26, paddingY: 14 } }
  },
  {
    key: 'bar',
    nameZh: '左竖条',
    nameEn: 'Bar',
    category: 'Bold',
    font: 'inter',
    darkText: '#111111',
    base: {
      background: { type: 'black80', opacity: 1, blur: 6, radius: 14, paddingX: 24, paddingY: 14 },
      border: { type: 'leftBar', color: '#4F8CFF', width: 5, radius: 4 }
    }
  },
  {
    key: 'serif',
    nameZh: '衬线',
    nameEn: 'Serif',
    category: 'Editorial',
    font: 'sourceHanSerif',
    darkText: '#111111',
    base: { typography: { fontFamily: 'sourceHanSerif', fontWeight: 500, fontSize: 56, letterSpacing: 0.01, lineHeight: 1.35, textTransform: 'none' }, background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 } }
  },
  {
    key: 'mono',
    nameZh: '等宽',
    nameEn: 'Mono',
    category: 'Tech',
    font: 'jetbrains',
    darkText: '#111111',
    base: { typography: { fontFamily: 'jetbrains', fontWeight: 600, fontSize: 54, letterSpacing: 0.01, lineHeight: 1.3, textTransform: 'none' }, background: { type: 'black', opacity: 0.72, blur: 6, radius: 10, paddingX: 24, paddingY: 14 } }
  },
  {
    key: 'frost',
    nameZh: '轻玻璃',
    nameEn: 'Frost',
    category: 'Tech',
    font: 'geist',
    darkText: '#111111',
    base: { background: { type: 'glass', opacity: 1, blur: 8, radius: 20, paddingX: 26, paddingY: 14 } }
  },
  {
    key: 'hollow',
    nameZh: '描边空心',
    nameEn: 'Hollow',
    category: 'Bold',
    font: 'poppins',
    darkText: '#111111',
    base: { typography: { fontFamily: 'poppins', fontWeight: 800, fontSize: 70, letterSpacing: 0.01, lineHeight: 1.12, textTransform: 'none' }, background: { type: 'none', opacity: 1, blur: 6, radius: 20, paddingX: 22, paddingY: 12 } }
  },
  {
    key: 'mark',
    nameZh: '荧光笔',
    nameEn: 'Mark',
    category: 'Bold',
    font: 'inter',
    darkText: '#111111',
    base: { background: { type: 'none', opacity: 1, blur: 6, radius:20, paddingX: 22, paddingY: 12 } }
  }
];

/** per-family text palette factory — flips for light backgrounds */
function textFor(f: Family, light: boolean, accent: string): CaptionRecipe['text'] {
  const body = light ? f.darkText : '#FFFFFF';
  const idle = light ? 'rgba(17,17,17,0.5)' : 'rgba(255,255,255,0.52)';
  return { text: body, idle, active: accent, keyword: accent, number: accent };
}

function descZh(f: Family, axis: string, value: string) {
  return `${f.nameZh} · ${axis}「${value}」。中性演示字幕，单行锁定。`;
}
function descEn(f: Family, axis: string, value: string) {
  return `${f.nameEn} with ${axis} ${value}. Neutral demo captions, single-line.`;
}

const generated: CaptionRecipe[] = [];

for (const f of FAMILIES) {
  /* ---- accent axis ---- */
  for (const [acc, accZh, color] of ACCENTS) {
    generated.push(
      preset({
        id: `sera-${f.key}-${acc}`,
        name: `${f.nameEn} ${cap(acc)}`,
        nameZh: `${f.nameZh} · ${accZh}`,
        description: descZh(f, '强调色', accZh),
        descriptionEn: descEn(f, 'accent', acc),
        category: f.category,
        tags: [f.key, acc, 'accent'],
        typography: { fontFamily: f.font },
        text: textFor(f, false, color),
        activeWord: { color, scale: 1.07, animation: 'highlight' },
        number: { color, scale: 1.2, fontWeight: 800 },
        ...f.base
      })
    );
  }

  /* ---- word motion axis ---- */
  for (const [m, mZh] of MOTIONS) {
    generated.push(
      preset({
        id: `sera-${f.key}-${m}`,
        name: `${f.nameEn} ${cap(m)}`,
        nameZh: `${f.nameZh} · ${mZh}`,
        description: descZh(f, '逐词动效', mZh),
        descriptionEn: descEn(f, 'word motion', m),
        category: f.category,
        tags: [f.key, m, 'motion'],
        typography: { fontFamily: f.font },
        text: textFor(f, false, '#FFD400'),
        activeWord: { color: '#FFD400', scale: 1.07, animation: m },
        number: { color: '#FFD400', scale: 1.2, fontWeight: 800 },
        motion: { word: { type: m, duration: 200, intensity: m === 'glow' ? 0.8 : 1 } },
        ...f.base
      })
    );
  }

  /* ---- background axis ---- */
  for (const [b, bZh, bType] of BACKGROUNDS) {
    const light = bType === 'white' || bType === 'white92';
    const boxed = bType !== 'none';
    generated.push(
      preset({
        id: `sera-${f.key}-${b}`,
        name: `${f.nameEn} ${cap(b)}`,
        nameZh: `${f.nameZh} · ${bZh}`,
        description: descZh(f, '背景', bZh),
        descriptionEn: descEn(f, 'background', b),
        category: f.category,
        tags: [f.key, b, 'background'],
        typography: { fontFamily: f.font },
        text: textFor(f, light, light ? '#E63946' : '#4F8CFF'),
        activeWord: { color: light ? '#E63946' : '#4F8CFF', scale: 1.06, animation: 'highlight' },
        number: { color: light ? '#E63946' : '#4F8CFF', scale: 1.2, fontWeight: 800 },
        background: { type: bType, opacity: 1, blur: bType === 'glass' ? 8 : 6, radius: bType === 'none' ? 20 : 20, paddingX: boxed ? 26 : 22, paddingY: boxed ? 14 : 12 },
        ...(f.key === 'bar' && bType !== 'none' ? { border: { type: 'leftBar' as const, color: light ? '#E63946' : '#4F8CFF', width: 5, radius: 4 } } : {})
      })
    );
  }
}

/* dedupe on id (defensive) */
const seen = new Set<string>();
export const generatedPresets = generated.filter((p) => {
  if (seen.has(p.id)) return false;
  seen.add(p.id);
  return true;
});

export const GENERATED_COUNT = generatedPresets.length;
