# Four Workstations — VQ-2 Game Design Roadmap

> 状态：EVOLVING / CANONICAL PLANNING DOC  
> 首次建立：2026-08-24  
> 目的：长期记录 Four Workstations 在 VQ-2 及后续版本中的玩法、场景、成长、经济和世界扩展方向。后续所有重大设计修改应优先更新本文件，而不是依赖聊天上下文。

---

## 0. 文档使用规则

本文件不是一次性策划案，而是 Four Workstations 的长期设计主文档。

每个设计项使用以下状态之一：

- `LOCKED`：当前方向已确认，除非重新开 Gate，否则不随意修改。
- `PROPOSED`：推荐方向，尚未进入正式实现。
- `EXPERIMENTAL`：允许快速原型验证，不代表最终方案。
- `OPEN`：仍需研究或讨论。
- `DEPRIORITIZED`：暂时不做。
- `REJECTED`：已明确不采用。

修改原则：

1. 保留历史决策，不直接抹掉旧方向。
2. 重大方向变化写入文末 Decision Log。
3. 场景类玩法必须同时审查玩法收益、美术成本、动画成本、位置准确度和现有冻结系统兼容性。
4. VQ-1C 已冻结内容不得因为新玩法被顺手重做。
5. 每次只推进一个明确 Gate。

---

# 1. 当前产品基线

## 1.1 VQ-1C 冻结状态

以下系统已经完成 Machine + Human Visual 验收：

- Office R5 / Rugfix：`FINAL / FROZEN`
- Office Camera：`FINAL / FROZEN`
- Workstation Geometry：`FINAL / FROZEN`
- Direct-only Lightmap：`FINAL / FROZEN`
- Animated Character Runtime：`FINAL / FROZEN`
- Character Two-Scene Rendering：`FINAL / FROZEN`
- Character Lighting Compatibility：`FINAL / FROZEN`
- Character Scale & Furniture Clearance：`FINAL / FROZEN`
- Night Desk Lighting：`FINAL / FROZEN`
- Seated Character：`REJECTED / CLOSED`

详见：

- `docs/VQ1C_CURRENT_STATE.md`
- `docs/VQ1C_FINAL_FREEZE_STATE.md`
- `docs/assets/vq1c-character-runtime-final-freeze.md`

## 1.2 当前产品已经具备

- 四人共享 Office
- 登录 / 注册 / 创建或加入办公室
- 四个固定成员 / 工位
- 14 个内部状态定义
- 状态驱动人物移动
- Character Idle / Walk
- Character labels
- Supabase current status persistence
- Supabase Realtime
- Local Mode localStorage
- Coffee / Poke / Reaction / Short Message 基础互动
- Office diary / activity feed
- Day / Night
- Room / member 基础信息

## 1.3 VQ-2 Gate 1 审计结论

当前产品已超过纯视觉 Demo，但仍未形成强日常游戏闭环。

主要问题：

- Presence 状态可无限持续，导致“吃饭 600+ 小时”等不可信状态。
- Team awareness 主要依赖场景小标签。
- Interaction 有发送反馈，但接收、未读、回复和长期历史闭环不完整。
- Office hotspots 不够可发现。
- Daily return loop 仍为 `WEAK`。
- 世界本身不会随着长期使用明显变化。

重要结论：

> VQ-2 不能只继续加按钮。必须让现实中的行为持续改变办公室与世界。

---

# 2. 产品重新定位

状态：`PROPOSED — HIGH CONFIDENCE`

## 2.1 核心幻想

> 四个人一边现实中工作、学习和生活，一边共同建设一个会不断成长的微缩世界。

Four Workstations 不应长期停留在：

> 3D Virtual Office + Presence + Productivity Tool

更有潜力的方向是：

> Shared Desktop World + Cozy Progression + Social Presence + Real-life-driven Gameplay

## 2.2 产品核心差异

不是让用户进入游戏后再“工作一次”。

而是：

```text
现实中的工作 / 学习 / Presence / 休息 / 互动
                    ↓
               游戏世界变化
                    ↓
            个人与共同长期成长
```

核心原则：

> 现实行为是游戏输入，世界成长是游戏反馈。

---

# 3. 顶层 Gameplay Loop

状态：`PROPOSED — CORE`

