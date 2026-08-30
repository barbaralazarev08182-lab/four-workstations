"""Surgically inject G1B workstation meshes into the frozen R5 container."""
import copy
import json
import struct
import sys
from pathlib import Path

TARGETS = {"Runtime_Desks", "Runtime_Chairs", "Runtime_Devices", "Runtime_Lamps"}
MATERIAL_MAP = {
    "VQ_Metal_Charcoal": "mat_metal",
    "VQ_Chair_Fabric": "mat_graygreen",
    "VQ_Plastic_Dark": "mat_dark",
    "VQ_Desk_Wood": "mat_wood",
    "VQ_Screen_Glass": "mat_machine",
    "VQ_Keycap": "mat_dark",
    "VQ_Lamp_Shade": "mat_yellow",
    "VQ_Lamp_Inner": "mat_plate",
}


def read_glb(path):
    data = Path(path).read_bytes()
    magic, version, length = struct.unpack_from("<III", data, 0)
    if magic != 0x46546C67 or version != 2 or length != len(data):
        raise RuntimeError(f"Invalid GLB: {path}")
    json_len, json_type = struct.unpack_from("<II", data, 12)
    if json_type != 0x4E4F534A:
        raise RuntimeError("Missing JSON chunk")
    json_start = 20
    doc = json.loads(data[json_start:json_start + json_len])
    bin_header = json_start + json_len
    bin_len, bin_type = struct.unpack_from("<II", data, bin_header)
    if bin_type != 0x004E4942:
        raise RuntimeError("Missing BIN chunk")
    binary = data[bin_header + 8:bin_header + 8 + bin_len]
    return doc, binary


def write_glb(path, doc, binary):
    doc["buffers"][0]["byteLength"] = len(binary)
    raw_json = json.dumps(doc, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    raw_json += b" " * ((4 - len(raw_json) % 4) % 4)
    binary += b"\0" * ((4 - len(binary) % 4) % 4)
    total = 12 + 8 + len(raw_json) + 8 + len(binary)
    payload = struct.pack("<III", 0x46546C67, 2, total)
    payload += struct.pack("<II", len(raw_json), 0x4E4F534A) + raw_json
    payload += struct.pack("<II", len(binary), 0x004E4942) + binary
    Path(path).write_bytes(payload)


def node_map(doc):
    return {node.get("name"): node for node in doc.get("nodes", [])}


def main(final_path, source_path, output_path):
    final, final_bin = read_glb(final_path)
    source, source_bin = read_glb(source_path)
    final_nodes, source_nodes = node_map(final), node_map(source)
    final_materials = {m.get("name"): i for i, m in enumerate(final.get("materials", []))}
    source_materials = {i: m.get("name") for i, m in enumerate(source.get("materials", []))}
    buffer_view_cache = {}

    def copy_view(old_index):
        nonlocal final_bin
        if old_index in buffer_view_cache:
            return buffer_view_cache[old_index]
        old = source["bufferViews"][old_index]
        start = old.get("byteOffset", 0)
        chunk = source_bin[start:start + old["byteLength"]]
        pad = (4 - len(final_bin) % 4) % 4
        final_bin += b"\0" * pad
        new = copy.deepcopy(old)
        new["buffer"] = 0
        new["byteOffset"] = len(final_bin)
        final_bin += chunk
        index = len(final.setdefault("bufferViews", []))
        final["bufferViews"].append(new)
        buffer_view_cache[old_index] = index
        return index

    def copy_accessor(old_index):
        old = source["accessors"][old_index]
        new = copy.deepcopy(old)
        if "bufferView" in new:
            new["bufferView"] = copy_view(new["bufferView"])
        if "sparse" in new:
            for key in ("indices", "values"):
                new["sparse"][key]["bufferView"] = copy_view(new["sparse"][key]["bufferView"])
        index = len(final.setdefault("accessors", []))
        final["accessors"].append(new)
        return index

    report = {}
    for name in sorted(TARGETS):
        final_node, source_node = final_nodes[name], source_nodes[name]
        if source_node.get("translation") or source_node.get("rotation") or source_node.get("scale"):
            raise RuntimeError(f"Source runtime node is not identity: {name} {source_node}")
        source_mesh = source["meshes"][source_node["mesh"]]
        new_mesh = {"name": source_mesh.get("name", name), "primitives": []}
        triangles = 0
        for primitive in source_mesh["primitives"]:
            new_primitive = copy.deepcopy(primitive)
            new_primitive["attributes"] = {key: copy_accessor(value) for key, value in primitive["attributes"].items()}
            if "indices" in primitive:
                new_primitive["indices"] = copy_accessor(primitive["indices"])
                triangles += source["accessors"][primitive["indices"]]["count"] // 3
            source_material = source_materials.get(primitive.get("material"))
            final_material = MATERIAL_MAP.get(source_material, source_material)
            if final_material not in final_materials:
                raise RuntimeError(f"No R5 material mapping for {source_material}")
            new_primitive["material"] = final_materials[final_material]
            new_mesh["primitives"].append(new_primitive)
        final["meshes"][final_node["mesh"]] = new_mesh
        report[name] = triangles

    write_glb(output_path, final, final_bin)
    print("G1B_SURGICAL_INJECT", json.dumps(report, sort_keys=True), "TOTAL", sum(report.values()))


if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    main(*argv)
