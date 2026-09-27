import type { FontKey } from '@/types/caption';

/**
 * Font system (PART F)
 * ====================
 * · 14 curated stacks instead of 31 aspirational names.
 * · `status` is honest: 'system' = available on the target OS, 'fallback' = will
 *   silently degrade — the UI must label it, never pretend it loaded (PART S).
 * · Open-licensed webfonts are declared, but only count as available once the
 *   asset is vendored under /public/fonts (see docs/font-licenses.md).
 */

export type FontStatus = 'system' | 'fallback';

export interface FontDef {
  key: FontKey;
  label: string;
  group: 'Sans' | 'Serif' | 'Display' | 'Mono' | 'Hand / Kai';
  /** typographic role this stack covers */
  role: string;
  stack: string;
  status: FontStatus;
  note?: string;
}

export const fonts: FontDef[] = [
  { key: 'inter', label: 'Inter', group: 'Sans', role: 'Neutral Sans', stack: 'Inter, "Helvetica Neue", Arial, sans-serif', status: 'system' },
  { key: 'sourceHanSans', label: '思源黑体', group: 'Sans', role: 'Chinese Sans', stack: '"Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif', status: 'fallback', note: 'macOS 实际落到 PingFang SC；思源黑体需自托管 @font-face（SIL OFL）' },
  { key: 'poppins', label: 'Geometric Sans', group: 'Sans', role: 'Geometric Sans', stack: '"Poppins", "Futura", "Century Gothic", sans-serif', status: 'fallback' },
  { key: 'smiley', label: '得意黑', group: 'Display', role: 'Heavy Display (CN)', stack: '"Smiley Sans", "PingFang SC", sans-serif', status: 'fallback' },
  { key: 'uppercaseTight', label: 'Condensed Sans', group: 'Display', role: 'Condensed Sans', stack: '"Archivo Narrow", "Oswald", "Impact", "Haettenschweiler", sans-serif', status: 'fallback' },
  { key: 'editorial', label: 'Editorial Serif', group: 'Serif', role: 'Editorial Serif', stack: 'Georgia, "Times New Roman", "Songti SC", serif', status: 'system' },
  { key: 'sourceHanSerif', label: '思源宋体', group: 'Serif', role: 'Chinese Serif', stack: '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif', status: 'fallback' },
  { key: 'playfair', label: 'Display Serif', group: 'Serif', role: 'Display Serif', stack: '"Playfair Display", Georgia, "Songti SC", serif', status: 'fallback' },
  { key: 'mono', label: 'Mono', group: 'Mono', role: 'Mono', stack: '"SF Mono", "Geist Mono", Menlo, Consolas, monospace', status: 'system' },
  { key: 'jetbrains', label: 'JetBrains Mono', group: 'Mono', role: 'Mono (display)', stack: '"JetBrains Mono", "SF Mono", Menlo, monospace', status: 'fallback' },
  { key: 'lxgw', label: '霞鹜文楷', group: 'Hand / Kai', role: 'Hand / Kai', stack: '"LXGW WenKai", "Kaiti SC", STKaiti, "KaiTi", serif', status: 'fallback' },
  { key: 'helvetica', label: 'Helvetica', group: 'Sans', role: 'Neutral Sans (alt)', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif', status: 'system' },
  { key: 'system', label: 'System UI', group: 'Sans', role: 'UI Clarity', stack: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif', status: 'system' },
  { key: 'geist', label: 'Geist', group: 'Sans', role: 'UI Clarity (display)', stack: 'Geist, Inter, "Helvetica Neue", sans-serif', status: 'fallback' }
];

/** legacy helper: key → stack (keeps every existing call site compiling) */
export const fontStacks = Object.fromEntries(
  fonts.map((f) => [f.key, f.stack])
) as Record<FontKey, string>;

/** Inspector 用：按角色分组展示 */
export const fontOptions = fonts.map((f) => ({ key: f.key, label: f.label, group: f.group }));

/** PART S：UI 必须显示真实状态，不能假装字体已加载 */
export function fontStatus(key: FontKey): FontStatus {
  return fonts.find((f) => f.key === key)?.status ?? 'fallback';
}

export const fontWeightOptions = [300, 400, 500, 600, 700, 800, 900];
export const fontSizePresets = [48, 56, 64, 72, 80, 96];
