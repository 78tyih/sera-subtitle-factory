import type React from 'react';

export interface PrimitiveCtx {
  /** emphasis colour of the recipe */
  color: string;
  /** motion duration in ms */
  duration: number;
  isActive: boolean;
}

/**
 * A primitive is a single, isolated visual behaviour.
 *  · kind 'layer'  → an absolutely-positioned decoration behind/under the active word
 *  · kind 'motion' → a transform / filter applied to the word itself
 */
export interface Primitive {
  name: string;
  kind: 'layer' | 'motion';
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  style?: (ctx: PrimitiveCtx) => React.CSSProperties;
}
