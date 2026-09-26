'use client';

import type { BackgroundStyle, BorderStyle } from '@/types/caption';
import { resolveBackground } from '../backgrounds';
import { resolveBorder } from '../borders';

/**
 * BackgroundRenderer — the caption shell.
 * Painted from BackgroundStyle + BorderStyle primitives.
 * Never a pill / capsule (spec §13).
 */

export interface BackgroundRendererProps {
  background: BackgroundStyle;
  border: BorderStyle;
  /** reference-canvas scale factor */
  k: number;
  children: React.ReactNode;
}

export function BackgroundRenderer({ background, border, k, children }: BackgroundRendererProps) {
  const bg = resolveBackground(background);
  const bd = resolveBorder(border);

  const padX = (background.paddingX + bd.padLeft) * k;
  const padY = background.paddingY * k;

  const shell: React.CSSProperties = {
    position: 'relative',
    display: bg.boxed ? 'inline-block' : 'block',
    background: bg.background,
    backdropFilter: bg.backdropFilter,
    border: bg.border ?? bd.shell.border,
    borderRadius: bg.boxed ? (bg.borderRadius ?? 0) * k : bd.shell.borderRadius,
    padding: bg.boxed || bd.bar || bd.bottomRule ? `${padY}px ${padX}px` : undefined,
    paddingLeft: bd.bar ? padX : undefined
  };

  const barW = bd.bar ? Math.max(3, Math.min(6, bd.bar.width)) * k : 0;

  return (
    <div style={shell}>
      {bd.bar && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: padY * 0.9,
            bottom: padY * 0.9,
            width: barW,
            background: bd.bar.color,
            borderRadius: bd.bar.radius * k,
            display: 'block'
          }}
        />
      )}
      {children}
      {bd.bottomRule && (
        <span
          style={{
            position: 'absolute',
            left: padX,
            right: padX,
            bottom: padY * 0.45,
            height: Math.max(2, bd.bottomRule.height) * k,
            background: bd.bottomRule.color,
            display: 'block',
            borderRadius: 2
          }}
        />
      )}
    </div>
  );
}
