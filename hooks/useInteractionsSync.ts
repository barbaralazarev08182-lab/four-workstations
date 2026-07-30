"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { InteractionRow, Json } from "@/lib/supabase/database.types";
import type {
  CharacterInteractionEffect,
  InteractionEvent,
  InteractionKind,
  InteractionReactionKey,
} from "@/lib/types";

const INTERACTION_KINDS = new Set<InteractionKind>(["poke", "send_coffee", "reaction", "short_message"]);
const REACTION_KEYS = new Set<InteractionReactionKey>(["like", "laugh", "hug", "fish", "cheer"]);
const REACTION_EMOJI: Record<InteractionReactionKey, string> = {
  like: "👍",
  laugh: "😂",
  hug: "🫂",
  fish: "🐟",
  cheer: "🎉",
};
const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000;
const COFFEE_TTL_MS = 5 * 60 * 1000;

interface UseInteractionsSyncOptions {
  officeId: string | null;
  currentUserId: string | null;
  localMode: boolean;
  onEffect: (effect: CharacterInteractionEffect) => void;
  onIncoming: (event: InteractionEvent) => void;
  onError: (message: string) => void;
}

interface SendInteractionInput {
  receiverId: string;
  kind: InteractionKind;
  reaction?: InteractionReactionKey;
  content?: string;
}

function payloadObject(payload: Json): Record<string, Json | undefined> {
  return payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
}

function toInteractionEvent(row: InteractionRow): InteractionEvent | null {
  if (!INTERACTION_KINDS.has(row.interaction_type as InteractionKind)) return null;
  const kind = row.interaction_type as InteractionKind;
  const payload = payloadObject(row.payload);
  const rawReaction = typeof payload.reaction === "string" ? payload.reaction : undefined;
  const reaction = rawReaction && REACTION_KEYS.has(rawReaction as InteractionReactionKey)
    ? rawReaction as InteractionReactionKey
    : undefined;
  const content = typeof payload.content === "string" ? payload.content.slice(0, 60) : undefined;
  if (kind === "reaction" && !reaction) return null;
  if (kind === "short_message" && !content?.trim()) return null;
  return {
    id: row.id,
    officeId: row.office_id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    kind,
    reaction,
    content,
    createdAt: row.created_at,
    readAt: row.read_at,
  };
}

function effectFor(event: InteractionEvent): CharacterInteractionEffect | null {
  if (event.kind === "short_message") return null;
  return {
    id: event.id,
    targetUserId: event.receiverId,
    kind: event.kind,
    emoji: event.kind === "reaction" && event.reaction ? REACTION_EMOJI[event.reaction] : undefined,
  };
}

function mergeRecent(current: InteractionEvent[], incoming: InteractionEvent[]) {
  const merged = new Map(current.map((event) => [event.id, event]));
  incoming.forEach((event) => merged.set(event.id, event));
  return [...merged.values()]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, 30);
}

