import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

export type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

export function DashboardShell({
  title,
  nav,
  children,
  user,
}: {
  title: string;
  nav: NavItem[];
  children: ReactNode;
  user: { name: string; role: string; avatar: string };
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-card lg:sticky lg:top-0 lg:block lg:h-screen">
          <div className="flex h-full flex-col">
            <Link to="/" className="border-b border-border p-6 font-display text-2xl font-bold gold-gradient">Asá</Link>
            <nav className="flex-1 space-y-1 p-4">
              {nav.map((n) => {
                const active = pathname === n.to || (n.to !== "/dashboard" && n.to !== "/provider" && pathname.startsWith(n.to));
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/75 hover:bg-muted"}`}
                  >
                    <Icon className="h-4 w-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <Link to="/" className="mt-2 block text-center text-xs text-muted-foreground hover:text-primary">Logout</Link>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold sm:text-xl">{title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input placeholder="Search" className="h-10 w-56 rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background hover:bg-muted"><Bell className="h-4 w-4" /></button>
                <img src={user.avatar} className="h-10 w-10 rounded-full object-cover lg:hidden" alt="" />
              </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto border-t border-border px-2 py-2 lg:hidden">
              {nav.map((n) => {
                const active = pathname === n.to;
                const Icon = n.icon;
                return (
                  <Link key={n.to} to={n.to} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/75"}`}>
                    <Icon className="h-3.5 w-3.5" /> {n.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {delta && <p className="mt-1 text-xs text-emerald-600">{delta}</p>}
    </div>
  );
}
