"""VQ1 Pipeline Smoke Test — Blender 5.2.0 LTS

Generates a single GLB with five material samples:
  1. Wood tabletop with thickness and bevel
  2. Metal lamp pole + base
  3. Glass pane with thickness
  4. Fabric cushion with gentle unevenness
  5. Plastic shell

Usage:
  {BLENDER_EXE} --background --factory-startup --python tools/blender/create_vq1_pipeline_smoke.py
"""

import bpy
import math
import os
import sys

# ---------------------------------------------------------------------------
# Setup — clean scene
# ---------------------------------------------------------------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

# Drive Cycles off so we stay in pure Eevee / Workbench for smoke test
bpy.context.scene.render.engine = "BLENDER_EEVEE"
bpy.context.scene.eevee.taa_render_samples = 1

output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "models", "vq1")
blend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets-source", "blender")
os.makedirs(output_dir, exist_ok=True)
os.makedirs(blend_dir, exist_ok=True)


def set_origin_to_geometry(obj):
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")


def apply_all_transforms(obj):
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)


def new_principled(name, base_color, roughness, metallic=0.0, alpha=1.0, transmission=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf is None:
        bsdf = mat.node_tree.nodes.new(type="ShaderNodeBsdfPrincipled")
        output = mat.node_tree.nodes.get("Material Output")
        mat.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Alpha"].default_value = alpha
    bsdf.inputs["Transmission Weight"].default_value = transmission
    if alpha < 1.0 or transmission > 0.0:
        mat.blend_method = "BLEND"
    return mat


def add_beveled_cube(name, size, bevel_radius, position, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=position)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0], size[2], size[1])
    modifier = obj.modifiers.new(name="Bevel", type="BEVEL")
    modifier.width = bevel_radius
    modifier.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    apply_all_transforms(obj)
    obj.data.materials.append(mat)
    return obj


# ---------------------------------------------------------------------------
# 1. Wood tabletop — thick board with bevel
# ---------------------------------------------------------------------------
wood = new_principled("Mat_Wood_OakLight", base_color=(0.82, 0.71, 0.53), roughness=0.75)
add_beveled_cube(
    name="Wood_Tabletop",
    size=(1.6, 0.10, 0.9),
    bevel_radius=0.025,
    position=(0, 0.12, 0),
    mat=wood,
)

# ---------------------------------------------------------------------------
# 2. Metal lamp pole + base
# ---------------------------------------------------------------------------
metal = new_principled("Mat_Metal_Brass", base_color=(0.83, 0.69, 0.22), roughness=0.35, metallic=1.0)

bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.04, depth=0.55, location=(0.55, 0.27 + 0.06, 0))
pole = bpy.context.active_object
pole.name = "Metal_Pole"
pole.data.materials.append(metal)

bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.14, depth=0.06, location=(0.55, 0.03, 0))
base = bpy.context.active_object
base.name = "Metal_Base"
base.data.materials.append(metal)

# ---------------------------------------------------------------------------
# 3. Glass — thick pane
# ---------------------------------------------------------------------------
glass = new_principled("Mat_Glass_Clear", base_color=(0.92, 0.94, 0.96), roughness=0.05, alpha=0.15, transmission=0.92)
add_beveled_cube(
    name="Glass_Pane",
    size=(0.55, 0.08, 0.45),
    bevel_radius=0.012,
    position=(-0.48, 0.18, 0),
    mat=glass,
)

# ---------------------------------------------------------------------------
# 4. Fabric cushion — gentle puff using proportional editing
# ---------------------------------------------------------------------------
fabric = new_principled("Mat_Fabric_Teal", base_color=(0.28, 0.55, 0.53), roughness=0.92)
add_beveled_cube(
    name="Fabric_Cushion",
    size=(0.70, 0.14, 0.50),
    bevel_radius=0.06,
    position=(0, 0.08, 0.55),
    mat=fabric,
)

# Slightly puff the top face
cushion = bpy.data.objects.get("Fabric_Cushion")
if cushion and len(cushion.data.polygons) > 4:
    bpy.context.view_layer.objects.active = cushion
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="DESELECT")
    bm = None
    # Access top-facing polygons via bmesh (cross-version safe)
    try:
        import bmesh
        bm = bmesh.from_edit_mesh(cushion.data)
        for face in bm.faces:
            if face.normal.z > 0.9:
                face.select = True
        bpy.ops.transform.translate(value=(0, 0, 0.035))
    finally:
        if bm is not None:
            bpy.ops.object.mode_set(mode="OBJECT")
            cushion.data.update()

# ---------------------------------------------------------------------------
# 5. Plastic shell
# ---------------------------------------------------------------------------
plastic = new_principled("Mat_Plastic_Cream", base_color=(0.94, 0.88, 0.78), roughness=0.45)
add_beveled_cube(
    name="Plastic_Shell",
    size=(0.50, 0.20, 0.38),
    bevel_radius=0.045,
    position=(0.55, 0.14, -0.50),
    mat=plastic,
)

# ---------------------------------------------------------------------------
# Apply all transforms
# ---------------------------------------------------------------------------
for obj in bpy.data.objects:
    if obj.type == "MESH":
        apply_all_transforms(obj)

# ---------------------------------------------------------------------------
# Save .blend
# ---------------------------------------------------------------------------
blend_path = os.path.join(blend_dir, "vq1-pipeline-smoke.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

# ---------------------------------------------------------------------------
# Export GLB
# ---------------------------------------------------------------------------
glb_path = os.path.join(output_dir, "vq1-pipeline-smoke.glb")
bpy.ops.export_scene.gltf(
    filepath=glb_path,
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_image_format="NONE",
    export_materials="EXPORT",
    export_extras=True,
)

print(f"BLEND={blend_path}")
print(f"GLB={glb_path}")
print(f"OBJECTS={len([o for o in bpy.data.objects if o.type == 'MESH'])}")
print("DONE")
