"""Assemble the validated VQ-1C polished workstation assets.

The five polished source blends and the standardized workstation reference are
read-only inputs.  Only asset-root transforms are changed; internal geometry,
hierarchy and anchors are preserved.
"""

import argparse
import math
import os

import bpy
from mathutils import Matrix, Vector


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
POLISHED_DIR = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "polished")
STANDARDIZED_DIR = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "standardized")

ASSETS = {
    "desk": ("POLISHED_DESK_ROOT", "desk-polished.blend"),
    "chair": ("POLISHED_CHAIR_ROOT", "chair-polished.blend"),
    "monitor": ("POLISHED_MONITOR_ROOT", "monitor-polished.blend"),
    "keyboard": ("POLISHED_KEYBOARD_ROOT", "keyboard-polished.blend"),
    "lamp": ("POLISHED_LAMP_ROOT", "lamp-polished.blend"),
}
ALIGNMENTS = {
    "monitor": ("MONITOR_BASE_ANCHOR", "MONITOR_SOCKET"),
    "keyboard": ("KEYBOARD_BASE_ANCHOR", "KEYBOARD_SOCKET"),
    "lamp": ("LAMP_BASE_ANCHOR", "LAMP_SOCKET"),
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
    for key, (_, filename) in ASSETS.items():
        parser.add_argument(f"--{key}", default=os.path.join(POLISHED_DIR, filename))
    parser.add_argument(
        "--reference", default=os.path.join(STANDARDIZED_DIR, "workstation-standardized.blend")
    )
    parser.add_argument(
        "--output", default=os.path.join(POLISHED_DIR, "workstation-polished.blend")
    )
    parser.add_argument(
        "--preview",
        default=os.path.join(REPO_ROOT, "outputs", "vq-1c", "visual-polish", "05-workstation-polished-clay.png"),
    )
    argv = []
    if "--" in __import__("sys").argv:
        argv = __import__("sys").argv[__import__("sys").argv.index("--") + 1 :]
    return parser.parse_args(argv)


def descendants(root):
    result = []
    stack = list(root.children)
    while stack:
        obj = stack.pop()
        result.append(obj)
        stack.extend(obj.children)
    return result


def clear_scene_and_orphans():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (
        bpy.data.meshes,
        bpy.data.materials,
        bpy.data.images,
        bpy.data.curves,
        bpy.data.cameras,
        bpy.data.lights,
        bpy.data.actions,
        bpy.data.armatures,
    ):
        for item in list(collection):
            collection.remove(item)


def read_reference_chair_matrix(path):
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing workstation reference: {path}")
    bpy.ops.wm.open_mainfile(filepath=path)
    workstation = bpy.data.objects.get("STD_WORKSTATION_ROOT")
    chair = bpy.data.objects.get("STD_CHAIR_ROOT")
    if workstation is None or chair is None:
        raise RuntimeError("Reference workstation/chair root missing")
    local_matrix = workstation.matrix_world.inverted() @ chair.matrix_world
    print(
        "REFERENCE_CHAIR_LOCAL",
        tuple(round(value, 6) for value in local_matrix.to_translation()),
        tuple(round(math.degrees(value), 6) for value in local_matrix.to_euler()),
        tuple(round(value, 6) for value in local_matrix.to_scale()),
    )
    return local_matrix.copy()


def append_asset(path, root_name):
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing polished input: {path}")
    before = set(bpy.data.objects)
    with bpy.data.libraries.load(path, link=False) as (data_from, data_to):
        data_to.objects = [name for name in data_from.objects if name]
    loaded = [obj for obj in data_to.objects if obj is not None and obj not in before]
    for obj in loaded:
        if obj.name not in bpy.context.scene.objects:
            bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.update()
    roots = [obj for obj in loaded if obj.name == root_name]
    if len(roots) != 1:
        raise RuntimeError(f"Expected one {root_name} in {path}, found {len(roots)}")
    root = roots[0]
    unexpected_top = [obj.name for obj in loaded if obj.parent is None and obj is not root]
    if unexpected_top:
        raise RuntimeError(f"Unexpected top-level objects in {path}: {unexpected_top}")
    return root, loaded


def set_local_matrix(root, parent, matrix):
    root.parent = parent
    root.matrix_parent_inverse = Matrix.Identity(4)
    root.matrix_basis = matrix
    bpy.context.view_layer.update()


def world_mesh_bounds(objects):
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


def evaluated_stats():
    depsgraph = bpy.context.evaluated_depsgraph_get()
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
    return len(meshes), triangles, empty


def evaluated_subtree_stats(root):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    meshes = [obj for obj in descendants(root) if obj.type == "MESH"]
    triangles = 0
    details = []
    for obj in meshes:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            mesh.calc_loop_triangles()
            count = len(mesh.loop_triangles)
            triangles += count
            details.append((obj.name, count))
        finally:
            evaluated.to_mesh_clear()
    return len(meshes), triangles, details


def align_anchor(asset_root, anchor_name, socket_name):
    anchor = bpy.data.objects.get(anchor_name)
    socket = bpy.data.objects.get(socket_name)
    if anchor is None or socket is None:
        raise RuntimeError(f"Missing alignment objects: {anchor_name}/{socket_name}")
    delta = socket.matrix_world.translation - anchor.matrix_world.translation
    asset_root.matrix_world = Matrix.Translation(delta) @ asset_root.matrix_world
    bpy.context.view_layer.update()
    error = (socket.matrix_world.translation - anchor.matrix_world.translation).length
    print(
        f"ALIGN_{asset_root.name}",
        f"delta={tuple(round(value, 6) for value in delta)}",
        f"error={error:.9f}",
    )
    if error > 0.0001:
        raise RuntimeError(f"{anchor_name} alignment error {error:.9f} > 0.0001")
    return error


def validate_presave(workstation, roots, chair_reference_matrix, alignment_errors):
    failures = []
    for key, root in roots.items():
        subtree_meshes, subtree_triangles, details = evaluated_subtree_stats(root)
        print("SUBTREE_STATS", key, subtree_meshes, subtree_triangles, details)
        if (subtree_meshes, subtree_triangles) != EXPECTED_SUBTREE_STATS[key]:
            failures.append(
                f"{key} subtree stats {(subtree_meshes, subtree_triangles)} "
                f"!= {EXPECTED_SUBTREE_STATS[key]}"
            )
    if workstation.parent is not None or workstation.matrix_world != Matrix.Identity(4):
        failures.append("POLISHED_WORKSTATION_ROOT is not top-level identity")
    for key, root in roots.items():
        if root.parent is not workstation:
            failures.append(f"{root.name} is not directly parented to workstation root")
        scale = root.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-6:
            failures.append(f"non-uniform asset-root scale: {root.name}")
    chair_matrix_error = max(
        abs(roots["chair"].matrix_local[row][column] - chair_reference_matrix[row][column])
        for row in range(4)
        for column in range(4)
    )
    if chair_matrix_error > 1e-6:
        failures.append("chair local matrix no longer matches reference")
    if any(error > 0.0001 for error in alignment_errors.values()):
        failures.append("device alignment tolerance exceeded")
    mesh_count, triangles, empty = evaluated_stats()
    if mesh_count != EXPECTED_MESHES:
        failures.append(f"mesh count {mesh_count} != {EXPECTED_MESHES}")
    if triangles != EXPECTED_TRIANGLES:
        failures.append(f"triangles {triangles} != {EXPECTED_TRIANGLES}")
    if empty:
        failures.append(f"empty meshes: {empty}")
    forbidden = [obj.name for obj in bpy.context.scene.objects if obj.type in {"CAMERA", "LIGHT"}]
    forbidden += [obj.name for obj in bpy.context.scene.objects if obj.name.startswith("STD_")]
    if forbidden:
        failures.append(f"forbidden saved objects: {forbidden}")
    for obj in bpy.context.scene.objects:
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-6:
            failures.append(f"non-uniform scale: {obj.name}")
    minimum, maximum = world_mesh_bounds(bpy.context.scene.objects)
    desk_minimum, _ = world_mesh_bounds(descendants(roots["desk"]))
    _, chair_maximum = world_mesh_bounds(descendants(roots["chair"]))
    chair_gap = desk_minimum.y - chair_maximum.y
    if chair_gap < 0.05:
        failures.append(f"chair/desk gap {chair_gap:.6f} < 0.05")
    if failures:
        raise RuntimeError("Polished workstation pre-save validation failed:\n- " + "\n- ".join(failures))
    workstation["presave_meshes"] = mesh_count
    workstation["presave_triangles"] = triangles
    workstation["presave_bounds_min"] = list(minimum)
    workstation["presave_bounds_max"] = list(maximum)
    workstation["chair_reference_matrix"] = [value for row in chair_reference_matrix for value in row]
    workstation["chair_y_correction"] = 0.0
    for key, error in alignment_errors.items():
        workstation[f"{key}_alignment_error"] = error
    print("PRESAVE_BOUNDS", tuple(round(v, 6) for v in minimum), tuple(round(v, 6) for v in maximum))
    print("PRESAVE_DIMS", tuple(round(v, 6) for v in (maximum - minimum)))
    print("CHAIR_DESK_GAP", round(chair_gap, 6))
    print("PRESAVE_STATS", mesh_count, triangles)
    return minimum, maximum


def render_preview(path, minimum, maximum):
    target = (minimum + maximum) * 0.5
    target.z += 0.08
    bpy.ops.mesh.primitive_plane_add(size=8.0, location=(0.0, target.y, min(0.0, minimum.z) - 0.004))
    ground = bpy.context.object
    ground.name = "PREVIEW_GROUND"
    material = bpy.data.materials.new("Preview_Ground_Clay")
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.27, 0.28, 0.29, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.92
    ground.data.materials.append(material)

    bpy.ops.object.light_add(type="AREA", location=(-3.5, -4.5, 5.5))
    key = bpy.context.object
    key.data.energy = 1050.0
    key.data.shape = "DISK"
    key.data.size = 4.5
    bpy.ops.object.light_add(type="AREA", location=(4.0, 1.0, 3.5))
    fill = bpy.context.object
    fill.data.energy = 450.0
    fill.data.size = 4.0

    camera_position = target + Vector((3.8, -5.5, 3.3))
    bpy.ops.object.camera_add(location=camera_position)
    camera = bpy.context.object
    camera.name = "PREVIEW_CAMERA"
    camera.data.type = "ORTHO"
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera
    bpy.context.view_layer.update()
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
    width = max(projected_x) - min(projected_x)
    height = max(projected_y) - min(projected_y)
    camera.data.ortho_scale = max(height, width / (1920 / 1080)) * 1.48

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
    scene.render.filepath = path
    scene.view_settings.look = "AgX - Medium High Contrast"
    world = bpy.data.worlds.new("Preview_World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.055, 0.06, 0.07, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.32
    scene.world = world
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.render.render(write_still=True)
    if not os.path.isfile(path) or os.path.getsize(path) < 10_000:
        raise RuntimeError("Workstation preview was not produced correctly")
    print("PREVIEW", path, "resolution=(1920, 1080)")


def main():
    args = parse_args()
    input_paths = {key: os.path.abspath(getattr(args, key)) for key in ASSETS}
    reference_path = os.path.abspath(args.reference)
    output_path = os.path.abspath(args.output)
    preview_path = os.path.abspath(args.preview)
    protected = [os.path.normcase(path) for path in input_paths.values()] + [os.path.normcase(reference_path)]
    if os.path.normcase(output_path) in protected:
        raise RuntimeError("Refusing to overwrite an input asset")

    chair_reference_matrix = read_reference_chair_matrix(reference_path)
    clear_scene_and_orphans()
    workstation = bpy.data.objects.new("POLISHED_WORKSTATION_ROOT", None)
    bpy.context.collection.objects.link(workstation)
    workstation.matrix_world = Matrix.Identity(4)

    roots = {}
    for key in ("desk", "chair", "monitor", "keyboard", "lamp"):
        root_name = ASSETS[key][0]
        root, _ = append_asset(input_paths[key], root_name)
        roots[key] = root
        set_local_matrix(root, workstation, Matrix.Identity(4))

    set_local_matrix(roots["chair"], workstation, chair_reference_matrix)
    alignment_errors = {}
    for key, (anchor, socket) in ALIGNMENTS.items():
        alignment_errors[key] = align_anchor(roots[key], anchor, socket)

    minimum, maximum = validate_presave(workstation, roots, chair_reference_matrix, alignment_errors)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=output_path)
    print("POLISHED_WORKSTATION", output_path)
    for key, root in roots.items():
        print(
            "ASSET_ROOT",
            key,
            tuple(round(v, 6) for v in root.location),
            tuple(round(math.degrees(v), 6) for v in root.rotation_euler),
            tuple(round(v, 6) for v in root.scale),
        )
    render_preview(preview_path, minimum, maximum)
    print("VQ1C_POLISHED_WORKSTATION_BUILD_OK")


if __name__ == "__main__":
    main()
