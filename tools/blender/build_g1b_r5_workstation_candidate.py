"""Build an isolated R5 workstation candidate without touching frozen outputs."""
import json
import math
import os
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "assets-source/blender/vq1c/full-office/vq1c-officeworld-full-pbr.blend"
FINAL = ROOT / "public/models/vq1/final-office/office-r5-final.glb"
OUT = ROOT / "outputs/unity-geometry-g1b"
GLB = OUT / "office-r5-g1b-workstation-source.glb"
ATLAS = OUT / "office-r5-g1b-lightmap-atlas1.png"
SHOT = OUT / "01-office-day-candidate.png"
MANIFEST = OUT / "office-r5-g1b-candidate-manifest.json"

CATEGORIES = {
    "Runtime_Desks": {"POLISHED_DESK_ROOT"},
    "Runtime_Chairs": {"POLISHED_CHAIR_ROOT"},
    "Runtime_Devices": {"POLISHED_MONITOR_ROOT", "POLISHED_KEYBOARD_ROOT"},
    "Runtime_Lamps": {"POLISHED_LAMP_ROOT"},
}
EXPECTED = {"Runtime_Desks": 4944, "Runtime_Chairs": 24000,
            "Runtime_Devices": 16848, "Runtime_Lamps": 4384}


def base(name):
    return name.rsplit(".", 1)[0] if name.rsplit(".", 1)[-1].isdigit() else name


def owner_category(obj):
    cur = obj.parent
    while cur:
        n = base(cur.name)
        for category, roots in CATEGORIES.items():
            if any(n == root or n.endswith("_" + root) for root in roots):
                return category
        cur = cur.parent
    return None


def prep_normals(mesh):
    bm = bmesh.new()
    bm.from_mesh(mesh)
    for face in bm.faces:
        face.smooth = True
    for edge in bm.edges:
        edge.smooth = not (len(edge.link_faces) == 2 and edge.calc_face_angle(0.0) > math.radians(60.0))
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()


def tri_count(obj):
    obj.data.calc_loop_triangles()
    return len(obj.data.loop_triangles)


def load_source_parts():
    with bpy.data.libraries.load(str(SOURCE), link=False) as (available, loaded):
        loaded.objects = available.objects
    groups = {name: [] for name in CATEGORIES}
    for obj in loaded.objects:
        if obj is None or obj.type != "MESH":
            continue
        category = owner_category(obj)
        if category:
            groups[category].append(obj)
    temp = bpy.data.collections.new("G1B_SOURCE_TEMP")
    bpy.context.scene.collection.children.link(temp)
    required = set()
    for objects in groups.values():
        for obj in objects:
            current = obj
            while current is not None:
                required.add(current)
                current = current.parent
    for obj in required:
        if not obj.users_collection:
            temp.objects.link(obj)
    bpy.context.view_layer.update()
    return groups, temp


def merge_into_runtime(category, source_objects):
    target = bpy.data.objects.get(category)
    if target is None:
        raise RuntimeError(f"Missing frozen runtime node {category}")
    parent = target.parent
    collection = target.users_collection[0]
    old_data = target.data
    bpy.data.objects.remove(target, do_unlink=True)
    copies = []
    for source in source_objects:
        obj = source.copy()
        obj.data = source.data.copy()
        world = source.matrix_world.copy()
        obj.parent = None
        obj.matrix_world = world
        prep_normals(obj.data)
        collection.objects.link(obj)
        copies.append(obj)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in copies:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = copies[0]
    bpy.ops.object.join()
    merged = bpy.context.object
    merged.name = category
    merged.data.name = category + "_Mesh"
    world = merged.matrix_world.copy()
    parent_world = parent.matrix_world.copy() if parent else None
    merged.data.transform(parent_world.inverted() @ world if parent else world)
    merged.parent = parent
    merged.matrix_parent_inverse.identity()
    merged.matrix_basis.identity()
    if old_data.users == 0:
        bpy.data.meshes.remove(old_data)
    return merged


def create_uv1(objects):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        uv = obj.data.uv_layers.get("UVMap.001") or obj.data.uv_layers.new(name="UVMap.001")
        obj.data.uv_layers.active = uv
        uv.active_render = True
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.lightmap_pack(PREF_CONTEXT="ALL_FACES", PREF_PACK_IN_ONE=True,
                             PREF_NEW_UVLAYER=False,
                             PREF_BOX_DIV=48, PREF_MARGIN_DIV=0.1)
    bpy.ops.uv.select_all(action="DESELECT")
    bpy.ops.uv.select_overlap()
    overlap = 0
    bpy.ops.object.mode_set(mode="OBJECT")
    for obj in objects:
        selected = obj.data.attributes.get(".uv_select_vert")
        overlap += sum(1 for item in selected.data if item.value) if selected else 0
    for obj in objects:
        obj.data.uv_layers.active = obj.data.uv_layers.get("UVMap") or obj.data.uv_layers[0]
    return overlap


