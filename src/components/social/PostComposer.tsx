import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Video, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { uploadMedia, validateFile } from "@/lib/media";
import { Avatar } from "./media";

type Pending = { file: File; preview: string; kind: "image" | "video" };

export function PostComposer({ onPosted }: { onPosted: () => void }) {
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<Pending[]>([]);
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const pick = (kind: "image" | "video") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    const next: Pending[] = [];
    for (const file of list) {
      const err = validateFile(file, kind);
      if (err) {
        toast.error(err);
        continue;
      }
      next.push({ file, preview: URL.createObjectURL(file), kind });
    }
    setFiles((f) => [...f, ...next].slice(0, 4));
    e.target.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !files.length) return toast.error("Write something or add a photo.");
    setBusy(true);
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .insert({ user_id: user.id, content: content.trim() || null })
        .select("id")
        .single();
      if (error) throw error;

      if (files.length) {
        const uploaded = await Promise.all(files.map((f) => uploadMedia("posts", user.id, f.file)));
        const { error: mErr } = await supabase.from("post_media").insert(
          uploaded.map((url, i) => ({ post_id: post.id, user_id: user.id, url, media_type: files[i]!.kind, sort_order: i })),
        );
        if (mErr) throw mErr;
      }

      setContent("");
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      onPosted();
      toast.success("Posted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish post");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-5">
      <div className="flex gap-3">
        <Avatar src={profile?.avatar_url} name={profile?.full_name} size={44} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          maxLength={3000}
          placeholder={`What's on your mind, ${profile?.full_name?.split(" ")[0] || "there"}?`}
          className="min-h-[60px] flex-1 resize-none bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </div>

      {!!files.length && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {files.map((f, i) => (
            <div key={f.preview} className="relative aspect-square overflow-hidden rounded-xl border border-border">
              {f.kind === "image" ? (
                <img src={f.preview} className="h-full w-full object-cover" alt="" />
              ) : (
                <video src={f.preview} className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                aria-label="Remove"
                onClick={() => setFiles((arr) => arr.filter((_, x) => x !== i))}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        <input ref={imgRef} type="file" accept="image/*" multiple hidden onChange={pick("image")} />
        <input ref={vidRef} type="file" accept="video/*" hidden onChange={pick("video")} />
        <button type="button" onClick={() => imgRef.current?.click()} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">
          <ImagePlus className="h-4 w-4" /> Photo
        </button>
        <button type="button" onClick={() => vidRef.current?.click()} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">
          <Video className="h-4 w-4" /> Video
        </button>
        <button disabled={busy} className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Post
        </button>
      </div>
    </form>
  );
}
