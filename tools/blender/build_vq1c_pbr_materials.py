"""Create the first deterministic PBR material pass for VQ-1C Hero Corner."""

import argparse
import math
import os
import sys
from array import array

import bpy
from mathutils import Vector


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
INPUT_BLEND = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "polished", "vq1c-hero-corner-polished.blend")
OUTPUT_BLEND = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "pbr", "vq1c-hero-corner-pbr.blend")
OUTPUT_GLB = os.path.join(REPO_ROOT, "public", "models", "vq1", "vq1c-hero-corner-pbr.glb")
TEXTURE_DIR = os.path.join(REPO_ROOT, "assets-source", "blender", "vq1c", "textures", "pbr")
OUTPUT_PREVIEW = os.path.join(REPO_ROOT, "outputs", "vq-1c", "visual-polish", "07-hero-corner-pbr-clear-day.png")

EXPECTED_MESHES = 96
EXPECTED_TRIANGLES = 18376
EXPECTED_BOUNDS_MIN = Vector((-2.5, -2.0, -0.08))
EXPECTED_BOUNDS_MAX = Vector((2.5, 2.0, 3.0))

TEXTURES = {
    "plaster_normal.png": (512, 512, "normal", "plaster"),
    "plaster_roughness.png": (512, 512, "roughness", "plaster"),
    "fabric_normal.png": (512, 512, "normal", "fabric"),
    "fabric_roughness.png": (512, 512, "roughness", "fabric"),
    "floor_wood_basecolor.png": (1024, 1024, "basecolor", "floor"),
    "floor_wood_roughness.png": (1024, 1024, "roughness", "floor"),
    "floor_wood_normal.png": (1024, 1024, "normal", "floor"),
    "desk_wood_basecolor.png": (1024, 1024, "basecolor", "desk"),
    "desk_wood_roughness.png": (1024, 1024, "roughness", "desk"),
    "desk_wood_normal.png": (1024, 1024, "normal", "desk"),
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=INPUT_BLEND)
    parser.add_argument("--output", default=OUTPUT_BLEND)
    parser.add_argument("--glb", default=OUTPUT_GLB)
    parser.add_argument("--textures", default=TEXTURE_DIR)
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


def world_bounds(objects):
    depsgraph = bpy.context.evaluated_depsgraph_get()
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


def scene_stats():
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


def geometry_signature():
    signature = {}
    for obj in bpy.context.scene.objects:
        entry = {
            "type": obj.type,
            "parent": obj.parent.name if obj.parent else None,
            "matrix": tuple(round(obj.matrix_local[row][column], 9) for row in range(4) for column in range(4)),
        }
        if obj.type == "MESH":
            entry["vertices"] = tuple(round(value, 9) for vertex in obj.data.vertices for value in vertex.co)
            entry["polygons"] = len(obj.data.polygons)
        signature[obj.name] = entry
    return signature


def clamp(value, low=0.0, high=1.0):
    return max(low, min(high, value))


def texture_sample(u, v, channel, profile):
    tau = math.tau
    if profile == "plaster":
        grain = 0.55 * math.sin(tau * (7 * u + 5 * v)) + 0.30 * math.sin(tau * (17 * u - 13 * v)) + 0.15 * math.cos(tau * (29 * u + 23 * v))
        if channel == "roughness":
            value = clamp(0.83 + grain * 0.035)
            return value, value, value, 1.0
        dx = 0.018 * (math.cos(tau * (7 * u + 5 * v)) + 0.35 * math.cos(tau * (17 * u - 13 * v)))
        dy = 0.018 * (math.cos(tau * (7 * u + 5 * v)) - 0.35 * math.cos(tau * (17 * u - 13 * v)))
        return 0.5 + dx, 0.5 + dy, 1.0, 1.0
    if profile == "fabric":
        weave_u = math.sin(tau * 48 * u)
        weave_v = math.sin(tau * 48 * v)
        cross = weave_u * weave_v
        if channel == "roughness":
            value = clamp(0.79 + cross * 0.045 + math.sin(tau * 8 * (u + v)) * 0.012)
            return value, value, value, 1.0
        return 0.5 + weave_u * 0.010, 0.5 + weave_v * 0.010, clamp(0.999 - abs(cross) * 0.003), 1.0
    board_count = 5 if profile == "floor" else 3
    grain_frequency = 15 if profile == "floor" else 11
    wave = math.sin(tau * (grain_frequency * v + 0.22 * math.sin(tau * u)))
    fine = math.sin(tau * (31 * v - 1.5 * u))
    board_phase = (v * board_count) % 1.0
    seam = math.exp(-min(board_phase, 1.0 - board_phase) * 75.0)
    if channel == "basecolor":
        if profile == "floor":
            base = (0.28, 0.15, 0.065)
            variation = wave * 0.035 + fine * 0.012 - seam * 0.10
        else:
            base = (0.20, 0.085, 0.030)
            variation = wave * 0.030 + fine * 0.010 - seam * 0.065
        return tuple(clamp(component + variation) for component in base) + (1.0,)
    if channel == "roughness":
        base = 0.55 if profile == "floor" else 0.49
        value = clamp(base + wave * 0.035 + seam * 0.07)
        return value, value, value, 1.0
    strength = 0.035 if profile == "floor" else 0.030
    dx = strength * math.cos(tau * (grain_frequency * v + 0.22 * math.sin(tau * u))) * math.cos(tau * u)
    dy = strength * math.cos(tau * (grain_frequency * v + 0.22 * math.sin(tau * u))) + seam * 0.025
    return clamp(0.5 + dx), clamp(0.5 + dy), 1.0, 1.0


