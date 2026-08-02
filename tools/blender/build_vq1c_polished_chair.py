"""VQ1C Visual Polish Gate 2 — rebuild C1 OfficeChair as separate polished parts.

Input:  assets-source/blender/vq1c/standardized/chair-standardized.blend (read-only reference)
Output: assets-source/blender/vq1c/polished/chair-polished.blend

Canonical constraints (from the standardized master):
  X width ~0.609, Y depth ~0.682, Z height ~0.952, seat top ~0.52,
  front faces -Y, backrest at +Y, minZ=0, horizontal center ~(0,0).
  Dimensional drift allowed: <= 3% per axis.
"""

import bpy
import math
import os
from mathutils import Matrix, Vector

STD_CHAIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "assets-source", "blender", "vq1c", "standardized", "chair-standardized.blend"))
OUT_BLEND = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "assets-source", "blender", "vq1c", "polished", "chair-polished.blend"))

# Target dims (must stay within 3% of master 0.6093 / 0.6815 / 0.952)
TARGET_X = 0.62
TARGET_Y = 0.66
TARGET_Z = 0.94
SEAT_Z = 0.52


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


def _bake(obj, scale=None, rot_z=None, rot_x=None):
    """Bake scale/rotation into mesh data directly (keeps object location intact)."""
    matrix = Matrix.Identity(4)
    if scale is not None:
        matrix = Matrix.Diagonal((scale[0], scale[1], scale[2], 1.0)).to_4x4()
    if rot_z:
        matrix = matrix @ Matrix.Rotation(rot_z, 4, "Z")
    if rot_x:
        matrix = matrix @ Matrix.Rotation(rot_x, 4, "X")
    obj.data.transform(matrix)
    obj.scale = (1.0, 1.0, 1.0)
    obj.rotation_euler = (0.0, 0.0, 0.0)
    bpy.context.view_layer.update()
    return obj


def add_box(name, size, center, material, bevel=None, subsurf=0, shade_smooth=True, rot_z=None, rot_x=None):
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
    if subsurf:
        mod = obj.modifiers.new("Subsurf", "SUBSURF")
        mod.levels = subsurf
        mod.render_levels = subsurf
    if shade_smooth:
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


def add_sphere(name, radius, center, material, subsurf=1, verts=(10, 8)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=center, segments=verts[0], ring_count=verts[1])
    obj = bpy.context.active_object
    obj.name = name
    if subsurf:
        mod = obj.modifiers.new("Subsurf", "SUBSURF")
        mod.levels = subsurf
        mod.render_levels = subsurf
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(material)
    return obj


def apply_modifiers(obj):
    for mod in list(obj.modifiers):
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)


