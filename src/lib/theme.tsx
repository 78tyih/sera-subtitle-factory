'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/** Theme — dark first, light fully supported. Persisted, SSR-safe (no flash). */

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'ssf-theme';

interface ThemeValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue>({ theme: 'dark', setTheme: () => {}, toggle: () => {} });

/** Runs before paint (inlined in <head>) to avoid a flash of the wrong theme. */
export const themeBootScript = `(function(){try{var k='${STORAGE_KEY}';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:'dark';document.documentElement.dataset.theme=t;var l=localStorage.getItem('ssf-lang');if(l==='zh'||l==='en'){document.documentElement.lang=l==='zh'?'zh-CN':'en';}}catch(e){}})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const attr = document.documentElement.dataset.theme;
    const saved = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null) as Theme | null;
    if (saved === 'dark' || saved === 'light') setThemeState(saved);
    else if (attr === 'light' || attr === 'dark') setThemeState(attr);
    else setThemeState('dark'); /* dark first (spec §50) */
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
      document.documentElement.dataset.theme = t;
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
