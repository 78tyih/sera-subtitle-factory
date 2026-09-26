'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useCaptionStore } from '@/store/caption-store';
import { useI18n } from '@/lib/i18n';
import { presets } from '@/presets';
import { synthesizeWords } from '@/lib/demo-transcripts';
import { Btn, IconBtn } from '@/components/ui';
import type { CaptionRecipe } from '@/types/caption';

/**
 * AI caption assistant.
 * Two modes:
 *  · online  — any OpenAI-compatible endpoint (key stored locally in the browser)
 *  · local   — no key needed: keyword rules pick a style and draft a line
 * Both end in the same place: real caption text + a suggested recipe.
 */

interface Msg {
  role: 'user' | 'assistant';
  content: string;
  presetId?: string;
  text?: string;
}

const STORE_KEY = 'ssf-ai-config';

interface AiConfig {
  endpoint: string;
  key: string;
  model: string;
}

const DEFAULT_CONFIG: AiConfig = {
  endpoint: 'https://api.openai.com/v1',
  key: '',
  model: 'gpt-4o-mini'
};

/* ---------------------------------------------------------------- local rules */

const RULES: Array<{ match: RegExp; presetId: string; line: string }> = [
  { match: /风险|止损|仓位|纪律/, presetId: 'sera-crimson-strong', line: '先想清楚亏多少，再决定买多少。' },
  { match: /数字|数据|收益|胜率|回测|绩效/, presetId: 'sera-number-hero', line: '胜率 63%，盈亏比 2.4。' },
  { match: /比特币|BTC|行情|突破|币/, presetId: 'sera-finance-yellow', line: '比特币突破关键阻力位。' },
  { match: /科技|AI|模型|产品|发布/, presetId: 'sera-tech-blue-bar', line: '模型推理速度提升了 3 倍。' },
  { match: /金句|慢|温柔|故事|人文/, presetId: 'sera-quote-serif', line: '慢一点，才看得更清楚。' },
  { match: /观点|判断|本质|逻辑/, presetId: 'sera-editorial', line: '真正重要的是资金正在流向哪里。' },
  { match: /教程|讲解|知识|科普/, presetId: 'sera-classic-subtitle', line: '今天聊一个非常重要的判断。' },
  { match: /强调|重点|注意/, presetId: 'sera-marker-yellow', line: '这一步最容易被忽略。' },
  { match: /数字放大|hero|标题/, presetId: 'sera-outline-hollow', line: '数据不会说谎。' },
  { match: /播客|访谈|对话/, presetId: 'sera-podcast-lower', line: '我们从头讲一遍。' }
];

/** trim to a single line that fits comfortably (single-line rule). */
function condense(input: string): string {
  const clean = input.replace(/\s+/g, '').replace(/^[，。、；：]+/, '');
  return clean.length > 22 ? clean.slice(0, 22) : clean;
}

function localAnswer(prompt: string): Msg {
  const hit = RULES.find((r) => r.match.test(prompt));
  const dict = presets.find((p) => p.id === (hit?.presetId ?? 'sera-finance-yellow'))!;
  const own = prompt.replace(/^(帮我写|写一句|生成|做一句|来一句)[^，,。]*[，,。]?/, '').trim();
  const text = own.length >= 6 && own.length <= 22 ? condense(own) : hit?.line ?? '市场不会奖励犹豫的人。';
  return { role: 'assistant', content: '', text, presetId: dict.id };
}

/* ---------------------------------------------------------------- component */

