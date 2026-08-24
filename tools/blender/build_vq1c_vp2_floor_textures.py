"""VP2-1b — unique full-room floor wood atlas for the 16.2x13.2m office.

Replaces the repeating 1024x1024 floor texture with one deterministic atlas
covering the whole room exactly once (no periodic repeat). Each plank gets an
independent low-frequency tint, phase and grain, with staggered short-end
joints and subtle long-end seams.

Outputs (2048x1664 = 16.2:13.2 aspect):
  full-office/textures/vp2/floor_wood_vp2_basecolor.png
  full-office/textures/vp2/floor_wood_vp2_roughness.png
  full-office/textures/vp2/floor_wood_vp2_normal.png

Original PBR textures are never modified.
"""

import argparse
import math
import sys
from array import array
from bisect import bisect_right
from pathlib import Path

import bpy


REPO_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = REPO_ROOT / "assets-source/blender/vq1c/full-office/textures/vp2"

ROOM_W = 16.2
ROOM_D = 13.2
ATLAS_W = 2048
ATLAS_H = 1664

PLANK_W_MIN, PLANK_W_MAX = 0.24, 0.32
PLANK_L_MIN, PLANK_L_MAX = 1.2, 2.4
JOINT_W = 0.008
MIN_SEAM_GAP = 0.30
BASE = (0.40, 0.30, 0.21)

OUTPUT = {
    "basecolor": "floor_wood_vp2_basecolor.png",
    "roughness": "floor_wood_vp2_roughness.png",
    "normal": "floor_wood_vp2_normal.png",
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(OUTPUT_DIR))
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(argv)


def hash01(*args):
    """Deterministic pseudo-random hash in [0,1) from integer keys."""
    value = math.sin(sum(arg * (index + 1) * 12.9898 for index, arg in enumerate(args)) + 78.233) * 43758.5453
    return value - math.floor(value)


def build_plank_layout():
    """Return row descriptions covering the room.

    Each row: {'y': start_y, 'height': plank_width, 'starts': [...], 'lens': [...], 'seeds': [...]}

    Short-end seams of adjacent rows are kept at least MIN_SEAM_GAP apart:
    while generating a row, every candidate segment length is re-sampled
    (bounded attempts) until its right-end seam is >= MIN_SEAM_GAP from every
    seam in the previous row; a deterministic fallback nudges the seam to a
    guaranteed distance.
    """
    rows = []
    y = 0.0
    row_index = 0
    previous_seams = []
    while y < ROOM_D - 0.001:
        plank_w = PLANK_W_MIN + hash01(row_index, 1) * (PLANK_W_MAX - PLANK_W_MIN)
        offset = hash01(row_index, 2) * 1.8  # row stagger offset in meters
        starts = []
        lens = []
        seeds = []
        x = offset - JOINT_W  # begin slightly before room edge so edges have planks
        segment = 0
        while x < ROOM_W + JOINT_W + 0.01:
            # Deterministic rejection sampling against previous-row seams.
            candidate_length = None
            accepted = False
            attempt = 0
            max_attempts = 24
            while not accepted and attempt < max_attempts:
                plank_l = PLANK_L_MIN + hash01(row_index, segment, 3, attempt) * (PLANK_L_MAX - PLANK_L_MIN)
                seam_x = x + plank_l
                if all(abs(seam_x - previous) >= MIN_SEAM_GAP for previous in previous_seams):
                    candidate_length = plank_l
                    accepted = True
                    break
                attempt += 1
            if candidate_length is None:
                # Deterministic fallback: nudge the seam to exactly MIN_SEAM_GAP
                # past the nearest previous seam (away from the room start).
                nearest = min(previous_seams, key=lambda previous: abs((x + PLANK_L_MIN) - previous))
                fallback_seam = nearest + MIN_SEAM_GAP
                candidate_length = fallback_seam - x
                candidate_length = max(PLANK_L_MIN, min(PLANK_L_MAX, candidate_length))
            starts.append(x)
            lens.append(candidate_length)
            seeds.append((row_index, segment))
            x += candidate_length + JOINT_W
            segment += 1
        row_seams = [start + length for start, length in zip(starts, lens)]
        rows.append({"y": y, "height": plank_w, "starts": starts, "lens": lens, "seeds": seeds})
        previous_seams = row_seams
        y += plank_w + JOINT_W
        row_index += 1
    return rows


ROWS = build_plank_layout()
ROW_STARTS = [row["y"] for row in ROWS]


def seam_factor(wx, wy):
    """0 at plank interior, 1 at the center of a plank joint."""
    row_index = bisect_right(ROW_STARTS, wy) - 1
    if row_index < 0:
        row_index = 0
    row = ROWS[min(row_index, len(ROWS) - 1)]
    dy = min(wy - row["y"], row["y"] + row["height"] + JOINT_W - wy)
    segment = bisect_right(row["starts"], wx) - 1
    if segment < 0:
        segment = 0
    segment = min(segment, len(row["starts"]) - 1)
    start = row["starts"][segment]
    length = row["lens"][segment]
    dx = min(wx - start, start + length + JOINT_W - wx)
    distance = min(dx, dy)
    if distance >= JOINT_W:
        return 0.0
    if distance <= 0.0:
        return 1.0
    return 1.0 - distance / JOINT_W


