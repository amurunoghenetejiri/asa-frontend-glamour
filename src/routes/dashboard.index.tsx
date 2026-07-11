import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "../components/site/DashboardShell";
import { PROVIDERS } from "../lib/data";
import { Calendar, Star } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: () => (
    <div className="space-y-6">
      <div className="rounded-3xl p-8 text-white" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Welcome back</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Adaeze 👋</h2>
        <p className="mt-2 max-w-md text-white/70">Your next booking is confirmed for Saturday at 10:00 AM.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active bookings" value="2" delta="+1 this week" />
        <StatCard label="Completed" value="18" />
        <StatCard label="Saved providers" value="7" />
        <StatCard label="Wallet balance" value="₦24,500" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Upcoming bookings</h3>
          <div className="mt-4 space-y-3">
            {PROVIDERS.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                <img src={p.avatar} className="h-11 w-11 rounded-xl object-cover" alt="" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.profession}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" />Sat 10:00</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Recommended for you</h3>
          <div className="mt-4 space-y-3">
            {PROVIDERS.slice(3, 6).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                <img src={p.avatar} className="h-11 w-11 rounded-xl object-cover" alt="" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.profession}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold"><Star className="h-3.5 w-3.5 fill-gold text-gold" />{p.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
});
