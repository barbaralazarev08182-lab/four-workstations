"""Build the VQ-1C polished Hero Corner from three verified asset blends."""

import argparse
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ARCH_INPUT = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "standardized", "architecture-standardized.blend")
WORKSTATION_INPUT = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "polished", "workstation-polished.blend")
SOFA_INPUT = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "polished", "sofa-polished.blend")
REFERENCE_INPUT = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "vq1c-hero-corner.blend")
OUTPUT_BLEND = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "polished", "vq1c-hero-corner-polished.blend")
OUTPUT_GLB = os.path.join(REPO_ROOT, "public", "models", "vq1", "vq1c-hero-corner-polished.glb")
OUTPUT_PREVIEW = os.path.join(REPO_ROOT, "outputs", "vq-1c", "visual-polish", "06-hero-corner-polished-clay.png")

ASSETS = {
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
FORBIDDEN_ROOTS = {
    "VQ1C_HERO_ROOT", "HERO_WORKSTATION_ROOT", "HERO_SOFA_ROOT",
    "STD_WORKSTATION_ROOT", "STD_SOFA_ROOT", "STD_DESK_ROOT",
    "STD_CHAIR_ROOT", "STD_MONITOR_ROOT", "STD_KEYBOARD_ROOT", "STD_LAMP_ROOT",
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--architecture", default=ARCH_INPUT)
    parser.add_argument("--workstation", default=WORKSTATION_INPUT)
    parser.add_argument("--sofa", default=SOFA_INPUT)
    parser.add_argument("--reference", default=REFERENCE_INPUT)
    parser.add_argument("--output", default=OUTPUT_BLEND)
    parser.add_argument("--glb", default=OUTPUT_GLB)
    parser.add_argument("--preview", default=OUTPUT_PREVIEW)
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


def clear_scene_and_orphans():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (
        bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.curves,
        bpy.data.cameras, bpy.data.lights, bpy.data.actions, bpy.data.armatures,
    ):
        for item in list(collection):
            collection.remove(item)


def world_bounds(objects):
    depsgraph = bpy.context.evaluated_depsgraph_get()
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
        raise RuntimeError("No evaluated mesh vertices found")
    return minimum, maximum


def subtree_stats(root):
    depsgraph = bpy.context.evaluated_depsgraph_get()
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


def inspect_input(path, root_name, expected_meshes, expected_triangles):
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing input: {path}")
    bpy.ops.wm.open_mainfile(filepath=path)
    bpy.context.view_layer.update()
    root = bpy.data.objects.get(root_name)
    if root is None:
        raise RuntimeError(f"Missing {root_name} in {path}")
    stats = subtree_stats(root)
    bounds = world_bounds(descendants(root))
    print(
        "INPUT_STATS", root_name, stats[0], stats[1],
        "BOUNDS", tuple(round(v, 6) for v in bounds[0]), tuple(round(v, 6) for v in bounds[1]),
    )
    if stats[0] != expected_meshes or stats[1] != expected_triangles or stats[2]:
        raise RuntimeError(
            f"Input {root_name} stats {(stats[0], stats[1], stats[2])} "
            f"!= {(expected_meshes, expected_triangles, [])}"
        )


def read_reference_matrices(path):
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing Hero Corner reference: {path}")
    bpy.ops.wm.open_mainfile(filepath=path)
    hero = bpy.data.objects.get("VQ1C_HERO_ROOT")
    if hero is None:
        raise RuntimeError("VQ1C_HERO_ROOT missing from reference")
    result = {}
    for key, name in {
        "architecture": "HERO_ARCH_ROOT",
        "workstation": "HERO_WORKSTATION_ROOT",
        "sofa": "HERO_SOFA_ROOT",
    }.items():
        obj = bpy.data.objects.get(name)
        if obj is None:
            raise RuntimeError(f"{name} missing from reference")
        matrix = hero.matrix_world.inverted() @ obj.matrix_world
        result[key] = matrix.copy()
        print(
            "REFERENCE_LOCAL", name,
            tuple(round(v, 6) for v in matrix.to_translation()),
            tuple(round(math.degrees(v), 6) for v in matrix.to_euler()),
            tuple(round(v, 6) for v in matrix.to_scale()),
        )
    expected = {
        "architecture": (Vector((0.0, 0.0, 0.0)), 0.0),
        "workstation": (Vector((0.65, 0.75, 0.0)), 0.0),
        "sofa": (Vector((-1.8682, 0.18, 0.0)), math.pi / 2),
    }
    for key, (location, rotation_z) in expected.items():
        matrix = result[key]
        if (matrix.to_translation() - location).length > 0.001:
            raise RuntimeError(f"Reference {key} location differs from known canonical value")
        if abs(matrix.to_euler().z - rotation_z) > 0.001:
            raise RuntimeError(f"Reference {key} Z rotation differs from known canonical value")
        if max(abs(v - 1.0) for v in matrix.to_scale()) > 1e-6:
            raise RuntimeError(f"Reference {key} scale is not identity")
    return result


def append_asset(path, root_name):
    with bpy.data.libraries.load(path, link=False) as (data_from, data_to):
        data_to.objects = [name for name in data_from.objects if name]
    loaded = [obj for obj in data_to.objects if obj is not None]
    for obj in loaded:
        bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.update()
    roots = [obj for obj in loaded if obj.name == root_name]
    if len(roots) != 1:
        raise RuntimeError(f"Expected one {root_name}, found {len(roots)}")
    unexpected = [obj.name for obj in loaded if obj.parent is None and obj is not roots[0]]
    if unexpected:
        raise RuntimeError(f"Unexpected top-level input objects: {unexpected}")
    return roots[0]


def set_local_matrix(child, parent, matrix):
    child.parent = parent
    child.matrix_parent_inverse = Matrix.Identity(4)
    child.matrix_basis = matrix
    bpy.context.view_layer.update()


def horizontal_aabb_gap(left_min, left_max, right_min, right_max):
    gap_x = max(right_min.x - left_max.x, left_min.x - right_max.x, 0.0)
    gap_y = max(right_min.y - left_max.y, left_min.y - right_max.y, 0.0)
    return math.hypot(gap_x, gap_y)


def validate_assembly(hero, roots, reference_matrices):
    failures = []
    if hero.parent is not None or hero.matrix_world != Matrix.Identity(4):
        failures.append("VQ1C_POLISHED_HERO_ROOT is not top-level identity")
    for key, root in roots.items():
        if root.parent is not hero:
            failures.append(f"{root.name} is not a direct child of polished hero root")
        error = max(
            abs(root.matrix_local[row][col] - reference_matrices[key][row][col])
            for row in range(4) for col in range(4)
        )
        if error > 1e-6:
            failures.append(f"{root.name} matrix error {error:.9f}")
        mesh_count, triangles, empty = subtree_stats(root)
        expected = ASSETS[key][1:]
        print("ASSEMBLED_SUBTREE", key, mesh_count, triangles)
        if (mesh_count, triangles) != expected or empty:
            failures.append(f"{key} subtree stats invalid: {(mesh_count, triangles, empty)}")
    total_meshes = sum(1 for obj in bpy.context.scene.objects if obj.type == "MESH")
    total_triangles = sum(subtree_stats(root)[1] for root in roots.values())
    if total_meshes != EXPECTED_MESHES or total_triangles != EXPECTED_TRIANGLES:
        failures.append(f"total stats {(total_meshes, total_triangles)} != {(EXPECTED_MESHES, EXPECTED_TRIANGLES)}")
    forbidden = [obj.name for obj in bpy.context.scene.objects if obj.name in FORBIDDEN_ROOTS]
    forbidden += [obj.name for obj in bpy.context.scene.objects if obj.type in {"CAMERA", "LIGHT"}]
    if forbidden:
        failures.append(f"forbidden formal objects: {forbidden}")
    for obj in bpy.context.scene.objects:
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-6:
            failures.append(f"non-uniform scale: {obj.name}")
    for anchor_name, socket_name in ALIGNMENTS:
        anchor = bpy.data.objects.get(anchor_name)
        socket = bpy.data.objects.get(socket_name)
        if anchor is None or socket is None:
            failures.append(f"missing alignment pair {anchor_name}/{socket_name}")
            continue
        error = (anchor.matrix_world.translation - socket.matrix_world.translation).length
        print("ANCHOR_ALIGNMENT", anchor_name, f"{error:.9f}")
        if error > 0.0001:
            failures.append(f"anchor alignment {anchor_name} error {error:.9f}")
    required_anchors = {
        "DESK_TOP_ANCHOR", "MONITOR_SOCKET", "KEYBOARD_SOCKET", "LAMP_SOCKET",
        "CHAIR_SEAT_ANCHOR", "MONITOR_BASE_ANCHOR", "KEYBOARD_BASE_ANCHOR",
        "LAMP_BASE_ANCHOR", "LIGHT_DESK_ANCHOR",
    }
    ws = roots["workstation"]
    for name in required_anchors:
        obj = bpy.data.objects.get(name)
        if obj is None or not is_descendant(obj, ws):
            failures.append(f"anchor {name} missing from workstation subtree")
    overall = world_bounds(bpy.context.scene.objects)
    arch_bounds = world_bounds(descendants(roots["architecture"]))
    ws_bounds = world_bounds(descendants(ws))
    sofa_bounds = world_bounds(descendants(roots["sofa"]))
    sofa_wall_gap = sofa_bounds[0].x - (-2.4)
    sofa_ws_gap = horizontal_aabb_gap(*sofa_bounds, *ws_bounds)
    print("HERO_BOUNDS", tuple(round(v, 6) for v in overall[0]), tuple(round(v, 6) for v in overall[1]))
    print("SOFA_WALL_GAP", f"{sofa_wall_gap:.6f}")
    print("SOFA_WORKSTATION_GAP", f"{sofa_ws_gap:.6f}")
    if (arch_bounds[0] - Vector((-2.5, -2.0, -0.08))).length > 0.001 or (arch_bounds[1] - Vector((2.5, 2.0, 3.0))).length > 0.001:
        failures.append("architecture bounds changed")
    if not 0.06 <= sofa_wall_gap <= 0.12:
        failures.append(f"sofa wall gap {sofa_wall_gap:.6f} outside 0.06..0.12")
    if sofa_ws_gap < 0.30:
        failures.append(f"sofa/workstation gap {sofa_ws_gap:.6f} < 0.30")
    if abs(sofa_bounds[0].z) > 0.01:
        failures.append(f"sofa not grounded: minZ={sofa_bounds[0].z:.6f}")
    if failures:
        raise RuntimeError("Polished Hero Corner pre-save validation failed:\n- " + "\n- ".join(failures))
    hero["presave_meshes"] = total_meshes
    hero["presave_triangles"] = total_triangles
    hero["presave_bounds_min"] = list(overall[0])
    hero["presave_bounds_max"] = list(overall[1])
    hero["sofa_wall_gap"] = sofa_wall_gap
    hero["sofa_workstation_gap"] = sofa_ws_gap
    return overall


def export_glb(hero, path):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in [hero] + descendants(hero):
        obj.select_set(True)
    bpy.context.view_layer.objects.active = hero
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=False,
        export_materials="EXPORT",
        export_extras=True,
        export_animations=False,
        export_skins=False,
        export_cameras=False,
        export_lights=False,
    )
    if not os.path.isfile(path) or os.path.getsize(path) < 10_000:
        raise RuntimeError("Polished Hero Corner GLB was not produced correctly")
    print("POLISHED_HERO_GLB", path, os.path.getsize(path))


def preview_material(name, color):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.86
    return material


def render_preview(path, hero, roots, overall):
    arch_clay = preview_material("Preview_Architecture_Clay", (0.54, 0.55, 0.56))
    workstation_clay = preview_material("Preview_Workstation_Clay", (0.68, 0.67, 0.64))
    sofa_clay = preview_material("Preview_Sofa_Clay", (0.62, 0.59, 0.55))
    for key, material in (("architecture", arch_clay), ("workstation", workstation_clay), ("sofa", sofa_clay)):
        for obj in descendants(roots[key]):
            if obj.type == "MESH":
                obj.data.materials.clear()
                obj.data.materials.append(material)
    bpy.ops.object.light_add(type="AREA", location=(-1.5, -4.5, 6.0))
    key = bpy.context.object
    key.data.energy = 1300.0
    key.data.shape = "DISK"
    key.data.size = 5.0
    bpy.ops.object.light_add(type="AREA", location=(4.5, 1.0, 4.0))
    fill = bpy.context.object
    fill.data.energy = 600.0
    fill.data.size = 4.0
    target = Vector((0.0, 0.15, 1.15))
    bpy.ops.object.camera_add(location=(6.5, -8.0, 5.2))
    camera = bpy.context.object
    camera.name = "PREVIEW_CAMERA"
    camera.data.type = "ORTHO"
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera
    bpy.context.view_layer.update()
    corners = [Vector((x, y, z)) for x in (overall[0].x, overall[1].x) for y in (overall[0].y, overall[1].y) for z in (overall[0].z, overall[1].z)]
    basis = camera.matrix_world.to_3x3()
    right = basis.col[0].normalized()
    up = basis.col[1].normalized()
    width = max((p - target).dot(right) for p in corners) - min((p - target).dot(right) for p in corners)
    height = max((p - target).dot(up) for p in corners) - min((p - target).dot(up) for p in corners)
    camera.data.ortho_scale = max(height, width / (1920 / 1080)) * 1.20
    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = path
    scene.view_settings.look = "AgX - Medium High Contrast"
    world = bpy.data.worlds.new("Preview_World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.055, 0.06, 0.07, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.30
    scene.world = world
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.render.render(write_still=True)
    if not os.path.isfile(path) or os.path.getsize(path) < 10_000:
        raise RuntimeError("Polished Hero Corner preview was not produced correctly")
    print("POLISHED_HERO_PREVIEW", path, "resolution=(1920, 1080)")


def main():
    args = parse_args()
    paths = {key: os.path.abspath(getattr(args, key)) for key in ASSETS}
    reference_path = os.path.abspath(args.reference)
    output_path = os.path.abspath(args.output)
    glb_path = os.path.abspath(args.glb)
    preview_path = os.path.abspath(args.preview)
    protected = {os.path.normcase(path) for path in list(paths.values()) + [reference_path]}
    if os.path.normcase(output_path) in protected or os.path.normcase(glb_path).endswith(os.path.normcase("vq1c-hero-corner.glb")):
        raise RuntimeError("Refusing to overwrite a protected input/canonical output")
    for key, (root_name, meshes, triangles) in ASSETS.items():
        inspect_input(paths[key], root_name, meshes, triangles)
    reference_matrices = read_reference_matrices(reference_path)
    clear_scene_and_orphans()
    hero = bpy.data.objects.new("VQ1C_POLISHED_HERO_ROOT", None)
    bpy.context.collection.objects.link(hero)
    hero.matrix_world = Matrix.Identity(4)
    roots = {}
    for key in ("architecture", "workstation", "sofa"):
        roots[key] = append_asset(paths[key], ASSETS[key][0])
        set_local_matrix(roots[key], hero, reference_matrices[key])
    overall = validate_assembly(hero, roots, reference_matrices)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=output_path)
    print("POLISHED_HERO_BLEND", output_path)
    export_glb(hero, glb_path)
    render_preview(preview_path, hero, roots, overall)
    print("VQ1C_POLISHED_HERO_CORNER_BUILD_OK")


if __name__ == "__main__":
    main()
