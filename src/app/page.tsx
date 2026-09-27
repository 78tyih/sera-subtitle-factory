'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { presets, signaturePresets, signatureCount } from '@/presets';
import { families } from '@/styles/families';
import { DemoTile } from '@/components/preview/DemoTile';
import { useCaptionStore } from '@/store/caption-store';
import { useI18n } from '@/lib/i18n';
import { fontOptions } from '@/caption-engine/typography/fonts';
import { rhythmPresetTable } from '@/types/caption-v2';
import { synthesizeWords } from '@/lib/demo-transcripts';
import type { CaptionRecipe, FontKey, WordMotionName } from '@/types/caption';

const EASE = [0.16, 1, 0.3, 1] as const;
const rise = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay: d, ease: EASE }
});

/**
 * PART H §59 — the hero loops ONE line and only the style changes, so the
 * difference you see is the visual language, not a different sentence.
 * The line carries a number so Data / Tech styles can show their emphasis.
 */
const HERO_LINE = '成交量增长了 35%，记住这一件事。';
const heroWords = synthesizeWords(HERO_LINE);

const HERO: Array<{ label: string; id: string }> = [
  { label: 'Creator', id: 'sera-m-creator-impact' },
  { label: 'Editorial', id: 'sera-m-editorial-serif' },
  { label: 'Data', id: 'sera-number-hero' },
  { label: 'Tech', id: 'sera-mono-terminal' },
  { label: 'Minimal', id: 'sera-m-clean-spoken' }
];

const WORD_MOTIONS: WordMotionName[] = ['highlight', 'pop', 'weightShift', 'karaoke', 'glow', 'float'];
const HIGHLIGHTS = ['#FFD400', '#4F8CFF', '#FFFFFF', '#35D07F', '#E63946'];
const BACKGROUNDS = ['none', 'black80', 'white92', 'glass'] as const;
const RHYTHMS = ['creator', 'editorial', 'data', 'podcast'] as const;

