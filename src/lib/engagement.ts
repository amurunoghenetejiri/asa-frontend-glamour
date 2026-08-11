import { supabase } from "@/integrations/supabase/client";

export type LocalBooking = {
  id: string;
  provider_id: string;
  provider_name: string;
  provider_avatar: string | null;
  profession: string | null;
  customer_id: string;
  scheduled_at: string;
  address: string;
  notes: string;
  amount: number | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

export type LocalMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type LocalConversation = {
  id: string;
  provider_id: string;
  customer_id: string;
  provider_name: string;
  provider_avatar: string | null;
  customer_name: string;
  customer_avatar: string | null;
  last_message: string;
  updated_at: string;
};

const BOOKINGS_KEY = "asa_bookings";
const CONVOS_KEY = "asa_conversations";
const MSGS_KEY = "asa_messages";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return crypto.randomUUID();
}

export function getBookingsForUser(userId: string): LocalBooking[] {
  return readJson<LocalBooking[]>(BOOKINGS_KEY, []).filter(
    (b) => b.customer_id === userId || b.provider_id === userId,
  );
}

export function createBooking(input: {
  provider_id: string;
  provider_name: string;
  provider_avatar: string | null;
  profession: string | null;
  customer_id: string;
  customer_name: string;
  scheduled_at: string;
  address: string;
  notes: string;
  amount: number | null;
}): LocalBooking {
  const booking: LocalBooking = {
    id: uid(),
    provider_id: input.provider_id,
    provider_name: input.provider_name,
    provider_avatar: input.provider_avatar,
    profession: input.profession,
    customer_id: input.customer_id,
    scheduled_at: input.scheduled_at,
    address: input.address,
    notes: input.notes,
    amount: input.amount,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  const all = readJson<LocalBooking[]>(BOOKINGS_KEY, []);
  all.unshift(booking);
  writeJson(BOOKINGS_KEY, all);

  void supabase.from("notifications").insert({
    user_id: input.provider_id,
    type: "booking",
    title: "New booking request",
    body: `${input.customer_name} requested a booking for ${new Date(input.scheduled_at).toLocaleString()}.`,
    link: "/provider/bookings",
    metadata: { booking_id: booking.id, customer_id: input.customer_id },
  });

  return booking;
}

export function getConversationsForUser(userId: string): LocalConversation[] {
  return readJson<LocalConversation[]>(CONVOS_KEY, [])
    .filter((c) => c.customer_id === userId || c.provider_id === userId)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function getMessages(conversationId: string): LocalMessage[] {
  return readJson<LocalMessage[]>(MSGS_KEY, [])
    .filter((m) => m.conversation_id === conversationId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function getOrCreateConversation(input: {
  provider_id: string;
  customer_id: string;
  provider_name: string;
  provider_avatar: string | null;
  customer_name: string;
  customer_avatar: string | null;
}): LocalConversation {
  const all = readJson<LocalConversation[]>(CONVOS_KEY, []);
  const existing = all.find(
    (c) =>
      (c.provider_id === input.provider_id && c.customer_id === input.customer_id) ||
      (c.provider_id === input.customer_id && c.customer_id === input.provider_id),
  );
  if (existing) return existing;

  const convo: LocalConversation = {
    id: uid(),
    provider_id: input.provider_id,
    customer_id: input.customer_id,
    provider_name: input.provider_name,
    provider_avatar: input.provider_avatar,
    customer_name: input.customer_name,
    customer_avatar: input.customer_avatar,
    last_message: "",
    updated_at: new Date().toISOString(),
  };
  all.unshift(convo);
  writeJson(CONVOS_KEY, all);
  return convo;
}

export function sendMessage(input: {
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  sender_name: string;
}): LocalMessage {
  const msg: LocalMessage = {
    id: uid(),
    conversation_id: input.conversation_id,
    sender_id: input.sender_id,
    body: input.body.trim(),
    created_at: new Date().toISOString(),
  };
  const msgs = readJson<LocalMessage[]>(MSGS_KEY, []);
  msgs.push(msg);
  writeJson(MSGS_KEY, msgs);

  const convos = readJson<LocalConversation[]>(CONVOS_KEY, []);
  const idx = convos.findIndex((c) => c.id === input.conversation_id);
  if (idx >= 0) {
    convos[idx] = {
      ...convos[idx],
      last_message: msg.body,
      updated_at: msg.created_at,
    };
    writeJson(CONVOS_KEY, convos);
  }

  void supabase.from("notifications").insert({
    user_id: input.recipient_id,
    type: "message",
    title: "New message",
    body: `${input.sender_name}: ${msg.body.slice(0, 120)}`,
    link: "/dashboard/messages",
    metadata: { conversation_id: input.conversation_id, sender_id: input.sender_id },
  });

  return msg;
}
