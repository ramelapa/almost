"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Experience } from "../../schemas";
import { CheckoutStage } from "../stages/CheckoutStage";
import { ReflectionStage } from "../stages/ReflectionStage";
import { BillionaireReceipt } from "../../ui/BillionaireReceipt";
import { ShareCardModal } from "../../ui/ShareCardModal";
import { TactileButton } from "../../ui";
import { Plus, Minus, ArrowRight } from "lucide-react";

interface BillionDollarRendererProps {
  experience: Experience;
  onComplete?: () => void;
  onAddToMuseum?: () => void;
}

const defaultBillionCatalog = [
  { id: "b-1", label: "Polynesian Atoll Sovereign Island", price: 145000000, category: "Real Estate (Fictional)" },
  { id: "b-2", label: "450-ft Mega Yacht with Submarine Bay", price: 320000000, category: "Maritime (Fictional)" },
  { id: "b-3", label: "Premier League Historic Football Club", price: 420000000, category: "Sports (Fictional)" },
  { id: "b-4", label: "Lunar Colony Geodesic Biodome", price: 250000000, category: "Space (Fictional)" },
  { id: "b-5", label: "Manhattan Art-Deco Penthouse Skyscraper", price: 180000000, category: "Architecture (Fictional)" },
  { id: "b-6", label: "Private Daft Punk Backyard Pyramid Show", price: 35000000, category: "Culture (Fictional)" },
  { id: "b-7", label: "Fleet of 10 Bespoke Carbon Hypercars", price: 40000000, category: "Automotive (Fictional)" },
  { id: "b-8", label: "Subterranean Luxury Doomsday Haven", price: 65000000, category: "Shelter (Fictional)" },
];

export function BillionDollarRenderer({
  experience,
  onComplete,
  onAddToMuseum,
}: BillionDollarRendererProps) {
  const STARTING_BALANCE = 1000000000;
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "b-1": 1,
    "b-2": 1,
    "b-6": 1,
  });
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStageIdx]);

  const spentAmount = defaultBillionCatalog.reduce(
    (sum, item) => sum + (quantities[item.id] || 0) * item.price,
    0
  );
  const remaining = Math.max(0, STARTING_BALANCE - spentAmount);

  const stage = experience.stages[currentStageIdx] || experience.stages[0];

  const handleUpdateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleNext = () => {
    if (currentStageIdx < experience.stages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const purchasedItems = defaultBillionCatalog
    .filter((item) => (quantities[item.id] || 0) > 0)
    .map((item) => ({
      label: `${quantities[item.id]}x ${item.label}`,
      price: item.price * (quantities[item.id] || 0),
    }));

  return (
    <div className="w-full flex-1 flex flex-col justify-start pt-2 md:pt-4 pb-16 relative z-10">
      {/* Persistent Ticker Bar for Billion Mode */}
      <div className="sticky top-16 z-30 max-w-4xl mx-auto w-full px-4 mb-4">
        <div className="rounded-2xl bg-zinc-950/95 border border-amber-400/30 p-3 sm:p-4 shadow-2xl backdrop-blur-2xl flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
              Imaginary Balance &bull; Fictional Simulation
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-amber-300">
              ${remaining.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                Fictional Expended
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-rose-400">
                ${spentAmount.toLocaleString()}
              </span>
            </div>
            <div className="h-7 w-px bg-white/10 hidden sm:block" />
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                Actual Cost
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-emerald-400">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStageIdx === 0 && (
          <motion.div
            key="stage-spree"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center max-w-4xl mx-auto px-4 pt-2 pb-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
                The Extravagance Catalog
              </h2>
              <p className="text-zinc-400 max-w-md mx-auto text-sm">
                You have $1,000,000,000 in simulated wealth. Add fictional sovereign assets until you satisfy your curiosity.
              </p>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full mb-8">
              {defaultBillionCatalog.map((item) => {
                const qty = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-zinc-950/70 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 shrink-0 ml-2">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[11px] font-mono text-zinc-500">
                        Qty: <strong className="text-white">{qty}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={qty === 0}
                          className="p-1 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-30 border border-white/5 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="p-1 rounded-lg bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <TactileButton
              variant="gold"
              size="lg"
              onClick={handleNext}
              disabled={spentAmount === 0}
              className="group"
            >
              <span>Authorize Fictional Wire Transfer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </TactileButton>
          </motion.div>
        )}

        {currentStageIdx === 1 && (
          <CheckoutStage
            key="stage-checkout"
            stage={stage}
            experience={experience}
            onNext={handleNext}
            onSelectOption={() => {}}
            selectedOptionIds={[]}
            isLastStage={false}
          />
        )}

        {currentStageIdx === 2 && (
          <div key="stage-reflection" className="flex flex-col items-center pt-2">
            {/* Show Billionaire Receipt */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full px-4"
            >
              <BillionaireReceipt
                startingBalance={STARTING_BALANCE}
                spentAmount={spentAmount}
                purchasedItems={purchasedItems}
              />
            </motion.div>

            <ReflectionStage
              stage={stage}
              experience={{
                ...experience,
                conclusion: {
                  ...experience.conclusion,
                  fictionalPrice: spentAmount,
                  avoidedAmount: spentAmount,
                  stats: [
                    { label: "You spent", value: `$${spentAmount.toLocaleString()}` },
                    { label: "Actual damage", value: "$0.00" },
                    { label: "Remaining balance", value: `$${remaining.toLocaleString()}` },
                    { label: "Regret tomorrow", value: "$0" },
                  ],
                },
              }}
              onNext={handleNext}
              onSelectOption={() => {}}
              selectedOptionIds={[]}
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
        experienceTitle="Billion Dollar Spending Spree"
        experienceType="BillionDollar"
        fictionalPrice={spentAmount}
        avoidedPrice={spentAmount}
      />
    </div>
  );
}
