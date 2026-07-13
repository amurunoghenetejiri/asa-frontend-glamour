import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/super-admin/backups")({
  component: () => (
    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <h2 className="font-display text-2xl font-bold">Backups</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">View, create and restore database backups.</p>
    </div>
  ),
});
