"""Build the VQ-1C polished S6 sofa from a read-only canonical reference."""

import argparse
import math
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
OPTIONAL_PARTS = ("SOFA_BACK_FRAME",)


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--preview", required=True)
    return parser.parse_args(argv)


def world_bounds(objects):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    triangles = 0
    for obj in objects:
        if obj.type != "MESH":
            continue
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
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
    if minimum.x == float("inf"):
        raise RuntimeError("No mesh geometry found")
    return minimum, maximum, triangles


def read_reference(input_path):
    if not os.path.isfile(input_path):
        raise RuntimeError(f"Reference Blend does not exist: {input_path}")
    bpy.ops.wm.open_mainfile(filepath=input_path)
    bpy.context.view_layer.update()
    root = bpy.data.objects.get("STD_SOFA_ROOT")
    if root is None:
        raise RuntimeError("Reference is missing STD_SOFA_ROOT")
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    minimum, maximum, triangles = world_bounds(meshes)
    dimensions = maximum - minimum
    center = (minimum + maximum) * 0.5
    print("REFERENCE_BOUNDS", tuple(minimum), tuple(maximum))
    print("REFERENCE_DIMENSIONS", tuple(dimensions))
    print("REFERENCE_CENTER", tuple(center), "REFERENCE_TRIANGLES", triangles)
    if max(abs(dimensions[index] - expected) for index, expected in enumerate((1.88, 0.884, 0.766))) > 0.01:
        raise RuntimeError(f"Unexpected canonical sofa dimensions: {tuple(dimensions)}")
    return minimum.copy(), maximum.copy(), dimensions.copy()


def clear_scene_and_orphans():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.curves, bpy.data.cameras, bpy.data.lights):
        for item in list(collection):
            if item.users == 0:
                collection.remove(item)


def material(name, color, roughness):
    value = bpy.data.materials.new(name)
    value.use_nodes = True
    shader = value.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = 0.0
    return value


def activate_only(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def apply_modifier(obj, modifier):
    activate_only(obj)
    bpy.ops.object.modifier_apply(modifier=modifier.name)


def parent_preserve_world(obj, root):
    matrix = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = matrix


def normalize_mesh_dimensions(obj, target_dimensions):
    obj.dimensions = target_dimensions
    bpy.context.view_layer.update()
    activate_only(obj)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)


def create_hard_box(name, center, dimensions, bevel_width, root, assigned_material):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=center)
    obj = bpy.context.object
    obj.name = name
    normalize_mesh_dimensions(obj, dimensions)
    bevel = obj.modifiers.new("Hard_Edge_Bevel", "BEVEL")
    bevel.width = bevel_width
    bevel.segments = 2
    bevel.limit_method = "ANGLE"
    apply_modifier(obj, bevel)
    normalize_mesh_dimensions(obj, dimensions)
    obj.data.materials.append(assigned_material)
    parent_preserve_world(obj, root)
    return obj


def deform_soft_cushion(obj, depression, front_bulge, asymmetry):
    coordinates = [vertex.co.copy() for vertex in obj.data.vertices]
    minimum = Vector(tuple(min(point[index] for point in coordinates) for index in range(3)))
    maximum = Vector(tuple(max(point[index] for point in coordinates) for index in range(3)))
    center = (minimum + maximum) * 0.5
    half = (maximum - minimum) * 0.5
    for vertex in obj.data.vertices:
        x = (vertex.co.x - center.x) / max(half.x, 1e-6)
        y = (vertex.co.y - center.y) / max(half.y, 1e-6)
        z = (vertex.co.z - center.z) / max(half.z, 1e-6)
        core_x = max(0.0, 1.0 - x * x)
        core_y = max(0.0, 1.0 - y * y)
        core_z = max(0.0, 1.0 - z * z)
        if z > 0.15:
            vertex.co.z -= depression * core_x * core_y * min(1.0, z)
        if y < -0.15:
            vertex.co.y -= front_bulge * core_x * core_z * min(1.0, -y)
        vertex.co.z += asymmetry * x * core_y * 0.5
    obj.data.update()