```text
REAL LIFE
   ↓
Presence / Focus / Interaction / Shared Activities
   ↓
Player Rewards
   ↓
XP + Coins + Build Charge
   ↓
┌──────────────┬──────────────┬────────────────┐
↓              ↓              ↓
Player Level   Shop           Central Project
↓              ↓              ↓
Unlocks        Personal Desk  Shared Phases
               / Collection   ↓
                              World Unlock
        └──────────────┬──────────────┘
                       ↓
                OFFICE EVOLVES
                       ↓
                REASON TO RETURN
```

---

# 4. 三层时间循环

## 4.1 短循环：10 秒～5 分钟

状态：`PROPOSED`

目标：每个动作都应该产生世界反馈。

当前弱形式：

```text
Send Coffee → Toast
```

目标形式：

```text
Send Coffee
→ 对方工位出现实体咖啡
→ 接收者看到 / 领取
→ 角色或物件产生短反馈
→ 发送者获得回应
```

未来短循环候选：

- Coffee 实体化
- Sticky note 留在桌边
- Reaction 临时世界效果
- Poke / Wave 轻动作
- 两人同时休息时出现非常短的共同动作

原则：

- 低压力
- 不依赖聊天框
- 世界反馈优先于 Toast
- 不增加复杂角色动画系统，优先复用现有动画或环境反馈

## 4.2 日循环

状态：`PROPOSED — REQUIRED`

目标：让现实中的“一天”成为游戏 Day Cycle。

```text
今天第一次打开
→ 今日 Presence 尚未建立
→ Check-In
→ Focus / Working / Meeting / Break
→ 人物与环境变化
→ 朋友上线 / 互动
→ Off Work
→ 今日 Office 被记录
→ 第二天重新开始
```

原则：

- 昨日状态可以保留为历史，但不能冒充今日 Presence。
- 不依赖凌晨 cron 强行清库，优先使用派生 freshness 语义。
- 缺席不受惩罚。
- 不做强制 streak。

## 4.3 长循环：数周～数月

状态：`PROPOSED — CORE RETENTION`

目标：

> 办公室越来越像这四个人真正生活过的地方。

长期变化来源：

- Player Level
- Personal Desk
- Central Project
- Garden / Project Shelf
- Memory Wall
- Collectibles
- New Areas
- Daily / Weekly memories

---

# 5. 四条核心 Progression

状态：`PROPOSED — CORE`

## 5.1 Player Level

回答：

> “我成长了多少？”

V1 建议：`Lv.1–30`

Level 主要解锁选择和内容，不应明显提高生产力效率。

可能的解锁：

- Shop 内容
- Desk decoration slots
- Plant categories
- Collectibles
- Atlas customization
- Future specialization

明确避免：

- 高等级直接大幅提高 Focus 收益
- 高等级才能进入团队公共地图
- Level 变成生产力排行榜

## 5.2 Coins + Shop

回答：

> “我想把资源花在哪里？”

V1 只保留一种主要消费货币：`Coins`（最终命名 OPEN）。

XP 与 Coins 必须分离：

- XP：成长，不可消费
- Coins：选择，可消费

Shop 主要出售：

- Desk cosmetics
- Plants / pots
- Mug / books / toys / photo frames
- Social gifts
- Collectibles
- Future character cosmetics
- Future Atlas cosmetics

明确避免：

- 钱直接买 Atlas 核心进度
- 付费获得大量 Build Charge
- FOMO 型“永久错过”商店
- 多种冗余货币

## 5.3 Personal Desk

回答：

> “什么东西属于我？”

四张 Desk 应从人物站位点升级为玩家身份资产。

不做自由摆放系统。

采用固定 Anchor Slot：

```text
Desk
├─ Plant Slot
├─ Mug Slot
├─ Photo Slot
├─ Toy Slot
├─ Lamp Slot
└─ Rare Slot
```

早期开放少量 Slot，Player Level / Desk progression 后逐步增加。

重要：

> Desk progression 必须可见，而不仅是数字。

## 5.4 Central Project

回答：

> “我们四个人一起在做什么？”

这是未来最重要的团队主线。

详见下一节。

---

# 6. Central Project / Project Atlas

状态：`PROPOSED — PRIMARY MAINLINE`

工作名：`Project Atlas`

最终命名仍为 `OPEN`。

## 6.1 核心概念

四张桌子中央存在一个由四个人长期共同建造的工程。

