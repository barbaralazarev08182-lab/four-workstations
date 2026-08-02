"""VQ1B Asset Indexer — scans download dirs and writes asset inventory JSON."""
import json, os, hashlib
from pathlib import Path

ROOT = Path(os.environ.get("PROJECT_ROOT", os.path.join(os.path.dirname(__file__), "..", "..")))
DL = ROOT / "assets-source" / "downloads" / "vq1b"
OUT_JSON = ROOT / "docs" / "assets" / "vq1b-asset-index.json"

PACKAGES = {
  "quaternius-house-interior": {"author": "Quaternius", "license": "CC0", "url": "https://quaternius.com/packs/ultimatehomeinterior.html"},
  "quaternius-furniture":    {"author": "Quaternius", "license": "CC0", "url": "https://quaternius.com/packs/ultimatefurniture.html"},
  "quaternius-animals":      {"author": "Quaternius", "license": "CC0", "url": "https://quaternius.com/packs/ultimateanimatedanimals.html"},
  "kenney-furniture":        {"author": "Kenney",    "license": "CC0", "url": "https://kenney.nl/assets/furniture-kit"},
}

CATEGORY_KEYWORDS = {
  "desk": ["desk", "table_round", "table_"],
  "office_chair": ["officechair", "chair_desk", "chair_1", "chair_2", "chair_3", "chair_4"],
  "monitor": ["monitor", "screen", "computer"],
  "keyboard": ["keyboard"],
  "desk_lamp": ["light_desk", "lamp_round_table", "lamp_square_table"],
  "sofa": ["couch", "sofa", "lounge"],
  "cat": ["cat"],
  "misc": [],
}

def guess_category(name_lower):
    for cat, keys in CATEGORY_KEYWORDS.items():
        for k in keys:
            if k in name_lower:
                return cat
    return "misc"

def sha256(fpath):
    h = hashlib.sha256()
    with open(fpath, "rb") as f:
        while True:
            chunk = f.read(8192)
            if not chunk: break
            h.update(chunk)
    return h.hexdigest()

entries = []

for pkg, meta in PACKAGES.items():
    pkg_dir = DL / pkg
    if not pkg_dir.exists():
        entries.append({"package": pkg, "error": "missing", **meta})
        continue
    # Group by stem name (strip extension and format suffix)
    model_files = {}
    for f in sorted(pkg_dir.rglob("*")):
        if not f.is_file(): continue
        ext = f.suffix.lower()
        if ext in (".jpg", ".png", ".jpeg"):
            continue
        stem = f.stem
        # Normalize: some packs have duplicate formats
        model_files.setdefault(stem, []).append(f)

    for stem, files in model_files.items():
        sizes = {}
        for f in files:
            sizes[f.suffix.lower()] = f.stat().st_size
        entry = {
            "asset_id": f"{pkg}/{stem}",
            "package": pkg,
            "file_name": stem,
            "formats": list(sizes.keys()),
            "sizes": sizes,
            "total_bytes": sum(sizes.values()),
            "source_path": str(files[0].relative_to(ROOT)),
            "category": guess_category(stem.lower()),
            "license": meta["license"],
            "author": meta["author"],
            "source_url": meta["url"],
        }
        # Find preview
        preview = list(files[0].parent.glob(f"{stem}*")) + list(files[0].parent.glob("*preview*"))
        preview = [p for p in preview if p.suffix.lower() in (".png", ".jpg", ".jpeg")]
        if preview:
            entry["preview_path"] = str(preview[0].relative_to(ROOT))
        entries.append(entry)

# Deduplicate same-model across packages
# Group by normalized stem

# Write
os.makedirs(OUT_JSON.parent, exist_ok=True)
with open(OUT_JSON, "w") as f:
    json.dump({"generated_by": "tools/blender/index_vq1b_assets.py", "total": len(entries), "entries": entries}, f, indent=2)
print(f"Wrote {len(entries)} entries to {OUT_JSON}")
