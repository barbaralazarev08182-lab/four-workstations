---
name: art-direction-review
description: |
  Visual art review for four-workstations. Use before declaring any visual
  change complete. Requires fixed-camera screenshots, grayscale legibility
  checks, and cross-viewport verification.
---

# Art Direction Review

## Pre-approval rule

A passing `pnpm build`, a clean DOM snapshot, or zero console errors are **not** sufficient to declare a visual change complete.
Every significant visual change must pass this review.

## Required screenshots (every round)

| Shot | Viewport | Purpose |
|------|----------|---------|
| Office panorama | 1280×800 | Overall composition |
| Mobile viewport | 390×844 | Responsive layout |
| Personal desk mid-shot | 1280×800 | Character + workstation focus |
| Changfen activity zone | 1280×800 | Cat area close-up |
| Night scene | 1280×800 | Dark theme verification |
| Grayscale legibility | 1280×800 | Contrast hierarchy |

## Review checklist

For each screenshot, check:

1. **Thumbnail readability** — recognizable at 200px wide
2. **Zone identifiability** — each area is visually distinct
3. **Light-dark hierarchy** — foreground separates from background
4. **Character-background separation** — characters don't blend into walls
5. **Changfen silhouette** — cat outline and face are recognizable
6. **Occlusion** — no important element hidden behind geometry
7. **Visual focal point** — clear where the eye should land first
8. **Material consistency** — no texture style clashes
9. **Lighting logic** — light sources match the environment story
10. **Composition completeness** — the shot looks intentional, not accidental

## Art modification order

Always follow this sequence. Never skip ahead:

```
Composition → Spatial proportion → Camera → Lighting → Materials → Decorative details
```

**Forbidden**: Hiding composition problems by piling on small props.

## Quality bar

Each major camera shot should eventually reach "promotional screenshot" quality — suitable for a landing page or tweet.

## External references

Reference works (games, illustrations, architectural models) may only be used to **extract principles**.
Never directly copy a protected asset or arrangement.

## Final approval

No visual change may be declared "final art quality" without human review or AI-assisted visual model review.

## 正式验收流程

固定截图、灰度测试和缩略图测试是正式验收流程，不可跳过：

1. **固定机位截图**：每次视觉变更后必须在以下机位截图：
   - 1280×800 日间全景
   - 1280×800 夜间全景
   - 390×844 手机区域镜头
   - 1280×800 灰度版

2. **灰度测试**：将截图转为灰度，验证明度层级（人物与背景明度差 ≥15%、区域可区分）

3. **缩略图测试**：将截图缩至 200px 宽，验证区域和人物仍可辨识

4. **帧率验证**：桌面稳定 60 FPS、普通手机稳定 30 FPS

5. **每步验证**：Phase 1B/C 每一步完成后都必须验证帧率未跌破目标，灯光/阴影数值须经截图验证后确认，不得机械写死
