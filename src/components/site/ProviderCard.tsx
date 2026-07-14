import { Link } from "@tanstack/react-router";
import { MapPin, Star, CheckCircle2, Sparkles } from "lucide-react";

export type ProviderCardData = {
  id: string;
  name: string;
  profession: string | null;
  location: string | null;
  avatar_url: string | null;
  cover?: string | null;
  verified?: boolean;
  rating?: number | null;
  reviews?: number | null;
  price?: string | null;
  years?: number | null;
};

const COVER_FALLBACK =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=60";

export function ProviderCard({ p, compact = false }: { p: ProviderCardData; compact?: boolean }) {
  const initials = (p.name || "?").slice(0, 1).toUpperCase();
  return (
    <Link
      to="/providers/$id"
      params={{ id: p.id }}
      className="card-hover group block overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="relative h-36 overflow-hidden bg-muted">
        <img
          src={p.cover || COVER_FALLBACK}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {p.verified && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-primary shadow">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </span>
        )}
      </div>
      <div className="relative px-5 pb-5">
        {p.avatar_url ? (
          <img src={p.avatar_url} alt={p.name} className="absolute -top-8 h-16 w-16 rounded-2xl border-4 border-card object-cover shadow-md" />
        ) : (
          <div className="absolute -top-8 grid h-16 w-16 place-items-center rounded-2xl border-4 border-card bg-primary text-lg font-bold text-primary-foreground shadow-md">
            {initials}
          </div>
        )}
        <div className="pt-10">
          <h3 className="font-display text-lg font-bold">{p.name}</h3>
          <p className="text-sm text-muted-foreground">{p.profession || "Professional"}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex min-w-0 items-center gap-1 truncate text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {p.location || "Nigeria"}
            </span>
            {typeof p.rating === "number" && p.rating > 0 ? (
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                {p.rating.toFixed(1)}
                {p.reviews ? <span className="text-muted-foreground">({p.reviews})</span> : null}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Sparkles className="h-3 w-3" /> New
              </span>
            )}
          </div>
          {!compact && (
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                {p.years ? `${p.years} yr${p.years === 1 ? "" : "s"} exp.` : "Available"}
              </span>
              <span className="text-sm font-bold text-primary">{p.price || "Contact"}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
