import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        panel: '#0F0F10',
        panel2: '#141416',
        line: '#1F1F22',
        line2: '#2A2A2E',
        ink: '#EDEDED',
        ink2: '#B4B4B8',
        muted: '#7A7A80',
        accent: '#3B82F6',
        highlight: '#FFD400'
      },
      borderRadius: {
        card: '14px',
        pill: '999px'
      },
      fontFamily: {
        sans: ['Inter', 'Geist', '-apple-system', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Geist Mono', 'Menlo', 'Consolas', 'monospace'],
        editorial: ['Georgia', 'Songti SC', 'Source Han Serif SC', 'Times New Roman', 'serif']
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 0.68, 0.24, 1)'
      }
    }
  },
  plugins: []
};

export default config;