def add_candidate_lights():
    bpy.ops.object.light_add(type="SUN", location=(0, 0, 10))
    sun = bpy.context.object
    sun.rotation_euler = (math.radians(28), math.radians(-20), math.radians(-32))
    sun.data.energy, sun.data.color, sun.data.angle = 1.6, (1.0, 0.88, 0.74), math.radians(16)
    bpy.ops.object.light_add(type="AREA", location=(-3.5, -5.5, 9.0))
    key = bpy.context.object
    key.data.energy, key.data.shape, key.data.size, key.data.color = 1800, "DISK", 8.0, (1.0, 0.92, 0.82)
    bpy.ops.object.light_add(type="AREA", location=(7.0, 4.0, 6.0))
    fill = bpy.context.object
    fill.data.energy, fill.data.size, fill.data.color = 850, 7.0, (0.80, 0.88, 1.0)
    world = bpy.data.worlds.new("G1B_CANDIDATE_WORLD")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.24, 0.31, 0.40, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.42
    bpy.context.scene.world = world
    return [sun, key, fill]


def bake_atlas1(objects):
    image = bpy.data.images.new("G1B_Atlas1", width=4096, height=4096, alpha=False, float_buffer=False)
    touched = []
    for obj in objects:
        for material in obj.data.materials:
            if material is None:
                continue
            material.use_nodes = True
            node = material.node_tree.nodes.new("ShaderNodeTexImage")
            node.name = "G1B_BAKE_TARGET"
            node.image = image
            material.node_tree.nodes.active = node
            touched.append((material, node))
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 64
    scene.cycles.device = "GPU"
    cycles = bpy.context.preferences.addons["cycles"].preferences
    cycles.compute_device_type = "OPTIX"
    cycles.get_devices()
    for device in cycles.devices:
        device.use = device.type == "OPTIX"
    scene.render.bake.use_pass_direct = True
    scene.render.bake.use_pass_indirect = False
    scene.render.bake.use_pass_color = False
    scene.render.bake.margin = 8
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.bake(type="DIFFUSE", use_clear=True, margin=8)
    image.filepath_raw = str(ATLAS)
    image.file_format = "PNG"
    image.save()
    for material, node in touched:
        material.node_tree.nodes.remove(node)


def normal_validation(objects):
    invalid = reversed_count = 0
    for obj in objects:
        mesh = obj.data
        mesh.calc_loop_triangles()
        for tri in mesh.loop_triangles:
            for li in tri.loops:
                n = mesh.corner_normals[li].vector
                if not all(math.isfinite(x) for x in n) or n.length < 0.99:
                    invalid += 1
                elif n.dot(tri.normal) < -0.01:
                    reversed_count += 1
    return invalid, reversed_count


def export_candidate(lights):
    for light in lights:
        light.hide_render = True
    bpy.ops.object.select_all(action="SELECT")
    for light in lights:
        light.select_set(False)
    bpy.ops.export_scene.gltf(filepath=str(GLB), export_format="GLB", use_selection=True,
                              export_materials="EXPORT", export_extras=True,
                              export_animations=False, export_skins=False,
                              export_cameras=False, export_lights=False,
                              export_draco_mesh_compression_enable=False)


def screenshot(lights):
    target = Vector((0, 0, 0.85))
    location = Vector((10.8, -14.5, 11.8))
    bpy.ops.object.camera_add(location=location)
    camera = bpy.context.object
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 16.5
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    scene = bpy.context.scene
    scene.camera = camera
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 1920, 1080, 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(SHOT)
    scene.view_settings.look = "AgX - Medium High Contrast"
    for light in lights:
        light.hide_render = False
    bpy.ops.render.render(write_still=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(FINAL), merge_vertices=False)
    groups, temp = load_source_parts()
    runtime = [merge_into_runtime(name, groups[name]) for name in CATEGORIES]
    for obj in list(temp.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(temp)
    bpy.context.view_layer.update()
    counts = {obj.name: tri_count(obj) for obj in runtime}
    if counts != EXPECTED or sum(counts.values()) != 50176:
        raise RuntimeError(f"Candidate triangle contract failed: {counts}")
    minimum_dims = {
        "Runtime_Desks": (7.0, 4.8), "Runtime_Chairs": (4.5, 3.8),
        "Runtime_Devices": (6.5, 4.0), "Runtime_Lamps": (6.8, 4.5),
    }
    for obj in runtime:
        long_min, short_min = minimum_dims[obj.name]
        horizontal = sorted((obj.dimensions.x, obj.dimensions.y), reverse=True)
        if horizontal[0] < long_min or horizontal[1] < short_min:
            raise RuntimeError(f"Candidate placement contract failed: {obj.name} {tuple(obj.dimensions)}")
    overlap = create_uv1(runtime)
    if overlap:
        raise RuntimeError(f"UV1 overlap selection count: {overlap}")
    invalid, reversed_count = normal_validation(runtime)
    if invalid or reversed_count:
        raise RuntimeError(f"Normal validation failed: invalid={invalid}, reversed={reversed_count}")
    lights = add_candidate_lights()
    bake_atlas1(runtime)
    export_candidate(lights)
    screenshot(lights)
    data = {
        "candidateSource": str(GLB.relative_to(ROOT)), "atlas1": str(ATLAS.relative_to(ROOT)),
        "screenshot": str(SHOT.relative_to(ROOT)), "triangles": counts,
        "workstationTriangles": sum(counts.values()), "uv1OverlapSelections": overlap,
        "invalidNormals": invalid, "reversedNormals": reversed_count,
        "bake": {"engine": "Cycles OptiX", "samples": 64, "type": "DIFFUSE direct-only", "resolution": [4096,4096], "margin": 8,
                 "lights": "versioned full-office clear-day preview setup"}
    }
    MANIFEST.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print("G1B_RESULT", json.dumps(data))


if __name__ == "__main__":
    main()
