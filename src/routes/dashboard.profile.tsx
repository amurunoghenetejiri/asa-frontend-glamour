import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, validateFile } from "@/lib/media";
import { Avatar, SignedImg, SignedVideo } from "@/components/social/media";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

type PortfolioItem = {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: "image" | "video";
};

function ProfilePage() {
  const { profile, user, refresh } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    phone: "",
    bio: "",
    professional_title: "",
    profession: "",
    address: "",
    city: "",
    lga: "",
    state: "",
    gender: "",
    date_of_birth: "",
    languages: "",
    skills: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"avatar" | "cover" | "portfolio" | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const workRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      username: profile.username ?? "",
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
      professional_title: profile.professional_title ?? "",
      profession: profile.profession ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      lga: profile.lga ?? "",
      state: profile.state ?? "",
      gender: profile.gender ?? "",
      date_of_birth: profile.date_of_birth ?? "",
      languages: (profile.languages ?? []).join(", "),
      skills: (profile.skills ?? []).join(", "),
    });
  }, [profile]);

  const loadPortfolio = async (uid: string) => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("id, title, description, media_url, media_type")
      .eq("user_id", uid)
      .order("sort_order");
    setItems((data as PortfolioItem[]) ?? []);
  };

  useEffect(() => {
    if (user) loadPortfolio(user.id);
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({
      ...form,
      [k]: k === "username" ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") : e.target.value,
    });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (form.username && !/^[a-z0-9_]{3,20}$/.test(form.username)) {
      return toast.error("Username must be 3-20 characters: letters, numbers or underscores.");
    }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        username: form.username || null,
        phone: form.phone,
        bio: form.bio,
        professional_title: form.professional_title,
        profession: form.profession,
        address: form.address,
        city: form.city,
        lga: form.lga,
        state: form.state,
        gender: form.gender || null,
        date_of_birth: form.date_of_birth || null,
        languages: form.languages ? form.languages.split(",").map((s) => s.trim()).filter(Boolean) : [],
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      })
      .eq("id", user.id);
    setLoading(false);
    if (error) return toast.error(error.message.includes("duplicate") ? "That username is taken." : error.message);
    toast.success("Profile updated");
    refresh();
  };

  const pickPhoto = (kind: "avatar" | "cover") => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    const err = validateFile(file, "image");
    if (err) return toast.error(err);
    setUploading(kind);
    try {
      const ref = await uploadMedia("avatars", user.id, file);
      const { error } = await supabase
        .from("profiles")
        .update(kind === "avatar" ? { avatar_url: ref } : { cover_url: ref })
        .eq("id", user.id);
      if (error) throw error;
      toast.success(kind === "avatar" ? "Photo updated" : "Cover updated");
      refresh();
    } catch (err2) {
      toast.error(err2 instanceof Error ? err2.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const addWork = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    const isVideo = file.type.startsWith("video/");
    const err = validateFile(file, isVideo ? "video" : "image");
    if (err) return toast.error(err);
    setUploading("portfolio");
    try {
      const ref = await uploadMedia("portfolio", user.id, file);
      const { error } = await supabase.from("portfolio_items").insert({
        user_id: user.id,
        media_url: ref,
        media_type: isVideo ? "video" : "image",
        title: file.name.replace(/\.[^.]+$/, ""),
        sort_order: items.length,
      });
      if (error) throw error;
      await loadPortfolio(user.id);
      toast.success("Work added");
    } catch (err2) {
      toast.error(err2 instanceof Error ? err2.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const removeWork = async (id: string) => {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (user) loadPortfolio(user.id);
  };

  const changePassword = async () => {
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error(error.message);
    setPassword("");
    toast.success("Password updated");
  };

  const displayName = form.full_name || user?.email || "You";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <form onSubmit={save} className="overflow-hidden rounded-3xl border border-border bg-card">
        {/* Cover + overlapping avatar */}
        <div className="relative">
          <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/25 via-primary/10 to-gold/20 sm:h-52">
            {profile?.cover_url ? (
              <SignedImg
                src={profile.cover_url}
                alt="Cover"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            ) : null}
            <input ref={coverRef} type="file" accept="image/*" hidden onChange={pickPhoto("cover")} />
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              className="absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur sm:right-4 sm:top-4 sm:px-4 sm:py-2"
            >
              {uploading === "cover" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
              Cover photo
            </button>
          </div>

          <div className="relative z-10 -mt-14 flex flex-col items-start gap-3 px-5 sm:-mt-16 sm:flex-row sm:items-end sm:gap-5 sm:px-8">
            <div className="relative shrink-0">
              <div className="overflow-hidden rounded-full border-4 border-card bg-card shadow-md">
                <Avatar src={profile?.avatar_url} name={displayName} size={112} className="!block object-cover" />
              </div>
              <input ref={avatarRef} type="file" accept="image/*" hidden onChange={pickPhoto("avatar")} />
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full border border-border bg-background shadow hover:bg-muted"
              >
                {uploading === "avatar" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="min-w-0 flex-1 pb-1 pt-1 sm:pb-2">
              <h2 className="truncate font-display text-2xl font-bold">{displayName}</h2>
              <p className="truncate text-sm text-muted-foreground">
                {form.username ? `@${form.username}` : user?.email}
              </p>
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-muted"
              >
                {uploading === "avatar" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
                Change photo
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 pt-6 sm:p-8 sm:pt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input className="ainput" value={form.full_name} onChange={set("full_name")} />
            </Field>
            <Field label="Username">
              <input className="ainput" placeholder="janedoe" value={form.username} onChange={set("username")} />
            </Field>
            <Field label="Headline">
              <input
                className="ainput"
                placeholder="Master Electrician · Lagos"
                value={form.professional_title}
                onChange={set("professional_title")}
              />
            </Field>
            <Field label="Profession">
              <input className="ainput" value={form.profession} onChange={set("profession")} />
            </Field>
            <Field label="Phone">
              <input className="ainput" value={form.phone} onChange={set("phone")} />
            </Field>
            <Field label="Date of birth">
              <input type="date" className="ainput" value={form.date_of_birth} onChange={set("date_of_birth")} />
            </Field>
            <Field label="Gender">
              <select className="ainput" value={form.gender} onChange={set("gender")}>
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Languages (comma separated)">
              <input className="ainput" value={form.languages} onChange={set("languages")} />
            </Field>
            <Field label="Address">
              <input className="ainput" value={form.address} onChange={set("address")} />
            </Field>
            <Field label="City">
              <input className="ainput" value={form.city} onChange={set("city")} />
            </Field>
            <Field label="LGA">
              <input className="ainput" value={form.lga} onChange={set("lga")} />
            </Field>
            <Field label="State">
              <input className="ainput" value={form.state} onChange={set("state")} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Skills (comma separated)">
                <input className="ainput" value={form.skills} onChange={set("skills")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Bio">
                <textarea rows={4} className="ainput h-auto py-3" value={form.bio} onChange={set("bio")} />
              </Field>
            </div>
          </div>
          <button
            disabled={loading}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <div className="rounded-3xl border border-border bg-card p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Portfolio</h3>
            <p className="mt-1 text-sm text-muted-foreground">Showcase your best work — photos or short videos.</p>
          </div>
          <input ref={workRef} type="file" accept="image/*,video/*" hidden onChange={addWork} />
          <button
            type="button"
            onClick={() => workRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            {uploading === "portfolio" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add work
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((it) => (
            <div key={it.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-border">
              {it.media_type === "video" ? (
                <SignedVideo src={it.media_url} className="h-full w-full bg-black object-cover" />
              ) : (
                <SignedImg src={it.media_url} className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeWork(it.id)}
                aria-label="Delete item"
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {!items.length && <p className="col-span-full text-sm text-muted-foreground">No portfolio items yet.</p>}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8">
        <h3 className="font-display text-lg font-semibold">Change password</h3>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password — at least 8 characters.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            type="password"
            placeholder="New password"
            className="ainput min-w-[220px] flex-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={changePassword}
            className="rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
