import Link from 'next/link';
import { flagshipPresets, presets } from '@/presets';
import { getTranscript } from '@/lib/demo-transcripts';
import { CaptionStage } from '@/components/preview/CaptionStage';
import { DemoTile } from '@/components/preview/DemoTile';

const HOME_DEMOS: Array<{ presetId: string; transcriptId: string; label: string }> = [
  { presetId: 'sera-finance-yellow', transcriptId: 'demo-finance', label: 'Finance Yellow' },
  { presetId: 'sera-finance-blue', transcriptId: 'demo-finance', label: 'Finance Blue' },
  { presetId: 'sera-editorial', transcriptId: 'demo-podcast', label: 'Editorial' },
  { presetId: 'sera-left-bar', transcriptId: 'demo-podcast', label: 'Left Bar' },
  { presetId: 'sera-data-focus', transcriptId: 'demo-numbers', label: 'Data Focus' },
  { presetId: 'sera-minimal-black', transcriptId: 'demo-tech', label: 'Minimal Black' }
];

export default function HomePage() {
  const finance = getTranscript('demo-finance');
  const hero = presets.find((p) => p.id === 'sera-finance-yellow')!;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-16">
      {/* ------------------------------------------------------------ hero */}
      <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1fr_300px]">
        <div>
          <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">caption design system</p>
          <h1 className="text-[42px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
            Make captions move
            <br />
            with every word.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink2">
            让每一个字，都跟着声音动。
            <br />
            <span className="text-muted">单行字幕 · 语音驱动 · 数字放大 · 像设计 UI 一样设计字幕。</span>
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link href="/studio" className="rounded-[10px] bg-ink px-5 py-2.5 text-[13px] font-medium text-[#0b0b0c] transition-transform duration-150 ease-out hover:scale-[1.02]">
              Open Studio
            </Link>
            <Link href="/library" className="rounded-[10px] border border-line2 px-5 py-2.5 text-[13px] text-ink2 transition-colors duration-150 ease-out hover:bg-[#17171a] hover:text-ink">
              Browse Library
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            <span>12 presets</span>
            <span>9 word motions</span>
            <span>single line locked</span>
            <span>numbers ×1.20</span>
          </div>
        </div>

        <div className="mx-auto">
          <CaptionStage recipe={hero} words={finance.words} time={finance.words[3]?.start ?? 1} width={300} showSafeArea={false} backdrop="finance" animate={false} className="shadow-[0_20px_60px_rgba(0,0,0,0.5)]" />
        </div>
      </section>

      {/* ------------------------------------------------------------ demos */}
      <section className="mt-20">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">Caption demos</h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">loop · 9:16</span>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {HOME_DEMOS.map((d) => {
            const recipe = presets.find((p) => p.id === d.presetId)!;
            const transcript = getTranscript(d.transcriptId);
            return (
              <div key={d.presetId}>
                <DemoTile recipe={recipe} words={transcript.words} width={168} autoplay className="shadow-[0_14px_40px_rgba(0,0,0,0.45)]" />
                <div className="mt-2.5 text-[11.5px] text-ink2">{d.label}</div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">{recipe.category}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ principles */}
      <section className="mt-20 grid gap-5 md:grid-cols-3">
        {[
          { t: 'Single line, always', d: '字幕永远只有一行。超长就重新分段，绝不换行。maxLines = 1 · nowrap。' },
          { t: 'Speech-driven', d: '每个词带 start / end，字幕跟着念稿逐词变化：idle → active → spoken。' },
          { t: 'Numbers are heroes', d: '百分比、货币、数字自动识别并放大 1.20×，字重 800 —— 金融内容的核心视觉。' }
        ].map((c) => (
          <div key={c.t} className="rounded-[14px] border border-line bg-panel p-5">
            <h3 className="text-[13.5px] font-medium text-ink">{c.t}</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">{c.d}</p>
          </div>
        ))}
      </section>

      {/* ------------------------------------------------------------ flagship */}
      <section className="mt-20">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">The four flagship styles</h2>
          <Link href="/library" className="text-[12px] text-accent hover:underline">
            查看全部 12 个 →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {flagshipPresets.map((p) => (
            <Link key={p.id} href={`/studio?preset=${p.id}`} className="group rounded-[14px] border border-line bg-panel p-3 transition-all duration-150 ease-out hover:border-line2">
              <DemoTile recipe={p} words={getTranscript('demo-finance').words} width={228} aspect="16:9" autoplay className="overflow-hidden rounded-[10px]" />
              <div className="mt-3 text-[12.5px] font-medium text-ink">{p.name}</div>
              <div className="mt-1 text-[11px] leading-relaxed text-muted">{p.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
