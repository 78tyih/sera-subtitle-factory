'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCaptionStore } from '@/store/caption-store';
import { Btn, Panel } from '@/components/ui';
import type { CaptionRecipe } from '@/types/caption';
import { useI18n } from '@/lib/i18n';

export default function RecipesPage() {
  const { t, lang } = useI18n();
  const s = useCaptionStore();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState<CaptionRecipe | null>(null);

  const importFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.recipes)) {
          parsed.recipes.forEach((r: CaptionRecipe) => s.importRecipe(r));
          setMsg(t('recipes.imported', { n: parsed.recipes.length }));
        } else if (parsed && typeof parsed === 'object' && parsed.typography) {
          s.importRecipe(parsed as CaptionRecipe);
          setMsg(t('recipes.importedOne'));
        } else {
          setMsg(t('recipes.importFail'));
        }
      } catch {
        setMsg(t('recipes.importFail'));
      }
    };
    reader.readAsText(f);
  };

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-10">
      <header className="mb-7">
        <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{t('recipes.kicker')}</p>
        <h1 className="text-[30px] font-semibold tracking-[-0.025em]">{t('recipes.title')}</h1>
        <p className="mt-2 max-w-[640px] text-[13px] leading-relaxed text-ink2">{t('recipes.subtitle')}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <Panel
            title={`${t('recipes.saved')} · ${s.savedRecipes.length}`}
            right={
              <div className="flex gap-2">
                <Btn size="sm" onClick={() => fileRef.current?.click()}>{t('ui.import')}</Btn>
                <Btn size="sm" variant="primary" onClick={() => { s.saveRecipe(); setMsg(t('recipes.savedMsg')); }}>{t('ui.saveRecipe')}</Btn>
              </div>
            }
          >
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
            {msg && <p className="mb-3 font-mono text-[10.5px] text-accent">{msg}</p>}

            {s.savedRecipes.length === 0 ? (
              <p className="text-[12px] leading-relaxed text-muted">{t('recipes.empty')}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {s.savedRecipes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-[10px] border border-line bg-panel2 px-3 py-2.5">
                    <span className="h-6 w-6 shrink-0 rounded-[6px] border border-white/10" style={{ background: r.text.active }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-ink">{lang === 'zh' ? r.nameZh ?? r.name : r.name}</div>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">
                        {r.category} · {r.motion.word.type} · {r.background.type} · {r.createdAt?.slice(0, 10) ?? 'draft'}
                      </div>
                    </div>
                    <button className="text-[11px] text-muted hover:text-ink" onClick={() => setPreview(r)}>JSON</button>
                    <button
                      className="text-[11px] text-muted hover:text-ink"
                      onClick={() => {
                        s.replaceRecipe(r);
                        router.push('/studio');
                      }}
                    >
                      {t('ui.open')}
                    </button>
                    <button className="text-[11px] text-muted hover:text-ink" onClick={() => s.duplicateRecipe(r.id)}>{t('ui.duplicate')}</button>
                    <button className="text-[11px] text-muted hover:text-[#E63946]" onClick={() => s.deleteRecipe(r.id)}>{t('ui.delete')}</button>
                  </div>
                ))}
              </div>
            )}

            {s.savedRecipes.length > 0 && (
              <div className="mt-4 flex gap-2">
                <Btn
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify({ library: 'sera-subtitle-factory', version: '0.1', recipes: s.savedRecipes }, null, 2)], { type: 'application/json' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'ssf-recipes.json';
                    a.click();
                  }}
                >
                  {t('ui.exportAll')}
                </Btn>
              </div>
            )}
          </Panel>
        </div>

        <Panel title={preview ? `JSON · ${preview.name}` : t('recipes.json.current')}>
          <pre className="max-h-[560px] overflow-auto rounded-[10px] border border-line bg-sunken p-3 font-mono text-[10.5px] leading-relaxed text-ink2">
            {JSON.stringify(preview ?? s.recipe, null, 2)}
          </pre>
          <div className="mt-3 flex gap-2">
            <Btn size="sm" onClick={() => navigator.clipboard?.writeText(JSON.stringify(preview ?? s.recipe, null, 2))}>{t('ui.copyJson')}</Btn>
            {preview && <Btn size="sm" onClick={() => setPreview(null)}>{t('ui.backToCurrent')}</Btn>}
          </div>
        </Panel>
      </div>
    </main>
  );
}
