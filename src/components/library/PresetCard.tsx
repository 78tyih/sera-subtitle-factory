'use client';

import { useRouter } from 'next/navigation';
import type { CaptionRecipe } from '@/types/caption';
import { DemoTile } from '@/components/preview/DemoTile';
import { useCaptionStore } from '@/store/caption-store';
import { getTranscript } from '@/lib/demo-transcripts';
import { Badge } from '@/components/ui';
import { useI18n } from '@/lib/i18n';

const DEMO_FOR_CATEGORY: Record<string, string> = {
  Finance: 'demo-finance',
  Data: 'demo-numbers',
  Editorial: 'demo-podcast',
  Podcast: 'demo-podcast',
  Minimal: 'demo-tech',
  Clean: 'demo-finance',
  Kinetic: 'demo-mixed',
  Neon: 'demo-tech'
};

export function PresetCard({ recipe, width = 288 }: { recipe: CaptionRecipe; width?: number }) {
  const router = useRouter();
  const applyPreset = useCaptionStore((s) => s.usePreset);
  const { t } = useI18n();

  const transcript = getTranscript(DEMO_FOR_CATEGORY[recipe.category] ?? 'demo-finance');
  const accent = recipe.text.active;

  return (
    <article className="group overflow-hidden rounded-[14px] border border-line bg-panel transition-all duration-150 ease-out hover:-translate-y-[2px] hover:border-line2">
      <div className="relative bg-sunken p-3">
        <DemoTile recipe={recipe} words={transcript.words} width={width} className="overflow-hidden rounded-[10px]" />
        <span className="pointer-events-none absolute right-5 top-5 rounded-[5px] bg-black/50 px-1.5 py-[2px] font-mono text-[9px] uppercase tracking-[0.1em] text-white/70 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100">
          {t('ui.hoverToPlay')}
        </span>
      </div>

      <div className="border-t border-line px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-medium text-ink">{recipe.name}</h3>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{recipe.category}</span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted">{recipe.description}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <Badge>{recipe.background.type === 'none' ? 'no bg' : recipe.background.type}</Badge>
          <Badge>{recipe.motion.word.type}</Badge>
          <Badge>{recipe.motion.entrance.type}</Badge>
          <span className="ml-auto h-3 w-3 rounded-[4px] border border-white/15" style={{ background: accent }} title={`accent ${accent}`} />
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              applyPreset(recipe.id);
              router.push('/studio');
            }}
            className="flex-1 rounded-[9px] bg-ink px-3 py-2 text-[11.5px] font-medium text-bg transition-transform duration-150 ease-out hover:scale-[1.02]"
          >
            {t('ui.useTemplate')}
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(JSON.stringify(recipe, null, 2))}
            className="rounded-[9px] border border-line2 px-3 py-2 text-[11.5px] text-ink2 transition-colors duration-150 ease-out hover:bg-hover hover:text-ink"
            title="Copy recipe JSON"
          >
            {t('ui.copyJson')}
          </button>
        </div>
      </div>
    </article>
  );
}
