"use client";

import React from "react";
import { ShieldAlert, Sparkles } from "lucide-react";

interface BillionaireReceiptProps {
  startingBalance: number;
  spentAmount: number;
  purchasedItems: { label: string; price: number }[];
}

export function BillionaireReceipt({
  startingBalance = 1000000000,
  spentAmount,
  purchasedItems,
}: BillionaireReceiptProps) {
  const remaining = startingBalance - spentAmount;

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl bg-zinc-950 border border-amber-400/30 p-6 font-mono text-zinc-200 shadow-[0_20px_60px_rgba(245,158,11,0.15)] my-6 relative overflow-hidden">
      {/* Glow orb */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center pb-4 border-b border-dashed border-white/20">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-400/10 text-amber-400 mb-2">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-wider uppercase">
          ALMOST TRUST CO.
        </h3>
        <p className="text-[11px] text-zinc-500">
          FICTIONAL EXTRAVAGANCE SETTLEMENT
        </p>
      </div>

      {/* Line Items */}
      <div className="py-4 space-y-2.5 text-xs max-h-56 overflow-y-auto pr-1">
        {purchasedItems.map((item, i) => (
          <div key={i} className="flex justify-between items-start gap-2">
            <span className="text-zinc-300 truncate">{item.label}</span>
            <span className="text-amber-300 font-semibold shrink-0">
              ${item.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Calculation breakdown */}
      <div className="border-t border-dashed border-white/20 pt-4 space-y-2 text-xs">
        <div className="flex justify-between text-zinc-400">
          <span>Starting Allocation</span>
          <span>${startingBalance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Imaginary Expended</span>
          <span className="text-rose-400">-${spentAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-zinc-300 font-semibold">
          <span>Remaining Fictional Wealth</span>
          <span className="text-amber-300">${remaining.toLocaleString()}</span>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-bold">
          <span className="text-white">Actual Financial Damage</span>
          <span className="text-emerald-400 text-lg">$0.00</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-5 pt-3 border-t border-white/5 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span>Fictional asset allocation. No wealth was actually created or destroyed.</span>
      </div>
    </div>
  );
}
