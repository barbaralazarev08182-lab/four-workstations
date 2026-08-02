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

    marker = "VQ1C_FULL_OFFICE_BLEND_VALIDATE_OK" if args.mode == "blend" else "VQ1C_FULL_OFFICE_GLB_REIMPORT_VALIDATE_OK"
    if failures:
        print(marker.replace("_OK", "_FAIL"))
        for failure in failures:
            print("FAIL", failure)
        sys.exit(1)
    print(marker)


if __name__ == "__main__":
    main()
