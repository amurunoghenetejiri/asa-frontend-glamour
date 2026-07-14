import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, MapPin, Shield, ChevronRight, CheckCircle2, ArrowRight, Sparkles, Users, Star, TrendingUp } from "lucide-react";
import { PublicLayout } from "../components/site/PublicLayout";
import { ProviderCard, type ProviderCardData } from "../components/site/ProviderCard";
import { STATES, TESTIMONIALS, HERO_SLIDES } from "../lib/data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asá — Trusted. Verified. Nearby." },
      { name: "description", content: "Nigeria's premium marketplace for verified skilled professionals. Book electricians, tailors, cleaners, mechanics and more." },
      { property: "og:title", content: "Asá — Trusted. Verified. Nearby." },
      { property: "og:description", content: "Nigeria's premium marketplace for verified skilled professionals." },
    ],
  }),
  component: Home,
});

type Category = { id: string; slug: string; name: string; icon: string | null; description: string | null };
type Stats = { providers: number; users: number; categories: number; states: number };

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<ProviderCardData[]>([]);
  const [recent, setRecent] = useState<ProviderCardData[]>([]);
  const [stats, setStats] = useState<Stats>({ providers: 0, users: 0, categories: 0, states: 0 });

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: provs }, { data: recentProvs }, users, providerCount] = await Promise.all([
        supabase.from("categories").select("id, slug, name, icon, description").eq("is_active", true).order("sort_order").limit(12),
        supabase
          .from("profiles")
          .select("id, full_name, avatar_url, profession, city, state, years_experience, hourly_rate")
          .eq("is_provider", true)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("profiles")
          .select("id, full_name, avatar_url, profession, city, state, years_experience")
          .eq("is_provider", true)
          .order("created_at", { ascending: false })
          .limit(4),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_provider", true),
      ]);
      setCategories((cats as Category[]) ?? []);
      setProviders(toCards(provs ?? []));
      setRecent(toCards(recentProvs ?? []));
      const stateSet = new Set(((provs ?? []) as { state: string | null }[]).map((p) => p.state).filter(Boolean));
      setStats({
        providers: providerCount.count ?? 0,
        users: users.count ?? 0,
        categories: cats?.length ?? 0,
        states: stateSet.size,
      });
    })();
  }, []);

  return (
    <PublicLayout>
      <Hero />
      <SearchBar />
      <TrustStrip />
      <PopularCategories categories={categories} />
      <RecentlyJoined providers={recent} />
      <FeaturedProviders providers={providers} />
      <HowItWorks />
      <Stats stats={stats} />
      <Testimonials />
      <BecomeProviderCTA />
      <Newsletter />
      <MiniFAQ />
    </PublicLayout>
  );
}

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  profession: string | null;
  city: string | null;
  state: string | null;
  years_experience?: number | null;
  hourly_rate?: number | null;
};

function toCards(rows: ProfileRow[]): ProviderCardData[] {
  return rows.map((r) => ({
    id: r.id,
    name: r.full_name || "Verified Provider",
    profession: r.profession,
    location: [r.city, r.state].filter(Boolean).join(", ") || null,
    avatar_url: r.avatar_url,
    verified: true,
    rating: null,
    reviews: null,
    price: r.hourly_rate ? `₦${Number(r.hourly_rate).toLocaleString()}/hr` : null,
    years: r.years_experience ?? null,
  }));
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
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}>
          <img src={s.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F5A43]/95 via-[#0F5A43]/70 to-[#0F5A43]/20" />
        </div>
      ))}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold backdrop-blur">
          <Shield className="h-3.5 w-3.5" /> Verified · Rated · Insured
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl lg:text-7xl">{HERO_SLIDES[i].title}</h1>
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

function TrustStrip() {
  const items = [
    { icon: CheckCircle2, text: "ID-verified providers" },
    { icon: Shield, text: "Secure escrow payments" },
    { icon: Star, text: "Honest customer reviews" },
    { icon: Sparkles, text: "36 states covered" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, k) => (
          <div key={k} className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><it.icon className="h-5 w-5" /></span>
            <p className="text-sm font-medium">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PopularCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Explore</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Popular Categories</h2>
        </div>
        <Link to="/categories" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {categories.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.id} to="/find-professionals" className="card-hover group rounded-2xl border border-border bg-card p-5 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/8 text-2xl transition-colors group-hover:bg-primary/15">
                {c.icon || "✨"}
              </div>
              <p className="mt-3 text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">Browse pros</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function RecentlyJoined({ providers }: { providers: ProviderCardData[] }) {
  if (providers.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Fresh talent</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Recently joined</h2>
        </div>
        <Link to="/find-professionals" className="hidden text-sm font-medium text-primary hover:underline sm:inline">See more →</Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((p) => <ProviderCard key={p.id} p={p} compact />)}
      </div>
    </section>
  );
}

function FeaturedProviders({ providers }: { providers: ProviderCardData[] }) {
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
        {providers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Users className="h-6 w-6" /></div>
            <h3 className="mt-4 font-display text-xl font-semibold">Providers are on the way</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Asá just launched. Featured, verified professionals will appear here as they join. Be one of the first.
            </p>
            <Link to="/become-a-provider" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Apply to be featured <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p) => <ProviderCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </section>
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
            <div key={s.n} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
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

function Stats({ stats }: { stats: Stats }) {
  const items = [
    { n: stats.users, l: "Members" },
    { n: stats.providers, l: "Verified providers" },
    { n: stats.categories, l: "Service categories" },
    { n: stats.states, l: "States covered" },
  ];
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {items.map((i) => (
          <div key={i.l} className="text-center">
            <div className="font-display text-3xl font-bold text-primary sm:text-5xl">
              {i.n.toLocaleString()}
              {i.n > 0 ? "+" : ""}
            </div>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground sm:text-sm">{i.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Stories</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Real people, real results</h2>
        </div>
        <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:inline-flex">
          <TrendingUp className="h-4 w-4 text-primary" /> Trusted from Lagos to Enugu
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="card-hover rounded-3xl border border-border bg-card p-7">
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

function BecomeProviderCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] p-10 text-white sm:p-16" style={{ background: "linear-gradient(135deg, #0F5A43 0%, #0A3E2E 100%)" }}>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Earn on Asá</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Turn your skill into a business.</h2>
          <p className="mt-4 text-white/80">Join verified Nigerian professionals earning consistently on Asá. Free to sign up, low commission, get paid securely.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/become-a-provider" className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#3a2b06] hover:brightness-110">
              Start earning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
              How it works
            </Link>
          </div>
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

// Backwards-compat: some routes still import ProviderCard from "./index"
export { ProviderCard };
