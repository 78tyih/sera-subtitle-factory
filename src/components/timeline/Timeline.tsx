'use client';

import { useMemo, useRef } from 'react';
import { useCaptionStore } from '@/store/caption-store';
import { useSegments, useScrub } from '@/lib/hooks';
import { activeWordIndex, findSegment, formatTime, resolveSegment } from '@/caption-engine/resolve';
import { getTranscript } from '@/lib/demo-transcripts';
import type { WordTimestamp } from '@/types/caption';
import { useI18n } from '@/lib/i18n';

/** words of the selected transcript */
export function useCurrentWords(): WordTimestamp[] {
  const transcriptId = useCaptionStore((s) => s.transcriptId);
  return useMemo(() => getTranscript(transcriptId).words, [transcriptId]);
}

/**
 * Bottom timeline — deliberately simple (spec §31):
 * Audio wave · Caption segments · Word timeline · Playhead. Not a video editor.
 */
export function Timeline({ time, duration, onSeek }: { time: number; duration: number; onSeek: (t: number) => void }) {
  const { t } = useI18n();
  const recipe = useCaptionStore((s) => s.recipe);
  const words = useCurrentWords();
  const { segments } = useSegments(words, recipe);

  const laneRef = useRef<HTMLDivElement>(null);
  useScrub(laneRef as React.RefObject<HTMLElement>, (ratio) => onSeek(ratio * duration));

  const active = useMemo(() => {
    const seg = findSegment(segments, time);
    return seg ? resolveSegment(seg, recipe, time) : null;
  }, [segments, recipe, time]);
  const activeIdx = active ? activeWordIndex(active) : -1;

  const pct = (t: number) => `${Math.max(0, Math.min(100, (t / duration) * 100))}%`;

  const wave = useMemo(() => {
    const n = 180;
    return Array.from({ length: n }, (_, i) => {
      const x = i / n;
      const a = Math.sin(x * 22) * 0.34 + Math.sin(x * 7.3) * 0.28 + 0.5;
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
          <span className="rounded-[6px] border border-line2 px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{t('studio.timeline.line')}</span>
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-3">
        <div className="flex w-[52px] shrink-0 flex-col gap-1.5 pt-[1px]">
          <span className="flex h-6 items-center font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{t('studio.timeline.audio')}</span>
          <span className="flex h-7 items-center font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{t('studio.timeline.caps')}</span>
          <span className="flex h-6 items-center font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{t('studio.timeline.words')}</span>
        </div>

        {/* scrub surface */}
        <div ref={laneRef} className="relative min-w-0 flex-1 cursor-col-resize select-none">
          {/* audio */}
          <div className="flex h-6 items-center gap-[2px] overflow-hidden rounded-[6px] bg-sunken px-1">
            {wave.map((w, i) => (
              <span key={i} className="w-[2px] shrink-0 rounded-full" style={{ height: `${w.h * 100}%`, background: w.spoken ? 'rgba(59,130,246,0.75)' : 'rgba(255,255,255,0.10)' }} />
            ))}
          </div>

          {/* caption segments */}
          <div data-seg-count={segments.length} className="relative mt-1.5 h-7 overflow-hidden rounded-[6px] bg-sunken">
            {segments.map((seg) => {
              const on = active?.id === seg.id;
              return (
                <div
                  key={seg.id}
                  data-seg={seg.words.map((w) => w.text).join('')}
                  className={[
                    'absolute bottom-1 top-1 overflow-hidden rounded-[4px] border px-2 text-[10px] leading-[18px] transition-all duration-150 ease-out',
                    on ? 'border-accent/60 bg-accent/15 text-ink' : 'border-line2 bg-panel2 text-ink2'
                  ].join(' ')}
                  style={{ left: pct(seg.start), width: `calc(${pct(seg.end - seg.start)} )`, minWidth: 22 }}
                  title={seg.words.map((w) => w.text).join('')}
                >
                  <span className="block truncate whitespace-nowrap">{seg.words.map((w) => w.text).join('')}</span>
                </div>
              );
            })}
          </div>

          {/* word timeline */}
          <div className="mt-1.5 flex h-6 items-center gap-[3px] overflow-hidden rounded-[6px] bg-sunken px-1.5">
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

          {/* playhead */}
          <div className="pointer-events-none absolute -top-1 bottom-0 z-10 w-px bg-accent/80" style={{ left: pct(time) }}>
            <span className="absolute -left-[3px] -top-[3px] h-[7px] w-[7px] rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
