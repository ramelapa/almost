"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Experience } from "../../schemas";
import { ChoiceStage } from "../stages/ChoiceStage";
import { CheckoutStage } from "../stages/CheckoutStage";
import { ReflectionStage } from "../stages/ReflectionStage";
import { BoardingPass } from "../../ui/BoardingPass";
import { ShareCardModal } from "../../ui/ShareCardModal";

interface DreamTripRendererProps {
  experience: Experience;
  onComplete?: () => void;
  onAddToMuseum?: () => void;
}

export function DreamTripRenderer({
  experience,
  onComplete,
  onAddToMuseum,
}: DreamTripRendererProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    "stage-flight": ["suite-1"],
    "stage-hotel": ["hotel-1"],
    "stage-itinerary": ["day-1"],
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
        {stage.type === "choice" && (
          <ChoiceStage
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
            {/* Show Boarding Pass */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full px-4"
            >
              <BoardingPass
                destination={experience.metadata?.destination || "Switzerland (Alpine)"}
                origin={experience.metadata?.origin || "Washington (IAD)"}
                flightSuite={experience.metadata?.flightSuite || "First Class Suite 1A"}
                departing="Whenever you need it"
                cost="$0.00"
              />
            </motion.div>

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
        experienceTitle={experience.title}
        experienceType="DreamTrip"
        fictionalPrice={experience.conclusion.fictionalPrice}
        avoidedPrice={experience.conclusion.avoidedAmount}
        imageUrl={experience.stages[0]?.media?.url}
      />
    </div>
  );
}
