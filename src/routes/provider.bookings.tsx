import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/provider/bookings")({
  component: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["All", "New", "Confirmed", "In Progress", "Completed", "Cancelled"].map((t, i) => (
          <button key={t} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/70"}`}>{t}</button>
        ))}
      </div>
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {[
          { c: "Adaeze O.", job: "Inverter installation", date: "Sat 12 Oct · 10:00", amt: "₦18,000", status: "New" },
          { c: "Bola A.", job: "Wiring inspection", date: "Mon 14 Oct · 09:30", amt: "₦8,000", status: "Confirmed" },
          { c: "Chike E.", job: "Repair sockets", date: "Wed 09 Oct · 14:00", amt: "₦12,000", status: "In Progress" },
          { c: "Fatima H.", job: "Ceiling fan install", date: "Fri 04 Oct", amt: "₦6,500", status: "Completed" },
        ].map((b, i) => (
          <div key={i} className={`flex flex-wrap items-center gap-4 p-5 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{b.c}</p>
              <p className="text-xs text-muted-foreground">{b.job} · {b.date}</p>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold">{b.status}</span>
            <span className="font-semibold text-primary">{b.amt}</span>
            <button className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-muted">Manage</button>
          </div>
        ))}
      </div>
    </div>
  ),
});
