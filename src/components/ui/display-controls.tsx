'use client';

import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

/** Theme + language switches. Shown in the top bar and on the home hero. */

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  const options: Array<{ v: 'light' | 'dark'; label: string; icon: React.ReactNode }> = [
    {
      v: 'light',
      label: t('ui.theme.light'),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
        </svg>
      )
    },
    {
      v: 'dark',
      label: t('ui.theme.dark'),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
        </svg>
      )
    }
  ];

  return (
    <div className="inline-flex items-center gap-0.5 rounded-[9px] border border-line bg-panel2 p-0.5" role="group" aria-label={t('ui.theme')}>
      {options.map((o) => {
        const on = theme === o.v;
        return (
          <button
            key={o.v}
            onClick={() => setTheme(o.v)}
            title={o.label}
            aria-pressed={on}
            className={[
              'flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-[11px] transition-all duration-150 ease-out',
              on ? 'bg-active text-ink' : 'text-muted hover:text-ink2'
            ].join(' ')}
          >
            {o.icon}
            {!compact && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();

  const options: Array<{ v: 'zh' | 'en'; label: string; short: string }> = [
    { v: 'zh', label: t('ui.lang.zh'), short: '中' },
    { v: 'en', label: t('ui.lang.en'), short: 'EN' }
  ];

  return (
    <div className="inline-flex items-center gap-0.5 rounded-[9px] border border-line bg-panel2 p-0.5" role="group" aria-label={t('ui.lang')}>
      {options.map((o) => {
        const on = lang === o.v;
        return (
          <button
            key={o.v}
            onClick={() => setLang(o.v)}
            title={o.label}
            aria-pressed={on}
            className={[
              'rounded-[7px] px-2 py-1 font-mono text-[11px] transition-all duration-150 ease-out',
              on ? 'bg-active text-ink' : 'text-muted hover:text-ink2'
            ].join(' ')}
          >
            {compact ? o.short : o.label}
          </button>
        );
      })}
    </div>
  );
}
