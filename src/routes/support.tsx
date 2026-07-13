import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "../components/site/DashboardShell";
import { RequireAuth } from "../components/site/RequireAuth";
import { LayoutDashboard, Users, LifeBuoy, HelpCircle, FileText, AlertTriangle } from "lucide-react";

const NAV = [
  { to: "/support", label: "Overview", icon: LayoutDashboard },
  { to: "/support/users", label: "Users", icon: Users },
  { to: "/support/tickets", label: "Support Tickets", icon: LifeBuoy },
  { to: "/support/faqs", label: "Help Center", icon: HelpCircle },
  { to: "/support/reports", label: "Reports", icon: FileText },
  { to: "/support/disputes", label: "Disputes", icon: AlertTriangle },
];

export const Route = createFileRoute("/support")({
  ssr: false,
  head: () => ({ meta: [{ title: "Support Agent — Asá" }] }),
  component: () => (
    <RequireAuth roles={["support_agent", "admin", "super_admin"]}>
      <DashboardShell title="Support" nav={NAV}>
        <Outlet />
      </DashboardShell>
    </RequireAuth>
  ),
});
