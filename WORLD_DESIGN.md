# 世界设计 · World Design

## 场景总览

```
┌─────────────────────────────────────────────────────┐
│                     窗户（北墙）                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐  │
│  │  desk_1  │  │  desk_2  │  │     会议区          │  │
│  │  (小明)  │  │  (小红)  │  │   圆桌 + 4 椅       │  │
│  └─────────┘  └─────────┘  │   + 白板            │  │
│                              └─────────────────────┘  │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐ ┌────────┐  │
│  │  desk_3  │  │  desk_4  │  │  餐区    │ │ 咖啡角 │  │
│  │  (阿杰)  │  │  (七喜)  │  │ 餐桌+4座 │ │吧台+机 │  │
│  └─────────┘  └─────────┘  └──────────┘ └────────┘  │
│                              ┌──────────┐ ┌────────┐  │
│  入口                       │  休息区   │ │ 肠粉区 │  │
│  (南墙)                      │ 沙发+矮桌│ │窝+抓柱 │  │
│                              └──────────┘ └────────┘  │
└─────────────────────────────────────────────────────┘
```

## 当前场景：共享办公室（V1）

**sceneKey**: `shared_office`

| 属性 | 值 |
|------|-----|
| 尺寸 | 约 12m × 8m × 3.5m |
| 容量 | 4 人 + 肠粉 |
| 入口 | 南墙居中偏左 |
| 窗户 | 北墙整面（自然光主光源）|

### 区域与状态映射

| Status Key | 对应区域 | 3D 目标坐标 |
|------------|----------|-------------|
| clockedIn | 入口 → desk_* | entrance → workstation |
| working | desk_* | workstation |
| studying | desk_* | workstation |
| busy | desk_* | workstation |
| meeting | 会议区 | meeting_table |
| eating | 餐区 | dining_table |
| coffee | 咖啡角 | coffee_bar |
| resting | 休息区 | sofa |
| napping | 休息区 | sofa |
| restroom | 隐藏（淡出） | — |
| slacking | desk_* | workstation |
| outside | 隐藏（淡出） | — |
| offWork | 隐藏 | — |
| overtime | desk_*（夜间模式） | workstation |

### Waypoints

```
entrance → (aisle_w) → desk_1
entrance → (aisle_w) → desk_2
entrance → (aisle_s) → (aisle_e) → desk_3
entrance → (aisle_s) → (aisle_e) → desk_4
any_desk → (aisle_center) → meeting_table
any_desk → (aisle_center) → dining_table
any_desk → (aisle_center) → coffee_bar
any_desk → (aisle_center) → sofa
sofa → changfen_zone
```

### Interactables

| 对象 | 类型 | 触发 |
|------|------|------|
| 个人电脑 | object/computer | 打开自己的状态面板 |
| 咖啡机 | object/coffee | 切换至 coffee 状态 |
| 餐桌 | object/dining | 切换至 eating 状态 |
| 会议桌 | object/meeting | 切换至 meeting 状态 |
| 沙发 | object/sofa | 切换至 resting/napping |
| 厕所门 | object/restroom | 切换至 restroom |
| 入口 | object/entrance | 切换至 outside/offWork |
| 肠粉 | character/changfen | 互动（摸、喂、逗）|

## 多场景架构

### SceneManager 规划

```
SceneManager
├── registry: Map<SceneKey, SceneConfig>
├── currentScene: SceneKey
├── transition(state: SceneTransitionState)
└── preload(sceneKey: SceneKey): Promise<void>

SceneConfig {
  sceneKey: SceneKey;
  name: string;
  glbPath?: string;               // GLB model for static geometry
  cameraPresets: CameraPreset[];  // named camera positions
  lightingPresets: LightingPreset[]; // day/night light configs
  spawnPoints: SpawnPoint[];      // where characters enter
  waypoints: Waypoint[];          // navigation graph
  interactables: Interactable[];  // clickable objects
  environment: EnvironmentConfig; // skybox, ambient, fog
  audioPresets?: AudioPreset[];   // ambient sound configs
  requiredUnlock?: UnlockCondition; // gate condition
}
```

### Camera Presets

