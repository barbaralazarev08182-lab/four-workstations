"""Independently reopen and validate the VQ-1C polished workstation blend."""

import argparse
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_INPUT = os.path.join(
    REPO_ROOT, "assets-source", "blender", "vq1c", "polished", "workstation-polished.blend"
)
DEFAULT_REFERENCE = os.path.join(
    REPO_ROOT, "assets-source", "blender", "vq1c", "standardized", "workstation-standardized.blend"
)
ROOTS = {
    "desk": "POLISHED_DESK_ROOT",
    "chair": "POLISHED_CHAIR_ROOT",
    "monitor": "POLISHED_MONITOR_ROOT",
    "keyboard": "POLISHED_KEYBOARD_ROOT",
    "lamp": "POLISHED_LAMP_ROOT",
}
ALIGNMENTS = {
    "monitor": ("MONITOR_BASE_ANCHOR", "MONITOR_SOCKET", "POLISHED_MONITOR_ROOT"),
    "keyboard": ("KEYBOARD_BASE_ANCHOR", "KEYBOARD_SOCKET", "POLISHED_KEYBOARD_ROOT"),
    "lamp": ("LAMP_BASE_ANCHOR", "LAMP_SOCKET", "POLISHED_LAMP_ROOT"),
}
EXPECTED_MESHES = 73
EXPECTED_TRIANGLES = 12544
EXPECTED_SUBTREE_STATS = {
    "desk": (8, 1236),
    "chair": (19, 6000),
    "monitor": (6, 648),
    "keyboard": (33, 3564),
    "lamp": (7, 1096),
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=DEFAULT_INPUT)
    parser.add_argument("--reference", default=DEFAULT_REFERENCE)
    argv = []
    if "--" in sys.argv:
        argv = sys.argv[sys.argv.index("--") + 1 :]
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


def bounds(objects, depsgraph):
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
    if not found:
        return None
    return minimum, maximum


def read_reference_chair_matrix(path):
    bpy.ops.wm.open_mainfile(filepath=path)
    workstation = bpy.data.objects.get("STD_WORKSTATION_ROOT")
    chair = bpy.data.objects.get("STD_CHAIR_ROOT")
    if workstation is None or chair is None:
        raise RuntimeError("Reference workstation/chair root missing")
    return (workstation.matrix_world.inverted() @ chair.matrix_world).copy()


def matrix_error(left, right):
    return max(abs(left[row][column] - right[row][column]) for row in range(4) for column in range(4))


