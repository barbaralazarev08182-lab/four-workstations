import bpy
import os

source = os.environ["A1_UAL_GLTF"]
output = os.environ["A1_UAL_FBX"]
keep = {"Idle_Loop", "Walk_Loop", "Interact", "Sitting_Enter"}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=source)

for action in list(bpy.data.actions):
    if action.name not in keep:
        bpy.data.actions.remove(action)

bpy.ops.object.select_all(action="DESELECT")
armatures = [obj for obj in bpy.data.objects if obj.type == "ARMATURE"]
if len(armatures) != 1:
    raise RuntimeError(f"Expected one armature, got {len(armatures)}")
armature = armatures[0]
armature.select_set(True)
bpy.context.view_layer.objects.active = armature

os.makedirs(os.path.dirname(output), exist_ok=True)
bpy.ops.export_scene.fbx(
    filepath=output,
    use_selection=True,
    object_types={"ARMATURE"},
    add_leaf_bones=False,
    bake_anim=True,
    bake_anim_use_all_actions=True,
    bake_anim_use_nla_strips=False,
    bake_anim_simplify_factor=0.0,
    path_mode="AUTO",
)
print("A1_EXPORT_PASS", output, sorted(action.name for action in bpy.data.actions))
