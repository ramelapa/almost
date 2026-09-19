"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { StageComponentProps } from "../types";
import { TactileButton } from "../../ui";

export function ChoiceStage({
  stage,
  onNext,
  onSelectOption,
  selectedOptionIds,
}: StageComponentProps) {
  const options = stage.options || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center max-w-4xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
          {stage.title || "Make Your Selection"}
        </h2>
        {stage.description && (
          <p className="text-zinc-400 max-w-xl mx-auto text-base">
            {stage.description}
          </p>
        )}
      </div>

      {stage.media && stage.media.url && (
        <div className="w-full max-w-xl rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-lg">
          <img
            src={stage.media.url}
            alt={stage.media.alt || "Scene"}
            className="w-full h-48 md:h-64 object-cover"
          />
        </div>
      )}

      {/* Choices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-10">
        {options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);

          return (
            <motion.button
              key={option.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectOption(option.id, false)}
              className={`relative flex flex-col p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-zinc-900 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
                  : "bg-zinc-950/60 border border-white/10 hover:border-white/20 hover:bg-zinc-900/60"
              }`}
            >
              {option.highlight && (
                <span className="self-start text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
                  {option.highlight}
                </span>
              )}

              <div className="flex items-start justify-between w-full mb-1.5">
                <span className="text-lg font-semibold text-white">
                  {option.label}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-amber-400 border-amber-400 text-black"
                      : "border-white/20 bg-white/5 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {option.description && (
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  {option.description}
                </p>
              )}

              {option.price > 0 && (
                <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Imaginary value</span>
                  <span className="text-amber-300 font-medium">
                    ${option.price.toLocaleString()}
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <TactileButton
        variant="primary"
        size="lg"
        onClick={onNext}
        disabled={selectedOptionIds.length === 0}
        className="group"
      >
        <span>Confirm Choice</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </TactileButton>
    </motion.div>
  );
}
