"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Experience, MuseumItem } from "../../schemas";
import { SceneStage } from "../stages/SceneStage";
import { CustomizeStage } from "../stages/CustomizeStage";
import { CartStage } from "../stages/CartStage";
import { CheckoutStage } from "../stages/CheckoutStage";
import { ReflectionStage } from "../stages/ReflectionStage";
import { ShareCardModal } from "../../ui/ShareCardModal";

interface ZeroCartRendererProps {
  experience: Experience;
  onComplete?: () => void;
  onAddToMuseum?: (item?: Partial<MuseumItem>) => void;
}

export function ZeroCartRenderer({
  experience,
  onComplete,
  onAddToMuseum,
}: ZeroCartRendererProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    "stage-customize": [],
  });
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStageIdx]);

  const basePrice =
    experience.metadata?.basePrice ?? experience.conclusion.fictionalPrice ?? 241300;
  const baseProduct =
    experience.metadata?.baseProduct ??
    experience.title.replace(/\s*\(Fictional Possession\)/, "");
  const customizeStage = experience.stages.find((s) => s.type === "customize");
  const availableUpgrades = customizeStage?.options || [];
  const selectedUpgradeIds = selectedOptions["stage-customize"] || [];
  const selectedUpgrades = availableUpgrades.filter((u) =>
    selectedUpgradeIds.includes(u.id)
  );
  const upgradesTotal = selectedUpgrades.reduce((sum, u) => sum + u.price, 0);
  const fictionalTotal = basePrice + upgradesTotal;

  const stage = experience.stages[currentStageIdx] || experience.stages[0];

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

  // Authoritative dynamic cart options
  const dynamicCartOptions = [
    {
      id: "base",
      label: `Base ${baseProduct}`,
      price: basePrice,
      description: "Base asset specification",
    },
    ...selectedUpgrades.map((u) => ({
      id: u.id,
      label: u.label,
      price: u.price,
      description: "Selected bespoke upgrade",
    })),
  ];

  // Authoritative conclusion
  const authoritativeConclusion = {
    ...experience.conclusion,
    fictionalPrice: fictionalTotal,
    avoidedAmount: fictionalTotal,
    stats: [
      { label: "Base fictional price", value: `$${basePrice.toLocaleString()}` },
      {
        label: "Selected upgrades",
        value:
          selectedUpgrades.length > 0
            ? `$${upgradesTotal.toLocaleString()} (${selectedUpgrades.length})`
            : "$0 (Standard)",
      },
      { label: "Total fictional value", value: `$${fictionalTotal.toLocaleString()}` },
      { label: "Real money spent", value: "$0.00" },
    ],
  };

  const authoritativeExperience: Experience = {
    ...experience,
    conclusion: authoritativeConclusion,
  };

  const handleAddToMuseumWithAuthoritativeState = () => {
    if (onAddToMuseum) {
      onAddToMuseum({
        fictionalPrice: fictionalTotal,
        avoidedAmount: fictionalTotal,
        reflectionQuote: `Fictional total: $${fictionalTotal.toLocaleString()} ($0 spent in real life).`,
        stats: authoritativeConclusion.stats,
      });
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-start pt-2 md:pt-4 pb-16 relative z-10">
      <AnimatePresence mode="wait">
        {stage.type === "scene" && (
          <SceneStage
            key={stage.id}
            stage={stage}
            experience={authoritativeExperience}
            onNext={handleNext}
            onSelectOption={handleSelectOption}
            selectedOptionIds={currentSelection}
            isLastStage={false}
          />
        )}

        {stage.type === "customize" && (
          <CustomizeStage
            key={stage.id}
            stage={stage}
            experience={authoritativeExperience}
            onNext={handleNext}
            onSelectOption={handleSelectOption}
            selectedOptionIds={currentSelection}
            isLastStage={false}
          />
        )}

        {stage.type === "cart" && (
          <CartStage
            key={stage.id}
            stage={{ ...stage, options: dynamicCartOptions }}
            experience={authoritativeExperience}
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
            experience={authoritativeExperience}
            onNext={handleNext}
            onSelectOption={handleSelectOption}
            selectedOptionIds={currentSelection}
            isLastStage={false}
          />
        )}

        {stage.type === "reflection" && (
          <ReflectionStage
            key={stage.id}
            stage={stage}
            experience={authoritativeExperience}
            onNext={handleNext}
            onSelectOption={handleSelectOption}
            selectedOptionIds={currentSelection}
            isLastStage={true}
            onAddToMuseum={handleAddToMuseumWithAuthoritativeState}
            onShare={() => setIsShareOpen(true)}
          />
        )}
      </AnimatePresence>

      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        experienceTitle={authoritativeExperience.title}
        experienceType="ZeroCart"
        fictionalPrice={fictionalTotal}
        avoidedPrice={fictionalTotal}
        imageUrl={experience.metadata?.imageUrl || experience.stages[0]?.media?.url}
      />
    </div>
  );
}
