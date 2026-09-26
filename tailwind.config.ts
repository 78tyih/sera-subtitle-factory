import type { Config } from 'tailwindcss';

/** Colours resolve to CSS variables so both themes share one class vocabulary. */
const c = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        stage: c('stage'),
        panel: c('panel'),
        panel2: c('panel2'),
        sunken: c('sunken'),
        hover: c('hover'),
        active: c('active'),
        chip: c('chip'),
        line: c('line'),
        line2: c('line2'),
        ink: c('ink'),
        ink2: c('ink2'),
        muted: c('muted'),
        accent: c('accent'),
        highlight: c('highlight')
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