def create_texture(path, width, height, channel, profile):
    name = os.path.splitext(os.path.basename(path))[0]
    existing = bpy.data.images.get(name)
    if existing:
        bpy.data.images.remove(existing)
    image = bpy.data.images.new(name, width=width, height=height, alpha=True, float_buffer=False)
    image.colorspace_settings.name = "sRGB" if channel == "basecolor" else "Non-Color"
    pixels = array("f")
    append = pixels.extend
    for y in range(height):
        v = y / height
        row = []
        for x in range(width):
            u = x / width
            row.extend(texture_sample(u, v, channel, profile))
        append(row)
    image.pixels.foreach_set(pixels)
    image.update()
    image.filepath_raw = path
    image.file_format = "PNG"
    image.save()
    image.filepath = "//../textures/pbr/" + os.path.basename(path)
    image.source = "FILE"
    print("PBR_TEXTURE", os.path.basename(path), width, height, channel, image.colorspace_settings.name)
    return image


def set_input(bsdf, name, value):
    socket = bsdf.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def make_material(name, base_color, metallic, roughness, images=None, normal_strength=0.0, transmission=0.0, alpha=1.0, ior=1.45, coat=0.0, sheen=0.0):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = (*base_color, alpha)
    nodes = material.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (520, 0)
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (240, 0)
    material.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    set_input(bsdf, "Base Color", (*base_color, 1.0))
    set_input(bsdf, "Metallic", metallic)
    set_input(bsdf, "Roughness", roughness)
    set_input(bsdf, "Transmission Weight", transmission)
    set_input(bsdf, "Alpha", alpha)
    set_input(bsdf, "IOR", ior)
    set_input(bsdf, "Coat Weight", coat)
    set_input(bsdf, "Coat Roughness", 0.12)
    set_input(bsdf, "Sheen Weight", sheen)
    set_input(bsdf, "Emission Color", (0.0, 0.0, 0.0, 1.0))
    set_input(bsdf, "Emission Strength", 0.0)
    images = images or {}
    y = 180
    for role in ("basecolor", "roughness", "normal"):
        image = images.get(role)
        if image is None:
            continue
        texture = nodes.new("ShaderNodeTexImage")
        texture.name = f"{name}_{role}"
        texture.label = role
        texture.image = image
        texture.location = (-520, y)
        texture.interpolation = "Linear"
        texture.extension = "REPEAT"
        y -= 220
        if role == "basecolor":
            material.node_tree.links.new(texture.outputs["Color"], bsdf.inputs["Base Color"])
        elif role == "roughness":
            material.node_tree.links.new(texture.outputs["Color"], bsdf.inputs["Roughness"])
        else:
            normal = nodes.new("ShaderNodeNormalMap")
            normal.location = (-120, -260)
            normal.inputs["Strength"].default_value = normal_strength
            material.node_tree.links.new(texture.outputs["Color"], normal.inputs["Color"])
            material.node_tree.links.new(normal.outputs["Normal"], bsdf.inputs["Normal"])
    if transmission > 0.0 or alpha < 1.0:
        material.surface_render_method = "DITHERED"
        material.use_transparency_overlap = False
    return material


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
    raise RuntimeError(f"No semantic PBR material mapping for {name}")


