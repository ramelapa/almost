"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Experience } from "../../schemas";
import { ChoiceStage } from "../stages/ChoiceStage";
import { ReflectionStage } from "../stages/ReflectionStage";
import { useSound } from "../../sound-engine";
import { TactileButton } from "../../ui";
import { ShareCardModal } from "../../ui/ShareCardModal";
import { CloudRain, Volume2, Wind } from "lucide-react";

interface FiveMinuteEscapeRendererProps {
  experience: Experience;
  onComplete?: () => void;
  onAddToMuseum?: () => void;
}

export function FiveMinuteEscapeRenderer({
  experience,
  onComplete,
  onAddToMuseum,
}: FiveMinuteEscapeRendererProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    "stage-seat": ["s-1"],
    "stage-drink": ["d-1"],
  });
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [breathingText, setBreathingText] = useState("Inhale gently...");
  const [secondsRemaining, setSecondsRemaining] = useState(60); // 1 min expedited for delightful flow or customizable
  const { setSoundscape, setMuted, isMuted } = useSound();

  const stage = experience.stages[currentStageIdx] || experience.stages[0];

  // Auto-activate gentle rain or zen soundscape if user has unmuted
  useEffect(() => {
    if (experience.theme.background === "rain") {
      setSoundscape("rain");
    } else {
      setSoundscape("zen");
    }
  }, [experience.theme.background, setSoundscape]);

  // Breathing guidance loop for the tranquil scene stage
  useEffect(() => {
    if (stage.type === "scene") {
      const breathingInterval = setInterval(() => {
        setBreathingText((prev) =>
          prev.startsWith("Inhale") ? "Exhale slowly..." : "Inhale gently..."
        );
      }, 4000);

      const timerInterval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(breathingInterval);
        clearInterval(timerInterval);
      };
    }
  }, [stage.type]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStageIdx]);

  const handleNext = () => {
    if (currentStageIdx < experience.stages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [stage.id]: [optionId],
    }));
  };

  const currentSelection = selectedOptions[stage.id] || [];

  return (
    <div className="w-full flex-1 flex flex-col justify-start pt-2 md:pt-4 pb-16 relative z-10">
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

        {stage.type === "scene" && (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-xl mx-auto px-4 py-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-8">
              <CloudRain className="w-3.5 h-3.5" />
              <span>Immersive Meditation &bull; {experience.title}</span>
            </div>

            {/* Breathing pulsing orb */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.45, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/20 via-cyan-500/30 to-emerald-500/20 blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                }}
                className="w-40 h-40 rounded-full border border-cyan-400/30 bg-zinc-950/60 backdrop-blur-xl flex flex-col items-center justify-center p-4 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
              >
                <Wind className="w-5 h-5 text-cyan-400 mb-2" />
                <span className="text-xs font-mono text-cyan-200 tracking-wider">
                  {breathingText}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 mt-1">
                  00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
                </span>
              </motion.div>
            </div>

            <p className="text-zinc-300 text-base mb-6 font-light max-w-md">
              Listen to the gentle rainfall outside. Your mind does not have to solve anything right now.
            </p>

            {isMuted && (
              <button
                type="button"
                onClick={() => setMuted(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono hover:bg-amber-400/20 transition-all mb-6"
              >
                <Volume2 className="w-4 h-4" />
                <span>Enable Ambient Rain Audio</span>
              </button>
            )}

            <TactileButton
              variant="glass"
              size="md"
              onClick={handleNext}
              className="mt-2 text-xs font-mono"
            >
              <span>Conclude Quiet Session</span>
            </TactileButton>
          </motion.div>
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
        experienceType="FiveMinuteEscape"
        fictionalPrice={experience.conclusion.fictionalPrice}
        avoidedPrice={experience.conclusion.avoidedAmount}
        imageUrl={experience.stages[0]?.media?.url}
      />
    </div>
  );
}
