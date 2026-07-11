import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/wallet")({
  component: () => (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <div className="rounded-3xl p-6 text-white lg:col-span-2" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Available balance</p>
          <p className="mt-2 font-display text-4xl font-bold">₦24,500.00</p>
          <div className="mt-6 flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#3a2b06]"><Plus className="h-4 w-4" /> Add funds</button>
            <button className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold">Withdraw</button>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Escrow held</p>
          <p className="mt-2 font-display text-2xl font-bold">₦8,000</p>
          <p className="mt-1 text-xs text-muted-foreground">Released when jobs complete</p>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card">
        <div className="border-b border-border p-5 font-semibold">Recent transactions</div>
        <div className="divide-y divide-border">
          {[
            { t: "Payment to Chinedu Okafor", amt: "-₦8,000", up: false, when: "Today" },
            { t: "Wallet top-up", amt: "+₦20,000", up: true, when: "Yesterday" },
            { t: "Payment to Blessing Adeyemi", amt: "-₦15,000", up: false, when: "3 days ago" },
            { t: "Refund", amt: "+₦5,000", up: true, when: "Last week" },
          ].map((tx, i) => (
            <div key={i} className="flex items-center gap-4 p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-full ${tx.up ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                {tx.up ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{tx.t}</p>
                <p className="text-xs text-muted-foreground">{tx.when}</p>
              </div>
              <span className={`font-semibold ${tx.up ? "text-emerald-600" : ""}`}>{tx.amt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});
