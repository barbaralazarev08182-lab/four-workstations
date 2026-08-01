"""VQ1C Gate 4A — validate the assembled wall-less workstation.

Reopens workstation-standardized.blend in a fresh process and checks:
- STD_WORKSTATION_ROOT identity
- five asset roots present
- three anchor alignment errors <= 0.002m
- monitor/keyboard/lamp bottoms near desk top height (~0.75m)
- monitor & keyboard inside desk top bounds
- chair faces desk, no obvious collision
- total triangles = 2774
- no empty meshes, no non-uniform scale, no camera/light
"""

import bpy
import math
import sys
from mathutils import Vector

PATH = r"E:\Projects\four-workstations\assets-source\blender\vq1c\standardized\workstation-standardized.blend"
EXPECTED_TRIANGLES = 2774

ASSET_ROOTS = ("STD_DESK_ROOT", "STD_CHAIR_ROOT", "STD_MONITOR_ROOT", "STD_KEYBOARD_ROOT", "STD_LAMP_ROOT")
ALIGNMENTS = {
    "monitor": ("MONITOR_BASE_ANCHOR", "MONITOR_SOCKET"),
    "keyboard": ("KEYBOARD_BASE_ANCHOR", "KEYBOARD_SOCKET"),
    "lamp": ("LAMP_BASE_ANCHOR", "LAMP_SOCKET"),
}


def world_mesh_bounds(obj, depsgraph):
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    try:
        if not mesh.vertices:
            return None
        matrix = evaluated.matrix_world
        minimum = Vector((float("inf"),) * 3)
        maximum = Vector((float("-inf"),) * 3)
        for vertex in mesh.vertices:
            point = matrix @ vertex.co
            for i in range(3):
                minimum[i] = min(minimum[i], point[i])
                maximum[i] = max(maximum[i], point[i])
        return minimum, maximum
    finally:
        evaluated.to_mesh_clear()


def subtree_meshes(obj):
    result = []
    for child in obj.children:
        if child.type == "MESH":
            result.append(child)
        result.extend(subtree_meshes(child))
    return result


