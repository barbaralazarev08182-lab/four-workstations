"""Validate either the polished Hero Corner Blend or a clean GLB re-import."""

import argparse
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_BLEND = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "polished", "vq1c-hero-corner-polished.blend")
DEFAULT_GLB = os.path.join(REPO_ROOT, "public", "models", "vq1", "vq1c-hero-corner-polished.glb")
DEFAULT_REFERENCE = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "vq1c-hero-corner.blend")
ROOTS = {
    "architecture": ("HERO_ARCH_ROOT", 14, 168),
    "workstation": ("POLISHED_WORKSTATION_ROOT", 73, 12544),
    "sofa": ("POLISHED_SOFA_ROOT", 9, 5664),
}
EXPECTED_MESHES = 96
EXPECTED_TRIANGLES = 18376
ALIGNMENTS = (
    ("MONITOR_BASE_ANCHOR", "MONITOR_SOCKET"),
    ("KEYBOARD_BASE_ANCHOR", "KEYBOARD_SOCKET"),
    ("LAMP_BASE_ANCHOR", "LAMP_SOCKET"),
)
ANCHOR_OWNERS = {
    "DESK_TOP_ANCHOR": "POLISHED_DESK_ROOT", "MONITOR_SOCKET": "POLISHED_DESK_ROOT",
    "KEYBOARD_SOCKET": "POLISHED_DESK_ROOT", "LAMP_SOCKET": "POLISHED_DESK_ROOT",
    "CHAIR_SEAT_ANCHOR": "POLISHED_CHAIR_ROOT", "MONITOR_BASE_ANCHOR": "POLISHED_MONITOR_ROOT",
    "KEYBOARD_BASE_ANCHOR": "POLISHED_KEYBOARD_ROOT", "LAMP_BASE_ANCHOR": "POLISHED_LAMP_ROOT",
    "LIGHT_DESK_ANCHOR": "POLISHED_LAMP_ROOT",
}
WORKSTATION_ROOTS = (
    "POLISHED_DESK_ROOT", "POLISHED_CHAIR_ROOT", "POLISHED_MONITOR_ROOT",
    "POLISHED_KEYBOARD_ROOT", "POLISHED_LAMP_ROOT",
)
FORBIDDEN = {
    "VQ1C_HERO_ROOT", "HERO_WORKSTATION_ROOT", "HERO_SOFA_ROOT",
    "STD_WORKSTATION_ROOT", "STD_SOFA_ROOT", "STD_DESK_ROOT", "STD_CHAIR_ROOT",
    "STD_MONITOR_ROOT", "STD_KEYBOARD_ROOT", "STD_LAMP_ROOT",
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("blend", "glb"), required=True)
    parser.add_argument("--blend", default=DEFAULT_BLEND)
    parser.add_argument("--glb", default=DEFAULT_GLB)
    parser.add_argument("--reference", default=DEFAULT_REFERENCE)
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(argv)


def descendants(root):
    result = []
    stack = list(root.children)
    while stack:
        obj = stack.pop()
        result.append(obj)
        stack.extend(obj.children)
    return result


def is_descendant(obj, root):
    current = obj
    while current is not None:
        if current is root:
            return True
        current = current.parent
    return False


def matrix_error(left, right):
    return max(abs(left[row][column] - right[row][column]) for row in range(4) for column in range(4))


def world_bounds(objects, depsgraph):
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    found = False
    for obj in objects:
        if obj.type != "MESH":
            continue
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            for vertex in mesh.vertices:
                point = evaluated.matrix_world @ vertex.co
                for axis in range(3):
                    minimum[axis] = min(minimum[axis], point[axis])
                    maximum[axis] = max(maximum[axis], point[axis])
                found = True
        finally:
            evaluated.to_mesh_clear()
    return (minimum, maximum) if found else None


def stats(root, depsgraph):
    meshes = [obj for obj in descendants(root) if obj.type == "MESH"]
    triangles = 0
    empty = []
    for obj in meshes:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            if not mesh.vertices:
                empty.append(obj.name)
            mesh.calc_loop_triangles()
            triangles += len(mesh.loop_triangles)
        finally:
            evaluated.to_mesh_clear()
    return len(meshes), triangles, empty


def read_reference(path):
    bpy.ops.wm.open_mainfile(filepath=path)
    hero = bpy.data.objects.get("VQ1C_HERO_ROOT")
    if hero is None:
        raise RuntimeError("Reference VQ1C_HERO_ROOT missing")
    result = {}
    for key, name in {
        "architecture": "HERO_ARCH_ROOT", "workstation": "HERO_WORKSTATION_ROOT", "sofa": "HERO_SOFA_ROOT"
    }.items():
        obj = bpy.data.objects.get(name)
        if obj is None:
            raise RuntimeError(f"Reference {name} missing")
        result[key] = (hero.matrix_world.inverted() @ obj.matrix_world).copy()
    return result


def horizontal_gap(a_min, a_max, b_min, b_max):
    dx = max(b_min.x - a_max.x, a_min.x - b_max.x, 0.0)
    dy = max(b_min.y - a_max.y, a_min.y - b_max.y, 0.0)
    return math.hypot(dx, dy)


def load_target(mode, blend_path, glb_path):
    if mode == "blend":
        bpy.ops.wm.open_mainfile(filepath=blend_path)
    else:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=glb_path)
    bpy.context.view_layer.update()


