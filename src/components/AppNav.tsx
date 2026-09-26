'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { LangToggle, ThemeToggle } from '@/components/ui/display-controls';

export function AppNav() {
  const { t, lang } = useI18n();
  const pathname = usePathname();

  const items = [
    { href: '/', label: t('nav.home') },
    { href: '/studio', label: t('nav.studio') },
    { href: '/library', label: t('nav.library') },
    { href: '/recipes', label: t('nav.recipes') }
  ];

  return (
    <div className="sticky top-0 z-30 flex h-[52px] items-center gap-6 border-b border-line bg-panel/95 px-5 backdrop-blur">
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-ink text-[10px] font-bold text-bg">S</span>
        <span className="text-[13px] font-semibold tracking-[-0.01em]">{t('app.name')}</span>
      </Link>

      <nav className="flex items-center gap-1">
        {items.map((n) => {
          const on = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={[
                'rounded-[7px] px-2.5 py-1.5 text-[12px] transition-all duration-150 ease-out',
                on ? 'bg-active text-ink' : 'text-ink2 hover:bg-hover hover:text-ink'
              ].join(' ')}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <LangToggle />
        <span className="ml-1 hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted lg:inline">
          {t('app.version')}
        </span>
        <span className="sr-only">{lang}</span>
      </div>
    </div>
  );
}
