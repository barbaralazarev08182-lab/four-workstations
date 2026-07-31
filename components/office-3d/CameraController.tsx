"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { MathUtils, OrthographicCamera, Vector3 } from "three";
import type { MapControls as MapControlsImpl } from "three-stdlib";
import {
  CAMERA_OFFSET,
  CAMERA_ZONES,
  OFFICE_CAMERA,
  SAFE_AREA,
  isMobileViewport,
  resolveAutoZone,
  type CameraZoneKey,
  type CameraZonePreset,
  type Vector3Tuple,
} from "@/components/office-3d/scene-config";

const _corner = new Vector3();
const _relative = new Vector3();
const _targetPos = new Vector3();

const FIXED_FORWARD = new Vector3(
  OFFICE_CAMERA.target[0] - OFFICE_CAMERA.position[0],
  OFFICE_CAMERA.target[1] - OFFICE_CAMERA.position[1],
  OFFICE_CAMERA.target[2] - OFFICE_CAMERA.position[2],
).normalize();
const FIXED_RIGHT = new Vector3().crossVectors(FIXED_FORWARD, new Vector3(0, 1, 0)).normalize();
const FIXED_UP = new Vector3().crossVectors(FIXED_RIGHT, FIXED_FORWARD);

function projectBounds(
  bounds: { min: Vector3Tuple; max: Vector3Tuple },
  target: Vector3Tuple,
): { width: number; height: number } {
  let minR = Infinity;
  let maxR = -Infinity;
  let minU = Infinity;
  let maxU = -Infinity;

  for (let xi = 0; xi <= 1; xi++) {
    for (let yi = 0; yi <= 1; yi++) {
      for (let zi = 0; zi <= 1; zi++) {
        _corner.set(
          xi === 0 ? bounds.min[0] : bounds.max[0],
          yi === 0 ? bounds.min[1] : bounds.max[1],
          zi === 0 ? bounds.min[2] : bounds.max[2],
        );
        _relative.subVectors(_corner, _targetPos.set(...target));
        const projR = _relative.dot(FIXED_RIGHT);
        const projU = _relative.dot(FIXED_UP);
        if (projR < minR) minR = projR;
        if (projR > maxR) maxR = projR;
        if (projU < minU) minU = projU;
        if (projU > maxU) maxU = projU;
      }
    }
  }

  return { width: maxR - minR, height: maxU - minU };
}

function getSafeArea(width: number, height: number) {
  if (!isMobileViewport(width, height)) return SAFE_AREA.desktop;
  return height > width ? SAFE_AREA.portrait : SAFE_AREA.landscape;
}

function calculateFitZoom(
  preset: CameraZonePreset,
  viewportWidth: number,
  viewportHeight: number,
): number {
  const safe = getSafeArea(viewportWidth, viewportHeight);
  const availW = Math.max(1, viewportWidth - safe.left - safe.right);
  const availH = Math.max(1, viewportHeight - safe.top - safe.bottom);
  const projected = projectBounds(preset.bounds, preset.target);
  const zoomW = (availW * preset.margin) / projected.width;
  const zoomH = (availH * preset.margin) / projected.height;
  return Math.max(12, Math.min(zoomW, zoomH));
}

function getPanBounds(preset: CameraZonePreset): { minX: number; maxX: number; minZ: number; maxZ: number } {
  const pad = 1.5;
  return {
    minX: preset.bounds.min[0] + pad,
    maxX: preset.bounds.max[0] - pad,
    minZ: preset.bounds.min[2] + pad,
    maxZ: preset.bounds.max[2] - pad,
  };
}

interface CameraControllerProps {
  zone: CameraZoneKey;
  controlsRef: React.RefObject<MapControlsImpl | null>;
}

