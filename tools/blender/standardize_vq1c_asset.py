"""Standardize one approved VQ-1C source asset and render a clay preview.

Run with Blender in a factory-startup background process. Source and output
paths are supplied by the caller; this module intentionally contains no
machine-specific or downloaded-package paths.
"""

import argparse
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector


ASSETS = {
    "S6": {
        "root": "STD_SOFA_ROOT",
        "source_extensions": {".blend"},
        "expected_triangles": 1012,
        "rotation_z": 0.0,
        "target_axis": 0,
        "target_size": 1.880,
        "ranges": ((1.65, 2.10), (0.75, 0.95), (0.72, 0.95)),
        "longest_axis": 0,
        "keep_names": None,
    },
    "D4": {
        "root": "STD_DESK_ROOT",
        "source_extensions": {".obj"},
        "expected_triangles": 198,
        "rotation_z": math.pi,
        "target_axis": 2,
        "target_size": 0.750,
        "ranges": ((1.35, 1.55), (0.65, 0.80), (0.72, 0.78)),
        "longest_axis": 0,
        "keep_names": None,
    },
    "C1": {
        "root": "STD_CHAIR_ROOT",
        "source_extensions": {".blend"},
        "expected_triangles": 2116,
        "rotation_z": 0.0,
        "target_axis": 2,
        "target_size": 0.952,
        "ranges": ((0.55, 0.70), (0.55, 0.75), (0.95, 1.20)),
        "longest_axis": 2,
        "keep_names": ("OfficeChair",),
    },
    "M1": {
        "root": "STD_MONITOR_ROOT",
        "source_extensions": {".obj"},
        "expected_triangles": 72,
        "rotation_z": 0.0,
        "target_axis": 0,
        "target_size": 0.550,
        "ranges": ((0.48, 0.62), (0.08, 0.25), (0.28, 0.48)),
        "longest_axis": 0,
        "keep_names": None,
    },
    "K1": {
        "root": "STD_KEYBOARD_ROOT",
        "source_extensions": {".obj"},
        "expected_triangles": 32,
        "rotation_z": 0.0,
        "target_axis": 0,
        "target_size": 0.430,
        "ranges": ((0.38, 0.48), (0.12, 0.22), (0.02, 0.08)),
        "longest_axis": 0,
        "keep_names": None,
    },
    "L1": {
        "root": "STD_LAMP_ROOT",
        "source_extensions": {".blend"},
        "expected_triangles": 356,
        "rotation_z": 0.0,
        "target_axis": 2,
        "target_size": 0.475,
        "ranges": ((0.18, 0.45), (0.18, 0.45), (0.35, 0.60)),
        "longest_axis": 2,
        "keep_names": None,
    },
}
DESK_ANCHORS = ("DESK_TOP_ANCHOR", "MONITOR_SOCKET", "KEYBOARD_SOCKET", "LAMP_SOCKET")
CHAIR_ANCHORS = ("CHAIR_SEAT_ANCHOR",)
BASE_ANCHORS = {
    "M1": "MONITOR_BASE_ANCHOR",
    "K1": "KEYBOARD_BASE_ANCHOR",
    "L1": "LAMP_BASE_ANCHOR",
}


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--asset", required=True, choices=sorted(ASSETS))
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--preview", required=True)
    return parser.parse_args(argv)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def import_source(source, config):
    if not os.path.isfile(source):
        raise RuntimeError(f"Source does not exist: {source}")
    extension = os.path.splitext(source)[1].lower()
    if extension not in config["source_extensions"]:
        raise RuntimeError(f"Unexpected source extension for asset: {extension}")

    if extension == ".blend":
        with bpy.data.libraries.load(source, link=False) as (data_from, data_to):
            data_to.objects = [name for name in data_from.objects if name]
        objects = [obj for obj in data_to.objects if obj is not None]
        if config.get("keep_names"):
            objects = [obj for obj in objects if obj.name in config["keep_names"]]
            if not objects:
                raise RuntimeError(f"No object matched keep_names {config['keep_names']} in {source}")
        for obj in objects:
            bpy.context.collection.objects.link(obj)
    elif extension == ".obj":
        existing = set(bpy.context.scene.objects)
        bpy.ops.wm.obj_import(filepath=source)
        objects = [obj for obj in bpy.context.scene.objects if obj not in existing]
    else:
        raise RuntimeError(f"Unsupported source extension: {extension}")
    bpy.context.view_layer.update()
    return objects


def remove_cameras_and_lights(objects):
    for obj in list(objects):
        if obj.type in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(obj, do_unlink=True)
            objects.remove(obj)
    bpy.context.view_layer.update()


