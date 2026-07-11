import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "../components/site/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Asá" }] }),
  component: () => (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to Asá."
      footer={<>Don't have an account? <Link to="/signup" className="font-semibold text-primary">Sign up</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Email"><input type="email" className="ainput" placeholder="you@email.com" /></Field>
        <Field label="Password">
          <input type="password" className="ainput" placeholder="••••••••" />
        </Field>
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> Remember me</label>
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>
        <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Sign in</button>
        <Divider />
        <div className="grid gap-2 sm:grid-cols-2">
          <SocialBtn>Google</SocialBtn>
          <SocialBtn>Apple</SocialBtn>
        </div>
      </form>
    </AuthShell>
  ),
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Divider() {
  return <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>;
}
function SocialBtn({ children }: { children: React.ReactNode }) {
  return <button type="button" className="rounded-full border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted">{children}</button>;
}
