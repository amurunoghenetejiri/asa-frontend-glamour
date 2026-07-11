import { createFileRoute } from "@tanstack/react-router";
import { PROVIDERS } from "../lib/data";
import { Send } from "lucide-react";

export const Route = createFileRoute("/dashboard/messages")({
  component: () => (
    <div className="grid h-[calc(100vh-11rem)] gap-4 overflow-hidden rounded-3xl border border-border bg-card sm:grid-cols-[280px_1fr]">
      <aside className="border-r border-border">
        <div className="p-4 text-sm font-semibold">Conversations</div>
        <div className="divide-y divide-border">
          {PROVIDERS.slice(0, 5).map((p, i) => (
            <button key={p.id} className={`flex w-full items-center gap-3 p-3 text-left hover:bg-muted ${i === 0 ? "bg-muted" : ""}`}>
              <img src={p.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">On my way, madam.</p>
              </div>
              <span className="text-[10px] text-muted-foreground">2m</span>
            </button>
          ))}
        </div>
      </aside>
      <div className="flex flex-col">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <img src={PROVIDERS[0].avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
          <div>
            <p className="text-sm font-semibold">{PROVIDERS[0].name}</p>
            <p className="text-xs text-emerald-600">Online</p>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
          <Bubble mine>Good morning, are you available tomorrow?</Bubble>
          <Bubble>Yes ma. What time works?</Bubble>
          <Bubble mine>10 AM at Lekki Phase 1.</Bubble>
          <Bubble>Noted. I'll confirm shortly.</Bubble>
        </div>
        <div className="flex gap-2 border-t border-border p-3">
          <input placeholder="Type a message" className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <button className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  ),
});

function Bubble({ children, mine }: { children: React.ReactNode; mine?: boolean }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <p className={`max-w-[75%] rounded-2xl px-4 py-2 ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{children}</p>
    </div>
  );
}
