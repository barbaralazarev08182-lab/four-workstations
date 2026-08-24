# Four Workstations — VQ-2 Vertical Slice Plan

> 状态：ACTIVE / CANONICAL NEXT-STEP PLAN  
> 建立：2026-08-24  
> 目的：在继续扩大 VQ-2 玩法设计前，用一个最小可玩的垂直切片验证核心循环：现实行为 → 奖励 → 共同建造 Atlas → 世界发生可见变化。

---

## 0. 当前决策

VQ-1C 继续保持冻结：

- Office R5 / Rugfix：`FINAL / FROZEN`
- Camera / SAFE_AREA：`FINAL / FROZEN`
- Character visual / scale / path / lighting / Two-Scene：`FINAL / FROZEN`
- Night Desk Lighting：`FINAL / FROZEN`
- Seated Character：`REJECTED / CLOSED`

VQ-2 当前不继续无限扩展策划，也不一次性开发完整游戏。

下一阶段采用：

> **DESIGN LOCK → ATLAS GREYBOX → CORE LOOP VERTICAL SLICE → HUMAN PLAYTEST**

只有 Vertical Slice 被真实用户体验证明成立后，才扩展 Shop、Garden、Memory Wall、Rooftop、Desktop Mode 等系统。

---

# 1. Vertical Slice 要证明什么

唯一核心问题：

> “现实中的一次有效行为，能否通过奖励与 Atlas 建造，产生足够强的世界变化反馈，让玩家想继续回来？”

最小目标循环：

```text
进入 Office
↓
今日 Check-In
↓
开始一次 Focus
↓
Focus 完成
↓
获得 XP + Coins + Build Charge
↓
点击 Atlas
↓
投入 Build Charge
↓
Atlas Build Progress 增长
↓
达到阶段阈值
↓
Atlas Phase 发生真实场景变化
↓
玩家看到“我们正在把这个世界造出来”
```

此切片不要求完整长期游戏，只要求证明这条链条是否有感觉。

---

# 2. Project Atlas V1 — Design Lock

状态：`LOCKED FOR GREYBOX`

工作名：`Project Atlas`。

最终命名仍为 `OPEN`。

## 2.1 视觉原则

Atlas 必须像办公室里原本就可能存在的一台实验性共建装置，而不是外来科幻传送门。

关键词：

- warm metal
- wood
- off-white plastic
- brass
- glass
- restrained emissive
- low-poly
- architectural model
- handmade prototype

明确避免：

- cyberpunk neon
- giant hologram
- giant portal ring
- realistic industrial machine
- excessive VFX
- complex skeletal machinery

## 2.2 空间原则

Atlas 位于四张 Desk 的中央视觉区域，但必须服从现有冻结 Office。

硬原则：

- 不移动 Desk
- 不修改 Camera
- 不修改 SAFE_AREA
- 不修改 Character canonical business destinations，除非未来另开兼容 Gate
- 不堵塞主要 Character routes
- 不遮挡四名角色的基础读取
- 不成为巨型横向障碍

设计策略：

> **小占地、向上成长、上部结构尽量通透。**

### Greybox 尺寸预算

第一轮 Greybox 使用以下预算，而不是直接当作最终美术尺寸：

- Base 最大占地：约 `1.20m × 1.20m`
- Phase 0–2 实体主体最大高度：约 `1.25m`
- 未来悬浮 / 开放式视觉结构可以高于主体，但第一章建议总视觉高度不超过约 `1.80m`
- 超过预算必须通过 Human Visual + route clearance 重新授权

这些数值是 **Greybox constraint**，最终尺寸由真实浏览器截图决定。

---

# 3. Atlas Phase 0–2 — First Prototype

只设计并验证前三个视觉阶段。

不要现在制作 Phase 3–5 正式资产。

## Phase 0 — Blueprint / Parts

场景语言：

- 一个低矮装配底垫或薄底板
- 两三个零件箱
- 少量机械零件
- 一张卷起 / 展开的 blueprint 元素
- 中央区域仍然非常空

