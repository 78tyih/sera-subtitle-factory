# Sera Subtitle Factory

**Make captions move with every word.** 让每一个字，都跟着声音动。

像设计 UI 一样设计字幕 —— 单行 · 语音驱动 · 数字放大 · 自由组合 · 实时预览。

> Phase 1 MVP（不含 Whisper / 导出，见 `docs/progress.md`）

## 快速开始

```bash
npm install
npm run dev        # 开发：http://localhost:4310
```

**推荐入口（静态版，零 SSR、可被任何静态预览面板 / CDN 打开）**

```bash
npm run static     # 导出 + 起静态服务器 → http://127.0.0.1:4311/studio/
```

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器 :4310 |
| `npm run static` | 静态导出(./out) + 静态服务器 :4311 ← **推荐** |
| `npm run export` | 只做静态导出（`./out`，可直接上传到任意静态托管） |
| `npm run build` / `npm start` | 动态构建 / 启动 :4310 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

> 说明：`npm run export` 与 `npm run build` 共用 `.next`，两者之间切换时需要重新跑对应命令。

## 主题与语言

- **默认比例 16:9**（可切 4:3 / 1:1 / 9:16），字幕按横屏设计；短视频竖版仍可选。
- **日间 / 夜间**：右上角切换，默认夜间（spec §50），选择写入 localStorage，刷新保持。
  全部颜色走语义 CSS 变量（`--c-panel` / `--c-ink` / `--c-line`…），Tailwind 类同时适配两个主题；
  字幕预览框固定深色（那是视频画面，不随 UI 主题变化）。
- **中文 / English**：右上角切换，默认跟随浏览器语言（zh → 中文），可随时切换并记忆。
  所有界面文案走 `src/lib/i18n.tsx` 字典；预设与转录标题也带中英双语字段（`nameZh` / `descriptionEn`）。

## 字体 / 调色盘 / 导出 / AI

- **字体 31 种**，按「西文无衬线 / 中文黑体 / 衬线 / 等宽手写」分组
- **调色盘**：16 色预设 + 系统取色器 + **HEX 输入框**（支持 `#FFF` / `#FFD400`）
- **导出**（顶栏下载图标）：JSON 配方 · SRT · WebVTT · ASS 字幕
- **AI 助手**（顶栏星标）：对话框直接写字幕，输完可「用作字幕文本」+「套用推荐样式」；
  配置任意 OpenAI 兼容接口即可联网，**没配 Key 时走本地规则模式**（关键词匹配样式 + 造句）

## 四个页面

| 路由 | 内容 |
|---|---|
| `/` | Hero + 6 个 16:9 自动循环的字幕 Demo + 四个旗舰样式 |
| `/studio` | **工作台**：Left Sidebar + Center Preview + Right Inspector + Bottom Timeline |
| `/library` | 12 个 Preset，Hover 播放动效，四维过滤 + 搜索 |
| `/recipes` | Recipe 管理：保存 / 复制 / 重命名 / 删除 / 导入 / 导出 JSON |

## 核心概念

```text
Caption Recipe = Layout + Typography + Color + ActiveWord + Number
               + Emphasis + Background + Border + Motion
```

一份 Recipe 是一份 JSON。复制给别人就能复刻同款字幕。

## 三条硬规则

1. **永远单行** —— `maxLines: 1` 写进类型，`white-space: nowrap` 写进 CSS。
   字幕超宽时**重新分段**，绝不换行。
2. **跟着声音走** —— 每个词带 `start` / `end`，播放到某一刻就知道哪个词是 `activeWord`。
   状态机：`idle → active → spoken`。
3. **不推挤邻词** —— active / 强调只改 `transform` + `color`，不改 layout 尺寸。

## 40 个 Preset（12 核心 + 28 扩展）

核心 12：Minimal White · Minimal Black · **Editorial** · **Finance Yellow** · **Finance Blue** · Data Focus · **Left Bar** · Clean White Card · Clean Black Card · Neon Blue · Word Pop · Word Float

扩展 28：Outline Hollow · Uppercase Tight · Wide Tracking · Soft Shadow · Marker Yellow · Underline Accent · Number Hero · Crimson Strong · Amber Alert · Emerald Calm · Purple Glow · Left Box · Glass Soft · Top Band · Quote Serif · Classic Subtitle · News Band · Serif Minimal · Karaoke Yellow · Karaoke Blue · Word Pop Soft · Editorial Weight · Mono Terminal · Split Color · Bold Outline Box · Podcast Lower · Editorial Inverse · Tech Blue Bar

粗体 = 四个旗舰 Demo（整个视觉系统的基准）。数字默认 ×1.20 / 字重 800 / 黄色。

## 9 种逐词动效

`highlight` · `pop`（1.00→1.09→1.04→1.00）· `bounce`（Y 0→-5→1→0）· `float`（≤8px）·
`scale` · `glow` · `weightShift` · `blurReveal` · `none`

入场：`fade` · `float` · `slideUp` · `slideDown` · `scale` · `blurReveal`

## 目录

```
src/
├── app/                 # 4 个页面
├── components/          # studio · preview · inspector · timeline · library · ui
├── caption-engine/      # renderer · segmenter · emphasis · motions · backgrounds · borders · typography
├── presets/             # 12 个 preset（每文件一个）
├── types/caption.ts     # 数据模型 + Plugin 接口
├── lib/                 # demo-transcripts · lexicon（分词）· hooks
├── store/caption-store.ts
└── design-system/tokens.ts

docs/
├── progress.md          # Done / Current / Next / Problems / Decisions
└── architecture.md      # 引擎 / 动效 / Recipe / Timeline 与 Phase 2·3 接口
```

## 不做（明确排除）

两行字幕 · 底部进度条 · 胶囊字幕 · 超大弹跳 · 廉价渐变 · RGB 霓虹 · 复杂纹理 ·
传统剪辑软件界面 · 登录 / 数据库 / 支付（Phase 1）

## Phase 2 / 3

- Phase 2：上传视频 → 抽音频 → faster-whisper word timestamp → 接同一套 segmenter
- Phase 3：Remotion 渲染 + FFmpeg 导出 MP4 / SRT / ASS / WebVTT

只要 `WordTimestamp[]` 与 `CaptionRecipe` 两个契约不变，UI 层不用改。
