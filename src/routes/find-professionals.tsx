import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { PublicLayout } from "../components/site/PublicLayout";
import { CATEGORIES, PROVIDERS, STATES } from "../lib/data";
import { ProviderCard, type ProviderCardData } from "../components/site/ProviderCard";

function toCard(p: typeof PROVIDERS[number]): ProviderCardData {
  return {
    id: p.id, name: p.name, profession: p.profession, location: p.location,
    avatar_url: p.avatar, cover: p.cover, verified: p.verified, rating: p.rating,
    reviews: p.reviews, price: p.price, years: p.years,
  };
}

export const Route = createFileRoute("/find-professionals")({
  head: () => ({ meta: [{ title: "Find Professionals — Asá" }, { name: "description", content: "Search verified professionals near you." }] }),
  component: FindPros,
});

function FindPros() {
  const [q, setQ] = useState("");
  const list = PROVIDERS.filter((p) => (q ? (p.name + p.profession).toLowerCase().includes(q.toLowerCase()) : true));
  return (
    <PublicLayout>
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Find your professional</h1>
          <p className="mt-3 text-white/80">Verified. Rated. Ready to work.</p>
          <div className="mt-8 grid gap-2 rounded-3xl bg-white/10 p-2 backdrop-blur md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Profession or keyword" className="h-12 w-full rounded-2xl bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-gold/60" />
            </div>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <select className="h-12 w-full appearance-none rounded-2xl bg-white/10 pl-11 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-gold/60">
                <option className="text-foreground" value="">State</option>
                {STATES.map((s) => <option key={s} className="text-foreground">{s}</option>)}
              </select>
            </div>
            <input placeholder="City / Area" className="h-12 w-full rounded-2xl bg-white/10 px-4 text-sm text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-gold/60" />
            <button className="h-12 rounded-2xl bg-gold px-6 text-sm font-semibold text-[#3a2b06] hover:brightness-110">Search</button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4" /> Filters</div>
          <div className="space-y-5 text-sm">
            <div>
              <p className="mb-2 font-medium">Category</p>
              <div className="space-y-1.5 max-h-56 overflow-auto pr-2">
                {CATEGORIES.map((c) => (
                  <label key={c.slug} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <input type="checkbox" className="accent-primary" /> {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium">Minimum rating</p>
              <input type="range" min={1} max={5} step={0.5} defaultValue={4} className="w-full accent-primary" />
            </div>
            <div>
              <p className="mb-2 font-medium">Availability</p>
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> Available now</label>
            </div>
          </div>
        </aside>
        <div>
          <p className="mb-4 text-sm text-muted-foreground">{list.length} professionals found</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {list.map((p) => <ProviderCard key={p.id} p={toCard(p)} />)}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
