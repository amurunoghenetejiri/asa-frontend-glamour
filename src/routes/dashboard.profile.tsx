import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/profile")({
  component: () => (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8">
        <div className="flex items-center gap-5">
          <img src="https://i.pravatar.cc/200?img=32" className="h-24 w-24 rounded-2xl object-cover" alt="" />
          <div>
            <h2 className="font-display text-2xl font-bold">Adaeze Okonkwo</h2>
            <p className="text-sm text-muted-foreground">Member since 2024 · Lagos</p>
            <button className="mt-3 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Change photo</button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value="Adaeze Okonkwo" />
          <Field label="Email" value="adaeze@example.com" />
          <Field label="Phone" value="+234 803 000 0000" />
          <Field label="Location" value="Lekki, Lagos" />
        </div>
        <button className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Save changes</button>
      </div>
    </div>
  ),
});
function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input defaultValue={value} className="h-11 w-full rounded-xl border border-border bg-muted/50 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
    </label>
  );
}
