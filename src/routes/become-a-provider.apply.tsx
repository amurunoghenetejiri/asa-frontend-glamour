import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { PublicLayout, PageHero } from "@/components/site/PublicLayout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, STATES } from "@/lib/data";

export const Route = createFileRoute("/become-a-provider/apply")({
  head: () => ({
    meta: [
      { title: "Apply as a Provider — Asá" },
      { name: "description", content: "Submit your provider application and get verified on Asá." },
    ],
  }),
  component: ApplyProviderPage,
});

type ExistingApp = {
  id: string;
  status: "pending" | "approved" | "rejected";
  business_name: string;
  profession: string;
  created_at: string;
};

function ApplyProviderPage() {
  const { user, profile, loading: authLoading, roles } = useAuth();
  const navigate = useNavigate();
  const [existing, setExisting] = useState<ExistingApp | null>(null);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    profession: "",
    bio: "",
    years_experience: "",
    hourly_rate: "",
    phone: "",
    state: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChecking(false);
      return;
    }

    setForm((f) => ({
      ...f,
      business_name: profile?.full_name || f.business_name,
      profession: profile?.profession || f.profession,
      bio: profile?.bio || f.bio,
      years_experience: profile?.years_experience != null ? String(profile.years_experience) : f.years_experience,
      hourly_rate: profile?.hourly_rate != null ? String(profile.hourly_rate) : f.hourly_rate,
      phone: profile?.phone || f.phone,
      state: profile?.state || f.state,
      city: profile?.city || f.city,
      address: profile?.address || f.address,
    }));

    (async () => {
      const { data } = await supabase
        .from("provider_applications")
        .select("id, status, business_name, profession, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setExisting((data as ExistingApp) ?? null);
      setChecking(false);
    })();
  }, [user, profile, authLoading]);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to apply as a provider.");
      navigate({ to: "/login", search: { redirect: "/become-a-provider/apply" } as never });
      return;
    }

    if (!form.business_name.trim()) return toast.error("Business or display name is required.");
    if (!form.profession.trim()) return toast.error("Profession is required.");
    if (!form.phone.trim()) return toast.error("Phone number is required.");
    if (!form.state) return toast.error("Please select your state.");

    setSubmitting(true);
    const { error } = await supabase.from("provider_applications").insert({
      user_id: user.id,
      business_name: form.business_name.trim(),
      profession: form.profession.trim(),
      bio: form.bio.trim() || null,
      years_experience: form.years_experience ? Number(form.years_experience) : null,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      phone: form.phone.trim(),
      state: form.state,
      city: form.city.trim() || null,
      address: form.address.trim() || null,
      status: "pending",
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Application submitted! We'll review it shortly.");
    setExisting({
      id: "new",
      status: "pending",
      business_name: form.business_name.trim(),
      profession: form.profession.trim(),
      created_at: new Date().toISOString(),
    });
  };

  if (authLoading || checking) {
    return (
      <PublicLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (!user) {
    return (
      <PublicLayout>
        <PageHero
          eyebrow="Become a Provider"
          title="Sign in to apply"
          subtitle="Create an account or log in to submit your provider application."
        />
        <section className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
          <p className="text-sm text-muted-foreground">
            You need an Asá account before you can apply as a verified provider.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="btn-ghost px-7 py-3 text-sm">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary px-7 py-3 text-sm">
              Create account
            </Link>
          </div>
        </section>
      </PublicLayout>
    );
  }

  if (roles.includes("provider") || profile?.is_provider) {
    return (
      <PublicLayout>
        <PageHero eyebrow="You're in" title="You're already a provider" subtitle="Your provider dashboard is ready." />
        <section className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Manage bookings, portfolio, and availability from your dashboard.</p>
          <Link to="/provider" className="btn-primary mt-8 inline-flex px-7 py-3 text-sm">
            Open provider dashboard
          </Link>
        </section>
      </PublicLayout>
    );
  }

  if (existing && existing.status === "pending") {
    return (
      <PublicLayout>
        <PageHero
          eyebrow="Application received"
          title="Your application is under review"
          subtitle="We'll notify you once an admin has reviewed your submission."
        />
        <section className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-border bg-card p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-4 font-display text-lg font-semibold">{existing.business_name}</p>
            <p className="text-sm text-muted-foreground">{existing.profession}</p>
            <span className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
              Pending
            </span>
            <p className="mt-4 text-xs text-muted-foreground">
              Submitted {new Date(existing.created_at).toLocaleDateString()}
            </p>
          </div>
        </section>
      </PublicLayout>
    );
  }

  if (existing && existing.status === "approved") {
    return (
      <PublicLayout>
        <PageHero eyebrow="Approved" title="Your application was approved" subtitle="You can start using the provider tools." />
        <section className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
          <Link to="/provider" className="btn-primary inline-flex px-7 py-3 text-sm">
            Go to provider dashboard
          </Link>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Provider application"
        title="Apply to offer services on Asá"
        subtitle="Tell us about your skills. Our team reviews every application before you go live."
      />
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {existing?.status === "rejected" && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Your previous application was rejected. You can update the details below and submit again.
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business / display name *">
              <input required className="field px-4" value={form.business_name} onChange={set("business_name")} placeholder="e.g. Chinedu Electricals" />
            </Field>
            <Field label="Profession *">
              <select required className="field px-4" value={form.profession} onChange={set("profession")}>
                <option value="">Select profession</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>

          <Field label="About your services">
            <textarea
              className="field min-h-[120px] resize-y px-4 py-3"
              value={form.bio}
              onChange={set("bio")}
              placeholder="Describe your experience, specialties, and the services you offer…"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Years of experience">
              <input
                type="number"
                min={0}
                max={50}
                className="field px-4"
                value={form.years_experience}
                onChange={set("years_experience")}
                placeholder="e.g. 5"
              />
            </Field>
            <Field label="Hourly rate (₦)">
              <input
                type="number"
                min={0}
                className="field px-4"
                value={form.hourly_rate}
                onChange={set("hourly_rate")}
                placeholder="e.g. 8000"
              />
            </Field>
          </div>

          <Field label="Phone *">
            <input required className="field px-4" value={form.phone} onChange={set("phone")} placeholder="+234…" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="State *">
              <select required className="field px-4" value={form.state} onChange={set("state")}>
                <option value="">Select state</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City">
              <input className="field px-4" value={form.city} onChange={set("city")} placeholder="e.g. Lekki" />
            </Field>
          </div>

          <Field label="Address">
            <input className="field px-4" value={form.address} onChange={set("address")} placeholder="Street address (optional)" />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full px-7 py-3.5 text-sm disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Submit application"
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            By submitting, you agree to Asá's verification process and provider guidelines.
          </p>
        </form>
      </section>
    </PublicLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
