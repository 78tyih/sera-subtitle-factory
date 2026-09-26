'use client';

import { useCaptionStore, type StudioTab } from '@/store/caption-store';
import { useI18n } from '@/lib/i18n';

/** Left sidebar — navigation only. Quiet icons, no colour noise. */

interface TabDef {
  id: StudioTab;
  labelKey: string;
  icon: React.ReactNode;
}

const I = (d: string) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const TABS: TabDef[] = [
  { id: 'templates', labelKey: 'studio.sidebar.templates', icon: I('M4 5h7v7H4zM13 5h7v4h-7zM13 12h7v7h-7zM4 15h7v4H4z') },
  { id: 'typography', labelKey: 'studio.sidebar.typography', icon: I('M4 6h16M9 6v13M15 6v8') },
  { id: 'colors', labelKey: 'studio.sidebar.colors', icon: I('M12 3a9 9 0 100 18h1.5a2.5 2.5 0 000-5H13a2 2 0 010-4h4a3 3 0 000-6 9 9 0 00-5-3z') },
  { id: 'background', labelKey: 'studio.sidebar.background', icon: I('M4 5h16v14H4zM4 10h16') },
  { id: 'border', labelKey: 'studio.sidebar.border', icon: I('M4 4h16v16H4zM8 4v16') },
  { id: 'motion', labelKey: 'studio.sidebar.motion', icon: I('M3 17c4 0 5-10 9-10s5 6 9 6') },
  { id: 'emphasis', labelKey: 'studio.sidebar.emphasis', icon: I('M6 18L12 4l6 14M9 14h6') },
  { id: 'recipes', labelKey: 'studio.sidebar.recipes', icon: I('M5 4h11l3 3v13H5zM9 9h6M9 13h4') }
];

export function Sidebar({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  const tab = useCaptionStore((s) => s.tab);
  const setTab = useCaptionStore((s) => s.setTab);
  const savedCount = useCaptionStore((s) => s.savedRecipes.length);

  return (
    <aside className={`flex w-[196px] shrink-0 flex-col border-r border-line bg-panel ${className}`}>
      <div className="flex h-[54px] items-center gap-2.5 border-b border-line px-4">
        <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-ink text-[10px] font-bold text-bg">S</span>
        <div className="leading-none">
          <div className="text-[12.5px] font-semibold tracking-[-0.01em] text-ink">{t('app.name')}</div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">studio</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {TABS.map((item) => {
          const on = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={[
                'mb-0.5 flex w-full items-center gap-2.5 rounded-[9px] px-3 py-2 text-left text-[12.5px] transition-all duration-150 ease-out',
                on ? 'bg-active text-ink' : 'text-ink2 hover:bg-hover hover:text-ink'
              ].join(' ')}
            >
              <span className={on ? 'text-ink' : 'text-muted'}>{item.icon}</span>
              <span className="flex-1">{t(item.labelKey as never)}</span>
              {item.id === 'recipes' && savedCount > 0 && (
                <span className="rounded-[5px] bg-chip px-1.5 py-[1px] font-mono text-[9.5px] text-ink2">{savedCount}</span>
              )}
              {on && <span className="h-1 w-1 rounded-full bg-accent" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <p className="text-[10px] leading-relaxed text-muted">
          {t('studio.locked')}
          <br />
          <span className="font-mono text-[9.5px]">{t('studio.lockedHint')}</span>
        </p>
      </div>
    </aside>
  );
}
