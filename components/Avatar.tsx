import Image from "next/image";
import type { OfficeUser } from "@/lib/types";

export function Avatar({ user, className = "" }: { user: OfficeUser; className?: string }) {
  return (
    <span className={`avatar-art ${className}`}>
      <Image src={user.avatarUrl} alt={`${user.name}的头像`} fill sizes="64px" />
    </span>
  );
}
