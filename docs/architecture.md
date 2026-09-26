# Architecture

Sera Subtitle Factory (SSF) —— 一句话：**Design subtitles like UI components.**

## 分层

```
transcript (words + start/end)
        │
        ├── segmenter/singleLine.ts     RULE #1：永远单行，超长就重新分段
        │        └── measureText()      canvas.measureText（挂载后才启用）
        │
        ├── emphasis/rules.ts           正则识别 number / percentage / currency / entity / keyword
        │
        ├── resolve.ts                  currentTime → ResolvedSegment（active / spoken）
        │
        └── renderer/                   CaptionRenderer
                 ├── WordRenderer       逐词：active > emphasis > idle > normal
                 ├── BackgroundRenderer 背景 + 边框（含 leftBar）
                 └── motions/*          入场 / 逐词 / 退场（只存名字，实现独立）
```

## 三个不可违反的原则

### 1. 单行（RULE #1）
- `LayoutStyle.maxLines` 的类型是字面量 `1`
- `.cap-line { white-space: nowrap }` 写死在 `globals.css`
- 超宽**不换行**：`segmentWords()` 把超出的词推到下一段；单个不可断 token 才允许
  轻微缩放（≥0.88），且用 `transform: scale()` 而非改字宽

### 2. 语音驱动
每个词带 `start` / `end`。任一时刻 `currentTime` 决定：
`idle`（未念到）→ `active`（正在念）→ `spoken`（已念过）。
所有动效都围绕这四种状态（含 emphasis 两种）设计。

### 3. Layout Stability
active / emphasis 只改 `transform` 与 `color`，**不改 layout 尺寸**，
所以整句永远不会左右跳动、宽度不会重算。

## Caption Recipe = 产品模型

```
CaptionRecipe = Layout + Typography + Color + ActiveWord + Number
              + Emphasis + Background + Border + Motion(entrance/word/exit)
```

- 一个 Recipe 是一份 JSON，可复制给任何人复刻同款字幕
- `presets/*.ts` 是 12 份预置 Recipe，`savedRecipes` 是用户版本（localStorage）
- 换字体 / 颜色 / 背景 / 边框 / 动效只 patch 一个字段 → Preview 即时重渲染

## Motion System

| 层 | 文件 | 说明 |
|---|---|---|
| tokens | `caption-engine/motion-tokens.ts` | 时长 / 距离 / 弹簧，组件里禁止魔法数字 |
| entrance | `motions/{fade,float,slideUp,scale,blurReveal}.ts` | 整行入场 |
| word | `motions/{pop,bounce,float,scale,glow,weightShift,blurReveal,highlight}.ts` | 逐词强调 |
| registry | `motions/index.ts` | Recipe 只存名字，这里解析成 framer-motion target |

克制标准：pop 峰值 1.09、bounce 位移 5px、float 8px、glow 只给关键词和数字。

## Emphasis Engine

- Phase 1：纯规则（`emphasis/rules.ts`），零 API 成本
  - `12%` `+35%` → percentage
  - `$68,500` `100 USDT` → currency
  - `24H` `1.5x` `2026` → number
  - `BTC` `ETH` `CPI` → entity
- 识别出的词永久保持强调样式（不随念稿消失），数字默认 ×1.20 / 800 字重
- Phase 4 预留：`analyseLLM()`，由 `EmphasisRules.aiEmphasis` 开关

## Timeline

Audio wave（假）· Caption Segment 块 · Word 时间轴 · Playhead，可拖动 scrub。
刻意不做专业剪辑软件（spec §31）。

## Store（zustand + persist）

持久化：`recipe` / `transcriptId` / `aspect` / `showSafeArea` / `savedRecipes`
不持久化：`currentTime` / `playing` / `past` / `future`
Undo/Redo 用 `past[] + future[]` 两个栈（上限 40 步）。

## 目录

```
src/
├── app/                 page(首页 Hero+6 demos) · studio · library · recipes
├── components/          studio/ preview/ inspector/ timeline/ library/ ui/
├── caption-engine/      renderer/ segmenter/ emphasis/ motions/ backgrounds/ borders/ typography/
├── presets/             12 个 preset（每个独立文件）+ _shared.ts
├── types/caption.ts     全部数据类型 + 4 个 Plugin 接口
├── lib/                 demo-transcripts / lexicon / hooks
├── store/caption-store.ts
└── design-system/tokens.ts
```

## Phase 2｜3 接口预留

- Phase 2：`lib/whisper/`（faster-whisper 本地推理）→ 产出同一份 `WordTimestamp[]`，
  segmenter / renderer 完全不用改
- Phase 3：`lib/remotion/` 复用同一个 Recipe 渲染 MP4；`lib/ffmpeg/` 导出 SRT / ASS / WebVTT

只要 `WordTimestamp[]` 与 `CaptionRecipe` 两个契约不变，上层 UI 不用动。
