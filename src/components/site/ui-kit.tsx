import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";

/** Consistent section heading used across every Asá page. */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>}
        <h2 className="mt-1.5 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ViewAllLink({ to, label = "View all" }: { to: string; label?: string }) {
  return (
    <Link
      to={to as never}
      className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2 sm:inline-flex"
    >
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

/** Elegant empty state — shown instead of any placeholder/demo content. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="surface-card animate-scale-in-soft flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo as never} className="btn-primary mt-6 px-6 py-2.5 text-sm">
          {actionLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

/** Loading skeleton card grid. */
export function SkeletonGrid({ count = 4, className = "", height = "h-64" }: { count?: number; className?: string; height?: string }) {
  return (
    <div className={className || "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} shimmer rounded-3xl`} />
      ))}
    </div>
  );
}

export function StatCard({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="surface-card card-hover flex items-center gap-3 p-4 sm:p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold leading-tight sm:text-2xl">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
