"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Plus, ArrowRight } from "lucide-react";
import { StageComponentProps } from "../types";
import { TactileButton } from "../../ui";

export function CustomizeStage({
  stage,
  onNext,
  onSelectOption,
  selectedOptionIds,
}: StageComponentProps) {
  const options = stage.options || [];

  const totalCalculated = options
    .filter((o) => selectedOptionIds.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center max-w-4xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
          {stage.title || "Custom Specification"}
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto text-sm">
          {stage.description || "Select all options that spark curiosity. Every upgrade costs you exactly $0."}
        </p>
      </div>

      {/* Selected ticker */}
      <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Selected Upgrades</span>
          <span className="text-sm font-semibold text-white">{selectedOptionIds.length} items</span>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Total Fantasy Additions</span>
          <span className="text-sm font-mono font-bold text-amber-300">
            ${totalCalculated.toLocaleString()}
          </span>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Actual Out-of-Pocket</span>
          <span className="text-sm font-mono font-bold text-emerald-400">$0.00</span>
        </div>
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-3 w-full max-w-2xl mb-8">
        {options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectOption(option.id, true)}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                isSelected
                  ? "bg-zinc-900/90 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                  : "bg-zinc-950/50 border-white/10 hover:border-white/20 hover:bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-amber-400 border-amber-400 text-black"
                      : "border-white/20 bg-white/5 text-zinc-500"
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{option.label}</span>
                    {option.highlight && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                        {option.highlight}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-xs text-zinc-400 mt-0.5">{option.description}</p>
                  )}
                </div>
              </div>

              <div className="text-right pl-4">
                <span className="text-xs font-mono text-zinc-300">
                  +${option.price.toLocaleString()}
                </span>
                <span className="block text-[10px] font-mono text-emerald-400">($0 real)</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <TactileButton variant="primary" size="lg" onClick={onNext} className="group">
        <span>Proceed to Review</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </TactileButton>
    </motion.div>
  );
}
