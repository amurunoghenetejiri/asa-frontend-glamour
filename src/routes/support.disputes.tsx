import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/support/disputes")({
  component: () => (
    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <h2 className="font-display text-2xl font-bold">Disputes</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Read-only view of active disputes between customers and providers.</p>
    </div>
  ),
});
