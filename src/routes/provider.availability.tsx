import { createFileRoute } from "@tanstack/react-router";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const Route = createFileRoute("/provider/availability")({
  component: () => (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Weekly schedule</h2>
            <p className="text-sm text-muted-foreground">Set your default working hours.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-3">
            <span className="text-sm">Available now</span>
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <span className="relative h-6 w-11 rounded-full bg-muted transition peer-checked:bg-primary">
              <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
            </span>
          </label>
        </div>
        <div className="mt-6 space-y-3">
          {DAYS.map((d, i) => (
            <div key={d} className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4">
              <label className="inline-flex w-32 items-center gap-2 font-medium">
                <input type="checkbox" defaultChecked={i !== 6} className="accent-primary" /> {d}
              </label>
              <input type="time" defaultValue="09:00" className="h-10 rounded-xl border border-border bg-card px-3 text-sm" />
              <span className="text-muted-foreground">to</span>
              <input type="time" defaultValue="18:00" className="h-10 rounded-xl border border-border bg-card px-3 text-sm" />
            </div>
          ))}
        </div>
        <button className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Save schedule</button>
      </div>
    </div>
  ),
});