def main():
    args = parse_args()
    reference = read_reference(os.path.abspath(args.reference))
    load_target(args.mode, os.path.abspath(args.blend), os.path.abspath(args.glb))
    depsgraph = bpy.context.evaluated_depsgraph_get()
    failures = []
    hero_matches = [obj for obj in bpy.context.scene.objects if obj.name == "VQ1C_POLISHED_HERO_ROOT"]
    hero = hero_matches[0] if len(hero_matches) == 1 else None
    if len(hero_matches) != 1:
        failures.append(f"polished hero root count {len(hero_matches)} != 1")
    elif hero.parent is not None or matrix_error(hero.matrix_world, Matrix.Identity(4)) > 1e-6:
        failures.append("polished hero root is not top-level identity")
    roots = {}
    for key, (name, expected_meshes, expected_triangles) in ROOTS.items():
        matches = [obj for obj in bpy.context.scene.objects if obj.name == name]
        if len(matches) != 1:
            failures.append(f"{name} count {len(matches)} != 1")
            continue
        root = matches[0]
        roots[key] = root
        if root.parent is not hero:
            failures.append(f"{name} is not a direct polished hero child")
        error = matrix_error(root.matrix_local, reference[key])
        print("ROOT_MATRIX_ERROR", name, f"{error:.9f}")
        if error > 0.0001:
            failures.append(f"{name} reference matrix error {error:.9f}")
        actual = stats(root, depsgraph)
        print("SUBTREE_STATS", key, actual[0], actual[1])
        if actual[0] != expected_meshes or actual[1] != expected_triangles or actual[2]:
            failures.append(f"{key} stats {actual} != {(expected_meshes, expected_triangles, [])}")
    all_meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    total_triangles = 0
    for obj in all_meshes:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            mesh.calc_loop_triangles()
            total_triangles += len(mesh.loop_triangles)
        finally:
            evaluated.to_mesh_clear()
    print("TOTAL_STATS", len(all_meshes), total_triangles)
    if len(all_meshes) != EXPECTED_MESHES or total_triangles != EXPECTED_TRIANGLES:
        failures.append(f"total stats {(len(all_meshes), total_triangles)} != {(EXPECTED_MESHES, EXPECTED_TRIANGLES)}")
    for name in WORKSTATION_ROOTS:
        obj = bpy.data.objects.get(name)
        if obj is None or "workstation" not in roots or not is_descendant(obj, roots["workstation"]):
            failures.append(f"workstation root {name} missing/mis-parented")
    for name, owner_name in ANCHOR_OWNERS.items():
        obj = bpy.data.objects.get(name)
        owner = bpy.data.objects.get(owner_name)
        if obj is None or owner is None or not is_descendant(obj, owner):
            failures.append(f"anchor {name} missing from {owner_name}")
    for anchor_name, socket_name in ALIGNMENTS:
        anchor = bpy.data.objects.get(anchor_name)
        socket = bpy.data.objects.get(socket_name)
        if anchor is None or socket is None:
            continue
        error = (anchor.matrix_world.translation - socket.matrix_world.translation).length
        print("ANCHOR_ALIGNMENT", anchor_name, f"{error:.9f}")
        if error > 0.0001:
            failures.append(f"anchor alignment {anchor_name} error {error:.9f}")
    bad = [obj.name for obj in bpy.context.scene.objects if obj.name in FORBIDDEN]
    bad += [obj.name for obj in bpy.context.scene.objects if obj.type in {"CAMERA", "LIGHT"}]
    if bad:
        failures.append(f"forbidden objects: {bad}")
    for obj in bpy.context.scene.objects:
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-5:
            failures.append(f"non-uniform scale: {obj.name} {tuple(scale)}")
    overall = world_bounds(bpy.context.scene.objects, depsgraph)
    if overall:
        print("WORLD_BOUNDS", tuple(round(v, 6) for v in overall[0]), tuple(round(v, 6) for v in overall[1]))
        if (overall[0] - Vector((-2.5, -2.0, -0.08))).length > 0.002 or (overall[1] - Vector((2.5, 2.0, 3.0))).length > 0.002:
            failures.append("overall room bounds changed")
    if all(key in roots for key in ROOTS):
        arch_bounds = world_bounds(descendants(roots["architecture"]), depsgraph)
        ws_bounds = world_bounds(descendants(roots["workstation"]), depsgraph)
        sofa_bounds = world_bounds(descendants(roots["sofa"]), depsgraph)
        wall_gap = sofa_bounds[0].x - (-2.4)
        ws_gap = horizontal_gap(*sofa_bounds, *ws_bounds)
        print("SOFA_WALL_GAP", f"{wall_gap:.6f}")
        print("SOFA_WORKSTATION_GAP", f"{ws_gap:.6f}")
        if not 0.06 <= wall_gap <= 0.12:
            failures.append(f"sofa wall gap {wall_gap:.6f} invalid")
        if ws_gap < 0.30:
            failures.append(f"sofa/workstation gap {ws_gap:.6f} invalid")
        if abs(sofa_bounds[0].z) > 0.01:
            failures.append(f"sofa minZ {sofa_bounds[0].z:.6f} invalid")
        if (arch_bounds[0] - Vector((-2.5, -2.0, -0.08))).length > 0.002 or (arch_bounds[1] - Vector((2.5, 2.0, 3.0))).length > 0.002:
            failures.append("architecture bounds invalid")
    marker = "VQ1C_POLISHED_HERO_BLEND_VALIDATE_OK" if args.mode == "blend" else "VQ1C_POLISHED_HERO_GLB_REIMPORT_VALIDATE_OK"
    if failures:
        print(marker.replace("_OK", "_FAIL"))
        for failure in failures:
            print("FAIL", failure)
        sys.exit(1)
    print(marker)


if __name__ == "__main__":
    main()
