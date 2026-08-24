"""Validate the full VQ-1C OfficeWorld Blend or a factory-empty GLB import."""

import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Matrix, Vector


REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_PATH = REPO_ROOT / "docs/assets/vq1c-officeworld-coordinate-contract.json"
BLEND_PATH = REPO_ROOT / "assets-source/blender/vq1c/full-office/vq1c-officeworld-full-pbr.blend"
GLB_PATH = REPO_ROOT / "public/models/vq1/vq1c-officeworld-full-pbr.glb"
MANIFEST_PATH = REPO_ROOT / "assets-source/blender/vq1c/full-office/vq1c-officeworld-full-manifest.json"

FULL_ROOT = "VQ1C_FULL_OFFICE_ROOT"
TOP_LEVEL_GROUPS = {"OFFICE_ARCH_ROOT", "OFFICE_WORKSTATIONS_ROOT", "OFFICE_AMENITIES_ROOT", "OFFICE_ANCHORS_ROOT"}
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
FORBIDDEN_ROOTS = {"VQ1C_POLISHED_HERO_ROOT", "HERO_ARCH_ROOT", "POLISHED_WORKSTATION_ROOT", "POLISHED_SOFA_ROOT"}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("blend", "glb"), required=True)
    parser.add_argument("--contract", default=str(CONTRACT_PATH))
    parser.add_argument("--blend", default=str(BLEND_PATH))
    parser.add_argument("--glb", default=str(GLB_PATH))
    parser.add_argument("--manifest", default=str(MANIFEST_PATH))
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(argv)


def load_json(path):
    with Path(path).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def three_to_blender_position(position):
    x, y, z = position
    return Vector((x, -z, y))


def blender_to_three_direction(direction):
    x, y, z = direction
    return Vector((x, z, -y))


def rotation_value(value):
    return float(value["radians"] if isinstance(value, dict) else value)


def descendants(root, include_root=False):
    result = [root] if include_root else []
    stack = list(root.children)
    while stack:
        obj = stack.pop()
        result.append(obj)
        stack.extend(obj.children)
    return result


def is_descendant(obj, root):
    current = obj
    while current:
        if current is root:
            return True
        current = current.parent
    return False


def stats(objects):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    meshes = [obj for obj in objects if obj.type == "MESH"]
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


def bounds(objects):
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
        raise RuntimeError("No meshes available for bounds")
    return minimum, maximum


def rounded(vector, digits=6):
    return tuple(round(float(value), digits) for value in vector)


def aabb_intersects(a, b, tolerance=0.001):
    return all(a[0][axis] < b[1][axis] - tolerance and a[1][axis] > b[0][axis] + tolerance for axis in range(3))


def check_identity(obj, failures, label):
    identity = Matrix.Identity(4)
    error = max(abs(obj.matrix_world[row][column] - identity[row][column]) for row in range(4) for column in range(4))
    if obj.parent is not None or error > 0.00001:
        failures.append(f"{label} is not top-level identity: error={error}")


def facility_root_name(facility_id):
    return f"OFFICE_{facility_id.replace('-', '_').upper()}_ROOT"


def facility_anchor_name(facility_id):
    return f"OFFICE_{facility_id.replace('-', '_').upper()}_ANCHOR"


def validate_textures(mode, manifest, failures):
    expected = set(manifest["textureNames"])
    expected_lookup = {Path(name).stem if mode == "glb" else name: name for name in expected}
    observed = set()
    for image in bpy.data.images:
        filename = Path(bpy.path.abspath(image.filepath)).name if image.filepath else image.name
        lookup_name = image.name if mode == "glb" else filename
        if lookup_name in expected_lookup:
            observed.add(expected_lookup[lookup_name])
            if mode == "blend":
                absolute = Path(bpy.path.abspath(image.filepath)).resolve()
                if not absolute.is_file():
                    failures.append(f"texture file missing: {image.name}")
                else:
                    try:
                        absolute.relative_to(REPO_ROOT)
                    except ValueError:
                        failures.append(f"texture outside project: {image.name}")
            else:
                packed = image.packed_file is not None and image.packed_file.size > 0
                if not image.has_data and not packed:
                    try:
                        image.reload()
                    except RuntimeError:
                        pass
                if not image.has_data and not packed:
                    failures.append(f"embedded GLB texture data missing: {image.name}")
    if expected - observed:
        failures.append(f"texture datablocks missing: {sorted(expected - observed)}")


