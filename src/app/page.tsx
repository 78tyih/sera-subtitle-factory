'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { flagshipPresets, presets } from '@/presets';
import { getTranscript } from '@/lib/demo-transcripts';
import { CaptionStage } from '@/components/preview/CaptionStage';
import { DemoTile } from '@/components/preview/DemoTile';
import { useI18n } from '@/lib/i18n';
import { LangToggle, ThemeToggle } from '@/components/ui/display-controls';
import type { CaptionRecipe } from '@/types/caption';

/**
 * Home — asymmetric hero + a UNIFORM grid of caption showcases.
 * Every card is 16:9, every card runs the SAME neutral line
 * ("让每一个字都跟着声音动起来"), so the grid shows how one line reads
 * across twelve different styles. Nothing finance-related.
 */

const SHOWCASE = [
  'sera-finance-yellow',
  'sera-editorial',
  'sera-left-bar',
  'sera-karaoke-yellow',
  'sera-number-hero',
  'sera-quote-serif',
  'sera-tech-blue-bar',
  'sera-marker-yellow',
  'sera-glass-soft',
  'sera-outline-hollow',
  'sera-editorial-inverse',
  'sera-mono-terminal'
];

const EASE = [0.16, 1, 0.3, 1] as const;
const rise = (d: number) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, delay: d, ease: EASE }
});

export default function HomePage() {
  const { t, lang } = useI18n();
  const words = getTranscript('demo-finance').words; // "让每一个字都跟着声音动起来"
  const hero = presets.find((p) => p.id === 'sera-finance-yellow')!;
  const nameOf = (p: CaptionRecipe) => (lang === 'zh' ? p.nameZh ?? p.name : p.name);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-14">
      {/* ------------------------------------------------------------ hero */}
      <section className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p {...rise(0)} className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
            {t('home.kicker')}
          </motion.p>
          <motion.h1
            {...rise(0.06)}
            className="text-[44px] font-semibold leading-[1.06] tracking-[-0.035em] text-ink md:text-[56px]"
          >
            {t('home.title')
              .split('\n')
              .map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
          </motion.h1>
          <motion.p {...rise(0.12)} className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-ink2">
            {t('home.subtitle')}
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/studio"
              className="rounded-[10px] bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('home.cta.studio')}
            </Link>
            <Link
              href="/library"
              className="rounded-[10px] border border-line2 px-5 py-2.5 text-[13px] text-ink2 transition-colors duration-150 ease-out hover:bg-hover hover:text-ink"
            >
              {t('home.cta.library')}
            </Link>
            <div className="ml-1 flex items-center gap-1.5">
              <ThemeToggle />
              <LangToggle />
            </div>
          </motion.div>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            <span>{t('home.stat.presets')}</span>
            <span>{t('home.stat.motions')}</span>
            <span>{t('home.stat.singleLine')}</span>
            <span>{t('home.stat.numbers')}</span>
          </motion.div>
        </div>

        <motion.div {...rise(0.12)} className="md:pl-6">
          <CaptionStage
            recipe={hero}
            words={words}
            time={words[3]?.start ?? 1}
            width={400}
            showSafeArea={false}
            backdrop="finance"
            animate={false}
            className="overflow-hidden rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          />
          <p className="mt-2.5 text-[11px] text-muted">
            {nameOf(hero)} · {hero.category}
          </p>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------ uniform showcase grid */}
      <section className="mt-20">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">{t('home.demos.title')}</h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">{t('home.demos.hint')}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE.map((id, i) => {
            const recipe = presets.find((p) => p.id === id)!;
            return (
              <motion.div key={id} {...rise((i % 3) * 0.08)}>
                <Link href={`/studio?preset=${id}`} className="group block">
                  <DemoTile
                    recipe={recipe}
                    words={words}
                    width={360}
                    aspect="16:9"
                    autoplay
                    className="overflow-hidden rounded-[10px] shadow-[0_14px_40px_rgba(0,0,0,0.42)] transition-transform duration-200 ease-out group-hover:-translate-y-[3px]"
                  />
                  <div className="mt-2.5 flex items-baseline justify-between gap-2">
                    <span className="text-[12px] text-ink2 transition-colors duration-150 ease-out group-hover:text-ink">{nameOf(recipe)}</span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{recipe.motion.word.type}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ principles */}
      <section className="mt-20 grid gap-5 md:grid-cols-3">
        {([1, 2, 3] as const).map((i) => (
          <motion.div key={i} {...rise(i * 0.08)} className="rounded-[14px] border border-line bg-panel p-5">
            <h3 className="text-[13.5px] font-medium text-ink">{t(`home.principle.${i}.t` as never)}</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">{t(`home.principle.${i}.d` as never)}</p>
          </motion.div>
        ))}
      </section>

      {/* ------------------------------------------------------------ flagship */}
      <section className="mt-20">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">{t('home.flagship.title')}</h2>
          <Link href="/library" className="text-[12px] text-accent hover:underline">
            {t('home.browseAll')}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {flagshipPresets.map((p) => (
            <Link key={p.id} href={`/studio?preset=${p.id}`} className="group">
              <DemoTile recipe={p} words={words} width={268} aspect="16:9" autoplay className="overflow-hidden rounded-[10px] shadow-[0_14px_40px_rgba(0,0,0,0.42)] transition-transform duration-200 ease-out group-hover:-translate-y-[3px]" />
              <div className="mt-2.5 text-[12px] text-ink2 transition-colors duration-150 ease-out group-hover:text-ink">{nameOf(p)}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
