import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/provider/wallet")({
  component: () => (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl p-6 text-white lg:col-span-2" style={{ background: "linear-gradient(135deg, #0F5A43, #0A3E2E)" }}>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Available for withdrawal</p>
          <p className="mt-2 font-display text-4xl font-bold">₦186,000.00</p>
          <button className="mt-6 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#3a2b06]">Withdraw to bank</button>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Pending escrow</p>
          <p className="mt-2 font-display text-2xl font-bold">₦42,000</p>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card">
        <div className="border-b border-border p-5 font-semibold">Payouts & earnings</div>
        <div className="divide-y divide-border">
          {[
            { t: "Payment received · Adaeze O.", amt: "+₦8,000", up: true, when: "Today" },
            { t: "Withdrawal to GTB ****3021", amt: "-₦120,000", up: false, when: "Yesterday" },
            { t: "Payment received · Bola A.", amt: "+₦15,000", up: true, when: "2 days ago" },
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
