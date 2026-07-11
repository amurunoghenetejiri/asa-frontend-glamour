import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "../components/site/AuthShell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — Asá" }] }),
  component: () => (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send you a secure link."
      footer={<>Remembered? <Link to="/login" className="font-semibold text-primary">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
          <input type="email" className="ainput" placeholder="you@email.com" />
        </label>
        <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Send reset link</button>
      </form>
    </AuthShell>
  ),
});
