# VQ2 ACTIVE PROJECT HANDOFF — 2026-09-03

> 用途：这是给新 ChatGPT 对话直接接管当前 VQ2 / Four Workstations 项目的总接力文档。
> 
> 规则：最新用户明确决定 + 最新 Human Visual / Feel PASS/FAIL > 本 handoff > 其他 project-memory > 旧 roadmap / 旧设计文档。
> 
> 重要：远端 GitHub `main` 历史上可能落后于本地 Unity 状态。本文同时记录用户/Codex 已报告但未必已 commit/push 的本地事实。不要把“本地已完成”误说成“远端已存在”。

---

# 0. 项目与路径

- GitHub repo：`barbaralazarev08182-lab/four-workstations`
- 本地 Unity 项目：`E:\Projects\four-workstations-unity\unity\FourWorkstations`
- 本地 source assets：`E:\Projects\four-workstations-unity\assets-source\...`
- 当前游戏方向：VQ2
- Unity：项目当前为 URP；历史开发环境使用 Unity（具体版本以本地 ProjectSettings 为准，不要猜）
- 当前主要 candidate：
  - `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`
- production：`Office.unity` 等正式场景不要在未获用户允许时覆盖。

---

# 1. 与用户协作方式 — 高优先级

## 1.1 输出风格

用户主要用中文。

用户要的是直接、可执行、短而准确的协作。尤其是 Codex 指令：

- 简单任务就给简单 prompt；
- 不要为了一个小动作写几百行 Gate / checklist；
- 只有复杂系统任务才写详细执行单；
- 不要在末尾机械地问“还要不要另一个 prompt”。

## 1.2 项目记忆规则

只要用户做出新的重要决定，应该自动同步 project-memory Markdown，尤其是：

- 新世界观 / 剧情规则；
- Human Visual / Feel PASS 或 FAIL；
- 新的 authoritative baseline；
- 放弃 / 否决的路线；
- 新技术边界；
- 新资产 authoring boundary；
- 大的房间布局 / 玩法变化。

不要让 `.md` 长时间落后于实际决定。

## 1.3 Computer Use 规则

用户明确要求：尽量不要让 Codex 使用 Computer Use，因为消耗额度很大。

Codex 执行优先级：

1. 直接文件 / 代码修改；
2. 命令行检查 / 脚本；
3. Unity Editor Script / BatchMode；
4. EditMode / PlayMode 自动测试；
5. 自动截图 / 自动证据；
6. Computer Use 仅在确实无法通过上述方式完成时短暂使用。

主观内容由用户人工审核，例如：

- 材质好不好看；
- 网格强弱；
- 第一人称手感；
- 家具布局；
- Ghost 是否舒服；
- 构图 / 光照气氛。

Codex 不要为了主观视觉自己反复点 Unity 消耗额度。

## 1.4 图片生成硬规则

项目长期规则：只有当用户当前消息里明确出现精确短语 **`生成图片`** 时，才允许生成/编辑图片。

不要因为用户说“做草图”“可视化”“看看设计”就自动 image generation，除非当前消息里真的包含 `生成图片`。

## 1.5 3D / 动画 authoring 边界

- 用户自己负责最终可见 3D 资产建模，常用 Hunyuan3D。
- 用户希望自己在 Cascadeur 里做角色动画。
- Codex 可以做导入、retarget、Unity integration、测试、export/import 技术工作。
- 不要未经要求替用户创作最终角色动画或重做其最终可见模型。

---

# 2. 当前游戏核心身份

游戏已经从早期“Four Workstations / Office”显著转向一个更明确的 VQ2 世界：

> **第一人称 Persistent Mystery Room Game**

核心幻想：

> 玩家住在一个被保留下来的小型三维避难空间中，通过 Retrieval Orb 触碰不可知的 Outside，把未知带回家，并逐步理解这个房间、Atlas、外部宇宙以及保存人类的文明。

推荐核心循环：

`Inhabit -> Retrieve -> Inspect -> Place -> Observe -> Connect -> Reinterpret`

长期原则：

- LOW VERB / HIGH DISCOVERY；
- 复杂性来自世界状态、关系、观察和重新理解，而不是很多复杂按键；
- 房间本身是主界面；
- 玩家登录后首先应该“看房间发生了什么变化”，不是任务列表；
- 不是生存条堆叠游戏；
- 不是传统钓鱼游戏；
- 不做 fishing QTE / bait tree / lure rarity / big loot UI；
- 不做餐厅系统；
- 不以拿武器杀鱼或刷杀为核心；
- 不要 generic cyberpunk sci-fi UI。

情绪基调：

> 宇宙可能已经结束，但生活没有停止。

普通日常非常重要：喝水、吃东西、听音乐、看电视、坐下、躺下、摸猫、摆家具、在房间里生活。它们负责定义“正常”，Outside 再逐步破坏玩家对正常的理解。

---

