'use client';

import React, { useMemo } from 'react';
import type { AspectRatio, CaptionRecipe, WordTimestamp } from '@/types/caption';
import { CaptionRenderer } from '@/caption-engine/renderer/CaptionRenderer';
import { findSegment, resolveSegment } from '@/caption-engine/resolve';
import { useSegments } from '@/lib/hooks';

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
  backdrop?: 'plain' | 'finance' | 'none';
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
  backdrop = 'finance',
  className = ''
}: CaptionStageProps) {
  const { segments, scales } = useSegments(words, recipe);
  const height = Math.round(width / ASPECT[aspect]);

  const segment = useMemo(() => {
    const raw = findSegment(segments, time);
    return raw ? resolveSegment(raw, recipe, time) : null;
  }, [segments, recipe, time]);

  const scale = segment ? scales[segment.id] ?? 1 : 1;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height, borderRadius: 10, background: '#000' }}>
      {backdrop !== 'none' && <Backdrop variant={backdrop} width={width} height={height} />}
      <CaptionRenderer
        recipe={recipe}
        segment={segment}
        width={width}
        height={height}
        segmentScale={scale}
        showSafeArea={showSafeArea}
        animate={animate}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- backdrop */

/** Demo "video frame" — flat black + one quiet price line. No cheap gradients. */
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
