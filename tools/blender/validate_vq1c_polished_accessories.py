"""VQ1C Visual Polish Gate 4 — validate polished monitor/keyboard/lamp.

Reopens each polished blend in a fresh process.
"""

import bpy
import math
import sys
from mathutils import Vector
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

POLISH_DIR = (
    PROJECT_ROOT
    / "assets-source"
    / "blender"
    / "vq1c"
    / "polished"
)

PATHS = {
    "monitor": POLISH_DIR / "monitor-polished.blend",
    "keyboard": POLISH_DIR / "keyboard-polished.blend",
    "lamp": POLISH_DIR / "lamp-polished.blend",
}
MASTERS = {
    "monitor": Vector((0.550, 0.146, 0.412)),
    "keyboard": Vector((0.430, 0.180, 0.042)),
    "lamp": Vector((0.208, 0.376, 0.475)),
}
ROOTS = {
    "monitor": "POLISHED_MONITOR_ROOT",
    "keyboard": "POLISHED_KEYBOARD_ROOT",
    "lamp": "POLISHED_LAMP_ROOT",
}
REQUIRED = {
    "monitor": ("MONITOR_SCREEN_PANEL", "MONITOR_BEZEL", "MONITOR_BACK_SHELL", "MONITOR_NECK", "MONITOR_BASE"),
    "keyboard": ("KEYBOARD_BASE", "KEYBOARD_TOP_PLATE", "KEYBOARD_KEYS_MAIN", "KEYBOARD_KEYS_FUNCTION", "KEYBOARD_SPACEBAR"),
    "lamp": ("LAMP_BASE", "LAMP_LOWER_ARM", "LAMP_JOINT", "LAMP_UPPER_ARM", "LAMP_SHADE", "LAMP_INNER_SHADE"),
}
ANCHORS = {
    "monitor": ("MONITOR_BASE_ANCHOR",),
    "keyboard": ("KEYBOARD_BASE_ANCHOR",),
    "lamp": ("LAMP_BASE_ANCHOR", "LIGHT_DESK_ANCHOR"),
}
MAX_TRI = {"monitor": 6000, "keyboard": 8000, "lamp": 8000}


def validate_one(key):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.ops.wm.open_mainfile(filepath=str(PATHS[key]))
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    fails = []
    master = MASTERS[key]

    root = bpy.data.objects.get(ROOTS[key])
    if root is None:
        fails.append(f"{ROOTS[key]} missing")
    else:
        if abs(root.location.length) > 1e-9:
            fails.append("root location not identity")
        if max(abs(v) for v in root.rotation_euler) > 1e-9:
            fails.append("root rotation not identity")
        if max(abs(v - 1) for v in root.scale) > 1e-9:
            fails.append("root scale not identity")
        toplevel = [o.name for o in bpy.context.scene.objects if o.parent is None]
        if toplevel != [ROOTS[key]]:
            fails.append(f"unexpected top-level: {toplevel}")

    existing_names = set(o.name for o in bpy.data.objects if o.parent is root)
    for name in REQUIRED[key]:
        if name in existing_names:
            continue
        # Allow prefix match for generated keycap rows
        if any(n.startswith(name) for n in existing_names):
            continue
        fails.append(f"missing part {name}")

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
    print(f"[{key}] dims {tuple(round(v,4) for v in dims)} center {tuple(round(v,4) for v in center)} minZ {minv.z:.4f}")
    for i in range(3):
        drift = abs(dims[i] - master[i]) / master[i]
        print(f"  axis {i}: {dims[i]:.4f} drift {drift*100:.2f}%")
        if drift > 0.03:
            fails.append(f"axis {i} drift {drift*100:.2f}% > 3%")
    if abs(minv.z) > 0.01:
        fails.append(f"minZ {minv.z:.4f} not ~0")
    if abs(center.x) > 0.015:
        fails.append(f"centerX {center.x:.4f}")
    if abs(center.y) > 0.02:
        fails.append(f"centerY {center.y:.4f}")
    if total_tris > MAX_TRI[key]:
        fails.append(f"triangles {total_tris} > {MAX_TRI[key]}")
    print(f"[{key}] triangles {total_tris}")
    if empty:
        fails.append(f"empty meshes: {empty}")
    for obj in bpy.data.objects:
        if obj.type in ("CAMERA", "LIGHT"):
            fails.append(f"camera/light: {obj.name}")
        s = obj.matrix_world.to_scale()
        if max(s) - min(s) > 1e-6:
            fails.append(f"non-uniform scale: {obj.name}")

    for name in ANCHORS[key]:
        anchor = bpy.data.objects.get(name)
        if anchor is None:
            fails.append(f"anchor missing {name}")
            continue
        if anchor.parent != root:
            fails.append(f"{name} not parented to root")
        print(f"[{key}] {name} world={tuple(round(v,4) for v in anchor.matrix_world.translation)}")

    # Asset-specific checks
    if key == "lamp":
        base_anchor = bpy.data.objects.get("LAMP_BASE_ANCHOR")
        light_anchor = bpy.data.objects.get("LIGHT_DESK_ANCHOR")
        if base_anchor and light_anchor:
            if light_anchor.location.z <= base_anchor.location.z:
                fails.append("LIGHT_DESK_ANCHOR not above LAMP_BASE_ANCHOR")
            shade = bpy.data.objects.get("LAMP_SHADE")
            if shade:
                dist = (light_anchor.location - shade.location).length
                if dist > 0.08:
                    fails.append(f"LIGHT_DESK_ANCHOR too far from shade: {dist:.4f}")
    if key == "monitor":
        screen = bpy.data.objects.get("MONITOR_SCREEN_PANEL")
        if screen:
            # screen should be near the -Y side
            if screen.location.y > -0.04:
                fails.append(f"screen not on -Y side: y={screen.location.y:.4f}")

    print(f"[{key}] " + ("PASS" if not fails else "FAIL: " + "; ".join(fails)))
    return not fails


def main():
    results = {}
    for key in ("monitor", "keyboard", "lamp"):
        results[key] = validate_one(key)
    for key, ok in results.items():
        print(f"VQ1C_POLISHED_{key.upper()}_VALIDATE_{'OK' if ok else 'FAIL'}")
    if all(results.values()):
        print("VQ1C_POLISHED_ACCESSORIES_VALIDATE_OK")
        sys.exit(0)
    sys.exit(1)


if __name__ == "__main__":
    main()
