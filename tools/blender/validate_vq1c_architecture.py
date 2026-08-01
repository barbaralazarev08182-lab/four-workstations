"""Reopen and independently validate the saved VQ-1C Gate 2 architecture."""

import argparse
import os
import sys

import bpy
from mathutils import Vector


ROOT_NAME = "HERO_ARCH_ROOT"
TOLERANCE = 0.001
EXPECTED = {
    "FLOOR": ((0.0, 0.0, -0.04), (5.0, 4.0, 0.08)),
    "SIDE_WALL": ((-2.45, 0.0, 1.50), (0.10, 4.0, 3.0)),
    "BACK_WALL_LEFT": ((-1.20, 1.95, 1.50), (2.60, 0.10, 3.00)),
    "BACK_WALL_RIGHT": ((2.05, 1.95, 1.50), (0.90, 0.10, 3.00)),
    "BACK_WALL_BOTTOM": ((0.85, 1.95, 0.50), (1.50, 0.10, 1.00)),
    "BACK_WALL_TOP": ((0.85, 1.95, 2.60), (1.50, 0.10, 0.80)),
    "FRAME_LEFT": ((0.13, 1.885, 1.60), (0.06, 0.08, 1.20)),
    "FRAME_RIGHT": ((1.57, 1.885, 1.60), (0.06, 0.08, 1.20)),
    "FRAME_BOTTOM": ((0.85, 1.885, 1.03), (1.38, 0.08, 0.06)),
    "FRAME_TOP": ((0.85, 1.885, 2.17), (1.38, 0.08, 0.06)),
    "GLASS_PLACEHOLDER": ((0.85, 1.90, 1.60), (1.38, 0.02, 1.08)),
    "WINDOW_SILL": ((0.85, 1.84, 0.97), (1.70, 0.24, 0.06)),
    "BASEBOARD_BACK": ((0.0, 1.88, 0.06), (5.0, 0.04, 0.12)),
    "BASEBOARD_SIDE": ((-2.38, 0.0, 0.06), (0.04, 4.0, 0.12)),
}
WINDOW_BOUNDS = (0.10, 1.60, 1.00, 2.20)
WALL_NAMES = {"BACK_WALL_LEFT", "BACK_WALL_RIGHT", "BACK_WALL_BOTTOM", "BACK_WALL_TOP"}
WINDOW_COMPONENTS = {"FRAME_LEFT", "FRAME_RIGHT", "FRAME_BOTTOM", "FRAME_TOP", "GLASS_PLACEHOLDER"}


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    return parser.parse_args(argv)


def world_bounds(obj):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    triangles = 0
    vertices = len(mesh.vertices)
    try:
        mesh.calc_loop_triangles()
        triangles = len(mesh.loop_triangles)
        for vertex in mesh.vertices:
            point = evaluated.matrix_world @ vertex.co
            minimum.x = min(minimum.x, point.x)
            minimum.y = min(minimum.y, point.y)
            minimum.z = min(minimum.z, point.z)
            maximum.x = max(maximum.x, point.x)
            maximum.y = max(maximum.y, point.y)
            maximum.z = max(maximum.z, point.z)
    finally:
        evaluated.to_mesh_clear()
    return minimum, maximum, triangles, vertices


def close_vector(actual, expected, tolerance=TOLERANCE):
    return max(abs(actual[index] - expected[index]) for index in range(3)) <= tolerance


def ranges_overlap_strict(a_min, a_max, b_min, b_max, tolerance=TOLERANCE):
    return min(a_max, b_max) - max(a_min, b_min) > tolerance


