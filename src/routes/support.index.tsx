import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "../components/site/DashboardShell";

export const Route = createFileRoute("/support/")({
  component: () => (
    <div className="space-y-6">
      <div className="rounded-3xl p-8 text-white" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Support</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Help our users win.</h2>
        <p className="mt-2 text-white/70">Respond to tickets, manage the Help Center, and monitor disputes.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open tickets" value="0" />
        <StatCard label="Avg. response" value="—" />
        <StatCard label="Resolved (7d)" value="0" />
        <StatCard label="CSAT" value="—" />
      </div>
      <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No tickets yet — the queue will populate as users reach out.</p>
      </div>
    </div>
  ),
});
