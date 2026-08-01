"""VQ1C Gate 4B — validate the canonical Hero Corner blend and its GLB export.

Reopens vq1c-hero-corner.blend and re-imports vq1c-hero-corner.glb in fresh
processes and compares structural stats.
"""

import bpy
import sys
from mathutils import Vector

BLEND_PATH = r"E:\Projects\four-workstations\assets-source\blender\vq1c\vq1c-hero-corner.blend"
GLB_PATH = r"E:\Projects\four-workstations\public\models\vq1\vq1c-hero-corner.glb"

EXPECTED_MESHES = 20
EXPECTED_TRIANGLES = 3954  # arch 168 + workstation 2774 + sofa 1012


def subtree_meshes(obj):
    result = []
    for child in obj.children:
        if child.type == "MESH":
            result.append(child)
        result.extend(subtree_meshes(child))
    return result


def world_bounds(meshes, depsgraph):
    minv = Vector((float("inf"),) * 3)
    maxv = Vector((float("-inf"),) * 3)
    found = False
    for obj in meshes:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            if not mesh.vertices:
                continue
            matrix = evaluated.matrix_world
            for vertex in mesh.vertices:
                point = matrix @ vertex.co
                for i in range(3):
                    minv[i] = min(minv[i], point[i])
                    maxv[i] = max(maxv[i], point[i])
                found = True
        finally:
            evaluated.to_mesh_clear()
    return (minv, maxv) if found else None


