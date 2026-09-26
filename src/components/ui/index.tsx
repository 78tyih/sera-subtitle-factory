'use client';

import React from 'react';
import type { FontKey } from '@/types/caption';

/* ---------------------------------------------------------------- Panel */

export function Panel({ title, right, children, className = '' }: { title?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[14px] border border-line bg-panel ${className}`}>
      {title && (
        <header className="flex items-center justify-between px-4 pt-3.5 pb-2">
          <h3 className="text-[10.5px] uppercase tracking-[0.14em] text-muted">{title}</h3>
          {right}
        </header>
      )}
      <div className="px-4 pb-4">{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------------- Field */

export function Field({ label, value, children, hint }: { label: string; value?: React.ReactNode; children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[11.5px] text-ink2">{label}</span>
        {value !== undefined && <span className="font-mono text-[10.5px] text-muted">{value}</span>}
      </div>
      {children}
      {hint && <p className="mt-1 text-[10.5px] text-muted">{hint}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- Slider */

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  format
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  label: string;
  format?: (v: number) => string;
}) {
  return (
    <Field label={label} value={format ? format(value) : value}>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </Field>
  );
}

/* ---------------------------------------------------------------- Segmented */

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  size = 'md',
  full = false
}: {
  options: Array<{ value: T; label: React.ReactNode; title?: string }>;
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
  full?: boolean;
}) {
  return (
    <div className={`inline-flex gap-1 rounded-[10px] border border-line bg-sunken p-1 ${full ? 'w-full' : ''}`}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            title={o.title}
            className={[
              'rounded-[7px] transition-all duration-150 ease-out',
              size === 'sm' ? 'px-2 py-1 text-[10.5px]' : 'px-2.5 py-1.5 text-[11.5px]',
              full ? 'flex-1' : '',
              on ? 'bg-chip text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'text-ink2 hover:bg-hover hover:text-ink'
            ].join(' ')}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Ratio icon */

/** Aspect-ratio switcher icon: a little rectangle, no text. */
export function RatioIcon({ ratio }: { ratio: string }) {
  const dims: Record<string, [number, number]> = {
    '16:9': [20, 11],
    '4:3': [18, 13],
    '1:1': [15, 15],
    '9:16': [11, 20],
    '4:5': [13, 17]
  };
  const [w, h] = dims[ratio] ?? [18, 11];
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" aria-hidden>
      <rect x={(24 - w) / 2} y={(22 - h) / 2} width={w} height={h} rx={2.5} fill="none" stroke="currentColor" strokeWidth={1.8} />
    </svg>
  );
}

/* ---------------------------------------------------------------- Swatches + HEX */

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const normalize = (v: string) => {
  const m = HEX_RE.exec(v.trim());
  if (!m) return null;
  const hex = m[1];
  return ('#' + (hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex)).toUpperCase();
};

export function Swatches({
  colors,
  value,
  onChange,
  allowCustom = true
}: {
  colors: string[];
  value: string;
  onChange: (c: string) => void;
  allowCustom?: boolean;
}) {
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => setDraft(value), [value]);

  const commit = (v: string) => {
    const hex = normalize(v);
    if (hex) onChange(hex);
    else setDraft(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {colors.map((c) => (
          <button
            key={c}
            title={c}
            onClick={() => onChange(c)}
            className={[
              'h-6 w-6 rounded-[7px] border transition-transform duration-150 ease-out hover:scale-110',
              value.toLowerCase() === c.toLowerCase() ? 'border-ink ring-1 ring-ink/40' : 'border-line2'
            ].join(' ')}
            style={{ background: c }}
          />
        ))}
        {allowCustom && (
          <label className="relative h-6 w-6 cursor-pointer overflow-hidden rounded-[7px] border border-line2" title="Color picker">
            <span className="pointer-events-none absolute inset-0" style={{ background: value }} />
            <input
              type="color"
              value={normalize(value) ?? '#000000'}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        )}
      </div>

      {allowCustom && (
        <div className="flex items-center gap-1.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commit((e.target as HTMLInputElement).value)}
            placeholder="#FFD400"
            spellCheck={false}
            className="w-[104px] rounded-[7px] border border-line bg-sunken px-2 py-1 font-mono text-[11px] uppercase text-ink outline-none placeholder:text-muted focus:border-accent/60"
          />
          <span className="font-mono text-[10px] text-muted">HEX</span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Icon button */

export function IconBtn({
  children,
  onClick,
  title,
  active,
  disabled
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={[
        'grid h-9 w-9 place-items-center rounded-[10px] transition-all duration-150 ease-out disabled:opacity-35',
        active ? 'bg-hover text-ink' : 'text-ink2 hover:bg-hover hover:text-ink'
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- Button */

export function Btn({
  children,
  onClick,
  variant = 'ghost',
  size = 'md',
  disabled,
  title
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'ghost' | 'primary' | 'subtle';
  size?: 'sm' | 'md';
  disabled?: boolean;
  title?: string;
}) {
  const styles = {
    ghost: 'border border-line2 bg-panel text-ink2 hover:bg-hover hover:text-ink',
    primary: 'bg-ink text-bg hover:opacity-90',
    subtle: 'bg-chip text-ink2 hover:bg-hover hover:text-ink'
  }[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        'rounded-[9px] font-medium transition-all duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' ? 'px-2.5 py-1.5 text-[11px]' : 'px-3.5 py-2 text-[12.5px]',
        styles
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- misc */

export function Row({ children, gap = 8, wrap = true }: { children: React.ReactNode; gap?: number; wrap?: boolean }) {
  return (
    <div className={`flex items-center ${wrap ? 'flex-wrap' : ''}`} style={{ gap }}>
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="my-3 h-px w-full bg-line" />;
}

export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'accent' | 'warn' }) {
  const map = {
    default: 'border-line2 text-muted',
    accent: 'border-accent/40 text-accent',
    warn: 'border-highlight/40 text-highlight'
  }[tone];
  return <span className={`rounded-[5px] border px-1.5 py-[2px] font-mono text-[9.5px] uppercase tracking-[0.08em] ${map}`}>{children}</span>;
}

export type { FontKey };
