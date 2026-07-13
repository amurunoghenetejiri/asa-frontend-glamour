import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "../components/site/DashboardShell";
import { RequireAuth } from "../components/site/RequireAuth";
import { LayoutDashboard, Image, Calendar, Clock, Wallet, BarChart3, MessageSquare, Settings } from "lucide-react";

const NAV = [
  { to: "/provider", label: "Dashboard", icon: LayoutDashboard },
  { to: "/provider/portfolio", label: "Portfolio", icon: Image },
  { to: "/provider/bookings", label: "Bookings", icon: Calendar },
  { to: "/provider/availability", label: "Availability", icon: Clock },
  { to: "/provider/wallet", label: "Wallet", icon: Wallet },
  { to: "/provider/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/provider/messages", label: "Messages", icon: MessageSquare },
  { to: "/provider/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/provider")({
  ssr: false,
  head: () => ({ meta: [{ title: "Provider Dashboard — Asá" }] }),
  component: () => (
    <RequireAuth roles={["provider", "admin", "super_admin"]}>
      <DashboardShell title="Provider Dashboard" nav={NAV}>
        <Outlet />
      </DashboardShell>
    </RequireAuth>
  ),
});
