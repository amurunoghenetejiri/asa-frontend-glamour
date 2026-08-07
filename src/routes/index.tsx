import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, MapPin, ShieldCheck, Users, Star, BadgeCheck, Briefcase, LayoutGrid,
  MessageSquare, Sparkles, ArrowRight, Newspaper, Quote, TrendingUp,
} from "lucide-react";
import { PublicLayout } from "../components/site/PublicLayout";
import { ProviderCard, type ProviderCardData } from "../components/site/ProviderCard";
import { SectionHeader, ViewAllLink, EmptyState, SkeletonGrid, StatCard } from "../components/site/ui-kit";
import { STATES } from "../lib/data";
import { supabase } from "@/integrations/supabase/client";
import heroProfessional from "@/assets/hero-professional.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asá — Find. Hire. Done. Nigeria's trusted services marketplace" },
      { name: "description", content: "Connect with verified professionals across Nigeria — electricians, plumbers, tailors, cleaners and more. Post jobs, chat, and hire securely on Asá." },
      { property: "og:title", content: "Asá — Find. Hire. Done. All in One Place." },
      { property: "og:description", content: "Nigeria's trusted marketplace for verified skilled professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type Category = { id: string; slug: string; name: string; icon: string | null; description: string | null };
type Stats = { providers: number; users: number; categories: number; states: number };
type Author = { id: string; full_name: string | null; username: string | null; avatar_url: string | null; profession: string | null };
type PostRow = { id: string; content: string | null; created_at: string; author: Author | null };
type ReviewRow = { id: string; rating: number; comment: string | null; created_at: string; author: Author | null };

function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<ProviderCardData[]>([]);
  const [recent, setRecent] = useState<ProviderCardData[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [stats, setStats] = useState<Stats>({ providers: 0, users: 0, categories: 0, states: 0 });

  useEffect(() => {
    (async () => {
      const [cats, provs, recentProvs, postRes, reviewRes, users, providerCount, catCount] = await Promise.all([
        supabase.from("categories").select("id, slug, name, icon, description").eq("is_active", true).order("sort_order").limit(12),
        supabase.from("profiles").select("id, full_name, avatar_url, cover_url, profession, city, state, years_experience, hourly_rate, verification_status").eq("is_provider", true).order("created_at", { ascending: false }).limit(8),
        supabase.from("profiles").select("id, full_name, avatar_url, cover_url, profession, city, state, years_experience, verification_status").eq("is_provider", true).order("created_at", { ascending: false }).limit(4),
        supabase.from("posts").select("id, content, created_at, user_id").not("content", "is", null).order("created_at", { ascending: false }).limit(3),
        supabase.from("reviews").select("id, rating, comment, created_at, author_id").order("created_at", { ascending: false }).limit(3),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_provider", true),
        supabase.from("categories").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);

      const rawPosts = (postRes.data ?? []) as { id: string; content: string | null; created_at: string; user_id: string }[];
      const rawReviews = (reviewRes.data ?? []) as { id: string; rating: number; comment: string | null; created_at: string; author_id: string }[];
      const authorIds = [...new Set([...rawPosts.map((p) => p.user_id), ...rawReviews.map((r) => r.author_id)])];
      const authors = new Map<string, Author>();
      if (authorIds.length) {
        const { data } = await supabase.from("profiles").select("id, full_name, username, avatar_url, profession").in("id", authorIds);
        (data ?? []).forEach((a) => authors.set(a.id, a as Author));
      }

      setCategories((cats.data as Category[]) ?? []);
      setProviders(toCards(provs.data ?? []));
      setRecent(toCards(recentProvs.data ?? []));
      setPosts(rawPosts.filter((p) => p.content).map((p) => ({ ...p, author: authors.get(p.user_id) ?? null })));
      setReviews(rawReviews.map((r) => ({ ...r, author: authors.get(r.author_id) ?? null })));

      const stateSet = new Set(((provs.data ?? []) as { state: string | null }[]).map((p) => p.state).filter(Boolean));
      setStats({
        providers: providerCount.count ?? 0,
        users: users.count ?? 0,
        categories: catCount.count ?? 0,
        states: stateSet.size,
      });
      setLoading(false);
    })();
  }, []);

  return (
    <PublicLayout>
      <Hero stats={stats} avatars={recent} />
      <StatsRow stats={stats} />
      <PopularCategories categories={categories} loading={loading} />
      <FeaturedProviders providers={providers} loading={loading} />
      <RecentPosts posts={posts} loading={loading} />
      <RecentlyJoined providers={recent} loading={loading} />
      <Reviews reviews={reviews} loading={loading} />
      <CTA />
    </PublicLayout>
  );
}

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  cover_url?: string | null;
  profession: string | null;
  city: string | null;
  state: string | null;
  years_experience?: number | null;
  hourly_rate?: number | null;
  verification_status?: string | null;
};

function toCards(rows: ProfileRow[]): ProviderCardData[] {
  return rows.map((r) => ({
    id: r.id,
    name: r.full_name || "Asá Provider",
    profession: r.profession,
    location: [r.city, r.state].filter(Boolean).join(", ") || null,
    avatar_url: r.avatar_url,
    cover: r.cover_url ?? null,
    verified: r.verification_status === "verified",
    rating: null,
    reviews: null,
    price: r.hourly_rate ? `From ₦${Number(r.hourly_rate).toLocaleString()}` : null,
    years: r.years_experience ?? null,
  }));
}

const nf = (n: number) => n.toLocaleString();

/* ------------------------------- Hero ------------------------------- */

function Hero({ stats, avatars }: { stats: Stats; avatars: ProviderCardData[] }) {
  const [q, setQ] = useState("");
  const [state, setState] = useState("");

  const href =
    "/find-professionals?" +
    new URLSearchParams({ ...(q.trim() ? { q: q.trim() } : {}), ...(state ? { state } : {}) }).toString();

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-16">
        <div className="animate-fade-up min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Nigeria's Trusted Services Marketplace
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Find. Hire. Done.
            <span className="mt-1 block text-primary">All in One Place.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground">
            Connect with verified professionals, post jobs, chat, pay securely and get the best services around you.
          </p>

          <div className="mt-7 rounded-2xl border border-border bg-card p-2 shadow-soft">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <span className="hidden" />
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What service do you need?"
                  aria-label="Search services"
                  className="field pl-11 pr-4"
                />
              </div>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select value={state} onChange={(e) => setState(e.target.value)} aria-label="Location" className="field appearance-none pl-11 pr-4">
                  <option value="">All Locations</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Link to={href as never} className="btn-primary h-12 px-7 text-sm">
                <Search className="h-4 w-4" /> Search
              </Link>
            </div>
          </div>

          {(avatars.length > 0 || stats.users > 0) && (
            <div className="mt-6 flex items-center gap-3">
              {avatars.length > 0 && (
                <div className="flex -space-x-2">
                  {avatars.slice(0, 5).map((a) =>
                    a.avatar_url ? (
                      <img key={a.id} src={a.avatar_url} alt={a.name} loading="lazy" className="h-8 w-8 rounded-full border-2 border-background object-cover" />
                    ) : (
                      <span key={a.id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-[11px] font-bold text-primary-foreground">
                        {a.name.slice(0, 1).toUpperCase()}
                      </span>
                    ),
                  )}
                </div>
              )}
              {stats.users > 0 && <p className="text-sm text-muted-foreground">Join {nf(stats.users)} members on Asá</p>}
            </div>
          )}
        </div>

        <div className="relative hidden justify-center lg:flex">
          <div className="absolute inset-x-10 bottom-6 top-6 rounded-[3rem] bg-primary-soft" />
          <img
            src={heroProfessional}
            alt="Professional using the Asá marketplace on a phone"
            width={1024}
            height={1024}
            className="relative z-10 h-[480px] w-auto object-contain drop-shadow-2xl"
          />
          <div className="animate-float-soft absolute left-0 top-12 z-20 flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-3 shadow-lift backdrop-blur-xl">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary"><BadgeCheck className="h-4.5 w-4.5" /></span>
            <div>
              <p className="text-xs font-semibold">Verified Providers</p>
              <p className="text-[11px] text-muted-foreground">{nf(stats.providers)} on Asá</p>
            </div>
          </div>
          <div className="animate-float-soft absolute bottom-24 left-4 z-20 flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-3 shadow-lift backdrop-blur-xl" style={{ animationDelay: "1.5s" }}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary"><LayoutGrid className="h-4.5 w-4.5" /></span>
            <div>
              <p className="text-xs font-semibold">Service Categories</p>
              <p className="text-[11px] text-muted-foreground">{nf(stats.categories)} to explore</p>
            </div>
          </div>
          <div className="animate-float-soft absolute right-0 top-40 z-20 flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-3 shadow-lift backdrop-blur-xl" style={{ animationDelay: "3s" }}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary"><Users className="h-4.5 w-4.5" /></span>
            <div>
              <p className="text-xs font-semibold">Community</p>
              <p className="text-[11px] text-muted-foreground">{nf(stats.users)} members</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Stats ------------------------------ */

function StatsRow({ stats }: { stats: Stats }) {
  const items = [
    { icon: Users, value: nf(stats.users), label: "Registered members" },
    { icon: BadgeCheck, value: nf(stats.providers), label: "Providers on Asá" },
    { icon: LayoutGrid, value: nf(stats.categories), label: "Service categories" },
    { icon: MapPin, value: nf(stats.states), label: "States covered" },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => <StatCard key={i.label} icon={i.icon} value={i.value} label={i.label} />)}
      </div>
    </section>
  );
}

/* ---------------------------- Categories ---------------------------- */

function PopularCategories({ categories, loading }: { categories: Category[]; loading: boolean }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Explore"
        title="Popular Categories"
        subtitle="Browse verified professionals across every service category on Asá."
        action={<ViewAllLink to="/categories" label="View all categories" />}
      />
      {loading ? (
        <SkeletonGrid count={12} height="h-28" className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
      ) : categories.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No categories yet" description="Service categories will appear here once they are published by the Asá team." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/find-professionals"
              search={{ q: c.name } as never}
              className="surface-card card-hover group flex flex-col items-center p-5 text-center"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-xl text-primary transition group-hover:scale-110">
                {c.icon || <Sparkles className="h-5 w-5" />}
              </span>
              <p className="mt-3 truncate text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">Browse pros</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------- Featured providers ------------------------ */

function FeaturedProviders({ providers, loading }: { providers: ProviderCardData[]; loading: boolean }) {
  return (
    <section className="border-y border-border bg-surface py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Featured"
          title="Verified Providers"
          subtitle="Hire the best professionals for any service you need."
          action={<ViewAllLink to="/find-professionals" label="View all providers" />}
        />
        {loading ? (
          <SkeletonGrid count={8} height="h-80" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
        ) : providers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No providers yet"
            description="Verified professionals will appear here as they join Asá. Be one of the first to get discovered."
            actionLabel="Become a Provider"
            actionTo="/become-a-provider"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {providers.map((p) => <ProviderCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------- Recent posts --------------------------- */

function RecentPosts({ posts, loading }: { posts: PostRow[]; loading: boolean }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Community"
        title="Recent Posts"
        subtitle="See what professionals and customers are sharing right now."
        action={<ViewAllLink to="/feed" label="Open feed" />}
      />
      {loading ? (
        <SkeletonGrid count={3} height="h-44" className="grid gap-5 md:grid-cols-3" />
      ) : posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Community posts from members will show up here. Be the first to share an update." actionLabel="Go to feed" actionTo="/feed" />
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} to="/feed" className="surface-card card-hover animate-fade-in-soft flex flex-col p-5">
              <div className="flex min-w-0 items-center gap-3">
                {p.author?.avatar_url ? (
                  <img src={p.author.avatar_url} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                    {(p.author?.full_name || "A").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.author?.full_name || "Asá member"}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.author?.profession || (p.author?.username ? `@${p.author.username}` : "Member")}</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-4 text-sm text-muted-foreground">{p.content}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <MessageSquare className="h-3.5 w-3.5" /> View on feed
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------- Recently joined -------------------------- */

function RecentlyJoined({ providers, loading }: { providers: ProviderCardData[]; loading: boolean }) {
  if (!loading && providers.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Fresh talent"
        title="Recently Joined Providers"
        action={<ViewAllLink to="/directory" label="Browse directory" />}
      />
      {loading ? (
        <SkeletonGrid count={4} height="h-72" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((p) => <ProviderCard key={p.id} p={p} compact />)}
        </div>
      )}
    </section>
  );
}

/* ------------------------------ Reviews ------------------------------ */

function Reviews({ reviews, loading }: { reviews: ReviewRow[]; loading: boolean }) {
  return (
    <section className="border-y border-border bg-surface py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Trust" title="Customer Reviews" subtitle="Real feedback from real bookings on Asá." />
        {loading ? (
          <SkeletonGrid count={3} height="h-40" className="grid gap-5 md:grid-cols-3" />
        ) : reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Verified customer reviews will appear here after the first completed jobs on Asá." />
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="surface-card animate-fade-in-soft p-6">
                <Quote className="h-5 w-5 text-primary/40" />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-border"}`} />
                  ))}
                </div>
                {r.comment && <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>}
                <div className="mt-5 flex min-w-0 items-center gap-3 border-t border-border pt-4">
                  {r.author?.avatar_url ? (
                    <img src={r.author.avatar_url} alt="" loading="lazy" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                      {(r.author?.full_name || "A").slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <p className="truncate text-sm font-semibold">{r.author?.full_name || "Asá customer"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------- CTA -------------------------------- */

function CTA() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-primary-foreground/10 blur-2xl" />
        <h2 className="relative font-display text-3xl font-bold sm:text-4xl">Ready to get the job done?</h2>
        <p className="relative mx-auto mt-3 max-w-xl text-sm text-primary-foreground/85">
          Join Asá today — hire verified professionals, or grow your business with customers who are searching for your skills.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/signup" className="btn-ghost bg-card px-7 py-3 text-sm text-foreground">
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/become-a-provider" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-7 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10">
            <Briefcase className="h-4 w-4" /> Become a Provider
          </Link>
        </div>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-primary-foreground/80">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Verified professionals</span>
          <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> Grow your business</span>
          <span className="inline-flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> Chat before you hire</span>
        </div>
      </div>
    </section>
  );
}
