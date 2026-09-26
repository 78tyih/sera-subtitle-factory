import type { WordTimestamp } from '@/types/caption';
import { tokenize, CJK, PUNC } from './lexicon';

/**
 * Demo transcripts with FAKE but realistic word-level timestamps.
 * Phase 1 runs on these; Phase 2 replaces them with faster-whisper output.
 */

let seq = 0;
const wid = () => `w${++seq}`;

interface SynthOpts {
  /** seconds per CJK character */
  cjkRate?: number;
  /** seconds per latin word */
  latinRate?: number;
  /** pause after punctuation */
  pause?: number;
}

/** Speech-style tokens via the domain lexicon (see lib/lexicon.ts). */
export function tokenizeForSpeech(text: string): string[] {
  return tokenize(text);
}

/** Build fake word timestamps for a line of text. */
export function synthesizeWords(text: string, start = 0, opts: SynthOpts = {}): WordTimestamp[] {
  const cjkRate = opts.cjkRate ?? 0.17;
  const latinRate = opts.latinRate ?? 0.26;
  const pause = opts.pause ?? 0.22;
  let t = start;
  const words: WordTimestamp[] = [];

  for (const tok of tokenizeForSpeech(text)) {
    const isPunc = PUNC.test(tok) && tok.length === 1;
    if (isPunc) {
      t += 0.06;
      if (words.length) words[words.length - 1].end += pause;
      t += pause;
      continue;
    }
    const cjkCount = [...tok].filter((c) => CJK.test(c)).length;
    const latinCount = tok.length - cjkCount;
    const dur = Math.max(0.16, cjkCount * cjkRate + latinCount * latinRate);
    words.push({ id: wid(), text: tok, start: +t.toFixed(3), end: +(t + dur).toFixed(3), confidence: 0.94 });
    t += dur;
  }
  return words;
}

export interface DemoTranscript {
  id: string;
  title: string;
  language: 'zh' | 'en' | 'mixed';
  text: string;
  words: WordTimestamp[];
}

const FINANCE_TEXT = '比特币今天上涨 12%，市场重新回到了关键位置。';
const TECH_TEXT = '模型推理速度提升了 3 倍，成本却下降了 40%。';
const PODCAST_TEXT = '真正重要的是资金正在流向哪里，而不是别人在说什么。';
const MIXED_TEXT = 'BTC 今天上涨 12%，价格来到 $68,500。';
const LONG_TEXT = '今天比特币市场出现了非常明显的价格波动同时整个加密货币市场的成交量也快速上升';
const DATA_TEXT = 'BTC +12.5% ETH $4,280 24H Volume $18.6B Funding Rate 0.021% Revenue +35%';

export const demoTranscripts: DemoTranscript[] = [
  { id: 'demo-finance', title: 'Finance · 行情播报', language: 'mixed', text: FINANCE_TEXT, words: synthesizeWords(FINANCE_TEXT) },
  { id: 'demo-tech', title: 'Tech · 产品发布', language: 'zh', text: TECH_TEXT, words: synthesizeWords(TECH_TEXT) },
  { id: 'demo-podcast', title: 'Podcast · 观点输出', language: 'zh', text: PODCAST_TEXT, words: synthesizeWords(PODCAST_TEXT) },
  { id: 'demo-mixed', title: 'Mixed · 中英混排', language: 'mixed', text: MIXED_TEXT, words: synthesizeWords(MIXED_TEXT) },
  { id: 'demo-numbers', title: 'Data · 数字识别测试', language: 'mixed', text: DATA_TEXT, words: synthesizeWords(DATA_TEXT) },
  { id: 'demo-long', title: 'Long · 单行分段测试', language: 'zh', text: LONG_TEXT, words: synthesizeWords(LONG_TEXT) }
];

/** Verify the single-line rule on the long demo: it must split, not wrap. */
export const LONG_DEMO_ID = 'demo-long';

export const DEFAULT_DEMO_ID = 'demo-finance';
export const STUDIO_DEMO_TEXT = 'BTC 今天上涨 12%，市场重新回到了关键位置。';

export function getTranscript(id: string): DemoTranscript {
  return demoTranscripts.find((d) => d.id === id) ?? demoTranscripts[0];
}
