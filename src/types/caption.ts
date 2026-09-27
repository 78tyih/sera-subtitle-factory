/**
 * Sera Subtitle Factory — caption data model
 * ============================================================
 * RULE #1: maxLines is always 1. The type itself forbids two lines.
 * A caption that is too long gets RE-SEGMENTED, never wrapped.
 */

/* ---------- transcript ---------- */

export type WordType =
  | 'normal'
  | 'keyword'
  | 'number'
  | 'percentage'
  | 'currency'
  | 'entity';

export interface WordTimestamp {
  id: string;
  text: string;
  start: number; // seconds
  end: number; // seconds
  confidence?: number;
}

export interface CaptionSegment {
  id: string;
  start: number;
  end: number;
  words: WordTimestamp[];
}

/* ---------- typography ---------- */

export type FontKey =
  /* sans (latin) */
  | 'inter' | 'interTight' | 'geist' | 'spaceGrotesk' | 'dmSans' | 'manrope'
  | 'ibmPlex' | 'outfit' | 'workSans' | 'helvetica' | 'arial' | 'roboto'
  | 'montserrat' | 'poppins'
  /* sans (中文) */
  | 'sourceHanSans' | 'notoSansSC' | 'harmonyOS' | 'alibaba' | 'smiley' | 'system'
  /* serif */
  | 'editorial' | 'sourceHanSerif' | 'notoSerif' | 'playfair' | 'lora' | 'instrumentSerif'
  /* mono / hand */
  | 'mono' | 'jetbrains' | 'firaCode' | 'lxgw';

export interface TypographyStyle {
  fontFamily: FontKey;
  fontWeight: number;
  fontSize: number; // px @ 1080-wide reference canvas
  letterSpacing: number; // em
  lineHeight: number;
  textTransform: 'none' | 'uppercase';
}

/* ---------- colors ---------- */

export interface ColorStyle {
  text: string;
  /** words already spoken / not yet spoken */
  idle: string;
  active: string;
  keyword: string;
  number: string;
}

/* ---------- active word ---------- */

export interface ActiveWordStyle {
  color?: string;
  scale: number; // 1.08 etc — transform only, never layout
  fontWeight?: number;
  background?: string | null;
  glow?: string | null;
  animation: WordMotionName;
}

/* ---------- emphasis ---------- */

export interface EmphasisRules {
  numbers: boolean;
  percentages: boolean;
  currency: boolean;
  /** user keywords that always stay emphasised */
  keywords: string[];
  /** reserved: LLM pass (Phase 4) */
  aiEmphasis: boolean;
  numberScale: number;
  numberWeight: number;
  numberColor: string;
  keywordWeight: number;
}

/* ---------- background ---------- */

export type BackgroundType =
  | 'none'
  | 'white'
  | 'black'
  | 'black80'
  | 'white92'
  | 'glass';

export interface BackgroundStyle {
  type: BackgroundType;
  /** custom fill colour (hex) — overrides the preset's default colour */
  color?: string;
  opacity: number; // 0..1 (overrides preset alpha when !== 1)
  blur: number; // px, glass only, keep low
  radius: number; // 16–24 recommended, never a pill
  paddingX: number;
  paddingY: number;
}

/* ---------- border ---------- */

export type BorderType = 'none' | 'outline' | 'bottomLine' | 'leftBar';

export interface BorderStyle {
  type: BorderType;
  color: string;
  width: number; // 3–6 for leftBar, 1–3 for outline
  radius: number;
}

/* ---------- motion ---------- */

export type EntranceMotionName =
  | 'none'
  | 'fade'
  | 'float'
  | 'slideUp'
  | 'slideDown'
  | 'scale'
  | 'blurReveal'
  | 'typewriter';

export type WordMotionName =
  | 'none'
  | 'highlight'
  | 'pop'
  | 'bounce'
  | 'float'
  | 'scale'
  | 'glow'
  | 'weightShift'
  | 'blurReveal'
  | 'wave'
  | 'karaoke';

export type ExitMotionName = 'none' | 'fade' | 'slideDown' | 'scale' | 'blurReveal';

export interface MotionStyle {
  entrance: { type: EntranceMotionName; duration: number }; // ms
  word: { type: WordMotionName; duration: number; intensity: number };
  exit: { type: ExitMotionName; duration: number };
}

/* ---------- layout ---------- */

export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16' | '4:5';

export interface LayoutStyle {
  /** RULE #1 — always 1 */
  maxLines: 1;
  position: 'bottom' | 'middle' | 'top';
  yOffset: number; // 0..1 within the frame
  align: 'center' | 'left' | 'right';
  maxWidth: number; // 0..1 of frame width
  aspect: AspectRatio;
  safeArea: boolean;
}

/* ---------- recipe (= the whole product model) ---------- */

export type PresetCategory =
  | 'Minimal'
  | 'Editorial'
  | 'Broadcast'
  | 'Data'
  | 'Tech'
  | 'Neon'
  | 'Podcast'
  | 'Clean'
  | 'Bold'
  | 'Kinetic';

export interface CaptionRecipe {
  id: string;
  name: string;
  /** Chinese display name (falls back to `name`) */
  nameZh?: string;
  /** English description (falls back to `description`) */
  descriptionEn?: string;
  category: PresetCategory;
  description?: string;
  tags?: string[];
  /** reserved for the future marketplace */
  author?: string;
  version?: string;
  createdAt?: string;

  layout: LayoutStyle;
  typography: TypographyStyle;
  text: ColorStyle;
  activeWord: ActiveWordStyle;
  number: { color: string; scale: number; fontWeight: number };
  emphasis: EmphasisRules;
  background: BackgroundStyle;
  border: BorderStyle;
  motion: MotionStyle;
}

/* ---------- runtime ---------- */

export interface ResolvedWord extends WordTimestamp {
  type: WordType;
  isKeyword: boolean;
  isNumber: boolean;
  isPercentage: boolean;
  isCurrency: boolean;
  isActive: boolean;
  isSpoken: boolean;
}

export interface ResolvedSegment extends CaptionSegment {
  words: ResolvedWord[];
  text: string;
}

/* ---------- plugin hooks (reserved) ---------- */

export interface CaptionPlugin {
  id: string;
  apply(recipe: CaptionRecipe): CaptionRecipe;
}
export interface MotionPlugin {
  id: string;
  word?: WordMotionName;
  entrance?: EntranceMotionName;
}
export interface BackgroundPlugin {
  id: string;
  type: BackgroundType;
}
export interface EmphasisPlugin {
  id: string;
  analyse(text: string, word: WordTimestamp): WordType;
}

/* ---------- utility ---------- */

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<unknown> ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};
