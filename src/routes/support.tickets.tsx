import { createFileRoute } from "@tanstack/react-router";
const P = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
    <h2 className="font-display text-2xl font-bold">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{desc}</p>
  </div>
);
export const Route = createFileRoute("/support/tickets")({
  component: () => <P title="Support Tickets" desc="Reply to user inquiries and track resolution status." />,
});
