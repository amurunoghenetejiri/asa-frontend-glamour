import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "../components/site/PublicLayout";
import { ChevronRight } from "lucide-react";

const FAQS = [
  { q: "Is it free to use Asá?", a: "Yes — browsing and booking on Asá is free for customers. Providers pay a small commission on completed jobs." },
  { q: "How are providers verified?", a: "Every provider passes government ID verification, skill checks, reference checks, and ongoing rating quality reviews." },
  { q: "How do I pay?", a: "Pay securely by card, bank transfer, or wallet. Funds are held in escrow until you confirm satisfaction." },
  { q: "What if I'm unhappy with the work?", a: "Open a dispute within 48 hours. Our Support Agents mediate and can issue a partial or full refund where warranted." },
  { q: "Can I cancel a booking?", a: "Yes — cancellations more than 24 hours before the job are free. Late cancellations may incur a small fee." },
  { q: "How do I become a provider?", a: "Sign up, complete your profile, submit ID and skill proofs. Verification takes 24–72 hours." },
  { q: "Are providers insured?", a: "Many verified providers carry liability cover. Look for the 'Insured' badge on their profile." },
  { q: "In which cities is Asá available?", a: "We currently serve all 36 states, with focus in Lagos, Abuja, Port Harcourt, Ibadan, Kano and Enugu." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Asá" }, { name: "description", content: "Answers to common questions about using Asá." }] }),
  component: () => (
    <PublicLayout>
      <PageHero eyebrow="Help" title="Frequently asked questions" subtitle="Everything you need to know about Asá." />
      <section className="mx-auto max-w-3xl space-y-3 px-4 py-16 sm:px-6 lg:px-8">
        {FAQS.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 open:shadow-md">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold sm:text-base">
              {f.q}
              <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </section>
    </PublicLayout>
  ),
});