def main():
    args = parse_args()
    input_path = os.path.abspath(args.input)
    reference_path = os.path.abspath(args.reference)
    if not os.path.isfile(input_path):
        raise RuntimeError(f"Missing polished workstation: {input_path}")
    if not os.path.isfile(reference_path):
        raise RuntimeError(f"Missing workstation reference: {reference_path}")
    reference_chair = read_reference_chair_matrix(reference_path)
    bpy.ops.wm.open_mainfile(filepath=input_path)
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    failures = []

    workstation_matches = [obj for obj in bpy.data.objects if obj.name == "POLISHED_WORKSTATION_ROOT"]
    workstation = workstation_matches[0] if len(workstation_matches) == 1 else None
    if len(workstation_matches) != 1:
        failures.append(f"POLISHED_WORKSTATION_ROOT count {len(workstation_matches)} != 1")
    elif workstation.parent is not None or matrix_error(workstation.matrix_world, Matrix.Identity(4)) > 1e-9:
        failures.append("POLISHED_WORKSTATION_ROOT is not top-level identity")

    roots = {}
    for key, name in ROOTS.items():
        matches = [obj for obj in bpy.data.objects if obj.name == name]
        if len(matches) != 1:
            failures.append(f"{name} count {len(matches)} != 1")
            continue
        root = matches[0]
        roots[key] = root
        if root.parent is not workstation:
            failures.append(f"{name} is not directly parented to workstation root")
        local_scale = root.matrix_local.to_scale()
        if max(abs(value - 1.0) for value in local_scale) > 1e-6:
            failures.append(f"{name} local scale is not identity: {tuple(local_scale)}")

    if "desk" in roots and matrix_error(roots["desk"].matrix_local, Matrix.Identity(4)) > 1e-9:
        failures.append("desk root is not at identity")
    if "chair" in roots:
        chair_matrix_error = matrix_error(roots["chair"].matrix_local, reference_chair)
        print("CHAIR_REFERENCE_MATRIX_ERROR", f"{chair_matrix_error:.9f}")
        if chair_matrix_error > 1e-6:
            failures.append(f"chair local matrix differs from reference: {chair_matrix_error:.9f}")
        rotation_z = roots["chair"].matrix_local.to_euler().z
        if abs(abs(rotation_z) - math.pi) > 0.001:
            failures.append(f"chair does not face desk: rotation_z={math.degrees(rotation_z):.6f}")

    for key, (anchor_name, socket_name, owner_name) in ALIGNMENTS.items():
        anchor = bpy.data.objects.get(anchor_name)
        socket = bpy.data.objects.get(socket_name)
        owner = roots.get(key)
        if anchor is None or socket is None or owner is None:
            failures.append(f"missing {key} alignment object")
            continue
        if not is_descendant(anchor, owner):
            failures.append(f"{anchor_name} is not retained under {owner_name}")
        if "desk" not in roots or not is_descendant(socket, roots["desk"]):
            failures.append(f"{socket_name} is not retained under POLISHED_DESK_ROOT")
        error = (anchor.matrix_world.translation - socket.matrix_world.translation).length
        print(f"ALIGNMENT_{key.upper()} {error:.9f}")
        if error > 0.0001:
            failures.append(f"{key} alignment error {error:.9f} > 0.0001")

    light_anchor = bpy.data.objects.get("LIGHT_DESK_ANCHOR")
    if light_anchor is None or "lamp" not in roots or not is_descendant(light_anchor, roots["lamp"]):
        failures.append("LIGHT_DESK_ANCHOR is not retained under lamp root")

    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
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
    print("MESH_COUNT", len(meshes))
    print("EVALUATED_TRIANGLES", triangles)
    if len(meshes) != EXPECTED_MESHES:
        failures.append(f"mesh count {len(meshes)} != {EXPECTED_MESHES}")
    if triangles != EXPECTED_TRIANGLES:
        failures.append(f"triangles {triangles} != {EXPECTED_TRIANGLES}")
    if empty:
        failures.append(f"empty meshes: {empty}")

    for key, root in roots.items():
        subtree_meshes = [obj for obj in descendants(root) if obj.type == "MESH"]
        subtree_triangles = 0
        for obj in subtree_meshes:
            evaluated = obj.evaluated_get(depsgraph)
            mesh = evaluated.to_mesh()
            try:
                mesh.calc_loop_triangles()
                subtree_triangles += len(mesh.loop_triangles)
            finally:
                evaluated.to_mesh_clear()
        print(f"SUBTREE_{key.upper()}", len(subtree_meshes), subtree_triangles)
        if (len(subtree_meshes), subtree_triangles) != EXPECTED_SUBTREE_STATS[key]:
            failures.append(
                f"{key} subtree stats {(len(subtree_meshes), subtree_triangles)} "
                f"!= {EXPECTED_SUBTREE_STATS[key]}"
            )

    forbidden = [obj.name for obj in bpy.context.scene.objects if obj.type in {"CAMERA", "LIGHT"}]
    forbidden += [obj.name for obj in bpy.context.scene.objects if obj.name.startswith("STD_")]
    if forbidden:
        failures.append(f"forbidden saved objects: {forbidden}")
    for obj in bpy.context.scene.objects:
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-6:
            failures.append(f"non-uniform world scale: {obj.name} {tuple(scale)}")

    overall = bounds(bpy.context.scene.objects, depsgraph)
    if overall is None:
        failures.append("no mesh bounds")
    else:
        minimum, maximum = overall
        dimensions = maximum - minimum
        print("WORLD_BOUNDS", tuple(round(v, 6) for v in minimum), tuple(round(v, 6) for v in maximum))
        print("WORLD_DIMS", tuple(round(v, 6) for v in dimensions))
        if dimensions.x < dimensions.z:
            failures.append("workstation longest horizontal span is not X")
        if workstation is not None:
            stored_min = Vector(workstation.get("presave_bounds_min", minimum))
            stored_max = Vector(workstation.get("presave_bounds_max", maximum))
            if (stored_min - minimum).length > 1e-6 or (stored_max - maximum).length > 1e-6:
                failures.append("saved bounds differ from pre-save bounds")

    if "desk" in roots and "chair" in roots:
        desk_bounds = bounds(descendants(roots["desk"]), depsgraph)
        chair_bounds = bounds(descendants(roots["chair"]), depsgraph)
        if desk_bounds and chair_bounds:
            gap = desk_bounds[0].y - chair_bounds[1].y
            print("CHAIR_DESK_GAP", f"{gap:.6f}")
            if gap < 0.05:
                failures.append(f"chair/desk gap {gap:.6f} < 0.05")
            if abs((chair_bounds[0].x + chair_bounds[1].x) * 0.5) > 0.001:
                failures.append("chair is not centered on desk X")

    if workstation is not None:
        if workstation.get("presave_meshes") != len(meshes):
            failures.append("saved mesh count differs from pre-save count")
        if workstation.get("presave_triangles") != triangles:
            failures.append("saved triangle count differs from pre-save count")

    if failures:
        print("VQ1C_POLISHED_WORKSTATION_VALIDATE_FAIL")
        for failure in failures:
            print("FAIL", failure)
        sys.exit(1)
    print("VQ1C_POLISHED_WORKSTATION_VALIDATE_OK")


if __name__ == "__main__":
    main()