def create_soft_cushion(
    name,
    center,
    dimensions,
    bevel_width,
    depression,
    front_bulge,
    asymmetry,
    root,
    assigned_material,
):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=center)
    obj = bpy.context.object
    obj.name = name
    normalize_mesh_dimensions(obj, dimensions)
    bevel = obj.modifiers.new("Cushion_Bevel", "BEVEL")
    bevel.width = bevel_width
    bevel.segments = 4
    bevel.limit_method = "ANGLE"
    apply_modifier(obj, bevel)
    subdivision = obj.modifiers.new("Cushion_Subdivision_1", "SUBSURF")
    subdivision.subdivision_type = "CATMULL_CLARK"
    subdivision.levels = 1
    subdivision.render_levels = 1
    apply_modifier(obj, subdivision)
    deform_soft_cushion(obj, depression, front_bulge, asymmetry)
    normalize_mesh_dimensions(obj, dimensions)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    obj.data.materials.append(assigned_material)
    parent_preserve_world(obj, root)
    return obj


def create_legs(root, assigned_material):
    vertices = []
    faces = []
    specifications = (
        (-0.77, -0.31, -0.025, -0.020),
        (0.77, -0.31, 0.025, -0.020),
        (-0.77, 0.31, -0.025, 0.020),
        (0.77, 0.31, 0.025, 0.020),
    )
    for top_x, top_y, x_splay, y_splay in specifications:
        offset = len(vertices)
        bottom_x = top_x + x_splay
        bottom_y = top_y + y_splay
        top_half = 0.050
        bottom_half = 0.037
        vertices.extend(
            [
                (bottom_x - bottom_half, bottom_y - bottom_half, 0.0),
                (bottom_x + bottom_half, bottom_y - bottom_half, 0.0),
                (bottom_x + bottom_half, bottom_y + bottom_half, 0.0),
                (bottom_x - bottom_half, bottom_y + bottom_half, 0.0),
                (top_x - top_half, top_y - top_half, 0.16),
                (top_x + top_half, top_y - top_half, 0.16),
                (top_x + top_half, top_y + top_half, 0.16),
                (top_x - top_half, top_y + top_half, 0.16),
            ]
        )
        faces.extend(
            [
                (offset + 0, offset + 1, offset + 2, offset + 3),
                (offset + 4, offset + 7, offset + 6, offset + 5),
                (offset + 0, offset + 4, offset + 5, offset + 1),
                (offset + 1, offset + 5, offset + 6, offset + 2),
                (offset + 2, offset + 6, offset + 7, offset + 3),
                (offset + 3, offset + 7, offset + 4, offset + 0),
            ]
        )
    mesh = bpy.data.meshes.new("SOFA_LEGS_MESH")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("SOFA_LEGS", mesh)
    bpy.context.collection.objects.link(obj)
    bevel = obj.modifiers.new("Leg_Bevel", "BEVEL")
    bevel.width = 0.008
    bevel.segments = 2
    apply_modifier(obj, bevel)
    obj.data.materials.append(assigned_material)
    parent_preserve_world(obj, root)
    return obj


def build_polished_sofa(reference_dimensions):
    root = bpy.data.objects.new(ROOT_NAME, None)
    bpy.context.collection.objects.link(root)
    root.location = (0.0, 0.0, 0.0)
    root.rotation_euler = (0.0, 0.0, 0.0)
    root.scale = (1.0, 1.0, 1.0)

    fabric = material("Sofa_Fabric_Clay", (0.61, 0.60, 0.58), 0.78)
    base_material = material("Sofa_Base_Clay", (0.43, 0.43, 0.42), 0.82)
    legs_material = material("Sofa_Legs_Clay", (0.25, 0.25, 0.24), 0.70)

    parts = []
    parts.append(create_hard_box("SOFA_BASE", (0.0, 0.0, 0.245), (1.70, 0.78, 0.23), 0.018, root, base_material))
    parts.append(create_hard_box("SOFA_BACK_FRAME", (0.0, 0.420, 0.520), (1.70, 0.044, 0.40), 0.012, root, base_material))
    parts.append(create_hard_box("SOFA_ARM_LEFT", (-0.875, 0.0, 0.44), (0.13, 0.884, 0.54), 0.022, root, fabric))
    parts.append(create_hard_box("SOFA_ARM_RIGHT", (0.875, 0.0, 0.44), (0.13, 0.884, 0.54), 0.022, root, fabric))
    parts.append(
        create_soft_cushion(
            "SOFA_SEAT_CUSHION_LEFT", (-0.395, -0.085, 0.415), (0.76, 0.63, 0.18),
            0.030, 0.010, 0.010, -0.003, root, fabric,
        )
    )
    parts.append(
        create_soft_cushion(
            "SOFA_SEAT_CUSHION_RIGHT", (0.395, -0.080, 0.417), (0.76, 0.63, 0.18),
            0.032, 0.012, 0.009, 0.002, root, fabric,
        )
    )
    parts.append(
        create_soft_cushion(
            "SOFA_BACK_CUSHION_LEFT", (-0.395, 0.310, 0.573), (0.76, 0.19, 0.386),
            0.045, 0.006, 0.012, -0.004, root, fabric,
        )
    )
    parts.append(
        create_soft_cushion(
            "SOFA_BACK_CUSHION_RIGHT", (0.395, 0.312, 0.573), (0.76, 0.19, 0.386),
            0.047, 0.005, 0.011, 0.003, root, fabric,
        )
    )
    parts.append(create_legs(root, legs_material))
    bpy.context.view_layer.update()
    return root, parts


