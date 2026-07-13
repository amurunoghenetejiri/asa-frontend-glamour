import { createFileRoute } from "@tanstack/react-router";
import { StatCard, EmptyState } from "../components/site/DashboardShell";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/provider/")({
  component: () => {
    const { profile, user } = useAuth();
    const name = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Pro";
    return (
      <div className="space-y-6">
        <div className="rounded-3xl p-8 text-white" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold">Welcome</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Hi {name} 👋</h2>
              <p className="mt-2 text-white/70">Your provider workspace is ready. Complete your profile to start receiving jobs.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-gold"><CheckCircle2 className="h-4 w-4" /> Verified Pro</div>
              <p className="mt-1 text-sm">Ready to earn</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Earnings (month)" value="₦0" />
          <StatCard label="Jobs completed" value="0" />
          <StatCard label="Rating" value="—" />
          <StatCard label="Profile views" value="0" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <EmptyState title="No job requests yet" description="Requests from nearby customers will show up here in real time." />
          <EmptyState title="No reviews yet" description="Reviews you receive from customers will appear here." />
        </div>
      </div>
    );
  },
});
