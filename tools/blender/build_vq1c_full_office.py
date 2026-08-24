"""Build the contract-aligned VQ-1C full OfficeWorld PBR scene."""

import argparse
import json
import math
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Matrix, Vector


REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_PATH = REPO_ROOT / "docs/assets/vq1c-officeworld-coordinate-contract.json"
PBR_SOURCE = REPO_ROOT / "assets-source/blender/vq1c/pbr/vq1c-hero-corner-pbr.blend"
VP2_TEXTURE_DIR = REPO_ROOT / "assets-source/blender/vq1c/full-office/textures/vp2"
OUTPUT_BLEND = REPO_ROOT / "assets-source/blender/vq1c/full-office/vq1c-officeworld-full-pbr.blend"
OUTPUT_GLB = REPO_ROOT / "public/models/vq1/vq1c-officeworld-full-pbr.glb"
OUTPUT_MANIFEST = REPO_ROOT / "assets-source/blender/vq1c/full-office/vq1c-officeworld-full-manifest.json"
OUTPUT_PREVIEW = REPO_ROOT / "outputs/vq-1c/full-office/10-officeworld-full-pbr.png"

FULL_ROOT = "VQ1C_FULL_OFFICE_ROOT"
ARCH_ROOT = "OFFICE_ARCH_ROOT"
WORKSTATIONS_ROOT = "OFFICE_WORKSTATIONS_ROOT"
AMENITIES_ROOT = "OFFICE_AMENITIES_ROOT"
ANCHORS_ROOT = "OFFICE_ANCHORS_ROOT"
EXPECTED_WORKSTATION_MESHES = 73
EXPECTED_WORKSTATION_TRIANGLES = 12544
EXPECTED_SOFA_MESHES = 9
EXPECTED_SOFA_TRIANGLES = 5664
REQUIRED_MATERIALS = {
    "VQ_Wall_Plaster", "VQ_Floor_Wood", "VQ_Desk_Wood", "VQ_Trim_Warm",
    "VQ_Window_Frame", "VQ_Window_Glass", "VQ_Sofa_Fabric", "VQ_Sofa_Fabric_Accent",
    "VQ_Chair_Fabric", "VQ_Metal_Charcoal", "VQ_Plastic_Dark", "VQ_Keycap",
    "VQ_Screen_Glass", "VQ_Lamp_Shade", "VQ_Lamp_Inner", "VQ_Sofa_Legs",
    "VQ_Rug_Muted", "VQ_Rug_Sofa_Muted", "VQ_Accent_Terracotta",
}

# VP2 Gate 2A/2B: per-part visual proportion rescale, baked into geometry.
# Each entry maps a source object name to (pivot, scale) in mesh-local space.
# Pivots keep authoritative contact planes fixed (desk top face, leg feet,
# seat top, monitor base). Unique mesh datablocks are transformed exactly once;
# all four workstation copies share the same datablocks.
# 2B extends 2A for far-camera silhouette legibility: heavier desk/chair
# structure, a slightly larger monitor, and a rounder chair back.
WORKSTATION_RESCALE = {
    "DESK_TOP": ((0.0, 0.0, 0.0225), (1.155, 1.155, 1.36)),
    "DESK_FRAME_LEFT": ((0.0, 0.0, 0.0), (1.38, 1.20, 1.00)),
    "DESK_FRAME_RIGHT": ((0.0, 0.0, 0.0), (1.38, 1.20, 1.00)),
    "DESK_FEET_L": ((0.0, 0.0, 0.0), (1.38, 1.20, 1.00)),
    "DESK_FEET_R": ((0.0, 0.0, 0.0), (1.38, 1.20, 1.00)),
    "DESK_CROSSBAR": ((0.0, 0.0, 0.0), (1.00, 1.43, 1.43)),
    "DESK_MODESTY_PANEL": ((0.0, 0.0, 0.0), (1.05, 1.20, 1.00)),
    "CHAIR_SEAT_CUSHION": ((0.0, 0.0, 0.0), (1.177, 1.177, 1.00)),
    "CHAIR_BACK_CUSHION": ((0.0, 0.0, 0.0), (1.21, 1.21, 1.03)),
    "CHAIR_SUPPORT_FRAME": ((0.0, 0.0, 0.0), (1.21, 1.21, 1.20)),
    "CHAIR_COLUMN": ((0.0, 0.0, 0.0), (1.38, 1.38, 1.00)),
    "CHAIR_STAR_BASE_HUB": ((0.0, 0.0, 0.0), (1.3225, 1.3225, 1.00)),
    "CHAIR_STAR_BASE_ARM_1": ((0.0, 0.0, 0.0), (1.20, 1.375, 1.375)),
    "CHAIR_STAR_BASE_ARM_2": ((0.0, 0.0, 0.0), (1.20, 1.375, 1.375)),
    "CHAIR_STAR_BASE_ARM_3": ((0.0, 0.0, 0.0), (1.20, 1.375, 1.375)),
    "CHAIR_STAR_BASE_ARM_4": ((0.0, 0.0, 0.0), (1.20, 1.375, 1.375)),
    "CHAIR_STAR_BASE_ARM_5": ((0.0, 0.0, 0.0), (1.20, 1.375, 1.375)),
    "CHAIR_CASTER_1": ((0.0, 0.0, 0.0), (1.3225, 1.3225, 1.00)),
    "CHAIR_CASTER_2": ((0.0, 0.0, 0.0), (1.3225, 1.3225, 1.00)),
    "CHAIR_CASTER_3": ((0.0, 0.0, 0.0), (1.3225, 1.3225, 1.00)),
    "CHAIR_CASTER_4": ((0.0, 0.0, 0.0), (1.3225, 1.3225, 1.00)),
    "CHAIR_CASTER_5": ((0.0, 0.0, 0.0), (1.3225, 1.3225, 1.00)),
    "CHAIR_ARM_LEFT": ((0.0, 0.0, 0.0), (1.43, 1.10, 1.32)),
    "CHAIR_ARM_RIGHT": ((0.0, 0.0, 0.0), (1.43, 1.10, 1.32)),
    "CHAIR_ARM_POST_L": ((0.0, 0.0, 0.0), (1.495, 1.495, 1.00)),
    "CHAIR_ARM_POST_R": ((0.0, 0.0, 0.0), (1.495, 1.495, 1.00)),
    "MONITOR_SCREEN_PANEL": ((0.0, 0.0, 0.0), (1.092, 1.00, 1.092)),
    "MONITOR_BEZEL": ((0.0, 0.0, 0.0), (1.092, 1.495, 1.092)),
    "MONITOR_BACK_SHELL": ((0.0, 0.0, 0.0), (1.092, 1.32, 1.092)),
    "MONITOR_NECK": ((0.0, 0.0, 0.0), (1.43, 1.43, 1.00)),
    "MONITOR_BASE": ((0.0, 0.0, 0.0), (1.32, 1.32, 1.00)),
    "MONITOR_BUTTON": ((0.0, 0.0, 0.0), (1.32, 1.32, 1.32)),
}

# 2B adds a final ~4% to the 2A sofa proportions (silhouette at camera range).
SOFA_RESCALE = {
    "SOFA_BASE": ((0.0, 0.0, 0.0), (1.165, 1.123, 1.00)),
    "SOFA_BACK_FRAME": ((0.0, 0.0, 0.0), (1.165, 1.04, 1.09)),
    "SOFA_BACK_CUSHION_LEFT": ((0.0, 0.0, 0.0), (1.165, 1.195, 1.123)),
    "SOFA_BACK_CUSHION_RIGHT": ((0.0, 0.0, 0.0), (1.165, 1.195, 1.123)),
    "SOFA_SEAT_CUSHION_LEFT": ((0.0, 0.0, 0.0), (1.165, 1.144, 1.144)),
    "SOFA_SEAT_CUSHION_RIGHT": ((0.0, 0.0, 0.0), (1.165, 1.144, 1.144)),
    "SOFA_ARM_LEFT": ((0.0, 0.0, 0.0), (1.25, 1.09, 1.09)),
    "SOFA_ARM_RIGHT": ((0.0, 0.0, 0.0), (1.25, 1.09, 1.09)),
    "SOFA_LEGS": ((0.0, 0.0, 0.0), (1.144, 1.144, 1.00)),
}

# ZZZ-principles palette overrides (sRGB hex -> Linear via srgb_to_linear).
RUG_MUTED_SRGB = "#6F7468"        # muted warm gray-green for work pod rugs
RUG_SOFA_SRGB = "#B2A48C"         # warm beige-gray for the sofa rug
ACCENT_TERRACOTTA_SRGB = "#A8674B"  # low-saturation terracotta accent
CHAIR_FABRIC_LINEAR = (0.28, 0.30, 0.27)  # warm gray-green fabric, readable at range


def mesh_local_bounds(mesh):
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    for vertex in mesh.vertices:
        for axis in range(3):
            minimum[axis] = min(minimum[axis], vertex.co[axis])
            maximum[axis] = max(maximum[axis], vertex.co[axis])
    return minimum, maximum


def srgb_channel_to_linear(value):
    if value <= 0.04045:
        return value / 12.92
    return ((value + 0.055) / 1.055) ** 2.4


def srgb_to_linear(hex_color):
    """Convert an '#RRGGBB' sRGB color to linear RGB (0..1) for Blender."""
    hex_color = hex_color.lstrip("#")
    if len(hex_color) != 6:
        raise ValueError(f"Invalid sRGB hex color: {hex_color}")
    return tuple(
        srgb_channel_to_linear(int(hex_color[index : index + 2], 16) / 255.0)
        for index in (0, 2, 4)
    )


def apply_rescale_spec(mesh, pivot, scale):
    """Bake a non-uniform scale about a mesh-local pivot into the datablock."""
    pivot_vector = Vector(pivot)
    scale_matrix = Matrix.Diagonal((scale[0], scale[1], scale[2], 1.0)).to_4x4()
    matrix = Matrix.Translation(pivot_vector) @ scale_matrix @ Matrix.Translation(-pivot_vector)
    mesh.transform(matrix)
    mesh.update()


