# Sera Captions V2 — Design System

## 品牌

- 工程名：`Sera Subtitle Factory`
- 对外品牌：**Sera Captions**，副标 `Powered by Subtitle Factory`
- 主标题（中）「让每一个字，都跟着声音动起来。」（英）`Type that moves with your voice.`
- 定位：**Speech-driven Motion Typography** —— 不是 "AI Subtitle Generator"。链路：Speech → Timing → Meaning → Typography → Motion。

## 颜色（PART U）

- 基础：Black · Off White · Warm Gray（UI 自己要安静）
- Accent：**Electric Blue**（selection·active·系统反馈），**Warm Yellow**（字幕强调·品牌能量）。
- 禁止大量蓝色 SaaS 感；颜色主要来自 captions、motion、video。

## 排版（PART F）

14 个精选字体栈（见 `docs/font-licenses.md`）。角色覆盖：Neutral Sans · Geometric Sans · Condensed Sans · Heavy Display · Editorial Serif · Display Serif · Mono · Pixel · Hand/Kai · Chinese Sans · Chinese Serif。
UI 必须显示真实加载状态（Fallback 标签）。

## PreviewContext（PART G）

9 套纯 CSS 上下文：Creator · Podcast · Editorial · Business · Data · Product · Sports · Lifestyle · Code。每个 Family 声明 `preferredPreviewContexts`，**禁止所有卡片用同一个 finance 图表背景污染判断。

## Recipe V2 / Rhythm / Treatment

见 `src/types/caption-v2.ts`（增量，不破坏 V1）。

- `treatment`：stroke · shadow · marker · underline · fill(solid|karaoke)
- `rhythm`：mode(phrase|compact|word|data) · maxWords · combineWithinMs · pauseBreakMs · punctuationBreak · density
- `motion`：segmentIn · activeWord · segmentTransition · decorator · exit
- `keywordTypography` / `numberTypography`：同一句里不同角色不同字体（第一版最多两种字体组合）

## 第一批 Primitive（PART E，12 个）

markerSweep · underlineReveal · boxFollow · karaokeFill · snap · recoil · widen · maskReveal · blurFocus · trackIn · hardShadow · strokeReveal（每个都要独立模块 + registry + recipe 可调用）。

## 模板分层（PART B）

- **Signature**：人工设计、视觉差异明显（目标 18 Family × (1 Master + 2 Variant = 54）。
- **Variants Lab**：系统生成的 160 个排列组合，单独入口，不计入 Signature。

## 不要做（PART P）：login · payment · team · cloud storage · marketplace backend · collaboration · mobile app · social account · subscription。

## 底层四原则：# One line. # Voice synced. # Designable. # Reusable.
