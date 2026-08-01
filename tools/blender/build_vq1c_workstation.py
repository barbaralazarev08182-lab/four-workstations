"""VQ1C Gate 4A — assemble the wall-less workstation from standardized assets.

Inputs (only standardized blends, never raw downloads):
  desk-standardized.blend       (STD_DESK_ROOT)
  chair-standardized.blend      (STD_CHAIR_ROOT)
  monitor-standardized.blend    (STD_MONITOR_ROOT)
  keyboard-standardized.blend   (STD_KEYBOARD_ROOT)
  lamp-standardized.blend       (STD_LAMP_ROOT)

Output:
  assets-source/blender/vq1c/standardized/workstation-standardized.blend
"""

import bpy
import math
import os
import sys

STD_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "assets-source", "blender", "vq1c", "standardized"))

SOURCES = {
    "desk":     os.path.join(STD_DIR, "desk-standardized.blend"),
    "chair":    os.path.join(STD_DIR, "chair-standardized.blend"),
    "monitor":  os.path.join(STD_DIR, "monitor-standardized.blend"),
    "keyboard": os.path.join(STD_DIR, "keyboard-standardized.blend"),
    "lamp":     os.path.join(STD_DIR, "lamp-standardized.blend"),
}
OUTPUT = os.path.join(STD_DIR, "workstation-standardized.blend")

ASSET_ROOTS = {
    "desk": "STD_DESK_ROOT",
    "chair": "STD_CHAIR_ROOT",
    "monitor": "STD_MONITOR_ROOT",
    "keyboard": "STD_KEYBOARD_ROOT",
    "lamp": "STD_LAMP_ROOT",
}

ALIGNMENTS = {
    "monitor": ("MONITOR_BASE_ANCHOR", "MONITOR_SOCKET"),
    "keyboard": ("KEYBOARD_BASE_ANCHOR", "KEYBOARD_SOCKET"),
    "lamp": ("LAMP_BASE_ANCHOR", "LAMP_SOCKET"),
}

EXPECTED_TRIANGLES = 2774


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for data in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.actions, bpy.data.armatures):
        for item in list(data):
            data.remove(item)


def load_standardized(path):
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing standardized input: {path}")
    with bpy.data.libraries.load(path, link=False) as (data_from, data_to):
        data_to.objects = [name for name in data_from.objects if name]
    loaded = [obj for obj in data_to.objects if obj is not None]
    for obj in loaded:
        bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.update()
    return loaded


def get_object(name):
    obj = bpy.data.objects.get(name)
    if obj is None:
        raise RuntimeError(f"Missing expected object: {name}")
    return obj


def main():
    clear_scene()

    # Workstation root
    root = bpy.data.objects.new("STD_WORKSTATION_ROOT", None)
    bpy.context.collection.objects.link(root)
    root.location = (0.0, 0.0, 0.0)
    root.rotation_euler = (0.0, 0.0, 0.0)
    root.scale = (1.0, 1.0, 1.0)

    # Load all standardized assets
    loaded_roots = {}
    for key in ("desk", "chair", "monitor", "keyboard", "lamp"):
        loaded = load_standardized(SOURCES[key])
        asset_root = get_object(ASSET_ROOTS[key])
        loaded_roots[key] = asset_root
        # Preserve world matrix when re-parenting under workstation root
        world = asset_root.matrix_world.copy()
        asset_root.parent = root
        asset_root.matrix_world = world
    bpy.context.view_layer.update()

    # Desk stays at origin (its root is already identity / at origin)
    desk_root = loaded_roots["desk"]

    # Align monitor / keyboard / lamp base anchors onto desk sockets
    for key, (base_anchor_name, socket_name) in ALIGNMENTS.items():
        asset_root = loaded_roots[key]
        base_anchor = get_object(base_anchor_name)
        socket = get_object(socket_name)
        anchor_world = base_anchor.matrix_world.translation.copy()
        socket_world = socket.matrix_world.translation.copy()
        delta = socket_world - anchor_world
        asset_root.location += delta
        bpy.context.view_layer.update()
        new_anchor_world = get_object(base_anchor_name).matrix_world.translation
        print(f"ALIGN {key}: delta=({delta.x:.4f},{delta.y:.4f},{delta.z:.4f}) "
              f"anchor_world=({new_anchor_world.x:.4f},{new_anchor_world.y:.4f},{new_anchor_world.z:.4f})")

    # Chair: 180deg around Z, placed on the -Y side of the desk, facing the desk
    chair_root = loaded_roots["chair"]
    chair_root.rotation_euler = (0.0, 0.0, math.pi)
    bpy.context.view_layer.update()

    # Compute chair bounds after rotation, then place it beyond the desk front edge
    dg = bpy.context.evaluated_depsgraph_get()
    chair_meshes = [o for o in bpy.context.scene.objects if o.parent is chair_root and o.type == "MESH"]
    if not chair_meshes:
        raise RuntimeError("No chair meshes under STD_CHAIR_ROOT")
    min_z = min((o.matrix_world.translation.z - o.dimensions.z / 2) for o in chair_meshes)
    max_y = max((o.matrix_world.translation.y + o.dimensions.y / 2) for o in chair_meshes)
    chair_depth = max_y - min_z  # not used directly; depth computed from bounds below

    # Desk front edge (min Y of desk bounds)
    desk_meshes = [o for o in bpy.context.scene.objects if o.parent is desk_root and o.type == "MESH"]
    desk_min_y = min((o.matrix_world.translation.y - o.dimensions.y / 2) for o in desk_meshes)
    # Chair rotated 180deg: its original +Y (back) now faces -Y, original -Y (front) faces +Y (desk).
    # Chair front edge after rotation is at chair_center_y + original_front_extent.
    chair_front_extent = 0.341  # canonical chair +Y extent (back) — after 180deg rotation this is the front toward desk
    gap = 0.12
    chair_center_y = desk_min_y - chair_front_extent - gap
    chair_root.location.y = chair_center_y
    bpy.context.view_layer.update()

    print(f"CHAIR: center_y={chair_center_y:.4f} desk_front_y={desk_min_y:.4f} gap={gap}")

    # LIGHT_DESK_ANCHOR must be preserved — it rides along with the lamp root.
    light_anchor = bpy.data.objects.get("LIGHT_DESK_ANCHOR")
    if light_anchor is None:
        raise RuntimeError("LIGHT_DESK_ANCHOR missing after alignment")
    print(f"LIGHT_DESK_ANCHOR world=({light_anchor.matrix_world.translation.x:.4f},"
          f"{light_anchor.matrix_world.translation.y:.4f},{light_anchor.matrix_world.translation.z:.4f})")

    # Save
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=OUTPUT)
    print(f"SAVED {OUTPUT}")

    # Quick stats
    total_tris = sum(len(o.data.loop_triangles) if o.type == "MESH" else 0 for o in bpy.data.objects)
    # loop_triangles must be computed per mesh; fall back to polygon count for the report
    print("DONE")


if __name__ == "__main__":
    main()
