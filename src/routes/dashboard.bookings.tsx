import { createFileRoute } from "@tanstack/react-router";
import { PROVIDERS } from "../lib/data";

const BOOKINGS = [
  { id: 1, provider: PROVIDERS[0], status: "Upcoming", date: "Sat, 12 Oct · 10:00 AM", amount: "₦8,000" },
  { id: 2, provider: PROVIDERS[3], status: "Upcoming", date: "Tue, 15 Oct · 09:00 AM", amount: "₦15,000" },
  { id: 3, provider: PROVIDERS[2], status: "Completed", date: "Mon, 30 Sep", amount: "₦12,000" },
  { id: 4, provider: PROVIDERS[1], status: "Completed", date: "Fri, 20 Sep", amount: "₦25,000" },
];

export const Route = createFileRoute("/dashboard/bookings")({
  component: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["All", "Upcoming", "Completed", "Cancelled"].map((t, i) => (
          <button key={t} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/70"}`}>{t}</button>
        ))}
      </div>
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {BOOKINGS.map((b, i) => (
          <div key={b.id} className={`flex flex-wrap items-center gap-4 p-5 ${i > 0 ? "border-t border-border" : ""}`}>
            <img src={b.provider.avatar} className="h-12 w-12 rounded-xl object-cover" alt="" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{b.provider.name}</p>
              <p className="truncate text-xs text-muted-foreground">{b.provider.profession} · {b.date}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${b.status === "Upcoming" ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>{b.status}</span>
            <span className="font-semibold text-primary">{b.amount}</span>
            <button className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-muted">Details</button>
          </div>
        ))}
      </div>
    </div>
  ),
});
