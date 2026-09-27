'use client';

import { useEffect, useRef, useState } from 'react';
import { useCaptionStore, allTranscripts } from '@/store/caption-store';
import { Sidebar } from '@/components/studio/Sidebar';
import { Inspector } from '@/components/inspector/Inspector';
import { Timeline, useCurrentWords } from '@/components/timeline/Timeline';
import { CaptionStage, ASPECT } from '@/components/preview/CaptionStage';
import { AiPanel } from '@/components/studio/AiPanel';
import { usePlayback, useSegments, useStageWidth } from '@/lib/hooks';
import { Btn, Field, IconBtn, Panel, RatioIcon, Segmented, Slider, Swatches } from '@/components/ui';
import { exportCaptions, type ExportKind } from '@/lib/export-captions';
import { useI18n } from '@/lib/i18n';
import type { AspectRatio } from '@/types/caption';
import { fontOptions } from '@/caption-engine/typography/fonts';
import { wordMotionNames } from '@/caption-engine/motions';
import { signaturePresets, presets, masterIds } from '@/presets';

const RATIOS: AspectRatio[] = ['16:9', '4:3', '1:1', '9:16'];

/** PART J §68 — the five-step workflow. Style is the default (§69). */
const STEPS = [
  { id: 'media', zh: '素材', en: 'Media' },
  { id: 'transcript', zh: '转写', en: 'Transcript' },
  { id: 'style', zh: '样式', en: 'Style' },
  { id: 'refine', zh: '精调', en: 'Refine' },
  { id: 'export', zh: '导出', en: 'Export' }
] as const;