它不是简单进度条。

它必须真实地在 Office Scene 中逐阶段成长。

它相当于 Four Workstations 的“巨大多人作物”：

```text
Blueprint
↓
Foundation
↓
Assembly
↓
Activation
↓
Breakthrough
↓
World Unlock
```

玩家每隔几天回来都应该能直接从场景中看出：

> “它又变了。”

## 6.2 世界观方向

不应一开始就明确告诉玩家它是传送门。

推荐感觉：

> 四个人在办公室里慢慢拼出一台用途未知的奇怪机器。

随着推进：

- 结构越来越完整
- 出现线路 / 核心
- 开始通电
- 出现缓慢机械运动
- 收到未知信号
- 出现微缩地图 / 区域投影
- 最终建立 Connection

## 6.3 Atlas Scene Placement

关键限制：

- 位于四张 Desk 中央区域
- 不能破坏冻结 Camera
- 不能挡 Character routes
- 不能大规模改变 workstation geometry
- 不能成为巨型横向障碍物

设计原则：

> 小占地，向上成长。

Phase 越高，主要通过高度、轮廓、悬浮结构和轻运动体现成长，而不是横向不断膨胀。

## 6.4 四人视觉结构

Atlas 建议具有四向 Personal Module Socket：

```text
              Hong
               ↓
          [ Module ]
               ║
     Jie → [ ATLAS ] ← Ming
               ║
          [ Module ]
               ↑
              Qixi
```

四个人第一次为当前 Phase 做有效贡献后，对应模块被点亮或装配。

## 6.5 协作规则

必须避免“四个人缺一不可导致整个游戏卡死”。

建议拆成两套条件：

### Build Progress

任何玩家都能推进。

达到 100% 后核心 Phase 可以完成。

### Personal Modules

当前 Phase 四个人分别第一次贡献后激活个人 Module。

`4/4` 时触发额外：`Harmony Activation`。

Harmony Reward 可包括：

- 特殊视觉效果
- 特殊 Atlas cosmetic
- 稀有 collectible
- Memory Wall 纪念
- 独有装饰

但不得把核心地图永久锁在 `4/4` 后面。

## 6.6 Build Charge

Atlas 不使用 Coins 直接购买核心进度。

建议加入独立行为资源：`Build Charge`。

性质：

- 不是 Shop currency
- 不可交易
- 不可购买
- 来自真正 gameplay
- 有每日获取上限
- 可以少量储存

初始候选规则：

- 有效 Focus → Build Charge
- 较长 Focus → 略多
- 每人每日上限约 2
- 储存上限约 6

最终数值：`OPEN / BALANCE LATER`

## 6.7 Atlas Phase Draft

### Phase 0 — Blueprint

场景：工具箱、纸张、散落零件。

情绪：

> “我们准备造什么？”

### Phase 1 — Foundation

出现基础结构与四个个人 Module Socket。

候选解锁：Personal Desk progression。

### Phase 2 — Power Core

机器第一次真正通电。

首次出现克制的稳定运动或 emissive。

候选解锁：Office Garden。

### Phase 3 — Signal

机器开始接收到未知信息。

候选解锁：

- Project Shelf
- Collectible / discovery
- Weekly discovery event

### Phase 4 — Atlas

完整主结构形成。

机器上方首次出现新区域的微缩模型 / 投影。

候选目标：Rooftop Garden。

### Phase 5 — Connection

连接稳定。

解锁第一张新区域：`Rooftop Garden`。

Phase 具体数量、模型结构和奖励均需通过后续 Concept Gate。

---

# 7. Atlas Visual & Asset Direction

状态：`PROPOSED`

## 7.1 风格

工作方向：

> Retro-Futuristic Office Prototype

但必须保持现有 Office 的世界语言。

推荐材质：

- Warm metal
- Wood
- Off-white plastic
- Brass
- Glass
- Restrained emissive
- Visible but tidy cables

避免：

- Cyberpunk neon
- 大面积蓝紫光
- 巨型 hologram
- Sci-fi movie portal
- 高写实 PBR 工业设备

目标感觉：

> 四个年轻人真的可能在这个办公室里自己拼出来的奇怪原型机。

## 7.2 建模策略

优先阶段模型，不做复杂程序化 Assembly。

推荐：

