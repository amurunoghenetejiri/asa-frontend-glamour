import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, user, refresh } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", city: "", state: "", avatar_url: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
  }, [profile]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    refresh();
  };

  const changePassword = async () => {
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error(error.message);
    setPassword("");
    toast.success("Password updated");
  };

  const initials = (form.full_name || user?.email || "?").slice(0, 1).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <form onSubmit={save} className="rounded-3xl border border-border bg-card p-8">
        <div className="flex items-center gap-5">
          {form.avatar_url ? (
            <img src={form.avatar_url} className="h-24 w-24 rounded-2xl object-cover" alt="" />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground">{initials}</div>
          )}
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold">{form.full_name || user?.email}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <input className="mt-3 h-9 w-full rounded-lg border border-border bg-muted/50 px-3 text-xs" placeholder="Paste photo URL" value={form.avatar_url} onChange={set("avatar_url")} />
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><input className="ainput" value={form.full_name} onChange={set("full_name")} /></Field>
          <Field label="Phone"><input className="ainput" value={form.phone} onChange={set("phone")} /></Field>
          <Field label="Address"><input className="ainput" value={form.address} onChange={set("address")} /></Field>
          <Field label="City"><input className="ainput" value={form.city} onChange={set("city")} /></Field>
          <Field label="State"><input className="ainput" value={form.state} onChange={set("state")} /></Field>
        </div>
        <button disabled={loading} className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Saving…" : "Save changes"}</button>
      </form>

      <div className="rounded-3xl border border-border bg-card p-8">
        <h3 className="font-display text-lg font-semibold">Change password</h3>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password — at least 8 characters.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input type="password" placeholder="New password" className="ainput flex-1 min-w-[220px]" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={changePassword} className="rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">Update</button>
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