玩家感受：

> “这里准备开始造一个东西。”

动画：无。

## Phase 1 — Foundation

场景语言：

- 正式底座出现
- 四向结构开始明确
- 四个 Personal Module Socket 被建立
- 仍然保持低矮、机械结构简单

玩家感受：

> “这已经不是杂物，而是一个工程。”

动画：阶段切换时允许一次非常短的 transform feedback；常驻无复杂动画。

## Phase 2 — Core

场景语言：

- 中央 Core 出现
- 主体明显向上成长
- 第一次出现非常克制的 emissive
- 一个轻量机械部件可以缓慢旋转
- 四向 Module 更容易读取

玩家感受：

> “它第一次真正活了。”

动画上限：

- 1 个 slow rotation
- 1 个 restrained emissive pulse
- phase-up transition

禁止骨骼、物理装配、大量粒子。

---

# 4. Four-Person Contribution — Prototype Rule

状态：`LOCKED FOR VERTICAL SLICE`

Atlas Progress 与四人共同参与分开处理。

## 4.1 Build Progress

任何成员都可以推进。

一个成员不能因为其他三人暂时不上线而被永久卡住。

## 4.2 Personal Module

当前 Phase 中，成员第一次产生有效 Atlas contribution 后，其个人 Module 激活。

```text
Ming   ○ / ●
Hong   ○ / ●
Jie    ○ / ●
Qixi   ○ / ●
```

`4/4` 触发额外 `Harmony Activation`。

Harmony 可以影响：

- 特殊短动画
- Atlas cosmetic
- Memory / collectible

但不得成为核心 Phase 解锁的强制条件。

---

# 5. Build Charge — Minimal Rule

状态：`LOCKED FOR PROTOTYPE / BALANCE TUNABLE`

Build Charge 是行为资源，不是 Shop Currency。

规则：

- 不可购买
- 不可交易
- 不允许 Coins 兑换
- 来自真正有效 gameplay
- 每日有限获取
- 可少量储存

Prototype 初始值：

- 25min 有效 Focus：`+1 Build Charge`
- 50min 有效 Focus：`+2 Build Charge`
- 每人每天最大获得：`2`
- 储存上限：`6`
- 投入 Atlas：每次消耗 `1`

这些数字允许在 playtest 后调整，但机制结构暂时不变。

---

# 6. XP / Coin — Minimal Economy Lock

状态：`LOCKED FOR PROTOTYPE / BALANCE TUNABLE`

只使用：

- `XP`：成长，不可消费
- `Coins`：商店消费
- `Build Charge`：Atlas 行为资源

不增加第四种货币。

## 6.1 Prototype Reward Table

| 行为 | XP | Coins | Build Charge |
|---|---:|---:|---:|
| 今日首次有效 Check-In | 10 | 10 | 0 |
| 25min Focus | 25 | 15 | 1 |
| 50min Focus | 50 | 30 | 2 |
| 当日首次与不同成员有效互动 | 5 | 0 | 0 |
| Atlas contribution | 10 | 0 | 消耗 1 |
| Atlas Phase complete | 100 | 50 | 0 |

Interaction XP 只奖励少量、有限的有效社交行为，禁止通过 Poke spam 刷经验。

## 6.2 Coin Soft Curve

Coin 主要来自有效 Focus，但不鼓励一天无限刷币。

Prototype：

- 前 2 次有效 Focus：100% Coin reward
- 第 3 次：80%
- 第 4 次及以后：30%

XP 不必使用同样的强衰减。

每日正常 Coin 目标暂定约 `80–150`，待 playtest 调整。

---

# 7. Player Level 1–10 — Minimal Unlock Table

状态：`LOCKED FOR PROTOTYPE CONTENT`

Vertical Slice 不实现 Lv.1–30 完整内容。

先验证 Lv.1–10。

