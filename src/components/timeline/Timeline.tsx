'use client';

import { useMemo, useRef } from 'react';
import { useCaptionStore } from '@/store/caption-store';
import { useSegments, useScrub } from '@/lib/hooks';
import { activeWordIndex, findSegment, formatTime, resolveSegment } from '@/caption-engine/resolve';
import { getTranscript } from '@/lib/demo-transcripts';
import { useI18n } from '@/lib/i18n';
import type { WordTimestamp } from '@/types/caption';

export function useCurrentWords(): WordTimestamp[] {
  const transcriptId = useCaptionStore((s) => s.transcriptId);
  const customWords = useCaptionStore((s) => s.customWords);
  void getTranscript;
  return useMemo(() => customWords ?? getTranscript(transcriptId).words, [transcriptId, customWords]);
}

/**
 * Timeline — audio wave / caption segments / word ticks / playhead.
 * The playhead lives INSIDE the track column so it shares one coordinate
 * system with the wave and the segments (before, it was positioned against a
 * container that also held the label gutter, so it looked out of sync).
 */
export function Timeline({ time, duration, onSeek }: { time: number; duration: number; onSeek: (t: number) => void }) {
  const { t } = useI18n();
  const recipe = useCaptionStore((s) => s.recipe);
  const words = useCurrentWords();
  const { segments } = useSegments(words, recipe);

  const trackRef = useRef<HTMLDivElement>(null);
  useScrub(trackRef as React.RefObject<HTMLElement>, (ratio) => onSeek(ratio * duration));

  const active = useMemo(() => {
    const seg = findSegment(segments, time);
    return seg ? resolveSegment(seg, recipe, time) : null;
  }, [segments, recipe, time]);
  const activeIdx = active ? activeWordIndex(active) : -1;

  const pct = (v: number) => {
    const safe = Math.max(duration, 0.001);
    return `${Math.max(0, Math.min(100, (v / safe) * 100))}%`;
  };

  const wave = useMemo(() => {
    const n = 168;
    return Array.from({ length: n }, (_, i) => {
      const x = i / n;
      const a = Math.sin(x * 21) * 0.34 + Math.sin(x * 7.1) * 0.28 + 0.5;
      return { h: Math.max(0.12, Math.min(1, a)), spoken: x * duration <= time };
    });
  }, [duration, time]);

  return (
    <div className="border-t border-line bg-panel">
      <div className="flex items-center gap-3 px-4 py-2">
        <span className="font-mono text-[10.5px] text-ink2">
          {formatTime(time)} <span className="text-muted">/ {formatTime(duration)}</span>
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="rounded-[6px] border border-line2 px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">
            {active ? active.words.length : 0} {t('studio.timeline.wordsCount')}
          </span>
          <span className="rounded-[6px] border border-line2 px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">
            {segments.length} {t('studio.timeline.segments')}
          </span>
          <span className="rounded-[6px] border border-line2 px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">
            {t('studio.timeline.line')}
          </span>
        </div>
      </div>

      <div className="flex gap-2.5 px-4 pb-3">
        <div className="flex w-[42px] shrink-0 flex-col gap-1.5 pt-[1px]">
          <span className="flex h-5 items-center font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
            {t('studio.timeline.audio')}
          </span>
          <span className="flex h-7 items-center font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
            {t('studio.timeline.caps')}
          </span>
          <span className="flex h-5 items-center font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
            {t('studio.timeline.words')}
          </span>
        </div>

        <div ref={trackRef} className="relative min-w-0 flex-1 cursor-col-resize select-none">
          <div className="flex h-5 items-center gap-[2px] overflow-hidden rounded-[6px] bg-sunken px-1">
            {wave.map((w, i) => (
              <span
                key={i}
                className="w-[2px] shrink-0 rounded-full"
                style={{
                  height: `${w.h * 100}%`,
                  background: w.spoken ? 'rgb(var(--c-accent))' : 'rgba(128,128,128,0.28)'
                }}
              />
            ))}
          </div>

          <div className="relative mt-1.5 h-7 overflow-hidden rounded-[6px] bg-sunken">
            {segments.map((seg) => {
              const on = active?.id === seg.id;
              return (
                <div
                  key={seg.id}
                  data-seg={seg.words.map((w) => w.text).join('')}
                  className={[
                    'absolute bottom-1 top-1 overflow-hidden rounded-[4px] border px-2 text-[10px] leading-[22px] transition-all duration-150 ease-out',
                    on ? 'border-accent/60 bg-accent/15 text-ink' : 'border-line2 bg-panel2 text-ink2'
                  ].join(' ')}
                  style={{ left: pct(seg.start), width: `calc(${pct(seg.end - seg.start)})`, minWidth: 22 }}
                  title={seg.words.map((w) => w.text).join('')}
                >
                  <span className="block truncate whitespace-nowrap">{seg.words.map((w) => w.text).join('')}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-1.5 flex h-5 items-center gap-[3px] overflow-hidden rounded-[6px] bg-sunken px-1.5">
            {active?.words.map((w, i) => (
              <span
                key={w.id}
                className={[
                  'shrink-0 rounded-[3px] px-1 py-[2px] text-[9.5px] leading-none transition-all duration-150 ease-out',
                  i === activeIdx ? 'bg-accent text-white' : w.isSpoken ? 'text-ink2' : 'text-muted'
                ].join(' ')}
                title={`${w.text} · ${formatTime(w.start)} → ${formatTime(w.end)} · ${w.type}`}
              >
                {w.text}
              </span>
            ))}
            {!active && <span className="text-[9.5px] text-muted">—</span>}
          </div>

          <div
            className="pointer-events-none absolute -top-1 bottom-0 z-10 w-[1.5px] bg-accent"
            style={{ left: pct(time) }}
          >
            <span className="absolute -left-[3.5px] -top-[3px] h-[8px] w-[8px] rounded-full bg-accent" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3">
        <span className="font-mono text-[9.5px] text-muted">{t('studio.timeline.scrub')}</span>
        <span className="truncate font-mono text-[9.5px] text-muted">{active?.text ?? ''}</span>
      </div>
    </div>
  );
}
