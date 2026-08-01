import { DataTexture, RepeatWrapping, RedFormat, UnsignedByteType } from "three";

// Deterministic hash → reproducible noise (no per-refresh randomness).
function hash(x: number, y: number, seed: number): number {
  let h = (x * 374761393 + y * 668265263 + seed * 1442695040) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function makeTexture(size: number, fn: (x: number, y: number) => number): DataTexture {
  const data = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      data[y * size + x] = Math.max(0, Math.min(255, Math.round(fn(x, y) * 255)));
    }
  }
  const tex = new DataTexture(data, size, size, RedFormat, UnsignedByteType);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

// Very subtle cross-weave fabric bump (32×32). Used as bumpMap with a tiny scale.
export const softFabricBump = makeTexture(32, (x, y) => {
  const weave = (Math.sin(x * 1.7) * Math.sin(y * 1.7)) * 0.5 + 0.5;
  const grain = hash(x, y, 1);
  return 0.5 + weave * 0.1 + (grain - 0.5) * 0.12;
});

// Extremely subtle plaster grain (32×32). Only readable up close under light.
export const wallBump = makeTexture(32, (x, y) => 0.5 + (hash(x, y, 7) - 0.5) * 0.07);

// Subtle longitudinal wood variation (32×32). Used as roughnessMap, not real grain.
export const woodRoughness = makeTexture(32, (x, y) => {
  const streak = Math.sin(y * 0.85 + hash(x, 0, 3) * 2.0) * 0.5 + 0.5;
  return 0.5 + streak * 0.1 + (hash(x, y, 5) - 0.5) * 0.05;
});