# 3. 世界观总设定 — 当前最新

相关 memory：

- `VQ2_WORLD_ORIGIN_PREMISE_AND_LIVING_WORLD_2026-09-03.md`
- `VQ2_REFUGE_SPHERE_POWER_RETRIEVAL_NARRATIVE_CONTRACT_2026-09-03.md`
- `VQ2_DUAL_STORYLINE_AND_ALIEN_CONTACT_ARC_2026-09-03.md`
- `VQ2_CHAPTER1_FIRST_HOUR_NARRATIVE_2026-09-03.md`

## 3.1 人类与避难空间

- 人类原来的三维宇宙正在毁灭 / 已经失去可居住性。
- 一个远比人类先进的外星文明保存了至少部分人类。
- 不能简单称为“善意救援”；他们为什么保存人类，前期未知。
- 玩家被放入一个小型可居住三维空间。
- 灵感来自“小宇宙 / 避难空间”概念，但必须原创世界机制、术语、外星动机与剧情，不照搬现有小说角色、名词和解决方案。

## 3.2 玩家开场

- 房间左侧有一个重要的门。
- 玩家最开始通过这个门，被某种机器 / transfer mechanism 送入房间。
- 门不是普通“公寓通走廊”的门，是谜题的一部分。
- 不建议传统“主角完全失忆”。玩家可以知道自己是谁、知道人类和灾难，只是不知道自己最后如何来到这里、这里为什么存在。

## 3.3 Atlas Refuge Sphere

Atlas 最新拥有非常重要的底层功能：

> **Atlas 是稳定三维避难域的核心锚点。**

- Atlas 位于房间内部。
- 以 Atlas 为球心存在一个很大的、正常情况下不可见 / 透明的球形稳定域。
- 半径至少显著大于房屋，当前设想至少超过房屋半径两倍。
- 这个球不是普通 force shield。
- 它在高维环境中维持一块稳定的三维物理空间。
- 房屋、空气、人、猫、普通物质和本地三维规则都在这个范围内被保护。
- 因此房屋未来可以只有部分墙，真正的可居住边界不是墙，而是 Atlas Sphere。

非常重要：

- 球平时不可见；
- 玩家早期不知道自己住在球里；
- 可以在后期通过 Retrieval 穿越边界时的折射 / 波纹 / 粒子扰动第一次意识到它存在。

## 3.4 封闭系统 / 守恒

用户原意：只要 Atlas 稳定域完全封闭，内部物质和能量形成近似闭环，日常能源可以显得近乎无限。

写法不要硬说“能量守恒 = 无限电力”。更合理的 fiction 是：

- Atlas 维持封闭三维域；
- 内部 mass-energy 循环 / 回收；
- 正常生活耗能基本处于可持续闭环；
- 真正的系统成本发生在打开边界、与高维 Outside 交换时。

具体热力学术语还没锁死。

## 3.5 墙上无线 Power Hub / Battery

房间未来要有一个较大的高位壁挂电源设备：

- 它不是 Atlas；
- 它是本地无线能源分配器 / 缓冲器；
- 以它为中心存在一个较小球形供电范围；
- 在范围内的设备不需要传统插线；
- 小型无人机也可以在这个无线供电范围内正常活动；
- 外观方向：高位、较长、薄、接近墙顶、白/骨白 + 温暖钛银 / champagne metal + 克制暖色光缝，不要赛博朋克。

## 3.6 Retrieval = 有成本地打开避难域

Retrieval Station + 发光 Orb 是房间主动触碰 Outside 的核心设施。

逻辑：

1. Atlas Sphere 正常封闭；
2. Retrieval 要把 Orb 送出去；
3. 系统必须在 Atlas 边界开一个受控小通道；
4. cable / powered tether 穿出边界，为 Orb 持续供电；
5. 打开边界导致 refuge 产生真实损耗；
6. 所以 Retrieval 既是探索，也必须帮助补充质量 / 能源 / 稳定性。

损耗的最终术语未锁死，可以原创为 dimensional bleed / stability expenditure / matter leakage 等。

关键 gameplay rule 已锁：

> **打开避难域必须有真实成本。**

## 3.7 Retrieved Object 的多重价值

回收物不能只是收藏品或剧情钥匙，至少有：

1. discovery / 娱乐 / 好奇；
2. 剧情推进 / 研究；
3. 质量 / 能源 / 稳定性补充；
4. 房间建设 / 修复 / 制造；
5. 可能的生命、关系、Atlas 反应价值。

一个东西可以：

- 拆掉补质量；
- 用来修设施；
- 保留研究；
- 放进房间；
- 和 Atlas 互动；
- 和猫互动；
- 保持其生命状态。

强设计张力：

> 一个物体可能拆掉很“值钱”，但保存它可能带来更重要的知识、关系或剧情。

---

# 4. 两条故事线

用户明确把故事分为两条：

## 4.1 玩家线

