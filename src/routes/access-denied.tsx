import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/access-denied")({
  head: () => ({ meta: [{ title: "Access Denied — Asá" }] }),
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary"><ShieldAlert className="h-8 w-8" /></div>
        <h1 className="mt-6 font-display text-3xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">You don't have permission to view this page. If you think this is a mistake, contact support.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/dashboard" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Go to dashboard</Link>
          <Link to="/" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Home</Link>
        </div>
      </div>
    </div>
  ),
});
