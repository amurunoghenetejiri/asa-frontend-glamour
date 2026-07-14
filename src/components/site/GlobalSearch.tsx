import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, MapPin, Layers, User as UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CategoryHit = { id: string; slug: string; name: string; icon: string | null };
type ProviderHit = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  profession: string | null;
  city: string | null;
  state: string | null;
};

const NAV_LINKS = [
  { to: "/find-professionals", label: "Find Professionals" },
  { to: "/categories", label: "Browse Categories" },
  { to: "/become-a-provider", label: "Become a Provider" },
  { to: "/how-it-works", label: "How Asá Works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

export function GlobalSearchButton({ variant = "pill" }: { variant?: "pill" | "icon" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((s) => !s);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Search Asá"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted"
        >
          <Search className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="hidden items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground md:inline-flex"
        >
          <Search className="h-4 w-4" />
          <span>Search Asá</span>
          <kbd className="ml-2 hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground lg:inline">⌘K</kbd>
        </button>
      )}
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryHit[]>([]);
  const [providers, setProviders] = useState<ProviderHit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const term = q.trim();
    if (!term) {
      setCategories([]);
      setProviders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      const like = `%${term}%`;
      const [cats, provs] = await Promise.all([
        supabase.from("categories").select("id, slug, name, icon").eq("is_active", true).ilike("name", like).limit(6),
        supabase
          .from("profiles")
          .select("id, full_name, avatar_url, profession, city, state")
          .eq("is_provider", true)
          .or(`full_name.ilike.${like},profession.ilike.${like},city.ilike.${like}`)
          .limit(6),
      ]);
      if (cancelled) return;
      setCategories((cats.data as CategoryHit[]) ?? []);
      setProviders((provs.data as ProviderHit[]) ?? []);
      setLoading(false);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [q]);

  const suggestions = useMemo(
    () =>
      NAV_LINKS.filter((n) =>
        q ? n.label.toLowerCase().includes(q.toLowerCase()) : true,
      ).slice(0, 4),
    [q],
  );

  const go = (to: string) => {
    onClose();
    navigate({ to });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[10vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search providers, categories, pages…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!q && (
            <div className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick links</p>
              <div className="grid grid-cols-2 gap-2">
                {NAV_LINKS.slice(0, 6).map((n) => (
                  <button
                    key={n.to}
                    onClick={() => go(n.to)}
                    className="rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm font-medium hover:border-primary/40 hover:bg-muted"
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && categories.length > 0 && (
            <SectionTitle label="Categories" />
          )}
          {q && categories.map((c) => (
            <button key={c.id} onClick={() => go("/find-professionals")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-base">{c.icon || <Layers className="h-4 w-4 text-primary" />}</span>
              <span className="flex-1 text-sm font-medium">{c.name}</span>
              <span className="text-xs text-muted-foreground">Category</span>
            </button>
          ))}

          {q && providers.length > 0 && <SectionTitle label="Providers" />}
          {q && providers.map((p) => (
            <Link
              key={p.id}
              to="/providers/$id"
              params={{ id: p.id }}
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted"
            >
              {p.avatar_url ? (
                <img src={p.avatar_url} alt="" className="h-9 w-9 rounded-lg object-cover" />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><UserIcon className="h-4 w-4" /></span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.full_name || "Provider"}</p>
                <p className="truncate text-xs text-muted-foreground">{p.profession || "Professional"}</p>
              </div>
              {(p.city || p.state) && (
                <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
                  <MapPin className="h-3 w-3" /> {[p.city, p.state].filter(Boolean).join(", ")}
                </span>
              )}
            </Link>
          ))}

          {q && suggestions.length > 0 && <SectionTitle label="Pages" />}
          {q && suggestions.map((n) => (
            <button key={n.to} onClick={() => go(n.to)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground"><Search className="h-4 w-4" /></span>
              <span className="flex-1 text-sm font-medium">{n.label}</span>
            </button>
          ))}

          {q && !loading && categories.length === 0 && providers.length === 0 && suggestions.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No matches for “{q}”. Try a different keyword.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          <span>Press <kbd className="rounded border border-border bg-card px-1">Esc</kbd> to close</span>
          <span>Powered by Asá</span>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
  );
}
