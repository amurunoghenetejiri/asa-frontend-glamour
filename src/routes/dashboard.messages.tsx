import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/social/media";
import {
  getConversationsForUser,
  getMessages,
  sendMessage,
  type LocalConversation,
  type LocalMessage,
} from "@/lib/engagement";

export const Route = createFileRoute("/dashboard/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { user, profile } = useAuth();
  const [convos, setConvos] = useState<LocalConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<LocalMessage[]>([]);
  const [draft, setDraft] = useState("");

  const refresh = () => {
    if (!user) {
      setConvos([]);
      return;
    }
    const list = getConversationsForUser(user.id);
    setConvos(list);
    setActiveId((prev) => prev || list[0]?.id || null);
  };

  useEffect(() => {
    refresh();
    // pick conversation from URL ?c=
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("c");
      if (c) setActiveId(c);
    }
  }, [user]);

  useEffect(() => {
    if (!activeId) {
      setMsgs([]);
      return;
    }
    setMsgs(getMessages(activeId));
  }, [activeId, convos]);

  const active = useMemo(() => convos.find((c) => c.id === activeId) ?? null, [convos, activeId]);

  const otherName = active
    ? user?.id === active.customer_id
      ? active.provider_name
      : active.customer_name
    : "";
  const otherAvatar = active
    ? user?.id === active.customer_id
      ? active.provider_avatar
      : active.customer_avatar
    : null;
  const recipientId = active
    ? user?.id === active.customer_id
      ? active.provider_id
      : active.customer_id
    : null;

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !active || !recipientId || !draft.trim()) return;
    sendMessage({
      conversation_id: active.id,
      sender_id: user.id,
      recipient_id: recipientId,
      body: draft,
      sender_name: profile?.full_name || user.email || "You",
    });
    setDraft("");
    setMsgs(getMessages(active.id));
    setConvos(getConversationsForUser(user.id));
    toast.success("Message sent");
  };

  if (!user) {
    return (
      <Empty
        title="Sign in to view messages"
        description="Log in to start conversations with providers."
        action={
          <Link to="/login" className="btn-primary mt-6 px-6 py-2.5 text-sm">
            Log in
          </Link>
        }
      />
    );
  }

  if (!convos.length) {
    return (
      <Empty
        title="No messages yet"
        description="When you message a provider, the conversation will show up here."
        action={
          <Link to="/find-professionals" className="btn-primary mt-6 px-6 py-2.5 text-sm">
            Find professionals
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid h-[calc(100vh-11rem)] overflow-hidden rounded-3xl border border-border bg-card sm:grid-cols-[280px_1fr]">
      <aside className="border-r border-border">
        <div className="p-4 text-sm font-semibold">Conversations</div>
        <div className="divide-y divide-border overflow-y-auto">
          {convos.map((c) => {
            const name = user.id === c.customer_id ? c.provider_name : c.customer_name;
            const avatar = user.id === c.customer_id ? c.provider_avatar : c.customer_avatar;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center gap-3 p-3 text-left hover:bg-muted ${activeId === c.id ? "bg-muted" : ""}`}
              >
                <Avatar src={avatar} name={name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.last_message || "No messages yet"}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex min-h-0 flex-col">
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar src={otherAvatar} name={otherName} size={40} />
              <div>
                <p className="text-sm font-semibold">{otherName}</p>
                <p className="text-xs text-muted-foreground">Asá chat</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      m.sender_id === user.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {m.body}
                  </p>
                </div>
              ))}
              {!msgs.length && (
                <p className="py-8 text-center text-sm text-muted-foreground">Say hello to start the chat.</p>
              )}
            </div>
            <form onSubmit={onSend} className="flex gap-2 border-t border-border p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message"
                className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="grid flex-1 place-items-center text-sm text-muted-foreground">Select a conversation</div>
        )}
      </div>
    </div>
  );
}

function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border bg-card px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <MessageSquare className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
