"""VQ1C Visual Polish Gate 4 — rebuild Monitor / Keyboard / Lamp as polished parts.

Inputs (read-only): standardized monitor/keyboard/lamp blends
Outputs:
  assets-source/blender/vq1c/polished/monitor-polished.blend
  assets-source/blender/vq1c/polished/keyboard-polished.blend
  assets-source/blender/vq1c/polished/lamp-polished.blend
"""

import bpy
import math
import os
import sys
from mathutils import Matrix, Vector

POLISH_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "assets-source", "blender", "vq1c", "polished"))

OUT = {
    "monitor": os.path.join(POLISH_DIR, "monitor-polished.blend"),
    "keyboard": os.path.join(POLISH_DIR, "keyboard-polished.blend"),
    "lamp": os.path.join(POLISH_DIR, "lamp-polished.blend"),
}

MASTERS = {
    "monitor": Vector((0.550, 0.146, 0.412)),
    "keyboard": Vector((0.430, 0.180, 0.042)),
    "lamp": Vector((0.208, 0.376, 0.475)),
}


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


def _bake(obj, scale=None, rot_z=None, rot_x=None, rot_y=None):
    matrix = Matrix.Identity(4)
    if scale is not None:
        matrix = Matrix.Diagonal((scale[0], scale[1], scale[2], 1.0)).to_4x4()
    if rot_z:
        matrix = matrix @ Matrix.Rotation(rot_z, 4, "Z")
    if rot_x:
        matrix = matrix @ Matrix.Rotation(rot_x, 4, "X")
    if rot_y:
        matrix = matrix @ Matrix.Rotation(rot_y, 4, "Y")
    obj.data.transform(matrix)
    obj.scale = (1.0, 1.0, 1.0)
    obj.rotation_euler = (0.0, 0.0, 0.0)
    bpy.context.view_layer.update()
    return obj


def add_box(name, size, center, material, bevel=None, rot_z=None, rot_x=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.0, 0.0, 0.0))
    obj = bpy.context.active_object
    obj.name = name
    _bake(obj, scale=size, rot_z=rot_z, rot_x=rot_x)
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


def add_cone(name, radius_top, radius_bottom, height, center, material, bevel=None, verts=24):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=radius_top, radius2=radius_bottom, depth=height,
                                    location=(0.0, 0.0, 0.0))
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


def add_sphere(name, radius, center, material, verts=(12, 9)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=center, segments=verts[0], ring_count=verts[1])
    obj = bpy.context.active_object
    obj.name = name
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(material)
    return obj


def apply_modifiers(obj):
    for mod in list(obj.modifiers):
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)


def make_root(name):
    root = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(root)
    root.location = (0.0, 0.0, 0.0)
    root.rotation_euler = (0.0, 0.0, 0.0)
    root.scale = (1.0, 1.0, 1.0)
    return root


def add_anchor(root, name, position):
    anchor = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(anchor)
    anchor.parent = root
    anchor.location = position
    anchor.rotation_euler = (0.0, 0.0, 0.0)
    anchor.scale = (1.0, 1.0, 1.0)
    anchor.empty_display_type = "SPHERE"
    anchor.empty_display_size = 0.03


def parent_all(root, parts):
    for obj in parts:
        world = obj.matrix_world.copy()
        obj.parent = root
        obj.matrix_world = world
    bpy.context.view_layer.update()


def build_monitor():
    plastic = new_material("Monitor_Plastic_Clay", (0.66, 0.65, 0.62), 0.50)
    metal = new_material("Monitor_Metal_Clay", (0.55, 0.54, 0.52), 0.32, 0.6)
    screen_mat = new_material("Monitor_Screen_Clay", (0.18, 0.19, 0.21), 0.30)

    root = make_root("POLISHED_MONITOR_ROOT")
    parts = []

    # Screen panel (front, -Y face)
    screen = add_box("MONITOR_SCREEN_PANEL", (0.48, 0.012, 0.26), (0.0, -0.066, 0.26), screen_mat, bevel=0.002)
    apply_modifiers(screen)
    parts.append(screen)

    # Bezel frame
    bezel = add_box("MONITOR_BEZEL", (0.55, 0.022, 0.30), (0.0, -0.058, 0.26), plastic, bevel=0.004)
    apply_modifiers(bezel)
    parts.append(bezel)

    # Back shell
    shell = add_box("MONITOR_BACK_SHELL", (0.55, 0.12, 0.30), (0.0, 0.012, 0.26), plastic, bevel=0.005)
    apply_modifiers(shell)
    parts.append(shell)

    # Neck (stand connector)
    neck = add_box("MONITOR_NECK", (0.07, 0.05, 0.22), (0.0, 0.012, 0.14), metal, bevel=0.004)
    apply_modifiers(neck)
    parts.append(neck)

    # Base
    base = add_box("MONITOR_BASE", (0.30, 0.11, 0.025), (0.0, -0.02, 0.0125), metal, bevel=0.005)
    apply_modifiers(base)
    parts.append(base)

    # Small button on bezel
    button = add_box("MONITOR_BUTTON", (0.02, 0.006, 0.012), (0.24, -0.055, 0.18), plastic, bevel=0.002)
    apply_modifiers(button)
    parts.append(button)

    parent_all(root, parts)
    # Anchor at base front-bottom (canonical semantics: (0.008, -0.070, 0))
    add_anchor(root, "MONITOR_BASE_ANCHOR", (0.008, -0.070, 0.0))
    return root, parts


