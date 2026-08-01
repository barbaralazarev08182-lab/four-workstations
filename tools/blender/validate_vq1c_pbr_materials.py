"""Validate the PBR Hero Corner Blend or a factory-empty GLB re-import."""

import argparse
import os
import sys

import bpy
from mathutils import Matrix, Vector


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SOURCE_BLEND = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "polished", "vq1c-hero-corner-polished.blend")
PBR_BLEND = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "pbr", "vq1c-hero-corner-pbr.blend")
PBR_GLB = os.path.join(REPO_ROOT, "public", "models", "vq1", "vq1c-hero-corner-pbr.glb")
TEXTURE_DIR = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "textures", "pbr")
EXPECTED_MESHES = 96
EXPECTED_TRIANGLES = 18376
EXPECTED_MIN = Vector((-2.5, -2.0, -0.08))
EXPECTED_MAX = Vector((2.5, 2.0, 3.0))
REQUIRED_MATERIALS = {
    "VQ_Wall_Plaster", "VQ_Floor_Wood", "VQ_Desk_Wood", "VQ_Trim_Warm",
    "VQ_Window_Frame", "VQ_Window_Glass", "VQ_Sofa_Fabric", "VQ_Sofa_Fabric_Accent",
    "VQ_Chair_Fabric", "VQ_Metal_Charcoal", "VQ_Plastic_Dark", "VQ_Keycap",
    "VQ_Screen_Glass", "VQ_Lamp_Shade", "VQ_Lamp_Inner", "VQ_Sofa_Legs",
}
TEXTURES = {
    "plaster_normal.png": (512, 512, "Non-Color"), "plaster_roughness.png": (512, 512, "Non-Color"),
    "fabric_normal.png": (512, 512, "Non-Color"), "fabric_roughness.png": (512, 512, "Non-Color"),
    "floor_wood_basecolor.png": (1024, 1024, "sRGB"), "floor_wood_roughness.png": (1024, 1024, "Non-Color"),
    "floor_wood_normal.png": (1024, 1024, "Non-Color"), "desk_wood_basecolor.png": (1024, 1024, "sRGB"),
    "desk_wood_roughness.png": (1024, 1024, "Non-Color"), "desk_wood_normal.png": (1024, 1024, "Non-Color"),
}
ROOT_CHILDREN = {"HERO_ARCH_ROOT", "POLISHED_WORKSTATION_ROOT", "POLISHED_SOFA_ROOT"}
WORKSTATION_ROOTS = {"POLISHED_DESK_ROOT", "POLISHED_CHAIR_ROOT", "POLISHED_MONITOR_ROOT", "POLISHED_KEYBOARD_ROOT", "POLISHED_LAMP_ROOT"}
ANCHOR_OWNERS = {
    "DESK_TOP_ANCHOR": "POLISHED_DESK_ROOT", "MONITOR_SOCKET": "POLISHED_DESK_ROOT",
    "KEYBOARD_SOCKET": "POLISHED_DESK_ROOT", "LAMP_SOCKET": "POLISHED_DESK_ROOT",
    "CHAIR_SEAT_ANCHOR": "POLISHED_CHAIR_ROOT", "MONITOR_BASE_ANCHOR": "POLISHED_MONITOR_ROOT",
    "KEYBOARD_BASE_ANCHOR": "POLISHED_KEYBOARD_ROOT", "LAMP_BASE_ANCHOR": "POLISHED_LAMP_ROOT",
    "LIGHT_DESK_ANCHOR": "POLISHED_LAMP_ROOT",
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("blend", "glb"), required=True)
    parser.add_argument("--source", default=SOURCE_BLEND)
    parser.add_argument("--blend", default=PBR_BLEND)
    parser.add_argument("--glb", default=PBR_GLB)
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


def world_bounds(objects, depsgraph):
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
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
        finally:
            evaluated.to_mesh_clear()
    return minimum, maximum


