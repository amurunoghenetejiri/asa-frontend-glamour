import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, User as UserIcon } from "lucide-react";
import { AuthShell } from "../components/site/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { STATES } from "@/lib/data";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Asá account — Customer or Provider" },
      { name: "description", content: "Join Asá as a customer or verified service provider. Claim your username and start connecting today." },
      { property: "og:title", content: "Create your Asá account" },
      { property: "og:description", content: "Join Nigeria's trusted marketplace for skilled professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignUp,
});

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

function SignUp() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"customer" | "provider">("customer");
  const [form, setForm] = useState({
    fullName: "", username: "", phone: "", email: "", password: "",
    dob: "", gender: "", address: "", city: "", lga: "", state: "", profession: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: k === "username" ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") : e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return toast.error("Please accept the Terms & Privacy Policy.");
    if (!USERNAME_RE.test(form.username)) return toast.error("Username must be 3-20 characters: lowercase letters, numbers or underscores.");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (!form.state) return toast.error("Please select your state.");

    setLoading(true);
    const { data: taken } = await supabase.from("profiles").select("id").eq("username", form.username).maybeSingle();
    if (taken) {
      setLoading(false);
      return toast.error("That username is already taken.");
    }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/feed`,
        data: {
          full_name: form.fullName,
          username: form.username,
          phone: form.phone,
          account_type: accountType,
          date_of_birth: form.dob || null,
          gender: form.gender || null,
          address: form.address,
          city: form.city,
          lga: form.lga,
          state: form.state,
          country: "Nigeria",
          profession: accountType === "provider" ? form.profession : null,
        },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to verify.");
    navigate({ to: "/login" });
  };

  const onGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error.message ?? "Google sign-up failed");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Nigeria's trusted marketplace."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></>}
    >
      <div className="mb-6 grid grid-cols-2 gap-3">
        {([
          { v: "customer", label: "I'm a Customer", desc: "Hire trusted pros", icon: UserIcon },
          { v: "provider", label: "I'm a Provider", desc: "Offer my skills", icon: Briefcase },
        ] as const).map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => setAccountType(o.v)}
            className={`rounded-2xl border p-4 text-left transition ${accountType === o.v ? "border-primary bg-primary/5 ring-2 ring-primary/25" : "border-border hover:bg-muted"}`}
          >
            <o.icon className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-semibold">{o.label}</p>
            <p className="text-xs text-muted-foreground">{o.desc}</p>
          </button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><input required className="ainput" placeholder="Jane Doe" value={form.fullName} onChange={set("fullName")} /></Field>
          <Field label="Username"><input required className="ainput" placeholder="janedoe" value={form.username} onChange={set("username")} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email"><input required type="email" className="ainput" placeholder="you@email.com" value={form.email} onChange={set("email")} /></Field>
          <Field label="Phone"><input className="ainput" placeholder="+234 ..." value={form.phone} onChange={set("phone")} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date of birth"><input type="date" className="ainput" value={form.dob} onChange={set("dob")} /></Field>
          <Field label="Gender">
            <select className="ainput" value={form.gender} onChange={set("gender")}>
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
        {accountType === "provider" && (
          <Field label="Profession"><input className="ainput" placeholder="e.g. Electrician" value={form.profession} onChange={set("profession")} /></Field>
        )}
        <Field label="Street address"><input className="ainput" placeholder="12 Awolowo Road" value={form.address} onChange={set("address")} /></Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="State">
            <select required className="ainput" value={form.state} onChange={set("state")}>
              <option value="">Select</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="LGA"><input className="ainput" value={form.lga} onChange={set("lga")} /></Field>
          <Field label="City"><input className="ainput" value={form.city} onChange={set("city")} /></Field>
        </div>
        <Field label="Password"><input required type="password" className="ainput" placeholder="At least 8 characters" value={form.password} onChange={set("password")} /></Field>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 accent-primary" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>I agree to Asá's <Link to="/terms" className="text-primary underline">Terms</Link> and <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.</span>
        </label>
        <button disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">{loading ? "Creating…" : "Create account"}</button>
        <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
        <button type="button" onClick={onGoogle} className="w-full rounded-full border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted">Continue with Google</button>
      </form>
      <p className="mt-4 text-center text-xs text-muted-foreground">Providers still complete a short verification application before going live.</p>
    </AuthShell>
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
