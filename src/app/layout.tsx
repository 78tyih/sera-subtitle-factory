import type { Metadata } from 'next';
import './globals.css';
import { AppNav } from '@/components/AppNav';
import { ThemeProvider, themeBootScript } from '@/lib/theme';
import { I18nProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Sera Subtitle Factory',
  description: 'Make captions move with every word. 单行 · 语音驱动 · 数字放大 · 像设计 UI 一样设计字幕。'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* theme + language boot: runs before paint so there is no flash */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="bg-bg text-ink antialiased">
        <ThemeProvider>
          <I18nProvider>
            <AppNav />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
