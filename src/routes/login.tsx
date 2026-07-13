import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "../components/site/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Asá" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (remember) localStorage.setItem("asa_remember", "1");
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const onGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to Asá."
      footer={<>Don't have an account? <Link to="/signup" className="font-semibold text-primary">Sign up</Link></>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Email"><input required type="email" className="ainput" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password"><input required type="password" className="ainput" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>
        <button disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
        <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
        <button type="button" onClick={onGoogle} className="w-full rounded-full border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted">Continue with Google</button>
      </form>
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
