# Font Licenses

原则：**没有明确授权的字体不打包进产品**。`src/caption-engine/typography/fonts.ts` 里 14 个栈都标注了 `status`：

- `system` = 目标系统自带，可直接用。
- `fallback` = 会静默降级，UI 必须显示 **Fallback**（PART S：不能假装字体已加载）。

| Font | Role | Source | License | Commercial | Modification | Local asset | Status |
|---|---|---|---|---|---|---|---|
| Inter | Neutral Sans | system / rastfonts | OFL | ✅ | ✅ | — | system |
| Helvetica Neue / Arial | Neutral Sans (alt) | macOS / Windows | 系统自带 | ✅ | ❌ | — | system |
| PingFang SC | Chinese Sans | macOS | 系统自带 | ✅ | ❌ | — | system（作为思源黑体回退）
| Source Han Sans SC / Noto Sans SC | Chinese Sans | Adobe / Google | SIL OFL | ✅ | ✅ | 待托管 `/public/fonts/` | fallback |
| Poppins / Futura / Century Gothic | Geometric Sans | Google / system | OFL / 系统 | ✅ | ✅ | 待托管 | fallback |
| Smiley Sans（得意黑） | Heavy Display (CN) | GitHub:atelier-anchor/smiley-sans | SIL OFL | ✅ | ✅ | 待托管 | fallback |
| Archivo Narrow / Oswald / Impact | Condensed Sans | Google / system | OFL / 系统 | ✅ | ✅ | 待托管 | fallback |
| Georgia / Times New Roman | Editorial Serif | system | 系统自带 | ✅ | ❌ | — | system |
| Source Han Serif SC / Noto Serif CJK | Chinese Serif | Adobe / Google | SIL OFL | ✅ | ✅ | 待托管 | fallback |
| Playfair Display | Display Serif | Google Fonts | SIL OFL | ✅ | ✅ | 待托管 | fallback |
| SF Mono / Menlo / Consolas | Mono | macOS / Windows | 系统自带 | ✅ | ❌ | — | system |
| JetBrains Mono | Mono (display) | JetBrains | SIL OFL | ✅ | ✅ | 待托管 | fallback |
| LXGW WenKai（霞鹜文楷） | Hand / Kai | GitHub:lxgw/LxgwWenKai | SIL OFL | ✅ | ✅ | 待托管 | fallback |
| Geist | UI Clarity (display) | Vercel | SIL OFL | ✅ | ✅ | 待托管 | fallback |

## 托管流程（下一轮）

1. 下载 woff2；2. 放 `/public/fonts/`；3. 加 `@font-face`（font-display: swap）。4. 把对应 `status` 改成 `system`。GitHub Pages 静态导出支持本地字体 ✅（不依赖外部 CDN，合规可控）。

## 检查方式（浏览器）

```js
document.fonts.check('16px "Source Han Sans SC"') // false 就必须在 UI 标 Fallback。
```
