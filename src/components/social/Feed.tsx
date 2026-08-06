import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { fetchPosts, type FeedPost } from "@/lib/social";
import { PostCard } from "./PostCard";
import { PostComposer } from "./PostComposer";

export function Feed({ userId, composer = true, empty = "No posts yet." }: { userId?: string; composer?: boolean; empty?: string }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setPosts(await fetchPosts({ userId, viewerId: user?.id ?? null }));
    } finally {
      setLoading(false);
    }
  }, [userId, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      {composer && <PostComposer onPosted={load} />}
      {loading ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : posts.length ? (
        posts.map((p) => <PostCard key={p.id} post={p} onChanged={load} />)
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">{empty}</div>
      )}
    </div>
  );
}
