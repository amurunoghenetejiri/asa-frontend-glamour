import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "../components/site/PublicLayout";
import { CheckCircle2, TrendingUp, Wallet, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/become-a-provider")({
  head: () => ({ meta: [{ title: "Become a Provider — Asá" }, { name: "description", content: "Earn on Nigeria's premium services marketplace." }] }),
  component: () => (
    <PublicLayout>
      <PageHero eyebrow="Join Asá" title="Turn your skill into a business." subtitle="Get discovered, paid securely, and grow with tools built for Nigerian professionals." />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { i: TrendingUp, t: "More jobs", d: "Thousands of nearby customers ready to hire." },
            { i: Wallet, t: "Secure payouts", d: "Escrow-protected, weekly withdrawals to your bank." },
            { i: ShieldCheck, t: "Trust badges", d: "Verified status boosts bookings by up to 3x." },
            { i: CheckCircle2, t: "Free to join", d: "No sign-up fees. Only pay a small commission per job." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="rounded-3xl border border-border bg-card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">How to get started</h2>
            <ol className="mt-6 space-y-4">
              {["Create your free account", "Complete your profile & upload portfolio", "Verify ID and skills", "Start receiving job requests"].map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                  <span className="pt-1">{s}</span>
                </li>
              ))}
            </ol>
            <Link to="/become-a-provider/apply" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Apply as Provider
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200" alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </PublicLayout>
  ),
});