```text
Atlas_Phase0
Atlas_Phase1
Atlas_Phase2
Atlas_Phase3
Atlas_Phase4
Atlas_Phase5
```

可以是多个 GLB，也可以是一个 GLB 中的多个 Phase Group。

Runtime 主要通过 mesh visibility / phase switch 驱动。

## 7.3 动画策略

优先级：

1. Static phase swap
2. Transform animation
3. Simple loop
4. Skeletal / Physics（尽量避免）

允许：

- scale punch
- ring slow rotation
- small floating part
- restrained emissive pulse
- very small particles
- short activation sound

避免：

- skeleton rig
- complex physics
- procedural assembly
- 大量粒子
- 新的大型 renderer pass

---

# 8. 场景玩法审查框架

状态：`LOCKED — PROCESS RULE`

以后所有新增场景玩法必须同时评估以下维度：

| 维度 | 必须回答的问题 |
|---|---|
| Gameplay Effect | 玩家为什么在乎？是否真的增强循环？ |
| Visual Readability | Frozen camera 下能否一眼看出变化？ |
| Style Fit | 是否像原办公室本来就应该存在？ |
| Modeling Cost | Blender / UV / Material / Export 成本多高？ |
| Animation Cost | Static swap / transform / loop / rig 哪一级？ |
| Scene Harmony | 会不会抢视觉中心或像硬塞的 DLC？ |
| Placement Accuracy | 是否挡人、穿模、挡镜头、破坏路径？ |
| Runtime Risk | 是否会重新碰 Frozen Camera / Character / Lighting？ |
| Content Debt | 后续是否需要不断制作大量新模型？ |

## 8.1 新场景玩法工作流

```text
GAMEPLAY IDEA
↓
SCENE DESIGN
↓
PLACEMENT MOCKUP
↓
VISUAL GATE
↓
ASSET BUILD
↓
RUNTIME
↓
GAMEPLAY INTEGRATION
```

重要：

> Placement Mockup 必须先于高精度正式建模。

---

# 9. Anchor-based Scene Authoring

状态：`PROPOSED — STRONGLY RECOMMENDED`

新增 Desk / Wall / Garden / Shelf 内容尽量通过 Blender Authoring Anchor 定位，不在 Runtime 中长期依赖肉眼硬调坐标。

建议未来 Scene 层增加类似：

```text
Office
├─ AtlasAnchor
├─ GardenAnchor
├─ MemoryWallAnchor
├─ ProjectShelfAnchor
│
├─ Desk1
│   ├─ PlantAnchor
│   ├─ MugAnchor
│   ├─ PhotoAnchor
│   └─ GiftAnchor
├─ Desk2
├─ Desk3
└─ Desk4
```

职责分离：

### Blender / Scene Authoring

负责：

- Position
- Rotation
- Scale
- Clearance
- Visual composition

### Runtime

负责：

- 当前显示哪一个 item
- 当前 growth stage
- owner / state / unlock

目标：减少后续穿模和人工坐标 Gate。

---

# 10. Exaggerated Readability

状态：`PROPOSED — VISUAL RULE`

Four Workstations 使用固定俯视 / 微缩建筑模型视角。

真实世界比例不应机械照搬。

小物件允许略夸张，以保证 Frozen Camera 下可读：

- Mug 略大
- Plant leaves 略大
- Photo / sticky note 略大
- Steam 略粗
- Collectible 轮廓略明显

目标不是卡通化，而是：

> 为固定 camera 服务。

---

# 11. Office Garden

状态：`PROPOSED — SECONDARY PROGRESSION`

Garden 不再承担整个产品主线，而是 Atlas 解锁后的长期副玩法。

## 11.1 Office 内的形式

不在 Office 里硬塞农田。

推荐：

- Window planter
- Indoor plant shelf
- Low shared planter
- Small hydroponic shelf

要求：

- 像真实办公室原本就应该存在
- Frozen camera 明显可见
- 不挡 Character path
- 成长阶段差异明确

## 11.2 Growth Strategy

优先使用阶段模型：

```text
Stage 0 — Empty / Seed
Stage 1 — Sprout
Stage 2 — Small Plant
Stage 3 — Large Plant
Stage 4 — Mature / Bloom
```

不需要真实植物生长动画。

升级瞬间可增加：

- very short scale animation
- small leaf effect
- subtle sound

## 11.3 核心心理

