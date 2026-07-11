import { createFileRoute } from "@tanstack/react-router";
import { PROVIDERS } from "../lib/data";
import { ProviderCard } from "./index";

export const Route = createFileRoute("/dashboard/saved")({
  component: () => (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">{PROVIDERS.length} saved providers</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map((p) => <ProviderCard key={p.id} p={p} />)}
      </div>
    </div>
  ),
});
