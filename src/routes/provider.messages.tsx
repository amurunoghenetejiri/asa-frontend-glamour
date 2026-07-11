import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";

export const Route = createFileRoute("/provider/messages")({
  component: () => (
    <div className="grid h-[calc(100vh-11rem)] gap-4 overflow-hidden rounded-3xl border border-border bg-card sm:grid-cols-[280px_1fr]">
      <aside className="border-r border-border">
        <div className="p-4 text-sm font-semibold">Clients</div>
        <div className="divide-y divide-border">
          {["Adaeze O.", "Bola A.", "Chike E.", "Fatima H."].map((n, i) => (
            <button key={n} className={`flex w-full items-center gap-3 p-3 text-left hover:bg-muted ${i === 0 ? "bg-muted" : ""}`}>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary">{n[0]}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{n}</p>
                <p className="truncate text-xs text-muted-foreground">Thanks, see you Saturday.</p>
              </div>
            </button>
          ))}
        </div>
      </aside>
      <div className="flex flex-col">
        <div className="border-b border-border p-4 text-sm font-semibold">Adaeze O.</div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
          <p className="max-w-[75%] rounded-2xl bg-muted px-4 py-2">Are you available on Saturday?</p>
          <p className="ml-auto max-w-[75%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground">Yes ma, 10 AM works.</p>
          <p className="max-w-[75%] rounded-2xl bg-muted px-4 py-2">Perfect. Confirmed.</p>
        </div>
        <div className="flex gap-2 border-t border-border p-3">
          <input placeholder="Reply..." className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <button className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  ),
});
