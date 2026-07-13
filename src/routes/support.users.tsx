import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

type Row = { id: string; full_name: string | null; email: string | null; phone: string | null; city: string | null; state: string | null; status: string; created_at: string };

export const Route = createFileRoute("/support/users")({
  component: () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [q, setQ] = useState("");
    useEffect(() => {
      supabase.from("profiles").select("id, full_name, email, phone, city, state, status, created_at").order("created_at", { ascending: false })
        .then(({ data }) => setRows((data ?? []) as Row[]));
    }, []);
    const filtered = rows.filter((r) => !q || r.full_name?.toLowerCase().includes(q.toLowerCase()) || r.email?.toLowerCase().includes(q.toLowerCase()));
    return (
      <div className="space-y-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users" className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No users found.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium">{r.full_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{[r.city, r.state].filter(Boolean).join(", ") || "—"}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${r.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
