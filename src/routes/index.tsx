import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, MapPin, Shield, Star, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
import { PublicLayout } from "../components/site/PublicLayout";
import { CATEGORIES, HERO_SLIDES, PROVIDERS, STATES, TESTIMONIALS } from "../lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asá — Trusted. Verified. Nearby." },
      { name: "description", content: "Nigeria's premium marketplace for verified skilled professionals. Book electricians, tailors, cleaners, mechanics and more." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PublicLayout>
      <Hero />
      <SearchBar />
      <PopularCategories />
      <FeaturedProviders />
      <TopRated />
      <HowItWorks />
      <Testimonials />
      <Stats />
      <BecomeProviderCTA />
      <Newsletter />
      <MiniFAQ />
    </PublicLayout>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F5A43]/95 via-[#0F5A43]/70 to-[#0F5A43]/20" />
        </div>
      ))}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold backdrop-blur">
          <Shield className="h-3.5 w-3.5" /> Verified · Rated · Insured
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
          {HERO_SLIDES[i].title}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/85">{HERO_SLIDES[i].subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/find-professionals" className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#3a2b06] shadow-lg transition hover:brightness-110">
            Find a Professional <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/become-a-provider" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
            Become a Provider
          </Link>
        </div>
        <div className="absolute bottom-8 left-4 flex gap-2 sm:left-6 lg:left-8">
          {HERO_SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-gold" : "w-4 bg-white/40"}`} aria-label={`Slide ${idx + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchBar() {
  return (
    <section className="relative z-20 -mt-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border/60 bg-card p-3 shadow-[0_30px_60px_-30px_rgba(15,90,67,0.35)] sm:p-4">
        <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Profession or keyword" className="h-12 w-full rounded-2xl bg-muted/50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select className="h-12 w-full appearance-none rounded-2xl bg-muted/50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">State</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <input placeholder="City / Area" className="h-12 w-full rounded-2xl bg-muted/50 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <Link to="/find-professionals" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Search className="h-4 w-4" /> Search
          </Link>
        </div>
      </div>
    </section>
  );
}

function PopularCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Explore</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Popular Categories</h2>
        </div>
        <Link to="/categories" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">View all <ChevronRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to="/find-professionals" className="card-hover group rounded-2xl border border-border bg-card p-5 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/8 text-2xl transition-colors group-hover:bg-primary/15">{c.icon}</div>
            <p className="mt-3 text-sm font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.count} pros</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedProviders() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Featured</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Handpicked professionals</h2>
          </div>
          <Link to="/find-professionals" className="hidden text-sm font-medium text-primary hover:underline sm:inline">See more →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROVIDERS.slice(0, 6).map((p) => <ProviderCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

function TopRated() {
  const top = [...PROVIDERS].sort((a, b) => b.rating - a.rating).slice(0, 4);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Best of Asá</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Top rated this month</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {top.map((p) => <ProviderCard key={p.id} p={p} compact />)}
      </div>
    </section>
  );
}

export function ProviderCard({ p, compact = false }: { p: typeof PROVIDERS[number]; compact?: boolean }) {
  return (
    <Link to="/providers/$id" params={{ id: p.id }} className="card-hover group block overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative h-36 overflow-hidden">
        <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {p.verified && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-primary">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </span>
        )}
      </div>
      <div className="relative px-5 pb-5">
        <img src={p.avatar} alt={p.name} className="absolute -top-8 h-16 w-16 rounded-2xl border-4 border-card object-cover shadow-md" />
        <div className="pt-10">
          <h3 className="font-display text-lg font-bold">{p.name}</h3>
          <p className="text-sm text-muted-foreground">{p.profession}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{p.location}</span>
            <span className="inline-flex items-center gap-1 font-semibold"><Star className="h-3.5 w-3.5 fill-gold text-gold" />{p.rating}<span className="text-muted-foreground">({p.reviews})</span></span>
          </div>
          {!compact && (
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">From</span>
              <span className="text-sm font-bold text-primary">{p.price}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Search", d: "Filter by profession, state and city — thousands of verified pros." },
    { n: "02", t: "Compare", d: "Read honest reviews, browse portfolios, check availability." },
    { n: "03", t: "Book", d: "Message, agree a scope and book securely in a few taps." },
    { n: "04", t: "Enjoy", d: "Pay only when satisfied. Rate your provider afterwards." },
  ];
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Process</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">How Asá works</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="font-display text-4xl font-bold gold-gradient">{s.n}</div>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-white/70">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Testimonials</p>
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Loved by thousands</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-3xl border border-border bg-card p-7">
            <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold" />)}</div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/85">"{t.text}"</p>
            <div className="mt-6 flex items-center gap-3">
              <img src={t.avatar} className="h-11 w-11 rounded-full object-cover" alt={t.name} />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { n: "12,400+", l: "Verified providers" },
    { n: "48,900+", l: "Jobs completed" },
    { n: "36", l: "States covered" },
    { n: "4.9/5", l: "Avg. rating" },
  ];
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {items.map((i) => (
          <div key={i.l} className="text-center">
            <div className="font-display text-3xl font-bold text-primary sm:text-5xl">{i.n}</div>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground sm:text-sm">{i.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BecomeProviderCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] p-10 text-white sm:p-16" style={{ background: "linear-gradient(135deg, #0F5A43 0%, #0A3E2E 100%)" }}>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Earn on Asá</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Turn your skill into a business.</h2>
          <p className="mt-4 text-white/80">Join thousands of verified Nigerian professionals earning consistently on Asá. Free to sign up, low commission, get paid securely.</p>
          <Link to="/become-a-provider" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#3a2b06] hover:brightness-110">
            Start earning <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6 lg:px-8">
      <h2 className="font-display text-3xl font-bold">Stay in the loop</h2>
      <p className="mt-2 text-sm text-muted-foreground">Get product updates, new categories and provider spotlights.</p>
      <form className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="you@email.com" className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        <button className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90">Subscribe</button>
      </form>
    </section>
  );
}

function MiniFAQ() {
  const qs = [
    { q: "Are providers verified?", a: "Every provider passes ID checks, skill verification and reference checks before being listed." },
    { q: "How do I pay?", a: "Pay securely via card or transfer. Funds are held in escrow and released when the job is complete." },
    { q: "What if I'm not satisfied?", a: "Open a dispute within 48 hours and our Support Agents will step in to mediate." },
  ];
  return (
    <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center font-display text-3xl font-bold">Frequently asked</h2>
      <div className="space-y-3">
        {qs.map((q) => (
          <details key={q.q} className="group rounded-2xl border border-border bg-card p-5 open:shadow-md">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
              {q.q}
              <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{q.a}</p>
          </details>
        ))}
        <div className="pt-4 text-center">
          <Link to="/faq" className="text-sm font-medium text-primary hover:underline">See all FAQs →</Link>
        </div>
      </div>
    </section>
  );
}
