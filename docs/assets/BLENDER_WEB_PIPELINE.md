# Blender → GLB → React Three Fiber 管线 · Blender Web Pipeline

> 适用于 VQ-1A 及后续 Blender 资产管线阶段。

---

## 一、Blender 基础设置

### 单位

- 使用 **米制**（Metric）单位
- 场景属性 → Units → Length: Meters
- 1 Blender 单位 = 1 米 = R3F 中 1 单位

### Apply Transform

导出前必须对所有对象执行：
- **Apply Rotation**（Ctrl+A → Rotation）
- **Apply Scale**（Ctrl+A → Scale）
- 确保所有对象的 Rotation = (0, 0, 0)、Scale = (1, 1, 1)

---

## 二、对象规则

### 原点和 Pivot

- 对象原点（Origin）必须位于几何中心或底部接触点
- 家具类：原点位于底部中心（地面接触点）
- 角色类：原点位于脚底中心
- 道具类：原点位于几何中心

### 命名规则

- 对象命名：`vq1_类别_名称`（例如 `vq1_chair_modern_arm`）
- 材质命名：`Mat_类别_名称`（例如 `Mat_Wood_Oak_Dark`）
- 纹理命名：`Tex_类别_名称_通道`（例如 `Tex_Wood_Oak_Dark_BaseColor`）
- 不使用空格，使用下划线分隔

### Bevel 和法线

- 关键边缘必须有 Bevel（倒角）
- Bevel 宽度：根据对象大小，通常 0.005–0.02 米
- 法线必须朝外（检查：Viewport Overlays → Face Orientation）
- 导出前 Recalculate Normals（Shift+N）

---

## 三、UV 和纹理

### UV0（主材质 UV）

- 所有可见面必须有 UV0
- UV 不重叠（除非对称复用）
- UV 岛之间保留合理间距（至少 2–4 像素 @ 1K 纹理）
- 使用 Straight UV layout（不扭曲）

### UV1（预留 AO / Light Map）

- UV1 预留用于 AO 或 light map（如需要）
- 样板阶段可不使用 UV1

### 纹理工作流

- Base Color（基础色）
- Normal（法线）
- AO（环境光遮蔽，可选）
- Roughness（粗糙度）
- Metalness（金属度）

**纹理尺寸**：
- 优先 1K（1024×1024）
- 核心近景允许 2K（2048×2048）
- 不使用 4K 或更大

---

## 四、材质

### Principled BSDF

- 使用 Blender 内置 Principled BSDF
- Base Color：基础色
- Metallic：0 或 1（不中间值）
- Roughness：0–1
- Normal：法线贴图（如有）

### 材质限制

- 不使用 Emission（发光）
- 不使用 Subsurface（次表面散射）
- 不使用 Clearcoat（清漆）
- 不使用 Sheen（光泽）
- 不使用 Transmission（透射）

这些高级属性在 R3F 中需要单独处理，Blender 中保持简单。

### 材质验收

- 在 Blender 中使用 EEVEE 或 Cycles 预览材质
- 导出 GLB 后在 R3F 中再次验收
- 确保材质在 R3F 中表现与 Blender 预览一致

---

## 五、动画

### Action 和 NLA

- 动画使用 Action（动作）
- 多个动作使用 NLA（非线性动画）编辑器管理
- 动作命名：`act_名称`（例如 `act_idle`、`act_walk`）

### 导出动画

- 导出 GLB 时选择包含动画
- 动画帧率：30 FPS 或 60 FPS
- 动画循环：根据需要设置

---

## 六、GLB 导出

### 导出设置

- File → Export → glTF 2.0 (.glb)
- Format: glTF Binary (.glb)
- Include:
  - Meshes ✓
  - Skinning ✓（如有骨骼）
  - Animation ✓（如有动画）
  - Materials ✓
  - Textures ✓
- Compression: Draco（可选，减小文件大小）
- Apply Modifiers ✓
- Apply Rotation and Scale ✓

### 导出后检查

1. 文件大小：单资产 ≤ 5 MB（无压缩），≤ 2 MB（Draco 压缩）
2. 在 R3F 中加载并验收
3. 检查材质、纹理、动画、比例

---

## 七、R3F 集成

### 加载 GLB

```typescript
import { useGLTF } from "@react-three/drei";

const { scene } = useGLTF("/models/vq1/vq1-chair-modern-arm.glb");
```

### 材质验收

- 在 R3F 中验收材质表现
- 确保材质在不同灯光下表现正确
- 确保材质在桌面端 60 FPS

### 灯光和天气

- 最终天气和实时灯光由 R3F 控制
- Blender 中不模拟最终天气效果
- Blender 中使用中性环境光预览材质

---

## 八、管线流程总结

```
1. Blender 建模（米制单位）
2. Apply Rotation / Scale
3. Bevel 关键边缘
4. UV 展开（UV0）
5. 材质制作（Principled BSDF）
6. 纹理绘制（1K 优先）
7. 动画制作（Action / NLA）
8. 导出 GLB
9. R3F 验收
10. 桌面端 1920×1080 60 FPS 验收
```
