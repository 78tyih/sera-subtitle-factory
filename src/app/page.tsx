'use client';

import Link from 'next/link';
import { flagshipPresets, presets } from '@/presets';
import { getTranscript } from '@/lib/demo-transcripts';
import { CaptionStage } from '@/components/preview/CaptionStage';
import { DemoTile } from '@/components/preview/DemoTile';
import { useI18n } from '@/lib/i18n';
import { LangToggle, ThemeToggle } from '@/components/ui/display-controls';
import type { CaptionRecipe } from '@/types/caption';

const HOME_DEMOS: Array<{ presetId: string; transcriptId: string }> = [
  { presetId: 'sera-finance-yellow', transcriptId: 'demo-finance' },
  { presetId: 'sera-finance-blue', transcriptId: 'demo-finance' },
  { presetId: 'sera-editorial', transcriptId: 'demo-podcast' },
  { presetId: 'sera-left-bar', transcriptId: 'demo-podcast' },
  { presetId: 'sera-data-focus', transcriptId: 'demo-numbers' },
  { presetId: 'sera-minimal-black', transcriptId: 'demo-tech' }
];

export default function HomePage() {
  const { t, lang } = useI18n();
  const finance = getTranscript('demo-finance');
  const hero = presets.find((p) => p.id === 'sera-finance-yellow')!;

  const nameOf = (p: CaptionRecipe) => (lang === 'zh' ? p.nameZh ?? p.name : p.name);
  const descOf = (p: CaptionRecipe) => (lang === 'zh' ? p.description : p.descriptionEn ?? p.description);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-16">
      {/* ------------------------------------------------------------ hero */}
      <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1fr_440px]">
        <div>
          <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{t('home.kicker')}</p>
          <h1 className="text-[42px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
            {t('home.title')
              .split('\n')
              .map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
          </h1>
          <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-ink2">{t('home.subtitle')}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/studio"
              className="rounded-[10px] bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-transform duration-150 ease-out hover:scale-[1.02]"
            >
              {t('home.cta.studio')}
            </Link>
            <Link
              href="/library"
              className="rounded-[10px] border border-line2 px-5 py-2.5 text-[13px] text-ink2 transition-colors duration-150 ease-out hover:bg-hover hover:text-ink"
            >
              {t('home.cta.library')}
            </Link>
            <div className="ml-1 flex items-center gap-2">
              <ThemeToggle />
              <LangToggle />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            <span>{t('home.stat.presets')}</span>
            <span>{t('home.stat.motions')}</span>
            <span>{t('home.stat.singleLine')}</span>
            <span>{t('home.stat.numbers')}</span>
          </div>
        </div>

        <div className="mx-auto">
          <CaptionStage
            recipe={hero}
            words={finance.words}
            time={finance.words[3]?.start ?? 1}
            width={420}
            showSafeArea={false}
            backdrop="finance"
            animate={false}
            className="shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          />
        </div>
      </section>

      {/* ------------------------------------------------------------ demos */}
      <section className="mt-20">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">{t('home.demos.title')}</h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">{t('home.demos.hint')}</span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_DEMOS.map((d) => {
            const recipe = presets.find((p) => p.id === d.presetId)!;
            const transcript = getTranscript(d.transcriptId);
            return (
              <div key={d.presetId}>
                <Link href="/studio">
                  <DemoTile recipe={recipe} words={transcript.words} width={340} autoplay className="overflow-hidden rounded-[10px] shadow-[0_14px_40px_rgba(0,0,0,0.45)]" />
                </Link>
                <div className="mt-2.5 text-[11.5px] text-ink2">{nameOf(recipe)}</div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{recipe.category}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ principles */}
      <section className="mt-20">
        <h2 className="mb-5 text-[15px] font-medium tracking-[-0.01em] text-ink">{t('home.principles.title')}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {([1, 2, 3] as const).map((i) => (
            <div key={i} className="rounded-[14px] border border-line bg-panel p-5">
              <h3 className="text-[13.5px] font-medium text-ink">{t(`home.principle.${i}.t` as never)}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{t(`home.principle.${i}.d` as never)}</p>
            </div>
          ))}
        </div>
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
            <Link
              key={p.id}
              href={`/studio?preset=${p.id}`}
              className="group rounded-[14px] border border-line bg-panel p-3 transition-all duration-150 ease-out hover:border-line2"
            >
              <DemoTile recipe={p} words={getTranscript('demo-finance').words} width={268} autoplay className="overflow-hidden rounded-[10px]" />
              <div className="mt-3 text-[12.5px] font-medium text-ink">{nameOf(p)}</div>
              <div className="mt-1 text-[11px] leading-relaxed text-muted">{descOf(p)}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
