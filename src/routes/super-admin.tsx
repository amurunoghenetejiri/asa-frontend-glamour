import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "../components/site/DashboardShell";
import { RequireAuth } from "../components/site/RequireAuth";
import { LayoutDashboard, Users, ClipboardCheck, Shield, Settings, Activity, ToggleLeft, Database } from "lucide-react";

const NAV = [
  { to: "/super-admin", label: "Overview", icon: LayoutDashboard },
  { to: "/super-admin/users", label: "Users & Roles", icon: Users },
  { to: "/super-admin/applications", label: "Applications", icon: ClipboardCheck },
  { to: "/super-admin/team", label: "Admin Team", icon: Shield },
  { to: "/super-admin/settings", label: "Platform Settings", icon: Settings },
  { to: "/super-admin/features", label: "Feature Toggles", icon: ToggleLeft },
  { to: "/super-admin/security", label: "Security Logs", icon: Activity },
  { to: "/super-admin/backups", label: "Backups", icon: Database },
];

export const Route = createFileRoute("/super-admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Super Admin — Asá" }] }),
  component: () => (
    <RequireAuth roles={["super_admin"]}>
      <DashboardShell title="Super Admin" nav={NAV}>
        <Outlet />
      </DashboardShell>
    </RequireAuth>
  ),
});