def main():
    clear_scene()

    fabric = new_material("Chair_Fabric_Clay", (0.62, 0.60, 0.56), 0.85)
    plastic = new_material("Chair_Plastic_Clay", (0.72, 0.71, 0.68), 0.50)
    metal = new_material("Chair_Metal_Clay", (0.55, 0.54, 0.52), 0.30, 0.6)

    root = bpy.data.objects.new("POLISHED_CHAIR_ROOT", None)
    bpy.context.collection.objects.link(root)
    root.location = (0.0, 0.0, 0.0)
    root.rotation_euler = (0.0, 0.0, 0.0)
    root.scale = (1.0, 1.0, 1.0)

    parts = []

    # ---- SEAT CUSHION (soft) ----
    seat_w, seat_d, seat_t = 0.50, 0.52, 0.08
    seat_cy = -0.075
    seat = add_box("CHAIR_SEAT_CUSHION", (seat_w, seat_d, seat_t), (0.0, seat_cy, SEAT_Z - seat_t / 2),
                   fabric, bevel=0.028, subsurf=1)
    # Light center depression + edge lift on the top face via bmesh edit
    bpy.context.view_layer.objects.active = seat
    bpy.ops.object.mode_set(mode="EDIT")
    import bmesh
    bm = bmesh.from_edit_mesh(seat.data)
    for v in bm.verts:
        if v.co.z > (SEAT_Z - 0.01):
            v.select = True
    bpy.ops.transform.translate(value=(0, 0, 0.006))
    bm = bmesh.from_edit_mesh(seat.data)
    for v in bm.verts:
        v.select = False
    for v in bm.verts:
        if v.co.z > (SEAT_Z - 0.004) and abs(v.co.x) < 0.12 and abs(v.co.y - seat_cy) < 0.10:
            v.select = True
    bpy.ops.transform.translate(value=(0, 0, -0.008))
    bpy.ops.object.mode_set(mode="OBJECT")
    apply_modifiers(seat)
    parts.append(seat)

    # ---- BACK CUSHION (soft, tilted ~4 deg) ----
    back_w, back_t, back_h = 0.46, 0.10, 0.50
    back_cy = 0.285
    back_cz = 0.50 + back_h / 2 - 0.06  # bottom near seat rear, top ~0.94
    back = add_box("CHAIR_BACK_CUSHION", (back_w, back_t, back_h), (0.0, back_cy, back_cz),
                   fabric, bevel=0.03, subsurf=1, rot_x=math.radians(4))
    apply_modifiers(back)
    parts.append(back)

    # ---- SUPPORT FRAME (hard) ----
    frame = add_box("CHAIR_SUPPORT_FRAME", (0.44, 0.34, 0.05), (0.0, -0.02, SEAT_Z - 0.09),
                    plastic, bevel=0.012)
    apply_modifiers(frame)
    parts.append(frame)

    # ---- ARMS (hard) ----
    arm_w, arm_h = 0.055, 0.05
    arm_y0, arm_y1 = -0.215, 0.235
    arm_z = 0.62
    for side in (-1, 1):
        arm_top = add_box(f"CHAIR_ARM_{'LEFT' if side < 0 else 'RIGHT'}",
                          (arm_w, arm_y1 - arm_y0, arm_h),
                          (side * 0.285, (arm_y0 + arm_y1) / 2, arm_z),
                          plastic, bevel=0.01)
        apply_modifiers(arm_top)
        post = add_cylinder(f"CHAIR_ARM_POST_{'L' if side < 0 else 'R'}",
                            0.016, 0.24, (side * 0.28, 0.0, SEAT_Z - 0.10),
                            plastic, bevel=0.004, verts=16)
        apply_modifiers(post)
        parts.extend([arm_top, post])

    # ---- COLUMN (hard) ----
    column = add_cylinder("CHAIR_COLUMN", 0.035, 0.38, (0.0, 0.0, 0.05 + 0.19), metal, bevel=0.006, verts=24)
    apply_modifiers(column)
    parts.append(column)

    # ---- STAR BASE (hard) ----
    base_z = 0.035
    for i in range(5):
        angle = i * (2 * math.pi / 5) - math.pi / 2
        arm_len = 0.17
        cx = math.cos(angle) * arm_len
        cy = math.sin(angle) * arm_len
        arm = add_box(f"CHAIR_STAR_BASE_ARM_{i + 1}", (arm_len, 0.05, 0.03),
                      (cx, cy, base_z), plastic, bevel=0.008, rot_z=angle)
        apply_modifiers(arm)
        parts.append(arm)
    hub = add_cylinder("CHAIR_STAR_BASE_HUB", 0.05, 0.035, (0.0, 0.0, base_z), plastic, verts=20)
    parts.append(hub)

    # ---- CASTERS (one mesh each but kept as separate named parts) ----
    for i in range(5):
        angle = i * (2 * math.pi / 5) - math.pi / 2
        arm_len = 0.17
        cx = math.cos(angle) * arm_len
        cy = math.sin(angle) * arm_len
        caster = add_sphere(f"CHAIR_CASTER_{i + 1}", 0.022, (cx, cy, 0.013), metal, subsurf=1, verts=(12, 8))
        apply_modifiers(caster)
        parts.append(caster)

    # Parent everything under the polished root, preserving world transforms
    for obj in parts:
        world = obj.matrix_world.copy()
        obj.parent = root
        obj.matrix_world = world
    bpy.context.view_layer.update()

    # Seat anchor at seat top center
    anchor = bpy.data.objects.new("CHAIR_SEAT_ANCHOR", None)
    bpy.context.collection.objects.link(anchor)
    anchor.parent = root
    anchor.location = (0.0, seat_cy, SEAT_Z)
    anchor.rotation_euler = (0.0, 0.0, 0.0)
    anchor.scale = (1.0, 1.0, 1.0)
    anchor.empty_display_type = "SPHERE"
    anchor.empty_display_size = 0.03

    os.makedirs(os.path.dirname(OUT_BLEND), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
    print(f"SAVED {OUT_BLEND}")
    print(f"PARTS {len(parts)}")


if __name__ == "__main__":
    main()
