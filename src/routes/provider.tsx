import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "../components/site/DashboardShell";
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
  head: () => ({ meta: [{ title: "Provider Dashboard — Asá" }] }),
  component: () => (
    <DashboardShell title="Provider Dashboard" nav={NAV} user={{ name: "Chinedu Okafor", role: "Master Electrician", avatar: "https://i.pravatar.cc/100?img=12" }}>
      <Outlet />
    </DashboardShell>
  ),
});
