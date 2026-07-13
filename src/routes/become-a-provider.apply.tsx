import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RequireAuth } from "../components/site/RequireAuth";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/become-a-provider/apply")({
  ssr: false,
  head: () => ({ meta: [{ title: "Apply as a Provider — Asá" }] }),
  component: () => (
    <RequireAuth>
      <ApplyPage />
    </RequireAuth>
  ),
});

function ApplyPage() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const [existing, setExisting] = useState<{ status: string; admin_notes: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: "", profession: "", bio: "", years_experience: "", hourly_rate: "",
    state: "", city: "", address: "", phone: "", government_id_url: "", portfolio_urls: "", availability: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("provider_applications").select("status, admin_notes").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { setExisting(data as { status: string; admin_notes: string | null } | null); setLoading(false); });
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      business_name: form.business_name,
      profession: form.profession,
      bio: form.bio,
      years_experience: form.years_experience ? Number(form.years_experience) : null,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      state: form.state, city: form.city, address: form.address, phone: form.phone,
      government_id_url: form.government_id_url,
      portfolio_urls: form.portfolio_urls ? form.portfolio_urls.split(",").map((s) => s.trim()).filter(Boolean) : [],
      availability: form.availability ? { note: form.availability } : null,
      status: "pending" as const,
    };
    const { error } = await supabase.from("provider_applications").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Application submitted! We'll review within 24 hours.");
    navigate({ to: "/dashboard" });
  };

  if (loading) return <div className="grid min-h-screen place-items-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  if (roles.includes("provider")) {
    return (
      <StatusScreen icon={<CheckCircle2 className="h-8 w-8" />} title="You're already an approved Provider" desc="Head to your provider dashboard to manage your portfolio and bookings.">
        <Link to="/provider" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Go to Provider Dashboard</Link>
      </StatusScreen>
    );
  }

  if (existing?.status === "pending") {
    return <StatusScreen icon={<Clock className="h-8 w-8" />} title="Application under review" desc="Thanks for applying. Our team typically responds within 24 hours." />;
  }

  return (
    <div className="min-h-screen bg-muted/40 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Link>
        {existing?.status === "rejected" && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-center gap-2 font-semibold"><XCircle className="h-4 w-4" /> Previous application rejected</div>
            {existing.admin_notes && <p className="mt-1">{existing.admin_notes}</p>}
            <p className="mt-2">You can submit a fresh application below.</p>
          </div>
        )}
        <div className="rounded-3xl border border-border bg-card p-8">
          <h1 className="font-display text-3xl font-bold">Become a Provider</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tell us about your business. Your Customer account stays active — you can switch between modes anytime.</p>
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <F label="Business name"><input required className="ainput" value={form.business_name} onChange={set("business_name")} /></F>
            <F label="Profession"><input required placeholder="e.g. Electrician" className="ainput" value={form.profession} onChange={set("profession")} /></F>
            <F label="Bio" span2><textarea required rows={4} className="w-full rounded-2xl border border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" value={form.bio} onChange={set("bio")} placeholder="A short intro that customers will read on your profile." /></F>
            <F label="Years of experience"><input type="number" min="0" className="ainput" value={form.years_experience} onChange={set("years_experience")} /></F>
            <F label="Hourly rate (₦)"><input type="number" min="0" className="ainput" value={form.hourly_rate} onChange={set("hourly_rate")} /></F>
            <F label="State"><input className="ainput" value={form.state} onChange={set("state")} /></F>
            <F label="City"><input className="ainput" value={form.city} onChange={set("city")} /></F>
            <F label="Address" span2><input className="ainput" value={form.address} onChange={set("address")} /></F>
            <F label="Phone"><input required className="ainput" value={form.phone} onChange={set("phone")} /></F>
            <F label="Government ID (URL)"><input required className="ainput" placeholder="Link to uploaded ID" value={form.government_id_url} onChange={set("government_id_url")} /></F>
            <F label="Portfolio images (comma-separated URLs)" span2><input className="ainput" value={form.portfolio_urls} onChange={set("portfolio_urls")} placeholder="https://... , https://..." /></F>
            <F label="Availability" span2><input className="ainput" placeholder="e.g. Mon–Sat, 9am–6pm" value={form.availability} onChange={set("availability")} /></F>
            <div className="sm:col-span-2">
              <button disabled={saving} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving ? "Submitting…" : "Submit application"}</button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Applications are reviewed by our Trust & Safety team within 24 hours.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function F({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <label className={`block ${span2 ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function StatusScreen({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">{icon}</div>
        <h1 className="mt-6 font-display text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/dashboard" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Back to dashboard</Link>
          {children}
        </div>
      </div>
    </div>
  );
}
