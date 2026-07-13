import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/find-professionals", label: "Find Professionals" },
  { to: "/become-a-provider", label: "Become a Provider" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

const DASH_ROUTE: Record<string, string> = {
  super_admin: "/super-admin", admin: "/admin", support_agent: "/support", provider: "/provider", customer: "/dashboard",
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, activeMode, signOut } = useAuth();
  const navigate = useNavigate();
  const dashTo = DASH_ROUTE[activeMode] ?? "/dashboard";
  const initials = (profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight gold-gradient">Asá</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((i) => (
            <Link key={i.to} to={i.to} className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: i.to === "/" }}>
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen((s) => !s)} className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 pr-4 text-sm font-medium hover:bg-muted">
                {profile?.avatar_url ? <img src={profile.avatar_url} className="h-7 w-7 rounded-full object-cover" alt="" /> : <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{initials}</div>}
                <span className="max-w-[120px] truncate">{profile?.full_name?.split(" ")[0] || user.email?.split("@")[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                  <Link to={dashTo} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                  <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted"><UserIcon className="h-4 w-4" /> Profile</Link>
                  <button onClick={handleSignOut} className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-left text-sm text-red-600 hover:bg-muted"><LogOut className="h-4 w-4" /> Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-foreground/80 hover:text-primary">Login</Link>
              <Link to="/signup" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">Sign Up</Link>
            </>
          )}
        </div>
        <button className="lg:hidden" onClick={() => setOpen((s) => !s)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {NAV.map((i) => (
              <Link key={i.to} to={i.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">{i.label}</Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Link to={dashTo} onClick={() => setOpen(false)} className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">Dashboard</Link>
                  <button onClick={handleSignOut} className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-medium">Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-medium">Login</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { Search };