def collect_stats(label):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.context.view_layer.update()
    if label == "blend":
        bpy.ops.wm.open_mainfile(filepath=BLEND_PATH)
    else:
        bpy.ops.import_scene.gltf(filepath=GLB_PATH)
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    fails = []

    hero_root = bpy.data.objects.get("VQ1C_HERO_ROOT")
    if hero_root is None:
        fails.append("VQ1C_HERO_ROOT missing")
        return fails, None
    if abs(hero_root.location.length) > 1e-9 or max(abs(v) for v in hero_root.rotation_euler) > 1e-9 or max(abs(v - 1) for v in hero_root.scale) > 1e-9:
        fails.append("VQ1C_HERO_ROOT transform not identity")

    # Top-level must be only the hero root
    toplevel = [o.name for o in bpy.context.scene.objects if o.parent is None]
    if label == "blend" and toplevel != ["VQ1C_HERO_ROOT"]:
        fails.append(f"unexpected top-level objects: {toplevel}")

    # Three hero sub-roots
    sub_roots = {}
    for name in ("HERO_ARCH_ROOT", "HERO_WORKSTATION_ROOT", "HERO_SOFA_ROOT"):
        obj = bpy.data.objects.get(name)
        if obj is None:
            fails.append(f"missing {name}")
            continue
        if obj.parent is not hero_root:
            fails.append(f"{name} not parented to VQ1C_HERO_ROOT")
        sub_roots[name] = obj

    # Mesh / triangle stats
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    if len(meshes) != EXPECTED_MESHES:
        fails.append(f"mesh count {len(meshes)} != {EXPECTED_MESHES}")
    total_tris = 0
    empty = []
    nonuniform = []
    cameras = []
    for obj in bpy.data.objects:
        if obj.type in ("CAMERA", "LIGHT"):
            cameras.append(obj.name)
        s = obj.matrix_world.to_scale()
        if max(s) - min(s) > 1e-6:
            nonuniform.append(obj.name)
        if obj.type != "MESH":
            continue
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            if not mesh.vertices:
                empty.append(obj.name)
            mesh.calc_loop_triangles()
            total_tris += len(mesh.loop_triangles)
        finally:
            evaluated.to_mesh_clear()
    if total_tris != EXPECTED_TRIANGLES:
        fails.append(f"triangles {total_tris} != {EXPECTED_TRIANGLES}")
    if empty:
        fails.append(f"empty meshes: {empty}")
    if nonuniform:
        fails.append(f"non-uniform scale: {nonuniform}")
    if cameras:
        fails.append(f"camera/light: {cameras}")

    # Overall bounds within 5x4 room
    overall = world_bounds(meshes, depsgraph)
    if overall:
        minv, maxv = overall
        dims = maxv - minv
        print(f"[{label}] overall bounds min={tuple(round(v,4) for v in minv)} max={tuple(round(v,4) for v in maxv)}")
        if minv.x < -2.5 - 0.05 or maxv.x > 2.5 + 0.05:
            fails.append(f"overall X out of room: ({minv.x:.3f},{maxv.x:.3f})")
        if minv.y < -2.0 - 0.05 or maxv.y > 2.0 + 0.05:
            fails.append(f"overall Y out of room: ({minv.y:.3f},{maxv.y:.3f})")
        if dims.x > 6 or dims.y > 6 or dims.z > 6:
            fails.append(f"abnormal overall dims {tuple(round(v,3) for v in dims)}")

    # Architecture: floor horizontal at z=0 top, walls vertical
    arch = sub_roots.get("HERO_ARCH_ROOT")
    if arch:
        arch_meshes = subtree_meshes(arch)
        arch_bounds = world_bounds(arch_meshes, depsgraph)
        if arch_bounds:
            minv, maxv = arch_bounds
            if not (-2.51 <= minv.x <= -2.49) or not (2.49 <= maxv.x <= 2.51):
                fails.append(f"arch X extent unexpected: {minv.x:.3f},{maxv.x:.3f}")
            if not (-2.01 <= minv.y <= -1.99) or not (1.99 <= maxv.y <= 2.01):
                fails.append(f"arch Y extent unexpected: {minv.y:.3f},{maxv.y:.3f}")

    # Workstation: inside floor, devices on desk, anchors aligned
    ws = sub_roots.get("HERO_WORKSTATION_ROOT")
    anchors_ok = True
    if ws:
        ws_meshes = subtree_meshes(ws)
        ws_bounds = world_bounds(ws_meshes, depsgraph)
        if ws_bounds:
            minv, maxv = ws_bounds
            print(f"[{label}] workstation bounds min={tuple(round(v,4) for v in minv)} max={tuple(round(v,4) for v in maxv)}")
            if minv.x < -2.0 or maxv.x > 2.0 or minv.y < -1.5 or maxv.y > 1.5:
                fails.append(f"workstation out of floor: {minv.x:.3f},{maxv.y:.3f}")
        # desk top z + anchor alignment
        desk = bpy.data.objects.get("STD_DESK_ROOT")
        monitor_base = bpy.data.objects.get("MONITOR_BASE_ANCHOR")
        monitor_socket = bpy.data.objects.get("MONITOR_SOCKET")
        keyboard_base = bpy.data.objects.get("KEYBOARD_BASE_ANCHOR")
        keyboard_socket = bpy.data.objects.get("KEYBOARD_SOCKET")
        lamp_base = bpy.data.objects.get("LAMP_BASE_ANCHOR")
        lamp_socket = bpy.data.objects.get("LAMP_SOCKET")
        for pair in ((monitor_base, monitor_socket), (keyboard_base, keyboard_socket), (lamp_base, lamp_socket)):
            if pair[0] is None or pair[1] is None:
                fails.append("anchor pair missing")
                anchors_ok = False
                continue
            err = (pair[0].matrix_world.translation - pair[1].matrix_world.translation).length
            print(f"[{label}] anchor pair err={err:.5f}")
            if err > 0.002:
                fails.append(f"anchor misalignment {err:.4f}")
                anchors_ok = False
        light_anchor = bpy.data.objects.get("LIGHT_DESK_ANCHOR")
        if light_anchor is None:
            fails.append("LIGHT_DESK_ANCHOR missing")
        else:
            print(f"[{label}] LIGHT_DESK_ANCHOR world={tuple(round(v,4) for v in light_anchor.matrix_world.translation)}")

    # Sofa: height ~0.766, long axis horizontal, near left wall, faces room
    sofa = sub_roots.get("HERO_SOFA_ROOT")
    if sofa:
        sofa_meshes = subtree_meshes(sofa)
        sofa_bounds = world_bounds(sofa_meshes, depsgraph)
        if sofa_bounds:
            minv, maxv = sofa_bounds
            dims = maxv - minv
            print(f"[{label}] sofa bounds min={tuple(round(v,4) for v in minv)} max={tuple(round(v,4) for v in maxv)}")
            if not 0.70 <= dims.z <= 0.83:
                fails.append(f"sofa height {dims.z:.3f} not ~0.766")
            if not (dims.x > dims.z and dims.y > dims.z):
                fails.append("sofa long axis not horizontal")
            wall_inner = -2.40
            gap = (minv.x - wall_inner) if minv.x > wall_inner else (wall_inner - minv.x)
            # sofa back toward -X means sofa min X is the back; gap = |min_x - wall_inner|
            gap = abs(minv.x - wall_inner)
            print(f"[{label}] sofa wall gap={gap:.4f}")
            if not 0.06 <= gap <= 0.12:
                fails.append(f"sofa wall gap {gap:.4f} not in 0.06-0.12")
            # workstation horizontal clearance
            if ws_bounds:
                ws_minv, ws_maxv = ws_bounds
                clearance = abs(ws_minv.x - maxv.x)
                print(f"[{label}] sofa-workstation clearance={clearance:.4f}")
                if clearance < 0.30:
                    fails.append(f"sofa-workstation clearance {clearance:.4f} < 0.30")
            if abs(minv.z) > 0.02:
                fails.append(f"sofa not grounded: min_z={minv.z:.4f}")

    print(f"[{label}] " + ("PASS" if not fails else "FAIL: " + "; ".join(fails)))
    return fails, (total_tris, len(meshes))


if __name__ == "__main__":
    fails_blend, stats_blend = collect_stats("blend")
    fails_glb, stats_glb = collect_stats("glb")
    if stats_blend and stats_glb and stats_blend != stats_glb:
        print(f"STAT MISMATCH blend={stats_blend} glb={stats_glb}")
        sys.exit(1)
    if fails_blend or fails_glb:
        sys.exit(1)
    print("HERO CORNER VALIDATION PASS")
    sys.exit(0)
