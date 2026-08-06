import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Users, TrendingUp } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Feed } from "@/components/social/Feed";
import { Avatar } from "@/components/social/media";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { profilePath, type SocialAuthor } from "@/lib/social";

export const Route = createFileRoute("/feed")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Community Feed — Asá" },
      { name: "description", content: "See what verified professionals and customers across Nigeria are sharing right now on Asá." },
      { property: "og:title", content: "Community Feed — Asá" },
      { property: "og:description", content: "Posts, projects and updates from Nigeria's trusted community of skilled professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const { user, profile } = useAuth();
  const [suggested, setSuggested] = useState<SocialAuthor[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, account_type, verification_status, professional_title")
        .eq("account_type", "provider")
        .order("created_at", { ascending: false })
        .limit(6);
      setSuggested((data as SocialAuthor[]) ?? []);
    })();
  }, []);

  return (
    <PublicLayout>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[260px_1fr_280px] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {user && (
              <Link to={profilePath({ username: profile?.username ?? null, id: user.id })} className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 hover:bg-muted/40">
                <Avatar src={profile?.avatar_url} name={profile?.full_name} size={44} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{profile?.full_name || "Your profile"}</p>
                  <p className="truncate text-xs text-muted-foreground">{profile?.username ? `@${profile.username}` : "View profile"}</p>
                </div>
              </Link>
            )}
            <nav className="rounded-3xl border border-border bg-card p-2 text-sm">
              <Link to="/directory" className="flex items-center gap-2 rounded-2xl px-3 py-2.5 hover:bg-muted"><Users className="h-4 w-4" /> Directory</Link>
              <Link to="/find-professionals" className="flex items-center gap-2 rounded-2xl px-3 py-2.5 hover:bg-muted"><TrendingUp className="h-4 w-4" /> Find professionals</Link>
              <Link to="/categories" className="flex items-center gap-2 rounded-2xl px-3 py-2.5 hover:bg-muted"><Sparkles className="h-4 w-4" /> Categories</Link>
            </nav>
          </div>
        </aside>

        <main>
          <h1 className="mb-5 font-display text-2xl font-bold">Community feed</h1>
          {!user && (
            <div className="mb-5 rounded-3xl border border-border bg-card p-5 text-sm">
              <p className="font-semibold">Join the conversation</p>
              <p className="mt-1 text-muted-foreground">Sign in to post, like, comment and follow professionals.</p>
              <div className="mt-3 flex gap-2">
                <Link to="/login" className="rounded-full border border-border px-5 py-2 text-sm font-medium">Sign in</Link>
                <Link to="/signup" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Create account</Link>
              </div>
            </div>
          )}
          <Feed composer={!!user} empty="Nothing here yet. Be the first to share something." />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display text-sm font-semibold">Professionals to follow</h2>
            <ul className="mt-4 space-y-3">
              {suggested.map((s) => (
                <li key={s.id}>
                  <Link to={profilePath(s)} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-muted/50">
                    <Avatar src={s.avatar_url} name={s.full_name || s.username} size={38} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s.full_name || s.username}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.professional_title || "Provider"}</p>
                    </div>
                  </Link>
                </li>
              ))}
              {!suggested.length && <li className="text-xs text-muted-foreground">No providers yet.</li>}
            </ul>
          </div>
        </aside>
      </div>
    </PublicLayout>
  );
}