def plank_context(wx, wy):
    """Return (row_index, segment, seed) for the pixel."""
    row_index = bisect_right(ROW_STARTS, wy) - 1
    row_index = max(0, min(row_index, len(ROWS) - 1))
    row = ROWS[row_index]
    segment = bisect_right(row["starts"], wx) - 1
    segment = max(0, min(segment, len(row["starts"]) - 1))
    return row_index, segment, row["seeds"][segment]


def texture_sample(u, v, channel):
    wx = u * ROOM_W
    wy = v * ROOM_D
    seam = seam_factor(wx, wy)
    row_index, segment, seed = plank_context(wx, wy)
    seed_a, seed_b = seed

    # Per-plank deterministic variation
    plank_tint = hash01(seed_a, seed_b, 5) - 0.5  # -0.5..0.5
    grain_phase = hash01(seed_a, seed_b, 6) * math.tau
    grain_freq = 9.0 + hash01(seed_a, seed_b, 7) * 7.0
    grain_amp = 0.008 + hash01(seed_a, seed_b, 8) * 0.008
    start = ROWS[row_index]["starts"][segment]
    local_x = (wx - start) % max(ROWS[row_index]["lens"][segment], 0.001)
    grain = math.sin(grain_freq * math.tau * (local_x / ROOM_W) + grain_phase)
    fine = math.sin(31.0 * math.tau * (local_x / ROOM_W) + grain_phase * 0.5)

    if channel == "basecolor":
        tint = plank_tint * 0.022  # 5-8% max per-plank difference
        value = tuple(max(0.0, min(1.0, BASE[i] + tint + grain * grain_amp - seam * 0.05)) for i in range(3))
        return (*value, 1.0)
    if channel == "roughness":
        plank_rough = 0.74 + (hash01(seed_a, seed_b, 9) - 0.5) * 0.03
        value = max(0.0, min(1.0, plank_rough + grain * grain_amp * 0.35 + seam * 0.03))
        return value, value, value, 1.0
    # normal channel: seam groove + very weak grain
    strength = 0.012  # softer than the previous 0.020
    dx = strength * math.cos(grain_freq * math.tau * (local_x / ROOM_W) + grain_phase)
    dy = strength * math.sin(grain_freq * math.tau * (local_x / ROOM_W) + grain_phase) * 0.3
    groove = seam * 0.06
    return max(0.0, min(1.0, 0.5 - groove + dx)), max(0.0, min(1.0, 0.5 - groove + dy)), 1.0, 1.0


def create_atlas(path, channel):
    name = path.stem
    existing = bpy.data.images.get(name)
    if existing:
        bpy.data.images.remove(existing)
    image = bpy.data.images.new(name, width=ATLAS_W, height=ATLAS_H, alpha=True, float_buffer=False)
    image.colorspace_settings.name = "sRGB" if channel == "basecolor" else "Non-Color"
    pixels = array("f")
    for y in range(ATLAS_H):
        v = y / ATLAS_H
        row = []
        for x in range(ATLAS_W):
            u = x / ATLAS_W
            row.extend(texture_sample(u, v, channel))
        pixels.extend(row)
    image.pixels.foreach_set(pixels)
    image.update()
    image.filepath_raw = str(path)
    image.file_format = "PNG"
    image.save()
    image.filepath = "//../../../full-office/textures/vp2/" + path.name
    image.source = "FILE"
    print("VP2_ATLAS", path.name, ATLAS_W, ATLAS_H, channel, image.colorspace_settings.name)
    return image


def seam_statistics():
    """Return deterministic seam layout statistics for validator/manifest use.

    Returns (row_count, total_seams, min_adjacent_row_seam_distance,
    (row_a, row_b, x_a, x_b)).
    """
    seams_by_row = []
    for row in ROWS:
        seams_by_row.append([start + length for start, length in zip(row["starts"], row["lens"])])
    total_seams = sum(len(seams) for seams in seams_by_row)
    global_min = float("inf")
    pair = None
    coords = None
    for index in range(len(seams_by_row) - 1):
        for xa in seams_by_row[index]:
            for xb in seams_by_row[index + 1]:
                distance = abs(xa - xb)
                if distance < global_min:
                    global_min = distance
                    pair = (index, index + 1)
                    coords = (xa, xb)
    return len(seams_by_row), total_seams, global_min, pair, coords


def main():
    args = parse_args()
    output_dir = Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    for channel, filename in OUTPUT.items():
        create_atlas(output_dir / filename, channel)
    row_count, total_seams, min_distance, pair, coords = seam_statistics()
    print("VP2_FLOOR_ATLAS", output_dir, f"{ATLAS_W}x{ATLAS_H}", "world", f"{ROOM_W}x{ROOM_D}")
    print("VP2_SEAM_STATS", "rows", row_count, "seams", total_seams, "min_adjacent", round(min_distance, 6), "pair", pair, "coords", tuple(round(value, 6) for value in coords) if coords else None)
    print("VQ1C_VP2_GATE1B_TEXTURES_OK")


if __name__ == "__main__":
    main()
