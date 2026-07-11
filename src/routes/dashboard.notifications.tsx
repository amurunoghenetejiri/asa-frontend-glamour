import { createFileRoute } from "@tanstack/react-router";
import { Bell, Calendar, MessageSquare, Star } from "lucide-react";

const NOTIFS = [
  { i: Calendar, t: "Booking confirmed", d: "Chinedu Okafor confirmed your Sat 10:00 AM booking.", when: "5 min ago", unread: true },
  { i: MessageSquare, t: "New message", d: "Blessing Adeyemi sent you a message.", when: "1 hr ago", unread: true },
  { i: Star, t: "Rate your provider", d: "How was your service with Ibrahim Musa?", when: "Yesterday" },
  { i: Bell, t: "Special offer", d: "20% off your next cleaning booking.", when: "3 days ago" },
];

export const Route = createFileRoute("/dashboard/notifications")({
  component: () => (
    <div className="mx-auto max-w-2xl space-y-3">
      {NOTIFS.map((n, i) => {
        const Icon = n.i;
        return (
          <div key={i} className={`flex gap-4 rounded-2xl border p-5 ${n.unread ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{n.t}</p>
              <p className="text-sm text-muted-foreground">{n.d}</p>
              <p className="mt-1 text-xs text-muted-foreground">{n.when}</p>
            </div>
            {n.unread && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
          </div>
        );
      })}
    </div>
  ),
});
