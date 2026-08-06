import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, BadgeCheck, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Avatar } from "@/components/social/media";
import { supabase } from "@/integrations/supabase/client";
import { profilePath } from "@/lib/social";
import { STATES } from "@/lib/data";

export const Route = createFileRoute("/directory")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Member Directory — Discover people on Asá" },
      { name: "description", content: "Browse every verified professional and member on Asá. Filter by profession, state and account type." },
      { property: "og:title", content: "Member Directory — Asá" },
      { property: "og:description", content: "Discover verified professionals and members across Nigeria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Directory,
});

type Row = {
  id: string; full_name: string | null; username: string | null; avatar_url: string | null; professional_title: string | null;
  profession: string | null; city: string | null; state: string | null; account_type: "customer" | "provider"; verification_status: string;
};

function Directory() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "provider" | "customer">("all");
  const [state, setState] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, professional_title, profession, city, state, account_type, verification_status")
        .order("created_at", { ascending: false })
        .limit(200);
      if (type !== "all") query = query.eq("account_type", type);
      if (state) query = query.eq("state", state);
      const { data } = await query;
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, [type, state]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      [r.full_name, r.username, r.professional_title, r.profession, r.city, r.state].filter(Boolean).some((v) => v!.toLowerCase().includes(term)),
    );
  }, [rows, q]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <h1 className="font-display text-3xl font-bold">Member directory</h1>
        <p className="mt-2 text-muted-foreground">Discover professionals and members across Nigeria.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, handle, profession…" className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-primary" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="h-12 rounded-full border border-border bg-card px-4 text-sm">
            <option value="all">Everyone</option>
            <option value="provider">Providers</option>
            <option value="customer">Customers</option>
          </select>
          <select value={state} onChange={(e) => setState(e.target.value)} className="h-12 rounded-full border border-border bg-card px-4 text-sm">
            <option value="">All states</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{loading ? "Loading…" : `${filtered.length} member${filtered.length === 1 ? "" : "s"}`}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link key={r.id} to={profilePath(r)} className="group rounded-3xl border border-border bg-card p-5 transition hover:border-primary/50 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <Avatar src={r.avatar_url} name={r.full_name || r.username} size={52} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-semibold group-hover:text-primary">{r.full_name || r.username || "Asá user"}</p>
                    {r.verification_status === "verified" && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{r.professional_title || r.profession || (r.account_type === "provider" ? "Provider" : "Customer")}</p>
                </div>
              </div>
              {(r.city || r.state) && (
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {[r.city, r.state].filter(Boolean).join(", ")}</p>
              )}
            </Link>
          ))}
        </div>

        {!loading && !filtered.length && (
          <div className="mt-6 rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No members match your filters.</div>
        )}
      </div>
    </PublicLayout>
  );
}
