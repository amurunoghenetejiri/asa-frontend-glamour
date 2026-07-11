import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "../components/site/DashboardShell";
import { CheckCircle2, Star } from "lucide-react";

export const Route = createFileRoute("/provider/")({
  component: () => (
    <div className="space-y-6">
      <div className="rounded-3xl p-8 text-white" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Good morning</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Chinedu 👋</h2>
            <p className="mt-2 text-white/70">You have 3 new job requests today.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-gold"><CheckCircle2 className="h-4 w-4" /> Verified Pro</div>
            <p className="mt-1 text-sm">Trust score: <b>98%</b></p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Earnings (month)" value="₦186,000" delta="+12%" />
        <StatCard label="Jobs completed" value="24" delta="+3" />
        <StatCard label="Rating" value="4.9" />
        <StatCard label="Profile views" value="1,240" delta="+8%" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">New job requests</h3>
          <div className="mt-4 space-y-3">
            {[
              { c: "Adaeze O.", job: "Inverter install · Lekki", amt: "₦18,000" },
              { c: "Bola A.", job: "Wiring inspection · Ikoyi", amt: "₦8,000" },
              { c: "Chike E.", job: "AC & socket repair · VI", amt: "₦12,000" },
            ].map((r) => (
              <div key={r.c} className="flex flex-wrap items-center gap-3 rounded-2xl bg-muted/40 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{r.c}</p>
                  <p className="text-xs text-muted-foreground">{r.job}</p>
                </div>
                <span className="font-semibold text-primary">{r.amt}</span>
                <button className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold">Decline</button>
                <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Accept</button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Recent reviews</h3>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex gap-0.5 text-gold">{[1,2,3,4,5].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-gold" />)}</div>
                <p className="mt-1 text-sm">"Excellent work, punctual and clean."</p>
                <p className="text-xs text-muted-foreground">— Client · 2 days ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
});
