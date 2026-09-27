'use client';

import { useRef, useState } from 'react';
import { useCaptionStore } from '@/store/caption-store';
import { Btn, Divider, Field, OptionGrid, Panel, Row, Segmented, Slider, Swatches } from '@/components/ui';
import { fontOptions, fontSizePresets, fontWeightOptions } from '@/caption-engine/typography/fonts';
import { backgroundPresets } from '@/caption-engine/backgrounds';
import { borderPresets } from '@/caption-engine/borders';
import { entranceNames, exitNames, wordMotionNames } from '@/caption-engine/motions';
import { presets, presetCategories } from '@/presets';
import type { BackgroundType as BgType, BorderType as BdType } from '@/types/caption';
import { useI18n } from '@/lib/i18n';

const TEXT_COLORS = ['#FFFFFF', '#111111', '#B4B4B8', '#FFD400', '#3B82F6', '#35D07F', '#E63946', '#FF8A3D', '#B77CFF'];
const ACCENTS = ['#FFD400', '#3B82F6', '#FFFFFF', '#35D07F', '#E63946', '#FF8A3D', '#B77CFF', '#111111'];

const labelOf = <T extends string>(arr: Array<{ type: T; label: string }>, v: T) => arr.find((x) => x.type === v)?.label ?? v;

