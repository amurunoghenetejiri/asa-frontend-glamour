import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatCard } from "../components/site/DashboardShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/super-admin/")({
  component: () => {
    const [s, setS] = useState({ users: 0, admins: 0, support: 0, providers: 0 });
    useEffect(() => {
      (async () => {
        const [u, a, sup, p] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "admin"),
          supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "support_agent"),
          supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "provider"),
        ]);
        setS({ users: u.count ?? 0, admins: a.count ?? 0, support: sup.count ?? 0, providers: p.count ?? 0 });
      })();
    }, []);
    return (
      <div className="space-y-6">
        <div className="rounded-3xl p-8 text-white" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Super Admin</p>
          <h2 className="mt-2 font-display text-3xl font-bold">System Control</h2>
          <p className="mt-2 text-white/70">Full oversight of Asá — roles, security, and platform settings.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" value={String(s.users)} />
          <StatCard label="Providers" value={String(s.providers)} />
          <StatCard label="Admins" value={String(s.admins)} />
          <StatCard label="Support agents" value={String(s.support)} />
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">System status</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between"><span>Database</span><span className="font-semibold text-emerald-600">Healthy</span></li>
            <li className="flex justify-between"><span>Authentication</span><span className="font-semibold text-emerald-600">Operational</span></li>
            <li className="flex justify-between"><span>Maintenance mode</span><span className="font-semibold text-muted-foreground">Off</span></li>
          </ul>
        </div>
      </div>
    );
  },
});
