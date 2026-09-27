import type { CaptionRecipe } from '@/types/caption';
import { masterPresets } from './masters';

/**
 * V2.4 — two variants per Master (PART C §07-§12, PART N).
 *
 * The rule that matters: a variant is a PARAMETER COMBINATION of a master, not a
 * new design. It may change at most two of {accent colour, background, motion
 * intensity, position} — the visual grammar (font class, layout grammar,
 * treatment, rhythm) stays the master's. Two presets that differ only by
 * yellow → blue are one Signature + one Variant, never two Signatures (PART N §82).
 *
 *   6 masters × (1 + 2) = 18 Signature Presets
 */

type Recipe = CaptionRecipe;

const byId = (id: string): Recipe => {
  const m = masterPresets.find((p) => p.id === id);
  if (!m) throw new Error(`[variants] unknown master: ${id}`);
  return m;
};

/** clone a master and patch it — id/name/masterId are always rewritten */
function variant(
  masterId: string,
  suffix: string,
  o: {
    name: string;
    nameZh: string;
    description: string;
    descriptionEn?: string;
    tags?: string[];
    patch: Partial<Recipe>;
  }
): Recipe {
  const m = byId(masterId);
  return {
    ...m,
    ...o.patch,
    id: `${masterId.replace(/^sera-m-/, 'sera-v-')}-${suffix}`,
    name: o.name,
    nameZh: o.nameZh,
    description: o.description,
    descriptionEn: o.descriptionEn ?? o.description,
    tags: [...(m.tags ?? []), 'variant', ...(o.tags ?? [])],
    priority: 'variant',
    masterId,
    /* a variant never re-declares a family: it inherits the master's */
    categories: m.categories
  } as Recipe;
}

const CREATOR = 'sera-m-creator-impact';
const CLEAN = 'sera-m-clean-spoken';
const MARKER = 'sera-m-marker-note';
const BOX = 'sera-m-active-box';
const KARAOKE = 'sera-m-karaoke-sweep';
const SERIF = 'sera-m-editorial-serif';