def geometry_signature():
    result = {}
    for obj in bpy.context.scene.objects:
        entry = (obj.type, obj.parent.name if obj.parent else None, tuple(round(obj.matrix_local[r][c], 8) for r in range(4) for c in range(4)))
        if obj.type == "MESH":
            entry += (tuple(round(value, 8) for vertex in obj.data.vertices for value in vertex.co), len(obj.data.polygons))
        result[obj.name] = entry
    return result


def scene_stats(depsgraph):
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


def material_for_object(name):
    if name == "FLOOR": return "VQ_Floor_Wood"
    if name in {"SIDE_WALL", "BACK_WALL_LEFT", "BACK_WALL_RIGHT", "BACK_WALL_BOTTOM", "BACK_WALL_TOP"}: return "VQ_Wall_Plaster"
    if name in {"WINDOW_SILL", "BASEBOARD_BACK", "BASEBOARD_SIDE"}: return "VQ_Trim_Warm"
    if name.startswith("FRAME_"): return "VQ_Window_Frame"
    if name == "GLASS_PLACEHOLDER": return "VQ_Window_Glass"
    if name == "DESK_TOP": return "VQ_Desk_Wood"
    if name in {"DESK_MODESTY_PANEL", "DESK_FRAME_LEFT", "DESK_FRAME_RIGHT", "DESK_CROSSBAR", "DESK_FEET_L", "DESK_FEET_R"}: return "VQ_Metal_Charcoal"
    if name == "DESK_CABLE_GROMMET": return "VQ_Plastic_Dark"
    if name in {"CHAIR_SEAT_CUSHION", "CHAIR_BACK_CUSHION"}: return "VQ_Chair_Fabric"
    if name in {"CHAIR_SUPPORT_FRAME", "CHAIR_COLUMN", "CHAIR_STAR_BASE_HUB"} or name.startswith("CHAIR_STAR_BASE_ARM_"): return "VQ_Metal_Charcoal"
    if name.startswith("CHAIR_ARM_") or name.startswith("CHAIR_CASTER_"): return "VQ_Plastic_Dark"
    if name in {"MONITOR_NECK", "MONITOR_BASE"}: return "VQ_Metal_Charcoal"
    if name in {"MONITOR_BEZEL", "MONITOR_BACK_SHELL", "MONITOR_BUTTON"}: return "VQ_Plastic_Dark"
    if name == "MONITOR_SCREEN_PANEL": return "VQ_Screen_Glass"
    if name in {"KEYBOARD_BASE", "KEYBOARD_TOP_PLATE"}: return "VQ_Plastic_Dark"
    if name.startswith("KEYBOARD_KEYS_") or name == "KEYBOARD_SPACEBAR": return "VQ_Keycap"
    if name in {"LAMP_BASE", "LAMP_LOWER_ARM", "LAMP_JOINT", "LAMP_UPPER_ARM"}: return "VQ_Metal_Charcoal"
    if name == "LAMP_SWITCH": return "VQ_Plastic_Dark"
    if name == "LAMP_SHADE": return "VQ_Lamp_Shade"
    if name == "LAMP_INNER_SHADE": return "VQ_Lamp_Inner"
    if name in {"SOFA_BASE", "SOFA_BACK_FRAME", "SOFA_ARM_LEFT", "SOFA_ARM_RIGHT", "SOFA_SEAT_CUSHION_LEFT", "SOFA_SEAT_CUSHION_RIGHT"}: return "VQ_Sofa_Fabric"
    if name in {"SOFA_BACK_CUSHION_LEFT", "SOFA_BACK_CUSHION_RIGHT"}: return "VQ_Sofa_Fabric_Accent"
    if name == "SOFA_LEGS": return "VQ_Sofa_Legs"
    return None


def principled(material):
    return material.node_tree.nodes.get("Principled BSDF") if material and material.use_nodes else None