关注：

- 我为什么在这里；
- 我如何在这个房间生活；
- 如何把基础避难空间变成真正的家；
- Atlas / Retrieval / Power Hub 是什么；
- 人类为什么被保存；
- 是否还有其他人 / 其他 refuge。

主题可以理解为：

> **一个人如何重新成为“生活着的人”。**

## 4.2 高维宇宙线

Outside 的文明不是纯背景。

- 高维 / 外部文明极其强大；
- 早期仍存在战争，力量差距可以夸张到几十倍级别；
- 随着三维宇宙持续崩溃，越来越多文明开始意识到“文明本身正在成为稀缺资源”；
- 一部分文明逐渐从征服 / 极端安全主义转向保存、合作、和平；
- 保存人类的外星文明也属于这条历史变化的一部分。

主题可以理解为：

> **当宇宙本身正在消失，文明是否还能学会把其他文明当成值得存在的东西。**

两条线最终逐渐交汇，但不要一开始就用百科说明。

---

# 5. 无人机与外星联系人

## 5.1 无人机

- 玩家进房间时，小型无人机已经存在。
- 它有本地自动功能：巡检、开设备、基础提醒、引导、教程。
- 它不是一直有一个外星人实时操纵。

## 5.2 外星人远程接入

重要设定：

- 游戏初期，无人机有时会被一个真实外星个体远程接入；
- 这个外星人是玩家认识的第一个外星人；
- 初期不常在线；
- 不允许玩家任何时候有问题就问他，否则探索会被破坏；
- 他可能只是偶尔接入几分钟，然后离开；
- 无人机恢复本地模式。

后期：

- 他接入频率提高；
- 开始讲自己的经历，而不是读世界百科；
- 玩家通过一个人的记忆逐渐理解外部文明的历史；
- 他不是全知的；
- 第一章战争双方他甚至可能也不知道是谁。

长期关系方向：

一开始玩家可能只是“保护项目 / 工作对象”，后面两者逐渐建立真实关系。

可以用非常生活化的细节体现：例如外星人最初不理解玩家为什么浪费宝贵质量造唱片机 / 音响，后期反而给玩家带来他们文明的“音乐”。

---

# 6. 猫

猫是强方向，不是装饰物。

要求：

- 高互动；
- 睡觉、伸懒腰、跳桌子、挡路、喝水、吃东西、趴窗边、钻家具、蹭玩家等；
- 对 recovered objects / anomalies 有反应；
- 可以成为非常自然的“环境感知器”，但不能弹 UI 写 CAT DETECTED ANOMALY；
- 玩家通过猫的行为自己发现不对劲。

一个很强但还未最终锁死的悬念候选：玩家进入房间时，猫可能已经在那里；很晚才意识到“它为什么会在这里？”

---

# 7. 第一章 / 第一个小时

相关文档：`VQ2_CHAPTER1_FIRST_HOUR_NARRATIVE_2026-09-03.md`

## 7.1 初始状态

- 玩家通过左侧门被机器送入；
- 无人机已在房间；
- 地上有一个大初始物资箱；
- 房间不是空的。

初期已经可以有：

- Power Hub / Battery；
- 电视 / display；
- 一些桌椅；
- 基础生活设施；
- Atlas / Retrieval 作为明显但尚未理解的设备。

玩家会逐步建设、放家具、改善房间，不是开局就 luxury home。

## 7.2 第一个小时节奏建议

粗略：

- 0–10 分钟：到达、移动、无人机引导、打开物资箱；
- 10–25 分钟：基础生活 / 电源 / 家具 / 简单摆放；
- 25–45 分钟：接触 Atlas / Retrieval 的基础行为，但不解释宇宙真相；
- 45–60 分钟：第一次巨大 Outside spectacle。

## 7.3 第一章远方战争 — 核心事件

玩家从没有两面墙的开放空间向极远处看。

事件：

1. 一群 / 一支非常强大的舰队，以类似高速 / 光速跃迁的极快视觉突然到达；
2. 它们立刻朝一个玩家看不清是什么的区域 / 目标发射大量 beam / laser-like 攻击；
3. 战斗非常短；
4. 突然从另一方向 / 未知位置出现一道极强粒子 / 能量打击；
5. 整团舰队被几乎瞬间团灭；
6. 发生极强烈远方爆炸和光效；
7. 最开始完全没有声音；
8. 过一段明显延迟后，房间 / Atlas 稳定域才传来一个轻微震动。

不建议做成任务：不要提示“前往观景点”。玩家正在做生活操作时自然发现外面光线变化更强。

视觉原则：

- 舰队先看起来已经强得不可理解；
- 另一方再以巨大数量级差距轻易消灭它；
- 战斗 5–10 秒级甚至更强，不要拖成传统两分钟太空互射；
- 强调沉默与延迟震动。

## 7.4 战争身份

最新锁定：

