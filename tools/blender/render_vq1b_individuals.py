"""VQ1B Individual Candidate Renderer — one clean scene per asset."""

import bpy
import os
import sys
import math
from mathutils import Vector, Matrix

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DL = os.path.join(ROOT, "assets-source", "downloads", "vq1b")
OUT = os.path.join(ROOT, "outputs", "vq-1b", "individual")
os.makedirs(OUT, exist_ok=True)

CAT_DL = os.path.join(DL, "quaternius-cat", "Cat by Quaternius - qKICY6xla2", "Cat.fbx")

# ─── Candidate registry ───
# (key, name, source, rel_path)
CANDIDATES = {
    "desks": [
        ("D1", "Desk", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/Desk.blend"),
        ("D2", "Table", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/Table.blend"),
        ("D3", "Table2", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/Table2.blend"),
        ("D4", "desk", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/desk.obj"),
        ("D5", "deskCorner", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/deskCorner.obj"),
        ("D6", "table", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/table.obj"),
    ],
    "chairs": [
        ("C1", "OfficeChair", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/OfficeChair.blend"),
        ("C2", "Chair", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/Chair.blend"),
        ("C3", "Chair_1", "QH", "quaternius-house-interior/drive-download-20260801T084648Z-1-001/Blends/Chair_1.blend"),
        ("C4", "Chair_2", "QH", "quaternius-house-interior/drive-download-20260801T084648Z-1-001/Blends/Chair_2.blend"),
        ("C5", "chairDesk", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/chairDesk.obj"),
        ("C6", "chairModernCushion", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/chairModernCushion.obj"),
    ],
    "monitors": [
        ("M1", "computerScreen", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/computerScreen.obj"),
        ("M2", "televisionModern", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/televisionModern.obj"),
        ("M3", "televisionVintage", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/televisionVintage.obj"),
    ],
    "keyboards": [
        ("K1", "computerKeyboard", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/computerKeyboard.obj"),
    ],
    "lamps": [
        ("L1", "Light_Desk", "QH", "quaternius-house-interior/drive-download-20260801T084648Z-1-001/Blends/Light_Desk.blend"),
        ("L2", "Light_Stand1", "QH", "quaternius-house-interior/drive-download-20260801T084648Z-1-001/Blends/Light_Stand1.blend"),
        ("L3", "Light_Stand2", "QH", "quaternius-house-interior/drive-download-20260801T084648Z-1-001/Blends/Light_Stand2.blend"),
        ("L4", "lampRoundTable", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/lampRoundTable.obj"),
        ("L5", "lampSquareTable", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/lampSquareTable.obj"),
        ("L6", "lampSquareFloor", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/lampSquareFloor.obj"),
    ],
    "sofas": [
        ("S1", "Sofa", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/Sofa.blend"),
        ("S2", "Sofa2", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/Sofa2.blend"),
        ("S3", "Sofa3", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/Sofa3.blend"),
        ("S4", "Sofa_individual", "QF", "quaternius-furniture/drive-download-20260801T084800Z-1-001/Blends/Sofa_individual.blend"),
        ("S5", "Couch_Large1", "QH", "quaternius-house-interior/drive-download-20260801T084648Z-1-001/Blends/Couch_Large1.blend"),
        ("S6", "Couch_Medium1", "QH", "quaternius-house-interior/drive-download-20260801T084648Z-1-001/Blends/Couch_Medium1.blend"),
        ("S7", "loungeSofa", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/loungeSofa.obj"),
        ("S8", "loungeDesignSofa", "K", "kenney-furniture/kenney_furniture-kit/Models/OBJ format/loungeDesignSofa.obj"),
    ],
}

CAT_VIEWS = {
    "01-cat-three-quarter-clay": {"dir": (6, -8, 5), "clay": True},
    "02-cat-front-clay": {"dir": (0, -8, 2), "clay": True},
    "03-cat-side-clay": {"dir": (8, 0, 2), "clay": True},
    "04-cat-top-clay": {"dir": (0, 0, 8), "clay": True},
    "05-cat-idle-original": {"dir": (6, -8, 5), "clay": False, "anim": "Idle"},
    "06-cat-walk-original": {"dir": (6, -8, 5), "clay": False, "anim": "Walk"},
}

VIEW_DIRS = {
    "desks": (6, -7, 5),
    "chairs": (6, -7, 5),
    "monitors": (4, -6, 3.5),
    "keyboards": (2, -4, 5),
    "lamps": (5, -6, 4),
    "sofas": (5, -7, 4),
}

IMG_W, IMG_H = 640, 480

# ─────────────────────────────────
def clay_material():
    mat = bpy.data.materials.new("ClayNeutral")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (0.72, 0.71, 0.68, 1.0)
        bsdf.inputs["Metallic"].default_value = 0.0
        bsdf.inputs["Roughness"].default_value = 0.74
    return mat

def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for d in (bpy.data.meshes, bpy.data.materials, bpy.data.actions, bpy.data.armatures, bpy.data.images):
        for item in list(d): d.remove(item)

def import_model(path):
    if not os.path.exists(path): raise FileNotFoundError(path)
    ext = os.path.splitext(path)[1].lower()
    if ext == ".blend":
        with bpy.data.libraries.load(path, link=False) as (f, t):
            t.objects = [n for n in f.objects if n]
        for obj in t.objects:
            if obj: bpy.context.collection.objects.link(obj)
    elif ext == ".fbx":
        bpy.ops.import_scene.fbx(filepath=path)
    elif ext == ".obj":
        bpy.ops.wm.obj_import(filepath=path)
    else:
        raise RuntimeError(f"Unknown format: {ext}")

def setup_lighting():
    bpy.context.scene.world = bpy.data.worlds.new("W")
    bpy.context.scene.world.color = (0.38, 0.37, 0.35)

    # Ground plane for contact shadows
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -0.02))
    g = bpy.context.object; g.name = "Ground"
    gm = bpy.data.materials.new("GM")
    gm.diffuse_color = (0.40, 0.39, 0.38, 1.0)
    g.data.materials.append(gm)

    # Area lights
    bpy.ops.object.light_add(type="AREA", location=(5, -4, 8))
    a = bpy.context.object.data; a.energy = 800; a.size = 12
    a.color = (1.0, 0.95, 0.88)

    bpy.ops.object.light_add(type="AREA", location=(-3, -2, 2))
    a = bpy.context.object.data; a.energy = 300; a.size = 6
    a.color = (0.85, 0.88, 1.0)

    bpy.ops.object.light_add(type="AREA", location=(0, -6, 3))
    a = bpy.context.object.data; a.energy = 200; a.size = 4
    a.color = (1.0, 1.0, 1.0)

def remove_extras():
    cam = bpy.context.scene.camera
    for obj in list(bpy.context.scene.objects):
        if obj.type == "LIGHT" and obj.name not in ("Area", "Area.001", "Area.002"): bpy.data.objects.remove(obj, do_unlink=True)
        if obj.type == "CAMERA" and obj != cam: bpy.data.objects.remove(obj, do_unlink=True)

def reveal_all():
    for obj in bpy.context.scene.objects:
        obj.hide_viewport = obj.hide_render = False
        obj.hide_set(False)
        if obj.type == "MESH": obj.display_type = "TEXTURED"

def apply_clay():
    mat = clay_material()
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH" and obj.name != "Ground":
            obj.data.materials.clear()
            obj.data.materials.append(mat)

def get_bounds():
    depsgraph = bpy.context.evaluated_depsgraph_get()
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH" and o.name != "Ground"]
    if not meshes: return None, 0
    bpy.context.view_layer.update()
    bpy.ops.object.select_all(action="DESELECT")
    for m in meshes: m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")

    min_v, max_v = Vector((1e9,1e9,1e9)), Vector((-1e9,-1e9,-1e9))
    for obj in meshes:
        eval_obj = obj.evaluated_get(depsgraph)
        mw = eval_obj.matrix_world
        for v in eval_obj.data.vertices:
            wv = mw @ v.co
            min_v.x = min(min_v.x, wv.x); min_v.y = min(min_v.y, wv.y); min_v.z = min(min_v.z, wv.z)
            max_v.x = max(max_v.x, wv.x); max_v.y = max(max_v.y, wv.y); max_v.z = max(max_v.z, wv.z)
    if min_v.x > max_v.x: return None, 0
    center = (min_v + max_v) / 2
    size = (max_v - min_v).length
    return (min_v, max_v, center), size

def center_on_ground():
    bounds, _ = get_bounds()
    if bounds is None: return
    min_v, _, center = bounds
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH" and o.name != "Ground"]
    for obj in meshes:
        obj.location.x -= center.x
        obj.location.y -= center.y
        obj.location.z -= min_v.z
    bpy.context.view_layer.update()

def make_ortho_camera(view_dir, bounds_data):
    if bounds_data is None: return
    _, _, center = bounds_data
    min_v, max_v, _ = bounds_data

    bpy.ops.object.camera_add(location=view_dir)
    cam = bpy.context.object
    cam.data.type = "ORTHO"
    bpy.context.scene.camera = cam

    # Look at center
    target = Vector(center)
    target.z = (min_v.z + max_v.z) / 2
    dir_vec = target - cam.location
    cam.rotation_euler = dir_vec.to_track_quat("-Z", "Y").to_euler()

    # Compute ortho_scale from projected bounds
    # Project 8 corners to camera right/up plane
    corners = [
        Vector((min_v.x, min_v.y, min_v.z)),
        Vector((max_v.x, min_v.y, min_v.z)),
        Vector((min_v.x, max_v.y, min_v.z)),
        Vector((max_v.x, max_v.y, min_v.z)),
        Vector((min_v.x, min_v.y, max_v.z)),
        Vector((max_v.x, min_v.y, max_v.z)),
        Vector((min_v.x, max_v.y, max_v.z)),
        Vector((max_v.x, max_v.y, max_v.z)),
    ]
    bpy.context.view_layer.update()
    cam_mat = cam.matrix_world.to_3x3()
    right = cam_mat.col[0].normalized()
    up = cam_mat.col[1].normalized()

    min_r, max_r = 1e9, -1e9
    min_u, max_u = 1e9, -1e9
    for c in corners:
        r = (c - cam.location).dot(right)
        u = (c - cam.location).dot(up)
        min_r, max_r = min(min_r, r), max(max_r, r)
        min_u, max_u = min(min_u, u), max(max_u, u)

    proj_w = max_r - min_r
    proj_h = max_u - min_u
    if proj_w < 0.01 or proj_h < 0.01: return

    aspect = IMG_W / IMG_H
    cam.data.ortho_scale = max(proj_w / aspect, proj_h) * 1.25
    bpy.context.view_layer.update()

def render_single(out_path):
    bpy.context.scene.render.engine = "BLENDER_EEVEE"
    bpy.context.scene.render.resolution_x = IMG_W
    bpy.context.scene.render.resolution_y = IMG_H
    bpy.context.scene.render.image_settings.file_format = "PNG"
    bpy.context.scene.view_settings.view_transform = "AgX"
    bpy.context.scene.view_settings.look = "AgX - Medium High Contrast"
    bpy.context.scene.render.filepath = out_path
    bpy.context.scene.render.image_settings.color_mode = "RGB"
    bpy.ops.render.render(write_still=True)
    sz = os.path.getsize(out_path) if os.path.exists(out_path) else 0
    return sz > 10000 and os.path.exists(out_path)

# ─────────────────────────────────
RESULTS = {}

def render_category(cat, candidates, view_dir, use_clay=True):
    cat_dir = os.path.join(OUT, cat)
    os.makedirs(cat_dir, exist_ok=True)
    ok, fail = 0, 0

    for key, name, src, rel in candidates:
        out_name = f"{key}-{name}-{src}.png"
        out_path = os.path.join(cat_dir, out_name)
        clear_scene()

        try:
            path = os.path.join(DL, rel)
            import_model(path)
            reveal_all()
            remove_extras()
            center_on_ground()
            bounds, sz = get_bounds()
            if bounds is None or sz < 0.001:
                raise RuntimeError(f"No valid mesh bounds (sz={sz:.4f})")
            setup_lighting()
            if use_clay:
                apply_clay()
            make_ortho_camera(view_dir, bounds)
            if bpy.context.scene.camera is None:
                raise RuntimeError("Camera setup failed")
            ok_rend = render_single(out_path)
            if not ok_rend:
                raise RuntimeError(f"Render output too small or missing ({os.path.getsize(out_path) if os.path.exists(out_path) else 0} bytes)")
            RESULTS[key] = "OK"
            ok += 1
        except Exception as e:
            print(f"  FAIL {key} ({name}): {e}")
            RESULTS[key] = f"FAILED: {e}"
            fail += 1
    return ok, fail

def render_cat():
    cat_dir = os.path.join(OUT, "cat")
    os.makedirs(cat_dir, exist_ok=True)
    ok, fail = 0, 0

    for name, cfg in CAT_VIEWS.items():
        out_path = os.path.join(cat_dir, f"{name}.png")
        clear_scene()
        try:
            import_model(CAT_DL)
            reveal_all()
            remove_extras()
            # Set animation if specified
            if cfg.get("anim"):
                arm = [o for o in bpy.context.scene.objects if o.type == "ARMATURE"]
                if arm and bpy.data.actions:
                    anim_name = next((a for a in bpy.data.actions.keys() if cfg["anim"].lower() in a.lower()), None)
                    if anim_name:
                        arm[0].animation_data_create()
                        arm[0].animation_data.action = bpy.data.actions[anim_name]
                        bpy.context.scene.frame_set(0)
            center_on_ground()
            bounds, sz = get_bounds()
            if bounds is None or sz < 0.001:
                raise RuntimeError(f"No valid mesh (sz={sz:.4f})")
            setup_lighting()
            if cfg["clay"]:
                apply_clay()
            make_ortho_camera(cfg["dir"], bounds)
            ok_rend = render_single(out_path)
            if not ok_rend:
                raise RuntimeError(f"Render empty")
            ok += 1
        except Exception as e:
            print(f"  FAIL cat {name}: {e}")
            fail += 1
    return ok, fail

# ─────────────────────────────────
print("=" * 60)
print("VQ1B Individual Renderer")
print("=" * 60)

total_ok, total_fail = 0, 0
for cat in ["desks","chairs","monitors","keyboards","lamps","sofas"]:
    view_dir = VIEW_DIRS[cat]
    ok, fail = render_category(cat, CANDIDATES[cat], view_dir)
    total_ok += ok; total_fail += fail
    print(f"  {cat}: {ok} OK / {fail} FAIL")

cat_ok, cat_fail = render_cat()
total_ok += cat_ok; total_fail += cat_fail
print(f"  cat: {cat_ok} OK / {cat_fail} FAIL")

print("=" * 60)
print("RESULTS:")
for k in sorted(RESULTS): print(f"  {k}: {RESULTS[k]}")
print(f"TOTAL: {total_ok} OK / {total_fail} FAIL")
print("=" * 60)
if total_fail > 0:
    sys.exit(1)
else:
    print("ALL CANDIDATES PASSED")
