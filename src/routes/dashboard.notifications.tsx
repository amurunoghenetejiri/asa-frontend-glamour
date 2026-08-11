import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

type Notif = {
  id: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
};

function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id, title, body, read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setItems((data as Notif[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Bell className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-display text-xl font-semibold">No notifications</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Updates about bookings, messages, and account activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {items.map((n) => (
        <div
          key={n.id}
          className={`flex gap-4 rounded-2xl border p-5 ${
            n.read ? "border-border bg-card" : "border-primary/30 bg-primary/5"
          }`}
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Bell className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{n.title}</p>
            {n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{formatWhen(n.created_at)}</p>
          </div>
          {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
        </div>
      ))}
    </div>
  );
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString();
}
