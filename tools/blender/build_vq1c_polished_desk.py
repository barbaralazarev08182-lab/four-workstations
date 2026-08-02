"""VQ1C Visual Polish Gate 3 — rebuild D4 Desk as separate hard-surface parts.

Input:  assets-source/blender/vq1c/standardized/desk-standardized.blend (read-only reference)
Output: assets-source/blender/vq1c/polished/desk-polished.blend

Master dims: 1.433 x 0.7654 x 0.75 (drift <= 3% allowed), desk top ~0.75.
"""

import bpy
import math
import os
from mathutils import Matrix, Vector

OUT_BLEND = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "assets-source", "blender", "vq1c", "polished", "desk-polished.blend"))

MASTER_X, MASTER_Y, MASTER_Z = 1.433, 0.7654, 0.75
TOP_THICK = 0.045


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for data in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.actions, bpy.data.armatures):
        for item in list(data):
            data.remove(item)


def new_material(name, color, roughness, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def _bake(obj, scale=None, rot_z=None):
    matrix = Matrix.Identity(4)
    if scale is not None:
        matrix = Matrix.Diagonal((scale[0], scale[1], scale[2], 1.0)).to_4x4()
    if rot_z:
        matrix = matrix @ Matrix.Rotation(rot_z, 4, "Z")
    obj.data.transform(matrix)
    obj.scale = (1.0, 1.0, 1.0)
    obj.rotation_euler = (0.0, 0.0, 0.0)
    bpy.context.view_layer.update()
    return obj


def add_box(name, size, center, material, bevel=None, rot_z=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.0, 0.0, 0.0))
    obj = bpy.context.active_object
    obj.name = name
    _bake(obj, scale=size, rot_z=rot_z)
    obj.location = center
    if bevel:
        mod = obj.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
        mod.limit_method = "ANGLE"
        mod.angle_limit = 0.6
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(material)
    return obj


def add_cylinder(name, radius, height, center, material, bevel=None, verts=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=height, location=(0.0, 0.0, 0.0))
    obj = bpy.context.active_object
    obj.name = name
    obj.location = center
    if bevel:
        mod = obj.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
        mod.limit_method = "ANGLE"
        mod.angle_limit = 0.6
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(material)
    return obj


def add_torus(name, major, minor, center, material, verts=(24, 10)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, location=(0.0, 0.0, 0.0),
                                     major_segments=verts[0], minor_segments=verts[1])
    obj = bpy.context.active_object
    obj.name = name
    obj.location = center
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(material)
    return obj


def apply_modifiers(obj):
    for mod in list(obj.modifiers):
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)


def main():
    clear_scene()

    wood = new_material("Desk_Wood_Clay", (0.72, 0.66, 0.56), 0.60)
    metal = new_material("Desk_Metal_Clay", (0.55, 0.54, 0.52), 0.32, 0.65)
    plastic = new_material("Desk_Plastic_Clay", (0.30, 0.31, 0.33), 0.45)

    root = bpy.data.objects.new("POLISHED_DESK_ROOT", None)
    bpy.context.collection.objects.link(root)
    root.location = (0.0, 0.0, 0.0)
    root.rotation_euler = (0.0, 0.0, 0.0)
    root.scale = (1.0, 1.0, 1.0)

    parts = []

    # ---- DESK_TOP (horizontal, wood) ----
    top = add_box("DESK_TOP", (MASTER_X, MASTER_Y, TOP_THICK), (0.0, 0.0, MASTER_Z - TOP_THICK / 2),
                  wood, bevel=0.006)
    apply_modifiers(top)
    parts.append(top)

    # ---- DESK_MODESTY_PANEL (metal, +Y rear) ----
    panel = add_box("DESK_MODESTY_PANEL", (1.05, 0.03, 0.30), (0.0, 0.315, 0.42), metal, bevel=0.004)
    apply_modifiers(panel)
    parts.append(panel)

    # ---- DESK_FRAME_LEFT / RIGHT (metal side legs) ----
    leg_size = (0.06, 0.62, 0.72)
    leg_cz = leg_size[2] / 2  # bottom at 0
    for side in (-1, 1):
        leg = add_box(f"DESK_FRAME_{'LEFT' if side < 0 else 'RIGHT'}",
                      leg_size, (side * 0.60, 0.0, leg_cz), metal, bevel=0.008)
        apply_modifiers(leg)
        parts.append(leg)

    # ---- DESK_CROSSBAR (metal, rear horizontal tie) ----
    crossbar = add_box("DESK_CROSSBAR", (0.62, 0.045, 0.045), (0.0, 0.30, 0.38), metal, bevel=0.004)
    apply_modifiers(crossbar)
    parts.append(crossbar)

    # ---- DESK_FEET (metal ground feet) ----
    for side in (-1, 1):
        foot = add_box(f"DESK_FEET_{'L' if side < 0 else 'R'}", (0.12, 0.72, 0.03),
                       (side * 0.60, 0.0, 0.015), metal, bevel=0.004)
        apply_modifiers(foot)
        parts.append(foot)

    # ---- DESK_CABLE_GROMMET (plastic ring, rear top, flush with surface) ----
    grommet = add_torus("DESK_CABLE_GROMMET", 0.040, 0.010, (0.10, 0.27, MASTER_Z - 0.010), plastic)
    parts.append(grommet)

    # Parent under polished root preserving world transforms
    for obj in parts:
        world = obj.matrix_world.copy()
        obj.parent = root
        obj.matrix_world = world
    bpy.context.view_layer.update()

    # Anchors: preserve master socket positions (within desk top bounds)
    anchor_defs = {
        "DESK_TOP_ANCHOR": (0.0, 0.0022, MASTER_Z),
        "MONITOR_SOCKET": (0.0, 0.2457, MASTER_Z),
        "KEYBOARD_SOCKET": (0.0, -0.1652, MASTER_Z),
        "LAMP_SOCKET": (0.4872, 0.1925, MASTER_Z),
    }
    for name, position in anchor_defs.items():
        anchor = bpy.data.objects.new(name, None)
        bpy.context.collection.objects.link(anchor)
        anchor.parent = root
        anchor.location = position
        anchor.rotation_euler = (0.0, 0.0, 0.0)
        anchor.scale = (1.0, 1.0, 1.0)
        anchor.empty_display_type = "SPHERE"
        anchor.empty_display_size = 0.04

    os.makedirs(os.path.dirname(OUT_BLEND), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
    print(f"SAVED {OUT_BLEND}")
    print(f"PARTS {len(parts)}")


if __name__ == "__main__":
    main()
