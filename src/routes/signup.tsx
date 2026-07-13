import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "../components/site/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — Asá" }] }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return toast.error("Please accept the Terms & Privacy Policy.");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters.");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: form.fullName, phone: form.phone },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to verify.");
    navigate({ to: "/login" });
  };

  const onGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (res.error) toast.error(res.error.message ?? "Google sign-up failed");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Nigeria's trusted marketplace."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><input required className="ainput" placeholder="Jane Doe" value={form.fullName} onChange={set("fullName")} /></Field>
          <Field label="Phone"><input className="ainput" placeholder="+234 ..." value={form.phone} onChange={set("phone")} /></Field>
        </div>
        <Field label="Email"><input required type="email" className="ainput" placeholder="you@email.com" value={form.email} onChange={set("email")} /></Field>
        <Field label="Password"><input required type="password" className="ainput" placeholder="At least 8 characters" value={form.password} onChange={set("password")} /></Field>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 accent-primary" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>I agree to Asá's <Link to="/terms" className="text-primary underline">Terms</Link> and <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.</span>
        </label>
        <button disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">{loading ? "Creating…" : "Create account"}</button>
        <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
        <button type="button" onClick={onGoogle} className="w-full rounded-full border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted">Continue with Google</button>
      </form>
      <p className="mt-4 text-center text-xs text-muted-foreground">Every account starts as a Customer. Apply to become a Provider anytime from your dashboard.</p>
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
