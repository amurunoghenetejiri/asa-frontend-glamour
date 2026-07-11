import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "../components/site/PublicLayout";
import { CATEGORIES } from "../lib/data";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories — Asá" }, { name: "description", content: "Browse professional service categories on Asá." }] }),
  component: () => (
    <PublicLayout>
      <PageHero eyebrow="Browse" title="All Categories" subtitle="Every trusted skill, all in one place." />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to="/find-professionals" className="card-hover group rounded-3xl border border-border bg-card p-6">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/8 text-2xl">{c.icon}</div>
              <h3 className="mt-4 font-display text-lg font-semibold">{c.name}</h3>
              <p className="text-xs text-muted-foreground">{c.count} verified providers</p>
              <span className="mt-4 inline-block text-xs font-medium text-primary group-hover:underline">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  ),
});
