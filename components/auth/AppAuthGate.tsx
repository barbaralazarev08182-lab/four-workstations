"use client";

import dynamic from "next/dynamic";
import { AuthPage } from "@/components/auth/AuthPage";
import { AuthStatusScreen } from "@/components/auth/AuthStatusScreen";
import { OfficeAccessGate } from "@/components/auth/OfficeAccessGate";
import { ProfileSetup } from "@/components/auth/ProfileSetup";
import { useAuthSession } from "@/hooks/useAuthSession";

const LocalOfficeApp = dynamic(
  () => import("@/components/OfficeApp").then((module) => module.OfficeApp),
  { ssr: false },
);

export function AppAuthGate() {
  const auth = useAuthSession();

  if (!auth.configured || auth.stage === "local") {
    return <LocalOfficeApp />;
  }
  if (auth.stage === "loading") return <AuthStatusScreen title="正在连接共享工位" description="正在恢复你的登录状态…" />;
  if (auth.stage === "error") {
    return <AuthStatusScreen title="连接没有成功" description={auth.errorMessage ?? "请稍后重试"} actionLabel="重新连接" onAction={auth.retry} />;
  }
  if (auth.stage === "signedOut") return <AuthPage onSignIn={auth.signIn} onSignUp={auth.signUp} />;
  if (auth.stage === "profileSetup" && auth.user) {
    return <ProfileSetup email={auth.user.email ?? ""} initialProfile={auth.profile} onSubmit={auth.completeProfile} onSignOut={auth.signOut} />;
  }

  if (!auth.user || !auth.profile) {
    return <AuthStatusScreen title="正在连接共享工位" description="正在恢复你的个人资料…" />;
  }

  return <OfficeAccessGate userId={auth.user.id} nickname={auth.profile.nickname} onSignOut={auth.signOut} />;
}
