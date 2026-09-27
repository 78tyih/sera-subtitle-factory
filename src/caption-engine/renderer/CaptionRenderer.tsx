'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { CaptionRecipe, ResolvedSegment } from '@/types/caption';
import { WordRenderer } from './WordRenderer';
import { BackgroundRenderer } from './BackgroundRenderer';
import { getEntrance } from '../motions';
import { resolveBackground } from '../backgrounds';

/**
 * CaptionRenderer — composes
 *   segment × words × background × border × motion × layout
 *
 * RULE #1: the text node is `white-space: nowrap` (see globals.css .cap-line).
 * A too-long caption is re-segmented upstream, never wrapped.
 */

export interface CaptionRendererProps {
  recipe: CaptionRecipe;
  segment: ResolvedSegment | null;
  /** stage size in CSS px */
  width: number;
  height: number;
  /** downscale for a lone over-wide token (1 = untouched) */
  segmentScale?: number;
  showSafeArea?: boolean;
  animate?: boolean;
  className?: string;
}

const alignMap = { center: 'center', left: 'flex-start', right: 'flex-end' } as const;

export function CaptionRenderer({
  recipe,
  segment,
  width,
  height,
  segmentScale = 1,
  showSafeArea = false,
  animate = true,
  className
}: CaptionRendererProps) {
  const k = (width / 1080) * segmentScale;
  const bg = resolveBackground(recipe.background);

  const pos = recipe.layout.position;
  const y = recipe.layout.yOffset;
  const padTopBottom = height * (pos === 'middle' ? 0.5 : y);
  const sidePad = (width * (1 - recipe.layout.maxWidth)) / 2;

  const container: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: alignMap[recipe.layout.align],
    paddingLeft: recipe.layout.align === 'center' ? sidePad : width * 0.06,
    paddingRight: recipe.layout.align === 'center' ? sidePad : width * 0.06,
    pointerEvents: 'none'
  };

  if (pos === 'middle') {
    container.top = '50%';
    container.transform = 'translateY(-50%)';
  } else if (pos === 'top') {
    container.top = padTopBottom;
  } else {
    container.bottom = padTopBottom;
  }

  const entrance = getEntrance(recipe.motion.entrance.type, recipe.motion.entrance.duration);

  return (
    <div className={`cap-stage ${className ?? ''}`} style={{ width, height, position: 'absolute', inset: 0 }}>
      {showSafeArea && <SafeArea width={width} height={height} />}

      <div style={container}>
        <div style={{ position: 'relative', maxWidth: width * recipe.layout.maxWidth }}>
          <AnimatePresence mode="wait">
            {segment && (
              <motion.div
                key={segment.id}
                initial={animate ? (entrance.initial as never) : false}
                animate={animate ? (entrance.animate as never) : undefined}
                exit={animate ? (entrance.exit as never) : undefined}
                transition={entrance.transition as never}
                style={{ display: 'flex', justifyContent: alignMap[recipe.layout.align] }}
              >
                <BackgroundRenderer background={recipe.background} border={recipe.border} k={k}>
                  {/* RULE #1 — single line, always */}
                  <span
                    className="cap-line"
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      wordBreak: 'keep-all',
                      overflowWrap: 'normal'
                    }}
                  >
                    {segment.words.map((w, i) => (
                      <span key={w.id}>
                        <WordRenderer word={w} recipe={recipe} k={k} inverseText={bg.needsInverseText} animate={animate} />
                        {i < segment.words.length - 1 && !/^[，。！？、；：,.!?;:]$/.test(segment.words[i + 1].text) ? <span style={{ display: 'inline-block', width: '0.24em' }} /> : ''}
                      </span>
                    ))}
                  </span>
                </BackgroundRenderer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SafeArea({ width, height }: { width: number; height: number }) {
  const band = height * 0.11;
  const line = '1px dashed rgba(255,255,255,0.18)';
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: band, borderTop: line }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: band, borderBottom: line }} />
      <div style={{ position: 'absolute', right: 10, top: band + 6, fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace' }}>
        SAFE AREA
      </div>
    </>
  );
}
