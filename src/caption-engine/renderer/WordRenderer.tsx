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
 *
 * V2.3: recipe.treatment (stroke / shadow / marker) and recipe.keywordTypography
 * are honoured here — a keyword can be serif-italic while the line stays sans.
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
  const treatment = recipe.treatment;
  const keywordType = recipe.keywordTypography;
  const numberType = recipe.numberTypography;

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
  /* per-role typography can override the colour (PART C §14) */
  if (isKeyword && keywordType?.color) color = keywordType.color;
  if (isBig && numberType?.color) color = numberType.color;

  /* ---------- type ---------- */
  const fontSize = typography.fontSize * k;
  let weight = isBig ? Math.max(numberStyle.fontWeight, typography.fontWeight) : typography.fontWeight;
  if (isKeyword && keywordType?.fontWeight) weight = keywordType.fontWeight;
  if (isBig && numberType?.fontWeight) weight = numberType.fontWeight;
  const emphasisScale = isBig ? (numberType?.scale ?? numberStyle.scale) : 1;

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

  /* PART C §14 — a keyword may carry its own typography (serif italic etc.) */
  if (isKeyword && keywordType) {
    if (keywordType.fontStyle) style.fontStyle = keywordType.fontStyle;
    if (keywordType.fontFamily) style.fontFamily = fontStacks[keywordType.fontFamily];
  }

  /* PART D §27 — treatment: stroke + shadow, both purely visual */
  if (treatment?.stroke?.enabled) {
    style.WebkitTextStroke = `${treatment.stroke.width * k}px ${treatment.stroke.color}`;
    style.paintOrder = 'stroke fill';
  }
  if (treatment?.shadow?.enabled) {
    const s = treatment.shadow;
    style.textShadow = `${s.x}px ${s.y}px ${s.blur}px ${s.color}`;
  }

  /* active word background chip (spec §10: activeWord can own a background) */
  const chip = word.isActive && activeWord.background ? activeWord.background : undefined;

  /* decoration layer primitives (PART E) */
  const layer = prim && prim.kind === 'layer' ? prim : null;
  const showLayer = Boolean(layer && word.isActive);

  /* the layer is filled by the TREATMENT colour (marker yellow) — for boxFollow
     it is the recipe ACCENT (emphasis.numberColor). activeWord.color is the text
     ON the box (usually dark) — painting the box with it vanishes on dark stages. */
  const layerColor =
    (layer?.name === 'markerSweep' && treatment?.marker?.color) ||
    (layer?.name === 'underlineReveal' && treatment?.underline?.color) ||
    emphasis.numberColor ||
    text.active ||
    '#FFD400';

  const layerStyle: React.CSSProperties | undefined = layer?.style
    ? { ...layer.style({ color: layerColor, duration: env.duration, isActive: word.isActive }) }
    : undefined;
  /* PART C §09 — the marker block can carry a slight rotation (-0.5deg) */
  if (layerStyle && layer?.name === 'markerSweep' && treatment?.marker?.rotation) {
    layerStyle.rotate = `${treatment.marker.rotation}deg`;
    if (treatment.marker.opacity != null) layerStyle.opacity = treatment.marker.opacity;
  }

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
          style={layerStyle}
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
          fontWeight: weight,
          fontStyle: isKeyword && keywordType?.fontStyle ? keywordType.fontStyle : undefined
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