def validate_workstations(contract, failures):
    workstation_bounds = []
    fixed_meshes = 0
    fixed_triangles = 0
    for workstation in contract["workstations"]:
        number = int(workstation["id"].split("_")[-1])
        root_name = f"OFFICE_WORKSTATION_DESK_{number}_ROOT"
        root = bpy.data.objects.get(root_name)
        if root is None:
            failures.append(f"workstation root missing: {root_name}")
            continue
        expected_position = Vector(workstation["blenderRootTarget"])
        position_error = (root.matrix_world.translation - expected_position).length
        if position_error > 0.001:
            failures.append(f"{root_name} position error {position_error}")
        scale = root.matrix_world.to_scale()
        if (scale - Vector((1, 1, 1))).length > 0.00001:
            failures.append(f"{root_name} scale is not identity: {tuple(scale)}")
        forward_blender = (root.matrix_world.to_3x3() @ Vector((0, -1, 0))).normalized()
        actual_facing = blender_to_three_direction(forward_blender).normalized()
        expected_facing = Vector(workstation["facingDirection"]).normalized()
        facing_error = (actual_facing - expected_facing).length
        print("VALIDATE_WORKSTATION_FACING", workstation["id"], rounded(actual_facing), "expected", rounded(expected_facing), "error", f"{facing_error:.9f}")
        if facing_error > 0.000001:
            failures.append(f"{root_name} facing error {facing_error}")
        subtree = descendants(root, include_root=True)
        subtree_stats = stats(subtree)
        print("VALIDATE_WORKSTATION_STATS", workstation["id"], subtree_stats[0], subtree_stats[1])
        if subtree_stats != (EXPECTED_WORKSTATION_MESHES, EXPECTED_WORKSTATION_TRIANGLES, []):
            failures.append(f"{root_name} fixed stats differ: {subtree_stats}")
        fixed_meshes += subtree_stats[0]
        fixed_triangles += subtree_stats[1]
        current_bounds = bounds(subtree)
        workstation_bounds.append((root_name, current_bounds))
        if current_bounds[0].z < -0.01:
            failures.append(f"{root_name} penetrates floor: minZ={current_bounds[0].z}")

        seat_name = f"OFFICE_DESK_{number}_SEAT_ANCHOR"
        seat = bpy.data.objects.get(seat_name)
        expected_seat = three_to_blender_position(workstation["seatWorkPosition"])
        if seat is None:
            failures.append(f"seat anchor missing: {seat_name}")
            continue
        seat_error = (seat.matrix_world.translation - expected_seat).length
        if seat_error > 0.001:
            failures.append(f"{seat_name} position error {seat_error}")
        if seat.get("source_id") != f"{workstation['id']}:{workstation['sceneKey']}":
            failures.append(f"{seat_name} character/desk binding property is wrong")
        chair_root = bpy.data.objects.get(f"D{number}_POLISHED_CHAIR_ROOT")
        if chair_root is None or not is_descendant(chair_root, root):
            failures.append(f"chair root missing or mis-parented for {root_name}")
        else:
            chair_center = sum(bounds(descendants(chair_root, include_root=True)), Vector()) / 2
            root_horizontal = Vector((chair_root.matrix_world.translation.x - seat.matrix_world.translation.x, chair_root.matrix_world.translation.y - seat.matrix_world.translation.y, 0)).length
            center_horizontal = Vector((chair_center.x - seat.matrix_world.translation.x, chair_center.y - seat.matrix_world.translation.y, 0)).length
            print("VALIDATE_CHAIR_SEAT_DISTANCE", workstation["id"], "chair_root", rounded(chair_root.matrix_world.translation), "chair_center", rounded(chair_center), "seat", rounded(seat.matrix_world.translation), f"root={root_horizontal:.6f}", f"center={center_horizontal:.6f}")
            if root_horizontal < 0.05:
                failures.append(f"{workstation['id']} chair was incorrectly moved onto the business seat")
        for asset, base, socket in (
            ("monitor", f"D{number}_MONITOR_BASE_ANCHOR", f"D{number}_MONITOR_SOCKET"),
            ("keyboard", f"D{number}_KEYBOARD_BASE_ANCHOR", f"D{number}_KEYBOARD_SOCKET"),
            ("lamp", f"D{number}_LAMP_BASE_ANCHOR", f"D{number}_LAMP_SOCKET"),
        ):
            base_obj = bpy.data.objects.get(base)
            socket_obj = bpy.data.objects.get(socket)
            if base_obj is None or socket_obj is None:
                failures.append(f"{workstation['id']} internal {asset} anchor missing")
            else:
                error = (base_obj.matrix_world.translation - socket_obj.matrix_world.translation).length
                print("VALIDATE_DEVICE_ANCHOR", workstation["id"], asset, f"{error:.9f}")
                if error > 0.0001:
                    failures.append(f"{workstation['id']} {asset} anchor alignment error {error}")
        light_anchor = bpy.data.objects.get(f"D{number}_LIGHT_DESK_ANCHOR")
        if light_anchor is None or not is_descendant(light_anchor, root):
            failures.append(f"{workstation['id']} internal light anchor missing")

    for index, (first_name, first_bounds) in enumerate(workstation_bounds):
        for second_name, second_bounds in workstation_bounds[index + 1 :]:
            if aabb_intersects(first_bounds, second_bounds):
                failures.append(f"workstation AABBs intersect: {first_name}/{second_name}")
    if (fixed_meshes, fixed_triangles) != (292, 50176):
        failures.append(f"four-workstation totals differ: {(fixed_meshes, fixed_triangles)}")
    return fixed_meshes, fixed_triangles


