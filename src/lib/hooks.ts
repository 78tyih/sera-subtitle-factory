'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CaptionRecipe, WordTimestamp } from '@/types/caption';
import { segmentWords } from '@/caption-engine/segmenter/singleLine';
import { fontStacks } from '@/caption-engine/typography/fonts';

/** reference canvas: every measurement happens at 1080px wide, then scales. */
export const REF_WIDTH = 1080;

/**
 * Single-line segmentation, recomputed live whenever typography changes.
 * RULE #1 lives here: when the text no longer fits we split the segment,
 * we never allow a second line.
 */
export function useSegments(words: WordTimestamp[], recipe: CaptionRecipe) {
  /* hydration safety: identical markup on server + first client render */
  const [measured, setMeasured] = useState(false);
  useEffect(() => setMeasured(true), []);

  return useMemo(() => {
    const bgPad = recipe.background.type === 'none' ? 0 : recipe.background.paddingX * 2;
    const barPad = recipe.border.type === 'leftBar' ? 14 : 0;
    const maxWidth = REF_WIDTH * recipe.layout.maxWidth - bgPad - barPad;
    return segmentWords(words, {
      fontFamily: fontStacks[recipe.typography.fontFamily],
      /* measure with the heaviest weight we will ever render, so nothing overflows */
      fontWeight: Math.max(recipe.typography.fontWeight, recipe.number.fontWeight, recipe.emphasis.keywordWeight),
      fontSize: recipe.typography.fontSize,
      letterSpacing: recipe.typography.letterSpacing,
      maxWidth,
      gapThreshold: 0.45,
      maxDuration: 4.2
    }, measured);
  }, [words, recipe, measured]);
}

/**
 * Playback clock. Drives `currentTime` at 60fps and loops,
 * so the studio always shows a moving caption (spec §56).
 */
export function usePlayback(duration: number, playing: boolean, onTick?: (t: number) => void) {
  const [time, setTime] = useState(0);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const loop = (now: number) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setTime((t) => {
        const next = t + dt;
        if (next >= duration) {
          tickRef.current?.(0);
          return 0;
        }
        tickRef.current?.(next);
        return next;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, duration]);

  const seek = (t: number) => setTime(Math.max(0, Math.min(duration, t)));
  const restart = () => setTime(0);

  return { time, seek, restart, setTime };
}

/** Pointer drag helper for the timeline scrubber. */
export function useScrub(ref: React.RefObject<HTMLElement>, onScrub: (ratio: number) => void, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let dragging = false;
    const ratio = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    };
    const down = (e: PointerEvent) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      onScrub(ratio(e));
    };
    const move = (e: PointerEvent) => dragging && onScrub(ratio(e));
    const up = (e: PointerEvent) => {
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [ref, onScrub, enabled]);
}

/** Stage width observer — the preview scales the 1080 reference canvas. */
export function useStageWidth<T extends HTMLElement>(ref: React.RefObject<T>, ratio: number) {
  const [w, setW] = useState(360);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      const byWidth = cw;
      const byHeight = ch * ratio;
      setW(Math.max(160, Math.min(byWidth, byHeight)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, ratio]);
  return w;
}
