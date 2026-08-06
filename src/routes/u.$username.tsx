import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, MapPin, Briefcase, MessageSquare, UserPlus, UserCheck, Star, Clock, Languages } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Feed } from "@/components/social/Feed";
import { Avatar, SignedImg, SignedVideo, useMediaUrl } from "@/components/social/media";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/u/$username")({
  ssr: false,
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Asá` },
      { name: "description", content: `View @${params.username}'s profile, portfolio, posts and reviews on Asá.` },
      { property: "og:title", content: `@${params.username} on Asá` },
      { property: "og:description", content: "Profile, portfolio and reviews on Nigeria's trusted marketplace." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

type PublicProfile = {
  id: string; full_name: string | null; username: string | null; avatar_url: string | null; cover_url: string | null;
  bio: string | null; professional_title: string | null; profession: string | null; city: string | null; state: string | null;
  country: string | null; skills: string[] | null; languages: string[] | null; hourly_rate: number | null;
  years_experience: number | null; account_type: "customer" | "provider"; verification_status: string; is_provider: boolean;
};

type Portfolio = { id: string; title: string | null; description: string | null; media_url: string; media_type: "image" | "video" };
type Review = { id: string; rating: number; comment: string | null; created_at: string; author_id: string; author_name?: string | null };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function ProfilePage() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [p, setP] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posts" | "portfolio" | "reviews" | "about">("posts");
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [following, setFollowing] = useState(false);
  const cover = useMediaUrl(p?.cover_url);

  const load = useCallback(async () => {
    const cols =
      "id, full_name, username, avatar_url, cover_url, bio, professional_title, profession, city, state, country, skills, languages, hourly_rate, years_experience, account_type, verification_status, is_provider";
    const q = supabase.from("profiles").select(cols);
    const { data } = UUID.test(username) ? await q.eq("id", username).maybeSingle() : await q.eq("username", username).maybeSingle();
    const prof = (data as PublicProfile) ?? null;
    setP(prof);
    setLoading(false);
    if (!prof) return;

    const [pf, rv, followers, followingC, mine] = await Promise.all([
      supabase.from("portfolio_items").select("id, title, description, media_url, media_type").eq("user_id", prof.id).order("sort_order"),
      supabase.from("reviews").select("id, rating, comment, created_at, author_id").eq("provider_id", prof.id).order("created_at", { ascending: false }),
      supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", prof.id),
      supabase.from("follows").select("following_id", { count: "exact", head: true }).eq("follower_id", prof.id),
      user ? supabase.from("follows").select("follower_id").eq("follower_id", user.id).eq("following_id", prof.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    setPortfolio((pf.data as Portfolio[]) ?? []);
    const revs = (rv.data as Review[]) ?? [];
    if (revs.length) {
      const { data: authors } = await supabase.from("profiles").select("id, full_name").in("id", revs.map((r) => r.author_id));
      const map = new Map(((authors ?? []) as { id: string; full_name: string | null }[]).map((a) => [a.id, a.full_name]));
      setReviews(revs.map((r) => ({ ...r, author_name: map.get(r.author_id) ?? "Asá customer" })));
    } else setReviews([]);
    setCounts({ followers: followers.count ?? 0, following: followingC.count ?? 0 });
    setFollowing(!!mine.data);
  }, [username, user]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFollow = async () => {
    if (!user) return navigate({ to: "/login" });
    if (!p) return;
    const next = !following;
    setFollowing(next);
    setCounts((c) => ({ ...c, followers: c.followers + (next ? 1 : -1) }));
    const { error } = next
      ? await supabase.from("follows").insert({ follower_id: user.id, following_id: p.id })
      : await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", p.id);
    if (error) {
      setFollowing(!next);
      toast.error(error.message);
    }
  };

  if (loading) return <PublicLayout><div className="grid min-h-[50vh] place-items-center text-muted-foreground">Loading profile…</div></PublicLayout>;
  if (!p)
    return (
      <PublicLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Profile not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This user does not exist or the handle changed.</p>
          <Link to="/directory" className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Browse the directory</Link>
        </div>
      </PublicLayout>
    );

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const isSelf = user?.id === p.id;
  const location = [p.city, p.state, p.country].filter(Boolean).join(", ");

  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 pb-16 lg:px-8">
        <div className="relative mt-4 h-44 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/25 via-primary/10 to-gold/20 sm:h-60">
          {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
        </div>

        <div className="relative -mt-14 px-2 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="rounded-full border-4 border-background">
                <Avatar src={p.avatar_url} name={p.full_name || p.username} size={112} />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold">{p.full_name || p.username || "Asá user"}</h1>
                  {p.verification_status === "verified" && <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified" />}
                </div>
                <p className="text-sm text-muted-foreground">{p.professional_title || p.profession || (p.account_type === "provider" ? "Service provider" : "Customer")}</p>
                {p.username && <p className="text-xs text-muted-foreground">@{p.username}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              {isSelf ? (
                <Link to="/dashboard/profile" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">Edit profile</Link>
              ) : (
                <>
                  <button onClick={toggleFollow} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${following ? "border border-border hover:bg-muted" : "bg-foreground text-background"}`}>
                    {following ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />} {following ? "Following" : "Follow"}
                  </button>
                  <Link to="/dashboard/messages" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">
                    <MessageSquare className="h-4 w-4" /> Message
                  </Link>
                  {p.is_provider && (
                    <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                      <Briefcase className="h-4 w-4" /> Hire Me
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {location}</span>}
            {!!p.years_experience && <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {p.years_experience} yrs experience</span>}
            {!!reviews.length && <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-gold text-gold" /> {avgRating.toFixed(1)} ({reviews.length})</span>}
            <span><strong className="text-foreground">{counts.followers}</strong> followers</span>
            <span><strong className="text-foreground">{counts.following}</strong> following</span>
          </div>

          {p.bio && <p className="mt-4 max-w-3xl text-[15px] leading-relaxed">{p.bio}</p>}

          {!!p.skills?.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {p.skills.map((s) => <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{s}</span>)}
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-1 border-b border-border">
          {(["posts", "portfolio", "reviews", "about"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium capitalize ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "posts" && <Feed userId={p.id} composer={isSelf} empty={isSelf ? "You haven't posted yet." : "No posts yet."} />}

          {tab === "portfolio" && (
            portfolio.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.map((item) => (
                  <figure key={item.id} className="overflow-hidden rounded-3xl border border-border bg-card">
                    {item.media_type === "video" ? <SignedVideo src={item.media_url} className="aspect-video w-full bg-black object-cover" /> : <SignedImg src={item.media_url} className="aspect-video w-full object-cover" />}
                    <figcaption className="p-4">
                      <p className="font-semibold">{item.title || "Untitled work"}</p>
                      {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : <Empty text="No portfolio items yet." />
          )}

          {tab === "reviews" && (
            reviews.length ? (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-3xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.author_name}</p>
                      <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />)}</div>
                    </div>
                    {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
                  </div>
                ))}
              </div>
            ) : <Empty text="No reviews yet." />
          )}

          {tab === "about" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Profession" value={p.profession} />
              <Info label="Headline" value={p.professional_title} />
              <Info label="Location" value={location} />
              <Info label="Experience" value={p.years_experience ? `${p.years_experience} years` : null} />
              <Info label="Starting rate" value={p.hourly_rate ? `₦${Number(p.hourly_rate).toLocaleString()}/hr` : null} />
              <Info label="Languages" value={p.languages?.join(", ") ?? null} icon={<Languages className="h-4 w-4" />} />
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">{text}</div>;
}

function Info({ label, value, icon }: { label: string; value: string | null; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{icon} {label}</p>
      <p className="mt-1 text-sm">{value || "—"}</p>
    </div>
  );
}
