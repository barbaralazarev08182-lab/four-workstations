import bpy
import os

source = os.environ["A35_UAL_FBX"]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=source)

all_actions = sorted(action.name for action in bpy.data.actions)
seated = [name for name in all_actions if "sit" in name.lower() or "seat" in name.lower()]
print("A35_ALL_ACTION_COUNT", len(all_actions))
print("A35_SEATED_ACTIONS", seated)
