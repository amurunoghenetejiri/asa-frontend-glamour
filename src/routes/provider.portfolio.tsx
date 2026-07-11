import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

const IMGS = [
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800",
];

export const Route = createFileRoute("/provider/portfolio")({
  component: () => (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{IMGS.length} portfolio items</p>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add work</button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <button className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
          <Plus className="h-6 w-6" />
        </button>
        {IMGS.map((src, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl">
            <img src={src} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
          </div>
        ))}
      </div>
    </div>
  ),
});
