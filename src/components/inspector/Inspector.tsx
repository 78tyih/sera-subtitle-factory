'use client';

import { useRef, useState } from 'react';
import { useCaptionStore } from '@/store/caption-store';
import { Btn, Divider, Field, Panel, Row, Segmented, Slider, Swatches } from '@/components/ui';
import { fontOptions, fontSizePresets, fontWeightOptions } from '@/caption-engine/typography/fonts';
import { backgroundPresets } from '@/caption-engine/backgrounds';
import { borderPresets } from '@/caption-engine/borders';
import { entranceNames, exitNames, wordMotionNames } from '@/caption-engine/motions';
import { presets, presetCategories } from '@/presets';
import type { BackgroundType as BgType, BorderType as BdType } from '@/types/caption';

const TEXT_COLORS = ['#FFFFFF', '#111111', '#B4B4B8', '#FFD400', '#3B82F6', '#35D07F', '#E63946', '#FF8A3D', '#B77CFF'];
const ACCENTS = ['#FFD400', '#3B82F6', '#FFFFFF', '#35D07F', '#E63946', '#FF8A3D', '#B77CFF', '#111111'];

const labelOf = <T extends string>(arr: Array<{ type: T; label: string }>, v: T) => arr.find((x) => x.type === v)?.label ?? v;