def bounds_for_object(obj):
    minimum, maximum, triangles = world_bounds([obj])
    return minimum, maximum, maximum - minimum, triangles


def strict_overlap(a_min, a_max, b_min, b_max, tolerance=0.002):
    overlap = [min(a_max[index], b_max[index]) - max(a_min[index], b_min[index]) for index in range(3)]
    return all(value > tolerance for value in overlap), overlap


def validate_before_save(root, parts, reference_dimensions):
    failures = []
    objects = list(bpy.context.scene.objects)
    meshes = [obj for obj in objects if obj.type == "MESH"]
    names = {obj.name for obj in meshes}
    for name in REQUIRED_PARTS:
        if name not in names:
            failures.append(f"missing required part {name}")
    if not root.location.length <= 1e-9:
        failures.append("root location is not zero")
    if max(abs(value) for value in root.rotation_euler) > 1e-9:
        failures.append("root rotation is not zero")
    if max(abs(value - 1.0) for value in root.scale) > 1e-9:
        failures.append("root scale is not one")
    if any(obj.type in {"CAMERA", "LIGHT"} for obj in objects):
        failures.append("polished asset contains a camera or light")
    for obj in meshes:
        if obj.parent != root:
            failures.append(f"{obj.name} is not parented to {ROOT_NAME}")
        if len(obj.data.vertices) == 0:
            failures.append(f"{obj.name} is empty")
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-6:
            failures.append(f"{obj.name} has non-uniform scale: {tuple(scale)}")
        if max(abs(value - 1.0) for value in obj.scale) > 1e-6:
            failures.append(f"{obj.name} local scale is not identity: {tuple(obj.scale)}")
        minimum, maximum, dimensions, triangles = bounds_for_object(obj)
        print(
            "POLISHED_PART", obj.name,
            "bounds_min=", tuple(round(value, 6) for value in minimum),
            "bounds_max=", tuple(round(value, 6) for value in maximum),
            "dimensions=", tuple(round(value, 6) for value in dimensions),
            "triangles=", triangles,
        )

    minimum, maximum, triangles = world_bounds(meshes)
    dimensions = maximum - minimum
    center = (minimum + maximum) * 0.5
    print("POLISHED_BOUNDS", tuple(minimum), tuple(maximum))
    print("POLISHED_DIMENSIONS", tuple(dimensions), "CENTER", tuple(center), "TRIANGLES", triangles)
    for index in range(3):
        if abs(dimensions[index] - reference_dimensions[index]) / reference_dimensions[index] > 0.03:
            failures.append(f"dimension axis {index} differs from reference by more than 3%")
    if abs(minimum.z) > 0.001:
        failures.append(f"minZ is not zero: {minimum.z}")
    if abs(center.x) > 0.001 or abs(center.y) > 0.001:
        failures.append(f"horizontal center is not zero: {tuple(center)}")
    if not (dimensions.x > dimensions.y and dimensions.x > dimensions.z):
        failures.append(f"longest axis is not X: {tuple(dimensions)}")
    if triangles > 25_000:
        failures.append(f"triangle budget exceeded: {triangles}")

    part_bounds = {obj.name: bounds_for_object(obj)[:2] for obj in meshes}
    for left, right in (
        ("SOFA_SEAT_CUSHION_LEFT", "SOFA_SEAT_CUSHION_RIGHT"),
        ("SOFA_BACK_CUSHION_LEFT", "SOFA_BACK_CUSHION_RIGHT"),
    ):
        overlaps, values = strict_overlap(*part_bounds[left], *part_bounds[right])
        if overlaps:
            failures.append(f"{left} and {right} overlap: {values}")
    for cushion in (
        "SOFA_SEAT_CUSHION_LEFT", "SOFA_SEAT_CUSHION_RIGHT",
        "SOFA_BACK_CUSHION_LEFT", "SOFA_BACK_CUSHION_RIGHT",
    ):
        for arm in ("SOFA_ARM_LEFT", "SOFA_ARM_RIGHT"):
            overlaps, values = strict_overlap(*part_bounds[cushion], *part_bounds[arm])
            if overlaps:
                failures.append(f"{cushion} severely intersects {arm}: {values}")

    if failures:
        raise RuntimeError("Polished sofa pre-save validation failed:\n- " + "\n- ".join(failures))
    root["reference_dimensions"] = list(reference_dimensions)
    root["presave_bounds_min"] = list(minimum)
    root["presave_bounds_max"] = list(maximum)
    root["presave_triangles"] = triangles
    root["required_parts"] = list(REQUIRED_PARTS)
    return minimum, maximum, dimensions, triangles


