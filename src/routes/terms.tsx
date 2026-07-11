import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "../components/site/PublicLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Asá" }] }),
  component: () => (
    <PublicLayout>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <article className="prose mx-auto max-w-3xl space-y-4 px-4 py-16 text-sm leading-relaxed text-foreground/85 sm:px-6 lg:px-8">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>By using Asá you agree to these terms.</p>
        <h2 className="font-display text-xl font-semibold">1. Accounts</h2>
        <p>You are responsible for keeping your credentials secure and for all activity under your account.</p>
        <h2 className="font-display text-xl font-semibold">2. Bookings & payments</h2>
        <p>Bookings are agreements between customer and provider. Asá facilitates payment via escrow.</p>
        <h2 className="font-display text-xl font-semibold">3. Conduct</h2>
        <p>Fraud, harassment, or off-platform payment attempts are grounds for suspension.</p>
        <h2 className="font-display text-xl font-semibold">4. Liability</h2>
        <p>Asá is not liable for damages arising from provider performance beyond the value of the booking.</p>
        <h2 className="font-display text-xl font-semibold">5. Changes</h2>
        <p>We may update these terms; continued use constitutes acceptance.</p>
      </article>
    </PublicLayout>
  ),
});
