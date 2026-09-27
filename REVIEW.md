# Sera Subtitle Factory — 审核指引（for GPT）

## 线上地址（公开可访问）

| 页面 | URL |
|---|---|
| 首页 | https://78tyih.github.io/sera-subtitle-factory/ |
| 工作台 Studio | https://78tyih.github.io/sera-subtitle-factory/studio/
| 模板库 Library | https://78tyih.github.io/sera-subtitle-factory/library/
| 配方 Recipes | https://78tyih.github.io/sera-subtitle-factory/recipes/

源码仓库（public）：https://github.com/78tyih/sera-subtitle-factory

## 这是什么

一个「字幕设计工厂」：字幕样式 = Typography × Color × Background × Border × Motion × Timing × Emphasis 的可组合配置（CaptionRecipe，JSON）。
预置 **200 个字幕样式**；字体 31 种；动效 18 种（入场 8 + 逐词 10）；支持导出 JSON / SRT / WebVTT / ASS；带 AI 字幕助手；日间/夜间 + 中英双语；UI 尽量图标化（无边框纯图标）。

## 三条不可违反的产品规则（审核时请据此判断）

1. **字幕永远单行**（`maxLines: 1` + `white-space: nowrap`）。任何情况下不换行；过长则重新分段。
2. **字幕随时可读**：因此已移除「翻转」（rotateX 90° 会让字消失）与「跑马灯」（持续滚动永不停留）。
3. **演示内容去金融**：无比特币/行情/仓位等字样（分类 Finance 已改名 Broadcast）。

## 建议重点检查

- 首页：12 张卡片是否**统一尺寸**（16:9）、标签在画面下方、无文字重合。
- 工作台 → 动效：逐词动效 10 个（高亮/卡拉OK/弹跳/回弹/浮动/缩放/发光/字重变化/模糊显现/波浪，无翻转/跑马灯）。
- 工作台 → 颜色：是否有「背景颜色」（9 色板 + HEX 输入），调色后字幕底块是否实时变化。
- 时间轴：播放头是否和波形/字幕段**同步推进**（同一坐标系）。
- 模板库：200 张卡；中文分类过滤。
- 主题/语言切换：右上角图标（日/月、中/EN）。
- AI 助手：对话框；未配置 API Key 时走本地规则（会标注「本地模式」）。

## 已知约束

- 当前是**静态导出**（Next `output: 'export'`），纯前端，无后端；AI 联网需用户自填 OpenAI 兼容 endpoint + key（存浏览器 localStorage）。
- 字幕时间轴是**模拟播放**（内置假转录），Phase 2 会接 Whisper 真实时间戳。
- Vercel 部署在本机 CLI 侧异常（连续多次卡在 UNKNOWN，云端不构建），因此改用 GitHub Pages 静态托管。
