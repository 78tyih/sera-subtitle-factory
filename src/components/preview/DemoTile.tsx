'use client';

import { useState } from 'react';
import type { CaptionRecipe, WordTimestamp } from '@/types/caption';
import { CaptionStage } from './CaptionStage';
import { usePlayback } from '@/lib/hooks';
import { familyOfPreset } from '@/styles/families';
import { synthesizeWords } from '@/lib/demo-transcripts';
import type { PreviewContextKey } from '@/preview-contexts';

/**
 * DemoTile — a caption shown inside its own PreviewContext (PART G) with the
 * family's own demo line (PART T). Hovering plays the motion.
 */
export function DemoTile({
  recipe,
  words,
  width = 360,
  aspect = '16:9',
  autoplay = false,
  context,
  showContextLabel = false,
  className = ''
}: {
  recipe: CaptionRecipe;
  words?: WordTimestamp[];
  width?: number;
  aspect?: '16:9' | '4:3' | '1:1' | '9:16' | '4:5';
  autoplay?: boolean;
  context?: PreviewContextKey;
  showContextLabel?: boolean;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  const fam = familyOfPreset(recipe.id);
  const ctxKey = context ?? fam?.contexts[0] ?? 'creator';
  const demoWords = words ?? synthesizeWords(fam?.demoText ?? '让每一个字，都跟着声音动起来。');
  const duration = demoWords.length ? demoWords[demoWords.length - 1].end + 0.8 : 5;
  const { time } = usePlayback(duration, autoplay || hover);

  return (
    <div className={className} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <CaptionStage
        recipe={recipe}
        words={demoWords}
        time={time}
        aspect={aspect}
        width={width}
        animate={autoplay || hover}
        context={ctxKey}
        showContextLabel={showContextLabel}
      />
    </div>
  );
}
