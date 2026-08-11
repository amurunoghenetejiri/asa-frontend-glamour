import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2, MapPin, Star, MessageCircle, Calendar, Award, Briefcase, Loader2,
} from "lucide-react";
import { PublicLayout } from "../components/site/PublicLayout";
import { Avatar, SignedImg } from "@/components/social/media";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/providers/$id")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Provider — Asá" }, { name: "description", content: "View provider profile on Asá." }],
  }),
  notFoundComponent: () => (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Provider not found</h1>
        <Link to="/find-professionals" className="mt-6 inline-block text-primary hover:underline">
          Browse providers →
        </Link>
      </div>
    </PublicLayout>
  ),
  component: ProviderPage,
});

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  profession: string | null;
  professional_title: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  verification_status: string | null;
  is_provider: boolean;
  skills: string[] | null;
};

type PortfolioItem = {
  id: string;
  title: string | null;
  media_url: string;
  media_type: "image" | "video";
};

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  author_id: string;
};

function ProviderPage() {
  const { id } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<(ReviewRow & { author_name: string | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, full_name, avatar_url, cover_url, profession, professional_title, bio, city, state, years_experience, hourly_rate, verification_status, is_provider, skills",
        )
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data || !data.is_provider) {
        setMissing(true);
        setLoading(false);
        return;
      }

      setProfile(data as Profile);

      const [{ data: port }, { data: revs }] = await Promise.all([
        supabase
          .from("portfolio_items")
          .select("id, title, media_url, media_type")
          .eq("user_id", id)
          .order("sort_order")
          .limit(12),
        supabase
          .from("reviews")
          .select("id, rating, comment, created_at, author_id")
          .eq("provider_id", id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      const portItems = (port as PortfolioItem[]) ?? [];
      setPortfolio(portItems);

      const rawRevs = (revs as ReviewRow[]) ?? [];
      const authorIds = [...new Set(rawRevs.map((r) => r.author_id))];
      const names = new Map<string, string | null>();
      if (authorIds.length) {
        const { data: authors } = await supabase.from("profiles").select("id, full_name").in("id", authorIds);
        (authors ?? []).forEach((a: { id: string; full_name: string | null }) => names.set(a.id, a.full_name));
      }
      setReviews(rawRevs.map((r) => ({ ...r, author_name: names.get(r.author_id) ?? null })));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  if (missing || !profile) {
    throw notFound();
  }

  const name = profile.full_name || "Asá Provider";
  const profession = profile.profession || profile.professional_title || "Professional";
  const location = [profile.city, profile.state].filter(Boolean).join(", ") || "Nigeria";
  const verified = profile.verification_status === "verified";
  const avgRating =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const price = profile.hourly_rate
    ? `₦${Number(profile.hourly_rate).toLocaleString()}/hr`
    : null;

  return (
    <PublicLayout>
      <div className="relative h-56 w-full overflow-hidden bg-muted sm:h-72">
        {profile.cover_url ? (
          <SignedImg src={profile.cover_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/30 via-primary/10 to-gold/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-20 rounded-3xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="rounded-3xl border-4 border-card shadow-md">
              <Avatar src={profile.avatar_url} name={name} size={120} className="!rounded-3xl" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold sm:text-4xl">{name}</h1>
                {verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-lg text-muted-foreground">{profession}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
                {avgRating != null && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    <b className="text-foreground">{avgRating.toFixed(1)}</b>
                    <span>({reviews.length} reviews)</span>
                  </span>
                )}
                {profile.years_experience != null && (
                  <span className="inline-flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {profile.years_experience} yrs experience
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/dashboard/messages"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-muted"
              >
                <MessageCircle className="h-4 w-4" /> Message
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
              >
                <Calendar className="h-4 w-4" /> Book now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <Section title="About">
              <p className="leading-relaxed text-foreground/85">
                {profile.bio?.trim() || "This provider has not added a bio yet."}
              </p>
            </Section>

            {(profile.skills?.length ?? 0) > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                  {profile.skills!.map((s) => (
                    <span key={s} className="rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Portfolio">
              {portfolio.length === 0 ? (
                <p className="text-sm text-muted-foreground">No portfolio items posted yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {portfolio.map((item) => (
                    <div key={item.id} className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                      {item.media_type === "video" ? (
                        <SignedImg src={item.media_url} alt={item.title || ""} className="h-full w-full object-cover" />
                      ) : (
                        <SignedImg src={item.media_url} alt={item.title || ""} className="h-full w-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title={`Reviews (${reviews.length})`}>
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{r.author_name || "Asá customer"}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-0.5 text-gold">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-gold" />
                        ))}
                      </div>
                      {r.comment && <p className="mt-2 text-sm text-foreground/85">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Starting price</p>
              <p className="mt-1 font-display text-3xl font-bold text-primary">{price || "Contact for quote"}</p>
              <button
                type="button"
                className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Book now
              </button>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              <p className="mb-2 inline-flex items-center gap-2 font-semibold text-foreground">
                <Briefcase className="h-4 w-4 text-primary" /> Provider on Asá
              </p>
              <p>Hire verified professionals and message them securely on the platform.</p>
            </div>
          </aside>
        </div>
      </div>
      <div className="h-20" />
    </PublicLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
