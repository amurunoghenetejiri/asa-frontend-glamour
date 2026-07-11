import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "../components/site/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — Asá" }] }),
  component: SignUp,
});

function SignUp() {
  const [role, setRole] = useState<"customer" | "provider">("customer");
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Nigeria's trusted marketplace."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></>}
    >
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1 text-sm font-medium">
        {(["customer", "provider"] as const).map((r) => (
          <button key={r} onClick={() => setRole(r)} className={`rounded-xl py-2 capitalize transition ${role === r ? "bg-card shadow text-primary" : "text-muted-foreground"}`}>{r}</button>
        ))}
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><input className="ainput" placeholder="Jane Doe" /></Field>
          <Field label="Phone"><input className="ainput" placeholder="+234 ..." /></Field>
        </div>
        <Field label="Email"><input type="email" className="ainput" placeholder="you@email.com" /></Field>
        <Field label="Password"><input type="password" className="ainput" placeholder="At least 8 characters" /></Field>
        {role === "provider" && (
          <Field label="Profession"><input className="ainput" placeholder="e.g. Electrician" /></Field>
        )}
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 accent-primary" />
          <span>I agree to Asá's <Link to="/terms" className="text-primary underline">Terms</Link> and <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.</span>
        </label>
        <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Create account</button>
        <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" className="rounded-full border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted">Continue with Google</button>
          <button type="button" className="rounded-full border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted">Continue with Apple</button>
        </div>
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
