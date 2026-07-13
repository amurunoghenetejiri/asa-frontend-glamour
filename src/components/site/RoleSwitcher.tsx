import { useAuth, type AppRole } from "@/hooks/use-auth";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const LABELS: Record<AppRole, string> = {
  customer: "Customer Mode",
  provider: "Provider Mode",
  admin: "Admin",
  super_admin: "Super Admin",
  support_agent: "Support Agent",
};

const ROUTES: Record<AppRole, string> = {
  customer: "/dashboard",
  provider: "/provider",
  admin: "/admin",
  super_admin: "/super-admin",
  support_agent: "/support",
};

export function RoleSwitcher() {
  const { roles, activeMode, setActiveMode } = useAuth();
  const [open, setOpen] = useState(false);
  if (roles.length <= 1) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
        {LABELS[activeMode]}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="border-b border-border px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">Switch mode</div>
          {roles.map((r) => (
            <Link
              key={r}
              to={ROUTES[r]}
              onClick={() => { setActiveMode(r); setOpen(false); }}
              className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted"
            >
              <span>{LABELS[r]}</span>
              {activeMode === r && <Check className="h-4 w-4 text-primary" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
