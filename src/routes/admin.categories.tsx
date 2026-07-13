import { createFileRoute } from "@tanstack/react-router";

const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
  <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
    <h2 className="font-display text-2xl font-bold">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
  </div>
);

export const Route = createFileRoute("/admin/categories")({
  component: () => <PlaceholderPage title="Categories" description="Add, edit and organize service categories that appear across the marketplace." />,
});
