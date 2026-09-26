/**
 * Lexicon + tokenizer for speech-style word tokens.
 * ============================================================
 * Why not Intl.Segmenter: ICU's Chinese segmentation falls back to single
 * characters without a dictionary (比特币 → 比/特/币) and splits "12%" into
 * "12" + "%", which breaks number emphasis.
 *
 * So: a small domain lexicon + longest-match, plus a strict numeric regex
 * that keeps financial expressions whole ($68,500 · +12.5% · 24H · 1.5x).
 */

export const LEXICON: string[] = [
  // finance / crypto
  '加密货币', '成交量', '比特币', '以太坊', '阻力位', '支撑位', '关键位置', '美元指数',
  '资金', '流向', '市场', '行情', '价格', '波动', '突破', '上涨', '下跌', '回撤', '趋势',
  '胜率', '盈亏比', '仓位', '止损', '纪律', '风险控制', '执行纪律', '风险', '机会', '收益',
  '成本', '模型', '推理', '速度', '提升', '下降', '回测', '信号', '策略', '数据', '指标',
  // verbs / connectives seen in the demos
  '出现了', '回到了', '来到了', '快速上升', '同时', '整个', '快速', '上升', '非常',
  '明显', '出现', '重新', '回到', '来到', '已经', '正在', '将会',
  // content words
  '重要', '真正', '的是', '别人', '什么', '伟大', '决策', '来自', '长期', '观察',
  '今天', '明天', '关键', '位置', '考虑', '选择', '慢一点', '更清楚', '看清楚',
  '机会来了', '就要', '果断', '必须', '抓住', '犹豫', '奖励', '值得', '关注', '注意', '哪里',
  // neutral content words (non-finance demos)
  '每一个', '跟着', '声音', '动起来', '起来', '留白', '细节', '复杂', '简单',
  '组件', '替换', '复用', '系统', '扩展', '响应', '内存', '占用', '设计', '排版',
  '开始', '事情', '变得'
];

/** Longest-match first, so 加密货币 wins over 加密 + 货币. */
const SORTED_LEX = [...LEXICON].sort((a, b) => b.length - a.length);
const MAX_WORD_LEN = 4;

/** Basic CJK ideographs only — full-width punctuation is excluded on purpose. */
const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
const RE_CJK_RUN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+/;
const PUNC = /^[，。！？、；：,.!?;:·—–]$/;

/**
 * Atom regex. Order matters:
 *   currency → percentage → number(+unit) → latin word → CJK run → punctuation
 */
const RE_ATOM =
  /([$¥€£]\s?\d[\d,]*(?:\.\d+)?(?:[KMB]|bn|m|k)?|[+-]?\d[\d,]*(?:\.\d+)?\s?%|[+-]?\d[\d,]*(?:\.\d+)?(?:[xX]|倍|[A-Za-z]{1,3})?|[A-Za-z][A-Za-z0-9.'’&-]*|[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+|[，。！？、；：.!?;:,·—–]|\s+)/g;

/**
 * Split a CJK run with longest-match against the lexicon.
 * Unknown characters fall back to SINGLE characters — never a 2-char slice,
 * because that glues the tail of one word onto the head of the next ("了非").
 */
function splitCjk(run: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < run.length) {
    let matched = '';
    for (let len = Math.min(MAX_WORD_LEN, run.length - i); len >= 2; len--) {
      const cand = run.slice(i, i + len);
      if (SORTED_LEX.includes(cand)) {
        matched = cand;
        break;
      }
    }
    if (!matched) matched = run[i];
    out.push(matched);
    i += matched.length;
  }
  return out;
}

export function tokenize(text: string): string[] {
  const out: string[] = [];
  const matches = text.match(RE_ATOM) ?? [];
  for (const m of matches) {
    if (!m.trim()) continue;
    /* a single punctuation mark is its own token — never swallow the rest of the line */
    if (m.length === 1 && PUNC.test(m)) {
      out.push(m);
      continue;
    }
    if (RE_CJK_RUN.test(m)) {
      out.push(...splitCjk(m));
      continue;
    }
    out.push(m);
  }
  return out;
}

export { CJK, PUNC };
