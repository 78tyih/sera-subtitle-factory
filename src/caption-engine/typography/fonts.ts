import type { FontKey } from '@/types/caption';

/**
 * Font stacks. Phase 1 uses families available locally / by system fallback —
 * no network fonts, no licensing risk. Add `@font-face` later if needed.
 */
export const fontStacks: Record<FontKey, string> = {
  /* ---------- sans · latin ---------- */
  inter: 'Inter, "Helvetica Neue", Arial, sans-serif',
  interTight: '"Inter Tight", Inter, "Helvetica Neue", sans-serif',
  geist: 'Geist, Inter, "Helvetica Neue", sans-serif',
  spaceGrotesk: '"Space Grotesk", Inter, Arial, sans-serif',
  dmSans: '"DM Sans", Inter, Arial, sans-serif',
  manrope: 'Manrope, Inter, Arial, sans-serif',
  ibmPlex: '"IBM Plex Sans", Inter, Arial, sans-serif',
  outfit: 'Outfit, Inter, Arial, sans-serif',
  workSans: '"Work Sans", Inter, Arial, sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  arial: 'Arial, Helvetica, sans-serif',
  roboto: 'Roboto, Arial, sans-serif',
  montserrat: 'Montserrat, Inter, Arial, sans-serif',
  poppins: 'Poppins, Inter, Arial, sans-serif',

  /* ---------- sans · 中文 ---------- */
  sourceHanSans: '"Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  notoSansSC: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  harmonyOS: '"HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  alibaba: '"Alibaba PuHuiTi 3", "Alibaba PuHuiTi", "PingFang SC", sans-serif',
  smiley: '"Smiley Sans", "PingFang SC", "Microsoft YaHei", sans-serif',
  system: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif',

  /* ---------- serif ---------- */
  editorial: 'Georgia, "Songti SC", "Source Han Serif SC", "Times New Roman", serif',
  sourceHanSerif: '"Source Han Serif SC", "Noto Serif SC", "Songti SC", serif',
  notoSerif: '"Noto Serif SC", "Songti SC", Georgia, serif',
  playfair: '"Playfair Display", Georgia, "Songti SC", serif',
  lora: 'Lora, Georgia, "Songti SC", serif',
  instrumentSerif: '"Instrument Serif", Georgia, "Songti SC", serif',

  /* ---------- mono / hand ---------- */
  mono: '"SF Mono", "Geist Mono", Menlo, Consolas, monospace',
  jetbrains: '"JetBrains Mono", "SF Mono", Menlo, monospace',
  firaCode: '"Fira Code", "SF Mono", Menlo, monospace',
  lxgw: '"LXGW WenKai", "Kaiti SC", STKaiti, "KaiTi", "Songti SC", serif'
};

export const fontOptions: Array<{ key: FontKey; label: string; group: string }> = [
  { key: 'inter', label: 'Inter', group: '西文无衬线' },
  { key: 'interTight', label: 'Inter Tight', group: '西文无衬线' },
  { key: 'geist', label: 'Geist', group: '西文无衬线' },
  { key: 'spaceGrotesk', label: 'Space Grotesk', group: '西文无衬线' },
  { key: 'dmSans', label: 'DM Sans', group: '西文无衬线' },
  { key: 'manrope', label: 'Manrope', group: '西文无衬线' },
  { key: 'ibmPlex', label: 'IBM Plex Sans', group: '西文无衬线' },
  { key: 'outfit', label: 'Outfit', group: '西文无衬线' },
  { key: 'workSans', label: 'Work Sans', group: '西文无衬线' },
  { key: 'helvetica', label: 'Helvetica', group: '西文无衬线' },
  { key: 'arial', label: 'Arial', group: '西文无衬线' },
  { key: 'roboto', label: 'Roboto', group: '西文无衬线' },
  { key: 'montserrat', label: 'Montserrat', group: '西文无衬线' },
  { key: 'poppins', label: 'Poppins', group: '西文无衬线' },

  { key: 'sourceHanSans', label: '思源黑体', group: '中文黑体' },
  { key: 'notoSansSC', label: 'Noto Sans SC', group: '中文黑体' },
  { key: 'harmonyOS', label: '鸿蒙黑体', group: '中文黑体' },
  { key: 'alibaba', label: '阿里普惠体', group: '中文黑体' },
  { key: 'smiley', label: '得意黑', group: '中文黑体' },
  { key: 'system', label: '系统字体', group: '中文黑体' },

  { key: 'editorial', label: 'Editorial', group: '衬线' },
  { key: 'sourceHanSerif', label: '思源宋体', group: '衬线' },
  { key: 'notoSerif', label: 'Noto Serif SC', group: '衬线' },
  { key: 'playfair', label: 'Playfair', group: '衬线' },
  { key: 'lora', label: 'Lora', group: '衬线' },
  { key: 'instrumentSerif', label: 'Instrument', group: '衬线' },

  { key: 'mono', label: 'Mono', group: '等宽 / 手写' },
  { key: 'jetbrains', label: 'JetBrains', group: '等宽 / 手写' },
  { key: 'firaCode', label: 'Fira Code', group: '等宽 / 手写' },
  { key: 'lxgw', label: '文楷', group: '等宽 / 手写' }
];

export const fontWeightOptions = [300, 400, 500, 600, 700, 800, 900];
export const fontSizePresets = [48, 56, 64, 72, 80, 96];
