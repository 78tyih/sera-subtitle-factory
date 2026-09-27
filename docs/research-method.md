# Caption Research Method（PART L）

目录：`research/caption-references/*.json`

## 合规边界

只记录**公开观察所得的视觉语法**（Visual Grammar）。禁止：下载隐藏 assets、提取 proprietary fonts、复制 private template JSON、绕过产品权限。闭源平台只写观察，不写实现。

## reference.json Schema

```json
{
  "source": "",
  "sourceType": "",
  "styleName": "",
  "visualFamily": "",
  "fontClass": "",
  "fontWeight": "",
  "case": "",
  "fill": "",
  "stroke": "",
  "shadow": "",
  "background": "",
  "highlight": "",
  "layout": "",
  "wordsPerSegment": "",
  "entrance": "",
  "activeMotion": "",
  "transition": "",
  "notes": ""
}
```

## Style Mutation（每收一个 Reference 必须做）

```
Observation ↓ Primitive Extraction ↓ Sera Mutation
```

例：Reference「粗白字+黑描边+黄 active+大 bounce」
→ Sera「Condensed 白 + 轻投影 + 蓝 active + restrained recoil + maxWords 3**不 1:1 克隆。**

## Sera 规则优先（PART O）

第三方 `flex-wrap` → 我们 `nowrap + Single Line Segmenter`；第三方 `Pill` → 不实现；第三方 bounce 很大 → 缩小。
