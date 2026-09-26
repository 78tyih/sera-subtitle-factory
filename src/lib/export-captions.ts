import type { CaptionRecipe, CaptionSegment } from '@/types/caption';

/**
 * Caption export — the studio can hand off subtitles in the formats a pipeline
 * actually needs. SRT / WebVTT / ASS are generated from the single-line
 * segments, so what you see is exactly what burns in.
 */

const pad = (n: number, len = 2) => String(Math.floor(n)).padStart(len, '0');

export function srtTime(t: number): string {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const ms = Math.round((t - Math.floor(t)) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

export function vttTime(t: number): string {
  return srtTime(t).replace(',', '.');
}

export function assTime(t: number): string {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const cs = Math.round((t - Math.floor(t)) * 100);
  return `${h}:${pad(m)}:${pad(s)}.${pad(cs)}`;
}

const text = (seg: CaptionSegment) => seg.words.map((w) => w.text).join('');

export function toSRT(segments: CaptionSegment[]): string {
  return segments
    .map((seg, i) => `${i + 1}\n${srtTime(seg.start)} --> ${srtTime(seg.end)}\n${text(seg)}\n`)
    .join('\n');
}

export function toVTT(segments: CaptionSegment[]): string {
  const body = segments
    .map((seg) => `${vttTime(seg.start)} --> ${vttTime(seg.end)}\n${text(seg)}\n`)
    .join('\n');
  return `WEBVTT\n\n${body}`;
}

/** hex → ASS &HAABBGGRR (alpha 00 = opaque) */
function assColor(hex: string, alpha = '00'): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '&H00FFFFFF';
  const [r, g, b] = [m[1].slice(0, 2), m[1].slice(2, 4), m[1].slice(4, 6)];
  return `&H${alpha}${b}${g}${r}`.toUpperCase();
}

/** ASS template that mirrors the recipe (single-line, bottom centred). */
export function toASS(segments: CaptionSegment[], recipe: CaptionRecipe): string {
  const font = recipe.typography.fontFamily === 'sourceHanSerif' ? 'Source Han Serif SC' : 'Source Han Sans SC';
  const size = Math.round(recipe.typography.fontSize);
  const border = recipe.border.type === 'outline' ? 3 : 0;
  const isLightBg = recipe.background.type === 'white' || recipe.background.type === 'white92';

  const style = [
    'Style: SeraCaption',
    font,
    size,
    assColor(recipe.text.text, '00'),
    assColor(recipe.text.active, '00'),
    assColor(recipe.border.color === 'none' ? '#000000' : recipe.border.color, '80'),
    isLightBg ? assColor(recipe.background.type === 'white' ? '#FFFFFF' : '#F5F5F5', '20') : '&H80000000',
    '-1', '0', '0', '0', '100', '100', Math.round(recipe.typography.letterSpacing * 100),
    '0', isLightBg || recipe.background.type.startsWith('black') ? '3' : '1',
    border, '0', '2', '80', '80', '90', '1'
  ].join(',');

  const events = segments
    .map((seg) => `Dialogue: 0,${assTime(seg.start)},${assTime(seg.end)},SeraCaption,,0,0,0,,${text(seg)}`)
    .join('\n');

  return `[Script Info]
Title: ${recipe.name}
ScriptType: v4.00+
WrapStyle: 2
PlayResX: 1080
PlayResY: 608
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
${style}

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${events}
`;
}

/** recipe JSON — the one Sera said matters most */
export function toRecipeJSON(recipe: CaptionRecipe, segments?: CaptionSegment[]) {
  return JSON.stringify(
    {
      library: 'sera-subtitle-factory',
      kind: 'caption-export',
      version: '0.1',
      exportedAt: new Date().toISOString(),
      recipe,
      ...(segments ? { segments: segments.map((s) => ({ id: s.id, start: s.start, end: s.end, text: text(s) })) } : {})
    },
    null,
    2
  );
}

export function download(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export type ExportKind = 'json' | 'srt' | 'vtt' | 'ass';

export function exportCaptions(kind: ExportKind, recipe: CaptionRecipe, segments: CaptionSegment[], baseName = 'sera-caption') {
  switch (kind) {
    case 'json':
      download(`${baseName}.recipe.json`, toRecipeJSON(recipe, segments), 'application/json;charset=utf-8');
      break;
    case 'srt':
      download(`${baseName}.srt`, toSRT(segments));
      break;
    case 'vtt':
      download(`${baseName}.vtt`, toVTT(segments));
      break;
    case 'ass':
      download(`${baseName}.ass`, toASS(segments, recipe));
      break;
  }
}