export function AiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useI18n();
  const setCustomCaption = useCaptionStore((s) => s.setCustomCaption);
  const applyPreset = useCaptionStore((s) => s.usePreset);
  const patchRecipe = useCaptionStore((s) => s.patchRecipe);

  const [cfg, setCfg] = useState<AiConfig>(DEFAULT_CONFIG);
  const [showCfg, setShowCfg] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setCfg({ ...DEFAULT_CONFIG, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  const saveCfg = (next: AiConfig) => {
    setCfg(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const presetName = (id?: string) => {
    const p = presets.find((x) => x.id === id);
    if (!p) return '';
    return lang === 'zh' ? p.nameZh ?? p.name : p.name;
  };

  const askOnline = async (prompt: string): Promise<Msg> => {
    const catalogue = presets.map((p) => `${p.id} (${p.nameZh ?? p.name})`).join(', ');
    const res = await fetch(`${cfg.endpoint.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0.8,
        messages: [
          {
            role: 'system',
            content:
              'You write ONE-LINE video captions (single line, never wrap, ≤22 Chinese chars or ≤70 latin chars). ' +
              'Reply with strict JSON only: {"text":"...","preset":"<one of the ids>","reason":"one short sentence"}. ' +
              `Available presets: ${catalogue}`
          },
          { role: 'user', content: prompt }
        ]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';
    const json = /\{[\s\S]*\}/.exec(content)?.[0];
    if (!json) throw new Error('bad response');
    const parsed = JSON.parse(json) as { text: string; preset?: string; reason?: string };
    return { role: 'assistant', content: parsed.reason ?? '', text: condense(parsed.text), presetId: parsed.preset };
  };

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || busy) return;
    setInput('');
    setMsgs((m) => [...m, { role: 'user', content: prompt }]);
    setBusy(true);
    try {
      const answer = cfg.key ? await askOnline(prompt) : localAnswer(prompt);
      setMsgs((m) => [...m, answer]);
    } catch (e) {
      const fallback = localAnswer(prompt);
      setMsgs((m) => [
        ...m,
        { ...fallback, content: `${e instanceof Error ? e.message : 'error'} — ${t('ai.localMode')}` }
      ]);
    } finally {
      setBusy(false);
    }
  };

  const applyText = (text: string) => setCustomCaption(text, synthesizeWords(text));

  const applyStyle = (recipe: CaptionRecipe, id?: string) => {
    const found = id ? presets.find((p) => p.id === id) : undefined;
    if (found) applyPreset(found.id);
    else patchRecipe(recipe);
  };

  const current = useCaptionStore((s) => s.recipe);
  const online = Boolean(cfg.key);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={onClose} />}
      <aside
        className={[
          'fixed right-0 top-0 z-50 flex h-full w-[366px] flex-col border-l border-line bg-panel transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        ].join(' ')}
      >
        <header className="flex h-[54px] shrink-0 items-center gap-2 border-b border-line px-4">
          <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-accent/15 text-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M12 3l1.8 4.9L19 9.6l-4.4 3 .6 5.4-3.2-2.6-3.2 2.6.6-5.4L5 9.6l5.2-1.7z" />
            </svg>
          </span>
          <span className="text-[13px] font-medium">{t('ai.title')}</span>
          <div className="ml-auto flex items-center gap-1.5">
            <IconBtn title={t('ai.settings')} active={showCfg} onClick={() => setShowCfg((v) => !v)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
              </svg>
            </IconBtn>
            <IconBtn title="close" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </IconBtn>
          </div>
        </header>

        {showCfg && (
          <div className="space-y-2 border-b border-line bg-sunken p-3">
            <div>
              <p className="mb-1 text-[10.5px] text-muted">{t('ai.endpoint')}</p>
              <input
                value={cfg.endpoint}
                onChange={(e) => saveCfg({ ...cfg, endpoint: e.target.value })}
                className="w-full rounded-[7px] border border-line bg-panel px-2 py-1.5 font-mono text-[11px] outline-none focus:border-accent/60"
              />
            </div>
            <div>
              <p className="mb-1 text-[10.5px] text-muted">{t('ai.key')}</p>
              <input
                value={cfg.key}
                type="password"
                placeholder="sk-..."
                onChange={(e) => saveCfg({ ...cfg, key: e.target.value })}
                className="w-full rounded-[7px] border border-line bg-panel px-2 py-1.5 font-mono text-[11px] outline-none focus:border-accent/60"
              />
            </div>
            <div>
              <p className="mb-1 text-[10.5px] text-muted">{t('ai.model')}</p>
              <input
                value={cfg.model}
                onChange={(e) => saveCfg({ ...cfg, model: e.target.value })}
                className="w-full rounded-[7px] border border-line bg-panel px-2 py-1.5 font-mono text-[11px] outline-none focus:border-accent/60"
              />
            </div>
            <p className="font-mono text-[10px] text-muted">{online ? t('ai.onlineMode', { model: cfg.model }) : t('ai.localMode')}</p>
          </div>
        )}

        <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3.5">
          {msgs.length === 0 && <p className="text-[11.5px] leading-relaxed text-muted">{t('ai.empty')}</p>}

          {msgs.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="ml-auto max-w-[86%] rounded-[12px] rounded-br-[4px] bg-chip px-3 py-2 text-[12px] text-ink">
                {m.content}
              </div>
            ) : (
              <div key={i} className="max-w-[94%] space-y-2 rounded-[12px] rounded-bl-[4px] border border-line bg-panel2 px-3 py-2.5">
                {m.text && <p className="text-[13px] font-medium leading-relaxed text-ink">{m.text}</p>}
                {m.content && <p className="text-[10.5px] leading-relaxed text-muted">{m.content}</p>}
                {m.presetId && (
                  <p className="font-mono text-[10px] text-accent">
                    {t('ai.hintPreset')}: {presetName(m.presetId)}
                  </p>
                )}
                {(m.text || m.presetId) && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {m.text && (
                      <Btn size="sm" variant="primary" onClick={() => applyText(m.text!)}>
                        {t('ai.applyText')}
                      </Btn>
                    )}
                    {m.presetId && (
                      <Btn size="sm" onClick={() => applyStyle(current, m.presetId)}>
                        {t('ai.applyPreset')}
                      </Btn>
                    )}
                  </div>
                )}
              </div>
            )
          )}
          {busy && <p className="font-mono text-[10.5px] text-muted">{t('ai.thinking')}</p>}
        </div>

        <div className="shrink-0 border-t border-line p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={2}
              placeholder={t('ai.placeholder')}
              className="min-h-[46px] flex-1 resize-none rounded-[10px] border border-line bg-sunken px-2.5 py-2 text-[12px] leading-relaxed text-ink outline-none placeholder:text-muted focus:border-accent/60"
            />
            <Btn variant="primary" onClick={() => void send()} disabled={busy || !input.trim()}>
              {t('ai.send')}
            </Btn>
          </div>
        </div>
      </aside>
    </>
  );
}