def top_level_objects(objects):
    names = {obj.name for obj in objects}
    return [obj for obj in objects if obj.parent is None or obj.parent.name not in names]


def inspect_asset(objects, label):
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    meshes = [obj for obj in objects if obj.type == "MESH"]
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    polygons = 0
    triangles = 0
    empty_meshes = []
    materials = set()
    triangle_records = []

    print(f"{label}_OBJECTS", [(obj.name, obj.type) for obj in objects])
    print(f"{label}_TOP_LEVEL", [(obj.name, obj.type) for obj in top_level_objects(objects)])
    print(
        f"{label}_COUNTS",
        "objects=", len(objects),
        "meshes=", len(meshes),
        "cameras=", sum(obj.type == "CAMERA" for obj in objects),
        "lights=", sum(obj.type == "LIGHT" for obj in objects),
    )
    for obj in objects:
        print(
            f"{label}_HIERARCHY", obj.name,
            "type=", obj.type,
            "parent=", obj.parent.name if obj.parent else "NONE",
            "children=", [child.name for child in obj.children],
        )
        print(
            f"{label}_MATRIX_WORLD", obj.name,
            tuple(tuple(round(value, 9) for value in row) for row in obj.matrix_world),
        )
        if obj.type != "MESH":
            continue
        for material in obj.data.materials:
            if material:
                materials.add(material.name)
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            if not mesh.vertices:
                empty_meshes.append(obj.name)
            polygons += len(mesh.polygons)
            mesh.calc_loop_triangles()
            triangles += len(mesh.loop_triangles)
            world_vertices = [evaluated.matrix_world @ vertex.co for vertex in mesh.vertices]
            for point in world_vertices:
                minimum.x = min(minimum.x, point.x)
                minimum.y = min(minimum.y, point.y)
                minimum.z = min(minimum.z, point.z)
                maximum.x = max(maximum.x, point.x)
                maximum.y = max(maximum.y, point.y)
                maximum.z = max(maximum.z, point.z)
            for triangle in mesh.loop_triangles:
                a, b, c = (world_vertices[index] for index in triangle.vertices)
                cross = (b - a).cross(c - a)
                normal = cross.normalized() if cross.length else Vector((0.0, 0.0, 0.0))
                triangle_records.append(((a + b + c) / 3.0, normal, cross.length * 0.5, (a, b, c)))
        finally:
            evaluated.to_mesh_clear()

    if not meshes or minimum.x == float("inf"):
        raise RuntimeError(f"{label}: no usable mesh geometry")
    dimensions = maximum - minimum
    center = (minimum + maximum) * 0.5
    outer_band = dimensions.y * 0.25
    negative_y_area = sum(
        area for centroid, normal, area, _ in triangle_records
        if abs(normal.z) < 0.25 and centroid.y < minimum.y + outer_band
    )
    positive_y_area = sum(
        area for centroid, normal, area, _ in triangle_records
        if abs(normal.z) < 0.25 and centroid.y > maximum.y - outer_band
    )
    print(f"{label}_BOUNDS_MIN", tuple(round(value, 9) for value in minimum))
    print(f"{label}_BOUNDS_MAX", tuple(round(value, 9) for value in maximum))
    print(f"{label}_DIMENSIONS", tuple(round(value, 9) for value in dimensions))
    print(f"{label}_CENTER", tuple(round(value, 9) for value in center))
    print(f"{label}_POLYGONS", polygons)
    print(f"{label}_TRIANGLES", triangles)
    print(f"{label}_MATERIALS", len(materials), sorted(materials))
    print(f"{label}_EMPTY_MESHES", empty_meshes)
    print(
        f"{label}_DIRECTION_EVIDENCE",
        "negative_y_outer_vertical_area=", round(negative_y_area, 9),
        "positive_y_outer_vertical_area=", round(positive_y_area, 9),
    )
    return {
        "minimum": minimum,
        "maximum": maximum,
        "dimensions": dimensions,
        "center": center,
        "mesh_count": len(meshes),
        "polygons": polygons,
        "triangles": triangles,
        "materials": materials,
        "empty_meshes": empty_meshes,
        "triangle_records": triangle_records,
        "negative_y_outer_area": negative_y_area,
        "positive_y_outer_area": positive_y_area,
    }


