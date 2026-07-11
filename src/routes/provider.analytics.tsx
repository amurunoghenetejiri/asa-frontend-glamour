import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "../components/site/DashboardShell";

export const Route = createFileRoute("/provider/analytics")({
  component: () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Profile views" value="1,240" delta="+8%" />
        <StatCard label="Requests" value="42" delta="+15%" />
        <StatCard label="Conversion" value="68%" />
        <StatCard label="Repeat clients" value="12" />
      </div>
      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Earnings — last 6 months</h3>
        <div className="flex h-52 items-end gap-3">
          {[42, 68, 55, 72, 90, 100].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-xl bg-primary/80 transition hover:bg-primary" style={{ height: `${h}%` }} />
              <span className="text-xs text-muted-foreground">{["May","Jun","Jul","Aug","Sep","Oct"][i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Top services</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {[["Inverter installation", "42%"], ["Wiring repair", "28%"], ["Smart home setup", "18%"], ["Fault-finding", "12%"]].map(([s, v]) => (
              <li key={s} className="flex items-center justify-between rounded-xl bg-muted/40 p-3"><span>{s}</span><b>{v}</b></li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Traffic sources</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {[["Search", "54%"], ["Category browse", "22%"], ["Recommendations", "14%"], ["Direct", "10%"]].map(([s, v]) => (
              <li key={s} className="flex items-center justify-between rounded-xl bg-muted/40 p-3"><span>{s}</span><b>{v}</b></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ),
});
