'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { signaturePresets, variantPresets } from '@/presets';
import { familyByKey, familyOfPreset } from '@/styles/families';
import { DemoTile } from '@/components/preview/DemoTile';
import { useCaptionStore } from '@/store/caption-store';
import { useI18n } from '@/lib/i18n';
import { Btn, Row } from '@/components/ui';
import type { CaptionRecipe } from '@/types/caption';
import { DEFAULT_CONTEXT } from '@/preview-contexts';

const TABS = ['featured', 'creator', 'editorial', 'business', 'podcast', 'tech', 'experimental', 'lab'];

export default function LibraryPage() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState('featured');

  const list = useMemo<CaptionRecipe[]>(() => {
    if (tab === 'lab') return variantPresets;
    if (tab === 'featured') return signaturePresets.slice(0, 18);
    const fam = familyByKey(tab);
    if (!fam) return signaturePresets;
    const ids = [fam.masterId, ...fam.variantIds].filter(Boolean) as string[];
    const hit = signaturePresets.filter((p) => ids.includes(p.id));
    if (hit.length) return hit;
    return signaturePresets.filter((p) => familyOfPreset(p.id)?.key === tab);
  }, [tab]);

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-24 pt-10">
      <header className="mb-7">
        <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Library</p>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-ink">{t('library.featuredTitle' as never)}</h1>
        <p className="mt-2 text-[13px] text-muted">
          {t('home.stat.families' as never)} · {t('home.stat.signature' as never)} · {t('home.stat.variations' as never)}
        </p>
      </header>

      <Row gap={6} wrap>
        {TABS.map((k) => {
          const on = tab === k;
          const label =
            k === 'featured'
              ? t('library.tabs.featured' as never)
              : k === 'lab'
                ? t('library.tabs.lab' as never)
                : familyByKey(k)?.name ?? k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={[
                'rounded-[8px] border px-3 py-1.5 text-[12px] transition-all duration-150 ease-out',
                on ? 'border-ink bg-chip text-ink' : 'border-line2 text-ink2 hover:bg-hover hover:text-ink'
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
      </Row>

      {tab === 'lab' && (
        <p className="mt-4 rounded-[10px] border border-line bg-panel2 px-3 py-2 text-[11.5px] leading-relaxed text-muted">
          {t('library.labNote' as never)}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <StyleCard key={p.id} recipe={p} lang={lang} />
        ))}
      </div>
    </main>
  );
}

function StyleCard({ recipe, lang }: { recipe: CaptionRecipe; lang: string }) {
  const fam = familyOfPreset(recipe.id);
  const [open, setOpen] = useState(false);
  const applyPreset = useCaptionStore((s) => s.usePreset);
  const zh = lang === 'zh';
  const name = zh ? recipe.nameZh ?? recipe.name : recipe.name;

  return (
    <>
      <article className="group overflow-hidden rounded-[14px] border border-line bg-panel transition-all duration-200 ease-out hover:border-line2">
        <button onClick={() => setOpen(true)} className="block w-full">
          <DemoTile recipe={recipe} width={380} showContextLabel className="overflow-hidden rounded-t-[14px]" />
        </button>
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-ink">{name}</div>
            <div className="truncate font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{fam?.name ?? recipe.category}</div>
          </div>
          <Btn size="sm" onClick={() => { applyPreset(recipe.id); window.location.href = '/studio/'; }}>
            {zh ? '使用' : 'Use'}
          </Btn>
        </div>
      </article>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-[720px] rounded-t-[16px] border border-line bg-panel p-5 md:rounded-[16px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <DemoTile recipe={recipe} width={640} autoplay showContextLabel className="overflow-hidden rounded-[12px]" />
            </div>
            <h2 className="text-[15px] font-semibold text-ink">{name}</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              {zh ? recipe.description : recipe.descriptionEn ?? recipe.description}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[11.5px]">
              {[
                ['Family', fam?.name ?? '—'],
                ['Context', (fam?.contexts ?? [DEFAULT_CONTEXT]).join(' / ')],
                ['Font', recipe.typography.fontFamily],
                ['Size', `${recipe.typography.fontSize}px`],
                ['Motion', recipe.motion.word.type],
                ['Background', recipe.background.type]
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-2 border-b border-line pb-1.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="truncate font-mono text-ink2">{v}</dd>
                </div>
              ))}
            </dl>

            <Row gap={8} wrap>
              <Btn
                variant="primary"
                size="sm"
                onClick={() => {
                  applyPreset(recipe.id);
                  window.location.href = '/studio/';
                }}
              >
                {zh ? '使用此样式' : 'Use Style'}
              </Btn>
              <Link href="/studio/" className="rounded-[9px] border border-line2 px-3 py-1.5 text-[12px] text-ink2 hover:bg-hover hover:text-ink">
                {zh ? '继续调整' : 'Customize'}
              </Link>
              <Btn size="sm" onClick={() => navigator.clipboard?.writeText(JSON.stringify(recipe, null, 2))}>
                {zh ? '复制 Recipe' : 'Copy Recipe'}
              </Btn>
            </Row>
          </div>
        </div>
      )}
    </>
  );
}
