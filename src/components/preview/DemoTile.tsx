'use client';

import { useState } from 'react';
import type { AspectRatio, CaptionRecipe, WordTimestamp } from '@/types/caption';
import { CaptionStage } from './CaptionStage';
import { usePlayback } from '@/lib/hooks';

/**
 * DemoTile — a self-contained caption demo.
 *  · Library: plays on hover (spec §64)
 *  · Home: loops automatically (spec §55)
 */
export function DemoTile({
  recipe,
  words,
  width,
  aspect = '16:9',
  autoplay = false,
  animate = true,
  showSafeArea = false,
  className = ''
}: {
  recipe: CaptionRecipe;
  words: WordTimestamp[];
  width: number;
  aspect?: AspectRatio;
  autoplay?: boolean;
  animate?: boolean;
  showSafeArea?: boolean;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  const duration = words.length ? words[words.length - 1].end + 0.6 : 4;
  const playing = autoplay || hover;
  const { time } = usePlayback(duration, playing);

  /* frozen frame sits on an active word so the thumbnail never looks dead */
  const frozen = duration * 0.44;
  const t = playing ? time : frozen;

  return (
    <div className={className} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <CaptionStage recipe={recipe} words={words} time={t} aspect={aspect} width={width} animate={animate && playing} showSafeArea={showSafeArea} backdrop="finance" />
    </div>
  );
}
