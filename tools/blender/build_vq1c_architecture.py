"""Build the standalone VQ-1C Gate 2 architecture shell and clay preview."""

import argparse
import math
import os
import sys

import bpy
from mathutils import Vector


ROOT_NAME = "HERO_ARCH_ROOT"
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
TOLERANCE = 0.001


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--preview", required=True)
    return parser.parse_args(argv)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def create_box(name, center, dimensions, parent):
    """Create one box using explicit final dimensions and an identity parent."""
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler = (0.0, 0.0, 0.0)
    obj.dimensions = dimensions
    bpy.context.view_layer.update()
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    world_matrix = obj.matrix_world.copy()
    obj.parent = parent
    obj.matrix_world = world_matrix
    bpy.context.view_layer.update()
    return obj


def world_bounds(obj):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    try:
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
    return minimum, maximum


def combined_bounds(objects):
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    for obj in objects:
        obj_minimum, obj_maximum = world_bounds(obj)
        minimum.x = min(minimum.x, obj_minimum.x)
        minimum.y = min(minimum.y, obj_minimum.y)
        minimum.z = min(minimum.z, obj_minimum.z)
        maximum.x = max(maximum.x, obj_maximum.x)
        maximum.y = max(maximum.y, obj_maximum.y)
        maximum.z = max(maximum.z, obj_maximum.z)
    return minimum, maximum


def close_vector(actual, expected, tolerance=TOLERANCE):
    return max(abs(actual[index] - expected[index]) for index in range(3)) <= tolerance


def validate_before_save(root, objects):
    failures = []
    if root.location.length > 1e-9:
        failures.append(f"root location is not zero: {tuple(root.location)}")
    if max(abs(value) for value in root.rotation_euler) > 1e-9:
        failures.append(f"root rotation is not zero: {tuple(root.rotation_euler)}")
    if max(abs(value - 1.0) for value in root.scale) > 1e-9:
        failures.append(f"root scale is not one: {tuple(root.scale)}")
    if len(objects) != len(EXPECTED):
        failures.append(f"mesh count {len(objects)} != {len(EXPECTED)}")

    for name, (expected_center, expected_dimensions) in EXPECTED.items():
        obj = bpy.data.objects.get(name)
        if obj is None or obj.type != "MESH":
            failures.append(f"missing mesh {name}")
            continue
        if obj.parent != root:
            failures.append(f"{name} is not parented to {ROOT_NAME}")
        if max(abs(value) for value in obj.rotation_euler) > 1e-9:
            failures.append(f"{name} rotation is not zero")
        if max(abs(value - 1.0) for value in obj.scale) > 1e-6:
            failures.append(f"{name} scale is not identity: {tuple(obj.scale)}")
        minimum, maximum = world_bounds(obj)
        center = (minimum + maximum) * 0.5
        dimensions = maximum - minimum
        print(
            "ARCH_OBJECT",
            name,
            "center=", tuple(round(value, 6) for value in center),
            "dimensions=", tuple(round(value, 6) for value in dimensions),
            "bounds_min=", tuple(round(value, 6) for value in minimum),
            "bounds_max=", tuple(round(value, 6) for value in maximum),
        )
        if not close_vector(center, expected_center):
            failures.append(f"{name} center mismatch: {tuple(center)}")
        if not close_vector(dimensions, expected_dimensions):
            failures.append(f"{name} dimensions mismatch: {tuple(dimensions)}")
        if max(dimensions) > 6.0 + TOLERANCE:
            failures.append(f"{name} has an abnormal dimension: {tuple(dimensions)}")
        if minimum.z < -0.081:
            failures.append(f"{name} is too low: {minimum.z}")
        if name != "FLOOR" and maximum.z > 3.001:
            failures.append(f"{name} is too high: {maximum.z}")
        if len(obj.data.vertices) == 0:
            failures.append(f"{name} is empty")

    floor_minimum, floor_maximum = world_bounds(bpy.data.objects["FLOOR"])
    if abs(floor_maximum.z) > TOLERANCE:
        failures.append(f"floor top is not z=0: {floor_maximum.z}")

    left_minimum, left_maximum = world_bounds(bpy.data.objects["BACK_WALL_LEFT"])
    right_minimum, right_maximum = world_bounds(bpy.data.objects["BACK_WALL_RIGHT"])
    bottom_minimum, bottom_maximum = world_bounds(bpy.data.objects["BACK_WALL_BOTTOM"])
    top_minimum, top_maximum = world_bounds(bpy.data.objects["BACK_WALL_TOP"])
    actual_window = (left_maximum.x, right_minimum.x, bottom_maximum.z, top_minimum.z)
    expected_window = WINDOW_BOUNDS
    if max(abs(actual_window[index] - expected_window[index]) for index in range(4)) > TOLERANCE:
        failures.append(f"window opening mismatch: {actual_window}")
    if abs(bottom_minimum.x - WINDOW_BOUNDS[0]) > TOLERANCE or abs(bottom_maximum.x - WINDOW_BOUNDS[1]) > TOLERANCE:
        failures.append("bottom wall does not align with window sides")
    if abs(top_minimum.x - WINDOW_BOUNDS[0]) > TOLERANCE or abs(top_maximum.x - WINDOW_BOUNDS[1]) > TOLERANCE:
        failures.append("top wall does not align with window sides")

    for frame_name in ("FRAME_LEFT", "FRAME_RIGHT", "FRAME_BOTTOM", "FRAME_TOP", "GLASS_PLACEHOLDER"):
        minimum, maximum = world_bounds(bpy.data.objects[frame_name])
        if minimum.x < WINDOW_BOUNDS[0] - TOLERANCE or maximum.x > WINDOW_BOUNDS[1] + TOLERANCE:
            failures.append(f"{frame_name} exceeds the window opening in X")
        if minimum.z < WINDOW_BOUNDS[2] - TOLERANCE or maximum.z > WINDOW_BOUNDS[3] + TOLERANCE:
            failures.append(f"{frame_name} exceeds the window opening in Z")

    glass_dimensions = Vector(EXPECTED["GLASS_PLACEHOLDER"][1])
    if not (glass_dimensions.y < glass_dimensions.x and glass_dimensions.y < glass_dimensions.z):
        failures.append("glass thickness is not along Y")

    scene_objects = list(bpy.context.scene.objects)
    if any(obj.type in {"CAMERA", "LIGHT"} for obj in scene_objects):
        failures.append("saved architecture contains a camera or light")
    if failures:
        raise RuntimeError("Gate 2 pre-save validation failed:\n- " + "\n- ".join(failures))

    overall_minimum, overall_maximum = combined_bounds(objects)
    root["gate2_presave_bounds_min"] = list(overall_minimum)
    root["gate2_presave_bounds_max"] = list(overall_maximum)
    root["gate2_window_bounds"] = list(WINDOW_BOUNDS)
    print("ARCH_WINDOW_BOUNDS", WINDOW_BOUNDS, "dimensions=", (1.50, 1.20))
    print("ARCH_OVERALL_BOUNDS", tuple(overall_minimum), tuple(overall_maximum))


