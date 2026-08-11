import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/social/media";
import { getBookingsForUser, type LocalBooking } from "@/lib/engagement";

export const Route = createFileRoute("/dashboard/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"All" | "Upcoming" | "Completed" | "Cancelled">("All");
  const [items, setItems] = useState<LocalBooking[]>([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setItems(getBookingsForUser(user.id));
  }, [user]);

  const list = useMemo(() => {
    if (filter === "All") return items;
    if (filter === "Upcoming") return items.filter((b) => b.status === "pending" || b.status === "confirmed");
    if (filter === "Completed") return items.filter((b) => b.status === "completed");
    return items.filter((b) => b.status === "cancelled");
  }, [items, filter]);

  if (!user) {
    return (
      <Empty
        title="Sign in to view bookings"
        description="Log in to book professionals and track your appointments."
        action={
          <Link to="/login" className="btn-primary mt-6 px-6 py-2.5 text-sm">
            Log in
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["All", "Upcoming", "Completed", "Cancelled"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              filter === t ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!list.length ? (
        <Empty
          title="No bookings yet"
          description="When you book a professional, your appointments will show up here."
          action={
            <Link to="/find-professionals" className="btn-primary mt-6 px-6 py-2.5 text-sm">
              Find professionals
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          {list.map((b, i) => (
            <div key={b.id} className={`flex flex-wrap items-center gap-4 p-5 ${i > 0 ? "border-t border-border" : ""}`}>
              <Avatar src={b.provider_avatar} name={b.provider_name} size={48} className="!rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{b.provider_name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {b.profession || "Professional"} · {new Date(b.scheduled_at).toLocaleString()}
                </p>
                {b.address && <p className="truncate text-xs text-muted-foreground">{b.address}</p>}
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                  b.status === "pending" || b.status === "confirmed"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {b.status}
              </span>
              {b.amount != null && (
                <span className="font-semibold text-primary">₦{Number(b.amount).toLocaleString()}</span>
              )}
              <Link
                to="/providers/$id"
                params={{ id: b.provider_id }}
                className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
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
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Calendar className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
