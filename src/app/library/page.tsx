'use client';

import { useMemo, useState } from 'react';
import { presets, presetCategories } from '@/presets';
import { PresetCard } from '@/components/library/PresetCard';
import { Segmented } from '@/components/ui';
import { useCaptionStore } from '@/store/caption-store';
import { useI18n } from '@/lib/i18n';

type BgFilter = 'all' | 'none' | 'light' | 'dark';
type MotionFilter = 'all' | 'highlight' | 'pop' | 'float' | 'slideUp' | 'scale' | 'glow';
type HighlightFilter = 'all' | 'yellow' | 'blue' | 'white';

const isLightBg = (t: string) => t === 'white' || t === 'white92';

export default function LibraryPage() {
  const { t } = useI18n();
  const savedRecipes = useCaptionStore((s) => s.savedRecipes);

  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('All');
  const [bg, setBg] = useState<BgFilter>('all');
  const [motion, setMotion] = useState<MotionFilter>('all');
  const [highlight, setHighlight] = useState<HighlightFilter>('all');

  const all = useMemo(() => [...presets, ...savedRecipes], [savedRecipes]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((p) => {
      if (cat !== 'All' && p.category !== cat) return false;

      if (bg === 'none' && p.background.type !== 'none') return false;
      if (bg === 'light' && !isLightBg(p.background.type)) return false;
      if (bg === 'dark' && isLightBg(p.background.type)) return false;

      if (motion !== 'all' && p.motion.word.type !== motion && p.motion.entrance.type !== motion) return false;

      if (highlight !== 'all') {
        const a = (p.text.active + p.text.keyword).toLowerCase();
        if (highlight === 'yellow' && !a.includes('ffd400')) return false;
        if (highlight === 'blue' && !a.includes('3b82f6')) return false;
        if (highlight === 'white' && !a.includes('ffffff')) return false;
      }

      if (needle) {
        const hay = [p.name, p.category, p.description ?? '', ...(p.tags ?? []), p.background.type, p.motion.word.type].join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [all, q, cat, bg, motion, highlight]);

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-24 pt-10">
      <header className="mb-7">
        <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{t('library.kicker')}</p>
        <h1 className="text-[30px] font-semibold tracking-[-0.025em]">{t('library.title')}</h1>
        <p className="mt-2 max-w-[620px] text-[13px] leading-relaxed text-ink2">{t('library.subtitle')}</p>
      </header>

      {/* filters */}
      <div className="mb-6 rounded-[14px] border border-line bg-panel p-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('library.searchPlaceholder')}
            className="min-w-[240px] flex-1 rounded-[9px] border border-line bg-panel2 px-3 py-2 text-[12.5px] text-ink outline-none placeholder:text-muted focus:border-accent/60"
          />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">{list.length} / {all.length}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
          <FilterGroup label={t('library.filter.style')}>
            <Segmented size="sm" options={[{ value: 'All', label: t('ui.all') }, ...presetCategories.filter((c) => presets.some((p) => p.category === c)).map((c) => ({ value: c, label: c }))]} value={cat} onChange={(v) => setCat(String(v))} />
          </FilterGroup>

          <FilterGroup label={t('library.filter.background')}>
            <Segmented
              size="sm"
              options={[
                { value: 'all', label: t('library.filter.bg.all') },
                { value: 'none', label: t('library.filter.bg.none') },
                { value: 'light', label: t('library.filter.bg.light') },
                { value: 'dark', label: t('library.filter.bg.dark') }
              ]}
              value={bg}
              onChange={(v) => setBg(v as BgFilter)}
            />
          </FilterGroup>

          <FilterGroup label={t('library.filter.motion')}>
            <Segmented
              size="sm"
              options={[
                { value: 'all', label: t('ui.all') },
                { value: 'highlight', label: 'Highlight' },
                { value: 'pop', label: 'Pop' },
                { value: 'float', label: 'Float' },
                { value: 'slideUp', label: 'Slide' },
                { value: 'scale', label: 'Scale' },
                { value: 'glow', label: 'Glow' }
              ]}
              value={motion}
              onChange={(v) => setMotion(v as MotionFilter)}
            />
          </FilterGroup>

          <FilterGroup label={t('library.filter.highlight')}>
            <Segmented
              size="sm"
              options={[
                { value: 'all', label: t('ui.any') },
                { value: 'yellow', label: t('ui.yellow') },
                { value: 'blue', label: t('ui.blue') },
                { value: 'white', label: t('ui.white') }
              ]}
              value={highlight}
              onChange={(v) => setHighlight(v as HighlightFilter)}
            />
          </FilterGroup>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <PresetCard key={p.id} recipe={p} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="rounded-[14px] border border-line bg-panel p-10 text-center text-[12.5px] text-muted">{t('library.empty')}</div>
      )}
    </main>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">{label}</span>
      {children}
    </div>
  );
}