```text
投入
↓
等待
↓
回来
↓
看到变化
↓
完成 / 收获
↓
世界永久变化
```

## 11.4 不惩罚缺席

植物不因用户不上线死亡。

规则：

> 不来就暂停成长，而不是倒退。

---

# 12. Rooftop Garden

状态：`PROPOSED — FIRST NEW AREA`

第一张新区域优先考虑 Rooftop Garden，而不是第二个办公室。

定位：

- Office = Home / Work Base
- Rooftop = Relax / Farming / Shared Activity

Rooftop 初期不需要大量玩法。

第一版只需要有一个成立的核心：

> 真正的 Shared Garden。

未来可扩展：

- Planters
- Small greenhouse
- Weather
- Night stars
- Shared seating
- Rare plants
- Seasonal events

限制：

- 不把游戏迅速扩展成 RPG 副本
- 不做战斗
- 不因为“有 Atlas”就无限堆地图

---

# 13. Project Shelf

状态：`PROPOSED`

一个与种田类似但主题更适配办公室的 Craft / Build progression。

例子：

- Mini Rocket
- Small Robot
- Model Car
- Radio
- Telescope
- Mini Game Console

成长表现：

```text
Parts
↓
Base
↓
Body
↓
Details
↓
Finished Display Item
```

最终完成品永久留在办公室。

优势：

- low-poly 适配好
- 动画成本低
- 场景反馈明显

风险：

> 长期内容生产成本较高，每个新 Project 都需要新模型。

---

# 14. Memory Wall / Office Postcard

状态：`PROPOSED — HIGH VALUE / LOW RISK`

## 14.1 Memory Wall

把长期使用留下的纪念实体化到一面公共墙。

内容候选：

- Polaroid
- Sticky notes
- Badges
- Project milestones
- First Full House
- Special Coffee moments
- Atlas phase memories
- Weekly postcards

它不是普通 Activity Feed 的替代，而是长期情感存档。

## 14.2 Daily Office Postcard

未来可自动生成每日摘要：

```text
August 24 — Office Postcard

4/4 members visited today
09:42 Ming started Focus
11:17 Hong sent Jie a coffee
12:31 Everyone was in the office
18:23 Jie left work

[Office snapshot]
```

未来甚至可尝试短 time-lapse。

目标：

- Return loop
- Memory
- Sharing
- Emotional attachment

---

# 15. Player Economy

状态：`PROPOSED — NEEDS BALANCING`

## 15.1 XP Sources

XP 应奖励真正参与世界的行为，而不是应用开着多久。

候选：

- Daily Presence Check-In
- Valid 25 min Focus
- Valid 50 min Focus
- Atlas contribution
- First meaningful social interactions of the day
- Growth / collection completion
- Atlas milestone
- World discovery

避免：

- 浏览器挂机刷 XP
- 无限 Poke 刷 XP

## 15.2 Coins Sources

Coins 主要来源候选：

- Focus
- Daily Presence small reward
- first few meaningful social actions
- collection completion
- weekly events
- Atlas milestones

## 15.3 Soft Daily Earning Curve

为了避免经济被长时间挂机打穿：

候选：

```text
First Focuses  → 100% Coin reward
Later Focuses  → diminishing Coin reward
XP may continue, Coin income slows
```

暂定正常玩家日收入目标：`80–150 Coins`。

最终数值：`OPEN / BALANCE LATER`。

## 15.4 Price Bands Draft

| Item | Draft Cost |
|---|---:|
| Small mug / prop | 80–150 |
| Common plant | 150–300 |
| Detailed desk decoration | 300–500 |
| Rare collectible | 600–900 |
| Large personal item | 1000–1500 |

价格目标不是固定数字，而是控制时间感：

- 普通物品：约 1–3 天可获得
- 稀有物品：形成数天到数周目标

## 15.5 Currency Sinks

长期 Coin sink：

- Personal Desk
- Shop Collection
- Social Gifts
- Cosmetics
- Future Plant / Garden content

不建议：

- 买生产力倍率
- 买 Atlas 核心进度

---

# 16. Catch-Up 与四人进度差异

状态：`PROPOSED`

个人 Level 可以有差距，但共同玩法不能因为某一人不活跃永久卡死。

建议：

### World Unlock

由 Office / Atlas progression 决定，不由最低 Player Level 决定。

