"use client";

import React from "react";
import { TrendingUp, AlertCircle } from "lucide-react";

interface InvestmentGrowthCardProps {
  amountSaved: number;
  assumedAnnualRate?: number; // default 0.07 (7%)
}

export function InvestmentGrowthCard({
  amountSaved,
  assumedAnnualRate = 0.07,
}: InvestmentGrowthCardProps) {
  const calculateCompound = (years: number) => {
    return Math.round(amountSaved * Math.pow(1 + assumedAnnualRate, years));
  };

  const benchmarks = [
    { years: 5, value: calculateCompound(5) },
    { years: 10, value: calculateCompound(10) },
    { years: 20, value: calculateCompound(20) },
    { years: 30, value: calculateCompound(30) },
  ];

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-zinc-950/80 border border-emerald-500/20 p-6 my-6 text-left shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-2">
        <TrendingUp className="w-4 h-4" />
        <span>Educational Illustration &bull; The Power of Not Buying</span>
      </div>

      <h4 className="text-lg font-serif font-bold text-white mb-1">
        What your ${amountSaved.toLocaleString()} could become
      </h4>
      <p className="text-xs text-zinc-400 mb-6">
        Hypothetical growth if the saved amount were invested in an index fund at an assumed {Math.round(assumedAnnualRate * 100)}% compounding annual return.
      </p>

      {/* Grid of milestones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {benchmarks.map((b) => (
          <div
            key={b.years}
            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col font-mono"
          >
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
              In {b.years} Years
            </span>
            <span className="text-lg font-bold text-emerald-300 mt-1">
              ${b.value.toLocaleString()}
            </span>
            <span className="text-[9px] text-zinc-400 mt-0.5">
              +${(b.value - amountSaved).toLocaleString()} gained
            </span>
          </div>
        ))}
      </div>

      {/* Mandatory compliance disclaimer */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-start gap-2.5 text-[11px] text-zinc-500 leading-relaxed font-sans">
        <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <span>
          <strong>Hypothetical Illustration:</strong> Assumes a constant {Math.round(assumedAnnualRate * 100)}% annual return with dividends reinvested. Market returns fluctuate and past performance does not guarantee future results. This is educational only and does not constitute financial advice.
        </span>
      </div>
    </div>
  );
}
