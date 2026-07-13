import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type App = {
  id: string;
  user_id: string;
  business_name: string;
  profession: string;
  bio: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  state: string | null;
  city: string | null;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
};

export const Route = createFileRoute("/admin/applications")({
  component: AppsPage,
});

function AppsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("provider_applications").select("*").order("created_at", { ascending: false });
    setApps((data ?? []) as App[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const decide = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("provider_applications").update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Application ${status}`);
    load();
  };

  const filtered = apps.filter((a) => a.status === tab);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["pending", "approved", "rejected"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${tab === t ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
            {t} ({apps.filter((a) => a.status === t).length})
          </button>
        ))}
      </div>
      {loading ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No {tab} applications.</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold">{a.business_name}</h3>
                  <p className="text-sm text-muted-foreground">{a.profession} · {a.years_experience ?? 0} yrs · ₦{Number(a.hourly_rate ?? 0).toLocaleString()}/hr</p>
                  <p className="mt-1 text-xs text-muted-foreground">{[a.city, a.state].filter(Boolean).join(", ")} · {a.phone}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${a.status === "pending" ? "bg-amber-100 text-amber-700" : a.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{a.status}</span>
              </div>
              {a.bio && <p className="mt-4 text-sm">{a.bio}</p>}
              {a.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => decide(a.id, "approved")} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Approve</button>
                  <button onClick={() => decide(a.id, "rejected")} className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
