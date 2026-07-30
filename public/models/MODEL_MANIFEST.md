# 四人工位 3D 模型清单

第一阶段当前使用 Three.js 程序化低多边形几何体作为可运行 fallback，因此 `public/models` 内的 GLB 总大小为 0 MB。请只放入许可证清晰的 CC0 素材，并在对应目录保留原始许可证文件。

## 第一步必需模型

- `office/room-shell.glb`：地板、两面墙与窗户外壳
- `office/workstation.glb`：可复用办公桌
- `office/office-chair.glb`：可复用办公椅
- `office/desktop-computer.glb`：可点击电脑
- `characters/blocky-character.glb`：带骨骼的基础 Q 版角色
- `animations/character-core-actions.glb`：idle、walking、sitting、typing、eating、resting、waving

## 后续场景模型

- `office/entrance.glb`
- `office/restroom-door.glb`
- `office/coffee-machine.glb`
- `office/dining-table.glb`
- `office/meeting-table.glb`
- `office/sofa.glb`
- `office/plant.glb`
- `office/bookshelf.glb`
- `office/office-props.glb`

## 推荐来源

- Kenney Blocky Characters（人物）
- CC0 Modular Office（房间与家具）
- CC0 Office Low Poly Pack（办公设备与道具）

导入前请再次核对下载页面的许可证，优先使用 GLB，并将单张纹理控制在 1024×1024 或更低。建议对几何体使用 Draco 或 Meshopt 压缩。
