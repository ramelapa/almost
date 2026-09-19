"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Experience } from "../../schemas";
import { CustomizeStage } from "../stages/CustomizeStage";
import { CheckoutStage } from "../stages/CheckoutStage";
import { ReflectionStage } from "../stages/ReflectionStage";
import { InvestmentGrowthCard } from "../../ui/InvestmentGrowthCard";
import { ShareCardModal } from "../../ui/ShareCardModal";
import { Ban } from "lucide-react";

interface QuitCartRendererProps {
  experience: Experience;
  onComplete?: () => void;
  onAddToMuseum?: () => void;
}

export function QuitCartRenderer({
  experience,
  onComplete,
  onAddToMuseum,
}: QuitCartRendererProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    "stage-config": ["c-1", "c-3"],
  });
  const [isShareOpen, setIsShareOpen] = useState(false);

  const stage = experience.stages[currentStageIdx] || experience.stages[0];
  const basePrice = experience.metadata?.basePrice || experience.conclusion.avoidedAmount || 1499;

  const handleNext = () => {
    if (currentStageIdx < experience.stages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handleSelectOption = (optionId: string, isMulti?: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[stage.id] || [];
      if (isMulti) {
        return {
          ...prev,
          [stage.id]: current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      }
      return {
        ...prev,
        [stage.id]: [optionId],
      };
    });
  };

  const currentSelection = selectedOptions[stage.id] || [];

  return (
    <div className="w-full flex-1 flex flex-col justify-center py-12 relative z-10">
      <AnimatePresence mode="wait">
        {stage.type === "customize" && (
          <CustomizeStage
            key={stage.id}
            stage={stage}
            experience={experience}
            onNext={handleNext}
            onSelectOption={handleSelectOption}
            selectedOptionIds={currentSelection}
            isLastStage={false}
          />
        )}

        {stage.type === "checkout" && (
          <CheckoutStage
            key={stage.id}
            stage={stage}
            experience={experience}
            onNext={handleNext}
            onSelectOption={handleSelectOption}
            selectedOptionIds={currentSelection}
            isLastStage={false}
          />
        )}

        {stage.type === "reflection" && (
          <div key={stage.id} className="flex flex-col items-center">
            {/* Dramatic Cancellation Banner */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl mx-auto p-6 rounded-3xl bg-rose-950/40 border border-rose-500/30 text-center mb-4"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/20 text-rose-300 mb-3">
                <Ban className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-white tracking-wide uppercase mb-2">
                ORDER CANCELED SUCCESSFULLY
              </h2>
              <div className="flex justify-center gap-8 font-mono text-sm pt-2">
                <div>
                  <span className="text-zinc-400 block text-xs">You Kept:</span>
                  <span className="text-emerald-400 text-xl font-bold">
                    ${basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-zinc-400 block text-xs">Actual Purchase:</span>
                  <span className="text-white text-xl font-bold">$0.00</span>
                </div>
              </div>
            </motion.div>

            {/* Educational Compounding Visualization */}
            <InvestmentGrowthCard amountSaved={basePrice} assumedAnnualRate={0.07} />

            <ReflectionStage
              stage={stage}
              experience={experience}
              onNext={handleNext}
              onSelectOption={handleSelectOption}
              selectedOptionIds={currentSelection}
              isLastStage={true}
              onAddToMuseum={onAddToMuseum}
              onShare={() => setIsShareOpen(true)}
            />
          </div>
        )}
      </AnimatePresence>

      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        experienceTitle={`Saved $${basePrice.toLocaleString()} on ${experience.metadata?.itemName || experience.title}`}
        experienceType="QuitCart"
        fictionalPrice={basePrice}
        avoidedPrice={basePrice}
      />
    </div>
  );
}