Phase 1 默认主镜头为正交投影 + 固定轴测方位。45–55° FOV 透视镜头仅作为未来"玩具摄影近景"的实验方案，不属于 Phase 1A 默认全景。

桌面全景通过房间包围盒、视口 aspect 和正交相机 frustum 计算 fit bounds，不写死单一 zoom。手机使用独立区域包围盒和独立镜头状态，不直接复用桌面 zoom。

| 预设名称 | 场景 | 投影 | 位置 | 目标 |
|----------|------|------|------|------|
| office_panorama | shared_office | 正交 | (0, 6, -5) | (0, 1, 2)；frustum 由房间包围盒 + 视口 aspect 计算 |
| desk_1_closeup | shared_office | 正交 | desk_1 + (0, 1.2, 2) | desk_1 center |
| desk_2_closeup | shared_office | 正交 | desk_2 + (0, 1.2, 2) | desk_2 center |
| desk_3_closeup | shared_office | 正交 | desk_3 + (0, 1.2, 2) | desk_3 center |
| desk_4_closeup | shared_office | 正交 | desk_4 + (0, 1.2, 2) | desk_4 center |
| changfen_zone | shared_office | 正交 | (5, 1.5, 3) | 肠粉窝 |
| meeting_closeup | shared_office | 正交 | 会议桌 + (0, 1.5, 3) | 会议桌中心 |
| mobile_overview | shared_office | 正交 | (0, 8, -2) | (0, 1, 2)；使用房间包围盒独立计算 |
| mobile_zone_* | shared_office | 正交 | 各区域独立包围盒 | 各区域中心 |

### Lighting Presets

| 预设 | 适用 | Ambient | Key Light | Fill Light | Rim Light |
|------|------|---------|-----------|------------|-----------|
| day_warm | 日间 | #fff8ee 0.4 | #fff5e6 1.0 | #d4c8b0 0.3 | #ffffff 0.15 |
| night_cozy | 夜间 | #1a2030 0.15 | #ffd4a0 0.5 | #2a3040 0.2 | #ffc080 0.2 |
| changfen_spot | 肠粉区 | #f0e8d8 0.3 | #ffe8c0 0.8 | #c8b898 0.2 | — |

### Spawn Points

| 点位 | 场景 | 坐标 | 朝向 |
|------|------|------|------|
| entrance | shared_office | (0, 0, 4) | (0, 0, -1) |
| desk_1 | shared_office | (-4, 0, 3) | (0, 0, -1) |
| desk_2 | shared_office | (0, 0, 3) | (0, 0, -1) |
| desk_3 | shared_office | (-4, 0, -1) | (0, 0, -1) |
| desk_4 | shared_office | (0, 0, -1) | (0, 0, -1) |

### Environment

| 属性 | 日间 | 夜间 |
|------|------|------|
| Skybox | Warm overcast softbox | Deep navy with warm window glow |
| Ambient color | #f5f0e8 | #1a2230 |
| Fog | None | Soft warm fog near floor |
| Background | CSS `--wall` | `.theme-night` `--wall` |

## 未来扩展场景

| 场景 | sceneKey | 解锁条件 | 优先级 |
|------|----------|----------|--------|
| 棋牌室 | card_room | 公共基金达到阈值 | Phase 2 |
| 咖啡休息室 | coffee_lounge | 棋牌室解锁后 | Phase 2 |
| 天台花园 | rooftop_garden | 公共基金 + 4 人投票 | Phase 3 |
| 肠粉小屋 | changfen_house | 肠粉好感度 | Phase 3 |
| 个人房间 | private_room_* | 个人工票 | Phase 4 |

## 场景切换流程

```
1. 用户触发切换（点击场景入口 / UI 按钮）
2. 淡出当前场景（500ms opacity 0）
3. 卸载当前 3D 场景资源
4. 加载目标场景（显示 loading spinner / skeleton room）
5. 淡入目标场景（500ms opacity 1）
6. 角色在目标 spawn point 出现
7. 肠粉随机决定是否跟随（概率 30%）
```

## HUD 结构

### 桌面（游戏 HUD）

桌面端采用游戏化 HUD，不保留永久右侧 ActivityFeed。3D 场景占主要面积。