export function CameraController({ zone, controlsRef }: CameraControllerProps) {
  const { camera, size } = useThree();
  const cameraRef = useRef(camera);
  const animating = useRef(false);
  const animTarget = useRef(new Vector3());
  const animPosition = useRef(new Vector3());
  const animZoom = useRef(44);
  const latestSize = useRef({ width: size.width, height: size.height });
  const pendingResize = useRef(false);
  const activeZone = useRef<Exclude<CameraZoneKey, "auto">>("desktop");
  const initialized = useRef(false);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const resolveZone = useCallback((z: CameraZoneKey, w: number, h: number): Exclude<CameraZoneKey, "auto"> => {
    return z === "auto" ? resolveAutoZone(w, h) : z;
  }, []);

  const applyZone = useCallback((zoneKey: Exclude<CameraZoneKey, "auto">, animate: boolean) => {
    const preset = CAMERA_ZONES[zoneKey];
    const cam = cameraRef.current as OrthographicCamera;
    const { width, height } = latestSize.current;
    const zoom = calculateFitZoom(preset, width, height);
    activeZone.current = zoneKey;

    const desiredTarget = new Vector3(...preset.target);
    const desiredPosition = desiredTarget.clone().add(new Vector3(...CAMERA_OFFSET));

    if (animate) {
      animTarget.current.copy(desiredTarget);
      animPosition.current.copy(desiredPosition);
      animZoom.current = zoom;
      animating.current = true;
    } else {
      cam.position.copy(desiredPosition);
      cam.zoom = zoom;
      cam.updateProjectionMatrix();
      const controls = controlsRef.current;
      if (controls) {
        controls.target.copy(desiredTarget);
        controls.update();
      }
    }
  }, [controlsRef]);

  useLayoutEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    latestSize.current = { width: size.width, height: size.height };
    const resolved = resolveZone(zone, size.width, size.height);
    applyZone(resolved, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const resolved = resolveZone(zone, latestSize.current.width, latestSize.current.height);
    if (resolved !== activeZone.current) {
      applyZone(resolved, true);
    }
  }, [zone, resolveZone, applyZone]);

  useEffect(() => {
    latestSize.current = { width: size.width, height: size.height };
    if (animating.current) {
      pendingResize.current = true;
      return;
    }
    const resolved = resolveZone(zone, size.width, size.height);
    if (resolved !== activeZone.current) {
      applyZone(resolved, true);
    } else {
      applyZone(resolved, false);
    }
  }, [size.width, size.height, zone, resolveZone, applyZone]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = state.camera as OrthographicCamera;
    const safeDelta = Math.min(delta, 0.05);

    if (animating.current) {
      const alpha = 1 - Math.exp(-6 * safeDelta);
      controls.target.lerp(animTarget.current, alpha);
      cam.position.lerp(animPosition.current, alpha);
      cam.zoom = MathUtils.damp(cam.zoom, animZoom.current, 6, safeDelta);
      cam.updateProjectionMatrix();
      controls.update();

      const targetDist = controls.target.distanceTo(animTarget.current);
      const posDist = cam.position.distanceTo(animPosition.current);
      const zoomDist = Math.abs(cam.zoom - animZoom.current);
      if (targetDist < 0.02 && posDist < 0.02 && zoomDist < 0.3) {
        animating.current = false;
        controls.target.copy(animTarget.current);
        cam.position.copy(animPosition.current);
        cam.zoom = animZoom.current;
        cam.updateProjectionMatrix();
        controls.update();

        if (pendingResize.current) {
          pendingResize.current = false;
          const resolved = resolveZone(zone, latestSize.current.width, latestSize.current.height);
          applyZone(resolved, false);
        }
      }
      return;
    }

    const preset = CAMERA_ZONES[activeZone.current];
    const panBounds = getPanBounds(preset);
    const t = controls.target;
    const clampedX = MathUtils.clamp(t.x, panBounds.minX, panBounds.maxX);
    const clampedZ = MathUtils.clamp(t.z, panBounds.minZ, panBounds.maxZ);
    if (clampedX !== t.x || clampedZ !== t.z) {
      const dx = clampedX - t.x;
      const dz = clampedZ - t.z;
      t.x = clampedX;
      t.z = clampedZ;
      cam.position.x += dx;
      cam.position.z += dz;
      cam.updateProjectionMatrix();
      controls.update();
    }
  });

  return null;
}
