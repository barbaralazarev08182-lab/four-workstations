"use client";

import { useEffect, useState } from "react";
import { getSafeArea, type SafeAreaInsets } from "@/components/office-3d/scene-config";

function readViewport(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1280, height: 800 };
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useHudSafeArea(): SafeAreaInsets {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    const onResize = () => setViewport(readViewport());
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const safeArea = getSafeArea(viewport.width, viewport.height);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--hud-safe-top", `${safeArea.top}px`);
    root.style.setProperty("--hud-safe-bottom", `${safeArea.bottom}px`);
    root.style.setProperty("--hud-safe-left", `${safeArea.left}px`);
    root.style.setProperty("--hud-safe-right", `${safeArea.right}px`);
  }, [safeArea]);

  return safeArea;
}