```
┌─────────────────────────────────────────────────────┐
│  顶部轻量状态栏（日期、在线人数、夜间切换）            │  ← 48px
├─────────────────────────────────────────────────────┤
│                                                     │
│                 3D 办公室场景                        │  ← 主区域（占主要面积）
│                 (WebGL Canvas)                      │
│                                                     │
│         点击人物 → 空间内互动菜单                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [状态 Dock]  [上班][工作][吃饭][摸鱼][下班][…]       │  ← 底部 Dock
│  [办公室日记 ▸]  ← 可展开的 ActivityFeed             │
└─────────────────────────────────────────────────────┘
```

- ActivityFeed 变为"办公室日记"，默认折叠，点击展开
- 点击人物显示空间内互动菜单（非侧边栏）

### 手机（独立镜头结构）

手机需要独立的镜头结构，不得与桌面共用同一 zoom 值。

```
┌──────────────┐
│ [Logo] [😺]  │  ← 顶部栏 64px
├──────────────┤
│              │
│  3D 办公室   │  ← 区域镜头为默认（我的工位邻域）
│  区域场景   │  ← 点击底部区域快捷条跳切
│              │
├──────────────┤
│ [办公室日记] │  ← 半屏 bottom sheet
├──────────────┤
│ [区域快捷条] │  ← 工位/餐区/沙发/猫区
│ [状态 Dock]  │  ← 固定底部
└──────────────┘
```

- 远处标签坍缩成 accent 色圆点，近景才展开名字卡
- 人物近景（点角色时）拉到 45° 眼高镜头

## 分阶段开发路线

### Phase 0：基线整理 ✅

- 美术总纲、世界设计、经济设计、资产规范
- Skills 体系完整
- 代码基线干净
- Kimi K3 视觉审计报告归档
- 验收流程正式确立（固定截图、灰度测试、缩略图测试）

### Phase 1A-1：办公室空间 Blockout 与 Waypoint 调整

所有后续工作的地基。禁止用堆道具掩盖构图问题。

**空间重构**：
- 四个工位沿左右列队面朝中央走道（至少 3/4 可见脸或侧脸）
- 中央走道升级为社交舞台（行走、互动、戳一戳的发生地）
- 会议区移至中景右侧，配地毯；白板转向或挂内容
- 餐饮区保持靠窗明亮位置
- 摸鱼区（休息区/沙发）
- 咖啡角作为后墙锚点
- 肠粉区放在右前前景（沙发旁 + 阳光斑 + 猫窝）
- 出入口（南墙）
- 每个区域三件套：地面色块 + 英雄道具 + 垂直元素
- 地板基座/踢脚线（模型盒的"底盘"）
- 墙体布景化（护墙板腰线、挂画、窗的位置与主光一致）
- 前景保留约 20% 呼吸地板
- Waypoint 图随空间重排同步调整

**验收标准**：区域识别（200px 缩略图 3 秒指出 ≥5/6 区）、人物可读（4/4 姿态可辨、≥3/4 可见脸或侧影）

### Phase 1A-2：桌面全景与手机区域镜头系统

**桌面全景镜头**：
- 正交投影 + 固定轴测方位（方位角 30–35°、俯角 30–32°）
- 通过房间包围盒 + 视口 aspect + 正交 frustum 计算 fit bounds
- 不写死单一 zoom，不使用仅基于 viewport width 的公式
- 房间占画面 70–88%，单边死边 ≤12%
- 缩放范围锁 0.8–1.6×，旋转禁用

**手机区域镜头**：
- 使用独立区域包围盒和独立镜头状态，不直接复用桌面 zoom
- 默认落在"我的工位"邻域，点击底部区域快捷条在区域间平滑跳切
- 全览为俯冲镜头 fit-width（允许上下留边）

**验收标准**：取景（房间占 70–88%）、手机区域镜头内当前用户人物完整入画且无屏幕边缘裁切

### Phase 1A-3：网页面板收缩为游戏 HUD

**桌面游戏 HUD**：
- 顶部轻量状态栏（日期、在线人数、夜间切换）
- 底部状态 Dock
- ActivityFeed → 可展开的办公室日记（默认折叠，点击展开）
- 点击人物 → 空间内互动菜单（非侧边栏）
- 3D 场景占主要面积，HUD 信息密度极低