def validate_materials(mode, failures):
    used = {mat.name for obj in bpy.context.scene.objects if obj.type == "MESH" for mat in obj.data.materials if mat}
    checked_images = set()
    missing = REQUIRED_MATERIALS - used
    if missing:
        failures.append(f"required materials missing: {sorted(missing)}")
    for name in used:
        if any(word in name for word in ("Clay", "Preview", "Temp")):
            failures.append(f"temporary material used: {name}")
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        if len(obj.data.materials) != 1 or obj.data.materials[0] is None:
            failures.append(f"invalid material slots: {obj.name}")
            continue
        expected = material_for_object(obj.name)
        if obj.data.materials[0].name != expected:
            failures.append(f"material mapping {obj.name}: {obj.data.materials[0].name} != {expected}")
        material = obj.data.materials[0]
        image_nodes = [node for node in material.node_tree.nodes if node.type == "TEX_IMAGE" and node.image] if material.use_nodes else []
        if image_nodes and obj.data.uv_layers.active is None:
            failures.append(f"textured object has no active UV: {obj.name}")
        for node in image_nodes:
            if node.image.name in checked_images:
                continue
            checked_images.add(node.image.name)
            if mode == "blend":
                if not os.path.isfile(bpy.path.abspath(node.image.filepath)):
                    failures.append(f"missing image file: {material.name}/{node.image.filepath}")
                continue
            packed_ok = node.image.packed_file is not None and node.image.packed_file.size > 0
            if not node.image.has_data and not packed_ok:
                try:
                    node.image.reload()
                except RuntimeError:
                    pass
            if (not node.image.has_data and not packed_ok) or node.image.size[0] == 0 or node.image.size[1] == 0:
                failures.append(f"missing image data: {material.name}/{node.image.name}")
    window = bpy.data.materials.get("VQ_Window_Glass")
    screen = bpy.data.materials.get("VQ_Screen_Glass")
    inner = bpy.data.materials.get("VQ_Lamp_Inner")
    if window is None or screen is None or window == screen:
        failures.append("window/screen glass materials missing or merged")
    else:
        wbsdf = principled(window)
        sbsdf = principled(screen)
        if wbsdf is None or (wbsdf.inputs.get("Transmission Weight") and wbsdf.inputs["Transmission Weight"].default_value < 0.5):
            failures.append("window glass lacks transmission semantics")
        if sbsdf is None:
            failures.append("screen Principled BSDF missing")
        else:
            if sbsdf.inputs.get("Transmission Weight") and sbsdf.inputs["Transmission Weight"].default_value > 0.1:
                failures.append("screen incorrectly uses window transmission")
            if sbsdf.inputs.get("Emission Strength") and sbsdf.inputs["Emission Strength"].default_value > 0.001:
                failures.append("screen is emissive")
    ibsdf = principled(inner)
    if ibsdf is None or (ibsdf.inputs.get("Emission Strength") and ibsdf.inputs["Emission Strength"].default_value > 0.001):
        failures.append("lamp inner is emissive")
    if mode == "blend":
        for filename, (width, height, colorspace) in TEXTURES.items():
            path = os.path.join(TEXTURE_DIR, filename)
            if not os.path.isfile(path):
                failures.append(f"texture file missing: {path}")
                continue
            image = next((image for image in bpy.data.images if os.path.basename(bpy.path.abspath(image.filepath)) == filename), None)
            if image is None:
                failures.append(f"texture image datablock missing: {filename}")
                continue
            if tuple(image.size) != (width, height):
                failures.append(f"texture dimensions {filename}: {tuple(image.size)} != {(width, height)}")
            if image.colorspace_settings.name != colorspace:
                failures.append(f"texture colorspace {filename}: {image.colorspace_settings.name} != {colorspace}")
            absolute = os.path.abspath(bpy.path.abspath(image.filepath))
            if not absolute.lower().startswith(REPO_ROOT.lower() + os.sep.lower()):
                failures.append(f"texture outside project: {absolute}")


