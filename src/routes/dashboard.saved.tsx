import { createFileRoute } from "@tanstack/react-router";
import { PROVIDERS } from "../lib/data";
import { ProviderCard, type ProviderCardData } from "../components/site/ProviderCard";

const toCard = (p: typeof PROVIDERS[number]): ProviderCardData => ({
  id: p.id, name: p.name, profession: p.profession, location: p.location,
  avatar_url: p.avatar, cover: p.cover, verified: p.verified, rating: p.rating,
  reviews: p.reviews, price: p.price, years: p.years,
});

export const Route = createFileRoute("/dashboard/saved")({
  component: () => (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">{PROVIDERS.length} saved providers</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map((p) => <ProviderCard key={p.id} p={toCard(p)} />)}
      </div>
    </div>
  ),
});