def validate_source(asset, config, stats):
    dimensions = stats["dimensions"]
    if stats["mesh_count"] != 1:
        raise RuntimeError(f"Expected one {asset} mesh, found {stats['mesh_count']}")
    if stats["empty_meshes"]:
        raise RuntimeError(f"Source contains empty meshes: {stats['empty_meshes']}")
    if abs(stats["triangles"] - config["expected_triangles"]) > 2:
        raise RuntimeError(f"Unexpected source triangle count: {stats['triangles']}")
    longest = config.get("longest_axis", 0)
    if not (dimensions[longest] > dimensions[(longest + 1) % 3] and dimensions[longest] > dimensions[(longest + 2) % 3]):
        raise RuntimeError(f"Source longest axis is not axis {longest}: {tuple(dimensions)}")
    if asset == "D4":
        if not (dimensions.z > 0 and dimensions.y > 0):
            raise RuntimeError("D4 source has invalid depth or height")
        if stats["negative_y_outer_area"] <= stats["positive_y_outer_area"]:
            raise RuntimeError("D4 direction evidence does not place the modesty panel on -Y")
    if asset == "C1":
        if not (dimensions.z > 0 and dimensions.y > 0 and dimensions.x > 0):
            raise RuntimeError("C1 source has invalid dimensions")
        if stats["positive_y_outer_area"] <= stats["negative_y_outer_area"]:
            raise RuntimeError("C1 direction evidence does not place the backrest on +Y")
    if asset == "M1":
        if not (dimensions.x > dimensions.y and dimensions.z > 0):
            raise RuntimeError("M1 source must be screen-like with X as width and Z as height")
        if stats["negative_y_outer_area"] <= stats["positive_y_outer_area"]:
            raise RuntimeError("M1 direction evidence does not place the screen face on -Y")
    if asset == "K1":
        if not (dimensions.x > dimensions.y and dimensions.z > 0):
            raise RuntimeError("K1 source must be keyboard-like with X as width")
        if stats["negative_y_outer_area"] <= stats["positive_y_outer_area"]:
            raise RuntimeError("K1 direction evidence does not place the user side on -Y")
    if asset == "L1":
        if not (dimensions.z > dimensions.x and dimensions.z > dimensions.y):
            raise RuntimeError("L1 source longest axis must be Z (vertical lamp)")
        if not (dimensions.x > 0 and dimensions.y > 0):
            raise RuntimeError("L1 source has invalid footprint")


def transformed_bounds(stats, matrix):
    minimum = stats["minimum"]
    maximum = stats["maximum"]
    corners = [
        matrix @ Vector((x, y, z))
        for x in (minimum.x, maximum.x)
        for y in (minimum.y, maximum.y)
        for z in (minimum.z, maximum.z)
    ]
    transformed_minimum = Vector(tuple(min(corner[index] for corner in corners) for index in range(3)))
    transformed_maximum = Vector(tuple(max(corner[index] for corner in corners) for index in range(3)))
    return transformed_minimum, transformed_maximum


def create_canonical_root(objects, source_stats, config):
    root = bpy.data.objects.new(config["root"], None)
    bpy.context.collection.objects.link(root)
    root.location = (0.0, 0.0, 0.0)
    root.rotation_euler = (0.0, 0.0, 0.0)
    root.scale = (1.0, 1.0, 1.0)

    orientation = Matrix.Rotation(config["rotation_z"], 4, "Z")
    oriented_minimum, oriented_maximum = transformed_bounds(source_stats, orientation)
    oriented_dimensions = oriented_maximum - oriented_minimum
    scale = config["target_size"] / oriented_dimensions[config["target_axis"]]
    linear = Matrix.Scale(scale, 4) @ orientation
    scaled_minimum, scaled_maximum = transformed_bounds(source_stats, linear)
    scaled_center = (scaled_minimum + scaled_maximum) * 0.5
    translation = Vector((-scaled_center.x, -scaled_center.y, -scaled_minimum.z))
    correction = Matrix.Translation(translation) @ linear

    for obj in top_level_objects(objects):
        corrected_world = correction @ obj.matrix_world.copy()
        obj.parent = root
        obj.matrix_world = corrected_world
    bpy.context.view_layer.update()
    print("STANDARDIZATION_UNIFORM_SCALE", round(scale, 12))
    print("STANDARDIZATION_ROTATION_Z_DEGREES", round(math.degrees(config["rotation_z"]), 6))
    print("STANDARDIZATION_TRANSLATION", tuple(round(value, 12) for value in translation))
    return root


def is_identity_root(root, tolerance=1e-9):
    return (
        root.location.length <= tolerance
        and max(abs(value) for value in root.rotation_euler) <= tolerance
        and max(abs(value - 1.0) for value in root.scale) <= tolerance
    )


