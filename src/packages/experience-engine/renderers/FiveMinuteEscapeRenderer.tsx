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
  initialDurationSeconds?: number;
}

export function FiveMinuteEscapeRenderer({
  experience,
  onComplete,
  onAddToMuseum,
  initialDurationSeconds = 300,
}: FiveMinuteEscapeRendererProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    "stage-seat": ["s-1"],
    "stage-drink": ["d-1"],
  });
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [breathingText, setBreathingText] = useState("Inhale gently...");
  const [sessionDuration, setSessionDuration] = useState(initialDurationSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState(initialDurationSeconds);
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

  const handleNext = React.useCallback(() => {
    if (currentStageIdx < experience.stages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentStageIdx, experience.stages.length, onComplete]);

  // Accurate elapsed-time calculation resilient to background tab throttling
  useEffect(() => {
    if (stage.type === "scene") {
      const startTime = Date.now();
      const totalDuration = sessionDuration;

      const breathingInterval = setInterval(() => {
        setBreathingText((prev) =>
          prev.startsWith("Inhale") ? "Exhale slowly..." : "Inhale gently..."
        );
      }, 4000);

      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, totalDuration - elapsed);
        setSecondsRemaining(remaining);
        if (remaining <= 0) {
          clearInterval(timerInterval);
          clearInterval(breathingInterval);
          handleNext();
        }
      }, 250);

      return () => {
        clearInterval(breathingInterval);
        clearInterval(timerInterval);
      };
    }
  }, [stage.type, sessionDuration, handleNext]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStageIdx]);

  const handleSelectOption = (optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [stage.id]: [optionId],
    }));
  };

  const currentSelection = selectedOptions[stage.id] || [];

  // Formatted timer MM:SS
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Intentional progressive atmosphere & milestone prompts across the 5 minutes
  const progressPercent = sessionDuration > 0 ? (sessionDuration - secondsRemaining) / sessionDuration : 0;
  
  let atmosphericMessage = "Listen to the gentle rainfall outside. Your mind does not have to solve anything right now.";
  let glowColor = "from-teal-500/20 via-cyan-500/30 to-emerald-500/20";
  
  if (progressPercent < 0.2) {
    atmosphericMessage = "Arriving in this quiet room. Let your shoulders drop and let the day soften.";
    glowColor = "from-teal-500/20 via-cyan-500/30 to-emerald-500/20";
  } else if (progressPercent < 0.4) {
    atmosphericMessage = "Listen to the gentle rainfall outside. Your mind does not have to solve anything right now.";
    glowColor = "from-cyan-500/20 via-blue-500/30 to-teal-500/20";
  } else if (progressPercent < 0.6) {
    atmosphericMessage = "No deadlines, no items to purchase, nothing to produce. Just this peaceful breath.";
    glowColor = "from-blue-500/20 via-indigo-500/30 to-cyan-500/20";
  } else if (progressPercent < 0.8) {
    atmosphericMessage = "Savoring the luxury of uninterrupted stillness. You own this moment entirely.";
    glowColor = "from-indigo-500/20 via-emerald-500/30 to-teal-500/20";
  } else {
    atmosphericMessage = "Preparing to return to your day, carrying this calm clarity with you.";
    glowColor = "from-emerald-500/20 via-teal-500/30 to-cyan-500/20";
  }

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
              <CloudRain className="w-3.5 h-3.5" />
              <span>Immersive Sanctuary &bull; {experience.title}</span>
            </div>

            {/* Session duration selector */}
            <div className="flex items-center gap-2 mb-6" role="group" aria-label="Session length">
              <button
                type="button"
                onClick={() => {
                  setSessionDuration(300);
                  setSecondsRemaining(300);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  sessionDuration === 300
                    ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold"
                    : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                }`}
                aria-pressed={sessionDuration === 300}
              >
                5 Min Full Rest (Default)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSessionDuration(60);
                  setSecondsRemaining(60);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  sessionDuration === 60
                    ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold"
                    : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                }`}
                aria-pressed={sessionDuration === 60}
              >
                1 Min Quick Reset
              </button>
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
                className={`absolute inset-0 rounded-full bg-gradient-to-tr ${glowColor} blur-2xl transition-colors duration-1000`}
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
                className="w-44 h-44 rounded-full border border-cyan-400/30 bg-zinc-950/60 backdrop-blur-xl flex flex-col items-center justify-center p-4 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
              >
                <Wind className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="text-xs font-mono text-cyan-200 tracking-wider">
                  {breathingText}
                </span>
                <span className="text-sm font-mono font-bold text-zinc-300 mt-1.5" aria-live="polite">
                  {formattedTime}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                  remaining
                </span>
              </motion.div>
            </div>

            <p className="text-zinc-300 text-base mb-6 font-light max-w-md transition-all duration-700">
              {atmosphericMessage}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setMuted(!isMuted)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono hover:bg-white/10 transition-all"
                aria-label={isMuted ? "Unmute ambient rain sound" : "Mute ambient audio"}
              >
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>{isMuted ? "Unmute Rain Ambience" : "Mute Audio"}</span>
              </button>
            </div>

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