def build_materials(images):
    plaster = {"roughness": images["plaster_roughness.png"], "normal": images["plaster_normal.png"]}
    fabric = {"roughness": images["fabric_roughness.png"], "normal": images["fabric_normal.png"]}
    floor = {"basecolor": images["floor_wood_basecolor.png"], "roughness": images["floor_wood_roughness.png"], "normal": images["floor_wood_normal.png"]}
    desk = {"basecolor": images["desk_wood_basecolor.png"], "roughness": images["desk_wood_roughness.png"], "normal": images["desk_wood_normal.png"]}
    return {
        "VQ_Wall_Plaster": make_material("VQ_Wall_Plaster", (0.70, 0.68, 0.63), 0.0, 0.83, plaster, 0.18),
        "VQ_Floor_Wood": make_material("VQ_Floor_Wood", (0.28, 0.15, 0.065), 0.0, 0.55, floor, 0.28),
        "VQ_Desk_Wood": make_material("VQ_Desk_Wood", (0.20, 0.085, 0.030), 0.0, 0.49, desk, 0.25),
        "VQ_Trim_Warm": make_material("VQ_Trim_Warm", (0.42, 0.38, 0.31), 0.0, 0.68),
        "VQ_Window_Frame": make_material("VQ_Window_Frame", (0.105, 0.115, 0.115), 0.52, 0.39),
        "VQ_Window_Glass": make_material("VQ_Window_Glass", (0.78, 0.84, 0.85), 0.0, 0.09, transmission=0.92, alpha=0.22, ior=1.45),
        "VQ_Sofa_Fabric": make_material("VQ_Sofa_Fabric", (0.34, 0.38, 0.31), 0.0, 0.79, fabric, 0.16, sheen=0.20),
        "VQ_Sofa_Fabric_Accent": make_material("VQ_Sofa_Fabric_Accent", (0.37, 0.40, 0.33), 0.0, 0.80, fabric, 0.16, sheen=0.20),
        "VQ_Chair_Fabric": make_material("VQ_Chair_Fabric", (0.20, 0.23, 0.24), 0.0, 0.75, fabric, 0.15, sheen=0.14),
        "VQ_Metal_Charcoal": make_material("VQ_Metal_Charcoal", (0.075, 0.080, 0.082), 0.76, 0.35),
        "VQ_Plastic_Dark": make_material("VQ_Plastic_Dark", (0.095, 0.090, 0.082), 0.0, 0.47),
        "VQ_Keycap": make_material("VQ_Keycap", (0.32, 0.31, 0.285), 0.0, 0.50),
        "VQ_Screen_Glass": make_material("VQ_Screen_Glass", (0.012, 0.018, 0.022), 0.0, 0.12, coat=0.28),
        "VQ_Lamp_Shade": make_material("VQ_Lamp_Shade", (0.66, 0.58, 0.45), 0.0, 0.54),
        "VQ_Lamp_Inner": make_material("VQ_Lamp_Inner", (0.82, 0.76, 0.64), 0.0, 0.59),
        "VQ_Sofa_Legs": make_material("VQ_Sofa_Legs", (0.12, 0.075, 0.045), 0.08, 0.55),
    }


def assign_materials(materials):
    textured = set()
    for obj in sorted((obj for obj in bpy.context.scene.objects if obj.type == "MESH"), key=lambda item: item.name):
        material_name = material_for_object(obj.name)
        material = materials[material_name]
        obj.data.materials.clear()
        obj.data.materials.append(material)
        if any(node.type == "TEX_IMAGE" for node in material.node_tree.nodes):
            textured.add(obj.name)
            if obj.data.uv_layers.active is None:
                raise RuntimeError(f"Textured object {obj.name} has no active UV layer")
        print("PBR_ASSIGN", obj.name, material_name)
    return textured


def remove_unused_materials(used):
    for material in list(bpy.data.materials):
        if material.name not in used:
            bpy.data.materials.remove(material)


def validate_in_memory(before_signature, before_stats, before_bounds, materials, textured):
    failures = []
    after_signature = geometry_signature()
    after_stats = scene_stats()
    after_bounds = world_bounds(bpy.context.scene.objects)
    if after_signature != before_signature:
        failures.append("object hierarchy, transforms or vertex coordinates changed")
    if after_stats != before_stats or after_stats[:2] != (EXPECTED_MESHES, EXPECTED_TRIANGLES):
        failures.append(f"geometry stats changed: {before_stats} -> {after_stats}")
    if (after_bounds[0] - before_bounds[0]).length > 1e-7 or (after_bounds[1] - before_bounds[1]).length > 1e-7:
        failures.append("world bounds changed")
    if (after_bounds[0] - EXPECTED_BOUNDS_MIN).length > 0.001 or (after_bounds[1] - EXPECTED_BOUNDS_MAX).length > 0.001:
        failures.append("world bounds no longer match polished Hero Corner")
    for obj in bpy.context.scene.objects:
        if obj.type in {"CAMERA", "LIGHT"}:
            failures.append(f"formal camera/light present: {obj.name}")
        if obj.type == "MESH":
            if len(obj.data.materials) != 1 or obj.data.materials[0] is None:
                failures.append(f"invalid material slot: {obj.name}")
            elif any(word in obj.data.materials[0].name for word in ("Clay", "Preview", "Temp")):
                failures.append(f"temporary material remains: {obj.name}/{obj.data.materials[0].name}")
    for name in textured:
        if bpy.data.objects[name].data.uv_layers.active is None:
            failures.append(f"textured object without UV: {name}")
    for anchor, socket in (("MONITOR_BASE_ANCHOR", "MONITOR_SOCKET"), ("KEYBOARD_BASE_ANCHOR", "KEYBOARD_SOCKET"), ("LAMP_BASE_ANCHOR", "LAMP_SOCKET")):
        error = (bpy.data.objects[anchor].matrix_world.translation - bpy.data.objects[socket].matrix_world.translation).length
        print("PBR_ANCHOR_ALIGNMENT", anchor, f"{error:.9f}")
        if error > 0.0001:
            failures.append(f"anchor alignment changed: {anchor} {error:.9f}")
    if failures:
        raise RuntimeError("PBR in-memory validation failed:\n- " + "\n- ".join(failures))
    print("PBR_GEOMETRY_UNCHANGED", after_stats, tuple(after_bounds[0]), tuple(after_bounds[1]))