def make_material(name, color, roughness):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = 0.0
    return material


def render_preview(preview, objects):
    wall_material = make_material("Gate2_Wall_Clay", (0.66, 0.65, 0.62), 0.78)
    trim_material = make_material("Gate2_Trim_Clay", (0.40, 0.42, 0.44), 0.72)
    glass_material = make_material("Gate2_Glass_Placeholder", (0.24, 0.34, 0.39), 0.62)
    floor_material = make_material("Gate2_Floor_Clay", (0.31, 0.30, 0.29), 0.86)
    for obj in objects:
        obj.data.materials.clear()
        if obj.name == "FLOOR":
            obj.data.materials.append(floor_material)
        elif obj.name.startswith("FRAME_") or obj.name.startswith("BASEBOARD_") or obj.name == "WINDOW_SILL":
            obj.data.materials.append(trim_material)
        elif obj.name == "GLASS_PLACEHOLDER":
            obj.data.materials.append(glass_material)
        else:
            obj.data.materials.append(wall_material)

    overall_minimum, overall_maximum = combined_bounds(objects)
    target = (overall_minimum + overall_maximum) * 0.5
    direction = Vector((6.5, -8.0, 5.2)).normalized()
    camera_position = target + direction * 12.0
    bpy.ops.object.camera_add(location=camera_position)
    camera = bpy.context.object
    camera.name = "PREVIEW_CAMERA"
    camera.data.type = "ORTHO"
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera
    bpy.context.view_layer.update()

    corners = [
        Vector((x, y, z))
        for x in (overall_minimum.x, overall_maximum.x)
        for y in (overall_minimum.y, overall_maximum.y)
        for z in (overall_minimum.z, overall_maximum.z)
    ]
    basis = camera.matrix_world.to_3x3()
    right = basis.col[0].normalized()
    up = basis.col[1].normalized()
    projected_x = [(corner - target).dot(right) for corner in corners]
    projected_y = [(corner - target).dot(up) for corner in corners]
    projected_width = max(projected_x) - min(projected_x)
    projected_height = max(projected_y) - min(projected_y)
    camera.data.ortho_scale = max(projected_height, projected_width / (1920 / 1080)) * 2.0

    bpy.ops.object.light_add(type="AREA", location=(-1.5, -3.5, 8.0))
    key = bpy.context.object
    key.name = "PREVIEW_KEY"
    key.data.energy = 1100.0
    key.data.shape = "DISK"
    key.data.size = 6.0
    bpy.ops.object.light_add(type="AREA", location=(5.0, -1.0, 4.0))
    fill = bpy.context.object
    fill.name = "PREVIEW_FILL"
    fill.data.energy = 500.0
    fill.data.size = 5.0

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
    scene.render.filepath = preview
    scene.view_settings.look = "AgX - Medium High Contrast"
    world = bpy.data.worlds.new("Gate2_World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.045, 0.05, 0.055, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.38
    scene.world = world
    bpy.ops.render.render(write_still=True)
    if not os.path.isfile(preview) or os.path.getsize(preview) < 10_000:
        raise RuntimeError("Architecture clay preview was not produced correctly")
    print("ARCH_PREVIEW", preview, "resolution=", (1920, 1080))


def main():
    args = parse_args()
    output = os.path.abspath(args.output)
    preview = os.path.abspath(args.preview)
    clear_scene()
    root = bpy.data.objects.new(ROOT_NAME, None)
    bpy.context.collection.objects.link(root)
    root.location = (0.0, 0.0, 0.0)
    root.rotation_euler = (0.0, 0.0, 0.0)
    root.scale = (1.0, 1.0, 1.0)
    objects = [create_box(name, center, dimensions, root) for name, (center, dimensions) in EXPECTED.items()]
    validate_before_save(root, objects)

    os.makedirs(os.path.dirname(output), exist_ok=True)
    os.makedirs(os.path.dirname(preview), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=output)
    print("ARCH_STANDARDIZED_BLEND", output)
    print("ARCH_ROOT_TRANSFORM", tuple(root.location), tuple(root.rotation_euler), tuple(root.scale))
    render_preview(preview, objects)
    print("GATE2_BUILD_OK")


if __name__ == "__main__":
    main()
