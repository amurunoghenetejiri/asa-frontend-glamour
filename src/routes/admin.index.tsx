import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, ShieldCheck, ClipboardCheck, UserX, Layers, Megaphone, BarChart3, Bell, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type Activity = { id: string; kind: string; label: string; time: string; link?: string };

function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, providers: 0, pending: 0, suspended: 0, categories: 0, notifications: 0 });
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 7 * 864e5).toISOString();
      const [u, pr, pa, su, cats, notif, recentUsers, recentApps] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "provider"),
        supabase.from("provider_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "suspended"),
        supabase.from("categories").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("notifications").select("id", { count: "exact", head: true }).gte("created_at", since),
        supabase.from("profiles").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("provider_applications").select("id, profession, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        users: u.count ?? 0, providers: pr.count ?? 0, pending: pa.count ?? 0,
        suspended: su.count ?? 0, categories: cats.count ?? 0, notifications: notif.count ?? 0,
      });
      const acts: Activity[] = [
        ...(recentUsers.data ?? []).map((r: { id: string; full_name: string | null; email: string | null; created_at: string }) => ({
          id: "u_" + r.id, kind: "user", label: `${r.full_name || r.email || "New user"} joined Asá`,
          time: r.created_at, link: "/admin/users",
        })),
        ...(recentApps.data ?? []).map((r: { id: string; profession: string; status: string; created_at: string }) => ({
          id: "a_" + r.id, kind: "application", label: `Provider application (${r.profession}) — ${r.status}`,
          time: r.created_at, link: "/admin/applications",
        })),
      ].sort((a, b) => (a.time > b.time ? -1 : 1)).slice(0, 8);
      setActivity(acts);
    })();
  }, []);

  const cards = [
    { label: "Total members", value: stats.users, icon: Users, tone: "primary", to: "/admin/users" },
    { label: "Verified providers", value: stats.providers, icon: ShieldCheck, tone: "emerald", to: "/admin/users" },
    { label: "Pending applications", value: stats.pending, icon: ClipboardCheck, tone: "gold", to: "/admin/applications" },
    { label: "Suspended", value: stats.suspended, icon: UserX, tone: "red", to: "/admin/users" },
    { label: "Active categories", value: stats.categories, icon: Layers, tone: "primary", to: "/admin/categories" },
    { label: "Notifications (7d)", value: stats.notifications, icon: Bell, tone: "primary", to: "/dashboard/notifications" },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl p-8 text-white sm:p-10" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Admin</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Platform overview</h2>
          <p className="mt-2 max-w-xl text-white/75">Monitor growth, review applications, and keep Asá safe and thriving.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admin/applications" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#3a2b06] hover:brightness-110">
              Review applications <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/admin/users" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
              Manage users
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card-hover group rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-3xl font-bold">{c.value.toLocaleString()}</p>
              </div>
              <span className={`grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary`}>
                <c.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-xs text-primary opacity-0 transition group-hover:opacity-100">Open →</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Recent activity</h3>
            <Link to="/admin/users" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          {activity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No activity yet. New users and applications will appear here.</p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.time).toLocaleString()}</p>
                  </div>
                  {a.link && <Link to={a.link} className="shrink-0 text-xs font-medium text-primary hover:underline">Open</Link>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Quick actions</h3>
            <div className="mt-4 space-y-2">
              <Link to="/admin/categories" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Manage categories</span><ArrowRight className="h-4 w-4" /></Link>
              <Link to="/admin/announcements" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><Megaphone className="h-4 w-4 text-primary" /> Send announcement</span><ArrowRight className="h-4 w-4" /></Link>
              <Link to="/admin/reports" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> View reports</span><ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">System health</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between"><span>Database</span><span className="font-semibold text-emerald-600">Operational</span></li>
              <li className="flex justify-between"><span>Authentication</span><span className="font-semibold text-emerald-600">Operational</span></li>
              <li className="flex justify-between"><span>Storage</span><span className="font-semibold text-emerald-600">Operational</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