def has_non_uniform_scale(objects, tolerance=1e-6):
    bad = []
    for obj in objects:
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > tolerance:
            bad.append((obj.name, tuple(scale)))
    return bad


def desk_top_bounds(stats):
    top_z = stats["maximum"].z
    threshold = max(0.0001, stats["dimensions"].z * 0.005)
    points = []
    for _, normal, _, vertices in stats["triangle_records"]:
        if abs(normal.z) < 0.98:
            continue
        if min(vertex.z for vertex in vertices) < top_z - threshold:
            continue
        points.extend(vertices)
    if not points:
        raise RuntimeError("Could not identify the D4 horizontal desktop top plane")
    result = (
        min(point.x for point in points), max(point.x for point in points),
        min(point.y for point in points), max(point.y for point in points), top_z,
    )
    if result[1] - result[0] < stats["dimensions"].x * 0.80:
        raise RuntimeError(f"D4 top plane does not cover the main width: {result}")
    if result[3] - result[2] < stats["dimensions"].y * 0.80:
        raise RuntimeError(f"D4 top plane does not cover the main depth: {result}")
    print("DESK_TOP_Z", round(top_z, 9))
    print("DESK_TOP_BOUNDS", tuple(round(value, 9) for value in result))
    return result


def create_desk_anchors(root, top_bounds):
    min_x, max_x, min_y, max_y, top_z = top_bounds
    width = max_x - min_x
    depth = max_y - min_y
    center_x = (min_x + max_x) * 0.5
    center_y = (min_y + max_y) * 0.5
    positions = {
        "DESK_TOP_ANCHOR": (center_x, center_y, top_z),
        "MONITOR_SOCKET": (center_x, max_y - depth * 0.18, top_z),
        "KEYBOARD_SOCKET": (center_x, min_y + depth * 0.28, top_z),
        "LAMP_SOCKET": (max_x - width * 0.16, max_y - depth * 0.25, top_z),
    }
    for name, position in positions.items():
        anchor = bpy.data.objects.new(name, None)
        bpy.context.collection.objects.link(anchor)
        anchor.parent = root
        anchor.location = position
        anchor.rotation_euler = (0.0, 0.0, 0.0)
        anchor.scale = (1.0, 1.0, 1.0)
        anchor.empty_display_type = "SPHERE"
        anchor.empty_display_size = 0.04
        print("DESK_ANCHOR", name, tuple(round(value, 9) for value in anchor.location))
    return positions


def chair_seat_bounds(stats):
    """Identify the chair seat top plane from near-horizontal upward faces.

    The seat is the largest horizontal face cluster whose centroid z is in
    the target seat range [0.43, 0.52]. Returns (min_x, max_x, min_y, max_y, seat_z).
    """
    candidates = []
    for centroid, normal, area, _ in stats["triangle_records"]:
        if normal.z < 0.90:
            continue
        if not 0.43 <= centroid.z <= 0.52:
            continue
        candidates.append((centroid, area))
    if not candidates:
        raise RuntimeError("Could not identify any chair seat top plane")
    # Cluster by z with 0.01 tolerance; keep the cluster with the largest total area.
    clusters = {}
    for centroid, area in candidates:
        z_key = round(centroid.z, 2)
        clusters.setdefault(z_key, []).append((centroid, area))
    best_z = None
    best_area = 0.0
    best_points = []
    for z_key, items in sorted(clusters.items(), key=lambda kv: -sum(a for _, a in kv[1])):
        total = sum(area for _, area in items)
        if total > best_area:
            best_area = total
            best_z = z_key
            best_points = items
    min_x = min(c.x for c, _ in best_points)
    max_x = max(c.x for c, _ in best_points)
    min_y = min(c.y for c, _ in best_points)
    max_y = max(c.y for c, _ in best_points)
    result = (min_x, max_x, min_y, max_y, best_z)
    if not 0.43 <= best_z <= 0.52:
        raise RuntimeError(f"CHAIR_SEAT_Z out of range: {best_z}")
    if max_x - min_x < 0.25 or max_y - min_y < 0.25:
        raise RuntimeError(f"CHAIR_SEAT_BOUNDS too small to be a seat: {result}")
    print("CHAIR_SEAT_Z", round(best_z, 9))
    print("CHAIR_SEAT_BOUNDS", tuple(round(value, 9) for value in result))
    return result


