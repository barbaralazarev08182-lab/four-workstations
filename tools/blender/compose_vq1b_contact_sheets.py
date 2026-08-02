"""VQ1B Contact Sheet Composer — 2D PNG tiles, pure Blender."""
import bpy, os, sys, math
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
IND = os.path.join(ROOT, "outputs", "vq-1b", "individual")
OUT = os.path.join(ROOT, "outputs", "vq-1b")
os.makedirs(OUT, exist_ok=True)

bpy.context.scene.render.engine = "BLENDER_EEVEE"
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.image_settings.file_format = "PNG"
bpy.context.scene.view_settings.view_transform = "Standard"
bpy.context.scene.view_settings.look = "None"

BG_COLOR = (0.18, 0.18, 0.18)

def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for d in (bpy.data.meshes, bpy.data.materials, bpy.data.images):
        for item in list(d): d.remove(item)

def load_image(path):
    name = os.path.basename(path)
    img = bpy.data.images.load(path)
    img.name = name
    return img

def make_image_plane(img, x, y, w, h):
    mat = bpy.data.materials.new(img.name + "_mat")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.new("ShaderNodeEmission")
    tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
    tex.image = img
    mat.node_tree.links.new(bsdf.inputs["Color"], tex.outputs["Color"])
    output = mat.node_tree.nodes.get("Material Output")
    mat.node_tree.links.new(bsdf.outputs["Emission"], output.inputs["Surface"])

    bpy.ops.mesh.primitive_plane_add(size=1, location=(x, y, 0))
    obj = bpy.context.object
    obj.scale = (w / 2, h / 2, 1)
    obj.data.materials.append(mat)
    bpy.context.view_layer.update()

def add_text(label, x, y, size=0.06):
    font = bpy.data.curves.new("Label", "FONT")
    font.body = label
    font.size = size
    font.extrude = 0.005
    obj = bpy.data.objects.new("Text", font)
    bpy.context.collection.objects.link(obj)
    obj.location = (x, y, 0.01)
    mat = bpy.data.materials.new("FontMat")
    mat.diffuse_color = (0.9, 0.9, 0.9, 1.0)
    obj.data.materials.append(mat)
    return obj

def compose_sheet(sheet_id, out_name, cats):
    clear_scene()

    # Orthographic 2D camera
    bpy.ops.object.camera_add(location=(0, 0, 5))
    cam = bpy.context.object
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = 3.2
    bpy.context.scene.camera = cam

    # Background
    world = bpy.data.worlds.new("W")
    world.color = BG_COLOR
    bpy.context.scene.world = world

    all_candidates = []
    for cat_name, keys in cats.items():
        cat_dir = os.path.join(IND, cat_name)
        for key, name, src in keys:
            fname = f"{key}-{name}-{src}.png"
            fpath = os.path.join(cat_dir, fname)
            if os.path.exists(fpath):
                all_candidates.append((key, name, src, fpath))

    cols = 3
    tile_w, tile_h = 0.95, 0.55
    gap_x, gap_y = 0.15, 0.12
    text_y_off = -0.30

    for i, (key, name, src, fpath) in enumerate(all_candidates):
        col = i % cols
        row = i // cols
        cx = (col - (cols - 1) / 2.0) * (tile_w + gap_x)
        cy = 0.9 - row * (tile_h + gap_y + 0.08)
        try:
            img = load_image(fpath)
            make_image_plane(img, cx, cy, tile_w, tile_h)
            add_text(f"{key} — {name}   {src}", cx - tile_w / 2 + 0.02, cy + text_y_off, 0.035)
        except Exception as e:
            add_text(f"{key} — {name}   LOAD ERR", cx - tile_w / 2 + 0.02, cy + text_y_off, 0.03)

    out_path = os.path.join(OUT, out_name)
    bpy.context.scene.render.filepath = out_path
    bpy.ops.render.render(write_still=True)
    sz = os.path.getsize(out_path) if os.path.exists(out_path) else 0
    print(f"  Sheet {sheet_id}: {out_name}  size={sz}  tiles={len(all_candidates)}")
    return sz > 10000

