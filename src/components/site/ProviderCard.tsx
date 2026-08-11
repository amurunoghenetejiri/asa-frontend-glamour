import { Link } from "@tanstack/react-router";
import { MapPin, Star, BadgeCheck, Sparkles } from "lucide-react";
import { Avatar, SignedImg } from "@/components/social/media";
import { HireNowButton } from "./HireActions";

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
  hourly_rate?: number | null;
};

export function ProviderCard({ p, compact = false }: { p: ProviderCardData; compact?: boolean }) {
  const initials = (p.name || "?").slice(0, 1).toUpperCase();
  const coverSrc = p.cover || null;

  return (
    <article className="surface-card card-hover group animate-fade-in-soft flex flex-col overflow-hidden">
      <Link to="/providers/$id" params={{ id: p.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {coverSrc ? (
            <SignedImg
              src={coverSrc}
              alt={p.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : p.avatar_url ? (
            <div className="grid h-full w-full place-items-center bg-primary-soft">
              <Avatar src={p.avatar_url} name={p.name} size={72} />
            </div>
          ) : (
            <div className="grid h-full w-full place-items-center bg-primary-soft">
              <span className="font-display text-4xl font-bold text-primary">{initials}</span>
            </div>
          )}
          {p.verified && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-soft">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to="/providers/$id" params={{ id: p.id }} className="flex min-w-0 items-center gap-3">
          <Avatar src={p.avatar_url} name={p.name} size={40} />
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold transition-colors group-hover:text-primary">{p.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{p.profession || "Professional"}</p>
          </div>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex min-w-0 items-center gap-1 truncate text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {p.location || "Nigeria"}
          </span>
          {typeof p.rating === "number" && p.rating > 0 ? (
            <span className="inline-flex shrink-0 items-center gap-1 font-semibold">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              {p.rating.toFixed(1)}
              {p.reviews ? <span className="text-muted-foreground">({p.reviews})</span> : null}
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground">
              <Sparkles className="h-3 w-3" /> New
            </span>
          )}
        </div>

        {!compact && (
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
            <span className="truncate text-xs text-muted-foreground">
              {p.years ? `${p.years} yr${p.years === 1 ? "" : "s"} experience` : "Available now"}
            </span>
            {p.price && <span className="shrink-0 text-sm font-bold">{p.price}</span>}
          </div>
        )}

        <HireNowButton
          provider={{
            id: p.id,
            name: p.name,
            avatar_url: p.avatar_url,
            profession: p.profession,
            hourly_rate: p.hourly_rate ?? null,
          }}
          className="btn-primary mt-4 w-full px-4 py-2.5 text-sm"
        />
      </div>
    </article>
  );
}