def create_chair_anchor(root, seat_bounds):
    min_x, max_x, min_y, max_y, seat_z = seat_bounds
    center_x = (min_x + max_x) * 0.5
    center_y = (min_y + max_y) * 0.5
    anchor = bpy.data.objects.new("CHAIR_SEAT_ANCHOR", None)
    bpy.context.collection.objects.link(anchor)
    anchor.parent = root
    anchor.location = (center_x, center_y, seat_z)
    anchor.rotation_euler = (0.0, 0.0, 0.0)
    anchor.scale = (1.0, 1.0, 1.0)
    anchor.empty_display_type = "SPHERE"
    anchor.empty_display_size = 0.04
    print("CHAIR_SEAT_ANCHOR", tuple(round(value, 9) for value in anchor.location))
    return anchor


def create_base_anchor(root, stats, name):
    """Place an anchor at the center of the asset's ground-contact footprint (z=0)."""
    min_x, max_x, min_y, max_y = (float("inf"), float("-inf"), float("inf"), float("-inf"))
    for centroid, normal, _, _ in stats["triangle_records"]:
        if abs(centroid.z) > 0.02:
            continue
        if abs(normal.z) > 0.5:
            continue
        min_x = min(min_x, centroid.x)
        max_x = max(max_x, centroid.x)
        min_y = min(min_y, centroid.y)
        max_y = max(max_y, centroid.y)
    if not (min_x <= max_x and min_y <= max_y):
        # Fall back to full horizontal bounds
        min_x, max_x = stats["minimum"].x, stats["maximum"].x
        min_y, max_y = stats["minimum"].y, stats["maximum"].y
    center_x = (min_x + max_x) * 0.5
    center_y = (min_y + max_y) * 0.5
    anchor = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(anchor)
    anchor.parent = root
    anchor.location = (center_x, center_y, 0.0)
    anchor.rotation_euler = (0.0, 0.0, 0.0)
    anchor.scale = (1.0, 1.0, 1.0)
    anchor.empty_display_type = "SPHERE"
    anchor.empty_display_size = 0.03
    print(f"{name}", tuple(round(value, 9) for value in anchor.location))
    return anchor


def create_light_anchor(root, stats, name):
    """Place the runtime light anchor inside/at the lamp head emission center."""
    min_x, max_x, min_y, max_y = (float("inf"), float("-inf"), float("inf"), float("-inf"))
    top_face_z = stats["maximum"].z
    threshold = max(0.02, (stats["maximum"].z - stats["minimum"].z) * 0.06)
    for centroid, normal, _, _ in stats["triangle_records"]:
        if abs(normal.z) < 0.9:
            continue
        if centroid.z < top_face_z - threshold:
            continue
        min_x = min(min_x, centroid.x)
        max_x = max(max_x, centroid.x)
        min_y = min(min_y, centroid.y)
        max_y = max(max_y, centroid.y)
    if not (min_x <= max_x and min_y <= max_y):
        min_x, max_x = stats["minimum"].x, stats["maximum"].x
        min_y, max_y = stats["minimum"].y, stats["maximum"].y
    center_x = (min_x + max_x) * 0.5
    center_y = (min_y + max_y) * 0.5
    light_z = top_face_z - threshold * 0.5
    anchor = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(anchor)
    anchor.parent = root
    anchor.location = (center_x, center_y, light_z)
    anchor.rotation_euler = (0.0, 0.0, 0.0)
    anchor.scale = (1.0, 1.0, 1.0)
    anchor.empty_display_type = "SPHERE"
    anchor.empty_display_size = 0.03
    print(f"{name}", tuple(round(value, 9) for value in anchor.location))
    print(f"{name}_SUGGESTED_DIRECTION", (0.0, 0.0, -1.0))
    return anchor


