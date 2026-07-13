import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Search } from "lucide-react";

type Row = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  status: "active" | "suspended";
  last_login: string | null;
  created_at: string;
  roles: string[];
};

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const { roles } = useAuth();
  const isSuper = roles.includes("super_admin");
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: profs } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: rs } = await supabase.from("user_roles").select("user_id, role");
    const roleMap: Record<string, string[]> = {};
    (rs ?? []).forEach((r: { user_id: string; role: string }) => {
      (roleMap[r.user_id] ||= []).push(r.role);
    });
    setRows(((profs ?? []) as Omit<Row, "roles">[]).map((p) => ({ ...p, roles: roleMap[p.id] ?? [] })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleStatus = async (r: Row) => {
    const next = r.status === "active" ? "suspended" : "active";
    const { error } = await supabase.from("profiles").update({ status: next }).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success(`Account ${next}`);
    load();
  };

  const grantRole = async (userId: string, role: "admin" | "support_agent" | "provider") => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`);
    load();
  };

  const revokeRole = async (userId: string, role: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as "admin" | "support_agent" | "provider");
    if (error) return toast.error(error.message);
    toast.success(`Revoked ${role}`);
    load();
  };

  const filtered = rows.filter((r) => {
    if (q && !(r.full_name?.toLowerCase().includes(q.toLowerCase()) || r.email?.toLowerCase().includes(q.toLowerCase()))) return false;
    if (roleFilter !== "all" && !r.roles.includes(roleFilter)) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-11 rounded-full border border-border bg-card px-4 text-sm">
          <option value="all">All roles</option>
          <option value="customer">Customers</option>
          <option value="provider">Providers</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
          <option value="support_agent">Support</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 rounded-full border border-border bg-card px-4 text-sm">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No users match your filters.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {r.avatar_url ? <img src={r.avatar_url} className="h-9 w-9 rounded-full object-cover" alt="" /> : <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{(r.full_name || r.email || "?").slice(0, 1).toUpperCase()}</div>}
                      <div className="min-w-0">
                        <p className="truncate font-medium">{r.full_name || "—"}</p>
                        <p className="truncate text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.phone || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{[r.city, r.state].filter(Boolean).join(", ") || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.roles.map((role) => (
                        <span key={role} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">{role.replace("_", " ")}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${r.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      <button onClick={() => toggleStatus(r)} className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted">{r.status === "active" ? "Suspend" : "Reactivate"}</button>
                      {isSuper && (
                        <>
                          {!r.roles.includes("admin") ? (
                            <button onClick={() => grantRole(r.id, "admin")} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">+ Admin</button>
                          ) : (
                            <button onClick={() => revokeRole(r.id, "admin")} className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600">− Admin</button>
                          )}
                          {!r.roles.includes("support_agent") ? (
                            <button onClick={() => grantRole(r.id, "support_agent")} className="rounded-full border border-border px-3 py-1 text-xs font-medium">+ Support</button>
                          ) : (
                            <button onClick={() => revokeRole(r.id, "support_agent")} className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600">− Support</button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
