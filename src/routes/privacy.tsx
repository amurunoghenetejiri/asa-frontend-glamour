import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "../components/site/PublicLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Asá" }] }),
  component: () => (
    <PublicLayout>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <article className="prose mx-auto max-w-3xl space-y-4 px-4 py-16 text-sm leading-relaxed text-foreground/85 sm:px-6 lg:px-8">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="font-display text-xl font-semibold">1. Information we collect</h2>
        <p>We collect information you provide when creating an account, booking services, or contacting support — including name, contact details, location, and payment information.</p>
        <h2 className="font-display text-xl font-semibold">2. How we use it</h2>
        <p>Your data is used to match you with providers, process payments, prevent fraud, and improve the platform.</p>
        <h2 className="font-display text-xl font-semibold">3. Sharing</h2>
        <p>We share limited details with providers to enable bookings. We never sell your data.</p>
        <h2 className="font-display text-xl font-semibold">4. Your rights</h2>
        <p>You may access, correct or delete your data at any time from Settings, or by emailing privacy@asa.ng.</p>
        <h2 className="font-display text-xl font-semibold">5. Contact</h2>
        <p>Questions? Email <a className="text-primary" href="mailto:privacy@asa.ng">privacy@asa.ng</a>.</p>
      </article>
    </PublicLayout>
  ),
});
