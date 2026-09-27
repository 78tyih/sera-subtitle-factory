'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export function AppNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  const items = [
    { href: '/', label: t('nav.home' as never) },
    { href: '/studio', label: t('nav.studio' as never) },
    { href: '/library', label: t('nav.library' as never) },
    { href: '/recipes', label: t('nav.recipes' as never) },
  ];

  return (
    <div className="flex h-[52px] items-center gap-6 border-b border-line bg-panel px-5">
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-ink text-[10px] font-bold text-bg">
          S
        </span>
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{t('app.name' as never)}</span>
      </Link>

      <nav className="flex items-center gap-1">
        {items.map((n) => {
          const on = n.href === '/' ? pathname === '/' || pathname.startsWith('/index') : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={
                'rounded-[7px] px-2.5 py-1.5 text-[12px] transition-all duration-150 ease-out ' +
                (on ? 'bg-active text-ink' : 'text-ink2 hover:bg-hover hover:text-ink')
              }
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        {t('app.powered' as never)}
      </span>
    </div>
  );
}
