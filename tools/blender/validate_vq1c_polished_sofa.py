"""Independently validate the saved VQ-1C polished sofa."""

import argparse
import os
import sys

import bpy
from mathutils import Vector


ROOT_NAME = "POLISHED_SOFA_ROOT"
REQUIRED_PARTS = (
    "SOFA_BASE",
    "SOFA_ARM_LEFT",
    "SOFA_ARM_RIGHT",
    "SOFA_SEAT_CUSHION_LEFT",
    "SOFA_SEAT_CUSHION_RIGHT",
    "SOFA_BACK_CUSHION_LEFT",
    "SOFA_BACK_CUSHION_RIGHT",
    "SOFA_LEGS",
)


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    return parser.parse_args(argv)


def bounds_and_triangles(objects):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    triangles = 0
    empty = []
    for obj in objects:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            if not mesh.vertices:
                empty.append(obj.name)
            mesh.calc_loop_triangles()
            triangles += len(mesh.loop_triangles)
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
    return minimum, maximum, triangles, empty


def object_bounds(obj):
    minimum, maximum, triangles, _ = bounds_and_triangles([obj])
    return minimum, maximum, triangles


def strict_overlap(a_min, a_max, b_min, b_max, tolerance=0.002):
    values = [min(a_max[index], b_max[index]) - max(a_min[index], b_min[index]) for index in range(3)]
    return all(value > tolerance for value in values), values


def close_vector(a, b, tolerance=1e-6):
    return max(abs(a[index] - b[index]) for index in range(3)) <= tolerance


def main():
    args = parse_args()
    input_path = os.path.abspath(args.input)
    if not os.path.isfile(input_path):
        raise RuntimeError(f"Polished sofa Blend does not exist: {input_path}")
    bpy.ops.wm.open_mainfile(filepath=input_path)
    bpy.context.view_layer.update()
    failures = []
    root = bpy.data.objects.get(ROOT_NAME)
    if root is None:
        raise RuntimeError(f"Missing {ROOT_NAME}")
    objects = list(bpy.context.scene.objects)
    meshes = [obj for obj in objects if obj.type == "MESH"]
    names = {obj.name for obj in meshes}
    for name in REQUIRED_PARTS:
        if name not in names:
            failures.append(f"missing required part {name}")
    if root.location.length > 1e-9:
        failures.append("root location is not zero")
    if max(abs(value) for value in root.rotation_euler) > 1e-9:
        failures.append("root rotation is not zero")
    if max(abs(value - 1.0) for value in root.scale) > 1e-9:
        failures.append("root scale is not one")
    if any(obj.type == "CAMERA" for obj in objects):
        failures.append("saved asset contains a camera")
    if any(obj.type == "LIGHT" for obj in objects):
        failures.append("saved asset contains a light")

    part_bounds = {}
    for obj in meshes:
        if obj.parent != root:
            failures.append(f"{obj.name} is not under {ROOT_NAME}")
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-6 or max(abs(value - 1.0) for value in obj.scale) > 1e-6:
            failures.append(f"{obj.name} has non-uniform or unapplied scale: {tuple(obj.scale)}")
        minimum, maximum, triangles = object_bounds(obj)
        part_bounds[obj.name] = (minimum, maximum)
        print(
            "VERIFY_POLISHED_PART", obj.name,
            "bounds_min=", tuple(round(value, 6) for value in minimum),
            "bounds_max=", tuple(round(value, 6) for value in maximum),
            "triangles=", triangles,
        )

    minimum, maximum, triangles, empty = bounds_and_triangles(meshes)
    dimensions = maximum - minimum
    center = (minimum + maximum) * 0.5
    reference = Vector(root.get("reference_dimensions", (0.0, 0.0, 0.0)))
    saved_minimum = Vector(root.get("presave_bounds_min", (99.0, 99.0, 99.0)))
    saved_maximum = Vector(root.get("presave_bounds_max", (99.0, 99.0, 99.0)))
    saved_triangles = int(root.get("presave_triangles", -1))
    for index in range(3):
        if reference[index] <= 0 or abs(dimensions[index] - reference[index]) / reference[index] > 0.03:
            failures.append(f"dimension axis {index} differs from reference by more than 3%")
    if abs(minimum.z) > 0.001:
        failures.append(f"minZ is not zero: {minimum.z}")
    if abs(center.x) > 0.001 or abs(center.y) > 0.001:
        failures.append(f"horizontal center is not zero: {tuple(center)}")
    if not (dimensions.x > dimensions.y and dimensions.x > dimensions.z):
        failures.append(f"longest axis is not X: {tuple(dimensions)}")
    if empty:
        failures.append(f"empty meshes: {empty}")
    if triangles > 25_000:
        failures.append(f"triangle budget exceeded: {triangles}")
    if not close_vector(minimum, saved_minimum) or not close_vector(maximum, saved_maximum):
        failures.append("reopened bounds differ from pre-save bounds")
    if triangles != saved_triangles:
        failures.append(f"reopened triangles {triangles} != pre-save {saved_triangles}")

    for obj in meshes:
        obj_minimum, obj_maximum = part_bounds[obj.name]
        if any(obj_minimum[index] < minimum[index] - 1e-6 or obj_maximum[index] > maximum[index] + 1e-6 for index in range(3)):
            failures.append(f"{obj.name} lies outside overall bounds")
    for left, right in (
        ("SOFA_SEAT_CUSHION_LEFT", "SOFA_SEAT_CUSHION_RIGHT"),
        ("SOFA_BACK_CUSHION_LEFT", "SOFA_BACK_CUSHION_RIGHT"),
    ):
        if left in part_bounds and right in part_bounds:
            overlaps, values = strict_overlap(*part_bounds[left], *part_bounds[right])
            if overlaps:
                failures.append(f"{left} and {right} overlap: {values}")
    for cushion in (
        "SOFA_SEAT_CUSHION_LEFT", "SOFA_SEAT_CUSHION_RIGHT",
        "SOFA_BACK_CUSHION_LEFT", "SOFA_BACK_CUSHION_RIGHT",
    ):
        for arm in ("SOFA_ARM_LEFT", "SOFA_ARM_RIGHT"):
            if cushion in part_bounds and arm in part_bounds:
                overlaps, values = strict_overlap(*part_bounds[cushion], *part_bounds[arm])
                if overlaps:
                    failures.append(f"{cushion} severely intersects {arm}: {values}")

    print("VERIFY_POLISHED_ROOT", tuple(root.location), tuple(root.rotation_euler), tuple(root.scale))
    print("VERIFY_POLISHED_BOUNDS", tuple(minimum), tuple(maximum))
    print("VERIFY_POLISHED_DIMENSIONS", tuple(dimensions), "CENTER", tuple(center), "MINZ", minimum.z)
    print("VERIFY_POLISHED_TRIANGLES", triangles, "EMPTY", empty)
    print("VERIFY_POLISHED_CAMERAS", sum(obj.type == "CAMERA" for obj in objects), "LIGHTS", sum(obj.type == "LIGHT" for obj in objects))
    if failures:
        raise RuntimeError("Polished sofa validation failed:\n- " + "\n- ".join(failures))
    print("VQ1C_POLISHED_SOFA_VALIDATE_OK")


if __name__ == "__main__":
    main()