- 双方都是极强文明；
- 一方比另一方强很多，用户暂时说“数十倍”级别，但不要硬写死精确数字；
- 玩家 **可能永远不会知道这两方分别是谁**；
- 不需要在后续为了伏笔强行揭秘；
- 事件的意义是告诉玩家：外面的历史巨大到根本不以玩家为中心。

---

# 8. Atlas 作为“另一个房间”系统 — 仍未最终确定

早期 Atlas 文档曾设计：

- Atlas 逐步建设；
- 从未知基础 -> 反应 -> pattern -> spatial echo -> persistent stranger room；
- 观察固定陌生房间；
- 对方知道有人在观察但不知道身份；
- 后期可能影响对方；
- global topology 类似 closed-chain / Ouroboros。

这些是旧的“RESEARCH / PROPOSED”方案，不应当自动视为全部 locked。

现在更强的新底层设定是：

> Atlas 首先是避难域三维锚点。

跨房间连接可以以后从这个物理事实自然长出来：

- 每个 refuge 可能都有自己的 Atlas Anchor；
- 它们都嵌在同一个高维 substrate；
- Atlas 升级后感知另一个 Atlas 节点；
- 固定房间可以解释为“拓扑邻居”，不是推荐算法；
- 观察 / 影响也会遵守“打开 / 耦合边界有成本”的同一规则。

但是：

**用户目前仍明确说“Atlas 究竟怎么和另一个房间互动还没想好”。不要替用户锁死。**

---

# 9. Retrieval Station / Orb — 已有较强技术与视觉基线

相关文档：`VQ2_RETRIEVAL_TETHER_RUNTIME_CONTRACT_2026-09-01.md`

## 9.1 物理意义

- 不是鱼竿 / 鱼钩；
- cable = powered umbilical；
- cable 给 Orb 供电；
- Orb 有主动运动能力；
- Orb 可上下、左右、斜向移动；
- 不按普通重力摆锤运行；
- cable 限制 reach 并负责回收。

## 9.2 Cable 起点

锁定：

- cable 必须从 Station 长 guide arm 最末端的 terminal guide head 出来；
- `Tether_GuideTip` 精确对齐那里；
- `Orb_TetherAttach` 在 Orb；
- `Orb_CradleSocket` 是 Station 前方圆形篮 / cradle 的存放位置。

不要让线从 Station 身体 / reel / arm base 中央出来。

## 9.3 Stored

不用时：

- Orb 放在 Station 前方圆形 cradle；
- 不是吊在 rod tip；
- cable 仍可保持连接，有短自然 slack。

## 9.4 Reach

- prototype 曾用 18m，仅测试值；
- 最终 cable 要很长；
- Orb 可以完全飞出屏幕到 Outside；
- runtime 架构不能假设短 room-scale cable。

## 9.5 Orb 发光

未来：

- warm ivory / cream / beige-yellow；
- 慢呼吸；
- 克制；
- 不 neon；
- 不 strobe。

## 9.6 当前本地 Phase 1

已做过本地 runtime foundation：

- states：Stored -> Deploying -> Holding -> Retrieving -> Docking -> Stored；
- LineRenderer / procedural curve；
- slack / tension；
- 没有刚体链；
- reel rotation 暂时禁用，因为 pivot 不安全；
- user 视觉反馈“差不多”。

重要文件（本地已报告）：

- `Assets/FourWorkstations/Scripts/Retrieval/RetrievalRuntimePrototype.cs`
- `Assets/FourWorkstations/Scripts/Editor/Vq2RetrievalRuntimePhase1.cs`
- `Assets/FourWorkstations/Tests/PlayMode/RetrievalRuntimePhase1Tests.cs`
- QA：`VQ2_Retrieval_Runtime_Phase1_QA.unity`
- material：`RetrievalTether_Phase1.mat`

---

# 10. Gate 3 / 主要 3D 资产基线

Gate 3 已由用户正式关闭，production baseline 成立。

闭环文档：`VQ2_GATE3_CLOSED_PRODUCTION_BASELINE_2026-09-01.md`

local checkpoint：`3a8eb5fb769918987426d5aadb55f802a6017cb0`

## 10.1 Atlas

- Hunyuan source protected；
- Mother ~641,914 tris / 404,427 verts；
- accepted assembly ~209,806 tris；
- Human Visual PASS；
- current visual anchor protected；
- AtlasRoot `(0,0.02,0)`，Y180°，scale2.5x；
- B2 emission mask domains 已接受；
- 避免 unrelated task 顺手改 Atlas。

长期 polish：

- warm marble / mineral ivory；
- champagne / brushed metal arcs；
- dark gunmetal；
- frosted optical；
- restrained breathing / micro-motion；
- no neon。

## 10.2 Retrieval Station

source：`20260901161015_4810a71f.fbx`

- ~816,590 tris；
- ~408,428 verts；
- 11 meshes；
- 4 embedded 4K textures；
- accepted high-poly；
- no forced LOD / reduction unless profiling shows need。