def main():
    args = parse_args()
    source_signature = None
    if args.mode == "blend":
        bpy.ops.wm.open_mainfile(filepath=os.path.abspath(args.source))
        source_signature = geometry_signature()
        bpy.ops.wm.open_mainfile(filepath=os.path.abspath(args.blend))
    else:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=os.path.abspath(args.glb))
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    failures = []
    root = bpy.data.objects.get("VQ1C_POLISHED_HERO_ROOT")
    if root is None:
        failures.append("VQ1C_POLISHED_HERO_ROOT missing")
    elif root.parent is not None or max(abs(root.matrix_world[r][c] - Matrix.Identity(4)[r][c]) for r in range(4) for c in range(4)) > 1e-5:
        failures.append("PBR hero root is not top-level identity")
    else:
        direct = {child.name for child in root.children}
        if direct != ROOT_CHILDREN:
            failures.append(f"hero direct children {sorted(direct)} != {sorted(ROOT_CHILDREN)}")
    workstation = bpy.data.objects.get("POLISHED_WORKSTATION_ROOT")
    for name in WORKSTATION_ROOTS:
        obj = bpy.data.objects.get(name)
        if obj is None or workstation is None or not is_descendant(obj, workstation):
            failures.append(f"workstation root missing/mis-parented: {name}")
    for name, owner_name in ANCHOR_OWNERS.items():
        obj = bpy.data.objects.get(name)
        owner = bpy.data.objects.get(owner_name)
        if obj is None or owner is None or not is_descendant(obj, owner):
            failures.append(f"anchor missing/mis-parented: {name}")
    stats = scene_stats(depsgraph)
    bounds = world_bounds(bpy.context.scene.objects, depsgraph)
    print("PBR_STATS", stats[0], stats[1])
    print("PBR_BOUNDS", tuple(round(v, 6) for v in bounds[0]), tuple(round(v, 6) for v in bounds[1]))
    if stats[0] != EXPECTED_MESHES or stats[1] != EXPECTED_TRIANGLES or stats[2]:
        failures.append(f"geometry stats invalid: {stats}")
    if (bounds[0] - EXPECTED_MIN).length > 0.002 or (bounds[1] - EXPECTED_MAX).length > 0.002:
        failures.append("world bounds changed")
    if args.mode == "blend" and geometry_signature() != source_signature:
        failures.append("hierarchy, transforms, vertices or polygon counts differ from polished source")
    for obj in bpy.context.scene.objects:
        if obj.type in {"CAMERA", "LIGHT"}:
            failures.append(f"camera/light present: {obj.name}")
        scale = obj.matrix_world.to_scale()
        if max(scale) - min(scale) > 1e-5:
            failures.append(f"non-uniform scale: {obj.name}")
    for anchor, socket in (("MONITOR_BASE_ANCHOR", "MONITOR_SOCKET"), ("KEYBOARD_BASE_ANCHOR", "KEYBOARD_SOCKET"), ("LAMP_BASE_ANCHOR", "LAMP_SOCKET")):
        if bpy.data.objects.get(anchor) and bpy.data.objects.get(socket):
            error = (bpy.data.objects[anchor].matrix_world.translation - bpy.data.objects[socket].matrix_world.translation).length
            print("PBR_ANCHOR_ALIGNMENT", anchor, f"{error:.9f}")
            if error > 0.0001:
                failures.append(f"anchor error {anchor}: {error:.9f}")
    validate_materials(args.mode, failures)
    marker = "VQ1C_PBR_BLEND_VALIDATE_OK" if args.mode == "blend" else "VQ1C_PBR_GLB_REIMPORT_VALIDATE_OK"
    if failures:
        print(marker.replace("_OK", "_FAIL"))
        for failure in failures:
            print("FAIL", failure)
        sys.exit(1)
    print(marker)


if __name__ == "__main__":
    main()
