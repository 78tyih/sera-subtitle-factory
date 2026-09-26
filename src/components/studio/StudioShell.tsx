'use client';

import { useEffect, useRef, useState } from 'react';
import { useCaptionStore, allTranscripts } from '@/store/caption-store';
import { Sidebar } from '@/components/studio/Sidebar';
import { Inspector } from '@/components/inspector/Inspector';
import { Timeline, useCurrentWords } from '@/components/timeline/Timeline';
import { CaptionStage, ASPECT } from '@/components/preview/CaptionStage';
import { AiPanel } from '@/components/studio/AiPanel';
import { usePlayback, useSegments, useStageWidth } from '@/lib/hooks';
import { IconBtn, RatioIcon, Segmented } from '@/components/ui';
import { exportCaptions, type ExportKind } from '@/lib/export-captions';
import { useI18n } from '@/lib/i18n';
import type { AspectRatio } from '@/types/caption';

const RATIOS: AspectRatio[] = ['16:9', '4:3', '1:1', '9:16'];

const I = (d: string, w = 14) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICON = {
  undo: I('M9 14L4 9l5-5M4 9h9a7 7 0 010 14H8'),
  redo: I('M15 14l5-5-5-5M20 9h-9a7 7 0 000 14h5'),
  safe: I('M4 6h16v12H4zM4 10h16'),
  save: I('M5 4h11l3 3v13H5zM9 4v5h6'),
  download: I('M12 4v11M7 12l5 5 5-5M5 20h14'),
  sparkle: I('M12 3l1.8 4.9L19 9.6l-4.4 3 .6 5.4-3.2-2.6-3.2 2.6.6-5.4L5 9.6l5.2-1.7z'),
  restart: I('M4 10a8 8 0 1114 5M4 5v5h5'),
  play: I('M7 5l12 7-12 7z'),
  pause: I('M8 5v14M16 5v14')
};

export function StudioShell() {
  const { t, lang } = useI18n();
  const s = useCaptionStore();

  /* home cards link here with ?preset=<id> — apply it once on mount */
  useEffect(() => {
    const pid = new URLSearchParams(window.location.search).get('preset');
    if (pid) useCaptionStore.getState().usePreset(pid);
  }, []);
  const words = useCurrentWords();
  const { time, seek, restart } = usePlayback(s.duration, s.playing);
  const { segments } = useSegments(words, s.recipe);

  const [aiOpen, setAiOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const stageBox = useRef<HTMLDivElement>(null);
  const aspect = s.aspect;
  const width = useStageWidth(stageBox, ASPECT[aspect]);

  const doExport = (kind: ExportKind) => {
    exportCaptions(kind, s.recipe, segments, s.recipe.id);
    setExportOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-52px)] overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ------------------------------------------- top bar — icons first */}
        <header className="flex h-[54px] shrink-0 items-center gap-2 border-b border-line bg-panel px-4">
          <select
            value={s.transcriptId}
            onChange={(e) => s.setTranscript(e.target.value)}
            title={t('studio.transcript')}
            className="max-w-[190px] rounded-[9px] border border-line bg-panel2 px-2.5 py-1.5 text-[11.5px] text-ink outline-none hover:border-line2"
          >
            {allTranscripts.map((item) => (
              <option key={item.id} value={item.id}>
                {lang === 'zh' ? item.title : item.titleEn}
              </option>
            ))}
          </select>

          <Segmented
            size="sm"
            options={RATIOS.map((a) => ({ value: a, label: <RatioIcon ratio={a} />, title: a }))}
            value={aspect}
            onChange={(v) => s.setAspect(v as AspectRatio)}
          />

          <div className="ml-auto flex items-center gap-1.5">
            <IconBtn title={t('ui.safeArea')} active={s.showSafeArea} onClick={s.toggleSafeArea}>
              {ICON.safe}
            </IconBtn>
            <IconBtn title={t('ui.undo')} onClick={s.undo} disabled={!s.past.length}>
              {ICON.undo}
            </IconBtn>
            <IconBtn title={t('ui.redo')} onClick={s.redo} disabled={!s.future.length}>
              {ICON.redo}
            </IconBtn>
            <IconBtn title={t('ui.saveRecipe')} onClick={() => s.saveRecipe()}>
              {ICON.save}
            </IconBtn>

            <div className="relative">
              <IconBtn title={t('export.title')} active={exportOpen} onClick={() => setExportOpen((v) => !v)}>
                {ICON.download}
              </IconBtn>
              {exportOpen && (
                <div className="absolute right-0 top-[38px] z-30 w-[176px] overflow-hidden rounded-[11px] border border-line bg-panel py-1 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                  {(
                    [
                      ['json', t('export.json')],
                      ['srt', t('export.srt')],
                      ['vtt', t('export.vtt')],
                      ['ass', t('export.ass')]
                    ] as Array<[ExportKind, string]>
                  ).map(([kind, label]) => (
                    <button
                      key={kind}
                      onClick={() => doExport(kind)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-ink2 transition-colors duration-150 ease-out hover:bg-hover hover:text-ink"
                    >
                      <span className="w-[30px] font-mono text-[9.5px] uppercase text-muted">{kind}</span>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <IconBtn title={t('ai.open')} active={aiOpen} onClick={() => setAiOpen((v) => !v)}>
              <span className="text-accent">{ICON.sparkle}</span>
            </IconBtn>
          </div>
        </header>

        {/* ------------------------------------------- stage + inspector */}
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

            <div className="flex shrink-0 items-center justify-center gap-3 border-t border-line bg-panel py-2">
              <IconBtn title={t('ui.restart')} onClick={restart}>
                {ICON.restart}
              </IconBtn>
              <button
                onClick={s.togglePlaying}
                title={s.playing ? t('ui.pause') : t('ui.play')}
                className="grid h-10 w-10 place-items-center rounded-full bg-ink text-bg transition-transform duration-150 ease-out hover:scale-105 active:scale-[0.98]"
              >
                {s.playing ? ICON.pause : ICON.play}
              </button>
              <span className="font-mono text-[10.5px] text-muted">
                {time.toFixed(2)} / {s.duration.toFixed(2)}s
              </span>
            </div>
          </div>

          <Inspector />
        </div>

        <Timeline time={time} duration={s.duration} onSeek={seek} />
      </div>

      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