| Level | 初步意义 |
|---:|---|
| 1 | 基础 Presence / Focus / Atlas |
| 2 | Shop 基础分类开放 |
| 3 | Personal Desk 第一个 decoration slot |
| 4 | 新的基础 shop item |
| 5 | Personal Plant Slot |
| 6 | 第二个 decoration slot |
| 7 | 高级 shop item 分类 |
| 8 | Personal Photo / Memory Slot |
| 9 | 一个稀有 cosmetic 解锁 |
| 10 | Future Specialization 入口占位；Vertical Slice 不实现 specialization 本体 |

Level 的核心原则：

> 解锁选择，不直接提升现实工作效率。

禁止：

- 高等级 Focus 自动更值钱
- 高等级 Atlas contribution 倍增
- 高等级才能进入团队公共地图

XP 曲线在 Vertical Slice 中保持简单并集中配置，具体数值允许后续 balance。

---

# 8. First Shop — 10-Item Content Lock

状态：`LOCKED FOR FIRST PLAYABLE SHOP`

第一版 Shop 只验证“赚 Coin → 想买东西 → 工位可见变化”。

不做完整商城。

| Item | 建议价格 | Slot / 类型 | 制作风险 |
|---|---:|---|---|
| Classic Mug | 100 | Mug | 极低 |
| Book Stack | 140 | Decor | 极低 |
| Photo Frame | 160 | Photo | 极低 |
| Small Cactus | 180 | Plant | 低 |
| Succulent | 220 | Plant | 低 |
| Desk Clock | 240 | Decor | 低 |
| Headphone Stand | 260 | Decor | 低 |
| Wooden Desk Toy | 300 | Toy | 低 |
| Mini Rocket | 320 | Toy | 低 |
| Small Trophy | 400 | Rare / Decor | 低 |

规则：

- 全部 low-poly
- 固定 Anchor Slot
- 不自由摆放
- 不产生额外真实灯光
- 不需要骨骼动画
- 不影响 Character path
- 尺寸需要针对 frozen camera 稍作可读性夸张

价格只作为 Prototype economy 输入，不视为长期正式平衡。

---

# 9. Greybox Gate — FIRST DEVELOPMENT STEP

这是下一步真正应该开始的开发。

状态：`NEXT`

## 9.1 Scope

只做 Atlas Phase 0 / 1 / 2 Greybox。

Greybox 可以使用：

- box
- cylinder
- simple low-poly primitive
- placeholder material

不要先花时间做最终 Blender 美术。

## 9.2 Required QA Control

开发 / QA 环境允许：

```text
Phase 0
Phase 1
Phase 2
```

快速切换。

Production 用户路径不得暴露该 QA 控件。

## 9.3 Browser Visual Acceptance

必须用冻结 Camera 真实浏览器截图检查：

1. Phase 0 是否自然存在于四桌中央。
2. Phase 1 是否一眼看出“开始建造”。
3. Phase 2 是否一眼看出“机器活了”。
4. 三阶段轮廓差异是否足够明显。
5. Atlas 是否抢走过多视觉注意力。
6. 是否遮挡角色 / labels。
7. 是否与 Desk / Chair / routes 穿模。
8. 是否影响 meeting / coffee / dining / sofa 的视觉关系。
9. Day 是否协调。
10. Night 是否协调。
11. 现有角色路径是否仍正常。
12. FPS 是否保持 desktop >60。

如果 Greybox Visual FAIL：

> 先修改体量、轮廓、位置，不进入正式模型制作。

---

# 10. Core Loop Vertical Slice

只有 Atlas Greybox Human Visual PASS 后才开始。

状态：`AFTER GREYBOX PASS`

第一版目标不是上线完整经济系统，而是让以下链路可真实玩：

```text
Check-In
↓
Focus
↓
XP / Coins / Build Charge
↓
Atlas Contribution
↓
Build Progress
↓
Phase Change
↓
Scene Feedback
```

## 10.1 Implementation Strategy

推荐分两层验证：

### Layer A — Local Prototype

先证明：

- reward feedback 是否清楚
- contribution 是否有参与感
- Phase change 是否有爽感
- 玩家是否理解下一步

允许开发环境缩短 Focus 时间用于测试。