export function Inspector({ className = '' }: { className?: string }) {
  const { t, lang } = useI18n();
  const s = useCaptionStore();
  const r = s.recipe;

  return (
    <aside className={`w-[336px] shrink-0 overflow-y-auto border-l border-line bg-panel p-3 ${className}`}>
      {/* ------------------------------------------------ TEMPLATES */}
      {s.tab === 'templates' && (
        <>
          <Panel title={`${t('inspector.presets')} · ${presets.length}`}>
            <Row gap={6} wrap>
              {presetCategories
                .map((c) => ({ c, n: presets.filter((p) => p.category === c).length }))
                .filter((x) => x.n > 0)
                .map(({ c, n }) => (
                  <button
                    key={c}
                    className="rounded-[7px] border border-line2 px-2 py-1 text-[10.5px] text-ink2 hover:bg-hover hover:text-ink"
                    onClick={() => useCaptionStore.getState().usePreset(presets.find((p) => p.category === c)!.id)}
                  >
                    {t(`cat.${c}` as never)} <span className="font-mono text-[9.5px] text-muted">{n}</span>
                  </button>
                ))}
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
                      on ? 'border-accent/50 bg-accent/10' : 'border-line bg-panel2 hover:border-line2 hover:bg-hover'
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-medium text-ink">{lang === 'zh' ? p.nameZh ?? p.name : p.name}</span>
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{t(`cat.${p.category}` as never)}</span>
                    </div>
                    <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{lang === 'zh' ? p.description : p.descriptionEn ?? p.description}</p>
                  </button>
                );
              })}
            </div>
          </Panel>
        </>
      )}

      {/* ------------------------------------------------ TYPOGRAPHY */}
      {s.tab === 'typography' && (
        <Panel title={t('inspector.typography')}>
          <Field label={t('inspector.fontFamily')}>
            <div className="space-y-2.5">
              {Array.from(new Set(fontOptions.map((f) => f.group))).map((group) => (
                <div key={group}>
                  <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{group}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {fontOptions
                      .filter((f) => f.group === group)
                      .map((f) => {
                        const on = r.typography.fontFamily === f.key;
                        return (
                          <button
                            key={f.key}
                            onClick={() => s.patchRecipe({ typography: { fontFamily: f.key } })}
                            title={f.label}
                            className={[
                              'truncate rounded-[8px] border px-2 py-1.5 text-[10.5px] transition-all duration-150 ease-out',
                              on ? 'border-ink bg-chip text-ink' : 'border-line bg-panel2 text-ink2 hover:bg-hover'
                            ].join(' ')}
                          >
                            {f.label}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </Field>

          <Field label={t('inspector.weight')}>
            <Segmented
              size="sm"
              options={fontWeightOptions.map((w) => ({ value: w, label: String(w) }))}
              value={r.typography.fontWeight}
              onChange={(w) => s.patchRecipe({ typography: { fontWeight: Number(w) } })}
            />
          </Field>

          <Field label={t('inspector.fontSize')} value={`${r.typography.fontSize}px`}>
            <Row gap={4} wrap>
              {fontSizePresets.map((n) => (
                <button
                  key={n}
                  onClick={() => s.patchRecipe({ typography: { fontSize: n } })}
                  className={['rounded-[7px] border px-2 py-1 font-mono text-[10.5px] transition-all duration-150 ease-out', r.typography.fontSize === n ? 'border-ink bg-chip text-ink' : 'border-line text-ink2 hover:bg-hover'].join(' ')}
                >
                  {n}
                </button>
              ))}
            </Row>
            <div className="mt-2">
              <input type="range" min={32} max={120} value={r.typography.fontSize} onChange={(e) => s.patchRecipe({ typography: { fontSize: Number(e.target.value) } })} className="w-full" />
            </div>
          </Field>

          <Slider label={t('inspector.letterSpacing')} value={r.typography.letterSpacing} min={-0.06} max={0.24} step={0.005} format={(v) => `${v.toFixed(3)}em`} onChange={(v) => s.patchRecipe({ typography: { letterSpacing: v } })} />

          <Field label={t('inspector.textTransform')}>
            <Segmented
              size="sm"
              options={[
                { value: 'none', label: t('inspector.asTyped') },
                { value: 'uppercase', label: t('inspector.upper') }
              ]}
              value={r.typography.textTransform}
              onChange={(v) => s.patchRecipe({ typography: { textTransform: v as 'none' | 'uppercase' } })}
            />
          </Field>

          <Divider />
          <Slider label={t('inspector.positionY')} value={r.layout.yOffset} min={0.05} max={0.45} step={0.005} format={(v) => `${(v * 100).toFixed(1)}%`} onChange={(v) => s.patchRecipe({ layout: { yOffset: v } })} />
          <Slider label={t('inspector.maxWidth')} value={r.layout.maxWidth} min={0.5} max={0.98} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => s.patchRecipe({ layout: { maxWidth: v } })} />
          <Field label={t('inspector.position')}>
            <Segmented
              size="sm"
              options={[
                { value: 'top', label: t('inspector.pos.top') },
                { value: 'middle', label: t('inspector.pos.middle') },
                { value: 'bottom', label: t('inspector.pos.bottom') }
              ]}
              value={r.layout.position}
              onChange={(v) => s.patchRecipe({ layout: { position: v as 'top' | 'middle' | 'bottom' } })}
            />
          </Field>
          <Field label={t('inspector.align')}>
            <Segmented
              size="sm"
              options={[
                { value: 'left', label: t('inspector.align.left') },
                { value: 'center', label: t('inspector.align.center') },
                { value: 'right', label: t('inspector.align.right') }
              ]}
              value={r.layout.align}
              onChange={(v) => s.patchRecipe({ layout: { align: v as 'left' | 'center' | 'right' } })}
            />
          </Field>
        </Panel>
      )}

      {/* ------------------------------------------------ COLORS */}
      {s.tab === 'colors' && (
        <Panel title={t('inspector.colors')}>
          <Field label={t('inspector.color.text')}><Swatches colors={TEXT_COLORS} value={r.text.text} onChange={(c) => s.patchRecipe({ text: { text: c } })} /></Field>
          <Field label={t('inspector.color.idle')}><Swatches colors={TEXT_COLORS} value={r.text.idle} onChange={(c) => s.patchRecipe({ text: { idle: c } })} /></Field>
          <Field label={t('inspector.color.active')}><Swatches colors={ACCENTS} value={r.text.active} onChange={(c) => s.patchRecipe({ text: { active: c }, activeWord: { color: c } })} /></Field>
          <Field label={t('inspector.color.keyword')}><Swatches colors={ACCENTS} value={r.text.keyword} onChange={(c) => s.patchRecipe({ text: { keyword: c } })} /></Field>
          <Field label={t('inspector.color.number')}><Swatches colors={ACCENTS} value={r.number.color} onChange={(c) => s.patchRecipe({ number: { color: c }, emphasis: { numberColor: c } })} /></Field>
          <Divider />
          <Slider label={t('inspector.activeScale')} value={r.activeWord.scale} min={1} max={1.3} step={0.01} format={(v) => `${v.toFixed(2)}×`} onChange={(v) => s.patchRecipe({ activeWord: { scale: v } })} />
        </Panel>
      )}

      {/* ------------------------------------------------ BACKGROUND */}
      {s.tab === 'background' && (
        <Panel title={t('inspector.background')}>
          <Field label={t('inspector.bg.type')} hint={t('inspector.bg.hint')}>
            <Segmented
              size="sm"
              options={backgroundPresets.map((b) => ({ value: b.type, label: labelOf(backgroundPresets, b.type) }))}
              value={r.background.type}
              onChange={(v) => s.patchRecipe({ background: { type: v as BgType } })}
            />
          </Field>
          {r.background.type !== 'none' && (
            <>
              <Slider label={t('inspector.bg.opacity')} value={r.background.opacity} min={0.2} max={1} step={0.02} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => s.patchRecipe({ background: { opacity: v } })} />
              <Slider label={t('inspector.bg.radius')} value={r.background.radius} min={0} max={40} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ background: { radius: v } })} />
              <Slider label={t('inspector.bg.paddingX')} value={r.background.paddingX} min={8} max={48} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ background: { paddingX: v } })} />
              <Slider label={t('inspector.bg.paddingY')} value={r.background.paddingY} min={4} max={32} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ background: { paddingY: v } })} />
              {r.background.type === 'glass' && (
                <Slider label={t('inspector.bg.blur')} value={r.background.blur} min={2} max={14} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ background: { blur: v } })} />
              )}
            </>
          )}
        </Panel>
      )}

      {/* ------------------------------------------------ BORDER */}
      {s.tab === 'border' && (
        <Panel title={t('inspector.border')}>
          <Field label={t('inspector.border.type')} hint={t('inspector.border.hint')}>
            <Segmented size="sm" options={borderPresets.map((b) => ({ value: b.type, label: labelOf(borderPresets, b.type) }))} value={r.border.type} onChange={(v) => s.patchRecipe({ border: { type: v as BdType } })} />
          </Field>
          {r.border.type !== 'none' && (
            <>
              <Slider label={t('inspector.border.width')} value={r.border.width} min={1} max={8} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ border: { width: v } })} />
              <Field label={t('inspector.border.color')}><Swatches colors={ACCENTS} value={r.border.color} onChange={(c) => s.patchRecipe({ border: { color: c } })} /></Field>
              <Slider label={t('inspector.border.radius')} value={r.border.radius} min={0} max={24} format={(v) => `${v}px`} onChange={(v) => s.patchRecipe({ border: { radius: v } })} />
            </>
          )}
        </Panel>
      )}

      {/* ------------------------------------------------ MOTION */}
      {s.tab === 'motion' && (
        <Panel title={t('inspector.motion')}>
          <Field label={t('inspector.motion.entrance')}>
            <OptionGrid options={entranceNames.map((m) => ({ value: m, label: t(`motion.${m}` as never) }))} value={r.motion.entrance.type} onChange={(v) => s.patchRecipe({ motion: { entrance: { type: v as never } } })} />
          </Field>
          <Field label={t('inspector.motion.word')} hint={t('inspector.motion.wordHint')}>
            <OptionGrid options={wordMotionNames.map((m) => ({ value: m, label: t(`motion.${m}` as never) }))} value={r.motion.word.type} onChange={(v) => s.patchRecipe({ motion: { word: { type: v as never } } })} />
          </Field>
          <Field label={t('inspector.motion.exit')}>
            <OptionGrid options={exitNames.map((m) => ({ value: m, label: t(`motion.${m}` as never) }))} value={r.motion.exit.type} onChange={(v) => s.patchRecipe({ motion: { exit: { type: v as never } } })} />
          </Field>
          <Divider />
          <Slider label={t('inspector.motion.wordDuration')} value={r.motion.word.duration} min={100} max={400} step={10} format={(v) => `${v}ms`} onChange={(v) => s.patchRecipe({ motion: { word: { duration: v } } })} />
          <Slider label={t('inspector.motion.wordIntensity')} value={r.motion.word.intensity} min={0.4} max={1.6} step={0.05} format={(v) => `${v.toFixed(2)}×`} onChange={(v) => s.patchRecipe({ motion: { word: { intensity: v } } })} />
          <Slider label={t('inspector.motion.entranceDuration')} value={r.motion.entrance.duration} min={80} max={500} step={10} format={(v) => `${v}ms`} onChange={(v) => s.patchRecipe({ motion: { entrance: { duration: v } } })} />
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
  const { t } = useI18n();
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
    <Panel title={t('inspector.emphasis')}>
      <Field label={t('inspector.emphasis.auto')}>
        <div className="flex flex-col gap-1.5">
          {([
            ['numbers', t('inspector.emphasis.numbers')],
            ['percentages', t('inspector.emphasis.percentages')],
            ['currency', t('inspector.emphasis.currency')]
          ] as Array<['numbers' | 'percentages' | 'currency', string]>).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between rounded-[9px] border border-line bg-panel2 px-3 py-2">
              <span className="text-[11.5px] text-ink2">{label}</span>
              <input
                type="checkbox"
                checked={r.emphasis[key]}
                onChange={(e) => s.patchRecipe({ emphasis: { [key]: e.target.checked } })}
                className="h-3.5 w-3.5 accent-[#3B82F6]"
              />
            </label>
          ))}
          <label className="flex cursor-pointer items-center justify-between rounded-[9px] border border-line bg-panel2 px-3 py-2 opacity-60">
            <span className="text-[11.5px] text-ink2">{t('inspector.emphasis.ai')}</span>
            <input type="checkbox" checked={r.emphasis.aiEmphasis} disabled className="h-3.5 w-3.5" />
          </label>
        </div>
      </Field>

      <Divider />
      <Slider label={t('inspector.emphasis.numberScale')} value={r.number.scale} min={1} max={1.4} step={0.01} format={(v) => `${v.toFixed(2)}×`} onChange={(v) => s.patchRecipe({ number: { scale: v }, emphasis: { numberScale: v } })} />
      <Slider label={t('inspector.emphasis.numberWeight')} value={r.number.fontWeight} min={500} max={900} step={100} onChange={(v) => s.patchRecipe({ number: { fontWeight: v }, emphasis: { numberWeight: v } })} />
      <Slider label={t('inspector.emphasis.keywordWeight')} value={r.emphasis.keywordWeight} min={500} max={900} step={100} onChange={(v) => s.patchRecipe({ emphasis: { keywordWeight: v } })} />

      <Divider />
      <Field label={t('inspector.emphasis.keywords')}>
        <div className="flex gap-1.5">
          <input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
            placeholder={t('inspector.emphasis.keywordsPlaceholder')}
            className="min-w-0 flex-1 rounded-[9px] border border-line bg-panel2 px-2.5 py-1.5 text-[11.5px] text-ink outline-none placeholder:text-muted focus:border-accent/60"
          />
          <Btn size="sm" onClick={addKeyword}>{t('ui.add')}</Btn>
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
  const { t } = useI18n();
  const s = useCaptionStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [flash, setFlash] = useState('');

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(s.recipe, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${s.recipe.id}.json`;
    a.click();
    setFlash(t('inspector.recipes.exported'));
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
        setFlash(t('inspector.recipes.imported'));
      } catch {
        setFlash(t('inspector.recipes.importFail'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <Panel title={t('inspector.recipes')}>
      <Row gap={6}>
        <Btn size="sm" variant="primary" onClick={() => { s.saveRecipe(); setFlash(t('inspector.recipes.savedMsg')); }}>{t('inspector.recipes.saveCurrent')}</Btn>
        <Btn size="sm" onClick={exportJSON}>{t('inspector.recipes.exportJson')}</Btn>
        <Btn size="sm" onClick={() => fileRef.current?.click()}>{t('inspector.recipes.importJson')}</Btn>
      </Row>
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
      {flash && <p className="mt-2 font-mono text-[10px] text-accent">{flash}</p>}

      <Divider />
      {s.savedRecipes.length === 0 && (
        <p className="text-[11.5px] leading-relaxed text-muted">{t('inspector.recipes.empty')}</p>
      )}

      <div className="flex flex-col gap-1.5">
        {s.savedRecipes.map((r) => (
          <div key={r.id} className="rounded-[10px] border border-line bg-panel2 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <button className="truncate text-left text-[12px] font-medium text-ink hover:text-accent" onClick={() => s.replaceRecipe(r)} title={t('inspector.recipes.loadTip')}>
                {r.name}
              </button>
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">{r.category}</span>
            </div>
            <div className="mt-1.5 flex gap-1.5">
              <button className="text-[10.5px] text-muted hover:text-ink" onClick={() => s.duplicateRecipe(r.id)}>{t('ui.duplicate')}</button>
              <span className="text-line2">·</span>
              <button
                className="text-[10.5px] text-muted hover:text-ink"
                onClick={() => {
                  const n = window.prompt(t('ui.rename'), r.name);
                  if (n) s.renameRecipe(r.id, n);
                }}
              >
                {t('ui.rename')}
              </button>
              <span className="text-line2">·</span>
              <button className="text-[10.5px] text-muted hover:text-[#E63946]" onClick={() => s.deleteRecipe(r.id)}>{t('ui.delete')}</button>
            </div>
          </div>
        ))}
      </div>

      {s.savedRecipes.length > 0 && (
        <>
          <Divider />
          <Btn size="sm" onClick={exportAll}>{t('ui.exportAll')} ({s.savedRecipes.length})</Btn>
        </>
      )}

      <Divider />
      <p className="text-[10.5px] leading-relaxed text-muted">{t('inspector.recipes.note')}</p>
    </Panel>
  );
}
