# evidence.md · sera-subtitle-factory

事实清单。展示文案只能引用本文件能支撑的结论。

## 已验证（Observed）

| 事实 | 方式 | 日期 |
|---|---|---|
| 仓库为 Next.js + TypeScript 工程（next.config.mjs / tsconfig / tailwind / vercel.json） | GitHub API 实查 | 2026-10-03 |
| `docs/architecture.md` 存在（4.4KB），与 README 的目录结构描述一致：caption-engine / presets / store / design-system | GitHub API 实读 | 2026-10-03 |
| `docs/` 另含 progress.md / font-licenses.md / research-method.md / style-families.md / v2-design-system.md | GitHub API 实查 | 2026-10-03 |
| README 明示 Phase 1 MVP 范围与「不做」排除清单 | README 实读 | 2026-10-03 |
| **线上产品站存在**：gh-pages 分支为 Next.js 静态导出（index/studio/library/recipes），https://78tyih.github.io/sera-subtitle-factory/ 全 200（首页/studio/showcase 实测） | gh API + curl | 2026-10-03 |
| gh-pages 最后部署 2026-09-27「deploy: static site」（比 main 当前提交早，在线版可能落后源码） | gh API commits 实查 | 2026-10-03 |
| 动效克制标准有明确数值：pop 峰值 1.09 / bounce 5px / float 8px | architecture.md 实读 | 2026-10-03 |
| 已移除 flip 与 marquee 两种动效（违背「字幕随时可读」） | README 实读 | 2026-10-03 |
| 无 LICENSE 文件（仓库根目录实查） | GitHub API 实查 | 2026-10-03 |

## 自述未独立复核（Inferred · Self-reported）

| 声明 | 复核方式 |
|---|---|
| 200 presets（12+28+160）、18 种动效、31 种字体、四格式导出 | 需本地 `npm run static` 逐项核对 |
| Undo/Redo 双栈上限 40 步、zustand persist 字段清单 | 需读 store 源码 |
| AI 助手无 Key 时走本地规则模式 | 需运行核对 |

## 未验证（Unknown）

| 项 | 说明 |
|---|---|
| 在线版与源码同步度 | gh-pages 部署于 2026-09-27，main 后续提交是否已反映在线版未核对 |

**展示页动效原型**按仓库公开文档的规则与数值独立实现（pop 1.09 / bounce 5px / float 8px 等），用于讲解，非引擎本体渲染。

## 授权边界

- 无 LICENSE 文件 → 默认版权保留。**展示页原型仅复现其公开文档中的规则与数值（pop 1.09 / bounce 5px / float 8px 等），不含其源码**。复用其代码需先补授权；三条硬规则与动效数值作为方法论可参考。