export default function HomePage() {
  const { t, lang } = useI18n();
  const zh = lang === 'zh';
  const applyPreset = useCaptionStore((s) => s.usePreset);
  const patchRecipe = useCaptionStore((s) => s.patchRecipe);

  const [heroIdx, setHeroIdx] = useState(0);
  const hero = useMemo(
    () => (presets.find((p) => p.id === HERO[heroIdx].id) ?? signaturePresets[0]) as CaptionRecipe,
    [heroIdx]
  );

  /* the six families that already have a V2.3 master */
  const showcase = families.filter((f) => f.masterId && !f.planned).slice(0, 6);

  /* ---------------- configurator (PART H §63) ---------------- */
  const base = useMemo(
    () => (presets.find((p) => p.id === 'sera-m-creator-impact') ?? signaturePresets[0]) as CaptionRecipe,
    []
  );
  const [cfg, setCfg] = useState({
    font: base.typography.fontFamily as FontKey,
    highlight: HIGHLIGHTS[0],
    background: 'none' as (typeof BACKGROUNDS)[number],
    motion: 'highlight' as WordMotionName,
    rhythm: 'creator' as (typeof RHYTHMS)[number]
  });

  const cfgRecipe = useMemo<CaptionRecipe>(
    () => ({
      ...base,
      typography: { ...base.typography, fontFamily: cfg.font },
      text: { ...base.text, active: cfg.highlight, keyword: cfg.highlight, number: cfg.highlight },
      activeWord: { ...base.activeWord, color: cfg.highlight },
      number: { ...base.number, color: cfg.highlight },
      emphasis: { ...base.emphasis, numberColor: cfg.highlight },
      background: { ...base.background, type: cfg.background },
      motion: { ...base.motion, word: { ...base.motion.word, type: cfg.motion } },
      rhythm: rhythmPresetTable[cfg.rhythm]
    }),
    [base, cfg]
  );

  const openInStudio = () => {
    applyPreset(base.id);
    patchRecipe({
      typography: { fontFamily: cfg.font },
      text: { active: cfg.highlight, keyword: cfg.highlight, number: cfg.highlight },
      activeWord: { color: cfg.highlight },
      emphasis: { numberColor: cfg.highlight },
      background: { type: cfg.background },
      motion: { word: { type: cfg.motion } },
      rhythm: rhythmPresetTable[cfg.rhythm]
    } as never);
    window.location.href = '/studio/';
  };

  const picker = (label: string, children: React.ReactNode) => (
    <div>
      <div className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );

  const chip = (on: boolean, onClick: () => void, children: React.ReactNode, color?: string) => (
    <button
      key={String(children)}
      onClick={onClick}
      className={[
        'rounded-[8px] border px-2.5 py-1.5 text-[11.5px] transition-all duration-150 ease-out',
        on ? 'border-ink bg-chip text-ink' : 'border-line2 text-ink2 hover:bg-hover hover:text-ink'
      ].join(' ')}
      style={color ? { borderColor: on ? color : undefined, color: on ? color : undefined } : undefined}
    >
      {children}
    </button>
  );

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-14">
      {/* ---------------- hero ---------------- */}
      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p {...rise(0)} className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
            Sera Captions
          </motion.p>
          <motion.h1
            {...rise(0.06)}
            className="mt-4 text-[42px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink md:text-[52px]"
          >
            {t('home.title' as never)
              .split('\n')
              .map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
          </motion.h1>
          <motion.p {...rise(0.12)} className="mt-5 max-w-[460px] text-[14.5px] leading-relaxed text-ink2">
            {t('home.subtitle' as never)}
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/studio/"
              className="rounded-[10px] bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('home.cta.studio' as never)}
            </Link>
            <Link
              href="/library/"
              className="rounded-[10px] border border-line2 px-5 py-2.5 text-[13px] text-ink2 transition-colors duration-150 ease-out hover:bg-hover hover:text-ink"
            >
              {t('home.cta.library' as never)}
            </Link>
          </motion.div>

          <motion.p {...rise(0.24)} className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            {t('home.stat.families' as never)} · {signatureCount} {t('home.stat.signature' as never)} ·{' '}
            {t('home.stat.variations' as never)}
          </motion.p>
          <motion.p {...rise(0.28)} className="mt-2 text-[11px] text-muted">
            {t('app.powered' as never)}
          </motion.p>
        </div>

        <motion.div {...rise(0.1)}>
          <DemoTile
            recipe={hero}
            words={heroWords}
            width={520}
            autoplay
            showContextLabel
            className="overflow-hidden rounded-[14px] shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">
              {t('home.switchHint' as never)}
            </span>
            {HERO.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setHeroIdx(i)}
                className={[
                  'rounded-[8px] border px-2.5 py-1.5 text-[11.5px] transition-all duration-150 ease-out',
                  i === heroIdx ? 'border-ink bg-chip text-ink' : 'border-line2 text-ink2 hover:bg-hover hover:text-ink'
                ].join(' ')}
              >
                {h.label}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---------------- families ---------------- */}
      <section className="mt-24">
        <motion.h2 {...rise()} className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
          {t('home.familiesTitle' as never)}
        </motion.h2>
        <motion.p {...rise(0.04)} className="mt-2 text-[13px] text-muted">
          {t('home.familiesSubtitle' as never)}
        </motion.p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((f, i) => {
            const master = (signaturePresets.find((p) => p.id === f.masterId) ?? signaturePresets[0]) as CaptionRecipe;
            return (
              <motion.div key={f.key} {...rise(i * 0.05)}>
                <Link
                  href={`/library/${f.key}/`}
                  className="group block overflow-hidden rounded-[14px] border border-line bg-panel transition-all duration-200 ease-out hover:border-line2"
                >
                  <DemoTile recipe={master} width={360} showContextLabel className="overflow-hidden rounded-t-[14px]" />
                  <div className="flex items-baseline justify-between px-3 py-3">
                    <div>
                      <div className="text-[13px] font-medium text-ink">{f.name}</div>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{f.nameZh}</div>
                    </div>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{f.contexts[0]}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------- workflow: a diagram, not a sentence (PART H §62) ---------------- */}
      <section className="mt-24">
        <motion.h2 {...rise()} className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
          {zh ? '声音进来，字幕出去。' : 'Voice in. Caption out.'}
        </motion.h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { k: 'Voice', zh: '语音' },
            { k: 'Transcript', zh: '转写' },
            { k: 'Rhythm', zh: '节奏' },
            { k: 'Style', zh: '样式' },
            { k: 'Motion', zh: '动效' },
            { k: 'Export', zh: '导出' }
          ].map((step, i) => (
            <motion.div key={step.k} {...rise(i * 0.04)} className="relative">
              <div className="rounded-[12px] border border-line bg-panel px-3 py-4 text-center">
                <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mt-1.5 text-[13px] font-medium text-ink">{step.k}</div>
                <div className="text-[11px] text-muted">{step.zh}</div>
              </div>
              {i < 5 && (
                <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-[11px] text-muted lg:block">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p {...rise(0.1)} className="mt-6 max-w-[560px] text-[13px] leading-relaxed text-muted">
          {zh
            ? '语音驱动意味着：字幕不是贴在画面上的文字，而是跟着声音的节奏出现、强调、离开。'
            : 'Speech-driven means a caption is not text pasted on a frame — it arrives, emphasises and leaves with the rhythm of the voice.'}
        </motion.p>
      </section>

      {/* ---------------- configurator: real controls, live preview (PART H §63) ---------------- */}
      <section className="mt-24 rounded-[18px] border border-line bg-panel p-7">
        <motion.h2 {...rise()} className="text-[18px] font-semibold tracking-[-0.02em] text-ink">
          Build your own caption language
        </motion.h2>
        <motion.p {...rise(0.04)} className="mt-2 text-[13px] text-muted">
          Font × Highlight × Background × Motion × Rhythm
        </motion.p>

        <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <motion.div {...rise(0.06)}>
            <DemoTile
              recipe={cfgRecipe}
              words={heroWords}
              width={640}
              autoplay
              showContextLabel
              className="overflow-hidden rounded-[12px] border border-line"
            />
          </motion.div>

          <motion.div {...rise(0.1)} className="flex flex-col gap-5">
            {picker(
              'Font',
              fontOptions.slice(0, 6).map((f) =>
                chip(cfg.font === f.key, () => setCfg({ ...cfg, font: f.key }), f.label)
              )
            )}

            {picker(
              'Highlight',
              HIGHLIGHTS.map((c) =>
                chip(cfg.highlight === c, () => setCfg({ ...cfg, highlight: c }), c, c)
              )
            )}

            {picker(
              'Background',
              BACKGROUNDS.map((b) => chip(cfg.background === b, () => setCfg({ ...cfg, background: b }), b))
            )}

            {picker('Motion', WORD_MOTIONS.map((m) => chip(cfg.motion === m, () => setCfg({ ...cfg, motion: m }), m)))}

            {picker('Rhythm', RHYTHMS.map((r) => chip(cfg.rhythm === r, () => setCfg({ ...cfg, rhythm: r }), r)))}

            <button
              onClick={openInStudio}
              className="mt-1 rounded-[10px] bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
            >
              {zh ? '在 Studio 里继续' : 'Continue in Studio'}
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