但 Production-facing 产品规则仍以真实 25/50min 为目标。

### Layer B — Shared Production Integration

只有 Local Core Loop PASS 后，再接：

- Supabase persistence
- Office-shared Atlas state
- Realtime Atlas progress
- 4 Personal Modules
- 多账号同步

这样避免在核心感觉尚未验证前就先堆数据库复杂度。

---

# 11. Vertical Slice Explicit Non-Goals

本阶段明确不同时开发：

- 完整 Lv.1–30
- 完整 Shop catalog
- Character cosmetic system
- Full Garden
- Rooftop map
- Memory Wall
- Daily Office Postcard
- Project Shelf 完整系统
- Pet / mascot
- Aquarium
- Desktop Office Mode
- Specialization 本体
- 第二地图
- Battle / dungeon / RPG system
- 排行榜
- Productivity competition
- 多货币经济

这些内容保留在长期 roadmap，但不进入本轮开发。

---

# 12. Success / Kill Criteria

Vertical Slice 只有满足以下体验才值得扩展：

## Success

玩家能够自然理解：

> “我现实里做事情 → 游戏给我东西 → 我把东西投入我们共同的工程 → 办公室真的因此发生变化。”

并且至少出现其中三种感受：

- 想再推进一点
- 想看看下一阶段长什么样
- 想等朋友也来贡献
- 想攒 Coin 买一个可见物件
- 第二天想回来看看 Atlas 是否变化

## Kill / Rework Signal

如果 Human Playtest 发现：

- Focus reward 只是数字，没有满足感
- Atlas contribution 只是另一条进度条
- Phase change 在场景里不明显
- Atlas 放在中央破坏 Office 构图
- 玩家完全不关心其他三人的贡献
- Coin / Level 明显比世界变化更吸引注意，导致产品变成普通挂机数值游戏

则停止扩展，先重做 Core Loop，不进入 Garden / Rooftop / 更多内容。

---

# 13. Recommended Execution Order

```text
VQ-2A
Atlas Scene Greybox
↓
Human Visual Gate
↓
VQ-2B
Local Core Loop Vertical Slice
↓
Human Playtest
↓
VQ-2C
Shared Supabase / Realtime Atlas
↓
2-account / 4-account validation
↓
VQ-2D
First Shop + Personal Desk visual progression
↓
Only after core loop proves itself:
Garden / Memory / Rooftop / World Expansion
```

---

# 14. Current Next Gate

```text
NEXT GATE = VQ-2A — PROJECT ATLAS SCENE GREYBOX
```

唯一目标：

> 在不改变任何 VQ-1C frozen system 的前提下，验证 Phase 0–2 的 Atlas 放在四桌中央是否在尺寸、构图、路线、Day/Night、风格上成立。

本 Gate 不实现完整经济，不实现 Shop，不实现数据库 Atlas，不实现新地图。

---

# 15. Decision Log

## 2026-08-24 — Vertical Slice Strategy Locked

决定：不继续无限扩大玩法讨论，也不一次性实现完整 VQ-2。

采用：

`Design Lock → Atlas Greybox → Local Core Loop → Shared Integration → Expansion`

理由：

- 当前产品方向已经足够清楚。
- Atlas 是未来最重要的场景主线，但也是对现有 Office 构图风险最大的新增物件。
- 必须先用低成本 Greybox 验证位置和体量。
- 必须用一个可玩的核心循环验证“现实行为驱动世界成长”是否真的有留存潜力。

## 2026-08-24 — Prototype Economy Locked

决定：Vertical Slice 只使用 `XP + Coins + Build Charge`。

Build Charge 不可购买、不可 Coins 兑换；Atlas progression 不直接出售。

## 2026-08-24 — First Shop Content Locked

决定：第一版 Shop 只做 10 个低风险固定 Slot low-poly 物件，用来验证 Personal Desk 的可见成长，不扩展自由摆放。

---

本文件是当前 VQ-2 最近期执行计划。长期方向继续记录于：

`docs/VQ2_GAME_DESIGN_ROADMAP.md`
