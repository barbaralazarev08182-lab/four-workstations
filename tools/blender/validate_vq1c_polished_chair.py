"""VQ1C Visual Polish Gate 2 — validate the polished C1 chair.

Reopens chair-polished.blend in a fresh process and checks structure,
canonical constraints, materials and statistics.
"""

import bpy
import math
import sys
from mathutils import Vector

PATH = r"E:\Projects\four-workstations\assets-source\blender\vq1c\polished\chair-polished.blend"

MASTER_DIMS = Vector((0.6093, 0.6815, 0.9520))
REQUIRED_PARTS = (
    "CHAIR_SEAT_CUSHION", "CHAIR_BACK_CUSHION",
    "CHAIR_ARM_LEFT", "CHAIR_ARM_RIGHT",
    "CHAIR_SUPPORT_FRAME", "CHAIR_COLUMN",
    "CHAIR_STAR_BASE_HUB", "CHAIR_CASTER_1",
)
MAX_TRIANGLES = 20000


def main():
    bpy.ops.wm.open_mainfile(filepath=PATH)
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    fails = []

    root = bpy.data.objects.get("POLISHED_CHAIR_ROOT")
    if root is None:
        fails.append("POLISHED_CHAIR_ROOT missing")
    else:
        if abs(root.location.length) > 1e-9:
            fails.append("root location not identity")
        if max(abs(v) for v in root.rotation_euler) > 1e-9:
            fails.append("root rotation not identity")
        if max(abs(v - 1) for v in root.scale) > 1e-9:
            fails.append("root scale not identity")
        toplevel = [o.name for o in bpy.context.scene.objects if o.parent is None]
        if toplevel != ["POLISHED_CHAIR_ROOT"]:
            fails.append(f"unexpected top-level objects: {toplevel}")

    # Required parts
    for name in REQUIRED_PARTS:
        obj = bpy.data.objects.get(name)
        if obj is None:
            fails.append(f"missing part {name}")
        elif obj.parent is not root:
            fails.append(f"{name} not parented to root")

    # Seat and back must be separate meshes
    seat = bpy.data.objects.get("CHAIR_SEAT_CUSHION")
    back = bpy.data.objects.get("CHAIR_BACK_CUSHION")
    if seat is None or back is None:
        fails.append("seat/back missing for separation check")
    elif seat.data == back.data:
        fails.append("seat and back share the same mesh data (not separate)")

    # World bounds, center, minZ
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    minv = Vector((float("inf"),) * 3)
    maxv = Vector((float("-inf"),) * 3)
    total_tris = 0
    empty = []
    for obj in meshes:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            if not mesh.vertices:
                empty.append(obj.name)
                continue
            matrix = evaluated.matrix_world
            for vertex in mesh.vertices:
                point = matrix @ vertex.co
                for i in range(3):
                    minv[i] = min(minv[i], point[i])
                    maxv[i] = max(maxv[i], point[i])
            mesh.calc_loop_triangles()
            total_tris += len(mesh.loop_triangles)
        finally:
            evaluated.to_mesh_clear()
    dims = maxv - minv
    center = (minv + maxv) * 0.5
    print(f"DIMS {tuple(round(v, 4) for v in dims)} center {tuple(round(v, 4) for v in center)} minZ {minv.z:.4f}")

    for i in range(3):
        drift = abs(dims[i] - MASTER_DIMS[i]) / MASTER_DIMS[i]
        print(f"  axis {i}: {dims[i]:.4f} drift {drift * 100:.2f}%")
        if drift > 0.03:
            fails.append(f"axis {i} drift {drift * 100:.2f}% > 3%")
    if abs(minv.z) > 0.01:
        fails.append(f"minZ {minv.z:.4f} not ~0")
    if abs(center.x) > 0.01:
        fails.append(f"centerX {center.x:.4f}")
    if abs(center.y) > 0.01:
        fails.append(f"centerY {center.y:.4f}")

    if total_tris > MAX_TRIANGLES:
        fails.append(f"triangles {total_tris} > {MAX_TRIANGLES}")
    print(f"TRIANGLES {total_tris}")
    if empty:
        fails.append(f"empty meshes: {empty}")

    # Front faces -Y / backrest at +Y: back cushion center should be at +Y
    if back is not None:
        back_center_y = (back.matrix_world.translation.y + back.dimensions.y / 2) if back.dimensions.y else 0
        print(f"BACK rear edge y={back_center_y:.4f}")
        if back_center_y < 0.25:
            fails.append(f"backrest not at +Y: rear y={back_center_y:.4f}")

    # Seat height ~0.52 (anchor + seat top)
    anchor = bpy.data.objects.get("CHAIR_SEAT_ANCHOR")
    if anchor is None:
        fails.append("CHAIR_SEAT_ANCHOR missing")
    else:
        if anchor.parent != root:
            fails.append("CHAIR_SEAT_ANCHOR not parented to root")
        print(f"SEAT_ANCHOR z={anchor.location.z:.4f}")
        if not 0.43 <= anchor.location.z <= 0.52:
            fails.append(f"seat anchor z {anchor.location.z:.4f} out of range")

    # Column vertical (rotation ~0 around X/Y), star base horizontal
    column = bpy.data.objects.get("CHAIR_COLUMN")
    if column is not None:
        rot = column.matrix_world.to_euler()
        print(f"COLUMN rotation=({math.degrees(rot.x):.2f},{math.degrees(rot.y):.2f},{math.degrees(rot.z):.2f})")
        if abs(rot.x) > 0.05 or abs(rot.y) > 0.05:
            fails.append("column not vertical")

    # Star base horizontal (hub at low z)
    hub = bpy.data.objects.get("CHAIR_STAR_BASE_HUB")
    if hub is not None:
        print(f"STAR_BASE hub z={hub.location.z:.4f}")
        if hub.location.z < 0.01 or hub.location.z > 0.12:
            fails.append(f"star base height unexpected: {hub.location.z:.4f}")

    # No camera/light, no non-uniform scale
    for obj in bpy.data.objects:
        if obj.type in ("CAMERA", "LIGHT"):
            fails.append(f"camera/light present: {obj.name}")
        s = obj.matrix_world.to_scale()
        if max(s) - min(s) > 1e-6:
            fails.append(f"non-uniform scale: {obj.name}")

    # Materials present
    mat_names = set()
    for obj in meshes:
        for mat in obj.data.materials:
            if mat:
                mat_names.add(mat.name)
    for expected in ("Chair_Fabric_Clay", "Chair_Plastic_Clay", "Chair_Metal_Clay"):
        if expected not in mat_names:
            fails.append(f"material missing: {expected}")
    print(f"MATERIALS {sorted(mat_names)}")

    print("VALIDATION " + ("PASS" if not fails else "FAIL: " + "; ".join(fails)))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
