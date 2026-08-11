import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Menu, X, Search, LogOut, LayoutDashboard, User as UserIcon, Home, Users, LayoutGrid,
  Newspaper, MessageSquare, Wallet, Bell, Settings, Info, HelpCircle, BadgeCheck, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { GlobalSearchButton } from "./GlobalSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/find-professionals", label: "Providers", icon: Users },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/feed", label: "Feed", icon: Newspaper },
  { to: "/directory", label: "Directory", icon: Users },
] as const;

const MORE = [
  { to: "/become-a-provider", label: "Become a Provider", icon: BadgeCheck },
  { to: "/how-it-works", label: "How It Works", icon: Info },
  { to: "/about", label: "About Asá", icon: Info },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
  { to: "/contact", label: "Contact", icon: MessageSquare },
] as const;

const ACCOUNT = [
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

const DASH_ROUTE: Record<string, string> = {
  super_admin: "/super-admin", admin: "/admin", support_agent: "/support", provider: "/provider", customer: "/dashboard",
};

export function Navbar() {
  const [drawer, setDrawer] = useState(false);
  const { user, profile, activeMode, signOut } = useAuth();
  const navigate = useNavigate();
  const dashTo = DASH_ROUTE[activeMode] ?? "/dashboard";
  const initials = (profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);

  const handleSignOut = async () => {
    await signOut();
    setDrawer(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-primary">Asá</span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-1 lg:flex">
          {NAV.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
              activeProps={{ className: "bg-primary-soft text-primary" }}
              activeOptions={{ exact: i.to === "/" }}
            >
              {i.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 outline-none transition-colors hover:bg-muted hover:text-primary data-[state=open]:bg-muted data-[state=open]:text-primary"
              >
                More <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={8} className="w-60 rounded-2xl border border-border bg-popover p-1.5 shadow-lift">
              {MORE.map((m) => (
                <DropdownMenuItem key={m.to} asChild className="cursor-pointer rounded-xl px-3 py-2.5 text-sm focus:bg-muted">
                  <Link to={m.to} className="flex items-center gap-2.5">
                    <m.icon className="h-4 w-4 text-primary" /> {m.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <GlobalSearchButton />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 pr-4 text-sm font-medium outline-none transition hover:bg-muted data-[state=open]:bg-muted"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="h-7 w-7 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{initials}</div>
                  )}
                  <span className="max-w-[120px] truncate">{profile?.full_name?.split(" ")[0] || user.email?.split("@")[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-2xl border border-border bg-popover p-1.5 shadow-lift">
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5 text-sm focus:bg-muted">
                  <Link to={dashTo as never} className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                {ACCOUNT.map((a) => (
                  <DropdownMenuItem key={a.to} asChild className="cursor-pointer rounded-xl px-3 py-2.5 text-sm focus:bg-muted">
                    <Link to={a.to} className="flex items-center gap-2.5">
                      <a.icon className="h-4 w-4 text-primary" /> {a.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    void handleSignOut();
                  }}
                  className="cursor-pointer rounded-xl px-3 py-2.5 text-sm text-destructive focus:bg-muted focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="btn-ghost px-5 py-2 text-sm">Login</Link>
              <Link to="/signup" className="btn-primary px-5 py-2 text-sm">Register</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <GlobalSearchButton variant="icon" />
          <button onClick={() => setDrawer(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-xl transition hover:bg-muted">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Right slide-out drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${drawer ? "" : "pointer-events-none"}`} aria-hidden={!drawer}>
        <div
          onClick={() => setDrawer(false)}
          className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${drawer ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-[380px] flex-col border-l border-border bg-card shadow-lift transition-transform duration-300 ease-out sm:w-[45%] md:w-[32%] ${drawer ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="font-display text-xl font-bold text-primary">Asá</span>
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-xl hover:bg-muted"><X className="h-5 w-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {user && (
              <Link to="/dashboard/profile" onClick={() => setDrawer(false)} className="mb-4 flex items-center gap-3 rounded-2xl bg-muted p-3">
                {profile?.avatar_url ? <img src={profile.avatar_url} className="h-11 w-11 shrink-0 rounded-full object-cover" alt="" /> : <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{initials}</div>}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{profile?.full_name || user.email}</p>
                  <p className="truncate text-xs text-muted-foreground">View profile</p>
                </div>
              </Link>
            )}

            <DrawerGroup label="Browse">
              {NAV.map((i) => <DrawerLink key={i.to} to={i.to} label={i.label} Icon={i.icon} onClick={() => setDrawer(false)} />)}
            </DrawerGroup>

            {user && (
              <DrawerGroup label="Account">
                <DrawerLink to={dashTo} label="Dashboard" Icon={LayoutDashboard} onClick={() => setDrawer(false)} />
                {ACCOUNT.map((a) => <DrawerLink key={a.to} to={a.to} label={a.label} Icon={a.icon} onClick={() => setDrawer(false)} />)}
              </DrawerGroup>
            )}

            <DrawerGroup label="Explore">
              {MORE.map((m) => <DrawerLink key={m.to} to={m.to} label={m.label} Icon={m.icon} onClick={() => setDrawer(false)} />)}
            </DrawerGroup>
          </div>

          <div className="border-t border-border p-4">
            {user ? (
              <button onClick={handleSignOut} className="btn-ghost w-full px-4 py-3 text-sm text-destructive"><LogOut className="h-4 w-4" /> Log out</button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setDrawer(false)} className="btn-ghost px-4 py-3 text-sm">Login</Link>
                <Link to="/signup" onClick={() => setDrawer(false)} className="btn-primary px-4 py-3 text-sm">Register</Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}

function DrawerGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function DrawerLink({ to, label, Icon, onClick }: { to: string; label: string; Icon: typeof Home; onClick: () => void }) {
  return (
    <Link
      to={to as never}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
      activeProps={{ className: "bg-primary-soft text-primary" }}
      activeOptions={{ exact: to === "/" }}
    >
      <Icon className="h-4.5 w-4.5 shrink-0 text-primary" /> {label}
    </Link>
  );
}

export { Search };