原 accepted room pose（在旧 room baseline）：

- scale 3.5；
- position `(7.784205, 0, 1.625)`；
- Y 180°；
- Guide Arm toward Outside。

20x20 expansion 后家具保持原 world coordinates，未来布局可能重新设计，因此上述是历史 accepted pose，不代表未来永远锁死房间布局。

## 10.3 Rest Edge Seat

- shared Seat prefab；
- presentation scale 2.0；
- internal FBX normalization 75；
- 曾有 4 个座椅沿 Rest Edge；
- 后来旧四角色 / workstation chairs 在新 player integration 时 disabled；
- 20x20 candidate 当前仍能看到一些旧 rest seats，未来房屋布局会重新规划，不要自动认为旧四椅最终必须保留。

## 10.4 Returning Piece

source：`20260901174424_79d0e456.fbx`

- ~49,986 tris；
- protected source；
- 尚未正式放入房间；
- future behavior：90% quiet；若转离正确方向，1–3 秒缓慢自纠约 15°；upside-down inert；不做指南针狂转、悬浮、雷达箭头。

---

# 11. Player / Character / Animation

## 11.1 Quaternius retarget

用户下载了 Quaternius Universal Animation Library。

Humanoid retarget 已 PASS：

- Avatar valid；
- 22 body mappings；
- Idle / Walk retarget 成功；
- root motion off；
- transform drift 0；
- compile pass。

相关 memory：

- `VQ2_CHARACTER_ANIMATION_QUATERNIUS_RETARGETING_2026-09-02.md`
- `VQ2_CHARACTER_HUMANOID_RETARGET_PASS_2026-09-02.md`

## 11.2 Player Office Integration

Codex 已把新玩家接进 Office：

- WASD；
- Idle / Walk 按实际速度切换；
- root motion off；
- 旧四个 Office characters 从 active presentation 移除；
- 用户反馈：“非常完美”。

文档：`VQ2_PLAYER_OFFICE_INTEGRATION_PASS_2026-09-02.md`

## 11.3 Player 材质

用户不喜欢原灰白壳在灯光下太暗。

最新方向：

- 除关节和 head horizontal ring 外，灰白 shell 改成 warm light titanium / champagne-silver satin metal；
- 高级、柔和反射；
- 非镜面 chrome；
- 非黑金 / cyberpunk；
- joints 不改；
- head ring 预留 future emission。

Codex 已做浅暖钛银 satin metal；用户随后直接进入第一人称工作，没有报告反对，可当当前接受状态，除非后续用户改口。

## 11.4 第一人称

当前方向：

- 第一人称作为主要 active gameplay；
- 保留原斜俯视 / dollhouse camera 作为 Room View / Rest View；
- F6 prototype 可切换；
- mouse look + WASD；
- Eye Pivot 高度 1.55m；
- full-body first person，而不是单独 FPS arms；
- 低头能看到胸、手臂、腿、脚；
- 自己第一人称不应看到阻挡视线的头部几何；
- 但 head 必须继续 cast shadow；
- F6 切回 room view 时完整角色显示。

最新修正：

- Eye Pivot 高度保持 1.55m；
- 只向角色 local backward 后移 0.03–0.05m；
- 不要通过 disable whole head Renderer 来隐藏头；
- 要保留完整头部地面阴影。

用户曾给截图，full body 已能看见；最新“后移 Eye Pivot + head shadow”修正结果尚未在聊天里正式报告 PASS/FAIL，不要假装已验证。

## 11.5 Cascadeur

用户想自己做动画。

如果以后让 Codex 把已有 FBX 导进 Cascadeur，用户喜欢这种极简指令：

“直接启动 Cascadeur，把今天生成的角色 FBX Import 进去，不转换、不重导、不改骨骼，确认显示后停下。”

---

# 12. 房间几何 — 当前 20x20 candidate

用户认为旧房间太小，于 2026-09-03 做了大胆扩建。

目标：

- 删掉两面墙；
- 地板先平移，让原地板右下角对齐 Unity 大网格目标正方形右下角；
- 再只向上、左扩；
- 最终 20m x 20m。

Codex 报告当前 candidate：

`Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`

结果：

- 两面墙及门窗收边已移除；
- 地板先平移约 `(1.9,0,-3.4)m`；
- 再向左、上扩；
- 右下角 `(10,0,-10)`；
- 误差约 0.000002m；
- 家具 / 装置保持原 world positions；
- camera / lighting / materials 当时未改；
- Compile PASS；
- PlayMode 180 frames PASS；
- blocking errors 0；
- 未 promotion。

当时 Codex 明确提醒：

- 旧 baked shadow 有残留 / 错位；
- 玩家移动范围还没有扩展。

之后曾给 Codex 一条修复指令，但本聊天中没有拿到明确完成报告。因此：

