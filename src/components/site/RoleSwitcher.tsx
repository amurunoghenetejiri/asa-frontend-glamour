import { useAuth, type AppRole } from "@/hooks/use-auth";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  if (roles.length <= 1) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold outline-none hover:bg-muted data-[state=open]:bg-muted"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          {LABELS[activeMode]}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-2xl border border-border bg-card p-0 shadow-xl">
        <DropdownMenuLabel className="border-b border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Switch mode
        </DropdownMenuLabel>
        {roles.map((r) => (
          <DropdownMenuItem key={r} asChild className="cursor-pointer rounded-none px-4 py-2.5 text-sm focus:bg-muted">
            <Link
              to={ROUTES[r]}
              onClick={() => setActiveMode(r)}
              className="flex items-center justify-between"
            >
              <span>{LABELS[r]}</span>
              {activeMode === r && <Check className="h-4 w-4 text-primary" />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
