import { supabase } from "@/integrations/supabase/client";

export type SocialAuthor = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  account_type: "customer" | "provider";
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  professional_title: string | null;
};

export type PostMedia = { id: string; url: string; media_type: "image" | "video"; sort_order: number };

export type FeedPost = {
  id: string;
  user_id: string;
  content: string | null;
  created_at: string;
  shared_post_id: string | null;
  media: PostMedia[];
  author: SocialAuthor | null;
  shared?: FeedPost | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  likedByMe: boolean;
};

const AUTHOR_COLS = "id, full_name, username, avatar_url, account_type, verification_status, professional_title";

export async function fetchAuthors(ids: string[]): Promise<Map<string, SocialAuthor>> {
  const map = new Map<string, SocialAuthor>();
  const unique = [...new Set(ids)].filter(Boolean);
  if (!unique.length) return map;
  const { data } = await supabase.from("profiles").select(AUTHOR_COLS).in("id", unique);
  for (const p of (data ?? []) as SocialAuthor[]) map.set(p.id, p);
  return map;
}

export async function fetchPosts(opts: { userId?: string; viewerId?: string | null; limit?: number } = {}): Promise<FeedPost[]> {
  let q = supabase
    .from("posts")
    .select("id, user_id, content, created_at, shared_post_id, post_media(id, url, media_type, sort_order)")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 40);
  if (opts.userId) q = q.eq("user_id", opts.userId);
  const { data, error } = await q;
  if (error) throw error;

  const rows = (data ?? []) as unknown as (Omit<FeedPost, "media" | "author" | "likeCount" | "commentCount" | "shareCount" | "likedByMe"> & {
    post_media: PostMedia[];
  })[];
  if (!rows.length) return [];

  const sharedIds = rows.map((r) => r.shared_post_id).filter(Boolean) as string[];
  const { data: sharedRows } = sharedIds.length
    ? await supabase
        .from("posts")
        .select("id, user_id, content, created_at, shared_post_id, post_media(id, url, media_type, sort_order)")
        .in("id", sharedIds)
    : { data: [] };

  const allRows = [...rows, ...((sharedRows ?? []) as typeof rows)];
  const ids = allRows.map((r) => r.id);
  const authors = await fetchAuthors(allRows.map((r) => r.user_id));

  const [likes, comments, shares] = await Promise.all([
    supabase.from("post_likes").select("post_id, user_id").in("post_id", ids),
    supabase.from("post_comments").select("post_id").in("post_id", ids),
    supabase.from("post_shares").select("post_id").in("post_id", ids),
  ]);

  const count = (arr: { post_id: string }[] | null, id: string) => (arr ?? []).filter((x) => x.post_id === id).length;

  const build = (r: (typeof allRows)[number]): FeedPost => ({
    id: r.id,
    user_id: r.user_id,
    content: r.content,
    created_at: r.created_at,
    shared_post_id: r.shared_post_id,
    media: [...(r.post_media ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    author: authors.get(r.user_id) ?? null,
    likeCount: count(likes.data, r.id),
    commentCount: count(comments.data, r.id),
    shareCount: count(shares.data, r.id),
    likedByMe: !!opts.viewerId && (likes.data ?? []).some((l) => l.post_id === r.id && l.user_id === opts.viewerId),
  });

  const sharedMap = new Map(((sharedRows ?? []) as typeof rows).map((r) => [r.id, build(r)]));
  return rows.map((r) => ({ ...build(r), shared: r.shared_post_id ? sharedMap.get(r.shared_post_id) ?? null : null }));
}

export type PostComment = { id: string; post_id: string; user_id: string; content: string; created_at: string; author: SocialAuthor | null };

export async function fetchComments(postId: string): Promise<PostComment[]> {
  const { data } = await supabase
    .from("post_comments")
    .select("id, post_id, user_id, content, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  const rows = (data ?? []) as Omit<PostComment, "author">[];
  const authors = await fetchAuthors(rows.map((r) => r.user_id));
  return rows.map((r) => ({ ...r, author: authors.get(r.user_id) ?? null }));
}

export function profilePath(a: { username: string | null; id: string } | null | undefined) {
  if (!a) return "/directory";
  return `/u/${a.username || a.id}`;
}

export function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