def export_glb(root, path):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in [root] + descendants(root):
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=path, export_format="GLB", use_selection=True, export_apply=False,
        export_materials="EXPORT", export_extras=True, export_animations=False,
        export_skins=False, export_cameras=False, export_lights=False,
    )
    if not os.path.isfile(path) or os.path.getsize(path) < 100_000:
        raise RuntimeError("PBR GLB was not produced correctly")
    print("PBR_GLB", path, os.path.getsize(path))


def render_preview(path):
    bpy.ops.object.light_add(type="SUN", location=(0.0, 0.0, 5.0))
    sun = bpy.context.object
    sun.rotation_euler = (math.radians(32), math.radians(-24), math.radians(-28))
    sun.data.energy = 2.0
    sun.data.color = (1.0, 0.84, 0.67)
    sun.data.angle = math.radians(18)
    bpy.ops.object.light_add(type="AREA", location=(-1.5, -4.5, 5.8))
    key = bpy.context.object
    key.data.energy = 1050.0
    key.data.shape = "DISK"
    key.data.size = 5.0
    key.data.color = (1.0, 0.92, 0.82)
    bpy.ops.object.light_add(type="AREA", location=(4.5, 1.0, 3.8))
    fill = bpy.context.object
    fill.data.energy = 340.0
    fill.data.size = 4.0
    fill.data.color = (0.88, 0.92, 1.0)
    target = Vector((0.0, 0.15, 1.15))
    bpy.ops.object.camera_add(location=(6.5, -8.0, 5.2))
    camera = bpy.context.object
    camera.name = "PREVIEW_CAMERA"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 6.10
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera
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
    world = bpy.data.worlds.new("Clear_Day_Preview_World")
    world.use_nodes = True
    background = world.node_tree.nodes["Background"]
    background.inputs["Color"].default_value = (0.20, 0.24, 0.30, 1.0)
    background.inputs["Strength"].default_value = 0.34
    scene.world = world
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.render.render(write_still=True)
    if not os.path.isfile(path) or os.path.getsize(path) < 10_000:
        raise RuntimeError("PBR clear-day preview was not produced correctly")
    print("PBR_PREVIEW", path, "resolution=(1920, 1080)")


def main():
    args = parse_args()
    input_path = os.path.abspath(args.input)
    output_path = os.path.abspath(args.output)
    glb_path = os.path.abspath(args.glb)
    texture_dir = os.path.abspath(args.textures)
    preview_path = os.path.abspath(args.preview)
    if os.path.normcase(input_path) == os.path.normcase(output_path):
        raise RuntimeError("Refusing to overwrite polished Hero Corner input")
    if not os.path.isfile(input_path):
        raise RuntimeError(f"Missing polished Hero Corner input: {input_path}")
    bpy.ops.wm.open_mainfile(filepath=input_path)
    bpy.context.view_layer.update()
    root = bpy.data.objects.get("VQ1C_POLISHED_HERO_ROOT")
    if root is None:
        raise RuntimeError("VQ1C_POLISHED_HERO_ROOT missing")
    before_signature = geometry_signature()
    before_stats = scene_stats()
    before_bounds = world_bounds(bpy.context.scene.objects)
    if before_stats[:2] != (EXPECTED_MESHES, EXPECTED_TRIANGLES):
        raise RuntimeError(f"Input geometry stats invalid: {before_stats}")
    os.makedirs(texture_dir, exist_ok=True)
    images = {}
    for filename, (width, height, channel, profile) in TEXTURES.items():
        images[filename] = create_texture(os.path.join(texture_dir, filename), width, height, channel, profile)
    materials = build_materials(images)
    textured = assign_materials(materials)
    remove_unused_materials(set(materials))
    validate_in_memory(before_signature, before_stats, before_bounds, materials, textured)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=output_path)
    print("PBR_BLEND", output_path)
    export_glb(root, glb_path)
    render_preview(preview_path)
    print("VQ1C_PBR_MATERIAL_BUILD_OK")


if __name__ == "__main__":
    main()