def rescale_subtree(root, specs, label):
    """Transform each unique mesh datablock in a subtree exactly once."""
    processed = {}
    records = []
    for obj in descendants(root):
        if obj.type != "MESH":
            continue
        spec = specs.get(obj.name)
        if spec is None:
            continue
        datablock = obj.data
        if datablock.name in processed:
            continue
        processed[datablock.name] = obj.name
        before_min, before_max = mesh_local_bounds(datablock)
        apply_rescale_spec(datablock, spec[0], spec[1])
        after_min, after_max = mesh_local_bounds(datablock)
        print(
            f"VP2_RESCALE {label} {obj.name:26s} before=({tuple(round(v, 4) for v in before_min)}..{tuple(round(v, 4) for v in before_max)}) "
            f"after=({tuple(round(v, 4) for v in after_min)}..{tuple(round(v, 4) for v in after_max)})"
        )
        records.append({
            "object": obj.name,
            "beforeMin": rounded(before_min, 4),
            "beforeMax": rounded(before_max, 4),
            "afterMin": rounded(after_min, 4),
            "afterMax": rounded(after_max, 4),
        })
    print(f"VP2_RESCALE_TOTAL {label} datablocks={len(processed)}")
    return records


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--contract", default=str(CONTRACT_PATH))
    parser.add_argument("--source", default=str(PBR_SOURCE))
    parser.add_argument("--output", default=str(OUTPUT_BLEND))
    parser.add_argument("--glb", default=str(OUTPUT_GLB))
    parser.add_argument("--manifest", default=str(OUTPUT_MANIFEST))
    parser.add_argument("--preview", default=str(OUTPUT_PREVIEW))
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(argv)


def project_relative(path):
    return Path(path).resolve().relative_to(REPO_ROOT).as_posix()


