export type Vq1cEnvironmentMode = "clear-day" | "rain-mood";

export interface Vq1cEnvironmentPreset {
  label: string;
  backgroundColor: string;
  environmentIntensity: number;
  toneMappingExposure: number;
  hemisphere: { skyColor: string; groundColor: string; intensity: number };
  directional: {
    color: string;
    intensity: number;
    position: [number, number, number];
    castShadow: boolean;
  };
  fog: { color: string; near: number; far: number } | null;
  deskLamp: {
    enabled: boolean;
    color: string;
    intensity: number;
    distance: number;
    angle: number;
    penumbra: number;
  };
  windowBackdrop: "clear" | "rain";
}

export const VQ1C_ENVIRONMENT_PRESETS: Record<Vq1cEnvironmentMode, Vq1cEnvironmentPreset> = {
  "clear-day": {
    label: "Clear Day",
    backgroundColor: "#b9cad5",
    environmentIntensity: 0.42,
    toneMappingExposure: 1.05,
    hemisphere: { skyColor: "#dce9f0", groundColor: "#80776a", intensity: 1.65 },
    directional: { color: "#fff3dc", intensity: 2.5, position: [3.5, 6.5, 6.0], castShadow: true },
    fog: null,
    deskLamp: {
      enabled: false,
      color: "#fff0d4",
      intensity: 0,
      distance: 2.2,
      angle: Math.PI / 5.5,
      penumbra: 0.72,
    },
    windowBackdrop: "clear",
  },
  "rain-mood": {
    label: "Rain Mood",
    backgroundColor: "#667783",
    environmentIntensity: 0.24,
    toneMappingExposure: 0.9,
    hemisphere: { skyColor: "#899da9", groundColor: "#494947", intensity: 1.05 },
    directional: { color: "#c7d4dc", intensity: 0.72, position: [2.5, 6.0, 5.0], castShadow: false },
    fog: { color: "#667783", near: 7.5, far: 18 },
    deskLamp: {
      enabled: true,
      color: "#ffe2b0",
      intensity: 28,
      distance: 2.2,
      angle: Math.PI / 5.5,
      penumbra: 0.72,
    },
    windowBackdrop: "rain",
  },
};
