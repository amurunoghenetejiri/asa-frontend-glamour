import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = { user_id: string; role: string; profile: { full_name: string | null; email: string | null; avatar_url: string | null } | null };

export const Route = createFileRoute("/super-admin/team")({
  component: TeamPage,
});

function TeamPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("user_roles").select("user_id, role").in("role", ["admin", "super_admin", "support_agent"]);
      const ids = Array.from(new Set((data ?? []).map((r: { user_id: string }) => r.user_id)));
      const { data: profiles } = ids.length ? await supabase.from("profiles").select("id, full_name, email, avatar_url").in("id", ids) : { data: [] as { id: string; full_name: string | null; email: string | null; avatar_url: string | null }[] };
      const pmap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
      setRows((data ?? []).map((r: { user_id: string; role: string }) => ({ user_id: r.user_id, role: r.role, profile: pmap[r.user_id] ?? null })));
    })();
  }, []);
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Admin team</h3>
        <p className="text-sm text-muted-foreground">Everyone holding an Admin, Super Admin or Support Agent role. Manage assignments from the Users page.</p>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No admin team members yet.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((r, i) => (
            <div key={`${r.user_id}-${r.role}-${i}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              {r.profile?.avatar_url ? <img src={r.profile.avatar_url} className="h-10 w-10 rounded-full object-cover" alt="" /> : <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary">{(r.profile?.full_name || r.profile?.email || "?").slice(0, 1).toUpperCase()}</div>}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{r.profile?.full_name || r.profile?.email || r.user_id}</p>
                <p className="truncate text-xs text-muted-foreground uppercase tracking-wider">{r.role.replace("_", " ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
