import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/dashboard/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["All", "Upcoming", "Completed", "Cancelled"].map((t, i) => (
          <button
            key={t}
            type="button"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              i === 0 ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Calendar className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-display text-xl font-semibold">No bookings yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          When you book a professional, your appointments will show up here.
        </p>
        <Link to="/find-professionals" className="btn-primary mt-6 px-6 py-2.5 text-sm">
          Find professionals
        </Link>
      </div>
    </div>
  );
}
