import type { CaptionSegment, CaptionRecipe, ResolvedSegment, ResolvedWord, WordType } from '@/types/caption';
import { analyse } from './emphasis/rules';

/**
 * Runtime resolver: raw transcript + recipe + clock  →  renderable segment.
 * This is where `activeWord` is decided (speech-driven typography, spec §04).
 */

export function findSegment(segments: CaptionSegment[], time: number): CaptionSegment | null {
  if (!segments.length) return null;
  for (const s of segments) {
    if (time >= s.start && time <= s.end + 0.12) return s;
  }
  /* between segments: keep the previous one visible (no flicker) */
  let prev: CaptionSegment | null = null;
  for (const s of segments) {
    if (s.end < time) prev = s;
  }
  if (prev && time - prev.end < 0.3) return prev;
  return segments[0] ?? null;
}

export function resolveSegment(segment: CaptionSegment, recipe: CaptionRecipe, time: number): ResolvedSegment {
  const types = analyse(segment.words, {
    numbers: recipe.emphasis.numbers,
    percentages: recipe.emphasis.percentages,
    currency: recipe.emphasis.currency,
    keywords: recipe.emphasis.keywords
  });

  const words: ResolvedWord[] = segment.words.map((w) => {
    const type: WordType = types[w.id] ?? 'normal';
    return {
      ...w,
      type,
      isKeyword: type === 'keyword',
      isNumber: type === 'number',
      isPercentage: type === 'percentage',
      isCurrency: type === 'currency',
      isActive: time >= w.start && time <= w.end,
      isSpoken: time > w.end
    };
  });

  return {
    ...segment,
    words,
    text: words.map((w) => w.text).join('')
  };
}

/** Current word index inside a segment, or -1. */
export function activeWordIndex(segment: ResolvedSegment): number {
  return segment.words.findIndex((w) => w.isActive);
}

export function formatTime(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const cs = Math.floor((t % 1) * 100);
  return `${m}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}