### Catch-Up

明显低于办公室中位等级的玩家可获得临时：

> Rested Inspiration

例如 XP boost，直到接近 Office median。

UI 不强调“落后”，而强调“灵感充沛”。

原则：

- 不强制追平
- 不羞辱低活跃玩家
- 不让老玩家的投入失去意义

---

# 17. Specialization

状态：`OPEN / FUTURE`

未来 Player Level 到一定阶段可以选择非锁定型倾向：

- Builder
- Grower
- Collector
- Social

要求：

- 所有人仍能参加所有玩法
- specialization 提供风格和额外结果，不成为硬职业门槛
- 可以未来调整 / 更换

明确避免：

> 没有 Builder 就不能建 Atlas。

---

# 18. World Reactivity

状态：`PROPOSED — IMPORTANT VISUAL UPGRADE`

画面未来最需要的不是更写实，而是更“活”。

优先考虑低成本、高反馈的环境变化：

- Coffee steam
- Monitor activity
- Meeting screen on/off
- Desk lights / work state
- Plants subtle movement
- Door / arrival moment
- Window weather
- Night ambience
- Coffee machine sound
- Physical gifted items

目标：

> 玩家不读标签，也能通过办公室看出今天发生了什么。

---

# 19. Soundscape

状态：`PROPOSED`

声音可能比继续提高模型精度更有产品价值。

方向：

- restrained keyboard ambience
- HVAC / room tone
- coffee machine event sound
- rain outside window
- door arrival
- night quieter ambience
- mug placement
- subtle Atlas mechanical sound

原则：

> 即使用户不盯着窗口，也能感觉朋友和办公室还在那里。

避免长时间吵闹、强提醒和游戏厅式音效。

---

# 20. Desktop Office Mode

状态：`PROPOSED — LONG-TERM DIFFERENTIATOR`

高潜力方向：把当前完整微缩 Office 变成桌面陪伴窗口，而不是要求用户专门进入全屏产品。

理想体验：

```text
用户继续使用 VS Code / Word / Chrome
↓
Four Workstations 作为小型 Office 窗口存在
↓
朋友上线 / 去 Coffee / 送礼 / Atlas 变化
↓
用户偶尔查看或点击
↓
Focus Session 继续现实工作
```

它可能成为 Four Workstations 与普通虚拟办公室、Focus App 和 Discord Presence 的重要差异点。

但这是长期方向，不应在核心玩法还未成立前优先工程化。

---

# 21. 未来新地图原则

状态：`LOCKED — DESIGN RULE`

新增地图必须由玩法需求驱动，而不是为了增加地图数量。

新地图应该继续服务：

- Cozy
- Social
- Life
- Building
- Collection
- Shared progression

暂时避免：

- Combat
- RPG dungeon
- 大量副本
- 复杂角色控制游戏

Office 永远保持 Home Base 地位。

---

# 22. 明确不做 / 暂缓

## DEPRIORITIZED

- 增加更多一级 Presence 状态
- 第二个普通办公室场景
- 大规模自由装修
- 大规模家具自由摆放
- 宠物 AI / 猫咪路径系统
- Aquarium 作为首发 Shared Living Object
- 大量 Character animations
- 完整 Chat / Slack 替代品
- Productivity leaderboard
- Team KPI
- Streak punishment
- 多货币经济
- Combat / RPG progression
- 复杂任务管理 / Calendar 产品化

## REJECTED / CLOSED

- 重新开启 Seated Character
- 为新玩法重做 VQ-1C Camera / Lighting / Character visual system

---

# 23. 推荐开发顺序

状态：`PROPOSED ROADMAP`

## Stage A — Presence Foundation

目标：先让今天的状态可信。

- Presence freshness
- Daily Check-In
- stale state handling
- correct active-online count

## Stage B — Core Game Skeleton

- Player Level
- XP
- Coins
- minimal Shop
- basic Personal Desk slots

## Stage C — Atlas Prototype

先做 Scene / Gameplay Concept Gate，再做灰模。

顺序：

```text
Concept
→ Placement Mockup
→ Visual Gate
→ Phase 0/1 Graybox
→ Runtime phase switch
→ First contribution loop
```

## Stage D — World Reactivity

- physical Coffee feedback
- simple monitor / meeting / environment response
- restrained soundscape

## Stage E — Office Garden

