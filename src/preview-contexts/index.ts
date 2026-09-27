import type { FontKey } from '@/types/caption';

/**
 * PreviewContext — nine demo backdrops (PART G).
 *
 * IMPORTANT
 *  · No stock photography, no proprietary assets. Every context is pure CSS
 *    (gradients + patterns), so the visual language never pollutes the reading
 *    of a caption style and there is nothing to license.
 *  · Each Style Family declares `preferredPreviewContexts`; the library and the
 *    home stage render a style in its own context instead of the old "finance chart" backdrop.
 */

export type PreviewContextKey =
  | 'creator'
  | 'podcast'
  | 'editorial'
  | 'business'
  | 'data'
  | 'product'
  | 'sports'
  | 'lifestyle'
  | 'code';

export interface PreviewContext {
  key: PreviewContextKey;
  name: string;
  nameZh: string;
  /** background shorthand applied to the stage */
  background: string;
  /** small on-stage label colour hint */
  label: string;
  /** font used for the demo copy inside this context (optional personality) */
  demoFont?: FontKey;
}

export const previewContexts: Record<PreviewContextKey, PreviewContext> = {
  creator: {
    key: 'creator',
    name: 'Creator',
    nameZh: '口播',
    background:
      'radial-gradient(120% 90% at 30% 12%, #2B313C 0%, #181B22 55%, #101216 100%)',
    label: 'rgba(255,255,255,0.55)'
  },
  podcast: {
    key: 'podcast',
    name: 'Podcast',
    nameZh: '播客',
    background: 'linear-gradient(160deg, #141A24 0%, #0C1018 100%)',
    label: 'rgba(255,255,255,0.55)'
  },
  editorial: {
    key: 'editorial',
    name: 'Editorial',
    nameZh: '杂志',
    background: 'linear-gradient(180deg, #F6F3EC 0%, #EDE8DE 100%)',
    label: 'rgba(17,17,17,0.6)'
  },
  business: {
    key: 'business',
    name: 'Business',
    nameZh: '商业',
    background: 'linear-gradient(135deg, #E9EDF2 0%, #D7DEE7 100%)',
    label: 'rgba(17,17,17,0.6)'
  },
  data: {
    key: 'data',
    name: 'Data',
    nameZh: '数据',
    background:
      'linear-gradient(180deg, #0B1220 0%, #0A0F1A 100%)',
    label: 'rgba(255,255,255,0.55)'
  },
  product: {
    key: 'product',
    name: 'Product',
    nameZh: '产品',
    background: 'linear-gradient(180deg, #F2F4F7 0%, #E4E8EE 100%)',
    label: 'rgba(17,17,17,0.6)'
  },
  sports: {
    key: 'sports',
    name: 'Sports',
    nameZh: '体育',
    background: 'linear-gradient(150deg, #10231C 0%, #07110E 100%)',
    label: 'rgba(255,255,255,0.6)'
  },
  lifestyle: {
    key: 'lifestyle',
    name: 'Lifestyle',
    nameZh: '生活',
    background: 'linear-gradient(140deg, #F7EFE4 0%, #EFE2D2 100%)',
    label: 'rgba(17,17,17,0.6)'
  },
  code: {
    key: 'code',
    name: 'Code',
    nameZh: '代码',
    background: 'linear-gradient(180deg, #101317 0%, #0A0C10 100%)',
    label: 'rgba(255,255,255,0.55)',
    demoFont: 'jetbrains'
  }
};

export const previewContextList = Object.values(previewContexts);

/** Fallback assignment when a recipe has no context declared. */
export const DEFAULT_CONTEXT: PreviewContextKey = 'creator';