# Layout definitions
CATEGORIES = {
    "01": {
        "file": "01-desk-chair-candidates-1920x1080.png",
        "cats": {
            "desks": [("D1","Desk","QF"),("D2","Table","QF"),("D3","Table2","QF"),("D4","desk","K"),("D5","deskCorner","K"),("D6","table","K")],
            "chairs": [("C1","OfficeChair","QF"),("C2","Chair","QF"),("C3","Chair_1","QH"),("C4","Chair_2","QH"),("C5","chairDesk","K"),("C6","chairModernCushion","K")],
        }
    },
    "02": {
        "file": "02-monitor-keyboard-lamp-candidates-1920x1080.png",
        "cats": {
            "monitors": [("M1","computerScreen","K"),("M2","televisionModern","K"),("M3","televisionVintage","K")],
            "keyboards": [("K1","computerKeyboard","K")],
            "lamps": [("L1","Light_Desk","QH"),("L2","Light_Stand1","QH"),("L3","Light_Stand2","QH"),("L4","lampRoundTable","K"),("L5","lampSquareTable","K"),("L6","lampSquareFloor","K")],
        }
    },
    "03": {
        "file": "03-sofa-candidates-1920x1080.png",
        "cats": {
            "sofas": [("S1","Sofa","QF"),("S2","Sofa2","QF"),("S3","Sofa3","QF"),("S4","Sofa_individual","QF"),("S5","Couch_Large1","QH"),("S6","Couch_Medium1","QH"),("S7","loungeSofa","K"),("S8","loungeDesignSofa","K")],
        }
    },
    "04": {
        "file": "04-cat-candidates-1920x1080.png",
        "cats": {
            "cat": [("","three-quarter-clay",""),("","front-clay",""),("","side-clay",""),("","top-clay",""),("","idle-original",""),("","walk-original","")],
        }
    },
}

print("=" * 60)
print("VQ1B Contact Sheet Composer")
print("=" * 60)

all_ok = True
for sheet_id, cfg in sorted(CATEGORIES.items()):
    # For cat, use special filenames
    if sheet_id == "04":
        clear_scene()
        world = bpy.data.worlds.new("W"); world.color = BG_COLOR; bpy.context.scene.world = world
        bpy.ops.object.camera_add(location=(0,0,5)); bpy.context.object.data.type="ORTHO"; bpy.context.object.data.ortho_scale=3.2; bpy.context.scene.camera=bpy.context.object
        cat_dir = os.path.join(IND, "cat")
        views = ["01-cat-three-quarter-clay","02-cat-front-clay","03-cat-side-clay","04-cat-top-clay","05-cat-idle-original","06-cat-walk-original"]
        labels = ["3/4 clay","Front clay","Side clay","Top clay","Idle (original)","Walk (original)"]
        tile_w, tile_h = 0.85, 0.72
        for i, (v, lbl) in enumerate(zip(views, labels)):
            fpath = os.path.join(cat_dir, f"{v}.png")
            if not os.path.exists(fpath):
                print(f"  MISSING cat: {fpath}")
                all_ok = False
                continue
            col, row = i % 3, i // 3
            cx = (col - 1) * 1.02
            cy = 0.75 - row * 0.90
            try:
                img = load_image(fpath)
                make_image_plane(img, cx, cy, tile_w, tile_h)
                add_text(lbl, cx - tile_w/2 + 0.02, cy - tile_h/2 - 0.01, 0.04)
            except Exception as e:
                print(f"  ERR cat {v}: {e}")
                all_ok = False
        out_path = os.path.join(OUT, cfg["file"])
        bpy.context.scene.render.filepath = out_path
        bpy.ops.render.render(write_still=True)
        sz = os.path.getsize(out_path) if os.path.exists(out_path) else 0
        ok = sz > 10000
        print(f"  Sheet 04: {cfg['file']}  size={sz}  {'OK' if ok else 'FAIL'}")
        if not ok: all_ok = False
    else:
        ok = compose_sheet(sheet_id, cfg["file"], cfg["cats"])
        if not ok: all_ok = False

print("=" * 60)
print(f"COMPOSITE {'PASSED' if all_ok else 'FAILED'}")
if not all_ok: sys.exit(1)