def validate_facilities(contract, manifest, failures):
    room_width = contract["room"]["size"]["width"]
    room_depth = contract["room"]["size"]["depth"]
    for facility in contract["facilities"]:
        facility_id = facility["id"]
        root = bpy.data.objects.get(facility_root_name(facility_id))
        anchor = bpy.data.objects.get(facility_anchor_name(facility_id))
        expected = three_to_blender_position(facility["visualPosition"])
        if root is None:
            failures.append(f"facility root missing: {facility_id}")
            continue
        error = (root.matrix_world.translation - expected).length
        if error > 0.001:
            failures.append(f"facility root position error {facility_id}: {error}")
        expected_rotation = rotation_value(facility.get("rotationY", 0))
        forward_expected = Matrix.Rotation(expected_rotation, 3, "Z") @ Vector((0, -1, 0))
        forward_actual = (root.matrix_world.to_3x3() @ Vector((0, -1, 0))).normalized()
        if (forward_actual - forward_expected).length > 0.00001:
            failures.append(f"facility facing differs: {facility_id}")
        if anchor is None or (anchor.matrix_world.translation - expected).length > 0.001:
            failures.append(f"facility anchor missing/wrong: {facility_id}")
        if abs(expected.x) > room_width / 2 + 0.001 or abs(expected.y) > room_depth / 2 + 0.001:
            failures.append(f"facility root outside nominal room: {facility_id}")
        print("VALIDATE_FACILITY", facility_id, rounded(root.matrix_world.translation), f"rotationZ={expected_rotation:.6f}")
    sofa = bpy.data.objects.get("OFFICE_SOFA_ROOT")
    if sofa:
        sofa_stats = stats(descendants(sofa, include_root=True))
        sofa_bounds = bounds(descendants(sofa, include_root=True))
        print("VALIDATE_SOFA_STATS", sofa_stats[0], sofa_stats[1], "bounds", rounded(sofa_bounds[0]), rounded(sofa_bounds[1]))
        if sofa_stats != (EXPECTED_SOFA_MESHES, EXPECTED_SOFA_TRIANGLES, []):
            failures.append(f"sofa fixed stats differ: {sofa_stats}")
        if abs(sofa_bounds[0].z) > 0.001:
            failures.append(f"sofa does not land at Z=0: {sofa_bounds[0].z}")
    status = bpy.data.objects.get("OFFICE_RESTROOM_STATUS_MARKER_ANCHOR")
    restroom = bpy.data.objects.get("OFFICE_RESTROOM_ANCHOR")
    contract_restroom = next(f for f in contract["facilities"] if f["id"] == "restroom")
    expected_status = three_to_blender_position(contract_restroom["statusMarkerPosition"])
    if status is None or (status.matrix_world.translation - expected_status).length > 0.001:
        failures.append("restroom status marker conflict coordinate was not preserved")
    elif restroom:
        conflict_distance = (status.matrix_world.translation - restroom.matrix_world.translation).length
        print("VALIDATE_RESTROOM_STATUS_CONFLICT", f"distance={conflict_distance:.6f}")
        if conflict_distance < 1.0:
            failures.append("restroom marker conflict was silently collapsed")
        if abs(conflict_distance - manifest.get("restroomStatusMarkerConflictDistance", 0.0)) > 0.001:
            failures.append("restroom marker conflict distance differs from manifest")


