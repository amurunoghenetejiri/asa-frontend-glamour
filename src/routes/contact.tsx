import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "../components/site/PublicLayout";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Asá" }, { name: "description", content: "Get in touch with the Asá team." }] }),
  component: () => (
    <PublicLayout>
      <PageHero eyebrow="Get in touch" title="Talk to us" subtitle="Questions, partnerships, feedback — we'd love to hear from you." />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <form className="space-y-4 rounded-3xl border border-border bg-card p-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><input className="input" placeholder="Jane Doe" /></Field>
            <Field label="Email"><input type="email" className="input" placeholder="you@email.com" /></Field>
          </div>
          <Field label="Subject"><input className="input" placeholder="How can we help?" /></Field>
          <Field label="Message"><textarea rows={5} className="input resize-none" placeholder="Tell us more..." /></Field>
          <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Send message</button>
        </form>
        <div className="space-y-6">
          {[
            { i: Mail, t: "Email", d: "hello@asa.ng" },
            { i: Phone, t: "Phone", d: "+234 800 000 0000" },
            { i: MapPin, t: "Office", d: "Victoria Island, Lagos, Nigeria" },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="flex gap-4 rounded-3xl border border-border bg-card p-6">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <style>{`.input{height:2.75rem;width:100%;border-radius:1rem;border:1px solid var(--border);background:var(--muted);padding:0 1rem;font-size:.875rem;outline:none}.input:focus{box-shadow:0 0 0 2px oklch(from var(--primary) l c h / 0.3)}textarea.input{padding:.75rem 1rem;height:auto}`}</style>
    </PublicLayout>
  ),
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
