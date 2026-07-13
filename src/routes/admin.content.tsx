import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/content")({
  component: () => (
    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <h2 className="font-display text-2xl font-bold">Site content</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Manage the homepage banners, FAQs, blog posts and legal pages.</p>
    </div>
  ),
});