def _floor_seam_stats():
    """Recompute the deterministic plank layout seam statistics.

    The texture generator owns the single source of truth for the plank
    layout; this re-imports that module and reports its deterministic stats.
    """
    import importlib.util
    generator_path = REPO_ROOT / "tools/blender/build_vq1c_vp2_floor_textures.py"
    spec = importlib.util.spec_from_file_location("build_vq1c_vp2_floor_textures", generator_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    row_count, total_seams, min_distance, pair, coords = module.seam_statistics()
    return {
        "rows": row_count,
        "totalSeams": total_seams,
        "minAdjacentRowSeamDistance": round(float(min_distance), 6),
        "minPairRows": list(pair) if pair else None,
        "minPairCoords": [round(float(value), 6) for value in coords] if coords else None,
    }


def load_contract(path):
    with Path(path).open("r", encoding="utf-8") as handle:
        contract = json.load(handle)
    if contract.get("schemaVersion") != 1:
        raise RuntimeError("Unsupported coordinate contract schema")
    if len(contract.get("workstations", [])) != 4 or len(contract.get("facilities", [])) != 8:
        raise RuntimeError("Coordinate contract must contain four workstations and eight facilities")
    if len(contract.get("unresolved", [])) != 5:
        raise RuntimeError("Coordinate contract unresolved items changed")
    return contract


def three_to_blender_position(position):
    x, y, z = position
    return Vector((x, -z, y))


def blender_to_three_direction(direction):
    x, y, z = direction
    return Vector((x, z, -y))


def three_rotation_y_to_blender_z(rotation_y):
    if isinstance(rotation_y, dict):
        return float(rotation_y["radians"])
    return float(rotation_y)


def descendants(root, include_root=False):
    result = [root] if include_root else []
    stack = list(root.children)
    while stack:
        obj = stack.pop()
        result.append(obj)
        stack.extend(obj.children)
    return result


def evaluated_triangles(objects):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    meshes = [obj for obj in objects if obj.type == "MESH"]
    triangles = 0
    empty_meshes = []
    for obj in meshes:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            if not mesh.vertices:
                empty_meshes.append(obj.name)
            mesh.calc_loop_triangles()
            triangles += len(mesh.loop_triangles)
        finally:
            evaluated.to_mesh_clear()
    return len(meshes), triangles, empty_meshes


def world_bounds(objects):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    found = False
    for obj in objects:
        if obj.type != "MESH":
            continue
        found = True
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            for vertex in mesh.vertices:
                point = evaluated.matrix_world @ vertex.co
                for axis in range(3):
                    minimum[axis] = min(minimum[axis], point[axis])
                    maximum[axis] = max(maximum[axis], point[axis])
        finally:
            evaluated.to_mesh_clear()
    if not found:
        raise RuntimeError("Cannot calculate bounds for an empty mesh set")
    return minimum, maximum


def rounded(vector, digits=6):
    return [round(float(value), digits) for value in vector]


def new_empty(name, parent=None, location=(0, 0, 0), rotation_z=0.0):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = 0.16
    if parent:
        obj.parent = parent
        obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.location = location
    obj.rotation_euler = (0.0, 0.0, rotation_z)
    obj.scale = (1.0, 1.0, 1.0)
    return obj


def assign_material(obj, material_name):
    material = bpy.data.materials.get(material_name)
    if material is None:
        raise RuntimeError(f"Required PBR material missing: {material_name}")
    obj.data.materials.clear()
    obj.data.materials.append(material)


def planar_uv(obj, meters_per_repeat=1.5):
    mesh = obj.data
    uv_layer = mesh.uv_layers.active or mesh.uv_layers.new(name="UVMap")
    for polygon in mesh.polygons:
        normal = polygon.normal
        axis = max(range(3), key=lambda index: abs(normal[index]))
        for loop_index in polygon.loop_indices:
            co = mesh.vertices[mesh.loops[loop_index].vertex_index].co
            if axis == 0:
                uv = (co.y / meters_per_repeat, co.z / meters_per_repeat)
            elif axis == 1:
                uv = (co.x / meters_per_repeat, co.z / meters_per_repeat)
            else:
                uv = (co.x / meters_per_repeat, co.y / meters_per_repeat)
            uv_layer.data[loop_index].uv = uv


def full_room_atlas_uv(obj, world_width, world_depth):
    """Map the object to UV [0,1] over its own full extents (no repeat)."""
    mesh = obj.data
    uv_layer = mesh.uv_layers.active or mesh.uv_layers.new(name="UVMap")
    minimum = Vector((float("inf"), float("inf"), float("inf")))
    maximum = Vector((float("-inf"), float("-inf"), float("-inf")))
    for vertex in mesh.vertices:
        for axis in range(3):
            minimum[axis] = min(minimum[axis], vertex.co[axis])
            maximum[axis] = max(maximum[axis], vertex.co[axis])
    size_x = maximum[0] - minimum[0]
    size_y = maximum[1] - minimum[1]
    if size_x <= 0.0 or size_y <= 0.0:
        raise RuntimeError("full_room_atlas_uv requires a non-degenerate XY footprint")
    for polygon in mesh.polygons:
        for loop_index in polygon.loop_indices:
            co = mesh.vertices[mesh.loops[loop_index].vertex_index].co
            uv_layer.data[loop_index].uv = ((co.x - minimum[0]) / size_x, (co.y - minimum[1]) / size_y)


def apply_vp2_floor_material():
    """Override the VQ_Floor_Wood material texture images with VP2 derived versions.

    Only the three floor texture nodes are re-pointed; all other PBR materials
    keep their original source textures.
    """
    material = bpy.data.materials.get("VQ_Floor_Wood")
    if material is None:
        raise RuntimeError("VQ_Floor_Wood material missing from PBR source")
    role_map = {"basecolor": "floor_wood_vp2_basecolor.png", "roughness": "floor_wood_vp2_roughness.png", "normal": "floor_wood_vp2_normal.png"}
    if not VP2_TEXTURE_DIR.is_dir():
        raise RuntimeError(f"VP2 floor texture directory missing: {VP2_TEXTURE_DIR}")
    replaced = []
    for node in material.node_tree.nodes:
        if node.type != "TEX_IMAGE" or not node.image:
            continue
        label = node.label
        filename = role_map.get(label)
        if not filename:
            continue
        image = bpy.data.images.get(Path(filename).stem)
        if image is None:
            image = bpy.data.images.load(str(VP2_TEXTURE_DIR / filename))
        image.colorspace_settings.name = "sRGB" if label == "basecolor" else "Non-Color"
        node.image = image
        node.extension = "EXTEND"  # full-room atlas: no periodic repeat
        replaced.append(label)
    if sorted(replaced) != ["basecolor", "normal", "roughness"]:
        raise RuntimeError(f"VP2 floor material override incomplete: {replaced}")
    print("VP2_FLOOR_MATERIAL_OVERRIDE", replaced)


def apply_vp2_wall_color():
    """Shift VQ_Wall_Plaster toward a slightly warm off-white (not pure white, not yellow)."""
    material = bpy.data.materials.get("VQ_Wall_Plaster")
    if material is None:
        raise RuntimeError("VQ_Wall_Plaster material missing from PBR source")
    for node in material.node_tree.nodes:
        if node.type == "TEX_IMAGE" and node.image:
            continue  # wall is untextured in PBR base pass; only adjust the BSDF base color
    bsdf = next((node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        raise RuntimeError("VQ_Wall_Plaster has no Principled BSDF node")
    # warm off-white: r/g/b slightly above original, g slightly dominant over r to avoid yellow
    bsdf.inputs["Base Color"].default_value = (0.82, 0.83, 0.78, 1.0)
    print("VP2_WALL_COLOR_OVERRIDE", tuple(bsdf.inputs["Base Color"].default_value))


def add_box(name, parent, location, size, material, rotation=(0, 0, 0), uv_scale=1.5, bevel=None):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("VP2_Bevel", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
        modifier.limit_method = "ANGLE"
        modifier.angle_limit = 0.6
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    planar_uv(obj, uv_scale)
    assign_material(obj, material)
    obj.parent = parent
    obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.location = location
    obj.rotation_euler = rotation
    obj.scale = (1.0, 1.0, 1.0)
    return obj


def add_cylinder(name, parent, location, radius, depth, material, vertices=20, radius_top=None):
    top = radius if radius_top is None else radius_top
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius, radius2=top, depth=depth, location=(0, 0, 0))
    obj = bpy.context.object
    obj.name = name
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    planar_uv(obj, 1.0)
    assign_material(obj, material)
    obj.parent = parent
    obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.location = location
    obj.scale = (1.0, 1.0, 1.0)
    return obj


def add_sphere(name, parent, location, radius, material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=radius, location=(0, 0, 0))
    obj = bpy.context.object
    obj.name = name
    assign_material(obj, material)
    obj.parent = parent
    obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.location = location
    obj.scale = (1.0, 1.0, 1.0)
    return obj


def duplicate_subtree(source_root, root_name, prefix, parent, location, rotation_z):
    source_objects = descendants(source_root, include_root=True)
    mapping = {}
    for source in source_objects:
        duplicate = source.copy()
        duplicate.data = source.data
        duplicate.animation_data_clear()
        duplicate.name = root_name if source is source_root else f"{prefix}_{source.name}"
        bpy.context.collection.objects.link(duplicate)
        mapping[source] = duplicate
    for source in source_objects:
        duplicate = mapping[source]
        if source is source_root:
            duplicate.parent = parent
            duplicate.matrix_parent_inverse = Matrix.Identity(4)
            duplicate.location = location
            duplicate.rotation_euler = (0.0, 0.0, rotation_z)
            duplicate.scale = (1.0, 1.0, 1.0)
        else:
            duplicate.parent = mapping[source.parent]
            duplicate.matrix_parent_inverse = Matrix.Identity(4)
            duplicate.matrix_basis = source.matrix_basis.copy()
    return mapping[source_root]


def remove_source_objects(source_objects):
    for obj in source_objects:
        if obj.name in bpy.data.objects:
            bpy.data.objects.remove(obj, do_unlink=True)


def add_back_wall_segment(parent, name, x_min, x_max, z_min, z_max, wall_center_y, thickness):
    return add_box(
        name, parent,
        ((x_min + x_max) / 2, wall_center_y, (z_min + z_max) / 2),
        (x_max - x_min, thickness, z_max - z_min),
        "VQ_Wall_Plaster",
    )


def add_left_wall_segment(parent, name, y_min, y_max, z_min, z_max, wall_center_x, thickness):
    return add_box(
        name, parent,
        (wall_center_x, (y_min + y_max) / 2, (z_min + z_max) / 2),
        (thickness, y_max - y_min, z_max - z_min),
        "VQ_Wall_Plaster",
    )


def create_architecture(contract, parent):
    room = contract["room"]
    width = float(room["size"]["width"])
    depth = float(room["size"]["depth"])
    height = float(room["size"]["heightAboveFloor"])
    camera_floor_min = float(room["bounds"]["min"][1])
    # VP2-1b: the floor uses a unique full-room atlas (0..1 UV, no repeat).
    floor = add_box("FLOOR", parent, (0, 0, camera_floor_min / 2), (width, depth, -camera_floor_min), "VQ_Floor_Wood")
    full_room_atlas_uv(floor, width, depth)
    floor["floor_top_z"] = 0.0
    floor["floor_uv_meters_per_repeat"] = 0.0  # no repeat: full-room atlas
    floor["floor_texture_mode"] = "unique-full-room-atlas"
    floor["floor_texture_world_size"] = [width, depth]
    floor["vp2_textures"] = True

    back = next(wall for wall in room["walls"] if wall["id"] == "back-wall")
    left = next(wall for wall in room["walls"] if wall["id"] == "left-wall")
    back_x_min, _, back_three_z_min = back["aabb"]["min"]
    back_x_max, _, back_three_z_max = back["aabb"]["max"]
    back_center_y = -(back_three_z_min + back_three_z_max) / 2
    back_thickness = back_three_z_max - back_three_z_min
    left_three_x_min, _, left_three_z_min = left["aabb"]["min"]
    left_three_x_max, _, left_three_z_max = left["aabb"]["max"]
    left_center_x = (left_three_x_min + left_three_x_max) / 2
    left_thickness = left_three_x_max - left_three_x_min
    left_y_min, left_y_max = -left_three_z_max, -left_three_z_min

    restroom = next(f for f in contract["facilities"] if f["id"] == "restroom")
    entrance = next(f for f in contract["facilities"] if f["id"] == "entrance")
    restroom_center = three_to_blender_position(restroom["visualPosition"])
    restroom_size = restroom["primaryGeometry"]["size"]
    restroom_x_min = restroom_center.x - restroom_size[0] / 2
    restroom_x_max = restroom_center.x + restroom_size[0] / 2
    restroom_height = restroom_size[1]
    window = room["window"]
    window_x_min, window_x_max = window["openingXRange"]
    window_z_min, window_z_max = window["openingYRange"]

    add_back_wall_segment(parent, "BACK_WALL_LEFT", back_x_min, restroom_x_min, 0, height, back_center_y, back_thickness)
    add_back_wall_segment(parent, "BACK_WALL_RESTROOM_LINTEL", restroom_x_min, restroom_x_max, restroom_height, height, back_center_y, back_thickness)
    add_back_wall_segment(parent, "BACK_WALL_CENTER", restroom_x_max, window_x_min, 0, height, back_center_y, back_thickness)
    add_back_wall_segment(parent, "BACK_WALL_WINDOW_BOTTOM", window_x_min, window_x_max, 0, window_z_min, back_center_y, back_thickness)
    add_back_wall_segment(parent, "BACK_WALL_WINDOW_TOP", window_x_min, window_x_max, window_z_max, height, back_center_y, back_thickness)
    add_back_wall_segment(parent, "BACK_WALL_RIGHT", window_x_max, back_x_max, 0, height, back_center_y, back_thickness)

    entrance_center = three_to_blender_position(entrance["visualPosition"])
    entrance_world_size = entrance["primaryGeometry"]["worldSize"]
    entrance_y_min = entrance_center.y - entrance_world_size[2] / 2
    entrance_y_max = entrance_center.y + entrance_world_size[2] / 2
    entrance_height = entrance_world_size[1]
    add_left_wall_segment(parent, "LEFT_WALL_BACK", left_y_min, entrance_y_min, 0, height, left_center_x, left_thickness)
    add_left_wall_segment(parent, "LEFT_WALL_ENTRANCE_LINTEL", entrance_y_min, entrance_y_max, entrance_height, height, left_center_x, left_thickness)
    add_left_wall_segment(parent, "LEFT_WALL_FRONT", entrance_y_max, left_y_max, 0, height, left_center_x, left_thickness)

    # ---- Baseboards (VP2: full interior runs, warmer tone, 0.09m high) ----
    trim_h = 0.09
    trim_d = 0.03
    # Back wall: three runs separated by the restroom opening and window opening
    add_box("BASEBOARD_BACK_LEFT", parent, ((back_x_min + restroom_x_min) / 2, back_center_y - back_thickness / 2 - trim_d / 2, trim_h / 2), (restroom_x_min - back_x_min, trim_d, trim_h), "VQ_Trim_Warm")
    add_box("BASEBOARD_BACK_CENTER", parent, ((restroom_x_max + window_x_min) / 2, back_center_y - back_thickness / 2 - trim_d / 2, trim_h / 2), (window_x_min - restroom_x_max, trim_d, trim_h), "VQ_Trim_Warm")
    add_box("BASEBOARD_BACK_WINDOW", parent, ((window_x_min + window_x_max) / 2, back_center_y - back_thickness / 2 - trim_d / 2, trim_h / 2), (window_x_max - window_x_min, trim_d, trim_h), "VQ_Trim_Warm")
    add_box("BASEBOARD_BACK_RIGHT", parent, ((window_x_max + back_x_max) / 2, back_center_y - back_thickness / 2 - trim_d / 2, trim_h / 2), (back_x_max - window_x_max, trim_d, trim_h), "VQ_Trim_Warm")
    # Left wall: two runs separated by the entrance opening
    add_box("BASEBOARD_LEFT_BACK", parent, (left_center_x + left_thickness / 2 + trim_d / 2, (left_y_min + entrance_y_min) / 2, trim_h / 2), (trim_d, entrance_y_min - left_y_min, trim_h), "VQ_Trim_Warm")
    add_box("BASEBOARD_LEFT_FRONT", parent, (left_center_x + left_thickness / 2 + trim_d / 2, (entrance_y_max + left_y_max) / 2, trim_h / 2), (trim_d, left_y_max - entrance_y_max, trim_h), "VQ_Trim_Warm")

    # ---- Window frame with inner return and proper sill connection ----
    frame = 0.09
    frame_depth = 0.18
    window_center_y = -float(window["semanticCenter"][2])
    add_box("WINDOW_FRAME_LEFT", parent, (window_x_min + frame / 2, window_center_y, (window_z_min + window_z_max) / 2), (frame, frame_depth, window_z_max - window_z_min), "VQ_Window_Frame")
    add_box("WINDOW_FRAME_RIGHT", parent, (window_x_max - frame / 2, window_center_y, (window_z_min + window_z_max) / 2), (frame, frame_depth, window_z_max - window_z_min), "VQ_Window_Frame")
    add_box("WINDOW_FRAME_BOTTOM", parent, ((window_x_min + window_x_max) / 2, window_center_y, window_z_min + frame / 2), (window_x_max - window_x_min, frame_depth, frame), "VQ_Window_Frame")
    add_box("WINDOW_FRAME_TOP", parent, ((window_x_min + window_x_max) / 2, window_center_y, window_z_max - frame / 2), (window_x_max - window_x_min, frame_depth, frame), "VQ_Window_Frame")
    add_box("WINDOW_FRAME_MULLION", parent, ((window_x_min + window_x_max) / 2, window_center_y, (window_z_min + window_z_max) / 2), (frame * 0.75, frame_depth, window_z_max - window_z_min - 2 * frame), "VQ_Window_Frame")
    # Inner return (jamb) on the room side, giving the frame visible thickness
    inner_depth = 0.10
    add_box("WINDOW_JAMB_LEFT", parent, (window_x_min + frame / 2, window_center_y - frame_depth / 2 + inner_depth / 2, (window_z_min + window_z_max) / 2), (frame, inner_depth, window_z_max - window_z_min - 2 * frame), "VQ_Trim_Warm")
    add_box("WINDOW_JAMB_RIGHT", parent, (window_x_max - frame / 2, window_center_y - frame_depth / 2 + inner_depth / 2, (window_z_min + window_z_max) / 2), (frame, inner_depth, window_z_max - window_z_min - 2 * frame), "VQ_Trim_Warm")
    add_box("WINDOW_JAMB_TOP", parent, ((window_x_min + window_x_max) / 2, window_center_y - frame_depth / 2 + inner_depth / 2, window_z_max - frame / 2), (window_x_max - window_x_min - 2 * frame, inner_depth, frame), "VQ_Trim_Warm")
    add_box("WINDOW_GLASS", parent, ((window_x_min + window_x_max) / 2, window_center_y + 0.01, (window_z_min + window_z_max) / 2), (window_x_max - window_x_min - 2 * frame, 0.025, window_z_max - window_z_min - 2 * frame), "VQ_Window_Glass")
    # Sill: connected to the wall, not floating
    add_box("WINDOW_SILL", parent, ((window_x_min + window_x_max) / 2, back_center_y - back_thickness / 2 - 0.08, window_z_min - 0.03), (window_x_max - window_x_min + 0.14, 0.16, 0.09), "VQ_Trim_Warm")
    return floor


def create_meeting(parent):
    # Round conference table: 2.1m diameter, 0.10m thick top at desk height.
    # Warm light oak (VQ_Trim_Warm): same wood family as workstations but lighter.
    add_cylinder("MEETING_TABLE_TOP", parent, (0, 0, 0.70), 1.05, 0.10, "VQ_Trim_Warm", vertices=24)
    # Sturdy tapered pedestal + wide base disc (no single thin leg).
    add_cylinder("MEETING_TABLE_PEDESTAL", parent, (0, 0, 0.34), 0.30, 0.68, "VQ_Metal_Charcoal", vertices=12, radius_top=0.18)
    add_cylinder("MEETING_TABLE_BASE", parent, (0, 0, 0.03), 0.55, 0.06, "VQ_Metal_Charcoal", vertices=16)
    # Four conference chairs: +12-16% over 2A, wide seat/back, thick legs,
    # sage-green fabric, and a deliberate 2-5 degree angle variance per chair.
    chair_radius = 1.48
    angle_offsets = (math.radians(-4.0), math.radians(2.5), math.radians(-2.0), math.radians(4.5))
    for index in range(4):
        theta = math.radians(45 + 90 * index)
        center = (chair_radius * math.cos(theta), chair_radius * math.sin(theta), 0)
        rotation_z = theta - math.pi / 2 + angle_offsets[index]  # chair front (-Y) faces the table center
        root = new_empty(f"MEETING_CHAIR_{index + 1}", parent, center, rotation_z)
        add_box(f"MEETING_CHAIR_{index + 1}_SEAT", root, (0, 0, 0.445), (0.50, 0.50, 0.09), "VQ_Sofa_Fabric", bevel=0.025)
        add_box(f"MEETING_CHAIR_{index + 1}_BACK", root, (0, 0.24, 0.72), (0.50, 0.08, 0.56), "VQ_Sofa_Fabric", bevel=0.025)
        for leg_index, (lx, ly) in enumerate(((-0.20, -0.20), (0.20, -0.20), (-0.20, 0.20), (0.20, 0.20))):
            add_box(f"MEETING_CHAIR_{index + 1}_LEG_{leg_index + 1}", root, (lx, ly, 0.22), (0.052, 0.052, 0.44), "VQ_Metal_Charcoal")


def create_dining(parent):
    # Rounded-rect dining table: 1.9m x 1.15m, 0.09m thick, top at 0.75.
    # Warm light oak (VQ_Trim_Warm): same family as the meeting table.
    add_box("DINING_TABLE_TOP", parent, (0, 0, 0.705), (1.9, 1.15, 0.09), "VQ_Trim_Warm", bevel=0.04)
    for leg_index, (lx, ly) in enumerate(((-0.80, -0.45), (0.80, -0.45), (-0.80, 0.45), (0.80, 0.45))):
        add_box(f"DINING_TABLE_LEG_{leg_index + 1}", parent, (lx, ly, 0.35), (0.06, 0.06, 0.70), "VQ_Metal_Charcoal")
    # Two low benches (one per long side): thick, living-room silhouettes with
    # clearly visible support legs - replaces the four thin stools.
    for bench_index, by in enumerate((0.85, -0.85)):
        bench = new_empty(f"DINING_BENCH_{bench_index + 1}", parent, (0, by, 0), 0.0)
        add_box(f"DINING_BENCH_{bench_index + 1}_SEAT", bench, (0, 0, 0.46), (1.35, 0.40, 0.07), "VQ_Sofa_Fabric_Accent", bevel=0.03)
        for leg_index, (lx, ly) in enumerate(((-0.61, -0.15), (0.61, -0.15), (-0.61, 0.15), (0.61, 0.15))):
            add_box(f"DINING_BENCH_{bench_index + 1}_LEG_{leg_index + 1}", bench, (lx, ly, 0.23), (0.05, 0.05, 0.46), "VQ_Metal_Charcoal")
    # A few small light ceramic objects, sized to read from the formal camera.
    add_cylinder("DINING_PLATE_1", parent, (-0.45, -0.25, 0.778), 0.13, 0.028, "VQ_Keycap", vertices=12)
    add_cylinder("DINING_PLATE_2", parent, (0.45, 0.25, 0.778), 0.13, 0.028, "VQ_Keycap", vertices=12)
    add_cylinder("DINING_CUP_1", parent, (0.05, 0.10, 0.826), 0.055, 0.10, "VQ_Window_Glass", vertices=10, radius_top=0.05)


def create_coffee(parent):
    # Horizontal coffee corner: low warm-wood cabinet flush against the wall,
    # a wide dark machine on the counter, and a few small counter details.
    # The old narrow tall "vending machine" silhouette is gone.
    add_box("COFFEE_CABINET", parent, (0, 0.15, 0.42), (1.40, 0.55, 0.84), "VQ_Trim_Warm", bevel=0.03)
    add_box("COFFEE_CABINET_TOP", parent, (0, 0.15, 0.845), (1.44, 0.59, 0.05), "VQ_Trim_Warm", bevel=0.02)
    # Wide countertop espresso machine: body + head, dark charcoal family.
    add_box("COFFEE_MACHINE_BODY", parent, (-0.25, 0.15, 1.09), (0.64, 0.40, 0.50), "VQ_Plastic_Dark", bevel=0.03)
    add_box("COFFEE_MACHINE_HEAD", parent, (-0.25, 0.15, 1.40), (0.60, 0.36, 0.12), "VQ_Metal_Charcoal", bevel=0.02)
    add_box("COFFEE_CONTROL_PANEL", parent, (0.10, 0.355, 1.22), (0.28, 0.03, 0.09), "VQ_Screen_Glass")
    add_box("COFFEE_DISPENSE", parent, (0.0, 0.36, 1.08), (0.30, 0.05, 0.10), "VQ_Metal_Charcoal")
    add_box("COFFEE_DRIP_TRAY", parent, (0.0, 0.34, 0.90), (0.36, 0.14, 0.03), "VQ_Metal_Charcoal")
    # Single low-saturation terracotta accent (button) - the only accent in the zone.
    add_box("COFFEE_ACCENT_BUTTON", parent, (0.18, 0.37, 1.22), (0.035, 0.03, 0.035), "VQ_Accent_Terracotta")
    # Two cups on a small metal tray on the counter.
    add_box("COFFEE_TRAY", parent, (-0.87, 0.15, 0.85), (0.26, 0.16, 0.02), "VQ_Metal_Charcoal")
    add_cylinder("COFFEE_CUP_1", parent, (-0.95, 0.15, 0.905), 0.045, 0.09, "VQ_Keycap", vertices=10)
    add_cylinder("COFFEE_CUP_2", parent, (-0.78, 0.17, 0.905), 0.045, 0.09, "VQ_Keycap", vertices=10)


def create_rug_muted_material():
    material = bpy.data.materials.new("VQ_Rug_Muted")
    material.use_nodes = True
    bsdf = next((node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        raise RuntimeError("VQ_Rug_Muted has no Principled BSDF node")
    # #6F7468 sRGB -> linear: muted warm gray-green, clearly darker than the
    # VP2-2A light gray that read as a white display platform in the runtime.
    bsdf.inputs["Base Color"].default_value = (*srgb_to_linear(RUG_MUTED_SRGB), 1.0)
    bsdf.inputs["Roughness"].default_value = 0.9
    print("RUG_MATERIAL_CREATED VQ_Rug_Muted", srgb_to_linear(RUG_MUTED_SRGB))
    return material


def create_rug_sofa_muted_material():
    material = bpy.data.materials.new("VQ_Rug_Sofa_Muted")
    material.use_nodes = True
    bsdf = next((node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        raise RuntimeError("VQ_Rug_Sofa_Muted has no Principled BSDF node")
    bsdf.inputs["Base Color"].default_value = (*srgb_to_linear(RUG_SOFA_SRGB), 1.0)
    bsdf.inputs["Roughness"].default_value = 0.9
    print("RUG_MATERIAL_CREATED VQ_Rug_Sofa_Muted", srgb_to_linear(RUG_SOFA_SRGB))
    return material


def create_accent_terracotta_material():
    material = bpy.data.materials.new("VQ_Accent_Terracotta")
    material.use_nodes = True
    bsdf = next((node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        raise RuntimeError("VQ_Accent_Terracotta has no Principled BSDF node")
    bsdf.inputs["Base Color"].default_value = (*srgb_to_linear(ACCENT_TERRACOTTA_SRGB), 1.0)
    bsdf.inputs["Roughness"].default_value = 0.55
    print("ACCENT_MATERIAL_CREATED VQ_Accent_Terracotta", srgb_to_linear(ACCENT_TERRACOTTA_SRGB))
    return material


def adjust_chair_fabric_color():
    """Lighten the shared chair fabric to a warm gray-green so chairs read at camera range."""
    material = bpy.data.materials.get("VQ_Chair_Fabric")
    if material is None:
        raise RuntimeError("VQ_Chair_Fabric material missing from PBR source")
    bsdf = next((node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        raise RuntimeError("VQ_Chair_Fabric has no Principled BSDF node")
    bsdf.inputs["Base Color"].default_value = (*CHAIR_FABRIC_LINEAR, 1.0)
    print("CHAIR_FABRIC_COLOR_OVERRIDE", CHAIR_FABRIC_LINEAR)


def add_rounded_rect_slab(name, parent, location, size, corner_radius, thickness, material):
    """Build a low-poly rounded-rectangle slab (the workspace rug)."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    half_x, half_y = size[0] / 2, size[1] / 2
    radius = min(corner_radius, half_x, half_y)
    segments = 6

    def outline_points(z):
        points = []
        # bottom straight edge
        points.append((-half_x + radius, -half_y))
        points.append((half_x - radius, -half_y))
        # bottom-right arc
        for i in range(1, segments):
            angle = -math.pi / 2 + math.pi / 2 * i / segments
            points.append((half_x - radius + radius * math.cos(angle), -half_y + radius + radius * math.sin(angle)))
        points.append((half_x, -half_y + radius))
        # right straight edge
        points.append((half_x, half_y - radius))
        # top-right arc
        for i in range(1, segments):
            angle = 0 + math.pi / 2 * i / segments
            points.append((half_x - radius + radius * math.cos(angle), half_y - radius + radius * math.sin(angle)))
        points.append((half_x - radius, half_y))
        # top straight edge
        points.append((-half_x + radius, half_y))
        # top-left arc
        for i in range(1, segments):
            angle = math.pi / 2 + math.pi / 2 * i / segments
            points.append((-half_x + radius + radius * math.cos(angle), half_y - radius + radius * math.sin(angle)))
        points.append((-half_x, half_y - radius))
        # left straight edge
        points.append((-half_x, -half_y + radius))
        # bottom-left arc
        for i in range(1, segments):
            angle = math.pi + math.pi / 2 * i / segments
            points.append((-half_x + radius + radius * math.cos(angle), -half_y + radius + radius * math.sin(angle)))
        return [bm.verts.new((point[0], point[1], z)) for point in points]

    top = outline_points(thickness)
    bottom = outline_points(0.0)
    count = len(top)
    for i in range(count):
        j = (i + 1) % count
        bm.faces.new((top[i], top[j], bottom[j], bottom[i]))
    bm.faces.new(top)
    bm.faces.new(list(reversed(bottom)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    assign_material(obj, material)
    obj.parent = parent
    obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.location = location
    obj.scale = (1.0, 1.0, 1.0)
    return obj


def create_pod_rugs(parent, workstation_bounds):
    """Create the two work-pod rugs, sized and centered from the four real
    workstation world bounds (never hardcoded from the old single rug)."""
    left_bounds = None
    right_bounds = None
    for desk_id, (minimum, maximum) in workstation_bounds.items():
        side = "left" if maximum.x < 0 else "right"
        if side == "left":
            if left_bounds is None:
                left_bounds = [minimum.copy(), maximum.copy()]
            else:
                left_bounds[0] = Vector((min(left_bounds[0].x, minimum.x), min(left_bounds[0].y, minimum.y), min(left_bounds[0].z, minimum.z)))
                left_bounds[1] = Vector((max(left_bounds[1].x, maximum.x), max(left_bounds[1].y, maximum.y), max(left_bounds[1].z, maximum.z)))
        else:
            if right_bounds is None:
                right_bounds = [minimum.copy(), maximum.copy()]
            else:
                right_bounds[0] = Vector((min(right_bounds[0].x, minimum.x), min(right_bounds[0].y, minimum.y), min(right_bounds[0].z, minimum.z)))
                right_bounds[1] = Vector((max(right_bounds[1].x, maximum.x), max(right_bounds[1].y, maximum.y), max(right_bounds[1].z, maximum.z)))

    def pod_rug(name, bounds_pair):
        minimum, maximum = bounds_pair
        center_x = (minimum.x + maximum.x) / 2
        center_y = (minimum.y + maximum.y) / 2
        span_x = maximum.x - minimum.x
        span_y = maximum.y - minimum.y
        # Center within +/-2.60m so the 3.1m-wide rugs keep the central wooden
        # channel at 2.2m or less while the desks remain fully covered.
        center_x = math.copysign(min(2.60, abs(center_x)), center_x)
        size_x = min(3.1, max(2.8, span_x + 1.13))
        size_y = min(4.9, max(4.5, span_y - 0.25))
        return add_rounded_rect_slab(
            name, parent, (center_x, center_y, 0.006),
            (size_x, size_y), 0.25, 0.012, "VQ_Rug_Muted",
        )

    left = pod_rug("WORK_POD_RUG_LEFT", left_bounds)
    right = pod_rug("WORK_POD_RUG_RIGHT", right_bounds)
    left["vp2_role"] = "work-pod-zone"
    right["vp2_role"] = "work-pod-zone"
    return {"left": left, "right": right}


def create_pod_share(parent, x_position, side):
    """A low shared organizer at the back end of each pod (no hotspot, no text)."""
    prefix = f"WORK_POD_SHARE_{side.upper()}"
    add_box(f"{prefix}_BODY", parent, (x_position, 2.62, 0.15), (0.62, 0.32, 0.30), "VQ_Desk_Wood", bevel=0.02)
    add_box(f"{prefix}_TRAY", parent, (x_position, 2.62, 0.3175), (0.50, 0.22, 0.035), "VQ_Metal_Charcoal", bevel=0.01)
    body = bpy.data.objects[f"{prefix}_BODY"]
    tray = bpy.data.objects[f"{prefix}_TRAY"]
    body["vp2_role"] = "pod-share"
    tray["vp2_role"] = "pod-share"


def create_sofa_rug(parent):
    rug = add_rounded_rect_slab(
        "SOFA_RUG", parent, (-5.2, -3.4, 0.005),
        (2.6, 1.8), 0.35, 0.010, "VQ_Rug_Sofa_Muted",
    )
    rug["vp2_role"] = "sofa-zone-rug"
    return rug


def create_sofa_coffee_table(parent):
    add_box("SOFA_COFFEE_TABLE_TOP", parent, (-4.55, -3.2, 0.37), (0.95, 0.55, 0.05), "VQ_Trim_Warm", bevel=0.025)
    add_box("SOFA_COFFEE_TABLE_BASE", parent, (-4.55, -3.2, 0.16), (0.90, 0.50, 0.32), "VQ_Metal_Charcoal", bevel=0.02)
    top = bpy.data.objects["SOFA_COFFEE_TABLE_TOP"]
    base = bpy.data.objects["SOFA_COFFEE_TABLE_BASE"]
    top["vp2_role"] = "sofa-coffee-table"
    base["vp2_role"] = "sofa-coffee-table"


def create_door(parent, prefix, restroom=False, arch_parent=None):
    panel_material = "VQ_Desk_Wood" if restroom else "VQ_Sofa_Fabric_Accent"
    add_box(f"{prefix}_DOOR_PANEL", parent, (0, 0, 1.35), (2.0, 0.10, 2.7), panel_material)
    add_box(f"{prefix}_DOOR_INSET", parent, (0, -0.065, 1.35), (1.5, 0.05, 2.22), "VQ_Trim_Warm")
    add_sphere(f"{prefix}_DOOR_HANDLE", parent, (-0.55, -0.12, 1.35), 0.07, "VQ_Metal_Charcoal")
    # Outer frame
    add_box(f"{prefix}_FRAME_LEFT", parent, (-1.06, 0, 1.38), (0.12, 0.22, 2.76), "VQ_Window_Frame")
    add_box(f"{prefix}_FRAME_RIGHT", parent, (1.06, 0, 1.38), (0.12, 0.22, 2.76), "VQ_Window_Frame")
    add_box(f"{prefix}_FRAME_TOP", parent, (0, 0, 2.76), (2.24, 0.22, 0.12), "VQ_Window_Frame")
    # Inner jamb return (visible thickness on the room side).
    # Jambs are architectural trim and must live under OFFICE_ARCH_ROOT.
    # Create them under the door facility root, then re-parent to the arch
    # root while preserving each world matrix. An explicit view-layer update
    # is required before reading matrix_world so the composite reflects the
    # door facility root transform (identity otherwise -> jamb at origin).
    for name, position, size in (
        (f"{prefix}_JAMB_LEFT", (-1.03, -0.10, 1.38), (0.10, 0.06, 2.70)),
        (f"{prefix}_JAMB_RIGHT", (1.03, -0.10, 1.38), (0.10, 0.06, 2.70)),
        (f"{prefix}_JAMB_TOP", (0, -0.10, 2.73), (2.10, 0.06, 0.10)),
    ):
        jamb = add_box(name, parent, position, size, "VQ_Trim_Warm")
        bpy.context.view_layer.update()
        world = jamb.matrix_world.copy()
        jamb.parent = arch_parent
        jamb.matrix_world = world
        bpy.context.view_layer.update()


def add_annulus(name, parent, location, outer_radius, inner_radius, thickness, material, vertices=20):
    """Low-poly flat ring (annulus) with top/bottom ring faces and inner/outer walls."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()

    def circle(radius, z):
        return [bm.verts.new((radius * math.cos(2 * math.pi * index / vertices), radius * math.sin(2 * math.pi * index / vertices), z)) for index in range(vertices)]

    outer_top = circle(outer_radius, thickness)
    outer_bottom = circle(outer_radius, 0.0)
    inner_top = circle(inner_radius, thickness)
    inner_bottom = circle(inner_radius, 0.0)
    for index in range(vertices):
        next_index = (index + 1) % vertices
        bm.faces.new((outer_top[index], outer_top[next_index], outer_bottom[next_index], outer_bottom[index]))
        bm.faces.new((inner_top[next_index], inner_top[index], inner_bottom[index], inner_bottom[next_index]))
        bm.faces.new((outer_top[index], outer_top[next_index], inner_top[next_index], inner_top[index]))
        bm.faces.new((outer_bottom[next_index], outer_bottom[index], inner_bottom[index], inner_bottom[next_index]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    planar_uv(obj, 1.0)
    assign_material(obj, material)
    obj.parent = parent
    obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.location = location
    obj.scale = (1.0, 1.0, 1.0)
    return obj


def create_cat_home(parent, radius):
    # Low pet nest, not a table: base disc + soft padded outer ring with a
    # recessed inner cushion and a small accent pillow. Total height ~0.19m.
    add_cylinder("CAT_HOME_BASE", parent, (0, 0, 0.025), radius * 0.52, 0.05, "VQ_Sofa_Legs", vertices=20)
    add_annulus("CAT_HOME_RIM", parent, (0, 0, 0.05), radius * 0.48, radius * 0.32, 0.14, "VQ_Sofa_Fabric_Accent", vertices=20)
    add_cylinder("CAT_HOME_CUSHION", parent, (0, 0, 0.055), radius * 0.30, 0.10, "VQ_Sofa_Fabric", vertices=20)
    add_cylinder("CAT_HOME_PILLOW", parent, (0, 0, 0.135), radius * 0.15, 0.06, "VQ_Sofa_Fabric_Accent", vertices=16)


def create_cat_rest(parent):
    # Small low rest pad for the cat actor zone (clearly not a table).
    add_cylinder("CAT_REST_PAD", parent, (0, 0, 0.03), 0.30, 0.06, "VQ_Sofa_Fabric", vertices=16)
    add_cylinder("CAT_REST_PILLOW", parent, (0, 0, 0.075), 0.13, 0.05, "VQ_Sofa_Fabric_Accent", vertices=12)


def facility_root_name(facility_id):
    return f"OFFICE_{facility_id.replace('-', '_').upper()}_ROOT"


def facility_anchor_name(facility_id):
    return f"OFFICE_{facility_id.replace('-', '_').upper()}_ANCHOR"


def add_contract_anchor(name, parent, three_position, source_id, authority, unresolved_note=None):
    position = three_to_blender_position(three_position)
    anchor = new_empty(name, parent, position)
    anchor["three_position"] = [float(value) for value in three_position]
    anchor["source_id"] = source_id
    anchor["authority"] = authority
    if unresolved_note:
        anchor["unresolved_note"] = unresolved_note
    return anchor


def validate_fixed_asset(root, expected_meshes, expected_triangles, label):
    stats = evaluated_triangles(descendants(root, include_root=True))
    print("FIXED_ASSET_STATS", label, stats[0], stats[1])
    if stats != (expected_meshes, expected_triangles, []):
        raise RuntimeError(f"{label} fixed stats changed: {stats}")


def build_workstations(contract, source, group, anchors_group):
    result = []
    for workstation in contract["workstations"]:
        desk_id = workstation["id"]
        number = int(desk_id.split("_")[-1])
        target = Vector(workstation["blenderRootTarget"])
        rotation_z = three_rotation_y_to_blender_z(workstation["rotationY"])
        root = duplicate_subtree(source, f"OFFICE_WORKSTATION_DESK_{number}_ROOT", f"D{number}", group, target, rotation_z)
        root["three_position"] = workstation["center"]
        root["source_id"] = desk_id
        root["scene_key"] = workstation["sceneKey"]
        root["authority"] = "authoritative"
        validate_fixed_asset(root, EXPECTED_WORKSTATION_MESHES, EXPECTED_WORKSTATION_TRIANGLES, desk_id)

        add_contract_anchor(f"OFFICE_DESK_{number}_CENTER_ANCHOR", anchors_group, workstation["center"], desk_id, "authoritative")
        seat = add_contract_anchor(
            f"OFFICE_DESK_{number}_SEAT_ANCHOR", anchors_group, workstation["seatWorkPosition"],
            f"{desk_id}:{workstation['sceneKey']}", "authoritative",
            "Visual chair and business seat intentionally remain distinct.",
        )
        chair_root = bpy.data.objects[f"D{number}_POLISHED_CHAIR_ROOT"]
        chair_objects = descendants(chair_root, include_root=True)
        chair_bounds = world_bounds(chair_objects)
        chair_visual_center = (chair_bounds[0] + chair_bounds[1]) / 2
        chair_root_distance = Vector((chair_root.matrix_world.translation.x - seat.matrix_world.translation.x, chair_root.matrix_world.translation.y - seat.matrix_world.translation.y, 0)).length
        chair_center_distance = Vector((chair_visual_center.x - seat.matrix_world.translation.x, chair_visual_center.y - seat.matrix_world.translation.y, 0)).length

        facing_blender = (root.matrix_world.to_3x3() @ Vector((0, -1, 0))).normalized()
        facing_three = blender_to_three_direction(facing_blender).normalized()
        expected_facing = Vector(workstation["facingDirection"]).normalized()
        facing_error = (facing_three - expected_facing).length
        if facing_error > 0.000001:
            raise RuntimeError(f"{desk_id} facing mismatch: {tuple(facing_three)} vs {tuple(expected_facing)}")
        alignment = {}
        for asset, base, socket in (
            ("monitor", f"D{number}_MONITOR_BASE_ANCHOR", f"D{number}_MONITOR_SOCKET"),
            ("keyboard", f"D{number}_KEYBOARD_BASE_ANCHOR", f"D{number}_KEYBOARD_SOCKET"),
            ("lamp", f"D{number}_LAMP_BASE_ANCHOR", f"D{number}_LAMP_SOCKET"),
        ):
            error = (bpy.data.objects[base].matrix_world.translation - bpy.data.objects[socket].matrix_world.translation).length
            alignment[asset] = error
            if error > 0.0001:
                raise RuntimeError(f"{desk_id} {asset} anchor alignment error {error}")
        print("WORKSTATION_TRANSFORM", desk_id, rounded(root.matrix_world.translation), round(rotation_z, 6), "facing", rounded(facing_three))
        print("WORKSTATION_CHAIR_SEAT", desk_id, "chair_root", rounded(chair_root.matrix_world.translation), "chair_center", rounded(chair_visual_center), "seat", rounded(seat.matrix_world.translation), "horizontal_distance", round(chair_root_distance, 6), round(chair_center_distance, 6))
        result.append({
            "id": desk_id,
            "sceneKey": workstation["sceneKey"],
            "rootName": root.name,
            "threePosition": workstation["center"],
            "blenderPosition": rounded(root.matrix_world.translation),
            "rotationZ": round(rotation_z, 6),
            "expectedFacingThree": workstation["facingDirection"],
            "actualFacingThree": rounded(facing_three),
            "seatAnchorBlender": rounded(seat.matrix_world.translation),
            "chairRootBlender": rounded(chair_root.matrix_world.translation),
            "chairVisualBoundsCenterBlender": rounded(chair_visual_center),
            "chairRootToSeatHorizontalDistance": round(chair_root_distance, 6),
            "chairBoundsCenterToSeatHorizontalDistance": round(chair_center_distance, 6),
            "meshCount": EXPECTED_WORKSTATION_MESHES,
            "triangleCount": EXPECTED_WORKSTATION_TRIANGLES,
            "deviceAnchorAlignmentError": {key: round(value, 9) for key, value in alignment.items()},
        })
    return result


def aabb_intersects(a, b, tolerance=0.001):
    return all(a[0][axis] < b[1][axis] - tolerance and a[1][axis] > b[0][axis] + tolerance for axis in range(3))


def validate_workstation_separation(workstation_manifest):
    bounds = {}
    for entry in workstation_manifest:
        root = bpy.data.objects[entry["rootName"]]
        bounds[entry["id"]] = world_bounds(descendants(root, include_root=True))
        entry["bounds"] = {"min": rounded(bounds[entry["id"]][0]), "max": rounded(bounds[entry["id"]][1])}
    identifiers = list(bounds)
    for index, first in enumerate(identifiers):
        for second in identifiers[index + 1 :]:
            if aabb_intersects(bounds[first], bounds[second]):
                raise RuntimeError(f"Workstation AABBs intersect: {first}/{second}")


def build_facilities(contract, source_sofa, group, anchors_group):
    manifest = []
    for facility in contract["facilities"]:
        facility_id = facility["id"]
        target = three_to_blender_position(facility["visualPosition"])
        rotation_z = three_rotation_y_to_blender_z(facility.get("rotationY", 0.0))
        root_name = facility_root_name(facility_id)
        if facility_id == "sofa":
            root = duplicate_subtree(source_sofa, root_name, "OFFICE_SOFA", group, target, rotation_z)
            validate_fixed_asset(root, EXPECTED_SOFA_MESHES, EXPECTED_SOFA_TRIANGLES, "sofa")
        else:
            root = new_empty(root_name, group, target, rotation_z)
            if facility_id == "meeting":
                create_meeting(root)
            elif facility_id == "dining":
                create_dining(root)
            elif facility_id == "coffee":
                create_coffee(root)
            elif facility_id == "restroom":
                create_door(root, "RESTROOM", restroom=True, arch_parent=bpy.data.objects[ARCH_ROOT])
            elif facility_id == "entrance":
                create_door(root, "ENTRANCE", restroom=False, arch_parent=bpy.data.objects[ARCH_ROOT])
            elif facility_id == "cat-home":
                create_cat_home(root, float(facility["visualRadius"]))
            elif facility_id == "cat-actor-rest":
                create_cat_rest(root)
        root["three_position"] = facility["visualPosition"]
        root["source_id"] = facility_id
        root["authority"] = facility["source"]["kind"]
        anchor_note = None
        if facility_id in {"restroom", "entrance"}:
            anchor_note = "Visible door position is authoritative; no new business door logic or collider is defined."
        add_contract_anchor(facility_anchor_name(facility_id), anchors_group, facility["visualPosition"], facility_id, facility["source"]["kind"], anchor_note)
        if facility.get("worldLabelPosition"):
            add_contract_anchor(f"OFFICE_{facility_id.replace('-', '_').upper()}_LABEL_ANCHOR", anchors_group, facility["worldLabelPosition"], f"{facility_id}:label", "authoritative")
        if facility_id in {"meeting", "dining", "sofa", "coffee", "restroom", "entrance"}:
            add_contract_anchor(f"OFFICE_{facility_id.upper()}_INTERACTION_ANCHOR", anchors_group, facility["interactionPosition"], f"{facility_id}:interaction", "authoritative")
        stats = evaluated_triangles(descendants(root, include_root=True))
        manifest.append({
            "id": facility_id,
            "rootName": root.name,
            "threePosition": facility["visualPosition"],
            "blenderPosition": rounded(root.matrix_world.translation),
            "rotationZ": round(rotation_z, 6),
            "meshCount": stats[0],
            "triangleCount": stats[1],
        })
    restroom = next(f for f in contract["facilities"] if f["id"] == "restroom")
    status = add_contract_anchor(
        "OFFICE_RESTROOM_STATUS_MARKER_ANCHOR", anchors_group, restroom["statusMarkerPosition"],
        "restroom:statusMarkerPosition", "authoritative-runtime-conflict",
        "Coordinate intentionally remains separate from the restroom door; contract mismatch is unresolved.",
    )
    restroom_anchor = bpy.data.objects[facility_anchor_name("restroom")]
    bpy.context.view_layer.update()
    distance = (status.matrix_world.translation - restroom_anchor.matrix_world.translation).length
    print("RESTROOM_STATUS_MARKER_CONFLICT_DISTANCE", round(distance, 6))
    return manifest, distance


def validate_formal_scene(root, contract, workstation_manifest):
    failures = []
    identity = Matrix.Identity(4)
    if root.parent is not None or max(abs(root.matrix_world[row][column] - identity[row][column]) for row in range(4) for column in range(4)) > 1e-7:
        failures.append("VQ1C_FULL_OFFICE_ROOT is not top-level identity")
    direct = {child.name for child in root.children}
    expected = {ARCH_ROOT, WORKSTATIONS_ROOT, AMENITIES_ROOT, ANCHORS_ROOT}
    if direct != expected:
        failures.append(f"top-level groups differ: {sorted(direct)}")
    for obj in bpy.context.scene.objects:
        if obj.type in {"CAMERA", "LIGHT"}:
            failures.append(f"formal camera/light present: {obj.name}")
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 0.00001:
            failures.append(f"non-uniform scale: {obj.name} {tuple(scale)}")
        if obj.type == "MESH":
            if not obj.data.vertices:
                failures.append(f"empty mesh: {obj.name}")
            if len(obj.data.materials) != 1 or obj.data.materials[0] is None:
                failures.append(f"mesh material invalid: {obj.name}")
            else:
                material = obj.data.materials[0]
                textured = material.use_nodes and any(node.type == "TEX_IMAGE" and node.image for node in material.node_tree.nodes)
                if textured and obj.data.uv_layers.active is None:
                    failures.append(f"textured mesh lacks UV: {obj.name}")
    forbidden = {"VQ1C_POLISHED_HERO_ROOT", "HERO_ARCH_ROOT", "POLISHED_WORKSTATION_ROOT", "POLISHED_SOFA_ROOT"}
    remaining = forbidden.intersection(bpy.data.objects.keys())
    if remaining:
        failures.append(f"temporary source roots remain: {sorted(remaining)}")
    floor = bpy.data.objects.get("FLOOR")
    if floor is None:
        failures.append("FLOOR missing")
    else:
        floor_bounds = world_bounds([floor])
        if abs(floor_bounds[1].z) > 0.0001:
            failures.append(f"floor top is not Z=0: {floor_bounds[1].z}")
        room_size = contract["room"]["size"]
        if abs((floor_bounds[1].x - floor_bounds[0].x) - room_size["width"]) > 0.001 or abs((floor_bounds[1].y - floor_bounds[0].y) - room_size["depth"]) > 0.001:
            failures.append("floor horizontal size differs from room contract")
    roots = [bpy.data.objects[entry["rootName"]] for entry in workstation_manifest]
    for index, first in enumerate(roots):
        first_bounds = world_bounds(descendants(first, include_root=True))
        for second in roots[index + 1 :]:
            if aabb_intersects(first_bounds, world_bounds(descendants(second, include_root=True))):
                failures.append(f"workstation AABB collision: {first.name}/{second.name}")
    used_materials = {material.name for obj in bpy.context.scene.objects if obj.type == "MESH" for material in obj.data.materials if material}
    missing_materials = REQUIRED_MATERIALS - used_materials
    if missing_materials:
        failures.append(f"required PBR materials unused: {sorted(missing_materials)}")
    if failures:
        raise RuntimeError("Formal scene validation failed:\n- " + "\n- ".join(failures))


def used_texture_names():
    names = set()
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        for material in obj.data.materials:
            if material and material.use_nodes:
                for node in material.node_tree.nodes:
                    if node.type == "TEX_IMAGE" and node.image:
                        names.add(Path(bpy.path.abspath(node.image.filepath)).name)
    return sorted(names)


def write_manifest(path, contract, workstation_manifest, facility_manifest, restroom_conflict_distance, workstation_rescale, sofa_rescale, pod_rugs):
    arch = bpy.data.objects[ARCH_ROOT]
    workstation_group = bpy.data.objects[WORKSTATIONS_ROOT]
    amenities = bpy.data.objects[AMENITIES_ROOT]
    anchors = bpy.data.objects[ANCHORS_ROOT]
    scene_objects = descendants(bpy.data.objects[FULL_ROOT], include_root=True)
    total_stats = evaluated_triangles(scene_objects)
    architecture_stats = evaluated_triangles(descendants(arch, include_root=True))
    workstation_stats = evaluated_triangles(descendants(workstation_group, include_root=True))
    amenities_stats = evaluated_triangles(descendants(amenities, include_root=True))
    bounds = world_bounds(scene_objects)
    anchor_positions = {
        obj.name: rounded(obj.matrix_world.translation)
        for obj in sorted(descendants(anchors), key=lambda item: item.name)
        if obj.type == "EMPTY"
    }
    material_names = sorted({material.name for obj in scene_objects if obj.type == "MESH" for material in obj.data.materials if material})

    def facility_bounds(facility_id):
        root = bpy.data.objects[facility_root_name(facility_id)]
        minimum, maximum = world_bounds(descendants(root, include_root=True))
        return {"min": rounded(minimum), "max": rounded(maximum)}

    def rug_record(name):
        rug = bpy.data.objects.get(name)
        rug_bounds = world_bounds(descendants(rug, include_root=True))
        size = (rug_bounds[1] - rug_bounds[0]).to_tuple()
        return {
            "objectName": rug.name,
            "center": rounded(rug.matrix_world.translation),
            "size": [round(size[0], 4), round(size[1], 4), round(size[2], 4)],
            "cornerRadius": 0.25 if name.startswith("WORK_POD") else 0.35,
            "material": rug.data.materials[0].name if rug.data.materials else None,
            "bounds": {"min": rounded(rug_bounds[0]), "max": rounded(rug_bounds[1])},
        }

    pod_rug_records = {
        "left": rug_record("WORK_POD_RUG_LEFT"),
        "right": rug_record("WORK_POD_RUG_RIGHT"),
        "centralWoodChannelM": round(pod_rugs["right"].matrix_world.translation.x - pod_rugs["left"].matrix_world.translation.x - (rug_record("WORK_POD_RUG_RIGHT")["size"][0]), 4),
    }
    meeting_table = bpy.data.objects.get("MEETING_TABLE_TOP")
    dining_table = bpy.data.objects.get("DINING_TABLE_TOP")
    coffee_cabinet = bpy.data.objects.get("COFFEE_CABINET")
    vp2_furniture = {
        "workstationRescale": workstation_rescale,
        "sofaRescale": sofa_rescale,
        "workstationVisualDimensions": {
            "deskTop": {
                "before": [1.432, 0.766, 0.046],
                "after": [1.654, 0.885, 0.0612],
                "topHeightUnchanged": 0.751,
            },
            "chairSeat": {
                "before": [0.498, 0.518, 0.078],
                "after": [0.586, 0.610, 0.078],
                "seatTopUnchanged": 0.525,
            },
            "monitorScreen": {
                "before": [0.48, 0.26],
                "after": [0.5242, 0.2839],
                "areaIncreasePct": 19.1,
            },
        },
        "sofaDimensions": {
            "before": [1.70, 0.78, 0.46],
            "after": [1.981, 0.876, 0.483],
            "widthIncreasePct": 16.5,
            "depthIncreasePct": 12.3,
        },
        "meeting": {
            "tableDiameter": 2.1,
            "tableThickness": 0.10,
            "chairCount": 4,
            "chairScaleIncreasePct": 14.0,
            "legThickness": 0.052,
            "angleVarianceDeg": [-4.0, 2.5, -2.0, 4.5],
            "footprint": facility_bounds("meeting"),
        },
        "dining": {
            "tableSize": [1.9, 1.15],
            "benchCount": 2,
            "benchSeatSize": [1.35, 0.40, 0.07],
            "ceramicCount": 3,
            "footprint": facility_bounds("dining"),
        },
        "coffee": {
            "cabinetSize": [1.40, 0.55, 0.84],
            "machineSize": [0.64, 0.40, 0.62],
            "zoneWidth": 1.44,
            "zoneDepth": 0.59,
            "footprint": facility_bounds("coffee"),
        },
        "catHome": {
            "totalHeight": 0.19,
            "rimOuterRadius": 0.624,
            "hasPillow": True,
        },
        "catRest": {
            "padRadius": 0.30,
            "totalHeight": 0.10,
        },
        "podRugs": pod_rug_records,
        "sofaRug": rug_record("SOFA_RUG"),
        "sofaCoffeeTable": {
            "topSize": [0.95, 0.55, 0.05],
            "topHeight": 0.395,
            "footprint": {
                "min": rounded(world_bounds([bpy.data.objects["SOFA_COFFEE_TABLE_TOP"]])[0]),
                "max": rounded(world_bounds([bpy.data.objects["SOFA_COFFEE_TABLE_TOP"]])[1]),
            },
        },
    }
    manifest = {
        "schemaVersion": 1,
        "sourceCoordinateContract": project_relative(CONTRACT_PATH),
        "sourceCommit": contract["sourceCommit"],
        "rootName": FULL_ROOT,
        "roomSize": contract["room"]["size"],
        "floorTopZ": 0.0,
        "floorTextureMode": "unique-full-room-atlas",
        "floorTextureWorldSize": [contract["room"]["size"]["width"], contract["room"]["size"]["depth"]],
        "floorUvMetersPerRepeat": 0.0,
        "floorSeamStats": _floor_seam_stats(),
        "vp2FloorTextures": [project_relative(path) for path in sorted(VP2_TEXTURE_DIR.glob("floor_wood_vp2_*.png"))],
        "meshCount": total_stats[0],
        "triangleCount": total_stats[1],
        "architecture": {"meshCount": architecture_stats[0], "triangleCount": architecture_stats[1]},
        "workstations": workstation_manifest,
        "workstationTotals": {"meshCount": workstation_stats[0], "triangleCount": workstation_stats[1]},
        "sofaFixedStats": {"meshCount": EXPECTED_SOFA_MESHES, "triangleCount": EXPECTED_SOFA_TRIANGLES},
        "fixedAssetTotals": {"meshCount": 301, "triangleCount": 55840},
        "amenities": {"meshCount": amenities_stats[0], "triangleCount": amenities_stats[1], "facilities": facility_manifest},
        "vp2Furniture": vp2_furniture,
        "materialNames": material_names,
        "textureNames": used_texture_names(),
        "officeAnchorPositions": anchor_positions,
        "bounds": {"min": rounded(bounds[0]), "max": rounded(bounds[1])},
        "restroomStatusMarkerConflictDistance": round(restroom_conflict_distance, 6),
        "unresolvedItemsPreserved": [
            {"id": item["id"], "issue": item["issue"]}
            for item in contract["unresolved"]
        ],
    }
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(manifest, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    print("FULL_OFFICE_MANIFEST", project_relative(path), total_stats[0], total_stats[1])
    return manifest


def export_glb(root, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in descendants(root, include_root=True):
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root
    bpy.ops.export_scene.gltf(
        filepath=str(path), export_format="GLB", use_selection=True, export_apply=False,
        export_materials="EXPORT", export_extras=True, export_animations=False,
        export_skins=False, export_cameras=False, export_lights=False,
        export_draco_mesh_compression_enable=False,
    )
    if not path.is_file() or path.stat().st_size < 100000:
        raise RuntimeError("Full OfficeWorld GLB was not produced correctly")
    print("FULL_OFFICE_GLB", project_relative(path), path.stat().st_size)


def render_preview(path, bounds):
    bpy.ops.object.light_add(type="SUN", location=(0, 0, 10))
    sun = bpy.context.object
    sun.name = "TEMP_PREVIEW_SUN"
    sun.rotation_euler = (math.radians(28), math.radians(-20), math.radians(-32))
    sun.data.energy = 1.6
    sun.data.color = (1.0, 0.88, 0.74)
    sun.data.angle = math.radians(16)
    bpy.ops.object.light_add(type="AREA", location=(-3.5, -5.5, 9.0))
    key = bpy.context.object
    key.name = "TEMP_PREVIEW_KEY"
    key.data.energy = 1800
    key.data.shape = "DISK"
    key.data.size = 8.0
    key.data.color = (1.0, 0.92, 0.82)
    bpy.ops.object.light_add(type="AREA", location=(7.0, 4.0, 6.0))
    fill = bpy.context.object
    fill.name = "TEMP_PREVIEW_FILL"
    fill.data.energy = 850
    fill.data.size = 7.0
    fill.data.color = (0.80, 0.88, 1.0)

    target = Vector((0, 0, 0.85))
    camera_location = three_to_blender_position((10.8, 11.8, 14.5))
    bpy.ops.object.camera_add(location=camera_location)
    camera = bpy.context.object
    camera.name = "TEMP_PREVIEW_CAMERA"
    camera.data.type = "ORTHO"
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.view_layer.update()
    corners = [Vector((x, y, z)) for x in (bounds[0].x, bounds[1].x) for y in (bounds[0].y, bounds[1].y) for z in (0, bounds[1].z)]
    basis = camera.matrix_world.to_3x3()
    right = basis.col[0].normalized()
    up = basis.col[1].normalized()
    projected_width = max((corner - target).dot(right) for corner in corners) - min((corner - target).dot(right) for corner in corners)
    projected_height = max((corner - target).dot(up) for corner in corners) - min((corner - target).dot(up) for corner in corners)
    camera.data.ortho_scale = max(projected_height, projected_width / (1920 / 1080)) * 1.20
    scene = bpy.context.scene
    scene.camera = camera
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.render.filepath = str(path)
    scene.view_settings.look = "AgX - Medium High Contrast"
    world = bpy.data.worlds.new("TEMP_CLEAR_DAY_WORLD")
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    if background is None:
        background = world.node_tree.nodes.new("ShaderNodeBackground")
        output = world.node_tree.nodes.get("World Output")
        if output is None:
            output = world.node_tree.nodes.new("ShaderNodeOutputWorld")
        world.node_tree.links.new(background.outputs[0], output.inputs[0])
    background.inputs["Color"].default_value = (0.24, 0.31, 0.40, 1.0)
    background.inputs["Strength"].default_value = 0.42
    scene.world = world
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.render.render(write_still=True)
    if not path.is_file() or path.stat().st_size < 10000:
        raise RuntimeError("Full office preview was not produced correctly")
    print("FULL_OFFICE_PREVIEW", project_relative(path), "1920x1080", path.stat().st_size)
    for obj in (camera, sun, key, fill):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.worlds.remove(world)


def main():
    args = parse_args()
    contract_path = Path(args.contract).resolve()
    source_path = Path(args.source).resolve()
    output_path = Path(args.output).resolve()
    glb_path = Path(args.glb).resolve()
    manifest_path = Path(args.manifest).resolve()
    preview_path = Path(args.preview).resolve()
    for path in (contract_path, source_path):
        if not path.is_file():
            raise RuntimeError(f"Required input missing: {project_relative(path)}")
    protected = {contract_path, source_path}
    if output_path in protected or glb_path.name in {"vq1c-hero-corner.glb", "vq1c-hero-corner-polished.glb", "vq1c-hero-corner-pbr.glb"}:
        raise RuntimeError("Refusing to overwrite a protected input or Hero Corner GLB")

    contract = load_contract(contract_path)
    bpy.ops.wm.open_mainfile(filepath=str(source_path))
    source_objects = list(bpy.data.objects)
    source_workstation = bpy.data.objects.get("POLISHED_WORKSTATION_ROOT")
    source_sofa = bpy.data.objects.get("POLISHED_SOFA_ROOT")
    if source_workstation is None or source_sofa is None:
        raise RuntimeError("PBR source lacks polished workstation or sofa root")
    create_rug_muted_material()
    create_rug_sofa_muted_material()
    create_accent_terracotta_material()
    validate_fixed_asset(source_workstation, EXPECTED_WORKSTATION_MESHES, EXPECTED_WORKSTATION_TRIANGLES, "source_workstation")
    validate_fixed_asset(source_sofa, EXPECTED_SOFA_MESHES, EXPECTED_SOFA_TRIANGLES, "source_sofa")
    if REQUIRED_MATERIALS - set(bpy.data.materials.keys()):
        raise RuntimeError("PBR source is missing required semantic materials")

    # VP2 Gate 2A/2B: bake visual proportion rescale into the shared source
    # datablocks once (the four workstation copies share these datablocks).
    workstation_rescale = rescale_subtree(source_workstation, WORKSTATION_RESCALE, "workstation")
    sofa_rescale = rescale_subtree(source_sofa, SOFA_RESCALE, "sofa")
    bpy.context.view_layer.update()

    full_root = new_empty(FULL_ROOT)
    arch_root = new_empty(ARCH_ROOT, full_root)
    workstations_root = new_empty(WORKSTATIONS_ROOT, full_root)
    amenities_root = new_empty(AMENITIES_ROOT, full_root)
    anchors_root = new_empty(ANCHORS_ROOT, full_root)
    full_root["source_coordinate_contract"] = project_relative(contract_path)
    full_root["source_commit"] = contract["sourceCommit"]

    apply_vp2_floor_material()
    apply_vp2_wall_color()
    adjust_chair_fabric_color()

    workstation_manifest = build_workstations(contract, source_workstation, workstations_root, anchors_root)
    facility_manifest, restroom_distance = build_facilities(contract, source_sofa, amenities_root, anchors_root)
    workstation_bounds = {
        entry["id"]: world_bounds(descendants(bpy.data.objects[entry["rootName"]], include_root=True))
        for entry in workstation_manifest
    }
    pod_rugs = create_pod_rugs(amenities_root, workstation_bounds)
    create_pod_share(amenities_root, -2.65, "left")
    create_pod_share(amenities_root, 2.65, "right")
    create_sofa_rug(amenities_root)
    create_sofa_coffee_table(amenities_root)
    remove_source_objects(source_objects)
    create_architecture(contract, arch_root)
    validate_workstation_separation(workstation_manifest)
    bpy.context.view_layer.update()
    validate_formal_scene(full_root, contract, workstation_manifest)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.file.make_paths_relative()
    bpy.ops.wm.save_as_mainfile(filepath=str(output_path))
    print("FULL_OFFICE_BLEND", project_relative(output_path))
    manifest = write_manifest(
        manifest_path, contract, workstation_manifest, facility_manifest, restroom_distance,
        workstation_rescale, sofa_rescale, pod_rugs,
    )
    export_glb(full_root, glb_path)
    formal_bounds = (Vector(manifest["bounds"]["min"]), Vector(manifest["bounds"]["max"]))
    render_preview(preview_path, formal_bounds)
    print("VQ1C_FULL_OFFICE_BUILD_OK")


if __name__ == "__main__":
    main()