def validate_canonical(asset, config, root, objects, stats, top_bounds=None, anchors=None):
    dimensions = stats["dimensions"]
    center = stats["center"]
    if not is_identity_root(root):
        raise RuntimeError(f"{config['root']} is not identity")
    for axis, (minimum, maximum) in enumerate(config["ranges"]):
        if not minimum <= dimensions[axis] <= maximum:
            raise RuntimeError(f"Canonical dimension axis {axis} failed: {dimensions[axis]}")
    longest = config.get("longest_axis", 0)
    if not (dimensions[longest] > dimensions[(longest + 1) % 3] and dimensions[longest] > dimensions[(longest + 2) % 3]):
        raise RuntimeError(f"Canonical longest axis is not axis {longest}: {tuple(dimensions)}")
    if abs(center.x) > 0.001 or abs(center.y) > 0.001:
        raise RuntimeError(f"Canonical horizontal center failed: {tuple(center)}")
    if abs(stats["minimum"].z) > 0.001:
        raise RuntimeError(f"Canonical minZ failed: {stats['minimum'].z}")
    if stats["triangles"] != config["expected_triangles"]:
        raise RuntimeError(f"Canonical triangle count failed: {stats['triangles']}")
    if stats["empty_meshes"]:
        raise RuntimeError(f"Canonical asset contains empty meshes: {stats['empty_meshes']}")
    if sum(obj.type == "MESH" for obj in objects) != 1:
        raise RuntimeError("Canonical mesh count differs from source")
    if any(obj.type in {"CAMERA", "LIGHT"} for obj in objects):
        raise RuntimeError("Canonical asset contains a camera or light")
    non_uniform = has_non_uniform_scale([root, *objects])
    if non_uniform:
        raise RuntimeError(f"Canonical asset contains non-uniform scale: {non_uniform}")

    if asset == "D4":
        if stats["positive_y_outer_area"] <= stats["negative_y_outer_area"]:
            raise RuntimeError("D4 modesty panel is not on +Y / visual front is not -Y")
        if top_bounds is None or anchors is None:
            raise RuntimeError("D4 top bounds or anchors are missing")
        min_x, max_x, min_y, max_y, top_z = top_bounds
        if not 0.72 <= top_z <= 0.78:
            raise RuntimeError(f"DESK_TOP_Z failed: {top_z}")
        for name in DESK_ANCHORS:
            anchor = bpy.data.objects.get(name)
            if anchor is None or anchor.parent != root:
                raise RuntimeError(f"Missing or incorrectly parented anchor: {name}")
            if not (min_x - 0.001 <= anchor.location.x <= max_x + 0.001):
                raise RuntimeError(f"{name} exceeds desk top X bounds")
            if not (min_y - 0.001 <= anchor.location.y <= max_y + 0.001):
                raise RuntimeError(f"{name} exceeds desk top Y bounds")
            if abs(anchor.location.z - top_z) > 0.001:
                raise RuntimeError(f"{name} Z differs from DESK_TOP_Z")
            if max(abs(value) for value in anchor.rotation_euler) > 1e-9:
                raise RuntimeError(f"{name} rotation is not zero")
            if max(abs(value - 1.0) for value in anchor.scale) > 1e-9:
                raise RuntimeError(f"{name} scale is not one")
        if (Vector(anchors["MONITOR_SOCKET"]) - Vector(anchors["KEYBOARD_SOCKET"])).length < 0.10:
            raise RuntimeError("Monitor and keyboard sockets overlap")
        if min(
            (Vector(anchors["LAMP_SOCKET"]) - Vector(anchors[name])).length
            for name in ("MONITOR_SOCKET", "KEYBOARD_SOCKET")
        ) < 0.10:
            raise RuntimeError("Lamp socket overlaps another device socket")

    if asset == "C1":
        if stats["positive_y_outer_area"] <= stats["negative_y_outer_area"]:
            raise RuntimeError("C1 backrest is not on +Y / visual front is not -Y")
        if top_bounds is None or anchors is None:
            raise RuntimeError("C1 seat bounds or anchor are missing")
        _, _, _, _, seat_z = top_bounds
        if not 0.43 <= seat_z <= 0.52:
            raise RuntimeError(f"CHAIR_SEAT_Z failed: {seat_z}")
        anchor = bpy.data.objects.get("CHAIR_SEAT_ANCHOR")
        if anchor is None or anchor.parent != root:
            raise RuntimeError("Missing or incorrectly parented CHAIR_SEAT_ANCHOR")
        if abs(anchor.location.z - seat_z) > 0.001:
            raise RuntimeError("CHAIR_SEAT_ANCHOR Z differs from CHAIR_SEAT_Z")
        if max(abs(value) for value in anchor.rotation_euler) > 1e-9:
            raise RuntimeError("CHAIR_SEAT_ANCHOR rotation is not zero")
        if max(abs(value - 1.0) for value in anchor.scale) > 1e-9:
            raise RuntimeError("CHAIR_SEAT_ANCHOR scale is not one")

    if asset in ("M1", "K1", "L1"):
        anchor_name = BASE_ANCHORS[asset]
        anchor = bpy.data.objects.get(anchor_name)
        if anchor is None or anchor.parent != root:
            raise RuntimeError(f"Missing or incorrectly parented anchor: {anchor_name}")
        if abs(anchor.location.z) > 0.001:
            raise RuntimeError(f"{anchor_name} Z must be 0")
        if max(abs(value) for value in anchor.rotation_euler) > 1e-9:
            raise RuntimeError(f"{anchor_name} rotation is not zero")
        if max(abs(value - 1.0) for value in anchor.scale) > 1e-9:
            raise RuntimeError(f"{anchor_name} scale is not one")
        if asset == "M1":
            if stats["negative_y_outer_area"] <= stats["positive_y_outer_area"]:
                raise RuntimeError("M1 screen face is not on -Y")
        if asset == "K1":
            if stats["negative_y_outer_area"] <= stats["positive_y_outer_area"]:
                raise RuntimeError("K1 user side is not on -Y")
        if asset == "L1":
            light_anchor = bpy.data.objects.get("LIGHT_DESK_ANCHOR")
            if light_anchor is None or light_anchor.parent != root:
                raise RuntimeError("Missing or incorrectly parented LIGHT_DESK_ANCHOR")
            if not (stats["minimum"].z - 0.001 <= light_anchor.location.z <= stats["maximum"].z + 0.001):
                raise RuntimeError("LIGHT_DESK_ANCHOR not within lamp vertical bounds")
            if sum(obj.type == "LIGHT" for obj in objects) != 0:
                raise RuntimeError("L1 standardized file must not contain Blender lights")


