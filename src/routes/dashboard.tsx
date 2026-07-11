import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "../components/site/DashboardShell";
import { LayoutDashboard, Calendar, Bookmark, MessageSquare, Wallet, Bell, Settings, User } from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { to: "/dashboard/saved", label: "Saved", icon: Bookmark },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Asá" }] }),
  component: () => (
    <DashboardShell title="Customer Dashboard" nav={NAV} user={{ name: "Adaeze Okonkwo", role: "Customer", avatar: "https://i.pravatar.cc/100?img=32" }}>
      <Outlet />
    </DashboardShell>
  ),
});
