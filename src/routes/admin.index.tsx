import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatCard } from "../components/site/DashboardShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, providers: 0, pending: 0, suspended: 0 });

  useEffect(() => {
    (async () => {
      const [u, pr, pa, su] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "provider"),
        supabase.from("provider_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "suspended"),
      ]);
      setStats({ users: u.count ?? 0, providers: pr.count ?? 0, pending: pa.count ?? 0, suspended: su.count ?? 0 });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-8 text-white" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Admin</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Platform Overview</h2>
        <p className="mt-2 text-white/70">Manage users, applications, and marketplace content.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={String(stats.users)} />
        <StatCard label="Active providers" value={String(stats.providers)} />
        <StatCard label="Pending applications" value={String(stats.pending)} />
        <StatCard label="Suspended accounts" value={String(stats.suspended)} />
      </div>
      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Recent activity</h3>
        <p className="mt-2 text-sm text-muted-foreground">Activity logs will appear here as users interact with the platform.</p>
      </div>
    </div>
  );
}