**手机 HUD**：
- 底部 Dock 保持在拇指区
- 办公室日记做成半屏 bottom sheet
- 远处标签坍缩成 accent 色圆点，近景才展开名字卡

**验收标准**：3D 场景占主要面积、HUD 不遮挡关键区域、标签可读（≥10px 等效字号、零重叠）

### Phase 1B：光影与材质

把"技术演示"变成"被认真拍摄的模型"。

**灯光系统**：
- 三点布光：窗光 key（4500–5000K，与墙上窗位置一致）/ 半球 fill / rim 轮廓光
- 夜间照明：台灯池（3000K、可见衰减）+ 深灰蓝 ambient（不是纯黑）
- 光的来历必须可信（每处亮部能回答"光从哪来"）

**阴影与轮廓**：
- ContactShadows 升级（分辨率、blur、不透明度经截图验证后确认）
- 桌面独立 AO（显示器/台灯/杯子下的小椭圆影）
- 坐姿人物影子落到椅子和自己腿上
- 首选 rim light 做轮廓分离；不够时对人物+猫加反向壳描边

**材质体系**：
- 全家 roughness 0.85–1.0 哑光
- metalness 只留给门把手级黄铜点缀
- 所有可见棱边加 2–4% 圆角/倒角
- 顶点色做同色系微差，禁止噪声贴图
- 显示器抬炭灰 + 屏幕自发光
- 白板去极端白

**区域视觉签名**：
- 每区一个主导道具色，其余退到木色/软白/浅灰
- 60/25/10/5 色彩纪律

**夜间 UI 修复**：
- 修复 `.activity-feed` 硬编码白色（`globals.css:1644`）
- 所有面板通过 `var(--panel)` 变暗

**验收标准**：灰度层级（人物与相邻背景明度差 ≥15%）、夜间面板一致性、帧率不跌破 60/30 FPS

> **注意**：灯光、阴影、明度及分辨率的具体数值为初始建议，须经截图和性能验证后确认，不得机械写死。

### Phase 1C：肠粉视觉 MVP 与猫区

本阶段为本地视觉 MVP，不涉及 Realtime 同步。

**不创建肠粉数据库表、不同步连续坐标、不实现服务端调度、不实现多客户端权威选举。**

**程序化 Blockout**：
- 蓝灰绒毛哑光（约 #8b95a0 区间、全场唯一冷色域）
- 圆脸厚腮（脸宽 ≈ 体宽 0.75）
- 小圆耳、金眼 #caa04a 带 catchlight
- 敦实躯干、短粗四肢、粗尾
- 默认冷脸 = 重眼睑半阖

**猫区**：
- 沙发旁阳光斑
- 猫窝 + 食盆 + 抓柱
- 蓝灰区域签名

**基础动作**：
- 睡姿 70%（蜷团 / 摊饼两种）
- 慢速巡视 15%
- 其他行为（吃饭、玩玩具、踩键盘）后续迭代

**明确标注**：
- 程序化肠粉为视觉 MVP 和 blockout，不得声明为最终模型
- 最终版本需要定制 GLB 和 Blender 制作流程
- 本阶段目标是验证比例、色彩和动画系统

**多人共享肠粉（后续阶段）**：
- 肠粉作为办公室共享角色，不是某个用户的宠物
- 未来多人共享阶段可考虑同步：`{behavior, target, startedAt, version}`
- 具体服务端调度方式（每 2–5 秒 tick / 事件驱动 / 客户端预测+服务端校验）在正式设计该阶段时再决定

**验收标准**：200px 缩略图中猫剪影可被认出是猫、金眼可读、毛色与地板明度差 ≥12%

### Phase 2：棋牌室 + 咖啡休息室

- 新增 2 个 GLB 场景
- SceneManager + 场景切换
- 公共基金系统
- 简单商店 + 工票
- 棋牌室解锁条件（公共基金 ≥20 + ≥2 人投票）

### Phase 3：天台 + 肠粉小屋

- 外部场景（天空、植物）
- 肠粉完整 AI 行为
- 家具摆放系统

### Phase 4：个人房间

- 4 个独立房间
- 个人收藏展示
- 访客模式