def main():
    args = parse_args()
    input_path = os.path.abspath(args.input)
    if not os.path.isfile(input_path):
        raise RuntimeError(f"Architecture Blend does not exist: {input_path}")
    bpy.ops.wm.open_mainfile(filepath=input_path)
    bpy.context.view_layer.update()

    failures = []
    root = bpy.data.objects.get(ROOT_NAME)
    if root is None:
        raise RuntimeError(f"Missing {ROOT_NAME}")
    if root.location.length > 1e-9:
        failures.append(f"root location is not zero: {tuple(root.location)}")
    if max(abs(value) for value in root.rotation_euler) > 1e-9:
        failures.append(f"root rotation is not zero: {tuple(root.rotation_euler)}")
    if max(abs(value - 1.0) for value in root.scale) > 1e-9:
        failures.append(f"root scale is not one: {tuple(root.scale)}")

    scene_objects = list(bpy.context.scene.objects)
    meshes = [obj for obj in scene_objects if obj.type == "MESH"]
    if len(meshes) != len(EXPECTED):
        failures.append(f"mesh count {len(meshes)} != {len(EXPECTED)}")
    if any(obj.type == "CAMERA" for obj in scene_objects):
        failures.append("saved file contains a camera")
    if any(obj.type == "LIGHT" for obj in scene_objects):
        failures.append("saved file contains a light")

    bounds = {}
    overall_minimum = Vector((float("inf"),) * 3)
    overall_maximum = Vector((float("-inf"),) * 3)
    for name, (expected_center, expected_dimensions) in EXPECTED.items():
        obj = bpy.data.objects.get(name)
        if obj is None or obj.type != "MESH":
            failures.append(f"missing mesh {name}")
            continue
        if obj.parent != root:
            failures.append(f"{name} parent is not {ROOT_NAME}")
        minimum, maximum, triangles, vertices = world_bounds(obj)
        bounds[name] = (minimum, maximum)
        center = (minimum + maximum) * 0.5
        dimensions = maximum - minimum
        overall_minimum.x = min(overall_minimum.x, minimum.x)
        overall_minimum.y = min(overall_minimum.y, minimum.y)
        overall_minimum.z = min(overall_minimum.z, minimum.z)
        overall_maximum.x = max(overall_maximum.x, maximum.x)
        overall_maximum.y = max(overall_maximum.y, maximum.y)
        overall_maximum.z = max(overall_maximum.z, maximum.z)
        print(
            "VALIDATE_ARCH_OBJECT",
            name,
            "center=", tuple(round(value, 6) for value in center),
            "dimensions=", tuple(round(value, 6) for value in dimensions),
            "bounds_min=", tuple(round(value, 6) for value in minimum),
            "bounds_max=", tuple(round(value, 6) for value in maximum),
            "triangles=", triangles,
        )
        if not close_vector(center, expected_center):
            failures.append(f"{name} center mismatch: {tuple(center)}")
        if not close_vector(dimensions, expected_dimensions):
            failures.append(f"{name} dimensions mismatch: {tuple(dimensions)}")
        if vertices == 0:
            failures.append(f"{name} is an empty mesh")
        if max(dimensions) > 6.0 + TOLERANCE:
            failures.append(f"{name} has an abnormal dimension: {tuple(dimensions)}")
        if minimum.z < -0.081:
            failures.append(f"{name} minimum Z is too low: {minimum.z}")
        if name != "FLOOR" and maximum.z > 3.001:
            failures.append(f"{name} maximum Z is too high: {maximum.z}")
        if max(abs(value) for value in obj.rotation_euler) > 1e-9:
            failures.append(f"{name} rotation is not zero")
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-6:
            failures.append(f"{name} has non-uniform scale: {tuple(scale)}")
        if max(abs(value - 1.0) for value in obj.scale) > 1e-6:
            failures.append(f"{name} local scale is not identity: {tuple(obj.scale)}")

    if set(obj.name for obj in meshes) != set(EXPECTED):
        failures.append(f"unexpected mesh names: {sorted(set(obj.name for obj in meshes) - set(EXPECTED))}")

    if "FLOOR" in bounds and abs(bounds["FLOOR"][1].z) > TOLERANCE:
        failures.append(f"floor top is not z=0: {bounds['FLOOR'][1].z}")
    if "SIDE_WALL" in bounds:
        side_minimum, side_maximum = bounds["SIDE_WALL"]
        if abs(side_maximum.x - (-2.40)) > TOLERANCE:
            failures.append(f"side wall interior surface mismatch: {side_maximum.x}")

    if WALL_NAMES.issubset(bounds):
        actual_window = (
            bounds["BACK_WALL_LEFT"][1].x,
            bounds["BACK_WALL_RIGHT"][0].x,
            bounds["BACK_WALL_BOTTOM"][1].z,
            bounds["BACK_WALL_TOP"][0].z,
        )
        if max(abs(actual_window[index] - WINDOW_BOUNDS[index]) for index in range(4)) > TOLERANCE:
            failures.append(f"window opening mismatch: {actual_window}")
        for wall_name in WALL_NAMES:
            minimum, maximum = bounds[wall_name]
            if (
                ranges_overlap_strict(minimum.x, maximum.x, WINDOW_BOUNDS[0], WINDOW_BOUNDS[1])
                and ranges_overlap_strict(minimum.z, maximum.z, WINDOW_BOUNDS[2], WINDOW_BOUNDS[3])
            ):
                failures.append(f"{wall_name} intrudes into the window opening")
        print("VALIDATE_WINDOW_BOUNDS", actual_window, "dimensions=", (actual_window[1] - actual_window[0], actual_window[3] - actual_window[2]))

    for name in WINDOW_COMPONENTS:
        if name not in bounds:
            continue
        minimum, maximum = bounds[name]
        if minimum.x < WINDOW_BOUNDS[0] - TOLERANCE or maximum.x > WINDOW_BOUNDS[1] + TOLERANCE:
            failures.append(f"{name} exceeds window X bounds")
        if minimum.z < WINDOW_BOUNDS[2] - TOLERANCE or maximum.z > WINDOW_BOUNDS[3] + TOLERANCE:
            failures.append(f"{name} exceeds window Z bounds")
    if "GLASS_PLACEHOLDER" in bounds:
        glass_dimensions = bounds["GLASS_PLACEHOLDER"][1] - bounds["GLASS_PLACEHOLDER"][0]
        if not (glass_dimensions.y < glass_dimensions.x and glass_dimensions.y < glass_dimensions.z):
            failures.append(f"glass thickness is not along Y: {tuple(glass_dimensions)}")

    saved_minimum = Vector(root.get("gate2_presave_bounds_min", (float("nan"),) * 3))
    saved_maximum = Vector(root.get("gate2_presave_bounds_max", (float("nan"),) * 3))
    if not close_vector(overall_minimum, saved_minimum, 1e-6) or not close_vector(overall_maximum, saved_maximum, 1e-6):
        failures.append(
            f"reopened bounds differ from pre-save bounds: {tuple(overall_minimum)}, {tuple(overall_maximum)}"
        )

    print("VALIDATE_ROOT_TRANSFORM", tuple(root.location), tuple(root.rotation_euler), tuple(root.scale))
    print("VALIDATE_OVERALL_BOUNDS", tuple(overall_minimum), tuple(overall_maximum))
    print("VALIDATE_PRESAVE_BOUNDS", tuple(saved_minimum), tuple(saved_maximum))
    if failures:
        raise RuntimeError("Gate 2 validation failed:\n- " + "\n- ".join(failures))
    print("GATE2_ARCHITECTURE_VALIDATE_OK")


if __name__ == "__main__":
    main()
