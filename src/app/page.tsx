'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signaturePresets, presets } from '@/presets';
import { families } from '@/styles/families';
import { DemoTile } from '@/components/preview/DemoTile';
import { useI18n } from '@/lib/i18n';
import type { CaptionRecipe } from '@/types/caption';

const EASE = [0.16, 1, 0.3, 1] as const;
const rise = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay: d, ease: EASE }
});

/** hero switcher — one line, five visual languages */
const HERO: Array<{ label: string; id: string }> = [
  { label: 'Creator', id: 'sera-finance-yellow' },
  { label: 'Editorial', id: 'sera-editorial' },
  { label: 'Data', id: 'sera-number-hero' },
  { label: 'Tech', id: 'sera-mono-terminal' },
  { label: 'Minimal', id: 'sera-minimal-white' }
];

export default function HomePage() {
  const { t, lang } = useI18n();
  const [heroIdx, setHeroIdx] = useState(0);
  const hero = (presets.find((p) => p.id === HERO[heroIdx].id) ?? signaturePresets[0]) as CaptionRecipe;
  const showcase = families.filter((f) => !f.planned).slice(0, 6);

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
              href="/library"
              className="rounded-[10px] border border-line2 px-5 py-2.5 text-[13px] text-ink2 transition-colors duration-150 ease-out hover:bg-hover hover:text-ink"
            >
              {t('home.cta.library' as never)}
            </Link>
          </motion.div>

          <motion.p {...rise(0.24)} className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            {t('home.stat.families' as never)} · {t('home.stat.signature' as never)} · {t('home.stat.variations' as never)}
          </motion.p>
          <motion.p {...rise(0.28)} className="mt-2 text-[11px] text-muted">
            {t('app.powered' as never)}
          </motion.p>
        </div>

        <motion.div {...rise(0.1)}>
          <DemoTile
            recipe={hero}
            width={520}
            autoplay
            showContextLabel
            className="overflow-hidden rounded-[14px] shadow-[0_24px_70px_rgba(0,0,0,0.45)]" />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{t('home.switchHint' as never)}</span>
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
                <Link href="/library" className="group block overflow-hidden rounded-[14px] border border-line bg-panel transition-all duration-200 ease-out hover:border-line2">
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

      {/* ---------------- workflow ---------------- */}
      <section className="mt-24">
        <motion.h2 {...rise()} className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
          Voice → Transcript → Rhythm → Style → Motion → Export
        </motion.h2>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {['Voice', 'Transcript', 'Rhythm', 'Style', 'Motion', 'Export'].map((s, i) => (
            <motion.div key={s} {...rise(i * 0.05)} className="flex items-center gap-2">
              <span className="rounded-[10px] border border-line bg-panel px-3 py-2 text-[12px] text-ink2">{s}</span>
              {i < 5 && <span className="text-muted">→</span>}
            </motion.div>
          ))}
        </div>

        <motion.p {...rise(0.1)} className="mt-6 max-w-[560px] text-[13px] leading-relaxed text-muted">
          {lang === 'zh'
            ? '语音驱动意味着：字幕不是贴在画面上的文字，而是跟着声音的节奏出现、强调、离开。'
            : 'Speech-driven means a caption is not text pasted on a frame — it arrives, emphasises and leaves with the rhythm of the voice.'}
        </motion.p>
      </section>

      {/* ---------------- configurator teaser ---------------- */}
      <section className="mt-24 rounded-[18px] border border-line bg-panel p-7">
        <motion.h2 {...rise()} className="text-[18px] font-semibold tracking-[-0.02em] text-ink">
          Build your own caption language
        </motion.h2>
        <motion.p {...rise(0.04)} className="mt-2 text-[13px] text-muted">
          Font × Highlight × Background × Motion × Rhythm
        </motion.p>

        <div className="mt-5 flex flex-wrap gap-2">
          {['Font', 'Highlight', 'Background', 'Motion', 'Rhythm'].map((k, i) => (
            <motion.span key={k} {...rise(i * 0.04)} className="rounded-[9px] border border-line2 px-3 py-1.5 text-[12px] text-ink2">{k}</motion.span>
          ))}
        </div>

        <motion.div {...rise(0.12)} className="mt-6">
          <Link
            href="/studio/"
            className="inline-block rounded-[10px] bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-transform duration-150 ease-out hover:scale-[1.02]">
            {t('home.cta.studio' as never)}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
