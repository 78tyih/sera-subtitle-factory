'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCaptionStore } from '@/store/caption-store';
import { Btn, Panel } from '@/components/ui';
import type { CaptionRecipe } from '@/types/caption';

export default function RecipesPage() {
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
          setMsg(`Imported ${parsed.recipes.length} recipes`);
        } else if (parsed && typeof parsed === 'object' && parsed.typography) {
          s.importRecipe(parsed as CaptionRecipe);
          setMsg('Imported 1 recipe');
        } else {
          setMsg('Invalid file — expected a recipe or a { recipes: [] } bundle');
        }
      } catch {
        setMsg('Import failed — invalid JSON');
      }
    };
    reader.readAsText(f);
  };

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-10">
      <header className="mb-7">
        <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">caption recipes</p>
        <h1 className="text-[30px] font-semibold tracking-[-0.025em]">Recipes</h1>
        <p className="mt-2 max-w-[640px] text-[13px] leading-relaxed text-ink2">
          一份 Recipe = 完整的字幕配置（排版 / 颜色 / 背景 / 边框 / 动效 / 强调规则）。复制 JSON 给任何人，即可复刻同款字幕。
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <Panel
            title={`Saved · ${s.savedRecipes.length}`}
            right={
              <div className="flex gap-2">
                <Btn size="sm" onClick={() => fileRef.current?.click()}>Import</Btn>
                <Btn size="sm" variant="primary" onClick={() => { s.saveRecipe(); setMsg('Saved current studio recipe'); }}>Save current</Btn>
              </div>
            }
          >
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
            {msg && <p className="mb-3 font-mono text-[10.5px] text-accent">{msg}</p>}

            {s.savedRecipes.length === 0 ? (
              <p className="text-[12px] leading-relaxed text-muted">
                还没有 Recipe。去 <span className="text-ink2">Studio</span> 调一版你喜欢的字幕，然后点 Save Recipe —— 会存在 localStorage（Phase 1 不接数据库）。
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {s.savedRecipes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-[10px] border border-line bg-[#111113] px-3 py-2.5">
                    <span className="h-6 w-6 shrink-0 rounded-[6px] border border-white/10" style={{ background: r.text.active }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-ink">{r.name}</div>
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
                      Open
                    </button>
                    <button className="text-[11px] text-muted hover:text-ink" onClick={() => s.duplicateRecipe(r.id)}>Duplicate</button>
                    <button className="text-[11px] text-muted hover:text-[#E63946]" onClick={() => s.deleteRecipe(r.id)}>Delete</button>
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
                  Export all
                </Btn>
              </div>
            )}
          </Panel>
        </div>

        <Panel title={preview ? `JSON · ${preview.name}` : 'JSON · current studio recipe'}>
          <pre className="max-h-[560px] overflow-auto rounded-[10px] border border-line bg-[#0c0c0d] p-3 font-mono text-[10.5px] leading-relaxed text-ink2">
            {JSON.stringify(preview ?? s.recipe, null, 2)}
          </pre>
          <div className="mt-3 flex gap-2">
            <Btn size="sm" onClick={() => navigator.clipboard?.writeText(JSON.stringify(preview ?? s.recipe, null, 2))}>Copy JSON</Btn>
            {preview && <Btn size="sm" onClick={() => setPreview(null)}>Back to current</Btn>}
          </div>
        </Panel>
      </div>
    </main>
  );
}
