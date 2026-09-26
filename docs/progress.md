# Progress

## Done · Phase 1 (2026-09-27)

**项目骨架**
- Next.js 14 + React 18 + TypeScript + Tailwind 3 + framer-motion + zustand
- 目录：`src/{app,components,caption-engine,presets,types,lib,store,design-system}`

**数据模型（01）**
- `types/caption.ts`：WordTimestamp / CaptionSegment / TypographyStyle / ColorStyle /
  ActiveWordStyle / EmphasisRules / BackgroundStyle / BorderStyle / MotionStyle /
  LayoutStyle / CaptionRecipe，以及预留的 4 个 Plugin 接口
- `layout.maxLines` 的类型就是字面量 `1` —— 两行在类型层就不合法

**CaptionRenderer（02）**
- `caption-engine/renderer/`：CaptionRenderer / WordRenderer / BackgroundRenderer
- 组合顺序：segment × words × background × border × motion × layout
- 强调词与 active 词都用 `transform: scale()`，不改变 layout width → 不推挤邻词

**Word Timeline（03）**
- `lib/demo-transcripts.ts`：6 个假转录（金融 / 技术 / 观点 / 中英混排 / 数字 / 超长句），
  word-level start-end
- `caption-engine/resolve.ts`：currentTime → activeWord（含 isSpoken / 段间不闪烁）
- 播放时钟 `usePlayback`：60fps rAF，循环

**Motion System（04）**
- `caption-engine/motions/`：fade / float / slideUp / scale / pop / bounce / glow /
  weightShift / blurReveal —— 每个独立文件，Recipes 只存名字
- `motion-tokens.ts`：所有时长/距离/弹簧集中管理，组件里没有魔法数字
- pop：`1.00 → 1.09 → 1.04 → 1.00`；bounce：`Y 0 → -5 → 1 → 0`；float ≤ 8px

**Recipe System（05）**
- 12 个 preset 独立文件 + `presets/_shared.ts`
- zustand store（partialize 持久化到 localStorage）+ undo/redo 栈
- 导出 / 导入 / 复制 / 重命名 / 删除

**Studio UI（07）**
- Left Sidebar(8 个面板) + Center Preview(9:16/16:9/1:1/4:5) + Right Inspector + Bottom Timeline
- Safe area 辅助线、Undo/Redo、Save Recipe
- 第一次打开自动加载 Demo（不需要上传就能玩）

**Library（08）**
- 12 张卡片，Hover 播放 1–2 秒动效，Style / Background / Motion / Highlight 四维过滤 + 搜索

**主题 + 双语（2026-09-27 追加）**
- 语义 CSS 变量两套（dark / light），Tailwind 颜色全部指向变量，支持透明度修饰
- `lib/theme.tsx`（ThemeProvider + boot script 防闪烁，默认 dark）+ `lib/i18n.tsx`（中英字典 190+ 条）
- 顶栏 `ThemeToggle` / `LangToggle`，首页 Hero 也放了紧凑版；选择都写入 localStorage
- 12 个 preset 补 `nameZh` / `descriptionEn`，转录补 `titleEn`，中文模式下不再满屏英文

## Current
- Phase 1 验收全部通过，等指令进入 Phase 2
- **交付形态修正**：新增静态导出（`npm run static` → `./out` + `scripts/serve.mjs` :4311）。
  原因：Next 客户端路由 `/studio` 在静态预览面板里会被当作静态文件请求而 404；
  改成静态导出后 `/studio/`、`/studio`、`/library/`、`/recipes/` 全部直出 HTML，任意静态环境可用。
  `next.config.mjs` 用 `SSF_EXPORT=1` 切换 `output: 'export'` + `trailingSlash`。

## Problems（已解决）
1. **Hydration mismatch（React #418）**：SSR 用估算宽度、客户端用 canvas 真实测量 →
   分段不同。解决：`measureText(..., allowCanvas)`，首帧两边都用估算，挂载后再用 canvas。
2. **中文分词**：ICU 的 `Intl.Segmenter('zh')` 无词典，把「比特币」切成单字、把「12%」拆成
   「12」+「%」。解决：`lib/lexicon.ts` 自建金融词典 + 最长匹配 + 严格数字正则。
3. **全角标点被中文分支吞掉**：`\u2e80-\u9fff` 包含 U+FF0C（，），导致「，后面整句」变成一个
   token。解决：CJK 区收紧到基本汉字区，标点单独分支，且必须 `length === 1`。
4. **数字单位**：`24H` 没被识别成数字。解决：数字正则允许 1–3 个尾随字母。
5. **颜色优先级**：强调词被 idle 色覆盖。解决：按 spec §46 重排
   `active > emphasis(persistent) > idle > normal`。
6. **x264 奇数高度**（前一个项目 Sera Caption Library）：1080×607 无法编码 → 导出时 pad 到偶数。

## Next（Phase 2 · 未开始）
- Video upload（MP4 / MOV / WEBM / MP3 / WAV / M4A）
- 音频抽取 + faster-whisper word timestamp
- Single Line Segmenter 接真实转录
- Phase 3：Remotion 渲染器 + FFmpeg 导出 MP4 / SRT / ASS / WebVTT

## Decisions
- Phase 1 不碰登录 / 数据库 / 支付 / SaaS（spec §76）
- 不接 AI（emphasis 走纯规则），`analyseLLM()` 只是占位
- Preview 用 React 实时渲染，不重新 render 视频（spec §60）
- 字体走系统栈，不下载网络字体（避免构建期网络依赖）