def render_preview(preview_path, bounds_minimum, bounds_maximum):
    target = (bounds_minimum + bounds_maximum) * 0.5
    ground_material = material("Preview_Ground", (0.30, 0.30, 0.30), 0.90)
    bpy.ops.mesh.primitive_plane_add(size=8.0, location=(0.0, 0.0, -0.006))
    ground = bpy.context.object
    ground.name = "PREVIEW_GROUND"
    ground.data.materials.append(ground_material)
    bpy.ops.object.light_add(type="AREA", location=(-3.0, -4.5, 5.5))
    key = bpy.context.object
    key.data.energy = 900.0
    key.data.shape = "DISK"
    key.data.size = 4.5
    bpy.ops.object.light_add(type="AREA", location=(4.0, 1.5, 3.0))
    fill = bpy.context.object
    fill.data.energy = 380.0
    fill.data.size = 4.0
    camera_position = Vector((3.7, -4.8, 2.9))
    bpy.ops.object.camera_add(location=camera_position)
    camera = bpy.context.object
    camera.data.type = "ORTHO"
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera
    bpy.context.view_layer.update()
    corners = [
        Vector((x, y, z))
        for x in (bounds_minimum.x, bounds_maximum.x)
        for y in (bounds_minimum.y, bounds_maximum.y)
        for z in (bounds_minimum.z, bounds_maximum.z)
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
    scene.render.filepath = preview_path
    scene.view_settings.look = "AgX - Medium High Contrast"
    world = bpy.data.worlds.new("Preview_World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.06, 0.065, 0.07, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.34
    scene.world = world
    bpy.ops.render.render(write_still=True)
    if not os.path.isfile(preview_path) or os.path.getsize(preview_path) < 10_000:
        raise RuntimeError("Polished sofa preview was not produced correctly")
    print("POLISHED_PREVIEW", preview_path, "resolution=", (1920, 1080))


def main():
    args = parse_args()
    input_path = os.path.abspath(args.input)
    output_path = os.path.abspath(args.output)
    preview_path = os.path.abspath(args.preview)
    if os.path.normcase(input_path) == os.path.normcase(output_path):
        raise RuntimeError("Refusing to overwrite the standardized sofa reference")
    _, _, reference_dimensions = read_reference(input_path)
    clear_scene_and_orphans()
    root, parts = build_polished_sofa(reference_dimensions)
    minimum, maximum, dimensions, triangles = validate_before_save(root, parts, reference_dimensions)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    os.makedirs(os.path.dirname(preview_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=output_path)
    print("POLISHED_BLEND", output_path)
    print("POLISHED_ROOT", tuple(root.location), tuple(root.rotation_euler), tuple(root.scale))
    print("POLISHED_FINAL", tuple(dimensions), "triangles=", triangles)
    render_preview(preview_path, minimum, maximum)
    print("VQ1C_POLISHED_SOFA_BUILD_OK")


if __name__ == "__main__":
    main()