def validate_architecture(contract, failures):
    arch = bpy.data.objects.get("OFFICE_ARCH_ROOT")
    floor = bpy.data.objects.get("FLOOR")
    if arch is None or floor is None or not is_descendant(floor, arch):
        failures.append("architecture root or FLOOR missing")
        return
    floor_bounds = bounds([floor])
    width = floor_bounds[1].x - floor_bounds[0].x
    depth = floor_bounds[1].y - floor_bounds[0].y
    print("VALIDATE_FLOOR", "size", f"{width:.6f}", f"{depth:.6f}", "top", f"{floor_bounds[1].z:.6f}", "bottom", f"{floor_bounds[0].z:.6f}")
    if abs(width - contract["room"]["size"]["width"]) > 0.001 or abs(depth - contract["room"]["size"]["depth"]) > 0.001:
        failures.append("floor dimensions differ from room contract")
    if abs(floor_bounds[1].z) > 0.001:
        failures.append("floor top is not Z=0")
    arch_bounds = bounds(descendants(arch, include_root=True))
    if abs(arch_bounds[1].z - contract["room"]["size"]["heightAboveFloor"]) > 0.001:
        failures.append(f"wall height differs: {arch_bounds[1].z}")
    required = {
        "BACK_WALL_RESTROOM_LINTEL", "LEFT_WALL_ENTRANCE_LINTEL",
        "WINDOW_FRAME_LEFT", "WINDOW_FRAME_RIGHT", "WINDOW_GLASS",
    }
    missing = required - set(bpy.data.objects.keys())
    if missing:
        failures.append(f"architecture opening/frame objects missing: {sorted(missing)}")
    # VP2 additions: baseboards, door jambs, window jambs
    vp2_required = {
        "BASEBOARD_BACK_LEFT", "BASEBOARD_BACK_CENTER", "BASEBOARD_BACK_RIGHT",
        "BASEBOARD_BACK_WINDOW", "BASEBOARD_LEFT_BACK", "BASEBOARD_LEFT_FRONT",
        "WINDOW_JAMB_LEFT", "WINDOW_JAMB_RIGHT", "WINDOW_JAMB_TOP",
        "ENTRANCE_JAMB_LEFT", "ENTRANCE_JAMB_RIGHT", "ENTRANCE_JAMB_TOP",
        "RESTROOM_JAMB_LEFT", "RESTROOM_JAMB_RIGHT", "RESTROOM_JAMB_TOP",
    }
    vp2_missing = vp2_required - set(bpy.data.objects.keys())
    if vp2_missing:
        failures.append(f"VP2 architecture trim objects missing: {sorted(vp2_missing)}")
    # VP2-1b: floor must use the unique full-room atlas with 0..1 UV (no repeat)
    mode = floor.get("floor_texture_mode")
    if mode != "unique-full-room-atlas":
        failures.append(f"FLOOR texture mode is {mode}, expected unique-full-room-atlas")
    world_size = floor.get("floor_texture_world_size")
    if world_size is None or abs(world_size[0] - contract["room"]["size"]["width"]) > 0.001 or abs(world_size[1] - contract["room"]["size"]["depth"]) > 0.001:
        failures.append(f"FLOOR atlas world size differs: {world_size}")
    uv_scale = floor.get("floor_uv_meters_per_repeat")
    if uv_scale is not None and uv_scale != 0.0:
        failures.append(f"FLOOR still uses repeating UV: meters_per_repeat={uv_scale}")
    # UV range must cover [0,1] over the full floor
    if floor.data.uv_layers.active is None:
        failures.append("FLOOR has no UV layer")
    else:
        min_u, max_u, min_v, max_v = 1.0, 0.0, 1.0, 0.0
        for loop in floor.data.uv_layers.active.data:
            min_u = min(min_u, loop.uv[0]); max_u = max(max_u, loop.uv[0])
            min_v = min(min_v, loop.uv[1]); max_v = max(max_v, loop.uv[1])
        print("VALIDATE_FLOOR_UV", "u", round(min_u, 6), round(max_u, 6), "v", round(min_v, 6), round(max_v, 6))
        if min_u < -0.001 or max_u > 1.001 or min_v < -0.001 or max_v > 1.001:
            failures.append("FLOOR UV exceeds the 0..1 atlas range")


