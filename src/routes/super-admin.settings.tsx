import { createFileRoute } from "@tanstack/react-router";
const Card = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
    <h2 className="font-display text-2xl font-bold">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{desc}</p>
  </div>
);
export const Route = createFileRoute("/super-admin/settings")({
  component: () => <Card title="Platform Settings" desc="Manage authentication policies, email templates and environment configuration." />,
});
