'use client';

import { useState } from 'react';
import Link from 'next/link';
import { presets } from '@/presets';
import { useCaptionStore } from '@/store/caption-store';
import { useI18n } from '@/lib/i18n';
import { Btn, Row } from '@/components/ui';
import { DemoTile } from '@/components/preview/DemoTile';
import { familyByKey } from '@/styles/families';
import { previewContexts } from '@/preview-contexts';
import type { PreviewContextKey } from '@/preview-contexts';

/**
 * FamilyView (PART I §67) — turns the library into a "caption design language
 * library" instead of a thumbnail grid: Master · Variants · Recommended context
 * · Motion · Rhythm · Design notes, all on one page.
 */
export function FamilyView({ familyKey }: { familyKey: string }) {
  const { t, lang } = useI18n();
  const zh = lang === 'zh';
  const fam = familyByKey(familyKey);
  const applyPreset = useCaptionStore((s) => s.usePreset);

  const master = fam?.masterId ? presets.find((p) => p.id === fam.masterId) : undefined;
  const variants = fam?.masterId ? presets.filter((p) => p.masterId === fam.masterId) : [];

  const [ctx, setCtx] = useState<PreviewContextKey>(fam?.contexts[0] ?? 'creator');

  if (!fam) {
    return (
      <main className="mx-auto max-w-[1240px] px-6 pb-24 pt-10">
        <p className="text-[13px] text-muted">{zh ? '找不到这个 Family。' : 'Family not found.'}</p>
        <Link href="/library/" className="mt-4 inline-block text-[13px] text-ink underline">
          {zh ? '返回 Library' : 'Back to Library'}
        </Link>
      </main>
    );
  }

  const name = (r: { nameZh?: string; name: string }) => (zh ? r.nameZh ?? r.name : r.name);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-8">
      <Link href="/library/" className="text-[12px] text-muted hover:text-ink">
        ← {zh ? 'Library' : 'Library'}
      </Link>

      <header className="mt-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{fam.name}</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-ink">{fam.nameZh}</h1>
        <p className="mt-2 max-w-[720px] text-[13px] leading-relaxed text-muted">{fam.purpose}</p>
      </header>

      {/* context switcher — PART G: a style is judged in its own scene */}
      <Row gap={6} wrap>
        {fam.contexts.map((c) => (
          <button
            key={c}
            onClick={() => setCtx(c)}
            className={[
              'rounded-[8px] border px-3 py-1.5 text-[12px] transition-all duration-150 ease-out',
              ctx === c ? 'border-ink bg-chip text-ink' : 'border-line2 text-ink2 hover:bg-hover hover:text-ink'
            ].join(' ')}
          >
            {zh ? previewContexts[c].nameZh : previewContexts[c].name}
          </button>
        ))}
      </Row>

      {/* ---------------- Master ---------------- */}
      {master ? (
        <section className="mt-7">
          <h2 className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
            {t('family.master' as never)}
          </h2>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_300px]">
            <DemoTile
              recipe={master}
              width={720}
              autoplay
              context={ctx}
              showContextLabel
              className="overflow-hidden rounded-[14px] border border-line"
            />
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[15px] font-medium text-ink">{name(master)}</div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  {zh ? master.description : master.descriptionEn ?? master.description}
                </p>
              </div>
              <dl className="flex flex-col gap-1.5 text-[11.5px]">
                {[
                  ['Font', master.typography.fontFamily],
                  ['Size', `${master.typography.fontSize}px`],
                  ['Motion', master.motion.word.type],
                  ['Decorator', (master.motion as { decorator?: string }).decorator ?? '—'],
                  [
                    'Rhythm',
                    master.rhythm ? `${master.rhythm.mode} · ${master.rhythm.maxWords}w · ${master.rhythm.combineWithinMs}ms` : '—'
                  ],
                  ['Background', master.background.type]
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-2 border-b border-line pb-1">
                    <dt className="text-muted">{k}</dt>
                    <dd className="truncate font-mono text-ink2">{v}</dd>
                  </div>
                ))}
              </dl>
              <Row gap={8} wrap>
                <Btn variant="primary" size="sm" onClick={() => { applyPreset(master.id); window.location.href = '/studio/'; }}>
                  {zh ? '使用此样式' : 'Use Style'}
                </Btn>
                <Link href="/studio/" className="rounded-[9px] border border-line2 px-3 py-1.5 text-[12px] text-ink2 hover:bg-hover hover:text-ink">
                  {zh ? '继续调整' : 'Customize'}
                </Link>
                <Btn size="sm" onClick={() => navigator.clipboard?.writeText(JSON.stringify(master, null, 2))}>
                  {zh ? '复制 Recipe' : 'Copy Recipe'}
                </Btn>
              </Row>
            </div>
          </div>
        </section>
      ) : (
        <p className="mt-7 rounded-[10px] border border-line bg-panel2 px-3 py-2 text-[12px] text-muted">
          {zh ? '这个 Family 还没做 Master（后续轮次补齐）。' : 'This family has no master yet (coming in a later round).'}
        </p>
      )}

      {/* ---------------- Variants ---------------- */}
      {variants.length > 0 && (
        <section className="mt-9">
          <h2 className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
            {t('family.variants' as never)} {variants.length}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {variants.map((v) => (
              <div key={v.id} className="overflow-hidden rounded-[12px] border border-line bg-panel">
                <DemoTile recipe={v} width={520} context={ctx} className="overflow-hidden" />
                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] text-ink">{name(v)}</div>
                    <div className="truncate font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">
                      {zh ? '变体' : 'Variant'}
                    </div>
                  </div>
                  <Btn size="sm" onClick={() => { applyPreset(v.id); window.location.href = '/studio/'; }}>
                    {zh ? '使用' : 'Use'}
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- Design notes ---------------- */}
      <section className="mt-9 grid gap-5 md:grid-cols-2">
        <div className="rounded-[12px] border border-line bg-panel p-4">
          <h3 className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{t('family.dos' as never)}</h3>
          <ul className="mt-2 flex flex-col gap-1.5 text-[12px] text-ink2">
            {fam.dos.map((d) => (
              <li key={d}>· {d}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[12px] border border-line bg-panel p-4">
          <h3 className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{t('family.donts' as never)}</h3>
          <ul className="mt-2 flex flex-col gap-1.5 text-[12px] text-ink2">
            {fam.donts.map((d) => (
              <li key={d}>· {d}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
