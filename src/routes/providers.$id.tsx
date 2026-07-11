import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Star, MessageCircle, Phone, Calendar, Award, Briefcase, Clock } from "lucide-react";
import { PublicLayout } from "../components/site/PublicLayout";
import { PROVIDERS } from "../lib/data";

export const Route = createFileRoute("/providers/$id")({
  loader: ({ params }) => {
    const p = PROVIDERS.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.p.name} — ${loaderData.p.profession} | Asá` }, { name: "description", content: loaderData.p.bio }]
      : [{ title: "Provider — Asá" }],
  }),
  notFoundComponent: () => (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Provider not found</h1>
        <Link to="/find-professionals" className="mt-6 inline-block text-primary hover:underline">Browse providers →</Link>
      </div>
    </PublicLayout>
  ),
  component: ProviderPage,
});

function ProviderPage() {
  const { p } = Route.useLoaderData();
  const gallery = [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900",
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900",
  ];
  const reviews = [
    { name: "Ada N.", rating: 5, text: "Punctual, professional, delivered above expectation.", date: "2 weeks ago" },
    { name: "Bola A.", rating: 5, text: "Best in the game. Booking again for sure.", date: "1 month ago" },
    { name: "Chike E.", rating: 4, text: "Solid work. Communication could be a bit faster.", date: "2 months ago" },
  ];
  return (
    <PublicLayout>
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <img src={p.cover} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-20 rounded-3xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <img src={p.avatar} alt={p.name} className="h-28 w-28 rounded-3xl border-4 border-card object-cover shadow-md sm:h-36 sm:w-36" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold sm:text-4xl">{p.name}</h1>
                {p.verified && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary"><CheckCircle2 className="h-3 w-3" /> Verified</span>}
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.available ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${p.available ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                  {p.available ? "Available now" : "Busy"}
                </span>
              </div>
              <p className="mt-1 text-lg text-muted-foreground">{p.profession}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{p.location}</span>
                <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" /><b className="text-foreground">{p.rating}</b> ({p.reviews} reviews)</span>
                <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" />{p.jobs} jobs</span>
                <span className="inline-flex items-center gap-1"><Award className="h-4 w-4" />{p.years} yrs experience</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-muted"><MessageCircle className="h-4 w-4" />Message</button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-muted"><Phone className="h-4 w-4" />Call</button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"><Calendar className="h-4 w-4" />Book now</button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <Section title="About">
              <p className="leading-relaxed text-foreground/85">{p.bio}</p>
            </Section>
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {p.skills.map((s: string) => <span key={s} className="rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-medium">{s}</span>)}
              </div>
            </Section>
            <Section title="Portfolio">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((g, i) => (
                  <div key={i} className="group aspect-square overflow-hidden rounded-2xl">
                    <img src={g} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </Section>
            <Section title={`Reviews (${p.reviews})`}>
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.name}</p>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5 text-gold">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold" />)}</div>
                    <p className="mt-2 text-sm text-foreground/85">{r.text}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Starting price</p>
              <p className="mt-1 font-display text-3xl font-bold text-primary">{p.price}</p>
              <button className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Book now</button>
              <button className="mt-2 w-full rounded-full border border-border py-3 text-sm font-semibold hover:bg-muted">Save to favorites</button>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="mb-3 text-sm font-semibold">Availability</p>
              <div className="space-y-2 text-sm">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                  <div key={d} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{d}</span>
                    <span className="inline-flex items-center gap-1 text-xs"><Clock className="h-3 w-3" />{i === 6 ? "Off" : "9:00 – 18:00"}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="h-20" />
    </PublicLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
