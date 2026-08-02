"""VQ1C Visual Polish Gate 3 — validate the polished D4 desk.

Reopens desk-polished.blend in a fresh process.
"""

import bpy
import math
import sys
from mathutils import Vector
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

PATH = (
    PROJECT_ROOT
    / "assets-source"
    / "blender"
    / "vq1c"
    / "polished"
    / "desk-polished.blend"
)

MASTER = Vector((1.433, 0.7654, 0.75))
REQUIRED_PARTS = (
    "DESK_TOP", "DESK_MODESTY_PANEL",
    "DESK_FRAME_LEFT", "DESK_FRAME_RIGHT",
    "DESK_CROSSBAR", "DESK_FEET_L", "DESK_FEET_R",
    "DESK_CABLE_GROMMET",
)
SOCKETS = ("DESK_TOP_ANCHOR", "MONITOR_SOCKET", "KEYBOARD_SOCKET", "LAMP_SOCKET")
MAX_TRIANGLES = 12000


def main():
    bpy.ops.wm.open_mainfile(filepath=str(PATH))
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    fails = []

    root = bpy.data.objects.get("POLISHED_DESK_ROOT")
    if root is None:
        fails.append("POLISHED_DESK_ROOT missing")
    else:
        if abs(root.location.length) > 1e-9:
            fails.append("root location not identity")
        if max(abs(v) for v in root.rotation_euler) > 1e-9:
            fails.append("root rotation not identity")
        if max(abs(v - 1) for v in root.scale) > 1e-9:
            fails.append("root scale not identity")
        toplevel = [o.name for o in bpy.context.scene.objects if o.parent is None]
        if toplevel != ["POLISHED_DESK_ROOT"]:
            fails.append(f"unexpected top-level: {toplevel}")

    for name in REQUIRED_PARTS:
        obj = bpy.data.objects.get(name)
        if obj is None:
            fails.append(f"missing part {name}")
        elif obj.parent is not root:
            fails.append(f"{name} not parented to root")

    # World bounds / center / minZ
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
    print(f"DIMS {tuple(round(v,4) for v in dims)} center {tuple(round(v,4) for v in center)} minZ {minv.z:.4f}")
    for i in range(3):
        drift = abs(dims[i] - MASTER[i]) / MASTER[i]
        print(f"  axis {i}: {dims[i]:.4f} drift {drift*100:.2f}%")
        if drift > 0.03:
            fails.append(f"axis {i} drift {drift*100:.2f}% > 3%")
    if abs(minv.z) > 0.01:
        fails.append(f"minZ {minv.z:.4f} not ~0")
    if abs(center.x) > 0.01:
        fails.append(f"centerX {center.x:.4f}")
    if abs(center.y) > 0.01:
        fails.append(f"centerY {center.y:.4f}")

    # Desk top height ~0.75 and horizontal
    top = bpy.data.objects.get("DESK_TOP")
    if top is not None:
        top_max_z = maxv.z  # top is the highest element
        print(f"DESK_TOP z={top_max_z:.4f}")
        if not 0.72 <= top_max_z <= 0.78:
            fails.append(f"desk top height {top_max_z:.4f} out of 0.72-0.78")
        if abs(top.rotation_euler.x) > 0.01 or abs(top.rotation_euler.y) > 0.01:
            fails.append("DESK_TOP not horizontal")

    # Modesty panel at +Y
    panel = bpy.data.objects.get("DESK_MODESTY_PANEL")
    if panel is not None:
        if panel.location.y < 0:
            fails.append("modesty panel not at +Y")

    # Sockets: exist, within desk top bounds, z == top height
    for name in SOCKETS:
        anchor = bpy.data.objects.get(name)
        if anchor is None:
            fails.append(f"socket missing {name}")
            continue
        if anchor.parent != root:
            fails.append(f"{name} not parented to root")
        if not (minv.x - 0.02 <= anchor.location.x <= maxv.x + 0.02):
            fails.append(f"{name} X outside desk: {anchor.location.x:.4f}")
        if not (minv.y - 0.02 <= anchor.location.y <= maxv.y + 0.02):
            fails.append(f"{name} Y outside desk: {anchor.location.y:.4f}")
        if abs(anchor.location.z - maxv.z) > 0.005:
            fails.append(f"{name} Z {anchor.location.z:.4f} != desk top {maxv.z:.4f}")

    # Stats
    if total_tris > MAX_TRIANGLES:
        fails.append(f"triangles {total_tris} > {MAX_TRIANGLES}")
    print(f"TRIANGLES {total_tris}")
    if empty:
        fails.append(f"empty meshes: {empty}")
    for obj in bpy.data.objects:
        if obj.type in ("CAMERA", "LIGHT"):
            fails.append(f"camera/light: {obj.name}")
        s = obj.matrix_world.to_scale()
        if max(s) - min(s) > 1e-6:
            fails.append(f"non-uniform scale: {obj.name}")
    mat_names = set()
    for obj in meshes:
        for mat in obj.data.materials:
            if mat:
                mat_names.add(mat.name)
    for expected in ("Desk_Wood_Clay", "Desk_Metal_Clay", "Desk_Plastic_Clay"):
        if expected not in mat_names:
            fails.append(f"material missing: {expected}")
    print(f"MATERIALS {sorted(mat_names)}")

    print("VALIDATION " + ("PASS" if not fails else "FAIL: " + "; ".join(fails)))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
