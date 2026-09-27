'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { AspectRatio, CaptionRecipe, WordTimestamp } from '@/types/caption';
import { CaptionRenderer } from '@/caption-engine/renderer/CaptionRenderer';
import { findSegment, resolveSegment } from '@/caption-engine/resolve';
import { useSegments } from '@/lib/hooks';
import { previewContexts, DEFAULT_CONTEXT, type PreviewContextKey } from '@/preview-contexts';

export const ASPECT: Record<AspectRatio, number> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '9:16': 9 / 16,
  '4:5': 4 / 5
};

export interface CaptionStageProps {
  recipe: CaptionRecipe;
  words: WordTimestamp[];
  time: number;
  aspect?: AspectRatio;
  /** rendered width in CSS px */
  width: number;
  showSafeArea?: boolean;
  animate?: boolean;
  /** PART G — render inside one of the nine demo contexts */
  context?: PreviewContextKey;
  /** legacy flag, kept so old call sites still compile */
  backdrop?: 'plain' | 'finance' | 'none';
  /** optional on-frame label (context name) */
  showContextLabel?: boolean;
  className?: string;
}

export function CaptionStage({
  recipe,
  words,
  time,
  aspect = '16:9',
  width,
  showSafeArea = false,
  animate = true,
  context,
  backdrop = 'finance',
  showContextLabel = false,
  className = ''
}: CaptionStageProps) {
  const { segments, scales } = useSegments(words, recipe);

  /* The stage is fluid: `width` is the DESIGN width, but the rendered box never
     exceeds its container — so a 640px stage on a 390px phone shrinks instead of
     pushing the page sideways (the caption scales with it, one line stays one
     line). */
  const boxRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(width);
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) setMeasured(Math.min(w, width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const w = Math.min(measured || width, width);
  const height = Math.round(w / ASPECT[aspect]);

  const segment = useMemo(() => {
    const raw = findSegment(segments, time);
    return raw ? resolveSegment(raw, recipe, time) : null;
  }, [segments, recipe, time]);

  const scale = segment ? scales[segment.id] ?? 1 : 1;

  const ctx = context ? previewContexts[context] : null;
  const surface = ctx ? ctx.background : undefined;

  /* legacy finance chart backdrop only when no context is supplied */
  const useLegacy = !ctx && backdrop !== 'none';

  return (
    <div
      ref={boxRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: '100%',
        maxWidth: width,
        aspectRatio: `${ASPECT[aspect]}`,
        borderRadius: 10,
        background: surface ?? '#000'
      }}
    >
      {useLegacy && <Backdrop variant={backdrop} width={w} height={height} />}
      {ctx && showContextLabel && (
        <div className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: ctx.label }}>
          {ctx.name}
        </div>
      )}
      <CaptionRenderer
        recipe={recipe}
        segment={segment}
        width={w}
        height={height}
        segmentScale={scale}
        showSafeArea={showSafeArea}
        animate={animate}
      />
    </div>
  );
}

/** Demo "video frame" — the old flat black + one quiet price line. Kept as a fallback. */
function Backdrop({ variant, width, height }: { variant: 'plain' | 'finance'; width: number; height: number }) {
  if (variant === 'plain') {
    return <div className="absolute inset-0 bg-sunken" />;
  }
  const h = height;
  const w = width;
  const path = `M0 ${h * 0.62} L${w * 0.12} ${h * 0.58} L${w * 0.22} ${h * 0.66} L${w * 0.34} ${h * 0.52} L${w * 0.46} ${h * 0.57} L${w * 0.58} ${h * 0.44} L${w * 0.7} ${h * 0.49} L${w * 0.82} ${h * 0.36} L${w} ${h * 0.4}`;
  return (
    <div className="absolute inset-0 bg-stage">
      <svg width={w} height={h} className="absolute inset-0">
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={0} x2={w} y1={(h / 7) * i + 20} y2={(h / 7) * i + 20} stroke="rgba(255,255,255,0.028)" strokeWidth={1} />
        ))}
        <path d={path} fill="none" stroke="rgba(120,150,200,0.16)" strokeWidth={2} />
        <path d={`${path} L${w} ${h} L0 ${h} Z`} fill="rgba(120,150,200,0.028)" stroke="none" />
      </svg>
      <div className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
        DEMO FRAME
      </div>
    </div>
  );
}

export const DEFAULT_PREVIEW_CONTEXT = DEFAULT_CONTEXT;
