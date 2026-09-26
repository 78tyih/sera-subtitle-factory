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
  titleEn: string;
  language: 'zh' | 'en' | 'mixed';
  text: string;
  words: WordTimestamp[];
}

const BASIC_TEXT = '让每一个字都跟着声音动起来。';
const DESIGN_TEXT = '好的设计，从留白开始。';
const STORY_TEXT = '慢一点，把细节做好。';
const SIMPLE_TEXT = '设计，让复杂的事情变得简单。';
const LONG_TEXT = '一个真正可扩展的系统，应该让每个组件都能被单独替换和复用';
const DATA_TEXT = '响应 0.5 秒，内存占用 42%。';

export const demoTranscripts: DemoTranscript[] = [
  { id: 'demo-finance', title: '基础 · 通用示例', titleEn: 'Basic · generic', language: 'zh', text: BASIC_TEXT, words: synthesizeWords(BASIC_TEXT) },
  { id: 'demo-tech', title: '设计 · 排版', titleEn: 'Design · typography', language: 'zh', text: DESIGN_TEXT, words: synthesizeWords(DESIGN_TEXT) },
  { id: 'demo-podcast', title: '金句 · 叙事', titleEn: 'Quote · story', language: 'zh', text: STORY_TEXT, words: synthesizeWords(STORY_TEXT) },
  { id: 'demo-mixed', title: '混合 · 中英', titleEn: 'Mixed · CN/EN', language: 'mixed', text: SIMPLE_TEXT, words: synthesizeWords(SIMPLE_TEXT) },
  { id: 'demo-numbers', title: '数字 · 识别测试', titleEn: 'Numbers · detection', language: 'mixed', text: DATA_TEXT, words: synthesizeWords(DATA_TEXT) },
  { id: 'demo-long', title: '长句 · 单行分段', titleEn: 'Long · single line', language: 'zh', text: LONG_TEXT, words: synthesizeWords(LONG_TEXT) }
];

/** Verify the single-line rule on the long demo: it must split, not wrap. */
export const LONG_DEMO_ID = 'demo-long';

export const DEFAULT_DEMO_ID = 'demo-finance';
export const STUDIO_DEMO_TEXT = '让每一个字都跟着声音动起来。';

export function getTranscript(id: string): DemoTranscript {
  return demoTranscripts.find((d) => d.id === id) ?? demoTranscripts[0];
}
