"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy, CrownSimple, DoorOpen, SpinnerGap, Trash, UsersThree, X } from "@phosphor-icons/react";
import { Avatar } from "@/components/Avatar";
import { useDialogFocus } from "@/components/hud/useDialogFocus";
import type { MyOfficeInfo, OfficeManagementAction } from "@/hooks/useOfficeManagement";
import { ACTIVE_STATUSES, getStatusLabel } from "@/lib/status";
import type { OfficeUser } from "@/lib/types";

interface ActionResult {
  ok: boolean;
  error: string | null;
}

interface RoomInfoPanelProps {
  open: boolean;
  info: MyOfficeInfo | null;
  users: OfficeUser[];
  loading: boolean;
  busyAction: OfficeManagementAction | null;
  errorMessage: string | null;
  onClose: () => void;
  onRefresh: () => Promise<MyOfficeInfo | null>;
  onLeave: () => Promise<ActionResult>;
  onDelete: () => Promise<ActionResult>;
  onTransfer: (newOwnerId: string) => Promise<ActionResult>;
  onNotice: (message: string) => void;
}

type Confirmation = { type: "leave" } | { type: "delete" } | { type: "transfer"; user: OfficeUser };

const DESK_LABELS: Record<string, string> = {
  desk_1: "左上工位",
  desk_2: "右上工位",
  desk_3: "左下工位",
  desk_4: "右下工位",
};

