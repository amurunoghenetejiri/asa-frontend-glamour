import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LifeBuoy, HelpCircle, AlertTriangle, FileText, ArrowRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/support/")({
  component: SupportOverview,
});

function SupportOverview() {
  const [stats, setStats] = useState({ users: 0, providers: 0, pending: 0 });

  useEffect(() => {
    (async () => {
      const [u, pr, pa] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "provider"),
        supabase.from("provider_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({ users: u.count ?? 0, providers: pr.count ?? 0, pending: pa.count ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Open tickets", value: 0, icon: LifeBuoy, tone: "Support system coming online" },
    { label: "Avg. response", value: "—", icon: HelpCircle, tone: "Target: < 2 hours" },
    { label: "Resolved (7d)", value: 0, icon: FileText, tone: "This week" },
    { label: "Active disputes", value: 0, icon: AlertTriangle, tone: "Requires attention" },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl p-8 text-white sm:p-10" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Support</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Help our users win.</h2>
          <p className="mt-2 max-w-xl text-white/75">Respond to tickets, manage the Help Center, and mediate disputes fairly.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/support/tickets" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#3a2b06] hover:brightness-110">
              Open ticket queue <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/support/faqs" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
              Manage Help Center
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-3xl font-bold">{c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.tone}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><LifeBuoy className="h-6 w-6" /></div>
          <h3 className="mt-4 font-display text-xl font-semibold">Ticket queue is empty</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            No open support tickets right now. New requests from users will land here in real time.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Platform snapshot</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Total users</span><span className="font-semibold">{stats.users.toLocaleString()}</span></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Providers</span><span className="font-semibold">{stats.providers.toLocaleString()}</span></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /> Pending applications</span><span className="font-semibold">{stats.pending.toLocaleString()}</span></li>
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Quick actions</h3>
            <div className="mt-4 space-y-2">
              <Link to="/support/users" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Look up user</span><ArrowRight className="h-4 w-4" /></Link>
              <Link to="/support/disputes" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /> Handle disputes</span><ArrowRight className="h-4 w-4" /></Link>
              <Link to="/support/reports" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> View reports</span><ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
