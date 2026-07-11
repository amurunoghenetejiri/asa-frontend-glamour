import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "../components/site/PublicLayout";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [{ title: "How It Works — Asá" }, { name: "description", content: "See how Asá connects you to verified professionals." }] }),
  component: () => (
    <PublicLayout>
      <PageHero eyebrow="Process" title="How Asá works" subtitle="From search to satisfaction — every step is designed for trust." />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {[
            { n: "01", t: "Search verified pros", d: "Filter by profession, state, and city. Every provider is ID-verified and rated." },
            { n: "02", t: "Compare & shortlist", d: "Browse portfolios, read honest reviews, check pricing and availability." },
            { n: "03", t: "Book securely", d: "Message, agree scope, and book. Payment is held safely in escrow." },
            { n: "04", t: "Enjoy the work", d: "Provider delivers. You inspect and release payment when satisfied." },
            { n: "05", t: "Rate & repeat", d: "Leave a review to help others. Save your favorite providers for next time." },
          ].map((s) => (
            <div key={s.n} className="flex gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="font-display text-4xl font-bold gold-gradient sm:text-6xl">{s.n}</div>
              <div>
                <h3 className="font-display text-xl font-semibold sm:text-2xl">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  ),
});
