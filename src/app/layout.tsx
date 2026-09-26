import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sera Subtitle Factory',
  description: 'Make captions move with every word. A caption design system for short-form video.'
};

const nav = [
  { href: '/', label: 'Home' },
  { href: '/studio', label: 'Studio' },
  { href: '/library', label: 'Library' },
  { href: '/recipes', label: 'Recipes' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-bg text-ink antialiased">
        <div className="flex h-[52px] items-center gap-6 border-b border-line bg-panel px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-ink text-[10px] font-bold text-[#0b0b0c]">S</span>
            <span className="text-[13px] font-semibold tracking-[-0.01em]">Sera Subtitle Factory</span>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-[7px] px-2.5 py-1.5 text-[12px] text-ink2 transition-all duration-150 ease-out hover:bg-[#17171a] hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-muted">v0.1 · phase 1</span>
        </div>
        {children}
      </body>
    </html>
  );
}
