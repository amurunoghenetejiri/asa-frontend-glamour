import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, MessageCircle, Share2, BadgeCheck, Briefcase, Trash2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, SignedImg, SignedVideo } from "./media";
import { fetchComments, profilePath, timeAgo, type FeedPost, type PostComment } from "@/lib/social";

function AuthorLine({ post }: { post: FeedPost }) {
  const a = post.author;
  return (
    <div className="flex items-start gap-3">
      <Link to={profilePath(a)}>
        <Avatar src={a?.avatar_url} name={a?.full_name || a?.username} size={44} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1.5">
          <Link to={profilePath(a)} className="truncate font-semibold hover:underline">
            {a?.full_name || a?.username || "Asá user"}
          </Link>
          {a?.verification_status === "verified" && <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified" />}
          {a?.username && <span className="truncate text-xs text-muted-foreground">@{a.username}</span>}
          <span className="text-xs text-muted-foreground">· {timeAgo(post.created_at)}</span>
        </div>
        {a?.professional_title && <p className="truncate text-xs text-muted-foreground">{a.professional_title}</p>}
      </div>
    </div>
  );
}

function MediaGrid({ media }: { media: FeedPost["media"] }) {
  if (!media.length) return null;
  return (
    <div className={`mt-3 grid gap-1.5 overflow-hidden rounded-2xl ${media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
      {media.map((m) =>
        m.media_type === "video" ? (
          <SignedVideo key={m.id} src={m.url} className="max-h-[520px] w-full rounded-xl bg-black object-cover" />
        ) : (
          <SignedImg key={m.id} src={m.url} className="max-h-[520px] w-full rounded-xl object-cover" />
        ),
      )}
    </div>
  );
}

export function PostCard({ post, onChanged }: { post: FeedPost; onChanged: () => void }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [draft, setDraft] = useState("");
  const isProvider = post.author?.account_type === "provider";

  const requireAuth = () => {
    if (!user) {
      toast.error("Sign in to interact with posts.");
      return false;
    }
    return true;
  };

  const toggleLike = async () => {
    if (!requireAuth() || !user) return;
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    const { error } = next
      ? await supabase.from("post_likes").insert({ post_id: post.id, user_id: user.id })
      : await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", user.id);
    if (error) {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
      toast.error(error.message);
    }
  };

  const openComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next) setComments(await fetchComments(post.id));
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth() || !user || !draft.trim()) return;
    const { error } = await supabase.from("post_comments").insert({ post_id: post.id, user_id: user.id, content: draft.trim() });
    if (error) return toast.error(error.message);
    setDraft("");
    setComments(await fetchComments(post.id));
    onChanged();
  };

  const share = async () => {
    if (!requireAuth() || !user) return;
    const original = post.shared_post_id ?? post.id;
    const { error } = await supabase.from("posts").insert({ user_id: user.id, shared_post_id: original, content: null });
    if (error) return toast.error(error.message);
    await supabase.from("post_shares").insert({ post_id: original, user_id: user.id });
    toast.success("Shared to your profile");
    onChanged();
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast.success("Link copied");
  };

  const remove = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    onChanged();
  };

  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <AuthorLine post={post} />
        <div className="flex items-center gap-2">
          {isProvider && post.author && (
            <Link
              to={profilePath(post.author)}
              className="hidden rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 sm:inline-flex"
            >
              <Briefcase className="mr-1.5 h-3.5 w-3.5" /> Hire Me
            </Link>
          )}
          {user?.id === post.user_id && (
            <button onClick={remove} aria-label="Delete post" className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {post.content && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>}
      <MediaGrid media={post.media} />

      {post.shared && (
        <div className="mt-3 rounded-2xl border border-border bg-muted/30 p-4">
          <AuthorLine post={post.shared} />
          {post.shared.content && <p className="mt-2 whitespace-pre-wrap text-sm">{post.shared.content}</p>}
          <MediaGrid media={post.shared.media} />
        </div>
      )}

      <div className="mt-4 flex items-center gap-1 border-t border-border pt-3 text-sm">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-muted ${liked ? "text-red-500" : "text-muted-foreground"}`}>
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likes}
        </button>
        <button onClick={openComments} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted">
          <MessageCircle className="h-4 w-4" /> {post.commentCount}
        </button>
        <button onClick={share} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted">
          <Share2 className="h-4 w-4" /> {post.shareCount}
        </button>
        <button onClick={copyLink} className="ml-auto rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
          Copy link
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <Link to={profilePath(c.author)}>
                <Avatar src={c.author?.avatar_url} name={c.author?.full_name || c.author?.username} size={32} />
              </Link>
              <div className="rounded-2xl bg-muted/50 px-3 py-2">
                <Link to={profilePath(c.author)} className="text-xs font-semibold hover:underline">
                  {c.author?.full_name || c.author?.username || "Asá user"}
                </Link>
                <p className="text-sm">{c.content}</p>
                <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</span>
              </div>
            </div>
          ))}
          {!comments.length && <p className="text-xs text-muted-foreground">No comments yet — be the first.</p>}
          <form onSubmit={addComment} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment…"
              className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />
            <button className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Send comment">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