def validate_floor_seam_stats(manifest, failures):
    """Verify the deterministic plank layout keeps adjacent-row short-end seams apart."""
    import importlib.util
    from pathlib import Path as _Path
    repo = _Path(__file__).resolve().parents[2]
    generator_path = repo / "tools/blender/build_vq1c_vp2_floor_textures.py"
    spec = importlib.util.spec_from_file_location("build_vq1c_vp2_floor_textures", str(generator_path))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    row_count, total_seams, min_distance, pair, coords = module.seam_statistics()
    print("VALIDATE_SEAM_STATS", "rows", row_count, "seams", total_seams, "min_adjacent", round(min_distance, 6), "pair", pair, "coords", coords)
    if min_distance < 0.30:
        failures.append(f"Adjacent-row seam distance {min_distance:.6f} below 0.30m")
    recorded = manifest.get("floorSeamStats")
    if not recorded:
        failures.append("Manifest missing floorSeamStats")
        return
    if recorded.get("minAdjacentRowSeamDistance") != round(min_distance, 6):
        failures.append("Manifest seam distance differs from recomputed layout")
    if recorded.get("totalSeams") != total_seams:
        failures.append("Manifest totalSeams differs from recomputed layout")


def validate_vp2_floor(mode, failures):
    """VP2 Gate 1: FLOOR must use the derived VP2 floor textures, not originals."""
    floor = bpy.data.objects.get("FLOOR")
    if floor is None:
        failures.append("VP2: FLOOR missing")
        return
    if not floor.data.materials or floor.data.materials[0] is None:
        failures.append("VP2: FLOOR has no material")
        return
    material = floor.data.materials[0]
    if material.name != "VQ_Floor_Wood":
        failures.append(f"VP2: FLOOR material is {material.name}, expected VQ_Floor_Wood")
        return
    texture_filenames = set()
    if material.use_nodes:
        for node in material.node_tree.nodes:
            if node.type == "TEX_IMAGE" and node.image:
                raw = bpy.path.abspath(node.image.filepath) if node.image.filepath else node.image.name
                texture_filenames.add(Path(raw).stem)
    expected = {
        "floor_wood_vp2_basecolor",
        "floor_wood_vp2_roughness",
        "floor_wood_vp2_normal",
    }
    print("VP2_FLOOR_TEXTURES", sorted(texture_filenames))
    if expected - texture_filenames:
        failures.append(f"VP2: FLOOR does not use all VP2 derived textures: missing {sorted(expected - texture_filenames)}")
    originals = {"floor_wood_basecolor", "floor_wood_roughness", "floor_wood_normal"}
    if originals.intersection(texture_filenames):
        failures.append("VP2: FLOOR still references original floor textures")


