"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Experience } from "../../schemas";
import { SceneStage } from "../stages/SceneStage";
import { CustomizeStage } from "../stages/CustomizeStage";
import { CartStage } from "../stages/CartStage";
import { CheckoutStage } from "../stages/CheckoutStage";
import { ReflectionStage } from "../stages/ReflectionStage";
import { ShareCardModal } from "../../ui/ShareCardModal";

interface ZeroCartRendererProps {
  experience: Experience;
  onComplete?: () => void;
  onAddToMuseum?: () => void;
}

export function ZeroCartRenderer({
  experience,
  onComplete,
  onAddToMuseum,
}: ZeroCartRendererProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    "stage-customize": ["opt-1"],
  });
  const [isShareOpen, setIsShareOpen] = useState(false);

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

  return (
    <div className="w-full flex-1 flex flex-col justify-center py-12 relative z-10">
      <AnimatePresence mode="wait">
        {stage.type === "scene" && (
          <SceneStage
            key={stage.id}
            stage={stage}
            experience={experience}
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
            experience={experience}
            onNext={handleNext}
            onSelectOption={handleSelectOption}
            selectedOptionIds={currentSelection}
            isLastStage={false}
          />
        )}

        {stage.type === "cart" && (
          <CartStage
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
          <ReflectionStage
            key={stage.id}
            stage={stage}
            experience={experience}
            onNext={handleNext}
            onSelectOption={handleSelectOption}
            selectedOptionIds={currentSelection}
            isLastStage={true}
            onAddToMuseum={onAddToMuseum}
            onShare={() => setIsShareOpen(true)}
          />
        )}
      </AnimatePresence>

      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        experienceTitle={experience.title}
        experienceType="ZeroCart"
        fictionalPrice={experience.conclusion.fictionalPrice}
        avoidedPrice={experience.conclusion.avoidedAmount}
        imageUrl={experience.stages[0]?.media?.url}
      />
    </div>
  );
}