export function Inspector({ className = '' }: { className?: string }) {
  const s = useCaptionStore();
  const r = s.recipe;

  return (
    <aside className={`w-[336px] shrink-0 overflow-y-auto border-l border-line bg-panel p-3 ${className}`}>
      {/* ------------------------------------------------ TEMPLATES */}
      {s.tab === 'templates' && (
        <>
          <Panel title="Presets · 12">
            <Row gap={6} wrap>
              {presetCategories.slice(0, 6).map((c) => {
                const n = presets.filter((p) => p.category === c).length;
                if (!n) return null;
                return (
                  <button key={c} className="rounded-[7px] border border-line2 px-2 py-1 text-[10.5px] text-ink2 hover:bg-[#1a1a1c] hover:text-ink" onClick={() => useCaptionStore.getState().usePreset(presets.find((p) => p.category === c)!.id)}>
                    {c} <span className="font-mono text-[9.5px] text-muted">{n}</span>
                  </button>
                );
              })}
            </Row>
            <Divider />
            <div className="flex flex-col gap-1.5">
              {presets.map((p) => {
                const on = p.id === r.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => s.usePreset(p.id)}
                    className={[
                      'rounded-[10px] border px-3 py-2 text-left transition-all duration-150 ease-out',
                      on ? 'border-accent/50 bg-[#151a24]' : 'border-line bg-[#111113] hover:border-line2 hover:bg-[#161618]'
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-medium text-ink">{p.name}</span>
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{p.category}</span>
                    </div>
                    <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{p.description}</p>
                  </button>
                );
              })}
            </div>
          </Panel>
        </>
      )}

      {/* ------------------------------------------------ TYPOGRAPHY */}
      {s.tab === 'typography' && (
        <Panel title="Typography">
          <Field label="Font family">
            <div className="grid grid-cols-3 gap-1.5">
              {fontOptions.map((f) => {
                const on = r.typography.fontFamily === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => s.patchRecipe({ typography: { fontFamily: f.key } })}
                    className={['rounded-[8px] border px-2 py-1.5 text-[10.5px] transition-all duration-150 ease-out', on ? 'border-ink bg-[#232326] text-ink' : 'border-line bg-[#111113] text-ink2 hover:bg-[#17171a]'].join(' ')}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Weight">
            <Segmented
              size="sm"
              options={fontWeightOptions.map((w) => ({ value: w, label: String(w) }))}
              value={r.typography.fontWeight}
              onChange={(w) => s.patchRecipe({ typography: { fontWeight: Number(w) } })}
            />
          </Field>

          <Field label="Font size" value={`${r.typography.fontSize}px`}>
            <Row gap={4} wrap>
              {fontSizePresets.map((n) => (
                <button
                  key={n}
                  onClick={() => s.patchRecipe({ typography: { fontSize: n } })}
                  className={['rounded-[7px] border px-2 py-1 font-mono text-[10.5px] transition-all duration-150 ease-out', r.typography.fontSize === n ? 'border-ink bg-[#232326] text-ink' : 'border-line text-ink2 hover:bg-[#17171a]'].join(' ')}
                >
                  {n}
                </button>
              ))}
            </Row>
            <div className="mt-2">
              <input type="range" min={32} max={120} value={r.typography.fontSize} onChange={(e) => s.patchRecipe({ typography: { fontSize: Number(e.target.value) } })} className="w-full" />
            </div>
          </Field>

          <Slider label="Letter spacing" value={r.typography.letterSpacing} min={-0.06} max={0.24} step={0.005} format={(v) => `${v.toFixed(3)}em`} onChange={(v) => s.patchRecipe({ typography: { letterSpacing: v } })} />

          <Field label="Text transform">
            <Segmented
              size="sm"
              options={[
                { value: 'none', label: 'As typed' },
                { value: 'uppercase', label: 'UPPER' }
              ]}
              value={r.typography.textTransform}
              onChange={(v) => s.patchRecipe({ typography: { textTransform: v as 'none' | 'uppercase' } })}
            />
          </Field>

          <Divider />
          <Slider label="Position Y" value={r.layout.yOffset} min={0.05} max={0.45} step={0.005} format={(v) => `${(v * 100).toFixed(1)}%`} onChange={(v) => s.patchRecipe({ layout: { yOffset: v } })} />
          <Slider label="Max width" value={r.layout.maxWidth} min={0.5} max={0.98} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => s.patchRecipe({ layout: { maxWidth: v } })} />
          <Field label="Position">
            <Segmented
              size="sm"
              options={[
                { value: 'top', label: 'Top' },
                { value: 'middle', label: 'Middle' },
                { value: 'bottom', label: 'Bottom' }
              ]}
              value={r.layout.position}
              onChange={(v) => s.patchRecipe({ layout: { position: v as 'top' | 'middle' | 'bottom' } })}
            />
          </Field>
          <Field label="Align">
            <Segmented
              size="sm"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
              value={r.layout.align}
              onChange={(v) => s.patchRecipe({ layout: { align: v as 'left' | 'center' | 'right' } })}
            />
          </Field>
        </Panel>
      )}

      {/* ------------------------------------------------ COLORS */}
      {s.tab === 'colors' && (
        <Panel title="Colors">
          <Field label="Text"><Swatches colors={TEXT_COLORS} value={r.text.text} onChange={(c) => s.patchRecipe({ text: { text: c } })} /></Field>
          <Field label="Not yet spoken / idle"><Swatches colors={TEXT_COLORS} value={r.text.idle} onChange={(c) => s.patchRecipe({ text: { idle: c } })} /></Field>
          <Field label="Active word"><Swatches colors={ACCENTS} value={r.text.active} onChange={(c) => s.patchRecipe({ text: { active: c }, activeWord: { color: c } })} /></Field>
          <Field label="Keyword"><Swatches colors={ACCENTS} value={r.text.keyword} onChange={(c) => s.patchRecipe({ text: { keyword: c } })} /></Field>
          <Field label="Number"><Swatches colors={ACCENTS} value={r.number.color} onChange={(c) => s.patchRecipe({ number: { color: c }, emphasis: { numberColor: c } })} /></Field>
          <Divider />
          <Slider label="Active word scale" value={r.activeWord.scale} min={1} max={1.3} step={0.01} format={(v) => `${v.toFixed(2)}×`} onChange={(v) => s.patchRecipe({ activeWord: { scale: v } })} />
        </Panel>
      )}

      {/* ------------------------------------------------ BACKGROUND */}
      {s.tab === 'background' && (
        <Panel title="Background">
          <Field label="Type" hint="大圆角矩形，不做胶囊">
            <Segmented
              size="sm"
              options={backgroundPresets.map((b) => ({ value: b.type, label: labelOf(backgroundPresets, b.type) }))}
              value={r.background.type}
              onChange={(v) => s.patchRecipe({ background: { type: v as BgType } })}
            />
          </Field>
          {r.background.type !== 'none' && (
            <>
              <Slider label="Opacity" value={r.background.opacity} min={0.2} max={1} step={0.02} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => s.patchRecipe({ background: { opacity: v } })} />
              <Slider label="Radius" value={r.background.radius} min={0} max={40} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ background: { radius: v } })} />
              <Slider label="Padding X" value={r.background.paddingX} min={8} max={48} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ background: { paddingX: v } })} />
              <Slider label="Padding Y" value={r.background.paddingY} min={4} max={32} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ background: { paddingY: v } })} />
              {r.background.type === 'glass' && (
                <Slider label="Blur (keep it light)" value={r.background.blur} min={2} max={14} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ background: { blur: v } })} />
              )}
            </>
          )}
        </Panel>
      )}

      {/* ------------------------------------------------ BORDER */}
      {s.tab === 'border' && (
        <Panel title="Border">
          <Field label="Type" hint="Left Bar 是主力：3–6px，不要更粗">
            <Segmented size="sm" options={borderPresets.map((b) => ({ value: b.type, label: labelOf(borderPresets, b.type) }))} value={r.border.type} onChange={(v) => s.patchRecipe({ border: { type: v as BdType } })} />
          </Field>
          {r.border.type !== 'none' && (
            <>
              <Slider label="Width" value={r.border.width} min={1} max={8} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ border: { width: v } })} />
              <Field label="Color"><Swatches colors={ACCENTS} value={r.border.color} onChange={(c) => s.patchRecipe({ border: { color: c } })} /></Field>
              <Slider label="Radius" value={r.border.radius} min={0} max={24} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ border: { radius: v } })} />
            </>
          )}
        </Panel>
      )}

      {/* ------------------------------------------------ MOTION */}
      {s.tab === 'motion' && (
        <Panel title="Motion">
          <Field label="Entrance">
            <Segmented size="sm" options={entranceNames.map((m) => ({ value: m, label: m }))} value={r.motion.entrance.type} onChange={(v) => s.patchRecipe({ motion: { entrance: { type: v as never } } })} />
          </Field>
          <Field label="Word motion" hint="pop 曲线 1.00→1.09→1.04→1.00，克制优先">
            <Segmented size="sm" options={wordMotionNames.map((m) => ({ value: m, label: m }))} value={r.motion.word.type} onChange={(v) => s.patchRecipe({ motion: { word: { type: v as never } } })} />
          </Field>
          <Field label="Exit">
            <Segmented size="sm" options={exitNames.map((m) => ({ value: m, label: m }))} value={r.motion.exit.type} onChange={(v) => s.patchRecipe({ motion: { exit: { type: v as never } } })} />
          </Field>
          <Divider />
          <Slider label="Word duration" value={r.motion.word.duration} min={100} max={400} step={10} format={(v) => `${v}ms`} onChange={(v) => s.patchRecipe({ motion: { word: { duration: v } } })} />
          <Slider label="Word intensity" value={r.motion.word.intensity} min={0.4} max={1.6} step={0.05} format={(v) => `${v.toFixed(2)}×`} onChange={(v) => s.patchRecipe({ motion: { word: { intensity: v } } })} />
          <Slider label="Entrance duration" value={r.motion.entrance.duration} min={80} max={500} step={10} format={(v) => `${v}ms`} onChange={(v) => s.patchRecipe({ motion: { entrance: { duration: v } } })} />
        </Panel>
      )}

      {/* ------------------------------------------------ EMPHASIS */}
      {s.tab === 'emphasis' && <EmphasisPanel />}

      {/* ------------------------------------------------ RECIPES */}
      {s.tab === 'recipes' && <RecipesPanel />}
    </aside>
  );
}

