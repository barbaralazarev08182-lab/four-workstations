import json
import sys

import bpy
from mathutils import Vector


def load(path):
    if path.lower().endswith(".blend"):
        bpy.ops.wm.open_mainfile(filepath=path)
    else:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=path)


def material_info(material):
    result = {"name": material.name, "diffuse": list(material.diffuse_color)}
    if material.use_nodes and material.node_tree:
        principled = next((node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
        if principled:
            for label in ("Base Color", "Metallic", "Roughness"):
                socket = principled.inputs.get(label)
                if socket is not None:
                    value = socket.default_value
                    result[label] = list(value) if hasattr(value, "__len__") else float(value)
    return result


def inspect(path):
    load(path)
    obj = next((item for item in bpy.context.scene.objects if item.name == "Runtime_Desks"), None)
    if obj is not None:
        objects = [obj]
    else:
        collection = bpy.data.collections.get("Runtime_Desks")
        if collection is None:
            objects = [item for item in bpy.context.scene.objects if item.type == "MESH" and len(item.name) > 3 and item.name[0] == "D" and item.name[1] in "1234" and "_DESK_" in item.name]
            if not objects:
                matches = ["C:" + item.name for item in bpy.data.collections if "desk" in item.name.lower()]
                matches += ["O:" + item.name for item in bpy.context.scene.objects if "desk" in item.name.lower()]
                raise RuntimeError(f"Runtime_Desks object/collection missing in {path}; matches={matches[:80]}")
        else:
            objects = [item for item in collection.all_objects if item.type == "MESH"]
    all_counts = {}
    top_counts = {}
    top_area = {}
    top_z = []
    material_map = {}
    for obj in objects:
        mesh = obj.data
        slots = [slot.material for slot in obj.material_slots]
        normal_matrix = obj.matrix_world.to_3x3().inverted().transposed()
        for material in slots:
            if material:
                material_map[material.name] = material
        for polygon in mesh.polygons:
            name = slots[polygon.material_index].name if polygon.material_index < len(slots) and slots[polygon.material_index] else "null"
            all_counts[name] = all_counts.get(name, 0) + 1
            center = obj.matrix_world @ polygon.center
            normal = (normal_matrix @ polygon.normal).normalized()
            if normal.z > 0.85 and center.z > 0.55:
                top_counts[name] = top_counts.get(name, 0) + 1
                top_area[name] = top_area.get(name, 0.0) + polygon.area
                top_z.append(center.z)
    return {
        "path": path,
        "objects": len(objects),
        "slots": [material_info(material_map[name]) for name in sorted(material_map)],
        "polygonMaterialCounts": all_counts,
        "deskTopMaterialCounts": top_counts,
        "deskTopArea": top_area,
        "deskTopZRange": [min(top_z), max(top_z)] if top_z else None,
    }


def main():
    argv = sys.argv
    args = argv[argv.index("--") + 1 :] if "--" in argv else []
    if not args:
        raise RuntimeError("Expected one or more source paths")
    for path in args:
        print("L1RB_DESK=" + json.dumps(inspect(path), sort_keys=True))


if __name__ == "__main__":
    main()