- one plant prototype
- 5 growth stages
- shared growth logic

## Stage F — Memory / Collection

- Memory Wall
- Daily / Weekly Office Postcard
- Project Shelf prototype

## Stage G — Atlas Completion / First Area

- final Atlas Phases
- Rooftop Garden unlock
- Shared Garden

## Stage H — Desktop Office Mode

核心游戏循环验证成功后再进入。

---

# 24. Atlas Concept Gate — 下一步应研究的问题

状态：`NEXT DESIGN GATE CANDIDATE`

在任何正式 Atlas 建模前，必须回答：

1. 四张 Desk 中央实际可用空间是多少？
2. frozen camera 下最佳最大高度是多少？
3. Atlas 各 Phase 的 silhouette 怎么变化？
4. 是否会遮挡任何 Character / name label？
5. 是否影响现有 waypoint / clearance？
6. 四个 Personal Module 如何朝向四个 Desk？
7. Day / Night 下是否都可读？
8. 是否需要新增 light，还是 emissive 即可？
9. Phase 0–5 每阶段建模工时预计多少？
10. 哪些动画可用 transform 完成？
11. 是否需要单独 lightmap？
12. Atlas 最终显示 Rooftop 时采用实体 miniature 还是 restrained projection？
13. Atlas 在当前 Office 里是否像“本来就属于这里”？

正式资产制作前必须先通过 placement mockup。

---

# 25. Open Questions

以下问题尚未锁定：

- Project Atlas 最终名称
- Coins 最终名称
- Build Charge 最终名称
- Player Level 具体 XP 曲线
- Coin 每日软上限数值
- Shop refresh 机制
- Atlas 每 Phase 所需进度
- Atlas 是否有现实日时间门槛
- Harmony Activation 奖励
- 第一张新地图最终是否一定为 Rooftop Garden
- Garden 的植物首发数量
- Memory Wall 是否进入第一版
- Desktop Mode 的技术形式（Web / Tauri / Electron / native wrapper）
- Specialization 是否真正需要
- Atlas 与世界观故事的解释程度

---

# 26. 设计原则总结

Four Workstations 后续设计应优先满足：

1. **现实行为驱动游戏，而不是游戏制造第二份工作。**
2. **世界变化优先于纯数字变化。**
3. **个人、我的空间、我们的工程、我们的世界四层成长同时成立。**
4. **协作有奖励，但不因为某个朋友缺席而惩罚其他人。**
5. **缺席不惩罚；植物不死、工程不倒退、streak 不绑架。**
6. **不做生产力竞争。**
7. **商店提供选择和身份，不出售核心世界进度。**
8. **Office 永远是 Home Base。**
9. **所有新场景玩法必须先解决 placement、readability 和 style fit。**
10. **低成本世界反馈优先于复杂动画和视觉技术。**
11. **固定 camera 下的可读性比现实比例更重要。**
12. **长期目标是让玩家感觉：这个世界是我们四个人一起生活出来的。**

---

# 27. Decision Log

## 2026-08-24 — VQ-2 Product Direction

新增并统一以下方向：

- Four Workstations 从“虚拟办公室工具”逐渐转向“现实行为驱动的四人共享微缩世界”。
- Player Level、Coins + Shop、Personal Desk、Central Project 成为四条核心 progression。
- Central Project 暂定工作名 `Project Atlas`，定位为主线共同工程。
- Office Garden 从核心主线下调为 Atlas 解锁后的长期副玩法。
- Rooftop Garden 暂定为第一张新区域候选。
- 新场景资产必须先通过 Scene Design / Placement Mockup / Visual Gate。
- 强调 Anchor-based authoring，减少 runtime 手调位置。
- 世界成长和空间变化优先于复杂数值系统。
- Desktop Office Mode 作为长期高潜力差异化方向保留。

---

# 28. 更新模板

后续每次重大讨论完成后，可在相应章节更新，并追加：

```md
## YYYY-MM-DD — <Decision Name>

Status:

- LOCKED / PROPOSED / EXPERIMENTAL / OPEN / DEPRIORITIZED / REJECTED

Decision:

- ...

Why:

- ...

Impact:

- Gameplay:
- Scene:
- Art:
- Runtime:
- Economy:

Next Gate:

- ...
```

这样后续设计可以持续增长，而不依赖任何单次聊天上下文。