def clay_material(name, color, roughness):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = 0.0
    return material


def create_axis_line(name, start, end, material):
    curve = bpy.data.curves.new(name + "_CURVE", "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = 0.008
    curve.bevel_resolution = 2
    spline = curve.splines.new("POLY")
    spline.points.add(1)
    spline.points[0].co = (*start, 1.0)
    spline.points[1].co = (*end, 1.0)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)


def add_preview_markers(root, stats):
    colors = {
        "DESK_TOP_ANCHOR": (1.0, 0.75, 0.12),
        "MONITOR_SOCKET": (0.20, 0.65, 1.0),
        "KEYBOARD_SOCKET": (0.25, 1.0, 0.35),
        "LAMP_SOCKET": (0.95, 0.28, 0.75),
        "CHAIR_SEAT_ANCHOR": (1.0, 0.55, 0.90),
    }
    for name, color in colors.items():
        anchor = bpy.data.objects.get(name)
        if anchor is None:
            continue
        material = clay_material("PREVIEW_" + name, color, 0.55)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.028, location=anchor.matrix_world.translation)
        marker = bpy.context.object
        marker.name = "PREVIEW_MARKER_" + name
        marker.data.materials.append(material)

    axis_origin = Vector((stats["minimum"].x - 0.12, stats["minimum"].y - 0.12, 0.015))
    axis_length = 0.18
    axis_materials = (
        clay_material("PREVIEW_AXIS_X", (0.95, 0.12, 0.10), 0.5),
        clay_material("PREVIEW_AXIS_Y", (0.12, 0.85, 0.20), 0.5),
        clay_material("PREVIEW_AXIS_Z", (0.15, 0.35, 1.0), 0.5),
    )
    create_axis_line("PREVIEW_AXIS_X", axis_origin, axis_origin + Vector((axis_length, 0.0, 0.0)), axis_materials[0])
    create_axis_line("PREVIEW_AXIS_Y", axis_origin, axis_origin + Vector((0.0, axis_length, 0.0)), axis_materials[1])
    create_axis_line("PREVIEW_AXIS_Z", axis_origin, axis_origin + Vector((0.0, 0.0, axis_length)), axis_materials[2])


