import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Loader2, MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  createBooking,
  getOrCreateConversation,
  sendMessage,
} from "@/lib/engagement";

export type HireTarget = {
  id: string;
  name: string;
  avatar_url: string | null;
  profession: string | null;
  hourly_rate?: number | null;
};

function requireAuth(navigate: ReturnType<typeof useNavigate>, user: unknown) {
  if (user) return true;
  toast.error("Please log in to continue");
  navigate({ to: "/login", search: { redirect: typeof window !== "undefined" ? window.location.pathname : "/" } as never });
  return false;
}

export function HireNowButton({
  provider,
  className = "btn-primary w-full px-4 py-2.5 text-sm",
  label = "Hire Now",
}: {
  provider: HireTarget;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && <BookingModal provider={provider} onClose={() => setOpen(false)} />}
    </>
  );
}

export function BookNowButton({
  provider,
  className,
  children,
}: {
  provider: HireTarget;
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children ?? (
          <>
            <Calendar className="h-4 w-4" /> Book now
          </>
        )}
      </button>
      {open && <BookingModal provider={provider} onClose={() => setOpen(false)} />}
    </>
  );
}

export function MessageButton({
  provider,
  className,
  children,
}: {
  provider: HireTarget;
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children ?? (
          <>
            <MessageCircle className="h-4 w-4" /> Message
          </>
        )}
      </button>
      {open && <MessageModal provider={provider} onClose={() => setOpen(false)} />}
    </>
  );
}

function BookingModal({ provider, onClose }: { provider: HireTarget; onClose: () => void }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [address, setAddress] = useState(profile?.address || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth(navigate, user) || !user) return;
    if (user.id === provider.id) {
      toast.error("You cannot book yourself");
      return;
    }
    if (!date) {
      toast.error("Choose a date");
      return;
    }
    setLoading(true);
    try {
      const scheduled = new Date(`${date}T${time || "10:00"}`);
      createBooking({
        provider_id: provider.id,
        provider_name: provider.name,
        provider_avatar: provider.avatar_url,
        profession: provider.profession,
        customer_id: user.id,
        customer_name: profile?.full_name || user.email || "Customer",
        scheduled_at: scheduled.toISOString(),
        address: address.trim(),
        notes: notes.trim(),
        amount: provider.hourly_rate ?? null,
      });
      toast.success("Booking request sent");
      onClose();
      navigate({ to: "/dashboard/bookings" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title={`Book ${provider.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {provider.profession || "Professional"}
          {provider.hourly_rate != null
            ? ` · ₦${Number(provider.hourly_rate).toLocaleString()}/hr`
            : ""}
        </p>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</span>
          <input
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Time</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Service location</span>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address or area"
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Notes</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe what you need…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
          Confirm booking request
        </button>
      </form>
    </ModalShell>
  );
}

function MessageModal({ provider, onClose }: { provider: HireTarget; onClose: () => void }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth(navigate, user) || !user) return;
    if (user.id === provider.id) {
      toast.error("You cannot message yourself");
      return;
    }
    if (!body.trim()) {
      toast.error("Write a message");
      return;
    }
    setLoading(true);
    try {
      const convo = getOrCreateConversation({
        provider_id: provider.id,
        customer_id: user.id,
        provider_name: provider.name,
        provider_avatar: provider.avatar_url,
        customer_name: profile?.full_name || user.email || "Customer",
        customer_avatar: profile?.avatar_url ?? null,
      });
      sendMessage({
        conversation_id: convo.id,
        sender_id: user.id,
        recipient_id: provider.id,
        body: body.trim(),
        sender_name: profile?.full_name || user.email || "Customer",
      });
      toast.success("Message sent");
      onClose();
      navigate({ to: "/dashboard/messages", search: { c: convo.id } as never });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title={`Message ${provider.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-muted-foreground">{provider.profession || "Professional"}</p>
        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Hi, I’d like to hire you for…"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send message
        </button>
      </form>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center">
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-lift">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
