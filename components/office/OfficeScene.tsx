"use client";

import dynamic from "next/dynamic";
import type { CharacterInteractionEffect, InteractionEvent, ObjectKind, OfficeUser } from "@/lib/types";
import type { OfficeDataMode } from "@/hooks/useCurrentStatusSync";

const OfficeWebGLScene = dynamic(
  () => import("@/components/office-3d/OfficeWebGLScene").then((module) => module.OfficeWebGLScene),
  {
    ssr: false,
    loading: () => (
      <div className="office-webgl-loading" role="status">
        <span className="office-webgl-loading-orbit" aria-hidden="true" />
        <strong>正在布置 3D 工位</strong>
        <small>准备灯光与四人办公室…</small>
      </div>
    ),
  },
);

interface OfficeSceneProps {
  users: OfficeUser[];
  isNight: boolean;
  hydrated: boolean;
  dataMode: OfficeDataMode;
  interactionEffects: Record<string, CharacterInteractionEffect>;
  coffeeGifts: InteractionEvent[];
  onClaimCoffee: (interactionId: string) => void;
  onCharacterClick: (user: OfficeUser) => void;
  onObjectClick: (kind: ObjectKind, ownerId?: string) => void;
}

export function OfficeScene(props: OfficeSceneProps) {
  return (
    <section className={`office-viewport office-webgl-viewport ${props.isNight ? "is-night" : "is-day"}`} aria-label="四人共享 3D 办公室场景">
      {props.hydrated ? <OfficeWebGLScene {...props} /> : (
        <div className="office-webgl-loading" role="status">
          <span className="office-webgl-loading-orbit" aria-hidden="true" />
          <strong>正在恢复大家的位置</strong>
          <small>同步本地工位状态…</small>
        </div>
      )}
    </section>
  );
}