**不要擅自假设这两个问题已经彻底解决。需要在接下来的候选场景工作中验证。**

---

# 13. 房屋未来布局 — 设计目标

用户对之前自动生成的平面布局不满意，主要原因：

- 空间利用率太低；
- 缺乏秩序；
- 家具像随意摆；
- 分区不明确；
- Rest Edge 沙发 / 座椅被错误当成普通休息区；
- 缺少真正建筑师 / 室内设计师思路。

最新要求：

> 把 20x20 房间当成真正的高级住宅 / 小屋平面来设计，先不考虑科幻造型，先做建筑学上的合理分区、轴线、边界、负空间和动线。

可以使用：

- 屏风；
- 半高隔断；
- 材质地面变化；
- 家具组织；
- 顶部 / 壁面设施；
- 功能边界。

不要把全屋塞满。需要 intentional negative space。

未来预期内容：

- Atlas 中央 / 核心区域；
- Retrieval mechanical zone；
- media / TV / soundbar / speakers；
- wall-mounted record player；
- Power Hub；
- 日常生活供给（水 / 食物 / 保存设备，具体 lore 未锁）；
- Window Research Bar；
- Retrieval Storage Cabinet；
- work / research area；
- Rest Edge / lounge；
- 猫活动空间；
- Arrival / transition area。

旧“两个 desk”只是 assistant 提议，不是用户 lock。

旧项目名叫 Four Workstations，但现在不要因为名字强行保留四工位布局。

---

# 14. 生活设施方向

用户已经提出 / 接受为 strong direction 的设施：

- soundbar + speakers；
- 特殊 wall-mounted record player，打开后插入 record / disc；
- 较大 wall-mounted TV，可播放视频 / 后期信息；
- 高位 wall-mounted wireless power hub；
- 喝水、吃东西、坐、躺、休息等普通生活；
- food / water 来源和是否真实食物仍未最终锁。

中型家具设计方向：

## Retrieval Storage Cabinet

- medium freestanding low cabinet；
- recovery/sample staging/storage workbench；
- broad low rounded body；
- bone/off-white shell；
- warm champagne / warm gray / gunmetal accents；
- thin warm ivory light seams；
- top circular / elliptical specimen tray；
- hidden drawers / slots；
- no exposed cyberpunk pipes / excess screws。

## Window Research Bar

- medium furniture/device under window；
- 更薄、更平、更长的 tabletop；
- 宽度大致保留；
- 支撑柱重新设计；
- 增加金属质感但保持 minimalist；
- white/cream top + champagne / warm silver + gunmetal supports；
- hidden drawers/sample recess/research/charging area；
- high-end furniture + research staging；
- 不要厚重 lab table / neon。

过去三视图 cabinet 有 identity drift，被拒绝，不要当 authority。

---

# 15. Build Grid + Footprint Placement — 当前刚完成，Human PASS

相关 memory：`VQ2_BUILD_GRID_AND_PLACEMENT_CONTRACT_2026-09-03.md`

用户希望玩家未来建造家具 / 小设施时像其他 building game 一样，有网格和占地概念。

## 15.1 已锁规则

- Floor 仍是一整块连续 mesh，不切成大量 tiles；
- 独立 Build Grid Overlay；
- 只有 Build Mode 显示；
- 主视觉 grid = 1m x 1m；
- 内部逻辑 step = 0.5m；
- footprint 可为 0.5、1、1.5、2...；
- mesh shape 不必等于 logical footprint；
- footprint 是 authored data，不以 Renderer Bounds 自动结果为权威。

例：

- 0.5 x 0.5；
- 1 x 1；
- 1.5 x 0.5；
- 2 x 1；
- 2 x 2。

## 15.2 本地 prototype 已实现

场景：`Office_Open20m_Candidate.unity`

reported：

- Grid X `-10 -> 10m`
- Grid Z `-10 -> 10m`
- Origin `(-10,-10)`
- visual cell 1m
- logical step 0.5m
- Overlay floor +0.025m

文件：

- `Assets/FourWorkstations/Scripts/Building/BuildGridDefinition.cs`
- `BuildableFootprint.cs`
- `BuildOccupancyGrid.cs`
- `BuildGridOverlay.cs`
- `BuildModePrototypeController.cs`
- `FourWorkstations.Building.asmdef`
- `Assets/FourWorkstations/Scripts/Editor/OpenOfficeBuildGridPrototype.cs`
- `Assets/FourWorkstations/Tests/PlayMode/BuildGridPrototypeTests.cs`

测试 buildables：

- A 1x1 -> 2x2 cells PASS
- B 2x1 -> 4x2 cells PASS
- C 1.5x0.5 -> 3x1 cells PASS

验证：

- 空地放置 PASS
- overlap reject PASS
- partial out-of-bounds reject PASS
- 90° rotation PASS
- 四次旋转无 drift PASS
- Confirm occupancy PASS
- Cancel no occupancy PASS
- Compile PASS
- PlayMode 10/10 PASS
- blocking errors 0