def validate_vp2_spatial(contract, manifest, failures):
    """VP2 Gate 2B spatial rules: pod rugs, central wooden channel, zone
    footprints, landings, aisle clearance, and low cat furniture."""
    room_width = contract["room"]["size"]["width"]
    room_depth = contract["room"]["size"]["depth"]
    half_w = room_width / 2
    half_d = room_depth / 2

    def within_room(name, minimum, maximum):
        if abs(minimum.x) > half_w + 0.001 or abs(maximum.x) > half_w + 0.001:
            failures.append(f"VP2-2B: {name} exceeds room width")
        if abs(minimum.y) > half_d + 0.001 or abs(maximum.y) > half_d + 0.001:
            failures.append(f"VP2-2B: {name} exceeds room depth")
        if minimum.z < -0.001:
            failures.append(f"VP2-2B: {name} penetrates floor: {minimum.z}")

    def rug_checks(name, material_name, max_thickness=0.016):
        rug = bpy.data.objects.get(name)
        if rug is None:
            failures.append(f"VP2-2B: {name} missing")
            return None
        rug_bounds = bounds(descendants(rug, include_root=True))
        minimum, maximum = rug_bounds
        print("VALIDATE_RUG", name, rounded(minimum), rounded(maximum))
        if minimum.z < -0.001:
            failures.append(f"VP2-2B: {name} penetrates floor: {minimum.z}")
        if maximum.z - minimum.z > max_thickness:
            failures.append(f"VP2-2B: {name} too thick: {maximum.z - minimum.z}")
        within_room(name, minimum, maximum)
        if not rug.data.materials or rug.data.materials[0].name != material_name:
            failures.append(f"VP2-2B: {name} material is not {material_name}")
        return (minimum, maximum)

    left_rug = rug_checks("WORK_POD_RUG_LEFT", "VQ_Rug_Muted")
    right_rug = rug_checks("WORK_POD_RUG_RIGHT", "VQ_Rug_Muted")
    sofa_rug = rug_checks("SOFA_RUG", "VQ_Rug_Sofa_Muted")

    if left_rug is not None and right_rug is not None:
        if aabb_intersects(left_rug, right_rug):
            failures.append("VP2-2B: pod rugs overlap")
        channel = right_rug[0].x - left_rug[1].x
        print("VALIDATE_CENTRAL_CHANNEL", f"{channel:.6f}")
        if channel < 1.8 or channel > 2.2:
            failures.append(f"VP2-2B: central wooden channel {channel:.3f}m outside 1.8..2.2m")
    if left_rug is not None and sofa_rug is not None and aabb_intersects(left_rug, sofa_rug):
        failures.append("VP2-2B: sofa rug overlaps left pod rug")
    if right_rug is not None and sofa_rug is not None and aabb_intersects(right_rug, sofa_rug):
        failures.append("VP2-2B: sofa rug overlaps right pod rug")

    zone_pairs = [("meeting", "dining"), ("meeting", "sofa"), ("dining", "sofa"),
                  ("meeting", "coffee"), ("dining", "coffee"), ("sofa", "coffee")]
    zone_bounds = {}
    for facility_id in ("meeting", "dining", "sofa", "coffee"):
        root = bpy.data.objects.get(facility_root_name(facility_id))
        if root is None:
            failures.append(f"VP2-2B: zone root missing: {facility_id}")
            continue
        zone_bounds[facility_id] = bounds(descendants(root, include_root=True))
        minimum, maximum = zone_bounds[facility_id]
        within_room(facility_id, minimum, maximum)
        print("VALIDATE_ZONE", facility_id, rounded(minimum), rounded(maximum))
        # Pod rugs must stay clear of every zone; the sofa rug may sit under
        # the sofa itself, so it is only checked against the other zones.
        for label, rug_bounds in (("left pod rug", left_rug), ("right pod rug", right_rug)):
            if rug_bounds is not None and aabb_intersects(rug_bounds, (minimum, maximum)):
                failures.append(f"VP2-2B: {label} overlaps {facility_id} zone")
        if facility_id != "sofa" and sofa_rug is not None and aabb_intersects(sofa_rug, (minimum, maximum)):
            failures.append(f"VP2-2B: sofa rug overlaps {facility_id} zone")
    for first, second in zone_pairs:
        if first in zone_bounds and second in zone_bounds:
            if aabb_intersects(zone_bounds[first], zone_bounds[second]):
                failures.append(f"VP2-2B: {first}/{second} footprints intersect")

    for prefix in ("MEETING_CHAIR_", "DINING_BENCH_"):
        roots = [obj for obj in bpy.data.objects if obj.parent is not None and obj.name.startswith(prefix) and obj.type == "EMPTY"]
        for root in roots:
            minimum, _ = bounds(descendants(root, include_root=True))
            if minimum.z < -0.001:
                failures.append(f"VP2-2B: {root.name} does not land: {minimum.z}")

    # Cat furniture must stay clearly below table height (0.75m table tops).
    for name in ("OFFICE_CAT_HOME_ROOT", "OFFICE_CAT_ACTOR_REST_ROOT"):
        root = bpy.data.objects.get(name)
        if root is None:
            continue
        minimum, maximum = bounds(descendants(root, include_root=True))
        print("VALIDATE_CAT_ZONE", name, rounded(minimum), rounded(maximum))
        if maximum.z > 0.45:
            failures.append(f"VP2-2B: {name} too tall for a cat rest: {maximum.z}")

    # Central aisle: the open wooden corridor between the two pod rugs must stay clear.
    if left_rug is not None and right_rug is not None:
        aisle_min_x = left_rug[1].x
        aisle_max_x = right_rug[0].x
    else:
        aisle_min_x, aisle_max_x = -1.1, 1.1
    aisle = (Vector((aisle_min_x, -3.2, 0.02)), Vector((aisle_max_x, 3.2, 4.5)))
    for obj in bpy.data.objects:
        if obj.type != "MESH":
            continue
        if obj.name.startswith("WORK_POD_RUG") or obj.name == "SOFA_RUG":
            continue
        try:
            obj_bounds = bounds([obj])
        except RuntimeError:
            continue
        if aabb_intersects(aisle, obj_bounds):
            failures.append(f"VP2-2B: central aisle blocked by {obj.name}")

    # The sofa coffee table must not sit on the central aisle.
    table = bpy.data.objects.get("SOFA_COFFEE_TABLE_TOP")
    if table is None:
        failures.append("VP2-2B: SOFA_COFFEE_TABLE_TOP missing")
    else:
        table_bounds = bounds([table])
        print("VALIDATE_SOFA_COFFEE_TABLE", rounded(table_bounds[0]), rounded(table_bounds[1]))
        within_room("SOFA_COFFEE_TABLE", *table_bounds)
        if aabb_intersects(aisle, table_bounds):
            failures.append("VP2-2B: sofa coffee table blocks the central aisle")


