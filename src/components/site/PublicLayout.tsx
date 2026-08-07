import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Home, Users, LayoutGrid, Newspaper, User as UserIcon } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "@/hooks/use-auth";

const TABS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/find-professionals", label: "Providers", icon: Users, exact: false },
  { to: "/categories", label: "Categories", icon: LayoutGrid, exact: false },
  { to: "/feed", label: "Feed", icon: Newspaper, exact: false },
] as const;

function MobileTabBar() {
  const { user } = useAuth();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {TABS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium text-muted-foreground transition"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: t.exact }}
          >
            <t.icon className="h-5 w-5" />
            {t.label}
          </Link>
        ))}
        <Link
          to={user ? "/dashboard" : "/login"}
          className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium text-muted-foreground transition"
          activeProps={{ className: "text-primary" }}
        >
          <UserIcon className="h-5 w-5" />
          {user ? "Account" : "Login"}
        </Link>
      </div>
    </nav>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="page-enter flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
