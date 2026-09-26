'use client';

import { motion } from 'framer-motion';
import type { ResolvedWord, CaptionRecipe } from '@/types/caption';
import { getWordMotion } from '../motions';
import { fontStacks } from '../typography/fonts';

/**
 * WordRenderer — decides, per word, in this priority order (spec §46):
 *   active → emphasis(number/percentage/currency/keyword) → normal
 * Layout stability: emphasis uses transform: scale only (spec §82),
 * so neighbours never get pushed around.
 */

export interface WordRendererProps {
  word: ResolvedWord;
  recipe: CaptionRecipe;
  /** reference-canvas scale factor (stageWidth / 1080) */
  k: number;
  /** true when the caption sits on a light background */
  inverseText: boolean;
  /** animation clock enabled (disabled in static thumbnails) */
  animate: boolean;
}

export function WordRenderer({ word, recipe, k, inverseText, animate }: WordRendererProps) {
  const { typography, text, activeWord, number: numberStyle, emphasis } = recipe;

  const isEmphasis = emphasis.numbers && (word.isNumber || word.isPercentage);
  const isCurrency = emphasis.currency && word.isCurrency;
  const isKeyword = word.isKeyword;
  const isBig = isEmphasis || isCurrency;

  /* ---------- colour priority (spec §46) ----------
     active  >  emphasis (persistent)  >  idle  >  normal
     Emphasis words keep their style even before/after being spoken. */
  let color = inverseText ? '#111111' : text.text;
  if (!word.isActive && !word.isSpoken) color = inverseText ? 'rgba(17,17,17,0.62)' : text.idle;
  if (isKeyword) color = text.keyword;
  if (isBig) color = numberStyle.color || text.number;
  if (word.isActive) color = activeWord.color ?? text.active;

  /* ---------- type ---------- */
  const fontSize = typography.fontSize * k;
  const weight = isBig ? Math.max(numberStyle.fontWeight, typography.fontWeight) : typography.fontWeight;

  /* scale emphasis through transform (never through font-size) */
  const emphasisScale = isBig ? numberStyle.scale : 1;

  /* ---------- motion ---------- */
  const env = {
    duration: recipe.motion.word.duration,
    /* emphasise-with-scale motions are damped on numbers so 1.22 × 1.09 never explodes */
    intensity: recipe.motion.word.intensity * (isBig ? 0.55 : 1),
    activeColor: activeWord.color ?? text.active,
    baseWeight: typography.fontWeight,
    emphasisWeight: emphasis.keywordWeight
  };
  const motionSpec = getWordMotion(recipe.motion.word.type, env);
  const activeTarget = word.isActive ? motionSpec.active : motionSpec.idle;

  const style: React.CSSProperties = {
    fontFamily: fontStacks[typography.fontFamily],
    fontSize,
    fontWeight: weight,
    letterSpacing: `${typography.letterSpacing}em`,
    color,
    lineHeight: 1.14,
    textTransform: typography.textTransform,
    transform: emphasisScale !== 1 ? `scale(${emphasisScale})` : undefined,
    transformOrigin: '50% 82%',
    display: 'inline-block'
  };

  /* active word background chip (spec §10: activeWord can own a background) */
  const chip = word.isActive && activeWord.background ? activeWord.background : undefined;

  if (!animate) {
    return (
      <span className="cap-word" style={style}>
        {chip ? <span style={{ background: chip, borderRadius: 6, padding: '0 0.12em' }}>{word.text}</span> : word.text}
      </span>
    );
  }

  return (
    <span className="cap-word" style={style}>
      <motion.span
        className="cap-word-inner"
        style={{
          display: 'inline-block',
          background: chip,
          borderRadius: chip ? 6 : undefined,
          padding: chip ? '0 0.12em' : undefined,
          color,
          fontWeight: weight
        }}
        initial={false}
        animate={activeTarget as never}
      >
        {word.text}
      </motion.span>
    </span>
  );
}
