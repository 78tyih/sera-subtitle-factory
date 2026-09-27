'use client';

import { motion } from 'framer-motion';
import type { ResolvedWord, CaptionRecipe } from '@/types/caption';
import { getWordMotion } from '../motions';
import { getPrimitive } from '../primitives';
import { fontStacks } from '../typography/fonts';

/**
 * WordRenderer — decides, per word, in this priority order (spec §46):
 *   active → emphasis(number/percentage/currency/keyword) → normal
 *
 * V2.2: an optional `motion.decorator` primitive (markerSweep · underlineReveal ·
 * boxFollow · karaokeFill · snap · recoil · widen · maskReveal · blurFocus ·
 * trackIn · hardShadow · strokeReveal) is applied to the active word only —
 * decorations never touch layout, so neighbours never shift.
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

  /* ---------- colour priority (spec §46) ---------- */
  let color = inverseText ? '#111111' : text.text;
  if (!word.isActive && !word.isSpoken) color = inverseText ? 'rgba(17,17,17,0.62)' : text.idle;
  if (isKeyword) color = text.keyword;
  if (isBig) color = numberStyle.color || text.number;
  if (word.isActive) color = activeWord.color ?? text.active;
  if ((recipe.motion?.word?.type ?? '') === 'karaoke' && word.isSpoken && !isBig && !isKeyword) {
    color = activeWord.color ?? text.active;
  }

  /* ---------- type ---------- */
  const fontSize = typography.fontSize * k;
  const weight = isBig ? Math.max(numberStyle.fontWeight, typography.fontWeight) : typography.fontWeight;
  const emphasisScale = isBig ? numberStyle.scale : 1;

  /* ---------- word motion ---------- */
  const env = {
    duration: recipe.motion.word.duration,
    intensity: recipe.motion.word.intensity * (isBig ? 0.55 : 1),
    activeColor: activeWord.color ?? text.active,
    baseWeight: typography.fontWeight,
    emphasisWeight: emphasis.keywordWeight
  };
  const motionSpec = getWordMotion(recipe.motion.word.type, env);
  const prim = getPrimitive((recipe.motion as { decorator?: string }).decorator);
  const primMotion = prim && prim.kind === 'motion' ? prim : null;
  const activeTarget =
    word.isActive && primMotion ? { ...(motionSpec.active as object), ...(primMotion.animate as object) } : word.isActive ? motionSpec.active : motionSpec.idle;

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
    display: 'inline-block',
    position: 'relative'
  };

  /* active word background chip (spec §10: activeWord can own a background) */
  const chip = word.isActive && activeWord.background ? activeWord.background : undefined;

  /* decoration layer primitives (PART E) */
  const layer = prim && prim.kind === 'layer' ? prim : null;
  const showLayer = Boolean(layer && word.isActive);

  if (!animate) {
    return (
      <span className="cap-word" style={style}>
        {chip ? <span style={{ background: chip, borderRadius: 6, padding: '0 0.12em' }}>{word.text}</span> : word.text}
      </span>
    );
  }

  return (
    <span className="cap-word" style={style}>
      {showLayer && layer && (
        <motion.span
          aria-hidden
          style={
            layer.style
              ? layer.style({
                  color: activeWord.color ?? text.active,
                  duration: env.duration,
                  isActive: word.isActive
                })
              : undefined
          }
          initial={layer.initial as never}
          animate={word.isActive ? (layer.animate as never) : (layer.initial as never)}
          transition={layer.transition as never}
        />
      )}
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
        transition={primMotion?.transition as never}
      >
        {word.text}
      </motion.span>
    </span>
  );
}