def render_preview(asset, preview, root, objects, stats):
    clay = clay_material("Canonical_Clay", (0.64, 0.62, 0.58), 0.72)
    for obj in objects:
        if obj.type == "MESH":
            obj.data.materials.clear()
            obj.data.materials.append(clay)
    ground_material = clay_material("Preview_Ground", (0.27, 0.28, 0.29), 0.88)
    bpy.ops.mesh.primitive_plane_add(size=8.0, location=(0.0, 0.0, -0.006))
    ground = bpy.context.object
    ground.name = "PREVIEW_GROUND"
    ground.data.materials.append(ground_material)
    if asset in ("D4", "C1"):
        add_preview_markers(root, stats)

    bpy.ops.object.light_add(type="AREA", location=(-3.0, -4.0, 5.0))
    key = bpy.context.object
    key.name = "PREVIEW_KEY"
    key.data.energy = 800.0
    key.data.shape = "DISK"
    key.data.size = 4.0
    bpy.ops.object.light_add(type="AREA", location=(3.5, 1.5, 2.8))
    fill = bpy.context.object
    fill.name = "PREVIEW_FILL"
    fill.data.energy = 350.0
    fill.data.size = 3.0

    target = stats["center"].copy()
    camera_position = Vector((3.6, -4.6, 2.9))
    bpy.ops.object.camera_add(location=camera_position)
    camera = bpy.context.object
    camera.name = "PREVIEW_CAMERA"
    camera.data.type = "ORTHO"
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera
    bpy.context.view_layer.update()
    minimum = stats["minimum"]
    maximum = stats["maximum"]
    corners = [
        Vector((x, y, z))
        for x in (minimum.x, maximum.x)
        for y in (minimum.y, maximum.y)
        for z in (minimum.z, maximum.z)
    ]
    basis = camera.matrix_world.to_3x3()
    right = basis.col[0].normalized()
    up = basis.col[1].normalized()
    projected_x = [(corner - target).dot(right) for corner in corners]
    projected_y = [(corner - target).dot(up) for corner in corners]
    projected_width = max(projected_x) - min(projected_x)
    projected_height = max(projected_y) - min(projected_y)
    camera.data.ortho_scale = max(projected_height, projected_width / (1920 / 1080)) * 1.95

    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.render.filepath = preview
    scene.view_settings.look = "AgX - Medium High Contrast"
    world = bpy.data.worlds.new("Preview_World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.055, 0.06, 0.07, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.32
    scene.world = world
    bpy.ops.render.render(write_still=True)
    if not os.path.isfile(preview) or os.path.getsize(preview) < 10_000:
        raise RuntimeError("Clay preview was not produced correctly")
    print("PREVIEW_PATH", preview)
    print("PREVIEW_RESOLUTION", scene.render.resolution_x, scene.render.resolution_y)


def main():
    args = parse_args()
    config = ASSETS[args.asset]
    source = os.path.abspath(args.source)
    output = os.path.abspath(args.output)
    preview = os.path.abspath(args.preview)
    if os.path.normcase(source) == os.path.normcase(output):
        raise RuntimeError("Refusing to overwrite the source asset")
    print("SOURCE_ARGUMENT", args.source)

    clear_scene()
    objects = import_source(source, config)
    source_mesh_count = sum(obj.type == "MESH" for obj in objects)
    source_stats = inspect_asset(objects, "SOURCE")
    validate_source(args.asset, config, source_stats)
    remove_cameras_and_lights(objects)
    root = create_canonical_root(objects, source_stats, config)
    canonical_stats = inspect_asset(objects, "CANONICAL")
    if canonical_stats["mesh_count"] != source_mesh_count:
        raise RuntimeError("Mesh count changed during standardization")

    top_bounds = None
    anchors = None
    if args.asset == "D4":
        top_bounds = desk_top_bounds(canonical_stats)
        anchors = create_desk_anchors(root, top_bounds)
        root["desk_top_z"] = top_bounds[4]
        root["desk_top_bounds"] = list(top_bounds)
    if args.asset == "C1":
        top_bounds = chair_seat_bounds(canonical_stats)
        create_chair_anchor(root, top_bounds)
        anchors = {"CHAIR_SEAT_ANCHOR": top_bounds[:4]}
        root["chair_seat_z"] = top_bounds[4]
        root["chair_seat_bounds"] = list(top_bounds)
    if args.asset in ("M1", "K1", "L1"):
        anchors = {}
        anchor_name = BASE_ANCHORS[args.asset]
        create_base_anchor(root, canonical_stats, anchor_name)
        anchors[anchor_name] = True
        if args.asset == "M1":
            root["monitor_front_direction"] = (0.0, -1.0, 0.0)
            print("MONITOR_FRONT_DIRECTION", (0.0, -1.0, 0.0))
        if args.asset == "L1":
            create_light_anchor(root, canonical_stats, "LIGHT_DESK_ANCHOR")
            anchors["LIGHT_DESK_ANCHOR"] = True
    validate_canonical(args.asset, config, root, objects, canonical_stats, top_bounds, anchors)
    root["canonical_bounds_min"] = list(canonical_stats["minimum"])
    root["canonical_bounds_max"] = list(canonical_stats["maximum"])
    root["canonical_triangles"] = canonical_stats["triangles"]

    os.makedirs(os.path.dirname(output), exist_ok=True)
    os.makedirs(os.path.dirname(preview), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=output)
    print("STANDARDIZED_BLEND", output)
    print("ROOT_TRANSFORM", tuple(root.location), tuple(root.rotation_euler), tuple(root.scale))
    render_preview(args.asset, preview, root, objects, canonical_stats)
    print(f"{args.asset}_STANDARDIZATION_OK")


if __name__ == "__main__":
    main()
