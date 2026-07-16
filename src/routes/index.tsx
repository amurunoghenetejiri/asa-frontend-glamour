import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, MapPin, Shield, ChevronRight, CheckCircle2, ArrowRight, Sparkles, Users, Star, TrendingUp,
  Wallet, Clock, Award, Heart, MessageSquare, Smartphone, Download, Apple, Lock, Zap, BadgeCheck, HandCoins,
} from "lucide-react";
import { PublicLayout } from "../components/site/PublicLayout";
import { ProviderCard, type ProviderCardData } from "../components/site/ProviderCard";
import { STATES, HERO_SLIDES } from "../lib/data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asá — Nigeria's premium marketplace for verified professionals" },
      { name: "description", content: "Book verified electricians, tailors, cleaners, mechanics, solar installers and more across Nigeria. ID-checked, insured, rated by real customers." },
      { property: "og:title", content: "Asá — Trusted. Verified. Nearby." },
      { property: "og:description", content: "Nigeria's premium marketplace for verified skilled professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      <WhyChoose />
      <RecentlyJoined providers={recent} />
      <HowItWorks />
      <FeaturedProviders providers={providers} />
      <BenefitsSplit />
      <PlatformFeatures />
      <Stats stats={stats} />
      <SuccessStories />
      <BecomeProviderCTA />
      <DownloadApp />
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
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
      {HERO_SLIDES.map((s, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-[1400ms] ${idx === i ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} style={{ transition: "opacity 1.4s ease, transform 8s ease-out" }}>
          <img src={s.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A3E2E]/95 via-[#0F5A43]/75 to-[#0F5A43]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.28em] text-gold backdrop-blur animate-fade-up">
          <Shield className="h-3.5 w-3.5" /> Verified · Rated · Insured
        </p>
        <h1 key={i} className="max-w-4xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl animate-fade-up">
          {HERO_SLIDES[i].title}
        </h1>
        <p key={`s-${i}`} className="mt-6 max-w-2xl text-lg text-white/85 sm:text-xl animate-fade-up">{HERO_SLIDES[i].subtitle}</p>
        <div className="mt-9 flex flex-wrap gap-3 animate-fade-up">
          <Link to="/find-professionals" className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-[#3a2b06] shadow-[0_20px_50px_-10px_rgba(212,175,55,0.55)] transition hover:brightness-110">
            Find a Professional
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/become-a-provider" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
            Become a Provider
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6 text-white/70 animate-fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest"><CheckCircle2 className="h-4 w-4 text-gold" /> ID-verified pros</div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest"><Lock className="h-4 w-4 text-gold" /> Escrow-protected</div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest"><Star className="h-4 w-4 text-gold" /> Honest reviews</div>
        </div>
        <div className="absolute bottom-8 left-4 flex gap-2 sm:left-6 lg:left-8">
          {HERO_SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-12 bg-gold" : "w-5 bg-white/40 hover:bg-white/60"}`} aria-label={`Slide ${idx + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchBar() {
  return (
    <section className="relative z-20 -mt-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-border/60 bg-card p-3 shadow-[0_40px_80px_-30px_rgba(15,90,67,0.45)] sm:p-4">
        <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="What service do you need?" className="h-14 w-full rounded-2xl bg-muted/50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select className="h-14 w-full appearance-none rounded-2xl bg-muted/50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">State</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <input placeholder="City / Area" className="h-14 w-full rounded-2xl bg-muted/50 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <Link to="/find-professionals" className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:opacity-90">
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
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><it.icon className="h-5 w-5" /></span>
            <p className="text-sm font-semibold">{it.text}</p>
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
          <p className="mt-2 max-w-md text-sm text-muted-foreground">Every service you need — from home essentials to specialist craftsmanship.</p>
        </div>
        <Link to="/categories" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {categories.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (<div key={i} className="h-28 rounded-2xl shimmer" />))}
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

function WhyChoose() {
  const items = [
    { icon: BadgeCheck, t: "Rigorously vetted", d: "Every provider passes ID, skill and reference checks before going live on Asá." },
    { icon: Lock, t: "Escrow-protected", d: "Your payment stays safe until the job is completed to your satisfaction." },
    { icon: Star, t: "Verified reviews only", d: "Reviews come from paying customers on real bookings — never bought, never faked." },
    { icon: Zap, t: "Fast, local, reliable", d: "Find nearby pros ready to work, with clear pricing and response times." },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Why Asá</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">Built on trust, powered by verification.</h2>
          <p className="mt-4 text-muted-foreground">We're the marketplace that treats quality and safety as non-negotiable — for both sides of every booking.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.t} className="card-hover group relative overflow-hidden rounded-3xl border border-border bg-card p-7">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-all group-hover:scale-150" />
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><it.icon className="h-6 w-6" /></span>
              <h3 className="relative mt-5 font-display text-lg font-bold">{it.t}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
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

function BenefitsSplit() {
  const customer = [
    { icon: Shield, t: "Only vetted pros", d: "ID and skill-verified — no strangers." },
    { icon: HandCoins, t: "Pay when satisfied", d: "Escrow protects every naira until the job is done." },
    { icon: Clock, t: "Fast response", d: "Most bookings receive a reply within minutes." },
    { icon: MessageSquare, t: "In-app messaging", d: "Keep every conversation safe and on-record." },
  ];
  const provider = [
    { icon: Users, t: "Real customers", d: "Serious buyers ready to book — no time-wasters." },
    { icon: Wallet, t: "Get paid promptly", d: "Funds released as soon as the job is confirmed." },
    { icon: Award, t: "Build your reputation", d: "Reviews and badges that unlock more work." },
    { icon: TrendingUp, t: "Grow your business", d: "Tools, insights and steady demand across Nigeria." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">For customers</p>
          <h3 className="mt-2 font-display text-3xl font-bold">Book skilled help you can actually trust.</h3>
          <ul className="mt-8 space-y-5">
            {customer.map((c) => (
              <li key={c.t} className="flex items-start gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></span>
                <div><p className="text-sm font-semibold">{c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p></div>
              </li>
            ))}
          </ul>
          <Link to="/find-professionals" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Find a professional <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-10" style={{ background: "linear-gradient(135deg, #0F5A43 0%, #072a1f 100%)" }}>
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">For providers</p>
          <h3 className="mt-2 font-display text-3xl font-bold">Turn your craft into a real business.</h3>
          <ul className="mt-8 space-y-5">
            {provider.map((c) => (
              <li key={c.t} className="flex items-start gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/20 text-gold"><c.icon className="h-5 w-5" /></span>
                <div><p className="text-sm font-semibold">{c.t}</p><p className="text-sm text-white/70">{c.d}</p></div>
              </li>
            ))}
          </ul>
          <Link to="/become-a-provider" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[#3a2b06] hover:brightness-110">
            Start earning <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PlatformFeatures() {
  const items = [
    { icon: MessageSquare, t: "Real-time messaging", d: "Chat with providers before you book." },
    { icon: Heart, t: "Save your favourites", d: "Bookmark pros for future jobs in one tap." },
    { icon: Wallet, t: "Digital wallet", d: "Manage bookings, refunds and history in one place." },
    { icon: Smartphone, t: "Mobile-first", d: "Beautifully responsive on any screen." },
    { icon: Shield, t: "Bank-grade security", d: "Encryption in transit and at rest." },
    { icon: Sparkles, t: "Smart recommendations", d: "The right pro, matched to your job." },
  ];
  return (
    <section className="bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">The platform</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">Everything you need. Nothing you don't.</h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.t} className="card-hover flex gap-4 rounded-2xl border border-border bg-card p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><it.icon className="h-5 w-5" /></span>
              <div><h3 className="text-sm font-semibold">{it.t}</h3><p className="mt-1 text-sm text-muted-foreground">{it.d}</p></div>
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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-10 shadow-sm">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {items.map((i) => (
              <div key={i.l} className="text-center">
                <div className="font-display text-3xl font-bold text-primary sm:text-5xl">
                  {i.n.toLocaleString()}{i.n > 0 ? "+" : ""}
                </div>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground sm:text-sm">{i.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessStories() {
  // Live-data only per user's rules. Until reviews table exists, empty state.
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Success stories</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Real people, real results</h2>
      </div>
      <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Heart className="h-6 w-6" /></div>
        <h3 className="mt-4 font-display text-xl font-semibold">Stories coming soon</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          When real customers complete real bookings and leave real reviews, their stories appear here — never before.
        </p>
      </div>
    </section>
  );
}

function BecomeProviderCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
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

function DownloadApp() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card lg:grid-cols-2">
        <div className="p-10 sm:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Asá mobile</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">Your marketplace, in your pocket.</h2>
          <p className="mt-4 max-w-md text-muted-foreground">Book, chat and pay on the go. The Asá app for iOS and Android is arriving soon — join the waitlist.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button disabled className="inline-flex items-center gap-3 rounded-2xl border border-border bg-foreground/95 px-5 py-3 text-white opacity-90">
              <Apple className="h-6 w-6" />
              <span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-wider text-white/70">Coming soon</span><span className="block text-sm font-semibold">App Store</span></span>
            </button>
            <button disabled className="inline-flex items-center gap-3 rounded-2xl border border-border bg-foreground/95 px-5 py-3 text-white opacity-90">
              <Download className="h-6 w-6" />
              <span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-wider text-white/70">Coming soon</span><span className="block text-sm font-semibold">Google Play</span></span>
            </button>
          </div>
        </div>
        <div className="relative min-h-[280px] overflow-hidden bg-gradient-to-br from-primary via-primary to-[#0A3E2E]">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[85%] w-56 rounded-[2.5rem] border-[10px] border-black/70 bg-card shadow-2xl">
              <div className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-black/70" />
              <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                <span className="font-display text-4xl font-bold gold-gradient">Asá</span>
                <p className="text-xs text-muted-foreground">Trusted · Verified · Nearby</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Newsletter</p>
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Stay in the loop</h2>
      <p className="mt-3 text-sm text-muted-foreground">Product updates, new categories and provider spotlights — straight to your inbox.</p>
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
    { q: "Is Asá free to join?", a: "Yes — sign up as a customer or apply as a provider for free. We only take a small commission on completed bookings." },
  ];
  return (
    <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">FAQ</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Frequently asked</h2>
      </div>
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