type StepId = (typeof STEPS)[number]['id'];

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
  const [speed, setSpeed] = useState(1);
  const { time, seek, restart } = usePlayback(s.duration, s.playing, undefined, speed);
  const { segments } = useSegments(words, s.recipe);

  /* PART J §69 — a new user lands on STYLE, not on a wall of parameters */
  const [step, setStep] = useState<StepId>('style');
  const [level, setLevel] = useState<'basic' | 'advanced'>('basic');

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
        {/* ------------------------------------------- 01–05 workflow */}
        <div className="flex h-[46px] shrink-0 items-center gap-1 overflow-x-auto border-b border-line bg-panel px-4">
          {STEPS.map((st, i) => {
            const on = step === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStep(st.id)}
                className={[
                  'flex shrink-0 items-center gap-1.5 rounded-[8px] border px-2.5 py-1.5 text-[11.5px] transition-all duration-150 ease-out',
                  on ? 'border-ink bg-chip text-ink' : 'border-line2 text-ink2 hover:bg-hover hover:text-ink'
                ].join(' ')}
              >
                <span className="font-mono text-[9.5px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                {lang === 'zh' ? st.zh : st.en}
              </button>
            );
          })}
          <span className="ml-auto shrink-0 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
            {lang === 'zh' ? '先选样式，再精调' : 'browse → choose → customize'}
          </span>
        </div>

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

            {/* PART J §70 — the five knobs people reach for first */}
            <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-t border-line bg-panel px-4 py-2.5">
              <label className="flex items-center gap-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Font</span>
                <select
                  value={s.recipe.typography.fontFamily}
                  onChange={(e) => s.patchRecipe({ typography: { fontFamily: e.target.value as never } })}
                  className="rounded-[8px] border border-line bg-panel2 px-2 py-1 text-[11.5px] text-ink outline-none hover:border-line2"
                >
                  {fontOptions.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </label>

              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Highlight</span>
                <Swatches
                  colors={['#FFD400', '#4F8CFF', '#FFFFFF', '#35D07F', '#E63946']}
                  value={s.recipe.activeWord.color ?? s.recipe.text.active}
                  onChange={(c) =>
                    s.patchRecipe({
                      text: { active: c, keyword: c, number: c },
                      activeWord: { color: c },
                      number: { color: c },
                      emphasis: { numberColor: c }
                    })
                  }
                />
              </div>

              <label className="flex items-center gap-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Motion</span>
                <select
                  value={s.recipe.motion.word.type}
                  onChange={(e) => s.patchRecipe({ motion: { word: { type: e.target.value as never } } })}
                  className="rounded-[8px] border border-line bg-panel2 px-2 py-1 text-[11.5px] text-ink outline-none hover:border-line2"
                >
                  {wordMotionNames.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Size</span>
                <input
                  type="range"
                  min={40}
                  max={110}
                  step={2}
                  value={s.recipe.typography.fontSize}
                  onChange={(e) => s.patchRecipe({ typography: { fontSize: Number(e.target.value) } })}
                  className="w-[92px] accent-ink"
                />
                <span className="w-[34px] font-mono text-[10.5px] text-ink2">{s.recipe.typography.fontSize}</span>
              </label>

              <label className="flex items-center gap-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Position</span>
                <input
                  type="range"
                  min={0.05}
                  max={0.45}
                  step={0.005}
                  value={s.recipe.layout.yOffset}
                  onChange={(e) => s.patchRecipe({ layout: { yOffset: Number(e.target.value) } })}
                  className="w-[92px] accent-ink"
                />
                <span className="w-[36px] font-mono text-[10.5px] text-ink2">
                  {(s.recipe.layout.yOffset * 100).toFixed(0)}%
                </span>
              </label>
            </div>

            <div className="flex shrink-0 items-center justify-center gap-4 border-t border-line bg-panel py-2.5">
              <IconBtn title={t('ui.restart')} onClick={restart}>
                {ICON.restart}
              </IconBtn>
              <button
                onClick={s.togglePlaying}
                title={s.playing ? t('ui.pause') : t('ui.play')}
                className="grid h-12 w-12 place-items-center rounded-full bg-ink text-bg transition-transform duration-150 ease-out hover:scale-105 active:scale-[0.98]"
              >
                {s.playing ? ICON.pause : ICON.play}
              </button>
              <button
                onClick={() => setSpeed((v) => (v === 1 ? 0.5 : v === 0.5 ? 2 : 1))}
                title={t('ui.speed')}
                className="min-w-[46px] rounded-[10px] px-2 py-1.5 font-mono text-[11px] text-ink2 transition-all duration-150 ease-out hover:bg-hover hover:text-ink"
              >
                {speed}×
              </button>
              <span className="font-mono text-[11px] text-muted">
                {time.toFixed(2)} / {s.duration.toFixed(2)}s
              </span>
            </div>
          </div>

          {/* 03 Style = browse → choose → customize (PART J §69) */}
          {step === 'style' && <StyleBrowser onCustomize={() => setStep('refine')} />}
          {step === 'refine' && (
            <Inspector
              level={level}
              onLevel={(l) => {
                setLevel(l);
                /* advanced = parameters, so leave the template list behind */
                if (l === 'advanced' && s.tab === 'templates') s.setTab('typography');
              }}
            />
          )}
          {(step === 'media' || step === 'transcript' || step === 'export') && <StepPanel step={step} onExport={doExport} onSave={() => s.saveRecipe()} />}
        </div>

        <Timeline time={time} duration={s.duration} onSeek={seek} />
      </div>

      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

/**
 * Step panels for 01 Media · 02 Transcript · 05 Export (PART J §68).
 * Anything not built yet says so plainly — no fake upload button.
 */
function StepPanel({
  step,
  onExport,
  onSave
}: {
  step: 'media' | 'transcript' | 'export';
  onExport: (k: ExportKind) => void;
  onSave: () => void;
}) {
  const { t, lang } = useI18n();
  const s = useCaptionStore();
  const zh = lang === 'zh';
  const words = useCurrentWords();

  return (
    <aside className="w-[336px] shrink-0 overflow-y-auto border-l border-line bg-panel p-3">
      {step === 'media' && (
        <>
          <Panel title={zh ? '画幅' : 'Frame'}>
            <Segmented
              size="sm"
              options={RATIOS.map((a) => ({ value: a, label: <RatioIcon ratio={a} />, title: a }))}
              value={s.aspect}
              onChange={(v) => s.setAspect(v as AspectRatio)}
            />
          </Panel>
          <Panel title={zh ? '视频素材' : 'Media'}>
            <p className="text-[11.5px] leading-relaxed text-muted">
              {zh
                ? '上传视频属于 Phase 2。当前用内置示例转写驱动字幕，样式、节奏、动效与导出都是完整的。'
                : 'Video upload is Phase 2. The built-in demo transcript drives the captions today; style, rhythm, motion and export are all fully working.'}
            </p>
          </Panel>
        </>
      )}

      {step === 'transcript' && (
        <>
          <Panel title={zh ? '选择转写' : 'Transcript'}>
            <div className="flex flex-col gap-1.5">
              {allTranscripts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => s.setTranscript(item.id)}
                  className={[
                    'rounded-[10px] border px-3 py-2 text-left text-[12px] transition-all duration-150 ease-out',
                    s.transcriptId === item.id
                      ? 'border-accent/50 bg-accent/10 text-ink'
                      : 'border-line bg-panel2 text-ink2 hover:border-line2 hover:bg-hover'
                  ].join(' ')}
                >
                  {zh ? item.title : item.titleEn}
                </button>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] text-muted">{words.length} words</p>
          </Panel>
          <Panel title={zh ? 'AI 助手' : 'AI helper'}>
            <p className="text-[11.5px] leading-relaxed text-muted">
              {zh
                ? '打开右上角 ✦ 图标，可以用自然语言改样式；未配置 API Key 时走本地规则。'
                : 'Open the ✦ icon in the top bar to change styles in plain language — local rules apply without an API key.'}
            </p>
          </Panel>
        </>
      )}

      {step === 'export' && (
        <>
          <Panel title={t('export.title' as never)}>
            <div className="flex flex-col gap-1.5">
              {(
                [
                  ['json', t('export.json' as never)],
                  ['srt', t('export.srt' as never)],
                  ['vtt', t('export.vtt' as never)],
                  ['ass', t('export.ass' as never)]
                ] as Array<[ExportKind, string]>
              ).map(([kind, label]) => (
                <button
                  key={kind}
                  onClick={() => onExport(kind)}
                  className="flex items-center gap-2 rounded-[10px] border border-line bg-panel2 px-3 py-2 text-left text-[12px] text-ink2 transition-all duration-150 ease-out hover:border-line2 hover:bg-hover hover:text-ink"
                >
                  <span className="w-[34px] font-mono text-[9.5px] uppercase text-muted">{kind}</span>
                  {label}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title={zh ? '配方' : 'Recipe'}>
            <div className="flex flex-wrap gap-2">
              <Btn size="sm" onClick={onSave}>{zh ? '保存配方' : 'Save recipe'}</Btn>
              <Btn size="sm" onClick={() => navigator.clipboard?.writeText(JSON.stringify(s.recipe, null, 2))}>
                {zh ? '复制 JSON' : 'Copy JSON'}
              </Btn>
            </div>
          </Panel>
        </>
      )}
    </aside>
  );
}

/** 03 Style — pick a designed style first, tweak afterwards (PART J §69). */
function StyleBrowser({ onCustomize }: { onCustomize: () => void }) {
  const { t, lang } = useI18n();
  const s = useCaptionStore();
  const [showAll, setShowAll] = useState(false);
  const zh = lang === 'zh';
  const list = showAll ? presets : signaturePresets;

  return (
    <aside className="w-[336px] shrink-0 overflow-y-auto border-l border-line bg-panel p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          {zh ? '选一个样式' : 'Pick a style'}
        </span>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="rounded-[7px] border border-line2 px-2 py-1 text-[10.5px] text-ink2 hover:bg-hover hover:text-ink"
        >
          {showAll ? `${zh ? '全部' : 'All'} ${presets.length}` : `${zh ? '精选' : 'Signature'} ${signaturePresets.length}`}
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {list.map((p) => {
          const on = p.id === s.recipe.id;
          const isMaster = masterIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => s.usePreset(p.id)}
              className={[
                'rounded-[10px] border px-3 py-2 text-left transition-all duration-150 ease-out',
                on ? 'border-accent/50 bg-accent/10' : 'border-line bg-panel2 hover:border-line2 hover:bg-hover'
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[12.5px] font-medium text-ink">{zh ? p.nameZh ?? p.name : p.name}</span>
                {isMaster && (
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-muted">
                    {zh ? '主样式' : 'Master'}
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-muted">
                {zh ? p.description : p.descriptionEn ?? p.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <Btn variant="primary" size="sm" onClick={onCustomize}>
          {zh ? '精调此样式' : 'Customize this style'}
        </Btn>
      </div>
    </aside>
  );
}