/* ================================================================ emphasis */

function EmphasisPanel() {
  const s = useCaptionStore();
  const r = s.recipe;
  const [kw, setKw] = useState('');

  const addKeyword = () => {
    const v = kw.trim();
    if (!v) return;
    s.patchRecipe({ emphasis: { keywords: [...r.emphasis.keywords, v] } });
    setKw('');
  };

  return (
    <Panel title="Emphasis">
      <Field label="Auto emphasis">
        <div className="flex flex-col gap-1.5">
          {([
            ['numbers', 'Numbers · 1.20 3 100'],
            ['percentages', 'Percentages · 12% +35%'],
            ['currency', 'Currency · $68,500 100 USDT']
          ] as const).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between rounded-[9px] border border-line bg-[#111113] px-3 py-2">
              <span className="text-[11.5px] text-ink2">{label}</span>
              <input
                type="checkbox"
                checked={r.emphasis[key]}
                onChange={(e) => s.patchRecipe({ emphasis: { [key]: e.target.checked } })}
                className="h-3.5 w-3.5 accent-[#3B82F6]"
              />
            </label>
          ))}
          <label className="flex cursor-pointer items-center justify-between rounded-[9px] border border-line bg-[#111113] px-3 py-2 opacity-60">
            <span className="text-[11.5px] text-ink2">AI emphasis (Phase 4)</span>
            <input type="checkbox" checked={r.emphasis.aiEmphasis} disabled className="h-3.5 w-3.5" />
          </label>
        </div>
      </Field>

      <Divider />
      <Slider label="Number scale" value={r.number.scale} min={1} max={1.4} step={0.01} format={(v) => `${v.toFixed(2)}×`} onChange={(v) => s.patchRecipe({ number: { scale: v }, emphasis: { numberScale: v } })} />
      <Slider label="Number weight" value={r.number.fontWeight} min={500} max={900} step={100} onChange={(v) => s.patchRecipe({ number: { fontWeight: v }, emphasis: { numberWeight: v } })} />
      <Slider label="Keyword weight" value={r.emphasis.keywordWeight} min={500} max={900} step={100} onChange={(v) => s.patchRecipe({ emphasis: { keywordWeight: v } })} />

      <Divider />
      <Field label="Always-on keywords">
        <div className="flex gap-1.5">
          <input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
            placeholder="资金 / 风险 / BTC"
            className="min-w-0 flex-1 rounded-[9px] border border-line bg-[#111113] px-2.5 py-1.5 text-[11.5px] text-ink outline-none placeholder:text-muted focus:border-accent/60"
          />
          <Btn size="sm" onClick={addKeyword}>Add</Btn>
        </div>
        {r.emphasis.keywords.length > 0 && (
          <Row gap={6}>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.emphasis.keywords.map((k) => (
                <button
                  key={k}
                  onClick={() => s.patchRecipe({ emphasis: { keywords: r.emphasis.keywords.filter((x) => x !== k) } })}
                  className="rounded-[6px] border border-line2 px-2 py-[3px] text-[10.5px] text-ink2 hover:border-highlight/50 hover:text-highlight"
                >
                  {k} ×
                </button>
              ))}
            </div>
          </Row>
        )}
      </Field>
    </Panel>
  );
}

