import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/provider/settings")({
  component: () => (
    <div className="mx-auto max-w-3xl space-y-6">
      {[
        { t: "Business profile", items: ["Business name", "Categories & skills", "Service area", "Pricing"] },
        { t: "Verification", items: ["ID verification", "Skill certificates", "Insurance documents", "References"] },
        { t: "Payouts", items: ["Bank account", "Payout schedule", "Tax information"] },
        { t: "Account", items: ["Password & security", "Notifications", "Delete account"] },
      ].map((s) => (
        <div key={s.t} className="rounded-3xl border border-border bg-card">
          <div className="border-b border-border p-5 font-display text-lg font-semibold">{s.t}</div>
          <ul className="divide-y divide-border">
            {s.items.map((i) => (
              <li key={i} className="flex items-center justify-between p-5 text-sm hover:bg-muted/40">
                <span>{i}</span><span className="text-muted-foreground">›</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ),
});