def main():
    bpy.ops.wm.open_mainfile(filepath=PATH)
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    fails = []

    # 1. Workstation root identity
    root = bpy.data.objects.get("STD_WORKSTATION_ROOT")
    if root is None:
        fails.append("STD_WORKSTATION_ROOT missing")
    else:
        if abs(root.location.length) > 1e-9:
            fails.append("workstation root location not identity")
        if max(abs(v) for v in root.rotation_euler) > 1e-9:
            fails.append("workstation root rotation not identity")
        if max(abs(v - 1) for v in root.scale) > 1e-9:
            fails.append("workstation root scale not identity")
        if root.parent is not None:
            fails.append("workstation root must be top-level")

    # 2. Five asset roots, all parented to workstation root
    asset_roots = {}
    for name in ASSET_ROOTS:
        obj = bpy.data.objects.get(name)
        if obj is None:
            fails.append(f"missing asset root {name}")
            continue
        if obj.parent != root:
            fails.append(f"{name} not parented to workstation root")
        asset_roots[name] = obj

    # 3. Anchor alignments
    for key, (base_name, socket_name) in ALIGNMENTS.items():
        base = bpy.data.objects.get(base_name)
        socket = bpy.data.objects.get(socket_name)
        if base is None or socket is None:
            fails.append(f"anchor missing for {key}: {base_name}/{socket_name}")
            continue
        base_world = base.matrix_world.translation
        socket_world = socket.matrix_world.translation
        error = (base_world - socket_world).length
        print(f"ALIGN {key}: base=({base_world.x:.4f},{base_world.y:.4f},{base_world.z:.4f}) "
              f"socket=({socket_world.x:.4f},{socket_world.y:.4f},{socket_world.z:.4f}) err={error:.4f}")
        if error > 0.002:
            fails.append(f"anchor alignment {key} error {error:.4f} > 0.002")

    # 4. Desk top Z and desk bounds (world space)
    desk_root = asset_roots.get("STD_DESK_ROOT")
    if desk_root is None:
        fails.append("cannot check desk top: desk root missing")
    else:
        desk_meshes = subtree_meshes(desk_root)
        desk_min = Vector((float("inf"),) * 3)
        desk_max = Vector((float("-inf"),) * 3)
        for mesh in desk_meshes:
            bounds = world_mesh_bounds(mesh, depsgraph)
            if bounds is None:
                fails.append(f"empty desk mesh {mesh.name}")
                continue
            for i in range(3):
                desk_min[i] = min(desk_min[i], bounds[0][i])
                desk_max[i] = max(desk_max[i], bounds[1][i])
        desk_top_z = desk_max.z
        print(f"DESK bounds min=({desk_min.x:.4f},{desk_min.y:.4f},{desk_min.z:.4f}) "
              f"max=({desk_max.x:.4f},{desk_max.y:.4f},{desk_max.z:.4f}) top_z={desk_top_z:.4f}")
        if not 0.72 <= desk_top_z <= 0.78:
            fails.append(f"desk top z {desk_top_z:.4f} not ~0.75")

        # Monitor / keyboard / lamp bottoms near desk top
        for key in ("monitor", "keyboard", "lamp"):
            asset_root = asset_roots.get(f"STD_{key.upper()}_ROOT")
            if asset_root is None:
                continue
            meshes = subtree_meshes(asset_root)
            min_z = float("inf")
            for mesh in meshes:
                bounds = world_mesh_bounds(mesh, depsgraph)
                if bounds:
                    min_z = min(min_z, bounds[0].z)
            print(f"{key.upper()} min_z={min_z:.4f}")
            if abs(min_z - desk_top_z) > 0.02:
                fails.append(f"{key} bottom z {min_z:.4f} not at desk top {desk_top_z:.4f}")

        # Monitor & keyboard inside desk top bounds
        for key in ("monitor", "keyboard"):
            asset_root = asset_roots.get(f"STD_{key.upper()}_ROOT")
            if asset_root is None:
                continue
            meshes = subtree_meshes(asset_root)
            min_x, max_x = float("inf"), float("-inf")
            min_y, max_y = float("inf"), float("-inf")
            for mesh in meshes:
                bounds = world_mesh_bounds(mesh, depsgraph)
                if bounds:
                    min_x = min(min_x, bounds[0].x); max_x = max(max_x, bounds[1].x)
                    min_y = min(min_y, bounds[0].y); max_y = max(max_y, bounds[1].y)
            inside_x = (min_x >= desk_min.x - 0.01) and (max_x <= desk_max.x + 0.01)
            inside_y = (min_y >= desk_min.y - 0.01) and (max_y <= desk_max.y + 0.01)
            print(f"{key.upper()} x=({min_x:.4f},{max_x:.4f}) y=({min_y:.4f},{max_y:.4f}) "
                  f"inside_desk={inside_x and inside_y}")
            if not (inside_x and inside_y):
                fails.append(f"{key} outside desk top bounds")

    # 5. Chair: faces desk (front toward +Y), no collision
    chair_root = asset_roots.get("STD_CHAIR_ROOT")
    if chair_root is not None:
        chair_meshes = subtree_meshes(chair_root)
        chair_min = Vector((float("inf"),) * 3)
        chair_max = Vector((float("-inf"),) * 3)
        for mesh in chair_meshes:
            bounds = world_mesh_bounds(mesh, depsgraph)
            if bounds:
                for i in range(3):
                    chair_min[i] = min(chair_min[i], bounds[0][i])
                    chair_max[i] = max(chair_max[i], bounds[1][i])
        print(f"CHAIR bounds min=({chair_min.x:.4f},{chair_min.y:.4f},{chair_min.z:.4f}) "
              f"max=({chair_max.x:.4f},{chair_max.y:.4f},{chair_max.z:.4f})")
        # After 180deg rotation, the chair back is at -Y and front faces +Y (desk side)
        front_edge_y = chair_max.y
        desk_front_y = desk_min.y if desk_root else None
        if desk_front_y is not None:
            clearance = desk_front_y - front_edge_y
            print(f"CHAIR front_edge_y={front_edge_y:.4f} desk_front_y={desk_front_y:.4f} clearance={clearance:.4f}")
            if clearance < 0.05:
                fails.append(f"chair collides with desk: clearance {clearance:.4f}")
            if abs(chair_root.rotation_euler[2] - math.pi) > 0.01:
                fails.append(f"chair rotation_z={chair_root.rotation_euler[2]:.4f} not pi")
        if abs(chair_min.z) > 0.02:
            fails.append(f"chair not grounded: min_z={chair_min.z:.4f}")

    # 6. Total triangles
    total_triangles = 0
    empty_meshes = []
    non_uniform = []
    cameras_lights = []
    for obj in bpy.data.objects:
        if obj.type in ("CAMERA", "LIGHT"):
            cameras_lights.append(obj.name)
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-6:
            non_uniform.append((obj.name, tuple(round(s, 6) for s in scale)))
        if obj.type != "MESH":
            continue
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            if not mesh.vertices:
                empty_meshes.append(obj.name)
            mesh.calc_loop_triangles()
            total_triangles += len(mesh.loop_triangles)
        finally:
            evaluated.to_mesh_clear()
    print(f"TOTAL_TRIANGLES {total_triangles}")
    if total_triangles != EXPECTED_TRIANGLES:
        fails.append(f"triangles {total_triangles} != {EXPECTED_TRIANGLES}")
    if empty_meshes:
        fails.append(f"empty meshes: {empty_meshes}")
    if non_uniform:
        fails.append(f"non-uniform scale: {non_uniform}")
    if cameras_lights:
        fails.append(f"camera/light present: {cameras_lights}")

    # 7. LIGHT_DESK_ANCHOR preserved
    light_anchor = bpy.data.objects.get("LIGHT_DESK_ANCHOR")
    if light_anchor is None:
        fails.append("LIGHT_DESK_ANCHOR missing")
    else:
        print(f"LIGHT_DESK_ANCHOR world=({light_anchor.matrix_world.translation.x:.4f},"
              f"{light_anchor.matrix_world.translation.y:.4f},{light_anchor.matrix_world.translation.z:.4f})")

    print("VALIDATION " + ("PASS" if not fails else "FAIL: " + "; ".join(fails)))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
