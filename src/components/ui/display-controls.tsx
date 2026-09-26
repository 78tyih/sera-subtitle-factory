'use client';

import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

/**
 * Theme + language switches — icon only (no labels), per design review:
 * less text, keep the icons.
 */

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const light = theme === 'light';

  return (
    <button
      onClick={toggle}
      title={`${t('ui.theme')} · ${light ? t('ui.theme.dark') : t('ui.theme.light')}`}
      aria-label={t('ui.theme')}
      className="grid h-8 w-8 place-items-center rounded-[9px] border border-line bg-panel2 text-ink2 transition-all duration-150 ease-out hover:border-line2 hover:text-ink"
    >
      {light ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
        </svg>
      )}
    </button>
  );
}

export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  const next = lang === 'zh' ? 'en' : 'zh';

  return (
    <button
      onClick={() => setLang(next)}
      title={`${t('ui.lang')} · ${lang === 'zh' ? 'English' : '中文'}`}
      aria-label={t('ui.lang')}
      className="flex h-8 items-center gap-1.5 rounded-[9px] border border-line bg-panel2 px-2 text-ink2 transition-all duration-150 ease-out hover:border-line2 hover:text-ink"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
      </svg>
      <span className="font-mono text-[11px] tracking-wide">{lang === 'zh' ? '中' : 'EN'}</span>
    </button>
  );
}