prototype controls：

- `B` Build Mode
- `1/2/3` 测试 buildables
- center aim target floor
- `R` 旋转 90°
- left click / `F` confirm
- right click / `X` / `Esc` cancel
- green valid
- red invalid

## 15.3 用户人工验收

用户实机截图后明确说：

> “效果很不错，我已经放了几个东西试一下了”

因此记为：

**HUMAN VISUAL / FEEL PASS**

重要清理项：

- 用户在测试时摆下去的几个测试方块只是验证用；
- 后面正式布局 / candidate cleanup / promotion 前必须删除；
- 不允许当正式家具进入 production。

不要继续无授权扩展 inventory、economy、crafting、save/load、最终 build UI。

---

# 16. 当前木地板材质任务 — 现在正停在这里

这是新对话最直接的接手点。

用户觉得当前 20x20 地板太普通，准备换 Poly Haven 的 `Oak Wood Planks`。

用户已下载 4K 并解压，目前截图显示文件夹：

`C:\Users\ROG\Downloads\oak_wood_planks_4k\textures`

里面只有 4 张图，正好是我们需要的：

1. `oak_wood_planks_diff_4k.jpg`
2. `oak_wood_planks_ao_4k.png`
3. `oak_wood_planks_nor_gl_4k.png`
4. `oak_wood_planks_rough_4k.png`

这四张是正确完整的当前 Unity PBR 需求：

- diff -> Base Map
- ao -> Occlusion
- nor_gl -> Normal Map
- rough -> 转为 Unity Smoothness

用户打算把整个已解压文件夹直接交给 Codex，不想自己再挑文件。

## 16.1 木地板集成要求

下一步 Codex 应：

- 只改 `Office_Open20m_Candidate.unity`；
- 不改 production；
- 不改 source 下载图；
- 把需要的贴图复制到 Unity 合适 Art/Materials 目录；
- 新建一个独立 URP/Lit 木地板材质，例如 `OakWoodPlanks_URP_PBR.mat`；
- 不覆盖旧 floor material；
- Diffuse -> Base Map；
- Normal GL 正确标记 Normal Map；
- AO -> Occlusion；
- Roughness -> Smoothness（通常反相；具体 packed channel 方案由实现决定但需说明）；
- 不使用 Displacement；
- 根据材质真实尺度 / 第一人称近距离观感设置合理 tiling；
- 绝不能把一张木纹拉伸成整块 20x20m；
- 保留 Build Grid Overlay；
- `B` 后虚线仍然显示正确；
- 不移动 Atlas、Retrieval Station、玩家、家具；
- 不改 camera / lighting；
- 尽量不 Computer Use；
- 做完让用户自己 Human Visual Review；
- 不 commit/push/promotion。

## 16.2 用户下一步最关心的视觉验收

- 木板真实尺寸是否自然；
- 第一人称低头看是否清晰但不重复得过于明显；
- 颜色是否温暖、高级；
- 不要过黄 / 过橙；
- 反射 / roughness 是否像 varnished oak 而不是塑料；
- B 打开 Build Grid 后，虚线在木纹上仍清晰但不刺眼。

---

# 17. 美术总方向

## 17.1 当前 VQ2 房间

虽然早期项目大量使用 warm miniature / handmade 风格，但现在第一人称下需要更真实、更高级的居住空间。

主风格：

- warm;
- high-end;
- tactile;
- refined sci-fi without cyberpunk；
- ordinary domestic materials + extraordinary systems；
- white / cream / bone;
- warm titanium / champagne silver；
- dark gunmetal accents；
- warm ivory restrained lights；
- wood 作为让房间真正“像家”的重要材质。

不要：

- neon blue sci-fi；
- glossy black spaceship console；
- 过多 LED；
- 工业管线乱露；
- 每件家具都做成未来设备；
- 所有 surfaces 都金属。

核心对比：

> 房间内部越来越像真正舒服的家，而墙外是完全不可理解的世界。

## 17.2 旧 TIDEFALL 项目注意

用户还另有一个 Godot 游戏 `TIDEFALL`，大量 pixel art / 潜水员戴夫参考规则属于另一个项目。不要把 TIDEFALL 的 pixel-art 资产规范混入 Four Workstations / VQ2。

---

# 18. Gate 3 性能基线（供避免无意义优化）

Gate 3 时用户已接受当前 high-poly assets。

1920x1080 High URP 1.0 MSAA4 RTX4060 Laptop：

- Day avg ~4.190ms / 238.65 FPS；P95 19.250ms
- Night avg ~1.506ms / 663.99 FPS；P95 2.122ms
- Day ~1,073,628 tris / 51 renderers
- Night ~1,205,775 tris / 56 renderers
- mesh memory Day ~96.42MB / Night ~109.63MB
- texture runtime ~621.24MB
- user asset textures ~84.22MB
- Atlas mesh ~20.65MB

