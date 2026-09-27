# Style Families（18）

> 进度：V2.3 完成 6 个 Master，V2.4 给每个 Master 派生 2 个 Variant → **18 Signature Presets**。
> 剩余 12 个 Family 按 V2.3/V2.4 同一套流程补齐，最终 18 × 3 = 54。

> 以后所有 Agent 做模板前**必须先读本文件**。定义见 `src/styles/families.ts`（唯一真源）。
>
> **Family = 设计作品；Variant = 参数组合。** 只有颜色不同的两个 preset 不算两个 Signature（PART N）。Signature 之间至少要有 3 项不同（字体类、版式语法、Treatment、动效语法、Rhythm、背景、强调策略。

| # | Family | 视觉语法 | 字体 | Treatment | Motion | Rhythm | Context |
|---|---|---|---|---|---|---|---|
| 01 | Creator Impact | 粗体大字 | Condensed/Heavy Sans | stroke + shadow | restrained pop | maxWords 3 | creator |
| 02 | Clean Spoken | 极简无装饰 | Neutral Sans | — | weight shift / soft fade | 3 | creator, product |
| 03 | Marker Note | 荧光笔扫过 | Neutral Sans | marker sweep | sweep | 3 | creator, lifestyle |
| 04 | Active Box | 当前词色块（4–10px） | Sans | box（禁 pill） | box follow | 5 | business, creator |
| 05 | Karaoke Sweep | 逐词渐进填充 | Sans | karaoke fill | progressive | 3 | creator, podcast |
| 06 | Editorial Serif | 杂志排版 | Editorial Serif | — | italic + weight | 5 | editorial |
| 07 | Editorial Inverse | 黑底米字深红 | Serif | 小圆角块 | weight | 5 | editorial, business |
| 08 | Multi Font | Sans + Serif 混排 | 两种 | — | weight | 5 | editorial, business |
| 09 | Broadcast | 左竖条·硬矩形 | Sans | 小色块 | structure | 5 | business, data |
| 10 | Podcast Quiet | 小字低位 | Sans | shadow | highlight/float | 7 | podcast |
| 11 | Data Hero | 数字为主角 | Sans + Display | — | snap/pop | data 4 | data, business |
| 12 | Sports Condensed | 大写窄体 | Condensed | stroke | snap/punch | 3 | sports |
| 13 | Tech Terminal | 等宽绿青深色 | Mono | type reveal | cursor(optional) | 3 | code, product |
| 14 | UI Clarity | 界面清晰度 | Sans/Mono | underline·细框 | underline sweep | 3 | product, code |
| 15 | Pixel Y2K | 像素锐利 | Pixel | — | step/snap | 3 | code, sports（planned） |
| 16 | Retro TV | CRT/VHS 轻色散 | Sans | chroma shadow | flicker 极弱 | 5 | lifestyle（planned） |
| 17 | Neon Glow | 暗色洁净微光 | Sans | glow（仅 active word） | glow pulse | 3 | creator（planned） |
| 18 | Comic Punch | 粗描边硬投影 | Heavy Display | stroke + hard shadow | punch | 3 | creator（planned） |

## Dos / Don'ts（通用）

**Do**：单行、随时可读、rhythm 决定切分、context 决定预览背景、强调色克制（黄/蓝为主）。

**Don't**：pill 胶囊、底部 progress bar、flip 90°、continuous marquee、巨型 bounce（>1.1 scale）、长 blur、把新闻 Ticker 当字幕、把字幕做成真的终端窗口、复制 Linear/Figma 真实 UI、RGB cyberpunk 渐变、过度 glitch。

## 评分（PART M）：1–5 分：Distinctiveness · Readability · Motion Quality · Brand Fit · Versatility · Single-Line Stability。进 Featured 需前四项各 ≥4。

## Demo 文案（PART T，每族内部同一句便于比较）

Creator「你只需要记住这一件事。」｜Editorial「真正重要的变化，往往发生得很安静。」｜Data「成交量今天增长了 35%。」｜Tech「AI 正在重新定义软件的工作方式。」｜Podcast「我后来才意识到，这件事没有那么复杂。」｜Business「市场正在重新寻找新的增长方向。」