/* ================================================================ recipes */

function RecipesPanel() {
  const s = useCaptionStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [flash, setFlash] = useState('');

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(s.recipe, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${s.recipe.id}.json`;
    a.click();
    setFlash('Exported current recipe');
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify({ library: 'sera-subtitle-factory', recipes: s.savedRecipes }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ssf-recipes.json';
    a.click();
  };

  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.recipes)) parsed.recipes.forEach((r: never) => s.importRecipe(r));
        else s.importRecipe(parsed);
        setFlash('Imported');
      } catch {
        setFlash('Import failed — invalid JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Panel title="Recipes">
      <Row gap={6}>
        <Btn size="sm" variant="primary" onClick={() => { s.saveRecipe(); setFlash('Recipe saved to localStorage'); }}>Save current</Btn>
        <Btn size="sm" onClick={exportJSON}>Export JSON</Btn>
        <Btn size="sm" onClick={() => fileRef.current?.click()}>Import JSON</Btn>
      </Row>
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
      {flash && <p className="mt-2 font-mono text-[10px] text-accent">{flash}</p>}

      <Divider />
      {s.savedRecipes.length === 0 && (
        <p className="text-[11.5px] leading-relaxed text-muted">
          还没有保存的 Recipe。调整任意样式后点 <span className="text-ink2">Save current</span>，会写入 localStorage（Phase 1 不接数据库）。
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        {s.savedRecipes.map((r) => (
          <div key={r.id} className="rounded-[10px] border border-line bg-[#111113] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <button className="truncate text-left text-[12px] font-medium text-ink hover:text-accent" onClick={() => s.replaceRecipe(r)} title="Load into studio">
                {r.name}
              </button>
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">{r.category}</span>
            </div>
            <div className="mt-1.5 flex gap-1.5">
              <button className="text-[10.5px] text-muted hover:text-ink" onClick={() => s.duplicateRecipe(r.id)}>Duplicate</button>
              <span className="text-line2">·</span>
              <button
                className="text-[10.5px] text-muted hover:text-ink"
                onClick={() => {
                  const n = window.prompt('Rename recipe', r.name);
                  if (n) s.renameRecipe(r.id, n);
                }}
              >
                Rename
              </button>
              <span className="text-line2">·</span>
              <button className="text-[10.5px] text-muted hover:text-[#E63946]" onClick={() => s.deleteRecipe(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {s.savedRecipes.length > 0 && (
        <>
          <Divider />
          <Btn size="sm" onClick={exportAll}>Export all ({s.savedRecipes.length})</Btn>
        </>
      )}

      <Divider />
      <p className="text-[10.5px] leading-relaxed text-muted">
        Recipe = 一份完整的字幕配置（排版 / 颜色 / 背景 / 边框 / 动效 / 强调规则）。<br />
        复制 JSON 给任何人，即可复刻同款字幕。
      </p>
    </Panel>
  );
}
