import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "../components/site/DashboardShell";
import { RequireAuth } from "../components/site/RequireAuth";
import { LayoutDashboard, Users, ClipboardCheck, Layers, FileText, Megaphone, BarChart3 } from "lucide-react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/applications", label: "Provider Applications", icon: ClipboardCheck },
  { to: "/admin/categories", label: "Categories", icon: Layers },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Asá" }] }),
  component: () => (
    <RequireAuth roles={["admin", "super_admin"]}>
      <DashboardShell title="Admin Panel" nav={NAV}>
        <Outlet />
      </DashboardShell>
    </RequireAuth>
  ),
});
