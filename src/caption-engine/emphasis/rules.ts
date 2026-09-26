import type { WordTimestamp, WordType } from '@/types/caption';

/**
 * AI Emphasis Engine — Phase 1 is 100% rule based (no LLM, no API cost).
 * Phase 4 will add an `analyseLLM()` pass behind `EmphasisRules.aiEmphasis`.
 *
 * Detects: percentage · currency · number · entity · keyword
 */

const RE_PERCENTAGE = /^[+-]?\d+(?:[.,]\d+)?\s*%$/;
const RE_CURRENCY = /^(?:[$¥€£]|[A-Z]{2,4}\$)\s?\d+(?:[.,]\d+)?\s*(?:[KMB]|bn|m|k)?$|^\d+(?:[.,]\d+)?\s*(?:USDT|USDC|USD|CNY|RMB)$/i;
const RE_NUMBER = /^[+-]?\d+(?:[.,]\d+)?(?:[xX]|倍|[A-Za-z]{1,3})?$/;
const RE_YEAR = /^(19|20)\d{2}$/;
const RE_ENTITY = /^(BTC|ETH|SOL|BNB|NDX|SPX|DXY|FED|CPI|GDP|AI|GPU|USD|USDT|ETF)$/;

/** Multipliers / units that make a number financial. */
const RE_MULT = /^\d+(?:\.\d+)?[xX]$/;

export function classifyWord(text: string): WordType {
  const t = text.trim();
  if (!t) return 'normal';
  if (RE_PERCENTAGE.test(t)) return 'percentage';
  if (RE_CURRENCY.test(t)) return 'currency';
  if (RE_YEAR.test(t)) return 'number';
  if (RE_MULT.test(t)) return 'number';
  if (RE_NUMBER.test(t)) return 'number';
  if (RE_ENTITY.test(t.toUpperCase())) return 'entity';
  return 'normal';
}

export function isEmphasisedType(type: WordType): boolean {
  return type === 'number' || type === 'percentage' || type === 'currency' || type === 'entity';
}

export interface EmphasisContext {
  numbers: boolean;
  percentages: boolean;
  currency: boolean;
  keywords: string[];
}

/** Full pass over a transcript — returns a type map by word id. */
export function analyse(words: WordTimestamp[], ctx: EmphasisContext): Record<string, WordType> {
  const map: Record<string, WordType> = {};
  const keywords = ctx.keywords.map((k) => k.trim()).filter(Boolean);

  for (const w of words) {
    let type = classifyWord(w.text);

    // disabled rule → downgrade
    if (type === 'number' && !ctx.numbers) type = 'normal';
    if (type === 'percentage' && !ctx.percentages) type = 'normal';
    if (type === 'currency' && !ctx.currency) type = 'normal';

    // user keywords win
    if (keywords.some((k) => w.text.includes(k) || k.includes(w.text))) type = 'keyword';

    map[w.id] = type;
  }
  return map;
}

/** Reserved for Phase 4: LLM-assisted emphasis. */
export async function analyseLLM(_text: string): Promise<Array<{ text: string; type: WordType }>> {
  // intentionally unimplemented — rule engine must work standalone
  return [];
}

export const emphasisRules = { RE_PERCENTAGE, RE_CURRENCY, RE_NUMBER, RE_ENTITY };
