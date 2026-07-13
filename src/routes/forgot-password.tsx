import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "../components/site/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — Asá" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Reset link sent — check your email.");
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send you a secure link."
      footer={<>Remembered? <Link to="/login" className="font-semibold text-primary">Sign in</Link></>}
    >
      {sent ? (
        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm">
          If an account exists for <b>{email}</b>, we've sent a reset link. It may take a minute to arrive.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
            <input required type="email" className="ainput" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">{loading ? "Sending…" : "Send reset link"}</button>
        </form>
      )}
    </AuthShell>
  );
}
