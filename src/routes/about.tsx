import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "../components/site/PublicLayout";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Asá" }, { name: "description", content: "The story behind Nigeria's trusted services marketplace." }] }),
  component: () => (
    <PublicLayout>
      <PageHero eyebrow="Our Story" title="Built for Nigerian excellence." subtitle="Asá exists to raise the standard of everyday services across Nigeria — through verification, transparency and technology." />
      <section className="mx-auto max-w-4xl space-y-8 px-4 py-16 text-base leading-relaxed text-foreground/85 sm:px-6 lg:px-8">
        <p>Asá is a premium marketplace connecting Nigerian customers with vetted, skilled professionals — from electricians and tailors to solar installers and cleaners. We believe trust is the currency of great service, and every provider on Asá is background-checked, skill-verified and rated by real customers.</p>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { t: "Our Mission", d: "Make quality services accessible, trusted and dignified for every Nigerian." },
            { t: "Our Vision", d: "The most trusted network of skilled hands across West Africa." },
            { t: "Our Values", d: "Integrity, craftsmanship, transparency and respect for the trade." },
          ].map((x) => (
            <div key={x.t} className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
        <p>We're proudly built in Nigeria, for Nigeria — powered by <span className="font-semibold text-primary">HEPTALABS</span>.</p>
      </section>
    </PublicLayout>
  ),
});
