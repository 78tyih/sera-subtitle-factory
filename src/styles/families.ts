import { rhythmPresetTable } from '@/types/caption-v2';
import type { PreviewContextKey } from '@/preview-contexts';
import type { Treatment } from '@/types/caption-v2';

/**
 * The 18 Style Families (PART C).
 *
 * A Family is a DESIGN WORK: it owns a visual grammar, a rhythm and a set of
 * preferred preview contexts. A Variant is only a parameter combination of a
 * Master — it is never counted as a separate signature style (PART N).
 *
 * First iteration maps the existing curated presets onto the families; families
 * marked `planned` get their Master in V2.3 and their variants in V2.5.
 */
export interface FamilyDef {
  key: string;
  name: string;
  nameZh: string;
  purpose: string;
  contexts: PreviewContextKey[];
  demoText: string;
  rhythm: keyof typeof rhythmPresetTable;
  treatment: Treatment;
  masterId?: string;
  variantIds: string[];
  planned?: boolean;
  /** quick design rules for whoever implements the style */
  dos: string[];
  donts: string[];
}

const T = (o: Partial<Treatment> = {}): Treatment => ({ ...o });

export const families: FamilyDef[] = [
  {
    key: 'creator-impact',
    name: 'Creator Impact',
    nameZh: '口播冲击',
    purpose: 'TikTok / Shorts 大字字幕：粗体、高可读、描边/投影 + 当前词强调，1–3 词节奏。',
    contexts: ['creator'],
    demoText: '你只需要记住这一件事。',
    rhythm: 'creator',
    treatment: T({ stroke: { enabled: true, color: '#000000', width: 4 }, shadow: { enabled: true, x: 0, y: 2, blur: 10, color: 'rgba(0,0,0,0.5)' }}),
    masterId: 'sera-m-creator-impact',
    variantIds: ['sera-v-creator-impact-blue', 'sera-v-creator-impact-white'],
    dos: ['粗体 + 描边 + 轻微投影', 'current word 强调色', 'maxWords 3'],
    donts: ['巨大 bounce', 'scale 1.4', '卡通跳']
  },
  {
    key: 'clean-spoken',
    name: 'Clean Spoken',
    nameZh: '极简口语',
    purpose: '几乎不动的高级字幕：无背景无边框，只靠字重/透明度变化。',
    contexts: ['creator', 'product'],
    demoText: '你只需要记住这一件事。',
    rhythm: 'creator',
    treatment: T(),
    masterId: 'sera-m-clean-spoken',
    variantIds: ['sera-v-clean-spoken-low', 'sera-v-clean-spoken-warm'],
    dos: ['weight shift', 'soft fade'],
    donts: ['任何背景块', '持续运动']
  },
  {
    key: 'marker-note',
    name: 'Marker Note',
    nameZh: '荧光笔',
    purpose: '当前词像被荧光笔划过（scaleX 0→1，左原点 120–220ms）。',
    contexts: ['creator', 'lifestyle'],
    demoText: '你只需要记住这一件事。',
    rhythm: 'creator',
    treatment: T({ marker: { enabled: true, color: '#FFD400', opacity: 0.85, rotation: -0.5 }}),
    masterId: 'sera-m-marker-note',
    variantIds: ['sera-v-marker-note-blue', 'sera-v-marker-note-slim'],
    dos: ['sweep 从左到右', '轻微 rotate(-0.5deg)'],
    donts: ['瞬间出现矩形块']
  },
  {
    key: 'active-box',
    name: 'Active Box',
    nameZh: '当前词色块',
    purpose: '当前词出现矩形块（radius 4–10px）。',
    contexts: ['business', 'creator'],
    demoText: '市场正在重新寻找新的增长方向。',
    rhythm: 'business',
    treatment: T(),
    masterId: 'sera-m-active-box',
    variantIds: ['sera-v-active-box-white', 'sera-v-active-box-blue'],
    dos: ['radius 4–10px', '黄/蓝/白/黑色块'
    ],
    donts: ['pill / 999px', '胶囊']
  },
  {
    key: 'karaoke-sweep',
    name: 'Karaoke Sweep',
    nameZh: '卡拉OK填充',
    purpose: '真正的逐词渐进填充（按 currentTime 计算 wordProgress，background-clip:text 从左到右）。',
    contexts: ['creator', 'podcast'],
    demoText: '你只需要记住这一件事。',
    rhythm: 'creator',
    treatment: T({ fill: { type: 'karaoke' } }),
    masterId: 'sera-m-karaoke-sweep',
    variantIds: ['sera-v-karaoke-sweep-blue', 'sera-v-karaoke-sweep-white'],
    dos: ['progressive fill', '黄/蓝/白'],
    donts: ['整词瞬间变色']
  },
  {
    key: 'editorial-serif',
    name: 'Editorial Serif',
    nameZh: '编辑衬线',
    purpose: '杂志级排版：靠衬线/斜体/字重/字距/层级，不靠复杂背景。',
    contexts: ['editorial'],
    demoText: '真正重要的变化，往往发生得很安静。',
    rhythm: 'editorial',
    treatment: T(),
    masterId: 'sera-m-editorial-serif',
    variantIds: ['sera-v-editorial-serif-ink', 'sera-v-editorial-serif-red'],
    dos: ['serif + italic keyword', 'cream / white / black / deep red'],
    donts: ['SaaS 卡片感']
  },
  {
    key: 'editorial-inverse',
    name: 'Editorial Inverse',
    nameZh: '反白编辑',
    purpose: '黑底 + 米白字 + 深红强调的 pull quote 条：小圆角，不是卡片。',
    contexts: ['editorial', 'business'],
    demoText: '真正重要的变化，往往发生得很安静。',
    rhythm: 'editorial',
    treatment: T(),
    masterId: 'sera-editorial-inverse',
    variantIds: ['sera-editorial-weight'],
    dos: ['小圆角 4–8px', '米白 + 深红'],
    donts: ['SaaS card', '阴影卡片']
  },
  {
    key: 'multi-font',
    name: 'Multi Font',
    nameZh: '混排字体',
    purpose: '一句里普通词 Sans、关键词 Serif、数字 Condensed（最多两种字体组合）。',
    contexts: ['editorial', 'business'],
    demoText: '真正重要的变化，往往发生得很安静。',
    rhythm: 'editorial',
    treatment: T(),
    masterId: 'sera-split-color',
    variantIds: ['sera-uppercase-tight'],
    dos: ['最多两种字体', '角色清晰：keyword / number'],
    donts: ['四种字体混用']
  },
  {
    key: 'broadcast',
    name: 'Broadcast',
    nameZh: '播报',
    purpose: '新闻/商业/研究：左竖条、硬矩形、小色块、强层级。不做 Ticker。',
    contexts: ['business', 'data'],
    demoText: '市场正在重新寻找新的增长方向。',
    rhythm: 'business',
    treatment: T(),
    masterId: 'sera-news-band',
    variantIds: ['sera-left-bar', 'sera-tech-blue-bar'],
    dos: ['结构化', '左竖条 / 硬矩形'],
    donts: ['滚动 Ticker']
  },
  {
    key: 'podcast-quiet',
    name: 'Podcast Quiet',
    nameZh: '播客安静',
    purpose: '更小字号、更低位置、极少运动、长时间观看舒适。',
    contexts: ['podcast'],
    demoText: '我后来才意识到，这件事没有那么复杂。',
    rhythm: 'podcast',
    treatment: T({ shadow: { enabled: true, x: 0, y: 1, blur: 6, color: 'rgba(0,0,0,0.45)' } }),
    masterId: 'sera-podcast-lower',
    variantIds: ['sera-wide-tracking'],
    dos: ['highlight / weight shift / soft float'],
    donts: ['持续跳动']
  },
  {
    key: 'data-hero',
    name: 'Data Hero',
    nameZh: '数据主角',
    purpose: '数字为主角：$68,500 / +12.5% / 2.4× / 35%。普通词 56px，数字 70–88px 或 1.18–1.30 scale，800/900 字重。',
    contexts: ['data', 'business'],
    demoText: '成交量今天增长了 35%。',
    rhythm: 'data',
    treatment: T(),
    masterId: 'sera-number-hero',
    variantIds: ['sera-data-focus', 'sera-outline-hollow'],
    dos: ['数字放大', '黄 / 蓝（按语义可绿/红）', 'snap / pop / weight'],
    donts: ['大跳', '数字不突出']
  },
  {
    key: 'sports-condensed',
    name: 'Sports Condensed',
    nameZh: '体育窄体',
    purpose: 'Condensed Sans 大写、紧凑排版、白/橙/黑/蓝，适合体育/游戏/高能新闻。',
    contexts: ['sports'],
    demoText: '你只需要记住这一件事。',
    rhythm: 'creator',
    treatment: T({ stroke: { enabled: true, color: '#000000', width: 3 } }),
    masterId: 'sera-uppercase-tight',
    variantIds: ['sera-bold-outline-box'],
    dos: ['condensed + uppercase', 'snap / slide / punch'],
    donts: ['常规宽体'],
  },
  {
    key: 'tech-terminal',
    name: 'Tech Terminal',
    nameZh: '科技终端',
    purpose: '等宽 + 绿/青 + 深色 + 打字揭示；光标只能是可选装饰（字幕不是代码终端）。',
    contexts: ['code', 'product'],
    demoText: 'AI 正在重新定义软件的工作方式。',
    rhythm: 'creator',
    treatment: T(),
    masterId: 'sera-mono-terminal',
    variantIds: [],
    dos: ['mono', 'type reveal', 'optional cursor'],
    donts: ['把字幕做成真的终端窗口']
  },
  {
    key: 'ui-clarity',
    name: 'UI Clarity',
    nameZh: '界面清晰',
    purpose: '借产品界面语言：focus box、选区矩形、下划线、细边框。不复制 Figma / Linear。',
    contexts: ['product', 'code'],
    demoText: 'AI 正在重新定义软件的工作方式。',
    rhythm: 'creator',
    treatment: T({ underline: { enabled: true, color: '#4F8CFF', width: 3 } }),
    masterId: 'sera-glass-soft',
    variantIds: ['sera-outline-hollow'],
    dos: ['细边框 / 选区感'],
    donts: ['复制真实产品 UI']
  },
  { key: 'pixel-y2k', name: 'Pixel Y2K', nameZh: '像素 Y2K', purpose: 'Pixel/Bitmap 字：锐利、数字感、复古。', contexts: ['code', 'sports'], demoText: 'AI 正在重新定义软件的工作方式。', rhythm: 'creator', treatment: T(), variantIds: [], planned: true, dos: ['step reveal', 'snap'], donts: ['过度 glitch'] }
];

export const familyByKey = (key: string) => families.find((f) => f.key === key);

/** which family owns this preset id */
export function familyOfPreset(id: string): FamilyDef | undefined {
  return families.find((f) => f.masterId === id || f.variantIds.includes(id));
}

/** families that already have at least one preset */
export const liveFamilies = families.filter((f) => !f.planned);
