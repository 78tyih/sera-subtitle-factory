import type { FontKey } from '@/types/caption';

/** Font stacks. Phase 1 uses system-available families (no network fonts). */
export const fontStacks: Record<FontKey, string> = {
  inter: 'Inter, "Helvetica Neue", Arial, sans-serif',
  geist: 'Geist, Inter, "Helvetica Neue", Arial, sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  arial: 'Arial, Helvetica, sans-serif',
  roboto: 'Roboto, Arial, sans-serif',
  montserrat: 'Montserrat, Inter, Arial, sans-serif',
  poppins: 'Poppins, Inter, Arial, sans-serif',
  sourceHanSans: '"Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  notoSansSC: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  system: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif',
  editorial: 'Georgia, "Songti SC", "Source Han Serif SC", "Times New Roman", serif',
  mono: '"SF Mono", "Geist Mono", Menlo, Consolas, monospace'
};

export const fontOptions: Array<{ key: FontKey; label: string }> = [
  { key: 'inter', label: 'Inter' },
  { key: 'geist', label: 'Geist' },
  { key: 'helvetica', label: 'Helvetica' },
  { key: 'arial', label: 'Arial' },
  { key: 'roboto', label: 'Roboto' },
  { key: 'montserrat', label: 'Montserrat' },
  { key: 'poppins', label: 'Poppins' },
  { key: 'sourceHanSans', label: '思源黑体' },
  { key: 'notoSansSC', label: 'Noto Sans SC' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'mono', label: 'Mono' },
  { key: 'system', label: 'System' }
];

export const fontWeightOptions = [300, 400, 500, 600, 700, 800, 900];
export const fontSizePresets = [48, 56, 64, 72, 80, 96];