export function RoomInfoPanelView({ open, info, users, loading, busyAction, errorMessage, onClose, onRefresh, onLeave, onDelete, onTransfer, onNotice }: RoomInfoPanelProps) {
  const inviteInputRef = useRef<HTMLInputElement>(null);
  const [copyFallback, setCopyFallback] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const dialogRef = useDialogFocus(open, onClose, { suspended: confirmation !== null });
  const confirmationRef = useDialogFocus(confirmation !== null, () => setConfirmation(null));
  const members = useMemo(() => users
    .filter((user) => !user.isPlaceholder)
    .toSorted((left, right) => (left.deskKey ?? "").localeCompare(right.deskKey ?? "")), [users]);
  const isOwner = info?.currentUserRole === "owner";
  const canDelete = Boolean(isOwner && info?.memberCount === 1);
  const mustTransfer = Boolean(isOwner && (info?.memberCount ?? 0) > 1);

  const copyInviteCode = async () => {
    if (!info) return;
    setCopyFallback(false);
    try {
      await navigator.clipboard.writeText(info.inviteCode);
      onNotice("房间码已复制");
    } catch {
      inviteInputRef.current?.focus();
      inviteInputRef.current?.select();
      setCopyFallback(true);
      onNotice("请手动复制房间码");
    }
  };

  const confirmAction = async () => {
    if (!confirmation || busyAction) return;
    const confirmationAction = confirmation;
    const result = confirmationAction.type === "leave"
      ? await onLeave()
      : confirmationAction.type === "delete"
        ? await onDelete()
        : await onTransfer(confirmationAction.user.id);
    if (!result.ok) return;
    if (confirmationAction.type === "transfer") {
      setConfirmation(null);
      onNotice(`已将房主转让给${confirmationAction.user.name}`);
      await onRefresh();
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button className="panel-scrim" type="button" aria-label="关闭房间信息" onClick={() => { if (!confirmation) onClose(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            ref={(node) => { dialogRef.current = node as HTMLDivElement | null; }}
            className="room-info-panel"
            initial={{ x: 28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 28, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 27 }}
            role="dialog"
            aria-modal="true"
            aria-label="房间信息与成员管理"
            aria-busy={loading}
          >
            <header className="room-info-header">
              <span><UsersThree size={21} weight="duotone" /></span>
              <div><small>共享工位</small><h2>{info?.officeName ?? "房间信息"}</h2></div>
              <button type="button" onClick={onClose} aria-label="关闭"><X size={20} /></button>
            </header>

            {loading && !info ? (
              <div className="room-info-loading"><SpinnerGap size={24} className="is-spinning" /><span>正在读取房间信息…</span></div>
            ) : info ? (
              <div className="room-info-content">
                <section className="room-code-section">
                  <div><span>房间码</span><small>用于邀请朋友加入当前共享工位</small></div>
                  <div className="room-code-copy">
                    <input ref={inviteInputRef} value={info.inviteCode} readOnly aria-label="房间码" onFocus={(event) => event.currentTarget.select()} />
                    <button type="button" onClick={() => void copyInviteCode()} data-testid="copy-room-code"><Copy size={17} />复制</button>
                  </div>
                  {copyFallback ? <p role="status">复制功能不可用，房间码已选中，请按 Ctrl+C 手动复制。</p> : null}
                </section>

                <dl className="room-facts">
                  <div><dt>当前成员</dt><dd>{info.memberCount} / 4</dd></div>
                  <div><dt>我的工位</dt><dd>{DESK_LABELS[info.currentUserDeskKey] ?? info.currentUserDeskKey}</dd></div>
                  <div><dt>我的身份</dt><dd>{isOwner ? "房主" : "成员"}</dd></div>
                </dl>

                <section className="room-member-section">
                  <header><span>成员列表</span><small>{members.length} 位朋友</small></header>
                  <div className="room-member-list">
                    {members.map((member) => {
                      const online = ACTIVE_STATUSES.has(member.status);
                      const memberIsOwner = member.id === info.ownerId;
                      return (
                        <article key={member.id}>
                          <Avatar user={member} />
                          <div><strong>{member.name}{member.isCurrentUser ? "（我）" : ""}</strong><small>{DESK_LABELS[member.deskKey ?? ""] ?? member.deskKey}</small></div>
                          <span className={online ? "is-online" : "is-offline"}><i />{online ? getStatusLabel(member.status) : "离线"}</span>
                          {memberIsOwner ? <CrownSimple size={15} weight="fill" aria-label="房主" /> : null}
                        </article>
                      );
                    })}
                  </div>
                </section>

                {mustTransfer ? (
                  <section className="ownership-transfer-section">
                    <div><CrownSimple size={18} weight="duotone" /><span><strong>请先将房主转让给其他成员</strong><small>转让后，你可以正常退出当前房间。</small></span></div>
                    <div>
                      {members.filter((member) => !member.isCurrentUser).map((member) => (
                        <button key={member.id} type="button" disabled={Boolean(busyAction)} onClick={() => setConfirmation({ type: "transfer", user: member })}>
                          <Avatar user={member} /><span>转让给 {member.name}</span><ArrowRight size={14} />
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}

                {errorMessage ? <p className="room-management-error" role="alert">{errorMessage}</p> : null}

                <footer className="room-management-footer">
                  {canDelete ? (
                    <button className="is-danger" type="button" disabled={Boolean(busyAction)} onClick={() => setConfirmation({ type: "delete" })}>
                      <Trash size={17} />解散房间
                    </button>
                  ) : !isOwner ? (
                    <button type="button" disabled={Boolean(busyAction)} onClick={() => setConfirmation({ type: "leave" })}>
                      <DoorOpen size={17} />退出房间
                    </button>
                  ) : (
                    <span>完成房主转让后即可退出房间</span>
                  )}
                </footer>
              </div>
            ) : (
              <div className="room-info-loading"><span>{errorMessage ?? "暂时无法读取房间信息"}</span><button type="button" onClick={() => void onRefresh()}>重新加载</button></div>
            )}

            <AnimatePresence>
              {confirmation ? (
                <motion.div className="room-confirmation-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.div
                    ref={(node) => { confirmationRef.current = node as HTMLDivElement | null; }}
                    className={`room-confirmation ${confirmation.type === "delete" ? "is-danger" : ""}`}
                    initial={{ y: 10, scale: 0.97 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 8, scale: 0.98 }}
                    role="alertdialog"
                    aria-modal="true"
                    aria-label={confirmation.type === "delete" ? "确认解散房间" : confirmation.type === "transfer" ? "确认转让房主" : "确认退出房间"}
                  >
                    <span>{confirmation.type === "delete" ? <Trash size={22} /> : confirmation.type === "transfer" ? <CrownSimple size={22} /> : <DoorOpen size={22} />}</span>
                    <h3>{confirmation.type === "delete" ? "确定解散这个房间吗？" : confirmation.type === "transfer" ? `将房主转让给${confirmation.user.name}？` : "确定退出这个共享工位吗？"}</h3>
                    <p>{confirmation.type === "delete"
                      ? "解散后，当前房间将无法继续使用。你的账号和个人资料会保留。"
                      : confirmation.type === "transfer"
                        ? "转让完成后，你会变为普通成员，新房主将负责这个共享工位。"
                        : "退出后你将暂时无法查看房间内的状态和互动，但账号与个人资料会保留。"}</p>
                    <div>
                      <button type="button" disabled={Boolean(busyAction)} onClick={() => setConfirmation(null)}>取消</button>
                      <button className="is-danger" type="button" disabled={Boolean(busyAction)} onClick={() => void confirmAction()} data-testid={`confirm-${confirmation.type}`}>
                        {busyAction ? <><SpinnerGap className="is-spinning" />处理中</> : <><Check />{confirmation.type === "delete" ? "确认解散" : confirmation.type === "transfer" ? "确认转让" : "确认退出"}</>}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export const RoomInfoPanel = RoomInfoPanelView;
