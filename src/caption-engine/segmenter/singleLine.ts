import type { CaptionSegment, WordTimestamp } from '@/types/caption';

/**
 * Single Line Segmenter — the core algorithm.
 * ============================================================
 * A caption is NEVER wrapped onto two lines.
 * If a segment is too wide we RE-SEGMENT: fewer words per segment,
 * the rest flows into the next segment. Only a single unbreakable
 * token may be slightly scaled down (and never below minScale).
 */

export interface MeasureConfig {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number; // em
}

export interface SegmentConfig extends MeasureConfig {
  /** safe text width in px, on the reference canvas */
  maxWidth: number;
  /** gap (s) that forces a new segment regardless of width */
  gapThreshold?: number;
  /** hard cap of segment duration (s) */
  maxDuration?: number;
  /** allow a lone over-wide token to shrink to this factor */
  minScale?: number;
}

let _ctx: CanvasRenderingContext2D | null = null;
function canvasCtx(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!_ctx) {
    const c = document.createElement('canvas');
    _ctx = c.getContext('2d');
  }
  return _ctx;
}

/**
 * Real text width using canvas.measureText.
 * `allowCanvas` is false during SSR and the very first client render so that
 * server HTML and hydrated HTML are identical (no hydration mismatch);
 * the canvas pass kicks in one tick later.
 */
export function measureText(text: string, cfg: MeasureConfig, allowCanvas = true): number {
  const ctx = allowCanvas ? canvasCtx() : null;
  const spacing = text.length * cfg.letterSpacing * cfg.fontSize;
  if (ctx) {
    ctx.font = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`;
    return ctx.measureText(text).width + spacing;
  }
  // SSR fallback: CJK ≈ 1em, latin ≈ 0.55em
  let w = 0;
  for (const ch of text) w += /[\u2e80-\u9fff\uf900-\ufaff]/.test(ch) ? 1 : 0.55;
  return w * cfg.fontSize + spacing;
}

export interface SegmentResult {
  segments: CaptionSegment[];
  /** per-segment downscale (1 = untouched) for lone over-wide tokens */
  scales: Record<string, number>;
}

export function segmentWords(words: WordTimestamp[], cfg: SegmentConfig, allowCanvas = true): SegmentResult {
  const gapThreshold = cfg.gapThreshold ?? 0.45;
  const maxDuration = cfg.maxDuration ?? 4.2;
  const minScale = cfg.minScale ?? 0.88;

  const segments: CaptionSegment[] = [];
  const scales: Record<string, number> = {};
  let current: WordTimestamp[] = [];
  let idx = 0;

  const flush = () => {
    if (!current.length) return;
    const id = `seg-${++idx}`;
    segments.push({
      id,
      start: current[0].start,
      end: current[current.length - 1].end,
      words: current
    });
    // a lone token wider than the safe box → slight downscale instead of wrapping
    const text = current.map((w) => w.text).join('');
    const wide = measureText(text, cfg, allowCanvas);
    if (current.length === 1 && wide > cfg.maxWidth) {
      scales[id] = Math.max(minScale, Math.min(1, cfg.maxWidth / wide));
    }
    current = [];
  };

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev = words[i - 1];

    // force a break on a real pause
    if (prev && w.start - prev.end >= gapThreshold) flush();

    const candidate = [...current, w];
    const candidateText = candidate.map((x) => x.text).join('');
    const width = measureText(candidateText, cfg, allowCanvas);
    const duration = candidate[candidate.length - 1].end - candidate[0].start;

    if (current.length && (width > cfg.maxWidth || duration > maxDuration)) {
      // too wide → push this word into the NEXT segment (never wrap)
      flush();
    }
    current.push(w);
  }
  flush();

  return { segments, scales };
}

/**
 * Live-editor helper: how many trailing words overflow the safe width.
 * The Studio can show this as a real-time warning while the user edits type.
 */
export function overflowCount(words: WordTimestamp[], cfg: SegmentConfig, upto: number): number {
  let n = 0;
  for (let i = 0; i < upto && i < words.length; i++) {
    const text = words.slice(0, i + 1).map((w) => w.text).join('');
    if (measureText(text, cfg) > cfg.maxWidth) break;
    n = i + 1;
  }
  return upto - n;
}