结论：

- 不要看到 Station 80 万 tris 就自动要求降模；
- profile first；
- current high-poly accepted；
- no forced LOD unless actual sustained blocking perf issue。

---

# 19. 重要 docs / commits 摘要

以下 commit 主要是项目记忆 docs，不代表所有 local Unity 资产都已 push：

- Gate 3 closed baseline：`1c3bb8270dafb80550cbab8ccb0ad11041041860`
- Quaternius retarget memory：`77ac82d58f18b7850db850387e8942d824740bde`
- Humanoid retarget PASS：`d5000966b09c6b2a14be45541d067fdda480fb87`
- minimal movement authorization：`a6d2075435e49bc5824e42d10461fc4172537dca`
- Player Office Integration PASS：`81e4a1dff4ffa826c000396724e1b18b288d2904`
- Player material warm titanium update：`8ceda627bca5a5cdeae6f202092c783e045eb308`
- First-person authorization：`608cf04e65a64bf29b49233f4012a91ef2b35c6c`
- First-person head-shadow / Eye Pivot correction memory：`28c9f76f04256657c304d02cde20cd13a02c11be`
- World origin premise：`edb2df0659d0ee69cb069f6875ce33bc1f655ead`
- 20x20 geometry expansion memory：`4adf0420e37f20a4c724bc0c691663b1bf4e5c6d`
- Refuge sphere / power / retrieval narrative：`4dc40f06b0c6ef59dcf6b020da02dbb6331e65a1`
- Chapter 1 initial doc：`cc43658101bae18b289fec96e8e90e4f7f974348`
- Chapter 1 war identity update：`36e9f60b4809a528236f5b121bccf99f1dcb2423`
- Dual storyline / alien contact：`a4309926cd202d97bcc4ad1f37ae24c6aba332eb`
- Build grid initial contract：`b7c7f5ad0185cc39b12e12411c79a2374ca6f495`
- Human-review / Computer Use update：`9a1c6167c5186913796dff37eaf744eef293be6d`
- Build-grid implementation result memory：`d5ac3f0c47a61d8ae237ba11a5a08d9f4a2e81fd`
- Build-grid Human PASS + test cube cleanup note：`1b67f641321e2cb89a042e5f5bdb69e225d226cd`

---

# 20. 当前真正的下一步顺序

新对话不要重新讨论已经接受的东西，直接从这里继续。

## Immediate

1. 用户把 Poly Haven Oak Wood Planks 4K 解压文件夹交给 Codex。
2. Codex 将 4 张贴图接入 `Office_Open20m_Candidate` 的 20x20 地板。
3. 保留 Build Grid Overlay。
4. 用户 Human Visual Review 木地板。
5. 如果 PASS，再记录材质 baseline。

## After floor

6. 删除用户测试 Build Grid 时放下的测试 cubes / placeholder builds。
7. 验证 20x20 candidate 的两个历史未确认问题：
   - old baked shadow 是否已完全清理；
   - player movement bounds 是否覆盖完整 20x20。
8. 开始真正建筑师式 room planning：先分区 / 动线 / 屏风 / 负空间，不急着科幻细节。
9. 再逐步制作 / 导入 medium furniture 和生活设施。
10. 最后才把完整 build catalog / inventory / save-load / economy 接上。

## Narrative parallel work

房屋制作期间可以继续补剧情，优先补：

- 玩家第一小时每个具体交互；
- 无人机第一次“外星人上线”的时机；
- 第一章战争如何自然进入玩家视野；
- 初始 crate 到底有什么；
- Power Hub / Atlas / Retrieval 在第一小时分别教到什么程度；
- 猫何时出现（开局已在 / 后来出现尚未最终 lock）；
- Atlas 跨房间机制继续开放，不急着定。

---

# 21. 对新 ChatGPT 的执行提醒

1. 不要要求用户重新解释本 handoff 已写清的项目背景。
2. 遇到 repo / local state 问题优先用 GitHub project-memory 交叉检查，但不要把远端当作本地实时状态。
3. 如果用户给 Codex 的本地报告，先按报告记录；不要假装能从远端验证本地未 push 内容。
4. 新的用户明确决定要继续同步 Markdown。
5. 简单 Codex 任务保持简短；系统任务才展开。
6. 尽量不让 Codex Computer Use，视觉交给用户 Human Review。
7. 未经用户当前消息精确说 `生成图片`，不要生成图片。
8. 不要把旧 Atlas stranger-room 提案当已锁；新的 Atlas primary function 是 3D refuge anchor。
9. 不要把第一章战争强行解释清楚；双方可以永远未知。
10. 不要破坏已经 Human PASS 的 Build Grid 数学基础。
11. 测试 cubes 后续必须删。
12. 当前接手点：**Oak Wood Planks 4K 地板 PBR 集成。**
