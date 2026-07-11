import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0F5A43 0%, #0A3E2E 100%)" }}>
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="font-display text-3xl font-bold gold-gradient">Asá</Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">Trusted.<br />Verified.<br />Nearby.</h2>
            <p className="mt-4 max-w-md text-white/70">Nigeria's premium marketplace for skilled hands. Every provider background-checked. Every review real.</p>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#BDE0FE]">Powered by HEPTALABS</p>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-block font-display text-2xl font-bold gold-gradient lg:hidden">Asá</Link>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
        </div>
      </div>
      <style>{`.ainput{height:2.75rem;width:100%;border-radius:1rem;border:1px solid var(--border);background:var(--card);padding:0 1rem;font-size:.875rem;outline:none;transition:box-shadow .15s}.ainput:focus{box-shadow:0 0 0 2px color-mix(in oklab, var(--primary) 30%, transparent)}`}</style>
    </div>
  );
}
