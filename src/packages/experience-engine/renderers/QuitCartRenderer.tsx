"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Experience } from "../../schemas";
import { CustomizeStage } from "../stages/CustomizeStage";
import { CheckoutStage } from "../stages/CheckoutStage";
import { InvestmentGrowthCard } from "../../ui/InvestmentGrowthCard";
import { ShareCardModal } from "../../ui/ShareCardModal";
import { TactileButton } from "../../ui";
import { Ban, Landmark, Share2, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
  const [hasAddedToMuseum, setHasAddedToMuseum] = useState(false);

  const stage = experience.stages[currentStageIdx] || experience.stages[0];
  const basePrice = experience.metadata?.basePrice || experience.conclusion.avoidedAmount || 1499;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStageIdx]);

  useEffect(() => {
    if (stage.type === "reflection") {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#10b981", "#34d399", "#f59e0b", "#ffffff"],
        });
      } catch {
        // Ignore if unsupported
      }
    }
  }, [stage.type]);

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

  const handleAddToMuseumClick = () => {
    setHasAddedToMuseum(true);
    if (onAddToMuseum) onAddToMuseum();
  };

  const currentSelection = selectedOptions[stage.id] || [];

  return (
    <div className="w-full flex-1 flex flex-col justify-start pt-2 md:pt-4 pb-12 relative z-10">
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
          <motion.div
            key="unified-quit-cart-conclusion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center max-w-3xl mx-auto px-4 py-4 text-center w-full"
          >
            {/* Single Unified Dramatic Cancellation Banner */}
            <div className="w-full p-6 md:p-8 rounded-3xl bg-zinc-950/80 border border-emerald-500/30 text-center shadow-2xl backdrop-blur-xl mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Impulse Intercepted &bull; $0 Paid</span>
              </div>

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/20 text-rose-300 mb-3 mx-auto">
                <Ban className="w-7 h-7" />
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-black text-white tracking-wide uppercase mb-3">
                ORDER CANCELED SUCCESSFULLY
              </h1>

              <p className="text-zinc-300 text-sm md:text-base max-w-xl mx-auto mb-6 font-light leading-relaxed">
                You walked right to the edge of the checkout button and stepped back. You kept your money while experiencing the full buying ritual.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto font-mono text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">You Kept</span>
                  <span className="text-xl font-bold text-emerald-400">
                    ${basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Actual Cost</span>
                  <span className="text-xl font-bold text-white">$0.00</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Remorse Tomorrow</span>
                  <span className="text-xl font-bold text-amber-300">0%</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Fictional Cart</span>
                  <span className="text-xl font-bold text-cyan-400">Voided</span>
                </div>
              </div>
            </div>

            {/* Educational Compounding Visualization */}
            <InvestmentGrowthCard amountSaved={basePrice} assumedAnnualRate={0.07} />

            {/* Single Action Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 w-full mt-4">
              <TactileButton
                variant={hasAddedToMuseum ? "secondary" : "gold"}
                size="lg"
                onClick={handleAddToMuseumClick}
                disabled={hasAddedToMuseum}
                className="gap-2.5"
              >
                <Landmark className="w-4 h-4 text-zinc-950" />
                <span>{hasAddedToMuseum ? "Saved to Museum" : "Add to My Museum"}</span>
              </TactileButton>

              <TactileButton
                variant="glass"
                size="lg"
                onClick={() => setIsShareOpen(true)}
                className="gap-2.5"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share Artifact</span>
              </TactileButton>

              <Link
                href="/"
                className="inline-flex items-center justify-center select-none font-medium cursor-pointer transition-colors px-7 py-3.5 text-base font-semibold rounded-2xl gap-2 text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <RefreshCw className="w-4 h-4 text-zinc-400" />
                <span>Craving Something Else?</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        experienceTitle={`Avoided $${basePrice.toLocaleString()} purchase on ${experience.metadata?.itemName || experience.title}`}
        experienceType="QuitCart"
        fictionalPrice={basePrice}
        avoidedPrice={basePrice}
      />
    </div>
  );
}
