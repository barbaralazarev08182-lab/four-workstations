"use client";

import dynamic from "next/dynamic";
import { AuthStatusScreen } from "@/components/auth/AuthStatusScreen";
import { OfficeOnboarding } from "@/components/auth/OfficeOnboarding";
import { useOfficeMembership } from "@/hooks/useOfficeMembership";
import type { AuthResult } from "@/hooks/useAuthSession";

const OfficeApp = dynamic(
  () => import("@/components/OfficeApp").then((module) => module.OfficeApp),
  {
    ssr: false,
    loading: () => <AuthStatusScreen title="正在准备办公室" description="正在摆好四张工位…" />,
  },
);

interface OfficeAccessGateProps {
  userId: string;
  nickname: string;
  onSignOut: () => Promise<AuthResult>;
}

export function OfficeAccessGate({ userId, nickname, onSignOut }: OfficeAccessGateProps) {
  const office = useOfficeMembership(userId);

  if (office.stage === "checking") {
    return <AuthStatusScreen title="正在检查办公室归属" description="看看你的工位是不是已经准备好了…" />;
  }
  if (office.stage === "error") {
    return <AuthStatusScreen title="暂时连不上共享工位" description={office.errorMessage ?? "数据库暂时不可用"} actionLabel="重新检查" onAction={office.refresh} />;
  }
  if (office.stage === "none") {
    return <OfficeOnboarding nickname={nickname} onJoined={office.acceptMembership} onSignOut={onSignOut} />;
  }

  return <OfficeApp onSignOut={onSignOut} onMembershipChanged={office.refresh} />;
}
