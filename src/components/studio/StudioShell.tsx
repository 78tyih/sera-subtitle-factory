'use client';

import { useRef } from 'react';
import { useCaptionStore } from '@/store/caption-store';
import { Sidebar } from '@/components/studio/Sidebar';
import { Inspector } from '@/components/inspector/Inspector';
import { Timeline, useCurrentWords } from '@/components/timeline/Timeline';
import { CaptionStage, ASPECT } from '@/components/preview/CaptionStage';
import { usePlayback, useStageWidth } from '@/lib/hooks';
import { allTranscripts } from '@/store/caption-store';
import { Btn, Segmented } from '@/components/ui';
import type { AspectRatio } from '@/types/caption';

export function StudioShell() {
  const s = useCaptionStore();
  const words = useCurrentWords();
  const { time, seek, restart } = usePlayback(s.duration, s.playing);

  const stageBox = useRef<HTMLDivElement>(null);
  const aspect = s.aspect;
  const ratio = ASPECT[aspect];
  const width = useStageWidth(stageBox, ratio);

  return (
    <div className="flex h-[calc(100vh-52px)] overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ---------------------------------------------------- top bar */}
        <header className="flex h-[54px] shrink-0 items-center gap-2.5 border-b border-line bg-panel px-4">
          <select
            value={s.transcriptId}
            onChange={(e) => s.setTranscript(e.target.value)}
            className="rounded-[9px] border border-line bg-[#111113] px-2.5 py-1.5 text-[11.5px] text-ink outline-none hover:border-line2"
          >
            {allTranscripts.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <Segmented
            size="sm"
            options={(['9:16', '16:9', '1:1', '4:5'] as AspectRatio[]).map((a) => ({ value: a, label: a }))}
            value={aspect}
            onChange={(v) => s.setAspect(v as AspectRatio)}
          />

          <button
            onClick={s.toggleSafeArea}
            className={['rounded-[8px] border px-2.5 py-1.5 text-[11px] transition-all duration-150 ease-out', s.showSafeArea ? 'border-ink bg-[#232326] text-ink' : 'border-line text-ink2 hover:bg-[#1a1a1c]'].join(' ')}
          >
            Safe area
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Btn size="sm" onClick={s.undo} disabled={!s.past.length} title="Undo">Undo</Btn>
            <Btn size="sm" onClick={s.redo} disabled={!s.future.length} title="Redo">Redo</Btn>
            <span className="mx-1 h-4 w-px bg-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{s.recipe.name}</span>
            <Btn size="sm" variant="primary" onClick={() => s.saveRecipe()}>Save Recipe</Btn>
          </div>
        </header>

        {/* ---------------------------------------------------- center + right */}
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div ref={stageBox} className="flex min-h-0 flex-1 items-center justify-center p-6">
              <CaptionStage
                recipe={s.recipe}
                words={words}
                time={time}
                aspect={aspect}
                width={width}
                showSafeArea={s.showSafeArea}
                backdrop="finance"
                className="shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
              />
            </div>

            {/* playback controls — deliberately few (spec §29) */}
            <div className="flex shrink-0 items-center justify-center gap-3 border-t border-line bg-panel py-2.5">
              <Btn size="sm" onClick={restart} title="Restart">⟲</Btn>
              <button
                onClick={s.togglePlaying}
                className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[13px] text-[#0b0b0c] transition-transform duration-150 ease-out hover:scale-105"
                title={s.playing ? 'Pause' : 'Play'}
              >
                {s.playing ? '❚❚' : '▶'}
              </button>
              <span className="font-mono text-[10.5px] text-muted">
                {time.toFixed(2)}s / {s.duration.toFixed(2)}s
              </span>
            </div>
          </div>

          <Inspector />
        </div>

        <Timeline time={time} duration={s.duration} onSeek={seek} />
      </div>
    </div>
  );
}
