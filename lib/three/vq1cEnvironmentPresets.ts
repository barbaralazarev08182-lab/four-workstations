export type Vq1cEnvironmentMode = "clear-day" | "rain-mood" | "vp2-clear-day";

export interface Vq1cEnvironmentPreset {
  label: string;
  backgroundColor: string;
  environmentIntensity: number;
  toneMappingExposure: number;
  hemisphere: { skyColor: string; groundColor: string; intensity: number };
  directional: { color: string; intensity: number; position: [number, number, number]; castShadow: boolean };
  shadow?: { mapSize: number; left: number; right: number; top: number; bottom: number; near: number; far: number; bias: number; normalBias: number };
  fog: { color: string; near: number; far: number } | null;
  deskLamp: { enabled: boolean; color: string; intensity: number; distance: number; angle: number; penumbra: number };
  windowBackdrop: "clear" | "rain";
}

export const VQ1C_ENVIRONMENT_PRESETS: Record<Vq1cEnvironmentMode, Vq1cEnvironmentPreset> = {
  "clear-day": {
    label: "Clear Day", backgroundColor: "#b9cad5", environmentIntensity: 0.42, toneMappingExposure: 1.05,
    hemisphere: { skyColor: "#dce9f0", groundColor: "#80776a", intensity: 1.65 },
    directional: { color: "#fff3dc", intensity: 2.5, position: [3.5, 6.5, 6.0], castShadow: true },
    fog: null,
    deskLamp: { enabled: false, color: "#fff0d4", intensity: 0, distance: 2.2, angle: Math.PI / 5.5, penumbra: 0.72 },
    windowBackdrop: "clear",
  },
  "vp2-clear-day": {
    label: "VP2 Clear Day", backgroundColor: "#b9cad5", environmentIntensity: 0.38, toneMappingExposure: 1.08,
    hemisphere: { skyColor: "#dce9f0", groundColor: "#8d8274", intensity: 0.62 },
    directional: { color: "#fff5e2", intensity: 2.0, position: [6.2, 4.8, 7.5], castShadow: true },
    shadow: {
      mapSize: 2048, left: -9, right: 9, top: 8, bottom: -8,
      near: 0.5, far: 30, bias: -0.0003, normalBias: 0.014,
    },
    fog: null,
    deskLamp: { enabled: false, color: "#fff0d4", intensity: 0, distance: 2.2, angle: Math.PI / 5.5, penumbra: 0.72 },
    windowBackdrop: "clear",
  },
  "rain-mood": {
    label: "Rain Mood", backgroundColor: "#667783", environmentIntensity: 0.24, toneMappingExposure: 0.9,
    hemisphere: { skyColor: "#899da9", groundColor: "#494947", intensity: 1.05 },
    directional: { color: "#c7d4dc", intensity: 0.72, position: [2.5, 6.0, 5.0], castShadow: false },
    fog: { color: "#667783", near: 7.5, far: 18 },
    deskLamp: { enabled: true, color: "#ffe2b0", intensity: 28, distance: 2.2, angle: Math.PI / 5.5, penumbra: 0.72 },
    windowBackdrop: "rain",
  },
};
