"""VQ1C Gate 4B — merge standardized architecture + workstation + sofa into the canonical Hero Corner.

Inputs (only verified standardized blends):
  architecture-standardized.blend   (HERO_ARCH_ROOT)
  workstation-standardized.blend    (STD_WORKSTATION_ROOT)
  sofa-standardized.blend           (STD_SOFA_ROOT)

Outputs:
  assets-source/blender/vq1c/vq1c-hero-corner.blend
  public/models/vq1/vq1c-hero-corner.glb
"""

import bpy
import math
import os

STD_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "assets-source", "blender", "vq1c", "standardized"))
OUT_BLEND = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "assets-source", "blender", "vq1c", "vq1c-hero-corner.blend"))
OUT_GLB = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "public", "models", "vq1", "vq1c-hero-corner.glb"))

SOURCES = {
    "arch": os.path.join(STD_DIR, "architecture-standardized.blend"),
    "workstation": os.path.join(STD_DIR, "workstation-standardized.blend"),
    "sofa": os.path.join(STD_DIR, "sofa-standardized.blend"),
}

WALL_INNER_X = -2.40      # left wall interior face (per spec)
SOFA_GAP = 0.09           # target gap sofa-back to wall
SOFA_CENTER_Y = 0.18


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for data in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.actions, bpy.data.armatures):
        for item in list(data):
            data.remove(item)


def load_standardized(path):
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing standardized input: {path}")
    with bpy.data.libraries.load(path, link=False) as (data_from, data_to):
        data_to.objects = [name for name in data_from.objects if name]
    loaded = [obj for obj in data_to.objects if obj is not None]
    for obj in loaded:
        bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.update()
    return loaded


def get_object(name):
    obj = bpy.data.objects.get(name)
    if obj is None:
        raise RuntimeError(f"Missing expected object: {name}")
    return obj


def parent_preserve_world(child, parent):
    world = child.matrix_world.copy()
    child.parent = parent
    child.matrix_world = world
    bpy.context.view_layer.update()


def main():
    clear_scene()

    # Unique total root
    hero_root = bpy.data.objects.new("VQ1C_HERO_ROOT", None)
    bpy.context.collection.objects.link(hero_root)
    hero_root.location = (0.0, 0.0, 0.0)
    hero_root.rotation_euler = (0.0, 0.0, 0.0)
    hero_root.scale = (1.0, 1.0, 1.0)

    # 1. Architecture — identity, stays at origin
    load_standardized(SOURCES["arch"])
    arch_root = get_object("HERO_ARCH_ROOT")
    parent_preserve_world(arch_root, hero_root)
    arch_root.location = (0.0, 0.0, 0.0)
    arch_root.rotation_euler = (0.0, 0.0, 0.0)
    arch_root.scale = (1.0, 1.0, 1.0)
    print("HERO_ARCH_ROOT at origin (identity)")

    # 2. Workstation — renamed, placed at (0.65, 0.75, 0)
    load_standardized(SOURCES["workstation"])
    ws_root = get_object("STD_WORKSTATION_ROOT")
    ws_root.name = "HERO_WORKSTATION_ROOT"
    parent_preserve_world(ws_root, hero_root)
    ws_root.location = (0.65, 0.75, 0.0)
    ws_root.rotation_euler = (0.0, 0.0, 0.0)
    ws_root.scale = (1.0, 1.0, 1.0)
    print("HERO_WORKSTATION_ROOT at (0.65, 0.75, 0)")

    # 3. Sofa — renamed, rotated +90deg around Z (back +Y -> -X toward left wall)
    load_standardized(SOURCES["sofa"])
    sofa_root = get_object("STD_SOFA_ROOT")
    sofa_root.name = "HERO_SOFA_ROOT"
    parent_preserve_world(sofa_root, hero_root)
    sofa_root.rotation_euler = (0.0, 0.0, math.pi / 2)
    # Compute sofa back position from its depth after rotation
    dg = bpy.context.evaluated_depsgraph_get()
    sofa_meshes = [o for o in bpy.context.scene.objects if o.parent is sofa_root and o.type == "MESH"]
    if not sofa_meshes:
        raise RuntimeError("No sofa meshes found")
    min_x = min((o.matrix_world.translation.x - o.dimensions.x / 2) for o in sofa_meshes)
    sofa_depth = 0.8836  # canonical sofa depth (Y before rotation -> X after rotation)
    sofa_center_x = WALL_INNER_X + SOFA_GAP + sofa_depth / 2
    sofa_root.location = (sofa_center_x, SOFA_CENTER_Y, 0.0)
    bpy.context.view_layer.update()

    # Recompute actual sofa bounds after placement
    sofa_min_x = min((o.matrix_world.translation.x - o.dimensions.x / 2) for o in sofa_meshes)
    gap_actual = WALL_INNER_X - sofa_min_x
    print(f"HERO_SOFA_ROOT at ({sofa_center_x:.4f}, {SOFA_CENTER_Y}, 0), rotation_z=+90deg, "
          f"actual wall gap={gap_actual:.4f}")

    # Sanity: only the hero root tree remains at top level
    toplevel = [o.name for o in bpy.context.scene.objects if o.parent is None]
    print("TOPLEVEL", toplevel)
    if toplevel != ["VQ1C_HERO_ROOT"]:
        raise RuntimeError(f"Unexpected top-level objects: {toplevel}")

    # Save blend
    os.makedirs(os.path.dirname(OUT_BLEND), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
    print(f"SAVED BLEND {OUT_BLEND}")

    # Export GLB (no cameras, no lights, keep empties/anchors, no animation)
    os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=OUT_GLB,
        export_format="GLB",
        use_selection=False,
        export_apply=False,
        export_image_format="AUTO",
        export_materials="EXPORT",
        export_extras=True,
        export_animations=False,
        export_skins=False,
    )
    glb_size = os.path.getsize(OUT_GLB) if os.path.exists(OUT_GLB) else 0
    print(f"SAVED GLB {OUT_GLB} ({glb_size} bytes)")

    # Stats
    mesh_count = sum(1 for o in bpy.data.objects if o.type == "MESH")
    mat_names = set()
    for o in bpy.data.objects:
        if o.type == "MESH":
            for mat in o.data.materials:
                if mat:
                    mat_names.add(mat.name)
    total_tris = 0
    for o in bpy.data.objects:
        if o.type == "MESH":
            m = o.data
            m.calc_loop_triangles()
            total_tris += len(m.loop_triangles)
    print(f"STATS meshes={mesh_count} materials={len(mat_names)} triangles={total_tris}")
    print("DONE")


if __name__ == "__main__":
    main()
