import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatCard, EmptyState } from "../components/site/DashboardShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/")({
  component: CustomerHome,
});

function CustomerHome() {
  const { profile, user, roles } = useAuth();
  const isProvider = roles.includes("provider");
  const [appStatus, setAppStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user || isProvider) return;
    supabase.from("provider_applications").select("status").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setAppStatus(data?.status ?? null));
  }, [user, isProvider]);

  const name = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-8 text-white" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Welcome</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Hi {name} 👋</h2>
        <p className="mt-2 max-w-md text-white/70">Your Asá dashboard is ready. Explore trusted professionals near you.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/find-professionals" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary">Find a professional</Link>
          {!isProvider && (
            <Link to="/become-a-provider/apply" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold">
              {appStatus === "pending" ? "Application pending" : appStatus === "rejected" ? "Re-apply as Provider" : "Become a Provider"}
            </Link>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active bookings" value="0" />
        <StatCard label="Completed" value="0" />
        <StatCard label="Saved providers" value="0" />
        <StatCard label="Wallet balance" value="₦0" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <EmptyState title="No upcoming bookings" description="Book a verified professional and your appointments will appear here." action={<Link to="/find-professionals" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Browse professionals</Link>} />
        <EmptyState title="No saved providers" description="Save your favorite professionals to book them quickly next time." />
      </div>
    </div>
  );
}