export const variantPresetsByFamily: Recipe[] = [
  /* ---------------------------------------------- 01 Creator Impact */
  variant(CREATOR, 'blue', {
    name: 'Creator Impact Blue',
    nameZh: '口播冲击 · 蓝',
    description: '同一套冲击语法，强调色换电光蓝。禁巨大 bounce 与 1.4 scale。',
    descriptionEn: 'Same impact grammar, electric-blue emphasis. No huge bounce, no 1.4 scale.',
    tags: ['blue'],
    patch: {
      text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.56)', active: '#4F8CFF', keyword: '#4F8CFF', number: '#4F8CFF' },
      activeWord: { color: '#4F8CFF', scale: 1.08, animation: 'highlight' },
      number: { color: '#4F8CFF', scale: 1.2, fontWeight: 800 },
      emphasis: { ...byId(CREATOR).emphasis, numberColor: '#4F8CFF' }
    }
  }),
  variant(CREATOR, 'white', {
    name: 'Creator Impact White',
    nameZh: '口播冲击 · 白',
    description: '纯白强调 + 更重的黑描边，适合画面已经很花的素材。',
    descriptionEn: 'Pure-white emphasis with a heavier outline — for busy footage.',
    tags: ['white'],
    patch: {
      text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#FFFFFF', keyword: '#FFFFFF', number: '#FFFFFF' },
      activeWord: { color: '#FFFFFF', scale: 1.1, animation: 'highlight' },
      number: { color: '#FFFFFF', scale: 1.22, fontWeight: 800 },
      emphasis: { ...byId(CREATOR).emphasis, numberColor: '#FFFFFF' },
      treatment: {
        stroke: { enabled: true, color: '#000000', width: 6 },
        shadow: { enabled: true, x: 0, y: 3, blur: 14, color: 'rgba(0,0,0,0.55)' }
      }
    }
  }),

  /* ---------------------------------------------- 02 Clean Spoken */
  variant(CLEAN, 'low', {
    name: 'Clean Spoken Low',
    nameZh: '极简口语 · 低位',
    description: '同一套安静语法，位置更低、字号更小，长时间观看不累。',
    descriptionEn: 'Same quiet grammar, lower and smaller — comfortable for long viewing.',
    tags: ['low'],
    patch: {
      typography: { ...byId(CLEAN).typography, fontSize: 54 },
      layout: { ...byId(CLEAN).layout, yOffset: 0.08 }
    }
  }),
  variant(CLEAN, 'warm', {
    name: 'Clean Spoken Warm',
    nameZh: '极简口语 · 暖白',
    description: '米白替代纯白，暖一点、软一点，适合访谈与生活方式。',
    descriptionEn: 'Cream instead of pure white — warmer and softer, for interviews and lifestyle.',
    tags: ['warm'],
    patch: {
      text: { text: '#F5F3EE', idle: 'rgba(245,243,238,0.4)', active: '#FFFFFF', keyword: '#FFD400', number: '#FFD400' },
      activeWord: { color: '#FFFFFF', scale: 1.03, animation: 'weightShift' }
    }
  }),

  /* ---------------------------------------------- 03 Marker Note */
  variant(MARKER, 'blue', {
    name: 'Marker Note Blue',
    nameZh: '荧光笔 · 蓝',
    description: '荧光笔换成蓝色，扫过速度与轻微旋转不变。',
    descriptionEn: 'Blue highlighter — same sweep speed and the same subtle rotation.',
    tags: ['blue'],
    patch: {
      treatment: { marker: { enabled: true, color: '#4F8CFF', opacity: 0.85, rotation: -0.5 } },
      emphasis: { ...byId(MARKER).emphasis, numberColor: '#4F8CFF' }
    }
  }),
  variant(MARKER, 'slim', {
    name: 'Marker Note Slim',
    nameZh: '荧光笔 · 细',
    description: '更窄更淡的笔触，只做轻提示，不抢画面。',
    descriptionEn: 'Narrower, lighter stroke — a hint rather than a statement.',
    tags: ['slim'],
    patch: {
      typography: { ...byId(MARKER).typography, fontSize: 60 },
      treatment: { marker: { enabled: true, color: '#35D07F', opacity: 0.6, rotation: -0.5 } },
      emphasis: { ...byId(MARKER).emphasis, numberColor: '#35D07F' }
    }
  }),

  /* ---------------------------------------------- 04 Active Box */
  variant(BOX, 'white', {
    name: 'Active Box White',
    nameZh: '当前词色块 · 白',
    description: '白色块 + 深色字，radius 6px 不变（禁胶囊）。',
    descriptionEn: 'White block with dark text — radius stays 6px, never a pill.',
    tags: ['white'],
    patch: {
      text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.56)', active: '#111111', keyword: '#111111', number: '#111111' },
      emphasis: { ...byId(BOX).emphasis, numberColor: '#FFFFFF' }
    }
  }),
  variant(BOX, 'blue', {
    name: 'Active Box Blue',
    nameZh: '当前词色块 · 蓝',
    description: '蓝色块，适合商业与数据类内容。',
    descriptionEn: 'Blue block — built for business and data content.',
    tags: ['blue'],
    patch: {
      text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.56)', active: '#0B1220', keyword: '#0B1220', number: '#0B1220' },
      emphasis: { ...byId(BOX).emphasis, numberColor: '#4F8CFF' },
      preview: { contexts: ['business', 'data'], demoText: '市场正在重新寻找新的增长方向。' }
    }
  }),

  /* ---------------------------------------------- 05 Karaoke Sweep */
  variant(KARAOKE, 'blue', {
    name: 'Karaoke Sweep Blue',
    nameZh: '卡拉OK填充 · 蓝',
    description: '蓝色渐进填充，同样是逐词按进度推进。',
    descriptionEn: 'Blue progressive fill — still per-word, still driven by progress.',
    tags: ['blue'],
    patch: {
      text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#4F8CFF', keyword: '#4F8CFF', number: '#4F8CFF' },
      activeWord: { color: '#4F8CFF', scale: 1.06, animation: 'karaoke' },
      emphasis: { ...byId(KARAOKE).emphasis, numberColor: '#4F8CFF' }
    }
  }),
  variant(KARAOKE, 'white', {
    name: 'Karaoke Sweep White',
    nameZh: '卡拉OK填充 · 白',
    description: '未念到的词更暗，填充色用纯白，反差最大。',
    descriptionEn: 'Dimmer idle words, white fill — maximum contrast.',
    tags: ['white'],
    patch: {
      text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.3)', active: '#FFFFFF', keyword: '#FFFFFF', number: '#FFFFFF' },
      activeWord: { color: '#FFFFFF', scale: 1.06, animation: 'karaoke' },
      emphasis: { ...byId(KARAOKE).emphasis, numberColor: '#FFFFFF' }
    }
  }),

  /* ---------------------------------------------- 06 Editorial Serif */
  variant(SERIF, 'ink', {
    name: 'Editorial Serif Ink',
    nameZh: '编辑衬线 · 墨黑',
    description: '黑底米字：杂志 pull quote 的另一种解法，小圆角、深红强调。',
    descriptionEn: 'Cream on black — the other magazine pull-quote solution, small radius, deep-red accent.',
    tags: ['ink'],
    patch: {
      text: { text: '#F5F3EE', idle: 'rgba(245,243,238,0.45)', active: '#FFFFFF', keyword: '#E63946', number: '#E63946' },
      background: { ...byId(SERIF).background, type: 'black', opacity: 0.92, radius: 4, paddingX: 26, paddingY: 14 },
      layout: { ...byId(SERIF).layout, yOffset: 0.2 }
    }
  }),
  variant(SERIF, 'red', {
    name: 'Editorial Serif Red',
    nameZh: '编辑衬线 · 深红',
    description: '深红作为主强调：关键词斜体 + 深红，编辑感更强。',
    descriptionEn: 'Deep red as the main emphasis — italic keywords in red, more editorial.',
    tags: ['red'],
    patch: {
      text: { text: '#FFFFFF', idle: 'rgba(255,255,255,0.5)', active: '#E63946', keyword: '#E63946', number: '#E63946' },
      activeWord: { color: '#E63946', scale: 1.04, animation: 'weightShift' },
      emphasis: { ...byId(SERIF).emphasis, numberColor: '#E63946' }
    }
  })
];

/** group id → [master, ...variants] */
export function familyMembers(masterId: string): Recipe[] {
  return [byId(masterId), ...variantPresetsByFamily.filter((v) => v.masterId === masterId)];
}
