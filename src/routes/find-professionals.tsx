import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, SlidersHorizontal, Loader2 } from "lucide-react";
import { PublicLayout } from "../components/site/PublicLayout";
import { STATES } from "../lib/data";
import { ProviderCard, type ProviderCardData } from "../components/site/ProviderCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/find-professionals")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Find Professionals — Asá" },
      { name: "description", content: "Search verified professionals near you across Nigeria." },
    ],
  }),
  component: FindPros,
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  profession: string | null;
  professional_title: string | null;
  city: string | null;
  state: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  verification_status: string | null;
};

type Category = { id: string; slug: string; name: string };

function toCard(r: ProfileRow): ProviderCardData {
  return {
    id: r.id,
    name: r.full_name || "Provider",
    profession: r.profession || r.professional_title,
    location: [r.city, r.state].filter(Boolean).join(", ") || null,
    avatar_url: r.avatar_url,
    cover: r.cover_url,
    verified: r.verification_status === "verified",
    rating: null,
    reviews: null,
    price: r.hourly_rate ? "₦" + Number(r.hourly_rate).toLocaleString() + "/hr" : null,
    years: r.years_experience ?? null,
  };
}

function FindPros() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, slug, name")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let query = supabase
        .from("profiles")
        .select(
          "id, full_name, avatar_url, cover_url, profession, professional_title, city, state, years_experience, hourly_rate, verification_status",
        )
        .eq("is_provider", true)
        .order("created_at", { ascending: false })
        .limit(100);

      if (state) query = query.eq("state", state);
      if (city.trim()) query = query.ilike("city", "%" + city.trim() + "%");

      const { data, error } = await query;
      if (cancelled) return;
      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows((data as ProfileRow[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [state, city]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const cat = category.trim().toLowerCase();
    return rows.filter((r) => {
      const hay = [r.full_name, r.profession, r.professional_title, r.city, r.state]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (term && !hay.includes(term)) return false;
      if (
        cat &&
        !(r.profession || "").toLowerCase().includes(cat) &&
        !(r.professional_title || "").toLowerCase().includes(cat)
      ) {
        return false;
      }
      return true;
    });
  }, [rows, q, category]);

  return (
    <PublicLayout>
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Find your professional</h1>
          <p className="mt-3 text-white/80">Live providers from across Nigeria. Verified. Ready to work.</p>
          <div className="mt-8 grid gap-2 rounded-3xl bg-white/10 p-2 backdrop-blur md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Profession or keyword"
                className="h-12 w-full rounded-2xl bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-gold/60"
              />
            </div>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl bg-white/10 pl-11 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-gold/60"
              >
                <option className="text-foreground" value="">
                  All states
                </option>
                {STATES.map((s) => (
                  <option key={s} className="text-foreground" value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City / Area"
              className="h-12 w-full rounded-2xl bg-white/10 px-4 text-sm text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-gold/60"
            />
            <button
              type="button"
              className="h-12 rounded-2xl bg-gold px-6 text-sm font-semibold text-[#3a2b06] hover:brightness-110"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </div>
          <div className="space-y-5 text-sm">
            <div>
              <p className="mb-2 font-medium">Category</p>
              <div className="max-h-56 space-y-1.5 overflow-auto pr-2">
                <label className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <input
                    type="radio"
                    name="cat"
                    checked={category === ""}
                    onChange={() => setCategory("")}
                    className="accent-primary"
                  />
                  All
                </label>
                {categories.map((c) => (
                  <label key={c.slug} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <input
                      type="radio"
                      name="cat"
                      checked={category === c.name}
                      onChange={() => setCategory(c.name)}
                      className="accent-primary"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium">State</p>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="">All states</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {loading ? "Loading…" : list.length + " professionals found"}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <p className="font-display text-xl font-bold">No professionals yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Be the first in this area — or try another state.
              </p>
              <button
                type="button"
                onClick={() => navigate({ to: "/become-a-provider" })}
                className="mt-6 inline-flex h-11 items-center rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground"
              >
                Become a provider
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {list.map((p) => (
                <ProviderCard key={p.id} p={toCard(p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