def main():
    args = parse_args()
    contract = load_json(Path(args.contract).resolve())
    manifest = load_json(Path(args.manifest).resolve())
    if args.mode == "blend":
        bpy.ops.wm.open_mainfile(filepath=str(Path(args.blend).resolve()))
    else:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=str(Path(args.glb).resolve()))
    bpy.context.view_layer.update()
    failures = []

    root = bpy.data.objects.get(FULL_ROOT)
    if root is None:
        failures.append(f"{FULL_ROOT} missing")
    else:
        check_identity(root, failures, FULL_ROOT)
        direct = {child.name for child in root.children}
        if direct != TOP_LEVEL_GROUPS:
            failures.append(f"top-level hierarchy differs: {sorted(direct)}")
    for name in TOP_LEVEL_GROUPS:
        obj = bpy.data.objects.get(name)
        if obj is None or root is None or obj.parent is not root:
            failures.append(f"formal group missing/mis-parented: {name}")
    forbidden = FORBIDDEN_ROOTS.intersection(bpy.data.objects.keys())
    if forbidden:
        failures.append(f"temporary source roots remain: {sorted(forbidden)}")

    for obj in bpy.context.scene.objects:
        if obj.type in {"CAMERA", "LIGHT"}:
            failures.append(f"camera/light present: {obj.name}")
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 0.00002:
            failures.append(f"non-uniform scale: {obj.name} {tuple(scale)}")
        if obj.type == "MESH":
            if not obj.data.vertices:
                failures.append(f"empty mesh: {obj.name}")
            if len(obj.data.materials) != 1 or obj.data.materials[0] is None:
                failures.append(f"invalid material slot: {obj.name}")
            else:
                material = obj.data.materials[0]
                textured = material.use_nodes and any(node.type == "TEX_IMAGE" and node.image for node in material.node_tree.nodes)
                if textured and obj.data.uv_layers.active is None:
                    failures.append(f"textured mesh has no UV: {obj.name}")

    validate_architecture(contract, failures)
    workstation_totals = validate_workstations(contract, failures)
    validate_facilities(contract, manifest, failures)
    validate_vp2_spatial(contract, manifest, failures)

    # Group-sum invariant: arch + workstations + amenities + anchors must equal the total,
    # and no mesh may live directly under the full root.
    full_root = bpy.data.objects.get(FULL_ROOT)
    arch_group = bpy.data.objects.get("OFFICE_ARCH_ROOT")
    ws_group = bpy.data.objects.get("OFFICE_WORKSTATIONS_ROOT")
    amenities_group = bpy.data.objects.get("OFFICE_AMENITIES_ROOT")
    anchors_group = bpy.data.objects.get("OFFICE_ANCHORS_ROOT")
    direct_meshes = [o.name for o in full_root.children if o.type == "MESH"] if full_root else []
    if direct_meshes:
        failures.append(f"meshes directly under {FULL_ROOT}: {direct_meshes}")
    if anchors_group is not None:
        anchor_stats = stats(descendants(anchors_group, include_root=True))
        if anchor_stats[0] != 0:
            failures.append(f"OFFICE_ANCHORS_ROOT contains meshes: {anchor_stats}")
    group_stats = {
        "arch": stats(descendants(arch_group, include_root=True)) if arch_group else (0, 0, []),
        "workstations": stats(descendants(ws_group, include_root=True)) if ws_group else (0, 0, []),
        "amenities": stats(descendants(amenities_group, include_root=True)) if amenities_group else (0, 0, []),
        "anchors": anchor_stats if anchors_group is not None else (0, 0, []),
    }
    group_meshes = sum(item[0] for item in group_stats.values())
    group_triangles = sum(item[1] for item in group_stats.values())
    print("VALIDATE_GROUP_SUMS", {key: (item[0], item[1]) for key, item in group_stats.items()},
          "group_meshes", group_meshes, "group_triangles", group_triangles)
    if group_meshes != manifest["meshCount"] or group_triangles != manifest["triangleCount"]:
        failures.append(f"group sums ({group_meshes}/{group_triangles}) differ from manifest total ({manifest['meshCount']}/{manifest['triangleCount']})")

    full_objects = descendants(root, include_root=True) if root else list(bpy.context.scene.objects)
    total_stats = stats(full_objects)
    scene_bounds = bounds(full_objects)
    print("VALIDATE_TOTAL_STATS", total_stats[0], total_stats[1])
    print("VALIDATE_BOUNDS", rounded(scene_bounds[0]), rounded(scene_bounds[1]))
    if total_stats[0] != manifest["meshCount"] or total_stats[1] != manifest["triangleCount"] or total_stats[2]:
        failures.append(f"total stats differ from manifest: {total_stats} vs {(manifest['meshCount'], manifest['triangleCount'])}")
    expected_min = Vector(manifest["bounds"]["min"])
    expected_max = Vector(manifest["bounds"]["max"])
    tolerance = 0.003 if args.mode == "glb" else 0.0001
    if (scene_bounds[0] - expected_min).length > tolerance or (scene_bounds[1] - expected_max).length > tolerance:
        failures.append("scene bounds differ from manifest")
    if workstation_totals != (292, 50176):
        failures.append("fixed workstation aggregate invalid")
    sofa_manifest = manifest.get("sofaFixedStats", {})
    if (sofa_manifest.get("meshCount"), sofa_manifest.get("triangleCount")) != (9, 5664):
        failures.append("manifest sofa fixed stats invalid")
    if manifest.get("fixedAssetTotals") != {"meshCount": 301, "triangleCount": 55840}:
        failures.append("manifest fixed asset totals invalid")
    unresolved_expected = {item["id"] for item in contract["unresolved"]}
    unresolved_manifest = {item["id"] for item in manifest.get("unresolvedItemsPreserved", [])}
    if unresolved_expected != unresolved_manifest:
        failures.append("manifest does not preserve all unresolved items")

    used_materials = {material.name for obj in bpy.context.scene.objects if obj.type == "MESH" for material in obj.data.materials if material}
    if REQUIRED_MATERIALS - used_materials:
        failures.append(f"required materials missing: {sorted(REQUIRED_MATERIALS - used_materials)}")
    if set(manifest["materialNames"]) != used_materials:
        failures.append("used material set differs from manifest")
    validate_textures(args.mode, manifest, failures)
    validate_vp2_floor(mode=args.mode, failures=failures)
    validate_floor_seam_stats(manifest, failures)

    marker = "VQ1C_FULL_OFFICE_BLEND_VALIDATE_OK" if args.mode == "blend" else "VQ1C_FULL_OFFICE_GLB_REIMPORT_VALIDATE_OK"
    if failures:
        print(marker.replace("_OK", "_FAIL"))
        for failure in failures:
            print("FAIL", failure)
        sys.exit(1)
    print(marker)


if __name__ == "__main__":
    main()
