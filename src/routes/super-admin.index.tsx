import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, ShieldCheck, Shield, LifeBuoy, Layers, Activity, Database, ToggleLeft, ArrowRight, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/super-admin/")({
  component: SuperOverview,
});

type Row = { user_id: string; role: string };

function SuperOverview() {
  const [s, setS] = useState({ users: 0, providers: 0, admins: 0, support: 0, categories: 0, notif: 0 });
  const [recentAdmins, setRecentAdmins] = useState<{ id: string; full_name: string | null; email: string | null; role: string }[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 7 * 864e5).toISOString();
      const [u, roles, cats, notif] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("categories").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("notifications").select("id", { count: "exact", head: true }).gte("created_at", since),
      ]);
      const list = (roles.data as Row[]) ?? [];
      const count = (r: string) => list.filter((x) => x.role === r).length;
      setS({
        users: u.count ?? 0,
        providers: count("provider"),
        admins: count("admin") + count("super_admin"),
        support: count("support_agent"),
        categories: cats.count ?? 0,
        notif: notif.count ?? 0,
      });

      const staffIds = list.filter((r) => ["admin", "super_admin", "support_agent"].includes(r.role)).map((r) => r.user_id);
      if (staffIds.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", staffIds).limit(6);
        setRecentAdmins(
          (profs ?? []).map((p) => ({
            ...p,
            role: list.find((r) => r.user_id === p.id)?.role ?? "admin",
          })),
        );
      }
    })();
  }, []);

  const cards = [
    { label: "Total members", value: s.users, icon: Users, to: "/super-admin/users" },
    { label: "Providers", value: s.providers, icon: ShieldCheck, to: "/super-admin/users" },
    { label: "Admins & Super Admins", value: s.admins, icon: Shield, to: "/super-admin/team" },
    { label: "Support agents", value: s.support, icon: LifeBuoy, to: "/super-admin/team" },
    { label: "Active categories", value: s.categories, icon: Layers, to: "/admin/categories" },
    { label: "Notifications (7d)", value: s.notif, icon: Bell, to: "/dashboard/notifications" },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl p-8 text-white sm:p-10" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Super Admin</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Full system control</h2>
          <p className="mt-2 max-w-xl text-white/75">Complete oversight — roles, security, features, and platform-wide settings.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/super-admin/team" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#3a2b06] hover:brightness-110">
              Manage admin team <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/super-admin/security" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
              Security logs
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card-hover rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-3xl font-bold">{c.value.toLocaleString()}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Admin team</h3>
            <Link to="/super-admin/team" className="text-xs font-medium text-primary hover:underline">Manage</Link>
          </div>
          {recentAdmins.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No admin staff yet. Invite team members from the Admin Team page.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentAdmins.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.full_name || a.email}</p>
                    <p className="text-xs text-muted-foreground">{a.email}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {a.role.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">System</h3>
            <div className="mt-4 space-y-2">
              <Link to="/super-admin/settings" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><ToggleLeft className="h-4 w-4 text-primary" /> Platform settings</span><ArrowRight className="h-4 w-4" /></Link>
              <Link to="/super-admin/features" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><ToggleLeft className="h-4 w-4 text-primary" /> Feature flags</span><ArrowRight className="h-4 w-4" /></Link>
              <Link to="/super-admin/backups" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> Backups</span><ArrowRight className="h-4 w-4" /></Link>
              <Link to="/super-admin/security" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Security logs</span><ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Status</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between"><span>Database</span><span className="font-semibold text-emerald-600">Healthy</span></li>
              <li className="flex justify-between"><span>Authentication</span><span className="font-semibold text-emerald-600">Operational</span></li>
              <li className="flex justify-between"><span>Realtime</span><span className="font-semibold text-emerald-600">Operational</span></li>
              <li className="flex justify-between"><span>Maintenance mode</span><span className="font-semibold text-muted-foreground">Off</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