def build_keyboard():
    plastic = new_material("Keyboard_Plastic_Clay", (0.66, 0.65, 0.62), 0.48)
    keycap_mat = new_material("Keyboard_Keycap_Clay", (0.62, 0.60, 0.57), 0.55)

    root = make_root("POLISHED_KEYBOARD_ROOT")
    parts = []

    # Base
    base = add_box("KEYBOARD_BASE", (0.43, 0.18, 0.014), (0.0, 0.0, 0.007), plastic, bevel=0.004)
    apply_modifiers(base)
    parts.append(base)

    # Top plate
    plate = add_box("KEYBOARD_TOP_PLATE", (0.43, 0.18, 0.010), (0.0, 0.0, 0.019), plastic, bevel=0.004)
    apply_modifiers(plate)
    parts.append(plate)

    # Keycaps: main rows (3 rows x 7), function row, modifiers, spacebar
    key_z = 0.034  # keycap top ~0.042
    key_h = 0.016
    main_rows = [0.045, 0.015, -0.015]
    main_x = [-0.15, -0.10, -0.05, 0.0, 0.05, 0.10, 0.15]
    for i, y in enumerate(main_rows):
        for j, x in enumerate(main_x):
            key = add_box(f"KEYBOARD_KEYS_MAIN_{i}_{j}", (0.028, 0.022, key_h), (x, y, key_z), keycap_mat, bevel=0.003)
            apply_modifiers(key)
            parts.append(key)
    # Function row
    fn_x = [-0.15, -0.10, -0.05, 0.0, 0.05, 0.10, 0.15]
    for j, x in enumerate(fn_x):
        key = add_box(f"KEYBOARD_KEYS_FUNCTION_{j}", (0.026, 0.018, key_h), (x, 0.075, key_z), keycap_mat, bevel=0.003)
        apply_modifiers(key)
        parts.append(key)
    # Modifier keys (left/right of spacebar)
    for x in (-0.12, 0.12):
        key = add_box(f"KEYBOARD_KEYS_MODIFIER_{x}", (0.05, 0.022, key_h), (x, -0.048, key_z), keycap_mat, bevel=0.003)
        apply_modifiers(key)
        parts.append(key)
    # Spacebar
    space = add_box("KEYBOARD_SPACEBAR", (0.16, 0.022, key_h), (0.0, -0.048, key_z), keycap_mat, bevel=0.004)
    apply_modifiers(space)
    parts.append(space)

    parent_all(root, parts)
    add_anchor(root, "KEYBOARD_BASE_ANCHOR", (0.0, 0.0, 0.0))
    return root, parts


def build_lamp():
    metal = new_material("Lamp_Metal_Clay", (0.55, 0.54, 0.52), 0.30, 0.6)
    plastic = new_material("Lamp_Plastic_Clay", (0.62, 0.61, 0.58), 0.50)
    inner = new_material("Lamp_Inner_Clay", (0.85, 0.84, 0.80), 0.60)

    root = make_root("POLISHED_LAMP_ROOT")
    parts = []

    # Base (weighty, wide enough to set X=0.208)
    base = add_box("LAMP_BASE", (0.208, 0.26, 0.035), (0.0, 0.06, 0.0175), metal, bevel=0.008)
    apply_modifiers(base)
    parts.append(base)

    # Lower arm
    arm_low = add_cylinder("LAMP_LOWER_ARM", 0.018, 0.20, (0.0, 0.06, 0.135), metal, bevel=0.004, verts=16)
    apply_modifiers(arm_low)
    parts.append(arm_low)

    # Joint
    joint = add_sphere("LAMP_JOINT", 0.026, (0.0, 0.06, 0.235), metal)
    parts.append(joint)

    # Upper arm angled forward toward shade
    arm_up = add_box("LAMP_UPPER_ARM", (0.024, 0.23, 0.024), (0.0, -0.035, 0.335), metal, bevel=0.003,
                     rot_x=math.radians(45))
    apply_modifiers(arm_up)
    parts.append(arm_up)

    # Shade (outer cone, top reaches 0.475)
    shade = add_cone("LAMP_SHADE", 0.05, 0.085, 0.12, (0.0, -0.10, 0.415), metal, bevel=0.004, verts=28)
    apply_modifiers(shade)
    parts.append(shade)

    # Inner shade
    inner_shade = add_cone("LAMP_INNER_SHADE", 0.042, 0.07, 0.09, (0.0, -0.10, 0.41), inner, verts=24)
    parts.append(inner_shade)

    # Switch on base
    switch = add_box("LAMP_SWITCH", (0.02, 0.01, 0.008), (0.07, 0.15, 0.04), plastic, bevel=0.002)
    apply_modifiers(switch)
    parts.append(switch)

    parent_all(root, parts)
    add_anchor(root, "LAMP_BASE_ANCHOR", (0.0, 0.06, 0.0))
    add_anchor(root, "LIGHT_DESK_ANCHOR", (0.0, -0.10, 0.45))
    return root, parts


def main():
    builders = {
        "monitor": build_monitor,
        "keyboard": build_keyboard,
        "lamp": build_lamp,
    }
    for key, builder in builders.items():
        clear_scene()
        root, parts = builder()
        os.makedirs(POLISH_DIR, exist_ok=True)
        bpy.ops.wm.save_as_mainfile(filepath=OUT[key])
        print(f"SAVED {OUT[key]} PARTS {len(parts)}")


if __name__ == "__main__":
    main()
