"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, ShoppingBag } from "lucide-react";
import { StageComponentProps } from "../types";
import { TactileButton } from "../../ui";

export function CartStage({
  stage,
  experience,
  onNext,
}: StageComponentProps) {
  const options = stage.options || [
    { id: "base", label: experience.title, price: experience.conclusion.fictionalPrice || 240000 },
  ];

  const baseItem = options.find((o) => o.id === "base") || options[0];
  const upgradeItems = options.filter((o) => o.id !== "base");
  const upgradesSum = upgradeItems.reduce((sum, o) => sum + o.price, 0);
  const imaginaryTotal = options.reduce((sum, o) => sum + o.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center max-w-2xl mx-auto px-4 py-8"
    >
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 mb-4">
        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
        <span>Imaginary Bag</span>
      </div>

      <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 text-center">
        {stage.title || "Cart Summary"}
      </h2>
      <p className="text-zinc-400 text-center text-sm mb-8">
        {stage.description || "Review your speculative acquisitions."}
      </p>

      {/* Cart Container */}
      <div className="w-full rounded-3xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl backdrop-blur-xl mb-8">
        <div className="divide-y divide-white/5 mb-6">
          {options.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">{item.label}</span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {item.id === "base" ? "Base Fictional Asset" : "Selected Bespoke Upgrade"}
                </span>
              </div>
              <span className="text-sm font-mono text-zinc-300">
                ${item.price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-white/10 pt-4 space-y-2 font-mono">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Base Fictional Value</span>
            <span>${baseItem ? baseItem.price.toLocaleString() : "0"}</span>
          </div>
          {upgradeItems.length > 0 && (
            <div className="flex justify-between text-xs text-amber-300">
              <span>Selected Upgrades ({upgradeItems.length})</span>
              <span>+${upgradesSum.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-zinc-300 pt-1 border-t border-white/5">
            <span>Fictional Retail Sum</span>
            <span className="font-bold text-white">${imaginaryTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Sales Tax & Tariffs</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Imaginary Discount (100%)</span>
            <span className="text-emerald-400">-${imaginaryTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
            <span>Actual Cost Today</span>
            <span className="text-emerald-400 text-lg">$0.00</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Zero-Liability Guarantee: No card numbers or personal information requested.</span>
        </div>
      </div>

      <TactileButton
        variant="gold"
        size="lg"
        onClick={onNext}
        className="w-full max-w-md group"
      >
        <span>Proceed to $0 Checkout</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </TactileButton>
    </motion.div>
  );
}
