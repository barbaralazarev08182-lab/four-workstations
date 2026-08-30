import json
import math
import sys

import bpy


def main():
    argv = sys.argv
    args = argv[argv.index("--") + 1 :] if "--" in argv else []
    if len(args) != 1:
        raise RuntimeError("Expected GLB path")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args[0])
    obj = next((item for item in bpy.context.scene.objects if item.name == "Runtime_Arch"), None)
    if obj is None or obj.type != "MESH":
        raise RuntimeError("Runtime_Arch mesh missing")
    mesh = obj.data
    if len(mesh.uv_layers) < 2:
        raise RuntimeError(f"Runtime_Arch has only {len(mesh.uv_layers)} UV layers")
    mesh.uv_layers.active_index = 1
    uv_layer = mesh.uv_layers[1]
    out_of_range = 0
    zero_area = 0
    total_area = 0.0
    for polygon in mesh.polygons:
        points = [uv_layer.data[index].uv.copy() for index in polygon.loop_indices]
        out_of_range += sum(1 for point in points if point.x < 0 or point.x > 1 or point.y < 0 or point.y > 1)
        area = 0.0
        for index, point in enumerate(points):
            following = points[(index + 1) % len(points)]
            area += point.x * following.y - following.x * point.y
        area = abs(area) * 0.5
        total_area += area
        if area <= 1e-12:
            zero_area += 1

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="DESELECT")
    bpy.ops.uv.select_all(action="DESELECT")
    bpy.ops.uv.select_overlap()
    bpy.ops.object.mode_set(mode="OBJECT")
    selected = mesh.attributes.get(".uv_select_vert")
    selected_values = [entry.value for entry in selected.data] if selected else [False] * len(uv_layer.data)
    overlap_loops = sum(1 for value in selected_values if value)
    overlap_polygons = sum(1 for polygon in mesh.polygons if any(selected_values[index] for index in polygon.loop_indices))
    result = {
        "object": obj.name,
        "vertices": len(mesh.vertices),
        "polygons": len(mesh.polygons),
        "uvLayers": [layer.name for layer in mesh.uv_layers],
        "uv1Loops": len(uv_layer.data),
        "outOfRangeLoops": out_of_range,
        "zeroAreaPolygons": zero_area,
        "overlapLoops": overlap_loops,
        "overlapPolygons": overlap_polygons,
        "summedIslandTriangleArea": total_area,
    }
    print("L1RA_ARCH_UV=" + json.dumps(result, sort_keys=True))
    if out_of_range or zero_area or overlap_loops:
        raise RuntimeError("Runtime_Arch UV1 validation failed")


if __name__ == "__main__":
    main()