export function useInteractionsSync({ officeId, currentUserId, localMode, onEffect, onIncoming, onError }: UseInteractionsSyncOptions) {
  const [events, setEvents] = useState<InteractionEvent[]>([]);
  const [claimedCoffeeIds, setClaimedCoffeeIds] = useState<Set<string>>(() => new Set());
  const [clockNow, setClockNow] = useState(() => Date.now());
  const callbacksRef = useRef({ onEffect, onIncoming, onError });
  const seenIdsRef = useRef(new Set<string>());
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    callbacksRef.current = { onEffect, onIncoming, onError };
  }, [onEffect, onIncoming, onError]);

  const consume = useCallback((rows: InteractionRow[], playEffects: boolean) => {
    const accepted: InteractionEvent[] = [];
    rows
      .toSorted((left, right) => Date.parse(left.created_at) - Date.parse(right.created_at))
      .forEach((row) => {
        if (seenIdsRef.current.has(row.id)) return;
        const event = toInteractionEvent(row);
        if (!event) return;
        seenIdsRef.current.add(event.id);
        accepted.push(event);
        if (!playEffects) return;
        const effect = effectFor(event);
        if (effect) callbacksRef.current.onEffect(effect);
        callbacksRef.current.onIncoming(event);
      });
    if (accepted.length) setEvents((current) => mergeRecent(current, accepted));
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const seenIds = seenIdsRef.current;
    if (!supabase || !officeId || !currentUserId || localMode) {
      seenIds.clear();
      const resetTimer = window.setTimeout(() => setEvents([]), 0);
      return () => window.clearTimeout(resetTimer);
    }

    let disposed = false;
    let subscribedOnce = false;

    const fetchRecent = async (playEffects: boolean) => {
      const cutoff = new Date(Date.now() - RECENT_WINDOW_MS).toISOString();
      const { data, error } = await supabase
        .from("interactions")
        .select("id,office_id,sender_id,receiver_id,interaction_type,payload,created_at,read_at")
        .eq("office_id", officeId)
        .gte("created_at", cutoff)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      if (disposed) return;
      consume((data ?? []) as InteractionRow[], playEffects);
    };

    const start = async () => {
      await fetchRecent(false);
      if (disposed) return;
      const channel = supabase
        .channel(`interactions:${officeId}:${crypto.randomUUID()}`)
        .on<InteractionRow>(
          "postgres_changes",
          { event: "*", schema: "public", table: "interactions", filter: `office_id=eq.${officeId}` },
          (payload: RealtimePostgresChangesPayload<InteractionRow>) => {
            const row = payload.new as InteractionRow;
            if (!row?.id || row.office_id !== officeId) return;
            if (payload.eventType === "UPDATE") {
              const updated = toInteractionEvent(row);
              if (updated) setEvents((current) => current.map((event) => event.id === updated.id ? updated : event));
              return;
            }
            consume([row], true);
            if (row.receiver_id === currentUserId && row.interaction_type !== "send_coffee") {
              void supabase.rpc("mark_interaction_read", { p_interaction_id: row.id });
            }
          },
        )
        .subscribe((status) => {
          if (disposed) return;
          if (status === "SUBSCRIBED") {
            const isReconnect = subscribedOnce;
            subscribedOnce = true;
            void fetchRecent(isReconnect).catch((error: unknown) => {
              callbacksRef.current.onError(error instanceof Error ? error.message : "互动重连失败");
            });
          }
        });
      channelRef.current = channel;
    };

    void start().catch((error: unknown) => {
      callbacksRef.current.onError(error instanceof Error ? error.message : "互动同步失败");
    });

    return () => {
      disposed = true;
      const channel = channelRef.current;
      channelRef.current = null;
      if (channel) void supabase.removeChannel(channel);
      seenIds.clear();
    };
  }, [consume, currentUserId, localMode, officeId]);

  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const sendInteraction = useCallback(async ({ receiverId, kind, reaction, content }: SendInteractionInput) => {
    const trimmedContent = content?.trim() ?? "";
    if (receiverId === currentUserId) return { ok: false, error: "不能给自己发送互动" };
    if (kind === "short_message" && (!trimmedContent || trimmedContent.length > 60)) {
      return { ok: false, error: trimmedContent ? "留言最多60个字符" : "留言不能为空" };
    }
    if (kind === "reaction" && !reaction) return { ok: false, error: "请选择一个表情" };

    if (localMode) {
      const event: InteractionEvent = {
        id: `local-interaction-${crypto.randomUUID()}`,
        officeId: "local-office",
        senderId: currentUserId ?? "ming",
        receiverId,
        kind,
        reaction,
        content: trimmedContent || undefined,
        createdAt: new Date().toISOString(),
        readAt: null,
      };
      seenIdsRef.current.add(event.id);
      setEvents((current) => mergeRecent(current, [event]));
      const effect = effectFor(event);
      if (effect) callbacksRef.current.onEffect(effect);
      callbacksRef.current.onIncoming(event);
      return { ok: true, error: null };
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase || !officeId || !currentUserId) return { ok: false, error: "实时连接尚未就绪" };
    const payload: Json = kind === "reaction"
      ? { reaction }
      : kind === "short_message"
        ? { content: trimmedContent }
        : {};
    const { data, error } = await supabase.rpc("send_interaction", {
      p_office_id: officeId,
      p_receiver_id: receiverId,
      p_interaction_type: kind,
      p_payload: payload,
    });
    if (error) return { ok: false, error: error.message };
    consume((data ?? []) as InteractionRow[], true);
    return { ok: true, error: null };
  }, [consume, currentUserId, localMode, officeId]);

  const claimCoffee = useCallback(async (interactionId: string) => {
    setClaimedCoffeeIds((current) => new Set(current).add(interactionId));
    if (localMode) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.rpc("mark_interaction_read", { p_interaction_id: interactionId });
    if (error) callbacksRef.current.onError(error.message);
  }, [localMode]);

  const coffeeGifts = useMemo(() => events.filter((event) => (
    event.kind === "send_coffee"
    && !event.readAt
    && !claimedCoffeeIds.has(event.id)
    && clockNow - Date.parse(event.createdAt) < COFFEE_TTL_MS
  )), [claimedCoffeeIds, clockNow, events]);

  return { events, coffeeGifts, sendInteraction, claimCoffee };
}
