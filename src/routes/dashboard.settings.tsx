import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  component: () => (
    <div className="mx-auto max-w-3xl space-y-6">
      {[
        { t: "Account", items: ["Email preferences", "Password & security", "Connected accounts", "Delete account"] },
        { t: "Notifications", items: ["Push notifications", "Email alerts", "SMS updates", "Marketing"] },
        { t: "Payments", items: ["Payment methods", "Saved cards", "Payout account", "Tax information"] },
        { t: "Privacy", items: ["Visibility", "Blocked users", "Data export", "Privacy controls"] },
      ].map((s) => (
        <div key={s.t} className="rounded-3xl border border-border bg-card">
          <div className="border-b border-border p-5 font-display text-lg font-semibold">{s.t}</div>
          <ul className="divide-y divide-border">
            {s.items.map((i) => (
              <li key={i} className="flex items-center justify-between p-5 text-sm hover:bg-muted/40">
                <span>{i}</span>
                <span className="text-muted-foreground">›</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ),
});
